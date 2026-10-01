import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Card, Chip, CodeBlock, Dialog, Skeleton, Slider, Switch, Table, NavItem, Toast, MANIFESTS } from "../dist/modules/index.js";

test("code block escapes plain text and gives every line a numbered row", () => {
  const html = renderToString(h(CodeBlock, { code: "const a = 1;\n\n<b>", flush: true }));
  assert.equal((html.match(/area-code-block__line\b/g) ?? []).length, 3);
  assert.equal((html.match(/area-code-block__gutter/g) ?? []).length, 3);
  assert.match(html, /&lt;b&gt;/);
  assert.match(html, /area-code-block--flush/);
});

test("a titled code block keeps its actions in the header, and floats them without a title", () => {
  const titled = renderToString(h(CodeBlock, { title: "example.ts", language: "ts", code: "const a = 1;" }));
  assert.match(titled, /area-code-block__header/);
  assert.match(titled, /area-code-block__title">example\.ts</);
  assert.match(titled, /area-code-block__language">ts</);
  assert.match(titled, /aria-label="Copy code"/);
  // Actions belong to the header row when there is one, and float over the code when not.
  const header = titled.slice(titled.indexOf("area-code-block__header"), titled.indexOf("area-code-block__body"));
  assert.match(header, /area-code-block__actions/);

  const plain = renderToString(h(CodeBlock, { code: "const a = 1;" }));
  assert.doesNotMatch(plain, /area-code-block__header/);
  assert.match(plain.slice(0, plain.indexOf("area-code-block__body")), /area-code-block__actions/);
});

test("highlight ranges and diff marks paint the lines they name", () => {
  const html = renderToString(h(CodeBlock, { code: "one\ntwo\nthree", highlightLines: "2-3", marks: { 1: "removed", 3: "added" } }));
  assert.equal((html.match(/area-code-block__line--highlighted/g) ?? []).length, 2);
  assert.match(html, /area-code-block__line--removed/);
  assert.match(html, /area-code-block__line--added/);
  assert.match(html, /area-code-block__marker">-</);
  assert.match(html, /area-code-block__marker">\+</);
});

test("referenced lines are anchors to their own row", () => {
  const html = renderToString(h(CodeBlock, { code: "one\ntwo", linkLines: true }));
  const targets = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
  assert.equal(targets.length, 2);
  for (const target of targets) assert.ok(html.includes(`id="${target}"`), `${target} has no matching row`);
  assert.match(html, /aria-label="Line 2"/);
});

test("a language switcher is a select, or a tablist with languageTabs", () => {
  const picker = renderToString(h(CodeBlock, { code: "one", languages: ["tsx", "css"] }));
  assert.match(picker, /<select[^>]*aria-label="Language"/);
  assert.match(picker, /<option value="css">css<\/option>/);

  const tabs = renderToString(h(CodeBlock, { code: "one", languages: ["tsx", "css"], languageTabs: true }));
  assert.match(tabs, /role="tablist"/);
  assert.equal((tabs.match(/role="tab"/g) ?? []).length, 2);
  assert.match(tabs, /role="tabpanel"/);
  assert.equal((tabs.match(/aria-selected="true"/g) ?? []).length, 1);
});

test("hidden line numbers, collapsing and copy stay independent", () => {
  const plain = renderToString(h(CodeBlock, { code: "one", lineNumbers: false, copyable: false }));
  assert.match(plain, /area-code-block--unnumbered/);
  assert.doesNotMatch(plain, /area-code-block__gutter/);
  assert.doesNotMatch(plain, /aria-label="Copy code"/);

  // A diff marker is not decoration: it survives hidden numbers, which is why the gutter
  // comes back for those two rows.
  const unnumberedDiff = renderToString(h(CodeBlock, { code: "one", lineNumbers: false, marks: { 1: "added" } }));
  assert.match(unnumberedDiff, /area-code-block__gutter/);
  assert.match(unnumberedDiff, /area-code-block__marker">\+</);
  assert.doesNotMatch(unnumberedDiff, /area-code-block__linenumber/);

  const collapsed = renderToString(h(CodeBlock, { code: "one", collapsible: true, defaultCollapsed: true }));
  assert.match(collapsed, /data-collapsed=""/);
  assert.match(collapsed, /aria-expanded="false"/);
  assert.match(collapsed, /Show code/);
});

test("independent code block options can be combined", () => {
  const html = renderToString(h(CodeBlock, { flush: true, wrap: true, code: "Long line" }));
  assert.match(html, /area-code-block--flush/);
  assert.match(html, /area-code-block--wrap/);
});

test("renamed variant axes retain their corresponding component classes", () => {
  assert.match(renderToString(h(Card, { layout: "horizontal" })), /area-card--horizontal/);
  assert.match(renderToString(h(Card, { layout: "list" })), /area-card--list/);
  // The old name is a deprecated alias (audit S17).
  assert.match(renderToString(h(Card, { layout: "compact" })), /area-card--list/);
  assert.match(renderToString(h(Chip, { kind: "assist" }, "Search")), /area-chip--assist/);
  assert.match(renderToString(h(Slider, { labelPosition: "top", "aria-label": "Volume" })), /area-slider--top/);
  assert.match(renderToString(h(Switch, { labelPosition: "start", label: "Sync" })), /area-switch--start/);
  assert.match(renderToString(h(Table, { interactive: true }, h("tbody"))), /area-table--interactive/);
});

test("skeleton exposes block, text and circle shapes (owner, 2026-09-28: option A)", () => {
  assert.deepEqual(MANIFESTS.skeleton.variants.shape, ["block", "text", "circle"]);
  assert.match(renderToString(h(Skeleton, { shape: "circle" })), /area-skeleton--circle/);
  assert.match(renderToString(h(Skeleton)), /aria-hidden="true"/);
});

test("dialog surface can compose inside a native modal without duplicate dialog semantics", () => {
  const html = renderToString(h(Dialog, { role: "group", "aria-modal": undefined, title: "Title", description: "Description", footer: h("button", null, "Close") }, "Body"));
  assert.match(html, /role="group"/);
  assert.doesNotMatch(html, /aria-modal/);
  for (const part of ["heading", "title", "description", "close", "body", "footer"]) assert.match(html, new RegExp(`area-dialog__${part}`));
  assert.match(html, /aria-labelledby="([^"]+)-title"/);
  assert.match(html, /aria-describedby="([^"]+)-description"/);
  assert.match(html, /aria-label="Close dialog"/);
  const withoutClose = renderToString(h(Dialog, { title: "Title", showCloseButton: false }));
  assert.doesNotMatch(withoutClose, /area-dialog__close/);
});

test("navigation actions stay outside the destination link", () => {
  const html = renderToString(h(NavItem, { href: "/projects", actions: h("button", { type: "button", "aria-label": "Expand projects" }, "Expand") }, "Projects"));
  assert.match(html, /<a[^>]*href="\/projects"/);
  assert.match(html, /<\/a><div class="area-nav__actions"><button/);
  assert.doesNotMatch(html, /<a[^>]*>[^]*<button[^]*<\/a>/);
});

test("toast announces content while leaving independent actions outside its live region", () => {
  const html = renderToString(h(Toast, { title: "Saved", onDismiss() {}, action: h("button", null, "Undo") }, "Project updated"));
  assert.match(html, /role="status" aria-atomic="true"/);
  assert.match(html, /Project updated<\/div><\/div><div class="area-toast__action">/);
  assert.match(html, /aria-label="Dismiss notification"/);
});
