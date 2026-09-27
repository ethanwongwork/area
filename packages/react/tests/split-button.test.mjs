import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { SplitButton, MenuItem, Popover, Button } from "../dist/modules/index.js";

const render = (props = {}) => renderToString(h(SplitButton, { menu: [h(MenuItem, { key: "a" }, "Save as…"), h(MenuItem, { key: "b" }, "Export")], ...props }, "Save"));

test("SplitButton renders two named buttons and a menu popover", () => {
  const html = render({ menuLabel: "More save options" });
  assert.match(html, /role="group"[^>]*class="area-split-button area-split-button--solid"/);
  assert.equal((html.match(/type="button"/g) ?? []).length, 4, "action, trigger and two menu items");
  assert.match(html, /class="area-button[^"]*area-split-button__action"[^>]*>/);
  assert.match(html, /aria-label="More save options"[^>]*aria-haspopup="menu"[^>]*aria-expanded="false"/);
  const menuTag = html.match(/<div[^>]*role="menu"[^>]*>/)?.[0] ?? "";
  assert.match(menuTag, /popover="auto"/);
  assert.match(menuTag, /class="area-menu area-split-button__menu"/);
  const menuId = html.match(/role="menu"[^>]*?/) && html.match(/id="([^"]+-menu)"/)[1];
  assert.match(html, new RegExp(`aria-controls="${menuId}"`));
  assert.match(html, new RegExp(`popovertarget="${menuId}"`, "i"));
});

test("SplitButton passes variant, tone and size to both parts and disables both", () => {
  const html = render({ variant: "outline", tone: "accent", size: "sm", disabled: true });
  assert.match(html, /area-split-button--outline/);
  assert.equal((html.match(/area-button--outline/g) ?? []).length, 2);
  assert.equal((html.match(/area-button--accent/g) ?? []).length, 2);
  assert.equal((html.match(/area-button--sm/g) ?? []).length, 2);
  assert.equal((html.match(/disabled=""/g) ?? []).length, 2);
});

test("SplitButton defaults the trigger name", () => {
  assert.match(render(), /aria-label="More options"/);
});

test("MenuItem with checked becomes a checkable row with a display-only indicator", () => {
  const sw = renderToString(h(MenuItem, { checked: true, indicator: "switch" }, "Full width"));
  assert.match(sw, /role="menuitemcheckbox"[^>]*aria-checked="true"/);
  assert.match(sw, /class="area-switch area-switch--sm area-menu__toggle" aria-hidden="true"/);
  assert.match(sw, /area-switch__track" data-checked=""/);
  assert.doesNotMatch(sw, /<input/);
  const check = renderToString(h(MenuItem, { checked: false }, "Backlinks"));
  assert.match(check, /aria-checked="false"/);
  assert.match(check, /area-menu__check/);
  assert.match(renderToString(h(MenuItem, null, "Plain")), /role="menuitem"/);
});

test("Popover with a trigger wires an anchored native popover dialog", () => {
  const html = renderToString(h(Popover, { side: "bottom", "aria-label": "Dimensions", trigger: h(Button, null, "Dimensions") }, "Body"));
  // The trigger comes first, then the surface; placement is computed on open (overlay.md).
  assert.match(html, /^<button[^>]*aria-haspopup="dialog"/);
  const id = html.match(/id="([^"]+)"[^>]*popover="auto"/)?.[1];
  assert.ok(id, "surface has an id and popover=auto");
  assert.match(html, new RegExp(`popoverTarget="${id}"`, "i"));
  assert.match(html, new RegExp(`aria-controls="${id}"`));
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /role="dialog"/);
  assert.doesNotMatch(renderToString(h(Popover, null, "Static")), /popover=/);
});
