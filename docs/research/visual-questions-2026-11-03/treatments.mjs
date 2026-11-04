// Builds the Answer Treatments artifact (owner, 2026-11-04: "explore the actual answer cards have visible backplates or
// strokes … what the answer box would look like just on the page surface without a container … all the types of visual
// treatments through a few chat question examples … try to not use dividers"). Real question cards from a Labs › Chat
// snapshot (../feed-kit-2026-11-01/capture.cjs), in Area's own CSS, each under a treatment written as Area tokens only.
//   node docs/research/visual-questions-2026-11-03/treatments.mjs apps/desktop/dist <out.html> <chat-snapshot.json>
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const [dist, outFile, snapFile] = process.argv.slice(2);
const snap = JSON.parse(readFileSync(snapFile, "utf8"));
const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString("base64")}`;
const area = readFileSync(join(dist, "area.css"), "utf8")
  .replace(/url\("https:\/\/cdn\.jsdelivr\.net\/npm\/geist@[^"]*\/Geist-Variable\.woff2"\)/, `url("${dataUri(join(dist, "fonts/geist/Geist-Variable.woff2"), "font/woff2")}")`)
  .replace(/url\("https:\/\/cdn\.jsdelivr\.net\/npm\/geist@[^"]*\/GeistMono-Variable\.woff2"\)/, `url("${dataUri(join(dist, "fonts/geist-mono/GeistMono-Variable.woff2"), "font/woff2")}")`);
const question = readFileSync(join(dist, "styles/question.css"), "utf8");

/** The question card (section.area-approval) whose title is `title`, balanced on its <section> tags. */
function card(title) {
  const at = snap.body.indexOf(`>${title}<`);
  const start = snap.body.lastIndexOf('<section class="area-approval', at);
  let depth = 0, i = start;
  const tag = /<(\/?)section\b[^>]*>/g;
  tag.lastIndex = start;
  for (let m; (m = tag.exec(snap.body));) { depth += m[1] ? -1 : 1; if (depth === 0) { i = m.index + m[0].length; break; } }
  return snap.body.slice(start, i).replace(/\sid="[^"]*"/g, "").replace(/\saria-(labelledby|describedby|controls)="[^"]*"/g, "");
}
const EXAMPLES = [
  ["Next step", "List", card("What would you like to do next?")],
  ["Where it's used", "Grid", card("Where will people use it most?")],
  ["Room", "Steps, one chosen", card("How much room between things?")],
  ["Fine-tune", "Bars", card("Fine-tune the details")],
  ["Exact values", "Fields", card("Set the exact values")],
];
// One answer chosen in the list and the grid too, so every treatment shows its chosen state.
const choose = html => html.includes("data-selected") ? html : html.replace('class="area-approval__option" ', 'class="area-approval__option" data-selected="" aria-current="true" ');

/* Treatments: an answer's paint at rest, and the card's own container. Each is Area's tokens only: control fills
   (bg-component and its hover / active), the options edge, the selected stroke, the surface and its control shadow. */
const ANSWERS = [
  ["quiet", "Quiet", "The look until 2026-11-04: no paint at rest; the row plate on hover and the chosen fill. Hairlines part rows with notes."],
  ["filled", "Filled (the default since 2026-11-04)", "Every answer in a soft field's paint (its fill and the fields' edge, as the fields beside it), the hover one step darker, the chosen the active fill and its check. 4 apart, no lines."],
  ["outlined", "Outlined", "Every answer drawn by the options edge, no fill; hover the control's hover edge; chosen the selected stroke. 4 apart, no lines."],
  ["card", "Filled and outlined", "Radio's card: the surface fill inside the options edge; chosen the selected stroke and tint. 4 apart."],
  ["raised", "Raised", "Segmented's thumb: the surface with the control shadow, on a recessed well; chosen the selected stroke."],
];
const CONTAINERS = [
  ["card", "In a card", "The question card as built: the Composer's edge and field fill, the feed's 16 corner."],
  ["page", "On the page", "No container: the title, answers and way on straight on the chat's surface, the answers' own paint carrying the structure."],
  ["well", "In a well", "The card as a recessed well (the Well role, no edge), the answers lifted out of it."],
];
const ROWS = [
  ["card", "quiet"], ["card", "filled"], ["card", "outlined"], ["card", "card"],
  ["page", "quiet"], ["page", "filled"], ["page", "outlined"], ["page", "card"],
  ["well", "filled"], ["well", "raised"],
];
const label = (list, id) => list.find(entry => entry[0] === id);
const attrs = JSON.stringify(snap.html.filter(([name]) => name.startsWith("data-area-") && name !== "data-area-theme"));

const page = `<title>Answer Treatments</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>
${area}
</style>
<style>
${question}
</style>
<style>
/* The page: Area's own page and ink; a treatment is a row of the kit's four question examples, each at a chat's split
   width, its name and what it paints above it. */
