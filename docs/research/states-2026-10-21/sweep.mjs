// Interaction states, every family (owner, 2026-10-21: "really analyze the hover, pressed, and selected state for each
// component and make sure its all cohesive, subtle, and also leverages professional motion interaction").
// For every interactive element in every gallery tile: its paint at rest, under :hover and under :hover:active (forced
// through the DevTools protocol), and for every selected element (aria-selected, -pressed, -checked, -current,
// data-selected, :checked) its paint against an unselected sibling of the same kind. Paint = the composited plate under
// the element (own fill, ::before / ::after, the first painted child), ink, edge, ring and shadow. Transitions are read
// before they are switched off. Records values, not just failures, so the families can be compared role by role.
//
//   node sweep.mjs <out.json> <theme> [base] [port]        e.g. node sweep.mjs light.json light http://127.0.0.1:4401/
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const [out, theme = "light", BASE = "http://127.0.0.1:4401/", portArg = "9871"] = process.argv.slice(2);
const port = +portArg;
const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(join(here, "../../..", "apps/desktop/src/content/component-status.mjs"));
const slugs = process.env.SLUGS ? process.env.SLUGS.split(",") : [...COMPLETE_COMPONENTS, ...REVIEW_COMPONENTS].sort();
const INTERACTIVE = "button:not([disabled]), a[href], [role=option], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=tab], [role=treeitem], [role=radio]:not(input), [role=checkbox]:not(input), [role=switch], [role=row][tabindex], [role=gridcell][tabindex], summary, label:has(> input[type=checkbox], > input[type=radio]), .area-board-card, .area-asset-card[tabindex], .area-file-tile[tabindex]";
const SELECTED = "[aria-selected=true], [aria-pressed=true], [aria-checked=true], [aria-current]:not([aria-current=false]), [data-selected]:not([data-selected=false]), [data-state=checked], [data-state=on], [data-state=active], label:has(> input:checked)";
const CAP = 30;

