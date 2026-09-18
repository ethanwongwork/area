import { INVERSION } from "../color/curves.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { labToLch, parseHex, rgbToOklab, SRGB, toHex, type Rgb } from "../color/oklab.ts";
import type { Theme } from "../color/scale.ts";
import PALETTE from "../color/palette.json" with { type: "json" };

const cache = new Map<string, string>();

/**
 * A quiet tonal edge is a tint of readable ink, not a bright palette rung.
 * Equal luminance alone left green and teal outlines much more saturated than their
 * neighbours. Composite the existing text rung onto the canonical neutral surface,
 * then find the faintest 8-bit opacity that retains the existing stroke floors.
 * This changes semantic presentation only: no primitive palette colour is modified.
 *
 * The canonical ground deliberately does not follow the neutral axis: tonal tokens
 * belong to Theme/Accent, whose outputs must not depend on another axis selection.
 * The contrast gate also checks these results against all three neutral casts.
 */
export function tonalStroke(ink: string, theme: Theme, hover: boolean): string {
  const key = `${ink}:${theme}:${hover}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const position = INVERSION.surface[theme];
  const ground = position === "white" ? PALETTE.constants.white : PALETTE.families.neutral[position].hex;
  const foreground = parseHex(ink);
  const background = parseHex(ground);
  // Quantisation margin above the unchanged 1.3 / 1.9 policy floors.
  const ratio = hover ? 1.91 : 1.31;
  const apca = theme === "dark" && hover ? 15.1 : 0;
  // The dark end of a chromatic palette has a great deal of perceptual hue even where
  // sRGB leaves little numeric C headroom. Light strokes therefore used to make purple
  // visibly coloured while teal/cyan barely registered. Once the contrast floor is met,
  // take enough of the readable ink to give every light tonal stroke a shared minimum
  // chroma. The ceiling remains enforced by stroke.test.ts.
  const minimumChroma = theme === "light" ? (hover ? 0.06 : 0.025) : 0;
  for (let opacity = 1; opacity <= 255; opacity++) {
    const alpha = opacity / 255;
    const rgb = foreground.map((value, channel) => value * alpha + background[channel]! * (1 - alpha)) as Rgb;
    const hex = toHex(rgb);
    const chroma = labToLch(rgbToOklab(parseHex(hex), SRGB)).C;
    if (
      wcagContrastHex(hex, ground) >= ratio &&
      apcaMagnitude(hex, ground) >= apca &&
      chroma >= minimumChroma
    ) {
      cache.set(key, hex);
      return hex;
    }
  }
  throw new Error(`No tonal stroke can clear its contrast floor: ${ink}, ${theme}, hover=${hover}`);
}
