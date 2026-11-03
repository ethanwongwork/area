# GitHub / Primer — tables and data visualisation (measured evidence)

Gathered 2026-11-01. Read-only. All values below come from source files or live bundles. Nothing here comes from memory.

## Pinned sources

| Key | Source |
|---|---|
| PR | primer/react @ `6826a6a0665e81e19723ddd4e0c9418f1f9e5d44`, `packages/react/src/DataTable/{Table.module.css, Pagination.module.css, Table.tsx}` |
| PP | primer/primitives @ `ec3eee6ac930cf942e97a86a722aac2c3fb4f3a9`: `src/tokens/functional/color/data-vis.json5`, `src/tokens/component/contribution.json5`, `docs/storybook/stories/Color/Display/DataVisColors.stories.tsx` |
| PPd | Resolved values from the npm build `@primer/primitives@11.10.0`: `https://unpkg.com/@primer/primitives/dist/css/functional/themes/{light,dark}.css`, `.../size/{radius,border,size}.css`, `.../typography/typography.css`, `.../base/typography/typography.css` |
| PD | primer/design @ `87f799f202ec95df15c99f473c9c0c803da8e6b3`: `content/ui-patterns/data-visualization.mdx`, `content/components/data-table.mdx` (published at primer.style/product/ui-patterns/data-visualization) |
| GHc | Live github.com, fetched 2026-11-01: `https://github.com/users/torvalds/contributions` (HTML fragment), `https://github.githubassets.com/assets/profile-dcafac334dbe113b.css`, `.../insights-bea4ba2665073153.css`, `.../primer-38ae573fa780d76a.css` |
| GHch | Live GitHub chart library (Highcharts wrapper "ChartCard"), lazy chunk `https://github.githubassets.com/assets/19-0fc385eed3b8a650.js` plus its CSS module `https://github.githubassets.com/assets/qb.ecb948e42926e58f.module.css`. The `repos-contributors-chart`, `repos-commit-activity` and `repos-code-frequency` bundles each lazy-load chunk 19 (`a.e(19)` / `r.e(19)` / `s.e(19)`). Copies are in `scratchpad/gh/live/js/lazy/`. |

Unit key: 1rem = 16px. Primer sizes: base-size-2/4/8/12/16/20/24/32 = 2/4/8/12/16/20/24/32px. text-body-size-small = 0.75rem = **12px**, text-body-size-medium = 0.875rem = **14px**, text-title-size-small = 1rem = 16px. lineHeight normal 1.5, relaxed 1.625, tight 1.25. Weights: normal 400, medium 500, semibold 600. borderRadius small 0.1875rem = **3px**, medium 0.375rem = **6px**, large 0.75rem = 12px. borderWidth-thin 1px. (PPd)

Neutral colours (PPd):

| Token | Light | Dark |
|---|---|---|
| bgColor-default | #ffffff | #0d1117 |
| bgColor-muted | #f6f8fa | #151b23 |
| borderColor-default | #d1d9e0 | #3d444d |
| borderColor-muted | #d1d9e0b3 | #3d444db3 |
| fgColor-default | #1f2328 | #f0f6fc |
| fgColor-muted | #59636e | #9198a1 |
| control-transparent-bgColor-hover | #818b981a | #656c7633 |
| bgColor-accent-emphasis | #0969da | #1f6feb |
| fgColor-accent | #0969da | #4493f8 |

---

## 1. Primer data visualisation guidance and data colours

### 1a. Guidance (PD `content/ui-patterns/data-visualization.mdx`)

| Slot | Property | Value | Source |
|---|---|---|---|
| Chart anatomy | Parts | Header (required), Subheader (required; it must give context when there are no axis titles), Legend ("Only show a legend when showing more than 1 data set"), Marks (bar/line/area), Axis titles (sometimes), Axis labels (required), Graph lines (required; some types use only horizontal or only vertical lines), Axis (required), Point (line charts, on hover), Crosshair (line charts), Tooltip (single or multi-line), Toolbar menu ("preview the data in a table and download the data in a CSV format") | PD L13–26 |
| Supported types | List | Bar, Line, Area, Progress bars. Not supported for new work: Donut, Sparklines | PD L30–40 |
| Segments | Divider | Stacked bars and progress bars get a high-contrast divider line between segments | PD L44 |
| Marks | Contrast | 3:1 against the background | PD L46 |
| Semantic | Rule | State colours (error/success) may replace the data colours when the meaning is semantic | PD L58 |

