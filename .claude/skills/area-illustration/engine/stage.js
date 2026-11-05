/*
 * Area figures: staging, in the browser. AFS.stage(parent, opts) puts rendered markup (render.mjs) in a frame at a
 * fidelity, under scope attributes, and scales it uniformly (CSS zoom) to fill the frame (or to a fixed scale), so a figure is
 * the same drawing at every size. It holds the states asked for (`states`: hover, hover-edge, press, focus, lift,
 * selected, menu; screens.jsx marks their targets with data-st), then what the markup asks for: the pointer on [data-af-pointer], ghost
 * thumbs on a Slider marked [data-af-ghosts] (shares of its travel, or "ease:<n>" for n equal steps of time placed
 * by the scope's --area-ease-in-out).
 *
 *   AFS.stage(parent, { html, w = 280, h = 180, fidelity = "bars" | "line" | "real" | "shapes", scope = {}, states = [], fit = "fill" | number,
 *                       pad = 0.8, max = w / 280, center = null | "contain" | "cover" | "right" | "width" })   → the stage element
 * center fits and centres the drawing on what it paints (not on a wrapper), leaving `pad` of the frame around it.
 * max is the scale every figure shares (1 at the 280 × 180 master, 0.5 on a 140 × 90 card); a figure only shrinks
 * below it when it would not fit, so a button is a button's size beside a menu.
 */
import { groundOf, markLines } from "./line.js";

