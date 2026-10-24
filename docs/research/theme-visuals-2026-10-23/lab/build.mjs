// Lab: proposed setting visuals drawn with Area's real CSS and markup (menus, Inspector fields, Setup choice cards).
// node build.mjs → lab.html; capture.mjs screenshots each [data-cap] section in light and dark.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO = join(import.meta.dirname, "../../../..");
const CAP = import.meta.dirname;
const LABELS = JSON.parse(readFileSync(join(CAP, "labels.json"), "utf8"));
const TOKENS = JSON.parse(readFileSync(join(REPO, "packages/tokens/dist/tokens.json"), "utf8"));
const presets = id => TOKENS.axes.find(a => a.id === id)?.presets.map(p => p.id);

// Inspector menus in order (labels.json index → setting id and attribute).
const IDS = ["neutral", "tint-hue", "tint-light", "ink-tint", "accent", "ground-light", "layers-light", "card-tone-light", "contrast",
  "density", "radius", "pills", "surface", "stroke", "stroke-hover", "selected-stroke", "focus-ring", "shadow-rest", "elevation",
  "shadow-resting", "shadow-hover", "shadow-field", "shadow-size", "shadow-softness", "shadow-light", "shadow-color", "fill-hover",
  "fill-selected", "fill-pressed", "selected-tint", "motion", "easing", "material", "m-angle", "m-gradient", "m-sheen",
  "m-transparency", "m-frost", "m-stroke", "m-inner", "m-softness", "m-catch", "m-emboss", "m-contact", "m-glow", "m-grain", "m-page-glow"];
const MATERIAL = ["none", "glass", "tactile", "jelly", "soft", "aero", "glow"];
const PILLS = ["button", "field", "segmented", "chip", "badge", "count", "switch", "avatar"];
const SETTINGS = Object.fromEntries(IDS.map((id, i) => {
  const l = LABELS[i];
  const values = id === "contrast" ? ["system", "0", "1", "2", "3", "4", "5", "6", "7", "8"] : id === "material" ? MATERIAL : id === "pills" ? PILLS
    : id.startsWith("m-") ? l.options.map(o => o.text.match(/^-?[\d.]+/)[0]) : presets(id);
  return [id, { id, name: l.label, group: l.group, options: l.options.map((o, j) => ({ label: o.text, value: values[j], selected: o.selected })) }];
}));

// The Canvas defaults, as the app writes them on <html>.
const DEFAULTS = { "data-area-type": "14", "data-area-density": "32", "data-area-neutral": "neutral", "data-area-tint-hue": "auto", "data-area-tint-light": "auto",
  "data-area-tint-dark": "auto", "data-area-ink-tint": "2", "data-area-accent": "blue", "data-area-ground-light": "100", "data-area-ground-dark": "8",
  "data-area-layers-light": "4", "data-area-layers-dark": "4", "data-area-card-tone-light": "auto", "data-area-card-tone-dark": "auto",
  "data-area-action": "neutral", "data-area-selection": "accent", "data-area-radius": "8", "data-area-surface": "1", "data-area-shadow-rest": "0",
  "data-area-elevation": "3", "data-area-stroke": "4", "data-area-shadow-resting": "3", "data-area-shadow-field": "0", "data-area-shadow-size": "4",
  "data-area-shadow-softness": "2", "data-area-shadow-light": "0", "data-area-shadow-color": "black", "data-area-stroke-hover": "2",
  "data-area-selected-stroke": "2", "data-area-focus-ring": "hug", "data-area-shadow-hover": "3", "data-area-fill-hover": "2", "data-area-fill-selected": "1",
  "data-area-fill-pressed": "4", "data-area-selected-tint": "none", "data-area-motion": "210", "data-area-easing": "standard", "data-area-pills": "chip badge count switch avatar" };
const attrs = o => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(" ");
/** The scope an option paints under: its own attribute over the defaults. */
function scope(id, value) {
  if (id === "contrast") return value === "system" ? {} : { "data-area-contrast": value };
  if (id === "material") return { "data-area-material": value };
  if (id.startsWith("m-")) return { [`data-area-material-${id.slice(2)}`]: value };
  if (id === "pills") return {};
  const s = { [`data-area-${id}`]: value };
  if (id.endsWith("-light")) s["data-area-theme"] = "light";
  if (id === "layers-light" || id === "card-tone-light" || id === "tint-light" || id === "ground-light") s["data-area-theme"] = "light";
  // The shadow detail settings read on the floating menu, at Floating 8 (as Browse draws them).
  if (["shadow-size", "shadow-softness", "shadow-light", "shadow-color"].includes(id)) s["data-area-elevation"] = "8";
  return s;
}

