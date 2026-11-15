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
  const ready = renderToString(h(Attachment, { src: "a.png", name: "a.png", onDismiss: () => {} }));
  assert.match(ready, /<div role="group" aria-label="a\.png" class="area-attachment area-attachment--image area-attachment--complete"/);
  // `ready` is a deprecated alias of the shared `complete` (Governance § 4, components audit V10).
  assert.match(renderToString(h(Attachment, { src: "a.png", name: "a.png", status: "ready" })), /class="area-attachment area-attachment--image area-attachment--complete"/);
  assert.match(ready, /<img class="area-attachment__image" src="a\.png" alt=""\/>/);
  assert.match(ready, /<button type="button" class="area-attachment__dismiss" aria-label="Remove a\.png">/);
  assert.doesNotMatch(renderToString(h(Attachment, { src: "a.png", name: "a.png" })), /area-attachment__dismiss/);
  assert.match(renderToString(h(Attachment, { src: "a.png", name: "a.png", onDismiss: () => {}, dismissLabel: "Supprimer a.png" })), /class="area-attachment__dismiss" aria-label="Supprimer a\.png"/);
  // The deprecated `onRemove` still shows the control for a release.
  assert.match(renderToString(h(Attachment, { src: "a.png", name: "a.png", onRemove: () => {} })), /aria-label="Remove a\.png"/);
  const uploading = renderToString(h(Attachment, { src: "a.png", name: "a.png", status: "uploading", progress: 40 }));
  assert.match(uploading, /aria-busy="true"/);
  assert.match(uploading, /area-attachment__overlay[^]*Uploading a\.png, 40%/);
  const failed = renderToString(h(Attachment, { src: "a.png", name: "a.png", status: "error", error: "Too large" }));
  assert.match(failed, /area-attachment--error/);
  assert.match(failed, /role="img" aria-label="Too large"/);
  assert.doesNotMatch(failed, /Retry/, "no Retry without onRetry");
  const retry = renderToString(h(Attachment, { src: "a.png", name: "a.png", status: "error", onRetry: () => {} }));
  assert.match(retry, /class="area-attachment__mark" role="img" aria-label="a\.png could not be uploaded"/);
  assert.match(retry, /<button[^>]*class="area-button[^"]*area-button--icon-only[^"]*"[^>]*>[^]*Retry a\.png/);
});

