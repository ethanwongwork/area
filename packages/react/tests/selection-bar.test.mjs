import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { readFileSync } from "node:fs";
import { Button, SelectionBar, selectionCountLabel } from "../dist/modules/index.js";

// Selection bar (components audit N2, 2026-11-07; docs/specs/selection-bar.md; Primer's Table.BulkActions).
test("a named group: the count, the actions, then the clear button", () => {
  const html = render(h(SelectionBar, { count: 3, onClear() {} }, h(Button, { size: "sm" }, "Delete")));
  assert.match(html, /^<div role="group" aria-label="Selection actions" class="area-selection-bar">/);
  assert.match(html, /<span class="area-selection-bar__count">3 selected<\/span><div class="area-selection-bar__actions"><button[^>]*>.*Delete.*<\/button><\/div>/);
  assert.match(html, /<button[^>]*class="[^"]*area-selection-bar__clear[^"]*"[^>]*aria-label="Clear selection"[^>]*>/);
  assert.equal(selectionCountLabel(12), "12 selected");
});

test("at zero it stays mounted but draws nothing, so the change is said and focus can return", () => {
  const html = render(h(SelectionBar, { count: 0, onClear() {} }, h(Button, null, "Delete")));
  assert.equal(html, '<div role="group" aria-label="Selection actions" class="area-selection-bar" data-empty=""></div>');
});

test("floating, a label function, clearLabel, aria-label and native props", () => {
  const html = render(h(SelectionBar, { count: 2, floating: true, label: count => `${count} pages selected`, clearLabel: "Deselect pages", "aria-label": "Page actions", id: "bar", onClear() {} }));
  assert.match(html, /^<div id="bar" role="group" aria-label="Page actions" class="area-selection-bar area-selection-bar--floating">/);
  assert.match(html, />2 pages selected</);
  assert.match(html, /aria-label="Deselect pages"/);
  assert.doesNotMatch(html, /__actions/, "no actions: no actions box");
  assert.doesNotMatch(render(h(SelectionBar, { count: 1 })), /__clear/, "no onClear: no clear button");
});

test("it says the count through the shared announcer and writes no live region of its own", () => {
  const source = readFileSync(new URL("../src/components/SelectionBar.tsx", import.meta.url), "utf8");
  assert.match(source, /announce\(words\)/);
  assert.doesNotMatch(source, /aria-live|role="status"/);
  // Primer: showing the actions preserves the selecting control's focus. The bar never focuses itself on appearing.
  assert.doesNotMatch(source, /autoFocus|\.focus\(\)\s*;?\s*\}\s*,\s*\[count/);
});
