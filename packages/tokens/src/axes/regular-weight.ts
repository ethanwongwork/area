/**
 * Regular weight (plan A9.6; owner, 2026-11-13: "Build the setting as a trial: a Regular weight setting, 400 by default,
 * to compare 430 to 450 on screens"). The `wght` every regular text role draws at: running text, descriptions, field
 * values and labels, rows, menus, a setting's name (typography.ts, the three weights). 400 by default, so nothing moves
 * until it is changed.
 *
 * Range and step. Geist, the interface face, is variable on `wght` from 100 to 900 (apps/desktop/src/content/typefaces/
 * generated/faces.json), so every value between its stops draws as itself; steps of 10 are the smallest a reader can
 * tell apart at interface sizes. The top stops at 470, 30 under strong (500): past it regular and strong stop reading as
 * two weights, which is the step the two-weight rule keeps. Below 400 is not offered here: a lighter regular is what dark
 * weight compensation would do per mode (plan A9.6's second option, not built), and it composes with this one by
 * subtracting from it.
 *
 * What it never moves: strong (500), heading (600), the icon line, type size, density or colour. Weight changes a
 * glyph's advance a little and never its line, so a control's height and a row's line stay where they are; only a
 * single line of text widens, by its advance.
 *
 * On a face without a weight axis the browser matches the nearest file (CSS Fonts 4, font matching): a face with a
 * Medium (500) file draws it for any value from 401 to 499, which would collapse regular into strong. A static face is
 * declared with its regular file covering the setting's range (`font-weight: 400 470`) so the regular file is drawn at
 * every value; with no Medium file the browser already falls back to the 400 file.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { WGHT_RAMP } from "../emit/base.ts";

export const REGULAR_WEIGHTS = [400, 410, 420, 430, 440, 450, 460, 470] as const;
export const DEFAULT_REGULAR_WEIGHT = 400;

/** The ramp's stop where it has one (400, 450), else the number: the default writes exactly what it wrote before. */
const wght = (weight: number) => (WGHT_RAMP as readonly number[]).includes(weight) ? `var(--area-wght-${weight})` : String(weight);

export const REGULAR_WEIGHT_AXIS: AxisDefinition = {
  id: "regular-weight",
  label: "Regular weight",
  description: "The weight body text, rows, fields and menus draw at: 400 to 470 on the variable face. Strong labels and headings keep theirs.",
  defaultPreset: String(DEFAULT_REGULAR_WEIGHT),
  namespaces: ["--area-weight-regular:"],
  presets: REGULAR_WEIGHTS.map(weight => ({
    id: String(weight),
    label: String(weight),
    description: weight === DEFAULT_REGULAR_WEIGHT
      ? "Regular text at the face's own regular, 400."
      : `Regular text at ${weight}, ${500 - weight} under strong labels.`,
    tokens: tokens({ "weight-regular": wght(weight) }),
  })),
};
