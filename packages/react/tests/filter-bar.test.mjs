import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { FilterBar, FilterBarAdd, FilterBarItem, Menu, MenuItem, Popover } from "../dist/modules/index.js";

// Filter bar (components audit N5, 2026-11-07; docs/specs/filter-bar.md).
test("a named group of filters, then Add filter, then Reset while dirty", () => {
  const html = render(h(FilterBar, { dirty: true, onReset() {}, add: h(FilterBarAdd) }, h(FilterBarItem, { label: "Label", value: "Value" })));
  assert.match(html, /^<div role="group" aria-label="Filters" class="area-filter-bar">/);
  const order = ["area-filter-bar__item", "area-filter-bar__add", "area-filter-bar__reset"].map(part => html.indexOf(part));
  assert.ok(order.every(at => at > 0) && order[0] < order[1] && order[1] < order[2], html);
  assert.match(html, />Add filter</);
  assert.match(html, />Reset</);
  assert.doesNotMatch(render(h(FilterBar, { onReset() {} })), /__reset/, "not dirty: no Reset");
  assert.doesNotMatch(render(h(FilterBar, { dirty: true })), /__reset/, "no onReset: no Reset");
});

test("a filter is a small chip button: applied with a value, the dot when unsaved, a chevron at its end", () => {
  const applied = render(h(FilterBarItem, { label: "Label", value: "Value", dirty: true }));
  assert.match(applied, /^<button type="button" class="area-chip area-chip--assist area-chip--sm area-filter-bar__item" data-selected="">/);
  assert.match(applied, /<span class="area-chip__label">Label<!-- -->: <!-- -->Value<\/span><span class="area-filter-bar__dirty"><span class="area-sr-only">Unsaved<\/span><\/span><span class="area-chip__trailing-icon" aria-hidden="true"><svg/);
  assert.doesNotMatch(applied, /aria-pressed/, "a trigger is not a toggle");
  const empty = render(h(FilterBarItem, { label: "Label" }));
  assert.doesNotMatch(empty, /data-selected|__dirty|: /);
});

test("as a Popover's or Menu's trigger it takes the overlay's state", () => {
  const popover = render(h(Popover, { trigger: h(FilterBarItem, { label: "Label", value: "Value" }) }, "Body text"));
  assert.match(popover, /<button[^>]*class="area-chip[^"]*area-filter-bar__item"[^>]*aria-expanded="false"[^>]*aria-haspopup="dialog"/);
  const menu = render(h(Menu, { trigger: h(FilterBarAdd) }, h(MenuItem, null, "Option one")));
  assert.match(menu, /<button[^>]*aria-haspopup="menu"[^>]*>.*Add filter/);
});
