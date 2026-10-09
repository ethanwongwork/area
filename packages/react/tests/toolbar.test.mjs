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
