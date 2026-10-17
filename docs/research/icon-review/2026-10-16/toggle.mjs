// Toggle pairs: A, B, and B over A (A light), at 16 / 24 / 48, outline and filled. Before (built dist) and After (sources).
import { build } from "/Users/ethanwong/Desktop/area/node_modules/esbuild/lib/main.js";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { edgeShot } from "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0/docs/research/icon-review/2026-10-07/edge.mjs";
const D = new URL(".", import.meta.url).pathname, W = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0";
const [out, ...pairs] = process.argv.slice(2); const P = pairs.map(p => p.split(","));
const names = [...new Set(P.flat())];
execFileSync("node", [W + "/packages/icons/scripts/generate.mjs", "--only", names.join(","), "--emit", D + "t.tsx"], { cwd: W, stdio: "ignore" });
writeFileSync(D + "te.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup as r } from "react-dom/server"; import * as A from "./t.tsx";
const pas = n => n.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("");
export const svg = (n, s, f) => r(h(A["Pilot" + pas(n) + (f ? "Filled" : "") + "Icon"], { size: s }));`);
await build({ entryPoints: [D + "te.tsx"], bundle: true, format: "cjs", platform: "node", outfile: D + "te.cjs", nodePaths: ["/Users/ethanwong/Desktop/area/node_modules"], jsx: "automatic", logLevel: "error" });
const { svg: raw } = (await import(D + "te.cjs?" + Date.now())).default;
writeFileSync(D + "tb.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup as r } from "react-dom/server"; import * as A from "./main.tsx";
const pas = n => n.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("");
export const svg = (n, s, f) => r(h(A["Pilot" + pas(n) + (f ? "Filled" : "") + "Icon"], { size: s }));`);
await build({ entryPoints: [D + "tb.tsx"], bundle: true, format: "cjs", platform: "node", outfile: D + "tb.cjs", nodePaths: ["/Users/ethanwong/Desktop/area/node_modules"], jsx: "automatic", logLevel: "error" });
const { svg: rawB } = (await import(D + "tb.cjs?" + Date.now())).default;
let k = 0; const uniq = s => { const u = "q" + (k++) + "_"; return s.replace(/id="([^"]+)"/g, (m, i) => 'id="' + u + i + '"').replace(/url\(#([^)]+)\)/g, (m, i) => "url(#" + u + i + ")"); };
const after = (n, s, f) => uniq(raw(n, s, f));
const before = (n, s, f) => uniq(rawB(n, s, f));
const cell = (src, a, b, s, f) => `<span class="t" style="width:${s}px;height:${s}px">${src(a, s, f)}</span><span class="t" style="width:${s}px;height:${s}px">${src(b, s, f)}</span><span class="t ov" style="width:${s}px;height:${s}px"><span class="a">${src(a, s, f)}</span><span class="b">${src(b, s, f)}</span></span>`;
const row = (lab, src, a, b) => `<div class="r"><span class="l">${lab}</span>` + [16, 24, 48].map(s => `<span class="c">${cell(src, a, b, s, 0)}</span>`).join("") + `<span class="c">${cell(src, a, b, 48, 1)}</span></div>`;
writeFileSync(D + "toggle.html", `<!doctype html><meta charset="utf-8"><style>body{font:12px system-ui;margin:16px;background:#fff;color:#1a1a1a;--area-weight-icon:1.125px;--_icon-overlap:4.5px}h3{margin:10px 0 2px;font-size:13px}p{margin:0 0 6px;color:#777}.r{display:flex;align-items:center;gap:12px;padding:4px 0}.l{width:56px;color:#888}.c{display:flex;align-items:center;gap:6px}.c+.c{border-left:1px solid #ddd;padding-left:12px}.t{display:inline-flex;position:relative;background:#f7f8fa;outline:1px solid #e9ebee}svg{display:block}.ov .a,.ov .b{position:absolute;inset:0}.ov .a{color:#e5484d;opacity:.45}.ov .b{color:#1a1a1a}</style><p>Before = main today; After = this branch. Each group: the first icon, the second, then the second over the first (red). Outline 16 / 24 / 48, filled 48.</p>` +
  P.map(([a, b]) => `<h3>${a} ↔ ${b}</h3>${row("Before", before, a, b)}${row("After", after, a, b)}`).join(""));
await edgeShot(["--user-data-dir=" + D + "pt", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=1150,${50 + P.length * 165}`], out, "file://" + D + "toggle.html");
console.log(out);
