---
name: area-illustration
description: Draws, changes or reviews Area figures in the style of the screens, Area's real React components laid out as real UI with words drawn as light rounded bars (buttons and badges as colour alone): desktop and phone screens, component vignettes, a gallery of every component family, and theme settings shown on the screen that shows them best. Use for a setting's picture, an empty state, onboarding, a screen illustration (dashboard, product page, gallery, chat…) or a gallery of UI, or when the figure style changes.
argument-hint: "[setting id, component or screen]"
---

# Area figures

An Area figure is Area's own UI, not a drawing of it. It is composed from `@area/react` and
the app's demos, rendered to markup with every word wrapped, and drawn by one stylesheet
(`engine/abstract.css`) in one of four ways. **Line** is the house style (owner, 2026-11-04; `style.md`), shown in the
app's Illustrations page (`apps/desktop/src/pages/illustrations.tsx`, under the system's Foundations):

- **Line**: Area's components as a technical line drawing: one ink, one 1px line, words as rules, headings outlined,
  pictures as a box with a cross, no fills or shadows (`engine/line.js` marks the parts first).

- **Bars** (the default): every word is a rounded bar its own width and the height of its
  ink, in its own colour at 20%. A button, badge, chip or count keeps only its colour.
  Edges, fills, corners, icons, shadows and states are Area's own.
