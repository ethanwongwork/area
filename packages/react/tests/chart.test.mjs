import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { readFileSync } from "node:fs";
import { Chart, ChartNumber, chartTicks, MANIFESTS } from "../dist/modules/index.js";

// Chart (components audit N7, 2026-11-07; docs/specs/chart.md).
const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, " "), body }));
const ruleFor = selector => rules.filter(rule => rule.selector === selector).map(rule => rule.body).join(";");

const data = [{ month: "Jan", a: 12, b: 8 }, { month: "Feb", a: 18, b: 11 }, { month: "Mar", a: 15, b: 14 }];
const series = [{ key: "a", label: "Item one" }, { key: "b", label: "Item two" }];
const chart = props => render(h(Chart, { data, series, x: "month", label: "Label", ...props }));
const marks = html => [...html.matchAll(/class="area-chart__mark"[^>]*d="([^"]+)"/g)].map(m => m[1]);

test("bar by default: one tab stop named by label, the drawing hidden, a mark per value in its series' token by place", () => {
  assert.deepEqual(MANIFESTS.chart.variants, { kind: ["bar", "line", "area", "donut", "number"], size: ["sm", "md", "lg"] });
  const html = chart();
  assert.match(html, /^<div class="area-chart area-chart--bar area-chart--md">/);
  assert.match(html, /<div class="area-chart__plot" tabindex="0" role="group" aria-label="Label" aria-describedby="([^"]+)">[^]*<span id="\1" class="area-sr-only">Left and Right move between values<\/span>/);
  assert.match(html, /<svg class="area-chart__svg" width="480" height="192" viewBox="0 0 480 192" aria-hidden="true" focusable="false">/, "drawn at its box's size (480 until measured), never scaled");
  assert.match(html, /<g style="--_chart-fill:var\(--area-series-1-fill\)">/);
  assert.match(html, /<g style="--_chart-fill:var\(--area-series-2-fill\)">/);
  assert.equal(marks(html).length, 6);
  // Rounded only at the value end, corner 4 at most; the baseline square.
  for (const d of marks(html)) { assert.match(d, /A4,4 0 0 1/); assert.match(d, /^M[\d.]+,174V/); }
  // A own colour replaces the token.
  assert.match(chart({ series: [{ key: "a", label: "Item one", color: "red" }, series[1]] }), /--_chart-fill:red/);
});

test("the axes: a baseline at zero, gridlines at round ticks with their labels, an x label per category that fits", () => {
  const html = chart();
  assert.match(html, /<line class="area-chart__baseline" x1="40" x2="480" y1="174.5" y2="174.5"><\/line><text class="area-chart__tick" x="32" y="174" dy="0.35em" text-anchor="end">0<\/text>/);
  assert.equal([...html.matchAll(/class="area-chart__grid"/g)].length, 4);
  for (const month of ["Jan", "Feb", "Mar"]) assert.match(html, new RegExp(`dominant-baseline="hanging" text-anchor="middle">${month}<`));
  assert.match(chart({ formatValue: v => `$${v}` }), />\$20<\/text>/, "formatValue writes the ticks");
  assert.deepEqual(chartTicks(0, 18), [0, 5, 10, 15, 20]);
  assert.deepEqual(chartTicks(-4, 9, 4), [-5, 0, 5, 10]);
  assert.deepEqual(chartTicks(0, 0), [0, 0.25, 0.5, 0.75, 1], "nothing but zeros still has a scale");
});

test("stacked bars: one column per row, its parts 2 apart, only the outermost rounded", () => {
  const html = chart({ stacked: true });
  assert.match(html, /area-chart--stacked/);
  const [first, , , top] = marks(html);
  assert.doesNotMatch(first, /A/, "the part at the base is square");
  assert.match(top, /A4,4/, "the outermost part is rounded at its value end");
  // The upper part starts 2 above where the lower one ends.
  const lowerTop = Number(first.match(/V([\d.]+)H/)[1]), upperBase = Number(top.match(/^M[\d.]+,([\d.]+)/)[1]);
  assert.equal(+(lowerTop - upperBase).toFixed(2), 2);
});

