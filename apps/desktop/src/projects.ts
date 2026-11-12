/**
 * Projects (the IA of 2026-10-29; https://claude.ai/artifact/TRWJYDWrxVaxCTvtJNxwD5): where new things and big changes are
 * made, with one system and one of its themes, as the Library publishes them (a project never sees a system's unpublished
 * working copy). Each is a folder in the app's own data, `~/Library/Application Support/Area/Projects/<id>/project.json`
 * (electron/main.cjs), never in the repository. A project opens in a tab of its own, and its Sidebar is its tree (owner,
 * 2026-10-29: "within each project there are a bunch of things in it (layers, pages, explorations, versions), so those
 * will be accessed through the left nav, but the tab itself … will always just be the project itself"):
 *
 *   pages         each a board of layers: a system's screens (its Patterns) and Inspiration's images, in order
 *   explorations  a theme tried on the project's system, from one of its themes; Publish puts it in the system as an update
 *                 to that theme or a new one (src/systems.ts `publishTheme`)
 *   versions      named copies of the pages and explorations, to go back to
 *   history       iterations: every change to the pages kept automatically (owner, 2026-11-06: "a gallery of all previous
 *                 iterations"), newest last, at most HISTORY_LIMIT; a version is a named one kept for good
 *   comments      notes on a layer (the design interface's Comments tab)
 *   notes         the project's research and insights, one text (its Research tab)
 *   changes       design changes made in the Inspector's Design view to an element of a layer (owner, 2026-11-06: "each
 *                 change to be made and then logged and then sent to the chat all at once when the user chooses"): each
 *                 drawn on the stage at once, kept until it is undone, and marked sent when the batch goes to Chat
 *
 * A page is a **flow** once it has a link (the user flows study, owner 2026-11-08: "go with your recs";
 * docs/research/user-flows-2026-11-08): its layers in order are the path, a layer marked `branch` is off it, a layer
 * with `of` is a state of another (Error, Loading), and `links` say where an element of a layer goes (src/flow.ts).
 *
 * Pure: the projects test (tests/projects.test.ts) imports it; the restore functions that check a theme come from the app.
 */
import { restoreTheme, systemSlug, type Restorers, type SystemTheme } from "./systems.ts";
import type { CanvasAxes } from "./studio.tsx";
import { apply, find, readDoc, walk, type DesignDoc, type DocOp } from "./design-doc.ts";
import { localAddress } from "./preview.ts";

/** A thing on a page: a system's screen (a Patterns entry's id) or an Inspiration image (its `<group>/<image>`). */
export type LayerKind = "screen" | "image";
export interface Layer {
  id: string;
  kind: LayerKind;
  ref: string;
  name: string;
  /** On a flow page: off the path, a branch reached only by a link. */
  branch?: boolean;
  /** On a flow page: the step this layer is a state of, and the state's name ("Error"). */
  of?: string;
  state?: string;
  /** On a flow page: one line on what happens at this step. */
  note?: string;
  /** From its first edit: its own design (src/design-doc.ts), read from the screen as drawn; `ref` names that screen. */
  doc?: DesignDoc;
}
/**
 * A link on a flow page: an element of a layer (its path of child indices from the screen's root, as a DesignChange's;
 * none for the whole step) goes to another layer of the page, or back. `label` is the element's words ("Continue").
 */
export interface FlowLink { id: string; from: string; path: number[]; label: string; to: string }
export const BACK = "back";
export interface ProjectPage {
  id: string;
  name: string;
  layers: Layer[];
  /** Links make the page a flow (src/flow.ts); absent or empty, it is a board. */
  links?: FlowLink[];
  /** A flow's description: who takes it and what they finish with. */
  note?: string;
}
export interface Exploration {
  id: string;
  name: string;
  /** The system theme it was made from: what Publish replaces, unless it goes in as a new theme. */
  from: string;
  theme: SystemTheme;
  /** The system version its last publish made. */
  published?: string;
}
/** A saved version: a copy of the pages and explorations. */
export interface ProjectVersion { id: string; name: string; at: string; pages: ProjectPage[]; explorations: Exploration[] }
/** An iteration: the pages as one change left them, kept automatically (`recordIteration`). */
export interface Iteration { id: string; at: string; note: string; pages: ProjectPage[] }
/** A note on one of a page's layers. */
export interface LayerComment { id: string; page: string; layer: string; author: string; text: string; at: string }
/**
 * A design change to one element of a layer's screen (src/design-edit.ts): what it is (its path of child indices from the
 * screen's root, its component and its words), which property, and the value before and after, in words and as applied.
 * On a layer with its own design (direct editing, 2026-11-08) a change also names its node, which keeps its id through
 * every edit, and holds the operation it made and the one that undoes it (src/design-doc.ts); its property may then be
 * "insert", "remove", "move" or "size" as well. A change without them is an override drawn on the screen's code.
 */
