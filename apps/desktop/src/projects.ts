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
 *
 * Pure: the projects test (tests/projects.test.ts) imports it; the restore functions that check a theme come from the app.
 */
import { restoreTheme, systemSlug, type Restorers, type SystemTheme } from "./systems.ts";
import type { CanvasAxes } from "./studio.tsx";

/** A thing on a page: a system's screen (a Patterns entry's id) or an Inspiration image (its `<group>/<image>`). */
export type LayerKind = "screen" | "image";
export interface Layer { id: string; kind: LayerKind; ref: string; name: string }
export interface ProjectPage { id: string; name: string; layers: Layer[] }
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
export interface Project {
  id: string;
  name: string;
  /** ISO date and time. */
  created: string;
  /** The system it uses (an id) and which of its themes. */
  system: string;
  theme: string;
  pages: ProjectPage[];
  explorations: Exploration[];
  versions: ProjectVersion[];
}

export const PROJECT_FILE_VERSION = 1;

/** An id not among `taken`: `<prefix>-<n>`, counting up from the list's length. */
export function nextId(prefix: string, taken: Iterable<{ id: string }>): string {
  const ids = new Set([...taken].map(entry => entry.id));
  let n = ids.size + 1;
  while (ids.has(`${prefix}-${n}`)) n++;
  return `${prefix}-${n}`;
}

/** A new project on a system's theme, with one empty page. */
export function newProject(name: string, system: string, theme: string, taken: Iterable<string>, now = new Date()): Project {
  return {
    id: systemSlug(name || "project", taken), name: name.trim() || "Untitled project", created: now.toISOString(), system, theme,
    pages: [{ id: "page-1", name: "Page 1", layers: [] }], explorations: [], versions: [],
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
    layers.push({ id, kind, ref: l.ref, name: text(l.name, l.ref) });
  }
  return layers;
}
function readPages(saved: unknown): ProjectPage[] {
  const pages: ProjectPage[] = [];
  for (const entry of Array.isArray(saved) ? saved : []) {
    const p = (entry && typeof entry === "object" ? entry : {}) as Record<string, unknown>;
    const id = text(p.id, nextId("page", pages));
    if (pages.some(other => other.id === id)) continue;
    pages.push({ id, name: text(p.name, `Page ${pages.length + 1}`), layers: readLayers(p.layers) });
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
  return {
    id: s.id, name: s.name.trim(), created: typeof s.created === "string" ? s.created : new Date(0).toISOString(),
    system: s.system, theme: text(s.theme, "default"),
    pages: pages.length ? pages : [{ id: "page-1", name: "Page 1", layers: [] }],
    explorations: readExplorations(s.explorations, restore), versions,
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
    pages: project.pages, explorations: project.explorations.map(exploration),
    versions: project.versions.map(version => ({ ...version, explorations: version.explorations.map(exploration) })),
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
  return version ? { ...project, pages: version.pages, explorations: version.explorations } : project;
}
