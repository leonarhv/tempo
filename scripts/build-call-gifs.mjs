import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// Assemble the six-frame sheets created with imagegen. No network requests.
const variants = [
  { slug: "wave-glasses", rest: 1.1, pose: 0.16 },
  { slug: "smile-curly", rest: 1.5, pose: 0.2 },
  { slug: "smile-freckles", rest: 1.9, pose: 0.22 },
];

function ffmpeg(args) {
  const result = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    { encoding: "utf8" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || "ffmpeg failed");
}

const output = resolve("public/images/call");
mkdirSync(output, { recursive: true });

const selected = new Set(process.argv.slice(2));
for (const { slug, rest, pose } of variants.filter(
  (variant) => selected.size === 0 || selected.has(variant.slug),
)) {
  const frames = mkdtempSync(join(tmpdir(), "tempo-call-"));
  try {
    const source = resolve("assets/call-sources", `${slug}.png`);
    ffmpeg([
      "-loop",
      "1",
      "-framerate",
      "1",
      "-i",
      source,
      "-frames:v",
      "6",
      "-vf",
      "crop=w=iw/3:h=ih/2:x=mod(n\\,3)*iw/3:y=floor(n/3)*ih/2,crop=iw-4:ih-4:2:2,scale=360:360:flags=lanczos",
      join(frames, "%02d.png"),
    ]);
    const order = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];
    const list = ["ffconcat version 1.0"];
    for (const [index, frame] of order.entries()) {
      list.push(`file '${String(frame).padStart(2, "0")}.png'`);
      list.push(
        `duration ${index === 0 ? rest : frame === 6 ? pose * 2 : pose}`,
      );
    }
    list.push("file '01.png'");
    const playlist = join(frames, "loop.ffconcat");
    writeFileSync(playlist, list.join("\n"));
    ffmpeg([
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      playlist,
      "-filter_complex",
      "fps=12,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3:diff_mode=rectangle",
      "-loop",
      "0",
      join(output, `${slug}.gif`),
    ]);
    ffmpeg([
      "-i",
      join(frames, "01.png"),
      "-frames:v",
      "1",
      join(output, `${slug}-poster.png`),
    ]);
    process.stdout.write(`Built ${slug}.gif and its still poster\n`);
  } finally {
    rmSync(frames, { recursive: true, force: true });
  }
}
