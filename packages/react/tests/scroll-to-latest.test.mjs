import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { ScrollToLatest, MANIFESTS } from "../dist/modules/index.js";

// packages/react/src/components/ScrollToLatest.tsx:19-40: visibility starts false; effects only run in a browser.
test("ScrollToLatest starts hidden from accessibility and out of the tab sequence", () => {
  const html = renderToString(h(ScrollToLatest, { scrollRef: { current: null } }));
  assert.match(html, /^<div class="area-scroll-to-latest">/);
  assert.doesNotMatch(html, /data-visible/);
  const button = html.match(/<button[^>]*>/)[0];
  for (const attr of ['type="button"', 'aria-label="Scroll to latest"', 'tabindex="-1"', 'aria-hidden="true"']) assert.ok(button.includes(attr));
  assert.match(html, /area-button--outline/);
  assert.match(html, /area-button--pill/);
  assert.match(html, /data-area-glyph="arrow-up"/);
});

// packages/react/src/components/ScrollToLatest.tsx:38-40: native div passthrough, customizable button name.
test("ScrollToLatest preserves caller props and custom button label", () => {
  const html = renderToString(h(ScrollToLatest, { scrollRef: { current: null }, id: "latest", className: "custom", "aria-describedby": "help", "aria-label": "Conversation navigation", label: "Jump to newest" }));
  assert.match(html, /^<div class="area-scroll-to-latest custom" id="latest" aria-describedby="help" aria-label="Conversation navigation">/);
  assert.match(html, /<button[^>]*aria-label="Jump to newest"/);
});
