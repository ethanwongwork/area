// The plain container (src/tile.tsx, PlainTile; studio.css, "Plain tiles"): every tab but Components uses it, so its
// states must read the shared state settings, never literal colours or widths (PRODUCT_UI rules 1-3), and Asset card
// stays on the Components tab only (owner, 2026-10-21).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/studio.css", import.meta.url), "utf8");
const rule = (selector: string) => {
  const at = css.indexOf(selector);
  assert.ok(at >= 0, `${selector} missing`);
  return css.slice(at, css.indexOf("}", at));
};

test("the plain box paints the light neutral fill and Card's light edge at stroke-width, with no shadow", () => {
  const box = rule(".gallery-tile--plain {");
  assert.match(box, /background: var\(--area-bg-stripe\)/);
  assert.match(box, /border: var\(--area-stroke-width\) solid var\(--area-border-card\)/);
  assert.doesNotMatch(box, /shadow-(lift|float|resting)/);
});

test("its states read the state settings: the hover edge, the selected edge and tint, the focus ring", () => {
  assert.match(rule(".gallery-plain:hover > .gallery-tile--plain:not([data-painted])"), /var\(--area-edge-control-hover\)/);
  const selected = rule('.gallery-plain:is([aria-selected="true"], [aria-pressed="true"], [data-selected]) > .gallery-tile--plain:not([data-painted])');
  assert.match(selected, /var\(--area-stroke-selected\)/);
  assert.match(selected, /var\(--area-selected-width\)/);
  assert.match(selected, /var\(--area-selected-tint\)/);
  const focus = rule(".gallery-plain:focus-visible");
  assert.match(focus, /var\(--area-focus-width\) solid var\(--area-focus-color\)/);
  assert.match(focus, /var\(--area-focus-gap\)/);
});

test("Asset card is the Components tab's container only", () => {
  const pages = ["brand", "color", "examples", "theme", "theme-setup"].map(page => readFileSync(new URL(`../src/pages/${page}.tsx`, import.meta.url), "utf8"));
  for (const source of pages) {
    assert.doesNotMatch(source, /<AssetCard\b|<AssetGridItem\b|container="asset"/);
  }
  assert.match(readFileSync(new URL("../src/pages/components.tsx", import.meta.url), "utf8"), /container="asset"/);
});
