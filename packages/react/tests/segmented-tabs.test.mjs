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

test("a selected tab is strong and every tab reserves the strong width with a hidden copy (owner 2026-10-21)", async () => {
  const { readFileSync } = await import("node:fs");
  const html = renderToString(h(Tabs, { "aria-label": "Views", tabs: [{ id: "a", label: "Overview" }, { id: "b", label: "Code" }] }));
  assert.equal((html.match(/<span class="area-tabs__reserve" aria-hidden="true">/g) ?? []).length, 2);
  assert.match(html, /<span class="area-tabs__label">Overview<span class="area-tabs__reserve" aria-hidden="true">Overview<\/span><\/span>/);
  const css = readFileSync(new URL("../../styles/src/components/navigation.css", import.meta.url), "utf8");
  assert.match(css, /\.area-tabs__tab\[data-selected\] \.area-tabs__label \{ font-weight: var\(--area-weight-strong\); \}/);
  assert.match(css, /\.area-tabs__reserve \{ block-size: 0; overflow: hidden; visibility: hidden; font-weight: var\(--area-weight-strong\); \}/);
  // The track is painted inside the list, so the indicator lies on it rather than above a border.
  assert.doesNotMatch(css, /\.area-tabs--track \.area-tabs__list \{ border-block-end/);
});
