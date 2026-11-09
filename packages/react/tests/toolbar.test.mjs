import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Button, MenuItem, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSeparator, ToolbarOverflow, MANIFESTS } from "../dist/modules/index.js";

test("Toolbar creates one entry stop while keeping native command buttons", () => {
  const html = renderToString(h(Toolbar, { "aria-label": "Arrange", variant: "surface" },
    h(ToolbarGroup, { "aria-label": "Alignment" },
      h(ToolbarItem, null, h(Button, { variant: "ghost", "aria-label": "Top" })),
      h(ToolbarItem, null, h(Button, { variant: "ghost", "aria-label": "Middle", disabled: true })),
    ),
    h(ToolbarSeparator),
    h(ToolbarOverflow, null, h(MenuItem, null, "Duplicate")),
  ));
  assert.match(html, /role="toolbar" aria-orientation="horizontal" tabindex="0"/);
  assert.equal((html.match(/data-area-toolbar-item=""/g) ?? []).length, 3);
  assert.match(html, /disabled="" aria-label="Middle"/);
  assert.match(html, /role="separator" aria-orientation="vertical"/);
  // Overflow is a ghost icon Button that opens a Menu (audit S16, A-8).
  assert.match(html, /<button[^>]*class="area-button area-button--ghost[^"]*area-button--icon-only[^"]*"[^>]*aria-label="More actions"[^>]*aria-haspopup="menu"|aria-haspopup="menu"[^>]*aria-label="More actions"/);
  assert.match(html, /data-area-glyph="more"/);
  assert.match(html, /class="area-scroll-area area-scroll-area--hover area-menu" role="menu"[^>]*popover="auto"/);
  assert.deepEqual(MANIFESTS.toolbar.variants.size, ["sm", "md", "lg"]);
});

test("Toolbar separator follows the toolbar orientation", () => {
  const html = renderToString(h(Toolbar, { orientation: "vertical", "aria-label": "Arrange" }, h(ToolbarSeparator)));
  assert.match(html, /role="toolbar" aria-orientation="vertical"/);
  assert.match(html, /role="separator" aria-orientation="horizontal"/);
});

// floating: the hover action bar (components audit N14, 2026-11-07; docs/specs/toolbar.md).
test("a floating Toolbar is the hover action bar: still one Tab stop, over its parent's corner, shown on hover or focus", async () => {
  const { readFileSync } = await import("node:fs");
  const html = renderToString(h(Toolbar, { floating: true, size: "sm", variant: "surface", "aria-label": "Item one actions" },
    h(ToolbarItem, null, h(Button, { variant: "ghost" }, "Open"))));
  assert.match(html, /role="toolbar" aria-orientation="horizontal" tabindex="0" class="area-toolbar area-toolbar--surface area-toolbar--sm area-toolbar--horizontal area-toolbar--floating"/);
  assert.ok(MANIFESTS.toolbar.booleans.includes("floating"));
  const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const body = selector => [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].find(([, s]) => s.trim().replace(/\s+/g, " ") === selector)?.[2] ?? "";
  assert.match(body(".area-toolbar--floating"), /position:\s*absolute;[^}]*inset-block-start:\s*var\(--area-space-4\);[^}]*inset-inline-end:\s*var\(--area-space-4\)/);
  assert.match(body(":where(*):has(> .area-toolbar--floating)"), /position:\s*relative/);
  assert.match(body(".area-toolbar--floating.area-toolbar--surface"), /--_toolbar-inset:\s*var\(--area-space-2\)/);
  // Hidden with opacity, never display or visibility, so Tab still reaches it; focus inside the parent shows it.
  assert.doesNotMatch(css.match(/\.area-toolbar--floating[^{]*\{[^}]*\}/g).join(" "), /display:\s*none|visibility:\s*hidden/);
  assert.match(body(":is(:hover, :focus-within) > .area-toolbar--floating, .area-toolbar--floating:has([aria-expanded=\"true\"])"), /opacity:\s*1;\s*transition-duration:\s*0s/);
});
