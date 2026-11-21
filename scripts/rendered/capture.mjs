// Renders and measures the Components Overview, family by family, in headless Edge over the built app
// (apps/desktop/dist). Never touches an open Area window: its own static server, its own headless browser in a fresh
// profile, both on ports the OS picks, both stopped at the end.
//
//   node scripts/rendered/capture.mjs [options] [slug …]          (no slug: every family)
//     --theme light|dark|both     (both)
//     --set axis=value            a Canvas setting for the Area system's Default theme, repeatable: --set type=12
//                                 --set density=28 for Compact. Ids and values are the registry's; an unknown one fails
//                                 before the browser opens, and one the page did not apply fails after (settings.mjs).
//     --families a,b,c            only these families (the same as listing slugs); a slug not on the Overview fails
//     --no-png                    measures only (what check:rendered does)
//     --layout shipped|fit        shipped: the Overview's own two-column grid (check:rendered); fit (the default for
//                                 pictures): a family whose tiles are cut by their cards gets one card per row, and one
//                                 still wider than the Canvas a wider window
//     --out <dir>                 (.cache/rendered/capture); writes <out>/<slug>/<theme>.json and .png
//     --edges                     samples the pixels across each floating surface's left edge (on in dark)
//     --cap <n>                   most elements measured per tile (700)
//     --dist <dir>                the built app (apps/desktop/dist)
// Then `node scripts/rendered/merge.mjs [--out <dir>]` joins light and dark into measure.json and index.json.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { launch } from "./cdp-lib.mjs";
import { serve, DIST } from "./serve.mjs";
import { FLOATING } from "./rules/dark-edge.mjs";
import { describe, moved, validateSet } from "./settings.mjs";

const HERE = fileURLToPath(new URL(".", import.meta.url));
export const ROOT = resolve(HERE, "../..");
export const OUT = join(ROOT, ".cache/rendered");
const MEASURE = readFileSync(join(HERE, "measure-page.js"), "utf8");
const wait = ms => new Promise(done => setTimeout(done, ms));
const firstLine = error => String(error?.message ?? error).split("\n")[0];

// Every wait in the page has its own deadline and a name, so a page that stops answering fails that wait, naming it,
// in seconds rather than at the 120 s call limit. WAIT_MS bounds one in-page wait (settle, fonts) from Node's side;
// FONTS_MS is the page's own deadline for its fonts, after which it names the faces still loading.
const WAIT_MS = Number(process.env.AREA_RENDERED_WAIT_TIMEOUT) || 30000;
const FONTS_MS = Math.min(15000, WAIT_MS / 2);

/**
 * In the page: resolves once the document's fonts have loaded. `document.fonts.ready` first, as before; when it is
 * late (it also waits on layout the page may not run), the faces' own status after a forced layout, polled; at the
 * deadline it rejects naming the faces still loading. Counts each time the poll and not `ready` answered in
 * window.__areaRenderedFallbacks (printed per family in CI).
 */
const FONTS = `(ms => new Promise((done, fail) => {
  let over = false;
  const t0 = Date.now();
  const finish = byReady => { if (over) return; over = true; if (!byReady) window.__areaRenderedFallbacks = (window.__areaRenderedFallbacks || 0) + 1; done(true); };
  document.fonts.ready.then(() => finish(true));
  const poll = () => {
    if (over) return;
    const late = Date.now() - t0;
    if (late >= 2000) { void document.body.offsetHeight; if (document.fonts.status === "loaded") return finish(false); }
    if (late >= ms) {
      over = true;
      const loading = [...document.fonts].filter(f => f.status === "loading").map(f => f.family + " " + f.weight + " " + f.style);
      fail(new Error("fonts still loading after " + ms + " ms: " + (loading.slice(0, 8).join(", ") || "none listed (document.fonts.ready never resolved)")));
      return;
    }
    setTimeout(poll, 100);
  };
  setTimeout(poll, 100);
}))`;

// The rest state: transitions and animations at their end, no caret, no scrollbars' fade.
const REST_CSS = `*, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important;
  animation-iteration-count: 1 !important; transition-duration: 0s !important; transition-delay: 0s !important;
  caret-color: transparent !important; }`;

