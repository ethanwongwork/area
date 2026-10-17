# Round 36: Figure and Infobox variants, Reference list numbering (2026-10-17)

Three owner questions after round 35:

1. Figure: "Are there other variants that need to be created?"
2. Infobox: "Other variants needed?"
3. Reference list: "i actually prefer numbers and the numbers themselves aligning with the text on top, i dont like
   huge indents."

This builds on `figure-infobox.md` and `reference-list-toc.md` (same folder) and does not repeat their tables.

Method: public source read at a pinned commit (`repo@sha path:line`), public product CSS bundles fetched with curl
(no sign-in), and two read-only measurements in the built-in browser on public pages: a public Notion page
(`genuinehealthcare.notion.site/Website-…`, dark theme) and a public Perplexity Discover article (its "3 sources"
panel was opened; no settings or cookie choices were touched). Anything not pinned or measured is marked
**unverified**. The rule for recommending an option: shipped by at least 2 relevant sources, and it fits a product UI
(Notion / ChatGPT / Figma register).

---

## 1. Figure: which options ship

### Sources

| Id | What | Pin |
|---|---|---|
| notion | Notion image / video / embed block | notion.com/help/images-files-and-media (help text): caption ("caption icon", grey text under the block); align left / center / right; resize by dragging edge guides; crop and shape mask; alt text; replace; "Original"; download; full screen; side by side only by dragging into columns; galleries only as a database view |
| mintlify | Mintlify `<Frame>` | mintlify.com/docs/components/frames: props `caption` (centred under the content, Markdown), `hint` (text before the frame), `className`; takes `<video>` (autoplay adds loop, muted, playsInline) |
| docc | Apple DocC `@Image`, `@Video`, `@Row` | swiftlang/swift-docc@6bcb354 `Sources/SwiftDocC/Semantics/Media/ImageMedia.swift:20-41` (source, alt, caption child), `VideoMedia.swift:22-50` (source, alt, caption, **poster**), `Semantics/Reference/Row.swift` (multi-column rows of media) |
| carbon | Carbon for IBM.com image and video player | carbon-design-system/carbon-for-ibm-dotcom@16b1d35 `packages/web-components/src/components/image/image.ts:119-153` (`border`, `lightbox`, `heading` caption, `copy`); `video-player/video-player.ts:236-290` (`hide-caption`, `aspect-ratio`; the caption is name + duration) |
| ghost | Ghost Casper / Koenig cards | TryGhost/Casper@c50043f `assets/css/screen.css:1358-1369` (`.kg-width-wide`, `.kg-width-full` grid columns), `:1590-1617` (embed card, gallery images), `:1653-1696` (figcaption, captions on wide / full) |
| substack | Substack image block | `substackcdn.com/bundle/theme/main.1eb68f564c3d88089d8b.css` and `static/css/48297.c82543ba.css`: `.image2-inset`, `.image2-full-screen` (`width: calc(50vw + 50%)`), `.image2-align-left/right`, `.image2-offset-left/right`, `[data-attrs*="width":"wide"]` and `"full"`, `captioned-image-container`, gallery classes (`gallery-…`, `galleryImage-…`) |
| medium | Medium image layouts | inset, outset (wide), full width, and a grid of images, each with a caption: **unverified** (help.medium.com returned 403) |
| tw-prose | Tailwind Typography | tailwindcss-typography@e3714a3f `src/styles.js`: styles `figure`, `figcaption`, `img`, `video` alike; nothing else |
| shadcn | shadcn/ui `AspectRatio` | one prop, `ratio` (Radix AspectRatio); no caption |
| docusaurus, nextra | docs frameworks | plain Markdown images; no caption component in core: **unverified** beyond the docs index |
| m3, polaris, primer, atlassian, apple-hig | design systems | no figure component (Polaris ships `MediaCard` and `VideoThumbnail`, which are Cards; Atlassian `Image` is `src` + `srcDark`, no caption) |

### Options against sources

