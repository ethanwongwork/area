import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { ModelPicker, MANIFESTS } from "../dist/modules/index.js";

const models = [{ value: "fast", label: "Fast", description: "Quick replies" }, { value: "deep", label: "Deep", disabled: true }];

// packages/react/src/components/ModelPicker.tsx:34-37,58-70: named trigger/menu, native props, initial selection and disabled row.
test("ModelPicker renders a named menu button and single-choice rows", () => {
  for (const selected of [{}, { defaultValue: "deep" }, { value: "deep" }]) {
    const html = renderToString(h(ModelPicker, { models, label: "Model", heading: "Available models", id: "models", className: "custom", "aria-describedby": "help", ...selected }));
    const root = html.match(/<div[^>]*>/)[0];
    for (const attr of ['id="models"', 'aria-describedby="help"']) assert.ok(root.includes(attr));
    assert.match(root, /class="area-model-picker custom"/);
    const trigger = html.match(/<button[^>]*>/)[0];
    const target = trigger.match(/aria-controls="([^"]+)"/)[1];
    for (const attr of ['aria-haspopup="menu"', 'aria-expanded="false"', `aria-label="Model: ${selected.value || selected.defaultValue ? "Deep" : "Fast"}"`]) assert.ok(trigger.includes(attr));
    const menu = html.match(/<div[^>]*role="menu"[^>]*>/)[0];
    for (const attr of [`id="${target}"`, 'popover="auto"', 'aria-label="Model"']) assert.ok(menu.includes(attr));
    const rows = html.match(/<button[^>]*role="menuitemradio"[^>]*>/g);
    assert.equal(rows.length, 2);
    const checkedIndex = selected.value || selected.defaultValue ? 1 : 0;
    rows.forEach((row, i) => assert.ok(row.includes(`aria-checked="${i === checkedIndex}"`)));
    assert.match(rows[1], /disabled=""[^>]*data-disabled=""/);
    assert.match(html, /area-menu__label">Available models/);
    assert.match(html, /area-menu__description">Quick replies/);
  }
});

// packages/react/src/components/ModelPicker.tsx:25,60: the trigger accepts the Button size family.
test("ModelPicker forwards every supported trigger size", () => {
  for (const size of MANIFESTS.button.variants.size) {
    const html = renderToString(h(ModelPicker, { models, size }));
    assert.ok(html.match(/<button[^>]*>/)[0].includes(`area-button--${size}`));
  }
});
