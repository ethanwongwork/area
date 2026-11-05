// The places (src/places.ts): every old link lands where the app structure plan's table says
// (docs/research/app-structure-2026-10-28/README.md, "Where today's tabs go"), every place's hash reads back as itself,
// a tab saved before the places opens where its tab went, and Home is the fixed first tab (Phase 2). The systems
// (src/systems.ts; brands until 2026-10-29): a system's file reads back, the settings saved before systems become the
// Area system's Default once, and a #brand/… link from before the rename opens its #system/… place.
import { test } from "node:test";
import assert from "node:assert/strict";
import { systemName, HOME_TAB, hrefOf, parsePlace, redirect, resolve, restoreTabs, setProjects, setSystems, tabHolds, tabKind, tabName, type Place } from "../src/places.ts";
import { activeTheme, systemFile, systemSlug, loadSystems, newTheme, readSystem, starterSystem, withTheme, type Restorers } from "../src/systems.ts";

const AREA_ONLY = [{ id: "area", name: "Area" }];
setSystems(AREA_ONLY);

const groupOf = (setting: string) => ({ radius: "shape", type: "size", motion: "effects" } as Record<string, string>)[setting];

test("every old tab's link redirects to its place", () => {
  const cases: Array<[string, string]> = [
    ["#theme", "#system/area/themes"],
    ["#language", "#system/area/themes"],
    ["#theme/radius", "#system/area/themes/settings/shape/radius"],
    ["#theme/unknown-setting", "#system/area/themes/settings"],
    ["#components", "#system/area/components"],
    ["#components/button", "#system/area/components/button"],
    ["#components/button/size-sm", "#system/area/components/button/size-sm"],
    ["#typography", "#system/area/typography"],
    ["#typography/heading-1", "#system/area/typography/heading-1"],
    ["#color/blue", "#system/area/colors/blue"],
    ["#icons", "#system/area/icons"],
    ["#icons/navigation", "#system/area/icons/navigation"],
    ["#testing", "#system/area/patterns"],
    ["#testing/analytics", "#system/area/patterns/analytics"],
    ["#examples/chat", "#system/area/patterns/chat"],
    // A screen that tries something out is in Labs › Tests since 2026-10-31.
    ["#testing/hairline", "#labs/tests/hairline"],
    ["#system/area/patterns/stroke-groups", "#labs/tests/stroke-groups"],
    // Imagery, then the Library page, is Inspiration since 2026-10-29.
    ["#imagery", "#references"],
    ["#imagery/folder-1/image-2", "#references/folder-1/image-2"],
    ["#library", "#references"],
    ["#library/folder-1/image-2", "#references/folder-1/image-2"],
    ["#brand", "#references"],
    ["#brand/folder-1", "#references/folder-1"],
    ["#inspiration", "#references"],
    ["#inspiration/folder-1/image-2", "#references/folder-1/image-2"],
    // Systems were brands until 2026-10-29.
    ["#brand/area/themes", "#system/area/themes"],
    ["#brand/area/components/button/size-sm", "#system/area/components/button/size-sm"],
    ["#brand/area/foundations/shape/radius", "#system/area/themes/settings/shape/radius"],
    // Foundations held Colors, Typography, Icons and the setting groups until 2026-10-31.
    ["#system/area/foundations", "#system/area/themes/settings"],
    ["#system/area/foundations/color/blue", "#system/area/colors/blue"],
    ["#system/area/foundations/typography/heading-1", "#system/area/typography/heading-1"],
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
  setSystems([...AREA_ONLY, { id: "northwind", name: "Northwind" }]);
  setProjects([{ id: "launch", name: "Spring launch" }]);
  const places: Place[] = [
    { page: "home" }, { page: "home", item: "northwind" },
    { page: "themes", system: "area" }, { page: "theme-setup", system: "area" }, { page: "foundations", system: "area" },
    { page: "settings", system: "area", group: "shape" }, { page: "settings", system: "area", group: "shape", item: "radius" },
    { page: "color", system: "area", item: "blue" }, { page: "typography", system: "area" }, { page: "icons", system: "area", item: "arrows" }, { page: "illustrations", system: "area", item: "screens" },
    // A typeface in Typography, and one of its tabs (src/pages/typography.tsx).
    { page: "typography", system: "area", item: "face/inter" }, { page: "typography", system: "area", item: "face/inter/glyphs" },
    { page: "components", system: "area", item: "button/size-sm" }, { page: "patterns", system: "area", item: "analytics" },
    // Tokens and the foundations that had been settings only (2026-10-31); References' views.
    { page: "tokens", system: "area" }, { page: "tokens", system: "area", item: "color" }, { page: "spacing", system: "area" },
    { page: "shape", system: "area" }, { page: "elevation", system: "northwind" }, { page: "motion", system: "area" },
    { page: "references", item: "discover" }, { page: "references", item: "following" },
    { page: "themes", system: "northwind", item: "theme-2" }, { page: "components", system: "northwind", item: "button" },
    { page: "references", item: "a b/c" }, { page: "projects" }, { page: "systems", item: "area" }, { page: "materials", item: "glass" }, { page: "tests", item: "hairline" }, { page: "feed" }, { page: "history", system: "area", item: "1.2" },
    { page: "project", project: "launch" }, { page: "project-page", project: "launch", item: "page-1/layer-2" },
    { page: "exploration", project: "launch", item: "exploration-1" }, { page: "versions", project: "launch" }, { page: "versions", project: "launch", item: "version-1" },
  ];
  for (const place of places) {
    const hash = hrefOf(place);
    const back = parsePlace(hash);
    assert.ok(back, `${hash} does not parse`);
    assert.equal(hrefOf(back), hash);
    assert.deepEqual({ ...back, item: back.item ?? undefined }, { item: undefined, ...place });
  }
  // A system's place without a system is the Area system's, as old links are.
  assert.equal(hrefOf({ page: "components", item: "button" }), "#system/area/components/button");
  setSystems(AREA_ONLY);
  setProjects([]);
});

test("hashes that are not places are left alone", () => {
  // Example screens link to their own sections (the Workspace keeps their "#home" from opening Home); a system this
  // workspace doesn't have is no place.
  for (const hash of ["#settings", "#overview", "#gallery-nav-icons", "#system/northwind/themes", "#brand/northwind/themes", "#project/gone", ""]) {
    assert.equal(resolve(hash, groupOf), null, hash);
  }
  assert.deepEqual(parsePlace("#home"), { page: "home", item: undefined });
});

test("a second system is a place once the workspace has it, and tabs are named by what they hold", () => {
  assert.equal(parsePlace("#system/northwind/components"), null);
  setSystems([...AREA_ONLY, { id: "northwind", name: "Northwind" }]);
  const place = parsePlace("#system/northwind/foundations/shape/radius")!;
  assert.deepEqual(place, { page: "settings", system: "northwind", group: "shape", item: "radius" });
  assert.equal(tabName(place), "Northwind");
  assert.equal(systemName("northwind"), "Northwind");
  assert.equal(tabName({ page: "home" }), "Home");
  assert.equal(tabHolds(place), "system:northwind");
  assert.equal(tabHolds({ page: "components" }), "system:area");
  assert.notEqual(tabHolds(place), tabHolds({ page: "references" }));
  // An old link is still the Area system's; a link from before the rename keeps its system.
  assert.equal(hrefOf(resolve("#brand/northwind/patterns/chat", groupOf)!), "#system/northwind/patterns/chat");
  assert.equal(hrefOf(resolve("#components/button", groupOf)!), "#system/area/components/button");
  setSystems(AREA_ONLY);
});

test("a tab holds one project or Library item: everything inside it is the same tab", () => {
  setProjects([{ id: "launch", name: "Spring launch" }]);
  const overview: Place = { page: "project", project: "launch" };
  for (const inside of [{ page: "project-page", project: "launch", item: "page-1/layer-1" }, { page: "exploration", project: "launch", item: "exploration-1" }, { page: "versions", project: "launch" }] as Place[]) {
    assert.equal(tabHolds(inside), tabHolds(overview));
    assert.equal(tabName(inside), "Spring launch");
  }
  assert.equal(tabHolds(overview), "project:launch");
  assert.notEqual(tabHolds(overview), tabHolds({ page: "themes", system: "area" }));
  assert.equal(tabHolds({ page: "history", system: "area" }), tabHolds({ page: "components", system: "area" }));
  assert.equal(tabName({ page: "references", item: "folder-1" }), "References");
  setProjects([]);
});

test("the saved tab migrates once; saved tabs restore after Home", () => {
  assert.deepEqual(restoreTabs(undefined, "imagery"), { tabs: [{ id: "t1", hash: "#references", panel: "page" }], current: "t1" });
  assert.deepEqual(restoreTabs(undefined, "theme"), { tabs: [{ id: "t1", hash: "#system/area/themes", panel: "nav" }], current: "t1" });
  // Nothing saved: Home alone.
  assert.deepEqual(restoreTabs(undefined, undefined), { tabs: [], current: HOME_TAB });
  // A tab saved before the rename (#brand/area/…) opens on its #system/ place.
  const saved = { tabs: [{ id: "a", hash: "#library/x", panel: "nav" }, { id: "b", hash: "#nowhere", panel: "page" }, { id: "c", hash: "#brand/area/patterns", panel: "page" }], current: "c" };
  assert.deepEqual(restoreTabs(saved, "components"), { tabs: [{ id: "a", hash: "#references/x", panel: "nav" }, { id: "c", hash: "#system/area/patterns", panel: "page" }], current: "c" });
  assert.equal(restoreTabs({ tabs: [{ id: "a", hash: "#library", panel: "nav" }], current: "gone" }, null).current, "a");
  // Home is never saved as a tab of its own; the current tab may be Home; every tab closed is Home alone.
  assert.deepEqual(restoreTabs({ tabs: [{ id: "h", hash: "#home", panel: "nav" }, { id: "a", hash: "#library", panel: "nav" }], current: HOME_TAB }, null),
    { tabs: [{ id: "a", hash: "#references", panel: "nav" }], current: HOME_TAB });
  assert.deepEqual(restoreTabs({ tabs: [], current: HOME_TAB }, "components"), { tabs: [], current: HOME_TAB });
  // A deleted system's tab is gone.
  assert.deepEqual(restoreTabs({ tabs: [{ id: "n", hash: "#system/northwind/themes", panel: "nav" }], current: "n" }, null), { tabs: [], current: HOME_TAB });
});

/* Systems. The app's restore functions validate every value (src/studio.tsx); these stand in for them: a Canvas keeps only
   known settings over the defaults, and the rest pass through. */
const DEFAULTS = { type: "13", radius: "10" } as Record<string, string>;
const RESTORE = {
  canvas: saved => ({ ...DEFAULTS, ...Object.fromEntries(Object.entries(saved as Record<string, unknown>).filter(([key, value]) => key in DEFAULTS && typeof value === "string")) }),
  material: saved => (saved && typeof saved === "object" ? saved : { bundle: "none", overrides: {} }),
  colours: (saved, canvas) => (saved && typeof saved === "object" ? saved : { light: canvas.radius === "4" ? "#f0f0f0" : null, dark: null }),
  accent: saved => (saved && typeof saved === "object" ? saved : { on: false, primary: "#006df5", secondary: null, tertiary: null, status: "harmonised" }),
} as Restorers;
const NOW = new Date("2026-10-29T12:00:00Z");

test("the settings saved before systems become the Area system's Default theme, once", () => {
  const legacy = { canvas: { radius: "4", type: "14", unknown: "x", positions: 1 }, material: { bundle: "glass", overrides: {} }, colours: null, brand: { on: true, primary: "#00b65c" } };
  let read = 0;
  const first = loadSystems([], () => { read++; return legacy; }, RESTORE, NOW);
  assert.equal(read, 1);
  assert.ok(first.migrated);
  assert.deepEqual(first.systems.map(system => system.id), ["area"]);
  const area = first.systems[0]!;
  assert.equal(area.origin, "area");
  assert.deepEqual(activeTheme(area).canvas, { type: "14", radius: "4" });
  assert.deepEqual(activeTheme(area).material, { bundle: "glass", overrides: {} });
  // No colours saved: the saved Canvas's page presets convert (restoreColours' own rule).
  assert.deepEqual(activeTheme(area).colours, { light: "#f0f0f0", dark: null });
  assert.equal(activeTheme(area).accent.on, true);
  // Written and read back, the system is the same, and the old settings are not read again.
  const file = JSON.parse(JSON.stringify(systemFile(area)));
  const again = loadSystems([file], () => { read++; return legacy; }, RESTORE, NOW);
  assert.equal(read, 1);
  assert.equal(again.migrated, null);
  assert.deepEqual(again.systems, first.systems);
});

test("system files: ids, broken files, Area first, new systems and themes", () => {
  assert.equal(systemSlug("Northwind Labs", []), "northwind-labs");
  assert.equal(systemSlug("Northwind", ["northwind"]), "northwind-2");
  assert.equal(systemSlug("New", []), "new-2");
  assert.equal(systemSlug("✨", []), "system");
  assert.equal(readSystem({ id: "Bad id", name: "x", themes: [{}] }, RESTORE), null);
  assert.equal(readSystem({ id: "x", name: "X", themes: [] }, RESTORE), null);
  const made = starterSystem("Northwind", ["area"], RESTORE, "starter", NOW);
  assert.deepEqual({ id: made.id, theme: made.theme, themes: made.themes.length }, { id: "northwind", theme: "default", themes: 1 });
  assert.deepEqual(activeTheme(made).canvas, DEFAULTS);
  const loaded = loadSystems([systemFile(made), "not a system", systemFile(made)], () => ({ canvas: {}, material: null, colours: null, brand: null }), RESTORE, NOW);
  assert.deepEqual(loaded.systems.map(system => system.id), ["area", "northwind"]);
  // A second theme, chosen, changed alone.
  const second = newTheme(made, RESTORE);
  assert.deepEqual({ id: second.id, name: second.name }, { id: "theme-2", name: "Theme 2" });
  const two = withTheme({ ...made, themes: [...made.themes, second], theme: second.id }, theme => ({ ...theme, canvas: { ...theme.canvas, radius: "0" } }));
  assert.equal(two.themes[0]!.canvas.radius, "10");
  assert.equal(two.themes[1]!.canvas.radius, "0");
  // A file naming a theme it lacks uses its first.
  assert.equal(readSystem({ ...systemFile(two), theme: "gone" }, RESTORE)!.theme, "default");
});

// Projects and Systems, two of the Sidebar's four places (2026-11-01): each a tab of its own, as References is.
test("Projects and Systems are tabs of their own", () => {
  assert.deepEqual(parsePlace("#projects"), { page: "projects", item: undefined });
  assert.deepEqual(parsePlace("#systems/area"), { page: "systems", item: "area" });
  assert.equal(tabKind({ page: "projects" }), "projects");
  assert.equal(tabName({ page: "systems" }), "Systems");
  assert.equal(tabHolds({ page: "projects", item: "one" }), tabHolds({ page: "projects" }));
});
