// Text on a gradient: the highest gradient lever (0–8) at which body and muted text keep 4.5:1 at the gradient's far
// ends, on a card at the default Layers settings. Factors as in gen-levers.mjs (light white 45% / black 22%; dark white
// 24% / black 45%). node docs/research/astra/materials/27-levers/caps.mjs
import { layerTokens } from "../../../../../packages/tokens/src/color/layers.ts";
const lin = c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const Y = rgb => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
const ratio = (a, b) => { const [x, y] = [Y(a), Y(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const over = (top, a, base) => base.map((c, i) => top[i] * a + c * (1 - a));
const F = { light: { white: 0.45, black: 0.22 }, dark: { white: 0.24, black: 0.45 } };
for (const theme of ["light", "dark"]) {
  const t = layerTokens(theme, { groundLight: 100, groundDark: 8, layersLight: 4, layersDark: 4 }, { chroma: 0, hue: 0 });
  const bg = hex(t["bg-surface"]);
  for (const ink of ["fg-default", "fg-muted"]) {
    let cap = 8;
    for (let n = 1; n <= 8; n++) {
      const a = n / 8, ends = [over([1, 1, 1], a * F[theme].white, bg), over([0, 0, 0], a * F[theme].black, bg)];
      if (ends.some(e => ratio(hex(t[ink]), e) < 4.5)) { cap = n - 1; break; }
    }
    console.log(`${theme} card ${t["bg-surface"]}: ${ink} ${t[ink]} holds 4.5:1 up to gradient ${cap}`);
  }
}
