# Notion against Area (2026-11-07)

Research only; nothing in Area changed. Read against [area-inventory.md](area-inventory.md),
`docs/COMPONENTS.md` › Candidates, [component-gap-audit.md](../component-gap-audit.md) and
[product-ui-gaps-2026-10-12.md](../product-ui-gaps-2026-10-12.md).

## Method and limits

- **Source.** Claude in Chrome, one new tab, **not signed in to Notion** (notion.so redirected to
  the marketing site). Every measurement is `getComputedStyle` / `getBoundingClientRect` read on
  Notion's own public template pages (`*.notion.site`, the real Notion web app in read-only mode),
  at a 1504 × 719 CSS-px viewport, devicePixelRatio 2, light theme. Dark values are read from
  Notion's own stylesheet (`.notion-dark-theme` custom properties on the same pages).
- **Interactions used** (all local to an anonymous viewer, nothing saved): view tabs, hover, side
  peek open/close, the peek-mode menu (opened, Escape), a temporary view filter (added, then
  Reset), the timeline's jump-to-item arrow, the public site's sidebar and search.
- **Not observed** (they need edit rights in a signed-in workspace): slash menu, block action
  (⋮⋮) menu, emoji / icon picker, cover picker, date-picker popover, comments, @-mentions,
  property editors, AI menus, synced / equation / bookmark / embed / file blocks. Where a row
  rests on Notion's Help Center instead of a measurement, it says so. No values below are
  recalled; anything unmeasured is marked "Help Center" and carries no numbers.
- Pages (cited by short name below):
  - **OKR** https://notion.notion.site/OKR-Tracker-5a266e549d0c4ba0bb11aeb145c08ec1 — grouped table, bar + donut chart views, callout, side peek, filter.
  - **Calendar** https://notion.notion.site/6ae494b3d1dc4a66ae591d672c111a7d — calendar view.
  - **Projects** https://notion.notion.site/27eefdeead058176ac9bf3a79ea5fc5f — status property, timeline view, board view.
  - **Company** https://notion.notion.site/33b579d243b24bb39e4a15069f0d47b8 — page links, divider, collapsed view switcher.
  - **Todo** https://notion-templates.notion.site/Weekly-To-do-List-5bea1ec0dec94d1db1de25d039122e3d — button block, to-do, inline code, floating outline.
  - **Start** https://notion-templates.notion.site/Getting-Started-ade01a27e80a418ba830b76580f48c42 — TOC block, toggle, code block, sidebar tree, breadcrumb, search modal.
  - **Reading** https://notion.notion.site/77dd69d1250d4d48b3bfe6a74356d503 — URL property, multi-select colours.
  - **Content** https://notion-templates.notion.site/72630fc13d804b39b7de269b1ce5d455 — board with covers, empty filtered view.
  - **People** https://notion.notion.site/3180c11bed4c4505802f981c772c9162 — gallery, line chart.
- Notion's markup is now StyleX atomic classes; selectors below are Notion's stable
  `notion-*-block` classes or roles where they exist, otherwise "element at" a described spot.

## Notion's shared values (used in the tables)

