import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { readFileSync } from "node:fs";
import { Splitter, MANIFESTS } from "../dist/modules/index.js";

// Splitter (components audit N6, 2026-11-07; docs/specs/splitter.md).
const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, " "), body }));
const ruleFor = selector => rules.find(rule => rule.selector === selector)?.body ?? "";

test("two panes and a focusable separator between them that controls the sized one", () => {
  const html = render(h(Splitter, { id: "split", defaultSize: 144, handleLabel: "Resize sidebar" }, h("div", null, "Item one"), h("div", null, "Item two")));
  assert.match(html, /^<div id="split" class="area-splitter area-splitter--horizontal">/);
  const pane = html.match(/<div class="area-splitter__pane" id="([^"]+)" data-sized="" style="--area-splitter-size:144px"><div>Item one<\/div><\/div>/);
  assert.ok(pane, "the start pane holds the size");
  assert.match(html, new RegExp(`<div role="separator" tabindex="0" class="area-splitter__handle" data-side="start" aria-orientation="vertical" aria-controls="${pane[1]}" aria-label="Resize sidebar" aria-valuenow="144" aria-valuemin="50" aria-valuetext="144 pixels"><\\/div>`));
  assert.match(html, /<div class="area-splitter__pane"><div>Item two<\/div><\/div><\/div>$/);
  assert.deepEqual(MANIFESTS.splitter.variants.orientation, ["horizontal", "vertical"]);
});

test("vertical stacks the panes, the separator across them; side end sizes the second; limits and at a limit", () => {
  const html = render(h(Splitter, { orientation: "vertical", side: "end", size: 96, minSize: 96, maxSize: 240 }, h("div"), h("div")));
  assert.match(html, /class="area-splitter area-splitter--vertical"/);
  assert.match(html, /<div class="area-splitter__pane"><div><\/div><\/div><div role="separator"[^>]*data-side="end" data-limit="min" aria-orientation="horizontal"[^>]*aria-valuenow="96" aria-valuemin="96" aria-valuemax="240" aria-valuetext="96 pixels \(minimum\)"/);
  assert.match(html, /<div class="area-splitter__pane" id="[^"]+-end" data-sized="" style="--area-splitter-size:96px">/);
});

test("without a size the regions start even, and the separator reads its value once laid out", () => {
  const html = render(h(Splitter, null, h("div"), h("div")));
  assert.match(html, /data-sized=""><div><\/div><\/div>/, "no size written: half, from the stylesheet");
  assert.doesNotMatch(html, /aria-valuenow/);
  assert.match(ruleFor(".area-splitter__pane[data-sized]"), /flex:\s*0 0 var\(--area-splitter-size, 50%\)/);
});

test("the handle: a 1 line in the layout, a 4 hit area, 12 after the pointer rests 300 ms; 20 on touch; never animated", () => {
  const handle = ruleFor(".area-splitter__handle");
  assert.match(handle, /--_sash-layout:\s*var\(--area-border-width\)/);
  assert.match(handle, /--_sash-hit:\s*4px/);
  assert.match(handle, /--_sash-hit-hover:\s*12px/);
  assert.match(ruleFor(".area-splitter__handle:hover"), /--_sash-hit:\s*var\(--_sash-hit-hover\);\s*transition-delay:\s*var\(--_sash-delay\)/);
  assert.match(ruleFor(".area-splitter__handle"), /touch-action:\s*none/);
  assert.match(css, /@media \(pointer: coarse\)\s*\{\s*\.area-splitter__handle\s*\{\s*--_sash-hit:\s*20px/);
  // The hit area widens with a step after the wait: zero-length transitions, which reduced motion has nothing to stop.
  for (const selector of [".area-splitter--horizontal > .area-splitter__handle", ".area-splitter--vertical > .area-splitter__handle"]) {
    const transition = ruleFor(selector).match(/transition:\s*([^;]+)/)?.[1] ?? "";
    assert.ok(transition && transition.split(",").every(part => /^[a-z-]+ 0s$/.test(part.trim())), `${selector}: ${transition}`);
    assert.doesNotMatch(ruleFor(selector), /var\(--area-duration/);
  }
});

test("it never writes a live region and keeps Panel's keyboard steps", () => {
  const source = readFileSync(new URL("../src/components/Splitter.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(source, /aria-live|role="status"/);
  assert.match(source, /STEP = 8, STEP_LARGE = 32, MIN_SIZE = 50/);
  assert.match(source, /onDoubleClick=\{even\}/);
});
