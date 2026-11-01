# Feed rhythm: settings, tables and chat (2026-10-31)

The owner asked (2026-10-31): "look at this ui and see how the text is spaced, inset, the rhythm is spacious and
intentional, and there is a good optical balance for all elements. maybe need to look at redesigning the table component
to be better spaced/balanced. research and see how these feed designs can be improved. i want this to also consider the
chat experience and be intentional about how this type of ui can benefit from a similar structure thats altered slightly
for chat vs feed", then "also look at claude code too". Research and proposal only; nothing is built. The review page
holds the decisions (collection `verdicts`): see the session's report for its link.

## Sources and how each was read

| Id | What | How it was read | Confidence |
|---|---|---|---|
| cursor-app | Cursor's in-app Settings (the same pattern as cursor.com/dashboard/settings) | `/Applications/Cursor.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.css`, `.cursor-settings-*` rules (Cursor 3.23 bundle, read-only) | exact (CSS) |
| cursor-web | cursor.com/dashboard/settings | Signed out in the built-in browser, so not measured; structure only from the owner's screenshot (no lengths read off it) | structure only |
| primer | Primer's Button props table, https://primer.style/product/components/button/#props | Built-in browser, `getComputedStyle` + `getBoundingClientRect`, 1024 wide, DPR 2 | exact (live) |
| claude-settings | Claude desktop's Settings rows (Classify session states, Code font size) | `/Applications/Claude.app/Contents/Resources/ion-dist.asar` (Claude 4.4212), row component `Ke`/`gs` class lists; `cds` token values from `docs/research/claude-code-ui-audit-2026-10-31.md` (same bundle) | classes exact; which density the dialog runs is unconfirmed, so both are given |
| claude-transcript | Claude Code's transcript | same bundle: `Q3` gap constants, `H8` transcript widths, chat text sizes | exact (JS constants) |
| claude-artifacts | Claude's Artifacts gallery | same bundle, chunk `c230724a2` classes | classes exact; the page may also be served from claude.ai, unconfirmed |
| claude-customize | Claude's Customize page | not found with confidence in the bundle (its strings live in claude.ai's web code); structure only from the owner's screenshot | structure only |
| area | Area at type 13, Compact (the app's default) | `apps/desktop` built from this worktree (origin/main 00ad4456), measured over CDP; CSS read from source | exact |

## 1. Measured values

### Cursor, in-app Settings (CSS)

| Part | Value |
|---|---|
| page | 48 above and below; pane 48 from the nav (24 compact) |
| page title | 17/21 500 primary; its description 13/18 secondary, 4 under it |
| title → first section | 20 |
| section → section | 28 |
| section header | title 12/16 secondary, description 12/16 tertiary, 2 apart; header inset 8 at the start, 4 at the end |
| header → group | 8 |
| group | fill 4% of the text colour (`--cursor-bg-quinary`), radius 12, **no border**, no gap between rows |
| row (cell) | padding 12 block, 14 inline; label 13/18 400 primary; description 13/18 400 secondary, **1** under the label |
| text → control | 20; controls 8 apart, centred on the row; a switch sits in an 18-tall box (one line) |
| rule | 1px, 4% of the text colour, **inset 12 from both sides of the group**, drawn at the top of every row but the first |
| row heights | 42 (one line), 61 (label + one-line description) |
| narrow (< 500 pane) | the control drops under the text, 12 apart |
| nav cells | 12/16, padding 4/6, radius 6, 1 apart |

### Cursor, dashboard settings (structure only)

White framed groups on a grey page; group titles (Privacy, Profile) sit outside and above their group. Inside, a **label
column and a value column split the group in half**: every value (email, avatar, name fields, toggle) starts on one
vertical line. Rule between rows, inset from the group's sides. A long description runs the full width under the label
(Share Data, Public profile) with its control at the end.

### Primer, props table (live)

| Part | Value |
|---|---|
| frame | 1px #d1d9e0 on every cell edge, radius 6 (corner cells), white |
| type | 16/26.67 (Mona Sans); header 600 #59636e on #f6f8fa |
| header | 44.66 tall (8 + 26.67 + 8 + 2 rules), middle |
| cells | 8 block; **16 at the frame edge, 12 between columns** (so 24 between neighbouring texts) |
| one-line row | 43.66 |
| columns | Name 198 / Default 109 / Description 421 of 728: **27% / 15% / 58%**, the same on every row |
| alignment | Name and Default cells top; the Description cell stacks the type (13.6 mono chip, #f6f8fa, radius 8) over the prose (16/26.67), about 10 apart; both first lines share one line |
| heading → table | h3 bottom → table top 16; h2 (28/37.8, with an 8 rule under it) → h3 40 |

### Claude desktop, Settings rows (bundle classes)

| Part | Classes | Compact | Comfortable |
|---|---|---|---|
| row | `flex items-center justify-between gap-lg py-md` | 8 above and below, 20 text → control | 12, 28 |
| text | `flex-col justify-center gap-1`: title `text-body text-primary`, description `text-body text-muted-as-secondary` | 4 apart, both 13/19 | 4 apart, 14–15 |
| control | `flex shrink-0 items-center`, centred on the row | | |
| group | `flex flex-col pt-md`, its title `text-body font-medium text-primary` | 8 above | 12 above |
| frame | none: rows sit on the dialog, hairlines between them (owner's screenshot) | | |

### Claude Code, transcript (bundle constants)

| Part | Compact | Comfortable |
|---|---|---|
| item gap (blocks of one reply) | 16 | 20 |
| reply gap (prompt → its reply) | 6 | 8 |
| turn gap (one exchange → the next) | 20 | 24 |
| line | 20 | 24 |
| actions row | 30 | 40 |
| column width (Narrow default / Medium / Wide) | 768 / 960 / 1280 | |
| chat text (Small / Medium default / Large) | 14/20, 15/21, 16/22 | |

### Claude, Artifacts gallery (bundle classes)

Grid `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6` (three across, 24 apart), page `pb-12` (48), cards
`rounded-card shadow-card-ring` (a ring shadow, no border), card foot `px-md py-md gap-sm` (icon, title, "Opened 4m ago"
meta). Page titles use the serif `font-voice text-title`.

### Area now (type 13, Compact)

See the review page's "Area now" table; the values were measured in the built app (`.area-table`, `.studio-settings`,
`.area-description-list`, `.area-message`).

## 2. What the references share

1. **One label column per page.** Every value in a group starts on one line, and that line is the same in every group
   on the page: Cursor's dashboard splits each group in half; Primer fixes its columns as proportions (27 / 15 / 58).
   A column sized by its content moves from table to table.
2. **Hierarchy by ink, not size.** Cursor sets label, description, section title and nav at 12–13; only the page title
   is larger (17). Claude's rows are all `text-body`. Section titles are quieter than the rows they name (Cursor 12
   secondary).
3. **Steps grow outward, about ×3.** Title → its group 8 (Cursor) / 16 (Primer); group → group 28 / 40. Label →
   description 1–4.
4. **The row is the unit of rhythm.** 42 for one line at 13/18 (Cursor: 12 above and below), 61 with a description;
   Primer 44 on 16px type. Rows are never shorter than a 24 control plus 9 a side.
5. **Outer inset > inner gap.** Primer 16 at the frame, 12 between columns; Cursor 14 at the side, rules inset 12.
6. **Two kinds of frame.** A settings group is a plate (a 4% tint, no stroke, Cursor) or nothing (Claude); a data table
   is a stroked frame with a tinted header (Primer). Rules inside a plate stop short of its sides; rules in a data
   table meet the frame.
7. **Two-line rows centre their control.** Title over description, the control centred on the pair (Cursor, Claude).
   Data cells align on their first line (Primer).
8. **Chat is the same feed, tighter.** Claude's turn gap (20 / 24) is a section step, its reply gap (6 / 8) a heading
   step, its item gap (16 / 20) a block step, in a centred column the width of a settings page (768).

## Area now (measured 2026-10-31, main 00ad4456, type 13, Default density, light)

| Part | Value |
|---|---|
| Table (Components › Table, API tab) | cells 7 block / 10 side, symmetric; text 13/18; header 32.5, rows 33 (51 with a wrapped description); frame 1px 12.5% ink, radius 14; rules 7.5% ink to the frame; header ground follows Layer contrast (flat: none) |
| Table columns | sized by content: the API tab's first columns are 84 (Import), 200 (Props), 116 (Variant classes), 145 (Private properties) on one page |
| Feed (layout audit) | heading → table 12 (to text), title → lede joined, sections 40, canvas margin 16 |
| Settings (Appearance) | column 768, padding 24 / 48; title 19/26 500; title → first group 32; groups 32 apart; heading → group 12; group 1px edge, radius 16; rows 12 / 16, label and description joined (13/18), one-line 42, two-line 60; text → control 16; control column 272; rules to the frame |
| Chat (CSS) | Message 15/24 prose; exchange 24, reply 12, blocks 16; a stamp joins its message at 8; panel 320–560 |

## Proposal (decisions on the review page, collection `verdicts`)

1. Table rows: the block inset steps up 4 (sm 8, md 12, lg 16 before density): rows 33 → 41 in the app (Cursor 42, Primer 44).
2. Outer cells: side inset + 4 at the frame (Primer 16 / 12).
3. One label column per feed: Table `layout="fixed"` with native `<col>` widths; the app's section tables set 27% (Primer's Name).
   Alternative: two-column fact tables become a framed Description list.
