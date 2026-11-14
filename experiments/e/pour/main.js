// 7 Pour. The year's dates poured into one shape: every month opens with its three letters,
// then its days, one to a cell, edge to edge. Three patterns place the cells (weekdays, two
// lines a month, a free shape), and the blocks slide: each beat a few runs of rows or columns
// move one to four cells at once and wrap around the sheet; after nine beats the moves play
// back and the calendar puts itself together again.
import '@fontsource-variable/jetbrains-mono';
import { shell, fontsReady } from '../../src/shell.js';

const { thumb, panel, reduced } = shell('pour', { viewer: true });

const S = 1080; // the sheet, in its own units; the canvas scales it to the stage
const INK = '#000000', PAPER = '#fbfaf8';
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
// Chroma past the gamut edge: the most saturated color the screen has at each lightness and hue.
const ok = (l, h) => `oklch(${l} 0.32 ${h})`;
const MONTH_COLORS = [ok(.79, 258), ok(.95, 102), ok(.82, 352), ok(.88, 145), ok(.83, 48), ok(.78, 300), ok(.89, 220), ok(.77, 27), ok(.95, 125), ok(.80, 328), ok(.89, 180), ok(.90, 75)];
const HUES = { blue: ok(.79, 258), yellow: ok(.95, 102), pink: ok(.82, 352), green: ok(.88, 145), orange: ok(.83, 48), violet: ok(.78, 300), cyan: ok(.89, 220), red: ok(.77, 27) };
const PAIR = { blue: ok(.95, 102), yellow: ok(.79, 258), pink: ok(.88, 145), green: ok(.82, 352), orange: ok(.89, 220), violet: ok(.95, 125), cyan: ok(.83, 48), red: ok(.89, 220) };
// Pangram Pangram faces when installed on this machine (never bundled: trial licence), else JetBrains Mono.
const FALLBACK = '"JetBrains Mono Variable", Menlo, monospace';
const FONTS = {
  mono: { fam: `"Pour Mono", ${FALLBACK}`, w: 400, k: .58, name: 'PP Right Serif Mono' },
  fine: { fam: `"Pour Mono Fine", ${FALLBACK}`, w: 400, k: .58, name: 'PP Right Serif Mono Fine' },
  kyoto: { fam: `"Pour Kyoto", Georgia, serif`, w: 500, k: .62, name: 'PP Kyoto' },
};
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// The year as tokens: each month's three letters, then its days.
function tokens(year) {
  const out = [];
  for (let m = 0; m < 12; m++) {
    for (const ch of MONTHS[m]) out.push({ m, ch });
    const n = new Date(year, m + 1, 0).getDate();
    for (let d = 1; d <= n; d++) out.push({ m, d });
  }
  return out;
}

// Pattern 1. Weekdays: three bands of seven columns (Sunday to Saturday), four months a band.
// Every day sits under its weekday and every month starts a new row, so the holes are the
// days a month's first and last weeks don't reach. The letters take the three cells just
// before the 1st; when the 1st falls on Sunday to Tuesday they take the end of a row of their own.
function weekdays(year) {
  const placed = [], heights = [];
  for (let b = 0; b < 3; b++) {
    let row = 0;
    for (let m = b * 4; m < b * 4 + 4; m++) {
      const wd = new Date(year, m, 1).getDay(), n = new Date(year, m + 1, 0).getDate();
      if (wd >= 3) MONTHS[m].split('').forEach((ch, k) => placed.push({ i: b * 7 + wd - 3 + k, j: row, t: { m, ch } }));
      else { MONTHS[m].split('').forEach((ch, k) => placed.push({ i: b * 7 + 4 + k, j: row, t: { m, ch } })); row++; }
      for (let d = 1; d <= n; d++) { const p = wd + d - 1; placed.push({ i: b * 7 + p % 7, j: row + Math.floor(p / 7), t: { m, d } }); }
      row += Math.ceil((wd + n) / 7);
    }
    heights.push(row);
  }
  return { cols: 21, rows: Math.max(...heights), placed, kind: 'weekdays' };
}

