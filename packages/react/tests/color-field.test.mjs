import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { ColorField, ColorSwatch, normalizeHexColor, MANIFESTS } from "../dist/modules/index.js";

test("ColorField accepts short, long and alpha hex while rejecting incomplete colors", () => {
  assert.equal(normalizeHexColor("abc"), "#AABBCC");
  assert.equal(normalizeHexColor("#abc8"), "#AABBCC88");
  assert.equal(normalizeHexColor("#317c6b80"), "#317C6B80");
  assert.equal(normalizeHexColor("#12z"), null);
  assert.equal(normalizeHexColor("#12345"), null);
});

test("ColorField keeps a native named input and tokenized preview", () => {
  const html = renderToString(h(ColorField, { name: "fill", defaultValue: "#abc8", "aria-label": "Fill", size: "sm" }));
  assert.match(html, /area-color-field--sm/);
  assert.match(html, /--_swatch-color:#AABBCC88/);
  assert.match(html, /name="fill"/);
  assert.match(html, /value="#AABBCC88"/);
  assert.deepEqual(MANIFESTS.colorSwatch.variants.size, ["sm", "md", "lg"]);
  assert.match(renderToString(h(ColorSwatch, { color: "#00000000" })), /role="img" aria-label="Color #00000000"/);
});

test("with alpha, the colour and opacity group is named", () => {
  assert.match(renderToString(h(ColorField, { alpha: true, "aria-label": "Fill" })), /role="group"[^>]*aria-label="Color and opacity"|aria-label="Color and opacity"[^>]*role="group"/);
  assert.match(renderToString(h(ColorField, { alpha: true, groupLabel: "Fill", "aria-label": "Fill hex" })), /aria-label="Fill"/);
});
