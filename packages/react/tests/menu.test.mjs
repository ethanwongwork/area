import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Menu, MenuItem, MenuLabel, MenuSeparator, MenuSearch, MANIFESTS } from "../dist/modules/index.js";

// packages/react/src/components/primitives.tsx:1106-1167; packages/styles/src/manifest.ts:562-564: hosted menu, native props, structural parts and item state hooks.
test("Menu composes labeled groups, separator, item descriptions and native disabled actions", () => {
  const html = renderToString(h(MenuSearch, { id: "search-surface", className: "search" }, h("input", { "aria-label": "Find action" }), h(Menu, { id: "menu", className: "custom", "aria-label": "Actions", "aria-describedby": "help" }, h(MenuLabel, { id: "edit-label" }, "Edit"), h("div", { role: "group", "aria-labelledby": "edit-label" }, h(MenuItem, { id: "delete", className: "item", "aria-label": "Delete project", "aria-describedby": "warning", name: "intent", value: "delete", disabled: true, tone: "danger", description: "Cannot undo", shortcut: "Del", "data-selected": "", "data-highlighted": "" }, "Delete")), h(MenuSeparator))));
  assert.match(html, /^<div class="area-menu__search-surface search" id="search-surface"><input aria-label="Find action"\/><div role="menu"/);
  const menu = html.match(/<div role="menu"[^>]*>/)[0];
  for (const attr of ['id="menu"', 'class="area-menu custom"', 'aria-label="Actions"', 'aria-describedby="help"']) assert.ok(menu.includes(attr));
  const item = html.match(/<button[^>]*>/)[0];
  for (const attr of ['type="button"', 'role="menuitem"', 'id="delete"', 'aria-label="Delete project"', 'aria-describedby="warning"', 'name="intent"', 'value="delete"', 'disabled=""', 'data-disabled=""', 'data-selected=""', 'data-highlighted=""']) assert.ok(item.includes(attr));
  assert.match(item, /class="area-menu__item area-menu__item--danger item"/);
  assert.match(html, /area-menu__label" id="edit-label">Edit<\/div><div role="group" aria-labelledby="edit-label">/);
  assert.match(html, /area-menu__lines"><span class="area-menu__text">Delete<\/span><span class="area-menu__description">Cannot undo/);
  assert.match(html, /area-menu__shortcut">Del/);
  assert.match(html, /role="separator" class="area-menu__separator"/);
});

// packages/react/src/components/primitives.tsx:1143-1167: checkable menuitem role and decorative check/switch indicators.
test("MenuItem maps both checked states without inserting a second checkbox", () => {
  for (const checked of [false, true]) for (const indicator of ["check", "switch"]) {
    const html = renderToString(h(MenuItem, { checked, indicator }, "Show guides"));
    assert.match(html, /role="menuitemcheckbox"/);
    assert.ok(html.includes(`aria-checked="${checked}"`));
    assert.match(html, /area-menu__text">Show guides/);
    assert.doesNotMatch(html, /<input/);
    if (indicator === "switch") {
      assert.match(html, /area-menu__toggle" aria-hidden="true"/);
      assert.equal(html.includes('data-checked=""'), checked);
    } else assert.match(html, /area-menu__check" aria-hidden="true"/);
  }
});

// packages/react/src/components/Overlays.tsx:163-187; packages/react/src/components/primitives.tsx:1074-1076: native trigger names the anchored menu and exposes expanded state.
test("Menu trigger connects the named menu for closed and initially open states", () => {
  for (const state of [{ open: false }, { open: true }, { defaultOpen: true }]) {
    const html = renderToString(h(Menu, { ...state, className: "custom", "aria-describedby": "help", trigger: h("button", { id: "actions", className: "trigger", disabled: true, "aria-label": "Actions" }, "Actions") }, h(MenuItem, null, "Copy")));
    const trigger = html.match(/<button[^>]*>/)[0];
    const menu = html.match(/<div role="menu"[^>]*>/)[0];
    const target = trigger.match(/aria-controls="([^"]+)"/)[1];
    for (const attr of ['id="actions"', 'disabled=""', 'aria-label="Actions"', 'aria-haspopup="menu"', `aria-expanded="${state.open ?? state.defaultOpen}"`, `popoverTarget="${target}"`]) assert.ok(trigger.includes(attr), attr);
    for (const attr of [`id="${target}"`, 'aria-labelledby="actions"', 'popover="auto"', 'aria-describedby="help"']) assert.ok(menu.includes(attr));
    assert.match(menu, /class="area-menu custom"/);
    assert.match(html, /role="menuitem"/);
  }
});

// packages/react/src/components/primitives.tsx:1051,1075 and Overlays.tsx:178-183: inherited native id is overwritten by generated overlay props.
test.skip("Menu preserves a caller-provided surface id when a trigger is supplied (known bug: generated overlay id overwrites caller id)", () => {
  const html = renderToString(h(Menu, { id: "actions-menu", trigger: h("button", null, "Actions") }, h(MenuItem, null, "Copy")));
  assert.match(html.match(/<div role="menu"[^>]*>/)[0], / id="actions-menu"/);
  assert.match(html.match(/<button[^>]*>/)[0], /aria-controls="actions-menu"/);
});
