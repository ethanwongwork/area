# Data-viz modules in products and kits — measured evidence (2026-11-01)

Read-only research. Every value cites a URL or a pinned source file + line. "UNVERIFIED" marks
anything not confirmed from a primary source. Nothing here was measured in a live app (no
area-capture runs); Notion's and Linear's *visual* values remain to be captured.

Pins:
- Tremor (Tremor Raw, MIT): `tremorlabs/tremor@ca4d588f` (2025-10-10), Tailwind `^4.1.3`, Recharts `^2.15.2` (package.json L49, L75).
  Abbrev `T/<File>.tsx:L` = `src/components/<File>/<File>.tsx` at that commit.
- Tailwind theme: `tailwindlabs/tailwindcss@v4.1.3 packages/tailwindcss/theme.css` (abbrev `TW:L`).
- Tremor v3 tokens (KPI blocks): `tremorlabs/tremor-npm@7613bff6 tailwind.config.js`.
- Recharts: `recharts/recharts@v2.15.2`.
- shadcn/ui: `shadcn-ui/ui@c0d63c33` (main, 2026-11-01), abbrev `S/` = `apps/v4/registry/new-york-v4/`.
- Observable Plot: `observablehq/plot@v0.6.17`.

Tailwind v4 lookups used below (TW): radius-xs 2px (L349), sm 4px (L350), md 6px (L351), lg 8px (L352);
shadow-xs `0 1px 2px 0 rgb(0 0 0/.05)` (L359), shadow-md `0 4px 6px -1px rgb(0 0 0/.1), 0 2px 4px -2px rgb(0 0 0/.1)` (L361);
text-xs 12/16 (L299–300), text-sm 14/20 (L301–302); gray-200 `oklch(92.8% .006 264.531)` (L228), gray-500 `oklch(55.1% .027 264.364)` (L231),
gray-800 `oklch(27.8% .033 256.848)` (L234), gray-950 (L236); blue-200 `oklch(88.2% .059 254.128)` (L132), blue-500 `oklch(62.3% .214 259.815)` (L135).

---

## 1. Notion — chart view + table

