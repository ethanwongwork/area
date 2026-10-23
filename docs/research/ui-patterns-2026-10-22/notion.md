# Notion UI layout, 2026-10-22

How Notion composes whole screens: documents, databases, peeks, floating layers, the template feed, marketing pages
and the help centre. Read for the UI composition skills (`area-ui-compose`, `area-ui-review`). Logged out, read-only:
public notion.site pages and notion.com, in headless Edge 155 at 1440×900, 1024×768 and 390×844, light and dark
(`prefers-color-scheme` emulated). Lengths are CSS px from `getBoundingClientRect` / `getComputedStyle`.

Confidence: **M** measured live this session; **C** from an existing capture or spec (cited); **D** derived from two or
more measurements (the arithmetic is shown). Page selectors are Notion's own class names (`.notion-*`).

Settled values are cited, not re-measured: sidebar rows, page properties, board, table and the floating surfaces
(`docs/research/BASELINE.md`, `app-screens-2026-10-21.md`, `docs/specs/{nav,board,table,description-list}.md`).

## Shell

| Part | Value | Source |
|---|---|---|
| Top bar | 44 tall, padding 0 10 0 12, transparent, **no rule and no shadow** | M `.notion-topbar` (all pages) |
| Breadcrumb item | 24 tall, radius 6, padding 0 5 0 3, 18 icon (radius 3.5) + 14/16.8 text | M `.notion-topbar [role=button]` |
| Top bar actions | 28 tall, 38 wide (padding 0 8), radius 6, abutting; one 32×28 more button | M same |
| Top bar CTA | 32 tall, radius 6, padding 0 10, 14/16.8 500, ink fill rgb(44,44,43), 8 before it | M same |
| Scroll owner | `.notion-frame .notion-scroller` below the top bar (overflow-y auto); the top bar never scrolls | M |
| Frame paint | white / rgb(25,25,25); ink rgb(44,44,43) / rgb(240,239,237) | M `.notion-frame`, `h1` |
| Sidebar (logged in) | rows 30, radius 6, 14/21; labels 12/16 rgb(161,158,153); rows 254 wide | C `nav.md`, `baseline/notion--sidebar-*` |
| Mobile (390) | a 44 bar without the `.notion-topbar` class; actions 32 squares; view tabs become one 36 pill (radius 9999, padding 6 10) | M |

## Page layout

**Widths.** Pages centre a 720 container; blocks inset their text 6, so the text column is 708 (M `.notion-page-content`
720, block text at +6). Full width keeps 96 at each side: 1248 at 1440, 832 at 1024 (M, ronizone page). At 1024 a normal
page is still 720, centred at 152. At 390 the container is 354 at x18, so text sits 24 from the edge (M, staylime page).

**Header.**

| Case | Value | Source |
|---|---|---|
| Cover | full bleed under the top bar, **30vh**: 270 at 900 tall, 230.4 at 768; **200** at 390; `object-fit: cover`, centred | M staylime `img` |
| Icon with cover | 78 square, radius 4, margin-top **−42** (overlaps the cover by 42), 8 from the column edge | M `.notion-record-icon` |
| Icon without cover | 78, margin-top 96 below the top bar | M notioner |
| Title | 40/48 700, padding 0 8; **12** below the icon; 390: 28/33.6 | M `h1` |
| Database page title | 32/38.4 700, 36 inline icon, 36 below the top bar, no 78 icon | M roadmap |
| Properties | 8 below the title; rows 34, 160 name column | M; C `description-list.md` |

**Block rhythm.** Every block wraps its line in 6 padding, and the text line adds 2 (M `.notion-text-block > div`).

| Block | Above / below (block padding) | Text | Text-to-text gap after a paragraph | Source |
|---|---|---|---|---|
| Paragraph | 6 / 6 | 16/24 400, padding 2 | 16 | M |
| H1 (`header`) | 30 / 6 | 30/39 600 | 40 above, 16 below | M `.notion-header-block` |
| H2 (`sub_header`) | 26 / 6 | 24/31.2 600 | 36 above, 16 below | M |
| H3 (`sub_sub_header`) | 22 / 6; **6** when first in a column | 20/26 600 | 32 above, 16 below | M (betterwiki, notioner) |
| List item, to-do, toggle | first 6 / 1, then 1 / 1, last 1 / 6 | 28 row: 24 marker box, text padding 2 0 2 6 | 6 between items | M `.notion-bulleted_list-block`, `.notion-toggle-block` |
| Divider | 13 tall, padding 0 8, 1px line rgba(28,19,1,.11) / rgba(255,255,235,.1) | — | — | M |

