import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { DescriptionList, DescriptionListItem } from "../dist/modules/index.js";

test("a dl of div rows, each a dt term (with its icon hidden) and a dd value", () => {
  const html = render(h(DescriptionList, null, h(DescriptionListItem, { term: "Owner", icon: h("svg") }, "David Tee")));
  assert.equal(html, '<dl class="area-description-list area-description-list--columns"><div class="area-description-list__item">'
    + '<dt class="area-description-list__term"><span class="area-description-list__icon" aria-hidden="true"><svg></svg></span>Owner</dt>'
    + '<dd class="area-description-list__value">David Tee</dd></div></dl>');
});

test("layout, divided, framed and native props reach the list and its rows", () => {
  const html = render(h(DescriptionList, { layout: "justified", divided: true, framed: true, "aria-label": "Account" },
    h(DescriptionListItem, { term: "Plan", id: "plan", className: "extra" }, "Plus")));
  assert.match(html, /^<dl class="area-description-list area-description-list--justified area-description-list--divided area-description-list--framed" aria-label="Account">/);
  assert.match(html, /<div class="area-description-list__item extra" id="plan">/);
});
