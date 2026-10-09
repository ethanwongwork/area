import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Pagination, paginationRange } from "../dist/modules/index.js";

test("the range keeps seven items and shows a page instead of a one-page gap", () => {
  assert.deepEqual(paginationRange(5, 10), [1, "ellipsis-start", 4, 5, 6, "ellipsis-end", 10]);
  assert.deepEqual(paginationRange(1, 10), [1, 2, 3, 4, 5, "ellipsis-end", 10]);
  assert.deepEqual(paginationRange(4, 10), [1, 2, 3, 4, 5, "ellipsis-end", 10]);
  assert.deepEqual(paginationRange(10, 10), [1, "ellipsis-start", 6, 7, 8, 9, 10]);
  assert.deepEqual(paginationRange(3, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(paginationRange(1, 1), [1]);
  for (let page = 1; page <= 30; page++) assert.equal(paginationRange(page, 30).length, 7);
  assert.equal(paginationRange(15, 30, 2, 2).length, 11);
});

test("a navigation landmark of page buttons with one current page", () => {
  const html = render(h(Pagination, { pageCount: 10, defaultPage: 5 }));
  assert.match(html, /^<nav aria-label="Pagination" class="area-pagination area-pagination--pages area-pagination--md">/);
  assert.match(html, /<ul class="area-pagination__list">/);
  assert.equal((html.match(/aria-current="page"/g) ?? []).length, 1);
  assert.match(html, /<button class="area-pagination__page" aria-label="Page 5" aria-current="page" type="button">5<\/button>/);
  assert.equal((html.match(/area-pagination__ellipsis/g) ?? []).length, 2);
  assert.match(html, /<li class="area-pagination__item" aria-hidden="true">/);
});

test("steps are ghost Buttons; at an end the step stays focusable but unavailable", () => {
  const html = render(h(Pagination, { pageCount: 10, defaultPage: 1 }));
  assert.match(html, /class="area-button area-button--ghost area-button--neutral area-button--md area-pagination__step" aria-disabled="true" data-disabled="" type="button"><span class="area-button__icon"/);
  assert.doesNotMatch(html, /\sdisabled=""/);
  assert.match(html, /<span class="area-button__label">Previous<\/span>/);
  assert.match(html, /<span class="area-button__label">Next<\/span><span class="area-button__icon"/);
});

test("compact shows the status between chevron-only steps", () => {
  const html = render(h(Pagination, { layout: "compact", pageCount: 10, defaultPage: 2, size: "sm" }));
  assert.match(html, /area-pagination--compact area-pagination--sm/);
  assert.match(html, /area-button--sm area-button--icon-only/);
  assert.match(html, /<span class="area-sr-only">Previous<\/span>/);
  assert.match(html, /aria-live="polite"><span>Page <span class="area-pagination__value">2<\/span> of <span class="area-pagination__value">10<\/span>/);
  assert.doesNotMatch(html, /area-pagination__page/);
});

test("getHref makes every item a link; the disabled step has no address", () => {
  const html = render(h(Pagination, { pageCount: 3, page: 3, getHref: page => `/results?page=${page}` }));
  assert.match(html, /<a class="area-pagination__page" aria-label="Page 2" href="\/results\?page=2">2<\/a>/);
  assert.match(html, /<a class="area-pagination__page" aria-label="Page 3" aria-current="page" href="\/results\?page=3">3<\/a>/);
  assert.match(html, /rel="prev"/);
  assert.match(html, /<a class="[^"]*area-pagination__step" aria-disabled="true" data-disabled="" rel="next">/);
});

test("labels rename the landmark, the steps and the pages; the page is clamped to the count", () => {
  const html = render(h(Pagination, { pageCount: 4, page: 9, labels: { nav: "Results pages", previous: "Back", next: "Forward", page: n => `Go to page ${n}` } }));
  assert.match(html, /aria-label="Results pages"/);
  assert.match(html, />Back</);
  assert.match(html, />Forward</);
  assert.match(html, /aria-label="Go to page 4" aria-current="page"/);
});
