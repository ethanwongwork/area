# Custom neutral tint: research and plan (2026-10-22)

Owner, 2026-10-22: "consider an experience where a user might want to customize their entire color experience, rather
than just picking warm, or neutral or cool, they pick the exact shade they want, or they even pick a color shade for the
surface." Then: "research and plan a custom neutral tint (exact hue and strength for the grays and surfaces), with a
review artifact showing it across grounds and layers, before building anything."

Built 2026-10-22 as planned, with one change from the owner: how much of the tint text takes is a setting, Text tint
(0 to 4 in quarters, 2 the default), not a fixed half ("the key with this design system is i want everything to be part
of a series of choices"). Tint hue and strength have an Auto value that follows Neutral, so the default (Neutral) draws
exactly as before, and Cool's and Warm's surfaces too; their text takes half their faint tint and moves under 0.001 L. This folder holds the measurements and the plan; the review page is
https://claude.ai/artifact/8Czr8Wcu9rTwdW97SzFLzQ (hue, strength, page colour, text tint and the ink rule, live on real components, with the sweep maps).

## How the tint works today

- Every Layers colour (page, raised, recessed, control fills, edges, body and muted ink) is an OKLCH colour built live in
  CSS from a lightness (Ground, Layers) and two numbers per mode: `--area-neutral-hue-*` and `--area-neutral-chroma-*`
  (`color/layers.ts`, `layerCss`). Confirmed in the app: setting the two numbers inline on a scope tints all of them, live.
- Neutral, Cool and Warm are three pairs of those numbers, read off each ramp's 50 (light) and 900 (dark):
  Neutral 0; Cool hue 247.9 / 254.1, Warm 67.8 / 73.2; chroma 0.0034 in light and about 0.012 in dark, so the light
  casts are close to invisible.
- The tint fades to none toward white (`CAST_FADE`, from 0.024 under white) and toward black, so a white page stays white.
- A few places read the fixed neutral ramp instead (`neutral-solid` and its hover, `neutral-800`, `neutral-25`: about ten
  uses); they would not follow a custom tint.

## What limits a custom tint: contrast

`sweep.ts` runs every check the Layers gate runs (`layers.test.ts`, "every combination is usable": muted on every
surface and fill, muted on the soft-mark plates, body on selected, control edge 3:1) over every ground and every Layers
step, for 24 hues and strengths 0 to 0.08, and records the strongest tint each hue passes.

| Ink rule | Light: weakest hue passes | Dark: weakest hue passes |
|---|---|---|
| Today (inks tinted like their ground) | 0 (hues 120 to 240 fail at 0.005) | 0.05 |
| Neutral inks (only surfaces tinted) | 0.02 (reds and pinks fail) | 0.02 |
| Inks moved 0.25 × strength away from their ground | **0.08 (every hue)** | **0.08 (every hue)** |

Why: the inks are solved for lightness as if every colour were grey, and muted ink sits right at 4.5:1 on the hovered
soft mark. At the same OKLCH lightness a cyan or blue tint has higher luminance than grey (and a red tint changes the
surface's luminance the other way), so a small tint tips muted text under 4.5:1. `solve.ts` finds the true fix, solving
each ink against the tinted colours: at strength 0.04 muted moves at most 0.006 L (light) and edges not at all. The
0.25 × strength margin is that fix in a form CSS can write (one `calc()` on each ink), and it passes every hue to 0.08.

## What limits it: gamut

`gamut.ts`: the strongest tint sRGB can show without clipping. At L 0.98 (a 98 page) only 0.009 (blue, purple) to 0.07
(green); at L 0.95 at least 0.023 for every hue; dark grounds 0.02 to 0.08. So a strength scale up to 0.04 fits every
ground from 95 down, and the lightest pages gamut-map (CSS Color 4 does it in the browser; the model clamps).

## References

- Linear custom themes: the user sets a few colours (background, text, accent) and the app generates the border and
  elevated-surface shades (https://linear.app/docs/custom-themes, https://linear.app/changelog/2020-12-04-themes).
- Radix Colors custom palettes: a 12-step scale generated from reference colours including the background; contrast
  holds "as long as you use a reasonable background color" (https://www.radix-ui.com/colors/docs/overview/custom-palettes).
- Area's model already generates every shade from the ground, so the custom input is only the tint.

## Plan

1. **Settings** (one number, one effect; light and dark apart, as Ground and Layers):
   - `tint-hue`: 0 to 355 in 5° steps (72 values), shared by both modes so a theme keeps one identity.
   - `tint-light`, `tint-dark`: 0 (none) to 8, each step 0.005 of OKLCH chroma (8 = 0.04).
   - The four `--area-neutral-hue-*` / `--area-neutral-chroma-*` properties move from the Neutral axis to these; Neutral
     keeps the ramp. Choosing Cool or Warm in the Inspector also sets the matching tint (hue 250 or 70, tint 1), so
     today's picks look the same; Neutral stays tint 0, so the default does not move a pixel.
2. **Ink rule**: body, muted and edge inks move 0.25 × chroma away from their ground (model and CSS together;
   `layers.test.ts` proves they agree). Open question for the owner: how much of the tint the text takes (full, half,
   none). The review page shows all three; contrast passes in each once the margin is in.
3. **Pick a page colour**: a colour field in the setup's Color step. The picked colour splits into OKLCH: its lightness
   snaps to the nearest Ground, its chroma to the nearest Tint, its hue to the nearest 5°; the field then shows what was
   snapped to.
4. **Tests**: the Layers gate loops over hue × tint (24 × 9 per mode) at every ground and Layers step; the contrast report
   covers the tint extremes.
5. **Later**: tint the ramp's `neutral-solid` and co. (about ten uses); a custom accent (generated ramps) as its own
   project.

## Files

- `sweep.ts`, `sweep*.json`: hue × strength against the Layers gate, for the three ink rules (`--neutral-ink`,
  `--margin=0.25`).
- `solve.ts`, `solve.json`: how far each ink must move when solved against the tinted colours.
- `gamut.ts`, `gamut.json`: the strongest in-gamut tint per hue and lightness.
