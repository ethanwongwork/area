/**
 * Tint: the hue and strength of the grays every Layers colour is drawn in, and how much of it text takes (owner,
 * 2026-10-22: "rather than just picking warm, or neutral or cool, they pick the exact shade they want, or they even pick a
 * color shade for the surface"; then "the key with this design system is i want everything to be part of a series of
 * choices"). Research and every hue and strength checked: docs/research/custom-neutral-2026-10-22/.
 *
 *   tint-hue    Auto (the default: the Neutral setting's own hue), Accent (the accent's hue, 2026-10-23) or 0 to 359,
 *               every degree (5° steps until 2026-10-26; five numbers a hue, so all 360 ship in axes.css); light's hue,
 *               and dark's too while dark is Same as light (it was one hue for both modes until 2026-10-27)
 *   tint-hue-dark  Same as light (the default), Auto, Accent or 0 to 359 in dark (owner, 2026-10-27, the exact colours
 *               plan: "Tint hue splits into a light and a dark setting, and dark starts as Same as light")
 *   tint-light  Auto (the Neutral setting's strength) or 0 (none) to 100 in light, every whole number, 100 OKLCH chroma 0.08
 *               (0 to 16 in steps of 0.005 until 2026-10-26, so 8 is now 50; 0.08 since 2026-10-23, for a butter-yellow
 *               page; past a hue's room a position holds at the most sRGB shows)
 *   tint-dark   the same in dark; light and dark are chosen apart, as Ground and Layers are
 *   ink-tint    Text tint: how much of the tint body and muted text take, every whole percent from 0 (none) to 100 (full);
 *               50 the default (0 to 4 in quarters until 2026-10-26, so 2 is now 50)
 *
 * Each writes numbers only; color/layers.ts derives the effective hue and strength per mode (`cast-*`) in CSS, so a
 * subtree that sets its own tint re-derives. At Auto every surface is Neutral's, Cool's or Warm's exactly; their text takes
 * Text tint's share and the margin, which moves Cool's and Warm's text by under 0.001 L (Neutral's not at all). Text moves 0.25 ×
 * the strength away from its ground (INK_MARGIN), the margin that keeps every hue at 4.5:1 to the top step and beyond.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { TINT_HUES, POSITIONS, DEFAULT_INK_TINT, inkShareAt, inkTintPosition, tintChromaAt, tintRoom } from "../color/layers.ts";

/** A hue's room under sRGB (layers.ts tintRoom), which holds a strong tint inside the gamut; 9 where no hue of its own. */
const room = (hue?: number) => hue === undefined ? { "tint-room-white": 9, "tint-room-black": 9 } : { "tint-room-white": tintRoom(hue).white, "tint-room-black": tintRoom(hue).black };

export const TINT_HUE_AXIS: AxisDefinition = {
  id: "tint-hue",
  label: "Light tint hue",
  description: "The hue of the grays in light, and in dark unless dark has its own: Auto follows Neutral, Accent the accent's hue, or any hue, every degree.",
  defaultPreset: "auto",
  namespaces: ["--area-tint-hue-auto:", "--area-tint-hue:", "--area-tint-hue-accent:", "--area-tint-room-white:", "--area-tint-room-black:"],
  presets: [
    { id: "auto", label: "Auto", description: "The Neutral setting's own hue.", tokens: tokens({ "tint-hue-auto": 1, "tint-hue": 0, "tint-hue-accent": 0, ...room() }) },
    { id: "accent", label: "Accent", description: "The accent's own hue: grays that lean toward the brand colour.", tokens: tokens({ "tint-hue-auto": 0, "tint-hue": 0, "tint-hue-accent": 1, ...room() }) },
    ...TINT_HUES.map(hue => ({ id: String(hue), label: `${hue}°`, description: `The grays at hue ${hue}°.`, tokens: tokens({ "tint-hue-auto": 0, "tint-hue": hue, "tint-hue-accent": 0, ...room(hue) }) })),
  ],
};

