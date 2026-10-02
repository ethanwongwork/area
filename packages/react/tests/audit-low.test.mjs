import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Calendar, MANIFESTS, NavGroup } from "../dist/modules/index.js";

// Low-severity owner calls from the 2026-09-29 audit.
const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

test("a nested Nav group steps its rows in by Tree view's level (audit D-20)", () => {
  assert.match(renderToString(h(NavGroup, { nested: true })), /class="area-nav__group area-nav__group--nested"/);
  assert.match(css, /\.area-nav__group--nested \{\s*--_nav-indent: calc\(var\(--area-icon-md\) \+ 6px\);/);
  assert.match(css, /\.area-nav__group--nested \.area-nav__item \{ padding-inline-start: calc\(max\(0px, calc\(\(var\(--_box-height\) - var\(--_box-start\)\) \/ 2 - var\(--_box-border\)\)\) \+ var\(--_nav-indent\)\); \}/);
});

test("Calendar draws its floating plate by default; plain drops it (audit F-21)", () => {
  assert.equal(MANIFESTS.calendar.defaults.variant, "surface");
  assert.match(renderToString(h(Calendar, { "aria-label": "Date", today: "2026-09-26" })), /class="area-calendar area-calendar--surface/);
  assert.match(css, /\.area-calendar--plain \{ padding: 0; border: 0; border-radius: 0; background-color: transparent; box-shadow: none; \}/);
});

test("the modal Dialog and its scrim fade and scale in on the motion axis (audit E-19)", () => {
  assert.match(css, /\.area-dialog__modal:not\(\[open\]\) \{ opacity: 0; scale: var\(--_overlay-scale\); \}/);
  assert.match(css, /@starting-style \{\s*\.area-dialog__modal\[open\] \{ opacity: 0; scale: var\(--_overlay-scale\); \}\s*\.area-dialog__modal\[open\]::backdrop \{ opacity: 0; \}/);
  assert.match(css, /\.area-dialog__modal \{[^}]*--_overlay-duration: var\(--area-duration-base\)/);
});

test("Popover has a close part and its title level is settable (audit E-8)", async () => {
  const { Popover, PopoverHeader, PopoverTitle, PopoverClose } = await import("../dist/modules/index.js");
  const html = renderToString(h(Popover, null, h(PopoverHeader, null, h(PopoverTitle, null, "Title"), h(PopoverClose))));
  // The title registers itself as the label after mount; on the server it renders its id.
  assert.match(html, /<h2 id="[^"]+-title" class="area-popover__title">Title<\/h2>/);
  assert.match(html, /<button type="button" class="area-button area-button--ghost area-button--neutral area-button--sm[^"]*"[^>]*aria-label="Close"/);
  assert.match(renderToString(h(PopoverTitle, { level: false }, "Title")), /^<div class="area-popover__title">Title<\/div>$/);
  assert.match(renderToString(h(PopoverTitle, { level: 3 }, "Title")), /^<h3 class="area-popover__title">/);
});

test("collections are items and names are aria-label, with the old props as aliases (audit H-14, D-18)", async () => {
  const { Tabs, Segmented, ChipGroup } = await import("../dist/modules/index.js");
  const tabs = [{ id: "one", label: "One" }, { id: "two", label: "Two" }];
  const viaItems = renderToString(h(Tabs, { items: tabs, "aria-label": "Label" }));
  assert.equal((viaItems.match(/role="tab"/g) ?? []).length, 2);
  assert.match(viaItems, /role="tablist" aria-label="Label"/);
  assert.match(renderToString(h(Tabs, { tabs, label: "Label" })), /role="tablist" aria-label="Label"/);
  const options = [{ value: "a", label: "One" }, { value: "b", label: "Two" }];
  assert.match(renderToString(h(Segmented, { items: options, "aria-label": "Label" })), /role="radiogroup" aria-label="Label"/);
  assert.match(renderToString(h(Segmented, { options, label: "Label" })), /role="radiogroup" aria-label="Label"/);
  assert.match(renderToString(h(ChipGroup, { "aria-label": "Label" })), /role="group" aria-label="Label"/);
});

test("manifest values don't repeat their axis or borrow the density's word (audit H-13)", async () => {
  const { Button, Card, IndicatorAnchor, Indicator } = await import("../dist/modules/index.js");
  assert.deepEqual(MANIFESTS.button.variants.align, ["start", "end"]);
  assert.match(renderToString(h(Button, { align: "start" }, "Button")), /area-button--start/);
  assert.match(renderToString(h(Card, { layout: "thumbnail" })), /area-card--thumbnail/);
  const anchor = renderToString(h(IndicatorAnchor, { inset: true, overlap: "circular", indicator: h(Indicator, { count: 1 }) }, h("span", null, "x")));
  assert.match(anchor, /area-indicator-anchor--circular area-indicator-anchor--inset|area-indicator-anchor--inset[^"]*area-indicator-anchor--circular|area-indicator-anchor--circular[^"]*area-indicator-anchor--inset/);
  assert.equal(MANIFESTS.switch.variants.tone, undefined);
  assert.match(css, /\.area-switch \{[^}]*--_on: var\(--area-switch-color, var\(--area-selection-solid\)\)/);
});
