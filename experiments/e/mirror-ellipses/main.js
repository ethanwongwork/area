// 10 Mirrored glyph ellipses. Lowercase e's stretched into ellipses that flow along spokes from a
// centre eye. One quadrant is drawn from a rule and its layout is reflected (or turned) into the other
// three, but the glyphs never are: every e is redrawn upright where it lands.
import '@fontsource-variable/atkinson-hyperlegible-next';
import { shell, fontsReady } from '../../src/shell.js';

const { gui, thumb, panel, reduced } = shell('mirror-ellipses', { viewer: true });

const SIDE = 1080, MARGIN = 0.01 * SIDE, HP = Math.PI / 2;
const LOOP = 8; // seconds: one full cycle at 1×; every speed is a whole number of cycles in it
const FAMILY = '"Atkinson Hyperlegible Next Variable", "Atkinson Hyperlegible Next", sans-serif';
const WEIGHT = 700, GLYPHS = 'e', SEED = 4;

const MODES = {
  light: { ground: '#ffd2ea', fill: '#ff8fcb', line: '#000000' },
  dark: { ground: '#000000', fill: '#000000', line: '#ff8fcb' },
};

// ── Motion ──
// u is how far every token has travelled along its spoke, in steps of the geometric spacing. It covers
// exactly two steps a cycle (two, so the staggered rows land back on their own parity) and so ends
// where it began. Flow never stops: its pace swings between 0.45× and 1.55× twice a cycle on a sine,
// whose start and end match in value and in slope. Glide is the same distance at a constant pace.
const FLOW_K = 2, FLOW_A = 0.55;
function travel(t, motion) {
  const T = ((t % 1) + 1) % 1;
  if (motion === 'flow') return 2 * (T - (FLOW_A * Math.sin(2 * Math.PI * FLOW_K * T)) / (2 * Math.PI * FLOW_K));
  if (motion === 'glide') return 2 * T;
  return 0;
}

const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
// size falloff at the rim, so tokens shrink away instead of popping off
const edge = (r, from = 0.82, to = 1.12) => 1 - smooth((r - from) / (to - from));

// ── Forms ──
// Tokens sit at geometric radii r0·q^(i ± u) along m spokes a quadrant, alternate rows staggered half a
// spoke. A token grows from nothing as it leaves the eye and shrinks away at the rim. Twist bends the
// spokes into log spirals, squash flattens the burst into a lens. Flow is out, in, or counter
// (neighbouring spokes in opposite directions).
const FORMS = {
  whirl: { name: 'Whirl', sym: 'turn', m: 4, twist: 0.55 },
  spokes: { name: 'Spokes', sym: 'mirror', m: 4 },
  petals: { name: 'Petals', sym: 'mirror', m: 6, q: 1.22, aF: 0.72, bF: 0.22 },
  lens: { name: 'Lens', sym: 'mirror', m: 5, q: 1.3, squash: 0.55 },
  inhale: { name: 'Inhale', sym: 'mirror', m: 4, dir: -1 },
  counter: { name: 'Counterflow', sym: 'mirror', m: 4, counter: true, stagger: false, aF: 0.7, bF: 0.24 },
};

function tokens(p, u, dir) {
  const m = p.m, q = p.q ?? 1.36, r0 = 0.03, rmin = 0.06, tw = p.twist || 0, sq = p.squash || 1, out = [];
  const fl = p.counter || dir === 'counter' ? 'counter' : p.dir === -1 ? 'in' : 'out';
  const jLo = tw ? -4 * m : 0, jHi = tw ? 5 * m : m;
  for (let j = jLo; j <= jHi; j++) {
    const flow = fl === 'counter' ? (((j % 2) + 2) % 2 ? -1 : 1) : fl === 'in' ? -1 : 1;
    for (let i = -4; i < 80; i++) {
      const ri = r0 * q ** (i + flow * u);
      if (ri > 1.15) break;
      if (ri < rmin * 0.5) continue;
      const stag = p.stagger === false ? 0 : ((i % 2) + 2) % 2;
      const al = ((j + stag * 0.5) * HP) / m + tw * Math.log(ri);
      if (al < -0.4 || al > HP + 0.4) continue;
      const eye = smooth((ri - rmin * 0.5) / (rmin * 1.5)), k = edge(ri) * eye;
      let a = ri * (q - 1) * (p.aF ?? 0.6) * k, b = ri * (HP / m) * (p.bF ?? 0.2) * k, rot = al + Math.atan(tw);
      if (Math.min(a, b) < 1e-4) continue;
      if (b > a) { [a, b] = [b, a]; rot += HP; }
      const x = ri * Math.cos(al), y = ri * Math.sin(al) * sq;
      if (sq !== 1) rot = Math.atan2(Math.sin(rot) * sq, Math.cos(rot));
      out.push({ x, y, a, b, rot });
    }
  }
  return out;
}

