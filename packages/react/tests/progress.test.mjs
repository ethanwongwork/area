import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Progress, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.progress.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:418; packages/react/src/components/primitives.tsx:416.
    test(`Progress ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Progress, { label: "Upload", value: 25, [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.progress.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/primitives.tsx:416-440: named progressbar, value bounds and bar child.
test("Progress serializes determinate value and native caller props", () => {
  const html = renderToString(h(Progress, { label: "Upload", value: 5, max: 20, id: "upload", className: "custom", "aria-describedby": "help", "aria-valuetext": "5 files" }));
  const root = html.match(/<div[^>]*>/)[0];
  for (const attr of ['role="progressbar"', 'aria-label="Upload"', 'aria-valuemin="0"', 'aria-valuemax="20"', 'aria-valuenow="5"', 'id="upload"', 'aria-describedby="help"', 'aria-valuetext="5 files"']) assert.ok(root.includes(attr));
  assert.match(root, /class="[^"]* custom"/);
  // The bar receives its percentage as --_progress-value (0-100); CSS translates it on the pixel grid (display.css).
  assert.match(html, /<div class="area-progress__bar" style="--_progress-value:25"><\/div><\/div>$/);
});

// packages/react/src/components/primitives.tsx:420-438: indeterminate omits current value and inline bar sizing.
test("Progress distinguishes indeterminate state from zero progress", () => {
  const pending = renderToString(h(Progress, { label: "Loading" }));
  assert.match(pending, /data-indeterminate=""/);
  assert.doesNotMatch(pending, /aria-valuenow|style=/);
  const zero = renderToString(h(Progress, { label: "Loading", value: 0 }));
  assert.match(zero, /aria-valuenow="0"/);
  assert.match(zero, /--_progress-value:0"/);
  assert.doesNotMatch(zero, /data-indeterminate/);
});
