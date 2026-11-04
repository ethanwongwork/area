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
  // 2026-10-24: overlay sets the name on the frame, shown on hover or focus; the name stays in the markup.
  const overlay = render(h(AssetCard, { name: 'Title', caption: 'overlay', media: '/a.png' }));
  assert.match(overlay, /area-asset-card--overlay/);
  assert.match(overlay, /area-asset-card__name">Title</);
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


test('with no name or controls an asset card has no head: containerless, the frame alone (Preview frame, folded in)', () => {
  const frame = render(h(AssetCard, { container: 'containerless', role: 'img', 'aria-label': 'Search', media: h('svg') }));
  assert.doesNotMatch(frame, /area-asset-card__head/);
  assert.match(frame, /^<div role="img" aria-label="Search" class="area-asset-card area-asset-card--asset area-asset-card--containerless[^"]*"|class="area-asset-card[^"]*area-asset-card--containerless[^"]*"[^>]*role="img"/);
  assert.match(frame, /area-asset-card__frame/);
  // A name alone, or controls alone, keeps the head.
  assert.match(render(h(AssetCard, { name: 'Search', media: h('svg') })), /area-asset-card__head/);
  assert.match(render(h(AssetCard, { actions: h('button', null, 'Copy'), media: h('svg') })), /area-asset-card__head/);
});

test('an asset card takes the wide aspect and the checker fill; a colour on the checker keeps its value', () => {
  const html = render(h(AssetCard, { container: 'containerless', aspect: 'wide', fill: 'checker', color: 'rgb(37 99 235 / 0.4)' }));
  assert.match(html, /area-asset-card--wide/);
  assert.match(html, /area-asset-card--checker/);
  assert.match(html, /area-asset-card--color/);
  assert.match(html, /--_asset-color:rgb\(37 99 235 \/ 0.4\)/);
});

// Visual pass 2026-10-27: a group's cell is the frame's tone, and a cell holding an element draws the frame's edge (it
// was white with no edge, so a thumbnail floated loose in the 2 × 2); image cells keep none (owner, round 59).
test('a group cell holding an element draws its frame, an image cell does not', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../../styles/src/components/asset-card.css', import.meta.url), 'utf8');
  const cell = css.match(/\.area-asset-card__cell \{[^}]*\}/)[0];
  assert.match(cell, /background-color: var\(--area-bg-frame\)/, 'the frame tone');
  assert.match(css, /\.area-asset-card__cell:has\(> \.area-asset-card__thumb\) \{ box-shadow: inset 0 0 0 var\(--area-stroke-width\) var\(--area-edge-media\); \}/, "the frame's edge, inset, the Media stroke group's");
  assert.match(css, /\.area-asset-card--containerless \.area-asset-card__cell \{ box-shadow: none; \}/, 'no edge at rest when containerless');
  const html = render(h(AssetCard, { name: 'Group one', group: ['a.png', h('button', null, 'Button')] }));
  assert.match(html, /area-asset-card__cell"><img[^>]*><\/span>/, 'an image cell has no thumb');
});

// Visual pass 2026-10-27: the app's own tile hooks stop at every specimen's holder, the Stage's view as well as a tile's
// stage, so the Stage draws Asset card as it ships (it took the app's 16 corner and inset, and the grid the app's 8 gap).
test("the app's Asset card hooks stop at the tile stage and the Stage", async () => {
  const { readFileSync } = await import('node:fs');
  const canvas = readFileSync(new URL('../../../apps/desktop/src/styles/canvas.css', import.meta.url), 'utf8');
  const reset = canvas.match(/\.gallery-tile__stage,\s*\.studio-stage__view \{[^}]*\}/);
  assert.ok(reset, 'one reset for both specimen holders');
  for (const hook of ['--area-asset-card-corner', '--area-asset-card-name-inset', '--area-asset-card-inset', '--area-asset-grid-gap']) assert.match(reset[0], new RegExp(`${hook}: initial;`));
});

