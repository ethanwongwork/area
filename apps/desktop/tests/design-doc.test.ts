// Direct editing (2026-11-08; docs/research/design-editing-2026-11-08/README.md): a layer's design as a document
// (src/design-doc.ts), its edits as operations that undo in any order, and their place in the change log, the stage's
// undo and the iterations (src/projects.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { apply, atPath, find, padSides, pathOf, readDoc, sizeStyles, toJsx, type DesignDoc, type DocOp } from "../src/design-doc.ts";
import { EDIT_RUN_MS, logDocChange, newProject, projectFile, readProject, recordIteration, revertChanges, undoChange, withDoc, type DocChange, type Project } from "../src/projects.ts";
import type { Restorers } from "../src/systems.ts";

const RESTORE = {
  canvas: () => ({}), material: () => ({ bundle: "none", overrides: {} }), colours: () => ({ light: null, dark: null }),
  accent: () => ({ on: false, primary: "#006df5", secondary: null, tertiary: null, status: "harmonised" }),
} as unknown as Restorers;

/** A screen: a column frame holding a heading's words, a hidden dialog, and a row of two buttons. */
const DOC: DesignDoc = {
  version: 1, next: 8,
  root: [{
    id: "n1", kind: "element", tag: "div", className: "ex-app", style: { display: "flex", "flex-direction": "column" }, children: [
      { id: "n2", kind: "element", tag: "h2", children: [{ id: "n3", kind: "text", text: "Overview" }] },
      { id: "n4", kind: "element", tag: "div", className: "ex-head__actions", children: [
        { id: "n5", kind: "component", component: "Button", props: { variant: "soft", icon: { icon: "AddIcon" } }, text: "New report" },
        { id: "n6", kind: "component", component: "Button", props: {}, text: "Export" },
      ] },
      { id: "n7", kind: "shape", shape: "rectangle", style: { position: "absolute", left: "8px", top: "8px", width: "40px", height: "20px" } },
    ],
  }],
};

const roundTrip = (doc: DesignDoc, op: DocOp) => {
  const done = apply(doc, op);
  assert.ok(done, `${op.op} applies`);
  const back = apply(done.doc, done.undo);
  assert.ok(back, `${op.op}'s undo applies`);
  assert.deepEqual(back.doc.root, doc.root, `${op.op} undoes exactly`);
  return done.doc;
};

test("every operation undoes exactly, and a batch undoes in reverse", () => {
  roundTrip(DOC, { op: "patch", node: "n5", patch: { props: { variant: "solid" } } });
  roundTrip(DOC, { op: "patch", node: "n3", patch: { text: "Weekly overview" } });
  roundTrip(DOC, { op: "patch", node: "n4", patch: { style: { gap: "var(--area-space-8)" } } });
  roundTrip(DOC, { op: "insert", parent: "n4", index: 1, node: { id: "n9", kind: "component", component: "Badge", props: { tone: "success" }, text: "Complete" } });
  roundTrip(DOC, { op: "remove", node: "n2" });
  roundTrip(DOC, { op: "move", node: "n6", parent: "n4", index: 0 });
  roundTrip(DOC, { op: "move", node: "n6", parent: "n1", index: 0 });
  roundTrip(DOC, { op: "batch", ops: [{ op: "move", node: "n5", parent: "n1", index: 3 }, { op: "patch", node: "n5", patch: { text: "Add" } }, { op: "remove", node: "n7" }] });
});

test("an operation on a node that is gone, or a move into itself, does nothing", () => {
  assert.equal(apply(DOC, { op: "patch", node: "n99", patch: { text: "x" } }), null);
  assert.equal(apply(DOC, { op: "move", node: "n1", parent: "n4", index: 0 }), null);
  assert.equal(apply(DOC, { op: "insert", parent: "n5", index: 0, node: { id: "n9", kind: "text", text: "x" } }), null, "a component holds no children");
  assert.equal(apply(DOC, { op: "insert", parent: "n4", index: 0, node: { id: "n6", kind: "text", text: "x" } }), null, "ids are never reused");
});

