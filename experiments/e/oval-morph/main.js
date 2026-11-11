// 6 Oval Morph. Forty Geist glyphs on a 24 × 24 grid of white dots. Every oval is a grid dot
// grown: between glyphs each one that changes pulls back into its dot, then springs out to
// its new size and angle along the stroke, and the next glyph starts the moment the last
// oval lands. Cells come pre-sampled from scripts/oval-morph-cells.mjs.
import { shell } from '../../src/shell.js';
import G from './cells.json';

const { gui, thumb, panel, reduced } = shell('oval-morph', { viewer: true });

const N = G.N, M = 0.12, TAU = Math.PI * 2, C = N * N;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;

// ── The locked design ──
// Shape of a cell in a glyph: on/off, major and minor radius (in cells), angle along the stroke.
const FULL = 0.48, GHOST = 0.09, DIP = GHOST * 0.55, DIP_T = 0.08;
// Overshoot past full size is eased off, so neighbours only kiss at the top of a bounce.
const cap = (r) => (r < 0.47 ? r : 0.47 + (r - 0.47) * 0.55);
const SHAPES = {};
for (const w of ['bold', 'light']) {
  SHAPES[w] = G[w].map((flat) => {
    const s = { on: new Uint8Array(C), R: new Float32Array(C).fill(GHOST), m: new Float32Array(C).fill(GHOST), a: new Float32Array(C) };
    for (let i = 0; i < flat.length; i += 5) {
      const [x, y, v, a, c] = flat.slice(i, i + 5), k = y * N + x;
      if (v < 3) continue;
      const r = FULL * (0.5 + 0.5 * clamp((v - 3) / 5)), e = c / 9;
      s.on[k] = 1; s.R[k] = r; s.m[k] = r * (1 - 0.34 * e); s.a[k] = a * (Math.PI / 36);
    }
    return s;
  });
}

// Grounds at the edge of the display's gamut: blue at full chroma, from slightly green to pure.
const GROUNDS = { blue: [0, 0.36, 1], deep: [0, 0.2, 1], pure: [0, 0, 1] };
const p3 = CSS.supports('color', 'color(display-p3 0 0 1)');
const groundCss = (k) => {
  const [r, g, b] = GROUNDS[k];
  return p3 ? `color(display-p3 ${r} ${g} ${b})` : `rgb(${r * 255},${g * 255},${b * 255})`;
};
const context = (canvas) => canvas.getContext('2d', p3 ? { colorSpace: 'display-p3' } : undefined);
const SPRINGS = { springy: { z: 0.44, w: 25 }, firm: { z: 0.8, w: 30 } };
// How long a spring takes to come within 4% of rest.
const settle = ({ z, w }) => Math.log(25 / Math.sqrt(1 - z * z)) / (z * w);

