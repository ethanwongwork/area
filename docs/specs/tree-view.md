# Tree view spec

**Status:** accepted · 2026-09-26 (was: in review · 2026-09-25 (pass 3: even spacing on shared columns, marker removed, variant pass))
**Captures:** `docs/research/captures/tree-view/`
**Peers:** Nav (navigation rows, Complete), Menu (row hover), Checkbox (filter mode),
Breadcrumb (shared chevron glyph)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): TreeView follows
  Primer's hierarchy guidance and keyboard model: one row in the Tab order; Up/Down,
  Left/Right, Home/End and typeahead; controlled or initial expansion and selection. The
  gallery shows a file tree and a checkbox filter tree; checkbox mode is an Area addition.
  Counts are visible and announced. Nodes use a flat DOM with level, position and set-size
  metadata; deeper screen-reader testing is due before acceptance.
- 2026-09-25: Tree view is the next component after Breadcrumb was approved.
- 2026-09-25 (pass 3): chevron, icon and label evenly spaced so rows share columns (6px
  gaps, 22px indent); the current-row edge marker is not needed and is removed.
- 2026-09-26: accepted. Owner: "consider every component that you have built to be approved. if i havent given any feedback to change anything consider them approved."

## Job and boundaries

Tree view shows and navigates a hierarchy (files, pages, filters). Nav is a flat or
two-level site navigation; Menu holds commands.

## Variants

Variant pass 2026-09-25: every row is one variant per gallery tile, in the docs examples and
in the manifest where the manifest can express it.

| Axis | Value | Justification | Gallery tile / docs example |
|---|---|---|---|
| selection mode | navigation (default) | Activates one row; Notion sidebar, file trees | Project files |
| selection mode | checkbox | Toggles many rows; filter trees (Area addition, prior decision) | Checkbox filters |
| composition | icon | Type glyph per row | Project files; Filled folders (filled glyphs in one hue) |
| composition | no icon | Filters and outlines; the checkbox takes the icon column | Checkbox filters |
| composition | trailing text | Status letters, counts | Project files (A, M); Checkbox filters (counts) |
| composition | actions | Row controls at the end (Figma layers: lock, visibility) | Layers with row controls |
| state | expanded / collapsed | Branches | Project files / Collapsed |
| state | selected, current | `aria-selected`, `aria-current` (fill and main ink) | Project files |
| state | checked | `aria-checked` in checkbox mode | Checkbox filters |
| state | disabled | Skipped by arrows and typeahead | Disabled row |
| state | hover, focus-visible, action pinned | Runtime; `data-pinned` on a control | Layers with row controls |

Manifest: `selectionMode` and the elements `chevron`, `check`, `icon`, `label`, `trailing`,
`actions`. Row states live on `treeitem` descendants, which the manifest's block-scoped
state check cannot express; they are documented here and on the docs page.

Not built: partial (indeterminate) parent checks in checkbox mode, multi-select in
navigation mode, drag to reorder, inline rename, a label tone (Figma's purple component
names), dimmed hidden layers. Each needs an owner request.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Sidebar page tree row (top level, collapsed) | app.notion.com sidebar, logged in (Edge), 2026-09-25 | evidence only | `notion--sidebar-row--rest--light` |
| area | this system | Three gallery tiles before and after | localhost gallery | — | `before/area--*` (3), `area--*` (3) |

Not captured: Notion's indent per level and hover fill (nothing in the sidebar was
expanded, and expanding would change a stored sidebar state; hover did not register in the
background browser window). Figma's layers panel needs the editor, which did not respond in
the background window. ChatGPT has no tree.

## Anatomy

