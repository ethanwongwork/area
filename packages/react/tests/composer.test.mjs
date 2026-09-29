import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Composer, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.composer.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:191; packages/react/src/components/Composer.tsx:80.
    test(`Composer ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Composer, { [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.composer.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/Composer.tsx:78-96: label/input association and inline versus footer slots.
test("Composer names its textarea and keeps independent action slots in both layouts", () => {
  for (const layout of MANIFESTS.composer.variants.layout) {
    const html = renderToString(h(Composer, { layout, label: "Message", defaultValue: "Hello", leadingActions: h("button", null, "Attach"), trailingActions: h("button", null, "Record"), mode: h("button", null, "Model"), id: "composer", className: "custom", "aria-describedby": "help", inputProps: { name: "message", "aria-label": "Draft", "aria-invalid": true }, submitLabel: "Send draft" }));
    const input = html.match(/<textarea[^>]*>/)[0];
    const id = input.match(/ id="([^"]+)"/)[1];
    assert.ok(html.includes(`for="${id}" class="area-sr-only">Message</label>`));
    for (const attr of ['name="message"', 'aria-label="Draft"', 'aria-invalid="true"', `rows="${layout === "inline" ? 1 : 2}"`]) assert.ok(input.includes(attr));
    assert.match(html, />Hello<\/textarea>/);
    assert.match(html, /id="composer" aria-describedby="help" class="[^"]* custom"/);
    assert.equal(html.includes('area-composer__footer'), layout === "stacked");
    for (const name of ["Attach", "Record", "Model"]) assert.match(html, new RegExp(`<button>${name}</button>`));
    assert.match(html, /<button[^>]*aria-label="Send draft"/);
  }
});

// packages/react/src/components/Composer.tsx:78-85: empty, busy and disabled block send; busy/disabled block editing.
test("Composer serializes empty, disabled and busy initial states", () => {
  for (const props of [{}, { disabled: true, defaultValue: "Hello" }, { busy: true, defaultValue: "Hello" }]) {
    const html = renderToString(h(Composer, props));
    assert.match(html, /<button[^>]*disabled=""[^>]*aria-label="Send message"/);
    assert.equal(/<textarea[^>]*disabled=""/.test(html), !!(props.disabled || props.busy));
    if (props.disabled) assert.match(html, /data-disabled=""/);
    if (props.busy) assert.match(html, /data-busy=""/);
  }
  assert.doesNotMatch(renderToString(h(Composer, { value: "Hello" })), /disabled=""/);
});
