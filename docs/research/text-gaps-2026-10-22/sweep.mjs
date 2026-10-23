// Text and gaps, every family (owner, 2026-10-22: "consistent and intentional logic behind the visible gaps between
// labels and content, both vertically and horizontally ... any labels or any placement of text (title + copy) ...
// do another text style, weight + fg color pass on all the components").
// For every text part in every gallery tile (an element with its own text): its size, leading, weight, tracking and
// ink, and its visible gap to what follows it, below or beside, measured on the glyphs, not the boxes:
//   below   the next part's visible top (a text's cap top, otherwise its border box) minus this text's last baseline;
//   beside  the next part's visible left (text's ink start, otherwise its border box) minus this text's ink end;
//   icon    this text's ink start minus a glyph just before it.
//
//   node sweep.mjs <out.json> [theme] [base] [port]       e.g. node sweep.mjs text.json light http://127.0.0.1:4401/
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const [out, theme = "light", BASE = "http://127.0.0.1:4401/", portArg = "9891"] = process.argv.slice(2);
const port = +portArg;
const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(join(here, "../../..", "apps/desktop/src/content/component-status.mjs"));
const slugs = process.env.SLUGS ? process.env.SLUGS.split(",") : [...COMPLETE_COMPONENTS, ...REVIEW_COMPONENTS].sort();

const MEASURE = `(() => {
  const body = document.querySelector(".studio-canvas__body"), root = getComputedStyle(body);
  const tok = n => root.getPropertyValue("--area-" + n).trim();
  const probe = n => { const p = document.createElement("span"); p.style.color = "var(--area-" + n + ")"; body.append(p); const c = getComputedStyle(p).color; p.remove(); return c; };
  const cv = document.createElement("canvas"); cv.width = cv.height = 1; const cx = cv.getContext("2d", { willReadFrequently: true });
  const hex = s => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#fff"; cx.fillRect(0, 0, 1, 1); cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return "#" + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, "0")).join(""); };
  const mc = document.createElement("canvas").getContext("2d");
  const metrics = cs => { mc.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily; const m = mc.measureText("H"); const f = mc.measureText("Hg"); return { cap: m.actualBoundingBoxAscent, asc: f.fontBoundingBoxAscent, desc: f.fontBoundingBoxDescent }; };
  const ownText = el => [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
  const visible = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && +cs.opacity > 0.05; };
  const name = el => { const c = [...el.classList].filter(x => x.startsWith("area-")); return (c[0] || el.localName) + (c.length > 1 ? "." + c.slice(1, 3).join(".") : ""); };
  // Where a text's glyphs are: first and last line rects of its own text nodes.
  const ink = el => { const rects = []; for (const n of ownText(el)) { const r = document.createRange(); r.selectNodeContents(n); rects.push(...[...r.getClientRects()].filter(x => x.width > 0)); } if (!rects.length) return null;
    const cs = getComputedStyle(el), m = metrics(cs); const first = rects[0], last = rects[rects.length - 1];
    const lines = new Set(rects.map(r => Math.round(r.top))).size;
    return { left: Math.min(...rects.map(r => r.left)), right: Math.max(...rects.map(r => r.right)), capTop: first.top + (first.height - m.asc - m.desc) / 2 + m.asc - m.cap, baseline: last.top + (last.height - m.asc - m.desc) / 2 + m.asc, top: first.top, bottom: last.bottom, lines }; };
  // The visible start of an element: its first text's ink, or its border box when it paints an edge or fill.
  const paints = el => { const cs = getComputedStyle(el); return parseFloat(cs.borderTopWidth) > 0 || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") || cs.boxShadow !== "none" || ["svg", "img", "input", "textarea", "select", "video", "canvas", "hr"].includes(el.localName); };
  const visTop = el => { if (paints(el)) return { y: el.getBoundingClientRect().top, kind: el.localName === "svg" ? "glyph" : "box", part: name(el) };
    for (const d of [el, ...el.querySelectorAll("*")]) { if (!visible(d)) continue; if (ownText(d).length) { const i = ink(d); if (i) return { y: i.capTop, kind: "text", part: name(d) }; } if (paints(d)) return { y: d.getBoundingClientRect().top, kind: d.localName === "svg" ? "glyph" : "box", part: name(d) }; } return null; };
  const visLeft = el => { if (paints(el)) return { x: el.getBoundingClientRect().left, kind: el.localName === "svg" ? "glyph" : "box", part: name(el) };
    for (const d of [el, ...el.querySelectorAll("*")]) { if (!visible(d)) continue; if (ownText(d).length) { const i = ink(d); if (i) return { x: i.left, kind: "text", part: name(d) }; } if (paints(d)) return { x: d.getBoundingClientRect().left, kind: d.localName === "svg" ? "glyph" : "box", part: name(d) }; } return null; };
  const following = el => { const tile = el.closest(".gallery-tile__view"); for (let e = el; e && e !== tile; e = e.parentElement) { for (let n = e.nextElementSibling; n; n = n.nextElementSibling) if (visible(n)) return n; } return null; };
  const preceding = el => { for (let n = el.previousElementSibling; n; n = n.previousElementSibling) if (visible(n)) return n; return null; };
  const rows = [];
  for (const tileEl of body.querySelectorAll(".gallery-tile")) {
    const tile = (tileEl.closest(".area-asset-card")?.querySelector(".area-asset-card__name")?.textContent || tileEl.querySelector(".gallery-tile__label,.gallery-tile__title")?.textContent || "?").trim().slice(0, 40);
    for (const el of tileEl.querySelectorAll(".gallery-tile__view *")) {
      if (!visible(el) || !ownText(el).length || el.closest("svg, code, pre, kbd, .area-kbd, input, textarea, select, option, [aria-hidden=true]")) continue;
      const i = ink(el); if (!i) continue;
      const cs = getComputedStyle(el);
      const row = { tile, part: name(el), text: el.textContent.trim().replace(/\\s+/g, " ").slice(0, 28), size: parseFloat(cs.fontSize), leading: cs.lineHeight === "normal" ? null : parseFloat(cs.lineHeight), weight: +cs.fontWeight, tracking: cs.letterSpacing, ink: hex(cs.color), alpha: cs.color.includes("/") || cs.color.startsWith("rgba") ? cs.color : "", family: cs.fontFamily.split(",")[0].replace(/"/g, ""), transform: cs.textTransform === "none" ? "" : cs.textTransform, lines: i.lines };
      const next = following(el);
      if (next) { const nr = next.getBoundingClientRect();
        const pc = getComputedStyle(next.parentElement), ctx = { display: pc.display, justify: pc.justifyContent, gap: pc.columnGap + " " + pc.rowGap, nextMargin: getComputedStyle(next).marginInlineStart, parent: name(next.parentElement), cols: pc.gridTemplateColumns === "none" ? "" : pc.gridTemplateColumns.slice(0, 40) };
        if (nr.top >= i.bottom - 2) { const v = visTop(next); if (v) row.below = { gap: +(v.y - i.baseline).toFixed(1), to: v.part, kind: v.kind, box: +(nr.top - el.getBoundingClientRect().bottom).toFixed(1), ctx }; }
        else if (nr.left >= i.right - 1) { const h = visLeft(next); if (h) row.beside = { gap: +(h.x - i.right).toFixed(1), to: h.part, kind: h.kind, ctx }; } }
      const prev = preceding(el); if (prev && (prev.localName === "svg" || prev.querySelector?.(":scope > svg") && prev.getBoundingClientRect().width <= 32)) { const pr = prev.getBoundingClientRect(); if (pr.right <= i.left + 1) row.icon = { gap: +(i.left - pr.right).toFixed(1), from: name(prev), size: Math.round(pr.width) }; }
      rows.push(row);
    }
  }
  return { tok: { md: [tok("text-md-size"), tok("text-md-leading")], sm: [tok("text-sm-size"), tok("text-sm-leading")], xs: [tok("text-xs-size"), tok("text-xs-leading")], fgDefault: hex(probe("fg-default")), fgMuted: hex(probe("fg-muted")), fgSubtle: hex(probe("fg-subtle")) }, rows };
})()`;

