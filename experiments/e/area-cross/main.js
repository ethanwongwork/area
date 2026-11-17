// 0 Area cross. The letters of aerea set as spokes round one r on a square grid, in PP Kyoto Medium.
// Five across: every spoke reads e, a outward, so every line through the r spells aerea. Three across:
// are left to right, era top to bottom. Stop motion at 12 frames a second: a cross turns round the
// grid, or the spokes open and clear from the centre out; three stills hold the cross, the diagonal
// and the eight spokes. Letters never move inside their cell; they only jump from cell to cell.
import { create } from 'fontkit';
import serifUrl from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff?url';
import { shell } from '../../src/shell.js';
import { trialFiles } from '../../src/glyphs.js';
import { exportable } from '../../src/export.js';

const { thumb, panel, reduced } = shell('area-cross', { viewer: true });
const q = new URLSearchParams(location.search);

// ── Type ──
// PP Kyoto Medium when it's in fonts/trial (never bundled: free for personal use only), else
// Instrument Serif. Each of a, e and r is read once, centred on its own ink, in units of 1000 to
// the em with y down; `dy` keeps the letters on one baseline once they are centred.
async function loadLetters() {
  const kyoto = trialFiles().find((f) => /PPKyoto-Medium\./i.test(f.name));
  for (const src of [kyoto && { url: kyoto.url, name: 'PP Kyoto Medium' }, { url: serifUrl, name: 'Instrument Serif' }]) {
    if (!src) continue;
    try {
      const res = await fetch(src.url);
      if (!res.ok) continue;
      return { ...outlines(create(new Uint8Array(await res.arrayBuffer()))), name: src.name };
    } catch {}
  }
  throw new Error('No typeface for the letters');
}
function outlines(font) {
  const s = 1000 / font.unitsPerEm, g = {};
  for (const ch of 'aer') {
    const p = font.glyphForCodePoint(ch.codePointAt(0)).path, b = p.bbox;
    const cx = (b.minX + b.maxX) / 2, cy = (b.minY + b.maxY) / 2;
    const P = (x, y) => [(x - cx) * s, -(y - cy) * s];
    const path = new Path2D();
    for (const { command, args } of p.commands) {
      const q = [];
      for (let i = 0; i < args.length; i += 2) q.push(...P(args[i], args[i + 1]));
      if (command === 'moveTo') path.moveTo(...q);
      else if (command === 'lineTo') path.lineTo(...q);
      else if (command === 'quadraticCurveTo') path.quadraticCurveTo(...q);
      else if (command === 'bezierCurveTo') path.bezierCurveTo(...q);
      else if (command === 'closePath') path.closePath();
    }
    g[ch] = { path, w: (b.maxX - b.minX) * s, h: (b.maxY - b.minY) * s, base: cy * s };
  }
  for (const ch of 'aer') g[ch].dy = g.e.base - g[ch].base; // the x-height centre sits on the cell centre
  return { g };
}

// ── Helpers ──
const mod = (a, n) => ((a % n) + n) % n;
const rep = (x, n) => Array(n).fill(x);

// ── The word on the grid ──
// The 8 cells of ring 1 and the 16 of ring 2, clockwise from the top.
const RING1 = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
const RING2 = [[0, -2], [1, -2], [2, -2], [2, -1], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [-1, 2], [-2, 2], [-2, 1], [-2, 0], [-2, -1], [-2, -2], [-1, -2]];
// A pose: how many spokes; ring 1 in 45 degree steps; ring 2 in half steps; which rings show.
const pose = (n, rot, half = 0, rings = 2, from = 0) => ({ n, r1: rot + (half ? Math.sign(half) : 0), r2: 2 * rot + half, rings, from });
function cellsOf(P, chars) {
  const out = [{ x: 0, y: 0, k: 0, ch: 'r' }];
  for (let id = 0; id < 8; id++) {
    if (P.n === 4 && id % 2) continue;
    const [x1, y1] = RING1[mod(id + P.r1, 8)];
    if (chars === 5) {
      const [x2, y2] = RING2[mod(2 * id + P.r2, 16)];
      out.push({ x: x1, y: y1, k: 1, ch: 'e' }, { x: x2, y: y2, k: 2, ch: 'a' });
    } else {
      // Three letters: e on the top and right, a on the bottom and left, so the cross reads are
      // across and era down; the diagonal still pairs a with a across the r: a e / r / e a.
      const dir = mod(id + P.r1, 8);
      out.push({ x: x1, y: y1, k: 1, ch: P.diag3 ? (dir === 1 || dir === 5 ? 'e' : 'a') : id <= 3 ? 'e' : 'a' });
    }
  }
  return out.filter((c) => c.k >= P.from && c.k <= P.rings);
}