4. Settings rules stop at the text edge (16), as Cursor (12) and Description list justified.
5. One 768 reading column for settings, document feeds and a Canvas chat (Area Settings = Claude Narrow = 768).
6. Chat keeps 12 prompt → reply (= the feed's heading step); exchange 24 and blocks 16 unchanged.
7. Table header ground stays on Layer contrast.

The after images were made by injecting the proposed CSS into the running window over CDP; no source changed.

## Built (2026-10-31, owner's picks: d1 a, d2 yes, d3 b, d4 yes, d5 yes, d6 keep, d7 keep)

- Table: `--_cell-edge` (side + 4) on the first and last cells at md and lg; sm keeps one inset (owner's question: dense
  tables in panels, e.g. the Inspector chat's markdown tables at `size="sm"`). Measured in the app (type 13, Default):
  sm 3 / 10 / 10, md 7 / 14 at the frame / 10 between columns, lg 10 / 14 / 10. Rows unchanged (pick d1 a).
- Table `layout: auto | fixed`: fixed gives the first column 27%; a fit cell in the last column takes the rest instead.
  The app's Documentation, API and Spec tables use it (Best practices stays auto): every label column 261 at a 967 table.
- Settings rules stop 16 in from each side; `--_reading-column` (768) names Settings' measure.
- Docs: PRODUCT_UI.md (label column, reading column, one feed altered for chat), area-ui-compose spacing.md, table spec,
  Table's Documentation entry, gallery tile "Layout / fixed".
