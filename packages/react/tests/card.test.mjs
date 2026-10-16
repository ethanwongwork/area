import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Card, CardHeader, CardTitle, CardDescription, CardValue, CardContent, CardMedia, CardOverlay, CardLink, CardList, CardAction, CardCarousel, CardFooter, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.card.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:523; packages/react/src/components/primitives.tsx:220.
    test(`Card ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Card, { [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)[0];
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.card.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/primitives.tsx:220-312: header/content/footer and independently named native links/actions.
test("Card composes media, heading, value, content and footer with native props", () => {
  const html = renderToString(h(Card, { id: "card", className: "custom", role: "article", "aria-labelledby": "title", "aria-describedby": "description" },
    h(CardMedia, { well: true, bleed: true }, h("img", { src: "data:,", alt: "Preview" }), h(CardOverlay, { reveal: true }, "New")),
    h(CardHeader, { action: h("button", { "aria-label": "More actions", disabled: true }, "More") }, h(CardTitle, { id: "title" }, h(CardLink, { href: "/project" }, "Design project")), h(CardDescription, { id: "description" }, "Project details")),
    h(CardContent, null, h(CardValue, null, "12"), h(CardList, null, h("li", null, "Shared"))),
    h(CardFooter, null, h(CardAction, { href: "/open", "aria-label": "Open project" }, "Open"))));
  const root = html.match(/<div[^>]*>/)[0];
  for (const attr of ['id="card"', 'role="article"', 'aria-labelledby="title"', 'aria-describedby="description"']) assert.ok(root.includes(attr));
  assert.match(root, /class="[^"]* custom"/);
  assert.match(html, /area-card__media--well area-card__media--bleed/);
  assert.match(html, /area-card__overlay--top-end area-card__overlay--reveal/);
  // CardTitle renders a heading (level 3 by default) so the card's name is in the document outline.
  assert.match(html, /area-card__header"><div class="area-card__heading"><h3 class="area-card__title" id="title"><a class="area-card__link" href="\/project">Design project<\/a><\/h3>/);
  assert.match(html, /<\/div><div class="area-card__header-action"><button aria-label="More actions" disabled="">/);
  assert.match(html, /area-card__content"><div class="area-card__value">12<\/div><ul class="area-card__list"><li>Shared<\/li><\/ul>/);
  assert.match(html, /area-card__footer"><a class="area-card__action" href="\/open" aria-label="Open project">Open/);
});

// packages/styles/src/manifest.ts:528; packages/react/src/components/primitives.tsx:266-308: overlay placements and named native list carousel.
test("Card overlay placements and carousel preserve their documented structures", () => {
  for (const placement of MANIFESTS.card.elementModifiers.overlay.filter(value => value !== "reveal")) {
    assert.ok(renderToString(h(CardOverlay, { placement }, "Status")).includes(`area-card__overlay--${placement}`));
  }
  const html = renderToString(h(CardCarousel, { "aria-label": "Projects", id: "carousel", className: "custom" }, h("li", null, h(Card, null, "Design project"))));
  assert.match(html, /^<ul tabindex="0" class="area-card__carousel custom" aria-label="Projects" id="carousel"><li><div class="area-card/);
  assert.match(html, /<\/div><\/li><\/ul>$/);
});
