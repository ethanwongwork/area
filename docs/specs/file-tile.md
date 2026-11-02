# File tile spec

**Captures:** `docs/research/captures/card/` (Figma file card, ChatGPT Library cards, Notion recent card); Finder read
from this machine (`docs/research/file-explorer-2026-10-18/README.md` §2, §7).
**Peers:** Folder, ListBox (grid layout: the keyboard and the plates), Asset row (preview ring), Card.

## Owner decisions

- 2026-10-18: file explorer components and UI for the system; Brand tab to explore inspiration in folders.

## Job and boundaries

One item of a file browser's icon view: figure (a Folder, a file glyph, an image) over its name and a detail line.
`FileGrid` lays tiles out and makes them a listbox: one Tab stop, arrows in two dimensions, typeahead, Space selects,
Enter or a double click opens. Lists / details views belong on `Table flush interactive` (a FileRow recipe, not
built); trees on TreeView; the path on Breadcrumb.

## Variants

| Axis | Value | Justification | Where |
|---|---|---|---|
| size | sm 48 · md 64 · lg 96 figure; or any `--area-file-tile-figure` | Finder iconSize 64; Folder's sizes; a zoom sets any length (the Brand tab's Small / Medium / Large: 96 / 144 / 208) | Finder, Drive, Figma |
| figure | Folder · File page (drawn at the figure's size through `--area-folder-size`) · bare glyph (50% of the square, `fg-muted`, its line `stroke-width` as a non-scaling stroke) · image (contained, `radius-small`, the swatch ring) | Finder draws folders and document pages; Finder contains image previews; Asset row's swatch ring; coherence pass 2026-10-19 (glyph line) | Finder |
| state | selected (`aria-selected`), focus, hover (the plate only; nothing in the figure moves), pressed, drop target (`dropTarget` → `data-drop-target` on the grid item), disabled | ListBox grid's plates (list-box.css); a drop target tips its Folder open; PRODUCT_UI rule 2 | ListBox, Mantine, Finder |

Excluded for now: the framed "card" layout (Figma, ChatGPT: edge, radius 13–16, footer), multi-select, rename.

## Anatomy

```
.area-file-grid[--sm|--md|--lg] (ListBox grid)   sets --area-file-tile-figure (64 default); columns: figure + 2 × 24,
                                                 filling the row; cells 2 apart
  .area-list-box__item.area-file-grid__item   role=option, the plates: hover, selected, pressed, focus inset; tiles
                                              start at the top of their row; data-drop-target
    .area-file-tile                  padding 8, column, centred, gap 8; UI text (ui-size / ui-leading)
      __figure                       square --_figure, one fixed grid cell (aria-hidden unless an image with figureAlt)
      __text
        __name                       UI text, strong, two lines then ellipsis
        __meta                       xs (text-xs size and leading), muted, tabular, one line
```

## Decisions

| Slot · property | Area value | Basis |
|---|---|---|
| figure | 64 (sm 48, lg 96, or any `--area-file-tile-figure`) | Finder iconSize 64; Folder's sizes |
| name | the app's UI text (`ui-size` / `ui-leading`), `weight-strong`, two lines | coherence pass 2026-10-19 (Asset card's name); Figma 550, ChatGPT 500; ChatGPT `line-clamp-2` |
| meta | `text-xs`, `fg-muted`, tabular, one line | coherence pass 2026-10-19 (Asset card's detail line) |
| padding | 8 | Fluent Card small 8 |
| figure → name | 8 | coherence pass 2026-10-19 (Asset card's caption, 8 under its frame) |
| column | figure + 48; a tile outside a grid is at most one column wide, so its name wraps as in the grid (round 83) | pick |
| bare glyph | 50% of the square, `fg-muted`, line `stroke-width` (non-scaling) | owner ("way too thick"); coherence pass 2026-10-19 (one weight with Folder and File page) |
| image | contained, `radius-small`, the swatch ring, on `bg-well` | Asset row's preview; coherence pass (kept: it stands on the bare surface) |
| paint | ListBox's grid plates; hover changes the plate only | PRODUCT_UI rules 2 and 11 |
| row alignment | tiles start at the top of their row | owner: "arent correctly positioned" |

## Measurements

| Value | Area | Source |
|---|---|---|
| figure | 64 | Finder iconSize 64 |
| label | 12 on the xs leading | Finder textSize 12; Figma card 11/16; ChatGPT 14/20 |
| name weight | strong | Figma 550, ChatGPT 500, Notion 500 (captures/card) |
| name lines | 2 | ChatGPT `line-clamp-2` |
| meta | muted, one line, tabular | Figma black 50%, ChatGPT rgb(93), Notion rgb(125) |
| padding | 8 | Fluent Card small 8 |
| figure → name | 6 | pick |
| column | figure + 48 | pick (Finder's gridSpacing 54 measures something else, unverified) |
| glyph figure | 50%, line ≈ 1.5px | was 62.5% at the 24px drawing's scaled line (2.5px): owner, "way too thick"; use File page for files |
| row alignment | tiles start at the top of their row | owner: "arent correctly positioned" (ListBox's grid centred them, so a one-line name sat lower) |

The label, figure → name and glyph line rows are superseded by the coherence pass (2026-10-19); Decisions holds the
current values.

## Keyboard and ARIA

ListBox's (React Aria / APG listbox): Tab enters at the selected tile, arrows move by visual position, Home / End,
typeahead on the name, Space selects; FileGrid adds Enter → `onOpen`, double click → `onOpen` (neither on a disabled
tile). The figure is `aria-hidden` unless it is an image with `figureAlt` (the name is the accessible text).

## Open

- Multi-select (Shift+arrow, ⌘A, Escape) needs ListBox to gain it, or FileGrid its own selection model.
- Rename (F2 / Enter on macOS, VS Code's name-before-extension selection) on EditableText.
- The card layout, FileRow, a file-type icon map.

## Coherence pass, 2026-10-19

| Area | Was | Now | Basis |
|---|---|---|---|
| Name | 12 (xs), strong, two lines | the app's UI text (`ui-size` / `ui-leading`), strong, two lines | Asset card's name, the other caption under a figure |
| Detail line | inherited xs | xs, muted, tabular, one line | Asset card's detail line |
| Figure → name | 6 (pick) | 8 | Asset card's caption, 8 under its frame |
| Hover | lifted a solid folder's sheet 6 | the plate only | PRODUCT_UI rule 2: hover changes one thing; nothing moves |
| Bare glyph line | the size curve (0.84 units) | `--area-stroke-width`, non-scaling | one weight with Folder and File page |
| Paint | ListBox's grid plates | unchanged | PRODUCT_UI rule 11: a figure sits on the surface on row plates; Asset grid paints a frame because its asset is a composition in a container |
| Keyboard | ListBox grid + Enter / double click opens | unchanged; same as Asset grid | PRODUCT_UI rule 5 |

Not changed, and why: the plates do not hang into the margin inside the component (ListBox's grid does not either; a
host hangs them, as the Icons tab does); an image keeps the swatch ring because it stands on the bare surface (Asset
card's images sit inside a frame).

## Review note, 2026-10-18 (round 48)

- **What changed:** New. One item of an icon view: a figure (a Folder, a file glyph or an image) over its name (12,
  strong, two lines) and a muted detail line, as Finder lays items out. File grid puts tiles in a grid you can move
  through with the arrow keys, select with a click or Space, and open with Enter or a double click; a folder under a
  drag tips open. Files now use the File page figure, and tiles start at the top of their row, so a one-line name no
  longer drops its figure lower than its neighbours'. The Brand tab's folders and images are File grids.
- **Why:** The file explorer set you asked for starts here. To decide: Finder's open layout (as built) or a framed card
  like Figma's and ChatGPT's file cards as the default; and the selected paint (Area's row plate, as built, or Finder's
  label pill).
- 2026-10-19 · design-system audit → the image's ring is an inset outline, inside the image as Asset row's and Color
  swatch's (it was an outset box-shadow, painted outside the box). Demo copy uses the placeholder vocabulary (Item one,
  Description).

## Review note, 2026-10-19 (round 55, design-system audit)

- **What changed:** An image's thin ring is drawn inside the image, as Asset row and Color swatch draw theirs (it was drawn just outside). Demo names use the placeholder words.
- **Why:** The cited source draws it inside, and an outside ring adds a pixel past the image's box.

## Review note, 2026-10-19 (round 56)

- **What changed:** Files show File page's new glyph-only figure: one content mark per type, no extension text; the grid shows a document, a spreadsheet and an image.
- **Why:** The same note as File page: one consistent mark per type (docs/research/file-figures-2026-10-19.md). An image figure for the family (a 4:3 frame beside Folder and File page) is proposed there and waits for your go-ahead.

## Review note, 2026-10-29 (round 83)

- **What changed:** a tile standing alone (outside a File grid) is at most one grid column wide, the figure plus 24 each
  side (112 at md), so a long name wraps to its two lines and then ends in an ellipsis, as in the grid. In a grid the
  cell still sets the width. Short names don't move.
- **Why:** outside a grid the tile had no width of its own, so the Long name tile ran its name on one line, about 470
  wide under a 64 figure; the two-line rule only held inside the grid.
- **Verdict:** approved (owner, 2026-10-29, review page round 83); Complete.
- 2026-11-01 · owner ("Yes, fix fills", colour system study, docs/research/color-system-2026-11-01): The image's ground painted `bg-subtle`, which equals the page at Layer contrast 0 (the default), so it vanished in both modes → `bg-well`, the recessed tone never closer to the page than the page's control fill (#f9f9f9 / #161616 at Layers 0, unchanged from Layers 50 in light).
