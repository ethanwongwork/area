// Motion, every family (owner, 2026-10-22: "make sure all the motion interaction that was built recently is
// implemented correctly into all the components"). Checks the MOTION.md rules at runtime, in headless Edge against the
// app (desktop-dist), per family:
//   1. hover: every interactive element (and its ::before) enters at once and leaves on `duration-fast` with the
//      scope's `ease-out` (a lift leaves on `base` with `ease-in`);
//   2. Easing: with the Canvas on Snappy, every transition and animation in the tiles uses a Snappy curve (or linear,
//      or steps for a caret), so none hard-codes Standard's;
//   3. Motion 0: every transition and animation in the tiles lasts 0;
//   4. rest: no `will-change` on a resting element.
//
//   node sweep.mjs <out.json> [base] [port]        e.g. node sweep.mjs motion.json http://127.0.0.1:4410/
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const [out, BASE = "http://127.0.0.1:4410/", portArg = "9881"] = process.argv.slice(2);
const port = +portArg;
const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(join(here, "../../..", "apps/desktop/src/content/component-status.mjs"));
const slugs = process.env.SLUGS ? process.env.SLUGS.split(",") : [...COMPLETE_COMPONENTS, ...REVIEW_COMPONENTS].sort();
const INTERACTIVE = "button:not([disabled]), a[href], [role=option], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=tab], [role=treeitem], [role=radio]:not(input), [role=checkbox]:not(input), [role=switch], [role=row][tabindex], [role=gridcell][tabindex], summary, label:has(> input[type=checkbox], > input[type=radio]), .area-board-card, .area-asset-card[tabindex], .area-file-tile[tabindex], input:not([type=hidden]):not([disabled]), textarea, select";
const CAP = 40;

// One element's transitions, own and ::before, as [prop, duration ms, curve] triples.
const MOTION = `function () { const ms = s => s.endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000;
  const read = cs => { const p = cs.transitionProperty.split(", "), d = cs.transitionDuration.split(", "), t = cs.transitionTimingFunction.split(/,\\s*(?![^()]*\\))/);
    return p.map((x, i) => [x, ms(d[i % d.length]), t[i % t.length]]).filter(x => x[1] > 0 && x[0] !== "visibility" && x[0] !== "display" && x[0] !== "overlay"); };
  return { self: read(getComputedStyle(this)), before: read(getComputedStyle(this, "::before")) }; }`;
// What hover can change: own fill, ink, edge, shadow, outline, decoration, and the ::before / ::after plate.
const PAINT = `function () { const a = getComputedStyle(this), b = getComputedStyle(this, "::before"), c = getComputedStyle(this, "::after");
  return [a.backgroundColor, a.color, a.borderTopColor, a.boxShadow, a.textDecorationColor, a.opacity, b.backgroundColor, b.opacity, b.boxShadow, b.borderTopColor, c.backgroundColor, c.opacity, c.boxShadow].join("|"); }`;
const DESC = `function () { const t = this.closest(".gallery-tile"); const lab = (t?.closest(".area-asset-card")?.querySelector(".area-asset-card__name")?.textContent || t?.querySelector(".gallery-tile__label,.gallery-tile__title")?.textContent || "?").trim().slice(0, 40);
  const cls = [...this.classList].filter(c => c.startsWith("area-")); return { tile: lab, el: this.localName + (cls.length ? "." + cls.slice(0, 2).join(".") : "") + (this.getAttribute("role") ? "[role=" + this.getAttribute("role") + "]" : "") }; }`;
// Everything that moves in the tiles: transitions (own, ::before, ::after) and animations, with the scope's tokens.
const ALL = `(() => { const ms = s => s.endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000; const body = document.querySelector(".studio-canvas__body"); const root = getComputedStyle(body);
  const tok = { out: root.getPropertyValue("--area-ease-out").trim(), inOut: root.getPropertyValue("--area-ease-in-out").trim(), in: root.getPropertyValue("--area-ease-in").trim(), drawer: root.getPropertyValue("--area-ease-drawer").trim(), fast: root.getPropertyValue("--area-duration-fast").trim(), base: root.getPropertyValue("--area-duration-base").trim() };
  const rows = [];
  for (const el of body.querySelectorAll(".gallery-tile__view *")) for (const ps of [null, "::before", "::after"]) { const cs = getComputedStyle(el, ps); if (ps && cs.content === "none") continue;
    const p = cs.transitionProperty.split(", "), d = cs.transitionDuration.split(", "), t = cs.transitionTimingFunction.split(/,\\s*(?![^()]*\\))/);
    p.forEach((x, i) => { const dur = ms(d[i % d.length]); if (dur > 0 && !["visibility", "display", "overlay"].includes(x)) rows.push({ kind: "transition", el: el.localName + "." + [...el.classList].filter(c => c.startsWith("area-")).slice(0, 2).join(".") + (ps || ""), prop: x, dur, curve: t[i % t.length] }); });
    if (cs.animationName !== "none") { const n = cs.animationName.split(", "), d2 = cs.animationDuration.split(", "), t2 = cs.animationTimingFunction.split(/,\\s*(?![^()]*\\))/);
      n.forEach((x, i) => rows.push({ kind: "animation", el: el.localName + "." + [...el.classList].filter(c => c.startsWith("area-")).slice(0, 2).join(".") + (ps || ""), prop: x, dur: ms(d2[i % d2.length]), curve: t2[i % t2.length] })); }
    if (!ps && cs.willChange !== "auto") rows.push({ kind: "will-change", el: el.localName + "." + [...el.classList].filter(c => c.startsWith("area-")).slice(0, 2).join("."), prop: cs.willChange, dur: 0, curve: "" }); }
  return { tok, rows }; })()`;

