import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Spinner } from "../dist/modules/index.js";

test("without a value: the turning ring, hidden or a status", () => {
  assert.match(render(h(Spinner, {})), /^<span aria-hidden="true" class="area-spinner area-spinner--md"><\/span>$/);
  assert.match(render(h(Spinner, { label: "Loading" })), /role="status"/);
});

test("with a value: a progressbar, the SVG hidden, the arc's dash the value less a round cap", () => {
  const html = render(h(Spinner, { value: 62, label: "Uploading" }));
  assert.match(html, /^<span role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62" aria-label="Uploading" class="area-spinner area-spinner--md" data-determinate="">/);
  assert.match(html, /<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle class="area-spinner__track"/);
  const dash = Number(html.match(/stroke-dasharray="([\d.]+) 200"/)[1]);
  assert.ok(Math.abs(dash - (62 - 200 / (14 * Math.PI))) < 1e-9);
});

test("0 draws no arc; 100 closes the ring; over max clamps; a meter with its value text", () => {
  assert.match(render(h(Spinner, { value: 0 })), /stroke-dasharray="0 200" data-empty=""/);
  assert.match(render(h(Spinner, { value: 100 })), /stroke-dasharray="100 200"/);
  assert.match(render(h(Spinner, { value: 12, max: 10 })), /aria-valuenow="10"/);
  assert.match(render(h(Spinner, { role: "meter", value: 48, valueText: "48% of context used", size: "lg" })), /role="meter"[^>]*aria-valuetext="48% of context used"[^>]*class="area-spinner area-spinner--lg"/);
});
