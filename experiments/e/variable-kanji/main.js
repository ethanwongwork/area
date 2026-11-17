// 7 Variable Kanji. 龍 over 驚, each drawn as one line through the centre of Noto Sans JP,
// with every point, handle and coordinate shown while four axes move on their own: weight,
// width, corners and slant. The axes are readouts on the canvas, not controls. The line's
// geometry is in ./curves.js; the skeletons come from scripts/noto-skeleton.mjs.
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import { shell, fontsReady } from '../../src/shell.js';
import { exportable } from '../../src/export.js';
import DATA from '../kanji-lines/noto-complex.json';
import { parse, fillet, mergeCorners, segLen, trimStart, trimEnd, dot, endTan, startTan } from './curves.js';

const { thumb, panel, reduced } = shell('variable-kanji', { viewer: true });

const PAIR = ['龍', '驚'];
const AXES = [
  { key: 'weight', label: 'Weight', min: 8, max: 110, show: (v) => `${Math.round(v)}` },
  { key: 'width', label: 'Width', min: 75, max: 200, show: (v) => `${Math.round(v)}%` },
  { key: 'corners', label: 'Corners', min: 0, max: 130, show: (v) => `${Math.round(v)}` },
  { key: 'slant', label: 'Slant', min: 0, max: 26, show: (v) => `${v.toFixed(1)}°` },
];
const GROUNDS = {
  chartreuse: { ground: '#dcfa00', ink: '#1c1c1c', body: '#f6f4ea', blue: '#0030ff' },
  black: { ground: '#0c0c0c', ink: '#efece2', body: '#efece2', blue: '#2f5bff' },
};
const state = { weight: 46, width: 100, corners: 40, slant: 0, ground: 'chartreuse' };

// Mergers don't depend on the axes, so each kanji's paths are merged once.
const merged = {};
const mergedOf = (ch) => (merged[ch] ??= mergeCorners(DATA[ch].strokes.map((s) => ({ ...parse(s.d), joined: s.joined.slice() }))));

/** The kanji's paths at the current width and slant (an affine map, exact on cubics), then rounded. */
function strokesAt(ch) {
  const sw = state.width / 100, sh = Math.tan((state.slant * Math.PI) / 180);
  const map = (q) => [500 + (q[0] - 500) * sw + (500 - q[1]) * sh, q[1]];
  return mergedOf(ch).map((st) => fillet({ ...st, segs: st.segs.map((s) => ({ c: s.c, p: s.p.map(map) })) }, state.corners));
}

// ── The canvas, in units of the square ──
const G = 270; // each kanji's em (was 385: the pair filled the square edge to edge)
const CX = 392; // the column's centre; over the whole animation the ink stays within x 24 to 760
const OX = CX - G / 2;
const OY = (1000 - 2 * G) / 2;
const S = G / 1000;
const px = (q, k) => [OX + q[0] * S, OY + k * G + q[1] * S];
const P = (q, k) => { const p = px(q, k); return `${p[0].toFixed(1)} ${p[1].toFixed(1)}`; };
const MONO = 'JetBrains Mono Variable, ui-monospace, SF Mono, Menlo, monospace';
const SANS = 'Inter Tight Variable, system-ui, -apple-system, sans-serif';

const stage = document.getElementById('stage');
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svg.setAttribute('class', 'poster');
svg.setAttribute('viewBox', '0 0 1000 1000');
svg.setAttribute('role', 'img');
svg.setAttribute('aria-label', 'Two kanji, 龍 and 驚, drawn as single lines with their points and coordinates, while weight, width, corners and slant change');
stage.append(svg);

let shown = new Map(); // tag key → side, kept from frame to frame so tags hold still

/**
 * Everything one frame draws, at the current axes: the paths, the points, the tags (placed
 * against `prior`, the sides from the frame before) and the readouts. Drawn by toSVG (the page)
 * or toCanvas (exports), so both show the same frame.
 */
