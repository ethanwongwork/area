// Sen 線体: a line typeface for kanji and kana, with two axes.
//
//   wdth 50–125   how wide the glyph is drawn. The skeleton stretches; the line doesn't.
//   wght 100–900  how thick the line is, the same everywhere: horizontals, verticals, dots.
//
// The skeletons start as KanjiVG's stroke centrelines (strokes.js), which follow a brush.
// Each stroke is turned into a few straight lines: the brush's curve is simplified away,
// near-horizontals and near-verticals are set level and plumb, the hooks and entry flicks
// are cut, dots become short straight lines, and lines that nearly share a height or a
// position in a glyph are made to share it. What is left is drawn with one pen.
import STROKES from './strokes.js';

export const AXES = {
  wdth: { min: 50, max: 125, default: 80, label: 'Width' },
  wght: { min: 100, max: 900, default: 400, label: 'Weight' },
};

const C = 54.5; // centre of KanjiVG's 109 box
const E0 = 6; // the em: KanjiVG units 6–103 make one em, so glyphs sit tight like the references
const EM = 97;

// The two brackets, which KanjiVG doesn't draw: straight-sided, set to the inner side of
// the cell as Japanese brackets are.
const HAND = {
  '（': [['', [[71, 9], [57, 27], [57, 82], [71, 100]]]],
  '）': [['', [[38, 9], [52, 27], [52, 82], [38, 100]]]],
};
const PUNCT = new Set(['、', '。']);
const SMALL = new Set([...'ぁぃぅぇぉっゃゅょァィゥェォッャュョ']);
const isKana = (ch) => /[ぁ-ヿ]/.test(ch) && !PUNCT.has(ch);

/** Line thickness in KanjiVG units (of 109) for a weight. Even steps to the eye, not to the ruler. */
export function thickness(wght) {
  const k = (wght - AXES.wght.min) / (AXES.wght.max - AXES.wght.min);
  return 1.1 * (9.5 / 1.1) ** k;
}

// ———————————————————————————— path data → points

function parse(d) {
  const tok = d.match(/[MmCcSsLlZz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g);
  const pts = [];
  let i = 0;
  let cmd = '';
  let x = 0;
  let y = 0;
  let cx = 0; // last control point, for S
  let cy = 0;
  const num = () => Number(tok[i++]);
  const cubic = (x1, y1, x2, y2, x3, y3) => {
    const x0 = x;
    const y0 = y;
    for (let k = 1; k <= 16; k++) {
      const t = k / 16;
      const u = 1 - t;
      pts.push([
        u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
      ]);
    }
    cx = x2;
    cy = y2;
    x = x3;
    y = y3;
  };
  while (i < tok.length) {
    if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case 'M':
        x = num() + ox;
        y = num() + oy;
        pts.push([x, y]);
        cx = x;
        cy = y;
        cmd = rel ? 'l' : 'L';
        break;
      case 'L':
        x = num() + ox;
        y = num() + oy;
        pts.push([x, y]);
        cx = x;
        cy = y;
        break;
      case 'C': {
        const a = [num() + ox, num() + oy, num() + ox, num() + oy, num() + ox, num() + oy];
        cubic(...a);
        break;
      }
      case 'S': {
        const r = [2 * x - cx, 2 * y - cy];
        const a = [num() + ox, num() + oy, num() + ox, num() + oy];
        cubic(...r, ...a);
        break;
      }
      case 'Z':
        break;
      default:
        i++;
    }
  }
  return pts;
}

// ———————————————————————————— points → lines

const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function rdp(pts, eps) {
  if (pts.length < 3) return pts.slice();
  const [a, b] = [pts[0], pts.at(-1)];
  const L = len(a, b) || 1e-9;
  let max = 0;
  let at = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const d = Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / L;
    if (d > max) (max = d), (at = i);
  }
  if (max <= eps) return [a, b];
  return [...rdp(pts.slice(0, at + 1), eps).slice(0, -1), ...rdp(pts.slice(at), eps)];
}

/** Angle between two segments' directions, in degrees (0 = straight on). */
function turn(a, b, c) {
  const u = [b[0] - a[0], b[1] - a[1]];
  const v = [c[0] - b[0], c[1] - b[1]];
  const cos = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v) || 1);
  return (Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI;
}

const LEVEL = Math.sin((13 * Math.PI) / 180); // within 13° of level reads as a horizontal
const PLUMB = Math.sin((11 * Math.PI) / 180);

function lineStroke(kind, raw, opts) {
  let p = kind.startsWith('㇔') ? [raw[0], raw.at(-1)] : rdp(raw, opts.tolerance);
  // The brush's entry flick: a short first segment that turns hard into the stroke.
  if (p.length >= 3 && len(p[0], p[1]) < 7 && turn(p[0], p[1], p[2]) > 45) p.shift();
  // The hook at the end (㇚, ㇆, ㇟…): a short last segment that turns back.
  // A curved hook can come out of the simplifier as two short segments, so walk back over
  // the last 16 units and cut at the sharpest turn there, if it is sharp enough.
  if (opts.hooks === 'cut' && p.length >= 3) {
    let tail = 0;
    let cut = -1;
    let sharpest = 55;
    for (let i = p.length - 2; i >= 1; i--) {
      tail += len(p[i], p[i + 1]);
      if (tail > 16) break;
      const a = turn(p[i - 1], p[i], p[i + 1]);
      if (a > sharpest) (sharpest = a), (cut = i);
    }
    if (cut > 0) p = p.slice(0, cut + 1);
  }
  p = p.map((q) => q.slice());
  return p;
}

