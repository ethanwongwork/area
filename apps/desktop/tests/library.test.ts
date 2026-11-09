// A system's library (src/library.ts over src/systems.ts; docs/research/system-inventory-2026-11-08): inventory and
// structure stay a list of differences from Area's manifests, every edit keeps one value per axis with a default, the
// gallery's tiles read their choices from their names, and the working copy's library is published, compared, discarded
// and read back from its file.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  chooseStructure, offerStructure, resetFamily, resolveFamily, setDefault, setFamilyIncluded, setValueIncluded, STRUCTURES,
  systemDefaults, tileChoices, tileLeftOut, type ManifestShape,
} from "../src/library.ts";
import { changesOf, EMPTY_LIBRARY, proposedKind, publish, readLibrary, readSystem, revertTo, starterSystem, systemFile, type Restorers } from "../src/systems.ts";

const BUTTON: ManifestShape = {
  variants: { variant: ["solid", "soft", "outline", "ghost"], tone: ["neutral", "info", "danger"], size: ["sm", "md", "lg"], align: ["start", "end"] },
  defaults: { variant: "solid", tone: "neutral", size: "md" },
  states: ["disabled", "loading", "selected"],
};
const TABS: ManifestShape = { variants: { size: ["sm", "md", "lg"], orientation: ["vertical"], selection: ["plate"] }, defaults: { size: "md" }, states: ["selected", "disabled"] };
const INPUT: ManifestShape = { variants: { variant: ["outline", "soft"], size: ["sm", "md", "lg"] }, defaults: { variant: "outline", size: "md" } };
const manifests = (slug: string) => ({ button: BUTTON, tabs: TABS, input: INPUT, select: INPUT, textarea: INPUT } as Record<string, ManifestShape>)[slug];

test("an empty library is Area as it ships", () => {
  const button = resolveFamily("button", undefined, BUTTON);
  assert.equal(button.included, true);
  assert.deepEqual(button.axes.map(axis => [axis.axis, axis.default]), [["variant", "solid"], ["tone", "neutral"], ["size", "md"], ["align", undefined]]);
  assert.ok(button.axes.every(axis => axis.values.every(value => value.included)));
  // Tabs' underline has no modifier: the structure's base is offered first and is the default.
  const tabs = resolveFamily("tabs", undefined, TABS).axes.find(axis => axis.axis === "selection")!;
  assert.deepEqual(tabs.values.map(value => value.value), ["marker", "plate"]);
  assert.equal(tabs.default, "marker");
});

test("leaving a value out keeps one per axis and moves a left-out default", () => {
  let library = setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "variant", "outline", false);
  assert.deepEqual(library.families.button, { leftOut: { variant: ["outline"] } });
  library = setValueIncluded(library, "button", BUTTON, "variant", "solid", false);
  assert.deepEqual(library.families.button, { leftOut: { variant: ["solid", "outline"] }, defaults: { variant: "soft" } });
  library = setValueIncluded(library, "button", BUTTON, "variant", "soft", false);
  library = setValueIncluded(library, "button", BUTTON, "variant", "ghost", false);
  // Ghost is the last: it stays, and is the default.
  const variant = resolveFamily("button", library.families.button, BUTTON).axes[0]!;
  assert.deepEqual(variant.values.filter(value => value.included).map(value => value.value), ["ghost"]);
  assert.equal(variant.default, "ghost");
  // A kept state never leaves; another may.
  assert.equal(setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "state", "selected", false), EMPTY_LIBRARY);
  assert.deepEqual(setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "state", "loading", false).families.button, { leftOut: { state: ["loading"] } });
  // An axis with no default may lose every value.
  const aligned = setValueIncluded(setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "align", "start", false), "button", BUTTON, "align", "end", false);
  assert.deepEqual(aligned.families.button, { leftOut: { align: ["start", "end"] } });
});

test("a default back at the manifest's, and an empty family, are dropped", () => {
  let library = setDefault(EMPTY_LIBRARY, "button", BUTTON, "variant", "soft");
  assert.deepEqual(library.families.button, { defaults: { variant: "soft" } });
  library = setDefault(library, "button", BUTTON, "variant", "solid");
  assert.deepEqual(library.families, {});
  // Setting a left-out value as the default brings it back.
  library = setDefault(setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "tone", "danger", false), "button", BUTTON, "tone", "danger");
  assert.deepEqual(library.families.button, { defaults: { tone: "danger" } });
  library = setFamilyIncluded(library, "button", BUTTON, false);
  assert.deepEqual(library.families.button, { included: false, defaults: { tone: "danger" } });
  assert.deepEqual(setFamilyIncluded(library, "button", BUTTON, true).families.button, { defaults: { tone: "danger" } });
  assert.deepEqual(resetFamily(library, "button"), EMPTY_LIBRARY);
});

