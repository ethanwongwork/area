import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { ContextMenu, MenuItem, MANIFESTS } from "../dist/modules/index.js";

// packages/react/src/components/ContextMenu.tsx:36,86-98: initial closed menu omits rows until opened; wrapper forwards native props.
test("ContextMenu renders a named closed native popover after its target", () => {
  const html = renderToString(h(ContextMenu, { label: "Page actions", id: "context", className: "custom", "aria-label": "Page", "aria-describedby": "help", menu: h(MenuItem, null, "Duplicate") }, h("button", { type: "button" }, "Page target")));
  assert.match(html, /^<div class="area-context-menu custom" id="context" aria-label="Page" aria-describedby="help"><button type="button">Page target<\/button><div role="menu"/);
  const menu = html.match(/<div[^>]*role="menu"[^>]*>/)[0];
  for (const attr of ['popover="auto"', 'aria-label="Page actions"', 'tabindex="-1"']) assert.ok(menu.includes(attr));
  assert.doesNotMatch(html, /role="menuitem"|Duplicate/);
});

// packages/react/src/components/ContextMenu.tsx:32,63,77,86: disabled gates handlers, not native div/target attributes.
test("ContextMenu disabled mode does not disable the independent target", () => {
  const html = renderToString(h(ContextMenu, { disabled: true, label: "Page actions", menu: h(MenuItem, null, "Duplicate") }, h("button", { type: "button" }, "Open page")));
  assert.match(html, /<button type="button">Open page<\/button>/);
  assert.doesNotMatch(html, /disabled=/);
  assert.match(html, /role="menu"[^>]*aria-label="Page actions"/);
});