function scene(prior) {
  const c = GROUNDS[state.ground];
  const W = state.weight * S, e = 1.1;
  const body = [], inner = [], offs = [], ons = [];
  let centre = '', handles = '';
  const tags = []; // { key, x, y, q, pri }
  PAIR.forEach((ch, k) => {
    strokesAt(ch).forEach((st, si) => {
      const segs = st.segs;
      const d = (list, closed) => {
        let out = `M${P(list[0].p[0], k)}`;
        for (const sg of list) out += sg.c ? `C${P(sg.p[1], k)} ${P(sg.p[2], k)} ${P(sg.p[3], k)}` : `L${P(sg.p[1], k)}`;
        return closed ? `${out}Z` : out;
      };
      const full = d(segs, st.closed);
      body.push(full);
      centre += full;
      // The inside of the edge: free flat ends drawn back by the edge's width.
      let inSegs = segs;
      if (!st.closed) {
        const t = e / S;
        inSegs = segs.slice();
        if (!st.joined[0] && segLen(inSegs[0]) > t * 2) inSegs[0] = trimStart(inSegs[0], t);
        if (!st.joined[1] && segLen(inSegs.at(-1)) > t * 2) inSegs[inSegs.length - 1] = trimEnd(inSegs.at(-1), t);
      }
      inner.push(d(inSegs, st.closed));
      segs.forEach((sg, j) => {
        if (!sg.c) return;
        handles += `M${P(sg.p[0], k)}L${P(sg.p[1], k)}M${P(sg.p[3], k)}L${P(sg.p[2], k)}`;
        [sg.p[1], sg.p[2]].forEach((hq, h) => {
          const p = px(hq, k);
          offs.push(p);
          tags.push({ key: `${k}.${si}.h${j}.${h}`, x: p[0], y: p[1], q: hq, pri: 1 });
        });
      });
      const nodes = [segs[0].p[0], ...segs.map((sg) => sg.p.at(-1))];
      const count = st.closed ? nodes.length - 1 : nodes.length;
      for (let i = 0; i < count; i++) {
        const before = i > 0 ? segs[i - 1] : st.closed ? segs.at(-1) : null;
        const after = i < segs.length ? segs[i] : st.closed ? segs[0] : null;
        const smooth = before && after && dot(endTan(before), startTan(after)) > Math.cos((3 * Math.PI) / 180);
        const p = px(nodes[i], k);
        ons.push({ p, smooth });
        tags.push({ key: `${k}.${si}.n${i}`, x: p[0], y: p[1], q: nodes[i], pri: 0 });
      }
    });
  });
  const { placed, next } = labels(tags, prior);
  return { c, W, e, body, inner, centre, handles, offs, ons, placed, next, values: AXES.map((a) => state[a.key]) };
}

const f1 = (v) => v.toFixed(1);
const TAG_H = 12.5;

function toSVG(sc) {
  const { c, W, e } = sc;
  const attrs = 'fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="4"';
  const offs = sc.offs.map((p) => `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="2.4"/>`).join('');
  const ons = sc.ons.map(({ p, smooth }) => (smooth
    ? `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="3"/>`
    : `<rect x="${f1(p[0] - 2.8)}" y="${f1(p[1] - 2.8)}" width="5.6" height="5.6"/>`)).join('');
  const tags = sc.placed.map(({ sx, sy, tw, text }) =>
    `<g transform="translate(${f1(sx)} ${f1(sy)})"><rect width="${f1(tw)}" height="${TAG_H}" fill="#ffffff"/><text x="2.5" y="9.3" fill="#1c1c1c" font-family="${MONO}" font-size="9.3">${text}</text></g>`).join('');
  const readout = readouts(sc.values).map((r) =>
    `<text x="${r.x0}" y="${r.y - 16}" fill="${c.ink}" font-family="${SANS}" font-size="15">${r.label}</text>` +
    `<text x="${r.x1}" y="${r.y - 16}" fill="${c.ink}" font-family="${MONO}" font-size="13" text-anchor="end">${r.value}</text>` +
    `<line x1="${r.x0}" x2="${r.x1}" y1="${r.y}" y2="${r.y}" stroke="${c.ink}" stroke-width="1"/>` +
    `<rect x="${f1(r.mx - 5)}" y="${r.y - 5}" width="10" height="10" fill="${c.ink}"/>`).join('');
  svg.innerHTML =
    `<rect width="1000" height="1000" fill="${c.ground}"/>` +
    `<g ${attrs} stroke="${c.blue}" stroke-width="${W.toFixed(2)}">${sc.body.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<g ${attrs} stroke="${c.body}" stroke-width="${Math.max(0, W - 2 * e).toFixed(2)}">${sc.inner.map((d) => `<path d="${d}"/>`).join('')}</g>` +
    `<path d="${sc.centre}" fill="none" stroke="${c.blue}" stroke-width="0.9"/>` +
    `<path d="${sc.handles}" fill="none" stroke="${c.blue}" stroke-width="0.9"/>` +
    `<g fill="${c.blue}">${offs}</g>` +
    `<g fill="#ffffff" stroke="${c.blue}" stroke-width="0.9">${ons}</g>` +
    tags + readout;
}

