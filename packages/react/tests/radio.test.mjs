import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Radio, RadioGroup, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.radio.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:245; packages/react/src/components/forms.tsx:287.
    test(`Radio ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Radio, { label: "Enable", [axis]: value }));
      const root = html.match(/<label\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.radio.block}--${value}`), root);
    });
  }
}
for (const [axis, values] of Object.entries(MANIFESTS.radioGroup.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:254; packages/react/src/components/forms.tsx:252.
    test(`RadioGroup ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(RadioGroup, { label: "Options", [axis]: value }));
      const root = html.match(/<fieldset\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.radioGroup.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/forms.tsx:287: label wraps native input; description appends to aria-describedby.
test("Radio preserves native checked, disabled, form and naming props", () => {
  for (const checked of [false, true]) {
    const html = renderToString(h(Radio, { label: "Enable", description: "Optional", id: "option", className: "custom", "aria-label": "Enable feature", "aria-describedby": "help", "aria-invalid": true, disabled: true, name: "feature", value: "enabled", defaultChecked: checked }));
    const input = html.match(/<input[^>]*>/)[0];
    for (const attr of ['type="radio"', 'id="option"', 'aria-label="Enable feature"', 'aria-invalid="true"', 'disabled=""', 'name="feature"', 'value="enabled"']) assert.ok(input.includes(attr), attr);
    assert.equal(input.includes('checked=""'), checked);
    assert.match(html, /<label class="[^"]* custom" data-disabled=""/);
    const description = html.match(/area-choice-label__description" id="([^"]+)"/)[1];
    assert.ok(input.includes(`aria-describedby="help ${description}"`));
    assert.match(html, /area-choice-label__title">Enable<\/span>/);
  }
});

// packages/react/src/components/forms.tsx:235: native fieldset/legend and described validation slots.
test("RadioGroup names the fieldset and connects descriptions and errors", () => {
  const html = renderToString(h(RadioGroup, { label: "Options", description: "Choose", error: "Required", disabled: true, id: "options", className: "custom", "aria-label": "Feature options", "aria-describedby": "help" }, h(Radio, { label: "Enable" })));
  const fieldset = html.match(/<fieldset[^>]*>/)[0];
  for (const attr of ['id="options"', 'aria-label="Feature options"', 'disabled=""', 'aria-invalid="true"', 'data-invalid=""']) assert.ok(fieldset.includes(attr), attr);
  assert.match(fieldset, /class="[^"]* custom"/);
  assert.match(html, /<legend class="area-radio-group__legend">Options<\/legend>/);
  const ids = [...html.matchAll(/class="area-radio-group__(?:description|validation)" id="([^"]+)"/g)].map(m => m[1]);
  assert.equal(ids.length, 2);
  assert.ok(fieldset.includes(`aria-describedby="help ${ids.join(" ")}"`));
  assert.match(html, /area-radio-group__options"><label/);
});

// packages/react/src/components/forms.tsx:239-296: group selected value/name/disabled and explicit child overrides.
test("RadioGroup selects one native value and allows individual name and disabled overrides", () => {
  for (const selection of [{ defaultValue: "design" }, { value: "design" }]) {
    const html = renderToString(h(RadioGroup, { label: "Team", name: "team", disabled: true, ...selection }, h(Radio, { value: "design", label: "Design team" }), h(Radio, { value: "engineering", label: "Engineering team", name: "override", disabled: false })));
    const inputs = html.match(/<input[^>]*>/g);
    assert.equal(inputs.length, 2);
    for (const attr of ['name="team"', 'checked=""', 'disabled=""', 'value="design"']) assert.ok(inputs[0].includes(attr));
    assert.match(inputs[1], /name="override"/);
    assert.doesNotMatch(inputs[1], /disabled=|checked=/);
  }
});
