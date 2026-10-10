import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { ToggleGroup, ToggleGroupItem, Toolbar } from "../dist/modules/index.js";

const items = () => [h(ToggleGroupItem, { key: "b", value: "bold" }, "Bold"), h(ToggleGroupItem, { key: "i", value: "italic" }, "Italic")];

test("a soft group is its own track, one Tab stop, pressed state from defaultValue; outline is ButtonGroup-joined", () => {
  const html = render(h(ToggleGroup, { "aria-label": "Text style", defaultValue: ["bold"] }, items()));
  assert.match(html, /^<div role="group" aria-label="Text style" class="area-toggle-group area-toggle-group--soft area-toggle-group--md" tabindex="0">/);
  assert.match(render(h(ToggleGroup, { variant: "outline" }, items())), /class="area-toggle-group area-toggle-group--outline area-toggle-group--md area-button-group area-button-group--outline area-button-group--md"/);
  assert.match(html, /<button type="button" class="area-button area-button--ghost[^"]*" aria-pressed="true" data-selected="" tabindex="-1" data-area-toggle-item="">.*Bold/);
  assert.match(html, /aria-pressed="false" tabindex="-1" data-area-toggle-item="">.*Italic/);
});

test("ghost stands apart; disabled reaches every toggle and drops the Tab stop", () => {
  const html = render(h(ToggleGroup, { variant: "ghost", size: "sm", disabled: true }, items()));
  assert.match(html, /class="area-toggle-group area-toggle-group--ghost area-toggle-group--sm" tabindex="-1"/);
  assert.doesNotMatch(html, /area-button-group/);
  assert.equal(html.match(/disabled=""/g).length, 2);
});

test("in a Toolbar the toggles are its roving items and take its size", () => {
  const html = render(h(Toolbar, { "aria-label": "Formatting", size: "sm" }, h(ToggleGroup, { variant: "ghost" }, items())));
  assert.match(html, /<div role="group" class="area-toggle-group area-toggle-group--ghost area-toggle-group--sm">/);
  assert.equal(html.match(/data-area-toolbar-item=""/g).length, 2);
  assert.doesNotMatch(html, /data-area-toggle-item/);
});
