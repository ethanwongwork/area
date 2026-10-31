// Type rhythm probe: every text block in a region, top to bottom, with its size / line height / weight, its ink
// (first cap to last baseline), and the space from the block above it: baseline → cap (what the eye reads) and
// box → box. Classic script; window.areaRhythm.probe(root) returns rows.
(function () {
  const ctx = document.createElement("canvas").getContext("2d");
  const cache = new Map();
  const metrics = cs => {
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if (!cache.has(font)) { ctx.font = font; const m = ctx.measureText("H"); cache.set(font, { ascent: m.fontBoundingBoxAscent, cap: m.actualBoundingBoxAscent }); }
    return cache.get(font);
  };
  const r1 = v => Math.round(v * 10) / 10;
  // A "block": the nearest element whose display is not inline, holding text directly.
  function blocks(root) {
    const out = new Map();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      let el = n.parentElement;
      const cs0 = getComputedStyle(el);
      if (cs0.visibility === "hidden" || el.closest("[hidden], .area-sr-only, [aria-hidden=true], [popover]:not(:popover-open), dialog:not([open])")) continue;
      while (el !== root && getComputedStyle(el).display.startsWith("inline") && el.parentElement) el = el.parentElement;
      const range = document.createRange(); range.selectNodeContents(n);
      const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
      if (!rects.length) continue;
      const cs = getComputedStyle(n.parentElement), m = metrics(cs);
      const cap = rects[0].top + m.ascent - m.cap, base = rects.at(-1).top + m.ascent;
      const left = Math.min(...rects.map(r => r.left));
      const b = out.get(el) ?? { el, cap: Infinity, base: -Infinity, left: Infinity, text: "", cs };
      b.cap = Math.min(b.cap, cap); b.base = Math.max(b.base, base); b.left = Math.min(b.left, left);
      b.text = (b.text + " " + n.textContent.trim()).trim();
      if (parseFloat(cs.fontSize) > parseFloat(b.cs.fontSize)) b.cs = cs;
      out.set(el, b);
    }
    return [...out.values()].sort((a, b) => a.cap - b.cap || a.left - b.left);
  }
  function probe(root, { minLeft = -Infinity, maxLeft = Infinity } = {}) {
    const rows = [];
    let prev = null;
    for (const b of blocks(root)) {
      if (b.left < minLeft || b.left > maxLeft) continue;
      const box = b.el.getBoundingClientRect();
      const cs = b.cs;
      const sameLine = prev && Math.abs(prev.cap - b.cap) < 2;
      rows.push({
        text: b.text.slice(0, 42), cls: [...b.el.classList].slice(0, 2).join("."),
        size: parseFloat(cs.fontSize), lh: cs.lineHeight === "normal" ? "normal" : parseFloat(cs.lineHeight), wt: cs.fontWeight,
        ink: r1(b.base - b.cap), left: r1(b.left),
        fromAbove: prev && !sameLine ? r1(b.cap - prev.base) : null,
        boxGap: prev && !sameLine ? r1(box.top - prev.boxBottom) : null,
      });
      if (!sameLine) prev = { cap: b.cap, base: b.base, boxBottom: box.bottom };
      else prev.base = Math.max(prev.base, b.base);
    }
    return rows;
  }
  const table = rows => ["| text | class | size/lh/wt | ink | base→cap | box gap |", "|---|---|---|---|---|---|",
    ...rows.map(r => `| ${r.text.replace(/\|/g, "/")} | ${r.cls} | ${r.size}/${r.lh}/${r.wt} | ${r.ink} | ${r.fromAbove ?? ""} | ${r.boxGap ?? ""} |`)].join("\n");
  window.areaRhythm = { probe, table };
})();
