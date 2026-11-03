// Card audit: text overlaps, text past its card or plot, insets, header→body gap, gaps between body blocks, left edges.
(() => {
  const r = el => el.getBoundingClientRect();
  const out = { width: innerWidth, overlaps: [], escapes: [], insets: [], headGaps: {}, blockGaps: {}, leftEdges: [], bottoms: [] };
  const texts = card => {
    const list = [];
    card.querySelectorAll("svg text").forEach(t => { const b = r(t); if (b.width && t.textContent.trim()) list.push({ t: t.textContent.trim().slice(0, 24), b, svg: t.ownerSVGElement }); });
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) {
      if (!n.textContent.trim() || n.parentElement.closest("svg, .area-tooltip, [hidden]")) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      [...rg.getClientRects()].forEach(b => { if (b.width > 0.5) list.push({ t: n.textContent.trim().slice(0, 24), b, el: n.parentElement }); });
    }
    return list;
  };
  const name = c => (c.querySelector(".area-card__title")?.textContent || "?").trim();
  document.querySelectorAll(".area-card").forEach(card => {
    if (!card.offsetParent) return;
    const nm = name(card), cb = r(card), cs = getComputedStyle(card);
    const T = texts(card);
    for (let i = 0; i < T.length; i++) for (let j = i + 1; j < T.length; j++) {
      const a = T[i].b, b = T[j].b, ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 1 && oy > 2) out.overlaps.push(`${nm}: "${T[i].t}" × "${T[j].t}" (${ox.toFixed(0)}×${oy.toFixed(0)})`);
    }
    const pad = parseFloat(cs.paddingLeft) || 0;
    T.forEach(x => {
      if (x.b.left < cb.left + pad - 0.5 || x.b.right > cb.right - pad + 0.5) out.escapes.push(`${nm}: "${x.t}" past the card's inset by ${Math.max(cb.left + pad - x.b.left, x.b.right - (cb.right - pad)).toFixed(1)}`);
      if (x.svg) { const sb = r(x.svg); if (x.b.left < sb.left - 0.5 || x.b.right > sb.right + 0.5) out.escapes.push(`${nm}: "${x.t}" past its plot by ${Math.max(sb.left - x.b.left, x.b.right - sb.right).toFixed(1)}`); }
    });
    const head = card.querySelector(".area-card__header"), body = card.querySelector(".body, .area-card__content > :not(.area-card__header)");
    if (head && body) { const g = Math.round(r(body).top - r(head).bottom); (out.headGaps[g] ||= []).push(nm); }
    const bodyEl = card.querySelector(".body");
    if (bodyEl) {
      const kids = [...bodyEl.children].filter(k => k.offsetParent && r(k).height > 0);
      for (let i = 1; i < kids.length; i++) { const g = Math.round(r(kids[i]).top - r(kids[i - 1]).bottom); (out.blockGaps[g] ||= []).push(`${nm} (${kids[i - 1].className.split(" ")[0] || kids[i - 1].tagName} → ${kids[i].className.split(" ")[0] || kids[i].id || kids[i].tagName})`); }
      // left edges: every body child's first ink against the title's left
      const tl = r(card.querySelector(".area-card__title") || head).left;
      kids.forEach(k => { const ks = texts(k); if (!ks.length) return; const lx = Math.min(...ks.map(x => x.b.left)); if (Math.abs(lx - tl) > 1.5 && lx < tl + 40) out.leftEdges.push(`${nm}: ${k.className.split(" ")[0] || k.id} starts ${(lx - tl).toFixed(1)} from the title`); });
      // bottom slack: last ink to the card's bottom inset
      const all = T.map(x => x.b.bottom).concat([...card.querySelectorAll("svg rect, svg path, svg circle, .hb-track, .area-slider")].filter(e => r(e).height).map(e => r(e).bottom));
      const slack = cb.bottom - parseFloat(cs.paddingBottom) - Math.max(...all);
      if (slack > 6) out.bottoms.push(`${nm}: ${slack.toFixed(0)} empty above the bottom inset`);
    }
    out.insets.push(`${cs.paddingTop}/${cs.paddingLeft}`);
  });
  out.insets = [...new Set(out.insets)];
  return out;
})();
