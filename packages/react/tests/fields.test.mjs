import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { SearchField } from '../dist/modules/index.js';

// One field shell (plan B3.1, 2026-11-14; input.css, "One field shell"; DESIGN_SYSTEM.md, "One field shell"). Every
// field draws one shell from inputs its family sets; no family restates the recipe. Reads the built stylesheet and the
// sources, so a family that copies the shell back, or a field that leaves a list, fails here.
const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const src = name => readFileSync(new URL(`../../styles/src/${name}`, import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const ROOTS = ['area-input', 'area-number-field', 'area-input-group', 'area-select', 'area-textarea', 'area-custom-select', 'area-date-picker', 'area-tag-picker', 'area-otp-field'];
const SHELLS = ['.area-input', '.area-number-field', '.area-input-group', '.area-select', '.area-textarea', '.area-custom-select__trigger', '.area-date-picker__trigger', '.area-tag-picker__field', '.area-otp-field__slot'];
const split = selector => selector.split(',').map(part => part.trim());
const ruleWith = (pattern, test) => rules.find(r => test(r.body) && pattern(r.selector));

test('one shell draws every field: edge, corner, fill and lift from the inputs', () => {
  const shell = ruleWith(s => s.startsWith('.area-input,'), b => /border:\s*var\(--area-stroke-width\) solid var\(--_field-edge\)/.test(b));
  assert.ok(shell, 'no shell rule draws the edge from --_field-edge');
  for (const part of SHELLS) assert.ok(split(shell.selector).includes(part), `${part} does not draw the shell`);
  assert.match(shell.body, /--_field-edge:\s*var\(--_border\)/);
  assert.match(shell.body, /border-radius:\s*var\(--_field-shape\)/);
  assert.match(shell.body, /background-color:\s*var\(--_bg\)/);
  assert.match(shell.body, /box-shadow:\s*var\(--_field-lift\)/);
  const shape = ruleWith(s => s.startsWith('.area-input,'), b => /--_field-shape:/.test(b));
  assert.match(shape.body, /--_field-shape:\s*max\(min\(var\(--_radius\), max\(var\(--area-radius-min\), round\(down, calc\(var\(--_height\) \* var\(--area-radius-factor\)\), 2px\)\)\), var\(--_field-pill\) \* var\(--area-radius-full\)\)/, 'the corner is not the ladder corner on the height, or a pill (radius-full) while the Pills flag is set');
  assert.match(rules.find(r => r.selector === '.area-textarea' && /--_field-pill/.test(r.body))?.body ?? '', /--_field-pill:\s*0/, 'Textarea takes round ends');
});

test('every root takes the shell\'s tiers and soft; states set --_field-edge, never border-color', () => {
  for (const size of ['sm', 'md']) {
    const tier = rules.find(r => r.selector.startsWith(`.area-input--${size},`));
    for (const root of ROOTS) assert.ok(split(tier?.selector ?? '').includes(`.${root}--${size}`), `${root} has no ${size} tier in the shell`);
    assert.match(tier.body, new RegExp(`--_height:\\s*var\\(--area-control-${size}\\)`));
  }
  const soft = rules.find(r => r.selector.startsWith('.area-input.area-input--soft'));
  for (const root of ROOTS) assert.ok(split(soft.selector).includes(`.${root}.${root}--soft`), `${root} soft is not the shell's`);
  assert.match(soft.body, /--_border-hover:\s*var\(--_border-soft-hover\)/, 'a soft field shows no edge under the pointer');
  const roots = ruleWith(s => s.startsWith('.area-input, .area-number-field, .area-input-group'), b => /--_border-soft-hover:/.test(b));
  assert.match(roots.body, /--_border-soft-hover:\s*var\(--area-input-edge\)/, 'soft hover is not the control edge');
  // Hover and focus reach every shell, and set the edge through the variable.
  const hover = rules.find(r => /:hover/.test(r.selector) && /--_field-edge:\s*var\(--_border-hover\)/.test(r.body));
  const focus = rules.find(r => /focus/.test(r.selector) && /--_field-edge:\s*var\(--_border-focus\)/.test(r.body) && /outline:/.test(r.body));
  for (const part of ['area-input', 'area-number-field', 'area-input-group', 'area-select', 'area-textarea', 'area-custom-select__trigger', 'area-date-picker__trigger', 'area-tag-picker__field', 'area-otp-field__slot']) {
    assert.ok(hover?.selector.includes(part), `${part} has no shell hover edge`);
    assert.ok(focus?.selector.includes(part), `${part} has no shell focus`);
  }
  // No family file restates the recipe on its shell.
  const files = { 'number-field.css': '.area-number-field', 'input-group.css': '.area-input-group', 'select.css': '.area-select', 'textarea.css': '.area-textarea',
    'custom-select.css': '.area-custom-select__trigger', 'date-picker.css': '.area-date-picker__trigger', 'tag-picker.css': '.area-tag-picker__field', 'otp-field.css': '.area-otp-field__slot' };
  for (const [file, shellSelector] of Object.entries(files)) {
    const text = src(`components/${file}`);
    for (const [, selector, body] of text.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
      if (!split(selector.trim()).some(part => part === shellSelector || part === shellSelector.replace(/__.*/, ''))) continue;
      assert.doesNotMatch(body, /(^|[;\s])(border(-radius)?|font-size|line-height|box-shadow):/, `${file} restates the shell on ${selector.trim()}`);
      assert.doesNotMatch(body, /--_(height|radius|text|leading)\s*:/, `${file} restates a tier on ${selector.trim()}`);
    }
    assert.doesNotMatch(text, /border-color:\s*var\(--_border-(hover|focus)\)/, `${file} paints a state edge with border-color, not --_field-edge`);
  }
});

test('a group\'s seams are the field edge, and the group takes its fields\' status', () => {
  const seam = rules.find(r => r.selector === '.area-input-group > :not(:first-child)');
  assert.match(seam?.body ?? '', /border-inline-start:\s*var\(--area-stroke-width\) solid var\(--area-input-edge\)/, 'seams are lighter than the group\'s edge');
  assert.ok(rules.some(r => /\.area-input-group:has\(\[data-warning\]\)/.test(r.selector) && /--_border:\s*var\(--_tone-warning\)/.test(r.body)));
});

test('a label above its control sits the Field\'s label gap over it, a Panel caption the panel\'s (plan B3.1)', () => {
  assert.match(rules.find(r => r.selector === '.area-field' && /gap/.test(r.body))?.body ?? '', /gap:\s*var\(--area-ui-stack\)/);
  assert.match(rules.find(r => r.selector === '.area-slider--top')?.body ?? '', /row-gap:\s*var\(--_panel-label-gap, var\(--area-ui-stack\)\)/, 'Slider\'s top label sits closer than every other');
});

test('a field\'s own text parts are on the one centring model (plan B2.2 in fields)', () => {
  const capSlots = rules.find(r => r.selector.includes('.area-button__label') && /text-box:\s*trim-both cap alphabetic/.test(r.body));
  for (const part of ['.area-input__affix', '.area-custom-select__value', '.area-date-picker__value', '.area-number-field__unit', '.area-otp-field__char'])
    assert.ok(split(capSlots.selector).includes(part), `${part} is not a cap slot`);
  const lineSlots = rules.find(r => r.selector.includes('.area-tooltip__text') && /--_line-room/.test(r.body));
  for (const part of ['.area-time-field__segment', '.area-time-field__literal']) assert.ok(split(lineSlots.selector).includes(part), `${part} is not a line slot`);
  for (const box of ['.area-number-field__scrub:not(:has(> *))', '.area-input-group__text:not(:has(> *))']) {
    const rule = rules.find(r => r.selector === box);
    assert.match(rule?.body ?? '', /text-box:\s*trim-both cap alphabetic/, `${box} is not trimmed`);
    assert.match(rule?.body ?? '', /padding-block:\s*var\(--_cap-room\)/, `${box} is not padded to its box`);
    assert.match(rule?.body ?? '', /display:\s*block/, `${box} is a flex box, which trim cannot reach`);
  }
});

test('steppers and the split trigger reach a 24 target at every size (owner, 2026-11-13)', () => {
  assert.match(rules.find(r => r.selector === '.area-number-field__steppers')?.body ?? '', /gap:\s*max\(0px, calc\(var\(--area-space-24\) - var\(--_step\)\)\)/, 'abutting steppers sit closer than the target floor');
  const hit = rules.find(r => /^:is\(.*\.area-number-field__step/.test(r.selector) && /--_hit-inline:/.test(r.body));
  assert.match(hit?.body ?? '', /--_hit-inline:\s*var\(--area-space-24\)/, 'a stepper\'s target is not 24 across');
  const trigger = rules.find(r => r.selector === '.area-split-button > .area-split-button__trigger' && /inline-size/.test(r.body));
  assert.match(trigger?.body ?? '', /inline-size:\s*max\(calc\(var\(--_height\) - 4px\), var\(--area-space-24\)\)/);
  assert.match(rules.find(r => r.selector === '.area-split-button--icon-only > .area-split-button__trigger')?.body ?? '', /inline-size:\s*max\(calc\(var\(--_height\) \/ 2\), var\(--area-space-24\)\)/);
  // The arithmetic at the ladder's smallest fields (Compact sm 24, default sm 26, default md 30): centres 24 apart.
  for (const height of [24, 26, 28, 30, 34, 38]) {
    const step = height - 8, gap = Math.max(0, 24 - step);
    assert.ok(step + gap >= 24, `steppers at ${height} sit ${step + gap} apart`);
    assert.ok(Math.max(height - 4, 24) >= 24 && Math.max(height / 2, 24) >= 24);
  }
});

test('a selectable table row is a ladder height, the rule inside it', () => {
  const row = rules.find(r => r.selector === '.area-table tr:has(> :is(td, th) > .area-checkbox) > :is(td, th)');
  assert.match(row?.body ?? '', /--_select-top:\s*round\(up, calc\(\(var\(--_select-row\) - var\(--_cell-line\)\) \/ 2\), 1px\)/);
  assert.match(row?.body ?? '', /- var\(--area-stroke-width\)\)/, 'the rule is not counted inside the row');
  for (const [selector, rung] of [['.area-table', 'lg'], ['.area-table--sm', 'sm'], ['.area-table--lg', 'xl']])
    assert.ok(rules.some(r => r.selector === selector && new RegExp(`--_select-row:\\s*var\\(--area-control-${rung}\\)`).test(r.body)), `${selector} selectable rows are not control-${rung}`);
});

test('one clear glyph, and no part of a field drawn by the platform (plan B3.3)', () => {
  const html = render(h(SearchField, { 'aria-label': 'Search', defaultValue: 'plan' }));
  assert.match(html, /area-search-field__clear[\s\S]*data-area-glyph="dismiss"/);
  assert.doesNotMatch(html, /dismiss-circle/, 'the clear action draws the status mark');
  const grip = rules.find(r => r.selector === '.area-textarea::-webkit-resizer');
  assert.match(grip?.body ?? '', /var\(--area-input-chevron\)/, 'the resize grip is the platform\'s');
  assert.match(grip?.body ?? '', /--_grip-at:\s*max\(var\(--area-space-4\), calc\(var\(--_field-shape\) - var\(--area-stroke-width\)\)\)/, 'the grip is not kept inside the corner');
});
