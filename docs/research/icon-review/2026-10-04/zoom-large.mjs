// Outline and filled at the 16px and 48px line weights, drawn 200px wide, to inspect edges.
// From the repository root, after `npm run icons:pilot`: node docs/research/icon-review/2026-10-04/zoom.mjs out.png name,name,…
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, list] = process.argv.slice(2); const names = list.split(",");
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/zm.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
export const html = (names: string[]) => renderToStaticMarkup(h("div", { className: "g" }, ...names.map(n => { const p = PILOT_ICONS.find(p => p.name === n)!;
  return h("div", { className: "t", key: n }, h("div", null, n), ...[16, 48].flatMap(s => [h(p.Icon, { width: 420, height: 420, weight: 1.125, size: s, key: "o" + s }), h(p.Filled, { width: 420, height: 420, weight: 1.125, size: s, key: "f" + s })])); })));`);
await build({ entryPoints: [cache + "/zm.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/zm.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/zm.out.mjs?" + Date.now());
writeFileSync(cache + "/zm.html", `<!doctype html><style>body{font:13px system-ui;margin:10px}.t{margin-bottom:6px}svg{margin:2px;background-image:linear-gradient(#eee 1px,transparent 1px),linear-gradient(90deg,#eee 1px,transparent 1px);background-size:26.25px 26.25px}</style>${html(names)}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1760," + (30 + 450 * names.length), "--screenshot=" + out, "file://" + cache + "/zm.html"], { stdio: "ignore" });
console.log(out);
