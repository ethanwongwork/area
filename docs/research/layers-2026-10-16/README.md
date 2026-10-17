# Layers: page and layer tones, 2026-10-16

A setting for the tones of the page, the layers raised on it (cards, menus, dialogs) and the regions recessed
into it (sidebars, wells, table headers), chosen separately for light and dark.

**Built 2026-10-16** (owner: "can you save everything and build it in? should there be more options for layer
contrast?").
- Code:
  - `packages/tokens/src/axes/layers.ts`: the three axes, ground-light, ground-dark and layers.
  - `packages/tokens/src/color/layers.ts`: the model, as numbers and as the CSS that ships.
  - `packages/tokens/src/color/layers.test.ts`: every combination in every neutral; the CSS against the model; the
    defaults against Area as it was.
  - `packages/styles/src/layers.css`: surfaces point control fills at their own ground.
  - The app's Inspector: Light ground, Dark ground and Layers, under Color.
- Layer contrast became one number, 0 (Flat) to 8 with 4 the default, as Elevation is. Each step is light 0.006
  recessed / 0.009 raised, dark 0.015 raised / 0.0075 recessed. The control step is 0.0015 more per step.
- The review page explored four named steps; 4 is its Default and 8 its dark High.
- This folder's model.js and check.mjs are the proposal's record; the shipped model is color/layers.ts.

Review page: https://claude.ai/artifact/5crS7DCaWEBbAjvTXYpJhn. Choices are saved in its database, collection
`layers`, doc `tuning`.

## How it came about

The owner's questions, all on 2026-10-16:
- On the Nav sidebar's gray fill: "maybe surface colors needs its own axis? ... white page surface, or a gray page
  surface, with white containers as the second layer, or just a lighter gray ... all white completely or all single
  tone gray, for dark mode ... blackout #000000 or lighter dark modes".
- Then: "even more granular ... less contrast between the layers".
- Then: "too granular? ... would it export an updated ramp ... is there even a need for a color ramp with specific
  levels?"
- Then: "for black flat, the backplates are not even visible for selected ... make sure that all combinations still
  work ... very high lightness granularity from white, 100% ... 99% 98% ...".

## The model (model.js)

**Two settings per theme.**
- **Ground** is the page's OKLCH lightness.
  - Light: 100 (white) to 90, in 1% steps.
  - Dark: 0 (black), 8 (today's #020202), then 12 to 24 in 2% steps. Below about 12, a 1% step doesn't show on a
    screen.
- **Layer contrast** is Flat, Low, Default or High.
  - Light: recessed regions sit 0 / 0.012 / 0.024 / 0.036 darker than the page. Raised layers lift toward white only
    on a gray page (Carbon's Gray 10, Apple's grouped style).
  - Dark: raised layers sit 0 / 0.03 / 0.06 / 0.12 lighter, recessed ones half that. Below L 0.12, the layers start
    from 0.12.

**Control fills step from the ground they sit on.**
- Light: rest s, hover 1.5 s, pressed or selected 2.125 s darker. These are today's 50 / 75 / 100 on white.
- Dark: rest s lighter but never under L 0.20; hover + s; pressed or selected + 2 s.

**Edges follow the ground.**
- Light: today's distance from white.
- Dark: today's distance from the raised 850, never weaker than today.

**Muted text and control edges hold contrast.** They keep today's #666 / #838383 (light) and #c5c5c5 / #939393 (dark)
wherever those pass. Otherwise they darken (light) or lighten (dark) just enough for 4.5:1 and 3:1 on every layer and
on every field at rest or hover.

**The ramp is unchanged.** Its rungs are too coarse and uneven to tune layers with:
- Near white they sit 0.015, 0.009, 0.012, 0.015 and 0.036 apart in OKLCH L; near black, 0.03 to 0.05.
- They also feed text, borders, fills and every hue's steps.

## Defaults

- **Light 100 + Default** is today exactly for the page, cards, sidebar, fields, edges and text. One difference:
  sidebar row plates step from the sidebar's own tone (#efefef hover and #e6e6e6 selected, where today they are
  #f3f3f3 and #eeeeee).
- **Dark 8 + Default** keeps today's #020202 page and brings cards and sidebars closer: #121212 and #0b0b0b, where
  today they are #1d1d1d and #282828. Today's dark layers sit 0.146 and 0.192 off the page; the references sit 0.018
  to 0.084.

## Evidence

**Product captures.** These were mined from docs/research/captures, plus Cursor's theme files read from its app
bundle.
- ChatGPT: light page #fff; dark #000 shell, #0e0e0e page, #212121 cards.
- Notion: light #fff page, #f9f8f7 sidebar; dark #191919, #202020, #252525.
- Cursor: light chrome #f3f3f3, editor #fcfcfc; dark chrome #141414, editor #181818.
- VS Code Modern: light #fff / #f8f8f8; dark #1f1f1f / #181818.

**Design systems.** Each value is from the package at a pinned version.
- Carbon 11.83: White, Gray 10, Gray 90, Gray 100. Light layers alternate; dark layers get lighter.
- Material 3: surface containers by tone.
- Apple UIKit (via Flutter 3.35): the plain and grouped backgrounds.
- Spectrum 1: light, dark and darkest. Spectrum 2: light and dark.
- Fluent 2: Background1 to 6.
- Primer 11.10: light, dark, dimmed and high contrast.
- Radix 3.3: background and panel.
- Atlassian 20.6: surface, sunken, raised and overlay.

**Pattern.**
- Light: a white page with gray recesses is the norm; Carbon, Apple and Spectrum 1 also offer a gray page.
- Dark: pages fall in three bands, #000, about #111 and about #1d to #26.
- Where page and layer share a tone, every system separates them by a border or a shadow, never tone alone.

## Checks (check.mjs)

The checker runs every ground × contrast, in gray and cool. Each combination must pass all of these:
- body, muted and placeholder text at 4.5:1 on every layer, field and hovered row;
- control edges at 3:1 on every layer and field;
- a visible lightness step (ΔL) for each of:
  - fields: light 0.017, dark 0.035;
  - hover: light 0.009, dark 0.035;
  - selection: light 0.035, dark 0.07;
  - card and menu frames: light 0.03, dark 0.06;
  - the sidebar rule.

Result: 80 of 80 pass.

Run with `node docs/research/layers-2026-10-16/check.mjs`.

## The review page (rebuilt 2026-10-17 on the shipped scale)

`node docs/research/layers-2026-10-16/page/tuner.mjs <out-dir>` after building tokens and styles. The previews are
Area's built CSS driven by the real settings (`data-area-ground-light`, `-ground-dark`, `-layers-light`, `-layers-dark`,
`-neutral`); the
swatches and the matrix come from `packages/tokens/src/color/layers.ts`, checked with layers.test.ts's rules (180 of
180 pass in each neutral). A headless check found the previews equal to the model (one value off by a rounding unit).
Picks are saved to collection `layers`, doc `picks` (`light`, `dark`, `layers` (light), `layersDark`, `neutral`,
`notes`).

**2026-10-17, owner: "save all the layer picks for the most possible customization".** Every option stays (11 light
grounds, 9 dark grounds, contrast 0–8), and layer contrast is now one setting per theme: `layers-light` and
`layers-dark` (they were one `layers`). Each theme's formulas read only its own; layers.test.ts evaluates the CSS with
the other theme's contrast set differently. The app restores a saved `layers` as both. Defaults unchanged.
