// Detail audit at true scale: each family's tiles with the stage at scale 1, then resting transforms, will-change,
// icon sizes, clipped text, overlapping controls and icon-to-text centring. node geometry.mjs <base> <out.json> [slugs]
import { launch } from "./cdp.mjs";
import { writeFileSync } from "node:fs";
import { COMPONENT_PAGES } from "../../../apps/desktop/src/content/pages.mjs";
import { tmpdir } from "node:os";
const [base, out, only] = process.argv.slice(2);
const slugs = only ? only.split(",") : COMPONENT_PAGES.filter(p => !p.docsOnly).map(p => p.slug);
const b = await launch({ dir: tmpdir(), port: Number(process.env.CDP_PORT || 9580) });
await b.send("Page.enable");
await b.send("Page.navigate", { url: `${base}/#components` });
await new Promise(r => setTimeout(r, 2500));
const CHECK = String.raw`(slug) => {
  const sec = document.getElementById("family-" + slug)?.closest("section"); if (!sec) return { error: "no section" };
  const found = [];
  const name = el => (el.getAttribute("class") || el.tagName.toLowerCase()).split(" ").filter(c => !c.startsWith("gallery")).slice(0, 2).join(".");
  for (const tile of sec.querySelectorAll(".gallery-tile")) {
    const label = (tile.closest("[id^=variant-]")?.id || "").replace(/^variant-/, "");
    const stage = tile.querySelector(".gallery-tile__stage"); if (stage) { stage.style.zoom = "1"; stage.style.scale = "1"; stage.style.transform = "none"; }
    const view = tile.querySelector(".gallery-tile__view"); if (!view) continue;
    const els = [...view.querySelectorAll("*")].slice(0, 400);
    for (const el of els) {
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      // Resting transforms: a translate off whole pixels, a scale other than 1 (chevrons and mirrored glyphs rotate legitimately).
      if (cs.translate !== "none" && cs.translate.split(" ").some(v => v.endsWith("px") && Math.abs(parseFloat(v) - Math.round(parseFloat(v))) > 0.01)) found.push(["translate-fraction", label, name(el), cs.translate]);
      if (cs.scale !== "none" && cs.scale !== "1" && !/^-1/.test(cs.scale)) found.push(["resting-scale", label, name(el), cs.scale]);
      if (cs.willChange !== "auto") found.push(["will-change", label, name(el), cs.willChange]);
      // Icons drawn off their native size.
      if (el.matches("svg[data-area-glyph], [class*=__icon] > svg, .area-button__icon > svg")) {
        const w = Math.round(r.width * 100) / 100;
        if (![10, 12, 16, 20, 24, 32, 48].includes(w)) found.push(["icon-size", label, name(el.parentElement), w + "x" + Math.round(r.height * 100) / 100]);
      }
      // Text clipped without an ellipsis.
      if (["hidden", "clip"].includes(cs.overflowX) && cs.textOverflow !== "ellipsis" && el.scrollWidth > el.clientWidth + 1 && el.children.length === 0 && el.textContent.trim()) found.push(["text-clipped", label, name(el), el.textContent.trim().slice(0, 24)]);
      if (cs.textOverflow === "ellipsis" && el.scrollWidth > el.clientWidth + 1 && el.textContent.trim()) found.push(["ellipsis", label, name(el), el.textContent.trim().slice(0, 24)]);
    }
    // Overlapping controls: sibling interactive parts whose boxes cross.
    const ctrls = [...view.querySelectorAll("button, a[href], input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]), [role=button], [role=option], [role=tab]")]
      .filter(e => { const s = getComputedStyle(e); return s.visibility !== "hidden" && s.opacity !== "0" && e.getBoundingClientRect().width; });
    for (let i = 0; i < ctrls.length; i++) for (let j = i + 1; j < ctrls.length; j++) {
      const a = ctrls[i], c = ctrls[j]; if (a.contains(c) || c.contains(a)) continue;
      const p = a.getBoundingClientRect(), q = c.getBoundingClientRect();
      const ox = Math.min(p.right, q.right) - Math.max(p.left, q.left), oy = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top);
      if (ox > 1 && oy > 1) found.push(["overlap", label, name(a) + " × " + name(c), Math.round(ox) + "x" + Math.round(oy)]);
    }
    // Icon beside a one-line label: centred on the label's line box.
    for (const row of view.querySelectorAll(".area-button, .area-chip, .area-menu__item, .area-nav__item, .area-tabs__tab, .area-badge, .area-tag, .area-segmented__item, .area-tree-view__row, [role=treeitem]")) {
      const icon = row.querySelector(":scope > [class*=__icon], :scope > svg"); const text = row.querySelector(":scope > [class*=__label], :scope > [class*=__text]");
      if (!icon || !text || getComputedStyle(text).display === "none") continue;
      const ir = icon.getBoundingClientRect(), tr = text.getBoundingClientRect();
      if (!ir.height || !tr.height || tr.height > parseFloat(getComputedStyle(text).lineHeight) * 1.5) continue;
      const d = (ir.top + ir.height / 2) - (tr.top + tr.height / 2);
      if (Math.abs(d) > 0.75) found.push(["icon-off-centre", label, name(row), d.toFixed(2) + "px"]);
    }
  }
  return { found };
}`;
const report = {};
for (const slug of slugs) {
  try {
    await b.evaluate(`(async()=>{const sec=document.getElementById("family-${slug}")?.closest("section"); if(!sec) return; sec.scrollIntoView(); await new Promise(r=>setTimeout(r,400)); sec.querySelector(".studio-overview__toggle[aria-expanded=false]")?.click(); await new Promise(r=>setTimeout(r,1500)); sec.scrollIntoView(); await new Promise(r=>setTimeout(r,500));})()`);
    report[slug] = await b.evaluate(`(${CHECK})(${JSON.stringify(slug)})`);
    process.stdout.write(`${slug}: ${report[slug].found?.length ?? "ERR"}\n`);
  } catch (e) { report[slug] = { error: String(e).slice(0, 200) }; }
}
writeFileSync(out, JSON.stringify(report));
b.close();
