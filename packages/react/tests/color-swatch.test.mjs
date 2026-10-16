import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { ColorSwatch, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.colorSwatch.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:112; packages/react/src/components/ColorSwatch.tsx:14.
    test(`ColorSwatch ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(ColorSwatch, { color: "#336699", [axis]: value }));
      const root = html.match(/<span\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.colorSwatch.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/ColorSwatch.tsx:10-16: passive named image, caller override and native span props.
test("ColorSwatch names its color and accepts custom accessible text", () => {
  const plain = renderToString(h(ColorSwatch, { color: "#33669980" }));
  assert.match(plain, /role="img" aria-label="Color #33669980"/);
  assert.match(plain, /--_swatch-color:#33669980/);
  const custom = renderToString(h(ColorSwatch, { color: "transparent", id: "swatch", className: "custom", "aria-label": "No fill", "aria-describedby": "help", style: { opacity: 0.5 } }));
  for (const attr of ['id="swatch"', 'aria-label="No fill"', 'aria-describedby="help"', 'opacity:0.5', '--_swatch-color:transparent']) assert.ok(custom.includes(attr));
  assert.match(custom, /class="[^"]* custom"/);
});
