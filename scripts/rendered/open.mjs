// Opens the overlays the Overview shows closed, and captures each tile with what opened. Where a tile shows only a
// closed trigger (aria-expanded="false"), the trigger is pressed with a real DevTools mouse event (a right-click for
// Context menu, a hover for a tooltip trigger), then the tile and its overlay are captured as
// <out>/<slug>/open-<tile>-<theme>.png and measured into open-<tile>-<theme>.json (relative to the tile's frame).
// The pointer then leaves for the window's corner, so no row shows hover (a tooltip keeps it on its trigger).
//   node scripts/rendered/open.mjs [--theme light|dark|both] [--set axis=value] [--out <dir>] <slug>[/<tile>] …
// Limits: native popups (a <select>'s list, a date input's calendar) are drawn by the OS and are not captured.
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { launch } from "./cdp-lib.mjs";
import { closeSection, openOverview, openSection, parseArgs, serveCopy, settle } from "./capture.mjs";

const OVERLAYS = ":popover-open, dialog[open], [role=menu], [role=listbox], [role=dialog], [role=alertdialog], [role=tooltip], .area-popover, .area-menu, .area-tooltip, .area-hover-card";

/** The tile's first closed trigger, how to press it, and its centre; or null. */
const findTrigger = (page, key) => page.eval(`(() => {
  const card = document.getElementById("variant-${key}");
  const view = card?.querySelector(".gallery-tile__view");
  if (!view) return null;
  // Everything already open is marked, so only what the press opens is measured.
  // (only what shows: a closed popup that stays in the document is not marked, so it counts once it opens).
  for (const el of document.querySelectorAll(${JSON.stringify(OVERLAYS)})) {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    if (r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && Number(cs.opacity) > 0) el.dataset.renderedBefore = "";
  }
  const context = view.querySelector(".area-context-menu");
  let el = view.querySelector('[aria-expanded="false"]'), how = "click";
  if (context && !el) { el = context.firstElementChild ?? context; how = "context"; }
  if (!el) { const tip = view.querySelector(".area-tooltip"); if (tip && tip.parentElement) { el = tip.parentElement.querySelector("button, a, [tabindex]") ?? tip.parentElement; how = "hover"; } }
  if (!el) return null;
  el.scrollIntoView({ block: "center" });
  const r = (el.getBoundingClientRect().width ? el : el.firstElementChild ?? el).getBoundingClientRect();
  return { how, x: r.left + r.width / 2, y: r.top + r.height / 2 };
})()`);

const opened = (page, key) => page.eval(`(() => {
  const card = document.getElementById("variant-${key}");
  const found = [...document.querySelectorAll(${JSON.stringify(OVERLAYS)})].filter(el => !("renderedBefore" in el.dataset))
    .filter(el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && Number(cs.opacity) > 0; });
  const top = found.filter(el => !found.some(other => other !== el && other.contains(el)));
  const o = card.getBoundingClientRect();
  let box = { l: o.left, t: o.top, r: o.right, b: o.bottom };
  const overlays = top.map(el => { const r = el.getBoundingClientRect(); box = { l: Math.min(box.l, r.left), t: Math.min(box.t, r.top), r: Math.max(box.r, r.right), b: Math.max(box.b, r.bottom) }; return window.areaRendered.overlay(el, card); });
  for (const el of document.querySelectorAll("[data-rendered-before]")) delete el.dataset.renderedBefore;
  return { overlays, box };
})()`);

export async function openAll(options, log = console.log) {
  const sharp = (await import("sharp")).default;
  const server = await serveCopy(options.dist);
  const themes = options.theme === "both" ? ["light", "dark"] : [options.theme];
  const browsers = [];
  let count = 0;
  try {
    await Promise.all(themes.map(async theme => {
      const browser = await launch();
      browsers.push(browser);
      let page = await openOverview(browser, server.url, { theme, set: options.set });
      for (const target of options.slugs) {
        const [slug, only] = target.split("/");
        if (!(await openSection(page, slug))) { log(`${slug}: not on the Overview`); continue; }
        const tiles = await page.eval(`[...document.querySelectorAll("#family-${slug} .gallery-asset")].map(card => card.id.replace(/^variant-/, ""))`);
        for (const key of tiles) {
          const tile = key.slice(slug.length + 1);
          if (only && tile !== only) continue;
          const trigger = await findTrigger(page, key);
          if (!trigger) continue;
          await page.mouse("mouseMoved", trigger.x, trigger.y);
          if (trigger.how === "click" || trigger.how === "context") {
            const button = trigger.how === "context" ? "right" : "left";
            await page.mouse("mousePressed", trigger.x, trigger.y, { button, clickCount: 1 });
            await page.mouse("mouseReleased", trigger.x, trigger.y, { button, clickCount: 1 });
          }
          await settle(page);
          if (trigger.how !== "hover") { await page.mouse("mouseMoved", page.width - 1, page.height - 1); await settle(page); }
          const { overlays, box } = await opened(page, key);
          if (!overlays.length) { log(`${theme} ${slug}/${tile}: nothing opened`); }
          else {
            const pad = 8;
            const clip = { x: Math.max(0, box.l - pad), y: Math.max(0, box.t - pad), width: box.r - box.l + pad * 2, height: box.b - box.t + pad * 2 };
            const dir = join(options.out, slug);
            mkdirSync(dir, { recursive: true });
            writeFileSync(join(dir, `open-${tile}-${theme}.png`), await page.shot(clip));
            writeFileSync(join(dir, `open-${tile}-${theme}.json`), JSON.stringify({ slug, tile, theme, how: trigger.how, overlays }));
            count++;
            log(`${theme} ${slug}/${tile}: ${trigger.how}, ${overlays.length} overlay${overlays.length === 1 ? "" : "s"}`);
          }
          // Close: Escape, then the pointer away; a page that keeps something open is reloaded.
          await page.call("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
          await page.call("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
          await page.mouse("mouseMoved", page.width - 1, page.height - 1);
          await settle(page);
          const left = await page.eval(`document.querySelectorAll(":popover-open, dialog[open]").length`);
          const away = await page.eval(`!location.hash.endsWith("/components")`);
          if (left || away) {
            await page.close();
            page = await openOverview(browser, server.url, { theme, set: options.set });
            await openSection(page, slug);
          }
        }
        await closeSection(page, slug);
      }
      await page.close();
    }));
  } finally {
    await Promise.all(browsers.map(browser => browser.close()));
    await server.close();
  }
  return count;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  if (!options.slugs.length) { console.error("Name one or more families: open.mjs menu combobox/default"); process.exit(1); }
  const count = await openAll(options);
  console.log(`${count} overlay captures → ${options.out}`);
}