test("a structure sets every family it reaches", () => {
  const shell = STRUCTURES.find(entry => entry.id === "field-shell")!;
  let library = chooseStructure(EMPTY_LIBRARY, shell, "soft", manifests);
  assert.deepEqual(library.families, { input: { defaults: { variant: "soft" } }, select: { defaults: { variant: "soft" } }, textarea: { defaults: { variant: "soft" } } });
  library = offerStructure(library, shell, "outline", false, manifests);
  assert.deepEqual(library.families.input, { leftOut: { variant: ["outline"] }, defaults: { variant: "soft" } });
  const tabs = chooseStructure(EMPTY_LIBRARY, STRUCTURES.find(entry => entry.id === "tabs-selection")!, "plate", manifests);
  assert.deepEqual(tabs.families.tabs, { defaults: { selection: "plate" } });
  // The provider's value: per manifest name, only moved defaults.
  assert.deepEqual(systemDefaults(library, slug => slug === "input" ? "input" : slug === "select" ? "select" : undefined), { input: { variant: "soft" }, select: { variant: "soft" } });
});

test("a tile's name says which choices it shows", () => {
  assert.deepEqual(tileChoices("size-sm", BUTTON), [{ axis: "size", value: "sm" }]);
  assert.deepEqual(tileChoices("outline-danger", BUTTON), [{ axis: "variant", value: "outline" }, { axis: "tone", value: "danger" }]);
  assert.deepEqual(tileChoices("state-loading", BUTTON), [{ axis: "state", value: "loading" }]);
  assert.deepEqual(tileChoices("variant-ghost", BUTTON), [{ axis: "variant", value: "ghost" }]);
  assert.deepEqual(tileChoices("composition-iconLabel", BUTTON), []);
  assert.deepEqual(tileChoices("default", BUTTON), []);
  const library = setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "tone", "danger", false);
  const resolved = resolveFamily("button", library.families.button, BUTTON);
  assert.equal(tileLeftOut("outline-danger", resolved, BUTTON), true);
  assert.equal(tileLeftOut("outline-info", resolved, BUTTON), false);
});

const RESTORE = {
  canvas: saved => ({ type: "13", ...(saved as object) }),
  material: saved => (saved && typeof saved === "object" ? saved : { bundle: "none", overrides: {} }),
  colours: saved => (saved && typeof saved === "object" ? saved : { light: null, dark: null }),
  accent: saved => (saved && typeof saved === "object" ? saved : { on: false }),
} as Restorers;

test("the working copy's library publishes, compares, discards and reads back", () => {
  const system = starterSystem("Northwind", [], RESTORE, "starter", new Date("2026-11-08T12:00:00Z"));
  assert.deepEqual(system.library, EMPTY_LIBRARY);
  assert.deepEqual(changesOf(system), []);
  const edited = { ...system, library: setDefault(setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "tone", "danger", false), "tabs", TABS, "selection", "plate") };
  const changes = changesOf(edited);
  assert.deepEqual(changes.map(change => [change.family, change.what, change.axis, change.value ?? change.after]), [["button", "left-out", "tone", "danger"], ["tabs", "default", "selection", "plate"]]);
  assert.equal(proposedKind(changes), "needs-work");
  assert.equal(proposedKind(changes.slice(1)), "fixes");
  const published = publish(edited, "needs-work", "No danger tone");
  assert.deepEqual(changesOf(published), []);
  assert.deepEqual(published.releases.at(-1)!.library, edited.library);
  // Bringing it back adds.
  const back = { ...published, library: setValueIncluded(published.library, "button", BUTTON, "tone", "danger", true) };
  assert.equal(proposedKind(changesOf(back)), "adds");
  assert.deepEqual(revertTo(back).library, edited.library);
  assert.deepEqual(revertTo(back, "1.0").library, EMPTY_LIBRARY);
  // The file round trip; a file from before libraries reads as everything included.
  const read = readSystem(JSON.parse(JSON.stringify(systemFile(back))), RESTORE)!;
  assert.deepEqual(read.library, back.library);
  assert.deepEqual(read.releases.map(release => release.library), back.releases.map(release => release.library));
  const old = systemFile(system) as Record<string, unknown>;
  delete old.library;
  assert.deepEqual(readSystem(old, RESTORE)!.library, EMPTY_LIBRARY);
  assert.deepEqual(readLibrary({ families: { Bad: {}, button: { included: true, leftOut: { tone: ["danger", 3, "danger"] }, defaults: { size: 2 } } } }), { families: { button: { leftOut: { tone: ["danger"] } } } });
});

