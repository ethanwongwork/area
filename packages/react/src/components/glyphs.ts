/** Area-drawn component glyphs, generated from apps/docs/assets/area-icons-pilot by
 * apps/docs/scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each glyph is a list of stroked centre-line paths on the 16px grid. */
export const glyphs = {
  "arrow-up": [
    "M8 14V2M3 7L8 2L13 7"
  ],
  "check": [
    "M3 8L6.5 11.5L13.5 4.5"
  ],
  "check-inset": [
    "M5 8L7 10L11 6"
  ],
  "chevron-down": [
    "M3.5 5.5L8 10L12.5 5.5"
  ],
  "dismiss": [
    "M3 3L13 13M13 3L3 13"
  ]
} as const;
export type GlyphName = keyof typeof glyphs;
