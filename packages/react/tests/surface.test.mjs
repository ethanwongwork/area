import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Surface } from '../dist/modules/index.js';

const css = readFileSync(new URL('../../styles/src/components/surface.css', import.meta.url), 'utf8');
const layers = readFileSync(new URL('../../styles/src/layers.css', import.meta.url), 'utf8');
const rule = selector => {
  const at = css.indexOf(`${selector} {`);
  assert.ok(at >= 0, `missing ${selector}`);
  return css.slice(at, css.indexOf('}', at));
};

test('defaults to surface md, maps each axis to its modifier and passes native props', () => {
  const html = render(h(Surface, { id: 's', role: 'region', 'aria-label': 'Settings' }, 'Body'));
  for (const cls of ['area-surface', 'area-surface--surface', 'area-surface--md']) assert.match(html, new RegExp(`${cls}[ "]`));
  assert.match(html, /id="s"/);
  assert.match(html, /role="region"/);
  const soft = render(h(Surface, { variant: 'soft', size: 'sm' }));
  for (const cls of ['area-surface--soft', 'area-surface--sm']) assert.match(soft, new RegExp(cls));
});

test('a nested Surface takes its parent corner less the parent inset (as Card media), floored, through alternating properties', () => {
  // Every level reads its parent's published corner with `inherit` and publishes its own under the other name, so no
  // level declares the property it reads (a custom property cannot read its parent's value of a name it also sets).
  const two = rule('.area-surface .area-surface');
  assert.match(two, /--_sf-a: inherit;/);
  assert.match(two, /--_sf-corner: var\(--_sf-a\);/);
  assert.match(two, /--_sf-b: max\(var\(--area-radius-floor\), calc\(var\(--_sf-corner\) - var\(--_sf-inset\)\)\);/);
  const three = rule('.area-surface .area-surface .area-surface');
  assert.match(three, /--_sf-b: inherit;/);
  assert.match(three, /--_sf-corner: var\(--_sf-b\);/);
  assert.match(rule('.area-surface .area-surface .area-surface .area-surface'), /--_sf-a: inherit;/);
});

test('one edge per boundary: only the outermost raised Surface lifts; a soft well has no line or shadow', () => {
  assert.match(rule('.area-surface .area-surface'), /--_sf-lift: 0 0 0 0 transparent;/);
  const soft = rule('.area-surface--soft');
  assert.match(soft, /--_sf-edge: transparent;/);
  assert.match(soft, /--_sf-shade: 0 0 0 0 transparent;/);
  assert.match(rule('.area-surface'), /--_sf-lift: var\(--area-shadow-resting\);/);
});

test('the border is counted once and kept in every variant, so the inset does not move with the paint', () => {
  const base = rule('.area-surface');
  assert.match(base, /--_sf-pad: calc\(var\(--_sf-inset\) - var\(--_sf-border\)\);/);
  assert.match(base, /padding: var\(--_sf-pad\);/);
  assert.match(base, /border: var\(--_sf-border\) solid var\(--_sf-edge\);/);
  assert.doesNotMatch(rule('.area-surface--plain'), /border(-width)?:/);
});

test('a Surface holding Surfaces sets them at its media inset, as Card holds its media', () => {
  assert.match(css, /\.area-surface:has\(> :is\(\.area-surface, \.area-card\), > \.area-stack > :is\(\.area-surface, \.area-card\)/);
  assert.match(css, /\{ --_sf-inset: var\(--_sf-media\); \}/);
});

test('the raised Surface points control fills at the raised ground, the soft one at the recessed ground', () => {
  const raised = layers.slice(0, layers.indexOf('[data-area-ground="raised"]'));
  assert.match(raised, /\.area-surface--surface/);
  // The soft Surface is in the recessed ground's list, whatever else shares it (an Asset card paints that ground too).
  assert.match(layers, /:where\([^{]*\.area-surface--soft[^{]*\),\s*\[data-area-ground="recessed"\]/);
});

test('a Card inside a Surface reads the corner that Surface publishes, by the same depth parity', () => {
  assert.match(css, /\.area-surface \.area-card \{ --_card-radius: var\(--_sf-a\); \}/);
  assert.match(css, /\.area-surface \.area-surface \.area-card \{ --_card-radius: var\(--_sf-b\); \}/);
});
