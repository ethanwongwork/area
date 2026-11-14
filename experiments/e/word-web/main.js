// 3 Word Web. A long word spelled as a web of letters: every letter it uses is set once, and
// every time one letter follows another an arrow runs between them. Packets of color run the
// word's path all at once and never stop: each leaves its letter in that letter's color, turns
// into the next one's as it travels and fades back into the white web at both ends; the letter
// flares as it arrives and sends it on. Locked: Relay, Bloom, Buch, black ground, merging off,
// the arrows. Open: the word and its layout. Every layout is baked by scripts/place-web.mjs and
// kept only if its drawn lines pass e/word-web/clear.js: lines may cross but never overlap,
// cross shallowly or nearly touch, and no arrowhead sits against another line.
//
// The letters are drawn from a sheet made here, in the browser, from Söhne Mono when the trial
// is in fonts/trial (dev only), else from JetBrains Mono, so no trial glyphs are ever shipped.
import '@fontsource-variable/jetbrains-mono';
import { shell } from '../../src/shell.js';
import { stillWeb, Sheet, W, H } from './letters.js';
import placements from './placements.json';

const { thumb, panel, reduced } = shell('word-web', { viewer: true });
const q = new URLSearchParams(location.search);

const WORDS = placements.filter((p) => p.word && p.layouts?.length);
const WORD_LABELS = { pneumonoultramicroscopicsilicovolcanoconiosis: 'Pneumono…coniosis', hippopotomonstrosesquippedaliophobia: 'Hippopoto…phobia' };
const WEIGHTS = { buch: ['Buch', 400] };
const LAYOUTS = Math.max(...WORDS.map((p) => p.layouts.length));
const pickOf = (key, list, fallback) => (list.includes(q.get(key)) ? q.get(key) : fallback);
const state = {
  word: pickOf('word', WORDS.map((p) => p.id), 'pneumonoultramicroscopicsilicovolcanoconiosis'),
  layout: Math.max(1, Math.min(LAYOUTS, Number(q.get('layout') ?? 1) || 1)),
  motion: reduced ? 'still' : 'relay',
  color: 'bloom',
  weight: 'buch',
};

const stage = document.getElementById('stage');
const canvas = document.createElement('canvas');
canvas.className = 'poster';
canvas.style.setProperty('--ratio', W / H);
canvas.setAttribute('role', 'img');
stage.append(canvas);

// ── Letters ──
// The trial files the dev server registered; each weight is loaded under its own name.
const trialFiles = (document.querySelector('meta[name="trial-font-files"]')?.content ?? '').split(',').filter(Boolean);
async function familyFor(weight) {
  const [name] = WEIGHTS[weight];
  const url = trialFiles.find((u) => decodeURIComponent(u).normalize('NFC').endsWith(`Mono-${name}.otf`));
  if (url) {
    try {
      const face = new FontFace(`Word Web ${name}`, `url("${url}")`);
      await face.load();
      document.fonts.add(face);
      return { css: `"Word Web ${name}"`, weight: 400, name: `Söhne Mono ${name}` };
    } catch {}
  }
  await document.fonts.load(`${WEIGHTS[weight][1]} 128px "JetBrains Mono Variable"`);
  return { css: '"JetBrains Mono Variable"', weight: WEIGHTS[weight][1], name: 'JetBrains Mono' };
}

/** Capital letters set into one white sheet, with each glyph's place and the face's cap and stem. */
async function makeSheet(weight) {
  const fam = await familyFor(weight);
  const SIZE = 128, CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', pad = 3;
  const font = `${fam.weight} ${SIZE}px ${fam.css}`;
  const m = document.createElement('canvas').getContext('2d');
  m.font = font;
  const glyphs = {};
  let x = 0, top = 0, bottom = 0;
  for (const ch of CHARS) {
    const t = m.measureText(ch);
    const l = -t.actualBoundingBoxLeft, r = t.actualBoundingBoxRight, a = t.actualBoundingBoxAscent, d = t.actualBoundingBoxDescent;
    top = Math.max(top, a);
    bottom = Math.max(bottom, d);
    const w = Math.ceil(r - l) + pad * 2;
    glyphs[ch] = { x, w, l: l - pad, adv: t.width, a: a + pad, d: d + pad };
    x += w + 2;
  }
  const c = document.createElement('canvas');
  c.width = x;
  c.height = Math.ceil(top + bottom) + pad * 2;
  const g = c.getContext('2d');
  g.font = font;
  g.fillStyle = '#fff';
  const base = Math.ceil(top) + pad;
  for (const ch of CHARS) {
    const gl = glyphs[ch];
    g.fillText(ch, gl.x - gl.l, base);
    gl.y = base - gl.a;
    gl.h = Math.ceil(gl.a + gl.d);
  }
  const cap = m.measureText('H').actualBoundingBoxAscent;
  // Stem: the first run of ink across H, a third of the way down.
  const t = document.createElement('canvas');
  t.width = t.height = SIZE * 2;
  const tg = t.getContext('2d');
  tg.font = font;
  tg.fillStyle = '#fff';
  tg.fillText('H', SIZE * 0.25, SIZE * 1.5);
  const row = tg.getImageData(0, Math.round(SIZE * 1.5 - cap * 0.7), t.width, 1).data;
  let run = 0, stem = 0;
  for (let i = 0; i < t.width; i++) {
    const a = row[i * 4 + 3] / 255;
    if (a > 0.02) run += a;
    else if (run) {
      stem = run;
      break;
    }
  }
  const img = new Image();
  img.src = c.toDataURL('image/png');
  await img.decode();
  return { sheet: new Sheet({ size: SIZE, cap, stem, glyphs }, img), name: fam.name };
}
const sheets = {};
const sheetFor = (weight) => (sheets[weight] ??= makeSheet(weight));