/* ---------------- Glyphs: 16 box, icon stroke weight, currentColor, exaggerated steps ---------------- */
let uid = 0;
const t01 = (setting, value) => { const nums = setting.options.map(o => Number(o.value)).filter(n => !Number.isNaN(n)); const v = Number(value); if (Number.isNaN(v)) return null; const lo = Math.min(...nums), hi = Math.max(...nums); return hi === lo ? 0 : (v - lo) / (hi - lo); };
const S = (body, defs = "") => `<svg class="g" viewBox="0 0 16 16" aria-hidden="true">${defs ? `<defs>${defs}</defs>` : ""}${body}</svg>`;
const FRAME = (o = 1, extra = "") => `<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" stroke-opacity="${o}" ${extra}/>`;
const DASH = S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" stroke-dasharray="2 1.6" stroke-opacity=".7"/>`);
const GHOST = S(FRAME(0.28));
/** A shadow outside a card: an offset or spread rect, optionally blurred, clipped to outside the card. */
function lift({ x = 2.5, y = 2.5, w = 11, h = 11, r = 2.5, dx = 0, dy = 0, spread = 0, blur = 0, alpha = 0.3, color = "currentColor", card = "" }) {
  const id = `c${++uid}`, fid = `f${uid}`;
  const clip = `<clipPath id="${id}"><path clip-rule="evenodd" d="M-4 -4H20V20H-4Z M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z"/></clipPath>`;
  const filt = blur ? `<filter id="${fid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur}"/></filter>` : "";
  const sh = alpha > 0 ? `<g clip-path="url(#${id})"><rect x="${x - spread + dx}" y="${y - spread + dy}" width="${w + 2 * spread}" height="${h + 2 * spread}" rx="${r + spread}" fill="${color}" fill-opacity="${alpha}" stroke="none" ${blur ? `filter="url(#${fid})"` : ""}/></g>` : "";
  return S(`${sh}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>${card}`, clip + filt);
}
const POINTER = `<path d="M10.2 8.6v6.2l1.6-1.5 1.1 2.2 1.1-.55-1.1-2.2h2.2z" fill="currentColor" stroke="var(--_g-bg)" stroke-width=".9" stroke-linejoin="round"/>`;
const ROWS = (alpha, check = false) => S(`<path d="M4 3h8M4 13h8" stroke-opacity=".4"/><rect x="1.5" y="5.25" width="13" height="5.5" rx="1.75" fill="currentColor" fill-opacity="${alpha}" stroke="none"/>${check ? `<path d="M10 8l1.2 1.2L13 7" stroke-width=".95"/>` : ""}`);
/** A drop for a lift setting: none at 0, then a visible step each value (exaggerated; the stage shows the true shadow). */
const DROP = (v, t) => Number(v) ? { dy: 0.9 + 3.4 * t, dx: (0.9 + 3.4 * t) * 0.45, alpha: 0.26 + 0.26 * t } : { alpha: 0 };
const NOISE = Array.from({ length: 40 }, (_, i) => [3.4 + ((i * 37) % 97) / 97 * 9.2, 3.4 + ((i * 61 + 13) % 89) / 89 * 9.2]);