const state = { motion: 'ripple', change: 'grow', bounce: 'springy', weight: 'bold', ground: 'blue' };
const glyphName = (ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;

/**
 * One morph: every cell's from and to shapes and its delay. Time is passed in, so the live
 * piece and the video export each run their own copy on their own clock.
 */
function morph(st) {
  const F = () => new Float32Array(C);
  const fOn = F(), fR = F().fill(GHOST), fm = F().fill(GHOST), fa = F(), tOn = F(), tR = F().fill(GHOST), tm = F().fill(GHOST), ta = F(), dl = F(), ph0 = F(), axis = F();
  const moving = new Uint8Array(C);
  const rnd = (() => { let s = 11; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  let spring = SPRINGS.springy, mode = 'grow';
  const m = { tStart: -10, tEnd: -10, current: -1 };

  // Closed-form damped spring from 0 to 1.
  function sp(t) {
    if (t <= 0) return 0;
    if (reduced) return 1;
    const { z, w } = spring, wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  }
  const easeIn = (v) => v * v * v;

  // What cell k shows at time t: on, radii, angle, and how far it is turned edge-on (1 = face on).
  const out = { on: 0, R: 0, m: 0, a: 0, face: 1, phi: 0 };
  function at(k, t) {
    const u = moving[k] ? sp(t - m.tStart - dl[k]) : 1;
    out.phi = 0; out.face = 1;
    if (mode === 'grow') {
      // Every change goes through the grid dot: the oval pulls in, a touch smaller than the dot,
      // then springs out to its new shape, overshooting and settling.
      const tau = t - m.tStart - dl[k];
      if (!moving[k] || tau > DIP_T + 2) { out.on = tOn[k]; out.R = tR[k]; out.m = tm[k]; out.a = ta[k]; }
      else if (tau <= 0) { out.on = fOn[k]; out.R = fR[k]; out.m = fm[k]; out.a = fa[k]; }
      else if (tau < DIP_T) {
        const e = easeIn(tau / DIP_T);
        out.on = fOn[k]; out.R = lerp(fR[k], DIP, e); out.m = lerp(fm[k], DIP, e); out.a = fa[k];
      } else {
        const v = sp(tau - DIP_T);
        out.on = tOn[k]; out.R = Math.max(0, lerp(DIP, tR[k], v)); out.m = Math.max(0, lerp(DIP, tm[k], v)); out.a = ta[k];
      }
    } else if (mode === 'flip') {
      // Flips over like a coin, edge-on at the halfway point, and lands as its new shape.
      const phi = ph0[k] + (Math.PI - ph0[k]) * u, back = moving[k] && phi > Math.PI / 2;
      out.phi = phi; out.face = moving[k] ? Math.abs(Math.cos(phi)) : 1;
      const to = back || !moving[k];
      out.on = to ? tOn[k] : fOn[k]; out.R = to ? tR[k] : fR[k]; out.m = to ? tm[k] : fm[k]; out.a = to ? ta[k] : fa[k];
    } else {
      // Turns and resizes in place.
      out.on = clamp(lerp(fOn[k], tOn[k], clamp(u * 2)));
      out.R = Math.max(0, lerp(fR[k], tR[k], u)); out.m = Math.max(0, lerp(fm[k], tm[k], u));
      out.a = fa[k] + (ta[k] - fa[k]) * u;
    }
    return out;
  }

  m.go = (g, t) => {
    const n = G.seq.length;
    g = ((g % n) + n) % n;
    const S = SHAPES[st.weight][g], was = mode;
    spring = SPRINGS[st.bounce];
    let maxD = 0;
    for (let k = 0; k < C; k++) {
      const o = at(k, t), x = (k % N) / (N - 1), y = Math.floor(k / N) / (N - 1);
      // Pick up from whatever the cell shows now, so an interrupted change carries on smoothly.
      let phi = was === 'flip' && moving[k] ? o.phi : 0;
      if (phi > Math.PI / 2) phi -= Math.PI; // already showing its new side: that side is now the front
      fOn[k] = o.on; fR[k] = o.R; fm[k] = o.m; fa[k] = o.a;
      tOn[k] = S.on[k]; tR[k] = S.R[k]; tm[k] = S.m[k];
      // A ghost has no angle worth turning to: it keeps its own. Turns take the shortest way round.
      const target = S.on[k] ? S.a[k] : o.a;
      ta[k] = o.a + ((((target - o.a) % Math.PI) + Math.PI * 1.5) % Math.PI - Math.PI / 2);
      const same = fOn[k] === tOn[k] && Math.abs(fR[k] - tR[k]) < 0.01 && Math.abs(fm[k] - tm[k]) < 0.01 && Math.abs(ta[k] - fa[k]) < 0.05;
      moving[k] = same && Math.abs(phi) < 0.01 ? 0 : 1;
      ph0[k] = phi;
      const dx = x - 0.5, dy = y - 0.5;
      axis[k] = st.motion === 'ripple' ? Math.atan2(dy, dx) : 0;
      const spread = st.motion === 'ripple' ? 0.2 * Math.min(1, Math.hypot(dx, dy) / 0.7) : st.motion === 'sweep' ? 0.2 * x : 0;
      dl[k] = reduced ? 0 : spread + rnd() * 0.015;
      if (moving[k]) maxD = Math.max(maxD, dl[k]);
    }
    mode = st.change;
    m.tStart = t;
    m.tEnd = t + maxD + (mode === 'grow' ? DIP_T : 0) + settle(spring);
    m.current = g;
    return g;
  };

  /** Draws the poster at side W (logical px) at time t. */
  m.draw = (c, W, t, scale = 1) => {
    c.setTransform(scale, 0, 0, scale, 0, 0);
    c.fillStyle = groundCss(st.ground);
    c.fillRect(0, 0, W, W);
    const s = W / (N + 2 * M), o = M * s;
    c.fillStyle = '#fff'; // grid dots and ovals are one white: every oval is a grid dot grown
    for (let k = 0; k < C; k++) {
      const p = at(k, t);
      if (p.R < 0.01 || p.face < 0.02) continue;
      const X = o + ((k % N) + 0.5) * s, Y = o + (Math.floor(k / N) + 0.5) * s;
      // Flipping squashes the oval across the flip axis: scale by `face` along direction `axis`.
      const q = p.face - 1, cu = Math.cos(axis[k]), su = Math.sin(axis[k]);
      c.setTransform(scale * (1 + q * cu * cu), scale * q * cu * su, scale * q * cu * su, scale * (1 + q * su * su), scale * X, scale * Y);
      c.beginPath();
      c.ellipse(0, 0, cap(p.R) * s, cap(p.m) * s, p.a, 0, TAU);
      c.fill();
    }
  };
  return m;
}

// ── The live piece ──
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.setAttribute('role', 'img');
stage.append(canvas);
let ctx = null;

const live = morph(state);
let playing = !reduced && !thumb, base = 0, mark = performance.now();
const clock = () => (playing ? base + (performance.now() - mark) / 1000 : base);
const setPlaying = (p) => { base = clock(); mark = performance.now(); playing = p; };

function show(g) {
  const i = live.go(g, clock());
  const ch = G.seq[i];
  canvas.setAttribute('aria-label', `The glyph ${ch} drawn in white ovals on a blue grid of dots`);
  if (!thumb) panel.details([['Glyph', `${ch}  ${glyphName(ch)}, ${i + 1} of ${G.seq.length}`]]);
}

function draw() {
  const W = canvas.clientWidth;
  if (!W) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(W * dpr)) canvas.width = canvas.height = Math.round(W * dpr);
  ctx ??= context(canvas);
  live.draw(ctx, W, clock(), dpr);
}

function loop() {
  requestAnimationFrame(loop);
  if (playing && clock() > live.tEnd + 0.03) show(live.current + 1);
  draw();
}

// The hero at rest: the first glyph, settled.
show(0);
if (thumb) {
  base = 10;
  draw();
  document.documentElement.dataset.rendered = String(Date.now());
} else {
  requestAnimationFrame(loop);
}

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); show(live.current + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); show(live.current - 1); }
  if (e.key === ' ') { e.preventDefault(); togglePlay(); }
});
const togglePlay = () => setPlaying(!playing);
new ResizeObserver(() => !playing && draw()).observe(stage);

