# Draft asset notes

## Visual direction

The supplied identity guides the design: deep blue ink `#282452`, lavender
`#d8d1e9`, pale lilac `#eeebf5`, paper `#f7f5fb`, and muted writing `#68647e`.
The layout follows a scrapbook: original lettering, one taped rehearsal print,
open synopsis columns, a video-call-style team grid, and rehearsal photographs.
Cormorant Garamond is the display face, Manrope the body face, and Caveat the
handwritten annotations. There are no animated section reveals.

## Images

- `public/images/tempo-og.jpg`: an unchanged copy of the supplied root image
  `Sonhar com Você - André Haidamus.jpg` (958 × 635). It is used for Open Graph and
  Twitter Card previews. No AI generation, cropping, or recompression was applied.

- `public/images/tempo-header.svg`: cropped from the user's `Design A4.svg`.
  The A4 canvas and white cover shapes were removed, with an SVG mask and clip
  preserving only the original Tempo lettering on a transparent background.
  The viewBox fits the lettering, including its descender, with a two-unit margin.

- `public/images/tempo-identity.png`: the user's original screenshot, copied
  unchanged. CSS uses blurred copies as background texture.
- `public/images/tempo-lettering.png`: a transparent lettering derivative of the
  supplied identity, made with the built-in imagegen tool. The original screenshot
  remains available; the derivative should be replaced with the original logo
  export when available.
- `public/images/theater-contact-sheet.png`: generated using the built-in imagegen
  tool for this prototype. It contains six fictional portraits and three fictional
  rehearsal photographs. Retained as a draft source; no longer displayed on the page.
- `public/images/process/`: five real production photographs copied unchanged from
  the user's `temp/` folder, with descriptive filenames. The first group rehearsal
  photo also replaces the illustrative hero photograph. Their original colors
  and framing are preserved.
- `public/images/process/youtube/`: local WebP covers for the 16 supplied YouTube
  videos and Shorts, downloaded from each video's public YouTube thumbnail.
  Landscape covers remove the thumbnail's top/bottom letterboxing; Shorts use
  the central portrait area. Playback uses the original, unmodified YouTube videos.
  `scripts/download-process-poster.mjs` prepares a cover for a new video.
- `public/images/call/`: three illustrative looping GIFs and their still posters,
  repeated across the roster. The people are fictional placeholders. The image
  sequences were created with built-in imagegen and assembled locally with FFmpeg.
  Sources are preserved in `assets/call-sources/`; `scripts/build-call-gifs.mjs`
  reproduces the GIFs without any network or generation calls.
- `components/sympla-logo.tsx`: reuses the existing Sympla vector path from the
  neighboring `mostra-macunaima` project.

### Lettering extraction prompt

Use case: background-extraction. Asset type: transparent original lettering
cutout for the user's theater digital program. Edit target: supplied visual
identity screenshot. Extract ONLY the dark navy calligraphic central logo and
title lettering that reads Tempo (Essa Noite Eu Vou Sonhar Com Você). Retain the
exact distinctive hand-drawn letterforms, swooshes, strokes, relative placements,
and dark navy ink color from the source as faithfully as possible. Remove all
lavender photographic paper background, pale ghost text, left event details, thin
vertical black panel dividers, surrounding stickers, bottom torn paper, and every
other element. Output a clean high-resolution transparent PNG of just the complete
central navy wordmark and subtitle, all flourishes preserved without clipping.
Use a portrait-ish composition closely fitting the full lettering with a small
transparent margin. Do not rebrand, redesign, typeset, add letters, change words,
add shadows, or add decorative elements. Genuine alpha transparency behind the ink.

### Contact sheet generation prompt

Use case: photorealistic-natural. Create ONE square photographic contact sheet
asset for a local theater digital-program design prototype, an exact 3 by 3 grid
of 9 equally sized square photographs, with NO borders, NO gutters, NO lettering,
NO watermark, NO graphic overlays. All photography candid expressive
black-and-white analog 35mm with fine film grain, rich soft blacks, intimate
rehearsal studio atmosphere, real skin texture, not glossy fashion. First row:
three separate natural head-and-shoulder portraits of different fictional
Brazilian young adult theater performers: woman with shoulder-length dark curly
hair, man with short textured dark hair, woman with short straight dark bob.
Second row: three separate portraits: man with longer loose curly hair, woman
with short natural afro, man with closely cropped hair. Portrait subjects wear
plain dark rehearsal clothes, facing camera, warm subtle expressions, clean
medium gray background, full head visible and centered in each square, varied
skin tones. Third row: three different candid theater-rehearsal process
photographs in a black-box theater with wood floor: left square ensemble of six
actors moving together in a physical-theater exercise under a diagonal shaft of
stage light, center square intimate close-up of hands holding an annotated
printed theater script with a chair blurred in background, right square two
actors rehearsing an emotional scene on a bare stage with a single chair. The
grid boundaries must be exactly at one-third and two-thirds, nine equally sized
photos filling the whole image. This is illustrative prototype imagery, not real
cast documentation.

## Call animation prompts

Only three generated people are used:

- `wave-glasses`: Brazilian man in his forties, medium brown skin, short dark hair
  graying at the temples, beard, round glasses, charcoal shirt; a small hand wave.
- `smile-curly`: Brazilian woman in her thirties, medium brown skin, shoulder-length
  dark curls, plum shirt; neutral expression gradually becoming a friendly smile.
- `smile-freckles`: Brazilian woman in her thirties, light freckled skin,
  auburn wavy hair, slate-blue shirt; neutral expression becoming a warm smile.

Common imagegen prompt: photorealistic-natural, one landscape 3:2 sprite sheet,
exactly three columns and two rows of square frames, with no borders, margins,
text, numbers, logos, or UI. Every frame shows the same fictional person in an
identical centered chest-up webcam composition, consistent face, clothing, room,
lighting, and camera. Soft daylight and a blurred lavender-gray wall. Frames read
left to right, top row then bottom row. For waving: hands down, raising a hand,
palm tilted left, tilted right, left again, then centered. For smiling: neutral,
slight smile, closed-mouth smile, warmer smile, small amount of teeth, brighter
smile. Avoid identity changes, head movement, cropped hands, or extra fingers.
The loops reverse these generated frames and use different neutral pauses.

## Fonts

Fonts are bundled in `public/fonts/`, loaded using `next/font/local`, and require
no browser requests to Google. The files come from the official Google Fonts
repository and retain their SIL Open Font License texts in the same directory:

- Cormorant Garamond: `OFL-cormorant-garamond.txt`
- Manrope: `OFL-manrope.txt`
- Caveat: `OFL-caveat.txt`
