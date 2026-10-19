# File explorer research, 2026-10-18

The owner asked for "file explorer components and UI", starting with a Folder component (a macOS Finder-style
blue folder tile with its name and "6 items" under it), then a knowledge-base layout: folder tiles with paper
peeking out, a folder tree with counts in a sidebar, and a files table with Name / Added by.

**Status: partial.** Section 2 lists values pinned from captures already in this repo. The web survey of Finder,
Windows 11 Explorer, Fluent 2, Google Drive, Dropbox, VS Code, Primer, Ant, Carbon, Atlassian, shadcn, Mantine,
Geist and React Aria was handed to research agents. Their results had not arrived when this file was written, so
every value for those products is marked **unverified / to capture**. No number below comes from memory.

## 1. What Area already has

| Part | Status | What it gives file exploring | Spec |
|---|---|---|---|
| TreeView | Complete | `role="tree"`, one Tab stop, arrows, typeahead, Left / Right in RTL; 32 rows, radius 8, start 8, 16 chevron slot, 6 / 6 gaps, 22 indent, `trailing` (counts), `actions` (hover controls). Not built yet: multi-select, drag to reorder, inline rename | `docs/specs/tree-view.md` |
| ListBox | in review | `role="listbox"`, list or **grid** layout, roving tabindex, grid Up / Down by nearest centre, 48 cells 2 apart; **single value only** ("multiple selection waits for a use") | `docs/specs/list-box.md` |
| Table | Complete | native `table`, sm / md / lg cell inset, interactive rows, Checkbox selection column (composed), `flush` and `baseline` for app lists (PRODUCT_UI rule 11). No keyboard grid | `docs/specs/table.md` |
| AssetRow | Complete | 56 row, a 40 preview well inset 8, name 12/16 strong, meta 12/16 muted, trailing action | `docs/specs/asset-row.md` |
| FileUpload | in review | drop zone and upload rows (40 tile, 20 `document` glyph, name 14/20 500, meta line) | `docs/specs/file-upload.md` |
| Breadcrumb | Complete | ancestors, current page, collapsed `…` menu, Notion's 24 hover plate | `docs/specs/breadcrumb.md` |
| Nav | Complete | 32 rows, trailing `Count` / Badge, row actions | `docs/specs/nav.md` |
| Card | Complete | linked card, overlay actions, media well, sm / md / lg inset | `docs/specs/card.md` |
| ContextMenu, Menu, EditableText, EmptyState, Count, Checkbox, Segmented | Complete / accepted | right-click menu, sort / group menu, inline rename (Figma layer rename), empty folder, item counts, selection boxes, grid / list switch | specs of the same names |
| Icons | `packages/icons/sources` | `folder`, `folder-open`, `folders`, `folder-add/check/code/cog/git/input/lock/remove/search/sync/tree/zip`; `document*`, `file-audio/code/image/json/pdf/spreadsheet/video/zip/…`, `files` (16 px drawings; 10 and 12 px cuts for a few) | `docs/specs/icons.md` |

App rules that bind the new parts (`docs/PRODUCT_UI.md`): states land at once, leave on `fast` (rule 1); rows change
their plate (`bg-component-hover` → `bg-component-active` selected → `bg-component-pressed` held); **tiles lift**
(the float shadow fades in on hover, dropped when held, `stroke-selected` 2px when selected; the edge steps only at
Elevation 0) (rules 2–3); collections are keyboard-complete, grids move in two dimensions (rule 5); sort and group
live in one view menu (rule 7); a count at a row's end is `Count`, beside a title muted tabular text (rule 9); the
grid / list switch is last in the Canvas header (rule 14).

## 2. Pinned values (captures in this repo)

All from `docs/research/captures/card/`, captured with `area-capture.js` on 2026-09-26/27 (light unless noted).
Read with a dump of each node's computed style; boxes in CSS px.

### Grid tiles