/** The same frame on a canvas, `size` px square: the SVG's drawing, element by element. */
function toCanvas(sc, size) {
  const { c, W, e } = sc;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const g = cv.getContext('2d');
  g.scale(size / 1000, size / 1000);
  g.fillStyle = c.ground;
  g.fillRect(0, 0, 1000, 1000);
  g.lineCap = 'butt';
  g.lineJoin = 'miter';
  g.miterLimit = 4;
  const strokeAll = (list, color, w) => {
    if (!(w > 0)) return;
    g.strokeStyle = color;
    g.lineWidth = w;
    for (const d of list) g.stroke(new Path2D(d));
  };
  strokeAll(sc.body, c.blue, +W.toFixed(2));
  strokeAll(sc.inner, c.body, +Math.max(0, W - 2 * e).toFixed(2));
  strokeAll([sc.centre, sc.handles].filter(Boolean), c.blue, 0.9);
  const r1 = (v) => +f1(v);
  g.fillStyle = c.blue;
  for (const p of sc.offs) { g.beginPath(); g.arc(r1(p[0]), r1(p[1]), 2.4, 0, Math.PI * 2); g.fill(); }
  g.strokeStyle = c.blue;
  g.lineWidth = 0.9;
  for (const { p, smooth } of sc.ons) {
    g.beginPath();
    if (smooth) g.arc(r1(p[0]), r1(p[1]), 3, 0, Math.PI * 2);
    else g.rect(r1(p[0] - 2.8), r1(p[1] - 2.8), 5.6, 5.6);
    g.fillStyle = '#ffffff';
    g.fill();
    g.stroke();
  }
  g.textBaseline = 'alphabetic';
  g.font = `9.3px ${MONO}`;
  for (const { sx, sy, tw, text } of sc.placed) {
    const x = r1(sx), y = r1(sy);
    g.fillStyle = '#ffffff';
    g.fillRect(x, y, r1(tw), TAG_H);
    g.fillStyle = '#1c1c1c';
    g.fillText(text, x + 2.5, y + 9.3);
  }
  for (const r of readouts(sc.values)) {
    g.fillStyle = c.ink;
    g.font = `15px ${SANS}`;
    g.textAlign = 'left';
    g.fillText(r.label, r.x0, r.y - 16);
    g.font = `13px ${MONO}`;
    g.textAlign = 'right';
    g.fillText(r.value, r.x1, r.y - 16);
    g.fillRect(r.x0, r.y - 0.5, r.x1 - r.x0, 1);
    g.fillRect(r1(r.mx - 5), r.y - 5, 10, 10);
  }
  return cv;
}

function render() {
  const sc = scene(shown);
  shown = sc.next;
  toSVG(sc);
}

/**
 * Coordinates in Noto's units (x across, y up from the baseline) as tags beside their
 * points, on both kanji at once. A tag keeps its side from the last frame (`prior`) while it
 * stays clear; then points before handles; a tag that would cover another is left out.
 */
function labels(tags, prior) {
  const CH = 5.6, TH = TAG_H, placed = [], boxes = [], next = new Map();
  const clear = (sx, sy, tw) => sx > 4 && sy > 4 && sx + tw < 775 && sy + TH < 996 &&
    !boxes.some(([x, y, w]) => sx < x + w + 1.5 && sx + tw + 1.5 > x && sy < y + TH + 1.5 && sy + TH + 1.5 > y);
  tags.sort((a, b) => (prior.has(b.key) - prior.has(a.key)) || a.pri - b.pri);
  for (const t of tags) {
    const text = `${Math.round(t.q[0])}.${Math.round(880 - t.q[1])}`;
    const tw = text.length * CH + 5;
    const sides = [[5, -TH - 3], [5, 3], [-tw - 5, -TH - 3], [-tw - 5, 3]];
    const prev = prior.get(t.key);
    const order = prev != null ? [prev, 0, 1, 2, 3].filter((v, i, a) => a.indexOf(v) === i) : [0, 1, 2, 3];
    const side = order.find((i) => clear(t.x + sides[i][0], t.y + sides[i][1], tw));
    if (side == null) continue;
    const sx = t.x + sides[side][0], sy = t.y + sides[side][1];
    boxes.push([sx, sy, tw]);
    next.set(t.key, side);
    placed.push({ sx, sy, tw, text });
  }
  return { placed, next };
}

/** The axes as readouts: name and value over a hairline track with a square marker. No plate. */
function readouts(values) {
  const x0 = 795, x1 = 960, gap = 92;
  const y0 = 500 - ((AXES.length - 1) * gap) / 2;
  return AXES.map((a, i) => {
    const y = y0 + i * gap, v = values[i];
    return { x0, x1, y, label: a.label, value: a.show(v), mx: x0 + ((v - a.min) / (a.max - a.min)) * (x1 - x0) };
  });
}

