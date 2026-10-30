/**
 * Systems (docs/research/app-structure-2026-10-28/README.md, Phase 2; called brands until the owner renamed them,
 * 2026-10-29): a system is the look and the rules a product is built with. A workspace holds several, each a folder in the app's
 * own data, `~/Library/Application Support/Area/Systems/<id>/system.json` (electron/main.cjs), never in the repository. A
 * system has themes; a theme is what the Inspector's Theme view edits: the Canvas settings, the Material, the exact page
 * colours and the exact accent (Brand colours, src/brand.ts). The open system's chosen theme is what every page paints its specimens in.
 *
 * Until 2026-10-29 those settings were the app's own, in localStorage (`canvas`, `material`, `colours`, `brand`); the first
 * launch with no system on disk makes them the Area system's Default theme, once (`loadSystems`).
 *
 * Publishing (the IA of 2026-10-29, "one place"): a system is edited in place, and its themes are its working copy. What
 * everyone else and every project sees is its latest release, `releases`' last: a copy of the themes made by Publish, with
 * a version, a kind (Fixes, Adds, Needs work in products) and a note. `changesOf` lists what the working copy changed
 * since; a system with none read from an older file starts with one release of what it has, so nothing reads as unpublished. Pure: the systems test
 * (tests/places.test.ts) imports it, and the restore functions that validate each value come in from the app (`Restorers`).
 */
import type { BrandState } from "./brand.ts";
import type { ColoursState } from "./colours.ts";
import type { MaterialState } from "./material.ts";
import type { CanvasAxes } from "./studio.tsx";

/** The system every old link and saved tab means: the settings the app had before systems. */
export const AREA_ID = "area";

/** How a system began: the settings the app had (Area), a fork of the Area Starter, an import, or a description in the chat. */
export type SystemOrigin = "area" | "starter" | "import" | "described";
export const ORIGIN_LABEL: Record<SystemOrigin, string> = {
  area: "The app's settings before systems",
  starter: "The Area Starter",
  import: "An import",
  described: "Described in a chat",
};

export interface SystemTheme {
  id: string;
  name: string;
  canvas: CanvasAxes;
  material: MaterialState;
  /** Exact page colours (src/colours.ts). */
  colours: ColoursState;
  /** The exact accent, Brand colours (src/brand.ts). */
  accent: BrandState;
}
export interface System {
  id: string;
  name: string;
  origin: SystemOrigin;
  /** ISO date and time. */
  created: string;
  /** The chosen theme's id: what the system's pages paint in and the Inspector edits. */
  theme: string;
  /** The working copy: what its owners edit in place. */
  themes: SystemTheme[];
  /** What was published, oldest first; the last is Live. Never empty. */
  releases: Release[];
}

/** What kind of update a publish is, in the words engineers read as semantic versioning (patch, minor, major). */
export type ReleaseKind = "first" | "fixes" | "adds" | "needs-work";
export const RELEASE_KIND_LABEL: Record<ReleaseKind, string> = { first: "First version", fixes: "Fixes", adds: "Adds", "needs-work": "Needs work in products" };
export interface Release {
  /** "1.0", "1.1", "1.1.1", "2.0". */
  version: string;
  kind: ReleaseKind;
  note: string;
  /** ISO date and time. */
  at: string;
  /** The project it came from, when a project published it (an exploration). */
  from?: string;
  /** The theme in use when it was published. */
  theme: string;
  themes: SystemTheme[];
}

/** One thing the working copy changed since Live: a theme added, removed or renamed, or one of a theme's values. */
export interface Change {
  /** The theme's name (the working one's, or Live's for a removed theme). */
  theme: string;
  /** "added", "removed", "name", a Canvas axis, "material", "colours" or "accent". */
  what: string;
  before?: string;
  after?: string;
}
/** Each theme value checked on the way in, as the app restores its saved settings (src/studio.tsx). */
export interface Restorers {
  canvas: (saved: unknown) => CanvasAxes;
  material: (saved: unknown) => MaterialState;
  /** Exact page colours; with none saved, the Canvas's page presets converted once (src/colours.ts). */
  colours: (saved: unknown, canvas: CanvasAxes) => ColoursState;
  accent: (saved: unknown) => BrandState;
}
/** What the app saved before systems (localStorage), each value as it was stored. */
export interface Legacy { canvas: unknown; material: unknown; colours: unknown; brand: unknown }

