import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString as render } from 'react-dom/server';
import { Indicator, IndicatorAnchor, Presence } from '../dist/modules/index.js';

test('counts cap visual text without losing full accessible value; zero hiding is opt-in', () => {
  assert.match(render(h(Indicator, {count: 105})), /aria-label="105 notifications"[^>]*>99\+</);
  assert.match(render(h(Indicator, {count: 0})), />0<\/span>/);
  assert.equal(render(h(Indicator, {count: 0, showZero: false})), '');
  assert.equal(render(h(Indicator, {count: 5, disabled: true})), '');
  assert.match(render(h(Indicator, {count: NaN})), />0<\/span>/);
  assert.match(render(h(Indicator, {count: 3.8, max: 2})), />2\+</);
});
test('activity and processing have accessible defaults and support caller labels', () => {
  assert.match(render(h(Indicator)), /aria-label="New activity"/);
  assert.match(render(h(Indicator, {processing: true})), /aria-label="Processing"/);
  assert.match(render(h(Indicator, {processing: true, 'aria-label': 'Sync in progress'})), /aria-label="Sync in progress"/);
});
test('presence sizes, Area-drawn marks, out-of-office shapes, and accessible overrides', () => {
  for (const size of ['sm','md','lg']) { // xs dropped (audit C-19)
    const html = render(h(Presence, {size}));
    assert.match(html, new RegExp(`area-presence--${size}`));
    // One 16-unit drawing at every size; strokes keep the icon line weight when scaled.
    assert.match(html, /viewBox="0 0 16 16"/);
    assert.match(html, /vector-effect="non-scaling-stroke"/);
  }
  const busy = render(h(Presence, {status:'busy'}));
  assert.match(busy, /data-solid=/);
  assert.doesNotMatch(busy, /<svg/);
  for (const status of ['available','away','busy','do-not-disturb','blocked','offline','out-of-office','unknown']) {
    assert.match(render(h(Presence, {status})), new RegExp(`aria-label="${status.replaceAll('-', ' ')}"`));
  }
  const shape = html => html.match(/<path[^>]+/g).join('');
  assert.notEqual(shape(render(h(Presence, {status:'away'}))), shape(render(h(Presence, {status:'away',outOfOffice:true}))));
  assert.equal(shape(render(h(Presence, {status:'away',outOfOffice:true}))), shape(render(h(Presence, {status:'out-of-office'}))));
  assert.match(render(h(Presence, {status:'busy',outOfOffice:true})), /aria-label="busy, out of office"/);
  assert.match(render(h(Presence, {'aria-label':'Disponible'})), /aria-label="Disponible"/);
});
test('anchor hides decorative overlays from accessibility while preserving owner', () => {
  const html=render(h(IndicatorAnchor,{placement:'bottom-end',indicator:h(Presence)},h('button',{'aria-label':'David Tee, available'},'David Tee')));
  assert.match(html,/aria-label="David Tee, available"/);
  assert.match(html,/area-indicator-anchor__indicator" aria-hidden="true" inert=""/);
  assert.match(html,/area-indicator-anchor--bottom-end/);
});

test('Indicator exposes presence status, native size and out-of-office naming', () => {
  assert.match(render(h(Indicator,{status:'away',size:'sm',outOfOffice:true})), /aria-label="away, out of office"/);
  assert.match(render(h(Indicator,{status:'available',size:'sm'})), /area-presence--sm/);
});

test('gallery presents exactly one indicator variant per specimen', async () => {
  // The app's gallery (apps/desktop, the source of truth) builds its tiles from specimens.mjs and renders each
  // demo from the registry; the archived docs build this test once read is gone. Bundled as
  // apps/desktop/scripts/check-playgrounds.mjs does: React external, inside the project so Node finds it.
  const {build}=await import('esbuild');
  const {mkdirSync,rmSync}=await import('node:fs');
  const {pathToFileURL}=await import('node:url');
  const app=new URL('../../../apps/desktop/',import.meta.url);
  const scratch=new URL('.cache/',app);mkdirSync(scratch,{recursive:true});
  const out=new URL(`indicator-registry.${process.pid}.mjs`,scratch);
  await build({entryPoints:[new URL('src/content/registry.tsx',app).pathname],outfile:out.pathname,bundle:true,format:'esm',platform:'node',jsx:'automatic',external:['react','react-dom','react/jsx-runtime'],logLevel:'silent'});
  try {
    const {DEMOS}=await import(pathToFileURL(out.pathname).href);
    const {COMPONENT_PAGES}=await import(new URL('src/content/pages.mjs',app).href);
    const {componentSpecimens}=await import(new URL('src/content/specimens.mjs',app).href);
    const tiles=componentSpecimens(COMPONENT_PAGES.find(page=>page.slug==='indicator'),()=>true);
    assert.ok(tiles.length > 20);
    for(const tile of tiles) {
      assert.ok(DEMOS[tile.demo],`${tile.id} has no demo ${tile.demo}`);
      const html=render(h(DEMOS[tile.demo]));
      assert.equal((html.match(/class="area-(?:indicator|presence) /g)||[]).length,1,`${tile.id} (${tile.demo}) shows more or less than one indicator`);
    }
  } finally { rmSync(out,{force:true}); }
});
