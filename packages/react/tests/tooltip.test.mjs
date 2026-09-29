import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Tooltip, MANIFESTS } from "../dist/modules/index.js";

for (const side of MANIFESTS.tooltip.variants.side) {
  // packages/styles/src/manifest.ts:579; packages/react/src/components/primitives.tsx:1007: side and arrow hooks.
  test(`Tooltip side=${side} renders its manifest hook`, () => {
    const html = renderToString(h(Tooltip, { side, arrow: true }, "Details"));
    const root = html.match(/<div[^>]*>/)[0];
    const classes = root.match(/class="([^"]+)"/)[1].split(" ");
    assert.ok(classes.includes(`area-tooltip--${side}`));
    assert.ok(classes.includes("area-tooltip--arrow"));
  });
}

// packages/react/src/components/primitives.tsx:1007-1015; docs/specs/tooltip.md:115: tooltip role, text and native surface attributes.
test("Tooltip inline usage retains text and caller surface attributes", () => {
  const html = renderToString(h(Tooltip, { id: "hint", className: "custom", "aria-label": "Save hint", "aria-describedby": "help" }, "Save changes"));
  assert.match(html, /^<div role="tooltip"/);
  for (const attr of ['id="hint"', 'aria-label="Save hint"', 'aria-describedby="help"']) assert.ok(html.includes(attr));
  assert.match(html, /class="[^"]* custom"/);
  assert.match(html, />Save changes<\/div>$/);
  assert.doesNotMatch(html, /tabindex|area-tooltip--arrow/);
});

// packages/react/src/components/Overlays.tsx:220-240: tooltip appends its id to existing descriptions without changing button name or expanded state.
test("Tooltip describes its native trigger and keeps its own manual popover", () => {
  const html = renderToString(h(Tooltip, { className: "custom", trigger: h("button", { id: "save", disabled: true, "aria-label": "Save", "aria-describedby": "help" }, "Save") }, "Save changes"));
  const trigger = html.match(/<button[^>]*>/)[0];
  const tooltip = html.match(/<div role="tooltip"[^>]*>/)[0];
  const target = tooltip.match(/ id="([^"]+)"/)[1];
  for (const attr of ['id="save"', 'disabled=""', 'aria-label="Save"', `aria-describedby="help ${target}"`]) assert.ok(trigger.includes(attr));
  assert.match(tooltip, /popover="manual"/);
  assert.match(tooltip, /class="[^"]* custom"/);
  assert.doesNotMatch(trigger, /aria-expanded|aria-haspopup/);
  assert.doesNotMatch(tooltip, /tabindex/);
});

// packages/react/src/components/primitives.tsx:1012 and Overlays.tsx:234: native id in rest is overwritten by generated overlay props.
test.skip("Tooltip preserves a caller-provided surface id with a trigger (known bug: generated overlay id overwrites caller id)", () => {
  const html = renderToString(h(Tooltip, { id: "caller-surface", "aria-label": "Details", trigger: h("button", null, "Details") }, "Details"));
  const surface = html.match(/<div[^>]*role="tooltip"[^>]*>/)[0];
  assert.match(surface, / id="caller-surface"/);
  assert.match(html.match(/<button[^>]*>/)[0], /aria-describedby="caller-surface"/);
});
