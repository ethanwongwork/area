import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Button, Combobox, Dialog, Popover, PopoverHeader, PopoverTitle, Slider } from '../dist/modules/index.js';

const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const body = selector => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, s]) => s.split(',').some(p => p.trim() === selector)).map(([, , b]) => b).join('\n');

test('a triggered Dialog without a title takes its aria-label on the native dialog (audit E-7)', () => {
  const html = renderToString(h(Dialog, { trigger: h('button', null, 'Open'), 'aria-label': 'Rename page' }, 'Body'));
  assert.match(html, /<dialog[^>]*aria-label="Rename page"/);
  assert.doesNotMatch(html, /class="area-dialog"[^>]*aria-label=/);
});

test('a PopoverTitle takes an id its Popover can be labelled by (audit E-8)', () => {
  const html = renderToString(h(Popover, null, h(PopoverHeader, null, h(PopoverTitle, null, 'Title'))));
  assert.match(html, /<h2 id="[^"]+-title" class="area-popover__title"/);
  const own = renderToString(h(Popover, null, h(PopoverTitle, { id: 'mine' }, 'Title')));
  assert.match(own, /<h2 id="mine"/);
});

test('a named Combobox submits the option value, not its label (audit B-12)', () => {
  const html = renderToString(h(Combobox, { 'aria-label': 'Font', name: 'font', defaultValue: 'geist', options: [{ value: 'geist', label: 'Geist' }] }));
  assert.match(html, /<input type="hidden" name="font" value="geist"/);
  assert.equal([...html.matchAll(/name="font"/g)].length, 1);
});

test('an icon-only Button keeps its children as its accessible name (audit A-12)', () => {
  const html = renderToString(h(Button, { iconOnly: true, icon: h('svg') }, 'Add'));
  assert.match(html, /<span class="area-sr-only">Add<\/span>/);
});

test('a Slider announces its visible readout (audit C-10)', () => {
  const html = renderToString(h(Slider, { 'aria-label': 'Speed', min: 0.5, max: 2, step: 0.25, defaultValue: 1.25, readout: value => `${value}×` }));
  assert.match(html, /aria-valuetext="1.25×"/);
});

test('Select rests as every outline field, on Field shadow (transparent by default), never the old resting shadow (audit B-2)', () => {
  assert.match(body('.area-select'), /box-shadow: var\(--_field-lift\)/);
  assert.doesNotMatch(body('.area-select'), /box-shadow: var\(--area-shadow-1\)/);
});

test('a circle calendar day shows a hover step (audit F-11)', () => {
  assert.match(css, /\.area-calendar--circle \.area-calendar__day:hover:not\(:disabled, \[aria-disabled="true"\], \[data-outside\], \[data-selected\]\) \{ background: var\(--area-bg-component-active\); \}/);
});

test('a disabled tree row dims as a whole (audit D-5)', () => {
  assert.match(body('.area-tree-view [role="treeitem"][data-disabled]'), /opacity: var\(--area-opacity-disabled\)/); // 0.5 (audit S21b)
});

test('an input action has pressed and disabled paint, and a disabled one does not hover (audit B-8)', () => {
  assert.match(body('.area-input__action-button:active:not(:disabled)'), /var\(--area-bg-component-pressed\)/); // pressed, a step past selected (interaction polish 2026-10-16)
  assert.match(body('.area-input__action-button[aria-expanded="true"]:not(:disabled)'), /var\(--area-bg-component-pressed\)/); // held while its list is open (plan B7.1)
  assert.match(body('.area-input__action-button:disabled'), /var\(--area-fg-disabled\)/);
  assert.ok(css.includes('.area-input__action-button:hover:not(:disabled)'));
});
