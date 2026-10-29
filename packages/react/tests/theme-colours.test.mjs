// Theme's colours (2026-10-27): exact page and accent colours from @area/tokens/colours on the scope, marked
// data-area-colours so the stylesheet re-derives every grey from them; the caller's own style over them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Theme } from "../dist/modules/index.js";
import { colourDeclarations } from "@area/tokens/colours";

test("picked colours land on the Theme's own element, marked data-area-colours", () => {
  const colours = colourDeclarations({ page: { light: "oklch(0.9634 0.012 255)", dark: "#101418" } });
  const html = renderToString(h(Theme, { colours }, "Label"));
  assert.match(html, /data-area-colours=""/);
  assert.match(html, /--area-ground-light:0\.9634/);
  assert.match(html, /--area-tint-chroma-light:0\.012/);
  assert.match(html, /--area-tint-hue-dark-same:0/);
});

test("the caller's style wins over the colours, a brand and colours both apply, and no colours writes nothing", () => {
  const colours = { "--area-ground-light": "0.95" };
  assert.match(renderToString(h(Theme, { colours, style: { "--area-ground-light": "0.97" } })), /--area-ground-light:0\.97/);
  const both = renderToString(h(Theme, { colours, brand: { "--area-accent-solid-full": "#123456" } }));
  assert.match(both, /data-area-brand=""/);
  assert.match(both, /data-area-colours=""/);
  const plain = renderToString(h(Theme, {}, "x"));
  assert.doesNotMatch(plain, /data-area-colours|style=/);
});
