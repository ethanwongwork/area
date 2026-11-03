# Data views: tables and chart modules (2026-11-01)

The owner asked (2026-11-01): "i want to explore aligning the table component and creating/design simple modular
templates for data visualization. look into cursor, githubs, usage metrics dashboards. i like simple shapes, lighter
colors, consistent and detailed data and labels. look into interactive and visually appealing data visualization modules
from other products. maybe notion has some interesting components." Ten reference images came with it (Cursor's usage
page, a segmented letter strip, a contrast explorer, a Notion-style database with changes, a sports dashboard, a
probability matrix, a heat-tinted quarterly table, a colour study, expressive rounded bars, a correlation triangle).

Exploration only: nothing in the packages or the app changed. The review page is `review.html` (published as an artifact;
picks in its `verdicts` collection).

## Files

| File | What |
|---|---|
| `review.html` | The review page: ten live modules, the aligned Table, the look choices, the intake plan, evidence |
| `github-primer.md` | GitHub and Primer, every value pinned (primer/react `6826a6a0`, primer/primitives `ec3eee6a`, primer/design `87f799f2`, live github.com assets fetched 2026-11-01) |
| `products.md` | Notion (chart settings read through the Notion connector, read-only), Tremor `ca4d588f`, shadcn `c0d63c33`, Linear, Vercel Geist, Stripe Apps, Observable Plot, pinned |

## Cursor (read from the installed app, Cursor 3.x, `/Applications/Cursor.app/Contents/Resources/app/out/`)

The usage page (cursor.com/dashboard) needs a sign-in, so it is unmeasured; the owner's screenshot gives its structure
only. Cursor's chat renders charts itself (a bundled xychart renderer); its values, from
`vs/workbench/workbench.desktop.main.js` (constants `G3`, `iM`, `_Te`, functions `iau`, `Slv`) and
`workbench.desktop.main.css` (`.composer-visualization-chart-tooltip*`):

| Slot | Value |
|---|---|
| Bars | fill `color-mix(bg 75%, series 25%)`, 1.5 stroke in the series colour, corner 8 (`barRadius`), rounded at the data end |
| Lines | 2.5 (`lineWidth`), round caps and joins; a 5 wide shadow line at 12% opacity, 2 lower |
| Dots | r 5 (`dotRadius`), 2 ring in the ground colour |
| Grid | a lattice of r 1.5 dots about every 20, fill `--_inner-stroke` (12% ink) at 0.65 opacity |
| Labels | axis labels 14/400 at 40% ink; axis titles 15/500 at 60%; title 18/600; legend 14/400 with a 14 square (corner 3) or a 14 line key, 6 to the text |
| Hover value | a 32 tall pill, corner 8, 14 across, 15/500, ink ground with page-coloured text, a 6 pointer |
| Tooltip (chat) | 12/22, padding 8 12, corner 12, 1px edge at 12% ink, shadow `0 1px 2px -1px rgb(0 0 0 / 8%)`; context at 48% ink, labels 74%, values 500 tabular, 16 between label and value |
| Series colours | slot 0 is the accent (default `#3b82f6`); the rest step from it: alternate lighter and darker (lightness 25–78), hue −8 / +12 per pair, chroma held at 55–85 |

## What the references agree on

| Choice | Evidence | Area today |
|---|---|---|
| Lines 2px, no dots until hover, a crosshair tooltip | Tremor, shadcn, GitHub, Stripe (Cursor 2.5) | The analytics example's hand-drawn chart (2, a dashed prior line) |
| Grid: horizontal only, no y-axis line, one baseline | Tremor solid gray-200; shadcn border 50%; GitHub dashed muted; Cursor dotted | — |
| Labels 11–12 muted, tabular | Tremor 12 gray-500, GitHub 12 muted, Plot 10 | Area's 11/14 role |
| Light fills | Cursor 25% + edge; Primer emphasis / muted pairs; Tremor shade-200 bar list; area washes 25–30% → 0 | Meter's segments are solid |
| KPI = label, value, change, sparkline | Tremor, Stripe, shadcn, Linear, Notion's number chart | Card + CardValue + Badge (analytics example) |
| Ranked bar list, light bar behind the name | Tremor 32 rows, Vercel's panels, Notion horizontal bar | — |
| Part-to-whole in one bar, 2 gaps | Tremor CategoryBar, Stripe meter | Meter `segments` (in review) |
| A table under or beside the chart, totals row | Linear, Notion calculations, Vercel subtotal, GitHub "View as table" | Table has no footer style |
| Calendar heatmap, Less → More | GitHub (10 / 3 / corner 2) | — |
| Heights by size | GitHub 128 / 256 / 320 / 432; Stripe 180 / 320; Notion four sizes | — |