// Pattern 2. Two lines a month: 24 columns, each month its letters and days in reading order,
// always two rows, so the second row's length is the month's length (Feb shortest).
function twoLines(year) {
  const placed = []; let row = 0;
  for (let m = 0; m < 12; m++) {
    const n = new Date(year, m + 1, 0).getDate(), list = [...MONTHS[m]].map(ch => ({ m, ch })).concat(Array.from({ length: n }, (_, k) => ({ m, d: k + 1 })));
    list.forEach((t, k) => placed.push({ i: k % 24, j: row + Math.floor(k / 24), t }));
    row += 2;
  }
  return { cols: 24, rows: 24, placed, kind: 'two lines' };
}

// Pattern 3. Free: a random field over a 24 × 24 grid; the strongest cells hold the year in reading order.
const KINDS = ['bites', 'noise', 'blocks', 'stairs', 'islands'];
function field(kind, r, C, R) {
  const n = () => r() - .5;
  if (kind === 'bites') {
    const bites = Array.from({ length: 6 + Math.floor(r() * 8) }, () => { const edge = r() < .7, side = Math.floor(r() * 4); return { x: edge ? [r() * C, C, r() * C, 0][side] : r() * C, y: edge ? [0, r() * R, R, r() * R][side] : r() * R, rx: 1.5 + r() * 5, ry: 1.5 + r() * 5, sq: r() < .6 }; });
    return (x, y) => { let f = 1; for (const b of bites) { const dx = Math.abs(x - b.x) / b.rx, dy = Math.abs(y - b.y) / b.ry, d = b.sq ? Math.max(dx, dy) : Math.hypot(dx, dy); if (d < 1) f -= 1 - d * .3; } return f + n() * .15; };
  }
  if (kind === 'noise') {
    const gx = 5, gy = 5, g = Array.from({ length: (gx + 1) * (gy + 1) }, () => r()), at = (i, j) => g[j * (gx + 1) + i], s = t => t * t * (3 - 2 * t);
    return (x, y) => { const u = x / C * gx, v = y / R * gy, i = Math.min(gx - 1, Math.floor(u)), j = Math.min(gy - 1, Math.floor(v)), fu = s(u - i), fv = s(v - j); const a = at(i, j) + (at(i + 1, j) - at(i, j)) * fu, b = at(i, j + 1) + (at(i + 1, j + 1) - at(i, j + 1)) * fu; return a + (b - a) * fv + n() * .25; };
  }
  if (kind === 'blocks') {
    const rects = Array.from({ length: 7 + Math.floor(r() * 6) }, () => { const w = 4 + Math.floor(r() * 10), h = 3 + Math.floor(r() * 8); return { x: Math.floor(r() * (C - w + 4)) - 2, y: Math.floor(r() * (R - h + 4)) - 2, w, h }; });
    return (x, y) => { let f = n() * .3; for (const q of rects) if (x >= q.x && x < q.x + q.w && y >= q.y && y < q.y + q.h) f += 1; return f; };
  }
  if (kind === 'stairs') {
    const ax = n() * 2, ay = n() * 2, step = 2 + Math.floor(r() * 3), holes = Array.from({ length: 4 + Math.floor(r() * 5) }, () => ({ x: Math.floor(r() * C), y: Math.floor(r() * R), w: 1 + Math.floor(r() * 3), h: 1 + Math.floor(r() * 2) }));
    return (x, y) => { let f = -Math.abs(Math.floor(x / step) * step * ax / C + Math.floor(y / step) * step * ay / R) + n() * .2; for (const h of holes) if (x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h) f -= 5; return f; };
  }
  const balls = Array.from({ length: 10 + Math.floor(r() * 10) }, () => ({ x: r() * C, y: r() * R, s: 1.5 + r() * 3.5 }));
  return (x, y) => { let f = 0; for (const b of balls) f += b.s * b.s / ((x - b.x) ** 2 + (y - b.y) ** 2 + 1); return f + n() * .4; };
}
function free(year, shape, seed) {
  const C = 24, R = 24, r = rng(seed), kind = shape === 'any' ? KINDS[Math.floor(r() * KINDS.length)] : shape, f = field(kind, r, C, R), toks = tokens(year), all = [];
  for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) all.push({ i, j, f: f(i + .5, j + .5) });
  const t = [...all].sort((a, b) => b.f - a.f)[toks.length - 1].f;
  let inside = all.filter(c => c.f > t); inside = inside.concat(all.filter(c => c.f === t).slice(0, toks.length - inside.length));
  inside.sort((a, b) => a.j - b.j || a.i - b.i);
  return { cols: C, rows: R, placed: inside.map((c, k) => ({ i: c.i, j: c.j, t: toks[k] })), kind };
}
const layout = o => o.pattern === 'weekdays' ? weekdays(o.year) : o.pattern === 'lines' ? twoLines(o.year) : free(o.year, o.shape, o.seed);

