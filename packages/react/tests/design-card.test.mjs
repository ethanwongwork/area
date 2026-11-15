import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h, createRef } from 'react';
import { renderToString as render } from 'react-dom/server';
import { DesignCard, placeDesign } from '../dist/modules/index.js';

test('a part keeps a tenth of the short side, 12 to 48, and never passes 100%', () => {
  const button = { width: 90, height: 32 };
  assert.deepEqual(placeDesign('part', button, { width: 320, height: 320 }), { margin: 32, scale: 1, x: 115, y: 144, cropped: false });
  assert.equal(placeDesign('part', button, { width: 120, height: 120 }).margin, 12);
  assert.equal(placeDesign('part', button, { width: 960, height: 960 }).margin, 48);
  assert.equal(placeDesign('part', { width: 300, height: 200 }, { width: 400, height: 400 }).scale, 1);
});

test('a part under 50% holds 50% and is cropped on its focus', () => {
  const palette = { width: 560, height: 420 };
  const top = placeDesign('part', palette, { width: 240, height: 240 }, 'top');
  assert.equal(top.scale, 0.5);
  assert.equal(top.cropped, true);
  assert.equal(top.y, top.margin);
  const start = placeDesign('part', { width: 900, height: 40 }, { width: 240, height: 240 }, 'start');
  assert.equal(start.x, start.margin);
  const centre = placeDesign('part', palette, { width: 240, height: 240 });
  assert.equal(centre.x, Math.round((240 - 280) / 2));
});

test('a screen is always whole, in a twentieth margin', () => {
  const at = placeDesign('screen', { width: 1920, height: 1080 }, { width: 320, height: 180 });
  assert.equal(at.margin, 8);
  assert.equal(at.cropped, false);
  assert.ok(at.scale < 0.5);
  assert.ok(1080 * at.scale <= 180 - 2 * at.margin + 1e-9);
});

test('a phone stands from the top margin at 60% of the width and runs off the bottom', () => {
  const at = placeDesign('phone', { width: 390, height: 844 }, { width: 320, height: 320 });
  assert.equal(at.y, at.margin);
  assert.equal(Math.round(390 * at.scale), 192);
  assert.equal(at.cropped, true);
});

test('an icon draws at whole multiples, 1x to 4x', () => {
  const icon = { width: 24, height: 24 };
  assert.equal(placeDesign('icon', icon, { width: 160, height: 160 }).scale, 1);
  assert.equal(placeDesign('icon', icon, { width: 320, height: 320 }).scale, 3);
  assert.equal(placeDesign('icon', icon, { width: 238, height: 238 }).scale, 2);
  assert.equal(placeDesign('icon', icon, { width: 60, height: 60 }).scale, 1);
  assert.equal(placeDesign('icon', icon, { width: 960, height: 960 }).scale, 4);
});

test('a colour paints the card, no margin and no design box', () => {
  assert.equal(placeDesign('color', { width: 0, height: 0 }, { width: 200, height: 200 }).margin, 0);
  const html = render(h(DesignCard, { layout: 'color', color: '#0d99ff', name: 'Accent 500', detail: '#0D99FF' }));
  assert.match(html, /area-design-card--color/);
  assert.match(html, /--_design-color:#0d99ff/);
  assert.doesNotMatch(html, /area-design-card__design/);
  assert.match(html, /area-design-card__detail">#0D99FF/);
});

test('defaults, the wide card for a screen, caption parts and forwarding', () => {
  const ref = createRef();
  const html = render(h(DesignCard, { ref, name: 'Button', id: 'b', 'aria-label': 'Button' }, h('button', null, 'Continue')));
  for (const cls of ['area-design-card--part', 'area-design-card--square', 'area-design-card__ground', 'area-design-card__design', 'area-design-card__name']) assert.match(html, new RegExp(cls));
  assert.match(html, /id="b"/);
  assert.match(html, />Continue</);
  assert.match(render(h(DesignCard, { layout: 'screen' })), /area-design-card--wide/);
  assert.match(render(h(DesignCard, { layout: 'screen', aspect: 'square' })), /area-design-card--square/);
  const selected = render(h(DesignCard, { selected: true, interactive: true, name: 'x', detail: null, actions: h('button', null, 'Copy') }));
  assert.match(selected, /data-selected=""/);
  assert.match(selected, /area-design-card--interactive/);
  assert.doesNotMatch(selected, /area-design-card__detail/);
  assert.match(selected, /area-design-card__actions/);
});

// Plan B1.1 (structure B-S8): what the card holds is `kind`; `layout` stays a deprecated alias for one release.
test('kind names what the card holds, and the deprecated layout still sets it', () => {
  assert.match(render(h(DesignCard, { kind: 'screen' })), /area-design-card--screen/);
  assert.match(render(h(DesignCard, { layout: 'phone' })), /area-design-card--phone/);
  assert.match(render(h(DesignCard, { kind: 'icon', layout: 'phone' })), /area-design-card--icon/, 'kind wins over the alias');
});