| Slot | Property | Value | Source |
|---|---|---|---|
| Chart types | types | Vertical bar, Horizontal bar, Line, Donut, Number | notion.com/help/charts |
| Chart types | DSL names | `column|bar|line|donut|number` | Notion MCP `notion://docs/view-dsl-spec` (CHART) |
| X axis | options | "What to show", "Sort by", Visible/Hidden groups (eye icon), "Omit zero values" | notion.com/help/charts |
| Y axis | options | "What to show" (property or "Count"), "Group by" (or None), "Omit zero values", "Cumulative" (only Count/Sum with X sorted ascending) | notion.com/help/charts |
| Aggregate | values | `count|sum|average|min|max|…`, default count | view-dsl-spec |
| Sort | values | `x_ascending|x_descending|y_ascending|y_descending` | view-dsl-spec |
| Stack | option | `STACK BY "Property"` (= Y "Group by") | view-dsl-spec |
| Donut | options | "Each slice represents", "Show value in center", label format choice | notion.com/help/charts |
| Style · Color | palettes | `gray, blue, green, purple, orange, red, auto, colorful` ("Auto" = colours from the table's select options) | view-dsl-spec; xray.tech/post/notion-charts (2024-08-26) |
| Style · Color by value | rule | darker colour for higher value; bar + donut; only when Color ≠ Auto/Colorful | notion.com/help/charts |
| Style · Height | values | `small|medium|large|extra_large` ("Small" to "Extra large"); default Medium = UNVERIFIED (3rd-party guide) | view-dsl-spec; help/charts |
| Style · Grid line | values | horizontal / vertical | help/charts |
| Style · other | toggles | "Axis name" (X, Y), "Data labels" (bar/line), "Smooth line", "Gradient area" (line), "Legend" (line, donut), Caption (DSL `CAPTION`) | help/charts; view-dsl-spec |
| Interaction | hover/click | hover shows labels; click group → drilldown (table view); click legend item hides group; read-only | help/charts |
| Limits | groups | ≤200 groups, ≤50 subgroups; Free plan 1 chart | help/charts |
| Export | | Copy/Download PNG, Download SVG; custom background | help/charts |
| Dashboard view | | widgets: charts, tables, boards, calendars, timelines; global filters | help/charts |
| Table · Calculate | all types | Count all, Count values, Count unique values, Count empty, Count not empty, Percent empty, Percent not empty | notion.com/help/tables |
| Table · Calculate | Number | Sum, Average, Median, Min, Max, Range | notion.com/help/tables |
| Table · Calculate | Date | Earliest date, Latest date, Date range | notion.com/help/tables |
| Table · Calculate | Checkbox | Checked / Unchecked / Percent checked — UNVERIFIED (not on help page) | — |
| Table · columns | | drag headings to reorder; resize by dragging edges; "Wrap text" per property; WIDTH ≥32px; FREEZE COLUMNS n; WRAP CELLS | help/tables; view-dsl-spec |
| Number property | Show as | Number / Bar / Ring, "Divide by" (max), "Show number", colour — 3rd-party only (UNVERIFIED primary) | sparxno.com/blog/notion-number-property; dev.classmethod.jp |
| Property types | header icons | 22 types (Text, Number, Select, Status, Multi-select, Date, Formula, Relation, Rollup, Person, File, Checkbox, URL, Email, Phone, Created/Last edited time/by, Button, ID, Place); each header shows its type icon — icon glyphs UNVERIFIED (capture) | notion.com/help/database-properties |
| Visuals | bar radius, palette hexes, label size, gridline colour | UNVERIFIED — not documented; needs area-capture in Notion | — |

## 2. Tremor (Tremor Raw, Tailwind v4 + Recharts 2.15)

| Slot | Property | Value | Source |
|---|---|---|---|
| Palette | series order | blue, emerald, violet, amber, gray, cyan, pink, lime, fuchsia — all `-500` (bg/stroke/fill/text) | src/utils/chartColors.ts L5–59 |
| Chart frame | height | `h-80` = 320px (Bar/Area/Line); Donut `h-40 w-40` = 160px; Spark `h-12 w-28` = 48×112px | T/BarChart L652; AreaChart L648; LineChart L603; DonutChart L229; SparkChart L87, L198, L283 |
| Gridline | colour / width / dash | `stroke-gray-200 stroke-1 dark:stroke-gray-800`, solid (no dasharray); horizontal only (vertical only in vertical-layout bars) | T/BarChart L678–683; AreaChart L673–674; LineChart L627–628 |
| Axis ticks | font / colour | `text-xs` (12px) `fill-gray-500` both modes; tickLine=false, axisLine=false; X tick `translate(0,6)`, Y tick `translate(-3,0)` | T/BarChart L685–700, L733–751 |
| Axis | Y width / X padding / min tick gap | yAxisWidth 56; X padding 20 left/right; tickGap 5 | T/BarChart L571, L594–595, L583 |
| Axis title | style | `fill-gray-800 text-sm font-medium dark:fill-gray-200` | T/BarChart L727, L775 |
| Bar | radius | none — plain `<rect>` | T/BarChart L74–87 |
| Bar | category gap / bar gap | Recharts defaults `barCategoryGap '10%'`, `barGap 4` (Tremor passes undefined) | recharts src/chart/generateCategoricalChart.tsx L1117–1118; T/BarChart L582, L676 |
| Bar | types | default / stacked / percent (`stackOffset expand`), layout horizontal / vertical | T/BarChart L553, L586–587, L674 |
| Bar | inactive | other bars `opacity 0.3` when one bar/legend is active | T/BarChart L80–86 |
| Bar | hover cursor | `fill #d1d5db, opacity 0.15` band | T/BarChart L785 |
| Line/Area | stroke | `strokeWidth 2`, round join + cap, `type="linear"` (straight, not smoothed) | T/AreaChart L942–947; LineChart L864–867 |
| Area | fill | default `gradient`: stop 5% opacity 0.3 → 95% opacity 0; inactive 0.1; `solid` 0.3; `none` 0 | T/AreaChart L570–589, default L534 (`fill = "gradient"`) |
| Line/Area | dots | none at rest; active dot r=5, `stroke-white dark:stroke-gray-950`, stroke width = line's (2) | T/AreaChart L859–889 |
| Line/Area | hover cursor | vertical rule `stroke #d1d5db, strokeWidth 1` | T/AreaChart L749; LineChart L701 |
| Line/Area | click target | hidden 12px line per series | T/AreaChart L956–971; LineChart L888 |
| Tooltip | box | `rounded-md` (6px) `border` gray-200/800 `bg-white dark:bg-gray-950` `text-sm shadow-md` | T/BarChart L452–460 |
| Tooltip | header | `border-b px-4 py-2` (16/8), label `font-medium text-gray-900` | T/BarChart L462–471 |
| Tooltip | rows | `space-y-1 px-4 py-2`; row `space-x-8`; marker `size-2 rounded-xs` (8px, 2px) for bars; `h-[3px] w-3.5 rounded-full` (3×14 line) for line/area; name `text-gray-700`; value `font-medium tabular-nums text-gray-900` right-aligned | T/BarChart L474–507; AreaChart L425 |
| Tooltip | position / anim | pinned to top (`y: 0`), offset 20, animation 100ms | T/BarChart L781–790; AreaChart L745–751 |
| Legend | item | `gap-1.5 rounded-sm px-2 py-1`, text `text-xs text-gray-700`; hover bg gray-100 when clickable; inactive opacity 40% | T/BarChart L108–139 |
| Legend | marker | bars `size-2 rounded-xs` (8px sq, 2px); line/area `h-[3px] w-3.5 rounded-full` | T/BarChart L121–124; AreaChart L66 |
| Legend | position | top, align right by default (`legendPosition "right"`); slider with 20px (`size-5`) scroll buttons | T/BarChart L588, L835, L180 |
| Donut | geometry | inner radius 75% (donut) / 0% (pie), outer 100%, start 90° → −270° (clockwise from 12 o'clock); slice separator `stroke-white dark:stroke-gray-950`; inactive slices opacity 0.3 | T/DonutChart L256–269, L141 |
| Donut | centre label | `fill-gray-700` (off by default, `showLabel=false`) | T/DonutChart L182, L245–254 |
| Spark charts | margin / stroke / fill | margin 1px each side; strokeWidth 2; Spark area gradient 5% 0.4 → 95% 0 (solid 0.3) | T/SparkChart L94–99, L144, L229, L73–80 |
| BarList | row | height `h-8` (32px), gap `space-y-1.5` (6px), radius `rounded-sm` (4px) | T/BarList L53, L63, L72, L87 |
| BarList | fill | `bg-blue-200 dark:bg-blue-900`; hover `blue-300 / blue-800`; min width 2% when > 0 | T/BarList L90–93, L49 |
| BarList | text | label inside bar `left-2` (8px) `text-sm text-gray-900` truncate; value right column `text-sm`, `space-x-6` (24px) gap; sorted descending by default | T/BarList L102, L108–129, L152, L58, L30 |
| CategoryBar | bar | `h-2` (8px) `rounded-full`, segment gap `gap-0.5` (2px) | T/CategoryBar L158–159 |
| CategoryBar | labels | `h-5 text-sm font-medium tabular-nums text-gray-700`, cumulative boundary values, hidden when segment <10% | T/CategoryBar L65–97, L74–79 |
| CategoryBar | marker | `h-4 w-1 rounded-full ring-2` | T/CategoryBar L196, L210 |
| Tracker | strip | `h-8` (32px), blocks flex to fill width | T/Tracker L86 |
| Tracker | block | gap `px-[0.5px]` (1px total), `sm:px-px` (2px total); block radius 1px; outer ends 4px | T/Tracker L32–35 |
| Tracker | default / hover | `bg-gray-400`; optional hover opacity 50% | T/Tracker L76, L37 |
| Tracker | tooltip | `rounded-md px-2 py-1 text-sm shadow-md`, inverted (`bg-gray-900 text-white`), sideOffset 10, open/close delay 0 | T/Tracker L27–55 |
| ProgressCircle | geometry | radius 32 (64px), strokeWidth 6, round caps; track `-200` tint, arc `-500` | T/ProgressCircle L58–59, L101, L114, L16–33 |
| ProgressBar | bar | `h-2` (8px) `rounded-full`, track `-200` / arc `-500` | T/ProgressBar L79, L85, L20–33 |
| Card | shell | `rounded-lg` (8px) `border p-6` (24px) `shadow-xs`, border gray-200 | T/Card L20–24 |
| Table | cells | header `px-4 py-3.5 text-sm font-semibold text-gray-900`; cell `p-4 text-sm text-gray-600`; rows `divide-y` gray-200; footer `border-t font-medium`; caption `mt-3 text-sm text-gray-500` | T/Table L65–67, L122–124, L86–88, L142, L164 |
| KPI card (v3 blocks) | label / value | label `text-tremor-default` 14/20 `font-medium` muted; value `text-tremor-metric` 30/36 `font-semibold` strong | blocks.tremor.so/blocks/kpi-cards; tremor-npm tailwind.config.js L90–93 |
| KPI card | delta | text: `text-emerald-700` / `text-red-700`; badge: `bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-600/10 rounded-tremor-small (6px) px-2 py-1 text-tremor-label (12/16)` | blocks.tremor.so/blocks/kpi-cards; tremor-npm config L85, L90 |
| KPI card | sparkline | `SparkAreaChart mt-4 h-10 w-full`, no gradient, emerald/red by direction; ProgressCircle radius 25, strokeWidth 5 | blocks.tremor.so/blocks/kpi-cards |

## 3. shadcn/ui charts (Recharts)

| Slot | Property | Value | Source |
|---|---|---|---|
| ChartContainer | frame | `aspect-video` default, `text-xs`; tick text `fill-muted-foreground`; grid lines `stroke-border/50` (50% of border); cursor line `stroke-border`; bar cursor `fill-muted`; dots' white stroke → transparent | S/ui/chart.tsx L66–67 |
| Tooltip | box | `min-w-[8rem]` (128px) `gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl` (10/6 padding) | S/ui/chart.tsx L192–193 |
| Tooltip | indicator | `indicator="dot"` default: `h-2.5 w-2.5` (10px) `rounded-[2px]`; `line`: `w-1` (4px) full-height bar; `dashed`: `w-0 border-[1.5px] border-dashed`; `hideLabel`, `hideIndicator` | S/ui/chart.tsx L122–136, L223–230 |
| Tooltip | values | label `font-medium`; name `text-muted-foreground`; value `font-mono font-medium tabular-nums text-foreground` | S/ui/chart.tsx L163, L250–255 |
| Legend | layout | `flex items-center justify-center gap-4`, `pt-3` (bottom) / `pb-3` (top); item `gap-1.5`, swatch `h-2 w-2 rounded-[2px]` (8px, 2px) or 12px icon | S/ui/chart.tsx L292–319 |
| Theming | per-series | config `{ color }` or `{ theme: { light, dark } }` → `--color-<key>` | S/ui/chart.tsx L9, L21, L95 |
| Palette (current neutral theme) | chart-1…5 | `oklch(0.87 0 0)`, `oklch(0.556 0 0)`, `oklch(0.439 0 0)`, `oklch(0.371 0 0)`, `oklch(0.269 0 0)` — same in light and dark (greyscale ramp) | apps/v4/registry/themes.ts L28–32, L62–66 |
| Palette (docs site) | chart-1…5 | blue-300, blue-500, blue-600, blue-700, blue-800, light = dark (single-hue ramp) | apps/v4/app/globals.css L120–124, L163–167 |
| Palette (legacy HSL, neutral.json) | light | `12 76% 61%`, `173 58% 39%`, `197 37% 24%`, `43 74% 66%`, `27 87% 67%` | apps/v4/public/r/themes/neutral.json |
| Palette (legacy HSL) | dark | `220 70% 50%`, `160 60% 45%`, `30 80% 55%`, `280 65% 60%`, `340 75% 55%` | same |
| Bar (default block) | radius | `radius={8}` | S/charts/chart-bar-default.tsx L61 |
| Bar (multiple) | radius | `radius={4}`, tooltip `indicator="dashed"` | S/charts/chart-bar-multiple.tsx L63–66 |
| Bar (horizontal) | radius | `radius={5}`, X hidden, Y category ticks | S/charts/chart-bar-horizontal.tsx L56–69 |
| Bar (stacked) | radius | bottom `[0,0,4,4]`, top `[4,4,0,0]` (only outer ends round) | S/charts/chart-bar-stacked.tsx L65–75 |
| Axes | ticks | `tickLine={false} axisLine={false}`, `tickMargin` 10 (bars) / 8 (area, line); month ticks `slice(0,3)`; interactive area `minTickGap 32` | chart-bar-default L50–55; chart-area-default L59–64; chart-area-interactive L218–223 |
| Grid | | `CartesianGrid vertical={false}` (horizontal only), Recharts default solid | chart-bar-default L49 |
| Line | | `type="natural"` (smoothed), `strokeWidth={2}`, `dot={false}` | chart-line-default L68–73 |
| Area | | `type="natural"`, `fillOpacity 0.4`; gradient variant stops 5% 0.8 → 95% 0.1 | chart-area-default L70–74; chart-area-gradient L73–93 |
| Tooltip | cursor | `cursor={false}` in most blocks; area uses `indicator="line"` | chart-area-default L66–68 |
| Donut | | `innerRadius 60`, frame `aspect-square max-h-[250px]`; text variant `strokeWidth 5`, centre value `text-3xl font-bold fill-foreground` + caption `fill-muted-foreground` | chart-pie-donut L67–78; chart-pie-donut-text L72–106 |
| Interactive area | frame | `aspect-auto h-[250px] w-full` | chart-area-interactive L188 |
| Radial | | `innerRadius 30 outerRadius 110` | chart-radial-simple L69 |
| Card footer | | trend line "Trending up by 5.2% this month" + muted caption | chart-radial-simple L78–82 |

## 4. Linear, Vercel, Stripe

| Product | Slot | Property | Value | Source |
|---|---|---|---|---|
| Linear Insights | forms | | Bar (Issue count, Effort), Scatterplot (Cycle/Lead/Triage time, Issue age), Burn-up (cumulative flow; monthly default, weekly option), Table under the graph | linear.app/docs/insights |
| Linear Insights | axes | | Measure (y), Slice (x), Segment (colour) | linear.app/docs/insights |
| Linear Insights | hover | | bar hover → values + percentile breakdown; hover highlights matching table rows and vice-versa (linked chart ↔ table) | linear.app/docs/insights |
| Linear Insights | click | | click bar/segment filters the issue view; click point opens issue | linear.app/docs/insights |
| Linear Insights | percentiles | | scatter markers 25/50/75/95%; click a marker zooms y | linear.app/docs/insights |
| Linear Dashboards | modules | | insight "displayed as a chart, table, or metric block"; dashboard + per-insight filters; click slice/metric → filtered issues | linear.app/docs/dashboards |
| Linear | visuals/palette | | UNVERIFIED — not documented | — |
| Vercel Geist | Gauge | | sizes `tiny/small/medium/large`; `showValue`; colours as stop map `'0'..'100'` → `var(--ds-*)` or `{primary, secondary}` (e.g. blue-700 / blue-300); `arcPriority="equal"`; `role="progressbar"`; product thresholds ≥80% warning, ≥95% error | vercel.com/geist/gauge |
| Vercel Geist | Table | | variants striped / bordered / interactive / virtualized, `TableFooter` subtotal row; `tabular-nums` on numeric columns; unknown → `—`; Title Case noun headers; relative time `2m ago` → date after 7 days; `21–40 of 142` | vercel.com/geist/table |
| Vercel Geist | Chart | | no chart page found (/geist/chart falls back to overview) | vercel.com/geist/chart |
| Vercel Web Analytics | panels | | Pages / Routes / Hostnames (tab pills), right column header "VISITORS" uppercase; panels Referrers, UTM, Country, Browsers, Devices, OS; rows filter on click; CSV export ≤250 | vercel.com/docs/analytics/using-web-analytics (+ panel image) |
| Vercel Monitoring | hover | | hover shows aggregated values for the point in time; chart type line or bar | vercel.com/docs/query/monitoring |
| Stripe Apps | chart choice | | Line = trend (zooms y), Bar = totals from zero, MeterChart = breakdown in one horizontal bar, SparkLine = no axes/labels next to a KPI | docs.stripe.com/stripe-apps/patterns/chart-layout |
| Stripe Apps | heights | | 180px in an overview module ("matches the chart area in standard Dashboard metric cards"); 320px featured; sparkline 24×80 in example | same |
| Stripe Apps | layout | | ≤3 charts per row (unreadable below ~200px wide); 1/2, 1/3, 2/3+1/3; related charts share height; caption label above each | same |
| Stripe Apps | KPI | | caption label (secondary) → value (subtitle, bold) → sparkline / chart; "show the current value above the chart" | same |
| Stripe Apps | states | | loading / error / empty / populated in one fixed-height box (same 180px) | same |
| Stripe Apps | LineChart data | | variants by data: multi-series by `name`; `period actual|forecast` (forecast dashed); `status incomplete` (annotated region); `compare current|previous` overlay | docs.stripe.com/stripe-apps/components/linechart.md?app-sdk-version=9Next |
| Stripe Dashboard | palette/sizes | | UNVERIFIED — not documented | — |

## 5. Observable Plot (axis/label rules)

| Slot | Property | Value | Source |
|---|---|---|---|
| Axis label | arrow | label from a quantitative channel gets a direction arrow (`↑ Label`, `Label →`) unless ordinal | plot src/marks/axis.js L722–745 |
| Tick spacing | | ~80px between x ticks, ~35px between y ticks | axis.js L561 |
| Ticks | numerals | `tabular-nums` for non-ordinal scales | axis.js L716–717 |
| Grid | | `currentColor` at opacity 0.1, width 1 | axis.js L504–512 |
| Ticks | size | y tickSize 6, x 0 (per axis k) | axis.js L79, L183 |
| Font | | 10px | src/plot.js L255 |

Datawrapper: not researched (no added rule beyond Plot's).

---

## Modules seen in ≥2 products (ranked by spread)

1. **Line / area with crosshair tooltip** — Tremor, shadcn, Stripe, Vercel, Notion (line + "Gradient area", "Smooth line"). Shared: 2px stroke, no dots at rest, active dot on hover, horizontal gridlines only, no axis lines/tick marks, 12px muted ticks, tooltip = label header + rows (swatch · name · tabular value). Fill is a faint gradient (Tremor 0.3→0, shadcn 0.4 flat or 0.8→0.1). Smoothing splits: Tremor linear, shadcn `natural`, Notion a toggle.
2. **Bar (vertical / horizontal, stacked, percent)** — Tremor, shadcn, Notion, Linear, Stripe, Vercel. Shared: start at zero, horizontal gridlines only, clicking a bar filters or drills down (Tremor, Notion, Linear), others dim (Tremor 0.3). Radius splits: Tremor 0, shadcn 4–8, stacked bars round only the outer ends.
3. **KPI tile (label → value → delta → sparkline)** — Tremor blocks, Stripe, shadcn card footer, Linear "metric block", Notion "Number" chart. Shared order: muted 12–14px label, large semibold value (Tremor 30/36), green/red delta (text or tinted badge), sparkline below (Tremor h-10 full width; Stripe 24×80).
4. **Data table linked to the chart** — Linear (hover row ↔ point), Notion (drilldown = table; Calculate footer), Tremor Table, Geist Table, Vercel panels. Shared: tabular numbers, right-aligned values, footer row for totals or calculations, em dash for missing values.
5. **Bar list (ranked label + value, bar behind the label)** — Tremor BarList, Vercel Analytics panels (Pages/Referrers…, uppercase column header), Notion horizontal bar. Shared: sorted descending, label inside a light bar, value right-aligned, row is clickable to filter. Tremor: 32px rows, 6px gap, 4px radius, blue-200 fill.
6. **Donut / pie with centre value** — Tremor, shadcn, Notion ("Show value in center"). Shared: thin ring (Tremor inner 75%), slices separated by a background-coloured stroke, centre number with a caption.
7. **Category / meter bar (one bar split into parts)** — Tremor CategoryBar, Stripe MeterChart, Geist Gauge/Capacity-like. Shared: 8px rounded track, small 2px gaps, legend or boundary labels.
8. **Progress ring / gauge** — Tremor ProgressCircle (r32, stroke 6, track -200 / arc -500), Geist Gauge (threshold colours), Notion number "Ring" (3rd-party sourced).
9. **Tracker / uptime strip** — Tremor Tracker only among those checked (32px high, 1–2px gaps, 1px block radius, 4px outer ends, inverted tooltip). Seen in 1 source here: does not meet the ≥2 bar.
10. **Heatmap calendar** — not found in any source checked.

Shared palette direction: light single-hue ramps are now the default in shadcn (greyscale chart-1..5, docs site blue-300→800); Notion offers single-hue palettes (gray/blue/green/purple/orange/red) plus "Colorful" and "Auto"; Tremor stays multi-hue at -500 but uses -200 tints for BarList fills and progress tracks.
