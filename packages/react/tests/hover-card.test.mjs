import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { HoverCard, MANIFESTS } from "../dist/modules/index.js";

for (const side of MANIFESTS.popover.variants.side) {
  // packages/react/src/components/HoverCard.tsx:8,55-66; packages/styles/src/manifest.ts:552: HoverCard borrows Popover sides.
  test(`HoverCard side=${side} renders the borrowed Popover hook`, () => {
    const html = renderToString(h(HoverCard, { side, trigger: h("a", { href: "/profile" }, "Irene Yamaguchi") }, "Profile"));
    assert.ok(html.match(/<div[^>]*>/)[0].match(/class="([^"]+)"/)[1].split(" ").includes(`area-popover--${side}`));
  });
}

// packages/react/src/components/HoverCard.tsx:55-66: standalone native link and extra manual-popover content; no added trigger name.
test("HoverCard preserves native link and surface props with separate preview content", () => {
  const html = renderToString(h(HoverCard, { trigger: h("a", { href: "/profile", id: "profile-link", "aria-label": "Irene Yamaguchi", "aria-describedby": "help" }, "Irene Yamaguchi"), id: "preview", className: "custom", role: "region", "aria-label": "Profile preview", "aria-describedby": "bio" }, h("p", { id: "bio" }, "Design team")));
  assert.match(html, /^<span class="area-popover-anchor"/);
  const link = html.match(/<a[^>]*>/)[0];
  for (const attr of ['href="/profile"', 'id="profile-link"', 'aria-label="Irene Yamaguchi"', 'aria-describedby="help"']) assert.ok(link.includes(attr));
  assert.doesNotMatch(link, /aria-expanded|aria-controls/);
  const surface = html.match(/<div[^>]*>/)[0];
  for (const attr of ['id="preview"', 'popover="manual"', 'role="region"', 'aria-label="Profile preview"', 'aria-describedby="bio"']) assert.ok(surface.includes(attr));
  assert.match(surface, /area-hover-card custom/);
  assert.match(html, /<p id="bio">Design team<\/p>/);
});