// packages/react/src/components/ComposerParts.tsx, Attachment kinds (components audit V10, 2026-11-07; chat-apps.md).
test("an Attachment's kinds: a file names its type, a quote its words, a video its length", () => {
  const file = renderToString(h(Attachment, { kind: "file", name: "Item one.pdf" }));
  assert.match(file, /class="area-attachment area-attachment--file area-attachment--complete" title="Item one\.pdf"/);
  assert.match(file, /area-attachment__icon" aria-hidden="true"><svg[^>]*data-area-glyph="document"/);
  assert.match(file, /area-attachment__name" aria-hidden="true">Item one\.pdf</);
  assert.match(file, /class="area-badge[^"]*area-badge--sm[^"]* area-attachment__badge"[^>]*><span class="area-badge__label">PDF</);
  assert.doesNotMatch(file, /<img/);
  assert.doesNotMatch(renderToString(h(Attachment, { kind: "file", name: "Item one.pdf", badge: null })), /area-attachment__badge/);
  assert.match(renderToString(h(Attachment, { kind: "file", name: "Item one", icon: h("svg", { id: "pdf" }) })), /area-attachment__icon" aria-hidden="true"><svg id="pdf"/);
  const words = "Body text ".repeat(40);
  const quote = renderToString(h(Attachment, { kind: "quote", name: "Pasted text", text: words, badge: "Pasted" }));
  assert.match(quote, /<blockquote class="area-attachment__quote"><span class="area-attachment__text">(Body text ){23}Body text…<\/span><\/blockquote>/);
  assert.match(quote, /area-attachment__badge"[^>]*><span class="area-badge__label">Pasted</);
  const video = renderToString(h(Attachment, { kind: "video", name: "Item one.mp4", src: "poster.png", badge: "0:42" }));
  assert.match(video, /<img class="area-attachment__image" src="poster\.png" alt=""\/><span class="area-attachment__play" aria-hidden="true"><svg[^>]*data-area-glyph="play-filled"/);
  assert.match(video, /<span class="area-attachment__badge">0:42<\/span>/);
  for (const kind of ["file", "quote", "video"]) {
    const html = renderToString(h(Attachment, { kind, name: "Item one", text: "Body text", status: "error", error: "Error message", onRetry: () => {}, onDismiss: () => {} }));
    assert.match(html, new RegExp(`area-attachment--${kind} area-attachment--error" title="Error message"`));
    assert.match(html, /Retry Item one[^]*aria-label="Remove Item one"/);
  }
});

test("a ComposerMenu is a listbox of Menu rows the field points at, grouped, with a muted path", () => {
  const html = renderToString(h(ComposerMenu, { id: "m", "aria-label": "Files", activeId: "b", onPick: () => {}, items: [
    { label: "Files", items: [{ id: "a", label: "a.css", path: "src/styles" }, { id: "b", label: "b.css" }] },
  ] }));
  assert.match(html, /^<div id="m" role="listbox" aria-label="Files" class="area-composer-menu area-menu">/);
  assert.match(html, /role="group" aria-labelledby="m-group-0"><div id="m-group-0" class="area-menu__label"/);
  assert.match(html, /<div id="m-a" role="option" aria-selected="false" class="area-menu__item">/);
  assert.match(html, /<div id="m-b" role="option" aria-selected="true" class="area-menu__item" data-highlighted="">/);
  assert.match(html, /<span class="area-composer-menu__path"><bdi>src\/styles<\/bdi><\/span>/);
  assert.match(renderToString(h(ComposerMenu, { "aria-label": "Files", items: [{ items: [] }], onPick: () => {} })), /area-menu__empty[^>]*><span class="area-menu__text">No matches</);
  // The deprecated `label` and `groups` still work for a release; `aria-label` wins.
  const old = renderToString(h(ComposerMenu, { label: "Files", groups: [{ items: [{ id: "a", label: "a.css" }] }], onPick: () => {} }));
  assert.match(old, /role="listbox" aria-label="Files"/);
  assert.match(old, /role="option"/);
  assert.match(renderToString(h(ComposerMenu, { label: "Files", "aria-label": "Commands", items: [], onPick: () => {} })), /aria-label="Commands"/);
});

test("a Queue counts its messages; each row offers Send now and Remove, a failed one Retry", () => {
  const html = renderToString(h(Queue, { onSendNow: () => {}, onDismiss: () => {}, onRetry: () => {}, items: [
    { id: "1", text: "Also check dark" }, { id: "2", text: "Run the tests", status: "sending" }, { id: "3", text: "Commit", status: "failed" },
  ] }));
  assert.match(html, /class="area-queue__title">3 queued</);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /<li class="area-queue__item">[^]*Also check dark[^]*>Send now<[^]*aria-label="Remove “Also check dark”"/);
  assert.match(html, /area-queue__item--sending[^]*Sending[^]*Run the tests<\/span><\/li>/);
  assert.match(html, /area-queue__item--error[^]*aria-label="Not sent"[^]*>Retry</);
  // Messages send in order, so the list is ordered.
  assert.match(html, /<ol id="[^"]+" class="area-queue__items"/);
  // The deprecated `onRemove` still shows Remove for a release.
  assert.match(renderToString(h(Queue, { onRemove: () => {}, items: [{ id: "1", text: "One" }] })), /aria-label="Remove “One”"/);
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

test("an uploading attachment's ring is named whether or not its progress is known", () => {
  for (const progress of [undefined, 40]) {
    const html = renderToString(h(Attachment, { src: "a.png", name: "Photo", status: "uploading", progress }));
    assert.match(html, /Uploading Photo/);
  }
  assert.match(renderToString(h(Attachment, { src: "a.png", name: "Photo", status: "uploading", progress: 40 })), /role="progressbar"[^>]*aria-label="Uploading Photo"/);
});

test("TIMESTAMP_GAP is one pause, an hour; replies get no timestamp of their own", async () => {
  const { TIMESTAMP_GAP } = await import("../dist/modules/index.js");
  assert.equal(TIMESTAMP_GAP, 3_600_000);
});
