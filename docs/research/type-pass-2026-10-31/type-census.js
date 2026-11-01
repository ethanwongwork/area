// Type census of the app's chrome (not specimens): every visible text block, grouped by its type style, with
// off-ramp flags. Ramp at type 13: 11/14, 13/18, 15/22, 19/26, 22/30, 30/38; prose 13/20, 15/24.
(() => {
  const RAMP = { "11": [14], "13": [18, 20], "15": [22, 24], "19": [26], "22": [30], "30": [38] };
  const region = el => el.closest(".studio-sidebar") ? "sidebar" : el.closest(".studio-inspector") ? "inspector" : el.closest(".studio-canvas__bar, .studio-head") ? "bars" : el.closest(".studio-canvas__body") ? "canvas" : el.closest("[role=dialog], [popover]") ? "overlay" : "other";
  // Specimens (what the Inspector previews) are not the app's type: skip anything inside a specimen scope or tile frame.
  const specimen = el => el.closest("[data-specimen], .gallery-tile__frame, .area-asset-card__frame, .studio-stage__canvas, .studio-overview__ghost, .gallery-plain__stage, .studio-screen, .studio-specimen, [data-area-specimen], .studio-type-sample, .studio-glyph, .glyph-sheet, .studio-face-specimen, .area-preview-frame");
  const groups = new Map();
  const walker = document.createTreeWalker(document.querySelector(".studio"), NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.textContent.trim(); if (!t) continue;
    const el = n.parentElement; if (!el || specimen(el)) continue;
    if (el.closest("[hidden], .area-sr-only, [aria-hidden=true]")) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
    if (!rects.length) continue;
    const r0 = rects[0]; if (r0.bottom < 0 || r0.top > innerHeight || r0.right < 0 || r0.left > innerWidth) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || +cs.opacity === 0) continue;
    const size = parseFloat(cs.fontSize), lh = cs.lineHeight === "normal" ? "normal" : parseFloat(cs.lineHeight);
    const lines = new Set(rects.map(r => Math.round(r.top))).size;
    const key = `${size}/${lh} ${cs.fontWeight} ${cs.letterSpacing} ${region(el)}`;
    const g = groups.get(key) ?? { size, lh, weight: cs.fontWeight, tracking: cs.letterSpacing, region: region(el), n: 0, samples: [], classes: new Set(), multi: 0, family: cs.fontFamily.split(",")[0], colors: new Set() };
    g.n++; if (lines > 2) g.multi++;
    if (g.samples.length < 4) g.samples.push(t.slice(0, 24) + (lines > 1 ? ` [${lines}L]` : ""));
    let c = el; while (c && !c.className?.toString().match(/area-|studio-|gallery-/)) c = c.parentElement;
    if (c) g.classes.add(c.className.toString().split(" ").filter(x => /area-|studio-|gallery-/.test(x))[0]);
    g.colors.add(cs.color);
    groups.set(key, g);
  }
  const rows = [...groups.values()].map(g => {
    const flags = [];
    if (g.lh === "normal") flags.push("line-height normal");
    else if (!RAMP[g.size]) flags.push("size off ramp");
    else if (!RAMP[g.size].includes(g.lh)) flags.push("leading off ramp");
    if (!["400", "500"].includes(g.weight)) flags.push("weight " + g.weight);
    if (g.multi) flags.push(`${g.multi} blocks >2 lines`);
    if (/mono|Mono/.test(g.family)) flags.push("mono");
    return `${g.region.padEnd(9)} ${String(g.size + "/" + g.lh).padEnd(9)} w${g.weight} ls ${g.tracking.padEnd(8)} n${String(g.n).padEnd(4)} ${flags.join("; ").padEnd(28)} ${[...g.classes].slice(0, 3).join(",")}  «${g.samples.join(" · ")}»`;
  }).sort();
  return rows.join("\n");
})()
