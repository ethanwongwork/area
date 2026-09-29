# Table spec

**Status:** in review · 2026-09-26 (cohesion audit, second pass)
**Captures:** `docs/research/captures/table/`
**Peers:** Menu, Nav, Tree view and Select (row plates), Card and Panel (container edge),
Checkbox (row selection), Badge and Skeleton (cell content), Separator (dividers)

## Owner decisions

- Before 2026-09-24 (moved from [prior decisions](PRIOR_DECISIONS.md)): Table retains three
  cell inset sizes (row spacing, not table width or text size). The gallery separates
  selection, sorting, compact rows, stripes and optional columnDividers; its tiles are 2×2.
  Stripes use bg-stripe (neutral 25 in light mode, 800 in dark). Headers align vertically to
  the middle. Sorting and selection are composed with native headers, buttons and Checkbox
  in the live gallery, rather than a data-grid API.
  Reference: [Carbon Table](https://carbondesignsystem.com/components/data-table/usage/).
- 2026-09-26: Neutral by default, accent by override ([design system](../DESIGN_SYSTEM.md#color-and-focus)).
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
| size | sm 4, md 8 (default), lg 12 block cell inset | Owner (three cell insets) | Untitled header 44 / 36, rows 72 / 56; Notion rows 36 |
| interactive | off, on | Hover plate only when a row is clickable | Untitled row hover; Notion reveals row controls instead |
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
    th   padding 8/12, bg-subtle, fg-muted, 400, nowrap, middle
    td   padding 8/12, top-aligned, 1px border-divider below (none on the last row)
    .area-table__cell--numeric  end-aligned, tabular figures
    .area-table__cell--fit      shrink-to-fit control column
```

Inset: cell = `--_cell-inset` (4 / 8 / 12) block, `gutter-md` 12 inline; the wrapper border
is outside the table, so the first column's text sits 1 + 12 = 13 from the wrapper edge.
Row height md = 8 + 20 + 8 + 1 divider = 37 (Notion 36 + hairline = 36.55).

## Measurements

`node scripts/capture-compare.mjs --slots shell table/notion--{header-row,header-cell,body-row}--rest--light.json table/notion--body-row--hover--light.json table/area--default--rest--light.json` (trimmed):

| slot · property | notion · header-row | notion · header-cell | notion · body-row | notion · body-row · hover | area · default |
|---|---|---|---|---|---|
| **shell** size | 1151.98 × 36 | 124.01 × 23.99 | 1151.98 × 36.55 | 1151.98 × 36.55 | 578 × 112.08 |
| **shell** border | 0 | 0 | 0 | 0 | 1 solid rgb(243, 243, 243) |
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
| wrapper | 1px **`border-divider`** #e2e2e2, radius 12 (`radius-container`), no shadow (`navigation.css:121-128`) | Peer Card edge (third pass); Untitled radius 12 | Was `border-decorative` #f3, lighter than the row rules inside it. Untitled adds `shadow-xs`; Notion is full-bleed |
| text | 14/20 (`ui-size`) | Untitled body 14/20; Notion cells 14 | Follows the density axis |
| cell inset | 4 / 8 / 12 block, 12 inline | Owner (three insets) | Notion 7.5 / 8; Untitled 24 sides; kept (third pass) |
| header | `bg-subtle` #f7f7f7 / #282828, `fg-muted`, 400, middle | Untitled neutral-50 header, neutral-500 ink; owner (middle); Notion muted 400 ink | Notion has no header fill; kept (third pass) |
| body alignment | top (first line) | Inset contract (first-line alignment) | — |
| divider | 1px **`border-divider`** #e2e2e2 / #333333 below each row but the last | Second pass divider role; Untitled 1px neutral-200 | Was `border-decorative` |
| hover (interactive) | `bg-component-hover` #f3f3f3 / #333333 on the cells | Row-plate rule; Untitled row hover | Notion paints no plate; kept (third pass): shared row plates |
| selected (`data-selected`) | `bg-component-active` #eeeeee / #3f3f3f, kept under the pointer | Selection one step above hover | Untitled uses neutral-50 for both |
| stripes | `bg-stripe` #fafafa / #282828 on even rows | Owner | Selection wins over a stripe (same specificity, later rule, `navigation.css:192, 194`) |
| numeric | end-aligned, `tabular-nums` | Earlier Area value | Notion sets tabular figures on the whole view |

Settled in the third pass, all kept: Notion's is a database grid; Area's Table is a data
table with shared row plates ([cohesion audit](../research/cohesion-audit.md#third-pass-the-questions-the-evidence-left-open)).
1. Frame. Notion's table has no container edge, radius or header fill; the header is told
   apart by its muted ink alone (`notion--header-row--rest`). Area keeps the bordered,
   rounded wrapper with a `bg-subtle` header, as Untitled does.
2. Inline cell inset. Notion pads cells 8 inline (`notion--body-row--rest` node 9); Area
   keeps `gutter-md` 12.
3. Hover. Notion's hovered row gains no fill; it reveals a row checkbox (opacity 0 → 0.7)
   and per-cell "open" chips (`notion--body-row--hover` nodes 4, 11). Area's opt-in
   `interactive` rows keep the shared hover plate.

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| rest | no fill | `area--default`; `notion--body-row--rest` |
| hover (`--interactive`, unselected rows) | cells `bg-component-hover`; transition on the cells | `navigation.css:169-176`; not captured |
| selected (`tr[data-selected]`, or `aria-selected` in a grid) | row `bg-component-active`; no hover over it | `navigation.css:194`; not captured selected |
| focus-visible | on the composed controls (Checkbox, Button) only | — |
| loading | `aria-busy` with Skeleton cells | `area--loading` |

## Behavior and accessibility

A native `table`; React forwards props and the ref to the `table` and always wraps it in
`.area-table-wrapper` (`primitives.tsx:699-720`). Headers use `scope="col"`, sorting sets
`aria-sort` on the header with a Button inside. The selection tile marks rows with
`data-selected` (a paint hook) and the row Checkbox carries the accessible state; `aria-selected`
still paints for grid and treegrid rows. Notion's cells are `role=button` inside a custom grid.

## Peers and consistency

| Peer | Shared role | Peer value | Table | Match / reason |
|---|---|---|---|---|
| Menu, Nav, Tree view, Select | hover / selected plates | `bg-component-hover` / `-active` | same | match |
| Panel | container edge, radius | 1px `border-decorative`; `radius-container` 12 | `border-divider`, 12, no shadow | edge differs: Panel's lift carries its seam; a table has none |
| Card | container edge | 1px `border-divider` #e2 | same | match (third pass): both stand alone on the page |
| Separator, Menu, Nav | rule | 1px `border-divider` | same | match |
| Menu, Nav | row height at md | 32 | 37 | a data row carries 8px block insets and a divider, not a control height (Notion 36) |

## Visual pass

2026-09-28 (batch 16, Claude in Chrome): Notion's table view ("returns", read-only): rows 36.6,
0.56px rules at 7% warm (row and column), header 14/21 muted with no fill, cells without
padding of their own. Area's md row is 36 with 12 inline insets, a framed wrapper, a
`bg-subtle` header and horizontal rules only: the three differences settled in the third pass
(frame, inset, hover) stand. Selected row under the pointer: the hover rule excludes selected
rows (`.area-table--interactive tbody tr:not([data-selected], [aria-selected="true"]):hover`),
so the #ee selection plate stays; checked in the gallery's selection tile by rule and computed
paint, not with a real pointer (the preview pane was hidden). Unverified: dark theme.

## Verification

Compared the four Notion table captures with 10 Area captures (`table/area--*`, re-taken
after the second pass) and Untitled UI source values. Build and test results are in
[the audit](../research/cohesion-audit.md#verification). Hover and selection paints were
read from the CSS; no Area capture shows them.

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
