// Exploration candidates of one group as a sheet: outline and filled (a line glyph: the line at 4/3) at
// 16 / 24 / 32 / 48 and 96px, the line on the size curve (held at 24).
//   node docs/research/icon-review/2026-10-06/candidates-sheet.mjs out.png fingerprint
import { readdirSync, readFileSync, writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const [out, group] = process.argv.slice(2), dir = "apps/docs/assets/area-icons-pilot/explore";
const files = readdirSync(dir).filter(f => f.endsWith(".svg") && readFileSync(`${dir}/${f}`, "utf8").includes(`data-group="${group}"`)).sort((a, b) => {
  const n = f => +(readFileSync(`${dir}/${f}`, "utf8").match(/data-label="(\d+)/)?.[1] ?? 99); return n(a) - n(b); });
const line = size => 1.125 * Math.pow(Math.min(size, 24) / 16, -0.55);
const draw = (src, size, bold) => src.replace(/<svg[^>]*>/, `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none">`).replace(/stroke-width="1.25"/g, `stroke-width="${(line(size) * (bold ? 4 / 3 : 1)).toFixed(4)}"`);
const rows = files.map(f => { const src = readFileSync(`${dir}/${f}`, "utf8"), label = src.match(/data-label="([^"]+)"/)[1];
  const set = bold => [16, 24, 32, 48, 96].map(s => draw(src, s, bold)).join("");
  return `<div class=r><div class=l>${label}</div><div class=s>${set(false)}</div><div class=s>${set(true)}</div></div>`; }).join("");
writeFileSync("apps/docs/.cache/cand.html", `<!doctype html><style>body{font:13px system-ui;margin:12px;color:#111}.r{display:flex;align-items:center;gap:18px;border-bottom:1px solid #eee;padding:6px 0}.l{width:250px}.s{display:flex;align-items:center;gap:12px;padding-left:12px;border-left:1px solid #ddd}svg{display:block}</style><div class=r><div class=l></div><div class=s style="color:#888">Outline · 16 / 24 / 32 / 48 / 96</div><div class=s style="color:#888">Filled</div></div>${rows}`);
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=1100,${50 + 110 * files.length}`, "--screenshot=" + out, "file://" + process.cwd() + "/apps/docs/.cache/cand.html"], { stdio: "ignore" });
console.log(out);
