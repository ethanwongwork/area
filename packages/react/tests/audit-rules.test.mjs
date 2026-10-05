import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { Alert, Button, Checkbox, Chip, Combobox, Composer, Dialog, Menu, MenuItem, Segmented } from '../dist/modules/index.js';
const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

test('Alert closes with a ghost small Button and the Area glyph (audit S9)', () => {
  const html = renderToString(h(Alert, { tone: 'info', onDismiss: () => {}, dismissLabel: 'Dismiss notice' }, 'Saved'));
  assert.match(html, /<span class="area-alert__dismiss"><button[^>]*class="area-button area-button--ghost[^"]*area-button--sm/);
  assert.match(html, /aria-label="Dismiss notice"/);
  assert.match(html, /data-area-glyph="dismiss"/);
});

test('Chip dismisses through onDismiss with the Area glyph; onRemove still works (audit S9)', () => {
  const html = renderToString(h(Chip, { kind: 'input', onDismiss: () => {}, dismissLabel: 'Remove Design' }, 'Design'));
  assert.match(html, /class="area-chip__remove" aria-label="Remove Design"/);
  assert.match(html, /data-area-glyph="dismiss"/);
  const legacy = renderToString(h(Chip, { kind: 'input', onRemove: () => {} }, 'Design'));
  assert.match(legacy, /class="area-chip__remove" aria-label="Remove Design"/); // content-aware default (audit C-6)
});

test('Dialog names its close control with dismissLabel (audit S9)', () => {
  const html = renderToString(h(Dialog, { title: 'Rename', dismissLabel: 'Close rename' }, 'Body'));
  assert.match(html, /aria-label="Close rename"/);
  assert.match(renderToString(h(Dialog, { title: 'Rename' }, 'Body')), /aria-label="Close dialog"/);
});

test('a radio MenuItem is a menuitemradio with the Area check (audit S13)', () => {
  const html = renderToString(h(Menu, { 'aria-label': 'Mode' }, h(MenuItem, { radio: true, checked: true }, 'Standard'), h(MenuItem, { radio: true, checked: false }, 'Focused')));
  assert.match(html, /role="menuitemradio" aria-checked="true"/);
  assert.match(html, /role="menuitemradio" aria-checked="false"/);
  assert.doesNotMatch(html, /data-selected/);
});

test('a loading Button stays focusable: aria-disabled, not native disabled (audit S18)', () => {
  const html = renderToString(h(Button, { loading: true, type: 'submit' }, 'Save'));
  assert.doesNotMatch(html, / disabled=""/);
  assert.match(html, /aria-disabled="true"/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /data-loading=""/);
  assert.match(html, /area-spinner/);
  // A disabled loading button is plainly disabled.
  const both = renderToString(h(Button, { loading: true, disabled: true }, 'Save'));
  assert.match(both, / disabled=""/);
  assert.doesNotMatch(both, /aria-disabled/);
});

test('a loading Composer keeps its field editable and turns send into Stop (audit S18)', () => {
  const html = renderToString(h(Composer, { loading: true, onStop: () => {}, defaultValue: 'Next' }));
  assert.doesNotMatch(html, /<textarea[^>]* disabled=""/);
  assert.match(html, /aria-busy="true"/);
  assert.match(html, /aria-label="Stop"/);
  assert.match(html, /data-area-glyph="stop"/);
  assert.doesNotMatch(html, /aria-label="Send message"/);
  // busy is a deprecated alias; Stop without onStop is disabled.
  const legacy = renderToString(h(Composer, { busy: true }));
  assert.match(legacy, /<button[^>]* disabled=""[^>]*aria-label="Stop"/);
});

test('Segmented reports onValueChange, submits with name, disables as a group (audit S17)', () => {
  const html = renderToString(h(Segmented, { label: 'View', name: 'view', disabled: true, defaultValue: 'grid', options: [{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }] }));
  assert.match(html, /role="radiogroup" aria-label="View" aria-disabled="true"/);
  assert.equal((html.match(/role="radio"[^>]* disabled=""/g) ?? []).length, 2);
  assert.match(html, /<input type="hidden" disabled="" name="view" value="grid"\/>/);
});

