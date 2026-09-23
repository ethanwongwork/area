import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Field, NumberField, MANIFESTS, numberFieldVariants } from "../dist/modules/index.js";
import { calculateNumber, steppedNumber } from "../dist/modules/components/number-math.js";

test("bounded calculation supports precedence, relative entry, decimals and rejects code", () => {
  assert.equal(calculateNumber("2+3*4"), 14);
  assert.equal(calculateNumber("(2+3)*4"), 20);
  assert.equal(calculateNumber("+8", 24), 32);
  assert.equal(calculateNumber("-8", 24), -8);
  assert.equal(calculateNumber("-8+2", 24), -6);
  assert.equal(calculateNumber("1,5+2", 0, ",", "."), 3.5);
  assert.equal(calculateNumber("1/0"), null);
  assert.equal(calculateNumber("Math.random()"), null);
  assert.equal(calculateNumber("(".repeat(81)), null);
});

test("Field associations and validation reach the NumberField input", () => {
  const html = renderToString(h(Field, { label: "X", error: "Required" }, h(NumberField, { defaultValue: null, required: true })));
  assert.match(html, /aria-labelledby="[^"]+-label"/);
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /data-invalid=""/);
  assert.match(html, /aria-errormessage="[^"]+-validation"/);
});

test("fractional stepping remains stable and bounded", () => {
  assert.equal(steppedNumber(1.25, 1, 0.05, 0, 2), 1.3);
  assert.equal(steppedNumber(1.95, 10, 0.05, 0, 2), 2);
});

test("NumberField forwards a named spinbutton and serializes a canonical form value", () => {
  const html = renderToString(h(NumberField, { "aria-label": "Width", name: "width", defaultValue: 12.5, unit: "px", min: 0, steppers: true, scrub: true }));
  assert.match(html, /role="spinbutton"/);
  assert.match(html, /aria-valuenow="12.5"/);
  assert.match(html, /aria-valuetext="12.5 px"/);
  assert.match(html, /type="hidden" name="width" value="12.5"/);
  assert.match(html, /aria-label="Increase Width"/);
  assert.match(html, /aria-label="Decrease Width"/);
  assert.deepEqual(MANIFESTS.numberField.variants.size, ["sm", "md", "lg"]);
  assert.throws(() => numberFieldVariants({ size: "xxl" }), RangeError);
});
