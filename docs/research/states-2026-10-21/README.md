# Interaction states, 2026-10-21

Owner: "can we also look at selected states, not sure if its consistent across all components. the color itself seems
too dark for sure. i want to really analyze the hover, pressed, and selected state for each component and make sure
its all cohesive, subtle, and also leverages professional motion interaction".

Page with live options: https://claude.ai/artifact/XNiSsqt35dDieqbu2Xe7NX

## Method

`sweep.mjs` drives headless Edge against the app (the dev server or `desktop-dist`). For every family, every
interactive element in the gallery tiles gets the same reads:
- paint at rest, under `:hover`, and under `:hover:active`, forced through DevTools up the ancestor chain;
- the composited plate (own fill, `::before` / `::after`, first painted child), ink, edge, ring, outline, decoration;
- the transitions entering (read while hovered) and leaving (read at rest), before transitions are switched off.

Every selected element (`aria-selected`, `-pressed`, `-checked`, `-current`, `data-selected`, a label around a checked
input) is read against an unselected sibling. `analyze.mjs` groups the output by role. Raw JSON is not committed
(about 2 MB per theme); re-run with `node sweep.mjs out.json light|dark <base> <port>` (`SLUGS=a,b` narrows).

Read the output with care. These came back as false positives and were checked by hand:
- a press shown as ink (row actions) or a gradient (Badge);
- a hover painted by an ancestor that carries the transition (Table row, Board card, Edit summary row, Chip);
- a transition on a part that doesn't change on hover (Nav's marker);
- a control pressed through its input (Checkbox, Radio).

## Findings

