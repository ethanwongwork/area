import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Textarea, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.textarea.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:201; packages/react/src/components/forms.tsx:85.
    test(`Textarea ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Textarea, { "aria-label": "Choice", [axis]: value }));
      const root = html.match(/<textarea\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.textarea.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/forms.tsx:85-94: native multiline control and all native props.
test("Textarea preserves native form, readonly and accessible naming props", () => {
  const html = renderToString(h(Textarea, { id: "notes", className: "custom", "aria-label": "Notes", "aria-describedby": "help", disabled: true, readOnly: true, name: "notes", defaultValue: "Line one\nLine two", rows: 4, maxLength: 80, fullWidth: true }));
  const textarea = html.match(/<textarea[^>]*>/)[0];
  for (const attr of ['id="notes"', 'aria-label="Notes"', 'aria-describedby="help"', 'disabled=""', 'readOnly=""', 'name="notes"', 'rows="4"', 'maxLength="80"']) assert.ok(textarea.includes(attr), attr);
  assert.match(textarea, /area-textarea--full-width[^\"]* custom/);
  assert.match(html, />Line one\nLine two<\/textarea>/);
});

// packages/react/src/components/forms.tsx:82: invalid entry points, success/warning and explicit false.
test("Textarea maps validation to native ARIA and data hooks", () => {
  for (const props of [{ invalid: true }, { validationStatus: "error" }, { "aria-invalid": "grammar" }]) {
    const html = renderToString(h(Textarea, { ...props, "aria-label": "Value" }));
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /data-invalid=""/);
  }
  for (const validationStatus of ["success", "warning"]) {
    const html = renderToString(h(Textarea, { validationStatus, "aria-label": "Value" }));
    assert.ok(html.includes(`data-${validationStatus}=""`));
    assert.doesNotMatch(html, /aria-invalid="true"|data-invalid/);
  }
  assert.match(renderToString(h(Textarea, { "aria-invalid": false })), /aria-invalid="false"/);
});
