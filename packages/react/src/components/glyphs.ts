/** Area-drawn component glyphs, generated from apps/docs/assets/area-icons-pilot by
 * apps/docs/scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each glyph is a list of stroked centre-line paths on the 16px grid. */
export const glyphs = {
  "add": [
    "M8 2.5V13.5M2.5 8H13.5"
  ],
  "arrow-up": [
    "M8 13V3M3.5 7.5L8 3L12.5 7.5"
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
  ],
  "grip": [
    "M5.5 6H10.5M5.5 10H10.5"
  ],
  "subtract": [
    "M2.5 8H13.5"
  ],
  "corner": [
    "M2.5 13.5V7.5A5 5 0 0 1 7.5 2.5H13.5"
  ],
  "corners": [
    "M2.5 6V5A2.5 2.5 0 0 1 5 2.5H6M10 2.5H11A2.5 2.5 0 0 1 13.5 5V6M13.5 10V11A2.5 2.5 0 0 1 11 13.5H10M6 13.5H5A2.5 2.5 0 0 1 2.5 11V10"
  ],
  "padding-side": [
    "M4.5 2.5H11.5A2 2 0 0 1 13.5 4.5V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V4.5A2 2 0 0 1 4.5 2.5Z",
    "M5.5 5.5V10.5"
  ],
  "padding-axis": [
    "M4.5 2.5H11.5A2 2 0 0 1 13.5 4.5V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V4.5A2 2 0 0 1 4.5 2.5Z",
    "M5.5 5.5V10.5M10.5 5.5V10.5"
  ],
  "sides": [
    "M5.5 2.5H10.5M13.5 5.5V10.5M10.5 13.5H5.5M2.5 10.5V5.5"
  ],
  "search": [
    "M12 7A5 5 0 1 1 2 7A5 5 0 1 1 12 7Z",
    "M10.5 10.5L14 14"
  ]
} as const;
export type GlyphName = keyof typeof glyphs;
