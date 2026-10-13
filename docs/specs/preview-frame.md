# Preview frame spec

**Status:** complete · 2026-10-13 (approved, review round 23)
**Captures:** `docs/research/captures/preview-frame/`
**Peers:** Box model (the inspector's other well: the same ground, line and corner), Asset row (the same well at 40 in a
row), Color swatch (the checker and the swatch ring), Card's media well (a recessed surface in a card), Panel (the
inspector it sits in)

## Owner decisions

- 2026-10-12: "keep working, start on the inspector components" (Figma Dev Mode reference) → the plan: Box model,
  Preview frame + Description list "show more", Link / Asset row, Token row + compact Code block, then the inspector
  rebuild. The app audit (PRODUCT_UI.md, open component gaps) lists "An Inspector preview well (icons and colours draw
  their own)".
- 2026-10-13: "continue the component work" → Preview frame, the plan's remaining part.
- 2026-10-13, after approving round 22: "i think it should share the same visual as the component container, with a
  white background and light stroke? or should the container also be light neutral 25?" → the frame takes the
  component tile's look (surface in Card's edge); the tile stays white. The grey well stays as `ground="subtle"`.

## Job and boundaries

Preview frame shows the one selected thing at the head of an inspector: an icon at a large size, an image or a vector
contained whole, or a colour filling it. It is a recessed well the width of its column, at a fixed aspect ratio, with
the content centred and never enlarged. Read-only. Not Card's media (a picture inside a card, cropped to cover), not
Asset row's preview (a 40 thumbnail in a row), not Color swatch (a mark at text size), not an image viewer (no zoom,
pan or controls).

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| aspect | `square` (1:1, default) | an icon or a component, as Figma's and Penpot's asset tiles | Figma Assets grid (96 × 96), Penpot grid view, the app's icon Inspector |
| aspect | `landscape` (4:3) | a layout or screen, at the gallery's tile shape | the app's component tiles (4:3) |
| aspect | `wide` (2:1) | a colour or a short banner | the app's colour Inspector |
| ground | `surface` (default) | the component tile in small: a component previews on the surface it is drawn for | owner; the gallery's tiles; Polaris Thumbnail (white with a hairline) |
| ground | `subtle` | a recessed well | Figma rgb(245) wells; Penpot canvas fill; Box model |
| ground | `checker` | an asset with transparency (an exported icon, a PNG with alpha) | Zeplin's asset preview on a checkerboard; Figma's export preview; Color swatch's checker |
| color | any CSS colour | the frame painted with it, over the checker so alpha shows | the app's colour Inspector |
| label | text | names the preview for assistive technology when the content is not already named | — |

Excluded: sizes (the frame fills its column; the aspect sets its height), a caption (the Inspector's heading names the
selection; Figma's tile name is a grid label), hover and selection (Figma's tile states belong to a selectable grid
item, not the well), zoom and pan (an image viewer).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| figma | target product | Assets panel, file library: the component grid tile (rest, hover) and a folder row's thumbnail | figma.com, the owner's "Foundation Doc Assets (Copy)", Design Mode, 2026-10-13, light. Read-only: panels opened, nothing selected or edited | evidence only | `figma--asset-tile--rest`, `figma--asset-tile--hover`, `figma--asset-folder-row--rest` |
| figma-dev | target product | Dev Mode's well (`common--well`) under the box model | `docs/research/captures/box-model/figma-dev--box-model--rest--light.json` | evidence only | (box-model) |
| survey | design systems | Penpot Assets grid view (@5eb33add), Polaris Thumbnail (@3f7954ae), Zeplin's asset preview | `docs/research/asset-row-survey.md` §1, Polaris, the summary table | evidence only | source reads |
| app | Area | the icon and colour Inspectors' own previews (`studio-icon-preview`, `studio-color-preview`) | `apps/desktop/src/studio.css` (before this change) | — | — |

Target products searched without an equivalent: ChatGPT (image attachments open in a viewer; no inspector), Notion
(page covers crop to cover; file blocks are rows). Figma's export preview needs an export setting on a layer, which
changes the file: not opened.

## Anatomy

```
figma asset tile (11/16 Inter)
shell     div.gridWrapper          96 × 116: the well, 4, the name
  media   div.thumbWrapper         drawn at 192 × 192 and scaled 0.5: renders 96 × 96, radius 5 (10 × 0.5),
                                   padding 6 (12 × 0.5), rgb(245, 245, 245) or the component's own frame fill
    content img.thumb               scale-down: 84 × 84 at most, centred, never enlarged
  text    div.nameWrapper          16 tall, 4 under the well, 2 in
figma folder row
  media   div.previewThumbnailWrapper  58 × 58, radius 5, padding 5, rgb(245, 245, 245); the image contained (48 wide)
figma-dev  common--well              rgb(245, 245, 245), radius 5
```

Area:

```
div   .area-preview-frame[--square|--landscape|--wide][--checker]   the well: grid, one centred cell
  (children)   an svg at its own size; img / video / canvas contained, scaled down only
```

Inset equation: content inset = shell padding (12); the stroke is drawn inside as an inset shadow, so it adds nothing.

## Measurements

