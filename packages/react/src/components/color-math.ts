/* Color math for the color controls. sRGB channels are 0-255, hue in degrees, other HSV/HSL
 * channels in percent. OKLab/OKLCH follow Björn Ottosson's published matrices (the same
 * space as CSS Color 4 `oklch()`); L is 0-1 here, C is unbounded and h in degrees.
 * tests/color-picker.test.mjs checks the conversion against palette.json's stored OKLCH. */
export type Rgb = [number, number, number];
export type Hsv = [number, number, number];
export type Oklch = [number, number, number];

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const wrapHue = (h: number) => ((h % 360) + 360) % 360;

export function hsvToRgb(h: number, s: number, v: number): Rgb {
  const c = v / 100 * s / 100, x = c * (1 - Math.abs((wrapHue(h) / 60) % 2 - 1)), m = v / 100 - c;
  const hue = wrapHue(h);
  const [r, g, b] = hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] : hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}
/** `hue` is kept when the color has none (gray), so a hue survives desaturation. */
export function rgbToHsv([r, g, b]: Rgb, hue = 0): Hsv {
  [r, g, b] = [r / 255, g / 255, b / 255];
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  const h = !delta ? hue : 60 * (max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4);
  return [h, max ? delta / max * 100 : 0, max * 100];
}
export function rgbToHsl(rgb: Rgb, hue = 0): [number, number, number] {
  const [h, s, v] = rgbToHsv(rgb, hue), l = v * (1 - s / 200);
  return [h, l === 0 || l === 100 ? 0 : (v - l) / Math.min(l, 100 - l) * 100, l];
}
export function hslToHsv(h: number, s: number, l: number): Hsv {
  const v = l + s / 100 * Math.min(l, 100 - l);
  return [h, v ? 200 * (1 - l / v) : 0, v];
}

const toLinear = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const fromLinear = (c: number) => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

/** sRGB to OKLCH. Achromatic colors keep `hue`. */
export function rgbToOklch(rgb: Rgb, hue = 0): Oklch {
  const [r, g, b] = rgb.map(toLinear) as Rgb;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const C = Math.hypot(A, B);
  return [L, C, C < 1e-4 ? hue : wrapHue(Math.atan2(B, A) * 180 / Math.PI)];
}
/** OKLCH to unclamped linear-light sRGB (may fall outside 0-1). */
function oklchToLinear([L, C, h]: Oklch): Rgb {
  const A = C * Math.cos(h * Math.PI / 180), B = C * Math.sin(h * Math.PI / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
}
export const inSrgb = (color: Oklch, epsilon = 1e-4) => oklchToLinear(color).every(c => c >= -epsilon && c <= 1 + epsilon);
/** OKLCH to sRGB. Colors outside sRGB keep lightness and hue and lose chroma until they fit. */
export function oklchToRgb(color: Oklch): { rgb: Rgb; mapped: boolean } {
  let [L, C, h] = color;
  L = clamp(L, 0, 1);
  let mapped = false;
  if (!inSrgb([L, C, h])) {
    let low = 0, high = C;
    for (let i = 0; i < 24; i++) { const mid = (low + high) / 2; if (inSrgb([L, mid, h])) low = mid; else high = mid; }
    C = low; mapped = true;
  }
  return { rgb: oklchToLinear([L, C, h]).map(c => clamp(fromLinear(clamp(c, 0, 1)), 0, 255)) as Rgb, mapped };
}

/** WCAG 2 relative luminance and contrast ratio. */
export const luminance = (rgb: Rgb) => { const [r, g, b] = rgb.map(toLinear) as Rgb; return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrastRatio = (a: Rgb, b: Rgb) => { const [x, y] = [luminance(a), luminance(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/**
 * The failing band of a contrast check on one hue's saturation/brightness plane. For each
 * saturation step it returns the brightness (0-100) where luminance falls to the darkest
 * passing value and where it rises to the lightest passing value: colors between the two
 * fail `ratio` against `background`. Luminance rises with brightness at a fixed hue and
 * saturation, so each edge is one binary search. An edge at 0 or 100 means that side has
 * no passing colors in the column.
 */
export function contrastBand(hue: number, background: Rgb, ratio: number, steps = 32): Array<[number, number]> {
  const base = luminance(background);
  const darkest = (base + 0.05) / ratio - 0.05, lightest = ratio * (base + 0.05) - 0.05;
  const at = (s: number, target: number) => {
    if (target <= 0) return 0;
    if (target >= luminance(hsvToRgb(hue, s, 100))) return 100;
    let low = 0, high = 100;
    for (let k = 0; k < 18; k++) { const mid = (low + high) / 2; if (luminance(hsvToRgb(hue, s, mid)) < target) low = mid; else high = mid; }
    return (low + high) / 2;
  };
  return Array.from({ length: steps + 1 }, (_, i) => { const s = i / steps * 100; return [at(s, darkest), at(s, lightest)]; });
}
