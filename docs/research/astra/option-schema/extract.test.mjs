import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCSS, literals, resolveValue, canonical, selectorContexts, START_COMMIT } from './extract.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../..');
const load = name => JSON.parse(fs.readFileSync(path.join(here, name), 'utf8'));

test('scanner preserves every declaration through comments, functions, strings, nested rules and missing final semicolons', () => {
  const source = `@import "foo.css";\n@layer test {\n/* spec: size */\n.area-button {\n--_inset: calc(16px /* spec */ - var(--stroke));\ncolor: red; /* spec */\ncontent: "; } : 8px"; background: url("data:image/svg+xml;utf8,<svg>{}</svg>");\n@media (width > 4px) { &:hover { opacity: .5 } }\n}\n@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(1turn) } }\n}`;
  const parsed = parseCSS(source);
  assert.deepEqual(parsed.declarations.map(d => d.property), ['--_inset', 'color', 'content', 'background', 'opacity', 'transform', 'transform']);
  assert.equal(parsed.declarations[0].line, 5);
  assert.equal(parsed.declarations[0].specComments.length, 2);
  assert.equal(parsed.declarations[1].specComments.length, 2);
  assert.equal(parsed.declarations[4].selector, '.area-button &:hover');
  assert.deepEqual(parsed.declarations[4].atRules, ['@layer test', '@media (width > 4px)']);
  assert.deepEqual(parsed.ignoredStatements, ['@import "foo.css"']);
  assert.throws(() => parseCSS('.x { gap: 2px;'), /unbalanced/);
  assert.throws(() => parseCSS('.x { nonsense; }'), /unparsed/);
});

test('spec comment attachment does not treat prose as an explicit marker or leak a suffix to the next declaration', () => {
  const p = parseCSS('/* Measured from the spec file. */ .x { a: 1px; /* spec */ b: 2px;\n/* spec: next */ c: var(--x); }');
  assert.deepEqual(p.declarations.map(d => d.specComments.length), [1, 0, 1]);
  assert.equal(p.declarations[0].specComments[0].association, 'trailing-declaration');
  assert.equal(p.declarations[2].specComments[0].association, 'leading-declaration');
});

test('literal scanner excludes identifier digits, strings and URLs, but includes fallbacks, signs, percentages, durations and color atoms', () => {
  const value = 'calc(var(--area-space-20, -2px) / 2) "ss11" url(icon-20.svg) .5 50% 1e2ms #fff rgb(0 0 0 / .2)';
  const found = literals(value);
  assert.deepEqual(found.map(a => [a.value, a.kind]), [['-2px', 'length'], ['2', 'number'], ['.5', 'number'], ['50%', 'percentage'], ['1e2ms', 'duration'], ['#fff', 'color'], ['rgb(0 0 0 / .2)', 'color']]);
  for (const a of found) assert.equal(value.slice(a.offset, a.offset + a.value.length), a.value);
  assert.deepEqual(literals('150ms cubic-bezier(.1, 1, .2, 1) ease-out', 'transition').map(a => a.kind), ['duration', 'easing', 'easing']);
  assert.deepEqual(literals('light-dark(#fff, #000)').map(a => a.context), [['light-dark'], ['light-dark']]);
});

test('selector classification distinguishes modifiers, states, negation and relational contexts', () => {
  const manifests = { button: { block: 'area-button', sourceLine: 1, variants: { size: ['sm'], tone: ['accent'], variant: ['soft'] }, states: ['disabled'], booleans: [] } };
  const [s] = selectorContexts('.area-button--sm.area-button--accent:hover:not(:disabled):has(.area-button--soft)', manifests);
  assert.ok(s.features.some(f => f.kind === 'size' && f.value === 'sm'));
  assert.ok(s.features.some(f => f.kind === 'tone' && f.value === 'accent'));
  assert.ok(s.features.some(f => f.kind === 'state' && f.name === 'hover' && !f.negated));
  assert.ok(s.features.some(f => f.name === 'disabled' && f.negated && f.manifestMatches[0].key === 'button'));
  assert.ok(s.features.some(f => f.value === 'soft' && f.functions.includes('has')));
  assert.equal(selectorContexts(':is(.area-button, .area-button--sm), .area-button--soft', manifests).length, 2);
  const extended = { ...manifests, input: { block: 'area-input', sourceLine: 2, variants: {}, states: ['disabled'] } };
  const state = selectorContexts('.area-input .area-button:disabled', extended)[0].features.find(f => f.kind === 'state');
  assert.deepEqual(state.manifestMatches.map(m => m.key), ['button']);
  assert.equal(selectorContexts('.area-button input:disabled', extended)[0].features[0].ownerClass, null);
});