| | Result |
|---|---|
| Hover and press | Cohesive. 25 families of rows share one ladder. Light: rest #ffffff → hover #f3f3f3 → pressed #e7e7e7. Dark: #121212 → #272727 → #3e3e3e. Solid buttons step one way (#282828 → #1d1d1d → #141414), and every press goes past its hover. One gap: Video player's start button has no press. |
| Motion | 93 of the 98 families with something to hover follow the rule: instant in, 140ms out (`duration-fast`) on `ease-out`. Three strays, fixed: Token row faded in, and Code block's line numbers and toggle switched their underline instead of fading it as Link does. |
| Selected | Not cohesive. Eight treatments: row plate, solid mark, container edge, raised thumb, swatch ring, chip plate, indicator, ink. Two colour systems: Card and Asset card always draw `stroke-selected` (the accent's text shade, #004cb0, 7.9:1 on white) and ignore the Selection setting. Choice cards follow it (#282828 at Neutral, 14.7:1). Weights differ: Card 2px, Asset card 1px, a containerless image ring 2px, choice cards 1px. |

## Picks and settings

The owner's follow-up (2026-10-21) widened the question to strokes, focus, shadows, fills and pressed states, and
named ChatGPT's 2px vibrant-blue selected stroke as the look to aim for. The A–E options on the audit page were
superseded by the picking page below (nine questions). The picks (collection `state-picks`):

| Question | Pick | Built as (default) |
|---|---|---|
| Selected | 2px vibrant blue | Selected stroke 2, the indicator rung (#0160d9 / #79aeff) |
| Focus | ChatGPT: hug controls, 2px off containers and text | Focus ring Hug |
| Rest stroke, hover stroke | today's | Strength 4, Hover stroke 2 |
| Rest shadow | `0 1px 2px -1px` 8% | Resting 3, one tight layer |
| Hover shadow | `0 2px 4px -1px` 8% | Hover shadow 3 |
| Fills | hover 5%, selected 7%, pressed 12% | Hover 2, Selected 1, Pressed 4 (the firmest muted text allows) |
| Selected fill | none | Selected tint None |

Then "capture some of these options as options for the design system customization ... keep my current selections as
the default and then branch out the other axis options from there": eight settings (`axes/states.ts`, Hover shadow in
`axes/depth.ts`; THEMING.md, "Interaction states"). Measured in the app at the defaults (light, Layers 4):
- Hover stroke 0–4: L 0.913, 0.891, 0.870, 0.848, 0.827 (equal steps).
- Hover fill 1–4: 0.970, 0.964, 0.955, 0.946. Selected fill 0–4 past hover: 0.964, 0.949, 0.934, 0.919, 0.904.
- Pressed fill 1–4: 0.943, 0.937, 0.931, 0.925. The firmest press stops where muted text keeps 4.6:1 (L 0.925, about
  9% black on white, not ChatGPT's 12%), so in light at the default Layers the four presses are 0.006 apart; on darker
  grounds and in dark they spread further (3% and 3.5% a step).
- Hover shadow 0–8: 0, 2.7, 5.3, 8, 10.7 … 21.3% at `0 2px 4px -1px`.

## ChatGPT, measured 2026-10-21 (Settings → Appearance, light; Claude in Chrome, read-only)

| Role | Value |
|---|---|
| Borders | `--color-border-subtle` #0000000d (5%), `--color-border` #0000001a (10%), `--color-border-strong` #00000026 (15%); dark white 5% / 15% / 20%; `--border-width-hairline` 0.5px |
| Selected tile (Mode) | a 2px border over the thumbnail, `border-default` (10%) at rest, `border-strong` (15%) on hover, `border-ring` #3a83f7 when checked: same width, only the colour changes; 8px corner |
| Focus | `--color-ring` #3a83f7. Tiles: `outline-2 outline-offset-2` (a ring 2px outside the tile). Buttons and selects: `ring-2 ring-offset-0` (a 2px ring hugging the control) |
| Fills | ghost hover #0000000d (5%), ghost active `color-mix(#0d0d0d 12%)`, surface #fcfcfc, tertiary #f9f9f9 |
| Shadows | xs `0 1px 2px 0 #0000000d`, sm `0 1px 2px -1px #00000014`, md `0 2px 4px -1px #00000014`, lg `0 4px 8px -2px #0000001a`, xl `0 8px 16px -4px #0000001f`, hairline `0 0 0 .5px #0000001a` |
| Elevation | sidebar `0 0 0 .5px #00000026, 0 3px 7.5px #00000008, 0 0 16px #00000005`; composer `0 0 0 1px #0000000a, 0 2px 8px 0 #0000000a, 0 4px 80px 8px #00000006` |
| Setting group | 1px #0000001a, 16px corner, #fcfcfc, no shadow |

Area today (light): card edge #eeeeee, control edge #e2e2e2 → hover #d4d4d4, focus and selected both #004cb0
(`focus-color`, `stroke-selected`), hover/selected/pressed fills #f3f3f3 / #eeeeee / #e7e7e7, resting shadow
`0 0 2px 0.75%, 0 2px 4px 1.5%`, lift `0 0 2px 0.75%, 0 4px 8px 1.5%`.

Picking page: https://claude.ai/artifact/3uKMHRhpWnPqNA6pK4WfD9 (collection `state-picks`).

## Design systems (public sources, 2026-10-21)

Values from source or official docs; [unverified] where only recalled or secondary.

| System | Rest stroke | Selected | Focus | Shadows |
|---|---|---|---|---|
| Radix Themes | 1px gray-a5 ≈12% | RadioCards: 2px accent-9 #0090ff outline on `::after`, inside | 2px focus-8, offset −1px | shadow-2: 1px gray-a3 ring + `0 1px 1px` / `0 2px 1px −1px` / `0 1px 3px` at ~5% [alphas recalled] |
| Atlassian | 1px #0B120E24 (≈14%) | `border.width.selected` 2px, #1868DB; bg #E9F2FE | 2px #4688EC, +2px | raised `0 1px 1px #1E1F2140, 0 0 1px #1E1F214F` |
| Primer | 1px #d1d9e0 | `borderWidth-thick` 2px, inset box-shadow | 2px #0969da, −2px | resting-xsmall `0 1px 1px 0 #1f23280d`; medium `0 3px 6px #25292e1f` |
| OpenAI Apps SDK UI | 10% (5 / 15%), hairline 0.5px at ≥1.5dppx | none | 2px ring (#0169cc light, #0285ff dark), +2px | 100 `0 1px 2px −1px` 8% … 400 `0 8px 16px −4px` 12% |
| Fluent 2 | #d1d1d1, hover #c7c7c7 | fill #ebebeb; brand stroke #0078d4 | 2px black, inset | shadow2 `0 0 2px 12%, 0 1px 2px 14%` |
| Polaris | #e3e3e3, hover #cccccc | fill #f1f1f1; 2px | 2px #005bd3, +1px | 100 `0 1px 0 7%`; 300 `0 4px 6px −2px 20%` |
| shadcn v4 | #e5e5e5 | fill only | 3px ring at 50% grey | `shadow-sm` `0 1px 3px 10%, 0 1px 2px −1px 10%` [recalled] |
| Figma | #e6e6e6 | #0d99ff (2.99:1), bg #e5f4ff | — | — |
| Material 3 | #cac4d0 / #79747e [recalled] | state layers 8 / 12% | 3px, +2px | positive spread (the outlier) |

Agreement:
- **Rest stroke:** 1px at 8–14% black (1.25–1.5:1); hover adds about 5% at the same width.
- **Selected vs focus:** separate, and the ARIA Authoring Practices Guide says they must look distinct.
- **Selected stroke:** 2px accent, drawn inside so nothing moves.
- **Focus ring:** 2px, inset or 1–2px outside.
- **Shadows:** 0 or negative spread at 3–12%.

A state indicator needs 3:1 against what is next to it (WCAG 1.4.11). On white:
- ChatGPT #3a83f7 is 3.6:1 and Area accent #006df5 is 4.7:1, so both pass.
- Figma #0d99ff is 2.99:1, just short.
- WCAG 2.4.13 (AAA) asks for a focus indicator with at least a 2px perimeter at 3:1.
