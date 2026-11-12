// Publishing and projects (the IA of 2026-10-29): a system's working copy against its Live release, the version a kind of
// publish makes, a project's publish of an exploration into its system, and a project's file, pages, layers and versions
// (src/systems.ts, src/projects.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { asLive, changesOf, liveOf, nextVersion, proposedKind, publish, publishTheme, readSystem, revertTo, starterSystem, systemFile, withTheme, type Restorers } from "../src/systems.ts";
import { addComment, addExploration, addLayer, addPage, changesOn, clearSent, deletePage, describeChange, duplicateLayer, duplicatePage, HISTORY_LIMIT, loadProjects, logChange, markSent, newProject, pendingChanges, projectFile, readProject, recordIteration, removeLayer, renameLayer, renamePage, restoreIteration, restoreVersion, saveVersion, undoChange } from "../src/projects.ts";

const DEFAULTS = { type: "13", radius: "10" } as Record<string, string>;
const RESTORE = {
  canvas: saved => ({ ...DEFAULTS, ...Object.fromEntries(Object.entries(saved as Record<string, unknown>).filter(([key, value]) => key in DEFAULTS && typeof value === "string")) }),
  material: saved => (saved && typeof saved === "object" ? saved : { bundle: "none", overrides: {} }),
  colours: saved => (saved && typeof saved === "object" ? saved : { light: null, dark: null }),
  accent: saved => (saved && typeof saved === "object" ? saved : { on: false, primary: "#006df5", secondary: null, tertiary: null, status: "harmonised" }),
} as Restorers;
const NOW = new Date("2026-10-29T12:00:00Z");
const radius = (value: string) => (theme: { canvas: Record<string, string> }) => ({ ...theme, canvas: { ...theme.canvas, radius: value } }) as never;

test("a new system is Live at 1.0 with nothing unpublished; an older file's themes become its first version", () => {
  const made = starterSystem("Northwind", ["area"], RESTORE, "starter", NOW);
  assert.equal(liveOf(made).version, "1.0");
  assert.deepEqual(changesOf(made), []);
  const { releases: _, ...older } = systemFile(made);
  const read = readSystem(older, RESTORE)!;
  assert.equal(read.releases.length, 1);
  assert.deepEqual(changesOf(read), []);
});

test("edits are the working copy until published; Live keeps the last release", () => {
  const made = starterSystem("Northwind", [], RESTORE, "starter", NOW);
  const edited = withTheme(made, radius("4"));
  assert.deepEqual(changesOf(edited), [{ theme: "Default", what: "radius", before: "10", after: "4" }]);
  assert.equal(asLive(edited).themes[0]!.canvas.radius, "10");
  assert.equal(proposedKind(changesOf(edited)), "fixes");
  const published = publish(edited, "fixes", "Smaller corners", NOW);
  assert.equal(liveOf(published).version, "1.0.1");
  assert.equal(liveOf(published).note, "Smaller corners");
  assert.deepEqual(changesOf(published), []);
  // Read back from its file, History is the same.
  assert.deepEqual(readSystem(JSON.parse(JSON.stringify(systemFile(published))), RESTORE)!.releases, published.releases);
  // Discard sets the working copy back to Live; Restore to an older version, ready to publish again.
  const again = withTheme(published, radius("0"));
  assert.equal(revertTo(again).themes[0]!.canvas.radius, "4");
  assert.equal(revertTo(again, "1.0").themes[0]!.canvas.radius, "10");
});

test("a kind is a version: Fixes a patch, Adds a minor, Needs work in products a major", () => {
  assert.equal(nextVersion("1.2", "fixes"), "1.2.1");
  assert.equal(nextVersion("1.2.1", "fixes"), "1.2.2");
  assert.equal(nextVersion("1.2.1", "adds"), "1.3");
  assert.equal(nextVersion("1.2.1", "needs-work"), "2.0");
  const made = starterSystem("Northwind", [], RESTORE, "starter", NOW);
  const added = { ...made, themes: [...made.themes, { ...made.themes[0]!, id: "dark", name: "Dark" }] };
  assert.equal(proposedKind(changesOf(added)), "adds");
  assert.equal(proposedKind(changesOf({ ...added, releases: [...added.releases, { ...liveOf(added), themes: added.themes }], themes: made.themes })), "needs-work");
});

