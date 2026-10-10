import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Toggletip, toggletipVariants } from "../dist/modules/index.js";

test("renders a named button that describes itself with the note, followed by the note's surface", () => {
  const html = render(h(Toggletip, { content: "Shown to everyone in the workspace." }));
  assert.match(html, /^<button type="button" class="area-toggletip area-toggletip--md" aria-label="More information"/);
  const id = html.match(/aria-describedby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`aria-expanded="false" aria-controls="${id}"`));
  assert.match(html, /<svg[^>]*data-area-glyph="info"/);
  assert.match(html, new RegExp(`<span class="area-tooltip area-tooltip--top area-toggletip__surface" id="${id}" popover="manual">Shown to everyone in the workspace.</span>$`));
});

test("help, sm and a subject label: the mark, the 12 glyph and the name change", () => {
  const html = render(h(Toggletip, { content: "x", icon: "help", size: "sm", label: "About sharing" }));
  assert.match(html, /class="area-toggletip area-toggletip--sm" aria-label="About sharing"/);
  assert.match(html, /data-area-glyph="help" data-area-glyph-size="12"/);
  assert.match(render(h(Toggletip, { content: "x", icon: "help" })), /aria-label="Help"/);
});

test("the dot is filled, the ring and stem are stroked", () => {
  const html = render(h(Toggletip, { content: "x" }));
  const paths = [...html.matchAll(/<path [^>]*>/g)].map(m => m[0]);
  assert.equal(paths.length, 3);
  assert.match(paths[2], /fill="currentColor" stroke="none"/);
  assert.match(paths[0], /fill="none" stroke="currentColor"/);
});

test("native props and the side reach their elements; variants reject unknown sizes", () => {
  const html = render(h(Toggletip, { content: "x", side: "bottom", id: "tip", "aria-describedby": "hint", disabled: true }));
  assert.match(html, /id="tip"/);
  assert.match(html, /disabled=""/);
  assert.match(html, /aria-describedby="hint [^"]+"/);
  assert.match(html, /area-tooltip--bottom area-toggletip__surface/);
  assert.throws(() => toggletipVariants({ size: "lg" }), /invalid size=lg/);
});