| Option | Shipped by | Count | Product register? |
|---|---|---|---|
| **Caption on / off** (caption optional) | Notion, Mintlify, DocC, Carbon (`hide-caption`), Ghost, Substack, Tailwind | 7 | yes |
| Caption position: below | all of the above | 7 | yes (only one position ships; Mintlify's `hint` is a lead-in, not a caption) |
| Caption above / overlay | MUI ImageListItemBar overlay (prior survey) | 1 | no |
| **Media type: video** (with poster) | Notion, Mintlify, DocC (`poster`), Carbon, Ghost, Tailwind | 6 | yes |
| **Media type: embed / iframe** | Notion, Ghost embed card, Substack | 3 | yes, but the embed is a separate block in each (Notion "embed", Ghost `kg-embed-card`); the figure only frames it |
| **Width: content / wide / full-bleed** | Ghost (`kg-width-wide/full`), Substack (`wide`/`full`, `image2-full-screen`), Medium (unverified) | 2 pinned | **editorial only**: wide / full need a page grid wider than the text column. No product-UI source ships it |
| Resizable width (fraction of the column) | Notion (drag guides) | 1 | Notion only |
| Alignment start / center / end | Notion, Substack (`image2-align-left/right`) | 2 | yes, but round 34 removed centring and Notion's default is start |
| Aspect ratio (fixed box, crop to fit) | shadcn, Carbon video (`aspect-ratio`), Notion crop | 3 | yes, as a media-slot constraint |
| **Edge on the media** (hairline) | Carbon `border`, Mintlify frame well | 2 | removed in round 34 at the owner's request |
| Rounded media corner | Mintlify (`rounded-xl`), Notion (unverified) | — | already Area's media corner, not an option |
| Credit / attribution line | Carbon `copy` (a second line), Ghost (`figcaption strong`/links only) | 1–2 | weak: every source renders credit as part of the caption text |
| Multi-image (row or gallery) | DocC `@Row`, Ghost gallery card, Substack gallery, Medium grid (unverified), Notion columns | 4 | yes |
| Lightbox / view full size | Carbon `lightbox`, Notion "Full screen" / "Original" | 2 | yes, but it is behaviour on the media, not a visual variant |

### Recommendation: Figure

Keep one form. Add only these, all as content or slot options, not new looks:

| Add | Why (≥2 sources, product register) | Area shape |
|---|---|---|
| **Caption optional** | 7 sources | `caption` absent → no caption row and no 8 gap. Already allowed in the React API if caption is optional; make sure the demo shows one tile without it |
| **Video media** | 6 sources | the media slot takes `<video>` (with `poster`) as well as `<img>`; same corner, same caption. One tile |
| **Aspect ratio** | 3 sources (shadcn, Carbon, Notion crop) | an optional `ratio` on the media slot (`object-fit: cover`), e.g. 16 / 9; no new paint |
| **Gallery (row of media, one caption)** | 4 sources | a later, separate composition ("Figure group" or `Figure` with several media in a row, gap 8, one shared caption). Only if the owner wants it; it is a layout, not a Figure variant |

Do **not** add: wide / full-bleed widths (editorial page grids only: Ghost, Substack, Medium), caption above or
overlay (1 source), a separate credit line (credit lives in the caption), an embed variant (embeds are their own
block), centred alignment or a border (both removed in round 34; Notion starts and draws none).

---

## 2. Infobox: which options ship

### Sources

| Id | What | Pin / evidence |
|---|---|---|
| gh-about | GitHub repo sidebar | `github.com/vuejs/vitepress` server HTML: `h2.sectionHeading…[data-variant=small]` sections "About", "Releases", "Sponsor this project", "Contributors"; About = description, website link, topic chips, then **icon-led meta rows** (Readme, License, Activity, Stars, Watchers, Forks) with no label column. A header gear (edit) appears for owners only, and "+ N releases / contributors" footer links: **unverified** in this fetch (lazy-loaded / signed out) |
| appstore | App Store "Information" | `apps.apple.com/us/app/notion-notes-tasks-ai/id1232780281` HTML: `<dl class="grid">` with `--grid-small: 2; --grid-medium: 3` columns, row gap 24, column gap 20; CSS `assets/index~BS22QqNeqy.css`: `dt.svelte-z7zy89{color:var(--systemSecondary);margin-bottom:4px}` → **label above value, muted, 4 apart**; "Compatibility" value is a `<details>` that **expands** |
| notion-props | Notion database page layout | notion.com/help/layouts: a heading with up to 15 **pinned properties**; a "Property group" in the page or moved to the right **details panel**; **sections** to organise properties (collapsible, per the help text's search note); show / hide per property |
| radix | Radix Themes DataList | radix-ui/themes@1faff10 `packages/radix-ui-themes/src/components/data-list.props.tsx:9-16` (`orientation: horizontal | vertical`, responsive), `:20-23` (size 1-3); `data-list.css:98-111` (vertical: gap `--space-1` = 4), `:120-142` (horizontal: label **min-width 120**) |
| chakra | Chakra UI DataList | chakra-ui/chakra-ui@fa9696f `packages/react/src/theme/recipes/data-list.ts:20-46` (`horizontal`: label minWidth 120, gap 4 tokens; `vertical`: column, gap 1), `:73-93` (variants `subtle` / `bold`, default **vertical**) |
| antd | Ant Design Descriptions | ant-design/ant-design@3fb9b07 `components/descriptions/index.tsx:67-79`: `bordered`, `size`, `title`, **`extra`** (header actions), `column` (responsive count), **`layout: horizontal | vertical`** |
| google-kp | Google knowledge panel | large image (or image strip) on top, title, subtitle, short description with source link, inline "Label: value" rows, action buttons (Website, Directions, Save, Share), "People also search for" footer: **unverified** (no pinned source) |
| jira | Jira issue view | a "Details" panel of label-left / value-right fields that collapses, with pinned fields: **unverified** (support.atlassian.com, not fetched) |
| linear | Linear issue sidebar | property buttons (icon + value) without a label column; "Labels", "Project" headed groups: **unverified** (requires sign-in) |
| polaris | Polaris DescriptionList | term / description pairs, `gap` tight / loose; no header or media (prior survey) |

### Options against sources

| Option | Shipped by | Count | Fit |
|---|---|---|---|
| **Stacked layout** (label above value) | App Store (4 gap), Radix `vertical`, Chakra `vertical` (default), Ant `layout=vertical` | 4 | yes: for narrow columns (a 240 sidebar, phone width) |
| Label column width 120 (horizontal) | Radix 120, Chakra 120, Area's own 120 | 3 | already Area's |
| **Header actions** (button(s) beside or under the title) | Ant `extra`, GitHub About gear (owner only, unverified), Google KP action row (unverified), Notion "View details" | 2 pinned + 2 unverified | yes: one icon button at the title's end edge (edit, more) |
| Media: large image vs avatar / icon | large: Google KP (unverified), Wikipedia; small/avatar: GitHub (owner avatar in Contributors only), App Store (app icon sits in the page header, not the Information list) | 1–2 each | weak: no product ships both as a switch; Area's media slot already takes any size |
| **Footer link** ("+ N more", "See all") | GitHub "+ N releases/contributors" (unverified), Google "People also search for" (unverified), Notion "N more properties" (unverified) | 0 pinned | not yet: needs a pin before recommending |
| **Collapsible sections** | Notion sections (help text), App Store expandable value (`<details>`), Jira Details (unverified) | 2 pinned | yes, as a section-level option using Area's Disclosure / Section heading pattern |
| Icon-led rows (icon + value, no label) | GitHub meta rows, Linear properties (unverified) | 1 pinned | it is a List with icons, not an Infobox row; skip |
| Multi-column grid of facts | App Store (2–3 columns), Ant `column` | 2 | page-width layouts only; an infobox is a sidebar, so skip |
| Bordered table look | Ant `bordered` | 1 | skip (Area's framed option already covers the edge) |

### Recommendation: Infobox

| Add | Evidence | Area shape |
|---|---|---|
| **`layout: stacked`** (label above value) | App Store, Radix, Chakra, Ant | label `fg-muted` on its own line, value under it 2–4 apart (App Store 4, Radix space-1 = 4); rows 8–12 apart. Default stays `inline` (the 120 column). Optionally switch automatically under a container width (Radix's orientation is responsive) |
| **Header action** | Ant `extra`, GitHub gear, Notion | an optional slot at the title row's end: one ghost icon button (Area's `size-sm`), top-aligned to the title's first line |
| **Collapsible section** | Notion sections, App Store `<details>`, Jira (unverified) | a section can be collapsed through its heading (Section heading + Disclosure chevron); collapsed shows the heading only |

Do not add: a media "size" switch (no product switches; the slot takes what it gets), footer links (not pinned yet),
icon-led rows (that is List), multi-column fact grids (page-width only), a bordered table.

---

## 3. Reference list: numbers flush with the text above

The question is whether the number starts at the content's left edge (the same x as the heading and paragraph
above) or hangs in an indent with the text further in.

### Sources

| Id | Number at the content's left edge? | Number box → text | Ink | Weight / figures | Wrap | Pin |
|---|---|---|---|---|---|---|
| substack | **Yes.** `.footnote` is a flex row with no padding; the number is the first item | number `display:block; min-width: 24px; margin-right: 6px` → **text 30 in** at a ~90% body (≈ 15–16 px) | the number is a link (`a.footnote-number`); publication link ink (accent) **unverified** for this class | regular; no tabular rule | **hangs** under the text (`.footnote-content` is the second flex item) | `substackcdn.com/bundle/theme/main.1eb68f564c3d88089d8b.css`: `.typography .footnote{display:flex;border-top:1px…;padding-top:1.5em;font-size:90%;flex-direction:row;align-items:baseline}`, `.footnote .footnote-number{display:block;margin-right:6px;min-width:24px}`; HTML `astralcodexten.com/p/in-continued-defense-of-effective` `<div class="footnote"><a class="footnote-number">1</a><div class="footnote-content">` (no period) |
| notion | **Yes.** Measured: paragraph text starts at x 160 (block 152 + 6 padding + 2 leaf padding); the list's marker box also starts at **160** (block 152 + 6 + row `padding-inline-start: 2px`) | marker box **24 wide, centred** (`notion-list-item-box-left`, `width: 24px; justify-content: center`), text leaf `padding-inline-start: 6px` → **text 30 in** (x 190) at 16 / 24 | marker = text ink (`rgb(240,239,237)` in dark, same as the text) | numbered marker is `"1."` in the same box (**unverified**: page had bullets only; the box is shared by bulleted and numbered blocks); tabular **unverified** | **hangs** (text is the second flex item) | measured in the built-in browser, `genuinehealthcare.notion.site/Website-128bfe6e1dbe80a39fa6fb11c05b321c`, `.notion-bulleted_list-block` inline styles |
| perplexity | **Yes.** Measured in "3 sources": group heading at x 1020, each row's favicon at **1020** (row 1012 + 8 padding) | favicon **16** → text at **1044 (16 + 8)**; domain 12 / muted over a 14 title | domain `rgba(11,40,51,.75)` muted, title `rgb(11,40,51)` default | regular 400 | title **hangs** under the text column (1044) | measured, `perplexity.ai/discover/top/faa-controllers-union-agree-on-…`. Perplexity no longer numbers the list: the favicon is the marker; inline citations are source pills |
| github | Nearly. Native outside markers in a **16** indent (`.footnotes ol{padding-left: var(--base-size-16)}`); at 12 px "1. " is ≈ 13 wide, so the number starts ≈ 3 in from the edge (derived, not measured) | text 16 in | whole section `--fgColor-muted`, 12 px | native decimal, regular | hangs (native) | sindresorhus/github-markdown-css@7f38dcb `github-markdown.css:930-948` |
| github-md lists | No: ordinary `ol` `padding-left: 2em` (32 at 16) | text 32 in | — | — | hangs | same file `:452-457` |
| chatgpt | No: the round-35 sources list is a `ul` with `padding-inline-start: 32` at 16, markers outside, so the marker hangs inside the 32 | text 32 in | marker in the text ink (round 35) | — | hangs | `round-35-measurements.md:13` |
| tw-prose | No: `ol` `padding-inline-start: 26/16 em` (26 at 16), `li` + 6/16 em → text 32 in | — | `::marker` `var(--tw-prose-counters)` = gray-500 (**muted**) | `fontWeight: '400'` | hangs | tailwindcss-typography@e3714a3f `src/styles.js:322-337`, `:1470-1473`, `:1106` |
| notion-x | (reproduction) `ol` `padding-inline-start: 1.6em`, `li` `padding-left: .2em` | — | — | — | hangs | react-notion-x@03c5e88e `styles.css:867-880` |
| wikipedia-mobile | No: Minerva `.content ol{padding: 0 0 0 2.25em}`; Cite's sub-reference markers `margin-left:-3.2em; min-width:3.2em; text-align:right` | text 2.25em in | — | — | hangs | wikimedia/mediawiki-skins-MinervaNeue@5b6af4c `resources/skins.minerva.styles/content/lists.less:2-6`; mediawiki-extensions-Cite `modules/ext.cite.styles.less` (master) |
| medium, apple news, stripe docs, google AI overviews, arc search | Medium has no native footnotes; Stripe docs has no footnote list; AI Overviews and Arc show source cards / chips, not numbered lists | — | — | — | — | **unverified** |

### What the sources agree on

- **Products that own their layout put the marker at the content edge.** Substack, Notion and Perplexity all start
  the marker box exactly where the text above starts. The hanging-number layouts (GitHub `ol`, Tailwind, ChatGPT,
  Wikipedia) are the browser's native outside markers inside a 26–36 indent.
- **Marker box + gap is small and fixed:** 24 + 6 = 30 at ~16 (Substack, Notion), 16 + 8 = 24 at 14 (Perplexity).
  Scaled to Area's 13: 30 × 13/16 ≈ 24, the same as Perplexity's 16 + 8.
- **Wrapped lines always hang under the text**, never back to the edge, in every source.
- **Number ink splits:** muted in GitHub (whole section) and Tailwind (counters gray-500); default / link ink in
  Notion and Substack. Weight regular everywhere (Tailwind sets 400 explicitly). No source sets tabular figures on
  the marker (Substack, Notion: none in the pinned CSS).
- **Box alignment:** Substack starts the number at the box's start edge; Notion centres it in its 24 box.

### Recommendation: numbered Reference list

| Part | Value at 13 Compact | Evidence |
|---|---|---|
| layout | each item a row: number box, then the text; the list has **no start padding** | Substack flex row, Notion flex row, Perplexity row |
| number start | **at the content edge**, the same x as the "Sources" heading above | Substack, Notion (both measured / pinned to x), Perplexity 1020 = 1020 |
| number box | **16** (`min-inline-size`, Area's 16 icon box at 13), number start-aligned in it | Perplexity 16; Substack 24 at ~16 ≈ 19 at 13 |
| gap | **8** → text at **24** | Perplexity 8; Substack 6 + the unused box; Notion 6 + centring slack |
| ≥ 10 items | the box widens for the whole list, not per row (one shared column, e.g. CSS grid `auto 1fr` / subgrid, or `min-inline-size` set from the widest number), so every text start lines up | Substack's fixed 24 min-width exists for this; per-row flex would misalign at 10 |
| figures | `font-variant-numeric: tabular-nums` so 1–9 share a width | Area's own rule for numbers in columns; no source contradicts it |
| ink | `fg-muted`, regular | GitHub, Tailwind (2 sources); keeps the number as a locator, the text as content |
| text | `"1"` or `"1."`: Substack drops the period, Notion / GitHub / ChatGPT keep it; keeping `"1."` matches native lists | owner's pick |
| wrap | hangs under the text (24 in), never back to the number | every source |

This replaces round 35's 2em (26 at 13) indent with 0 indent before the number and 24 to the text: the number now
lines up with the heading, and the text sits one icon box + 8 in, as a row with a leading icon does in Area.
