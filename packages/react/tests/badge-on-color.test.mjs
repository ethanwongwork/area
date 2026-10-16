import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Badge } from '../dist/modules/index.js';

// docs/specs/badge.md (2026-10-15): Badge onColor is Code's on-colour chip.
test('onColor adds the on-color modifier beside the variant', () => {
  assert.match(render(h(Badge, { onColor: true, size: 'sm' }, 'AA · 4.61')), /class="area-badge area-badge--soft area-badge--neutral area-badge--sm area-badge--on-color"/);
  assert.doesNotMatch(render(h(Badge, null, 'Draft')), /on-color/);
});
test('the on-color paint is the ink, a plate of its opposite and a line of it', () => {
  const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8');
  const rule = css.match(/\.area-badge--on-color \{([^}]*)\}/)?.[1] ?? '';
  assert.match(rule, /--_fg: currentcolor/);
  assert.match(rule, /--_bg: oklch\(from currentcolor calc\(1 - l\) 0 0 \/ 0\.08\)/);
  assert.match(rule, /--_border: color-mix\(in oklab, currentcolor 20%, transparent\)/);
});
