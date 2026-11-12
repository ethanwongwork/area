// Flows (the user flows study, 2026-11-08): a page becomes a flow at its first link; its layers in order are the path,
// a branch is off it and numbered after the step it leaves, a state sits under its step; a step with no links goes on
// to the next; links, states and branches survive the file, a duplicate, a removal and an undo (src/flow.ts,
// src/projects.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { checkFlow, isFlow, linkAt, nextOf, readFlow, stepName } from "../src/flow.ts";
import { BACK, describeChange, duplicatePage, logChange, newProject, projectFile, readProject, removeLayer, setBranch, setLink, setNote, setState, undoChange, type Project } from "../src/projects.ts";
import type { Restorers } from "../src/systems.ts";

const RESTORE = { canvas: () => ({}), material: () => ({}), colours: () => ({}), accent: () => ({}) } as unknown as Restorers;
const NOW = new Date("2026-11-08T12:00:00Z");

/** Sign up: Create account, Sign in (a branch), Verify email with an Error state, Profile, Done. */
function signUp(): Project {
  const made = newProject("Onboarding", "area", "default", [], NOW);
  const layers = ["Create account", "Sign in", "Verify email", "Verify email error", "Profile", "Done"].map((name, index) => ({ id: `layer-${index + 1}`, kind: "screen" as const, ref: "settings", name }));
  let project: Project = { ...made, pages: [{ id: "page-1", name: "Sign up", layers }] };
  project = setBranch(project, "page-1", "layer-2", true);
  project = setState(project, "page-1", "layer-4", "layer-3", "Error");
  project = setLink(project, "page-1", { from: "layer-1", path: [0, 4], label: "Continue", to: "layer-3" });
  project = setLink(project, "page-1", { from: "layer-1", path: [0, 6], label: "Secondary", to: "layer-2" });
  project = setLink(project, "page-1", { from: "layer-2", path: [0, 3], label: "Continue", to: "layer-6" });
  return project;
}

test("a page is a board until its first link, then a flow", () => {
  const made = newProject("Onboarding", "area", "default", [], NOW);
  assert.equal(isFlow(made.pages[0]!), false);
  assert.equal(isFlow(signUp().pages[0]!), true);
});

test("the path is numbered in order; a branch takes its step's number and a letter; a state sits under its step", () => {
  const flow = readFlow(signUp().pages[0]!);
  assert.deepEqual(flow.steps.map(step => `${step.number} ${step.layer.name}`), ["1 Create account", "2 Verify email", "3 Profile", "4 Done"]);
  assert.deepEqual(flow.branches.map(step => `${step.number} ${step.layer.name}`), ["1a Sign in"]);
  assert.deepEqual(flow.states.get("layer-3")?.map(state => state.layer.state), ["Error"]);
  assert.deepEqual(flow.ordered.map(step => step.layer.id), ["layer-1", "layer-2", "layer-3", "layer-4", "layer-5", "layer-6"]);
  assert.equal(stepName(flow, flow.byId.get("layer-4")!.layer), "Verify email, Error");
});

test("a step with links goes only where they go; one without goes on to the next", () => {
  const page = signUp().pages[0]!;
  const flow = readFlow(page);
  assert.deepEqual(flow.edges.filter(edge => edge.from === "layer-1").map(edge => edge.to).sort(), ["layer-2", "layer-3"]);
  assert.equal(nextOf(flow, "layer-3"), "layer-5");
  assert.equal(nextOf(flow, "layer-4"), "layer-5", "a state goes on as its step does");
  assert.equal(nextOf(flow, "layer-6"), null);
  assert.equal(linkAt(page, "layer-1", [0, 4, 1])?.to, "layer-3", "a click inside a linked element follows its link");
  assert.equal(linkAt(page, "layer-1", [0, 5]), null);
});

