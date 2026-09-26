# Tree view spec

**Status:** in review · 2026-09-25 (first pass under the capture workflow)
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

## Job and boundaries

Tree view shows and navigates a hierarchy (files, pages, filters). Nav is a flat or
two-level site navigation; Menu holds commands.

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
  chevron  16px slot (Area chevron glyph), 24px hover plate and pointer target outside it
  icon     16px
  label    4px gap + 4px inset = 8px from the icon; ellipsis
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| row · height, radius | 32, 8 | Peer: Nav (32, 8) | Notion 30, 6. Tree rows stay the same size as Nav rows |
| row · ink at rest | **`fg-muted`** | Peer Nav rgb(102); Notion rgb(95) | Was `fg-default` on every row |
| row · ink selected/current | `fg-default` + `bg-component-hover` | Peer Nav current | — |
| row · start padding | **8** | Nav 8; Notion 8 | Was 4 |
| chevron · slot | **16** (Area chevron glyph), 24px hover plate and target | Area icon slots; Notion's 12px chevron in a 22px slot | Was a 28px box, pushing labels to 56px. Notion shows the chevron only on hover, sharing the icon's slot; Area keeps it visible, since a file or filter tree must show what expands |
| indent · per level | **20** (chevron 16 + gap 4) | Structure: a child's chevron sits under its parent's icon | Was 16, which aligned with nothing |
| icon → label | **8** (row gap 4 + label inset 4) | Notion 8 | Was 4 |
| label · text | 14/20 400 | Notion 14/21 400 | — |

Measured after: depth 1 chevron at 8, icon at 28, label at 52; depth 2 chevron at 28
(under the parent's icon), label at 72; depth 3 chevron at 48, label at 92; resting ink
rgb(102), selected rgb(40) on rgb(243).

## Behavior and accessibility

Unchanged: `role="tree"`/`treeitem`, one tab stop, arrow keys, typeahead, `aria-level`,
`aria-expanded`, `aria-selected` or `aria-checked`. The chevron's 24px pointer target is
its `::before` plate; keyboard users expand with Left/Right.

## Visual pass

Pass review container (`GalleryReviewTreeView`): the project-files tree before and after
at 1× and 3×. Not screenshotted in this pass (the browser pane was hidden); geometry
measured as above.

## Verification

- 1 Notion capture; 3 Area captures before and 3 after; checksums verified.
- `build:docs` (docs audit), `typecheck`, `test:contracts` (14), `test:badge` (9),
  `test:preview` (4), `npm test` (tokens and contrast): all pass.
- Unverified: hover plates on screen, dark theme, Notion indent and hover, Figma layers.

## Feedback log

- 2026-09-25 · owner approved Breadcrumb and asked to move on → Tree view first pass:
  secondary ink at rest, 8px start, 16px chevron slot, 20px indent, 8px to the label → 3
  Area captures after.
