/**
 * Systems (docs/research/app-structure-2026-10-28/README.md, Phase 2; called brands until the owner renamed them,
 * 2026-10-29): a system is the look and the rules a product is built with. A workspace holds several, each a folder in the app's
 * own data, `~/Library/Application Support/Area/Systems/<id>/system.json` (electron/main.cjs), never in the repository. A
 * system has themes; a theme is what the Inspector's Theme view edits: the Canvas settings, the Material, the exact page
 * colours and the exact accent (Brand colours, src/brand.ts). The open system's chosen theme is what every page paints its specimens in.
 *
 * Until 2026-10-29 those settings were the app's own, in localStorage (`canvas`, `material`, `colours`, `brand`); the first
 * launch with no system on disk makes them the Area system's Default theme, once (`loadSystems`). Pure: the systems test
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
  themes: SystemTheme[];
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
  return {
    id: s.id, name: s.name.trim(), origin,
    created: typeof s.created === "string" ? s.created : new Date(0).toISOString(),
    theme: themes.some(theme => theme.id === s.theme) ? String(s.theme) : themes[0]!.id,
    themes,
  };
}

/**
 * A system as its file holds it. `canvas` may add marks of its own to each theme's settings (the app's positions mark, so a
 * later conversion knows these are positions).
 */
export function systemFile(system: System, canvas: (axes: CanvasAxes) => Record<string, unknown> = axes => axes) {
  return {
    version: SYSTEM_FILE_VERSION,
    id: system.id, name: system.name, origin: system.origin, created: system.created, theme: system.theme,
    themes: system.themes.map(theme => ({ id: theme.id, name: theme.name, canvas: canvas(theme.canvas), material: theme.material, colours: theme.colours, accent: theme.accent })),
  };
}

/** A new system from the Area Starter: one theme, Default, at Area's shipped values. */
export function starterSystem(name: string, taken: Iterable<string>, restore: Restorers, origin: SystemOrigin = "starter", now = new Date()): System {
  return {
    id: systemSlug(name, taken), name: name.trim() || "Untitled system", origin, created: now.toISOString(), theme: "default",
    themes: [restoreTheme(null, restore, { id: "default", name: "Default" })],
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
    migrated = {
      id: AREA_ID, name: "Area", origin: "area", created: now.toISOString(), theme: "default",
      // The saved colours, or with none saved, the saved Canvas's page presets converted (restoreColours' own rule).
      themes: [{ id: "default", name: "Default", canvas, material: restore.material(saved.material ?? null), colours: restore.colours(saved.colours ?? null, canvas), accent: restore.accent(saved.brand ?? null) }],
    };
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
