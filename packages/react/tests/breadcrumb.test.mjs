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
