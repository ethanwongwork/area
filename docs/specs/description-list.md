# Description list spec

**Captures:** `docs/research/captures/description-list/`
**Peers:** Table (frame, row rules), PropertyList (Figma's inspector rows; a different job), Card, Menu rows (icon to text), Badge, Avatar and Link (values)

## Owner decisions

- 2026-10-10: "go with your recommendations, keep building" after Toggle group → Description list. Editable inline text
  came first on the gap list but needs its edit mode captured in the products, which is unsafe while Chrome's window is
  hidden; it waits for a session with the window in front.
- 2026-10-30 (Inspector panel study, docs/research/inspector-panel-2026-10-30, picks "One Inspector grid: Build" and
  "Fact rows: packed, 26"): in a Panel the columns layout takes the panel's label column and packs its rows.

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
| variant | `plain` (default) · `surface` | `surface`: the list stands alone in Table's frame (the one frame prop, plan B1.1; `framed` stays as a deprecated alias) | ChatGPT's settings card |
| content | icon on the term; any value (text, Badge, person, Link) | Notion's property icons; rich values | Notion |
| composition | in a Panel (context, no prop) | One value column with the panel's Fields | Claude's and Cursor's key/value rows; Area's Inspector |

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
area  dl.area-description-list.area-description-list--{columns,justified}[.--divided][.--surface]
        div.__item (row)
          dt.__term (span.__icon[aria-hidden] + span.__label)
          dd.__value
```

Insets, columns: term column 160 (padding 6, icon 16, 6 to the name: name at 28); value text at 160 + 8 + 6 = 174
(Notion: cell 4 after the column, plate 4 in, text 6 in); rows 34, 4 apart. Justified: row padding 12 / 16, 24 between
term and value; rules inset 16. In its frame, the text sits 12 from the frame's outer edge, the edge counted once, the agent chat's
card column; framed columns keep ChatGPT's 12 from the top.

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
| columns · term column | fits the longest term up to 40% (`--area-description-list-term`), no inset, muted 14/20 (the UI type), 16 icon 6 before the name | Infobox's fit-content column (removed); round 73 | Notion's 160 column and 6 cell inset served editable cells with hover plates; Area's list is read-only facts |
| columns · row alignment | the term on the value's first line, by baseline; the term's baseline is its label's (`__label`), never its icon's | DESIGN_SYSTEM.md, Optical insets (first-line alignment) | round 82: the rows aligned to the top, so a person value (a 26 avatar beside the name) left the term 4 above the name |
| columns · value | 12 after the term column (gap row; compact 8), default ink, all values in one column | Area's gap row; Infobox's 12 | was Notion's 174 |
| columns · row | as tall as its text, 8 apart (ui-cluster; compact 6); divided 16 with the rule in the middle | Area's set spacing (items 8 apart) | was Notion's 34 rows 4 apart (owner, round 73: "why is the gaps between lines so large") |
| columns · in a Panel | the term column is the panel's label column (`--_panel-label`, 40% of the row less the cluster gap: 95 in a 272 panel), the value the cluster gap after it, where a Field's control starts; rows a small control tall (`control-sm`, text 4 above and below in compact) and touching; tabular numbers; terms wrap between words; a framed list keeps its fitted column | Claude Code's key/value rows (min 26, no gap, value column fixed), Cursor's tray (28, 1 apart, tabular values); owner pick "packed, 26" | The fitted column put values at 95, 104 and 123 in one Inspector, beside controls at 116 |
| justified · row | padding 12 / 16 (framed: 12 / 12 inside the frame, the card column), 24 between, term 14/20 500 default ink, value at the end 14/20 | ChatGPT | ChatGPT's values mix 14/20 and 16/24; Area keeps the UI type. Framed, the side is the agent chat's card column (owner 2026-10-28, chat set review: "move them to 13 anyway"; it was ChatGPT's 16) |
| divided · rule | 1px `border-divider`, inset by the row's side padding | ChatGPT (inset 16); peer Table's row rule | — |
| framed · frame | Table's frame: `border-divider`, `radius-container`, `bg-surface` | Peer Table | ChatGPT's corner 16 and rgb(252) fill; Area's standalone data frame is Table's |
| semantics | `dl` > `div` > `dt` + `dd` | HTML; Ant, Chakra | — |

- The term's and More row's icon gaps are `gap-md` (6, Compact 4, Comfortable 8 at type 13); the justified layout's side inset and its More row's twin are `2 × ui-cluster` (16, Compact 12, Comfortable 20).

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

Resolved 2026-10-12 (owner, review round 21: "go with your recs"): both recommendations taken, no change.

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

## Show more, 2026-10-12

Owner: "use Design-system evidence: build it from Ant Design, Polaris, Primer and similar collapse patterns" (the inspector
plan's Description list "show more"; Figma Dev Mode's List view sits behind its upgrade dialog, and Notion's "N more
properties" appears only on databases with hide-when-empty properties, which would change the owner's data). Survey:
`docs/research/show-more-survey.md` (Ant Design, Polaris, Primer, Mantine, Carbon, Radix, React Aria, Chakra from source).

| Slot · property | Area | Basis |
|---|---|---|
| API | `visibleCount`; `expanded` / `defaultExpanded` / `onExpandedChange`; `moreLabel` (text or a function of the hidden count) / `lessLabel` | Badge group's `visibleCount`; Mantine's expanded triplet |
| label | "Show {n} more" / "Show less" | Primer LabelGroup ("Show +N more" / "Show less"), Polaris "Show more" / "Show less"; the count as Notion's "N more properties" |
| element and ARIA | a native `button` after the `dl` (a `dl` holds only term groups), `aria-expanded`, `aria-controls` → the `dl` | Polaris, Mantine, Carbon, Radix, React Aria |
| hidden rows | stay in the document with `hidden`, so order holds and a revealed row is the same node | Primer LabelGroup keeps them; Polaris unmounts |
| focus | stays on the button both ways (the rows are text, nothing to move to) | Carbon; Primer moves focus only to a focusable revealed child |
| row | a list row: 34 tall (compact 26), 4 below the last row (justified: the row's own 44, no gap) | the list's rhythm |
| chevron | 16, in the term's icon slot, so the label starts where the term names do (28 in); points down, turns 180° when open on `duration-fast` | Carbon and Chakra rotate; Primer guidance: down closed, up open |
| ink and type | `fg-muted`, the UI size, 400; an underline on hover, the ink fixed | Code block's toggle; Polaris plain button (underline on hover) |
| motion | rows appear and go at once (no height animation) | Polaris and Carbon animate height; Area's Accordion recipe could be added later |

Checked in the gallery with a hydrated demo: "Show 3 more" → "Show less", `aria-expanded` true, 0 rows hidden, the
chevron at 180°, focus on the button; back again. Not checked: dark, compact, a screen reader. Framed lists put the
button below the frame (the `dl` carries the frame).

## Review note, 2026-10-12 (show more)

- **What changed:** a description list can show only its first rows, with a "Show 3 more" button after them that reveals
  the rest and turns into "Show less".
- **Why:** you asked for the inspector's "show more", built from design systems: it follows Polaris and Primer's show
  more / show less buttons and lines up with the term names like Notion's "N more properties".

## Interaction polish, 2026-10-16

"Show more" is not selectable; its hover underline takes Link's offset (0.25em). See [interaction polish](../research/interaction-polish-2026-10-16.md).

## Review note, 2026-10-17 (round 33)

- **What changed:** Only the underline on the "Show more" link: it now sits close under the words, about 1px below the letters,
  instead of 0.25em down. Tails of g, y and p cross it and the line breaks around them. Nothing else changed.
- **Why:** It follows Link, which you asked to underline "very natural and close to the text" (link.md, "Close
  underline").

## Feedback log

- 2026-10-10 · owner: "go with your recommendations, keep building" → Description list from Notion's page properties
  and ChatGPT's account card; 9 captures, 6 gallery tiles, in review.
- 2026-10-10 · owner, review round 5: approved → Complete in `component-status.mjs`.
- 2026-10-12 · owner: build "show more" from design-system evidence → `visibleCount` and the Show more button (above). In review.
- 2026-10-12 · consistency pass (owner: "a consistency and cohesion pass on all the components ... stroke values and how they are used") → the divided rules and the framed edge are at `stroke-width`, Table's (were `border-width`) (description-list.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, review round 21 (components21): approved with the open questions' recommendations ("go with your recs"), no change → Complete in `component-status.mjs`.

- 2026-10-28 · chat set review (https://claude.ai/artifact/3ZRgoiUPiX6kkQxgt1MJTw): in Theme setup the framed answers' text
  sat at 16 beside the progress Plan (17) and the question card (15); owner: "move them to 13 anyway" → framed, the
  text is 12 inside the frame (13 from the outer edge), the card column of Plan, Edit summary and Queue. In review.

Since 2026-10-17 the underline offset is Link's 0.08em, close under the text (link.md, "Close underline").

## Spacing audit (2026-10-17)

Framed insets: the frame's stroke is counted once, so text and rules sit 16 from the frame's outer edge, ChatGPT's measured 16 (capture-compare measures from the shell's border box); both layouts sat 17. Measured in `docs/research/spacing-2026-10-17/` (Before / After: https://claude.ai/artifact/JtDZ9LNfutFyfdkGUvQzL2).

## Review note, 2026-10-26

- **What changed:** the columns layout's spacing. Rows are as tall as their text and 8 apart (6 at compact; 16 when
  divided), labels and values start on the list's edge (no 6 inset), and the label column fits the longest label (up
  to 40%) with every value 12 after it. A framed columns list keeps ChatGPT's card inset (12 / 16). A new tile,
  "Composition / summary": a Card whose header carries the subject and whose body is a Description list (Infobox's
  job; Infobox is removed), its header and list inside CardContent so its text sits 16 from the card's edge (it sat
  at 8 straight in the card; owner: "the padding on this card is too small"). The default tile's person and dashed
  circle icons were redrawn for optical balance (icons.md, "Optical pass, 2026-10-26"). The justified layout is unchanged.
- **Why:** you kept the component but asked why the padding was so small, why the gaps between lines were so large,
  and what the gap between labels and values was. All three were Notion's editable properties copied exactly: 34-tall
  cells 4 apart, the text 6 inside a hover plate Area never draws, and a fixed 160 label column (about 130 of empty
  space after "Label"). Area's list shows facts, so it now takes Area's set spacing.

## Review note, 2026-10-28 (chat set review)

- **What changed:** A framed list's text now starts 13 from the frame's outer edge, on both layouts (it was ChatGPT's 16).
  Its rules inset with it. Framed columns keep 12 from the top.
- **Why:** Beside the agent chat's boxes, Plan, Edit summary and Queue at 13, the framed list started 3px further in;
  Theme setup stacks them. You chose one card column, "move them to 13 anyway". Every framed list in the app moves.

## Review note, 2026-10-28 (round 82)

- **What changed:** in the columns layout a term sits on its value's first line, by baseline: beside a person (an
  avatar with the name) the term and its icon are level with the name, 4 lower than before. Rows of plain text,
  badges and links don't move. The term's text is now its own part, `__label`, so the baseline is the text's, not the
  icon's.
- **Why:** the rows aligned their cells to the top, so a value taller than a line (the avatar is 26) pulled its text
  below the term. The system rule is that content aligns to the first line.
- **Verdict:** approved (owner, 2026-10-29, review page round 82); Complete.

## Review note, 2026-10-30 (Inspector grid)

- **What changed:** inside a Panel, a columns list puts its values where the panel's Fields put their controls (116 in
  the app's 272 Inspector) and its rows are 26 tall with no gap, numbers tabular. Outside a Panel, and framed, nothing
  changes. New tile: Composition / in panel. The app's Inspector facts are this list now (they were a framed Table).
- **Why:** you picked "One Inspector grid" and "packed, 26" on the Inspector panel study
  (https://claude.ai/artifact/WmGzS6vuoRKesKcRuhp6hj): values started in four places in one Inspector.
- **Verdict:** in review.

### 2026-11-07 · The event in onExpandedChange (components audit O3)

- **What changed:** `onExpandedChange(expanded, event)` passes the Show more press.
- **Why:** DescriptionList.tsx:25. From the components audit's internal peer comparison (`docs/research/components-audit-2026-11-07/internal.md`); the owner took every recommendation ("Take all recs", 2026-11-07).
- **Verdict:** awaiting the owner.
- 2026-11-11 · system evaluation A2.2 · "Show N more" is a list row: radius-row, 6 → 8 at the default. description-list.css.
- 2026-11-11 · system evaluation A1.1, A8.2 · property rows are the UI row (30 at the default, 28 Compact; were the row + 2) and 4 apart (was 2; Compact 0), so the default's 34 pitch holds and Compact's is 28 (was 30); the columns layout's value starts `gap-row` after the term (12, was 10); "Show N more" is a row tall and one row gap below.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** a justified term keeps the term's muted 400, as every layout's (plan A9.13, findings T24, VC26): layout moves a label, not its role; it was 500 in the default ink. The "more" link's underline reads `underline-offset` (plan A9.10).
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

### 2026-11-13 · One frame prop (system plan, Phase 2, B1.1)

- `framed` became `variant="surface"` (plain by default), the one frame prop; `framed` stays as a deprecated alias.
- In its frame the text is 12 from the outer edge with the edge counted once (was 13), the chat card's column.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- The justified layout's row padding is `gap-row` (8 / 12 / 16) and its term-to-value gap `gap-section` (16 / 24 / 32). Values at type 13 Compact / Default / Comfortable; unchanged at the default. The cell's text inset 6 and the value cell's offset 8 hold at every density (row geometry beside a fixed term column). Listed, not moved: the term's icon gap 6 (twice) and the justified inset 16 (inset-surface-md is 14 at the default).
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.

## System status step C, 2026-11-18 (shared sources)

The four density holdouts took roles equal at the default and the family left the density waiting list. Nothing moved at type 13 / 32.
