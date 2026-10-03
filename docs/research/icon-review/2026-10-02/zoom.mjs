// Outline beside filled at 320px (true 16px line), for inspecting cut-outs and slivers.
// node docs/research/icon-review/2026-10-02/zoom.mjs out.png name…
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, ...names] = process.argv.slice(2); const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/zoom.tsx", "import { createElement as h } from \"react\"; import { renderToStaticMarkup } from \"react-dom/server\"; import { PILOT_ICONS } from \"../src/pilot-icons.tsx\";\nexport const html = (names: string[]) => renderToStaticMarkup(h(\"div\", { style: { display: \"flex\", flexWrap: \"wrap\", gap: 24 } }, ...names.map(n => { const p = PILOT_ICONS.find(x => x.name === n)!; return h(\"div\", { key: n, style: { textAlign: \"center\", font: \"12px system-ui\" } }, h(\"div\", { style: { display: \"flex\", gap: 6 } }, h(p.Icon, { weight: 1.125, width: 320, height: 320 }), h(p.Filled, { weight: 1.125, width: 320, height: 320 })), h(\"div\", null, n)); })));\n");
await build({ entryPoints: [cache + "/zoom.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/zoom.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/zoom.out.mjs?" + Date.now());
writeFileSync(cache + "/zoom.html", `<!doctype html><body style="margin:12px;background:#fff;color:#1a1a1a">${html(names)}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1400," + (380 * Math.ceil(names.length / 2) + 30), "--screenshot=" + out, "file://" + cache + "/zoom.html"], { stdio: "ignore" });