test("checks find what a walk through the flow leaves undesigned", () => {
  let project = signUp();
  assert.deepEqual(checkFlow(readFlow(project.pages[0]!)).map(check => `${check.kind}:${check.what}`), ["no-back:1a Sign in"]);
  project = setLink(project, "page-1", { from: "layer-3", path: [1], label: "Continue", to: "layer-6" });
  const kinds = checkFlow(readFlow(project.pages[0]!)).map(check => `${check.kind}:${check.what}`);
  assert.ok(kinds.includes("unreachable:3 Profile"));
  project = setLink(project, "page-1", { from: "layer-5", path: [1], label: "Back", to: BACK });
  assert.equal(nextOf(readFlow(project.pages[0]!), "layer-5"), "layer-6", "a Back link alone leaves Next");
  // A branch off the last step has nowhere to go on to.
  project = { ...project, pages: [{ ...project.pages[0]!, layers: [...project.pages[0]!.layers, { id: "layer-7", kind: "screen", ref: "settings", name: "Help", branch: true }] }] };
  project = setLink(project, "page-1", { from: "layer-6", path: [3], label: "Help", to: "layer-7" });
  assert.ok(checkFlow(readFlow(project.pages[0]!)).some(check => check.kind === "dead-end" && check.what === "4a Help"));
  assert.ok(kinds.includes("no-back:2 Verify email"));
  project = setLink(project, "page-1", { from: "layer-3", path: [2], label: "Back", to: BACK });
  assert.ok(!checkFlow(readFlow(project.pages[0]!)).some(check => check.kind === "no-back" && check.layer === "layer-3"));
});

test("one link per element; an empty target removes it, and the last link leaves a board", () => {
  let project = signUp();
  project = setLink(project, "page-1", { from: "layer-1", path: [0, 4], label: "Continue", to: "layer-5" });
  assert.equal(project.pages[0]!.links!.filter(link => link.from === "layer-1" && link.path.join() === "0,4").length, 1);
  for (const link of [...project.pages[0]!.links!]) project = setLink(project, "page-1", { ...link, to: "" });
  assert.equal(project.pages[0]!.links, undefined);
});

test("a link's change in the log undoes back to where the element went before", () => {
  let project = signUp();
  project = setLink(project, "page-1", { from: "layer-1", path: [0, 4], label: "Continue", to: "layer-5" });
  project = logChange(project, { page: "page-1", layer: "layer-1", path: [0, 4], target: "Button", label: "Continue", property: "link", name: "Goes to", from: "2 Verify email", to: "3 Profile", value: "layer-5", was: "layer-3" }, NOW);
  project = undoChange(project, project.changes[0]!.id);
  assert.equal(project.pages[0]!.links!.find(link => link.path.join() === "0,4")?.to, "layer-3");
});

test("links, states, branches and notes survive the file; a removed layer takes its links and frees its states", () => {
  let project = setNote(signUp(), "page-1", "Body text.");
  project = setNote(project, "page-1", "Sends a code", "layer-3");
  const read = readProject(JSON.parse(JSON.stringify(projectFile(project))), RESTORE)!;
  assert.deepEqual(read.pages, project.pages);
  const removed = removeLayer(project, "page-1", "layer-3");
  assert.ok(!removed.pages[0]!.links!.some(link => link.to === "layer-3"));
  assert.equal(removed.pages[0]!.layers.find(layer => layer.id === "layer-4")!.of, undefined);
});

test("a duplicated flow page keeps its links and states on the copies' ids", () => {
  const { project, page } = duplicatePage(signUp(), "page-1");
  const copy = project.pages.find(entry => entry.id === page!.id)!;
  const ids = new Set(copy.layers.map(layer => layer.id));
  assert.ok(copy.links!.every(link => ids.has(link.from) && (link.to === BACK || ids.has(link.to))));
  assert.ok(copy.layers.every(layer => !layer.of || ids.has(layer.of)));
});

test("an iteration says what a flow change did", () => {
  const before = signUp();
  const after = setLink(before, "page-1", { from: "layer-5", path: [1], label: "Back", to: BACK });
  assert.equal(describeChange(before.pages, after.pages), "Linked Back to Back");
  assert.equal(describeChange(before.pages, setBranch(before, "page-1", "layer-5", true).pages), "Took Profile off the path");
});
