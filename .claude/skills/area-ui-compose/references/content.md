# Content: columns, feeds, grids, shelves, media

What fills the content region, and the rules for each pattern. Evidence: `docs/research/ui-patterns-2026-10-22/`.

## Choose the pattern

| The content is… | Pattern | Area |
|---|---|---|
| Prose, a conversation, a form, settings | **Reading column** | `Stack` in a centred column |
| Sections of mixed blocks (docs, a gallery tab, a dashboard) | **Feed of sections** | `SectionHeading` over one block each |
| Many like items to browse and open | **Card grid** | `AssetGrid`, `FileGrid`, or CSS grid of `Card`s |
| Items of uneven height (images, pins) | **Waterfall** | `AssetGrid layout="waterfall"` |
| A row of items to sample, with more elsewhere | **Shelf** | a horizontal scroller of `Card`s (gap); `CardCarousel` inside a card |
| Records with fields | **Table** | `Table` (`flush`, `baseline`) |
| Items moving through states | **Board** | `Board` |
| A long article with sections | **Docs page** | nav column + reading column + `TableOfContents` |
| Free placement, zoom | **Canvas** | full-bleed region with floating `Toolbar` and `ZoomControl` |

## Widths

| Measure | Use | Measured |
|---|---|---|
| Reading, 660–770 | prose, a thread, settings, forms | Notion text 708 (720 container); ChatGPT thread 768 + 16 a side, settings 768 (plain pages 672); Polaris 662, Primer 768, Radix 688 |
| Wide reading, 800–960 | an article with media, a center peek | Notion help article 804; Notion center peek ≤ 960 |
| Structured, 1120–1296 | feeds, grids, dashboards | Area's Canvas 1236 (four 300 cards); Figma Community 1216; Untitled, Primer 1280; Atlassian 1296 |
| Fluid | boards, tables, canvases | Atlassian fluid; Notion databases span the frame |

- **Centre the measure** in the region; on a narrow window the region's margin takes over (24 on a phone: Notion,
  Figma).
- **Wide blocks may break out of a reading column**, back to the text edge: Notion's databases span the frame but
  start their content on the text column; ChatGPT's wide blocks reach 896 from a 768 thread. The full-bleed pattern is
  a grid `1fr min(100%, measure) 1fr` with breakout children (Mantine).
- **Prose never goes full width** by default; Notion's "full width" still keeps 96 a side.

## Feed of sections

Area's Canvas is the reference implementation (`PRODUCT_UI.md`, "The Canvas is a feed"): one column, at most 1236 and
centred; each section a heading (title, muted count on collections, an optional one-sentence lede) over **one** block;
cards 12 apart (at least 260 wide, at most four across), heading 12 over its block, sections 40 apart, margin 16, each
measured to what is drawn.

- One block per section. Two blocks under one heading make the heading ambiguous; give the second its own heading.
- A section's actions ("Show all", "Browse N", add) sit at its title row's end (Notion's template feed, Figma
  Community).
- Marketing and storefront feeds keep the same shape with bigger rings: subtitle 8 under the title, block 16 under the
  heading, 72–96 between sections (Notion templates 72, Figma Community 96).

## Card grid

- **Columns come from a minimum card width**, never a fixed count: `repeat(auto-fill, minmax(min(<min>, 100%), 1fr))`.
  Count the columns from the container, not the viewport (ChatGPT's grids and shadcn's dashboard use container
  queries; a side panel opening must not leave a grid built for the full window).
