// Run from the repo root: node docs/research/icon-review/2026-10-14/tools/icon-data.mjs out.json name,name
// Render named icons (outline + filled at 16/24/32/48) to static SVG strings, via the real generator.
import { build } from "esbuild"; import { execFileSync } from "node:child_process"; import { mkdirSync, writeFileSync } from "node:fs";
const [out, names] = process.argv.slice(2); const dir = process.cwd() + "/apps/docs/.cache/lab/"; mkdirSync(dir, { recursive: true });
execFileSync("node", ["packages/icons/scripts/generate.mjs", "--only", names, "--emit", dir + "p.tsx"], { stdio: "ignore" });
writeFileSync(dir + "r.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup as m } from "react-dom/server";
import { PILOT_ICONS as A } from "./p.tsx";
export const data = Object.fromEntries(A.map(p => [p.name, Object.fromEntries([16, 24, 32, 48].map(s => [s, { o: m(h(p.Icon, { size: s })), f: m(h(p.Filled, { size: s })) }]))]));`);
await build({ entryPoints: [dir + "r.tsx"], bundle: true, format: "esm", platform: "node", outfile: dir + "r.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { data } = await import(dir + "r.out.mjs"); writeFileSync(out, JSON.stringify(data)); console.log(Object.keys(data).join(" "));
