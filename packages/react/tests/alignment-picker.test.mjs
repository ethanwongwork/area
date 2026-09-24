import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { AlignmentPicker, ALIGNMENT_POSITIONS, MANIFESTS } from "../dist/modules/index.js";

test("AlignmentPicker renders one named native radio choice at each physical position", () => {
  const html = renderToString(h(AlignmentPicker, { label: "Object alignment", name: "alignment", defaultValue: "bottom-right", required: true }));
  assert.match(html, /role="radiogroup" aria-label="Object alignment" dir="ltr"/);
  assert.deepEqual(ALIGNMENT_POSITIONS, [
    "top-left", "top-center", "top-right", "middle-left", "center", "middle-right", "bottom-left", "bottom-center", "bottom-right",
  ]);
  assert.equal((html.match(/type="radio"/g) ?? []).length, 9);
  assert.equal((html.match(/name="alignment"/g) ?? []).length, 9);
  assert.equal((html.match(/required=""/g) ?? []).length, 9);
  assert.match(html, /<input[^>]*aria-label="bottom right"[^>]*checked="" value="bottom-right"/);
  assert.deepEqual(MANIFESTS.alignmentPicker.variants.size, ["sm", "md", "lg"]);
});
