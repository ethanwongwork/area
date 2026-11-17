// 1 Glyph Flow. The poster sits in the viewer beside its panel. Most choices are locked
// (riso inks, PP Kyoto, the copy); what's open is which view of the piece you look at
// and how it moves. The views are a small set made to post together: the hero, then
// variations of ground, scale, type size and script, and an overview of all of them.
import { createNoise2D } from 'simplex-noise';
import { shell } from '../../src/shell.js';
import { random } from '../../src/glyphs.js';
import { fonts, getFont } from './fonts.js';
import { flow, GROUNDS } from './flow.js';
import registry from '../../experiments.json';
import { exportable } from '../../src/export.js';

const entry = registry.find((e) => e.slug === 'glyph-flow');
const { gui, thumb, panel, reduced } = shell('glyph-flow', { viewer: true });
const q = new URLSearchParams(location.search);
const fontName = Object.keys(fonts).find((n) => /PP Kyoto/.test(n)) ?? Object.keys(fonts)[0];

// The locked design. Views change only what they name.
const base = { ...flow.params, palette: 'riso', copy: 'moxon', characters: 'kana', boil: 'on', fps: 8, hold: 2 };
const VIEWS = [
  { id: 'hero', label: 'Hero', seed: 202, note: 'The default: the whole sheet, hiragana and katakana patterns.' },
  { id: 'detail', label: 'Detail, 2.5×', seed: 202, zoom: 2.5, focus: [0.3, 0.32], note: 'A corner of the hero, close enough to read the copy.' },
  { id: 'close', label: 'Close, 6×', seed: 202, zoom: 6, focus: [0.62, 0.55], note: 'A few glyphs across a seam.' },
  { id: 'fine', label: 'Fine', seed: 202, p: { size: 0.0125 }, note: 'The hero map set in smaller type: more rows, more texture.' },
  { id: 'large', label: 'Large', seed: 27, p: { size: 0.03 }, note: 'A new map in larger type: fewer, bolder sections.' },
  { id: 'katakana', label: 'Katakana', seed: 113, p: { characters: 'katakana' }, note: 'A new map, patterns in katakana only.' },
  { id: 'hiragana', label: 'Hiragana', seed: 64, p: { characters: 'hiragana' }, note: 'A new map, patterns in hiragana only.' },
  { id: 'latin', label: 'Latin', seed: 19, p: { characters: 'latin' }, note: 'A new map, patterns in Latin letters and their accents.' },
  { id: 'mixed', label: 'Mixed', seed: 311, p: { characters: 'all' }, note: 'A new map, patterns from the whole glyph set: kana, Latin, Greek, Cyrillic, figures and signs.' },
];
const OVERVIEW = { id: 'all', label: 'All views' };
const viewOf = (id) => VIEWS.find((v) => v.id === id) ?? VIEWS[0];

const state = {
  view: [...VIEWS, OVERVIEW].some((v) => v.id === q.get('view')) ? q.get('view') : 'hero',
  motion: 'drift', // locked
  background: ['white', 'black'].includes(q.get('background')) ? q.get('background') : 'white',
  turbulence: [0, 1, 2, 3].includes(Number(q.get('turbulence') ?? NaN)) ? Number(q.get('turbulence')) : base.turbulence,
  seed: q.has('seed') ? Number(q.get('seed')) : null, // G: try another map in the current view
};
const paramsOf = (v) => ({ ...base, ...(v.p ?? {}), motion: state.motion, turbulence: state.turbulence, background: state.background });
const seedOf = (v) => (state.seed && state.view === v.id ? state.seed : v.seed);

// Stage: one poster, or the overview grid.
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
const grid = document.createElement('div');
grid.className = 'views';
stage.append(canvas, grid);

const noises = new Map();
const noiseFor = (seed) => {
  if (!noises.has(seed)) noises.set(seed, createNoise2D(random(seed * 7 + 1)));
  return noises.get(seed);
};

