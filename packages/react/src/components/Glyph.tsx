// Area-drawn glyphs that components render themselves (docs/specs/icons.md, "Components").
// The drawing is on a 16px grid and scales with the slot. The line follows the size curve
// (Cursor's 16 → 24px step): pass the slot's size, and base.css sets the line from
// --area-weight-icon for that size, so a 12px slot draws about 1px and a 24px slot about 1.35px.
import { useId } from "react";
// A "knockout" glyph (the filled dismiss-circle) is a solid with marks cut out of it, listed by path index in
// glyphKnockouts.
import { glyphFills, glyphKnockouts, glyphPaint, glyphs, type GlyphName } from "./glyphs.ts";

export function Glyph({ name, rotate, size = 16 }: { name: GlyphName; rotate?: 90 | 180 | 270; size?: 12 | 16 | 20 | 24 }) {
  const maskId = useId();
  const paint = glyphPaint[name];
  const fills: readonly number[] = glyphFills[name] ?? [];
  const cuts: readonly number[] = paint === "knockout" ? glyphKnockouts[name] ?? [] : [];
  const drawn = glyphs[name].flatMap((d, i) => cuts.includes(i) ? [] : [[d, i] as const]);
  const paths = drawn.map(([d, i]) => {
    const dot = paint === "fill" || fills.includes(i);
    return <path key={d} d={d} fill={paint || dot ? "currentColor" : "none"} stroke={dot ? "none" : "currentColor"} strokeLinecap="round" strokeLinejoin="round" />;
  });
  // The cut is a mask, not a stroke in the surface colour, so the glyph reads on any ground (a soft field, a
  // selected row). The cut paths are glyph paths too, so base.css strokes them at the glyph's line for its size.
  const body = cuts.length ? (
    <>
      <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <rect width="16" height="16" fill="white" />
        {cuts.map(i => <path key={i} d={glyphs[name][i]} fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" />)}
      </mask>
      <g mask={`url(#${maskId})`}>{paths}</g>
    </>
  ) : paths;
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" data-area-glyph={name} data-area-glyph-size={size === 16 ? undefined : size}>
      {rotate ? <g transform={`rotate(${rotate} 8 8)`}>{body}</g> : body}
    </svg>
  );
}
