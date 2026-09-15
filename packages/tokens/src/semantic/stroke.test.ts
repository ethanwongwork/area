import { describe, expect, it } from "vitest";
import { CHROMATIC_SCALES } from "../color/presets.ts";
import { labToLch, parseHex, rgbToOklab, SRGB } from "../color/oklab.ts";
import { resolveTheme } from "./resolve.ts";

describe("tonal outline balance", () => {
  // Luminance contrast alone let green/teal reach C .130/.157 at rest while blue
  // stayed near .056. Bound chroma as well, without altering a palette or gate floor.
  const budgets = [
    { theme: "light", state: "border", maximum: 0.04, spread: 0.015 },
    { theme: "light", state: "border-strong", maximum: 0.085, spread: 0.035 },
    { theme: "dark", state: "border", maximum: 0.02, spread: 0.01 },
    { theme: "dark", state: "border-strong", maximum: 0.045, spread: 0.025 },
  ] as const;

  it.each(budgets)("keeps $theme $state quietly tinted across every family", ({ theme, state, maximum, spread }) => {
    const chromas = CHROMATIC_SCALES.map(({ id }) => {
      const { tokens } = resolveTheme({ theme, accent: id, neutral: "neutral" });
      const color = labToLch(rgbToOklab(parseHex(tokens[`accent-${state}`]!), SRGB));
      expect(color.C, `${id}: ${tokens[`accent-${state}`]}`).toBeLessThan(maximum);
      // Preserve a tint: making every outline achromatic is not a tonal system.
      expect(color.C, id).toBeGreaterThan(0.005);
      return color.C;
    });
    expect(Math.max(...chromas) - Math.min(...chromas)).toBeLessThan(spread);
  });
});
