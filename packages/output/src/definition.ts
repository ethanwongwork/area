/**
 * The definition: `.area/system.json`, what a system is when it leaves the app (docs/research/system-output-2026-11-08).
 * Written from one published release, never from the working copy, so what reaches a folder is always something that
 * was published. It holds choices only, never generated values: the generator works the tokens out from them.
 *
 *   format       this file's own version (1)
 *   system       id and name
 *   release      the version it was written from: number, kind and note
 *   themes       every theme of that release, each its settings (the Canvas axes), Material, exact page colours and accent
 *   theme        the theme painted at :root; the others are scopes (`data-area-system-theme="<id>"`)
 *   inventory    which components and which of their options the system offers (the inventory work fills this; until it
 *                does, every component and every option)
 *   structure    structure choices (reserved: the inventory work's)
 *   output       where generated files go and which targets are written
 *
 * Pure: no file access. `canonical` is the one way it is written, so the same choices are the same bytes.
 */

export const DEFINITION_FORMAT = 1;

export interface ThemeDefinition {
  id: string;
  name: string;
  /** The Canvas axes, each a string as the app stores them: "radius": "10", "pills": "button chip". */
  settings: Record<string, string>;
  material: { bundle: string; overrides: Record<string, string> };
  /** Exact page colours per mode, `oklch(L C h)` or a hex, or null where the settings decide. */
  colours: { light: string | null; dark: string | null };
  /** The exact accent (Brand colours), or off. */
  accent: { on: boolean; primary: string; secondary: string | null; tertiary: string | null; status: "harmonised" | "own" };
}

export interface Inventory {
  /** Component slugs (a manifest's block without `area-`), or every component. */
  components: "all" | string[];
  /** Options a system leaves out, per component slug: an axis to the values it doesn't offer ("button": { "tone": ["discovery"] }). Booleans go under "flags". */
  exclude: Record<string, Record<string, string[]>>;
  /** Icon names, or every icon. */
  icons: "all" | string[];
}

export interface OutputOptions {
  /** The folder generated files go in, relative to the project. */
  dir: string;
  targets: { css: boolean; react: boolean; icons: boolean; agents: boolean };
  /** How the React target's relative imports end: none (bundlers), ".js" (Node ESM) or ".ts". */
  importExtension: "" | ".js" | ".ts";
  /** One SVG per icon beside the sprite. */
  iconFiles: boolean;
}

export interface SystemDefinition {
  format: number;
  system: { id: string; name: string };
  release: { version: string; kind: string; note: string };
  theme: string;
  themes: ThemeDefinition[];
  inventory: Inventory;
  structure: Record<string, string>;
  output: OutputOptions;
}

export const DEFAULT_OUTPUT: OutputOptions = { dir: "design-system", targets: { css: true, react: true, icons: true, agents: true }, importExtension: "", iconFiles: false };
export const DEFAULT_INVENTORY: Inventory = { components: "all", exclude: {}, icons: "all" };

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const strings = (value: unknown): Record<string, string> => isObject(value) ? Object.fromEntries(Object.entries(value).filter(([, v]) => typeof v === "string")) as Record<string, string> : {};

function themeFrom(saved: unknown, at: number): ThemeDefinition {
  const t = isObject(saved) ? saved : {};
  const material = isObject(t.material) ? t.material : {};
  const colours = isObject(t.colours) ? t.colours : {};
  const accent = isObject(t.accent) ? t.accent : {};
  // The app's file holds the Canvas under `canvas` with marks of its own (positions, series); the definition `settings`.
  const { positions: _p, series: _s, ...settings } = strings(t.settings ?? t.canvas);
  const colour = (value: unknown) => typeof value === "string" && value ? value : null;
  return {
    id: typeof t.id === "string" && t.id ? t.id : `theme-${at + 1}`,
    name: typeof t.name === "string" && t.name ? t.name : at ? `Theme ${at + 1}` : "Default",
    settings,
    material: { bundle: typeof material.bundle === "string" ? material.bundle : "none", overrides: strings(material.overrides) },
    colours: { light: colour(colours.light), dark: colour(colours.dark) },
    accent: {
      on: accent.on === true,
      primary: typeof accent.primary === "string" ? accent.primary : "#006df5",
      secondary: colour(accent.secondary),
      tertiary: colour(accent.tertiary),
      status: accent.status === "own" ? "own" : "harmonised",
    },
  };
}

function inventoryFrom(saved: unknown): Inventory {
  if (!isObject(saved)) return DEFAULT_INVENTORY;
  const list = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((v): v is string => typeof v === "string"))].sort() : "all" as const;
  const exclude: Inventory["exclude"] = {};
  if (isObject(saved.exclude)) for (const [slug, axes] of Object.entries(saved.exclude)) {
    if (!isObject(axes)) continue;
    const kept: Record<string, string[]> = {};
    for (const [axis, values] of Object.entries(axes)) if (Array.isArray(values)) kept[axis] = [...new Set(values.filter((v): v is string => typeof v === "string"))].sort();
    exclude[slug] = kept;
  }
  return { components: list(saved.components), exclude, icons: list(saved.icons) };
}