// ── Relay ──
// The word's path as a loop of arrow steps, each timed by its length so packets move at one
// speed; at the end the packet waits a moment, then carries on from the first letter, so it
// loops with no restart. Packets ride it evenly spaced, about one every three steps.
const SPEED = 720, TAIL = 340, WAIT = 0.18, FLARE = 0.28;
function relayPath(p, web) {
  const steps = [];
  let t = 0;
  for (const sentence of p.text.match(/[^.?!]+[.?!]?/g) ?? []) {
    const ls = [...sentence.toUpperCase()].filter((ch) => /[A-Z]/.test(ch));
    ls.forEach((l, i) => {
      if (!i) return;
      const e = web.edges.find((x) => x.a.key === ls[i - 1] && x.b.key === l);
      const len = e.a === e.b ? 160 : Math.hypot(e.b.x - e.a.x, e.b.y - e.a.y);
      const d = Math.max(0.24, len / SPEED);
      steps.push({ e, t, d, tail: Math.min(0.9, TAIL / len) });
      t += d;
    });
    t += WAIT;
  }
  return { steps, period: t, every: t / Math.max(3, Math.round(steps.length / 3)) };
}
function relay(R, t) {
  const T = R.period, wrap = (v) => ((v % T) + T) % T;
  const comets = [], litNodes = new Map();
  const flare = (n, since) => {
    if (since > FLARE * 6) return;
    const a = Math.exp(-since / FLARE);
    if (a > (litNodes.get(n)?.a ?? 0)) litNodes.set(n, { a });
  };
  for (let k = 0; k * R.every < T - 1e-6; k++) {
    const tau = wrap(t - k * R.every); // where this packet's clock is on the path
    for (const s of R.steps) {
      const u = wrap(tau - s.t) / s.d;
      if (u <= 1 + s.tail) comets.push({ e: s.e, p: u, tail: s.tail });
      flare(s.e.b, wrap(tau - s.t - s.d));
      flare(s.e.a, wrap(tau - s.t));
    }
  }
  // In color the web is plain white and each packet tints it; in White the web is faint and
  // the packets are the white.
  const plain = state.color !== 'ink';
  return { dim: plain ? 1 : 0.22, letterDim: plain ? 1 : 0.42, baseInk: true, comets, litNodes };
}
const look = (t) => {
  const L = { palette: state.color, time: state.motion === 'still' ? 0 : t };
  if (state.motion === 'flow') return { ...L, pulse: state.color === 'ink' };
  if (state.motion === 'relay') return { ...L, ...relay(piece.relay, t) };
  return L;
};

// ── Drawing ──
const piece = { web: null, relay: null, word: null, face: '' };
window.__piece = piece; // for inspection and checks
let clock = 0; // seconds of motion shown
let playing = !thumb && !q.has('paused');

async function build() {
  const p = WORDS.find((w) => w.id === state.word);
  const { sheet, name } = await sheetFor(state.weight);
  const layout = p.layouts[Math.min(state.layout, p.layouts.length) - 1];
  piece.web = stillWeb({ letters: p.letters, edges: p.edges, pos: layout.pos, sheet, ground: 'black', merge: 'off' });
  piece.relay = relayPath(p, piece.web);
  piece.word = p;
  piece.face = name;
  canvas.setAttribute('aria-label', `${p.name}, spelled as a web of letters joined by arrows, ${p.letters.length} letters and ${p.edges.length} arrows.`);
  details();
  remember();
  share?.refresh?.();
  paint();
}

