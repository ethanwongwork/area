import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { ColorSwatchPicker, MANIFESTS } from "../dist/modules/index.js";

test("ColorSwatchPicker renders labeled native choices and a selected form value", () => {
  const html = renderToString(h(ColorSwatchPicker, {
    label: "Fill color", name: "fill", defaultValue: "#317C6B", required: true, columns: 2,
    options: [
      { value: "#6855E8", label: "Violet" },
      { value: "#317C6B", label: "Teal" },
      { value: "#D4A334", label: "Ochre", disabled: true },
    ],
  }));
  assert.match(html, /role="radiogroup" aria-label="Fill color"/);
  assert.match(html, /style="--_columns:2"/);
  assert.equal((html.match(/type="radio"/g) ?? []).length, 3);
  assert.equal((html.match(/name="fill"/g) ?? []).length, 3);
  assert.match(html, /<input[^>]*required=""[^>]*aria-label="Teal"[^>]*checked="" value="#317C6B"/);
  assert.match(html, /<input[^>]*disabled=""[^>]*aria-label="Ochre"/);
  assert.deepEqual(MANIFESTS.colorSwatchPicker.variants, { size: ["sm", "md", "lg"], layout: ["grid", "row", "palette"] });
});

// color.css: the palette's ring is a layer over its cells (round 81); as the grid's outline the positioned swatches
// covered it and a white cell lost its corner on a white page. Selected and focused cells stay above it.
test("the palette ring paints over the cells, under the selected and focused cell", async () => {
  const { readFileSync } = await import("node:fs");
  const css = readFileSync(new URL("../../styles/src/components/color-swatch-picker.css", import.meta.url), "utf8");
  const ring = css.match(/\.area-color-swatch-picker--palette::after \{([^}]*)\}/)?.[1] ?? "";
  assert.match(ring, /z-index: 1;/);
  assert.match(ring, /box-shadow: inset 0 0 0 var\(--area-stroke-width\) var\(--area-token-swatch-ring\)/);
  assert.doesNotMatch(css.match(/\.area-color-swatch-picker--palette \{([^}]*)\}/)[1], /outline:/);
  assert.match(css, /__cell:has\(input:checked\) \{ z-index: 2;/);
  assert.match(css, /__cell:has\(input:focus-visible\) \{[^}]*z-index: 3;/);
});
