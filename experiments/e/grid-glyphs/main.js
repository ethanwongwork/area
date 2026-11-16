// 2 Grid Glyphs. Letters, kana and shapes built from a square grid: each form is
// rasterised to cells, cut into patches along its strokes, and every cell drawn from a
// small vocabulary. The views are one treatment each, made to post together as a set.
import '@fontsource-variable/inter-tight';
import { shell, fontsReady } from '../../src/shell.js';
import { BUILD, PALETTES as P, build, prepare } from './scenes.js';
import { INKS as EMBLEM_INKS } from './emblems.js';

const { gui, thumb, panel, reduced } = shell('grid-glyphs', { viewer: true });
const q = new URLSearchParams(location.search);

// Studies: one reference, one treatment each.
const STUDIES = [
  { id: 'stitch', label: 'Stitch', kind: 'stitch', text: ['あみ', 'もの'], latin: ['AM', 'ON'], cols: 64, area: 34, seed: 11, note: 'あみもの, knitting: four kana in patches of stitches, each patch its own ink and stitch, printed over a second ink.' },
  { id: 'stitch-one', label: 'Stitch, one glyph', kind: 'stitch', text: ['&'], cols: 34, area: 20, seed: 5, mask: { margin: 3 }, note: 'One ampersand at a size where every stitch reads.' },
  { id: 'joinery', label: 'Joinery', kind: 'joinery', text: ['GR', 'ID'], cols: 40, seed: 3, note: 'Each letter cut from the grid as one flat piece: rounded ends, filleted inner corners, the ruling over everything.' },
  { id: 'glazed', label: 'Glazed', kind: 'glazed', text: ['EMB', 'ROI', 'DER'], cols: 45, seed: 8, mask: { margin: 0, gap: 0, inset: 2.4, threshold: 0.45 }, note: 'Nine tiles in a checker, a blobby letter in each, the two inks a little out of register.' },
  { id: 'numbered', label: 'Numbered', kind: 'tiles', text: ['ゆ'], latin: ['S'], weight: 'light', cols: 40, seed: 2, mask: { margin: 3, threshold: 0.32 }, note: 'ゆ in its light weight, each cell numbered in the order the stroke is walked.' },
  { id: 'scale', label: 'Scale', kind: 'scale', text: ['R'], cols: 34, area: 16, seed: 4, mask: { margin: 3 }, note: 'Squares grow toward the heart of the stroke and the foot of the letter.' },
  { id: 'bloom', label: 'Bloom', kind: 'mix', shape: 'flower', cols: 26, seed: 9, note: 'A flower of circles and squares, each cell a coin toss.' },
  { id: 'carpet', label: 'Carpet', kind: 'carpet', cols: 33, seed: 6, note: 'Four panels laid in mosaic tiles: shapes made only of cells.' },
];

