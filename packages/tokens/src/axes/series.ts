/**
 * Series lightness (colour system study, proposals 2, 4, 5 and 7; owner picked Build, 2026-11-01): how light the eight
 * series colours' luminous colour is, 66 to 80 (× 100 OKLab lightness), 79 by default, OpenAI's. Each preset writes every
 * series token, both modes, because each one is placed on the gamut edge (color/series.ts), which CSS cannot work out.
 *
 *   --area-series-<n>             the mark: lines, dots, keys, a fill's edge
 *   --area-series-<n>-fill        bars, areas, heat cells
 *   --area-series-<n>-ink         a number inside the fill
 *   --area-series-<n>-ramp-<1…7>  a sequential ramp from the ground, walking the hue (light to L 0.58, dark to the
 *                                 luminous colour)
 *
 * On a Display P3 screen the luminous colour takes P3's wider room (`seriesP3Rules`, emitted under
 * `@media (color-gamut: p3)` by emit/css.ts).
 */
import { type AxisDefinition, type TokenMap, tokens } from "./schema.ts";
import { DEFAULT_SERIES_LIGHTNESS, RAMP_STEPS, SERIES, SERIES_LIGHTNESSES, seriesColours } from "../color/series.ts";

function seriesTokens(lightness: number, mode: "light" | "dark"): TokenMap {
  const map: Record<string, string> = {};
  SERIES.forEach(({ hue }, i) => {
    const c = seriesColours(hue, lightness)[mode], n = i + 1;
    map[`series-${n}`] = c.mark;
    map[`series-${n}-fill`] = c.fill;
    map[`series-${n}-ink`] = c.ink;
    for (let step = 1; step <= RAMP_STEPS; step++) map[`series-${n}-ramp-${step}`] = c.ramp[step - 1]!;
  });
  return tokens(map);
}

export const SERIES_AXIS: AxisDefinition = {
  id: "series-lightness",
  label: "Series lightness",
  description: "How light the data colours glow: 66 (deeper) to 80 (paler); 79 is OpenAI's. Light fills, dark marks and the dark ramps follow.",
  defaultPreset: String(DEFAULT_SERIES_LIGHTNESS),
  namespaces: ["--area-series-"],
  presets: SERIES_LIGHTNESSES.map(lightness => ({
    id: String(lightness),
    label: lightness === 66 ? "66 (Deep)" : lightness === 80 ? "80 (Pale)" : String(lightness),
    description: `The luminous series colours at OKLab lightness ${(lightness / 100).toFixed(2)}.`,
    tokens: seriesTokens(lightness, "light"),
    darkTokens: seriesTokens(lightness, "dark"),
  })),
};

/** The luminous colours on a P3 screen: light's fill, dark's mark and dark ramp's end, per preset and at the root. */
export function seriesP3Rules(): Array<[string, TokenMap]> {
  const at = (lightness: number): TokenMap => {
    const map: Record<string, string> = {};
    SERIES.forEach(({ hue }, i) => {
      const c = seriesColours(hue, lightness), n = i + 1, p3 = c.p3.css;
      map[`series-${n}`] = `light-dark(${c.light.mark}, ${p3})`;
      map[`series-${n}-fill`] = `light-dark(${p3}, ${c.dark.fill})`;
      map[`series-${n}-ramp-${RAMP_STEPS}`] = `light-dark(${c.light.ramp[RAMP_STEPS - 1]}, ${p3})`;
    });
    return tokens(map);
  };
  return [
    [":where(:root)", at(DEFAULT_SERIES_LIGHTNESS)],
    ...SERIES_LIGHTNESSES.map(lightness => [`[data-area-series-lightness="${lightness}"]`, at(lightness)] as [string, TokenMap]),
  ];
}
