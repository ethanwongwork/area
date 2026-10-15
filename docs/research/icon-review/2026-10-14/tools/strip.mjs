// A 1x strip: each icon's outline at 16px, device scale 1, stacked 20px apart (x 0, y 20i), for pixelated review crops.
// Run from the repo root: node docs/research/icon-review/2026-10-14/tools/strip.mjs out.png dir name,name…
import { readFileSync, writeFileSync } from "node:fs";
import { edgeShot } from "../../2026-10-07/edge.mjs";
const [out, dir, list] = process.argv.slice(2);
const names = list.split(",");
const FILLED_ONLY = /data-filled="(gap|fill|stroke|halo|inset)"/;
const outline = f => readFileSync(f, "utf8").split("\n").filter(l => !FILLED_ONLY.test(l)).join("\n").replace(/stroke-width="1.25"/g, 'stroke-width="1.125"').replace(/<svg /, '<svg style="display:block" ');
const html = out.replace(/\.png$/, ".html");
writeFileSync(html, `<!doctype html><body style="margin:0;background:#fff">${names.map((n, i) => `<div style="position:absolute;left:0;top:${i * 20}px;width:16px;height:16px">${outline(`${dir}/${n}.svg`)}</div>`).join("")}</body>`);
await edgeShot(["--user-data-dir=" + out + "-prof", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=20,${names.length * 20}`], out, "file://" + html);
console.log(out, names.length);