export interface DesignChange {
  id: string;
  page: string;
  layer: string;
  path: number[];
  /** The element's component ("Button") or "Frame", and its words ("New report"), as the log names it. */
  target: string;
  label: string;
  /** "prop:variant", "text", "style:gap", "type", "style:background-color" … */
  property: string;
  /** The property in words ("Variant", "Gap"). */
  name: string;
  from: string;
  to: string;
  /** What is applied: a modifier's value, the words, or a CSS value (`var(--area-space-12)`). */
  value: string;
  at: string;
  /** When it went to Chat in a batch; a sent change stays drawn until it is cleared. */
  sent?: string;
  /** On a layer's own design: the node, the operation made, and the one that undoes it. */
  node?: string;
  op?: DocOp;
  undo?: DocOp;
  /** A link's change (property `link`): where the element went before, so Undo puts it back ("" for the next step). */
  was?: string;
}
export interface Project {
  id: string;
  name: string;
  /** ISO date and time. */
  created: string;
  /** The system it uses (an id) and which of its themes. */
  system: string;
  theme: string;
  /**
   * The system's version it was made with or last updated to (src/systems.ts `followedVersion`: later Fixes and Adds reach
   * it on their own; a release that Needs work in products waits for Update). Absent in a project from before: it follows Live.
   */
  release?: string;
  /**
   * The folder on this Mac that holds the project's code, an absolute path (owner, 2026-11-10): where Chat works
   * (electron/agent.cjs) and where its system is written. Absent until one is chosen on the Overview.
   */
  folder?: string;
  /**
   * Where the project's own app runs on this Mac while the person works on it, as a URL ("http://localhost:5173/";
   * owner, 2026-11-10): what the Preview shows. Only this Mac's addresses are kept (src/preview.ts `localAddress`).
   */
  preview?: string;
  pages: ProjectPage[];
  explorations: Exploration[];
  versions: ProjectVersion[];
  history: Iteration[];
  comments: LayerComment[];
  notes: string;
  changes: DesignChange[];
}

export const PROJECT_FILE_VERSION = 1;
/** The iterations a project keeps; the oldest go first. Named versions are kept for good. */
export const HISTORY_LIMIT = 100; /* pick */

/** An id not among `taken`: `<prefix>-<n>`, counting up from the list's length. */
export function nextId(prefix: string, taken: Iterable<{ id: string }>): string {
  const ids = new Set([...taken].map(entry => entry.id));
  let n = ids.size + 1;
  while (ids.has(`${prefix}-${n}`)) n++;
  return `${prefix}-${n}`;
}

/** A new project on a system's theme, with one empty page. */
export function newProject(name: string, system: string, theme: string, taken: Iterable<string>, now = new Date(), release?: string): Project {
  return {
    id: systemSlug(name || "project", taken), name: name.trim() || "Untitled project", created: now.toISOString(), system, theme, ...(release ? { release } : {}),
    pages: [{ id: "page-1", name: "Page 1", layers: [] }], explorations: [], versions: [], history: [], comments: [], notes: "", changes: [],
  };
}

const text = (value: unknown, fallback: string) => typeof value === "string" && value.trim() ? value.trim() : fallback;

function readLayers(saved: unknown): Layer[] {
  const layers: Layer[] = [];
  for (const entry of Array.isArray(saved) ? saved : []) {
    const l = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const kind = l.kind === "image" ? "image" : l.kind === "screen" ? "screen" : null;
    if (!kind || typeof l.ref !== "string" || !l.ref) continue;
    const id = text(l.id, nextId("layer", layers));
    if (layers.some(other => other.id === id)) continue;
    const doc = kind === "screen" ? readDoc(l.doc) : undefined;
    layers.push({
      id, kind, ref: l.ref, name: text(l.name, l.ref),
      ...(l.branch === true ? { branch: true } : {}),
      ...(typeof l.of === "string" && l.of ? { of: l.of, state: text(l.state, "State") } : {}),
      ...(typeof l.note === "string" && l.note.trim() ? { note: l.note.trim() } : {}),
      ...(doc ? { doc } : {}),
    });
  }
  // A state names a step of the page that is not itself a state; anything else is a step again.
  return layers.map(layer => {
    if (!layer.of) return layer;
    const step = layers.find(other => other.id === layer.of);
    if (step && !step.of && step.id !== layer.id) return layer;
    const { of: _of, state: _state, ...rest } = layer;
    return rest;
  });
}
function readLinks(saved: unknown, layers: readonly Layer[]): FlowLink[] {
  const links: FlowLink[] = [];
  const has = (id: unknown) => typeof id === "string" && layers.some(layer => layer.id === id);
  for (const entry of Array.isArray(saved) ? saved : []) {
    const k = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    if (!has(k.from) || !(k.to === BACK || has(k.to))) continue;
    const path = Array.isArray(k.path) && k.path.every(step => Number.isInteger(step) && (step as number) >= 0) ? k.path as number[] : [];
    if (links.some(other => other.from === k.from && other.path.join("/") === path.join("/"))) continue;
    links.push({ id: text(k.id, nextId("link", links)), from: k.from as string, path, label: typeof k.label === "string" ? k.label : "", to: k.to as string });
  }
  return links;
}
function readPages(saved: unknown): ProjectPage[] {
  const pages: ProjectPage[] = [];
  for (const entry of Array.isArray(saved) ? saved : []) {
    const p = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const id = text(p.id, nextId("page", pages));
    if (pages.some(other => other.id === id)) continue;
    const layers = readLayers(p.layers);
    const links = readLinks(p.links, layers);
    pages.push({
      id, name: text(p.name, `Page ${pages.length + 1}`), layers,
      ...(links.length ? { links } : {}),
      ...(typeof p.note === "string" && p.note.trim() ? { note: p.note } : {}),
    });
  }
  return pages;
}
function readExplorations(saved: unknown, restore: Restorers): Exploration[] {
  const explorations: Exploration[] = [];
  for (const entry of Array.isArray(saved) ? saved : []) {
    const e = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const id = text(e.id, nextId("exploration", explorations));
    if (explorations.some(other => other.id === id)) continue;
    const name = text(e.name, `Exploration ${explorations.length + 1}`);
    explorations.push({
      id, name, from: text(e.from, "default"),
      theme: restoreTheme(e.theme, restore, { id, name }),
      ...(typeof e.published === "string" && e.published ? { published: e.published } : {}),
    });
  }
  return explorations;
}

