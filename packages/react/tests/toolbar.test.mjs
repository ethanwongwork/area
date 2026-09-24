import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Button, Toolbar, ToolbarGroup, ToolbarItem, ToolbarSeparator, ToolbarOverflow, MANIFESTS } from "../dist/modules/index.js";

test("Toolbar creates one entry stop while keeping native command buttons", () => {
  const html = renderToString(h(Toolbar, { "aria-label": "Arrange", variant: "surface" },
    h(ToolbarGroup, { "aria-label": "Alignment" },
      h(ToolbarItem, null, h(Button, { variant: "ghost", "aria-label": "Top" })),
      h(ToolbarItem, null, h(Button, { variant: "ghost", "aria-label": "Middle", disabled: true })),
    ),
    h(ToolbarSeparator),
    h(ToolbarOverflow, null, h(Button, { variant: "ghost" }, "Duplicate")),
  ));
  assert.match(html, /role="toolbar" aria-orientation="horizontal" tabindex="0"/);
  assert.equal((html.match(/data-area-toolbar-item=""/g) ?? []).length, 3);
  assert.match(html, /disabled="" aria-label="Middle"/);
  assert.match(html, /role="separator" aria-orientation="vertical"/);
  assert.match(html, /<details[^>]*area-toolbar__overflow/);
  assert.deepEqual(MANIFESTS.toolbar.variants.size, ["sm", "md", "lg"]);
});

test("Toolbar separator follows the toolbar orientation", () => {
  const html = renderToString(h(Toolbar, { orientation: "vertical", "aria-label": "Arrange" }, h(ToolbarSeparator)));
  assert.match(html, /role="toolbar" aria-orientation="vertical"/);
  assert.match(html, /role="separator" aria-orientation="horizontal"/);
});