const GLYPH = {
  "tint-light": (v, t) => v === "auto" ? DASH : S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="oklch(0.74 0.12 70)" fill-opacity="${0.06 + 0.6 * t}" stroke-opacity=".55"/>`),
  "layers-light": (v, t) => S(`<rect x="1.5" y="3" width="13" height="10" rx="2"/><path d="M2.1 3.6H6V12.4H2.1Z" fill="currentColor" fill-opacity="${0.34 * t}" stroke="none"/><path d="M6 3.4v9.2" stroke-opacity="${0.15 + 0.5 * t}"/><rect x="7.6" y="6" width="5" height="4" rx="1" stroke-width=".9"/>`),
  "card-tone-light": (v) => {
    if (v === "auto") return S(`<rect x="1.5" y="3" width="13" height="10" rx="2" stroke-dasharray="2 1.6" stroke-opacity=".7"/><rect x="4.5" y="5.5" width="7" height="5" rx="1.25" stroke-opacity=".6"/>`);
    const k = Number(v); const page = k > 0 ? k * 0.09 : 0, card = k < 0 ? -k * 0.09 : 0;
    return S(`<rect x="1.5" y="3" width="13" height="10" rx="2" fill="currentColor" fill-opacity="${page}"/><rect x="4.5" y="5.5" width="7" height="5" rx="1.25" fill="${k > 0 ? "var(--_g-bg)" : "currentColor"}" fill-opacity="${k > 0 ? 1 : card}" stroke-opacity=".6"/>`);
  },
  contrast: (v, t) => v === "system" ? S(`<rect x="1.5" y="4.5" width="13" height="7" rx="2" stroke-dasharray="2 1.6" stroke-opacity=".7"/>`) : S(`<rect x="1.5" y="4.5" width="13" height="7" rx="2" stroke-opacity="${0.25 + 0.75 * t}" stroke-width="${1 + 0.6 * t}" style="stroke-width:calc(var(--area-weight-icon) * ${1 + 0.6 * t})"/><path d="M4 8h5" stroke-opacity="${0.25 + 0.75 * t}"/>`),
  surface: (v) => Number(v) === 0 ? GHOST : S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" style="stroke-width:${v}px"/>`),
  stroke: (v, t) => Number(v) === 0 ? GHOST : S(FRAME(0.12 + 0.88 * t)),
  "stroke-hover": (v, t) => S(`<rect x="1.5" y="1.5" width="10" height="10" rx="2.25" stroke-opacity="${Number(v) === 0 ? 0.3 : 0.3 + 0.7 * t}"/>${POINTER}`),
  "shadow-rest": (v, t) => S(`${Number(v) ? `<path d="M3.6 ${13.5 + 0.3 + t * 1.2}H12.4" stroke-opacity="${0.15 + 0.6 * t}" style="stroke-width:calc(var(--area-weight-icon) * ${1 + t})"/>` : ""}<rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/>`),
  elevation: (v, t) => lift({ x: 2, y: 1.5, w: 10, h: 10, ...DROP(v, t), card: `<path d="M4.5 5.5h5M4.5 8h5M4.5 10.5h3" stroke-opacity=".5" stroke-width=".9"/>` }),
  "shadow-resting": (v, t) => lift({ x: 2, y: 1.5, w: 10, h: 10, ...DROP(v, t) }),
  "shadow-hover": (v, t) => lift({ x: 1.5, y: 1, w: 9.5, h: 9.5, r: 2.25, ...DROP(v, t), card: POINTER }),
  "shadow-field": (v, t) => lift({ x: 1.5, y: 3, w: 13, h: 7, r: 2, ...DROP(v, t), card: `<path d="M4 7.5h5" stroke-opacity=".5"/>` }),
  "shadow-size": (v, t) => lift({ x: 3.5, y: 3, w: 9, h: 9, r: 2.25, dy: 0.8, spread: 0.5 + t * 2.4, alpha: 0.2, blur: 0.25 }),
  "shadow-softness": (v, t) => lift({ x: 2.5, y: 2, w: 10, h: 10, dx: 1.2, dy: 2.4, blur: 0.05 + t * 1.25, alpha: 0.42 }),
  "shadow-light": (v, t) => lift({ x: 3, y: 2.5, w: 10, h: 10, dy: t * 3, spread: 1.4 * (1 - t), blur: 0.3, alpha: 0.32 }),
  "shadow-color": (v) => lift({ x: 2, y: 2, w: 10, h: 10, dx: 1.5, dy: 3, blur: 0.3, alpha: v === "black" ? 0.4 : 0.75, color: v === "warm" ? "oklch(0.6 0.13 55)" : v === "cool" ? "oklch(0.6 0.12 250)" : "currentColor" }),
  "fill-hover": (v) => ROWS(0.06 + 0.07 * Number(v)),
  "fill-selected": (v) => ROWS(0.13 + 0.06 * Number(v), true),
  "fill-pressed": (v) => ROWS(0.12 + 0.09 * Number(v)),
  "selected-tint": (v) => S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" style="stroke:var(--area-stroke-selected);stroke-width:1.5px;${v === "tint" ? "fill:var(--area-stroke-selected);fill-opacity:.2" : v === "neutral" ? "fill:currentColor;fill-opacity:.16" : ""}"/>`),
  pills: (v) => ({
    button: S(`<rect x="1.5" y="4.5" width="13" height="7" rx="3.5" fill="currentColor"/>`),
    field: S(`<rect x="1.5" y="4.5" width="13" height="7" rx="3.5"/><path d="M4.5 8h4" stroke-opacity=".5"/>`),
    segmented: S(`<rect x="1" y="4.5" width="14" height="7" rx="3.5"/><rect x="2.6" y="6.1" width="5.4" height="3.8" rx="1.9" fill="currentColor" stroke="none"/>`),
    chip: S(`<rect x="2.5" y="5" width="11" height="6" rx="3"/><path d="M5.5 8h5" stroke-opacity=".6"/>`),
    badge: S(`<rect x="3" y="5.5" width="10" height="5" rx="2.5" fill="currentColor" fill-opacity=".22" stroke="none"/><path d="M5.5 8h5" stroke-opacity=".75"/>`),
    count: S(`<rect x="4.5" y="4.5" width="7" height="7" rx="3.5" fill="currentColor" fill-opacity=".22" stroke="none"/><path d="M8 6.4v3.2" stroke-opacity=".8"/>`),
    switch: S(`<rect x="1.5" y="4.5" width="13" height="7" rx="3.5"/><circle cx="11" cy="8" r="2" fill="currentColor" stroke="none"/>`),
    avatar: S(`<circle cx="8" cy="8" r="5.5"/><circle cx="8" cy="6.8" r="1.7" stroke-width=".9"/><path d="M5.1 11.6c.6-1.3 1.6-1.9 2.9-1.9s2.3.6 2.9 1.9" stroke-width=".9"/>`),
  })[v],
  material: (v) => {
    const id = `m${++uid}`;
    switch (v) {
      case "none": return S(FRAME());
      case "glass": return S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="currentColor" fill-opacity=".07" stroke-opacity=".6"/><path d="M5 9.5 9.5 5M5 12 12 5" stroke-opacity=".55" stroke-width=".9"/>`);
      case "tactile": return S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/><path d="M4.2 11.6H11.8" stroke-opacity=".45" style="stroke-width:calc(var(--area-weight-icon) * 1.8)"/>`);
      case "jelly": return S(`<rect x="2.5" y="2.5" width="11" height="11" rx="4.5" fill="currentColor" fill-opacity=".1"/><ellipse cx="8" cy="5.6" rx="3.4" ry="1.4" fill="currentColor" fill-opacity=".22" stroke="none"/>`);
      case "soft": return lift({ x: 2.5, y: 2.5, w: 11, h: 11, dy: 1.2, spread: 0.6, blur: 1.1, alpha: 0.35 });
      case "aero": return S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="url(#${id})"/><path d="M3.4 8H12.6" stroke-opacity=".4" stroke-width=".9"/>`, `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".26"/><stop offset=".5" stop-color="currentColor" stop-opacity=".04"/><stop offset="1" stop-color="currentColor" stop-opacity=".12"/></linearGradient>`);
      case "glow": return lift({ x: 3, y: 3, w: 10, h: 10, spread: 1.3, blur: 1, alpha: 0.6, color: "var(--area-accent-solid)" });
    }
  },
  "m-angle": (v) => { const a = (Number(v) - 90) * Math.PI / 180, x = 8 + 5.8 * Math.cos(a), y = 8 + 5.8 * Math.sin(a), x2 = 8 + 2.6 * Math.cos(a), y2 = 8 + 2.6 * Math.sin(a); return S(`<circle cx="8" cy="8" r="5.8" stroke-opacity=".3"/><path d="M${x2.toFixed(2)} ${y2.toFixed(2)}L${x.toFixed(2)} ${y.toFixed(2)}"/><circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.7" fill="currentColor" stroke="none"/>`); },
  "m-gradient": (v, t) => { const id = `g${++uid}`; return Number(v) ? S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="url(#${id})"/>`, `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity="0"/><stop offset="1" stop-color="currentColor" stop-opacity="${0.08 + 0.5 * t}"/></linearGradient>`) : GHOST; },
  "m-sheen": (v, t) => Number(v) ? S(`${FRAME()}<path d="M4.6 9.4 9.4 4.6M4.6 12 12 4.6" stroke-opacity="${0.15 + 0.7 * t}" stroke-width=".9"/>`) : GHOST,
  "m-transparency": (v, t) => { const id = `k${++uid}`; return S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" fill="url(#${id})" stroke="none"/><rect x="2.5" y="2.5" width="11" height="11" rx="2.5" style="fill:var(--_g-bg)" fill-opacity="${1 - 0.85 * t}"/>`, `<pattern id="${id}" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="1.5" height="1.5" fill="currentColor" fill-opacity=".38"/><rect x="1.5" y="1.5" width="1.5" height="1.5" fill="currentColor" fill-opacity=".38"/></pattern>`); },
  "m-frost": (v, t) => { const id = `b${++uid}`; return S(`${FRAME()}<g ${Number(v) ? `filter="url(#${id})"` : ""}><circle cx="6.2" cy="6.6" r="1.4" fill="currentColor" stroke="none" fill-opacity=".6"/><path d="M5 10.6h6" stroke-opacity=".6"/><circle cx="10.2" cy="6.8" r=".9" fill="currentColor" stroke="none" fill-opacity=".6"/></g>`, `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${0.2 + 0.9 * t}"/></filter>`); },
  "m-stroke": (v, t) => S(`${FRAME(0.28)}${Number(v) ? `<path d="M2.5 7V5A2.5 2.5 0 0 1 5 2.5H11A2.5 2.5 0 0 1 13.5 5V7" stroke-opacity="${0.2 + 0.8 * t}" style="stroke-width:calc(var(--area-weight-icon) * 1.35)"/>` : ""}`),
  "m-inner": (v, t) => { const id = `i${++uid}`; return S(`<g clip-path="url(#${id})"><path d="M2 2H14V4.6H4.6V14H2Z" fill="currentColor" fill-opacity="${0.45 * t}" stroke="none"/></g>${FRAME()}`, `<clipPath id="${id}"><rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/></clipPath>`); },
  "m-softness": (v, t) => { const id = `i${++uid}`; return S(`<g clip-path="url(#${id})"><path d="M2 2H14V4.6H4.6V14H2Z" fill="currentColor" fill-opacity=".4" stroke="none" filter="url(#${id}f)"/></g>${FRAME()}`, `<clipPath id="${id}"><rect x="2.5" y="2.5" width="11" height="11" rx="2.5"/></clipPath><filter id="${id}f" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${0.05 + 1.3 * t}"/></filter>`); },
  "m-catch": (v, t) => Number(v) ? S(`${FRAME()}<path d="M4.6 11.4H11.4" stroke-opacity="${0.2 + 0.8 * t}" stroke-width=".9"/>`) : GHOST,
  "m-emboss": (v, t) => Number(v) ? S(`<path d="M4 14.6H12.2A2.4 2.4 0 0 0 14.6 12.2V4" stroke-opacity="${0.2 + 0.6 * t}" style="stroke-width:calc(var(--area-weight-icon) * ${1 + 0.8 * t})"/>${FRAME()}`) : GHOST,
  "m-contact": (v, t) => { const id = `e${++uid}`; return S(`<ellipse cx="8" cy="13.6" rx="5.4" ry="1.3" fill="currentColor" fill-opacity="${0.55 * t}" stroke="none" filter="url(#${id})"/><rect x="2.5" y="1.5" width="11" height="10" rx="2.5" style="fill:var(--_g-bg)"/>`, `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".45"/></filter>`); },
  "m-glow": (v, t) => Number(v) ? lift({ x: 3, y: 3, w: 10, h: 10, spread: 0.6 + 1.2 * t, blur: 0.9, alpha: 0.2 + 0.55 * t, color: "var(--area-accent-solid)" }) : GHOST,
  "m-grain": (v, t) => S(`${FRAME()}${NOISE.slice(0, Math.round(40 * t)).map(([x, y]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r=".42" fill="currentColor" fill-opacity=".6" stroke="none"/>`).join("")}`),
  "m-page-glow": (v, t) => { const id = `p${++uid}`; return S(`<rect x="1.5" y="3" width="13" height="10" rx="2" fill="url(#${id})"/>`, `<radialGradient id="${id}" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="var(--area-accent-solid)" stop-opacity="${0.75 * t}"/><stop offset="1" stop-color="var(--area-accent-solid)" stop-opacity="0"/></radialGradient>`); },
};
// Settings whose marks already read keep today's drawing (option-marks.tsx), reproduced here.
const SW = (fill, sc = {}) => `<svg class="g" viewBox="0 0 16 16" aria-hidden="true" ${attrs(sc)}><rect x="2.5" y="2.5" width="11" height="11" rx="3" style="fill:${fill};stroke:var(--area-token-swatch-ring);stroke-width:var(--area-stroke-width)"/></svg>`;
const CURVES = { standard: [0.65, 0, 0.35, 1], snappy: [0.6, 0, 0.2, 1], gentle: [0.33, 0, 0.67, 1], spring: [0.175, 0.885, 0.32, 1.275] };
Object.assign(GLYPH, {
  neutral: (v) => SW("var(--area-neutral-500)", { "data-area-neutral": v }),
  "tint-hue": (v) => SW(v === "auto" ? "var(--area-neutral-500)" : `oklch(0.72 0.12 ${v})`),
  "ink-tint": (v) => SW("var(--area-fg-muted)", { "data-area-ink-tint": v }),
  "ground-light": (v) => SW("var(--area-bg-page)", { "data-area-theme": "light", "data-area-ground-light": v }),
  accent: (v) => SW("var(--area-accent-solid)", { "data-area-accent": v }),
  density: (v) => { const h = (Number(v) / 36) * 10; return S(`<rect x="1.5" y="${8 - h / 2}" width="13" height="${h}" rx="2.5"/>`); },
  radius: (v) => S(`<rect x="1.5" y="3" width="13" height="10" rx="${v === "pill" ? 5 : (Number(v) * 10) / 32}"/>`),
  motion: (v) => { const f = Number(v) / 300, a = f * 2 * Math.PI - Math.PI / 2, x = 8 + 6 * Math.cos(a), y = 8 + 6 * Math.sin(a); return S(`<circle cx="8" cy="8" r="6"/>${f > 0 ? (f >= 1 ? `<circle cx="8" cy="8" r="6" fill="currentColor"/>` : `<path d="M8 8V2A6 6 0 ${f > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)}Z" fill="currentColor" stroke="none"/>`) : ""}`); },
  easing: (v) => { const [x1, y1, x2, y2] = CURVES[v]; const at = (x, y) => `${2 + x * 12} ${14 - y * 12}`; return S(`<path d="M${at(0, 0)} C${at(x1, y1)} ${at(x2, y2)} ${at(1, 1)}"/>`); },
  "selected-stroke": (v) => S(`<rect x="2.5" y="2.5" width="11" height="11" rx="2.5" style="stroke:var(--area-stroke-selected);stroke-width:${Number(v) * 0.75 + 0.5}px"/>`),
  "focus-ring": (v) => { const r = { hug: [0, 1.25, 0], gap: [1.5, 1.25, 0], halo: [0, 1, 2.5], inset: [-2, 1.25, 0], bold: [0, 2.2, 0] }[v]; const o = r[0]; return S(`<rect x="3.5" y="4.5" width="9" height="7" rx="2" stroke-opacity=".45"/>${r[2] ? `<rect x="${3.5 - r[2]}" y="${4.5 - r[2]}" width="${9 + 2 * r[2]}" height="${7 + 2 * r[2]}" rx="${2 + r[2]}" style="stroke:var(--area-focus-color);stroke-opacity:.3;stroke-width:${r[2]}px"/>` : ""}<rect x="${3.5 - o - 0.6}" y="${4.5 - o - 0.6}" width="${9 + 2 * (o + 0.6)}" height="${7 + 2 * (o + 0.6)}" rx="${2.6 + o}" style="stroke:var(--area-focus-color);stroke-width:${r[1]}px"/>`); },
});
const glyph = (id, value) => GLYPH[id](value, t01(SETTINGS[id], value) ?? 0);

/* ---------------- Menus (Custom select's listbox, real classes) ---------------- */
const CHECK = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" data-area-glyph="check"><path d="M3 8L6.5 11.5L13.5 4.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
const CHEVRON = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true" data-area-glyph="chevron-down"><path d="M3.5 5.5L8 10L12.5 5.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;
const GRIDICON = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1.2" stroke="currentColor" style="stroke-width:var(--area-weight-icon)"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1.2" stroke="currentColor" style="stroke-width:var(--area-weight-icon)"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1.2" stroke="currentColor" style="stroke-width:var(--area-weight-icon)"/><rect x="9" y="9" width="4.5" height="4.5" rx="1.2" stroke="currentColor" style="stroke-width:var(--area-weight-icon)"/></svg>`;
const LISTICON = `<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 4h11M2.5 8h11M2.5 12h11" stroke="currentColor" stroke-linecap="round" style="stroke-width:var(--area-weight-icon)"/></svg>`;
const item = (icon, label, selected, extra = "") => `<div role="option" aria-selected="${selected}" class="area-menu__item area-custom-select__option ${extra}">${icon !== null ? `<span class="area-menu__icon" aria-hidden="true">${icon}</span>` : ""}<span class="area-menu__text">${label}</span><span class="area-menu__check" aria-hidden="true">${CHECK}</span></div>`;
const listbox = (inner, style = "") => `<div class="area-scroll-area area-menu area-custom-select__listbox lab-pop" role="listbox" style="${style}"><div class="area-scroll-area__viewport"><div class="area-scroll-area__content">${inner}</div></div></div>`;
function listMenu(id, { max = 99, footer = false, mark = glyph } = {}) {
  const s = SETTINGS[id];
  const opts = s.options.slice(0, max).map(o => item(mark(id, o.value), o.label, o.selected)).join("");
  const foot = footer ? `<div class="area-menu__separator lab-sep" role="separator"></div>${item(GRIDICON, "Show previews", false, "lab-more")}` : "";
  return listbox(opts + foot);
}