/** Whether a saved value is an operation (its nodes are checked when it is applied: one that can't apply does nothing). */
const isOp = (value: unknown): value is DocOp => Boolean(value) && typeof value === "object" && ["patch", "insert", "remove", "move", "batch"].includes((value as { op?: unknown }).op as string);

function readChanges(saved: unknown): DesignChange[] {
  const changes: DesignChange[] = [];
  for (const entry of Array.isArray(saved) ? saved : []) {
    const c = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const strings = ["page", "layer", "property", "value"].every(key => typeof c[key] === "string" && c[key]);
    if (!strings || !Array.isArray(c.path) || !c.path.every(step => Number.isInteger(step) && (step as number) >= 0)) continue;
    const id = text(c.id, nextId("change", changes));
    if (changes.some(other => other.id === id)) continue;
    changes.push({
      id, page: c.page as string, layer: c.layer as string, path: c.path as number[], target: text(c.target, "Element"), label: typeof c.label === "string" ? c.label : "",
      property: c.property as string, name: text(c.name, c.property as string), from: typeof c.from === "string" ? c.from : "", to: typeof c.to === "string" ? c.to : "",
      value: c.value as string, at: typeof c.at === "string" ? c.at : new Date(0).toISOString(), ...(typeof c.sent === "string" && c.sent ? { sent: c.sent } : {}),
      ...(typeof c.node === "string" && /^n\d+$/.test(c.node) ? { node: c.node } : {}),
      ...(isOp(c.op) ? { op: c.op } : {}), ...(isOp(c.undo) ? { undo: c.undo } : {}),
      ...(typeof c.was === "string" ? { was: c.was } : {}),
    });
  }
  return changes;
}

/** A folder's path as a project keeps it: absolute (`/Users/…`, or a drive's on Windows). */
const isFolder = (value: unknown): value is string => typeof value === "string" && /^(\/|[A-Za-z]:[\\/])/.test(value);
/** The project working in a folder, or in none (null). A path that is not absolute changes nothing. */
export function setFolder(project: Project, folder: string | null): Project {
  if (folder === null) { const { folder: _folder, ...rest } = project; return rest; }
  return isFolder(folder) ? { ...project, folder } : project;
}
/** The project's app at an address on this Mac, or at none (null). An address that is not this Mac's changes nothing. */
export function setPreview(project: Project, address: string | null): Project {
  if (address === null) { const { preview: _preview, ...rest } = project; return rest; }
  const url = localAddress(address);
  return url ? { ...project, preview: url } : project;
}
/** A project read from its file, or null when the file is not one (no id or name, or no system). */
export function readProject(saved: unknown, restore: Restorers): Project | null {
  if (!saved || typeof saved !== "object") return null;
  const s = saved as Record<string, unknown>;
  if (typeof s.id !== "string" || !/^[a-z0-9-]+$/.test(s.id) || typeof s.name !== "string" || !s.name.trim() || typeof s.system !== "string" || !s.system) return null;
  const versions: ProjectVersion[] = [];
  for (const entry of Array.isArray(s.versions) ? s.versions : []) {
    const v = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const id = text(v.id, nextId("version", versions));
    if (versions.some(other => other.id === id)) continue;
    versions.push({ id, name: text(v.name, `Version ${versions.length + 1}`), at: typeof v.at === "string" ? v.at : new Date(0).toISOString(), pages: readPages(v.pages), explorations: readExplorations(v.explorations, restore) });
  }
  const pages = readPages(s.pages);
  const history: Iteration[] = [];
  for (const entry of Array.isArray(s.history) ? s.history : []) {
    const h = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const id = text(h.id, nextId("iteration", history));
    if (history.some(other => other.id === id)) continue;
    history.push({ id, at: typeof h.at === "string" ? h.at : new Date(0).toISOString(), note: text(h.note, "A change"), pages: readPages(h.pages) });
  }
  const comments: LayerComment[] = [];
  for (const entry of Array.isArray(s.comments) ? s.comments : []) {
    const c = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    if (typeof c.text !== "string" || !c.text.trim() || typeof c.page !== "string" || typeof c.layer !== "string") continue;
    const id = text(c.id, nextId("comment", comments));
    if (comments.some(other => other.id === id)) continue;
    comments.push({ id, page: c.page, layer: c.layer, author: text(c.author, "David Tee"), text: c.text.trim(), at: typeof c.at === "string" ? c.at : new Date(0).toISOString() });
  }
  return {
    id: s.id, name: s.name.trim(), created: typeof s.created === "string" ? s.created : new Date(0).toISOString(),
    system: s.system, theme: text(s.theme, "default"), ...(typeof s.release === "string" && s.release ? { release: s.release } : {}),
    ...(isFolder(s.folder) ? { folder: s.folder } : {}),
    ...(typeof s.preview === "string" && localAddress(s.preview) ? { preview: localAddress(s.preview)! } : {}),
    pages: pages.length ? pages : [{ id: "page-1", name: "Page 1", layers: [] }],
    explorations: readExplorations(s.explorations, restore), versions,
    history: history.slice(-HISTORY_LIMIT), comments, notes: typeof s.notes === "string" ? s.notes : "", changes: readChanges(s.changes),
  };
}

