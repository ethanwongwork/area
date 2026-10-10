const { fixtures, commit } = await (await fetch('fixtures.json')).json();
const treatments = [
  ['plain', 'Plain ink', 'Reference: no content decoration.'],
  ['engraved', 'Engraved glyph', 'Lower alpha highlight: a shallow suggestion, not a true inset filter. Text stays plain.'],
  ['embossed', 'Embossed glyph and type', 'Opposing light/shade: inspect double edges and counters.'],
  ['glowing-glyph', 'Glowing glyph', 'One authored 2px Gaussian-deviation lobe; core remains. Text stays plain.'],
  ['duotone', 'Duotone glyph', 'Calendar dates are explicitly annotated detail parts. Search remains monochrome.'],
  ['gradient', 'Gradient glyph and type', 'One user-space diagonal gradient per icon, horizontal gradient per word.'],
  ['letterpress', 'Letterpress text', 'One authored 1px lower highlight. Glyphs stay plain.'],
  ['glowing-text', 'Glowing text', 'Authored text-shadow blur radii 2px and 5px. Glyphs stay plain.'],
];
const grid = document.querySelector('#grid');
for (const [kind, title, note] of treatments) {
  const article = document.createElement('article');
  article.className = kind;
  article.innerHTML = `<h2>${title}</h2><p class="note">${note}</p><div class="samples"></div>`;
  for (const size of [12,14,16]) {
    const sample = document.createElement('div');
    sample.className = 'sample';
    sample.style.setProperty('--size', `${size}px`);
    // Same physical curve as the pinned pilot renderer, applied in drawing units.
    sample.style.setProperty('--sw', String(1.125 * Math.pow(Math.min(size,24)/16,-.55)));
    const icons = Object.entries(fixtures).map(([name,fixture]) => {
      const id = `ink-${kind}-${size}-${name}`;
      return `<svg class="glyph" aria-hidden="true" focusable="false" viewBox="0 0 16 16" style="--gradient-paint:url(#${id}) currentColor"><defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="16" y2="16"><stop offset="0" style="stop-color:var(--start)"/><stop offset="1" style="stop-color:var(--end)"/></linearGradient></defs>${fixture.svg}</svg>`;
    }).join('');
    sample.innerHTML = `<span class="size">${size}px</span><div class="specimen">${icons}<span class="word">Calendar 18:30</span></div>`;
    article.querySelector('.samples').append(sample);
  }
  grid.append(article);
}
document.querySelector('#theme').addEventListener('change', e => { document.documentElement.dataset.theme = e.target.value; });
document.querySelector('#plain').addEventListener('click', e => {
  const enabled = document.documentElement.toggleAttribute('data-plain');
  e.currentTarget.setAttribute('aria-pressed', String(enabled));
});
document.querySelector('#status').textContent = `Loaded ${treatments.length} treatments × 3 sizes; source ${commit.slice(0,12)}. Browser rendering is not a legibility result. DPR ${devicePixelRatio}; ${navigator.userAgent}`;
