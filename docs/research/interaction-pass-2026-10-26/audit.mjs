// Interaction audit: for every interactive element in every component tile, force hover, press and
// focus-visible through CDP and compare computed paint and transition timing with MOTION.md's recipes.
// usage: node audit.mjs <baseUrl> <out.json> [slug,slug]
import { launch } from "./cdp.mjs";
import { writeFileSync } from "node:fs";
import { COMPONENT_PAGES } from "../../../apps/desktop/src/content/pages.mjs";
import { tmpdir } from "node:os";

const [base, out, only] = process.argv.slice(2);
const slugs = (only ? only.split(",") : COMPONENT_PAGES.filter(p => !p.docsOnly).map(p => p.slug));

const PAGE_FNS = String.raw`
window.__props = ["background-color","background-image","border-top-color","border-bottom-color","box-shadow","color","opacity","scale","transform","translate","outline-color","outline-style","outline-width","fill","stroke","text-decoration-color","text-decoration-line"];
window.__cover = p => ({
  "background-color": ["background-color","background"], "background-image": ["background-image","background"],
  "border-top-color": ["border-top-color","border-color","border","border-top","border-block-start-color"],
  "border-bottom-color": ["border-bottom-color","border-color","border","border-bottom","border-block-end-color"],
  "outline-color": ["outline-color","outline"], "outline-width": ["outline-width","outline"], "outline-style": ["outline-style","outline"],
  "text-decoration-color": ["text-decoration-color","text-decoration"], "text-decoration-line": ["text-decoration-line","text-decoration"],
})[p] || [p];
window.__timing = (cs, p) => {
  const props = cs.transitionProperty.split(",").map(s => s.trim());
  const durs = cs.transitionDuration.split(",").map(s => parseFloat(s) * 1000);
  const dels = cs.transitionDelay.split(",").map(s => parseFloat(s) * 1000);
  const eases = cs.transitionTimingFunction.split(/,(?![^(]*\))/).map(s => s.trim());
  let idx = -1;
  for (let i = props.length - 1; i >= 0; i--) { if (props[i] === "all" || __cover(p).includes(props[i])) { idx = i; break; } }
  if (idx < 0) return null;
  return { d: Math.round(durs[idx % durs.length]), delay: Math.round(dels[idx % dels.length]), ease: eases[idx % eases.length], via: props[idx] };
};
window.__nodes = el => {
  const list = [[el, null, "self"]];
  for (const ps of ["::before", "::after"]) list.push([el, ps, ps]);
  let up = el.parentElement;
  for (let d = 1; d <= 3 && up && !up.classList.contains("gallery-tile__view"); d++, up = up.parentElement) {
    list.push([up, null, "p" + d + ":" + (up.getAttribute("class") || up.tagName.toLowerCase()).split(" ")[0]]);
    for (const ps of ["::before", "::after"]) list.push([up, ps, "p" + d + ps]);
  }
  const kids = [...el.querySelectorAll("*")].slice(0, 14);
  kids.forEach((k, i) => { list.push([k, null, "k" + i + ":" + (k.getAttribute("class") || k.tagName.toLowerCase()).split(" ")[0]]); for (const ps of ["::before", "::after"]) list.push([k, ps, "k" + i + ps]); });
  return list;
};
window.__snap = i => {
  const el = document.querySelector('[data-audit-i="' + i + '"]');
  const res = {};
  const nodes = __nodes(el);
  for (const [n, ps, key] of nodes) {
    const cs = getComputedStyle(n, ps);
    if (ps && (cs.content === "none" || cs.content === "normal")) continue;
    const t = {}; for (const p of __props) t[p] = __timing(cs, p);
    res[key] = { t, tp: cs.transitionProperty, cursor: cs.cursor };
  }
  if (!document.getElementById("audit-nt")) { const st = document.createElement("style"); st.id = "audit-nt"; st.textContent = ".audit-nt *, .audit-nt *::before, .audit-nt *::after { transition: none !important; }"; document.head.appendChild(st); }
  document.documentElement.classList.add("audit-nt");
  for (const [n, ps, key] of nodes) {
    if (!res[key]) continue;
    const cs = getComputedStyle(n, ps);
    const v = {}; for (const p of __props) v[p] = cs.getPropertyValue(p);
    res[key].v = v;
  }
  document.documentElement.classList.remove("audit-nt");
  return res;
};
window.__mark = () => {
  const sel = 'button, a[href], [role=button], [role=option], [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], [role=tab], [role=treeitem], [role=radio], [role=checkbox], [role=switch], [role=link], summary, input:not([type=hidden]), select, textarea, [tabindex="0"]';
  const items = []; window.__seen = {};
  document.querySelectorAll("[data-audit-i]").forEach(e => e.removeAttribute("data-audit-i"));
  window.__scope.querySelectorAll(".gallery-tile").forEach((tile, ti) => {
    const label = (tile.closest("[id^=variant-]")?.id || "tile" + ti).replace(/^variant-/, "");
    tile.querySelectorAll(".gallery-tile__view " + sel.split(", ").join(", .gallery-tile__view ")).forEach(el => {
      if (el.closest("[hidden]") || el.matches(":disabled, [aria-disabled=true], [data-disabled]")) return;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
      const sig = (el.getAttribute("class") || el.tagName) + "|" + el.getAttribute("role") + "|" + el.hasAttribute("data-selected") + el.getAttribute("aria-selected") + el.getAttribute("aria-checked") + el.getAttribute("aria-current");
      window.__seen ||= {}; window.__seen[sig] = (window.__seen[sig] || 0) + 1; if (window.__seen[sig] > 2) return;
      const i = items.length; el.setAttribute("data-audit-i", i);
      items.push({ i, tile: label, tag: el.tagName.toLowerCase(), role: el.getAttribute("role"), cls: (el.getAttribute("class") || "").split(" ").filter(c => c.startsWith("area-")).join("."), haspopup: el.getAttribute("aria-haspopup"), type: el.getAttribute("type"), text: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30) });
    });
  });
  const scope = document.querySelector(".gallery-tile__view") || document.body;
  const cs = getComputedStyle(scope);
  const ms = v => { const s = v.trim(); return s.endsWith("ms") ? parseFloat(s) : parseFloat(s) * 1000; };
  const probe = document.createElement("div"); scope.appendChild(probe);
  const read = name => { probe.style.transitionDuration = "var(" + name + ")"; return Math.round(ms(getComputedStyle(probe).transitionDuration)); };
  const clocks = { fast: read("--area-duration-fast"), base: read("--area-duration-base"), hoverIn: read("--area-hover-in"), pressIn: read("--area-press-in") };
  probe.remove();
  return { items, clocks };
};
`;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await launch({ dir: tmpdir(), port: Number(process.env.CDP_PORT || 9555) });
await b.send("Page.enable"); await b.send("DOM.enable"); await b.send("CSS.enable");
const report = {};
await b.send("Page.navigate", { url: `${base}/#components` });
await sleep(2500);
await b.evaluate(PAGE_FNS);
for (const slug of slugs) {
  try {
    const found = await b.evaluate(`(async()=>{const body=document.getElementById("family-${slug}"); const sec=body?.closest("section")||body; if(!sec) return false; sec.scrollIntoView(); await new Promise(r=>setTimeout(r,400)); const t=sec.querySelector(".studio-overview__toggle[aria-expanded=false]"); if(t) t.click(); await new Promise(r=>setTimeout(r,1500)); sec.scrollIntoView(); await new Promise(r=>setTimeout(r,600)); window.__scope=sec; return true})()`);
    if (!found) { report[slug] = { error: "no section" }; continue; }
    const { items, clocks } = await b.evaluate("__mark()");
    const { root } = await b.send("DOM.getDocument", { depth: -1 });
    const { nodeIds } = await b.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "[data-audit-i]" });
    const byI = {};
    for (const nodeId of nodeIds) {
      const { attributes } = await b.send("DOM.getAttributes", { nodeId });
      byI[attributes[attributes.indexOf("data-audit-i") + 1]] = nodeId;
    }
    const results = [];
    for (const it of items.slice(0, 70)) {
      const nodeId = byI[it.i]; if (!nodeId) continue;
      const states = {};
      for (const [name, forced] of [["rest", []], ["hover", ["hover"]], ["active", ["hover", "active"]], ["focus", ["focus", "focus-visible"]]]) {
        await b.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: forced });
        states[name] = await b.evaluate(`__snap(${it.i})`);
      }
      await b.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
      results.push({ ...it, states });
    }
    report[slug] = { clocks, results };
    process.stdout.write(`${slug}: ${results.length}\n`);
  } catch (e) { report[slug] = { error: String(e).slice(0, 300) }; process.stdout.write(`${slug}: ERROR\n`); }
}
writeFileSync(out, JSON.stringify(report));
b.close();
