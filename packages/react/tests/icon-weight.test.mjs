import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Drawn marks follow the icon weight (docs/research/system-status-2026-11-18, step C1; DESIGN_SYSTEM.md, "Drawn marks
// follow the icon weight"). Glyph's line is `--area-weight-icon` (base.css), set by the type axis, times the icon slot's
// line ratio (`--area-type-icon-line`) where a glyph fills the type's icon slot. A mark drawn as an SVG data-URI can't
// read a custom property, so its stroke is a literal: each such drawing is a private property restated under
// `@container style(--area-type-base: N)` for every other type step, its stroke its type-13 stroke times Glyph's change
// at that step, either at a fixed size (the weight's ratio, K) or in the icon slot (K times the slot's line ratio, KS).
// These read the sources and the built tokens (packages/tokens/dist/css/axes.css).
const DIR = new URL('../../styles/src/components/', import.meta.url);
const FILES = readdirSync(DIR).filter(file => file.endsWith('.css')).sort();
const axes = readFileSync(new URL('../../tokens/dist/css/axes.css', import.meta.url), 'utf8');
const DEFAULT_TYPE = 13;
const STEPS = [12, 14, 15, 16];

/** Every declaration with its at-rule and selector stack. */
function declarations(css) {
  const out = [], stack = [];
  let i = 0, buffer = '';
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  while (i < css.length) {
    const ch = css[i];
    if (ch === '"' || ch === "'") { const end = css.indexOf(ch, i + 1) + 1; buffer += css.slice(i, end); i = end; continue; }
    if (ch === '{') { stack.push(buffer.trim().replace(/\s+/g, ' ')); buffer = ''; i++; continue; }
    if (ch === ';' || ch === '}') {
      const text = buffer.trim(), colon = text.indexOf(':');
      if (text && stack.length && colon > 0) out.push({ stack: [...stack], selector: stack.at(-1), prop: text.slice(0, colon).trim(), value: text.slice(colon + 1).trim() });
      buffer = ''; if (ch === '}') stack.pop(); i++; continue;
    }
    buffer += ch; i++;
  }
  return out;
}

/** The type axis's preset block for a step: its icon weight (px) and icon-slot line ratio. */
function typeStep(n) {
  const block = axes.match(new RegExp(`\\[data-area-type="${n}"\\]\\s*\\{([^}]*)\\}`))?.[1];
  assert.ok(block, `type ${n} preset in axes.css`);
  return {
    weight: Number(block.match(/--area-weight-icon:\s*([\d.]+)px/)[1]),
    line: Number(block.match(/--area-type-icon-line:\s*([\d.]+)/)[1]),
  };
}
const TYPE = Object.fromEntries([DEFAULT_TYPE, ...STEPS].map(n => [n, typeStep(n)]));
const K = n => TYPE[n].weight / TYPE[DEFAULT_TYPE].weight;
const KS = n => K(n) * TYPE[n].line / TYPE[DEFAULT_TYPE].line;

const STROKED = /data:image\/svg\+xml.*?stroke-width='[\d.]+'/;
const strokes = value => [...value.matchAll(/stroke-width='([\d.]+)'/g)].map(m => Number(m[1]));
const shape = value => value.replace(/stroke-width='[\d.]+'/g, "stroke-width=''");
const stepOf = stack => Number(stack.map(s => s.match(/^@container style\(--area-type-base: (\d+)\)$/)?.[1]).find(Boolean) ?? NaN);

const ALL = FILES.flatMap(file => declarations(readFileSync(new URL(file, DIR), 'utf8')).filter(d => STROKED.test(d.value)).map(d => ({ ...d, file, step: stepOf(d.stack) })));

// Drawings that hold their stroke at every type, each with its reason. Listed ones must still exist.
const HOLDS = {
  // Checkbox's indeterminate dash: a 2px bar centred on whole pixels (choice.css, "The mark"); Glyph's change (1.85 to
  // 2.46 at types 12-16) rounds to 2 at every step, so the bar keeps its crisp edges.
  'choice.css --_dash': 'a whole-pixel bar the ladder rounds to 2 at every type',
};
// The waiting list (a ratchet): stroked data-URIs in other families that don't follow the weight yet. None today; one
// that is added may not be joined by another, and one that is fixed must be removed.
const WAITING = {};

test('no component draws a stroked data-URI icon whose line ignores the icon weight', () => {
  assert.ok(ALL.length >= 11, 'the scan finds the drawings');
  const held = new Set([...Object.keys(HOLDS), ...Object.keys(WAITING)]);
  const loose = ALL.filter(d => !d.prop.startsWith('--_') && !held.has(`${d.file} ${d.prop}`)).map(d => `${d.file} ${d.selector} ${d.prop}`);
  assert.deepEqual(loose, [], 'draw the mark through a private property, so the type steps can restate it');
  const bases = ALL.filter(d => d.prop.startsWith('--_') && Number.isNaN(d.step) && !held.has(`${d.file} ${d.prop}`));
  const missing = [];
  for (const base of bases) for (const n of STEPS) {
    if (!ALL.some(d => d.file === base.file && d.selector === base.selector && d.prop === base.prop && d.step === n)) missing.push(`${base.file} ${base.selector} ${base.prop} at type ${n}`);
  }
  assert.deepEqual(missing, [], 'restate the drawing under @container style(--area-type-base: N) at every other type step');
  for (const key of held) assert.ok(ALL.some(d => `${d.file} ${d.prop}` === key), `${key} is listed but no longer drawn: remove it`);
});

test("each restated drawing's line is its type-13 line times Glyph's change, one kind per drawing", () => {
  const ladder = ALL.filter(d => !Number.isNaN(d.step));
  assert.ok(ladder.length > 0);
  const kinds = new Map();
  for (const d of ladder) {
    const base = ALL.find(b => b.file === d.file && b.prop === d.prop && Number.isNaN(b.step) && shape(b.value) === shape(d.value));
    assert.ok(base, `${d.file} ${d.selector} ${d.prop} at type ${d.step} restates a drawing the sheet draws at type 13`);
    const got = strokes(d.value), want = strokes(base.value);
    const fits = f => got.every((w, k) => Math.abs(w - Number((want[k] * f(d.step)).toFixed(3))) < 0.0015);
    const kind = fits(KS) ? 'slot' : fits(K) ? 'fixed' : null;
    assert.ok(kind, `${d.file} ${d.selector} ${d.prop} at type ${d.step}: ${got} is not ${want} × ${K(d.step).toFixed(4)} (fixed) or × ${KS(d.step).toFixed(4)} (slot)`);
    // At types 12 and 14 the two kinds agree; where they differ, a selector keeps one kind.
    if (TYPE[d.step].line !== 1) {
      const key = `${d.file} ${d.selector} ${d.prop}`;
      assert.ok(!kinds.has(key) || kinds.get(key) === kind, `${key} mixes fixed and slot steps`);
      kinds.set(key, kind);
    }
  }
});

test('the ladder covers the families step C named: Select, Checkbox, Plan and Spinner', () => {
  const has = (file, prop) => ALL.some(d => d.file === file && d.prop === prop && d.step === 16);
  for (const prop of ['--_chevron', '--_checkmark', '--_chevron-fallback']) assert.ok(has('select.css', prop), `select ${prop}`);
  assert.ok(has('choice.css', '--_check'));
  for (const prop of ['--_plan-tick', '--_plan-cross']) assert.ok(has('plan.css', prop), `plan ${prop}`);
  for (const prop of ['--_ring', '--_arc']) assert.ok(has('spinner.css', prop), `spinner ${prop}`);
  // The determinate ring is an inline SVG: its line reads the weight itself (2 at type 13: 1.045 × 1.913876).
  const spinner = readFileSync(new URL('spinner.css', DIR), 'utf8');
  assert.match(spinner, /stroke-width: calc\(var\(--area-weight-icon\) \* 1\.913876 \* var\(--_spinner-line, var\(--area-type-icon-line, 1\)\)\)/);
  assert.ok(Math.abs(TYPE[DEFAULT_TYPE].weight * 1.913876 - 2) < 1e-5);
});
