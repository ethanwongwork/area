# Desktop app speed, 2026-10-29

The owner: "the electron app is a bit laggy/slow". Measured, profiled and partly fixed. Nothing renders differently.

## How it was measured

Each script runs a built renderer (`apps/desktop/dist`) in a hidden Electron window with its own in-memory session (it
never reads or writes the app's saved settings or systems), background throttling off, and no debugging port.

- `time-pages.cjs`: from a hash change until the page commits (the app rewrites an old link to its place's own hash in an
  effect after rendering), then a forced layout. Three rounds per page; one Inspector setting flipped four times.
- `profile-page.cjs`: Chromium's CPU profile of one page switch through `webContents.debugger`, by function and line
  (build with `DEV=1 node build-renderer.mjs …` to keep names).
- `probe.cjs` with `probe-insert.js`: the Canvas's content taken out and put back, with groups of CSS rules removed in turn,
  to find which rules make elements slow to arrive. With `probe-geometry.js`: every chrome element's box, font size and line
  height, to compare two builds. `STORE='{"canvas":{"type":"15",…}}'` starts from saved settings.

```sh
npm run build -w @area/desktop
node_modules/electron/dist/Electron.app/Contents/MacOS/Electron docs/research/desktop-perf-2026-10-29/time-pages.cjs now="$PWD/apps/desktop/dist"
```

## What was slow

A page switch is a first layout of everything the page mounts, paid by whichever code first asks for a box: Segmented's
thumb placement in a layout effect (its `getBoundingClientRect`), or the chat transcript's scroll to its end. Neither is the
cost; the layout is.

The layout was expensive because of **scopes**. Every element carries about 2,060 inherited custom properties (the tokens),
and every element with `data-area-*` attributes is a scope the axis rules re-declare and re-resolve tokens on. The feed's
chrome (tile heads and captions, section titles, the Components overview's labels, the Stage's head, Typography's row heads)
restated the app's type and density on itself (`appScale()`), so it kept the app's scale while the Canvas took the
Inspector's (2026-10-22). Since 2026-10-26 the Canvas body itself carries the app's defaults, so the 360 such scopes on the
Color page (about 270 on the Components overview) restated what each element already inherited.

Re-inserting the Color page's content: 1,924 ms with Area's stylesheet, 18 ms without it, 602 ms without the rules that
select `[data-area-*]`.

## The fix

`src/app-scale.ts` gains `feedScale()`, and `feedScaleWithin()` for chrome inside a tile frame that is a setting's own scope
or a painted specimen: the attributes only where the scale around differs, tracked by `InheritedScaleContext` (`<html>`'s,
the Canvas body's, and unknown inside a family's tabs, whose text is the tabs' UI size). The feed's repeated chrome uses
it. `appScale()` stays where a type scope's text reset to `text-md` (`packages/styles/src/base.css`) is what is drawn: the
Canvas header's controls and breadcrumbs, Setup's stage controls, a family's tabs and what is in them.

No visual change: every chrome element's box, font size and line height match `main` on Color, Color › Blue, Patterns, a
pattern, Components, Button's Stage, Typography, Icons, Themes, Foundations › Size, New theme and Materials, with the
defaults and with type 15 / density 36 saved (`probe-geometry.js`).

## Before and after (production builds, median of three, ms)

| Page | main | fixed |
|---|---|---|
| Foundations › Color | 2,154 | 889 |
| Patterns | 1,282 | 1,148 |
| Components overview | 441 | 318 |
| Themes | 312 | 322 |
| Typography, Icons | 124 | 123–132 |
| A family's Stage | 113 | 110 |
| One Inspector setting | 161 | 208 (noise: 110–280 in both) |

The dev build (`npm run dev`: React's development mode and an inline source map, 43 MB against 10 MB) measured about the
same as production for these steps.

## Still slow, not fixed here

- **Every element inherits about 2,060 custom properties.** Removing the root token block alone saves about 300 ms of the
  Color page's remaining 640 ms re-insert. Fewer emitted tokens, or tokens scoped to the components that read them, is a
  foundation change (`area-foundation-change`), not an app fix.
- **Patterns lays out twice**: about 1.25 s at commit, then about 0.9 s a task later, after the thumbnails' `WidthZoom`
  measures each screen and sets its zoom, which lays all six screens out again. A zoom known before the first layout would
  save most of the second.
- **Fitting tiles restyles the whole Canvas.** `src/gallery/fit.ts` sets type 14 / density 32 on the Canvas to measure and
  then restores it: two restyles of everything under it on the Components page.
- `content-visibility: auto` on Canvas sections saved little (Color 857 → 801 ms), not worth clipping shadows and rings at
  a section's edge.