function fit() {
  const { width } = canvas.getBoundingClientRect();
  const w = Math.round(width * Math.min(devicePixelRatio, 2));
  if (w && canvas.width !== w) (canvas.width = w), (canvas.height = Math.round((w * H) / W));
  return canvas.width / W;
}
function draw(x, scale, t) {
  x.setTransform(1, 0, 0, 1, 0, 0);
  piece.web.drawLook(x, scale, look(t));
}
function paint() {
  if (!piece.web) return;
  const scale = fit();
  if (scale) draw(canvas.getContext('2d', { colorSpace: 'display-p3' }), scale, clock);
}

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (!playing || state.motion === 'still') return;
  clock += dt;
  paint();
}
const togglePlay = () => {
  playing = !playing;
  last = performance.now();
};
addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.target.closest?.('input, textarea, select, button')) {
    e.preventDefault();
    togglePlay();
  }
});

function details() {
  const p = piece.word;
  panel.details([
    ['Spelling', p.name],
    ['On the web', `${p.letters.length} letters, ${p.edges.length} arrows`],
    ['Layout', `${Math.min(state.layout, p.layouts.length)} of ${p.layouts.length}`],
    ['One loop', `${piece.relay.period.toFixed(1)} s`],
    ['Letters', piece.face],
  ]);
}

function remember() {
  const url = new URL(location.href);
  url.search = '';
  if (state.word !== 'pneumonoultramicroscopicsilicovolcanoconiosis') url.searchParams.set('word', state.word);
  if (state.layout !== 1) url.searchParams.set('layout', state.layout);
  history.replaceState(null, '', url);
}

// ── Export ──
const download = (blob, name) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
};
const fileName = (ext) => `word-web-${state.word.slice(0, 24)}-${state.layout}.${ext}`;

/** Records one whole loop (two for short ones) at 1080 px, 30 frames a second. */
async function exportVideo() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d', { colorSpace: 'display-p3' });
  const types = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
  const mimeType = types.find((t) => MediaRecorder.isTypeSupported(t));
  const stream = c.captureStream(0);
  const track = stream.getVideoTracks()[0];
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 12_000_000 });
  const chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise((r) => (recorder.onstop = r));
  const fps = 30;
  const seconds = state.motion === 'relay' ? piece.relay.period * Math.ceil(6 / piece.relay.period) : 12;
  recorder.start();
  const t0 = performance.now();
  for (let n = 0; n < fps * seconds; n++) {
    draw(x, 1, n / fps);
    track.requestFrame();
    const due = t0 + ((n + 1) * 1000) / fps;
    await new Promise((r) => setTimeout(r, Math.max(0, due - performance.now())));
  }
  recorder.stop();
  await done;
  download(new Blob(chunks, { type: mimeType }), fileName(mimeType.includes('mp4') ? 'mp4' : 'webm'));
}

const caption = () => {
  const p = piece.word ?? WORDS.find((w) => w.id === state.word);
  return [
    `${p.name}, spelled as a web of letters.`,
    '',
    'Every letter the word uses is set once; every time one letter follows another, an arrow runs between them. Packets of color run the word’s path all at once, letter to letter, and never stop.',
    '',
    p.about,
    `Type: ${piece.face || 'Söhne Mono by Klim Type Foundry'}`,
    'Made with: Canvas 2D',
  ].join('\n');
};

const share = panel.share({
  caption,
  note: '2160 px png',
  exportImage: async () => {
    const c = document.createElement('canvas');
    c.width = 2160;
    c.height = 2160;
    draw(c.getContext('2d', { colorSpace: 'display-p3' }), 2, clock);
    return { blob: await new Promise((r) => c.toBlob(r, 'image/png')), name: fileName('png') };
  },
  extra: [{ label: 'Export video, one loop', run: exportVideo }],
});

panel.controls(
  [
    { key: 'word', label: 'Word', value: state.word, options: WORDS.map((p) => ({ value: p.id, label: WORD_LABELS[p.id] ?? p.name })) },
    { key: 'layout', label: 'Layout', value: String(state.layout), options: Array.from({ length: LAYOUTS }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })) },
  ],
  (key, value) => {
    state[key] = key === 'layout' ? Number(value) : value;
    build();
  },
);

let timer;
new ResizeObserver(() => {
  clearTimeout(timer);
  timer = setTimeout(paint, 60);
}).observe(stage);

await build();
requestAnimationFrame(loop);
document.documentElement.dataset.rendered = String(Date.now());
