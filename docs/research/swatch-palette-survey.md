# Swatch palette: hover / selected / focus survey

2026-10-12 · for Color swatch picker `layout="palette"` (owner, review round 17: the palette's
hover/selected "looks odd … look at other real examples"). Research only; no CSS changed.

**Evidence grades.** *Source*: read from code at a pinned commit (exact). *Screenshot*: read
from pixels of a published screenshot (estimate; scale unknown, compression blurs ±1px).
*Not measured*: named but not verified, so not used as a basis.

## Pinned sources

| Id | Repo @ commit | File |
|---|---|---|
| fluent9 | microsoft/fluentui @ `389e06cc` | `packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/useColorSwatchStyles.styles.ts`; `…/SwatchPicker/useSwatchPickerStyles.styles.ts`; tokens `packages/tokens/src/{global/strokeWidths,alias/lightColor,alias/darkColor}.ts` |
| fluent8 | same commit | `packages/react/src/components/SwatchColorPicker/ColorPickerGridCell.styles.ts` |
| spectrum | adobe/react-spectrum @ `390f1820` | `packages/@react-spectrum/s2/src/ColorSwatchPicker.tsx`; `packages/@adobe/react-spectrum/src/color/ColorSwatchPicker.tsx` (v3); `packages/@react-spectrum/s2/style/index.ts` |
| tinymce | tinymce/tinymce @ `46cb5f7e` | `modules/oxide/src/less/theme/components/color-swatch/color-swatch.less` |
| closure | google/closure-library @ `b312823e` | `closure/goog/css/palette.css`, `colorpalette.css` (the legacy Docs/Gmail palette) |
| antd | ant-design/ant-design @ `90af4e84` | `components/color-picker/style/presets.ts`; `components/color-picker/components/ColorPresets.tsx` |
| mantine | mantinedev/mantine @ `e243f7f9` | `packages/@mantine/core/src/components/ColorPicker/{ColorPicker.module.css,Swatches/Swatches.tsx}` |
| ckeditor | ckeditor/ckeditor5 @ `a2ceebdf` | `packages/ckeditor5-ui/theme/components/colorgrid/colorgrid.css` |
| gutenberg | WordPress/gutenberg @ `72f698c9` | `packages/components/src/circular-option-picker/style.scss` |
| ios | screenshot | iOS 14 Notes markup picker, Grid tab, gadgethacks.com article image `xlarge_637367882096412872_3f938eb00b.webp` (887 × 1920) |

## Contiguous (no-gap) grids

**Apple iOS/iPadOS `UIColorPickerViewController`, Grid tab** (*screenshot*; HIG "Color wells"
and the UIKit reference describe no cell states). 12 columns × (1 grey row + 9 hue rows), no
gaps or separators, rounded container. Pixel scan of the selected dark-indigo cell
(grid x 38–850 ⇒ pitch 67.7 image px):
- **Selected:** one **white** ring (≈ 252 lum) about **6 px ≈ 9% of the cell** (≈ 2.5–3 pt).
  Its outer edge sits **≈ 2 px (≈ 3%) outside** the cell on every side (ring box 72 × 73 on a
  67.7 cell), so it overlaps the neighbours and is drawn above them. Outer corners are
  **slightly rounded** (onset at ≈ 1.5 px on the diagonal ⇒ r ≈ 5 px ≈ 7% of the cell). The
  colour inside is not scaled. **No dark keyline** outside the white; a 1–2 px darker band
  just inside and outside the ring may be a faint shadow or compression ringing (unresolved).
- **Light cells:** no screenshot with a pale or white cell selected was found, so how Apple
  keeps a white ring visible on the white/pastel rows is **not verified**.
- **Hover / focus:** touch UI; none seen. Two other screenshots (dev.to, hackingwithswift)
  show no selection when the colour is not exactly a grid cell.
- macOS `NSColorPanel` has no contiguous grid (wheel, sliders, palettes list, image, pencils).

**TinyMCE `.tox-swatch`** (*source*, color-swatch.less:5–44, 79–98). 30 px squares in flex
rows with no gap.
- **Hover = focus:** `box-shadow: 0 0 0 1px rgba(127,127,127,.3) inset; transform: scale(.8)`,
  `transition: transform .15s, box-shadow .15s`. The colour *shrinks* and the menu surface
  shows around it, a temporary 3 px gap.
- **Selected:** a 24 px check icon, `fill: #fff; stroke: #222f3e; stroke-width: 2px;
  paint-order: stroke` (white glyph with a dark outline: legible on any colour).

