// 1x pixel check: outline at 16px rendered at device scale 1, then shown 10x pixelated.
// Usage: node docs/research/icon-review/2026-10-10/quality/tools/px.mjs out.png label=path/to/icon.svg … (outline only;
// whole-pixel strokes show as grey double rows; the 2× sheets of look.mjs hide this).
import { readFileSync, writeFileSync } from "node:fs";
import { edgeShot } from "../../../2026-10-07/edge.mjs";
const [out, ...pairs] = process.argv.slice(2); // label=file.svg
const FILLED_ONLY = /data-filled="(gap|fill|stroke|halo|inset)"/;
const outline = f => readFileSync(f, "utf8").split("\n").filter(l => !FILLED_ONLY.test(l)).join("\n").replace(/stroke-width="1.25"/g, 'stroke-width="1.125"').replace(/<svg /, '<svg style="display:block" ');
const items = pairs.map(p => { const [l, f] = p.split("="); return [l, outline(f)]; });
const q = out.replace(/\.png$/, "");
writeFileSync(q + "-1x.html", `<!doctype html><body style="margin:0;background:#fff">${items.map(([l, s]) => `<div style="position:absolute;left:0;top:${items.findIndex(i=>i[0]===l)*20}px;width:16px;height:16px">${s}</div>`).join("")}</body>`);
await edgeShot(["--user-data-dir=" + q + "-prof1", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=20,${items.length * 20}`], q + "-1x.png", "file://" + q + "-1x.html");
writeFileSync(q + "-big.html", `<!doctype html><body style="margin:8px;font:12px system-ui;background:#fff">${items.map(([l], i) => `<div style="display:flex;align-items:center;gap:12px;margin:4px 0"><span style="width:140px">${l}</span><div style="width:160px;height:160px;background:url(${q}-1x.png) 0 -${i*200}px / 200px auto no-repeat;image-rendering:pixelated;outline:1px solid #ddd"></div></div>`).join("")}</body>`);
await edgeShot(["--user-data-dir=" + q + "-prof2", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", `--window-size=340,${items.length * 168 + 20}`], out, "file://" + q + "-big.html");
console.log(out);
