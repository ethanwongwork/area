// Theme's brand (2026-10-26): the declarations from @area/tokens/brand on the scope, the caller's own style over them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Theme } from "../dist/modules/index.js";
import { brandDeclarations } from "@area/tokens/brand";

test("a brand's declarations land on the Theme's own element, marked data-area-brand", () => {
  const brand = brandDeclarations({ primary: "#00b65c", secondary: "#a785fe" });
  const html = renderToString(h(Theme, { brand }, "Label"));
  assert.match(html, /data-area-brand=""/);
  assert.match(html, /--area-accent-solid-full:(#[0-9a-f]{6}|light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\))/);
  assert.match(html, /--area-support-1:light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\)/);
  assert.match(html, /--area-secondary-solid:/);
  assert.match(html, /--area-support-1:/);
});

test("the caller's style wins over the brand's, and no brand writes nothing", () => {
  const brand = { "--area-accent-solid-full": "#123456" };
  assert.match(renderToString(h(Theme, { brand, style: { "--area-accent-solid-full": "#654321" } })), /--area-accent-solid-full:#654321/);
  const plain = renderToString(h(Theme, {}, "Label"));
  assert.doesNotMatch(plain, /data-area-brand|style=/);
});