/* ---------------- Figures: the Folder / File page outline look, painted by the option's real tokens ---------------- */
const bars = (n, w = [70, 52, 60]) => Array.from({ length: n }, (_, i) => `<i class="f-bar" style="inline-size:${w[i % w.length]}%"></i>`).join("");
const FIG = {
  radius: () => `<div class="f-center"><div class="f-field" style="inline-size:72%;block-size:42%;border-radius:var(--area-radius-control-lg);display:flex;align-items:center;justify-content:space-between;padding-inline:10%"><i class="f-bar" style="inline-size:38%"></i><span class="f-btn" style="inline-size:30%;block-size:56%;border-radius:var(--area-radius-control-sm)"></span></div></div>`,
  density: () => `<div class="f-list" style="--_row:calc(var(--area-control-md) * 0.55 - 4px)">${[0, 1, 2].map(i => `<div class="f-row ${i === 0 ? "is-on" : ""}"><i class="f-dot"></i><i class="f-bar" style="inline-size:${[56, 44, 50][i]}%"></i></div>`).join("")}</div>`,
  window: () => `<div class="f-window"><div class="f-side">${bars(3, [70, 54, 62])}</div><div class="f-main"><i class="f-bar f-bar--title" style="inline-size:46%"></i><div class="f-card">${bars(2, [64, 44])}<span class="f-field f-field--mini"></span></div></div></div>`,
  ground: () => `<div class="f-page f-center"><div class="f-card" style="inline-size:62%">${bars(2, [64, 44])}<span class="f-field f-field--mini"></span></div></div>`,
  contrast: () => `<div class="f-center f-stack"><span class="f-field f-field--edge" style="inline-size:70%;block-size:22%"></span><div style="display:flex;gap:8%;inline-size:70%;align-items:center"><span class="f-box"></span><span class="f-outline-btn" style="inline-size:52%;block-size:100%"></span></div></div>`,
  surface: () => `<div class="f-page f-center"><div class="f-card f-card--line" style="inline-size:64%;block-size:58%">${bars(2, [60, 40])}</div></div>`,
  stroke: () => `<div class="f-page f-center"><div class="f-card f-card--line" style="inline-size:68%;block-size:64%"><i class="f-bar" style="inline-size:50%"></i><i class="f-rule"></i><span class="f-field f-field--edge" style="block-size:26%"></span></div></div>`,
  "stroke-hover": () => `<div class="f-center" style="gap:8%;display:flex"><span class="f-field f-field--edge" style="inline-size:38%;block-size:30%"></span><span class="f-field f-field--edge f-field--hover" style="inline-size:38%;block-size:30%;position:relative"><span class="f-pointer"></span></span></div>`,
  "shadow-rest": () => `<div class="f-page f-center"><div class="f-card f-card--bare" style="inline-size:60%;block-size:56%;box-shadow:var(--area-shadow-edge)">${bars(2, [60, 40])}</div></div>`,
  "shadow-resting": () => `<div class="f-page f-center"><div class="f-card f-card--bare" style="inline-size:60%;block-size:56%;box-shadow:var(--area-shadow-resting)">${bars(2, [60, 40])}</div></div>`,
  "shadow-hover": () => `<div class="f-page f-center"><div class="f-card f-card--bare" style="inline-size:60%;block-size:56%;box-shadow:var(--area-shadow-lift);position:relative">${bars(2, [60, 40])}<span class="f-pointer" style="inset:auto -6% -12% auto"></span></div></div>`,
  "shadow-field": () => `<div class="f-page f-center f-stack"><span class="f-field f-field--edge" style="inline-size:70%;block-size:24%;box-shadow:var(--area-shadow-field)"></span><span class="f-outline-btn" style="inline-size:40%;block-size:22%;box-shadow:var(--area-shadow-field)"></span></div>`,
  menu: () => `<div class="f-page f-center"><div class="f-menu" style="box-shadow:var(--area-shadow-float)">${[0, 1, 2].map(i => `<div class="f-row ${i === 1 ? "is-on" : ""}"><i class="f-bar" style="inline-size:${[60, 48, 54][i]}%"></i></div>`).join("")}</div></div>`,
  fills: (id) => `<div class="f-page f-center"><div class="f-menu f-menu--flat">${[["", 58], ["hover", 46], ["active", 52], ["pressed", 40]].map(([k, w]) => `<div class="f-row f-row--${k || "rest"} ${id === `fill-${k === "active" ? "selected" : k}` ? "is-mine" : ""}"><i class="f-bar" style="inline-size:${w}%"></i></div>`).join("")}</div></div>`,
  selected: () => `<div class="f-page f-center"><div class="f-card f-card--selected" style="inline-size:62%;block-size:56%">${bars(2, [60, 40])}</div></div>`,
  focus: () => `<div class="f-page f-center"><span class="f-field f-field--edge f-field--focus" style="inline-size:68%;block-size:28%"></span></div>`,
  motion: (id, v) => `<div class="f-center" style="inline-size:76%"><div class="f-track"><i style="inline-size:${(Number(v) / 300) * 100}%"></i><b style="inset-inline-start:calc(${(Number(v) / 300) * 100}% - 7px)"></b></div></div>`,
  easing: (id, v) => { const c = { standard: [0.65, 0, 0.35, 1], snappy: [0.6, 0, 0.2, 1], gentle: [0.33, 0, 0.67, 1], spring: [0.175, 0.885, 0.32, 1.275] }[v]; const at = (x, y) => `${10 + x * 80} ${62 - y * 50}`; return `<svg class="f-svg" viewBox="0 0 100 72" aria-hidden="true"><path d="M10 62H90M10 12H90" class="f-guide"/><path d="M${at(0, 0)} C${at(c[0], c[1])} ${at(c[2], c[3])} ${at(1, 1)}" class="f-curve"/><circle cx="${10 + 80}" cy="12" r="3.5" class="f-dotsvg"/></svg>`; },
  type: () => `<div class="f-center f-stack" style="align-items:flex-start;inline-size:70%"><span class="f-aa">Aa</span>${bars(2, [90, 64])}</div>`,
  pills: (id, v) => `<div class="f-center">${{ button: `<span class="f-btn" style="inline-size:52%;block-size:26%;border-radius:999px"></span>`, field: `<span class="f-field f-field--edge" style="inline-size:70%;block-size:26%;border-radius:999px"></span>`, segmented: `<span class="f-seg"><i class="is-on"></i><i></i><i></i></span>`, chip: `<span class="f-outline-btn" style="inline-size:42%;block-size:24%;border-radius:999px"></span>`, badge: `<span class="f-badge"></span>`, count: `<span class="f-badge" style="inline-size:20%;aspect-ratio:1;block-size:auto"></span>`, switch: `<span class="f-switch"><b></b></span>`, avatar: `<span class="f-avatar"></span>` }[v]}</div>`,
  material: (id, v) => `<div class="f-page f-center f-stack" data-area-material="${v}"><button class="area-button area-button--solid area-button--neutral area-button--sm" type="button" tabindex="-1"><span class="area-button__label">Button</span></button></div>`,
  glyph: (id, v) => `<div class="f-center f-bigglyph">${glyph(id, v)}</div>`,
};
const FIG_OF = { radius: "radius", density: "density", neutral: "window", "tint-light": "window", "ink-tint": "window", "ground-light": "ground", "layers-light": "window", "card-tone-light": "ground",
  contrast: "contrast", surface: "surface", stroke: "stroke", "stroke-hover": "stroke-hover", "shadow-rest": "shadow-rest", "shadow-resting": "shadow-resting", "shadow-hover": "shadow-hover",
  "shadow-field": "shadow-field", elevation: "menu", "shadow-size": "menu", "shadow-softness": "menu", "shadow-light": "menu", "shadow-color": "menu", "fill-hover": "fills", "fill-selected": "fills",
  "fill-pressed": "fills", "selected-stroke": "selected", "selected-tint": "selected", "focus-ring": "focus", motion: "motion", easing: "easing", pills: "pills", material: "material" };