// ── Export ──
const EXPORT = 2160;
const download = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};
const fileName = (g, ext) => `oval-morph-${String(g + 1).padStart(2, '0')}-${glyphName(G.seq[g]).slice(2).toLowerCase()}.${ext}`;

/** One glyph at rest, at 2160 px. */
function still(g) {
  const m = morph({ ...state });
  m.go(g, 0);
  const c = document.createElement('canvas');
  c.width = c.height = EXPORT;
  m.draw(context(c), 1080, 10, EXPORT / 1080);
  return new Promise((r) => c.toBlob(r, 'image/png'));
}

/**
 * An 8 second loop at 1080 px: thirteen glyphs on an even beat, the last change landing back
 * on the first glyph as the video ends.
 */
async function exportVideo() {
  const c = document.createElement('canvas');
  c.width = c.height = 1080;
  const x = context(c);
  const types = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
  const mimeType = types.find((t) => MediaRecorder.isTypeSupported(t));
  const stream = c.captureStream(0);
  const track = stream.getVideoTracks()[0];
  const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 12_000_000 });
  const chunks = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise((r) => (rec.onstop = r));
  const fps = 30, seconds = 8, count = 13, beat = seconds / count;
  const m = morph({ ...state });
  m.go(0, -10); // the first glyph, settled
  let i = 0; // change i starts at i·beat and goes to glyph i + 1; the last goes back to the first
  rec.start();
  const t0 = performance.now();
  for (let n = 0; n < fps * seconds; n++) {
    const t = n / fps;
    while (i < count && t >= i * beat) m.go((++i) % count, (i - 1) * beat);
    m.draw(x, 1080, t);
    track.requestFrame();
    const due = t0 + ((n + 1) * 1000) / fps;
    await new Promise((r) => setTimeout(r, Math.max(0, due - performance.now())));
  }
  rec.stop();
  await done;
  download(new Blob(chunks, { type: mimeType }), `oval-morph-loop.${mimeType.includes('mp4') ? 'mp4' : 'webm'}`);
}

const caption = () =>
  [
    'Forty glyphs drawn in ovals that grow from a grid of dots.',
    '',
    'Each glyph is sampled onto a 24 by 24 grid; every cell is one white oval, sized by how much ink it covers and turned along the stroke. Between glyphs each oval pulls back into its dot and springs out as the next one.',
    '',
    'Type: Geist by @vercel',
    'Made with: fontkit, Canvas 2D',
  ].join('\n');

panel.share({
  caption,
  note: `${EXPORT} px png`,
  exportImage: async () => ({ blob: await still(live.current), name: fileName(live.current, 'png') }),
  extra: [{ label: 'Export video, 8 s at 1080 px', run: exportVideo }],
});

panel.controls(
  [
    { key: 'motion', label: 'Motion', value: state.motion, options: ['ripple', 'sweep', { value: 'together', label: 'All at once' }] },
    { key: 'change', label: 'Change', value: state.change, options: ['grow', 'flip', 'turn'] },
    { key: 'weight', label: 'Weight', value: state.weight, options: [{ value: 'bold', label: 'Extrabold' }, { value: 'light', label: 'Regular' }] },
    {
      key: 'ground', label: 'Ground', value: state.ground,
      options: Object.keys(GROUNDS).map((k) => ({ value: k, swatch: [groundCss(k)] })),
    },
    { label: 'Next glyph', action: () => show(live.current + 1) },
    { label: 'Play or pause (space)', action: togglePlay },
  ],
  (key, value) => {
    state[key] = value;
    if (key === 'weight') show(live.current); // the ovals reshape to the other weight in place
    if (!playing) draw();
  },
);

gui.add(state, 'bounce', Object.keys(SPRINGS)).name('Bounce');
