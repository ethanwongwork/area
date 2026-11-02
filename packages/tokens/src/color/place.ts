/**
 * One placement function for any colour (colour system study, proposal 5; owner picked Build, 2026-11-01;
 * docs/research/color-system-2026-11-01).
 *
 * Every chromatic rung of palette.json sits at 95–100% of the chroma sRGB can show at its lightness and hue
 * (measure-ladder.ts), so the ladder is already one path: lightness L, hue h, and the share of the room taken. Placing a
 * colour by those three numbers puts it between rungs where the ladder jumps (blue 150–300, teal 350–500) or at a
 * lightness no rung has, as OpenAI's luminous colours sit at L 0.79. `palette.json` is never written: at a rung's own L,
 * h and share this returns the rung (place.test.ts), so the eleven families are named points on the function.
 *
 *   L      OKLab lightness, 0 to 1
 *   share  of the chroma the gamut holds at L and h (OKHSL's saturation, in OKLab lightness), 0 to 1
 *   cap    an upper bound on chroma, so light colours at a hue with a wide room stay in one family's glow
 *
 * In-between positions are for data and picked colours; semantic roles keep their solved rungs (scale.ts).
 */
import { maxChromaAt, gamutMap } from "./gamut.ts";
import { DISPLAY_P3, SRGB, type Gamut, type Rgb, labToLch, oklabToXyz, parseHex, rgbToOklab, toHex, toP3Css } from "./oklab.ts";

/** The most chroma a gamut holds at this lightness and hue. */
export const roomAt = (L: number, h: number, gamut: Gamut = SRGB) => maxChromaAt(L, h, gamut);

/** A colour's share of the room at its own lightness and hue (0 for a grey). */
export function shareOf(hex: string): number {
  const c = labToLch(rgbToOklab(parseHex(hex), SRGB));
  const room = roomAt(c.L, c.h);
  return room > 0.002 ? Math.min(1, c.C / room) : 0;
}

/** The colour at hue h, lightness L and share of the room, chroma capped, in the gamut's own RGB. */
export function placeRgb(h: number, L: number, share = 1, cap = Infinity, gamut: Gamut = SRGB): Rgb {
  return gamutMap({ L, C: Math.min(cap, share * roomAt(L, h, gamut)), h }, gamut).rgb;
}

/** `placeRgb` in sRGB, as a hex. */
export const colourAt = (h: number, L: number, share = 1, cap = Infinity) => toHex(placeRgb(h, L, share, cap, SRGB));

/**
 * The same colour on a wide-gamut screen: Display P3's room at the same L and h, and the cap scaled by how much wider
 * that room is, so a capped colour gains as much as an uncapped one. Written `color(display-p3 …)` for
 * `@media (color-gamut: p3)`.
 */
export function colourAtP3(h: number, L: number, share = 1, cap = Infinity): { css: string; rgb: Rgb } {
  const widen = roomAt(L, h, DISPLAY_P3) / Math.max(1e-6, roomAt(L, h, SRGB));
  const rgb = placeRgb(h, L, share, cap * widen, DISPLAY_P3);
  return { css: toP3Css(rgb), rgb };
}

/** WCAG relative luminance of a Display P3 colour: its CIE Y, as for sRGB. */
export function p3Luminance(rgb: Rgb): number {
  return Math.max(0, oklabToXyz(rgbToOklab(rgb, DISPLAY_P3))[1]);
}

/**
 * The first colour along a hue, from `from` toward `to` in lightness, that clears `ratio` on every ground: the lightest
 * (walking down) or the darkest (walking up) colour on the hue that reads at that contrast. A ground is a hex, or a
 * relative luminance for a colour outside sRGB (a Display P3 fill).
 */
export function firstClearing(h: number, share: number, grounds: ReadonlyArray<string | number>, ratio: number, from: number, to: number, cap = Infinity): string {
  const ys = grounds.map(g => typeof g === "number" ? g : luminance(g));
  const step = from < to ? 0.002 : -0.002;
  for (let L = from; from < to ? L <= to + 1e-9 : L >= to - 1e-9; L += step) {
    const hex = colourAt(h, L, share, cap);
    const y = luminance(hex);
    if (ys.every(g => ratioOf(y, g) >= ratio)) return hex;
  }
  return colourAt(h, to, share, cap);
}

const lin = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const luminance = (hex: string) => { const [r, g, b] = parseHex(hex).map(lin) as Rgb; return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
/** WCAG 2.2 contrast between two luminances. */
export const ratioOf = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
/** WCAG relative luminance of an sRGB hex. */
export const hexLuminance = luminance;
