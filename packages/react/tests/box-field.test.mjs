import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { BoxField, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.boxField.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:514; packages/react/src/components/BoxField.tsx:108.
    test(`BoxField ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(BoxField, { label: "Padding", [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)[0];
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.boxField.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/BoxField.tsx:47-67,97-119: positional field names, grouped labels, toggle state and CSS-order form value.
test("BoxField renders linked and independent sides/corners with named controls", () => {
  const cases = [
    ["sides", false, ["Horizontal padding", "Vertical padding"]],
    ["sides", true, ["Left padding", "Top padding", "Right padding", "Bottom padding"]],
    ["corners", false, ["Padding"]],
    ["corners", true, ["Top left padding", "Top right padding", "Bottom left padding", "Bottom right padding"]],
  ];
  for (const [kind, independent, labels] of cases) {
    const html = renderToString(h(BoxField, { kind, independent, label: "Padding", defaultValue: [8, 8, 8, 8], name: "padding", id: "padding", className: "custom", "aria-describedby": "help" }));
    const root = html.match(/<div[^>]*>/)[0];
    assert.match(root, /role="group"/);
    for (const attr of ['id="padding"', 'aria-describedby="help"']) assert.ok(root.includes(attr));
    assert.match(root, /class="[^"]* custom"/);
    const labelId = root.match(/aria-labelledby="([^"]+)"/)[1];
    assert.ok(html.includes(`id="${labelId}" class="area-box-field__label">Padding</span>`));
    const inputs = html.match(/<input[^>]*role="spinbutton"[^>]*>/g);
    assert.equal(inputs.length, labels.length);
    assert.deepEqual(inputs.map(input => input.match(/aria-label="([^"]+)"/)[1]), labels);
    const toggle = html.match(/<button[^>]*aria-pressed[^>]*>/)[0];
    assert.ok(toggle.includes(`aria-pressed="${independent}"`));
    assert.ok(toggle.includes(`aria-label="Individual padding per ${kind === "sides" ? "side" : "corner"}"`));
    assert.equal(root.includes('data-independent=""'), independent);
    assert.match(html, /<input type="hidden" name="padding" value="8 8 8 8"\/>/);
  }
});

// packages/react/src/components/BoxField.tsx:99-119: mixed fields, disabled editors/toggle/form value, optional toggle and hidden caption.
test("BoxField handles mixed, disabled and fixed-layout form usages", () => {
  const mixed = renderToString(h(BoxField, { label: "Padding", value: [8, 16, 8, 24], name: "padding", disabled: true }));
  const inputs = mixed.match(/<input[^>]*>/g);
  assert.ok(inputs.every(input => input.includes('disabled=""')));
  assert.match(mixed, /placeholder="Mixed"/);
  assert.match(mixed, /<button[^>]*disabled=""/);
  assert.match(mixed, /type="hidden"[^>]*value="8 16 8 24"/);
  const fixed = renderToString(h(BoxField, { kind: "corners", label: "Radius", hideLabel: true, toggle: false, name: "radius", value: [null, 8, 8, 8] }));
  assert.match(fixed, /class="area-sr-only">Radius<\/span>/);
  assert.match(fixed, /area-box-field__field--wide/);
  assert.doesNotMatch(fixed, /area-box-field__toggle/);
  assert.match(fixed, /<input type="hidden" name="radius" value=""\/>/);
});