- **Real**: the components as they are (for settings whose subject is the text's colour).
- **Shapes**: words and icons go.

Everything is in the style of the screens (owner, 2026-10-24: "i like the screens designs ... recreate the other
visuals in that same style ... a full gallery of all types of ui"). That means real UI made of Area's components,
drawn at Area's own size and scaled down as a whole, one scale per kind of frame:

- **Screens**: 14 desktop screens (1024 × 576) and 6 iPhone screens (390 × 844, at type 16 and density 36).
- **Vignettes**: 16 components in context (480 × 360).
- **Compositions**: 5 grids of 4 to 6 parts the same width, two columns, no containers, each showing one theme setting
  as its visual (Accent, Strokes, Corners, States, Status; `figures/compositions.jsx`). They follow the page's Theme,
  Neutral and Accent.
- **Gallery**: every component family (119), one specimen each from the app's gallery (`COMPONENT_PAGES`,
  `componentSpecimens`, the demo registry), in a 480 × 360 frame (owner, 2026-10-24: "1 of each component in most
  cases ... 2 if absolutely necessary"). `SHOW` names the exceptions: a few variants where they are the point, close
  together in a row (avatars, chips, presence), a column (badges) or a tight grid (tags); a pair (two overlapping
  menus); a better single specimen where the first is too faint or plain (a button with its icon); a figure of the
  skill's own (`node`: a message whose words fill the column); or a bleed (the drawer fills the right side, the
  titlebar the width). Every tile and vignette is centred on what it paints, with wide margins (round 7); strokes
  hold 0.75px drawn and small components grow up to 1.8× (round 8).
- **Settings**: each option on the desktop screen, phone screen or vignette that shows it best, holding the state
  it needs (hover, focus, an open menu); Danger hover, Motion and Easing on vignettes of their own.

The review page and its saved marks are in `docs/research/area-figures-2026-10-24` (README). Read them
(collections `gallery` for flags, `axes`, `round2`) before changing figures.

## Files

| File | What it holds |
|---|---|
| `style.md` | The three drawings, the bar's measure, the page, staging and scale, forced states, the look. |
| `rules.md` | The rules. A figure that breaks one isn't finished. |
| `concepts.md` | From a setting to a figure; the screens. |
| `engine/abstract.css` | Bars and Shapes, forced states, the pointer, ghost thumbs. |
| `engine/markup.js` | `wrapText`, `blankImages`, `figureMarkup`: words as span.tx and images as blanks, shared with the app's Setup stage (`apps/desktop/src/setup-screen.tsx`). |
| `engine/line.js` | `markLines`: the Line drawing's pass (which parts are edges, outlines, tones, dots, pictures, headings). An ES module the app imports; the bench inlines it. |
| `engine/stage.js` | `AFS.stage`: frames markup at a fidelity under a scope, holds states, scales it, places the pointer and ghosts. |
| `figures/compositions.jsx` | `COMPOSITIONS`: grids of 4 to 6 similarly sized components, each showing one thing. Add one per theme setting: 4 to 6 parts 200 wide in `Frame`, no containers. |
| `figures/index.jsx` | `KINDS` (the gallery's kinds of UI), `SHOW` (the few families shown as a grid, a pair or another specimen), `VIGNETTES`, `SETTINGS`; `render()` renders screens, gallery, settings. |
| `figures/screens.jsx`, `screens.css` | 14 desktop screens, 6 phone screens, 16 component vignettes (round 12 of the choice-illustrations review). |
| `build.mjs` | `renderFigures()` and `assets()` for pages that show figures; `node build.mjs <dir> [--only id,…]` writes a bench. |

## Steps

1. **Compose.** A new screen or vignette goes in `figures/screens.jsx` (one of its two desktop shells, the iPhone
   shell, or `Iso`). It is built only from Area's components, after measured product references
   (`docs/research/app-screens-2026-10-21.md`). Mark what a setting may hold with `data-st` (hover, press, focus,
   lift, selected, menu). A new component family appears in the gallery by itself once the app has its page and
   specimens, as its first specimen; give it a kind in `KINDS`, and add it to `SHOW` only if one specimen can't
   show it (at most six in a grid, two in a pair). Copy follows the placeholder vocabulary (`docs/DESIGN_SYSTEM.md`, Example
   copy); the person is David Tee.
2. **Place a setting.** An entry in `SETTINGS`: `S(id, group, need, show, shows, { desktop, mobile, isolated } | {
   vignette }, { scope, attr, states, fidelity })`. Pick the screen where the token shows most. `scope` adds what an
   option needs in order to show (Light tint 8 for Tint hue). Use `fidelity: "real"` only when the text's colour is
   the subject.
3. **Render and look.** In the app: System › Foundations › Illustrations (Drawing menu in the Canvas bar). For a bench:
   `npm run build` once (Area's CSS and the packages' dist), then
   `node .claude/skills/area-illustration/build.mjs <scratch-dir> [--only id,…] [--fidelity line]`. Serve the folder and open it in
   the app's browser pane, showing the pane first. Check light and dark against `style.md`'s "The look".
4. **Hand over.** Rebuild the review page (`docs/research/area-figures-2026-10-24/build.mjs`) and republish it to
   the same file path. Say what was added and anything not checked.

The app's Setup stage uses this engine for its product screen (`apps/desktop/src/setup-screen.tsx`; the build copies
`engine/abstract.css` to `dist/styles/figures.css`), so a change to the engine shows there too. The app's own setting
pictures are `apps/desktop/src/choice-figures.tsx`. Porting a kept
figure there is app work that follows the owner's picks.

## What goes wrong

| If you catch yourself | Do this instead |
|---|---|
| redrawing a component in divs and CSS | render the real one; the abstraction is only abstract.css |
| a label with no shapes, or one bar over a whole sentence | every word is wrapped (`wrapText`); fields get theirs from `fieldText` in stage.js |
| a number drawn as one bar | numbers split into digits (`tx--d`); give an empty field a value (`SHOW`) so its numerals show |
| scaling one figure up to fill its frame | one scale per kind of frame; only what doesn't fit shrinks |
| a tile full of variants | one specimen; a few close together (row, column, tight grid) only where the variants are the point |
| a figure off centre, or centred on an empty wrapper | `center` in `AFS.stage` centres on painted bounds; list a new wrapper in `WRAP` |
| strokes fading or varying with size | figures zoom (`.af-zoom`) and set the stroke tokens to 1.04px ÷ zoom; never scale with a transform or hard-code a border |
| a setting's screen staged differently from Screens | stage both with the page's `stageFrame` |
| a tile that looks empty (a progress bar, a skeleton) | a bar that takes its container's width needs one in a tile (abstract.css) |
| a specimen too faint to read alone (a ghost icon) | pick a better one of the family's own in `SHOW` |
| page styles leaking into a figure (blue links, margins) | scope page rules with `:not(.af-stage *)` |
| a broken image in a figure | images are blank media blocks (`blankImages`); don't link app images |
| a Line part that vanished (a row's plate, a thumb) | it painted by a fill or pseudo-element line.js didn't read; mark it there, never by hand in a figure |
| a whole screen gone grey in Line | a large strong fill took the tone; the tone is for control-sized parts (line.js) |
| typing a dimension | a sheet's numbers are measured from the drawing (illustrations.tsx, annotate) |
| an overlay drawn closed (only its trigger: a context menu's area, a hover card's link) | show it open: its open specimen in `SHOW` (`ids`), `open: true` where its surface is in the markup (abstract.css `.af-open` draws the popover under its trigger), or a `node` of the real surface at the pointer |
| words run together in a flex heading ("Onthispage") | a run of words is one `span.tx-run` (markup.js), so a flex parent keeps its spaces; don't split runs into loose spans |
| inventing copy | the placeholder vocabulary: Title, Description, Body text, Label, Item one, Button, Action |