// Combinations: two or three references on one grid, in other typefaces and inks.
const COMBOS = [
  {
    id: 'felt', label: 'Felt', cols: 44, text: ['KN', 'IT'], font: 'haffer', axes: { wght: 900 }, seed: 21, ground: '#f2efe8',
    note: 'Joinery × Stitch. KNIT in Haffer Black, each letter cut from felt in its own colour and embroidered over in a contrasting thread.',
    layers: [
      { kind: 'joinery', inks: [P.pool[0], P.pool[4], P.pool[3], P.pool[2]], rule: false },
      { kind: 'stitch', labelInks: { 1: ['#fff4dc', '#ffe800'], 2: ['#2340ff', '#fff4dc'], 3: ['#2340ff', '#ff5fa2'], 4: ['#ffffff', '#2340ff'] }, shadows: false, blend: 'source-over', area: 26, weight: 0.12 },
    ],
  },
  {
    id: 'overprint', label: 'Overprint', cols: 56, seed: 14, ground: '#f6f2ea',
    note: 'Joinery × Stitch, overprinted. A routed A in Bricolage under a stitched あ in PP Kyoto, both in riso inks; where they cross, the inks mix.',
    layers: [
      { kind: 'joinery', text: ['A'], font: 'bricolage', axes: { wght: 800 }, inks: ['#0078bf'], rule: false, blend: 'multiply', mask: { margin: 10, offset: [-5, -4] } },
      { kind: 'stitch', text: ['あ'], latin: ['a'], font: 'kyoto', inks: ['#ff48b0', '#ff6c2f', '#ffe800', '#ff48b0'], shadows: false, blend: 'multiply', area: 30, weight: 0.14, mask: { margin: 10, offset: [6, 5] }, delay: 0.6 },
    ],
  },
  {
    id: 'contour', label: 'Contour', kind: 'contour', cell: 'tile', text: ['&'], font: 'reckless', axes: { wght: 900, wdth: 120 }, cols: 52, halo: 4, seed: 3, mask: { margin: 7 },
    inks: ['#5b3cff', '#ff3d7f', '#ff8c1a', '#ffd23f', '#00a99d'], haloInks: ['#ffd3e2', '#ffe9d1'], ground: '#fbf7f0',
    note: 'Carpet × letter. The carpet’s frames laid as rings that follow the ampersand, in through its strokes and out into a halo. Reckless Black.',
  },
  {
    id: 'moulded', label: 'Moulded', kind: 'contour', cell: 'blob', text: ['LO', 'OP'], font: 'coxx', axes: { wght: 800 }, cols: 48, halo: 2, seed: 4,
    inks: P.candy, haloInks: ['#2c2a55', '#252347'], ground: '#1d1b3a', flow: true,
    note: 'Glazed × Contour. LOOP in Coxx, every stroke moulded into nested bands of colour that drift slowly outward, on deep ink.',
  },
  {
    id: 'thread', label: 'Thread', kind: 'thread', text: ['kn', 'ot'], font: 'reckless', axes: { wght: 500 }, cols: 52, seed: 5, mask: { threshold: 0.4 },
    inks: P.sunset, ground: '#0f0e1a', bead: '#0f0e1a', weight: 0.5,
    note: 'Numbered × Stitch. The numbered walk drawn as a thread through knot in Reckless, its colour running along the walk, with a needle travelling it.',
  },
  {
    id: 'coins', label: 'Coins', kind: 'glazed', cell: 'coin', text: ['TI', 'LE'], font: 'areal', axes: { wght: 700, MONO: 100 }, cols: 40, seed: 6, specks: false, ground: '#111111',
    mask: { margin: 0, gap: 0, inset: 3, threshold: 0.45 },
    tiles: [
      { ground: '#ff8fb8', ink: '#2340ff', under: '#ffd23f' },
      { ground: '#d4ff4a', ink: '#ff3d7f', under: '#5b3cff' },
    ],
    note: 'Glazed × Bloom. Four tiles, the letters set in circles and squares and misregistered over a second ink. ABC Areal Mono.',
  },
  {
    id: 'deep', label: 'Deep stitch', kind: 'stitch', text: ['ふ'], latin: ['F'], font: 'kyoto', cols: 40, area: 22, seed: 8, mask: { margin: 3 },
    sizeBy: 'depth', inks: P.night, shadows: false, blend: 'source-over', ground: '#0d0d14', weight: 0.13,
    note: 'Scale × Stitch. ふ on black, stitches growing toward the heart of each stroke.',
  },
  {
    id: 'halftone', label: 'Halftone', kind: 'halftone', text: ['Q'], font: 'flex', axes: { wght: 1000, wdth: 151 }, cols: 50, seed: 2, mask: { margin: 5 },
    inks: P.sunset, field: true, ground: '#fff8ef',
    note: 'Scale × Bloom. A wide Q in Roboto Flex as a screen of dots, a gradient running across it.',
  },
  {
    id: 'mosaic', label: 'Mosaic word', kind: 'contour', cell: 'tile', text: ['PAT', 'TER', 'NED'], font: 'post', axes: { wght: 900 }, cols: 54, halo: 1, seed: 7, ground: '#ffffff',
    mask: { margin: 0, gap: 0, inset: 2, threshold: 0.45 },
    tiles: [
      { ground: '#fff1e2', inks: ['#ff3d7f', '#ff8c1a', '#ffd23f'], halo: ['#ffd3e2'] },
      { ground: '#e8ecff', inks: ['#2340ff', '#00a99d', '#8ec9ff'], halo: ['#c8d2ff'] },
    ],
    note: 'Carpet × Glazed × Contour. PATTERNED in Post Black, a tile per letter, each laid in mosaic rings.',
  },
  {
    id: 'garden', label: 'Garden', kind: 'stitch', shape: 'flower', cols: 40, area: 16, seed: 12, ground: '#f6f3ec',
    inks: P.garden, labelInks: { 1: P.garden, 2: P.leaf }, shadows: ['#ffb3c9'], second: '#ffd23f',
    note: 'Bloom × Stitch. The flower in stitches: pinks, reds and marigold for the petals, greens for the stem.',
  },
  {
    id: 'counted', label: 'Counted', kind: 'tiles', text: ['24'], font: 'haffer', axes: { wght: 300 }, cols: 34, seed: 9, mask: { margin: 2, gap: 1, threshold: 0.4 },
    inks: ['#ff3d7f', '#ff8c1a', '#ffd23f', '#00a99d', '#5b3cff', '#8ec9ff'], blank: 0.35, ground: '#fffaf2', line: '#1d1b3a',
    note: 'Numbered × Haffer. 24 in Haffer Light, every cell counted along the stroke, in tropical inks.',
  },
];
// Emblems: objects built from cells with their names knocked out, ornaments, on black.
// After a cross-stitch book cover (a fish and a vase named in their own negative space)
// and a dot-matrix film whose dots stretch into ovals as a wave runs through them.
const E = EMBLEM_INKS;
const textile = [];
for (let gy = 0; gy < 5; gy++) {
  for (let gx = 0; gx < 5; gx++) {
    textile.push({ ornament: 'rosette', x: 6 + gx * 12, y: 6 + gy * 12, r: 3, inks: [E.gold, E.magenta, E.lime, E.blue, E.violet][(gx + gy) % 5] });
    if (gx < 4 && gy < 4) textile.push({ ornament: 'diamonds', x: 12 + gx * 12, y: 10 + gy * 12, r: 2, n: 1, inks: (gx + gy) % 2 ? E.orange : E.cyan });
  }
}
const EMBLEMS = [
  {
    id: 'pair', label: 'Pair', kind: 'emblem', cols: 72, seed: 1, cell: 'perforated',
    note: 'さかな (fish) and はな (flower), each named in its own negative space, between stitched diamonds and rosettes.',
    items: [
      { shape: 'fish', x: 7, y: 9, w: 28, h: 54, word: 'さかな', latin: 'FISH', inks: E.gold, wordAt: 0.42 },
      { shape: 'vase', x: 37, y: 9, w: 28, h: 54, word: 'はな', latin: 'VASE', inks: E.lime, wordAt: 0.55 },
      ...[12, 44].flatMap((y) => [3, 68].map((x) => ({ ornament: 'diamonds', x, y, r: 2, n: 3, inks: E.orange }))),
      ...[[6, 6], [65, 6], [6, 65], [65, 65]].map(([x, y]) => ({ ornament: 'rosette', x, y, r: 2, inks: E.gold })),
    ],
  },
  {
    id: 'fish', label: 'Fish, in a wave', kind: 'emblem', cols: 56, seed: 2, cell: 'oval', field: '#3a0626',
    note: 'A fish of oval dots that stretch and merge as a wave runs through them, FISH knocked out along its body in Haffer Black.',
    items: [{ shape: 'fish', horizontal: true, x: 3, y: 12, w: 50, h: 32, word: 'FISH', font: 'haffer', axes: { wght: 1000 }, inks: E.magenta, letter: '#fff200', wordX: 0.48, eye: [0.09, 0.4], aspect: 0.75 }],
  },
  {
    id: 'lantern', label: 'Lantern', kind: 'emblem', cols: 56, seed: 3, cell: 'perforated',
    note: 'ひかり (light) down a paper lantern, its ribs every third row, between two running borders.',
    items: [
      { shape: 'lantern', x: 8, y: 7, w: 40, h: 42, word: 'ひかり', inks: E.fire, ribs: 3, teeth: false },
      { ornament: 'border', x: 4, y: 2, w: 48, inks: E.orange },
      { ornament: 'border', x: 4, y: 51, w: 48, inks: E.orange },
    ],
  },
  {
    id: 'bottle', label: 'Bottle', kind: 'emblem', cols: 52, seed: 4, cell: 'cross',
    note: 'A cross-stitched bottle in electric blue, SAKE knocked out in Haffer Black, between pink diamonds.',
    items: [
      { shape: 'bottle', x: 12, y: 4, w: 28, h: 44, word: ['SA', 'KE'], latin: ['SA', 'KE'], font: 'haffer', axes: { wght: 900 }, inks: E.blue, letter: '#ff3fb4', wordAt: 0.66 },
      ...[5, 46].map((x) => ({ ornament: 'diamonds', x, y: 14, r: 2, n: 4, inks: E.pink })),
    ],
  },
  {
    id: 'still-life', label: 'Still life', kind: 'emblem', cols: 84, seed: 5, cell: 'perforated',
    note: 'なし (pear), のむ (to drink) and すず (bell): three objects in a row, between running borders.',
    items: [
      { shape: 'pear', x: 4, y: 19, w: 22, h: 46, word: 'なし', inks: E.lime, wordAt: 0.7, gap: 0 },
      { shape: 'goblet', x: 31, y: 19, w: 22, h: 46, word: 'のむ', dir: 'h', inks: E.violet, wordAt: 0.18, gap: 0, aspect: 0.85 },
      { shape: 'bell', x: 58, y: 19, w: 22, h: 46, word: 'すず', inks: E.gold, wordAt: 0.62, gap: 0 },
      { ornament: 'border', x: 4, y: 9, w: 76, inks: E.orange },
      { ornament: 'border', x: 4, y: 72, w: 76, inks: E.orange },
    ],
  },
  {
    id: 'wave', label: 'Wave', kind: 'emblem', cols: 48, seed: 6, cell: 'oval', field: '#2e1300',
    note: 'WAVE as a dot matrix in Post Black: the dots stretch into ovals and merge as the wave passes, the ground a fainter screen.',
    items: [{ word: ['WA', 'VE'], font: 'post', axes: { wght: 900 }, x: 3, y: 3, w: 42, h: 42, inks: E.fire }],
  },
  {
    id: 'textile', label: 'Textile', kind: 'emblem', cols: 60, seed: 7, cell: 'perforated',
    note: 'The cover’s ornaments as a whole cloth: rosettes on a lattice, diamonds between, each a different ink.',
    items: textile,
  },
];
const VIEWS = [...STUDIES, ...COMBOS, ...EMBLEMS];
const OVERVIEW = { id: 'all', label: 'All views' };
const viewOf = (id) => VIEWS.find((v) => v.id === id) ?? VIEWS[0];