test("a project's exploration publishes into its system, Live and working copy, and keeps the system's own edits", () => {
  const system = withTheme(starterSystem("Northwind", [], RESTORE, "starter", NOW), radius("6"));
  const project = newProject("Spring launch", system.id, "default", [], NOW);
  const { project: exploring, exploration } = addExploration(project, asLive(system).themes[0]!);
  assert.equal(exploration.from, "default");
  assert.equal(exploration.theme.canvas.radius, "10");
  const changed = { ...exploration.theme, canvas: { ...exploration.theme.canvas, type: "14" } };
  // As an update to Default: Live and the working copy take it in Default's place (an unpublished edit to Default itself is
  // replaced: the conflict view is not built yet).
  const updated = publishTheme(system, { ...changed, id: "default", name: "Default" }, "default", "fixes", "Bigger type", exploring.name, NOW);
  assert.equal(liveOf(updated).version, "1.0.1");
  assert.equal(liveOf(updated).from, "Spring launch");
  assert.equal(liveOf(updated).themes[0]!.canvas.type, "14");
  // As a new theme: added beside the others in both.
  const added = publishTheme(system, { ...changed, id: "launch-exploration-1", name: "Launch" }, null, "adds", "", exploring.name, NOW);
  assert.equal(liveOf(added).version, "1.1");
  assert.deepEqual(liveOf(added).themes.map(theme => theme.id), ["default", "launch-exploration-1"]);
  assert.deepEqual(added.themes.map(theme => theme.id), ["default", "launch-exploration-1"]);
  // The system's own edit stays unpublished on the theme it didn't touch.
  assert.equal(added.themes[0]!.canvas.radius, "6");
  assert.equal(liveOf(added).themes[0]!.canvas.radius, "10");
});

test("project files: pages, layers, explorations and versions read back; broken entries are left out", () => {
  let project = newProject("Spring launch", "area", "default", ["spring-launch"], NOW);
  assert.equal(project.id, "spring-launch-2");
  assert.deepEqual(project.pages.map(page => page.id), ["page-1"]);
  project = addPage(project).project;
  project = addLayer(project, "page-1", "screen", "analytics", "Analytics dashboard").project;
  project = addLayer(project, "page-2", "image", "folder-1/image-2", "Poster").project;
  assert.deepEqual(project.pages.map(page => page.layers.map(layer => layer.id)), [["layer-1"], ["layer-2"]]);
  project = saveVersion(project, "Before images", NOW);
  project = { ...project, pages: project.pages.slice(0, 1) };
  assert.equal(restoreVersion(project, "version-1").pages.length, 2);
  const file = JSON.parse(JSON.stringify(projectFile(project)));
  assert.deepEqual(readProject(file, RESTORE), project);
  assert.equal(readProject({ id: "x", name: "X" }, RESTORE), null);
  const messy = { ...file, pages: [{ id: "a", layers: [{ kind: "video", ref: "x" }, { kind: "screen", ref: "chat" }] }] };
  assert.deepEqual(readProject(messy, RESTORE)!.pages, [{ id: "a", name: "Page 1", layers: [{ id: "layer-1", kind: "screen", ref: "chat", name: "chat" }] }]);
  assert.deepEqual(loadProjects([file, "nothing", file], RESTORE).map(entry => entry.id), [project.id]);
});

test("iterations: every change to the pages is kept, said in words, and can be gone back to; comments and notes read back", () => {
  const start = newProject("Spring launch", "area", "default", [], NOW);
  const later = new Date("2026-10-29T13:00:00Z");
  let project = recordIteration(start, addLayer(start, "page-1", "screen", "analytics", "Analytics dashboard").project, later);
  assert.deepEqual(project.history.map(entry => entry.note), ["Before the first change", "Added Analytics dashboard to Page 1"]);
  assert.deepEqual(project.history[0]!.pages, start.pages);
  // A change that leaves the pages alone is no iteration.
  assert.equal(recordIteration(project, { ...project, notes: "Interviews" }).history.length, 2);
  project = recordIteration(project, addPage(project).project, later);
  assert.equal(project.history.at(-1)!.note, "Added Page 2");
  const twice = addLayer(addLayer(project, "page-1", "image", "f/a", "Poster").project, "page-1", "image", "f/b", "Board").project;
  assert.equal(describeChange(project.pages, twice.pages), "Added Poster to Page 1, and 1 more");
  const renamed = { ...project, pages: project.pages.map(page => page.id === "page-1" ? { ...page, name: "Home" } : page) };
  assert.equal(describeChange(project.pages, renamed.pages), "Renamed Page 1 to Home");
  // Going back is an iteration of its own; the history stays.
  const back = recordIteration(project, restoreIteration(project, "iteration-1"), later);
  assert.deepEqual(back.pages, start.pages);
  assert.equal(back.history.length, 4);
  let many = project;
  for (let n = 0; n < HISTORY_LIMIT + 5; n++) many = recordIteration(many, addPage(many).project, later);
  assert.equal(many.history.length, HISTORY_LIMIT);
  project = addComment(project, "page-1", "layer-1", "David Tee", "  Tighten the header  ", later);
  assert.equal(addComment(project, "page-1", "layer-1", "David Tee", "   ").comments.length, 1);
  project = { ...project, notes: "Five interviews: people want the chart first." };
  const file = JSON.parse(JSON.stringify(projectFile(project)));
  assert.deepEqual(readProject(file, RESTORE), project);
  assert.deepEqual(readProject({ ...file, comments: [{ text: "no layer" }], history: "x", notes: 3 }, RESTORE)!.comments, []);
});

