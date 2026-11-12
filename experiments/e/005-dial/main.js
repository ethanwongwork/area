import '@fontsource-variable/roboto-flex/full.css';
import '@fontsource-variable/jetbrains-mono';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { shell, fontsReady } from '../../src/shell.js';

gsap.registerPlugin(Draggable, InertiaPlugin);
const { gui, thumb } = shell('005-dial');

// A slider you can throw. The numeral is the value: thin and narrow at 0, black and wide at 100.
// The thumb squashes with speed and lands on tens.
const p = { snap: 10, squash: 0.35, resistance: 900 };

const stage = document.getElementById('stage');
stage.innerHTML = `
  <p class="value" aria-hidden="true"><span class="num">0</span><span class="unit">%</span></p>
  <div class="control">
    <div class="track">
      <div class="fill"></div>
      <div class="thumb" role="slider" tabindex="0" aria-label="Amount" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
    </div>
    <div class="ticks">${Array.from({ length: 11 }, (_, i) => `<span>${i * 10}</span>`).join('')}</div>
  </div>`;

const num = stage.querySelector('.num');
const valueEl = stage.querySelector('.value');
const track = stage.querySelector('.track');
const fill = stage.querySelector('.fill');
const thumbEl = stage.querySelector('.thumb');
const ticks = [...stage.querySelectorAll('.ticks span')];

const max = () => track.clientWidth - thumbEl.offsetWidth;
const state = { value: 0, shown: 0 };

function render(x) {
  const v = Math.max(0, Math.min(100, (x / max()) * 100));
  state.value = v;
  fill.style.width = `${x + thumbEl.offsetWidth}px`;
  thumbEl.setAttribute('aria-valuenow', Math.round(v));
  const s = v / 100;
  // Width 25→151, weight 100→1000, grade rises with it.
  valueEl.style.fontVariationSettings = `'wdth' ${(25 + s * 126).toFixed(1)}, 'wght' ${(100 + s * 900).toFixed(0)}, 'opsz' 144, 'GRAD' ${(s * 100).toFixed(0)}`;
  num.textContent = Math.round(v);
  ticks.forEach((t, i) => t.classList.toggle('on', i * 10 <= v + 0.5));
}

// Squash and stretch from velocity, eased back on its own.
const sx = gsap.quickTo(thumbEl, 'scaleX', { duration: 0.4, ease: 'power3.out' });
const sy = gsap.quickTo(thumbEl, 'scaleY', { duration: 0.4, ease: 'power3.out' });
let lastX = 0;
gsap.ticker.add(() => {
  const x = gsap.getProperty(thumbEl, 'x');
  const v = Math.abs(x - lastX);
  lastX = x;
  const k = Math.min(v / 40, 1) * p.squash;
  sx(1 + k);
  sy(1 - k * 0.6);
});

const [drag] = Draggable.create(thumbEl, {
  type: 'x',
  bounds: track,
  inertia: true,
  edgeResistance: 0.85,
  throwResistance: p.resistance,
  snap: (x) => Math.round(x / ((max() * p.snap) / 100)) * ((max() * p.snap) / 100),
  onDrag() {
    render(this.x);
  },
  onThrowUpdate() {
    render(this.x);
  },
  onPress() {
    gsap.to(thumbEl, { boxShadow: '0 1px 2px rgb(0 0 0 / 0.18), 0 16px 32px -8px rgb(255 79 0 / 0.7)', duration: 0.2 });
  },
  onRelease() {
    gsap.to(thumbEl, { clearProps: 'boxShadow', duration: 0.3 });
  },
});

// Click the track to jump there.
track.addEventListener('pointerdown', (e) => {
  if (e.target === thumbEl) return;
  const r = track.getBoundingClientRect();
  goTo(((e.clientX - r.left - thumbEl.offsetWidth / 2) / max()) * 100);
});

function goTo(v, duration = 0.9) {
  v = Math.max(0, Math.min(100, v));
  gsap.to(thumbEl, {
    x: (v / 100) * max(),
    duration,
    ease: 'elastic.out(1, 0.6)',
    onUpdate: () => {
      drag.update();
      render(gsap.getProperty(thumbEl, 'x'));
    },
  });
}

thumbEl.addEventListener('keydown', (e) => {
  const step = e.shiftKey ? 10 : 1;
  const keys = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 10, PageDown: -10 };
  if (e.key in keys) goTo(Math.round(state.value) + keys[e.key], 0.5);
  else if (e.key === 'Home') goTo(0);
  else if (e.key === 'End') goTo(100);
  else return;
  e.preventDefault();
});

addEventListener('resize', () => {
  gsap.set(thumbEl, { x: (state.value / 100) * max() });
  drag.update();
  render(gsap.getProperty(thumbEl, 'x'));
});

gui.add(p, 'snap', [1, 5, 10, 25]);
gui.add(p, 'squash', 0, 1, 0.01);
gui.add(p, 'resistance', 100, 3000, 10).onChange((v) => (drag.vars.throwResistance = v));

await fontsReady('400 100px "Roboto Flex Variable"');
render(0);
// Open with a throw so the idea is visible before anyone touches it.
gsap.to(thumbEl, {
  x: () => max() * 0.7,
  duration: 1.6,
  delay: 0.4,
  ease: 'elastic.out(1, 0.5)',
  onUpdate: () => render(gsap.getProperty(thumbEl, 'x')),
  onComplete: () => drag.update(),
});
if (thumb) gsap.ticker.lagSmoothing(0);
