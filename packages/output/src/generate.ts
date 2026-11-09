/**
 * The generator: a definition and a library in, every file the system is out, as project paths to contents. Pure and
 * deterministic: no clock, no file access, no randomness, every list sorted or in the library's own order, LF endings.
 * The same choices and library always give the same bytes (generate.test.ts).
 */
import { canonical, themeAttributes, type SystemDefinition } from "./definition.ts";
import { hold, type Held } from "./inventory.ts";
import type { Library } from "./library.ts";
import { agentsBlock, AGENTS_BLOCK, componentEntries, designMd } from "./targets/agents.ts";
import { axisNames, componentSheet, contextSelector, contextSheet, HEADER, scopedBase, themeScope, themeSheet } from "./targets/css.ts";
import { iconFiles } from "./targets/icons.ts";
import { reactFiles } from "./targets/react.ts";

export interface Generated {
  /** Project path → contents. `AGENTS.md#area` is a block inside AGENTS.md, not a file. */
  files: Record<string, string>;
  held: Held;
  /** Things the reader should know: options kept, components asked for that don't exist, selectors not understood. */
  notes: string[];
}

export function generate(def: SystemDefinition, lib: Library): Generated {
  const held = hold(lib, def.inventory);
  const out: Record<string, string> = {};
  const notes: string[] = [];
  const dir = def.output.dir;
  const put = (path: string, text: string) => { out[`${dir}/${path}`] = text.endsWith("\n") ? text : `${text}\n`; };

  if (def.output.targets.css) {
    const root = def.themes.find(t => t.id === def.theme)!;
    const rest = def.themes.filter(t => t !== root);
    const sheets = [themeSheet(lib, root, true), ...rest.map(t => themeSheet(lib, t, false))];
    for (const sheet of sheets) for (const selector of sheet.unknown) notes.push(`Theme: kept a selector the generator doesn't know, ${selector}`);
    put("css/tokens.css", `${HEADER(def, lib, "Area's tokens and their defaults")}\n${lib.tokens.properties.trim()}\n\n${lib.tokens.defaults.trim()}\n`);
    const themeNote = rest.length ? ` (${root.name} at :root; ${rest.map(t => `${t.name} on ${themeScope(t, false)}`).join(", ")})` : "";
    put("css/theme.css", `${HEADER(def, lib, `the system's choices${themeNote}`)}\n${sheets.map(sheet => sheet.css).join("\n\n")}\n`);
    const scopes = rest.map(t => themeScope(t, false));
    const themeScopes = [root, ...rest].map((t, i) => ({ attrs: themeAttributes(t, lib.tokens.defaultMaterial), scope: themeScope(t, i === 0) }));
    const later = new Set<string>();
    const context = contextSelector(themeScopes, axisNames(lib), later);
    for (const [file, css] of lib.styles.base) put(`css/${file}`, scopedBase(contextSheet(css, context), scopes));
    const selection = { blocks: held.slugs, known: new Set(held.keyOf.keys()), without: held.without };
    const components: string[] = [];
    for (const [file, css] of lib.styles.components) {
      const sheet = componentSheet(css, selection, context);
      if (sheet === null) continue;
      put(`css/components/${file}`, sheet);
      components.push(`components/${file}`);
    }
    for (const selector of [...later].sort()) notes.push(`CSS: a setting's attribute later in a selector stays as written, ${selector}`);
    const imports = ["tokens.css", "theme.css", ...lib.styles.base.map(([file]) => file), ...components].map(file => `@import "./${file}";`);
    put("css/index.css", `${HEADER(def, lib, "every sheet, in the order they cascade")}\n${lib.styles.layerOrder}\n\n${imports.join("\n")}\n`);
  }
  if (def.output.targets.react) for (const [path, text] of Object.entries(reactFiles(def, lib, held))) put(path, text);
  if (def.output.targets.icons) for (const [path, text] of Object.entries(iconFiles(def, lib))) put(path, text);
  const entries = componentEntries(lib, held);
  const left = [...held.keyOf.keys()].filter(slug => !held.slugs.has(slug)).sort();
  put("components.json", canonical({ system: def.system, version: def.release.version, library: lib.version, components: entries, left }));
  if (def.output.targets.agents) {
    out["DESIGN.md"] = designMd(def, lib, held, entries);
    out[AGENTS_BLOCK] = agentsBlock(def);
  }
  for (const slug of held.unknown) notes.push(`Inventory: the library has no component "${slug}"`);
  for (const k of held.kept) notes.push(`Inventory: ${k.slug} keeps ${k.option}, as ${k.why}`);
  const files = Object.fromEntries(Object.keys(out).sort().map(path => [path, out[path]!.replace(/\r\n/g, "\n")]));
  return { files, held, notes };
}
