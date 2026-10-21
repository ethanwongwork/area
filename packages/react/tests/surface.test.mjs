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

const P = ':where(.area-surface, .area-card, .area-panel)';
const depth = (n, subject) => `${Array(n).fill(P).join(' ')} ${subject}`;

test('a nested Surface takes its parent corner less the parent inset (as Card media), floored, through alternating properties', () => {
  // Every level reads its parent's published corner with `inherit` and publishes its own under the other name, so no
  // level declares the property it reads (a custom property cannot read its parent's value of a name it also sets).
  const two = rule(depth(1, '.area-surface'));
  assert.match(two, /--_sf-a: inherit;/);
  assert.match(two, /--_sf-corner: var\(--_sf-a\);/);
  assert.match(two, /--_sf-b: max\(var\(--area-radius-floor\), calc\(var\(--_sf-corner\) - var\(--_sf-inset\)\)\);/);
  const three = rule(depth(2, '.area-surface'));
  assert.match(three, /--_sf-b: inherit;/);
  assert.match(three, /--_sf-corner: var\(--_sf-b\);/);
  assert.match(rule(depth(3, '.area-surface')), /--_sf-a: inherit;/);
});

test('Card and Panel publish the corner a Surface inside them takes: their own corner less their inset', () => {
  assert.ok(css.includes('  .area-card { --_sf-a: var(--_card-media-radius); }'));
  assert.match(rule('.area-panel'), /--_sf-a: max\(var\(--area-radius-floor\), calc\(var\(--_panel-corner\) - var\(--_inset\)\)\);/);
  // Nested, each keeps the parity: it inherits the name its parent published and publishes under the other.
  assert.match(rule(depth(1, '.area-card')), /--_sf-a: inherit; --_sf-b: var\(--_card-media-radius\);/);
  assert.match(rule(depth(2, '.area-card')), /--_sf-b: inherit; --_sf-a: var\(--_card-media-radius\);/);
  assert.match(rule(depth(1, '.area-panel')), /--_sf-a: inherit; --_sf-b: max\(/);
  const panel = readFileSync(new URL('../../styles/src/components/panel.css', import.meta.url), 'utf8');
  assert.match(panel, /border-radius: var\(--_panel-corner\);/);
  assert.match(panel, /--_panel-corner: 0px;/);
});

test('one edge per boundary: only the outermost raised Surface lifts; a soft well has no line or shadow', () => {
  assert.match(rule(depth(1, '.area-surface')), /--_sf-lift: 0 0 0 0 transparent;/);
  const soft = rule('.area-surface--soft');
  assert.match(soft, /--_sf-edge: transparent;/);
  assert.match(soft, /--_sf-shade: 0 0 0 0 transparent;/);
  assert.match(rule('.area-surface'), /--_sf-lift: var\(--area-shadow-resting\);/);
});

test('text set straight in a Surface takes the body role of its own scope, as Card body text does', () => {
  const base = rule('.area-surface');
  assert.match(base, /font-size: var\(--area-text-sm-size\);/);
  assert.match(base, /line-height: var\(--area-text-sm-leading\);/);
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

test('a Card inside a Surface reads the corner its parent publishes, by the same depth parity; other Cards keep theirs', () => {
  assert.ok(css.includes(`${depth(1, '.area-card:where(.area-surface *)')} { --_card-radius: var(--_sf-a); }`));
  assert.ok(css.includes(`${depth(2, '.area-card:where(.area-surface *)')} { --_card-radius: var(--_sf-b); }`));
  // Low weight, so a card in a media well keeps the well's corner.
  assert.match(css, /\.area-card__media--well > \.area-card \{[^}]*--_card-radius:/);
});