function outputFrom(saved: unknown): OutputOptions {
  const o = isObject(saved) ? saved : {};
  const targets = isObject(o.targets) ? o.targets : {};
  const on = (key: keyof OutputOptions["targets"]) => targets[key] !== false;
  const dir = typeof o.dir === "string" && o.dir && !o.dir.startsWith("/") && !o.dir.split("/").includes("..") ? o.dir.replace(/\/+$/, "") : DEFAULT_OUTPUT.dir;
  return {
    dir,
    targets: { css: on("css"), react: on("react"), icons: on("icons"), agents: on("agents") },
    importExtension: o.importExtension === ".js" || o.importExtension === ".ts" ? o.importExtension : "",
    iconFiles: o.iconFiles === true,
  };
}

/** A definition read from `.area/system.json` (or any object of its shape), each part checked; throws when it is not one. */
export function readDefinition(saved: unknown): SystemDefinition {
  if (!isObject(saved)) throw new Error("A system definition is a JSON object.");
  const system = isObject(saved.system) ? saved.system : {};
  if (typeof system.id !== "string" || !/^[a-z0-9-]+$/.test(system.id)) throw new Error("A system definition needs system.id: lower case letters, digits and hyphens.");
  const themes = (Array.isArray(saved.themes) ? saved.themes : []).map(themeFrom);
  if (!themes.length) throw new Error("A system definition needs at least one theme.");
  const release = isObject(saved.release) ? saved.release : {};
  return {
    format: DEFINITION_FORMAT,
    system: { id: system.id, name: typeof system.name === "string" && system.name ? system.name : system.id },
    release: { version: typeof release.version === "string" ? release.version : "1.0", kind: typeof release.kind === "string" ? release.kind : "first", note: typeof release.note === "string" ? release.note : "" },
    theme: themes.some(t => t.id === saved.theme) ? String(saved.theme) : themes[0]!.id,
    themes,
    inventory: inventoryFrom(saved.inventory),
    structure: strings(saved.structure),
    output: outputFrom(saved.output),
  };
}

/**
 * A definition from a system as the app saves it (`systemFile` in apps/desktop/src/systems.ts): one of its releases, the
 * latest when `version` is not given. Inventory and structure come from the release where it has them (the inventory
 * work), else from the system, else every component.
 */
export function definitionFromSystem(file: unknown, version?: string, keep?: Partial<Pick<SystemDefinition, "output" | "inventory" | "structure">>): SystemDefinition {
  if (!isObject(file)) throw new Error("Not a system file.");
  const releases = Array.isArray(file.releases) ? file.releases.filter(isObject) : [];
  const release = version ? releases.find(r => r.version === version) : releases[releases.length - 1];
  if (!release) throw new Error(version ? `The system has no version ${version}.` : "The system has no published version.");
  return readDefinition({
    system: { id: file.id, name: file.name },
    release: { version: release.version, kind: release.kind, note: release.note },
    theme: release.theme,
    themes: release.themes,
    inventory: release.inventory ?? file.inventory ?? keep?.inventory,
    structure: release.structure ?? file.structure ?? keep?.structure,
    output: keep?.output ?? file.output,
  });
}

/** JSON with every object's keys sorted, two-space indented, ending in a newline: the one way a definition is written. */
export function canonical(value: unknown): string {
  const sort = (v: unknown): unknown => Array.isArray(v) ? v.map(sort) : isObject(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, sort(v[k])])) : v;
  return `${JSON.stringify(sort(value), null, 2)}\n`;
}

/**
 * The attributes a theme's settings write, as the app writes them on a specimen (canvasAttributes in
 * apps/desktop/src/studio.tsx, materialAttributes in material.ts): every setting, Contrast at System writing none, and the
 * Material's bundle and overrides unless it is the default bundle with nothing moved. Names without `data-area-`.
 */
export function themeAttributes(theme: ThemeDefinition, defaultMaterial = "none"): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [axis, value] of Object.entries(theme.settings)) {
    if (axis === "theme" || (axis === "contrast" && value === "system")) continue;
    out[axis] = value;
  }
  const overrides = Object.keys(theme.material.overrides);
  if (theme.material.bundle !== defaultMaterial || overrides.length) {
    out.material = theme.material.bundle;
    for (const key of overrides) out[`material-${key}`] = theme.material.overrides[key]!;
  }
  if (theme.colours.light || theme.colours.dark) out.colours = "";
  if (theme.accent.on) out.brand = "";
  return out;
}
