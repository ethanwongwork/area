# Layout in design systems, 2026-10-22

How published design systems define whole-UI layout: shells, grids, region spacing, panes, headers, content widths,
card grids and carousels. It is a reference for the skills that compose Area components into screens. Other files in
this folder measure products; this one records only the systems' own rules. Surface and Stack equivalents are already
in `docs/research/layout-primitives-2026-10-20.md` and are not repeated.

Tags: **D** read from the rendered docs page (URL in Sources), **S** read from source at the pinned commit in Sources.
"Not documented" means the pages and files listed under Sources do not say. Values are in px (dp and pt are treated as
equal to px). Nothing here is copied into the repo as code.

## Breakpoints

| System | Steps (min width) | What changes | Tag |
|---|---|---|---|
| Material 3 | compact <600, medium 600–839, expanded 840–1199, large 1200–1599, extra-large ≥1600 | margins, pane count, navigation type | D m3-bp |
| Apple | size classes compact / regular per axis; no pixel values | tab bar ↔ sidebar, pane count | D hig-layout |
| Fluent 2 | small 320–479, medium 480–639, large 640–1023, x-large 1024–1365, xx-large 1366–1919, xxx-large ≥1920 | reposition, resize, reflow, show/hide, re-architect | D fluent-layout |
| Carbon | sm 320, md 672, lg 1056, xlg 1312, max 1584 | columns 4 / 8 / 16 / 16 / 16; margin | S carbon-grid |
| Primer | 320, 544, 768, 1012, 1280, 1400 | pane widths at 768 and 1012; padding at 1012 | S primer-bp, primer-pl |
| Polaris | xs 0, sm 490, md 768, lg 1040, xl 1440 | page padding at sm; grid 6 → 12 columns at lg | S polaris-bp, polaris-grid |
| Atlassian | xxs 320–479, xs 480–767, s 768–1023, m 1024–1439, l 1440–1767, xl ≥1768 | columns 2 / 6 / 6 / 12 / 12 / 12; side nav inline from 1024 | D ads-grid, S ads-nav |
| Radix Themes | xs 520, sm 768, md 1024, lg 1280, xl 1640 | responsive props only | S radix-bp |
| Mantine | xs 576, sm 768, md 992, lg 1200, xl 1408 (36 / 48 / 62 / 75 / 88 em) | AppShell navbar collapses below its `breakpoint` | S mantine-theme |
| Tailwind / shadcn / Untitled | sm 640, md 768, lg 1024, xl 1280, 2xl 1536; Untitled adds xxs 320, xs 600 | shadcn sidebar becomes a sheet below 768; Untitled sidebar is fixed from lg (1024) | S tw-theme, shadcn-mobile, untitled-theme |
| Geist | "3 breakpoints"; values not documented | Grid columns and rows per breakpoint | D geist-grid |

Breakpoints are viewport-based everywhere except Atlassian's note that the grid ignores side nav and panels ("based on
the viewport width, not the width of the main content area") and Android's size classes, which are window-based (D
android-wsc). shadcn's dashboard block uses container queries for its card grid instead (S shadcn-dash).

## Columns, gutters and outer margins

| System | Columns | Gutter | Outer margin | Tag |
|---|---|---|---|---|
| Material 3 | panes, not columns | spacer between panes 24 (0 when one pane) | 16 compact; 24 medium and up | D m3-bp, S m3-psd |
| Carbon | 4 / 8 / 16 | 32 (16 each side, "wide"); 1 ("condensed") | 0 sm; 16 md–xlg; 24 max | S carbon-grid, D carbon-2x |
| Atlassian | 2 / 6 / 12 | 12 below 1024; 16 from 1024 | 16 below 1024; 32 from 1024 | D ads-grid |
| Polaris | Grid: 6 below lg, 12 from lg | 16 | page padding 0 below sm, 24 from sm | S polaris-grid, polaris-page |
| Fluent 2 | 12 recommended | "multiple of the base unit"; not fixed | "fixed or percentage-based"; not fixed | D fluent-layout |
| Primer | none (PageLayout regions) | column and row gap 16, 24 from 1012 | padding 16, 24 from 1012 | S primer-pl |
| Apple | none | none | layout guides and safe areas; tvOS 80 sides, 60 top/bottom | D hig-layout |

