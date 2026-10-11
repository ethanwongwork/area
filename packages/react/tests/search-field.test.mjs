import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { SearchField } from "../dist/modules/index.js";

test("an empty search field: Input's shell with the search glyph, a search input, no clear action", () => {
  const html = render(h(SearchField, { "aria-label": "Search" }));
  assert.match(html, /^<div class="area-input area-input--outline area-input--md area-search-field">/);
  assert.match(html, /<span class="area-input__icon" aria-hidden="true"><svg [^>]*data-area-glyph="search"/);
  assert.match(html, /<input class="area-input__control" aria-label="Search" type="search" enterKeyHint="search" placeholder="Search" value=""/);
  assert.doesNotMatch(html, /area-search-field__clear|area-kbd/);
});

test("a query shows the clear action, named and out of the Tab order, in place of the shortcut", () => {
  const html = render(h(SearchField, { "aria-label": "Search", defaultValue: "plan", shortcut: ["cmd", "K"] }));
  assert.match(html, /<button type="button" class="area-input__action-button area-search-field__clear" aria-label="Clear search" tabindex="-1"/);
  assert.match(html, /data-area-glyph="dismiss-circle"/);
  assert.doesNotMatch(html, /area-kbd/);
  assert.match(html, /aria-keyshortcuts="Meta\+K"/);
});

test("an empty field with a shortcut shows the hint as a hidden Kbd, sized to the field", () => {
  const html = render(h(SearchField, { "aria-label": "Search", shortcut: ["cmd", "K"] }));
  assert.match(html, /<span class="area-input__affix"><span class="area-kbd area-kbd--sm area-kbd--default area-search-field__shortcut" aria-hidden="true">/);
  assert.match(render(h(SearchField, { "aria-label": "Search", size: "lg", shortcut: ["/"] })), /area-kbd area-kbd--md/);
});

test("disabled and read-only fields keep their query but offer no clear action; leadingIcon null drops the glyph", () => {
  assert.doesNotMatch(render(h(SearchField, { "aria-label": "Search", defaultValue: "plan", disabled: true })), /area-search-field__clear/);
  assert.doesNotMatch(render(h(SearchField, { "aria-label": "Search", value: "plan", readOnly: true })), /area-search-field__clear/);
  assert.doesNotMatch(render(h(SearchField, { "aria-label": "Search", leadingIcon: null })), /area-input__icon/);
});
