#!/usr/bin/env node
// Reference sheets for the icon audit: each concept as Area draws it beside Fluent, Lucide,
// Phosphor, Hugeicons and SF Symbols (owner, 2026-10-01). References are for looking, never
// tracing: the rules in the area-icon-construction skill still apply. Cursor (proprietary) stays
// rules-only. SF Symbols render locally from the installed app (sf-render.swift) into the ignored
// cache, for viewing only (Apple's licence): never commit them or a sheet that shows them.
//   node apps/docs/scripts/icon-refs.mjs fetch                 # Lucide, Phosphor, Hugeicons into .cache/refs
//   node apps/docs/scripts/icon-refs.mjs sheet out.png [group…] # concepts from docs/research/icon-references.json
// A group is a key of icon-references.json (bots, everyday) or a batch id (batch-12), whose icons
// take their counterparts from docs/research/icon-audit/area-map.json; with none, every
// icon-references group renders. SF Symbols appear only with --sf (local review sheets).
// Columns: Area outline and filled, Fluent regular and filled, Lucide, Phosphor regular and
// fill, Hugeicons (the free set is stroke only). Each at 16px and 40px; a missing cut is blank.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = join(HERE, "../../..");
const REFS = join(HERE, "../.cache/refs"), CACHE = join(HERE, "../.cache");
const PACKAGES = { lucide: "lucide-static", phosphor: "@phosphor-icons/core", huge: "@hugeicons/core-free-icons" };
const dir = pkg => join(REFS, pkg.replace("@", "").replace("/", "-"), "package");
const [mode, out, ...groups] = process.argv.slice(2);

if (mode === "fetch") {
  mkdirSync(REFS, { recursive: true });
  for (const pkg of Object.values(PACKAGES)) {
    if (existsSync(dir(pkg))) { console.log(`have ${pkg}`); continue; }
    const tgz = execFileSync("npm", ["pack", pkg, "--silent"], { cwd: REFS }).toString().trim().split("\n").pop();
    mkdirSync(dirname(dir(pkg)), { recursive: true });
    execFileSync("tar", ["xzf", tgz, "-C", dirname(dir(pkg))], { cwd: REFS });
    execFileSync("rm", [tgz], { cwd: REFS });
    console.log(`fetched ${pkg}`);
  }
  process.exit(0);
}
if (mode !== "sheet" || !out) { console.log("usage: icon-refs.mjs fetch | sheet out.png [group…]"); process.exit(1); }
for (const pkg of Object.values(PACKAGES)) if (!existsSync(dir(pkg))) { console.error(`missing ${pkg}: run icon-refs.mjs fetch`); process.exit(1); }

