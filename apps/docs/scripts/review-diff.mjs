/**
 * Which specimens look different between two builds (owner, 2026-10-09: "make it clear what variants have
 * actually changed"). Markup equality says little: a CSS change restyles a tile whose markup is identical, and a
 * new React id changes markup that looks the same. So each tile is rendered with its own build's stylesheet in
 * headless Edge or Chrome, in light and dark at the default Layers and at each theme's Layers extreme (light: a 90 page,
 * layer contrast 0; dark: a 24 page, contrast 8; the density axis this once compared is gone), and fingerprinted by what can be
 * seen: every element's box (to half a pixel), its paint, type, outline and SVG geometry, and its text.
 *
 *   const changes = visualChanges({ dist, beforeDist, tiles: [{ key, now, before }] });
 *   // → { [key]: { state: "changed" | "unchanged" | "new", modes: ["light default", ...] } }
 */
import { execFileSync } from "node:child_process";
import { existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BROWSERS = ["/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium"];
// [name, the specimen's data-area-* attributes]. The Layers extremes are where the 2026-10-16 sweep found the failures.
export const MODES = [
  ["light", { theme: "light" }],
  ["dark", { theme: "dark" }],
  // `layers` for builds before 2026-10-17, when layer contrast split into `layers-light` and `layers-dark`.
  ["light 90 + 0", { theme: "light", groundLight: "90", layers: "0", layersLight: "0" }],
  ["dark 24 + 8", { theme: "dark", groundDark: "24", layers: "8", layersDark: "8" }],
  // Controls shown only on hover or focus (Board's card actions, Nav's revealed actions): each of the specimen's
  // controls focused in turn, so a change to what appears is seen (round 31: the card actions read as unchanged at rest).
  ["light focused", { theme: "light", focus: true }],
];

// Runs in the page: one fingerprint per tile per mode, written into <pre id="out">.
const MEASURE = `
// Only what paints counts, so a wrapper added or removed without a visible effect (Scroll area's viewport) does not
// flag a variant: fills, borders, shadows, outlines, SVG shapes, replaced elements and pseudo-elements by their box,
// and text by its line boxes, font and ink. Lines are sorted, so the order elements sit in the DOM does not matter.
const BOX = ["background-color", "background-image", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "border-top-left-radius", "border-top-right-radius",
  "border-bottom-right-radius", "border-bottom-left-radius", "box-shadow", "outline-style", "outline-width", "outline-color", "outline-offset",
  "fill", "stroke", "stroke-width", "transform", "filter", "mix-blend-mode", "backdrop-filter"];
const TEXT = ["color", "font-family", "font-size", "font-weight", "font-style", "letter-spacing", "text-decoration-line", "text-decoration-color",
  "text-decoration-thickness", "text-underline-offset", "-webkit-text-fill-color"];
const REPLACED = new Set(["img", "video", "canvas", "input", "textarea", "select", "iframe", "hr"]);
const hash = text => { let h = 0x811c9dc5; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16); };
const r2 = v => Math.round(v * 2) / 2;
// Colours by what paints, not how they are written: color-mix() computes to oklab(), which reads as a change from the
// rgb() it equals. Each colour is painted over white and over black and read back as 8-bit RGBA.
const cv = document.createElement("canvas"); cv.width = cv.height = 1;
const cx = cv.getContext("2d", { willReadFrequently: true });
const painted = new Map();
const paintOf = c => {
  if (painted.has(c)) return painted.get(c);
  const over = ground => { cx.globalCompositeOperation = "copy"; cx.fillStyle = ground; cx.fillRect(0, 0, 1, 1); cx.globalCompositeOperation = "source-over"; cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); return cx.getImageData(0, 0, 1, 1).data; };
  const w = over("#fff"), b = over("#000"), a = 1 - (w[0] - b[0]) / 255;
  const out = a <= 0.002 ? "transparent" : "rgba(" + [0, 1, 2].map(i => Math.round(b[i] / a)).join(",") + "," + a.toFixed(2) + ")";
  painted.set(c, out); return out;
};
const COLOR = /(?:oklab|oklch|lab|lch|color|rgba?|hsla?|hwb)\\([^()]*\\)/g;
const norm = v => String(v).replace(COLOR, paintOf);
function print(root) {
  const o = root.getBoundingClientRect(), lines = [], alpha = new Map([[root, 1]]);
  const at = r => [r2(r.x - o.x), r2(r.y - o.y), r2(r.width), r2(r.height)].join(",");
  for (const el of root.querySelectorAll("*")) {
    const s = getComputedStyle(el);
    const a = (alpha.get(el.parentElement) ?? 1) * Number(s.opacity);
    alpha.set(el, a);
    if (s.display === "none" || s.visibility === "hidden" || a === 0) continue;
    const box = el.getBoundingClientRect();
    const paints = s.backgroundColor !== "rgba(0, 0, 0, 0)" || s.backgroundImage !== "none" || s.boxShadow !== "none" || s.outlineStyle !== "none"
      || ["top", "right", "bottom", "left"].some(side => parseFloat(s.getPropertyValue("border-" + side + "-width")) > 0 && s.getPropertyValue("border-" + side + "-style") !== "none")
      || (el instanceof SVGElement && !(el instanceof SVGSVGElement) && el.localName !== "g") || REPLACED.has(el.localName);
    if (paints) lines.push(["box", el.localName, at(box), a.toFixed(2), ...BOX.map(p => norm(s.getPropertyValue(p))), el.getAttribute("d") || "", el.value ?? ""].join("|"));
    for (const p of ["::before", "::after"]) {
      const q = getComputedStyle(el, p);
      if (q.content !== "none" && q.content !== "normal") lines.push(["pseudo", p, at(box), q.content, q.width, q.height, q.inset, norm(q.backgroundColor), q.borderTopWidth, norm(q.borderTopColor), q.borderRadius, norm(q.boxShadow), q.transform, q.opacity].join("|"));
    }
    // An underline is drawn by the box that declares it (a link around a span), and is not inherited in computed
    // style: each text run carries the decorations of its ancestors too.
    let decorations = "";
    for (let up = el; up && up !== root; up = up.parentElement) {
      const d = getComputedStyle(up);
      if (d.textDecorationLine !== "none") decorations += [d.textDecorationLine, d.textDecorationColor, d.textDecorationThickness, d.textUnderlineOffset, d.color].join(",") + ";";
    }
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      lines.push(["text", node.textContent.trim().slice(0, 80), [...range.getClientRects()].map(at).join(";"), a.toFixed(2), ...TEXT.map(p => norm(s.getPropertyValue(p))), norm(decorations)].join("|"));
    }
  }
  return hash(lines.sort().join("\\n"));
}
(async () => {
  // A headless DOM dump draws no frames, so no requestAnimationFrame: layout reads force style and layout.
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 50));
  const out = {};
  for (const [name, attrs] of ${JSON.stringify(MODES)}) {
    for (const c of document.querySelectorAll(".c")) {
      for (const k of ["areaGroundLight", "areaGroundDark", "areaLayers", "areaLayersLight", "areaLayersDark"]) delete c.dataset[k];
      for (const [k, v] of Object.entries(attrs)) if (k !== "focus") c.dataset["area" + k[0].toUpperCase() + k.slice(1)] = v;
    }
    await new Promise(r => setTimeout(r, 50));
    for (const c of document.querySelectorAll(".c")) {
      if (!attrs.focus) { (out[c.dataset.key] ??= {})[name] = print(c); continue; }
      // Each control in turn (up to 12), so whatever any of them reveals is seen.
      const prints = [];
      for (const el of [...c.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")].slice(0, 12)) {
        el.focus({ preventScroll: true }); prints.push(print(c));
      }
      document.activeElement?.blur();
      (out[c.dataset.key] ??= {})[name] = prints.join(",");
    }
  }
  document.getElementById("out").textContent = JSON.stringify(out);
})();`;

function fingerprints(dist, tiles, browser) {
  const page = join(dist, "__review-diff.html");
  writeFileSync(page, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="area.css">
<style>body{margin:0;position:relative}.c{position:absolute;inset-inline-start:0;inline-size:720px;padding:32px 24px;box-sizing:border-box;display:grid;place-items:center;transition:none!important}.c *,.c *::before,.c *::after{transition:none!important;animation:none!important}</style></head><body>
${/* Each specimen in its own whole-pixel slot: in a stacked page a tile added or removed above shifts the rest by
     a fraction of a pixel, and pixel snapping then reads as a change. */ ""}
${tiles.map((t, i) => `<div class="c area-scope" style="inset-block-start:${i * 3000}px" data-key="${t.key}" data-area-theme="light">${t.html}</div>`).join("\n")}
<pre id="out"></pre><script>${MEASURE}</script></body></html>`);
  try {
    const dom = execFileSync(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=800,1000", "--virtual-time-budget=30000", "--dump-dom", `file://${page}`], { encoding: "utf8", maxBuffer: 1 << 28, timeout: 180000, stdio: ["ignore", "pipe", "ignore"] });
    const json = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/)?.[1];
    if (!json) throw new Error("the measuring page wrote nothing");
    return JSON.parse(json.replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">"));
  } finally { rmSync(page, { force: true }); }
}

export function visualChanges({ dist, beforeDist, tiles }) {
  const browser = BROWSERS.find(b => !b.startsWith("/") || existsSync(b));
  const result = {};
  for (const t of tiles) if (t.before == null) result[t.key] = { state: "new", modes: [] };
  const compared = tiles.filter(t => t.before != null);
  if (!compared.length) return result;
  if (!browser) { for (const t of compared) result[t.key] = { state: "unknown", modes: [] }; return result; }
  const now = fingerprints(dist, compared.map(t => ({ key: t.key, html: t.now })), browser);
  const then = fingerprints(beforeDist, compared.map(t => ({ key: t.key, html: t.before })), browser);
  for (const t of compared) {
    const modes = MODES.map(([name]) => name).filter(m => now[t.key]?.[m] !== then[t.key]?.[m]);
    result[t.key] = { state: modes.length ? "changed" : "unchanged", modes };
  }
  return result;
}
