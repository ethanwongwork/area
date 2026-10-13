import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { AssetRow } from "../dist/modules/index.js";

test("preview well, name and meta; an element preview is decorative; native props reach the root", () => {
  const html = render(h(AssetRow, { preview: h("svg"), name: "icon/heart", meta: "SVG · 24 × 24", id: "a" }));
  assert.match(html, /^<div class="area-asset-row" id="a"><span class="area-asset-row__preview" aria-hidden="true"><svg><\/svg><\/span>/);
  assert.match(html, /<span class="area-asset-row__text"><span class="area-asset-row__name">icon\/heart<\/span><span class="area-asset-row__meta">SVG · 24 × 24<\/span><\/span><\/div>$/);
});

test("an image preview with its alternative; actions at the end; no meta line when omitted", () => {
  const html = render(h(AssetRow, { preview: "/a.png", previewAlt: "Pixels", name: "pixels", actions: h("button", null, "Download") }));
  assert.match(html, /<span class="area-asset-row__preview"><img src="\/a.png" alt="Pixels"\/><\/span>/);
  assert.doesNotMatch(html, /__meta/);
  assert.match(html, /<span class="area-asset-row__actions"><button>Download<\/button><\/span><\/div>$/);
});
