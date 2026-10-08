# ColorSwatchPicker spec

**Status:** accepted (owner; Complete in `component-status.mjs`; was: in review · 2026-09-26 (cohesion audit; second pass with Notion and Figma))
**Captures:** `docs/research/captures/color-swatch-picker/`
**Peers:** ColorSwatch (cell content), ColorPicker (saved colours, grid view, thumb ring),
Radio (single choice), AlignmentPicker and Segmented (selection marks), Chip swatch

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md), "Color picker, color
  field and swatches"):
  - [React Aria ColorSwatchPicker](https://react-aria.adobe.com/ColorSwatchPicker):
    labeled radio choices and separate selected/focus states. Area uses compact square
    cells, a legible selection ring and checkerboard transparency. ColorField inherits
    Input's typography and inset instead of introducing an unrelated monospace field.
  - *Color and alignment follow-up, 2026-09-24.* The earlier muted swatches were arbitrary
    demo hex values, not palette tokens. Color examples now use exact family-500 hex values
    from `packages/tokens/src/color/palette.json` (e.g. blue #006DF5, purple #8D4DF3, green
    #01AA4E). Alpha examples deliberately remain translucent. Swatches represent document
    color data and must not change with UI theme. The supplied Figma neutral values are
    retained only in the explicitly labeled split-field reference example. The palette
    source itself is unchanged.
- 2026-09-26 (recorded in [color-picker.md](color-picker.md#owner-decisions)): a grid
  swatch picker like iOS, "very robust in how it shows color selection". This added
  `layout="palette"`.
- Neutral by default, accent by override (2026-09-26): the selection ring is `fg-default`.
  *Since 2026-09-29 (owner, D1) the ring is the Selection role, `fg-selection` (color.css:113),
  accent by theme.*
- 2026-09-26, second pass ("decide all open items"), item 12: the cell is concentric with its
  swatch (swatch radius + inset). The gallery gained a sizes tile.

## Job and boundaries

ColorSwatchPicker chooses one colour from a fixed, labelled set, backed by native radios in a
`radiogroup`. It shows each option with a ColorSwatch and marks the checked one with a ring.
Free editing is ColorField / ColorPicker; display only is ColorSwatch.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm (24 cell), md (28, default), lg (32) | Cells on the control tiers | Figma 24px cells |
| layout | grid (default, `columns`), row (wraps), palette (contiguous, fills width) | Palettes; a compact row; the iOS-style grid in ColorPicker | Figma document colours (contiguous grid); iOS grid (owner reference) |

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Document colours in the colour picker | from the ColorPicker pass | evidence only | `color-picker/figma--swatches--rest--light` |
| react-aria | design system (docs) | ColorSwatchPicker | react-aria.adobe.com (owner decision above) | Apache-2.0 | — |
| area | this system | Gallery tiles, re-taken after the second pass (sizes tile added) | localhost gallery | — | `color-swatch-picker/area--*` |

Figma (`figma--swatches` nodes 9–21): 240-wide panel, 12px sides, 24 × 24 cells with no gap,
16 × 16 chits 4px in, radius 20%, inset 2px black 10% edge. The second pass's 38 Figma
captures add no swatch grid (the inspector colour row has one chit,
`input-group/figma--color-row` node 4). Notion's colour menu was not captured: its 39
captures cover tags and status dots (Badge) but no colour picker; ChatGPT has none.

## Anatomy

```
area   div.area-color-swatch-picker[role=radiogroup]  inline-grid, repeat(columns, cell), gap 4
  cell   label.area-color-swatch-picker__cell  cell square, radius = swatch radius + 4 (concentric); owns hover, ring, focus
    input  input[type=radio]  covers the cell, opacity 0
    swatch span.area-color-swatch  cell − 8, aria-hidden
palette  grid of minmax(0, 1fr) columns, gap 0, radius-control-sm 6, 1px 10% hairline outline, clip
```

Inset: swatch (cell − 8) centred, 4px on every side; the 2px ring leaves 2px between ring
and colour.

## Measurements

From the capture nodes:

| property | area · default (grid, md) | area · row (md) | area · sizes (sm) | area · layout-palette |
|---|---|---|---|---|
| shell | 188 × 60, 6 columns, gap 4 | 156 × 28, inline-flex, gap 4 | 80 × 24, gap 4 | full width, gap 0, radius 6, outline 1px rgba(0, 0, 0, 0.1) |
| cell | 28 × 28, radius 9px | 28 × 28, radius 9px | 24 × 24, radius 8px | square, radius 0 |
| swatch | 20 × 20 at 4, radius 5px | 20 × 20 at 4 | 16 × 16 at 4, radius 4px | fills the cell |
| checked cell | — | node 7: fill rgb(255, 255, 255), `rgb(40, 40, 40) 0 0 0 2px inset` | node 1, same ring | — |

Cells were 7px (md) before the second pass.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| cell | `control-xs/sm/md` 24 / 28 / 32 (`color.css:30-32`) | Figma 24 cells | md default follows the control tier |
| swatch | cell − 8 (16 / 20 / 24) | Figma 16 chit in 24 | — |
| gap | 4 (grid, row); 0 (palette) | Figma contiguous | The ring needs room between separate cells; palette follows Figma / iOS |
| cell radius | swatch radius (20% of the side) + the 4 inset: 7.2 / 8 / 8.8 (`color.css:95-97`) | Nested-radius rule (DESIGN_SYSTEM "Size and shape"); second pass item 12 | Was `min(radius-small + 2, cell / 4)`: 6 / 7 / 8, not concentric |
| hover | `bg-hover` (translucent) | Audit: translucent hover only on unknown grounds | Swatch cells sit on any surface |
| checked | `bg-surface` fill + 2px inset `fg-default` ring (`color.css:57-60`) | Owner: neutral by default; React Aria legible ring | Figma's selected chit not captured |
| palette · checked | thumb ring: inset 2px white, 1px 20% outside, 3px 20% inside, radius `radius-control-xs` 4 (`color.css:92-95`) | [color-picker.md](color-picker.md):129, the area thumb | Cells touch, so the ring is drawn inside the swatch rather than as a cell plate |
| palette · hover | inset 1px white 60% (`color.css:88-90`) | ColorPicker pass | Reason not recorded in color-picker.md |
| disabled | 50% on the cell (`color.css:66`) | Audit "Disabled": controls and pickers dim to 50% | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| hover | cell `bg-hover`; palette: 1px white inset on the swatch | `color.css:56, 88-90` |
| checked | ring as above | `area--row` node 7 |
| focus-visible | 2px focus ring at 2px offset on the cell (palette: inset) | `color.css:61-65, 96` |
| disabled | cell 50% opacity, not-allowed | `color.css:66` |
| forced colours | `Highlight` outline for checked and focus | `color.css:67-70` |

## Behavior and accessibility

Native radios named by each option's `label`; the group is named by `label` or `aria-label`.
Arrow keys move and select (Up/Down by column in grid and palette, with RTL for Left/Right);
Home/End reach the first and last enabled option (`ColorSwatchPicker.tsx:52-94`). `name`
and `required` are native. Nothing is preselected: with neither `value` nor `defaultValue`
no colour is chosen, so `required` can fail and "no colour" is representable; a form reset
returns to `defaultValue` or nothing (`ColorSwatchPicker.tsx:40-52`). Group `disabled` sets
`aria-disabled`.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Checkbox, Radio, AlignmentPicker | selection mark | Selection role, neutral by default | `fg-selection` ring | match |
| Segmented | hover on an unknown ground | `bg-hover` | same | match |
| Controls | disabled | 50% | same | match |
| ColorSwatch in the cell | nested radius | concentric = cell radius − 4 | cell 8, swatch 4 at md | match (was 9 / 5 before the swatch's 20% corner, 7 / 5 before that) |
| ColorPicker | saved colours | contiguous, 24px cells | uses this component | match |
| AlignmentPicker | picker cell ladder | (control + icon) / 2: 22 (min 20) / 24 / 28, bars (`alignment-picker.css:15-17`) | `control-xs/sm/md` 24 / 28 / 32, plate + ring (`color.css:83-85`) | differs by design (audit F-31 A, owner 2026-09-30): two ladders kept |

## Visual pass

2026-09-28, Claude in Chrome (batch 10): Figma's "On this page" swatches (16px chits in 24px cells,
radius 20%, a 2px 10% black inner edge drawn only on light chits such as #FAFAFA and #F5F5F5) beside
the gallery's grid and row at 2x. Area's chits share the shape (Color swatch's 20% corner) and show
their edge mainly on white (neutral 50). No change. Observed: Figma splits translucent chits (opaque
half, checker half). Dark theme not compared.

Earlier note:

The gallery shows ColorSwatchPicker's tiles in named groups; the palette layout and
the sizes each have a tile. Unverified: Figma side by side, dark theme, a selected
Figma chit.

## Verification

Compared the Area captures (`color-swatch-picker/area--*`) with
`color-picker/figma--swatches`. Build and test results are in the
[cohesion audit](../research/cohesion-audit.md#verification).

## Motion and interaction, 2026-10-07

Per `docs/MOTION.md` (hover plate and selected colour: in at once, out on `fast`).

| Interaction | Before | After |
|---|---|---|
| Cell hover plate | instant in and out | in at once, out on `fast` / `ease-out` (`background-color`) |
| Selected ring (2px inset) and surface | instant in and out | in at once; the ring leaving a cell fades on `fast` / `ease-out` (also on arrow keys, one 100ms trail) |
| Palette hover ring (1px white inset) | instant in and out | in at once, out on `fast` (the swatch's `box-shadow`, inherited by its colour layer) |
| Palette selected rings | instant in and out | in at once, out on `fast`; the corner snaps square (radius never animates) |
| Focus ring (outline) | instant | unchanged |
| Disabled opacity | instant | unchanged |

Verified on `color-swatch-picker.html`: a newly checked cell has `transition-duration: 0s` and no
running animation; the cell it left runs `background-color` and `box-shadow` for 100ms. Open
question: on keyboard arrowing, should the leaving ring also be instant (MOTION.md: keyboard-driven
changes instant)? Recommendation: keep the 100ms fade; it is short enough not to lag.

## Feedback log

- 2026-09-26 · cohesion audit → no change; spec written → `color-swatch-picker/area--*`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → cell radius
  concentric with the swatch (8 / 9 / 10); sizes tile added; no new product swatch grid →
  `color-swatch-picker/area--row` (cell 9px), `area--sizes` (cell 8px).
- 2026-09-28 · batch 10 Claude in Chrome side by side (Figma swatch grid) → no change.
- 2026-09-28 · owner: match the pickers to the latest Color swatch → cell corner (hover plate, selected
  ring) concentric with the swatch's 20% corner (`swatch x 0.2 + inset`); was the old `min(radius-small,
  size / 4)` → 4x shots of the grid and Color picker's saved colours.
- 2026-09-30 · audit S17 (API vocabulary, slice 3/4) → no preselection: with neither `value` nor `defaultValue` nothing is chosen (was the first enabled option), so `required` can fail; a form reset returns to `defaultValue` or nothing (ColorSwatchPicker.tsx:40, :49); group `disabled` sets `aria-disabled`. Gallery demos pass `defaultValue` explicitly; no visual change.
- 2026-09-30 · audit F-31 (owner pick A) → no change: swatch cells keep the control ladder 24 / 28 / 32, separate from AlignmentPicker's cells (22 / 24 / 28); recorded under Peers.
- 2026-10-03 · radius audit D6 (owner) → the cell corner is the swatch's whole-pixel corner plus the inset: 20 → 6, 24 → 7, 28 → 8, 32 → 9 (was 6.4, 7.2, 8, 8.8) (`color.css`). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-03 · roundness → cells are the swatch's shifted corner plus the inset (`color.css`). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-03 · all even (owner) → cells are the even swatch corner plus 4: 6 / 8 / 8 / 8 (`color.css`).
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → hover plate and selection ring in at once, out on `fast` (`color.css`). See "Motion and interaction, 2026-10-07".
