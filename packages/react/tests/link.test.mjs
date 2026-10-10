import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { Link, linkVariants } from "../dist/modules/index.js";

test("defaults to an inline link in the surrounding ink, with native anchor props", () => {
  const html = render(h(Link, { href: "/guide", title: "Guide" }, "usage guide"));
  assert.equal(html, '<a class="area-link area-link--inline area-link--inherit" href="/guide" title="Guide">usage guide</a>');
});

test("variant and ink map to modifiers; linkVariants serves a router's own anchor", () => {
  assert.match(render(h(Link, { href: "#", variant: "standalone", ink: "muted" }, "x")), /class="area-link area-link--standalone area-link--muted"/);
  assert.equal(linkVariants({ ink: "action" }, "extra"), "area-link area-link--inline area-link--action extra");
  assert.throws(() => linkVariants({ ink: "accent" }), /invalid ink=accent/);
});

test("external opens a new tab safely, shows the mark and announces it", () => {
  const html = render(h(Link, { href: "https://example.com", external: true }, "Help"));
  assert.match(html, /target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /Help<span class="area-sr-only"> \(opens in a new tab\)<\/span><span class="area-link__icon" aria-hidden="true"><svg[^>]*data-area-glyph="open" data-area-glyph-size="12"/);
});

test("an explicit target or rel wins over external's defaults; the label is renamable", () => {
  const html = render(h(Link, { href: "/x", external: true, target: "docs", rel: "noopener", newTabLabel: "(nouvel onglet)" }, "Docs"));
  assert.match(html, /target="docs" rel="noopener"/);
  assert.match(html, /\(nouvel onglet\)/);
});

test("ink blue: the link blue of product UI, with the variant's underline", () => {
  assert.match(render(h(Link, { href: "#", ink: "blue" }, "Learn more")), /class="area-link area-link--inline area-link--blue"/);
  assert.equal(linkVariants({ ink: "blue", variant: "standalone" }), "area-link area-link--standalone area-link--blue");
});
