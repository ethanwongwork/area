import '@fontsource-variable/roboto-flex/full.css';
import { shell, fontsReady } from '../../src/shell.js';

const { gui, thumb } = shell('001-stretch');

// Width (25–151) and weight (100–1000) ride a travelling wave; the pointer swells what it touches.
const p = { word: 'STRETCH', rows: 7, speed: 1, wave: 0.55, reach: 0.22, invert: false };

const stage = document.getElementById('stage');
let rows = [];

function build() {
  stage.innerHTML = '';
  stage.style.setProperty('--face', '"Roboto Flex Variable"');
  rows = Array.from({ length: p.rows }, () => {
    const row = document.createElement('div');
    row.className = 'row';
    row.setAttribute('aria-hidden', 'true');
    row.innerHTML = [...p.word].map((c) => `<span>${c}</span>`).join('');
    stage.append(row);
    return { el: row, letters: [...row.children] };
  });
  stage.setAttribute('aria-label', p.word);
  size();
}

function size() {
  // Rows share the height; line-height .74 packs caps tight.
  stage.style.setProperty('--size', `${(innerHeight * 0.96) / p.rows / 0.74}px`);
}

const pointer = { x: -1, y: -1, tx: -1, ty: -1 };
addEventListener('pointermove', (e) => {
  pointer.tx = e.clientX / innerWidth;
  pointer.ty = e.clientY / innerHeight;
  if (pointer.x < 0) Object.assign(pointer, { x: pointer.tx, y: pointer.ty });
});
addEventListener('pointerleave', () => Object.assign(pointer, { tx: -1, ty: -1 }));
addEventListener('click', () => document.body.classList.toggle('invert', (p.invert = !p.invert)));
addEventListener('resize', size);

const smooth = (a, b, t) => {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

let time = 0;
let last = performance.now();
function frame(now) {
  time += Math.min(0.05, (now - last) / 1000) * p.speed;
  last = now;
  if (pointer.tx >= 0) {
    pointer.x += (pointer.tx - pointer.x) * 0.12;
    pointer.y += (pointer.ty - pointer.y) * 0.12;
  }

  const n = p.word.length;
  // Write every letter's axes first…
  rows.forEach((row, r) => {
    const ry = (r + 0.5) / rows.length;
    row.letters.forEach((el, i) => {
      const phase = time * 1.6 - i * p.wave - r * 0.7;
      let s = 0.5 + 0.5 * Math.sin(phase);
      s = s * s * (3 - 2 * s);
      if (pointer.tx >= 0) {
        const dx = (i + 0.5) / n - pointer.x;
        const dy = (ry - pointer.y) * 1.4;
        s = Math.max(s, 1 - smooth(0, p.reach, Math.hypot(dx, dy)));
      }
      const wdth = 25 + s * 126;
      const wght = 120 + s * 880;
      el.style.fontVariationSettings = `'wdth' ${wdth.toFixed(1)}, 'wght' ${wght.toFixed(0)}, 'opsz' 144, 'GRAD' ${(s * 60).toFixed(0)}`;
    });
  });
  // …then read each row once and stretch it to the full width.
  const target = stage.clientWidth - parseFloat(getComputedStyle(stage).paddingLeft) * 2;
  const widths = rows.map((row) => row.el.offsetWidth);
  rows.forEach((row, r) => {
    row.el.style.transform = `scaleX(${(target / widths[r]).toFixed(4)})`;
  });
  requestAnimationFrame(frame);
}

gui.add(p, 'word').onFinishChange(build);
gui.add(p, 'rows', 3, 12, 1).onChange(build);
gui.add(p, 'speed', 0, 3, 0.05);
gui.add(p, 'wave', 0, 1.5, 0.01);
gui.add(p, 'reach', 0.05, 0.6, 0.01);

await fontsReady('400 100px "Roboto Flex Variable"');
build();
if (thumb) {
  Object.assign(pointer, { x: 0.62, y: 0.45, tx: 0.62, ty: 0.45 });
}
requestAnimationFrame(frame);
