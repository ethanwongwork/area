# Table spec

**Captures:** `docs/research/captures/table/`
**Peers:** Menu, Nav, Tree view and Select (row plates), Card and Panel (container edge),
Checkbox (row selection), Badge and Skeleton (cell content), Separator (dividers)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Table retains three
  cell inset sizes (row spacing, not table width or text size). The gallery separates
  selection, sorting, compact rows, stripes and optional columnDividers; its tiles are 2×2.
  Stripes use bg-well (#f9f9f9 / #161616 at Layers 0). Headers align vertically to
  the middle. Sorting and selection are composed with native headers, buttons and Checkbox
  in the live gallery, rather than a data-grid API.
  Reference: [Carbon Table](https://carbondesignsystem.com/components/data-table/usage/).
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#colour)).
  Selected rows use the neutral selection fill.
- 2026-09-26: Decide every open item with the most calculated option consistent with the
  system ([second pass](../research/cohesion-audit.md#second-pass-notion-figma-and-the-open-decisions)).
  For Table: row and column rules use the new `border-divider` role; selection paints from
  `data-selected` (item 14), so a plain table no longer needs `aria-selected`.

## Job and boundaries

Table presents rows of structured data in a native `table` inside a scrolling wrapper. It
styles cells, headers, dividers, stripes and row plates. Sorting, selection and loading
are compositions of native elements and other components; there is no data-grid API,
keyboard grid or virtualisation (Notion's table view is such a grid: resizable, draggable
columns and editable cells).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | sm 4 on the UI line; md (default) and lg on the prose line, their block inset the frame's less the half-leading (md 9, lg 13 at type 13 / 32) | Owner (three cell insets); balanced, 2026-10-31 | Untitled header 44 / 36, rows 72 / 56; Notion rows 36 |
| interactive | off, on | Hover plate only when a row is clickable | Untitled row hover; Notion reveals row controls instead |
| layout | auto (default), fixed | fixed: the first column is the label column (27%), so the tables of one feed start their values on one line; the other columns size to their content | Primer's props table (Name 27%); Cursor's dashboard settings (values on one line per group); owner pick, 2026-10-31 |
| striped | off, on | Long, wide rows | Owner |
| column-dividers | off, on | Dense comparisons | Owner; Notion draws hairlines between every cell |
| composition | selection, sorting, empty, loading | Owner (composed, not an API) | Untitled checkbox column; Notion's hover checkbox |

Gallery groups (`apps/docs/scripts/build.mjs:772-783`): Default; Content (selection,
sorting, interactive rows); Sizes (sm, lg); Layout (striped, column dividers); States
(empty, loading).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Table view: header row, one header cell, a body row at rest and hovered | app.notion.com returns table view, 2026-09-26 (second pass) | evidence only | `table/notion--header-row--rest--light`, `table/notion--header-cell--rest--light`, `table/notion--body-row--{rest,hover}--light` |
| uui | design system (source) | Table | [reference](../research/untitled-ui-reference.md), `table.tsx:55-277` @ `4702dc0` | MIT | — |
| carbon | design system (guidance) | Data table usage | Owner reference (above) | — | — |
| area | this system | 10 gallery tiles after the second pass | localhost gallery | — | `table/area--*` (10) |

Figma and ChatGPT have no data table; searched Figma's file browser (a card grid, `card/figma--file-card`)
and the second-pass captures. Their row plates are taken from sidebar, menu and icon-button
hovers (5% black, BASELINE). Light theme only. Notion's cell hairlines show as 0.56px gaps
between cell boxes; their colour is not in the capture.

## Anatomy

```
notion  div rows, full-bleed (no container edge or radius); tabular-nums on the whole view
  header  36 tall, no fill; cell padding 0/8; 16px property glyph, 6 gap, 14/16.8 400 rgb(125, 122, 117)
  body    36.55 (36 + hairline); cell padding 7.5/8, 14/21 400 rgb(44, 44, 43)
  hover   no row plate; a row checkbox fades to 0.7 and each cell shows a white "open" chip
area  div.area-table-wrapper  1px border-divider, radius 12, bg-surface, overflow-x auto
  table.area-table  border-collapse, 14/20
    th   padding 8/12 (16 at the frame, md and lg), bg-well (a well ground: its buttons step from it), fg-muted, 400, nowrap, middle
    td   padding 8/12 (16 at the frame, md and lg), top-aligned, 1px border-divider below (none on the last row)
    .area-table--fixed  first column 27% (the label column)
    .area-table__cell--numeric  end-aligned, tabular figures
    .area-table__cell--fit      shrink-to-fit control column
```

Inset: cell = `--_cell-inset` (4 / 8 / 12) block, `--_cell-side` 12 inline between columns (compact 8, a literal since the
`gutter-*` tokens were removed 2026-10-02), and `--_cell-edge` = side + 4 at the frame for md and lg (sm keeps the side
inset); the wrapper border is outside the table, so the first column's text sits 1 + 16 = 17 from the wrapper edge (sm 13).
Row height md = 8 + 20 + 8 + 1 divider = 37 (Notion 36 + hairline = 36.55).

## Measurements

`node scripts/capture-compare.mjs --slots shell table/notion--{header-row,header-cell,body-row}--rest--light.json table/notion--body-row--hover--light.json table/area--default--rest--light.json` (trimmed):

| slot · property | notion · header-row | notion · header-cell | notion · body-row | notion · body-row · hover | area · default |
|---|---|---|---|---|---|
| **shell** size | 1151.98 × 36 | 124.01 × 23.99 | 1151.98 × 36.55 | 1151.98 × 36.55 | 578 × 112.08 |
| **shell** border | 0 | 0 | 0 | 0 | 1 solid rgb(243, 243, 243) (at capture; now `border-divider` #e2) |
| **shell** radius | 0px | 0px | 0px | 0px | 12px |
| **shell** gap | — | 6px / 6px | — | — | — |
| **shell** font | 16px/24px (cells 14/21) | 14px/16.8px 400 | 16px/24px (cells 14/21) | same | 16px/24px (table 14/20) |
| **shell** color | rgb(125, 122, 117) | rgb(125, 122, 117) | rgb(44, 44, 43) | rgb(44, 44, 43) | — |
| **shell** background | — | — | — | — (no plate) | rgb(255, 255, 255) |

Area cells (node trees): md header 36.5, body rows 37.04, padding 8 12 (`area--default`); sm
rows 29 (`area--compact`); lg rows 45.04 (`area--size-lg`); header fill rgb(247, 247, 247), ink
rgb(102, 102, 102); even stripes rgb(250, 250, 250) (`area--striped`). No tile shows a
selected or hovered row.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| wrapper | 1px **`border-divider`** #e2e2e2 at `stroke-width`, so the frame keeps its edge under the Elevated preset (where `border-width` is 0); radius 12 (`radius-container`), no shadow (`navigation.css:121-130`) | Peer Card edge (third pass); Untitled radius 12 | Was `border-decorative` #f3, lighter than the row rules inside it. Untitled adds `shadow-xs`; Notion is full-bleed. The frame stays darker than Card's #ee edge because it has no shadow to carry it (audit S7b) |
| text | `ui-size` (13 at type 13); line: sm the UI line (18), md and lg the prose line (`text-base-prose-leading`, 20) since 2026-10-31 | Untitled body 14/20; Notion cells 14 | Follows the density axis |
| cell inset | block: sm 4; md the edge less the prose line's half-leading (9 at type 13 / 32, so the text is 14 from the rules, as from the frame); lg 4 more. 12 inline between columns, 16 at the frame (md, lg; sm 12), less the density step |  Owner (three insets); Primer props 16 at the frame, 12 between columns (2026-10-31) | Notion 7.5 / 8; Untitled 24 sides; the frame step is Primer's and Cursor's settings (14 side, rules 12 in) |
| label column (`layout="fixed"`) | first column 27%, wraps; outranks a fit cell | Primer props: Name 198 of 728 (27%), Default 15%, Description 58% | Only the first column is fixed; the rest size to content, as the app's API tab needs (Prop, Type, Default, Description) |
| header | `bg-well` #f9f9f9 / #161616 at Layers 0 (the recessed tone from Layers 50 in light), `fg-muted`, 400, middle | Untitled neutral-50 header, neutral-500 ink; owner (middle); Notion muted 400 ink | Notion has no header fill; kept (third pass) |
| body alignment | top (first line) | Inset contract (first-line alignment) | — |
| divider | 1px **`border-divider`** #e2e2e2 / #333333 below each row but the last, at `stroke-width` like the frame (since the 2026-10-12 consistency pass) | Second pass divider role; Untitled 1px neutral-200 | Was `border-decorative` |
| hover (interactive) | `bg-component-hover` #f3f3f3 / #333333 on the cells | Row-plate rule; Untitled row hover | Notion paints no plate; kept (third pass): shared row plates |
| selected (`data-selected`) | `bg-component-active` #eeeeee / #3f3f3f, kept under the pointer | Selection one step above hover | Untitled uses neutral-50 for both |
| stripes | `bg-well` #f9f9f9 / #161616 on even rows | Owner | Selection wins over a stripe (same specificity, later rule, `navigation.css:211, 213`) |
| numeric | end-aligned, `tabular-nums` | Earlier Area value | Notion sets tabular figures on the whole view |

Settled in the third pass, all kept: Notion's is a database grid; Area's Table is a data
table with shared row plates ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).
1. Frame. Notion's table has no container edge, radius or header fill; the header is told
   apart by its muted ink alone (`notion--header-row--rest`). Area keeps the bordered,
   rounded wrapper with a `bg-well` header, as Untitled does.
2. Inline cell inset. Notion pads cells 8 inline (`notion--body-row--rest` node 9); Area
   keeps 12 (compact 8).
3. Hover. Notion's hovered row gains no fill; it reveals a row checkbox (opacity 0 → 0.7)
   and per-cell "open" chips (`notion--body-row--hover` nodes 4, 11). Area's opt-in
   `interactive` rows keep the shared hover plate.

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| rest | no fill | `area--default`; `notion--body-row--rest` |
| hover (`--interactive`, unselected rows) | cells `bg-component-hover`; transition on the cells | `navigation.css:175-184`; not captured |
| selected (`tr[data-selected]`, or `aria-selected` in a grid) | row `bg-component-active`; no hover over it | `navigation.css:213`; not captured selected |
| focus-visible | on the composed controls (Checkbox, Button) only | — |
| loading | `aria-busy` with Skeleton cells | `area--loading` |

## Behavior and accessibility

A native `table`; React forwards props and the ref to the `table` and always wraps it in
`.area-table-wrapper` (`primitives.tsx:699-720`). Headers use `scope="col"`, sorting sets
`aria-sort` on the header with a Button inside; the header Button overhangs the cell's block
padding so the row keeps its text height and the label sits on the column's text edge
(`navigation.css:197-200`, audit F-24). A clickable row holds one `TableLink`
(`.area-table__link`), stretched over the row as CardLink covers a card, so the `interactive`
hover plate keeps its promise; other controls in the row sit above it, and the row draws the
link's focus ring (`navigation.css:186-193`, audit F-23 A, owner 2026-09-30). `wrapperProps` go to
the scrolling wrapper, which becomes a focusable region named after the table only while it
overflows (`primitives.tsx:1025-1060`). The selection tile marks rows with
`data-selected` (a paint hook) and the row Checkbox carries the accessible state; `aria-selected`
still paints for grid and treegrid rows. Notion's cells are `role=button` inside a custom grid.

## Peers and consistency

| Peer | Shared role | Peer value | Table | Match / reason |
|---|---|---|---|---|
| Menu, Nav, Tree view, Select | hover / selected plates | `bg-component-hover` / `-active` | same | match |
| Panel | container edge, radius | 1px `border-decorative`; `radius-container` 12 | `border-divider`, 12, no shadow | edge differs: Panel's lift carries its seam; a table has none |
| Card | container edge | 1px neutral 100 #ee with a halo (`--area-shadow-card`) | `border-divider` #e2, no shadow | differs by design (audit S7b): Card's halo carries its lighter edge; a table has none |
| Separator, Menu, Nav | rule | 1px `border-divider` | same | match |
| Menu, Nav | row height at md | 32 | 37 | a data row carries 8px block insets and a divider, not a control height (Notion 36) |

## Visual pass

2026-09-28 (batch 16, Claude in Chrome): Notion's table view ("returns", read-only): rows 36.6,
0.56px rules at 7% warm (row and column), header 14/21 muted with no fill, cells without
padding of their own. Area's md row is 37 (36 + the rule) with 12 inline insets, a framed wrapper, a
`bg-well` header and horizontal rules only: the three differences settled in the third pass
(frame, inset, hover) stand. Selected row under the pointer: the hover rule excludes selected
rows (`.area-table--interactive tbody tr:not([data-selected], [aria-selected="true"]):hover`),
so the #ee selection plate stays; checked in the gallery's selection tile by rule and computed
paint, not with a real pointer (the preview pane was hidden). Unverified: dark theme.

## Motion and interaction, 2026-10-07

Contract: `docs/MOTION.md`. Verified by computed transitions on `/table.html`.

| Interaction | Before | After |
|---|---|---|
| Row hover (cells) | 100 both ways | instant in, fast ease-out out |
| Row selected plate | snapped both ways | instant in, fast out |
| Row link focus ring | outline, instant | unchanged |

## Verification

Compared the four Notion table captures with 10 Area captures (`table/area--*`, re-taken
after the second pass) and Untitled UI source values. Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Hover and selection paints were
read from the CSS; no Area capture shows them.

## Interaction polish, 2026-10-16

Interactive rows press at `bg-component-pressed`, one step past selected (Notion presses at 10%, ChatGPT 12%; it shared selected's fill, 1.5% below hover). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Feedback log

- 2026-09-26 · cohesion audit → hover `bg-hover` → `bg-component-hover`; selection
  `bg-component-hover` → `-active` → 8 Area captures, ChatGPT hover captures (BASELINE).
- 2026-09-26 · found while writing this spec → the hover transition sat on `tr` while the
  plate paints `td` → transition on the cells → `navigation.css:169-171`.
- 2026-09-26 · second pass (Notion, Figma; owner: decide all open items) → dividers
  `border-divider`; selection from `data-selected`; lg and interactive tiles added; open
  questions on the frame, inline inset and hover → `notion--header-row`,
  `notion--header-cell`, `notion--body-row` (rest, hover).
- 2026-09-27 · third pass → open questions settled, values kept (frame, 12px cells, hover
  plate) → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · third pass, follow-up → wrapper edge `border-decorative` → `border-divider`, like Card: a table's frame is never lighter than its own row rules → [cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open).
- 2026-09-27 · owner: "the large table stroke is way thicker" → the large and interactive gallery tiles wrapped a Table in a second `area-table-wrapper`, drawing the edge twice; the demos now render Table alone (component unchanged) → Pass review in the gallery.
- 2026-09-30 · audit S7b (owner picked C) → no change; the frame keeps `border-divider` #e2 with no shadow, where Card keeps #ee carried by its halo → navigation.css:126.
- 2026-09-30 · audit S10, S11b (owner) → the frame's border uses `stroke-width`, so it keeps its edge under the Elevated preset (`navigation.css:127`); no focus change, since rows are not focusable yet (family call F-23 open).
- 2026-09-30 · audit S17 (API vocabulary, slice 2, H-13) → manifest default `size: "md"` added (manifest.ts:600); the md modifier equals the base rule, no visual change.
- 2026-10-01 · audit F-23 (owner pick A) → `TableLink`: one stretched link makes a row clickable, with the row's focus ring; `wrapperProps` for the scrolling wrapper → primitives.tsx:1025-1035, navigation.css:186-193.
- 2026-10-01 · audit F-24 → a sort Button in a header cell overhangs the cell's block padding, keeping the row at its text height with the label on the column's text edge → navigation.css:197-200.
- 2026-10-01 · compact pass round 6 → cell padding above and below steps down at compact (sm 4 → 2, md 8 → 6, lg 12 → 8); the side padding already followed `gutter-md` (12 → 8). docs/research/compact-pass-2026-10-01.md.
- 2026-10-03 · radius audit D1 (owner) → the container role is 12 at compact too (was 8; Figma 13, Cursor 12-14), so this family's surface is 12 at both densities; rows concentric with a floating surface follow (compact 24 rows r8). `docs/research/radius-audit-2026-10-03.md`.
- 2026-10-07 · owner: make interactions professional, intentional, subtle; components look pixelated → row hover and selection land at once and fade out on fast.
- 2026-10-12 · owner adopted the product UI rules (docs/PRODUCT_UI.md, rule 3: rest → hover → press → selected, each a step firmer) → a held row of an interactive table (not selected) takes `bg-component-active`, landing at once; replaces the hover-plate-only press → `navigation.css`; desktop gallery.
- 2026-10-12 · owner: icons and type sit on the surface, no containers (Cursor's icon gallery) → `flush` (no frame, edge, corner or header ground; the cell side inset hangs outside the content edge) and `baseline` (cells align on their first baseline) booleans → navigation.css, manifest.ts, `Table` props; desktop gallery Typography and Icons lists.
- 2026-10-12 · owner: flush tables' "divider lines going almost all the way across … should align with the content" → flush no longer hangs the cell inset into the margin: the outer cells drop their side inset, so text and rules share the content edges; a hover, pressed or selected row reaches that inset past each edge as a shadow of its fill → navigation.css.
- 2026-10-22 · owner: "make sure the gaps vertically are correct and consistent" (the desktop Canvas feed: sections ending in a flush table sat 5–11 lower than those ending in a card) → a flush table meets what is above and below with its ink. Not interactive: the first row drops the cell inset above it and the last row the inset below, and their text is trimmed to cap and baseline (a cell holding Code, Badge or Kbd keeps its line box). Interactive: cells keep their inset for the row plates and the table hangs it into the margin above and below (negative block margin), as the plates already hang past each side. Trimmed text reaches past the table by its ascenders and descenders, so a scroller that clips needs room round it (the desktop app's `.studio-table-scroll`: 8 inside, given back outside) → navigation.css.
- 2026-10-22 · owner: "i want to use this table" (the gallery's default tile) → the desktop app's tables (Theme, Setup, Typography, Components, Color, Icons, Brand, the Documentation and Spec tabs, the Inspector's facts) drop `flush` for the default framed Table; `flush` stays a variant. The app's `.studio-table-scroll` room is removed (a framed table does not reach past its box).
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → row rules and column dividers are at `stroke-width`, as the frame (were `border-width`, so under Elevated a framed table lost its rows) (navigation.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · type size and density split (owner) → cell insets follow the spacing step (`ui-dense`, 8 → 18 at the side); the frame's corner is capped at 1.5 × the side inset (compact at type 12–13, radius 12+: 18 over 8 → 12) (`navigation.css`). `docs/research/ui-size-scale-2026-10-12.md`.
- 2026-10-15 · PRODUCT_UI.md open gap ("Table props for its fit and numeric cells"), owner: "merge it, then continue working" → `TableCell` and `TableHeaderCell` (`scope="col"` by default) take `numeric` and `fit`, writing the existing `area-table__cell--numeric` / `--fit` modifiers; nothing renders differently. The app (Facts, the Stage's anatomy, Components' list, the Icons list) and the Table demos use them instead of the class names.
- 2026-10-31 · owner picks on the feed rhythm review ("build my picks"; question: "how does this impact denser tables that are in the inspector panel") → the first and last cells sit 4 further from the frame than columns sit apart (md, lg; sm unchanged, so dense tables keep one inset), and `layout="fixed"` gives the first column a 27% label column; rows unchanged → navigation.css, manifest.ts, primitives.tsx, gallery tile "Layout / fixed", family-tabs.tsx. docs/research/feed-rhythm-2026-10-31.

## Feed rhythm, 2026-10-31

Research and picks: `docs/research/feed-rhythm-2026-10-31/` and the review page (collection `verdicts`). Measured: Cursor's
settings (bundle CSS: rows 12 / 14, 13/18, 42 tall, rules inset 12), Primer's props table (live: 8 block, 16 at the frame,
12 between columns, rows 43.66, columns 27 / 15 / 58%), Claude's settings rows and transcript (bundle). Area's API tab had
label columns of 84, 200 and 145 on one page and rows of 33.

| Pick | Owner | Built |
|---|---|---|
| Row spacing (block inset +4) | Keep (a) | Nothing: rows stay 33 at type 13 |
| Outer cells +4 at the frame | Yes | `--_cell-edge` on the first and last cells, md and lg; sm keeps one inset for dense tables in panels and chat replies (the Inspector chat's markdown tables are `size="sm"`) |
| One label column per feed | Yes (b) | `layout: auto \| fixed`; the app's Documentation, API and Spec tables use fixed (Best practices' mark column stays auto) |
| Header ground | Keep | Nothing |

## Review note, 2026-10-22 (round 69)

- **What changed:** Selection now defaults to the accent, so this family's checked, on, selected, current and filled
  parts are the accent blue instead of near-black (#282828). Nothing else changed. A theme set to Selection Neutral
  looks exactly as before; the "Selection / neutral" tile shows it.
- **Why:** your pick of option B: one setting colours everything selected, so a selected card's edge and the mark
  inside it always match (docs/research/selection-colour-2026-10-22). With an accent chosen, most of the system was
  blue already; buttons follow Action, which stays neutral.

## Review note, 2026-10-31 (balanced insets, prose line)

- **What changed:** md and lg cells set their text on the prose line (13/20 at type 13) and take a block inset worked out
  from the frame's: the edge inset less the line's half-leading (`--_cell-inset`, read at the cell with `1cap`). Text now
  sits 14 from the rules on the ink, the same as from the frame's side; one-line rows are 39 at type 13 / 32 (were 33),
  35 at Compact, 47 at Comfortable; a wrapped description runs on 20px lines (was 18). sm is unchanged (UI line, 3 / 10).
- **Why:** the owner: "why do the tables have so much more horizontal spacing inset added than vertical top and bottom
  spacing?" (7 above and below against 14 at the frame, about 11 on the ink); and pick q-table-lines (Button's Props ran 8
  lines on the 13/18 UI line; Primer's prop table runs 1.67, Notion's 1.43). Cursor's settings rows 42, Primer's 44.
- Evidence: `docs/research/type-pass-2026-10-31/README.md`. Back to review.

## Review note, 2026-10-31 (public hooks)

- **What changed:** two public hooks, as Asset card's: `--area-table-corner` (the wrapper's corner) and
  `--area-table-edge` (the first and last cells' side inset, md and lg; sm keeps one inset). Both fall back to the
  values above. The desktop app's feed sets them to its one frame inset and corner (16 / 16 at type 13 / 32), on its own
  tables only; with the balanced block inset that makes its rows 43.
- **Why:** the owner asked for one consistent, spacious feed (`docs/research/feed-system-2026-10-31`); tables were the
  one frame at 14 / 14 among 16s. Listed in `OVERRIDABLE` (rederive.ts).

## Review note, 2026-11-01 (one family of frames)

- **What changed:** a third public hook, `--area-table-fill` (the wrapper's fill; `bg-surface` by default). The desktop
  app's feed sets it to its tiles' fill and puts its tables under the cards' Stroke 2 scope (`FEED_TABLE`), so a feed table
  is the same frame as a card: one fill, one edge (6% against the cards' 5%), the 16 corner and inset. Row rules stay
  lighter than the frame (3.75%). Listed in `OVERRIDABLE`.
- **Why:** the owner asked that "all containers feel consistent, and part of the same family"; Labs › Feed showed the
  tables as the page's white inside a darker edge beside light grey cards.
- 2026-11-01 · owner ("Yes, fix fills", colour system study, docs/research/color-system-2026-11-01): The header painted `bg-subtle` and striped rows `bg-stripe` (1.03:1), which equals the page at Layer contrast 0 (the default), so it vanished in both modes → `bg-well`, the recessed tone never closer to the page than the page's control fill (#f9f9f9 / #161616 at Layers 0, unchanged from Layers 50 in light). The header is declared a `well` ground (layers.css), so a sort button's hover steps from it; it was exempt as "header text only".

## Review note, 2026-11-01 (header fill)

- **What changed:** a fourth public hook, `--area-table-head-fill` (the header row's fill; `bg-subtle` by default, `bg-well` since main's colour fills),
  listed in `OVERRIDABLE`. The desktop app's feed tables set their rows to the page's white and the header to the control
  grey in light, and the rows to the tile grey under the page's near-black header in dark, so the header is always a step
  under the rows.
- **Why:** the owner: "i would prefer if the top part of the table was gray and the cells were white. or that the top
  part was always darker than the cells below". At Layers 0 the subtle ground is white, so the feed's header was white
  over tile-grey rows: lighter than its cells.

- 2026-11-02 · owner: "the token badges look off" → Code that starts a cell has no start margin (its side margin is
  for running text), so the chip starts on the cell's edge under the column heading; it sat 2 in.
