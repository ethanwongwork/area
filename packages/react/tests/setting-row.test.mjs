import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h, createRef } from "react";
import { renderToString as render } from "react-dom/server";
import { Select, SettingRow, SettingsGroup, Switch, Toggletip } from "../dist/modules/index.js";

// Setting row and Settings group (components audit N4, 2026-11-07; docs/specs/setting-row.md).
test("the name labels the control and the description describes it", () => {
  const html = render(h(SettingRow, { label: "Label", description: "Description", controlId: "s1" }, h(Switch, null)));
  assert.match(html, /^<div class="area-setting-row area-setting-row--horizontal">/);
  assert.match(html, /<label class="area-setting-row__label" id="s1-label" for="s1">Label<\/label>/);
  assert.match(html, /<p class="area-setting-row__description" id="s1-description">Description<\/p>/);
  assert.match(html, /<div class="area-setting-row__control">.*id="s1"/);
  assert.match(html, /aria-labelledby="s1-label"/);
  assert.match(html, /aria-describedby="s1-description"/);
});

test("modified draws the dot, said with the description, and Reset while onReset is given", () => {
  const html = render(h(SettingRow, { label: "Label", description: "Description", controlId: "s2", modified: true, onReset() {} }, h(Switch, null)));
  assert.match(html, /data-modified=""/);
  assert.match(html, /<span class="area-setting-row__modified" id="s2-modified"><span class="area-sr-only">Modified<\/span><\/span>/);
  assert.match(html, /aria-describedby="s2-description s2-modified"/);
  assert.match(html, /<span class="area-setting-row__reset"><button[^>]*aria-label="Reset “Label” to default"/);
  // Not modified: neither, even with onReset.
  const plain = render(h(SettingRow, { label: "Label", onReset() {} }, h(Switch, null)));
  assert.doesNotMatch(plain, /__modified|__reset|data-modified/);
});

test("labelAction sits outside the label; orientation, disabled and native props", () => {
  const ref = createRef();
  const html = render(h(SettingRow, { ref, label: "Label", labelAction: h(Toggletip, { content: "Description" }), orientation: "vertical", disabled: true, id: "row" }, h(Select, null, h("option", null, "Option one"))));
  assert.match(html, /^<div class="area-setting-row area-setting-row--vertical" data-disabled="" id="row">/);
  assert.match(html, /<\/label><span class="area-setting-row__help">/);
  assert.match(html, /<select[^>]*disabled=""/);
});

test("Settings group: a section named by its heading, the rows in a box, framed on request", () => {
  const html = render(h(SettingsGroup, { heading: "Title", description: "Description", framed: true }, h(SettingRow, { label: "Label" }, h(Switch, null)), h(SettingRow, { label: "Label" }, h(Switch, null))));
  const id = html.match(/aria-labelledby="([^"]+)"/)?.[1];
  assert.ok(id, "the section is not named");
  // `framed` is the deprecated alias of the one frame prop, variant="surface" (plan B1.1).
  assert.match(html, /^<section class="area-settings-group area-settings-group--surface"/);
  assert.match(render(h(SettingsGroup, { variant: "surface" }, h(SettingRow, { label: "Label" }))), /^<section class="area-settings-group area-settings-group--surface"/);
  assert.match(html, new RegExp(`<h2 class="area-section-heading__title" id="${id}">Title</h2><p class="area-section-heading__lede">Description</p>`));
  assert.equal((html.match(/class="area-setting-row /g) ?? []).length, 2);
  assert.doesNotMatch(render(h(SettingsGroup, null, h(SettingRow, { label: "Label" }))), /aria-labelledby|area-section-heading/, "no heading: no heading and no name");
});