test("a move lands at the index among the siblings left, and an insert moves the id counter on", () => {
  const moved = apply(DOC, { op: "move", node: "n5", parent: "n4", index: 1 })!.doc;
  assert.deepEqual((find(moved, "n4")!.node as { children: { id: string }[] }).children.map(child => child.id), ["n6", "n5"]);
  const added = apply(DOC, { op: "insert", parent: "n1", index: 0, node: { id: "n20", kind: "text", text: "x" } })!.doc;
  assert.equal(added.next, 21);
});

test("a node's path is the stage's DOM path: the specimen first, words not counted", () => {
  assert.deepEqual(pathOf(DOC, "n1"), [0, 0]);
  assert.deepEqual(pathOf(DOC, "n6"), [0, 0, 1, 1]);
  assert.deepEqual(pathOf(DOC, "n7"), [0, 0, 2]);
  assert.equal(pathOf(DOC, "n3"), null, "words draw no element");
  for (const id of ["n1", "n2", "n4", "n5", "n6", "n7"]) assert.equal(atPath(DOC, pathOf(DOC, id)!)?.id, id);
});

test("a saved design reads back as it was; a bad node is dropped, not the design", () => {
  assert.deepEqual(readDoc(JSON.parse(JSON.stringify(DOC))), DOC);
  const bad = JSON.parse(JSON.stringify(DOC));
  bad.root[0].children.push({ id: "n2", kind: "text", text: "a reused id" }, { id: "n30", kind: "element", tag: "<script>" }, { id: "n31", kind: "component", component: "not a name", props: {} });
  assert.deepEqual(readDoc(bad), DOC);
  assert.equal(readDoc({ version: 2, root: [] }), undefined);
  assert.equal(readDoc(null), undefined);
});

