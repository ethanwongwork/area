import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Message, MessageActions, MessageGroup, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.message.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:462; packages/react/src/components/Message.tsx:23.
    test(`Message ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Message, { children: "Hello", [axis]: value }));
      const root = html.match(/<article\b[^>]*>/)?.[0];
      assert.ok(root, html);
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.message.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/Message.tsx:20-29,38-41: author naming, bubble/prose, actions and streaming state.
test("Message preserves author names, native article props and a separate actions group", () => {
  for (const author of MANIFESTS.message.variants.author) {
    const html = renderToString(h(Message, { author, authorName: "David Tee", id: "message", className: "custom", "aria-describedby": "help", streaming: true, actions: h(MessageActions, { label: "Reply actions", id: "actions", className: "extra" }, h("button", { disabled: true, "aria-label": "Copy reply" }, "Copy")) }, "Hello"));
    const article = html.match(/<article[^>]*>/)[0];
    for (const attr of ['aria-label="David Tee said"', 'aria-busy="true"', 'data-streaming=""', 'id="message"', 'aria-describedby="help"']) assert.ok(article.includes(attr));
    assert.match(article, /class="[^"]* custom"/);
    assert.match(html, /area-message__cursor" aria-hidden="true"/);
    assert.match(html, /role="group" aria-label="Reply actions" class="area-message__actions extra" id="actions"/);
    assert.match(html, /<button disabled="" aria-label="Copy reply">Copy<\/button>/);
    assert.equal(html.includes('area-message__bubble'), author === "user");
    assert.equal(html.includes('<p>Hello'), author === "assistant");
  }
});

// packages/react/src/components/Message.tsx:20-27: default author names and block content without an extra paragraph.
test("Message uses default names and preserves rich assistant content without streaming", () => {
  for (const [author, name] of [["user", "You"], ["assistant", "Assistant"]]) {
    const html = renderToString(h(Message, { author }, h("p", null, "Reply")));
    assert.ok(html.includes(`aria-label="${name} said"`));
    assert.doesNotMatch(html, /aria-busy|data-streaming|area-message__cursor|<p><p>/);
  }
});

// packages/react/src/components/Message.tsx: sending and not sent (components audit O6, 2026-11-07).
test("a sending message waits before its line shows; a message not sent says so, with Retry", () => {
  const sending = renderToString(h(Message, { author: "user", status: "sending" }, "Body text"));
  const root = sending.match(/<article[^>]*>/)[0];
  assert.match(root, /class="area-message area-message--user area-message--sending"/);
  assert.match(root, /aria-busy="true"/);
  // The first render waits (Spinner's delay "long"): the line is in place, unseen until the wait passes.
  assert.match(root, /data-waiting=""/);
  assert.match(sending, /<p class="area-message__status"><span class="area-message__status-text">Sending…<\/span><\/p>/);
  const failed = renderToString(h(Message, { author: "user", status: "error", onRetry: () => {} }, "Body text"));
  assert.doesNotMatch(failed.match(/<article[^>]*>/)[0], /aria-busy|data-waiting/);
  assert.match(failed, /area-message__status"><svg[^>]*data-area-glyph="dismiss-circle"[^]*<span class="area-message__status-text">Not sent<\/span><button[^>]*>[^]*Retry<\/span><\/button><\/p>/);
  assert.doesNotMatch(renderToString(h(Message, { author: "user", status: "error" }, "Body text")), /Retry/);
  assert.match(renderToString(h(Message, { author: "user", status: "error", statusText: "Not delivered" }, "Body text")), />Not delivered</);
  assert.doesNotMatch(renderToString(h(Message, { author: "user" }, "Body text")), /area-message__status/);
});

// V9: a stack of the person's messages, and one message split into bubbles.
test("MessageGroup stacks turns; split puts each child in a bubble of its own on the same stack", () => {
  const group = renderToString(h(MessageGroup, { id: "g", className: "extra" }, h(Message, { author: "user" }, "Item one"), h(Message, { author: "user" }, "Item two")));
  assert.match(group, /^<div class="area-message__stack extra" id="g"><article[^>]*>[^]*<article/);
  const split = renderToString(h(Message, { author: "user", split: true, streaming: true }, h("span", null, "Item one"), h("span", null, "Item two")));
  assert.match(split, /<div class="area-message__stack"><div class="area-message__bubble"><span>Item one<\/span><\/div><div class="area-message__bubble"><span>Item two<\/span><span class="area-message__cursor"/);
  // One child is one bubble, with no stack.
  assert.doesNotMatch(renderToString(h(Message, { author: "user", split: true }, "Item one")), /area-message__stack/);
});
