import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Local stacking (system status 2026-11-18, step C7; DESIGN_SYSTEM.md, "Local stacking"). A z-index in a component is
// 0, 1 or -1 (a part over or under its neighbours; `auto` leaves the context), a named local layer (`--_layer-<name>`,
// declared on the family's root with its order in a comment) or a `z-*` role for product chrome. A bare 2, 3 or -2 is a
// level nobody named. It reads the sources with comments blanked, so a z-index quoted in a comment is not counted.
const SRC = new URL('../../styles/src/', import.meta.url);
const files = [...readdirSync(new URL('components/', SRC)).filter(f => f.endsWith('.css')).map(f => `components/${f}`),
  'layers.css', 'inset.css', 'base.css', 'selection.css', 'material.css', 'forced-colors.css'];

const ALLOWED = /^(auto|0|1|-1|var\(--_layer-[\w-]+\)|var\(--area-z-[\w-]+\)|calc\(var\(--area-z-[\w-]+\)\s*[+-]\s*1\))$/;

/** Every z-index outside the allowed forms, as `line: value`. */
export function bareLevels(source) {
  const lines = source.replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ' ')).split('\n');
  const hits = [];
  lines.forEach((text, i) => {
    for (const [, value] of text.matchAll(/(?<![\w-])z-index\s*:\s*([^;{}]+)/g)) {
      const v = value.trim().replace(/\s*!important$/, '');
      if (!ALLOWED.test(v)) hits.push(`${i + 1}: z-index: ${v}`);
    }
  });
  return hits;
}

/** Every local layer a sheet declares, with its value: each must be a whole number. */
function layers(source) {
  const plain = source.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...plain.matchAll(/(--_layer-[\w-]+)\s*:\s*([^;{}]+)/g)].map(([, name, value]) => [name, value.trim()]);
}

// Bare levels still waiting on 2026-11-18 (a ratchet: a count may fall, never rise; a file that reaches 0 leaves the
// list). Slider, Switch: the other step C worker's families. The rest were not in step C's scope.
const WAITING = {
  'components/slider.css': 4, // 97 the thumb 4, 149 the fill 2, 177 the marks 3, 617 a range's second slider 2
  'components/switch.css': 1, // 71 the thumb 2
  'components/composer-menu.css': 1, // 18 the menu over the composer 2
  'components/otp-field.css': 1, // 81 the focused slot 2
  'components/nav.css': 1, // 172 the marker 2
  'material.css': 1, // 177 the wells over the slider rail 3
};

test('a z-index in a component is 0, 1, -1, a named local layer or a z role', () => {
  for (const file of Object.keys(WAITING)) assert.ok(files.includes(file), `WAITING names ${file}, which is not read`);
  for (const file of files) {
    const hits = bareLevels(readFileSync(new URL(file, SRC), 'utf8'));
    const allowed = WAITING[file] ?? 0;
    assert.ok(hits.length <= allowed, `${file} has ${hits.length} bare z-index levels, ${allowed} allowed (name the layer, DESIGN_SYSTEM.md "Local stacking"):\n  ${hits.join('\n  ')}`);
    if (hits.length < allowed) assert.fail(`${file} is down to ${hits.length} bare levels: lower WAITING to ${hits.length}`);
  }
});

test('every local layer is a whole number named for what sits there', () => {
  for (const file of files) {
    for (const [name, value] of layers(readFileSync(new URL(file, SRC), 'utf8'))) {
      assert.match(value, /^-?\d+$/, `${file}: ${name} is ${value}; a layer is a whole number`);
      assert.ok(!/^--_layer-\d/.test(name), `${file}: ${name} names a number, not what sits there`);
    }
  }
});

test('the lint reads the forms it is meant to', () => {
  assert.deepEqual(bareLevels('.a { z-index: 2; }'), ['1: z-index: 2']);
  assert.deepEqual(bareLevels('.a { z-index: -2; }'), ['1: z-index: -2']);
  assert.deepEqual(bareLevels('.a { z-index: 1; } .b { z-index: -1; } .c { z-index: 0; } .d { z-index: auto; }'), []);
  assert.deepEqual(bareLevels('.a { z-index: var(--_layer-header); }'), []);
  assert.deepEqual(bareLevels('.a { z-index: var(--area-z-toast); }'), []);
  assert.deepEqual(bareLevels('/* z-index: 10 in a comment */ .a { color: red; }'), []);
});
