// 9 Torus numbers. A grid of squares wrapped onto a horn torus, ten rows of sixteen, one warm ink a row.
// Every square counts 0 to 9 and round again, starting on a different digit from its neighbours,
// while the rows roll up the tube a square a beat and the torus turns. Each digit's outline is
// warped through the surface, point by point, not pasted on flat.
import { create } from 'fontkit';
import flexUrl from '@fontsource-variable/roboto-flex/files/roboto-flex-latin-full-normal.woff2?url';
import { shell } from '../../src/shell.js';
import { trialFiles } from '../../src/glyphs.js';

const { thumb, panel, reduced } = shell('torus-numbers', { viewer: true });

// ── Type ──
// PP Neue Corp Extended Medium when it's in fonts/trial (never bundled: free for personal use only),
// else Roboto Flex at its widest. Digits are read once and flattened to polygons, centred on their
// own ink, in units of the figure height, y up.
async function loadDigits() {
  const corp = trialFiles().find((f) => /PPNeueCorp-ExtendedMedium/i.test(f.name));
  for (const src of [corp && { url: corp.url, name: 'PP Neue Corp Extended Medium' }, { url: flexUrl, name: 'Roboto Flex', axes: { wdth: 151, wght: 560 } }]) {
    if (!src) continue;
    try {
      const res = await fetch(src.url);
      if (!res.ok) continue;
      let font = create(new Uint8Array(await res.arrayBuffer()));
      if (src.axes) font = font.getVariation(src.axes);
      return { ...sample(font), name: src.name };
    } catch {}
  }
  throw new Error('No typeface for the digits');
}
function sample(font) {
  const N = 8, glyphs = [...'0123456789'].map((c) => font.glyphForCodePoint(c.codePointAt(0)));
  const zero = glyphs[0].bbox, H = zero.maxY - zero.minY, cy = (zero.minY + zero.maxY) / 2;
  let maxW = 0;
  const g = glyphs.map((gl) => {
    const b = gl.bbox, cx = (b.minX + b.maxX) / 2;
    maxW = Math.max(maxW, b.maxX - b.minX);
    const contours = [];
    let cur = null, px = 0, py = 0;
    const P = (x, y) => cur.push((x - cx) / H, (y - cy) / H);
    for (const { command, args } of gl.path.commands) {
      if (command === 'moveTo') { cur = []; contours.push(cur); P(args[0], args[1]); px = args[0]; py = args[1]; }
      else if (command === 'lineTo') { P(args[0], args[1]); px = args[0]; py = args[1]; }
      else if (command === 'quadraticCurveTo') {
        const [x1, y1, x, y] = args;
        for (let i = 1; i <= N; i++) { const t = i / N, a = (1 - t) ** 2, m = 2 * (1 - t) * t, z = t * t; P(a * px + m * x1 + z * x, a * py + m * y1 + z * y); }
        px = x; py = y;
      } else if (command === 'bezierCurveTo') {
        const [x1, y1, x2, y2, x, y] = args;
        for (let i = 1; i <= N; i++) { const t = i / N, a = (1 - t) ** 3, m = 3 * (1 - t) ** 2 * t, n = 3 * (1 - t) * t * t, z = t ** 3; P(a * px + m * x1 + n * x2 + z * x, a * py + m * y1 + n * y2 + z * y); }
        px = x; py = y;
      }
    }
    return contours.filter((c) => c.length >= 6);
  });
  return { w: maxW / H, g };
}