export function parseArgs(argv, defaults = {}) {
  const options = { theme: "both", set: {}, png: true, layout: "fit", out: join(OUT, "capture"), edges: false, cap: 700, dist: DIST, slugs: [], ...defaults };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    const next = () => argv[++i];
    if (arg === "--theme") options.theme = next();
    else if (arg === "--set") { const pair = next() ?? ""; const at = pair.indexOf("="); options.set[at < 0 ? pair : pair.slice(0, at)] = at < 0 ? undefined : pair.slice(at + 1); }
    else if (arg === "--families") options.slugs.push(...(next() ?? "").split(",").map(slug => slug.trim()).filter(Boolean));
    else if (arg === "--no-png") options.png = false;
    else if (arg === "--png") options.png = true;
    else if (arg === "--layout") options.layout = next();
    else if (arg === "--out") options.out = resolve(next());
    else if (arg === "--edges") options.edges = true;
    else if (arg === "--cap") options.cap = Number(next());
    else if (arg === "--dist") options.dist = resolve(next());
    else if (arg.startsWith("--")) throw new Error(`Unknown option ${arg}`);
    else options.slugs.push(arg);
  }
  return options;
}

/**
 * Serves a copy of the built app taken at the start, so a build that rewrites apps/desktop/dist mid-run (another
 * session's) cannot change what one run measures. The copy is removed when the server closes.
 */
export async function serveCopy(dist = DIST) {
  const copy = mkdtempSync(join(process.env.AREA_RENDERED_PROFILE_ROOT || tmpdir(), "area-rendered-dist-"));
  cpSync(dist, copy, { recursive: true });
  const server = await serve(copy, 0);
  return { ...server, close: async () => { await server.close(); rmSync(copy, { recursive: true, force: true }); } };
}

/** Opens the Overview in `theme` on a new page, seeded with the view options and any Canvas settings. */
export async function openOverview(browser, url, { theme, set = {}, width = 1440, height = 900 }) {
  const page = await browser.newPage({ width, height, scale: 2 });
  const stored = { "view:components-zoom": "1", "view:components-height": "waterfall" };
  // A Canvas saved before systems becomes the Area system's Default theme on first launch (src/studio.tsx,
  // openSystems); marked as positions and blue's Series lightness so it restores as written.
  if (Object.keys(set).length) stored.canvas = { ...set, positions: 1, series: 3 };
  await page.call("Page.addScriptToEvaluateOnNewDocument", { source: `
    try { localStorage.clear(); localStorage.setItem("area-desktop", ${JSON.stringify(JSON.stringify(stored))}); } catch {}
    document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.dataset.areaRendered = ""; s.textContent = ${JSON.stringify(REST_CSS)}; document.head.append(s); });
  ` });
  await page.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }, { name: "prefers-reduced-motion", value: "reduce" }] });
  await page.goto(`${url}?theme=${theme}#system/area/components`);
  for (let tries = 0; tries < 100; tries++) {
    if (await page.eval(`document.querySelectorAll(".studio-section[id^=family-]").length > 0`, { label: "the Overview's sections", ms: WAIT_MS })) break;
    await wait(100);
  }
  await page.eval(`${FONTS}(${FONTS_MS})`, { label: "fonts after load", ms: WAIT_MS });
  await page.eval(MEASURE, { label: "measure-page.js", ms: WAIT_MS });
  // Every moved setting must have reached the specimens' scope (specimen-scope.tsx writes data-area-<axis> for the
  // values that differ from Area's defaults): the app drops a value it doesn't know without a word.
  const expected = await moved(set);
  if (Object.keys(expected).length) {
    const missing = await page.eval(`(() => {
      const want = ${JSON.stringify(expected)};
      const norm = v => String(v).split(/\s+/).filter(Boolean).sort().join(" ");
      return Object.entries(want).filter(([axis, value]) => {
        if (axis === "contrast" && value === "system") return false;
        const els = [...document.querySelectorAll("[data-area-" + axis + "]")];
        return !els.some(el => norm(el.getAttribute("data-area-" + axis)) === norm(value));
      }).map(([axis, value]) => axis + "=" + value);
    })()`);
    if (missing.length) throw new Error(`${theme}: the app did not apply ${missing.join(", ")} (no element carries data-area-<axis> with that value; was it dropped by restoreCanvas?)`);
  }
  page.theme = theme;
  return page;
}

