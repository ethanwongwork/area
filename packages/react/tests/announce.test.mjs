import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';

// The shared announcer (components audit D1, 2026-11-07; DESIGN_SYSTEM.md, "Announcements"). The tests run without a
// browser, so a small document stands in: elements with attributes, children, text and the two selectors the
// announcer asks for.
class FakeElement {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.attributes = new Map(); this.children = []; this.parentNode = null; this.text = ''; this.modal = false; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.has(name) ? this.attributes.get(name) : null; }
  hasAttribute(name) { return this.attributes.has(name); }
  append(...nodes) { for (const node of nodes) { node.parentNode?.children.splice(node.parentNode.children.indexOf(node), 1); node.parentNode = this; this.children.push(node); } }
  get textContent() { return this.text + this.children.map(child => child.textContent).join(''); }
  set textContent(value) { this.text = value; for (const child of this.children) child.parentNode = null; this.children = []; }
  *walk() { for (const child of this.children) { yield child; yield* child.walk(); } }
  matches(selector) {
    if (selector === ':modal') return this.modal && this.hasAttribute('open');
    const attr = selector.match(/^\[([\w-]+)="([^"]+)"\]$/);
    if (attr) return this.getAttribute(attr[1]) === attr[2];
    if (selector === 'dialog[open]') return this.tagName === 'DIALOG' && this.hasAttribute('open');
    throw new Error(`unsupported selector ${selector}`);
  }
  querySelectorAll(selector) { return [...this.walk()].filter(node => node.matches(selector)); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
}
class FakeDocument {
  constructor() { this.documentElement = new FakeElement('html', this); this.body = new FakeElement('body', this); this.documentElement.append(this.body); }
  createElement(tag) { return new FakeElement(tag, this); }
  querySelectorAll(selector) { return this.documentElement.querySelectorAll(selector); }
  querySelector(selector) { return this.documentElement.querySelector(selector); }
}

const { announce, clearAnnouncements, useAnnouncement, ANNOUNCE_DELAY_MS, ANNOUNCE_CLEAR_MS } = await import('../dist/modules/index.js');

const withDocument = run => {
  const doc = new FakeDocument();
  const before = globalThis.document;
  globalThis.document = doc;
  mock.timers.enable({ apis: ['setTimeout'] });
  try { run(doc); } finally { mock.timers.reset(); clearAnnouncements(); if (before === undefined) delete globalThis.document; else globalThis.document = before; }
};
const regions = doc => doc.querySelectorAll('[data-area-announcer="root"]');
const live = (doc, politeness) => doc.querySelector(`[data-area-announcer="${politeness}"]`);

test('importing and server rendering touch no document', () => {
  assert.equal(typeof globalThis.document, 'undefined');
  assert.doesNotThrow(() => announce('Saved'));
  assert.doesNotThrow(() => clearAnnouncements());
  const Probe = () => { useAnnouncement('Saved'); return h('p', null, 'x'); };
  assert.equal(renderToString(h(Probe)), '<p>x</p>');
});

test('the first announcement makes one region per document, with a polite status and an assertive alert', () => {
  withDocument(doc => {
    assert.equal(regions(doc).length, 0, 'nothing is made before it is needed');
    announce('Copied to clipboard');
    announce('Upload failed', { politeness: 'assertive' });
    announce('Saved');
    assert.equal(regions(doc).length, 1);
    const root = regions(doc)[0];
    assert.equal(root.parentNode, doc.body);
    assert.match(root.getAttribute('style'), /position:absolute/);
    assert.match(root.getAttribute('style'), /clip-path:inset\(50%\)/);
    const polite = live(doc, 'polite'), assertive = live(doc, 'assertive');
    assert.deepEqual([polite.getAttribute('role'), polite.getAttribute('aria-live'), polite.getAttribute('aria-atomic')], ['status', 'polite', 'true']);
    assert.deepEqual([assertive.getAttribute('role'), assertive.getAttribute('aria-live'), assertive.getAttribute('aria-atomic')], ['alert', 'assertive', 'true']);
  });
});

test('a message is written after a pause, the last one wins, and it clears itself', () => {
  withDocument(doc => {
    announce('3 results');
    announce('2 results');
    assert.equal(live(doc, 'polite').textContent, '', 'cleared first');
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    assert.equal(live(doc, 'polite').textContent, '2 results');
    mock.timers.tick(ANNOUNCE_CLEAR_MS);
    assert.equal(live(doc, 'polite').textContent, '', 'not left on the page to be found later');
  });
});

test('the same words twice are said twice: the region is emptied, then written again', () => {
  withDocument(doc => {
    announce('Copied to clipboard');
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    assert.equal(live(doc, 'polite').textContent, 'Copied to clipboard');
    announce('Copied to clipboard');
    assert.equal(live(doc, 'polite').textContent, '', 'emptied, so the change is new');
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    assert.equal(live(doc, 'polite').textContent, 'Copied to clipboard');
  });
});

test('polite and assertive are separate: one never cancels the other', () => {
  withDocument(doc => {
    announce('Upload failed', { politeness: 'assertive' });
    announce('Saved');
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    assert.equal(live(doc, 'assertive').textContent, 'Upload failed');
    assert.equal(live(doc, 'polite').textContent, 'Saved');
    clearAnnouncements();
    assert.equal(live(doc, 'assertive').textContent, '');
    assert.equal(live(doc, 'polite').textContent, '');
  });
});

test('an empty message only clears', () => {
  withDocument(doc => {
    announce('Saved');
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    announce('  ');
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    assert.equal(live(doc, 'polite').textContent, '');
  });
});

test('inside an open modal dialog the region joins it, since the rest of the page is inert', () => {
  withDocument(doc => {
    announce('Saved');
    const dialog = doc.createElement('dialog');
    dialog.setAttribute('open', '');
    dialog.modal = true;
    doc.body.append(dialog);
    announce('2 results');
    assert.equal(regions(doc).length, 1, 'moved, not copied');
    assert.equal(regions(doc)[0].parentNode, dialog);
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    assert.equal(live(doc, 'polite').textContent, '2 results');
    dialog.attributes.delete('open');
    announce('Closed');
    assert.equal(regions(doc)[0].parentNode, doc.body, 'back in the page once the dialog closes');
  });
});

test('regions another copy of the package made are reused, not doubled', () => {
  withDocument(doc => {
    const root = doc.createElement('div');
    root.setAttribute('data-area-announcer', 'root');
    for (const politeness of ['polite', 'assertive']) { const node = doc.createElement('div'); node.setAttribute('data-area-announcer', politeness); root.append(node); }
    doc.body.append(root);
    announce('Saved');
    mock.timers.tick(ANNOUNCE_DELAY_MS);
    assert.equal(regions(doc).length, 1);
    assert.equal(live(doc, 'polite').textContent, 'Saved');
  });
});
