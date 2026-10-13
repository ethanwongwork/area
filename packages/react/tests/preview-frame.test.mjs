import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { PreviewFrame } from "../dist/modules/index.js";

test("a square surface frame by default; native props reach the root; content is a plain child", () => {
  const html = render(h(PreviewFrame, { id: "p" }, h("img", { src: "/a.png", alt: "Pixels" })));
  assert.match(html, /<div class="area-preview-frame area-preview-frame--square area-preview-frame--surface" id="p"><img src="\/a.png" alt="Pixels"\/><\/div>$/);
});

test("a label names it as one image; a colour paints a layer over the checker", () => {
  const html = render(h(PreviewFrame, { aspect: "wide", color: "red", label: "Red" }));
  assert.match(html, /^<div class="area-preview-frame area-preview-frame--wide area-preview-frame--surface" role="img" aria-label="Red" style="--_color:red">/);
  assert.match(html, /<span class="area-preview-frame__paint"><\/span><\/div>$/);
});

test("grounds: subtle and checker", () => {
  assert.match(render(h(PreviewFrame, { ground: "subtle" })), /area-preview-frame--subtle/);
  assert.match(render(h(PreviewFrame, { ground: "checker" })), /area-preview-frame--checker/);
});