Atlassian aligns only top-level containers (cards, images, text blocks, tables, forms) to columns; "small elements,
like buttons and icons, do not need to align to this grid", and overlays sit outside it (D ads-grid). Carbon builds
everything from an 8 "mini unit" (D carbon-2x).

## Content max widths

| System | Widths | Default | Tag |
|---|---|---|---|
| Atlassian | fixed-wide 1296, fixed-narrow 864 (margins included), fluid | fixed-wide; narrow for articles; fluid for boards and whiteboards | D ads-grid |
| Primer PageLayout | medium 768, large 1012, xlarge 1280, full | xlarge; SplitPageLayout content is large | S primer-pl, primer-split |
| Polaris Page | default 662 + 320 + 16 = 998; narrow 662; full width | default; s-page `small` for forms, `large` for dashboards | S polaris-vars, polaris-mixin, D polaris-page |
| Radix Container | 448, 688, 880, 1136 | 1136 (size 4) | S radix-container |
| Mantine Container | 540, 720, 960, 1140, 1320; padding-inline 16 | 960 (md) | S mantine-container |
| Untitled UI | container 1280, padding-inline 32 in the header nav | 1280 | S untitled-theme, untitled-header |
| Tailwind | 3xs 256 … 3xl 768, 4xl 896, 5xl 1024, 6xl 1152, 7xl 1280; `container` = max-width of the current breakpoint, no centring or padding | none | S tw-theme, D tw-container |
| Material 3 | not documented; large and extra-large ask to watch line length | — | D m3-bp |

Mantine's Container also has a `grid` strategy: `1fr min(100%, size) 1fr`, where a `data-breakout` child spans the full
width and its inner container returns to the size (S mantine-container). This is the standard full-bleed pattern.

## Shell regions

| System | Top bar | Navigation expanded / collapsed | Side panel or aside | Collapse rule | Tag |
|---|---|---|---|---|---|
| Material 3 | not specified | drawer 360; rail expanded 220–360; rail collapsed 96 (narrow 80); bottom bar 64 (tall 80) | fixed pane 360 (expanded), 412 (large+); side sheet max 400 as a third pane at extra-large | compact: bar; medium: rail (one pane) or bar (two panes); expanded+: rail | S m3-nav, D m3-bp |
| Apple | toolbar; title under 15 characters; at most 3 groups | sidebar; widths not documented; macOS row size small / medium / large is a user setting | inspector as a split-view pane; divider 1 pt ("thin") | regular width: sidebar; compact: tab bar (5 tabs or fewer by default) | D hig-toolbars, hig-sidebars, hig-split, hig-tabbars |
| Fluent 2 | not documented | NavDrawer 260 | Drawer small 320, medium 592, large 940, full | not documented | S fluent-nav, fluent-drawer |
| Carbon | header 48 | side nav 256; rail 48 | header panel 256 | side nav overlays below lg (1056) | S carbon-shell |
| Primer | Header region | Pane small / medium / large: 240 / 256 / 256 from 768; 256 / 296 / 320 from 1012; min 256 | pane max = viewport − 511 (− 959 from 1280) | stacks below 768 | S primer-pl |
| Polaris | top bar 56 | navigation 240 | Layout secondary 240–320 | page padding drops below sm | S polaris-vars |
| Atlassian | top nav 48 (56 behind a flag), padding-inline 12, gap 8, 1 px bottom rule | side nav default 320, min 240, max 50vw | aside default 330; panel default 365 (400 with chat), min 320; main min 320 | side nav inline from 1024, overlay below | S ads-nav |
| Mantine | header height set per app (docs: 60) | navbar set per app (docs: 300, breakpoint sm) | aside, same config as navbar | below `breakpoint` the navbar is 100% wide and uses `collapsed.mobile` | S mantine-appshell, D mantine-appshell |
| shadcn/ui | dashboard header 48 (`--header-height`), border-b, padding-inline 16 / 24 from lg | 256 (16rem); icon 48 (3rem); mobile sheet 288 (18rem); dashboard block overrides 288 | — | sheet below 768; Cmd/Ctrl+B toggles; state kept in a cookie for 7 days | S shadcn-sidebar, shadcn-dash |
| Untitled UI | header nav 64; mobile header 56 | sidebar 280; slim 68 + secondary 256 | — | below lg a 56 mobile header with a menu button | S untitled-sidebar, untitled-header |

