import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Badge, BadgeGroup, BadgeAnchor, badgeVariants, MANIFESTS } from '../dist/modules/index.js';
import { readFileSync } from 'node:fs';
const render = element => renderToString(element);
test('default and full variant/tone matrix preserve orthogonal classes', () => {
  assert.match(render(h(Badge,null,'Draft')), /area-badge--soft area-badge--neutral area-badge--md/);
  assert.deepEqual(MANIFESTS.badge.variants.size,['sm','md','lg']);
  for (const variant of MANIFESTS.badge.variants.variant) for (const tone of MANIFESTS.badge.variants.tone) {
    const html=render(h(Badge,{variant,tone,dot:true},'Ready'));
    assert.ok(html.includes(`area-badge--${variant}`) && html.includes(`area-badge--${tone}`) && html.includes('area-badge__dot'));
  }
  assert.throws(()=>badgeVariants({variant:'tint'}),RangeError);
  assert.equal(MANIFESTS.badge.aliases.tint,'soft');
});
test('native link forwards navigation props and truncation preserves the full text', () => {
  const html=render(h(Badge,{as:'a',href:'/release',target:'_blank',rel:'noreferrer',truncate:true},'Awaiting deployment approval'));
  assert.throws(()=>render(h(Badge,{truncate:true},h("strong",null,"Full status"))),/full-text title/);
  assert.match(html,/^<a /);assert.match(html,/href="\/release"/);assert.match(html,/title="Awaiting deployment approval"/);
});
test('unlabelled icon/dot-only badges fail, named forms carry image semantics', () => {
  assert.throws(()=>render(h(Badge,{iconOnly:true})),/accessible|aria-label/);
  assert.throws(()=>render(h(Badge,{dotOnly:true})),/aria-label/);
  assert.match(render(h(Badge,{dotOnly:true,'aria-label':'Available'})),/role="img"/);
});
test('anchor overlay is inert and decorative; owner retains its name', () => {
  const html=render(h(BadgeAnchor,{invisible:true,placement:'bottom-start',overlap:'circular',badge:h(Badge,null,'3')},h('button',{'aria-label':'Inbox, 3 unread'},'Inbox')));
  assert.match(html,/aria-hidden="true" inert=""/); assert.match(html,/data-invisible=""/);assert.match(html,/Inbox, 3 unread/);assert.match(html,/overlap-circular/);
});
test('group limits children without losing them and uses native popover relationships', () => {
  const html=render(h(BadgeGroup,{visibleCount:1},['Draft','Reviewed','Ready'].map(label=>h(Badge,{key:label},label))));
  for(const label of ['Draft','Reviewed','Ready']) assert.equal(html.split(`>${label}<`).length-1,1);
  assert.match(html,/2 more/);assert.match(html,/popover="auto"/);
  const target=html.match(/popoverTarget="([^"]+)"/i)?.[1];assert.ok(target);assert.ok(html.includes(`id="${target}"`));
  assert.throws(()=>render(h(BadgeGroup,{visibleCount:NaN})),RangeError);
});
test('Badge gallery splits the complete matrix into one specimen per tile', async () => {
  const {COMPONENT_PAGES}=await import('../../../apps/docs/src/pages.mjs');
  const examples=COMPONENT_PAGES.find(page=>page.slug==='badge').examples;
  const gallery=readFileSync(new URL('../../../apps/docs/dist/gallery.html',import.meta.url),'utf8');
  assert.equal(examples[0].demo,'BadgeDefault');assert.equal(examples[1].demo,'BadgeVariants');assert.equal(examples[2].demo,'BadgeSizes');
  for(const variant of MANIFESTS.badge.variants.variant) for(const tone of MANIFESTS.badge.variants.tone) {
    const id=`gallery-badge-variant-${variant}-tone-${tone}`;
    const tile=gallery.split(`id="${id}"`)[1].split('</article>')[0];
    assert.equal((tile.match(/class="area-badge /g)||[]).length,1,`${variant}/${tone}`);
  }
  assert.ok(!gallery.includes('data-badge-demo="BadgeToneMatrix"'));
});
