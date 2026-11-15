# Rendered review: navigation, overlays and pickers (VN), 2026-11-11

Reviewer prefix **VN**. 29 families, judged as rendered at the shipped defaults (type 13, density 32, radius 10), light
and dark. Read-only; nothing in the repo changed but this file.

## 1. Method and coverage

- **Source.** The capture set described in `rendered-method.md` (scratchpad `rendered/out/`): per family `light.png`,
  `dark.png`, `measure.json`, and the `open-*` overlay captures. Every number below comes from `measure.json` (rects,
  text boxes, computed type, colours, borders, radii, padding, shadow) or from pixel samples of the 2x PNGs (stated
  where used). No lengths were read off pictures.
- **Tools** (scratchpad `rendered/review-VN/`): `q.js` (condensed node + text dump per tile), `surf.js` (floating
  surface census), `rows.js` (row census), `crop.js` / `half.js` / `mont.js` (crops, half-scale pages, dark montages).
  Crops cited below live in that folder (`review-VN/<slug>/<tile>-light.png`, `h/<slug>-light-N.png`,
  `m-dark1.png`, `m-dark2.png`, `nav/htabs-zoom.png`).
- **Viewed, light, every tile:** breadcrumb, command-palette, confirm-dialog, context-menu (+ open), dialog (+ open),
  drawer, hover-card, menu (+ both opens), nav, pagination, popover, stepper, tabs, toggletip, tooltip, tree-view,
  asset-row, box-model, calendar (first page of tiles at half scale, rest by measure), color-picker (first page; rest by
  measure), color-swatch, color-swatch-picker, file-upload, list-box, panel (first page; rest by measure),
  property-list, scroll-area, splitter, token-row.
- **Viewed, dark:** default and most complex tiles of Menu (icons, header/footer), Context menu (open), Nav (sidebar),
  Command palette (default), Popover (teaching), Confirm dialog (danger), Dialog (open modal), Calendar, Color picker,
  Panel, Tree view, Tabs (counts), Pagination (few), Stepper (descriptions), List box. Dark colours for every other
  node read from `measure.json` (`dark`).
- **Could not verify.** Hover card's card (no tile shows it open, no open capture); Setting row's toggletip; any
  hover, press or motion; materials other than the default; Calendar/Color picker pages 2–4 and Panel pages 2–5
  were checked by measurement, not by eye.

## 2. Scorecard (1–5; balance, spacing, type, shape, colour, professional feel)

| Family | Bal | Spc | Type | Shape | Col | Feel | Verdict |
|---|---|---|---|---|---|---|---|
| Command palette | 5 | 4 | 4 | 4 | 4 | 4 | Search icon and row icons share x (+12), input and labels share x (+38): excellent; 14 corner vs Dialog 20 |
| Menu | 5 | 4 | 4 | 5 | 4 | 5 | Shipped-looking; inactive row inverts title/note; dark double edge |
| Context menu | 5 | 4 | 4 | 5 | 4 | 4 | Menu's surface; tree-row demo plain |
| Breadcrumb | 5 | 5 | 4 | 5 | 4 | 4 | Chevron ink centred 9.5 from text both sides; clean |
| Tooltip | 4 | 4 | 4 | 5 | 4 | 4 | Kbd concentric (refutes S2 for Tooltip); text 0.5 high (line box) |
| Toggletip | 4 | 4 | 4 | 4 | 4 | 4 | Is Tooltip's inverse bubble, not a Popover |
| Popover | 4 | 4 | 4 | 4 | 4 | 3 | Close 1 off concentric; outline Secondary vs other overlays; caption typo |
| Hover card | – | – | – | – | – | 3 | Card never rendered open; trigger only |
| Dialog | 4 | 3 | 3 | 3 | 4 | 3 | Close 3 off concentric; title moves 2.8 with/without close; scroll cut with no cue |
| Confirm dialog | 4 | 4 | 4 | 3 | 4 | 4 | Good alone; disagrees with Dialog on ink, trim, Cancel |
| Drawer | 4 | 4 | 4 | 4 | 4 | 4 | Soft Cancel (≠ Dialog ghost); solid |
| Nav | 4 | 4 | 4 | 4 | 4 | 3 | Closable tab hides its own name; pictures demo blank |
| Tabs | 3 | 4 | 3 | 4 | 3 | 3 | Plate tabs don't hang; status words in tone ink; text 0.6 high |
| Pagination | 4 | 3 | 3 | 4 | 3 | 3 | Two inks in one bar; default tile 1.3 from card edge |
| Stepper | 4 | 4 | 4 | 4 | 3 | 3 | Connectors at 7.5% vanish, esp. dark |
| Tree view | 4 | 4 | 4 | 4 | 3 | 4 | Muted icons vs Nav; label 0.6 high; Guides tile shows nothing |
| List box | 4 | 3 | 4 | 4 | 4 | 3 | Grid heading on no column; grid leaves 34 dead |
| Calendar | 4 | 4 | 3 | 4 | 4 | 4 | Day numerals 11 in 30 cells; nav 2 off concentric |
| Color picker | 4 | 4 | 4 | 4 | 4 | 4 | Polished; header glyph 13 vs text 16 |
| Color swatch | 5 | 4 | – | 4 | 4 | 4 | Fine |
| Color swatch picker | 4 | 4 | – | 4 | 4 | 4 | Selected drawn differently from palette and List box |
| File upload | 4 | 4 | 4 | 4 | 4 | 3 | Tile 2px from card edge, sides merge with the card |
| Panel | 3 | 3 | 4 | 3 | 4 | 3 | Rows on two column grids; loose bar→section; corner action off column |
| Property list | 4 | 4 | 4 | 4 | 4 | 4 | Good Figma-like rows; caption typo |
| Scroll area | 3 | 4 | 4 | 2 | 4 | 3 | Thumbs clipped by the frame's corner |
| Splitter | 4 | 4 | 4 | 4 | 4 | 3 | End tile overruns card |
| Asset row | 4 | 4 | 3 | 4 | 4 | 4 | 11px name in a 56 row |
| Token row | 4 | 4 | 3 | 3 | 3 | 3 | Default (soft) edge stronger than Outline; 21 tall |
| Box model | 4 | 4 | 4 | 4 | 4 | 4 | Fine |

