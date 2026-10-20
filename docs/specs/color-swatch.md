# ColorSwatch spec

**Captures:** `docs/research/captures/color-swatch/`
**Peers:** ColorSwatchPicker (cells), ColorField (leading preview), ColorPicker (preview and
checker), Chip swatch, Avatar (small identity box)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md), "Color and alignment
  follow-up, 2026-09-24"): The earlier muted swatches were arbitrary demo hex values, not
  palette tokens. Color examples now use exact family-500 hex values from
  `packages/tokens/src/color/palette.json` (e.g. blue #006DF5, purple #8D4DF3, green
  #01AA4E). Alpha examples deliberately remain translucent. Swatches represent document
  color data and must not change with UI theme. The supplied Figma neutral values are
  retained only in the explicitly labeled split-field reference example. The palette source
  itself is unchanged.

## Job and boundaries

ColorSwatch displays one colour, passive and non-interactive, with transparency shown over a
checkerboard. It is `role="img"` named "Color <value>" unless the consumer names it. Choosing
a colour is ColorSwatchPicker; editing is ColorField or ColorPicker.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 16, md 20 (default), lg 24 | Icon-slot preview (sm), standalone and cells (md, lg) | Figma chits 14 (fill and colour rows) and 16 (swatches) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Page colour-row chit (inspector); fill-row chit; document-colour chits | figma.com editor inspector, read-only, 2026-09-26; ColorPicker pass | evidence only | `input-group/figma--color-row--rest--light`; `color-picker/figma--fill-row--rest--light`, `figma--swatches--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `color-swatch/area--*` |

Figma chits: colour row 14 × 14, radius 2, with a separate edge layer of radius 20% and
`inset 0 0 0 2px rgba(0,0,0,.1)` (`figma--color-row` nodes 4, 6); fill row 14 × 14, radius 2
(node 4); document colours 16 × 16, radius 20%, the same edge layer (`figma--swatches` nodes
13, 15); transparency checker 10.67px #fff / #e1e1e1 ([color-picker.md](color-picker.md):80).
Notion and ChatGPT: no colour preview among their captures (searched every `notion--*` and
`baseline/chatgpt--*` file; Notion's coloured tags and status dots are Badge's).

## Anatomy

```
area   span.area-color-swatch  owns: size, 20% corner, the `bg-component` ground (the checker's light cells), and the
                               swatch ring: a 1px `token-swatch-ring` outline inside the shape, over the colour
  ::before  the checker: `fg-default` 16% through a 2 × 2 pixel mask, 5 cells across
  ::after   the colour, filling the shape (`--_edge: 0`)
```

(color.css, `.area-color-swatch`; was one element with a `repeating-conic-gradient` checker of 8px tiles and a
22% inset hairline, then a solid 1px edge around the colour, 2026-09-28 to 2026-10-12.) The colour layer sits over the
checker, so transparency needs no child.

## Measurements

From the capture nodes (node 0):

| property | area · default (md) | area · sizes (sm, first swatch) |
|---|---|---|
| size | 20 × 20 | 16 × 16 |
| radius | 5px | 4px |
| shadow | color(srgb 0.156863 0.156863 0.156863 / 0.22) 0px 0px 0px 1px inset | color(srgb 0.156863 0.156863 0.156863 / 0.22) 0px 0px 0px 1px inset |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| size | 16 / 20 / 24 (`mark-sm/md/lg`) | Figma 14 and 16 | sm fills Input's 16px icon slot |
| size in a menu row's or Custom select's icon slot | **the icon box less 2** (14 in a 16, 18 in a 20; round 56, Figma's 14 chit; round 55: less 4, 12), whatever `size` says, with the sm swatch's corner (4 at the default; round 55: "can it be 2px rounder?") (color.css, `:is(.area-menu__icon, .area-custom-select__icon) .area-color-swatch`) | Owner (2026-10-19: "the swatch seems very large" beside the other marks in the setting pickers); Area's square icon keyline, ink 12.1–13 (`area-icon-construction`, Keylines); Figma's 14 chit in a fill row | There it stands in for a glyph, so it reads the size of the glyphs and marks beside it; a solid counts heavier than a line, so it takes the keyline's 12, under Figma's 14. Color field's preview and the picker's cells are the value itself and keep their size |
| radius | **20% of the side, rounded to even pixels** (4 at sm, md and lg at the default; 12 → 2), times the corner setting ÷ 8 elsewhere, square at Sharp | Owner (2026-09-28: "make it more consistent"); radius audit 2026-10-03 (D6, all even, one corner setting); Figma 20% (`figma--swatches`, the edge layer) | Was `min(radius-small, size / 4)`: 25% to 24px, then capped at 6; then 3.2 / 4 / 4.8 |
| edge | **a 1px translucent ring over the colour**: an `outline` at `stroke-width`, offset inward by it, painted over the layers (they sit at z-index −1 in the swatch's isolated stack; as positioned layers above it they hid the ring until round 55) (a required edge, audit F-5), `--area-token-swatch-ring` (black 10% light, white 10% dark); the layers fill the shape (`--_edge: 0`) | Owner (2026-10-12: "yes apply the swatch fix"); Figma's swatch edge, black 10% | Was (2026-09-28) a solid `bg-component` band around the colour: it merged with light grounds on straight edges and showed only as fringe at the corners. Before that, `fg-default` 22% (too dark) |
| checker | **a 2 × 2 pixel tile used as a mask, 5 cells across at every size** (ink cells in all four corners), `fg-default` 16% over `bg-surface` (color.css:3-15) | Owner (2026-09-28: a pixel image that meets the edges exactly and scales) | Figma 10.67px #fff/#e1e1e1; Area's follows the theme while the colour does not (owner). Was 8px conic-gradient tiles |
| colour | consumer value, unchanged by theme | Owner (above) | — |

## States

None: the swatch is passive. Selection and focus belong to ColorSwatchPicker.

## Behavior and accessibility

`role="img"` with `aria-label` defaulting to "Color <value>" (`ColorSwatch.tsx:14`); pass
`aria-hidden` when a neighbour already names the colour (ColorField, ColorSwatchPicker
do). The ring is an `outline`, which forced colours keep in a system colour; not checked in a browser.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| ColorPicker | checker | the same pixel mask (`:where(.area-color-swatch, .area-color-picker)`) | same | match |
| ColorSwatchPicker | cell content | swatch = cell − 8 | md 20 in a 28 cell | match |
| ColorField | icon slot | 16px | sm 16 | match |
| Radius roles | concentric scale | `radius-concentric` | 20% of the side × `radius-concentric` (square at Sharp) | derived from a role (was `min(radius-small, size / 4)`) |

## Visual pass

2026-09-28, Claude in Chrome (batch 9): the swatch in Figma's live Page colour row (a square with a
hairline edge in the field's leading slot) beside Area's Fill rows at 2x: same role and place, the
swatch on the field's leading inset, its edge visible on light colours. No change.

Earlier note:

The gallery shows ColorSwatch's tiles in named groups. Unverified: Figma side by side, dark
theme, forced colours.

## Settled questions

1. *Edge: kept at 1px, ink at 22%.* Every Figma chit captured draws a 2px black 10% inner
   edge (`figma--color-row` node 6, `figma--swatches` nodes 15, 22, 29). Area keeps one
   stroke width, and 22% keeps a white swatch visible on white ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).
   *Superseded 2026-09-28 (owner): the edge is a solid `light-dark(neutral-50, neutral-800)`, so
   neither the colour nor the checker shows through it.* — superseded 2026-10-12: a translucent ring over the colour,
   `token-swatch-ring` (Decisions, edge).

## Verification

Compared the Area captures (`color-swatch/area--*`) with `input-group/figma--color-row`,
`color-picker/figma--fill-row` and `figma--swatches`. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md`. A swatch is static: no hover, no transition. Crispness: its size is a mark
token and its corner whole-pixel even; edge and layers sit at whole-pixel insets. Inside a picker
the rings it shows on hover and selection are the Color swatch picker's motion. Open question: the
5-cell checker at 14px inner size draws 2.8px cells (owner's 5 cells), which rasterise soft at 1x;
kept as the owner's choice.

## Review note, 2026-10-12 (swatch ring)

- **What changed:** the swatch's outline is a thin translucent line over the colour (black 10%, white 10% in dark) instead of a solid very light band around it.
- **Why:** you asked why the swatch's outline only showed at its corners, then said to apply the fix: the outline is now
  a light translucent line drawn over the colour, so it shows evenly all the way round on every colour.

## Review note, 2026-10-19 (round 55, swatch in an icon slot)

- **What changed:** a swatch in a list row's or a Custom select's icon slot is 12 in the 16 box instead of filling it,
  with its corner at 2.
- **Why:** you said the swatch looked very large beside the other options' marks. It filled the whole icon box, while
  glyphs draw inside a 12–13 keyline and the setting marks beside it were 12; now it is the size of what sits beside
  it. The Inspector's ground swatches also draw the Inspector's ring now, so a dark swatch in a light Inspector has the
  same light-theme hairline as the others.

## Feedback log

- 2026-09-26 · cohesion audit → no change; spec written → `color-swatch/area--*`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added, no
  change; the edge difference recorded as an open question → `input-group/figma--color-row`.
- 2026-09-27 · third pass → open question settled, value kept: 1px edge at 22% of the ink
  → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · batch 9 side by side (Figma Page colour row) → no change.
- 2026-09-28 · owner: solid, very light stroke so the colour and image don't show through → neutral 25
  (dark: neutral 800, one step off the dark surface) → 4x sheet of white, #F5, blue, 80% yellow, 50%
  purple, black and transparent swatches in both themes; Area tiles re-captured.
- 2026-09-28 · owner: the left swatches showed a faint line only on the corners → the edge was an inset
  shadow painted over a fill that ran to the same rounded edge; their anti-aliased curves let the
  colour bleed at the corners. Now a border with `background-clip: padding-box` (one outer edge) →
  8x crop of solid, 80% and 50% swatches: even ring, no corner bleed.
- 2026-09-28 · owner: neutral 50, visible mainly on a white swatch → edge #f7f7f7 (dark #282828, the same
  50-unit step off the dark surface).
- 2026-09-28 · owner: make the transparency image meet the edges exactly and scale; Area's own pixel
  version that can be overlaid → one 2 x 2 pixel tile (SVG, crisp edges) used as a mask
  (`--_checker-tile`), ink `--_checker-ink` (fg-default 16% over the surface, so it follows the theme),
  sized in whole cells of the box (`--_checker-cells`, 4 across at every size) with square cells. The
  swatch layers it: surface, checker, colour (`::before`, `::after`). Color picker's preview chips use
  the same layers; its alpha track (a range input) uses the same ink as a gradient, one tile per
  track height → 6x and 10x sheets at sm / md / lg / 40, light and dark: 4 x 4 whole cells meeting the
  edge at every size.
- 2026-09-28 · owner: gaps between the colour and the corner of the stroke → the layers inherited the
  outer radius while sitting inside the 1px edge; their radius is now the edge's inner curve,
  `max(0, --_radius - --_edge)`, from the same private properties the palette cells change → 10x crop:
  concentric, no sliver.
- 2026-09-28 · owner: the fully transparent swatch looks rounder → with 4 cells two corners were light
  cells lost against the surface and edge; an odd count puts ink cells in all four corners. 3 cells
  (closest to the old 8px cells; 5 was busy at 16px) → 5x sheet of 4 / 3 / 5 at sm, md, lg.
- 2026-09-28 · owner: why don't they all have the same corner radius; 5 cells is fine → radius 20% of the
  side at every size (was 25% capped at 6, so 40px swatches read squarer); checker 5 cells → sheets at
  16 / 20 / 24 / 40, light and dark.
- 2026-09-28 · owner: the clear swatch still reads rounder → geometry was identical at 12x; the clear one
  is read by the edge's outer line (its light cells merge with the edge and page, 4 / 20 = 20%) while
  a filled one is read by its colour inside the edge (3 / 18 = 17%). The inner shape now takes 20% of
  its own side (3.6 / 18), so both read at 20%; the edge is ~1.25px on the corner diagonal.
- 2026-09-28 · the inner 20% shape left a hair of white between the edge's concentric inner curve and the
  layers → the swatch is now its edge: background = edge colour at the outer shape, the checker and colour
  1px inside at the inner shape; the checker's light cells are the edge colour (#f7 light, #28 dark), so
  nothing else can show between the shapes → 12x trio, no sliver.
- 2026-09-28 · owner: the fill reads rounder than the stroke, obvious on the clear swatch → the separate 20%
  inner shape was wrong: the fill must be concentric with the edge (`radius - edge`), an even 1px ring.
  Kept: the edge drawn as the swatch's background (no sliver can show) and the checker's light cells in
  the edge colour (a clear swatch reads as one object with its edge).
- 2026-09-28 · owner: approved (batch 9).
- 2026-10-03 · radius audit D6 (owner) → the 20% corner is rounded to whole pixels: 12 → 2, 16 → 3, 20 → 4, 24 → 5 (was 2.4, 3.2, 4, 4.8) (`color.css`, `--_radius`). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · roundness → the whole-pixel 20% corner plus the shift, never below square; in 2px steps (`color.css`). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · all even (owner) → the 20% corner rounds to 2px: 12 → 2; 16, 20 and 24 → 4 (`color.css`).
- 2026-10-03 · one corner setting (owner: one radius setting, Sharp and Pill as ends; "every control is a pill") → 20% of the side at the default (unchanged), times setting ÷ 8 elsewhere, nearest even pixel (`color.css`). `docs/research/radius-audit-2026-10-03.md`, "One corner setting".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → a swatch has no motion; its picker rings take Color swatch picker's (no change). See "Motion and interaction, 2026-10-07".
- 2026-10-12 · owner: the swatches should be "the new swatches with transparent strokes" → the edge is the swatch picker palette's hairline, 1px black 10% (white 10% in dark) as an outline inside the shape, over the colour, replacing the solid neutral-50 ring of 2026-09-28 (reverses that call: the colour now shows through its rim); palette cells keep no outline of their own (the palette draws one round the grid) → color.css. One swatch outline across ColorSwatch, the palette picker and the desktop colour cards.
- 2026-10-12 · owner (Token row review): "why does the stroke around the swatch only show lightly on the corners, not
  continuously around the whole swatch?" → the solid #f7 edge merged with light grounds on straight edges and showed only
  as antialiasing fringe on the curves; owner: "yes apply the swatch fix" → the edge is a translucent ring drawn over the
  colour, `--area-token-swatch-ring` = `light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1))` (Figma's black 10%),
  shared by Code's swatch, ColorSwatch and Asset row's preview. Checked at 2× in light and dark: continuous on dark,
  white, translucent and saturated swatches; white still outlined on white.
- 2026-10-12 · merge with main: main had drawn the same ring as an inset `outline` (1px black 10% / white 10%); the
  merge keeps main's outline and drops this branch's duplicate `box-shadow`, so the ring is painted once.
- 2026-10-12 · owner, review round 16: approved.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the ring reads the `token-swatch-ring` token and `stroke-width` (the merge with main had brought back a literal colour at `border-width`, regressing audit F-5: a white swatch vanished under Elevated) (color.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-19 · owner: the setting pickers' swatch reads very large beside the icons and marks, and should show the
  translucent ring → in a menu row's or Custom select's icon slot the swatch is the icon box less 4 (12 at 16);
  the app's option marks keep to the icon keylines (squares 12, wide marks 14 × 10), and a mark painted under another
  theme's scope reads the ring from the Inspector → measured in the app: 12 × 12 at (2, 2), corner 2, ring black 10%
  in light and white 10% in dark for every ground swatch.
- 2026-10-19 · owner, round 55 ("are the gaps … too large? … even solid swatches got the transparent outline overlay?
  … can it be 2px rounder?") → the layers move under the ring (z-index −1 in the isolated swatch), the icon-slot corner
  is the sm swatch's (4), the gap is kept with its reason → headless Edge at 6×, light and dark: ring on blue, red,
  green, yellow, white, near-black and purple; corner 4.

## Review note, 2026-10-19 (round 56)

- **What changed:** the thin translucent ring now shows on every swatch, solid colours included, in light and dark;
  a swatch in a list's icon slot has a corner 2px rounder (4).
- **Why:** you asked whether solid swatches still had the transparent outline: they had lost it. The ring was there,
  but the colour layer painted over it, so not even a white swatch on white showed an edge. The colour now sits under
  the ring. The 12 swatch took 20% of its side for its corner (2), which read sharp; it now keeps the 16 swatch's 4,
  and still follows the Radius setting (square at Sharp).
- **The gap you asked about:** the text starts one tier gap after the 16 icon box (4 at the app's Compact, 6 at
  Default), and the 12 swatch sits 2 inside the box, so it reads 6 (8). A glyph's ink also starts about 2 inside its
  box, so swatch rows and glyph rows share one text column; Figma's colour row reads 5. Narrowing it only for swatches
  would put their labels off the column of the rows around them.

## Review note, 2026-10-19 (round 57)

- **What changed:** a swatch in a list's icon slot is 14 (it was 12), still 2px rounder at the corner (4). The tier gap
  to the text is unchanged everywhere.
- **Why:** you were open to a slightly larger swatch and asked whether the gap was too big for every design. The
  measured products put a glyph 4 (ChatGPT) to 6 (Notion) from its label, and Figma's 14 chit 5 from its text; Area's
  gap is 6, and 4 at the app's Compact, inside that range, so it stays. At 14 the swatch sits 1 inside its box, so it
  reads 5 from its text at Compact, as Figma's does.
- **The outline:** it was dropped by accident. A merge on 2026-10-12 removed what looked like a duplicate ring (a
  shadow on the colour layer) and kept the outline, which the colour layer then covered, so nothing showed it. No
  outline is not better: a white or near-ground swatch disappears on its ground (a white swatch on white had no edge at
  all), and Figma draws the same 10% inner edge on every chit. On saturated colours it is barely visible, by design.