const state = {
  view: [...VIEWS, OVERVIEW].some((v) => v.id === q.get('view')) ? q.get('view') : 'stitch',
  seed: q.has('seed') ? Number(q.get('seed')) : null, // a click tries another arrangement
};
const seedOf = (v) => (state.seed && state.view === v.id ? state.seed : v.seed);

// Typefaces per view, loaded on first use.
const loaded = new Map();
const ready = async (v) => {
  if (!loaded.has(v.id)) loaded.set(v.id, await prepare(v));
  return loaded.get(v.id);
};

// ── Stage ──
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
const grid = document.createElement('div');
grid.className = 'views';
stage.append(canvas, grid);

const scenes = new Map();
const sceneOf = (v) => {
  const key = `${v.id}:${seedOf(v)}`;
  if (!scenes.has(key)) scenes.set(key, build(v, loaded.get(v.id), seedOf(v)));
  return scenes.get(key);
};

const fit = (c) => {
  const { width: W } = c.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio, 2);
  if (c.width !== Math.round(W * dpr)) c.width = c.height = Math.round(W * dpr);
  const x = c.getContext('2d');
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [x, W];
};

function drawView(x, W, v, t, lens = null) {
  const sc = sceneOf(v);
  x.fillStyle = sc.ground;
  x.fillRect(0, 0, W, W);
  sc.draw(x, W, t, lens);
  return sc;
}

