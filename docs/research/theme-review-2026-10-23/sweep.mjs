// Theme combination sweep (theme review 2026-10-23/24): every family's gallery at a set of settings (combos.mjs, or
// rand-combos.json from random.mjs), light and dark, in headless Edge (a guest profile with implicit sign-in off, so it
// never signs into the owner's account). Per text-bearing element: the WCAG ratio of its ink over the composited plate
// under it. Per tile: content wider than the tile (re-measured after 1.5 s, since the gallery refits as it settles) and
// selected elements painted exactly as an unselected sibling. Per combo: every --area-* colour token probed on the Canvas
// scope (an invalid one paints transparent) and console errors. Serve a static desktop build first (npm run build -w
// @area/desktop; python3 -m http.server 4441 --directory apps/desktop/dist), then: node diff.mjs <outdir>.
//   node sweep.mjs <base> <cdpPort> <outdir> <combo,combo,...>      e.g. node sweep.mjs http://127.0.0.1:4441/ 9951 out base,r00
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { COMBOS as NAMED } from "./combos.mjs";
import { readFileSync, existsSync } from "node:fs";
const COMBOS = { ...NAMED, ...(existsSync(new URL("./rand-combos.json", import.meta.url)) ? JSON.parse(readFileSync(new URL("./rand-combos.json", import.meta.url))) : {}) };

const sleep = ms => new Promise(r => setTimeout(r, ms));
const [BASE, portArg, OUT, comboArg] = process.argv.slice(2);
const port = +portArg;
mkdirSync(OUT, { recursive: true });
const { COMPLETE_COMPONENTS, REVIEW_COMPONENTS } = await import(new URL("../../../apps/desktop/src/content/component-status.mjs", import.meta.url).href);
const slugs = process.env.SLUGS ? process.env.SLUGS.split(",") : [...new Set([...COMPLETE_COMPONENTS, ...REVIEW_COMPONENTS])].sort();
const runs = comboArg.split(",").flatMap(name => ["light", "dark"].map(theme => ({ name, theme })));

