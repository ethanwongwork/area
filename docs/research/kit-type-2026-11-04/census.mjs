// The text census of a page: every element with its own text, grouped by style (size/leading weight ink), with the
// component it belongs to. Ink is named by matching the computed colour against the fg tokens resolved in the element.
import { writeFileSync } from "node:fs";
const S = process.env.OUT ?? ".";
const PROBE = `(() => {
  const INKS = ["default","muted","quiet","secondary","tertiary","placeholder","disabled","selection","accent","action","info","success","warning","caution","danger","discovery"];
  const root = document.querySelector(".studio-sections");
  const probe = document.createElement("span");
  const MAP = new Map(); root.append(probe); for (const ink of INKS) { probe.style.color = "var(--area-fg-" + ink + ")"; const c = getComputedStyle(probe).color; if (!MAP.has(c)) MAP.set(c, ink); } probe.remove();
  const name = (el, color) => MAP.get(color) ?? color.replace(/\s+/g, "");
  const owner = el => { for (let e = el; e && e !== root; e = e.parentElement) { const c = [...e.classList].find(c => /^(area|studio|qk|gallery|setup)-/.test(c) && !/__/.test(c) === false || /^(area|studio|qk)-[a-z-]+$/.test(c)); if (c) return c; } return "?"; };
  const part = el => { for (let e = el; e && e !== root; e = e.parentElement) { const c = [...e.classList].find(c => /__/.test(c)); if (c) return c; } return ""; };
  const rows = new Map();
  const SKIP = ".ss-frame, .cv-screen, .qk-frame__view, .area-approval__visual, .gallery-tile__view, .area-asset-card__frame, svg, .area-sr-only, pre";
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode: n => n.nodeType === 1 ? (n.matches(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP) : NodeFilter.FILTER_ACCEPT });
  const seen = new Set();
  while (walk.nextNode()) {
    const t = walk.currentNode; if (!t.textContent.trim()) continue;
    const el = t.parentElement; if (seen.has(el)) continue; seen.add(el);
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    const cs = getComputedStyle(el);
    const section = el.closest("section[id]")?.id ?? "";
    const key = Math.round(parseFloat(cs.fontSize)*10)/10 + "/" + (cs.lineHeight === "normal" ? "n" : Math.round(parseFloat(cs.lineHeight)*10)/10) + " " + cs.fontWeight + " " + name(el, cs.color) + (cs.fontFamily.includes("Mono") ? " mono" : "");
    const who = (part(el) || owner(el));
    const row = rows.get(key) ?? { n: 0, who: new Map() }; row.n++; row.who.set(who, (row.who.get(who) ?? 0) + 1);
    if (!row.sample) row.sample = section + ": " + t.textContent.trim().slice(0, 30);
    rows.set(key, row);
  }
  return [...rows].sort((a, b) => b[1].n - a[1].n).map(([k, v]) => k + "  ×" + v.n + "  " + [...v.who].sort((a,b)=>b[1]-a[1]).slice(0, 8).map(([w, n]) => w + "(" + n + ")").join(" ") + "   e.g. " + v.sample).join("\\n");
})()`;
export default async ({ evaluate, wait, size }) => {
  await size(1440, 1000);
  for (const page of ["feed", "chat"]) {
    await evaluate(`location.hash = "#labs/${page}"; 1`); await wait(3500);
    // render every lazy section
    console.log(page, await evaluate(`document.querySelectorAll("section[id]").length + " sections"`));
    const out = await evaluate(PROBE);
    writeFileSync(`${S}/census-${page}.txt`, out); console.log(page, out.split("\n").length, "styles");
  }
};
