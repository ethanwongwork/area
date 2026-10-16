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
test('the selected stroke is a state edge: stroke-width, made up to 2 whatever the Surface', () => {
  const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8');
  const rule = css.match(/\.area-card:is\(\[data-selected\], \[aria-pressed="true"\], \[aria-selected="true"\]\) \{([^}]*)\}/)?.[1] ?? '';
  assert.match(rule, /border-color: var\(--area-stroke-selected\)/);
  assert.match(rule, /inset 0 0 0 calc\(var\(--area-stroke-width\) \* 2 - var\(--_card-border\)\) var\(--area-stroke-selected\)/);
});
