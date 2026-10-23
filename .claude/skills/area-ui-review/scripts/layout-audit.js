// Area layout audit. Measures a composed screen the way Area's specs do: text from its first cap to its last
// baseline, painted things (a fill, an edge, a shadow, an image, an icon's square box) by their outer edge, and
// unpainted wrappers by what they hold. For every container it reports its insets (painted containers only) and the
// gaps between its children, then checks the spacing ladder (.claude/skills/area-ui-compose/references/spacing.md).
// Classic script, read-only: inject its full text with the browser JavaScript tool, then
//   const r = areaLayout.audit(document.querySelector('.studio-canvas'), { depth: 8 });
//   areaLayout.markdown(r)          // nodes and issues as Markdown tables
//   JSON.stringify(r.issues)        // just the ladder problems
// Values are CSS pixels at the page's current zoom; set any CSS `zoom` on a preview to 1 before measuring.
(function areaLayoutInstall() {
  const RAMP = [0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
  const r1 = v => Math.round(v * 10) / 10;
  const ctx = document.createElement("canvas").getContext("2d");
  const fonts = new Map();

  // Cap height and ascent of the element's font. A text Range's client rect is the font's content area
  // (ascent + descent), so its baseline is rect.top + ascent and its cap top is the baseline less the cap height.
  function metrics(cs) {
    const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if (!fonts.has(font)) {
      ctx.font = font;
      const m = ctx.measureText("H");
      fonts.set(font, { ascent: m.fontBoundingBoxAscent, descent: m.fontBoundingBoxDescent, cap: m.actualBoundingBoxAscent });
    }
    return fonts.get(font);
  }

  const shown = (el, cs) => cs.display !== "none" && cs.visibility !== "hidden" && Number(cs.opacity) > 0;
  const clear = c => c === "rgba(0, 0, 0, 0)" || c === "transparent";
  function paints(el, cs) {
    if (/^(img|svg|video|canvas|picture|iframe|input|textarea|select|hr|progress|meter)$/i.test(el.localName)) return true;
    if (!clear(cs.backgroundColor) || cs.backgroundImage !== "none" || cs.boxShadow !== "none") return true;
    return ["Top", "Right", "Bottom", "Left"].some(s => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none" && !clear(cs[`border${s}Color`]));
  }
  const union = boxes => boxes.length === 0 ? null : {
    top: Math.min(...boxes.map(b => b.top)), left: Math.min(...boxes.map(b => b.left)),
    bottom: Math.max(...boxes.map(b => b.bottom)), right: Math.max(...boxes.map(b => b.right)),
    text: boxes.every(b => b.text),
  };

  // The drawn box of one text node: cap of its first line to baseline of its last, its widest line's ends.
  function textInk(node, cs) {
    if (!node.textContent.trim()) return null;
    const range = document.createRange();
    range.selectNodeContents(node);
    const rects = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0);
    if (!rects.length) return null;
    const m = metrics(cs);
    const first = rects[0], last = rects[rects.length - 1];
    return {
      top: first.top + m.ascent - m.cap, bottom: last.top + m.ascent,
      left: Math.min(...rects.map(r => r.left)), right: Math.max(...rects.map(r => r.right)), text: true,
    };
  }

  function name(el) {
    const cls = [...el.classList].filter(c => !/^(is-|has-)/.test(c)).slice(0, 2).map(c => "." + c).join("");
    const parent = el.parentElement;
    const same = parent ? [...parent.children].filter(c => c.localName === el.localName) : [];
    const nth = !cls && same.length > 1 ? `:nth-of-type(${same.indexOf(el) + 1})` : "";
    return el.localName + cls + nth;
  }

  // Gap between two consecutive drawn boxes: vertical when one sits wholly above the other, else horizontal.
  function gap(a, b) {
    if (b.top >= a.bottom - 0.5) return { axis: "block", value: b.top - a.bottom };
    if (a.top >= b.bottom - 0.5) return { axis: "block", value: a.top - b.bottom };
    if (b.left >= a.right - 0.5) return { axis: "inline", value: b.left - a.right };
    if (a.left >= b.right - 0.5) return { axis: "inline", value: a.left - b.right };
    return { axis: "overlap", value: 0 };
  }
  const onRamp = v => RAMP.some(s => Math.abs(s - v) <= 0.5);

  function audit(root, { depth = 8 } = {}) {
    const nodes = [];
    function walk(el, path, level) {
      const cs = getComputedStyle(el);
      if (!shown(el, cs)) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0 && cs.display !== "contents") return null;
      const here = path ? `${path} > ${name(el)}` : name(el);
      const parts = [];
      for (const child of el.childNodes) {
        if (child.nodeType === 3) { const t = textInk(child, cs); if (t) parts.push({ ink: t, dom: child, painted: false }); }
        else if (child.nodeType === 1) { const n = walk(child, here, level + 1); if (n) parts.push(n); }
      }
      const painted = paints(el, cs);
      const ink = painted ? { top: rect.top, left: rect.left, bottom: rect.bottom, right: rect.right, text: false } : union(parts.map(p => p.ink));
      if (!ink) return null;
      const node = { path: here, ink, painted, level, parts, dom: el };
      // A space-between row (a title with its action at the end) or an auto margin spreads its children: that space
      // is the container's width, not a spacing decision, so the ladder ignores it.
      const flex = /flex|grid/.test(cs.display);
      const spreads = flex && /space-(between|around|evenly)/.test(cs.justifyContent);
      const autoMargin = child => {
        if (child.nodeType !== 1) return false;
        const c = getComputedStyle(child);
        return [c.marginLeft, c.marginRight, c.marginTop, c.marginBottom].some(m => m === "auto") || (flex && Number(c.flexGrow) > 0);
      };
      // A scroller's content runs past its box: read its bottom inset at the end of the scrolled content.
      const scrolls = /auto|scroll/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1;
      const bottomEdge = scrolls ? rect.top - el.scrollTop + el.scrollHeight + parseFloat(cs.borderTopWidth) : rect.bottom;
      const inset = box => ({
        top: r1(box.top - rect.top), end: r1(rect.right - box.right),
        bottom: r1(bottomEdge - box.bottom), start: r1(box.left - rect.left),
      });
      if (level <= depth && parts.length) {
        const inner = union(parts.map(p => p.ink));
        // The content inset is read to what is not itself painted (text, wrappers): media and nested surfaces sit at
        // the smaller media inset by design (Card's 8 under its 18.3 text inset), so they don't count against the gap.
        const content = union(parts.filter(p => !p.painted).map(p => p.ink));
        node.inset = painted && inner ? inset(inner) : null;
        node.contentInset = painted && content ? inset(content) : null;
        node.gaps = [];
        for (let i = 1; i < parts.length; i++) {
          const g = gap(parts[i - 1].ink, parts[i].ink);
          if (g.axis === "overlap") continue;
          const spread = spreads || autoMargin(parts[i - 1].dom) || autoMargin(parts[i].dom);
          node.gaps.push({ ...g, value: r1(g.value), text: parts[i - 1].ink.text || parts[i].ink.text, spread });
        }
        nodes.push(node);
      }
      return node;
    }
    walk(root, "", 0);

    const issues = [];
    const maxGap = n => Math.max(0, ...(n.gaps || []).filter(g => !g.spread).map(g => g.value));
    for (const n of nodes) {
      const inner = maxGap(n);
      // 1. A painted container holds its content at least as far from its edge as its children are from each other
      //    (Stack's cap, read on the glyphs; 1 of tolerance for cap rounding). Text ends ragged, so the end is not read.
      const ci = n.contentInset;
      if (ci && inner > 0) {
        const least = Math.min(ci.top, ci.bottom, ci.start);
        if (least + 1 < inner) issues.push({ rule: "inset ≥ gap", path: n.path, detail: `content inset ${least} < gap ${inner}` });
      }
      // 2. Text set in a surface starts as far from the side as its cap sits from the top (Card's text inset).
      if (ci && n.parts.some(p => p.ink.text) && Math.abs(ci.top - ci.start) > 1.5) issues.push({ rule: "cap inset = side inset", path: n.path, detail: `top ${ci.top}, start ${ci.start}` });
      // 3. Spacing grows outward: two unframed neighbours that are groups sit further apart than either group's own
      //    items. Framed neighbours (cards, surfaces) are grouped by their edge, so they are not compared.
      n.parts.forEach((p, i) => {
        if (i === 0 || !n.gaps) return;
        const a = n.parts[i - 1], b = p;
        if (a.painted || b.painted) return;
        const between = gap(a.ink, b.ink);
        if (between.axis === "overlap" || n.gaps.find(g => g.value === r1(between.value) && g.spread)) return;
        const within = Math.max(a.gaps ? maxGap(a) : 0, b.gaps ? maxGap(b) : 0);
        if (within > 0 && between.value + 1 < within) issues.push({ rule: "grows outward", path: `${n.path} [${i - 1}↔${i}]`, detail: `between ${r1(between.value)} < within ${r1(within)}` });
      });
      // 4. Box-to-box gaps sit on the spacing ramp (text gaps are read cap to baseline and land off it by design).
      for (const g of n.gaps || []) if (!g.text && !g.spread && !onRamp(g.value)) issues.push({ rule: "on the ramp", path: n.path, detail: `${g.axis} gap ${g.value}` });
    }
    return {
      root: name(root), viewport: `${innerWidth}×${innerHeight}`, dpr: devicePixelRatio,
      nodes: nodes.map(n => ({ path: n.path, painted: n.painted, inset: n.inset, contentInset: n.contentInset, gaps: n.gaps })),
      issues,
    };
  }

  function markdown(result) {
    const rows = result.nodes.filter(n => n.inset || (n.gaps && n.gaps.length)).map(n => {
      const inset = n.inset ? `${n.inset.top} / ${n.inset.end} / ${n.inset.bottom} / ${n.inset.start}` : "";
      const gaps = (n.gaps || []).map(g => `${g.axis === "block" ? "↕" : "↔"}${g.value}${g.text ? "ᵗ" : ""}${g.spread ? "ˢ" : ""}`).join(" ");
      return `| \`${n.path.split(" > ").slice(-3).join(" > ")}\` | ${n.painted ? "yes" : ""} | ${inset} | ${gaps} |`;
    });
    const issues = result.issues.map(i => `| ${i.rule} | \`${i.path.split(" > ").slice(-3).join(" > ")}\` | ${i.detail} |`);
    return [
      `Layout audit of \`${result.root}\` at ${result.viewport} (dpr ${result.dpr}). ᵗ = measured to text (cap or baseline); ˢ = spread (space-between, auto margin or a growing child), not checked.`, "",
      "| Container | Painted | Inset t / e / b / s | Gaps between children |", "|---|---|---|---|", ...rows, "",
      "| Rule | Where | Detail |", "|---|---|---|", ...(issues.length ? issues : ["| none | | |"]),
    ].join("\n");
  }

  window.areaLayout = { audit, markdown, version: 1 };
})();
