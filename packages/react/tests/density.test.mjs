import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { derivedTokens } from '../../tokens/src/emit/base.ts';
import { typeSizeTokens, TYPE_SIZES } from '../../tokens/src/axes/type-size.ts';
import { DENSITY_LEVELS } from '../../tokens/src/axes/density.ts';

// Space follows density (plan B8.2, 2026-11-14; DESIGN_SYSTEM.md, "Size and shape", "Space between pieces reads a
// density role"). The space between two pieces of UI (a gap, a padding, a margin, or a private property named for one)
// reads a density role (`ui-stack`, `ui-cluster`, `gap-row`, `gap-section`, `inset-surface-*`, `inset-page`, the height
// ladder) or a term built on one, never a fixed step beside peers that move. A fixed value is allowed for a mark, a hit
// area, a platform constant or a measured media size, and says so on its line: a comment that reads "at every density".
// Gaps of 2 and 4 are joins (a joined set, a line's actions, a text pair), fixed by rule at every density, so the lint
// reads 6 and up. It reads the sources, so the comment that exempts a value is seen.
const DIR = new URL('../../styles/src/components/', import.meta.url);
const SPACE = /^(gap|row-gap|column-gap|padding(-[a-z-]+)?|margin(-[a-z-]+)?|--_[\w-]*(gap|pad|padding|spacing|space|inset)[\w-]*)$/;
// A value that reads a role that moves with type or density, a private term, or a font-relative unit follows them.
const FOLLOWS = /var\(--(area-(ui-|gap-|inset-|control-|text-|type-|icon-|mark-|title-|radius|border|stroke|focus|table-|asset-|menu-)|_)|\d(em|lh|cap|ch|rem|%|vw|vh|cqi)\b|\b(1lh|1cap|1em)\b/;
// A fixed space: a spacing step of 6 or more, or a literal of 6px or more.
const FIXED = /var\(--area-space-([6-9]|[1-9]\d+)\)|(?<![\w.-])([6-9]|[1-9]\d+)(\.\d+)?px/;

/** Every fixed space in a stylesheet, as `line: property: value`, with block comments blanked but their lines kept. */
export function fixedSpaces(source) {
  const marked = new Set();
  // A comment that says "at every density" exempts the declarations on the lines it touches.
  for (const match of source.matchAll(/\/\*[\s\S]*?\*\//g)) {
    if (!/at every density/.test(match[0])) continue;
    const start = source.slice(0, match.index).split('\n').length;
    const end = start + match[0].split('\n').length - 1;
    for (let n = start; n <= end; n++) marked.add(n);
  }
  const blank = source.replace(/\/\*[\s\S]*?\*\//g, comment => comment.replace(/[^\n]/g, ' ')).split('\n');
  const hits = [];
  for (let line = 0; line < blank.length; line++) {
    for (const [, prop, value] of blank[line].matchAll(/([\w-]+)\s*:\s*([^;{}]+)(?:;|$)/g)) {
      if (!SPACE.test(prop) || !FIXED.test(value) || FOLLOWS.test(value)) continue;
      if (marked.has(line + 1)) continue;
      hits.push(`${line + 1}: ${prop}: ${value.trim()}`);
    }
  }
  return hits;
}

// The families the rule was applied to (plan B8.2, B8.1): no fixed space at all.
const CLEAN = ['asset-row', 'board', 'setting-row', 'page-header', 'stepper', 'timeline', 'tabs', 'otp-field', 'alert',
  'menu', 'empty-state', 'drawer', 'toast', 'table', 'shortcut-list', 'segmented', 'toggle-group',
  // The leftovers pass (2026-11-14): each hit took its peers' role or says why it holds at every density.
  'accordion', 'asset-card', 'avatar', 'calendar', 'card', 'chart', 'choice', 'code-block', 'combobox', 'command-palette',
  'design-card', 'editable-text', 'file-tile', 'file-upload', 'hatnote', 'inline-list', 'link-groups', 'meter', 'nav', 'plan',
  'popover', 'preview-frame', 'queue', 'reference-list', 'section-heading', 'separator', 'slider', 'surface',
  'table-of-contents', 'token-row', 'video-player',
  // The waiting list cleared (system status 2026-11-18, step C6): each holdout took the role that equals it at the
  // default, an icon-to-label gap of 6 the md control's gap-md, the Description list's justified 16 two ui-clusters,
  // the opacity field's "%" side 8 ui-cluster, Pagination's page side 6 gap-md.
  'attachment', 'color-picker', 'description-list', 'message', 'pagination', 'tag-picker', 'turn-notice'];
// Fixed spaces still waiting in other families on 2026-11-14 (a ratchet: a count may fall, never rise; a family that
// reaches 0 leaves the list). Each hit either moves to a role or, where it is a mark, a hit area, a platform constant or a
// measured media size, says "at every density" on its line.
// Empty since step C6 (2026-11-18): a family that gains a fixed space fails until it takes a role or says why.
const WAITING = {};

test('space between pieces of UI reads a density role, or says it holds at every density', () => {
  const report = [];
  for (const file of readdirSync(DIR).filter(name => name.endsWith('.css')).sort()) {
    const hits = fixedSpaces(readFileSync(new URL(file, DIR), 'utf8'));
    const family = file.replace(/\.css$/, '');
    if (CLEAN.includes(family)) { assert.deepEqual(hits, [], `${file} keeps a fixed space beside spaces that follow density`); continue; }
    const allowed = WAITING[file] ?? 0;
    assert.ok(hits.length <= allowed, `${file} has ${hits.length} fixed spaces, ${allowed} allowed:\n  ${hits.join('\n  ')}`);
    if (hits.length) report.push(`${file} ${hits.length}`);
    if (hits.length < allowed) console.log(`density lint: ${file} is down to ${hits.length}; lower WAITING`);
  }
  if (process.env.AREA_DENSITY_LINT) console.log(report.join('\n'));
});

test('the lint reads the forms it is meant to', () => {
  assert.deepEqual(fixedSpaces('.a { gap: var(--area-space-12); }'), ['1: gap: var(--area-space-12)']);
  assert.deepEqual(fixedSpaces('.a { padding: 8px 10px; }'), ['1: padding: 8px 10px']);
  assert.deepEqual(fixedSpaces('.a { --_slot-gap: var(--area-space-8); }'), ['1: --_slot-gap: var(--area-space-8)']);
  assert.deepEqual(fixedSpaces('.a { gap: var(--area-space-4); }'), [], 'a join of 4 is fixed by rule');
  assert.deepEqual(fixedSpaces('.a { gap: var(--area-ui-cluster); }'), []);
  assert.deepEqual(fixedSpaces('.a { gap: calc(var(--area-space-24) - var(--area-space-4) * var(--area-ui-gap-step)); }'), []);
  assert.deepEqual(fixedSpaces('.a { padding: var(--area-space-8); /* an overhang, at every density */ }'), []);
  assert.deepEqual(fixedSpaces('/* gap: 20px in a comment */\n.a { color: red; }'), []);
  assert.deepEqual(fixedSpaces('.a {\n  /* the hit area,\n     at every density */\n  --_pad: 12px;\n}'), ['4: --_pad: 12px'], 'a comment on other lines does not exempt it');
});

// The values B8.2 moved, resolved as the browser does (rows.test.mjs's resolver): whole pixels at every type and density,
// Default unchanged at type 13 (except Setting row, whose 16 became the surface inset, 14, as the plan states).
const derived = derivedTokens();
function resolver(base, density) {
  const leaves = {};
  for (const [k, v] of Object.entries(typeSizeTokens(base))) leaves[`--area-${k}`] = v;
  leaves['--area-density-level'] = String(DENSITY_LEVELS[density]);
  // The primitive scales are their own pixels (`--area-space-12: 12px`, `--area-leading-18: 18px`).
  const primitive = name => /^--area-(space|leading|size)-(\d+)$/.exec(name)?.[2];
  const lookup = name => { const value = leaves[name] ?? derived[name] ?? (primitive(name) && `${primitive(name)}px`); if (!value) throw new Error(`${name} is not defined`); return value; };
  const expand = value => value.replace(/var\((--area-[\w-]+)\)/g, (_, name) => `(${expand(lookup(name))})`);
  return expression => {
    const js = expand(expression).replace(/(\d*\.?\d+)px/g, '$1').replace(/round\((nearest|up|down),/g, (_, mode) => `R("${mode}",`)
      .replace(/\bcalc\(/g, '(').replace(/\b(max|min)\(/g, 'Math.$1(').replace(/\bclamp\(/g, 'C(');
    const R = (mode, x, step) => (mode === 'up' ? Math.ceil(x / step) : mode === 'down' ? Math.floor(x / step) : Math.round(x / step)) * step;
    const C = (lo, x, hi) => Math.min(Math.max(lo, x), hi);
    return Number(new Function('R', 'C', `return (${js});`)(R, C));
  };
}
const MOVED = {
  'asset row inset': ['var(--area-ui-cluster)', 8],
  'asset row gap': ['var(--area-gap-row)', 12],
  'asset row height (40 preview)': ['calc(40px + 2 * var(--area-ui-cluster))', 56],
  'board column inset, cards apart': ['var(--area-ui-cluster)', 8],
  'board card sides, add row sides': ['var(--area-inset-surface-sm)', 10],
  'board card block': ['calc(var(--area-inset-surface-sm) - 2px)', 8],
  'board column title start': ['calc(var(--area-ui-cluster) + var(--area-inset-surface-sm))', 18],
  'board columns apart': ['var(--area-gap-row)', 12],
  'setting row text to control': ['var(--area-inset-surface-md)', 14],
  'page header actions to title': ['calc(var(--area-ui-cluster) * 2)', 16],
  'stepper, timeline content gap': ['var(--area-gap-row)', 12],
  'stepper, timeline events apart': ['calc(var(--area-ui-cluster) * 2)', 16],
  'tabs lg gap': ['calc(24px - 4px * var(--area-ui-gap-step))', 24],
  'otp slots, alert icon and action gaps, page header parent, color picker "%" side': ['var(--area-ui-cluster)', 8],
  'menu two-line block': ['calc((var(--area-ui-row) - var(--area-ui-leading)) / 2)', 6],
  'empty state md media': ['calc(var(--area-ui-cluster) * 2)', 16],
  'empty state md actions': ['var(--area-gap-section)', 24],
  'empty state sm media and actions, table caption': ['var(--area-gap-row)', 12],
  'shortcut list groups': ['calc(32px - 8px * var(--area-ui-gap-step))', 32],
  'shortcut list name to keys': ['var(--area-gap-section)', 24],
  // The leftovers pass (2026-11-14).
  'accordion trigger gap, chart legend, inline list items, link groups rule, description list justified inset': ['calc(var(--area-ui-cluster) * 2)', 16],
  'row sides (nav, table of contents), held at every density': ['var(--area-ui-row-inset)', 8],
  'nav marker rows, table of contents title start': ['calc(var(--area-ui-row-inset) * 2)', 16],
  'video player clock side': ['calc((var(--area-control-md) - var(--area-space-6)) / 2)', 12],
  // Step C6 (2026-11-18).
  'icon-to-label gap of 6 (attachment, description list, message, tag picker, turn notice), pagination page side': ['var(--area-gap-md)', 6],
};

test('every moved space is whole at every type and density, and the default holds', () => {
  const table = {};
  for (const [name, [expression, atDefault]] of Object.entries(MOVED)) {
    const row = {};
    for (const base of TYPE_SIZES) for (const density of Object.keys(DENSITY_LEVELS)) {
      const value = resolver(base, density)(expression);
      assert.ok(Number.isInteger(value) && value >= 0, `${name} at type ${base} / ${density} is ${value}`);
      row[`${base}/${density}`] = value;
    }
    assert.equal(row['13/32'], atDefault, `${name} moved at the default`);
    // It follows density: Compact is never more than Default, Comfortable never less.
    for (const base of TYPE_SIZES) assert.ok(row[`${base}/28`] <= row[`${base}/32`] && row[`${base}/32`] <= row[`${base}/36`], `${name} at type ${base}`);
    table[name] = row;
  }
  if (process.env.AREA_DENSITY_TABLE) console.table(table);
});
