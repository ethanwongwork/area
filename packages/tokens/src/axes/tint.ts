/**
 * Tint: the hue and strength of the grays every Layers colour is drawn in, and how much of it text takes (owner,
 * 2026-10-22: "rather than just picking warm, or neutral or cool, they pick the exact shade they want, or they even pick a
 * color shade for the surface"; then "the key with this design system is i want everything to be part of a series of
 * choices"). Research and every hue and strength checked: docs/research/custom-neutral-2026-10-22/.
 *
 *   tint-hue    Auto (the default: the Neutral setting's own hue), Accent (the accent's hue, 2026-10-23) or 0 to 355 in
 *               5° steps, one hue for both modes
 *   tint-light  Auto (the Neutral setting's strength) or 0 (none) to 16 in light, each step 0.005 of OKLCH chroma (16 since
 *               2026-10-23, for a butter-yellow page; past a hue's room a step clips to the most sRGB shows)
 *   tint-dark   the same in dark; light and dark are chosen apart, as Ground and Layers are
 *   ink-tint    Text tint: how much of the tint body and muted text take, 0 (none) to 4 (full) in quarters; 2 the default
 *
 * Each writes numbers only; color/layers.ts derives the effective hue and strength per mode (`cast-*`) in CSS, so a
 * subtree that sets its own tint re-derives. At Auto every surface is Neutral's, Cool's or Warm's exactly; their text takes
 * Text tint's share and the margin, which moves Cool's and Warm's text by under 0.001 L (Neutral's not at all). Text moves 0.25 ×
 * the strength away from its ground (INK_MARGIN), the margin that keeps every hue at 4.5:1 to the top step and beyond.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { TINT_HUES, TINT_STEP, TINT_STEPS, INK_TINT_STEPS, DEFAULT_INK_TINT, tintRoom } from "../color/layers.ts";

/** A hue's room under sRGB (layers.ts tintRoom), which holds a strong tint inside the gamut; 9 where no hue of its own. */
const room = (hue?: number) => hue === undefined ? { "tint-room-white": 9, "tint-room-black": 9 } : { "tint-room-white": tintRoom(hue).white, "tint-room-black": tintRoom(hue).black };

export const TINT_HUE_AXIS: AxisDefinition = {
  id: "tint-hue",
  label: "Tint hue",
  description: "The hue of the grays: Auto follows Neutral, Accent the accent's hue, or any hue in 5° steps.",
  defaultPreset: "auto",
  namespaces: ["--area-tint-hue-auto:", "--area-tint-hue:", "--area-tint-hue-accent:", "--area-tint-room-white:", "--area-tint-room-black:"],
  presets: [
    { id: "auto", label: "Auto", description: "The Neutral setting's own hue.", tokens: tokens({ "tint-hue-auto": 1, "tint-hue": 0, "tint-hue-accent": 0, ...room() }) },
    { id: "accent", label: "Accent", description: "The accent's own hue: grays that lean toward the brand colour.", tokens: tokens({ "tint-hue-auto": 0, "tint-hue": 0, "tint-hue-accent": 1, ...room() }) },
    ...TINT_HUES.map(hue => ({ id: String(hue), label: `${hue}°`, description: `The grays at hue ${hue}°.`, tokens: tokens({ "tint-hue-auto": 0, "tint-hue": hue, "tint-hue-accent": 0, ...room(hue) }) })),
  ],
};

const strengthAxis = (theme: "light" | "dark"): AxisDefinition => ({
  id: `tint-${theme}`,
  label: theme === "light" ? "Light grey tint" : "Dark grey tint",
  description: `In ${theme}: how strongly the grays take the tint's hue. Auto follows Neutral; 0 (None) to 16.`,
  defaultPreset: "auto",
  namespaces: [`--area-tint-${theme}-auto:`, `--area-tint-chroma-${theme}:`],
  presets: [
    { id: "auto", label: "Auto", description: "The Neutral setting's own strength.", tokens: tokens({ [`tint-${theme}-auto`]: 1, [`tint-chroma-${theme}`]: 0 }) },
    ...TINT_STEPS.map(step => ({
      id: String(step), label: step === 0 ? "0 (None)" : String(step),
      description: step === 0 ? "Untinted grays." : `Tint ${step} of ${TINT_STEPS[TINT_STEPS.length - 1]}: OKLCH chroma ${(step * TINT_STEP).toFixed(3)}.`,
      tokens: tokens({ [`tint-${theme}-auto`]: 0, [`tint-chroma-${theme}`]: Number((step * TINT_STEP).toFixed(4)) }),
    })),
  ],
});
export const TINT_LIGHT_AXIS = strengthAxis("light");
export const TINT_DARK_AXIS = strengthAxis("dark");

export const INK_TINT_AXIS: AxisDefinition = {
  id: "ink-tint",
  label: "Text tint",
  description: "How much of the tint body and muted text take, 0 (None) to 4 (Full).",
  defaultPreset: String(DEFAULT_INK_TINT),
  namespaces: ["--area-ink-tint:"],
  presets: INK_TINT_STEPS.map(step => ({
    id: String(step), label: step === 0 ? "0 (None)" : step === 4 ? "4 (Full)" : String(step),
    description: step === 0 ? "Neutral text on tinted surfaces." : step === 4 ? "Text as tinted as the surfaces." : `Text takes ${step * 25}% of the tint.`,
    tokens: tokens({ "ink-tint": step / 4 }),
  })),
};
