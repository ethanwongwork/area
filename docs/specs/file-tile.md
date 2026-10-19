# File tile spec

**Status:** accepted · 2026-10-19 (round 48)
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
| figure | Folder · File page · glyph (half the square, line thinned) · image (contained) | Finder draws folders and document pages; Finder contains image previews; Asset row's swatch ring | Finder |
| state | selected (`aria-selected`), focus, hover, pressed, drop target (`data-drop-target`), disabled | ListBox grid's plates (list-box.css); a drop target tips its Folder open | ListBox, Mantine, Finder |

Excluded for now: the framed "card" layout (Figma, ChatGPT: edge, radius 13–16, footer), multi-select, rename.

## Anatomy

```
.area-file-grid (ListBox grid)       columns: figure + 2 × 24, filling the row; cells 2 apart
  .area-list-box__item.area-file-grid__item   role=option, the plates: hover, selected, pressed, focus inset
    .area-file-tile                  padding 8, column, centred, gap 6
      __figure                       square --_figure, one fixed grid cell
      __text
        __name                       12 / xs leading, strong, two lines then ellipsis
        __meta                       12, muted, one line
```

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

## Keyboard and ARIA

ListBox's (React Aria / APG listbox): Tab enters at the selected tile, arrows move by visual position, Home / End,
typeahead on the name, Space selects; FileGrid adds Enter → `onOpen`, double click → `onOpen`. Images are decorative
unless `figureAlt` is given (the name is the accessible text).

## Open

- Multi-select (Shift+arrow, ⌘A, Escape) needs ListBox to gain it, or FileGrid its own selection model.
- Rename (F2 / Enter on macOS, VS Code's name-before-extension selection) on EditableText.
- The card layout, FileRow, a file-type icon map.

## Review note, 2026-10-18 (round 48)

- **What changed:** New. One item of an icon view: a figure (a Folder, a file glyph or an image) over its name (12,
  strong, two lines) and a muted detail line, as Finder lays items out. File grid puts tiles in a grid you can move
  through with the arrow keys, select with a click or Space, and open with Enter or a double click; a folder under a
  drag tips open. Files now use the File page figure, and tiles start at the top of their row, so a one-line name no
  longer drops its figure lower than its neighbours'. The Brand tab's folders and images are File grids.
- **Why:** The file explorer set you asked for starts here. To decide: Finder's open layout (as built) or a framed card
  like Figma's and ChatGPT's file cards as the default; and the selected paint (Area's row plate, as built, or Finder's
  label pill).
