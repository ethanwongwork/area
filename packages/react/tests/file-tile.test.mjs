import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { FileGrid, FileGridItem, FilePage, FileTile, Folder } from '../dist/modules/index.js';

// docs/specs/folder.md: Finder's folder, decorative unless named; anything inside draws one sheet, an image on it.
test('Folder is the outline folder and decorative by default, named with label', () => {
  assert.match(render(h(Folder, {})), /class="area-folder area-folder--blue area-folder--outline"[^>]*aria-hidden="true"/);
  const named = render(h(Folder, { label: 'Shared folder', tone: 'neutral', size: 'lg' }));
  assert.match(named, /role="img"/);
  assert.match(named, /aria-label="Shared folder"/);
  assert.match(named, /area-folder--lg/);
  assert.match(named, /area-folder--neutral/);
});

test('Folder draws one sheet when it holds something, the first image on it', () => {
  assert.doesNotMatch(render(h(Folder, { variant: 'solid' })), /area-folder__paper/);
  assert.doesNotMatch(render(h(Folder, { variant: 'solid', contents: 0 })), /area-folder__paper/);
  assert.equal((render(h(Folder, { variant: 'solid', contents: 5 })).match(/class="area-folder__paper"/g) || []).length, 1);
  const full = render(h(Folder, { variant: 'solid', contents: ['a.jpg', 'b.jpg'], open: true }));
  assert.equal((full.match(/<image /g) || []).length, 1);
  assert.match(full, /href="a.jpg"/);
  assert.match(full, /data-open=""/);
});

test('Folder outline draws its back, rim and pocket and its count, its sheet tucked until it opens', () => {
  const html = render(h(Folder, { variant: 'outline', contents: 3, count: 5 }));
  assert.match(html, /area-folder--outline/);
  assert.match(html, /area-folder__back/);
  assert.match(html, /area-folder__front/);
  assert.match(html, /area-folder__rim/);
  assert.match(html, /class="area-folder__paper" data-tucked=""/);
  // The back's edge is drawn before the sheet, so the sheet stands in front of the back (owner, 2026-10-19).
  assert.ok(html.indexOf('area-folder__rim') < html.indexOf('area-folder__paper'));
  assert.doesNotMatch(html, /fill="url\(#/);
  assert.match(render(h(Folder, { variant: 'solid', contents: 1, open: true })), /data-open=""/);
  assert.match(html, /area-folder__count">5</);
});

// docs/specs/file-page.md: a page with its fold; the glyph and label, or a preview instead of them.
test('FilePage draws its glyph and label, or a preview in their place', () => {
  const html = render(h(FilePage, { icon: h('svg', { 'data-glyph': '' }), label: 'docx', size: 'lg' }));
  assert.match(html, /class="area-file-page area-file-page--lg area-file-page--outline"[^>]*aria-hidden="true"/);
  assert.match(html, /area-file-page__fold/);
  assert.match(html, /area-file-page__icon"><svg data-glyph=""/);
  assert.match(html, /area-file-page__label">docx</);
  const preview = render(h(FilePage, { preview: 'shot.png', icon: h('svg'), label: 'PNG', name: 'Screenshot' }));
  assert.match(preview, /role="img"[^>]*aria-label="Screenshot"|aria-label="Screenshot"[^>]*role="img"/);
  assert.match(preview, /href="shot.png"/);
  assert.doesNotMatch(preview, /area-file-page__icon|area-file-page__label/);
});

// docs/specs/file-tile.md: a grid of options with one Tab stop, the selected one reachable.
test('FileGrid is a listbox grid of FileTile options with one Tab stop', () => {
  const html = render(h(FileGrid, { 'aria-label': 'Files', defaultValue: 'b', size: 'lg' },
    h(FileGridItem, { value: 'a', name: 'Alpha', meta: '3 items', figure: h(Folder, {}) }),
    h(FileGridItem, { value: 'b', name: 'Beta.png', figure: 'beta.png', dropTarget: true })));
  assert.match(html, /role="listbox"/);
  assert.match(html, /area-list-box--grid area-file-grid area-file-grid--lg/);
  assert.equal((html.match(/role="option"/g) || []).length, 2);
  assert.equal((html.match(/tabindex="0"/gi) || []).length, 1);
  assert.match(html, /aria-selected="true"[^>]*data-value="b"/);
  assert.match(html, /data-drop-target=""/);
  assert.match(html, /<img src="beta.png" alt=""/);
});

test('FileTile keeps its meta optional', () => {
  const html = render(h(FileTile, { name: 'Notes.txt' }));
  assert.match(html, /area-file-tile__name">Notes.txt</);
  assert.doesNotMatch(html, /area-file-tile__meta/);
});
