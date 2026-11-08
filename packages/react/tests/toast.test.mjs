import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Toast, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.toast.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:588; packages/react/src/components/primitives.tsx:1181.
    test(`Toast ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Toast, { children: "Saved", [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.toast.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/primitives.tsx:1181-1194: status content, optional title/icon and actions outside the live region.
test("Toast preserves native surface props and separates announcement from named actions", () => {
  const html = renderToString(h(Toast, { id: "notice", className: "custom", "aria-label": "Save result", "aria-describedby": "help", title: "Saved", icon: "I", onDismiss() {}, dismissLabel: "Close notice", action: h("button", { disabled: true }, "Undo") }, "Project updated"));
  assert.match(html, /^<div class="[^"]* custom" id="notice" aria-label="Save result" aria-describedby="help">/);
  assert.match(html, /area-toast__icon" aria-hidden="true">I/);
  assert.match(html, /class="area-toast__content" role="status" aria-atomic="true"><div class="area-toast__title">Saved<\/div><div class="area-toast__description">Project updated<\/div><\/div><div class="area-toast__actions"><button disabled="">Undo/);
  assert.match(html, /<button[^>]*aria-label="Close notice"/);
});

// packages/react/src/components/primitives.tsx:1192-1194: plain content has no title/description class or optional actions.
test("Toast supports a plain announcement without optional controls", () => {
  const html = renderToString(h(Toast, null, "Saved"));
  assert.match(html, /role="status" aria-atomic="true"><div>Saved<\/div>/);
  assert.doesNotMatch(html, /area-toast__(?:title|description|action|dismiss)|<button/);
});

test("Toast takes caution and discovery, and its part is __actions as Alert's (components audit O4, O7)", () => {
  for (const tone of ["caution", "discovery"]) assert.match(renderToString(h(Toast, { tone }, "Saved")), new RegExp(`area-toast--${tone}`));
  assert.match(renderToString(h(Toast, { actions: h("button", null, "Undo") }, "Saved")), /<div class="area-toast__actions"><button>Undo<\/button><\/div>/);
  // The deprecated prop still renders, in the new part; the old part stays in the manifest for plain HTML.
  assert.match(renderToString(h(Toast, { action: h("button", null, "Undo") }, "Saved")), /area-toast__actions/);
  assert.ok(MANIFESTS.toast.elements.includes("actions") && MANIFESTS.toast.elements.includes("action"));
});

test("a Toaster toast with actions (or the deprecated action) waits to be dismissed", async () => {
  const source = (await import("node:fs")).readFileSync(new URL("../src/components/Toaster.tsx", import.meta.url), "utf8");
  assert.match(source, /options\.actions \?\? options\.action \? Infinity/);
});
