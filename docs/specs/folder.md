# Folder spec

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
  the back and the pocket, each with an edge of clamp(0.75px, 0.85% of the size, 2px). — superseded the same day (next
  entry): one whole-pixel edge, the back's drawn only where it shows.
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
| badge | any small marks at the pocket's foot, at the start: 12.5% of the box (12 at 96), on the count's inset; an Avatar takes that size | the knowledge-base reference's app marks (~11% of the folder); Dropbox's shared / team badges; owner 2026-10-19 ("the avatar badge looks quite large") | reference 2, Dropbox |
| look | outline only (solid, `tone` and `contents` archived, round 57: docs/archive/solid-file-figures-2026-10-19.md) | the owner's simplified grey folder, back and pocket in `bg-component` with one whole-pixel `border` edge (`stroke-width`, 1px to 191, 2px from 192), the back's edge only above the pocket (`__rim`), no shadow; its sheet (`bg-surface` light, `bg-component-hover` dark, the same edge) waits tucked until the folder opens | owner, AccessGrid; 2026-10-18; round 57 |
| count | any number | the reference's item count at the foot's end: 13% of the box (cap ≈ 9%; 12 at 96, 8 at 64), regular, tabular, cap-trimmed, 7% of the box up and 9% of the figure in, in the quiet ink (muted mixed 45% toward the fill) | AccessGrid; File page's label type (owner 2026-10-18); coherence pass |
| state | open (`open` → `data-open`, or inside a `[data-drop-target]`): the pocket tips forward (top 88 → 152, flaring 16 past each side), the sheet rises to 30; `base` ease-in-out in, `fast` out | a drag over a folder; Mantine's "inside" drop target, Finder's spring-loaded folders; owner 2026-10-19; coherence pass | Finder, Mantine |

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
.area-folder              square box, --_size (size, else --area-folder-size, 64); tone sets --_h / --_k
  __figure                92% of the box wide, height 420/470 of that, both rounded to even pixels, centred
                          (88 × 78 at 96, 58 × 52 at 64, 44 × 40 at 48)
    svg 470 × 420         no shadow
      __back              tab 40 high to x 150, easing down to 214; corners 56;
                          outline: --_fill (bg-component), no stroke
      __rim               the back's edge from the pocket's straight sides (y 144) up round the tab
      __paper             one rect 22,54 426 × 220, rx 34 (concentric); tucked 72 down (behind the pocket); open: 24 up
      __front             path y 88 (21%), rx 56;
                          outline: --_fill with the edge
    __badge               start, 9% of the figure in, 7% of the box up; marks 12.5% of the box
    __count               end, 9% of the figure in, 7% of the box up
