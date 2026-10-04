// A private preview while drawing: lints the named sources, generates only them (--emit, so
// src/pilot-icons.tsx is untouched and parallel sessions don't collide) and renders each icon's
// outline and filled at 240px with the true 16px line, at 16 / 24 / 32 / 48 through the size curve,
// and beside a reference (Fluent, Lucide or Phosphor, regular and filled) when one is named.
// From the repository root:
//   node docs/research/icon-review/2026-10-03/preview.mjs out.png name[:lib] …
//   lib: fluent | lucide | phosphor (the reference from docs/research/icon-audit/area-map.json,
//   or name:lib=refname to pick another), e.g. pushpin:fluent  trash:lucide  tv:lucide=tv
// Needs `node apps/docs/scripts/icon-refs.mjs fetch` once for Lucide and Phosphor.
import { build } from "esbuild"; import { writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process"; import { createRequire } from "node:module"; import { dirname, join } from "node:path";
const [out, ...args] = process.argv.slice(2);
if (!out || !args.length) { console.log("usage: preview.mjs out.png name[:lib[=ref]] …"); process.exit(1); }
const items = args.map(a => { const [name, rest] = a.split(":"); const [lib, ref] = (rest ?? "").split("="); return { name, lib: lib?.toLowerCase(), ref }; });
const cache = process.cwd() + "/apps/docs/.cache", tag = process.pid;
const lint = execFileSync("node", ["apps/docs/scripts/gen-pilot-icons.mjs", "--only", items.map(i => i.name).join(","), "--emit", `${cache}/pv-${tag}.tsx`], { encoding: "utf8" });
console.log(lint.trim());
writeFileSync(`${cache}/pv-${tag}-entry.tsx`, `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "./pv-${tag}.tsx";
const r = (C, p) => renderToStaticMarkup(h(C, { weight: 1.125, ...p }));
export const get = n => { const p = PILOT_ICONS.find(x => x.name === n); if (!p) return null;
  return { o: r(p.Icon, { width: 240, height: 240 }), f: r(p.Filled, { width: 240, height: 240 }),
    s: [16, 24, 32, 48].map(s => r(p.Icon, { size: s })).join("") + "<i></i>" + [16, 24, 32, 48].map(s => r(p.Filled, { size: s })).join("") }; };`);
await build({ entryPoints: [`${cache}/pv-${tag}-entry.tsx`], bundle: true, format: "esm", platform: "node", outfile: `${cache}/pv-${tag}.mjs`, external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { get } = await import(`${cache}/pv-${tag}.mjs?${Date.now()}`);
const map = JSON.parse(readFileSync("docs/research/icon-audit/area-map.json", "utf8"));
const read = p => existsSync(p) ? readFileSync(p, "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/<\?xml[^>]*>/, "") : "";
const FLUENT = join(dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json")), "icons");
const fluent = (stem, cut) => { for (const s of [16, 20, 24]) { const v = read(join(FLUENT, `${stem}_${s}_${cut}.svg`)); if (v) return v.replace("<svg ", '<svg fill="currentColor" '); } return ""; };
const REFS = "apps/docs/.cache/refs";
const refOf = ({ name, lib, ref }) => {
  if (!lib) return null; const n = ref || map[name]?.[lib]; if (!n) return { label: `${lib}: no mapping`, o: "", f: "" };
  if (lib === "fluent") return { label: `Fluent ${n}`, o: fluent(n, "regular"), f: fluent(n, "filled") };
  if (lib === "lucide") return { label: `Lucide ${n}`, o: read(join(REFS, "lucide-static/package/icons", n + ".svg")), f: "" };
  if (lib === "phosphor") return { label: `Phosphor ${n}`, o: read(join(REFS, "phosphor-icons-core/package/assets/regular", n + ".svg")), f: read(join(REFS, "phosphor-icons-core/package/assets/fill", n + "-fill.svg")) };
  return null;
};
let uid = 0; const fix = s => { const n = ++uid; return s.replace(/area-icon-[A-Za-z0-9_-]+/g, m => m + "-" + n); };
const rows = items.map(it => { const a = get(it.name); if (!a) return `<div class="r"><b>${it.name}</b>: not found</div>`; const rf = refOf(it);
  return `<div class="r"><div class="n">${it.name}</div><div class="g">${fix(a.o)}</div><div class="g">${fix(a.f)}</div>` +
    (rf ? `<div class="sep"></div><div class="g ref">${rf.o}</div><div class="g ref">${rf.f}</div>` : "") +
    `<div class="s">${a.s.split("<i></i>").map(fix).join('<span class="bar"></span>')}${rf ? `<span class="lbl">${rf.label}</span>` : ""}</div></div>`; }).join("");
writeFileSync(`${cache}/pv-${tag}.html`, `<!doctype html><style>body{margin:12px;font:13px system-ui;color:#111;background:#fff}.r{display:grid;grid-template-columns:110px 240px 240px auto 240px 240px;gap:10px;align-items:center;border-bottom:1px solid #ddd;padding:8px 0}.n{font-weight:600;word-break:break-all}.g{width:240px;height:240px;background-image:linear-gradient(#f0d6d6 1px,transparent 1px),linear-gradient(90deg,#f0d6d6 1px,transparent 1px);background-size:15px 15px}.g svg{width:240px;height:240px;display:block}.ref svg{width:240px;height:240px}.sep{width:1px;height:220px;background:#ccc}.s{grid-column:2/-1;display:flex;align-items:center;gap:14px}.s svg{display:block}.bar{width:1px;height:40px;background:#ccc}.lbl{margin-left:auto;color:#666}</style>${rows}`);
rmSync(out, { force: true });
try { execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${cache}/edge-pv-${tag}`, `--window-size=1400,${items.length * 330 + 30}`, "--screenshot=" + out, `file://${cache}/pv-${tag}.html`], { stdio: "ignore", timeout: 10000, killSignal: "SIGKILL" }); } catch (e) { if (!existsSync(out)) throw e; }
for (const f of [`pv-${tag}.tsx`, `pv-${tag}-entry.tsx`, `pv-${tag}.mjs`, `pv-${tag}.html`]) rmSync(`${cache}/${f}`, { force: true });
rmSync(`${cache}/edge-pv-${tag}`, { recursive: true, force: true });
console.log(out);
