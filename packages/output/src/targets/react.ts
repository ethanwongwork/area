/**
 * The React target: Area's component sources, the ones the system holds, as the system's own files.
 *
 *   react/components/*.tsx   each held component's source and what it imports, unchanged but for import endings
 *   react/manifest.ts        the held components' manifests, left-out options removed, so the props' types narrow
 *   react/variants.ts        Area's class helpers, reading that manifest
 *   react/index.ts           the exports of every held file
 *
 * The sources need only React. They keep Area's class names, so the CSS target styles them as it styles Area's.
 */
import type { SystemDefinition } from "../definition.ts";
import { pruneManifest, slugOf, type Held } from "../inventory.ts";
import type { Library } from "../library.ts";

/** Relative imports with the ending the project wants (`./Button.tsx` → `./Button`). */
export function rewriteImports(source: string, ending: SystemDefinition["output"]["importExtension"]): string {
  return source.replace(/((?:from\s+|import\s+)["'])(\.{1,2}\/[^"']+?)\.tsx?(["'])/g, (_, head: string, path: string, tail: string) => `${head}${path}${ending}${tail}`);
}

const literal = (value: unknown): string => JSON.stringify(value);

function manifestSource(lib: Library, held: Held, header: string): string {
  const keys = [...held.slugs].map(slug => held.keyOf.get(slug)!).sort();
  const blocks = keys.map(key => {
    const m = pruneManifest(lib.manifests[key]!, held.without.get(slugOf(lib.manifests[key]!)));
    const lines = Object.entries(m).map(([field, value]) => `  ${field}: ${literal(value)},`);
    return `export const ${lib.manifestNames[key] ?? key} = {\n${lines.join("\n")}\n} as const satisfies ComponentManifest;`;
  });
  const entries = keys.map(k => lib.manifestNames[k] ? `  ${k}: ${lib.manifestNames[k]},` : `  ${k},`);
  return `${header}\n${lib.manifestInterface}\n\n${blocks.join("\n\n")}\n\nexport const MANIFESTS = {\n${entries.join("\n")}\n} as const satisfies Record<string, ComponentManifest>;\n`;
}

function variantsSource(lib: Library, held: Held, ending: string): string {
  const keys = new Set([...held.slugs].map(slug => { const key = held.keyOf.get(slug)!; return lib.manifestNames[key] ?? key; }));
  return lib.react.variants
    .replace(/["']@area\/styles\/manifest["']/g, `"./manifest${ending}"`)
    .split("\n")
    .filter(line => {
      const m = /createVariants\(manifests\.(\w+)\)/.exec(line);
      return !m || keys.has(m[1]!);
    })
    .join("\n");
}

function indexSource(lib: Library, held: Held, ending: string, header: string): string {
  const statements = [...lib.react.index.matchAll(/export\s+(?:\*|\{[^}]*\})\s+from\s+["']\.\/([^"']+)["'];?/g)];
  const kept = statements.filter(m => {
    const file = m[1]!;
    if (!file.startsWith("components/")) return true;
    return held.files.has(file.slice("components/".length));
  }).map(m => rewriteImports(m[0], ending as SystemDefinition["output"]["importExtension"]));
  return `${header}\n${kept.join("\n")}\n`;
}

export function reactFiles(def: SystemDefinition, lib: Library, held: Held): Record<string, string> {
  const ending = def.output.importExtension;
  const header = `/**\n * ${def.system.name} ${def.release.version}: React components.\n * Written by Area from library ${lib.version}. Edit freely: Area merges your edits when it writes the system again.\n * Import the styles once: import "../css/index.css";\n */`;
  const files: Record<string, string> = {
    "react/manifest.ts": manifestSource(lib, held, header),
    "react/variants.ts": rewriteImports(variantsSource(lib, held, ending), ending),
    "react/index.ts": indexSource(lib, held, ending, header),
  };
  for (const file of [...held.files].sort()) files[`react/components/${file}`] = rewriteImports(lib.react.components[file]!, ending);
  return files;
}
