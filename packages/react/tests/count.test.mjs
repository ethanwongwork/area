import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Count } from '../dist/modules/index.js';

test('formats like Indicator: whole numbers, max+ above the cap, zero hiding opt-in', () => {
  assert.match(render(h(Count, { count: 12 })), />12</);
  assert.match(render(h(Count, { count: 125 })), />99\+</);
  assert.match(render(h(Count, { count: 3.8, max: 2 })), />2\+</);
  assert.match(render(h(Count, { count: NaN })), />0</);
  assert.equal(render(h(Count, { count: 0, showZero: false })), '');
});
test('defaults to plain, neutral, md and maps each axis to its modifier', () => {
  const html = render(h(Count, { count: 1 }));
  for (const cls of ['area-count--plain', 'area-count--md']) assert.match(html, new RegExp(cls));
  const soft = render(h(Count, { count: 1, variant: 'soft', size: 'sm' }));
  for (const cls of ['area-count--soft', 'area-count--sm']) assert.match(soft, new RegExp(cls));
});
test('label adds visually hidden words after the number and passes native props', () => {
  const html = render(h(Count, { count: 3, label: 'unread', id: 'c' }));
  assert.match(html, /id="c"/);
  assert.match(html, />3<span class="area-count__label"> (<!-- -->)?unread<\/span>/);
});
