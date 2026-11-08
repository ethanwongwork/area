/**
 * The icons target: the system's icons as a sprite (one `<symbol>` per icon and style, one per line, so an edit to one
 * icon merges on its own), their metadata, and one SVG per icon when the system asks for files.
 */
import type { SystemDefinition } from "../definition.ts";
import type { Library } from "../library.ts";

export function iconFiles(def: SystemDefinition, lib: Library): Record<string, string> {
  const wanted = def.inventory.icons === "all" ? null : new Set(def.inventory.icons);
  const meta = lib.icons.meta.filter(icon => !wanted || wanted.has(icon.name)).sort((a, b) => a.name.localeCompare(b.name));
  const names = new Set(meta.map(icon => icon.name));
  const symbols = lib.icons.sprite.split("\n").filter(line => {
    const id = /^<symbol id="area-([a-z0-9-]+?)(-filled)?"/.exec(line)?.[1];
    return id !== undefined && names.has(id);
  });
  const head = /^<svg[^>]*>/m.exec(lib.icons.sprite)?.[0] ?? `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">`;
  const files: Record<string, string> = {
    "icons/sprite.svg": `${head}\n${symbols.join("\n")}\n</svg>\n`,
    "icons/icons.json": `${JSON.stringify(meta.map(({ name, category, keywords }) => ({ name, ...(category ? { category } : {}), ...(keywords?.length ? { keywords } : {}) })), null, 2)}\n`,
  };
  if (def.output.iconFiles) for (const icon of meta) for (const suffix of ["", "-filled"]) {
    const svg = lib.icons.svg[`${icon.name}${suffix}.svg`];
    if (svg) files[`icons/svg/${icon.name}${suffix}.svg`] = svg;
  }
  return files;
}
