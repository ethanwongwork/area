# Figure and Infobox: rethink survey (2026-10-17)

The owner chose "Rethink" for both: they read as Wikipedia only. Owner on Figure: "can you look at other design
systems/products examples for figure besides wikipedia, want to keep it simple and consistent and cohesive with the
system." This page surveys products and design systems other than Wikipedia and recommends an Area-native design for
each, built from parts Area already has.

Method: public source read at a pinned commit (`repo@sha path:line`), public page HTML or CSS fetched with curl
(no sign-in, no product state touched), and Area's own earlier captures. Anything not pinned to a line or a capture is
marked **unverified**. Nothing here was measured in a live product this round.

## 1. Figure (media with a caption)

### Sources

| Id | What | Link / line | Values |
|---|---|---|---|
| tw-prose | Tailwind Typography, the `prose` figure (shadcn, Vercel/Geist docs and most Tailwind docs sites render through it) | tailwindlabs/tailwindcss-typography@e3714a3f `src/styles.js:416-428` (base size), `:1111` and `:1633` (colour) | No frame. Figure margin 32 / 32 at a 16 body; caption 14/20 (0.875em), 12 above (0.857em), ink `--tw-prose-captions` = gray-500 (dark gray-400); alignment inherited, so **start** |
| notion | Notion image block caption, via react-notion-x (an open reproduction of Notion's page CSS, not Notion's own source) | NotionX/react-notion-x@03c5e88e `packages/react-notion-x/src/styles.css:1175-1183`, `:10`, `:904-907` | No frame, image fills the column; caption 14 / 1.4, `rgba(55,53,47,.6)` (60% of body ink), padding 6 0 6 2, **start**-aligned. Image corner: none in this CSS (Notion's own corner **unverified**) |
| mintlify | Mintlify `<Frame>` (docs image frame; Mintlify hosts Anthropic's, Cursor's and many product docs) | mintlify.com/docs/components/frames, server HTML, `figure[data-name=frame]` and `figcaption[data-component-part=frame-caption]` classes | Frame: padding 8 (`p-2`), corner 16 (`rounded-2xl`), fill gray-50 at 50% with a faint grid pattern, no shadow; media corner 12 (`rounded-xl`). Caption inside the frame, 12 above (`mt-3`), 14/20 (`text-sm`), gray-700, **centred**, side padding 32. A border on `.frame` is **unverified** (not in the classes) |
| docc | Apple DocC (developer.apple.com documentation renderer), Caption | swiftlang/swift-docc-render@c215689a `src/components/ContentNode/Caption.vue:65-70`; `src/styles/core/typography/_font-styles.scss:156-157` | No frame. Caption 14/21 at a 17 body; optional bold title run-in ("**Figure 1** text", `Caption.vue:12`); leading captions start-aligned, trailing (under media) **centred**; stacked margin above |
| carbon | Carbon for IBM.com, image with caption | carbon-design-system/carbon-for-ibm-dotcom@16b1d35d `packages/styles/scss/components/image/_image.scss:74-80`, `:136-141` | No frame; the **image** carries a 1px `$border-tile-01` hairline. Caption `body-01` (14/20), `$text-helper` (muted), 8 above (`$spacing-03`), **start** |
| ghost | Ghost Casper theme (editorial blogs, close to Medium/Substack) | TryGhost/Casper@c50043f7 `assets/css/screen.css:1653-1659`, `:2387-2389` | No frame. Caption 13 (1.3rem at 62.5%) / 1.4, `rgba(0,0,0,.5)` (dark `rgba(255,255,255,.6)`), padding 15 15 0, **centred** |
| mui | MUI ImageListItemBar (the caption bar of Material's image list) | mui/material-ui@51f9b635 `packages/mui-material/src/ImageListItemBar/ImageListItemBar.js:41-44`, `:93-96`, `:123-124`, `:138-139` | Two positions: an overlay bar on a 50% black scrim, or `below` with padding 6 0 12, transparent; title 16/24, subtitle 12. Start-aligned |
| area-card | Area Card's product evidence: ChatGPT library image card, Notion gallery and Figma file card | `docs/specs/card.md:58`, `:69-71`; captures `docs/research/captures/card/` | When media carries a title in these products it is a Card (inset or bleed media, title under it), not a figure |
| m3, polaris, primer, atlassian, shadcn | Design systems | — | No figure or caption component. Absence is evidence: product UI shows media with a caption as plain content, or as a Card |
| medium, substack | Editorial products | — | Caption under the image, small, muted, centred, no frame: **unverified** (not pinned; Ghost stands in) |

### What the sources agree on

- **No frame.** 6 of 7 pinned sources draw none (Tailwind, Notion, DocC, Carbon, Ghost, MUI below). Only Mintlify's
  docs frame boxes the image, and it is a tinted well with no shadow, not a card. None uses a raised card paint.
- **Caption one step under body, muted.** 14 at a 16 body (Tailwind, Notion, Carbon, Mintlify), 14 at 17 (DocC), 13
  (Ghost). Ink 50–60% (Notion 60%, Ghost 50%, gray-500, Carbon helper text). Weight regular.
- **8–12 between media and caption** (Carbon 8, Notion 6 + line, Tailwind 12, Mintlify 12).
- **Alignment splits:** start in product and system sources (Notion, Tailwind, Carbon, MUI), centred in editorial and
  docs (DocC trailing, Ghost, Mintlify). Notion, a target product, starts.
- **Edge on screenshots only:** Carbon puts a 1px hairline on the image itself so a white screenshot keeps its edge.
- **No floats.** None of these wrap text around a figure; Notion aligns an image block, never floats it.

### Recommendation: Figure

Simple: media, then a caption. Nothing else by default.

| Part | Area | Evidence |
|---|---|---|
| media | as wide as its content (or 100%), Area's media corner (the corner Card's inset media uses) | Notion, Tailwind; Card media for the corner |
| caption | Area's small text, `fg-muted`, regular, 8 under the media, **start**-aligned, wraps to the media's width (keep `contain: inline-size`) | Carbon 8 / helper ink; Notion start, 60% ink; Tailwind 0.875em |
| `bordered` (boolean) | a 1px `border-divider` hairline on the media only, inside its corner | Carbon's image hairline; for screenshots on a white page |
| `align` | `start` (default) or `center`, for the whole figure and its caption together | Notion block alignment; DocC/Ghost/Mintlify centre |

Drop: the `framed` variant in Card paint (surface, edge, resting shadow), the caption's switch to body ink inside the
frame, and the floats (`start` / `end` wrap). A framed screenshot, if the owner wants one later, is Mintlify's tinted
well (8 in, no shadow), not a Card; and a media-plus-title tile is already Card. Leave a "Figure 1" run-in label out
until a product needs it (DocC only).

## 2. Infobox (a subject's key facts beside or above content)

### Sources

| Id | What | Link / line | Values |
|---|---|---|---|
| notion | Notion page properties (top of a database page) | Area capture `docs/research/captures/description-list/notion--row`, `notion--list`; `docs/specs/description-list.md` Measurements | No frame, no title of its own (the page title is the subject). Two columns: label column 160, muted 14/20 400 with a 16 icon; value at 174 in default ink; rows 34, 4 apart; no rules, no section headers. Rich values (people, status pills, dates, links) |
| figma | Figma inspector (Design panel) | Area captures `docs/research/captures/inspector/figma--section-title`, `figma--section-header`; `docs/specs/panel.md:71`, `:119`, `:122` | Docked, no frame. Sections under a **start-aligned** title (11/16 550, body ink), split by a 1px rule; label/value rows |
| github | GitHub repository "About" sidebar | github.com/radix-ui/themes, server HTML 2026-10-17: `h2.sectionHeading[data-variant=small]`, `div.sidebarSection.border-bottom.color-border-muted`, `div.mt-2` rows; Primer heading primer/react@7f96c0d5 `packages/react/src/Heading/Heading.module.css:14-15`, primer/primitives@66e78d33 `src/tokens/functional/typography/typography.json5:193-205` | No frame. Each section: a **start-aligned** heading (Primer title small, 16, semibold, "same size as body.large"), then content; sections split by a 1px muted rule. Rows are icon + text (Readme, licence, stars) 8 apart (`mt-2`), a description paragraph, a link row, topic tags. No label column |
| appstore | Apple App Store web, "Information" section | apps.apple.com/us/app/…/id1232780281 (server HTML, `section#information`, `dl.grid`); CSS apps.apple.com/assets/index~BS22QqNeqy.css, rule `dt.svelte-z7zy89` | Start-aligned section title (h2.shelf-title). `dl` of **stacked** pairs: label above value, label `--systemSecondary` (muted), 4 below it. Pairs in a grid: 2–3 columns, 20 column gap, 24 row gap (inline `--grid-*` vars on the `dl`) |
| chatgpt | ChatGPT Settings › Account card | Area capture `docs/research/captures/description-list/chatgpt--card`; `docs/specs/description-list.md` Measurements | Framed (1px rgba(0,0,0,.1), corner 16), label start / value end (justified), rows 12 / 16 padded, rules inset 16. Labels 14/20 500 default ink |
| radix | Radix Themes DataList | radix-ui/themes@1faff10a `packages/radix-ui-themes/src/components/data-list.css:9-11`, `:120-143`, `:104-118` | Horizontal: grid `auto 1fr` with subgrid so label columns align, label min 120, label ink `--gray-a11` (muted), baseline-aligned. Vertical: label above value, 4 apart (`space-1`). No frame, no rules |
| chakra | Chakra UI DataList | chakra-ui/chakra-ui@fa9696f3 `packages/react/src/theme/recipes/data-list.ts:20-33`, `:74-77`, `:90-94` | **Default orientation vertical** (stacked); horizontal label min 120. Default variant `subtle`: label `fg.muted`, regular |
| polaris | Shopify Polaris DescriptionList | Shopify/polaris@3f7954ae `polaris-react/src/components/DescriptionList/DescriptionList.module.css:13-62` | Term semibold, 25% column from `sm` up (stacked below); 16 padding; 1px `border-secondary` rule between pairs |
| govuk | GOV.UK Summary list | alphagov/govuk-frontend@ad8b0ca8 `packages/govuk-frontend/src/govuk/components/summary-list/_mixin.scss:24-26`, `:86-91` | Key bold, 30% column from tablet (stacked on mobile); 1px rule under every row |
| linear, jira | Issue property sidebars | — | Right sidebar beside the content, no frame; muted label column + rich value (avatar, status, labels, dates); small start-aligned group headers. **Unverified** (closed source, not captured) |
| google | Google knowledge panel | — | A bordered card: image strip at top, title and subtitle start-aligned, a short description, then "Label: value" run-in rows (label bold). **Unverified** |
| m3, atlassian, carbon, shadcn, geist | Design systems | — | No infobox or data-list component found (Carbon's StructuredList is a table). Not read further |

### What the sources agree on

- **Title and headings start-aligned.** Every source (GitHub, App Store, Figma, Google, Linear) aligns the title and
  section headings to the start. None centres them; none paints a band behind a section heading.
- **Sections split by a rule or by space, not bands.** GitHub and Figma use a 1px muted rule between sections; App
  Store and Notion use space.
- **Labels muted and regular.** Notion, Radix, Chakra, App Store, Linear. Bold labels are the government/editorial
  minority (GOV.UK, Polaris, Wikipedia, Google). ChatGPT uses 500 in default ink on a justified card.
- **Two label layouts, chosen by width.** A label column (Notion 160, Radix/Chakra min 120, GOV.UK 30%, Polaris 25%) where
  there is room; stacked label-above-value (App Store, Chakra's default, Radix vertical, and every responsive source on
  narrow widths) in a narrow sidebar.
- **Frame is optional and mostly absent.** Unframed: Notion, Figma, GitHub, App Store, Linear, Radix, Chakra. Framed:
  ChatGPT's settings card, Google's knowledge panel.
- **Values are rich**: avatars, badges or status pills, links, tags (Notion, Linear, GitHub topics).
- **Media is optional and sits at the top**, start-aligned or full width, usually without a caption (App Store icon,
  Google image strip, GitHub none).

### Recommendation: Infobox

Make it a composition of existing Area parts rather than a component with its own look:

```
[Card, only when framed]
  header: optional media (Avatar for a person or app icon; full-width image at Card's media corner)
          title (Panel's heading role: 500, default ink, start) + optional muted subtitle
  section*: optional heading (same heading role, start) → Description list
  Separator between sections (1px border-divider), or space only
```

| Part | Area | Evidence |
|---|---|---|
| rows | **Description list**, unchanged: `columns` (muted regular term, fixed term column) as the default | Notion, Radix, Chakra, Linear |
| narrow | a new Description list layout `stacked` (term above value, 4 apart, muted term); Infobox uses it in a narrow column. Description list's spec currently excludes stacked because "no product shows it"; the App Store's Information list now does (`dt.svelte-z7zy89{…margin-bottom:4px}`) | App Store, Chakra default, Radix vertical |
| title | start-aligned, Panel's heading weight; subject media beside or above it (Avatar for a person, David Tee) | GitHub, App Store, Figma, Google |
| section heading | start-aligned, same role as Panel's section heading; no fill, no band | GitHub, Figma |
| between sections | Separator (1px `border-divider`) or the section gap alone | GitHub, Figma, Polaris |
| values | Avatar, Badge, Link, Tag as Description list already allows | Notion, Linear, GitHub |
| `framed` (boolean) | Card's frame (surface, `border-card`, container corner); default unframed | ChatGPT, Google vs Notion, GitHub, Figma, App Store |
| width | fills its column (the sidebar or layout sets width); drop the fixed 22em | GitHub/Linear sidebars, Notion page |

Drop: the centred title and subtitle, the centred image with a centred caption, the grey `bg-component` heading bands,
the 2fr : 3fr label grid (use Description list's term column), the fixed 22em width, and the floats. Keep the image
optional and captionless; if a caption is needed, it is a Figure.

## Summary of cohesion

Both families stop owning paint. Figure is media plus Area's small muted caption (an optional hairline, start or
centre). Infobox is a start-aligned header plus Description list sections split by Separator, framed only by Card when
asked. This keeps them in Notion's and Figma's register (quiet, unframed, start-aligned) and reuses tested Area parts.

Not done this round: live measurement in Notion, Linear or ChatGPT; dark-mode values beyond those quoted; Medium and
Substack CSS.
