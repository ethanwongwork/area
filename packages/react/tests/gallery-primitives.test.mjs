import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { CodeBlock, Dialog, Skeleton, MANIFESTS } from "../dist/modules/index.js";

test("code block preserves plain-text escaping and supports a separate action header", () => {
  const html = renderToString(h(CodeBlock, { title: "example.ts", code: "<example>", actions: h("button", null, "Copy"), layout: "wrap" }));
  assert.match(html, /area-code-block__header/);
  assert.match(html, /area-code-block--wrap/);
  assert.match(html, /&lt;example&gt;/);
  assert.doesNotMatch(html, /area-code-block__actions/);
});

test("skeleton exposes distinct rectangle and rounded shapes", () => {
  assert.deepEqual(MANIFESTS.skeleton.variants.shape, ["text", "circle", "rectangle", "rounded"]);
  assert.match(renderToString(h(Skeleton, { shape: "rounded" })), /area-skeleton--rounded/);
  assert.match(renderToString(h(Skeleton)), /aria-hidden="true"/);
});

test("dialog surface can compose inside a native modal without duplicate dialog semantics", () => {
  const html = renderToString(h(Dialog, { role: "group", "aria-modal": undefined, title: "Title", description: "Description", footer: h("button", null, "Close") }, "Body"));
  assert.match(html, /role="group"/);
  assert.doesNotMatch(html, /aria-modal/);
  for (const part of ["title", "description", "body", "footer"]) assert.match(html, new RegExp(`area-dialog__${part}`));
});
