// Measures one family section of the Components Overview, in the page (a classic script, injected by capture.mjs).
// Read-only. Every length is a CSS px from the DOM, relative to the tile's frame (`.gallery-tile`, the card's frame),
// rounded to 1/100. Defines window.areaRendered = { section(slug, { cap }) }.
//
// Per tile: `view` (the frame), `stage` (rect and inline style, which shows `scale: 1` at zoom 100%), `clip` (the box
// the frame and view clip the specimen to), `extent` (the union of painted boxes, each first cut by the specimen's own
// overflow ancestors) with `cut` listing painted boxes outside `clip`, `roots` (the stage's own children), `nodes` (a
// pre-order list of every element under the stage, to `cap`) and `texts` (each text node's line boxes and the cap box
// of its first line).
//
// The cap box. A text Range's client rect is the inline box's content area, the font's ascent plus descent, whatever
// the line height or a text-box trim does to the line; so a line's baseline is rect.top + ascent and its cap top is the
// baseline less the cap height. Ascent, descent and cap height come from the loaded face itself: a canvas set to the
// text's computed font (the same family, weight, size and style, after document.fonts has loaded it) gives
// fontBoundingBoxAscent / Descent and the ink ascent of "H" (actualBoundingBoxAscent), which is the face's cap height.
// `capCheck` is the content-area height that metrics predict less the rect's height (0 when the two agree).
(function install() {
  const r2 = v => Math.round(v * 100) / 100;
  const ctx = document.createElement("canvas").getContext("2d");
  const fonts = new Map();
  function metrics(cs) {
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if (!fonts.has(font)) {
      ctx.font = font;
      const m = ctx.measureText("H");
      fonts.set(font, { ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent, cap: m.actualBoundingBoxAscent });
    }
    return fonts.get(font);
  }
  const clear = c => !c || c === "transparent" || /rgba?\([^)]*,\s*0\)$/.test(c) || c === "rgba(0, 0, 0, 0)";
  const SIDES = ["Top", "Right", "Bottom", "Left"];
  const CORNERS = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"];
  const REPLACED = /^(img|svg|video|canvas|picture|iframe|input|textarea|select|hr|progress|meter|object|embed)$/i;
  function paints(el, cs) {
    if (REPLACED.test(el.localName)) return true;
    if (!clear(cs.backgroundColor) || cs.backgroundImage !== "none") return true;
    return SIDES.some(s => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none" && !clear(cs[`border${s}Color`]));
  }
  const clips = cs => cs.overflowX !== "visible" || cs.overflowY !== "visible" || cs.contain.includes("paint");
  const shown = cs => cs.display !== "none" && cs.visibility !== "hidden";
  const rel = (r, o) => ({ x: r2(r.left - o.left), y: r2(r.top - o.top), w: r2(r.width), h: r2(r.height) });
  const box = r => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
  const cut = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
  const empty = a => a.r - a.l <= 0.01 || a.b - a.t <= 0.01;
  const ATTRS = ["role", "aria-label", "aria-expanded", "aria-selected", "aria-checked", "aria-pressed", "aria-current",
    "aria-disabled", "aria-invalid", "aria-hidden", "disabled", "data-state", "data-size", "data-variant", "hidden", "inert", "popover", "open"];

  function pseudo(el, which) {
    const cs = getComputedStyle(el, which);
    if (cs.content === "none" || cs.content === "normal" || cs.display === "none") return undefined;
    return {
      content: cs.content.slice(0, 40), position: cs.position, w: cs.width, h: cs.height, inset: [cs.top, cs.right, cs.bottom, cs.left],
      bg: cs.backgroundColor, border: SIDES.map(s => `${cs[`border${s}Width`]} ${cs[`border${s}Style`]} ${cs[`border${s}Color`]}`),
      radius: CORNERS.map(c => cs[`border${c}Radius`]), shadow: cs.boxShadow, opacity: cs.opacity,
    };
  }

  function node(el, cs, o, parent, depth) {
    const r = el.getBoundingClientRect();
    const n = {
      parent, depth, tag: el.localName, cls: typeof el.className === "string" ? el.className : el.getAttribute("class") ?? "",
      r: rel(r, o), display: cs.display, position: cs.position, visibility: cs.visibility, opacity: cs.opacity,
      font: { family: cs.fontFamily.split(",")[0].replace(/["']/g, ""), size: cs.fontSize, lh: cs.lineHeight, weight: cs.fontWeight, ls: cs.letterSpacing, features: cs.fontFeatureSettings, numeric: cs.fontVariantNumeric },
      color: cs.color, bg: cs.backgroundColor, bgImage: cs.backgroundImage === "none" ? undefined : cs.backgroundImage.slice(0, 120),
      border: SIDES.map(s => [parseFloat(cs[`border${s}Width`]) || 0, cs[`border${s}Style`], cs[`border${s}Color`]]),
      radius: CORNERS.map(c => cs[`border${c}Radius`]),
      padding: SIDES.map(s => parseFloat(cs[`padding${s}`]) || 0), margin: SIDES.map(s => parseFloat(cs[`margin${s}`]) || 0),
      gap: [cs.rowGap, cs.columnGap], align: [cs.alignItems, cs.justifyContent], shadow: cs.boxShadow, outline: cs.outlineStyle === "none" ? undefined : `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} ${cs.outlineOffset}`,
      transform: cs.transform === "none" ? undefined : cs.transform, scale: cs.scale === "none" || cs.scale === "1" ? undefined : cs.scale,
      zoom: cs.zoom === "1" ? undefined : cs.zoom, overflow: `${cs.overflowX} ${cs.overflowY}`, trim: cs.textBoxTrim && cs.textBoxTrim !== "none" ? `${cs.textBoxTrim} ${cs.textBoxEdge}` : undefined,
      paints: paints(el, cs),
    };
    const attrs = {};
    for (const name of ATTRS) if (el.hasAttribute(name)) attrs[name] = el.getAttribute(name);
    if (Object.keys(attrs).length) n.attrs = attrs;
    const before = pseudo(el, "::before"), after = pseudo(el, "::after");
    if (before) n.before = before;
    if (after) n.after = after;
    if (el.localName === "svg") {
      let ink = null;
      for (const p of el.querySelectorAll("path, circle, rect, line, polyline, polygon, ellipse")) {
        const b = p.getBoundingClientRect();
        if (!b.width && !b.height) continue;
        ink = ink ? { l: Math.min(ink.l, b.left), t: Math.min(ink.t, b.top), r: Math.max(ink.r, b.right), b: Math.max(ink.b, b.bottom) } : box(b);
      }
      const first = el.querySelector("path, circle, rect, line, polyline");
      n.svg = { viewBox: el.getAttribute("viewBox"), ink: ink && { x: r2(ink.l - o.left), y: r2(ink.t - o.top), w: r2(ink.r - ink.l), h: r2(ink.b - ink.t) }, stroke: first ? getComputedStyle(first).strokeWidth : undefined };
    }
    return n;
  }

  /** Every element and text under `els`, relative to `o`; painted boxes outside `clip` are listed in `cuts`. */
  function collect(els, o, clip, cap) {
    const nodes = [], texts = [], painted = [], cuts = [];
    let extent = null, truncatedAt;
    const walk = (el, parent, depth, within) => {
      const cs = getComputedStyle(el);
      if (!shown(cs) && cs.display === "none") return;
      if (nodes.length >= cap) { truncatedAt ??= cap; return; }
      const index = nodes.length;
      const n = node(el, cs, o, parent, depth);
      nodes.push(n);
      const r = el.getBoundingClientRect();
      // Painted boxes, cut by the specimen's own clipping ancestors (a scroll area's content, a visually hidden table).
      if (n.paints && shown(cs) && Number(cs.opacity) > 0 && r.width > 0 && r.height > 0) {
        const b = cut(box(r), within);
        if (!empty(b)) { painted.push(b); if (b.l < clip.l - 0.5 || b.t < clip.t - 0.5 || b.r > clip.r + 0.5 || b.b > clip.b + 0.5) cuts.push({ node: index, ...rel({ left: b.l, top: b.t, width: b.r - b.l, height: b.b - b.t }, o) }); }
      }
      const inner = clips(cs) ? cut(within, box(r)) : within;
      if (el.localName === "svg") return;
      for (const child of el.childNodes) {
        if (child.nodeType === 1) walk(child, index, depth + 1, inner);
        else if (child.nodeType === 3 && child.textContent.trim() && shown(cs)) {
          const range = document.createRange();
          range.selectNodeContents(child);
          const lines = [...range.getClientRects()].filter(l => l.width > 0.01 && l.height > 0.01);
          if (!lines.length) continue;
          const m = metrics(cs);
          const first = lines[0];
          const baseline = first.top + m.ascent;
          const pr = el.getBoundingClientRect();
          const all = range.getBoundingClientRect();
          const t = {
            node: index, text: child.textContent.trim().slice(0, 80),
            lines: lines.map(l => rel(l, o)),
            box: rel(all, o),
            cap: { top: r2(baseline - m.cap - o.top), baseline: r2(baseline - o.top), height: r2(m.cap), ascent: r2(m.ascent), descent: r2(m.descent) },
            capCheck: r2(m.ascent + m.descent - first.height),
            insets: [r2(all.top - pr.top), r2(pr.right - all.right), r2(pr.bottom - all.bottom), r2(all.left - pr.left)],
            font: { family: cs.fontFamily.split(",")[0].replace(/["']/g, ""), size: cs.fontSize, lh: cs.lineHeight, weight: cs.fontWeight },
            color: cs.color, opacity: cs.opacity,
          };
          texts.push(t);
          const b = cut(box(all), inner);
          if (!empty(b) && Number(cs.opacity) > 0) { painted.push(b); if (b.l < clip.l - 0.5 || b.t < clip.t - 0.5 || b.r > clip.r + 0.5 || b.b > clip.b + 0.5) cuts.push({ text: texts.length - 1, ...rel({ left: b.l, top: b.t, width: b.r - b.l, height: b.b - b.t }, o) }); }
        }
      }
    };
    const huge = { l: -1e6, t: -1e6, r: 1e6, b: 1e6 };
    for (const child of els) walk(child, -1, 0, huge);
    for (const b of painted) extent = extent ? { l: Math.min(extent.l, b.l), t: Math.min(extent.t, b.t), r: Math.max(extent.r, b.r), b: Math.max(extent.b, b.b) } : b;
    return { nodes, texts, extent, cuts, truncatedAt };
  }

  function measureTile(card, cap) {
    const frame = card.querySelector(".gallery-tile");
    const view = frame?.querySelector(".gallery-tile__view");
    const stage = view?.querySelector(":scope > .gallery-tile__stage") ?? view;
    const label = card.querySelector(".area-asset-card__name")?.textContent?.trim() ?? card.getAttribute("aria-label") ?? "";
    const id = (card.id || "").replace(/^variant-/, "");
    const group = card.closest(".studio-overview__group")?.querySelector(".studio-overview__group-label")?.firstChild?.textContent?.trim();
    if (!frame || !stage) return { id, label, group, missing: true };
    const o = frame.getBoundingClientRect();
    // The box the specimen is drawn into: the frame and every clipping box between it and the stage.
    let clip = box(o);
    for (let el = stage.parentElement; el && el !== frame.parentElement; el = el.parentElement) {
      if (el === frame || frame.contains(el)) { const cs = getComputedStyle(el); if (clips(cs)) clip = cut(clip, box(el.getBoundingClientRect())); }
    }
    const { nodes, texts, extent, cuts, truncatedAt } = collect([...stage.children], o, clip, cap);
    const roots = [...stage.children].map(el => {
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      return { cls: typeof el.className === "string" ? el.className : "", tag: el.localName, r: rel(r, o), opacity: cs.opacity, visibility: cs.visibility, display: cs.display };
    });
    const sr = stage.getBoundingClientRect(), vr = view.getBoundingClientRect();
    return {
      id, label, group,
      view: rel(o, o), inner: rel(vr, o),
      stage: { ...rel(sr, o), style: stage.getAttribute("style") ?? "", scale: getComputedStyle(stage).scale },
      clip: rel({ left: clip.l, top: clip.t, width: clip.r - clip.l, height: clip.b - clip.t }, o),
      extent: extent && rel({ left: extent.l, top: extent.t, width: extent.r - extent.l, height: extent.b - extent.t }, o),
      cut: cuts.slice(0, 20), cutCount: cuts.length,
      roots, nodes, texts, ...(truncatedAt ? { truncatedAt } : {}),
    };
  }

  function section(slug, { cap = 700 } = {}) {
    const el = document.getElementById(`family-${slug}`);
    if (!el) return null;
    const title = el.querySelector(".studio-section__link")?.textContent?.trim();
    const cards = [...el.querySelectorAll(".gallery-asset")];
    const r = el.getBoundingClientRect();
    return { slug, name: title, section: { w: r2(r.width), h: r2(r.height) }, tiles: cards.map(card => measureTile(card, cap)) };
  }

  /** An open overlay `el` (wherever it is in the document), relative to the tile `card`'s frame. */
  function overlay(el, card, { cap = 400 } = {}) {
    const frame = card.querySelector(".gallery-tile") ?? card;
    const o = frame.getBoundingClientRect();
    const huge = { l: -1e6, t: -1e6, r: 1e6, b: 1e6 };
    const { nodes, texts, extent, truncatedAt } = collect([el], o, huge, cap);
    return { cls: typeof el.className === "string" ? el.className : "", r: rel(el.getBoundingClientRect(), o), extent: extent && rel({ left: extent.l, top: extent.t, width: extent.r - extent.l, height: extent.b - extent.t }, o), nodes, texts, ...(truncatedAt ? { truncatedAt } : {}) };
  }

  window.areaRendered = { section, overlay, metrics };
})();