test('Checkbox renders onCheckedChange as a change handler; Dialog opens without a trigger (audit S17)', () => {
  const checkbox = renderToString(h(Checkbox, { label: 'Updates', checked: true, onCheckedChange: () => {} }));
  assert.match(checkbox, /checked=""/);
  assert.doesNotMatch(checkbox, /oncheckedchange/i);
  const dialog = renderToString(h(Dialog, { title: 'Delete page?', defaultOpen: true }, 'Body'));
  assert.match(dialog, /<dialog[^>]*class="area-dialog__modal"[^>]*aria-labelledby=/);
  assert.match(renderToString(h(Dialog, { title: 'Inline' }, 'Body')), /^<div role="dialog"/);
});

test('MenuItem takes an icon; pickers let aria-label win and do not preselect (audit S17)', async () => {
  const { ColorPicker, ColorSwatchPicker } = await import('../dist/modules/index.js');
  const item = renderToString(h(MenuItem, { icon: h('svg') }, 'Copy link'));
  assert.match(item, /<span class="area-menu__icon" aria-hidden="true"><svg><\/svg><\/span><span class="area-menu__text">Copy link<\/span>/);
  assert.match(renderToString(h(ColorPicker, { 'aria-label': 'Fill colour', variant: 'plain' })), /aria-label="Fill colour" role="group" class="area-color-picker area-color-picker--plain"[\s\S]*aria-label="Fill colour hue"/);
  const swatches = renderToString(h(ColorSwatchPicker, { label: 'Palette', options: [{ value: '#000000', label: 'Black' }, { value: '#FFFFFF', label: 'White' }] }));
  assert.doesNotMatch(swatches, /checked=""/);
});

test('fields put className and style on the shell; NumberField takes invalid; wrapped buttons are reachable (audit S17)', async () => {
  const { Input, NumberField, ModelPicker, Message } = await import('../dist/modules/index.js');
  assert.match(renderToString(h(Input, { 'aria-label': 'Name', style: { width: 200 } })), /^<div class="area-input[^"]*" style="width:200px"/);
  const number = renderToString(h(NumberField, { 'aria-label': 'Width', invalid: true, style: { width: 80 } }));
  assert.match(number, /^<span class="area-number-field[^"]*" style="width:80px" data-invalid=""/);
  assert.match(number, /aria-invalid="true"/);
  assert.doesNotMatch(number, / invalid=/);
  const picker = renderToString(h(ModelPicker, { models: [{ value: 'a', label: 'Fast' }], triggerProps: { id: 'model-trigger' } }));
  assert.match(picker, /class="area-button[^"]*area-model-picker__trigger" id="model-trigger"/);
  assert.match(renderToString(h(Message, null, 'Hello')), /aria-label="Assistant said"[^>]*class="area-message area-message--assistant"/);
});

test('Toolbar size reaches SplitButton, Segmented and Select (audit A-7)', async () => {
  const { Toolbar, SplitButton, Segmented, Select } = await import('../dist/modules/index.js');
  const html = renderToString(h(Toolbar, { size: 'sm', 'aria-label': 'Tools' },
    h(SplitButton, { iconOnly: true, menu: h(MenuItem, null, 'Rectangle') }, 'Shape'),
    h(Segmented, { label: 'Align', options: [{ value: 'l', label: 'Left' }] }),
    h(Select, { 'aria-label': 'Font' }, h('option', null, 'Inter'))));
  assert.equal((html.match(/area-button--sm/g) ?? []).length, 2);
  assert.match(html, /area-segmented--sm/);
  assert.match(html, /area-select--sm/);
  assert.match(renderToString(h(Toolbar, { size: 'sm', 'aria-label': 'Tools' }, h(Segmented, { size: 'lg', label: 'A', options: [{ value: 'l', label: 'L' }] }))), /area-segmented--lg/);
});

