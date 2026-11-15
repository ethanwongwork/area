# Rendered review: Content and data (2026-11-11, prefix VC)

Reviewer group: CONTENT AND DATA, 27 families. Rest states at the shipped defaults (type 13, density 32, corner 10),
light and dark, judged from the capture set (`rendered/out/`, method in `rendered-method.md`).

## 1. Method and coverage

**Read.** AGENTS.md, COMMON.md, REVIEW.md, `rendered-method.md`; the Findings of `geometry.md`, `type-ink.md`,
`shape-state.md` (closely where they touch these families), the table/card rows of `ref-live-products.md`; the specs
`card.md` (spacing table and history), `surface.md` (soft), `asset-card.md`, `design-card.md`, `table.md` (frame);
`chart.css`, `folder.css`; `apps/desktop/src/content/pages.mjs` (gallery notes).

**How values were resolved.** Every length and colour below comes from `out/<slug>/measure.json` (CSS px relative to
the tile's view, stage at `scale: 1`). I wrote two read-only helpers in the scratchpad (`review-VC/dump.js`: a compact
per-node/per-text dump; `review-VC/tiles.js`: crops every tile's measured extent ± 10 px from the 2× PNG into contact
sheets, for looking only). Text tops are `Range` line boxes; "cap" means the trimmed box Area reports
(`insetBorderBox.top` negative = trimmed). Contrast figures are WCAG ratios computed from the measured sRGB.

**Viewed (every tile, light):** abbreviation, accordion, asset-card, board, card, chart, description-list, design-card,
figure, file-image, file-page, file-tile, folder, hatnote, inline-list, link-groups, mention, page-header,
reference-list, section-heading, stack, surface, table, table-of-contents, timeline, titlebar, video-player.
**Dark:** every tile of card (templates), chart (default), table (default), description-list, timeline, surface, folder,
file-tile, design-card, asset-card, board; the rest at the default tile via the kind contact sheet.

**Could not verify.**
- Video player: `measure.json` and the PNG disagree after the first two tiles (measure says `layout-minimal` is a
  576 × 576 extent, the PNG shows a 16:9 player; `layout-narrow` and `composition-figure` crops land on the wrong
  pixels). I judged video player from the stitched PNG only and quote no lengths for those three tiles.
- SVG text inside Chart (ticks, donut centre) is not in the `texts` list (svg children are not listed); tick font and
  clipping are judged from the pixels plus `chart.css:52-53`, not from a measured rect.
- `font-variant-numeric` is not in the measure (only `font-feature-settings`), so tabular numerals in Table were taken
  from the source audit (type-ink census row "numeric cells tab"), not re-measured.
- Hover, pressed and open overlays: none of my families had overlay captures; hover paint is not judged.

## 2. Scorecard (1 to 5; 5 = shipped-product quality)