// ── Views ──
// A step of 45 degrees takes two poses: the e's jump to the next spoke, the a's follow a pose
// later through the cell between, like a piece moved by hand.
function stepping(n, steps) {
  const poses = [];
  let rot = 0;
  for (const dir of steps) { poses.push(pose(n, rot)); poses.push(pose(n, rot, dir)); rot += dir; }
  return poses;
}
const hold = (poses, frames) => poses.flatMap((p) => rep(p, frames));
const VIEWS = {
  // A cross turns steadily round the grid, each pose held two frames.
  turn: { label: 'Turn', poses: () => hold(stepping(4, rep(1, 8)), 2) },
  // The spokes open from the centre out, hold, then clear from the centre out (eight with five letters, a cross with three),
  // and the r rests alone before they open again, so the frame never empties.
  radiate: {
    label: 'Radiate',
    poses: (chars) => {
      const n = chars === 5 ? 8 : 4;
      return [
        ...hold([pose(n, 0, 0, 0), pose(n, 0, 0, 1), pose(n, 0, 0, 2)], 3),
        ...rep(pose(n, 0), 12),
        ...hold([pose(n, 0, 0, 2, 1), pose(n, 0, 0, 2, 2), pose(n, 0, 0, 0)], 3),
      ];
    },
  },
  cross: { label: 'Cross', poses: () => [pose(4, 0)] },
  diagonal: { label: 'Diagonal', poses: () => [{ ...pose(4, 1), diag3: true }] },
  eight: { label: 'Eight spokes', poses: () => [pose(8, 0)], five: true }, // five letters only
};

// ── The piece ──
const SIDE = 1080, FPS = 12;
const GAP = 70; // Kyoto's own spacing in aerea: 65-78 units of ink between letters
// Every open choice reads from the URL, so a view can be linked (and exported) by its params.
const DEFAULTS = { view: 'turn', chars: '5', ground: 'white', padding: 'off', grid: 'off' };
const OPTIONS = { view: Object.keys(VIEWS), chars: ['5', '3'], ground: ['white', 'black'], padding: ['off', 'on'], grid: ['off', 'on'] };
const state = Object.fromEntries(Object.entries(DEFAULTS).map(([k, d]) => [k, OPTIONS[k].includes(q.get(k)) ? q.get(k) : d]));
if (VIEWS[state.view].five && state.chars !== '5') state.view = 'cross';
function remember() {
  const url = new URL(location.href);
  url.search = '';
  for (const [k, d] of Object.entries(DEFAULTS)) if (state[k] !== d) url.searchParams.set(k, state[k]);
  history.replaceState(null, '', url);
}
let G = null, frame = 0;

const chars = () => Number(state.chars);
const view = () => VIEWS[state.view];
const poses = () => view().poses(chars());
// Square cells: Kyoto's average letter width and height plus the gap, the same across and down.
function pitch() {
  const { a, e, r } = G.g;
  return (a.w + e.w + r.w + a.h + e.h + r.h) / 6 + GAP;
}
// The r sits at the exact centre of the frame and every view at one letter count shares one scale,
// set by the ink furthest from the r in any pose of any view, so switching views moves nothing.
// Padding off: half a gap of white beyond that ink. On: half a grid cell.
function scale() {
  const P = pitch();
  let ext = 0;
  for (const V of Object.values(VIEWS)) {
    if (V.five && chars() !== 5) continue;
    for (const c of V.poses(chars()).flatMap((p) => cellsOf(p, chars()))) {
      const g = G.g[c.ch];
      ext = Math.max(ext, Math.abs(c.x * P) + g.w / 2, Math.abs(c.y * P + g.dy) + g.h / 2);
    }
  }
  return SIDE / (2 * ext + (state.padding === 'on' ? P : GAP));
}
function render(ctx, W, f) {
  const list = poses(), P = pitch(), sc = scale(), k = W / SIDE, half = (chars() - 1) / 2;
  const dark = state.ground === 'black';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = dark ? '#000000' : '#ffffff';
  ctx.fillRect(0, 0, W, W);
  ctx.setTransform(k * sc, 0, 0, k * sc, W / 2, W / 2);
  if (state.grid === 'on') {
    ctx.strokeStyle = dark ? '#2a2a2a' : '#e2e2e2';
    ctx.lineWidth = 1 / (k * sc);
    ctx.beginPath();
    const e = (half + 0.5) * P;
    for (let i = -half - 0.5; i <= half + 0.5; i++) { ctx.moveTo(i * P, -e); ctx.lineTo(i * P, e); ctx.moveTo(-e, i * P); ctx.lineTo(e, i * P); }
    ctx.stroke();
  }
  ctx.fillStyle = dark ? '#ffffff' : '#000000';
  for (const c of cellsOf(list[mod(f, list.length)], chars())) {
    const g = G.g[c.ch];
    ctx.save();
    ctx.translate(c.x * P, c.y * P + g.dy);
    ctx.fill(g.path);
    ctx.restore();
  }
}

