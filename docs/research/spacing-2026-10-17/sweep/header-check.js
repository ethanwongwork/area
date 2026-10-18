// Runs in the page: for every title slot (class ending __title or __heading) with a sibling action/close/badge in the
// same header row, the offset of the action's centre from the title's cap centre (0 = optically aligned).
(() => {
  for (const s of document.querySelectorAll(".gallery-tile__stage, .gallery-tile__view")) s.style.zoom = "1";
  const cv = document.createElement("canvas").getContext("2d");
  const firstText = el => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.textContent.trim()) return n; };
  const capMid = el => { const tn = firstText(el); if (!tn) return null; const r = document.createRange(); r.selectNodeContents(tn); const rr = r.getClientRects()[0]; const cs = getComputedStyle(tn.parentElement); cv.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const m = cv.measureText("H"); return rr.bottom - m.fontBoundingBoxDescent - m.actualBoundingBoxAscent / 2; };
  const out = [];
  for (const t of document.querySelectorAll(".studio-canvas__body [class*='__title'], .studio-canvas__body [class*='__heading']")) {
    if (!t.getBoundingClientRect().height) continue;
    const mid = capMid(t); if (mid == null) continue;
    const tr = t.getBoundingClientRect();
    // the nearest container that also holds an interactive or mark sibling on the title's first line
    let row = t.parentElement;
    for (let i = 0; i < 3 && row; i++, row = row.parentElement) {
      const acts = [...row.querySelectorAll(":scope > *, :scope > * > *")].filter(e => !e.contains(t) && !t.contains(e) && e.matches("button, a, .area-badge, .area-count, svg, [class*='__action'] > *, [class*='__close']") && e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().left > tr.left);
      const onLine = acts.filter(e => { const r = e.getBoundingClientRect(); return r.top < tr.top + 24 && r.bottom > tr.top - 12; });
      if (onLine.length) {
        const tile = t.closest(".gallery-tile")?.querySelector(".gallery-tile__label, .gallery-tile__title")?.textContent.trim();
        for (const a of onLine.slice(0, 2)) { const r = a.getBoundingClientRect(); out.push({ tile, title: [...t.classList].join("."), action: (a.getAttribute("class") ?? a.tagName).split(" ").slice(0, 2).join("."), off: Math.round(((r.top + r.bottom) / 2 - mid) * 100) / 100 }); }
        break;
      }
    }
  }
  return { findings: out };
})()