/** A project as its file holds it. `canvas` may mark each theme's settings, as a system's file does. */
export function projectFile(project: Project, canvas: (axes: CanvasAxes) => Record<string, unknown> = axes => axes) {
  const exploration = (entry: Exploration) => ({
    id: entry.id, name: entry.name, from: entry.from, ...(entry.published ? { published: entry.published } : {}),
    theme: { ...entry.theme, canvas: canvas(entry.theme.canvas) },
  });
  return {
    version: PROJECT_FILE_VERSION,
    id: project.id, name: project.name, created: project.created, system: project.system, theme: project.theme,
    ...(project.release ? { release: project.release } : {}),
    ...(project.folder ? { folder: project.folder } : {}),
    ...(project.preview ? { preview: project.preview } : {}),
    pages: project.pages, explorations: project.explorations.map(exploration),
    versions: project.versions.map(version => ({ ...version, explorations: version.explorations.map(exploration) })),
    history: project.history, comments: project.comments, notes: project.notes, changes: project.changes,
  };
}

/** The projects at launch, read from disk, oldest first. */
export function loadProjects(files: readonly unknown[], restore: Restorers): Project[] {
  const read: Project[] = [];
  for (const file of files) {
    const project = readProject(file, restore);
    if (project && !read.some(other => other.id === project.id)) read.push(project);
  }
  return read.sort((a, b) => a.created.localeCompare(b.created));
}

/** The project with a new empty page at the end. */
export function addPage(project: Project): { project: Project; page: ProjectPage } {
  const id = nextId("page", project.pages);
  const page = { id, name: `Page ${id.slice(5)}`, layers: [] };
  return { project: { ...project, pages: [...project.pages, page] }, page };
}

/** The project with a layer added at the end of a page. */
export function addLayer(project: Project, pageId: string, kind: LayerKind, ref: string, name: string): { project: Project; layer: Layer | null } {
  const page = project.pages.find(entry => entry.id === pageId);
  if (!page) return { project, layer: null };
  // A screen or image added again is numbered on its page ("Analytics dashboard 2"), as New page and New exploration
  // number theirs (owner pick r4-fixes, 2026-11-01: two layers had one name).
  const taken = new Set(page.layers.map(entry => entry.name));
  let named = name;
  for (let count = 2; taken.has(named); count++) named = `${name} ${count}`;
  const layer = { id: nextId("layer", project.pages.flatMap(entry => entry.layers)), kind, ref, name: named };
  return { project: { ...project, pages: project.pages.map(entry => entry === page ? { ...entry, layers: [...entry.layers, layer] } : entry) }, layer };
}

/** The project with an exploration of one of its system's themes (a copy of its published values). */
export function addExploration(project: Project, from: SystemTheme): { project: Project; exploration: Exploration } {
  const id = nextId("exploration", project.explorations);
  const name = `${from.name} exploration${project.explorations.length ? ` ${id.slice(12)}` : ""}`;
  const exploration = { id, name, from: from.id, theme: { ...from, id, name } };
  return { project: { ...project, explorations: [...project.explorations, exploration] }, exploration };
}

/** The project with its pages and explorations saved as a version, newest last. */
export function saveVersion(project: Project, name: string, now = new Date()): Project {
  const id = nextId("version", project.versions);
  return { ...project, versions: [...project.versions, { id, name: name.trim() || `Version ${id.slice(8)}`, at: now.toISOString(), pages: project.pages, explorations: project.explorations }] };
}