// 2026-11-01 (owner: "1920x1080 AR for card thumbnails"; Are.na's grid; "redesign the group cards for saved references"):
// a screen aspect, an image's fit, and a group's strip (the "Group container" strip design).
test('aspect screen, fit and the strip are classes; contain carries the image ratio; a strip draws only what it has', async () => {
  const screen = render(h(AssetCard, { name: 'Button', aspect: 'screen', media: h('span', null, 'B') }));
  assert.match(screen, /area-asset-card--screen/);
  assert.match(render(h(AssetCard, { name: 'David Tee', media: 'a.png' })), /area-asset-card--natural/, 'natural by default');
  const cover = render(h(AssetCard, { name: 'David Tee', media: 'a.png', fit: 'cover', aspect: 'screen' }));
  assert.match(cover, /area-asset-card--cover/);
  const contain = render(h(AssetCard, { name: 'David Tee', media: 'a.png', fit: 'contain', mediaRatio: 0.5 }));
  assert.match(contain, /area-asset-card--contain[^>]*style="--_media-ratio:0.5"/);
  const strip = render(h(AssetCard, { name: 'Group one', group: ['a.png', 'b.png', 'c.png', 'd.png', 'e.png'], mosaic: 'strip' }));
  assert.match(strip, /area-asset-card--strip/);
  assert.equal((strip.match(/area-asset-card__cell/g) || []).length, 5, 'five cells, no empty ones');
  assert.equal((render(h(AssetCard, { name: 'Group two', group: ['a.png'], mosaic: 'strip' })).match(/area-asset-card__cell/g) || []).length, 1);
  const item = render(h(AssetGrid, { 'aria-label': 'Images' }, h(AssetGridItem, { value: 'a', name: 'A', media: 'a.png', fit: 'cover', aspect: 'screen' })));
  assert.match(item, /area-asset-card--cover/);
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../../styles/src/components/asset-card.css', import.meta.url), 'utf8');
  assert.match(css, /\.area-asset-card--image:is\(\.area-asset-card--cover, \.area-asset-card--contain\) > \.area-asset-card__frame \{ aspect-ratio: var\(--_aspect, 1\); \}/, 'a fitted image takes the card aspect');
  assert.match(css, /\.area-asset-card--basic \{ --_inset: max\(0px, calc\(var\(--area-asset-card-inset/, 'a basic card takes the inset hook');
});

// 2026-11-01: an asset held far in keeps at least the small corner (the group designs' rounded cells).
test('the frame corner never drops under the small radius where the inset runs it out', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../../styles/src/components/asset-card.css', import.meta.url), 'utf8');
  assert.match(css, /--_frame-corner: max\(var\(--area-radius-min\), calc\([^;]*\), min\(var\(--area-radius-small\), calc\(var\(--_corner\) - var\(--_edge\)\)\)\);/);
});

// 2026-11-01: landscape is 4:3 (one card in three shapes), and a strip scrolls sideways at a host's row height.
test('landscape is 4:3 and a strip scrolls at the strip height hook', async () => {
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../../styles/src/components/asset-card.css', import.meta.url), 'utf8');
  assert.match(css, /\.area-asset-card--landscape:not\(\.area-asset-card--image\) > \.area-asset-card__frame \{ aspect-ratio: 4 \/ 3; \}/);
  assert.match(css, /\.area-asset-card--landscape \{ --_aspect: 4 \/ 3; \}/);
  assert.match(css, /\.area-asset-card--strip > \.area-asset-card__frame \{[^}]*block-size: var\(--area-asset-card-strip-height, auto\)/);
  assert.match(css, /\.area-asset-card--strip \.area-asset-card__mosaic \{[^}]*overflow-x: auto;/);
});

// 2026-11-01 (the card explorer's pick): caption outside, the card its frame alone and the head under it, 4 below.
test('caption outside is a class; the frame draws the card and the head sits under it', async () => {
  assert.match(render(h(AssetCard, { name: 'David Tee', media: 'a.png', caption: 'outside' })), /area-asset-card--outside/);
  const { readFileSync } = await import('node:fs');
  const css = readFileSync(new URL('../../styles/src/components/asset-card.css', import.meta.url), 'utf8');
  assert.match(css, /\.area-asset-card\.area-asset-card--outside \{[^}]*gap: var\(--area-space-4\);/);
  assert.match(css, /\.area-asset-card\.area-asset-card--outside > \.area-asset-card__frame \{[^}]*border-radius: var\(--_corner\);/);
  assert.match(css, /\.area-asset-card\.area-asset-card--outside > \.area-asset-card__head \{ order: 1;/);
  assert.doesNotMatch(css, /\.area-asset-card--contain \.area-asset-card__media > img \{[^}]*box-shadow/, 'no edge on a contained image');
  // 2026-11-02: a headless outside card (a colour, its name on it) takes no top inset of its own; its frame holds the inset.
  assert.match(css, /\.area-asset-card:not\(\.area-asset-card--containerless, \.area-asset-card--outside\):not\(:has\(> \.area-asset-card__head\)\) \{ padding-block-start/);
  // A screen held the inset in keeps its asset 16:9, so a window fits whole.
  assert.match(css, /\.area-asset-card--outside\.area-asset-card--screen:not\(\.area-asset-card--image\) > \.area-asset-card__frame > :not\(\.area-asset-card__badge\) \{ aspect-ratio: 16 \/ 9; \}/);
});