test('token aliases, fallbacks, light arms and dimension-aware math resolve without inventing a root font size', () => {
  const map = { '--space': '6px', '--twice': 'calc(var(--space) * 2)', '--cycle': 'var(--cycle)' };
  assert.equal(resolveValue('var(--twice)', map).value, '12px');
  assert.equal(resolveValue('var(--missing, calc(2px + 4px))', map).value, '6px');
  assert.equal(resolveValue('light-dark(#fff, #000)', map).value, '#fff');
  assert.equal(resolveValue('min(12px, max(0px, calc(20px - 12px)))', map).value, '8px');
  assert.equal(resolveValue('round(nearest, 5.6px, 1px)', map).value, '6px');
  assert.equal(resolveValue('calc(1s / 2)', map).value, '500ms');
  assert.ok(resolveValue('calc(1rem + 2px)', map).unresolved.length);
  assert.ok(resolveValue('var(--cycle)', map).unresolved.length);
  assert.equal(canonical('#fff'), canonical('rgb(255 255 255)'));
  assert.equal(canonical('0.1s'), canonical('100ms'));
  assert.notEqual(canonical('1rem'), canonical('16px'));
  assert.notEqual(canonical('rgb(0 0 0 / .1)'), canonical('#0000001a'));
  assert.equal(canonical(resolveValue('color-mix(in srgb, #fff, #000 0%)', map).value), canonical('#fff'));
  assert.equal(canonical(resolveValue('color-mix(in oklab, #000 15%, transparent)', map).value), canonical('rgb(0 0 0 / .15)'));
});

test('every baseline CSS file appears once, and independent source offsets and declaration count agree', () => {
  const l = load('literals.json');
  function files(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith('.css') ? [path.relative(root, path.join(dir, e.name))] : []); }
  assert.deepEqual(l.coverage.map(f => f.file).sort(), files(path.join(root, 'packages/styles/src')).sort());
  assert.equal(l.sourceCommit, START_COMMIT);
  let independentlyCounted = 0;
  for (const f of l.coverage) {
    const source = fs.readFileSync(path.join(root, f.file), 'utf8');
    // Independent count uses declaration heads at statement boundaries, masking comments,
    // quoted strings and URL bodies. This has no dependency on the extractor's rule scanner.
    const masked = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '""').replace(/url\([^)]*\)/gi, 'url()');
    const n = [...masked.matchAll(/(?:^|[{};])\s*[\w-]+\s*:/g)].length;
    assert.equal(f.declarations, n, f.file);
    independentlyCounted += n;
    assert.equal(f.rows, l.rows.filter(r => r.file === f.file).length);
  }
  assert.equal(l.summary.declarations, independentlyCounted);
  assert.equal(new Set(l.rows.map(r => r.id)).size, l.rows.length);
  for (const r of l.rows) {
    const sourceLine = fs.readFileSync(path.join(root, r.file), 'utf8').split('\n')[r.line - 1];
    assert.ok(sourceLine.slice(r.column - 1).startsWith(r.property + ':'), r.id);
    for (const a of r.literals) assert.equal(r.value.slice(a.offset, a.offset + a.value.length), a.value, r.id);
  }
});

test('all explicit spec comments and independent numeric/color declarations are represented', () => {
  const l = load('literals.json');
  for (const f of l.coverage) {
    const text = fs.readFileSync(path.join(root, f.file), 'utf8');
    for (const m of text.matchAll(/\/\*\s*(?:\*\s*)?spec\b[\s\S]*?\*\//gi)) {
      const line = text.slice(0, m.index).split('\n').length;
      assert.ok(l.rows.some(r => r.file === f.file && r.specComments.some(c => c.line === line)) || l.unattachedSpecComments.some(c => c.file === f.file && c.line === line), `${f.file}:${line}`);
    }
    // Independent lexeme check over parsed declarations catches numeric omissions;
    // mask strings, variable names, URL-like functions, and then inspect numeric tokens.
    for (const d of parseCSS(text, f.file).declarations) {
      const stripped = d.value.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g, '').replace(/(?:url|local|format)\([^)]*\)/gi, '').replace(/--[\w-]+/g, '').replace(/\b[a-zA-Z_][\w-]*\b/g, '');
      if (/\d|#[a-f\d]{3,8}\b/i.test(stripped)) assert.ok(l.rows.some(r => r.file === f.file && r.line === d.line && r.column === d.column), `${f.file}:${d.line}:${d.column}`);
    }
  }
});

