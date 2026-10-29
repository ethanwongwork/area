// The places (src/places.ts): every old link lands where the app structure plan's table says
// (docs/research/app-structure-2026-10-28/README.md, "Where today's tabs go"), every place's hash reads back as itself,
// a tab saved before the places opens where its tab went, and Home is the fixed first tab (Phase 2). The brands
// (src/brands.ts): a brand's file reads back, and the settings saved before brands become the Area brand's Default once.
import { test } from "node:test";
import assert from "node:assert/strict";
import { brandName, HOME_TAB, hrefOf, parsePlace, redirect, resolve, restoreTabs, setBrands, tabHolds, tabName, type Place } from "../src/places.ts";
import { activeTheme, brandFile, brandSlug, loadBrands, newTheme, readBrand, starterBrand, withTheme, type Restorers } from "../src/brands.ts";

const AREA_ONLY = [{ id: "area", name: "Area" }];
setBrands(AREA_ONLY);

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
  setBrands([...AREA_ONLY, { id: "northwind", name: "Northwind" }]);
  const places: Place[] = [
    { page: "home" }, { page: "home", item: "northwind" },
    { page: "themes", brand: "area" }, { page: "theme-setup", brand: "area" }, { page: "foundations", brand: "area" },
    { page: "settings", brand: "area", group: "shape" }, { page: "settings", brand: "area", group: "shape", item: "radius" },
    { page: "color", brand: "area", item: "blue" }, { page: "typography", brand: "area" }, { page: "icons", brand: "area", item: "arrows" },
    { page: "components", brand: "area", item: "button/size-sm" }, { page: "patterns", brand: "area", item: "analytics" },
    { page: "themes", brand: "northwind", item: "theme-2" }, { page: "components", brand: "northwind", item: "button" },
    { page: "library", item: "a b/c" }, { page: "materials", item: "glass" },
  ];
  for (const place of places) {
    const hash = hrefOf(place);
    const back = parsePlace(hash);
    assert.ok(back, `${hash} does not parse`);
    assert.equal(hrefOf(back), hash);
    assert.deepEqual({ ...back, item: back.item ?? undefined }, { item: undefined, ...place });
  }
  // A brand's place without a brand is the Area brand's, as old links are.
  assert.equal(hrefOf({ page: "components", item: "button" }), "#brand/area/components/button");
  setBrands(AREA_ONLY);
});

test("hashes that are not places are left alone", () => {
  // Example screens link to their own sections (the Workspace keeps their "#home" from opening Home); a brand this
  // workspace doesn't have is no place.
  for (const hash of ["#settings", "#overview", "#gallery-nav-icons", "#brand/northwind/themes", ""]) {
    assert.equal(parsePlace(hash), null, hash);
    assert.equal(redirect(hash, groupOf), null, hash);
  }
  assert.deepEqual(parsePlace("#home"), { page: "home", item: undefined });
});

test("a second brand is a place once the workspace has it, and tabs are named by what they hold", () => {
  assert.equal(parsePlace("#brand/northwind/components"), null);
  setBrands([...AREA_ONLY, { id: "northwind", name: "Northwind" }]);
  const place = parsePlace("#brand/northwind/foundations/shape/radius")!;
  assert.deepEqual(place, { page: "settings", brand: "northwind", group: "shape", item: "radius" });
  assert.equal(tabName(place), "Northwind");
  assert.equal(brandName("northwind"), "Northwind");
  assert.equal(tabName({ page: "home" }), "Home");
  assert.equal(tabHolds(place), "brand:northwind");
  assert.equal(tabHolds({ page: "components" }), "brand:area");
  assert.notEqual(tabHolds(place), tabHolds({ page: "library" }));
  // An old link is still the Area brand's.
  assert.equal(hrefOf(resolve("#components/button", groupOf)!), "#brand/area/components/button");
  setBrands(AREA_ONLY);
});

test("the saved tab migrates once; saved tabs restore after Home", () => {
  assert.deepEqual(restoreTabs(undefined, "imagery"), { tabs: [{ id: "t1", hash: "#library", panel: "page" }], current: "t1" });
  assert.deepEqual(restoreTabs(undefined, "theme"), { tabs: [{ id: "t1", hash: "#brand/area/themes", panel: "nav" }], current: "t1" });
  // Nothing saved: Home alone.
  assert.deepEqual(restoreTabs(undefined, undefined), { tabs: [], current: HOME_TAB });
  const saved = { tabs: [{ id: "a", hash: "#library/x", panel: "nav" }, { id: "b", hash: "#nowhere", panel: "page" }, { id: "c", hash: "#brand/area/patterns", panel: "page" }], current: "c" };
  assert.deepEqual(restoreTabs(saved, "components"), { tabs: [{ id: "a", hash: "#library/x", panel: "nav" }, { id: "c", hash: "#brand/area/patterns", panel: "page" }], current: "c" });
  assert.equal(restoreTabs({ tabs: [{ id: "a", hash: "#library", panel: "nav" }], current: "gone" }, null).current, "a");
  // Home is never saved as a tab of its own; the current tab may be Home; every tab closed is Home alone.
  assert.deepEqual(restoreTabs({ tabs: [{ id: "h", hash: "#home", panel: "nav" }, { id: "a", hash: "#library", panel: "nav" }], current: HOME_TAB }, null),
    { tabs: [{ id: "a", hash: "#library", panel: "nav" }], current: HOME_TAB });
  assert.deepEqual(restoreTabs({ tabs: [], current: HOME_TAB }, "components"), { tabs: [], current: HOME_TAB });
  // A deleted brand's tab is gone.
  assert.deepEqual(restoreTabs({ tabs: [{ id: "n", hash: "#brand/northwind/themes", panel: "nav" }], current: "n" }, null), { tabs: [], current: HOME_TAB });
});

