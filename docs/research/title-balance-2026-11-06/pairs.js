window.__pairsMeasure = (tileId) => {
  const mc = document.createElement("canvas").getContext("2d");
  const metrics = cs => { mc.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily; const m = mc.measureText("H"), f = mc.measureText("Hg"); return { cap: m.actualBoundingBoxAscent, asc: f.fontBoundingBoxAscent, desc: f.fontBoundingBoxDescent }; };
  const ownText = el => [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
  const visible = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && +cs.opacity > 0.05; };
  const name = el => { const c = [...el.classList].filter(x => x.startsWith("area-")); return (c[0] || el.localName); };
  const ink = el => { const rects = []; for (const n of ownText(el)) { const r = document.createRange(); r.selectNodeContents(n); rects.push(...[...r.getClientRects()].filter(x => x.width > 0)); } if (!rects.length) return null;
    const cs = getComputedStyle(el), m = metrics(cs); const first = rects[0], last = rects[rects.length - 1];
    return { m, left: Math.min(...rects.map(r => r.left)), capTop: first.top + (first.height - m.asc - m.desc) / 2 + m.asc - m.cap, baseline: last.top + (last.height - m.asc - m.desc) / 2 + m.asc, bottom: last.bottom, lines: new Set(rects.map(r => Math.round(r.top))).size }; };
  const paints = el => { const cs = getComputedStyle(el); return parseFloat(cs.borderTopWidth) > 0 || (cs.backgroundColor !== "rgba(0, 0, 0, 0)" && cs.backgroundColor !== "transparent") || ["svg","img","input","textarea","select","video","canvas","hr","button"].includes(el.localName); };
  // first text element inside el, in reading order, if nothing painted comes first
  const firstText = el => { for (const d of [el, ...el.querySelectorAll("*")]) { if (!visible(d)) continue; if (paints(d)) return null; if (ownText(d).length) return d; } return null; };
  const stage = document.querySelector(".studio-canvas__body .studio-stage__content"); if (!stage) return { tileId, missing: true };
  const following = el => { for (let e = el; e && e !== stage; e = e.parentElement) { for (let n = e.nextElementSibling; n; n = n.nextElementSibling) if (visible(n)) return n; } return null; };
  const rows = [];
  for (const el of stage.querySelectorAll("*")) {
    if (!visible(el) || !ownText(el).length || el.closest("svg, code, pre, kbd, .area-kbd, input, textarea, select, option, button, [role=option], [role=menuitem], [aria-hidden=true], .area-badge, .area-tag")) continue;
    const A = ink(el); if (!A) continue;
    const nx = following(el); if (!nx) continue;
    const bEl = firstText(nx); if (!bEl || bEl.closest("button, kbd, .area-kbd, .area-badge, .area-tag")) continue;
    const B = ink(bEl); if (!B) continue;
    if (B.capTop < A.baseline) continue; // beside, not below
    const as = getComputedStyle(el), bs = getComputedStyle(bEl);
    const lh = cs => cs.lineHeight === "normal" ? null : parseFloat(cs.lineHeight);
    rows.push({ tile: tileId, a: name(el), b: name(bEl), aText: el.textContent.trim().slice(0, 30), bText: bEl.textContent.trim().slice(0, 30),
      aSize: parseFloat(as.fontSize), aLead: lh(as), aW: +as.fontWeight, aInk: as.color,
      bSize: parseFloat(bs.fontSize), bLead: lh(bs), bW: +bs.fontWeight, bInk: bs.color, bLines: B.lines,
      join: +(B.capTop - A.baseline).toFixed(2), bLineGap: lh(bs) ? +(lh(bs) - B.m.cap).toFixed(2) : null, aLineGap: lh(as) ? +(lh(as) - A.m.cap).toFixed(2) : null });
  }
  return { tileId, rows };
};
window.__runSweep = async (tiles) => {
  window.__sweep = { done: 0, total: tiles.length, rows: [], missing: [] };
  for (const t of tiles) {
    history.pushState(null, "", "#system/area/components/" + t); dispatchEvent(new HashChangeEvent("hashchange"));
    await new Promise(r => setTimeout(r, 700));
    try { const r = window.__pairsMeasure(t); if (r.missing) window.__sweep.missing.push(t); else window.__sweep.rows.push(...r.rows); } catch (e) { window.__sweep.missing.push(t + " " + e); }
    window.__sweep.done++;
  }
  window.__sweep.finished = true;
};