| Family | Bal | Spc | Type | Shape | Col | Feel | Verdict |
|---|---|---|---|---|---|---|---|
| Abbreviation | 5 | 5 | 5 | – | 4 | 4 | Dotted underline, right weight; fine. |
| Accordion | 4 | 3 | 2 | 4 | 4 | 3 | Plain md title equals its body (15/22/400, same ink); chevron meaning flips between variants (VC15). |
| Asset card | 4 | 4 | 4 | 3 | 4 | 4 | Polished frame-in-card, but corner 20 (spec says 16) and name above, unlike its siblings (VC3, VC4). |
| Board | 5 | 4 | 4 | 5 | 5 | 4 | Best concentric nesting in the group (16 / 8 / 8); tones calm in both themes; wrap demo doesn't wrap. |
| Card | 4 | 4 | 4 | 4 | 3 | 3 | Padding is now right (18 on every edge, all 26 tiles); feel let down by invisible media plates and empty templates (VC7, VC20). |
| Chart | 3 | 3 | 3 | 4 | 3 | 3 | Last x tick clipped, gallery tiles bleed to the frame, mono ticks, yellow series 1.8:1 (VC2, VC8, VC16, VC17). |
| Description list | 4 | 4 | 3 | 4 | 4 | 3 | Clean rows; two label styles; first letter clipped in the gallery (VC8, VC26). |
| Design card | 2 | 3 | 4 | 3 | 4 | 2 | Held tile's design overflows its ground; screen tile shows an empty frame (VC1, VC21). |
| Figure | 4 | 4 | 4 | 4 | 4 | 4 | Good caption rhythm; "Long caption" tile never wraps (VC9). |
| File image | 4 | 4 | – | 4 | 3 | 3 | Correct shape; faint in light and dark (VC22). |
| File page | 4 | 4 | 2 | 4 | 3 | 3 | Faint; label below the type floor (T22). |
| File tile | 4 | 4 | 4 | 4 | 3 | 3 | Good grid; selection plate weak (VC23); glyphs washed out in dark. |
| Folder | 4 | 4 | 2 | 4 | 3 | 3 | Count/badge text below the floor; nearly vanishes in dark (VC22). |
| Hatnote | 5 | 5 | 4 | – | 4 | 4 | 1.6em indent, muted ink, blue link; fine. |
| Inline list | 5 | 5 | 4 | – | 4 | 4 | Even separators; fine. |
| Link groups | 5 | 4 | 4 | – | 4 | 4 | Clear three-level hierarchy (16 → 13/500 → 13 muted). |
| Mention | 4 | 3 | 4 | 4 | 4 | 4 | Chip 21 tall in an 18 line: wrapped chips collide (VC24). |
| Page header | 4 | 4 | 2 | – | 4 | 3 | Hierarchy too flat: sm equals Section heading, lg tops out at 20/500 (VC13). |
| Reference list | 4 | 3 | 4 | – | 4 | 4 | Reads like Wikipedia; rows at an 18 pitch with no gap; Highlighted state shows nothing at rest. |
| Section heading | 4 | 4 | 3 | – | 4 | 4 | 16/500 over a 12 lede: the lede is a step too small (VC14). |
| Stack | 5 | 5 | 4 | 4 | 4 | 3 | Correct gaps; demo of outline buttons reads as a wireframe. |
| Surface | 3 | 3 | 3 | 4 | 3 | 3 | Same corner as Card, different inset and title; soft variant invisible but still pads (VC5, VC6). |
| Table | 4 | 4 | 3 | 4 | 4 | 4 | Real data-product table; header weak, selection column makes rows taller, first column wraps (VC10–VC12). |
| Table of contents | 4 | 4 | 4 | 4 | 4 | 4 | Nav rows, clear current bar; text on fractional pixels (VC27). |
| Timeline | 5 | 4 | 4 | 4 | 4 | 5 | Clean, real-looking activity log. |
| Titlebar | 5 | 4 | 4 | 4 | 4 | 4 | Bar 47 with 26 controls centred (10.5 / 10.5); floating variant good. |
| Video player | 4 | 4 | 4 | 4 | 4 | 4 | Controls on 72% black plates read well over a bright image; lengths not verified (see method). |

## 3. Census tables

### 3a. Card-like frames at the default (md), measured

