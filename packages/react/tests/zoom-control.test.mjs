import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { ZoomControl } from "../dist/modules/index.js";

test("a ghost sm button showing the zoom as a percentage, named for it, opening a menu", () => {
  const html = render(h(ZoomControl, { defaultValue: 0.48 }));
  assert.match(html, /<button[^>]*class="area-button area-button--ghost area-button--neutral area-button--sm area-zoom-control"[^>]*>/);
  assert.match(html, /aria-label="Zoom 48%"/);
  assert.match(html, /aria-haspopup="menu"/);
  assert.match(html, /<span class="area-zoom-control__value">48%<\/span>/);
  assert.match(html, /data-area-glyph="chevron-down"/);
});

test("the menu: a zoom field, in and out, fit only when given, presets with the current one checked", () => {
  const html = render(h(ZoomControl, { defaultValue: 1, onZoomToFit: () => {} }));
  assert.match(html, /class="area-zoom-control__field"><div class="area-input area-input--soft area-input--sm area-input--full-width"><input class="area-input__control" aria-label="Zoom"/);
  for (const row of ["Zoom in", "Zoom out", "Zoom to fit", "Zoom to 50%", "Zoom to 100%", "Zoom to 200%"]) assert.ok(html.includes(row), row);
  assert.match(html, /role="menuitemradio" aria-checked="true"[^>]*>(?:(?!<\/button>).)*Zoom to 100%/);
  assert.doesNotMatch(render(h(ZoomControl, { defaultValue: 1 })), /Zoom to fit/);
});
