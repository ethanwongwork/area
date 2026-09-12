/**
 * Alpha scales.
 *
 * Every solid step has a translucent twin that composites to the same colour over the
 * theme's page background. That is what makes an overlay, a hover tint, or a scrim look
 * identical whether it sits on the page or on a card.
 *
 * Solve `target = bg * (1 - alpha) + fg * alpha` for the smallest alpha whose foreground
 * stays inside 0..1, then verify by re-compositing -- because the foreground has to be
 * quantised to 8 bits and that quantisation is exactly where alpha ramps visibly drift.
 * Work in gamma-encoded sRGB, since that is the space browsers actually composite in.
 */
import { type Oklab, type Rgb, deltaEOk, rgbToOklab, SRGB } from "./oklab.ts";

export interface AlphaSolution {
  /** Alpha channel, quantised to 8 bits. */
  alpha: number;
  /** The 8-bit foreground colour to pair with it. */
  rgb: Rgb;
  /** OKLab error between the re-composited result and the requested target. */
  residual: number;
}

function quantise8(v: number): number {
  return Math.round(Math.min(1, Math.max(0, v)) * 255) / 255;
}

export function solveAlpha(target: Rgb, background: Rgb): AlphaSolution {
  let alpha = 0;

  for (let i = 0; i < 3; i++) {
    const t = target[i]!;
    const b = background[i]!;
    // Drive each channel toward whichever extreme it needs; the channel demanding the
    // most alpha sets the floor for all three.
    const fg = t > b ? 1 : 0;
    const denominator = fg - b;
    if (Math.abs(denominator) < 1e-9) continue;
    alpha = Math.max(alpha, (t - b) / denominator);
  }

  // Round alpha up to an 8-bit step so the solved foreground stays inside 0..1.
  alpha = Math.min(1, Math.max(0, Math.ceil(alpha * 255) / 255));

  if (alpha === 0) {
    return { alpha: 0, rgb: [0, 0, 0], residual: 0 };
  }

  const rgb = target.map((t, i) => quantise8((t - background[i]! * (1 - alpha)) / alpha)) as Rgb;
  const recomposited = rgb.map((v, i) => v * alpha + background[i]! * (1 - alpha)) as Rgb;

  return { alpha, rgb, residual: deltaEOk(toLab(recomposited), toLab(target)) };
}

function toLab(rgb: Rgb): Oklab {
  return rgbToOklab(rgb, SRGB);
}

/** Formats a solved alpha step as `#rrggbbaa`. */
export function formatAlpha({ alpha, rgb }: AlphaSolution): string {
  const hex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(rgb[0])}${hex(rgb[1])}${hex(rgb[2])}${hex(alpha)}`;
}
