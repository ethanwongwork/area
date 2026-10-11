import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Citation } from "../dist/modules/index.js";

test("a citation is a new-tab link named by its source, title and how many more sources", () => {
  const html = render(h(Citation, { href: "https://example.com/a", label: "Example", title: "A page", icon: "https://example.com/favicon.ico", more: 2 }));
  assert.match(html, /<a class="area-citation" target="_blank" rel="noopener noreferrer" aria-label="Example: A page, 2 more sources" href="https:\/\/example.com\/a">/);
  assert.match(html, /<span class="area-citation__icon" aria-hidden="true"><img src="https:\/\/example.com\/favicon.ico" alt=""\/><\/span><span class="area-citation__label">Example<\/span><span class="area-citation__count" aria-hidden="true">\+2<\/span><\/a>$/);
});

test("no icon and no count when not given; one more source reads singular; aria-label wins", () => {
  const html = render(h(Citation, { href: "#", label: "Example", more: 1 }));
  assert.doesNotMatch(html, /area-citation__icon/);
  assert.match(html, /aria-label="Example, 1 more source"/);
  assert.match(render(h(Citation, { href: "#", label: "Example", "aria-label": "Source" })), /aria-label="Source"/);
});
