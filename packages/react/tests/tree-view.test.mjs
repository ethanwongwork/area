import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { TreeView } from "../dist/modules/index.js";

// Audit D-28: Tree view had no test file. Keyboard roving needs a DOM runner; these guard the
// ARIA tree the keys move through and the paint rules the audit found drifting.
const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const items = [{ id: "src", label: "src", children: [{ id: "a", label: "Item one" }] }, { id: "b", label: "Item two", disabled: true }];

test("Tree view is an ARIA tree with levels, positions and one tab stop", () => {
  const html = renderToString(h(TreeView, { "aria-label": "Files", items, defaultExpandedIds: ["src"], defaultSelectedIds: ["a"] }));
  assert.match(html, /role="tree"/);
  assert.match(html, /data-tree-id="src" aria-level="1" aria-posinset="1" aria-setsize="2" aria-expanded="true"/);
  assert.match(html, /data-tree-id="a" aria-level="2" aria-posinset="1" aria-setsize="1" aria-selected="true"/);
  assert.equal((html.match(/tabindex="0"/g) ?? []).length, 1);
});

test("a collapsed branch hides its children and reports aria-expanded=false", () => {
  const html = renderToString(h(TreeView, { "aria-label": "Files", items }));
  assert.match(html, /data-tree-id="src"[^>]*aria-expanded="false"/);
  assert.doesNotMatch(html, /data-tree-id="a"/);
});

test("rows rest in body ink, chevrons mirror in RTL, and selection outranks hover (audit D-3, D-4, D-13)", () => {
  assert.match(css, /\.area-tree-view \{[^}]*color: var\(--area-fg-default\)/);
  assert.match(css, /\[aria-expanded="false"\]:dir\(rtl\) \.area-tree-view__chevron svg \{ rotate: 90deg; \}/);
  assert.match(css, /\.area-tree-view \[role="treeitem"\]:hover:not\(\[data-disabled\], \[aria-current="page"\], \[aria-selected="true"\]\)/);
});
