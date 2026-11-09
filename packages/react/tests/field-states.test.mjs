// Components audit 2026-11-07 (docs/research/components-audit-2026-11-07/internal.md): the field and choice families
// read validation, read-only and the open state one way. O1 success and warning on every field, O2 read-only where
// peers have it, O3 one open-state and one value API, O5 Checkbox group's value.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h, createRef } from "react";
import { renderToString as render } from "react-dom/server";
import {
  Checkbox, CheckboxGroup, Combobox, CustomSelect, DatePicker, DateRangePicker, Field, Input, NavGroup, NavItem, OTPField, Radio,
  RadioGroup, SplitButton, MenuItem, TagPicker, TimeField, ZoomControl,
} from "../dist/modules/index.js";

const items = [{ value: "a", label: "Item one" }, { value: "b", label: "Item two" }];
// Each field, and the element that carries its validation hooks.
const fields = {
  OTPField: [props => h(OTPField, { "aria-label": "Code", ...props }), /<div class="area-otp-field[^"]*"([^>]*)>/],
  TimeField: [props => h(TimeField, { "aria-label": "Time", ...props }), /<div [^>]*class="area-input[^"]*area-time-field"([^>]*)>/],
  DatePicker: [props => h(DatePicker, { "aria-label": "Date", ...props }), /<button([^>]*class="area-date-picker__trigger"[^>]*)>/],
  DateRangePicker: [props => h(DateRangePicker, { "aria-label": "Dates", ...props }), /<button([^>]*class="area-date-picker__trigger"[^>]*)>/],
  CustomSelect: [props => h(CustomSelect, { "aria-label": "Pick", items, ...props }), /<button([^>]*class="area-custom-select__trigger"[^>]*)>/],
  TagPicker: [props => h(TagPicker, { "aria-label": "Tags", items, ...props }), /<div class="area-tag-picker__field"([^>]*)>/],
};

for (const [name, [make, hook]] of Object.entries(fields)) {
  test(`${name} paints success and warning, from its own prop and from a Field (O1)`, () => {
    for (const status of ["success", "warning"]) {
      const own = render(make({ validationStatus: status })).match(hook)?.[1];
      assert.ok(own, name);
      assert.match(own, new RegExp(`data-${status}=""`), `${name} validationStatus=${status}`);
      assert.doesNotMatch(own, /data-invalid|aria-invalid="true"/);
      const viaField = render(h(Field, { label: "Label", validation: "Message", validationStatus: status }, make({}))).match(hook)?.[1];
      assert.match(viaField, new RegExp(`data-${status}=""`), `${name} in a Field with ${status}`);
    }
    // An error still wins: invalid and a Field's error paint it invalid.
    const invalid = render(make({ invalid: true, validationStatus: "success" })).match(hook)?.[1];
    assert.match(invalid, /data-invalid=""|aria-invalid="true"/, `${name} invalid wins`);
    assert.doesNotMatch(invalid, /data-success/);
  });
}