// Time: the piece builds in, then lives. Thumbs and reduced motion show it built.
const DONE = BUILD + 0.5;
let start = performance.now();
let paused = thumb || reduced || q.has('paused');
let pausedAt = paused ? (q.has('t') ? Number(q.get('t')) : DONE) : 0;
const now = () => (paused ? pausedAt : (performance.now() - start) / 1000);
let lens = null;

function paint() {
  if (state.view === 'all' || !loaded.has(state.view)) return;
  const [x, W] = fit(canvas);
  if (W) drawView(x, W, viewOf(state.view), now(), lens);
}

let last = 0;
function loop(ms) {
  requestAnimationFrame(loop);
  if (paused || state.view === 'all') return;
  // Builds at full rate, then steps like a print at 12 fps.
  if (now() > DONE && ms - last < 1000 / 12 - 2) return;
  last = ms;
  paint();
}
requestAnimationFrame(loop);

const restart = () => {
  start = performance.now();
  if (paused) pausedAt = DONE;
  paint();
};
const togglePlay = () => {
  if (paused) start = performance.now() - pausedAt * 1000;
  else pausedAt = now();
  paused = !paused;
  paint();
};
addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.target.closest?.('input, textarea, select, button')) {
    e.preventDefault();
    togglePlay();
  }
});
window.__time = (t) => {
  paused = true;
  pausedAt = t;
  paint();
};

