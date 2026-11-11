// How many values of each scale setting can be told apart, on today's build (the 2026-10-21 method, measure-steps.mjs,
// with today's value ranges). Renders specimens with the built area.css in a guest headless Edge, screenshots once,
// samples pixels and reports CIEDE2000 ladders.   npm run build && node docs/research/customization-2026-11-10/measure.mjs
import { spawn } from "node:child_process";
import { writeFileSync, copyFileSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url)), repo = join(here, "../../..");
const out = mkdtempSync(join(tmpdir(), "area-steps-"));
copyFileSync(join(repo, "packages/styles/dist/area.css"), join(out, "area.css"));
const W = 220, H = 150, COLS = 20;
const by = (a, b, s) => Array.from({ length: Math.round((b - a) / s) + 1 }, (_, i) => String(+(a + i * s).toFixed(1)));
const SWEEPS = [
  { id: "layers-light", theme: "light", values: by(0, 100, 5), kind: "layer" },
  { id: "layers-light", label: "layers-light @ground 96", theme: "light", values: by(0, 100, 5), kind: "layer", extra: { "data-area-ground-light": "96" } },
  { id: "layers-dark", theme: "dark", values: by(0, 100, 5), kind: "layer" },
  { id: "layers-dark", label: "layers-dark @ground 16", theme: "dark", values: by(0, 100, 5), kind: "layer", extra: { "data-area-ground-dark": "16" } },
  { id: "card-tone-light", theme: "light", values: by(-100, 100, 10), kind: "layer" },
  { id: "card-tone-dark", theme: "dark", values: by(-100, 100, 10), kind: "layer" },
  { id: "stroke", values: by(0, 8, 0.5), kind: "edge", token: "--area-border-card" },
  { id: "stroke-hover", values: by(0, 4, 1), kind: "edge", token: "--area-edge-control-hover" },
  { id: "fill-hover", values: by(25, 100, 5), kind: "plate", token: "--area-bg-hover" },
  { id: "fill-selected", values: by(0, 100, 5), kind: "plate", token: "--area-bg-active" },
  { id: "fill-pressed", values: by(25, 100, 5), kind: "plate", token: "--area-bg-pressed" },
  { id: "elevation", values: by(0, 8, 1), kind: "card", token: "--area-shadow-float" },
  { id: "elevation", label: "elevation @ground-dark 24", theme: "dark", values: by(0, 8, 1), kind: "card", token: "--area-shadow-float", extra: { "data-area-ground-dark": "24" } },
  { id: "shadow-resting", values: by(0, 8, 1), kind: "card", token: "--area-shadow-resting", extra: { "data-area-surface": "0" } },
  { id: "shadow-resting", label: "shadow-resting @ground-dark 24", theme: "dark", values: by(0, 8, 1), kind: "card", token: "--area-shadow-resting", extra: { "data-area-surface": "0", "data-area-ground-dark": "24" } },
  { id: "shadow-hover", values: by(0, 8, 1), kind: "card", token: "--area-shadow-lift", extra: { "data-area-surface": "0" } },
  { id: "shadow-field", values: by(0, 8, 1), kind: "card", token: "--area-shadow-field" },
  { id: "shadow-rest", values: by(0, 8, 1), kind: "card", token: "--area-shadow-edge", extra: { "data-area-surface": "0" } },
  { id: "shadow-size", values: by(0, 8, 1), kind: "card", token: "--area-shadow-float" },
  { id: "shadow-softness", values: by(0, 8, 1), kind: "card", token: "--area-shadow-float" },
  { id: "shadow-light", values: by(0, 4, 1), kind: "card", token: "--area-shadow-float" },
  { id: "shadow-color", values: ["black", "warm", "cool"], kind: "card", token: "--area-shadow-float" },
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
writeFileSync(join(out, "specimens.html"), `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="area.css"><style>html,body{margin:0;background:#888} *{transition:none!important}</style><body><div style="position:relative;width:${COLS * W}px;height:${rows * H}px">${specimens.map(cell).join("")}</div></body>`);

const EDGE = "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", port = 9347;
const edge = spawn(EDGE, ["--headless=new", "--guest", "--disable-features=msImplicitSignin", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), "edge-steps-"))}`,
  "--allow-file-access-from-files", "--force-color-profile=srgb", "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 60 && !target; i++) { await sleep(250); try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === "page"); } catch {} }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r));
let seq = 0; const pending = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: COLS * W, height: rows * H, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: "file://" + join(out, "specimens.html") });
await sleep(4000);
const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: COLS * W, height: rows * H, scale: 1 }, captureBeyondViewport: true });
ws.close(); edge.kill();
const { data, info } = await sharp(Buffer.from(shot.result.data, "base64")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const px = (x, y) => { const o = (y * info.width + x) * 3; return [data[o], data[o + 1], data[o + 2]]; };

const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
function lab([r, g, b]) { const R = lin(r), G = lin(g), B = lin(b); const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883; const f = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116; return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))]; }
function de00(c1, c2) { const [L1, a1, b1] = lab(c1), [L2, a2, b2] = lab(c2), rad = Math.PI / 180; const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cb = (C1 + C2) / 2, G = 0.5 * (1 - Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7))); const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2, Cp1 = Math.hypot(ap1, b1), Cp2 = Math.hypot(ap2, b2); const h = (b, a) => { const t = Math.atan2(b, a) / rad; return t < 0 ? t + 360 : t; }; const hp1 = h(b1, ap1), hp2 = h(b2, ap2), dL = L2 - L1, dC = Cp2 - Cp1; let dh = Cp1 * Cp2 === 0 ? 0 : hp2 - hp1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dh * rad / 2), Lb = (L1 + L2) / 2, Cpb = (Cp1 + Cp2) / 2; let hb = hp1 + hp2; if (Cp1 * Cp2 !== 0) hb = Math.abs(hp1 - hp2) > 180 ? (hp1 + hp2 + (hp1 + hp2 < 360 ? 360 : -360)) / 2 : (hp1 + hp2) / 2; const T = 1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad); const SL = 1 + 0.015 * (Lb - 50) ** 2 / Math.sqrt(20 + (Lb - 50) ** 2), SC = 1 + 0.045 * Cpb, SH = 1 + 0.015 * Cpb * T; const RT = -2 * Math.sqrt(Cpb ** 7 / (Cpb ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hb - 275) / 25) ** 2)) * rad); return Math.sqrt((dL / SL) ** 2 + (dC / SC) ** 2 + (dH / SH) ** 2 + RT * (dC / SC) * (dH / SH)); }

const PROFILE = [1, 2, 3, 4, 6, 8, 12, 16, 24];
const samples = specimens.map((sp, i) => {
  const ox = (i % COLS) * W, oy = Math.floor(i / COLS) * H, at = (x, y) => px(ox + x, oy + y);
  const points = sp.kind === "layer" ? [at(80, 45), at(80, 105)] : sp.kind === "plate" ? [at(80, 50)] : sp.kind === "edge" ? [at(21, 50)]
    : [...PROFILE.map(d => at(90, 80 + d - 1)), ...PROFILE.map(d => at(150 + d - 1, 50)), at(90, 21), at(31, 50)];
  return { ...sp, points };
});
const ladders = [];
for (const s of SWEEPS) for (const theme of s.theme ? [s.theme] : ["light", "dark"]) {
  const list = samples.filter(x => x.sweep === (s.label ?? s.id) && x.theme === theme);
  const diff = (a, b) => Math.max(...a.points.map((p, k) => de00(p, b.points[k])));
  const walk = T => { const keep = [list[0]]; for (const x of list.slice(1)) if (diff(x, keep[keep.length - 1]) >= T) keep.push(x); return keep.map(x => x.value); };
  ladders.push({ setting: s.label ?? s.id, theme, offered: list.length, at1: walk(1), at2: walk(2), span: +diff(list[0], list[list.length - 1]).toFixed(2) });
}
writeFileSync(join(here, "ladders.json"), JSON.stringify(ladders, null, 1));
for (const l of ladders) console.log(`${(l.setting + " " + l.theme).padEnd(38)} sampled ${String(l.offered).padEnd(3)} ≥1: ${String(l.at1.length).padEnd(3)} ≥2: ${String(l.at2.length).padEnd(3)} span ${String(l.span).padEnd(6)} ≥2 at: ${l.at2.join(" ")}`);
