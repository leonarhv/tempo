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
  eventual Sympla ticket URL. The Instagram link is the supplied `@cia.alea.t`.
- `components/digital-program.tsx`: sections, responsive menu, photo lightbox,
  ticket buttons, and the invitation shown after the countdown.
- `components/production-team.tsx`: the full responsive roster, with direction
  and assistant direction first, followed by 23 cast members. Names use lorem
  ipsum and portraits are empty photo slots until actual material is supplied.
  Set each member's `name` and `photo` in `productionTeam` to populate the program.
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

## npm registry

The project `.npmrc` explicitly sets `https://registry.npmjs.org/` as the registry.
Keep `package-lock.json` committed and use `npm ci` for reproducible installs.
Check the active registry from this directory with `npm config get registry`.

## References

- [Next.js setup](https://nextjs.org/docs/app/getting-started/installation)
- [Material UI with Next.js](https://mui.com/material-ui/integrations/nextjs/)
