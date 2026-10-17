// Runs in the page. Returns findings for the Canvas of the current family page.
(() => {
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const cache = new Map();
  function rgba(str) {
    if (cache.has(str)) return cache.get(str);
    let out = null;
    if (str && str !== "transparent" && str !== "rgba(0, 0, 0, 0)") {
      // alpha: read from the string where possible, colour from a pixel painted opaque
      cx.clearRect(0, 0, 1, 1);
      cx.fillStyle = "#000"; cx.fillStyle = str;
      cx.globalAlpha = 1; cx.fillRect(0, 0, 1, 1);
      const d = cx.getImageData(0, 0, 1, 1).data;
      out = [d[0], d[1], d[2], d[3] / 255];
    } else out = [0, 0, 0, 0];
    cache.set(str, out); return out;
  }
  const over = (top, bot) => { const a = top[3] + bot[3] * (1 - top[3]); if (!a) return [0, 0, 0, 0]; return [0, 1, 2].map(i => (top[i] * top[3] + bot[i] * bot[3] * (1 - top[3])) / a).concat(a); };
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const lum = c => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const okL = c => { const [r, g, b] = c.map(lin); const l = Math.cbrt(0.4122214708 * r + 0.5363288850 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b); return 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s; };
  const hex = c => "#" + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, "0")).join("");

  const root = document.querySelector(".studio-canvas__body");
  if (!root) return { error: "no canvas" };
  const pageBg = rgba(getComputedStyle(document.documentElement).backgroundColor);
  // background behind an element (not including itself), composited
  const bgMemo = new Map();
  function bgOf(el) {
    if (!el || el === document.documentElement) return over(pageBg[3] ? pageBg : [255, 255, 255, 1], [255, 255, 255, 1]);
    if (bgMemo.has(el)) return bgMemo.get(el);
    const cs = getComputedStyle(el);
    const own = rgba(cs.backgroundColor);
    const below = bgOf(el.parentElement);
    const res = own[3] >= 1 ? own : own[3] > 0 ? over(own, below) : below;
    bgMemo.set(el, res); return res;
  }
  const hasImageBg = el => { for (let e = el; e && e !== root.parentElement; e = e.parentElement) { const bi = getComputedStyle(e).backgroundImage; if (bi && bi !== "none") return true; if (rgba(getComputedStyle(e).backgroundColor)[3] >= 1) return false; } return false; };
  function effOpacity(el) { let o = 1; for (let e = el; e; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; }
  const disabled = el => !!el.closest(":disabled,[aria-disabled=true],[data-disabled],fieldset[disabled]");
  const visible = el => { const r = el.getBoundingClientRect(); if (!r.width || !r.height) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none"; };
  const tileOf = el => { const t = el.closest(".gallery-tile"); if (!t) return "?"; return (t.querySelector(".gallery-tile__label,.gallery-tile__title")?.textContent || t.getAttribute("aria-label") || "?").trim().slice(0, 60); };
  const desc = el => { let s = el.tagName.toLowerCase(); const cls = [...el.classList].filter(c => c.startsWith("area-")).slice(0, 2); if (cls.length) s += "." + cls.join("."); const role = el.getAttribute("role"); if (role) s += `[role=${role}]`; return s; };
  const inStage = el => !!el.closest(".gallery-tile__view, .gallery-tile__stage") && !el.closest(".gallery-tile__head,.gallery-tile__caption");

  const findings = [];
  const isDark = document.documentElement.getAttribute("data-area-theme") === "dark";

  // A. text contrast
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (!inStage(el) || !visible(el) || disabled(el) || el.closest("[aria-hidden=true],svg,.area-skeleton,[data-painted],.area-sr-only")) continue;
    if (effOpacity(el) < 0.99) continue;
    if (hasImageBg(el)) continue;
    const cs = getComputedStyle(el);
    const fg = rgba(cs.color); const bg = bgOf(el);
    const c = fg[3] < 1 ? over(fg, bg) : fg;
    const r = ratio(c, bg);
    const size = parseFloat(cs.fontSize), w = +cs.fontWeight;
    const need = (size >= 24 || (size >= 18.66 && w >= 700)) ? 3 : 4.5;
    if (r < need) findings.push({ kind: "text", tile: tileOf(el), el: desc(el), text: n.textContent.trim().slice(0, 30), fg: hex(c), bg: hex(bg), ratio: +r.toFixed(2), need });
  }

  // B. stateful plates (selected / current / pressed / checked / open) must step off their ground
  const stateSel = "[aria-selected=true],[aria-current]:not([aria-current=false]),[aria-pressed=true],[aria-checked=true][role=menuitemcheckbox],[aria-checked=true][role=menuitemradio],[data-state=on],[data-selected],[data-state=active],[aria-expanded=true]";
  for (const el of root.querySelectorAll(stateSel)) {
    if (!inStage(el) || !visible(el) || disabled(el)) continue;
    const cs = getComputedStyle(el);
    const own = rgba(cs.backgroundColor);
    const under = bgOf(el.parentElement);
    const plate = own[3] > 0 ? over(own, under) : under;
    const dL = Math.abs(okL(plate) - okL(under));
    const border = parseFloat(cs.borderTopWidth) > 0 && rgba(cs.borderTopColor)[3] > 0 ? ratio(over(rgba(cs.borderTopColor), plate), under) : 1;
    const shadow = cs.boxShadow !== "none";
    const outline = cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0;
    if (own[3] > 0 || shadow) findings.push({ kind: "state", tile: tileOf(el), el: desc(el), state: [...el.attributes].filter(a => /aria-(selected|current|pressed|checked|expanded)|data-state|data-selected/.test(a.name)).map(a => `${a.name}=${a.value}`).join(" "), plate: hex(plate), ground: hex(under), dL: +dL.toFixed(4), border: +border.toFixed(2), shadow, outline });
  }

  // C. fields: boundary from a fill step or a 3:1 edge
  const fieldSel = "input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=range]):not([type=color]),textarea,select,.area-input,.area-field,.area-select,[role=combobox],.area-composer,.area-search-field";
  const fieldSeen = new Set();
  for (let el of root.querySelectorAll(fieldSel)) {
    // measure the painted box: the nearest ancestor (or self) with a bg or border, within 2 levels
    let box = el;
    for (let i = 0, e = el; i < 3 && e; i++, e = e.parentElement) { const cs = getComputedStyle(e); if (rgba(cs.backgroundColor)[3] > 0 || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== "none") { box = e; break; } }
    if (fieldSeen.has(box)) continue; fieldSeen.add(box);
    if (!inStage(box) || !visible(box) || disabled(el)) continue;
    const cs = getComputedStyle(box);
    const own = rgba(cs.backgroundColor);
    const under = bgOf(box.parentElement);
    const fill = own[3] > 0 ? over(own, under) : under;
    const dL = Math.abs(okL(fill) - okL(under));
    const bw = parseFloat(cs.borderBottomWidth);
    const edge = bw > 0 && rgba(cs.borderBottomColor)[3] > 0 ? ratio(over(rgba(cs.borderBottomColor), under), under) : 1;
    findings.push({ kind: "field", tile: tileOf(box), el: desc(box), fill: hex(fill), ground: hex(under), dL: +dL.toFixed(4), edge: +edge.toFixed(2), shadow: cs.boxShadow !== "none" });
  }

  // D. raised layers: frame or tone off the ground
  const layerSel = ".area-card,.area-menu,.area-popover,.area-dialog,.area-drawer,.area-hover-card,.area-toast,.area-command-palette,.area-panel,.area-table-wrapper,.area-board-card,.area-file-upload,.area-color-picker,.area-toggletip,.area-calendar--surface,.area-toolbar--surface,.area-description-list--framed";
  for (const el of root.querySelectorAll(layerSel)) {
    if (!inStage(el) || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const own = rgba(cs.backgroundColor);
    const under = bgOf(el.parentElement);
    const fill = own[3] > 0 ? over(own, under) : under;
    const dL = Math.abs(okL(fill) - okL(under));
    const bw = parseFloat(cs.borderTopWidth);
    const edge = bw > 0 && rgba(cs.borderTopColor)[3] > 0 ? ratio(over(rgba(cs.borderTopColor), fill), under) : 1;
    findings.push({ kind: "layer", tile: tileOf(el), el: desc(el), fill: hex(fill), ground: hex(under), dL: +dL.toFixed(4), edge: +edge.toFixed(2), shadow: cs.boxShadow !== "none" });
  }

  // E. literal colours: any background in the stage that equals neither a token-ish value — recorded as all distinct
  // backgrounds so runs can be diffed across combinations
  const bgs = new Map();
  for (const el of root.querySelectorAll(".gallery-tile__view *")) {
    const b = getComputedStyle(el).backgroundColor; const c = rgba(b);
    if (c[3] === 0) continue;
    const k = desc(el); if (!bgs.has(k)) bgs.set(k, hex(over(c, bgOf(el.parentElement))));
  }
  return { tiles: root.querySelectorAll(".gallery-tile").length, canvasBg: hex(bgOf(root)), dark: isDark, findings, bgs: Object.fromEntries(bgs) };
})()