Headings carry the space above them; the space below matches a paragraph's. The sum of block paddings makes
the gaps: Notion does not use margins.

**Containers and media.**

| Block | Value | Source |
|---|---|---|
| Callout | block padding 8; inner padding 12, radius 10, fill rgb(249,248,247) / rgb(56,56,54), 1px transparent border; 24 icon box 7.5 down; text padding 8 | M `.notion-callout-block` |
| Columns | equal widths (337 + 337 in 720); **46** gutter (the drag handle zone); column padding 12 top and bottom; stack at 390 | M `.notion-column_list-block` |
| Image | block padding 8 → 704 wide in the 720 column; wrapper radius 10, `img` radius 2, `object-fit: cover`; custom widths centre (666) | M `.notion-image-block` |
| Video / embed | custom width centred (400), block padding 8 | M `.notion-video-block` |
| Code | block padding 8; radius 10, fill rgba(66,35,3,.03); padding 24 22 (+12 0); mono 13.6/20.4 | M `.notion-code-block` |
| Caption | 14/19.6, muted rgb(125,122,117), padding 6 0 6 2, directly under the frame | M (code caption) |
| Inline code | 0.85em, padding 0.17em 0.34em, radius 4, fill rgba(33,27,23,.05) | M |
| Table of contents | rows 14/18.2 padding 6 2 (30 tall); nested headings indent 24; default ink | M `.notion-table_of_contents-block` |
| Comments | label 13/18 muted; author 14/21; date 12/16 rgb(161,158,153); 24 avatar | M |

## Databases

**Placement.** A database page keeps **96** at the sides at 1440 and 1024 and **24** at 390 (M `.notion-board-view`
margin). Views then inset their content 8 more: board and table start at 104, calendar and gallery pad 0 104 (M). An
inline database sits in a horizontal scroller as wide as the frame, padded back so its grid starts on the text column
(pixyz: scroller 1440 wide, padding 374, grid at 368) (M).

| Part | Value | Source |
|---|---|---|
| View tabs | row 40; pills 32, radius 20, padding 6 12, 20 icon + 6, 14/16.8 500, max 220; current: fill rgba(33,27,23,.05) / rgba(255,255,255,.055), ink default; others muted rgb(125,122,117) / rgb(173,169,163); overflow collapses to "N more…" | M `.notion-collection-view-tab` |
| Toolbar | 28 squares, radius 6, padding 6, 16 icons, **abutting** (28 pitch), muted ink, 8 from the end; same row as the tabs | M `.notion-collection-filter`, `-sort` |
| Table | header 36, 14/21 400 muted, no fill; cells 36 + 1 rule, padding 7.5–8 / 8; column rules rgba(42,28,0,.07); header has an inset bottom rule and stays above rows (z 87) | M `.notion-table-view`; C `table.md` |
| Board | columns 276, 12 apart, padding 0 8 8, tint 3–4.3%; cards 260, radius 10, header 40 with count | M; C `board.md` |
| Board card | white / rgb(32,32,32); shadow 0 4 12 .027, 0 1 2 .02 + 1px rgba(42,28,0,.07) ring; dark: 0 2 4 .08 + rgba(255,255,243,.082) ring | M `.notion-collection-item > div` |
| Gallery card | the same card; **cover 16:9** (220 → 123.8, 377 → 212.1), cover then 1px rule; title row padding 8 10 (6 bottom with properties), 15/22.5 500, 24 icon box; properties 12/18 in 18 pills, row padding 0 6 8 | M `.notion-gallery-view` |
| Gallery grid | gap 16; small: 3 × 220 in 692, 6 × 192 in 1232 → minimum between 162 and 192 (D); large: 3 × 377 in 1164 → minimum 280–377 (D); medium not found | M |
| Calendar | month row 42 (14/14 600, 8 in); prev / "Today" (24, padding 0 6, radius 6) / next at the end; weekday row 24, 12/18 rgb(161,158,153), 1px rule rgb(230,229,227); cells 124 tall with end and bottom rules; weekends fill rgb(249,248,247); dates 14/24 end-aligned, other months muted, today a 24 circle rgb(229,100,88) | M `.notion-calendar-view` |
| Mobile | board columns stay 276 and scroll sideways; 24 side padding | M |
| List, timeline | not found: the only public list view was empty; no public timeline loaded | looked in bensomething, landmarklabs, notion-templates, notion.notion.site |

## Side peek and center peek

Opened by clicking a board card (navigation; `?p=…&pm=s` / `pm=c`).