## Colour

Area already has a validated categorical order: Meter's segments (`meter.css`, blue 500, orange 500, teal 500, yellow 450,
pink 300, green 600, purple 550, red 450; dark steps beside them), checked with the dataviz validator. The review page
uses it unchanged. A heat or calendar ramp is one hue (the accent) mixed into the frame's ground at 8–100%, so it follows
the accent and both themes. Status colours stay reserved for status (the tracker), with a label in the legend and tooltip.

## Proposal (intake ladder)

| Piece | Rung | What |
|---|---|---|
| Series colours | Setting (foundation) | Promote Meter's eight to shared roles (`--area-series-1…8`) and add an accent ramp for heat; Meter, Chart and table dots share one order |
| Chart | New family | `kind` line, area, bar; `orientation`; `stacked`; `size` sm = sparkline. Parts: axis labels, grid, legend (click hides a series), crosshair tooltip on Tooltip. Uses: Cursor, Notion, GitHub |
| Heatmap | New family | `layout` calendar or matrix, numbers in cells, a scale legend |
| Table | Values and slots | `TableCell` heat and bar options beside `numeric` / `fit`; a `tfoot` summary style; header icons as a slot; header ground as the open question |
| Stat tile, bar list, category bar | Compositions | Card + CardValue + Badge + sm Chart; flush Table with bar cells; Meter segments |
| Tracker, ring, annotated strip | Later | One sighting each |

## Open (owner)

On the review page: marks (soft, tint, solid), grid (hairline, dashed, dotted, none), bar ends (square, 4, round), the
Table's header and summary row, the cell kinds, a verdict per module, and what to build first.

## Round 2 (owner feedback, 2026-11-01)

"i dont like the thick, dark, strokes, prefer flat shapes. the type sued to label data doesnt seem consistent. are the gaps
consistent? the heat matrix is nice, i like that style, the text inside the colored boxes can also be tinted the color too.
look at the inspiration more. also should the table just have a colored fill for the top header and the rest of the table
rows be white? is there a stroke around the whole container?"

- **Flat.** Round 1's default (Cursor's 25% tint with a 1.5 outline) is gone; every mark is a flat tint: Pastel 32%, Tint
  56% or Solid, over the frame. Stacked areas separate by a 2 line in the frame colour, never an outline.
- **Tinted text.** Text inside a coloured shape (heat cells, pills, a bar's value, the bar list's names) takes the hue's
  deep tint: `color-mix(hue 52%, black)` in light, `color-mix(hue 34%, white)` in dark. Heat ramps stop at 60% so that one
  rule always reads (the contrast explorer reference).
- **Type was not consistent.** Round 1 drew data at 11, 11 medium, 12 (legends, deltas, tooltip), 13, 20 and 28. Now four
  roles: figure 28/34 500, row 13/20, label 11/14 400 muted, value 11/14 500 (ink or tint); the tooltip takes Area's
  Tooltip line, 13/18.
- **Gaps were not consistent.** Marks were 2 apart, 3 in the calendar and about 4 between columns; labels sat 6 or 8 from
  their marks. Now: 2 between marks, 6 from a label or key to its mark, 12 between blocks and frames, 16 frame inset and
  between legend items.
- **Table frame.** In the app a feed table is the tile fill inside the cards' 1px edge (`FEED_TABLE`, Stroke 2), header a
  step darker. The page offers White: header band on the tile fill, white rows, 1px edge at the divider tint. The edge
  stays: white rows on a white page have no boundary without it. Charts' frames follow the same choice so the family stays one.

## Round 3: one system (owner, 2026-11-01)