/** The project's pages and explorations put back to a saved version (the versions stay). */
export function restoreVersion(project: Project, id: string): Project {
  const version = project.versions.find(entry => entry.id === id);
  return version ? { ...project, pages: version.pages, explorations: version.explorations, changes: changesStillTrue(project, version.pages) } : project;
}

/**
 * The logged changes that still describe the design once `pages` are put back: those on a layer the restore leaves as it
 * is. A change on a layer that went back (or is gone) names an edit that is no longer drawn, so it leaves the log
 * rather than being undone or sent to Chat later.
 */
function changesStillTrue(project: Project, pages: readonly ProjectPage[]): DesignChange[] {
  const layerIn = (from: readonly ProjectPage[], page: string, layer: string) => from.find(entry => entry.id === page)?.layers.find(entry => entry.id === layer);
  return project.changes.filter(change => {
    const now = layerIn(project.pages, change.page, change.layer);
    const then = layerIn(pages, change.page, change.layer);
    return Boolean(now && then && JSON.stringify(now) === JSON.stringify(then));
  });
}

/**
 * What a change did to the pages, in words ("Added Analytics dashboard to Page 1"), or null when it left them as they
 * were (an exploration, a comment, the notes): only a change to the pages is an iteration.
 */
export function describeChange(before: readonly ProjectPage[], after: readonly ProjectPage[]): string | null {
  if (JSON.stringify(before) === JSON.stringify(after)) return null;
  const added = after.filter(page => !before.some(other => other.id === page.id));
  const removed = before.filter(page => !after.some(other => other.id === page.id));
  if (added.length === 1 && !removed.length) return `Added ${added[0]!.name}`;
  if (removed.length === 1 && !added.length) return `Deleted ${removed[0]!.name}`;
  const notes: string[] = [];
  for (const page of after) {
    const was = before.find(other => other.id === page.id);
    if (!was) continue;
    if (was.name !== page.name) notes.push(`Renamed ${was.name} to ${page.name}`);
    const gained = page.layers.filter(layer => !was.layers.some(other => other.id === layer.id));
    const lost = was.layers.filter(layer => !page.layers.some(other => other.id === layer.id));
    for (const layer of gained) notes.push(`Added ${layer.name} to ${page.name}`);
    for (const layer of lost) notes.push(`Removed ${layer.name} from ${page.name}`);
    for (const layer of page.layers) {
      const old = was.layers.find(other => other.id === layer.id);
      if (old && old.name !== layer.name) notes.push(`Renamed ${old.name} to ${layer.name}`);
      if (old && old.doc !== layer.doc && JSON.stringify(old.doc) !== JSON.stringify(layer.doc)) notes.push(`Edited ${layer.name}`);
    }
    if (!gained.length && !lost.length && was.layers.map(layer => layer.id).join() !== page.layers.map(layer => layer.id).join()) notes.push(`Reordered ${page.name}`);
    // A flow's own changes: links, states, branches.
    const nameOf = (id: string) => id === BACK ? "Back" : page.layers.find(layer => layer.id === id)?.name ?? "a removed layer";
    const linkKey = (link: FlowLink) => `${link.from}|${link.path.join("/")}`;
    for (const link of page.links ?? []) {
      const old = (was.links ?? []).find(other => linkKey(other) === linkKey(link));
      if (!old || old.to !== link.to) notes.push(`Linked ${link.label || nameOf(link.from)} to ${nameOf(link.to)}`);
    }
    for (const old of was.links ?? []) if (!(page.links ?? []).some(link => linkKey(link) === linkKey(old))) notes.push(`Unlinked ${old.label || nameOf(old.from)}`);
    for (const layer of page.layers) {
      const old = was.layers.find(other => other.id === layer.id);
      if (!old) continue;
      if ((old.of ?? "") !== (layer.of ?? "") || (old.state ?? "") !== (layer.state ?? "")) notes.push(layer.of ? `Made ${layer.name} ${nameOf(layer.of)}'s ${layer.state} state` : `Made ${layer.name} a step`);
      if (Boolean(old.branch) !== Boolean(layer.branch)) notes.push(layer.branch ? `Took ${layer.name} off the path` : `Put ${layer.name} on the path`);
      if ((old.note ?? "") !== (layer.note ?? "")) notes.push(`Noted ${layer.name}`);
    }
    if ((was.note ?? "") !== (page.note ?? "")) notes.push(`Described ${page.name}`);
  }
  if (!notes.length) return "Changed the pages";
  return notes.length === 1 ? notes[0]! : `${notes[0]}, and ${notes.length - 1} more`;
}

/**
 * The project after a change, with the change kept as an iteration when it changed the pages. The first iteration is
 * the pages before any change, so the oldest state can be gone back to.
 */
