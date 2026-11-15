# Live product UI, measured rendered (prefix RL)


## 1. Scope and method

**Measured (rendered, signed out, read-only, 1440 x 900 viewport, light first):** GitHub issues list (Primer in
production), Radix Themes playground (every component at its sizes), shadcn/ui examples (dashboard, tasks), Vercel
Geist component pages (button, input, badge, menu, tabs, checkbox; dark and light), Linear docs (dark only), Notion's
public Roadmap template on notion.site (real app, read-only; board and table views). Six targets.

**Method.** The built-in browser pane; values read with `getComputedStyle` and `getBoundingClientRect` from a sweep
script that groups elements by signature (height, padding, font, ink, fill, border, radius, icon size, icon-to-label
gap, shadow, contrast against the first opaque ground), plus targeted reads of menus opened by a click and read after
their entry animation (Radix, shadcn, Geist). Screenshots only located controls. lab()/oklch()/display-p3 colours were
converted with a canvas where noted; display-p3 greys are approximated. Contrast is WCAG 2 on the blended ground.

**Not measured, said plainly.**
- Stripe docs, Raycast, Supabase / PostHog and a consumer storefront (Airbnb / Shopify): the navigation to
  docs.stripe.com was declined in the session, so browsing stopped there; no further target was opened and nothing in
  this report is declared-only.
- Hover, pressed and focus-visible states (no pointer hover was driven), dialogs and tooltips (none opened), switch
  geometry on Geist (its demo is not an ARIA switch), GitHub inputs (the issues search draws its frame on an ancestor
  the sweep missed), Radix TextField text inset.
- Dark mode: Geist (pure black) and Linear (near black) rendered dark; shadcn's dark tokens were read by adding its
  `dark` class in the page and removing it again. Radix, GitHub, Notion: light only.

**Area's values** are the shipped defaults (type 13, density 32, corner 10) as resolved in the sibling reports
geometry.md (§1 token table, §2 census), shape-state.md (§1 radius table, overlay table) and type-ink.md (§1), checked
against `packages/tokens/src/emit/base.ts:457-550` and `packages/tokens/dist/css/tokens.css` (neutral ramp lines
1572-1593; ink layer floors lines 2387-2391).

## 2. Cross-product tables (rendered values; median and range over the products that showed the part)

Products' UI text is 14px (all six; Linear's docs body 15), Area's 13. Ratios to height or to the text line are
therefore the fair comparison; absolute px are given for both. "n" = products measured.

### 2a. Components

