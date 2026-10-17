// Outlier sheet: each icon between the keyline references (info, square-plus | document, folder) at 16 and 24, and the
// 24px drawing at 2x, with a centre cross, so size and centring read against the set.
import { readFileSync, writeFileSync } from "node:fs";
import { edgeShot } from "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0/docs/research/icon-review/2026-10-07/edge.mjs";
const D = new URL(".", import.meta.url).pathname, W = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0";
const [out, spec] = process.argv.slice(2);
const sections = JSON.parse(spec);
const svg = (n, s) => readFileSync(`${W}/packages/icons/dist/svg/${s}/${n}.svg`, "utf8");
const big = n => svg(n, 24).replace('width="24" height="24"', 'width="48" height="48"');
const t = (n, s) => `<span class="t" style="width:${s}px;height:${s}px">${s === 48 ? big(n) : svg(n, s)}</span>`;
const set = (n, s) => ["info", "square-plus", n, "document", "folder"].map(x => `<span class="${x === n ? "me" : ""}">${t(x, s)}</span>`).join("");
const html = `<!doctype html><meta charset="utf-8"><style>body{font:12px system-ui;margin:20px;color:#1a1a1a;background:#fff}h2{font-size:14px;margin:18px 0 2px}p{color:#666;margin:0 0 8px}
.r{display:flex;align-items:center;gap:14px;border-bottom:1px solid #eee;padding:6px 0}.l{width:150px;flex:none}.l small{display:block;color:#888}.c{display:flex;align-items:center;gap:6px}.c+.c{border-left:1px solid #ddd;padding-left:14px}
.t{display:inline-flex;position:relative;background:#f7f8fa;outline:1px solid #e9ebee}.me .t{background:#fff3c4}svg{display:block}.c48 .t::after{content:"";position:absolute;inset:0;background:linear-gradient(#e5484d55,#e5484d55) 50% 0/1px 100% no-repeat,linear-gradient(#e5484d55,#e5484d55) 0 50%/100% 1px no-repeat}</style>
${sections.map(([title, note, rows]) => `<h2>${title}</h2><p>${note}</p>` + rows.map(([n, why]) => `<div class="r"><span class="l">${n}<small>${why}</small></span><span class="c">${set(n, 16)}</span><span class="c">${set(n, 24)}</span><span class="c c48">${set(n, 48)}</span></div>`).join("")).join("")}`;
writeFileSync(D + "outliers.html", html);
const rows = sections.reduce((a, s) => a + s[2].length, 0);
await edgeShot(["--user-data-dir=" + D + "profO", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=1000,${60 + sections.length * 60 + rows * 63}`], out, "file://" + D + "outliers.html");
console.log(out);
