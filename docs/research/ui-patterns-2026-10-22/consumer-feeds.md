# Consumer feeds, grids and shelves, 2026-10-22

How Spotify, Airbnb, Nike, YouTube and Apple compose content feeds, card grids, shelves, media, headers,
side panels and footers. This feeds the skills that direct how Area components are composed into whole UIs.
It adds to `docs/research/app-screens-2026-10-21.md` and does not repeat its settled values; where that file
tagged a value U, this file measures it.

Confidence: **B** read from Spotify's desktop bundle (`Spotify.app/Contents/Resources/Apps/xpui.spa`, CSS
only: the main app JS ships inside a V8 snapshot and is not readable); **M** measured live in headless Edge
with `getComputedStyle` / `getBoundingClientRect` (and, where noted, rules read from the page's own
stylesheets); **not found** when neither source had it. Widths are 1440 × 900 unless a row says otherwise.
All sites were logged out, with only necessary cookies. Every M value was re-measured in a clean Edge profile
(sync and extensions off; see Sources).

## Page shell

| Product | Regions | Top bar | Page margin (1440 / 1024 / 390) | Max content |
|---|---|---|---|---|
| Spotify | Grid `top-banner / global-nav / left-sidebar main-view right-sidebar / now-playing-bar`, columns `auto 1fr` (B). Panels are rounded containers on a `#000` ground (B) | 64 (M) | panels 8 from the window edge; inside the main panel, home 40 and other pages 24 (M) | `--content-max-width: 1955px` (B) |
| Airbnb results | Sticky header, then a list column and a sticky map | 152 incl. search; 136 at 1024 (M) | 48 / 32 / 24 (M) | none; the list and map split the width |
| Airbnb listing | Header, photo grid, two columns, footer | 80 (M) | centred | 1120 (M) |
| YouTube | Masthead, guide panel, content | 56 (M) | 24 from the guide (grid margin 16 + item margin 8) (M) | `--ytd-rich-grid-item-max-width: 700px` per item (M) |
| Nike home | 36 utility bar, 60 header, full-bleed hero, shelves | 60 + 36 (M) | 48 / 48 / 24 (M) | full bleed |
| App Store web | 260 left nav, main column | none on desktop; a 44 fixed bar on mobile (M) | 40 / 40 / 20 (M) | fills the main column |
| Apple TV web | 52 header, full-bleed hero, shelves | 52 (M) | 40 / 40 / 25 (M) | full bleed |

Spotify's shell details:
- Grid gap and padding are both `var(--panel-gap)`, computed to 8 (B, M).
- Panels: radius 8 (B `.nWqHVdNL4CdxyvxYNFI8`, `.BPRPH_jrStQIw2m2qfDl`). The main view is `#121212` (`--background-base`, B); the library panel sits on `#000` (M).
- The library panel opens at 280 in a fresh profile (M); its width is a JS number (`--left-sidebar-width: 280`). Its minimum and maximum widths are not in the CSS.
- Resize handle (B `.LayoutResizer__*`):
  - an invisible bar `var(--panel-gap)` wide that sits in the gutter;
  - on hover it shows a 1 px line at `calc(100% - 16px)` tall in `--essential-subdued` `#7c7c7c`, fading in over .15 s;
  - while dragging, the line turns white.
- The main view's `--content-spacing` is `clamp(16px, 16px + (w − 600px) / 424 × 8, 24px)` on its container width: 16 at ≤600 and 24 at ≥1024 (B `.TKq2Yidc5rgHzpJFRFYW`).

## Card grids