Generated with `node scripts/capture-compare.mjs docs/research/captures/preview-frame/*.json`. The tile's media is
drawn at twice its size and scaled by `matrix(0.5 …)`: its padding 12 and radius 10 render as 6 and 5 (the content's
edge from the well is 6 6 6 6).

| slot · property | figma · asset-folder-row · rest · light | figma · asset-tile · hover · light | figma · asset-tile · rest · light |
|---|---|---|---|
| **shell** size | 224 × 74 | 96 × 116 | 96 × 116 |
| **shell** padding | 8 0 8 0 | 0 | 0 |
| **shell** radius | 5px | 5px | 5px |
| **shell** background | rgb(255, 255, 255) | rgb(245, 245, 245) |  |
| **shell** outline |  | 4px solid rgb(245, 245, 245) offset 0px |  |
| **media** size | 58 × 58 | 96 × 96 | 96 × 96 |
| **media** edge from shell (t r b l) | 8 158 8 8 | 0 0 20 0 | 0 0 20 0 |
| **media** padding | 0 (wrapper: 5) | 12 | 12 |
| **media** radius | 0px (wrapper: 5px) | 10px | 10px |
| **media** transform |  | matrix(0.5, 0, 0, 0.5, -48, -48) | matrix(0.5, 0, 0, 0.5, -48, -48) |
| **media** background | (wrapper: rgb(245, 245, 245)) | rgb(230, 230, 230) | rgb(25, 26, 31) |
| **media** shadow |  | rgb(230, 230, 230) 0px 0px 0px 1px inset |  |
| **content** size | — | 5.91 × 84 | 84 × 84 |
| **content** edge from parent (t r b l) | — | 6 45.05 6 45.05 | 6 6 6 6 |
| **text** edge from parent (t r b l) | — | 100 0 0 2 | 100 0 0 2 |
| **text** font | — | 11px/16px 400 Inter | 11px/16px 400 Inter |

(Rows with equal values trimmed; the full output is reproducible from the files. The folder row's wrapper values are
from the same session's direct read of `asset_panel_preview--previewThumbnailWrapper`: 58 × 58, padding 5, radius 5,
rgb(245, 245, 245); its image 48 wide.)

Area, from the same script (`area--<tile>--rest--<theme>.json`, 14 files, light and dark; re-captured after round 23). The gallery fits each
256 column to its tile (0.72 here), so box sizes read scaled; computed values are exact:

| slot · property | figma · asset-tile · rest · light | area · default · rest · light | area · content-image · rest · light | area · variant-wide · rest · dark |
|---|---|---|---|---|
| **shell** size | 96 × 116 (well 96 × 96) | 185.08 × 185.08 (256 × 256 at 1:1) | 185.08 × 185.08 | 252.92 × 126.45 |
| **shell** padding | 0 (well 12 × 0.5 = 6) | 12 | 12 | 12 |
| **shell** radius | 5px (well 10 × 0.5 = 5) | 12px | 12px | 12px |
| **shell** background | (well rgb(245, 245, 245)) | rgb(255, 255, 255) (`subtle`: rgb(247, 247, 247)) | rgb(255, 255, 255) | rgb(29, 29, 29) under the paint |
| **content** size | 84 × 84 | 92.53 × 92.53 (128 icon) | 167.73 × 167.73 (232 at 1:1) | — |
| **content** edge from parent | 6 6 6 6 | centred | 8.67 all round (12 at 1:1) | — |
| **content** radius | 0px | 0px (an icon) | 4px | — |

## Decisions