test("the code view writes components as themselves and the rest as markup", () => {
  const code = toJsx(DOC, { name: "Analytics dashboard" });
  assert.match(code, /^import \{ Button \} from "@area\/react";\nimport \{ AddIcon \} from "@area\/icons";/);
  assert.match(code, /export function AnalyticsDashboard\(\) \{/);
  assert.match(code, /<Button variant="soft" icon=\{<AddIcon \/>\}>New report<\/Button>/);
  assert.match(code, /<div className="ex-app" style=\{\{ display: "flex", flexDirection: "column" \}\}>/);
  assert.match(code, /<h2>Overview<\/h2>/);
  assert.match(code, /<div data-shape="rectangle" style=\{\{ position: "absolute", left: "8px", top: "8px", width: "40px", height: "20px" \}\} \/>/);
});

/* --- In the project ------------------------------------------------------------------------------------------------ */

const NOW = new Date("2026-11-08T12:00:00Z");
function project(): Project {
  const made = newProject("Editing", "area", "default", [], NOW);
  return { ...made, pages: [{ id: "page-1", name: "Page 1", layers: [{ id: "layer-1", kind: "screen", ref: "analytics", name: "Analytics dashboard" }] }] };
}
const edit = (p: Project, doc: DesignDoc, op: DocOp, words: Partial<DocChange> = {}) => {
  const done = apply(doc, op)!;
  const node = op.op === "insert" ? op.node.id : op.op === "batch" ? "n1" : op.node;
  const change: DocChange = { page: "page-1", layer: "layer-1", path: pathOf(done.doc, node) ?? [], node, target: "Button", label: "", property: "prop:variant", name: "Variant", from: "Soft", to: "Solid", value: "solid", op, undo: done.undo, ...words };
  return { project: logDocChange(p, done.doc, change, NOW), doc: done.doc };
};
const docOf = (p: Project) => p.pages[0]!.layers[0]!.doc!;

test("an edit keeps the design in the layer and logs a change with its node and operations", () => {
  const { project: p } = edit(project(), DOC, { op: "patch", node: "n5", patch: { props: { variant: "solid" } } });
  assert.equal((find(docOf(p), "n5")!.node as { props: Record<string, unknown> }).props.variant, "solid");
  assert.equal(p.changes.length, 1);
  assert.equal(p.changes[0]!.node, "n5");
  assert.deepEqual(p.changes[0]!.path, [0, 0, 1, 0]);
  assert.ok(p.changes[0]!.undo);
});

test("a second change to a node's property updates the first, keeping its undo; back to where it was removes it", () => {
  let { project: p, doc } = edit(project(), DOC, { op: "patch", node: "n5", patch: { props: { variant: "solid" } } }, { to: "Solid" });
  const firstUndo = p.changes[0]!.undo;
  ({ project: p, doc } = edit(p, doc, { op: "patch", node: "n5", patch: { props: { variant: "ghost" } } }, { from: "Solid", to: "Ghost" }));
  assert.equal(p.changes.length, 1);
  assert.equal(p.changes[0]!.to, "Ghost");
  assert.deepEqual(p.changes[0]!.undo, firstUndo);
  ({ project: p } = edit(p, doc, { op: "patch", node: "n5", patch: { props: { variant: "soft" } } }, { from: "Ghost", to: "Soft" }));
  assert.equal(p.changes.length, 0);
});

test("removing a node added since the last send takes its insert and its changes out of the log", () => {
  const badge = { id: "n9", kind: "component" as const, component: "Badge", props: {}, text: "Complete" };
  let { project: p, doc } = edit(project(), DOC, { op: "insert", parent: "n4", index: 2, node: badge }, { property: "insert", name: "Added" });
  ({ project: p, doc } = edit(p, doc, { op: "patch", node: "n9", patch: { props: { tone: "success" } } }, { property: "prop:tone" }));
  ({ project: p, doc } = edit(p, doc, { op: "patch", node: "n5", patch: { text: "Add" } }, { property: "text" }));
  assert.equal(p.changes.length, 3);
  ({ project: p } = edit(p, doc, { op: "remove", node: "n9" }, { property: "remove", name: "Removed" }));
  assert.deepEqual(p.changes.map(change => change.node), ["n5"]);
  assert.equal(find(docOf(p), "n9"), null);
});

test("the log's Undo works in any order; undoing an insert drops the changes to what it added", () => {
  const badge = { id: "n9", kind: "component" as const, component: "Badge", props: {}, text: "Complete" };
  let { project: p, doc } = edit(project(), DOC, { op: "insert", parent: "n4", index: 2, node: badge }, { property: "insert" });
  ({ project: p, doc } = edit(p, doc, { op: "move", node: "n6", parent: "n4", index: 0 }, { property: "move" }));
  ({ project: p, doc } = edit(p, doc, { op: "patch", node: "n9", patch: { props: { tone: "success" } } }, { property: "prop:tone" }));
  // The move, not the last made, undone alone.
  p = undoChange(p, p.changes.find(change => change.property === "move")!.id);
  assert.deepEqual((find(docOf(p), "n4")!.node as { children: { id: string }[] }).children.map(child => child.id), ["n5", "n6", "n9"]);
  p = undoChange(p, p.changes.find(change => change.property === "insert")!.id);
  assert.equal(p.changes.length, 0, "the badge's tone left with it");
  assert.deepEqual(docOf(p).root, DOC.root);
});

test("the stage's undo and redo put the log back as it was, keeping when a change was sent", () => {
  const before = project();
  const { project: after } = edit(before, DOC, { op: "patch", node: "n5", patch: { props: { variant: "solid" } } });
  const sent = { ...after, changes: after.changes.map(change => ({ ...change, sent: NOW.toISOString() })) };
  const undone = revertChanges(sent.changes, after.changes, before.changes);
  assert.deepEqual(undone, []);
  const redone = revertChanges(undone, before.changes, after.changes);
  assert.deepEqual(redone, after.changes);
  // Unrelated changes stay.
  const other = { ...after.changes[0]!, id: "change-9", node: "n6" };
  assert.deepEqual(revertChanges([...after.changes, other], after.changes, before.changes), [other]);
});

test("a run of edits to one design is one iteration until it rests", () => {
  const start = project();
  const first = recordIteration(start, withDoc(start, "page-1", "layer-1", DOC), NOW);
  assert.deepEqual(first.history.map(entry => entry.note), ["Before the first change", "Edited Analytics dashboard"]);
  const next = apply(DOC, { op: "patch", node: "n3", patch: { text: "A" } })!.doc;
  const soon = recordIteration(first, withDoc(first, "page-1", "layer-1", next), new Date(NOW.getTime() + 1000));
  assert.equal(soon.history.length, 2);
  assert.equal(soon.history[1]!.pages[0]!.layers[0]!.doc, next);
  const later = recordIteration(soon, withDoc(soon, "page-1", "layer-1", DOC), new Date(NOW.getTime() + 1000 + EDIT_RUN_MS));
  assert.equal(later.history.length, 3);
});

test("a project file keeps a layer's design and its changes' nodes and operations", () => {
  const { project: p } = edit(project(), DOC, { op: "patch", node: "n5", patch: { props: { variant: "solid" } } });
  const read = readProject(JSON.parse(JSON.stringify(projectFile(p))), RESTORE)!;
  assert.deepEqual(read.pages[0]!.layers[0]!.doc, docOf(p));
  assert.deepEqual(read.changes, p.changes);
  // An older file (no design, changes without nodes) reads as before.
  const old = JSON.parse(JSON.stringify(projectFile(project())));
  old.changes = [{ id: "change-1", page: "page-1", layer: "layer-1", path: [0, 1], property: "text", value: "Hi" }];
  const oldRead = readProject(old, RESTORE)!;
  assert.equal(oldRead.pages[0]!.layers[0]!.doc, undefined);
  assert.equal(oldRead.changes[0]!.node, undefined);
});

test("sizes: Hug, Fill and Fixed set their own styles and clear the others'", () => {
  // Along a row's direction: Fill grows from nothing, Fixed stops growing and shrinking, Hug fits again.
  assert.deepEqual(sizeStyles("width", "main", "fill"), { width: "auto", flex: null, "flex-grow": "1", "flex-shrink": "1", "flex-basis": "0", "min-width": "0" });
  assert.deepEqual(sizeStyles("width", "main", "fixed", 119.6), { width: "120px", "min-width": null, flex: null, "flex-basis": null, "flex-grow": "0", "flex-shrink": "0" });
  assert.deepEqual(sizeStyles("width", "main", "hug"), { width: "fit-content", "min-width": null, flex: null, "flex-basis": null, "flex-grow": "0", "flex-shrink": null });
  // Across it: Fill stretches; Hug and Fixed give the stretch back.
  assert.deepEqual(sizeStyles("height", "cross", "fill"), { height: "auto", "min-height": null, "align-self": "stretch" });
  assert.equal(sizeStyles("height", "cross", "hug")["align-self"], null);
  // In a block, Fill is the whole width, border included.
  assert.deepEqual(sizeStyles("width", "block", "fill"), { width: "100%", "min-width": null, "box-sizing": "border-box" });
  // A drawn size never collapses.
  assert.equal(sizeStyles("width", "free", "fixed", 0).width, "1px");
});

test("padding: one side changes without the shorthand fighting it", () => {
  // A shorthand becomes its four sides first, functions kept whole.
  assert.deepEqual(padSides({ padding: "var(--area-space-16) var(--area-space-24)" }, ["top"], "var(--area-space-8)"), {
    padding: null, "padding-top": "var(--area-space-8)", "padding-right": "var(--area-space-24)", "padding-bottom": "var(--area-space-16)", "padding-left": "var(--area-space-24)",
  });
  // A side already set keeps its value; without a shorthand only the sides change.
  assert.deepEqual(padSides({ padding: "8px", "padding-left": "4px" }, ["right"], "12px"), { padding: null, "padding-top": "8px", "padding-right": "12px", "padding-bottom": "8px", "padding-left": "4px" });
  assert.deepEqual(padSides({ gap: "8px" }, ["top", "bottom"], "16px"), { "padding-top": "16px", "padding-bottom": "16px" });
});
