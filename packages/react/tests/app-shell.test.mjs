import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { SectionHeading, Titlebar } from '../dist/modules/index.js';

// docs/specs/app-shell.md (2026-10-15).
test('Titlebar is a header with its start, an end group, and the macOS clearance when asked', () => {
  const html = render(h(Titlebar, { windowControls: 'macos', end: h('button', { type: 'button' }, 'Theme') }, h('span', null, 'Tabs')));
  assert.match(html, /^<header class="area-titlebar area-titlebar--macos"><span>Tabs<\/span><div class="area-titlebar__end"><button type="button">Theme<\/button><\/div><\/header>$/);
  assert.match(render(h(Titlebar, null, 'x')), /^<header class="area-titlebar">x<\/header>$/);
});
test('SectionHeading names itself with an id and puts its lede under the title', () => {
  const html = render(h(SectionHeading, { title: 'Arrows', titleId: 'arrows', lede: 'Point and move.', level: 3 }));
  assert.match(html, /<h3 class="area-section-heading__title" id="arrows">Arrows<\/h3><p class="area-section-heading__lede">Point and move\.<\/p>/);
  assert.doesNotMatch(render(h(SectionHeading, { title: 'Arrows' })), /lede/);
});
