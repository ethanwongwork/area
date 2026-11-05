/*
 * Area figures: the Line drawing's pass (owner, 2026-11-04: "a cohesive, consistent style that is visually appealing
 * and high fidelity ... im really liking the last few line art examples showing cosmetic products"). Line draws Area's
 * real components as a technical line drawing: one ink, one 1px line, no shadows, on the page's ground. CSS alone
 * can't tell which parts paint (a card drawn by its fill, a row by its plate, a thumb by its shadow), so this pass reads
 * the components as Area paints them, under the plain drawing, and marks each part for abstract.css's Line rules:
 *
 *   an edge it draws        stays an edge, every side 1px on screen (style: border width = --af-line)
 *   a fill or shadow alone  becomes an outline that follows its corners (af-e), a light one or a strong one: a strong
 *                           fill the size of a control (a primary button, a checked box, an on switch) keeps a light
 *                           tone of the ink (af-tone); a larger one (a bezel, a dark panel) is its outline alone
 *   a dot (8px or less)     solid ink (af-dot): a status mark, a radio's dot
 *   a picture               its box with a cross, as drawings mark an image (af-pic, an overlay at its place)
 *   a heading's words       outlined at the cap height (tx--h); every other word is one rule (abstract.css)
 *
 * Shared by the skill's bench (engine/stage.js) and the app's Illustrations page (apps/desktop/src/pages/illustrations.tsx).
 * Measured from the references in docs/research/illustrations-2026-11-04 (README): a 1px line, ink about 55% grey, ink on
 * under 2% of the frame.
 */

const RGBA = new Map();
let pen = null;
/** Any CSS colour as [r, g, b, a] (0–255, a 0–1), read back through a 1 × 1 canvas so oklch and color() work too. */
export function rgba(color) {
  if (RGBA.has(color)) return RGBA.get(color);
  if (!pen) { const c = document.createElement("canvas"); c.width = c.height = 1; pen = c.getContext("2d", { willReadFrequently: true }); }
  pen.clearRect(0, 0, 1, 1);
  pen.fillStyle = "#000"; pen.fillStyle = color;
  pen.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = pen.getImageData(0, 0, 1, 1).data;
  const out = [r, g, b, a / 255];
  RGBA.set(color, out);
  return out;
}
const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
const over = (top, under) => top[3] >= 1 ? top : [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3])).concat(1);

/** The colour behind an element: its own fill, or the first ancestor's that paints one (white when none does). */
export function groundOf(el) {
  for (let at = el; at; at = at.parentElement) {
    const bg = getComputedStyle(at).backgroundColor;
    if (rgba(bg)[3] > 0.5) return bg;
  }
  return "#fff";
}

/* Parts the pass never marks: the frame's own wrappers, overlays it adds, and an icon's insides. */
const SKIP = ".af-zoom, .af-tile, .af-tile__demo, .sx-iso, .af-ghosts, .af-value, .af-pic, .af-pointer, .tx, svg *";
/* Pictures: images, video, and the blank media blocks the screens and cards draw. */
const PICTURE = "img, video, .sx-media, .area-card__media, .area-asset-card__media, .area-file-image__media";
/* Raised layers: what Area lifts off the page (a card, a menu, a toast, a dialog, a phone, a window), so a style's
   shadow knows what to lift even where the theme draws them flat. */
const RAISED = ".area-card, .area-menu, .area-popover, .area-toast, .area-dialog, .area-hover-card, .area-command-palette, .area-composer, .sx-window, .sx-phone, .sx-menu";
/* A shadow that lifts: some layer, not inset, offset or blurred (a ring of spread alone is an edge, not a lift). */
const lifts = (shadow) => shadow.split(/,(?![^(]*\))/).some((layer) => {
  if (/inset/.test(layer)) return false;
  const [x = 0, y = 0, blur = 0] = (layer.replace(/(rgba?|oklch|oklab|color|lab|lch|hsla?)\([^)]*\)/g, "").match(/-?[\d.]+px/g) || []).map(parseFloat);
  return Boolean(x || y || blur);
});
const grey = (c) => { const g = Math.round(lum(c) * 255); return `rgb(${g} ${g} ${g})`; };

/**
 * Mark a figure for the Line drawing. `root` is the zoomed figure (.af-zoom), laid out and painted plainly; `ground` is
 * the colour behind it (the stage's). Call before the stage takes .af-line; the marks are inert under every other drawing.
 */
