# Tree view spec

**Status:** in review · 2026-09-25 (first pass under the capture workflow); second-pass
evidence added 2026-09-26
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
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  No Tree view value changed in the second pass; its row plates were settled in the audit.
- 2026-09-27: no current-row indicator: "i thought we removed indicators from tree view". The current row is the plate alone.

## Job and boundaries

Tree view shows and navigates a hierarchy (files, pages, filters). Nav is a flat or
two-level site navigation; Menu holds commands.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Sidebar page tree row (top level, collapsed) | app.notion.com sidebar, logged in (Edge), 2026-09-25 | evidence only | `notion--sidebar-row--rest--light` |
| notion | target product | Sidebar rows rest, hover; current row rest, hover | app.notion.com sidebar, 2026-09-26 (second pass) | evidence only | `baseline/notion--sidebar-row--{rest,hover}--light`, `baseline/notion--sidebar-row-current--{rest,hover}--light` |
| figma | target product | Layers panel row: a layer name at rest, a selected row | figma.com editor layers panel, 2026-09-26 (second pass) | evidence only | `figma--layer-row--rest--light`, `figma--layer-row--selected--light` |
| area | this system | Three gallery tiles before and after | localhost gallery | — | `before/area--*` (3), `area--*` (3) |

Still not captured: the indent per level in either product (nothing in Notion's sidebar was
expanded, since expanding changes a stored sidebar state, and the Figma rows are at one
level); Notion's hover fill (`baseline/notion--sidebar-row--hover` shows no plate on the row);
Figma's selection fill (`figma--layer-row--selected` shows none on the captured node, so an
ancestor paints it). ChatGPT has no tree.

## Anatomy

```
notion   a[treeitem] 30px, radius 6, ink rgb(95, 94, 89)
  row    div, padding 5/8
    slot 22 × 18 (page icon 18–20px; the 12px chevron shares this slot and shows on hover), margin-end 8
    text 14/21 400, starts 38px in
  current  rgba(33, 27, 23, .05), ink rgb(44, 44, 43); same fill under the pointer (baseline, second pass)
figma    div 240 × 32 layer row, radius 0 (full-width rows), 11/16 400        (layer-row--selected)
  chevron  16 × 32 column, 16px glyph                                         (node 3)
  icon     16px, directly after the chevron (no gap)                           (nodes 6-8)
  label    8px inset: text starts at 40; chevron and icon ink are a lighter tint of the label's
area     div[treeitem] 32px, radius 8, padding-start 8 + depth × 20
  chevron  16px slot (Area chevron glyph), 24px hover plate and pointer target outside it
  icon     16px
  label    4px gap + 4px inset = 8px from the icon; ellipsis
```

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| row · height, radius | 32, 8 | Peer: Nav (32, 8); Figma layer rows 32 | Notion 30, 6; Figma rows are square-cornered full-width strips |
| row · ink at rest | **`fg-muted`** | Peer Nav rgb(102); Notion rgb(95) | Was `fg-default` on every row |
| row · ink selected/current | `fg-default` + `bg-component-active` | Peer Nav current (cohesion audit, 2026-09-26); Notion current ink rgb(44, 44, 43) | Notion's current fill (5% warm) equals its hover; Area keeps selection a step firmer |
| row · start padding | **8** | Nav 8; Notion 8 | Was 4 |
| chevron · slot | **16** (Area chevron glyph), 24px hover plate and target | Area icon slots; Notion's 12px chevron in a 22px slot | Was a 28px box, pushing labels to 56px. Notion shows the chevron only on hover, sharing the icon's slot; Area keeps it visible, since a file or filter tree must show what expands |
| indent · per level | **20** (chevron 16 + gap 4) | Structure: a child's chevron sits under its parent's icon | Was 16, which aligned with nothing; Figma's chevron-to-icon gap is 0; kept (third pass): the gap keeps the chevron's hit area apart from the icon |
| icon → label | **8** (row gap 4 + label inset 4) | Notion 8; Figma 8 | Was 4 |
| label · text | 14/20 400 | Notion 14/21 400 | — |

Settled in the third pass (kept): Figma's layer row puts the 16px icon directly after a
16px chevron column (`figma--layer-row--selected` nodes 1, 6), so the same structural rule
would give a 16px indent. Area keeps the 4px gap and a 20px indent: the gap keeps the
chevron's hit area apart from the icon ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)). Neither product's indent per level was
captured.

Measured after: depth 1 chevron at 8, icon at 28, label at 52; depth 2 chevron at 28
(under the parent's icon), label at 72; depth 3 chevron at 48, label at 92; resting ink
rgb(102), selected rgb(40) on rgb(243).

## Behavior and accessibility

Unchanged: `role="tree"`/`treeitem`, one tab stop, arrow keys, typeahead, `aria-level`,
`aria-expanded`, `aria-selected` or `aria-checked`. The chevron's 24px pointer target is
its `::before` plate; keyboard users expand with Left/Right.

## Visual pass

The gallery shows the project-files tree (Default), checkbox filters (Content) and the
collapsed tree (States). Not screenshotted in the first pass (the browser pane was hidden);
geometry measured as above. Not inspected in the second-pass spec update.

## Verification

- 1 Notion capture; 3 Area captures before and 3 after; checksums verified.
- `build:docs` (docs audit), `typecheck`, `test:contracts` (14), `test:badge` (9),
  `test:preview` (4), `npm test` (tokens and contrast): all pass.
- Second pass: compared the Notion sidebar rows (rest, hover, current) and Figma layer rows
  (rest, selected) with the Area captures (`area--*`, re-taken after the second pass).
- Unverified: hover plates on screen, dark theme, Notion indent and hover, Figma indent and
  selection fill.

## Feedback log

- 2026-09-25 · owner approved Breadcrumb and asked to move on → Tree view first pass:
  secondary ink at rest, 8px start, 16px chevron slot, 20px indent, 8px to the label → 3
  Area captures after.
- 2026-09-26 · cohesion audit ([cohesion-audit.md](../research/cohesion-audit.md)) → hover
  `bg-component-hover` (was `bg-component`), current `bg-component-active` (was
  `-hover`), the current rail in `fg-default` (was the focus colour), checked boxes in
  checkbox mode use Checkbox's neutral-solid face and 4px corner (were a tint with a
  focus-colour edge) → shared row plates with Menu, Nav, Table and Select.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → evidence added,
  no change: Figma layer rows agree on 32px rows and an 8px icon-to-label inset, Notion's
  current row on default ink; open question on the chevron-to-icon gap →
  `figma--layer-row--{rest,selected}`, `baseline/notion--sidebar-row{,-current}--*`.
- 2026-09-27 · third pass → open question settled, value kept: 20px indent (chevron 16 +
  gap 4) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: remove the indicator → the 2px `fg-default` rail on `aria-current` rows removed (`tree-view.css`); the `bg-component-active` plate carries the current row → headless Chromium.
