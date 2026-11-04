// Builds the Feed Kit artifact: Labs › Feed as the app renders it (snapshot.json, captured from the running app), inside
// Area's own CSS (dist/area.css and the app's styles), with the fonts embedded and drawn art in place of saved images.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [dist, outFile] = process.argv.slice(2);
const here = new URL(".", import.meta.url).pathname;
const snap = JSON.parse(readFileSync(process.argv[4] ?? join(here, "snapshot.json"), "utf8"));

const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString("base64")}`;
let area = readFileSync(join(dist, "area.css"), "utf8")
  .replace(/url\("https:\/\/cdn\.jsdelivr\.net\/npm\/geist@[^"]*\/Geist-Variable\.woff2"\)/, `url("${dataUri(join(dist, "fonts/geist/Geist-Variable.woff2"), "font/woff2")}")`)
  .replace(/url\("https:\/\/cdn\.jsdelivr\.net\/npm\/geist@[^"]*\/GeistMono-Variable\.woff2"\)/, `url("${dataUri(join(dist, "fonts/geist-mono/GeistMono-Variable.woff2"), "font/woff2")}")`);
if (/cdn\.jsdelivr/.test(area)) throw new Error("a font URL was left");

// The app's stylesheet, its imports inlined in their layers (the typeface library's faces left out: none is used here).
let studio = "";
for (const line of readFileSync(join(dist, "studio.css"), "utf8").split("\n")) {
  const m = line.match(/^@import url\("([^"]+)"\)( layer\(studio\))?;/);
  if (!m) { if (/^@layer/.test(line)) studio += line + "\n"; continue; }
  if (m[1].includes("typefaces.css")) continue;
  const css = readFileSync(join(dist, m[1]), "utf8");
  studio += m[2] ? `@layer studio {\n${css}\n}\n` : css + "\n";
}
// The Materials lab's portrait (not in the feed) is the only file the app's CSS points at.
studio = studio.replace(/url\("images\/david-tee\.jpg"\)/g, "none");
const stray = [...studio.matchAll(/url\((?!["']?data:)([^)]*)\)/g)].map(m => m[1]);
if (stray.length) console.warn("non-data urls:", stray.slice(0, 5));

// The typeface library's faces the snapshot draws (a tester's options, a paragraph card), each face's Latin files only,
// inlined; the library's other hundred faces are left out.
const usedFaces = new Set([...snap.body.matchAll(/area-face-([a-z0-9-]+)/g)].map(m => m[1]));
let faces = "";
for (const rule of readFileSync(join(dist, "styles/typefaces.css"), "utf8").match(/@font-face\s*\{[^}]*\}/g) ?? []) {
  const family = rule.match(/font-family:\s*"area-face-([a-z0-9-]+)"/)?.[1];
  const file = rule.match(/url\("\.\.\/(fonts\/[^"]+)"\)/)?.[1];
  if (!family || !file || !usedFaces.has(family) || /cyrillic|greek|vietnamese|-ext-/.test(file)) continue;
  faces += rule.replace(/url\("[^"]+"\)/, `url("${dataUri(join(dist, file), "font/woff2")}")`) + "\n";
}
console.log("faces:", [...usedFaces].join(", "), (faces.length / 1e6).toFixed(2), "MB");

// Drawn art for the saved-image slots (the owner's library stays out of a shared page).
const svg = (w, h, body) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
const artSource = readFileSync(join(here, "art.txt"), "utf8");
const art = new Function("svg", artSource + "\nreturn art;")(svg);
let body = snap.body.replace(/<img([^>]*?)data-kit-art="(\d+)"([^>]*)>/g, (_, a, n, b) => {
  const piece = art[Number(n) % art.length];
  return `<img${a}src="${piece.src}" alt="${piece.name}"${b.replace(/\salt="[^"]*"/, "")}>`;
});
// A lazy image never loads in a page this long before it nears the view; these are inline, so load them at once.
body = body.replace(/\sloading="lazy"/g, "");

