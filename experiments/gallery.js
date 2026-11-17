import experiments from './experiments.json';
import { filtersHTML, kindsPresent, nameHTML } from './src/ui.js';

const grid = document.querySelector('.grid');
const filters = document.querySelector('.ui-filters');

// Numbered pieces only (drafts stay out), newest first. 0 is a number: Area Cross is piece 0.
const list = experiments.filter((e) => !e.draft && Number.isInteger(e.number)).sort((a, b) => b.number - a.number);

grid.innerHTML = list
  .map((e) => {
    const [w, h] = e.ratio.split('/').map(Number);
    return `<li data-kind="${e.kind}">
      <a href="./e/${e.slug}/">
        <img src="./thumbs/${e.slug}.jpg" alt="" width="${w * 100}" height="${h * 100}" loading="lazy"
             onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'blank',style:'aspect-ratio:${w}/${h}'}))">
        ${nameHTML(e)}
      </a>
    </li>`;
  })
  .join('');

const present = kindsPresent(list);
filters.innerHTML = filtersHTML(present, '#');

function route() {
  const hash = decodeURIComponent(location.hash.slice(1));
  const kind = present.find((k) => k.toLowerCase() === hash) ?? 'All';
  filters.querySelectorAll('a').forEach((a) => a.toggleAttribute('aria-current', a.dataset.kind === kind));
  for (const li of grid.children) li.hidden = !(kind === 'All' || li.dataset.kind === kind);
}

addEventListener('hashchange', route);
route();
