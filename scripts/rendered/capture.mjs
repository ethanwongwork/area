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
import { join, resolve } from "node:path";
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
    if (await page.eval(`document.querySelectorAll(".studio-section[id^=family-]").length > 0`)) break;
    await wait(100);
  }
  await page.eval(`document.fonts.ready.then(() => true)`);
  await page.eval(MEASURE);
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

// Two frames, then a moment for observers and fonts; a page that runs no frames still settles by the timer.
export const settle = page => page.eval(`new Promise(done => {
  const end = () => setTimeout(() => document.fonts.ready.then(() => done(true)), 120);
  const timer = setTimeout(end, 400);
  requestAnimationFrame(() => requestAnimationFrame(() => { clearTimeout(timer); end(); }));
})`);

/** Every family on the Overview, in its order. */
export const familiesOn = page => page.eval(`[...document.querySelectorAll(".studio-section[id^=family-]")].map(s => s.id.slice(7))`);

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
  })()`);
  if (expected < 0) return false;
  for (let tries = 0; tries < 100; tries++) {
    const ready = await page.eval(`(() => {
      const section = document.getElementById("family-${slug}");
      const cards = section.querySelectorAll(".gallery-asset").length;
      return { cards, ghosts: section.querySelectorAll(".studio-overview__ghost").length };
    })()`);
    if (ready.ghosts === 0 && (!expected || ready.cards >= expected)) break;
    await wait(50);
  }
  await page.eval(`document.getElementById("family-${slug}").scrollIntoView({ block: "start" })`);
  await settle(page);
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

async function captureLocked(options, log, started) {
  const sharp = (await import("sharp")).default;
  const server = await serveCopy(options.dist);
  const themes = options.theme === "both" ? ["light", "dark"] : [options.theme];
  // One browser per theme, run side by side: each page is its browser's only, front tab, so it draws every frame.
  const browsers = [];
  const results = {};
  try {
    await Promise.all(themes.map(async theme => {
      const browser = await launch();
      browsers.push(browser);
      const page = await openOverview(browser, server.url, { theme, set: options.set });
      const all = await familiesOn(page);
      const slugs = options.slugs.length ? options.slugs : all;
      // A slug not on the Overview fails before any family is captured.
      const absent = slugs.filter(slug => !all.includes(slug));
      if (options.strict && absent.length) throw new Error(`not families on the Overview: ${absent.join(", ")} (${all.length} families; see .studio-section ids)`);
      for (const slug of slugs) {
        if (!all.includes(slug)) {
          if (options.strict) throw new Error(`${slug}: not a family on the Overview (families: ${all.join(", ")})`);
          log(`${slug}: not on the Overview`); continue;
        }
        const t0 = Date.now();
        await openSection(page, slug);
        let data = await page.eval(`window.areaRendered.section(${JSON.stringify(slug)}, { cap: ${options.cap} })`);
        let fix = null;
        if (options.layout === "fit") {
          fix = await fitLayout(page, slug, data);
          if (fix) data = await page.eval(`window.areaRendered.section(${JSON.stringify(slug)}, { cap: ${options.cap} })`);
        }
        const windowWidth = await trueScale(page, slug, options.cap, options.layout);
        if (windowWidth) {
          fix = { ...(fix ?? {}), windowWidth };
          data = await page.eval(`window.areaRendered.section(${JSON.stringify(slug)}, { cap: ${options.cap} })`);
        }
        assertTrueScale(data, theme);
        data.theme = theme;
        data.settings = options.set;
        data.layout = fix ?? {};
        data.browser = browser.version;
        if (options.edges || theme === "dark") data.edges = await sampleEdges(page, slug, sharp);
        const dir = join(options.out, slug);
        mkdirSync(dir, { recursive: true });
        if (options.png) writeFileSync(join(dir, `${theme}.png`), await shootSection(page, slug, sharp));
        writeFileSync(join(dir, `${theme}.json`), JSON.stringify(data));
        if (fix) await clearLayout(page);
        await closeSection(page, slug);
        (results[slug] ??= {})[theme] = data.tiles.length;
        if (options.verbose !== false) log(`${theme} ${slug}: ${data.tiles.length} tiles${fix ? ` ${JSON.stringify(fix)}` : ""} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
      }
      await page.close();
    }));
  } finally {
    await Promise.all(browsers.map(browser => browser.close()));
    await server.close();
  }
  return { families: results, themes, ms: Date.now() - started };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  if (Object.keys(options.set).length) console.log(`settings: ${describe(options.set)}`);
  const { families, ms } = await capture(options);
  console.log(`${Object.keys(families).length} families in ${(ms / 1000).toFixed(1)} s → ${options.out}`);
}
