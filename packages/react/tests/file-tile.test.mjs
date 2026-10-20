import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { FileGrid, FileGridItem, FileImage, FilePage, FileTile, Folder } from '../dist/modules/index.js';

// docs/specs/folder.md: Finder's folder in one outline look, decorative unless named.
test('Folder is the outline folder and decorative by default, named with label', () => {
  assert.match(render(h(Folder, {})), /class="area-folder"[^>]*aria-hidden="true"/);
  const named = render(h(Folder, { label: 'Shared folder', size: 'lg' }));
  assert.match(named, /role="img"/);
  assert.match(named, /aria-label="Shared folder"/);
  assert.match(named, /area-folder--lg/);
});

// DESIGN_SYSTEM.md, Names: aria-label names the figure itself; the old label / name stay as deprecated aliases, and a
// named figure is never also aria-hidden (audit 2026-10-19: a passed aria-label was spread after aria-hidden="true").
test('Folder and FilePage take aria-label as their name, never hidden once named', () => {
  for (const html of [render(h(Folder, { 'aria-label': 'Folder' })), render(h(FilePage, { 'aria-label': 'PNG file', label: 'PNG' }))]) {
    assert.match(html, /role="img"/);
    assert.doesNotMatch(html, /aria-hidden="true"[^>]*class="area-(folder|file-page)"|class="area-(folder|file-page)[^"]*"[^>]*aria-hidden="true"/);
  }
  assert.match(render(h(FilePage, { name: 'PNG file' })), /role="img"[^>]*aria-label="PNG file"/);
  assert.match(render(h(Folder, { 'aria-label': 'One', label: 'Two' })), /aria-label="One"/);
});

// Round 57: the solid folder, its tones and its contents sheet are archived; the old props are accepted and ignored.
test('Folder draws its back, rim, pocket, tucked sheet and count, and ignores the archived props', () => {
  const html = render(h(Folder, { count: 5 }));
  assert.match(html, /area-folder__back/);
  assert.match(html, /area-folder__front/);
  assert.match(html, /area-folder__rim/);
  assert.match(html, /class="area-folder__paper"/);
  // The back's edge is drawn before the sheet, so the sheet stands in front of the back (owner, 2026-10-19).
  assert.ok(html.indexOf('area-folder__rim') < html.indexOf('area-folder__paper'));
  assert.doesNotMatch(html, /fill="url\(#|<image /);
  assert.match(html, /area-folder__count">5</);
  const legacy = render(h(Folder, { variant: 'solid', tone: 'red', contents: ['a.jpg'], open: true }));
  assert.doesNotMatch(legacy, /area-folder--(solid|red|outline)|<image /);
  assert.match(legacy, /data-open=""/);
});
// docs/specs/file-page.md: a page with its fold; the glyph and label, or a preview instead of them.
test('FilePage draws its glyph and label, or a preview in their place', () => {
  const html = render(h(FilePage, { icon: h('svg', { 'data-glyph': '' }), label: 'docx', size: 'lg' }));
  assert.match(html, /class="area-file-page area-file-page--lg"[^>]*aria-hidden="true"/);
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

// docs/specs/file-image.md: the family's image figure: decorative unless named; a picture covers the frame, or a
// landscape is drawn in it.
test('FileImage draws a landscape, or the picture in its place, and is decorative unless named', () => {
  const drawn = render(h(FileImage, { size: 'lg' }));
  assert.match(drawn, /class="area-file-image area-file-image--lg"[^>]*aria-hidden="true"/);
  assert.equal((drawn.match(/area-file-image__scene/g) || []).length, 2, 'two hills and a sun');
  const picture = render(h(FileImage, { src: 'shot.png', 'aria-label': 'Screenshot', variant: 'solid' }));
  assert.match(picture, /role="img"[^>]*aria-label="Screenshot"/);
  assert.match(picture, /class="area-file-image__picture" src="shot.png" alt=""/);
  assert.doesNotMatch(picture, /area-file-image__scene/);
});
