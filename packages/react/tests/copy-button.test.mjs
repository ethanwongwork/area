import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { CodeBlock, CopyButton, COPY_FEEDBACK_MS, TokenRow } from '../dist/modules/index.js';

// docs/specs/copy-button.md: one fixed name, the result said once through a polite live region.
test('icon-only CopyButton is named by its label and keeps an empty live region at rest', () => {
  const html = render(h(CopyButton, { value: 'npm i @area/react' }));
  assert.match(html, /<button[^>]*class="[^"]*area-copy-button[^"]*"[^>]*aria-label="Copy"/);
  assert.match(html, /area-button--ghost/);
  assert.match(html, /<span class="area-sr-only" aria-live="polite"><\/span>/);
  assert.doesNotMatch(html, /data-copy-state/);
});

test('a labelled CopyButton keeps its label as its name and takes Button props', () => {
  const html = render(h(CopyButton, { value: 'x', variant: 'outline', fullWidth: true }, 'Copy SVG'));
  assert.doesNotMatch(html, /aria-label=/);
  assert.match(html, /area-button__label">Copy SVG</);
  assert.match(html, /area-button--outline/);
  assert.match(html, /area-button--full-width/);
});

test('Code block and Token row copy through the same control and clock', () => {
  assert.equal(COPY_FEEDBACK_MS, 2000);
  const block = render(h(CodeBlock, { code: 'const a = 1;' }));
  assert.match(block, /area-copy-button[^"]*"[^>]*aria-label="Copy code"/);
  assert.equal((block.match(/aria-live="polite"/g) || []).length, 1, 'Code block says its copy result once');
  const row = render(h(TokenRow, { name: 'color/bg', value: '#FFFFFF', copyable: true }));
  assert.match(row, /aria-label="Copy color\/bg, #FFFFFF"/);
  assert.match(row, /aria-live="polite"/);
});
