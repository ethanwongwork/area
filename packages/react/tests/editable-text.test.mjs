import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { EditableText } from "../dist/modules/index.js";

test("at rest: a focusable text named by its label and value, activation and fill as modifiers", () => {
  const html = render(h(EditableText, { label: "Layer name", defaultValue: "Header", id: "name", hint: false }));
  assert.equal(html, '<span id="name" class="area-editable-text area-editable-text--dblclick">'
    + '<span class="area-editable-text__preview" role="button" tabindex="0" aria-label="Layer name: Header">Header</span></span>');
  assert.match(render(h(EditableText, { label: "Page title", activation: "click", fill: true })),
    /class="area-editable-text area-editable-text--click area-editable-text--fill"/);
});

test("placeholder is muted when empty; disabled leaves the tab order", () => {
  const empty = render(h(EditableText, { label: "Page title", placeholder: "Untitled", hint: false }));
  assert.match(empty, /aria-label="Page title: Untitled" data-placeholder="">Untitled</);
  const disabled = render(h(EditableText, { label: "Layer name", defaultValue: "Header", disabled: true }));
  assert.match(disabled, /data-disabled=""/);
  assert.match(disabled, /tabindex="-1" aria-label="Layer name: Header" aria-disabled="true"/);
});

test("defaultEditing renders the field over the hidden preview, named by the label", () => {
  const html = render(h(EditableText, { label: "Layer name", defaultValue: "Header", defaultEditing: true, inputProps: { maxLength: 40 } }));
  assert.match(html, /data-editing=""/);
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /<input type="text" maxLength="40" class="area-editable-text__input" aria-label="Layer name" value="Header"\/>/);
});

test("a hint tooltip says how to edit and describes the text; disabled text has none", () => {
  const dbl = render(h(EditableText, { label: "Layer name", defaultValue: "Header" }));
  const id = dbl.match(/aria-describedby="([^"]+)"/)[1];
  assert.match(dbl, new RegExp(`<div role="tooltip" class="area-tooltip area-tooltip--top" id="${id}" popover="manual">Double-click to rename</div>`));
  assert.match(render(h(EditableText, { label: "Page title", activation: "click", defaultValue: "Plan" })), />Click to rename</);
  assert.match(render(h(EditableText, { label: "Page title", defaultValue: "Plan", hint: "Double-click to edit the title" })), />Double-click to edit the title</);
  assert.doesNotMatch(render(h(EditableText, { label: "Layer name", defaultValue: "Header", disabled: true })), /role="tooltip"/);
});

test("the text, a role=button, opens on Space as well as Enter and F2", async () => {
  const { readFileSync } = await import("node:fs");
  const source = readFileSync(new URL("../src/components/EditableText.tsx", import.meta.url), "utf8");
  assert.match(source, /event\.key === "Enter" \|\| event\.key === " " \|\| event\.key === "F2"/);
});
