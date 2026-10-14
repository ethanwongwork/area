import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { PasswordField } from "../dist/modules/index.js";

test("a hidden password: Input's shell, a password input that password managers fill, and a named reveal action in the Tab order", () => {
  const html = render(h(PasswordField, { "aria-label": "Password", id: "pw" }));
  assert.match(html, /^<div class="area-input area-input--outline area-input--md area-password-field">/);
  assert.match(html, /<input class="area-input__control" aria-label="Password" id="pw" type="password" autoComplete="current-password" spellCheck="false"/);
  assert.match(html, /<button type="button" class="area-input__action-button area-password-field__reveal" aria-label="Show password" aria-controls="pw">/);
  assert.match(html, /data-area-glyph="eye"/);
  assert.doesNotMatch(html, /tabindex="-1"/);
});

test("shown: a text input, and the action names hiding it with the closed eye", () => {
  const html = render(h(PasswordField, { "aria-label": "Password", defaultVisible: true, hideLabel: "Hide" }));
  assert.match(html, /type="text"/);
  assert.match(html, /aria-label="Hide"/);
  assert.match(html, /data-area-glyph="eye-off"/);
});

test("new-password passes through; a disabled field has no reveal action", () => {
  assert.match(render(h(PasswordField, { "aria-label": "Password", autoComplete: "new-password" })), /autoComplete="new-password"/);
  assert.doesNotMatch(render(h(PasswordField, { "aria-label": "Password", disabled: true })), /area-password-field__reveal/);
});