| Slot · property | Reference | Area | Basis | Reason when it differs |
|---|---|---|---|---|
| ground | rgb(245, 245, 245) (Figma tile, folder row, Dev Mode well); Penpot canvas fill; Polaris white | `bg-surface` by default; `bg-subtle` as `subtle` | owner (2026-10-13): the component tile's ground; `subtle` keeps Figma's well (Box model, Asset row) | Area's fills (`bg-subtle`, `bg-component`, ghost hovers) are tuned on the surface: on a grey ground a previewed component loses them |
| ground, own fill | Figma paints the tile with the component's frame fill (rgb(25, 26, 31) here) | `color`: the frame takes that colour, over the checker | Figma | — |
| edge | Figma: none at rest, a hairline at hover; Polaris Thumbnail 1px black 8% inset | 1px `border-card` (neutral 100, dark 750) inside, the tile's and Card's edge; `subtle`, `checker` and a colour take `token-swatch-ring` (black / white 10%) | owner (the tile's light stroke); peers: painted tiles, Asset row's well, Color swatch keep the translucent ring over paint | a solid line around a colour reads as a mat; the translucent ring shows evenly over any paint |
| corner | 5 at 58 and 96 (Figma's one well radius); Penpot 8 | `radius-container` (12) | peer: Box model's outer box, the well beside it in the same inspector (owner, round 12: "the outer container can be its own unique radius, that matches whatever component family it should be") | Figma uses one small radius everywhere; Area's container family at panel width |
| content inset | Figma 6 at radius 5; folder row 5 at 5; Penpot grid 8 at 8 | 12 (`space-12`) | target product + Penpot: the inset about equals the corner | Area's corner is 12 |
| content fit | Figma `scale-down`; Penpot `contain`; Polaris max 100% (contain) | an svg at its own size; img / video / canvas at most 100% each way, `contain`, never enlarged | agreement (Figma, Penpot, Polaris) | — |
| aspect | Figma and Penpot tiles square | `square` 1, `landscape` 4 / 3, `wide` 2 | Figma, Penpot; the app's tiles (4:3) and colour preview (2:1) | — |
| checker | Figma 10.67 cells #fff / #e1e1e1 (color-picker.md); Zeplin a checkerboard | Color swatch's checker (`fg-default` 16% through the 2 × 2 pixel mask) at 8 cells | peer: Color swatch's ink and mask | 8: Area's spacing step nearest Figma's 10.67; a swatch counts 5 cells across, a frame of any width needs a fixed cell |
| media corner | Figma 0 (the thumbnail image) | `max(radius-floor, radius-container − inset)`: 4 | DESIGN_SYSTEM.md nested radius | a square photo in a 12 corner read as a cut-out; Area nests corners |
| width | Figma 96 (grid), 58 (row) | the column's width (`inline-size: 100%`) | the app's Inspector previews | a frame per selection, not a grid tile |

Basis order: owner → target-product agreement → primary product for this context (Figma, inspector) → primary design
system → peer/baseline consistency.

## States

Static. Figma's hover (a 4px rgb(245) plate around tile and name, the well rgb(230) with a hairline) is a grid item's
hover: not this component's.

## Behavior and accessibility

A `div`. With `label` it is `role="img"` named by the label, and its content is hidden from assistive technology (a
drawn icon, a colour). Without one it is a plain container and its content speaks for itself (an `img` with its own
`alt`). Forced colours: a `CanvasText` border, and a painted colour keeps its fill (`forced-color-adjust: none` on the
paint layer). RTL: symmetrical.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Gallery tile | a component's frame | `bg-surface`, 1px `border-card`, corner 20 (the gallery's own) | `bg-surface`, 1px `border-card`, `radius-container` 12 | corner: the tile's 20 is fixed outside the radius setting; the frame follows the system's container corner |
| Box model | the inspector's well | `bg-subtle`, `radius-container`, 1px `border-subtle` | `subtle`: `bg-subtle`, `radius-container`, 1px swatch ring | ring, not `border-subtle`: the swatch ring outlines a well and paint alike |
| Asset row | a preview well | 40, `bg-subtle`, `radius-small`, swatch ring, icon at `icon-md`, image cover | the same paint at panel width; content contained | contain, not cover: the frame shows the whole asset; the row's thumbnail only identifies it |
| Color swatch | checker, ring | 2 × 2 pixel mask, `fg-default` 16%, 5 cells across; swatch ring inside | the same mask and ink at 8 cells; the same ring | fixed cell for any width |

## Visual pass

Headless Edge at 2×, light and dark, the gallery family and the app's icon and colour Inspectors:

- The grey well sits on the white tile and Inspector by its ring; in dark the ground steps up from the page and the
  white 10% ring reads as an edge, as Box model's.
- A contained photo had square corners inside the 12 corner and read as a cut-out → media corners nest (4).
- `chip-pixels.png`, first used for the checker tile, is fully opaque (a picture of a checker); the tile shows an icon
  on the checker instead.
- The landscape tile frames a Button as a component preview; wide fills with indigo; at 40% the checker shows through.
- The icon Inspector's well matches the Facts table under it (both 12 corners) and the Copy SVG button.

## Verification

2026-10-13: build (manifest parity, token references), React tests (preview-frame 3), typecheck, contracts, docs build
and audit, git diff --check; Area captured light and dark and compared above. Not verified: forced colours, compact
density in a screenshot (corner and inset tokens re-derive), Electron (only the browser preview).

## Review note, 2026-10-13 (round 22)

- **What changed:** New component. Preview frame is the well at the top of an inspector that shows what is selected:
  an icon large, an image whole, or a colour. It replaces the two previews the app drew for itself (icons and colours).
- **Why:** it's the last inspector part on the plan; its ground, corner, inset and fit come from Figma's asset wells
  (measured) and Penpot's and Polaris's thumbnails, and it shares Box model's grey ground and corner and Asset row's
  light outline, so the inspector's wells match.

## Review note, 2026-10-13 (round 23)

- **What changed:** the frame is now white with the same light outline as the component tiles in the gallery (dark: the
  tile's grey and its edge). The grey well is still there as a `subtle` option; colours and the checker keep the
  translucent outline.
- **Why:** you asked for it to match the component container. It also keeps previews honest: Area's light fills and
  hovers are drawn for a white surface and fade on grey, so a component previews on the surface it's made for.

## Feedback log

- 2026-10-13 · built from the Figma Assets captures.
- 2026-10-13 · round 22: approved, no notes.
- 2026-10-13 · "share the same visual as the component container, with a white background and light stroke?" →
  default ground `bg-surface`, edge `border-card` (the tile's); `subtle` added for the grey well; paint keeps the
  swatch ring → round 23.
- 2026-10-13 · round 23: approved.
