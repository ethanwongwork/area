import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { CodeBlock, MANIFESTS } from "../dist/modules/index.js";

// packages/styles/src/manifest.ts:645-648; packages/react/src/components/primitives.tsx:1681-1742: header, semantic code, boolean hooks and live copy feedback.
test("CodeBlock renders named actions, header, code rows and native root props", () => {
  const html = renderToString(h(CodeBlock, { code: "one\n<b>", title: "example.ts", language: "ts", id: "sample", className: "custom", "aria-label": "Example", "aria-describedby": "help", flush: true, wrap: true, lineNumbers: false, copyLabel: "Copy example", actions: h("button", { "aria-label": "Run example", disabled: true }, "Run") }));
  const root = html.match(/<div[^>]*>/)[0];
  for (const attr of ['id="sample"', 'aria-label="Example"', 'aria-describedby="help"']) assert.ok(root.includes(attr));
  assert.match(root, /class="[^"]* custom"/);
  for (const flag of MANIFESTS.codeBlock.booleans) assert.ok(root.includes(`area-code-block--${flag}`));
  assert.match(html, /area-code-block__header"><span class="area-code-block__title">example.ts<\/span><span class="area-code-block__language">ts<\/span><span class="area-code-block__actions">/);
  assert.match(html, /<button aria-label="Run example" disabled="">/);
  assert.match(html, /<button[^>]*aria-label="Copy example"/);
  // Without a tab panel the scrolling <pre> is itself a named, focusable region (spec: audit G-21).
  const pre = html.match(/<pre class="area-code-block__pre"[^>]*>/)[0];
  assert.ok(pre.includes('tabindex="0"'), pre);
  assert.ok(pre.includes('aria-label="example.ts"'), pre);
  assert.match(html, /<pre class="area-code-block__pre"[^>]*><code class="area-code-block__code">/);
  assert.equal((html.match(/class="area-code-block__line"/g) ?? []).length, 2);
  assert.match(html, /&lt;b&gt;/);
  assert.doesNotMatch(html, /area-code-block__gutter/);
  assert.match(html, /aria-live="polite"><\/span>/);
});

// packages/react/src/components/primitives.tsx:1615-1662,1689-1696: named native select or linked ARIA tablist/tabpanel.
test("CodeBlock language usages expose selected values and connected tabs", () => {
  const props = { code: "one", languages: ["ts", "css"], value: "css" };
  const select = renderToString(h(CodeBlock, props));
  assert.match(select, /<select[^>]*aria-label="Language"/);
  assert.match(select, /<option value="css" selected="">css<\/option>/);
  const html = renderToString(h(CodeBlock, { ...props, languageTabs: true }));
  assert.match(html, /role="tablist" aria-label="Language"/);
  const tabs = html.match(/<button[^>]*role="tab"[^>]*>/g);
  assert.equal(tabs.length, 2);
  const panel = html.match(/<div[^>]*role="tabpanel"[^>]*>/)[0];
  const panelId = panel.match(/ id="([^"]+)"/)[1];
  tabs.forEach((tab, i) => {
    assert.ok(tab.includes(`aria-selected="${i === 1}"`));
    assert.ok(tab.includes(`tabindex="${i === 1 ? 0 : -1}"`));
    assert.ok(tab.includes(`aria-controls="${panelId}"`));
  });
  assert.ok(panel.includes(`aria-labelledby="${tabs[1].match(/ id="([^"]+)"/)[1]}"`));
});

// packages/react/src/components/primitives.tsx:1705-1738: line targets, diff markers, highlights and expanded disclosure.
test("CodeBlock supports line references, marks and both disclosure states", () => {
  for (const defaultCollapsed of [false, true]) {
    const html = renderToString(h(CodeBlock, { code: "one\ntwo\nthree", linkLines: true, highlightLines: "2-3", marks: { 1: "removed", 3: "added" }, collapsible: true, defaultCollapsed, copyable: false }));
    const links = [...html.matchAll(/href="#([^"]+)" aria-label="Line (\d)"/g)];
    assert.equal(links.length, 3);
    for (const [, id] of links) assert.ok(html.includes(`id="${id}"`));
    assert.equal((html.match(/area-code-block__line--highlighted/g) ?? []).length, 2);
    assert.match(html, /area-code-block__line--removed/);
    assert.match(html, /area-code-block__line--added/);
    assert.match(html, /area-code-block__marker">-<\/span>/);
    assert.match(html, /area-code-block__marker">\+<\/span>/);
    // The visible label carries the state, with aria-controls and no aria-expanded (docs/specs/code-block.md).
    const toggle = html.match(/<button[^>]*class="area-code-block__toggle"[^>]*>([^<]*)<\/button>/);
    assert.ok(toggle, html);
    assert.equal(toggle[1], `${defaultCollapsed ? "Show" : "Hide"} code`);
    const codeId = html.match(/<pre class="area-code-block__pre" id="([^"]+)"/)[1];
    assert.ok(toggle[0].includes(`aria-controls="${codeId}"`), toggle[0]);
    assert.doesNotMatch(toggle[0], /aria-expanded/);
    assert.equal(html.includes('data-collapsed=""'), defaultCollapsed);
    assert.doesNotMatch(html, /aria-label="Copy code"/);
  }
});

// packages/react/src/components/primitives.tsx:1512,1587,1722-1724: trusted highlighter markup is preserved in a per-line text slot.
test("CodeBlock supports trusted pre-highlighted lines and plain excerpts without header", () => {
  const highlighted = renderToString(h(CodeBlock, { html: '<b>const</b> x\n<i>next</i>', copyable: false }));
  assert.match(highlighted, /area-code-block__text"><b>const<\/b> x<\/span>/);
  assert.match(highlighted, /area-code-block__text"><i>next<\/i><\/span>/);
  assert.doesNotMatch(highlighted, /area-code-block__header|area-code-block__actions/);
});

test("with language tabs and linked lines, the tab panel stays in the Tab order so a keyboard can scroll the code", () => {
  const html = renderToString(h(CodeBlock, { code: "one", languages: ["ts", "js"], languageTabs: true, linkLines: true }));
  assert.match(html, /role="tabpanel"[^>]*tabindex="0"/);
});
