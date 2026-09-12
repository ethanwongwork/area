/**
 * Renders every demo to static HTML, and extracts each one's source.
 *
 * esbuild bundles the registry (which pulls in the real React components) into a single
 * ESM module; Node then imports it and renders. The snippet for a demo is that same
 * demo's own source text, sliced out of the file it lives in -- so a preview and its code
 * sample are two views of one artefact rather than two things that have to be kept in
 * agreement by hand.
 */
import { build } from "esbuild";
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function renderDemos() {
  // Built inside the project, not a temp directory: the bundle leaves react external, so
  // it has to sit somewhere Node's resolution can still find the workspace's node_modules.
  const outdir = join(root, ".cache");
  mkdirSync(outdir, { recursive: true });
  const outfile = join(outdir, `registry.${Date.now()}.mjs`);

  await build({
    entryPoints: [join(root, "src", "registry.tsx")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    jsx: "automatic",
    // React and the renderer stay external so the bundle uses the installed copies.
    external: ["react", "react-dom", "react/jsx-runtime", "react-dom/server"],
    logLevel: "silent",
  });

  const { DEMOS, SOURCES } = await import(pathToFileURL(outfile).href);
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { createElement } = await import("react");

  const sources = extractSources(SOURCES);
  const rendered = {};

  for (const [name, Component] of Object.entries(DEMOS)) {
    rendered[name] = {
      html: renderToStaticMarkup(createElement(Component)),
      code: sources[name] ?? "",
    };
    if (!sources[name]) {
      throw new Error(`Demo "${name}" rendered but its source could not be located.`);
    }
  }

  rmSync(outfile, { force: true });
  return rendered;
}

/**
 * Pull each `export const X = () => ...` block out of the demo files.
 *
 * Deliberately literal: the snippet a reader copies is the exact text that produced the
 * preview beside it, with the arrow-function wrapper unwrapped so it reads as JSX.
 */
function extractSources(files) {
  const out = {};

  for (const file of Object.values(files)) {
    const text = readFileSync(join(root, file), "utf8");
    const pattern = /^export const (\w+) = \(\) => (\(\n[\s\S]*?\n\)|.*?);$/gm;

    for (const match of text.matchAll(pattern)) {
      const [, name, body] = match;
      out[name] = unwrap(body);
    }
  }
  return out;
}

/** Strip the wrapping parens and fragment, and dedent. */
function unwrap(body) {
  let code = body.trim();

  if (code.startsWith("(") && code.endsWith(")")) {
    code = code.slice(1, -1).trim();
  }

  const lines = code.split("\n");
  // A fragment is a demo-file artefact for grouping examples, not part of the API.
  if (lines[0]?.trim() === "<>" && lines.at(-1)?.trim() === "</>") {
    lines.shift();
    lines.pop();
  }

  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^\s*/)[0].length);
  const dedent = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(dedent)).join("\n").trim();
}
