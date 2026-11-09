import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h, createRef } from "react";
import { renderToString as render } from "react-dom/server";
import { Button, PageHeader } from "../dist/modules/index.js";

// Page header (components audit N1, 2026-11-07; docs/specs/page-header.md).
test("a header with an h1 title, md by default; parts that aren't given aren't drawn", () => {
  const html = render(h(PageHeader, { title: "Title" }));
  assert.equal(html, '<header class="area-page-header area-page-header--md"><h1 class="area-page-header__title">Title</h1></header>');
});

test("every slot in reading order: parent, title, actions, description, navigation", () => {
  const html = render(h(PageHeader, {
    title: "Title", description: "Description", parent: h("a", { href: "#parent" }, "Parent"),
    actions: h(Button, null, "Action"), navigation: h("div", { role: "tablist" }),
  }));
  const order = ["__parent", "__title", "__actions", "__description", "__navigation"].map(part => html.indexOf(`area-page-header${part}`));
  assert.ok(order.every(at => at > 0), `a slot is missing: ${html}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "slots are out of reading order");
  assert.match(html, /<p class="area-page-header__description">Description<\/p>/);
});

test("size, titleAs, titleId, ref and native props reach their elements", () => {
  const ref = createRef();
  const html = render(h(PageHeader, { ref, title: "Title", size: "lg", titleAs: "h2", titleId: "page-title", id: "head", className: "extra" }));
  assert.match(html, /^<header class="area-page-header area-page-header--lg extra" id="head">/);
  assert.match(html, /<h2 class="area-page-header__title" id="page-title">Title<\/h2>/);
  assert.throws(() => render(h(PageHeader, { title: "Title", size: "xl" })), /invalid size=xl/);
});