var AFS = (() => {
  const POINTER = '<svg class="af-pointer" viewBox="0 0 11 17" aria-hidden="true"><path d="M.5.5v13.2l3.3-3.1 2.3 5.2 2.1-.9-2.3-5.1h4.6Z"/></svg>';
  let uid = 0;

  /** cubic-bezier(…) or linear(…) as a function of time. */
  function easeOf(text) {
    const n = (text.match(/-?[\d.]+/g) || []).map(Number);
    if (/cubic-bezier/.test(text) && n.length >= 4) {
      const [x1, y1, x2, y2] = n, B = (t, a, b) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t;
      return (x) => { let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (B(m, x1, x2) < x) lo = m; else hi = m; } return B((lo + hi) / 2, y1, y2); };
    }
    if (/linear\(/.test(text)) { const p = text.replace(/^.*linear\(|\)\s*$/g, "").split(",").map((s) => parseFloat(s)).filter((v) => !Number.isNaN(v)); return (x) => { const i = x * (p.length - 1), a = Math.floor(i), b = Math.min(a + 1, p.length - 1); return p[a] + (p[b] - p[a]) * (i - a); }; }
    return (x) => x;
  }

  /* A field's value or placeholder is not a text node, so it gets its shapes laid over it: the same words and digits
     wrapText makes (index.jsx), in the field's own font and colour (its placeholder colour when empty), where the
     text sits. */
  const esc = (s) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  const shapes = (text) => text.split(/(\s+)/).map((w) => /^\s*$/.test(w) ? w
    : /^[:.,/%+×–—-]+$/.test(w) ? `<span class="tx tx--p">${esc(w)}</span>`
    : /\d/.test(w) && /^(?:\d|[:.,/%+×–-])+$/.test(w) ? [...w].map((c) => `<span class="tx tx--${/\d/.test(c) ? "d" : "p"}">${esc(c)}</span>`).join("")
    : `<span class="tx">${esc(w)}</span>`).join("");
  function fieldText(z, local) {
    for (const el of z.querySelectorAll("input, textarea, select")) {
      if (/^(checkbox|radio|range|hidden|color|file)$/.test(el.type) || !el.getClientRects().length) continue;
      const value = el.matches("select") ? el.selectedOptions[0]?.text || "" : el.value;
      const text = value || el.placeholder || "";
      if (!text.trim()) continue;
      const c = getComputedStyle(el), r = local(el.getBoundingClientRect()), px = (p) => parseFloat(c[p]) || 0;
      const o = document.createElement("div");
      o.className = "af-value";
      const left = px("borderLeftWidth") + px("paddingLeft"), right = px("borderRightWidth") + px("paddingRight") + (el.matches("select") ? 20 : 0);
      const top = px("borderTopWidth") + px("paddingTop"), bottom = px("borderBottomWidth") + px("paddingBottom");
      Object.assign(o.style, { left: `${r.x + left}px`, top: `${r.y + top}px`, width: `${Math.max(0, r.w - left - right)}px`, height: `${Math.max(0, r.h - top - bottom)}px`,
        font: c.font, letterSpacing: c.letterSpacing, textAlign: c.textAlign, color: value ? c.color : "var(--area-input-placeholder, var(--area-fg-muted))",
        whiteSpace: el.matches("textarea") ? "pre-wrap" : "pre", alignItems: el.matches("textarea") ? "start" : "center" });
      o.innerHTML = `<span>${shapes(text)}</span>`;
      z.append(o);
    }
  }

  function hold(st, z, f, fidelity) {
    z = z.firstElementChild;
    const box = z.getBoundingClientRect();
    const local = (r) => ({ x: (r.left - box.left) / f, y: (r.top - box.top) / f, w: r.width / f, h: r.height / f });
    if (fidelity === "bars" || fidelity === "line") fieldText(z, local);
    for (const s of z.querySelectorAll("[data-af-ghosts]")) {
      const spec = s.dataset.afGhosts, input = s.querySelector("input") || s, r = local(input.getBoundingClientRect());
      let ps = spec.split(",").map(Number);
      if (spec.startsWith("ease:")) { const n = Number(spec.slice(5)), e = easeOf(getComputedStyle(st).getPropertyValue("--area-ease-in-out")); ps = Array.from({ length: n }, (_, i) => Math.min(e(i / n), 1.08)); }
      const g = document.createElement("div");
      g.className = "af-ghosts";
      g.innerHTML = ps.map((p) => `<i style="left:${(r.x + 8 + p * (r.w - 16)).toFixed(1)}px;top:${(r.y + r.h / 2).toFixed(1)}px"></i>`).join("");
      z.append(g);
    }
    for (const t of z.querySelectorAll("[data-af-pointer]")) {
      const r = local(t.getBoundingClientRect());
      z.insertAdjacentHTML("beforeend", POINTER);
      const p = z.lastElementChild;
      p.style.left = `${(r.x + Math.min(r.w * 0.7, r.w - 12)).toFixed(1)}px`;
      p.style.top = `${(r.y + r.h * 0.55).toFixed(1)}px`;
    }
  }

  /* Hold the states a screen marks with data-st (screens.jsx): the component's own hover, press, focus, lift or
     selection, painted still, and the pointer on what it would be over. "menu" shows the screen's hidden menu. */
  function holdStates(st, z, want) {
    if (want.includes("menu")) st.classList.add("st-show-menu");
    for (const s of want) {
      if (s === "menu") continue;
      const t = z.querySelector(`[data-st="${s === "hover-edge" ? "focus" : s}"]`);
      if (!t) continue;
      if (s === "hover" || s === "hover-edge") t.classList.add(t.matches(".area-button, .area-nav__item") ? "st-hover" : t.matches(".sx-mrow, .sx-librow") ? "st-hover-row" : "st-hover-field");
      if (s === "press") t.classList.add("st-press");
      if (s === "focus") t.classList.add(t.matches(".area-button") ? "st-focus" : "st-focus-field");
      if (s === "lift") t.classList.add("st-lift");
      if (s === "selected") t.setAttribute("data-selected", "");
      if (["hover", "hover-edge", "press", "lift"].includes(s)) t.setAttribute("data-af-pointer", "");
    }
  }

  /* The drawing's painted box, in screen px: every leaf, and every element that paints a fill, an edge or a shadow,
     skipping the frame's own wrappers (a full-width wrapper would otherwise pull the centre off its content) and
     cut to what its clipping ancestors show (a tall panel in a vignette's frame counts only its visible part). */
  const WRAP = ".af-zoom, .af-tile, .af-tile__demo, .sx-iso, .af-ghosts, .af-value";
  function painted(z) {
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    const clips = new Map();
    const clipOf = (el) => {
      if (!el || el === z) return null;
      if (clips.has(el)) return clips.get(el);
      let c = clipOf(el.parentElement);
      if (getComputedStyle(el).overflow !== "visible") { const q = el.getBoundingClientRect(); c = c ? { left: Math.max(c.left, q.left), top: Math.max(c.top, q.top), right: Math.min(c.right, q.right), bottom: Math.min(c.bottom, q.bottom) } : q; }
      clips.set(el, c);
      return c;
    };
    for (const el of z.querySelectorAll("*")) {
      if (el.matches(WRAP)) continue;
      const box = el.getBoundingClientRect(), c = clipOf(el.parentElement);
      const q = c ? { left: Math.max(box.left, c.left), top: Math.max(box.top, c.top), right: Math.min(box.right, c.right), bottom: Math.min(box.bottom, c.bottom) } : box;
      if (q.right - q.left < 0.5 || q.bottom - q.top < 0.5) continue;
      let shows = !el.firstElementChild || el.matches("svg, img, input, textarea, select, video");
      if (!shows) { const c = getComputedStyle(el); shows = (c.backgroundColor !== "rgba(0, 0, 0, 0)" && c.backgroundColor !== "transparent") || parseFloat(c.borderTopWidth) > 0 || parseFloat(c.borderLeftWidth) > 0 || c.boxShadow !== "none" || c.backgroundImage !== "none"; }
      if (!shows) continue;
      if (el.closest("svg") && el.tagName.toLowerCase() !== "svg") continue;
      l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom);
    }
    return l === Infinity ? null : { l, t, r, b };
  }

  /* Fit and centre on what is painted: "contain" leaves `pad` of the frame around it (up to `max`), "cover" fills the
     frame edge to edge, "right" fills its height against the right edge (a drawer), "width" fills its width, centred
     top to bottom (a titlebar, the top of a window). */
  function centre(st, z, mode, pad, max) {
    const f0 = parseFloat(st.style.getPropertyValue("--af-fit")) || 1, p0 = painted(z);
    if (!p0) return;
    const w = (p0.r - p0.l) / f0, h = (p0.b - p0.t) / f0, W = st.clientWidth, H = st.clientHeight;
    const f = mode === "cover" ? Math.max(W / w, H / h) : mode === "right" ? H / h : mode === "width" ? W / w : Math.min(max, (W * pad) / w, (H * pad) / h);
    st.style.setProperty("--af-fit", f.toFixed(4));
    const box = st.getBoundingClientRect(), p = painted(z);
    st.style.setProperty("--af-dx", `${(mode === "right" ? box.left + W - p.r : box.left + W / 2 - (p.l + p.r) / 2).toFixed(1)}px`);
    st.style.setProperty("--af-dy", `${(box.top + H / 2 - (p.t + p.b) / 2).toFixed(1)}px`);
  }

  function stage(parent, { html, w = 280, h = 180, fidelity = "bars", scope = {}, states = [], fit = "fill", pad = 0.8, max = w / 280, center = null } = {}) {
    const st = document.createElement("div");
    /* Line reads the components as Area paints them first (engine/line.js), so it starts plain. */
    st.className = `af-stage af-${fidelity === "line" ? "plain" : fidelity}`;
    st.style.setProperty("--af-w", `${w}px`);
    st.style.setProperty("--af-h", `${h}px`);
    for (const [k, v] of Object.entries(scope)) if (v != null) st.setAttribute(k, v);
    /* Each stage is its own form: radio names must not join across stages. */
    st.innerHTML = `<div class="af-z" inert><div class="af-zoom">${html.replace(/name="([^"]+)"/g, (_, n) => `name="${n}-${++uid}"`)}</div></div>`;
    parent.append(st);
    const z = st.firstElementChild;
    holdStates(st, z, states);
    const f = typeof fit === "number" ? fit : Math.min(max, (w * pad) / Math.max(1, z.offsetWidth), (h * pad) / Math.max(1, z.offsetHeight));
    st.style.setProperty("--af-fit", f.toFixed(4));
    hold(st, z, f, fidelity);
    if (fidelity === "line") {
      const ground = groundOf(st);
      st.style.setProperty("--af-ground", ground);
      markLines(z.firstElementChild, ground);
      st.classList.replace("af-plain", "af-line");
    }
    if (center) centre(st, z, center, pad, max);
    return st;
  }

  return { stage, easeOf, painted, centre };
})();

export { AFS };