// ── Helpers ──
const quint = (x) => (x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const mod = (a, n) => ((a % n) + n) % n;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// Warm loop: salmon → pink → red → orange → back, at a similar lightness, so the last row meets the first.
const warm = (n) => {
  const stops = [[0.79, 0.15, 25], [0.8, 0.15, 352], [0.67, 0.2, 27], [0.81, 0.16, 62]]; // OKLCH
  return Array.from({ length: n }, (_, j) => {
    const x = (j / n) * stops.length, i = Math.floor(x), f = x - i;
    const A = stops[i], B = stops[(i + 1) % stops.length];
    let dh = B[2] - A[2];
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    return `oklch(${(A[0] + (B[0] - A[0]) * f).toFixed(3)} ${(A[1] + (B[1] - A[1]) * f).toFixed(3)} ${((A[2] + dh * f + 360) % 360).toFixed(1)})`;
  });
};

// ── The piece ──
const SIDE = 1080, MARGIN = SIDE * 0.01, D = 9; // logical size, 1% margin, camera distance
// At rest the torus sits at the isometric angle: its axis upright, seen from 35.26° above.
const ROWS = 10, R = 1, r = 1, TILT = Math.atan(1 / Math.SQRT2);
const COLS = Math.round(ROWS * (R + 0.55 * r) / r);
const du = (2 * Math.PI) / COLS, dv = (2 * Math.PI) / ROWS;
const INKS = warm(ROWS), GROUND = '#ffffff', DIGIT = '#000000';
const PAD = 0.19, GAP = 0.026; // hairline gaps, about a fifth of the digits' horizontal bars
const BEAT = 1.1; // seconds per beat at row speed 1×
const ROLL_MOVE = 0.56, DIGIT_MOVE = 0.45; // share of a beat spent moving
const TURN = 48, BOTH_YAW = 48, BOTH_PITCH = 72; // seconds per full turn at turn speed 1×
const SPIN = 0.25; // squares a second round the torus's own axis while turning 360
const SETTLE = 1.1; // seconds to ease back to rest

// One size for every orientation: fit the bounding sphere, so the torus never pumps as it turns.
const RHO = R + r, K = ((SIDE / 2 - MARGIN) * Math.sqrt(D * D - RHO * RHO)) / RHO, CX = SIDE / 2, CY = SIDE / 2;

const state = { digits: 'odometer', turn: 'sideways', turnSpeed: '1', rowSpeed: '1' };
const st = { beat: 0, yaw: 0, pitch: 0, spin: 0 };
let GLYPH = null;

const hash = (i, j) => ((Math.imul(i * 73 + j * 151 + 7, 2654435761) >>> 0) % 1000) / 1000;
function delay(i, j) { // in beats
  if (state.digits === 'cascade') return hash(i, j);
  if (state.digits === 'wave' || state.digits === 'flip') return mod(i + j, 10) * 0.064;
  return 0;
}
// [digit, next digit, progress 0–1]
function digitState(i, j, beat) {
  const tl = beat - delay(i, j), n = Math.floor(tl), f = clamp01((tl - n) / DIGIT_MOVE);
  const base = (3 * i + 7 * j) % 10; // neighbours start on different digits
  return [mod(base + n, 10), mod(base + n + 1, 10), f];
}

const M = new Float64Array(9), P = [0, 0], E = 8, STRIPS = 12;
const cells = [];
function setOrientation(yaw, pitch) {
  // M = Rz(yaw) · Rx(TILT + pitch): model → camera (camera on −y, z up the screen)
  const p = TILT + pitch, cp = Math.cos(p), sp = Math.sin(p), cw = Math.cos(yaw), sw = Math.sin(yaw);
  M[0] = cw; M[1] = -sw * cp; M[2] = sw * sp;
  M[3] = sw; M[4] = cw * cp; M[5] = -cw * sp;
  M[6] = 0; M[7] = sp; M[8] = cp;
}
// How squarely the surface at (u, v) faces the camera: 1 square-on, 0 edge-on, below 0 facing away.
function facingAt(u, v) {
  const cu = Math.cos(u), su = Math.sin(u), cv = Math.cos(v), sv = Math.sin(v), q = R + r * cv;
  const mx = q * cu, my = q * su, mz = r * sv, ax = cv * cu, ay = cv * su, az = sv;
  const px = M[0] * mx + M[1] * my + M[2] * mz, py = M[3] * mx + M[4] * my + M[5] * mz + D, pz = M[6] * mx + M[7] * my + M[8] * mz;
  const nx = M[0] * ax + M[1] * ay + M[2] * az, ny = M[3] * ax + M[4] * ay + M[5] * az, nz = M[6] * ax + M[7] * ay + M[8] * az;
  return -(nx * px + ny * py + nz * pz) / Math.hypot(px, py, pz);
}
function proj(u, v, out) {
  const q = R + r * Math.cos(v), x = q * Math.cos(u), y = q * Math.sin(u), z = r * Math.sin(v);
  const X = M[0] * x + M[1] * y + M[2] * z, Y = M[3] * x + M[4] * y + M[5] * z, Z = M[6] * x + M[7] * y + M[8] * z;
  const s = K / (Y + D);
  out[0] = CX + X * s;
  out[1] = CY - Z * s;
}
// Sutherland–Hodgman against one horizontal line, in cell units.
function half(pts, keep, edge) {
  const out = [];
  for (let i = 0; i < pts.length; i += 2) {
    const ax = pts[i], ay = pts[i + 1], j = (i + 2) % pts.length, bx = pts[j], by = pts[j + 1];
    const ina = keep(ay), inb = keep(by);
    if (ina) out.push(ax, ay);
    if (ina !== inb) { const f = (edge - ay) / (by - ay); out.push(ax + (bx - ax) * f, edge); }
  }
  return out;
}

function render(ctx, s) {
  setOrientation(s.yaw, s.pitch);
  const spin = s.spin;
  const n = Math.floor(s.beat), roll = n + quint(clamp01((s.beat - n) / ROLL_MOVE));
  ctx.fillStyle = GROUND;
  ctx.fillRect(0, 0, SIDE, SIDE);

  cells.length = 0;
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    const uc = (i + spin + 0.5) * du, vc = (j + roll + 0.5) * dv;
    const q = R + r * Math.cos(vc);
    const x = q * Math.cos(uc), y = q * Math.sin(uc), z = r * Math.sin(vc);
    const X = M[0] * x + M[1] * y + M[2] * z, Y = M[3] * x + M[4] * y + M[5] * z + D, Z = M[6] * x + M[7] * y + M[8] * z;
    cells.push({ i, j, depth: Math.hypot(X, Y, Z), q: Math.max(q, 0.02), facing: facingAt(uc, vc) });
  }
  // Back faces first: on a closed surface each lies behind a front face, so they only show at the
  // outline, filling it out where a front cell turns away. Then the front faces, far to near.
  cells.sort((a, b) => (a.facing >= 0) - (b.facing >= 0) || b.depth - a.depth);

  const quad = (ua, us, va, vs) => {
    ctx.beginPath();
    for (let e = 0; e < 4 * E; e++) {
      const side = Math.floor(e / E), f = (e % E) / E;
      const a = side === 0 ? f : side === 1 ? 1 : side === 2 ? 1 - f : 0;
      const b = side === 0 ? 0 : side === 1 ? f : side === 2 ? 1 : 1 - f;
      proj(ua + a * us, va + b * vs, P);
      e ? ctx.lineTo(P[0], P[1]) : ctx.moveTo(P[0], P[1]);
    }
    ctx.closePath();
  };
  // A digit in this cell, shifted up by `sh` cells and squashed vertically by `sq`. A shifted digit is
  // clipped to its square on the surface itself, not on screen, so the part rolling out can never
  // fold back into view where the surface curves away.
  const glyph = (d, u0, v0, ku, kv, sh, sq) => {
    for (const ct of GLYPH.g[d]) {
      let pts = new Array(ct.length);
      for (let p = 0; p < ct.length; p += 2) { pts[p] = 0.5 + ct[p] * ku; pts[p + 1] = 0.5 + sh + ct[p + 1] * kv * sq; }
      if (sh !== 0) { pts = half(pts, (t) => t >= 0, 0); if (pts.length) pts = half(pts, (t) => t <= 1, 1); }
      if (pts.length < 6) continue;
      for (let p = 0; p < pts.length; p += 2) {
        proj(u0 + pts[p] * du, v0 + pts[p + 1] * dv, P);
        p ? ctx.lineTo(P[0], P[1]) : ctx.moveTo(P[0], P[1]);
      }
      ctx.closePath();
    }
  };

  ctx.lineJoin = 'round';
  for (const c of cells) {
    const u0 = (c.i + spin) * du, v0 = (c.j + roll) * dv, ink = INKS[c.j];
    // Near the outline a cell folds over itself, and one fill of a folded shape cancels where its two
    // layers overlap. So cells near the outline are filled as thin strips, each its own fill.
    const strips = () => {
      ctx.fillStyle = ctx.strokeStyle = ink;
      ctx.lineWidth = 0.8;
      for (let e = 0; e < STRIPS; e++) { quad(u0, du, v0 + (e * dv) / STRIPS, dv / STRIPS); ctx.fill(); ctx.stroke(); }
    };
    if (c.facing < 0) { strips(); continue; }

    const lenU = c.q * du, lenV = r * dv;
    let kv = 1 - 2 * PAD, ku = (kv * lenV) / lenU;
    if (GLYPH.w * ku > 1 - 2 * PAD) { const f = (1 - 2 * PAD) / (GLYPH.w * ku); ku *= f; kv *= f; }

    // The whole cell in its ink, then its outline as a hairline in the ground colour. A later
    // neighbour's fill covers half of an earlier stroke, and its own stroke redraws the full width.
    if (c.facing < 0.4) strips();
    else { quad(u0, du, v0, dv); ctx.fillStyle = ink; ctx.fill(); }
    quad(u0, du, v0, dv);
    ctx.strokeStyle = GROUND;
    ctx.lineWidth = Math.max(0.7, (GAP * kv * lenV * K) / c.depth);
    ctx.stroke();

    // Fade the digit by the worst-facing point of the box it fills, so no part of an outline is drawn
    // where the surface turns away and the digit would fold over on itself.
    const hu = 0.5 * GLYPH.w * ku, hv = 0.5 * kv;
    const ua = u0 + (0.5 - hu) * du, ub = u0 + (0.5 + hu) * du, um = u0 + 0.5 * du;
    const va = v0 + (0.5 - hv) * dv, vb = v0 + (0.5 + hv) * dv;
    const worst = Math.min(facingAt(ua, va), facingAt(ub, va), facingAt(ua, vb), facingAt(ub, vb), facingAt(um, va), facingAt(um, vb));
    const a = smooth(0.02, 0.16, worst) * smooth(0.04, 0.2, c.facing);
    if (a <= 0.003) continue;

    const [d0, d1, f] = digitState(c.i, c.j, s.beat);
    ctx.globalAlpha = a;
    ctx.fillStyle = DIGIT;
    ctx.beginPath();
    if (f <= 0 || f >= 1) glyph(f >= 1 ? d1 : d0, u0, v0, ku, kv, 0, 1);
    else if (state.digits === 'flip') {
      const e = quint(f);
      glyph(e < 0.5 ? d0 : d1, u0, v0, ku, kv, 0, Math.max(0.02, Math.abs(Math.cos(Math.PI * e))));
    } else { // roll: the old digit leaves upward and the new one arrives from below
      const e = quint(f);
      glyph(d0, u0, v0, ku, kv, e, 1);
      glyph(d1, u0, v0, ku, kv, e - 1, 1);
    }
    ctx.fill('evenodd');
    ctx.globalAlpha = 1;
  }
}