| Product / view | Technique | Columns (1920 / 1440 / 1024 / 390) | Column / row gap | Item width |
|---|---|---|---|---|
| Spotify "Show all" grids | `repeat(auto-fill, minmax(var(--min-column-width), 1fr))`, gap `var(--grid-gap)` (B) | not measured; the variables are set in JS | `--grid-gap` (JS) | `--min-column-width` (JS) |
| Airbnb results | Fixed column count per breakpoint, CSS grid (M) | 2 / 2 / 1 / 1 | 24 / 40 (M) | 429.6 / 307.2 / 440 / 342 (M) |
| YouTube rich grid | Flex wrap. Item `width: calc(100% / var(--ytd-rich-grid-items-per-row) − var(--ytd-rich-grid-item-margin))` with margin 0 8 and bottom `--ytd-rich-grid-row-margin` (M stylesheet). JS sets items-per-row from min and max item width | channel page 3 / 3 / 2 / list (M) | 16 / 32 (M) | 420 / 347.3 / 420; min 326.8–331.6, max 700 (M) |
| Nike PLP | 3 columns, 16 gutters (in the earlier file) | – | – | – |

Notes:
- The logged-out YouTube home has no feed ("Try searching to get started"). Its grid variables still read 3 per row at 1440, with a 36 row margin and 16 gutters (M). Grid values above come from the channel Videos grid.
- Airbnb gives the map about half the width:
  - 1440: list 638.4, map 657.6, 48 between them;
  - 1920: list 883.2, map 892.8;
  - 1024: one column of 440 and a 488 map;
  - 390: the map becomes a full-screen layer (M).
- The map is sticky at top 192 (176 at 1024), radius 20 (M).

## Card anatomy

| Card | Media | Radius | Overlays (inset from the media edge) | Text rows | Gaps |
|---|---|---|---|---|---|
| Spotify shelf card | 1:1, 171.5 inside a 195.5 card with 12 padding (M) | 6; artists round (M) | Play: a 48 `#1ed760` circle, bottom-right 8 from the right, shadow 0 8 8 rgba(0,0,0,.3), opacity 0 at rest (M) | title 16/400 white, clamp 2; subtitle 14 `#b3b3b3`, clamp 2 (M) | media→title 8 (B `.e-10860-card` row-gap 8); title→subtitle 4 (M) |
| Airbnb result | 4:3 (307.2×230.4) (M) | 20 (M) | Heart: 32 hit area, 24 icon, top 10 / right 12. Page dots: 6 px, white active / 60% white inactive, 11 pitch, shrinking to 5 then 4 at the ends, 12 above the bottom edge. Photo arrows: 32 circles at 90% white with shadow 0 2 4 rgba(0,0,0,.18), centred vertically, shown on hover. Badge pill top-left (M) | title 15/19/500 `#222`, clamp 1, with the rating right-aligned on the same row; then 15/19 `#6c6c6c` lines, clamp 1 (M) | media→title 9; between lines 2 (M) |
| Airbnb home shelf card | ≈20:19 (181.7×172.6) (M) | 20 (M) | heart as above | title 13/16/500, clamp 3; meta 12/16 `#6c6c6c` (M) | media→title 8; title→meta 2 (M) |
| YouTube video | 16:9 (M) | 12 (M) | Duration: bottom-right 8 in, 18 tall, 12/18/500, padding 1 4, radius 4, rgba(0,0,0,.6) with white text, the same in dark (M) | title 16/22/500, clamp 2 (max-height 44); meta 14/20 `#606060`, dark `#aaa` (M) | media→title 12; title→meta 4 (M) |
| YouTube watch-next row | 16:9 thumbnail at 247.5×139.2 beside the text (M) | 8–12 (M) | duration as above | title 14/20/500; meta 12/18 (M) | thumbnail→text 12; row pitch 147.2 (8 apart) (M) |
| Nike shelf tile | 1:1 (440), or 3:4 / 3:2 for editorial tiles (M) | 0 (M) | none | title 20/24/500; body 16/24; "Shop" link 16/24/500 (M) | media→title 16 (M) |
| App Store lockup | app icon 64 (M) | 25% (M) | none | name 15/20/600; subtitle 12/15 at 56% black; a "View" pill 13/18/700 `#007aff` (M) | 3 rows of 64, 24 apart (M) |
| Apple TV lockup | landscape 256×167; poster 2:3 152.5×228 (M) | 14 (M) | none | eyebrow 12 at 70% white; title 15/18/500 (M) | – |

Hover paint on Spotify and Airbnb cards was not measured (headless had no hover).

## Carousels and shelves

