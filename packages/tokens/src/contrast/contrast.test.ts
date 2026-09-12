/**
 * THE GATE.
 *
 * Every semantic pairing, across every theme Area ships, measured under both standards.
 * `npm run build` depends on this passing, so a colour that fails here cannot be published.
 */
import { describe, expect, it } from "vitest";
import { ASSERTIONS } from "./assertions.ts";
import { EXCEPTIONS, isWaived } from "./exceptions.ts";
import { formatFailure } from "./suggest.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { type ResolvedTheme, resolveTheme, shippedThemes } from "../semantic/resolve.ts";

const THEMES = shippedThemes();

function label(t: ResolvedTheme): string {
  return `theme=${t.theme} neutral=${t.neutral} accent=${t.accent}`;
}

function pair(t: ResolvedTheme, fg: string, bg: string): { fgHex: string; bgHex: string } {
  const fgHex = t.tokens[fg];
  const bgHex = t.tokens[bg];
  if (!fgHex) throw new Error(`Assertion references unknown token "${fg}"`);
  if (!bgHex) throw new Error(`Assertion references unknown token "${bg}"`);
  // Alpha tokens would have to be composited before measuring; none are asserted today.
  if (fgHex.length > 7 || bgHex.length > 7) {
    throw new Error(`Cannot measure translucent token in "${fg}" on "${bg}" without compositing`);
  }
  return { fgHex, bgHex };
}

describe("contrast gate", () => {
  it("covers every shipped theme", () => {
    // 2 themes x 3 neutrals x 12 accents.
    expect(THEMES).toHaveLength(72);
    expect(ASSERTIONS.length).toBeGreaterThan(50);
  });

  describe.each(THEMES.map((t) => [label(t), t] as const))("%s", (context, theme) => {
    it.each(ASSERTIONS.map((a) => [`${a.fg} on ${a.bg}`, a] as const))(
      "WCAG 2.2: %s",
      (_name, assertion) => {
        const { fgHex, bgHex } = pair(theme, assertion.fg, assertion.bg);
        const actual = wcagContrastHex(fgHex, bgHex);

        if (isWaived({ fg: assertion.fg, bg: assertion.bg, standard: "wcag" }, theme)) return;

        expect(
          actual >= assertion.wcag,
          formatFailure({
            standard: "wcag",
            assertion,
            context,
            fgHex,
            bgHex,
            required: assertion.wcag,
            actual,
          }),
        ).toBe(true);
      },
    );

    // APCA is a hard gate in dark themes, where the WCAG 2.x formula overstates contrast.
    if (theme.theme === "dark") {
      it.each(ASSERTIONS.map((a) => [`${a.fg} on ${a.bg}`, a] as const))(
        "APCA (dark): %s",
        (_name, assertion) => {
          const { fgHex, bgHex } = pair(theme, assertion.fg, assertion.bg);
          const actual = apcaMagnitude(fgHex, bgHex);

          if (isWaived({ fg: assertion.fg, bg: assertion.bg, standard: "apca" }, theme)) return;

          expect(
            actual >= assertion.apca,
            formatFailure({
              standard: "apca",
              assertion,
              context,
              fgHex,
              bgHex,
              required: assertion.apca,
              actual,
            }),
          ).toBe(true);
        },
      );
    }
  });
});

describe("gate integrity", () => {
  it("reports how many exceptions are active", () => {
    // Not an assertion so much as a standing reminder; the count belongs in every run's output.
    if (EXCEPTIONS.length > 0) {
      console.warn(`\n  ${EXCEPTIONS.length} contrast exception(s) active:`);
      for (const e of EXCEPTIONS) {
        console.warn(`    ${e.fg} on ${e.bg} (${e.standard}) -- ${e.reason}${e.expires ? ` [expires ${e.expires}]` : ""}`);
      }
    }
    expect(EXCEPTIONS.length).toBeLessThan(10);
  });

  it("actually fails when a colour goes bad", () => {
    // A gate that has never failed is not a gate. Deliberately break a theme and confirm
    // the failure is both detected and explained.
    const theme = resolveTheme({ theme: "light", neutral: "gray", accent: "blue" });
    const brokenTokens: Record<string, string> = { ...theme.tokens, "fg-default": "#b0b0b0" };

    const actual = wcagContrastHex(brokenTokens["fg-default"]!, brokenTokens["bg-page"]!);
    expect(actual).toBeLessThan(4.5);

    const message = formatFailure({
      standard: "wcag",
      assertion: { fg: "fg-default", bg: "bg-page", note: "body copy" },
      context: label(theme),
      fgHex: brokenTokens["fg-default"]!,
      bgHex: brokenTokens["bg-page"]!,
      required: 4.5,
      actual,
    });

    expect(message).toContain("FAIL");
    expect(message).toContain("fix:");
    expect(message).toMatch(/move fg-default to L 0\.\d+/);
  });
});
