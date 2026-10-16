import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { PromptSuggestions, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.promptSuggestions.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:471; packages/react/src/components/PromptSuggestions.tsx:30.
    test(`PromptSuggestions ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(PromptSuggestions, { suggestions: [{ id: "draft", label: "Draft a note" }], [axis]: value }));
      const root = html.match(/<ul\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.promptSuggestions.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/PromptSuggestions.tsx:30-48: named list, independent named buttons, decorative icon.
test("PromptSuggestions composes list and chips uses with native list props", () => {
  for (const layout of MANIFESTS.promptSuggestions.variants.layout) {
    const html = renderToString(h(PromptSuggestions, { layout, label: "Start here", id: "prompts", className: "custom", "aria-describedby": "help", suggestions: [{ id: "draft", label: "Draft a note", icon: "P" }], onDismiss() {} }));
    const list = html.match(/<ul[^>]*>/)[0];
    for (const attr of ['aria-label="Start here"', 'id="prompts"', 'aria-describedby="help"']) assert.ok(list.includes(attr));
    assert.match(list, /class="[^"]* custom"/);
    assert.match(html, /<li class="area-prompt-suggestions__row"><button type="button"/);
    assert.match(html, /aria-hidden="true">P<\/span>/);
    assert.match(html, />Draft a note<\/span>/);
    assert.equal(html.includes('aria-label="Dismiss “Draft a note”"'), layout === "list");
    if (layout === "list") assert.match(html, /<\/button><span class="area-prompt-suggestions__dismiss"><button/);
    else assert.match(html, /area-button--outline/);
  }
});

// packages/react/src/components/PromptSuggestions.tsx:28-48: optional dismiss and empty list preserve default name.
test("PromptSuggestions omits dismiss controls unless requested", () => {
  const html = renderToString(h(PromptSuggestions, { suggestions: [{ id: "draft", label: "Draft a note" }] }));
  assert.match(html, /aria-label="Suggestions"/);
  assert.doesNotMatch(html, /area-prompt-suggestions__dismiss/);
  assert.doesNotMatch(renderToString(h(PromptSuggestions, { suggestions: [] })), /<li|<button/);
});
