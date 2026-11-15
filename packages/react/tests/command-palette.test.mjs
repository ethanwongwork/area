import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { CommandPalette, MANIFESTS, highlightMatch } from "../dist/modules/index.js";

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
  assert.match(empty, /area-menu__empty" role="presentation"><span class="area-menu__text">No commands/);
  assert.doesNotMatch(empty, /role="option"|aria-activedescendant|area-command-palette__footer/);
});

// packages/react/src/components/CommandPalette.tsx:181-195; docs/specs/command-palette.md:64: hidden key hints stay out of tab order and disable on empty results.
test("CommandPalette default footer is static, decorative hints: keycaps and words, no controls (round 68)", () => {
  const html = renderToString(h(CommandPalette, { items: [], inline: true }));
  assert.match(html, /area-command-palette__footer" aria-hidden="true"/);
  const footer = html.slice(html.indexOf("area-command-palette__footer"));
  assert.doesNotMatch(footer, /<button/);
  assert.equal(footer.match(/class="area-command-palette__hint"/g)?.length, 2); // Move, Open; Close only when modal
  assert.match(footer, /area-command-palette__keys"><span class="area-kbd area-kbd--sm area-kbd--default">/);
});

// docs/specs/command-palette.md, "Preview, path, matches and steps" (components audit V4, 2026-11-07).
const strip = html => html.replace(/<!-- -->/g, "");
test("CommandPalette marks the typed text in each result and shows a result's path after its name (V4)", () => {
  const html = strip(renderToString(h(CommandPalette, { inline: true, defaultQuery: "item", items: [
    { id: "a", label: "Item one", path: "Label / Item two", description: "Item" },
    { id: "b", label: "Other", path: "Projects / Item" },
  ] })));
  assert.match(html, /area-command-palette__text"><mark class="area-menu__match">Item<\/mark> one</);
  assert.match(html, /area-command-palette__path">Label \/ <mark class="area-menu__match">Item<\/mark> two</);
  assert.match(html, /area-command-palette__description"><mark class="area-menu__match">Item<\/mark></);
  assert.equal((html.match(/role="option"/g) ?? []).length, 2, "the path is searched too");
  const order = html.indexOf("area-command-palette__text") < html.indexOf("area-command-palette__path");
  assert.ok(order, "the path comes after the name");
  const idle = renderToString(h(CommandPalette, { inline: true, items: [{ id: "a", label: "Item one" }] }));
  assert.doesNotMatch(idle, /<mark/);
});

test("CommandPalette shows the active row's preview beside the results only while some row has one (V4)", () => {
  const html = strip(renderToString(h(CommandPalette, { inline: true, items: [
    { id: "a", label: "Item one", preview: h("p", null, "Preview one") },
    { id: "b", label: "Item two", preview: h("p", null, "Preview two") },
  ] })));
  assert.match(html.match(/<div[^>]*>/)[0], /data-preview=""/);
  assert.match(html, /area-command-palette__body"><div[^>]*area-command-palette__list/);
  assert.match(html, /<div class="area-command-palette__preview" role="region" aria-label="Preview"><p>Preview one<\/p><\/div>/);
  assert.doesNotMatch(html, /Preview two/);
  const named = renderToString(h(CommandPalette, { inline: true, previewLabel: "Page", items: [{ id: "a", label: "Item one", preview: "P" }] }));
  assert.match(named, /role="region" aria-label="Page"/);
  const none = renderToString(h(CommandPalette, { inline: true, items: [{ id: "a", label: "Item one" }] }));
  assert.doesNotMatch(none, /data-preview|area-command-palette__body|area-command-palette__preview/);
});

test("CommandPalette: a row with items opens a step, marked with a chevron (V4)", () => {
  const html = renderToString(h(CommandPalette, { inline: true, items: [{ id: "a", label: "Action…", items: [{ id: "b", label: "Option one" }] }] }));
  assert.match(html, /area-command-palette__more" aria-hidden="true"><svg[^>]*data-area-glyph="chevron-down"><g transform="rotate\(270 8 8\)"/);
  assert.doesNotMatch(html, /Option one/, "the step's rows wait until it opens");
  assert.doesNotMatch(html, /area-command-palette__back/, "Back shows only inside a step");
});

test("highlightMatch marks every case-insensitive occurrence and leaves text alone without a match", () => {
  const html = renderToString(h("span", null, highlightMatch("Item one, item two", " ITEM ")));
  assert.equal(html, '<span><mark class="area-menu__match">Item</mark> one, <mark class="area-menu__match">item</mark> two</span>');
  assert.equal(highlightMatch("Item one", ""), "Item one");
  assert.equal(highlightMatch("Item one", "zzz"), "Item one");
});
