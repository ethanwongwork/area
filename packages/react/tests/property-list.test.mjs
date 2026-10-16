import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { PropertyList, PropertyListItem, MANIFESTS } from "../dist/modules/index.js";

// packages/react/src/components/PropertyList.tsx:44-55,129-160: list naming, instructions/live region, inactive item and separate value/actions.
test("PropertyList renders named reorder handles, stable instructions and compound rows", () => {
  const html = renderToString(h(PropertyList, { label: "Fills", id: "fills", className: "custom", "aria-label": "Layer fills", onReorder() {} },
    h(PropertyListItem, { label: "Red fill", id: "red", className: "row", inactive: true, "aria-describedby": "help", actions: h("button", { disabled: true, "aria-label": "Remove red fill" }, "Remove") }, "Red"),
    h(PropertyListItem, { label: "Blue fill" }, "Blue")));
  const list = html.match(/<ul[^>]*>/)[0];
  for (const attr of ['aria-label="Layer fills"', 'id="fills"', 'class="area-property-list custom"']) assert.ok(list.includes(attr));
  const instructions = list.match(/aria-describedby="([^"]+)"/)[1];
  assert.ok(html.includes(`id="${instructions}" class="area-sr-only">Use the arrow keys on a handle to move fills.</span>`));
  assert.match(html, /<span class="area-sr-only" aria-live="polite"><\/span>/);
  assert.match(html, /<li class="area-property-list__item row" data-inactive="" id="red" aria-describedby="help">/);
  assert.match(html, /aria-label="Reorder Red fill, position 1 of 2"/);
  assert.match(html, /aria-label="Reorder Blue fill, position 2 of 2"/);
  assert.match(html, /area-property-list__value">Red<\/div><div class="area-property-list__actions"><button disabled="" aria-label="Remove red fill"/);
  assert.doesNotMatch(html, /data-dragging|area-property-list__indicator/);
});

// packages/react/src/components/PropertyList.tsx:44-46,138-150: no handles or reorder instructions on fixed/single-item lists.
test("PropertyList fixed and one-item usages omit reorder controls", () => {
  for (const [count, reorderable] of [[2, false], [1, true], [0, true]]) {
    const html = renderToString(h(PropertyList, { label: "Fills", onReorder: reorderable ? () => {} : undefined, "aria-describedby": "help" }, Array.from({ length: count }, (_, i) => h(PropertyListItem, { key: i, label: `Fill ${i + 1}` }, "Fill"))));
    assert.match(html, /<ul aria-label="Fills" aria-describedby="help"/);
    assert.equal((html.match(/<li\b/g) ?? []).length, count);
    assert.doesNotMatch(html, /area-property-list__handle|aria-live|data-inactive/);
  }
});
