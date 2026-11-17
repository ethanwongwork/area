import GUI from 'lil-gui';
import registry from '../experiments.json';
import { tweaks } from './tweaks.js';
import { esc, filtersHTML, kindsPresent, nameHTML } from './ui.js';
import './ui.css';
import './shell.css';

/**
 * The frame every experiment shares.
 *
 *   const { gui, thumb, panel } = shell('glyph-flow', { viewer: true });
 *
 * With `viewer`, the piece fills the screen beside a panel on the right: its number and
 * name, a short description, its controls (panel.controls), and a colophon from the
 * registry plus live details (panel.details). T hides the panel, Esc goes back to the
 * index. Without it, older pieces keep a thin bar and a floating tweaks panel.
 *
 * `thumb` is true when the thumbnail script loads the page (?thumb): no frame at all.
 * G shows every parameter (lil-gui), for work on the piece itself.
 */
export function shell(slug, { viewer = false } = {}) {
  const entry = registry.find((e) => e.slug === slug) ?? { slug, title: slug, kind: '', year: '' };
  const params = new URLSearchParams(location.search);
  const thumb = params.has('thumb');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const number = String(entry.number ?? (Number.parseInt(slug, 10) || ''));

  document.title = `${number} ${entry.title} — Experiments`;
  document.documentElement.classList.toggle('is-thumb', thumb);

  const gui = new GUI({ title: `${number} ${entry.title}` });
  gui.hide();

  let panel = null;
  if (viewer && !thumb) panel = buildViewer(entry, number, slug);
  else if (!thumb) buildBar(entry, number);

  addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
    if (e.key === 'g' || e.key === 'G') gui._hidden ? gui.show() : gui.hide();
    if (e.key === 'Escape') location.href = '../../';
  });

  const trial = (document.querySelector('meta[name="trial-fonts"]')?.content ?? '').split(',').filter(Boolean);
  /** The first trial family that is installed, else the fallback. */
  const font = (candidates, fallback) => {
    const found = candidates.find((c) => trial.includes(c));
    return found ? `"${found}", "${fallback}"` : `"${fallback}"`;
  };

  // A panel-less stand-in so pieces can call panel methods without checking.
  const none = { controls: (list, onChange) => tweaks(list, onChange), details() {}, set() {}, ground() {}, share: () => ({ refresh() {} }) };
  return { gui, thumb, reduced, font, entry, panel: panel ?? none };
}

function buildBar(entry, number) {
  const bar = document.createElement('header');
  bar.className = 'x-bar';
  bar.innerHTML = `
    <a href="../../" class="x-back">← Index</a>
    <span>${number}&ensp;${entry.title}</span>
    <span class="x-kind">${entry.kind}, ${entry.year}</span>`;
  document.body.append(bar);
  if (entry.hint) {
    const hint = document.createElement('p');
    hint.className = 'x-hint';
    hint.textContent = `${entry.hint}. G for controls.`;
    document.body.append(hint);
  }
}