// Pointer: a lens over the cells. Click: another arrangement of the same view.
canvas.addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect();
  const v = viewOf(state.view);
  lens = { x: ((e.clientX - r.left) / r.width) * v.cols, y: ((e.clientY - r.top) / r.height) * (v.rows ?? v.cols) };
  if (paused) paint();
});
canvas.addEventListener('pointerleave', () => {
  lens = null;
  paint();
});
canvas.addEventListener('click', () => {
  state.seed = Math.floor(Math.random() * 9999) + 1;
  restart();
  render();
});

function paintGrid() {
  grid.innerHTML = '';
  for (const v of VIEWS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<canvas></canvas><span>${v.label}</span>`;
    b.addEventListener('click', () => setView(v.id));
    grid.append(b);
  }
  requestAnimationFrame(() => {
    for (const [i, b] of [...grid.children].entries()) {
      const [x, W] = fit(b.querySelector('canvas'));
      if (W) drawView(x, W, VIEWS[i], DONE);
    }
  });
}

async function render() {
  const overview = state.view === 'all';
  for (const v of overview ? VIEWS : [viewOf(state.view)]) await ready(v);
  await fontsReady('500 12px "Inter Tight Variable"');
  canvas.hidden = overview;
  grid.hidden = !overview;
  if (overview) paintGrid();
  else paint();
  shared.refresh();
  const v = viewOf(state.view);
  const sc = overview ? null : sceneOf(v);
  panel.details(
    overview
      ? [['Views', `${VIEWS.length}, made to post together as a set`]]
      : [
          ['View', v.note],
          ['Grid', `${v.cols} × ${v.rows ?? v.cols} cells, ${sc.stats.cells.toLocaleString()} filled`],
          ['Typeface', [...loaded.get(v.id).values()].map((f) => f.face.label).join(', ') || 'None, a drawn shape'],
          ['Arrangement', `${sc.programs ? sc.programs.join(', ') : `${sc.stats.patches} ${sc.stats.patches === 1 ? 'piece' : 'patches'}`}, seed ${seedOf(v)}`],
        ],
  );
  const url = new URL(location.href);
  url.search = '';
  if (state.view !== 'stitch') url.searchParams.set('view', state.view);
  if (state.seed) url.searchParams.set('seed', state.seed);
  history.replaceState(null, '', url);
  document.documentElement.dataset.rendered = String(Date.now());
}

function setView(id) {
  state.view = id;
  state.seed = null;
  lens = null;
  panel.set('view', id);
  panel.set('combo', id);
  panel.set('emblem', id);
  restart();
  render();
}

// ── Export ──
const EXPORT = 2160;
const download = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};
const still = async (v, t) => {
  await ready(v);
  const c = document.createElement('canvas');
  c.width = c.height = EXPORT;
  const x = c.getContext('2d');
  x.setTransform(EXPORT / 1080, 0, 0, EXPORT / 1080, 0, 0);
  drawView(x, 1080, v, t);
  return new Promise((r) => c.toBlob(r, 'image/png'));
};
const fileName = (v, ext) => `grid-glyphs-${String(VIEWS.indexOf(v) + 1).padStart(2, '0')}-${v.id}.${ext}`;

async function exportSet() {
  for (const v of VIEWS) {
    download(await still(v, DONE), fileName(v, 'png'));
    await new Promise((r) => setTimeout(r, 350));
  }
}

/** Records the current view at 1080 px: the build, then a few seconds of life. */
async function exportVideo() {
  const v = viewOf(state.view === 'all' ? 'stitch' : state.view);
  const c = document.createElement('canvas');
  c.width = c.height = 1080;
  const x = c.getContext('2d');
  const types = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
  const mimeType = types.find((t) => MediaRecorder.isTypeSupported(t));
  const stream = c.captureStream(0);
  const track = stream.getVideoTracks()[0];
  const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 12_000_000 });
  const chunks = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise((r) => (rec.onstop = r));
  const fps = 30;
  const seconds = 10;
  rec.start();
  const t0 = performance.now();
  for (let n = 0; n < fps * seconds; n++) {
    const t = n / fps;
    drawView(x, 1080, v, t > DONE ? DONE + Math.floor((t - DONE) * 12) / 12 : t);
    track.requestFrame();
    const due = t0 + ((n + 1) * 1000) / fps;
    await new Promise((r) => setTimeout(r, Math.max(0, due - performance.now())));
  }
  rec.stop();
  await done;
  download(new Blob(chunks, { type: mimeType }), fileName(v, mimeType.includes('mp4') ? 'mp4' : 'webm'));
}

const caption = () =>
  [
    'Letters, kana and shapes built from a square grid.',
    '',
    'Each form is set on a grid of cells and cut into patches along its strokes; every cell is drawn from a small vocabulary: stitches, routed blocks, numbered tiles, squares that scale, circles and squares, mosaic.',
    '',
    `Type: ${[...(loaded.get(state.view)?.values() ?? [])].map((f) => f.face.credit).join(', ') || 'none, drawn shapes'}`,
    'Made with: fontkit, Canvas 2D',
  ].join('\n');

const shared = panel.share({
  caption,
  note: `${EXPORT} px png`,
  exportImage: async () => {
    const v = viewOf(state.view === 'all' ? 'stitch' : state.view);
    return { blob: await still(v, Math.max(DONE, now())), name: fileName(v, 'png') };
  },
  extra: [
    { label: `Export the set, ${VIEWS.length} png`, run: exportSet },
    { label: 'Export video, 1080 px', run: exportVideo },
  ],
});

panel.controls(
  [
    { key: 'view', label: 'Studies', value: state.view, options: [...STUDIES, OVERVIEW].map((v) => ({ value: v.id, label: v.label })) },
    { key: 'combo', label: 'Combinations', value: state.view, options: COMBOS.map((v) => ({ value: v.id, label: v.label })) },
    { key: 'emblem', label: 'Emblems', value: state.view, options: EMBLEMS.map((v) => ({ value: v.id, label: v.label })) },
    { label: 'Another arrangement', action: () => canvas.click() },
    { label: 'Build again', action: restart },
    { label: 'Play or pause (space)', action: togglePlay },
  ],
  (key, value) => ['view', 'combo', 'emblem'].includes(key) && setView(value),
);

gui.add({ build: restart }, 'build').name('Build again');

render();
let timer;
new ResizeObserver(() => {
  clearTimeout(timer);
  timer = setTimeout(render, 120);
}).observe(stage);