/* Brands. The app's restore functions validate every value (src/studio.tsx); these stand in for them: a Canvas keeps only
   known settings over the defaults, and the rest pass through. */
const DEFAULTS = { type: "13", radius: "10" } as Record<string, string>;
const RESTORE = {
  canvas: saved => ({ ...DEFAULTS, ...Object.fromEntries(Object.entries(saved as Record<string, unknown>).filter(([key, value]) => key in DEFAULTS && typeof value === "string")) }),
  material: saved => (saved && typeof saved === "object" ? saved : { bundle: "none", overrides: {} }),
  colours: (saved, canvas) => (saved && typeof saved === "object" ? saved : { light: canvas.radius === "4" ? "#f0f0f0" : null, dark: null }),
  accent: saved => (saved && typeof saved === "object" ? saved : { on: false, primary: "#006df5", secondary: null, tertiary: null, status: "harmonised" }),
} as Restorers;
const NOW = new Date("2026-10-29T12:00:00Z");

test("the settings saved before brands become the Area brand's Default theme, once", () => {
  const legacy = { canvas: { radius: "4", type: "14", unknown: "x", positions: 1 }, material: { bundle: "glass", overrides: {} }, colours: null, brand: { on: true, primary: "#00b65c" } };
  let read = 0;
  const first = loadBrands([], () => { read++; return legacy; }, RESTORE, NOW);
  assert.equal(read, 1);
  assert.ok(first.migrated);
  assert.deepEqual(first.brands.map(brand => brand.id), ["area"]);
  const area = first.brands[0]!;
  assert.equal(area.origin, "area");
  assert.deepEqual(activeTheme(area).canvas, { type: "14", radius: "4" });
  assert.deepEqual(activeTheme(area).material, { bundle: "glass", overrides: {} });
  // No colours saved: the saved Canvas's page presets convert (restoreColours' own rule).
  assert.deepEqual(activeTheme(area).colours, { light: "#f0f0f0", dark: null });
  assert.equal(activeTheme(area).accent.on, true);
  // Written and read back, the brand is the same, and the old settings are not read again.
  const file = JSON.parse(JSON.stringify(brandFile(area)));
  const again = loadBrands([file], () => { read++; return legacy; }, RESTORE, NOW);
  assert.equal(read, 1);
  assert.equal(again.migrated, null);
  assert.deepEqual(again.brands, first.brands);
});

test("brand files: ids, broken files, Area first, new brands and themes", () => {
  assert.equal(brandSlug("Northwind Labs", []), "northwind-labs");
  assert.equal(brandSlug("Northwind", ["northwind"]), "northwind-2");
  assert.equal(brandSlug("New", []), "new-2");
  assert.equal(brandSlug("✨", []), "brand");
  assert.equal(readBrand({ id: "Bad id", name: "x", themes: [{}] }, RESTORE), null);
  assert.equal(readBrand({ id: "x", name: "X", themes: [] }, RESTORE), null);
  const made = starterBrand("Northwind", ["area"], RESTORE, "starter", NOW);
  assert.deepEqual({ id: made.id, theme: made.theme, themes: made.themes.length }, { id: "northwind", theme: "default", themes: 1 });
  assert.deepEqual(activeTheme(made).canvas, DEFAULTS);
  const loaded = loadBrands([brandFile(made), "not a brand", brandFile(made)], () => ({ canvas: {}, material: null, colours: null, brand: null }), RESTORE, NOW);
  assert.deepEqual(loaded.brands.map(brand => brand.id), ["area", "northwind"]);
  // A second theme, chosen, changed alone.
  const second = newTheme(made, RESTORE);
  assert.deepEqual({ id: second.id, name: second.name }, { id: "theme-2", name: "Theme 2" });
  const two = withTheme({ ...made, themes: [...made.themes, second], theme: second.id }, theme => ({ ...theme, canvas: { ...theme.canvas, radius: "0" } }));
  assert.equal(two.themes[0]!.canvas.radius, "10");
  assert.equal(two.themes[1]!.canvas.radius, "0");
  // A file naming a theme it lacks uses its first.
  assert.equal(readBrand({ ...brandFile(two), theme: "gone" }, RESTORE)!.theme, "default");
});
