// The places (src/places.ts): every old link lands where the app structure plan's table says
// (docs/research/app-structure-2026-10-28/README.md, "Where today's tabs go"), every place's hash reads back as itself,
// and a tab saved before the places opens where its tab went.
import { test } from "node:test";
import assert from "node:assert/strict";
import { hrefOf, parsePlace, redirect, resolve, restoreTabs, type Place } from "../src/places.ts";

const groupOf = (setting: string) => ({ radius: "shape", type: "size", motion: "effects" } as Record<string, string>)[setting];

test("every old tab's link redirects to its place", () => {
  const cases: Array<[string, string]> = [
    ["#theme", "#brand/area/themes"],
    ["#language", "#brand/area/themes"],
    ["#theme/radius", "#brand/area/foundations/shape/radius"],
    ["#theme/unknown-setting", "#brand/area/foundations"],
    ["#components", "#brand/area/components"],
    ["#components/button", "#brand/area/components/button"],
    ["#components/button/size-sm", "#brand/area/components/button/size-sm"],
    ["#typography", "#brand/area/foundations/typography"],
    ["#typography/heading-1", "#brand/area/foundations/typography/heading-1"],
    ["#color/blue", "#brand/area/foundations/color/blue"],
    ["#icons", "#brand/area/foundations/icons"],
    ["#icons/navigation", "#brand/area/foundations/icons/navigation"],
    ["#testing", "#brand/area/patterns"],
    ["#testing/analytics", "#brand/area/patterns/analytics"],
    ["#examples/chat", "#brand/area/patterns/chat"],
    ["#imagery", "#library"],
    ["#imagery/folder-1/image-2", "#library/folder-1/image-2"],
    ["#brand", "#library"],
    ["#brand/folder-1", "#library/folder-1"],
    ["#materials", "#labs/materials"],
    ["#materials/glass", "#labs/materials/glass"],
  ];
  for (const [old, now] of cases) {
    const place = resolve(old, groupOf);
    assert.ok(place, `${old} lands nowhere`);
    assert.equal(hrefOf(place), now, old);
  }
});

test("a place's hash reads back as the same place", () => {
  const places: Place[] = [
    { page: "themes" }, { page: "theme-setup" }, { page: "foundations" },
    { page: "settings", group: "shape" }, { page: "settings", group: "shape", item: "radius" },
    { page: "color", item: "blue" }, { page: "typography" }, { page: "icons", item: "arrows" },
    { page: "components", item: "button/size-sm" }, { page: "patterns", item: "analytics" },
    { page: "library", item: "a b/c" }, { page: "materials", item: "glass" },
  ];
  for (const place of places) {
    const hash = hrefOf(place);
    const back = parsePlace(hash);
    assert.ok(back, `${hash} does not parse`);
    assert.equal(hrefOf(back), hash);
    assert.deepEqual({ ...back, item: back.item ?? undefined }, { item: undefined, ...place });
  }
});

test("hashes that are not places are left alone", () => {
  // Example screens link to their own sections; Home is Phase 2's.
  for (const hash of ["#home", "#settings", "#overview", "#gallery-nav-icons", "#brand/northwind/themes", ""]) {
    assert.equal(parsePlace(hash), null, hash);
    assert.equal(redirect(hash, groupOf), null, hash);
  }
});

test("the saved tab migrates once; saved tabs restore", () => {
  assert.deepEqual(restoreTabs(undefined, "imagery"), { tabs: [{ id: "t1", hash: "#library", panel: "page" }], current: "t1" });
  assert.deepEqual(restoreTabs(undefined, "theme"), { tabs: [{ id: "t1", hash: "#brand/area/themes", panel: "nav" }], current: "t1" });
  assert.equal(restoreTabs(undefined, undefined).tabs[0]!.hash, "#brand/area/components");
  const saved = { tabs: [{ id: "a", hash: "#library/x", panel: "nav" }, { id: "b", hash: "#nowhere", panel: "page" }, { id: "c", hash: "#brand/area/patterns", panel: "page" }], current: "c" };
  assert.deepEqual(restoreTabs(saved, "components"), { tabs: [{ id: "a", hash: "#library/x", panel: "nav" }, { id: "c", hash: "#brand/area/patterns", panel: "page" }], current: "c" });
  assert.equal(restoreTabs({ tabs: [{ id: "a", hash: "#library", panel: "nav" }], current: "gone" }, null).current, "a");
});
