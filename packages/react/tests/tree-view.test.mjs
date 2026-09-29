import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { TreeView, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.treeView.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:183; packages/react/src/components/TreeView.tsx:123.
    test(`TreeView ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(TreeView, { items: [{ id: "root", label: "Project" }], "aria-label": "Files", [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.treeView.block}--${value}`), root);
    });
  }
}

const items = [{ id: "root", label: "Project", icon: "I", trailing: "2", actions: h("button", { "aria-label": "Lock project", tabIndex: -1 }, "Lock"), children: [{ id: "child", label: "Notes" }] }, { id: "disabled", label: "Archive", disabled: true }];

// packages/react/src/components/TreeView.tsx:36-40,58-60,123-143: flattened hierarchy carries levels/positions, initial focus and states.
test("TreeView navigation exposes expanded, selected, current and disabled rows", () => {
  const html = renderToString(h(TreeView, { items, id: "files", className: "custom", "aria-label": "Files", "aria-describedby": "help", defaultExpandedIds: ["root"], defaultSelectedIds: ["child"], currentId: "child" }));
  assert.match(html, /^<div id="files" aria-label="Files" aria-describedby="help" role="tree" class="[^"]* custom">/);
  const rows = html.match(/<div role="treeitem"[^>]*>/g);
  assert.equal(rows.length, 3);
  for (const attr of ['aria-expanded="true"', 'aria-level="1"', 'aria-posinset="1"', 'aria-setsize="2"']) assert.ok(rows[0].includes(attr));
  for (const attr of ['aria-level="2"', 'aria-setsize="1"', 'aria-selected="true"', 'aria-current="page"', 'tabindex="0"']) assert.ok(rows[1].includes(attr));
  assert.doesNotMatch(rows[1], /aria-expanded/);
  for (const attr of ['aria-disabled="true"', 'data-disabled=""', 'tabindex="-1"']) assert.ok(rows[2].includes(attr));
  assert.equal(rows.filter(row => row.includes('tabindex="0"')).length, 1);
  assert.match(html, /area-tree-view__icon" aria-hidden="true">I/);
  assert.match(html, /area-tree-view__label">Project/);
  assert.match(html, /area-tree-view__trailing">2/);
  assert.match(html, /area-tree-view__actions"><button aria-label="Lock project" tabindex="-1">Lock/);
});

// packages/react/src/components/TreeView.tsx:49-53,127-140: controlled state wins; checkbox mode uses checked rather than selected.
test("TreeView checkbox mode maps controlled checks and collapsed branches", () => {
  const html = renderToString(h(TreeView, { items, selectionMode: "checkbox", "aria-label": "Filters", expandedIds: [], defaultExpandedIds: ["root"], selectedIds: ["root"], defaultSelectedIds: ["disabled"] }));
  const rows = html.match(/<div role="treeitem"[^>]*>/g);
  assert.equal(rows.length, 2);
  assert.match(rows[0], /aria-expanded="false"[^>]*aria-checked="true"/);
  assert.match(rows[1], /aria-checked="false"/);
  assert.doesNotMatch(html, /aria-selected|data-tree-id="child"/);
  assert.match(html, /area-tree-view__check" aria-hidden="true"/);
});
