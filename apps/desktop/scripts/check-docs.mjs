/**
 * Every Documentation entry (src/content/documentation/*.mjs) must describe the family as it is: parts and states the
 * manifest declares, families that exist, keys Kbd can draw, and Do / Don't rows on both sides. Run after a build of
 * @area/styles (the manifest is read from its dist):
 *
 *   npm run check:docs -w @area/desktop            errors only
 *   npm run check:docs -w @area/desktop -- --gaps  also lists families, parts and states with no entry yet
 *   npm run check:docs -w @area/desktop -- button  one family, with its gaps
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MANIFESTS } from "@area/styles/manifest";

const app = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { COMPONENT_PAGES } = await import(app + "/src/content/pages.mjs");
const { DOCUMENTATION_GROUPS } = await import(app + "/src/content/documentation.mjs");

const args = process.argv.slice(2);
const showGaps = args.includes("--gaps");
const only = args.find(arg => !arg.startsWith("--"));

const families = new Map(COMPONENT_PAGES.filter(page => !page.docsOnly).map(page => [page.slug, page]));
// Key names Kbd draws as a legend (primitives.tsx KEY_GLYPHS), plus the named keys it prints as written.
const GLYPH_KEYS = ["cmd", "meta", "shift", "alt", "option", "ctrl", "control", "enter", "return", "backspace", "delete",
  "escape", "esc", "tab", "space", "up", "down", "left", "right"];
const NAMED_KEYS = ["home", "end", "pageup", "pagedown", "contextmenu", "menu", "mod"];
const keyOk = key => GLYPH_KEYS.includes(key.toLowerCase()) || NAMED_KEYS.includes(key.toLowerCase()) || /^f([1-9]|1[0-2])$/i.test(key) || /^[A-Za-z0-9/.,\[\]\-=;']$/.test(key);
const ARIA = /^(aria-[a-z]+|role(="[a-z ]+")?|inert|hidden|popover|tabindex|disabled|readonly|required|alt|lang|dir|title|scope|headers|for|id|name|type|open|value|datetime|cite|href|target|rel|download|autocomplete|inputmode|spellcheck|contenteditable|data-[a-z-]+)$/;

const errors = [];
const gaps = [];
const seen = new Map();
const text = (where, value, max = 240) => {
  if (typeof value !== "string" || !value.trim()) errors.push(`${where}: empty text`);
  else if (value.length > max) errors.push(`${where}: ${value.length} characters; keep it under ${max}, one sentence or two`);
  else if (/\b(TODO|TBD|lorem)\b/i.test(value)) errors.push(`${where}: placeholder text`);
};

for (const [group, entries] of Object.entries(DOCUMENTATION_GROUPS)) {
  for (const [slug, doc] of Object.entries(entries)) {
    if (only && slug !== only) continue;
    const at = `${group}.mjs › ${slug}`;
    if (seen.has(slug)) errors.push(`${at}: also in ${seen.get(slug)}.mjs`);
    seen.set(slug, group);
    const page = families.get(slug);
    if (!page) { errors.push(`${at}: no family with this slug in pages.mjs`); continue; }
    const manifest = page.manifest ? MANIFESTS[page.manifest] : undefined;
    const known = new Set(["instead", "practices", "parts", "states", "keyboard", "aria"]);
    for (const key of Object.keys(doc)) if (!known.has(key)) errors.push(`${at}: unknown field "${key}"`);

    for (const [i, row] of (doc.instead ?? []).entries()) {
      const [when, slugs, why] = row;
      text(`${at} › instead[${i}] situation`, when, 160);
      text(`${at} › instead[${i}] why`, why);
      if (!Array.isArray(slugs) || !slugs.length) errors.push(`${at} › instead[${i}]: name at least one family`);
      for (const other of slugs ?? []) {
        if (other === slug) errors.push(`${at} › instead[${i}]: points at itself`);
        else if (!families.has(other)) errors.push(`${at} › instead[${i}]: "${other}" is not a family slug`);
      }
    }

    const practices = doc.practices ?? [];
    for (const [i, [kind, guidance]] of practices.entries()) {
      if (kind !== "Do" && kind !== "Don't") errors.push(`${at} › practices[${i}]: "${kind}" is not Do or Don't`);
      text(`${at} › practices[${i}]`, guidance);
    }
    if (practices.length && (!practices.some(([k]) => k === "Do") || !practices.some(([k]) => k === "Don't")))
      errors.push(`${at} › practices: give both Do and Don't rows`);
    const dos = practices.filter(([k]) => k === "Do").map(([, g]) => g);
    if (practices.length) {
      const order = practices.map(([k]) => k).join(",");
      if (order !== [...dos.map(() => "Do"), ...practices.filter(([k]) => k === "Don't").map(() => "Don't")].join(","))
        errors.push(`${at} › practices: list every Do before the first Don't`);
    }

    const elements = new Set(["root", ...(manifest?.elements ?? [])]);
    for (const [part, about] of Object.entries(doc.parts ?? {})) {
      if (!manifest) errors.push(`${at} › parts: the family has no manifest, so the tab shows no Anatomy`);
      else if (!elements.has(part)) errors.push(`${at} › parts.${part}: not a manifest element of ${manifest.block} (${[...elements].join(", ")})`);
      text(`${at} › parts.${part}`, about);
    }
    const states = new Set(manifest?.states ?? []);
    for (const [state, about] of Object.entries(doc.states ?? {})) {
      if (!states.has(state)) errors.push(`${at} › states.${state}: not a manifest state of ${manifest?.block ?? slug} (${[...states].join(", ") || "none"})`);
      text(`${at} › states.${state}`, about);
    }

    for (const [i, [keys, action]] of (doc.keyboard ?? []).entries()) {
      for (const key of String(keys).split(" or ").flatMap(chord => chord.split("+"))) {
        if (!keyOk(key)) errors.push(`${at} › keyboard[${i}]: "${key}" is not a key name Kbd draws (Tab, Enter, Space, Escape, Up, Down, Left, Right, Home, End, Shift, Cmd, a letter)`);
      }
      text(`${at} › keyboard[${i}]`, action);
    }
    for (const [i, [attributes, when]] of (doc.aria ?? []).entries()) {
      for (const name of String(attributes).split(", ")) if (!ARIA.test(name)) errors.push(`${at} › aria[${i}]: "${name}" is not an attribute name`);
      text(`${at} › aria[${i}]`, when);
    }

    if (showGaps || only) {
      for (const part of elements) if (!(part in (doc.parts ?? {}))) gaps.push(`${slug}: part "${part}" has no description`);
      for (const state of states) if (!(state in (doc.states ?? {}))) gaps.push(`${slug}: state "${state}" has no description`);
      for (const field of ["instead", "practices"]) if (!doc[field]?.length) gaps.push(`${slug}: no ${field}`);
    }
  }
}
if (showGaps && !only) for (const slug of families.keys()) if (!seen.has(slug)) gaps.push(`${slug}: no entry`);

for (const gap of gaps) console.log(`gap    ${gap}`);
for (const error of errors) console.error(`error  ${error}`);
console.log(`\n  documentation: ${seen.size} of ${families.size} families, ${errors.length} error${errors.length === 1 ? "" : "s"}${showGaps || only ? `, ${gaps.length} gap${gaps.length === 1 ? "" : "s"}` : ""}`);
process.exit(errors.length ? 1 : 0);
