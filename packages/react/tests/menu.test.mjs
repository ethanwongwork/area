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
  // MenuLabel wraps its text in a label-text slot.
  assert.match(html, /<div class="area-menu__label" id="edit-label"><span class="area-menu__label-text">Edit<\/span><\/div><div role="group" aria-labelledby="edit-label">/);
  assert.match(html, /area-menu__lines"><span class="area-menu__text">Delete<\/span><span class="area-menu__description">Cannot undo/);
  assert.match(html, /area-menu__shortcut"><span class="area-kbd area-kbd--sm area-kbd--default"><kbd class="area-kbd__key">Del<\/kbd>/); // every key a keycap (2026-10-22)
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
    // A hosted menu is a ScrollArea root carrying role="menu".
    const menu = html.match(/<div[^>]*role="menu"[^>]*>/)[0];
    const target = trigger.match(/aria-controls="([^"]+)"/)[1];
    for (const attr of ['id="actions"', 'disabled=""', 'aria-label="Actions"', 'aria-haspopup="menu"', `aria-expanded="${state.open ?? state.defaultOpen}"`, `popoverTarget="${target}"`]) assert.ok(trigger.includes(attr), attr);
    for (const attr of [`id="${target}"`, 'aria-labelledby="actions"', 'popover="auto"', 'aria-describedby="help"']) assert.ok(menu.includes(attr));
    const classes = menu.match(/class="([^"]*)"/)[1].split(" ");
    for (const name of ["area-menu", "custom"]) assert.ok(classes.includes(name), name);
    assert.match(html, /role="menuitem"/);
  }
});

// packages/react/src/components/primitives.tsx:1278 and Overlays.tsx:111-112: a caller id names the anchored menu (fixed since Sept 29).
test("Menu preserves a caller-provided surface id when a trigger is supplied", () => {
  const html = renderToString(h(Menu, { id: "actions-menu", trigger: h("button", null, "Actions") }, h(MenuItem, null, "Copy")));
  assert.match(html.match(/<div[^>]*role="menu"[^>]*>/)[0], / id="actions-menu"/);
  assert.match(html.match(/<button[^>]*>/)[0], /aria-controls="actions-menu"/);
});

test("a string shortcut sets each leading modifier in its own keycap, the rest as written (2026-10-26)", () => {
  const keys = shortcut => [...renderToString(h(MenuItem, { shortcut }, "Item")).matchAll(/<kbd class="area-kbd__key">([^<]*)<\/kbd>/g)].map(m => m[1]);
  assert.deepEqual(keys("⌘L"), ["⌘", "L"]);
  assert.deepEqual(keys("⌘⇧P"), ["⌘", "⇧", "P"]);
  assert.deepEqual(keys("Del"), ["Del"]);
  assert.deepEqual(keys("⇧"), ["⇧"]);
});

test("MenuItem's trailing slot sits before the shortcut (components audit O7)", () => {
  const html = renderToString(h(MenuItem, { trailing: "12", shortcut: "⌘K" }, "Inbox"));
  assert.match(html, /<span class="area-menu__text">Inbox<\/span><span class="area-menu__trailing">12<\/span><span class="area-menu__shortcut">/);
  assert.ok(MANIFESTS.menu.elements.includes("trailing"));
  assert.doesNotMatch(renderToString(h(MenuItem, null, "Inbox")), /__trailing/);
});

// Components audit V2 (2026-11-07): an inactive row stays reachable (aria-disabled, never native disabled), keeps the
// menu open, and its reason is its note, said once as its description.
test("MenuItem inactive keeps its row reachable and says why in its note", () => {
  const html = renderToString(h(MenuItem, { inactive: true, inactiveText: "Description", description: "Hidden by the reason" }, "Item two"));
  const row = html.match(/<button[^>]*>/)[0];
  assert.doesNotMatch(row, /\sdisabled=""|data-disabled/);
  for (const attr of ['aria-disabled="true"', 'data-inactive=""', 'data-keep-open=""']) assert.ok(row.includes(attr), attr);
  const described = row.match(/aria-describedby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<span class="area-menu__description"><span id="${described}" aria-hidden="true">Description</span></span>`));
  assert.doesNotMatch(html, /Hidden by the reason/);
  assert.match(renderToString(h(MenuItem, { inactive: true, disabled: true }, "Item")), /\sdisabled=""/);
});

// Components audit V5 (2026-11-07): header and footer around the rows, and the empty and loading rows in their place.
test("Menu header and footer frame the rows; the empty and loading rows stand in for them", () => {
  const framed = renderToString(h(Menu, { "aria-label": "Label", header: "Label", footer: h(MenuItem, null, "Action") }, h(MenuItem, null, "Item one")));
  assert.match(framed, /^<div role="menu" class="area-menu" aria-label="Label"><div class="area-menu__header"><div class="area-menu__label"><span class="area-menu__label-text">Label<\/span><\/div><\/div><div class="area-menu__list"><button[^>]*>.*Item one.*<\/button><\/div><div class="area-menu__footer"><button[^>]*role="menuitem"[^>]*>.*Action.*<\/button><\/div><\/div>$/);
  // An anchored menu keeps the frame on the surface and scrolls only the list.
  const anchored = renderToString(h(Menu, { trigger: h("button", null, "Open"), defaultOpen: true, header: "Label" }, h(MenuItem, null, "Item one")));
  assert.match(anchored, /<div role="menu" class="area-menu"[^>]*><div class="area-menu__header">.*<\/div><div class="area-scroll-area area-scroll-area--hover area-menu__list"/);
  // Without either, no list wrapper.
  assert.doesNotMatch(renderToString(h(Menu, { "aria-label": "Label" }, h(MenuItem, null, "Item one"))), /area-menu__list/);
  assert.match(renderToString(h(Menu, { "aria-label": "Label" })), /<div class="area-menu__empty"><span class="area-menu__text">No items<\/span><\/div>/);
  assert.match(renderToString(h(Menu, { "aria-label": "Label", emptyText: "No items yet" })), /No items yet/);
  assert.doesNotMatch(renderToString(h(Menu, { "aria-label": "Label", emptyText: null })), /area-menu__empty/);
  const loading = renderToString(h(Menu, { "aria-label": "Label", loading: true }, h(MenuItem, null, "Item one")));
  assert.match(loading, /^<div role="menu" class="area-menu" aria-busy="true"/);
  assert.match(loading, /<div class="area-menu__loading" data-waiting=""><span class="area-menu__icon" aria-hidden="true"><span aria-hidden="true" class="area-spinner area-spinner--sm"><\/span><\/span><span class="area-menu__text">Loading<\/span><\/div>/);
  assert.doesNotMatch(loading, /Item one/);
  for (const part of ["header", "footer", "list", "empty", "loading"]) assert.ok(MANIFESTS.menu.elements.includes(part), part);
});
