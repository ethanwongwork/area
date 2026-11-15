import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The Regular weight setting (plan A9.6; axes/regular-weight.ts): every regular text role draws at
// `--area-weight-regular`, so a regular written as a number, a keyword or a ramp stop would not follow it. These read the
// built stylesheet and the sources, so they hold for every family and every app page at once.
const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const strip = text => text.replace(/\/\*[\s\S]*?\*\//g, '');
const css = strip(readFileSync(join(ROOT, 'packages/styles/dist/area.css'), 'utf8'));
// Every @font-face block names the weights a file covers: a descriptor, not a text weight.
const withoutFaces = text => text.replace(/@font-face\s*\{[^}]*\}/g, '');
const declarations = (text, props) => [...withoutFaces(text).matchAll(/([^{};]+)\{([^{}]*)\}/g)].flatMap(([, selector, body]) =>
  [...body.matchAll(new RegExp(`(?:^|;)\\s*(${props})\\s*:\\s*([^;]+)`, 'g'))].map(([, prop, value]) => ({ selector: selector.trim(), prop, value: value.trim() })));

/** A regular weight written past the role: 400 or `normal`, as a number, a keyword, a ramp stop or a shorthand's weight. */
const LITERAL_REGULAR = /^(?:400|normal)$|var\(--area-wght-400\)/;
const SHORTHAND_REGULAR = /(?:^|\s)(?:400|normal)\s+(?:[\d.]+(?:px|rem|em|%)|var\()/;

const walk = (dir, keep) => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  if (name === 'node_modules' || name === 'dist' || name === 'generated') return [];
  return statSync(path).isDirectory() ? walk(path, keep) : keep(name) ? [path] : [];
});

test('component CSS writes regular as the role, never 400 (plan A9.6)', () => {
  for (const { selector, prop, value } of declarations(css, 'font-weight|--_[\\w-]*weight')) {
    assert.doesNotMatch(value, LITERAL_REGULAR, `${selector} sets ${prop}: ${value}; regular is var(--area-weight-regular)`);
  }
  for (const { selector, value } of declarations(css, 'font')) {
    assert.doesNotMatch(value, SHORTHAND_REGULAR, `${selector} sets font: ${value}, a literal regular weight in the shorthand`);
  }
});

test('the body and every Regular weight scope draw text at the role', () => {
  const base = strip(readFileSync(join(ROOT, 'packages/styles/src/base.css'), 'utf8'));
  const body = /\bbody\s*\{([^}]*)\}/.exec(base)?.[1] ?? '';
  assert.match(body, /font-weight:\s*var\(--area-weight-regular\)/, 'body reads the regular role, so text with no weight of its own follows the setting');
  // font-weight inherits as a number: a scope set below the body restates it, or the body's 400 would stay.
  const scope = /:where\(\[data-area-regular-weight\]:not\(:root\)\)\s*\{([^}]*)\}/.exec(base)?.[1] ?? '';
  assert.match(scope, /font-weight:\s*var\(--area-weight-regular\)/, 'a [data-area-regular-weight] scope restates the regular weight');
});

test('React, demos and app pages write regular as the role, never 400', () => {
  const sources = [
    ...walk(join(ROOT, 'packages/react/src'), name => /\.(tsx?|mjs)$/.test(name)),
    ...walk(join(ROOT, 'apps/desktop/src'), name => /\.(tsx?|mjs)$/.test(name)),
  ];
  for (const path of sources) {
    const text = readFileSync(path, 'utf8');
    for (const [match] of text.matchAll(/fontWeight:\s*(?:400\b|["'](?:400|normal)["'])/g)) assert.fail(`${path}: ${match}; regular is var(--area-weight-regular)`);
    for (const [match] of text.matchAll(/\bfont:\s*["'`](?:400|normal)\s/g)) assert.fail(`${path}: ${match}…; regular is var(--area-weight-regular)`);
  }
  // App stylesheets (Typefaces' @font-face descriptors excepted, which name a file's weights).
  for (const path of walk(join(ROOT, 'apps/desktop/src'), name => name.endsWith('.css'))) {
    for (const { selector, prop, value } of declarations(strip(readFileSync(path, 'utf8')), 'font-weight')) {
      assert.doesNotMatch(value, LITERAL_REGULAR, `${path}: ${selector} sets ${prop}: ${value}`);
    }
  }
});