export function recordIteration(before: Project, after: Project, now = new Date(), note?: string): Project {
  const said = describeChange(before.pages, after.pages);
  if (!said) return after;
  const history = [...after.history];
  if (!history.length) history.push({ id: "iteration-1", at: before.created, note: "Before the first change", pages: before.pages });
  const last = history[history.length - 1]!;
  const noted = note ?? said;
  // A run of edits to one design (a nudge held down, a drag, words typed) is one iteration, the latest state of it, until
  // the design rests for EDIT_RUN_MS; every edit is still in the change log and the stage's undo.
  if (/^Edited /.test(noted) && last.note === noted && history.length > 1 && now.getTime() - new Date(last.at).getTime() < EDIT_RUN_MS) {
    history[history.length - 1] = { ...last, at: now.toISOString(), pages: after.pages };
  } else {
    history.push({ id: nextId("iteration", history), at: now.toISOString(), note: noted, pages: after.pages });
  }
  return { ...after, history: history.slice(-HISTORY_LIMIT) };
}
/** How long a design rests before its next edit starts a new iteration. */
export const EDIT_RUN_MS = 60_000; /* pick */

/** The project's pages put back to an iteration (the history stays, and the restore is an iteration of its own). */
export function restoreIteration(project: Project, id: string): Project {
  const iteration = project.history.find(entry => entry.id === id);
  return iteration ? { ...project, pages: iteration.pages, changes: changesStillTrue(project, iteration.pages) } : project;
}

/** The project with a comment on a layer, newest last. */
export function addComment(project: Project, page: string, layer: string, author: string, body: string, now = new Date()): Project {
  const said = body.trim();
  if (!said) return project;
  return { ...project, comments: [...project.comments, { id: nextId("comment", project.comments), page, layer, author, text: said, at: now.toISOString() }] };
}

/* --- Design changes (the Inspector's Design view and its log) --------------------------------------------------------- */

/** The same element and property on the same layer. */
const sameSpot = (a: Pick<DesignChange, "page" | "layer" | "path" | "property">, b: Pick<DesignChange, "page" | "layer" | "path" | "property">) =>
  a.page === b.page && a.layer === b.layer && a.property === b.property && a.path.join("/") === b.path.join("/");

/**
 * The project with a design change logged. A second change to an element's property, not yet sent, updates the first
 * (its `from` stays the value before either); one that puts the value back to where it was removes it.
 */
export function logChange(project: Project, change: Omit<DesignChange, "id" | "at" | "sent">, now = new Date()): Project {
  const open = project.changes.find(entry => !entry.sent && sameSpot(entry, change));
  if (open) {
    if (change.to === open.from) return { ...project, changes: project.changes.filter(entry => entry !== open) };
    return { ...project, changes: project.changes.map(entry => entry === open ? { ...entry, to: change.to, value: change.value, at: now.toISOString() } : entry) };
  }
  if (change.to === change.from) return project;
  return { ...project, changes: [...project.changes, { ...change, id: nextId("change", project.changes), at: now.toISOString() }] };
}

/**
 * The project without a change (Undo in the log). On a layer's own design its undo is applied, in any order: a change
 * whose node is gone afterwards (it was inserted by the change undone) leaves the log with it.
 */
export function undoChange(project: Project, id: string): Project {
  const change = project.changes.find(entry => entry.id === id);
  const rest = project.changes.filter(entry => entry.id !== id);
  // A link's Undo puts the element's link back to where it went before (none: the next step).
  if (change?.property === "link") return setLink({ ...project, changes: rest }, change.page, { from: change.layer, path: change.path, label: change.label, to: change.was ?? "" });
  const layer = change?.undo && layerOf(project, change.page, change.layer);
  if (!change?.undo || !layer?.doc) return { ...project, changes: rest };
  const done = apply(layer.doc, change.undo);
  if (!done) return { ...project, changes: rest };
  const doc = done.doc;
  const kept = rest.filter(entry => !(entry.page === change.page && entry.layer === change.layer && entry.node && entry.property !== "remove" && !find(doc, entry.node)));
  return { ...withDoc(project, change.page, change.layer, doc), changes: kept };
}

/** A page's layer. */
export const layerOf = (project: Project, page: string, layer: string) => project.pages.find(entry => entry.id === page)?.layers.find(entry => entry.id === layer);

/** The project with a layer's design replaced (undefined: drawn from its screen's code again). */
export function withDoc(project: Project, page: string, layer: string, doc: DesignDoc | undefined): Project {
  return {
    ...project,
    pages: project.pages.map(entry => entry.id !== page ? entry : { ...entry, layers: entry.layers.map(other => {
      if (other.id !== layer) return other;
      const { doc: _old, ...rest } = other;
      return doc ? { ...rest, doc } : rest;
    }) }),
  };
}

/** What an edit to a layer's design logs (projects.ts fills in the rest). */
export type DocChange = Omit<DesignChange, "id" | "at" | "sent" | "op" | "undo" | "node"> & { node: string; op: DocOp; undo: DocOp };

/**
 * The project after an edit to a layer's design: the design after it, and the change logged. As `logChange`: a second
 * change to a node's property, not yet sent, updates the first (keeping the first's undo), and one that puts it back
 * removes it. Removing a node inserted since the last send takes its insert and its other unsent changes out of the log
 * rather than logging a removal.
 */
