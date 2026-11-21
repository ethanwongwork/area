import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Opacity is a role (system status 2026-11-18, step C4; DESIGN_SYSTEM.md, "Pending is not disabled either"). A partial
// opacity outside keyframes reads a role (`opacity-disabled`, `opacity-pending`) or a private term built on one; 0 and 1
// are a fade's ends. A different meaning may keep its measured value only with its reason on its line, a comment
// `/* spec: <reason> */` (Property list's dragged row, 0.4). Keyframes are motion steps and are not read.
const SRC = new URL('../../styles/src/', import.meta.url);
const files = [...readdirSync(new URL('components/', SRC)).filter(f => f.endsWith('.css')).map(f => `components/${f}`),
  'layers.css', 'inset.css', 'base.css', 'selection.css', 'material.css', 'forced-colors.css'];

const PROP = /^(opacity|fill-opacity|stroke-opacity|flood-opacity|stop-opacity|--_[\w-]*opacity[\w-]*)$/;
// A literal partial opacity: a number strictly between 0 and 1, or a percentage strictly between 0 and 100.
const PARTIAL = /(?<![\w.-])(0?\.\d*[1-9]\d*|[1-9]\d?(\.\d+)?%|0\.\d+%)(?![\w.])/;

/** Blank every @keyframes block (keeping its lines), so its steps are not read. */
function withoutKeyframes(text) {
  let out = text;
  for (const m of text.matchAll(/@keyframes[^{]*\{/g)) {
    let depth = 0, end = m.index;
    for (let i = m.index; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}' && --depth === 0) { end = i + 1; break; }
    }
    out = out.slice(0, m.index) + out.slice(m.index, end).replace(/[^\n]/g, ' ') + out.slice(end);
  }
  return out;
}

/** Every literal partial opacity in a sheet, as `line: prop: value`. */
export function literalOpacities(source) {
  const reasoned = new Set();
  for (const m of source.matchAll(/\/\*[\s\S]*?\*\//g)) {
    if (!/\bspec:\s*\S/.test(m[0])) continue;
    const start = source.slice(0, m.index).split('\n').length;
    for (let n = start; n < start + m[0].split('\n').length; n++) reasoned.add(n);
  }
  const lines = withoutKeyframes(source.replace(/\/\*[\s\S]*?\*\//g, c => c.replace(/[^\n]/g, ' '))).split('\n');
  const hits = [];
  lines.forEach((text, i) => {
    for (const [, prop, value] of text.matchAll(/([\w-]+)\s*:\s*([^;{}]+)/g)) {
      if (!PROP.test(prop) || reasoned.has(i + 1)) continue;
      if (PARTIAL.test(value.replace(/var\([^)]*\)/g, ''))) hits.push(`${i + 1}: ${prop}: ${value.trim()}`);
    }
  });
  return hits;
}

// Literal opacities still waiting on 2026-11-18 (a ratchet: a count may fall, never rise; a file that reaches 0 leaves
// the list).
const WAITING = {
  'components/calendar.css': 1, // 211 a range day's Highlight wash at 0.3 under forced colours: Calendar's spec
};

test('a partial opacity outside keyframes reads a role, or says why it is its own', () => {
  for (const file of Object.keys(WAITING)) assert.ok(files.includes(file), `WAITING names ${file}, which is not read`);
  for (const file of files) {
    const hits = literalOpacities(readFileSync(new URL(file, SRC), 'utf8'));
    const allowed = WAITING[file] ?? 0;
    assert.ok(hits.length <= allowed, `${file} has ${hits.length} literal opacities, ${allowed} allowed (read opacity-disabled or opacity-pending, or give the reason on the line):\n  ${hits.join('\n  ')}`);
    if (hits.length < allowed) assert.fail(`${file} is down to ${hits.length} literal opacities: lower WAITING to ${hits.length}`);
  }
});

test('the lint reads the forms it is meant to', () => {
  assert.deepEqual(literalOpacities('.a { opacity: 0.6; }'), ['1: opacity: 0.6']);
  assert.deepEqual(literalOpacities('.a { opacity: .4; }'), ['1: opacity: .4']);
  assert.deepEqual(literalOpacities('.a { opacity: 60%; }'), ['1: opacity: 60%']);
  assert.deepEqual(literalOpacities('.a { --_sending-opacity: 0.6; }'), ['1: --_sending-opacity: 0.6']);
  assert.deepEqual(literalOpacities('.a { opacity: 0; } .b { opacity: 1; } .c { opacity: 100%; }'), []);
  assert.deepEqual(literalOpacities('.a { opacity: var(--area-opacity-pending); }'), []);
  assert.deepEqual(literalOpacities('.a { opacity: 0.4; /* spec */ }'), ['1: opacity: 0.4'], 'a bare spec mark names no reason');
  assert.deepEqual(literalOpacities('.a { opacity: 0.4; /* spec: the dragged row */ }'), []);
  assert.deepEqual(literalOpacities('@keyframes p { 50% { opacity: 0.3; } }\n.a { color: red; }'), []);
  assert.deepEqual(literalOpacities('/* opacity: 0.5 in a comment */ .a { color: red; }'), []);
});