| Product · tile | Tile | Preview | Icon | Title | Meta line | Gaps / padding | Edge, radius, shadow | Hover / selection |
|---|---|---|---|---|---|---|---|---|
| Figma · file card (`figma--file-card--rest--light`) | 274.8 × 214.4 | 272.8 × 153.4 (16 : 9), fill rgb(30) / rgb(245) dark | 16 type icon in the footer | 11/16 Inter **550** (`h2`, dark capture) | 11/16 **450**, rgba(0,0,0,0.5) light, rgba(255,255,255,0.698) dark | footer 59 tall incl. 1px top rule, 16 padding, icon → text 12, title → meta 2 | 1px rgb(230) (dark rgb(68)), radius **13** (`--radius-large`), no shadow | hover: two hidden 24 controls top-right (opacity 0 → 1, 8 apart, 16 in); no paint change in the 30 captured nodes |
| ChatGPT · Library file card (`chatgpt--library-file-card--{rest,hover}`) | 200.7 square | the whole tile: a 40 type glyph centred (PDF red rgb(255,59,48)) | 40 | 14/20 **500**, `line-clamp-2`, padding 12 / 20 at the top | 12/16 rgb(93,93,93), truncate, bottom row 44 tall, padding 20 | — | 1px rgba(0,0,0,0.05), radius **16**, shadow 0 4 16 rgba(0,0,0,0.05) | hover: full-tile wash oklab(0.159 / 0.05) (≈ black 5%), a 36 round white menu button 12 from the top-right, a 20 round select checkbox 18 from the bottom-right (1px rgba(0,0,0,0.15), fill rgb(252)) |
| Notion · Home "Recently visited" card (`notion--recent-card--rest--dark`) | 144 square | 44 top band, rgba(255,255,255,0.03) | 28 page icon, 16 in, overlapping the band (top 30) | 14 **500**, line-height normal | 12/16 rgb(125,122,117), after a 16 avatar, 4 gap | content 16 in, column gap 10 | fill rgba(255,255,255,0.05) (dark), radius **16**, no edge | not captured |

### Finder-style folder tile (the owner's first example)