| Product | Section header | Item width rule | Visible + peek | Gap | Arrows | Snap / edges |
|---|---|---|---|---|---|---|
| Spotify | 48 row: title 24/700 (SpotifyMixUITitle), with "Show all" 14/700 `#b3b3b3` at the right; header→cards 8 (M) | Fixed: `--carousel-shelf-element-width: calc(var(--content-max-width) / var(--regular-shelf-max-count))`. The count is 10 for main width <2304, 11 for <1024 and 9 above (B 6746.css, 8810.css). Measured 195.5 (=1955/10) and 177.7 (=1955/11) (M) | Count varies with width: 3 at main 680, 5 at 936, 5 at 1096, 7 at 1576. A partial card peeks at the right; the last column carries 48 extra end padding (M) | 0; the 12 card padding gives 24 between images (M) | 32 circles `#1f1f1f`, 16 icon, 8 inside the panel edges, centred on the image (M) | Scroller `scroll-snap-type: inline mandatory` (M), items `scroll-snap-align: start` (B). Scrollbar hidden, `overscroll-behavior-x: contain` (B `.JIrO_Kklclbf_mnPX9Dh`). Edge fades: gradients from `--carousel-*-chevron-gradient` (`#121212`) to transparent, driven by a scroll timeline (B `.VdoAFBSgMkSkMmW0NgAk`) |
| Airbnb home | title 20/24/600 −0.18 (18 on mobile); arrows on the right of the title row; title→cards 16 (M) | `grid-auto-columns: calc(100% / N − gap × (N−1) / N)`. Homes: N = 7 / 5 / 2 at 1440 / 1024 / 390. Experiences: 10 / 5 / 3 (M) | Exactly N on desktop; on mobile the page margin shows the next card (M) | 12 for homes, 10 for experiences (M) | 28 circles `#f2f2f2`, 4 apart; prev at 50% opacity when disabled (M) | inline mandatory, `scroll-padding: 4px`. A 4 px inner padding with −4 margin keeps focus rings unclipped (M) |
| Nike home | 48 row with arrows at the right, 12 above the list (M) | `(viewport − 2 × 48 − 2 × 12) / 3`: 440 at 1440, 301.3 at 1024. Mobile: a fixed 300 at 390 and 430, 412 at 600 (M) | 3 on desktop plus the 48 right margin; mobile 1 + peek (M) | 12 margin-right (M) | 48 circles: `#f5f5f5` disabled, `#e5e5e5` enabled; 12 apart. None on mobile (M) | x mandatory, start, `padding-left` and `scroll-padding` 48 (24 mobile); 30 bottom padding (M) |
| App Store | h2 17/22/700 at 88% black; optional subtitle 15/22 at 56%; header→row 13 (M) | `calc(100% / N − gap × (N−1) / N)`. Spotlight N = 1. Lockups N = 3 / 2 / fixed 298. Ordinal N = 5 / 3 / 50% (M) | Exactly N on desktop, no peek. Mobile is a fixed width with 10 gaps, so the next item peeks (M) | 20 (24 for ordinal; 10 on mobile) (M) | Paddles 28×64, radius 6, opacity 0 until hover, centred vertically in the 40 gutter (M) | x mandatory, start, smooth. 15 padding with −15 margin so shadows are not clipped (M) |
| Apple TV | – | Landscape N = 5 / 4 / fixed 200; posters N = 8 / 6 / fixed 144 (M) | as App Store | 20, 10 on mobile (M) | as App Store (M) | as App Store (M) |
| YouTube chips bar | 56 tall, sticky at top 56 (M stylesheet) | chip content width; 32 tall, radius 8, padding 0 12, 14/20/500 (M) | – | 12 (stylesheet); 8 on the channel page (M) | 32 round buttons, 12 margins, behind 50 px fades (white → transparent; a dark variant) (M stylesheet) | overflow scroll, no snap |

## Image and video placement

