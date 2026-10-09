import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { ScrollArea } from "../dist/modules/index.js";

test("a focusable native scroller holding the children, with two hidden overlay bars", () => {
  const html = render(h(ScrollArea, { style: { blockSize: 200 } }, h("p", null, "Body")));
  assert.match(html, /^<div class="area-scroll-area area-scroll-area--hover" style="block-size:200px">/);
  assert.match(html, /<div tabindex="0" class="area-scroll-area__viewport"><div class="area-scroll-area__content"><p>Body<\/p><\/div><\/div>/);
  assert.match(html, /<div class="area-scroll-area__scrollbar" data-orientation="vertical" aria-hidden="true"><div class="area-scroll-area__thumb"><\/div><\/div>/);
  assert.match(html, /data-orientation="horizontal" aria-hidden="true"/);
  // Overflow is measured on the client; nothing claims it before then.
  assert.doesNotMatch(html, /data-overflow/);
});

test("type maps to a modifier; viewportProps name the scroller or drop its Tab stop", () => {
  const html = render(h(ScrollArea, { type: "always", viewportProps: { "aria-label": "Layers", tabIndex: -1, className: "extra" } }, "x"));
  assert.match(html, /area-scroll-area--always/);
  assert.match(html, /<div tabindex="-1" aria-label="Layers" class="area-scroll-area__viewport extra">/);
});