```

## Decisions

| Slot · property | Area value | Basis |
|---|---|---|
| figure | 470 × 420 drawing, 92% of the box wide, rounded to even pixels | owner 2026-10-18 ("more large"); 2026-10-19 (whole pixels) |
| tab · pocket · corners | tab 40, pocket 88 down (21%), corners 56 (twice Finder's 28) | owner 2026-10-18 ("more round") |
| sheet | 22,54 426 × 220, rx 34 (56 − 22, concentric); `bg-surface` light, `bg-component-hover` dark, with the edge, drawn over the back's edge | owner 2026-10-18; coherence pass 2026-10-19 |
| outline fill | `bg-component` | coherence pass 2026-10-19 (was `bg-subtle`) |
| outline edge | `border`, max(`stroke-width`, size / 96 rounded down to a whole pixel) | owner 2026-10-18 ("strokes are very inconsistent"); coherence pass |
| quiet ink | `fg-muted` mixed 45% toward the fill | coherence pass 2026-10-19 (was #b0b0b6 / #6e6e74) |
| count | 13% of the box, regular, tabular, cap-trimmed, 7% of the box up, 9% of the figure in from the end | owner 2026-10-18 (File page's label type); 2026-10-19 (12 at 96) |
| badge | marks 12.5% of the box, 9% of the figure in from the start, 7% up | owner 2026-10-19 |
| open | pocket top 88 → 152, flaring 16 past each side; back's edge follows it down; sheet to 30 (24 up) | owner 2026-10-19 ("more obvious that its open") |
| motion | open on `base`, close on `fast`, `ease-in-out` (pocket path, rim path, sheet transform) | coherence pass 2026-10-19 (MOTION.md: shape moving while visible) |

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

The open row is superseded (owner 2026-10-19 and the coherence pass); Decisions holds the current open state and motion.

The rows above are Finder's. Area's after the owner's "more round, more large, softer, brighter" (picks from them):
box 470 × 420 filling 92 × 84% of the cell; tab 40; pocket 88 down (21%); corners 56; sheet 22,54 426 × 220 rx 34 (concentric);
stops back oklch(0.85 0.10) → (0.77 0.125), pocket (0.88 0.095) → (0.80 0.12); shadow 0 2% 4.5% black 12%.

## Accessibility

Decorative by default (`aria-hidden`): the tile's name says what it is. With `aria-label` (or the deprecated `label`) it is `role="img"` with that
name. Forced colours drop the shadow and draw both panels as Canvas with a CanvasText edge.

## Open

- Owner: sm / lg sizes; whether the sheet should show more (Finder's own empty folder shows none).
- Not measured: Finder's selection painting in icon view (label pill, icon backdrop).

## Coherence pass, 2026-10-19

Owner: "make sure everything goes through a deep coherence pass with current area components … gaps, padding,
spacing, layout, density, radius, type styles, fills, fgs … interaction, hover states … accessible and intentional …
in the end the version that we build is an area component." Checked against Asset card, ListBox's grid, PRODUCT_UI
rules 1–3 and 11, MOTION.md and the tokens; in both themes; in a 2× capture.

| Area | Was | Now | Basis |
|---|---|---|---|
| Outline fill | `bg-subtle` | `bg-component` | `bg-subtle` is the recessed step: equal in light (0.976) but 0.15 under a 0.18 card in dark, a hole; `bg-component` is 0.20 there |
| Quiet ink (count, page glyph and label) | `light-dark(#b0b0b6, #6e6e74)` | muted mixed 45% toward the fill | derived from roles, so it follows Contrast, Layers and dark (`fg-placeholder` equals muted) |
| Edge | `max(1px, …)` | `max(var(--area-stroke-width), …)` | Area's required line, never zeroed by the Surface axis |
| Open motion | `base` ease-out both ways | `base` ease-in-out in, `fast` out | MOTION.md: shape moving while visible; exits a step faster |
| Outline sheet | drawn under the back's edge; `bg-surface` | drawn over it; paper a step lighter than the fill in both themes | owner: the page "looks like its under the stroke" |

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
- 2026-10-19 · design-system audit → `aria-label` names the figure (and a passed `aria-label` is no longer hidden by
  `aria-hidden`); `label` stays as a deprecated alias. One gallery tile per tone (was one tile of every hue). The pocket's
  lip is a named `--_lip` spec value. Demo copy uses the placeholder vocabulary.

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** Each tone has its own gallery tile (it was one tile with all ten folders). The figure's name is `aria-label` now (the old `label` still works), and a passed `aria-label` is no longer hidden from screen readers.
- **Why:** AGENTS.md: one variant per tile; DESIGN_SYSTEM.md: `aria-label` names the component's own element.

## Review note, 2026-10-19 (round 58)

- **What changed:** the solid folder, its tones and the sheet it showed when holding something are archived; every
  folder is the outline one, with its sheet tucked inside until it opens. The old props are accepted and ignored.
- **Why:** you asked to remove the solid variant from every file figure and archive it
  (docs/archive/solid-file-figures-2026-10-19.md).

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** the count is documented as artwork: drawn to the folder's scale (6 to 12 px), it may sit under the 10 px text floor because the Folder is an image (role img, named by its own label) or aria-hidden, so the count is never read as text (plan A9.9, finding T22).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.
