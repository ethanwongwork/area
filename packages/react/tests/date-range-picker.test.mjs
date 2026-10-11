import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as renderHtml } from "react-dom/server";
import { DateRangePicker } from "../dist/modules/index.js";

// Intl puts thin spaces around the range dash; compare with plain ones.
const render = node => renderHtml(node).replace(/[\u2009\u202f]/g, " ");

test("Date picker's field showing the range with shared parts once, and both ends submitted", () => {
  const html = render(h(DateRangePicker, { "aria-label": "Dates", name: "trip", defaultValue: { start: "2026-10-04", end: "2026-10-10" }, locale: "en-US" }));
  assert.match(html, /^<div class="area-date-picker area-date-picker--outline area-date-picker--md area-date-range-picker">/);
  assert.match(html, /<button aria-label="Dates" id="[^"]+-trigger" type="button" class="area-date-picker__trigger"[^>]*><span class="area-date-picker__value">Oct 4 – 10, 2026<\/span><\/button>/);
  assert.match(html, /<input type="hidden" name="trip-start" value="2026-10-04"\/><input type="hidden" name="trip-end" value="2026-10-10"\/>/);
});

test("an empty range shows the placeholder; a one-day range shows one date; across months both", () => {
  assert.match(render(h(DateRangePicker, { "aria-label": "Dates" })), /<span class="area-date-picker__value" data-placeholder="">Pick dates<\/span>/);
  assert.match(render(h(DateRangePicker, { "aria-label": "Dates", locale: "en-US", value: { start: "2026-10-10", end: "2026-10-10" } })), />Oct 10, 2026</);
  assert.match(render(h(DateRangePicker, { "aria-label": "Dates", locale: "en-US", value: { start: "2026-10-28", end: "2026-11-03" } })), />Oct 28 – Nov 3, 2026</);
});