test("lines in the series' mark, areas over a 24% wash, stacked areas parted in the ground; a missing value is a gap", () => {
  const line = chart({ kind: "line" });
  assert.match(line, /<g style="--_chart-fill:var\(--area-series-1-fill\);--_chart-stroke:var\(--area-series-1\)"><path class="area-chart__line" d="M40,[\d.]+L260,[\d.]+L480,[\d.]+"><\/path><\/g>/);
  const area = chart({ kind: "area" });
  assert.match(area, /<linearGradient id="([^"]+)-wash-0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var\(--area-series-1-fill\);stop-opacity:0.24"><\/stop><stop offset="1" style="stop-color:var\(--area-series-1-fill\);stop-opacity:0"><\/stop>/);
  assert.match(area, /--_chart-wash:url\(#[\w-]+-wash-0\)"><path class="area-chart__wash"/);
  const stacked = chart({ kind: "area", stacked: true });
  assert.equal([...stacked.matchAll(/class="area-chart__part"/g)].length, 2);
  assert.doesNotMatch(stacked, /area-chart__line/);
  const gap = chart({ kind: "line", series: [series[0]], data: [{ month: "Jan", a: 1 }, { month: "Feb", a: null }, { month: "Mar", a: 3 }, { month: "Apr", a: 4 }] });
  assert.match(gap, /class="area-chart__mark" style="fill:var\(--area-series-1\)" cx="40"/, "a lone point is a dot");
  assert.equal([...gap.matchAll(/class="area-chart__line"/g)].length, 1);
});

test("a donut: the first series' parts by x, 2 apart, the total in the middle, the parts in the legend", () => {
  const html = chart({ kind: "donut" });
  assert.match(html, /<svg class="area-chart__svg" width="160" height="160"/);
  assert.equal(marks(html).length, 3);
  assert.match(html, /<text class="area-chart__center"[^>]*>45<\/text><text class="area-chart__center-label"[^>]*>Item one<\/text>/);
  assert.deepEqual([...html.matchAll(/class="area-chart__legend-label">([^<]+)</g)].map(m => m[1]), ["Jan", "Feb", "Mar"]);
  assert.match(html, /<th scope="col" class="area-table__cell--numeric">Share<\/th>[^]*<td>Feb<\/td><td class="area-table__cell--numeric">18<\/td><td class="area-table__cell--numeric">40%<\/td>/);
  assert.match(chart({ kind: "donut", size: "sm" }), /width="128" height="128"/);
  // One part left draws a whole ring.
  assert.match(chart({ kind: "donut", defaultHiddenKeys: ["Jan", "Feb"] }), /fill-rule="evenodd"[^>]*d="M[^"]*A80,80 0 1 1[^"]*A80,80 0 1 1/);
});

test("the legend toggles series with aria-pressed; hidden series leave the plot, never the table", () => {
  const html = chart({ defaultHiddenKeys: ["b"] });
  assert.match(html, /<button type="button" class="area-chart__legend-item" aria-pressed="true"><span class="area-chart__key" style="--_chart-fill:var\(--area-series-1-fill\)" aria-hidden="true"><\/span><span class="area-chart__legend-label">Item one<\/span><\/button>/);
  assert.match(html, /aria-pressed="false"[^>]*><span class="area-chart__key" style="--_chart-fill:var\(--area-series-2-fill\)"/);
  assert.equal(marks(html).length, 3);
  assert.match(html, /<th scope="col" class="area-table__cell--numeric">Item two<\/th>/);
  assert.doesNotMatch(chart({ series: [series[0]] }), /area-chart__legend/, "one series needs no legend");
});

test("a visually hidden Table of the data always; view=table shows Area's Table in the plot's place, and the toggle says so", () => {
  const html = chart();
  assert.match(html, /<div class="area-sr-only"><div class="area-table-wrapper"><table class="area-table[^"]*" aria-label="Label"><thead><tr><th scope="col">month<\/th>/);
  const table = chart({ view: "table", tableToggle: true, xLabel: "Month" });
  assert.doesNotMatch(table, /area-chart__plot|area-sr-only"><div class="area-table/);
  assert.match(table, /<div class="area-chart__table"><div class="area-table-wrapper"><table class="area-table area-table--sm[^"]*" aria-label="Label"><thead><tr><th scope="col">Month<\/th>/);
  assert.match(table, /<button[^>]*class="area-button[^"]*area-chart__view"[^>]*aria-pressed="true"[^>]*>[^]*Show table/);
  assert.doesNotMatch(table, /area-chart__legend-item/, "the legend toggles marks, so it leaves with them");
  assert.match(chart({ tableToggle: true, tableLabel: "Show data" }), /aria-pressed="false"[^>]*>[^]*Show data/);
});

test("loading holds the plot's place with a delayed Skeleton; nothing to plot says what is missing", () => {
  const loading = chart({ loading: true, delay: "short" });
  assert.match(loading, /^<div class="area-chart area-chart--bar area-chart--md" aria-busy="true"><div class="area-chart__plot"><div aria-hidden="true" class="area-skeleton area-skeleton--block" data-waiting=""><\/div><\/div><\/div>$/);
  assert.equal(chart({ data: [] }), '<div class="area-chart area-chart--bar area-chart--md"><div class="area-chart__empty">No values yet</div></div>');
  assert.match(chart({ data: [], emptyText: "No visits yet" }), />No visits yet</);
});

test("ChartNumber: the label, the figure, the change in a soft Badge with its arrow and direction said, and what it is against", () => {
  const html = render(h(ChartNumber, { label: "Active users", value: "24,318", change: "12.4%", direction: "down", tone: "danger", note: "vs. 21,640", id: "n" }));
  assert.match(html, /^<div id="n" class="area-chart area-chart--number area-chart--md"><div class="area-chart__label">Active users<\/div><div class="area-chart__figure">24,318<\/div><div class="area-chart__change"><span class="area-badge area-badge--soft area-badge--danger/);
  assert.match(html, /data-area-glyph="arrow-up"[^]*rotate\(180/);
  assert.match(html, /<span class="area-sr-only">Down <\/span>12.4%/);
  assert.match(html, /<span class="area-chart__note">vs. 21,640<\/span>/);
  assert.doesNotMatch(render(h(ChartNumber, { label: "Active users", value: "24,318" })), /area-chart__change/);
});

test("paint: gridlines the Dividers group's line, the baseline the divider, labels in the data label style, Area's Tooltip", () => {
  assert.match(ruleFor(".area-chart__grid"), /stroke:\s*var\(--area-edge-dividers\)/);
  assert.match(ruleFor(".area-chart__baseline"), /stroke:\s*var\(--area-border-divider\)/);
  assert.match(ruleFor(".area-chart__tick"), /fill:\s*var\(--area-fg-muted\)/);
  const plot = ruleFor(".area-chart__plot");
  assert.match(plot, /font-family:\s*var\(--area-font-mono\)/);
  assert.match(plot, /font-size:\s*var\(--area-text-xs-size\)/);
  assert.match(plot, /font-variant-numeric:\s*tabular-nums/);
  assert.match(ruleFor(".area-chart__plot:focus-visible"), /outline:\s*var\(--area-focus-width\) solid var\(--area-focus-color\)/);
  assert.match(ruleFor(".area-chart__line"), /stroke-width:\s*1.5px/);
  assert.match(ruleFor(".area-chart__mark"), /fill:\s*var\(--_chart-fill\)/);
  assert.match(ruleFor(".area-chart__band[data-active]"), /fill:\s*var\(--area-bg-hover\)/);
  assert.match(ruleFor(".area-chart__key"), /border-radius:\s*2px/);
  assert.match(ruleFor(".area-chart"), /--_chart-height:\s*192px/);
  assert.match(ruleFor(".area-chart--sm"), /--_chart-height:\s*128px/);
  assert.match(ruleFor(".area-chart--lg"), /--_chart-height:\s*256px/);
  // No draw-in: nothing in the family animates or transitions.
  for (const { selector, body } of rules) if (/\.area-chart/.test(selector)) assert.doesNotMatch(body, /animation|transition/, `${selector} moves`);
});