## 3. Census (measured)

### 3a. Floating surfaces, default (`surf.js`)

| Surface | Fill L / D | Edge L / D | Dark rim (shadow) | Shadow L | Corner | Pad (+1 border) |
|---|---|---|---|---|---|---|
| Menu, Context menu | L1.000 / L0.085 | 1px 12.5% / white 12.5% | **+ 1px white 16% outside** | 0 0 2 @4%, 0 8 16 @8% | 14 | 4 |
| Popover, Hover card | same | same | same | same | 16 | 11 |
| Calendar | same | same | same | same | 16 | **9 / 7 / 7 / 7** |
| Color picker | same | same | same | same | 16 | 0 (parts pad 15) |
| Dialog, Confirm dialog | same | same | same | 0 0 8 @8%, 0 14 28 @16% | 20 | 15 |
| Drawer (side / bottom) | same | side 1px / top 1px | same | modal | 0 / 20-20-0-0 | 16 (15 on bordered side) |
| Command palette | same | same | (inline tile: no shadow) | modal when open | **14** | 0 (search 12, list 4) |
| Tooltip, Toggletip | rgb 40 both | none | white 8% + inset 5% | 0 0 2 @2%, 0 4 8 @4% | 10 | 4 / 9 |
| Calendar caption menu (open) | Menu's | Menu's | – | – | **12** | 4 |

All share fill, edge and shadow role by measurement (good). Dark page under the tiles samples rgb 1; the menu fill
samples rgb 2 (`review-VN/menu/default-dark.png`, row y=202): the surface is the page colour, separated only by its
edge, which samples 42 (rim) then 31 (border) over two CSS px.

### 3b. Rows, md (`rows.js`)

| Family | Row | Corner | Icon x | Label x (icon / text-only) | Icon→label | Icon ink | Label glyph top/bottom in 30 |
|---|---|---|---|---|---|---|---|
| Menu, Context menu | 30 | 10 | 8 | 34 / 10 | 10 | default L0.277 | 6.61 / 6.39 (trimmed) |
| Command palette | 30 | 10 | 8 (= search icon x) | 34 (= input x) | 10 | default | 6.61 / 6.39 |
| Nav | 30 | 8 | 8 | 34 / **8** | 10 | default | 6.61 / 6.39 |
| Tree view md | 30 | 8 | chevron 8, icon 30 | 52 at level 0 | **6** | **muted L0.510** | **6 / 7** (line box) |
| List box | 30 | 10 | check trailing | – / 10 | – | – | 6.61 / 6.39 |
| Asset row | 56 | – | preview 8 | 60 | 12 | – | name 11/14/500 |
| Token row | **21** | 6 | swatch 5 | 20 | 4 | – | mono 11/14 |
| Tabs (tab) | 30 | 0 / plate 8 | – | 0 / plate 10 | 6 | – | **6 / 7** |
| Pagination page | 30 | 8 | – | centred | – | – | **6 / 7** |

