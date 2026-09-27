import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Button, Menu, MenuItem, Popover, Tooltip, computePosition } from '../dist/modules/index.js';

const viewport = { width: 1000, height: 800 };
const surface = { width: 200, height: 120 };
const place = (anchor, options) => computePosition(anchor, surface, viewport, { side: 'bottom', align: 'start', offset: 4, padding: 8, ...options });

test('places the surface on the preferred side, offset from the trigger', () => {
  const p = place({ x: 100, y: 100, width: 80, height: 32 });
  assert.deepEqual([p.side, p.x, p.y], ['bottom', 100, 136]);
  const top = place({ x: 100, y: 400, width: 80, height: 32 }, { side: 'top' });
  assert.deepEqual([top.side, top.y], ['top', 400 - 4 - 120]);
});

test('flips to the opposite side only when it has more room', () => {
  assert.equal(place({ x: 100, y: 700, width: 80, height: 32 }).side, 'top');
  // Neither side fits, but the preferred one has more room: it stays.
  const tight = computePosition({ x: 100, y: 60, width: 80, height: 32 }, { width: 200, height: 900 }, viewport, { side: 'bottom', align: 'start', offset: 4, padding: 8 });
  assert.equal(tight.side, 'bottom');
  assert.equal(place({ x: 900, y: 300, width: 40, height: 32 }, { side: 'right' }).side, 'left');
});

test('aligns on the cross axis and shifts inside the padded viewport', () => {
  assert.equal(place({ x: 500, y: 100, width: 80, height: 32 }, { align: 'end' }).x, 500 + 80 - 200);
  assert.equal(place({ x: 100, y: 100, width: 80, height: 32 }, { align: 'center' }).x, 100 + 40 - 100);
  assert.equal(place({ x: 2, y: 100, width: 20, height: 20 }, { align: 'center' }).x, 8);
  assert.equal(place({ x: 980, y: 100, width: 20, height: 20 }).x, 1000 - 8 - 200);
});

test('reports the height left on its side and an origin at the trigger', () => {
  const p = place({ x: 100, y: 100, width: 80, height: 32 });
  assert.equal(p.availableHeight, 800 - 132 - 4 - 8);
  assert.deepEqual([p.originX, p.originY], [40, 0]);
});

test('a menu button follows the ARIA menu button pattern', () => {
  const html = renderToString(h(Menu, { trigger: h(Button, null, 'Options') }, h(MenuItem, null, 'Rename')));
  const id = html.match(/aria-controls="([^"]+)"/)[1];
  assert.match(html, /aria-haspopup="menu"/);
  assert.match(html, /aria-expanded="false"/);
  // React writes the attribute as popoverTarget; HTML attribute names are case-insensitive.
  assert.match(html, new RegExp(`popovertarget="${id}"`, 'i'));
  assert.match(html, new RegExp(`role="menu"[^>]*id="${id}"|id="${id}"[^>]*role="menu"`));
  assert.match(html, /popover="auto"/);
  const trigger = html.match(/<button[^>]*aria-haspopup="menu"[^>]*>/)[0].match(/ id="([^"]+)"/)[1];
  assert.match(html, new RegExp(`aria-labelledby="${trigger}"`));
});

test('a tooltip describes its trigger and does not dismiss other popovers', () => {
  const html = renderToString(h(Tooltip, { trigger: h(Button, { 'aria-label': 'Search' }) }, 'Search'));
  const id = html.match(/aria-describedby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`role="tooltip"[^>]*id="${id}"`));
  assert.match(html, /popover="manual"/);
});

test('a popover opens from its trigger; without one the surface renders inline', () => {
  const anchored = renderToString(h(Popover, { trigger: h(Button, null, 'Open'), 'aria-label': 'Title' }, 'Body'));
  assert.match(anchored, /aria-haspopup="dialog"/);
  assert.match(anchored, /popovertarget="[^"]+"/i);
  const inline = renderToString(h(Popover, { 'aria-label': 'Title' }, 'Body'));
  assert.doesNotMatch(inline, /popover=/);
});
