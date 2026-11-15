import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Twins share one recipe (plan B8.1, 2026-11-14; DESIGN_SYSTEM.md, "One track"; COMPONENTS.md, Boundaries). Segmented and
// soft Toggle group are one track drawn by one rule in segmented.css; neither restates a term of it, so the Stroke width
// setting, the Corner setting and the Pills set reach both alike. Reads the built stylesheet.
const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, ' '), body }));
const bodiesOf = test => rules.filter(rule => test(rule.selector)).map(rule => rule.body).join(';');

const RECIPE = ':where(.area-segmented, .area-toggle-group--soft)';
const TERMS = ['--_track-inset', '--_track-corner', '--_thumb', '--_thumb-corner', '--_thumb-bg', '--_thumb-edge', '--_thumb-shadow'];

test('one track: the recipe holds every term, and its edge is border-width with the Pills flag on the corner', () => {
  const recipe = bodiesOf(selector => selector === RECIPE);
  for (const term of TERMS) assert.match(recipe, new RegExp(`${term}:`), `the track recipe does not set ${term}`);
  assert.match(recipe, /outline:\s*var\(--area-border-width\) solid var\(--area-edge-buttons\)/, 'the track edge is an edge of a filled shape: border-width');
  assert.match(recipe, /--_track-corner:\s*max\([^;]*, var\(--area-pill-segmented\) \* var\(--area-radius-full\)\)/, 'the track reads the Pills set\'s Segmented flag, a pill as one value');
  assert.match(recipe, /--_thumb-corner:[^;]*var\(--area-radius-floor\)[^;]*calc\(var\(--_track-corner\) - var\(--_track-inset\)\)/, 'the thumb is concentric, floored');
  for (const prop of ['gap', 'block-size', 'padding', 'border-radius', 'background-color']) assert.match(recipe, new RegExp(`(^|;)\\s*${prop}:`), `the recipe does not draw ${prop}`);
});

test('neither twin restates the track: each sets only its inputs and reads the thumb', () => {
  const own = family => bodiesOf(selector => selector !== RECIPE && selector.split(',').some(part => part.trim() === family));
  for (const family of ['.area-segmented', '.area-toggle-group--soft']) {
    const body = own(family);
    assert.match(body, /--_track-height:/, `${family} does not set the track's height`);
    assert.match(body, /--_track-tier-corner:/, `${family} does not set the tier's corner`);
    for (const prop of ['outline', 'outline-offset', 'border-radius', 'padding', 'background-color', '--_track-radius', '--_track-inset']) {
      assert.doesNotMatch(body, new RegExp(`(^|;)\\s*${prop}:`), `${family} restates the track's ${prop}`);
    }
  }
  // The options read the thumb: Segmented's option and sliding plate, the soft toggle's Buttons.
  const options = bodiesOf(selector => !/data-area-material/.test(selector) && /\.area-segmented(\[data-plate\]::before|__item\[data-selected\])$|\.area-toggle-group--soft > \.area-button(\[data-selected\])?$/.test(selector));
  for (const term of ['--_thumb-bg', '--_thumb-edge', '--_thumb-shadow', '--_thumb-corner', '--_thumb']) assert.match(options, new RegExp(`var\\(${term}\\)`), `an option does not read ${term}`);
  assert.doesNotMatch(options, /light-dark\(var\(--area-bg-surface\)/, 'an option restates the thumb\'s paint');
  assert.doesNotMatch(bodiesOf(selector => selector !== RECIPE && /area-toggle-group/.test(selector)), /var\(--area-space-2\)/, 'Toggle group restates the track inset');
});

// A pill is one value (2026-11-14, the Citation hand-over; every family since the leftovers pass): a shape the Pills set
// rounds takes radius-full itself, `max(corner, flag × full)`, never full plus the corner it had (Citation computed
// 10003px, Button and Chip 10007px). A corner derived from a pill (a Chip's swatch, a Switch's thumb, a track's thumb)
// lists the flag × full again, so it is radius-full too, not full less its inset.
test('a pill is one value: no corner adds the Pills flag × full to another corner', () => {
  const offenders = new Set();
  const flag = String.raw`var\(--(?:area-pill-[\w-]+|_[\w-]*pill[\w-]*)\)`;
  const full = String.raw`var\(--area-radius-full\)`;
  const added = new RegExp(String.raw`\+\s*(?:${flag}\s*\*\s*${full}|${full}\s*\*\s*${flag})`);
  for (const { selector, body } of rules) {
    for (const [, prop, value] of body.matchAll(/(?:^|[;\s])([\w-]*radius[\w-]*|--_[\w-]*corner[\w-]*|--_shape)\s*:\s*([^;]+)/g)) {
      if (added.test(value)) offenders.add(`${selector} ${prop}`);
    }
  }
  assert.deepEqual([...offenders], [], 'a pill corner adds a term to radius-full');
});
