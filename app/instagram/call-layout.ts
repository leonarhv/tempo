import type { ProductionMember } from "@/lib/program";

export type Group = "cast" | "direction";

type Rectangle = { x: number; y: number; width: number; height: number };

export const formats = {
  stories: { label: "Stories", ratio: "9:16", height: 1280, columns: 1 },
  feed: { label: "Feed", ratio: "1:1", height: 720, columns: 2 },
} as const;

export type Format = keyof typeof formats;

export function getCallLayout(format: Format, group: Group) {
  const { height, columns } = formats[format];
  const width = 720;
  const padding = 20;
  const headingHeight = 48;
  const gap = 14;
  const contentWidth = width - 2 * padding;
  const contentHeight = height - 2 * padding - headingHeight;
  const tileWidth = (contentWidth - (columns - 1) * gap) / columns;
  const tileHeight = (contentHeight - gap) / 2;
  const featured = group === "direction";
  const x = padding;
  const y = padding + headingHeight;

  let tiles: Rectangle[];
  if (featured && format === "feed") {
    const leadWidth = Math.round((contentWidth - gap) * 2 / 3);
    const sideWidth = contentWidth - leadWidth - gap;
    const sideHeight = (contentHeight - gap) / 2;
    tiles = [
      { x, y, width: leadWidth, height: contentHeight },
      { x: x + leadWidth + gap, y, width: sideWidth, height: sideHeight },
      { x: x + leadWidth + gap, y: y + sideHeight + gap, width: sideWidth, height: sideHeight },
    ];
  } else if (featured) {
    const leadHeight = Math.round(contentHeight * 0.4);
    const sideHeight = (contentHeight - leadHeight - 2 * gap) / 2;
    tiles = [
      { x, y, width: contentWidth, height: leadHeight },
      { x, y: y + leadHeight + gap, width: contentWidth, height: sideHeight },
      { x, y: y + leadHeight + sideHeight + 2 * gap, width: contentWidth, height: sideHeight },
    ];
  } else {
    tiles = Array.from({ length: columns * 2 }, (_, index) => ({
      x: x + (index % columns) * (tileWidth + gap),
      y: y + Math.floor(index / columns) * (tileHeight + gap),
      width: tileWidth,
      height: tileHeight,
    }));
  }

  return {
    width,
    height,
    heading: { x, y: padding },
    featured,
    tiles,
  };
}

export type CallLayout = ReturnType<typeof getCallLayout>;

export function getAvatar(tile: Rectangle, featured: boolean) {
  const size = Math.min(tile.width * (featured ? 0.29 : 0.39), tile.height * 0.51);
  return { x: tile.x + (tile.width - size) / 2, y: tile.y + (tile.height - size) / 2 - 12, width: size, height: size };
}

export function getPortrait(person: ProductionMember, tile: Rectangle, featured: boolean) {
  if (person.animation) return { src: person.animation.src, box: tile, verticalPosition: 0.5 };
  if (person.photo) return { src: person.photo, box: getAvatar(tile, featured), verticalPosition: 0.4 };
  return undefined;
}