const profile = mkdtempSync(join(tmpdir(), "edge-text-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });
let ws;
try {
  let list; for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.some(t => t.type === "page")) break; } catch {} await sleep(200); }
  ws = new WebSocket(list.find(t => t.type === "page").webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = new Map(); ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => { const r = (await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true })).result; if (r?.exceptionDetails) console.error(r.exceptionDetails.exception?.description?.slice(0, 300)); return r?.result?.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE }); await sleep(2500);
  await ev(`(() => { const all = JSON.parse(localStorage.getItem("area-desktop") || "{}"); all.theme = ${JSON.stringify(theme)}; localStorage.setItem("area-desktop", JSON.stringify(all)); })()`);
  await ev(`location.hash = "components"`); await send("Page.reload", { ignoreCache: true }); await sleep(3500);
  const results = { theme, base: BASE, at: new Date().toISOString(), families: {} };
  for (const slug of slugs) {
    let fam = { rows: [] };
    try {
      await Promise.race([(async () => {
        await ev(`location.hash = ${JSON.stringify("components/" + slug)}`);
        for (let i = 0; i < 30; i++) { await sleep(150); if (await ev(`document.querySelectorAll(".studio-canvas__body .gallery-tile").length`)) break; }
        await sleep(600);
        // Lay tiles out at 1x so the gaps are true pixels (fit.ts scales previews).
        await ev(`document.querySelectorAll(".studio-canvas__body [style*=scale], .studio-canvas__body [style*=zoom]").forEach(e => { e.style.scale = "1"; e.style.zoom = "1"; e.style.transform = "none"; })`);
        fam = await ev(MEASURE) ?? fam;
      })(), sleep(60000).then(() => fam.timeout = true)]);
    } catch (e) { fam.error = String(e).slice(0, 200); }
    results.families[slug] = fam;
    process.stdout.write(`${slug}: ${fam.rows?.length ?? 0} texts${fam.timeout ? " TIMEOUT" : ""}${fam.error ? " ERROR" : ""}\n`);
  }
  writeFileSync(out, JSON.stringify(results, null, 1));
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL"); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
