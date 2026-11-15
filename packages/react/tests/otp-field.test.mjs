import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { OTPField } from "../dist/modules/index.js";

test("six empty slots over one real input: numeric, one-time-code autofill, six characters at most", () => {
  const html = render(h(OTPField, { "aria-label": "Verification code" }));
  assert.match(html, /^<div class="area-otp-field area-otp-field--outline area-otp-field--md" translate="no">/);
  assert.equal(html.match(/class="area-otp-field__slot"/g)?.length, 6);
  assert.match(html, /<input aria-label="Verification code" class="area-otp-field__control" type="text" inputMode="numeric" pattern="\[0-9\]\*" autoComplete="one-time-code" maxLength="6"/);
});

test("a value fills the slots in order; letters are dropped from a digit code", () => {
  const html = render(h(OTPField, { "aria-label": "Code", defaultValue: "4a8 2" }));
  // Each character is its own cap slot (plan B2.2), so it centres on its cap, not its line.
  assert.match(html, /data-filled=""><span class="area-otp-field__char">4<\/span><\/span><span class="area-otp-field__slot" data-filled=""><span class="area-otp-field__char">8<\/span><\/span><span class="area-otp-field__slot" data-filled=""><span class="area-otp-field__char">2<\/span><\/span><span class="area-otp-field__slot"><\/span>/);
  assert.match(html, /value="482"/);
});

test("groups draw a hidden dash between them; mask draws dots and makes the input a password input", () => {
  const html = render(h(OTPField, { "aria-label": "Code", groups: [3, 3], defaultValue: "1" }));
  assert.equal(html.match(/class="area-otp-field__group"/g)?.length, 2);
  assert.match(html, /<span class="area-otp-field__separator" aria-hidden="true">/);
  const masked = render(h(OTPField, { "aria-label": "PIN", length: 4, mask: true, defaultValue: "27" }));
  assert.match(masked, /data-filled=""><span class="area-otp-field__char">•<\/span><\/span>/);
  assert.match(masked, /type="password"/);
});

test("invalid and disabled reach the row and the input; letters and digits widen the pattern", () => {
  const html = render(h(OTPField, { "aria-label": "Code", invalid: true, disabled: true, characters: "alphanumeric" }));
  assert.match(html, /data-invalid="" data-disabled=""/);
  assert.match(html, /inputMode="text" pattern="\[0-9A-Za-z\]\*"/);
  assert.match(html, /disabled="" aria-invalid="true"/);
});

test("the drawn slots are hidden from assistive tech, so only the real input's value is read", () => {
  const html = render(h(OTPField, { length: 6, groups: [3, 3], defaultValue: "123", "aria-label": "Code" }));
  assert.equal((html.match(/class="area-otp-field__group" aria-hidden="true"/g) ?? []).length, 2);
});
