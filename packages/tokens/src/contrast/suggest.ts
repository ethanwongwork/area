/**
 * Turns a contrast failure into an instruction.
 *
 * A gate that reports "4.21 is less than 4.5" costs half an hour of bisecting lightness
 * curves by hand. A gate that reports "raise this step's L to 0.7315" costs thirty
 * seconds. Building this on day one is the difference between a gate people use and a
 * gate people disable.
 */
import { type Oklch, SRGB, labToLch, parseHex, rgbToOklab, toHex, toOklchCss } from "../color/oklab.ts";
import { gamutMap } from "../color/gamut.ts";
import { apcaMagnitude, wcagContrast, wcagContrastHex } from "../color/contrast.ts";

export interface Suggestion {
  /** Human-readable fix, ready to print. */
  text: string;
  /** Lightness the foreground would need. Undefined when no lightness achieves the target. */
  foregroundL?: number;
  /** Lightness the background would need instead. */
  backgroundL?: number;
}

type Standard = "wcag" | "apca";

function measure(standard: Standard, fgHex: string, bgHex: string): number {
  return standard === "wcag" ? wcagContrastHex(fgHex, bgHex) : apcaMagnitude(fgHex, bgHex);
}

/** Re-render a colour at a different lightness, holding chroma and hue. */
function atLightness(source: Oklch, L: number): string {
  const target: Oklch = { L, C: source.C, h: source.h };
  return toHex(gamutMap(target, SRGB).rgb);
}

/**
 * Smallest lightness change to `movable` that reaches `target`.
 * Searches both directions, because whether to lighten or darken depends on polarity.
 */
function solveLightness(
  standard: Standard,
  movableHex: string,
  fixedHex: string,
  movableIsForeground: boolean,
  target: number,
): number | undefined {
  const source = labToLch(rgbToOklab(parseHex(movableHex), SRGB));
  const score = (L: number) => {
    const hex = atLightness(source, L);
    return movableIsForeground ? measure(standard, hex, fixedHex) : measure(standard, fixedHex, hex);
  };

  let best: number | undefined;
  let bestDistance = Infinity;

  // Sample the full range, then refine around any crossing. The relationship is monotonic
  // either side of the fixed colour's lightness, but not across it.
  const SAMPLES = 200;
  for (let i = 0; i <= SAMPLES; i++) {
    const L = i / SAMPLES;
    if (score(L) < target) continue;
    const distance = Math.abs(L - source.L);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = L;
    }
  }

  if (best === undefined) return undefined;

  // Refine toward the source so the reported change is the minimum, not a sample boundary.
  let lo = best;
  let hi = source.L;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (score(mid) >= target) lo = mid;
    else hi = mid;
  }
  return lo;
}

export function suggest(
  standard: Standard,
  fg: { token: string; hex: string },
  bg: { token: string; hex: string },
  target: number,
): Suggestion {
  const foregroundL = solveLightness(standard, fg.hex, bg.hex, true, target);
  const backgroundL = solveLightness(standard, bg.hex, fg.hex, false, target);

  const fgSource = labToLch(rgbToOklab(parseHex(fg.hex), SRGB));
  const bgSource = labToLch(rgbToOklab(parseHex(bg.hex), SRGB));

  const lines: string[] = [];
  if (foregroundL !== undefined) {
    const delta = foregroundL - fgSource.L;
    lines.push(
      `move ${fg.token} to L ${foregroundL.toFixed(4)} (${delta >= 0 ? "+" : ""}${delta.toFixed(4)})`,
    );
  }
  if (backgroundL !== undefined) {
    const delta = backgroundL - bgSource.L;
    lines.push(
      `or move ${bg.token} to L ${backgroundL.toFixed(4)} (${delta >= 0 ? "+" : ""}${delta.toFixed(4)})`,
    );
  }
  if (lines.length === 0) {
    lines.push(`no lightness of ${fg.token} reaches ${target} on ${bg.token}; change chroma or the pairing`);
  }

  return { text: lines.join("\n       "), foregroundL, backgroundL };
}

/** One formatted failure block. */
export function formatFailure(options: {
  standard: Standard;
  assertion: { fg: string; bg: string; note: string };
  context: string;
  fgHex: string;
  bgHex: string;
  required: number;
  actual: number;
}): string {
  const { standard, assertion, context, fgHex, bgHex, required, actual } = options;
  const fgLch = labToLch(rgbToOklab(parseHex(fgHex), SRGB));
  const bgLch = labToLch(rgbToOklab(parseHex(bgHex), SRGB));
  const other = standard === "wcag" ? "APCA" : "WCAG";
  const otherValue =
    standard === "wcag" ? apcaMagnitude(fgHex, bgHex).toFixed(1) : wcagContrastHex(fgHex, bgHex).toFixed(2);
  const fix = suggest(standard, { token: assertion.fg, hex: fgHex }, { token: assertion.bg, hex: bgHex }, required);

  return [
    ``,
    `  ${assertion.fg} on ${assertion.bg}  [${context}]  -- ${assertion.note}`,
    `  ${standard.toUpperCase().padEnd(5)} required >= ${required}   actual ${actual.toFixed(2)}   FAIL`,
    `  ${other.padEnd(5)} ${otherValue}`,
    `  fg ${fgHex}  ${toOklchCss(fgLch)}`,
    `  bg ${bgHex}  ${toOklchCss(bgLch)}`,
    `  fix: ${fix.text}`,
    ``,
  ].join("\n");
}

export { wcagContrast };