const figure = (id, value) => `<span class="f" ${attrs(scope(id, value))}>${FIG[FIG_OF[id] ?? "glyph"](id, value)}</span>`;

/* ---------------- Grid menu: the listbox at the field's width, choices as figure cards ---------------- */
function gridMenu(id, { cols = 3, width = 268, header = true } = {}) {
  const s = SETTINGS[id];
  const swatch = id === "accent" || id === "tint-hue";
  const cells = s.options.map(o => swatch
    ? `<div role="option" aria-selected="${o.selected}" class="gm-swatch" title="${o.label}"><span class="gm-dot" ${attrs(id === "accent" ? { "data-area-accent": o.value } : {})} style="${id === "tint-hue" ? `background:${o.value === "auto" ? "var(--area-neutral-500)" : `oklch(0.72 0.12 ${o.value})`}` : ""}"></span>${id === "accent" ? `<span class="gm-label">${o.label}</span>` : ""}</div>`
    : `<div role="option" aria-selected="${o.selected}" class="gm-item"><span class="gm-plate">${figure(id, o.value)}</span><span class="gm-label">${o.label}</span></div>`).join("");
  const head = header ? `<div class="gm-head"><span>${s.name}</span><span class="gm-views"><span class="gm-view" aria-pressed="false" title="List">${LISTICON}</span><span class="gm-view" aria-pressed="true" title="Grid">${GRIDICON}</span></span></div>` : "";
  return `<div class="area-scroll-area area-menu area-custom-select__listbox lab-pop lab-grid" role="listbox" style="inline-size:${width}px">${head}<div class="gm ${swatch ? "gm--swatch" : ""}" style="--cols:${swatch ? (id === "accent" ? 4 : 8) : cols}">${cells}</div></div>`;
}

