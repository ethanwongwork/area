/**
 * What a system holds: the components it chose, the ones those need (a Dialog draws Buttons), and the options it leaves
 * out, with what the library won't let it leave out and why. Pure; read from the library's manifests and React sources.
 *
 * A component is a manifest (its slug is its block without `area-`). Its React file is the one named after it
 * (button → Button.tsx); a component with none is CSS only. What a file needs is its relative imports, followed to the
 * end, and the manifests it reads (`buttonVariants`, `MANIFESTS.button`).
 *
 * An option a system leaves out is dropped from the CSS and from the React types. It stays when it is the component's
 * default, or when a component the system holds uses it (`<Button variant="ghost">` inside Dialog), so nothing the
 * system ships draws unstyled; each kept option is reported.
 */
import type { Inventory } from "./definition.ts";
import type { Library, Manifest } from "./library.ts";

export const slugOf = (manifest: Manifest) => manifest.block.replace(/^area-/, "");
const pascal = (slug: string) => slug.split("-").map(part => part[0]!.toUpperCase() + part.slice(1)).join("");

/** Files the library never writes out: Theme switches Area's settings at runtime, which a written system has fixed. */
export const NEVER_WRITTEN = new Set(["Theme.tsx"]);

export interface Held {
  /** Manifest keys by slug, for every component the library has. */
  keyOf: Map<string, string>;
  /** Slugs the system chose, and those added because a chosen one needs them (slug → the chosen slugs that need it). */
  chosen: Set<string>;
  needed: Map<string, Set<string>>;
  /** Every slug held: chosen ∪ needed. */
  slugs: Set<string>;
  /** React files written. */
  files: Set<string>;
  /** Left-out options per slug: modifier values (variant values and flags). */
  without: Map<string, Set<string>>;
  /** Options asked to be left out but kept, with why. */
  kept: Array<{ slug: string; option: string; why: string }>;
  /** Slugs asked for that the library doesn't have. */
  unknown: string[];
}

/** A React file's relative imports, as file names in components/ (`./Button.tsx` → Button.tsx). */
export function importsOf(source: string): string[] {
  const out = new Set<string>();
  for (const m of source.matchAll(/(?:from\s+|import\s+)["']\.\/([^"']+)["']/g)) out.add(m[1]!);
  return [...out];
}

/** The manifest keys a React file reads. */
export function manifestsOf(source: string, keys: Set<string>, variantKey: Map<string, string>): Set<string> {
  const out = new Set<string>();
  for (const m of source.matchAll(/\bMANIFESTS\.(\w+)/g)) if (keys.has(m[1]!)) out.add(m[1]!);
  for (const m of source.matchAll(/\b(\w+Variants)\b/g)) { const key = variantKey.get(m[1]!); if (key && keys.has(key)) out.add(key); }
  return out;
}

/** `export const buttonVariants = … createVariants(manifests.button)`: each helper's manifest key. */
export function variantKeys(variantsSource: string): Map<string, string> {
  return new Map([...variantsSource.matchAll(/export const (\w+Variants) = [^;]*?createVariants\(manifests\.(\w+)\)/g)].map(m => [m[1]!, m[2]!]));
}

