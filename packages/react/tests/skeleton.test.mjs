import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { MANIFESTS, Skeleton } from "../dist/modules/index.js";

test("is decorative, a block by default, and can be still", () => {
  const html = renderToString(h(Skeleton));
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /area-skeleton--block/);
  assert.deepEqual(MANIFESTS.skeleton.variants.shape, ["block", "text", "circle"]);
  assert.match(renderToString(h(Skeleton, { lines: 1 })), /area-skeleton--text/);
  assert.match(renderToString(h(Skeleton, { animated: false })), /area-skeleton--static/);
  assert.deepEqual(MANIFESTS.skeleton.booleans, ["static", "wrap"]);
});

test("lines renders one text bar per line in a paragraph wrapper", () => {
  const html = renderToString(h(Skeleton, { lines: 3 }));
  assert.match(html, /^<div aria-hidden="true" class="area-skeleton__lines"/);
  assert.equal(html.match(/area-skeleton--text/g).length, 3);
});

test("wraps children inert while loading and renders them plainly after", () => {
  const loading = renderToString(h(Skeleton, null, h("button", null, "Action")));
  assert.match(loading, /area-skeleton--wrap/);
  assert.match(loading, /inert=""/);
  assert.match(loading, /<button>Action<\/button>/);
  assert.equal(renderToString(h(Skeleton, { loading: false }, h("button", null, "Action"))), "<button>Action</button>");
});