| Value | Light | Dark | Where read |
|---|---|---|---|
| Text primary / secondary / tertiary / disabled | `#2c2c2b` / `#7d7a75` / `#a19e99` / `#bcbab6` | `#f0efed` / `#ada9a3` / `#7d7a75` / `#5f5e59` | `--c-texPri…texDis` on `:root` and `.notion-dark-theme`, OKR |
| Page / secondary / tertiary ground | `#fff` / `#f9f8f7` / `#f0efed` | `#191919` / `#202020` / `#383836` | `--c-bacPri/Sec/Ter`, OKR |
| Popover ground | `#fff` | `#252525` | `--c-popBac`, OKR |
| Rule (primary / secondary / strong) | `#e6e5e3` / `#f0efed` / `#d4d3cf` | `#383836` / `#2c2c2b` / `#5f5e59` | `--c-borPri/Sec/Str`, OKR |
| Hover plate (rows, menu items, tabs) | `rgba(33,27,23,0.05)` | — | `[role=menuitem]` hover, sidebar row, view tab, OKR / Start |
| Button hover / press | `#37352f0f` / `#37352f29` | `#ffffff0e` / `#ffffff08` | `--c-butHovBac`, `--c-butPreBac`, OKR |
| Table row hover | `#37352f06` | `#ffffff0e` | `--c-tabRowHovBac`, OKR |
| Content rule (divider, button edge, page-link underline) | `rgba(28,19,1,0.11)` | — | `.notion-divider-block` inner line, Company |
| Menu / outline panel shadow | `0 20px 24px rgba(25,25,25,.05), 0 5px 8px rgba(25,25,25,.027), 0 0 0 1px rgba(42,28,0,.07)` | — | peek-mode menu, Todo outline panel |
| Small floating shadow (hover bars, side peek) | `0 8px 12px rgba(25,25,25,.027), 0 2px 6px rgba(25,25,25,.027), 0 0 0 1px rgba(42,28,0,.07)` | — | row OPEN bar, code-block bar, `.notion-peek-renderer` panel |
| Card shadow (board, gallery) | `0 4px 12px rgba(25,25,25,.027), 0 1px 2px rgba(25,25,25,.02), 0 0 0 1px rgba(42,28,0,.07)` | — | board and gallery cards, Projects / People |
| Focus ring (buttons) | `box-shadow: 0 0 0 2px #f8f8f7, 0 0 0 4px #2383e2, 0 0 0 6px rgba(255,255,255,.25)` + `outline: 2px solid transparent` | — | peek-mode button after Escape, OKR |
| Focus ring (fields) | `inset 0 0 0 1px #2383e2, 0 0 0 1px #2383e2` | — | filter-menu search field, OKR |

## Missing variants on existing Area families