| Context | Aspect | Fit / radius | Product |
|---|---|---|---|
| Music, album, artist tiles | 1:1 | radius 6 / round; shadow 0 8 24 rgba(0,0,0,.5) | Spotify (M) |
| Album / playlist header cover | 1:1, 232 | radius 4; shadow 0 4 60 rgba(0,0,0,.5) | Spotify (M) |
| Listing card | 4:3 | cover, radius 20, `#ddd` placeholder | Airbnb results (M) |
| Compact listing | ≈20:19 | radius 20 | Airbnb home (M) |
| Listing photo grid | 1120×476: a 560 hero plus four 272 tiles, 8 gaps | outer corners 12 only | Airbnb (M) |
| Mobile listing hero | full bleed 390×370.5 | the sheet overlaps it by 24 with 24 top radius; counter pill "1 / 30" 12/16/500 on rgba(34,34,34,.66), radius 4, padding 3 10 | Airbnb (M) |
| Video thumbnail | 16:9 | radius 12 (8–12 in the side list) | YouTube (M) |
| Video player | follows the video (a 4:3 video gave 996×747) | radius 12; controls 56 tall plus 3 padding, a 6 progress strip above | YouTube (M) |
| Channel banner | ≈6.2:1 (1070×172.5) | radius 16 | YouTube (M) |
| Marketing hero | 16:9 desktop (1440×810, 1024×576); 2:3 mobile (390×584) | cover, radius 0 | Nike (M) |
| TV hero | 16:9 desktop (1440×810); 390×686 mobile | full bleed | Apple TV (M) |
| Editorial / spotlight card | 16:9 | radius 17 | App Store (M) |
| Today card | 683.5×534 wide / 400.5×534 narrow | radius 17, shadow 0 3 9 rgba(0,0,0,.08) | App Store (M) |
| Product tile | 1:1 (earlier file: PDP 4:5) | radius 0 | Nike (M) |

Hero text sits inset at the page margin:
- Nike: headline 76/68.4 Futura, uppercase, white (40/36 on mobile). The CTA is a 36 pill (radius 30, padding 6 16, 16 px) placed 48 from the left and bottom (M).
- Apple TV: title 26/700 at 40 in (M).

Hero carousels:
- Nike: pause plus prev/next as 36 circles at 70% white. On mobile, 5 px dots 13 apart, inactive at 50% (M).

## Headers

| Product | Height | Search | Sticky |
|---|---|---|---|
| Spotify | 64 | 48 pill (radius 500), `#1f1f1f`, padding 12 96 12 48, 16 px. 474 wide at ≥1280; 283.9 at 1024; centred at 1920 (M) | always (part of the grid) |
| Airbnb | 152 at 1440 with the big search; filter pill 34 tall, radius 24, 1 px `#ddd`, padding 8 12, 12 px (M) | big search 850×66, radius 32 (M) | sticky top 0 (M) |
| YouTube | 56 | 640×40 field; 64×40 button, radius 0 40 40 0. Light: `#f8f8f8` with a 1 px `#d3d3d3` border. Dark: rgba(255,255,255,.08) with `#303030` (M) | fixed |
| Nike | 36 + 60 (M) | – | not sticky at the top (`position: relative`) (M) |

## Side panels and nav panels

| Product | Width | Collapse rule |
|---|---|---|
| Spotify library | 280 default, resizable (M) | rail and limits are set in JS; not found |
| Spotify right (now playing) | a 32 strip when closed, logged out (M) | width not found |
| YouTube guide | 240; rows 204×40 at 12 in (M) | 240 at ≥1312, a 72 mini guide (entries 64×76) from 791 to 1312, hidden below 791 (M stylesheet; observed at 1440, 1920 and 1024). The drawer is an overlay below 1312 |
| App Store nav | 260. Light: rgba(60,60,67,.03) with a 1 px rgba(0,0,0,.15) right rule. Dark: rgba(235,235,245,.03) with rgba(255,255,255,.1) (M) | becomes a 44 fixed top bar on mobile (M) |
| YouTube watch side column | 396 (min 320) at 1440, 320 at 1024. The primary column is min 640 (480) and max 1045.33 (869.33), with 16 margins (M) | stacks below the player when narrow (not measured) |
| Airbnb reservation card | 373.3 column (1/3 of 1120); the left column is 653.3 (7/12), about 93 apart (M) | sticky top 80. Aside radius 12, padding 24, shadow 0 6 16 rgba(0,0,0,.12). CTA 48 pill with a red gradient (M) |

