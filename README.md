# Tempo

A frontend draft of the digital program for **Tempo: essa noite eu vou sonhar
com você**, built with Next.js App Router, TypeScript, Material UI, and local assets.

## Getting started

Use Node.js 22 (22.13.0 or newer) and npm 10 or newer:

```sh
nvm use
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Editing the program

- `lib/program.ts`: synopsis, the 25-person roster, Instagram, and the
  eventual Sympla ticket URL. All Instagram entries offer both `@cia.alea.t` and
  `@gatopingado_coletivo`, configured together in `program.instagrams`.
- `components/digital-program.tsx`: sections, responsive menu, media lightbox,
  ticket buttons, and the invitation shown after the countdown.
- `components/production-team.tsx`: a video-call-inspired roster, with two larger
  tiles for direction and assistant direction above the 23-person cast grid.
  Names use lorem ipsum, except Alan Silva. His `pixelated: true` tile displays
  an abstract pixel mosaic and **Conexão ruim**, without loading a photo or GIF,
  even if one is later assigned. Three illustrative GIFs are reused across the roster,
  with different loop lengths. The call header can pause all movements; reduced
  motion preferences show still posters. Real `photo` values take precedence.
  Set each member's `name` and `photo` in `productionTeam` to populate the program.
- `lib/call-animations.ts`: the three local animation assets and their stills.
  Rebuild them from the generated sheets with `node scripts/build-call-gifs.mjs`
  (requires FFmpeg). No additional image generation is needed.
- `lib/process-media.ts`: ordered process gallery, with five supplied photographs,
  seven YouTube videos, and nine Shorts. The first seven entries appear initially;
  **Ver mais do processo** reveals the rest. The hero uses the first real photo.
- `components/process-gallery.tsx`: mixed photo/video mural and viewer. Only local
  covers load in the mural. Opening a video mounts one YouTube privacy-enhanced
  player with autoplay when opened directly or reached through gallery navigation;
  switching media or closing the dialog removes it and stops playback.
  Photos retain their full framing in the viewer. Use the buttons or keyboard
  left/right arrows to move between media, and X or Escape to close.
- `components/seven-minute-timer.tsx`: the fixed seven-minute countdown. It resets
  on page reload, uses elapsed wall-clock time to catch up after tab changes, and
  stops at `00:00`. Clicking the round clock enlarges it in the center of the
  screen; X or Escape minimizes it without resetting the countdown. No countdown
  state is persisted.
- `app/globals.css`: lavender paper palette, collage layout, and responsive styles.
- `components/theme-registry.tsx`: Material UI theme.

The `@/*` import alias resolves from the project root. No database, authentication,
analytics, or API credentials are configured. Videos play through YouTube embeds.
Until `ticketUrl` is supplied, the blue Sympla button reads **Ingressos em breve**
and is disabled. Ticket buttons appear in the header and beside the dates and venue.
After seven minutes, a dismissible invitation opens once per page visit. If a
photo or video is open, the invitation waits until the gallery is closed. The same
Sympla URL enables the invitation's ticket button when sales are available.

The supplied poster is preserved unchanged, with a transparent lettering derivative
used in the hero. Dates, times, and venue follow that
artwork. Editorial copy and cast names use lorem ipsum. The process photographs
are supplied production images; the call avatars remain illustrative. See [asset notes](docs/assets.md)
for the image generation prompt and font licenses.

## Adding process media

Edit `lib/process-media.ts`; the array order controls both the mural and the viewer.
To add a photo, copy it into `public/images/process/` and add a `type: "photo"`
entry with a unique `id`, `title`, `src`, descriptive `alt`, and its actual
`width` and `height`. The `temp/` folder holds originals and is not served by the app.

For a video or Short, add `video("YOUTUBE_ID", "landscape")` or
`video("YOUTUBE_ID", "portrait")`, then download its cover once:

```sh
node scripts/download-process-poster.mjs YOUTUBE_ID portrait
```

Use `landscape` for a horizontal cover. The helper uses the Sharp image processor
installed with Next.js. Include the generated WebP in the repository; the site
does not call the YouTube API or fetch covers at build time. Unlisted videos work
when embedding is allowed in YouTube. Anyone visiting the site can watch them
and access their YouTube links.

## Commands

- `npm run dev`: start the development server.
- `npm run build`: create the production build.
- `npm start`: serve the production build.
- `npm run lint`: run ESLint.
- `npm run typecheck`: generate route types and check TypeScript.

## Social previews

`app/layout.tsx` sets the full play title, performance dates and times, venue,
Open Graph tags, and a Twitter large-image card. The supplied
`Sonhar com Você - André Haidamus.jpg` is served unchanged at
`/images/tempo-og.jpg`, including its original aspect ratio and all lettering.

The canonical URL, `og:url`, `og:image`, and `twitter:image` use the public origin
`https://tempo.nomacu.com` by default. `NEXT_PUBLIC_SITE_URL` can override it before
building if the domain changes; see `.env.example`.
Social crawlers must be able to access the published page and image
without authentication; localhost cannot provide remote link previews.

The page emits metadata in its initial HTML. Each app controls how it displays
and caches a link preview. After updating an already-shared URL, use the platform's
refresh/debug tool if its old preview remains cached.

Reference: [Open Graph protocol](https://ogp.me/).

## npm registry

The project `.npmrc` explicitly sets `https://registry.npmjs.org/` as the registry.
Keep `package-lock.json` committed and use `npm ci` for reproducible installs.
Check the active registry from this directory with `npm config get registry`.

## References

- [Next.js setup](https://nextjs.org/docs/app/getting-started/installation)
- [Material UI with Next.js](https://mui.com/material-ui/integrations/nextjs/)
