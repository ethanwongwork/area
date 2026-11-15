import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { readFileSync } from "node:fs";
import { Table, TableGroup, TableHeaderCell, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.table.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:606; packages/react/src/components/primitives.tsx:971.
    test(`Table ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Table, { [axis]: value }));
      const root = html.match(/<table\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.table.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/primitives.tsx:971-982; packages/styles/src/manifest.ts:607-618: wrapper and native table children.
test("Table retains caption, headers, cells, native props and boolean modifiers", () => {
  const html = renderToString(h(Table, { id: "teams", className: "custom", "aria-label": "Team sizes", "aria-describedby": "help", interactive: true, striped: true, columnDividers: true, flush: true, baseline: true, stickyHeader: true, stickyFirstColumn: true }, h("caption", null, "Teams"), h("thead", null, h("tr", null, h("th", { scope: "col" }, "Team"))), h("tbody", null, h("tr", null, h("td", { className: "area-table__cell--numeric" }, "12")))));
  assert.match(html, /^<div class="area-table-wrapper"><table/);
  const table = html.match(/<table[^>]*>/)[0];
  for (const attr of ['id="teams"', 'aria-label="Team sizes"', 'aria-describedby="help"']) assert.ok(table.includes(attr));
  assert.match(table, /class="[^"]* custom"/);
  for (const flag of MANIFESTS.table.booleans) assert.ok(table.includes(`area-table--${flag}`));
  assert.match(html, /<caption>Teams<\/caption><thead><tr><th scope="col">Team<\/th><\/tr><\/thead><tbody><tr><td class="area-table__cell--numeric">12<\/td><\/tr><\/tbody><\/table><\/div>$/);
});

test("Table lists its selected row state, aria-selected on a body row (components audit O7)", () => {
  assert.ok(MANIFESTS.table.states.includes("selected"));
  assert.equal(MANIFESTS.table.stateAttributes.selected, "aria-selected");
});


// docs/specs/table.md, "Sticky, sortable, grouped" (components audit V3, 2026-11-07).
const strip = html => html.replace(/<!-- -->/g, "");
const head = (...cells) => h("thead", null, h("tr", null, ...cells));

test("a sortable heading holds a sort button and says its order with aria-sort only while sorted (V3)", () => {
  const sorted = renderToString(h(Table, { "aria-label": "T" }, head(h(TableHeaderCell, { sort: "descending", numeric: true }, "Value"))));
  const th = sorted.match(/<th [^>]*>/)[0];
  assert.match(th, /aria-sort="descending"/);
  assert.match(th, /scope="col"/);
  const button = sorted.match(/<button[^>]*>/)[0];
  assert.match(button, /type="button"/);
  assert.match(button, /area-table__sort/);
  assert.match(button, /area-button--end/, "a numeric column's button sits on its end edge");
  assert.match(button, /data-sort="descending"/);
  assert.match(sorted, /area-button__label">Value</, "the button's name is the heading");
  assert.match(sorted, /rotate\(180 8 8\)/, "descending points the arrow down");
  const unsorted = renderToString(h(Table, { "aria-label": "T" }, head(h(TableHeaderCell, { sort: "none" }, "Name"))));
  assert.doesNotMatch(unsorted, /aria-sort/);
  assert.match(unsorted, /data-sort="none"/);
  assert.match(unsorted, /area-button--start/);
  const plain = renderToString(h(Table, { "aria-label": "T" }, head(h(TableHeaderCell, null, "Name"))));
  assert.doesNotMatch(plain, /<button|aria-sort/);
});

test("a row group is a tbody whose heading row folds it, with its count and summary (V3)", () => {
  const html = strip(renderToString(h(Table, { "aria-label": "T" }, h(TableGroup, { heading: "Group one", count: 2, summary: "Total 3", colSpan: 3, defaultExpanded: false, className: "x" }, h("tr", null, h("td", null, "Item one"))))));
  assert.match(html, /<tbody class="area-table__group x" data-collapsed="">/);
  assert.match(html, /<tr class="area-table__group-heading"><th scope="rowgroup" colSpan="3">/);
  const toggle = html.match(/<button[^>]*area-table__group-toggle[^>]*>/)[0];
  assert.match(toggle, /type="button"/);
  assert.match(toggle, /aria-expanded="false"/);
  assert.match(html, /area-table__group-name">Group one</);
  assert.match(html, /area-table__group-count">2</);
  assert.match(html, /area-table__group-summary">Total 3</);
  assert.match(html, /<td>Item one<\/td>/, "folded rows stay in the document, hidden by CSS");
  const open = renderToString(h(Table, { "aria-label": "T" }, h(TableGroup, { heading: "G", colSpan: 1 })));
  assert.doesNotMatch(open, /data-collapsed|area-table__group-count|area-table__group-summary/);
  assert.match(open, /aria-expanded="true"/);
});

test("loading keeps the caption and header and stands skeleton rows in for the bodies, one cell per column (V3)", () => {
  const html = renderToString(h(Table, { "aria-label": "T", loading: true, loadingRows: 2 },
    h("caption", null, "Teams"),
    head(h("th", { colSpan: 2 }, "Name"), h(TableHeaderCell, { numeric: true }, "Value")),
    h("tbody", null, h("tr", null, h("td", null, "Item one"))),
    h(TableGroup, { heading: "Group one", colSpan: 3 }, h("tr", null, h("td", null, "Item two")))));
  assert.match(html.match(/<table[^>]*>/)[0], /aria-busy="true"/);
  assert.match(html, /<caption>Teams<\/caption><thead>/);
  assert.doesNotMatch(html, /Item one|Item two|area-table__group/);
  const body = html.match(/<tbody aria-hidden="true" class="area-table__skeleton">.*<\/tbody>/)[0];
  assert.equal((body.match(/<tr>/g) ?? []).length, 2);
  assert.equal((body.match(/<td/g) ?? []).length, 6, "three columns: a colSpan counts");
  assert.equal((body.match(/<td class="area-table__cell--numeric">/g) ?? []).length, 2, "a numeric column's skeleton sits at its end");
  assert.equal((body.match(/area-skeleton--text/g) ?? []).length, 6);
  const waiting = renderToString(h(Table, { "aria-label": "T", loading: true, delay: "short" }, head(h("th", null, "Name"))));
  assert.match(waiting, /area-table__skeleton-line" data-column="first" data-waiting=""|data-waiting=""[^>]*area-table__skeleton-line|area-table__skeleton-line[^>]*data-waiting=""/);
  const idle = renderToString(h(Table, { "aria-label": "T" }, head(h("th", null, "Name")), h("tbody", null, h("tr", null, h("td", null, "Item one")))));
  assert.doesNotMatch(idle, /aria-busy|area-table__skeleton/);
});

test("sticky cells keep a ground and draw their own rules (V3)", () => {
  const css = readFileSync(new URL("../../styles/src/components/table.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const rule = selector => css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
  const header = rule(".area-table--sticky-header > thead > tr > th");
  assert.match(header, /position: sticky/);
  assert.match(header, /inset-block-start: 0/);
  assert.match(header, /border-block-end-color: transparent/);
  assert.match(header, /box-shadow: inset 0 calc\(-1 \* var\(--area-stroke-width\)\) 0 var\(--area-edge-dividers\)/);
  assert.match(rule(".area-table--sticky-first-column > * > tr > :first-child"), /position: sticky; inset-inline-start: 0/);
  const ground = rule(".area-table.area-table--sticky-first-column > tbody > tr > :is(td, th):first-child");
  assert.match(ground, /background-color: var\(--area-table-fill, var\(--area-bg-surface\)\)/);
  assert.match(ground, /background-image: linear-gradient\(var\(--_row-paint, transparent\)/);
  // Every row paint a first column must keep sets --_row-paint too: stripes, selection, the quieter selection, hover, press.
  for (const paint of ["var(--area-bg-well)", "var(--area-bg-component-active)", "var(--area-bg-component-hover)", "var(--area-bg-component-pressed)"]) {
    assert.ok(css.includes(`--_row-paint: ${paint}`), `--_row-paint: ${paint}`);
  }
  assert.match(css, /animation-timeline: scroll\(nearest inline\)/, "the seam follows the sideways scroll");
});
