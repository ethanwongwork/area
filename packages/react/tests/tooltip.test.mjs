import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Tooltip, MANIFESTS } from "../dist/modules/index.js";

for (const side of MANIFESTS.tooltip.variants.side) {
  // packages/styles/src/manifest.ts:579; packages/react/src/components/primitives.tsx:1007: side and arrow hooks.
  test(`Tooltip side=${side} renders its manifest hook`, () => {
    const html = renderToString(h(Tooltip, { side, arrow: true }, "Details"));
    const root = html.match(/<div[^>]*>/)[0];
    const classes = root.match(/class="([^"]+)"/)[1].split(" ");
    assert.ok(classes.includes(`area-tooltip--${side}`));
    assert.ok(classes.includes("area-tooltip--arrow"));
  });
}

// packages/react/src/components/primitives.tsx:1007-1015; docs/specs/tooltip.md:115: tooltip role, text and native surface attributes.
test("Tooltip inline usage retains text and caller surface attributes", () => {
  const html = renderToString(h(Tooltip, { id: "hint", className: "custom", "aria-label": "Save hint", "aria-describedby": "help" }, "Save changes"));
  assert.match(html, /^<div role="tooltip"/);
  for (const attr of ['id="hint"', 'aria-label="Save hint"', 'aria-describedby="help"']) assert.ok(html.includes(attr));
  assert.match(html, /class="[^"]* custom"/);
  assert.match(html, /><span class="area-tooltip__text">Save changes<\/span><\/div>$/);
  assert.doesNotMatch(html, /tabindex|area-tooltip--arrow/);
});

// packages/react/src/components/Overlays.tsx:220-240: tooltip appends its id to existing descriptions without changing button name or expanded state.
test("Tooltip describes its native trigger and keeps its own manual popover", () => {
  const html = renderToString(h(Tooltip, { className: "custom", trigger: h("button", { id: "save", disabled: true, "aria-label": "Save", "aria-describedby": "help" }, "Save") }, "Save changes"));
  const trigger = html.match(/<button[^>]*>/)[0];
  const tooltip = html.match(/<div role="tooltip"[^>]*>/)[0];
  const target = tooltip.match(/ id="([^"]+)"/)[1];
  for (const attr of ['id="save"', 'disabled=""', 'aria-label="Save"', `aria-describedby="help ${target}"`]) assert.ok(trigger.includes(attr));
  assert.match(tooltip, /popover="manual"/);
  assert.match(tooltip, /class="[^"]* custom"/);
  assert.doesNotMatch(trigger, /aria-expanded|aria-haspopup/);
  assert.doesNotMatch(tooltip, /tabindex/);
});

test("Tooltip preserves a caller-provided surface id with a trigger", () => {
  const html = renderToString(h(Tooltip, { id: "caller-surface", "aria-label": "Details", trigger: h("button", null, "Details") }, "Details"));
  const surface = html.match(/<div[^>]*role="tooltip"[^>]*>/)[0];
  assert.match(surface, / id="caller-surface"/);
  assert.match(html.match(/<button[^>]*>/)[0], /aria-describedby="caller-surface"/);
});

// packages/react/src/components/Overlays.tsx (AnchoredTooltip) and surface.css (`[data-passthrough]`); docs/specs/tooltip.md,
// 2026-10-31: a name-only tooltip lets the pointer through, so it never covers and catches the next control in a bar.
test("Tooltip that repeats its trigger's name lets the pointer through; one that describes stays hoverable", () => {
  const named = renderToString(h(Tooltip, { describes: false, trigger: h("button", { "aria-label": "Search" }) }, "Search"));
  assert.match(named.match(/<div role="tooltip"[^>]*>/)[0], /data-passthrough=""/);
  const describing = renderToString(h(Tooltip, { trigger: h("button", null, "Save") }, "Saves to the Library"));
  assert.doesNotMatch(describing.match(/<div role="tooltip"[^>]*>/)[0], /data-passthrough/);
});

test("Tooltip's passthrough is styled: no pointer events on a name-only surface", async () => {
  const { readFile } = await import("node:fs/promises");
  const css = await readFile(new URL("../../styles/src/components/overlay.css", import.meta.url), "utf8");
  assert.match(css, /\.area-tooltip\[popover\]\[data-passthrough\]\s*\{\s*pointer-events:\s*none;/);
});

// Overlays.tsx: while open, a pointer move off the trigger and tooltip, the pointer leaving the window, the window's blur
// and a hidden page close it; a focus that only returns to the window shows nothing (2026-10-31, "tooltips ... get stuck").
test("Tooltip closes on every sign the pointer or window has gone, and ignores a returning focus", async () => {
  const { readFile } = await import("node:fs/promises");
  const source = await readFile(new URL("../src/components/Overlays.tsx", import.meta.url), "utf8");
  const body = source.slice(source.indexOf("export function AnchoredTooltip"), source.indexOf("/* --- Toggletip"));
  for (const listener of ['addEventListener("pointermove"', 'addEventListener("mouseout"', 'addEventListener("blur"', 'addEventListener("visibilitychange"']) assert.ok(body.includes(listener), listener);
  assert.match(body, /returning === event\.currentTarget/);
  assert.match(body, /expanded\(event\.currentTarget/);
});