/** The file's own version, so a later shape can convert it. */
export const SYSTEM_FILE_VERSION = 1;

/** A name as an id: lower case, words joined by hyphens, unique among `taken` ("Northwind" → "northwind", then "northwind-2"). */
export function systemSlug(name: string, taken: Iterable<string>): string {
  const used = new Set(taken);
  const base = name.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "system";
  // "new" is a theme's path (#system/<id>/themes/new), so a system never takes it; nor do the places' own roots.
  let id = base, n = 2;
  while (used.has(id) || id === "new") id = `${base}-${n++}`;
  return id;
}

/** A theme from saved values, each checked; a missing value is Area's default. */
export function restoreTheme(saved: unknown, restore: Restorers, fallback: { id: string; name: string }): SystemTheme {
  const s = (saved && typeof saved === "object" ? saved : {}) as Record<string, unknown>;
  const canvas = restore.canvas(s.canvas ?? {});
  return {
    id: typeof s.id === "string" && s.id ? s.id : fallback.id,
    name: typeof s.name === "string" && s.name.trim() ? s.name.trim() : fallback.name,
    canvas,
    material: restore.material(s.material ?? null),
    // A theme always saves its colours, so nothing converts here but a hand-edited file without them.
    colours: restore.colours(s.colours ?? { light: null, dark: null }, canvas),
    accent: restore.accent(s.accent ?? null),
  };
}

/** A system read from its file, or null when the file is not one (no id or name, or no theme). */
export function readSystem(saved: unknown, restore: Restorers): System | null {
  if (!saved || typeof saved !== "object") return null;
  const s = saved as Record<string, unknown>;
  if (typeof s.id !== "string" || !/^[a-z0-9-]+$/.test(s.id) || typeof s.name !== "string" || !s.name.trim()) return null;
  const listed = Array.isArray(s.themes) ? s.themes : [];
  const themes: SystemTheme[] = [];
  for (const [at, entry] of listed.entries()) {
    const theme = restoreTheme(entry, restore, { id: `theme-${at + 1}`, name: at ? `Theme ${at + 1}` : "Default" });
    if (!themes.some(other => other.id === theme.id)) themes.push(theme);
  }
  if (!themes.length) return null;
  const origin = (["area", "starter", "import", "described"] as const).find(value => value === s.origin) ?? "starter";
  const created = typeof s.created === "string" ? s.created : new Date(0).toISOString();
  const theme = themes.some(entry => entry.id === s.theme) ? String(s.theme) : themes[0]!.id;
  const releases = (Array.isArray(s.releases) ? s.releases : []).flatMap(entry => {
    const release = readRelease(entry, restore);
    return release ? [release] : [];
  });
  // A file from before publishing: what it has is its first version, so nothing reads as unpublished.
  if (!releases.length) releases.push(firstRelease(themes, theme, created));
  return { id: s.id, name: s.name.trim(), origin, created, theme, themes, releases };
}

/** A release read from a file, or null when it is not one. */
function readRelease(saved: unknown, restore: Restorers): Release | null {
  if (!saved || typeof saved !== "object") return null;
  const r = saved as Record<string, unknown>;
  if (typeof r.version !== "string" || !Array.isArray(r.themes)) return null;
  const themes = r.themes.map((entry, at) => restoreTheme(entry, restore, { id: `theme-${at + 1}`, name: at ? `Theme ${at + 1}` : "Default" }));
  if (!themes.length) return null;
  const kind = (["first", "fixes", "adds", "needs-work"] as const).find(value => value === r.kind) ?? "fixes";
  return {
    version: r.version, kind, note: typeof r.note === "string" ? r.note : "", at: typeof r.at === "string" ? r.at : new Date(0).toISOString(),
    ...(typeof r.from === "string" && r.from ? { from: r.from } : {}),
    theme: themes.some(theme => theme.id === r.theme) ? String(r.theme) : themes[0]!.id, themes,
  };
}

