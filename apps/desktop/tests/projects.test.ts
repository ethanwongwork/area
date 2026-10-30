// Publishing and projects (the IA of 2026-10-29): a system's working copy against its Live release, the version a kind of
// publish makes, a project's publish of an exploration into its system, and a project's file, pages, layers and versions
// (src/systems.ts, src/projects.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { asLive, changesOf, liveOf, nextVersion, proposedKind, publish, publishTheme, readSystem, revertTo, starterSystem, systemFile, withTheme, type Restorers } from "../src/systems.ts";
import { addExploration, addLayer, addPage, loadProjects, newProject, projectFile, readProject, restoreVersion, saveVersion } from "../src/projects.ts";

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
