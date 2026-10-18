// Runs in the page: every small plate (a drawn box 12–24 tall holding one line of text) on the Canvas, measured for
// the symptoms the owner found in Tag at Compact (2026-10-17):
//   ratio     font size / plate height (Tag held 13 in 14, 0.93; marks elsewhere 0.79 at most)
//   room      the space above the cap and below the baseline (the vertical room the text has)
//   start/end the inline space from the plate's edge to its first and last ink: text, icon or a nested box
//   xOff      how far the lowercase body's centre (x-height to baseline) sits below the plate's centre
//   glyphOff  for a plate with an icon or × beside the text: the glyph's centre less the lowercase body's centre
//   iconRoom  the space above and below an icon in the plate
(() => {
  for (const s of document.querySelectorAll(".gallery-tile__stage, .gallery-tile__view")) s.style.zoom = "1";
  const cv = document.createElement("canvas").getContext("2d");
  const clear = c => !c || c === "rgba(0, 0, 0, 0)" || c === "transparent";
  const px = v => parseFloat(v) || 0;
  const drawn = cs => !clear(cs.backgroundColor) || (px(cs.borderTopWidth) > 0 && cs.borderTopStyle !== "none" && !clear(cs.borderTopColor)) || (cs.boxShadow !== "none" && !/^rgba\(0, 0, 0, 0\)/.test(cs.boxShadow));
  const r2 = n => Math.round(n * 100) / 100;
  const name = el => { const c = [...el.classList].find(c => /^area-[a-z-]+$/.test(c) && !c.includes("__")) ?? [...el.classList].find(c => c.startsWith("area-")); return c ? c + [...el.classList].filter(x => x.startsWith(c + "--")).map(x => x.slice(c.length)).join("") : el.tagName.toLowerCase(); };
  const out = []; const seen = new Set();
  for (const el of document.querySelectorAll(".studio-canvas__body [class*='area-']")) {
    const r = el.getBoundingClientRect();
    if (r.height < 12 || r.height > 24 || r.width < 8) continue;
    const cs = getComputedStyle(el);
    if (!drawn(cs)) continue;
    // its own text: the first text node not inside a nested drawn box
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let tn = null, n;
    while ((n = w.nextNode())) {
      if (!n.textContent.trim()) continue;
      let inner = false; for (let p = n.parentElement; p && p !== el; p = p.parentElement) if (drawn(getComputedStyle(p))) { inner = true; break; }
      if (!inner) { tn = n; break; }
    }
    if (!tn) continue;
    const range = document.createRange(); range.selectNodeContents(tn);
    const rects = range.getClientRects(); if (rects.length !== 1) continue;
    const tr = rects[0];
    const tcs = getComputedStyle(tn.parentElement);
    cv.font = `${tcs.fontWeight} ${tcs.fontSize} ${tcs.fontFamily}`;
    const H = cv.measureText("H"), X = cv.measureText("x");
    const base = tr.bottom - H.fontBoundingBoxDescent;
    const capTop = base - H.actualBoundingBoxAscent, xTop = base - X.actualBoundingBoxAscent;
    const mid = (r.top + r.bottom) / 2;
    // ink at the ends: text, icons (svg) and nested drawn boxes, not absolutely placed parts
    const parts = [{ l: tr.left, r: tr.right }];
    let glyph = null, icon = null;
    for (const c of el.querySelectorAll("svg, [class*='__dismiss'], [class*='__remove'], [class*='__avatar'], [class*='__flag'], [class*='__dot']")) {
      const cr = c.getBoundingClientRect(); if (!cr.width || /absolute|fixed/.test(getComputedStyle(c).position) && !c.matches("svg")) continue;
      if (c.matches("svg")) { const path = c.querySelector("path, line, circle, rect"); const pr = path ? c.getBoundingClientRect() : cr; parts.push({ l: pr.left, r: pr.right }); const ink = path?.getBoundingClientRect() ?? cr; glyph ??= ink; icon ??= cr; }
      else parts.push({ l: cr.left, r: cr.right });
    }
    const textOnly = parts.length === 1;
    const lowerText = tn.textContent.trim();
    const hasCaps = /[A-Z0-9⌘⌥⇧⌃]/.test(lowerText[0] ?? "");
    const rec = {
      family: null, name: name(el), h: r2(r.height), font: tcs.fontSize, ratio: r2(px(tcs.fontSize) / r.height),
      room: [r2(capTop - r.top), r2(r.bottom - base)],
      start: r2(Math.min(...parts.map(p => p.l)) - r.left), end: r2(r.right - Math.max(...parts.map(p => p.r))),
      xOff: r2((xTop + base) / 2 - mid), capOff: r2((capTop + base) / 2 - mid), text: lowerText.slice(0, 14), caps: hasCaps,
      glyphOff: glyph ? r2((glyph.top + glyph.bottom) / 2 - (hasCaps ? (capTop + base) / 2 : (xTop + base) / 2)) : null,
      iconRoom: icon ? [r2(icon.top - r.top), r2(r.bottom - icon.bottom), r2(icon.height)] : null,
      textOnly,
    };
    const key = [rec.name, rec.h, rec.font, rec.textOnly, rec.text].join("|");
    if (seen.has(key)) continue; seen.add(key);
    rec.tile = el.closest(".gallery-tile")?.querySelector(".gallery-tile__label, .gallery-tile__title")?.textContent.trim();
    out.push(rec);
  }
  return { findings: out };
})()
