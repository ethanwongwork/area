/**
 * Every Layers token at a Layers position, light and dark, with its WCAG ratio and ΔE_OK from the page, flagging roles
 * that collapse onto the page (ΔE < 0.005 ≈ invisible) or onto another role.
 *   node docs/research/color-system-2026-11-01/measure-layers.ts [layers 0–8, default 0]
 */
import { layerTokens, DEFAULT_LAYER_SELECTION } from "../../../packages/tokens/src/color/layers.ts";
import { wcagContrastHex } from "../../../packages/tokens/src/color/contrast.ts";
import { SRGB, parseHex, rgbToOklab } from "../../../packages/tokens/src/color/oklab.ts";

const n = Number(process.argv[2] ?? 0);
const de = (a: string, b: string) => { const x = rgbToOklab(parseHex(a), SRGB), y = rgbToOklab(parseHex(b), SRGB); return Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b); };
for (const theme of ["light", "dark"] as const) {
  const t = layerTokens(theme, { ...DEFAULT_LAYER_SELECTION, layersLight: n, layersDark: n }, { chroma: 0, hue: 0 });
  const page = t["bg-page"]!;
  console.log(`\n${theme}  Layers ${n}  page ${page}`);
  const groups = new Map<string, string[]>();
  for (const [k, hex] of Object.entries(t)) (groups.get(hex) ?? groups.set(hex, []).get(hex)!).push(k);
  for (const [k, hex] of Object.entries(t)) {
    const d = de(hex, page);
    const same = groups.get(hex)!.filter(x => x !== k);
    console.log(`  ${k.padEnd(34)} ${hex}  ${wcagContrastHex(hex, page).toFixed(2).padStart(5)}:1  ΔE ${(d * 100).toFixed(1).padStart(4)}${d < 0.005 ? "  = PAGE" : ""}${same.length ? "  same as " + same.join(", ") : ""}`);
  }
}