test("a screen's written uses of what a release leaves out", async () => {
  const { usesIn } = await import("../src/library.ts");
  const code = `<Button>Action</Button><Button variant="outline">Secondary</Button><ButtonGroup /><Button variant={"outline"} tone="danger">Delete</Button>`;
  assert.equal(usesIn(code, "Button"), 3);
  assert.equal(usesIn(code, "Button", "variant", "outline"), 2);
  assert.equal(usesIn(code, "Button", "tone", "danger"), 1);
  assert.equal(usesIn(code, "Tabs"), 0);
});

test("a project keeps its version until a release that needs work, then follows again after it updates", async () => {
  const { followedVersion, releasesAfter, asRelease } = await import("../src/systems.ts");
  let system = starterSystem("Northwind", [], RESTORE, "starter", new Date("2026-11-08T12:00:00Z"));
  system = publish(system, "fixes", "");        // 1.0.1
  system = publish(system, "adds", "");         // 1.1
  const withOut = { ...system, library: setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "tone", "danger", false) };
  system = publish(withOut, "needs-work", "");  // 2.0
  system = publish(system, "fixes", "");        // 2.0.1
  assert.deepEqual(system.releases.map(release => release.version), ["1.0", "1.0.1", "1.1", "2.0", "2.0.1"]);
  assert.equal(followedVersion(system, "1.0"), "1.1");
  assert.equal(followedVersion(system, "2.0"), "2.0.1");
  assert.equal(followedVersion(system, undefined), "2.0.1");
  assert.equal(followedVersion(system, "9.9"), "2.0.1");
  assert.deepEqual(releasesAfter(system, "1.1").map(release => release.version), ["2.0", "2.0.1"]);
  assert.deepEqual(asRelease(system, "1.1").library, EMPTY_LIBRARY);
  assert.deepEqual(asRelease(system, "2.0").library, withOut.library);
});

test("each release's library reaches the code generator's definition", async () => {
  const { libraryOutputOf } = await import("../src/library.ts");
  const { definitionFromSystem } = await import("../../../packages/output/src/definition.ts");
  const families = [{ slug: "button", block: "area-button", manifest: BUTTON }, { slug: "tabs", block: "area-tabs", manifest: TABS }, { slug: "input", block: "area-input", manifest: INPUT }];
  let library = setValueIncluded(EMPTY_LIBRARY, "button", BUTTON, "tone", "danger", false);
  library = setValueIncluded(library, "button", BUTTON, "state", "loading", false);
  library = setDefault(library, "tabs", TABS, "selection", "plate");
  library = setFamilyIncluded(library, "input", INPUT, false);
  const out = libraryOutputOf(library, families);
  assert.deepEqual(out, { inventory: { components: ["button", "tabs"], exclude: { button: { tone: ["danger"] } }, icons: "all" }, structure: { "tabs.selection": "plate" } });
  assert.deepEqual(libraryOutputOf(EMPTY_LIBRARY, families), { inventory: { components: "all", exclude: {}, icons: "all" }, structure: {} });
  const system = publish({ ...starterSystem("Northwind", [], RESTORE, "starter", new Date("2026-11-08T12:00:00Z")), library }, "needs-work", "");
  const file = JSON.parse(JSON.stringify(systemFile(system, undefined, entry => libraryOutputOf(entry, families))));
  assert.deepEqual(definitionFromSystem(file).inventory, { components: ["button", "tabs"], exclude: { button: { tone: ["danger"] } }, icons: "all" });
  assert.deepEqual(definitionFromSystem(file).structure, { "tabs.selection": "plate" });
  // The first version, from before the change, holds everything.
  assert.equal(definitionFromSystem(file, "1.0").inventory.components, "all");
});
