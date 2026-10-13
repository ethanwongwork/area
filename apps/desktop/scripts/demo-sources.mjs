/**
 * Each demo's own source, for the Stage's Code section: the virtual module `area:demo-sources`
 * maps a demo's name to the text that renders it, sliced out of its file in src/content/demos at
 * build time. The archived site's render.mjs does the same for its snippets: a preview and its code
 * are two views of one artefact, never a hand-typed copy.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Pull every `export const X = () => ...` block out of the demo files, keyed by X. */
export function demoSources(directory) {
  const out = {};
  const files = readdirSync(directory).filter(file => file.endsWith(".tsx")).map(file => join(directory, file));
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const pattern = /^export const (\w+) = \(\) => (\(\n[\s\S]*?\n\)|\{\n[\s\S]*?\n\}|.*?);$/gm;
    for (const [, name, body] of text.matchAll(pattern)) {
      out[name] = body.startsWith("{") ? `const ${name} = () => ${body};` : unwrap(body);
    }
  }
  return { sources: out, files };
}

/**
 * Strip the wrapping parens and fragment, and dedent (render.mjs's rule). Only blank lines are
 * trimmed from the ends, so the first line keeps its indent and dedents with the rest.
 */
function unwrap(body) {
  let code = body.trim();
  if (code.startsWith("(") && code.endsWith(")")) code = code.slice(1, -1).replace(/^\s*\n|\n\s*$/g, "");
  const lines = code.split("\n");
  // A fragment is a demo-file artefact for grouping examples, not part of the API.
  if (lines[0]?.trim() === "<>" && lines.at(-1)?.trim() === "</>") { lines.shift(); lines.pop(); }
  const indents = lines.filter(line => line.trim()).map(line => line.match(/^\s*/)[0].length);
  const dedent = indents.length ? Math.min(...indents) : 0;
  return lines.map(line => line.slice(dedent)).join("\n").trim();
}

/** The esbuild plugin that serves `area:demo-sources` and rebuilds when a demo file changes. */
export function demoSourcesPlugin(directory) {
  return {
    name: "demo-sources",
    setup(build) {
      build.onResolve({ filter: /^area:demo-sources$/ }, () => ({ path: "demo-sources", namespace: "area" }));
      build.onLoad({ filter: /.*/, namespace: "area" }, () => {
        const { sources, files } = demoSources(directory);
        return { contents: `export default ${JSON.stringify(sources)};`, loader: "js", watchFiles: files };
      });
    },
  };
}
