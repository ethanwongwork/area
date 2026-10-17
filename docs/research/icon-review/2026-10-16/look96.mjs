// Outline and filled at 96 (and 16) in a grid, for close inspection of strokes, cuts and negative space.
import { build } from "/Users/ethanwong/Desktop/area/node_modules/esbuild/lib/main.js";
import { writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { edgeShot } from "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0/docs/research/icon-review/2026-10-07/edge.mjs";
const D = new URL(".", import.meta.url).pathname, W = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0";
const [out, list] = process.argv.slice(2); const names = list.split(",");
execFileSync("node", [W + "/packages/icons/scripts/generate.mjs", "--only", names.join(","), "--emit", D + "l.tsx"], { cwd: W, stdio: "ignore" });
writeFileSync(D + "le.tsx", `import { createElement as h, Fragment } from "react"; import { renderToStaticMarkup as r } from "react-dom/server"; import * as A from "./l.tsx";
const pas = n => n.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("");
const C = (n, f) => A["Pilot" + pas(n) + (f ? "Filled" : "") + "Icon"];
export const page = names => r(h(Fragment, null, ...names.map(n => h("div", { className: "c", key: n }, h("b", null, n),
  h("div", { className: "r" }, h("span", { className: "t" }, h(C(n, 0), { size: 96 })), h("span", { className: "t" }, h(C(n, 1), { size: 96 })),
  h("span", { className: "s" }, h(C(n, 0), { size: 16 }), h(C(n, 1), { size: 16 }), h(C(n, 0), { size: 24 }), h(C(n, 1), { size: 24 })))))));`);
await build({ entryPoints: [D + "le.tsx"], bundle: true, format: "cjs", platform: "node", outfile: D + "le.cjs", nodePaths: ["/Users/ethanwong/Desktop/area/node_modules"], jsx: "automatic", logLevel: "error" });
const { page } = (await import(D + "le.cjs?" + Date.now())).default;
writeFileSync(D + "look.html", `<!doctype html><meta charset="utf-8"><style>body{margin:12px;font:12px system-ui;background:#fff;color:#1a1a1a;--area-weight-icon:1.125px;--_icon-overlap:4.5px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.c{border:1px solid #eee;padding:6px}b{display:block;margin-bottom:4px}.r{display:flex;gap:8px;align-items:center}.t{display:inline-flex;background:#f7f8fa;outline:1px solid #e9ebee}.s{display:flex;flex-direction:column;gap:6px}svg{display:block}</style>${page(names)}`);
await edgeShot(["--user-data-dir=" + D + "pl", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=900,${30 + Math.ceil(names.length / 3) * 130}`], out, "file://" + D + "look.html");
console.log(out);