function buildViewer(entry, number, slug) {
  document.documentElement.classList.add('is-viewer');
  document.body.classList.add('ui');
  const stage = document.getElementById('stage');
  const view = document.createElement('div');
  view.className = 'x-view';
  stage.replaceWith(view);

  // The same header as the gallery: the kinds, linking back to it.
  const head = document.createElement('header');
  head.className = 'ui-head';
  const listed = registry.filter((e) => !e.draft && Number.isInteger(e.number));
  head.innerHTML = `<nav class="ui-filters" aria-label="Gallery">${filtersHTML(kindsPresent(listed), '../../#')}</nav>`;
  head.querySelector(`[data-kind="${entry.kind}"]`)?.setAttribute('aria-current', 'true');
  // The piece fills the first screen; its views sit below it, and the column scrolls.
  const main = document.createElement('div');
  main.className = 'x-main';
  main.append(stage);
  view.append(head, main);
  buildViews(main, slug);

  const aside = document.createElement('aside');
  aside.className = 'x-panel';
  aside.setAttribute('aria-label', 'About this piece and its controls');
  aside.innerHTML = `
    ${nameHTML(entry, 'h1')}
    ${entry.description ? `<p>${esc(entry.description)}</p>` : ''}
    <section class="x-p-block x-p-controls" aria-label="Controls" hidden></section>
    <section class="x-p-block x-p-share" aria-label="Share" hidden>
      <div class="x-tw-row"><span class="x-tw-label">Caption</span><p class="x-p-caption"></p></div>
      <div class="x-tw-row"><span class="x-tw-label">Share</span><div class="x-p-actions"><button type="button" class="x-p-export">Export image</button><button type="button" class="x-p-copy">Copy caption</button></div></div>
    </section>
    <div class="x-p-block">
      <dl class="x-p-colophon">
        ${(entry.colophon ?? []).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
      <dl class="x-p-colophon x-p-live"></dl>
    </div>
    <p class="x-p-block x-p-keys">${entry.hint ? `${esc(entry.hint)}. ` : ''}<button type="button" class="x-p-hide">Hide this panel</button> or press T. Esc goes back to the gallery.</p>`;
  aside.querySelector('h1').style.margin = '0';
  aside.querySelector('h1').style.font = 'inherit';
  view.append(aside);

  const show = document.createElement('button');
  show.type = 'button';
  show.className = 'x-p-show ui';
  show.textContent = 'Show the panel';
  view.append(show);

  let open = true;
  try {
    open = localStorage.getItem('x-panel') !== '0';
  } catch {}
  const apply = () => {
    view.classList.toggle('is-full', !open);
    aside.hidden = !open;
    show.hidden = open;
    try {
      localStorage.setItem('x-panel', open ? '1' : '0');
    } catch {}
    dispatchEvent(new Event('resize'));
  };
  const toggle = () => {
    open = !open;
    apply();
  };
  apply();
  aside.querySelector('.x-p-hide').addEventListener('click', toggle);
  show.addEventListener('click', toggle);
  addEventListener('keydown', (e) => {
    if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
    if ((e.key === 't' || e.key === 'T') && !e.metaKey && !e.ctrlKey) toggle();
  });

  const controlsEl = aside.querySelector('.x-p-controls');
  const live = aside.querySelector('.x-p-live');
  let current = null;
  return {
    /** The piece's few open choices, as rows in the panel. */
    controls(list, onChange) {
      current?.destroy();
      controlsEl.hidden = false;
      current = tweaks(list, onChange, controlsEl);
      return current;
    },
    set: (key, value) => current?.set(key, value),
    /** Details that change with the piece: [[label, value], …]. */
    details(rows) {
      live.innerHTML = rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    },
    /**
     * The share block: `caption()` returns the text to post, `exportImage()` resolves to
     * { blob, name } for the download.
     */
    share({ caption, exportImage, note = '', extra = [] }) {
      const block = aside.querySelector('.x-p-share');
      const text = block.querySelector('.x-p-caption');
      const exp = block.querySelector('.x-p-export');
      const copy = block.querySelector('.x-p-copy');
      block.hidden = false;
      window.__caption = caption; // for scripts/export-set.mjs
      const refresh = () => (text.textContent = caption());
      refresh();
      exp.textContent = `Export image${note ? `, ${note}` : ''}`;
      exp.onclick = async () => {
        exp.textContent = 'Exporting…';
        const { blob, name } = await exportImage();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        exp.textContent = 'Exported';
        setTimeout(() => (exp.textContent = `Export image${note ? `, ${note}` : ''}`), 1600);
      };
      const actions = block.querySelector('.x-p-actions');
      for (const x of extra) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = x.label;
        b.onclick = async () => {
          b.textContent = 'Exporting…';
          try {
            await x.run();
            b.textContent = 'Exported';
          } catch (e) {
            b.textContent = `Couldn’t export: ${e.message}`;
          }
          setTimeout(() => (b.textContent = x.label), 2000);
        };
        actions.insertBefore(b, copy);
      }
      copy.onclick = async () => {
        try {
          await navigator.clipboard.writeText(caption());
          copy.textContent = 'Copied';
        } catch {
          getSelection().selectAllChildren(text);
          copy.textContent = 'Selected: press ⌘C';
        }
        setTimeout(() => (copy.textContent = 'Copy caption'), 1600);
      };
      return { refresh };
    },
    /** The colour behind the piece. */
    ground(color) {
      view.style.setProperty('--x-ground', color);
    },
  };
}

/**
 * The piece's views, below it: public/views/<slug>/views.json lists them (made by
 * scripts/export-set.mjs with a still of each). A card opens its view live; a close-up,
 * which the page can't show live, opens its still full size.
 */
async function buildViews(main, slug) {
  let set;
  try {
    const r = await fetch(`../../views/${slug}/views.json`);
    if (!r.ok) return;
    set = await r.json();
  } catch {
    return;
  }
  if (!set.views?.length) return;
  const here = new URLSearchParams(location.search);
  const isHere = (v) => {
    const p = v.params ?? {};
    const keys = new Set([...Object.keys(p), ...[...here.keys()].filter((k) => k !== 'thumb')]);
    return !v.zoom && [...keys].every((k) => String(p[k] ?? '') === (here.get(k) ?? ''));
  };
  const sec = document.createElement('section');
  sec.className = 'x-views';
  sec.setAttribute('aria-label', 'Views');
  sec.innerHTML = `<h2 class="x-views-head">Views</h2><ol class="x-views-grid"></ol>`;
  const grid = sec.querySelector('ol');
  for (const v of set.views) {
    const li = document.createElement('li');
    const href = `?${new URLSearchParams(v.params ?? {})}`;
    li.innerHTML = `<a class="x-view-card" href="${v.zoom ? `../../views/${slug}/${v.id}-large.jpg` : href}">
        <img src="../../views/${slug}/${v.id}.jpg" alt="" loading="lazy" width="720" height="720">
        <span class="x-view-name"></span><span class="x-view-note"></span></a>`;
    li.querySelector('.x-view-name').textContent = v.label + (v.video ? ', moving' : '');
    li.querySelector('.x-view-note').textContent = v.note ?? '';
    const a = li.querySelector('a');
    if (isHere(v)) a.setAttribute('aria-current', 'true');
    if (v.zoom)
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const box = document.createElement('dialog');
        box.className = 'x-view-box';
        box.innerHTML = `<img src="${a.href}" alt="${v.label}"><button type="button">Close</button>`;
        box.querySelector('button').onclick = () => box.close();
        box.addEventListener('close', () => box.remove());
        box.addEventListener('click', (ev) => ev.target === box && box.close());
        document.body.append(box);
        box.showModal();
      });
    grid.append(li);
  }
  main.append(sec);
}

/** Resolves once the fonts the page asks for are ready (canvas text needs this). */
export async function fontsReady(...specs) {
  await Promise.all(specs.map((s) => document.fonts.load(s)));
  await document.fonts.ready;
}

export { tweaks };
