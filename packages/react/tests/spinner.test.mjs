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
  assert.match(named, /<span class="area-sr-only">Loading<\/span>/); // content, so the live region announces it (audit E-21)
  assert.doesNotMatch(named, /aria-hidden/);
});

// Components audit V6 (2026-11-07): a delayed spinner renders waiting on the server and in the first client render, its
// status region present and empty, so it hydrates as rendered and says its label only once it shows.
test("Spinner delay renders waiting: the ring keeps its box and its status says nothing yet", async () => {
  const { LOADING_DELAY } = await import("../dist/modules/index.js");
  assert.deepEqual(LOADING_DELAY, { short: 300, long: 1000 });
  for (const delay of ["short", "long", true, 500]) {
    const html = renderToString(h(Spinner, { delay, label: "Loading" }));
    assert.match(html, /^<span role="status" class="area-spinner area-spinner--md" data-waiting="">/);
    assert.doesNotMatch(html, /Loading/, `delay ${delay} holds the label back`);
  }
  for (const delay of [undefined, false, 0]) {
    const html = renderToString(h(Spinner, { delay, label: "Loading" }));
    assert.doesNotMatch(html, /data-waiting/);
    assert.match(html, /<span class="area-sr-only">Loading<\/span>/);
  }
  // A ring with a value shows at once.
  assert.doesNotMatch(renderToString(h(Spinner, { delay: "long", value: 40, label: "Context" })), /data-waiting/);
  assert.ok(MANIFESTS.spinner.states.includes("waiting"));
});
