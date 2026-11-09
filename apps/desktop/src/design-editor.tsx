/**
 * Editing a layer's design (direct editing, 2026-11-08): the document the stage's tools change (src/design-doc.ts), each
 * edit logged as a `DesignChange` (projects.ts `logDocChange`), so the log's Undo and Send to chat work for every edit,
 * and the stage's own undo and redo (⌘Z, ⇧⌘Z), which step back through the edits made here in the order they were made.
 *
 * A screen layer is drawn from its code until its first edit. Meanwhile its design is read from a clean copy of the
 * screen (drawn hidden in the stage, in the layer's theme, without the overrides) so element paths and nodes agree, and
 * the overrides already logged on it are replayed onto that design. The first edit keeps the design in the layer, and the
 * replayed changes in the log get their nodes and undos.
 */
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { apply, find, pathOf, subjectOf, type DesignDoc, type DocOp } from "./design-doc.ts";
import { captureScreen } from "./design-capture.ts";
import { patchFor } from "./design-edit.ts";
import { atPath } from "./design-doc.ts";
import { layerOf, logDocChange, revertChanges, withDoc, type DesignChange, type DocChange, type Layer, type Project, type ProjectPage } from "./projects.ts";

/** What a change says about itself; the editor adds its page, layer, node, path and operations. */
export type ChangeWords = Pick<DesignChange, "target" | "label" | "property" | "name" | "from" | "to" | "value">;

interface Step { page: string; layer: string; before: { doc: DesignDoc | undefined; changes: DesignChange[] }; after: { doc: DesignDoc | undefined; changes: DesignChange[] } }
const HISTORY = 200; /* pick: steps kept per layer while the project is open */

/** The overrides logged on a code-drawn layer, replayed onto its captured design: the design, and each change's node and operations. */
function replay(doc: DesignDoc, changes: readonly DesignChange[]): { doc: DesignDoc; bound: Map<string, Pick<DesignChange, "node" | "op" | "undo" | "path">> } {
  let current = doc;
  const bound = new Map<string, Pick<DesignChange, "node" | "op" | "undo" | "path">>();
  for (const change of changes) {
    if (change.node) continue;
    const node = atPath(current, change.path);
    const op = node && patchFor(current, node, change.property, change.value);
    const done = op && apply(current, op);
    if (!node || !op || !done) continue;
    current = done.doc;
    bound.set(change.id, { node: node.id, op, undo: done.undo, path: change.path });
  }
  return { doc: current, bound };
}

export interface DesignEditor {
  /** The layer's design (its own, or read from its screen), or null while it is read. */
  doc: DesignDoc | null;
  /** Whether the layer holds its own design yet (the stage draws it, not the screen's code). */
  own: boolean;
  /** Makes an edit: applies it, logs it, and adds it to the stage's undo. The design after it, or null when it can't apply. */
  commit: (op: DocOp, words: ChangeWords) => DesignDoc | null;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** The hidden clean copy of the screen being read, to draw inside the stage (in its theme); null once read. */
  capture: ReactNode;
}

export function useDesignEditor({ project, page, layer, render, width, onChange }: {
  project: Project | null;
  page: ProjectPage | null;
  layer: Layer | null;
  /** The layer's screen as its code draws it (light), for the clean copy; null for an image. */
  render: (() => ReactNode) | null;
  /** The screen's width, the clean copy's. */
  width: number;
  onChange: (next: Project) => void;
}): DesignEditor {
  const [captured, setCaptured] = useState<{ layer: string; doc: DesignDoc } | null>(null);
  const [, bump] = useState(0);
  const latest = useRef(project);
  latest.current = project;
  const stacks = useRef(new Map<string, { undo: Step[]; redo: Step[] }>());
  const key = project && page && layer ? `${project.id}/${page.id}/${layer.id}` : "";
  const stack = () => { let entry = stacks.current.get(key); if (!entry) { entry = { undo: [], redo: [] }; stacks.current.set(key, entry); } return entry; };

  const screen = layer?.kind === "screen";
  const read = screen && !layer.doc && captured?.layer === layer.id ? captured.doc : null;
  const legacy = project && page && layer ? project.changes.filter(entry => entry.page === page.id && entry.layer === layer.id && !entry.node) : [];
  const legacyKey = JSON.stringify(legacy.map(entry => [entry.id, entry.path, entry.property, entry.value]));
  const replayed = useMemo(() => read ? replay(read, legacy) : null, [read, legacyKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const doc = screen ? layer.doc ?? replayed?.doc ?? null : null;

  const commit = (op: DocOp, words: ChangeWords) => {
    const current = latest.current;
    if (!current || !page || !layer || !doc) return null;
    const live = layerOf(current, page.id, layer.id);
    if (!live) return null;
    // The design before: the layer's own, else the one read from its screen with its overrides replayed.
    let base = live.doc;
    let changes = current.changes;
    if (!base) {
      if (!replayed) return null;
      base = replayed.doc;
      changes = changes.map(entry => { const bound = replayed.bound.get(entry.id); return bound ? { ...entry, ...bound } : entry; });
    }
    const done = apply(base, op);
    const node = subjectOf(op);
    if (!done || !node) return null;
    const path = pathOf(done.doc, node) ?? pathOf(base, node) ?? [];
    const change: DocChange = { ...words, page: page.id, layer: layer.id, node, path, op, undo: done.undo };
    const next = logDocChange({ ...current, changes }, done.doc, change);
    const entry = stack();
    entry.undo.push({ page: page.id, layer: layer.id, before: { doc: live.doc, changes: current.changes }, after: { doc: done.doc, changes: next.changes } });
    if (entry.undo.length > HISTORY) entry.undo.shift();
    entry.redo = [];
    latest.current = next;
    onChange(next);
    bump(n => n + 1);
    return done.doc;
  };
  const step = (from: "undo" | "redo") => {
    const current = latest.current;
    const entry = stack();
    const taken = entry[from].pop();
    if (!current || !taken) return;
    const [was, now] = from === "undo" ? [taken.after, taken.before] : [taken.before, taken.after];
    const next = { ...withDoc(current, taken.page, taken.layer, now.doc), changes: revertChanges(current.changes, was.changes, now.changes) };
    entry[from === "undo" ? "redo" : "undo"].push(taken);
    latest.current = next;
    onChange(next);
    bump(n => n + 1);
  };

  const needsCapture = Boolean(screen && layer && !layer.doc && render && captured?.layer !== layer.id);
  const entry = key ? stacks.current.get(key) : undefined;
  return {
    doc, own: Boolean(layer?.doc), commit,
    undo: () => step("undo"), redo: () => step("redo"),
    canUndo: Boolean(entry?.undo.length), canRedo: Boolean(entry?.redo.length),
    capture: needsCapture && layer && render ? <CleanCopy key={layer.id} render={render} width={width} onRead={next => setCaptured({ layer: layer.id, doc: next })} /> : null,
  };
}

/** A hidden copy of the screen, read into a design once it is drawn. */
function CleanCopy({ render, width, onRead }: { render: () => ReactNode; width: number; onRead: (doc: DesignDoc) => void }) {
  const host = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    // After the screen's own layout effects (a frame later, so measured styles have settled).
    const frame = requestAnimationFrame(() => {
      const specimen = host.current?.firstElementChild;
      if (specimen) onRead(captureScreen(specimen));
    });
    return () => cancelAnimationFrame(frame);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div ref={host} className="studio-design__capture" style={{ inlineSize: width }} aria-hidden="true" inert>{render()}</div>;
}

export { find };
