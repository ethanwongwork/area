// An Inspector row's Reset (src/inspector-rows.tsx, RowField and WithReset; styles/option-marks.css): it sits before the
// control, in the control's column, never after the name, where a long name with its swatch and info clipped once Reset
// showed (owner, 2026-10-31: "move the reset button and displace part of the input or slider").
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const rows = readFileSync(new URL("../src/inspector-rows.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/styles/option-marks.css", import.meta.url), "utf8");
const field = rows.slice(rows.indexOf("export function RowField"), rows.indexOf("function Row({"));

test("a changed row's Reset goes before its control, not into the label's head", () => {
  assert.match(field, /<WithReset button=\{button\}>\{control\}<\/WithReset>/);
  assert.match(field, /reset\?\.changed/, "only a changed row is wrapped, so unchanged rows keep the control alone");
  // Field's labelAction is the head beside the name: only the inactive row's Toggletip goes there.
  assert.doesNotMatch(field.slice(field.indexOf('if (!reason) return <Field')), /labelAction=\{[^}]*button/);
});

test("the control gives up the Reset's width and keeps no minimum of its own", () => {
  const wrapper = css.match(/\.studio-row__control \{([^}]*)\}/)?.[1] ?? "";
  assert.match(wrapper, /display: flex/);
  assert.match(wrapper, /gap: var\(--area-space-4\)/);
  // A minimum here would hide the control's natural width from an auto Field (field.css), which then never wraps.
  assert.doesNotMatch(wrapper, /min-inline-size/);
  assert.match(css, /\.studio-row__control > :last-child \{ flex: 1 1 0; min-inline-size: 0; \}/);
});
