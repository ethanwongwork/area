import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Board, BoardCard, BoardColumn } from "../dist/modules/index.js";

test("a column is a section named by its plain title, with a count Badge, actions and a list of cards", () => {
  const html = render(h(Board, { "aria-label": "Tasks" }, h(BoardColumn, { title: "Work", color: "purple", count: 46, actions: h("button", null, "More") }, h(BoardCard, { href: "/a", title: "Design review" }))));
  assert.match(html, /^<div class="area-board" aria-label="Tasks"><section class="area-board-column area-board-column--purple" aria-labelledby="([^"]+)-title"><div class="area-board-column__header"><span id="\1-title" class="area-board-column__title">Work<\/span>/);
  assert.match(html, /<span class="area-badge[^"]*area-board-column__count"[^>]*>(?:(?!<\/span>).)*46/);
  assert.match(html, /<div class="area-board-column__actions"><button>More<\/button><\/div>/);
  assert.match(html, /<ul class="area-board-column__cards"><li class="area-board-card"><div class="area-board-card__heading"><a class="area-board-card__title" href="\/a">Design review<\/a><\/div><\/li><\/ul>/);
  assert.doesNotMatch(html, /area-board-column__add/);
});

test("the add row with onAdd, neutral by default; card icon, properties and actions", () => {
  const html = render(h(BoardColumn, { title: "To do", onAdd: () => {} },
    h(BoardCard, { href: "/b", title: "Plan", icon: h("svg"), actions: h("button", null, "More") }, h("span", null, "Oct 14"))));
  assert.match(html, /class="area-board-column area-board-column--neutral"/);
  assert.match(html, /<div class="area-board-column__footer"><button type="button" class="area-board-column__add"><span class="area-board-column__add-icon" aria-hidden="true"><svg [^>]*data-area-glyph="add"/);
  assert.match(html, /<\/span>Add new<\/button><\/div><\/section>$/);
  assert.match(html, /<span class="area-board-card__icon" aria-hidden="true"><svg><\/svg><\/span>/);
  assert.match(html, /<div class="area-board-card__properties"><span>Oct 14<\/span><\/div><div class="area-board-card__actions"><button>More<\/button><\/div>/);
});