function fillFor(o, m) {
  if (o.tone === 'months') return MONTH_COLORS[m];
  if (o.tone === 'two') return m % 2 ? PAIR[o.hue] : HUES[o.hue];
  return HUES[o.hue];
}

// A pose gives each cell's position in cells, fractional while it slides. The grid wraps, so a
// cell leaving one edge comes back in at the other. Cells stretch to fill the square sheet.
const mod = (a, n) => ((a % n) + n) % n;
function paint(ctx, o, L, pose) {
  const C = L.cols, R = L.rows, cw = S / C, ch = S / R, F = FONTS[o.font];
  const spots = L.placed.map((p, n) => {
    const [x, y] = pose ? pose(n) : [p.i, p.j], X = mod(x, C), Y = mod(y, R), out = [];
    for (const ox of X > C - 1 ? [X, X - C] : [X]) for (const oy of Y > R - 1 ? [Y, Y - R] : [Y]) out.push([ox, oy]);
    return out;
  });
  ctx.fillStyle = PAPER; ctx.fillRect(0, 0, S, S);
  L.placed.forEach((p, n) => { ctx.fillStyle = fillFor(o, p.t.m); for (const [x, y] of spots[n]) ctx.fillRect(x * cw - .5, y * ch - .5, cw + 1, ch + 1); });
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `${F.w} ${Math.round(Math.min(cw, ch) * F.k)}px ${F.fam}`;
  L.placed.forEach((p, n) => { for (const [x, y] of spots[n]) ctx.fillText(p.t.ch || p.t.d, x * cw + cw / 2, y * ch + ch / 2 + 1); });
}

// ── Motion ──
// Each beat, two to four runs of rows (or of columns) slide one to four cells at once and wrap.
// A row move keeps every cell in its row, so after nine beats the same moves played back in
// reverse undo it: the calendar puts itself together, holds, and starts over.
const DUR = 360, GAP = 240, BEATS = 9, HOLD = 1800;
const snap = (t) => (t < .5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2); // quint in-out: still, quick, still
function newMove(L, r) {
  const axis = r() < .5 ? 'row' : 'col', N = axis === 'row' ? L.rows : L.cols, shifts = new Map();
  const runs = 2 + Math.floor(r() * 3);
  for (let q = 0; q < runs; q++) {
    const len = 1 + Math.floor(r() * 4), start = Math.floor(r() * N), k = (1 + Math.floor(r() * 4)) * (r() < .5 ? -1 : 1);
    for (let s = 0; s < len; s++) { const line = (start + s) % N; if (!shifts.has(line)) shifts.set(line, k); }
  }
  return { axis, shifts };
}
const shiftOf = (mv, q) => mv.shifts.get(mv.axis === 'row' ? q.j : q.i) || 0;

// ── The piece ──
const state = { pattern: 'weekdays', motion: reduced ? 'still' : 'slide', font: 'mono', tone: 'months', hue: 'blue', shape: 'any', seed: 2604, year: new Date().getFullYear() };
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.setAttribute('role', 'img');
stage.append(canvas);
const ctx = canvas.getContext('2d');

let L = null, M = null;
function fit() {
  const W = canvas.clientWidth;
  if (!W) return false;
  const dpr = Math.min(devicePixelRatio || 1, 2), px = Math.round(W * dpr);
  if (canvas.width !== px) canvas.width = canvas.height = px;
  ctx.setTransform(px / S, 0, 0, px / S, 0, 0);
  return true;
}
function pose() {
  if (!M) return null;
  const mv = M.cur, e = mv ? snap(Math.min(1, (performance.now() - M.t0) / DUR)) : 0;
  return (n) => { const q = M.pos[n], k = mv ? shiftOf(mv, q) * e : 0; return mv?.axis === 'row' ? [q.i + k, q.j] : [q.i, q.j + k]; };
}
const draw = () => fit() && paint(ctx, state, L, pose());

