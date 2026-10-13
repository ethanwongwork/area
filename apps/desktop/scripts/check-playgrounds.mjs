/**
 * Every tile a Stage playground (src/content/playgrounds.tsx) maps to a configuration must render the
 * element its own demo writes: same component, same props, same content. Props are compared as a set
 * (order aside) and a demo's `style` is its tile's frame, not the component's. Run:
 *
 *   node apps/desktop/scripts/check-playgrounds.mjs
 */
import { build } from "esbuild";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const app = resolve(dirname(fileURLToPath(import.meta.url)), "..");
// Bundled inside the project, as the archived site's render.mjs does: React stays external, so the
// bundle has to sit where Node still finds the workspace's node_modules.
const scratch = join(app, ".cache");
mkdirSync(scratch, { recursive: true });
const out = join(scratch, `playgrounds.${Date.now()}.mjs`);
await build({ entryPoints: [app + "/src/content/playgrounds.tsx"], outfile: out, bundle: true, format: "esm", platform: "node", jsx: "automatic", external: ["react", "react-dom", "react/jsx-runtime"], logLevel: "silent", });
const { PLAYGROUNDS, tileConfig, configCode } = await import(pathToFileURL(out).href);
const { extractSnippets, demoFiles } = await import(app + "/scripts/snippets.mjs");
const { COMPONENT_PAGES } = await import(app + "/src/content/pages.mjs");
const { componentSpecimens } = await import(app + "/src/content/specimens.mjs");
const { specimenName } = await import(app + "/src/content/specimen-names.mjs");
const snippets = extractSnippets(demoFiles(app + "/src/content/demos"));
// An element as name + sorted attributes + content; a bare attribute reads as ={true}, and an
// attribute set to the component's own default is left out (a demo may spell `size="md"` out).
const parse = (code, defaults) => {
  const m = code.trim().match(/^<(\w+)((?:\s+[\w-]+(?:=(?:"[^"]*"|\{[^}]*\}))?)*)\s*(?:\/>|>([\s\S]*?)<\/\1>)$/);
  if (!m) return null;
  const attrs = [...m[2].matchAll(/([\w-]+)(?:=("[^"]*"|\{[^}]*\}))?/g)].map(([, n, v]) => `${n}=${v ?? "{true}"}`).filter(a => !a.startsWith("style=") && !defaults.has(a)).sort();
  return `${m[1]} ${attrs.join(" ")} | ${m[3] ?? ""}`;
};
let bad = 0, ok = 0, comp = 0, unread = 0;
for (const [slug, playground] of Object.entries(PLAYGROUNDS)) {
  const family = COMPONENT_PAGES.find(f => f.slug === slug);
  const defaults = new Set(playground.controls.filter(c => typeof c.fallback === "string").map(c => `${c.prop}="${c.fallback}"`));
  for (const example of componentSpecimens(family, () => true)) {
    const config = tileConfig(playground, specimenName(example, slug));
    if (!config) { comp++; continue; }
    // A demo generated in a loop (Badge's gallery map) has no source of its own to compare.
    if (!snippets[example.demo]) { unread++; continue; }
    const generated = parse(configCode(playground, config).split("\n").at(-1), defaults);
    const demo = parse(snippets[example.demo], defaults);
    if (generated === demo) ok++; else { bad++; console.log(`MISMATCH ${slug}/${example.id}\n  demo: ${demo ?? snippets[example.demo]}\n  gen:  ${generated}`); }
  }
}
rmSync(out, { force: true });
console.log(`${ok} tiles match their demos, ${unread} without a source, ${comp} compositions, ${bad} mismatches`);
process.exit(bad ? 1 : 0);
