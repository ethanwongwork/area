// The Canvas's brand (src/brand.ts, 2026-10-26): off by default, saved as colours and validated on the way back in, and
// painted on the specimens alone (src/specimen-scope.tsx), so the app, the Canvas's body, cards and titles included, keeps
// Area's palette.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { BRAND_DEFAULT, brandStyle, restoreBrand } from "../src/brand.ts";

test("a saved brand keeps only valid fields, and nothing saved is Brand off", () => {
  assert.deepEqual(restoreBrand(null), BRAND_DEFAULT);
  assert.deepEqual(restoreBrand({ on: true, primary: "#00B65C", secondary: "green", tertiary: "#a8f", status: "own" }),
    { on: true, primary: "#00b65c", secondary: null, tertiary: "#a8f", status: "own" });
  assert.equal(restoreBrand({ on: "yes", primary: 12 }).on, false);
  assert.equal(restoreBrand({ primary: "#12" }).primary, BRAND_DEFAULT.primary);
});

test("Brand off writes nothing; on, the engine's declarations with the status choice", () => {
  assert.equal(brandStyle(BRAND_DEFAULT), undefined);
  const on = brandStyle({ ...BRAND_DEFAULT, on: true, primary: "#00b65c" })!;
  assert.match(on["--area-accent-solid-full"]!, /#[0-9a-f]{6}/);
  assert.ok(on["--area-danger-solid-full"], "harmonised status colours are written");
  const own = brandStyle({ ...BRAND_DEFAULT, on: true, primary: "#00b65c", status: "own" })!;
  assert.equal(own["--area-danger-solid-full"], undefined, "Area's own status colours are left to the settings");
});

test("the brand reaches the specimens' scope only, never the Canvas body or <html>", () => {
  const studio = readFileSync(new URL("../src/studio.tsx", import.meta.url), "utf8");
  assert.match(studio, /const specimens = useMemo\(\(\) => canvasPicks \? \{[^\n]*"data-area-brand": ""/);
  assert.match(studio, /className="studio-canvas__body" \{\.\.\.axes\}><SpecimenScopeContext\.Provider value=\{specimens\}>/);
  assert.doesNotMatch(studio, /documentElement[^\n]*brand/);
});