// Scale so the outermost ink, over the whole cycle, lands on the 1% margin.
const fits = new Map();
function fit(form, dir) {
  const key = form + dir;
  if (!fits.has(key)) {
    let mx = 0;
    for (let f = 0; f < 512; f++) for (const o of tokens(FORMS[form], travel(f / 512, 'flow'), dir)) {
      const c = Math.cos(o.rot), s = Math.sin(o.rot);
      mx = Math.max(mx, o.x + Math.hypot(o.a * c, o.b * s), o.y + Math.hypot(o.a * s, o.b * c));
    }
    fits.set(key, 0.996 / mx);
  }
  return fits.get(key);
}

// ── Glyph ──
// The e's ink box (measured, not the em box) is stretched to fill the ellipse less an even gap, the same
// on every side: a share of the short semi-axis plus half the stroke.
const metricCtx = document.createElement('canvas').getContext('2d');
let box = null;
function glyphBox() {
  if (!box) {
    metricCtx.font = `${WEIGHT} 200px ${FAMILY}`;
    const mm = metricCtx.measureText(GLYPHS);
    const l = mm.actualBoundingBoxLeft, r = mm.actualBoundingBoxRight, as = mm.actualBoundingBoxAscent, de = mm.actualBoundingBoxDescent;
    box = { w: Math.max(1, l + r), h: Math.max(1, as + de), cx: (r - l) / 2, cy: (de - as) / 2 };
  }
  return box;
}

function drawToken(c, o, ink, px) {
  c.save();
  c.translate(o.x, o.y);
  c.rotate(o.rot);
  const lw = state.stroke * Math.min(o.b * 0.3, Math.max(0.8 / px, Math.min(o.b * 0.11, (4.6 / 1080) * 2)));
  c.beginPath();
  c.ellipse(0, 0, o.a, o.b, 0, 0, Math.PI * 2);
  c.fillStyle = ink.fill;
  c.fill();
  if (lw > 0) { c.lineWidth = lw; c.strokeStyle = ink.line; c.stroke(); }
  if (o.b * px >= 0.4) {
    const p = state.pad * o.b + lw / 2, m = glyphBox(), W = 2 * (o.a - p), H = 2 * (o.b - p);
    if (W > 0 && H > 0) {
      c.scale(W / m.w, H / m.h);
      c.font = `${WEIGHT} 200px ${FAMILY}`;
      c.fillStyle = ink.line;
      c.textBaseline = 'alphabetic';
      c.textAlign = 'left';
      c.fillText(GLYPHS, -m.cx, -m.cy);
    }
  }
  c.restore();
}

