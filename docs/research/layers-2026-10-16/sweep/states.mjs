// Hover and pressed states at the Layers settings: every interactive element in every family, :hover then :active
// forced through the DevTools protocol, its text contrast on the state's plate and whether the state shows at all
// (a plate step, an ink change or an edge change from rest). Run against the static build (desktop-dist, 4410).
//
//   node states.mjs <outdir> <theme> <ground> <layers> [port]      one combination, every family (SLUGS narrows)
//   node states.mjs --all <outdir>                                 six combinations, three at a time
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sleep = ms => new Promise(r => setTimeout(r, ms));

if (process.argv[2] === "--all") {
  const out = process.argv[3] ?? "states-out";
  const combos = [["light", "100", "4"], ["light", "90", "0"], ["light", "90", "8"], ["dark", "8", "4"], ["dark", "0", "0"], ["dark", "24", "8"]];
  // Each combination in two halves of the families, all at once (twelve headless Edges).
  const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(join(here, "../../../..", "apps/desktop/src/content/component-status.mjs"));
  const all = process.env.SLUGS ? process.env.SLUGS.split(",") : [...COMPLETE_COMPONENTS, ...REVIEW_COMPONENTS];
  const halves = [all.filter((_, i) => i % 2 === 0), all.filter((_, i) => i % 2 === 1)];
  let port = 9800;
  await Promise.all(combos.flatMap(([t, g, l]) => halves.map((part, h) => new Promise(res =>
    spawn(process.execPath, [fileURLToPath(import.meta.url), join(out, "part" + h), t, g, l, String(++port)], { stdio: "inherit", env: { ...process.env, SLUGS: part.join(",") } }).on("exit", res)))));
  process.exit(0);
}

const [outdir, theme, ground, layers, portArg = "9800"] = process.argv.slice(2);
const REPO = join(here, "../../../..");
const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(join(REPO, "apps/desktop/src/content/component-status.mjs"));
const slugs = process.env.SLUGS ? process.env.SLUGS.split(",") : [...COMPLETE_COMPONENTS, ...REVIEW_COMPONENTS];
const BASE = process.env.BASE ?? "http://127.0.0.1:4410/";
const port = +portArg;
const INTERACTIVE = "button:not([disabled]), a[href], [role=option], [role=menuitem], [role=menuitemcheckbox], [role=menuitemradio], [role=tab], [role=treeitem], [role=radio]:not(input), [role=checkbox]:not(input), [role=switch], [role=row][tabindex], summary, .area-board-card, .area-nav__row, .area-input, .area-textarea, select.area-select";
const CAP = 40;