/** A system's first release: what it starts with, as version 1.0. */
export function firstRelease(themes: SystemTheme[], theme: string, at: string, note = "First version"): Release {
  return { version: "1.0", kind: "first", note, at, theme, themes };
}

/** The system's Live release: its latest. */
export const liveOf = (system: System): Release => system.releases[system.releases.length - 1]!;

/** The system as everyone else sees it: its Live release's themes (the theme in use stays the working one when Live has it). */
export function asLive(system: System): System {
  const live = liveOf(system);
  return { ...system, themes: live.themes, theme: live.themes.some(theme => theme.id === system.theme) ? system.theme : live.theme };
}

/** A theme's values as one comparable string. */
const valuesOf = (theme: SystemTheme) => JSON.stringify([theme.canvas, theme.material, theme.colours, theme.accent]);
const said = (value: unknown) => typeof value === "string" ? value : JSON.stringify(value);

/** What the working copy changed since Live, theme by theme, in the working copy's order. */
export function changesOf(system: System): Change[] {
  const live = liveOf(system).themes;
  const changes: Change[] = [];
  for (const theme of system.themes) {
    const was = live.find(entry => entry.id === theme.id);
    if (!was) { changes.push({ theme: theme.name, what: "added" }); continue; }
    if (was.name !== theme.name) changes.push({ theme: theme.name, what: "name", before: was.name, after: theme.name });
    if (valuesOf(was) === valuesOf(theme)) continue;
    for (const axis of Object.keys(theme.canvas) as Array<keyof CanvasAxes>) {
      if (was.canvas[axis] !== theme.canvas[axis]) changes.push({ theme: theme.name, what: axis, before: was.canvas[axis], after: theme.canvas[axis] });
    }
    for (const key of ["material", "colours", "accent"] as const) {
      if (said(was[key]) !== said(theme[key])) changes.push({ theme: theme.name, what: key });
    }
  }
  for (const was of live) if (!system.themes.some(theme => theme.id === was.id)) changes.push({ theme: was.name, what: "removed" });
  return changes;
}

/** The kind a publish of these changes is at least: a removed theme needs work in products, an added one adds, values fix. */
export function proposedKind(changes: readonly Change[]): Exclude<ReleaseKind, "first"> {
  if (changes.some(change => change.what === "removed")) return "needs-work";
  if (changes.some(change => change.what === "added")) return "adds";
  return "fixes";
}

/** The version after `version` for a kind: 1.2 → 1.2.1 (Fixes), 1.3 (Adds), 2.0 (Needs work in products). */
export function nextVersion(version: string, kind: Exclude<ReleaseKind, "first">): string {
  const [major = 1, minor = 0, patch = 0] = version.split(".").map(part => Number(part) || 0);
  if (kind === "needs-work") return `${major + 1}.0`;
  if (kind === "adds") return `${major}.${minor + 1}`;
  return `${major}.${minor}.${patch + 1}`;
}

/** The system with its working copy published as the next version. */
export function publish(system: System, kind: Exclude<ReleaseKind, "first">, note: string, now = new Date()): System {
  const release: Release = { version: nextVersion(liveOf(system).version, kind), kind, note: note.trim(), at: now.toISOString(), theme: system.theme, themes: system.themes };
  return { ...system, releases: [...system.releases, release] };
}

/**
 * The system with one theme published from a project's exploration (solo: straight away; approval comes with a second
 * person): Live gets the theme, in the place of the one it was made from or as a new one, and so does the working copy,
 * which keeps its other unpublished changes.
 */
export function publishTheme(system: System, theme: SystemTheme, replaces: string | null, kind: Exclude<ReleaseKind, "first">, note: string, from: string, now = new Date()): System {
  const put = (themes: SystemTheme[]) => replaces && themes.some(entry => entry.id === replaces)
    ? themes.map(entry => entry.id === replaces ? { ...theme, id: replaces } : entry)
    : [...themes, theme];
  const live = liveOf(system);
  const release: Release = { version: nextVersion(live.version, kind), kind, note: note.trim(), at: now.toISOString(), from, theme: live.theme, themes: put(live.themes) };
  return { ...system, themes: put(system.themes), releases: [...system.releases, release] };
}

