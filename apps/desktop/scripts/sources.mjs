/**
 * Every component's own files, for a family's API, Code and Spec tabs (owner, 2026-10-18: "showing all information
 * about the component, any and all data, code associated with it"): its spec (docs/specs/*.md), its stylesheet
 * (packages/styles/src/components/*.css), its React source (packages/react/src/components/*.tsx) and the JSDoc of
 * every `*Props` interface, so a prop's description is the one its source carries. Read at build time and
 * rebuilt when any of them changes, as the demo snippets are (snippets.mjs).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIRS = { specs: ["docs/specs", ".md"], css: ["packages/styles/src/components", ".css"], react: ["packages/react/src/components", ".tsx"],
  // The patterns' screens, for a project layer's Code tab in the design interface (src/design-panel.tsx, 2026-11-06).
  screens: ["apps/desktop/src/content/examples", ".tsx"] };

/** Every source file, as absolute paths (the renderer watches them). */
export const sourceFiles = repo => Object.values(DIRS).flatMap(([dir, ext]) =>
  readdirSync(join(repo, dir)).filter(name => name.endsWith(ext)).map(name => join(repo, dir, name)));

/** { specs, css, react, screens }: file name -> text; propDocs: interface -> prop -> description. */
export function readSources(repo) {
  const out = {};
  for (const [key, [dir, ext]] of Object.entries(DIRS)) {
    out[key] = Object.fromEntries(readdirSync(join(repo, dir)).filter(name => name.endsWith(ext)).sort()
      .map(name => [name, readFileSync(join(repo, dir, name), "utf8")]));
  }
  out.propDocs = {};
  for (const text of Object.values(out.react)) Object.assign(out.propDocs, propDocs(text));
  return out;
}

/**
 * The JSDoc over each member of each exported `*Props` interface. A member's body runs to the first line that closes
 * the interface at its own indent; `@deprecated` keeps its sentence, marked.
 */
function propDocs(text) {
  const docs = {};
  for (const match of text.matchAll(/^export interface (\w+Props)\b[^\n]*\{\n([\s\S]*?)^\}/gm)) {
    const members = {};
    for (const [, comment, name] of match[2].matchAll(/\/\*\*([\s\S]*?)\*\/\s*\n\s*(?:readonly\s+)?"?([\w-]+)"?\??:/g)) {
      const clean = comment.split("\n").map(line => line.replace(/^\s*\*\s?/, "").trim()).filter(Boolean).join(" ")
        .replace(/@deprecated\s*/, "Deprecated: ");
      if (!members[name]) members[name] = clean;
    }
    docs[match[1]] = members;
  }
  return docs;
}
