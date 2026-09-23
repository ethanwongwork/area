import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Segmented, Tabs } from "../dist/modules/index.js";

test("segmented has one tab stop and one checked radio by default", () => {
  const html = renderToString(h(Segmented, {
    label: "View",
    defaultValue: "grid",
    options: [{ value: "list", label: "List" }, { value: "grid", label: "Grid" }],
  }));
  assert.match(html, /role="radiogroup"/);
  assert.match(html, /aria-checked="true"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /tabindex="-1"/);
});

test("tabs renders a linked tabpanel for every tab and hides inactive content", () => {
  const html = renderToString(h(Tabs, {
    label: "Sections",
    defaultValue: "two",
    tabs: [{ id: "one", label: "One", content: "First" }, { id: "two", label: "Two", content: "Second" }],
  }));
  assert.match(html, /role="tablist" aria-label="Sections"/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /hidden=""/);
});

test("vertical tabs fall back from a disabled value to an enabled tab", () => {
  const html = renderToString(h(Tabs, { orientation: "vertical", size: "sm", defaultValue: "disabled", tabs: [{ id: "disabled", label: "Unavailable", disabled: true }, { id: "enabled", label: "Available" }] }));
  assert.match(html, /aria-orientation="vertical"/);
  assert.match(html, /area-tabs--sm area-tabs--vertical/);
  assert.equal((html.match(/aria-selected="true"/g) ?? []).length, 1);
  assert.match(html, /aria-selected="false"[^>]*tabindex="-1" disabled=""/);
});
