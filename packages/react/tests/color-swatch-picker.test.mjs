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
