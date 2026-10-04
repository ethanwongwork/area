// Filled options side by side: per row, the outline, then each option's filled variant, at 64px
// (true 16px line) and at 16 / 24 / 32 through the size curve. Option sources are prototype SVGs
// in apps/docs/assets/area-icons-pilot (proto-*.svg while the sheet is made; removed after).
//   node docs/research/icon-review/2026-10-04/options.mjs out.png "label|unused|name:label;name:label" …
// Each option shows its own outline and filled variant.
import { build } from "esbuild"; import { writeFileSync, existsSync, rmSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, ...rowsArg] = process.argv.slice(2);
const rows = rowsArg.map(r => { const [label, outline, opts] = r.split("|"); return { label, outline, opts: opts.split(";").map(o => { const [n, l] = o.split(":"); return { n, l }; }) }; });
const names = [...new Set(rows.flatMap(r => r.opts.map(o => o.n)))];
const cache = process.cwd() + "/apps/docs/.cache", tag = "op" + process.pid;
execFileSync("node", ["apps/docs/scripts/gen-pilot-icons.mjs", "--only", names.join(","), "--emit", `${cache}/${tag}.tsx`], { stdio: "inherit" });
writeFileSync(`${cache}/${tag}-e.tsx`, `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "./${tag}.tsx";
const g = n => PILOT_ICONS.find(p => p.name === n);
export const o = n => renderToStaticMarkup(h(g(n).Icon, { weight: 1.125, width: 64, height: 64 })) + '<i>' + [16, 24, 32].map(s => renderToStaticMarkup(h(g(n).Icon, { size: s }))).join("") + '</i>';
export const f = n => renderToStaticMarkup(h(g(n).Filled, { weight: 1.125, width: 64, height: 64 })) + '<i>' + [16, 24, 32].map(s => renderToStaticMarkup(h(g(n).Filled, { size: s }))).join("") + '</i>';`);
await build({ entryPoints: [`${cache}/${tag}-e.tsx`], bundle: true, format: "esm", platform: "node", outfile: `${cache}/${tag}.mjs`, external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { o, f } = await import(`${cache}/${tag}.mjs?${Date.now()}`);
let uid = 0; const fix = s => s.replace(/<svg/g, () => { uid++; return "<svg"; }).replace(/area-icon-[A-Za-z0-9_-]+/g, m => m + "-" + uid + "-" + Math.random().toString(36).slice(2, 6));
const uniq = s => { const ids = {}; return s.replace(/area-icon-[A-Za-z0-9_-]+/g, m => ids[m] ??= m + "-" + (++uid)); };
const cell = (html, label) => `<div class="c"><div class="lb">${label}</div><div class="v">${html}</div></div>`;
const max = Math.max(...rows.map(r => r.opts.length));
const body = rows.map(r => `<div class="r"><b>${r.label}</b>${r.opts.map(x => cell(uniq(o(x.n)) + uniq(f(x.n)), x.l)).join("")}</div>`).join("");
writeFileSync(`${cache}/${tag}.html`, `<!doctype html><style>body{margin:14px;font:13px system-ui;color:#111;background:#fff}.v>svg+i+svg{margin-top:8px}.r{display:flex;gap:14px;align-items:flex-start;border-bottom:1px solid #e5e5e5;padding:10px 0}b{width:120px;padding-top:24px}.c{width:170px}.lb{font-size:11px;color:#666;height:18px}.v{display:flex;flex-direction:column;gap:6px}.v>svg{background-image:linear-gradient(#f2e2e2 1px,transparent 1px),linear-gradient(90deg,#f2e2e2 1px,transparent 1px);background-size:4px 4px}.v i{display:flex;gap:10px;align-items:center}svg{display:block}</style>${body}`);
rmSync(out, { force: true });
try { execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${cache}/edge-${tag}`, `--window-size=${170 + max * 184},${rows.length * 250 + 30}`, "--screenshot=" + out, `file://${cache}/${tag}.html`], { stdio: "ignore", timeout: 10000, killSignal: "SIGKILL" }); } catch (e) { if (!existsSync(out)) throw e; }
for (const x of [`${tag}.tsx`, `${tag}-e.tsx`, `${tag}.mjs`, `${tag}.html`]) rmSync(`${cache}/${x}`, { force: true });
rmSync(`${cache}/edge-${tag}`, { recursive: true, force: true });
console.log(out);
