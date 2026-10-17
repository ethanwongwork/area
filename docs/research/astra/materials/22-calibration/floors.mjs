// Glass reading floors: the least opacity a surface needs so Area's inks keep their contrast over a black or white
// backdrop (sRGB compositing, as browsers paint). node docs/research/astra/materials/22-calibration/floors.mjs

import { layerTokens } from "../../../../../packages/tokens/src/color/layers.ts";
const lin = c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const Y = rgb => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const ratio = (a, b) => { const [x, y] = [Y(a), Y(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (fill, a, back) => fill.map((c, i) => c * a + back[i] * (1 - a)); // sRGB compositing, as browsers do
const floor = (ink, fill, need) => { for (let a = 0; a <= 1.0001; a += 0.01) { if ([[0, 0, 0], [1, 1, 1]].every(b => ratio(ink, over(fill, a, b)) >= need)) return a.toFixed(2); } return ">1"; };
for (const theme of ["light", "dark"]) {
  const t = layerTokens(theme, { groundLight: 100, groundDark: 8, layersLight: 4, layersDark: 4 }, { chroma: 0, hue: 0 });
  const surface = hex(t["bg-surface"]), field = hex(t["bg-component"]);
  console.log(theme, "surface", t["bg-surface"], "| body", t["fg-default"], "floor", floor(hex(t["fg-default"]), surface, 4.5), "| muted", t["fg-muted"], "floor", floor(hex(t["fg-muted"]), surface, 4.5), "| control edge floor (3:1)", floor(hex(t["stroke-control"]), surface, 3), "| field muted floor", floor(hex(t["fg-muted"]), field, 4.5));
}
