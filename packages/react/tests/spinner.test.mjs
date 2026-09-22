import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { MANIFESTS, Spinner } from "../dist/modules/index.js";

test("defaults to neutral and exposes accent as an opt-in tone", () => {
  assert.deepEqual(MANIFESTS.spinner.variants.tone, ["neutral", "accent"]);
  assert.equal(MANIFESTS.spinner.defaults.tone, "neutral");
  assert.match(renderToString(h(Spinner, { tone: "accent" })), /area-spinner--accent/);
});

test("is decorative without a label and a status region when named", () => {
  assert.match(renderToString(h(Spinner)), /aria-hidden="true"/);
  const named = renderToString(h(Spinner, { label: "Loading" }));
  assert.match(named, /role="status"/);
  assert.match(named, /aria-label="Loading"/);
  assert.doesNotMatch(named, /aria-hidden/);
});
