// 7 Variable Kanji. 龍 over 驚, each drawn as one line through the centre of Noto Sans JP,
// with every point, handle and coordinate shown while four axes move on their own: weight,
// width, corners and slant. The axes are readouts on the canvas, not controls. The line's
// geometry is in ./curves.js; the skeletons come from scripts/noto-skeleton.mjs.
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';
import { shell } from '../../src/shell.js';
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

function render() {
  const c = GROUNDS[state.ground];
  const W = state.weight * S, e = 1.1;
  let body = '', inner = '', centre = '', handles = '', offs = '', ons = '';
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
      body += `<path d="${full}"/>`;
      centre += full;
      // The inside of the edge: free flat ends drawn back by the edge's width.
      let inSegs = segs;
      if (!st.closed) {
        const t = e / S;
        inSegs = segs.slice();
        if (!st.joined[0] && segLen(inSegs[0]) > t * 2) inSegs[0] = trimStart(inSegs[0], t);
        if (!st.joined[1] && segLen(inSegs.at(-1)) > t * 2) inSegs[inSegs.length - 1] = trimEnd(inSegs.at(-1), t);
      }
      inner += `<path d="${d(inSegs, st.closed)}"/>`;
      segs.forEach((sg, j) => {
        if (!sg.c) return;
        handles += `M${P(sg.p[0], k)}L${P(sg.p[1], k)}M${P(sg.p[3], k)}L${P(sg.p[2], k)}`;
        [sg.p[1], sg.p[2]].forEach((hq, h) => {
          const p = px(hq, k);
          offs += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.4"/>`;
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
        ons += smooth
          ? `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3"/>`
          : `<rect x="${(p[0] - 2.8).toFixed(1)}" y="${(p[1] - 2.8).toFixed(1)}" width="5.6" height="5.6"/>`;
        tags.push({ key: `${k}.${si}.n${i}`, x: p[0], y: p[1], q: nodes[i], pri: 0 });
      }
    });
  });

  const attrs = 'fill="none" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="4"';
  svg.innerHTML =
    `<rect width="1000" height="1000" fill="${c.ground}"/>` +
    `<g ${attrs} stroke="${c.blue}" stroke-width="${W.toFixed(2)}">${body}</g>` +
    `<g ${attrs} stroke="${c.body}" stroke-width="${Math.max(0, W - 2 * e).toFixed(2)}">${inner}</g>` +
    `<path d="${centre}" fill="none" stroke="${c.blue}" stroke-width="0.9"/>` +
    `<path d="${handles}" fill="none" stroke="${c.blue}" stroke-width="0.9"/>` +
    `<g fill="${c.blue}">${offs}</g>` +
    `<g fill="#ffffff" stroke="${c.blue}" stroke-width="0.9">${ons}</g>` +
    labels(tags) +
    readouts(c);
}

/**
 * Coordinates in Noto's units (x across, y up from the baseline) as tags beside their
 * points, on both kanji at once. A tag keeps its side from the last frame while it stays
 * clear; then points before handles; a tag that would cover another is left out.
 */
function labels(tags) {
  const CH = 5.6, TH = 12.5, placed = [], next = new Map();
  const clear = (sx, sy, tw) => sx > 4 && sy > 4 && sx + tw < 775 && sy + TH < 996 &&
    !placed.some(([x, y, w]) => sx < x + w + 1.5 && sx + tw + 1.5 > x && sy < y + TH + 1.5 && sy + TH + 1.5 > y);
  tags.sort((a, b) => (shown.has(b.key) - shown.has(a.key)) || a.pri - b.pri);
  let out = '';
  for (const t of tags) {
    const text = `${Math.round(t.q[0])}.${Math.round(880 - t.q[1])}`;
    const tw = text.length * CH + 5;
    const sides = [[5, -TH - 3], [5, 3], [-tw - 5, -TH - 3], [-tw - 5, 3]];
    const prev = shown.get(t.key);
    const order = prev != null ? [prev, 0, 1, 2, 3].filter((v, i, a) => a.indexOf(v) === i) : [0, 1, 2, 3];
    const side = order.find((i) => clear(t.x + sides[i][0], t.y + sides[i][1], tw));
    if (side == null) continue;
    const sx = t.x + sides[side][0], sy = t.y + sides[side][1];
    placed.push([sx, sy, tw]);
    next.set(t.key, side);
    out += `<g transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})"><rect width="${tw.toFixed(1)}" height="${TH}" fill="#ffffff"/><text x="2.5" y="9.3" fill="#1c1c1c" font-family="${MONO}" font-size="9.3">${text}</text></g>`;
  }
  shown = next;
  return out;
}

/** The axes as readouts: name and value over a hairline track with a square marker. No plate. */
function readouts(c) {
  const x0 = 795, x1 = 960, gap = 92;
  const y0 = 500 - ((AXES.length - 1) * gap) / 2;
  return AXES.map((a, i) => {
    const y = y0 + i * gap;
    const mx = x0 + ((state[a.key] - a.min) / (a.max - a.min)) * (x1 - x0);
    return `<text x="${x0}" y="${y - 16}" fill="${c.ink}" font-family="${SANS}" font-size="15">${a.label}</text>` +
      `<text x="${x1}" y="${y - 16}" fill="${c.ink}" font-family="${MONO}" font-size="13" text-anchor="end">${a.show(state[a.key])}</text>` +
      `<line x1="${x0}" x2="${x1}" y1="${y}" y2="${y}" stroke="${c.ink}" stroke-width="1"/>` +
      `<rect x="${(mx - 5).toFixed(1)}" y="${y - 5}" width="10" height="10" fill="${c.ink}"/>`;
  }).join('');
}

// ── Motion: each axis swings on its own period ──
const wave = (t, period, phase) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / period + phase);
function at(t) {
  const u = wave(t, 10.2, 2.4);
  state.weight = 8 + 102 * wave(t, 6.4, 0.9);
  state.width = 75 + 125 * u;
  state.corners = 130 * wave(t, 8.2, 1.3);
  // Slant gives way as the letters widen, so the widest never runs into the readouts.
  state.slant = 26 * wave(t, 12.6, 0) * Math.min(1, (1 - u) * 1.6);
}

let playing = !reduced && !thumb, base = 3.2, mark = performance.now();
const clock = () => (playing ? base + (performance.now() - mark) / 1000 : base);
const setPlaying = (p) => { base = clock(); mark = performance.now(); playing = p; };
const draw = () => { at(clock()); render(); };

if (thumb) {
  base = 29.4; // weight 63, width 143%, corners 48, slant 14°
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
    render(); // at once, without waiting for the next frame
  },
);
