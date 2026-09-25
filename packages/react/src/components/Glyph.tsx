// Area-drawn glyphs that components render themselves (docs/specs/icons.md, "Components").
// The drawing is on a 16px grid and scales with the slot, line included, so a 12px slot
// draws a proportionally lighter line (Cursor's model). base.css sets the line to
// --area-weight-icon through [data-area-glyph].
import { glyphs, type GlyphName } from "./glyphs.ts";

export function Glyph({ name, rotate }: { name: GlyphName; rotate?: 90 | 180 | 270 }) {
  const paths = glyphs[name].map(d => (
    <path key={d} d={d} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  ));
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" data-area-glyph={name}>
      {rotate ? <g transform={`rotate(${rotate} 8 8)`}>{paths}</g> : paths}
    </svg>
  );
}