// Runs on one element (this). Returns its paint: the plate under it (composited), what paints it, ink, edge, ring.
const PAINT = `function () {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = s => { if (!s || s === "none" || s === "transparent" || s === "rgba(0, 0, 0, 0)") return [0, 0, 0, 0];
    const o = g => { cx.globalCompositeOperation = "copy"; cx.fillStyle = g; cx.fillRect(0, 0, 1, 1); cx.globalCompositeOperation = "source-over"; cx.fillStyle = "#000"; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); return cx.getImageData(0, 0, 1, 1).data; };
    const w = o("#fff"), b = o("#000"), a = 1 - (w[0] - b[0]) / 255; return a <= 0.002 ? [0, 0, 0, 0] : [b[0] / a, b[1] / a, b[2] / a, a]; };
  const over = (t, u) => { const a = t[3] + u[3] * (1 - t[3]); if (!a) return [0, 0, 0, 0]; return [0, 1, 2].map(i => (t[i] * t[3] + u[i] * u[3] * (1 - t[3])) / a).concat(a); };
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const Y = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const L = c => { const [r, g, b] = c.map(lin); const l = Math.cbrt(0.4122214708 * r + 0.5363288850 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b); return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s]; };
  const hex = c => "#" + c.slice(0, 3).map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const page = rgba(getComputedStyle(document.documentElement).backgroundColor);
  const under = el => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c[3]) stack.push(c); if (c[3] >= 1) break; } let acc = page[3] ? page : [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc); return acc; };
  const el = this, cs = getComputedStyle(el);
  const ground = el.parentElement ? under(el.parentElement) : [255, 255, 255, 1];
  // What paints the element's plate: its own fill, a ::before / ::after plate, or (a label's box, a day's circle) the
  // first painted descendant within two levels.
  let plate = under(el), by = "self";
  for (const pseudo of ["::before", "::after"]) { const p = getComputedStyle(el, pseudo); const c = rgba(p.backgroundColor); if (p.content !== "none" && c[3] && parseFloat(p.width) > 6) { plate = over(c, plate); by = pseudo; break; } }
  if (by === "self" && !rgba(cs.backgroundColor)[3]) { for (const k of el.querySelectorAll(":scope > *, :scope > * > *")) { const c = rgba(getComputedStyle(k).backgroundColor); if (c[3] && k.getBoundingClientRect().width > 6 && !k.matches("svg,img,.area-badge,.area-kbd,.area-count")) { plate = over(c, under(el)); by = "child:" + ([...k.classList].find(x => x.startsWith("area-")) || k.localName); break; } } }
  const svg = el.querySelector("svg"); const ink = rgba(svg ? getComputedStyle(svg).color : cs.color);
  const edgeW = parseFloat(cs.borderTopWidth) || 0, edge = edgeW ? over(rgba(cs.borderTopColor), ground) : null;
  const ratio = (a, b) => { const x = Y(a), y = Y(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(3); };
  const pl = L(plate), gl = L(ground);
  return {
    plate: hex(plate), plateL: +pl[0].toFixed(4), by, ground: hex(ground), groundL: +gl[0].toFixed(4),
    stepVsGround: ratio(plate, ground), ink: hex(over(ink, plate)), inkRatio: ratio(over(ink, plate), plate),
    edge: edge ? hex(edge) + " " + edgeW + "px" : "", ring: cs.boxShadow === "none" ? "" : cs.boxShadow.replace(/rgba?\\(0, 0, 0, 0\\)[^,]*,?\\s*/g, "").slice(0, 160),
    outline: cs.outlineStyle === "none" ? "" : cs.outlineColor + " " + cs.outlineWidth, deco: cs.textDecorationLine === "none" ? "" : cs.textDecorationLine,
    opacity: +cs.opacity, transform: cs.transform === "none" ? "" : cs.transform,
    lab: pl,
  };
}`;
const DESC = `function () { const t = this.closest(".gallery-tile"); const lab = (t?.closest(".area-asset-card")?.querySelector(".area-asset-card__name")?.textContent || t?.querySelector(".gallery-tile__label,.gallery-tile__title")?.textContent || "?").trim().slice(0, 40);
  const cls = [...this.classList].filter(c => c.startsWith("area-")); return { tile: lab, el: this.localName + (cls.length ? "." + cls.slice(0, 3).join(".") : "") + (this.getAttribute("role") ? "[role=" + this.getAttribute("role") + "]" : ""), text: (this.getAttribute("aria-label") || this.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 30), key: this.localName + "." + (cls[0] || "") + "|" + (this.getAttribute("role") || "") }; }`;
const MOTION = `function () { const out = {}; for (const [k, e] of [["self", getComputedStyle(this)], ["before", getComputedStyle(this, "::before")]]) { if (e.transitionDuration && e.transitionDuration !== "0s") out[k] = { prop: e.transitionProperty, dur: e.transitionDuration, ease: e.transitionTimingFunction, delay: e.transitionDelay }; } return out; }`;