"i want the overall visual style to be simplified, made more consistent with the way data is visualized and represented,
align the layouts, and be overall more technical and information forward. leverage simple colors, shapes, typography,
etc study these examples and come up with a cohesive system thats modular, visually appealing, technical, and
aligned/organized. start with standardizing the type styles and rythm". Eleven references: Ecosistema del Diseño
Español (ruled report pages, flat blue / yellow bars, value columns), an illustration survey spread (monospace, "label →
value", hatched marks), Infos & Service (a ruled schedule table), the A24 "Tax Season" spreadsheet cover, the Munich 1972
schedules (colour columns, dated rows, pictogram grid), pastel pie spreads with huge figures, a pixel grid on a lettered
spreadsheet, a treemap of rounded tiles, pastel cards with same-hue deep ink and dot-matrix charts, Morphocode's panel
(mono figures, waffle with dot leaders, rows with a bar under each).

What they share: ruled cells organise the page; one small size for nearly everything and one large figure; numbers set
as type (mono, end-aligned, leaders); flat shapes in one hue per chart, grey for the rest; the grid itself visible.

The system (review page sections 1–2):

| Style | Font | Size / line (type 13) | Weight | Use |
|---|---|---|---|---|
| Figure | numbers font | 30/38 (title-lg) | 500 | the module's one headline number |
| Total | numbers font | 19/26 (title-sm) | 500 | second-rank figures, a ring's centre |
| Title | Geist | 13/18 | 500 | a module's name, in its header strip |
| Text | Geist | 13/18 | 400 | names in rows, legends as rows, table words |
| Number | numbers font | 13/18 | 400, tabular | every value; end-aligned |
| Label | Geist Mono | 11/14 | 400, muted | axis ticks, column headers, units, dates, meta, notes |
| Mark value | Geist Mono | 11/14 | 500, deep tint | a number on or inside a mark |

Numbers font: Geist Mono (recommended) or Geist tabular, the owner's pick. Every size is on Area's ramp; nothing new.
Rhythm: spacing 2 (marks) · 4 (label to mark) · 8 (key to name) · 16 (inset, blocks, legend items) · 32 (boards).
Rows 24 (lists, legends) · 32 (ranked lists, strips) · 40 (tables, module header). Plots 32 · 128 · 192.
Anatomy: header strip 40 (title · mono meta) / body 16 in / footer strip 32 (legend, notes), strips ruled.
Layout: Sheet (one ruled frame, modules share 1px rules, corner 16) or Cards (16 apart). Table: header band 32 in
Label, rows 40, Number cells, totals strip 32. New module: dot grid (1 dot = 1%).

Open on the page: numbers (mono, sans), layout (sheet, cards), labels (sentence, caps), what to build first.

## Round 4: real components, one pass (owner, 2026-11-01)

"remove the colored text if its not being used consistently. the hourly tracker seems too small and gaps between columns
too big. can you make everything responsive to different sizes, also do a pass on strokes, weight, color, gaps between
shapes, and also make sure real componenets from area re used where possible. the colors used can be a bit more saturated
and vibrant overall."

- **Real components.** The page links Area's compiled CSS (`npm run build -w @area/styles` → `packages/styles/dist/area.css`,
  published beside the page, not committed) at the app's `data-area-type="13"` and `data-area-density="32"`. Markup for
  Segmented, Button, Badge, ToggleGroup, Radio, Input, SectionHeading, Table, Meter and the icons was rendered from
  `@area/react` / `@area/icons` with react-dom/server. The chart tooltip is `.area-tooltip`. "Spend by kind" is Meter.
- **Coloured text removed** where it was inconsistent (bar-list names, peak values, the busiest column, heat numbers): ink,
  or white inside a fill of 60% or more. Only Area's Badge carries colour in its label (status, change).
- **Colour.** Marks take Meter's series colours at full strength (were 32%); heat ramps run 10–100% of the accent.
- **Strokes.** Every rule 1px: `border-divider` for the board, strips and baselines; `border-decorative` for gridlines and
  inner rows. Lines 1.5. Guides 1 dashed 2 2. Every mark corner 2; every gap between marks 2 (columns were up to 8 apart).
- **Weekly strip** (was the hourly strip): bars 2 apart on the 192 plot with a y axis and day rules; hours bin into 2 or 4
  when a bar would fall under 3 wide.
- **Responsive.** Boards use container queries (quarters → halves → full; thirds and halves → full). Each plot redraws on
  its own ResizeObserver: ticks about one per 96, the calendar fills its width (8–53 weeks), the tracker shows as many days
  as fit at 6 wide (14–90), the heat matrix bins to 4 hours under 560 and drops numbers in cells under 32. Checked at 1280
  and 560, light and dark: no sideways scroll.

## Round 5: cards and the slider's language (owner, 2026-11-01)

"i dont like the dividers across the full width of the cards. remove dividers. also can you please make the table header
a different color than the cells? is that not built into the component? maybe lighter pastel colors again. also thinner
strokes? look at the thick slider coompoenent as a reference too." References: a green bar chart (solid bar, hatched
projection with a thin edge, pale capsule tracks, dashed +$5K / +$10K guides with labels on top), Goal Progress cards
(dark fill, hatched stretch, pale rest, a knob; a sentence under it), an NHL bracket (pastel flows, saturated blocks,
percentages inside), an Intensity popover (gradient fill in a grey trough, a dark grip line, a tick ruler "Low … High"),
a workflow canvas (thin-edged cards, a pill label on a connector, a "Global" group header), Brightness / Timer sliders
(thick rounded bars, label inside left, value inside right, a thin vertical grip).

