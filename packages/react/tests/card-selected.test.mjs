import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Card } from '../dist/modules/index.js';

// docs/specs/card.md (2026-10-15): selected is rule 3's last step, a 2-wide selection stroke inside the edge.
test('Card selected sets data-selected, and only then', () => {
  assert.match(render(h(Card, { selected: true }, 'Team')), /class="area-card[^"]*" data-selected=""/);
  assert.doesNotMatch(render(h(Card, null, 'Free')), /data-selected/);
});
// axes/states.ts (2026-10-21): the width is the Selected stroke setting, the card's own edge topped up to it, over Selected tint.
test('the selected stroke is a state edge: made up to Selected stroke whatever the Surface', () => {
  const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8');
  const rule = css.match(/\.area-card:is\(\[data-selected\], \[aria-pressed="true"\], \[aria-selected="true"\]\) \{([^}]*)\}/)?.[1] ?? '';
  assert.match(rule, /border-color: var\(--area-stroke-selected\)/);
  assert.match(rule, /inset 0 0 0 max\(0px, calc\(var\(--area-selected-width\) - var\(--_card-border\)\)\) var\(--area-stroke-selected\), inset 0 0 0 100vmax var\(--area-selected-tint\)/);
});