const ANALYZE = `(() => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = s => { if (!s || s === "none" || s === "transparent" || s === "rgba(0, 0, 0, 0)") return [0, 0, 0, 0];
    const o = g => { cx.globalCompositeOperation = "copy"; cx.fillStyle = g; cx.fillRect(0, 0, 1, 1); cx.globalCompositeOperation = "source-over"; cx.fillStyle = "#000"; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); return cx.getImageData(0, 0, 1, 1).data; };
    const w = o("#fff"), b = o("#000"), a = 1 - (w[0] - b[0]) / 255; return a <= 0.002 ? [0, 0, 0, 0] : [b[0] / a, b[1] / a, b[2] / a, a]; };
  const over = (t, u) => { const a = t[3] + u[3] * (1 - t[3]); if (!a) return [0, 0, 0, 0]; return [0, 1, 2].map(i => (t[i] * t[3] + u[i] * u[3] * (1 - t[3])) / a).concat(a); };
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const Y = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = Y(a), y = Y(b); return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); };
  const hex = c => "#" + c.slice(0, 3).map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const page = rgba(getComputedStyle(document.body).backgroundColor);
  const pageBase = page[3] ? over(page, [255,255,255,1]) : rgba(getComputedStyle(document.documentElement).backgroundColor);
  const plateOf = el => { const stack = []; let image = false;
    for (let e = el; e; e = e.parentElement) { const s = getComputedStyle(e);
      if (s.backgroundImage !== "none" && !/^url\\(/.test(s.backgroundImage) === false) image = true;
      if (/gradient|url/.test(s.backgroundImage)) image = true;
      if (e.matches("img,video,canvas,picture,svg image") ) image = true;
      const c = rgba(s.backgroundColor); if (c[3]) stack.push(c); if (c[3] >= 1) break; }
    let acc = pageBase[3] ? pageBase : [255, 255, 255, 1]; for (let i = stack.length - 1; i >= 0; i--) acc = over(stack[i], acc); return { acc, image }; };
  const disabled = el => !!el.closest("[disabled],[aria-disabled=true],[data-disabled],fieldset:disabled,.is-disabled");
  const opacityChain = el => { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
  const tileOf = el => { const a = el.closest(".gallery-asset"); const t = el.closest(".gallery-tile"); return (a?.querySelector(".area-asset-card__name")?.textContent || a?.getAttribute("aria-label") || t?.querySelector(".gallery-tile__label")?.textContent || "?").trim().slice(0, 40); };
  const pathOf = el => { const parts = []; for (let e = el; e && !e.classList.contains("gallery-tile__view"); e = e.parentElement) { const cls = [...e.classList].find(c => c.startsWith("area-")); if (cls) parts.unshift(cls); if (parts.length >= 3) break; } return parts.join(">") || el.localName; };
  const root = document.querySelector(".studio-canvas__body");
  const views = [...root.querySelectorAll(".gallery-tile__view")];
  const text = [], clipped = [];
  for (const view of views) {
    const walker = document.createTreeWalker(view, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue; const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
      const s = getComputedStyle(el); const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || s.visibility !== "visible" || s.display === "none") continue;
      if (el.closest("[aria-hidden=true]") && r.width < 4) continue;
      const clip = s.clip && s.clip !== "auto"; if (clip) continue;
      const op = opacityChain(el); if (op < 0.95 || disabled(el)) continue;
      const { acc, image } = plateOf(el); const ink = rgba(s.color); if (!ink[3]) continue;
      const shown = over(ink, acc); const k = ratio(shown, acc);
      const size = parseFloat(s.fontSize), weight = +s.fontWeight; const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      if (k < need) text.push({ tile: tileOf(el), path: pathOf(el), text: n.textContent.trim().slice(0, 24), ratio: k, need, ink: hex(shown), plate: hex(acc), image, size });
      if ((s.overflow === "hidden" || s.overflowX === "hidden") && s.textOverflow !== "ellipsis" && el.scrollWidth > el.clientWidth + 2 && !s.webkitLineClamp?.match(/\\d/)) clipped.push({ tile: tileOf(el), path: pathOf(el), text: n.textContent.trim().slice(0, 24), over: el.scrollWidth - el.clientWidth });
    }
  }
  // Content wider than its tile, and selected states that paint exactly as their unselected siblings.
  const overflow = [], sameSelected = [];
  for (const view of views) { const over = view.scrollWidth - view.clientWidth; if (over > 2) overflow.push({ tile: tileOf(view), over }); }
  const SEL = "[aria-selected=true],[aria-checked=true],[aria-pressed=true],[aria-current]:not([aria-current=false]),[data-selected]:not([data-selected=false]),[data-state=checked],[data-state=on]";
  const sig = el => { const c = getComputedStyle(el), b = getComputedStyle(el, "::before"), a = getComputedStyle(el, "::after");
    const kid = el.querySelector("svg, .area-checkbox__box, .area-radio__circle, .area-switch__track, [class*=__indicator], [class*=__check], [class*=__mark]");
    const k = kid ? getComputedStyle(kid) : null;
    return [c.backgroundColor, c.borderTopColor, c.borderTopWidth, c.boxShadow, c.color, c.fontWeight, c.outlineStyle, c.textDecorationLine, b.content, b.backgroundColor, b.borderTopColor, b.opacity, b.transform, a.content, a.backgroundColor, a.opacity, k?.backgroundColor, k?.color, k?.borderTopColor, k?.opacity, k?.fill, k?.visibility].join("|"); };
  for (const view of views) for (const el of view.querySelectorAll(SEL)) {
    if (el.closest("[disabled],[aria-disabled=true]")) continue;
    const cls = [...el.classList].find(c => c.startsWith("area-"));
    const sib = [...(el.parentElement?.children ?? [])].find(x => x !== el && x.localName === el.localName && (!cls || x.classList.contains(cls)) && !x.matches(SEL) && !x.closest("[disabled],[aria-disabled=true]"));
    if (sib && sig(el) === sig(sib)) sameSelected.push({ tile: tileOf(el), path: pathOf(el), text: (el.textContent || "").trim().slice(0, 20) });
  }
  return { tiles: views.length, text, clipped, overflow, sameSelected };
})()`;

