# Empty state spec

**Captures:** `docs/research/captures/empty-state/`
**Peers:** File upload (the icon tile), the list "no matches" row (Combobox, Command palette), Card and Panel (the regions it sits in), Button (actions), Dialog and Drawer (title type)

## Owner decisions

- 2026-10-10: "work on the next component" → Empty state, the next unbuilt item on the gap audit's order (the next tier
  after the twelve priorities: Link, EmptyState, Pagination; Link and Pagination are built).
- 2026-10-10: the open questions go with the recommendations: File upload keeps its edged tile (a field's) and this
  keeps the soft tile; sm keeps a tile rather than Notion's bare glyph; the title stays in the default ink at both sizes.

## Job and boundaries

An empty state says a region has nothing to show yet, and how to fill it: a page or view with no items, a search or
filter with no results, a panel or list with nothing in it. It is a centred block: an optional icon on a soft tile, a
title, a muted line and optional actions. It is not the one-line "no matches" row inside a listbox (Combobox, Command
palette keep that row, `DESIGN_SYSTEM.md`, "List rows"), not an error or result page (a later Result/ErrorState), not
onboarding, and not a loading state (Skeleton, Spinner).

## Variants

| Axis | Value | Justification | Where it appears |
|---|---|---|---|
| size | md (default) | A page or a main region | ChatGPT Space › Trash, Sites, Favorites |
| size | sm | Inside a panel, list, popover or table | Notion Library › Favorites, Skills |
| content | icon, title, description, actions, each optional | Products drop parts freely: ChatGPT's Favorites is a title alone, Figma's file browser a line alone | All three products; Untitled UI, shadcn, Primer slots |
| titleAs | h2 … h6, p | The title is a heading at the page's next level (ChatGPT h2; Primer's `as`) | ChatGPT, Primer |

