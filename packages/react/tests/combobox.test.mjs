import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Combobox, MANIFESTS } from "../dist/modules/index.js";

const options = [{ value: "design", label: "Design team", group: "Teams", icon: "D", description: "Product design" }, { value: "engineering", label: "Engineering team", group: "Teams", disabled: true }];

for (const [axis, values] of Object.entries(MANIFESTS.input.variants)) {
  for (const value of values) {
    // docs/specs/combobox.md:23-25; packages/react/src/components/Combobox.tsx:20,38,218-229: borrows Input variants.
    test(`Combobox inherited ${axis}=${value} renders on the input shell`, () => {
      const html = renderToString(h(Combobox, { options, "aria-label": "Team", [axis]: value }));
      const inputShell = html.match(/<div class="area-input\b[^>]*>/)[0];
      assert.ok(inputShell.match(/class="([^"]+)"/)[1].split(" ").includes(`area-input--${value}`));
    });
  }
}

// packages/react/src/components/Combobox.tsx:59-64,216-238; packages/react/src/components/Input.tsx:133-140: native input and named listbox association.
test("Combobox forwards native form props and exposes a closed list autocomplete", () => {
  const html = renderToString(h(Combobox, { options, defaultValue: "design", id: "team", className: "custom", "aria-label": "Team", "aria-describedby": "help", name: "team", disabled: true, invalid: true, fullWidth: true, toggleLabel: "Choose team" }));
  const input = html.match(/<input[^>]*>/)[0];
  for (const attr of ['id="team"', 'aria-label="Team"', 'aria-describedby="help"', 'disabled=""', 'aria-invalid="true"', 'role="combobox"', 'aria-autocomplete="list"', 'aria-expanded="false"', 'value="Design team"']) assert.ok(input.includes(attr), attr);
  // The form receives the option's value, not its label, through a hidden input (Combobox.tsx, audit B-12).
  assert.doesNotMatch(input, /name=/);
  const hidden = html.match(/<input type="hidden"[^>]*>/)[0];
  for (const attr of ['name="team"', 'value="design"', 'disabled=""']) assert.ok(hidden.includes(attr), attr);
  assert.match(html, /^<div class="area-combobox area-combobox--full-width custom"/);
  const target = input.match(/aria-controls="([^"]+)"/)[1];
  const list = html.match(/<div[^>]*role="listbox"[^>]*>/)[0];
  for (const attr of [`id="${target}"`, 'aria-label="Team"', 'popover="manual"']) assert.ok(list.includes(attr));
  assert.doesNotMatch(input, /aria-activedescendant/);
  assert.doesNotMatch(html, /data-open/);
  const toggle = html.match(/<button[^>]*>/)[0];
  assert.match(toggle, /disabled=""/);
  assert.match(toggle, /aria-label="Choose team"/);
});

// packages/react/src/components/Combobox.tsx:198-238: grouped, named, selected/disabled options and decorative slots.
test("Combobox options preserve group names, selected value and disabled state", () => {
  for (const selected of [{ defaultValue: "design" }, { value: "design" }]) {
    const html = renderToString(h(Combobox, { options, "aria-label": "Team", ...selected }));
    const group = html.match(/<div[^>]*role="group"[^>]*>/)[0];
    const name = group.match(/aria-labelledby="([^"]+)"/)[1];
    const label = html.match(new RegExp(`<div id="${name}"[^>]*>(.*?)</div>`));
    assert.ok(label, name);
    assert.match(label[0], /class="area-menu__label" role="presentation"/);
    assert.equal(label[1].replace(/<[^>]+>/g, ""), "Teams");
    const rows = html.match(/<div[^>]*role="option"[^>]*>/g);
    assert.equal(rows.length, 2);
    assert.match(rows[0], /aria-selected="true"/);
    for (const attr of ['aria-selected="false"', 'aria-disabled="true"', 'data-disabled=""']) assert.ok(rows[1].includes(attr));
    assert.match(html, /area-menu__icon" aria-hidden="true">D/);
    assert.match(html, /area-menu__text">Design team/);
    assert.match(html, /area-combobox__description">Product design/);
  }
});

// packages/react/src/components/Combobox.tsx:85-96,190-196,226-232: filtering, create/empty rows and readonly toggle state.
test("Combobox renders filtered, creatable, empty and readonly usages", () => {
  const filtered = renderToString(h(Combobox, { options, inputValue: "DESIGN", "aria-label": "Team" }));
  assert.equal((filtered.match(/role="option"/g) ?? []).length, 1);
  assert.match(filtered, /Design team/);
  assert.doesNotMatch(filtered, /Engineering team/);
  const empty = renderToString(h(Combobox, { options, defaultInputValue: "Missing", emptyText: "No teams", "aria-label": "Team" }));
  assert.match(empty, /area-combobox__empty" role="presentation">No teams/);
  const create = renderToString(h(Combobox, { options, inputValue: "New team", onCreate() {}, "aria-label": "Team" }));
  assert.match(create, /role="option" aria-selected="false"/);
  assert.match(create.replaceAll("<!-- -->", ""), /Create “New team”/);
  const readonly = renderToString(h(Combobox, { options, readOnly: true, "aria-label": "Team" }));
  assert.match(readonly, /<input[^>]*readOnly=""/);
  assert.match(readonly, /<button[^>]*disabled=""/);
});
