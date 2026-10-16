import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Checkbox, CheckboxGroup, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.checkbox.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:227; packages/react/src/components/forms.tsx:140.
    test(`Checkbox ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Checkbox, { label: "Enable", ...(axis === "layout" ? { variant: "card" } : {}), [axis]: value }));
      const root = html.match(/<label\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.checkbox.block}--${value}`), root);
    });
  }
}
for (const [axis, values] of Object.entries(MANIFESTS.checkboxGroup.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:236; packages/react/src/components/forms.tsx:193.
    test(`CheckboxGroup ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(CheckboxGroup, { label: "Options", [axis]: value }));
      const root = html.match(/<fieldset\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.checkboxGroup.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/forms.tsx:140: label wraps native input; description appends to aria-describedby.
test("Checkbox preserves native checked, disabled, form and naming props", () => {
  for (const checked of [false, true]) {
    const html = renderToString(h(Checkbox, { label: "Enable", description: "Optional", id: "option", className: "custom", "aria-label": "Enable feature", "aria-describedby": "help", "aria-invalid": true, disabled: true, name: "feature", value: "enabled", defaultChecked: checked }));
    const input = html.match(/<input[^>]*>/)[0];
    for (const attr of ['type="checkbox"', 'id="option"', 'aria-label="Enable feature"', 'aria-invalid="true"', 'disabled=""', 'name="feature"', 'value="enabled"']) assert.ok(input.includes(attr), attr);
    assert.equal(input.includes('checked=""'), checked);
    assert.match(html, /<label class="[^"]* custom" data-disabled=""/);
    const description = html.match(/area-choice-label__description" id="([^"]+)"/)[1];
    assert.ok(input.includes(`aria-describedby="help ${description}"`));
    assert.match(html, /area-choice-label__title">Enable<\/span>/);
  }
});

// packages/react/src/components/forms.tsx:180: native fieldset/legend and described validation slots.
test("CheckboxGroup names the fieldset and connects descriptions and errors", () => {
  const html = renderToString(h(CheckboxGroup, { label: "Options", description: "Choose", error: "Required", disabled: true, id: "options", className: "custom", "aria-label": "Feature options", "aria-describedby": "help" }, h(Checkbox, { label: "Enable" })));
  const fieldset = html.match(/<fieldset[^>]*>/)[0];
  for (const attr of ['id="options"', 'aria-label="Feature options"', 'disabled=""', 'aria-invalid="true"', 'data-invalid=""']) assert.ok(fieldset.includes(attr), attr);
  assert.match(fieldset, /class="[^"]* custom"/);
  assert.match(html, /<legend class="area-checkbox-group__legend">Options<\/legend>/);
  const ids = [...html.matchAll(/class="area-checkbox-group__(?:description|validation)" id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, 2);
  assert.ok(fieldset.includes(`aria-describedby="help ${ids.join(" ")}"`));
  assert.match(html, /area-checkbox-group__options"><label/);
});

// packages/react/src/components/forms.tsx:125-160: caption precedence, invalid and SSR mixed hook (DOM indeterminate is ref-only).
test("Checkbox card composes a decorative visual, caption and mixed/invalid hooks", () => {
  const html = renderToString(h(Checkbox, { variant: "card", label: "Enable", description: "replaced", caption: "Caption", leadingVisual: "Icon", invalid: true, indeterminate: true }));
  assert.match(html, /<input[^>]*aria-invalid="true"[^>]*data-invalid=""[^>]*data-indeterminate=""/);
  assert.match(html, /area-checkbox__visual" aria-hidden="true">Icon/);
  assert.match(html, /area-choice-label__description"[^>]*>Caption/);
  assert.doesNotMatch(html, /replaced/);
});

// packages/react/src/components/forms.tsx:186-205: non-error group validation paints without aria-invalid.
test("CheckboxGroup success and warning retain validation descriptions", () => {
  for (const validationStatus of ["success", "warning"]) {
    const html = renderToString(h(CheckboxGroup, { label: "Options", validationStatus, validation: "Selection saved" }, h(Checkbox, { label: "Enable" })));
    assert.ok(html.includes(`data-${validationStatus}=""`));
    assert.doesNotMatch(html, /aria-invalid="true"/);
    assert.match(html, /area-checkbox-group__validation" id="[^"]+">Selection saved/);
  }
});