| Family (tile) | Outer corner | Edge | Media / ground inset → media corner | Text inset from edge | Name position | Name type | Media → name | Caption / secondary |
|---|---|---|---|---|---|---|---|---|
| Card (default) | **18** | 1px 10% ink + rest shadow | 7 → **11** | **18** (cap 18 from top) | below media, inside | 13/18/**500** default | media bottom 183.7 → cap 197.7 = **14** | 13/18 muted, 4 below title |
| Card sm / lg | 16 / 21 | same | 5 → 11 / 10 → 11 | 14 / 22 | same | same | 10 / 18 | same |
| Surface (default) | **18** | same as Card | – | **14** (section-heading title) | top, inside | **16/22/500** | – | **12/18** muted lede |
| Asset card (default, framed) | **20** | 1px 10% | 5 → **15** (frame 5% edge) | name 13.4 | **above** media, inside a 34 head | 13/18/**400** default | name cap centred in head | – |
| Design card (default) | ground **24** (no outer card) | 1px 10% | – (design centred in ground) | name **4** from ground edge | **below**, outside the ground | 13/18/**400** default + 13 muted detail | ground bottom 276 → text top 284 = 8 | detail right-aligned |
| Figure | image **16** | none | – | caption **0** | below, outside | **12/16** muted | 8 to line top | – |
| File tile | selection plate **8** | none | figure 64 in 8 pad | centred | below, centred | 13/18/**500** + 12/16 muted | 8 | meta 0 below name |
| Board column / card | **16** / 8 | card: ring + rest shadow | column pad 8 → card **8** (concentric) | column title 18; card 10 | header row, inside | 13/18/500 | – | – |
| Description list framed | **16** | 1px | – | – | – | – | – | – |
| Table frame | **14** | 1px 12.5% | – | first cell 15 | – | – | – | – |
| Video player | **16** | none | – | – | – | – | – | caption via Figure (12/16) |
| Panel (DL in-panel, Surface in-panel) | 16 | 1px 7.5% | – | 13 | – | – | – | – |

Large-container corners in this group alone: **14, 16, 18, 19 (Composer in Mention), 20, 21, 24**. Item-name weights:
400 (Asset card, Design card) vs 500 (Card, File tile, Board card). Name positions: above (Asset card), below inside
(Card), below outside (Design card, Figure, File tile). Name indents: 0 (Figure), 4 (Design card), 13.4 (Asset card),
18 (Card), centred (File tile).

### 3b. Card slot spacing (the owner's 2026-10-30 "the padding is always wrong")

Measured on every md tile that has the part (default, horizontal, horizontal-end, thumbnail, header-action, list,
well, selected, task, stat, weather, plan, feature):

| Slot | Value | Status |
|---|---|---|
| Title cap from top edge (no media) | 18.0 (e.g. header-action: card 166.4, cap 184.4) | equal to side |
| Text from side edge | 18.0 (346 − 328) | ✓ |
| Footer control / last line descent to bottom | 18.0 (button 247.9 + 30 = 277.9; card bottom 296) | ✓ (descent, see VC18) |
| Media inset (top / side) | 7 / 7; media corner 11 = 18 − 7 | concentric ✓ |
| Media bottom → title cap | 14 (= block gap) | one gap below the 18 inset |
| Title → description | 4 (h3 bottom 211.9 → 215.9) | ✓ "description joins its title" |
| Block gap (text group → list / footer / badges / separator) | 14 | ✓ everywhere |
| Header action (badge) | centred on the title's cap line | ✓ |
| Well (content-well) | well inset 7, pad 11 → nested cards' left edge at 18, on the text column | ✓ |

Answer: **yes, Card's padding is now right and even** at md: one 18 inset on every side, one 14 block gap, one 4 pair
gap, across all 26 tiles. The two places it still reads off are optical, not arithmetic: VC18 (text-only bottom) and
the 79 px dead band in the stat/weather templates (VC20).

### 3c. Text-list rhythm (single 13/18 lines unless noted)

| Family (tile) | Item pitch | Line + gap | Notes |
|---|---|---|---|
| Reference list | **18** | 18 + 0 | `gap 0/6` |
| Inline list (wrap) | 18 | 18 + 0 | inline flow, correct |
| Link groups | **22** | 18 + 4 | |
| Accordion plain (md) | **24** | 15/22 + 2 | title and body in one style |
| Description list | **26** | 18 + 8 | |
| Table of contents | **31** | Nav row 30 + 1 | text at y .6 (VC27) |
| Accordion divided sm | 36 rows; title → body 27 | trigger 9/9 pad | |
| Timeline | **38** | marker 22 + 16 | meta 12/18 |
| Description list framed | **42** | row 24 pad | |

## 4. Findings, most severe first

### VC1 · defect · Design card's design overflows its ground (Held tile)
- **What / where.** `design-card` tile `state-held`: ground `__ground` 160 × 160 at x 114; the design (a Card, 520 × 116
  scaled to 260 × 58) sits at x **64**, 50 px past the ground's left edge and 50 past its right; the ground clips it, so
  the tile shows a black bar touching both edges and no card (crop: `review-VC/T-design-card-light-0.png`, last tile of
  row 1). Default tile fits (Button 75 × 30 in a 240 ground) only because the part is small.
- **Families.** Design card (and Asset card's group mosaic, which scales designs the same way: `container-containerless-
  group` shows a Button at 28 × 13 and type at 7 px, legible only as a texture).
- **Rule.** A design's scale is `min(1, (ground − 2·pad) / design)` on **both** axes; never wider than the ground. Add a
  gallery check: every `__design` rect inside its `__ground` rect.
- **Visible change.** The held card shows the whole Card, scaled to ~0.27.
- **Size** S. **Confidence** high.

### VC2 · defect · Chart's last x-axis label is cut ("Nov 7" → "Nov")
- **What / where.** Line, area, stacked area, single series and hidden tiles: the last tick is centred on the plot's
  right edge and the SVG (`384 × 192`, `chart.css:50`) clips its second half; the picture shows "Nov" at the right end
  (crop `review-VC/chart-line-end.png`). Bar charts are unaffected (their ticks sit under bar centres).
- **Rule.** The first and last x ticks anchor `start` / `end` (or the plot insets by half the widest label). Any text
  drawn by a chart stays inside its SVG viewport (test: tick bbox ⊂ viewBox).
- **Visible change.** "Nov 7" reads whole, flush with the plot's right edge.
- **Size** S. **Confidence** high on the pixels (SVG text not in the measure).

### VC3 · inconsistency · Card-like frames use six corners
- **What / where.** Table 3a: Table 14, Board column / Description list framed / Panel / Video player / Figure image 16,
  Card / Surface 18, Composer 19, Asset card **20**, Card lg 21, Design card ground **24**. The specs still say "corner 16
  at the default" for Asset card (`asset-card.md:120`) and Design card (`design-card.md:60, 104`, "container radius +
  8, concentric"), written before the default corner went 8 → 10; rendered they are 20 and 24. Shape-state S15
  (Table 14 vs DL 16) and S14 (overlays) are confirmed; this extends them to in-flow cards. Side by side (Description
  list `composition-summary`: Card 18 beside `composition-in-panel` Panel 16; Chart `content-card`: Card 18 around a
  plot 8) the difference reads as two systems.
- **Families.** Card, Surface, Asset card, Design card, Figure, Video player, Table, Description list, Board, Panel.
- **Rule.** One in-flow container corner (`radius-container`, 16 at the default) for every card-like frame at md; size
  steps (sm / lg) and nested parts derive from it concentrically (Board's 16 / 8 pad / 8 card is the model). Design and
  Asset card drop their "+ 8" / "+ inset" add-ons or the spec states why a picture card is rounder. Update the stale
  "16 at the default" sentences either way.
- **Visible change.** Asset card 20 → 16, Design card 24 → 16, Card / Surface 18 → 16, Table 14 → 16; media corners
  follow (Card's 11 → 9, the odd value S15 already flagged, becomes even with inset 7 → 7 only if the inset also moves:
  decide with VC5).
- **Size** M. **Confidence** high on the census; the target value is a design call.

### VC4 · inconsistency · The item's name sits in four places at two weights
- **What / where.** Table 3a: name above the media (Asset card default, head 34, cap centred, x 13.4 from the edge),
  below inside (Card, x 18), below outside (Design card x 4, Figure x 0, File tile centred). Weight 400 (Asset card,
  Design card) vs 500 (Card, File tile, Board card) for the same role, "the thing's name". Media → name gap: 14 (Card),
  8 to line top (Design card, Figure, File tile). The 2026-11-01 card system (memory: "one card, name below, 8 in")
  and the feed system ("names top-left") already disagree; the render shows both.
- **Rule.** One "item name" part shared by every picture card: one weight (500 default ink, as Card and Board card;
  400 only for a caption, which is Figure's muted 12), one gap from the picture (8 outside, the inset inside), one
  indent rule (0 when outside and the picture has no frame; the card's text inset when inside). Position stays a prop
  (`caption="above|below|outside"`) but each position has one geometry.
- **Visible change.** Asset card and Design card names gain weight 500; Design card's 4 indent → 0 (or Asset card's
  13.4 → its frame's inset 5 + 8).
- **Size** M. **Confidence** medium-high (weights and positions measured; which is canonical is the owner's).

### VC5 · inconsistency · Surface and Card: same corner, different inset, title and gap
- **What / where.** Surface md: corner 18, inset **14** (pad 13 + 1), block gap **10**, title **16/22/500**
  (Section heading) over a **12/18** lede. Card md: corner 18, inset **18**, block gap **14**, title **13/18/500** over
  **13/18** muted. Surface sm/lg insets 12 / 17 vs Card 14 / 22. geometry.md 2c lists both rows; rendered side by side
  (Surface `in-card`) the Surface's content sits 4 px closer to its edge than the Card's around it.
- **Rule.** A region container and a card at the same corner share the inset ladder and the title pair; Surface's
  title is a Card title (13/500 + 13 muted, 4 apart) unless the surface heads a page section, where Section heading
  applies outside the frame.
- **Visible change.** Surface default: title 16 → 13/500, lede 12 → 13, inset 14 → 18, gap 10 → 14 (or Card moves to
  Surface's: decide once).
- **Size** S–M. **Confidence** high on the measures.

### VC6 · defect · A soft Surface at Layers 0 paints nothing but still pads 14, so text edges misalign
- **What / where.** `surface--soft` bg = the surface's own fill (light ok(1.000), dark ok(0.085)), no border, no shadow
  (variant-soft, nested, in-card, in-panel). Owner decision 2026-10-29: "keep Flat flat" (`surface.md:140-142`), so the
  well is invisible by design. But its 13 + 1 padding stays: `in-card` "Item one" at x **76** vs the card's "Title" at
  x **62**; `in-panel` "Item one" x **102** vs heading "Label" x **88**. The reader sees two left edges 14 apart with
  nothing explaining the indent. Meanwhile Card's own well (`area-card__media--well`) **does** paint at Layers 0:
  rgb(250,250,250) / dark rgb(40,40,40). Two "wells", two answers.
- **Rule.** Keep Flat flat, but an unpainted region takes no inset of its own (inline padding 0 when its fill equals
  its ground; block gap only), or soft Surface uses the same well fill as Card's well. Pick one well and use it in both.
- **Visible change.** In a card or panel, a soft row's text lines up with the title column; or the row gains Card's
  faint well.
- **Size** S. **Confidence** high.

### VC7 · inconsistency · Media placeholders and wells are invisible in light, heavy in dark
- **What / where.** Card media plate: light rgb(250,250,250) on white = **1.04:1**; dark rgb(40,40,40) on the card's
  ~#0b0b0b = **1.34:1** but ΔL 0.19 vs 0.02 in light. In light the plates nearly vanish (Card default, sizes, video,
  music, carousel: the tiles read as text floating over nothing); in dark they read as solid grey blocks, and the
  template-feature well (rgb 40) makes its near-black nested cards look like holes
  (`review-VC/T-card-dark-template-0.png`).
- **Families.** Card (media, well, carousel), Chart (loading skeleton block), Asset card (checker, frame-alone).
- **Rule.** A placeholder/well step is one perceptual step in both themes (the same ΔL off its ground, e.g. 0.035 in
  light and dark), not a fixed `bg-subtle`/`bg-component` pair that is 2% in one theme and 19% in the other.
- **Visible change.** Light plates become visible (≈ #f2f2f2 on white), dark plates recede (≈ #1a1a1a on #0b0b0b).
- **Size** S (token) / M (audit every placeholder). **Confidence** medium-high (values measured; the right ΔL is a call).

### VC8 · defect (gallery) · Chart and Description list demos run to the tile's edge and are clipped
- **What / where.** 22 tiles have a stage at x 1.5 with `inline-size: max(100%, 385px)` in a 388 view: all 15 Chart
  tiles and 7 Description list tiles. The legend's first key (x 2, 8 px) is cut to a sliver
  (`review-VC/chart-default-full.png`), the last bar touches the frame, and Description list's first letter reads
  ".abel" (`variant-divided`, `content-no-icons`, light and dark).
- **Rule.** A gallery stage keeps the tile's 20 px gutter; a demo whose content needs more width gets a one-column
  card (as `oneColumn` families do), never a stage wider than the card.
- **Visible change.** Keys and labels whole; charts gain 18 px of air on each side.
- **Size** S. **Confidence** high.

### VC9 · defect (demo, system-wide) · Tiles that say "wraps onto a second line" render one line
- **What / where.** Figure `content-long-caption` (207 of 220, 1 line), Board default "Title that wraps onto a second
  line" (208 of 240, 1 line), Section heading `content-lede` (227, 1 line). Outside this group the same check finds
  Editable text `content-long` and Message `stack`. The tile exists to show wrapping and doesn't.
- **Rule.** A wrap demo fixes its width (or uses longer copy) so it wraps at the default type; add a gallery test:
  any rendered text containing "wraps" has ≥ 2 line boxes.
- **Visible change.** The three tiles show their second line and its leading.
- **Size** S. **Confidence** high.

### VC10 · defect · Table's sticky first column wraps its names
- **What / where.** `sticky-first-column`: the table is 333.9 wide in a 288 scroll wrapper, yet the first column
  shrank to 59 and "Item one / two / three" wrap to two lines, so rows are **59** tall against **39** elsewhere.
- **Rule.** In a scrolling table, text cells don't wrap by default (`white-space: nowrap` on cells, wrapping opt-in per
  column); the sticky column takes its min-content.
- **Visible change.** Rows return to 39; the table scrolls sideways as intended.
- **Size** S. **Confidence** high.

### VC11 · inconsistency · A checkbox column makes Table rows 5 px taller
- **What / where.** `selection`: rows **44** (header 43.5) vs **39** in every other md tile. The checkbox's label is a
  24-tall target (`label.area-checkbox` 14 × 24) inside the cell's 9/9 padding. Header text "Name" sits 12.5 from the
  row top, body text 10.5.
- **Rule.** A control inside a row keeps the row's height: its target grows by an absolutely placed hit area, not by
  layout (the same rule as Nav and Tree rows).
- **Visible change.** Selectable tables keep the 39 rhythm; header and body text on one baseline offset.
- **Size** S. **Confidence** high.

### VC12 · refinement / opportunity · Table header and alignment with text outside
- **What / where.** Header cells 13/20/**400** muted on a filled band ok(0.982) / dark ok(0.200), 38.5 tall; body
  13/**20** (not the 18 line everything else uses), rows 39. References: the measured shadcn table header 14/20 **500**,
  row 40; Notion's table header 14/16.8 400 muted, rows 37, **no frame, no fill** (`ref-live-products.md:89, 157`).
  Area's first cell text sits 15 from the frame (14 pad + 1 border); every Table tile is framed, so table text never
  lines up with a heading or paragraph above it. Numeric columns are right-aligned with a 14 end pad matching the 14
  start pad: good.
- **Rule / proposal.** (a) Header label weight 500 muted (a label that heads a column is a heading; T3 already notes
  three heading treatments). (b) A `frame="none"` (flush) layout: no wrapper, first and last cell padding 0, so the
  first column's text aligns with the page column, as in document products. (c) Body line 18 at md so a table's rows
  share the list rhythm (row 38 → still on the 2-px ladder).
- **Size** S (a, c), M (b). **Confidence** medium (design calls, measured references).

### VC13 · opportunity · Page header and Section heading don't separate (confirms T16)
- **What / where.** Section heading 16/22/500; Page header sm **16/22/500** (identical), md **18/24/500**, lg
  **20/28/500**; descriptions 13 muted (page header) vs 12 (lede). The jump from a section to a page title is 2 px
  at the default. In the picture (`T-page-header-light-0.png`) "Title" at md barely outranks the Secondary/Action buttons
  beside it. Reference: page title 24/32 600, −0.6 tracking (`ref-live-products.md:94`).
- **Rule.** Merge the other worktree's `--area-weight-heading` 600 and `title-xl` (T16); Page header md = 24/32 at 600
  (lg 32/40), Section heading stays 16/500, so page > section > card title is 24 / 16 / 13.
- **Visible change.** Every page title clearly heads its page.
- **Size** M (cross-worktree). **Confidence** high on the census.

### VC14 · inconsistency · Four title + description pairs (confirms T2)
- **What / where.** Card 13/500 + 13 muted (4 apart); Section heading / Surface 16/500 + **12** muted (title box
  bottom 78 → lede top 87.4, trimmed); Page header 18/500 + 13 muted (5); Description list summary 13/500 + 13 muted.
  The 12 lede under a 16 title is the one that looks underweight (Surface default, `T-surface-light-0.png`).
- **Rule.** A description under a title is 13 (text-sm 12 is for meta, not for a lede); its gap is the pair gap 4.
- **Size** S. **Confidence** medium-high.

### VC15 · inconsistency · Accordion: no title hierarchy in the plain variant; chevrons mean two things
- **What / where.** Plain md (the default): trigger and body both **15/22/400**, default ink; item pitch 24 (2 apart),
  so "Item one / Body text / Item two" (`multiple`) reads as one undifferentiated list. Divided defaults to **sm**
  (13/18, title **500**) while plain defaults to md (15/22) (also T15: reading size in an operated part). Chevrons:
  plain shows down = open / right = closed; divided shows **up** = open / **down** = closed.
- **Rule.** One accordion title style (500, default ink) and body (400; muted or default) in every variant; one default
  size; one chevron convention (down = open, rotating from right or from down, not both).
- **Visible change.** Plain titles bold; divided chevrons match plain's.
- **Size** S. **Confidence** high.

### VC16 · refinement · Chart text: mono ticks and a mono donut centre (confirms T18)
- **What / where.** Ticks and legend use the "data label style (text-xs, mono)" (`chart.css:11, 52-53`); "Nov 1" in
  Geist Mono reads as code next to sans legends (legend is sans 11). Donut centre "100" mono 500. The Number figure is
  26/400 sans. Professional dashboards measured in the reference set use the UI sans with tabular figures for ticks.
- **Rule.** One figure role (T18): sans, tabular, muted for ticks; mono only where characters must align by column
  (code, hashes).
- **Size** S. **Confidence** medium (deliberate choice in the spec; I argue it reads less product-like).

### VC17 · refinement · Series colours under 3:1 on white; the third series is weakest
- **What / where.** Series keys (measured): blue rgb(44,157,255) **2.85:1** on white, pink rgb(255,102,164) **2.73:1**,
  yellow rgb(208,195,2) **1.83:1**, indigo rgb(100,108,255) 4.09:1; the same values in dark (6.9, 7.2, 10.8, 4.8:1 on
  #0b0b0b). As 1.5 px lines (`chart.css:77`) the yellow and the pink read faint in light; donut neighbours blue and
  indigo are close in hue. Owner wants luminous colours (memory: colour study), so this is about the light-theme step,
  not the hue family.
- **Rule.** Series are solved per theme for ≥ 3:1 against the chart ground as lines (bars can stay lighter with a
  1px darker edge), as the other worktree already did for pink and purple on the sidebar ground (recreations README
  line 163).
- **Size** S–M. **Confidence** medium-high (ratios computed; the target step is a call).

### VC18 · refinement · Card's text-only bottom is 4–5 px heavier than its top
- **What / where.** Title trimmed to its cap: cap 18 from the top. Last line trimmed to its **descent**
  (`card.md:98`): descent 18 from the bottom, so the baseline sits ≈ 22.6 from the bottom (Geist 13/18: descent ≈ 4.6
  below baseline). In text-only cards (header-action, state-selected, stat) the space under "Description" visibly
  exceeds the space over "Title".
- **Proposal.** Trim the last line to the baseline plus a fixed descender allowance equal to the cap's optical
  overshoot (≈ 18 baseline-to-edge minus 2), or keep the rule and state it as intended. Recorded decision; flagged for
  the owner's eye only.
- **Size** S. **Confidence** medium.

### VC19 · inconsistency · Concentric floor makes nested frames squarer than their peers
- **What / where.** Card well: well corner 11, pad 11 → nested Card corner **4** (`content-well`, `template-feature`);
  Surface in Panel: corner **4** (`in-panel`). Every other nested part in the group is ≥ 8 (Board card 8 in a 16
  column at pad 8). The 4-corner rows read as rectangles inside round wells.
- **Rule.** When concentric math hits the floor, reduce the wrapper's pad to keep the child at `radius-row` (8), as
  Board does, or use the child's own size corner and accept non-concentric. Don't land at 4.
- **Size** S. **Confidence** high.

### VC20 · refinement · Stat, weather and prompt templates are mostly empty
- **What / where.** 180 × 180 fixed cards: header cap at 130, value at 223: **79 px** of nothing (`template-stat`,
  `template-weather`); prompt card: title and label 132 apart. Reads unfinished next to Music or Plan.
- **Proposal.** Let the square hold a sparkline (Chart sm) or icon, or hug content with the value directly under the
  header (14 gap). Templates are demos; size S. **Confidence** medium.

### VC21 · refinement · Demo realism: two pictures and wireframe plates
- **What / where.** Across Figure, Asset card, Video player, File image, File tile, Card avatars and Description list
  avatars the only pictures are a child's crayon drawing and one photo of mugs. Card's 26 tiles show grey plates where
  media would be (VC7). Design card `layout-screen` shows a 1920 × 1080 frame scaled to a blank rectangle with a 6 px
  button. Placeholder words follow the house vocabulary by rule; what gives the demos away is the media.
- **Proposal.** A small shared demo media set (6–8 neutral photos of different aspect ratios, 3 product screenshots made
  from Area itself, one illustrated portrait for David Tee) used by every picture slot; plates only in loading states.
- **Size** M. **Confidence** medium-high.

### VC22 · refinement · Folder, File page and File image glyphs are faint, and fainter in dark (confirms T22)
- **What / where.** Body `bg-component` (light 0.976, dark 0.200) with a `--area-border` edge (`folder.css:32, 82-88`);
  File image ring oklab 0.811 inset. In light the glyphs read washed out beside the crisp Card frames; in dark the
  folders in a File tile grid are near-black shapes with a hairline (`review-VC/dark-combo.png`, rows 4–5). The count
  "5" and badge text are below the 10 px floor (T22: 8 px at md).
- **Rule.** Artwork edges at least `edge-control` contrast in both themes; label text at `max(text-xs, …)` or marked
  `aria-hidden` artwork.
- **Size** S. **Confidence** medium (owner chose the quiet folder; the dark result is the concern).

### VC23 · refinement · File tile selection plate is a 2.7% step
- **What / where.** `layout-grid`, `behavior-multiple`: selected item plate ok(0.973) on the ~0.985 stage (light), ok(0.240)
  on 0.085 (dark). In light, which tiles are selected is hard to see without the ring Asset card uses
  (`stroke-selected`).
- **Rule.** Selected tiles in a grid use the selection paint shared with Asset card / Design card (S9 "selected drawn
  three ways").
- **Size** S. **Confidence** medium.

### VC24 · refinement · Mention chips are taller than the line they sit in
- **What / where.** Chip 21 tall (pad 2 + 17) in an 18 line (`default`: chip y 90–111, line 92–110). In `content-wrap`
  the chip's slices on consecutive lines are 18 apart, so their 21-tall plates overlap by 3 px and touch the text of
  the lines above and below.
- **Rule.** An inline chip's block padding is ≤ (line − text)/2, so it never exceeds its line (pad 0.5 → 18), or the
  paragraph opens its leading where chips can wrap.
- **Size** S. **Confidence** high on the measure.

### VC25 · inconsistency · Text lists use seven pitches
- **What / where.** Table 3c: 18, 22, 24, 26, 31, 38, 42. Some are structural (Timeline markers, framed rows, TOC as
  Nav), but three plain text lists disagree with no stated reason: Reference list 18 (gap 0), Link groups 22 (gap 4),
  Description list 26 (gap 8); Accordion's plain items 2 apart.
- **Rule.** Two text-list rhythms: a text list (link list, references, footnotes) at line + 4; a key-value list at line
  + 8. Rows that are controls use the row ladder. Accordion items take the key-value rhythm between items.
- **Visible change.** References 18 → 22 pitch; accordion items gain 6.
- **Size** S. **Confidence** medium-high.

### VC26 · inconsistency · Description list has two label styles (confirms T24)
- **What / where.** default / rich / show-more / in-panel / summary labels 13/400 muted; framed and justified labels
  13/**500** default ink (`T-description-list-light-0.png`).
- **Rule.** Layout moves the label, not its role: muted 400 everywhere.
- **Size** S. **Confidence** high.

### VC27 · refinement · Table of contents text on fractional pixels (confirms G4)
- **What / where.** Nav rows 30 at a 1 gap; text at y 131.6, 162.6, … (row top 125 + 3.25 pad + trim). At 1× the words
  land between pixels.
- **Rule.** G4's whole-pixel rounding for cap-centred insets.
- **Size** S. **Confidence** medium (subpixel; visible at 1× only).

### VC28 · observation · Reference list "Highlighted" shows nothing at rest
- **What / where.** `state-highlighted` renders identically to the default list (no paint on any row in measure or
  picture). Presumably the highlight follows a footnote jump (`:target`) and fades. A state tile that looks like the
  default teaches nothing.
- **Proposal.** The demo forces the highlighted row (as hover/focus tiles force their state).
- **Size** S. **Confidence** medium (behaviour not verified).

## 5. Cross-family inconsistencies (summary)

1. Container corner: 14 / 16 / 18 / 20 / 21 / 24 for card-like frames (VC3).
2. Item name: above / below inside / below outside, 400 / 500, indent 0 / 4 / 13.4 / 18 (VC4).
3. Card vs Surface: inset 18 vs 14, gap 14 vs 10, title 13 vs 16, description 13 vs 12 (VC5, VC14).
4. Wells: Card's well paints at Layers 0, Surface soft doesn't but still pads (VC6).
5. Concentric floor 4 in Card well and Surface-in-Panel vs Board's 8 (VC19).
6. Placeholder steps: 2% in light, 19% in dark (VC7).
7. Label beside value: muted 400 (Description list, Table header) vs 500 default (DL framed / justified) (VC26, VC12).
8. Text-list pitches 18 / 22 / 26 (VC25).
9. Gallery demos: wrap tiles that don't wrap; demos wider than their stage (VC8, VC9).

## 6. Wave-1 findings checked against the render

| Finding | Render |
|---|---|
| T2 (12 vs 13 explanatory line) | Confirmed: Section heading / Surface lede 12, Card and Page header descriptions 13 (VC14). |
| T15 (reading size in operated parts) | Confirmed: Accordion md trigger 15/22 (VC15). |
| T16 (headings top out at 20/500) | Confirmed: Page header lg 20/28/500; sm = Section heading (VC13). |
| T18 (figures: sans 26 vs mono donut) | Confirmed in pixels (VC16). |
| T22 (sub-floor folder/file text) | Confirmed: Folder count, File page label visibly tiny (VC22). |
| T24 (justified DL term 500) | Confirmed, and framed too (VC26). |
| S15 (Table 14 vs DL 16; Card media 11) | Confirmed: Table wrapper 14, DL framed 16, Card media 11 (VC3). |
| S9 (selected drawn three ways) | Confirmed for File tile vs Asset / Design card (VC23). |
| G4 (fractional cap-centred insets) | Confirmed on TOC rows (VC27). |
| geometry 2c (Card 14·18·22, Surface 14) | Confirmed: Card md 18, Surface md 14 (VC5). |
| T9 (tabular numbers) | Table numeric cells: not re-measurable here (feature not in the measure); right alignment confirmed. |

## 7. Five best-looking families (do not disturb)

1. **Board** — column 16, pad 8, card 8: the only fully concentric nesting in the group; column title at 18 lines up
   with the card icon column (42); ten tones calm in light and dark; header count, actions and "Add new" on one rhythm.
2. **Timeline** — one 22 marker column, 12 to content, 16 between items, muted meta and a right-aligned 12/18 time;
   reads like a shipped activity log in both themes.
3. **Card** — after the 2026-10-30 rebuild, one 18 inset on every side, 14 block gap, 4 pair gap, cap-trimmed titles
   and concentric media (18 − 7 = 11) on all 26 tiles; header actions centred on the title's cap.
4. **Table** — framed, header band, right-aligned numerics with matching 14 end pad, groups with counts and totals,
   sort arrow, skeleton loading and a sensible empty row; real data-product structure.
5. **Link groups / Table of contents** — clean three-level type hierarchy (16 → 13/500 → 13 muted) and Nav-row TOC with
   a clear current bar.

## 8. Five weakest and what would fix each

1. **Design card** — fit the design on both axes (VC1); give screen designs real content (VC21); corner 24 → the
   container corner (VC3); name 500 (VC4).
2. **Chart** — anchor end ticks (VC2), stage inside the tile (VC8), sans tabular ticks (VC16), series ≥ 3:1 in light
   (VC17).
3. **Surface** — share Card's inset, gap and title pair (VC5); soft surface either paints or stops padding (VC6); no 4
   corners in panels (VC19).
4. **Accordion** — one title style (500) and one default size; one chevron convention; items 8 apart (VC15, VC25).
5. **Folder / File page / File image** — edges and labels legible in both themes (VC22), selection paint in File tile
   (VC23).

## 9. Counts

28 findings: defect 6 (VC1, VC2, VC6, VC8, VC9, VC10), inconsistency 10 (VC3, VC4, VC5, VC7, VC11, VC14, VC15,
VC19, VC25, VC26), refinement 10 (VC12 (also an opportunity: flush table), VC16, VC17, VC18, VC20, VC21, VC22, VC23,
VC24, VC27), opportunity 1 (VC13), observation 1 (VC28).

Crops and helpers: `/private/tmp/claude-501/-Users-ethanwong-Desktop-area--claude-worktrees-design-system-audit-6f0eac/76af9d58-c4d9-4456-ae0b-81f2ada27495/scratchpad/rendered/review-VC/`.