Mantine's `layout="alt"` makes the navbar and aside full height, with header and footer between them; the default
is the reverse (D mantine-appshell). Mantine draws a 1 px border on every region by default, uses a 6 px resize
handle with a 2 px line, and transitions regions in 200 ms (S mantine-appshell). Carbon's main content has 32 padding
(S carbon-shell).

## Floating and inset layers

| System | Pattern | Values | Tag |
|---|---|---|---|
| shadcn `inset` | Main is a raised panel inset on the sidebar's ground | wrapper takes `bg-sidebar`; sidebar column padding 8 (`p-2`); main `m-2 ml-0` (8 on top, right and bottom, 0 next to the sidebar, 8 again when the sidebar collapses), radius `rounded-xl` = 14 (radius 10 × 1.4), shadow `shadow-sm` (0 1 3 0 / 10%, 0 1 2 −1 / 10%); from md only | S shadcn-sidebar, shadcn-globals, tw-theme |
| shadcn `floating` | Sidebar is a card on the page | 8 padding around it; `rounded-lg` (10), 1 px border, `shadow-sm`; icon mode width = 48 + 16 + 2 | S shadcn-sidebar |
| Untitled slim sidebar | Rail is an inset card | 4 padding (`py-1 pl-1`), `rounded-xl`, 1 px inset ring | S untitled-sidebar |
| Apple Liquid Glass | Controls and navigation float on a layer above content | sidebars, toolbars and tab bars float; content extends beneath them; regular glass for text-heavy parts (sidebars, popovers), clear glass over media with a 35% dark dimming layer when content is bright; "Don't use Liquid Glass in the content layer"; use it sparingly | D hig-materials, hig-sidebars, hig-tabbars |
| Atlassian elevation | Four surfaces: sunken, default, raised, overlay | sunken only on default; raised only for movable cards, or one emphasised focal point; overlay for modals, menus, floating toolbars; shadows pair with raised and overlay; higher surfaces are lighter in dark | D ads-elev |
| Geist materials | Surface and floating presets by height | base 6, small 6, medium 12, large 12 radius; tooltip 6, menu 12, modal 12, fullscreen 16; "favor the lowest elevation that still reads as elevated" | D geist-materials |
| Radix Inset | Media bleeds to a card's edge | negative margins equal to the card's padding; inner radius = card radius − border width | S radix-inset |

## Spacing scales and the outward rule

| System | Scale | Guidance on growing outward | Tag |
|---|---|---|---|
| Carbon | 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160 | small steps inside components; more space for less related groups and to mark sections without dividers; headers get more space | D carbon-spacing |
| Fluent 2 | 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 48, 52, 56 (2, 6 and 10 exist for icon padding) | component spacing small, pattern spacing consistent, layout spacing directs the eye; "more spacing around them draw more focus" | D fluent-layout |
| Atlassian | 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80; negatives −2 to −32 | three bands: 0–8 inside small components and card title → description; 12–24 for larger components; 32–80 for layout and page content | D ads-space |
| Primer | stack gap and padding: condensed 8, normal 16, spacious 24 | "condensed for dense lists, normal for standard layouts, spacious for prominent sections" | S primer-size |
| Polaris | 0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 112, 128; aliases card gap 16, card padding 16, button group gap 8 | not documented | S polaris-space |
| Radix | 4, 8, 12, 16, 24, 32, 40, 48, 64 (× scaling) | Section padding-block 24 / 40 / 64 (default) / 80 | S radix-space, radix-section |
| Mantine | xs 10, sm 12, md 16, lg 20, xl 32 | not documented | S mantine-theme |
| Tailwind | 4 × n | not documented | S tw-theme |

## Page and section headers