**Google Closure `goog-palette`** (*source*, palette.css:19–33, colorpalette.css:16–38). 18 px
cells, collapsed table with `1px solid #666` separators.
- **Hover:** `border: 1px solid #fff` inside the cell (colour shrinks to 16 px).
- **Selected:** `border: 1px solid #333` + a check sprite. No focus style (`outline: none`).

**Figma document colours** (from `docs/specs/color-swatch-picker.md`): 24 px cells with no gap,
but each holds a 16 px chit 4 px in, so colours never touch. Hover/selected were not captured.

**Not measured:** Office desktop "Theme Colors" (its shade columns touch vertically), current
Google Docs/Sheets text-colour menu, Canva, FigJam. Notion's colour menu is a list, not a grid.

## Gapped swatch pickers (for contrast)

| System | Gap | Hover | Selected | Focus |
|---|---|---|---|---|
| **Fluent 2** (fluent9, lines 27–101; picker gap 2/4, SwatchPicker:25–26) | 2 or 4 px | inset 2px `colorBrandStroke1` + inset 3px `colorStrokeFocus1` (brand ring, 1px white inside) (31–35) | inset **3px brand** + to 5px **white** (2px white inside); hover thickens to 4 + 6 (77–85); sm/xs: 2 + 3 (93–101) | inset 2px `colorStrokeFocus2` + 3px `colorStrokeFocus1` = black + white, swapped in dark (46–50, 86–88) |
| **Fluent 8 SwatchColorPicker** (Office web lineage; fluent8, 5–10, 93–126) | `cellMargin` | colour shrinks inside a **2px (≥24 px cells: 4px) neutral border + 2px body-bg padding** (`neutralLighter`) | same frame in `neutralLight`; hover adds 1px `neutralSecondary` | outline at `borderWidth − 1` offset |
| **Spectrum 2** (spectrum s2, 82–87, 101–140; focusRing index.ts:78–90) | compact 2 / regular 4 / spacious 6 | none on the item | overlay, **inset**: `border 2px gray-900` + `outline 2px gray-25, offset −4` = 2px dark then 2px light, inside the swatch; square by default (`rounding: none`) | 2px `focus-ring` outline **outside**, offset 2 |
| **Spectrum v3** (v3, 71–77, 96–131) | 0.5 / 1 / 2 units | none | `inset 0 0 0 2px gray-900, inset 0 0 0 4px gray-50` | 2px focus-ring outline, offset 2 |
| **Ant Design** (antd presets.ts:52–106; ColorPresets.tsx:27–35) | 6 | 1px `colorFill` frame 2px outside the swatch, `motionDurationMid` | check mark, white, or `rgba(0,0,0,.45)` when luma > 192; scales in with `easeOutBack` | — |
| **Mantine** (Swatches.tsx:48–50; module.css:70–90) | 4 | none | check icon at 35%, white if `luminance < 0.5` else black | default focus ring |
| **CKEditor 5** (colorgrid.css:43–118) | tight | inset 1px canvas + 2px outside `interactive-focus-border` | inset 1px canvas + **2px outside `text-primary`** + check icon | same as hover |
| **Gutenberg** (style.scss:4–5, 36–50) | 12 (28 circles) | `scale(1.1)`, 100ms ease-out | check icon over the swatch | — |

## What the evidence says

1. **Contiguous grids draw the state inside or exactly on the cell. They never add an outer
   grey edge.** TinyMCE, Closure and Fluent 8 shrink the colour inside a frame. Spectrum and
   Fluent 2 inset their rings. Apple overhangs by ≈ 1 pt but adds only white, with no keyline.
   Area's selected cell is the only one with a 1px light-grey edge *outside* the cell. Painted
   on neighbouring colours, that edge reads as a seam or gap, not as an edge. The thumb's edge
   was meant for a gradient field.
