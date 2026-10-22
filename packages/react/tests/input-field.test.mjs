import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Field, Input, InputAction, MANIFESTS, inputVariants } from "../dist/modules/index.js";

const render = element => renderToString(element, { identifierPrefix: "input-field-test-" });

test("Input forwards native semantics and exposes its complete variant family", () => {
  const html = render(h(Input, { name: "email", type: "email", required: true, autoComplete: "email", placeholder: "you@example.com" }));
  assert.match(html, /area-input--outline area-input--md/);
  assert.match(html, /type="email"/);
  assert.match(html, /name="email"/);
  assert.match(html, /required=""/);
  assert.match(html, /autoComplete="email"/);
  assert.deepEqual(MANIFESTS.input.variants.size, ["sm", "md", "lg"]);
  assert.deepEqual(MANIFESTS.input.variants.variant, ["outline", "soft"]);
  assert.throws(() => inputVariants({ size: "xxl" }), RangeError);
});

test("every error entry point sets native invalid semantics", () => {
  for (const props of [{ invalid: true }, { validationStatus: "error" }, { "aria-invalid": true }]) {
    const html = render(h(Input, { ...props, "aria-label": "Email" }));
    assert.match(html, /data-invalid=""/);
    assert.match(html, /aria-invalid="true"/);
  }
});

test("loading remains editable and exposes busy status", () => {
  const html = render(h(Input, { loading: true, loadingText: "Checking availability", defaultValue: "area.design", "aria-label": "Domain" }));
  assert.match(html, /data-loading=""/);
  assert.match(html, /aria-busy="true"/);
  assert.doesNotMatch(html, / disabled=""/);
  assert.match(html, /Checking availability/);
});

test("InputAction keeps external descriptions and announces its hint once", () => {
  // The hint names the button; it is not repeated as a description.
  const named = render(h(InputAction, { icon: h("svg"), tooltip: "Clear domain", "aria-describedby": "keyboard-help" }));
  assert.match(named, /aria-label="Clear domain"/);
  assert.match(named, /aria-describedby="keyboard-help"/);
  assert.match(named, /role="tooltip"[^>]*popover="manual"[^>]*>Clear domain/);
  // With a separate label, the hint describes it alongside the external description.
  const labelled = render(h(InputAction, { icon: h("svg"), tooltip: "Removes the domain", "aria-label": "Clear", "aria-describedby": "keyboard-help" }));
  assert.match(labelled, /aria-label="Clear"/);
  // The hint is a Tooltip on the shared overlay engine (audit S16).
  const id = labelled.match(/<div role="tooltip"[^>]* id="([^"]+)"/)?.[1];
  assert.ok(id);
  assert.match(labelled, new RegExp(`aria-describedby="keyboard-help ${id}"`));
});

test("Field connects label, description, error, and required state to its control", () => {
  const html = render(h(Field, {
    label: "Email",
    description: "Use your work address.",
    error: "Enter a valid address.",
    required: true,
  }, h(Input, { type: "email", "aria-describedby": "external-help" })));
  const id = html.match(/for="(area-field-[^"]+)"/)[1];
  assert.match(html, new RegExp(`for="${id}"`));
  assert.match(html, new RegExp(`aria-labelledby="${id}-label"`));
  assert.match(html, new RegExp(`aria-describedby="external-help ${id}-description ${id}-validation"`));
  assert.match(html, new RegExp(`aria-errormessage="${id}-validation"`));
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /required=""/);
});

test("Field success and warning paint without claiming an error", () => {
  for (const validationStatus of ["success", "warning"]) {
    const html = render(h(Field, { label: "Workspace", validation: "Helpful context", validationStatus }, h(Input)));
    assert.match(html, new RegExp(`data-${validationStatus}=""`));
    assert.match(html, new RegExp(`data-tone="${validationStatus}"`));
    assert.doesNotMatch(html, /aria-invalid="true"/);
    assert.doesNotMatch(html, /aria-errormessage=/);
  }
});

test("Field propagates disabled and preserves an explicit control id", () => {
  const html = render(h(Field, { label: "Workspace", disabled: true, htmlFor: "workspace-name" }, h(Input, { defaultValue: "Area" })));
  assert.match(html, /data-disabled=""/);
  assert.match(html, /for="workspace-name"/);
  assert.match(html, /id="workspace-name"/);
  assert.match(html, / disabled=""/);
});

test("characterCount shows the length against maxLength and joins the description", async () => {
  const { Field, Input, Textarea } = await import("../dist/modules/index.js");
  const { createElement: el } = await import("react");
  const { renderToString: render } = await import("react-dom/server");
  const html = render(el(Field, { label: "Bio", characterCount: true, htmlFor: "bio" }, el(Textarea, { maxLength: 160, defaultValue: "Hello" })));
  assert.match(html, /<span id="bio-count" class="area-field__count">5 \/ 160<\/span>/);
  assert.match(html, /aria-describedby="bio-count"/);
  const full = render(el(Field, { label: "Code", characterCount: true, htmlFor: "c" }, el(Input, { maxLength: 4, value: "ABCD", onChange() {} })));
  assert.match(full, /class="area-field__count" data-full="">4 \/ 4</);
  const custom = render(el(Field, { label: "Note", characterCount: (n, m) => `${m - n} left`, htmlFor: "n" }, el(Input, { maxLength: 10, defaultValue: "abc" })));
  assert.match(custom, />7 left</);
  assert.doesNotMatch(render(el(Field, { label: "Plain" }, el(Input, {}))), /area-field__count/);
});