export function logDocChange(project: Project, doc: DesignDoc, change: DocChange, now = new Date()): Project {
  const designed = withDoc(project, change.page, change.layer, doc);
  const onLayer = (entry: DesignChange) => entry.page === change.page && entry.layer === change.layer && !entry.sent;
  if (change.property === "remove") {
    const inserted = project.changes.find(entry => onLayer(entry) && entry.property === "insert" && entry.node === change.node);
    if (inserted) {
      const gone = new Set<string>();
      if (inserted.op?.op === "insert") for (const node of walk([inserted.op.node])) gone.add(node.id);
      return { ...designed, changes: project.changes.filter(entry => !(onLayer(entry) && entry.node && gone.has(entry.node))) };
    }
  }
  const mergeable = change.property !== "insert" && change.property !== "remove";
  const open = mergeable ? project.changes.find(entry => onLayer(entry) && entry.node === change.node && entry.property === change.property) : undefined;
  if (open) {
    if (change.to === open.from) return { ...designed, changes: project.changes.filter(entry => entry !== open) };
    return { ...designed, changes: project.changes.map(entry => entry === open ? { ...entry, to: change.to, value: change.value, path: change.path, op: change.op, at: now.toISOString() } : entry) };
  }
  return { ...designed, changes: [...project.changes, { ...change, id: nextId("change", project.changes), at: now.toISOString() }] };
}

/**
 * The project's changes with an edit taken back (the stage's ⌘Z) or done again (⇧⌘Z): the changes it added leave, and
 * those it changed or removed come back as they were, each keeping when it was sent.
 */
export function revertChanges(current: readonly DesignChange[], from: readonly DesignChange[], to: readonly DesignChange[]): DesignChange[] {
  const target = new Map(to.map(entry => [entry.id, entry]));
  const source = new Set(from.map(entry => entry.id));
  const out: DesignChange[] = [];
  for (const entry of current) {
    if (source.has(entry.id) && !target.has(entry.id)) continue;
    const back = target.get(entry.id);
    out.push(back ? { ...back, ...(entry.sent ? { sent: entry.sent } : {}) } : entry);
  }
  // Those the edit took out of the log come back.
  for (const entry of to) if (!source.has(entry.id) && !out.some(other => other.id === entry.id)) out.push(entry);
  return out;
}

/** The changes not yet sent, oldest first. */
export const pendingChanges = (project: Project) => project.changes.filter(entry => !entry.sent);

/** The project with every pending change marked sent (one batch to Chat). */
export function markSent(project: Project, now = new Date()): Project {
  return { ...project, changes: project.changes.map(entry => entry.sent ? entry : { ...entry, sent: now.toISOString() }) };
}

/** The project without its sent changes (their overrides leave the stage). */
export function clearSent(project: Project): Project {
  return { ...project, changes: project.changes.filter(entry => !entry.sent) };
}

/** The changes drawn on a layer: pending and sent, oldest first. */
export const changesOn = (project: Project, page: string, layer: string) => project.changes.filter(entry => entry.page === page && entry.layer === layer);

/** The project with a layer renamed, duplicated (after itself) or removed; its changes and comments follow it. */
export function renameLayer(project: Project, page: string, layer: string, name: string): Project {
  const named = name.trim();
  if (!named) return project;
  return { ...project, pages: project.pages.map(entry => entry.id === page ? { ...entry, layers: entry.layers.map(other => other.id === layer ? { ...other, name: named } : other) } : entry) };
}
export function duplicateLayer(project: Project, page: string, layer: string): { project: Project; layer: Layer | null } {
  const at = project.pages.find(entry => entry.id === page);
  const original = at?.layers.find(entry => entry.id === layer);
  if (!at || !original) return { project, layer: null };
  const taken = new Set(at.layers.map(entry => entry.name));
  let named = `${original.name} copy`;
  for (let count = 2; taken.has(named); count++) named = `${original.name} copy ${count}`;
  const copy = { ...original, id: nextId("layer", project.pages.flatMap(entry => entry.layers)), name: named };
  const layers = [...at.layers];
  layers.splice(layers.indexOf(original) + 1, 0, copy);
  return { project: { ...project, pages: project.pages.map(entry => entry === at ? { ...entry, layers } : entry) }, layer: copy };
}
export function removeLayer(project: Project, page: string, layer: string): Project {
  return {
    ...project,
    // Its links go with it, and its states become steps of their own.
    pages: project.pages.map(entry => entry.id === page ? withLinks({
      ...entry,
      layers: entry.layers.filter(other => other.id !== layer).map(other => other.of === layer ? withoutState(other) : other),
    }, (entry.links ?? []).filter(link => link.from !== layer && link.to !== layer)) : entry),
    changes: project.changes.filter(entry => !(entry.page === page && entry.layer === layer)),
    // Its comments go too: a later layer may take its id, and would otherwise show them as its own.
    comments: project.comments.filter(entry => !(entry.page === page && entry.layer === layer)),
  };
}

