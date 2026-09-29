import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Table, MANIFESTS } from "../dist/modules/index.js";

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
  const html = renderToString(h(Table, { id: "teams", className: "custom", "aria-label": "Team sizes", "aria-describedby": "help", interactive: true, striped: true, columnDividers: true }, h("caption", null, "Teams"), h("thead", null, h("tr", null, h("th", { scope: "col" }, "Team"))), h("tbody", null, h("tr", null, h("td", { className: "area-table__cell--numeric" }, "12")))));
  assert.match(html, /^<div class="area-table-wrapper"><table/);
  const table = html.match(/<table[^>]*>/)[0];
  for (const attr of ['id="teams"', 'aria-label="Team sizes"', 'aria-describedby="help"']) assert.ok(table.includes(attr));
  assert.match(table, /class="[^"]* custom"/);
  for (const flag of MANIFESTS.table.booleans) assert.ok(table.includes(`area-table--${flag}`));
  assert.match(html, /<caption>Teams<\/caption><thead><tr><th scope="col">Team<\/th><\/tr><\/thead><tbody><tr><td class="area-table__cell--numeric">12<\/td><\/tr><\/tbody><\/table><\/div>$/);
});
