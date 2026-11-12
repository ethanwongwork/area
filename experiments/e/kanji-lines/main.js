// 4 Sen. A line typeface for kanji with two axes, width and weight, shown moving.
// Locked: the drawing, the copy, the type sizes. Open: the view, the motion, the ends, the ground.
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/jetbrains-mono';
import { shell, fontsReady } from '../../src/shell.js';
import { AXES, advance, trace, pen, glyph, thickness } from './lines.js';
import { COPY, TITLE } from './copy.js';

const { thumb, panel, reduced, entry } = shell('kanji-lines', { viewer: true });
const q = new URLSearchParams(location.search);

const W = 1200;
const H = 1600;
const M = 40;
const MONO = '"JetBrains Mono Variable", ui-monospace, monospace';
const SERIF = '"Fraunces Variable", Georgia, serif';

const GROUNDS = {
  grid: { bg: '#dce7f5', ink: '#3a5fa3', rule: 'rgba(58, 95, 163, 0.15)', mark: '#e4472b' },
  yellow: { bg: '#ffd21f', ink: '#141414', mark: '#1f4fd8' },
  black: { bg: '#0b0b0b', ink: '#f2f1ec', mark: '#ff5533' },
  paper: { bg: '#f4f2ee', ink: '#161616', mark: '#2f5fe0' },
};
const VIEWS = { poster: 'grid', columns: 'yellow', axes: 'paper' };
const pick = (k, list, d) => (list.includes(q.get(k)) ? q.get(k) : d);

const state = {
  view: pick('view', Object.keys(VIEWS), 'poster'),
  motion: pick('motion', ['wave', 'breathe', 'still'], 'wave'),
  ends: pick('ends', ['flat', 'round'], 'flat'),
  ground: null,
};
state.ground = pick('ground', Object.keys(GROUNDS), VIEWS[state.view]);

const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.style.setProperty('--ratio', W / H);
canvas.setAttribute('role', 'img');
stage.append(canvas);
const ctx = canvas.getContext('2d');

// ———————————————————————————— the axes over time

const lerp = (a, b, k) => a + (b - a) * k;
const ease = (k) => k * k * (3 - 2 * k); // linger a little at either end
const PERIOD = 6; // seconds for one full swing

/** Where a glyph sits on its swing, -1…1. `i` is its place in the wave. */
function swing(t, i, step) {
  if (state.motion === 'breathe') return Math.sin((2 * Math.PI * t) / PERIOD - Math.PI / 2);
  return Math.sin((2 * Math.PI * t) / PERIOD - i * step);
}
const weightAt = (p, lo = AXES.wght.min, hi = AXES.wght.max) => lerp(lo, hi, ease((p + 1) / 2));
const widthAt = (p) => lerp(AXES.wdth.min, AXES.wdth.max, ease((p + 1) / 2));
const clampW = (w) => Math.max(AXES.wdth.min, Math.min(AXES.wdth.max, w));

/** Widths for a row that must fill `room`: each glyph's own swing, then scaled so the row is justified. */
function justify(ps, size, room) {
  const raw = ps.map(widthAt);
  const want = (room * 100) / size;
  const f = want / raw.reduce((a, b) => a + b, 0);
  return raw.map((w) => clampW(w * f));
}

// ———————————————————————————— drawing

function glyphAt(ch, x, y, size, axes, color) {
  const path = new Path2D();
  const lw = trace(path, ch, x, y, size, axes);
  pen(ctx, lw, state.ends);
  ctx.strokeStyle = color;
  ctx.stroke(path);
}

function ground(g) {
  ctx.fillStyle = g.bg;
  ctx.fillRect(0, 0, W, H);
  if (!g.rule) return;
  ctx.strokeStyle = g.rule;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 16) ctx.moveTo(x + 0.5, 0), ctx.lineTo(x + 0.5, H);
  for (let y = 0; y <= H; y += 16) ctx.moveTo(0, y + 0.5), ctx.lineTo(W, y + 0.5);
  ctx.stroke();
}

