# Alignment picker spec

**Status:** accepted (owner; Complete in `component-status.mjs`; was: in review · 2026-09-26 (cohesion audit; second pass the same day, no change))
**Captures:** `docs/research/captures/alignment-picker/`, `button-group/figma--align-group`, `number-field/figma--number-field`
**Peers:** Segmented (a choice on its own track), Radio (exclusive choice), Checkbox / Chip (neutral selection), Input (soft field fill), ColorSwatchPicker (grid of cells), NumberField (inspector row neighbour)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)):

  From the 2026-09-24 control refinement:

  - [Figma alignment guidance](https://help.figma.com/hc/en-us/articles/31289464393751-Use-the-horizontal-and-vertical-flows-in-auto-layout):
    the nine-position control and spatial arrow navigation inform AlignmentPicker; a flat
    selected cell replaces the raised tile. Dimensions come from Area's tokens.

  From the color and alignment follow-up, 2026-09-24:

  AlignmentPicker uses three rounded bars with column-dependent alignment, 2px unselected
  dots, no selected backplate, and `stretch` to fill both dimensions of a sized parent.
  Landscape and portrait examples demonstrate this independently of size/treatment variants.

  2026-09-26: the selected bars are `fg-default` by default and `fg-accent` with
  `tone="accent"`, following "Neutral by default, accent by override" (DESIGN_SYSTEM.md).
  Checkbox, Radio and Chip moved the same way (neutral-solid checked face; neutral tonal chip
  selection); all four await owner review. *All four approved since. Superseded 2026-09-29
  (owner, D1): the bars are the Selection role, `fg-selection` (alignment-picker.css:23), accent
  by theme; the `tone` axis was removed.*
- 2026-09-26: **Neutral by default, accent by override** (owner; DESIGN_SYSTEM.md).
- 2026-09-26 (second pass): decide every open item with the most calculated option
  consistent with the system. Nothing in that pass changed AlignmentPicker; a `sizes` tile
  was added to the gallery.

## Job and boundaries

AlignmentPicker chooses one of nine physical positions (a 3 × 3 radio group) for an
inspector property. It is not a general grid of options (ColorSwatchPicker) or a
one-dimensional choice (Segmented).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| variant | soft (default; `.area-alignment-picker--soft`, the field fill it borrows), plain | Standalone, or inside an existing inspector surface. Was `surface`, renamed because `surface` means a lifted plate in Calendar, Toolbar and ColorPicker; `"surface"` stays a deprecated React alias | Figma auto-layout alignment control (guidance above) |
| size | sm, md (default), lg | Cell sits between its control and icon tiers | Gallery `sizes`; Figma inspector controls are 24 high |
| boolean | `stretch` | Fill a sized parent (landscape, portrait) | Owner (prior decision) |
| state | checked, disabled | — | Gallery `disabled` |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma-guide | official guidance | Nine-position control, arrow navigation | Figma help link above | n/a | none |
| figma | target product (primary for inspector controls) | Editor inspector alignment row: three joined 24px icon buttons, rgb(245), outer radius 5; inspector number field: rgb(245), radius 5, no edge | figma.com editor, light, read-only, 2026-09-26 | evidence only | `button-group/figma--align-group--rest--light`, `number-field/figma--number-field--rest--light` |
| figma | target product | Paint-type radios: 24px cells, radius 5, selected rgb(245), 4px apart | earlier ColorPicker pass | evidence only | `color-picker/figma--paint-type-row--rest--light` |
| area | this system | Gallery tiles, re-taken after the second pass | localhost gallery | — | `alignment-picker/area--*` (7) |

Figma's nine-position auto-layout control was not captured: the second pass recorded the
inspector's alignment row, number field, size select and section titles, not the auto-layout
alignment grid. ChatGPT and Notion have no equivalent in the captured surfaces (page
menu, Share popover, board, table). Untitled UI has no alignment picker
([reference](../research/untitled-ui-reference.md)).

## Anatomy

```
area     div.area-alignment-picker[role=radiogroup][dir=ltr]  owns: grid, 1px edge, padding, radius, fill
  cell   label.area-alignment-picker__cell  owns: square cell, radius, hover plate, focus ring, hit area
    input  radio, opacity 0, fills the cell
    dot    span.__dot  2px dot; when checked a 16px box of three 2px bars (60 / 100 / 40%)
```

Inset equation: 1px border + 3px padding = 4px outer inset (`alignment-picker.css:10-11`);
cells meet with no gap. md: 4 + 3 × 24 + 4 = 80. Cell radius = container 8 − inset 4 = 4
(`alignment-picker.css:32`).

## Measurements

`node scripts/capture-compare.mjs alignment-picker/*.json` (shell) plus cell nodes:

| slot · property | default | disabled | landscape | plain | portrait | tone-accent |
|---|---|---|---|---|---|---|
| **shell** size | 80 × 80 | 80 × 80 | 220 × 112 | 80 × 80 | 112 × 200 | 80 × 80 |
| **shell** padding | 3 | 3 | 3 | 3 | 3 | 3 |
| **shell** border | 1 solid rgb(243, 243, 243) | same | same | 1 solid transparent | same as default | same as default |
| **shell** radius | 8px | 8px | 8px | 8px | 8px | 8px |
| **shell** background | rgb(247, 247, 247) | same | same |  | same | same |
| cell | 24 × 24, radius 4 | | | | | |
| unselected dot | 2 × 2, rgb(102, 102, 102) | | | | | |
| selected bars | 9.59 / 16 / 6.4 × 2, rgb(40, 40, 40) | | | | | rgb(72, 62, 223) |

`area--sizes` shows the sm tier: 74 × 74 (22px cells). Figma, for comparison:

| slot · property | figma · align-group | figma · number-field | figma · paint-type cell |
|---|---|---|---|
| size | 88 × 24 (three 28.66 × 24 items, 1px apart) | 88 × 24 | 24 × 24, 4px apart |
| fill / edge | rgb(245, 245, 245), none | rgb(245, 245, 245), none | rgb(245, 245, 245) when selected |
| radius | 5px on the outer ends | 5px | 5px |
| glyph | 24 × 24 svg, rgb(0, 0, 0) | — | — |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| cell | (control + icon) / 2: 22 (min 20) / **24** / 28 (`alignment-picker.css:3, 15-17`) | Area tiers; Figma inspector cells 24 | — |
| outer inset | 4, border counted once | Inset contract | — |
| container paint | `input-bg-soft` light-dark(#f7f7f7, #282828) + 1px `border-decorative` #f3 (`alignment-picker.css:5-6, 10-13`) | Peer: soft field fill; Figma inspector controls rgb(245), flat | Figma draws no edge; kept (third pass): the edge bounds the grid of cells |
| radius | `radius-control` 8; cells 4 (`alignment-picker.css:12, 32`) | Nested radius rule | Figma 5 on its controls and cells |
| unselected mark | 2px dot `fg-muted` rgb(102) | Owner (prior decision) | — |
| selected mark | three 2px bars in a 16px box, aligned by column; `fg-selection` (neutral: `fg-default`; `alignment-picker.css:23`) | Owner (prior decision, 2026-09-26 tone note); Figma's alignment glyphs are black | Was `fg-accent` |
| selected backplate | none (`alignment-picker.css:52-54`) | Owner (prior decision) | Figma fills the selected cell (rgb 245) |
| hover | `bg-hover` light-dark(#1414140d, #fcfcfc24) on unselected, enabled cells (`alignment-picker.css:51`) | Audit rule: translucent hover on a component's own track (as Segmented) | Dark value 14% white since the second pass (audit decision 1), so it composites to the opaque hover step |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | translucent plate; marks fixed | not captured |
| checked | bars replace the dot | all tiles |
| focus-visible | 2px focus ring on the cell, raised (`alignment-picker.css:84-88`) | not captured |
| disabled | cells 50% (`alignment-picker.css:89`) | `area--disabled` |
| forced colours | checked cell outlined and bars in Highlight (`alignment-picker.css:90-94`) | not inspected |

## Behavior and accessibility

`role="radiogroup"` named by a consumer's `aria-label`, else `label`; nine native radios named "top left" … "bottom right"
(`AlignmentPicker.tsx:75-83`). The group is forced `dir="ltr"` because the positions are
physical. Arrow keys wrap within a row or column, Home and End reach the corners, and
selection follows focus (`AlignmentPicker.tsx:47-67`). `name`, `required` and `disabled` are
native (group `disabled` also sets `aria-disabled`); an uncontrolled picker restores `defaultValue` on form reset.

## Peers and consistency

| Peer | Shared role | Area value in peer | AlignmentPicker | Match / reason |
|---|---|---|---|---|
| Segmented | hover on its own track | `bg-hover` | `bg-hover` | match |
| ColorSwatchPicker | picker cell ladder | `control-xs/sm/md` 24 / 28 / 32, plate + ring (`color.css:83-85`) | (control + icon) / 2: 22 (min 20) / 24 / 28, bars (`alignment-picker.css:15-17`) | differs by design (audit F-31 A, owner 2026-09-30): two ladders kept; a swatch cell holds a chit, an alignment cell a mark |
| Radio / Checkbox / Chip | selection paint | Selection role, neutral by default | `fg-selection` bars | match |
| Input (soft) | field fill | `input-bg-soft` | same | match |
| All controls | disabled | 50% | 50% | match |

## Visual pass

2026-09-28, Claude in Chrome (batch 10): Figma's auto-layout Alignment grid (a frame selected, nothing
edited) beside the gallery's default tile at 3x. Same control: soft grey ground, grey dots, the chosen
position as three short bars. Differences, all owner decisions or earlier passes: Figma's grid is
88 x 56 (one field column by two field rows, non-square cells) where Area's is square 24px cells;
Figma draws no edge and a blue mark; Area keeps a decorative edge and a neutral mark. No change; the
grid-to-layout sizing is raised with the owner. Dark theme not compared.

Earlier note:

The gallery shows the tiles in named groups (Default, Variants, Tones, Sizes, Layout, States).
Beside Figma's inspector row the picker reads as the same soft control: a flat grey ground
and black marks, with Area's larger radius. Not inspected by this spec's author: hover, dark
theme, forced colours.

## Settled questions

1. **Container edge: kept.** Figma's inspector controls are flat rgb(245) with no edge
   (`figma--align-group`, `figma--number-field`); AlignmentPicker keeps a 1px
   `border-decorative` (#f3) on its #f7 ground. The picker is a grid of cells, and the edge
   bounds the grid ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).

## Verification

Compared the seven `alignment-picker/area--*` captures with `button-group/figma--align-group`,
`number-field/figma--number-field` and `color-picker/figma--paint-type-row--rest--light`.
Build and test results are in [the audit](../research/cohesion-audit.md#verification).
Unverified: Figma's nine-position control, hover and focus captures.

## Feedback log

- 2026-09-26 · earlier pass the same day → selected bars `fg-accent` → `fg-default`, `tone`
  axis added → `area--default`, `area--tone-accent`.
- 2026-09-26 · cohesion audit → no change; spec written → 6 Area captures.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change; sizes tile added; container edge recorded as open →
  `button-group/figma--align-group`, `number-field/figma--number-field`, `area--sizes`.
- 2026-09-27 · third pass → open question settled, value kept: the 1px decorative edge
  stays → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-28 · batch 10 Claude in Chrome side by side (Figma auto-layout Alignment grid) → no change;
  question: size the grid to one field column by two rows, as Figma does?
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → variant `surface` renamed `soft` (the field fill it borrows; `surface` means a lifted plate in Calendar, Toolbar and ColorPicker), `"surface"` kept as a deprecated React alias, CSS `.area-alignment-picker--soft` (alignment-picker.css:18; manifest default `soft`); a consumer's `aria-label` wins over `label`; group `disabled` sets `aria-disabled` (AlignmentPicker.tsx:72). No visual change.
- 2026-09-30 · audit F-31 (owner pick A) → the two picker ladders stay (swatch cells 24 / 28 / 32, alignment cells 22 / 24 / 28 at default density); Figma's 88 × 56 grid sized to the layout is answered later as a separate layout option (backlog in COMPONENTS.md), not a change to the square cells.
- 2026-10-03 · radius audit → cells are concentric with the picker, floored at the smallest control's corner (compact r2 → r4, default r4 → r5; `alignment-picker.css:31`). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · all even (owner) → cells floor at `radius-floor` 4 (`alignment-picker.css:31`).
