// Strips: a group of icons in one line per set, the way a key or a nav shows them, so the eye
// reads cohesion (size, weight, density) across neighbours rather than one icon at a time.
// Rows: Area (and, with --before, the build in BEFORE_DIR) at 16 / 20 / 24, then Lucide and
// Phosphor counterparts from docs/research/icon-audit/area-map.json (or name=lucide:phosphor
// overrides). Area icons come from a folder of built 16px SVGs (default packages/icons/dist/svg/16)
// or straight from a folder of sources (AREA_DIR), stroke-width 1.25 → 1.125 as the build does and
// the filled-only parts (gap, fill, stroke, halo, inset) left out, as the outline build leaves them.
// Libraries are for looking only; never trace them.
//   node docs/research/icon-cohesion-2026-10-31/tools/strip.mjs out.png "Title" name,name[=lucide:phosphor],… [--refs] [--labels]
import { existsSync, readFileSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { edgeShot } from "../../icon-review/2026-10-07/edge.mjs";

const ROOT = process.cwd(), REFS = join(ROOT, "packages/icons/.cache/refs");
const args = process.argv.slice(2), flags = new Set(args.filter(a => a.startsWith("--")));
const [out, title, list] = args.filter(a => !a.startsWith("--"));
const AREA = process.env.AREA_DIR || join(ROOT, "packages/icons/dist/svg/16"), BEFORE = process.env.BEFORE_DIR;
const amap = JSON.parse(readFileSync(join(ROOT, "docs/research/icon-audit/area-map.json"), "utf8"));
const items = list.split(",").map(s => { const [name, o] = s.split("="); const [l, p] = (o || "").split(":"); return { name, lucide: l || amap[name]?.lucide, phosphor: p || amap[name]?.phosphor }; });
const uri = f => existsSync(f) ? "data:image/svg+xml;base64," + Buffer.from(readFileSync(f, "utf8").replace(/stroke-width="1\.25"/g, 'stroke-width="1.125"')
  .replace(/<(path|circle|rect)\b[^>]*data-filled="(gap|fill|stroke|halo|inset)"[^>]*\/>/g, "")).toString("base64") : null;
const sets = [
  ...(BEFORE ? [["Before", n => uri(join(BEFORE, n + ".svg"))]] : []),
  [BEFORE ? "After" : "Area", n => uri(join(AREA, n + ".svg"))],
  ...(flags.has("--refs") ? [["Lucide", (n, i) => i.lucide && uri(join(REFS, "lucide-static/package/icons", i.lucide + ".svg"))],
    ["Phosphor", (n, i) => i.phosphor && uri(join(REFS, "phosphor-icons-core/package/assets/regular", i.phosphor + ".svg"))]] : []),
];
const cell = (src, s) => src ? `<img src="${src}" width="${s}" height="${s}">` : `<span style="width:${s}px;height:${s}px;display:inline-block;background:#f4f4f4"></span>`;
const html = `<!doctype html><style>body{font:12px system-ui;margin:16px;color:#111;background:#fff}h1{font-size:15px;margin:0 0 10px}
.set{margin:0 0 14px}.set b{display:block;color:#666;font-weight:600;margin:0 0 4px}.line{display:flex;align-items:center;margin:0 0 6px}
.line span.sz{width:28px;color:#999}.line .i{display:flex;flex-direction:column;align-items:center;width:var(--w)}img{display:block}
.lab{font-size:10px;color:#888;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(var(--w) - 4px)}</style>
<h1>${title}</h1>${sets.map(([label, f]) => `<div class="set"><b>${label}</b>${[16, 20, 24].map(s => `<div class="line" style="--w:${Math.max(s + 18, flags.has("--labels") ? 64 : 0)}px"><span class="sz">${s}</span>${items.map(i => `<span class="i">${cell(f(i.name, i), s)}${flags.has("--labels") && s === 24 ? `<span class="lab">${i.name}</span>` : ""}</span>`).join("")}</div>`).join("")}</div>`).join("")}`;
const tmp = mkdtempSync(join(ROOT, "packages/icons/.cache/strip-"));
try {
  writeFileSync(join(tmp, "s.html"), html);
  const w = 60 + items.length * Math.max(42, flags.has("--labels") ? 64 : 0), h = 60 + sets.length * 150;
  await edgeShot(["--user-data-dir=" + tmp + "/prof", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${w},${h}`], out, "file://" + tmp + "/s.html");
  console.log(out);
} finally { rmSync(tmp, { recursive: true, force: true }); }
