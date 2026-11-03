# Technical data-viz patterns in developer products (2026-11-01)

Read-only research for Area's data-view modules. This file adds to `docs/research/data-views-2026-11-01/` and doesn't
repeat what's already there: line, bar, area, donut, KPI, bar list, calendar heatmap, tracker and heat matrix.
Nothing in the repo was edited.

**How values were gathered.** A value counts as measured only if it comes from one of these:
- a pinned open-source file (repo@short-sha, path, line);
- a public page or asset fetched today with curl;
- the installed Claude Code bundle.

Anything else is marked **unverified**. I didn't sign in anywhere. Product dashboards behind a login (Vercel, Datadog,
Cloudflare, Supabase, Linear, Cursor) are described only from their public docs.

## Pinned sources

| Key | Source |
|---|---|
| GF | grafana/grafana@01f74f76: `packages/grafana-ui/src/components/BarGauge/BarGauge.tsx`; `public/app/plugins/panel/bargauge/{BarGaugePanel.tsx,panelcfg.cue}`; `public/app/plugins/panel/{state-timeline,status-history}/panelcfg.cue` |
| PH | PostHog/posthog@f62351e7: `products/product_analytics/frontend/insights/retention/RetentionHeatmap/RetentionHeatmap.{tsx,scss}`, `.../lifecycle/LifecycleToggles.tsx`, `frontend/src/styles/base.scss`, `products/product_analytics/backend/hogql_queries/lifecycle/lifecycle_query_runner.py`, funnels folder listing |
| SE | getsentry/sentry@063a6cb2: `static/app/views/performance/traceDetails/trace.tsx`, `static/app/components/stream/group.tsx`, `static/app/components/charts/{groupStatusChart,miniBarChart}.tsx` |
| DT | ChromeDevTools/devtools-frontend@1be704ad: `front_end/panels/network/NetworkWaterfallColumn.ts`, `front_end/ui/legacy/components/perf_ui/FlameChart.ts` |
| LH | GoogleChrome/lighthouse@2934860c: `report/assets/styles.css`, `report/assets/templates.html`, `shared/util.js` |
| CC | codecov/gazebo@f2029176: `src/ui/Progress/Progress.tsx`, `src/ui/CoverageProgress/CoverageProgress.tsx`, `src/ui/SunburstChart/SunburstChart.jsx` |
| GH | github.com CSS assets captured 2026-11-01 (in this session's scratchpad `gh/live/css/`): `global-b577b4b65d1381c3.css`, `primer-38ae573fa780d76a.css`, `insights-bea4ba2665073153.css`, `github-11ab453cdcc1b7c1.css` |
| SP | Atlassian Statuspage, live: `https://www.redditstatus.com/` HTML plus its public `/uptime_showcase?components=…` JSON fragment, fetched 2026-11-01 |
| CL | Claude Code CLI bundle `/opt/homebrew/lib/node_modules/@anthropic-ai/claude-code/bin/claude.exe` (strings) |
| Docs | vercel.com/docs/speed-insights/metrics; grafana.com/docs …/state-timeline/ and …/bar-gauge/; docs.datadoghq.com/dashboards/widgets/top_list/; linear.app/docs/cycle-graph; turborepo.dev/docs/reference/run; docs.github.com (Actions visualization graph, Pulse); posthog.com/docs/product-analytics/lifecycle |

---

## Catalogue

Each entry gives:
- **Job:** what the pattern does.
- **Used by:** the products, with sources.
- **Anatomy:** its parts and their values.
- **Interaction:** how people use it.
- **Wide card:** whether it fits a wide card.

### 1. Segmented proportion bar (GitHub language bar / Primer Progress)
- **Job:** Shows the parts of one whole in a single thin strip. Examples: languages by bytes, or merged / open / closed.
- **Used by:** GitHub's repo sidebar Languages (GH), Primer `.Progress` (GH), and Codecov's coverage progress (CC).
- **Anatomy (GitHub).**
  - Strip height 8. `--large` is 10 and `--small` is 5.
  - Corners `--borderRadius-medium` (6).
  - Track `--progressBar-track-bgColor` with a 1px outline at offset −1.
  - Segments are spaced `--base-size-2` (2) apart (`primer-38ae573f.css`).
  - The legacy insights version separates segments with a 1px left border in `--bgColor-default` instead of a gap (`insights-bea4ba26.css`).
  - Legend: a 10×10 round dot, then the name, then the % (insights CSS). The sidebar dot is 12×12 with a 1px translucent border (`github-11ab453c.css` `.repo-language-color`).
- **Anatomy (Codecov).**
  - Bar `h-1` (4) by default and `tall` `h-5` (20). Track `bg-ds-gray-secondary`, fill green / red / yellow by threshold.
  - A fixed 56px value column sits to the right (`flex-[0_0_56px]`), 16 gap (`gap-4`) (CC `Progress.tsx`).
- **Interaction:** Hover a segment for its name and %. A legend item links to a filtered view (GitHub language search). Unverified for the React sidebar.
- **Wide card:** Yes. It's one full-width strip plus a wrapping legend row. Several strips can be stacked as rows, one per repo or package.

### 2. Diffstat blocks (GitHub)
- **Job:** Shows the size and direction of a change in a few pixels: "+12 −3 ■■■□□".
- **Used by:** GitHub PR file headers and commit lists (GH `global-b577b4b6.css`).
- **Anatomy.**
  - Five squares, each `--base-size-8` (8×8), `margin-left: 1px`.
  - Added: `--bgColor-success-emphasis`. Deleted: `--bgColor-danger-emphasis`.
  - Neutral (unchanged share): `--bgColor-neutral-muted` with a 1px `--borderColor-muted` inset outline.
  - Label `.diffstat`: small body size, semibold, muted, nowrap.
  - Blocks are allotted in proportion to additions vs deletions; the rule (5 blocks, rounding) is unverified.
- **Interaction:** A tooltip gives exact counts ("N changes: X additions & Y deletions"; wording unverified).
- **Wide card:** As a column inside a file / PR table, yes. On its own it is tiny. Its best use is the trailing cell of a row.

### 3. Uptime strip per component (Statuspage, Better Stack)
- **Job:** Shows a long history of status, one bar per day, for each service.
- **Used by:** Atlassian Statuspage (SP). Better Stack status pages use the same idea (unverified values).
- **Anatomy (SP, measured).**
  - SVG `viewBox="0 0 448 34"` with `preserveAspectRatio="none"`, so it stretches to the row width.
  - 90 `rect`s, each 3 wide × 34 tall at x = 0, 5, 10… (pitch 5, gap 2), with a single fill per day (`#65b200` when operational).
  - Breakpoints: 30 days at ≤600px and 60 days at ≤1024px; above that, 90 (`MAX_WIDTH_30_DAYS = 600`, `MAX_WIDTH_60_DAYS = 1024`). It works by shifting the viewBox, not by redrawing.
  - Header row: the component name, a "?" tooltip button and a status word on the right.
  - Legend row under the strip: "90 days ago" · spacer · "100.0 % uptime" · spacer · "Today".
- **Interaction:**
  - Each day is `role="tab"`, `tabindex` roving, with arrow-key navigation (inline script).
  - The tooltip lists outages for the day (partial / major durations).
  - A component group expands to show its children.
- **Wide card:** Excellent. It is literally one row per component, and it adapts its sample count to the width.

### 4. LED / "Retro LCD" bar gauge (Grafana)
- **Job:** Shows a value against a max as lit cells. It reads like a meter or VU bar, and thresholds colour the cells.
- **Used by:** Grafana bar gauge `displayMode: 'lcd'` (GF `BarGauge.tsx` L111–190).
- **Anatomy.**
  - Cell width target `lcdCellWidth = 12` (L83). Cell spacing is 2 in LCD mode (`getItemSpacing` → 2; 10 otherwise; `BarGaugePanel.tsx` L134–139).
  - `cellCount = floor(size / 12)` and `cellSize = floor((size − spacing·count) / count)`.
  - Cell corner 2.
  - Lit cell: threshold colour at 0.95, with a radial gradient to 0.55. Unlit cell: the same threshold colour at 0.18 (`getCellColor` L462–497). Unlit cells keep their threshold hue, so the scale is visible before it fills.
  - The value text sits to the right: width `max(min(width·0.2, 150), text)` (L437); value height 18–50 (L36–38).
- **The Basic mode is the useful flat variant.**
  - Fill is the bar colour at 35% alpha, with a **2px solid end edge** in the bar colour (`borderRight: 2px solid`, L578–581).
  - The unfilled track is the panel background emphasised by 0.07.
  - Corner `theme.shape.radius.sm`.
- **Defaults:** `minVizWidth 8`, `minVizHeight 16`, `maxVizHeight 300` (panelcfg.cue L44–46). Item spacing 10 in non-LCD modes.
- **Interaction:** None beyond panel links. Rows animate width over 1s.
- **Wide card:** Yes. A list of horizontal gauges, one per series, with the name left or on top and the value right, is a top-list with a scale.

### 5. State timeline and status history (Grafana)
- **Job:** Shows discrete states over time for many entities. Examples: deploy up / down / degraded, or job state per host.
- **Used by:** Grafana (GF panelcfg, Docs).
- **Anatomy.**
  - **State timeline:** One row per series. A state is a horizontal band whose length is its duration, and equal consecutive values are merged. Defaults: `mergeValues: true`, `rowHeight 0.9` (fraction of the row), `fillOpacity 70`, `lineWidth 0`, `alignValue "left"`, `showValue "auto"` (drawn only if it fits), `perPage 20`.
  - **Status history:** The same rows, but cut into fixed time buckets (a grid of cells). Defaults: `rowHeight 0.9`, `colWidth 0.9` (the 10% remaining is the gap), `fillOpacity 70`, `lineWidth 1`.
  - Colour comes from value mappings or thresholds. The legend lists the mappings (Docs).
- **Interaction:** The tooltip is single or all-series; it can sort, and its max height is 600. Pagination comes into play when there are more than `perPage` rows.
- **Wide card:** Excellent. Rows are entities, x is time, and the name column sits left.
- Status history is a tracker strip multiplied by rows. State timeline is the merged-band version, which is new to Area.

### 6. Trace / span waterfall (Sentry; Datadog and Honeycomb are similar)
- **Job:** Shows where time went inside one request. Spans are nested, laid on a shared time axis.
- **Used by:** Sentry's trace view (SE `trace.tsx`).
- **Anatomy.**
  - Two columns: a tree list on the left (`--list-column-width`) and the span timeline on the right (`--span-column-width`).
  - `.TraceRow` is 24 tall, font `size.sm`, with odd rows tinted `background.secondary` (L1245–1258).
  - `.TraceBar` is 16 tall (L1587–1590).
  - The duration label (`.TraceBarDuration`) is `size.xs`, secondary colour, `tabular-nums`, set just after the bar end (L1637–1645).
  - The children count pill is 16 tall with a min width of 30, fully rounded, a 1.5px border, 10px text and an 8px right margin (L1646–1660).
  - When the bar is off-screen, an edge arrow 14×24 appears.
- **Interaction:**
  - Click a row to open the drawer, and expand or collapse children.
  - Zoom and pan the time axis (reset zoom button).
  - Hover shows the arrow to the off-screen bar. The row hover background is `interactive.transparent.neutral.background.hover`.
- **Wide card:** Excellent. It is the canonical row-based technical chart. A card version is about 6–10 rows with a duration column.

### 7. Network waterfall (Chrome DevTools)
- **Job:** Shows request timing per resource, broken into phases.
- **Used by:** DevTools Network panel (DT `NetworkWaterfallColumn.ts`).
- **Anatomy.**
  - One request per row. The bar is centred in the row.
  - Main bar 13 tall. Thin phases (queueing, DNS, connecting, SSL, proxy, blocking, push) are 7 tall (L504–513).
  - `BAR_SPACING = 1`. Free zones are 75 px left and 18 px right of the time scale (L450–451).
  - **Colours are pastel by resource type, at HSL lightness 80%:** document `hsl(215,100%,80%)`, script `hsl(31,100%,80%)`, stylesheet `hsl(272,64%,80%)`, xhr / fetch `hsl(53,100%,80%)`, image / media `hsl(90,50%,80%)`, font `hsl(8,100%,80%)`, other `hsl(0,0%,95%)`.
  - The border is the same hue with saturation halved and lightness −0.2. The "waiting" part is the same hue at lightness ×1.1. Lines are 1px (L154–208).
  - The receiving phase has a 2px `#03A9F4` border, and queueing a 2px light-grey one.
  - Whiskers (1px) run from start to the end of the fetch.
- **Interaction:** Hover shows a phase breakdown popover. Row selection syncs with the table.
- **Wide card:** Yes. This is the **closest existing precedent for Area's look**: a pastel fill, a 1px darker same-hue stroke, and thin phase bars.

### 8. Flame chart / flame graph (DevTools, Datadog profiler, Sentry profiling)
- **Job:** Shows the call stack over time (flame chart) or aggregated (flame graph). Width is time and depth is the stack.
- **Used by:** DevTools Performance (DT `FlameChart.ts`). Datadog and Sentry profiling use it too (values unverified).
- **Anatomy (DevTools).**
  - `barHeight = 17`, `textPadding = 5`, `textBaseline = 5` (L436–439).
  - A label is shown only if the bar is at least `2·textPadding + width("…")` wide (L2657).
  - Group headers are padded 6 left, with an 8 expansion arrow (L107–111).
- **Interaction:** Zoom and pan, hover for details, click to select, search, collapse tracks.
- **Wide card:** Moderately. It suits a wide, shallow (5–8 level) "icicle" strip. Deep stacks need height.

### 9. Retention cohort triangle (PostHog; Amplitude and Mixpanel are similar)
- **Job:** Shows what % of each start cohort comes back in period N.
- **Used by:** PostHog retention (PH `RetentionHeatmap.{tsx,scss}`).
- **Anatomy.**
  - Row height `ROW_HEIGHT 34`, or `SMALL_ROW_HEIGHT 26` in the small layout (tsx L25–26).
  - Head band 2.5rem (40), or 2rem (32) in the small layout.
  - The left label column is capped at 40% of the width and holds the cohort date (ellipsis) plus the cohort size right-aligned in `tabular-nums` secondary text. Row gap 4.
  - Cells hold "NN.N%" labels (`toFixed(1)`), coloured on a linear scale of the cohort colour. A label is dropped when it doesn't fit.
  - A "mean" row is styled differently, and cells for the in-progress period are drawn unfilled.
  - The shape is a triangle because later cohorts have fewer periods.
- **Interaction:**
  - Hover highlights the row and column (`--color-bg-fill-highlight-50`), and a selected column is weight 600.
  - Clicking a cell opens the people in it ("Click a cell to see who is in it").
  - Hovering an in-progress cell shows a "Period in progress" tooltip.
- **Wide card:** Yes. Cohort rows run down and periods run across, and 8–12 columns fill a wide card. It is a heat matrix that carries a triangle and a size column.

### 10. Lifecycle ± stacked bars (PostHog)
- **Job:** Splits active users per interval into new, returning and resurrecting (above zero) and dormant (below zero).
- **Used by:** PostHog lifecycle (PH).
- **Anatomy.**
  - Dormant is negated in the query: `status = 'dormant' ? negate(sum(counts))` (`lifecycle_query_runner.py` L94).
  - Order: new, returning, resurrecting, dormant (L219).
  - Colours (`base.scss` L708–715): new `#1d4aff`, returning `#388600`, resurrecting `#a56eff`, dormant `#db3707`, each with a darker hover shade.
  - Toggles act as the legend, each with a tooltip definition (`LifecycleToggles.tsx`).
  - A stacking and percentages filter exists.
- **Interaction:** Clicking a segment opens its people (Docs). The toggles hide a status.
- **Wide card:** Yes. It is a column chart with a zero baseline in the middle, and it fills width well with 12–30 intervals.

### 11. Funnel steps (PostHog)
- **Job:** Shows conversion through ordered steps and where people drop off.
- **Used by:** PostHog funnels. The repo has `FunnelBarHorizontalChart/`, `FunnelBarListChart/` (with `FunnelBarListDropOff.tsx`), `FunnelStepsBarChart/` (`StepConversionChips.tsx`) and `FunnelStepsTable/` (PH listing).
- **Anatomy:** Exact values are unverified; I didn't read the components.
  - The bar-list layout is one row per step: a step label, a conversion bar, the value, and a drop-off segment.
  - The vertical layout is a column per step with conversion chips between steps.
  - There is also a time-to-convert histogram (`FunnelHistogramChart`).
- **Interaction:** Clicking a segment shows the people who converted or dropped off. A breakdown splits each bar.
- **Wide card:** Yes in the bar-list form: 3–6 step rows, each with a light "drop-off" remainder behind the converted part.

### 12. Mini frequency bars in a list row (Sentry issue stream)
- **Job:** Shows the event trend inside each issue row.
- **Used by:** Sentry issue list (SE `group.tsx` L599–610, `groupStatusChart.tsx`, `miniBarChart.tsx`).
- **Anatomy.**
  - `MiniBarChart` is 36 tall (`groupStatusChart.tsx` L120; placeholder 36).
  - Two overlaid series (`barGap: '-100%'`): filtered and total, in `dataviz.semantic.other` / `accent`.
  - `barMinHeight 1`; top corners 1 (`borderRadius [1,1,0,0]`, `miniBarChart.tsx` L265, L323–337).
  - A max mark line in `border.transparent.neutral.moderate`, with its label on the right.
  - The y max is padded so a value of 10 never fills the height (L223–238).
- **Interaction:** Hover on a bar shows its period count.
- **Wide card:** As a column in a table, yes. It is the "sparkline column" of a technical table.

### 13. Score gauge + metric rows (Lighthouse, Vercel Speed Insights)
- **Job:** Gives one score with good / ok / poor bands, then the metric rows behind it.
- **Used by:** Lighthouse (LH) and Vercel Speed Insights (Docs).
- **Anatomy (Lighthouse).**
  - The gauge is an SVG `viewBox 0 0 120 120`, circle r 56, `stroke-width 8`, round caps, with the base ring at 0.1 opacity (`templates.html` L484–486, `styles.css` L1306–1322).
  - Sizes: big 96, normal 48 (72 in some layouts), sm 32. Label 18 (big).
  - Bands: pass ≥ 0.9 (`PASS_THRESHOLD`) and average ≥ 0.5 (`shared/util.js` L13–17).
  - Metric rows are a 2-column grid with a 1px top border, and the value is 1.8× the report font.
- **Vercel:** Uses the same bands: 0–49 red Poor, 50–89 orange Needs Improvement, 90–100 green Good. P75 is the default, with P90 / P95 / P99 selectable.
  - Routes are listed by score in a "kanban" grouped view (the doc image is named `kanban-light.png`; its layout is unverified).
  - There is a country map.
- **Wide card:** The ring alone isn't wide. The **metric-row list** (name, value, threshold band bar with a P75 marker) is.

### 14. Threshold distribution bar with percentile marker (CrUX / PageSpeed, Speed Insights)
- **Job:** Shows what share of real users are good / ok / poor, and where P75 falls.
- **Used by:** PageSpeed Insights field data. Vercel's per-metric view probably does the same.
- **Anatomy:** Unverified, not fetched this pass. It is a 3-segment strip (green / amber / red shares) with a marker at the P75 value.
- **Wide card:** Yes. Stack one row per metric (LCP, INP, CLS, FCP, TTFB).

### 15. Latency histogram with percentile guides (Grafana histogram / heatmap, Vercel function durations, Sentry durations, Datadog distribution)
- **Job:** Shows the shape of a duration distribution, with p50 / p95 / p99 guide lines.
- **Used by:** Grafana histogram panel and heatmap (log-bucket over time). Datadog distribution widget. PostHog funnel time-to-convert (`FunnelHistogramChart`).
- **Anatomy:** No values measured this pass. Typically there are 20–60 buckets, an x axis in ms on a log scale, and vertical dashed guides labelled "p50 120ms".
- **Wide card:** Yes, as a wide short column chart with a label strip of percentiles above it.

### 16. Top list with inline bars (Datadog, Vercel Observability panels)
- **Job:** Gives a ranked list with values and a relative bar.
- **Used by:** Datadog Top List (Docs).
  - `style.display` is `stacked` (default) or `flat`. Scaling is `relative` (% of total, count data only) or `absolute`.
  - Legend: `automatic` / `inline` / `none`.
  - `sort.count` limits the rows. `conditional_formats` colour rows by threshold.
- **Note:** Area already has a bar list. The new parts are the **stacked** variant (each row is a segmented bar) and threshold formatting.

### 17. Burn-up with scope (Linear cycle graph)
- **Job:** Tracks progress against scope during a cycle.
- **Anatomy (Docs):**
  - Grey scope line.
  - A blue dotted target line, which flattens over weekends.
  - A yellow "started" area stacked on the solid blue "completed" line.
  - Blue completed bars beneath.
  - Started counts 25% toward Cycle Success.
- **Wide card:** Yes, as a line + area chart. It's new as a composition, not as a mark.

### 18. Job / task graph and run timeline (GitHub Actions, Turborepo, Nx)
- **Job:** Shows the dependency DAG of jobs, plus how long each took.
- **Used by:**
  - **GitHub Actions:** The visualization graph shows each job with a status icon to the left of its name, lines for dependencies, live updates, and a click to open logs (Docs). Durations aren't documented there.
  - **Turborepo:** `--graph` emits svg / html / mermaid / dot. `--summarize` writes JSON with task timings and hashes to `.turbo/runs`. `--profile` writes a Chrome-trace file for Perfetto (Docs).
- **Card version:** A **task Gantt**: one row per task, a bar from start to end, and the cache state (hit / miss) shown as fill vs outline. Values are unverified; Nx wasn't researched.
- **Wide card:** The Gantt form fits perfectly. The DAG form needs a canvas.

### 19. Usage meters with reset (Claude Code, Cursor, Raycast)
- **Job:** Shows how much of a quota is used and when it resets.
- **Used by:** Claude Code `/usage` (CL).
  - Rows titled "Current session" (`five_hour`), "Current week (all models)" (`seven_day`, always shows the reset date) and "Current week (Sonnet only)".
  - Extra rows include "Claude Code and Cowork credit" with "One-time credit · Expires {Month day}".
  - Each row is one meter component with a title, a limit and a reset line.
  - The bar glyphs and the "% used" wording weren't extracted (the bundle grep timed out).
  - Cursor's and Raycast's pages require sign-in (unverified).
- **Wide card:** Yes. Stacked meter rows, each with a title on the left, "NN% used" on the right, and a reset subtext.

### 20. Coverage sunburst and treemap (Codecov, bundle analyzers)
- **Job:** Shows a size or coverage hierarchy.
- **Codecov sunburst:**
  - d3 partition with radius = width/6. The outer radius is reduced by 1px as the gap.
  - Colour comes from a `scaleSequential` over coverage %.
  - Leaves are at fill-opacity 0.6 and parents at 1. Two levels are shown below the selection (`SunburstChart.jsx` L64–188).
- **Bundle analyzers:** Treemaps; not measured.
- **Wide card:** The sunburst no. A treemap is passable. A **size bar list per package** (row, name, KB, bar, gzip) fills width better.

### Not researched or mentioned only
These weren't researched this pass; no claims are made:
- GitHub code frequency (± area chart of additions / deletions per week, already in `github-primer.md`);
- contributors small multiples (in `github-primer.md`);
- dependency graph and network graph;
- Datadog service map and query value;
- PostHog stickiness and paths (Sankey);
- Cloudflare analytics;
- Supabase / Neon DB metrics;
- npm weekly-downloads sparkline;
- Sentry release-health crash-free %.

GitHub removed its weekday×hour **punch card** around late 2017; the sources are secondary (issarice.com write-up, community discussion #135572, GHE 2.2–2.7 docs). It survives in tools like `git punchcard`. As a pattern it is a 7×24 dot matrix where dot area is the count.

---

## Ranked shortlist for Area

The target is flat cards with pastel fills, 1px strokes, mono numbers and wide rows.

| # | Pattern | How it would look in Area |
|---|---|---|
| 1 | **Trace / job waterfall** (6, 18) | Rows of 24, bars of 12–16 with a pastel fill and a 1px same-hue stroke. A mono duration sits right after each bar, the name column is on the left with indent guides, and the odd rows are faintly striped. |
| 2 | **State timeline / status history** (5, 3) | One row per service. Merged state bands come from the status tints (fill only, with 1–2 gaps between buckets in the history form), followed by a mono "99.98%" right column and "90d ago · Today" end labels. |
| 3 | **Network-style phase bars** (7) | DevTools' own recipe is already Area's: a lightness-80 pastel fill, a darker same-hue 1px stroke, thin 7 phases before a 13 main bar, and a mono ms scale on top. |
| 4 | **Latency histogram with p50 / p95 / p99 guides** (15) | A wide, short column chart with light fills and dashed 1px guides, labelled with mono chips ("p95 412ms") on a top rail. |
| 5 | **Retention triangle** (9) | Rows of 34 (26 compact). Cells are the accent mixed into the ground by %, with mono "42.0%" labels. The size column is right-aligned and tabular. In-progress cells are outline-only. |
| 6 | **Lifecycle ± bars** (10) | Columns above and below a 1px zero line. The three positive states use light categorical tints and dormant takes a muted red below zero. Toggles double as the legend. |
| 7 | **Funnel step rows** (11) | One row per step: a converted bar (pastel fill + stroke) over a hatched or faint drop-off remainder, then mono "1,204 → 62.3%". |
| 8 | **LED / segmented gauge rows** (4) | Grafana's LCD rule (cells of about 12, gap 2, corner 2, unlit cells at 18% of their threshold hue) as flat cells: a quota or CPU meter per row with the value on the right. The Basic mode (35% fill + 2px end edge) matches Area's light-fill-plus-edge bars even more closely. |
| 9 | **Diffstat + proportion strip** (1, 2) | An 8-tall segmented strip with 2 gaps (Primer) for language or package share, and 8×8 diffstat squares as a table cell beside "+12 −3" in mono. |
| 10 | **Usage meter rows with reset** (19) | Stacked rows: title, thin meter, mono "37% used", and a muted "Resets Tue 9:00" line, the way Claude Code's `/usage` lists session and week limits. |

Honourable mentions:
- the Sentry-style mini frequency bars as a table column (36 tall, a 1px max line);
- a shallow icicle / flame strip (bars of 17, labels only when wide enough).
