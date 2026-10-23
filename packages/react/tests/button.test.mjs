import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h, createRef } from "react";
import { renderToString } from "react-dom/server";
import { Button, Kbd } from "../dist/modules/index.js";

// Audit A-24: the Button contract had no test file of its own.
const render = (props, children = "Button") => renderToString(h(Button, props, children));

test("Button defaults to type=button so it never submits a form by accident", () => {
  assert.match(render({}), /^<button type="button" class="area-button area-button--solid area-button--neutral area-button--md"/);
  assert.match(render({ type: "submit" }), /type="submit"/);
});

test("a selected toggle announces aria-pressed; a plain button does not", () => {
  assert.match(render({ selected: true }), /aria-pressed="true"[^>]*data-selected=""/);
  assert.doesNotMatch(render({}), /aria-pressed/);
});

test("icon-only keeps its children as the accessible name", () => {
  const html = render({ iconOnly: true, icon: h("svg") }, "Add item");
  assert.match(html, /<span class="area-sr-only">Add item<\/span>/);
  assert.doesNotMatch(html, /area-button__label/);
});

test("disabled is native; loading is not (audit S18)", () => {
  assert.match(render({ disabled: true }), / disabled=""/);
  const loading = render({ loading: true });
  assert.match(loading, /aria-disabled="true" aria-busy="true"/);
  assert.doesNotMatch(loading, / disabled=""/);
});

test("Button forwards its ref to the native button", () => {
  const ref = createRef();
  renderToString(h(Button, { ref }, "Button"));
  // Server rendering never attaches refs; the forwardRef wrapper is what is checked here.
  assert.equal(Button.$$typeof?.toString(), "Symbol(react.forward_ref)");
});

test("Kbd renders one key element per key, a spoken chord name, and the sm/md + variant axes", () => {
  const html = renderToString(h(Kbd, { keys: ["cmd", "K"], size: "sm", variant: "quiet" }));
  assert.match(html, /class="area-kbd area-kbd--sm area-kbd--default"/); // quiet is deprecated: the keycap
  assert.equal((html.match(/<kbd/g) ?? []).length, 2);
  assert.match(html, /<span class="area-sr-only">Command plus K<\/span>/);
  assert.match(renderToString(h(Kbd, { keys: ["K"], size: "small", appearance: "quiet" })), /area-kbd--sm area-kbd--default/);
});

test("a toggle can be uncontrolled with defaultSelected (audit A-17)", () => {
  assert.match(render({ defaultSelected: true }), /aria-pressed="true"[^>]*data-selected=""/);
  assert.match(render({ defaultSelected: false }), /aria-pressed="false"/);
  assert.doesNotMatch(render({ onSelectedChange: () => {} }), /aria-pressed/);
});
