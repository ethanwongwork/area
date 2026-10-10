import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Button, EmptyState } from "../dist/modules/index.js";

test("an icon tile, a heading and a muted line, md by default", () => {
  const html = render(h(EmptyState, { icon: h("svg"), title: "Trash is empty", description: "Pages you delete stay here." }));
  assert.equal(html, '<div class="area-empty-state area-empty-state--md"><span class="area-empty-state__icon" aria-hidden="true"><svg></svg></span>'
    + '<div class="area-empty-state__content"><h2 class="area-empty-state__title">Trash is empty</h2><p class="area-empty-state__description">Pages you delete stay here.</p></div></div>');
});

test("size, titleAs, actions and native props reach their elements", () => {
  const html = render(h(EmptyState, { size: "sm", titleAs: "h3", title: "No results", actions: h(Button, null, "Clear filters"), id: "empty", role: "status", className: "extra" }));
  assert.match(html, /^<div class="area-empty-state area-empty-state--sm extra" id="empty" role="status">/);
  assert.match(html, /<h3 class="area-empty-state__title">No results<\/h3>/);
  assert.match(html, /<div class="area-empty-state__actions"><button[^>]*>.*Clear filters.*<\/button><\/div><\/div>$/);
});

test("parts that are not given are not drawn", () => {
  const html = render(h(EmptyState, { title: "No favorites yet" }));
  assert.doesNotMatch(html, /__icon|__description|__actions/);
});
