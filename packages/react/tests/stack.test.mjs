import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Stack } from '../dist/modules/index.js';

const css = readFileSync(new URL('../../styles/src/components/stack.css', import.meta.url), 'utf8');

test('defaults to a vertical group and maps each option to its modifier', () => {
  const html = render(h(Stack, { id: 'k' }, 'One'));
  for (const cls of ['area-stack', 'area-stack--vertical', 'area-stack--group']) assert.match(html, new RegExp(`${cls}[ "]`));
  assert.match(html, /id="k"/);
  assert.doesNotMatch(html, /area-stack--(start|center|end|stretch|baseline)/, 'align has no default: a column stretches, a row centres');
  const row = render(h(Stack, { orientation: 'horizontal', gap: 'related', align: 'baseline', spread: true, wrap: true }));
  for (const cls of ['area-stack--horizontal', 'area-stack--related', 'area-stack--baseline', 'area-stack--spread', 'area-stack--wrap']) assert.match(row, new RegExp(cls));
});

test('gaps are roles on Area layout tokens, never numbers, and never exceed the Surface inset they sit in', () => {
  assert.match(css, /\.area-stack--related \{ --_stack-gap: var\(--area-ui-cluster\); \}/);
  assert.match(css, /\.area-stack--group \{ --_stack-gap: var\(--area-gap-row\); \}/);
  assert.match(css, /\.area-stack--section \{ --_stack-gap: calc\(var\(--area-gap-row\) \* 2\); \}/);
  assert.match(css, /gap: min\(var\(--_stack-gap\), var\(--_surface-room, var\(--_stack-gap\)\)\);/);
});
