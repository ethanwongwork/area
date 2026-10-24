# ChatGPT desktop app layout, 2026-10-22

How the ChatGPT desktop app (macOS, 26.1013.31256) composes its UI: the window, the layer
container, panels, headers, floating layers, the thread, media, grids and settings. It is
for the skills that will direct how Area components are composed into whole screens.

The app is one Electron codebase shared with Codex (package `openai-codex-electron`,
product name Codex). The webview sets `data-codex-window-type=electron`; chatgpt.com uses a
different, StyleX-built front end and appears here only as a comparison.

Confidence: **B** read from the app bundle (file and selector or variable in each row);
**M** measured live in headless Edge on chatgpt.com, logged out, at 1440×900 and 390×844.
Units are CSS px; `--spacing` is 4px. Light and dark values are the default theme's.

The installed app was already running, so it was not opened or read live. Every desktop
value comes from the bundle. Settled web values are cited from
`docs/research/app-screens-2026-10-21.md`, `BASELINE.md`, `specs/composer.md` and
`specs/message.md`, and are not repeated here.

## Window and shell

| Item | Value | Source |
|---|---|---|
| Window default / minimum | 1280 × 820; minimum 480 × 600 | B `main-*.js` `createWindow`, `getPrimaryMinimumSize` |
| Title bar | `titleBarStyle: hiddenInset`; the app draws its own 44 strip | B `main-*.js` case `primary`; `--height-titlebar: calc(var(--spacing)*11)` |
| Traffic lights | x 16, y `round((44 × zoom − 14) / 2)` = 15 at zoom 1 | B `main-*.js` `k9(O9=44,…)`, `Z4e=16`, `X4e=14` |
| Window material | Transparent window with macOS `vibrancy: menu`. It turns opaque when unfocused, when the opaque-windows setting is on, or at 4K or more physical pixels. The opaque ground is #f9f9f9 light, #000000 dark | B `main-*.js` `I9`, `L9`, `d3e`, `l3e`, `U4e`, `H4e` |
| Drag regions | Startup loader and the application menu top bar are `-webkit-app-region: drag`, with buttons set to `no-drag`. Header rows add `draggable` | B `index.html` `.startup-loader`; `app-initial-*.css` `._ApplicationMenuTopBar` |
| Regions | Ground (title strip and margins), left panel (sidebar), main surface, optional right panel | B `app-initial-*.js` shell `CUa`; `app-initial-*.css` module `_etoz9_2` |

### The layer container

The layer container is a feature-gated layout (`PageSurfaceLayout`). It is on when a left
panel exists and gate `3085093835` passes (`hasPageSurface = AE && leftPanelSlot`). A
full-height variant exists in the code but is hard-wired off (`hasFullHeightPageSurface: !1`).
**B** `app-initial-*.js`; `app-initial-*.css` `._PageSurfaceLayout_etoz9_2`,
`._PageSurface_etoz9_2`, `._MainContentSurface_etoz9_2`.

| Property | Value |
|---|---|
| Top | Starts below the 44 title strip: `margin-top: var(--app-shell-titlebar-height)` = `--height-titlebar` = 44. The left panel gets the same `marginTop` |
| Right, bottom | `padding-inline-end: var(--spacing)` and `padding-block-end: var(--spacing)` on the layout root: **4** from the window edge |
| Left | `inset-inline-start: var(--app-shell-navigation-rail-width)`: the rail width when a rail shows, otherwise **0** (flush with the window edge) |
| Corner radius | `--radius-xl-base` = .75rem = **12**. It is not scaled by the corner-radius setting. On Windows the main surface rounds only its top-left corner, at `--radius-lg` |
| Edge and shadow | `box-shadow: var(--elevation-stroke-subtle), var(--shadow-card)`, painted by an `aria-hidden` plate behind the panels. That is `0 0 0 .5px` of border-strong at **4%** (light) / **6%** (dark), plus `0 4px 16px 0 #0000000d`. There is no border |
| Fill | Main surface `--color-surface` = theme surface: **#ffffff** light, **#181818** dark, opaque, `overflow: hidden` |
| Sidebar part | The sidebar sits inside the layer. `.sidebar-navigation` paints `--color-surface` at **65%** (translucent over the ground) and has left corners of 12 (`clip-path: inset(0 -12px 0 0 round 12px)`) |
| Join | While the sidebar is docked open (`data-app-shell-page-sidebar=true`), the main surface's start corners go to 0. Sidebar and main then read as one rounded rectangle, split by a 0.5px divider (`._MainContentLeftBorder`, `--border-width-hairline`, colour `--color-border`) |
| Ground | `[data-app-shell-page-surface=true]` root: light `--color-surface-secondary` at **85%** = #f6f6f6 at 85%; dark `--color-surface-tertiary` at **80%** = #282828 at 80%. Both sit over the vibrancy, or over #f9f9f9 / #000 when opaque |
| Sidebar collapsed | The main surface gets all four corners at 12. The divider fades out with the collapse progress (`color-mix(var(--color-border) progress×100%)`). During a hover peek the divider is transparent (`data-app-shell-docking-peek`) |
| Panels | The left panel and the main surface (including the right panel) are inside the layer. Only the title strip and the 4 margins are ground |
| Scroll edge | `._MainContentTopFade` (z 20) fades in under the toolbar on scroll. When a page with a header scrolls, the title bar fills with surface and gains a 1px `--color-border-subtle` bottom rule |

