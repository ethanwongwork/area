/**
 * Card tone (owner, 2026-10-22: "if i choose a white 100 ground, is there a way to be able to customize what i want the frame
 * color to be? ... i just want users to be able to choose the option of making these containers/cards match the background
 * or making them slightly different, lighter or darker"): per mode, Auto (each container keeps its own tone: a Card the
 * raised layer, an Asset card the recessed one) or a position from the page, −100 (darker) to +100 (lighter), every whole
 * number (owner, 2026-10-26: "a slider that adjusts to every possible percentage"; −4 to +4 in half steps before, so −1 is
 * now −25), clamped at white and black. Cards and Asset cards paint it and their controls step from it; menus, popovers and
 * dialogs stay raised.
 *
 * Each writes a switch and a number; color/layers.ts derives the two tones (`card`, `tile`), their fills and the inks,
 * which are solved against the darkest ground text sits on in light and the lightest in dark, so every step keeps text,
 * controls and frames readable (layers.test.ts, "every card tone is usable").
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { CARD_TONE_UNIT, SIGNED_POSITIONS, cardToneAt } from "../color/layers.ts";

const cardToneAxis = (theme: "light" | "dark"): AxisDefinition => ({
  id: `card-tone-${theme}`,
  label: theme === "light" ? "Light card shade" : "Dark card shade",
  description: `In ${theme}: cards and asset cards against the page. Auto keeps each one's own tone; −100 (darker) to +100 (lighter), 0 matches the page.`,
  defaultPreset: "auto",
  namespaces: [`--area-card-tone-${theme}-auto:`, `--area-card-tone-${theme}:`],
  presets: [
    { id: "auto", label: "Auto", description: "Each container's own tone: a Card raised, an Asset card recessed.", tokens: tokens({ [`card-tone-${theme}-auto`]: 1, [`card-tone-${theme}`]: 0 }) },
    ...SIGNED_POSITIONS.map(position => ({
      id: String(position),
      label: position === 0 ? "0 (Page)" : position < 0 ? `${position}` : `+${position}`,
      description: position === 0 ? "The page's own tone." : `${Math.abs(position)} of 100 ${position < 0 ? "darker" : "lighter"} than the page (${(Math.abs(cardToneAt(position)) * CARD_TONE_UNIT[theme]).toFixed(4)} L).`,
      tokens: tokens({ [`card-tone-${theme}-auto`]: 0, [`card-tone-${theme}`]: cardToneAt(position) }),
    })),
  ],
});
export const CARD_TONE_LIGHT_AXIS = cardToneAxis("light");
export const CARD_TONE_DARK_AXIS = cardToneAxis("dark");
