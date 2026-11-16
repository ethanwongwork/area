// 5 Eddy. Lines of On Growth and Form in six round rings that drift without stopping; every
// 0.7 to 1.5 seconds one to three neighbouring rings snap round, often swapping their tall end,
// and the view zooms in or out with them. The moves come from a fixed schedule, so the page
// and a recording show the same frame at the same moment. Engine: engine.js; rings, motions
// and the WebGL renderer: rings.js.
import { shell } from '../../src/shell.js';
import { parse } from 'opentype.js';
import fontUrl from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff?url';
import { COMP, GAP_PX, GROUND, MOTIONS, SWELL, layoutOf, makeRenderer, useFont } from './rings.js';

const { gui, thumb, panel, reduced } = shell('eddy', { viewer: true });
panel.ground(GROUND);

useFont(parse(await (await fetch(fontUrl)).arrayBuffer()));

const state = { motion: 'snap' };
const mOf = (id) => MOTIONS.find((m) => m.id === id);

// ── The live piece ──
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.setAttribute('role', 'img');
stage.append(canvas);

let R = null;
try {
  R = makeRenderer(canvas);
} catch (e) {
  console.error(e);
}
if (!R) stage.textContent = 'This piece needs WebGL, which this browser has turned off.';

// A moment mid-snap, for the thumbnail and for reduced motion.
const STILL = 6.4;
let playing = !reduced && !thumb, base = reduced || thumb ? STILL : 0, mark = performance.now();
const clock = () => (playing ? base + (performance.now() - mark) / 1000 : base);
const setPlaying = (p) => { base = clock(); mark = performance.now(); playing = p; };
const togglePlay = () => setPlaying(!playing);

function draw() {
  const W = canvas.clientWidth;
  if (!W || !R) return;
  // Every frame averages moments across half a frame (a 180 degree shutter), more of them the
  // faster a ring moves, so a snap leaves a trail and a ring at rest stays exactly sharp.
  R.draw(mOf(state.motion), clock(), Math.round(W * Math.min(devicePixelRatio || 1, 2)), true, 1 / 120, 12);
}

function loop() {
  requestAnimationFrame(loop);
  if (playing) draw();
}

function describe() {
  const m = mOf(state.motion);
  canvas.setAttribute('aria-label', `Rings of type in cool grey on black. ${m.label}: ${m.note}`);
  if (thumb) return;
  const L = layoutOf();
  panel.details([
    ['Motion', m.note],
    ['Measured', `${COMP.strands.length} rings, ${L.words} words in ${L.lines} lines. No ring is ever taller than ${SWELL.toFixed(2)} times its mean height, so rings stay at least ${GAP_PX} px apart at 1080 px.`],
  ]);
}

describe();
draw();
if (thumb) document.documentElement.dataset.rendered = String(Date.now());
else requestAnimationFrame(loop);

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  if (e.key === ' ') { e.preventDefault(); togglePlay(); }
});
new ResizeObserver(() => !playing && draw()).observe(stage);

// ── Export ──
// Frames for export are drawn on their own canvas, then copied to a 2D one to save.
const download = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};
let X = null;
function frameAt(t, px, shutter, most) {
  X ??= makeRenderer(document.createElement('canvas'));
  X.draw(mOf(state.motion), t, px, true, shutter, most);
  return X.gl.canvas;
}

const EXPORT = 2160;
function still() {
  const c = document.createElement('canvas');
  c.width = c.height = EXPORT;
  c.getContext('2d').drawImage(frameAt(clock(), EXPORT, 1 / 120, 40), 0, 0);
  return new Promise((r) => c.toBlob(r, 'image/png'));
}

/** Eight seconds from the start at 1080 px, 60 fps, each frame drawn at its own moment. */
async function exportVideo() {
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
  const fps = 60, seconds = 8;
  rec.start();
  const t0 = performance.now();
  for (let n = 0; n < fps * seconds; n++) {
    x.drawImage(frameAt(n / fps, 1080, 1 / fps / 2, 40), 0, 0);
    track.requestFrame();
    const due = t0 + ((n + 1) * 1000) / fps;
    await new Promise((r) => setTimeout(r, Math.max(0, due - performance.now())));
  }
  rec.stop();
  await done;
  download(new Blob(chunks, { type: mimeType }), `eddy-${state.motion}.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
}

const caption = () =>
  [
    'Lines of On Growth and Form in round rings, drifting, with bursts.',
    '',
    'Six rings of type, each tall at one end and small at the other, turn without stopping. Every second or so a few of them snap round and swap their tall end, and the view zooms with them.',
    '',
    'Type: Instrument Serif by @instrument',
    'Text: D’Arcy Wentworth Thompson, On Growth and Form (1917)',
    'Made with: opentype.js, WebGL',
  ].join('\n');

panel.share({
  caption,
  note: `${EXPORT} px png`,
  exportImage: async () => ({ blob: await still(), name: `eddy-${state.motion}.png` }),
  extra: [{ label: 'Export video, 8 s at 1080 px', run: exportVideo }],
});

panel.controls(
  [
    {
      key: 'motion', label: 'Motion', value: state.motion,
      options: [{ value: 'snap', label: 'Snap' }, { value: 'surge', label: 'Surge' }, { value: 'drift', label: 'Drift only' }],
    },
    { label: 'Play or pause (space)', action: togglePlay },
  ],
  (key, value) => {
    state[key] = value;
    describe();
    if (!playing) draw();
  },
);

// G: every motion from the study, for work on the piece.
gui.add(state, 'motion', MOTIONS.map((m) => m.id)).name('Motion').onChange(() => { panel.set('motion', state.motion); describe(); if (!playing) draw(); });

// For scripts/record.mjs: the canvas and a way to start it.
window.__eddy = { canvas, play: () => setPlaying(true), render: (id, t, px, shutter = 1 / 120) => R.draw(mOf(id), t, px, true, shutter, 40) };
