import gsap from 'gsap';
import { shell } from '../../src/shell.js';

const { gui, thumb } = shell('004-quarter');

// Truchet-style tiles: quarter discs, half discs and triangles. A wave turns each tile
// a quarter turn, rippling out from a point; neighbouring shapes rejoin into new figures.
const palette = { paper: '#ece6d9', ink: '#161616', red: '#e3412b', blue: '#2343c4', yellow: '#f2b705' };
const p = { cells: 7, every: 2.6, spread: 1.1, colour: 0.18 };

const NS = 'http://www.w3.org/2000/svg';
const stage = document.getElementById('stage');
let svg;
let tiles = [];
let cols = 0;
let rows = 0;
const S = 100; // one cell in viewBox units

const shapes = {
  // Quarter disc, centre at the cell's top-left corner.
  quarter: (x, y) => `M${x} ${y} L${x + S} ${y} A${S} ${S} 0 0 1 ${x} ${y + S} Z`,
  // Half disc on the top edge.
  half: (x, y) => `M${x} ${y} L${x + S} ${y} A${S / 2} ${S / 2} 0 0 1 ${x} ${y} Z`,
  // Triangle, half the cell along its diagonal.
  tri: (x, y) => `M${x} ${y} L${x + S} ${y} L${x} ${y + S} Z`,
  // Two quarter discs, opposite corners: a lens.
  lens: (x, y) => `M${x} ${y} A${S} ${S} 0 0 1 ${x + S} ${y + S} A${S} ${S} 0 0 1 ${x} ${y} Z`,
};
const kinds = ['quarter', 'quarter', 'quarter', 'half', 'tri', 'lens'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

function colourPair() {
  // Mostly ink on paper; a few cells carry colour.
  if (Math.random() > p.colour) return Math.random() < 0.5 ? [palette.paper, palette.ink] : [palette.ink, palette.paper];
  const c = pick([palette.red, palette.blue, palette.yellow]);
  return Math.random() < 0.5 ? [c, palette.ink] : [palette.paper, c];
}

function build() {
  const w = innerWidth;
  const h = innerHeight;
  const size = Math.min(w, h) / p.cells;
  cols = Math.ceil(w / size);
  rows = Math.ceil(h / size);

  stage.innerHTML = '';
  svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${cols * S} ${rows * S}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'A grid of turning quarter circles');
  stage.append(svg);

  tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * S;
      const y = r * S;
      const [bg, fg] = colourPair();
      const rect = document.createElementNS(NS, 'rect');
      Object.entries({ x, y, width: S + 1, height: S + 1, fill: bg }).forEach(([k, v]) => rect.setAttribute(k, v));
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', shapes[pick(kinds)](x, y));
      path.setAttribute('fill', fg);
      path.setAttribute('stroke', fg); // closes hairline seams between neighbours
      path.setAttribute('stroke-width', '1.2');
      path.setAttribute('stroke-linejoin', 'round');
      svg.append(rect, path);
      const turn = Math.floor(Math.random() * 4) * 90;
      gsap.set(path, { rotation: turn, svgOrigin: `${x + S / 2} ${y + S / 2}` });
      tiles.push({ rect, path, r, c, turn });
    }
  }
}

// One wave: every tile turns a quarter (some back), timed by distance from the origin.
function wave(originR, originC) {
  const dir = Math.random() < 0.5 ? 1 : -1;
  tiles.forEach((t) => {
    const d = Math.hypot(t.r - originR, t.c - originC);
    t.turn += 90 * dir * (Math.random() < 0.85 ? 1 : -1);
    gsap.to(t.path, {
      rotation: t.turn,
      duration: 0.9,
      ease: 'expo.inOut',
      delay: d * 0.06 * p.spread,
      overwrite: 'auto',
    });
  });
  // Recolour a handful along the wave.
  tiles
    .filter(() => Math.random() < 0.06)
    .forEach((t) => {
      const [bg, fg] = colourPair();
      const d = Math.hypot(t.r - originR, t.c - originC);
      gsap.to(t.rect, { attr: { fill: bg }, duration: 0.6, delay: d * 0.06 * p.spread + 0.3 });
      gsap.to(t.path, { attr: { fill: fg, stroke: fg }, duration: 0.6, delay: d * 0.06 * p.spread + 0.3 });
    });
}

function cellAt(e) {
  const box = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  const scale = Math.max(box.width / vb.width, box.height / vb.height);
  const ox = (box.width - vb.width * scale) / 2;
  const oy = (box.height - vb.height * scale) / 2;
  return [Math.floor((e.clientY - box.top - oy) / scale / S), Math.floor((e.clientX - box.left - ox) / scale / S)];
}

// Hover nudges one tile; click sends a wave from there.
let lastCell = '';
addEventListener('pointermove', (e) => {
  const [r, c] = cellAt(e);
  const key = `${r},${c}`;
  if (key === lastCell) return;
  lastCell = key;
  const t = tiles.find((t) => t.r === r && t.c === c);
  if (!t || gsap.isTweening(t.path)) return;
  t.turn += 90;
  gsap.to(t.path, { rotation: t.turn, duration: 0.6, ease: 'back.out(2)' });
});
addEventListener('click', (e) => {
  restart();
  wave(...cellAt(e));
});

let timer;
function restart() {
  clearInterval(timer);
  timer = setInterval(() => wave(Math.random() * rows, Math.random() * cols), p.every * 1000);
}

let resizeTimer;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(build, 150);
});

gui.add(p, 'cells', 3, 16, 1).onFinishChange(build);
gui.add(p, 'every', 1, 6, 0.1).onFinishChange(restart);
gui.add(p, 'spread', 0.2, 3, 0.05);
gui.add(p, 'colour', 0, 0.8, 0.01).onFinishChange(build);

build();
wave(rows / 2, cols / 2);
restart();
if (thumb) clearInterval(timer);
