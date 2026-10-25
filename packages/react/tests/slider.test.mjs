import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { MANIFESTS, Slider, SliderRange, sliderVariants } from "../dist/modules/index.js";
import { readFileSync } from "node:fs";

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

test("supports label and orientation compositions", () => {
  const html = render({ label: "Temperature", labelPosition: "top", orientation: "vertical", defaultValue: 42, readout: true });
  assert.match(html, /area-slider--top/);
  assert.match(html, /area-slider--vertical/);
  assert.match(html, /area-slider__label">Temperature/);
  assert.match(html, /type="range"/);
  assert.deepEqual(MANIFESTS.slider.variants.labelPosition, ["top"]);
  assert.deepEqual(MANIFESTS.slider.variants.orientation, ["vertical"]);
  assert.equal(MANIFESTS.slider.variants.tone, undefined);
});

test("renders interior marks only for an explicit discrete range", () => {
  const html = render({ min: 0, max: 5, step: 1, defaultValue: 1, stepMarks: true });
  assert.match(html, /area-slider__marks/);
  assert.equal((html.match(/--_mark/g) ?? []).length, 4);
});

test("rail is the default; track and bar are variants on Slider and SliderRange", () => {
  assert.deepEqual(MANIFESTS.slider.variants.variant, ["track", "bar", "field"]);
  assert.deepEqual(MANIFESTS.sliderRange.variants.variant, ["track", "bar"]);
  const rail = render({ "aria-label": "Volume", variant: "rail" });
  assert.doesNotMatch(rail, /area-slider--(rail|track|bar)/);
  assert.match(render({ "aria-label": "Volume", variant: "track" }), /area-slider--track/);
  assert.match(render({ "aria-label": "Volume", variant: "bar" }), /area-slider--bar/);
  const range = renderToString(h(SliderRange, { variant: "bar", defaultValue: [20, 60], inputs: false }));
  assert.match(range, /area-slider-range--bar/);
  assert.equal((range.match(/area-slider--bar/g) ?? []).length, 2, "both handles take the variant");
  assert.match(range, /--_range-start-ratio:0\.2;--_range-end-ratio:0\.6/);
});

test("hands the CSS the value as a ratio so a full-height fill ends at the thumb's centre", () => {
  assert.match(render({ "aria-label": "Volume", defaultValue: 25 }), /--_pct:25%;--_ratio:0\.25/);
});

test("the knob is plain: no fill-colour dot, and hover paints the fill only (owner 2026-10-21)", () => {
  const css = readFileSync(new URL("../../styles/src/components/slider.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /radial-gradient\(circle, var\(--_fill\)/);
  assert.match(css, /--_knob: light-dark\(var\(--area-bg-surface\), var\(--area-bg-component-active\)\)/);
  assert.match(css, /:hover:not\(:disabled\) \{ --_fill: var\(--_fill-hover\)/);
});

test("buffered is a ratio in the slider's own units, clamped, and absent unless given", () => {
  assert.doesNotMatch(render({ "aria-label": "Position", defaultValue: 30 }), /--_buffered/);
  assert.match(render({ "aria-label": "Position", min: 0, max: 200, defaultValue: 30, buffered: 150 }), /--_buffered:0\.75/);
  assert.match(render({ "aria-label": "Position", defaultValue: 30, buffered: 400 }), /--_buffered:1/);
  const css = readFileSync(new URL("../../styles/src/components/slider.css", import.meta.url), "utf8");
  assert.match(css, /var\(--_buffer-fill\) 0 var\(--_buffer-stop, 0%\)/);
});

test("startLabel and endLabel name the ends under the track, hidden from assistive tech", () => {
  const html = render({ "aria-label": "Intensity", defaultValue: 4, startLabel: "Low", endLabel: "High" });
  assert.match(html, /<span class="area-slider__ends" aria-hidden="true"><span class="area-slider__end">Low<\/span><span class="area-slider__end">High<\/span><\/span>/);
  assert.doesNotMatch(render({ "aria-label": "Intensity" }), /area-slider__ends/);
});

// Field (owner 2026-10-24): label and value inside a field-height bar, dragged from any point.
test("field carries its label and value inside the bar and shows the value by default", () => {
  const html = render({ variant: "field", label: "Label", defaultValue: 40 });
  assert.match(html, /area-slider--field/);
  assert.match(html, /area-slider__label">Label</);
  assert.match(html, /area-slider__value" aria-hidden="true">40</);
  assert.doesNotMatch(render({ variant: "field", label: "Label", readout: false }), /area-slider__value/);
  assert.match(render({ variant: "field", label: "Label", defaultValue: 8, max: 16, readout: v => `${v}px` }), /aria-valuetext="8px"/);
  assert.doesNotMatch(render({ variant: "field", label: "Label", orientation: "vertical" }), /area-slider--vertical/, "field is horizontal only");
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  const rule = css.slice(css.indexOf(".area-slider.area-slider--field {"));
  assert.match(rule, /--_track: var\(--_height\)/, "the bar is the control's full height");
  assert.match(rule, /--_thumb-paint: transparent/, "no grip: the fill's end is the value");
  assert.match(css, /\.area-slider--field > \.area-slider__control \{ position: absolute; z-index: 0; inset: 0/, "any point of the bar drags it");
});

// Origin (owner 2026-10-24, the Temperature bar): the fill runs between the origin and the value, either side of it.
test("origin fills from a neutral middle to the value, either way, and is absent unless given", () => {
  const warm = render({ variant: "field", label: "Temperature", min: -8, max: 8, origin: 0, defaultValue: 4 });
  assert.match(warm, /data-origin=""/);
  assert.match(warm, /--_lo:0\.5;--_hi:0\.75/);
  const cool = render({ variant: "field", label: "Temperature", min: -8, max: 8, origin: 0, defaultValue: -8 });
  assert.match(cool, /--_lo:0;--_hi:0\.5/);
  assert.match(render({ variant: "field", label: "Temperature", min: -8, max: 8, origin: 0, defaultValue: 0 }), /--_lo:0\.5;--_hi:0\.5/, "at the origin the bar is empty");
  assert.doesNotMatch(render({ variant: "field", label: "Label", defaultValue: 40 }), /data-origin|--_lo/);
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  assert.match(css, /\.area-slider\[data-origin\] \.area-slider__control \{[^}]*--_rail: linear-gradient\(var\(--_fill-dir, to right\), var\(--_track-fill\) 0 var\(--_from\), var\(--_fill\) 0 var\(--_to\)/);
});
