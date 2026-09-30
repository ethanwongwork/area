import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Radio, RadioGroup } from '../dist/modules/index.js';

const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const body = selector => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, s]) => s.split(',').some(p => p.trim() === selector)).map(([, , b]) => b).join('\n');

test('RadioGroup names its radios when the consumer does not (audit C-8)', () => {
  const html = renderToString(h(RadioGroup, { label: 'Label' }, h(Radio, { value: 'a', label: 'One' }), h(Radio, { value: 'b', label: 'Two' })));
  const names = [...html.matchAll(/type="radio"[^>]*name="([^"]+)"/g)].map(m => m[1]);
  assert.equal(names.length, 2);
  assert.equal(new Set(names).size, 1);
  const explicit = renderToString(h(RadioGroup, { label: 'Label', name: 'plan' }, h(Radio, { value: 'a', label: 'One' })));
  assert.match(explicit, /name="plan"/);
});

test('a Button group keeps its edge under the pointer and paints solid children quietly (audit A-1, A-2)', () => {
  assert.match(body('.area-button-group > .area-button'), /--_border-hover: var\(--_group-edge\)/);
  assert.match(body('.area-button-group > .area-button--solid'), /--_fg: var\(--_tone-fg\)/);
});

test('required edges use the stroke width the Surface axis never zeroes (audit H-3)', () => {
  assert.match(body('.area-button'), /border: var\(--area-stroke-width\) solid var\(--_border\)/);
});

test('a selected tree row keeps its plate under the pointer (audit D-4)', () => {
  assert.ok(css.includes('.area-tree-view [role="treeitem"]:hover:not([data-disabled], [aria-current="page"], [aria-selected="true"])'));
});
