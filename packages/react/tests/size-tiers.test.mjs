import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Size tiers follow type and density (docs/research/system-status-2026-11-18, step C2; DESIGN_SYSTEM.md, "Size tiers
// follow the settings"): a size modifier (`--xs`, `--sm`, `--md`, `--lg`) sets its height or size from a role that the
// settings move (control-*, icon-*, mark-*, text-*, a type or density derivation), never from a raw px, a space step or a
// size step, which hold at every setting. A value that is meant to hold (a line's thickness, a drawing's grid) says so on
// its line: "at every type", with the reason. These read the sources, so the marker comments are there to read.
const DIR = new URL('../../styles/src/components/', import.meta.url);
const FILES = readdirSync(DIR).filter(file => file.endsWith('.css')).sort();

/** Every declaration with its innermost selector, its line and the comments on that line. */
function declarations(css) {
  const out = [], comments = new Map(), stack = [];
  let i = 0, line = 1, buffer = '';
  const note = (at, text) => comments.set(at, (comments.get(at) ?? '') + text);
  while (i < css.length) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2) + 2, text = css.slice(i, end);
      text.split('\n').forEach((part, k) => note(line + k, part));
      line += text.split('\n').length - 1; i = end; continue;
    }
    if (ch === '"' || ch === "'") { const end = css.indexOf(ch, i + 1) + 1; buffer += css.slice(i, end); i = end; continue; }
    if (ch === '{') { stack.push(buffer.trim().replace(/\s+/g, ' ')); buffer = ''; i++; continue; }
    if (ch === ';' || ch === '}') {
      const text = buffer.trim(), colon = text.indexOf(':');
      if (text && stack.length && colon > 0) out.push({ selector: stack.at(-1), prop: text.slice(0, colon).trim(), value: text.slice(colon + 1).trim(), line });
      buffer = ''; if (ch === '}') stack.pop(); i++; continue;
    }
    if (ch === '\n') line++;
    buffer += ch; i++;
  }
  return out.map(d => ({ ...d, comment: comments.get(d.line) ?? '' }));
}

const SHEETS = Object.fromEntries(FILES.map(file => [file, declarations(readFileSync(new URL(file, DIR), 'utf8'))]));
const MODIFIER = /\.area-[a-z0-9-]+--(xs|sm|md|lg)(?![a-z0-9-])/;
// Heights and sizes: the box properties, and the private properties a tier sets them through.
const SIZE = /^(block-size|inline-size|height|width|min-block-size|min-inline-size|--_(?:[a-z0-9-]*-)?(size|height|h|thumb|box|icon|dot|grid|figure))$/;
const RAW = /^(-?\d*\.?\d+px|var\(--area-(space|size)-[\w.-]+\))$/;
const HOLDS = /at every type/;

/** A private property's own value, one step (`--_x: var(--_figure-sm)` reads `--_figure-sm`): the file's, else any. */
function resolve(file, value) {
  const name = value.match(/^var\((--_[\w-]+)\)$/)?.[1];
  if (!name) return null;
  return SHEETS[file].find(d => d.prop === name) ?? Object.values(SHEETS).flat().find(d => d.prop === name) ?? null;
}

function violations() {
  const found = new Map();
  for (const [file, decls] of Object.entries(SHEETS)) {
    for (const d of decls) {
      if (!MODIFIER.test(d.selector) || !SIZE.test(d.prop)) continue;
      const via = resolve(file, d.value);
      const raw = RAW.test(d.value) && !HOLDS.test(d.comment);
      const rawVia = via && RAW.test(via.value) && !HOLDS.test(via.comment) && !HOLDS.test(d.comment);
      if (raw || rawVia) found.set(`${file} ${d.selector} ${d.prop}`, rawVia ? `${d.value} = ${via.value}` : d.value);
    }
  }
  return found;
}