Derived colours come from the theme function `Des`/`kes`/`jes` (`app-initial-*.js`) with the
desktop defaults `d9o`: light surface #ffffff, ink #1a1c1f, contrast 45; dark surface #181818,
ink #ffffff, contrast 60. The surface-under colour (`Nes`) mixes surface toward ink by 4%
(light) or toward black by 16% (dark), giving #f6f6f6 / #141414. The editor or tertiary
colour is #ffffff / #282828. So the layer is **lighter than the ground in light mode and
darker than it in dark mode**: the content sits deeper in dark.

On chatgpt.com there is no layer: body and sidebar share #fcfcfc light / #000 dark, and the
sidebar has a 1px right border at black 10% / white 15% (M, `nav` parent, `rounded: []`).

## Spacing system

| Step | Value | Where (B, tokens in `app-shared-*.css` unless noted) |
|---|---|---|
| Hairline | 0.5 | `--border-width-hairline`; `--hairline` is .5 at ≥1.5× resolution |
| 4 | `--spacing` | Layer margin, menu gutter, sidebar scroll top padding, composer button gap |
| 5 | 1.25 | Menu item and nav row vertical padding (`--padding-row-y` on the desktop body) |
| 8 | 2 | Row inline padding `--padding-row-x`, icon-to-label gap `--spacing-nav-row-content`, image gaps, header end padding |
| 12 | 3 | `--thread-content-margin`, grid column gap, compact cards `px-3` |
| 16 | 4 | `--padding-toolbar` (thread inline padding), `--conversation-item-gap`, composer bottom inset, sidebar group gap `gap-4`, bubble inline padding |
| 20 | 5 | `--padding-panel-base` (pages, settings, dialogs `--dialog-container-inner-padding`), large card `p-5` |
| 24 | 6 | `--composer-inline-overhang` |
| 32 | 8 | `--thread-content-top-inset`, transcript end `pb-8` |
| 40 | 10 | `--settings-section-gap` |

Spacing grows outward: control insets are 4–8, row and group gaps 8–16, page and panel
padding 20, sections 32–40. The window margin breaks the pattern: the layer is held only
**4** off the window edge, so the chrome reads as a thin frame. Grouped items close up to
`--conversation-grouped-item-gap` 4.

## Headers

