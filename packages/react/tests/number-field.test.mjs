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

test("split steppers put minus before the value and plus after it (owner 2026-10-21)", () => {
  const html = renderToString(h(NumberField, { "aria-label": "Columns", defaultValue: 0, min: 0, steppers: "split" }));
  assert.match(html, /area-number-field--split/);
  const minus = html.indexOf("Decrease Columns"), input = html.indexOf('role="spinbutton"'), plus = html.indexOf("Increase Columns");
  assert.ok(minus > -1 && minus < input && input < plus, "minus, value, plus");
  assert.match(html, /aria-label="Decrease Columns" disabled=""/, "minus disables at min");
  assert.deepEqual(MANIFESTS.numberField.variants.steppers, ["split"]);
  // Stacked steppers keep both buttons after the value.
  const end = renderToString(h(NumberField, { "aria-label": "Columns", defaultValue: 2, steppers: true }));
  assert.ok(end.indexOf('role="spinbutton"') < end.indexOf("Decrease Columns"));
  assert.doesNotMatch(end, /area-number-field--split/);
});

test("trailing renders a control at the field's end, after the unit and before the steppers", () => {
  const html = renderToString(h(NumberField, { "aria-label": "Width", defaultValue: 360, unit: "px", steppers: true, trailing: h("button", { type: "button" }, "Fill") }));
  const unit = html.indexOf("area-number-field__unit"), trailing = html.indexOf("area-number-field__trailing"), steppers = html.indexOf("area-number-field__steppers");
  assert.ok(unit < trailing && trailing < steppers);
  assert.doesNotMatch(renderToString(h(NumberField, { "aria-label": "Width" })), /area-number-field__trailing/);
});