const profile = mkdtempSync(join(tmpdir(), "edge-states-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });
let ws;
try {
  let list; for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.some(t => t.type === "page")) break; } catch {} await sleep(200); }
  ws = new WebSocket(list.find(t => t.type === "page").webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = new Map(); ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => (await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true })).result?.result?.value;
  const call = async (objectId, fn) => (await send("Runtime.callFunctionOn", { objectId, functionDeclaration: fn, returnByValue: true })).result?.result?.value;
  await send("Page.enable"); await send("DOM.enable"); await send("CSS.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setEmulatedMedia", { features: [{ name: "hover", value: "hover" }, { name: "pointer", value: "fine" }] });
  await send("Page.navigate", { url: BASE }); await sleep(2500);
  await ev(`(() => { const all = JSON.parse(localStorage.getItem("area-desktop") || "{}"); all.theme = ${JSON.stringify(theme)}; localStorage.setItem("area-desktop", JSON.stringify(all)); })()`);
  await ev(`location.hash = "components"`); await send("Page.reload", { ignoreCache: true }); await sleep(3000);
  const results = { theme, base: BASE, at: new Date().toISOString(), families: {} };
  for (const slug of slugs) {
    const fam = { interactive: [], selected: [] };
    try {
      await Promise.race([(async () => {
        await ev(`document.querySelectorAll("#__notrans").forEach(s => s.remove()); location.hash = ${JSON.stringify("components/" + slug)}`);
        for (let i = 0; i < 30; i++) { await sleep(150); if (await ev(`document.querySelectorAll(".studio-canvas__body .gallery-tile").length`)) break; }
        await sleep(500);
        const tree = (await send("DOM.getDocument", { depth: -1, pierce: false })).result.root, doc = tree.nodeId;
        const parent = new Map(), tile = new Set();
        (function walk(n) { const cls = (n.attributes ?? []).findIndex((v, i) => i % 2 === 0 && v === "class"); if (cls >= 0 && /\bgallery-tile\b/.test(n.attributes[cls + 1])) tile.add(n.nodeId); for (const c of n.children ?? []) { parent.set(c.nodeId, n.nodeId); walk(c); } })(tree);
        const chain = nodeId => { const o = []; for (let n = nodeId; n && n !== doc; n = parent.get(n)) { o.push(n); if (tile.has(n)) break; } return o; };
        const force = async (nodeId, classes) => { for (const n of chain(nodeId)) await send("CSS.forcePseudoState", { nodeId: n, forcedPseudoClasses: classes.filter(c => c === "hover" || n === nodeId) }); };
        const q = async sel => (await send("DOM.querySelectorAll", { nodeId: doc, selector: `.studio-canvas__body .gallery-tile__view :is(${sel})` })).result.nodeIds;
        const obj = async nodeId => (await send("DOM.resolveNode", { nodeId })).result?.object?.objectId;
        const nodes = (await q(INTERACTIVE)).slice(0, CAP);
        // Transitions first, with motion on.
        // Leaving a state uses the rest rule's transition; entering uses the hovered rule's.
        await ev(`document.querySelectorAll("#__notrans").forEach(s => s.remove())`);
        const motion = new Map();
        for (const n of nodes) { const o = await obj(n); if (!o) continue; const leave = await call(o, MOTION); await force(n, ["hover"]); const enter = await call(o, MOTION); await force(n, []); motion.set(n, { leave, enter }); }
        await ev(`(() => { const s = document.createElement("style"); s.id = "__notrans"; s.textContent = "*,*::before,*::after{transition:none!important;animation-play-state:paused!important}"; document.head.append(s); })()`);
        for (const n of nodes) {
          const o = await obj(n); if (!o) continue;
          const d = await call(o, DESC);
          const settled = await call(o, `function () { return !!this.closest("[disabled],[aria-disabled=true],[data-disabled]") ; }`);
          if (settled) continue;
          const rest = await call(o, PAINT);
          await force(n, ["hover"]); const hover = await call(o, PAINT);
          await force(n, ["hover", "active"]); const pressed = await call(o, PAINT);
          await force(n, []);
          fam.interactive.push({ ...d, rest, hover, pressed, motion: motion.get(n) });
        }
        // Selected: its paint at rest, and an unselected sibling of the same kind.
        for (const n of (await q(SELECTED)).slice(0, 12)) {
          const o = await obj(n); if (!o) continue;
          const d = await call(o, DESC);
          const sel = await call(o, PAINT);
          const sib = await call(o, `function () { const k = this.className; const peers = [...(this.parentElement?.children ?? [])].filter(e => e !== this && e.localName === this.localName && e.className.split(" ")[0] === k.split(" ")[0] && !e.matches(${JSON.stringify(SELECTED)})); return peers[0] ? (${PAINT}).call(peers[0]) : null; }`);
          await force(n, ["hover"]); const selHover = await call(o, PAINT); await force(n, []);
          fam.selected.push({ ...d, selected: sel, unselected: sib, selectedHover: selHover });
        }
      })(), sleep(150000).then(() => fam.timeout = true)]);
    } catch (e) { fam.error = String(e).slice(0, 200); }
    results.families[slug] = fam;
    process.stdout.write(`${theme} ${slug}: ${fam.interactive.length} interactive, ${fam.selected.length} selected${fam.timeout ? " TIMEOUT" : ""}${fam.error ? " ERROR " + fam.error : ""}\n`);
  }
  writeFileSync(out, JSON.stringify(results, null, 1));
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL"); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
