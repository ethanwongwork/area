import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

// Literal paint outside state rules (system status 2026-11-18, step C4; DESIGN_SYSTEM.md, "Colour"). A fill, ink, edge or
// shadow reads a role, a private term built on roles, or a shared recipe (Video player's media glass); a literal colour
// (rgb(), hsl(), a hex, oklch/oklab numbers, white or black) is allowed only where a measured value has no role, and then
// its line says why: `/* spec: <reason> */`. A bare `/* spec */` names no reason. State rules are state-paint.test.mjs's
// (plan B7.4), and forced-colours blocks paint system colours, so neither is read here. Mixing a role toward black or
// white (`color-mix(…, black 20%)`) is a derivation, not a literal. It reads the sources, so the reason is seen.
const SRC = new URL('../../styles/src/', import.meta.url);
const files = [...readdirSync(new URL('components/', SRC)).filter(f => f.endsWith('.css')).map(f => `components/${f}`),
  'layers.css', 'inset.css', 'base.css', 'selection.css', 'material.css'];

// The state rules state-paint.test.mjs reads (its STATE and STATE_PROP).
const STATE = /:hover|:active|\[data-selected\]|\[aria-selected="true"\]|\[aria-current|:checked|\[aria-pressed="true"\]|\[data-highlighted\]|\[data-resizing\]|\[aria-checked="true"\]|\[data-pressed\]/;
const STATE_PROP = /^--_[\w-]*(hover|active|pressed|selected|checked|current)[\w-]*$/;
const PAINT = /^(background(-color|-image)?|background|box-shadow|text-shadow|filter|border(-[a-z-]+)?(-color)?|outline(-color)?|color|fill|stroke|caret-color|accent-color|text-decoration(-color)?|column-rule(-color)?|--[\w-]+)$/;
const LITERAL = /#[0-9a-f]{3,8}\b|\brgba?\(\s*[\d.]|\bhsla?\(\s*[\d.]|\boklch\(\s*[\d.]+%?\s|\boklab\(\s*[\d.]|\b(white|black)\b/i;

/** Blank every block opened by `head` (an at-rule's prelude), keeping its lines. */
function blankBlocks(text, head) {
  let out = text;
  for (const m of text.matchAll(head)) {
    let depth = 0, end = m.index;
    for (let i = m.index; i < text.length; i++) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}' && --depth === 0) { end = i + 1; break; }
    }
    out = out.slice(0, m.index) + out.slice(m.index, end).replace(/[^\n]/g, ' ') + out.slice(end);
  }
  return out;
}

/** Every unexplained literal colour outside state rules, as `line: selector { prop: value }`. */
export function literalPaint(text) {
  const reasoned = new Set();
  const plain = blankBlocks(text.replace(/\/\*[\s\S]*?\*\//g, (c, at) => {
    if (/\bspec:\s*\S/.test(c)) {
      const start = text.slice(0, at).split('\n').length;
      for (let n = start; n < start + c.split('\n').length; n++) reasoned.add(n);
    }
    return c.replace(/[^\n]/g, ' ');
  }), /@media[^{]*forced-colors[^{]*\{/g);
  const hits = [];
  for (const m of plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = m[1].trim().replace(/\s+/g, ' ');
    if (STATE.test(selector) || /^@/.test(selector)) continue;
    let at = m.index + m[1].length + 1;
    for (const raw of m[2].split(/;(?![^(]*\))/)) {
      const colon = raw.indexOf(':');
      const prop = colon > 0 ? raw.slice(0, colon).trim() : '';
      const value = colon > 0 ? raw.slice(colon + 1).trim() : '';
      if (prop && PAINT.test(prop) && !STATE_PROP.test(prop)) {
        const start = plain.slice(0, at + raw.search(/\S|$/)).split('\n').length;
        const end = plain.slice(0, at + raw.length).split('\n').length;
        let ok = false; for (let n = start; n <= end; n++) if (reasoned.has(n)) ok = true;
        // A data-URI picture is an icon (its own lint, step C1), not paint; a mix toward black or white is a derivation.
        const bare = value.replace(/url\(("[^"]*"|'[^']*'|[^)]*)\)/g, '').replace(/(#000(000)?|#fff(fff)?|\bblack\b|\bwhite\b)(?=\s+(calc\(|[\d.]+%))/gi, '');
        if (!ok && LITERAL.test(bare)) hits.push(`${start}: ${selector.slice(0, 80)} { ${prop}: ${value.slice(0, 70)} }`);
      }
      at += raw.length + 1;
    }
  }
  return hits;
}

// Unexplained literals still waiting on 2026-11-18 (a ratchet: a count may fall, never rise; a file that reaches 0
// leaves the list). Most are `/* spec */` marks that name no reason; each leaves by taking a role or a recipe, or by
// saying on its line why no role equals it.
const WAITING = {
  'components/slider.css': 1, // 479 the grip's shadow (the other step C worker's family: Slider's shadow onto depth)
  'components/tooltip.css': 1, // 46 the tooltip's inner rim, light-dark(…) /* spec */ with no reason
};

test('a literal colour outside state rules reads a role or a recipe, or says why on its line', () => {
  for (const file of Object.keys(WAITING)) assert.ok(files.includes(file), `WAITING names ${file}, which is not read`);
  for (const file of files) {
    const hits = literalPaint(readFileSync(new URL(file, SRC), 'utf8'));
    const allowed = WAITING[file] ?? 0;
    assert.ok(hits.length <= allowed, `${file} has ${hits.length} unexplained literal colours, ${allowed} allowed (read a role or recipe, or say why: /* spec: <reason> */):\n  ${hits.join('\n  ')}`);
    if (hits.length < allowed) assert.fail(`${file} is down to ${hits.length} unexplained literal colours: lower literal-paint.waiting.json to ${hits.length}`);
  }
});

test('the lint reads the forms it is meant to', () => {
  assert.equal(literalPaint('.a { box-shadow: 0 1px 2px rgb(0 0 0 / 0.1); }').length, 1);
  assert.equal(literalPaint('.a { background: #000; }').length, 1);
  assert.equal(literalPaint('.a { --_edge: rgb(255 255 255 / 0.12); }').length, 1);
  assert.equal(literalPaint('.a { color: light-dark(#111, #eee); /* spec */ }').length, 1, 'a bare spec mark names no reason');
  assert.equal(literalPaint('.a { color: light-dark(#111, #eee); /* spec: no role is this dark */ }').length, 0);
  assert.equal(literalPaint('.a:hover { background: rgb(0 0 0 / 0.1); }').length, 0, 'state rules are state-paint.test.mjs\'s');
  assert.equal(literalPaint('.a { --_bg-hover: rgb(0 0 0 / 0.1); }').length, 0, 'a state property is state-paint.test.mjs\'s');
  assert.equal(literalPaint('.a { background: color-mix(in oklab, var(--area-bg-surface), black 20%); }').length, 0, 'a mix toward black is a derivation');
  assert.equal(literalPaint('.a { background: var(--area-bg-surface); }').length, 0);
  assert.equal(literalPaint('@media (forced-colors: active) { .a { background: Canvas; color: #000; } }').length, 0);
  assert.equal(literalPaint('.a { inline-size: 12px; }').length, 0);
  assert.equal(literalPaint(`.a { --_icon: url("data:image/svg+xml,%3Csvg fill='black'%3E"); }`).length, 0, 'a data-URI icon is not paint');
});
