# Description list spec

**Status:** complete · 2026-10-10 (approved, review round 5)
**Captures:** `docs/research/captures/description-list/`
**Peers:** Table (frame, row rules), PropertyList (Figma's inspector rows; a different job), Card, Menu rows (icon to text), Badge, Avatar and Link (values)

## Owner decisions

- 2026-10-10: "go with your recommendations, keep building" after Toggle group → Description list. Editable inline text
  came first on the gap list but needs its edit mode captured in the products, which is unsafe while Chrome's window is
  hidden; it waits for a session with the window in front.

## Job and boundaries

A description list shows labelled values: a term and its value per row (a page's properties, an account's facts, a
file's details). It is a native `<dl>`. Not a PropertyList (Figma's fill and effect rows with controls), not a Table
(records with shared columns), not a form (values are shown, not edited; an editable property is a field in the value).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| layout | columns (default) | Terms in a fixed column, values after them | Notion page properties |
| layout | justified | Term at the start, value at the end | ChatGPT Settings › Account |
| divided | boolean | A rule between rows | ChatGPT's settings card |
| framed | boolean | The list stands alone in a frame | ChatGPT's settings card |
| content | icon on the term; any value (text, Badge, person, Link) | Notion's property icons; rich values | Notion |

Excluded: a stacked layout (term above value: Chakra DataList vertical, Spectrum LabeledValue; no product shows it), Ant
Descriptions' multi-column grid and bordered table look, Notion's hover plates and click-to-edit (static here).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product (primary for content) | A database page's properties: Status, Assign, Date, Description, Link | app.notion.com, a "tasks" page, 2026-10-10, read-only (opened by its link; no clicks in the page) | evidence only | `notion--row`, `notion--list` |
| chatgpt | target product | Settings › Account card: Status, Name, Username, Email, Age | chatgpt.com/settings/account, 2026-10-10, read-only (no field or button touched) | evidence only | `chatgpt--card` |
| ant, chakra, mantine, spectrum | design systems | Descriptions; DataList; Spectrum LabeledValue | catalogue entries in `research/component-gap-audit.md` (Untitled UI, shadcn and Primer ship none) | — | not rendered |
| area | this system | Every gallery tile at 1:1 | localhost gallery | — | `area--*` (6) |

Notion was at 90% zoom (dpr 1.8; CSS lengths recorded in CSS pixels); both product captures are redacted and checked
for names and email. Also seen on the way, recorded for Editable text: Notion's Library rename is a floating 392 × 38
surface (corner 6, white, the popover shadow with a 1px ring) over the cell, padding 8 / 9, text 14/21 500; Escape left
the name unchanged.

## Anatomy

```
area  dl.area-description-list.area-description-list--{columns,justified}[.--divided][.--framed]
        div.__item (row)
          dt.__term (span.__icon[aria-hidden] + text)
          dd.__value
```

Insets, columns: term column 160 (padding 6, icon 16, 6 to the name: name at 28); value text at 160 + 8 + 6 = 174
(Notion: cell 4 after the column, plate 4 in, text 6 in); rows 34, 4 apart. Justified: row padding 12 / 16, 24 between
term and value; rules inset 16. Framed columns: frame padding 5 / 10 so text sits 12 / 16 from the frame, as ChatGPT's.

## Measurements

`node scripts/capture-compare.mjs` on `notion--row` with `area--default`, and `chatgpt--card` with `area--variant-framed`:

| slot · property | notion · row | area · default | chatgpt · card | area · framed |
|---|---|---|---|---|
| **row** height / padding | 34 / 0 | 34 (4 apart) / 0 | 44–62 / 12 16 | 44 / 12 16 |
| **term** column / padding | 160 / 0 6 | 160 / 0 6 | auto / 0 | auto / 0 |
| **term** font / ink | 14/20 400 rgb(125,122,117) | 14/20 400 rgb(102) (`fg-muted`) | 14/20 500 rgb(13) | 14/20 500 rgb(40) |
| **icon** size / ink | 16 / rgb(142,139,134) | 16 / `fg-muted` | — | — |
| **value** text start | 174 | 174 | end-aligned | end-aligned |
| **value** font | 14/20 (empty: rgb(161,158,153)) | 14/20 default ink | 16/24 or 14/20 | 14/20 |
| **frame** | — | — | 1px rgba(0,0,0,.1), corner 16, rgb(252) | 1px `border-divider`, `radius-container` (12), `bg-surface` |
| **rule** | — | — | 1px rgba(0,0,0,.1), inset 16 | 1px `border-divider`, inset 16 |

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| columns · term column | 160, padding 6, muted 14/20 (the UI type), 16 icon 6 before the name | Notion | Notion draws its 16 icon in an 18 box (name at 30); Area keeps square 16 icon boxes (inset.css), name at 28 |
| columns · value | text at 174, default ink | Notion | — |
| columns · row | 34 = the UI row + 2 (26 compact), 4 apart = 2 × the row gap (0 compact) | Notion 34 / 4 | Compact steps with the UI row tokens |
| justified · row | padding 12 / 16, 24 between, term 14/20 500 default ink, value at the end 14/20 | ChatGPT | ChatGPT's values mix 14/20 and 16/24; Area keeps the UI type |
| divided · rule | 1px `border-divider`, inset by the row's side padding | ChatGPT (inset 16); peer Table's row rule | — |
| framed · frame | Table's frame: `border-divider`, `radius-container`, `bg-surface` | Peer Table | ChatGPT's corner 16 and rgb(252) fill; Area's standalone data frame is Table's |
| semantics | `dl` > `div` > `dt` + `dd` | HTML; Ant, Chakra | — |

## States

None of its own. Values can carry interactive components (Link, Button), which keep their own states.

## Behavior and accessibility

A native description list: assistive tech announces the list and pairs each term with its value. The icon is decorative.
Long terms and values wrap (`overflow-wrap: anywhere`); a term wraps inside its column.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match |
|---|---|---|---|---|
| Table | standalone frame, row rule | `border-divider` frame and rules, container corner | the same | match (harness, light, dark, compact) |
| PropertyList | label and value rows | Figma's inspector rows with controls | static term / value pairs | separate jobs |
| Menu | icon to text | 16 icon, 12 to the label (`gap-row`, a 36 label column) | 16 icon, 6 to the term (Notion's properties) | differs on purpose: a term column is quieter than a menu row, and Notion sets its property icons 6 from the name |

## Visual pass

Harness at 1:1 (server-rendered specimens with `dist/area.css`), light default, dark default and light compact, beside a
Table: the framed list and the Table share their edge, corner and rule; columns reads as Notion's properties (muted
terms, default values); the rich tile's Badge, Avatar and Link sit on the row's centre line. Changed during the pass: the
value started at 170 (4 after the column); Notion's text starts at 174 (cell 4 after, plate 4 in), so the value moved 4.

## Verification

- 9 captures (3 product, 6 Area); checksums verified; product captures checked for names and email.
- Build (parity, token references), typecheck, React tests (`description-list.test.mjs`, 2), `build:docs`.
- Unverified: dark in the products, a screen reader, very long terms in compact.

## Open questions

1. Framed takes Table's corner (12) and white surface, where ChatGPT's card is 16 and off-white. Recommendation: keep
   Table's, so data frames match across the system.
2. A stacked layout (term above value) has design-system precedent but no product use. Recommendation: leave it out
   until a product shows it.

## Review note, 2026-10-10

- **What changed:** New component. Description list shows labelled values, a term and its value per row: in columns
  like Notion's page properties, or with the value at the row's end like ChatGPT's account settings, with optional
  rules and a frame.
- **Why:** It was next on the gap list. Columns copies Notion's property rows (34 tall, a 160 term column); justified
  and framed copy ChatGPT's settings card, framed the way Area's tables are.

## Feedback log

- 2026-10-10 · owner: "go with your recommendations, keep building" → Description list from Notion's page properties
  and ChatGPT's account card; 9 captures, 6 gallery tiles, in review.
- 2026-10-10 · owner, review round 5: approved → Complete in `component-status.mjs`.
