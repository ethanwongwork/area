import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Avatar, AvatarGroup, MANIFESTS } from "../dist/modules/index.js";

test("fallback content uses the supplied accessible name instead of announcing initials", () => {
  const html = renderToString(h(Avatar, { fallback: "A", alt: "Avatar" }));
  assert.match(html, /role="img"/);
  assert.match(html, /aria-label="Avatar"/);
  assert.match(html, /aria-hidden="true">A/);
});

test("an image keeps its native alternative text", () => {
  const html = renderToString(h(Avatar, { src: "/avatar.png", alt: "Avatar photo", fallback: "A" }));
  assert.match(html, /<img[^>]+alt="Avatar photo"/);
  assert.doesNotMatch(html, /role="img"/);
});

test("shape and size remain explicit public axes", () => {
  const html = renderToString(h(Avatar, { shape: "square", size: "lg", fallback: "A" }));
  assert.match(html, /area-avatar--square/);
  assert.match(html, /area-avatar--lg/);
  assert.deepEqual(MANIFESTS.avatar.variants.shape, ["circle", "square"]);
});

test("tone and active ring remain independent visual axes", () => {
  const html = renderToString(h(Avatar, { tone: "inverse", active: true, fallback: "IN" }));
  assert.match(html, /area-avatar--inverse/);
  assert.match(html, /area-avatar--active/);
  assert.deepEqual(MANIFESTS.avatar.variants.tone, ["neutral", "accent", "inverse"]);
  assert.deepEqual(MANIFESTS.avatar.booleans, ["active"]);
});

test("an icon fallback is decorative beneath the Avatar accessible name", () => {
  const html = renderToString(h(Avatar, { icon: h("svg", null), alt: "Generic avatar" }));
  assert.match(html, /aria-label="Generic avatar"/);
  assert.match(html, /area-avatar__icon/);
  assert.match(html, /aria-hidden="true"/);
});

test("AvatarGroup limits visible children and summarizes the remainder", () => {
  const html = renderToString(h(AvatarGroup, { max: 2, "aria-label": "Project members" },
    h(Avatar, { fallback: "A", alt: "A" }),
    h(Avatar, { fallback: "B", alt: "B" }),
    h(Avatar, { fallback: "C", alt: "C" }),
    h(Avatar, { fallback: "D", alt: "D" }),
  ));
  assert.equal((html.match(/area-avatar-group__item/g) ?? []).length, 2);
  assert.match(html, /area-avatar-group__overflow/);
  assert.match(html, /aria-label="2 more avatars"/);
  assert.match(html, />\+2</);
});
