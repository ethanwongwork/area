/**
 * The fix the sweep points to: solve the inks against the tinted colours they sit on, not the gray of the same lightness.
 * For each hue and strength, find the lightest muted, body and edge ink (light; darkest in dark) that clears every check
 * on every ground and Layers step, and report how far it moved from today's ink. Run with node.
 */
import { writeFileSync } from "node:fs";
import { GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, LAYER_STEPS, layerHex, layerLightness, type Cast } from "../../../packages/tokens/src/color/layers.ts";
import { wcagContrastHex } from "../../../packages/tokens/src/color/contrast.ts";
import { type Rgb, parseHex, toHex } from "../../../packages/tokens/src/color/oklab.ts";

const markOver = (theme: "light" | "dark", hex: string, keep = theme === "light" ? 0.94 : 0.9) =>
  toHex(parseHex(hex).map(c => theme === "light" ? c * keep : c * keep + (1 - keep)) as Rgb);

/** How far (in OKLCH L) the muted ink must move, at worst over every ground and step, for this tint to pass. */
function shift(theme: "light" | "dark", cast: Cast) {
  let worst = 0, edgeWorst = 0;
  for (const g of theme === "light" ? GROUND_LIGHT_STEPS : GROUND_DARK_STEPS) for (const n of LAYER_STEPS) {
    const m = layerLightness(theme, g, n), hx = (L: number) => layerHex(theme, L, cast);
    const surfaces: string[] = [];
    for (const name of ["page", "raised", "recessed"] as const) {
      const ground = m[name], [rest, hover, selected] = m.fill[name];
      surfaces.push(...[ground, rest, hover, selected].map(hx), markOver(theme, hx(ground)));
      if (theme === "light" && name !== "recessed") surfaces.push(markOver(theme, hx(ground), 0.893));
    }
    const passes = (L: number, target: number, list: string[]) => list.every(bg => wcagContrastHex(hx(L), bg) >= target);
    const move = (from: number, target: number, list: string[]) => {
      let d = 0; while (d < 0.3 && !passes(theme === "light" ? from - d : from + d, target, list)) d += 0.001; return d;
    };
    worst = Math.max(worst, move(m.ink.muted, 4.5, surfaces));
    const edgeOn = (["page", "raised", "recessed"] as const).flatMap(name => [m[name], m.fill[name][0]].map(hx));
    edgeWorst = Math.max(edgeWorst, move(m.ink.edge, 3, edgeOn));
  }
  return { muted: Number(worst.toFixed(3)), edge: Number(edgeWorst.toFixed(3)) };
}

const HUES = Array.from({ length: 24 }, (_, i) => i * 15), CHROMAS = [0.01, 0.02, 0.03, 0.04, 0.06];
const out: Record<string, Record<string, Record<string, { muted: number; edge: number }>>> = { light: {}, dark: {} };
for (const theme of ["light", "dark"] as const) for (const c of CHROMAS) { out[theme][c] = {}; for (const h of HUES) out[theme][c]![h] = shift(theme, { hue: h, chroma: c }); }
writeFileSync(new URL("./solve.json", import.meta.url), JSON.stringify({ hues: HUES, chromas: CHROMAS, out }, null, 1));
for (const theme of ["light", "dark"] as const) for (const c of CHROMAS) {
  const v = HUES.map(h => out[theme][c]![h]!.muted);
  console.log(theme, c, "muted ink shift max", Math.max(...v).toFixed(3), "at hue", HUES[v.indexOf(Math.max(...v))], "| edge max", Math.max(...HUES.map(h => out[theme][c]![h]!.edge)).toFixed(3));
}