// The waiting list (a ratchet): size tiers that still hold at every setting with no reason given, by family, each to be
// put on a role or marked with its reason. A listed one may not be joined by another, and one that is fixed must be
// removed here. Families another session owns are named so it can strike its own as it lands them.
const WAITING = {
  // Avatar's glyph box (avatar.css): 16 / 20 / 24 at every type beside a box on the mark ladder; not in step C's list.
  avatar: [
    'avatar.css .area-avatar--sm --_icon',
    'avatar.css .area-avatar--md --_icon',
    'avatar.css .area-avatar--lg --_icon',
  ],
  // The file families, Chart, Dialog and Drawer (step C2 and C3, another session, 2026-11-21): the figure scale 48 / 64 /
  // 96 (its --_figure-* steps) still holds without its reason; Chart, Dialog and Drawer pass as their sheets stand.
  'file-image': [
    'file-image.css .area-file-image--sm --_size',
    'file-image.css .area-file-image--md --_size',
    'file-image.css .area-file-image--lg --_size',
  ],
  'file-page': [
    'file-page.css .area-file-page--sm --_size',
    'file-page.css .area-file-page--md --_size',
    'file-page.css .area-file-page--lg --_size',
  ],
  'file-tile': [
    'file-tile.css .area-file-tile--sm --_figure',
    'file-tile.css .area-file-tile--md --_figure',
    'file-tile.css .area-file-tile--lg --_figure',
  ],
  'folder': [
    'folder.css .area-folder--sm --_size',
    'folder.css .area-folder--md --_size',
    'folder.css .area-folder--lg --_size',
  ],
  chart: [], dialog: [], drawer: [],
};

test('a size modifier sets its height or size from a role, or says why it holds at every type', () => {
  const waiting = new Set(Object.values(WAITING).flat());
  const found = violations();
  const fresh = [...found].filter(([key]) => !waiting.has(key)).map(([key, value]) => `${key}: ${value}`);
  assert.deepEqual(fresh, [], 'put the tier on a control, icon, mark or text role, or mark the line "at every type" with its reason');
  const fixed = [...waiting].filter(key => !found.has(key));
  assert.deepEqual(fixed, [], 'these pass now: remove them from WAITING');
});

test('the step C families follow the settings: Spinner, Slider, Switch, Presence and Progress', () => {
  const value = (file, selector, prop) => SHEETS[file].find(d => d.selector === selector && d.prop === prop);
  // Spinner: the icon slots (12 / 16 / 24 at type 13).
  assert.equal(value('spinner.css', '.area-spinner--sm', '--_size').value, 'var(--area-icon-xs)');
  assert.equal(value('spinner.css', '.area-spinner--md', '--_size').value, 'var(--area-icon-md)');
  assert.equal(value('spinner.css', '.area-spinner--lg', '--_size').value, 'calc(var(--area-icon-lg) + var(--area-space-8))');
  // Slider and SliderRange: the thumb is the icon slot (16 / 16 / 20 at type 13), as Switch's follows its track.
  assert.equal(value('slider.css', '.area-slider--sm', '--_thumb').value, 'var(--area-icon-sm)');
  assert.equal(value('slider.css', '.area-slider--md', '--_thumb').value, 'var(--area-icon-md)');
  assert.equal(value('slider.css', '.area-slider--lg', '--_thumb').value, 'calc(var(--area-icon-lg) + var(--area-space-4))');
  assert.equal(value('slider.css', '.area-slider-range--lg', '--_range-thumb').value, 'calc(var(--area-icon-lg) + var(--area-space-4))');
  // Switch: the thumb's travel keeps the md track's proportion, 12 at type 13.
  assert.equal(value('switch.css', '.area-switch', '--_travel').value, 'round(nearest, calc(var(--area-mark-toggle) * 2 / 3), 1px)');
  // Presence sm and Progress hold, each with its reason on the line.
  assert.match(value('presence.css', '.area-presence--sm', '--_size').comment, HOLDS);
  for (const size of ['sm', 'md', 'lg']) assert.match(value('progress.css', `.area-progress--${size}`, '--_progress-size').comment, HOLDS);
});

test('the lint reads what it should: a raw tier fails, a role or a marked line passes, one step of indirection is read', () => {
  const probe = css => { const d = declarations(css); return d.filter(x => MODIFIER.test(x.selector) && SIZE.test(x.prop) && RAW.test(x.value) && !HOLDS.test(x.comment)).length; };
  assert.equal(probe('.area-x--sm { --_size: 12px; }'), 1);
  assert.equal(probe('.area-x--sm { --_size: var(--area-space-12); }'), 1);
  assert.equal(probe('.area-x--sm { --_size: var(--area-icon-xs); }'), 0);
  assert.equal(probe('.area-x--sm { --_size: 12px; /* spec, at every type: a line */ }'), 0);
  assert.equal(probe('.area-x { --_size: 12px; }'), 0);
  assert.equal(probe('@container style(--a: 1) { .area-x--lg { block-size: 24px; } }'), 1);
});