// ── Page ──
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.setAttribute('role', 'img');
canvas.setAttribute('aria-label', 'The letters of aerea set as spokes round one r, turning round the grid or radiating from the centre');
stage.append(canvas);
const ctx = canvas.getContext('2d');
function fit() {
  const W = canvas.clientWidth;
  if (!W) return false;
  const px = Math.round(W * Math.min(devicePixelRatio || 1, 2));
  if (canvas.width !== px) canvas.width = canvas.height = px;
  return true;
}
const draw = () => G && fit() && render(ctx, canvas.width, frame);

// Frames are paced by counting screen refreshes, not elapsed time, so every frame is held for exactly
// the same number of refreshes (5 at 60 Hz, 10 at 120 Hz). The refresh period is the median of recent
// frame times, snapped to a standard display rate so the count never wobbles.
let playing = !reduced && !thumb, last = performance.now(), period = 1 / 60, ticks = 0;
const recent = [];
function loop(now) {
  requestAnimationFrame(loop);
  const dt = (now - last) / 1000;
  last = now;
  if (dt > 0.004 && dt < 0.05) {
    recent.push(dt);
    if (recent.length > 31) recent.shift();
    const med = [...recent].sort((a, b) => a - b)[recent.length >> 1];
    period = 1 / [30, 50, 60, 75, 90, 100, 120, 144, 165, 240].reduce((a, r) => (Math.abs(1 / r - med) < Math.abs(1 / a - med) ? r : a));
  }
  if (playing) {
    ticks += Math.max(1, Math.min(6, Math.round(dt / period)));
    frame = Math.floor(ticks / Math.max(1, Math.round(1 / FPS / period)));
  }
  draw();
}

G = await loadLetters();
panel.details([['Typeface', G.name]]);
if (state.ground === 'black') panel.ground('#000000');
draw();
// For scripts/export-set.mjs: the piece at t seconds, frame by frame at 12 a second. A moving
// view's loop is its whole list of poses; render(loop) is pose 0 again.
exportable({
  get loop() {
    const n = poses().length;
    return n > 1 ? n / FPS : 0;
  },
  fps: FPS,
  render(t, size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    render(c.getContext('2d'), size, Math.floor(t * FPS + 1e-6));
    return c;
  },
});
if (thumb) document.documentElement.dataset.rendered = String(Date.now());
else requestAnimationFrame(loop);
new ResizeObserver(draw).observe(stage);

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  if (e.key === ' ') { e.preventDefault(); playing = !playing; controls.set?.('motion', playing ? 'play' : 'pause'); }
});

// ── Share ──
function still(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  render(c.getContext('2d'), size, frame);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}
const fileName = (size) => `area-cross-${state.view}-${state.chars}-letters-${size}.png`;
function save(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
panel.share({
  caption: () => [
    'aerea, set as spokes round one r.',
    '',
    'Five letters on a square grid, read through one r at the centre: every spoke reads e then a outward, so every line through the r spells aerea. In stop motion a cross turns round the grid, or the spokes open and clear from the centre out. The set adds the diagonal and the eight spokes, three letters (are across, era down), the grid and a black ground.',
    '',
    G.name.startsWith('PP') ? 'Type: PP Kyoto by @pangrampangram' : 'Type: Instrument Serif by Instrument',
    'Made with: fontkit, Canvas 2D',
  ].join('\n'),
  note: '2160 px png, the frame on screen',
  exportImage: async () => ({ blob: await still(2160), name: fileName(2160) }),
  extra: [
    { label: 'Export profile picture, 1080 px', run: async () => save(await still(1080), fileName(1080)) },
    { label: 'Export 4K, 3840 px', run: async () => save(await still(3840), fileName(3840)) },
  ],
});

const controls = panel.controls(
  [
    { key: 'view', label: 'View', value: state.view, options: Object.entries(VIEWS).map(([value, V]) => ({ value, label: V.label })) },
    { key: 'chars', label: 'Letters', value: state.chars, options: ['5', '3'] },
    { key: 'padding', label: 'Padding', value: state.padding, options: ['off', 'on'] },
    { key: 'ground', label: 'Ground', value: state.ground, options: ['white', 'black'] },
    { key: 'grid', label: 'Grid', value: state.grid, options: ['off', 'on'] },
    { key: 'motion', label: 'Motion', value: playing ? 'play' : 'pause', options: ['play', 'pause'] },
  ],
  (key, value) => {
    if (key === 'motion') { playing = value === 'play'; return; }
    state[key] = value;
    if (key === 'view') { frame = 0; ticks = 0; }
    // Eight spokes only with five letters: with three, the eight-spoke still falls back to the cross.
    if (VIEWS[state.view].five && chars() !== 5) { state.view = 'cross'; controls.set?.('view', 'cross'); }
    if (key === 'ground') panel.ground(value === 'black' ? '#000000' : '#ffffff');
    remember();
    draw();
  },
);
