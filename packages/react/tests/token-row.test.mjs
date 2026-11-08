import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { TokenRow } from "../dist/modules/index.js";

test("one plate: the token's own classes on the row, swatch, name and value; native props reach the root", () => {
  const html = render(h(TokenRow, { swatch: "#1E1E1E", name: "color/text/default", value: "#1E1E1E", id: "t" }));
  assert.match(html, /^<div class="area-code area-code--swatch area-token-row" id="t"><span class="area-code__swatch" style="background:#1E1E1E" aria-hidden="true"><\/span><span class="area-code__label">color\/text\/default<\/span><span class="area-token-row__value">#1E1E1E<\/span><\/div>$/);
});

test("no swatch, outline, and copyable as a named button that speaks through the shared announcer", () => {
  assert.match(render(h(TokenRow, { name: "space/16", value: "16", outline: true })), /^<div class="area-code area-token-row area-token-row--outline">/);
  const html = render(h(TokenRow, { name: "color/bg/brand", value: "#0D99FF", copyable: true }));
  assert.match(html, /^<button type="button" class="area-code area-token-row area-token-row--copyable" aria-label="Copy color\/bg\/brand, #0D99FF">/);
  assert.doesNotMatch(html, /aria-live/);
  assert.match(html, /<\/button>$/);
});
