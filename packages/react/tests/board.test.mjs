import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Board, BoardCard, BoardColumn } from "../dist/modules/index.js";

test("a column is a section named by its Tag title, with a count and a list of cards", () => {
  const html = render(h(Board, { "aria-label": "Tasks" }, h(BoardColumn, { title: "Work", tone: "discovery", count: 46 }, h(BoardCard, { href: "/a", title: "Design review" }))));
  assert.match(html, /^<div class="area-board" aria-label="Tasks"><section class="area-board-column area-board-column--discovery" aria-labelledby="([^"]+)-title"><div class="area-board-column__header"><span class="area-tag area-tag--discovery[^"]*" id="\1-title">/);
  assert.match(html, /<span class="area-count[^"]*"[^>]*>46/);
  assert.match(html, /<ul class="area-board-column__cards"><li class="area-board-card"><div class="area-board-card__heading"><a class="area-board-card__title" href="\/a">Design review<\/a><\/div><\/li><\/ul>/);
});

test("a plain title, card icon, properties and actions", () => {
  const html = render(h(BoardColumn, { title: "No status", plainTitle: true },
    h(BoardCard, { href: "/b", title: "Plan", icon: h("svg"), actions: h("button", null, "More") }, h("span", null, "Oct 14"))));
  assert.match(html, /<span id="[^"]+-title" class="area-board-column__title">No status<\/span>/);
  assert.doesNotMatch(html, /area-count/);
  assert.match(html, /<span class="area-board-card__icon" aria-hidden="true"><svg><\/svg><\/span>/);
  assert.match(html, /<div class="area-board-card__properties"><span>Oct 14<\/span><\/div><div class="area-board-card__actions"><button>More<\/button><\/div>/);
});