/** Sets near-level segments level and near-plumb ones plumb, then makes near-equal heights and positions in a glyph equal. */
function straighten(strokes) {
  const rows = []; // [value, point refs (y)]
  const cols = [];
  for (const s of strokes) {
    for (let i = 0; i < s.length - 1; i++) {
      const a = s[i];
      const b = s[i + 1];
      const L = len(a, b) || 1;
      if (Math.abs(b[1] - a[1]) / L < LEVEL) rows.push({ v: (a[1] + b[1]) / 2, pts: [a, b] });
      else if (Math.abs(b[0] - a[0]) / L < PLUMB) cols.push({ v: (a[0] + b[0]) / 2, pts: [a, b] });
    }
  }
  const settle = (list, axis, tol) => {
    list.sort((m, n) => m.v - n.v);
    let group = [];
    const flush = () => {
      if (!group.length) return;
      const v = group.reduce((t, g) => t + g.v, 0) / group.length;
      for (const g of group) for (const q of g.pts) q[axis] = v;
      group = [];
    };
    for (const item of list) {
      if (group.length && item.v - group.at(-1).v > tol) flush();
      group.push(item);
    }
    flush();
  };
  settle(rows, 1, 1.8);
  settle(cols, 0, 1.8);
}

function vertical(ch) {
  if (PUNCT.has(ch)) return ([u, v]) => [u + 60, v - 60]; // 、。 move to the top right
  if (ch === '（' || ch === '）') return ([u, v]) => [C - (v - C), C + (u - C)]; // a quarter turn
  if (SMALL.has(ch)) return ([u, v]) => [u + 7, v - 22];
  return null;
}

const cache = new Map();

/**
 * One glyph's lines in KanjiVG units: an array of polylines.
 * `vert` gives the vertical-setting form (punctuation and small kana move, brackets turn).
 */
export function glyph(ch, { vert = false, tolerance = 2.4, hooks = 'cut' } = {}) {
  const key = `${ch}|${vert}|${tolerance}|${hooks}`;
  if (cache.has(key)) return cache.get(key);
  const src = HAND[ch] ?? (STROKES[ch] ?? []).map(([kind, d]) => [kind, parse(d)]);
  let lines = HAND[ch] ? src.map(([, p]) => p.map((q) => q.slice())) : src.map(([kind, pts]) => lineStroke(kind, pts, { tolerance, hooks }));
  if (!HAND[ch]) straighten(lines);
  // Kana sit a little smaller than kanji, as in every Japanese face.
  if (isKana(ch) && !SMALL.has(ch)) lines = lines.map((l) => l.map(([u, v]) => [C + (u - C) * 0.9, C + (v - C) * 0.9]));
  const f = vert ? vertical(ch) : null;
  if (f) lines = lines.map((l) => l.map(f));
  cache.set(key, lines);
  return lines;
}

/** The raw brush centrelines, for showing what a glyph was made from. */
export function source(ch) {
  return (STROKES[ch] ?? []).map(([, d]) => parse(d));
}

export const has = (ch) => ch in STROKES || ch in HAND;

/** How wide a glyph's cell is, for an em of `size`, at width `wdth`. */
export const advance = (size, wdth) => (size * wdth) / 100;

/**
 * Adds one glyph to a path. (x, y) is the top left of its cell; the cell is
 * advance(size, wdth) wide and `size` tall. Returns the line width to stroke it with.
 */
export function trace(path, ch, x, y, size, { wdth = AXES.wdth.default, wght = AXES.wght.default, vert = false, hooks } = {}) {
  const s = size / EM;
  const w = wdth / 100;
  const T = thickness(wght);
  // Heavier lines draw the skeleton in a little, so the ink stays inside the em.
  const k = 1 - (T * 0.55) / EM;
  const X = (u) => x + (C + (u - C) * k - E0) * w * s;
  const Y = (v) => y + (C + (v - C) * k - E0) * s;
  for (const line of glyph(ch, { vert, hooks })) {
    path.moveTo(X(line[0][0]), Y(line[0][1]));
    for (let i = 1; i < line.length; i++) path.lineTo(X(line[i][0]), Y(line[i][1]));
  }
  return T * s;
}

/** Strokes one glyph straight onto a 2D context. */
export function draw(ctx, ch, x, y, size, axes = {}, ends = 'flat') {
  const path = new Path2D();
  const lw = trace(path, ch, x, y, size, axes);
  pen(ctx, lw, ends);
  ctx.stroke(path);
}

export function pen(ctx, lw, ends = 'flat') {
  ctx.lineWidth = lw;
  ctx.lineCap = ends === 'round' ? 'round' : 'butt';
  ctx.lineJoin = ends === 'round' ? 'round' : 'miter';
  ctx.miterLimit = 2.2;
}
