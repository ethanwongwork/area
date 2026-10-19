# Folder spec

**Status:** accepted · 2026-10-19 (round 48)
**Captures:** none in `docs/research/captures/` (Finder is native). Finder's art and settings were read on this
machine; see `docs/research/file-explorer-2026-10-18/README.md` §7.
**Peers:** File tile (its main host), Empty state's icon tile, Avatar (badge), Asset row's preview well.

## Owner decisions

- 2026-10-18: "work on the folder ui component first … add file explorer components and ui to this design system".
  References: a macOS Finder window in dark mode (blue folders, "6 items" under each name) and a knowledge-base app
  (gray folder tiles with sheets peeking out and app badges at the pocket's foot, a folder tree with counts).
- 2026-10-18, later: "i want the folder design to be very simple shapes and to be styled exactly like apples finder
  folders, but with some slight differences. the paper inside should be pretty straight, just 1 paper, not multiple
  angled papers." With a reference image: Finder's blue folder holding one white sheet. Replaced the first build
  (neutral default, three fanned cards, a lowered pocket).
- 2026-10-18, later: "can you make the folder more round, and the dimensions less realistic, more large. also make the
  gradients, shadows, more soft and the colors brighter." Corners doubled, the figure fills more of its box, each
  stop brighter with half the top-to-foot step, the shadow wider and fainter.
- 2026-10-18, later: "make it so the folder and the paper inside radius are a bit closer in radius. i also want to see a
  simplified grey folder with light grey stroke around it instead of blue, or as an alternative design for now." With a
  reference (AccessGrid's menu: a flat #f5f5f7 folder, #d8d8dc edge, the item count "5" at the foot's end). The sheet's
  corners became concentric (34 = 56 − 22); added `variant="outline"` and `count`.
- 2026-10-18, later: "i also still want 2 layers of the folder, also i want the strokes to be thinner." The outline draws
  the back and the pocket, each with an edge of clamp(0.75px, 0.85% of the size, 2px).
- 2026-10-18, later: "these strokes are very inconsistent, thickness, and also appear to double up on the bottom. the
  text size of the number and PNG should be more consistent … do more research on these illustrations and refine them".
  From the survey (research README §10): the outline edge is a whole pixel (1px to 191, 2px from 192; Fluent's
  hand-drawn 1–2px), the back's edge is drawn only where it shows (`__rim`, from the pocket's straight sides up), so no
  edge doubles; the solid pocket gets Finder's 1px lips (light top, shaded foot); the count shares File page's label type
  (cap ≈ 9% of the box, regular, baseline 7% up).

- 2026-10-18, later: "maybe just make the outline appearance the default appearance, keep the colored version as an
  alternate variant." `variant` defaults to outline; solid (Finder's lit folder, `tone`, `contents`) is the alternate.