## Footers and bottom bars

| Product | Layout | Type | Spacing |
|---|---|---|---|
| Spotify (inside the main view) | columns 169 wide, 24 apart, then a rule and bottom links (M); 40 top padding (B `.main-view-container__mh-footer-container`) | h4 16/700 (M) | `.footer` padding 8 24 40 at ≥992 (B) |
| Airbnb | 1280 max (80 margins at 1440); 12-column grid of 92 with 16 gaps; three groups each spanning 4 columns (416) (M) | heading 14/18/500; links 14/18/400 (M) | padding 48 0; link pitch 36 (M) |
| Nike | full width, padding 48 (48 24 on mobile) (M) | links 14/21/500 (16/28 on mobile) (M) | link pitch 33 (M) |
| App Store | one band, `#f2f2f2`, padding 14 40 (M) | 11 px (10 on mobile) (M) | – |
| Spotify player bar | 72 tall, three zones (B `dwp-now-playing-bar.css`): left 30% (min 180), centre 40% (max 722), right 30% (min 180) | – | logged out it is replaced by a 66 sign-up banner inside 8 padding (82 total) (M) |
| Airbnb mobile reserve bar | fixed bottom, with a full-width 48 pill (342 at 390, 24 margins) (M) | 16/500 | the tab bar under it has a 1 px `#ebebeb` top rule (M) |

## Detail pages

- Spotify album or playlist header:
  - Cover 232, 24 from the panel edge and 20 from its top.
  - Title column 24 right of the cover: type label 14, title 96/800 (SpotifyMixUITitle), meta 14 (M).
  - Two gradients: the cover colour to transparent in oklch (276 tall), then rgba(colour, .7) to transparent behind the action bar (173 tall) (M).
  - Play button 56, 48 below the header (M).
- Spotify track list:
  - Header row 36 plus a 1 px rgba(255,255,255,.1) rule, sticky at top 64 (M).
  - Columns `[index] 16px [first] … [var1] … [var2] … [last] 120px`, gap 16, padding 0 16 (M).
  - Rows 56 with no dividers; 40 thumbnails on playlists (M).
- Airbnb listing:
  - Title 26/30/500; section titles 22/26/500 at −0.44 (M).
  - Sections separated by 1 px `#ddd` rules, with about 48 above each title (M).
  - Amenities: 2 columns (8 side padding each). Rows pitch 48: a 24 icon, 16 to a 16/20 label, then 24 below (M).
  - "Show all" button: 48 tall, radius 12, `#f2f2f2`, padding 14 24, 16/500 (M).
- YouTube watch page:
  - Title 20/28/700; owner avatar 40 (M).
  - Action pills 40 tall, radius 20, rgba(0,0,0,.05). Like and dislike join as one segmented pill (M).

## Titles and copy

| Role | Spotify | Airbnb | YouTube | Nike | App Store |
|---|---|---|---|---|---|
| Page / hero title | 96/800 | 26/30/500 | 20/28/700 (watch) | 76/68.4 display | 34/40/700 (26/32 at 1024, 22/26 mobile) |
| Section title | 24/700 | 20/24/600 (results title 14) | – | 20/24/500 | 17/22/700 |
| Card title | 16/400, clamp 2 | 15/19/500 clamp 1; 13/16/500 clamp 3 | 16/22/500, clamp 2 | 20/24/500 | 15/20/600 |
| Meta | 14 `#b3b3b3`, clamp 2 | 15/19 or 12/16 `#6c6c6c` | 14/20 `#606060` | 16/24 | 12/15 at 56% |
| "See all" | 14/700 muted | arrows only | – | arrows only | not found |

Truncation is a line clamp on the title (1–3 lines) and the meta (1–2). No product wraps meta freely.

## Spacing grows outward

