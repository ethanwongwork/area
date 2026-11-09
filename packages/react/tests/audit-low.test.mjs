import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Calendar, MANIFESTS, NavGroup } from "../dist/modules/index.js";

// Low-severity owner calls from the 2026-09-29 audit.
const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

// The step became one icon column on 2026-11-01 (owner: "fix the alignment here", children 4 short of the parent's name).
test("a nested Nav group steps its rows in one icon column, onto the parent's name (audit D-20)", () => {
  assert.match(renderToString(h(NavGroup, { nested: true })), /class="area-nav__group area-nav__group--nested"/);
  assert.match(css, /\.area-nav__group--nested \{\s*--_nav-indent: calc\(var\(--area-icon-md\) \+ var\(--area-gap-row\)\);/);
  assert.match(css, /\.area-nav__group--nested \.area-nav__item \{ padding-inline-start: calc\(var\(--_inset-start\) \+ var\(--_nav-indent\)\); \}/);
});

test("Calendar draws its floating plate by default; plain drops it (audit F-21)", () => {
  assert.equal(MANIFESTS.calendar.defaults.variant, "surface");
  assert.match(renderToString(h(Calendar, { "aria-label": "Date", today: "2026-09-26" })), /class="area-calendar area-calendar--surface/);
  assert.match(css, /\.area-calendar--plain \{ padding: 0; border: 0; border-radius: 0; background-color: transparent; box-shadow: none; \}/);
});

test("the modal Dialog and its scrim fade and scale in on the motion axis (audit E-19)", () => {
  // Closed carries the exit clock (one step faster, docs/MOTION.md): base out, moderate in.
  // Command palette shares the rule (system gaps C7, 2026-11-07).
  assert.match(css, /:is\(\.area-dialog__modal, \.area-command-palette__modal\):not\(\[open\]\) \{ --_overlay-duration: var\(--area-duration-base\); --_overlay-fade: var\(--area-fade-base\); opacity: 0; scale: var\(--_overlay-scale\); \}/);
  assert.match(css, /@starting-style \{\s*:is\(\.area-dialog__modal, \.area-command-palette__modal\)\[open\] \{ opacity: 0; scale: var\(--_overlay-scale\); \}\s*:is\(\.area-dialog__modal, \.area-command-palette__modal\)\[open\]::backdrop \{ opacity: 0; \}/);
  assert.match(css, /:is\(\.area-dialog__modal, \.area-command-palette__modal\) \{[^}]*--_overlay-duration: var\(--area-duration-moderate\)/);
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

test("every hover rule sits under @media (hover: hover) (audit S21b; check merged from PR 32)", () => {
  const stack = [];
  let start = 0;
  const loose = [];
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "{") { stack.push(css.slice(start, i).trim()); start = i + 1; }
    else if (c === "}") { stack.pop(); start = i + 1; }
    else if (c === ";") start = i + 1;
    if (c === "{") {
      const selector = stack.at(-1);
      if (/:hover/.test(selector) && !selector.startsWith("@") && !stack.some(s => /@media[^{]*\(hover:\s*hover\)/.test(s))) loose.push(selector);
    }
  }
  assert.deepEqual(loose, []);
});
