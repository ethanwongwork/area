import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString as render } from "react-dom/server";
import { readFileSync } from "node:fs";
import { Mention, withMentions, MANIFESTS } from "../dist/modules/index.js";

// Mention (components audit N3, 2026-11-07; docs/specs/mention.md).
const css = readFileSync(new URL("../../styles/dist/area.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
const rules = [...css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({ selector: selector.trim().replace(/\s+/g, " "), body }));
const ruleFor = selector => rules.find(rule => rule.selector === selector)?.body ?? "";

test("a span by default: the kind's mark, hidden, then the words; soft and person by default", () => {
  const html = render(h(Mention, { id: "m" }, "David Tee"));
  assert.match(html, /^<span id="m" class="area-mention area-mention--soft area-mention--person"><span class="area-mention__icon" aria-hidden="true"><svg[^>]*data-area-glyph="person"[^>]*data-area-glyph-size="12"/);
  assert.match(html, /<span class="area-mention__label">David Tee<\/span><\/span>$/);
  assert.deepEqual(MANIFESTS.mention.variants, { variant: ["plain", "underline", "soft"], kind: ["person", "file", "page", "date"] });
  for (const [kind, glyph] of [["file", "document"], ["page", "link"], ["date", "calendar"]]) {
    assert.match(render(h(Mention, { kind }, "Item one")), new RegExp(`area-mention--${kind}"[^]*data-area-glyph="${glyph}"`));
  }
});

test("icon replaces the kind's mark, and null leaves it out", () => {
  assert.match(render(h(Mention, { icon: h("img", { src: "a.jpg", alt: "" }) }, "David Tee")), /area-mention__icon" aria-hidden="true"><img src="a\.jpg" alt=""\/>/);
  assert.doesNotMatch(render(h(Mention, { icon: null }, "David Tee")), /area-mention__icon/);
});

test("a link with href, a button with onClick; a new tab gets noopener", () => {
  const link = render(h(Mention, { kind: "page", href: "/item", target: "_blank" }, "Item one"));
  assert.match(link, /^<a class="area-mention area-mention--soft area-mention--page" href="\/item" target="_blank" rel="noopener noreferrer">/);
  const button = render(h(Mention, { onClick() {}, variant: "plain" }, "David Tee"));
  assert.match(button, /^<button class="area-mention area-mention--plain area-mention--person" type="button">/);
  assert.match(render(h(Mention, { onClick() {}, disabled: true }, "David Tee")), /^<button[^>]*disabled=""/);
});

test("a date is a time element; due turns it to the danger ink and says Due after it", () => {
  const html = render(h(Mention, { kind: "date", dateTime: "2026-11-07", due: true }, "Today"));
  assert.match(html, /class="area-mention area-mention--soft area-mention--date" data-due=""/);
  assert.match(html, /<span class="area-mention__label"><time dateTime="2026-11-07">Today<\/time><\/span><span class="area-sr-only">, Due<\/span>/);
  assert.match(render(h(Mention, { kind: "date", due: true, dueLabel: "Overdue" }, "Monday")), />, Overdue</);
  assert.match(ruleFor(".area-mention[data-due]"), /--_mention-ink:\s*var\(--area-fg-danger\)/);
});

test("it keeps the sentence's type and ink; soft draws the mark plate as a pill that is drawn on every line", () => {
  const base = ruleFor(".area-mention");
  assert.match(base, /font:\s*inherit/);
  assert.match(base, /--_mention-ink:\s*inherit/);
  assert.match(base, /box-decoration-break:\s*clone/);
  assert.match(base, /border-radius:\s*var\(--area-radius-full\)/);
  const soft = ruleFor(".area-mention--soft");
  assert.match(soft, /--_mention-plate:\s*var\(--area-bg-mark\)/);
  assert.match(soft, /--_mention-pad-block:\s*2px/);
  assert.match(soft, /--_mention-pad-inline:\s*6px/);
  assert.match(ruleFor(".area-mention--underline"), /--_mention-line:\s*currentColor/);
  // Link's focus ring on a link or a button mention.
  assert.match(ruleFor(".area-mention:is(a, button):focus-visible"), /outline:\s*var\(--area-focus-width\) solid var\(--area-focus-color\)/);
});

test("withMentions draws every @label of a picked mention, the longest label first, and leaves the rest as text", () => {
  const html = render(h("p", null, withMentions("Body text @David Tee, @Design team lead and @Design team.", [
    { label: "Design team" }, { label: "David Tee" }, { label: "Design team lead", kind: "page" },
  ])));
  assert.match(html, /^<p>Body text <span class="area-mention[^"]*--person">[^]*>David Tee<\/span><\/span>, <span class="area-mention[^"]*--page">[^]*>Design team lead<\/span><\/span> and <span[^>]*>[^]*>Design team<\/span><\/span>\.<\/p>$/);
  assert.deepEqual(withMentions("Body text", []), ["Body text"]);
  assert.doesNotMatch(render(h("p", null, withMentions("Body text David Tee", [{ label: "David Tee" }]))), /area-mention/, "no @, no mention");
});
