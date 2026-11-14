// Flowers grown from their names. The name is spelled several times over, every letter its own
// point, and read as one loop (the last letter leads back to the first), so the arrows joining
// the letters draw the flower. The points are placed by a growth rule rather than a perfect
// ring, each with a little noise in its angle, its distance from the middle and its arrow's
// bend, so no two petals are quite alike:
//
//   spiral   each step crosses nearly to the far side and drifts a little round, each letter a
//            little further out than the last; the petals wind out from the middle, shortest
//            first.
//   layers   one ring per spelling, each smaller, turned and tilted a little from the one
//            outside it; within a ring each step crosses nearly to the far side, so every ring
//            makes its own set of petals and the inner ones sit inside the outer.
//   ripple   one ring of every letter, its edge rippled; each step crosses nearly to the far side.
//
// Every step goes round the far way and bends toward the middle, so its arrow sweeps past the
// centre as one side of a petal. How far round a step jumps is worked out from the bend, so the
// bowed arrow passes the middle at `eye` (a fraction of the flower's radius): 0 through the
// middle, larger for a flower with an open disc. Each arrow's own bend varies, so each passes
// a little nearer or further and the centre stays uneven.
//
// Pure geometry, deterministic for a seed. Used by the review page and scripts/flower-web.mjs.

/** The share of a turn a step jumps so an arrow bowed by `bend` degrees passes `eye` from the middle. */
export function jumpFor(bend, eye) {
  const t = Math.tan((bend * Math.PI) / 360);
  return (Math.acos(Math.min(1, eye / Math.sqrt(1 + t * t))) - Math.atan(t)) / Math.PI;
}

export const FLOWERS = [
  { id: 'sunflower', spaced: { k: 2, way: -1, bend: 72 }, first: { k: 4, way: -1, bend: 40 }, seed: 5, name: 'Sunflower', form: 'spiral', eye: 0.26, repeats: 4, bend: 30, colors: [[0, '#9a3f0c'], [0.35, '#c95a10'], [0.65, '#ff9a00'], [1, '#ffd600']], about: 'Helianthus annuus. Golden rays round a brown disc.' },
  { id: 'marigold', spaced: { k: 3, way: -1, bend: 68 }, first: { k: 3, way: -1, bend: 40 }, seed: 3, name: 'Marigold', form: 'ripple', eye: 0.05, repeats: 4, ripple: [0.2, 7], bend: 32, colors: [[0, '#c0300c'], [0.45, '#ff5a00'], [1, '#ffa800']], about: 'Tagetes. Ruffled orange heads, deeper at the heart.' },
  { id: 'columbine', spaced: { k: 4, way: -1, bend: 45 }, first: { k: 4, way: -1, bend: 40 }, seed: 6, name: 'Columbine', form: 'layers', eye: 0.1, repeats: 3, bend: 40, colors: [[0, '#ffe14d'], [0.3, '#ffffff'], [0.62, '#8a8cff'], [1, '#4b3dff']], about: 'Aquilegia. Blue-violet spurs round a white and yellow cup.' },
  { id: 'daisy', spaced: { k: 2, way: -1, bend: 55 }, first: { k: 2, way: -1, bend: 40 }, seed: 5, name: 'Daisy', form: 'ripple', eye: 0.17, repeats: 4, ripple: [0.1, 3], bend: 34, colors: [[0, '#ffc400'], [0.32, '#ffffff'], [0.78, '#ffffff'], [1, '#ff8fb8']], about: 'Bellis perennis. White rays, pink at the tips, round a yellow eye.' },
  { id: 'lotus', spaced: { k: 2, way: -1, bend: 64 }, first: { k: 2, way: -1, bend: 58 }, seed: 6, name: 'Lotus', form: 'layers', eye: 0.04, repeats: 3, bend: 52, colors: [[0, '#ffd84a'], [0.45, '#fff0f6'], [1, '#ff3d8b']], about: 'Nelumbo nucifera. Pink petals, paler inside, round a gold seed head.' },
  { id: 'clematis', spaced: { k: 3, way: -1, bend: 23 }, first: { k: 3, way: -1, bend: 22 }, seed: 1, name: 'Clematis', form: 'ripple', eye: 0.08, repeats: 3, ripple: [0.14, 4], bend: 26, colors: [[0, '#fff3a0'], [0.3, '#eadcff'], [0.62, '#a06bff'], [1, '#6b2bd9']], about: 'Clematis. Violet star-shaped flowers round a cream crown of stamens.' },
  { id: 'cornflower', spaced: { k: 3, way: -1, bend: 16 }, first: { k: 3, way: -1, bend: 22 }, seed: 3, name: 'Cornflower', form: 'ripple', eye: 0.02, repeats: 3, ripple: [0.22, 9], bend: 22, colors: [[0, '#7a2be0'], [0.45, '#2c4bff'], [1, '#3a8aff']], about: 'Centaurea cyanus. The bluest of field flowers, violet at the center.' },
  { id: 'chrysanthemum', spaced: { k: 3, way: -1, bend: 49 }, first: { k: 6, way: -1, bend: 40 }, seed: 1, name: 'Chrysanthemum', form: 'layers', eye: 0.14, repeats: 3, bend: 44, colors: [[0, '#ffe066'], [0.4, '#ff6fa8'], [1, '#c4126b']], about: 'Chrysanthemum. Layer on layer of magenta petals round a gold heart.' },
];