// ── Motion: each axis swings on its own period ──
// The periods divide one loop of 39 s (6, 4, 5 and 3 swings), so the piece at 39 s is the
// piece at 0 and a recording loops without a seam (they were 6.4, 10.2, 8.2 and 12.6 s).
const LOOP = 39;
const wave = (t, period, phase) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / period + phase);
function at(t) {
  const u = wave(t, LOOP / 4, 2.4);
  state.weight = 8 + 102 * wave(t, LOOP / 6, 0.9);
  state.width = 75 + 125 * u;
  state.corners = 130 * wave(t, LOOP / 5, 1.3);
  // Slant gives way as the letters widen, so the widest never runs into the readouts.
  state.slant = 26 * wave(t, LOOP / 3, 0) * Math.min(1, (1 - u) * 1.6);
}

// ?ground=black and ?at=<seconds> (opens paused at that moment) come from the URL.
const q = new URLSearchParams(location.search);
if (q.get('ground') in GROUNDS) state.ground = q.get('ground');
const atParam = q.has('at') && Number.isFinite(+q.get('at')) ? +q.get('at') : null;
function remember() {
  if (thumb) return;
  const url = new URL(location.href);
  url.searchParams.delete('ground');
  if (state.ground !== 'chartreuse') url.searchParams.set('ground', state.ground);
  history.replaceState(null, '', url);
}

const HERO = 23.4; // the gallery still: weight 61, width 125%, corners 48, slant 9°
let playing = !reduced && !thumb && atParam == null, base = atParam ?? 3.2, mark = performance.now();
const clock = () => (playing ? base + (performance.now() - mark) / 1000 : base);
const setPlaying = (p) => { base = clock(); mark = performance.now(); playing = p; };
const draw = () => { at(clock()); render(); };

if (thumb) {
  base = atParam ?? HERO;
  draw();
  document.documentElement.dataset.rendered = String(Date.now());
} else {
  const loop = () => { if (playing) draw(); requestAnimationFrame(loop); };
  draw();
  requestAnimationFrame(loop);
}

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  if (e.key === ' ') { e.preventDefault(); setPlaying(!playing); }
});

panel.controls(
  [
    { key: 'ground', label: 'Ground', value: state.ground, options: Object.entries(GROUNDS).map(([k, v]) => ({ value: k, swatch: [v.ground] })) },
    { label: 'Play or pause (space)', action: () => setPlaying(!playing) },
  ],
  (key, value) => {
    state[key] = value;
    remember();
    render(); // at once, without waiting for the next frame
  },
);

// ── Share and export ──
// The tags keep their sides from frame to frame, so a frame depends on the frames before it.
// For exports the loop is played once at FPS to settle, then again to record every frame's
// sides; frame i is placed against frame i − 1's, so any `t` draws the same frame every time
// and the last frame leads into the first.
const FPS = 30, N = LOOP * FPS;
let sides = null;
function settle() {
  const keep = { weight: state.weight, width: state.width, corners: state.corners, slant: state.slant };
  let prior = new Map();
  const pass = () => Array.from({ length: N }, (_, i) => { at(i / FPS); prior = scene(prior).next; return prior; });
  pass();
  sides = pass();
  for (let k = 0; k < 4; k++) { // until the loop repeats itself
    at(0);
    const again = scene(sides[N - 1]).next;
    if ([...again].every(([key, v]) => sides[0].get(key) === v) && again.size === sides[0].size) break;
    sides = pass();
  }
  Object.assign(state, keep);
}
function frameAt(t, size) {
  if (!sides) settle();
  const keep = { weight: state.weight, width: state.width, corners: state.corners, slant: state.slant };
  const f = t * FPS, i = Math.round(f);
  const prior = Math.abs(f - i) < 1e-6 ? sides[(((i - 1) % N) + N) % N] : sides[((Math.floor(f) % N) + N) % N];
  at(t);
  const cv = toCanvas(scene(prior), size);
  Object.assign(state, keep);
  return cv;
}

panel.share({
  caption: () => [
    'Two kanji drawn as one line, with every point and coordinate as four axes move.',
    '',
    '龍 (dragon) over 驚 (surprise), each a single line through the centre of Noto Sans JP, with the fewest points that keep every curve smooth. Weight, width, corners and slant each swing on their own period while every point, handle and coordinate stays on show; the set holds still at the axes’ extremes, on a black ground and close up.',
    '',
    'Type: Noto Sans JP and Inter Tight by @googlefonts, JetBrains Mono by @jetbrains',
    'Made with: SVG',
  ].join('\n'),
  note: '2160 px png',
  exportImage: async () => {
    const cv = frameAt(clock(), 2160);
    return { blob: await new Promise((r) => cv.toBlob(r, 'image/png')), name: `variable-kanji-${state.ground}.png` };
  },
});

await fontsReady(`15px ${SANS}`, `13px ${MONO}`, `9.3px ${MONO}`).catch(() => {});
exportable({ loop: LOOP, fps: FPS, render: frameAt });
