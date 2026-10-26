import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MANIFESTS } from '../dist/modules/index.js';

// DESIGN_SYSTEM.md, "Emphasis roles": components paint the Action or Selection role; a theme,
// not a component variant, decides whether each role is neutral or the accent.
const css = readFileSync(new URL('../../styles/dist/area.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
const tokens = readFileSync(new URL('../../tokens/dist/css/tokens.css', import.meta.url), 'utf8');
const manifestKey = slug => slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

test('no component offers an accent tone', () => {
  for (const [key, manifest] of Object.entries(MANIFESTS)) {
    assert.ok(!(manifest.variants?.tone ?? []).includes('accent'), `${key} still has an accent tone`);
  }
  assert.doesNotMatch(css, /\.area-[a-z-]+--accent\b/, 'a --accent modifier survives in the stylesheet');
});

test('selection families have no tone axis left to set', () => {
  for (const slug of ['checkbox', 'radio', 'chip', 'alignment-picker', 'calendar', 'slider', 'progress', 'spinner', 'count', 'nav']) {
    assert.equal(MANIFESTS[manifestKey(slug)].variants.tone, undefined, `${slug} keeps a tone axis`);
  }
});

test('component paint reads the roles, never the accent directly', () => {
  for (const rule of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, selector, body] = rule;
    if (!/\.area-|::selection/.test(selector) || /area-syntax|area-code-block__pre/.test(selector)) continue;
    assert.doesNotMatch(body, /var\(--area-(accent-solid|accent-surface|fg-accent|fg-on-accent)\b/, `${selector.trim()} paints the accent outside a role`);
  }
});

test('action and selection default to neutral (defaults review, 2026-10-25), and both derive from neutral and accent', () => {
  assert.match(tokens, /--area-action-accent: 0;/);
  assert.match(tokens, /--area-selection-accent: 0;/);
  // The selected edge is a Selection role too, so a selected card and the mark inside it are one colour (option B).
  for (const [role, neutral, accent] of [['action-solid', 'neutral-solid', 'accent-solid'], ['selection-solid', 'neutral-solid', 'accent-solid'], ['fg-selection', 'fg-default', 'fg-accent'], ['stroke-selected', 'neutral-solid', 'accent-indicator'], ['focus-color', 'neutral-solid', 'accent-indicator'], ['selection-highlight', 'bg-pressed', 'accent-surface-active']]) {
    assert.match(tokens, new RegExp(`--area-${role}: color-mix\\(in srgb, var\\(--area-${neutral}\\), var\\(--area-${accent}\\) calc\\(var\\(--area-(action|selection)-accent\\) \\* 100%\\)\\);`));
  }
});

test('solid Buttons paint Action; checked, on and filled marks paint Selection', () => {
  const body = selector => [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(([, s]) => s.split(',').some(part => part.trim() === selector)).map(([, , b]) => b).join('\n');
  assert.match(body('.area-button'), /--_solid: var\(--area-action-solid\)/);
  assert.match(body('.area-checkbox'), /--_checked: var\(--area-selection-solid\)/);
  assert.match(body('.area-switch'), /--_on: var\(--area-switch-color, var\(--area-selection-solid\)\)/); // the public colour hook falls back to Selection (audit H-13)
  assert.match(body('.area-calendar'), /--_selected: var\(--area-selection-solid\)/);
  assert.match(body('.area-chip'), /--_selected-bg: var\(--area-selection-surface\)/);
});
