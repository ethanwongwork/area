// Runs in the page (a family's Stage in the desktop app). Every tile's specimen is set to 1:1 (the fit's zoom
// removed) and measured in this one task, before the fit's observer can put the zoom back.
//
// Two outputs.
// Defects, each a measured break of a rule the system already states:
//   subpixel   a drawn edge off the pixel grid relative to its specimen (a blurred hairline inside a component)
//   fraction   a gap, or a drawn box's padding, that computes to a fraction of a pixel
//   center     a control's own text (its cap box: baseline less cap height) or icon off its box's centre by more than
//              0.75 / 0.5px
//   icon       an icon that is not square, or off whole pixels relative to its specimen
//   rhythm     siblings in one flex or grid line spaced unevenly (a margin or nudge in a gap)
//   nudge      a static translate or relative offset on content inside a component (AGENTS: never nudge glyphs)
//   concentric a box nested at its parent's corner whose radius isn't the parent's less the inset (±1)
//   hierarchy  a drawn container whose gap between children exceeds its own padding (proximity reads inverted)
// Metrics, to compare one family with another:
//   control    a drawn single-line box up to 48 tall: height, start/end inset and what sits there (text, icon, box),
//              the gap between its first two items, icon size
//   surface    a drawn box taller than 48: the inset from its edge to its content on each side, its child gap
(() => {
  const root = document.querySelector(".studio-canvas__body");
  if (!root) return { error: "no canvas" };
  const tiles = [...root.querySelectorAll(".gallery-tile")];
  for (const stage of root.querySelectorAll(".gallery-tile__stage, .gallery-tile__view")) stage.style.zoom = "1";
  void root.offsetHeight;

  const cv = document.createElement("canvas").getContext("2d");
  const fontMemo = new Map();
  const metricsOf = cs => {
    const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if (!fontMemo.has(font)) {
      cv.font = font;
      const m = cv.measureText("H");
      fontMemo.set(font, { cap: m.actualBoundingBoxAscent, ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent });
    }
    return fontMemo.get(font);
  };
  const px = v => parseFloat(v) || 0;
  const r1 = n => Math.round(n * 100) / 100;
  const frac = v => Math.abs(v - Math.round(v));
  const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden" && getComputedStyle(el).opacity !== "0"; };
  const clear = c => !c || c === "rgba(0, 0, 0, 0)" || c === "transparent";
  const drawn = cs => (px(cs.borderTopWidth) + px(cs.borderLeftWidth) > 0 && cs.borderTopStyle !== "none" && !clear(cs.borderTopColor))
    || !clear(cs.backgroundColor)
    || (cs.boxShadow !== "none" && /rgba?\([^)]*[^0)\s]\s*\)|#|oklch|color\(/.test(cs.boxShadow.replace(/rgba\(0, 0, 0, 0\)/g, "")));
  const areaClass = el => [...el.classList].find(c => /^area-[a-z-]+$/.test(c) && !c.includes("__")) ?? [...el.classList].find(c => c.startsWith("area-")) ?? null;
  const name = el => { const c = areaClass(el); return c ? c + [...el.classList].filter(x => x.startsWith(c + "--")).map(x => x.slice(c.length)).join("") : el.tagName.toLowerCase(); };
  const path = el => { const out = []; for (let e = el; e && !e.classList?.contains("gallery-tile__stage") && !e.classList?.contains("gallery-tile__view") && out.length < 4; e = e.parentElement) { if (areaClass(e)) out.unshift(name(e)); } return out.join(" > "); };
  const textRects = el => {
    const out = [];
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { const range = document.createRange(); range.selectNodeContents(n); out.push(...range.getClientRects()); }
    return out;
  };
  // A box's own content: text runs and icons, not descending into nested drawn boxes (they are content as a box).
  const contentOf = el => {
    const items = [];
    const own = textRects(el);
    if (own.length) items.push({ kind: "text", el, rect: own[0], rects: own, cs: getComputedStyle(el) });
    const walk = (node, depth) => {
      for (const c of node.children) {
        if (!visible(c)) continue;
        const cs = getComputedStyle(c);
        if (cs.position === "absolute" || cs.position === "fixed") continue;
        if (c.tagName === "svg" || c.tagName === "IMG") { items.push({ kind: "icon", el: c, rect: c.getBoundingClientRect() }); continue; }
        if (drawn(cs)) { items.push({ kind: "box", el: c, rect: c.getBoundingClientRect(), name: name(c) }); continue; }
        const t = textRects(c);
        if (t.length) items.push({ kind: "text", el: c, rect: t[0], rects: t, cs });
        if (depth < 4) walk(c, depth + 1);
      }
    };
    walk(el, 0);
    return items.filter(i => i.rect.width > 0 && i.rect.height > 0);
  };
  // The cap box of a text run: a range's rect is the font's content area, so its baseline is its bottom less the
  // font's descent.
  const capBox = item => { const m = metricsOf(item.cs); const base = item.rect.bottom - m.descent; return { top: base - m.cap, bottom: base, left: item.rect.left, right: item.rect.right, cap: m.cap }; };

  const defects = [], metrics = [];
  for (const tile of tiles) {
    const label = (tile.querySelector(".gallery-tile__label, .gallery-tile__title")?.textContent ?? "").trim();
    const stage = tile.querySelector(".gallery-tile__stage") ?? tile.querySelector(".gallery-tile__view");
    if (!stage) continue;
    const specimen = stage.firstElementChild;
    if (!specimen) continue;
    const origin = specimen.getBoundingClientRect();
    const rel = (x, y) => [frac(x - origin.left), frac(y - origin.top)];
    const add = (kind, el, data) => defects.push({ tile: label, kind, path: path(el), ...data });
    const els = [specimen, ...specimen.querySelectorAll("*")].filter(e => (e.className?.baseVal ?? e.className ?? "").toString().includes("area-") && visible(e));
    for (const el of els) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const isDrawn = drawn(cs);
      // A box's start edge off the grid relative to its specimen: everything after it inherits the fraction. (Widths that
      // hug text are fractional everywhere and Chromium snaps a box's paint, so only offsets are reported.)
      if (isDrawn && r.width >= 4 && r.height >= 4 && el.tagName !== "svg" && el !== specimen) {
        const [a, b] = rel(r.left, r.top);
        if (Math.max(a, b) > 0.05) add("subpixel", el, { rel: [r.left - origin.left, r.top - origin.top].map(r1) });
      }
      for (const prop of ["rowGap", "columnGap", ...(isDrawn ? ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"] : [])]) {
        const v = px(cs[prop]);
        if (frac(v) > 0.05) add("fraction", el, { prop, value: r1(v) });
      }
      if (el !== specimen && cs.animationName === "none" && el.tagName !== "svg") {
        if (cs.translate !== "none" && !/^0px( 0px)?$/.test(cs.translate)) add("nudge", el, { translate: cs.translate });
        if (cs.position === "relative" && (px(cs.top) || px(cs.left) || px(cs.bottom) || px(cs.right))) add("nudge", el, { offset: `${cs.top} ${cs.left}` });
      }
      const parent = el.parentElement?.closest("[class*='area-']");
      const rad = px(cs.borderTopLeftRadius);
      if (isDrawn && parent && rad > 0) {
        const pcs = getComputedStyle(parent);
        const prad = px(pcs.borderTopLeftRadius);
        const pr = parent.getBoundingClientRect();
        const dx = r.left - pr.left - px(pcs.borderLeftWidth), dy = r.top - pr.top - px(pcs.borderTopWidth);
        if (drawn(pcs) && prad > 0 && dx >= 0 && dy >= 0 && dx < prad && dy < prad && Math.abs(dx - dy) <= 1.5) {
          const inset = Math.min(dx, dy);
          const want = Math.max(0, prad - px(pcs.borderTopWidth) - inset);
          if (Math.abs(rad - want) > 1.01 && rad < r.height / 2 - 0.5) add("concentric", el, { radius: r1(rad), parentRadius: r1(prad), inset: r1(inset), want: r1(want), parent: name(parent) });
        }
      }
      if (/flex|grid/.test(cs.display) && el.children.length >= 3) {
        const kids = [...el.children].filter(c => visible(c) && !/absolute|fixed/.test(getComputedStyle(c).position));
        const rects = kids.map(k => k.getBoundingClientRect());
        // A child that grows or is pushed by an auto margin spaces itself on purpose.
        const free = kids.map(k => { const k2 = getComputedStyle(k); return px(k2.flexGrow) > 0 || /auto/.test(k.style.marginInlineStart + k.style.marginLeft) || k2.marginLeft !== "0px" && px(k2.marginLeft) > 24 || k2.justifySelf === "end"; });
        const row = cs.display.includes("flex") ? !cs.flexDirection.startsWith("column") : rects.length > 1 && Math.abs(rects[0].top - rects[1].top) < 2;
        const steps = [];
        for (let i = 1; i < rects.length; i++) {
          const a = rects[i - 1], b = rects[i];
          if (row ? Math.abs(a.top - b.top) > 2 && Math.abs(a.bottom - b.bottom) > 2 : Math.abs(a.left - b.left) > 2) continue;
          if (free[i] || free[i - 1]) continue;
          steps.push(row ? b.left - a.right : b.top - a.bottom);
        }
        if (steps.length >= 2 && Math.max(...steps) - Math.min(...steps) > 1.5 && !/space-|stretch/.test(cs.justifyContent) && Math.min(...steps) >= -0.5)
          add("rhythm", el, { gap: r1(px(row ? cs.columnGap : cs.rowGap)), steps: steps.map(r1), children: kids.map(name).slice(0, 6) });
        const gap = px(row ? cs.columnGap : cs.rowGap);
        const pad = Math.min(px(cs.paddingTop) + px(cs.borderTopWidth), px(cs.paddingLeft) + px(cs.borderLeftWidth));
        if (isDrawn && r.height > 48 && pad > 0 && gap > pad + 0.5) add("hierarchy", el, { gap: r1(gap), padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px) });
      }
      if (!isDrawn || el.tagName === "svg") continue;
      const bl = px(cs.borderLeftWidth), br = px(cs.borderRightWidth), bt = px(cs.borderTopWidth), bb = px(cs.borderBottomWidth);
      const items = contentOf(el);
      if (!items.length) continue;
      const first = items.reduce((a, b) => (b.rect.left < a.rect.left ? b : a));
      const last = items.reduce((a, b) => (b.rect.right > a.rect.right ? b : a));
      const edge = item => item.kind === "text" ? capBox(item) : item.rect;
      if (r.height <= 48 && r.height >= 12 && items.every(i => i.kind !== "text" || i.rects.length === 1)) {
        const tops = items.map(i => edge(i).top), bottoms = items.map(i => edge(i).bottom);
        if (Math.max(...bottoms) - Math.min(...tops) > r.height) continue;
        const sorted = [...items].sort((a, b) => a.rect.left - b.rect.left);
        const g = sorted.length > 1 ? sorted[1].rect.left - sorted[0].rect.right : null;
        metrics.push({ tile: label, kind: "control", path: path(el), name: name(el), h: r1(r.height), w: r1(r.width), border: r1(bl),
          start: r1(first.rect.left - r.left), startKind: first.kind === "box" ? first.name : first.kind,
          end: r1(r.right - last.rect.right), endKind: last.kind === "box" ? last.name : last.kind,
          gap: g == null ? null : r1(g), icon: items.find(i => i.kind === "icon")?.rect.width ?? null,
          font: items.find(i => i.kind === "text")?.cs.fontSize ?? null, radius: r1(px(cs.borderTopLeftRadius)) });
        const mid = (r.top + bt + r.bottom - bb) / 2;
        for (const item of items) {
          if (item.kind === "icon") {
            const ir = item.rect;
            const c = (ir.top + ir.bottom) / 2;
            if (Math.abs(c - mid) > 0.51) add("center", el, { content: "icon", off: r1(c - mid) });
            if (Math.abs(ir.width - ir.height) > 0.5) add("icon", el, { issue: "not square", size: [r1(ir.width), r1(ir.height)] });
            const [fx, fy] = rel(ir.left, ir.top);
            if (Math.max(fx, fy) > 0.05) add("icon", el, { issue: "off pixel", rel: [r1(ir.left - origin.left), r1(ir.top - origin.top)] });
          } else if (item.kind === "text" && item.el === el || item.kind === "text" && !drawn(getComputedStyle(item.el))) {
            const cap = capBox(item);
            const c = (cap.top + cap.bottom) / 2;
            if (Math.abs(c - mid) > 0.76) add("center", el, { content: "text", off: r1(c - mid), cap: r1(cap.cap), h: r1(r.height), text: item.el.textContent.trim().slice(0, 16) });
          }
        }
      } else if (r.height > 48 && r.width > 48) {
        const all = items.map(edge);
        const kids = [...el.children].filter(c => visible(c) && !/absolute|fixed/.test(getComputedStyle(c).position)).map(c => c.getBoundingClientRect());
        const steps = []; for (let i = 1; i < kids.length; i++) if (Math.abs(kids[i].left - kids[i - 1].left) < 2) steps.push(r1(kids[i].top - kids[i - 1].bottom));
        metrics.push({ tile: label, kind: "surface", path: path(el), name: name(el), h: r1(r.height), w: r1(r.width), border: r1(bl), radius: r1(px(cs.borderTopLeftRadius)),
          padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px),
          inset: { top: r1(Math.min(...all.map(a => a.top)) - r.top), right: r1(r.right - Math.max(...all.map(a => a.right))), bottom: r1(r.bottom - Math.max(...all.map(a => a.bottom))), left: r1(Math.min(...all.map(a => a.left)) - r.left) },
          firstKind: first.kind === "box" ? first.name : first.kind, steps });
      }
    }
  }
  return { tiles: tiles.length, findings: defects, metrics };
})()
