# Cursor and Figma: how whole UIs are laid out (2026-10-22)

The owner wants skills that direct how Area's components are composed into whole UIs: IDE and editor layouts, canvas
and inspector tools, panels and feeds. This file records how Cursor and Figma lay theirs out, with measured values.
It does not repeat `cursor-audit-2026-10-22.md` (Cursor's type, radius ladder, glass sidebar cells, settings cards) or
the Figma inspector values already in `specs/panel.md`, `specs/resizable-panel.md` and `specs/inspector.md`.

**Tags.** **B** read from an installed bundle (file and selector or constant). **M** measured live with headless Edge
over CDP (`getBoundingClientRect` and computed style; URL and element given) or from an existing capture in
`captures/`. **D** an official Figma document. Lengths are CSS px.

**Builds.** Cursor 3.24.12 (`/Applications/Cursor.app/Contents/Resources/app/out/`). Figma desktop 126.9.13
(`app.asar`, unpacked into the session scratchpad; only its window shell and tab bar live there). Figma's editor and
Community pages were read on figma.com while logged out, at 1440 × 900 unless stated, in light and dark (cookies: Opt
out). Nothing was signed in to, edited or launched. The running Figma desktop app was not touched.

## Cursor

### Window and shell

| Region | Value | Source |
|---|---|---|
| Window default | 1280 × 800; second size 1024 × 768 | B `main.js` `window.js`: `iC`, `aC` |
| Window minimum | 400 × 270; 600 wide with a vertical panel; **Agents window 500 wide** | B `main.js` `pp = {WIDTH:400, WIDTH_WITH_VERTICAL_PANEL:600, WIDTH_GLASS:500, HEIGHT:270}` |
| Titlebar | 35 | B `main.js` `N6=35`; `.part>.title` line-height 35 |
| Traffic lights | `s = floor((barHeight − r) / 2)`, `r` 14 (16 on some macOS versions); position `{x: s + 1, y: s}`, so **x 11, y 10** in a 35 bar | B `main.js` `setWindowButtonPosition` |
| Region order (IDE) | titlebar · activity bar 48 · sidebar · editor groups (tabs 35) · panel · secondary sidebar (agent) · status bar 22 | B `workbench.desktop.main.js` part constructors |
| Agents window ("no titlebar" layout) | the titlebar is a **transparent 34 overlay** (`position: fixed`, `pointer-events: none`); every part pads its top **35** so its own header sits in the titlebar row; the sidebar pads its bottom 22 for the status bar | B `workbench.glass.main.css` `body.no-titlebar-layout …` |
| Agent header | centred, `max-width: var(--composer-max-width, 840px)`; edge inset 8; workspace name 12/18 in the quaternary text colour, centred over the chat | B glass `.auxiliary-bar-title--agent-mode`, `.auxiliary-bar-workspace-name` |
| Layer container | none in CSS: the Agents window is full-bleed parts separated by grounds and strokes; only floating overlays are plates | B glass CSS (no rounded or inset `.part`) |

### Part sizes

| Part | Default | Min | Max | Source |
|---|---|---|---|---|
| Activity bar | 48 | 48 | 48 | B `workbench.parts.activitybar` |
| Sidebar (and the Agents window's unified sidebar) | `min(300, window / 4)` | **214** | none | B `SIDEBAR_SIZE.defaultValue`, `UNIFIED_SIDEBAR_SIZE`, `minimumWidth=214` |
| Secondary sidebar (agent chat) | `min(400, window / 2.5)` | **300** | none | B `AUXILIARYBAR_SIZE.defaultValue`; `get minimumWidth(){return 300}` |
| Panel (terminal) | height / 3 at the bottom, width / 4 at a side | 300 wide, 77 tall | none | B `PANEL_SIZE`, `workbench.parts.panel` |
| Editor | rest | 220 × 70 | none | B `new Tc(220,70)` |
| Status bar | 22 | — | — | B `.part.statusbar{height:22px}`, `HEIGHT=22` |
| Banner | 26 when shown | — | — | B `workbench.parts.banner` `height=26` |

### Headers, nav and tabs

| Element | Value | Source |
|---|---|---|
| View title (`.part>.title`) | 35 tall, padding `0 8`; label padding-left 12, 11px uppercase (sidebar 700, panel 400) | B desktop CSS |
| Pane header (Explorer sections) | 22 tall, 11/700 uppercase; collapsed horizontal pane 22 wide | B `.monaco-pane-view .pane>.pane-header` |
| Agent title tabs | padding `3 6`, radius 6, weight 400; title actions padding 4, radius 6 | B glass `.auxiliary-bar-title--agent-mode` |
| Tree rows | 22; **indent 8** (setting range 4–40); twistie 16 + 6; indent guides on hover | B `workbench.tree.indent` default 8; `.monaco-tl-twistie` |
| Editor tabs | 35 (compact density 22); padding-left 10; fit 120 wide; fixed 50–160; shrink min 80; pinned compact 38; actions slot 28 | B `EDITOR_TAB_HEIGHT={normal:35,compact:22}`, `.tabs-container>.tab.*` |
| Status bar items | 12px, 22 line; padding `0 5`; first and last item 7 from the window edge | B `.part.statusbar>.items-container>.statusbar-item` |
| Diff mode bar (agent review) | min 26, padding `4 12`, gap 8; buttons 11px, padding `2 8`, radius 4, max 150 | B glass `.agent-layout-multi-diff-mode-switcher` |

### Split and resize

| Element | Value | Source |
|---|---|---|
| Sash | 4 wide, hover line 4, cursor `ew-resize` / `ns-resize`; corner handles 8 × 8 | B `:root{--vscode-sash-size:4px}`, `.monaco-sash` |
| Division | parts are a grid of split views; each part declares min / max, and default sizes come from the window size (see Part sizes) | B layout state keys |

### Floating layers

| Layer | Width | Position | Shape | Inside | Source |
|---|---|---|---|---|---|
| Quick input / command palette | `min(62% of window, 580)` (VS Code 600) | top = titlebar offset, centred | radius 8, no border, `--cursor-box-shadow-xl` | header padding 4 top and bottom; list line 22, max 440 tall; rows inset 5 a side, radius 6, entry padding `0 2` | B `.quick-input-widget`, `--quick-input-width:580px`; JS `Math.min(width*.62, …)` |
| Notification toast | list width (JS) | bottom 25, right 3 (3 and 3 without a status bar); toast margin 6 | radius 6, 1px border, `backdrop-filter: blur(40px)`, gap 10 | buttons 12px, padding `1 6`, radius 3 | B `.notifications-toasts`, `.notification-toast` |
| Notification centre | — | bottom 33, right 11 | radius 4 | header 28 (VS Code 35), padding `0 9 0 12` | B `.notifications-center` |
| Hover | max 500 | at the target | — | padding `4 8`; status row 22 | B `.monaco-hover` |
| Suggest widget | 430 | under the caret | radius 3, 1px border | — | B `.suggest-widget` |
| Find widget | — | top-right of the editor | 33 tall, bottom corners 4, `0 0 8px 2px` shadow | inputs 25 | B `.find-widget` |
| Canvas zoom overlay (agent canvas) | content | **bottom 12, right 12** | radius 8, 1px border, popup shadow | padding 4, gap 2; fades in 120ms on hover | B glass `.canvas-zoom-overlay` |
| Dropdown menu | min 160, 4 below the trigger | — | radius 6, 1px border | items padding `5 8` | B `.solid-dropdown-menu` |
| Mentions menu | 250 | at the caret | — | — | B `.mentions-menu` |
| Menu row (Monaco) | — | — | radius 4 | 13px, line 26, padding `0 10`, gap 8 | B `.monaco-menu-option` |

**Shadows** (B desktop CSS): every Cursor shadow starts with a 1px ring in the widget border colour, then blur layers.
`sm` ring + `0 2 8`; `base` ring + `0 0 4` + `0 8 24 −2`; `lg` ring + `0 0 4` + `0 16 24`; `xl` ring + `0 0 4` + `0 12 24`
+ `0 24 36`; the "workbench" shadow round an empty composer is `0 0 8 2` at 40% of the widget shadow.

## Figma

### Desktop shell (window and tab bar)

| Element | Value | Source |
|---|---|---|
| Window | default 1400 × 900, **min 900 × 600**; frameless, `titleBarStyle: hidden`, vibrancy | B `main.js` `w2={width:1400,height:900,minWidth:900,minHeight:600}` |
| Traffic lights | `{x: 12, y: 11}` or `{x: 12, y: 12}` by macOS version | B `main.js` `trafficLightPosition` |
| Tab bar | **38** including a 1px translucent bottom rule; a 10 drag strip along the top | B `desktop_shell.css` `.tab_bar--container`, `--draggableTopRegionElement` |
| Traffic-light spacer | 80, with a rule on its right | B `.tab_bar--trafficLightsSpacer` |
| Home and Community tabs | 40 × 38, icon only | B `.tab--fileBrowserTab`, `.tab--communityTab` |
| File tabs | 38 tall, 11px weight 500, secondary text; gap 8; button padding `0 8`; a rule after each tab; text max 200, faded out over its last 8 with a mask; min 40 | B `.tab--tab`, `.tab--tabTextContainer`, `.file_tab--fileTab` |
| Active tab | bottom border in a 10% mix of the opposite colour; hover fills `bg` | B `.tab--activeTab` |
| Grouped tabs | 24 tall, radius 5, margin `0 2`; last in group padding-right 12 | B `.tab--isInTabGroup .tab--tab` |
| New tab button | 24, radius 5, margin `0 7` | B `.tab_bar--newTabButtonUI3` |
| Windows caption buttons | 50 × 38 | B `.tab_bar--captionButton` |

**Tokens** in the same stylesheet (B `desktop_shell.css`, the product library Figma's UI is built from):
- spacer 4 / 8 / 12 / 16 / 24 / 32 / 40 (`--spacer-1` … `--spacer-6`, `--spacer-2-5` = 12);
- radius small 2, medium 5, large 13, full;
- type body-small 9/14, body-medium **11/16**, body-large 13/22, heading-small 13/22 strong, heading-medium 15/25,
  heading-large 24/32, display 48/56; weights default 400 or 450, strong 500 or 550 (two sets; which context uses
  which was not traced);
- elevation 100–500, light and dark (dark adds an inset white 0.5px top and ring):

| Elevation | Light |
|---|---|
| 100 | `0 1 3 #00000026, 0 0 .5 #0000004d` |
| 200 | `0 1 3 #0000001a, 0 3 8 #0000001a, 0 0 .5 #0000002e` |
| 300 | `0 1 3 #0000001a, 0 5 12 #00000021, 0 0 .5 #00000026` |
| 400 | `0 2 5 #00000026, 0 10 16 #0000001f, 0 0 .5 #0000001f` |
| 500 | `0 2 5 #00000026, 0 10 24 #0000002e, 0 0 .5 #00000014` |

### Editor shell (UI3)

Figma first shipped UI3 with floating panels, then reattached them: they "cramped the canvas, especially on smaller
screens" and slowed people down. Panels are fixed and resizable; floating panels remain only in **Minimize UI**; the
toolbar floats at the bottom in every product (D, Figma blog "Our approach to designing UI3").

Measured in a public file opened logged out (`figma.com/design/Gj9iMcTbFbHrFq1ZWbDBuyc9/…`), which opens minimized:

| Layer | Box | Shape | Inside | Source |
|---|---|---|---|---|
| Left island (file name, expand) | **12 from the top and left**, 278 × 48 | radius **13**, no border, elevation-100-like `0 0 1 .3, 0 1 3 .15`; dark `#2c2c2c` plus inset white `0 1 0 .1` and `0 0 1 .3` | padding 8 round a 32 button | M `.left_panel_island_container--islandContainer` |
| Right island (avatar, zoom, play, Share) | 12 from the top and right, 268 × 48 | same | padding `4 8`, gap 8; Share 32 tall, radius 5, 1px 10% outline | M `.fullscreen_view--rightPanelLoggedOutDesignContainer` |
| Toolbar | 497 × 48, **12 from the bottom**, centred on the window (it stays there when the left panel opens) | radius 13, elevation-200 | tools 32 (radius 5, icon 24); groups 8 apart; a tool and its 16-wide chevron 1 apart; mode switch 92 × 32 (radius 5, padding 2, fill `#f5f5f5`; options 28, radius 3, gap 2; white thumb on elevation-100) | M `[role=toolbar][aria-label=Editor]`; `captures/toolbar/figma--*` |
| Help button | 32 circle, 24 from the right, 20 from the bottom | elevation-200 | — | M `.help_widget--helpWidget` |

Expanded (the island's "Expand UI"):

| Region | Value | Source |
|---|---|---|
| Navigation rail | 56 + 1px rule (`#e6e6e6`; dark `#444`); padding `8 0 16`; tabs 56 × 56 (padding `4 0`, gap 2): icon plate 32, radius 5, selected `#e5f4ff` (dark `rgb(57,67,96)`), label 9px 450 | M `[aria-label="Navigation Bar"]` |
| Left panel | **240** + 1px edge `rgba(0,0,0,.1)` (dark white .1), full height, no radius, no shadow; resize **240–443** ("240 pixels (min)"), handle 8 wide across the edge, cursor `e-resize` at the minimum | M `.left_panel_container--panel`, `[aria-label="Resize handle"]` |
| Panel header | **49** = 48 + rule; padding `0 16 8`; one 32 row 8 from the top: file name 13/22 550, file menu 24, Minimize UI 32 | M `.left_panel_header_components--container` |
| Section title (Pages, Layers) | 40 tall rows; Find 24 at the end | M `h2` rows at y 49 and 130 |
| Pages / Layers split | a vertical resize between them (8-tall handle, `ns-resize`); Pages section ruled below | M `role=slider` 240 × 8 |
| Page rows | 32 rows; plate 224 × 24, **8 in**, radius 5; current `#f5f5f5` (dark `#383838`) at 550; text 16 from the panel edge | M `.pageRowButton` |
| Layer rows | 32 pitch; caret 24 box 8 in; type icon 16 at 28 in (30% ink); name 52 in; **indent 16 per level** | M rows; `captures/tree-view/figma--layer-row--selected` |
| Ground | panels `#fff` / dark `#2c2c2c`; section rules `#e6e6e6` / `#444`; the canvas is WebGL, its colour not readable | M |
| Properties panel | 240 (241–500); header 48 holding panel tabs (24 tall, radius 5, gap 4; active `#f5f5f5` at 550, others 450 at 50% ink); section title rows 40; rows 32 with 24 fields; insets 16 start, 8 end; rules midway, 16 below the last field and 16 to the next title's cap | M `captures/inspector/figma--design-panel-frame`, `segmented/figma--panel-tabs`; `specs/panel.md` |

Responsive: down to a 700 window the islands, toolbar and the 240 panel keep their sizes; nothing collapses (M at
1024 and 700). The desktop app's 900 minimum keeps this from mattering there.

### Floating layers

| Layer | Size | Shape | Inside | Source |
|---|---|---|---|---|
| Menus (main, zoom) | 194–199 wide | radius 13, **dark `#1e1e1e` in both themes**, elevation-400 | 8 above and below; rows 24, plate inset 8, radius 5; separators 8 tall; shortcuts at 70% white; 4 below the trigger, end-aligned | M `captures/menu/figma--main-menu`, `zoom-control/figma--zoom-menu` |
| Popovers (text style, colour) | 240 or 304 | radius 13, white, elevation-400 | header 40 with an inset 1px bottom rule, title 550 at 16 in, close 24 at 8 from the edge | M `captures/compact/figma--sectioned-popover`, `figma--color-picker` |
| Tooltip | max 300 | 24 tall, radius 5, `#1e1e1e`, dark elevation | padding `4 8`, 11/16 450 | M `captures/tooltip/figma--tooltip--open--dark` |

### Community feed (figma.com/community)

| Part | 1440 | 1024 | 768 | 390 | Source |
|---|---|---|---|---|---|
| Page gutter (container padding) | 32, content max **1216** (so 112) | 32 | 32 | 24 | M `.homepage--homepageContainer`, `--homepageContent` |
| Section stack gap | **96** | 96 | 96 | 64 | M `.homepage--homepageSectionsContainer` |
| Resource tiles | 3 × 384, gap **32** | 2 × 464 | 2 × 336 | carousel, 282 | M `.resource_tile_group--resourceTileGroup` |
| List cards (Skills) | 2 × 592, gap 16 row / 32 column | 1 column, gap 16 | 1 | 1 | M grid of 96-tall cards |
| Category cards | 3 × 384 × 238, gap 32 | 3 × 299 | 2 × 336 | 1, gap 16 | M `.homepage_categories_highlight` |
| Small link list | 3 × 395, gap 16 | 3 × 309 | 2 × 344 | 1 | M `ul` grid |
| Footer columns | 5 × 218, gap 32 | 5 | 3 | 2 × 143 | M `.footer--sectionsContainerFiveColumn` |

| Element | Value | Source |
|---|---|---|
| Header | sticky, 48 + 1px rule `#e6e6e6`; logo link first; category nav items 32 tall, radius 5, padding `0 12`, 13/24 500; Log in, Sign up at the end | M `.navbar--navbarContainer`, `nav[aria-label="Community navigation"]` |
| Hero | padding `96 0 78` (390: `24 0 64`); h1 24/32 500 (390: 20/28 600); search pill 320 × 40, radius full, `#f5f5f5`, 11px placeholder | M `.hero--hero` |
| Featured carousel | 1216 × 187 frame: radius **15**, 1px `#e6e6e6`, padding 4, round an inner slide of radius **12**; text 24 in, title 16/24 600, body 13/22 450, 80 between text and image; dots in a 56 × 17 pill (radius full, 1px border) | M slide frame at (112, 375) |
| Section header | title 13/22 550; subtitle 11/16 450 at 50% ink; "Browse …" link 11/16 in blue at the end; 16 above the grid | M `h3` + `xdpxx8g` |
| Resource tile | 1px wrapper padding, tile padding `10 0`; thumbnail **16:9** (382 × 214.9 via padding-top), radius 6, a **1px ring `#e6e6e6` drawn as box-shadow**, `object-fit: cover`; type badge 24 (radius 6) 12 in from the thumbnail's bottom-left; meta row 8 below: title 13/24 500, author and price 11/16 at 50% ink, like and use counts at the end (gap 10) | M `.resource_tile`, `.tile_meta--*` |
| List card | 96 tall, radius 13, padding 8; icon tile 48, radius 13, 1px 10% border; 16 between icon and text; title 13/16 550, meta 11/16 450, description 11/16 at 50%; button 32, radius 5, padding `0 12`, 1px 10% border | M first Skills card |
| Footer | border-top `#e6e6e6`, padding `48 0` (390: `24 24 32 0`); links 13/24 | M footer |

**Phone carousel** (M at 390 × 844, `resourceTileGroupCarousel`): the row bleeds to 4 from the screen edge (20 into the
24 gutter); `overflow-x: scroll`, `scroll-snap-type: x mandatory`, `scroll-padding-left: 20`; tiles 282 with
`snap-align: start`, gap 16; the first tile has a 20 margin so it lines up with the 24 gutter, the last 20 after it.
The next tile peeks 68. No arrows.

**Resource page** (M, a community file's page at 1440):
- Breadcrumb 13/24 at 50% ink, gap 4; its 64-tall bar starts 40 below the header.
- Hero split: text column inset 32 from the content edge, then the preview 746.7 × 373.3 (**2:1**, radius 6, 1px
  `#e6e6e6`) with a 32 fullscreen button (dark, radius 6, elevation) in its corner.
- Creator avatar 32, round, 1px white ring; h1 24/32 600; meta 13/24 at 50%; primary action 40 tall, radius 6, padding
  `12 16`, 14/24 600 on `#0d99ff`.
- In-page tabs: 35 tall bar, tabs 32 apart, active 14/24 600 with 8 under the text.
- Body: padding 32; main column 942, aside 224 (50 between); prose 14/24, headings 18/24 700; tags 24 tall, radius 4,
  inset 1px ring, padding `4 12`.

**File browser card** (logged in, from a capture: M `captures/card/figma--file-card--rest--light`): 274.75 × 214.4, radius
13; thumbnail 272.75 × 153.4 (**16:9**) inside a 1px edge; overlay actions top-right 16 in; footer 59: padding 16, file
icon 16, gap 12, title 11/16 and meta 11/16 450 at 50% ink, 2 apart.

## Patterns worth adopting

Rules a layout skill can direct, with the values that back them.

1. **Pick the shell by the work.**
   - Docked shell for tools used all day (IDE, inspector editor): full-height regions, no radius, one 1px rule where
     regions meet. Figma moved back to this for speed and canvas room (D).
   - Layered shell for canvas-first or focus modes: chrome sits in islands over the canvas, **12 from every window
     edge**, radius 13, padding 8 round 32 controls (48 tall), light elevation (Figma). Only the toolbar floats in both.
2. **Concentric corners.** An island's corner is its control's corner plus its padding: Figma 5 + 8 = 13; the community
   banner 12 + 4 (inside a 1px edge) = 15. Write the outer radius from the inner, never pick it.
3. **Bars are a control plus even air.** Figma's panel header 48 = 8 + 32 + 8 (+1 rule); its islands 48; Cursor's bars
   35 round 24 controls. Every bar in a window shares one height so their rules line up (Figma's panel header and
   islands are both 48).
4. **Panel widths have a default, a floor and a ceiling.**

   | Panel | Default | Min | Max |
   |---|---|---|---|
   | Navigation (layers, files) | 240 (Figma); `min(300, window/4)` (Cursor) | 240 / 214 | 443 (Figma) |
   | Inspector | 240 | 241 | 500 |
   | Agent / chat side panel | `min(400, window/2.5)` | 300 | — |
   | Bottom panel | window height / 3 | 77 tall | — |
   | Main editor / canvas | the rest | 220 × 70 | — |

   An icon rail outside the nav panel is 48 (Cursor) to 56 (Figma) wide.
5. **Rows: plate inset, pitch and indent.** Navigation rows sit on a pitch (Figma 32, Cursor tree 22) with the hover
   or current plate inset 8 from the panel edge, radius 5–6, text 16 from the edge. Indent per level: 16 (Figma), 8
   (Cursor's default). The caret takes its own 24 (Figma) or 16 (Cursor) box before the icon.
6. **Sections inside panels.** A title row (Figma 40; Cursor pane header 22, 11/700 uppercase in the VS Code chrome,
   sentence case on Cursor's own surfaces), then rows; sections divided by one rule with equal air on both sides
   (Figma 16 / 16). Section actions sit at the title row's end, 24 square.
7. **Spacing grows outward.** Inside a control 2–4 (segment gap 2, tool to chevron 1); between controls 4–8; island
   inset 12; page gutter 24 (phone) to 32; content cap 1216; between feed sections 96 (64 on a phone). Figma's scale
   is 4 / 8 / 12 / 16 / 24 / 32 / 40.
8. **Floating layers keep fixed offsets from what they belong to.**

   | Layer | Offset |
   |---|---|
   | Bottom toolbar | centred, 12 from the bottom |
   | Corner overlay (zoom, help) | 12 (Cursor) or 20–24 (Figma help) from the corner |
   | Menu, dropdown | 4 from the trigger, end-aligned |
   | Toasts | bottom-right, 3–11 from the edge, above the status bar |
   | Command palette | under the titlebar, centred, `min(62% of window, 580–600)` wide |

   Menus are radius 8 (Cursor) to 13 (Figma) with 24–26 rows inset 5–8; popovers carry a 40 header with a rule.
9. **Elevation by layer, not by component.** Islands and segmented thumbs elevation-100; toolbar and help 200; menus,
   popovers and dialogs 400–500. Cursor's shadows begin with a 1px ring so the edge reads without a border. In dark,
   Figma adds a 0.5–1px inset white top highlight instead of a heavier shadow, and keeps menus and tooltips dark in
   both themes.
10. **Titlebar integration.** Either merge the titlebar into the panel headers (Cursor's Agents window: a 34 transparent
    drag overlay, every part's header in that row, traffic lights at `floor((h − 14) / 2)`), or keep a separate tab
    strip (Figma desktop: 38 tall, an 80 spacer for the traffic lights at 12, 11–12). Never both.
11. **Feeds and cards.**
    - Cap content at 1216 with 32 gutters; 3 columns where each card is at least about 380, 2 at tablet widths, 1 or a
      carousel on a phone.
    - Card gap 32 for media tiles, 16 for list cards (row) and 32 between their columns.
    - Thumbnails 16:9 (tiles, file cards) or 2:1 (a resource hero), `object-fit: cover`, radius 6 on a feed and 13 for
      a standalone card, edged by a **1px ring as a shadow**, not a border, so the image keeps its size.
    - Meta under the image: title one step up (13/24 500), meta one step down at 50% ink (11/16).
12. **Phone carousels.** Scroll-snap `x mandatory`, items aligned to the page gutter by a first-item margin and a
    matching `scroll-padding`, a 16 gap, and a visible peek (68 at 390). No arrows on touch.
13. **Text tiers come from size and ink, with half weights.** Figma's UI is 11/16 at 450, headings 13/22 at 550, page
    titles 24/32; muted text is the same ink at 50%. Cursor's IDE chrome labels are 11px uppercase; its own surfaces use
    sentence case and colour (see `cursor-audit-2026-10-22.md`).
14. **Resize affordance.** A 4 (Cursor) to 8 (Figma) hit area across the edge, cursor only at rest, a hover line in
    Cursor; at a limit Figma switches to a one-way cursor and announces "(min)".
15. **Status bar.** 22 tall, 12px, items padding `0 5`, the first and last 7 from the edge (Cursor). Figma has none:
    its bottom edge belongs to the toolbar.

## Not measured

- Figma's file browser (needs sign-in): only the file card from an earlier capture; grid, sidebar and header not
  measured.
- Figma's canvas colour (WebGL) and the docked properties panel live (absent when logged out); its values come from
  earlier logged-in captures.
- Which of Figma's two weight sets (400 / 450, 500 / 550) applies where: both are in `desktop_shell.css`; the editor
  and Community computed 450 and 550.
- Figma desktop's file-tab widths: set by script, not CSS (looked in `desktop_shell.css` and `desktop_shell.js`).
- Cursor's notification toast width, the Agents window's default size (`HEIGHT_GLASS: 520` is declared but not traced
  to a use), and Cursor's light and dark grounds (theme-driven, not in CSS).
- Figma Community has no dark theme in this pass (measured light only); the editor was measured in both.

## Sources

- Cursor 3.24.12: `/Applications/Cursor.app/Contents/Resources/app/out/main.js`; `vs/workbench/workbench.desktop.main.css`
  and `.js`; `vs/workbench/workbench.glass.main.css`.
- Figma desktop 126.9.13: `/Applications/Figma.app/Contents/Resources/app.asar` → `main.js`, `desktop_shell.css`.
- figma.com, logged out, headless Edge 155 over CDP: `/community` (1440, 1024, 768, 390), `/community/design-resources`,
  a community file page, and the public file `/design/Gj9iMcTbFbHrFq1ZWbDBuyc9/` (1440, 1024, 700; light and dark).
  Scripts in the session scratchpad (`scripts-cursor-figma/`).
- Captures: `captures/toolbar/figma--*`, `tree-view/figma--layer-row--*`, `inspector/figma--design-panel-frame`,
  `segmented/figma--panel-tabs`, `menu/figma--main-menu`, `zoom-control/figma--zoom-menu`,
  `compact/figma--sectioned-popover`, `compact/figma--color-picker`, `tooltip/figma--tooltip`, `card/figma--file-card`.
- D: Figma, "Figma on Figma: Our approach to designing UI3", https://www.figma.com/blog/our-approach-to-designing-ui3/;
  Figma Help, "Explore the navigation bar and left sidebar",
  https://help.figma.com/hc/en-us/articles/360039831974-Explore-the-navigation-bar-and-left-sidebar.