:root { --t-page: var(--area-bg-page, #fff); --t-ink: var(--area-fg-default, #1b1d1f); --t-muted: var(--area-fg-muted, #6a6f75); --t-rule: var(--area-edge-dividers, #e6e8ea); --_tile-radius: 16px; --_canvas-gap: 16px; --_text-inset: 4px; --t-line: max(1px, var(--area-stroke-width, 1px)); /* the open system draws Lines 0; outlines here keep 1 */ }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --t-page: var(--area-bg-page, #0b0c0d); --t-ink: var(--area-fg-default, #eceef0); --t-muted: var(--area-fg-muted, #9aa0a6); --t-rule: var(--area-edge-dividers, #26292c); color-scheme: dark; } }
:root[data-theme="dark"] { --t-page: var(--area-bg-page, #0b0c0d); --t-ink: var(--area-fg-default, #eceef0); --t-muted: var(--area-fg-muted, #9aa0a6); --t-rule: var(--area-edge-dividers, #26292c); color-scheme: dark; }
body { background: var(--t-page); color: var(--t-ink); font-family: var(--area-font-sans); font-size: var(--area-text-base-size); line-height: var(--area-text-base-leading); }
.t-page { display: grid; gap: 48px; padding-block: 32px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.t-head { display: grid; gap: 8px; max-width: 72ch; padding-inline-start: 4px; }
.t-head h1 { margin: 0; font-size: var(--area-title-md-size); line-height: var(--area-title-md-leading); font-weight: var(--area-weight-strong); }
.t-head p { margin: 0; color: var(--t-muted); font-size: var(--area-text-lg-size); line-height: var(--area-text-lg-leading); }
.t-group { display: grid; gap: 32px; }
.t-group > h2 { margin: 0; padding-inline-start: 4px; font-size: var(--area-title-xs-size); line-height: var(--area-title-xs-leading); font-weight: var(--area-weight-strong); }
.t-group > .t-lede { margin: -24px 0 0; padding-inline-start: 4px; color: var(--t-muted); max-width: 80ch; }
.t-row { display: grid; gap: 12px; }
.t-row__name { display: flex; flex-wrap: wrap; gap: 4px 12px; align-items: baseline; padding-inline-start: 4px; }
.t-row__name b { font-weight: var(--area-weight-strong); }
.t-row__name span { color: var(--t-muted); }
.t-examples { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr)); gap: 16px; align-items: start; }
.t-example { display: grid; gap: 4px; margin: 0; min-width: 0; }
.t-example figcaption { order: 2; padding-inline-start: 4px; color: var(--t-muted); }
.t-chat { container: qk-question / inline-size; min-width: 0; }
.t-chat .area-approval { --area-approval-corner: var(--_tile-radius); }
.t-toggle { justify-self: start; display: inline-flex; align-items: center; height: 28px; padding: 0 10px; border: 1px solid var(--t-rule); border-radius: 8px; background: transparent; color: var(--t-ink); font: inherit; cursor: pointer; }

/* --- Answers ---------------------------------------------------------------------------------------------------- */
/* Quiet redraws the look Approval had before filled answers became its default: unpainted rows 1 apart, hairlines. */
[data-answers="quiet"] .area-approval__options { gap: var(--area-ui-row-gap); }
[data-answers="quiet"] .area-approval__option:not(:hover):not([data-selected]):not(:focus-visible), [data-answers="quiet"] .area-approval__tile { background-color: transparent; }
[data-answers="quiet"] .area-approval__option, [data-answers="quiet"] .area-approval__tile { box-shadow: none; }
[data-answers="quiet"] .area-approval:has(.area-approval__option-description) .area-approval__option { position: relative; }
[data-answers="quiet"] .area-approval:has(.area-approval__option-description) .area-approval__option + .area-approval__option::before { content: ""; position: absolute; inset-inline: var(--area-ui-row-inset); inset-block-start: calc(-0.5 * var(--area-ui-row-gap) - var(--t-line) / 2); block-size: var(--t-line); background-color: var(--area-edge-dividers); }
/* Every painted treatment: plates 4 apart, no hairlines, the field row painted as an answer. */
[data-answers]:not([data-answers="quiet"]) .area-approval__options { gap: var(--area-space-4); }
[data-answers]:not([data-answers="quiet"]) .area-approval__option::before { content: none !important; }
[data-answers]:not([data-answers="quiet"]) .area-approval__option { transition: background-color var(--area-duration-fast) var(--area-ease-out), box-shadow var(--area-duration-fast) var(--area-ease-out); }
/* Filled: Approval's own paint since 2026-11-04 (a soft field's fill and edge), nothing to add. */
/* Outlined: the edge drawn inside, so a row keeps its size */
[data-answers="outlined"] .area-approval__option { background-color: transparent; box-shadow: inset 0 0 0 var(--t-line) var(--area-edge-options); }
@media (hover: hover) { [data-answers="outlined"] .area-approval__option:hover { background-color: transparent; box-shadow: inset 0 0 0 var(--t-line) var(--area-edge-control-hover); } }
[data-answers="outlined"] .area-approval__option[data-selected] { background-color: transparent; box-shadow: inset 0 0 0 var(--area-selected-width, 2px) var(--area-stroke-selected); }
[data-answers="outlined"] .area-slider { box-shadow: inset 0 0 0 var(--t-line) var(--area-edge-options); border-radius: var(--area-radius-row); }
/* Filled and outlined (Radio's card) */
[data-answers="card"] .area-approval__option { background-color: var(--area-bg-surface); box-shadow: inset 0 0 0 var(--t-line) var(--area-edge-options); }
@media (hover: hover) { [data-answers="card"] .area-approval__option:hover { background-color: var(--area-bg-surface); box-shadow: inset 0 0 0 var(--t-line) var(--area-edge-control-hover); } }
[data-answers="card"] .area-approval__option[data-selected] { background-color: var(--area-selected-tint, var(--area-bg-surface)); box-shadow: inset 0 0 0 var(--area-selected-width, 2px) var(--area-stroke-selected); }
/* Raised (Segmented's thumb) */
[data-answers="raised"] .area-approval__option { background-color: var(--area-bg-surface); box-shadow: var(--area-shadow-control); }
@media (hover: hover) { [data-answers="raised"] .area-approval__option:hover { background-color: var(--area-bg-surface); box-shadow: var(--area-shadow-control), inset 0 0 0 var(--t-line) var(--area-edge-control-hover); } }
[data-answers="raised"] .area-approval__option[data-selected] { background-color: var(--area-bg-surface); box-shadow: var(--area-shadow-control), inset 0 0 0 var(--area-selected-width, 2px) var(--area-stroke-selected); }

/* --- Containers -------------------------------------------------------------------------------------------------- */
[data-container="page"] .area-approval { padding: 0; border-color: transparent; background: transparent; border-radius: 0; }
[data-container="page"] .area-approval__head, [data-container="page"] .area-approval__foot { padding-inline: var(--area-space-4); }
[data-container="well"] .area-approval { border-color: transparent; background: var(--area-bg-well); } /* the Well role: bg-subtle is the page at Layers 0 */
</style>
<script>
(() => {
  const root = document.documentElement;
  for (const [name, value] of ${attrs}) root.setAttribute(name, value);
  const paint = () => { const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; root.setAttribute("data-area-theme", dark ? "dark" : "light"); document.querySelectorAll("[data-area-theme]").forEach(el => el.setAttribute("data-area-theme", dark ? "dark" : "light")); const t = document.getElementById("t-theme"); if (t) t.textContent = dark ? "Light" : "Dark"; };
  window.__paint = paint; paint();
  new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", paint);
})();
</script>
<main class="t-page" data-area-stroke="2">
  <header class="t-head">
    <h1>Answer treatments</h1>
    <p>Four of the kit's question cards, each answer painted five ways and the card placed three ways. Every card is Area's own markup and CSS in your open system's settings; only the answers' paint and the container change (outlines draw at least 1px, since that system sets Lines to 0). Hover an answer for its hover state; one answer in each card is chosen.</p>
    <button type="button" class="t-toggle" id="t-theme">Dark</button>
  </header>
  ${CONTAINERS.map(([cid, cname, cnote]) => `<section class="t-group" aria-label="${cname}">
    <h2>${cname}</h2>
    <p class="t-lede">${cnote}</p>
    ${ROWS.filter(([c]) => c === cid).map(([c, a]) => { const [, aname, anote] = label(ANSWERS, a); return `<div class="t-row">
      <div class="t-row__name"><b>${aname}</b><span>${anote}</span></div>
      <div class="t-examples">${EXAMPLES.map(([name, kind, html]) => `<figure class="t-example"><div class="t-chat" data-container="${c}" data-answers="${a}">${choose(html)}</div><figcaption>${name} · ${kind}</figcaption></figure>`).join("")}</div>
    </div>`; }).join("")}
  </section>`).join("")}
</main>
<script>
document.getElementById("t-theme").addEventListener("click", () => { const r = document.documentElement; const dark = r.dataset.theme ? r.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; r.dataset.theme = dark ? "light" : "dark"; });
window.__paint();
// A still: the answers' buttons and fields do nothing.
document.addEventListener("click", event => { if (event.target.closest(".area-approval button, .area-approval input")) event.preventDefault(); });
</script>
`;
writeFileSync(outFile, page);
console.log("wrote", outFile, (page.length / 1e6).toFixed(2), "MB");
