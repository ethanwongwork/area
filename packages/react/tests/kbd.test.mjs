import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Kbd, KbdGroup, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.kbd.variants)) {
  // quiet is deprecated (owner 2026-10-22) and renders the default keycap, so it has no hook of its own.
  for (const value of values.filter(value => value !== "quiet")) {
    // packages/styles/src/manifest.ts:673; packages/react/src/components/primitives.tsx:1808.
    test(`Kbd ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Kbd, { keys: ["ctrl", "k"], [axis]: value }));
      const root = html.match(/<span\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.kbd.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/primitives.tsx:1808-1841: spoken text replaces decorative legends, group composes chords.
test("KbdGroup preserves chord order, spoken names and native span props", () => {
  const html = renderToString(h(KbdGroup, { id: "sequence", className: "custom", "aria-describedby": "help" }, h(Kbd, { keys: ["ctrl", "k"], id: "first", className: "chord", "aria-label": "Shortcut" }), h(Kbd, { keys: ["c"] })));
  assert.match(html, /^<span class="area-kbd-group custom" id="sequence" aria-describedby="help">/);
  assert.match(html, /class="[^"]* chord" id="first" aria-label="Shortcut"/);
  assert.match(html, /area-sr-only">Control plus K<\/span>/);
  assert.equal((html.match(/<kbd class="area-kbd__key" aria-hidden="true">/g) ?? []).length, 3);
  assert.match(html, /area-sr-only">C<\/span>/);
  // Quiet is a value of the `variant` axis (docs/specs/kbd.md); the deprecated `appearance` alias still maps to it.
  // quiet is deprecated (owner 2026-10-22: every key has its backplate) and renders the keycap.
  assert.match(renderToString(h(Kbd, { keys: ["k"], variant: "quiet" })), /area-kbd--default/);
  assert.match(renderToString(h(Kbd, { keys: ["k"], appearance: "quiet" })), /area-kbd--default/);
});
