import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { ListBox, ListBoxItem, ListBoxSection } from '../dist/modules/index.js';

// docs/specs/list-box.md: the WAI-ARIA listbox, one Tab stop.
const options = (selected) => h(ListBox, { 'aria-label': 'Sort by', defaultValue: selected },
  h(ListBoxItem, { value: 'name' }, 'Name'), h(ListBoxItem, { value: 'size' }, 'Size'), h(ListBoxItem, { value: 'pdf', disabled: true }, 'PDF'));

test('a list is a listbox of options, the chosen one selected and the only Tab stop', () => {
  const html = render(options('size'));
  assert.match(html, /role="listbox"[^>]*aria-orientation="vertical"[^>]*aria-label="Sort by"|role="listbox"[^>]*aria-label="Sort by"/);
  assert.equal((html.match(/role="option"/g) || []).length, 3);
  assert.equal((html.match(/tabindex="0"/gi) || []).length, 1);
  assert.match(html, /aria-selected="true"[^>]*data-selected=""[^>]*data-value="size"[^>]*tabindex="0"/i);
  assert.match(html, /aria-disabled="true"[^>]*data-disabled=""[^>]*data-value="pdf"/);
  assert.match(html, /area-menu__item/, 'list options are Menu rows');
  assert.match(html, /area-menu__check/, 'the chosen value shows a check');
});

test('a grid lays options out without Menu rows; sections are named groups', () => {
  const html = render(h(ListBox, { layout: 'grid', 'aria-label': 'Icon', defaultValue: 'b' },
    h(ListBoxSection, { title: 'Objects' }, h(ListBoxItem, { value: 'a', textValue: 'Alpha', 'aria-label': 'Alpha' }, 'A'), h(ListBoxItem, { value: 'b' }, 'B'))));
  assert.match(html, /class="area-list-box area-list-box--grid"/);
  assert.doesNotMatch(html, /area-menu__item/);
  assert.doesNotMatch(html, /aria-orientation/);
  const group = html.match(/role="group" aria-labelledby="([^"]+)"/);
  assert.ok(group, 'a section is a group');
  assert.match(html, new RegExp(`id="${group[1]}"[^>]*>(<[^>]+>)*Objects<`));
  assert.match(html, /data-text="Alpha"/);
});

test('ListBoxItem outside a ListBox is an error', () => {
  assert.throws(() => render(h(ListBoxItem, { value: 'a' }, 'A')), /inside a ListBox/);
});

// docs/specs/list-box.md, "Several" (components audit V7, 2026-11-07).
test('multiple: a multiselectable listbox whose chosen options are selected, the first of them the Tab stop', () => {
  const html = render(h(ListBox, { 'aria-label': 'Label', multiple: true, defaultValues: ['two', 'three'] },
    h(ListBoxItem, { value: 'one' }, 'Option one'), h(ListBoxItem, { value: 'two' }, 'Option two'), h(ListBoxItem, { value: 'three' }, 'Option three')));
  assert.match(html, /role="listbox"[^>]*aria-multiselectable="true"/);
  const selected = [...html.matchAll(/aria-selected="true"[^>]*data-value="(\w+)"/g)].map(match => match[1]);
  assert.deepEqual(selected, ['two', 'three']);
  assert.equal((html.match(/data-selected=""/g) || []).length, 2, 'each chosen row shows its check');
  assert.equal((html.match(/tabindex="0"/gi) || []).length, 1);
  assert.match(html, /data-value="two" tabindex="0"/i);
  const controlled = render(h(ListBox, { 'aria-label': 'Label', multiple: true, values: ['one'], value: 'two' }, h(ListBoxItem, { value: 'one' }, 'A'), h(ListBoxItem, { value: 'two' }, 'B')));
  assert.match(controlled, /aria-selected="true"[^>]*data-value="one"/, 'values wins; value is ignored with multiple');
  assert.match(controlled, /aria-selected="false"[^>]*data-value="two"/);
  const single = render(options('size'));
  assert.doesNotMatch(single, /aria-multiselectable/);
});

test('multiple: the keyboard contract is in the source (Space toggles, Shift extends, Ctrl or Cmd+A all, grid click chooses one)', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../src/components/ListBox.tsx', import.meta.url), 'utf8');
  assert.match(source, /if \(multiple\) toggle\(current\.dataset\.value, event\)/);
  assert.match(source, /event\.shiftKey && \/\^\(Arrow\(Up\|Down\|Left\|Right\)\|Home\|End\)\$\/\.test\(event\.key\)/);
  assert.match(source, /event\.key\.toLowerCase\(\) === "a"/);
  assert.match(source, /layout === "grid" && event\.type === "click" && !pointer\.metaKey && !pointer\.ctrlKey/);
});