- **Table header.** Built in: `.area-table th { background-color: var(--area-bg-subtle) }` (navigation.css). At the
  default Layers setting (0) `bg-subtle` resolves to the page (oklch 1 = #ffffff in light; 0.0847 in dark), so the header
  is the rows' colour. Proposed: `bg-component` (#f9f9f9 light, oklch 0.2 dark), the trough of Slider's bar and
  Segmented, for the header and the totals row. Live on the page ("Table header": Trough / Subtle).
- **No dividers.** Modules are Area Cards (`area-card--vertical --md`: header with title, description and action; body);
  the ruled sheet and the header / footer strips are gone.
- **The bar language** (from Slider's `bar` + `labelPosition="inside"`, slider.css): trough `bg-component`, the fill a
  pastel tint (`--mk` 30% light, 42% dark) of the series colour, rounded at its end with Slider's white grip, label
  inside at the start and the value inside at the end. Data bars render Slider's own markup read-only; the spend limit
  is a live Slider. Thin marks (columns, peaks) end in a 2px edge of the full colour instead of a grip.
- **Hatch** (Goal Progress, green bars): projected / still-counting parts are 1px 45° lines at 60% over a 12% tint,
  5 apart: the projection to Nov 7 in Daily usage and Top models, today's column, the pace bar.
- **Guides**: 1px dashed, label in a trough pill on the line (the workflow's edge label): Today, avg, Limit, the peaks.
- **Ruler** (Intensity): a gradient in a trough, 1px ticks under it, ends named: heat matrix and calendar scales.
- **Thinner**: lines 1px (were 1.5), guides 1px dashed 2 3, the ring 10 (was 12).
- **New module**: Spend pace (Goal Progress): spent, projected, an on-pace-today mark, the limit, and a sentence with the
  figures in weight 500 (no coloured text).

## Round 6 (owner, 2026-11-01)

"dont add the pill tab if the graph isnt interactive. does the slashed lines fill work as part of the design language? or
would a lighter solid fill just be better. maybe align all the strokes/dashed line thickness, color, styles, etc so
theyere consistent."

- **Grip only when draggable.** Read-only data bars drop Slider's white grip; their fill ends square-ish (corner 2) in a
  1px edge of the full colour, as columns and an area's top do. Fill length is now exactly the value's share of the bar
  (Slider's fill adds a thumb's width; the data bar does not). The spend limit, a live Slider, keeps its grip.
- **Guide labels** are plain Label text with a halo, never a pill.
- **Projected: lighter, not hatched (recommended).** The hatch added a texture and a second line weight to a flat system
  and turned to noise on 20px columns and 8px keys. Projected = the same colour at 45% of the fill's strength
  (`--pj: calc(var(--mk) * 0.45)`: 13.5% light, 19% dark). Hatch stays as a switch on the page.
- **One stroke spec, all 1px:** rule (`border-divider`), grid (`border-decorative`), guide (one `--guide` grey = muted at
  45% over the surface, dashed 2 2: average, today, limit, peaks, scale marks, leaders, ruler ticks), line and edge
  (series colour). Before: guides dashed 2 3 at 60%, leaders dotted in the divider, ticks solid divider, the limit solid
  ink, column caps 2.
- **Cards:** unit in every header's action corner (count, USD, %, days), period in the description, equal heights in a
  row; the tracker's badge moved into its description.

## Round 7 (owner, 2026-11-01)

"i dont like the dark stroke at the end of the fills. the spend share can use the darker colors to match the guide? also
can you make the designs and compositions actually fill out the space and layout of the cards better? the circle and
square shape of the dot block just fill the space awkwardly. can you look into and research github and other more
technical coding products/sites to see what other types of data visualizations and ways to show data in ui there are"

- **No edges** at the end of any fill (bars, columns, peaks, the area's top). Stacked shapes are parted by a 1.5 gap in
  the card's colour. Strokes left: rule, grid, guide (all 1px) and sparklines.
- **A key matches its mark.** Parts of a whole (ring, dots, language bar, diffstat) use full series colours, like their
  keys; measures (bars, columns, areas, heat) use the pastel tint, and so do their keys.
- **Filling the card:** the calendar stretches to the card (52 weeks, cells ~18); the ring sits beside its legend
  (c6, ring 160); the dots are a 20 × 5 block, 2 apart, as wide as the card allows (dots up to 24); bar scales leave the
  value its room.
- **Developer-tool modules** (research: `technical-patterns.md`, 20 patterns with pinned sources from Grafana, PostHog,
  Sentry, Chrome DevTools, Lighthouse, Codecov, GitHub, Statuspage): language bar (GitHub: 8 tall, 2 gaps), diffstat
  (5 squares, 8 × 8), CI run waterfall (Sentry / Actions), latency histogram with p50 / p95 / p99 guides, funnel (data
  bars, step conversion), punch card (GitHub's former weekday × hour; removed c. 2017), retention cohorts (PostHog;
  the unfinished week in the lighter tint, no number), lifecycle above and below zero (PostHog negates dormant), service
  status history with an uptime column and "N days ago · Today" ends (Statuspage: 90 / 60 / 30 days by width).
- Not built yet from the shortlist: Grafana's LED bar gauge, DevTools-style phase bars, Sentry's mini bars in table
  rows, a flame strip, usage meter rows with a reset line.

## Round 8 (owner, 2026-11-01)

"can you do a shape audit for all the graphs, bars, and make sure theyre consistent. also use consistent colors across
everything. just use vibrant colors but make them lighter more bright and colorful if possible"

- **Shape audit** (table on the page, section 1): ten kinds of mark had six heights, five corners and three gaps. Now:
  row marks (data bars, cells, timeline bars, the tracker) 24 tall; strips and keys 8; corner 4 (2 on an 8 mark, never
  past half a side); every gap 2; bars round only at the value end (stacked lifecycle segments square where they meet);
  calendar cells square from the card's width; circles only for counts of units or sizes by area; the ring's ends square.
  Data bars set Slider's `--_height: 24px` and `--_bar-radius: 4px`; the live limit Slider keeps Area's control size.
- **One bright palette, both themes:** blue 300 #5598ff, orange 300 #fe9c51, teal 400 #00dcc7, yellow 300 #fec131,
  pink 300 #ff66a4, green 400 #02de68, purple 300 #a781fe, red 300 #fe6272. Every mark and key uses it at full strength
  (the pastel / full split is gone); projected = the colour at 42%; status = the palette's green, yellow, red; heat ramps
  10–100% of the blue. Validator (dataviz): adjacent CVD worst ΔE 10.6, normal vision 23.6 in light and dark; on white
  all eight sit under 3:1 (relief: every chart keeps legend, values and tooltips); on #161616 all pass 3:1; lightness
  above the categorical band by request (lighter, brighter). Orange and yellow are close when both show without being
  neighbours (all-pairs ΔE 9.9), so they are not adjacent in the order.

## Round 9 (owner, 2026-11-01)

"maybe a bit too vibrant, can you just make the colors something consistent that fits in with area, and also is
accessible. the dark text on top of the dark shapes doesnt read well. overall there seems to be some spacing, density,
and overall alignment issues with everything. make sure the type styles are correct, and the overall rhythm and spacing
is correct. also use more basic colors like blue, purple, red, indigo, teal"

- **Colours:** blue (Area's accent) 500 #006df5, teal 550 #039486, purple 500 #8d4df3, red 500 #e80945, indigo 500
  #5c5dfe; dark 400 steps (#2a80ff, #00a797, #9b65ff, #fc3b5a, #6b77ff). dataviz validator: every check passes in both
  themes (≥ 3:1 on the card, adjacent CVD ΔE ≥ 19.1, normal ≥ 21.3). Four-kind series use blue, teal, purple, red
  (indigo beside purple read as one in the stacked area). Status returns to Area's success / caution / danger.
- **No text on solid fills:** data bars are name (120) · 8 strip · value (64) on a 28 row; heat ramps stop at 70% with
  ink numbers.
- **Measured** (census + card metrics in the page): Area Card md insets 18, head to body 14, body blocks 12; seven type
  styles, all Area roles; the card title is Area Card's 15/22 (the spec had said 13/18). One axis gutter (40), one
  name / value column pair (120 / 64, gap 12), list rows 28, row marks 24 + 2, plots 192. Cards in a row ended up to
  118 apart at the bottom; content now matches (≤ 24).

## Round 10 (owner, 2026-11-01)

"the colors are a bit too dark, can we update the color ramp and palette? to accomodate vibrant colors that arent
completely dark or washed out" (references: a riso-printed index card in cobalt, orange, pink, green, yellow, sky).

- **Series palette, the same in both themes:** each hue at the step of Area's ladder where chroma peaks before it
  darkens. blue 400 #2a80ff, orange 500 #ea7401, teal 500 #00a797, red 400 #fc3b5a, purple 400 #9b65ff, green 500
  #01aa4e, indigo 400 #6b77ff, pink 400 #f84294 (L 0.62–0.68, C 0.12–0.23). Contrast on white 3.00–3.73, on #161616
  3.9–6.0. Order chosen by running the dataviz validator over all 5,040 orders (blue fixed first): adjacent CVD ΔE ≥ 10.5,
  normal vision ≥ 26.7 in light and dark; the first four (the 4-series charts) all-pairs CVD 6.4, which the legends and
  2 gaps relieve.
- **Heat ramp from Area's blue ladder**, not a mix toward white (which greyed the middle): cells with numbers step
  50 · 100 · 150 · 200 · 250 · 300 in light (ink ≥ 5.1:1) and 950 · 900 · 850 · 800 · 700 · 600 in dark (light ink ≥ 6:1);
  the calendar (no text) steps 150 · 250 · 350 · 450 (dark 850 · 700 · 550 · 400). Rulers draw the same stops.
- Area's ladder itself (palette.json) is unchanged; these are its existing steps.

## Cursor's colours, and round 11 (owner, 2026-11-01)

Asked "what colors does cursor use, throughout. these softer colors?" Sampled from the owner's screenshot of
cursor.com/dashboard (approximate: compression, possible translucency): area bands #b2d4dc · #aec1d3 · #99adc6
(OKLCH L 0.85 / 0.80 / 0.74, C 0.03–0.04, h 214–254: one cyan-to-blue family), band lines #7e9cbe / #7390b5 (L ~0.66,
C ~0.06), gridlines #e1e0db, baseline #313132; warm paper surfaces #f7f7f4 / #f2f1ed / #eae9e6 (h ~95–106, C ~0.005);
"Today" tag #fff7a8. The desktop app's own colour vars point to the editor theme's `--vscode-charts-*`; its in-chat
charts derive every series from the accent.

Round 11: "make areas colors work like that, but dont change the background, keep the background white, not pastely".
Series (same both themes, literal OKLCH, Area has nothing this muted): slate #5e82b3 (0.60 0.085 256), mist #8cc1d1
(0.78 0.060 218), lavender #8d83b9 (0.64 0.080 292), sand #d7b986, rose #b6706e, sage #81ba9b, teal #4e9493, plum
#c393b7. Status = sage / sand / rose. Heat = slate mixed into the card 6–70% (ink ≥ 4.6:1); calendar 25–100%.
Backgrounds unchanged (Area white). Validator: chroma under its 0.1 floor by design; on white mist, sand, sage, plum
< 3:1; adjacent CVD ≥ 6.1, normal ≥ 12.7 (targets 8 / 15) — relief by legends, values and tooltips; dark all ≥ 3:1.

## Round 12 (owner, 2026-11-01)

"maybe too muted, bring back some pastel colors. i like openais colors here" (OpenAI / Codex / Polar Signals gradient
images). Sampled: sky #6bc4fc (L 0.79 C 0.12 h 238), #7bdbf4, lavender #9b8ffb (L 0.71 C 0.16), periwinkle #7a65fe,
pink #feb8c3, lilac #d3b5f3, orange #fa7f06, yellow-green #bdb900.

Series (literal OKLCH, same both themes): sky #55bcfa (0.76 0.13 238), coral #f47b74 (0.72 0.15 25), periwinkle
#6d8af3 (0.66 0.16 270), lime #bcd155 (0.82 0.15 118), aqua #59d4cd, peach #f7a062, lavender #998ef6, pink #f696b4.
Order searched over 5,040 with the validator: adjacent CVD ΔE ≥ 13.1, normal ≥ 15.8, chroma ≥ 0.1 in both themes; on
white seven < 3:1 (relief: legends, values, tooltips); on #161616 all ≥ 5.7:1. Status: aqua / peach / coral. Heat: sky
mixed into the card, then into periwinkle (q0–q5); calendar sky → periwinkle. Backgrounds unchanged.

A separate session ([color-system-study], branch `color-system-study`) is auditing Area's colour system and how its
colour is generated.

## Round 13 (2026-11-02): Area's series tokens

The colour study merged (PR #195): `--area-series-<n>` (mark), `-fill`, `-ink`, `-ramp-1…7`, Series lightness 66–80
(default 79), P3, gated by `packages/tokens/src/contrast/series.test.ts`. The page now carries no colours of its own:

- **Series**, in the tokens' order (sky, pink, yellow-green, lilac, peach orange, mint, periwinkle, peach). Light: bars,
  areas, keys and dots take `-fill` (OpenAI's luminous colour); sparklines take the mark (the hue at 3:1 on white).
  Dark: everything takes the mark, the luminous colour there. The dark `-fill` (a deep area, L ≤ 0.40, made to sit
  under a luminous line) read dull alone in the ring, dot grid and bars. **Open for the colour system:** should bars and
  parts of a whole on dark read the mark, as here, and should the tokens say so?
- **Heat** walks series 1's ramp. Cells with numbers use five steps. On light, ramp 1–5 carry Area's text at ≥ 5.67:1;
  ramp 6 and 7 fall to 4.48 and 3.50 against `fg-default` (and 3.29 / 4.21 against white), so they carry no numbers.
  On dark, ramp 1, 2 and 3 take light text, and ramp 5 and 7 take the page colour (≥ 5.71:1). Calendar (no numbers):
  ramp 2, 4, 6, 7. Measured on the page: 101 labelled cells, worst 5.67 light, 5.71 dark.
- **Status** takes Area's success, warning and danger solids, never a series.
- **Table header**: main's Table paints the header and stripes in `bg-well`, so the page's Trough / Subtle choice is gone.
- Spend pace drops its `$0` end label when the track is under 160 px (it ran into "Projected" at 390 wide).

## Round 14 (2026-11-02): status green, heat keys, measured pass

Owner: the green read too dark, "forest"; check every card's gaps, spacing and label placement; why does the 0–100%
scale end in the middle of the card?

- **Status colours for charts.** The green was `--area-success-solid` = green 600 `#00853c`, the darkest step, chosen
  for white button text. Charts now take their own set, placed with `color/place.ts` `colourAt` like the series:
  green h156 L0.77 `#5dce8e`, yellow h86 L0.87 `#ffcd53`, red `#ff4a4b` (hue 25 at the series mark's 3:1). Green and
  amber at the same L 0.79 failed deutan separation (ΔE 7.2), so yellow sits lighter than green. Validator, all pairs,
  light (#ffffff) and dark (#161616): CVD ΔE ≥ 8.8, normal ≥ 19.3. Area's success/warning/danger roles are unchanged.
  If adopted, this is a foundation question: a data-status trio beside the series tokens.
- **Heat keys.** The ruler was a gradient with width `min(clientWidth, 360)`, so it ended at 360 px whatever the card.
  Now: one block per heat step (the cells take five colours), spanning the plot's cell columns (x0 = where the cells
  start, to the plot's end), 2 apart, a tick in each gap and the step's lower edge under it, ends anchored to the
  outer edges; middle labels drop when a block is under 48 px.
- **Audit** (`audit.js` in this folder, run in the page at 1440 / 1100 / 820 / 390, reloading per width because a
  hidden pane pauses ResizeObserver): text overlaps, text past the card's inset or its plot, header → body gap, gaps
  between body blocks, left edges against the title, empty space above the bottom inset. Result: no overlaps or
  escapes (the Area Tables scroll inside their wrapper at narrow widths, as designed), header → body 14 everywhere,
  blocks 12 everywhere. Fixed:
  - `--s0` (Other, Dormant) was undefined and drew black: now a neutral, `--muted` 40% into the card;
  - rules between the diffstat's rows removed (no dividers inside cards);
  - retention: 12 column gap and 8 cell inset, as the matrix;
  - CI timeline labels every n minutes so labels stay ≥ 32 apart;
  - Every stroke rows `min-height` so wrapped text grows the row;
  - growable plots (`GROW`: area, columns, weekly strip, histogram, lifecycle, guides, the key card's cells) take
    the leftover height of a card shorter than its row (`fill()` after draw and on width change);
  - Table section: totals row on `--area-bg-well`, stale header-probe code removed.
- **Left open:** Languages ends 8 px short of Files changed at every width (a 20 px bar + gap against 28 px rows); the
  ring card ends 18–35 px short between 820 and 1100 (a 160 ring beside its list cannot grow without squeezing it).

## Round 15 (2026-11-02): brighter series with indigo; stat tiles

Owner: liked the round 14 status colours ("brighter and better"); blue, pink and purple too pastel; add indigo. Then:
the stat tiles don't look aligned with the other modules.

- **Series (page values, Area's tokens unchanged).** The pastel came from the series recipe's chroma cap 0.13 at L 0.79.
  Placed with `colourAt(h, L, 1, cap)` like the status set, each hue at its own L and cap: blue h248 L.70 cap .16
  `#3ba4fc`, pink h352 L.70 cap .18 `#ee67aa`, indigo h274 L.58 cap .20 `#5a68ee` (new; periwinkle dropped), purple
  h305 L.64 cap .20 `#a964eb`, orange h50 L.74 `#f98942`; yellow-green `#c8be52`, mint `#49d2ac`, peach `#fb8087`
  near the luminous level. Order searched (blue first, indigo and pink among slots 2–4): blue, pink, yellow-green,
  indigo, orange, mint, purple, peach — adjacent CVD ΔE ≥ 12.2, normal ≥ 23.4, white and #161616. Same values in both
  themes; lines take `#008ae4` (the blue at 3.65:1 on white). Heat still walks `--area-series-1-ramp-*` (hue 239).
  **If adopted in Area:** the series tokens would need per-series lightness and cap (today one Series lightness for all).
- **Stat tiles.** The sparkline was the page's only line + 10% wash, in the darker mark, and its last point (today,
  partial) dived. Now 30 daily columns in the Requests per day anatomy: series fill, 2 gap, value-end corner
  `corner(bw)`, today in the projected tint, tooltips per day. A share (Acceptance) stands each column in a trough to
  100%.
- **Other / Dormant key.** `--s0` mixed `var(--muted)` (Area's computed light-dark expression) inside `color-mix`; a
  browser that can't resolve that drew nothing. Now `light-dark(#c8c8c8, #5c5c5c)`.
- Audit (audit.js) at 1440 and 390: no overlaps, no escapes, header → body 14, blocks 12.

## Round 16–17 (2026-11-02): built, then series vs palette steps

- Built into tokens (see series-plan.md › Built). The page reads them; dark heat moved to ramp 1, 2, 4 / 6, 7 (blue's hue
  248 left ramp 5 under 4.5:1 with either ink).
- Owner: "what are these series? can they be folded into the regular color palette? why is the text getting
  cutoff/rounded off inside the cards?" Clipping: the plain tile's picture corner (canvas.css) clipped text set to the
  view's edge; `stage="flow"` tiles now have no picture corner. Folding: nearest palette steps blue-300 (ΔE 3.5),
  pink-300 (3.2), yellow-400 (6.7; no yellow-green family) or lime-250, indigo-450 (3.1), orange-350 (1.8), teal-400
  (3.9), purple-400 (3.9), red-250 (2.8); the snapped set passes the validator (CVD ≥ 13.2, normal ≥ 25.7). The page's
  Colours switch (Series / Palette, gold / Palette, lime) repaints every chart; palette heat = blue ladder (light 75,
  150, 200, 250, 300; dark 900, 800, 650 / 300, 200), every number ≥ 5.1:1. Pick saves as `verdicts/colours`.

## Round 18 (2026-11-02): one palette question, corners, Badge icons

Owner: add the series to the palette or as their own ramps beside it ("i like the hue of the series better but just
want a more cohesive overall palette. is there a reason why the current area palette cant match the series ramp and
only differ in hue?"); stat bars too round; delta arrows differ in colour from their words.

- Why they differ today: the palette's eleven families share one recipe (a lightness ladder by hue group, chroma at
  91–100% of sRGB's room; `generate.ts`). The series were placed differently: their own hues (blue 248 vs the palette's
  259, mint 171 vs teal 183, yellow-green 104 with no family), their own lightness, and a chroma cap under the edge.
- `generatedFamily(hue)` builds a palette-shaped family at any hue without touching palette.json. At the series hues the
  nearest rungs are blue r350 #28a1ff (ΔE 1.4), pink r300 #ff60b1 (3.3), yellow-green r400 #d2c302 (4.3), indigo r450
  #5f6dff (2.9), orange r350 #fe883c (0.9), mint r400 #01dcaf (3.0), purple r350 #b565ff (3.6), peach r250 #ff8c91
  (2.8); validator CVD ≥ 12.1, normal ≥ 24.7. Page: Colours › Recipe and a third row on the comparison card.
- Corners: `corner = min(4, w/4, h/4)` (was /2).
- Badge icons: soft/color/outline/plain/modern icons take `--_mark(-tint)` (3:1 bright step, owner's 2026-11-01 "All
  variants"); words take the text ink (4.5). Not changed: awaiting the owner's choice.

## Round 19 (2026-11-02): series on the palette; Badge icons

- Built (owner: "Yes, build them"): palette families chartreuse 105, mint 170, sky 250, violet 305 (`generate.ts`
  `DATA_HUES`, presets.ts `DATA_SCALES`, ordered by hue in `ALL_SCALES`, emitted `--area-<family>-<step>`, not accent
  candidates). Each series is a step: sky 350, pink 300, chartreuse 400, indigo 450, orange 350, mint 400, violet 350,
  red 250; mark, area, ink and ramps are steps of the same family. Series lightness = sky's step, Light 350 / Deep 400
  (Segmented); canvas mark `series: 3`. Gate 28/28; tokens 29,174; contrast 536/0; all app checks pass.
- Badge (owner: "Icons take the words' colour: arrows and status marks alike"): plain, outline, soft and color icons
  inherit the words' ink; the dot keeps the bright mark; modern keeps its marked icon (its words are default ink).
- Page: the Recipe option folded into Series; heat uses ramp 1, 2, 4 (text ink) and 6, 7 (page ink) in both themes,
  every number ≥ 5.06:1.
