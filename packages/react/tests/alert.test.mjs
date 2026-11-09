import { test } from "node:test";
import assert from "node:assert/strict";
import { Fragment, createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Alert, MANIFESTS } from "../dist/modules/index.js";

const render = props => renderToString(h(Alert, props, "Details"));

test("uses a polite status region by default and reserves alert interruptions for danger", () => {
  assert.match(render({}), /role="status"/);
  assert.match(render({ tone: "danger" }), /role="alert"/);
});

test("only renders a separately named dismiss button when the parent opts in", () => {
  assert.doesNotMatch(render({}), /area-alert__dismiss/);
  const html = render({ onDismiss: () => {}, dismissLabel: "Dismiss notice" });
  assert.match(html, /type="button"/);
  assert.match(html, /area-alert__dismiss/);
  assert.match(html, /aria-label="Dismiss notice"/);
  assert.match(html, /<path/);
});

test("keeps action content and all semantic tones in the public contract", () => {
  const html = render({ action: h("a", { href: "#review" }, "Review") });
  assert.match(html, /area-alert__actions/);
  assert.match(html, /href="#review"/);
  // Button's and Badge's seven tones, in their order (components audit 2026-11-07, O4).
  assert.deepEqual(MANIFESTS.alert.variants.tone, MANIFESTS.button.variants.tone);
  assert.deepEqual(MANIFESTS.alert.variants.tone, ["neutral", "info", "success", "warning", "caution", "danger", "discovery"]);
  assert.deepEqual(MANIFESTS.alert.variants.layout, ["single-line", "multiline", "banner"]);
  assert.match(render({}), /area-alert--single-line/);
  assert.match(render({ layout: "multiline" }), /area-alert--multiline/);
});

test("multiple actions remain single-line until the multiline layout is explicit", () => {
  const html = render({ action: h(Fragment, null, h("button", null, "Later"), h("button", null, "Review")) });
  assert.match(html, /area-alert--single-line/);
});

test("keeps an optional text link inline with the body copy", () => {
  const html = render({ link: h("a", { href: "#details" }, "Text link") });
  assert.match(html, /area-alert__description[^>]*>Details<span class="area-alert__link">/);
  assert.match(html, /href="#details"/);
});

test("banner ends the row with its link, and flush is a boolean modifier", () => {
  const html = renderToString(h(Alert, { layout: "banner", flush: true, title: "Title", link: h("a", { href: "#" }, "Learn more") }, "Body"));
  assert.match(html, /area-alert--banner/);
  assert.match(html, /area-alert--flush/);
  // The link is the content's sibling, not inside the description.
  assert.match(html, /<\/div><\/div><span class="area-alert__link">/);
  assert.doesNotMatch(renderToString(h(Alert, { title: "Title" }, "Body")), /area-alert--flush/);
});

test("caution and discovery are Alert tones; actions is the slot, action its deprecated alias (components audit O4, O7)", () => {
  for (const tone of ["caution", "discovery"]) {
    const html = renderToString(h(Alert, { tone, title: "Heading" }, "Body text"));
    assert.match(html, new RegExp(`class="area-alert area-alert--${tone} area-alert--single-line"`));
    assert.match(html, /role="status"/);
  }
  assert.match(renderToString(h(Alert, { actions: h("button", null, "Action") }, "Body text")), /<div class="area-alert__actions"><button>Action<\/button><\/div>/);
  assert.match(renderToString(h(Alert, { action: h("button", null, "Action") }, "Body text")), /<div class="area-alert__actions"><button>Action<\/button><\/div>/);
  // actions wins over the alias.
  assert.doesNotMatch(renderToString(h(Alert, { actions: "New", action: "Old" }, "Body text")), /Old/);
});