// Two frames, then a moment for observers and fonts; a page that runs no frames still settles by the timer, and fonts
// that never settle fail the wait, naming them. `page.simulateHang` (AREA_RENDERED_SIMULATE_HANG) makes it never resolve.
export const settle = (page, label = "settle") => page.eval(page.simulateHang ? `new Promise(() => {})` : `new Promise((done, fail) => {
  const end = () => setTimeout(() => ${FONTS}(${FONTS_MS}).then(done, fail), 120);
  const timer = setTimeout(end, 400);
  requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(timer); end(); }));
})`, { label: page.simulateHang ? `${label} (simulated hang)` : label, ms: WAIT_MS });

/** Every family on the Overview, in its order. */
export const familiesOn = page => page.eval(`[...document.querySelectorAll(".studio-section[id^=family-]")].map(s => s.id.slice(7))`, { label: "families on the Overview", ms: WAIT_MS });

/** Opens one family's section in full (Show all) and brings it to the Canvas's top. */
export async function openSection(page, slug) {
  const expected = await page.eval(`(async () => {
    const section = document.getElementById("family-${slug}");
    if (!section) return -1;
    section.scrollIntoView({ block: "start" });
    await new Promise(done => setTimeout(done, 60));
    const toggle = section.querySelector(".studio-overview__more .studio-overview__toggle");
    const count = Number(section.querySelector(".studio-overview__title .area-count, .studio-overview__title .studio-count")?.textContent?.replace(/\\D/g, "")) || 0;
    if (toggle && toggle.getAttribute("aria-expanded") === "false") toggle.click();
    return count;
  })()`, { label: "open the section", ms: WAIT_MS });
  if (expected < 0) return false;
  for (let tries = 0; tries < 100; tries++) {
    const ready = await page.eval(`(() => {
      const section = document.getElementById("family-${slug}");
      const cards = section.querySelectorAll(".gallery-asset").length;
      return { cards, ghosts: section.querySelectorAll(".studio-overview__ghost").length };
    })()`, { label: "the section's cards", ms: WAIT_MS });
    if (ready.ghosts === 0 && (!expected || ready.cards >= expected)) break;
    await wait(50);
  }
  await page.eval(`document.getElementById("family-${slug}").scrollIntoView({ block: "start" })`, { label: "scroll to the section", ms: WAIT_MS });
  await settle(page, "settle the open section");
  return true;
}

export async function closeSection(page, slug) {
  await page.eval(`(() => { const t = document.querySelector("#family-${slug} .studio-overview__more .studio-overview__toggle"); if (t && t.getAttribute("aria-expanded") === "true") t.click(); })()`);
}

/** Per tile, the grey levels (device px) across the left edge of each floating surface, at its vertical middle. */
async function sampleEdges(page, slug, sharp) {
  const targets = await page.eval(`(() => {
    const out = [];
    const sel = ${JSON.stringify(FLOATING.map(entry => entry.selector).join(", "))};
    for (const card of document.querySelectorAll("#family-${slug} .gallery-asset")) {
      const stage = card.querySelector(".gallery-tile__view");
      if (!stage) continue;
      const found = [...stage.querySelectorAll(sel)].filter(el => !el.parentElement.closest(sel));
      found.forEach((el, index) => out.push({ tile: card.id.replace(/^variant-/, ""), index, cls: el.className }));
    }
    return out;
  })()`);
  const results = [];
  for (const target of targets) {
    const rect = await page.eval(`(() => {
      const card = document.getElementById("variant-${target.tile}");
      const sel = ${JSON.stringify(FLOATING.map(entry => entry.selector).join(", "))};
      const el = [...card.querySelector(".gallery-tile__view").querySelectorAll(sel)].filter(el => !el.parentElement.closest(sel))[${target.index}];
      el.scrollIntoView({ block: "center" });
      const r = el.getBoundingClientRect();
      const o = card.querySelector(".gallery-tile").getBoundingClientRect();
      const v = card.querySelector(".gallery-tile__view").getBoundingClientRect();
      const y = r.top + r.height / 2;
      // Only an edge that is drawn where it can be seen: the surface itself just inside it (not covered, not clipped),
      // and the tile's ground 6 px outside it.
      const hit = document.elementFromPoint(r.left + 1, y);
      const seen = r.width >= 16 && r.height >= 8 && y > 0 && y < innerHeight && hit && el.contains(hit) && r.left - 6 >= v.left && r.left + 6 <= v.right;
      return seen ? { x: r.left, y, w: r.width, h: r.height } : null;
    })()`);
    if (!rect) continue;
    // The screenshot draws a fresh frame, so the scroll above is in it.
    const png = await page.shot({ x: Math.round(rect.x) - 6, y: Math.floor(rect.y), width: 12, height: 1 });
    const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const row = [];
    for (let x = 0; x < info.width; x++) { const i = x * info.channels; row.push(Math.round((data[i] + data[i + 1] + data[i + 2]) / 3)); }
    results.push({ tile: target.tile.slice(slug.length + 1), cls: String(target.cls).split(" ")[0], left: Math.round(rect.x) - rect.x, row });
  }
  return results;
}