- 2026-10-19: approved on the review page (round 48), with "make sure the size of everything is correct and consistent
  and accurate. the avatar badge looks quite large?" and "refine the open state so it looks more obvious that its
  open". The figure's box is rounded to even whole pixels (88 × 78 at 96, its edges on whole pixels); the badge's marks
  are 12.5% of the box (12 at 96; the reference's ~11% of the folder), on the count's inset; count 12px at 96. Open: the
  pocket tips toward the viewer (its top from 88 to 152, flaring 16 past each side) and a sheet rises out to 30, on
  `base`; in the outline style the sheet waits tucked behind the pocket.

## Job and boundaries

Draws a folder as a figure: back panel with its tab, one sheet when it holds something, front pocket, optional badge.
It is artwork in a square icon box, not a control: the File tile (or a caller) owns the name, selection, focus and
opening. The 16 px `folder` glyph in `@area/icons` stays the icon for rows, menus and the Sidebar; Folder is for icon
views at 48 and up.

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 48 · md 64 · lg 96, unset follows `--area-folder-size` | Finder's icon view defaults to 64 (`defaults read com.apple.finder StandardViewSettings`, iconSize = 64); 48 and 96 are in Fluent's file-type icon sizes (`getFileTypeIconProps.ts:40`). sm / lg are picks pending the owner. | Finder icon view, Fluent file icons |
| tone | blue (default, Finder's) · neutral · cyan · green · yellow · orange · red · pink · purple · brown | The owner: "styled exactly like apples finder folders". Finder's folders take tag colours (macOS Tahoe "Customize Folder"); Figma folders take colours (Aug 2026). Each hue keeps Finder's lightness and chroma per stop (OKLCH), neutral at no chroma. No `accent` tone (tone.test.mjs: accent reaches components only through roles). | Finder, Figma |
| contents | none · a count · image URLs | Finder's empty folder shows none; with anything inside, one straight white sheet (the owner's difference from Finder); an image fills the sheet. | owner's reference |
| badge | any small marks | the knowledge-base reference's app marks at the pocket's foot; Dropbox's shared / team badges | reference 2, Dropbox |
| variant | outline (default) · solid | solid: Finder's lit folder. outline: the owner's simplified grey folder, back and pocket in `bg-subtle` with a thin `border` edge (clamp(0.75px, 0.85% of the size, 2px); the reference's 2 of 216, thinner per the owner), no sheet or shadow | owner, AccessGrid |
| count | any number | the reference's item count at the foot's end: 16% of the box, tabular; white 90% on solid, #b0b0b6 on outline | AccessGrid |
| state | open (`data-open`) | a drag over a folder; Mantine's "inside" drop target, Finder's spring-loaded folders | Finder, Mantine |

Excluded: several or angled sheets (owner), an emoji or symbol on the pocket (Tahoe's customisation: later, if asked).

## Sources

| Id | Type | What | Link / path |
|---|---|---|---|
| finder | target OS | the live folder icon drawn at 512 and 64 (`NSWorkspace.shared.icon(forFile:)` on an empty folder; a folder with items draws the same icon), sampled per pixel; Finder view settings | macOS 27.2; `defaults read com.apple.finder StandardViewSettings` |
| finder-2 | target OS | GenericFolderIcon.icns (an older, flat-light drawing; superseded by the live icon) | `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns` |
| owner | owner reference | Finder's folder with one white sheet | owner's message, 2026-10-18 |
| fluent | design system source | folder.svg geometry and sizes | microsoft/fluentui @f02cfa8f, `packages/react-file-type-icons` |

## Anatomy

```
Finder live icon (512 cell)
cell      512 × 512           owns: the square icon box
  figure  470 × 378 at 21,67  owns: the folder's bounds
    back  tab 0 → ~136 at the top, an S-ease down to y 33 by x ~190; corners ≈ 28; #82d0f2 → #3aa7dc
    front y 68 → 378 (18% down), corners ≈ 28; #7dd2f7 → #44acdc
    shadow under it, black 36% fading over 24
```

Area:

```
.area-folder              square box, --_size; tone sets --_h / --_k
  __figure                inset 8% 4% (fills 84 × 92%; Finder 74 × 92%)
    svg 470 × 420         drop-shadow 0 2% 4.5% black 12%
      __back              tab 40 high to x 150, easing down to 214; corners 56; --_back-top → --_back over 0–88
      __paper             one rect 22,54 426 × 220, rx 34 (concentric), white (an image fills it)
      __front             rect y 88 (21%), rx 56, --_front-top → --_front over 88–420
    __badge               6% in, 7% up from the pocket's foot
```

## Measurements

| Value | Area | Source |
|---|---|---|
| figure in its box | 470 × 378 of 512 | finder (alpha bbox 21,67 → 491,445) |
| tab | top 0 to x ~136, eases to y 33 by x ~190 | finder (top edge per column: 3 at 147, 8 at 155, 18 at 163, 26 at 171, 31 at 179, 33 at 187) |
| back's top line | 33 / 378 | finder |
| pocket top | 68 / 378 (18%) | finder (colour step at y 135 of 512) |
| corners | 28 of 470 | finder (left edge per row at the top-left, pocket and foot corners) |
| back paint | oklch(0.819 0.091 227.7) → oklch(0.690 0.124 234.1) | finder #82d0f2 → #3aa7dc |
| pocket paint | oklch(0.823 0.097 227.9) → oklch(0.704 0.117 232.0) | finder #7dd2f7 → #44acdc |
| shadow | 0 1.2% 2% black 20% of the size | finder (36% under the edge, gone by 24/512); softened, a pick |
| sheet | x 15, y 49, 440 wide, white, rx 6 | owner's reference (3.2% in, 13% down) |
| open | pocket scaleY 0.94 from its foot, sheet up 12, on `fast` ease-out | pick (MOTION.md durations) |

The rows above are Finder's. Area's after the owner's "more round, more large, softer, brighter" (picks from them):
box 470 × 420 filling 92 × 84% of the cell; tab 40; pocket 88 down (21%); corners 56; sheet 22,54 426 × 220 rx 34 (concentric);
stops back oklch(0.85 0.10) → (0.77 0.125), pocket (0.88 0.095) → (0.80 0.12); shadow 0 2% 4.5% black 12%.

## Accessibility

Decorative by default (`aria-hidden`): the tile's name says what it is. With `label` it is `role="img"` with that
name. Forced colours drop the shadow and draw both panels as Canvas with a CanvasText edge.

## Open

- Owner: sm / lg sizes; whether the sheet should show more (Finder's own empty folder shows none).
- Not measured: Finder's selection painting in icon view (label pill, icon backdrop).

## Review note, 2026-10-18 (round 48)

- **What changed:** New, redrawn after your notes: Finder's folder, measured from the live icon on this Mac, then made
  rounder (corners twice Finder's), larger in its box, softer (half the gradient step, a wider, fainter shadow) and
  brighter, in Finder's blue by default; the sheet's corners now follow the folder's (concentric). New: an outline
  variant, the simplified grey folder from your AccessGrid reference (two layers, one even whole-pixel edge, no doubled
  lines), and a count at the foot's end in the same type as File page's label. The solid pocket has Finder's 1px lips. With anything inside, one
  straight white sheet stands in it above the pocket (an image fills it in the Brand tab). Three sizes (48, 64 as
  Finder's default, 96), neutral and nine more hues at Finder's lightness, a badge at the pocket's foot and an open
  state for a drag.
- **Why:** You asked for very simple shapes styled exactly like Finder's folders, with one straight sheet instead of
  angled ones. To decide: whether 48 / 96 are the right small and large sizes, and whether the sheet should show more.
