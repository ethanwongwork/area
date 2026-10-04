// Data for the one-by-one icon review page: every Area icon (outline and filled, large with the
// true 16px line and at 16 / 24 / 32 through the size curve) in group order, with Fluent, Lucide
// and Phosphor references (MIT / ISC). From the repository root, after `npm run icons:pilot` and
// `node apps/docs/scripts/icon-refs.mjs fetch`:
//   node docs/research/icon-review/2026-10-03/review-data.mjs out/data.js
import { build } from "esbuild"; import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module"; import { dirname, join } from "node:path";
import { GROUPS } from "./groups.mjs";
const [out] = process.argv.slice(2);
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/rv.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
const r = (C, p) => renderToStaticMarkup(h(C, { weight: 1.125, ...p })).replace(/ aria-hidden="true"| focusable="false"/g, "");
export const all = PILOT_ICONS.filter(p => !p.derivedFrom).map(p => ({ name: p.name, fill: p.fill,
  o: r(p.Icon, { width: 16, height: 16 }), f: r(p.Filled, { width: 16, height: 16 }),
  os: [16, 24, 32].map(s => r(p.Icon, { size: s })), fs: [16, 24, 32].map(s => r(p.Filled, { size: s })) }));`);
await build({ entryPoints: [cache + "/rv.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/rv.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { all } = await import(cache + "/rv.out.mjs?" + Date.now());
const map = JSON.parse(readFileSync("docs/research/icon-audit/area-map.json", "utf8"));
const read = p => existsSync(p) ? readFileSync(p, "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/<\?xml[^>]*>/, "").trim() : "";
const FLUENT = join(dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json")), "icons");
const fluent = (stem, cut) => { for (const s of [16, 20, 24]) { const v = read(join(FLUENT, `${stem}_${s}_${cut}.svg`)); if (v) return v.replace("<svg ", '<svg fill="currentColor" '); } return ""; };
const REFS = "apps/docs/.cache/refs";
const lucide = n => read(join(REFS, "lucide-static/package/icons", n + ".svg"));
const phosphor = (n, cut) => read(join(REFS, "phosphor-icons-core/package/assets", cut, n + (cut === "regular" ? "" : "-" + cut) + ".svg"));
const order = Object.entries(GROUPS).flatMap(([g, list]) => list.split(/\s+/).map(n => [n, g]));
const seen = new Set(), rows = [];
for (const [n, g] of [...order, ...all.map(a => [a.name, "Other"])]) {
  if (seen.has(n)) continue; const a = all.find(x => x.name === n); if (!a) continue; seen.add(n);
  const m = map[n] ?? {}, refs = {};
  if (m.fluent) { const o = fluent(m.fluent, "regular"), f = fluent(m.fluent, "filled"); if (o) refs.Fluent = { name: m.fluent, o, f }; }
  if (m.lucide) { const o = lucide(m.lucide); if (o) refs.Lucide = { name: m.lucide, o }; }
  if (m.phosphor) { const o = phosphor(m.phosphor, "regular"), f = phosphor(m.phosphor, "fill"); if (o) refs.Phosphor = { name: m.phosphor, o, f }; }
  rows.push({ ...a, group: g, refs });
}
writeFileSync(out, "window.ICONS = " + JSON.stringify(rows) + ";\n");
console.log(out, rows.length, "icons,", rows.filter(r => !Object.keys(r.refs).length).length, "without references");
