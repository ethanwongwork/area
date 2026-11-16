# Chart spec

**Captures:** none taken; the evidence is the components audit's reads in `docs/research/components-audit-2026-11-07/`
(notion.md "Chart", chat-apps.md "Chart" and "Chart roles", primer.md "Chart card") and the data views exploration,
`docs/research/data-views-2026-11-01/` (README rounds 1–19, the owner's picks for marks, strokes, type and colours), whose
modules the app draws in `apps/desktop/src/data-views.tsx`
**Peers:** Meter (one value or parts of one measure), Table (the table view), Tooltip (the tooltip's paint), Skeleton
(loading), Card and CardValue (the number's figure), Badge (the change), Segmented / legend toggles (pressed state), the
data views kit (the marks' system)

## Owner decisions

- 2026-11-01 – 11-02: data views rounds 1–19 (docs/research/data-views-2026-11-01/README.md): flat marks with no edge,
  marks 2 apart, corner min(4, side / 4) at the value end, 1px strokes (grid, rule, guide dashed 2 2), labels 11/14 in the UI sans
  muted and tabular, plots 192 tall, the series colours as palette steps, status never a series.
- 2026-11-07: components audit, "Take all recs": N7 Chart is built (review page St7jcEipvPoa3GvSwnAvBT).

## Job and boundaries

Chart plots rows of data so their shape reads at a glance: vertical bars (grouped, or stacked), lines, areas (overlapping
washes, or stacked bands) and a donut of parts of a whole; ChartNumber shows one figure with its change against a period.
Every kind takes the same rows (`data`, `series`, `x`), the same legend (each series a toggle), the same tooltip (Area's
Tooltip, reached by the pointer and by the arrow keys) and the same table of the data (always there for assistive tech,
and in the plot's place with `tableToggle`). It is not Meter, which places one value against its range or splits one
measure into parts; not Progress, which is a task moving; not Table, which is for reading exact values (a Chart's table
view is a Table). It does not aggregate, filter or fetch data, zoom or pan, brush a range, draw horizontal bars, scatter,
heat maps, reference guides or annotations (the data views kit composes those in the app).

**One component with `kind`, not BarChart / LineChart.** Governance § 4 asks for one name per concept and axes over
families. The kinds share every prop, part and behaviour; only the marks differ, and a notes app's chart view switches
kind over the same data (notion.md: one Chart view, type bar / line / donut / number). `kind` is the family's own axis
("per component", as Mention's). The number has no axes, series or legend, so it is its own export, ChartNumber, on the
same block (`area-chart--number`), so the family keeps one manifest and one page.

Intake gates:

- **Useful.** A notes app's chart views: bar (bars 14 wide, top corners 2), line (1.25 stroke, gradient area 10% → 0),
  donut (a centre value over a label), number, with grid lines, legend and colour options (notion.md, Chart). A chat app's
  charts: `ChartContainer{data, series, x, y, interactive, tableView, summary}`, BarChart, ChartLegend, a legend that
  toggles series (`._LegendToggle`, `._LegendItem[data-d-hidden]`), a chart tooltip with a row per series
  (`._ChartTooltip`, `._TooltipSeriesRow`) (chat-apps.md). A code-hosting design system's Chart card, an accessible chart
  in a card with "View as table" (primer.md; data views github-primer.md). The app draws charts today in the analytics
  example and the data views kit.
- **Unique.** Meter draws one bar; Table draws no marks; nothing else plots x against y.
- **Composable.** Tooltip for the tooltip, Table for the table view and the hidden table, Skeleton (with `delay`) for
  loading, Button for the table toggle, Badge for the change, `announce()` for what the keys reach, the series tokens for
  colour, the Dividers group and divider roles for lines.
- **Consistent.** Its marks, strokes, type and gaps are the data views kit's (owner rounds 1–19); its labels are the data
  label style (`area-type-usage`: text-xs, the UI sans, tabular, muted); its colours are the series in their order.
- **Worth maintaining.** Two states (`active`, `loading`), a keyboard contract (Tab, arrows, Home, End, Escape), the legend
  toggles, the table, empty and loading, tested in `chart.test.mjs`. Not built (above), and written down in the
  Documentation entry.

## Variants

| Axis | Value | Justification | Where it appears (source / product) |
|---|---|---|---|
| kind | bar (default) | Values compared across categories or days, from zero | Notion bar chart; chat app BarChart; data views m3 Columns |
| kind | line | A trend over x | Notion line chart (People template); chat app charts |
| kind | area | A trend with its volume; stacked, the parts of a total over time | Notion's gradient area; data views m2 Daily usage (stacked) |
| kind | donut | Parts of a whole with the total in the middle | Notion donut (OKR template); chat app PieChart; data views m9 Share ring |
| kind | number | One figure with its change | Notion number chart; data views m1 Stat tiles; the analytics example's KPI cards |
| size | sm, md (default), lg | The plot's height: 128, 192, 256 (a donut 128, 160, 192 across) | Notion's heights Small – Extra large; the code-hosting product's 128 / 256 / 320; the kit's 192 |
| stacked | boolean | Bars and areas add up instead of grouping or overlapping | Notion's stacked bars; data views m2 |

Excluded: horizontal bars (the data views kit's data bars and Meter cover ranked lists; a later `orientation`), scatter
and heat maps (one source each), smooth lines (a notes app's option; Area draws straight segments between measured
points), data labels on every mark and colour by value (options seen once), sparkline size (the stat tiles draw 30
columns in 32; a later `size="xs"` if asked).

## Anatomy

```
root          div.area-chart                  owns: kind, size (--_chart-height), stacked; grid, 12 between plot and legend
  plot        div.area-chart__plot            owns: the plot's box (height), one tab stop, role="group", label; data label font
    svg       svg.area-chart__svg             owns: the drawing at the box's measured width and height (never scaled)
      grid    line.area-chart__grid           a gridline at a round value: 1px, edge-dividers, crisp
      baseline line.area-chart__baseline      the line at zero: 1px, border-divider
      tick    text.area-chart__tick           y labels in the gutter (8 from the plot), x labels 4 under it
      band    rect.area-chart__band           the hovered bar band: bg-hover
      mark    path.area-chart__mark           a bar or a donut part: the series fill, corner min(4, side / 4) at the value end
      wash    path.area-chart__wash           an area: a 24% → 0 wash of the fill; stacked, the flat fill
      part    path.area-chart__part           the 1.5 line in the ground that parts stacked areas
      line    path.area-chart__line           a series' line: 1.5, the series mark, round caps and joins
      guide   line.area-chart__guide          the hovered x on a line or area: 1px dashed 2 2, the guide grey
      dot     circle.area-chart__dot          a point at the hovered x: r 4, a 2 ring in the ground
      center  text.area-chart__center         the donut's total: title-sm, 500
      center-label text                       what it counts: the data label style
    tooltip   div.area-tooltip.area-chart__tooltip   Area's Tooltip: title, then a row per series (key 8, name, value)
  table       div.area-chart__table           Area's Table in the plot's place (view="table"); else a hidden one (.area-sr-only)
  empty       div.area-chart__empty           emptyText in the plot's place
  legend      div.area-chart__legend          16 between items, 4 between rows
    legend-item button[aria-pressed]          key 8 (corner 2), 8 to its label; text-xs muted
    view      Button ghost sm (selected)      "Show table", at the legend's end
number        div.area-chart.area-chart--number  4 between parts
  label       div                             text-base, fg-muted
  figure      div                             CardValue's style: title-lg, regular, tabular
  change      div                             a soft Badge (arrow + change), then the note; 8 apart
    note      span                            text-xs, sans, muted, tabular
```

Inset equations: the plot has none; the drawing reserves a gutter of max(40, the longest tick label + 8) at the start, 8
at the top (half a label line clears the top tick), and 4 + one label line (14 at type 13) at the bottom.

## Decisions

| Slot · property | Area value | Basis | Reason when it differs from the basis |
|---|---|---|---|
| Plot height | sm 128, md 192, lg 256 | Kit plots 192 (data-views.tsx); GitHub 128 / 256 / 320 (data views README) | — |
| Donut | 128 / 160 / 192 across, 12 / 14 / 16 thick, 2 apart at the joins | Kit ring 160, 14 thick, 2 gaps | sm and lg derived a 32 step either side, the ring's thickness kept near the kit's ratio |
| Bar gap | 2 between bars in a group; 20% of the band between groups | Kit: marks 2 apart (round 4) | The kit's 30 columns fill the band less 2; with few categories that made slabs, so groups keep a fifth of the band (derived) |
| Bar corner | min(4, width / 4, height / 4), value end only; stacked: the outermost part only, parts 2 apart | Kit round 18 (corner), round 8 (round only at the value end) | — |
| Line | 1.5, the series mark (`--area-series-<n>`), round caps and joins | Notion 1.25; references 2 (Tremor, shadcn, GitHub); kit round 5 "lines 1px" | The kit's 1px was its rules and guides; a data line equal to the gridlines loses the hierarchy, so 1.5 (open for the owner) |
| Area wash | the fill at 24% at the top to 0 at the baseline | Notion 10% → 0; references 25–30% → 0 | Between the two: 10% vanished on the kit's light series (derived) |
| Stacked area | flat fills, parted by a 1.5 line in the ground; no lines | Kit m2 (round 2, round 7) | — |
| Point | r 4, 2 ring in the ground, only at the hovered x | Cursor dots r 5, ring 2 (data views README); "no dots until hover" (Tremor, shadcn, GitHub, Stripe) | One step smaller beside a 1.5 line |
| Gridlines | 1px `--area-edge-dividers`, horizontal only; baseline `--area-border-divider` | Kit: grid decorative, baseline divider; "horizontal only, no y-axis line, one baseline" (round 1) | Gridlines take the Dividers stroke group (the 2026-10-30 rule for every divider) |
| Guide | 1px dashed 2 2, the muted ink at 45% over the ground | Kit round 6 | — |
| Labels | text-xs (11/14 at type 13), the UI sans, tabular, fg-muted (owner, 2026-11-11, plan A9.11; was Geist Mono); y labels 8 from the plot, x labels 4 under | Kit (round 3, round 9); area-type-usage "a data label" | — |
| Ticks | about one per 48 of height, at round steps (1, 2, 2.5, 5 × 10ⁿ) from zero | Kit `ticksFor` (4 on 192) | — |
| X labels | bars: every category that fits (label + 16), else every second, third…; lines: about one per 96, the ends always | Kit `tickIdx` (one per 96) | Categories are each a name worth reading, so bars show them all where they fit |
| Legend | key 8 square, corner 2, 8 to its words; items 16 apart, 4 between rows; text-xs, fg-muted; 12 under the plot | Kit legend (round 9: blocks 12 apart) | Words in the sans (area-type-usage: numbers in mono, words in Geist) |
| Hidden series | the key empties to the trough with the control edge, the words struck through; at least one stays | Chat app `._LegendItem[data-d-hidden]`; kit (opacity 0.4, one stays) | Opacity took the words under 4.5:1; the strike and the empty key say "off" at full contrast |
| Tooltip | Area's Tooltip (inverse ground), the x in 500, then rows: key 8, name, value tabular, 8 apart (16 before the value) | Cursor chat tooltip (context, labels, values 500 tabular, 16 between label and value); the kit used `.area-tooltip` | The value stays regular: the tooltip's one strong line is its title |
| Tooltip place | beside the x, 12 off, on the side with more room (a donut: outside its ring), held inside the plot's box; top at the plot's top | Tremor's crosshair tooltip | — |
| Colours | series n by place (1–8, cycling): `-fill` for bars, areas, keys, donut parts; the mark `--area-series-<n>` for lines; `color` overrides | DESIGN_SYSTEM.md data colours | — |
| Donut total | title-sm with its tracking, 400, sans, tabular (plan A9.11; was 500 mono); its label under it in the data label style | Kit `.studio-data__total` (title-sm mono 500); Notion 42.6/600 over 12 | — |
| Number | label text-base muted; figure title-lg regular tabular (CardValue); change a soft Badge with an up / down arrow, note text-xs sans muted; 4 between parts, 8 in the change row | Kit stat tile (CardValue, Badge soft, note in the label style) | — |
| Empty | `emptyText` "No values yet", fg-muted, centred in the plot's height | WRITING.md (name what is missing) | — |
| Loading | Skeleton block filling the plot's box, with `delay`; root `aria-busy` | Skeleton `delay` (V6); Table's loading | — |

## States

| State | Slot · property changes | Evidence |
|---|---|---|
| active (`data-active`) | bars: the band's plate (bg-hover); lines and areas: the guide and a point per series; donut: the part a step deeper (80% toward the ink); the tooltip shows | Chat app tooltip; kit hover titles |
| loading (`aria-busy="true"`; `busy` a deprecated alias) | a Skeleton in the plot's place; no legend, no table | Table `loading` |
| hidden series (`aria-pressed="false"` on its toggle) | its marks leave the plot (the scale follows the shown ones); the table keeps every series | Chat app `data-d-hidden` |
| table view | Area's Table (size sm) in the plot's place; the legend's toggles leave; the toggle is selected | Chat app `tableView`; GitHub "View as table" |

**State hooks (manifest).** The pending state is `loading` (GOVERNANCE § 4's word), on `aria-busy` (`stateAttributes`; `chart.css` gives the plot the progress cursor). `busy`, its first name, stays a deprecated alias of `loading` with the same hook for one release.

## Behavior and accessibility

- The plot is a `div` with `tabIndex=0`, `role="group"`, named by `label` and described by `keysHint` ("Left and Right
  move between values"). The SVG is `aria-hidden`; a visually hidden Area Table of every row and series (caption by
  `aria-label` = `label`) follows it, so a screen reader reads the data as a table. The donut's table adds the share.
- Keys on the plot: Right / Down next value, Left / Up previous, Home / End first / last, Escape hides the tooltip.
  Each move says the value through `announce()` ("Nov 4: Item one 22, Item two 12"); the tooltip is `aria-hidden`.
  Focus by keyboard shows the first value; a click focuses without showing one. Blur and pointer leave hide it.
- Legend items are `button`s with `aria-pressed` (true while shown). The last one shown stays (its press does nothing).
- The table toggle is Button's toggle (`selected`, `aria-pressed`), "Show table" (`tableLabel`).
- Every default string is a prop: `tableLabel`, `shareLabel`, `keysHint`, `emptyText`, ChartNumber's `directionLabel`
  ("Up" / "Down", said before the change).
- Responsive: a ResizeObserver redraws at the box's width and height; the axis gutter reads the computed label font, so
  type 12–16 widen it. Server rendering draws at 480 × the size's height and the first layout pass redraws before paint.
- Reduced motion: nothing moves (no draw-in, no transition), so there is nothing to stop; the Skeleton keeps its own row.
- Forced colours: marks and lines in CanvasText, gridlines GrayText, the active band Highlight, keys CanvasText (a hidden
  key a Canvas square with a CanvasText edge). Series are then told apart by the legend order, the tooltip and the table.
- RTL: the plot is drawn left to right (time and categories keep their order, as the references do); the legend and the
  number follow the writing direction.
- Not implemented: touch-specific gestures (a tap acts as a pointer move), negative values in stacked areas (clamped to
  zero), per-point announcements of a stacked total, horizontal bars, zoom, brushing, annotations and reference lines.

## Sources

| Id | Type | What | Link / commit / path | License | Captures |
|---|---|---|---|---|---|
| notion | target product | Chart views: bar, line, donut, number; heights; options | notion.md (OKR and People templates; notion.com/help/charts) | n/a (evidence only) | none |
| chat | target product | ChartContainer, BarChart, legend toggles, chart tooltip, table view, chart roles | chat-apps.md (`cd138888b-BqrOUgcY.js`, `media-6c19f088ad34.css`) | n/a (evidence only) | none |
| primer | design system | Chart card, "View as table" | primer.md; data views github-primer.md | MIT | none |
| kit | Area | The data views modules and their system | `apps/desktop/src/data-views.tsx`, `styles/data.css`; data views README rounds 1–19 | — | the data views review page |
| cursor | product | Chart tooltip and dot values | data views README, "Cursor" table (app bundle) | n/a (evidence only) | none |

Target products searched without an equivalent: Figma (no chart component in its UI; FigJam's charts are widgets).

## Measurements

None taken for this build: the values above are the research files' measured and the owner's picked values. A side by
side capture against a notes app's chart view is still to do.

## Peers and consistency

| Peer | Shared role | Area value in peer | This component | Match / reason |
|---|---|---|---|---|
| Data views kit | marks, strokes, labels | 2 gaps, corner min(4, side / 4), 1px rules, text-xs mono | the same | Match (gridlines on the Dividers group, see Decisions) |
| Tooltip | annotation paint | inverse ground, ui type, its insets | the same surface, stacked rows | Match |
| Table | the table view | size sm, numeric cells | Table itself | Match |
| CardValue | a widget's figure | title-lg regular tabular | ChartNumber's figure | Match |
| Meter | series colours | Meter's stacked parts take the series in order | the same order | Match |

## Visual pass

Seen in the built app (apps/desktop/dist served on 4410, the browser pane, 2026-11-08) at type 13, light and dark: every
tile; hover tooltips on bars, the line and the donut; the arrow keys on the line (guide, points, tooltip). Fixed during the
pass: x labels on 7 bars collided (bars now label every n-th category that fits), the donut tooltip covered the total (now
outside the ring, held inside the plot's box), the table toggle had no pressed paint (now Button's `selected`). Not yet
seen: type 12 and 16, Compact and Comfortable density, contrast More, a side by side against the references.

## Verification

`node --test packages/react/tests/chart.test.mjs` (10 tests: markup per kind, axes and ticks, stacked geometry, the legend,
the tables, loading and empty, ChartNumber, the paint rules and no motion), cohesion, the full React suite, the build,
typecheck and the app's checks. Keyboard and pointer behaviour checked by hand in the app; there is no DOM test runner in
the repository.

## Review note, 2026-11-07

- **What changed:** Chart is new: bar, line, area and donut over one data API, a legend that hides series, a tooltip the
  keys reach, a table of the data, and ChartNumber.
- **Why:** the components audit's N7, with the product evidence the candidate lacked (owner: "Take all recs").

## Feedback log

- 2026-11-07 · components audit N7 → built (In review); the analytics example's hand-drawn chart is not swapped (it
  plots a 10–30 range with a dashed previous period in the accent; Chart plots from zero in the series colours), so the
  swap waits for the owner.
- 2026-11-11 · system evaluation F5 · the manifest's `busy` state is `loading`, GOVERNANCE § 4's word, on the same `aria-busy`; `busy` kept as a deprecated alias for one release; no paint changed.

## Review note, 2026-11-11 (type rules, plan A9)

- **What changed:** one figure role (owner, 2026-11-11, plan A9.11, "sans tabular ticks and centre"): ticks, the legend and the number's note take the UI sans at `text-xs`, tabular, muted (they were Geist Mono); the donut's centre is sans 400 tabular at `title-sm` with its tracking (it was 500 mono without it). The number's figure stays `title-lg` 400 tabular.
- **Why:** the system evaluation's type rules (docs/research/system-evaluation-2026-11-11, section 5, A9), owner-approved
  2026-11-11; the rules are in DESIGN_SYSTEM.md ("Ink and weight", "Size and shape", "Text pairs") and the type skill.

### 2026-11-14 · Shared parts, leftovers (system plan, Phase 2, wave 3)

- Body blocks are `gap-row` apart (8 / 12 / 16); the tooltip row's columns, the value's start, a legend item's swatch gap and the change row's gap are `ui-cluster` (6 / 8 / 10); legend items are `2 × ui-cluster` apart (12 / 16 / 20). Values at type 13 Compact / Default / Comfortable; unchanged at the default.
- Why: docs/research/system-evaluation-2026-11-11 (plan B6.1, B6.5, B8.2, B2.2; README §5, phase2/leftovers.md); the owner took every recommendation on 2026-11-11. Fix the rule, not the instance.
- Verdict: awaiting the owner.
