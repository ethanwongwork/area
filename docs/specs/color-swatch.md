# ColorSwatch spec

**Status:** in review · 2026-09-26 (cohesion audit; second pass with Notion and Figma)
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
area   span.area-color-swatch  owns: size, radius, colour (linear-gradient layer) over the checker, inset hairline
```

One element: the colour is a gradient layer over a `repeating-conic-gradient` checker
(8px tiles, `fg-default` 16% over `bg-surface`), so transparency needs no child
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
| radius | `min(radius-small, size / 4)`: 4 / 5 / 6 (`color.css:8`) | Figma 20% (3.2 at 16) | Follows the radius preset; quarter-size cap keeps it a square |
| edge | 1px inset, `fg-default` at 22% | Figma 2px inset black 10% (all three chit captures) | Kept (third pass): one stroke width, drawn in the theme ink (`color.css:14`); 22% keeps a white swatch visible on white |
| checker | 8px tiles, `fg-default` 16% over `bg-surface` | Figma checker | Figma 10.67px #fff/#e1e1e1; Area's follows the theme while the colour does not (owner) |
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
| ColorPicker | checker | same gradient (`--_checker`) | same | match |
| ColorSwatchPicker | cell content | swatch = cell − 8 | md 20 in a 28 cell | match |
| ColorField | icon slot | 16px | sm 16 | match |
| Radius roles | small radius | `radius-small` 6 | capped to size / 4 | derived from a role |

## Visual pass

The gallery shows ColorSwatch's tiles in named groups. Unverified: Figma side by side, dark
theme, forced colours.

## Settled questions

1. *Edge: kept at 1px, ink at 22%.* Every Figma chit captured draws a 2px black 10% inner
   edge (`figma--color-row` node 6, `figma--swatches` nodes 15, 22, 29). Area keeps one
   stroke width, and 22% keeps a white swatch visible on white ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

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
