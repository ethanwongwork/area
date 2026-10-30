import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Composer, ComposerAttach, ComposerMic, ComposerNote, ModelPicker, PromptSuggestions } from "../dist/modules/index.js";

// Composer.tsx: header and footer group the shell; className and the rest land on the group (docs/specs/composer.md, "Expansion").
test("Composer groups its shell with a header and a footer", () => {
  const html = renderToString(h(Composer, { id: "c", className: "custom", header: h("span", null, "Head"), footer: h(ComposerNote, null, "Note") }));
  assert.match(html, /^<div id="c" class="area-composer-group custom">/);
  const order = ["area-composer-group__header", "area-composer area-composer--inline", "area-composer-group__footer"].map(name => html.indexOf(name));
  assert.deepEqual([...order].sort((a, b) => a - b), order, "header, shell, footer in order");
  assert.ok(order.every(index => index >= 0));
  assert.match(html, /<p class="area-composer-group__note">Note<\/p>/);
});

test("Composer without the new slots keeps its shell as the root", () => {
  const html = renderToString(h(Composer, { id: "c", className: "custom" }));
  assert.match(html, /^<div id="c" class="area-composer area-composer--inline custom"/);
  assert.ok(!html.includes("area-composer-group"));
});

test("Composer shows the drop paint while files are over it (data-dragging)", () => {
  assert.match(renderToString(h(Composer, { "data-dragging": "", onFiles: () => {} })), /data-dragging=""/);
  assert.ok(!renderToString(h(Composer, { onFiles: () => {} })).includes("data-dragging"));
});

// A toggle keeps one name; aria-pressed carries its state (Composer.tsx, ComposerMic).
test("ComposerMic is a toggle that keeps its name", () => {
  const off = renderToString(h(ComposerMic));
  const on = renderToString(h(ComposerMic, { defaultSelected: true }));
  for (const html of [off, on]) assert.match(html, /aria-label="Dictate"/);
  assert.match(off, /aria-pressed="false"/);
  assert.match(on, /aria-pressed="true"/);
  assert.match(on, /data-selected=""/);
});

test("ComposerAttach is a named button with a hidden file input", () => {
  const html = renderToString(h(ComposerAttach, { accept: "image/*" }));
  assert.match(html, /aria-label="Add files"/);
  assert.match(html, /<input class="area-composer__file" type="file" accept="image\/\*" multiple="" hidden="" tabindex="-1" aria-hidden="true"/);
});

// ModelPicker.tsx: the effort follows the name, muted, and both are in the trigger's name.
test("ModelPicker shows the effort after the model's name", () => {
  const html = renderToString(h(ModelPicker, { items: [{ value: "a", label: "Option one" }], efforts: [{ value: "m", label: "Medium" }] }));
  assert.match(html, /aria-label="Model: Option one, Medium"/);
  assert.match(html, /<span class="area-model-picker__name">Option one<\/span> <span class="area-model-picker__effort">Medium<\/span>/);
  assert.ok(!renderToString(h(ModelPicker, { items: [{ value: "a", label: "Option one" }] })).includes("area-model-picker__effort"));
});

test("PromptSuggestions shows a suggestion's shortcut as a keycap", () => {
  for (const layout of ["list", "chips"]) {
    const html = renderToString(h(PromptSuggestions, { layout, items: [{ id: "a", label: "Item one", shortcut: ["Shift", "Tab"] }] }));
    assert.match(html, /area-kbd/, layout);
  }
});