function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const TAU = Math.PI * 2;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/**
 * The ring: the name spelled once round one perfect ring, every letter its own point,
 * each step jumping `k` places (`way` -1 goes round the far way, so the arrows cross back
 * toward the middle), every arrow bent by `bend` degrees. An exact star polygon {n/k}.
 */
//
// `first` is the first pick of each flower; `spaced` the pick after measuring how evenly its
// lines are spaced (lines running close and near-parallel, crossings bunched together, near a
// letter or at shallow angles, many lines through one spot), searched over every jump, both
// ways round and every bend from 10° to 70°, then chosen by eye among the best.
export function ring(f, { k, way, bend } = f.spaced) {
  const path = [...f.name.toUpperCase()].filter((c) => /[A-Z]/.test(c));
  const n = path.length;
  const keys = path.map((l, i) => `${l}${i}`);
  const step = (((way * k) % n) + n) % n;
  const pos = Object.fromEntries(keys.map((key, i) => {
    const a = -Math.PI / 2 + (((i * step) % n) * TAU) / n;
    return [key, [Math.round(540 + 400 * Math.cos(a)), Math.round(540 + 400 * Math.sin(a))]];
  }));
  const edges = keys.map((key, i) => [key, keys[(i + 1) % n], bend]);
  const labels = Object.fromEntries(keys.map((key, i) => [key, path[i]]));
  return { ...f, form: 'ring', k, way, bend, repeats: 1, text: f.name, letters: keys, labels, edges, path: keys, pos };
}

/** The flower `f` grown from `seed`: points, arrows (each with its own bend), path, colours. */
export function grow(f, seed = f.seed ?? 1) {
  const rng = random(seed * 7919 + f.name.length);
  const noise = (amp) => (rng() * 2 - 1) * amp;
  const word = [...f.name.toUpperCase()].filter((c) => /[A-Z]/.test(c));
  const path = Array.from({ length: f.repeats }, () => word).flat();
  const n = path.length, len = word.length;
  const keys = path.map((l, i) => `${l}${i}`);
  const R = 470;
  const at = []; // [angle, radius 0–1] per point
  const turn = noise(Math.PI);

  if (f.form === 'spiral') {
    // Each step the far way round, plus one whole extra turn over the name, so the letters fill
    // the ring as they move out.
    const step = TAU * (1 - jumpFor(f.bend, f.eye)) + TAU / n;
    for (let i = 0; i < n; i++) at.push([turn + i * step + noise(0.06), 0.42 + 0.58 * ((i + 0.5) / n) ** 0.8 + noise(0.03)]);
  } else if (f.form === 'layers') {
    // Ring j: the j-th spelling, outermost first. Each ring smaller, turned half a petal (give
    // or take) from the one outside it, and a little off round.
    let k = len - Math.max(1, Math.round(jumpFor(f.bend, f.eye) * len));
    while (gcd(len, k) !== 1) k--;
    for (let j = 0; j < f.repeats; j++) {
      const r = 1 - (j * 0.62) / Math.max(1, f.repeats - 1) * (1 - 0.3) + noise(0.03);
      const off = turn + j * (Math.PI / len) * (1 + noise(0.35));
      const tilt = noise(0.06), tiltAt = rng() * TAU;
      for (let m = 0; m < len; m++) {
        const a = off + (((m * k) % len) * TAU) / len + noise(0.07);
        at.push([a, r * (1 + tilt * Math.cos(a - tiltAt)) + noise(0.025)]);
      }
    }
  } else {
    // ripple: every point on one ring, the name jumping about `jump` of the way round each step.
    let k = n - Math.max(1, Math.round(jumpFor(f.bend, f.eye) * n));
    while (gcd(n, k) !== 1) k--;
    const [amp, waves] = f.ripple, phase = rng() * TAU;
    for (let i = 0; i < n; i++) {
      const a = turn + (((i * k) % n) * TAU) / n + noise(0.05);
      at.push([a, 1 - amp * (0.5 + 0.5 * Math.sin(waves * a + phase)) + noise(0.04)]);
    }
  }

  let pos = at.map(([a, r]) => [540 + R * r * Math.cos(a), 540 + R * r * Math.sin(a)]);
  // Room for every letter: push apart any two closer than a letter's clearing allows.
  const MIN = 92;
  for (let it = 0; it < 80; it++) {
    let moved = false;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const dx = pos[j][0] - pos[i][0], dy = pos[j][1] - pos[i][1], d = Math.hypot(dx, dy) || 1;
        if (d >= MIN) continue;
        const push = (MIN - d) / 2 + 0.5;
        pos[i] = [pos[i][0] - (dx / d) * push, pos[i][1] - (dy / d) * push];
        pos[j] = [pos[j][0] + (dx / d) * push, pos[j][1] + (dy / d) * push];
        moved = true;
      }
    if (!moved) break;
  }
  pos = Object.fromEntries(keys.map((key, i) => [key, pos[i].map((v) => Math.round(v))]));
  // Every arrow its own bend, around the flower's.
  const edges = keys.map((key, i) => [key, keys[(i + 1) % n], Math.round(f.bend * (1 + noise(0.35)))]);
  const labels = Object.fromEntries(keys.map((key, i) => [key, path[i]]));
  return { ...f, seed, text: f.name, letters: keys, labels, edges, path: keys, pos };
}