// ── Turning ──
// Sideways turns the torus about its own upright axis, like a turntable; Over turns it about the
// screen's horizontal axis, end over end. Both keep the view straight, so choosing one first eases the
// torus back to the isometric rest angle. 360 adds a turn about the screen's vertical axis and carries
// on from wherever the torus is. Off eases back to rest and holds.
let settle = null; // { yaw, pitch, t }
let ramp = 1; // 0 → 1: turning speeds back up after settling, so it never jerks
function toRest() { settle = { yaw: wrap(st.yaw), pitch: wrap(st.pitch), t: 0 }; ramp = 0; }
function step(dt) {
  st.beat += (dt * +state.rowSpeed) / BEAT;
  if (settle) {
    settle.t += dt;
    const e = quint(clamp01(settle.t / SETTLE));
    st.yaw = settle.yaw * (1 - e);
    st.pitch = settle.pitch * (1 - e);
    if (settle.t >= SETTLE) settle = null;
    return;
  }
  if (state.turn === 'off') return;
  ramp = Math.min(1, ramp + dt / 1.2);
  const k = +state.turnSpeed * 2 * Math.PI * smooth(0, 1, ramp) * dt;
  if (state.turn === 'sideways') st.spin += ((k / TURN) * COLS) / (2 * Math.PI);
  if (state.turn === 'over') st.pitch += k / TURN;
  if (state.turn === '360') { st.yaw += k / BOTH_YAW; st.pitch += k / BOTH_PITCH; st.spin += (k / (2 * Math.PI)) * SPIN; }
}