Excluded: Untitled UI's illustrations, background patterns and avatar decorations (no product draws them), its lg size
(20/30 title, 56 tile: larger than any product), a dashed or solid border (shadcn `border-dashed`, Primer `border`; no
product frames it, a consumer can put it in a Card), Primer's spacious padding, Figma's 11px line-only state (its UI
scale; Area's `description` alone covers the shape).

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| chatgpt | target product | Space › Trash (icon, title, line), Sites (with a button), Favorites (title only) | chatgpt.com/space, 2026-10-10, owner's session, read-only | evidence only | `chatgpt--default`, `--action`, `--title-only` |
| notion | target product | Library › Favorites (icon, title, line), Skills (icon, line, action), Library search with no match | app.notion.com/library, 2026-10-10, read-only (a nonsense filter typed and cleared) | evidence only | `notion--default`, `--action`, `--no-results` |
| figma | target product | File browser › Trash › Folders, Recents › Shared folders: one muted line over faded placeholder cards | figma.com/files, 2026-10-10, read-only | evidence only | `figma--text-only`, `--no-results` |
| uui | design system (source) | `EmptyState` (Root, Header, FeaturedIcon, Content, Title, Description, Footer; sm / md / lg) | untitleduico/react@1d410cb, `components/application/empty-state/empty-state.tsx:22-128`, `foundations/featured-icon/featured-icon.tsx:65-79` | MIT | source read |
| shadcn | design system (source) | `Empty` (Header, Media icon / default, Title, Description, Content) | shadcn-ui/ui@2d3f1cd, `apps/v4/registry/new-york-v4/ui/empty.tsx:4-94` | MIT | source read |
| primer | design system (source) | `Blankslate` (Visual, Heading, Description, Primary / Secondary action; small / medium / large, narrow, spacious, border) | primer/react@7f5303d, `packages/react/src/Blankslate/Blankslate.module.css:5-103` | MIT | source read |
| area | this system | Every gallery tile at 1:1 | localhost gallery, tile zoom pinned to 1 | — | `area--*` (6) |

Captures were taken with Chrome's window hidden (`document.visibilityState` hidden); computed lengths are unaffected, but
no hover state was captured. Notion was at 90% browser zoom (dpr 1.8); its CSS lengths are recorded in CSS pixels. All
product captures are redacted (no text, ids or labels). Dark was not captured: switching a product's theme changes an
account setting.

**Design-system readout.** Untitled UI: root max 512, centred column; header 16 below (sm) / 20 (md, lg); a 48 "modern"
featured icon (white, 1px inset ring, skeuomorphic shadow, radius 10) with a 24 glyph in fg-secondary (56 / 28 at lg);
content max 352, title 16/24 600 (sm), 18/28 (md), 20/30 (lg), 4 (sm) / 8 gap, description 14/20 tertiary (16/24 at lg);
content 24 (sm) / 32 above the footer; footer buttons 12 apart. shadcn: 24 / 48 padding, 24 between header and content;
header max 384, 8 gap; icon media 40, radius 10, `bg-muted`, 24 glyph, 8 below; title 18/28 500 tracking-tight;
description 14 relaxed, muted, `text-balance`. Primer: padding 16 (small) / 32 (medium); visual 24 muted 8 above the
heading; heading title-small / medium, 4 below; description muted; actions 16 above; `text-wrap: balance`.

## Anatomy

```
area  div.area-empty-state.area-empty-state--{sm,md} (centred column, padding)
        span.__icon[aria-hidden] (soft tile) > svg (the glyph)
        div.__content (title and line, the measure)
          h2.__title (titleAs) · p.__description
        div.__actions (Buttons, centred row, wraps)
```

Insets (no border): md 32 padding; tile 48, then 16; title, 8, line; 16, actions. sm 16 padding; tile 40, then 12;
title, 2, line; 8, actions. The tile's glyph is centred in its square (12 in md, 10 in sm). Captured: md content
96 = 32 + 48 + 16 from the shell top, line 32 under the title top (24 + 8), actions 16 under the content; sm content
68 = 16 + 40 + 12, line 22 under the title top (20 + 2), actions 8 under (`area--content-actions`, `area--layout-panel`).

## Measurements

Generated with `node scripts/capture-compare.mjs` on `chatgpt--default`, `area--default`, `notion--default` and
`area--size-sm` (structure rows; the full tables are reproducible from the files).

| slot · property | chatgpt · default | area · default (md) | notion · default | area · size-sm |
|---|---|---|---|---|
| **shell** padding | 0 | 32 | 0 | 16 |
| **icon** size | 48 × 48 | 48 × 48 | 32 × 32 (bare glyph) | 40 × 40 |
| **icon** radius | 12px | 12px | 0px | 10px |
| **icon** background | rgb(243, 243, 243) | rgb(247, 247, 247) | — | rgb(247, 247, 247) |
| **glyph** size | 24 × 24 | 24 × 24 | — | 20 × 20 |
| **glyph** color | rgb(13, 13, 13) | rgb(40, 40, 40) | rgb(142, 139, 134) | rgb(40, 40, 40) |
| **content** edge from shell (t) | 64 | 96 | 176 (370 tall region) | 68 |
| **content** gap | 8px | 8px | 2px | 2px |
| **title** font | 18px/24px 500 | 18px/24px 500 Geist | 14px/20px 500 | 14px/20px 500 Geist |
| **title** color | rgb(13, 13, 13) | rgb(40, 40, 40) | rgb(125, 122, 117) | rgb(40, 40, 40) |
| **text** font | 14px/20px 400 | 14px/20px 400 Geist | 14px/20px 400 | 14px/20px 400 Geist |
| **text** color | rgb(93, 93, 93) | rgb(102, 102, 102) | rgb(125, 122, 117) | rgb(102, 102, 102) |

Other captured values: ChatGPT's actions row 16 under the content, 8 apart, a 36 pill button (14/18, `#0d0d0d` fill); its
column `max-w-xl` 576. Notion's Favorites column 340 with a 12 gap under the icon; Skills 600 with a 16 gap, its action a
28 text button in link blue 8 under the line; its no-match state is a lone 28 "Clear search" button. Figma: 11/16 450 at
50% black, centred in the content area, no icon or title (`figma--*`).

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| layout | centred column, text centred | All products and systems | — |
| md · tile | 48 (`control-xl`), corner `radius-control-xl` (12), `bg-component`, 24 glyph in `fg-default` | ChatGPT 48 / 12 / #f3f3f3 / 24 default ink; Untitled lg 48 / 24 | Untitled's white ringed tile not used: ChatGPT and shadcn fill it |
| sm · tile | 40 (`control-lg`), corner `radius-control-lg` (10), same paint, 20 glyph | Peer File upload's 40 tile with a 20 glyph; shadcn 40 / 10 | Notion draws a bare 32 muted glyph; a tile keeps sm one family with md |
| md · gaps | 2 × `ui-cluster` under the tile (12 / 16 / 20), 4 title to line, `gap-section` above actions (16 / 24 / 32) | ChatGPT 16 under the tile | — |
| sm · gaps | `gap-row` under the tile and above actions (8 / 12 / 16), 4 title to line | Notion Favorites (12, 2), Skills (8) | — |
| md · title | **`title-xs` 16/22** 500, `fg-default`, at both densities; a heading over its line, so it stands **4** off it (14.0 baseline to cap beside the line's 8.8; 2026-11-06, Text pairs) | Dialog and Drawer's surface title (consistency pass O3, owner 2026-10-12) | ChatGPT's 18/24 is off Area's six-step ramp; was a literal 18/24 (compact 16/24) |
| sm · title | the UI type (14/20; 12/16 compact) 500, `fg-default` | Notion 14/20 500 | Notion's title is muted like its line; Area keeps the default ink in both sizes (ChatGPT, Untitled, shadcn, Primer), so the title reads first |
| description | `text-base` (14/20; 12/16 compact), `fg-muted` | ChatGPT and Notion 14/20 muted | — |
| measure | md 576, sm 340 | ChatGPT `max-w-xl` 576 (Notion Skills 600); Notion Favorites 340 | — |
| wrapping | `text-wrap: balance` on title and line | shadcn, Primer | Products don't balance; balance keeps a two-line line even in the centred column |
| padding | md 32 (2 × `inset-surface-md`; 24 compact), sm 16 (`inset-surface-md`; 12 compact) | Primer medium 32, small 16 | Products centre it in their own region with no padding; the component needs its own inset in a Card or Panel |
| actions | row, `ui-cluster` apart (6 / 8 / 10), centred, wraps; consumer Buttons (md: default size; sm: sm) | ChatGPT 8 apart | Untitled 12 apart |
| glyph line | the size curve for the slot it is shown at (24 → 1.2 × the 16 line; 20 → 1.106 ×) | `base.css` glyph sizes | An Area `Glyph` drawn for another size takes the tile's line |

## States

None of its own: it is static content. Actions are Buttons and carry their own states.

## Behavior and accessibility

The title is a heading (`h2` by default, `titleAs` to fit the page outline, `p` where a heading would break it). The icon
is decorative (`aria-hidden`). The component does not announce itself: when results empty out after a search or filter,
the consumer can pass `role="status"` so the title and line are read (native props reach the root). Actions are real
Buttons or Links, in reading order after the line.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match |
|---|---|---|---|---|
| File upload | decorative icon tile | 40, `radius-control-lg`, white with the field edge, 20 glyph muted (Untitled) | md 48 / sm 40, soft fill, default ink (ChatGPT) | differs on purpose: the upload zone is a field and takes the field's edge (owner, 2026-10-10) |
| Combobox / Command palette | "nothing here" | one muted row the height of a md row | a block for a region | kept separate on purpose (list rows stay rows) |
| Dialog, Drawer, Card | surface title | the text's size, 500 (13/18 at type 13, since 2026-11-06) | md `title-xs` 500 (a region's heading), sm the UI type, 500 | sm matches; md differs on purpose: it heads a region, a step (4) off its text (DESIGN_SYSTEM.md, "Text pairs") |
| Button | actions | Button sizes | default (md) / sm | match |

## Visual pass

Harness at 1:1 (server-rendered gallery specimens with `dist/area.css`), light default, dark default and light compact,
beside File upload. Against ChatGPT's Trash and Sites (screenshots, same session): the tile, the 18 title and the muted
two-line text read the same; Area's tile fill is a touch lighter (#f7f7f7 in the gallery palette, ChatGPT #f3f3f3) and
still separates from white; in dark the tile reads as a raised square on the near-black page. Against Notion's Favorites:
sm keeps its quiet 14/20 type and the 2px title-to-line step; the title in the default ink reads first where Notion's
does not. Compact steps every part down (40 / 32 tiles, 16 title, 12/16 lines). Seen side by side, File upload's white
edged tile and this soft tile disagree (open question 1). Fixed during the pass: nothing in the component; the first
harness styled its own labels with `h2` and shrank the title (a consumer's unlayered element rule outranks Area's
layer, as for every component).

## Verification

- 14 captures (8 reference, 6 Area); checksums verified by `capture-compare.mjs`; product captures redacted.
- Build (manifest parity, token references), typecheck, React tests (`empty-state.test.mjs`, 3), `build:docs`, gallery
  in the built-in browser.
- Unverified: ChatGPT and Notion in dark, hover on the products' actions (window hidden), a screen reader.

## Open questions

Resolved 2026-10-10 (owner: "go with your recommendations"):

1. File upload's tile is white with the field edge (Untitled's "modern" icon); this one is a soft fill (ChatGPT, shadcn).
   Recommendation: keep both for now (the upload zone is a field, so its tile takes the field's edge) and revisit if the
   two meet on one screen.
2. sm draws a tile, where Notion shows a bare muted glyph. Recommendation: keep the tile, so the two sizes are one family;
   a bare glyph is possible later as an `icon` emphasis if you want Notion's quieter look.
3. The title is in the default ink at both sizes, where Notion's is muted. Recommendation: keep the default ink.

## Review note, 2026-10-10

- **What changed:** New component. Empty state fills a page, panel or list that has nothing in it yet: an icon on a soft
  tile, a title, a muted line and optional buttons, centred. Two sizes: md for a page, sm for a panel.
- **Why:** It was the next missing piece on the gap list (seven design systems ship one). md copies ChatGPT's empty
  Trash and Sites pages; sm copies Notion's empty Library tabs.

## Review note, 2026-10-12 (consistency pass, round 2)

- **What changed:** the medium empty state's title is 16/24 (was 18/24); compact is unchanged.
- **Why:** 18 isn't on Area's type ramp; 16/24 is the title size Dialog and Drawer use, and you went with that recommendation.

## Feedback log

- 2026-10-10 · owner: "work on the next component" → Empty state from ChatGPT, Notion and Figma captures and Untitled
  UI, shadcn and Primer sources; 14 captures, 6 gallery tiles, in review.
- 2026-10-10 · owner: "go with your recommendations" → open questions resolved as recommended; no code change.
- 2026-10-10 · owner, review round 5: approved → Complete in `component-status.mjs`.
- 2026-10-12 · owner, 2026-10-12: "go with your recommendations" (consistency pass) → the md title takes `title-xs` 16/24 (O3; was ChatGPT's 18/24, off the ramp) (empty-state.css). (docs/research/consistency-audit-2026-10-12.md)
- 2026-10-12 · owner, review round 21 (components21): approved → Complete in `component-status.mjs`.
- 2026-10-12 · spacing step extrapolated past Default (type size and density split) → glyph size and stroke take only the compact step (`clamp(0, ui-dense, 1)`): icons and strokes follow the type size on their own (`empty-state.css`). `docs/research/ui-size-scale-2026-10-12.md`.

## Review note, 2026-10-22 (round 68)

- **What changed:** the description sits directly under the title at both sizes: 12 at md (was 20, an 8 gap after ChatGPT's empty state), 10 at sm (was 12, a 2 gap).
- **Why:** the gap and text pass across every family (your note: one intentional logic for the gaps between labels, titles and their copy). A title and the line under it now join with no gap everywhere, the rule you set on Card (Figma and Notion 11.5). Before, the same pair sat 10.5 to 20 apart depending on the family. DESIGN_SYSTEM.md, "Text pairs". ChatGPT's empty state keeps 8; one rule across the system won over that single reference, so say if Empty state should be the exception.

## Review note, 2026-10-26 (interaction pass)

- **What changed:** At the app's type 13 the glyph is 20 (md) and 16 (sm), native sizes, instead of 22 and 18.
- **Why:** The compact step is in halves at type 13, which put the glyph between native cuts, slightly soft. You asked for the Slider's motion and detail pass on every component; measured across all 118 families ([the pass](../research/interaction-pass-2026-10-26/README.md)).
- 2026-11-02 · owner: "update the empty state, the size of the type the gaps between text and the actions" (three references: a finance dashboard's and a projects app's small empty states, a mail app's large one) → sm: the actions 12 under the text (was 8), a 32 tile with a 16 glyph (was 40 / 20); md: the line at the UI step, 13/18 (was 12/16), the actions 24 under (was 16). Titles unchanged (sm 13, md 16). → empty-state.css.

## Review note, 2026-11-06 (balance pass; owner: "Keep it")

- **What changed:** md keeps its 16 title (it heads a page or a region) but stands one step, 4, off its line: 14.0
  baseline to cap, was 10.0 joined. sm (13 over 12, joined) is unchanged.
- **Why:** the owner's note on a confirm ("no spacing logic between the title and the text … the type style size contrast with the text is large … make sure all of this is intentional"). The 2026-11-02 ramp moved `title-xs` from 15 to 16 at type 13, so a 16 title sat over 13 text, 1.23× (the owner had approved 16 over 14, 1.14×, on 2026-09-26), and joined 10.0 baseline to cap beside the text's own 8.8: near the line gap but not on it. Cursor sets its confirm's title at its text's size (12/500 over 12) and its settings rows 13 over 13. DESIGN_SYSTEM.md, "Text pairs"; `docs/research/title-balance-2026-11-06`. A heading over its text is a whole step off the text's line, never 1 off it.
- **Second look:** sm's title (13 over 12) now stands one step (4) off its line too, 11.7, as every surface title; it
  was joined (7.7). The owner approved the step ("4 is right", 2026-11-06).

## Density (plan B8.2), 2026-11-14

Space between pieces reads a density role (DESIGN_SYSTEM.md, Size and shape; `density.test.mjs`). Values at type 13
Compact / Default / Comfortable; each is whole at type 12 to 16 and every density, and the default is unchanged unless said.

- md: tile to title 12 / 16 / 20, text to actions 16 / 24 / 32. sm: 8 / 12 / 16 for both. Actions 6 / 8 / 10 apart.
  The title to its copy stays 4 (a text pair, at every density).