// Runs on one element (this): its text against the composited plate, and a paint signature to compare states.
const MEASURE = `function () {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = s => { if (!s || s === "transparent" || s === "rgba(0, 0, 0, 0)") return [0, 0, 0, 0];
    const o = g => { cx.globalCompositeOperation = "copy"; cx.fillStyle = g; cx.fillRect(0, 0, 1, 1); cx.globalCompositeOperation = "source-over"; cx.fillStyle = "#000"; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); return cx.getImageData(0, 0, 1, 1).data; };
    const w = o("#fff"), b = o("#000"), a = 1 - (w[0] - b[0]) / 255; return a <= 0.002 ? [0, 0, 0, 0] : [b[0] / a, b[1] / a, b[2] / a, a]; };
  const over = (t, u) => { const a = t[3] + u[3] * (1 - t[3]); if (!a) return [0, 0, 0, 0]; return [0, 1, 2].map(i => (t[i] * t[3] + u[i] * u[3] * (1 - t[3])) / a).concat(a); };
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const Y = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = Y(a), y = Y(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const lab = c => { const [r, g, b] = c.map(lin); const l = Math.cbrt(0.4122214708 * r + 0.5363288850 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s]; };
  const hex = c => "#" + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
  const page = rgba(getComputedStyle(document.documentElement).backgroundColor);
  const bgOf = el => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = rgba(getComputedStyle(e).backgroundColor); if (c[3]) stack.push(c); if (c[3] >= 1) break; } let acc = page[3] ? page : [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc); return acc; };
  const el = this, cs = getComputedStyle(el);
  const plate = bgOf(el), under = el.parentElement ? bgOf(el.parentElement) : plate;
  const texts = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.parentElement; if (!n.textContent.trim() || t.closest(".area-sr-only,[aria-hidden=true]")) continue;
    let o = 1; for (let e = t; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; if (o < 0.99) continue;
    const s = getComputedStyle(t); if (s.visibility === "hidden") continue;
    const bg = bgOf(t), fg = rgba(s.color), f = fg[3] < 1 ? over(fg, bg) : fg, r = ratio(f, bg);
    const size = parseFloat(s.fontSize), need = size >= 24 || (size >= 18.66 && +s.fontWeight >= 700) ? 3 : 4.5;
    if (r < need) texts.push({ text: n.textContent.trim().slice(0, 24), fg: hex(f), bg: hex(bg), ratio: +r.toFixed(2) });
  }
  const svg = el.querySelector("svg"); const ink = svg ? getComputedStyle(svg).color : cs.color;
  // The parent's and grandparent's paint too: a row or card can carry the hover for the link inside it.
  const up = [el.parentElement, el.parentElement?.parentElement].map(e => e ? getComputedStyle(e).backgroundColor + "/" + getComputedStyle(e).boxShadow : "").join("|");
  return { sig: [hex(plate), ink, cs.borderTopColor, cs.boxShadow, cs.outlineStyle, cs.textDecorationLine, cs.textDecorationColor, cs.textDecorationThickness, up].join("|"), lab: lab(plate), plate: hex(plate), texts };
}`;

