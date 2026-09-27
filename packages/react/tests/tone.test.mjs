import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { AlignmentPicker, Calendar, Checkbox, Chip, MANIFESTS, Radio } from '../dist/modules/index.js';

// DESIGN_SYSTEM.md, "Neutral by default, accent by override".
const cases = [
  ['checkbox', Checkbox, { label: 'Label', defaultChecked: true }],
  ['radio', Radio, { label: 'Label', name: 'r', value: 'a', defaultChecked: true }],
  ['chip', Chip, { defaultSelected: true, children: 'Chip' }],
  ['alignment-picker', AlignmentPicker, { label: 'Alignment' }],
  ['calendar', Calendar, { today: '2026-09-26', defaultValue: '2026-09-15' }],
];
const manifestKey = slug => slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

for (const [slug, Component, props] of cases) {
  test(`${slug} selection is neutral by default and accent on request`, () => {
    assert.deepEqual(MANIFESTS[manifestKey(slug)].variants.tone, ['neutral', 'accent']);
    assert.equal(MANIFESTS[manifestKey(slug)].defaults.tone, 'neutral');
    assert.match(renderToString(h(Component, props)), new RegExp(`area-${slug}--neutral`));
    assert.match(renderToString(h(Component, { ...props, tone: 'accent' })), new RegExp(`area-${slug}--accent`));
  });
}

test('only accent variants reference accent paint in these components', () => {
  const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8');
  for (const block of ['area-checkbox', 'area-radio', 'area-chip', 'area-alignment-picker', 'area-calendar']) {
    for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const [, selector, body] = rule;
      if (!selector.includes(`.${block}`) || !/--area-(accent|fg-accent|edge-accent|fg-on-accent|stroke-selected)\b/.test(body)) continue;
      assert.match(selector, new RegExp(`\\.${block}--accent|\\[data-tone="accent"\\]`), `${selector.trim()} paints accent outside the accent variant`);
    }
  }
});
