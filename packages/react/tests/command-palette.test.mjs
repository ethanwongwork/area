import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { CommandPalette, MANIFESTS } from "../dist/modules/index.js";

const items = [{ id: "disabled", label: "Delete", group: "Actions", disabled: true }, { id: "open", label: "Open project", description: "Design team", keywords: ["workspace"], group: "Actions", icon: "I", shortcut: ["ctrl", "o"] }];

// packages/react/src/components/CommandPalette.tsx:84-99,145-179; docs/specs/command-palette.md:68-71: named search/combobox/listbox with active enabled option.
test("CommandPalette inline search connects names, groups, options and active descendant", () => {
  const html = renderToString(h(CommandPalette, { items, inline: true, label: "Commands", id: "commands", className: "custom", "aria-describedby": "help" }));
  const root = html.match(/<div[^>]*>/)[0];
  for (const attr of ['role="search"', 'aria-label="Commands"', 'id="commands"', 'aria-describedby="help"']) assert.ok(root.includes(attr));
  assert.match(root, /area-command-palette--inline custom/);
  const input = html.match(/<input[^>]*>/)[0];
  for (const attr of ['role="combobox"', 'aria-label="Commands"', 'aria-expanded="true"', 'aria-autocomplete="list"']) assert.ok(input.includes(attr));
  const list = html.match(/<div[^>]*role="listbox"[^>]*>/)[0];
  assert.ok(list.includes(`id="${input.match(/aria-controls="([^"]+)"/)[1]}"`));
  assert.match(list, /aria-label="Commands"/);
  const rows = html.match(/<div[^>]*role="option"[^>]*>/g);
  assert.equal(rows.length, 2);
  for (const attr of ['aria-selected="false"', 'aria-disabled="true"', 'data-disabled=""']) assert.ok(rows[0].includes(attr));
  assert.match(rows[1], /aria-selected="true"/);
  assert.ok(rows[1].includes(`id="${input.match(/aria-activedescendant="([^"]+)"/)[1]}"`));
  const groupName = html.match(/role="group" aria-labelledby="([^"]+)"/)[1];
  const groupLabel = html.match(new RegExp(`<div id="${groupName}"[^>]*>(.*?)</div>`));
  assert.ok(groupLabel, groupName);
  assert.match(groupLabel[0], /class="area-menu__label" role="presentation"/);
  assert.equal(groupLabel[1].replace(/<[^>]+>/g, ""), "Actions");
  assert.match(html, /area-menu__icon" aria-hidden="true">I/);
  assert.match(html, /area-command-palette__description">Design team/);
  assert.match(html, /Control plus O/);
});

// packages/react/src/components/CommandPalette.tsx:47-50,65-68,173,181-205: query filtering, empty feedback and modal versus inline structure.
test("CommandPalette supports named modal, query, empty and custom footer usages", () => {
  const closed = renderToString(h(CommandPalette, { items, label: "Commands" }));
  assert.match(closed, /^<dialog class="area-command-palette__modal" aria-label="Commands"><\/dialog>$/);
  for (const open of [{ open: true }, { defaultOpen: true }]) {
    const html = renderToString(h(CommandPalette, { items, ...open, query: "workspace", footer: h("span", null, "Custom hint") }));
    assert.match(html, /^<dialog[^>]*aria-label="Command palette">/);
    assert.match(html, /value="workspace"/);
    assert.equal((html.match(/role="option"/g) ?? []).length, 1);
    assert.match(html, /area-command-palette__footer"><span>Custom hint<\/span>/);
    assert.doesNotMatch(html, /area-command-palette--inline/);
  }
  const empty = renderToString(h(CommandPalette, { items, inline: true, defaultQuery: "missing", emptyText: "No commands", footer: false }));
  assert.match(empty, /area-command-palette__empty" role="presentation">No commands/);
  assert.doesNotMatch(empty, /role="option"|aria-activedescendant|area-command-palette__footer/);
});

// packages/react/src/components/CommandPalette.tsx:181-195; docs/specs/command-palette.md:64: hidden key hints stay out of tab order and disable on empty results.
test("CommandPalette default footer exposes only decorative non-tab-stop hints", () => {
  const html = renderToString(h(CommandPalette, { items: [], inline: true }));
  assert.match(html, /area-command-palette__footer" aria-hidden="true"/);
  const hints = html.match(/<button[^>]*>/g);
  assert.equal(hints.length, 3);
  for (const hint of hints) {
    assert.match(hint, /tabindex="-1"/);
    assert.match(hint, /disabled=""/);
  }
});
