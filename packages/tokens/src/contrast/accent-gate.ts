/**
 * The accent gate's measurement (accents.test.ts): every pairing that reads an accent token on
 * every accent given, at every strength, in one mode and on every neutral, and the solid pairings at every Solid step and
 * Label tint quarter, with every Label tint position between them (2026-10-26): the label is an OKLab mix of its quarter
 * 0 and 4 colours (resolve.ts), so a position is that mix, measured here without resolving it.
 */
import { ASSERTIONS } from "./assertions.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { NEUTRAL_SCALES } from "../color/presets.ts";
import { ACCENT_STRENGTHS, LABEL_TINT_STEPS, SOLID_STEPS, mixOklab } from "../color/generate.ts";
import { resolveTheme } from "../semantic/resolve.ts";

/** The pairings whose colours an accent setting can move: either side reads an accent token or a role built on one. */
const reference = resolveTheme({ theme: "light", neutral: "neutral", accent: "blue" }).tokens;
const other = resolveTheme({ theme: "light", neutral: "neutral", accent: "teal", accentStrength: 50 }).tokens;
export const ACCENTED = ASSERTIONS.filter(a => reference[a.fg] !== other[a.fg] || reference[a.bg] !== other[a.bg]);
export const SOLID = ACCENTED.filter(a => /accent-solid/.test(`${a.fg} ${a.bg}`));
const LABEL_POSITIONS = Array.from({ length: 101 }, (_, p) => p);

/** Every failing pairing for these accents in one mode, as lines. */
export function accentProblems(theme: "light" | "dark", accents: readonly string[]): string[] {
  const problems: string[] = [];
  for (const neutral of NEUTRAL_SCALES) for (const accent of accents) for (const accentStrength of ACCENT_STRENGTHS) {
    for (const pick of ["auto", ...SOLID_STEPS] as const) {
      const ends: Record<number, Record<string, string>> = {};
      for (const labelTint of LABEL_TINT_STEPS) {
        if ((pick !== "auto" || labelTint !== 0) && neutral.id !== "neutral") continue;
        const t = resolveTheme({ theme, neutral: neutral.id, accent, accentStrength, solid: { light: pick, dark: pick }, labelTint }).tokens;
        ends[labelTint] = t;
        for (const a of pick === "auto" && labelTint === 0 ? ACCENTED : SOLID) {
          // A label on the solid's hover is on its press too: the hover 10% toward black (button.css), 2026-10-23. WCAG
          // only there: a black label on a pressed orange or yellow in dark reads Lc 58 at every Label tint, the press
          // darkening toward the label; whether a press under a black label should lighten instead is the owner's call.
          for (const [bg, state] of [[t[a.bg]!, ""], ...(/accent-solid-hover/.test(a.bg) && /on-accent/.test(a.fg) ? [[mixOklab(t[a.bg]!, "#000000", 0.1), " pressed"]] : [])] as Array<[string, string]>) {
            const fg = t[a.fg]!, wcag = wcagContrastHex(fg, bg), apca = theme === "dark" && !state ? apcaMagnitude(fg, bg) : Infinity;
            if (wcag < a.wcag || apca < a.apca) problems.push(`${neutral.id}/${accent}/${accentStrength}/${pick}/label ${labelTint}: ${a.fg} on ${a.bg}${state} ${wcag.toFixed(2)}:1${theme === "dark" ? ` Lc ${apca.toFixed(0)}` : ""}`);
          }
        }
      }
      // Label tint's positions between the quarters: the label mixed from quarter 0's toward quarter 4's.
      const [none, full] = [ends[0], ends[4]];
      if (!none || !full) continue;
      for (const a of SOLID) {
        if (none[a.fg] === full[a.fg]) continue;
        for (const position of LABEL_POSITIONS) {
          if (position % 25 === 0) continue;
          const fg = mixOklab(none[a.fg]!, full[a.fg]!, position / 100);
          for (const [bg, state] of [[full[a.bg]!, ""], ...(/accent-solid-hover/.test(a.bg) ? [[mixOklab(full[a.bg]!, "#000000", 0.1), " pressed"]] : [])] as Array<[string, string]>) {
            const wcag = wcagContrastHex(fg, bg), apca = theme === "dark" && !state ? apcaMagnitude(fg, bg) : Infinity;
            if (wcag < a.wcag || apca < a.apca) problems.push(`${neutral.id}/${accent}/${accentStrength}/${pick}/label position ${position}: ${a.fg} on ${a.bg}${state} ${wcag.toFixed(2)}:1${theme === "dark" ? ` Lc ${apca.toFixed(0)}` : ""}`);
          }
        }
      }
    }
  }
  return problems;
}