| Product | Inside a card | Between cards | Header→row | Between sections | Page margin |
|---|---|---|---|---|---|
| Spotify | 8, then 4 | 24 (12 + 12 card padding) | 8 | 24 | 40 home / 24 pages; panels 8 |
| Airbnb results | 9, then 2 | 24 columns / 40 rows | – | – | 48 / 32 / 24 |
| Airbnb home | 8, then 2 | 12 | 16 | ≈40 | 48 / 32 / 24 |
| YouTube | 12, then 4 | 16 columns / 32 rows | chips bar 56 | – | 24 |
| Nike | 16 | 12 | 12 | – | 48 / 24 |
| App Store | 24 between lockup rows | 20 | 13 | 45 (32 + 13) | 40 / 20 |

The steps roughly double at each level outward, and the row gap is larger than the column gap whenever text
sits under the media.

## Light and dark

| Product | Light | Dark |
|---|---|---|
| Spotify | dark only | ground `#000`, panel `#121212`, highlight `#1f1f1f`, subdued text `#b3b3b3`, tinted `#ffffff1a` (B `.encore-dark-theme`) |
| YouTube | `#fff`; chip selected `#0f0f0f` with `#f1f1f1` text; chip rest rgba(0,0,0,.05) | `#0f0f0f`; chip selected `#f1f1f1` with `#0f0f0f` text; chip rest rgba(255,255,255,.1); meta `#aaa` (M) |
| App Store | page `#f5f5f7`, text at 88% / 56% black | page `#151515`, text at 92% / 64% white. Editorial cards keep their own colours (M) |
| Airbnb, Nike | light only | – |

## Corrections to the 2026-10-21 file

- The Spotify values tagged U there (8 gutters, radius 8, 232 cover, 96/800 title, 56 rows) are confirmed (M).
- The now-playing bar is 72 (B).
- The library panel opens at 280 in a fresh profile, not 331. The 331 was read in a profile carrying the owner's synced state.
- Airbnb listing values hold: 1120 content, a 476 photo grid at radius 12, a 372 card at radius 12 with a 0 6 16 shadow (M).
- Airbnb result and home cards are radius 20, not 12 (M).

## Patterns worth adopting

Rules a composition skill can direct, with values to adapt to Area's type 13, Compact.

1. **Pick a shelf width rule, not a breakpoint table.** Use one of two:
   - N per view: `grid-auto-columns: calc(100% / N − gap × (N − 1) / N)`, with N stepping at container widths (Airbnb, App Store, Apple TV, Nike);
   - a fixed item width taken from the max content width, so the count varies and the last card peeks (Spotify, 1955 / 10).
   Default to N per view. Use fixed widths on mobile so the next item peeks: 298 of 390 (App Store), 300 (Nike), 200 / 144 (Apple TV).
2. **Snap to the start, with padding equal to the page margin.** Use `scroll-snap-type: x mandatory`, `scroll-snap-align: start` and `scroll-padding` = page margin. Hide the scrollbar and contain horizontal overscroll.
3. **Leave room for rings and shadows inside scrollers.** Use an inner padding of 4–15 with an equal negative margin (Airbnb 4, App Store 15), so focus rings and lifts are not clipped.
4. **Put arrows in one of two places, never both.**
   - Header-row buttons at the right of the title, as a pair 4–12 apart (Airbnb 28, Nike 48).
   - Edge paddles centred on the media, shown on hover (Spotify 32 circles 8 in; App Store 28×64 at radius 6 in the gutter).
   A disabled arrow is 50% opacity or a lighter fill. On touch, drop the arrows.
