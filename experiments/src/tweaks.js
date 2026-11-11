// The tweaks panel: the same small panel on every experiment, holding only the few choices
// still open (a ground, an ink set, a motion detail). Everything else in a piece is locked.
//
//   const panel = tweaks(
//     [
//       { key: 'background', label: 'Background', value: 'white', options: ['white', 'black'] },
//       { key: 'palette', label: 'Inks', value: 'riso', options: [{ value: 'riso', swatch: ['#ff48b0', '#0078bf'] }] },
//       { label: 'Shuffle', action: () => reseed() },
//     ],
//     (key, value) => apply(key, value),
//   );
//   panel.destroy();
//
// T shows or hides it. Hidden in thumbnails (?thumb). Given a container (the viewer's side
// panel), the rows go there instead, with no floating box of its own.

import { sentence } from './ui.js';

const STORE = 'x-tweaks-open';

export function tweaks(list, onChange, container = null) {
  if (document.documentElement.classList.contains('is-thumb')) return { destroy() {}, set() {} };

  let open = true;
  try {
    open = localStorage.getItem(STORE) !== '0';
  } catch {}

  const el = document.createElement(container ? 'div' : 'aside');
  el.className = container ? 'x-tweaks-in' : 'x-tweaks';
  if (!container) el.setAttribute('aria-label', 'Tweaks');
  el.innerHTML = container
    ? '<div class="x-tw-body"></div>'
    : `<button type="button" class="x-tw-head" aria-expanded="${open}"><span>Tweaks</span><span class="x-tw-key">T</span></button><div class="x-tw-body"${open ? '' : ' hidden'}></div>`;
  const body = el.querySelector('.x-tw-body');
  const head = el.querySelector('.x-tw-head');
  const values = {};

  for (const t of list) {
    const row = document.createElement('div');
    row.className = 'x-tw-row';
    if (t.action) {
      row.innerHTML = `<span class="x-tw-label"></span><div class="x-tw-opts"><button type="button" class="x-tw-action">${t.label}</button></div>`;
      row.querySelector('button').addEventListener('click', t.action);
      body.append(row);
      continue;
    }
    values[t.key] = t.value;
    row.innerHTML = `<span class="x-tw-label" id="x-tw-${t.key}">${t.label}</span><div class="x-tw-opts" role="radiogroup" aria-labelledby="x-tw-${t.key}"></div>`;
    const opts = row.querySelector('.x-tw-opts');
    for (const o of t.options) {
      const { value, label = sentence(value), swatch } = typeof o === 'object' ? o : { value: o };
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'radio');
      b.dataset.key = t.key;
      b.dataset.value = value;
      b.innerHTML = `${swatch ? `<span class="x-tw-swatch">${swatch.map((c) => `<i style="background:${c}"></i>`).join('')}</span>` : ''}${label}`;
      b.addEventListener('click', () => {
        set(t.key, value);
        onChange(t.key, value);
      });
      opts.append(b);
    }
    body.append(row);
  }

  function set(key, value) {
    values[key] = value;
    for (const b of el.querySelectorAll(`[data-key="${key}"]`)) b.setAttribute('aria-checked', String(b.dataset.value === String(value)));
  }
  for (const [k, v] of Object.entries(values)) set(k, v);

  const toggle = () => {
    open = body.hidden;
    body.hidden = !open;
    head.setAttribute('aria-expanded', String(open));
    try {
      localStorage.setItem(STORE, open ? '1' : '0');
    } catch {}
  };
  const onKey = (e) => {
    if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
    if ((e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey) toggle();
  };
  if (container) container.append(el);
  else {
    head.addEventListener('click', toggle);
    addEventListener('keydown', onKey);
    document.body.append(el);
  }

  return {
    set,
    destroy() {
      removeEventListener('keydown', onKey);
      el.remove();
    },
  };
}