- **Minimum widths by card kind:**

  | Card | Minimum | Measured |
  |---|---|---|
  | Suggestion, small tile | 160 | ChatGPT `minmax(10rem, 1fr)`; Notion small gallery 162–192 |
  | Media card, gallery | 280–380 | Notion large gallery 280–377; Figma Community 3 × 384 |
  | Gallery card (Area's app) | 260 (277–300 in a 1440 window), at most four across | PRODUCT_UI.md, The Canvas is a feed |
  | List card (icon + text + action) | 2 columns of about 590 | Figma Community Skills |
  | Video card | about 330 (max 700) | YouTube: 3 a row at 1440, 2 at 1024 |
  | Listing card with a photo | about 300–440, fixed counts per width | Airbnb 2 / 2 / 1 / 1 at 1920 / 1440 / 1024 / 390 beside a map |

- **Gap: 12–16 in an app, 24–32 on a site.** Area's app 12; Notion gallery 16; ChatGPT 12 (16 from 640); systems
  16–24; Figma Community media tiles 32; Airbnb 24.
- **Rows and columns share one gap for framed cards. Media with text under it takes a larger row gap**, so the text
  reads with its own image, not the one below: YouTube 16 columns / 32 rows, Airbnb 24 / 40.
- A grid is one Tab stop with arrows inside when it is a collection to choose from (`AssetGrid`, `FileGrid`; rule 5).

### Card anatomy in a feed

| Part | Rule | Measured |
|---|---|---|
| Media | one ratio per grid; `object-fit: cover`; the frame carries the corner | 16:9 (Notion gallery, Figma tiles and file cards); 1200:630 (Notion templates); 1:1 (Area's specimens, ChatGPT tiles) |
| Media edge | a 1px ring drawn as a shadow or inset, so the image keeps its size | Figma `#e6e6e6` box-shadow ring; Notion a rule under the cover |
| Text under media | title one step up, meta one step down in muted ink, 8–12 below the media, 2–4 between them; titles clamp to 2 lines, meta to 1 | Figma 13/24 500 over 11/16 at 50%; Notion 15/22.5 500; YouTube 16/22 500 over 14/20, 12 then 4; Spotify 16 over 14, 8 then 4 |
| Overlays on media | a fixed inset from the media's corner (8–12); a badge on a dark 60% plate; an action revealed on hover | YouTube duration 8 in; Spotify play 48, 8 in, on hover; Airbnb heart 10 / 12 in, page dots 12 above the bottom |
| Text in the card | Card's text inset (`Card`); title then description joined | Area Card |
| Corner | the card's corner, the media's = card − inset when it sits inside | Notion 10; Figma tiles 6, standalone cards 13 |
| Hover | the card lifts (shadow fades in); the image never scales (rule 2) | PRODUCT_UI.md rule 3 |

## Waterfall (masonry)

Use for items whose height varies with their content (images at their own ratio). `AssetGrid layout="waterfall"` puts
each card in the shortest column in reading order. Columns by container width: ChatGPT 1 → 6 at 384 / 576 / 768 / 1024
/ 1280, gap 12 (16 from 640). CSS `grid-lanes` ships only in Safari (2026-10); don't depend on it.

## Shelf (carousel)

A shelf shows a sample of a set in one row, with the rest a scroll or a "Show all" away.

- **Prefer a grid.** Notion uses carousels only where a grid can't fit (its testimonials are a 3-up grid at 1440 and
  a carousel below it). A shelf is right when the set is long and the page shows several sets (a home of sections).
- **Item width: a count per view or a fixed width.** Two methods, both measured:
  - **N per view**, `calc(100% / N − gap × (N − 1) / N)`, N stepping down with the width: Airbnb homes 7 / 5 / 2, App
    Store lockups 3 / 2, Nike `(viewport − margins − gaps) / 3`. The row is exact on desktop; paging moves by N.
  - **Fixed width** with a peek: Spotify (content width / 10, 195.5), Figma's phone shelf 282, App Store and Nike on
    phones (298, 300).
  Use N per view for a storefront on a pointer device, a fixed width with a peek on touch and in apps.
- **Show that it continues on touch:** the last visible item is cut (a peek). Area's `CardCarousel` shows 3.25;
  Figma's phone shelf peeks 68 of 282; ChatGPT peeks 10% under 576; Material keeps peeking items 40–56.
- **Align the first item to the page's edge**, with the scroller bleeding to the region's edge: padding = the margin,
  `scroll-padding-inline` = the margin, `scroll-snap-type: x mandatory` (touch) or proximity (pointer), items
  `snap-align: start`.
- **Gap:** the grid's gap (8–16; Airbnb and Nike 12, Apple 20).
- **Header:** title, "Show all" at its end, arrows beside it; the row 8–16 below (Spotify 48 header and 8; Airbnb 16;
  Nike 12).
- **Controls:** on pointer devices, previous and next round ghost `Button`s in the header row (Airbnb 28, Nike 48), or
  over the shelf's ends on hover (Spotify 32 centred on the images, App Store 28 × 64 paddles; ChatGPT shows them only
  on hover or focus); disabled at the ends; none on touch. Edge fades only where items run under the arrows (Spotify,
  YouTube's chips 50).
- **Padding for rings and shadows:** pad the scroller a few px inside its clip so focus rings and lifts aren't cut
  (Airbnb 4, App Store 15). The scrollbar is hidden; keyboard users
  reach items by Tab and the arrows still page.
- **No dots** unless items are slides of one thing (a hero); then a small pill of dots under or over it.

## Media placement

| Context | Rule | Measured |
|---|---|---|
| An image in prose | the column's width, centred when narrower; caption under it, muted, small text | Notion images 704 in a 720 column, caption 14/19.6 6 below |
| A generated or attached image | capped by orientation | ChatGPT: portrait ≤ 400, 1–2 ratio ≤ 480, panoramic ≤ the column |
| Several images in a message | one row height, natural ratios, 8 apart | ChatGPT row height (width − 24) / 4 |
| A cover | full bleed, `cover`, about a third of the window height | Notion 30vh, 200 on a phone; the icon overlaps it by 42 |
| A hero | 2:1 or 16:9, the page's corner | Figma resource page 2:1, radius 6 |
| Video | 16:9, at most 640 in a thread, controls over it | ChatGPT 640; `VideoPlayer` |
| Thumbnails in rows | square, a small corner | ChatGPT 56 at radius 10 |
| A lightbox | the media at fit on a dark backdrop, a light blur | ChatGPT backdrop blur 4 |
| A listing's photo grid | one hero and four tiles, 8 gaps, only the outer corners rounded | Airbnb 1120 × 476, outer 12 |
| Product media | 1:1 in a grid, 4:5 on the detail page, square corners | Nike |
| Music and podcasts | 1:1 (round for people), a deep soft shadow | Spotify |
| Phone hero | full bleed, the content sheet overlapping it by 24 with a 24 corner | Airbnb |

Rules: a set of media shares one ratio; the frame carries the corner and the edge, the image fills it; media inside a
card sits at the card's media inset (`Card`, `Figure`); never scale media on hover.

## Tables, boards, docs pages

- **Table:** rows of the `ui-row` height, header in muted ink with no fill, rules between rows only where the table is
  read across (Notion 36 rows, 1px warm rules, header muted). A table in a reading column may bleed to the region with
  its first column on the text edge (Notion). Area's lists on a surface are the default framed `Table` (PRODUCT_UI.md
  rule 11, owner 2026-10-22, replacing `Table flush`); facts go in tables (rule 17).
- **Board:** fixed-width columns that scroll sideways rather than shrink (Notion 276 wide, 12 apart, cards 260; still 276
  on a phone). `Board`.
- **Docs page:** nav 280 | article 804 | contents 200, gaps 62 and 32; both side columns sticky; the contents mark the
  current section with a 2px start bar; drop both side columns under about 1200, keeping the article centred (Notion's
  help centre). `Nav`, `TableOfContents`.

## Empty and loading

One `EmptyState` per region, centred in the region's measure, naming the query or the missing thing (rule 10).
Loading keeps the layout: `Skeleton` blocks at the real blocks' sizes, never a centred spinner for a whole page.
