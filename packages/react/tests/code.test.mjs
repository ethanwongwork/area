import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Code, Token, MANIFESTS } from "../dist/modules/index.js";

for (const [key, Component] of [["code", Code], ["token", Token]]) {
  // The former `ground` axis is now two boolean hooks (subtle, on-color); `swatch` is covered below.
  for (const ground of MANIFESTS[key].booleans.filter(flag => flag !== "swatch")) {
    // packages/styles/src/manifest.ts (code, token booleans); packages/react/src/components/primitives.tsx Code, Token.
    test(`${key} ${ground} maps its boolean React prop to the hook`, () => {
      const html = renderToString(h(Component, { [ground === "subtle" ? "subtle" : "onColor"]: true }, "accent"));
      assert.match(html, /^<code\b/);
      assert.ok(html.match(/class="([^"]+)"/)[1].split(" ").includes(`area-${key}--${ground}`));
    });
  }
  // packages/react/src/components/primitives.tsx:1455-1461,1867-1886: semantic code and decorative swatch slots.
  test(`${key} keeps literal text, native props and decorative swatch structure`, () => {
    const html = renderToString(h(Component, { id: "reference", className: "custom", "aria-label": "Accent reference", "aria-describedby": "help", swatch: "var(--area-accent)" }, "<accent>"));
    const root = html.match(/<code[^>]*>/)[0];
    for (const attr of ['id="reference"', 'aria-label="Accent reference"', 'aria-describedby="help"']) assert.ok(root.includes(attr));
    assert.match(root, /class="[^"]* custom"/);
    assert.ok(html.includes(`class="area-${key}__swatch" style="background:var(--area-accent)" aria-hidden="true"`));
    assert.ok(html.includes(`class="area-${key}__label">&lt;accent&gt;</span>`));
  });
}