const profile = mkdtempSync(join(tmpdir(), "edge-motion-"));
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
  await send("Emulation.setEmulatedMedia", { features: [{ name: "hover", value: "hover" }, { name: "pointer", value: "fine" }, { name: "prefers-reduced-motion", value: "no-preference" }] });
  await send("Page.navigate", { url: BASE + "#components" }); await sleep(3500);
  const results = { base: BASE, at: new Date().toISOString(), families: {} };
  for (const slug of slugs) {
    const fam = { hover: [], snappy: null, zero: null, standard: null };
    try {
      await Promise.race([(async () => {
        await ev(`location.hash = ${JSON.stringify("components/" + slug)}`);
        for (let i = 0; i < 30; i++) { await sleep(150); if (await ev(`document.querySelectorAll(".studio-canvas__body .gallery-tile").length`)) break; }
        await sleep(400);
        await ev(`(() => { const b = document.querySelector(".studio-canvas__body"); b.removeAttribute("data-area-easing"); b.setAttribute("data-area-motion", "210"); })()`);
        fam.standard = await ev(ALL);
        // Hover enter / leave per interactive element, at the app's defaults.
        const tree = (await send("DOM.getDocument", { depth: -1, pierce: false })).result.root, doc = tree.nodeId;
        const parent = new Map(), tile = new Set();
        (function walk(n) { const cls = (n.attributes ?? []).findIndex((v, i) => i % 2 === 0 && v === "class"); if (cls >= 0 && /\bgallery-tile\b/.test(n.attributes[cls + 1])) tile.add(n.nodeId); for (const c of n.children ?? []) { parent.set(c.nodeId, n.nodeId); walk(c); } })(tree);
        const chain = nodeId => { const o = []; for (let n = nodeId; n && n !== doc; n = parent.get(n)) { o.push(n); if (tile.has(n)) break; } return o; };
        const force = async (nodeId, classes) => { for (const n of chain(nodeId)) await send("CSS.forcePseudoState", { nodeId: n, forcedPseudoClasses: classes }); };
        const nodes = (await send("DOM.querySelectorAll", { nodeId: doc, selector: `.studio-canvas__body .gallery-tile__view :is(${INTERACTIVE})` })).result.nodeIds.slice(0, CAP);
        for (const n of nodes) {
          const o = (await send("DOM.resolveNode", { nodeId: n })).result?.object?.objectId; if (!o) continue;
          const d = await call(o, DESC); const leave = await call(o, MOTION); const rest = await call(o, PAINT);
          await force(n, ["hover"]); const enter = await call(o, MOTION); const hovered = await call(o, PAINT); await force(n, []);
          fam.hover.push({ ...d, leave, enter, changes: rest !== hovered });
        }
        // Easing: Snappy on the Canvas.
        await ev(`document.querySelector(".studio-canvas__body").setAttribute("data-area-easing", "snappy")`); await sleep(50);
        fam.snappy = await ev(ALL);
        await ev(`(() => { const b = document.querySelector(".studio-canvas__body"); b.removeAttribute("data-area-easing"); b.setAttribute("data-area-motion", "0"); })()`); await sleep(50);
        fam.zero = await ev(ALL);
        await ev(`document.querySelector(".studio-canvas__body").setAttribute("data-area-motion", "210")`);
      })(), sleep(120000).then(() => fam.timeout = true)]);
    } catch (e) { fam.error = String(e).slice(0, 200); }
    results.families[slug] = fam;
    process.stdout.write(`${slug}: ${fam.hover.length} hovered, ${fam.standard?.rows.length ?? "?"} moving${fam.timeout ? " TIMEOUT" : ""}${fam.error ? " ERROR " + fam.error : ""}\n`);
  }
  writeFileSync(out, JSON.stringify(results, null, 1));
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL"); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