```
notion   a[treeitem] 30px, radius 6, ink rgb(95, 94, 89)
  row    div, padding 5/8
    slot 22 × 18 (page icon 18–20px; the 12px chevron shares this slot and shows on hover), margin-end 8
    text 14/21 400, starts 38px in
area     div[treeitem] 32px, radius 8, padding-start 8 + depth × 20
  chevron  16px slot (Area chevron glyph), 20px hover plate, 24px pointer target outside it
  icon     16px, 6px after the chevron slot
  label    6px after the icon; ellipsis
  actions  end of row; controls shown on hover, focus and selection

Columns (pass 3), from the row edge: 8, 30, 52, 74, … (start 8, step 22). Depth n puts its
chevron on column n, its icon on n + 1 and its label on n + 2.
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| row · height, radius | 32, 8 | Peer: Nav (32, 8) | Notion 30, 6. Tree rows stay the same size as Nav rows |
| row · ink at rest | **`fg-muted`** | Peer Nav rgb(102); Notion rgb(95) | Was `fg-default` on every row |
| row · ink selected/current | `fg-default` + `bg-component-hover` | Peer Nav current | — |
| row · start padding | **8** | Nav 8; Notion 8 | Was 4 |
| chevron · slot | **16** (Area chevron glyph), 24px hover plate and target | Area icon slots; Notion's 12px chevron in a 22px slot | Was a 28px box, pushing labels to 56px. Notion shows the chevron only on hover, sharing the icon's slot; Area keeps it visible, since a file or filter tree must show what expands |
| chevron → icon → label | **6 and 6** (row gap 6, label inset 0) | Owner (pass 3): evenly spaced on shared columns | Was 4 and 8 (pass 1, Notion's 8 to the label). Box gaps are equal; visible ink gaps are about 11 and 9, since the chevron's ink sits about 3px inside its box and the folder's about 2px. Not corrected per glyph (inset rules) |
| indent · per level | **22** (slot 16 + gap 6) | Owner (pass 3): a child's chevron under its parent's icon, its icon under the parent's label | Was 20: a child's icon landed at 48 under a parent label at 52 |
| label · text | 14/20 400 | Notion 14/21 400 | — |
| chevron · hover plate | **20** (inset −2), pointer target 24 (`::after`) | Owner (pass 2) | Was 24: its edge met the icon box (0px). Now 2px clear of the icon, 6px from the row edge |
| current marker | **none** | Owner (pass 3) | Pass 2 made it a 3 × 16 pill. Notion and Figma draw none; fill, main ink and `aria-current` remain |
| actions · slot | end of row, 2px between controls, −4px end margin (a 16px glyph in a 24px sm button lands 8px from the edge, as the row's text) | Owner (pass 2); Figma layers (owner screenshot, not captured) | Hidden until hover, focus-visible or selection; `data-pinned` keeps a state control visible |
| folders (gallery) | Area filled folder, `fg-info` | Owner (pass 2) | Demo content; the component does not colour icons |

Measured after pass 1: depth 1 chevron at 8, icon at 28, label at 52; depth 2 chevron at
28, label at 72; resting ink rgb(102), selected rgb(40) on rgb(243). Pass 3 measurements
are under Verification.

## Behavior and accessibility

Unchanged: `role="tree"`/`treeitem`, one tab stop, arrow keys, typeahead, `aria-level`,
`aria-expanded`, `aria-selected` or `aria-checked`. The chevron's 24px pointer target is
its `::after`; the painted plate (`::before`) is 20px. Keyboard users expand with Left/Right.
Row `actions` are outside the single Tab stop: consumers give each control `tabIndex={-1}`
and a keyboard equivalent (as Figma's shortcuts for hide and lock). Screen readers still
reach them in browse mode; interactive content inside `treeitem` is outside the APG
pattern and needs screen-reader testing before acceptance.

## Visual pass

Pass review container (`GalleryReviewTreeView`), replaced each pass: pass 3 shows the
pass-2 spacing against the even spacing at 1× and 3×. Pass 2 checked the chevron plate at
3× on screen (2px clear of the folder).

## Verification

- 1 Notion capture; 3 Area captures before and 3 after; checksums verified.
- `build:docs` (docs audit), `typecheck`, `test:contracts` (14), `test:badge` (9),
  `test:preview` (4), `npm test` (tokens and contrast): all pass.
- Pass 2: plate measured in the gallery (6–26 from the row edge, icon at 28); 3× hover
  checked on screen. `typecheck`, `build:docs`, `test:contracts` (14), `test:preview` (4),
  React tests (87): all pass.
- Pass 3: columns measured in the gallery for Project files, Checkbox filters and Disabled
  row: every depth-n row has chevron, icon or check, and label at 8 + 22n, 30 + 22n and
  52 + 22n; no `::before` on current rows. 3× checked on screen. `typecheck`, `build:docs`,
  `test:contracts` (14), `test:preview` (4), React tests (87): all pass.
- Unverified: dark theme, Notion indent and hover, Figma layers geometry (row height, 11px
  type, icon and control sizes: needs a capture in the editor), screen-reader behaviour of
  row actions. Layer-type glyphs (frame, rectangle, component, lock) are stand-ins until
  drawn under the icon construction rules.

## Feedback log

- 2026-09-25 · owner approved Breadcrumb and asked to move on → Tree view first pass:
  secondary ink at rest, 8px start, 16px chevron slot, 20px indent, 8px to the label → 3
  Area captures after.
- 2026-09-25 · owner (screenshots of the pass review and of Figma's layers panel): the
  chevron's hover plate sits too close to the icon; can Tree view serve Figma's layers
  panel; is the current-row bar needed, or can it sit further in, thicker and pill-shaped;
  show folders as filled coloured glyphs; show controls at the row end, not only letters →
  measured the plate: 24px plate ends at x = 61, the icon box starts at 61 (0px clearance).
  Pass 2: plate 20px (2px clearance, pointer target stays 24px); bar 3px pill, 16px tall,
  2px from the row edge; `actions` slot for trailing row controls (shown on row hover,
  focus and selection, or pinned with `data-pinned`); gallery tiles for filled folders and
  a layers panel. Figma's layers panel is not yet captured (see Sources), so the layers
  tile reuses Tree view's own geometry.
- 2026-09-25 · owner: should chevron, icon/checkbox and text be evenly spaced, so icons and
  text align on an inset line? → recommended 6px gaps and a 22px indent (labels stay at 52;
  4px is tighter than Notion's 8, 8px pushes deep levels out). Owner: proceed, remove the
  marker, run a variant pass → pass 3: `--_tree-gap` 6, label inset 0, marker CSS removed;
  Disabled row tile added; docs API lists `currentId` and the node fields; Variants
  section added.