const groups = [
  ["Questions", "feed-questions"], ["Chat", "feed-chat"], ["Text", "feed-prose"], ["Type", "feed-tester"], ["Color", "feed-colors"], ["Foundations", "feed-scale"], ["Icons", "feed-glyphs"],
  ["Components", "feed-specimens"], ["Designs", "feed-screens"], ["Images", "feed-collections"], ["Data", "feed-table"],
  ["Code and settings", "feed-code"], ["Activity", "feed-timeline"],
];
const attrs = JSON.stringify(snap.html.filter(([name]) => name.startsWith("data-area-") && name !== "data-area-theme"));

const page = `<title>Area Feed Kit</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
${area}
</style>
<style>
${studio}
</style>
<style>
${faces}
</style>
<style>
/* The page around the snapshot: Area's own tokens (the snapshot carries the app's settings on <html>), the app's chrome
   for the bar. Layout: one sticky bar of the kit's groups over the feed, as the app's Canvas bar over its body. */
:root {
  --kit-bg: var(--area-bg-page, #fff);
  --kit-fg: var(--area-fg-default, #1c1c1c);
  --kit-muted: var(--area-fg-muted, #6b6b6b);
  --kit-rule: var(--area-border-decorative, #e6e6e6);
  --kit-plate: var(--area-bg-component-hover, #f2f2f2);
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --kit-bg: var(--area-bg-page, #0b0b0c); --kit-fg: var(--area-fg-default, #f0f0f0); --kit-muted: var(--area-fg-muted, #a8a8a8); --kit-rule: var(--area-border-decorative, #2a2a2a); --kit-plate: var(--area-bg-component-hover, #1c1c1c); color-scheme: dark; } }
:root[data-theme="dark"] { --kit-bg: var(--area-bg-page, #0b0b0c); --kit-fg: var(--area-fg-default, #f0f0f0); --kit-muted: var(--area-fg-muted, #a8a8a8); --kit-rule: var(--area-border-decorative, #2a2a2a); --kit-plate: var(--area-bg-component-hover, #1c1c1c); color-scheme: dark; }
html, body { block-size: auto; overflow: visible; }
body { background: var(--kit-bg); color: var(--kit-fg); font-family: var(--area-font-sans); font-size: var(--area-ui-size); line-height: var(--area-ui-leading); }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--kit-bg); }
.studio.kit { display: block; block-size: auto; overflow: visible; }
.kit .studio-canvas__body {
  overflow: visible; min-block-size: 0;
  padding-block: var(--_canvas-margin);
  padding-left: max(var(--_canvas-margin), env(safe-area-inset-left, 0px));
  padding-right: max(var(--_canvas-margin), env(safe-area-inset-right, 0px));
}
.kit .studio-section { scroll-margin-block-start: calc(var(--_studio-bar) + var(--_canvas-margin) + env(safe-area-inset-top, 0px)); }
@media (max-width: 560px) { .studio.kit { --_canvas-margin: 16px; } }
.kit-bar {
  position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5;
  display: flex; align-items: center; gap: var(--area-space-12);
  min-block-size: var(--_studio-bar);
  padding-block: var(--area-space-6);
  padding-left: max(var(--_canvas-margin), env(safe-area-inset-left, 0px));
  padding-right: max(var(--_canvas-margin), env(safe-area-inset-right, 0px));
  background: var(--kit-bg); border-block-end: var(--area-border-width) solid var(--kit-rule);
}
.kit-bar__name { flex: none; font-weight: var(--area-weight-strong); white-space: nowrap; padding-inline-start: var(--_text-inset); }
.kit-bar__name span { color: var(--kit-muted); font-weight: var(--area-weight-regular); }
.kit-bar__groups { display: flex; gap: var(--area-space-2); min-inline-size: 0; overflow-x: auto; scrollbar-width: none; margin-inline-end: auto; }
.kit-bar__groups::-webkit-scrollbar { display: none; }
.kit-bar a, .kit-bar button {
  flex: none; display: inline-flex; align-items: center; block-size: var(--area-control-sm); padding-inline: var(--area-space-8);
  border: 0; border-radius: var(--area-radius-control); background: transparent; color: var(--kit-muted);
  font: inherit; font-size: var(--area-ui-size); text-decoration: none; white-space: nowrap; cursor: pointer;
}
.kit-bar a:hover, .kit-bar button:hover { background: var(--kit-plate); color: var(--kit-fg); }
.kit-bar a:focus-visible, .kit-bar button:focus-visible { outline: var(--area-focus-width) solid var(--area-focus-color); outline-offset: var(--area-focus-gap); }
.kit-bar button { flex: none; border: var(--area-border-width) solid var(--kit-rule); color: var(--kit-fg); }
@media (max-width: 560px) { .kit-bar__name span { display: none; } }
/* The Canvas's widths (owner, 2026-11-04: "apply the proper min and max widths"): the feed between the least Canvas the
   app gives it (a 960 window with both panels open, 960 - 240 - 296 = 424), the typical (a 1440 window with both panels,
   904) and the most this kit shows (a 1440 window with the panels closed); narrower windows (a phone) keep the 16 margin. */
.kit .studio-feed { inline-size: min(100%, var(--kit-feed, 1440px)); margin-inline: auto; transition: inline-size 0s; }
.kit-bar__widths { display: flex; gap: var(--area-space-2); flex: none; }
.kit-bar__widths button { border: 0; }
.kit-bar__widths button span { color: var(--kit-muted); font-variant-numeric: tabular-nums; margin-inline-start: var(--area-space-4); }
.kit-bar__widths button[aria-pressed="true"] { background: var(--kit-plate); color: var(--kit-fg); }
@media (max-width: 720px) { .kit-bar { flex-wrap: wrap; } .kit-bar__groups { order: 3; flex-basis: 100%; } .kit-bar__widths button span { display: none; } }
</style>
<script>
(() => {
  const root = document.documentElement;
  for (const [name, value] of ${attrs}) root.setAttribute(name, value);
  const dark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const paint = () => {
    const mode = dark() ? "dark" : "light";
    root.setAttribute("data-area-theme", mode);
    document.querySelectorAll(".kit [data-area-theme]").forEach(el => el.setAttribute("data-area-theme", mode));
    const toggle = document.getElementById("kit-theme");
    if (toggle) toggle.textContent = mode === "dark" ? "Light" : "Dark";
  };
  window.__kitPaint = paint;
  paint();
  new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paint);
})();
</script>
<div class="studio kit">
  <header class="kit-bar">
    <div class="kit-bar__name">Feed kit <span>Area · Labs</span></div>
    <div class="kit-bar__widths" role="group" aria-label="Width">${[["least", "Least", 424], ["typical", "Typical", 904], ["most", "Most", 1440]].map(([id, label, px]) => `<button type="button" data-width="${id}" data-px="${px}" aria-pressed="${id === "most"}">${label} <span>${px}</span></button>`).join("")}</div>
    <nav class="kit-bar__groups" aria-label="Groups">${groups.map(([label, id]) => `<a href="#${id}">${label}</a>`).join("")}</nav>
    <button type="button" id="kit-theme">Dark</button>
  </header>
  ${body}
</div>
<script>
(() => {
  const root = document.documentElement;
  document.getElementById("kit-theme").addEventListener("click", () => {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
  });
  window.__kitPaint();
  // A screen is drawn at 1920 x 1080 and scaled to its card, covering it from the top-left, as the app does.
  // A visual question's frame opened at a zoom on a part (data-zoomed) keeps the zoom it was captured at.
  const fit = () => document.querySelectorAll(".ss-frame:not([data-zoomed] .ss-frame)").forEach(frame => {
    const zoom = frame.querySelector(".af-zoom");
    if (zoom && frame.clientWidth) zoom.style.setProperty("--af-fit", String(Math.max(frame.clientWidth / 1920, frame.clientHeight / 1080)));
  });
  fit();
  new ResizeObserver(fit).observe(document.querySelector(".kit .studio-feed"));
  // The type tester (src/type-kit.tsx) without React: its controls are Area's native inputs, and its preview is drawn from
  // custom properties, so each control writes its property and redraws its own bar, as the app's state does.
  const PROPERTY = { size: v => ["--tt-size", v + "px"], weight: v => ["--tt-weight", String(v)], width: v => ["--tt-width", v + "%"],
    leading: v => ["--tt-leading", String(v)], tracking: v => ["--tt-tracking", v / 100 + "em"] };
  document.querySelectorAll("[data-tester]").forEach(tester => {
    const sample = tester.querySelector(".studio-tester__sample");
    tester.querySelectorAll(".studio-tester__control[data-tt]").forEach(control => {
      const name = control.dataset.tt, range = control.querySelector("input[type=range]");
      const field = control.querySelector("input:not([type=range])");
      // A typed value lands on the bar's nearest step, as the app's field does.
      if (range && field) {
        const commit = () => {
          const number = Number((field.value.match(/-?\d+(\.\d+)?/) || [])[0]);
          if (Number.isFinite(number)) { range.value = String(Math.min(Number(range.max), Math.max(Number(range.min), number))); }
          range.dispatchEvent(new Event("input"));
        };
        field.addEventListener("change", commit);
        field.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); commit(); field.select(); } });
      }
      if (range && PROPERTY[name]) range.addEventListener("input", () => {
        const value = Number(range.value), min = Number(range.min), max = Number(range.max), ratio = (value - min) / (max - min);
        const bar = range.closest(".area-slider");
        bar.style.setProperty("--_pct", ratio * 100 + "%");
        bar.style.setProperty("--_slider-ratio", String(ratio));
        const shown = bar.querySelector(".area-slider__value");
        const text = value.toFixed(Number(control.dataset.places || 0)) + (control.dataset.unit || "");
        if (shown) shown.textContent = text;
        // The Inspector's value field beside the bar (inspector-rows.tsx BarRow) shows the same.
        if (field && document.activeElement !== field) field.value = text;
        const [property, css] = PROPERTY[name](value);
        sample.style.setProperty(property, css);
      });
      const select = control.querySelector("select");
      // The style: its weight and whether it is italic.
      if (select && name === "style") select.addEventListener("change", () => {
        const option = select.selectedOptions[0];
        sample.style.setProperty("--tt-weight", option.dataset.weight);
        sample.style.setProperty("--tt-style", "italic" in option.dataset ? "italic" : "normal");
      });
      // The typeface: its family, and the width bar only where the face has a width axis.
      if (select && name === "face") select.addEventListener("change", () => {
        const option = select.selectedOptions[0];
        sample.style.fontFamily = option.dataset.family;
        const width = tester.querySelector('[data-tt="width"]');
        if (width) width.hidden = !("wdth" in option.dataset);
      });
    });
  });
  // The Width switch: the feed at the Canvas's least, typical or most width.
  const widths = document.querySelectorAll(".kit-bar__widths button");
  const setWidth = button => {
    widths.forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    document.documentElement.style.setProperty("--kit-feed", button.dataset.px + "px");
    try { localStorage.setItem("feed-kit-width", button.dataset.width); } catch (e) {}
    requestAnimationFrame(fit);
  };
  widths.forEach(button => button.addEventListener("click", () => setWidth(button)));
  let saved = null; try { saved = localStorage.getItem("feed-kit-width"); } catch (e) {}
  const start = [...widths].find(button => button.dataset.width === saved);
  if (start) setWidth(start);
  // The snapshot is a still: links and buttons in it go nowhere.
  document.querySelector(".kit .studio-canvas__body").addEventListener("click", event => { if (event.target.closest("a")) event.preventDefault(); });
})();
</script>
`;
writeFileSync(outFile, page);
console.log("wrote", outFile, (page.length / 1e6).toFixed(2), "MB");
