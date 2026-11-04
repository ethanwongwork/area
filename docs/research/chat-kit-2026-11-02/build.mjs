// Builds the Chat Kit artifact: Labs › Chat as the app renders it (a snapshot captured from the running app with
// ../feed-kit-2026-11-01/capture.cjs), inside Area's own CSS (dist/area.css and the app's styles), the fonts embedded. The
// page's Width switch sets the chat's width as the app's does (--_chat-width on each section's container), so container
// rules (the bubble, the composer, the chart's columns, the cards across) answer to it live.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [dist, outFile] = process.argv.slice(2);
const here = new URL(".", import.meta.url).pathname;
const snap = JSON.parse(readFileSync(process.argv[4], "utf8"));

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

let body = snap.body;
// The app's own pictures (David Tee's avatar) come from the local server in the snapshot; inline them from dist.
const types = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", svg: "image/svg+xml", webp: "image/webp" };
body = body.replace(/src="https?:\/\/(?:localhost|127\.0\.0\.1):\d+\/(images\/[^"?#]+)"/g, (_, file) => `src="${dataUri(join(dist, file), types[file.split(".").pop()] ?? "application/octet-stream")}"`);
if (/src="https?:\/\/(localhost|127\.0\.0\.1)/.test(body)) console.warn("a local image was left");
// A lazy image never loads in a page this long before it nears the view; these are inline, so load them at once.
body = body.replace(/\sloading="lazy"/g, "");

const groups = snap.sections.map(([id, title]) => [title, id]).concat([["Width rules", "chat-rules"]]);
// The research's answer, in the kit's own Table (Area's markup and classes), after the kit's sections.
const RULES = [
  ["Type", "Same at every width", "The references keep their chat size (14 to 16, lines 1.4 to 1.6) in a panel and a wide column alike"],
  ["Spacing", "Same at every width", "Follows the type: a quarter of the size, 0.75em, or half a line"],
  ["Column", "Changes", "768 reading, 456 split, the panel's width; centred at its cap"],
  ["Gutter", "Changes", "16 to 0 beside other work; 32 to 16 under 560"],
  ["Person's bubble", "Changes", "Area: max(70%, min(100% − 48, 456)); 538 / 408 / 220"],
  ["Tables and code", "Scroll", "Never reflow; they scroll inside their frame at every width"],
  ["Cards across", "Changes", "Two across while each keeps ~200; one across a panel"],
  ["Labels on controls", "Give way", "A picker's words cut short before the send leaves the composer"],
];
const rules = `<section class="studio-section" id="chat-rules" aria-labelledby="chat-rules-title">
  <div class="area-section-heading studio-section-heading"><h2 class="area-section-heading__title" id="chat-rules-title">Width rules</h2></div>
  <div class="area-table-wrapper studio-table" data-area-stroke="2"><table class="area-table area-table--md area-table--fixed" aria-label="Width rules">
    <thead><tr><th scope="col">Part</th><th scope="col">With the width</th><th scope="col">Measured</th></tr></thead>
    <tbody>${RULES.map(([part, verdict, detail]) => `<tr><td>${part}</td><td>${verdict}</td><td class="studio-muted">${detail}</td></tr>`).join("")}</tbody>
  </table></div>
</section>`;
body = body.replace(/(<\/section>)(\s*<\/div>\s*<\/div>\s*)$/, "$1" + rules + "$2");
if (!body.includes('id="chat-rules"')) console.warn("rules section not placed");
const WIDTHS = [["panel", "Panel", 268], ["split", "Split", 456], ["column", "Column", 768]];
const attrs = JSON.stringify(snap.html.filter(([name]) => name.startsWith("data-area-") && name !== "data-area-theme"));

const page = `<title>Area Chat Kit</title>
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
.kit-bar__widths { display: flex; gap: var(--area-space-2); flex: none; }
.kit-bar__widths button { border: 0; }
.kit-bar__widths button span { color: var(--kit-muted); font-variant-numeric: tabular-nums; margin-inline-start: var(--area-space-4); }
.kit-bar__widths button[aria-pressed="true"] { background: var(--kit-plate); color: var(--kit-fg); }
@media (max-width: 720px) { .kit-bar { flex-wrap: wrap; } .kit-bar__groups { order: 3; flex-basis: 100%; } .kit-bar__widths button span { display: none; } }
.kit .studio-chatkit__frame { max-inline-size: 100%; }
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
    <div class="kit-bar__name">Chat kit <span>Area · Labs</span></div>
    <div class="kit-bar__widths" role="group" aria-label="Width">${WIDTHS.map(([id, label, px]) => `<button type="button" data-width="${id}" data-px="${px}" aria-pressed="${id === "column"}">${label} <span>${px}</span></button>`).join("")}</div>
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
  const fit = () => document.querySelectorAll(".ss-frame").forEach(frame => {
    const zoom = frame.querySelector(".af-zoom");
    if (zoom && frame.clientWidth) zoom.style.setProperty("--af-fit", String(Math.max(frame.clientWidth / 1920, frame.clientHeight / 1080)));
  });
  fit();
  new ResizeObserver(fit).observe(document.querySelector(".kit .studio-feed"));
  document.querySelectorAll(".ss-frame").forEach(frame => new ResizeObserver(fit).observe(frame));
  // The Width switch: each section's chat at the chosen width, as the app's Canvas bar sets it.
  const widths = document.querySelectorAll(".kit-bar__widths button");
  const setWidth = button => {
    widths.forEach(other => other.setAttribute("aria-pressed", String(other === button)));
    document.querySelectorAll(".studio-chatkit__frame").forEach(frame => { frame.dataset.width = button.dataset.width; frame.style.setProperty("--_chat-width", button.dataset.px + "px"); });
    try { localStorage.setItem("chat-kit-width", button.dataset.width); } catch (e) {}
    fit();
  };
  widths.forEach(button => button.addEventListener("click", () => setWidth(button)));
  let saved = null; try { saved = localStorage.getItem("chat-kit-width"); } catch (e) {}
  const start = [...widths].find(button => button.dataset.width === saved);
  if (start) setWidth(start);
  // The snapshot is a still: links and buttons in it go nowhere.
  document.querySelector(".kit .studio-canvas__body").addEventListener("click", event => { if (event.target.closest("a")) event.preventDefault(); });
})();
</script>
`;
writeFileSync(outFile, page);
console.log("wrote", outFile, (page.length / 1e6).toFixed(2), "MB");
