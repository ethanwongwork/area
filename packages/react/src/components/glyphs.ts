/** Area-drawn component glyphs, generated from apps/docs/assets/area-icons-pilot by
 * apps/docs/scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each glyph is a list of stroked centre-line paths on the 16px grid. */
export const glyphs = {
  "add": [
    "M8 2.5V13.5M2.5 8H13.5"
  ],
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
  ],
  "grip": [
    "M5.5 6.5H10.5M5.5 9.5H10.5"
  ],
  "subtract": [
    "M2.5 8H13.5"
  ],
  "corner": [
    "M3.5 12.5V8.5A5 5 0 0 1 8.5 3.5H12.5"
  ],
  "corners": [
    "M6 2.5H5A2.5 2.5 0 0 0 2.5 5V6",
    "M10 2.5H11A2.5 2.5 0 0 1 13.5 5V6",
    "M13.5 10V11A2.5 2.5 0 0 1 11 13.5H10",
    "M6 13.5H5A2.5 2.5 0 0 1 2.5 11V10"
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
    "M10.75 10.75L14 14"
  ],
  "stop": [
    "M4.5 2.5H11.5A2 2 0 0 1 13.5 4.5V11.5A2 2 0 0 1 11.5 13.5H4.5A2 2 0 0 1 2.5 11.5V4.5A2 2 0 0 1 4.5 2.5Z"
  ],
  "more": [
    "M2 8A1 1 0 1 0 4 8A1 1 0 1 0 2 8Z",
    "M7 8A1 1 0 1 0 9 8A1 1 0 1 0 7 8Z",
    "M12 8A1 1 0 1 0 14 8A1 1 0 1 0 12 8Z"
  ],
  "open": [
    "M8 2.5H4.5A2 2 0 0 0 2.5 4.5V11.5A2 2 0 0 0 4.5 13.5H11.5A2 2 0 0 0 13.5 11.5V8",
    "M10.5 2.5H13.5V5.5M13.5 2.5L8 8"
  ],
  "upload": [
    "M8 11V3M5 6L8 3L11 6",
    "M2.5 10V12A1.5 1.5 0 0 0 4 13.5H12A1.5 1.5 0 0 0 13.5 12V10"
  ],
  "document": [
    "M8 2H5.5A2 2 0 0 0 3.5 4V12A2 2 0 0 0 5.5 14H10.5A2 2 0 0 0 12.5 12V6.5",
    "M8 2.4V4.6",
    "M8 4.6V5A1.5 1.5 0 0 0 9.5 6.5H9.9",
    "M9.9 6.5H12.5V6.2",
    "M8 2L8.588 2A0.5 0.5 0 0 1 8.941 2.146L12.354 5.559A0.5 0.5 0 0 1 12.5 5.912",
    "M6.5 8.5H9.5M6.5 11.5H9.5"
  ],
  "reset": [
    "M3 5.5A5.59 5.59 0 1 1 2.6 9.447",
    "M3 2.5V5.5H6"
  ],
  "info": [
    "M2 8A6 6 0 1 0 14 8A6 6 0 1 0 2 8Z",
    "M8 7.25V11",
    "M7.25 5A0.75 0.75 0 1 0 8.75 5A0.75 0.75 0 1 0 7.25 5Z"
  ],
  "help": [
    "M2 8A6 6 0 1 0 14 8A6 6 0 1 0 2 8Z",
    "M6.5 6A1.5 1.5 0 1 1 8.75 7.299Q8 7.732 8 8.75V9",
    "M7.25 11.25A0.75 0.75 0 1 0 8.75 11.25A0.75 0.75 0 1 0 7.25 11.25Z"
  ],
  "dismiss-circle": [
    "M2 8A6 6 0 1 0 14 8A6 6 0 1 0 2 8Z",
    "M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5"
  ]
} as const;
export type GlyphName = keyof typeof glyphs;
/** Glyphs that are not line drawings: "solid" also fills inside the centre-line (the filled
 * variant's solid role); "fill" is filled shapes with no stroke (dots); "knockout" is a solid
 * whose glyphKnockouts paths are cut out of it (a mask), not painted. */
export const glyphPaint: Partial<Record<GlyphName, "solid" | "fill" | "knockout">> = {"stop":"solid","more":"fill","dismiss-circle":"knockout"};
/** Filled dots inside a line drawing, by path index (the i's dot, the ?'s point). */
export const glyphFills: Partial<Record<GlyphName, readonly number[]>> = {"info":[2],"help":[2]};
/** Knocked-out marks in a "knockout" glyph, by path index (dismiss-circle's ×), stroked at the line. */
export const glyphKnockouts: Partial<Record<GlyphName, readonly number[]>> = {"dismiss-circle":[1]};
