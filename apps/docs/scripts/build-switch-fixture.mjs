import { build } from "esbuild";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
export async function buildSwitchFixture(root, out) {
  await build({ entryPoints:[join(root,"src/lab/switch-audit.tsx")], outfile:join(out,"switch-audit.js"), bundle:true, platform:"browser", format:"esm", jsx:"automatic", define:{"process.env.NODE_ENV":'"development"'} });
  writeFileSync(join(out,"switch-audit.html"), `<!doctype html><html lang="en"><meta charset="utf-8"><title>Switch audit fixture</title><link rel="stylesheet" href="./area.css"><body><h1>Switch audit fixture</h1><button id="run">Run Switch audit</button><p id="summary">Ready</p><div id="behavior"></div><pre id="results"></pre><div id="cases" style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--area-space-24)"></div><script type="module" src="./switch-audit.js"></script></body></html>`);
}