test('a Field reaches the controls inside an InputGroup (audit B-14)', async () => {
  const { Field, InputGroup, InputGroupText, Input, NumberField } = await import('../dist/modules/index.js');
  const html = renderToString(h(Field, { label: 'Price', error: 'Too high', disabled: true },
    h(InputGroup, null, h(InputGroupText, null, '$'), h(Input, { 'aria-label': 'Amount' }), h(NumberField, { 'aria-label': 'Qty' }))));
  assert.match(html, /role="group"[^>]*aria-disabled="true"/);
  assert.match(html, /<div class="area-input[^"]*" data-invalid="" data-disabled="">/);
  assert.match(html, /<input[^>]*disabled=""[^>]*aria-label="Amount"|<input[^>]*aria-label="Amount"[^>]*disabled=""/);
  assert.match(html, /class="area-number-field[^"]*"[^>]*data-invalid=""/);
});

test('field paint: read-only keeps rest paint, soft disabled gains no edge, actions are concentric (audit B-7, B-9, B-10)', () => {
  assert.match(css, /\.area-input\[data-read-only\] \{ cursor: default; \}/);
  assert.match(css, /\.area-input--soft\[data-disabled\] \{ --_border: transparent; \}/);
  assert.match(css, /--_action: calc\(var\(--_height\) - var\(--area-space-8\)\)/);
  assert.match(css, /\.area-input\[data-disabled\] :is\(\.area-input__icon, \.area-input__action-button\) \{ color: var\(--area-fg-disabled\); \}/);
});

test('a removable chip keeps ref and props on one control, style on the chip; ChipGroup is a labelled group (audit C-23, C-24)', async () => {
  const { ChipGroup } = await import('../dist/modules/index.js');
  const html = renderToString(h(Chip, { kind: 'input', onDismiss: () => {}, id: 'tag', style: { margin: 4 } }, 'David Tee'));
  assert.match(html, /^<span class="area-chip[^"]*" style="margin:4px">/);
  assert.match(html, /<button id="tag" type="button" class="area-chip__remove" aria-label="Remove David Tee"/);
  assert.match(renderToString(h(ChipGroup, { label: 'Filters' })), /role="group" aria-label="Filters"/);
});

test('SliderRange is a component: two named native ranges, distinct field names, size and form name (audit C-12)', async () => {
  const { SliderRange } = await import('../dist/modules/index.js');
  const html = renderToString(h(SliderRange, { defaultValue: [20, 60], size: 'sm', name: 'price' }));
  assert.match(html, /^<div class="area-slider-range area-slider-range--sm" style="--_range-start:20%;--_range-end:60%"/);
  assert.equal((html.match(/type="range"/g) ?? []).length, 2);
  assert.equal((html.match(/name="price"/g) ?? []).length, 2);
  assert.match(html, /aria-label="Minimum value"/);
  assert.match(html, /aria-label="Minimum"/);
  assert.match(html, /area-slider--sm/);
});

test('a Menu with a trigger keeps the consumer id and name (audit D-12); checkbox rows stay open (D-11)', () => {
  const html = renderToString(h(Menu, { id: 'file-menu', 'aria-label': 'File', trigger: h(Button, null, 'File') }, h(MenuItem, null, 'New')));
  assert.match(html, /aria-controls="file-menu"/);
  assert.match(html, /<div role="menu"[^>]*id="file-menu"/);
  assert.match(html, /aria-label="File"/);
  assert.doesNotMatch(html, /<div role="menu"[^>]*aria-labelledby=/);
  assert.match(css, /\[aria-expanded="false"\]:dir\(rtl\) \.area-tree-view__chevron svg \{ transform: rotate\(90deg\); \}/);
});

test('MenuSub is a menuitem that opens a nested auto popover menu (audit D-10)', async () => {
  const { MenuSub } = await import('../dist/modules/index.js');
  const html = renderToString(h(Menu, { 'aria-label': 'Page' }, h(MenuSub, { label: 'Move to' }, h(MenuItem, null, 'Design team'))));
  assert.match(html, /role="menuitem" class="area-menu__item area-menu__item--sub" aria-haspopup="menu" aria-expanded="false" aria-controls="([^"]+)"/);
  assert.match(html, /area-menu__sub-chevron/);
  assert.match(html, /<div role="menu" class="area-menu" id="[^"]+" popover="auto" tabindex="-1" aria-label="Move to"/);
});