/** Draws a view into a 2D context of W × W (logical px) at frame t. */
function drawView(x, W, v, gf, t) {
  const p = paramsOf(v);
  const seed = seedOf(v);
  x.fillStyle = GROUNDS[p.background] ?? GROUNDS.white;
  x.fillRect(0, 0, W, W);
  x.save();
  const z = v.zoom ?? 1;
  if (z !== 1) {
    const [fx, fy] = v.focus ?? [0.5, 0.5];
    // Keep the crop inside the sheet.
    const half = 0.5 / z;
    const cx = Math.min(1 - half, Math.max(half, fx));
    const cy = Math.min(1 - half, Math.max(half, fy));
    x.translate(W / 2, W / 2);
    x.scale(z, z);
    x.translate(-cx * W, -cy * W);
  }
  const out = flow.draw({ ctx: x, W, H: W, gf, rng: random(seed), noise: noiseFor(seed), p, t }) ?? {};
  x.restore();
  return out;
}

const fit = (c) => {
  const { width: W } = c.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio, 2);
  if (c.width !== Math.round(W * dpr)) c.width = c.height = Math.round(W * dpr);
  const x = c.getContext('2d');
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [x, W];
};

let gf = null;
let frame = Number(q.get('t') ?? 0);
let playing = !thumb && !reduced && !q.has('paused');
let lastOut = {};

function paint() {
  if (!gf || state.view === 'all') return;
  const [x, W] = fit(canvas);
  if (W) lastOut = drawView(x, W, viewOf(state.view), gf, frame);
  document.documentElement.dataset.frame = String(frame);
}

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
      if (W) drawView(x, W, VIEWS[i], gf, 0);
    }
  });
}

let last = 0;
function loop(now) {
  requestAnimationFrame(loop);
  if (!playing || !gf || state.motion === 'still' || state.view === 'all') return;
  if (now - last < 1000 / base.fps - 2) return;
  last = now;
  frame++;
  paint();
}
requestAnimationFrame(loop);
const togglePlay = () => (playing = !playing);
addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.target.closest?.('input, textarea, select, button')) {
    e.preventDefault();
    togglePlay();
  }
});
// For recording: draw a given frame.
window.__frame = (n) => {
  playing = false;
  frame = n;
  paint();
};

async function render() {
  gf = await getFont(fontName);
  const overview = state.view === 'all';
  canvas.hidden = overview;
  grid.hidden = !overview;
  if (overview) paintGrid();
  else paint();
  shared.refresh();
  const v = viewOf(state.view);
  panel.details(
    overview
      ? [['Views', `${VIEWS.length}, made to post together as a set`]]
      : [
          ['View', v.note],
          ['Glyphs', `${lastOut.glyphs?.toLocaleString() ?? '—'} set, from the ${gf.glyphs.length} in PP Kyoto`],
          ['Shapes', `${lastOut.shapes ?? '—'} in the map, seed ${seedOf(v)}`],
        ],
  );
  const url = new URL(location.href);
  url.search = '';
  if (state.view !== 'hero') url.searchParams.set('view', state.view);
  if (state.background !== 'white') url.searchParams.set('background', state.background);
  if (state.turbulence !== base.turbulence) url.searchParams.set('turbulence', state.turbulence);
  if (state.seed) url.searchParams.set('seed', state.seed);
  history.replaceState(null, '', url);
  document.documentElement.dataset.rendered = String(Date.now());
}

function setView(id) {
  state.view = id;
  state.seed = null;
  panel.set('view', id);
  render();
}

// ── Export ──
const EXPORT = 2160; // Instagram shows 1080; twice that stays sharp
const download = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};
const still = async (v, t) => {
  const c = document.createElement('canvas');
  c.width = c.height = EXPORT;
  const x = c.getContext('2d');
  x.setTransform(EXPORT / 1080, 0, 0, EXPORT / 1080, 0, 0);
  drawView(x, 1080, v, gf, t);
  return new Promise((r) => c.toBlob(r, 'image/png'));
};
const fileName = (v, i, ext) => `glyph-flow-${String(i + 1).padStart(2, '0')}-${v.id}.${ext}`;

