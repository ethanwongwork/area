import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Nav, NavItem } from '../dist/modules/index.js';

// docs/specs/nav.md (2026-10-15): revealActions marks the row; without it the row is unchanged.
test('revealActions marks the actions row, and only when there are actions', () => {
  const action = h('button', { type: 'button', 'aria-label': 'Options' });
  assert.match(render(h(Nav, { 'aria-label': 'Pages' }, h(NavItem, { href: '#a', revealActions: true, actions: action }, 'Roadmap'))), /class="area-nav__row area-nav__row--reveal"/);
  assert.match(render(h(Nav, { 'aria-label': 'Pages' }, h(NavItem, { href: '#a', actions: action }, 'Roadmap'))), /class="area-nav__row"/);
  assert.doesNotMatch(render(h(Nav, { 'aria-label': 'Pages' }, h(NavItem, { href: '#a', revealActions: true }, 'Roadmap'))), /area-nav__row/);
});
