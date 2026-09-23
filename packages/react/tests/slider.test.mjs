import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { MANIFESTS, Slider, sliderVariants } from "../dist/modules/index.js";

const render = props => renderToString(h(Slider, props));

test("defaults to the normalized native midpoint", () => {
  const html = render({ "aria-label": "Volume", readout: true });
  assert.match(html, /--_pct:50%/);
  assert.match(html, />50<\/span>/);
  assert.match(html, /type="range"/);
});

test("clamps and snaps initial paint to min, max, and step", () => {
  const html = render({ "aria-label": "Scale", min: 0.5, max: 2, step: 0.25, defaultValue: 1.12, readout: value => `${value}×` });
  assert.match(html, /--_pct:33\.33333333333333%/);
  assert.match(html, />1×<\/span>/);
});

test("forwards native range props and exposes the justified size family", () => {
  const html = render({ "aria-label": "Columns", name: "columns", min: 1, max: 12, defaultValue: 8, disabled: true });
  assert.match(html, /data-disabled=""/);
  assert.match(html, /name="columns"/);
  assert.match(html, / disabled=""/);
  assert.deepEqual(MANIFESTS.slider.variants.size, ["sm", "md", "lg"]);
  assert.throws(() => sliderVariants({ size: "xxl" }), RangeError);
});

test("a custom readout is hidden from accessibility APIs to avoid duplicate values", () => {
  const html = render({ "aria-label": "Opacity", defaultValue: 25, readout: value => `${value}%` });
  assert.match(html, /area-slider__value" aria-hidden="true">25%/);
});

test("supports neutral and accent tones with label and orientation compositions", () => {
  const html = render({ label: "Temperature", tone: "accent", labelPosition: "top", orientation: "vertical", defaultValue: 42, readout: true });
  assert.match(html, /area-slider--accent/);
  assert.match(html, /area-slider--top/);
  assert.match(html, /area-slider--vertical/);
  assert.match(html, /area-slider__label">Temperature/);
  assert.match(html, /type="range"/);
  assert.deepEqual(MANIFESTS.slider.variants.labelPosition, ["top"]);
  assert.deepEqual(MANIFESTS.slider.variants.orientation, ["vertical"]);
  assert.deepEqual(MANIFESTS.slider.variants.tone, ["neutral", "accent"]);
});

test("renders interior marks only for an explicit discrete range", () => {
  const html = render({ min: 0, max: 5, step: 1, defaultValue: 1, stepMarks: true });
  assert.match(html, /area-slider__marks/);
  assert.equal((html.match(/--_mark/g) ?? []).length, 4);
});