const SF = groups.includes("--sf"); groups.splice(0, groups.length, ...groups.filter(g => g !== "--sf"));
const table = JSON.parse(readFileSync(join(ROOT, "docs/research/icon-references.json"), "utf8"));
const MAP = join(ROOT, "docs/research/icon-audit/area-map.json"), map = existsSync(MAP) ? JSON.parse(readFileSync(MAP, "utf8")) : {};
const batches = JSON.parse(readFileSync(join(HERE, "../assets/area-icons-pilot/batches.json"), "utf8")).batches;
for (const g of groups) {
  const b = batches.find(x => x.id === g.replace(/^batch-?/, "batch-"));
  if (!b) continue;
  const n = b.id.replace("batch-", "");
  table[g] = { $title: `#${n} · ${b.title.replace(/^Batch \d+ · /, "")}`, ...Object.fromEntries(Object.entries(b.icons).map(([name, status]) =>
    [`#${n} ${name}${status === "approved" ? "" : " ·"}`, { ...map[name], area: name }])) };
}
const keys = groups.length ? groups : Object.keys(table).filter(k => !k.startsWith("$"));
// SF Symbols: rendered on demand from the installed app into the cache.
const SFDIR = join(REFS, "sf");
if (SF) {
  mkdirSync(SFDIR, { recursive: true });
  const want = [...new Set(keys.flatMap(k => Object.values(table[k]).map(r => r?.sf).filter(Boolean)))].filter(n => !existsSync(join(SFDIR, n + ".png")));
  if (want.length) execFileSync("swift", [join(HERE, "sf-render.swift"), SFDIR, "40", ...want], { stdio: "ignore" });
}
const sfImg = (name, size) => name && existsSync(join(SFDIR, name + ".png")) ? `<img src="file://${join(SFDIR, name + ".png")}" style="width:${size * 1.6}px;height:${size * 1.6}px;margin:${-size * 0.3}px">` : "";
const read = p => existsSync(p) ? readFileSync(p, "utf8").replace(/<!--[\s\S]*?-->/g, "") : "";
const FLUENT = join(dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json")), "icons");
const fluent = (stem, cut) => {
  for (const size of [16, 20, 24]) { const s = read(join(FLUENT, `${stem}_${size}_${cut}.svg`)); if (s) return s.replace("<svg ", `<svg fill="currentColor" `); }
  return "";
};
const huge = async name => {
  const p = join(dir(PACKAGES.huge), "dist/esm", `${name}Icon.js`);
  if (!existsSync(p)) return "";
  const nodes = (await import(p)).default;
  const kebab = k => k.replace(/[A-Z]/g, c => "-" + c.toLowerCase());
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${nodes.map(([tag, a]) =>
    `<${tag} ${Object.entries(a).filter(([k]) => k !== "key").map(([k, v]) => `${kebab(k)}="${v}"`).join(" ")}/>`).join("")}</svg>`;
};

// Area's outline and filled come from the generated components (npm run icons:pilot first).
const { build } = await import("esbuild");
writeFileSync(join(CACHE, "refs-entry.tsx"), `import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS } from "../src/pilot-icons.tsx";
let n = 0;  // separate renders reuse useId, so each gets its own mask id or every knockout shows the first mask
export const area = (name, filled, size) => { const i = PILOT_ICONS.find(p => p.name === name); n++; return i ? renderToStaticMarkup(h(filled ? i.Filled : i.Icon, { size })).replace(/area-icon-[A-Za-z0-9-]+/g, m => m + "-" + n) : ""; };`);
await build({ entryPoints: [join(CACHE, "refs-entry.tsx")], bundle: true, format: "esm", platform: "node", outfile: join(CACHE, "refs-entry.mjs"), external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { area } = await import(join(CACHE, "refs-entry.mjs") + `?${Date.now()}`);

const COLS = [["Area", 2], ["Fluent", 2], ["Lucide", 1], ["Phosphor", 2], ["Hugeicons", 1], ...(SF ? [["SF Symbols", 2]] : [])];
const cell = (svg16, svg40) => `<span class="c"><span class="s">${svg16}</span><span class="b">${svg40}</span></span>`;
let html = "", rows = 0;
for (const key of keys) {
  html += `<div class="g">${table[key].$title ?? key}</div><div class="r h"><span class="l"></span>${COLS.map(([n, k]) => `<span style="width:${k * 92}px">${n}</span>`).join("")}</div>`;
  for (const [concept, ref] of Object.entries(table[key]).filter(([k]) => !k.startsWith("$"))) {
    const ph = cut => read(join(dir(PACKAGES.phosphor), "assets", cut, `${ref.phosphor}${cut === "regular" ? "" : "-" + cut}.svg`));
    const lu = read(join(dir(PACKAGES.lucide), "icons", `${ref.lucide}.svg`));
    const hu = ref.huge ? await huge(ref.huge) : "";
    const pair = s => cell(s, s);
    html += `<div class="r"><span class="l">${concept}<em>${ref.area ?? "—"}</em></span>` +
      cell(ref.area ? area(ref.area, false, 16) : "", ref.area ? area(ref.area, false, 40) : "") +
      cell(ref.area ? area(ref.area, true, 16) : "", ref.area ? area(ref.area, true, 40) : "") +
      pair(ref.fluent ? fluent(ref.fluent, "regular") : "") + pair(ref.fluent ? fluent(ref.fluent, "filled") : "") +
      pair(ref.lucide ? lu : "") + pair(ref.phosphor ? ph("regular") : "") + pair(ref.phosphor ? ph("fill") : "") + pair(hu) +
      (SF ? cell(sfImg(ref.sf, 16), sfImg(ref.sf, 40)) + cell(sfImg(ref.sf && ref.sf + ".fill", 16), sfImg(ref.sf && ref.sf + ".fill", 40)) : "") + `</div>`;
    rows++;
  }
}
const css = `body{font:13px system-ui;margin:16px;color:#1a1a1a;--area-weight-icon:1.125px}
.g{font-size:20px;font-weight:600;padding:16px 0 6px;border-bottom:2px solid #1a1a1a}
.r{display:flex;align-items:center;border-bottom:1px solid #eee;padding:6px 0}.h{color:#888;font-weight:600}
.l{width:150px;display:flex;flex-direction:column}.l em{font-style:normal;color:#999;font-size:11px}
.c{width:92px;display:flex;align-items:center;gap:10px}.s svg{width:16px;height:16px;display:block}.b svg{width:40px;height:40px;display:block}`;
const page = join(CACHE, "refs-sheet.html");
writeFileSync(page, `<!doctype html><meta charset=utf-8><style>${css}</style>${html}`);
const browsers = ["/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium"];
const browser = browsers.find(b => !b.startsWith("/") || existsSync(b));
execFileSync(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${SF ? 1230 : 1040},${60 + 62 * rows + 80 * keys.length}`, `--screenshot=${resolve(out)}`, `file://${page}`], { stdio: "ignore", timeout: 60000 });
console.log(resolve(out));
