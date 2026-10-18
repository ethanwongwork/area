import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { CustomSelect, Select, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.select.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:216; packages/react/src/components/forms.tsx:40.
    test(`Select ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Select, { "aria-label": "Choice", [axis]: value }));
      const root = html.match(/<select\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.select.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/forms.tsx:40-49: props reach the native select and native options.
test("Select keeps native selection, name, disabled and label semantics", () => {
  const html = renderToString(h(Select, { id: "team", className: "custom", "aria-label": "Team", "aria-describedby": "help", disabled: true, name: "team", defaultValue: "design", fullWidth: true }, h("option", { value: "engineering" }, "Engineering team"), h("option", { value: "design" }, "Design team")));
  const select = html.match(/<select[^>]*>/)[0];
  for (const attr of ['id="team"', 'aria-label="Team"', 'aria-describedby="help"', 'disabled=""', 'name="team"']) assert.ok(select.includes(attr), attr);
  assert.match(select, /area-select--full-width[^\"]* custom/);
  assert.match(html, /<option value="design" selected="">Design team<\/option>/);
  assert.match(html, /<option value="engineering">Engineering team<\/option>/);
});

// packages/react/src/components/forms.tsx:37: invalid entry points, success/warning and explicit false.
test("Select maps validation to native ARIA and data hooks", () => {
  for (const props of [{ invalid: true }, { validationStatus: "error" }, { "aria-invalid": "grammar" }]) {
    const html = renderToString(h(Select, { ...props, "aria-label": "Value" }));
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /data-invalid=""/);
  }
  for (const validationStatus of ["success", "warning"]) {
    const html = renderToString(h(Select, { validationStatus, "aria-label": "Value" }));
    assert.ok(html.includes(`data-${validationStatus}=""`));
    assert.doesNotMatch(html, /aria-invalid="true"|data-invalid/);
  }
  assert.match(renderToString(h(Select, { "aria-invalid": false })), /aria-invalid="false"/);
});

// packages/react/src/components/CustomSelect.tsx: onHighlightChange is a callback, never a DOM attribute, and a closed
// list reports nothing (the effect runs only in a browser).
test("CustomSelect keeps onHighlightChange off the trigger", () => {
  const html = renderToString(h(CustomSelect, { "aria-label": "Radius", items: [{ value: "8", label: "8 (Default)" }], value: "8", onHighlightChange: () => {} }));
  assert.doesNotMatch(html, /onhighlightchange/i);
  assert.match(html, /role="combobox"/);
});
