// Measures how visible each step of Area's scale settings is: renders specimens with the built area.css in headless
// Edge, screenshots once, samples pixels, and reports CIEDE2000 between steps (visible-steps.md).
//
//   npm run build -w @area/tokens && node packages/styles/scripts/build.mjs
//   node docs/research/narrowing-setup-2026-10-21/measure-steps.mjs [path/to/area.css]
//
// Writes specimens.html/png, steps.json, ladders.json and refine.json to a temporary folder and prints it.
import { spawn } from "node:child_process";
import { writeFileSync, copyFileSync, mkdtempSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const repo = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const here = mkdtempSync(join(tmpdir(), "area-steps-"));
copyFileSync(process.argv[2] ?? join(repo, "packages/styles/dist/area.css"), join(here, "area.css"));
console.log(`Output: ${here}`);
const W = 220, H = 150, COLS = 10;

/* ---- specimens ---- */
const range = n => Array.from({ length: n + 1 }, (_, i) => String(i));
// kind: what is painted and sampled. "card" = a surface card with one shadow token; "plate" = a fill over the surface;
// "edge" = a 1px line in a stroke token over the surface; "layer" = page vs raised surface.
const SWEEPS = [
  { id: "layers-light", theme: "light", values: range(8), kind: "layer" },
  { id: "layers-light", label: "layers-light @ground 96", theme: "light", values: range(8), kind: "layer", extra: { "data-area-ground-light": "96" } },
  { id: "layers-dark", theme: "dark", values: range(8), kind: "layer" },
  { id: "stroke", values: range(8), kind: "edge", token: "--area-border-card" },
  { id: "stroke-hover", values: range(4), kind: "edge", token: "--area-edge-control-hover", extra: { "data-area-stroke": "4" } },
  { id: "fill-hover", values: ["1", "2", "3", "4"], kind: "plate", token: "--area-bg-hover" },
  { id: "fill-selected", values: range(4), kind: "plate", token: "--area-bg-active" },
  { id: "fill-pressed", values: ["1", "2", "3", "4"], kind: "plate", token: "--area-bg-pressed" },
  { id: "elevation", values: range(8), kind: "card", token: "--area-shadow-float" },
  { id: "shadow-resting", values: range(8), kind: "card", token: "--area-shadow-resting", extra: { "data-area-surface": "0" } },
  { id: "shadow-hover", values: range(8), kind: "card", token: "--area-shadow-lift", extra: { "data-area-surface": "0" } },
  { id: "shadow-field", values: range(8), kind: "card", token: "--area-shadow-field" },
  { id: "shadow-rest", values: range(8), kind: "card", token: "--area-shadow-edge", extra: { "data-area-surface": "0" } },
  { id: "shadow-size", values: range(8), kind: "card", token: "--area-shadow-float", extra: { "data-area-elevation": "8" } },
  { id: "shadow-softness", values: range(8), kind: "card", token: "--area-shadow-float", extra: { "data-area-elevation": "8" } },
  { id: "shadow-light", values: range(4), kind: "card", token: "--area-shadow-float", extra: { "data-area-elevation": "8" } },
];
const specimens = [];
for (const s of SWEEPS) for (const theme of s.theme ? [s.theme] : ["light", "dark"]) for (const v of s.values)
  specimens.push({ sweep: s.label ?? s.id, theme, value: v, kind: s.kind, token: s.token, attrs: { "data-area-theme": theme, ...(s.extra ?? {}), [`data-area-${s.id}`]: v } });

const cell = (sp, i) => {
  const attrs = Object.entries(sp.attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
  const x = (i % COLS) * W, y = Math.floor(i / COLS) * H;
  let inner = "";
  if (sp.kind === "layer") inner = `<div style="position:absolute;left:20px;top:20px;width:120px;height:50px;background:var(--area-bg-surface)"></div><div style="position:absolute;left:20px;top:80px;width:120px;height:50px;background:var(--area-bg-subtle)"></div>`;
  if (sp.kind === "plate") inner = `<div style="position:absolute;inset:0;background:var(--area-bg-surface)"><div style="position:absolute;left:20px;top:20px;width:120px;height:60px;background:var(${sp.token})"></div></div>`;
  if (sp.kind === "edge") inner = `<div style="position:absolute;inset:0;background:var(--area-bg-surface)"><div style="position:absolute;left:20px;top:20px;width:120px;height:60px;box-shadow:inset 0 0 0 4px var(${sp.token})"></div></div>`;
  if (sp.kind === "card") inner = `<div style="position:absolute;left:30px;top:20px;width:120px;height:60px;background:var(--area-bg-surface);border-radius:8px;box-shadow:var(${sp.token})"></div>`;
  return `<div ${attrs} style="position:absolute;left:${x}px;top:${y}px;width:${W}px;height:${H}px;overflow:hidden;background:var(--area-bg-page)">${inner}</div>`;
};
const rows = Math.ceil(specimens.length / COLS);
const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="area.css">
<style>html,body{margin:0;background:#888} *{transition:none!important}</style>
<body><div style="position:relative;width:${COLS * W}px;height:${rows * H}px">${specimens.map(cell).join("")}</div></body>`;
writeFileSync(join(here, "specimens.html"), html);

/* ---- headless Edge over CDP ---- */
const EDGE = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge";
const port = 9333;
const profile = mkdtempSync(join(tmpdir(), "edge-steps-"));
const edge = spawn(EDGE, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--allow-file-access-from-files",
  "--force-color-profile=srgb", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50 && !target; i++) { await sleep(200); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r));
let seq = 0; const pending = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: COLS * W, height: rows * H, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "file://" + join(here, "specimens.html") });
await sleep(1500);
const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: COLS * W, height: rows * H, scale: 1 }, captureBeyondViewport: true });
ws.close(); edge.kill();
const png = Buffer.from(shot.result.data, "base64");
writeFileSync(join(here, "specimens.png"), png);

/* ---- PNG decode (8-bit RGB/RGBA, non-interlaced) ---- */
function decode(buf) {
  let p = 8, width, height, ctype; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString("ascii", p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") { width = data.readUInt32BE(0); height = data.readUInt32BE(4); ctype = data[9]; }
    if (type === "IDAT") idat.push(data);
    p += 12 + len;
  }
  const raw = inflateSync(Buffer.concat(idat)), bpp = ctype === 6 ? 4 : 3, stride = width * bpp, out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? out[y * stride + x - bpp] : 0, b = y ? out[(y - 1) * stride + x] : 0, c = x >= bpp && y ? out[(y - 1) * stride + x - bpp] : 0;
      let v = row[x];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      out[y * stride + x] = v & 255;
    }
  }
  return { width, px: (x, y) => { const o = y * stride + x * bpp; return [out[o], out[o + 1], out[o + 2]]; } };
}
const img = decode(png);

/* ---- CIEDE2000 ---- */
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
function lab([r, g, b]) {
  const R = lin(r), G = lin(g), B = lin(b);
  const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const f = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
  return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))];
}
function de00(c1, c2) {
  const [L1, a1, b1] = lab(c1), [L2, a2, b2] = lab(c2), rad = Math.PI / 180;
  const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2, G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)));
  const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2, Cp1 = Math.hypot(ap1, b1), Cp2 = Math.hypot(ap2, b2);
  const h = (b, a) => { const t = Math.atan2(b, a) / rad; return t < 0 ? t + 360 : t; };
  const hp1 = h(b1, ap1), hp2 = h(b2, ap2), dL = L2 - L1, dC = Cp2 - Cp1;
  let dh = Cp1 * Cp2 === 0 ? 0 : hp2 - hp1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
  const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dh * rad / 2), Lb = (L1 + L2) / 2, Cpb = (Cp1 + Cp2) / 2;
  let hb = hp1 + hp2; if (Cp1 * Cp2 !== 0) hb = Math.abs(hp1 - hp2) > 180 ? (hp1 + hp2 + (hp1 + hp2 < 360 ? 360 : -360)) / 2 : (hp1 + hp2) / 2;
  const T = 1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad);
  const SL = 1 + 0.015 * (Lb - 50) ** 2 / Math.sqrt(20 + (Lb - 50) ** 2), SC = 1 + 0.045 * Cpb, SH = 1 + 0.015 * Cpb * T;
  const RT = -2 * Math.sqrt(Cpb ** 7 / (Cpb ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hb - 275) / 25) ** 2)) * rad);
  return Math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH));
}

/* ---- sample ---- */
// Card: the profile under the card's bottom edge (1..24px) and beside its right edge, plus the far page.
const PROFILE = [1, 2, 3, 4, 6, 8, 12, 16, 24];
function sample(sp, i) {
  const ox = (i % COLS) * W, oy = Math.floor(i / COLS) * H, at = (x, y) => img.px(ox + x, oy + y);
  const page = at(W - 4, H - 4);
  if (sp.kind === "layer") return { page, main: at(80, 45), points: [at(80, 45), at(80, 105)], outside: [at(80, 45), at(80, 105)] };
  if (sp.kind === "plate") return { page: at(W - 4, H - 4), main: at(80, 50), points: [at(80, 50)], outside: [at(80, 50)] };
  if (sp.kind === "edge") return { page: at(80, 50), main: at(21, 50), points: [at(21, 50)], outside: [at(21, 50)] };
  const pts = [...PROFILE.map(d => at(90, 80 + d - 1)), ...PROFILE.map(d => at(150 + d - 1, 50)), at(90, 21), at(31, 50)];
  return { page, main: pts[0], points: pts, outside: pts.slice(0, PROFILE.length * 2) };
}
const samples = specimens.map((sp, i) => ({ ...sp, ...sample(sp, i) }));

const report = [];
for (const s of SWEEPS) for (const theme of s.theme ? [s.theme] : ["light", "dark"]) {
  const list = samples.filter(x => x.sweep === (s.label ?? s.id) && x.theme === theme);
  const vsGround = list.map(x => Math.max(...x.outside.map(p => de00(p, x.page))));
  const steps = list.slice(1).map((x, n) => Math.max(...x.points.map((p, k) => de00(p, list[n].points[k]))));
  report.push({ setting: s.label ?? s.id, theme, values: list.map(x => x.value), vsGround: vsGround.map(v => +v.toFixed(2)), steps: steps.map(v => +v.toFixed(2)) });
}
writeFileSync(join(here, "steps.json"), JSON.stringify(report, null, 1));
for (const r of report) console.log(`${(r.setting + " " + r.theme).padEnd(24)} vs ground ${r.vsGround.join(" ")}\n${"".padEnd(24)} step→step  ${r.steps.join(" ")}`);

/* ---- distinct ladders: walk up the scale, keeping a step once it differs from the last kept by at least T ---- */
const ladders = [];
for (const s of SWEEPS) for (const theme of s.theme ? [s.theme] : ["light", "dark"]) {
  const list = samples.filter(x => x.sweep === (s.label ?? s.id) && x.theme === theme);
  const diff = (a, b) => Math.max(...a.points.map((p, k) => de00(p, b.points[k])));
  const walk = T => { const keep = [list[0]]; for (const x of list.slice(1)) if (diff(x, keep[keep.length - 1]) >= T) keep.push(x); return keep.map(x => x.value); };
  const dupes = list.slice(1).filter((x, n) => diff(x, list[n]) < 0.05).map((x, n) => x.value);
  ladders.push({ setting: s.label ?? s.id, theme, at1: walk(1), at2: walk(2), identical: dupes, span: +diff(list[0], list[list.length - 1]).toFixed(2) });
}
writeFileSync(join(here, "ladders.json"), JSON.stringify(ladders, null, 1));
console.log("\nDistinct ladders (ΔE00 ≥ 1 / ≥ 2 from the last kept step), whole-range span, steps identical to the one before:");
for (const l of ladders) console.log(`${(l.setting + " " + l.theme).padEnd(30)} ≥1: ${l.at1.join(" ").padEnd(20)} ≥2: ${l.at2.join(" ").padEnd(14)} span ${String(l.span).padEnd(6)} same: ${l.identical.join(" ")}`);

/* ---- Refine members per direction (plan.md §2): within a direction, keep a member once it differs from the last
   kept by ≥ 1 ΔE00; the representative is always kept. ---- */
const R = (...g) => g.map(x => x.map(String));
const DIRS = {
  "layers-light @ground 96": R([0, 1, 2], [3, 4, 5], [6, 7, 8]), "layers-light": R([0, 1, 2], [3, 4, 5], [6, 7, 8]), "layers-dark": R([0, 1, 2], [3, 4, 5], [6, 7, 8]),
  stroke: R([0, 1, 2], [3, 4, 5], [6, 7, 8]), "stroke-hover": R([0], [1, 2], [3, 4]), "fill-selected": R([0], [1, 2], [3, 4]),
  elevation: R([0], [1, 2, 3, 4], [5, 6, 7, 8]), "shadow-resting": R([0], [1, 2, 3, 4], [5, 6, 7, 8]), "shadow-hover": R([0], [1, 2, 3, 4], [5, 6, 7, 8]),
  "shadow-field": R([0], [1, 2, 3, 4], [5, 6, 7, 8]), "shadow-rest": R([0], [1, 2, 3, 4], [5, 6, 7, 8]),
  "shadow-size": R([0, 1, 2], [3, 4, 5], [6, 7, 8]), "shadow-softness": R([0, 1, 2], [3, 4, 5], [6, 7, 8]), "shadow-light": R([0], [1, 2], [3, 4]),
};
const REP = { "layers-light": ["0", "4", "7"], "layers-light @ground 96": ["0", "4", "7"], "layers-dark": ["0", "4", "7"], stroke: ["1", "4", "7"], "stroke-hover": ["0", "2", "4"],
  "fill-selected": ["0", "1", "4"], elevation: ["0", "3", "6"], "shadow-resting": ["0", "3", "6"], "shadow-hover": ["0", "3", "6"], "shadow-field": ["0", "3", "6"],
  "shadow-rest": ["0", "2", "6"], "shadow-size": ["1", "4", "7"], "shadow-softness": ["2", "4", "8"], "shadow-light": ["0", "2", "4"] };
console.log("\nRefine members (≥ 1 ΔE00 apart within each direction, the representative kept), and how far apart the directions' reps are:");
const refine = [];
for (const [id, dirs] of Object.entries(DIRS)) for (const theme of ["light", "dark"]) {
  const list = samples.filter(x => x.sweep === id && x.theme === theme); if (!list.length) continue;
  const by = v => list.find(x => x.value === v), diff = (a, b) => Math.max(...by(a).points.map((p, k) => de00(p, by(b).points[k])));
  const rows = dirs.map((members, d) => {
    const rep = REP[id][d], keep = [rep];
    for (const m of members) if (m !== rep && keep.every(k => diff(m, k) >= 1)) keep.push(m);
    return keep.sort((a, b) => +a - +b);
  });
  const reps = REP[id], gaps = [diff(reps[0], reps[1]), diff(reps[1], reps[2])].map(v => +v.toFixed(2));
  refine.push({ setting: id, theme, refine: rows, repGaps: gaps });
  console.log(`${(id + " " + theme).padEnd(30)} ${rows.map(r => "[" + r.join(" ") + "]").join(" ").padEnd(34)} reps ${reps.join("/")} apart ${gaps.join(", ")}`);
}
writeFileSync(join(here, "refine.json"), JSON.stringify(refine, null, 1));