/** The project with a page renamed, duplicated (after itself, its layers copied with new ids) or deleted. */
export function renamePage(project: Project, page: string, name: string): Project {
  const named = name.trim();
  return named ? { ...project, pages: project.pages.map(entry => entry.id === page ? { ...entry, name: named } : entry) } : project;
}
export function duplicatePage(project: Project, page: string): { project: Project; page: ProjectPage | null } {
  const original = project.pages.find(entry => entry.id === page);
  if (!original) return { project, page: null };
  const taken = new Set(project.pages.map(entry => entry.name));
  let named = `${original.name} copy`;
  for (let count = 2; taken.has(named); count++) named = `${original.name} copy ${count}`;
  const used = [...project.pages.flatMap(entry => entry.layers)];
  const ids = new Map<string, string>();
  const layers = original.layers.map(entry => { const copy = { ...entry, id: nextId("layer", used) }; used.push(copy); ids.set(entry.id, copy.id); return copy; });
  // A flow's states and links follow their layers to the copy's ids.
  const moved = (id: string) => ids.get(id) ?? id;
  const copy: ProjectPage = {
    id: nextId("page", project.pages), name: named,
    layers: layers.map(entry => entry.of ? { ...entry, of: moved(entry.of) } : entry),
    ...(original.links?.length ? { links: original.links.map(link => ({ ...link, from: moved(link.from), to: moved(link.to) })) } : {}),
    ...(original.note ? { note: original.note } : {}),
  };
  const pages = [...project.pages];
  pages.splice(pages.indexOf(original) + 1, 0, copy);
  return { project: { ...project, pages }, page: copy };
}
export function deletePage(project: Project, page: string): Project {
  if (project.pages.length < 2) return project;
  return { ...project, pages: project.pages.filter(entry => entry.id !== page), changes: project.changes.filter(entry => entry.page !== page), comments: project.comments.filter(entry => entry.page !== page) };
}

/* --- Flows (src/flow.ts reads them) ------------------------------------------------------------------------------------ */

/** A page with its links; none leaves it a board. */
function withLinks(page: ProjectPage, links: FlowLink[]): ProjectPage {
  const { links: _old, ...rest } = page;
  return links.length ? { ...rest, links } : rest;
}
function withoutState(layer: Layer): Layer {
  const { of: _of, state: _state, ...rest } = layer;
  return rest;
}
const onPage = (project: Project, page: string, change: (entry: ProjectPage) => ProjectPage): Project =>
  ({ ...project, pages: project.pages.map(entry => entry.id === page ? change(entry) : entry) });

/**
 * The project with an element's link set: `to` a layer of the page or BACK, or "" for none (the element then goes where
 * the step goes, the next step). One link per element; the first link makes the page a flow.
 */
export function setLink(project: Project, page: string, link: Omit<FlowLink, "id">): Project {
  return onPage(project, page, entry => {
    const links = entry.links ?? [];
    const same = (other: FlowLink) => other.from === link.from && other.path.join("/") === link.path.join("/");
    const at = links.find(same);
    if (!link.to) return withLinks(entry, links.filter(other => !same(other)));
    if (link.to !== BACK && !entry.layers.some(layer => layer.id === link.to)) return entry;
    const next = { ...link, id: at?.id ?? nextId("link", links) };
    return withLinks(entry, at ? links.map(other => other === at ? next : other) : [...links, next]);
  });
}

/** The project with a layer made a state of a step (`of` and its name), or a step again (`of` empty). */
export function setState(project: Project, page: string, layer: string, of: string, state = "State"): Project {
  return onPage(project, page, entry => {
    const step = entry.layers.find(other => other.id === of);
    if (of && (!step || step.of || of === layer)) return entry;
    return {
      ...entry,
      layers: entry.layers.map(other => {
        if (other.id === layer) return of ? { ...withoutBranch(other), of, state: state.trim() || "State" } : withoutState(other);
        // A step that becomes a state hands its own states to the step it joins.
        if (of && other.of === layer) return { ...other, of };
        return other;
      }),
    };
  });
}
function withoutBranch(layer: Layer): Layer {
  const { branch: _branch, ...rest } = layer;
  return rest;
}

/** The project with a layer taken off the path (a branch, reached by a link) or put back on it. */
export function setBranch(project: Project, page: string, layer: string, branch: boolean): Project {
  return onPage(project, page, entry => ({
    ...entry, layers: entry.layers.map(other => other.id !== layer ? other : branch ? { ...withoutState(other), branch: true } : withoutBranch(other)),
  }));
}

/** The project with a layer's note, or a page's description (layer omitted). */
export function setNote(project: Project, page: string, note: string, layer?: string): Project {
  const said = note.trim();
  return onPage(project, page, entry => {
    if (!layer) { const { note: _n, ...rest } = entry; return said ? { ...rest, note: said } : rest; }
    return { ...entry, layers: entry.layers.map(other => { if (other.id !== layer) return other; const { note: _n, ...rest } = other; return said ? { ...rest, note: said } : rest; }) };
  });
}
