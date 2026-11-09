// Before/after captures of the balance pass: headless Edge (guest, no implicit sign-in) over the dev server.
// node capture.mjs <outDir> <base>
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [outDir, BASE = "http://localhost:4421/"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const port = 9893;

// The old values, layered over Area's (unlayered rules beat @layer area.components).
const BEFORE = `
.area-dialog__title, .area-drawer__title { font-size: var(--area-title-xs-size) !important; line-height: var(--area-title-xs-leading) !important; letter-spacing: var(--area-title-xs-tracking) !important; }
.area-dialog__header:has(> .area-dialog__close), .area-drawer__header:has(> .area-drawer__close) { margin-block-start: calc((var(--area-icon-md) - var(--area-leading-24)) / 2) !important; }
.area-dialog__header > .area-dialog__close, .area-drawer__header > .area-drawer__close { margin-block: calc((var(--area-leading-24) - var(--_height)) / 2) !important; }
.area-card { --_card-title-size: var(--area-card-title-size, var(--area-title-xs-size)) !important; --_card-title-leading: var(--area-card-title-leading, var(--area-title-xs-leading)) !important; --_card-title-tracking: var(--area-card-title-tracking, var(--area-title-xs-tracking)) !important; }
.area-empty-state--md { --_title-gap: 0px !important; }
.area-dialog__heading, .area-drawer__heading { gap: 0px !important; }
:is(.area-card, .area-card__content) > .area-card__title + .area-card__description { margin-block-start: calc(-1 * var(--_card-gap)) !important; }
.area-card__heading > .area-card__title + .area-card__description { margin-block-start: calc(-1 * var(--area-space-4)) !important; }
.area-choice-label { gap: var(--area-space-2) !important; }
.area-radio-group__description, .area-checkbox-group__description { margin-block-start: var(--area-space-2) !important; }
.area-switch__text { gap: var(--area-space-2) !important; }
.area-file-upload-item__meta { margin-block-start: var(--area-space-2) !important; }
`;

const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;
const SHOTS_ALL = [
  { id: "confirm", tile: "confirm-dialog/default", copy: { ".area-dialog__title": "Go back to “Added Support chat to Onboarding”?", ".area-dialog__description": "The pages go back to how this change left them. The current pages stay in Iterations.", ".area-dialog__footer .area-button:last-child .area-button__label, .area-dialog__footer .area-button:last-child": "Go back" } },
  { id: "dialog", tile: "dialog/default" },
  { id: "drawer", tile: "drawer/default" },
  { id: "card", tile: "card/vertical" },
  { id: "card-header", tile: "card/content-header-action" },
  { id: "empty-md", tile: "empty-state/default" },
  { id: "empty-sm", tile: "empty-state/size-sm" },
  { id: "popover", tile: "popover/teaching" },
  { id: "alert", tile: "alert/multiline" },
  { id: "toast", tile: "toast/title" },
  { id: "checkbox", tile: "checkbox/caption" },
  { id: "radio-group", tile: "radio/description" },
  { id: "switch", tile: "switch/description" },
  { id: "file-upload", tile: "file-upload/content-uploading" },
  { id: "drawer-sm", tile: "drawer/size-sm" },
  { id: "card-stat", tile: "card/template-stat" },
];
const SHOTS = ONLY ? SHOTS_ALL.filter(s => ONLY.includes(s.id)) : SHOTS_ALL;

const profile = mkdtempSync(join(tmpdir(), "edge-balance-"));
const edge = spawn("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--guest", "--disable-features=msImplicitSignin", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--disable-gpu", "about:blank"], { stdio: "ignore" });
let ws;
try {
  let list; for (let i = 0; i < 60; i++) { try { list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); if (list.some(t => t.type === "page")) break; } catch {} await sleep(200); }
  ws = new WebSocket(list.find(t => t.type === "page").webSocketDebuggerUrl); await new Promise(r => ws.onopen = r);
  let id = 0; const pend = new Map(); ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } };
  const send = (method, params = {}) => Promise.race([new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }), sleep(15000).then(() => { console.error('timeout', method, JSON.stringify(params).slice(0, 120)); return {}; })]);
  const ev = async x => { const r = (await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true })).result; if (r?.exceptionDetails) console.error(r.exceptionDetails.exception?.description?.slice(0, 300)); return r?.result?.value; };
  await send("Page.enable"); await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 2, mobile: false });
  await send("Page.navigate", { url: BASE }); await sleep(3000);
  const results = {};
  for (const theme of ["light", "dark"]) {
    await ev(`(() => { const all = JSON.parse(localStorage.getItem("area-desktop") || "{}"); all.theme = ${JSON.stringify(theme)}; localStorage.setItem("area-desktop", JSON.stringify(all)); })()`);
    await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] });
    await send("Page.reload", { ignoreCache: true }); await sleep(4000);
    for (const shot of SHOTS) {
      for (const state of ["before", "after"]) {
        await ev(`history.pushState(null, "", "#system/area/components/${shot.tile}"); dispatchEvent(new HashChangeEvent("hashchange"))`);
        await sleep(1200);
        await ev(`(() => { let s = document.getElementById("__before"); if (!s) { s = document.createElement("style"); s.id = "__before"; document.head.append(s); } s.textContent = ${JSON.stringify(state === "before" ? BEFORE : "")}; })()`);
        if (shot.copy) await ev(`(() => { const st = document.querySelector(".studio-canvas__body .studio-stage__content"); for (const [sel, text] of Object.entries(${JSON.stringify(shot.copy)})) { const el = st.querySelector(sel); if (el) el.textContent = text; } })()`);
        await sleep(400);
        const box = await ev(`(() => { const st = document.querySelector(".studio-canvas__body .studio-stage__content"); const kids = [...st.children]; const r = (kids.length === 1 ? kids[0] : st).getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; })()`);
        if (!box) { console.error("no box", shot.id); continue; }
        const pad = 24;
        const clip = { x: Math.max(0, box.x - pad), y: Math.max(0, box.y - pad), width: box.width + pad * 2, height: box.height + pad * 2, scale: 1 };
        const shotRes = await send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: true }); if (!shotRes.result) { console.error('no shot', shot.id, state, theme); continue; }
        const file = `${shot.id}-${state}-${theme}.png`;
        writeFileSync(join(outDir, file), Buffer.from(shotRes.result.data, "base64"));
        results[file] = clip;
      }
    }
  }
  writeFileSync(join(outDir, "clips.json"), JSON.stringify(results, null, 1));
  console.log("done", Object.keys(results).length);
} finally {
  try { ws?.close(); } catch {}
  edge.kill("SIGKILL"); await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
