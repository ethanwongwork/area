import '@fontsource-variable/fraunces/full.css';
import '@fontsource-variable/fraunces/full-italic.css';
import '@fontsource-variable/jetbrains-mono';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { shell, fontsReady } from '../../src/shell.js';

gsap.registerPlugin(SplitText);
const { gui, thumb, font } = shell('006-poster');

// A poster whose headline softens and thickens under a red disc that follows the pointer.
// Fraunces' axes: weight 100–900, SOFT 0–100 (rounds the terminals), WONK (the leaning forms).
const p = { reach: 0.32, lag: 0.08, maxWeight: 900, headline: 'Soft/Matter' };

const stage = document.getElementById('stage');
stage.innerHTML = `
  <article class="poster">
    <header>
      <div class="meta"><span>Experiments in form</span><span>No. 006</span><span>Winter 2026</span></div>
      <div class="rule"></div>
    </header>
    <h1 class="headline"></h1>
    <footer>
      <div class="rule"></div>
      <div class="foot" style="margin-top:2cqw">
        <p>Type in motion<br>Fraunces, variable</p>
        <p>Weight, softness and a lean, each pulled by the same point. The letters take what is near them.</p>
        <p>Open daily<br>10—18</p>
      </div>
    </footer>
    <div class="disc"></div>
  </article>`;

const poster = stage.querySelector('.poster');
const headline = stage.querySelector('.headline');
const disc = stage.querySelector('.disc');
headline.style.fontFamily = font(['PPEditorialNew', 'ABCArizonaFlare'], 'Fraunces Variable');

let split;
let chars = [];
function setHeadline() {
  split?.revert();
  headline.innerHTML = p.headline
    .split('/')
    .map((l) => `<div class="line">${l}</div>`)
    .join('');
  split = SplitText.create(headline.querySelectorAll('.line'), { type: 'chars', charsClass: 'char' });
  chars = split.chars;
  chars.forEach((c) => (c.style.display = 'inline-block'));
}

// Pointer in poster space, eased.
const target = { x: 0.68, y: 0.42 };
const at = { ...target };
addEventListener('pointermove', (e) => {
  const r = poster.getBoundingClientRect();
  target.x = (e.clientX - r.left) / r.width;
  target.y = (e.clientY - r.top) / r.height;
});

const smooth = (t) => t * t * (3 - 2 * t);

function frame() {
  at.x += (target.x - at.x) * p.lag;
  at.y += (target.y - at.y) * p.lag;
  const r = poster.getBoundingClientRect();
  const px = at.x * r.width;
  const py = at.y * r.height;
  gsap.set(disc, { x: px, y: py });

  // Each letter reads its distance to the disc's centre.
  for (const c of chars) {
    const b = c.getBoundingClientRect();
    const dx = (b.left + b.width / 2 - r.left - px) / r.width;
    const dy = (b.top + b.height / 2 - r.top - py) / r.width;
    const k = smooth(Math.max(0, 1 - Math.hypot(dx, dy) / p.reach));
    const wght = 300 + k * (p.maxWeight - 300);
    c.style.fontVariationSettings = `'opsz' 144, 'wght' ${wght.toFixed(0)}, 'SOFT' ${(k * 100).toFixed(0)}, 'WONK' ${k > 0.5 ? 1 : 0}`;
  }
}

gui.add(p, 'headline').onFinishChange(setHeadline);
gui.add(p, 'reach', 0.1, 0.8, 0.01);
gui.add(p, 'lag', 0.02, 0.4, 0.01);
gui.add(p, 'maxWeight', 300, 900, 1);

await fontsReady('300 100px "Fraunces Variable"', 'italic 300 100px "Fraunces Variable"', '400 12px "JetBrains Mono Variable"');
setHeadline();
gsap.ticker.add(frame);

// Entrance: rules draw, letters rise, the disc drops in.
const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
tl.from('.rule', { scaleX: 0, duration: 1.4, stagger: 0.1 })
  .from(chars, { yPercent: 60, opacity: 0, rotate: 6, duration: 1.4, stagger: 0.035 }, 0.1)
  .from('.meta span, .foot p', { opacity: 0, y: 8, duration: 1, stagger: 0.05 }, 0.3)
  .from(disc, { scale: 0, duration: 1.6, ease: 'elastic.out(1, 0.5)' }, 0.5);
if (thumb) tl.progress(1);
