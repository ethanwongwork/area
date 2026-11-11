// Many Flow posters side by side: one change per row (colour, characters, content,
// setting), then fresh shapes. Each opens full size on the poster page.
import { createNoise2D } from 'simplex-noise';
import '@fontsource-variable/jetbrains-mono';
import { random } from '../../src/glyphs.js';
import { getFont, names } from './fonts.js';
import { flow, PALETTES } from './flow.js';
import './variations.css';

const font = names.find((n) => /PP Kyoto/.test(n)) ?? names[0];
const palettes = Object.keys(PALETTES);
const characters = flow.options.characters;

const sections = [
  { title: 'Colour', note: 'The same shapes in each palette', items: palettes.map((palette) => ({ seed: 42, palette })) },
  { title: 'Characters', note: 'What the patterns are made of', items: characters.map((c) => ({ seed: 7, characters: c })) },
  { title: 'Content', note: 'What the text sections say', items: flow.options.copy.map((copy) => ({ seed: 3, copy })) },
  {
    title: 'Setting',
    note: 'Colour mode, styles, size, amount of copy, spacing',
    items: [
      { seed: 42, color: 'flow', label: 'colour flows across rows' },
      { seed: 42, style: 'mixed', label: 'mixed Kyoto styles' },
      { seed: 42, size: 0.028, label: 'larger type' },
      { seed: 42, size: 0.013, label: 'smaller type' },
      { seed: 42, text: 0.6, label: 'more copy' },
      { seed: 42, tracking: 0.04, label: 'looser spacing' },
    ],
  },
  {
    title: 'Shapes',
    note: 'New maps, with a random palette, character set and copy',
    items: [11, 19, 27, 64, 101, 202, 313, 404, 777].map((seed) => {
      const r = random(seed * 31);
      return { seed, palette: r.pick(palettes), characters: r.pick(characters), copy: r.pick(['words', 'kana', 'tags']) };
    }),
  },
];

const main = document.getElementById('v');
const status = document.querySelector('.v-status');
const jobs = [];
for (const sec of sections) {
  const el = document.createElement('section');
  el.innerHTML = `<h2>${sec.title}</h2><p>${sec.note}</p><div class="v-grid"></div>`;
  main.append(el);
  for (const item of sec.items) {
    const { seed, label, ...over } = item;
    const q = new URLSearchParams({ l: 'flow', seed, ...over });
    const fig = document.createElement('figure');
    const name = label ?? (Object.values(over).join(' · ') || 'default');
    fig.innerHTML = `<a href="./?${q}"><canvas></canvas></a><figcaption><b>${name}</b><span>seed ${seed}</span></figcaption>`;
    el.querySelector('.v-grid').append(fig);
    jobs.push({ canvas: fig.querySelector('canvas'), seed, p: { ...flow.params, ...over } });
  }
}

const gf = await getFont(font);
let done = 0;
for (const job of jobs) {
  const { width: W, height: H } = job.canvas.getBoundingClientRect();
  const dpr = Math.min(devicePixelRatio, 2);
  job.canvas.width = Math.round(W * dpr);
  job.canvas.height = Math.round(H * dpr);
  const ctx = job.canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  flow.draw({ ctx, W, H, gf, rng: random(job.seed), noise: createNoise2D(random(job.seed * 7 + 1)), p: job.p });
  status.textContent = `${font} · ${++done} / ${jobs.length}`;
  await new Promise((r) => setTimeout(r, 0));
}
document.documentElement.dataset.rendered = '1';
