import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { BoxModel } from "../dist/modules/index.js";

test("one image named by its values; margin sides, border box with corners, padding box, dashed size", () => {
  const html = render(h(BoxModel, { margin: 24, border: 1, padding: 16, radius: 8, width: 608, height: 184, caption: "border-box" }));
  assert.match(html, /^<div role="img" aria-label="Margin 24, border 1, padding 16, radius 8, size 608 × 184" class="area-box-model area-box-model--info">/);
  assert.equal((html.match(/area-box-model__side area-box-model__side--top/g) || []).length, 3);
  assert.equal((html.match(/area-box-model__corner--/g) || []).length, 4);
  assert.match(html, /<div class="area-box-model__content"><span class="area-box-model__value">608 × 184<\/span><\/div>/);
  assert.match(html, /<span class="area-box-model__caption">border-box<\/span>/);
  assert.deepEqual([...html.matchAll(/area-box-model__label">([^<]+)</g)].map(m => m[1]), ["Margin", "Border", "Padding"]);
});

test("sides in CSS order or by name, corners per corner, missing values as a dash, tone and native props", () => {
  const html = render(h(BoxModel, { tone: "neutral", margin: [0, 16, 24, 16], padding: { top: 8 }, radius: [8, 8, 0, 0], width: 96, id: "box" }));
  assert.match(html, /aria-label="Margin 0 16 24 16, padding 8 – – –, radius 8 8 0 0, size 96 × –" id="box" class="area-box-model area-box-model--neutral"/);
  assert.doesNotMatch(render(h(BoxModel, { width: 1, height: 1 })), /__corner/);
});
