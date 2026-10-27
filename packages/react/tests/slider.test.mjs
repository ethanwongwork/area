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
  assert.deepEqual(MANIFESTS.slider.variants.labelPosition, ["top", "inside"]);
  assert.deepEqual(MANIFESTS.slider.variants.orientation, ["vertical"]);
  assert.equal(MANIFESTS.slider.variants.tone, undefined);
});

test("renders interior marks only for an explicit discrete range", () => {
  const html = render({ min: 0, max: 5, step: 1, defaultValue: 1, stepMarks: true });
  assert.match(html, /area-slider__marks/);
  assert.equal((html.match(/--_mark/g) ?? []).length, 4);
});

test("rail is the default; track and bar are variants on Slider and SliderRange", () => {
  assert.deepEqual(MANIFESTS.slider.variants.variant, ["track", "bar"]);
  assert.deepEqual(MANIFESTS.sliderRange.variants.variant, ["track", "bar"]);
  const rail = render({ "aria-label": "Volume", variant: "rail" });
  assert.doesNotMatch(rail, /area-slider--(rail|track|bar)/);
  assert.match(render({ "aria-label": "Volume", variant: "track" }), /area-slider--track/);
  assert.match(render({ "aria-label": "Volume", variant: "bar" }), /area-slider--bar/);
  const range = renderToString(h(SliderRange, { variant: "bar", defaultValue: [20, 60], inputs: false }));
  assert.match(range, /area-slider-range--bar/);
  assert.equal((range.match(/area-slider--bar/g) ?? []).length, 2, "both handles take the variant");
  assert.match(range, /--_slider-range-start:0\.2;--_slider-range-end:0\.6/);
});

test("hands the CSS the value as a ratio so a full-height fill ends at the thumb's centre", () => {
  assert.match(render({ "aria-label": "Volume", defaultValue: 25 }), /--_pct:25%;--_slider-ratio:0\.25/);
});

