import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Separator, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.separator.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:392; packages/react/src/components/primitives.tsx:326.
    test(`Separator ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Separator, { [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.separator.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/primitives.tsx:326-339: separator role, orientation and native div passthrough.
test("Separator exposes orientation, inset and caller attributes", () => {
  for (const orientation of MANIFESTS.separator.variants.orientation) {
    const html = renderToString(h(Separator, { orientation, inset: true, id: "rule", className: "custom", "aria-label": "Sections", "aria-describedby": "help" }));
    for (const attr of ['role="separator"', `aria-orientation="${orientation}"`, 'id="rule"', 'aria-label="Sections"', 'aria-describedby="help"']) assert.ok(html.includes(attr));
    assert.match(html, /area-separator--inset custom/);
  }
});
