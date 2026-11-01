// Feed inventory: for each section on the page, its heading's type, the gap to its block, and the block's frame (radius,
// stroke, fill), inner inset to its first text or child, caption type and position, item gaps and widths.
(() => {
  const R = v => Math.round(v * 10) / 10;
  const body = document.querySelector(".studio-canvas__body"); if (!body) return "no body";
  const cb = body.getBoundingClientRect();
  const ctx = document.createElement("canvas").getContext("2d");
  const ink = el => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => n.textContent.trim() ? 1 : 2 }); const t = w.nextNode(); if (!t) return null;
    const rg = document.createRange(); rg.selectNodeContents(t); const r = rg.getClientRects()[0]; const cs = getComputedStyle(t.parentElement);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; const m = ctx.measureText("H");
    const base = r.top + m.fontBoundingBoxAscent + (r.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
    return { t: t.textContent.trim().slice(0, 18), x: r.left, cap: base - m.actualBoundingBoxAscent, base, font: `${cs.fontSize.replace("px","")}/${cs.lineHeight.replace("px","")} ${cs.fontWeight}`, muted: cs.color }; };
  const paint = el => { const cs = getComputedStyle(el); return `r${parseFloat(cs.borderTopLeftRadius)} b${parseFloat(cs.borderTopWidth)} bg${cs.backgroundColor === "rgba(0, 0, 0, 0)" ? "-" : "+"}${cs.boxShadow !== "none" ? " sh" : ""}`; };
  const painted = el => { const cs = getComputedStyle(el); return parseFloat(cs.borderTopWidth) > 0 || cs.backgroundColor !== "rgba(0, 0, 0, 0)" || cs.boxShadow !== "none"; };
  const out = [`margin ${getComputedStyle(body).paddingLeft} · canvas ${R(cb.width)}`];
  const sections = [...body.querySelectorAll(".studio-section")].filter(s => s.offsetParent).slice(0, 7);
  for (const s of sections) {
    const h = s.querySelector(":scope > .studio-section-heading, :scope > header, :scope > .area-section-heading");
    const title = h ? ink(h.querySelector(".area-section-heading__title") || h) : null;
    const lede = h?.querySelector(".area-section-heading__lede") ? ink(h.querySelector(".area-section-heading__lede")) : null;
    const hb = h?.getBoundingClientRect();
    // the block: the first child after the heading
    const block = [...s.children].find(c => c !== h && c.offsetParent);
    if (!block) { out.push(`§ ${title?.t} (no block)`); continue; }
    const bb = block.getBoundingClientRect();
    // the first painted frame in the block
    let frame = painted(block) ? block : [...block.querySelectorAll("*")].find(e => painted(e) && e.getBoundingClientRect().width > 120);
    const fb = frame?.getBoundingClientRect();
    const fi = frame ? ink(frame) : null;
    const items = [...block.children].filter(c => c.offsetParent).slice(0, 3).map(c => c.getBoundingClientRect());
    const gapX = items[1] && Math.abs(items[1].top - items[0].top) < 2 ? R(items[1].left - items[0].right) : null;
    const gapY = items[1] && Math.abs(items[1].top - items[0].top) >= 2 ? R(items[1].top - items[0].bottom) : null;
    out.push([`§ ${title?.t ?? "—"} [${title?.font ?? ""}]${lede ? ` lede[${lede.font}]` : ""}`,
      `  heading→block ${hb ? R(bb.top - (lede ?? title).base) : "-"} (base→box) · block ${block.className.toString().split(" ").slice(0, 2).join(".") || block.tagName}`,
      frame ? `  frame ${frame.className.toString().split(" ")[0]} ${paint(frame)} ${R(fb.width)}×${R(fb.height)} · text in: ${fi ? `x+${R(fi.x - fb.left)} cap+${R(fi.cap - fb.top)} [${fi.font}] «${fi.t}»` : "-"}` : "  frame none",
      `  items ${items.length} · gapX ${gapX ?? "-"} gapY ${gapY ?? "-"} · w ${items.map(i => R(i.width)).join("/")}`].join("\n"));
  }
  return out.join("\n");
})()
