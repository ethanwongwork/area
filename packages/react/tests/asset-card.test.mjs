import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { AssetCard, AssetGrid, AssetGridItem } from '../dist/modules/index.js';

// docs/specs/asset-card.md (round 55's designs): a square card, its head (name, detail, controls) before its frame; the
// frame's kind follows its content.
test('the head comes before the frame, with the name and the controls only', () => {
  const html = render(h(AssetCard, { name: 'Title', meta: '24 / 32', actions: h('button', { 'aria-label': 'Copy' }), media: h('span', null, 'Aa') }));
  assert.match(html, /^<div class="area-asset-card area-asset-card--asset[^"]*">/);
  assert.match(html, /area-asset-card__head"><span class="area-asset-card__name">Title<\/span><div class="area-asset-card__actions">/);
  assert.doesNotMatch(html, /24 \/ 32|area-asset-card__meta/, 'meta is deprecated and ignored (round 58)');
  assert.ok(html.indexOf('__head') < html.indexOf('__frame'), 'head first');
});

test('the kind follows the content: an image covers, a colour paints, a group makes a mosaic', () => {
  const image = render(h(AssetCard, { name: 'David Tee', media: 'images/david-tee.jpg' }));
  assert.match(image, /area-asset-card--image/);
  assert.match(image, /<img src="images\/david-tee.jpg" alt=""/);
  const color = render(h(AssetCard, { name: 'blue/500', color: 'var(--area-blue-500)' }));
  assert.match(color, /area-asset-card--color[^>]*style="--_asset-color:var\(--area-blue-500\)"/);
  assert.doesNotMatch(color, /area-asset-card__media/);
  const group = render(h(AssetCard, { name: 'Group one', group: ['a.png', 'b.png'] }));
  assert.match(group, /area-asset-card--group/);
  assert.equal((group.match(/area-asset-card__cell/g) || []).length, 4, 'four cells, two empty');
  assert.match(group, /area-asset-card__mosaic" aria-hidden="true"/);
});

// 2026-10-22: caption places the head (above, the default, or below the frame); captionProps still reach the head.
test('caption places the head and captionProps still reach the head', () => {
  assert.match(render(h(AssetCard, { name: 'Title' })), /area-asset-card--above/);
  const html = render(h(AssetCard, { name: 'Title', caption: 'below', captionProps: { 'data-host': 'x' } }));
  assert.match(html, /area-asset-card--below/);
  assert.doesNotMatch(html, /area-asset-card--inside/);
  assert.match(html, /area-asset-card__head" data-host="x"/);
});

test('basic, fill and borderless are classes on the card; a basic frame declares the card\'s fill', () => {
  const html = render(h(AssetCard, { name: 'Title', container: 'basic', fill: 'raised', borderless: true }));
  assert.match(html, /area-asset-card--basic/);
  assert.match(html, /area-asset-card--raised/);
  assert.match(html, /area-asset-card--borderless/);
  assert.match(html, /area-asset-card__frame" data-area-ground="raised"/);
  assert.match(render(h(AssetCard, { name: 'Title', container: 'basic' })), /area-asset-card__frame" data-area-ground="tile"/);
  // A framed card's frame is the page tone (2026-10-22, the layer map), so a raised component inside lifts from it.
  assert.match(render(h(AssetCard, { name: 'Title', media: 'x' })), /area-asset-card__frame" data-area-ground="page"/);
  assert.match(render(h(AssetCard, { name: 'Title' })), /area-asset-card--recessed/);
});

test('in a grid each card is an option named by its name', () => {
  const html = render(h(AssetGrid, { 'aria-label': 'Assets' }, h(AssetGridItem, { value: 'blue', name: 'blue/500', color: '#2563eb' })));
  assert.match(html, /role="option"/);
  assert.match(html, /area-asset-card--color/);
});

// Round 57: an element in a group is a thumbnail of itself, inert, not the live thing at full size.
test('an element in a group cell is an inert, scaled thumbnail', () => {
  const html = render(h(AssetCard, { name: 'Group one', group: ['a.png', h('button', null, 'Button')] }));
  assert.match(html, /area-asset-card__cell"><span class="area-asset-card__thumb" inert=""><button>Button<\/button>/);
  assert.doesNotMatch(html, /area-asset-card__thumb"[^>]*><img/);
});

