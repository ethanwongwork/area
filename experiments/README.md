# Experiments

A gallery of one-off visual experiments: typographic compositions, component
interactions, vector studies, colour, interactive posters and 3D. Each piece is a
single page with its own motion. The gallery itself is plain HTML and CSS: images and
captions in a grid, filtered by kind.

Self-contained (own `package.json`, outside the Area workspaces), so it can move to its
own repository unchanged.

## Run

```bash
npm install
npm run dev          # http://localhost:5190
npm run new -- "Title" Type          # scaffold e/title/ as the next number (DOM)
npm run new -- "Title" 3D three      # scaffold with a three.js canvas
npm run thumbs                       # capture public/thumbs/*.jpg (all)
npm run thumbs 003 005               # only these
npm run build                        # static site in dist/ (relative paths, host anywhere)
```

Clicking a piece in the gallery opens it full screen beside a panel: its number and name, a
short description, its controls (only the few choices still open), and a colophon (typeface,
credits, format). **T** hides the panel, **Esc** goes back to the index, **G** shows every
parameter for work on the piece. A piece opts in with `shell(slug, { viewer: true })` and fills
the panel with `panel.controls(...)` and `panel.details(...)`; its description and colophon live
in `experiments.json`.

Numbering: pieces carry a `number` in the registry (1, 2, 3…); `draft: true` keeps one out of
the gallery. The six first sketches are drafts.

## Layout

```
index.html, gallery.css, gallery.js   the gallery (no framework)
experiments.json                      the registry: slug, title, kind, ratio, thumbnail moment
e/<slug>/                             one experiment: index.html, main.js, style.css
src/shell.js, shell.css               the shared frame: viewer + panel, controls (tweaks.js), lil-gui, ?thumb
fonts/trial/                          your trial fonts (git-ignored; see its README)
public/thumbs/                        gallery stills
scripts/                              new.mjs, thumbs.mjs
```

## Tools

| Need | Use |
|---|---|
| Timelines, easing, stagger, text splitting, drag and throw, SVG morph | [GSAP](https://gsap.com) 3 (all plugins free): `SplitText`, `Draggable`, `InertiaPlugin`, `MorphSVGPlugin`, `Flip` |
| 3D, shaders, glass, refraction | [three.js](https://threejs.org): `MeshPhysicalMaterial` (transmission, dispersion, iridescence), `ShaderMaterial`, addons |
| Live parameters | [lil-gui](https://lil-gui.georgealways.com) via `shell()` |
| Glyph outlines as points (to bend type in a shader) | [opentype.js](https://opentype.js.org) 1.3, reading a Fontsource `.woff` imported with `?url` |
| Open-source variable type | [Fontsource](https://fontsource.org) variable packages, self-hosted (`@fontsource-variable/*`) |
| Trial type | `fonts/trial/` (dev only unless `FONTS_LICENSED=1`) |

Worth adding when a piece needs it: `@theatre/core` (keyframe a scene by hand),
`postprocessing` (bloom, grain, chromatic aberration for three.js), `matter-js`
(2D physics), `@rive-app/canvas` (state-machine animation), `ogl` (minimal WebGL for
shader-only pieces).

## Fonts in use

Open source, variable: Roboto Flex (wdth 25–151, wght 100–1000, opsz, GRAD and more),
Fraunces (opsz, wght, SOFT, WONK), Inter Tight, Bricolage Grotesque (opsz, wdth, wght),
JetBrains Mono.

Open source, static: Instrument Serif (`@fontsource/instrument-serif`).

Trials (drop in `fonts/trial/`): ABC Dinamo, Pangram Pangram, Displaay, Frostype.
Trial licences cover testing and pitching only; buy a web licence before publishing a
piece that uses one.
