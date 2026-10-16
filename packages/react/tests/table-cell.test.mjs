import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { TableCell, TableHeaderCell } from '../dist/modules/index.js';

// docs/specs/table.md (2026-10-15): the cell options as props, writing Table's existing modifiers.
const row = (...cells) => render(h('table', null, h('tbody', null, h('tr', null, ...cells))));
test('TableCell writes numeric and fit as the existing modifiers, and nothing when neither is set', () => {
  assert.match(row(h(TableCell, { numeric: true }, '12')), /<td class="area-table__cell--numeric">12<\/td>/);
  assert.match(row(h(TableCell, { fit: true, className: 'x' }, 'a')), /<td class="area-table__cell--fit x">a<\/td>/);
  assert.match(row(h(TableCell, null, 'b')), /<td>b<\/td>/);
});
test('TableHeaderCell is a column heading unless told otherwise', () => {
  assert.match(row(h(TableHeaderCell, { numeric: true }, 'Value')), /<th scope="col" class="area-table__cell--numeric">Value<\/th>/);
  assert.match(row(h(TableHeaderCell, { scope: 'row' }, 'Root')), /<th scope="row">Root<\/th>/);
});
