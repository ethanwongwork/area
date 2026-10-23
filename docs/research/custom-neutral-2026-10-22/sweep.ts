/**
 * Custom neutral tint sweep (2026-10-22): for each hue and strength (OKLCH chroma), run every check the Layers gate runs
 * (packages/tokens/src/color/layers.test.ts, "every combination is usable") over every ground and every Layers step, and
 * report the strongest tint each hue passes in each mode. Run: node docs/research/custom-neutral-2026-10-22/sweep.ts
 */
import { writeFileSync } from "node:fs";
import { GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, LAYER_STEPS, layerHex, layerLightness, type Cast } from "../../../packages/tokens/src/color/layers.ts";
import { wcagContrastHex } from "../../../packages/tokens/src/color/contrast.ts";
import { type Rgb, parseHex, toHex } from "../../../packages/tokens/src/color/oklab.ts";

const MIN = { light: { fill: 0.017, hover: 0.009, selected: 0.035, frame: 0.03 }, dark: { fill: 0.035, hover: 0.035, selected: 0.07, frame: 0.06 } };
const markOver = (theme: "light" | "dark", hex: string, keep = theme === "light" ? 0.94 : 0.9) =>
  toHex(parseHex(hex).map(c => theme === "light" ? c * keep : c * keep + (1 - keep)) as Rgb);

/** The failures of one tint in one mode, as the gate counts them; and the worst text ratio seen. */
function check(theme: "light" | "dark", cast: Cast, inkCast: Cast = cast) {
  const problems: string[] = [];
  let worst = Infinity;
  for (const g of theme === "light" ? GROUND_LIGHT_STEPS : GROUND_DARK_STEPS) for (const n of LAYER_STEPS) {
    const m = layerLightness(theme, g, n), hx = (L: number) => layerHex(theme, L, cast), at = `${g}/${n}`;
    // --margin k: the inks move k × strength away from their ground (darker in light, lighter in dark), the CSS-friendly fix.
    const k = MARGIN * cast.chroma, ink = (L: number) => layerHex(theme, theme === "light" ? L - k : L + k, inkCast);
    const body = ink(m.ink.body), muted = ink(m.ink.muted), edge = ink(m.ink.edge);
    for (const [name, ground] of [["page", m.page], ["raised", m.raised], ["recessed", m.recessed]] as const) {
      const [rest, hover, selected] = m.fill[name];
      for (const bg of [ground, rest, hover, selected]) { const r = wcagContrastHex(muted, hx(bg)); worst = Math.min(worst, r); if (r < 4.5) problems.push(`${at} muted on ${name}`); }
      if (wcagContrastHex(muted, markOver(theme, hx(ground))) < 4.5) problems.push(`${at} muted on a mark on ${name}`);
      if (theme === "light" && name !== "recessed" && wcagContrastHex(muted, markOver(theme, hx(ground), 0.893)) < 4.5) problems.push(`${at} muted on a hovered mark on ${name}`);
      if (wcagContrastHex(body, hx(selected)) < 4.5) problems.push(`${at} body on ${name} selected`);
      for (const bg of [ground, rest]) if (wcagContrastHex(edge, hx(bg)) < 3) problems.push(`${at} control edge on ${name}`);
    }
  }
  return { problems, worst };
}

const HUES = Array.from({ length: 24 }, (_, i) => i * 15);
const CHROMAS = [0, 0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04, 0.05, 0.06, 0.08];
const NEUTRAL_INK = process.argv.includes("--neutral-ink");
const MARGIN = Number(process.argv.find(a => a.startsWith("--margin="))?.slice(9) ?? 0);
const result: Record<string, Record<string, { max: number; firstFailure?: string; worstAtMax: number }>> = { light: {}, dark: {} };
for (const theme of ["light", "dark"] as const) for (const hue of HUES) {
  let max = -1, firstFailure: string | undefined, worstAtMax = 0;
  for (const chroma of CHROMAS) {
    const { problems, worst } = check(theme, { hue, chroma }, NEUTRAL_INK ? { hue, chroma: 0 } : { hue, chroma });
    if (problems.length) { firstFailure = `${chroma}: ${problems[0]} (+${problems.length - 1})`; break; }
    max = chroma; worstAtMax = worst;
  }
  result[theme][hue] = { max, firstFailure, worstAtMax: Number(worstAtMax.toFixed(2)) };
}
writeFileSync(new URL(NEUTRAL_INK ? "./sweep-neutral-ink.json" : MARGIN ? `./sweep-margin-${MARGIN}.json` : "./sweep.json", import.meta.url), JSON.stringify({ hues: HUES, chromas: CHROMAS, result }, null, 1));
for (const theme of ["light", "dark"] as const) console.log(theme, HUES.map(h => `${h}:${result[theme][h]!.max}`).join("  "));
for (const theme of ["light", "dark"] as const) console.log(theme, "first failures:", [...new Set(HUES.map(h => result[theme][h]!.firstFailure?.split(":").slice(1).join(":").replace(/\(\+\d+\)/, "").trim().replace(/^\d+\/\d+ /, "")))].slice(0, 6));
