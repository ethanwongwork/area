/**
 * Density: how much room surrounds text, in three levels (owner, 2026-10-12: "separate the type
 * size and density and size"). Named as one number since 2026-10-14, as Radius, Elevation, Motion
 * and Surface are (owner: "continue working on the next axis"): the medium Button's height at type
 * 14, 28 (Compact), 32 (the default) or 36 (Comfortable); `data-area-density="28"|"32"|"36"` (was
 * compact / default / comfortable). Three levels, not more: Gmail, Google Calendar, Discord, SAP,
 * Salesforce and macOS's sidebar all offer three, and a fourth level down puts sm at the 24 floor
 * beside md (docs/research/density-2026-10-14.md). The axis writes the level (−1, 0, 1);
 * emit/base.ts derives every height, icon gap, row, mark and inset from it together with the type
 * size (axes/type-size.ts), so no pairing can clip its text:
 *
 *   control height  the text line plus the level's room above and below, never under 24 for a
 *                   target (WCAG 2.5.8; xs 20): at type 14, Default gives 24 / 28 / 32 / 40 / 48,
 *                   Primer's ladder and today's default exactly
 *   room            xs 4, sm 4, md 6, lg 10, xl 12, rows 6 at Default; 2 less a level down, 2 more
 *                   a level up (Fluent and WinUI size controls the same way: line + padding)
 *   spacing         insets and gaps keep each level's ratio of space to type (compact 12 at 12,
 *                   default 16 at 14, comfortable 20 at 14), as a step in halves that insets read
 *                   as `--area-ui-dense` (1 at Compact 12, 0.5 at the default type 13, 0 at Default
 *                   14); gaps read the same curve in whole steps, `--area-ui-gap-step`, so a gap is
 *                   always on the 2px ladder (plan A1.1, 2026-11-11)
 *
 * The ladder stays derived (owner, 2026-11-11, plan A8.1): at the default type 13 it is 22 / 26 / 30 / 38 / 46
 * with rows 30, and the app's Compact 20 / 24 / 26 / 34 / 42 with rows 28. It is not snapped to a 4px ladder
 * (that would move the app's 26 to 28) and the default density stays 32. A height is a ladder token, or a ladder
 * token plus whole room steps (`+ 2 × ui-stack`), never a `+ 2px` literal (plan A8.2).
 *
 * The type size bounds the level (type-level-min / -max): 28 at 15 and 16 and 36 at 12 resolve
 * to 32. docs/research/ui-size-scale-2026-10-12.md has the evidence and the
 * comparison sheet the values were judged on.
 *
 * Spacing primitives never rescale: a level picks different steps, it does not make 12px 10px.
 */
import { type AxisDefinition, tokens } from "./schema.ts";

export const DENSITY_LEVELS = { "28": -1, "32": 0, "36": 1 } as const;
export type DensityId = keyof typeof DENSITY_LEVELS;

export const DENSITY_AXIS: AxisDefinition = {
  id: "density",
  label: "Density",
  description: "The room around text, as the medium Button's height at type 14: 28 (Compact), 32 or 36 (Comfortable). Heights, gaps and insets follow it and the type size.",
  defaultPreset: "32",
  namespaces: ["--area-density-"],
  presets: [
    { id: "28", label: "28 (Compact)", description: "Tight rooms and rows for dense tools. Up to type 14.", tokens: tokens({ "density-level": DENSITY_LEVELS["28"] }) },
    { id: "32", label: "32", description: "The everyday room: 32px medium controls at type 14.", tokens: tokens({ "density-level": DENSITY_LEVELS["32"] }) },
    { id: "36", label: "36 (Comfortable)", description: "More room, for reading and touch. From type 13.", tokens: tokens({ "density-level": DENSITY_LEVELS["36"] }) },
  ],
};
