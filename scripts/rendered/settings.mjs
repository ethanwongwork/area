// The Canvas settings a rendered run may set (--set axis=value), checked before any browser opens: an unknown setting
// or value fails loudly here, since the app silently drops one it doesn't know (studio.tsx restoreCanvas keeps only the
// values src/gallery/controls.ts lists). The ids and values are the registry's (@area/tokens/config, built to
// packages/tokens/dist), the same lists the Inspector's controls are made from. After the page opens, capture.mjs
// checks that every non-default value reached the specimens' scope (data-area-<axis>), so a drop the registry would
// allow still fails.
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(HERE, "../..");
const CONFIG = join(ROOT, "packages/tokens/dist/config.js");

let registry;
/** { presets: { axis: [values] }, defaults: { axis: value }, pills: { shapes, defaults } } from the built registry. */
export async function loadRegistry() {
  if (registry) return registry;
  if (!existsSync(CONFIG)) throw new Error(`No built registry at ${CONFIG}: run npm run build first.`);
  const config = await import(pathToFileURL(CONFIG).href);
  const presets = Object.fromEntries(Object.entries(config.AXIS_PRESETS).map(([axis, values]) => [axis, [...values].map(String)]));
  // Contrast is a scoped setting outside the registry (docs/CONTRAST.md): System, or 0–8 in quarters (gallery/controls.ts).
  presets.contrast = ["system", ...Array.from({ length: 33 }, (_, quarter) => String(quarter / 4))];
  const defaults = { ...Object.fromEntries(Object.entries(config.DEFAULT_AXES).map(([axis, value]) => [axis, String(value)])), contrast: "system" };
  registry = { presets, defaults, pills: { shapes: [...config.PILL_SHAPES], defaults: [...config.DEFAULT_PILLS] } };
  return registry;
}

const near = (word, list) => list.filter(item => item.startsWith(word.slice(0, 3)) || item.includes(word)).slice(0, 6);

/**
 * Checks `set` ({ axis: value }) against the registry. Throws one error naming every unknown setting and value, with
 * the values each takes. `theme` is not a setting here: a run renders light and dark (--theme picks one).
 */
export async function validateSet(set) {
  const { presets, pills } = await loadRegistry();
  const problems = [];
  for (const [axis, value] of Object.entries(set)) {
    if (value === undefined || value === "") { problems.push(`${axis}: no value (write --set ${axis}=<value>)`); continue; }
    if (axis === "theme") { problems.push("theme: not a Canvas setting here; a run renders both modes (use --theme light|dark)"); continue; }
    if (axis === "pills") {
      const bad = value.split(/\s+/).filter(Boolean).filter(shape => !pills.shapes.includes(shape));
      if (bad.length) problems.push(`pills: ${bad.join(", ")} not a shape; shapes are ${pills.shapes.join(", ")} (space-separated)`);
      continue;
    }
    const values = presets[axis];
    if (!values) { problems.push(`${axis}: no such setting${near(axis, Object.keys(presets)).length ? ` (did you mean ${near(axis, Object.keys(presets)).join(", ")}?)` : ""}`); continue; }
    if (!values.includes(String(value))) {
      const shown = values.length > 24 ? `${values.slice(0, 12).join(", ")} … ${values.slice(-4).join(", ")} (${values.length} values)` : values.join(", ");
      problems.push(`${axis}=${value}: not one of its values: ${shown}`);
    }
  }
  if (problems.length) throw new Error(`Unknown settings for a rendered run:\n  ${problems.join("\n  ")}`);
  return set;
}

/** The settings in `set` that differ from the registry's defaults. */
export async function moved(set) {
  const { defaults, pills } = await loadRegistry();
  const same = (axis, value) => axis === "pills"
    ? [...value.split(/\s+/).filter(Boolean)].sort().join(" ") === [...pills.defaults].sort().join(" ")
    : defaults[axis] === String(value);
  return Object.fromEntries(Object.entries(set).filter(([axis, value]) => !same(axis, value)));
}

/** "type=16 density=36": `--set` pairs, for a log line. */
export const describe = set => Object.entries(set).map(([axis, value]) => `${axis}=${value}`).join(" ") || "defaults";

/** A file-name id for settings with no corner name: "density-36_type-16". */
export const idOf = set => Object.entries(set).sort(([a], [b]) => a.localeCompare(b)).map(([axis, value]) => `${axis}-${String(value).replace(/[^a-z0-9.]+/gi, "-")}`).join("_") || "defaults";

/** The named corners and the fast family subset (corners.json). */
export function readCorners() {
  return JSON.parse(readFileSync(join(HERE, "corners.json"), "utf8"));
}
