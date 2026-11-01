(() => { const out = []; const seen = new Set();
  const w = document.createTreeWalker(document.querySelector(".studio"), NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) { if (!n.textContent.trim()) continue; let el = n.parentElement;
    while (el && getComputedStyle(el).display.startsWith("inline")) el = el.parentElement;
    if (!el || seen.has(el) || el.closest(".gallery-tile__frame, .studio-overview__ghost, .area-preview-frame, [aria-hidden=true]")) continue; seen.add(el);
    const rg = document.createRange(); rg.selectNodeContents(el); const rects = [...rg.getClientRects()].filter(r => r.width && r.height);
    const lines = new Set(rects.map(r => Math.round(r.bottom))).size; const cs = getComputedStyle(el);
    if (lines > 2) out.push(`${lines}L ${cs.fontSize}/${cs.lineHeight} w${Math.round(el.getBoundingClientRect().width)} ${el.tagName}.${el.className.toString().split(" ").slice(0,2).join(".")} «${el.textContent.trim().slice(0, 60)}»`); }
  return out.join("\n") || "none"; })()
