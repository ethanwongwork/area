# Tree view spec

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
| state | disabled | Skipped by arrows and typeahead; the whole row dims to 50%, icon and chevron included, as Nav, Menu and Tabs (audit D-5) | Disabled row |
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
area     div[treeitem] 32px, radius 8, padding-start 8 + depth × 22 (20 at pass 1)
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
| row · ink at rest | **`fg-default`**, as Nav and every other list; the plate alone marks current or selected (`tree-view.css`) | Audit D-3 A (owner); peer Nav (ChatGPT rgb(13), 2026-09-27) | Notion rgb(95). Was `fg-muted` (pass 1) while Nav moved to default on 2026-09-27 |
| row · ink selected/current | `fg-default` + `bg-component-active` (navigation kind; checkbox kind `bg-component`) (tree-view.css:26-27, 46-47) | Peer Nav current | Was `bg-component-hover` |
| row · start padding | **8** | Nav 8; Notion 8 | Was 4 |
| chevron · slot | **16** (Area chevron glyph), 20px hover plate, 24px target | Area icon slots; Notion's 12px chevron in a 22px slot | Was a 28px box, pushing labels to 56px. Notion shows the chevron only on hover, sharing the icon's slot; Area keeps it visible, since a file or filter tree must show what expands |
| chevron → icon → label | **6 and 6** (row gap 6, label inset 0) | Owner (pass 3): evenly spaced on shared columns | Was 4 and 8 (pass 1, Notion's 8 to the label). Tree keeps its own grid, not the `--area-gap-row` 12 that puts Menu, Nav, Command palette and Select labels at 36 (audit S11a). Box gaps are equal; visible ink gaps are about 11 and 9, since the chevron's ink sits about 3px inside its box and the folder's about 2px. Not corrected per glyph (inset rules) |
| indent · per level | **22** (slot 16 + gap 6) | Owner (pass 3): a child's chevron under its parent's icon, its icon under the parent's label | Was 20: a child's icon landed at 48 under a parent label at 52 |
| label · text | 14/20 400 | Notion 14/21 400 | — |
| chevron · hover plate | **20** (inset −2), pointer target 24 (`::after`); painted `bg-hover`, so it shows on a hovered or current row (`tree-view.css:73`) | Owner (pass 2); audit S11c | Was 24: its edge met the icon box (0px). Now 2px clear of the icon, 6px from the row edge. The paint was `bg-component-hover`, invisible on a hovered row and a lighter hole on a current one |
| focus-visible | 2px `focus-color` outline, inset (offset −2), as Nav and Tabs (`tree-view.css:50`) | Audit S11b (owner) | Was a 2px offset. Menu keeps plate-only focus |
| current marker | **none** | Owner (pass 3) | Pass 2 made it a 3 × 16 pill. Notion and Figma draw none; fill, main ink and `aria-current` remain |
| actions · slot | end of row, 2px between controls, −4px end margin (a 16px glyph in a 24px sm button lands 8px from the edge, as the row's text) | Owner (pass 2); Figma layers (owner screenshot, not captured) | Hidden until hover, focus-visible or selection; `data-pinned` keeps a state control visible. Ghost Buttons here hover `bg-hover` and press `bg-active` (`tree-view.css:74`; audit S11c) |
| folders (gallery) | Area filled folder, `fg-info` | Owner (pass 2) | Demo content; the component does not colour icons |

Measured after pass 1: depth 1 chevron at 8, icon at 28, label at 52; depth 2 chevron at
28, label at 72; resting ink rgb(102), selected rgb(40) on rgb(243). Pass 3 measurements
are under Verification.

## Behavior and accessibility

Unchanged: `role="tree"`/`treeitem`, one tab stop, arrow keys, typeahead, `aria-level`,
`aria-expanded`, `aria-selected` or `aria-checked`. The chevron's 24px pointer target is
its `::after`; the painted plate (`::before`) is 20px. Keyboard users expand with Left/Right,
which swap in RTL (`TreeView.tsx:93-94`); a collapsed chevron points along the reading
direction (`:dir(rtl)` rotates it 90°). Typeahead shares Menu's one window
(`TYPEAHEAD_RESET`, 1000ms, `Overlays.tsx:30`). Forced colours paint selected and current rows
`Highlight` / `HighlightText` (`forced-colors.css`, audit D-14).
Row `actions` are outside the single Tab stop: consumers give each control `tabIndex={-1}`
and a keyboard equivalent (as Figma's shortcuts for hide and lock). Screen readers still
reach them in browse mode; interactive content inside `treeitem` is outside the APG
pattern and needs screen-reader testing before acceptance.

## Visual pass

Pass review container (`GalleryReviewTreeView`), replaced each pass: pass 3 shows the
pass-2 spacing against the even spacing at 1× and 3×. Pass 2 checked the chevron plate at
3× on screen (2px clear of the folder).

2026-09-27, Claude in Chrome, side by side with Notion's sidebar tree (page rows, hover) beside
the gallery's default tile: same row model (16/20 icons, 8 between icon and label, a neutral
hover plate, actions at the row's end). Notion swaps the page icon for the chevron on hover
and reveals + and ··· there; Area keeps a chevron column visible at rest, as Figma's layers
panel does, so nesting reads without hovering. Area's rows are 32 against Notion's 30.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified in the built-in browser on `/tree-view.html` (computed
transitions, `getAnimations()` on expand and on check, rects).

| Interaction | Before | After |
|---|---|---|
| Row hover plate | snapped both ways | instant in, `--area-transition` out (fast, ease-out) |
| Selected / current plate | snapped | instant in, fast out |
| Chevron turn | `transform: rotate()` with no transition (snapped) | `rotate` on fast ease-out, the one chevron rule |
| Chevron hover plate | snapped | instant in, fast out |
| Row actions reveal | opacity fast both ways | instant in, fast out (as every hover) |
| Checkbox face (checkbox mode) | snapped | instant in, fast out |
| Check mark | mounted and unmounted (no motion) | always rendered; `scale` 0.6 → 1 with `opacity` on fast ease-out, both ways, as Checkbox's mark; rests at scale 1 |
| Focus ring | outline, instant | unchanged |

Crispness: the check was the 16px drawing at 100% of the box's 14px content area (a 14/16 scale,
MOTION.md crispness 4). It now covers the border box at 16 with a −1px margin, as Checkbox's mark:
measured 16 wide at offset 0,0. Reset's `max-inline-size: 100%` is lifted for it.

React: `TreeView.tsx` renders the check glyph on every checkbox row (shown by `aria-checked`), so
it can fade out.

Open questions:
- Children appear and disappear at once on expand and collapse (Figma, Notion and VS Code do the
  same). Recommendation: keep; animating a flat list of rows would need height motion on each row.

## Verification

- 1 Notion capture; 3 Area captures before and 3 after; checksums verified.
- `build:docs` (docs audit), `typecheck`, `test:contracts` (14), `test:badge` (9),
  `test:preview` (4), `npm test` (tokens and contrast): all pass.
- Pass 2: plate measured in the gallery (6–26 from the row edge, icon at 28); 3× hover
  checked on screen. `typecheck`, `build:docs`, `test:contracts` (14), `test:preview` (4),
  React tests (87): all pass.
- Pass 3: columns measured in the gallery for Project files, Checkbox filters and Disabled
  row: every depth-n row has chevron, icon or check, and label at 8 + 22n, 30 + 22n and
  52 + 22n; no `::before` on current rows. (Resting ink rgb(102) above is pass 1; rows rest in
  `fg-default` since audit D-3.) 3× checked on screen. `typecheck`, `build:docs`,
  `test:contracts` (14), `test:preview` (4), React tests (87): all pass.
- Unverified: dark theme, Notion indent and hover, Figma layers geometry (row height, 11px
  type, icon and control sizes: needs a capture in the editor), screen-reader behaviour of
  row actions. Layer-type glyphs (frame, rectangle, component, lock) are stand-ins until
  drawn under the icon construction rules.

## Review note, 2026-10-12 (consistency pass)

- **What changed:** in a checkbox tree, an unchecked box has Checkbox's slightly firmer edge (#d4, was #e2) in light mode; dark mode is unchanged.
- **Why:** the tree's box is drawn to look like Checkbox (the checked box already did); unchecked it still had the lighter field edge.

## Interaction polish, 2026-10-16

Rows press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). Row text is not selectable. The arrow cursor stays (Figma's layers). See [interaction polish](../research/interaction-polish-2026-10-16.md).

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
- 2026-09-27 · owner again: "i thought we removed indicators from tree view" → confirmed removed in this pass; the checked filter box paints like Checkbox (neutral solid face), from the cohesion audit.
- 2026-09-27 · batch 2 → Claude in Chrome side by side with Notion's sidebar tree recorded; Validated.
- 2026-09-30 · audit S11 (owner) → rows draw an inset focus ring (offset −2, was +2; `tree-view.css:50`); the chevron plate and ghost row actions hover `bg-hover` (press `bg-active`), so they show on a hovered or current row (`tree-view.css:73-74`); the 6 and 6 grid stays, apart from the 36 label column.
- 2026-10-01 · audit H-17 / S21b → row actions show without hover on touch (`@media (hover: none)`, as Message and Card reveals); pointer hover plates sit under `@media (hover: hover)`; disabled rows dim with `--area-opacity-disabled` (0.5).
- 2026-10-01 · audit D-3 (owner pick A) → rows rest in `fg-default`, as Nav (was `fg-muted`) → tree-view.css.
- 2026-10-01 · audit D-11 → typeahead uses the shared 1000ms window (`TYPEAHEAD_RESET`), as hosted and anchored Menu → TreeView.tsx:115, Overlays.tsx:30.
- 2026-10-01 · audit D-13 → Left / Right swap in RTL; a collapsed chevron points along the reading direction (`:dir(rtl)` rotate 90) → TreeView.tsx:93-94, tree-view.css.
- 2026-10-01 · audit D-14 → forced colours paint selected and current rows `Highlight` / `HighlightText` → forced-colors.css.
- 2026-10-01 · owner: "tree view, i think figma has their button all the way at the end" → the last row action ends as far from the row's end as it sits from the top, `(row − action) / 2`: 2 at default (was 4), flush at compact (was 4), as Nav's row actions and Figma's visibility toggle. Actions are concentric with the row (row radius less that inset). docs/research/compact-pass-2026-10-01.md.
- 2026-10-02 · compact evidence audit → the row glyph edge holds at 8 at compact (was 6; Figma 8, VS Code 9) (R1) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-02 · compact evidence audit → rows stack flush at compact (`ui-row-gap` 2 / 0; VS Code tree rows abut; R7) docs/research/compact-evidence-2026-10-02/README.md.
- 2026-10-21 · owner: "make sure the gaps between the nav items is consistent ... in compact, that gap shouldnt go away" → `ui-row-gap` is a constant 1px at every type and density (was 2 − 2 × ui-dense: 0 at Compact 12–13, 2 at Default, up to 5 at Comfortable); supersedes the line above. ChatGPT 35 rows and Notion 30 rows, 1 apart (`nav/chatgpt--sidebar-top-group`, `nav/notion--sidebar-private-section`); headless Edge: 1px in Nav and Menu at all 15 type × density combinations.
- 2026-10-03 · roundness → the check box follows Checkbox: a quarter of the box plus the shift (`tree-view.css`). `docs/research/radius-audit-2026-10-03.md`, "Roundness".
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → row, selection and chevron plates land at once and fade out on fast; chevron turns on fast (was a snapping transform); check mark enters from 0.6 and is drawn 1:1 at 16 (was 14/16).
- 2026-10-12 · owner adopted the product UI rules (docs/PRODUCT_UI.md, rule 3: rest → hover → press → selected, each a step firmer) → a held row (not selected or current) takes `bg-component-active`, landing at once; replaces the hover-plate-only press → `tree-view.css`; desktop gallery.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the check box's resting edge is Checkbox's `edge-control-hover` (audit S5; was `edge-control`) (tree-view.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, review round 21 (components21): approved → Complete in `component-status.mjs`.
- 2026-10-22 · motion sweep (owner: "make sure all the motion interaction ... is implemented correctly into all the components"; `docs/research/motion-2026-10-22`) → a row control's hover plate fades out on fast as every Button's: the reveal's opacity-only transition had replaced the control's colour transition, and the reveal now zeroes only its own clock (`--_reveal`) → tree-view.css.

## Review note, 2026-10-22 (round 67)

- **What changed:** rows sit 1px apart (were 2px at the default size). A row's lock and visibility buttons now fade
  their hover plate out like every other button; before, the plate disappeared at once when the pointer moved back
  to the row. Keyboard focus is the brighter indicator blue (#0160d9, was #004cb0).
- **Why:** the 1px gap is your Nav note, applied to every family that stacks rows. The fade came from the motion sweep
  across all 119 families: the row's reveal rule replaced the buttons' own colour transition. The fade only shows
  while moving the pointer, so the Before and After here look the same at rest.

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.