/** The system with its working copy set back to Live (Discard changes), or to an earlier release (Restore). */
export function revertTo(system: System, version?: string): System {
  const release = system.releases.find(entry => entry.version === version) ?? liveOf(system);
  return { ...system, themes: release.themes, theme: release.themes.some(theme => theme.id === system.theme) ? system.theme : release.theme };
}

/**
 * A system as its file holds it. `canvas` may add marks of its own to each theme's settings (the app's positions mark, so a
 * later conversion knows these are positions).
 */
export function systemFile(system: System, canvas: (axes: CanvasAxes) => Record<string, unknown> = axes => axes) {
  const themeFile = (theme: SystemTheme) => ({ id: theme.id, name: theme.name, canvas: canvas(theme.canvas), material: theme.material, colours: theme.colours, accent: theme.accent });
  return {
    version: SYSTEM_FILE_VERSION,
    id: system.id, name: system.name, origin: system.origin, created: system.created, theme: system.theme,
    themes: system.themes.map(themeFile),
    releases: system.releases.map(release => ({
      version: release.version, kind: release.kind, note: release.note, at: release.at, ...(release.from ? { from: release.from } : {}),
      theme: release.theme, themes: release.themes.map(themeFile),
    })),
  };
}

/** A new system from the Area Starter: one theme, Default, at Area's shipped values. */
export function starterSystem(name: string, taken: Iterable<string>, restore: Restorers, origin: SystemOrigin = "starter", now = new Date()): System {
  const themes = [restoreTheme(null, restore, { id: "default", name: "Default" })];
  return {
    id: systemSlug(name, taken), name: name.trim() || "Untitled system", origin, created: now.toISOString(), theme: "default",
    themes, releases: [firstRelease(themes, "default", now.toISOString(), ORIGIN_LABEL[origin])],
  };
}

/** A new theme for a system: Area's shipped values, named after the system's count ("Theme 2"), with an id of its own. */
export function newTheme(system: System, restore: Restorers): SystemTheme {
  const ids = new Set(system.themes.map(theme => theme.id));
  let n = system.themes.length + 1;
  while (ids.has(`theme-${n}`)) n++;
  return restoreTheme(null, restore, { id: `theme-${n}`, name: `Theme ${n}` });
}

/**
 * The systems at launch: those read from disk, Area first. With no Area system on disk, the settings saved before systems
 * become its Default theme, once (`migrated` says so, and the app writes it). A saved Canvas from before positions or picks
 * converts on the way, as it did when it was the app's own.
 */
export function loadSystems(files: readonly unknown[], legacy: () => Legacy, restore: Restorers, now = new Date()): { systems: System[]; migrated: System | null } {
  const read: System[] = [];
  for (const file of files) {
    const system = readSystem(file, restore);
    if (system && !read.some(other => other.id === system.id)) read.push(system);
  }
  let migrated: System | null = null;
  if (!read.some(system => system.id === AREA_ID)) {
    const saved = legacy();
    const canvas = restore.canvas(saved.canvas ?? {});
    // The saved colours, or with none saved, the saved Canvas's page presets converted (restoreColours' own rule).
    const themes = [{ id: "default", name: "Default", canvas, material: restore.material(saved.material ?? null), colours: restore.colours(saved.colours ?? null, canvas), accent: restore.accent(saved.brand ?? null) }];
    migrated = { id: AREA_ID, name: "Area", origin: "area", created: now.toISOString(), theme: "default", themes, releases: [firstRelease(themes, "default", now.toISOString())] };
    read.push(migrated);
  }
  const area = read.find(system => system.id === AREA_ID)!;
  return { systems: [area, ...read.filter(system => system !== area).sort((a, b) => a.created.localeCompare(b.created))], migrated };
}

/** The system's chosen theme. */
export const activeTheme = (system: System): SystemTheme => system.themes.find(theme => theme.id === system.theme) ?? system.themes[0]!;

/** The system with its chosen theme changed by `change`. */
export function withTheme(system: System, change: (theme: SystemTheme) => SystemTheme): System {
  const chosen = activeTheme(system);
  return { ...system, themes: system.themes.map(theme => theme === chosen ? change(theme) : theme) };
}