test("Radio group takes validation and validationStatus, as Checkbox group (O1)", () => {
  const html = render(h(RadioGroup, { label: "Plan", validation: "Saved", validationStatus: "success" }, h(Radio, { value: "a", label: "Item one" })));
  assert.match(html, /<fieldset[^>]*data-success=""/);
  assert.match(html, /<span class="area-radio-group__validation" id="([^"]+)">Saved<\/span>/);
  const id = html.match(/area-radio-group__validation" id="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<fieldset[^>]*aria-describedby="${id.replace(/[^\w-]/g, "\\$&")}"`));
  // error wins over validation, as Checkbox group's.
  const error = render(h(RadioGroup, { label: "Plan", validation: "Saved", validationStatus: "warning", error: "Pick one" }, h(Radio, { value: "a", label: "Item one" })));
  assert.match(error, /data-invalid=""/);
  assert.doesNotMatch(error, /data-warning/);
  assert.match(error, />Pick one</);
});

test("Checkbox read-only: aria-readonly on the box, the read-only hook on the row (O2)", () => {
  const html = render(h(Checkbox, { label: "Item one", readOnly: true, defaultChecked: true, variant: "card" }));
  assert.match(html, /<label class="area-checkbox[^"]*" data-read-only="">/);
  const box = html.match(/<input type="checkbox"[^>]*>/)[0];
  assert.match(box, /aria-readonly="true"/);
  assert.match(box, /checked=""/);
  assert.doesNotMatch(html, /readOnly|readonly=""/);
  assert.doesNotMatch(render(h(Checkbox, { label: "Item one" })), /read-only|aria-readonly/);
});

test("Checkbox group: value, name and read-only reach every option (O2, O5)", () => {
  const html = render(h(CheckboxGroup, { label: "Kinds", name: "kind", value: ["b"], readOnly: true },
    h(Checkbox, { value: "a", label: "Item one" }), h(Checkbox, { value: "b", label: "Item two" })));
  assert.match(html, /<fieldset[^>]*data-read-only=""/);
  const boxes = [...html.matchAll(/<input type="checkbox"[^>]*>/g)].map(match => match[0]);
  assert.equal(boxes.length, 2);
  for (const box of boxes) { assert.match(box, /name="kind"/); assert.match(box, /aria-readonly="true"/); }
  assert.doesNotMatch(boxes[0], /checked=""/);
  assert.match(boxes[1], /checked=""/);
  // Uncontrolled: defaultValue checks the options it names; a Checkbox's own checked still wins.
  const own = render(h(CheckboxGroup, { label: "Kinds", defaultValue: ["a"] },
    h(Checkbox, { value: "a", label: "Item one" }), h(Checkbox, { value: "b", label: "Item two", checked: true, onChange() {} })));
  const ownBoxes = [...own.matchAll(/<input type="checkbox"[^>]*>/g)].map(match => match[0]);
  assert.match(ownBoxes[0], /checked=""/);
  assert.match(ownBoxes[1], /checked=""/);
  // Without a group value, each Checkbox holds its own state, as before.
  const plain = render(h(CheckboxGroup, { label: "Kinds" }, h(Checkbox, { value: "a", label: "Item one" })));
  assert.doesNotMatch(plain, /checked=""|aria-readonly/);
});

test("Radio group's read-only is data-read-only; data-readonly stays only in the stylesheet as the deprecated alias (O2)", () => {
  const html = render(h(RadioGroup, { label: "Plan", readOnly: true, value: "a" }, h(Radio, { value: "a", label: "Item one" })));
  assert.match(html, /<fieldset[^>]*data-read-only=""/);
  assert.match(html, /<label class="area-radio[^"]*" data-read-only="">/);
  assert.doesNotMatch(html, /data-readonly/);
});

test("Custom select and the Date pickers read-only: a focusable combobox with aria-readonly that doesn't open (O2)", () => {
  const select = render(h(CustomSelect, { "aria-label": "Pick", items, defaultValue: "a", readOnly: true, defaultOpen: true }));
  assert.match(select, /<button[^>]*class="area-custom-select__trigger"[^>]*role="combobox"[^>]*aria-expanded="false"[^>]*aria-readonly="true"[^>]*data-read-only=""/);
  assert.doesNotMatch(select, /data-open/);
  for (const Picker of [DatePicker, DateRangePicker]) {
    const html = render(h(Picker, { "aria-label": "When", readOnly: true, defaultOpen: true, name: "when" }));
    assert.match(html, /<button[^>]*class="area-date-picker__trigger"[^>]*role="combobox" aria-readonly="true" aria-expanded="false" data-read-only=""/);
    assert.doesNotMatch(html, /data-open|area-date-picker__panel|disabled=""/);
    assert.match(html, /<input type="hidden" name="when/);
  }
});

test("open / defaultOpen reach every list and menu (O3)", () => {
  assert.match(render(h(Combobox, { "aria-label": "Search", items, defaultOpen: true })), /role="combobox"[^>]*aria-expanded="true"/);
  assert.match(render(h(Combobox, { "aria-label": "Search", items, open: true, readOnly: true })), /aria-expanded="false"/);
  assert.match(render(h(TagPicker, { "aria-label": "Tags", items, defaultOpen: true })), /<div class="area-tag-picker[^"]*" data-open=""/);
  assert.match(render(h(CustomSelect, { "aria-label": "Pick", items, open: true })), /<div class="area-custom-select[^"]*" data-open=""><button[^>]*aria-expanded="true"/);
  assert.match(render(h(DatePicker, { "aria-label": "Date", defaultOpen: true })), /<div class="area-date-picker[^"]*" data-open="">/);
  assert.match(render(h(DateRangePicker, { "aria-label": "Dates", open: true })), /data-open=""/);
  assert.match(render(h(TimeField, { "aria-label": "Time", step: 15, defaultOpen: true })), /area-time-field__trigger"[^>]*aria-expanded="true"|aria-expanded="true"[^>]*area-time-field__trigger/);
  assert.match(render(h(SplitButton, { menu: h(MenuItem, null, "Item one"), defaultOpen: true }, "Save")), /area-split-button__trigger[^>]*aria-expanded="true"/);
  assert.match(render(h(ZoomControl, { defaultOpen: true })), /aria-expanded="true"/);
  // A disabled field never shows its list open.
  assert.match(render(h(Combobox, { "aria-label": "Search", items, open: true, disabled: true })), /aria-expanded="false"/);
});

test("Nav group folds on its own with defaultOpen (O3)", () => {
  const folded = render(h(NavGroup, { label: "Projects", defaultOpen: false }, h(NavItem, { href: "#a" }, "Item one")));
  assert.match(folded, /<button type="button" class="area-nav__toggle"[^>]*aria-expanded="false"/);
  assert.match(folded, /<div class="area-nav__items" id="[^"]+" hidden="">/);
  const open = render(h(NavGroup, { label: "Projects", defaultOpen: true }, h(NavItem, { href: "#a" }, "Item one")));
  assert.match(open, /aria-expanded="true"/);
  // Neither defaultOpen nor onOpenChange: a fixed group, as before.
  assert.doesNotMatch(render(h(NavGroup, { label: "Projects" }, h(NavItem, { href: "#a" }, "Item one"))), /area-nav__toggle/);
});

test("Split button loading busies the action and disables the menu's trigger (O7)", () => {
  const html = render(h(SplitButton, { menu: h(MenuItem, null, "Item one"), loading: true }, "Save"));
  assert.match(html, /<button[^>]*class="[^"]*area-split-button__action"[^>]*aria-busy="true"|<button[^>]*aria-busy="true"[^>]*area-split-button__action/);
  assert.match(html, /<button[^>]*class="[^"]*area-split-button__trigger"[^>]*disabled=""/);
});

test("the Date pickers forward the ref to their trigger, where Field's id lands (O7)", async () => {
  // Server rendering attaches no refs; the types say where it lands, and Field's id reaches the trigger.
  for (const Picker of [DatePicker, DateRangePicker]) {
    const html = render(h(Field, { label: "When" }, h(Picker, { ref: createRef() })));
    const id = html.match(/<label id="[^"]+" class="area-field__label" for="([^"]+)"/)[1];
    assert.match(html, new RegExp(`<button[^>]*id="${id.replace(/[^\w-]/g, "\\$&")}"[^>]*class="area-date-picker__trigger"`));
  }
  const source = (await import("node:fs")).readFileSync(new URL("../src/components/DatePicker.tsx", import.meta.url), "utf8");
  assert.match(source, /forwardRef<HTMLButtonElement, DatePickerProps>/);
});

test("Input's onValueChange runs beside onChange and takes the event (O3)", async () => {
  const source = (await import("node:fs")).readFileSync(new URL("../src/components/Input.tsx", import.meta.url), "utf8");
  assert.match(source, /onValueChange\?: \(value: string, event: ChangeEvent<HTMLInputElement>\) => void;/);
  // The prop never reaches the DOM.
  assert.doesNotMatch(render(h(Input, { "aria-label": "Name", onValueChange() {} })), /onvaluechange|onValueChange/i);
});

test("every onValueChange takes the event as its second argument (Governance § 4; O3)", async () => {
  const { readFileSync, readdirSync } = await import("node:fs");
  const dir = new URL("../src/components/", import.meta.url);
  const missing = [];
  for (const file of readdirSync(dir).filter(name => name.endsWith(".tsx"))) {
    const source = readFileSync(new URL(file, dir), "utf8");
    for (const match of source.matchAll(/^\s*(onValueChange|onSelectedChange|onExpandedChange)\?: \(([^)]*)\) => void;/gm)) {
      if (!/,\s*event\??:/.test(match[2])) missing.push(`${file}: ${match[1]}(${match[2]})`);
    }
  }
  assert.deepEqual(missing, []);
});
