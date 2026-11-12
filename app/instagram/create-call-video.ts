import { decompressFrame, parseGIF, type ParsedFrame } from "gifuct-js";
import { BufferTarget, canEncodeVideo, CanvasSource, Mp4OutputFormat, Output, Quality } from "mediabunny";
import type { ProductionMember } from "@/lib/program";
import { getPortrait, type CallLayout } from "./call-layout";

const frameRate = 30;
const exportWidth = 1080;

function canvasContext(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
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
  return { ...portrait, frameAt: () => image };
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

export async function createCallVideo(
  { width, height, tiles, featured }: CallLayout,
  cast: ProductionMember[],
  svg: SVGSVGElement,
  { seconds, signal, onProgress }: {
    seconds: number;
    signal: AbortSignal;
    onProgress: (progress: number) => void;
  },
) {
  const scale = exportWidth / width;
  const exportHeight = Math.round(height * scale);
  const codec = "avc";
  const quality = new Quality({ bitrate: 8_000_000 });
  if (!await canEncodeVideo(codec, { width: exportWidth, height: exportHeight, frameRate, quality })) return null;
  signal.throwIfAborted();

  const [overlay, tracks] = await Promise.all([
    loadArtwork(svg, exportWidth, exportHeight),
    Promise.all(cast.map((person, index) => loadTrack(person, tiles[index], featured))),
  ]);
  const portraits = tracks.filter((track) => track !== undefined);
  signal.throwIfAborted();
  const context = canvasContext(exportWidth, exportHeight);
  context.scale(scale, scale);
  context.imageSmoothingQuality = "high";
  const animated = cast.some(({ animation }) => animation);

  function renderFrame(time: number) {
    context.fillStyle = "#3c3749";
    context.fillRect(0, 0, width, height);
    for (const { box, frameAt, verticalPosition } of portraits) {
      drawPortrait(context, frameAt(time), box, verticalPosition);
    }
    context.drawImage(overlay, 0, 0, width, height);
  }

  const target = new BufferTarget();
  const output = new Output({ format: new Mp4OutputFormat(), target });
  const video = new CanvasSource(context.canvas, { codec, quality });
  output.addVideoTrack(video, { frameRate });

  try {
    await output.start();
    const frameCount = seconds * frameRate;
    for (let frame = 0; frame < frameCount; frame += 1) {
      signal.throwIfAborted();
      const timestamp = frame / frameRate;
      if (animated || frame === 0) renderFrame(timestamp * 1000);
      await video.add(timestamp, 1 / frameRate);

      if (frame % 10 === 0) {
        onProgress((frame + 1) / frameCount);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    signal.throwIfAborted();
    await output.finalize();
    if (!target.buffer) throw new Error("Vídeo vazio");
    return new Blob([target.buffer], { type: "video/mp4" });
  } catch (error) {
    await output.cancel();
    throw error;
  }
}