/* ---------------- Inspector panel mock (296 wide), one trigger open ---------------- */
const field = (id, open = false) => {
  const s = SETTINGS[id]; const sel = s.options.find(o => o.selected) ?? s.options[0];
  const icon = ["pills"].includes(id) ? null : (id === "accent" ? `<span class="gm-dot gm-dot--sm" data-area-accent="${sel.value}"></span>` : glyph(id, sel.value));
  return `<div class="area-field area-field--horizontal"><label class="area-field__label">${s.name}</label><div class="area-custom-select area-custom-select--soft area-custom-select--sm area-custom-select--full-width" ${open ? 'data-open=""' : ""}><button type="button" class="area-custom-select__trigger" aria-expanded="${open}" tabindex="-1">${icon ? `<span class="area-custom-select__icon" aria-hidden="true">${icon}</span>` : ""}<span class="area-custom-select__value">${id === "pills" ? "Chip, Badge, Count, Switch, Avatar" : sel.label}</span><span class="area-custom-select__chevron" aria-hidden="true">${CHEVRON}</span></button></div></div>`;
};
function inspector({ heading, rows, open, menu, height = 560, topOffset }) {
  return `<div class="lab-inspector" style="block-size:${height}px"><section class="area-panel__section"><h3 class="area-panel__heading">${heading}</h3>${rows.map(r => field(r, r === open)).join("")}</section><div class="lab-anchor" data-open-row="${open}">${menu}</div></div>`;
}

