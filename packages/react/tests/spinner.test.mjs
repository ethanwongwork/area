import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { MANIFESTS, Spinner } from "../dist/modules/index.js";

test("has no tone: the arc is the Selection role", () => {
  assert.equal(MANIFESTS.spinner.variants.tone, undefined);
  assert.doesNotMatch(renderToString(h(Spinner)), /area-spinner--(neutral|accent)/);
});

test("is decorative without a label and a status region when named", () => {
  assert.match(renderToString(h(Spinner)), /aria-hidden="true"/);
  const named = renderToString(h(Spinner, { label: "Loading" }));
  assert.match(named, /role="status"/);
  assert.match(named, /aria-label="Loading"/);
  assert.doesNotMatch(named, /aria-hidden/);
});