Selected and current paint agree everywhere: selected `L0.973` (dark `L0.240`), current `L0.962` (dark `L0.280`), in
Nav, Tree view, List box, Command palette, Pagination, Stepper's nested Nav. Good.

### 3c. Corner actions (distance from outer edge; glyph vs the surface's text inset)

| Surface (corner) | Control | Top / side | Its corner | Concentric would be | Glyph inset vs text inset |
|---|---|---|---|---|---|
| Dialog (20) | ghost md 30 | 9 / 9 | 8 | 11 (**3 off**) | 16 = 16 ✓ |
| Popover (16) | ghost sm 26 | 7 / 7 | 8 | 9 (**1 off**) | 12 = 12 ✓ |
| Color picker header (16) | ghost sm 26 | 8 / 8 | 8 | 8 ✓ | **13 vs 16** |
| Calendar nav (16) | 26 | 10 / 10 | 8 | 6 (2 off) | – |
| Panel md bar (16) | ghost md 30 | **10 / 14** (not even) | 8 | – | **21 vs 14** |
| Tooltip + Kbd (10) | Kbd md 18 | 4 / 4 | 6 | 6 ✓ | – |

### 3d. Header bars

Panel md 47, Panel sm 39, Menu header 39 (4 + 30 + 4 + 1 rule), Command palette search 44, Color picker 40, the Nav
sidebar demo's header 46 (an unclassed demo div), Dialog and Drawer none (title on the inset).

## 4. Findings, most severe first

### VN1 · defect · Dark floating surfaces draw a two-tone double edge, and nothing else separates them
- **What and where.** In dark every floating surface (Menu, Context menu, Popover, Hover card, Calendar, Color picker,
  Dialog, Confirm dialog, Drawer, Command palette when modal) has fill `L0.085` on a page that samples rgb 1 (the
  surface samples rgb 2), a `border` of white 12.5%, **and** the depth role's dark rim, `0 0 0 1px` white 16%
  (`packages/tokens/src/axes/depth.ts:165–166`, at Floating 8 the rim hits its 16% cap), drawn outside the border.
  Pixels across the menu's edge (`review-VN/menu/default-dark.png`): 1, 1, **42, 42, 31, 31**, 2 — a 2px edge whose
  outer half is brighter than its inner half. Light draws one 1px line (228 on 251). In the dark montage
  (`m-dark1.png`) the Confirm dialog and Popover read as outlined wireframes with a thick rule.
- **Families.** All 12 floating families above; Tooltip draws the rim at 8% and no border (single, fine).
- **Rule.** A surface draws one edge per side in each theme. In dark the rim *is* the floating edge: the border takes
  `max(edge-floating, rim)` and the rim layer is dropped where a border exists (or the rim is drawn `inset` at the
  border's position). Keep the near-black fill (owner's preference).
- **Visible change.** Dark floating edges become a single 1px line at ~16% white; menus stay separated, look crisper.
- **Size** S–M (token derivation + one shared overlay rule). **Confidence** high on the pixels; which of the two lines
  survives is a design call.