5. **Use edge fades only on immersive or dark surfaces, or on chip rows.** Spotify fades to the panel colour; YouTube chips use 50 px fades. Elsewhere, clip at the page margin.
6. **Keep the section header to one row.** Title 17–24 bold at the left; at the right, a muted "Show all" link (14 bold) or the arrows. Header→row 8–16; between sections 24–48.
7. **Make the column gap smaller than the row gap in grids with text under the media.** Airbnb 24/40; YouTube 16/32. Prefer fixed column counts per container width over auto-fill when the media aspect is fixed. YouTube's flex `100%/N − margin`, with a JS-chosen N bounded by min and max item width, is the fluid version.
8. **Cards are media first with uncontained text.** All five products put the title and meta under the media with no card surface. Round only the media (6 music, 12 video, 14–17 Apple, 20 Airbnb, 0 Nike). Clamp the title to 1–2 lines and use muted meta.
9. **Inset overlays 8–12 from the media edge.** This covers duration badges, hearts, play buttons and page dots. Reveal actions on hover (Spotify play, Airbnb photo arrows), and give overlay controls a white-90% or brand fill with a soft shadow.
10. **Choose the media aspect by content type.** 1:1 audio and products; 4:3 places; 16:9 video, heroes and editorial; 2:3 posters and mobile heroes; 4:5 product detail.
11. **Layer-container shell.** Panels at radius 8 on a near-black ground, 8 gaps and 8 outer padding. Make the resize handle the gutter itself, with a 1 px line on hover. This suits Area's dark-near-black preference.
12. **Detail page: 7/12 content beside a 4/12 sticky aside, with a 1/12 gutter.** Make the aside sticky at the header height plus a small gap. On mobile the aside becomes a fixed bottom bar with one full-width 48 pill.
13. **Collapse the nav panel in three steps.** Full (240–260) → icon rail (72) → hidden or a top bar. YouTube switches at 1312 and 791.
14. **Player bar.** 72 tall with three zones of 30 / 40 / 30%: the sides min 180, the centre max 722.
15. **Footer.** A 12-column grid with link groups spanning 4. Heading 14 medium; links 14 at a 33–36 pitch; padding 48 top and bottom. Use an accordion on mobile.
16. **Grow spacing outward by roughly ×2 per level:** card inside 4–12 → between cards 12–24 → section 24–48 → page margin 24–48.

## Not measured

- Spotify:
  - library panel min, max and collapsed widths;
  - right now-playing panel widths;
  - the live now-playing bar (logged out shows a sign-up banner; 72 is from the bundle);
  - `--min-column-width` and `--grid-gap` values, card hover paint and the mobile web player.
  These live in the main JS, which is a V8 snapshot and was not read.
- YouTube:
  - logged-out home feed (empty), so its avatar row and columns per viewport were not measured live;
  - chips-bar arrows, which never rendered because the chips fit (values are from its stylesheet);
  - watch-page stacking on narrow screens.
- Airbnb: the category icon bar (the redesigned home has none), the photo lightbox, and hover states.
- Nike: the PLP and PDP were not re-measured (see the earlier file); section-title text in the shelf header row was not found.
- Apple: paddle hover state and the App Store "See all" link (not found).

## Sources

| Source | How it was read |
|---|---|
| Spotify desktop bundle | `xpui.spa` copied and unzipped to the scratchpad; CSS grepped. Files: `xpui-snapshot.css`, `dwp-now-playing-bar.css`, `6746.css`, `8810.css`, `3314.css`. Class names are hashed; selectors are quoted above |
| open.spotify.com | live: home, `/playlist/37i9dQZF1DXcBWIGoYBM5M`, `/album/4aawyAB9vmqN3uQ7FjRGTy`; 1024, 1280, 1440, 1920 |
| airbnb.com | live: home, `/s/Paris--France/homes`, one public listing page; 390, 1024, 1440, 1920 |
| nike.com | live: home; 390, 430, 600, 1024, 1440 |
| youtube.com | live: home (empty logged out), `/@YouTube/videos`, a search results page, `/watch?v=jNQXAC9IVRw`; light and emulated dark; the page's stylesheet rules for grid, chips and guide |
| apps.apple.com, tv.apple.com | live: `/us/iphone/today`, `/us/iphone/apps`, the tv.apple.com home; 390, 430, 600, 1024, 1440; light and dark |

All live reads used headless Microsoft Edge 155 over CDP. The scripts are kept in the scratchpad
(`scripts-consumer/`). The first profile signed itself into the owner's Edge account and synced its
extensions. Everything measured in it was discarded and re-measured in a fresh profile with sync, extensions
and implicit sign-in turned off. The re-run matched except for Spotify's library width (above). No site was
signed into and nothing was added to a cart.
