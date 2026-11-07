// Usage: node scripts/download-process-poster.mjs YOUTUBE_ID portrait|landscape
// Uses the Sharp image processor already installed with Next.js.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const [id, format] = process.argv.slice(2);
if (!/^[\w-]{11}$/.test(id ?? "") || !["portrait", "landscape"].includes(format)) {
  throw new Error("Usage: node scripts/download-process-poster.mjs YOUTUBE_ID portrait|landscape");
}

const response = await fetch(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
if (!response.ok) throw new Error(`YouTube thumbnail returned ${response.status}`);

const folder = new URL("../public/images/process/youtube/", import.meta.url);
await mkdir(folder, { recursive: true });
const portrait = format === "portrait";
await sharp(Buffer.from(await response.arrayBuffer()))
  .resize(portrait ? 202 : 480, portrait ? 360 : 270, { fit: "cover" })
  .webp({ quality: 85 })
  .toFile(fileURLToPath(new URL(`${id}.webp`, folder)));

console.log(`Saved public/images/process/youtube/${id}.webp`);