const TOKENS = `(() => {
  const root = document.querySelector(".studio-canvas__body");
  const names = new Set();
  for (const sheet of document.styleSheets) { let rules; try { rules = sheet.cssRules; } catch { continue; }
    const walk = list => { for (const r of list) { if (r.style) for (let i = 0; i < r.style.length; i++) { const p = r.style[i]; if (p.startsWith("--area-")) names.add(p); } if (r.cssRules) walk(r.cssRules); } }; walk(rules); }
  const probe = document.createElement("div"); root.appendChild(probe);
  const cs = getComputedStyle(root); const out = {};
  for (const name of names) { const raw = cs.getPropertyValue(name).trim(); if (!raw) { out[name] = "∅"; continue; }
    if (!/(#|rgb|hsl|oklch|oklab|color\\(|light-dark|color-mix|var\\(--area-(bg|fg|border|accent|stroke|edge|shadow|focus|ink)|transparent|currentcolor)/i.test(raw)) continue;
    probe.style.cssText = "background-color: rgb(1, 2, 3); background-color: var(" + name + ")";
    out[name] = getComputedStyle(probe).backgroundColor; }
  probe.remove(); return out;
})()`;

const profile = mkdtempSync(join(OUT, ".edge-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--guest", "--disable-features=msImplicitSignin", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });
let ws;
try {
  let list; for (let i = 0; i < 80; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.some(t => t.type === "page")) break; } catch {} await sleep(200); }
  ws = new WebSocket(list.find(t => t.type === "page").webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = new Map(); const errors = [];
  ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails?.exception?.description?.slice(0, 200) || m.params.exceptionDetails?.text);
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map(a => a.value ?? a.description).join(" ").slice(0, 200)); };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => { const r = await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || "eval"); return r.result?.result?.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1100, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: BASE }); await sleep(2500);
  for (const run of runs) {
    const combo = COMBOS[run.name];
    await ev(`(() => { localStorage.setItem("area-desktop", JSON.stringify({ theme: ${JSON.stringify(run.theme)}, canvas: ${JSON.stringify(combo)}, tab: "components", panels: { sidebar: true, inspector: true } })); })()`);
    await ev(`location.hash = "components"`); await send("Page.reload", { ignoreCache: true }); await sleep(2000);
    for (let i = 0; i < 100; i++) { try { if (await ev(`!!document.querySelector(".studio-canvas__body")`)) break; } catch {} await sleep(200); }
    await sleep(500);
    const applied = await ev(`(() => { const b = document.querySelector(".studio-canvas__body"); return b ? Object.fromEntries([...b.attributes].filter(a => a.name.startsWith("data-area-")).map(a => [a.name.slice(10), a.value])) : null; })()`);
    const html = await ev(`document.documentElement.getAttribute("data-area-theme")`);
    const tokens = await ev(TOKENS);
    const result = { combo: run.name, theme: run.theme, html, applied, tokens, families: {}, errors: [] };
    for (const slug of slugs) {
      errors.length = 0;
      await ev(`location.hash = ${JSON.stringify("components/" + slug)}`);
      let n = 0; for (let i = 0; i < 40; i++) { await sleep(150); n = await ev(`document.querySelectorAll(".studio-canvas__body .gallery-tile__view").length`); if (n) break; }
      await sleep(400);
      await ev(`(() => { if (!document.getElementById("__notrans")) { const s = document.createElement("style"); s.id = "__notrans"; s.textContent = "*,*::before,*::after{transition:none!important;animation:none!important}"; document.head.appendChild(s); } })()`);
      await sleep(60);
      try { result.families[slug] = await ev(ANALYZE); if (result.families[slug].overflow?.length) { await sleep(1500); result.families[slug] = await ev(ANALYZE); } } catch (e) { result.families[slug] = { error: String(e).slice(0, 200) }; }
      if (errors.length) result.families[slug].errors = [...errors];
      await ev(`document.getElementById("__notrans")?.remove()`);
    }
    writeFileSync(join(OUT, `${run.name}.${run.theme}.json`), JSON.stringify(result));
    console.log("done", run.name, run.theme);
  }
} finally { try { ws?.close(); } catch {} edge.kill(); await sleep(500); try { rmSync(profile, { recursive: true, force: true }); } catch {} }