| Part | Side peek (`pm=s`) | Center peek (`pm=c`) | Source |
|---|---|---|---|
| Size | full height; **720** at 1440 (half), **564** at 1024 | max **960**, **72** from every viewport edge (1440: 960×756; 1024: 880×624) | M `.notion-peek-renderer` |
| Page beneath | **reflows to the remaining width** (frame 720 / 460); no scrim; tabs collapse to "N more…" | scrim rgba(15,15,15,.6) / .8 dark | M |
| Surface | square, white; shadow 0 8 12 .027, 0 2 6 .027, 1px rgba(42,28,0,.07) ring; dark rgb(32,32,32), ring rgb(56,56,54), 0 4 12 −2 .08 | radius 12, same shadow and dark paint | M |
| Header | 44, padding 0 10 0 12; 24 ghost buttons radius 6 (close, expand, …) | 44, top corners 12 | M |
| Content | side padding **76** (568 at 720, 412 at 564); title 32/38.4 | content 708 (126 padding), 628 at 1024; title 40/48 | M |
| Resize | 12-wide handle on the leading edge | — | M |
| Mobile | not found: a peek URL at 390 rendered no peek | | M |

## Floating layers

From existing captures (some at 90% zoom; CSS px recorded). No new measurement.

| Layer | Width | Radius | Shadow / paint | Capture |
|---|---|---|---|---|
| Menu | 250–265 | 10 | 0 20 24 .05, 0 5 8 .027, ring .07; dark rgb(37,37,37), ring rgb(56,56,54), 0 14 28 −6 .2 | `menu/notion--page-menu--open`, `menu/notion--home-menu--open--dark` |
| Select / small menu | 232–264 | 10 | same | `custom-select/notion--*` |
| Popover (share) | 456 | 12 | same | `popover/notion--share-popover--open` |
| Date popover | 248 | 6–10, 4 inset | same | `calendar/notion--search-date-filter-popover`, `date-picker/notion--*` |
| Hover card | 260–280 | 10 | link preview: 0 8 12 .027, 0 2 6 .027 (lighter) | `hover-card/notion--{link,page}-preview--open` |
| Search palette | ~1006×700 at zoom | 20 | 90% white + blur 40; 0 24 48 .24, 0 4 12 .14 | `command-palette/notion--search-palette--open` |
| Dialog | settings 1504×751 at zoom | 12 | dark rgb(32,32,32); scrim 80% #0f0f0f | `dialog/notion--*--dark` |
| Toast | one line 43 | 8 | ink fill rgb(44,44,43) | `toast/notion--toast-link-copied--open` |
| Tooltip | max ~300 | 6 | rgb(44,44,43), 5% white inset ring | `tooltip/notion--*`; C `tooltip.md` |

Slash menu: not captured (needs an editable page).

## Titles and copy

| Role | notion.site | notion.com marketing / help |
|---|---|---|
| Page title | 40/48 700 (390: 28/33.6); database 32/38.4 700 | help H1 42/48 700 −1.5; product hero 96/100 600 −4.6 |
| H1 / H2 / H3 | 30/39, 24/31.2, 20/26, all 600 | section 54/56 700 −1.875; 42/48 700 −1.5; 32/40 700 −0.75; 26/32 600–700 −0.625; 22/28 700 −0.25 |
| Body | 16/24 400 | 16/24 (help), lead 20/30 400 |
| Secondary / UI | 14/21 (cells, properties); 14/16.8 500 (tabs, buttons) | 15/20 subtitles and nav rows; 14/20 |
| Caption / meta | 14/19.6 rgb(125,122,117); 12/16 rgb(161,158,153) | 12/16 counts; 11/11 500 uppercase eyebrows at 54% black |
| Ink | rgb(44,44,43) / rgb(240,239,237); muted 125,122,117; faint 161,158,153 | 95% / 90% black; muted rgb(97,93,89), 54% black |

Title to subtitle: 8 on the template feed (42/48 then 15/20) (M); 12 icon to title on pages (M). Casing is sentence
case everywhere ("Get Notion free", "Jump to FAQs", "Browse 262 consultants"); uppercase only for 11px eyebrows
("CONTENTS"). Board group headers put the count after the title in plain muted type. notion.com ignores the dark
preference (body stays white, M).

## Feeds, grids and carousels (notion.com)

**Gutters.** Header 64, padding 14 24 (14 16 at ≤ 1024). Content edge: templates 86 at 1440 (1267 wide), 61 at 1024
(901), 24 at 390; product 105.6 at 1440 (main padding 96 105.6), 77 at 1024, 16 at 390; footer 94 / 32 / 16 (M).

