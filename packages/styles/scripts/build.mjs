/**
 * Bundles the stylesheet.
 *
 * Resolves @import itself rather than reaching for postcss-import, which historically
 * does not honour package `exports` and would need a custom resolver anyway. Inlining
 * matters: an @import left in a published stylesheet is a request waterfall, and worse,
 * a layer-order hazard, because several bundlers hoist imports above the @layer
 * statement that orders them.
 */
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { transform } from "esbuild";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const require = createRequire(import.meta.url);

const IMPORT = /^@import\s+["']([^"']+)["'];\s*$/gm;

function resolveImport(specifier, fromFile) {
  if (specifier.startsWith(".")) return resolve(dirname(fromFile), specifier);
  // Bare specifier: go through Node resolution so package `exports` is honoured.
  return require.resolve(specifier, { paths: [dirname(fromFile)] });
}

const seen = new Set();

function inline(file) {
  if (seen.has(file)) return "";
  seen.add(file);

  const source = readFileSync(file, "utf8");
  return source.replace(IMPORT, (_match, specifier) => {
    const target = resolveImport(specifier, file);
    return `\n/* ${specifier} */\n${inline(target)}`;
  });
}

const entry = join(root, "src", "index.css");
const css = inline(entry);
// Parsing must precede publishing: selector parity cannot detect a stray brace that
// makes the browser discard the next component's layer.
const parsed = await transform(css, { loader: "css", logLevel: "silent" });
if (parsed.warnings.length) throw new Error(parsed.warnings.map(w => w.text).join("\n"));

if (/^@import/m.test(css)) {
  throw new Error("An @import survived bundling; every import must be inlined.");
}

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "area.css"), css, "utf8");

const kb = (Buffer.byteLength(css, "utf8") / 1024).toFixed(1);
console.log(`\n  @area/styles\n\n  dist/area.css ${kb.padStart(10)} kB   (${seen.size} files)\n`);