export function hold(lib: Library, inventory: Inventory): Held {
  const keyOf = new Map(Object.entries(lib.manifests).map(([key, manifest]) => [slugOf(manifest), key]));
  const slugByKey = new Map([...keyOf].map(([slug, key]) => [key, slug]));
  const keys = new Set(keyOf.values());
  const byName = new Map(Object.entries(lib.manifestNames).map(([key, name]) => [name, key]));
  const variantKey = new Map([...variantKeys(lib.react.variants)].map(([helper, name]) => [helper, byName.get(name) ?? name]));
  const asked = inventory.components === "all" ? [...keyOf.keys()] : inventory.components;
  const unknown = asked.filter(slug => !keyOf.has(slug)).sort();
  const chosen = new Set(asked.filter(slug => keyOf.has(slug)));

  // Each chosen component's file, then every file those import.
  const files = new Set<string>();
  const needed = new Map<string, Set<string>>();
  const fileOwner = new Map<string, string>();
  for (const slug of [...chosen].sort()) {
    const file = `${pascal(slug)}.tsx`;
    if (!(file in lib.react.components) || NEVER_WRITTEN.has(file)) continue;
    const queue = [file];
    while (queue.length) {
      const next = queue.shift()!;
      if (files.has(next) && fileOwner.get(next) !== slug) {
        // Already followed for another chosen component; its needs are recorded there, but this one needs them too.
      }
      const first = !files.has(next);
      files.add(next);
      if (!fileOwner.has(next)) fileOwner.set(next, slug);
      const source = lib.react.components[next];
      if (source === undefined) continue;
      for (const key of manifestsOf(source, keys, variantKey)) {
        const other = slugByKey.get(key)!;
        if (chosen.has(other)) continue;
        const by = needed.get(other) ?? new Set<string>();
        by.add(slug);
        needed.set(other, by);
      }
      if (first) for (const imported of importsOf(source)) if (imported in lib.react.components && !NEVER_WRITTEN.has(imported)) queue.push(imported);
    }
  }
  // A needed component brings its own file and what that needs (already followed through imports, but its manifest may
  // name a file no chosen file imports).
  let grew = true;
  while (grew) {
    grew = false;
    for (const slug of [...needed.keys()]) {
      const file = `${pascal(slug)}.tsx`;
      if (files.has(file) || !(file in lib.react.components) || NEVER_WRITTEN.has(file)) continue;
      const queue = [file];
      while (queue.length) {
        const next = queue.shift()!;
        if (files.has(next)) continue;
        files.add(next);
        grew = true;
        const source = lib.react.components[next]!;
        for (const key of manifestsOf(source, keys, variantKey)) {
          const other = slugByKey.get(key)!;
          if (chosen.has(other)) continue;
          const by = needed.get(other) ?? new Set<string>();
          for (const parent of needed.get(slug) ?? []) by.add(parent);
          needed.set(other, by);
        }
        for (const imported of importsOf(source)) if (imported in lib.react.components && !NEVER_WRITTEN.has(imported)) queue.push(imported);
      }
    }
  }
  const slugs = new Set([...chosen, ...needed.keys()]);

  // Options left out, less those the system can't do without.
  const without = new Map<string, Set<string>>();
  const kept: Held["kept"] = [];
  const sources = [...files].map(file => [file, lib.react.components[file]!] as const);
  for (const [slug, axes] of Object.entries(inventory.exclude).sort(([a], [b]) => a.localeCompare(b))) {
    const key = keyOf.get(slug);
    if (!key || !slugs.has(slug)) continue;
    const manifest = lib.manifests[key]!;
    const component = pascal(slug);
    const out = new Set<string>();
    for (const [axis, values] of Object.entries(axes)) {
      const offered = axis === "flags" ? manifest.booleans ?? [] : manifest.variants[axis] ?? [];
      for (const value of values) {
        if (!offered.includes(value)) continue;
        const option = axis === "flags" ? value : `${axis}=${value}`;
        if (axis !== "flags" && manifest.defaults[axis] === value) { kept.push({ slug, option, why: "it is the default" }); continue; }
        const prop = axis === "flags" ? value.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) : axis;
        const user = sources.find(([file, source]) => file !== `${component}.tsx` && usesOption(source, component, `${key}Variants`, prop, axis === "flags" ? null : value));
        if (user) { kept.push({ slug, option, why: `${user[0].replace(/\.tsx?$/, "")} uses it` }); continue; }
        out.add(value);
      }
    }
    if (out.size) without.set(slug, out);
  }
  return { keyOf, chosen, needed, slugs, files, without, kept, unknown };
}

/** Whether a source uses a component's option: `<Button tone="discovery"`, `<Button iconOnly`, or `buttonVariants({ tone: "discovery" })`. */
export function usesOption(source: string, component: string, helper: string, prop: string, value: string | null): boolean {
  const literal = value === null ? `${prop}(?:=\\{true\\}|(?=[\\s/>]))` : `${prop}=(?:"${value}"|'${value}'|\\{["']${value}["']\\})`;
  if (new RegExp(`<${component}\\b[^<>]*?\\s${literal}`).test(source)) return true;
  const call = value === null ? `${prop}:\\s*true` : `${prop}:\\s*["']${value}["']`;
  return new RegExp(`\\b${helper}\\(\\{[^)]*?\\b${call}`).test(source);
}

/** A manifest without the options a system leaves out. */
export function pruneManifest(manifest: Manifest, without: Set<string> | undefined): Manifest {
  if (!without?.size) return manifest;
  const variants = Object.fromEntries(Object.entries(manifest.variants).map(([axis, values]) => [axis, values.filter(v => !without.has(v))]));
  const booleans = manifest.booleans?.filter(flag => !without.has(flag));
  return { ...manifest, variants, ...(manifest.booleans ? { booleans: booleans! } : {}) };
}