### VN2 · defect · A closable horizontal Nav tab covers its own name at rest
- **What.** `nav` tile `horizontal-tabs`: the current tab hugs its label (89.7 wide); the label runs 282.56–334.26,
  the revealed close sits at 316.27–338.27, so 18px of "Item one" are under the close and faded
  (`review-VN/nav/htabs-zoom.png`). The close reveals on current/hover/focus over the name (the app's Figma rule), but
  the app gives its tabs 120–170; the component's default gives none.
- **Rule.** A revealed control never covers text that would fit: a closable tab's minimum inline size is label + gap +
  close (or the tab reserves the close's width while it is current).
- **Visible change.** Current tab grows ~22px; name whole.
- **Size** S. **Confidence** high.

### VN3 · defect · Scroll area's thumbs run into the frame's rounded corner
- **What.** `scroll-area` `layout-both`: frame 98–290 × 36–228, corner 16, viewport clipped at 16; vertical thumb at
  281,39 (6 × 102), horizontal at 101,219 (47 × 6), both 2 from the edge, so their ends sit inside the corner arc and
  are cut (visible in `h/scroll-area-light-0.png`, tiles Horizontal, Both, Always shown).
- **Rule.** A scrollbar track inside a rounded container insets its ends by the container's corner less the thumb's
  side inset (16 − 2 = 14 here), as overlay scrollers do; at radius 0 nothing changes.
- **Families.** Scroll area, and every family whose rounded frame hosts it (Menu's scrolling rows, Command palette
  list's bottom corners, Panel body, Drawer body bottom sheet).
- **Size** S. **Confidence** high.

### VN4 · inconsistency · Corner actions sit three ways, and two are not concentric (confirms S2 and G9, adds two)
- **What.** Table 3c. Glyph-on-inset (Dialog 16 = 16, Popover 12 = 12); plate-on-column (Panel md: ellipsis glyph 21
  from the edge beside a title at 14, and the button sits 10 from the top but 14 from the side); a third, Color picker
  header (`padding 0 7 0 15`, glyph 13 beside text at 16). Concentricity: Dialog 9 from the edge with an 8 corner in a
  20 surface (needs 11), Popover 7 / 8 / 16 (needs 9), Calendar nav 10 / 8 / 16 (needs 6). Tooltip + Kbd is concentric
  (kbd md 18, 4 in, corner 6 = 10 − 4): **S2's Tooltip line is refuted** by the render.
- **Rule.** A ghost icon action in a surface's corner puts its glyph on the surface's text inset and is equidistant
  from the two edges; its plate's corner is `max(radius-floor, corner − distance)`.
- **Visible change.** Panel's ellipsis moves out 7 and up so it sits evenly; Color picker's control moves in 3;
  Dialog/Popover/Calendar plates round 3 / 1 / −2.
- **Size** S–M. **Confidence** high on values.

### VN5 · inconsistency · An overlay's secondary action has three emphases
- **What.** Dialog: ghost Cancel (no fill, ink `L0.452`); Confirm dialog and Drawer: soft Cancel (fill `L0.982`, 7.5%
  edge, ink `L0.277`); Popover teaching step: outline Secondary (edge `L0.913`). Same job (dismiss / secondary beside a
  solid primary), four overlays, three looks side by side (`h/dialog-light-0.png`, `h/confirm-dialog-light-0.png`,
  `h/drawer-light-0.png`, `h/popover-light-0.png`).
- **Rule.** One footer pair for every overlay: secondary = soft neutral (Confirm's, measured from ChatGPT), primary =
  solid (or soft danger); a family departs only with a written reason.
- **Size** S (demos + docs). **Confidence** high on the split; which emphasis is the owner's pick.

### VN6 · inconsistency · Dialog and Confirm dialog part on ink, trim and title position
- **What.** Description ink: Dialog muted `L0.510`, Confirm default `L0.277` (confirm-dialog.css:21, recorded).
  Last-line trim: Confirm trims the description to its baseline (`:22`), so buttons are 14 below the glyphs; Dialog
  does not (description line box 18, footer 14 below it). Title: with a close the title is untrimmed (surface.css:1031)
  and its cap sits ~18.8 below the outer edge (tile `default`: frame 178.5, line box 193.5, trim 3.77); without a close
  it is trimmed to 16 (`no-close`: 179.88 → 195.88). Visibly the title jumps ~2.8px between the two variants.
- **Rule.** Q-T2 ("text that closes a block is read on its glyphs") applies to every title group that ends a header:
  Dialog and Drawer trim the description's end when no body follows, and the close-row centring uses the trimmed
  cap (centre the close on the cap, not the line).
- **Size** S. **Confidence** medium (the ink split is a recorded decision; the trim and the jump are not argued).

### VN7 · inconsistency · Six header bar heights (confirms G6 by render)
Table 3d: 47 / 39 / 39 / 44 / 40 / 46. The palette's 44 search and the Panel's 47 bar stand next to each other in the
app. Rule as G6 (two bars from the control they hold). **M**, high.

### VN8 · inconsistency · Two ways to centre a one-line label
- **What.** Menu, Nav, Command palette, List box and Button labels use the cap-trimmed span (padding 3.25): glyph box
  6.61 from the top, 6.39 from the bottom of a 30 row. Tabs (`area-tabs__label`), Tree view (`area-tree-view__label`),
  Pagination pages, Panel row labels and Tooltip text centre the 18 line box: 6 / 7 (Tooltip 4 / 5 in 26). Every
  second family's text sits 0.6px higher, one device pixel at 2x; Tree view and Nav sit together in the app's sidebar.
- **Rule.** Every one-line label in a control, row or tab uses the trimmed text span; add a cohesion test (text glyph
  top − row top equal across row families).
- **Size** S. **Confidence** high (measured), low visual cost.

### VN9 · inconsistency · Row families agree on height and paint, part on corner, ink, gap and text inset
- **What.** Table 3b. Corner 10 (Menu, Palette, List box: concentric with the 14 list) vs 8 (Nav, Tree view); text-only
  edge 10 (Menu, List box) vs 8 (Nav); icon ink default (Menu, Nav, Palette) vs muted (Tree view) (confirms T11);
  icon→label 10 vs 6 (Tree view, recorded); Asset row 56 with an 11/14/500 name, Token row 21 with 11 mono.
- **Rule.** Write the row table into DESIGN_SYSTEM: corner = list-row inside a floating list, row on a region (state
  why); text-only edge one value for both; one row-icon ink (T11). Asset row name at the row size (12 or 13).
- **Size** S–M. **Confidence** high.

### VN10 · refinement · Plate tabs don't hang their plate, so labels leave the content column
- **What.** Underline Tabs pull the list out by 8 so the first label sits on the panel's text (tab 91.63 = panel
  91.63). Plate Tabs (`selection-plate`) start the plate at the panel edge (75.63), so the label sits at 85.63, 10
  right of "Body text" (75.63). The Nav sidebar demo shows the system's own rule: title, text-only rows and icons all on
  x 280.
- **Rule.** A plate-style selection in a strip hangs its plate by its own padding so the first label is on the
  content column (as underline Tabs and Nav rows do).
- **Families.** Tabs plate, Tabs plate sm; check Segmented when used as tabs.
- **Size** S. **Confidence** medium (Tabs plate was the owner's 2026-11-06 pick; hang not discussed).

### VN11 · refinement · Menu's inactive row inverts its own hierarchy
- **What.** `menu` `state-inactive`: the title is `opacity 0.5` over `L0.277` (≈ L0.64 effective) while its note stays
  `L0.510` at full strength (surface.css:1339–1340, recorded: "the note is read to know why"). The secondary line is
  darker than the primary (`h/menu-light-1.png`, Inactive).
- **Rule.** A dimmed row dims as a whole; the reason line is kept legible by sitting at muted ink without extra
  opacity, never darker than the title (title muted ink, note muted ink, or both full with a lock mark).
- **Size** S. **Confidence** medium.

### VN12 · refinement · Pagination draws Previous/Next and the pages in two inks
- **What.** Previous / Next are ghost Buttons, ink `oklab 0.452`; page numbers are `L0.510` at 500; current `L0.277`
  on `L0.962`. Two greys for siblings in one bar. Page glyphs also sit 6 / 7 (VN8).
- **Rule.** One ink for a bar's inactive items: pages take the ghost Button ink (or Previous/Next take muted).
- **Size** S. **Confidence** high.

### VN13 · refinement · Calendar's day numerals are 11 in 30 cells (confirms type-ink)
`calendar.css:105` reads `text-xs` = 11/14 while its comment (`:96`) says 12/16; weekday labels also 11. Beside the 13
title and in 30-tall days the grid reads small (`h/calendar-light-0.png`). Fix per type-ink (12 or 13, owner pick). **S**.

### VN14 · refinement · Stepper connectors at the divider's 7.5% vanish, most in dark
Horizontal connector is a 1px `::after` at 7.5% alpha (`stepper.css:136`), ~38px long; in dark ≈ rgb 19 on rgb 1
(`m-dark2.png`, Descriptions). A progress line carries meaning. **Rule:** connectors use the control stroke (`stroke-control`)
and completed segments the default ink. **S**, medium.

### VN15 · refinement · A scrolling Dialog body cuts text with no cue below
`dialog` `scrollable`: body clips at y 324 through "Body text 6" (line 311–329); the header rule appears only after
scrolling (`data-scrolled`), the footer stays undivided by decision (dialog.md:98). At rest nothing says there is more.
**Rule:** mirror the header rule at the footer while the body can scroll further (`data-scroll-end` off), or a 16px fade.
**S**, medium (it reopens a recorded exclusion).

### VN16 · refinement · Panel's inspector rows sit on two column grids
`panel` `default`: Position row controls span 212 (X 290–~395, Y ~400–502); Dimensions row controls span 174 with a
30 action column at 472, so W/H's second column starts left of Y's (`h/panel-light-0.png`). **Rule:** a section with any
row action reserves the action column on every row, so fields share columns (the reference inspector's grid). **S–M**, medium.

### VN17 · refinement · Panel's bar to first section is loose
Bar 47 (title cap 56.4–65.6) then the first heading's 8 top pad and 30 row: "Position" cap starts ≈ 102, ~36 below the
title's cap, against 22–30 between later labels. With VN7's bar fix, the first section's heading drops its top pad.
**S**, medium.

### VN18 · inconsistency · Token row's default (soft) style has a stronger edge than its Outline style
Default: fill `L0.982` + 1px `oklab 0.858`; Outline: no fill + `oklab 0.901`. The filled variant carries the darker
line, so "outline" looks lighter than "soft". Row height 21 is off the control ladder. **Rule:** soft = fill with the
soft edge (7.5% alpha, Button soft's), outline = the control edge; height from the ladder (sm 26 or a Kbd/Tag height).
**S**, high on values.

### VN19 · refinement · Tabs' change words paint the label in tone ink
`tabs` `changes`: "File one" (current) orange `oklab 0.524…`, "File two" (not current) green: the unselected tab is as
loud as the selected one, so status ink overrides the selected / unselected ink the strip relies on. **Rule** (with
T12): tone colours the mark (dot, letter), never the label; the label keeps its selection ink. **S**, medium.

### VN20 · refinement · List box grid: heading on no column, grid leaves dead width
`list-box` `content-sections`: heading text at x 44 (10 inset) while cells start at 34 and icons centre at 49; six 46
cells + 2 gaps = 286 in a 320 list, 34 dead at the end. **Rule:** a grid's heading sits on the cell edge (0) or the
icon's edge (15); the grid fills by `auto-fill`. **S**, medium.

### VN21 · inconsistency · "Selected" swatch drawn three ways (confirms S9 by render)
Color swatch picker: dark ring with a gap; its Palette layout: white inner ring plus accent edge; List box swatches:
the selection wash behind the swatch (`h/color-swatch-picker-light-0.png`, `h/list-box-light-0.png`). One rule. **S**.

### VN22 · inconsistency · Modal and list corners (confirms S14 by render)
Command palette 14 beside Dialog/Confirm 20 (both modal); Calendar's caption menu opens a 12 list while Menu is 14.
**S**, medium (design call).

### VN23 · refinement · Nav picture slot is 20 wide (confirms G14)
`content-pictures`: picture 20 × 14, labels at +38 against +34 for icon rows. Also see VN27 (pictures blank). **S**.

### VN24 · refinement · Toggletip's popup is Tooltip's inverse bubble, not a Popover
`toggletip` `state-open`: `area-tooltip area-toggletip__surface`, rgb 40, 26 tall, corner 10. shape-state's census
lists it with Popover; correct the census. Its Link variant puts a link in a 26px inverse bubble: check link ink and
focus ring contrast on rgb 40 (not verifiable here). **S**, medium.

### Gallery and demo defects (not component defects, but they make the system look unfinished)

- **VN25 · defect · Captions drop the space after "a".** "Anchored to atrigger" (popover; `specimens.mjs:851` reads
  "Anchored to a trigger"), "Effects with ahidden row" (property-list), and in other groups: "In atable", "With alabel",
  "In afield", "On alight color", "Segments with alimit", "With aheading and adisabled row", "In aconversation",
  "In adialog", "Value in abutton", "In asurface", "In acard", "In apanel", "In afigure" (index.json labels). The
  transform that drops it was not located. **S**, high.
- **VN26 · defect · Tiles crowd their card.** Pagination `default`, `state-first`, `behavior-links` extent x 1.3 in a
  388 view; File upload 384 in 388 (its side borders merge with the card's); Splitter `layout-end` frame runs past the
  card. Give these tiles a wider card or a narrower demo.
- **VN27 · defect · Demos that show nothing of their state.** Tree view `guides` (guides only on hover/focus,
  tree-view.css:220–221: the tile is identical to Small); Nav `content-pictures` (empty 20 × 14 spans); Nav
  `behavior-sticky-heading` paints a white `bg-surface` slab on the grey tile (needs `--area-nav-pin-fill`); Hover card
  never shows its card; Popover `image` shows a checkerboard; Command palette `preview` shows skeleton bars.
- **VN28 · opportunity · Placeholder copy everywhere.** Every overlay reads Title / Description / Action / Body text;
  Dialog tiles are 472 tall around a 115 dialog. Real copy ("Rename file", "Delete 3 items?") and fitted tiles would
  make the overlays read as product, not specimen.

## 5. Cross-family inconsistencies (summary)

1. Corner actions: three placements, two concentric misses (VN4).
2. Overlay footers: ghost / soft / outline secondary (VN5); Dialog vs Confirm ink and trim (VN6).
3. Header bars: six heights (VN7).
4. Text centring: trimmed vs line box (VN8).
5. Rows: corner 10/8, text edge 10/8, icon ink, Asset/Token row type (VN9).
6. Plate selections that hang vs don't (VN10).
7. Status ink on labels (Tabs) vs marks (Tree view letters) (VN19).
8. Selected swatch three ways (VN21).
9. Group headings: Menu/Nav/List box/Palette muted 500 vs Panel heading default 500 (confirms T3 by render).

## 6. Wave-1 findings checked against the render

| Finding | Render |
|---|---|
| S2 close not concentric | Confirmed Dialog (9/8/20) and Popover (7/8/16); **refuted for Tooltip + Kbd** (4 in, 6 = 10 − 4) |
| S3 open trigger paint | Confirmed for Menu button (pressed plate in `open-submenu`) |
| S9 selected three ways | Confirmed |
| S13 Calendar/Color picker miss material | Not visible at default (shadows identical to Menu); unverifiable without glass |
| S14 corners | Confirmed (palette 14, dialogs 20, caption menu 12) |
| S21 Menu border not counted | Confirmed: rows 5 from the outer edge (menu 130, row 135) |
| G6 header heights | Confirmed (VN7) |
| G9 corner action two ways | Confirmed, and a third way in Color picker (VN4) |
| G14 Nav picture slot | Confirmed |
| G7 Tree 6 / indent 22 | Confirmed (icon 30 → label 52, 22 per level) |
| T3 group heading treatments | Confirmed (Panel heading default ink) |
| T11 row icon ink | Confirmed |
| Calendar 11/14 days (type-ink) | Confirmed |

## 7. Five best-looking (do not disturb)

1. **Command palette**: search icon and row icons on one x (+12 from the frame), input text and labels on one x (+38);
   group labels, kbds and footer hints all aligned. The model for every list surface.
2. **Menu / Context menu**: 30 rows, 10 corners concentric with 14, cap-trimmed labels, shortcut column reserved even
   on rows without one, check column aligned (`Plain and check rows`).
3. **Breadcrumb**: chevron ink 9.5 from the text on both sides, hover plate painted outside the box so the trail stays
   flush; muted ancestors, default current.
4. **Nav sidebar composition**: title, text-only rows and icons on x 280 (16 in), header actions' plates on the rows'
   end column (519), avatar on the same x. The region alignment rule in action.
5. **Color picker**: 16 inset throughout, header control concentric, saved colours and Hex row on the same edges.
   Also the shared paint system: selected/current plates identical across seven families.

## 8. Five weakest and what fixes each

1. **Panel**: one column grid per section (VN16), corner action on the text inset (VN4), bar height and first-section
   pad (VN7, VN17), heading ink per T3.
2. **Tabs**: hang the plate (VN10), trimmed labels (VN8), tone on marks only (VN19).
3. **Dialog family (Dialog, Confirm, Drawer, Popover)**: one footer pair (VN5), trim and title rule (VN6), concentric
   close (VN4), scroll cue (VN15).
4. **Scroll area**: corner-aware track (VN3).
5. **Token row / Pagination / Stepper**: soft vs outline edges and ladder height (VN18); one ink (VN12); visible
   connectors (VN14).

## 9. Counts

28 findings: defect 6 (VN1, VN2, VN3, VN25, VN26, VN27; the last three are gallery/demo), inconsistency 9 (VN4, VN5,
VN6, VN7, VN8, VN9, VN18, VN21, VN22), refinement 12 (VN10–VN17, VN19, VN20, VN23, VN24), opportunity 1 (VN28).