### 1b. Data colour tokens (PP `data-vis.json5` L1–555; hexes from PPd)

The token description reads: "Emphasis variants are for lines, bars, and borders. Muted variants are for area fills and backgrounds." (L3). It also has an LLM rule: "Pair emphasis with muted variants of the same color" (L7). Emphasis = `base.display.color.<hue>.5` and muted = `.0` (L13, L27).

| Hue | emphasis light | muted light | emphasis dark | muted dark |
|---|---|---|---|---|
| blue | #006edb | #d1f0ff | #0576ff | #001a47 |
| green | #30a147 | #caf7ca | #2f6f37 | #122117 |
| orange | #eb670f | #ffe7d1 | #984b10 | #311708 |
| pink | #ce2c85 | #ffe5f1 | #d34591 | #2d1524 |
| yellow | #b88700 | #ffec9e | #895906 | #2e1a00 |
| red | #df0c24 | #ffe2e0 | #eb3342 | #3c0614 |
| purple | #894ceb | #f1e5ff | #975bf1 | #211047 |
| auburn | #9d615c | #f2e9e9 | #a86f6b | #271817 |
| teal | #179b9b | #c7f5ef | #106c70 | #041f25 |
| gray | #808fa3 | #e8ecf2 | #576270 | #1c1c1c |
| coral | #d43511 | #ffe5db | #e1430e | #351008 |
| brown | #856d4c | #eeeae2 | #94774c | #241c14 |
| lemon | #866e04 | #f7eea1 | #977b0c | #291d00 |
| olive | #64762d | #f0f0ad | #7a8321 | #171e0b |
| lime | #527a29 | #e3f2b5 | #5f892f | #141f0f |
| pine | #167e53 | #bff8db | #18915e | #082119 |
| plum | #a830e8 | #f8e5ff | #b643ef | #2a0e3f |

**Production series order** (GHch chunk 19, Highcharts `colors`): blue, green, orange, pink, yellow, red, purple, auburn, teal, gray (all `-color-emphasis`). The storybook demo order is different: blue, green, orange, red, purple, teal, yellow, pink (PP story L24).

Display scales are also used by sequential/single-hue charts (PPd):
- green light: 0 #caf7ca · 1 #9ceda0 · 2 #54d961 · 3 #31bf46 · 4 #30a147 · 5 #2c8141 · 6 #2b6e3f · 7 #285c3b · 8 #254b34 · 9 #1d3528
- green dark: 0 #122117 · 1 #182f1f · 2 #214529 · 3 #285830 · 4 #2f6f37 · 5 #388f3f · 6 #41b445 · 7 #46c144 · 8 #75d36f · 9 #99e090
- blue light: 0 #d1f0ff · 1 #ade1ff · 2 #75c8ff · 3 #47afff · 4 #0f8fff · 5 #006edb · 6 #005fcc · 7 #004db3 · 8 #003d99 · 9 #002b75
- blue dark: 0 #001a47 · 1 #002766 · 2 #00378a · 3 #0046a8 · 4 #005bd1 · 5 #0576ff · 6 #4da0ff · 7 #61adff · 8 #85c2ff · 9 #a3d3ff

### 1c. Primer reference chart drawing (PP `DataVisColors.stories.tsx`; illustrative storybook, not production)

| Slot | Property | Value | Line |
|---|---|---|---|
| Plot | viewBox / padding | 880×240; pad L36 R16 T12 B32 | L42–47 |
| Gridlines | stroke | `borderColor-muted`, 1px, horizontal only, 5 ticks (0/25/50/75/100) | L75, L87–88 |
| Axis labels | type | 10px, `fgColor-muted`; y labels end-anchored 6px left of the plot; x labels 14px below the plot | L91–109 |
| Line | stroke | 2px, round join/cap, emphasis colour | L180–182 |
| Point | dot | r 3, emphasis fill | L191 |
| Area | fill / line | muted fill at opacity 0.85 under a 1.5px emphasis line | L220, L230 |
| Legend | layout | flex-wrap, gap 12px, margin-top 8px; item gap 6px, 12px `fgColor-muted` text; swatch 12×12, radius 2 | L120–131 |
| Heading | type | 16px (h1) / 14px, weight 600, margin-bottom 12px | L150–152 |