| Pattern | 1440 | 1024 | 390 | Source |
|---|---|---|---|---|
| Template feed grid | 12 columns, gap 24 | same | one column | M `/templates` |
| Category tiles | 6 up, 191×181 | 3 up, 284×153 | 1 up, 342 | M |
| Consultant / agent cards | 4 up, 299 | 4 up, 207 | 1 up | M |
| Featured template cards | 3 up, 406 | 3 up, 284 | 1 up | M |
| Promo hero cards | 2 per row spans, 300 tall, row gap 32 | 2 rows | stacked, gap 20 | M |
| Use-case cards | 5 × 239×160, gap 8 | — | — | M `/product` |
| Bento | 2 × 602×560, gap 24, radius 12 | 2 × 423 | 1 up | M |
| Testimonials | 3 × 394, gap 24 (grid) | **carousel**: items 360, gap 16 | **carousel**: items 293.5 (75%), gap 16 | M |
| Logo strip | 9 columns, gap 8, cells 116×36, overflow hidden | 7 columns | — | M |
| Footer | 12 columns, gap 40/24: brand 401 + 4 link columns (gap 80/24) | 304 + 632 | 2 columns, gap 12 | M `footer` |

**Card anatomy.**
- Featured template: 1200:630 thumbnail, radius 6, an inner 1px rgba(0,0,0,.08) edge and a soft 0 3 9 .03 shadow. 8
  below it, a row with a 36 round avatar, 10 gap, title 15/20 over creator 12/16 rgb(163,158,152), price 14/20 500 at
  the end. Rows are 24 apart (M).
- Category tile: radius 12, fill rgb(246,245,244), padding 24 32, 32 icon, title 18/28 700, count 12/16 (M).
- Use-case card: radius 12, 1px rgba(0,0,0,.1), padding 24, white, gap 16 inside (M).

**Section header.** Title 42/48 700 −1.5 with a 15/20 subtitle 8 below. A "Browse N …" link (15/22 700, black) sits at
the end of the row (space-between). The grid starts 16 below, and sections end with a 72 margin (M).

**Carousels.** They are only a narrow-width fallback for a grid, never on desktop. The scroller pads by the page gutter
(76.8 at 1024, 16 at 390) and has `scroll-padding-inline` 16 and `scroll-snap-type: inline mandatory`. Items snap
`center`; the next one peeks. There are no arrows, fades or visible scrollbar (M).

## Help centre (notion.com/help)

| Part | Value | Source |
|---|---|---|
| Sidebar | **280**, sticky at 60, 1px end rule rgba(0,0,0,.08), padding 20 16; nav rows 32, padding 6 8, 15/20, chevron at the end; group labels small and muted | M `aside._*sidebar` |
| Article | **804**, 62 after the sidebar | M `article` |
| TOC | **200**, 32 after the article, sticky at 84; "CONTENTS" 11/11 500 uppercase 54% black; items 15/21, padding 4 12 (nested 24), 29 tall; current blue rgb(0,117,222) with a 2px start bar | M `aside.*stickyToc` |
| Article head | breadcrumb 15/20; H1 42/48; eyebrow 11 caps; lead 20/30; "Jump to FAQs" 36, radius 8, 1px rgba(0,0,0,.1), 16 500 | M |
| Body | H2 32/40 700, H3 26/32 600, p 16/24 with 10.4 margins; images full column | M |
| 1024 | sidebar and TOC hidden; article 804 centred | M |
| 390 | 24 gutters; H1 26/32 | M |

## Responsive summary

- **1440 → 1024:** the page container and paddings stay (720 column, 96 database and full-width padding). The side
  peek takes ~55% (564). The center peek keeps its 72 inset. The help centre drops both side columns. Marketing grids
  keep their columns, and testimonials become a carousel.
- **390:** the text sits 24 from the edge and the title drops to 28. Columns stack, and the cover is 200. Database view
  tabs become one pill menu, and boards scroll sideways. Marketing collapses to one column with 16–24 gutters.

## Patterns worth adopting

1. **One reading column.** Prose is 708 of text in a 720 container (block inset 6); only "full width" widens it, to
   the frame less 96 at each side. At phone widths the gutter is 24.
2. **Rhythm from block padding.** Each block carries 6 above and below, and its line 2 more: 16 between paragraphs, 6
   between list items. Headings add space only above (H1 30, H2 26, H3 22), never extra below. The first block in a
   column drops its extra space.