function rebuild() {
  L = layout(state);
  M = state.motion === 'slide' && !thumb
    ? { pos: L.placed.map((p) => ({ i: p.i, j: p.j })), hist: [], queue: [], phase: 'out', cur: null, t0: 0, next: performance.now() + 700, r: rng(Math.floor(Math.random() * 1e9)) }
    : null;
  canvas.setAttribute('aria-label', `${state.year} as one shape of month letters and dated cells`);
  panel.details([['Year', String(state.year)], ['Grid', `${L.cols} × ${L.rows} cells, ${L.placed.length} filled`], ['Pattern', L.kind]]);
  draw();
}

function step(now) {
  if (M.cur) {
    if (now - M.t0 >= DUR) {
      const mv = M.cur;
      for (const q of M.pos) { const k = shiftOf(mv, q); if (mv.axis === 'row') q.i = mod(q.i + k, L.cols); else q.j = mod(q.j + k, L.rows); }
      M.cur = null; M.next = now + (M.phase === 'hold' ? HOLD : GAP);
    }
  } else if (now >= M.next) {
    if (M.phase === 'hold') { M.phase = 'out'; M.hist = []; }
    if (M.phase === 'out' && M.hist.length === BEATS) {
      M.phase = 'back';
      M.queue = M.hist.slice().reverse().map((m) => ({ axis: m.axis, shifts: new Map([...m.shifts].map(([l, k]) => [l, -k])) }));
    }
    if (M.phase === 'out') { M.cur = newMove(L, M.r); M.hist.push(M.cur); }
    else { M.cur = M.queue.shift(); if (!M.queue.length) M.phase = 'hold'; }
    M.t0 = now;
  }
}
function loop(now) {
  requestAnimationFrame(loop);
  if (M) { step(now); draw(); }
}

await fontsReady(...Object.values(FONTS).map((f) => `${f.w} 16px ${f.fam}`)).catch(() => {});
rebuild();
if (thumb) document.documentElement.dataset.rendered = String(Date.now());
else requestAnimationFrame(loop);
new ResizeObserver(draw).observe(stage);

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); state.year += e.key === 'ArrowRight' ? 1 : -1; rebuild(); }
  if (e.key === ' ') { e.preventDefault(); state.motion = state.motion === 'slide' ? 'still' : 'slide'; controls.set?.('motion', state.motion); rebuild(); }
});

// ── Share ──
const EXPORT = 2160;
function still() {
  const c = document.createElement('canvas');
  c.width = c.height = EXPORT;
  const x = c.getContext('2d');
  x.setTransform(EXPORT / S, 0, 0, EXPORT / S, 0, 0);
  paint(x, state, L);
  return new Promise((r) => c.toBlob(r, 'image/png'));
}
panel.share({
  caption: () => [
    `Pour: ${state.year} poured into one shape.`,
    '',
    'Every month opens with its three letters, then its days, one to a cell, edge to edge. The days sit under their weekdays, so the holes are where each month’s first and last weeks don’t reach, and every year has its own shape.',
    '',
    `Type: ${FONTS[state.font].name} by @pangrampangram`,
    'Made with: Canvas 2D',
  ].join('\n'),
  note: `${EXPORT} px png, the calendar at rest`,
  exportImage: async () => ({ blob: await still(), name: `pour-${state.year}-${state.pattern}.png` }),
});

const controls = panel.controls(
  [
    { key: 'pattern', label: 'Pattern', value: state.pattern, options: ['weekdays', { value: 'lines', label: 'Two lines a month' }, { value: 'free', label: 'Free shape' }] },
    { key: 'motion', label: 'Motion', value: state.motion, options: ['slide', 'still'] },
    { key: 'font', label: 'Typeface', value: state.font, options: [{ value: 'mono', label: 'Right Serif Mono' }, { value: 'fine', label: 'Mono Fine' }, { value: 'kyoto', label: 'Kyoto' }] },
    { key: 'tone', label: 'Coloring', value: state.tone, options: [{ value: 'months', label: 'Every month' }, { value: 'two', label: 'Two colors' }, { value: 'one', label: 'One color' }] },
    { key: 'hue', label: 'Color', value: state.hue, options: Object.entries(HUES).map(([value, c]) => ({ value, swatch: [c] })) },
    { label: 'Next year (→)', action: () => { state.year++; rebuild(); } },
    { label: 'Another free shape', action: () => { state.pattern = 'free'; controls.set?.('pattern', 'free'); state.seed = Math.floor(Math.random() * 1e5); rebuild(); } },
  ],
  (key, value) => { state[key] = value; rebuild(); },
);