test('Toaster renders its live regions before any toast; a danger Toast is an alert (audit E-11)', async () => {
  const { Toaster, Toast } = await import('../dist/modules/index.js');
  const html = renderToString(h(Toaster, null, h('p', null, 'App')));
  assert.match(html, /role="status" aria-live="polite"/);
  assert.match(html, /role="alert" aria-live="assertive"/);
  assert.match(html, /<section class="area-toaster" aria-label="Notifications \(F8\)" tabindex="-1" hidden="">/);
  assert.match(renderToString(h(Toast, { tone: 'danger' }, 'Failed')), /class="area-toast__content" role="alert"/);
  assert.match(renderToString(h(Toast, null, 'Saved')), /class="area-toast__content" role="status"/);
});

test('surfaces: headings in the outline, a stretched table link, one disabled dimming (audit F-14, F-22, F-23)', async () => {
  const { CardTitle, Panel, TableLink, Table } = await import('../dist/modules/index.js');
  assert.match(renderToString(h(CardTitle, null, 'Plan')), /^<h3 class="area-card__title">Plan<\/h3>$/);
  assert.match(renderToString(h(CardTitle, { level: 2 }, 'Plan')), /^<h2 /);
  assert.match(renderToString(h(Panel, { title: 'Design', titleLevel: 3 }, 'rows')), /<h3 class="area-panel__title"/);
  assert.match(renderToString(h(Table, { 'aria-label': 'Items', wrapperProps: { id: 'wrap' } }, h('tbody', null, h('tr', null, h('td', null, h(TableLink, { href: '#a' }, 'A')))))), /<div id="wrap" class="area-table-wrapper"><table class="area-table area-table--md" aria-label="Items">.*<a class="area-table__link" href="#a">A<\/a>/);
  assert.match(css, /\.area-calendar\[aria-disabled="true"\] \.area-button:disabled \{ opacity: 1; \}/);
  assert.match(css, /\.area-alignment-picker\[aria-disabled="true"\] \{ opacity: var\(--area-opacity-disabled\);/);
});

test('conversation and code: composer disables its actions, honours inputProps.id; code tabs are Tabs sm (audit G-6, G-14, G-15)', async () => {
  const { CodeBlock } = await import('../dist/modules/index.js');
  const html = renderToString(h(Composer, { disabled: true, inputProps: { id: 'prompt' }, leadingActions: h(Button, { iconOnly: true, 'aria-label': 'Add' }) }));
  assert.match(html, /<fieldset disabled="" class="area-composer__actions area-composer__actions--leading">/);
  assert.match(html, /<label for="prompt"/);
  assert.match(html, /<textarea id="prompt"/);
  const code = renderToString(h(CodeBlock, { languages: ['tsx', 'css'], languageTabs: true, code: 'const a = 1;' }));
  assert.match(code, /<div class="area-tabs area-tabs--sm area-code-block__languages"><div class="area-tabs__list" role="tablist" aria-label="Language">/);
  assert.match(code, /class="area-tabs__tab" data-selected=""/);
  assert.match(css, /\.area-code-block__pre \.area-syntax-keyword \{ color: var\(--area-syntax-keyword\); \}/);
});

test('a linked card lifts every control above its stretched link; RTL arrows mirror (audit F-29, F-34)', () => {
  assert.match(css, /\.area-card:has\(\.area-card__link\) :is\(a, button, input, select, textarea, \[tabindex\]\):not\(\.area-card__link\) \{\s*position: relative;\s*z-index: 2;/);
  assert.match(css, /\.area-calendar:dir\(rtl\) :is\(\.area-calendar__nav, \.area-calendar__header, \.area-calendar__week\) > \.area-button svg \{ scale: -1 1; \}/);
  assert.match(css, /\.area-panel__chevron:dir\(rtl\) > svg \{ scale: -1 1; \}/);
});
