import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Disclosure, DisclosureGroup } from '../dist/modules/index.js';

test('defaults to plain md, closed, with a named button that controls hidden content', () => {
  const html = render(h(Disclosure, { heading: 'Title' }, 'Body'));
  for (const cls of ['area-disclosure--plain', 'area-disclosure--md']) assert.match(html, new RegExp(cls));
  assert.match(html, /<button[^>]*type="button"[^>]*aria-expanded="false"/);
  const controls = html.match(/aria-controls="([^"]+)"/)[1];
  assert.match(html, new RegExp(`id="${controls}"[^>]*hidden`));
  assert.ok(!/data-open/.test(html));
});
test('defaultOpen shows the content and marks the root open; variant and size map to modifiers', () => {
  const html = render(h(Disclosure, { heading: 'Title', defaultOpen: true, variant: 'divided', size: 'sm' }, 'Body'));
  assert.match(html, /data-open=""/);
  assert.match(html, /aria-expanded="true"/);
  assert.ok(!/class="area-disclosure__content"[^>]*hidden/.test(html));
  for (const cls of ['area-disclosure--divided', 'area-disclosure--sm']) assert.match(html, new RegExp(cls));
});
test('headingLevel wraps the trigger; disabled disables the button', () => {
  const html = render(h(Disclosure, { heading: 'Title', headingLevel: 2, disabled: true }, 'Body'));
  assert.match(html, /<h2 class="area-disclosure__heading"><button/);
  assert.match(html, /<button[^>]*disabled=""/);
  assert.match(html, /data-disabled=""/);
});
test('a group opens its defaultValue items, passes variant and size, and names each region by its trigger', () => {
  const html = render(h(DisclosureGroup, { variant: 'divided', size: 'sm', defaultValue: ['b'] },
    h(Disclosure, { value: 'a', heading: 'A' }, 'a'), h(Disclosure, { value: 'b', heading: 'B' }, 'b')));
  assert.match(html, /class="area-disclosure-group"/);
  assert.equal((html.match(/area-disclosure--divided/g) || []).length, 2);
  assert.equal((html.match(/aria-expanded="true"/g) || []).length, 1);
  assert.equal((html.match(/<h3 class="area-disclosure__heading">/g) || []).length, 2);
  const [, trigger] = html.match(/<button id="([^"]+)"[^>]*aria-expanded="true"/);
  assert.match(html, new RegExp(`role="region" aria-labelledby="${trigger}"`));
});
