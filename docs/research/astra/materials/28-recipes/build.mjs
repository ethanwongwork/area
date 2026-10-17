// Builds the Material recipes page: eight owner references (2026-10-17), each rebuilt in CSS from layer recipes and
// mapped to the levers of 27-levers. Colours come from samples of the reference images (samples.json, sample.mjs).
//   node docs/research/astra/materials/28-recipes/build.mjs <references-dir> <out-dir>
// The references are the owner's images 1.png–8.png; they are copied beside the page as ref-1.png … ref-8.png.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
const here = new URL(".", import.meta.url).pathname;
const repo = new URL("../../../../../", import.meta.url).pathname;
const [refs, out] = process.argv.slice(2);
if (!refs || !out) throw new Error("usage: node build.mjs <references-dir> <out-dir>");
const samples = JSON.parse(readFileSync(here + "samples.json", "utf8"));
const icon = (name, px) => readFileSync(`${repo}packages/icons/dist/svg/24/${name}.svg`, "utf8").replace('width="24" height="24"', `width="${px}" height="${px}" aria-hidden="true"`);
const recipes = JSON.parse(readFileSync(here + "recipes.json", "utf8"));

const LEVER_ORDER = ["Gradient (linear)", "Gradient (radial)", "Sheen", "Transparency", "Frost", "Stroke: tone ring", "Stroke: lit edge", "Stroke: gradient", "Stroke: double", "Inner shadow", "Catch-light", "Drop shadow (Elevation)", "Contact shadow", "Glow", "Grain"];
const matrix = `<table class="matrix"><thead><tr><th>Lever</th>${recipes.map(r => `<th><a href="#r${r.id}">${r.id}</a></th>`).join("")}<th>Used by</th></tr></thead><tbody>${LEVER_ORDER.map(l => {
  const uses = recipes.map(r => r.levers[l]);
  return `<tr><th scope="row">${l}</th>${uses.map(u => `<td>${u ? `<span class="dot" title="${u}">${u}</span>` : ""}</td>`).join("")}<td class="n">${uses.filter(Boolean).length} of 8</td></tr>`;
}).join("")}<tr><th scope="row">Not a lever</th>${recipes.map(r => `<td class="gap">${r.notLever.length ? r.notLever.map(x => `<span>${x}</span>`).join("") : ""}</td>`).join("")}<td></td></tr></tbody></table>`;

const chips = id => Object.entries(samples[id]).map(([k, v]) => `<span class="chip"><i style="background:${v}"></i>${k} <code>${v}</code></span>`).join("");
const builds = {
  1: `<div class="r1"><div class="r1-card"><div class="r1-text"><h4>Personal Calendar</h4><p>Start filling your calendar with personal and business meetings, to never lose control.</p><span class="r1-btn">Get started</span></div><div class="r1-window"><i></i><b></b><b></b></div></div></div>`,
  2: `<div class="r2"><span class="r2-btn">OK</span><span class="r2-btn">Cancel</span></div>`,
  3: `<div class="r3"><div class="r3-panel"><span class="r3-pill">${icon("folder", 40)}${icon("trash", 40)}</span><span class="r3-pill">${icon("reply", 40)}${icon("send", 40)}</span></div></div>`,
  4: `<div class="r4"><div class="r4-track"><span class="r4-pill">${icon("target", 120)}</span><span class="r4-label">Active<small>Unlocked</small></span></div></div>`,
  5: `<div class="r5"><div class="r5-tile"><span class="r5-well">&gt;_</span></div></div>`,
  6: `<div class="r6"><div class="r6-tile"><span class="r6-bowl">${icon("add", 64)}</span></div></div>`,
  7: `<div class="r7"><div class="r7-housing"><span class="r7-key r7-a"><i class="r7-led r7-off"></i>${icon("wind", 44)}</span><span class="r7-key r7-b"><i class="r7-led"></i>A/C</span><span class="r7-rocker">${icon("car", 56)}${icon("car", 56)}</span></div></div>`,
  8: `<div class="r8"><div class="r8-folder"><span class="r8-back"></span><span class="r8-paper"></span><span class="r8-logo"></span><span class="r8-front"><b>Imported</b><small>3,721 records</small></span><svg class="r8-edge" viewBox="0 0 420 340" width="420" height="340" aria-hidden="true"><path d="M14 46 H128 Q138 46 145 53 L165 74 Q172 81 182 81 H406 Q420 81 420 95 V326 Q420 340 406 340 H14 Q0 340 0 326 V60 Q0 46 14 46 Z" fill="none" stroke="rgb(0 0 0 / 0.1)" stroke-width="1.5"/><path d="M1.5 60 Q1.5 47.5 14 47.5 H128 Q137.5 47.5 144 54 L164 75 Q171 82.5 182 82.5 H406 Q418.5 82.5 418.5 95" fill="none" stroke="rgb(255 255 255 / 0.6)" stroke-width="1.5"/></svg></div></div>`,
};
const sections = recipes.map(r => `<section class="card recipe" id="r${r.id}" aria-labelledby="t${r.id}">
  <header class="rh"><h2 id="t${r.id}"><span class="num">${r.id}</span>${r.name}</h2><p>${r.summary}</p></header>
  <div class="compare"><figure><img src="ref-${r.id}.png" alt="Reference ${r.id}: ${r.name}"><figcaption>Reference</figcaption></figure>
    <figure><div class="build">${builds[r.id]}</div><figcaption>Rebuilt in CSS from the recipe</figcaption></figure></div>
  <div class="stack">${["Fill", "Stroke", "Effects", "Not a lever"].map(g => r.stack[g] && r.stack[g].length ? `<div class="layer"><h3>${g}</h3><ul>${r.stack[g].map(x => `<li>${x}</li>`).join("")}</ul></div>` : "").join("")}</div>
  <details><summary>Sampled colours</summary><div class="chips">${chips(r.id)}</div></details>
</section>`).join("\n");

mkdirSync(out, { recursive: true });
for (let i = 1; i <= 8; i++) copyFileSync(`${refs}/${i}.png`, `${out}/ref-${i}.png`);
const page = readFileSync(here + "template.html", "utf8").replace("<!--MATRIX-->", matrix).replace("<!--SECTIONS-->", sections)
  .replace("<!--FINDINGS-->", readFileSync(here + "findings.html", "utf8"));
writeFileSync(out + "/index.html", page);
console.log("ok", page.length);