test("design changes: logged once per element and property, undone, sent as a batch, read back; layers and pages follow", () => {
  const made = addLayer(newProject("Launch", "area", "default", []), "page-1", "screen", "analytics", "Analytics dashboard");
  let project = made.project;
  const layer = made.layer!.id;
  const variant = { page: "page-1", layer, path: [0, 2, 1], target: "Button", label: "New report", property: "prop:variant", name: "Variant", from: "Solid", to: "Soft", value: "soft" };
  project = logChange(project, variant, new Date("2026-11-06T10:00:00Z"));
  assert.equal(project.changes.length, 1);
  // The same property again updates the change, keeping where it started; back to the start removes it.
  project = logChange(project, { ...variant, from: "Soft", to: "Outline", value: "outline" });
  assert.equal(project.changes.length, 1);
  assert.deepEqual([project.changes[0]!.from, project.changes[0]!.to, project.changes[0]!.value], ["Solid", "Outline", "outline"]);
  assert.equal(logChange(project, { ...variant, from: "Outline", to: "Solid", value: "solid" }).changes.length, 0);
  // A change that changes nothing is not logged.
  assert.equal(logChange(project, { ...variant, property: "style:gap", from: "12", to: "12", value: "var(--area-space-12)" }).changes.length, 1);
  project = logChange(project, { ...variant, path: [0, 1], target: "Frame", label: "", property: "style:gap", name: "Gap", from: "12", to: "16", value: "var(--area-space-16)" });
  assert.equal(pendingChanges(project).length, 2);
  assert.equal(undoChange(project, project.changes[1]!.id).changes.length, 1);
  // Sent: out of the pending log, still drawn on the layer until cleared; a new change after it is a new entry.
  project = markSent(project, new Date("2026-11-06T10:05:00Z"));
  assert.equal(pendingChanges(project).length, 0);
  assert.equal(changesOn(project, "page-1", layer).length, 2);
  project = logChange(project, { ...variant, from: "Outline", to: "Ghost", value: "ghost" });
  assert.equal(pendingChanges(project).length, 1);
  assert.equal(project.changes.length, 3);
  const file = JSON.parse(JSON.stringify(projectFile(project)));
  assert.deepEqual(readProject(file, RESTORE)!.changes, project.changes);
  assert.deepEqual(readProject({ ...file, changes: [{ page: "page-1", layer, path: ["x"], property: "text", value: "Hi" }, "x"] }, RESTORE)!.changes, []);
  assert.equal(clearSent(project).changes.length, 1);

  // Layers: rename, duplicate after itself, remove (its changes go with it).
  project = renameLayer(project, "page-1", layer, "Dashboard");
  assert.equal(project.pages[0]!.layers[0]!.name, "Dashboard");
  const copied = duplicateLayer(project, "page-1", layer);
  assert.deepEqual(copied.project.pages[0]!.layers.map(entry => entry.name), ["Dashboard", "Dashboard copy"]);
  assert.equal(removeLayer(copied.project, "page-1", layer).changes.length, 0);
  // Pages: rename, duplicate with new layer ids, delete (never the last).
  const twin = duplicatePage(renamePage(project, "page-1", "Home"), "page-1");
  assert.deepEqual(twin.project.pages.map(entry => entry.name), ["Home", "Home copy"]);
  assert.notEqual(twin.project.pages[1]!.layers[0]!.id, twin.project.pages[0]!.layers[0]!.id);
  assert.equal(deletePage(twin.project, "page-1").pages.length, 1);
  assert.equal(deletePage(project, "page-1").pages.length, 1);
});

test("a restore drops the logged changes it undid, and a removed layer takes its comments", () => {
  let project = addLayer(newProject("Launch", "area", "default", []), "page-1", "screen", "analytics", "Analytics dashboard").project;
  project = addLayer(project, "page-1", "screen", "workspace", "Workspace").project;
  project = saveVersion(project, "Start", NOW);
  const change = { page: "page-1", layer: "layer-1", path: [0], target: "Button", label: "New report", property: "prop:variant", name: "Variant", from: "Solid", to: "Soft", value: "soft" };
  project = logChange(project, change);
  project = logChange(project, { ...change, layer: "layer-2" });
  // layer-1 is renamed after the version: the restore puts it back, so its change no longer describes the design.
  project = renameLayer(project, "page-1", "layer-1", "Dashboard");
  const restored = restoreVersion(project, "version-1");
  assert.deepEqual(restored.changes.map(entry => entry.layer), ["layer-2"]);
  // Comments leave with their layer, so the next layer to take the id starts without them.
  project = addComment(project, "page-1", "layer-2", "David Tee", "Tighten the header");
  assert.equal(removeLayer(project, "page-1", "layer-2").comments.length, 0);
});