/* ---------------- Setup choice cards (Radio card preview, real markup) ---------------- */
function setupGroup(id, picture, { ratio = "3 / 2", max = 6 } = {}) {
  const s = SETTINGS[id];
  const cards = s.options.slice(0, max).map(o => `<label class="area-radio area-radio--card area-radio--preview area-radio--md"><input class="area-radio__control" type="radio" ${o.selected ? "checked" : ""} name="g-${id}-${picture}" tabindex="-1"><span class="area-radio__visual" aria-hidden="true"><span class="setup-choice__picture">${picture === "folder" ? figure(id, o.value) : ""}</span></span><span class="area-choice-label"><span class="area-choice-label__title">${o.label}</span></span></label>`).join("");
  return `<section class="setup-choice lab-setup"><fieldset class="area-radio-group area-radio-group--vertical" style="--area-choice-ratio:${ratio};--area-choice-min:88px"><legend class="area-radio-group__legend">${s.name}</legend><div class="area-radio-group__options">${cards}</div></fieldset></section>`;
}

/* ---------------- Page ---------------- */
const WEAK = ["tint-light", "layers-light", "card-tone-light", "contrast", "surface", "stroke", "stroke-hover", "shadow-rest", "elevation", "shadow-resting", "shadow-hover", "shadow-field", "fill-hover", "fill-selected", "fill-pressed", "selected-tint"];
const MISSING = ["pills", "shadow-size", "shadow-softness", "shadow-light", "shadow-color", "material", "m-angle", "m-gradient", "m-sheen", "m-transparency", "m-frost", "m-stroke", "m-inner", "m-softness", "m-catch", "m-emboss", "m-contact", "m-glow", "m-grain", "m-page-glow"];
const section = (cap, body, cls = "") => `<div class="lab-cap ${cls}" data-cap="${cap}">${body}</div>`;
const parts = [];
// Menus: new glyphs, weak and missing.
for (const id of [...WEAK, ...MISSING]) parts.push(section(`menu-${id}`, listMenu(id)));
// Inspector: list (new glyphs) and grid, per setting.
const PANELS = [
  { id: "radius", heading: "Shape", rows: ["radius", "pills"] },
  { id: "layers-light", heading: "Color", rows: ["accent", "ground-light", "layers-light", "card-tone-light"] },
  { id: "elevation", heading: "Shadow", rows: ["elevation", "shadow-resting", "shadow-hover", "shadow-field"] },
  { id: "stroke", heading: "Stroke", rows: ["surface", "stroke", "stroke-hover", "selected-stroke"] },
  { id: "fill-hover", heading: "Fill", rows: ["fill-hover", "fill-selected", "fill-pressed", "selected-tint"] },
  { id: "accent", heading: "Color", rows: ["neutral", "tint-hue", "accent", "ground-light"] },
  { id: "motion", heading: "Effects", rows: ["motion", "easing"] },
  { id: "material", heading: "Material", rows: ["material", "m-angle", "m-gradient", "m-sheen"] },
];
for (const p of PANELS) {
  parts.push(section(`insp-grid-${p.id}`, inspector({ heading: p.heading, rows: p.rows, open: p.id, menu: gridMenu(p.id) })));
  parts.push(section(`insp-list-${p.id}`, inspector({ heading: p.heading, rows: p.rows, open: p.id, menu: listMenu(p.id, { footer: true }) })));
}
// Setup cards: Folder-style figures.
for (const id of ["layers-light", "radius", "elevation", "stroke", "fill-hover", "neutral", "density", "contrast", "shadow-rest", "motion", "easing", "material"]) parts.push(section(`setup-folder-${id}`, setupGroup(id, "folder")));