| Header | Height and layout | Source |
|---|---|---|
| Title strip (ground) | 44 (`--height-titlebar`); on Windows and Linux the overlay is 36 × zoom | B `_PageSurfaceLayout`; `main-*.js` `A9` |
| Main toolbar | 46 (`--height-toolbar`; the web build uses 52). Padding: start `max(safe-left, 8)` (safe-left = traffic-light area + 6), end 8. Flex, centred vertically. Tinted by `--codex-titlebar-tint`, transparent by default | B `._FloatingHeader_etoz9_2`; `app-initial-*.js` `ht` |
| Header placement | `data-app-shell-header-placement` is `titlebar` (controls sit in the 44 strip above the layer, page offset 0) or `page` (inside the layer, top corners follow the layer's 12) | B `_PageSurfaceLayout … [data-app-shell-header-placement]` |
| Panel toolbar | `grid h-toolbar grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-3 px-toolbar`: title centred between equal side columns. Under 900 container width it switches to `[auto_minmax(0,1fr)_auto]` with gap 4 | B `app-initial-*.js` class string |
| Pane header | 40 (`--height-toolbar-pane`), `grid-cols-[minmax(0,1fr)_auto_minmax(max-content,1fr)] gap-2`, `ps-4 pe-2`, bottom rule `border-subtle`, surface fill | B `app-initial-*.js` |
| Sidebar header | 52 (`--sidebar-navigation-header-height: calc(var(--spacing)*13)` in the layer layout; 32 elsewhere). Content `ms-2 … pe-1`, items centred | B `_PageSurfaceLayout`; `VXi` |
| Settings header | `h-toolbar px-panel`, title `text-lg font-medium` (16/500), truncating | B `app-initial-*.js` settings shell |
| Web header | 61 tall, padding 8/16, transparent, no rule | M `header` |

There are no rules under headers at rest: the rule appears only after scroll. Headers do not
blur; content behind fades through a mask (`_MainContentTopFade`, and
`--sidebar-scroll-header-fade-distance` 16 in the sidebar).

## Nav panel (sidebar)

| Item | Value | Source |
|---|---|---|
| Width | Default **340**, minimum **240**, maximum **520**, and never more than window − 240. Resizable from an outside hit area; with the layer on, the indicator is `inset-solid`. Dragging below 120 (0.5 × minimum) collapses it. Width is stored in `sidebar-width` and mirrored to `--codex-sidebar-preferred-width` | B `tb()`, `zYt` (340), `fur=.5`, `oUa` (`defaultSize:340`) |
| Responsive | Below 768 (`(min-width: 768px)`) the panel width is 0 and the panel is hidden or overlaid | B `UYt`; `._Layout[data-app-shell-responsive-sidebar]` |
| Rows | Height 30 (`--height-token-nav-row` on `.sidebar-navigation`); radius `--radius-token-row` 10 / `.sidebar-item` `--radius-lg` 10; padding 8 (`--padding-row-x`, `--padding-row-cell-x`). Icon box 24 (`.sidebar-item-icon`), icon-to-label gap 8. Label 13 (`text-sm`) or 14 (`text-base`). Hover `bg-primary-ghost-hover` | B `.sidebar-navigation`, `.sidebar-item`, row class strings |
| Web rows | 36 tall, 10 cell padding, 6 gap, 14 text (`browser:` overrides); 44 tall at 390 wide | B; M |
| Section labels | `px-row-x py-2 text-sm text-secondary`: 13 in secondary ink, 8 above and below, sentence case | B `app-initial-*.js` |
| Groups | `flex flex-col gap-4 px-row-x`: 16 between groups | B |
| Scroll area | `min-h-0 flex-1 overflow-y-auto`, top padding 4. Header fade 16 once scrolled; footer fade 40 (`--sidebar-scroll-footer-fade-distance`) | B |
| Footer | `mt-auto px-row-x pt-4`; account and usage row `h-toolbar gap-2 px-row-x` (46) | B |
| Rail | `group/sidebar-rail … flex-col items-center gap-2 px-2 pb-2` (pb 4 inside the layer); top padding `(52 − 36) / 2` = 8, so 36 buttons line up with the header. Transparent on desktop | B |

## Side panels

| Item | Value | Source |
|---|---|---|
| Right panel width | Default 600, then clamped: `max(320, min(shellHeight × 1.6, main − 500), min(640, main − 352))`. Minimum 320. Maximum is main − 352 (regular), main − 320 (unified) or full. Stored as a 0–1 ratio (`app-shell:right-panel-width:v3`) | B `GYt`, `ZYt`, `QYt`, `tXt=500`, `nXt=640`, `rXt=16/10`, `iXt=352` |
| Splitting | The thread keeps at least 352 beside a regular panel. Panels dock right or bottom (`$es`) | B |
| Resize | `pane_resize` handle; a 1px `bg-border` line shows only when a title-bar row is present | B `app-initial-*.js` |
| Panel header | 40 pane header or 46 toolbar (above); the panel scroll area offsets content by `--thread-content-top-inset` 32 | B `chatgpt-entity-side-panel-tab-*.js` |
| Detail rows | `min-h-[row] gap-x-3 gap-y-0.5`, with a 120 label column at container width ≥ 24rem | B `--detail-property-label-width` |
| Canvas or document | Floating canvas surface radius 16 (`._canvasSurface` `--floating-panel-radius: var(--radius-2xl-base)`) | B `app-shared-*.css` |

## Floating layers

| Layer | Surface | Source (B) |
|---|---|---|
| Menu | Radius 16 (`--menu-radius: var(--radius-2xl)`, superellipse where supported). Gutter 4. Fill `--color-surface-elevated-secondary` (#ffffff light / #2d2d2d dark). Shadow `--shadow-xl-spread` = `0 0 0 .5px border` + `0 8px 16px -4px #0000001f`. Minimum width 300, maximum the available space | `:where(:root[data-codex-window-type=electron] *)` menu tokens; `._MenuList_13e1t_2` |
| Menu item | Padding 5 / 8, radius 12 (= 16 − 4), 13 text, gap 6. Hover plate is a `::before` at 0.98 scale that grows to 1. Danger items use a soft red plate | `._MenuItem_13e1t_2` |
| Descriptive menu | Radius 20, gutter 6, items at least 44 tall, 13 text | `[data-variant=descriptive]` |
| Menu motion | Enters from 0.95 scale and 0 opacity in 150ms; exits in 100ms | `._Menu_13e1t_2[data-entering]` |
| Tooltip | Radius 16, padding 5 / 12 (sm 4 / 8, lg 8 / 16), 13 at weight 430. Solid primary in light, elevated-secondary in dark | `--tooltip-*` |
| Dialog | Width 250–450 (`--dialog-min-width`, `--dialog-max-width`), padding 20, radius 16 on desktop. Placed a little above centre: `top: calc(50% − (100dvh − min(460, 100dvh − 40)) / 18)`. Full screen below 768. Backdrop black 30% light / 50% dark | `--dialog-*`, `._dialog_1j13a_1`, `--modal-backdrop-background` |
| Large sheet | `h-[min(72vh,44rem)] w-[min(78vw,56rem)] rounded-3xl border bg-surface-elevated-secondary/95 shadow-2xl` | `app-initial-*.js` class string |
| Toast | `width: max-content; max-width: 100%`; centred variant capped by `--toast-content-max-width` | `._toast_1dz2c_1` |
| Popover ring | `--popover-overlay-ring-width` .5 | `app-shared-*.css` |

Offsets from triggers come from Radix props in JS and were not traced. Toast placement was
not found in CSS.

## Content column and feed

| Item | Value | Source |
|---|---|---|
| Thread width | `--thread-content-max-width: 48rem` (768) on the desktop body. The column adds `px-toolbar` 16 each side (`--thread-body-max-width` = 768 + 32). Wide blocks reach 56rem (`--markdown-wide-block-max-width`) | B `:is(…electron) body`; `thread-scroll-layout-*.js` |
| Gutter | `.thread-pane` `--thread-gutter: clamp(12px, 3cqi, 24px)` | B `app-initial-*.css` |
| Top and bottom | Content starts 46 (toolbar) + 32 below the surface top; transcript ends with `pb-8` (32) | B `._MainContentViewport`, `thread-scroll-layout-*.js` |
| Turn gaps | 16 between items (`--conversation-item-gap`), 4 within a group | B `:root` |
| User message | Right-aligned bubble, max 70% wide, radius 22, padding 10 / 16, 24 line height; fill `color-mix(text 5%)`. Compact bubble: maximum 456, radius 16, padding 8 / 12 | B `user-message-*.css` `._bubble_168sz_1`, `._compactMessageBubble`; `home-*.css` `._userBubble` |
| Assistant message | Full column width, no bubble or avatar (as on web, `specs/message.md`) | B, M |
| Composer dock | Absolute footer `inset-x-0 z-20 bottom-0`, `pb-(--thread-composer-bottom-inset)` = **16** on desktop (24 on web) | B `thread-scroll-layout-*.js`; `:where(:root,[data-theme])` |
| Composer | Minimum height 44, radius 22 (`--composer-radius: calc(var(--spacing)*5.5)`; web 28), input padding 0 / 12, 20 line height, 28 controls with a 4 gap. Light shadow `0 0 0 1px #0000000a, 0 2px 8px #0000000a, 0 4px 80px 8px #00000006` (40 blur under 640 wide); dark `inset 0 0 1px #fff3` | B `:root`, `--elevation-composer*` |
| Scroll ownership | The thread scroller owns scrolling (`overflow-y-auto`, `scrollbar-gutter: stable both-edges`), and the composer overlays it. Fade masks are 16 at the top (`--edge-fade-distance` 1rem); the compact layout also fades the bottom above the composer | B `thread-scroll-layout-*.css` |
| Web | Composer 768 × 52 at 1440; 366 × 48 with 12 side margins at 390 | M `form` |

## Titles and copy

| Role | Value | Source (B) |
|---|---|---|
| Base UI text | 14 (`--text-base`), weight 430 (`--font-ui-weight`); small text 13, extra-small 12 | `[data-codex-window-type=electron]` |
| Page title | `text-heading-lg` 24, `leading-tight`, weight 400; 28 from `md` (`text-heading-app`) | class strings in `app-initial-*.js` |
| Section heading | `text-heading-md` 18 on desktop (20 at root), `text-heading-sm` 18, weight 590 for form titles | tokens |
| Card title | 22 / 28, weight 510, tracking −.26 | `--text-card-title` |
| Control label | 13 / 18, weight 510, tracking −.08 | `--text-control-label` |
| Muted text | Secondary is ink at 65%; tertiary is ink at about 50% (light .495, dark .498) | theme `kes`, `jes` |
| Settings intro | `text-base leading-6 text-balance text-secondary` | settings shell |
| Web greeting | 24 / 28, weight 400, centred about 32 above the composer (`app-screens-2026-10-21`) | M |

Copy is sentence case throughout: section labels, menu items and titles.

## Image and video placement

| Item | Value | Source (B) |
|---|---|---|
| Single generated image | Fills the column by aspect ratio, capped at 400 for portrait (ratio < 1), 480 for ratio 1–2, and the thread width (768) at ratio ≥ 2 | `schema-*.js` `R()` |
| Several images | Row height = (width − 24) / 4, gap 8. Natural ratios when they fit; otherwise square tiles, 4 visible, stepping by height + 8 | `schema-*.js` `L()` |
| Gallery tile | Radius 16. Count badge `h-6 rounded-full bg-black/45`, 8 from the corner. Thumbnails 56 (`size-14`) at radius 10 | `generated-image-gallery-*.js` |
| Image group (web results) | Carousel by default: item height 140 (220 at size lg), 5:4, gap 8, no arrows, no snap. Bento: 363 / 200 frame, maximum 768, gap 2, main tile 60% wide, two stacked tiles 40%, outer corners rounded 2xl. Small screens: three-column grid, gap 8 | `media-*.js` `AsyncImageGroup` |
| Video | `box` maximum 640, radius 3xl, 16:9, `surface-secondary` fill | `media-*.js` `AsyncVideo` |
| Masonry grid | Columns by container: 1, then 2 at 24rem, 3 at 36rem, 4 at 48rem, 5 at 64rem, 6 at 80rem. Gap 12, or 16 at 640 and wider | `app-initial-*.js` masonry class (caller not traced) |
| Lightbox | Separate chunks (`chatgpt-image-lightbox-*`, `image-lightbox-*`); viewer backdrop blur 4 (`--image-viewer-transparent-backdrop-filter`) | `app-shared-*.css` |

## Card feeds, grids, carousels

| Item | Value | Source (B) |
|---|---|---|
| Card tile | Large: `min-h-40 rounded-2xl border p-5` (160, radius 16, padding 20). Featured: `rounded-xl bg-surface-secondary px-7 py-8`. Compact: `min-h-24 rounded-xl px-3 py-4`. Hover fill `primary-ghost-hover`. Icons 52 at radius 16, or 36–40 at radius 10 | `card-tile-*.js` |
| List group | `flex flex-col overflow-hidden rounded-lg border`, 1px separators inset 10 (`mx-2.5 h-px bg-border`), 40 icon tiles | `plugins-cards-grid-*.js` |
| Suggestion grid | `grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3` | `home-suggestion-surface-*.js` |
| Structured grid | Rows 16 apart, columns 12 apart. Presets sm 2/3/4, md 2/3/3, lg 1/1/2 columns at base/sm/md; or `auto-fit, minmax(min(Npx,100%),1fr)` | `src-c3d02b9201fe.js` |
| Carousel | Horizontal flex, padding 8 above and below (0 when flush), hidden scrollbar, smooth scroll, snap none, proximity or mandatory. Below 576 it bleeds to the thread gutter and shows a 10% continuation peek | `src-*.css` `._Carousel_oj95a_15` |
| Card carousel | Proximity snap with items aligned to start, start scroll padding 16, arrows only on hover or focus, end padding 16 when arrows show. Edge bleed `--chat-container-to-thread-inner-gutter` below 576 | `es-*.css` `._CardCarousel_1wyzj_1` |
| Business gallery | Items 140 × 140, gap 12, arrows unless on mobile | `business-gallery-widget-*.js` |
| Project index | Table grid `[minmax(0,1fr)_4rem_8rem] gap-x-4`, which drops the middle column at 680 or less | `projects-index-page-*.js` |

## Footers

The composer dock floats 16 above the surface bottom, over the transcript. No disclaimer
line was found in the desktop composer. Logged out, the web shows a one-line AI disclaimer
under the composer (M). The sidebar footer is a 46 row pinned by `mt-auto`, with a
40 fade above it. Settings action rows: `border-t px-panel py-3 gap-2`, right-aligned, on the
surface.

## Settings and centred pages

| Item | Value | Source (B) |
|---|---|---|
| Layout | The sidebar becomes the settings nav (`sidebar-navigation`, groups `gap-4` and `gap-2`, labels `px-row-x pt-2 text-sm text-secondary`). Content scrolls in the layer | `settings-page-*.js` |
| Column | `group/settings mx-auto w-full max-w-3xl` (768), or `max-w-2xl` (672) for plain pages; at least 320; `px-panel pb-panel pt-panel` (20) | `app-initial-*.js` settings shell |
| Section gap | 40 by default, 22 compact, 20 in panel mode (`--settings-section-gap`) | same |
| Rows | Settings row minimum 64 (`--height-token-settings-row: 4rem`). Group lists separated by `divide-y` with `--color-border`; separators hide around a hovered or focused row | `settings-rows-*.css` `._interactive_10sh1_1` |
| Web | Radius-16 cards with rows 53 / 62 in a 768 column (`app-screens-2026-10-21`) | M |

## Responsive

| Breakpoint | What changes | Source (B) |
|---|---|---|
| < 768 window | Sidebar width 0 and hidden; dialogs full screen; modal enters from below (`--modal-out-y` 100%) instead of 20 up; the full-height surface hides | `UYt`; `._dialog_1j13a_1`; `._Modal_ovjjw_2` |
| < 640 | Composer shadow blur 80 → 40; home footer placement changes | `--elevation-composer` |
| < 576 container | Carousels bleed to the gutter and show a peek | `._Carousel_oj95a_15` |
| < 900 detail panel | Panel toolbar becomes `[auto_1fr_auto]` with gap 4 | class string |
| Window minimum | 480 × 600; the main area keeps at least 240 beside the sidebar and 352 beside a right panel | `main-*.js`; `tb`, `iXt` |
| Web 390 | Header 61; sidebar becomes a 309-wide drawer over a full-screen close scrim; composer 366 wide, 12 from the edges | M |

## Patterns worth adopting

- **Layer container.** Lay the app chrome ground under one content layer.
  - The layer starts below a 44 title strip, 4 from the right and bottom, and 0 (or the
    rail width) on the left.
  - Radius 12; a 0.5px stroke at 4% / 6% plus `0 4px 16px` 5%; no border.
  - Light: the ground is darker than the layer (#f6f6f6 under #ffffff). Dark: the ground is
    lighter (#282828 under #181818).
- **Sidebar inside the layer.** The sidebar is part of the layer, at 65% of the layer
  colour, with the layer's left corners. While docked open, the main surface squares its
  joining corners and a 0.5px divider separates the two. When collapsed, the main surface
  takes all four corners.
- **Thin outer margin, generous inner padding.** The window margin is 4. Panel and page
  padding is 20, the thread inline padding 16, and sections 32–40 apart.
- **Fixed chrome heights.** Title strip 44, toolbar 46, pane header 40, sidebar header 52,
  sidebar rows 30, settings rows 64.
- **Centred three-column toolbars** (`1fr auto 1fr`) that collapse to `auto 1fr auto`
  under 900.
- **Rules appear only on scroll**, as a 1px subtle rule or a 16 fade mask. There are no
  resting header rules and no blur.
- **Nested radii.** A menu at 16 with a 4 gutter has items at 12. Composer and user bubble
  are 22. Cards are 16 (large) or 12 (compact). Sidebar rows are 10; image tiles 16, or 12
  in groups.
- **Thread column.** Content 768 plus 16 padding a side; turns 16 apart, 4 within a group.
  The user bubble is at most 70% wide, padded 10 / 16. The composer floats 16 above the
  bottom over the scroller.
- **Panel sizing by clamps.** Sidebar 240–520, default 340; right panel 320 up to main
  − 352. Collapse when dragged under half the minimum.
- **Media sizing by aspect.** Single images cap at 400 / 480 / 768 by orientation. Several
  images share a row height of (width − 24) / 4 with 8 gaps. Carousels use 140-tall items,
  8 gaps and no snap.
- **Grids by container width**, not viewport: masonry 1→6 columns at 24/36/48/64/80rem;
  auto-fit `minmax(10rem,1fr)` with 12 gaps.
- **Dialogs** 250–450 wide, padding 20, radius 16, a little above centre, full screen under
  768.

## Not measured

- Live geometry of the installed app: it was running, so it was left alone.
- Whether the header sits in the title strip or the page in the chat view (`bn = Ae ?
  'titlebar' : 'page'`; `Ae` not traced).
- Rail width and when the rail shows (`V`, measured at runtime).
- Popover and menu offsets from triggers, and toast position.
- The library page grid (its classes are composed at runtime; only `grid-cols-1` and 40
  icon rows were found) and the GPT store.
- Which page uses the masonry grid.
- Dark colours of the web settings and menus, which were not re-measured.

## Sources

| Short name | What | Tag |
|---|---|---|
| `main-*.js` | `…/bundles/chatgpt-full/.vite/build/main-CLu1A25j.js` (Electron main: window options, traffic lights, vibrancy) | B |
| `index.html` | `webview/index.html` (startup loader, layer order) | B |
| `app-shared-*.css` | `webview/assets/app-shared-ae384120d279.css` (tokens, desktop and web overrides, menus, tooltips, dialogs, sidebar utilities) | B |
| `app-initial-*.css` | `webview/assets/app-initial-e7c27dd40beb.css` (shell module `_etoz9_2`, menus `_13e1t_2`, thread gutter) | B |
| `app-initial-*.js` | `webview/assets/app-initial-3ccf4886957f.js` (shell component, theme derivation `Des`/`kes`/`jes`/`Nes`, presets `d9o`/`r9o`, sidebar and right-panel clamps, class strings) | B |
| Feature chunks | `user-message-56c42e441c31.js` and `user-message-5f3d424c6182.css`; `thread-scroll-layout-b9dad2ad785e.js` and `-24b9bd243051.css`; `schema-5b00b9b22898.js`; `generated-image-gallery-e3f937045439.js`; `media-ff7524bbb13f.js`; `src-c3d02b9201fe.js` and `src-203e8c3c449a.css`; `es-2d013bf5b638.css`; `card-tile-d76dcde1f189.js`; `plugins-cards-grid-ce0262dcc035.js`; `home-suggestion-surface-6a9fbb75713d.js`; `settings-page-2ebc8049c322.js`; `settings-rows-9a011ebae311.css`; `projects-index-page-e4c8de42cf96.js`; `home-58555ba264e5.css` | B |
| chatgpt.com | Headless Edge 155, logged out, clean profile with no extensions or sync, 1440×900 and 390×844, light and dark by emulated `prefers-color-scheme` | M |
| Area evidence | `docs/research/BASELINE.md`, `docs/research/app-screens-2026-10-21.md`, `docs/specs/composer.md`, `docs/specs/message.md` | cited |
