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
  assert.match(html, /^<nav class="area-nav area-nav--vertical custom" id="nav" aria-label="Workspace" aria-describedby="help">/);
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

// packages/react/src/components/Nav.tsx NavGroup open / onOpenChange / actions (2026-11-01): a folding heading is a button.
test("NavGroup folds from its heading and keeps its actions apart", () => {
  const fold = open => renderToString(h(Nav, { "aria-label": "Workspace" }, h(NavGroup, { label: "Projects", open, onOpenChange: () => {}, actions: h("button", { "aria-label": "New project" }, "+") }, h(NavItem, { href: "/one" }, "One"))));
  const shown = fold(true);
  const button = shown.match(/<button type="button" class="area-nav__toggle"[^>]*>/)[0];
  const id = button.match(/id="([^"]+)"/)[1];
  const controls = button.match(/aria-controls="([^"]+)"/)[1];
  assert.match(button, /aria-expanded="true"/);
  assert.ok(shown.includes(`aria-labelledby="${id}"`), shown);
  assert.match(shown, new RegExp(`<div class="area-nav__items" id="${controls}">`));
  assert.match(shown, /area-nav__chevron" aria-hidden="true"/);
  assert.match(shown, /<\/button><div class="area-nav__actions"><button aria-label="New project">/);
  const folded = fold(false);
  assert.match(folded, /aria-expanded="false"/);
  assert.match(folded, /<div class="area-nav__items" id="[^"]+" hidden="">/);
  // Without onOpenChange the heading stays plain text.
  const fixed = renderToString(h(NavGroup, { label: "Projects", open: false }, h(NavItem, { href: "/one" }, "One")));
  assert.doesNotMatch(fixed, /area-nav__toggle|hidden/);
});

// Nav.tsx NavItem picture and NavGroup sticky (2026-11-01).
test("A picture takes the icon's place, and a sticky group's heading says so", () => {
  const html = renderToString(h(Nav, { "aria-label": "Workspace" }, h(NavGroup, { label: "Project one", sticky: true }, h(NavItem, { href: "/one", icon: "I", picture: h("img", { src: "a.png", alt: "" }) }, "Layer"))));
  assert.match(html, /<span class="area-nav__picture" aria-hidden="true"><img src="a.png" alt=""\/><\/span>/);
  assert.doesNotMatch(html, /area-nav__icon/);
  assert.match(html, /class="area-nav__label area-nav__label--sticky"/);
});

// Components audit V2 (2026-11-07): an inactive item keeps its Tab stop (no href, so tabindex 0), says it is unavailable,
// and its reason is a Tooltip that describes it.
test("NavItem inactive keeps a Tab stop, drops its href and is described by its reason", () => {
  const html = renderToString(h(Nav, { "aria-label": "Label" }, h(NavItem, { href: "#two", inactive: true, inactiveText: "Description" }, "Item two")));
  const link = html.match(/<a[^>]*>/)[0];
  assert.doesNotMatch(link, /href=/);
  for (const attr of ['role="link"', 'aria-disabled="true"', 'data-inactive=""', 'tabindex="0"']) assert.ok(link.includes(attr), attr);
  const described = link.match(/aria-describedby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`role="tooltip"[^>]*id="${described}"[^>]*>Description<`));
  const disabled = renderToString(h(NavItem, { href: "#two", inactive: true, disabled: true }, "Item two"));
  assert.match(disabled, /tabindex="-1"/);
  assert.doesNotMatch(disabled, /data-inactive/);
  assert.ok(MANIFESTS.nav.states.includes("inactive"));
});
