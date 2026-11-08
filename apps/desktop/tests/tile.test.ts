// Every tile is Area's Asset card (src/tile.tsx; owner, 2026-11-02: "Yes, rebuild tiles", after "the feed kit should
// leverage and use real components"). It reverses the 2026-10-21 rule (Asset card on the Components tab only, a plain box
// of the app's own everywhere else), so the plain container must not come back, and a colour's painted frame keeps the
// swatch ring and states it had.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const styles = new URL("../src/styles/", import.meta.url);
const css = readdirSync(styles).filter(name => name.endsWith(".css")).map(name => readFileSync(new URL(name, styles), "utf8")).join("\n");
const tile = readFileSync(new URL("../src/tile.tsx", import.meta.url), "utf8");
const rule = (selector: string) => {
  const at = css.indexOf(selector);
  assert.ok(at >= 0, `${selector} missing`);
  return css.slice(at, css.indexOf("}", at));
};

test("Tile is Area's Design card for a design, else Asset card in the gallery look unless a page gives its own", () => {
  // PR #208 (2026-11-06): a design (a component, a screen) sits in a Design card; everything else stays an Asset card.
  assert.match(tile, /export function Tile\(props: TileProps\) \{[^}]*return <DesignTile \{\.\.\.props\} design=\{design\} \/>;\s*return <AssetTile \{\.\.\.props\} look=\{props\.look \?\? GALLERY_LOOK\} \/>;/);
  assert.doesNotMatch(tile, /function PlainTile\b/, "the plain container is gone");
  assert.doesNotMatch(css, /\.gallery-tile--plain\b|\.gallery-plain\b/, "no app CSS draws a plain box");
});

test("a colour's painted frame is outlined by the swatch ring and takes its ink when selected", () => {
  const painted = rule(".gallery-tile[data-painted] {\n    border-color");
  assert.match(painted, /background: var\(--_paint\)/);
  assert.match(painted, /outline: var\(--area-stroke-width\) solid var\(--area-token-swatch-ring\)/);
  assert.match(rule('.gallery-asset[aria-selected="true"] .gallery-tile[data-painted]'), /outline-color: var\(--_ink\)/);
});

test("the 16:9 shape is Asset card's screen aspect (its wide is 2:1)", () => {
  assert.match(tile, /shape === "wide" \|\| \(stage === "screen" && shape !== "square"\) \? "screen" as const/);
});