test('README category/component/file numbers match independent JSON recounts; clusters cover exactly the rows and occurrences', () => {
  const l = load('literals.json'), c = load('clusters.json'), md = fs.readFileSync(path.join(here, 'README.md'), 'utf8');
  assert.equal(l.summary.rows, l.rows.length);
  const category = {}, component = Object.fromEntries(Object.values(l.manifests).map(m => [m.block.slice(5), 0]));
  for (const r of l.rows) { category[r.category] = (category[r.category] ?? 0) + 1; for (const key of r.components) component[key] = (component[key] ?? 0) + 1; }
  assert.deepEqual(l.summary.byCategory, category);
  assert.deepEqual(l.summary.byComponent, component);
  for (const [key, n] of Object.entries({ ...category, ...component })) assert.ok(md.includes(`| ${key} | ${n} |`), key);
  assert.ok(md.includes(`**${l.rows.length} declaration rows**`));
  const n = l.rows.reduce((sum, r) => sum + r.literals.length, 0);
  assert.equal(l.summary.literalOccurrences, n);
  assert.ok(md.includes(`**${n} literal occurrences**`));
  assert.deepEqual(c.valueGroups.flatMap(g => g.rowIds).sort(), l.rows.map(r => r.id).sort());
  assert.equal(c.literalGroups.reduce((sum, g) => sum + g.occurrenceCount, 0), n);
  const rowMap = new Map(l.rows.map(r => [r.id, r]));
  for (const g of c.valueGroups) {
    assert.equal(g.rowCount, g.rowIds.length);
    assert.deepEqual(g.components, [...new Set(g.rowIds.flatMap(id => rowMap.get(id).components))].sort());
  }
  for (const g of c.foundationParameters) {
    assert.deepEqual(g.currentValues, [...new Set(g.rowIds.map(id => rowMap.get(id).value))].sort().slice(0, 8));
    assert.ok(g.rowIds.every(id => rowMap.get(id).category === g.category));
  }
  for (const g of c.inconsistencyCandidates) assert.ok(g.rowIds.every(id => rowMap.has(id)));
});

test('generated token environments resolve completely and capture compact differences', () => {
  const l = load('literals.json');
  assert.equal(l.environments.defaultLight.axes.ui, 'default');
  assert.equal(l.environments.compactLight.axes.ui, 'compact');
  for (const e of Object.values(l.environments)) assert.equal(e.unresolvedTokens.length, 0);
  const buttonGap = l.rows.find(r => r.file.endsWith('/button.css') && r.property === '--_gap' && r.selector === '.area-button');
  assert.ok(buttonGap.tokenMatches.defaultLight.tokens.includes('--area-space-6'));
  const expected = JSON.parse(fs.readFileSync(path.join(root, 'packages/tokens/dist/tokens.json')));
  for (const ui of expected.axes.find(a => a.id === 'ui').presets) {
    const name = ui.id === 'compact' ? 'compactLight' : 'defaultLight';
    for (const [key, value] of Object.entries(ui.tokens)) assert.equal(l.environments[name].tokens[key].authoredValue, value, key);
  }
  const md = fs.readFileSync(path.join(here, 'README.md'), 'utf8');
  for (const [name, field] of [['defaultLight', 'tokenMatchedDefault'], ['compactLight', 'tokenMatchedCompact']]) {
    assert.equal(l.summary[field], l.rows.filter(r => r.tokenMatches[name].tokens.length).length);
    for (const r of l.rows) for (const token of r.tokenMatches[name].tokens) assert.ok(l.environments[name].tokens[token], token);
  }
  assert.ok(md.includes(`${l.summary.tokenMatchedDefault} rows have a whole-value token match`));
});

test('keyframes have animation evidence, and token JSON pointers locate their exact authored values', () => {
  const l = load('literals.json');
  const data = JSON.parse(fs.readFileSync(path.join(root, 'packages/tokens/dist/tokens.json')));
  for (const env of Object.values(l.environments)) for (const token of Object.values(env.tokens)) {
    const found = token.jsonPointer.slice(1).split('/').reduce((value, part) => value[part], data);
    assert.equal(found, token.authoredValue);
  }
  for (const r of l.rows.filter(r => r.atRules.some(a => /keyframes/.test(a)))) {
    assert.ok(r.animationReferences.length, r.id);
    assert.ok(r.manifestEntries.length, r.id);
    assert.equal(r.manifestStatus, 'matched via animation reference');
  }
});


test('icon paint follows color consumption and Foundation proposals stay scalar and bounded', () => {
  const rows = load('literals.json').rows;
  const iconPaint = rows.filter(r => r.property === '--_alert-icon');
  assert.ok(iconPaint.length);
  for (const row of iconPaint) assert.equal(row.category, 'color');
  const proposals = load('clusters.json').foundationParameters;
  assert.ok(proposals.length <= 25);
  for (const p of proposals) {
    assert.ok(p.currentValues.length <= 8);
    for (const v of p.currentValues) {
      assert.match(v, /^(?:-?\d*\.?\d+(?:px|rem|em|ms|s)?|#[0-9a-f]{3,8})$/i);
      assert.doesNotMatch(v, /^0(?:px|rem|em|ms|s)?$/);
    }
  }
});