| Part | GitHub | Radix | shadcn | Geist | Linear | Notion | Median (range), n | Area default (13 · 32 · 10) | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| Default control height | 32 | 32 | 32-36 | 32 / 36 / 40 | 32 | 32 (view tabs) | **32** (32-36), 6 | md **30** (32 at type 14) | in (h / text 2.31 vs 2.29) |
| Height ladder | 28 · 32 · 40 | 24 · 32 · 40 · 48 | 32 · 36 · 40 | 24 · 32 · 36 · 40 | – | – | steps 4 then 8 | 22 · 26 · 30 · 38 · 46 | in (same 4-then-8 shape as Primer) |
| Button text side at the default | 12 | 12 | 10 (sm 32), 12 (36) | 12 (32), 16 (36), 20 (40) | 11 / 8 (rows) | – | **12** (10-12), 5 | md **10** | in, at the low edge |
| Button side / height | .375 | .33 · .375 · .4 · .5 | .31-.33 | .375 · .44 · .5 | – | – | **.375** (.31-.5) | sm .31 · md .33 · lg .37 | in, low edge; products widen with size more steeply (Radix and Geist reach .5) |
| Button label weight | 500 primary, 400 default | 500 | 500 | 500 | 510 | – | **500** | 500 | in |
| Icon to label (button) | 8 | 4 · 8 · 12 by size | 6 | 6 | – | – | **7** (6-8 at 32) | 6 | in |
| Icon to label (nav row) | 8 | – | 8 | – | 12 (h3 icon) | – | 8 (8-12) | gap-row **10** (geometry.md G1: 12 intended) | in |
| Control radius (default) | 6 | 4 | 8 (pill theme 26) | 6 / 6 / 8 | 8 | 20 (pill tabs) | **6** (4-8 non-pill) | md **8**, sm 8, lg 10, xl 14 | edge / above (see RL3) |
| Control radius / height | .19 | .125-.17 | .25 | .17-.2 | .25 | – | **.19** (.125-.25) | xs .27 · sm .31 · md .27 · lg .26 · xl .30 | **above range** |
| Input / field | – | 32, ring 1px, r 4 | 32, 4/12, r 8 | 32/36/40, ring 8% black, r 6 | – | – | 32; text 12 in (Geist 12, shadcn 12 + 1) | 30; text 10 in (+1 edge) | in height; text inset low (RL7) |
| Field edge contrast | – | gray-a7 20% (~1.5:1) | rgb(229) 1.26:1 | 8% black ring ~1.2:1 | – | – | 1.2-1.5:1 | not resolved here (shape-state.md) | – |
| Label to field | – | – | – | 8 (13/19.5 label) | – | – | 8, n = 1 | 6 (Field) | low (RL8, weak evidence) |
| Select trigger | – | 32, 0/12, chevron gap 6 | 32, 8/12, gap 6-8 | – | – | – | 32, side 12, chevron gap 6-8 | 30, side 10, gap-md 6 | in |
| Menu surface radius | – | 8 | 8 | 12 | – | (popover 10, BASELINE) | **8-12** (ChatGPT 16) | `radius-list` **14** | upper edge (with ChatGPT) |
| Menu padding | – | 8 | 4 + 1 border | 6 | – | – | 6 (4-8) | 4 + 1 | in |
| Menu row height | – | 32 | 32 | 36 | – | – | **32** (32-36; ChatGPT 36) | 30 | in (row / line 1.67 vs 1.6-1.8) |
| Menu row side | – | 12 | 8 | 8 | – | – | 8 (8-12; ChatGPT 10) | icon 8, text 10 | in |
| Menu row radius | – | 4 | 6 | 6 | – | – | **6** (4-6; ChatGPT 12) | `radius-list-row` **10** | above all but ChatGPT (RL3) |
| Menu nesting (outer - inset = inner?) | – | 8 - 8 ≠ 4 | 8 - 5 ≠ 6 | 12 - 6 = 6 exact | – | – | 1 of 3 exact | 14 - 5 = 9 vs 10 (documented: border ignored) | Area better than Radix and shadcn |
| Menu row gap | – | 0 | 0 | 0 | – | – | **0** | 1 (owner, `ui-row-gap`) | deliberate divergence |
| Separator block | – | 17 (8 + 1 + 8), inset to the text column | 9 (4 + 1 + 4), full bleed | – | – | – | 9-17 | 11 (5 + 1 + 5) | in |
| Badge / tag height | 20 (counter 18) | 20 · 24 | 22 | 20 · 24 · 32 | – | 18 | **20** (18-24) | sm 14 · md 18 · lg 22 | in (h / body text 1.38 vs 1.43) |
| Badge text | 12 600 | 12/16 500 | 12/16 500 | 11 / 12 / 14 500 | – | 12 400 | 12 500 | 11/14 500 | in (text / body .85 vs .86) |
| Badge side / height | .4 (counter .33) | .3 · .33 | .36 | .4 · .5 · .375 | – | .33 | **.36** (.3-.5) | .33 (`(h - 6)/2`) | in |
| Badge shape | pill | r 3 (s1) | pill | pill | – | r 4 | pill 3 of 5 | pill or row corner | in |
| Checkbox | – | 16 | 16, r 4 | 16, r 4, edge 3.3:1 | – | – | 16 = text line 20 - 4 | 14 = line 18 - 4 | in, same rule |
| Switch | – | 35 x 20 | – | – | – | – | 20 tall (ChatGPT 32 x 20) | track 18 | in (line + 0 vs line + 0) |
| Underline tabs bar | 48 (items 32) | 40 | – | 50 | – | – | **48** (40-50) | md = control 30, lg 38 | **below range** (RL5) |
| Tab spacing | ~16 | 16 (8 + 8 padding) | – | 24 | – | – | 16-24 | md 18 (G1: 16 intended), lg 24 | in |
| Selected tab | 600 weight | 500 | – | same weight, ink 23 vs 77 | – | – | weight or ink change | 500 + default ink | in |
| Segmented / plate tabs | – | 24 · 32 · 40 | track 36, pad 3, r 10 / item r 8 | – | – | pills 32, 6/12 | inner = outer - pad (shadcn 7 → 8) | track 8, item 6 at 2 in, exact | Area exact |
| Card radius | 6 (Box) | 8 · 8 · 12 · 12 | 14 | – | 8 | 10 | **8-10** (6-14; ChatGPT settings 16) | Card **18** | **above range** (RL2) |
| Card padding | 16 (rows) | 12 · 16 · 24 · 32 | 24 | – | (media card) | ~9 (board card) | **16-24** | sm 14 · md 18 · lg 22 | in |
| Card radius / padding | .375 | .5 · .5 · .5 · .375 | .58 | – | – | ~1 | **.5** (.375-.58; Notion's dense card 1) | md 18 / 18 = **1.0** | above (RL2) |
| Card shadow (light) | none | surface: ring only | 0 1 2 5% | – | none (5% fill + 5% edge, dark) | 0 4 12 2.7% + 0 1 2 2% + tinted ring | ring or a 1-2px soft shadow | `shadow-resting` (shape-state.md) | – |
| Table header / row | – | 44 / 44 | 40 / 49-53 (controls) | – | – | 36 / 37 | **40** (36-44) single-line | md 38 (sm 24) | in |
| Table header ink | – | 14 (700 computed, unverified) | 14 500 default | – | – | 14 400 muted | split: muted 400 or default 500 | muted 400 | in (Notion) |
| Table cell side | – | 12 | 8 | – | – | ~8 | 8-12 | edge 14, side 10 | in |
| Sidebar row | 32, r 6, 6/8 | – | 32, r 8, 6 pad, gap 4 between | – | 32, r 8, 0/11/0/8 | – | **32**, r 6-8, side 8 | 30, r 8, icon 8 | in |
| Sidebar row / text line | 1.6 | – | 1.6 | – | 1.52 | – | 1.6 | 1.67 | in |
| Page title | 20/30 600 | – | 24/32 600 -.025em | 24/32 600 -.96px (-.04em) | 40/44 590 -.022em (docs) | 32/38.4 700 | 20-32, **600** (590-700) | page header 18/24 · 20/28 **500** | weight below range (RL4) |
| Section title | – | – | – | – | 20/26.6 590 -.012em | 14/20 500 (group) | – | title-xs 16/22 500 | weight split |

### 2b. Ink (secondary text), contrast against the page

| Product | Light default / secondary | Secondary contrast | Default:secondary luminance contrast | Dark default / secondary | Dark secondary contrast | Dark default:secondary |
|---|---|---|---|---|---|---|
| GitHub | rgb(31,35,40) / rgb(89,99,110) | 6.11 | 2.56 | – | – | – |
| Radix | gray-12 / gray-11 (~rgb(97,100,107)) | ~5.9 | ~2.6 | – | – | – |
| shadcn | #000 / rgb(115,115,115) | 4.74 | 4.4 | rgb(250) / rgb(161) on rgb(10) | 7.6 | 2.5 |
| Geist | rgb(23) / rgb(77) (placeholder rgb(143) 3.3) | 8.5 | 2.1 | rgb(237) / rgb(161) on #000 | 9.0 | 2.2 |
| Linear | – | – | – | rgb(247,248,248) / rgb(138,143,152) on rgb(8,9,10) | 6.13 | 3.1 |
| Notion | rgb(44,44,43) / rgb(125,122,117) | 4.2 | 3.2 | – | – | – |
| ChatGPT (BASELINE) | rgb(13) / rgb(93) | 6.6 | 3.1 | – | – | – |
| **Median (range)** | | **5.9 (4.2-8.5)** | **2.6 (2.1-4.4)** | | **7.6 (6.1-9.0)** | **2.5 (2.2-3.1)** |
| **Area** | ~#262626 / #666 (oklab L ≤ .277 / ≤ .510) | **5.74** in | **2.57** in | ~#eee / ~#c5c5c5 (L ≥ .949 / ≥ .823) | **10.9-12.2** (on #121212-#000) | **1.49 out** |

### 2c. Spacing relationships

| Relationship | Measured | Median (range) | Area default | Verdict |
|---|---|---|---|---|
| Title to description (component: card, empty state) | shadcn card 8 (description above a 24/32 metric); ChatGPT empty state 8, Notion 2 (BASELINE) | **8** (2-8) | 4 (Card, Dialog, Empty state, Alert; type-ink.md) | low edge (RL6) |
| Page title to lede | Linear h1 → lede 12 | 12, n = 1 | Page header description 4 | below, weak evidence |
| Section heading to its content | Linear h2 → card grid 32 | 32, n = 1 | – | – |
| Label to field | Geist 8 | 8, n = 1 | 6 | RL8 |
| Card to card in a grid | shadcn 16, Linear 16, Notion board columns 12 | **16** (12-16) | Feed cards 12 (feed system) | in, low edge |
| Card row to next section | shadcn 24 | 24, n = 1 | Feed sections 48 | above, weak evidence (dashboards vs feeds) |
| Page margin (content to panel edge) | shadcn 24 | 24, n = 1 | Feed margin 32 | in the band products use (24-32), weak |
| Rows in a list | all flush; GitHub issue rows ruled | 0 | 1 between plates | deliberate |
| Menu edge to row plate | Radix 8, Geist 6, shadcn 5 | 6 (5-8) | 5 | in |
| Board columns / card padding | Notion 12 between, 8 inside | – | Board column 18 inside (geometry.md 2c) | – |

### 2d. Shared patterns (as rules)

1. **Control height = 2.29 × UI text** at the default (32 at 14) in every product; Area 2.31 (30 at 13).
2. **Text side = 3/8 of the height at the default**, growing to 1/2 at the largest size (Radix, Geist); the smallest
   size sits at 1/3. Area's cap-centred inset gives .31 · .33 · .37: flatter than the products at lg and xl.
3. **Control corner = 1/8 to 1/4 of the height** (median .19); nested rows in menus take the control's own corner (4-6),
   not the container's; only Geist is exactly concentric.
4. **Row = text line × 1.6** (32 rows on a 20 line); Area 1.67.
5. **Badges: height 1.43 × UI text, side ≈ .36 × height, weight 500, 12px text** (one step under UI text).
6. **Checkbox = text line - 4** in every product (16 on 20); Area uses the same rule (14 on 18).
7. **Secondary ink ≈ 6:1 in light, 6-9:1 in dark**, and a default-to-secondary gap of 2.1-3.1 (luminance contrast
   between the two inks) in both themes; dark themes keep the same hierarchy as light.
8. **Titles at 590-700**, body and rows at 400, controls at 500; display tracking -0.012 to -0.04em above 20px.
9. **Card corner ≈ half its padding** (Radix, shadcn), and never above the floating surface's corner.
10. **Page-level underline tabs are 40-50 tall** with 16-24 between labels; panel-level segmented tabs sit at control
    height with a 3-4 inset and a near-concentric thumb.

## 3. Findings (most severe first)

### RL1. Dark secondary ink is far brighter than every product's, which flattens the text hierarchy in dark (inconsistency)
- **What and where.** `--area-layer-dark-muted` is floored at oklab L 0.82344 (`packages/tokens/dist/css/tokens.css:2391`,
  source in `color/curves.ts` per type-ink.md §1: muted rung 250 dark), about #c5c5c5: 10.9:1 on #121212 and 12.2:1 on
  black. Default dark ink is floored at L 0.94912 (#eee, line 2390). The two inks are only 1.49:1 apart. Products: dark
  secondary 6.1-9.0:1 (Linear 6.13 on rgb(8,9,10), shadcn 7.6, Geist 9.0), default-to-secondary 2.2-3.1. In light,
  Area matches the products (muted #666 5.74:1, gap 2.57 vs median 2.6), so the asymmetry is Area's own: the light
  hierarchy is product-like, the dark one is compressed to about half.
- **Families.** Every muted text (descriptions, metadata, group labels, table heads, placeholders share the rung:
  type-ink.md T-placeholder note), every muted icon (Menu, Nav, Tree view, input icons) in dark.
- **Rule fix.** Derive the dark muted ink from the same target as light: secondary ≈ 7:1 on the page and ≥ 4.5:1 on
  the darkest fill it sits on (fill-2), i.e. a floor near oklab L 0.70-0.72 (about #a0a0a0-#a6a6a6: 7.6-8.3:1 on black,
  ~4.7:1 on #333). Keep the 4.5:1 tests unchanged (this does not weaken them); add a cohesion test that the
  default:muted luminance contrast is within 2.0-3.2 in both themes.
- **Visible change.** Dark descriptions, metadata and icons step back one clear level; light unchanged.
- **Size** S-M (one floor in curves.ts + contrast test + dark pass). **Confidence** medium-high (three dark products
  agree; Area's dark ground was taken as #000-#121212, not resolved per Layers setting).

### RL2. Card corner 18 sits above every product and above Area's own floating surfaces (refinement)
- **What.** Card's corner is `max(4, 16 + min(2, 16))` = 18 at the default (shape-state.md row "Card", surface.css
  Card block), over an 18 inset: radius / padding 1.0. Products: card corner 6-14 (Radix 8/8/12/12, Linear 8, Notion
  10, shadcn 14; ChatGPT's settings card 16), radius / padding .375-.58 (Notion's dense board card ~1 at a 10 corner).
  Area's own Popover and Panel use `radius-container` 16, so a resting card is rounder than the menu or popover that
  opens over it; every product keeps cards at or under the floating corner (Radix 8-12 vs menu 8; Geist menu 12).
- **Families.** Card (all sizes), Asset card and Design card (container + 8 = 24, shape-state.md), Board column (16),
  Description list framed (16).
- **Rule fix.** A resting container's corner is `min(radius-container, round(down, 0.6 × its inset, 2))` and never
  exceeds the floating surface corner: Card md 18 → 10, sm (14 inset) → 8, lg (22) → 12 at the default; Corner 12 and
  14 presets still scale through radius-container. Design / Asset card keep their own rule but cap at radius-container
  (24 → 16).
- **Visible change.** Cards read less soft, closer to Radix / Notion / Linear; media inside cards (11 now, odd) becomes
  even. **Size** S. **Confidence** medium (owner chose Corner 10, PR #164; this keeps the setting and changes only the
  card's ratio).

### RL3. Corners run above the products at the default, and Menu rows and Nav rows of the same height disagree (inconsistency)
- **What.** Control corner / height is .26-.31 at Corner 10 (xs 6/22, sm 8/26, md 8/30, lg 10/38, xl 14/46), above the
  products' .125-.25 (median .19). Menu, List box, Command palette and Custom select rows are `radius-list-row` 10 on 30
  rows (.33; base.ts:540-541), while Nav and Tree view rows of the same 30 height are `radius-row` 8 (base.ts:529) and
  products' menu rows are 4-6 (ChatGPT 12 on 36 is the one match).
- **Rule fix.** Two options for the owner: (a) keep Corner 10 as the default but make every full-width row, floating or
  not, take `corner(row height)` (8 at the default), and let the list surface follow (8 + 5 = 13 → 12 or 14 by the
  existing min()); or (b) move the default to Corner 8 (md 6/30 = .2, rows 6, the products' median). (a) fixes the
  internal disagreement without moving the look; (b) also brings the system into the products' range.
- **Visible change.** (a) menu rows 2px less round, matching Nav; (b) every control 2px less round.
- **Size** S (a) / M (b, owner decision). **Confidence** high on the measurement; the default is the owner's choice.

### RL4. Page and section titles are lighter than every product's (refinement)
- **What.** Page header title 18/24 500 (md), 20/28 500 (lg), 16/22 500 (sm); surface titles 13/18 500 (type-ink.md
  rows 25-28, page-header.css). Products' page and section titles: 600 (GitHub 20/30, shadcn 24/32, Geist 24/32),
  590 (Linear 40/44 and 20/26.6), 700 (Notion 32/38.4). No product titles a page at 500. Small surface titles at 500
  are in range (Notion group heads 14/20 500, Linear h3 15/24 510).
- **Rule fix.** Titles from `title-sm` (18 at type 13) up take 600 (a `weight-title` token); `title-xs` and surface
  titles keep 500. Tracking stays (Area's -0.01 to -0.02em is inside the products' -0.012 to -0.04em).
- **Visible change.** Page headers, dialog titles at title-sm and above, document h1/h2 gain weight; body untouched.
- **Size** S. **Confidence** medium (six of six products agree; the title-balance decisions of 2026-11-06 set sizes
  and gaps, not this weight, so check with the owner).

### RL5. Underline tabs used as page navigation are 10-20px shorter than products' (refinement)
- **What.** Tabs take the control height: md 30, lg 38 (geometry.md 2a, navigation.css:11-16). Page-level underline tab
  bars: GitHub 48 (32 items + 8 + 8), Radix 40, Geist 50. In panels (Area's Inspector) 30 is right; at the top of a page
  it reads cramped against a 18-26 title.
- **Rule fix.** A composition rule, no new size: page-level Tabs (under a Page header) use `size="lg"` plus the bar's
  block padding of `ui-cluster` (38 + 8 = 46), panel Tabs stay md. Put it in the Page header recipe (area-ui-compose)
  and the Tabs documentation.
- **Visible change.** Project and system pages' tab bars gain 8-16px. **Size** S. **Confidence** medium.

### RL6. Title-to-description gap 4 is at the low edge of products' 2-8 (refinement)
- **What.** Card, Dialog, Alert, Empty state, Page header: title to copy 4 (type-ink.md §2; surface.css:820, :1016).
  Measured: shadcn card header gap 8, ChatGPT empty state 8 (BASELINE), Notion empty state 2 (BASELINE), Linear page h1
  to lede 12. With 13/18 over 13/18 the visible gap (cap top to descender of the line above) is about 4 + 5 = 9 px
  against shadcn's 8 + 6 = 14.
- **Rule fix.** Keep 4 for compact surfaces (menus, toasts, alerts); take `ui-stack` 6 → 8 on Card, Dialog, Empty
  state and Page header (the products' 8), stated once as "title to description = ui-cluster on a surface".
- **Size** S. **Confidence** low-medium (three measured sources; the owner set 4 in the title-balance pass).

### RL7. Field text inset is a third of the height; products use 3/8 to 2/5 (refinement)
- **What.** Input, Select, Custom select text 10 from the outer edge on a 30 field (.33; inset.css:9-35). Geist 12 on
  32/36/40 (.375-.3), shadcn 12 + 1 edge on 32 (.41), Radix select 12 on 32 (.375).
- **Rule fix.** Fields take the button's inset plus 2 (field text sits further in than a button label, as all three
  products do: shadcn button 10, input 12): `--_box-text` + 2px on fields only.
- **Size** S. **Confidence** low-medium (three products; Radix TextField and GitHub fields unmeasured).

### RL8. Label to field 6 vs 8 (refinement, weak)
- **What.** Field label to control 6 (type-ink.md, Field row). Geist 8 (13/19.5 label). One product only.
- **Fix.** Measure two more (Stripe, Primer forms) before changing; if they agree, label gap = ui-cluster (8).
- **Size** S. **Confidence** low.

### RL9. Section spacing in feeds is double the dashboards' (opportunity, weak)
- **What.** Area's feed system: margin 32, cards 12, sections 48. shadcn dashboard: margin 24, cards 16, next section
  24; Linear docs h2 to grid 32, cards 16. Feeds and dashboards differ in purpose, and only two products were measured.
- **Fix.** None now; record a dashboard recipe (margin 24, cards 16, sections 24-32) beside the feed recipe in
  area-ui-compose if the owner wants dashboards to read like the products.
- **Size** S. **Confidence** low.

## 4. Within range or better (keep)

- Control height to text ratio (2.31 vs 2.29), the 4-then-8 height ladder (Primer's shape), button label weight 500,
  icon-to-label 6, select chevron gap 6, menu padding and row height, separator block, table row 38, sidebar row 30
  with icon 8 in: all inside the products' ranges.
- Badge geometry: height / text, side / height (.33 vs .36 median), 500 weight, the small step under UI text.
- Checkbox = line - 4: the identical rule all products use.
- Light ink hierarchy: muted #666 at 5.74:1 and the default:muted gap 2.57, both at the products' median.
- Concentric arithmetic: Area is stricter than Radix (8 over 4 with 8 inset) and shadcn (8 over 6 with 5 inset);
  segmented / plate tabs are exact where shadcn rounds 7 to 8. Only Geist's menu matches Area's rigour.
- Title tracking (-0.01 / -0.015 / -0.02em) inside the products' band.
- Dark ground near black: matches Geist (#000) and Linear (rgb(8,9,10)); shadcn's #0a0a0a.

## Appendix A. Raw measurements (rendered, getComputedStyle + getBoundingClientRect, 1440 wide, light, signed out)

Format per signature: count x "example text" height, padding T/R/B/L, text font-size/line-height weight, ink, fill,
border, radius, icon size and icon-to-label gap (i2l), shadow, contrast (cr) of the text against its first opaque
ground. Colours as rendered rgb().

### A1. GitHub (Primer in production), https://github.com/facebook/react/issues (redirects to react/react)

Body font "Mona Sans VF", -apple-system. Body ground #fff.

- Primary "New issue": 32 tall, 0/12 padding, gap 8, 14/21 500, #fff on rgb(31,136,61), 1px rgba(31,35,40,.15) border,
  radius 6, shadow rgba(31,35,40,.04) 0 1 1, rgba(31,35,40,.03) 0 1 2. Ratios: pad/h .375, radius/h .19.
- Invisible (ghost) icon button small: 28 x 28, radius 6, ink rgb(89,99,110) (#59636e, 6.11:1 on white).
- Default secondary (filter buttons): 32, 0/12, gap 8, 14/21 400, rgb(37,41,46), transparent 1px border, radius 6.
- Toolbar square 32 x 32, fill rgb(246,248,250), 1px rgb(209,217,224) border.
- Counter (tab count) 18 tall, 2/6 padding, 12/12 600, fill rgba(129,139,152,.12), radius 20 (pill); contrast 4.57 on
  its own fill (ink #1f2328 on the tinted fill).
- Issue labels (Label): 20 tall, 0/8 padding, 12/18 600, pill (9999), solid tint fills (e.g. rgb(212,197,249) with black
  ink 13.15:1, rgb(182,2,5) with white 7:1). Small success label 20 tall, 0/6, 12 500, 1px rgb(31,136,61) outline, pill.
- UnderlineNav (repo tabs): bar 48 tall incl. 8 top padding, items 32 tall, 6/8 padding, 14/21 400 (current 600),
  radius 6 hover plate, 16 icon 8 before the label; bar rule = inset box-shadow 0 -1 0 rgba(209,217,224,.7).
- Sidebar (NavList): rows 32 tall, radius 6, 6/8 padding, 14/20 400 rgb(31,35,40), 16 icon 8 before label; row height /
  line 1.6.
- Pagination current page: 32, 8/6, 14/14, #fff on rgb(9,105,218), radius 6.
- Issue list: Box 1136 wide at x 280, 1px rgba(209,217,224,.7), radius 6. Rows 65 tall (one-line title 16/24 500 +
  12/18 meta), title 10.5 from row top, 40 from the row's start (16 icon 8 before); rows separated by rules.
- Type in use (chars): 12/18 400 rgb(89,99,110) secondary (6.11:1); 16/24 500 titles rgb(31,35,40) (15.8:1); 14/21 400
  body. Page h1 20/30 600; section h2 32/48 600 (visually hidden ones excluded); list titles h3 16/24 500.

### A2. Radix Themes playground, https://www.radix-ui.com/themes/playground (default theme: radius medium, scaling 100%)

Font untitledSans. Tokens rendered on `.radix-themes`: space 4 / 8 / 12 / 16 / 24 / 32; radius 3 / 4 / 6 / 8 / 12 / 16;
type 12/16, 14/20, 16/24; gray-11 display-p3(.379 .392 .421) ~ rgb(97,100,107), about 5.9:1 on white; gray-12
display-p3(.113 .125 .14) ~ rgb(29,32,36); borders gray-a6 / a7 (15% / 20% alpha) as inset box-shadow rings.

| Component | size 1 | size 2 (default) | size 3 | size 4 |
|---|---|---|---|---|
| Button (solid/soft/surface/outline/ghost) | 24, 0/8, 12/16 500 ls .03px, radius 3, gap 4 | 32, 0/12, 14/20 500, radius 4, gap 8, 16 icon | 40, 0/16, 16/24 500, radius 6, gap 12 | 48, 0/24, 18/26 500 ls -.045px, radius 8, gap 12 |
| Icon button | 24 (ghost 23 measured with negative margin), radius 3 | 32 square, radius 4; ghost 28 (6 padding) | 40 (ghost 32, 8 padding), radius 6 | |
| Text field | | 32 tall root, 1px inset ring, radius 4, 14/21 | | |
| Select trigger | | 32, 0/12, 14/20 400, gap 6 to chevron, radius 4 (ghost 28, 4/8) | | |
| Text area | | 64 min, radius 4 | | |
| Checkbox / radio | | 16 x 16 | | |
| Switch | | 35 x 20 | | |
| Badge | 20, 2/6, 12/16 500 ls .03px, radius 3, gap 6 | 24, 4/8, 12/16 500, radius full in the sample (radius 4 default) | | |
| Segmented control | 24 | 32 | 40 | |
| Tabs (TabNav / Tabs) | | trigger 40 tall, 0/8, 14/20 400 (active 500 via inner), list 40 with 1px bottom ring | | |
| Card | 12 padding, radius 8 | 16 padding, radius 8 | 24 padding, radius 12 | 32 padding, radius 12 |
| Callout | | 16 padding, gap 12, radius 8 | | |
| Table (surface) | | header and cells 44 tall, 12/12 padding, 14/20 | | |
| Avatar | | | 40, radius 6 | 48 radius 6; size 5 64 radius 8 |
| Kbd | | 18.4, 10.5px text, radius 3.7 (em-based) | 22.4, 12.8px, radius 4.5 | |

- Dropdown menu (size 2, opened by click, read after its entry animation ended): content 152 wide, white, radius 8,
  viewport padding 8; items 32 tall, 0/12 padding, 14/20 400, radius 4, flush (0 between items); item inset 8 from the
  menu edge, so the nesting is 8 (menu) over 4 (row) with an 8 inset: not concentric (8 - 8 = 0), the row keeps the
  control radius-2. Separator 1px gray-a6, 8 margin above and below (17 block), starting 12 in from the row edge (= the
  row's text column). Shortcut ink gray-a11 (62% alpha), 16 before it. Shadow (shadow-5): 1px ring gray-a3 mixed 25%,
  0 12px 60px black 15%, 0 12px 32px -16px blue-black 12%.
- Ratios: button pad / height .375 (s2) .4 (s3) .5 (s4) .33 (s1); radius / height .125-.17; gap 4 / 8 / 12 / 12.

### A3. shadcn/ui examples (v4, new-york style), https://ui.shadcn.com/examples/dashboard and /examples/tasks

Font Geist. Colours resolved via canvas from lab(): page #fff; sidebar rgb(250,250,250); border rgb(229,229,229);
muted ink rgb(115,115,115) (4.74:1 on white); secondary fill rgb(245,245,245); sidebar group label black at 70%.
Dark (class `dark` applied in the page for reading only, then removed): page rgb(10,10,10), sidebar and card
rgb(23,23,23), border white 10%, muted ink rgb(161,161,161) (about 7.0:1 on 23; 7.6:1 on 10), title rgb(250,250,250),
tabs track and table header rgb(38,38,38).

- Buttons (data-slot=button): default 36 (rendered 35-36), 0/12, 14/20 500, gap 6, radius pill in this example's
  theme (26) / sm 32, 0/10, gap 6, radius 8; outline sm 32, 1px rgb(229) border, shadow 0 1px 2px black 5%; icon 32 x
  32 radius 8; ghost sm 32, 0/10. Ratio pad / height .31-.33.
- Input: 32, 4/12 padding, 14/20 400, radius 8, 1px border. Select trigger: 32, 8/12 (sm) or 8/8/8/10, gap 6-8 to
  chevron, radius 8-10, shadow 0 1 2 black 5%.
- Checkbox 16 x 16, radius 4, 1px border, shadow 0 1 2 black 5%.
- Badge: 22, 2/8 padding, 12/16 500, gap 4, pill, 1px border (outline variant rgb(229)).
- Tabs (segmented style): list 36, 3 padding, radius 10, fill rgb(245); trigger 29 (with 1px border), 4/8, 14/20 500,
  radius 8 (10 - 3 = 7, rounded to 8; near concentric), active white with shadow 0 1 3 black 10%, 0 1 2 -1 black 10%.
- Sidebar: 256 wide; header 49, 8 padding; group 8 padding; group label 32 tall, 0/8, 12/16 500 at 70% ink, radius 8;
  menu buttons 32 tall, 6 padding, 14/20 400, gap 8 (icon 16 to label), radius 8, 4 between items (sidebar-menu gap
  4). Row height / line 1.6.
- Card: 1px rgb(229) border, radius 14, padding 24 block / 24 inline on header and content, internal gap 24, shadow 0 1
  2 black 5%. Card header gap 8 between description (14/20 muted) and title (24/32 600 metric). Card grid gap measured
  in the dashboard section cards: 16 (see section spacing below). Card footer 14/20, gap 6.
- Table: header row 40, head cells 0/8 padding, 14/20 500; body rows 49-53 (cells 8 padding around 32 controls), 14/20
  400; checkbox column 44.
- Dropdown menu (opened on a row's actions; read after 500ms): 160 wide, 1px border (white 10% in the dark render),
  4 padding, radius 8, shadow 0 4 6 -1 black 10%, 0 2 4 -2 black 10%. Items 32, 6/8 padding, 14/20 400, gap 8, radius
  6, flush; items 5 from the menu edge (4 + 1 border). Separator full-bleed (1 from the edge, -4 margin) with 4 above
  and below (9 block). Shortcut 12/16 in muted ink. Nesting 8 over 6 with a 5 inset: not concentric (8 - 5 = 3).
- Page title (tasks): h2 24/32 600, letter-spacing -0.6px (-0.025em).
- Section spacing (dashboard): metric cards 245 wide, 16 apart horizontally; the chart card sits 24 below the card row;
  content 24 from the inset panel's edge; site header 64.

### A4. Vercel Geist, https://vercel.com/geist/{button,input,badge,menu,tabs,checkbox} (production Geist components)

Font GeistSans. The pane first rendered these pages dark (prefers-color-scheme dark carried over): page and body pure
rgb(0,0,0); secondary ink rgb(161,161,161) (9.0:1 on black), primary rgb(237,237,237); muted label rgb(143,143,143).
Then light: page #fff, ink rgb(23,23,23), secondary rgb(77,77,77) (8.5:1), placeholder / disabled rgb(143,143,143)
(3.3:1).

- Button: small 32, medium 36 (shown as default on the page), large 40. Inline padding is split between the button
  (6 / 10 / 14) and the label span (6 each side), so the label starts 12 / 16 / 20 in: pad / height .375 / .44 / .5.
  14/21 500 (large 16/24 500); radius 6 / 6 / 8; icon 14 at 36 (16 at 40), 6 before the label; no shadow, no border on
  secondary (fill rgb(237) dark-mode, gray-100 light). Icon-only squares 24 (radius 4), 32, 36, 40 (radius 6/6/8);
  `shape="circle"` pill.
- Input: 32 / 36 / 40, the border a 1px ring `0 0 0 1px rgba(0,0,0,.08)` on the wrapper (renders about rgb(235);
  1.2:1 against white: below 3:1 non-text contrast), radius 6, text 12 in (input padding 0/12), 14/20 (large 16/24);
  disabled fill rgb(242) with rgb(143) ink. Label 13/19.5 400 rgb(77,77,77), 8 above the field. Textarea 100 tall.
- Badge: sm 20 (11/20 500 ls .2px, padding 2/8), md 24 (12 500, 12 sides), lg 32 (14/20 500, 12 sides);
  all pills; gap 4 / 5 / 6; icon 14 at 24, 16 at 32. Solid fills with white ink (gray rgb(77) 8.5:1) or inverted.
- Menu (opened by click): 200 wide, white, padding 6, radius 12; shadow `0 0 0 1px rgba(0,0,0,.08), 0 1px 1px
  rgba(0,0,0,.02), 0 4px 8px -4px rgba(0,0,0,.04), 0 16px 24px -8px rgba(0,0,0,.06)`; items 36 tall, 0/8 padding,
  14/20 400, radius 6, flush. Nesting 12 over 6 with a 6 inset: exactly concentric (12 - 6 = 6).
- Tabs (underline): bar 50 (tab 14/2/14/2 padding around a 20 line + 2px underline), 24 between tabs, 14/20 400 both
  states; selected ink rgb(23,23,23) with a 2px rgb(23) underline, unselected rgb(77,77,77); bar rule inset shadow 0 -1
  rgb(234).
- Checkbox 16, radius 4, 1px rgb(143) edge (3.3:1), label 13/19.5 400.

### A5. Linear, https://linear.app/docs (rendered dark only; the docs have no light theme signed out)

Font "Inter Variable"; weights 510 (UI, labels, h3) and 590 (h1, h2): Linear's variable stops, between 500 and 600.
Ground rgb(8,9,10) (near black); primary ink rgb(247,248,248) (18.7:1); secondary rgb(138,143,152) (6.13:1);
brand button fill rgb(94,106,210) with white 14/21 510 (4.7:1).

- Sidebar rows: 32 tall, padding 0/11/0/8, 14px 510, letter-spacing -0.182px (-0.013em), secondary ink at rest,
  16 icon, radius 8. Row / line 1.5 (21 line); 32 / 14px = 2.29.
- Search pill: 32, 0/12, 13px 510, 1px rgb(28,28,31) edge, full radius.
- Top nav item: 36 tall, 0/5, 14/21 510, radius 8.
- Headings: h1 40/44 590 ls -0.88px (-0.022em), lede 15/24 400 secondary 12 below; h2 20/26.6 590 ls -0.24px
  (-0.012em), content 32 below; card title h3 15/24 510 ls -0.165px, description 16/24 3 below.
- Cards ("Popular"): 242 x 280, radius 8, fill white 5%, 1px white 5% edge, no shadow, 16 apart. Content column 976
  wide, starting x 372 (after a ~300 sidebar), h1 112 from the top.
- Section rhythm: h2 to its card grid 32.

### A6. Notion (real app, public page read-only), https://notion.notion.site/8075f1f06c2c4a85a53994950e52e4e8
(Notion's own "Roadmap" template; light)

Ink rgb(44,44,43) (14.0:1 on white); muted rgb(125,122,117) (4.2:1); dividers rgba(42,28,0,.07) (warm 7%).

- Top bar 44. Page title 32/38.4 700, 0/8 padding (text starts 148... at x 140 + 8).
- View tabs (2026 style): 32 tall pills, radius 20, padding 6/12, 14/16.8 500, 20 icon box, current fill
  rgba(33,27,23,.05); tabs 1 apart.
- Board: groups 276 wide, 0/8/8/8 padding, tinted group fill (e.g. rgba(199,3,3,.035)), 12 between groups; group
  heading 14/20 500 in the group's dark tone (e.g. rgb(109,53,49)).
- Board card: 260 wide, white, radius 10, shadow `0 4px 12px rgba(25,25,25,.027), 0 1px 2px rgba(25,25,25,.02)` +
  a 1px ring tinted by the group (rgba(223,22,0,.094)); title 15/22.5 500, first text 9 from the card top; property
  lines 12/18 400 on a 28 rhythm (18 line + 10).
- Select tags: 18 tall, 0/6, 12/14.4 400, radius 4, translucent tints (rgba(209,156,0,.282) with rgb(101,81,33) ink;
  neutral rgba(42,28,0,.07) with default ink). Tag height / text 1.5; radius / height .22.
- Small floating button (card hover action): 28 x 24, radius 4, white, shadow `0 8px 12px rgba(25,25,25,.027), 0 2px
  6px rgba(25,25,25,.027)` + 1px rgba(42,28,0,.07) ring.
- Table view: header row 36, header text 14/16.8 400 muted rgb(125,122,117); body rows 37 (36 + 1px rule), cell rules
  1px rgba(42,28,0,.07) right and bottom, no zebra, no outer frame.