| System | Anatomy | Values | Tag |
|---|---|---|---|
| Primer PageHeader | rows: context area (parent link, context bar, actions) / leading action, breadcrumbs, title, trailing action, actions / description / navigation | title large 32/48 400, medium 20/32 600; description and navigation 8 below; leading and trailing actions 8 apart; actions gap 8 | S primer-ph |
| Carbon PageHeader | breadcrumb bar, title, subtitle, body, tags, actions, tabs | breadcrumb bar 40 tall; content padding 24 top and bottom; title row min 40, 16 below, gap 16; title heading-04 28/36 400; subtitle heading-03 20/28 with 8 below; body 14/20 with 8 above | S carbon-ph, carbon-type |
| Polaris Page | back link, title, subtitle, primary action, secondary actions, aside | one primary and at most three secondary actions; actions only when they apply to the whole page; none at the bottom; content padding 8, 20 on top from md | D polaris-page, S polaris-page |
| Untitled page header | breadcrumbs, title + description, actions + search | measured at 1280: page inset 32; breadcrumbs 28 tall, 16 above the title row; title 20/30 600; description 16/24, 2 below the title; actions 36 tall, 12 apart; search 280 × 36; 16 below the row | D untitled-ph |
| Untitled section header | title + description, actions, 1 px rule | title 16/24 600; description 14/20, 2 below; 20 above the rule; actions 36, 12 apart | D untitled-sh |
| Untitled card header | title + badge + description, actions, 1 px rule | padding 20 24; title 16/24 600 with a badge 6 away; description 14/20, 2 below | D untitled-ch |
| shadcn Card | title, description, action in a 2-column grid | card padding 24, gap 24, radius 14; header gap 8; action spans both rows at the end | S shadcn-card |
| Apple | toolbar title leading or centre; large title that shrinks on scroll | title under 15 characters; one prominent action on the trailing side | D hig-toolbars |
| Material 3, Fluent 2, Atlassian, Radix, Mantine | not documented as a page header | — | — |

## Panes and split views

- **Material 3.** Compact uses one pane. Medium recommends one pane; two panes split 50/50 with a drag handle, only for
  low-density content such as settings. Expanded+ prefers two: fixed-and-flexible (fixed pane 360, 412 from large) or
  split (two flexible panes, spacer centred). Extra-large allows a side sheet as a third pane: "Don't use more than
  three panes." (D m3-bp.) Compose's defaults match: 1 / 1 / 2 / 3 panes and 0 / 0 / 24 / 24 spacers (S m3-psd).
- **Apple.** Persist the selection in every pane that leads to the detail. Set minimum and maximum pane sizes so the
  divider never disappears; prefer the 1 pt divider. Offer more than one way to show a hidden pane. Show at most two
  levels of hierarchy in a sidebar; add a content list column for deeper data (D hig-split, hig-sidebars).
- **Primer.** The pane sits at the end by default (start in SplitPageLayout). It is not sticky by default (sticky in
  SplitPageLayout). Dividers are `line` (1 px) or `filled` (8 px band when narrow) (S primer-pl, primer-split).
- **shadcn Resizable.** The handle is a 1 px line with a 4 px hit area; the optional grip is 12 × 16 (S shadcn-resizable).

## Card grids

| System | Rule | Tag |
|---|---|---|
| Mantine SimpleGrid | `cols` (default 1) or `minColWidth` with `auto-fill` (default) or `auto-fit`; spacing md 16; `type="container"` for container queries | S mantine-simplegrid |
| Polaris | Grid 6 → 12 columns, gap 16; Layout: primary and secondary share 2 : 1, primary min 480, secondary 240–320, halves 450 and thirds 240 bases, 16 gap | S polaris-grid, polaris-layout, polaris-vars |
| shadcn dashboard | stat cards 1 → 2 columns at a 576 container → 4 at 1024; gap 16; inset 16, 24 from lg; content gap 16, 24 from md | S shadcn-dash |
| shadcn sidebar-08 | 3 columns from md, gap 16, 16:9 tiles at radius 14 | S shadcn-08 |
| Carbon | tiles sit on the 2x grid; a grid of fixed boxes "emerges when each tile uses a multiple of a consistent base size"; tiles wrap or scroll | D carbon-2x |
| Atlassian | cards align to columns; their insides use space tokens, not a nested grid | D ads-grid |
| Geist | plain card grids use Tailwind `grid-cols-*`; the Grid component is for layouts whose guide lines are visible | D geist-grid |
| Apple (tvOS) | flow layouts pick the column count from item width and spacing; spacing stays consistent; offscreen peeks equal on both sides | D hig-layout |
| Material 3, Fluent 2, Radix | no card-grid rule documented | — |

