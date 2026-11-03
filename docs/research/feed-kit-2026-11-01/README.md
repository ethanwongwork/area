# Feed Kit artifact (2026-11-01)

Owner: "give me an updated artifact that shows everything from all potential pages, showing type, colors, designs, images,
cards, copy, charts, tables, etc in 1 sample feed. i want to make sure every piece of content that can be shown in pages
across area are consistent and cohesive."

The artifact (https://claude.ai/artifact/3VBMTvWZVke7Qi98gCd2qn, Feed Kit) is Labs › Feed (`#labs/feed`,
`apps/desktop/src/pages/feed-lab.tsx`) captured from the running app, so it shows what the app draws, not a redrawing.

To regenerate after a change to the kit:

1. Build the desktop app and serve it (`npm run preview -w @area/desktop -- --no-electron`, note the port).
2. Capture: `node_modules/electron/dist/Electron.app/Contents/MacOS/Electron docs/research/feed-kit-2026-11-01/capture.cjs
   "http://localhost:<port>/#labs/feed" <scratch>/snapshot.json`. A hidden 1440 × 900 window scrolls the feed and saves the
   Canvas body, the app's settings on `<html>` and the section list. Saved References images are left out (their slots are
   marked `data-kit-art`).
3. Build: `node docs/research/feed-kit-2026-11-01/build.mjs apps/desktop/dist <scratch>/feed-kit.html <scratch>/snapshot.json`.
   It inlines `dist/area.css` and the app's styles (in their `studio` layer; the typeface library's faces left out), embeds
   Geist and Geist Mono, fills the image slots with the drawn art in `art.txt`, re-fits each 1920 × 1080 screen to its card
   (`--af-fit`), and maps the viewer's light / dark onto `data-area-theme`.
4. Publish the file to the artifact's URL.

The snapshot is a still: React state and hover windows don't run in it. The type tester is the exception: its controls
are native inputs that write custom properties, so the build's script wires them (size, weight, width, leading,
tracking, italic, typeface), and the build embeds the Latin files of every library face the snapshot names.
