// Icons outline and filled at 320px with the true 16px line on a 16-unit grid, for close
// inspection of cut-outs and slivers (SIZE=48 draws a 48px icon enlarged). node docs/research/icon-review/2026-10-03/big.mjs out.png name…
import { build } from "esbuild"; import { writeFileSync, existsSync, rmSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, ...names] = process.argv.slice(2); const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/big.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
export const html = names => renderToStaticMarkup(h("div", { className: "w" }, ...names.map(n => { const p = PILOT_ICONS.find(x => x.name === n); if (!p) throw new Error("no icon " + n);
  return h("div", { className: "c" }, h("div", { className: "p" }, ...[p.Icon, p.Filled].map(C => h("div", { className: "g" }, h(C, process.env.SIZE ? { weight: 1.125, size: Number(process.env.SIZE), width: 320, height: 320 } : { weight: 1.125, width: 320, height: 320 })))), h("div", null, n)); })));`);
await build({ entryPoints: [cache + "/big.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/big.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/big.out.mjs?" + Date.now());
writeFileSync(cache + "/big.html", `<!doctype html><style>body{margin:10px;background:#fff;color:#111;font:13px system-ui}.w{display:flex;flex-wrap:wrap;gap:14px 28px}.c{text-align:center}.p{display:flex;gap:8px}.g{background-image:linear-gradient(#e33a 1px,transparent 1px),linear-gradient(90deg,#e33a 1px,transparent 1px);background-size:20px 20px}.g svg{display:block;opacity:.85}</style>${html(names)}`);
rmSync(out, { force: true });
try { execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--user-data-dir=" + cache + "/edge-big", "--window-size=1420," + (360 * Math.ceil(names.length / 2) + 20), "--screenshot=" + out, "file://" + cache + "/big.html"], { stdio: "ignore", timeout: 8000, killSignal: "SIGKILL" }); } catch (e) { if (!existsSync(out)) throw e; }
console.log(out);
