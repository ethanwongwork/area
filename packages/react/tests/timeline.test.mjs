import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Timeline, TimelineItem } from "../dist/modules/index.js";

test("an ordered list of items: a hidden dot mark, then one line of title, meta and time joined by hidden dots", () => {
  const html = render(h(Timeline, { "aria-label": "Activity" },
    h(TimelineItem, { title: "Published", time: "Oct 10", dateTime: "2026-10-10", meta: "David Tee" })));
  assert.equal(html, '<ol role="list" class="area-timeline" aria-label="Activity"><li class="area-timeline-item">'
    + '<span class="area-timeline-item__marker" aria-hidden="true"><span class="area-timeline-item__dot"></span></span>'
    + '<div class="area-timeline-item__content"><div class="area-timeline-item__line"><span class="area-timeline-item__title">Published</span>'
    + '<span class="area-timeline-item__meta"><span class="area-timeline-item__sep" aria-hidden="true">·</span>David Tee</span>'
    + '<span class="area-timeline-item__meta"><span class="area-timeline-item__sep" aria-hidden="true">·</span><time dateTime="2026-10-10">Oct 10</time></span>'
    + '</div></div></li></ol>');
});

test("icon and media marks, current, details and native props", () => {
  const icon = render(h(TimelineItem, { current: true, icon: h("svg"), title: "Current version", id: "current" }));
  assert.match(icon, /^<li aria-current="true" class="area-timeline-item area-timeline-item--current" id="current">/);
  assert.match(icon, /<span class="area-timeline-item__marker" aria-hidden="true"><span class="area-timeline-item__icon"><svg><\/svg><\/span><\/span>/);
  assert.doesNotMatch(icon, /__meta/);
  // Media stays exposed: an Avatar can carry its own name. A time without a title has no leading dot.
  const media = render(h(TimelineItem, { media: h("img", { alt: "David Tee" }), time: "Oct 9" }, "Moved the launch."));
  assert.match(media, /<span class="area-timeline-item__marker"><span class="area-timeline-item__media"><img alt="David Tee"\/><\/span><\/span>/);
  assert.match(media, /<div class="area-timeline-item__line"><span class="area-timeline-item__meta">Oct 9<\/span><\/div><div class="area-timeline-item__body">Moved the launch.<\/div>/);
});
