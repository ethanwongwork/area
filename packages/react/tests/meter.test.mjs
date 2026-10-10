import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Meter } from "../dist/modules/index.js";

test("a meter named by its label and described by its line, with the percentage as its value", () => {
  const html = render(h(Meter, { label: "Storage", description: "1.2 of 5 GB used", value: 24 }));
  assert.match(html, /^<div role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="24" aria-valuetext="24%" aria-labelledby="([^"]+)-label" aria-describedby="\1-description" class="area-meter area-meter--neutral">/);
  assert.match(html, /<div class="area-meter__header"><div id="[^"]+-label" class="area-meter__label">Storage<\/div><span class="area-meter__value" aria-hidden="true">24%<\/span><\/div>/);
  assert.match(html, /<div class="area-progress area-progress--md area-meter__track" aria-hidden="true"><div class="area-progress__bar" style="--_progress-value:24"><\/div><\/div><p id="[^"]+-description" class="area-meter__description">1.2 of 5 GB used<\/p><\/div>$/);
});

test("the value is clamped and scaled to min and max; a ReactNode value text is not announced; null hides it", () => {
  const html = render(h(Meter, { value: 40, max: 30, tone: "danger", valueText: h("b", null, "full"), "aria-label": "Seats" }));
  assert.match(html, /aria-valuenow="30"/);
  assert.doesNotMatch(html, /aria-valuetext/);
  assert.match(html, /class="area-meter area-meter--danger"/);
  assert.match(html, /--_progress-value:100/);
  assert.doesNotMatch(render(h(Meter, { value: 5, valueText: null, "aria-label": "x" })), /area-meter__header/);
});
