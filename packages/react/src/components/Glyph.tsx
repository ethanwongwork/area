// Area-drawn glyphs that components render themselves (docs/specs/icons.md, "Components").
// The drawing is on a 16px grid and scales with the slot. The line follows the size curve
// (Cursor's 16 → 24px step): pass the slot's size, and base.css sets the line from
// --area-weight-icon for that size, so a 12px slot draws about 1px and a 24px slot about 1.35px.
// size 12 is the xs icon slot (--area-icon-xs), 12px below type 16 and 16px at 16. A glyph with a 12px cut
// (glyphCuts12, docs/specs/icons.md "12px cuts") carries both drawings there, and base.css shows the cut only
// where the slot is 12 (--area-type-icon-xs-cut, or a component's --_glyph-cut), so its lines are crisp at 1×.
import { useId } from "react";
// A "knockout" glyph (the filled dismiss-circle) is a solid with marks cut out of it, listed by path index in
// glyphKnockouts.
import { glyphBodies, glyphCutFills10, glyphCutFills12, glyphCuts10, glyphCuts12, glyphFills, glyphKnockouts, glyphPaint, glyphs, type GlyphName } from "./glyphs.ts";

export function Glyph({ name, rotate, size = 16 }: { name: GlyphName; rotate?: 90 | 180 | 270; size?: 12 | 16 | 20 | 24 }) {
  const maskId = useId();
  const paint = glyphPaint[name];
  const fills: readonly number[] = glyphFills[name] ?? [];
  // A "body" glyph fills only its body paths and strokes everything (docs/specs/icons.md, "Filled = body only").
  const bodies: readonly number[] = paint === "body" ? glyphBodies[name] ?? [] : [];
  const cuts: readonly number[] = paint === "knockout" ? glyphKnockouts[name] ?? [] : [];
  const drawn = glyphs[name].flatMap((d, i) => cuts.includes(i) ? [] : [[d, i] as const]);
  const paths = drawn.map(([d, i]) => {
    const dot = paint === "fill" || fills.includes(i);
    const filled = (paint && paint !== "body") || dot || bodies.includes(i);
    return <path key={d} d={d} fill={filled ? "currentColor" : "none"} stroke={dot ? "none" : "currentColor"} strokeLinecap="round" strokeLinejoin="round" />;
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
  const drawing = rotate ? <g transform={`rotate(${rotate} 8 8)`}>{body}</g> : body;
  const cut = size === 12 ? glyphCuts12[name] : undefined;
  // A 10px cut (docs/specs/icons.md "10px cuts"): a mark's Compact slot. base.css shows it where --_glyph-cut10 is 1.
  const cut10 = size === 12 ? glyphCuts10[name] : undefined;
  if (!cut && !cut10) return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" data-area-glyph={name} data-area-glyph-size={size === 16 ? undefined : size}>
      {drawing}
    </svg>
  );
  // Each cut is drawn in its own grid (12 or 10 units), scaled into the 16 viewBox, so one unit is a pixel at its size.
  const lines = (paths: readonly string[], dots: readonly number[]) => paths.map((d, i) => dots.includes(i)
    ? <path key={d} d={d} fill="currentColor" stroke="none" />
    : <path key={d} d={d} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />);
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false" data-area-glyph={name} data-area-glyph-size="12" data-area-glyph-cuts={cut10 ? (cut ? "10 12" : "10") : undefined}>
      <g data-area-glyph-drawing="16">{drawing}</g>
      {cut ? <g data-area-glyph-drawing="12" transform={`scale(${16 / 12})${rotate ? ` rotate(${rotate} 6 6)` : ""}`}>{lines(cut, glyphCutFills12[name] ?? [])}</g> : null}
      {cut10 ? <g data-area-glyph-drawing="10" transform={`scale(${16 / 10})${rotate ? ` rotate(${rotate} 5 5)` : ""}`}>{lines(cut10, glyphCutFills10[name] ?? [])}</g> : null}
    </svg>
  );
}
