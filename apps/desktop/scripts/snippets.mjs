/**
 * Each demo's code, read from its own source (src/content/demos/*.tsx), for the Inspector's Copy
 * code: the snippet and the tile are one artefact, as the registry promises (registry.tsx). The
 * pattern and the unwrapping are the archived docs build's (apps/docs/scripts/render.mjs,
 * extractSources), which wrote the same snippets into its pages.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Every demo file, as absolute paths (the renderer watches them). */
export const demoFiles = dir => readdirSync(dir).filter(name => name.endsWith(".tsx")).map(name => join(dir, name));

/** Demo name -> its code. */
export function extractSnippets(files) {
  const out = {};
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const pattern = /^export const (\w+) = \(\) => (\(\n[\s\S]*?\n\)|\{\n[\s\S]*?\n\}|.*?);$/gm;
    for (const [, name, body] of text.matchAll(pattern)) {
      out[name] = body.startsWith("{") ? `const ${name} = () => ${body};` : unwrap(body);
    }
  }
  return out;
}

/**
 * Strip the wrapping parens and fragment, and dedent. Only blank lines are trimmed from the ends, so
 * the first line keeps its indent and dedents with the rest (trimming it left a multi-line snippet's
 * first line at 0 and every other line indented).
 */
function unwrap(body) {
  let code = body.trim();
  if (code.startsWith("(") && code.endsWith(")")) code = code.slice(1, -1).replace(/^\s*\n|\n\s*$/g, "");
  const lines = code.split("\n");
  // A fragment is a demo-file artefact for grouping examples, not part of the API.
  if (lines[0]?.trim() === "<>" && lines.at(-1)?.trim() === "</>") { lines.shift(); lines.pop(); }
  const indents = lines.filter(line => line.trim()).map(line => line.match(/^\s*/)[0].length);
  const indent = indents.length ? Math.min(...indents) : 0;
  return lines.map(line => line.slice(indent)).join("\n").trim();
}