test("the knob is plain: no fill-colour dot, and hover paints the fill only (owner 2026-10-21)", () => {
  const css = readFileSync(new URL("../../styles/src/components/slider.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /radial-gradient\(circle, var\(--_fill\)/);
  assert.match(css, /--_knob: light-dark\(var\(--area-bg-surface\), var\(--area-bg-component-active\)\)/);
  assert.match(css, /\.area-slider__track:hover \{ --_fill: var\(--_fill-hover\)/);
});

test("buffered is a ratio in the slider's own units, clamped, and absent unless given", () => {
  assert.doesNotMatch(render({ "aria-label": "Position", defaultValue: 30 }), /--_buffered/);
  assert.match(render({ "aria-label": "Position", min: 0, max: 200, defaultValue: 30, buffered: 150 }), /--_buffered:0\.75/);
  assert.match(render({ "aria-label": "Position", defaultValue: 30, buffered: 400 }), /--_buffered:1/);
  assert.match(render({ "aria-label": "Position", defaultValue: 30, buffered: 60 }), /<span class="area-slider__buffer"><\/span><span class="area-slider__fill">/, "drawn behind the fill");
  assert.doesNotMatch(render({ "aria-label": "Position", defaultValue: 30 }), /area-slider__buffer/);
});

test("startLabel and endLabel name the ends under the track, hidden from assistive tech", () => {
  const html = render({ "aria-label": "Intensity", defaultValue: 4, startLabel: "Low", endLabel: "High" });
  assert.match(html, /<span class="area-slider__ends" aria-hidden="true"><span class="area-slider__end">Low<\/span><span class="area-slider__end">High<\/span><\/span>/);
  assert.doesNotMatch(render({ "aria-label": "Intensity" }), /area-slider__ends/);
});

// Label inside (owner 2026-10-24, was variant "field"; folded into bar 2026-10-26): label and value inside a bar.
test("a bar with its label inside carries its label and value and shows the value by default", () => {
  const html = render({ variant: "bar", labelPosition: "inside", label: "Label", defaultValue: 40 });
  assert.match(html, /area-slider--bar/);
  assert.match(html, /area-slider--inside/);
  assert.match(html, /area-slider__label">Label</);
  assert.match(html, /area-slider__value" aria-hidden="true">40</);
  assert.doesNotMatch(render({ labelPosition: "inside", label: "Label", readout: false }), /area-slider__value/);
  assert.match(render({ labelPosition: "inside", label: "Label", defaultValue: 8, max: 16, readout: v => `${v}px` }), /aria-valuetext="8px"/);
  assert.match(render({ labelPosition: "inside", label: "Label" }), /area-slider--bar/, "inside makes the slider a bar");
  assert.doesNotMatch(render({ labelPosition: "inside", label: "Label", orientation: "vertical" }), /area-slider--vertical/, "horizontal only");
  assert.doesNotMatch(render({ labelPosition: "inside", label: "Label", startLabel: "Low", endLabel: "High" }), /area-slider__ends/);
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  const rule = css.slice(css.indexOf(".area-slider.area-slider--inside {"));
  assert.match(rule, /--_track: var\(--_height\)/, "the bar is the control's full height");
  assert.match(rule, /--_reach: 1/, "the fill reaches past the grip, which sits inside it");
  assert.match(css, /\.area-slider--inside > \.area-slider__track \{ position: absolute; z-index: 0; inset: 0/, "any point of the bar drags it");
});

test("variant field is a deprecated alias of the bar with its label inside", () => {
  const html = render({ variant: "field", label: "Label", defaultValue: 40 });
  assert.match(html, /area-slider--bar/);
  assert.match(html, /area-slider--inside/);
  assert.doesNotMatch(html, /area-slider--field/);
  assert.match(html, /area-slider__value" aria-hidden="true">40</);
});

// Motion (owner 2026-10-26): the input keeps the behaviour, the drawing eases on everything but a drag.
test("the rail, fill and thumb are drawn after the input, inside the track, hidden from assistive tech", () => {
  const html = render({ "aria-label": "Volume", defaultValue: 25 });
  assert.match(html, /<span class="area-slider__track"><input[^>]*type="range"[^>]*\/><span class="area-slider__rail" aria-hidden="true"><span class="area-slider__fill"><\/span><\/span><span class="area-slider__thumb" aria-hidden="true"><\/span><\/span>/);
  assert.doesNotMatch(html, /data-pressed|data-dragging/, "at rest neither pressed nor dragging");
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  assert.match(css, /@property --_slider-ratio \{ syntax: "<number>"; inherits: true; initial-value: 0; \}/);
  assert.match(css, /transition: --_slider-ratio var\(--area-duration-fast\) var\(--area-ease-out\)/, "everything but a drag eases");
  assert.match(css, /\.area-slider\[data-dragging\] \{ transition: none; \}/, "a drag follows the pointer exactly");
  assert.match(css, /\.area-slider\[data-pressed\]:not\(\[data-disabled\]\) \.area-slider__thumb \{\s*scale: var\(--_lift\)/, "a press lifts the knob");
  assert.match(css, /--_lift: calc\(1 \+ \(1 - var\(--area-feedback-scale\)\) \* 4\)/, "the lift follows the Feedback setting");
  assert.match(css, /\.area-slider__control:focus-visible ~ \.area-slider__thumb \{/, "the ring is on the drawn knob");
});

test("a bar draws its step marks as dots inside it", () => {
  const html = render({ variant: "bar", min: 0, max: 5, step: 1, defaultValue: 1, stepMarks: true });
  assert.equal((html.match(/--_mark/g) ?? []).length, 4);
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  assert.match(css, /\.area-slider--bar \.area-slider__marks i \{[^}]*border-radius: var\(--area-radius-full\)/);
});

// Owner 2026-10-26 ("consistent"): every bar ends rounded with its line inside; the label-inside bar rounds its fill.
test("every bar's fill ends rounded with its line inside, and from an origin only the thumb's end rounds", () => {
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  assert.match(css, /\.area-slider--inside \.area-slider__fill \{\s*border-start-end-radius: var\(--_thumb-radius\);\s*border-end-end-radius: var\(--_thumb-radius\);/);
  assert.match(css, /\.area-slider--inside\[data-origin\] \.area-slider__fill \{[^}]*border-start-start-radius: calc\(var\(--_down\) \* var\(--_thumb-radius\)\)/);
  assert.match(css, /--_thumb-radius: min\(var\(--_track-radius\), var\(--_thumb\) \/ 2\)/, "both bars share the end's corner");
});

// Origin (owner 2026-10-24, the Temperature bar): the fill runs between the origin and the value, either side of it.
test("origin fills from a neutral middle to the value, either way, and is absent unless given", () => {
  const warm = render({ labelPosition: "inside", label: "Temperature", min: -8, max: 8, origin: 0, defaultValue: 4 });
  assert.match(warm, /data-origin=""/);
  assert.match(warm, /--_slider-ratio:0\.75;--_origin:0\.5/);
  const cool = render({ labelPosition: "inside", label: "Temperature", min: -8, max: 8, origin: 0, defaultValue: -8 });
  assert.match(cool, /--_slider-ratio:0;--_origin:0\.5/);
  assert.doesNotMatch(render({ labelPosition: "inside", label: "Label", defaultValue: 40 }), /data-origin|--_origin/);
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  // The ends follow the easing ratio, so the fill eases either side of the origin; at the origin it is empty.
  assert.match(css, /--_lo: min\(var\(--_origin\), var\(--_slider-ratio\)\)/);
  assert.match(css, /--_hi: max\(var\(--_origin\), var\(--_slider-ratio\)\)/);
});
