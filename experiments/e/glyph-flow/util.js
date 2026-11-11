// Shared helpers for the layouts.
export const MONO = '"JetBrains Mono Variable", ui-monospace, monospace';

export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const fbm = (noise, x, y, oct = 3) => {
  let v = 0;
  let a = 0.5;
  let f = 1;
  for (let i = 0; i < oct; i++, a *= 0.5, f *= 2) v += a * noise(x * f, y * f);
  return v;
};
export const shuffle = (rng, arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Glyphs with enough body to read as a mark in a pattern (no accents, dots or rules). */
export function solid(gf) {
  return gf.glyphs.filter((g) => {
    if (g.group === 'mark') return false;
    const b = gf.get(g.id).bbox;
    return (b.maxX - b.minX) * (b.maxY - b.minY) > 0.08 * gf.upm * gf.upm;
  });
}

/** Groups glyphs by the letter they're built on: [[A, Á, Ă, …, A.ss10], [B], …]. */
export function letters(glyphs) {
  const map = new Map();
  for (const g of glyphs) {
    const base = g.cp === undefined ? g.name.split(/[._]/)[0] : String.fromCodePoint(g.cp).normalize('NFD')[0];
    if (!map.has(base)) map.set(base, []);
    map.get(base).push(g);
  }
  return [...map.values()];
}

export function caption(ctx, text, x, y, size, align = 'left') {
  ctx.save();
  ctx.font = `500 ${size}px ${MONO}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.restore();
}

