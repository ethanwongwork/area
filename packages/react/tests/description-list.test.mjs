import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { DescriptionList, DescriptionListItem } from "../dist/modules/index.js";

test("a dl of div rows, each a dt term (with its icon hidden) and a dd value", () => {
  const html = render(h(DescriptionList, null, h(DescriptionListItem, { term: "Owner", icon: h("svg") }, "David Tee")));
  assert.equal(html, '<dl class="area-description-list area-description-list--columns"><div class="area-description-list__item">'
    + '<dt class="area-description-list__term"><span class="area-description-list__icon" aria-hidden="true"><svg></svg></span><span class="area-description-list__label">Owner</span></dt>'
    + '<dd class="area-description-list__value">David Tee</dd></div></dl>');
});

test("layout, divided, framed and native props reach the list and its rows", () => {
  const html = render(h(DescriptionList, { layout: "justified", divided: true, framed: true, "aria-label": "Account" },
    h(DescriptionListItem, { term: "Plan", id: "plan", className: "extra" }, "Plus")));
  assert.match(html, /^<dl class="area-description-list area-description-list--justified area-description-list--divided area-description-list--framed" aria-label="Account">/);
  assert.match(html, /<div class="area-description-list__item extra" id="plan">/);
});

test("visibleCount hides the rest behind a Show N more button after the list; expanded flips the label", async () => {
  const { DescriptionList: DL, DescriptionListItem: Item } = await import("../dist/modules/index.js");
  const rows = ["A", "B", "C", "D"].map(t => h(Item, { key: t, term: t }, t));
  const html = render(h(DL, { visibleCount: 2, id: "props" }, rows));
  assert.match(html, /^<dl id="props" class="area-description-list area-description-list--columns">/);
  assert.equal((html.match(/<div class="area-description-list__item" hidden="">/g) || []).length, 2);
  assert.match(html, /<\/dl><button type="button" class="area-description-list__more" aria-expanded="false" aria-controls="props">/);
  assert.match(html, /<span class="area-description-list__more-label">Show 2 more<\/span><\/button>$/);
  const open = render(h(DL, { visibleCount: 2, defaultExpanded: true, lessLabel: "Fewer" }, rows));
  assert.doesNotMatch(open, /hidden=""/);
  assert.match(open, /aria-expanded="true"[^>]*>.*Fewer<\/span><\/button>$/);
  assert.doesNotMatch(render(h(DL, { visibleCount: 4 }, rows)), /__more/);
});