export function markLines(root, ground) {
  const base = rgba(ground);
  const behind = new Map([[root, base]]);
  const backdrop = (el) => {
    if (!el || el === root.parentElement) return base;
    if (behind.has(el)) return behind.get(el);
    const under = backdrop(el.parentElement), c = getComputedStyle(el), bg = rgba(c.backgroundColor);
    const out = bg[3] > 0.02 ? over(bg, under) : under;
    behind.set(el, out);
    return out;
  };
  const box0 = root.getBoundingClientRect();
  const zoom = parseFloat(getComputedStyle(root).zoom) || 1;
  for (const el of root.querySelectorAll("*")) {
    if (el.matches(SKIP) || el.closest(".af-pic")) continue;
    const c = getComputedStyle(el);
    if (c.display === "none" || c.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width < 0.5 && r.height < 0.5) continue;
    const w = r.width / zoom, h = r.height / zoom;
    const under = backdrop(el.parentElement), bg = rgba(c.backgroundColor);
    const fill = bg[3] > 0.02 ? over(bg, under) : null;
    const contrast = fill ? Math.abs(lum(fill) - lum(under)) : 0;
    const sides = ["Top", "Right", "Bottom", "Left"].filter((s) => parseFloat(c[`border${s}Width`]) > 0 && c[`border${s}Style`] !== "none" && rgba(c[`border${s}Color`])[3] > 0.05);
    for (const s of sides) el.style.setProperty(`border-${s.toLowerCase()}-width`, "var(--af-line)");
    if (el.matches(PICTURE)) { picture(root, el, box0, zoom); continue; }
    // Marks drawn as pseudo-elements (a tab's current bar, a status dot, a check's tick box): a small or thin one is ink,
    // any other is drawn by its edges alone (abstract.css clears pseudo fills).
    for (const at of ["before", "after"]) {
      const p = getComputedStyle(el, `::${at}`);
      if (p.content === "none" || p.display === "none" || rgba(p.backgroundColor)[3] < 0.05) continue;
      const pw = parseFloat(p.width) || 0, ph = parseFloat(p.height) || 0;
      if ((pw && pw <= 8.5 && ph && ph <= 8.5) || (ph && ph <= 3) || (pw && pw <= 3)) el.classList.add(`af-ink-${at}`);
    }
    if (el.matches("svg")) continue;
    const shadow = c.boxShadow !== "none" && !/^(rgba\(0, 0, 0, 0\)|transparent)/.test(c.boxShadow);
    // What a style may give back: the part's own fill (in colour, or as its grey), how far it stands from what is
    // behind it, and its own shadow. A raised layer is lifted by a style's shadow.
    const outer = shadow && lifts(c.boxShadow);
    if (outer || (el.matches(RAISED) && w >= 60 && h >= 24)) { el.classList.add("af-raise"); if (shadow) el.style.setProperty("--af-sh", c.boxShadow); }
    if (fill && contrast > 0.012) {
      el.classList.add("af-f");
      el.style.setProperty("--af-c", c.backgroundColor);
      el.style.setProperty("--af-g", grey(fill));
      el.style.setProperty("--af-k", Math.min(1, contrast * 3).toFixed(3));
    } else if (sides.length === 4 && w * h >= 400) el.classList.add("af-s");
    const paints = (fill && contrast > 0.012) || c.backgroundImage !== "none" && !/^url/.test(c.backgroundImage) || shadow;
    if (!paints) continue;
    if (w <= 8.5 && h <= 8.5 && !el.firstElementChild) { el.classList.add("af-dot"); continue; }
    // A 1px rule drawn as a fill (a separator, a divider): keep it a line.
    if ((h <= 2 || w <= 2) && fill) { el.classList.add("af-rule"); continue; }
    if (sides.length < 4) el.classList.add("af-e");
    // The tone marks what is on or primary, a control's size; a large strong fill (a device's bezel, a dark panel) is
    // drawn by its edge alone, so a screen never goes grey.
    if (fill && contrast > 0.28 && w * h <= 360 * 64) el.classList.add("af-tone");
  }
  // Headings: words set large or heavy are outlined at the cap height; the rest are rules.
  const body = parseFloat(getComputedStyle(root).fontSize) || 14;
  for (const t of root.querySelectorAll(".tx:not(.tx--p)")) {
    const c = getComputedStyle(t), size = parseFloat(c.fontSize), weight = parseFloat(c.fontWeight);
    if (size >= Math.max(17, body * 1.2) || (weight >= 600 && size >= 15)) t.classList.add("tx--h");
  }
}

/* A picture: an outlined box with a cross corner to corner, laid over it in the figure's own coordinates. */
function picture(root, el, box0, zoom) {
  const r = el.getBoundingClientRect(), c = getComputedStyle(el);
  const x = (r.left - box0.left) / zoom, y = (r.top - box0.top) / zoom, w = r.width / zoom, h = r.height / zoom;
  if (w < 4 || h < 4) return;
  const o = document.createElement("div");
  o.className = "af-pic";
  Object.assign(o.style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, borderRadius: c.borderRadius });
  // The cross (a drawing's mark for an image) and a glyph (a sun over a hill); the style shows one, or a tone, or hatching.
  o.innerHTML = `<svg class="af-pic__cross" width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="0" x2="100%" y2="100%"/><line x1="100%" y1="0" x2="0" y2="100%"/></svg>`
    + `<svg class="af-pic__glyph" viewBox="0 0 24 24" aria-hidden="true"><circle cx="8.5" cy="8.5" r="2"/><path d="M3 18l5.5-6 4 4 3-3L21 18"/></svg>`;
  el.classList.add("af-picd");
  root.append(o);
}