| Product | Icon | Label | Meta ("6 items") | Selection | Source |
|---|---|---|---|---|---|
| macOS Finder icon view | unverified (Finder's View Options default "Icon size" and "Grid spacing" to capture) | unverified (View Options "Text size", 2-line wrap to confirm) | unverified ("Show item info" line, its ink to confirm) | unverified (label pill in the accent colour, rounded grey backdrop behind the icon: observed in screenshots, values not measured) | to capture: Finder is native, so read View Options and measure a screenshot at 1× with a known scale, or read AppKit metrics |
| Windows 11 File Explorer | unverified (icon sizes per view) | unverified | unverified | unverified | Microsoft Learn / WinUI source, to read |

### Lists and trees

| Product · part | Row | Icon | Text | Indent | Selection | Source |
|---|---|---|---|---|---|---|
| Notion · sidebar page tree | 30, radius 6, padding 5 / 8 | 22 × 18 slot, 18–20 icon; 12 chevron shares the slot on hover | 14/21 400, starts 38 in | not captured | not captured | `captures/tree-view/notion--sidebar-row--rest--light` (tree-view spec) |
| Area · TreeView | 32, radius 8, start 8 | 16 | 14/20 400 | 22 | `bg-component-active` | `docs/specs/tree-view.md` |
| Notion · table view | 36 rows, hairlines between cells | — | 14 | — | hover reveals row controls | `captures/table/notion--*` |
| VS Code explorer | unverified (22 rows believed; to read in `tree.css` / list widget) | unverified | unverified | unverified (`workbench.tree.indent`) | unverified | microsoft/vscode, to read |
| Primer, Ant DirectoryTree, Carbon, Mantine, Fluent 2 Tree | unverified | unverified | unverified | unverified | unverified | GitHub source, to read |

## 3. Proposed component set

Names are proposals. Every value is to be measured into its spec before building (COMPONENT_ADAPTATION.md).

### 3.1 Folder (the glyph / illustration) — build first

- **Purpose:** the folder figure itself, at tile scale (not the 16 icon): a tinted back panel with a tab, an
  optional sheet of paper (or a thumbnail) peeking above the front, and the front panel; optional badge
  (shared, locked, synced) in a corner.
- **Anatomy:** `back` (with `tab`), `content` (0–3 sheets or an image, clipped by the back), `front`, `badge`.
- **Axes:** size sm / md / lg (tile sizes to measure: Finder's icon-view default, Drive's folder card, the owner's
  knowledge-base reference); tone (neutral default, then the Tag tones, after ChatGPT project colours and Finder's
  blue: to decide); content none / paper / image; state open (drag-over: the front tilts or the back lightens, to
  decide) and empty.
- **Ink:** `light-dark(… ) /* spec */` per tone until a role fits; the front a step lighter than the back so it reads
  as in front without a shadow.
- **A11y:** decorative by default (`aria-hidden`), the tile names it. Not interactive.
- **Composes:** nothing; Area's `folder` icon keeps the 16 / 20 rows.

### 3.2 FolderTile / FileTile (grid item) — build second

- **Purpose:** one item in a grid: a figure (Folder, a file thumbnail, or a type glyph on the media ground), the name,
  a meta line ("6 items", "Edited 2 hours ago", "PDF · 1.2 MB").
- **Two layouts, both measured:** **icon** (Finder, the owner's first example: figure on the surface, centred name
  up to 2 lines, meta below, no frame: PRODUCT_UI rule 11, "a thing that is its own figure sits on the surface") and
  **card** (Figma, ChatGPT, Notion: a framed tile with a preview and a footer; Card's paint and lift).
- **Axes:** size sm / md / lg; layout icon / card; state rest / hover / selected / focused / drag-over / renaming /
  disabled (cut, uploading as a later Progress composition).
- **Painting:** icon layout follows Finder (selection on the label and a plate behind the figure: to measure) mapped to
  Area's row plates; card layout follows rule 3 (lift on hover, `stroke-selected` 2px).
- **Slots:** `figure`, `name` (EditableText when renaming), `meta`, `actions` (ChatGPT: a menu button on hover;
  touch shows it), `select` (ChatGPT's 20 round checkbox, shown on hover and when any item is selected).
- **Composes:** Folder, Card (card layout), EditableText, Checkbox, Button ghost, Menu / ContextMenu, Tooltip for a
  cut-off name.

### 3.3 FileRow (list / details view)

- **Purpose:** one item in a list: type icon or small thumbnail, name, columns (Added by with Avatar, Modified, Size,
  Kind), row actions.
- **Recommendation:** a recipe on `Table flush interactive` with a 16 / 20 icon cell, not a new component, unless
  multi-select and keyboard grid behaviour (below) need a real `role="grid"`; AssetRow covers the inspector-style
  two-line row.
- **Composes:** Table, Avatar (David Tee; teams for others), Count, Checkbox, EditableText, Menu.

### 3.4 FileBrowser (the collection)

- **Purpose:** holds FolderTiles or FileRows; grid / list switch (Segmented, rule 14); sections ("Folders", "Files",
  or Today / Yesterday / Earlier) with Menu's label as the heading; sort and group in one view menu (rule 7);
  EmptyState for an empty folder; drop target.
- **Keyboard / ARIA (to confirm against APG and React Aria GridList):** grid view `role="grid"` (or `listbox` with
  `aria-multiselectable="true"` and grid layout, extending ListBox); arrows move in 2D, Home / End, typeahead;
  Shift+arrow extends a range, Cmd/Ctrl+click toggles, Shift+click ranges, Cmd/Ctrl+A all, Space toggles, Enter
  opens, F2 (Windows) / Return (Finder) renames, Delete / Cmd+Backspace removes (consumer action), Escape clears.
  List view: same model on rows. Selection announced; count of selected in a live region.
- **Composes:** ListBox (needs multi-select: a ListBox change with its own spec note), FolderTile, FileRow / Table,
  Segmented, Menu, ContextMenu, EmptyState, ScrollArea.

### 3.5 Supporting parts

- **File-type icon map:** extension → Area icon (`file-pdf`, `file-spreadsheet`, `file-image`, `file-video`,
  `file-audio`, `file-code`, `file-json`, `file-zip`, `document` fallback, `folder`); tone per kind only if the owner
  wants ChatGPT's coloured glyphs (PDF red). Fluent's `react-file-type-icons` map is the reference to read.
- **Folder tree with counts:** TreeView as it is (`trailing` → `Count`, folder icons); add multi-select, drag-over and
  rename only on request.
- **PathBar:** Breadcrumb with a folder icon on the first item and the collapsed menu; no new component.

## 4. Build order

1. **Folder** (the figure, sizes and tones, paper peeking).
2. **FolderTile** icon layout ("Name" / "6 items" under the figure), then the card layout for files.
3. **FileBrowser grid** on a multi-select ListBox (keyboard, selection, sections, empty state).
4. **FileRow** recipe on Table (Name / Added by / Modified), with the grid / list switch.
5. **File-type icon map**, then the knowledge-base demo composition (TreeView with counts + FileBrowser + Breadcrumb).

## 5. Still to do before building

- Capture Finder icon view (icon size, label size, 2-line wrap, item-info line, selection plates) and its sidebar.
- Read Windows 11 Explorer / Fluent 2 (Tree, file type icons), Google Drive folder cards and list rows, Dropbox, VS
  Code `tree.css`, Primer TreeView, Ant DirectoryTree and Upload list, Carbon TreeView and FileUploader, shadcn
  sidebar file tree, Mantine Tree, React Aria GridList, APG grid / treeview; pin each value with its file and line.
- Capture Figma's file browser grid (column width and gap) and list view; ChatGPT Library grid gap and columns;
  ChatGPT Projects in the sidebar.

## 6. Open questions for the owner

1. Folder colour: Finder blue, neutral, or the Tag tones (ChatGPT lets a project pick a colour)?
2. Is the icon layout (figure on the surface, Finder) the default FolderTile, with the framed card for files?
3. Paper peeking: generic sheets only, or real thumbnails of the first files inside?
4. Selection: Finder's label pill plus figure plate, or Area's tile rule (2px `stroke-selected`)?
5. Should ListBox gain multiple selection (the FileBrowser's base), or should FileBrowser own a grid model?
6. Which knowledge-base reference should the demo match (a link or screenshot to measure)?

## 7. Survey results (added after the first draft)

Four web/source passes reported back after this file was first written; the values they pinned, condensed. Every
row names its source; "unverified" means no primary source was found.

### macOS Finder, read on this machine (macOS 27.2)

| Fact | Value | Source |
|---|---|---|
| Icon view icon size | 64 | `defaults read com.apple.finder StandardViewSettings` → IconViewSettings.iconSize |
| Icon view label size | 12 | same, textSize |
| Grid spacing | 54 | same, gridSpacing (what it measures is unverified) |
| Label position | below the icon | same, labelOnBottom = 1 |
| Item info line | off by default | same, showItemInfo = 0 |
| Folder art | figure 236 × 186 of the 256 cell (10 in at the sides, 35 at top and foot); tab top runs to x 66, slopes 18 down over ~20; pocket starts 30 below the tab top; corners ≈ 10; back #94E0FF, pocket #66C9F8 → #7BCBEF | `/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/GenericFolderIcon.icns` rendered at 256 with `sips` and sampled per pixel |
| Sidebar metrics, selection painting, list rows | unverified | HIG Sidebars (8 June 2026) no longer publishes a table |

### Microsoft (microsoft/fluentui @f02cfa8f, microsoft/microsoft-ui-xaml @2a08ab9d)

- Fluent v9 Tree: row 32 (small 24); indent 24 per level in both sizes (the Fluent 2 site says 12 for small; the code
  says 24); icons 20; focus 2px `colorStrokeFocus2`, radius 4 (`react-tree/.../useTreeItemLayoutStyles.styles.ts`).
- Fluent file-type icons: sizes 16 20 24 32 40 48 64 96 (`getFileTypeIconProps.ts:40`); folder.svg at 48: back 40
  wide, radius 5.25, pocket 5 below the back's top, gradient #F7AB40 → #FFDD57 over #BA7300 → #D48300; no paper.
- Fluent Card: padding = gap = 8 / 12 / 16 by size; selected `colorNeutralBackground1Selected`.
- WinUI: GridViewItem radius 4 with a 2px accent selected border; ListViewItem min 40 tall; TreeViewItem min 28.
- Windows Explorer per-view icon sizes (256 / 96 / 48 / 16): third-party only, unverified.

### Design-system source

- VS Code explorer: rows 22; indent 8 (4–40); twistie 16; icons 16; rename selects the name up to the last dot, F2
  (Enter on macOS); Delete / ⌘⌫ trash (`explorerViewer.ts`, `tree.css`, `fileActions.contribution.ts` @1171be03).
- Primer TreeView: rows 32 (44 coarse); indent 8; current item a 4 × 24 accent bar; DirectoryIcon open / closed.
- Ant Design: Tree title 24, indent 24; DirectoryTree selected fills the row with the primary colour; Upload picture
  card 102.
- Carbon: TreeView label 32 (xs 24); FileUploader selected file 48; drop zone 96 with a dashed edge.
- Mantine Tree: level offset 20; drag-over-inside gets the primary-light fill. Geist file tree: rows 28, indent 23.
- React Aria GridList grid layout: arrows by visual position; Space selects, Enter acts; Shift+arrow extends; ⌘A
  selects all; Escape clears. APG layout grid agrees.

### Products (public sources only)

- Figma (Aug–Sep 2026): Projects became Folders, nestable and coloured; tiles lost then regained "a preview of the
  files inside" (Figma forum, 16 Sep 2026). Grid metrics unverified.
- ChatGPT: projects take an icon and a colour; Library filters uploaded / generated and by type. Metrics unverified.
- Drive: default list view; folders "On top" or mixed; up to 6 suggested folders. Metrics unverified.
- Dropbox: blue folder with a badge per kind (shared, team, camera uploads, encrypted …). Metrics unverified.
- Folder tiles with papers peeking out: Framer "Peek Folder Card" (papers spring out on hover), Figma's Sep 2026
  folder previews, macOS Tahoe's customisable folder colour + symbol.

### Recommended file-grid keyboard model

Arrows by visual position, Space selects, Enter opens, typeahead (ListBox already does these); next: Shift+arrow
extends, ⌘A selects all, Escape clears, F2 renames, Delete trashes, Shift+F10 opens the context menu.

## 8. Built (2026-10-18)

Folder and File tile (with FileGrid / FileGridItem on ListBox's grid) are built and in review:
`docs/specs/folder.md`, `docs/specs/file-tile.md`. The Brand tab (`apps/desktop/src/pages/brand.tsx`) is their first
real use. Not built yet: multi-select, rename, drag and drop between folders, FileRow on Table, a file-type icon map.

## 9. Icon line at large sizes (owner: "is that what other icon systems do?")

Pinned from source (agent survey, 2026-10-18):

| System | At large sizes | Pinned |
|---|---|---|
| Lucide 1.59.0 | linear (2 on 24: 4px at 48); `absoluteStrokeWidth` holds 2px at any size | buildLucideIconNode.ts L33–37, 79–80 |
| Tabler 3.49, Feather 4.29, Untitled UI 0.0.23, Phosphor 2.0.8, Radix | linear (one drawing) | createReactComponent.ts; default-attrs.json; raw svgs |
| Heroicons 2.2 | outline only at 24 (1.5); no larger cut | README L69 |
| Carbon | 32 masters at 2px, 16 cuts at 1px (same ratio, pixel fitting) | repo layout |
| Fluent svg-icons 1.1.341 | separate drawings, sub-linear: 16 → 1, 24 → 1.5, 32 → 2, 48 → 2.5px | document/folder_N_regular walls |
| Material Symbols (opsz 20–48, weight 400) | optical size, sub-linear: 24 → 2, 40 → 2.78, 48 → 3px | check_box_outline_blank walls |
| SF Symbols | weights matched to text; scales by cap height | HIG; per-size drawing unverified |

Area's runtime follows size^0.45 to 24 (1.5px), then scales the 24 drawing whole: 40 → 2.5px, 48 → 3px, 96 → 6px —
Material's weight at 40–48, a touch heavier than Fluent, lighter than Lucide's linear default (3.3px at 40). File page
thins its glyph to ~1.25px at md (20px glyph, 6%) and 1.5px at lg (31px, 4.9%), near Fluent's 32 → 2px ratio but
lighter, as the owner asked.


## 10. Folder and document illustrations, measured (2026-10-18)

Assets downloaded and measured (Fluent item-type SVGs from the Office CDN, Lucide, Phosphor, Material Symbols, Fluent
System Icons, Google Drive PNGs; macOS Finder rendered with NSWorkspace at 64–512). L is CIE L*.

| Source | Page radius (% of width) | Fold (% of width) | Stroke px at 64 / 96 | Page ΔL top→foot | Fold vs page | Label | Folder back vs front |
|---|---|---|---|---|---|---|---|
| Fluent item-types | 4.7 (6.8 at 64) | 32–33 | 2 / 2 (1 at 48) | 0 | same white, outlined | none; app badge 44% | 79.6 vs 87.3 |
| macOS Finder | 4.3–4.8 | 35–37 | none; soft shadow | 0.7 | L92 vs 96.5; L98 curl highlight | cap 8–9% of the icon, regular, L74, 7% up | front 78→68, 1px lips (top L85, foot L58–62); radius 5.5% |
| Google Drive | 15 | 36–37 | none | 0 | white on blue | cap 25%, black, in a badge | legacy Δ19 |
| Material Symbols 400 | ~9.4 | 39 | 4 / 6 | – | solid | – | silhouette |
| Lucide | 12.5 | 37.5 | 5.3 / 8 (scales) | – | open L stroke | – | silhouette |
| Phosphor regular | 9 | 32 | 4 / 6 | – | open L stroke | – | seam one band |
| Fluent System 48 | 13 | ~44 | 2.5 at 48 | – | L band | – | seam one band |

Rules taken: page near flat (ΔL 0–1); flap 4–5 L under the page; whole-pixel outline strokes, never two stacked strokes
on a shared edge (draw the seam once); one label/count type at cap ≈ 9–10% of the box, regular, 7% up; Folder's corner
larger than the page's on screen (Finder 1.9×). Unverified: Linear / Notion / Geist empty states, Dropbox art, sheet-in-
folder radius (concentric is geometry).