const profile = mkdtempSync(join(tmpdir(), "edge-states-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });
let ws;
try {
  let list; for (let i = 0; i < 50; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.some(t => t.type === "page")) break; } catch {} await sleep(200); }
  ws = new WebSocket(list.find(t => t.type === "page").webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = new Map(); ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => (await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true })).result?.result?.value;
  await send("Page.enable"); await send("DOM.enable"); await send("CSS.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE + `?theme=${theme}` }); await sleep(1500);
  const axis = theme === "dark" ? "ground-dark" : "ground-light";
  await ev(`(() => { const all = JSON.parse(localStorage.getItem("area-desktop") || "{}"); all.theme = ${JSON.stringify(theme)}; all.canvas = { ...(all.canvas || {}), ${JSON.stringify(axis)}: ${JSON.stringify(ground)}, "layers-light": ${JSON.stringify(layers)}, "layers-dark": ${JSON.stringify(layers)} }; localStorage.setItem("area-desktop", JSON.stringify(all)); })()`);
  await ev(`location.hash = "components"`); await send("Page.reload", { ignoreCache: true }); await sleep(2500);
  await ev(`(() => { const s = document.createElement("style"); s.textContent = "*,*::before,*::after{transition:none!important;animation-play-state:paused!important}"; document.head.append(s); })()`);
  const results = { theme, ground, layers, families: {} };
  for (const slug of slugs) {
    const findings = [];
    try {
      await Promise.race([(async () => {
        await ev(`location.hash = ${JSON.stringify("components/" + slug)}`);
        for (let i = 0; i < 30; i++) { await sleep(150); if (await ev(`document.querySelectorAll(".studio-canvas__body .gallery-tile").length`)) break; }
        await sleep(300);
        const tree = (await send("DOM.getDocument", { depth: -1, pierce: false })).result.root, doc = tree.nodeId;
        // A real pointer hovers every ancestor too (a Nav row, a Board card): force the state up the chain.
        // Up to the gallery tile: nothing above it carries a specimen's hover.
        const parent = new Map(), tile = new Set();
        (function walk(n) { const cls = (n.attributes ?? []).findIndex((v, i) => i % 2 === 0 && v === "class"); if (cls >= 0 && /\bgallery-tile\b/.test(n.attributes[cls + 1])) tile.add(n.nodeId); for (const c of n.children ?? []) { parent.set(c.nodeId, n.nodeId); walk(c); } })(tree);
        const chain = nodeId => { const out = []; for (let n = nodeId; n && n !== doc; n = parent.get(n)) { out.push(n); if (tile.has(n)) break; } return out; };
        const force = async (nodeId, classes) => { for (const n of chain(nodeId)) await send("CSS.forcePseudoState", { nodeId: n, forcedPseudoClasses: classes.filter(c => c === "hover" || n === nodeId) }); };
        const nodes = (await send("DOM.querySelectorAll", { nodeId: doc, selector: `.studio-canvas__body .gallery-tile__view :is(${INTERACTIVE})` })).result.nodeIds.slice(0, CAP);
        for (const nodeId of nodes) {
          const obj = (await send("DOM.resolveNode", { nodeId })).result?.object?.objectId; if (!obj) continue;
          const measure = async () => (await send("Runtime.callFunctionOn", { objectId: obj, functionDeclaration: MEASURE, returnByValue: true })).result?.result?.value;
          const desc = (await send("Runtime.callFunctionOn", { objectId: obj, functionDeclaration: `function () { const t = this.closest(".gallery-tile"); return (t?.querySelector(".gallery-tile__label,.gallery-tile__title")?.textContent || "?").trim().slice(0, 40) + " :: " + this.localName + "." + [...this.classList].filter(c => c.startsWith("area-")).slice(0, 2).join(".") + (this.getAttribute("role") ? "[role=" + this.getAttribute("role") + "]" : "") + (this.getAttribute("aria-label") ? "[" + this.getAttribute("aria-label") + "]" : ""); }`, returnByValue: true })).result?.result?.value;
          const rest = await measure(); if (!rest) continue;
          // A current, selected, pressed, open, busy or disabled control may rightly keep its paint under the pointer.
          const settled = (await send("Runtime.callFunctionOn", { objectId: obj, functionDeclaration: `function () { return !!this.closest("[disabled],[aria-disabled=true],[data-disabled],[aria-busy=true],[data-loading]") || !!(this.closest("[aria-current]:not([aria-current=false]),[aria-selected=true],[aria-pressed=true],[data-selected],[aria-checked=true],[aria-expanded=true]") || this.querySelector(":scope > [aria-current]:not([aria-current=false])")); }`, returnByValue: true })).result?.result?.value;
          for (const state of ["hover", "active"]) {
            await force(nodeId, state === "active" ? ["hover", "active"] : ["hover"]);
            const m = await measure();
            if (m?.texts.length) findings.push({ kind: "text", state, el: desc, ...m.texts[0], count: m.texts.length });
            if (m && state === "hover" && m.sig === rest.sig && !settled) findings.push({ kind: "no-hover", el: desc, plate: rest.plate });
            // A hover that is only a plate step, and a small one (OKLab ΔE, so a tinted step counts its hue).
            const dE = m ? Math.hypot(...m.lab.map((v, i) => v - rest.lab[i])) : 0;
            if (m && state === "hover" && m.plate !== rest.plate && dE < (theme === "dark" ? 0.02 : 0.008) && m.sig.split("|").slice(1).join("|") === rest.sig.split("|").slice(1).join("|"))
              findings.push({ kind: "faint-hover", el: desc, rest: rest.plate, hover: m.plate, dE: +dE.toFixed(4) });
          }
          await force(nodeId, []);
        }
      })(), sleep(180000).then(() => findings.push({ kind: "timeout" }))]);
    } catch (e) { findings.push({ kind: "error", message: String(e).slice(0, 200) }); }
    results.families[slug] = findings;
    process.stdout.write(`${theme}/${ground}/${layers} ${slug}: ${findings.filter(f => f.kind === "text").length} text, ${findings.filter(f => f.kind !== "text").length} other\n`);
  }
  mkdirSync(outdir, { recursive: true });
  writeFileSync(join(outdir, `${theme}-${ground}-${layers}.json`), JSON.stringify(results, null, 1));
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL"); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
