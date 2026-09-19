import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Switch, switchVariants, MANIFESTS } from "../dist/modules/index.js";

const render = props => renderToString(h(Switch, props));

test("default is a medium switch with one native checkbox", () => {
  const html = render({ label: "Sync", name: "sync", value: "yes", defaultChecked: true });
  assert.match(html, /area-switch--md area-switch--label-end/);
  assert.equal((html.match(/<input /g) || []).length, 1);
  assert.match(html, /type="checkbox" role="switch"/);
  assert.match(html, /name="sync"/);
  assert.match(html, /value="yes"/);
  assert.match(html, /checked=""/);
});

test("the public size family is small, medium, and large", () => {
  assert.deepEqual(MANIFESTS.switch.variants.size, ["sm", "md", "lg"]);
  for (const size of MANIFESTS.switch.variants.size) {
    assert.match(render({ size, "aria-label": "Sync" }), new RegExp(`area-switch--${size}`));
  }
  assert.throws(() => switchVariants({ size: "xl" }), RangeError);
});

test("blocked modes preserve native switch semantics", () => {
  assert.match(render({ disabled: true, label: "Sync" }), / disabled=""/);
  assert.match(render({ readOnly: true, label: "Sync" }), /aria-readonly="true"/);
  assert.match(render({ loading: true, label: "Sync" }), /aria-busy="true"/);
});

test("description and visible label have separate associations", () => {
  const html = render({ label: "Sync", description: "Across devices", required: true });
  assert.match(html, /aria-labelledby="[^"]+-label"/);
  assert.match(html, /aria-describedby="[^"]+-description"/);
  assert.match(html, / required=""/);
});

test("loading reuses the shared Area spinner", () => {
  const html = render({ label: "Sync", loading: true });
  assert.match(html, /area-switch__loading/);
  assert.match(html, /area-spinner area-spinner--sm/);
  assert.match(html, /role="switch"/);
  assert.doesNotMatch(html, /area-switch__spinner/);
});