function label(text, x, y, g, { size = 12, align = 'left', knock = true } = {}) {
  ctx.font = `500 ${size}px ${MONO}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  if (knock) {
    const w = ctx.measureText(text).width;
    const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    ctx.fillStyle = g.bg;
    ctx.fillRect(x0 - 4, y - size, w + 8, size + 5);
  }
  ctx.fillStyle = g.ink;
  ctx.fillText(text, x, y);
}

/** Breaks the copy into vertical columns of `rows`: each sentence starts a column, 、。） may hang one below. */
const columnCache = new Map();
function setColumns(text, rows) {
  if (columnCache.has(rows)) return columnCache.get(rows);
  const HANG = new Set([...'、。）']);
  const cols = [];
  let k = 0;
  for (const s of text) {
    let col = [];
    cols.push(col);
    for (const ch of s) {
      if (col.length >= rows && !(HANG.has(ch) && col.length === rows)) cols.push((col = []));
      col.push([ch, col.length, k++]);
    }
  }
  columnCache.set(rows, cols);
  return cols;
}

/** Draws columns right to left from (right, top). */
function drawColumnsAt(cols, { right, top, size, colW, gap, axesAt, color }) {
  let x = right + gap;
  cols.forEach((list, c) => {
    const w = colW(c);
    x -= gap + advance(size, w);
    for (const [ch, r, i] of list) glyphAt(ch, x, top + r * size, size, { ...axesAt(i, c), wdth: w, vert: true }, color);
  });
  return x;
}

let readout = [];

function drawPoster(t, g) {
  ground(g);
  const size = 384;
  const gap = 10;
  const room = W - 2 * M - gap * 3;
  let y = M - 8;
  readout = [];
  TITLE.forEach((row, r) => {
    const chars = [...row];
    const ps = chars.map((_, i) => swing(t, i + r * 1.6, 0.9));
    const widths = justify(ps, size, room);
    let x = M;
    chars.forEach((ch, i) => {
      const axes = { wdth: widths[i], wght: weightAt(ps[i]) };
      glyphAt(ch, x, y, size, axes, g.ink);
      readout.push(axes);
      label(`${Math.round(axes.wdth)} / ${Math.round(axes.wght)}`, x + 2, y + size - 4, g, { size: 12 });
      x += advance(size, widths[i]) + gap;
    });
    y += size + 6;
  });

  // The foot: what the face is, then the copy at text size.
  const top = y + 18;
  ctx.fillStyle = g.ink;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `italic 400 34px/1 ${SERIF}`;
  ['Sen 線体,', 'a line face', 'for kanji', 'and kana'].forEach((l, i) => ctx.fillText(l, M, top + 30 + i * 36));
  ctx.font = `500 13px ${MONO}`;
  const a = AXES;
  [`wdth ${a.wdth.min}–${a.wdth.max}`, `wght ${a.wght.min}–${a.wght.max}`, '', 'Text: Wikipedia, 漢字'].forEach((l, i) =>
    ctx.fillText(l, M, top + 196 + i * 18),
  );

  const small = 25;
  const rows = Math.floor((H - M - top) / small);
  drawColumnsAt(setColumns(COPY, rows), {
    right: W - M,
    top,
    size: small,
    gap: 7,
    colW: () => 100,
    axesAt: (i) => ({ wght: weightAt(swing(t, i, 0.11), 200, 520) }),
    color: g.ink,
  });
}

function drawColumns(t, g) {
  ground(g);
  const size = 74;
  const rows = Math.floor((H - 2 * M) / size) - 1; // one row spare for a hanging 、。
  const cols = setColumns(COPY, rows);
  const n = cols.length;
  const gap = 16;
  const ps = Array.from({ length: n }, (_, c) => swing(t, c, 0.55));
  const widths = justify(ps, size, W - 2 * M - gap * (n - 1));
  readout = widths.map((w) => ({ wdth: w }));
  drawColumnsAt(cols, {
    right: W - M,
    top: M + 6,
    size,
    gap,
    colW: (c) => widths[c],
    axesAt: (i) => ({ wght: weightAt(swing(t, i, 0.16)) }),
    color: g.ink,
  });
}

const AXES_CHARS = [...'線書漢字体隷草楷'];

let pointer = null; // { wdth, wght } while the pointer is over the design space

function drawAxes(t, g) {
  ground(g);
  const which = AXES_CHARS[Math.floor(t / (PERIOD * 2)) % AXES_CHARS.length];
  // A slow figure through the design space, or the pointer.
  const p1 = Math.sin((2 * Math.PI * t) / (PERIOD * 1.3));
  const p2 = Math.sin((2 * Math.PI * t) / PERIOD + 1.1);
  const axes =
    pointer ??
    (state.motion === 'breathe'
      ? { wdth: widthAt(swing(t, 0, 0)), wght: weightAt(swing(t, 0, 0)) }
      : { wdth: lerp(AXES.wdth.min, AXES.wdth.max, (p1 + 1) / 2), wght: lerp(AXES.wght.min, AXES.wght.max, (p2 + 1) / 2) });
  readout = [axes];

  // The glyph, large, with its skeleton: the lines and their points.
  const big = 700;
  const bw = advance(big, axes.wdth);
  const bx = (W - bw) / 2;
  const by = M + 40;
  glyphAt(which, bx, by, big, axes, g.ink);
  const s = big / 97;
  const k = 1 - (thickness(axes.wght) * 0.55) / 97;
  const X = (u) => bx + (54.5 + (u - 54.5) * k - 6) * (axes.wdth / 100) * s;
  const Y = (v) => by + (54.5 + (v - 54.5) * k - 6) * s;
  ctx.strokeStyle = g.mark;
  ctx.fillStyle = g.mark;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  for (const line of glyph(which)) {
    ctx.beginPath();
    line.forEach(([u, v], i) => ctx[i ? 'lineTo' : 'moveTo'](X(u), Y(v)));
    ctx.stroke();
    for (const [u, v] of line) ctx.fillRect(X(u) - 3.5, Y(v) - 3.5, 7, 7);
  }
  // The em it sits in.
  ctx.setLineDash([4, 5]);
  ctx.strokeRect(bx + 0.5, by + 0.5, bw, big);
  ctx.setLineDash([]);

  // The two axes as rulers.
  const ry = by + big + 46;
  rule('wdth', axes.wdth, AXES.wdth, ry, g);
  rule('wght', axes.wght, AXES.wght, ry + 44, g);

  // The design space: width across, weight down, the same glyph at each corner and between.
  const cols = 5;
  const rowsN = 4;
  const cell = 104;
  const top = ry + 92;
  const colX = [];
  let x = M;
  const ws = Array.from({ length: cols }, (_, c) => lerp(AXES.wdth.min, AXES.wdth.max, c / (cols - 1)));
  const free = W - 2 * M - ws.reduce((a, w) => a + advance(cell, w), 0);
  const gx = free / (cols - 1);
  ws.forEach((w) => {
    colX.push(x);
    x += advance(cell, w) + gx;
  });
  const gy = (H - M - top - rowsN * cell) / (rowsN - 1);
  for (let r = 0; r < rowsN; r++) {
    const wg = lerp(AXES.wght.min, AXES.wght.max, r / (rowsN - 1));
    ws.forEach((w, c) => glyphAt(which, colX[c], top + r * (cell + gy), cell, { wdth: w, wght: wg }, g.ink));
  }
  // Where the big glyph is in that space.
  const fx = (axes.wdth - AXES.wdth.min) / (AXES.wdth.max - AXES.wdth.min);
  const fy = (axes.wght - AXES.wght.min) / (AXES.wght.max - AXES.wght.min);
  const cx0 = colX[0] + advance(cell, ws[0]) / 2;
  const cx1 = colX[cols - 1] + advance(cell, ws[cols - 1]) / 2;
  const cy0 = top + cell / 2;
  const cy1 = top + (rowsN - 1) * (cell + gy) + cell / 2;
  const px = lerp(cx0, cx1, fx);
  const py = lerp(cy0, cy1, fy);
  ctx.strokeStyle = g.mark;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(px, top - 10);
  ctx.lineTo(px, H - M + 10);
  ctx.moveTo(M - 10, py);
  ctx.lineTo(W - M + 10, py);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px, py, 7, 0, Math.PI * 2);
  ctx.fill();
  space = { top, x0: cx0, x1: cx1, y0: cy0, y1: cy1 };
}
let space = null;

function rule(name, value, axis, y, g) {
  const x0 = M + 70;
  const x1 = W - M - 70;
  const f = (value - axis.min) / (axis.max - axis.min);
  ctx.strokeStyle = g.ink;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  for (let i = 0; i <= 8; i++) ctx.moveTo(lerp(x0, x1, i / 8), y - 4), ctx.lineTo(lerp(x0, x1, i / 8), y + 4);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = g.mark;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(lerp(x0, x1, f), y);
  ctx.stroke();
  ctx.fillStyle = g.mark;
  ctx.fillRect(lerp(x0, x1, f) - 1.5, y - 10, 3, 20);
  label(name, M, y + 5, g, { size: 14, knock: false });
  label(String(Math.round(value)), W - M, y + 5, g, { size: 14, align: 'right', knock: false });
}

// ———————————————————————————— frame

function fit() {
  const { width } = canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio, 2);
  const w = Math.max(1, Math.round(width * dpr));
  if (canvas.width !== w) (canvas.width = w), (canvas.height = Math.round((w * H) / W));
  return w / W;
}

let time = thumb ? (entry.at ?? 2) : Number(q.get('t') ?? 1.2);
let playing = !thumb && !reduced && state.motion !== 'still' && !q.has('paused');

function paint() {
  const scale = fit();
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  const g = GROUNDS[state.ground];
  panel.ground(g.bg);
  if (state.view === 'poster') drawPoster(time, g);
  else if (state.view === 'columns') drawColumns(time, g);
  else drawAxes(time, g);
  canvas.setAttribute(
    'aria-label',
    state.view === 'axes'
      ? 'One kanji drawn large in a line typeface, its width and weight changing, above a grid of the same kanji at every width and weight.'
      : 'Japanese text about kanji set in a line typeface whose width and weight change from glyph to glyph in a moving wave.',
  );
}

let lastDetails = 0;
function details(now) {
  if (now - lastDetails < 250) return;
  lastDetails = now;
  const ws = readout.map((a) => a.wdth).filter(Number.isFinite);
  const gs = readout.map((a) => a.wght).filter(Number.isFinite);
  const span = (v) => (v.length > 1 ? `${Math.round(Math.min(...v))}–${Math.round(Math.max(...v))}` : String(Math.round(v[0])));
  const rows = [];
  if (ws.length) rows.push(['Width now', span(ws)]);
  if (gs.length) rows.push(['Weight now', span(gs)]);
  panel.details(rows);
}

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (playing && !pointer) time += dt;
  if (playing || pointer || dirty) paint(), details(now);
  dirty = false;
}
let dirty = true;

addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.target.closest?.('input, textarea, select, button')) {
    e.preventDefault();
    playing = !playing;
    state.motion = playing ? (state.motion === 'still' ? 'wave' : state.motion) : 'still';
    panel.set('motion', state.motion);
    dirty = true;
  }
});
addEventListener('resize', () => (dirty = true));

// In Axes, the pointer over the design space sets the axes.
const toWorld = (e) => {
  const r = canvas.getBoundingClientRect();
  return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
};
canvas.addEventListener('pointermove', (e) => {
  if (state.view !== 'axes' || !space) return;
  const [x, y] = toWorld(e);
  if (y < space.top - 20) {
    if (pointer) (pointer = null), (dirty = true);
    return;
  }
  const fx = Math.max(0, Math.min(1, (x - space.x0) / (space.x1 - space.x0)));
  const fy = Math.max(0, Math.min(1, (y - space.y0) / (space.y1 - space.y0)));
  pointer = { wdth: lerp(AXES.wdth.min, AXES.wdth.max, fx), wght: lerp(AXES.wght.min, AXES.wght.max, fy) };
  canvas.style.cursor = 'crosshair';
});
canvas.addEventListener('pointerleave', () => {
  pointer = null;
  canvas.style.cursor = '';
  dirty = true;
});

panel.controls(
  [
    { key: 'view', label: 'View', value: state.view, options: ['poster', 'columns', 'axes'] },
    { key: 'motion', label: 'Motion', value: state.motion, options: ['wave', 'breathe', 'still'] },
    { key: 'ends', label: 'Ends', value: state.ends, options: ['flat', 'round'] },
    {
      key: 'ground',
      label: 'Ground',
      value: state.ground,
      options: Object.entries(GROUNDS).map(([value, g]) => ({ value, label: value === 'grid' ? 'Graph paper' : undefined, swatch: [g.bg, g.ink] })),
    },
  ],
  (key, value) => {
    state[key] = value;
    if (key === 'view') {
      state.ground = VIEWS[value];
      panel.set('ground', state.ground);
    }
    if (key === 'motion') playing = value !== 'still' && !reduced;
    remember();
    dirty = true;
  },
);

function remember() {
  const p = new URLSearchParams(location.search);
  for (const k of ['view', 'motion', 'ends', 'ground']) p.set(k, state[k]);
  history.replaceState(null, '', `?${p}`);
}

await fontsReady(`italic 34px ${SERIF}`, `13px ${MONO}`);
dirty = true;
requestAnimationFrame(loop);
// For inspection and for scripts/record.mjs.
window.__sen = {
  state,
  canvas,
  get time() {
    return time;
  },
  set time(v) {
    time = v;
    dirty = true;
  },
  play() {
    playing = true;
  },
};
