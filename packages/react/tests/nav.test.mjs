import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Nav, NavGroup, NavItem, NavSeparator, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.nav.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:657; packages/react/src/components/Nav.tsx:27.
    test(`Nav ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Nav, { "aria-label": "Workspace", [axis]: value }));
      const root = html.match(/<nav\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.nav.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/Nav.tsx:27-51,73-99: native nav/link roles, named groups, current and disabled links, sibling actions.
test("Nav composes named navigation and groups with independent destination actions", () => {
  const html = renderToString(h(Nav, { id: "nav", className: "custom", "aria-label": "Workspace", "aria-describedby": "help" }, h(NavGroup, { label: "Projects", id: "projects", className: "group" }, h(NavItem, { href: "/design", current: true, id: "design", className: "item", "aria-label": "Design projects", icon: "I", trailing: "3", actions: h("button", { "aria-label": "Add project" }, "+") }, "Design"), h(NavSeparator), h(NavItem, { href: "/archive", disabled: true }, "Archive"))));
  assert.match(html, /^<nav class="area-nav custom" id="nav" aria-label="Workspace" aria-describedby="help">/);
  const group = html.match(/<div[^>]*role="group"[^>]*>/)[0];
  const label = group.match(/aria-labelledby="([^"]+)"/)[1];
  assert.ok(html.includes(`id="${label}"><span>Projects</span>`));
  const links = html.match(/<a[^>]*>/g);
  for (const attr of ['href="/design"', 'aria-current="page"', 'id="design"', 'aria-label="Design projects"']) assert.ok(links[0].includes(attr));
  assert.match(links[0], /class="area-nav__item item"/);
  for (const attr of ['data-disabled=""', 'aria-disabled="true"', 'tabindex="-1"']) assert.ok(links[1].includes(attr));
  assert.doesNotMatch(links[1], /href=/);
  assert.match(html, /<\/a><div class="area-nav__actions"><button aria-label="Add project">/);
  assert.match(html, /area-nav__icon" aria-hidden="true">I/);
  assert.match(html, /area-nav__trailing">3/);
  const separator = html.match(/<div[^>]*class="area-nav__separator"[^>]*>/)?.[0];
  assert.ok(separator, html);
  assert.match(separator, /role="separator"/);
});
