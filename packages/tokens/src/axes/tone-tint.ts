/**
 * Tone tint (owner, 2026-11-02: "Yes, build it"): how much colour the status and label tones' soft tints carry, as a
 * percent of the ladder (color/curves.ts LIGHT_TONAL_CHROMA, DARK_TONAL_CHROMA), one for both modes as Status is. 100 is
 * the default; 160 the richest; 50 is about the palette's rungs before 2026-11-02; 0 is the neutral fill. Each tint's
 * words are solved on it at every Tone contrast floor (color/scale.ts `inkAt`), so a deeper tint takes a darker ink and
 * every pair keeps its floor (contrast/tone-floor.test.ts).
 *
 * Same scope as Tone contrast (color/layers.ts FLOOR_ROLES): the accent's tints follow the accent's own settings.
 * It writes numbers only, a switch per tint other than the default; emit/base.ts picks each surface and ink with them.
 */
import { type AxisDefinition, tokens } from "./schema.ts";
import { DEFAULT_TONE_TINT, TONE_TINTS, toneTintId } from "../color/curves.ts";
import { DEFAULT_TONE_FLOOR, FLOOR_ROLES, TONE_FLOOR_ON, toneFloorId } from "../color/layers.ts";
import { SEMANTIC_ALIASES } from "../semantic/aliases.ts";
import { LOWER_FLOORS } from "./tone-floor.ts";
import { atStrength } from "./accent.ts";
import { STATUS_TONES } from "../color/presets.ts";

/** The tints other than the default, each a switch emit/base.ts mixes its colours in by. */
export const OTHER_TINTS = TONE_TINTS.filter(tint => tint !== DEFAULT_TONE_TINT);

export const TONE_TINT_AXIS: AxisDefinition = {
  id: "tone-tint",
  label: "Tone tint",
  description: "How much color status and label tints carry, as a percent of Area's: 0 is the gray fill, 160 the richest. Their words stay at Tone contrast.",
  defaultPreset: String(DEFAULT_TONE_TINT),
  namespaces: ["--area-tone-tint-"],
  presets: TONE_TINTS.map(tint => ({
    id: String(tint),
    label: tint === 0 ? "0 (None)" : String(tint),
    description: tint === 0 ? "Gray fills: the tone shows in its words and marks only." : tint === DEFAULT_TONE_TINT ? "Area's tints." : `${tint}% of Area's tint color.`,
    tokens: tokens(Object.fromEntries(OTHER_TINTS.map(other => [`tone-tint-${toneTintId(other)}`, other === tint ? 1 : 0]))),
  })),
};

/**
 * Each status and label tone's soft surfaces at the Tone tint, and its ink at the Tone tint and Tone contrast floor
 * (emit/base.ts), from the per-tint colours the Theme axis writes (semantic/inputs.ts): the default's, or the one whose
 * switches are on, as Solid picks its step. A status tone's pick is then mixed to its strength once, as
 * axes/accent.ts `statusDerived` mixes its other colours. Raised Contrast puts the floor back at 4.5 (TONE_FLOOR_ON); the
 * tint stays. Each tint's and floor's weight is derived once (`tone-tint-on-*`, `tone-floor-on-*`) and read by every pick.
 */
export function toneDerived(): Record<string, string> {
  const v = (name: string) => `var(--area-${name})`;
  const out: Record<string, string> = {};
  out[`--area-tone-tint-on-${toneTintId(DEFAULT_TONE_TINT)}`] = `calc(1 - ${OTHER_TINTS.map(other => v(`tone-tint-${toneTintId(other)}`)).join(" - ")})`;
  for (const tint of OTHER_TINTS) out[`--area-tone-tint-on-${toneTintId(tint)}`] = v(`tone-tint-${toneTintId(tint)}`);
  out[`--area-tone-floor-on-${toneFloorId(DEFAULT_TONE_FLOOR)}`] = `calc(1 - (${LOWER_FLOORS.map(lower => v(`tone-floor-${toneFloorId(lower)}`)).join(" + ")}) * ${TONE_FLOOR_ON})`;
  for (const floor of LOWER_FLOORS) out[`--area-tone-floor-on-${toneFloorId(floor)}`] = `calc(${v(`tone-floor-${toneFloorId(floor)}`)} * ${TONE_FLOOR_ON})`;
  const tintOn = (tint: number) => v(`tone-tint-on-${toneTintId(tint)}`), floorOn = (floor: number) => v(`tone-floor-on-${toneFloorId(floor)}`);
  const pick = (start: string, terms: ReadonlyArray<readonly [string, string]>) =>
    terms.reduce((paint, [colour, weight]) => `color-mix(in srgb, ${paint}, ${colour} calc(${weight} * 100%))`, start);
  const strength = `calc(100 - ${v("status-match")} * (100 - ${v("strength-accent")}))`;
  for (const role of FLOOR_ROLES) {
    // A status tone's colours are written at full strength (`-full`) and mixed to its strength after the pick.
    const status = (STATUS_TONES as readonly string[]).includes(role), full = status ? "-full" : "";
    const write = (name: string, picked: string) => {
      if (!status) { out[`--area-${name}`] = picked; return; }
      out[`--area-${name}-full`] = picked;
      out[`--area-${name}`] = atStrength(v(`${name}-full`), strength);
    };
    for (const [name, alias] of Object.entries(SEMANTIC_ALIASES)) {
      if (alias.kind !== "tonalSurface" || alias.role !== role) continue;
      write(name, pick(v(`${name}-t${toneTintId(DEFAULT_TONE_TINT)}${full}`), OTHER_TINTS.map(tint => [v(`${name}-t${toneTintId(tint)}${full}`), tintOn(tint)] as const)));
    }
    const ink = (tint: number, floor: number) => v(`fg-${role}-rung-t${toneTintId(tint)}-f${toneFloorId(floor)}${full}`);
    const terms: Array<readonly [string, string]> = [];
    for (const tint of [DEFAULT_TONE_TINT, ...OTHER_TINTS]) for (const floor of [DEFAULT_TONE_FLOOR, ...LOWER_FLOORS]) {
      if (tint === DEFAULT_TONE_TINT && floor === DEFAULT_TONE_FLOOR) continue;
      terms.push([ink(tint, floor), `${tintOn(tint)} * ${floorOn(floor)}`]);
    }
    write(`fg-${role}-rung`, pick(ink(DEFAULT_TONE_TINT, DEFAULT_TONE_FLOOR), terms));
  }
  return out;
}
