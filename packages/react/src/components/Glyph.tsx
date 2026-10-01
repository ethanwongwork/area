// Area-drawn glyphs that components render themselves (docs/specs/icons.md, "Components").
// The drawing is on a 16px grid and scales with the slot. The line follows the size curve
// (Cursor's 16 → 24px step): pass the slot's size, and base.css sets the line from
// --area-weight-icon for that size, so a 12px slot draws about 1px and a 24px slot about 1.35px.
import { glyphs, type GlyphName } from "./glyphs.ts";

// `filled` fills each closed outline inside its own stroke: the icon set's filled variant of a
// solid shape (stop), not a way to fill line glyphs.
export function Glyph({ name, rotate, size = 16, filled }: { name: GlyphName; rotate?: 90 | 180 | 270; size?: 12 | 16 | 20 | 24; filled?: boolean }) {
  const paths = (glyphs[name] as readonly (string | { readonly fill: string })[]).map(entry => typeof entry === "string"
    ? <path key={entry} d={entry} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    // A solid dot keeps its drawn size at every weight: no stroke.
    : <path key={entry.fill} d={entry.fill} fill="currentColor" stroke="none" />);
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" data-area-glyph={name} data-area-glyph-size={size === 16 ? undefined : size}>
      {rotate ? <g transform={`rotate(${rotate} 8 8)`}>{paths}</g> : paths}
    </svg>
  );
}