async function exportSet() {
  for (const [i, v] of VIEWS.entries()) {
    download(await still(v, 0), fileName(v, i, 'png'));
    await new Promise((r) => setTimeout(r, 350));
  }
}

/** Records the current view at 1080 px, one loop of the motion, at the frame rate. */
async function exportVideo() {
  const v = viewOf(state.view === 'all' ? 'hero' : state.view);
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
  const frames = base.loop; // one whole loop
  rec.start();
  const start = performance.now();
  for (let n = 0; n < frames; n++) {
    drawView(x, 1080, v, gf, n);
    track.requestFrame();
    const due = start + ((n + 1) * 1000) / base.fps;
    await new Promise((r) => setTimeout(r, Math.max(0, due - performance.now())));
  }
  rec.stop();
  await done;
  download(new Blob(chunks, { type: mimeType }), fileName(v, VIEWS.indexOf(v), mimeType.includes('mp4') ? 'mp4' : 'webm'));
}

// The caption covers the project, not one view.
const caption = () =>
  [
    'Hiragana, katakana and Latin glyphs, set as one block of type.',
    '',
    'A noise field is cut into organic shapes, and as each line is set the shape under it picks a repeated glyph, a letter’s accents or the copy, so sections meet at a single word space. In stop motion the map drifts and comes home while the glyphs boil. The set varies the scale, the type size, the script, the ground and the turbulence.',
    '',
    'Type: PP Kyoto by @pangrampangram',
    'Copy: Joseph Moxon, Mechanick Exercises on the Whole Art of Printing (1683)',
    'Made with: fontkit, Canvas 2D',
  ].join('\n');

const shared = panel.share({
  caption,
  note: `${EXPORT} px png`,
  exportImage: async () => {
    const v = viewOf(state.view === 'all' ? 'hero' : state.view);
    return { blob: await still(v, frame), name: fileName(v, VIEWS.indexOf(v), 'png') };
  },
  extra: [
    { label: `Export the set, ${VIEWS.length} png`, run: exportSet },
    { label: 'Export video, 1080 px', run: exportVideo },
  ],
});

// ── Controls: the view, and how it moves ──
panel.controls(
  [
    { key: 'view', label: 'View', value: state.view, options: [...VIEWS, OVERVIEW].map((v) => ({ value: v.id, label: v.label })) },
    { key: 'turbulence', label: 'Turbulence', value: state.turbulence, options: ['None', 'Low', 'Medium', 'High'].map((label, value) => ({ value, label })) },
    { key: 'background', label: 'Background', value: state.background, options: ['white', 'black'] },
    { label: 'Play or pause (space)', action: togglePlay },
  ],
  (key, value) => {
    if (key === 'view') setView(value);
    else {
      state[key] = value;
      frame = 0;
      render();
    }
  },
);

// For scripts/export-set.mjs: the view in the URL at t seconds, drawn at 1080 logical px and
// scaled, so every size sets the same lines. One loop is `loop` frames at 8 a second.
getFont(fontName).then((font) => {
  gf = font;
  exportable({
    get loop() {
      return state.motion === 'still' ? 0 : base.loop / base.fps;
    },
    fps: base.fps,
    render(t, size) {
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const x = c.getContext('2d');
      x.setTransform(size / 1080, 0, 0, size / 1080, 0, 0);
      drawView(x, 1080, viewOf(state.view === 'all' ? 'hero' : state.view), gf, Math.round(t * base.fps));
      return c;
    },
  });
});

// G: try another map in the current view.
gui.add({ shuffle: () => ((state.seed = Math.floor(Math.random() * 999) + 1), render()) }, 'shuffle').name('Another map (this view)');

let timer;
new ResizeObserver(() => {
  clearTimeout(timer);
  timer = setTimeout(render, 120);
}).observe(stage);
