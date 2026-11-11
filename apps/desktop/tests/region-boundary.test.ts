// One way to fail (src/region-boundary.tsx; PRODUCT_UI.md rule 27): a region's failure is kept until Try again or until
// the place changes, and is drawn in the region's own words.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { RegionBoundary } from "../src/region-boundary.ts";

test("region: a failure is kept, and another place clears it", () => {
  const failed = RegionBoundary.getDerivedStateFromError(new Error("boom"));
  assert.equal(failed.error?.message, "boom");
  assert.equal(RegionBoundary.getDerivedStateFromProps({ name: "This view", reset: "#a", children: null }, { error: new Error("boom"), reset: "#a" }), null, "the same place keeps it");
  assert.deepEqual(RegionBoundary.getDerivedStateFromProps({ name: "This view", reset: "#b", children: null }, { error: new Error("boom"), reset: "#a" }), { error: null, reset: "#b" });
});

test("region: it says what failed and offers Try again", () => {
  const region = new RegionBoundary({ name: "This view", children: null });
  region.state = { error: new Error("Cannot read properties of undefined\n    at Page") };
  const html = renderToString(region.render() as never);
  assert.match(html, /This view couldn(&#x27;|')t be drawn/);
  assert.match(html, /What went wrong: Cannot read properties of undefined</);
  assert.doesNotMatch(html, /at Page/, "one line of the error, never its stack");
  assert.match(html, /Try again/);
  assert.match(html, /role="alert"/);
  assert.equal(renderToString(createElement(RegionBoundary, { name: "x" }, "fine")), "fine");
});
