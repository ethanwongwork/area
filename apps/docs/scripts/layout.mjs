/** Shared page chrome: shell, sidebar, header, axis playground, and the docs' own styles. */

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Minimal JSX highlighting. Build-time and regex-based; it never runs in the browser. */
export function highlight(code) {
  return escapeHtml(code)
    .replace(/(&lt;\/?)([A-Za-z][\w.]*)/g, '$1<span class="tok-tag">$2</span>')
    .replace(/([a-zA-Z-]+)(=)(&quot;[^&]*?&quot;)/g, '<span class="tok-attr">$1</span>$2<span class="tok-str">$3</span>')
    .replace(/(\{)([^{}]*)(\})/g, '<span class="tok-brace">$1</span>$2<span class="tok-brace">$3</span>');
}

export const DOCS_CSS = `
@layer area.base {
  html { scroll-behavior: smooth; scroll-padding-block-start: 80px; }
  body {
    margin: 0;
    font-family: var(--area-font-sans);
    background: var(--area-bg-page);
    color: var(--area-fg-default);
  }
  a { color: inherit; text-decoration: none; }
  code, pre { font-family: var(--area-font-mono); }

  .shell { display: grid; grid-template-columns: 240px minmax(0, 1fr); max-inline-size: 1400px; margin-inline: auto; }
  .topbar {
    position: sticky; inset-block-start: 0; z-index: var(--area-z-sticky);
    display: flex; align-items: center; gap: var(--area-space-16);
    block-size: 56px; padding-inline: var(--area-space-24);
    border-block-end: 1px solid var(--area-border-subtle);
    background: color-mix(in oklab, var(--area-bg-page) 85%, transparent);
    backdrop-filter: blur(8px);
  }
  .brand { display: flex; align-items: center; gap: var(--area-space-8); font-weight: var(--area-weight-semibold); }
  .brand__mark {
    inline-size: 20px; block-size: 20px; border-radius: var(--area-radius-small);
    background: var(--area-accent-solid);
  }
  .topbar__spacer { margin-inline-start: auto; }

  .sidebar {
    position: sticky; inset-block-start: 56px; align-self: start;
    block-size: calc(100vh - 56px); overflow-y: auto;
    padding: var(--area-space-24) var(--area-space-16);
    border-inline-end: 1px solid var(--area-border-subtle);
  }
  .sidebar__group + .sidebar__group { margin-block-start: var(--area-space-24); }
  .sidebar__title {
    font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading);
    font-weight: var(--area-weight-semibold); color: var(--area-fg-default);
    padding-inline: var(--area-space-8); margin-block-end: var(--area-space-6);
  }
  .sidebar__link {
    display: block; padding: var(--area-space-4) var(--area-space-8);
    border-radius: var(--area-radius-small);
    font-size: var(--area-text-md-size); line-height: var(--area-text-md-leading);
    color: var(--area-fg-muted);
  }
  .sidebar__link:hover { background: var(--area-bg-hover); color: var(--area-fg-default); }
  .sidebar__link[aria-current="page"] { background: var(--area-bg-component); color: var(--area-fg-default); font-weight: var(--area-weight-medium); }

  .main { display: grid; grid-template-columns: minmax(0, 1fr) 200px; gap: var(--area-space-48); padding: var(--area-space-40) var(--area-space-40) var(--area-space-96); }
  .content { min-inline-size: 0; max-inline-size: 720px; }

  .page-title { font-size: var(--area-heading-xl-size); line-height: var(--area-heading-xl-leading); letter-spacing: var(--area-heading-xl-tracking); font-weight: var(--area-weight-semibold); }
  .page-lede { margin-block-start: var(--area-space-8); font-size: var(--area-text-lg-size); line-height: var(--area-text-lg-leading); color: var(--area-fg-muted); }

  h2.section { margin-block: var(--area-space-40) var(--area-space-12); font-size: var(--area-heading-md-size); line-height: var(--area-heading-md-leading); letter-spacing: var(--area-heading-md-tracking); font-weight: var(--area-weight-semibold); }
  h3.example { margin-block: var(--area-space-32) var(--area-space-8); font-size: var(--area-heading-xs-size); line-height: var(--area-heading-xs-leading); letter-spacing: var(--area-heading-xs-tracking); font-weight: var(--area-weight-semibold); }
  .note { margin-block-end: var(--area-space-12); color: var(--area-fg-muted); }
  .prose p { margin-block: var(--area-space-12); color: var(--area-fg-muted); }
  .prose code { background: var(--area-bg-component); padding: 2px 5px; border-radius: var(--area-radius-2); font-size: 0.92em; }

  .example-block { border: 1px solid var(--area-border-subtle); border-radius: var(--area-radius-container); overflow: hidden; background: var(--area-bg-surface); }
  .preview { display: flex; flex-wrap: wrap; align-items: center; gap: var(--area-space-12); padding: var(--area-space-32); min-block-size: 120px; }
  .preview--column { flex-direction: column; align-items: flex-start; }
  details.code { border-block-start: 1px solid var(--area-border-subtle); }
  details.code > summary {
    list-style: none; cursor: pointer; user-select: none;
    padding: var(--area-space-8) var(--area-space-12);
    font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading);
    color: var(--area-fg-muted);
  }
  details.code > summary::-webkit-details-marker { display: none; }
  details.code > summary:hover { color: var(--area-fg-default); }
  details.code[open] > summary { border-block-end: 1px solid var(--area-border-subtle); }
  pre.code-block { margin: 0; padding: var(--area-space-16); overflow-x: auto; background: var(--area-bg-subtle); font-size: var(--area-text-sm-size); line-height: var(--area-text-sm-leading); }
  .tok-tag { color: var(--area-fg-accent); }
  .tok-attr { color: var(--area-fg-warning); }
  .tok-str { color: var(--area-fg-success); }
  .tok-brace { color: var(--area-fg-subtle); }

  .toc { position: sticky; inset-block-start: 80px; align-self: start; font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); }
  .toc__title { font-weight: var(--area-weight-semibold); margin-block-end: var(--area-space-8); }
  .toc a { display: block; padding-block: 3px; color: var(--area-fg-muted); }
  .toc a:hover { color: var(--area-fg-default); }

  .api-table { inline-size: 100%; border-collapse: collapse; font-size: var(--area-text-md-size); }
  .api-table th, .api-table td { text-align: start; padding: var(--area-space-8) var(--area-space-12); border-block-end: 1px solid var(--area-border-subtle); vertical-align: top; }
  .api-table th { color: var(--area-fg-muted); font-weight: var(--area-weight-medium); }
  .api-table td:first-child { font-family: var(--area-font-mono); }
  .api-table td:nth-child(2) { font-family: var(--area-font-mono); color: var(--area-fg-accent); font-size: 0.92em; }
  /* Prose tables (step roles, axis presets) read as sentences, not as types. */
  .api-table--prose td { font-family: var(--area-font-sans); color: inherit; font-size: inherit; }
  .api-table--prose td:first-child { font-family: var(--area-font-mono); color: var(--area-fg-muted); }
  .api-table td:nth-child(3) { font-family: var(--area-font-mono); color: var(--area-fg-muted); font-size: 0.92em; }

  .axis-bar { display: flex; flex-wrap: wrap; gap: var(--area-space-8); align-items: center; }
  .axis-control { display: flex; align-items: center; gap: var(--area-space-4); }
  .axis-control > label { font-size: var(--area-text-xs-size); color: var(--area-fg-muted); }

  .swatch-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2px; margin-block: var(--area-space-8); }
  .swatch { aspect-ratio: 1 / 1.4; border-radius: var(--area-radius-2); position: relative; }
  .swatch-row { margin-block-end: var(--area-space-20); }
  .swatch-row__name { font-size: var(--area-text-xs-size); color: var(--area-fg-muted); font-family: var(--area-font-mono); margin-block-end: var(--area-space-4); }
  .step-legend { display: grid; grid-template-columns: repeat(12, 1fr); gap: 2px; font-size: 10px; color: var(--area-fg-subtle); text-align: center; }

  .type-row { display: flex; align-items: baseline; gap: var(--area-space-24); padding-block: var(--area-space-12); border-block-end: 1px solid var(--area-border-subtle); }
  .type-row__meta { flex-shrink: 0; inline-size: 160px; font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); color: var(--area-fg-muted); }
  .type-row__sample { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .token-list { display: grid; gap: 1px; background: var(--area-border-subtle); border: 1px solid var(--area-border-subtle); border-radius: var(--area-radius-container); overflow: hidden; }
  .token-row { display: grid; grid-template-columns: 1fr auto auto; gap: var(--area-space-12); align-items: center; padding: var(--area-space-8) var(--area-space-12); background: var(--area-bg-surface); font-size: var(--area-text-sm-size); }
  .token-row__name { font-family: var(--area-font-mono); }
  .token-row__value { font-family: var(--area-font-mono); color: var(--area-fg-muted); }
  .token-row__chip { inline-size: 20px; block-size: 20px; border-radius: var(--area-radius-2); border: 1px solid var(--area-border-subtle); }

  @media (max-width: 1100px) { .main { grid-template-columns: minmax(0,1fr); } .toc { display: none; } }
  @media (max-width: 820px) { .shell { grid-template-columns: minmax(0,1fr); } .sidebar { display: none; } }
}
`;

/** The axis playground. Flips data attributes on <html> and remembers the choice. */
export const AXIS_SCRIPT = `
(function () {
  var KEY = "area-docs-axes";
  var root = document.documentElement;
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}

  function apply(axis, value) {
    if (value) root.setAttribute("data-area-" + axis, value);
    else root.removeAttribute("data-area-" + axis);
  }
  Object.keys(saved).forEach(function (axis) { apply(axis, saved[axis]); });

  document.addEventListener("change", function (event) {
    var select = event.target.closest("[data-axis]");
    if (!select) return;
    var axis = select.getAttribute("data-axis");
    saved[axis] = select.value;
    apply(axis, select.value);
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
  });

  // Reflect the saved state into the controls once they exist.
  document.querySelectorAll("[data-axis]").forEach(function (select) {
    var axis = select.getAttribute("data-axis");
    if (saved[axis]) select.value = saved[axis];
  });

  // Scrollspy for the on-this-page list.
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a"));
  if (links.length) {
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.style.color = a.getAttribute("href") === "#" + entry.target.id
            ? "var(--area-fg-default)" : "";
        });
      });
    }, { rootMargin: "-80px 0px -70% 0px" });
    targets.forEach(function (t) { observer.observe(t); });
  }
})();
`;
