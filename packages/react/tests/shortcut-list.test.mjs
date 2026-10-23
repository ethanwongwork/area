import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { ShortcutList, ShortcutListItem } from "../dist/modules/index.js";

test("a titled group names its list; each row is a dt and a dd of keycaps", () => {
  const html = render(h(ShortcutList, { title: "General" }, h(ShortcutListItem, { label: "Search", keys: ["cmd", "K"] })));
  assert.match(html, /^<section class="area-shortcut-list" aria-labelledby="([^"]+)-title"><h3 id="\1-title" class="area-shortcut-list__title">General<\/h3><dl class="area-shortcut-list__items">/);
  assert.match(html, /<div class="area-shortcut-list__item"><dt class="area-shortcut-list__label">Search<\/dt><dd class="area-shortcut-list__keys"><span class="area-kbd area-kbd--md area-kbd--default">/);
});

test("keys are keycaps (quiet is ignored), alternatives read with or, and a custom shortcut", () => {
  const quiet = render(h(ShortcutList, { quiet: true, "aria-label": "Shortcuts" },
    h(ShortcutListItem, { label: "Delete", keys: [["shift", "cmd", "Delete"], ["shift", "cmd", "Backspace"]] })));
  assert.match(quiet, /class="area-shortcut-list" aria-label="Shortcuts"/);
  assert.doesNotMatch(quiet, /area-shortcut-list__title/);
  assert.equal(quiet.match(/area-kbd--default/g)?.length, 2);
  assert.match(quiet, /<\/span><span class="area-sr-only">or<\/span><span class="area-kbd/);
  const custom = render(h(ShortcutList, null, h(ShortcutListItem, { label: "Home", shortcut: h("span", { className: "x" }, "G H") })));
  assert.match(custom, /<dd class="area-shortcut-list__keys"><span class="x">G H<\/span><\/dd>/);
});