**Aspect ratios.** Carbon: 1:1, 2:1, 2:3, 3:2, 4:3, 16:9 ("constrain dimensions to one of the aspect ratios … whenever
possible") (D carbon-2x). Material 3 uncontained multi-aspect: 16:9, 9:16, 1:1, 3:4 (D m3-carousel). Untitled's
carousel demo is 1.6 (16:10) (S untitled-carousel).

## Carousels

| System | Item size | Gap | Edge padding / peek | Controls | Tag |
|---|---|---|---|---|---|
| Material 3 multi-browse | large dynamic or set; medium dynamic; small 40–56 | 8 | 16 leading and trailing, 8 top and bottom | not specified | D m3-carousel, S m3a-dimens |
| Material 3 uncontained | fixed item width, items cut at the edge | 8 | 16 leading only; items bleed over the padding while scrolling | — | D m3-carousel |
| Material 3 hero | one large + one small (start) or two small (centre) | 8 | 16 | — | D m3-carousel |
| Material 3 full-screen | one edge-to-edge item | 16 | 0 | — | D m3-carousel |
| Material 3 (all) | item radius 28; small items keep 40–56 and the large item shrinks first | | | | D m3-carousel, S m3a-dimens |
| shadcn (Embla) | `basis-full`; set `basis-1/2`, `basis-1/3` for more | 16, as item `pl-4` with track `-ml-4` | none | 32 round buttons 48 outside the track | S shadcn-carousel |
| Mantine (Embla) | `slideSize` 100% | `slideGap` 0 | `align` center; `containScroll` trimSnaps | 26 round controls inset 12; indicators 25 × 5, 8 apart, off by default | S mantine-carousel |
| Untitled UI | `basis-full`, demo max width 640 at 16:10 | 8 | none | 36 (or 44) round controls 16 (or 20) inside the frame, white 90% with blur; dots 16 from the bottom | S untitled-carousel |
| Apple (tvOS) | — | consistent | partly hidden items equal width on both sides | — | D hig-layout |

## Masonry

- **CSS.** CSS Grid Level 3 now defines `display: grid-lanes` (and `inline-grid-lanes`). Lanes come from
  `grid-template-columns` (column lanes) or `grid-template-rows` (row lanes). `fit-tolerance` (renamed from
  `flow-tolerance`, initial 1em) sets when lanes count as tied. `dense` backfills. Editor's Draft, 21 October 2026,
  last Working Draft 21 January 2026 (D css-grid-3).
- **Support.** Safari and iOS Safari 26.4 ship it; Chrome, Edge and Firefox have it only behind a flag; about 12.5%
  global usage (S caniuse).
- **Fallbacks.**
  - `column-count` columns: order runs down each column, not across.
  - JS absolute positioning: measures each item and places it in the shortest column; needs a re-layout on resize and
    image load.
  - A grid with small `grid-auto-rows` and per-item row spans: keeps reading order but needs item heights.
  - No system above ships a masonry component.

## Where the systems agree

Rules with values a skill can use.

1. **Space grows outward.** Carbon, Fluent 2 and Atlassian all say closer means more related. Atlassian's bands fit
   Area's roles: 0–8 inside small components and between a card's title and description; 12–24 between larger
   components and inside cards; 32–80 between page regions (D ads-space, carbon-spacing, fluent-layout).
2. **The outer margin is 16 on phones and 24–32 on desktop.** Material: 16 / 24. Atlassian: 16 / 32. Polaris: 24
   from 490. Primer: 16 / 24. Carbon: 16, 24 at max. Untitled: 32 at 1280.
3. **Panes are 24 apart, or touch along a 1 px divider.** Material's spacer is 24. Apple, Primer, Carbon, Mantine and
   shadcn use a 1 px line between docked panes.
4. **Navigation is 240–320 expanded and 48–96 collapsed.** Polaris 240, Carbon 256, shadcn 256, Fluent 260, Untitled
   280, Atlassian 320 (min 240), Material drawer 360. Collapsed: Carbon 48, shadcn 48, Untitled 68, Material 80–96.
5. **Side panels are 256–412 wide.** Primer 256–320, Polaris 240–320, Fluent 320, Atlassian 330–365, Material
   360 / 412, with a minimum near 240–320 and a maximum tied to the viewport (Atlassian 50vw; Primer viewport − 511).
6. **Top bars are 48–64 tall.** Carbon 48, Atlassian 48, shadcn dashboard 48, Polaris 56, Untitled 56 mobile and 64
   desktop, Mantine's example 60.
7. **Navigation changes form at 768–1056.** shadcn: sheet below 768. Primer: stacks below 768. Atlassian: overlay below
   1024. Untitled: mobile header below 1024. Carbon: overlay below 1056. Material: bar below 600, rail from 600.
8. **Phones get one pane, tablets one or two, desktops two, and the largest screens three at most.**
   Material says this outright (D m3-bp); Apple restricts split views to regular width (D hig-split).
9. **Two widths for page content: one for reading and one for structured pages.** Reading: Atlassian 864, Polaris 662,
   Primer 768, Radix 688 or 880. Structured: Atlassian 1296, Polaris 998, Primer 1012 or 1280, Radix 1136, Untitled
   1280. Boards and canvases run fluid (Atlassian).
10. **A page header has a fixed order.** The order is:
    - context (breadcrumb or back link);
    - one row with the title and its actions at the trailing end;
    - a description under the title;
    - tabs last.

    Primer, Carbon, Polaris and Untitled all follow it. Title to description is 2–8 (Untitled 2, Primer 8, Carbon 8).
    The header holds one primary action (Polaris, Apple).
11. **Headers step down a tier at a time.** The tiers are:
    - page title 20–32 (Untitled 20/30, Primer 20 or 32, Carbon 28);
    - section and card titles 16/24 600 with a 14/20 description (Untitled);
    - section headers end in a 1 px rule with about 20 above it.
12. **Card grids repeat with a minimum width and gaps of 16–24.** Mantine auto-fill, Polaris 16, shadcn 16 (24 at
    md+). Column counts step 1 → 2 → 3/4 by container or viewport width. Inside a card, use space tokens, not the page
    grid (Atlassian).
13. **Carousels show peeks.** Gap 8–16 (Material 8, full-screen 16; shadcn 16; Untitled 8). The edge inset matches the
    page margin (Material 16), and items bleed past it while scrolling. Material keeps peeking items 40–56 wide.
14. **Media uses a few fixed ratios.** 16:9, 4:3, 3:2, 1:1, 2:3 or 3:4, 9:16 (Carbon, Material).
15. **Floating layers are for chrome, not content.** Apple: Liquid Glass only for controls and navigation. Atlassian:
    overlay for menus, dialogs and floating toolbars; raised only for movable cards; sunken only on the default
    surface. Geist: the lowest elevation that still reads.
16. **Inset main panel.** Shown by shadcn `inset` and Untitled's slim rail. The panel's corner radius is larger than the
    controls' (14 against 10) and its shadow is a hairline (`shadow-sm`).
    - Shell ground = the sidebar's colour.
    - Gutter 8 on the free sides, none against the sidebar; it returns when the sidebar collapses.
    - Off on phones (shadcn applies it from md, 768).

## Where they disagree

- **Columns or panes.** Carbon (16), Atlassian and Fluent (12) are column grids. Material and Apple think in panes
  and size classes with no column grid. Primer, Polaris and shadcn lay out regions with flex and fixed pane widths.
- **Base unit.** Carbon and Atlassian use 8 with 2/4/6 half-steps. Fluent, Tailwind and Primer use 4. Mantine's scale
  starts at 10. Radix multiplies by a scaling factor.
- **Breakpoint values.** No two systems match. 768 is the most common (Primer, Polaris, Radix, Mantine, Tailwind).
  Material uses 600 / 840 / 1200 / 1600, Carbon 672 / 1056 / 1312 / 1584, Fluent 480 / 640 / 1024 / 1366 / 1920.
- **Gutter width.** Carbon 32, Material 24, Atlassian 16 (12 on phones), Polaris 16.
- **Navigation width.** 240 (Polaris) to 360 (Material drawer). Material's rail is about twice as wide as the 48
  icon rails (96 against 48).
- **Docked or floating.** Carbon, Primer, Polaris, Atlassian and Mantine dock regions with 1 px borders. shadcn offers
  docked, floating and inset as variants. Apple makes sidebars and toolbars float in Liquid Glass by default.
- **Where breakpoints are measured.** Most use the viewport. Android uses the window. shadcn's dashboard uses
  container queries. Atlassian says the grid ignores side nav and panels.
- **Carousel controls.** shadcn puts arrows 48 outside the track. Untitled puts them 16 inside, over the image.
  Material specifies none and relies on peeks and swiping. Mantine shows no indicators by default.
- **Header title weight.** Primer large and Carbon titles are regular weight (400). Untitled and Primer medium are
  semibold (600).

## Sources

Pinned commits, read 2026-10-22.

| Id | Tag | Source |
|---|---|---|
| m3-bp | D | https://m3.material.io/foundations/layout/breakpoints/compact, …/medium, …/expanded, …/large-extra-large |
| m3-carousel | D | https://m3.material.io/components/carousel/specs |
| m3-psd | S | androidx/androidx@35d8f1dd `compose/material3/adaptive/adaptive-layout/src/commonMain/kotlin/androidx/compose/material3/adaptive/layout/PaneScaffoldDirective.kt` (lines 55–76, 346–347) |
| m3-nav | S | androidx/androidx@35d8f1dd `compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/NavigationDrawerTokens.kt`, `NavigationRailCollapsedTokens.kt`, `NavigationRailExpandedTokens.kt`, `NavigationBarTokens.kt` |
| m3-carousel-src | S | androidx/androidx@35d8f1dd `…/material3/carousel/Carousel.kt` (CarouselDefaults: small 40–56, spacing 0, anchor 10) |
| m3a-dimens | S | material-components/material-components-android@66b0eeb5 `lib/java/com/google/android/material/carousel/res/values/dimens.xml` |
| android-wsc | D | https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes |
| hig-layout | D | https://developer.apple.com/design/human-interface-guidelines/layout (updated 2026-09-09) |
| hig-sidebars | D | https://developer.apple.com/design/human-interface-guidelines/sidebars |
| hig-split | D | https://developer.apple.com/design/human-interface-guidelines/split-views |
| hig-toolbars | D | https://developer.apple.com/design/human-interface-guidelines/toolbars |
| hig-tabbars | D | https://developer.apple.com/design/human-interface-guidelines/tab-bars |
| hig-materials | D | https://developer.apple.com/design/human-interface-guidelines/materials |
| fluent-layout | D | https://fluent2.microsoft.design/layout |
| fluent-nav | S | microsoft/fluentui@ea1a99bf `packages/react-components/react-nav/library/src/components/sharedNavStyles.styles.ts` (defaultDrawerWidth 260) |
| fluent-drawer | S | microsoft/fluentui@ea1a99bf `packages/react-components/react-drawer/library/src/shared/useDrawerBaseStyles.styles.ts`, `DrawerHeader/useDrawerHeaderStyles.styles.ts`, `DrawerBody/useDrawerBodyStyles.styles.ts` |
| carbon-grid | S | carbon-design-system/carbon@f4967e5c `packages/grid/scss/_config.scss` |
| carbon-2x | D | https://carbondesignsystem.com/elements/2x-grid/overview/ |
| carbon-spacing | D | https://carbondesignsystem.com/elements/spacing/overview/ |
| carbon-shell | S | carbon@f4967e5c `packages/styles/scss/components/ui-shell/header/_header.scss`, `side-nav/_side-nav.scss`, `header-panel/_header-panel.scss`, `content/_content.scss`, `_functions.scss` (mini-unit 8) |
| carbon-ph | S | carbon@f4967e5c `packages/styles/scss/components/page-header/_page-header.scss` |
| carbon-type | S | carbon@f4967e5c `packages/type/src/styles.ts` |
| primer-pl | S | primer/react@3a71047a `packages/react/src/PageLayout/PageLayout.module.css`, `PageLayout.tsx` |
| primer-split | S | primer/react@3a71047a `packages/react/src/SplitPageLayout/SplitPageLayout.tsx` |
| primer-ph | S | primer/react@3a71047a `packages/react/src/PageHeader/PageHeader.module.css` |
| primer-bp, primer-size | S | primer/primitives@ec3eee6a `src/tokens/functional/size/breakpoints.json5`, `size.json5` |
| polaris-page | S | Shopify/polaris@3f7954ae `polaris-react/src/components/Page/Page.module.css`, `Page/components/Header/Header.module.css` |
| polaris-mixin | S | Shopify/polaris@3f7954ae `polaris-react/postcss-mixins/page-layout.css` |
| polaris-vars | S | Shopify/polaris@3f7954ae `polaris-react/src/components/AppProvider/global.css` |
| polaris-layout, polaris-grid | S | Shopify/polaris@3f7954ae `polaris-react/src/components/Layout/Layout.module.css`, `Grid/Grid.module.css` |
| polaris-bp, polaris-space | S | Shopify/polaris@3f7954ae `polaris-tokens/src/themes/base/breakpoints.ts`, `space.ts`, `polaris-tokens/src/size.ts` |
| polaris-page (D) | D | https://shopify.dev/docs/api/app-home/polaris-web-components/structure/page |
| ads-grid | D | https://atlassian.design/foundations/grid |
| ads-space | D | https://atlassian.design/foundations/spacing |
| ads-elev | D | https://atlassian.design/foundations/elevation |
| ads-nav | S | npm @atlaskit/navigation-system@11.4.0 `dist/es2019/ui/page-layout/constants.js`, `get-panel-layout-defaults.js`, `side-nav/side-nav.js`, `top-nav/top-nav.js`, `top-nav/top-nav.compiled.css`, `aside.js`, `panel.js` |
| untitled-sidebar | S | untitleduico/react@1d410cb8 `components/application/app-navigation/sidebar-navigation/sidebar-simple.tsx`, `sidebar-slim.tsx`, `sidebar-dual-tier.tsx` |
| untitled-header | S | untitleduico/react@1d410cb8 `components/application/app-navigation/header-navigation.tsx`, `base-components/mobile-header.tsx` |
| untitled-theme | S | untitleduico/react@1d410cb8 `styles/theme.css` |
| untitled-carousel | S | untitleduico/react@1d410cb8 `components/application/carousel/carousel-base.tsx`, `carousel.demo.tsx` |
| untitled-ph, -sh, -ch | D | https://www.untitledui.com/react/iframe/page-headers/page-header-simple, …/section-headers/section-header-buttons, …/card-headers/card-header-with-badge (computed styles at a 1280 viewport) |
| shadcn-sidebar | S | shadcn-ui/ui@3d98900e `apps/v4/registry/new-york-v4/ui/sidebar.tsx` (lines 28–33, 221–247, 307–318) |
| shadcn-mobile | S | shadcn-ui/ui@3d98900e `apps/v4/registry/new-york-v4/hooks/use-mobile.ts` |
| shadcn-globals | S | shadcn-ui/ui@3d98900e `apps/v4/app/globals.css` (radius 0.625rem, xl × 1.4) |
| shadcn-dash, shadcn-08 | S | shadcn-ui/ui@3d98900e `apps/v4/registry/new-york-v4/blocks/dashboard-01/page.tsx`, `components/site-header.tsx`, `components/section-cards.tsx`, `blocks/sidebar-08/page.tsx` |
| shadcn-card, shadcn-carousel, shadcn-resizable | S | shadcn-ui/ui@3d98900e `apps/v4/registry/new-york-v4/ui/card.tsx`, `carousel.tsx`, `resizable.tsx` |
| radix-container, radix-section, radix-inset, radix-space, radix-bp | S | radix-ui/themes@1faff10a `packages/radix-ui-themes/src/components/container.css`, `section.css`, `inset.css`, `*.props.tsx`, `src/styles/tokens/space.css`, `src/styles/breakpoints.css` |
| mantine-appshell | S | mantinedev/mantine@194d6524 `packages/@mantine/core/src/components/AppShell/AppShell.tsx`, `AppShell.module.css` |
| mantine-appshell (D) | D | https://mantine.dev/core/app-shell/ |
| mantine-container, mantine-simplegrid, mantine-theme | S | mantinedev/mantine@194d6524 `…/Container/Container.module.css`, `…/SimpleGrid/SimpleGrid.tsx`, `…/core/MantineProvider/default-theme.ts` |
| mantine-carousel | S | mantinedev/mantine@194d6524 `packages/@mantine/carousel/src/Carousel.tsx`, `Carousel.module.css` |
| geist-grid, geist-materials | D | https://vercel.com/geist/grid, https://vercel.com/geist/materials |
| tw-theme | S | tailwindlabs/tailwindcss@8cc0551b `packages/tailwindcss/theme.css` |
| tw-container | D | https://tailwindcss.com/docs/max-width |
| css-grid-3 | D | https://drafts.csswg.org/css-grid-3/ (Editor's Draft, 21 October 2026) |
| caniuse | S | Fyrd/caniuse@664a78d7 `features-json/css-grid-lanes.json` |