const html = `<!doctype html><html lang="en" ${attrs(DEFAULTS)} data-area-theme="light"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="${REPO}/packages/styles/dist/area.css">
<link rel="stylesheet" href="${REPO}/apps/desktop/src/styles/setup.css">
<link rel="stylesheet" href="lab.css">
</head><body class="lab">${parts.join("\n")}<script>
function anchor() { for (const insp of document.querySelectorAll(".lab-inspector")) {
  const trig = insp.querySelector("[data-open] .area-custom-select__trigger"); const a = insp.querySelector(".lab-anchor");
  const ir = insp.getBoundingClientRect(), tr = trig.getBoundingClientRect(), fr = trig.closest(".area-field").getBoundingClientRect();
  const grid = a.querySelector(".lab-grid");
  a.style.top = (tr.bottom - ir.top + 4) + "px"; a.style.left = ((grid ? fr.left : tr.left) - ir.left) + "px";
  if (grid) grid.style.inlineSize = fr.width + "px";
  insp.style.blockSize = Math.max(a.offsetTop + a.offsetHeight + 16, insp.querySelector("section").offsetHeight + 16) + "px";
} }
document.fonts.ready.then(anchor);
</script></body></html>`;
writeFileSync(join(import.meta.dirname, "lab.html"), html);
console.log("sections", parts.length);