// ── Render ──
// Only the token layout is reflected or turned, never the glyphs. Mirror forms fold every e's rotation
// into −90…90°, so each reads left to right; turned forms keep one representative per quarter turn.
// Tokens on an axis are drawn once, whole.
// c is already scaled to a logical SIDE × SIDE square.
function render(c, t) {
  const p = FORMS[state.form], ink = MODES[state.mode], turn = p.sym === 'turn', E = 1e-7;
  const half = SIDE / 2, scale = (half - MARGIN) * fit(state.form, state.dir);
  const base = tokens(p, travel(t, state.motion), state.dir).filter((o) => {
    if (turn) { const al = Math.atan2(o.y, o.x); return al >= -E && al < HP - E; }
    return o.x >= -E && o.y >= -E;
  });
  const px = scale * c.getTransform().a, seen = new Set(); // device pixels per quadrant unit
  c.save();
  c.fillStyle = ink.ground;
  c.fillRect(0, 0, SIDE, SIDE);
  c.translate(half, half);
  c.scale(scale, scale);
  for (let qd = 0; qd < 4; qd++) for (const o of base) {
    let x, y, rot;
    if (turn) {
      const cs = Math.cos(qd * HP), sn = Math.sin(qd * HP);
      x = o.x * cs - o.y * sn; y = o.x * sn + o.y * cs; rot = o.rot + qd * HP;
    } else {
      const sx = qd & 1 ? -1 : 1, sy = qd & 2 ? -1 : 1;
      x = o.x * sx; y = o.y * sy; rot = Math.atan2(Math.sin(o.rot) * sy, Math.cos(o.rot) * sx);
      if (rot > HP + E) rot -= Math.PI; else if (rot <= -HP + E) rot += Math.PI;
    }
    const key = `${Math.round(x * 1e5)},${Math.round(y * 1e5)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    drawToken(c, { x, y, a: o.a, b: o.b, rot }, ink, px);
  }
  c.restore();
}

// ── State ──
const state = { form: 'whirl', dir: 'counter', motion: 'flow', speed: '2', mode: 'light', stroke: 0.3, pad: 0.26 };

// ── Page ──
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.setAttribute('role', 'img');
canvas.setAttribute('aria-label', 'Lowercase e’s stretched into ellipses, flowing out from a centre eye, the pattern mirrored in four quadrants');
stage.append(canvas);
const ctx = canvas.getContext('2d');
function size() {
  const W = canvas.clientWidth;
  if (!W) return false;
  const dpr = Math.min(devicePixelRatio || 1, 2), px = Math.round(W * dpr);
  if (canvas.width !== px) canvas.width = canvas.height = px;
  ctx.setTransform(px / SIDE, 0, 0, px / SIDE, 0, 0);
  return true;
}

let playing = !reduced && !thumb, clock = 0, last = performance.now();
const phase = () => (state.motion === 'still' ? 0 : ((clock * +state.speed) / LOOP) % 1);
const draw = () => size() && render(ctx, phase());
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (playing) clock = (clock + dt) % LOOP; // LOOP is a whole number of cycles at every speed
  draw();
}

await fontsReady(`${WEIGHT} 100px "Atkinson Hyperlegible Next Variable"`);
box = null;
panel.ground(MODES[state.mode].ground);
draw();
if (thumb) document.documentElement.dataset.rendered = String(Date.now());
else requestAnimationFrame(loop);
new ResizeObserver(draw).observe(stage);

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  if (e.key === ' ') { e.preventDefault(); playing = !playing; controls.set?.('play', playing ? 'play' : 'pause'); }
});

// ── Share ──
const EXPORT = 2160;
function still() {
  const c = document.createElement('canvas');
  c.width = c.height = EXPORT;
  const x = c.getContext('2d');
  x.setTransform(EXPORT / SIDE, 0, 0, EXPORT / SIDE, 0, 0);
  render(x, phase());
  return new Promise((res) => c.toBlob(res, 'image/png'));
}
panel.share({
  caption: () => [
    'Lowercase e’s, stretched into ellipses and mirrored four ways.',
    '',
    'Each e is stretched to fill an ellipse that flows along a spoke out of the centre, growing from nothing as it leaves the eye. One quadrant is drawn from a rule and its layout reflected into the other three, but no glyph is ever mirrored. The set varies the spokes: a whirl, petals, a lens, an inhale and counterflow.',
    '',
    'Type: Atkinson Hyperlegible Next by @brailleinstitute',
    'Made with: Canvas 2D',
  ].join('\n'),
  note: `${EXPORT} px png, the frame on screen`,
  exportImage: async () => ({ blob: await still(), name: `mirror-ellipses-${state.form}-${state.mode}.png` }),
});

const x1 = (v) => ({ value: v, label: { 1: 'Slow', 2: 'Normal', 4: 'Fast' }[v] });
const controls = panel.controls(
  [
    { key: 'form', label: 'Form', value: state.form, options: Object.entries(FORMS).map(([value, f]) => ({ value, label: f.name })) },
    { key: 'dir', label: 'Direction', value: state.dir, options: [{ value: 'normal', label: 'Normal' }, { value: 'counter', label: 'Counterflow' }] },
    { key: 'motion', label: 'Motion', value: state.motion, options: ['flow', 'glide', 'still'] },
    { key: 'speed', label: 'Speed', value: state.speed, options: ['1', '2', '4'].map(x1) },
    { key: 'mode', label: 'Mode', value: state.mode, options: [{ value: 'light', swatch: [MODES.light.ground, MODES.light.fill, MODES.light.line] }, { value: 'dark', swatch: [MODES.dark.ground, MODES.dark.line] }] },
    { key: 'stroke', label: 'Stroke', value: String(state.stroke), options: [{ value: '0', label: 'None' }, { value: '0.3', label: 'Thin' }, { value: '1', label: 'Regular' }] },
    { key: 'pad', label: 'Padding', value: String(state.pad), options: [{ value: '0.12', label: 'Tight' }, { value: '0.26', label: 'Even' }, { value: '0.42', label: 'Loose' }] },
    { key: 'play', label: 'Play', value: playing ? 'play' : 'pause', options: ['play', 'pause'] },
  ],
  (key, value) => {
    if (key === 'play') { playing = value === 'play'; return; }
    state[key] = key === 'stroke' || key === 'pad' ? +value : value;
    if (key === 'mode') panel.ground(MODES[value].ground);
    draw();
  },
);

// G: the stroke and padding as continuous sliders.
gui.add(state, 'stroke', 0, 2, 0.05).name('Stroke').onChange(draw);
gui.add(state, 'pad', 0, 0.6, 0.01).name('Padding').onChange(draw);
