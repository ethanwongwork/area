import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Message, MessageActions, MANIFESTS } from "../dist/modules/index.js";

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
    const html = renderToString(h(Message, { author, authorName: "Irene Yamaguchi", id: "message", className: "custom", "aria-describedby": "help", streaming: true, actions: h(MessageActions, { label: "Reply actions", id: "actions", className: "extra" }, h("button", { disabled: true, "aria-label": "Copy reply" }, "Copy")) }, "Hello"));
    const article = html.match(/<article[^>]*>/)[0];
    for (const attr of ['aria-label="Irene Yamaguchi said"', 'aria-busy="true"', 'data-streaming=""', 'id="message"', 'aria-describedby="help"']) assert.ok(article.includes(attr));
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
