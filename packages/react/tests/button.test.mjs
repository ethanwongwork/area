import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Button, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.button.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:38; packages/react/src/components/Button.tsx:75.
    test(`Button ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Button, { children: "Save", [axis]: axis === "align" ? value.replace("align-", "") : value }));
      const root = html.match(/<button\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.button.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/Button.tsx:72-96: native button, state and named icon slots.
test("Button forwards native props and separates label from decorative icons", () => {
  const html = renderToString(h(Button, { id: "save", className: "custom", "aria-label": "Save project", "aria-describedby": "help", disabled: true, name: "intent", value: "save", type: "submit", icon: "before", trailingIcon: "after" }, "Save"));
  const button = html.match(/<button[^>]*>/)[0];
  for (const attr of ['id="save"', 'aria-label="Save project"', 'aria-describedby="help"', 'disabled=""', 'name="intent"', 'value="save"', 'type="submit"']) assert.ok(button.includes(attr), attr);
  assert.match(button, /class="[^"]* custom"/);
  assert.match(html, /<span class="area-button__icon" aria-hidden="true">before<\/span><span class="area-button__label">Save<\/span><span class="area-button__icon" aria-hidden="true">after<\/span>/);
});

// packages/react/src/components/Button.tsx:69-96: loading disables, selected is pressed, iconOnly omits label.
test("Button exposes both toggle states and loading semantics", () => {
  for (const selected of [false, true]) {
    const html = renderToString(h(Button, { selected }, "Pin"));
    assert.match(html, new RegExp(`aria-pressed="${selected}"`));
    assert.equal(html.includes('data-selected=""'), selected);
  }
  const busy = renderToString(h(Button, { loading: true, icon: "replaced" }, "Save"));
  for (const attr of ['type="button"', 'disabled=""', 'aria-busy="true"', 'data-loading=""']) assert.ok(busy.includes(attr));
  assert.match(busy, /area-spinner[^>]*aria-hidden="true"/);
  assert.doesNotMatch(busy, /replaced/);
  const icon = renderToString(h(Button, { iconOnly: true, fullWidth: true, pill: true, "aria-label": "Save", icon: "S" }, "ignored"));
  for (const flag of MANIFESTS.button.booleans) assert.ok(icon.includes(`area-button--${flag}`));
  assert.match(icon, /aria-label="Save"/);
  assert.doesNotMatch(icon, /area-button__label|ignored/);
});