/** A section's picture: the viewport made tall enough (to 4,000 CSS px), above that slices stitched. */
async function shootSection(page, slug, sharp) {
  const r = await page.eval(`(() => { const s = document.getElementById("family-${slug}"); s.scrollIntoView({ block: "start" }); const r = s.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; })()`);
  const pad = 8, slice = 4000;
  const total = Math.ceil(r.h + pad * 2);
  const { width: w0, height: h0 } = page;
  if (total <= slice) {
    await page.size(w0, Math.max(h0, Math.ceil(r.y + total + 16)));
    await page.eval(`document.getElementById("family-${slug}").scrollIntoView({ block: "start" })`);
    await settle(page);
    const now = await page.eval(`(() => { const r = document.getElementById("family-${slug}").getBoundingClientRect(); return { x: r.left, y: r.top }; })()`);
    const png = await page.shot({ x: now.x - pad, y: now.y - pad, width: r.w + pad * 2, height: total });
    await page.size(w0, h0);
    return png;
  }
  await page.size(w0, slice + 200);
  const parts = [];
  for (let top = 0; top < total; top += slice) {
    await page.eval(`(() => { const s = document.getElementById("family-${slug}"); const body = s.closest(".studio-canvas__body"); s.scrollIntoView({ block: "start" }); body.scrollTop += ${top}; })()`);
    await settle(page);
    const now = await page.eval(`(() => { const r = document.getElementById("family-${slug}").getBoundingClientRect(); return { x: r.left, y: r.top }; })()`);
    const height = Math.min(slice, total - top);
    const y = now.y - pad + top;
    parts.push({ top, png: await page.shot({ x: now.x - pad, y, width: r.w + pad * 2, height }) });
  }
  await page.size(w0, h0);
  const width = Math.round((r.w + pad * 2) * 2);
  const composite = parts.map(part => ({ input: part.png, top: Math.round(part.top * 2), left: 0 }));
  return sharp({ create: { width, height: Math.round(total * 2), channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(composite).png().toBuffer();
}

/** Columns and widths for families cut by their cards (layout "fit"). */
async function fitLayout(page, slug, data) {
  const cut = data.tiles.filter(tile => tile.cutCount > 0 || (tile.stage && tile.stage.w > tile.view.w + 0.5));
  if (!cut.length) return null;
  await page.eval(`(() => { let s = document.getElementById("rendered-columns"); if (!s) { s = document.createElement("style"); s.id = "rendered-columns"; document.head.append(s); } s.textContent = "#family-${slug} .studio-grid { grid-template-columns: 1fr !important; }"; })()`);
  await settle(page);
  let fix = { oneColumn: true };
  let again = await page.eval(`window.areaRendered.section(${JSON.stringify(slug)}, { cap: 1 })`);
  const widest = Math.max(...again.tiles.map(tile => Math.max(tile.stage?.w ?? 0, tile.extent ? tile.extent.x + tile.extent.w : 0) - tile.view.w));
  if (widest > 0.5) {
    const width = Math.ceil(page.width + widest + 48);
    fix.windowWidth = width;
    await page.size(width, page.height);
    await settle(page);
  }
  return fix;
}

const scaleOf = tile => { const n = Number(tile.stage?.scale); return Number.isFinite(n) && n > 0 ? n : 1; };

/**
 * True scale. At zoom 100% the gallery still shrinks a specimen wider than a whole row to its card (gallery/fit.ts), and
 * a shrunk stage's lengths are not the specimen's. So a family with any stage under scale 1 gets a wider window, widened
 * by the shrunk width (twice that in the two-column grid, whose cards take half of it) until every stage is at 1.
 * Resolves to the window width used, or null when none was needed.
 */
async function trueScale(page, slug, cap, layout) {
  let widened = null;
  for (let tries = 0; tries < 6; tries++) {
    const data = await page.eval(`window.areaRendered.section(${JSON.stringify(slug)}, { cap: 1 })`);
    const shrunk = data.tiles.filter(tile => scaleOf(tile) < 0.999);
    if (!shrunk.length) return widened;
    const deficit = Math.max(...shrunk.map(tile => tile.stage.w / scaleOf(tile) - tile.stage.w));
    const width = Math.ceil(page.width + deficit * (layout === "fit" ? 1 : 2) + 48);
    widened = width;
    await page.size(width, page.height);
    await settle(page);
  }
  return widened;
}

/** Every measured stage must be at scale 1: lengths at any other scale are not the specimen's. */
function assertTrueScale(data, theme) {
  const off = data.tiles.filter(tile => !tile.missing && Math.abs(scaleOf(tile) - 1) > 0.001);
  if (off.length) throw new Error(`${theme} ${data.slug}: stage not at scale 1 in ${off.map(tile => `${tile.id} (${tile.stage.scale})`).join(", ")}`);
}

async function clearLayout(page) {
  await page.eval(`document.getElementById("rendered-columns")?.remove()`);
  if (page.width !== 1440) await page.size(1440, page.height);
}

/**
 * One capture at a time per checkout: captures side by side starve the machine (families went from 6–15 s to 100–200 s
 * on 2026-11-18), so a second one fails at once, naming the first. A lock whose process is gone is taken over.
 */
const LOCK = join(OUT, "capture.lock");
function takeLock() {
  mkdirSync(OUT, { recursive: true });
  if (existsSync(LOCK)) {
    const held = JSON.parse(readFileSync(LOCK, "utf8") || "{}");
    let alive = false;
    try { process.kill(held.pid, 0); alive = held.pid !== process.pid; } catch {}
    if (alive) throw new Error(`Another rendered capture is running (pid ${held.pid}, since ${held.since}, ${held.what}). Captures run one at a time; wait for it, or stop it.`);
  }
  writeFileSync(LOCK, JSON.stringify({ pid: process.pid, since: new Date().toISOString(), what: process.argv.slice(1).join(" ") }));
  return () => { try { if (JSON.parse(readFileSync(LOCK, "utf8")).pid === process.pid) rmSync(LOCK); } catch {} };
}

/** Captures `options.slugs` (or every family) in each theme. Resolves to { families, themes, ms }. */
export async function capture(options, log = console.log) {
  const started = Date.now();
  await validateSet(options.set ?? {});
  const release = takeLock();
  try { return await captureLocked(options, log, started); } finally { release(); }
}

// Switches for a runner (docs/DEVELOPMENT.md, Rendered checks › A hung page). RECYCLE moves a few off-tile lengths
// that depend on what the page drew before (a hidden overlay's offset); the others change nothing measured.
//   AREA_RENDERED_SERIAL=1        the themes one after the other instead of side by side (about twice the time)
//   AREA_RENDERED_RECYCLE=<n>     a fresh browser after every n families, so no family is measured in a page that has
//                                 drawn more than n others (0, the default: one page per theme)
//   AREA_RENDERED_STATS=1         per family: time into the run, the page's JS heap and DOM nodes (on when CI is set)
//   AREA_RENDERED_SIMULATE_HANG=<slug>[@<theme>][:<attempts>],…   that family's settle never resolves (in its first
//                                 <attempts> attempts; every attempt by default), to prove the recovery path
//   AREA_RENDERED_WAIT_TIMEOUT    one in-page wait's deadline in ms (30000)
const SERIAL = /^(1|true|yes)$/i.test(process.env.AREA_RENDERED_SERIAL ?? "");
const RECYCLE = Math.max(0, Number(process.env.AREA_RENDERED_RECYCLE) || 0);
const STATS = process.env.AREA_RENDERED_STATS !== undefined ? /^(1|true|yes)$/i.test(process.env.AREA_RENDERED_STATS) : !!process.env.CI;
const HANGS = (process.env.AREA_RENDERED_SIMULATE_HANG ?? "").split(",").map(part => part.trim()).filter(Boolean).map(part => {
  const [, slug, theme, attempts] = part.match(/^([^@:]+)(?:@(light|dark))?(?::(\d+))?$/) ?? [];
  if (!slug) throw new Error(`AREA_RENDERED_SIMULATE_HANG: ${part} is not <slug>[@<theme>][:<attempts>]`);
  return { slug, theme, attempts: attempts ? Number(attempts) : Infinity };
});
const simulated = (slug, theme, attempt) => HANGS.some(h => h.slug === slug && (!h.theme || h.theme === theme) && attempt <= h.attempts);
// Each family is tried this many times, in a fresh browser after a failure, before it is reported as not captured.
const ATTEMPTS = 2;

const mb = bytes => Math.round(bytes / 1048576);

/** One family in one theme on `page`: measured, checked for true scale, written. Resolves to { data, fix }. */
async function captureFamily(page, slug, { theme, options, browser, sharp }) {
  const dir = join(options.out, slug);
  mkdirSync(dir, { recursive: true });
  // A stale file from an earlier run never stands in for a family this run did not capture.
  rmSync(join(dir, `${theme}.json`), { force: true });
  if (options.png) rmSync(join(dir, `${theme}.png`), { force: true });
  await openSection(page, slug);
  const measure = () => page.eval(`window.areaRendered.section(${JSON.stringify(slug)}, { cap: ${options.cap} })`, { label: "measure the section" });
  let data = await measure();
  let fix = null;
  if (options.layout === "fit") {
    fix = await fitLayout(page, slug, data);
    if (fix) data = await measure();
  }
  const windowWidth = await trueScale(page, slug, options.cap, options.layout);
  if (windowWidth) {
    fix = { ...(fix ?? {}), windowWidth };
    data = await measure();
  }
  assertTrueScale(data, theme);
  data.theme = theme;
  data.settings = options.set;
  data.layout = fix ?? {};
  data.browser = browser.version;
  if (options.edges || theme === "dark") data.edges = await sampleEdges(page, slug, sharp);
  if (options.png) writeFileSync(join(dir, `${theme}.png`), await shootSection(page, slug, sharp));
  writeFileSync(join(dir, `${theme}.json`), JSON.stringify(data));
  if (fix) await clearLayout(page);
  await closeSection(page, slug);
  return { data, fix };
}

/**
 * After a failed family: what the page and the server were doing, each question with its own short deadline, so a hung
 * renderer still yields what can be read. Written to <out>/_hangs/<theme>-<slug>-<attempt>.json (and .png when the
 * page can still draw); resolves to the lines to print.
 */
async function diagnose({ page, browser, server, theme, slug, attempt, error, ms, onPage, out }) {
  const facts = { theme, slug, attempt, error: String(error?.message ?? error), label: error?.label, hang: !!error?.hang, at: new Date().toISOString(), seconds: Math.round(ms / 100) / 10, familiesOnPage: onPage };
  const ask = (label, expression, wait) => page.eval(expression, { label, ms: wait }).catch(e => `no answer (${firstLine(e)})`);
  let png = null;
  if (page && browser.alive()) {
    facts.responsive = (await ask("responsive", "true", 5000)) === true;
    if (facts.responsive) {
      facts.state = await ask("page state", `(() => ({
        hash: location.hash, visibility: document.visibilityState, focused: document.hasFocus(), fonts: document.fonts.status,
        loading: [...document.fonts].filter(f => f.status === "loading").map(f => f.family + " " + f.weight + " " + f.style).slice(0, 8),
        animations: document.getAnimations().length, running: document.getAnimations().filter(a => a.playState === "running").length,
        nodes: document.getElementsByTagName("*").length, tilesDrawn: document.querySelectorAll(".studio-section .gallery-asset").length,
        media: [...document.querySelectorAll("video, audio")].map(m => "network " + m.networkState + ", ready " + m.readyState + (m.paused ? ", paused" : ", playing")),
        fontsFallbacks: window.__areaRenderedFallbacks || 0,
      }))()`, 5000);
      facts.timers = await ask("a 50 ms timer", "new Promise(done => setTimeout(() => done(true), 50))", 3000);
      facts.frames = await ask("a frame", "new Promise(done => requestAnimationFrame(() => done(true)))", 3000);
      facts.fontsReady = await ask("document.fonts.ready", "document.fonts.ready.then(() => true)", 3000);
    }
    facts.metrics = await page.metrics(5000).then(m => ({ heapMB: mb(m.JSHeapUsedSize), heapTotalMB: mb(m.JSHeapTotalSize), nodes: m.Nodes, documents: m.Documents, layouts: m.LayoutCount, taskSeconds: Math.round(m.TaskDuration) }), e => `no answer (${firstLine(e)})`);
    png = await page.shot(undefined, { label: "screenshot", ms: 10000 }).catch(() => null);
  } else facts.browser = browser.gone ?? "no page";
  facts.serverInflight = server.inflight().filter(r => r.ms > 2000).slice(0, 12);
  const dir = join(out, "_hangs");
  mkdirSync(dir, { recursive: true });
  const base = join(dir, `${theme}-${slug}-${attempt}`);
  writeFileSync(`${base}.json`, JSON.stringify(facts, null, 1));
  if (png) writeFileSync(`${base}.png`, png);
  const s = facts.state && typeof facts.state === "object" ? facts.state : null;
  const m = facts.metrics && typeof facts.metrics === "object" ? facts.metrics : null;
  return [
    `${theme} ${slug}: attempt ${attempt} of ${ATTEMPTS} failed after ${facts.seconds} s (${onPage} families before it on this page): ${firstLine(error)}`,
    `  page: ${facts.browser ? `browser gone (${facts.browser})` : facts.responsive ? "answers" : "does not answer in 5 s (its main thread is busy or hung)"}` +
      (s ? `; ${s.hash}, ${s.visibility}${s.focused ? ", focused" : ""}, fonts ${s.fonts}${s.loading.length ? ` (loading: ${s.loading.join(", ")})` : ""}, ${s.running}/${s.animations} animations running, ${s.nodes} elements, ${s.tilesDrawn} tiles drawn, ${s.media.length} media, fonts fallbacks ${s.fontsFallbacks}` : "") +
      (facts.responsive ? `; timers ${facts.timers === true ? "fire" : facts.timers}, frames ${facts.frames === true ? "run" : facts.frames}, fonts.ready ${facts.fontsReady === true ? "resolves" : facts.fontsReady}` : ""),
    `  renderer: ${m ? `heap ${m.heapMB}/${m.heapTotalMB} MB, ${m.nodes} nodes, ${m.documents} documents, ${m.layouts} layouts, ${m.taskSeconds} s of tasks` : facts.metrics ?? "n/a"}; server: ${facts.serverInflight.length ? facts.serverInflight.map(r => `${r.path} open ${Math.round(r.ms / 1000)} s (${r.sent} B sent)`).join(", ") : "no response open over 2 s"}`,
    `  details: ${relative(ROOT, base)}.json${png ? " and .png" : ""}`,
  ];
}

async function captureLocked(options, log, started) {
  const sharp = (await import("sharp")).default;
  const server = await serveCopy(options.dist);
  const themes = options.theme === "both" ? ["light", "dark"] : [options.theme];
  rmSync(join(options.out, "_hangs"), { recursive: true, force: true });
  // One browser per theme, run side by side (AREA_RENDERED_SERIAL: one after the other): each page is its browser's
  // only, front tab, so it draws every frame.
  const browsers = new Set();
  const results = {};
  const missing = [];
  let total = 0;
  // A theme that cannot start (no browser, no Overview, a slug not on it) stops the other at once (its browser closes,
  // so its waiting call fails), and both settle before the server closes, so a failed launch never leaves the other
  // browser running. A family that fails is tried again in a fresh browser, and named at the end if it fails again.
  let fatal = null;
  const stop = async error => { if (fatal) return; fatal = error; await Promise.all([...browsers].map(browser => browser.close())); };
  const captureTheme = async theme => {
    let browser = null;
    let page = null;
    let onPage = 0;
    // A fresh browser and page: its own renderer and a page that has drawn nothing yet. (A second browser context in the
    // same guest browser closed the DevTools connection on Edge 157, 2026-11-21, so the browser is started again.)
    const renew = async () => {
      page = null;
      if (browser) { browsers.delete(browser); await browser.close(); }
      browser = null;
      browser = await launch();
      browsers.add(browser);
      if (fatal) throw fatal;
      page = await openOverview(browser, server.url, { theme, set: options.set });
      onPage = 0;
    };
    await renew();
    const all = await familiesOn(page);
    const slugs = options.slugs.length ? options.slugs : all;
    // A slug not on the Overview fails before any family is captured.
    const absent = slugs.filter(slug => !all.includes(slug));
    if (options.strict && absent.length) throw new Error(`not families on the Overview: ${absent.join(", ")} (${all.length} families; see .studio-section ids)`);
    for (const slug of absent) log(`${slug}: not on the Overview`);
    const todo = slugs.filter(slug => all.includes(slug));
    total += todo.length;
    for (let index = 0; index < todo.length; index++) {
      const slug = todo[index];
      try {
        if (RECYCLE && onPage >= RECYCLE) await renew();
        for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
          const t0 = Date.now();
          page.simulateHang = simulated(slug, theme, attempt);
          try {
            const { data, fix } = await captureFamily(page, slug, { theme, options, browser, sharp });
            onPage++;
            (results[slug] ??= {})[theme] = data.tiles.length;
            let stats = "";
            if (STATS) {
              const m = await page.metrics(10000).catch(() => null);
              const fallbacks = await page.eval("window.__areaRenderedFallbacks || 0", { label: "stats", ms: 10000 }).catch(() => "?");
              const open = server.inflight().filter(r => r.ms > 2000).length;
              stats = `; at ${((Date.now() - started) / 1000).toFixed(0)} s, ${onPage} on this page${m ? `, heap ${mb(m.JSHeapUsedSize)} MB, ${m.Nodes} nodes` : ", no metrics"}${fallbacks ? `, fonts fallbacks ${fallbacks}` : ""}${open ? `, ${open} responses open over 2 s` : ""}`;
            }
            if (options.verbose !== false) log(`${theme} ${slug}: ${data.tiles.length} tiles${fix ? ` ${JSON.stringify(fix)}` : ""}${attempt > 1 ? ` (attempt ${attempt})` : ""} (${((Date.now() - t0) / 1000).toFixed(1)} s${stats})`);
            break;
          } catch (error) {
            if (fatal) throw fatal;
            for (const line of await diagnose({ page, browser, server, theme, slug, attempt, error, ms: Date.now() - t0, onPage, out: options.out })) log(line);
            if (attempt === ATTEMPTS) missing.push({ theme, slug, error: firstLine(error) });
            await renew();
            if (attempt < ATTEMPTS) log(`${theme} ${slug}: trying again in a fresh browser`);
          }
        }
      } catch (error) {
        if (fatal) throw fatal;
        // No fresh page or browser could be had: this theme's remaining families are not captured.
        const rest = todo.slice(index).filter(slug => !missing.some(entry => entry.theme === theme && entry.slug === slug));
        for (const slug of rest) missing.push({ theme, slug, error: `not reached: ${firstLine(error)}` });
        log(`${theme}: stopped, ${rest.length} families not reached (${firstLine(error)})`);
        return;
      }
    }
    await page.close();
  };
  try {
    const run = theme => captureTheme(theme).catch(stop);
    if (SERIAL) { for (const theme of themes) { await run(theme); if (fatal) break; } }
    else await Promise.allSettled(themes.map(run));
    if (fatal) throw fatal;
  } finally {
    await Promise.all([...browsers].map(browser => browser.close()));
    await server.close();
  }
  // Never a pass with a family missing: every family not captured, in either theme, is named.
  if (missing.length) {
    const names = missing.map(entry => `${entry.theme} ${entry.slug}`);
    throw new Error(`${missing.length} of ${total} family captures not made (each tried ${ATTEMPTS} times): ${names.join(", ")}\n${missing.map(entry => `  ${entry.theme} ${entry.slug}: ${entry.error}`).join("\n")}\n  details: ${relative(ROOT, join(options.out, "_hangs"))}`);
  }
  return { families: results, themes, ms: Date.now() - started };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  if (Object.keys(options.set).length) console.log(`settings: ${describe(options.set)}`);
  const { families, ms } = await capture(options);
  console.log(`${Object.keys(families).length} families in ${(ms / 1000).toFixed(1)} s → ${options.out}`);
}
