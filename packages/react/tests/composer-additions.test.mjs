// The chat additions around the Composer: its context row and menu slot, Attachment, ComposerMenu, Queue and
// Timestamp. Specs: docs/specs/{attachment,composer-menu,queue,timestamp}.md; evidence:
// docs/research/inspector-chat-2026-10-18/composer-additions.md.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Attachment, Composer, ComposerMenu, Queue, Timestamp, formatTimestamp } from "../dist/modules/index.js";

test("the Composer draws its context row inside the shell, above the field, and its menu first", () => {
  const html = renderToString(h(Composer, { layout: "stacked", context: h("span", { id: "chip" }, "a.css"), menu: h("div", { id: "menu" }) }));
  assert.match(html, /^<div class="area-composer area-composer--stacked"[^>]*><div id="menu"><\/div><div class="area-composer__context"><span id="chip">a\.css<\/span><\/div><div class="area-composer__entry">/);
  assert.doesNotMatch(renderToString(h(Composer, {})), /area-composer__context/);
});

test("an Attachment names itself, its remove control and its upload", () => {
  const ready = renderToString(h(Attachment, { src: "a.png", name: "a.png", onRemove: () => {} }));
  assert.match(ready, /<div role="group" aria-label="a\.png" class="area-attachment area-attachment--ready"/);
  assert.match(ready, /<img class="area-attachment__image" src="a\.png" alt=""\/>/);
  assert.match(ready, /<button type="button" class="area-attachment__remove" aria-label="Remove a\.png">/);
  assert.doesNotMatch(renderToString(h(Attachment, { src: "a.png", name: "a.png" })), /area-attachment__remove/);
  const uploading = renderToString(h(Attachment, { src: "a.png", name: "a.png", status: "uploading", progress: 40 }));
  assert.match(uploading, /aria-busy="true"/);
  assert.match(uploading, /area-attachment__overlay[^]*Uploading a\.png, 40%/);
  const failed = renderToString(h(Attachment, { src: "a.png", name: "a.png", status: "error", error: "Too large" }));
  assert.match(failed, /area-attachment--error/);
  assert.match(failed, /role="img" aria-label="Too large"/);
});

test("a ComposerMenu is a listbox of Menu rows the field points at, grouped, with a muted path", () => {
  const html = renderToString(h(ComposerMenu, { id: "m", label: "Files", activeId: "b", onPick: () => {}, groups: [
    { label: "Files", items: [{ id: "a", label: "a.css", path: "src/styles" }, { id: "b", label: "b.css" }] },
  ] }));
  assert.match(html, /^<div id="m" role="listbox" aria-label="Files" class="area-composer-menu area-menu">/);
  assert.match(html, /role="group" aria-labelledby="m-group-0"><div id="m-group-0" class="area-menu__label"/);
  assert.match(html, /<div id="m-a" role="option" aria-selected="false" class="area-menu__item">/);
  assert.match(html, /<div id="m-b" role="option" aria-selected="true" class="area-menu__item" data-highlighted="">/);
  assert.match(html, /<span class="area-composer-menu__path"><bdi>src\/styles<\/bdi><\/span>/);
  assert.match(renderToString(h(ComposerMenu, { label: "Files", groups: [{ items: [] }], onPick: () => {} })), /area-composer-menu__empty[^>]*>No matches</);
});

test("a Queue counts its messages; each row offers Send now and Remove, a failed one Retry", () => {
  const html = renderToString(h(Queue, { onSendNow: () => {}, onRemove: () => {}, onRetry: () => {}, items: [
    { id: "1", text: "Also check dark" }, { id: "2", text: "Run the tests", status: "sending" }, { id: "3", text: "Commit", status: "failed" },
  ] }));
  assert.match(html, /class="area-queue__title">3 queued</);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /<li class="area-queue__item">[^]*Also check dark[^]*>Send now<[^]*aria-label="Remove “Also check dark”"/);
  assert.match(html, /area-queue__item--sending[^]*Sending[^]*Run the tests<\/span><\/li>/);
  assert.match(html, /area-queue__item--failed[^]*aria-label="Not sent"[^]*>Retry</);
});

test("a Timestamp is a time element, worded as Codex words it", () => {
  assert.match(renderToString(h(Timestamp, { dateTime: "2026-10-19T14:30:00.000Z" }, "Today 2:30 PM")),
    /^<p class="area-timestamp"><time dateTime="2026-10-19T14:30:00.000Z">Today 2:30 PM<\/time><\/p>$/);
  const now = new Date(2026, 9, 19, 15, 0);
  assert.match(formatTimestamp(new Date(2026, 9, 19, 14, 30), now, "en-US"), /^Today 2:30\sPM$/);
  assert.match(formatTimestamp(new Date(2026, 9, 18, 9, 5), now, "en-US"), /^Yesterday 9:05\sAM$/);
  assert.match(formatTimestamp(new Date(2026, 9, 15, 9, 5), now, "en-US"), /^Thursday 9:05\sAM$/);
  assert.match(formatTimestamp(new Date(2026, 6, 4, 9, 5), now, "en-US"), /^Sat, Jul 4 9:05\sAM$/);
  assert.match(formatTimestamp(new Date(2024, 6, 4, 9, 5), now, "en-US"), /^Jul 4, 2024 9:05\sAM$/);
});
