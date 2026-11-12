// Pieces of the interface shared by the gallery and the viewer.

const KINDS = ['Type', 'Interaction', 'Vector', 'Color', 'Poster', '3D', 'Collage'];

export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/** Sentence case: first letter up, the rest as written. */
export const sentence = (s) => {
  const t = String(s);
  return t.charAt(0).toUpperCase() + t.slice(1);
};

/** Kinds that have work, in a fixed order. */
export const kindsPresent = (list) => KINDS.filter((k) => list.some((e) => e.kind === k));

/** "All, Type, …" linking to the gallery at `base` (e.g. '#' or '../../#'). */
export const filtersHTML = (kinds, base) =>
  ['All', ...kinds]
    .map((k, i, a) => `<a href="${base}${k === 'All' ? '' : k.toLowerCase()}" data-kind="${k}">${k}${i < a.length - 1 ? ',' : ''}</a>`)
    .join(' ');

/** A piece's name (two or three lines), its date, then its number. */
export const nameHTML = (e, tag = 'span') =>
  `<${tag} class="ui-name"><span class="title">${esc(e.title)}</span><span class="date">${esc(e.date ?? e.year ?? '')}</span><span class="num">${esc(e.number ?? '')}</span></${tag}>`;