| Area family | Missing variant / state / slot | Evidence (page, element, measured values) |
|---|---|---|
| Tag | **`teal` colour** (an 11th hue; Notion's colour roles now run gra, bro, ora, yel, gre, blu, pur, pin, red, **tea**) | OKR stylesheet: `--c-tea*` roles, e.g. `--c-teaTexSec #2c8b9e`, `--c-teaBacSec #e0f3f7`, `--c-teaBacAccPri #37a4b4`; Area Tag colours stop at red (manifest `tag.variants.color`) |
| Tag | **`sm` size, 18 tall, 12px** for tags inside cards | People gallery card tag: 18h, 12px/14.4, pad 0 6, radius 4, bg `rgba(42,28,0,.07)`; the same tag in a table cell is 20h / 14px (Reading). Area Tag sizes: md 20, lg 24 |
| Tag | **Status shape: pill + leading dot**, separate from Select's square tag | Projects, Status cell: 20h, pad 0 9 0 7, radius 10, dot 8×8 radius 99 in the hue's accent (`#d8a32f` yellow), bg `rgba(209,156,0,.282)`, ink `rgb(101,81,33)`; Select in the same table: 20h, pad 0 6, radius 4 (`High` `rgba(206,24,0,.165)` / `rgb(109,53,49)`). Area Tag has no dot or shape axis (Badge has `dot` + `pill`, but is the display family) |
| Tag | Measured hue pairs for the Tag spec (light) | Reading / Projects / OKR table cells, bg / ink: default `rgba(42,28,0,.07)` / `#2c2c2b`; gray `rgba(28,19,1,.11)` / `rgb(73,72,70)`; brown `rgba(127,51,0,.157)` / `rgb(88,68,55)`; yellow `rgba(209,156,0,.282)` / `rgb(101,81,33)`; green `rgba(0,96,38,.157)` / `rgb(42,83,60)`; blue `rgba(0,118,217,.204)` / `rgb(38,74,114)`; purple `rgba(92,0,163,.14)` / `rgb(85,59,105)`; red `rgba(206,24,0,.165)` / `rgb(109,53,49)` (orange, pink, teal not on these pages) |
| Chip (kind filter) | **Valued filter chip**: "Property: value" label, chevron to its editor, accent tint when it has a value, an **unsaved dot** | OKR filter bar: empty chip 24h, pad 0 8, radius 32, gap 6, bg `rgba(33,27,23,.05)`, ink `#7d7a75`; with a value: bg `rgba(0,124,215,.094)`, ink `rgb(39,131,222)`, text "Status: On track"; unsaved dot 9×9 `rgb(213,128,59)` at the top-right corner |
| Chip / Toolbar | **Filter bar** row: chips, a ghost "+ Filter", and "Reset" at the end | OKR: "+ Filter" 24h ghost, ink `#a19e99`, 14px; "Reset" 28h, pad 0 8, radius 6, ink `#7d7a75`; row 40h, pad 8. Matches PRODUCT_UI rule 6 ("Reset only once changed") but no Area part draws it |
| Tabs | Pill plate, 32 tall (Area main has `selection="plate"` since PR #209; this worktree predates it) | OKR view tabs (`[role=tab]`): 32h, pad 6 12, radius 20, 14px/500; selected bg `rgba(33,27,23,.05)` ink `#2c2c2b`; others ink `#7d7a75`, no plate |
| Tabs | **Overflow into one dropdown pill** when a view set is collapsed ("Home ⌄") | Company: 32h, pad 6 10, radius 9999, bg `rgba(33,27,23,.05)`, 14px/500, chevron |
| Table | **Group header** with toggle, name and an aggregate | OKR: toggle 24×24 radius 4 (triangle 11.2); group name 14px/500 in a 26h link, pad 3, radius 6; aggregate "37.50%" 24h, pad 0 8, radius 6, ink `#a19e99`, 14px/500 |
| Table | **Aggregation footer** per group / column | OKR "COUNT 2": label 10px/500, uppercase, letter-spacing 1px, ink `#a19e99`; value 14px ink `#7d7a75`; cell pad 0 6, radius 6 (hover plate). Projects "COMPLETE 0/2" same style |
| Table | **Header cells with property-type icons**, 36h; body rows 36 + 1px rule; column rules | OKR `.notion-table-view-header-cell` 36h, 14px ink `#7d7a75`; row `.notion-collection-item` 37h; Reading cell pad 7.5 8, column rule `1px solid rgba(42,28,0,.07)` |
| Table | **Hover-revealed "Open" action** on the title cell | OKR row hover: floating bar 24h, pad 2, radius 6, white, small floating shadow; inner button 20h, pad 0 4, radius 4, 12px/500, ink `#7d7a75`, gap 6 (icon + "OPEN") |
| Table | **URL cell**: host in primary ink, path in tertiary with a middle ellipsis | Reading: `design.co` `#2c2c2b` + `/des…track/` `#a19e99`, 14px/21 |
| Table / Progress | **Number shown as bar**: a 4px pill track with its value text before it | OKR Progress cell: value "50%" then track 69×4, radius 1000, track `rgba(42,28,0,.07)`, fill `rgb(70,161,113)`; gap 8. Projects: fill `rgb(39,131,222)` 124×4. Area Progress default 6px, no value text slot (`ProgressProps.label` is the accessible name) |
| Board | (Covered) card ring and count follow the column colour, as Area's `board.css` already does; values for comparison | Content board, "In Progress" column: card ring `0 0 0 1px rgba(0,124,215,.094)` (the hue's `BacSecTra`); count "3" 14px `rgb(39,131,222)`, pad 0 6, radius 4 |
| Board | **Status-group icons** in column headers (dashed circle To-do, play In progress, check Complete) | Projects board: icon 20×20 before the label; header label 14px/500, ink by group (`#8e8b86` To-do, `rgb(39,131,222)` In progress) |
| Board | Measured geometry for the spec | Projects: column 276 wide, header 40h radius 10 10 0 0, body pad 0 8 8, radius 0 0 10 10, ground `rgba(66,35,3,.03)`; card 260 wide, radius 10, card shadow; title 16px; properties 12px/18 |
| Board / Card | **Cover image** on board and gallery cards | Content board card: cover 260×148, no radius of its own (clipped by card radius 10); People gallery: card 312 wide, cover 146.3h, grid gap 16 |
| Callout (Alert) | **Callout**: any icon (emoji) and any of the label colours on a neutral surface | OKR `.notion-callout-block` inner: pad 12, radius 10, bg `rgb(249,248,247)`, 1px transparent edge, icon 24×24 radius 4, text 16px/24. Already a candidate ("Notion parts › Callout"); Alert's tones don't cover colour-as-label |
| Accordion | **Toggle block**: a 24px triangle button before the text, no rule, no trailing chevron | Start `.notion-toggle-block`: 40h row; button 24×24 radius 4, `aria-expanded`, svg 12.8. Already a candidate ("Toggle block") |
| Table of contents | **Floating outline**: a dash minimap at the page edge that opens to a panel on hover | Todo: bars 16×2, radius 2, current `rgb(50,48,44)`, others lighter; on hover a panel 232 wide, pad 12 12 0, radius 14, menu shadow; items 13px/16.9, pad 4, current ink `rgb(39,131,222)`, others `#7d7a75`; nested indented |
| Table of contents | **In-page block** rows with 24px nesting | Start `.notion-table_of_contents-block`: link rows 30.2h, pad 6 2, 14px/18.2, ink `#7d7a75`; level 2 indented 24px |
| Drawer | **Side peek header**: close (Esc), open full page, peek-mode switch (Side / Center / Full page / New tab), previous / next record | OKR peek: panel 752 = 50% of the viewport, no radius, white, small floating shadow, page behind stays live (Area `modal={false}` exists); header buttons 24×24 radius 6, icon 20, ink `#8e8b86`; mode menu 220 wide, check on current |
| Description list / Property list | **Property rows**: icon + label column 160 wide, value column, hover plate on both | OKR peek: label cell 160×34, pad 0 6, radius 6, 14px ink `#7d7a75`, icon gap 6; value 14px/21. Already a candidate ("Notion parts › Property value") |
| Menu | Measured item and list values (Area Menu has the same parts) | OKR peek-mode menu: panel radius 10, list pad 4, gap 1; item 28h, pad 0 8, gap 8, radius 6, hover `rgba(33,27,23,.05)`, check 16 at the end; search field (filter menu) 28h, pad 3 6, radius 6, bg `rgba(66,35,3,.03)`, focus = field focus ring |
| Command palette | **Preview pane** beside results (toggle in the search bar) and a **path** after each result | Start search: modal 1006 wide, radius 20, bg `rgba(255,255,255,.9)` + `backdrop-filter: blur(40px)`, shadow `0 24px 48px rgba(25,25,25,.24), 0 4px 12px rgba(25,25,25,.14), 0 0 0 1px rgba(42,28,0,.07)`; result 36h, pad 4 8, **radius 12**; path 12px `#a19e99` after an em dash; "Current Page" badge 11px/500, pad 2 4, radius 4; preview toggle 32×32 circle, ink `rgb(39,131,222)` when on |
| Command palette | Footer hints with **icon keys** (no keycaps), 20 apart | Start search footer: 12px/18 ink `#a19e99`, key glyph svg 12, hint gap 6, between hints 20 |
| Tooltip | Shortcut on a **second line in muted text** (Area composes a Kbd; Notion uses plain text) | OKR peek close: bg `#2c2c2b`, 12px/16.8, pad 5 8, radius 6, shadow `0 4px 12px -2px rgba(0,0,0,.08), inset 0 0 0 1px rgba(255,255,255,.05)`; "Escape" ink `rgb(173,169,163)`. Area spec already records this as "notion--shortcut-stacked" evidence |
| Tree view / Nav | **Icon swaps to the disclosure chevron on row hover** | Start sidebar: row 30h, pad 4 8 4 13, radius 6, 14px ink `rgb(95,94,89)`; icon slot 20 (emoji 18); on hover a 12px chevron in a 20×20 radius 4 box replaces the icon; current row bg `rgba(33,27,23,.05)`, ink `#2c2c2b`. Area Tree view keeps chevron and icon in separate columns |
| Nav | **View rows as bullets** under a database page | Content sidebar: "•" 12px/500 ink `#7d7a75` in the icon slot, same 30h row |
| Breadcrumb | **Icon per crumb** and a plate on each | Start top bar: crumb 24h, pad 2 6, radius 6, emoji icon + 14px label; separator "/" svg 20 ink `#bcbab6` |
| Empty state | **Filtered-empty**: one bordered button ("Edit filters"), no title or icon | Content "Published" view: button 28h, pad 0 8, radius 6, `1px solid rgba(28,19,1,.11)`, 14px/500 ink `#8e8b86`, in a 144h region |
| Checkbox | **To-do**: checked text struck through at half ink | Todo `.notion-to_do-block`: box 16×16, radius 1.5 (checked fill `rgb(39,131,222)`); text `line-through` in `rgba(44,44,43,.5)`; text pad 2 0 2 6 |
| Button | **Outline button block** (an action placed in content) | Todo `.notion-button-block`: 32h, pad 8 12, radius 6, `1px solid rgba(28,19,1,.11)`, 14px/500, icon 20, gap 6 |
| Code | Inline code ink differs by page (red default, grey when coloured) | Start: 85% (13.6px), pad .2em .4em, radius 4, bg `rgba(33,27,23,.05)`, ink `rgb(207,81,72)`; Todo: same box, ink `#7d7a75` |
| Code block | **Hover bar** with language, copy, wrap, more; radius 10 | Start `.notion-code-block`: surface radius 10, bg `rgba(66,35,3,.03)`, text pad 12 0, SFMono stack; hover bar 28h, pad 2, radius 6, small floating shadow, language 12px `#8e8b86` |
| Link | **Page link**: icon + medium label with a hairline underline (a border, not text-decoration) | Company `.notion-page-block`: 35h block; label 16px/20.8 **500**, `border-bottom: 1px solid rgba(28,19,1,.11)` |
| Separator | Measured divider | Company `.notion-divider-block`: 13h block, pad 0 8, line 1px `rgba(28,19,1,.11)` |
| Calendar | Today marker and weekend shading in a grid of event cells (see Calendar view below) | Calendar: today 24×24 circle `rgb(229,100,88)` white 14px; weekend cell `#f9f8f7`; weekday 12px `#a19e99`; day number 14px, top-right |

## Components Area lacks

| Component | Job | Evidence | Already a candidate? |
|---|---|---|---|
| Chart (bar, line, donut, number) | Plots a collection: vertical / horizontal bars, line with gradient area, donut with a centre value, number | OKR bar: bars 14 wide, top corners 2, series `rgb(94,159,232)` / `rgb(234,194,107)` / `rgb(114,188,143)` / `rgb(191,142,218)`; donut centre 42.6px/600 over a 12px label `#7d7a75`. People line: stroke 1.25 `#2383e2`, area gradient `rgb(94,159,232)` 10% → 0%, axis `#e6e5e3`, labels 12px `#7d7a75`, height 400 (Highcharts `svg.highcharts-root`). Options per Help Center (notion.com/help/charts): height Small–Extra large, grid lines, data labels, smooth line, gradient area, value in centre, colour by value, legend | Yes ("Chart") |
| Calendar view (event month) | Places records on a month of days; Today and previous / next | Calendar: cell 185×124, rules `1px #e6e5e3`, weekend `#f9f8f7`, today circle 24 `rgb(229,100,88)`, header "November 2026" 14px/600, Today 24h pad 0 6 radius 6, arrows 24×24. Area Calendar is a date picker | No |
| Timeline (Gantt) view | Records as bars over a time scale, with a table pane, zoom (Quarter), Today, today line, jump-to-item arrows | Projects timeline: bar 34h, radius 6, white, `0 2px 4px rgba(0,0,0,.04), 0 0 0 1px rgba(42,28,0,.07)`; hovered bar tinted blue; scale select "Quarter" 24h pad 0 6 radius 6; day labels 12px `#a19e99`; month 14px/500; today badge 12px/500 white on red; selected range in the scale 22h radius 11 `#f7f7f7`. Area Timeline is an event list | No |
| Peek (side / center / full page) | Opens a record beside or over the page without leaving it, with record navigation | OKR side peek (see Drawer row); mode menu lists Side peek, Center peek, Full page, New tab | No (Drawer covers the panel; the record header and modes are new) |
| Hover action bar | A small floating bar that appears on hover over a row or block and holds 1–4 actions | OKR row "OPEN" bar 24h pad 2 radius 6; Start code-block bar 28h pad 2 radius 6; both the small floating shadow | Partly ("Floating format bar" under Notion parts) |
| Filter bar and filter editor | A row of active filters with an editor per chip (operator "Status is ⌄", search, checklist of options), "+ Filter", Reset; nested AND / OR groups | OKR filter (measured above); editor header "Status is" 12px `#a19e99`; option rows 28h radius 6 with a 20px checkbox and the value's Tag. Help Center (notion.com/help/views-filters-and-sorts): "Save for everyone", filter groups nested up to three deep | No |
| Status property | A three-group status (To-do, In progress, Complete) with group icons and pill + dot tags | Projects table and board (measured above) | No |
| Form view | A form built from a collection: questions, required, description, list or dropdown choices, max selections, cover and icon | Help Center only (notion.com/help/forms) | No |
| Floating outline | Page outline as an edge minimap that opens on hover | Todo (measured above) | No (a Table of contents variant) |
| Emoji / icon picker | Pick an emoji or icon for a page or callout | Not observed (needs edit rights) | Yes ("Notion parts") |
| Comment thread, reactions | Comments on a block, resolve / re-open, emoji reactions | Help Center only (notion.com/help/comments-mentions-and-reminders) | Yes ("Notion parts") |
| Mention (person, page, date, reminder) | Inline chip for a person, page or date; a reminder turns red on its day or when overdue | Help Center only (notion.com/help/reminders: "Inline reminders turn red when they change to @Today or are past due"; date mentions; page mentions create backlinks) | No |
| Date picker with reminder | Date or range, include time, remind before, date format, time zone | Help Center only (notion.com/help/reminders: "edit the date and time of your reminder, when you want to be reminded … and change the date format and timezone") | Partly (Date picker exists; reminder, format and time-zone rows don't) |
| Synced block | A block shared across pages, outlined while editing, "ORIGINAL" on the source | Help Center only (notion.com/help/synced-blocks) | No |
| Conditional colour | Colour rows or cards by a property's value | Help Center only (notion.com/help/database-properties: "New color setting … color by … Page background color … Add another") | No |

## System ideas

| Idea | What Notion does | Evidence | Area today |
|---|---|---|---|
| Ten (now eleven) label hues, one role table each | Every hue has the same roles: `Tex Pri/Sec/Ter/Dis`, `Ico…`, `Bor Pri/Sec/Str`, `Bac Pri/Sec/Ter/Ele/Int`, `BacAccPri/Sec`, and transparent twins (`BacPriTra`, `BacSecTra`, `BorPriTra`); a 12-step palette per hue (`palRed30 … palRed900`, with 75) and a separate UI blue ramp (`palUiBlu50 … 700`) | OKR stylesheet, light computed: e.g. blue `TexSec #387dc9`, `BacSec #e5f2fc`, `BacSecTra #007cd718`, `BorPri #cee3f7`, `BacAccPri #2783de`; dark: blue `BacSec #233850`, `BacTer #355f8b`, `TexPri #e5f2fc` | Tag and Board share ten hues on tone tokens (owner 2026-11-03); no teal; no published role table per hue |
| Hue names | Three-letter role names: gra, bro, ora, yel, gre, blu, pur, pin, red, tea, plus an un-hued default | OKR stylesheet `--c-<hue><Role>` | Area: neutral, gray, brown, orange, yellow, green, blue, purple, pink, red |
| Shape follows the data type | Select = radius 4 rectangle; Status = radius 10 pill with an 8px dot; filters = radius 32 pill; view tabs = radius 20 | Projects, OKR (measured above) | Tag has no shape axis; Badge has `pill` |
| Transparent tints for hover and grounds | Hovers and soft grounds are warm-black at low alpha (`rgba(33,27,23,.05)`, `rgba(66,35,3,.03)`, `rgba(42,28,0,.07)`), so they work on any coloured column or callout | OKR, Projects | Area derives hover plates in `emit/base.ts`; check they stay alpha over tinted columns |
| Three floating depths | Small (hover bars, peek), menu (menus, outline panel), modal (search) shadows, each ending in the same `0 0 0 1px rgba(42,28,0,.07)` edge | Shared values table | Area has Resting / Floating depth settings; Notion's ring-as-edge on every level is a ready reference |
| Two focus rings | Controls: 2px ground gap + 2px `#2383e2` + 2px white 25% halo, with a transparent outline kept for forced colours; fields: 1px inset + 1px outset blue (no gap) | OKR | Area has one focus-ring setting; a field variant is worth a look |
| Hover reveals, never reflows | Row actions ("OPEN"), code-block bar, sidebar chevron, peek arrows appear on hover in floating bars or by swapping an existing slot (icon → chevron), so the row never shifts | OKR, Start | PRODUCT_UI gap 7 asked for Nav hover-revealed actions; the icon-swap rule is new |
| Keyboard hints are text, not keycaps, inside dark or dense surfaces | Tooltip: second line, muted (`rgb(173,169,163)` on `#2c2c2b`); search footer: 12px glyph icons and words, no backplates | OKR, Start | Area: Kbd backplate everywhere (owner 2026-10-22: "every key has its backplate"); worth an explicit exception for tooltips, or keep as a deliberate difference |
| Uppercase micro-labels for computed values | Aggregations use 10px/500 uppercase, letter-spacing 1px, tertiary ink, value beside in secondary | OKR "COUNT 2" | Area has no 10px style; Count is a separate family |
| Density by context, not one scale | 14px in tables, menus, sidebar; 12px for card properties and small tags; 16px for page text; rows 28 (menu), 30 (sidebar), 36 (table, search result) | All pages | Area's density axis is global; Notion's per-surface sizes are evidence for the Tag `sm` and card-property sizes |
| Unsaved-change dot | A 9px orange dot on a filter chip (and the filter icon turns blue) marks a view change only you see until saved | OKR, Calendar ("Need to schedule" filter icon blue) | No equivalent mark; Indicator could carry it |
| Nested menus with search first | Property and filter menus open with a 28px search field on top, rows keep 28h, panels 220–282 wide; submenus show the current value at the row end | OKR filter menu (measured); peek-mode menu | Area Menu has `search-surface` and `sub-chevron`; a "value at row end" slot is not listed |
| Wide modal search with preview | 1006-wide, radius 20, blurred translucent ground, results radius 12, preview pane on | Start | Command palette has no preview or path slot |
| Coloured groups carry their colour into children | Board column tint flows to its cards' ring and its count's ink; Status group colour reaches the header label and icon | Content, Projects | Board already does this for cards and count (`board.css`); the table group header (not built) would need the same rule |

## Mapping summary (Notion part → Area family)

Callout → Alert (candidate Callout); Toggle → Accordion; Quote, Equation, Bookmark, Embed, File,
Synced block → not observed; Divider → Separator; Columns → Stack; Table of contents → Table of
contents; Button block → Button (outline); To-do → Checkbox; Page link → Link; Breadcrumb →
Breadcrumb; Table view → Table (DataGrid candidate); Board → Board; Gallery → Card + Asset grid;
List → Table / Nav rows; Calendar view, Timeline view, Chart view, Form view → none; Select /
Multi-select → Tag + Tag picker; Status → Tag (no dot); Person → Avatar + label (20px circle,
14px name, OKR); Date range → text with "→" (Projects); Progress number → Progress; URL → Link;
Files → thumbnails in a cell (Content, not measured); View tabs → Tabs; Filter / sort chips →
Chip; Group header, aggregation footer → none; Side / center peek → Drawer; Menus → Menu;
Sidebar tree → Tree view / Nav; Search → Command palette; Tooltip → Tooltip; Toast, emoji picker,
cover picker, date picker, comments, mentions, AI → not observed.
