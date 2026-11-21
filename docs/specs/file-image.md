# File image spec

**Captures:** none of its own; proportions come from the family (Folder, File page) and the survey
`docs/research/file-figures-2026-10-19.md` (Fluent's photo frame, 38 × 38 of 48, `react-file-type-icons`, MIT).
**Peers:** Folder (the box, the shadow, the outline edge), File page (the corner, the quiet ink, the paint), File tile
(its host), Asset card (an image framed with its name).

## Owner decisions

- 2026-10-19, round 55 (File tile): "if images need their own custom visual, to add to folders, so that theres a whole
  family, that might be ideal?"
- 2026-10-19, round 56 (File page): "can you create an image version of these larger illustrations?" → File image.

## Job and boundaries

Draws an image file as a figure for icon views at 48 and up: a landscape frame, the picture covering it, or a
landscape drawn in it. Decorative unless named. Not this: a document or any other file (File page), a container
(Folder), a real image framed with its name (Asset card), an image file in a row (the 16 `image` glyph).

## Variants

| Axis | Value | Justification |
|---|---|---|
| size | sm 48, md 64, lg 96 (unset: `--area-folder-size`) | Folder's and File page's sizes |
| look | the control fill, a whole-pixel edge (the solid look is archived, round 57) | File page's paint |
| content | `src`: the picture covers the frame · none: two hills and a sun | the survey: every product shows an image as itself |

- Sizes read Folder's figure scale (`--_figure-sm` / `-md` / `-lg`, folder.css), fixed at every type and density.

## Anatomy

```
area-file-image          the square icon box
  __figure               the landscape frame: 4:3, 92% of the box, even pixels, centred; the page's corner
    __picture            src: covers the frame (object-fit cover); the image ring over the edge (::after)
    svg > __scene        none: two hills from the foot and a sun at the upper end (400 × 300), non-scaling lines
```

## Measurements

| Slot · property | Value | Basis |
|---|---|---|
| frame · width | 92% of the box, even pixels (88 at 96, 58 at 64, 44 at 48) | Folder's figure width |
| frame · height | 3/4 of its width, even pixels (66, 44, 34) | Fluent's photo frame (square at 48; 4:3 reads as a picture beside the portrait page) |
| frame · corner | 8% of the box (8 at 96, 5 at 64, 4 at 48) | File page's corner on screen (40 of 360 at 72% of the box) |
| outline | `bg-component` fill, an inset edge in `border` at `--_edge` (1px to 96) | File page's outline |
| scene | lines at `--_edge`, File page's quiet ink (`fg-muted` 45% toward the fill) | one weight for every stroke in the family |
| picture ring | `token-swatch-ring` at `stroke-width`, inside, over the picture | DESIGN_SYSTEM, image rings |

## States

None: the figure is static. Selection, focus and dropping belong to File tile.

## Behavior and accessibility

`aria-hidden` by default (the tile's name says what it is); with `aria-label` it is `role="img"` with that name. The
picture's own `alt` is empty, since the figure is named or decorative as a whole. Forced colours: Canvas with a
CanvasText edge and lines, no shadow.

## Open

- A video figure (the frame with a play mark) if a file browser needs one.

## Feedback log

- 2026-10-19 · owner, round 56: "can you create an image version of these larger illustrations?" → File image built
  from the family's proportions and the survey; gallery tiles for the sizes, a picture and solid.

## Review note, 2026-10-19 (round 57)

- **What changed:** a new figure for images, beside Folder and File page: a landscape frame with rounded corners that
  shows the picture itself, or two hills and a sun when there is no picture.
- **Why:** you asked for an image version of the larger illustrations so the family covers folders, files and images.
  It takes the family's box, edge, corner and shadow, so the three line up in one grid.

## Review note, 2026-10-19 (round 58)

- **What changed:** the lit solid frame is archived; every image figure is the outline one. The old props are accepted and ignored.
- **Why:** you asked to remove the solid variant from every file figure and archive it
  (docs/archive/solid-file-figures-2026-10-19.md).

## System status step C, 2026-11-18 (shared sources)

The 48 / 64 / 96 literals now read Folder's shared figure scale. Nothing moved.
