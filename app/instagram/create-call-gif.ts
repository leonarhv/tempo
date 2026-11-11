import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { decompressFrame, parseGIF, type ParsedFrame } from "gifuct-js";
import type { ProductionMember } from "@/lib/program";
import { getPortrait, type CallLayout } from "./call-layout";

const frameDelay = 80;
const paletteSamples = 5;
const exportWidth = 1080;

function canvasContext(width: number, height: number, willReadFrequently = false) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently });
  if (!context) throw new Error("Canvas indisponível");
  return context;
}

async function fetchAsset(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Falha ao carregar ${url}`);
  return response;
}

async function loadImage(url: string) {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

async function loadArtwork(svg: SVGSVGElement, width: number, height: number) {
  const font = await (await fetchAsset("/fonts/manrope.ttf")).blob();
  const fontUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(font);
  });

  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `@font-face { font-family: Manrope; src: url(${fontUrl}) format('truetype'); font-weight: 200 800; }`;
  svg.prepend(style);
  svg.style.fontFamily = "Manrope, Arial, sans-serif";
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));

  const markup = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
  try {
    const image = await loadImage(url);
    const overlay = canvasContext(width, height);
    overlay.drawImage(image, 0, 0);
    return overlay.canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function loadAnimation(src: string) {
  const gif = parseGIF(await (await fetchAsset(src)).arrayBuffer());
  const frames = gif.frames.filter((frame) => "image" in frame);
  const delays = frames.map(({ gce }) => (gce?.delay > 1 ? gce.delay * 10 : 100));
  const duration = delays.reduce((total, delay) => total + delay, 0);
  if (!duration) throw new Error(`GIF sem quadros em ${src}`);

  const context = canvasContext(gif.lsd.width, gif.lsd.height);
  const patch = canvasContext(1, 1);
  let current: ParsedFrame | undefined;
  let restore: ImageData | undefined;
  let index = 0;
  let endTime = 0;
  let previousElapsed = 0;

  return {
    duration,
    frameAt(elapsed: number) {
      const time = elapsed % duration;
      if (elapsed < previousElapsed || Math.floor(elapsed / duration) !== Math.floor(previousElapsed / duration)) {
        context.clearRect(0, 0, gif.lsd.width, gif.lsd.height);
        current = undefined;
        restore = undefined;
        index = 0;
        endTime = 0;
      }
      previousElapsed = elapsed;

      while (time >= endTime && index < frames.length) {
        // GIF frames may be transparent patches over the preceding image.
        if (current?.disposalType === 2) {
          const { left, top, width, height } = current.dims;
          context.clearRect(left, top, width, height);
        } else if (current?.disposalType === 3 && restore) {
          context.putImageData(restore, current.dims.left, current.dims.top);
        }

        current = decompressFrame(frames[index], gif.gct, true);
        const { left, top, width, height } = current.dims;
        restore = current.disposalType === 3 ? context.getImageData(left, top, width, height) : undefined;
        patch.canvas.width = width;
        patch.canvas.height = height;
        const pixels = patch.createImageData(width, height);
        pixels.data.set(current.patch);
        patch.putImageData(pixels, 0, 0);
        context.drawImage(patch.canvas, left, top);
        endTime += delays[index];
        index += 1;
      }
      return context.canvas;
    },
  };
}

async function loadTrack(person: ProductionMember, tile: CallLayout["tiles"][number], featured: boolean) {
  const portrait = getPortrait(person, tile, featured);
  if (!portrait) return undefined;
  if (person.animation) return { ...portrait, ...await loadAnimation(portrait.src) };
  const image = await loadImage(portrait.src);
  return { ...portrait, duration: 0, frameAt: () => image };
}

function drawPortrait(
  context: CanvasRenderingContext2D,
  image: HTMLCanvasElement | HTMLImageElement,
  box: CallLayout["tiles"][number],
  verticalPosition: number,
) {
  const scale = Math.max(box.width / image.width, box.height / image.height);
  const cropWidth = box.width / scale;
  const cropHeight = box.height / scale;
  context.drawImage(
    image,
    (image.width - cropWidth) / 2, (image.height - cropHeight) * verticalPosition, cropWidth, cropHeight,
    box.x, box.y, box.width, box.height,
  );
}

export async function createCallGif(
  { width, height, tiles, featured }: CallLayout,
  cast: ProductionMember[],
  svg: SVGSVGElement,
  onProgress: (progress: number) => void,
) {
  const scale = exportWidth / width;
  const exportHeight = Math.round(height * scale);
  const [overlay, tracks] = await Promise.all([
    loadArtwork(svg, exportWidth, exportHeight),
    Promise.all(cast.map((person, index) => loadTrack(person, tiles[index], featured))),
  ]);
  const portraits = tracks.filter((track) => track !== undefined);
  const context = canvasContext(exportWidth, exportHeight, true);
  context.scale(scale, scale);
  context.imageSmoothingQuality = "high";
  const duration = Math.max(0, ...portraits.map((track) => track.duration));

  function renderFrame(time: number) {
    context.clearRect(0, 0, width, height);
    for (const { box, frameAt, verticalPosition } of portraits) {
      context.fillStyle = "#3c3749";
      context.fillRect(box.x, box.y, box.width, box.height);
      drawPortrait(context, frameAt(time), box, verticalPosition);
    }
    context.drawImage(overlay, 0, 0, width, height);
  }

  // Sample the complete scene to keep one palette stable across the loop.
  const sample = canvasContext(width / 6, Math.round(height / 6), true);
  const sampleWidth = sample.canvas.width;
  const sampleHeight = sample.canvas.height;
  const pixelsPerSample = sampleWidth * sampleHeight * 4;
  const sampleCount = duration ? paletteSamples : 1;
  const samples = new Uint8ClampedArray(pixelsPerSample * sampleCount);
  for (let index = 0; index < sampleCount; index += 1) {
    renderFrame((index * duration) / sampleCount);
    sample.drawImage(context.canvas, 0, 0, sampleWidth, sampleHeight);
    samples.set(sample.getImageData(0, 0, sampleWidth, sampleHeight).data, index * pixelsPerSample);
  }

  const frameCount = Math.max(1, Math.ceil(duration / frameDelay));
  const palette = quantize(samples, 255);
  const transparentIndex = palette.length;
  const globalPalette = [...palette, [0, 0, 0]];
  const encoder = GIFEncoder();
  let previous: Uint8Array | undefined;

  for (let frame = 0; frame < frameCount; frame += 1) {
    renderFrame(frame * frameDelay);
    const pixels = context.getImageData(0, 0, exportWidth, exportHeight).data;
    const indexed = applyPalette(pixels, palette);

    // The rounded corners stay transparent, and unchanged pixels reuse the previous frame.
    for (let pixel = 0; pixel < indexed.length; pixel += 1) {
      const color = pixels[pixel * 4 + 3] < 128 ? transparentIndex : indexed[pixel];
      indexed[pixel] = previous?.[pixel] === color ? transparentIndex : color;
      if (previous) previous[pixel] = color;
    }
    if (frame === 0 && frameCount > 1) previous = indexed.slice();

    encoder.writeFrame(indexed, exportWidth, exportHeight, {
      delay: frameDelay,
      palette: frame === 0 ? globalPalette : undefined,
      repeat: 0,
      dispose: 1,
      transparent: true,
      transparentIndex,
    });

    if (frame % 4 === 0) {
      onProgress((frame + 1) / frameCount);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  encoder.finish();
  return new Blob([encoder.bytes()], { type: "image/gif" });
}
