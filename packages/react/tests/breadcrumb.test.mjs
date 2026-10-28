import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from "../dist/modules/index.js";

test("Breadcrumb exposes linked ancestors and one current page", () => {
  const html = renderToString(h(Breadcrumb, null, h(BreadcrumbList, null,
    h(BreadcrumbItem, null, h(BreadcrumbLink, { href: "/" }, "Home")),
    h(BreadcrumbSeparator),
    h(BreadcrumbItem, null, h(BreadcrumbPage, null, "Reports")),
  )));
  assert.match(html, /<nav[^>]*aria-label="Breadcrumb"/);
  assert.match(html, /<ol[^>]*area-breadcrumb__list/);
  assert.match(html, /<a[^>]*href="\/"[^>]*>Home<\/a>/);
  assert.match(html, /aria-current="page"/);
  assert.match(html, /role="presentation" aria-hidden="true"/);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
});

test("Breadcrumb labels an omitted section without making it a link", () => {
  const html = renderToString(h(BreadcrumbEllipsis));
  assert.match(html, /aria-label="More pages"/);
  assert.doesNotMatch(html, /<a\b/);
});

test("a collapsed trail with hidden pages is a menu button of links (audit D-19)", () => {
  const html = renderToString(h(BreadcrumbEllipsis, { items: [{ label: "Item two", href: "/two" }] }));
  assert.match(html, /<button type="button" aria-label="More pages" class="area-breadcrumb__ellipsis"[^>]*aria-haspopup="menu" aria-expanded="false"/);
  assert.match(html, /<a role="menuitem" href="\/two" class="area-menu__item">/);
  // Area's More glyph, as Pagination's gap (visual pass, 2026-10-27: the typed "…" sat on the baseline).
  assert.match(renderToString(h(BreadcrumbEllipsis)), /^<span role="img" aria-label="More pages" class="area-breadcrumb__ellipsis"><svg[^>]*>/);
  assert.doesNotMatch(renderToString(h(BreadcrumbEllipsis)), /…/);
});

test("nowrap keeps the trail on one line (2026-10-25)", () => {
  const html = renderToString(h(Breadcrumb, { nowrap: true }, h(BreadcrumbList, null, h(BreadcrumbItem, null, h(BreadcrumbPage, null, "Reports")))));
  assert.match(html, /<nav[^>]*class="area-breadcrumb area-breadcrumb--nowrap"/);
  assert.doesNotMatch(renderToString(h(Breadcrumb)), /area-breadcrumb--nowrap/);
});
