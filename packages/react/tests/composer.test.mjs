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

// packages/react/src/components/Composer.tsx: empty and disabled block send; disabled blocks editing; loading swaps send for Stop.
test("Composer serializes empty, disabled and loading initial states", () => {
  for (const props of [{}, { disabled: true, defaultValue: "Hello" }]) {
    const html = renderToString(h(Composer, props));
    assert.match(html, /<button[^>]*disabled=""[^>]*aria-label="Send message"/);
    assert.equal(/<textarea[^>]*disabled=""/.test(html), !!props.disabled);
    if (props.disabled) {
      assert.match(html, /data-disabled=""/);
      // Action slots are fieldsets, so disabling the composer disables every nested action natively.
      assert.match(html, /<fieldset disabled=""/);
    }
  }
  // docs/specs/composer.md (audit S18): `loading` (`busy` is a deprecated alias) keeps the field
  // editable, sets aria-busy on the root and swaps send for a Stop button, disabled without onStop.
  for (const props of [{ loading: true, defaultValue: "Hello" }, { busy: true, defaultValue: "Hello" }]) {
    const html = renderToString(h(Composer, props));
    assert.match(html.match(/<div[^>]*>/)[0], /aria-busy="true"/);
    assert.doesNotMatch(html, /data-busy/);
    assert.doesNotMatch(html, /<textarea[^>]*disabled=""/);
    assert.doesNotMatch(html, /aria-label="Send message"/);
    assert.match(html, /<button[^>]*disabled=""[^>]*aria-label="Stop"/);
  }
  const stoppable = renderToString(h(Composer, { loading: true, onStop() {}, stopLabel: "Stop reply" }));
  assert.match(stoppable, /<button[^>]*aria-label="Stop reply"/);
  assert.doesNotMatch(stoppable.match(/<button[^>]*aria-label="Stop reply"[^>]*>/)[0], /disabled=""/);
  assert.doesNotMatch(renderToString(h(Composer, { value: "Hello" })), /disabled=""/);
});

// packages/react/src/components/Composer.tsx:37 accepts native inputProps; :120 spreads them before its own id and className.
test("Composer preserves a native inputProps id and labels the textarea with it", () => {
  // Composer.tsx:52-53: a consumer's inputProps.id wins over the generated one (audit G-15).
  const html = renderToString(h(Composer, { inputProps: { id: "draft", className: "custom-input" } }));
  const input = html.match(/<textarea[^>]*>/)[0];
  assert.match(input, / id="draft"/);
  assert.match(html, /<label for="draft"/);
});

test("Composer merges a native inputProps className onto the textarea", { todo: "BUG: inputProps.className is overwritten by className=\"area-composer__input\" after the spread (Composer.tsx:120)" }, () => {
  const html = renderToString(h(Composer, { inputProps: { id: "draft", className: "custom-input" } }));
  const input = html.match(/<textarea[^>]*>/)[0];
  assert.ok(input.match(/class="([^"]+)"/)[1].split(" ").includes("custom-input"));
});