2. **Every system that solves light *and* dark cells pairs two tones**: Spectrum (gray-900 +
   gray-25/50, swapped in dark), Fluent 2 (brand or black + white), Closure (#333 + check),
   TinyMCE (white glyph + dark stroke), Ant and Mantine (glyph colour by luminance). Apple's
   single white ring is unverified on pale cells, and Area's palette has a white row and
   pastel rows.
3. **Selected rings are 2–4 px total in the cell's square shape.** Spectrum is square by
   default. Fluent follows the swatch shape. Apple rounds only slightly (≈ 7% of the cell), and
   its ring overhangs, so the rounded corner falls on neighbours' colour. Area rounds the
   selected swatch to 4px inside a square cell, which cuts the cell's corners and shows the
   container surface in four notches. That is the second source of oddness.
4. **Hover is a lighter version of the selected geometry**, or the colour shrinking to reveal
   the surface (TinyMCE, Fluent 8, Closure). Area's hover, a 1px white at 60%, belongs to a
   different family from its selected ring and disappears on the white and pastel rows.
5. **Motion:** only gapped systems scale (Gutenberg 1.1). TinyMCE's 0.8 shrink in a contiguous
   grid opens a temporary hole. Ring and frame changes are otherwise instant or ≤ 150ms
   box-shadow fades. Area's "in at once, out on fast" fits.

## Recommendation for Area's palette

The palette is the same ColorSwatchPicker with a different layout, so it should show the
**same selection paint as the gapped rows**: a 2px `fg-selection` ring around a surface plate
around the colour. Contiguous cells have no room outside, so draw it **inside** the cell, in
the same order. This is Spectrum's two-tone inset ring and Fluent 8's colour-in-a-frame
together. It also keeps layout separate from state (AGENTS.md).

| State | Paint (on the swatch, square cell, nothing outside the cell) | Basis |
|---|---|---|
| rest | unchanged: square, contiguous, 1px 10% container hairline | iOS, TinyMCE, Closure |
| hover | `inset 0 0 0 2px var(--area-bg-surface), inset 0 0 0 3px var(--area-token-swatch-ring)` | The surface plate appears, as the gapped hover changes the cell's plate. Fluent 8 frame, TinyMCE / Closure shrink; 2px = the gapped row's ring-to-colour gap. The 10% inner line keeps it visible on white cells (light) and near-black cells (dark), matching the thumb's inner line. |
| selected | `inset 0 0 0 2px var(--area-fg-selection), inset 0 0 0 4px var(--area-bg-surface), inset 0 0 0 5px var(--area-token-swatch-ring)` | The gapped row's 2px `fg-selection` ring and 2px plate, collapsed inward. Spectrum v3 `inset 2px gray-900, inset 4px gray-50` uses the same widths. The dark tone shows on pale cells and the surface tone on dark ones, and the pair swaps with the theme as Spectrum's does. |
| selected + hover | as selected | Fluent thickens; Area keeps foreground fixed on hover |
| focus-visible | keep the 2px inset focus outline. On a selected cell it replaces the `fg-selection` ring, and the plate inside keeps it distinct. | Fluent 2 swaps its brand ring for the focus pair in the same position |
| radius | 0 on interior cells. A corner cell's outer corner takes the container's `radius-control-sm` so its ring follows the clip. **Drop** `radius-control-xs` on selected. | Spectrum `rounding: none`; avoids the four corner notches |
| z-index / outer edge | none. **Drop** the `0 0 0 1px border-subtle` outer edge and the raise. | No contiguous reference paints outside the cell |
| motion | keep: in at once, out on `fast` (box-shadow only); no scale | TinyMCE 150ms; scaling opens holes in a contiguous grid |
| forced colors | keep the `Highlight` outline | — |

**Colour left inside the selected cell:** cell − 10 (5 px per side, counting the hairline). At
≈ 20 px cells, about 10 px of colour remains. Spectrum (S, 24 px swatch: 4 px per side) and
Fluent 2 (md 28: 5 px per side) leave a similar share. If the browser check shows too little
colour, drop to a 1px plate: `2px fg-selection, 3px surface, 4px hairline`. Keep the ring at
2px to match the rows.

**Relation to the thumb:** the palette shares the thumb's inner 10% `swatch-ring` line and the
"opaque surface ring around the colour" idea. The thumb keeps its white 4px ring, grey edge
and lift because it floats over a continuous field. A swatch cell is a choice among options,
so it uses the option-selection paint.

**Alternative (the owner's iOS reference, closer to Apple):** a 2px white ring flush with the
cell edge (Apple overhangs ≈ 1pt; Area's container clips), square corners and the 1px 10%
inner line, with no grey outer edge. It looks most like iOS, but on the white and pastel rows
in light mode only the 10% line shows. Apple's own handling of pale cells is unverified, so
this needs owner sign-off after a browser check.

## Open / unverified

- Apple: selected state on pale or white cells, iPadOS pointer hover, keyboard focus, and
  whether the faint band around the ring is a shadow. Needs a device or simulator capture
  (this machine has Command Line Tools only, so no simulator).
- Office desktop Theme Colors and Google Docs/Sheets current palette states: not measured.
- Cell size in ColorPicker's grid (≈ 20 px assumes 12 columns in the 248 px content box):
  confirm with `area-capture.js`.
