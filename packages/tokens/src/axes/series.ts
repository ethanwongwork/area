/**
 * Series lightness (colour system study, proposals 2, 4, 5 and 7; owner picked Build, 2026-11-01; brightened with an
 * indigo, data views round 15; on the palette, round 18, 2026-11-02): sky's step, 350 (the default, the lightest the gate
 * passes) or 400; every series moves the same number of steps along its family. Each preset writes every series token,
 * both modes, as the family step each one is (color/series.ts).
 *
 *   --area-series-<n>             the mark: lines and a fill's edge (light: the hue at 3:1; dark: the colour)
 *   --area-series-<n>-fill        the colour: bars, areas, keys, dots, stacked parts, the same in light and dark
 *   --area-series-<n>-area        an area under a bright line (light: the colour; dark: a deep area the line clears 3:1)
 *   --area-series-<n>-ink         a number inside the fill
 *   --area-series-<n>-ramp-<1…7>  a sequential ramp from the ground, walking the hue (light to L 0.58, dark to the
 *                                 colour)
 *
 * On a Display P3 screen the colour takes P3's wider room (`seriesP3Rules`, emitted under `@media (color-gamut: p3)` by
 * emit/css.ts).
 */
import { type AxisDefinition, type TokenMap, tokens } from "./schema.ts";
import { DEFAULT_SERIES_STEP, RAMP_STEPS, SERIES, SERIES_STEPS, seriesColours } from "../color/series.ts";

function seriesTokens(lightness: number, mode: "light" | "dark"): TokenMap {
  const map: Record<string, string> = {};
  SERIES.forEach((series, i) => {
    const c = seriesColours(series, lightness)[mode], n = i + 1;
    map[`series-${n}`] = c.mark;
    map[`series-${n}-fill`] = c.fill;
    map[`series-${n}-area`] = c.area;
    map[`series-${n}-ink`] = c.ink;
    for (let step = 1; step <= RAMP_STEPS; step++) map[`series-${n}-ramp-${step}`] = c.ramp[step - 1]!;
  });
  return tokens(map);
}

export const SERIES_AXIS: AxisDefinition = {
  id: "series-lightness",
  label: "Series lightness",
  description: "How deep the data colors sit on their palette families, as sky's step: 350 (the lightest) or 400. Every series moves the same number of steps.",
  defaultPreset: String(DEFAULT_SERIES_STEP),
  namespaces: ["--area-series-"],
  presets: SERIES_STEPS.map(lightness => ({
    id: String(lightness),
    label: lightness === SERIES_STEPS[SERIES_STEPS.length - 1] ? `${lightness} (Deep)` : String(lightness),
    description: `The series colors with sky at its ${lightness} step.`,
    tokens: seriesTokens(lightness, "light"),
    darkTokens: seriesTokens(lightness, "dark"),
  })),
};

/** The colours on a P3 screen: the fill in both modes, light's area, dark's mark and dark ramp's end, per preset and at the root. */
export function seriesP3Rules(): Array<[string, TokenMap]> {
  const at = (lightness: number): TokenMap => {
    const map: Record<string, string> = {};
    SERIES.forEach((series, i) => {
      const c = seriesColours(series, lightness), n = i + 1, p3 = c.p3.css;
      map[`series-${n}`] = `light-dark(${c.light.mark}, ${p3})`;
      map[`series-${n}-fill`] = p3;
      map[`series-${n}-area`] = `light-dark(${p3}, ${c.dark.area})`;
      map[`series-${n}-ramp-${RAMP_STEPS}`] = `light-dark(${c.light.ramp[RAMP_STEPS - 1]}, ${p3})`;
    });
    return tokens(map);
  };
  return [
    [":where(:root)", at(DEFAULT_SERIES_STEP)],
    ...SERIES_STEPS.map(lightness => [`[data-area-series-lightness="${lightness}"]`, at(lightness)] as [string, TokenMap]),
  ];
}