// ── Page ──
const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.setAttribute('role', 'img');
canvas.setAttribute('aria-label', 'Squares on a turning torus, one warm colour a row, each counting 0 to 9');
stage.append(canvas);
const ctx = canvas.getContext('2d');
function fit() {
  const W = canvas.clientWidth;
  if (!W) return false;
  const dpr = Math.min(devicePixelRatio || 1, 2), px = Math.round(W * dpr);
  if (canvas.width !== px) canvas.width = canvas.height = px;
  ctx.setTransform(px / SIDE, 0, 0, px / SIDE, 0, 0);
  return true;
}
const draw = () => GLYPH && fit() && render(ctx, st);

let playing = !reduced && !thumb, last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (playing) step(dt);
  draw();
}

GLYPH = await loadDigits();
panel.details([['Typeface', GLYPH.name], ['Grid', `${ROWS} rows of ${COLS} squares`]]);
draw();
if (thumb) document.documentElement.dataset.rendered = String(Date.now());
else requestAnimationFrame(loop);
new ResizeObserver(draw).observe(stage);

addEventListener('keydown', (e) => {
  if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  if (e.key === ' ') { e.preventDefault(); playing = !playing; controls.set?.('motion', playing ? 'play' : 'pause'); }
});

// ── Share ──
const EXPORT = 2160;
function still() {
  const c = document.createElement('canvas');
  c.width = c.height = EXPORT;
  const x = c.getContext('2d');
  x.setTransform(EXPORT / SIDE, 0, 0, EXPORT / SIDE, 0, 0);
  render(x, st);
  return new Promise((res) => c.toBlob(res, 'image/png'));
}
panel.share({
  caption: () => [
    'Squares on a torus, counting.',
    '',
    'A grid of squares wrapped onto a horn torus, one warm colour a row. Every square counts 0 to 9 and round again while the rows roll up the tube a square a beat and the torus turns; each digit’s outline is warped through the surface.',
    '',
    GLYPH.name.startsWith('PP') ? 'Type: PP Neue Corp by @pangrampangram' : 'Type: Roboto Flex',
    'Made with: Canvas 2D',
  ].join('\n'),
  note: `${EXPORT} px png, the frame on screen`,
  exportImage: async () => ({ blob: await still(), name: `torus-numbers-${state.digits}.png` }),
});

const controls = panel.controls(
  [
    { key: 'digits', label: 'Digits', value: state.digits, options: ['odometer', 'wave', 'cascade', 'flip'] },
    { key: 'turn', label: 'Turn', value: state.turn, options: ['sideways', 'over', { value: '360', label: '360' }, 'off'] },
    { key: 'turnSpeed', label: 'Turn speed', value: state.turnSpeed, options: [{ value: '0.5', label: '½×' }, { value: '1', label: '1×' }, { value: '2', label: '2×' }, { value: '4', label: '4×' }] },
    { key: 'rowSpeed', label: 'Row speed', value: state.rowSpeed, options: [{ value: '0.5', label: '½×' }, { value: '1', label: '1×' }, { value: '2', label: '2×' }, { value: '3', label: '3×' }] },
    { key: 'motion', label: 'Motion', value: playing ? 'play' : 'pause', options: ['play', 'pause'] },
  ],
  (key, value) => {
    if (key === 'motion') { playing = value === 'play'; return; }
    state[key] = value;
    if (key === 'turn') { if (value === '360') ramp = 0; else toRest(); }
    draw();
  },
);
