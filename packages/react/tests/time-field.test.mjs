import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { TimeField } from "../dist/modules/index.js";

const segments = html => [...html.matchAll(/role="spinbutton"[^>]*aria-label="([^"]+)"[^>]*>([^<]*)</g)].map(m => `${m[1]}=${m[2]}`);

test("an empty 12-hour field: a group of hour, minute and AM/PM spin buttons in Input's shell, placeholders for the empty ones", () => {
  const html = render(h(TimeField, { "aria-label": "Time", hourCycle: 12 }));
  assert.match(html, /^<div id="[^"]+" role="group" aria-label="Time" class="area-input area-input--outline area-input--md area-time-field">/);
  assert.deepEqual(segments(html), ["Hour=––", "Minute=––", "AM/PM=AM"]);
  assert.match(html, /aria-valuemin="1" aria-valuemax="12" aria-valuetext="Empty"/);
});

test("a value shows in the hour cycle asked for; seconds add a segment", () => {
  assert.deepEqual(segments(render(h(TimeField, { "aria-label": "Time", hourCycle: 12, defaultValue: "17:05" }))), ["Hour=5", "Minute=05", "AM/PM=PM"]);
  assert.deepEqual(segments(render(h(TimeField, { "aria-label": "Time", hourCycle: 24, granularity: "second", defaultValue: "07:05:09" }))), ["Hour=07", "Minute=05", "Second=09"]);
  assert.deepEqual(segments(render(h(TimeField, { "aria-label": "Time", hourCycle: 12, defaultValue: "00:30" }))), ["Hour=12", "Minute=30", "AM/PM=AM"]);
});

test("step adds the list's trigger; name submits the 24-hour value; disabled takes the segments out of the Tab order", () => {
  const html = render(h(TimeField, { "aria-label": "Time", hourCycle: 12, step: 15, name: "at", defaultValue: "09:00" }));
  assert.match(html, /class="area-input__action-button area-time-field__trigger" aria-label="Choose a time"/);
  assert.match(html, /<input type="hidden" name="at" value="09:00"\/>/);
  const off = render(h(TimeField, { "aria-label": "Time", disabled: true, step: 15 }));
  assert.match(off, /tabindex="-1"/);
  assert.doesNotMatch(off, /area-time-field__trigger/);
});

test("a Field's aria-invalid paints the field invalid", () => {
  assert.match(render(h(TimeField, { "aria-label": "Time", "aria-invalid": true })), /data-invalid=""/);
});