/** Dark's room tokens, the dark twins of `room`. */
const roomDark = (hue?: number) => hue === undefined ? { "tint-room-white-dark": 9, "tint-room-black-dark": 9 } : { "tint-room-white-dark": tintRoom(hue).white, "tint-room-black-dark": tintRoom(hue).black };
const darkHue = (same: 0 | 1, auto: 0 | 1, accent: 0 | 1, hue?: number) =>
  tokens({ "tint-hue-dark-same": same, "tint-hue-dark-auto": auto, "tint-hue-dark": hue ?? 0, "tint-hue-dark-accent": accent, ...roomDark(hue) });

export const TINT_HUE_DARK_AXIS: AxisDefinition = {
  id: "tint-hue-dark",
  label: "Dark tint hue",
  description: "The hue of the grays in dark: Same as light, Auto (Neutral's), Accent, or any hue, every degree.",
  defaultPreset: "same",
  namespaces: ["--area-tint-hue-dark-same:", "--area-tint-hue-dark-auto:", "--area-tint-hue-dark:", "--area-tint-hue-dark-accent:", "--area-tint-room-white-dark:", "--area-tint-room-black-dark:"],
  presets: [
    { id: "same", label: "Same as light", description: "Light's Tint hue, whatever it is.", tokens: darkHue(1, 0, 0) },
    { id: "auto", label: "Auto", description: "The Neutral setting's own hue in dark.", tokens: darkHue(0, 1, 0) },
    { id: "accent", label: "Accent", description: "The accent's own hue.", tokens: darkHue(0, 0, 1) },
    ...TINT_HUES.map(hue => ({ id: String(hue), label: `${hue}°`, description: `The dark grays at hue ${hue}°.`, tokens: darkHue(0, 0, 0, hue) })),
  ],
};

const strengthAxis = (theme: "light" | "dark"): AxisDefinition => ({
  id: `tint-${theme}`,
  label: theme === "light" ? "Light grey tint" : "Dark grey tint",
  description: `In ${theme}: how strongly the grays take the tint's hue. Auto follows Neutral; 0 (None) to 100.`,
  defaultPreset: "auto",
  namespaces: [`--area-tint-${theme}-auto:`, `--area-tint-chroma-${theme}:`],
  presets: [
    { id: "auto", label: "Auto", description: "The Neutral setting's own strength.", tokens: tokens({ [`tint-${theme}-auto`]: 1, [`tint-chroma-${theme}`]: 0 }) },
    ...POSITIONS.map(position => ({
      id: String(position), label: position === 0 ? "0 (None)" : String(position),
      description: position === 0 ? "Untinted grays." : `Tint ${position} of 100: OKLCH chroma ${tintChromaAt(position).toFixed(4)}.`,
      tokens: tokens({ [`tint-${theme}-auto`]: 0, [`tint-chroma-${theme}`]: tintChromaAt(position) }),
    })),
  ],
});
export const TINT_LIGHT_AXIS = strengthAxis("light");
export const TINT_DARK_AXIS = strengthAxis("dark");

export const INK_TINT_AXIS: AxisDefinition = {
  id: "ink-tint",
  label: "Text tint",
  description: "How much of the tint body and muted text take, 0 (None) to 100 (Full).",
  defaultPreset: String(inkTintPosition(DEFAULT_INK_TINT)),
  namespaces: ["--area-ink-tint:"],
  presets: POSITIONS.map(position => ({
    id: String(position), label: position === 0 ? "0 (None)" : position === 100 ? "100 (Full)" : String(position),
    description: position === 0 ? "Neutral text on tinted surfaces." : position === 100 ? "Text as tinted as the surfaces." : `Text takes ${position}% of the tint.`,
    tokens: tokens({ "ink-tint": inkShareAt(position) }),
  })),
};
