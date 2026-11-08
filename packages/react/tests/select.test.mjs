import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { CustomSelect, Select, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.select.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:216; packages/react/src/components/forms.tsx:40.
    test(`Select ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Select, { "aria-label": "Choice", [axis]: value }));
      const root = html.match(/<select\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.select.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/forms.tsx:40-49: props reach the native select and native options.
test("Select keeps native selection, name, disabled and label semantics", () => {
  const html = renderToString(h(Select, { id: "team", className: "custom", "aria-label": "Team", "aria-describedby": "help", disabled: true, name: "team", defaultValue: "design", fullWidth: true }, h("option", { value: "engineering" }, "Engineering team"), h("option", { value: "design" }, "Design team")));
  const select = html.match(/<select[^>]*>/)[0];
  for (const attr of ['id="team"', 'aria-label="Team"', 'aria-describedby="help"', 'disabled=""', 'name="team"']) assert.ok(select.includes(attr), attr);
  assert.match(select, /area-select--full-width[^\"]* custom/);
  assert.match(html, /<option value="design" selected="">Design team<\/option>/);
  assert.match(html, /<option value="engineering">Engineering team<\/option>/);
});

// packages/react/src/components/forms.tsx:37: invalid entry points, success/warning and explicit false.
test("Select maps validation to native ARIA and data hooks", () => {
  for (const props of [{ invalid: true }, { validationStatus: "error" }, { "aria-invalid": "grammar" }]) {
    const html = renderToString(h(Select, { ...props, "aria-label": "Value" }));
    assert.match(html, /aria-invalid="true"/);
    assert.match(html, /data-invalid=""/);
  }
  for (const validationStatus of ["success", "warning"]) {
    const html = renderToString(h(Select, { validationStatus, "aria-label": "Value" }));
    assert.ok(html.includes(`data-${validationStatus}=""`));
    assert.doesNotMatch(html, /aria-invalid="true"|data-invalid/);
  }
  assert.match(renderToString(h(Select, { "aria-invalid": false })), /aria-invalid="false"/);
});

// packages/react/src/components/CustomSelect.tsx: onHighlightChange is a callback, never a DOM attribute, and a closed
// list reports nothing (the effect runs only in a browser).
test("CustomSelect keeps onHighlightChange off the trigger", () => {
  const html = renderToString(h(CustomSelect, { "aria-label": "Radius", items: [{ value: "8", label: "8" }], value: "8", onHighlightChange: () => {} }));
  assert.doesNotMatch(html, /onhighlightchange/i);
  assert.match(html, /role="combobox"/);
});

// docs/specs/custom-select.md, "Several from a long list" (components audit V7, 2026-11-07).
const many = ["one", "two", "three", "four"].map(word => ({ value: word, label: `Option ${word}` }));
test("CustomSelect names one or two chosen options and counts three or more", () => {
  const two = renderToString(h(CustomSelect, { "aria-label": "Label", items: many, multiple: true, defaultValues: ["one", "two"] }));
  assert.match(two, /area-custom-select__value">Option one, Option two</);
  const three = renderToString(h(CustomSelect, { "aria-label": "Label", items: many, multiple: true, defaultValues: ["one", "two", "four"] }));
  assert.match(three, /area-custom-select__value">3 selected</);
  const custom = renderToString(h(CustomSelect, { "aria-label": "Label", items: many, multiple: true, defaultValues: ["one", "two", "four"], selectedLabel: count => `${count} teams` }));
  assert.match(custom, /area-custom-select__value">3 teams</);
});

test("CustomSelect filterable: a panel with the filter field, Select all, the listbox and a footer", () => {
  const html = renderToString(h(CustomSelect, { "aria-label": "Label", items: many, multiple: true, filterable: true, defaultValues: ["three"], footer: h("button", { type: "button" }, "Save") }));
  const panel = html.match(/<div popover="manual" class="([^"]*)"/);
  assert.ok(panel, "the panel is the popover");
  assert.match(panel[1], /area-menu area-custom-select__listbox area-custom-select__panel/);
  const filter = html.match(/<input[^>]*>/)[0];
  for (const attr of ['role="combobox"', 'aria-label="Filter"', 'placeholder="Filter"', 'aria-autocomplete="list"']) assert.ok(filter.includes(attr), attr);
  const listbox = html.match(/<div[^>]*role="listbox"[^>]*>/)[0];
  assert.ok(listbox.includes(`id="${filter.match(/aria-controls="([^"]+)"/)[1]}"`), "the filter controls the listbox");
  assert.match(listbox, /aria-multiselectable="true"/);
  assert.match(listbox, /area-menu__list/);
  assert.doesNotMatch(listbox, /popover/);
  const all = html.match(/<button[^>]*area-custom-select__select-all[^>]*>/)[0];
  assert.match(all, /role="checkbox"/);
  assert.match(all, /aria-checked="mixed"/);
  assert.match(html, /area-menu__header area-custom-select__header/);
  assert.match(html, /area-menu__footer area-custom-select__footer"><button type="button">Save<\/button>/);
  assert.ok(html.indexOf("area-custom-select__header") < html.indexOf('role="listbox"') && html.indexOf('role="listbox"') < html.indexOf("area-custom-select__footer"));
  const plain = renderToString(h(CustomSelect, { "aria-label": "Label", items: many }));
  assert.doesNotMatch(plain, /area-custom-select__panel|area-custom-select__filter|select-all/);
  assert.match(plain, /role="listbox"[^>]*popover="manual"/, "without a filter or footer the listbox is the popover, as before");
  const single = renderToString(h(CustomSelect, { "aria-label": "Label", items: many, filterable: true }));
  assert.doesNotMatch(single, /select-all/, "Select all is for a set");
});
