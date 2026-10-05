# ColorSwatch spec

**Status:** accepted · 2026-09-28 (owner, batch 9)
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
area   span.area-color-swatch  owns: size, 20% corner, a solid 1px edge (its own fill)
  ::before  the checker: `fg-default` 16% through a 2 × 2 pixel mask, 5 cells across
  ::after   the colour, inside the edge on its inner curve
```

(color.css:9-71; was one element with a `repeating-conic-gradient` checker of 8px tiles and a
22% inset hairline.) The colour layer sits over the checker, so transparency needs no child
(`color.css:9-13`).

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
| size | 16 / 20 / 24 (`space-16/20/24`) | Figma 14 and 16 | sm fills Input's 16px icon slot |
| radius | **20% of the side at every size** (`--_radius: size / 5`; 3.2 / 4 / 4.8 at sm / md / lg); layers inside the edge are concentric, `radius - edge` (`--_inner-radius`) | Owner (2026-09-28: "make it more consistent"); Figma 20% (`figma--swatches`, the edge layer) | Was `min(radius-small, size / 4)`: 25% to 24px, then capped at 6 |
| edge | **1px border, solid `light-dark(neutral-50, neutral-800)`, fill clipped to the padding box**, one step off the surface in each theme (`color.css`) | Owner (2026-09-28: "make the stroke … a solid color, so the image and colors don't show through … neutral 25 or something very light") | Was `fg-default` at 22%, a translucent ink that darkened each colour and the checkerboard at the edge. Figma draws 2px black 10% (translucent). Trade-off: a white or near-white swatch on a white surface is barely outlined |
| checker | **a 2 × 2 pixel tile used as a mask, 5 cells across at every size** (ink cells in all four corners), `fg-default` 16% over `bg-surface` (color.css:3-15) | Owner (2026-09-28: a pixel image that meets the edges exactly and scales) | Figma 10.67px #fff/#e1e1e1; Area's follows the theme while the colour does not (owner). Was 8px conic-gradient tiles |
| colour | consumer value, unchanged by theme | Owner (above) | — |

## States

None: the swatch is passive. Selection and focus belong to ColorSwatchPicker.

## Behavior and accessibility

`role="img"` with `aria-label` defaulting to "Color <value>" (`ColorSwatch.tsx:14`); pass
`aria-hidden` when a neighbour already names the colour (ColorField, ColorSwatchPicker
do). Forced colours remove box-shadows, so the edge is lost there; not checked in a browser.

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
   neither the colour nor the checker shows through it (Decisions, edge).*

## Verification

Compared the Area captures (`color-swatch/area--*`) with `input-group/figma--color-row`,
`color-picker/figma--fill-row` and `figma--swatches`. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

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