3. **Databases bleed, prose doesn't.** Database views span the frame, and their content starts on the text column (or
   at the page padding plus 8). Wide views scroll sideways inside the page instead of shrinking.
4. **One control row per view.** Pill tabs (32, radius 20, 14/16.8 500, current = 5% fill) sit on the leading side.
   Abutting 28 icon buttons in muted ink (filter, sort, search, then the primary) sit at the end of the same 40 row.
5. **Cards in collections share one recipe:** radius 10, white, a 1px 7% warm ring plus a 2-layer 2–3% lift. The cover
   is 16:9 with a rule under it, and the title is 15/22.5 500 in 8 10 padding. Gaps are 16 (gallery) or 8 (board).
   Grids auto-fill with a minimum width per size.
6. **Header stack:** a cover at 30vh (200 on phones). A 78 icon overlaps the cover by 42, the title sits 12 under the
   icon, and properties 8 under the title.
7. **Side peek beside, center peek above.** A side peek is half the window (720 at 1440, ~55% at 1024), full height,
   with a 44 header. It reflows the page beneath and adds no scrim. A center peek is at most 960 wide, 72 from every
   edge, radius 12, over a 60% scrim (80% dark). Both keep the page's own content width inside (76 or 126 padding).
8. **Floating layers lean on shadow:** menus 250–265 wide at radius 10, popovers 456 at radius 12, and one shadow
   recipe (0 20 24 5% + 0 5 8 2.7% + a 1px ring). Dark mode swaps the ring for a lighter edge.
9. **Docs page:** 280 nav | 804 article | 200 TOC, with gaps 62 and 32. Both side columns are sticky. The TOC marks the
   current item with a 2px start bar and an accent. Drop both side columns below about 1200 and keep the article
   centred.
10. **Feed sections:** title, a subtitle 8 below, a "Browse N" link at the end of the header row, the grid 16 below,
    and 72 between sections. The grid has 12 columns with 24 gutters: tiles 6-up, people 4-up, items 3-up, one-up on
    phones.
11. **Carousels only where a grid can't fit:** snap to center, the gutter as padding, a 16 gap, items about 75% wide
    on phones, no arrows or fades.
12. **Type scale.** The app keeps 40 / 30 / 24 / 20 / 16 / 14 / 12, with weight 600 for headings and 700 only for
    titles. Marketing adds 42–96 display sizes with negative tracking (−1.5 at 42). Use sentence case, with
    uppercase only for 11px eyebrows.
13. **Chrome without rules:** the 44 top bar and the table header have no visible rule against the page. Hierarchy
    comes from muted ink and space, and hairlines are 7–11% warm black.

## Sources

| Page | Used for |
|---|---|
| `notioner.notion.site/9d9c6a658f14412196a2be51e467c9ef` | blocks, headings, columns, TOC, toggles, callouts, video, image, dark doc paint |
| `betterwiki.notion.site/Onboarding-Guides-84429b52653345c68af8b582f19cf0f4` | text rhythm, H3, callouts, images, to-dos |
| `staylime.notion.site/Image-grid-e090cd7f15a344229d1fd03555a769a8` | cover, icon overlap, title, widths at 1440 / 1024 / 390 |
| `bensomething.notion.site/Open-Any-Page-in-Peek-Mode-…` and `/39dc42b936084c5d8ed7a159cf3438b2` | code block, caption, empty list view, small gallery (no covers) |
| `pixyz.notion.site/Pixyz-Review-2021-1-What-s-new-…` | inline gallery bleed, small cards with covers |
| `ronizone.notion.site/Widget-Gallery-130-Free-Widgets-…` | full width at 1440 / 1024 / 390, large gallery cards |
| `notion-templates.notion.site/6c53b191c9924fa89468f92fb3d430bf` | database page, tabs, toolbar, board, table, calendar, side and center peek, dark |
| `notion.notion.site/494320ff75fc470cbd002016748d8ef9` | view types available (board, table, calendar) |
| `www.notion.com/templates`, `/product`, `/help/duplicate-delete-and-restore-content` | feed, marketing, carousels, footer, help centre (cookies: Reject all) |
| `docs/research/captures/*/notion--*` | floating layers, sidebar, board, table, properties |

Scripts: session scratchpad `scripts-notion/` (`cdp.mjs`, `m.mjs`, `tree.js`, `mkt.js`). The first Edge profile was
signed into the owner's Edge account by the OS and synced extensions. It was killed, and the key values (document
blocks, tabs, board, peeks) were re-measured identically in a clean guest profile (`--guest --disable-sync
--disable-extensions`). No Notion sign-in, duplication or edit.