---

## 2. Primer React DataTable (PR, `Table.module.css` unless noted)

| Slot | Property | Value | Line |
|---|---|---|---|
| Container | grid areas | title/actions → divider → subtitle → filter → table → footer; column-gap 8px | L2–13 |
| Title | type | 14px, weight 600, line-height 20px, fgColor-default | L16–25 |
| Subtitle | type | 12px, weight 400, line-height = title-lineHeight-small (1.5), fgColor-default | L28–35 |
| Actions | gap | 8px, justify end | L38–44 |
| Divider | rule | 1px borderColor-default; margin 16px above, 8px below | L47–55 |
| Title→table | gap | 8px | L58–62 |
| Table | font | **12px (0.75rem)**, line-height **20/12** (20px) | L73–80 |
| Table | radius | **6px (0.375rem)** on the outer corners only; border-collapse separate | L71, L83, L144–165 |
| Table | bg | bgColor-default | L84 |
| Cell padding | condensed | **4px block / 8px inline** → row 28px (20 + 8) | L89–92 |
| Cell padding | normal (default) | **8px / 12px** → row 36px | L94–97; default `cellPadding='normal'` Table.tsx L46 |
| Cell padding | spacious | **12px / 16px** → row 44px | L99–102 |
| First/last cell | edge inset | 16px inline-start / inline-end on every row, whatever the density (keeps type aligned) | L182–190 |
| Borders | rows | 1px borderColor-default on the block-end of every cell; outer left/right on first/last cells; top on the header | L106–124, L138–140 |
| Header | paint | weight 600, **fgColor-muted**, **bgColor-muted** fill | L193–198 |
| Header | sorted | fgColor-default when aria-sort is set | L200–203 |
| Row header | `scope=row` | weight 600, fgColor-default | L233–238 |
| Alignment | end | `data-cell-align='end'` → justify flex-end; the sort icon sits before the label (row-reverse) | L126–136 |
| Row hover | fill | control-transparent-bgColor-hover (#818b981a / #656c7633) on the cells | L228–230 |
| Sort button | layout | column-gap 0.5rem (8px); Octicons SortAscIcon / SortDescIcon | L284–286; Table.tsx L1, L160–181 |
| Sort icon | visibility | hidden; the ASC icon shows on header hover/focus; the active direction icon always shows | L211–225 |
| Group header | row | bgColor-muted, fgColor-muted, label weight 600 + count muted, 8px gap; toggle 24×24 radius 3px, rotates 90° when open | L307–362 |
| Skeleton | widths | rows cycle 85 / 67.5 / 80 / 60 / 75 % | L255–273 |
| Pagination | bar | padding 8px 16px; 1px border with no top; bottom radius 6px; space-between, gap 16px | Pagination.module.css L1–13 |
| Pagination | range text | 12px fgColor-muted | L60–64 |
| Pagination | page button | min 32×32, 14px, line-height 20/14, padding 8px 6px, radius 6px; hover = transparent hover fill; current = bgColor-accent-emphasis + fgColor-onEmphasis | L101–125 |
| Pagination | prev/next | 14px, fgColor-muted (fgColor-accent when enabled), padding 8px, radius 6px; 16px from the page list | L77–99 |

Guidance (PD `data-table.mdx`):
- "Right-align numeric values and use the `tabular-num` font variant" (L113).
- Leave empty cells blank, with no dash, icon or emoji (L127, L250).
- Truncation is a last resort, with the full text in a tooltip (L115–123).
- A sortable table starts with one column sorted (L509–510).
- Density: Condensed "showing more information in a smaller area", Spacious for busy cells (L384–390).

Chart-to-table override (GHch CSS module): inside a chart card's "View as table" dialog the table radius is 0 and the outer left/right borders are removed (`.ChartCardTableContainer .-table {--table-border-radius:0}`).

---

## 3. GitHub's own dashboards

### 3a. Contribution calendar (GHc, live torvalds fragment + profile CSS)

| Slot | Property | Value | Source |
|---|---|---|---|
| Heading | text / type | "4,018 contributions in the last year", class `f4 text-normal` = 16px, weight 400, margin-bottom 8px | contrib.html L9–13; primer CSS `.f4{16px}` |
| Frame | box | 1px borderColor-default, radius 6px (`.graph-before-activity-overview`) | profile CSS |
| Grid | element | `<table role="grid" aria-readonly>` with `border-spacing: 3px`, `border-collapse: separate`, `width: max-content` | contrib.html L28; profile CSS |
| Cell | size | **10×10px** (td `width:10px`, tr `height:10px`) → 13px pitch | contrib.html L101, L109 |
| Cell | radius / edge | **2px** radius, **0.5px** border `contribution-default-borderColor-0` (black at 5% light #1f23280d, dark #0104090d), `shape-rendering: geometricprecision` | profile CSS `.ContributionCalendar-day` |
| Levels light | bg 0–4 | **#eff2f5 · #aceebb · #4ac26b · #2da44e · #116329** | PPd `--contribution-default-bgColor-*` |
| Levels dark | bg 0–4 | **#151b23 · #033a16 · #196c2e · #2ea043 · #56d364** | PPd |
| Level tokens | source | defined in `contribution.default.bgColor.0–4` (dark overrides for levels 1–4 begin `base.color.green.8`, `.6`, …, `.2`) | PP contribution.json5 L3–78 |
| Month labels | header row | height 13px; label spans 4–5 week columns; leading day-label column 28px wide | contrib.html L32–33, L38 |
| Day labels | rows | Mon/Wed/Fri visible (Sun etc. are clipped with `clip-path: Circle(0)`); 12px, fgColor-default, padding .125em .5em .125em 0 | contrib.html L102–106; profile CSS `.ContributionCalendar-label` |
| Tooltip | content | `<tool-tip data-direction="n">` "1 contribution on November 2nd." (count + date, sentence) | contrib.html L110 |
| Focus | ring | outline 2px focus-outlineColor, offset −1px; cells are tabbable (`tabindex=0`) | profile CSS |
| Selection | dimming | other days go to opacity .5 while some are selected; the active day stays at 1 | profile CSS `.days-selected` |
| Legend | row | footer `f6` (12px) `py-1`; left: "Learn how we count contributions" (Link--muted); right: **"Less" + five 10×10 swatches + "More"**, fgColor-muted, 4px gaps (`mr-1`), swatch radius `rounded-1` = borderRadius-small 3px | contrib.html L1268–1293 |
| Legend a11y | labels | sr-only "No / Low / Medium-low / Medium-high / High contributions."; each cell's `aria-describedby` points to its legend level | contrib.html L1278–1292, L109 |
| Forced colours | pattern | levels 1–4 drawn as radial dots of 15/35/55/75% | profile CSS |
| Themes | seasonal | halloween / winter alternate scales (`data-holiday`) | profile CSS |
| Activity overview | axis | axis + point stroke = contribution level 4; labels fgColor-muted; percentages 12px | insights CSS `.activity-overview-*` |

### 3b. Repository Insights charts (GHch, the shared "ChartCard" on Highcharts)

All values below are from chunk `19-0fc385eed3b8a650.js` and the CSS module `qb.ecb948e42926e58f.module.css`.

| Slot | Property | Value |
|---|---|---|
| Chart heights | size → px | **xl 432 · large 320 · medium 256 · small 128 · sparkline 128** (`ed` map) |
| Card | border | 1px borderColor-default, radius 6px (`ChartCardContainerBordered`) |
| Card | padding | none 0 · normal `stack-padding-normal` **16px** · spacious **24px** |
| Card header | layout | flex space-between; margin-bottom 16px; title `text-title-shorthand-small` (16px/600/1.5); description `text-caption-shorthand` (12px/400/1.25) fgColor-muted; leading visual margin-right 8px |
| Chart | spacing / bg / font | spacing [4,0,4,0]; bg bgColor-default; font fontStack-sansSerif 12px; `animation: false` |
| Title / caption | align | left; caption fgColor-muted, top |
| x-axis | lines | tickWidth 0; **axis line 1px borderColor-default**; gridlines borderColor-muted **Dash** (line and area charts switch to Solid) |
| y-axis | lines | tickWidth 0; **no axis line** (lineWidth 0); gridlines borderColor-muted Dash; gridlines are drawn only when there is a single y-axis (`gridLineWidth: i ? t : 0` where i = one axis) |
| Axis labels / titles | type | 12px fgColor-muted; datetime labels use the `%b %e` format ("Jan 5") |
| Stack labels | type | 12px fgColor-default with a 1px bgColor-default text outline |
| Series | stroke | lineWidth **2**; bar/column borderWidth **1.5** in **bgColor-default** (the white gap between segments); markers off by default, and off for spline and sparkline |
| Area fill | gradient | top→bottom `color-mix(series 25%, transparent)` → `color-mix(series 1%, transparent)` |
| Area palette | line + fill | default cycle green / teal / blue / indigo / orange: line = display green-4, teal-4, blue-4, indigo-7, orange-4; fill = the same hue's display scale-0 (maps `eg`/`ev`/`ep`) |
| Column single-hue | ramp | 5 steps: display scales 8, 4, 2, 1, 0 (default theme green); `increased contrast` swaps to 9, 5 and gradients |
| Line distinction | dash cycle | Solid, ShortDash, Dot, DashDot, LongDash, … ("Differentiate by line style" is on by default); marker symbols cycle circle, square, diamond, triangle, triangle-down |
| Legend | layout | top-left (x −8, y −4), 12px fgColor-default, no hover colour change; only when there is more than one series; columns/bars get square symbols (symbolRadius 0) |
| Legend/tooltip symbol | swatch | 1em × 1em, margin-right 2px, vertical-align middle; circle = 50%, square = 0, diamond = rotated 45°, triangles via clip-path |
| Tooltip | box | bg bgColor-default, **radius 6**, 1px borderColor-muted, padding 10, shadow offset 2/2, width 4, opacity .02 |
| Tooltip | content | HTML table, min-width 120px; header = point key in fgColor-muted weight 600, padding-bottom 2px; each row = swatch + series name, value right-aligned **bold**, row padding-top 4px; 12px |
| Sparkline | mode | hides title, description and visuals; no axes, gridlines, tooltip or mouse tracking; 128px tall |
| Toolbar menu | actions | "View as table", "Download CSV", "Download PNG", plus "Customization settings": "Increase contrast" ("Adds gradients and outlines…"), "Differentiate by line style", "Show data labels" |
| Locale | numbers | decimalPoint ".", thousandsSep "," |
| States | pages | Loading, Skeleton, ErrorMessage and TooLarge components (commit-activity / code-frequency bundles) |
| Contributors page | grid | small multiples `repeat(auto-fill, minmax(320px, 1fr))`, gap 16px, equal row heights; main chart min-height 256px (`repos-contributors-chart.47f9faa583f9a3f2.module.css`) |

Legacy (D3-era) insights CSS still shipped in `insights-bea4ba2665073153.css`. It is used by Traffic, Community and Pulse; whether each page still uses it is unverified:
- Traffic: graph 293px tall. Paths are 2px, total = success-emphasis, unique = accent (pink in colour-blind themes).
- Community: lines 3px. Discussions success dashed `6 1`; issues/contributors accent solid; PRs done dashed `3`. Dots are hidden until hover. X ticks dashed `5`, y ticks borderColor-muted, the zero line bgColor-emphasis.
- Pulse authors bars: 150px tall, severe-emphasis at fill-opacity .7, 1 on hover.
- Language bar: segments separated by a 1px bgColor-default left border, radius 6 at the ends, legend dots 10×10 round.
- `.graph-canvas .axis .zero line`: accent dashed 3 3 at 1.5px.

The Pulse page is now a React app (`repos-pulse`); I did not trace its chart styles. **Unverified.**

### 3c. Copilot usage metrics / billing dashboards

Docs (`docs.github.com/en/copilot/concepts/billing-and-usage/copilot-usage-metrics/copilot-metrics`):
- There are Usage, Code generation and Impact dashboards, each showing a 28-day window.
- Named charts include "IDE active users" and "IDE daily active users".
- The Impact dashboard has adoption cohorts (Passive, Phase 1–3), an adoption multiplier, and an "Industry comparison" distribution with median and top-decile marks.
- **Chart types, KPI-card layout and visual values are not documented: unverified.** The dashboards sit behind authentication, so I made no live capture.
- The Actions usage metrics and billing usage pages: **not researched / unverified.**

---

## 4. Projects Insights charts

| Slot | Property | Value | Source |
|---|---|---|---|
| Configure panel | controls | **Layout** (chart type), **X-axis** (field), **Group by** (current charts only; "None"), **Y-axis** (sum / average / minimum / maximum of a number field; the default is item count) → **Save changes** | github/docs `content/issues/planning-and-tracking-with-projects/viewing-insights-from-your-project/configuring-charts.md` L16–20 |
| Layout | types | "custom bar, column, line, and stacked area charts"; aggregations "sum, count, average, min, and max" | github.blog, Projects GA post |
| Layout | count | "six different layout options" (alpha); examples: column grouped by iteration summed on effort, stacked column by a custom field, stacked area / line for trends. The full six names are **unverified** (presumably including stacked bar/column). | github.blog changelog 2022-03-10 |
| Current vs historical | X = Time | Historical charts use X-axis = Time and states Open / Completed / Closed pull requests / Not planned; the default chart is "Burn up". Historical charts no longer support Group by (2023-09-07 changelog). | docs "About insights for Projects" |
| Library | renderer | "Projects insights charts now use Highcharts" (accessibility) | github.blog changelog 2024-12-12 |

---

## Patterns worth adopting

1. **Paired data colours: emphasis for strokes and bars, muted for fills.** Use one hue at step 5 and step 0. Rely on a short fixed series order (blue, green, orange, pink, yellow, red, purple, auburn, teal, gray) rather than a long palette.
2. **Light chrome.** Use no y-axis line and no tick marks. Keep one solid baseline (x-axis, borderColor-default) and dashed horizontal gridlines in borderColor-muted. Put every label at 12px muted.
3. **One line weight (2px), with the background as divider.** Bars and stack segments get a 1.5px border in the surface colour, which gives the "high-contrast divider" between segments without a new token.
4. **Soft area fill.** Use a vertical gradient from 25% to 1% of the series colour, so overlapping areas stay light.
5. **Fixed chart heights by size.** Use 128 / 256 / 320 / 432, and a 128px sparkline with all chrome removed.
6. **Chart card.** Use a 1px border, radius 6, and padding 16 or 24. The header is a title (16/600) and a muted caption (12px). A toolbar menu holds "View as table", CSV, PNG and accessibility toggles.
7. **Tooltip as a mini table.** A muted semibold header (the x value), then rows of swatch + name + right-aligned bold value. Radius 6, 1px muted border, near-invisible shadow.
8. **Legend only for more than one series.** Place it top-left. Swatch shape follows the mark (square for bars, circle for lines). Optional dash styles and marker shapes give a colour-blind channel.
9. **Heatmap.** Cells 10px with a 3px gap, 2px radius and a 0.5px 5%-black edge. Use five levels (an empty grey plus four greens). End with a **"Less ▢▢▢▢▢ More"** legend in 12px muted. Each cell has a sentence tooltip ("N contributions on <date>"), is keyboard-focusable, and is described by its legend level.
10. **Table alignment.**
    - Density only changes padding: 4/8, 8/12 or 12/16, which gives rows of 28, 36 or 44px at 12px/20px type.
    - The first and last columns keep a fixed 16px edge inset at every density.
    - The header uses the muted fill with muted semibold text.
    - Numbers are right-aligned with tabular numerals, and the sort icon flips side for end-aligned columns.
    - Empty cells stay blank.
11. **Every chart can become a table.** In the dialog, the chart's table drops its radius and outer side borders.
12. Primer's guidance says *not* to build new donut charts or sparklines. GitHub's own ChartCard nevertheless ships a sparkline size, so treat the sparkline-in-table-cell idea as allowed in code but discouraged in guidance.

## Unverified / gaps
- Exact chart type per Insights page (contributors, commit activity, code frequency). I confirmed they load the shared ChartCard chunk, but not which `type` each passes.
- Pulse (React) chart styles.
- The Copilot dashboard layout and chart types.
- The Actions usage metrics and billing pages.
- The full list of six Projects layouts.
- Primer.style's rendered Highcharts story (`color-datavis--highcharts-accent-colors`) is referenced in PD L50–53, but that story id no longer exists in the primitives repo. The current story file is `DataVisColors.stories.tsx`.
