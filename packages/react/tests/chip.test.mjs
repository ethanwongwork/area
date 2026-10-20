import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Chip, ChipLink, MANIFESTS } from "../dist/modules/index.js";

const render = props => renderToString(h(Chip, props, "Design"));

test("a filter chip is a native toggle button with an announced false state by default", () => {
  const html = render({});
  assert.match(html, /type="button"/);
  assert.match(html, /aria-pressed="false"/);
  assert.doesNotMatch(html, /data-selected/);
});

test("assist and suggestion chips are actions rather than toggles", () => {
  assert.doesNotMatch(render({ kind: "assist" }), /aria-pressed/);
  assert.doesNotMatch(render({ kind: "suggestion" }), /aria-pressed/);
});

test("a delete-only input chip exposes only the dismiss action as a button", () => {
  const html = render({ kind: "input", onRemove: () => {} });
  assert.match(html, /area-chip__action/);
  assert.match(html, /area-chip__remove/);
  assert.match(html, /aria-label="Remove Design"/); // names what it removes (audit C-6)
  assert.match(html, /<path/);
  assert.equal((html.match(/<button/g) ?? []).length, 1);
});

test("a clickable deletable input chip keeps its primary and dismiss actions separate", () => {
  const html = render({ kind: "input", clickable: true, onRemove: () => {} });
  assert.equal((html.match(/<button/g) ?? []).length, 2);
});

test("ChipLink is a native underlined navigation target", () => {
  const html = renderToString(h(ChipLink, { href: "#filters" }, "Filters"));
  assert.match(html, /<a[^>]+href="#filters"/);
  assert.match(html, /area-chip--link/);
});

test("ChipLink can use an outgoing icon without an underline at rest", () => {
  const html = renderToString(h(
    ChipLink,
    { href: "#external", treatment: "icon", trailingIcon: h("span", null, "↗") },
    "Link out"
  ));
  assert.match(html, /<a[^>]+href="#external"/);
  assert.match(html, /area-chip--link-icon/);
  assert.match(html, /Link out/);
});

test("controlled and uncontrolled selection entry points share the selected paint", () => {
  assert.match(render({ selected: true }), /aria-pressed="true"/);
  assert.match(render({ selected: true }), /data-selected=""/);
  assert.match(render({ defaultSelected: true }), /data-selected=""/);
});

test("keeps selection, disabled state, and the compact size family in the public contract", () => {
  const html = render({ defaultSelected: true, disabled: true, swatch: "red" });
  assert.match(html, /data-disabled=""/);
  assert.match(html, / disabled=""/);
  assert.match(html, /area-chip__swatch/);
  assert.deepEqual(MANIFESTS.chip.variants.size, ["sm", "md", "lg"]);
  assert.ok(MANIFESTS.chip.booleans.includes("link"));
  assert.ok(MANIFESTS.chip.booleans.includes("link-icon"));
});

test("ChipLink follows the pill setting like Chip: pill forces a pill, pill={false} the radius corner", () => {
  assert.match(renderToString(h(ChipLink, { href: "#a", pill: false }, "A")), /area-chip--rounded/);
  assert.match(renderToString(h(ChipLink, { href: "#a", pill: true }, "A")), /area-chip--pill/);
  assert.doesNotMatch(renderToString(h(ChipLink, { href: "#a" }, "A")), /area-chip--(pill|rounded)/);
});
