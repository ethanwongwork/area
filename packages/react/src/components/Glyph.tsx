// Area-drawn glyphs that components render themselves (docs/specs/icons.md, "Components").
// The drawing is on a 16px grid and scales with the slot. The line follows the size curve
// (Cursor's 16 → 24px step): pass the slot's size, and base.css sets the line from
// --area-weight-icon for that size, so a 12px slot draws about 1px and a 24px slot about 1.35px.
import { glyphPaint, glyphs, type GlyphName } from "./glyphs.ts";

export function Glyph({ name, rotate, size = 16 }: { name: GlyphName; rotate?: 90 | 180 | 270; size?: 12 | 16 | 20 | 24 }) {
  const paint = glyphPaint[name];
  const paths = glyphs[name].map(d => (
    <path key={d} d={d} fill={paint ? "currentColor" : "none"} stroke={paint === "fill" ? "none" : "currentColor"} strokeLinecap="round" strokeLinejoin="round" />
  ));
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" data-area-glyph={name} data-area-glyph-size={size === 16 ? undefined : size}>
      {rotate ? <g transform={`rotate(${rotate} 8 8)`}>{paths}</g> : paths}
    </svg>
  );
}
