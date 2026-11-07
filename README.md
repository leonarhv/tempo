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

- `lib/program.ts`: synopsis, the 25-person roster, rehearsal captions, Instagram, and the
  eventual Sympla ticket URL. All Instagram entries offer both `@cia.alea.t` and
  `@gatopingado_coletivo`, configured together in `program.instagrams`.
- `components/digital-program.tsx`: sections, responsive menu, photo lightbox,
  ticket buttons, and the invitation shown after the countdown.
- `components/production-team.tsx`: a video-call-inspired roster, with two larger
  tiles for direction and assistant direction above the 23-person cast grid.
  Names use lorem ipsum. Three illustrative GIFs are reused across the roster,
  with different loop lengths. The call header can pause all movements; reduced
  motion preferences show still posters. Real `photo` values take precedence.
  Set each member's `name` and `photo` in `productionTeam` to populate the program.
- `lib/call-animations.ts`: the three local animation assets and their stills.
  Rebuild them from the generated sheets with `node scripts/build-call-gifs.mjs`
  (requires FFmpeg). No additional image generation is needed.
- `components/seven-minute-timer.tsx`: the fixed seven-minute countdown. It resets
  on page reload, uses elapsed wall-clock time to catch up after tab changes, and
  stops at `00:00`. Clicking the round clock enlarges it in the center of the
  screen; X or Escape minimizes it without resetting the countdown. No countdown
  state is persisted.
- `app/globals.css`: lavender paper palette, collage layout, and responsive styles.
- `components/theme-registry.tsx`: Material UI theme.

The `@/*` import alias resolves from the project root. No database, authentication,
analytics, remote image service, or API is configured.
Until `ticketUrl` is supplied, the blue Sympla button reads **Ingressos em breve**
and is disabled. Ticket buttons appear in the header and beside the dates and venue.
After seven minutes, a dismissible invitation opens once per page visit. If a
photo is open, the invitation waits until the photo dialog is closed. The same
Sympla URL enables the invitation's ticket button when sales are available.

The supplied poster is preserved unchanged, with a transparent lettering derivative
used in the hero. Dates, times, and venue follow that
artwork. Editorial copy and cast names use lorem ipsum. The generated photographs
are explicitly illustrative and should be replaced before publication. See [asset notes](docs/assets.md)
for the image generation prompt and font licenses.

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
