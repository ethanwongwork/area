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

// Components audit V6 (2026-11-07): a delayed placeholder keeps its box, invisible, until its wait has passed.
test("Skeleton delay renders waiting in every shape, and the stylesheet hides it without moving it", async () => {
  const { readFileSync } = await import("node:fs");
  const shapes = [
    h(Skeleton, { delay: "short" }),
    h(Skeleton, { delay: "short", lines: 3 }),
    h(Skeleton, { delay: "short" }, h("span", null, "Value")),
  ];
  for (const element of shapes) assert.match(renderToString(element), /data-waiting=""/);
  assert.doesNotMatch(renderToString(h(Skeleton, null)), /data-waiting/);
  // Not loading: the children as they are, with no wait.
  assert.equal(renderToString(h(Skeleton, { delay: "long", loading: false }, h("span", null, "Value"))), "<span>Value</span>");
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8");
  assert.match(css, /\.area-skeleton\[data-waiting\],\s*\.area-skeleton__lines\[data-waiting\]\s*\{\s*opacity:\s*0;?\s*\}/);
  assert.match(css, /\.area-spinner\[data-waiting\]\s*\{\s*opacity:\s*0;?\s*\}/);
  assert.ok(MANIFESTS.skeleton.states.includes("waiting"));
});
