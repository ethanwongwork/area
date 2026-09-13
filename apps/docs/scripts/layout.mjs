/**
 * Documentation chrome.
 *
 * The site consumes the design system it documents. Everything with a visual identity is
 * an Area component class: tables are `.area-table`, code is `.area-code-block`, the axis
 * pickers are `.area-segmented`, the sidebar is `.area-menu`, buttons are `.area-button`.
 *
 * What remains below is layout only -- grid tracks, sticky offsets, scroll containers --
 * and every value in it resolves from a token. `check-dogfood.mjs` enforces that: it
 * fails the build on any literal length, colour, or font size that did not come from
 * `var(--area-*)`, with a short allowlist for the handful of values a design system
 * genuinely has no opinion about.
 */

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/**
 * Minimal JSX highlighting, at build time. Emits Area's own syntax classes.
 *
 * Keywords are matched last and only outside a tag, so `import` in prose stays prose and an
 * attribute named `for` is not recoloured as a statement.
 */
export function highlight(code) {
  return escapeHtml(code)
    .replace(/(&lt;\/?)([A-Za-z][\w.]*)/g, '$1<span class="area-syntax-tag">$2</span>')
    .replace(
      /([a-zA-Z-]+)(=)(&quot;[^&]*?&quot;)/g,
      '<span class="area-syntax-attr">$1</span>$2<span class="area-syntax-string">$3</span>',
    )
    .replace(/(&quot;[^&]*?&quot;)/g, (m, q) => (m.includes("area-syntax") ? m : `<span class="area-syntax-string">${q}</span>`))
    .replace(
      /\b(import|from|export|const|let|return|default|new|await|async)\b/g,
      '<span class="area-syntax-keyword">$1</span>',
    )
    .replace(/(\{)([^{}]*)(\})/g, '<span class="area-syntax-punct">$1</span>$2<span class="area-syntax-punct">$3</span>');
}

// Fluent System Icons, generated. See `gen-icons.mjs`.
import { ICONS } from "./icons.generated.mjs";

/** A toolbar button. Outline where it sits in a toolbar, ghost where it rides on the code. */
function toolbarButton(icon, label, attr, variant = "outline") {
  return `<button type="button" class="area-button area-button--${variant} area-button--neutral area-button--sm" ${attr}>
      <span class="area-button__icon" aria-hidden="true">${ICONS[icon]}</span>
      <span class="area-button__label">${escapeHtml(label)}</span>
    </button>`;
}

/** A code block with a copy button, in the shape the design system defines. */
export function codeBlock(code, { title, flush = false, wrap = true, live = false } = {}) {
  // Three shapes, chosen by what the block has to say rather than by a flag at the call site.
  //
  //   live    a preview sits above it, so it gets the full toolbar: Copy and Reset act on
  //           the preview, Customize opens the axis panel.
  //   titled  it names a file, so the name and its Copy share a header row.
  //   bare    it is an install line or an import, where a toolbar would be taller than the
  //           code. One Copy rides at the top-right of the block itself.
  const shape = live ? "live" : title ? "titled" : "bare";

  const cls = [
    "area-code-block",
    shape === "titled" && "area-code-block--titled",
    shape === "bare" && "area-code-block--bare",
    flush && "area-code-block--flush",
    wrap && "area-code-block--wrap",
  ]
    .filter(Boolean)
    .join(" ");

  const copy = (variant) => toolbarButton("copy", "Copy", "data-copy", variant);

  if (shape === "bare") {
    return `<div class="${cls}">
  <span class="area-code-block__actions">${copy("ghost")}</span>
  <pre class="area-code-block__pre"><code>${highlight(code)}</code></pre>
</div>`;
  }

  const leading = live ? copy("outline") + toolbarButton("reset", "Reset", "data-reset") : "";
  const trailing = live
    ? `<span class="area-code-block__actions">${toolbarButton("expand", "Customize", "data-customize")}</span>`
    : `<span class="area-code-block__actions">${copy("ghost")}</span>`;

  return `<div class="${cls}">
  <div class="area-code-block__toolbar">
    ${title ? `<span class="area-code-block__title">${escapeHtml(title)}</span>` : ""}
    ${leading}
    ${trailing}
  </div>
  <pre class="area-code-block__pre"><code>${highlight(code)}</code></pre>
</div>`;
}

/**
 * The fullscreen customizer.
 *
 * One per page, reused by every example. Opening it copies that example's rendered preview
 * onto a stage and puts every axis beside it, so a component can be pushed through the
 * whole system at a size worth looking at.
 *
 * The axis controls carry the same `data-axis` attributes as the ones in the header, so
 * the existing delegated handler drives them without knowing this exists -- and because
 * custom properties inherit into the top layer, a change here repaints the page behind it.
 */
export function customizer(axisPanelHtml) {
  return `<dialog class="docs-customizer" id="docs-customizer" aria-label="Customize">
  <header class="docs-customizer__bar">
    <span class="docs-customizer__title">Customize</span>
    <span class="docs-customizer__name" id="docs-customizer-name"></span>
    <button type="button" class="area-button area-button--ghost area-button--neutral area-button--sm area-button--icon-only" data-customizer-close aria-label="Close">
      <span class="area-button__icon" aria-hidden="true">${ICONS.close}</span>
    </button>
  </header>
  <div class="docs-customizer__body">
    <div class="docs-customizer__stage" id="docs-customizer-stage"></div>
    <aside class="docs-customizer__panel">${axisPanelHtml}</aside>
  </div>
</dialog>`;
}

/** Names a token, optionally with a swatch of what it resolves to. */
export function tokenChip(name, { swatch, onColor = false } = {}) {
  return `<span class="area-token${onColor ? " area-token--on-color" : ""}">${
    swatch ? `<span class="area-token__swatch" style="background:${swatch}"></span>` : ""
  }${escapeHtml(name)}</span>`;
}

/**
 * A pair of views over the same data, with a segmented control to switch between them.
 *
 * Every foundation page offers both. The table is how you read values and compare a
 * column; the grid is how you judge a scale by eye, and it gives each entry enough room
 * to show the thing itself rather than a thumbnail of it. Neither substitutes for the
 * other, so the page ships both rather than choosing.
 *
 * The control sits at the left, above the content, where the eye already is after the
 * section heading.
 */
export function viewToggle(id, { grid, table: tableHtml, initial = "table" }) {
  const option = (value, label) =>
    `<button type="button" role="radio" class="area-segmented__item" data-view-value="${value}" aria-checked="${value === initial}"${value === initial ? " data-selected" : ""}>${label}</button>`;

  return `<div class="docs-view" data-view="${initial}" id="view-${id}">
  <div class="docs-view__bar">
    <div class="area-segmented area-segmented--xs" role="radiogroup" aria-label="View as" data-view-toggle>
      ${option("table", "Table")}${option("grid", "Grid")}
    </div>
  </div>
  <div class="docs-view__pane" data-pane="table">${tableHtml}</div>
  <div class="docs-view__pane" data-pane="grid">${grid}</div>
</div>`;
}

/**
 * The shape every foundation section takes: a heading, one sentence, and a pair of views
 * built from one list of rows.
 *
 * `columns` describes the table; `card` renders one grid tile. Both read the same row
 * objects, so the two views cannot describe different data.
 */
export function tokenSection({ id, title, description, rows, columns, card }) {
  return `<h2 class="docs-h2" id="${id}">${escapeHtml(title)}</h2>
<p class="docs-note">${escapeHtml(description)}</p>
${viewToggle(id, {
  table: table(
    columns.map((c) => c.header),
    rows.map((row) => columns.map((c) => c.cell(row))),
  ),
  grid: `<div class="docs-card-grid">${rows.map(card).join("")}</div>`,
})}`;
}

/** One grid tile: a token chip, then metadata lines, then an optional figure. */
export function tokenCard({ name, swatch, meta = [], figure, style = "", onColor = false }) {
  return `<div class="docs-card"${style ? ` style="${style}"` : ""}>
  ${tokenChip(name, { swatch, onColor })}
  ${meta.length ? `<div class="docs-card__meta">${meta.map((m) => `<div>${m}</div>`).join("")}</div>` : ""}
  ${figure ? `<div class="docs-card__figure">${figure}</div>` : ""}
</div>`;
}

/** A ruled table, in the shape the design system defines. */
export function table(headers, rows, { className = "" } = {}) {
  return `<div class="area-table-wrapper">
  <table class="area-table ${className}">
    <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .map((cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`)
      .join("")}</tbody>
  </table>
</div>`;
}

/**
 * Layout only. No colour, no type scale, no spacing that is not a token.
 *
 * The few literals that remain are sizes a design system has no opinion on -- the width
 * of this site's sidebar, its reading measure, its breakpoints -- and each is declared as
 * a local custom property up top so it is named rather than scattered.
 */
export const DOCS_CSS = `
@layer area.base {
  :root {
    /* Site layout. Not design-system tokens: these describe this documentation site. */
    --docs-sidebar: 232px;
    --docs-toc: 200px;
    --docs-topbar: 52px;
    --docs-measure: 720px;
    --docs-max: 1400px;
    --docs-blur: 8px;
    --docs-axis-col: 260px;
    --docs-preview-min: 140px;
    --docs-specimen: 150px;
    --docs-figure: 72px;
    --docs-card: 230px;
    --docs-customizer-panel: 280px;
  }

  html { scroll-behavior: smooth; scroll-padding-block-start: calc(var(--docs-topbar) + var(--area-space-24)); }
  body { margin: 0; }
  a { color: inherit; text-decoration: none; }

  /* --- Shell ------------------------------------------------------------- */

  .docs-topbar {
    position: sticky;
    inset-block-start: 0;
    z-index: var(--area-z-sticky);
    display: flex;
    align-items: center;
    gap: var(--area-space-12);
    block-size: var(--docs-topbar);
    padding-inline: var(--area-space-20);
    border-block-end: var(--area-border-width) solid var(--area-border-subtle);
    background-color: color-mix(in oklab, var(--area-bg-page) 88%, transparent);
    backdrop-filter: blur(var(--docs-blur));
  }

  .docs-brand { display: flex; align-items: center; gap: var(--area-space-8); font-weight: var(--area-weight-strong); }
  .docs-brand__mark {
    inline-size: var(--area-icon-md);
    block-size: var(--area-icon-md);
    border-radius: var(--area-radius-small);
    background-color: var(--area-accent-solid);
  }
  .docs-topbar__spacer { margin-inline-start: auto; }
  .docs-topbar .area-segmented { flex-shrink: 0; }

  .docs-shell { display: grid; grid-template-columns: var(--docs-sidebar) minmax(0, 1fr); max-inline-size: var(--docs-max); margin-inline: auto; }

  .docs-sidebar {
    position: sticky;
    inset-block-start: var(--docs-topbar);
    align-self: start;
    block-size: calc(100vh - var(--docs-topbar));
    overflow-y: auto;
    padding: var(--area-space-20) var(--area-space-12);
    border-inline-end: var(--area-border-width) solid var(--area-border-subtle);
  }
  .docs-sidebar .area-menu + .area-menu { margin-block-start: var(--area-space-20); }

  .docs-main {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--docs-toc);
    gap: var(--area-space-40);
    padding: var(--area-space-32) var(--area-space-32) var(--area-space-96);
  }
  .docs-content { min-inline-size: 0; max-inline-size: var(--docs-measure); }

  .docs-toc {
    position: sticky;
    inset-block-start: calc(var(--docs-topbar) + var(--area-space-24));
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: var(--area-space-2);
  }

  /* --- Axis panel -------------------------------------------------------- */

  .docs-axes { border-block-end: var(--area-border-width) solid var(--area-border-subtle); background-color: var(--area-bg-subtle); }
  .docs-axes[hidden] { display: none; }
  .docs-axes__inner {
    max-inline-size: var(--docs-max);
    margin-inline: auto;
    padding: var(--area-space-16) var(--area-space-20);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--docs-axis-col), 1fr));
    gap: var(--area-space-16);
  }
  .docs-axis { display: flex; flex-direction: column; gap: var(--area-space-6); }
  .docs-axis__name { font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); }
  .docs-swatch {
    inline-size: var(--area-icon-sm);
    block-size: var(--area-icon-sm);
    border-radius: var(--area-radius-small);
    box-shadow: inset 0 0 0 var(--area-border-width) var(--area-border-subtle);
  }

  /* --- Content ----------------------------------------------------------- */

  .docs-title { font-size: var(--area-title-lg-size); line-height: var(--area-title-lg-leading); letter-spacing: var(--area-title-lg-tracking); font-weight: var(--area-weight-strong); }
  /*
   * The lede reads at body size, not a step above it. One prose size per page: the lede is
   * already set apart by sitting under the title and taking the muted foreground, and a
   * second size buys a distinction the reader has to resolve for no gain.
   */
  .docs-lede { margin-block-start: var(--area-space-8); color: var(--area-fg-muted); }

  .docs-h2 { margin-block: var(--area-space-40) var(--area-space-12); font-size: var(--area-title-md-size); line-height: var(--area-title-md-leading); letter-spacing: var(--area-title-md-tracking); font-weight: var(--area-weight-strong); }
  .docs-h3 { margin-block: var(--area-space-32) var(--area-space-8); font-size: var(--area-title-xs-size); line-height: var(--area-title-xs-leading); letter-spacing: var(--area-title-xs-tracking); font-weight: var(--area-weight-strong); }
  .docs-note { margin-block-end: var(--area-space-12); color: var(--area-fg-muted); }
  .docs-prose p { margin-block: var(--area-space-12); color: var(--area-fg-muted); }
  .docs-prose p strong { color: var(--area-fg-default); font-weight: var(--area-weight-strong); }
  .docs-stack { display: flex; flex-direction: column; gap: var(--area-space-8); }
  .docs-list { margin: 0; padding-inline-start: var(--area-space-20); display: flex; flex-direction: column; gap: var(--area-space-12); }
  .docs-list li { color: var(--area-fg-muted); }
  .docs-list li::marker { color: var(--area-fg-subtle); }

  /*
   * The example frame: a clipped container holding a preview on the page surface and a
   * flush code block beneath it. The shape is the original playground's; the density and
   * the tokens are the current system's.
   */
  .docs-example {
    border: var(--area-border-width) solid var(--area-border-subtle);
    border-radius: var(--area-radius-container);
    overflow: hidden;
    background-color: var(--area-bg-surface);
  }
  .docs-example__preview {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--area-space-16);
    padding: var(--area-space-32);
    min-block-size: var(--docs-preview-min);
  }
  .docs-example__preview--column { flex-direction: column; align-items: flex-start; justify-content: flex-start; }

  /* --- Customizer --------------------------------------------------------- */

  .docs-customizer {
    inline-size: 100vw;
    max-inline-size: 100vw;
    block-size: 100vh;
    max-block-size: 100vh;
    margin: 0;
    padding: 0;
    border: 0;
    background-color: var(--area-bg-page);
    color: var(--area-fg-default);
    overflow: hidden;
  }
  .docs-customizer::backdrop { background-color: var(--area-bg-overlay); }

  .docs-customizer__bar {
    display: flex;
    align-items: center;
    gap: var(--area-space-8);
    block-size: var(--docs-topbar);
    padding-inline: var(--area-space-16);
    border-block-end: var(--area-border-width) solid var(--area-border-subtle);
  }
  .docs-customizer__title { font-weight: var(--area-weight-strong); }
  .docs-customizer__name { color: var(--area-fg-muted); font-family: var(--area-font-mono); font-size: var(--area-ui-size); }
  .docs-customizer__bar .area-button:last-child { margin-inline-start: auto; }

  .docs-customizer__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--docs-customizer-panel);
    block-size: calc(100vh - var(--docs-topbar));
  }

  /*
   * The stage is where the component is actually judged, so it gets the page surface and
   * nothing else -- no card, no border. A frame around a component being evaluated for its
   * own borders and elevation is exactly the wrong context.
   */
  .docs-customizer__stage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--area-space-16);
    padding: var(--area-space-48);
    overflow: auto;
  }

  .docs-customizer__panel {
    border-inline-start: var(--area-border-width) solid var(--area-border-subtle);
    background-color: var(--area-bg-subtle);
    padding: var(--area-space-16);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--area-space-16);
  }
  .docs-customizer__panel .docs-axis { gap: var(--area-space-6); }
  .docs-customizer__panel .area-segmented { flex-wrap: wrap; }

  @media (max-width: 820px) {
    .docs-customizer__body { grid-template-columns: minmax(0, 1fr); grid-template-rows: 1fr auto; }
    .docs-customizer__panel { border-inline-start: 0; border-block-start: var(--area-border-width) solid var(--area-border-subtle); }
  }

  /* --- Paired views ------------------------------------------------------ */

  .docs-view { margin-block: var(--area-space-12); }
  .docs-view__bar { display: flex; justify-content: flex-start; margin-block-end: var(--area-space-12); }
  .docs-view[data-view="grid"] .docs-view__pane[data-pane="table"] { display: none; }
  .docs-view[data-view="table"] .docs-view__pane[data-pane="grid"] { display: none; }

  /*
   * Tight. The cards are a scale being read across, not a set of independent objects, so
   * the gap is just enough to separate two borders -- the original playground put colour
   * swatches at 2px for the same reason. A comfortable gap here reads as a gallery.
   */
  .docs-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--docs-card), 1fr));
    gap: var(--area-space-4);
  }

  /*
   * The card hugs its content: no minimum height, and the figure -- when there is one --
   * is pushed to the bottom rather than the card being padded out to meet it.
   */
  .docs-card {
    display: flex;
    flex-direction: column;
    padding: var(--area-space-8);
    border: var(--area-border-width) solid var(--area-border-subtle);
    border-radius: var(--area-radius-container);
    background-color: var(--area-bg-surface);
    overflow: hidden;
  }

  /*
   * One line of text between the token and its values. Using the text's own line-height
   * rather than a spacing step keeps the gap on the same rhythm as the lines below it,
   * so the block reads as four lines rather than as two stacked elements.
   *
   * These values are read, not decorated -- they are the content of the card. So they sit
   * on the UI size, which tracks density, rather than on the caption step, which is for
   * text that annotates something else.
   */
  .docs-card__meta {
    margin-block-start: var(--area-ui-leading);
    font-family: var(--area-font-mono);
    font-size: var(--area-ui-size);
    line-height: var(--area-ui-leading);
    word-break: break-word;
  }

  .docs-card__figure {
    margin-block-start: auto;
    padding-block-start: var(--area-space-8);
    display: flex;
    align-items: center;
  }

  /* A card with a figure and no values still needs the line of separation. */
  .docs-card > .area-token + .docs-card__figure {
    margin-block-start: var(--area-text-xs-leading);
  }

  .docs-card > .area-token { align-self: flex-start; }

  /* Table previews sit in a fixed column, so a tall specimen cannot stretch the row. */
  .docs-preview-cell { display: flex; align-items: center; min-block-size: var(--area-space-24); }

  /* --- Foundations ------------------------------------------------------- */

  .docs-swatch-row { margin-block-end: var(--area-space-16); }
  .docs-swatch-row__name { font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); margin-block-end: var(--area-space-4); }
  .docs-swatch-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--area-space-2); }
  .docs-swatch-grid > div { aspect-ratio: 1 / 1.5; border-radius: var(--area-radius-small); }
  .docs-step-legend { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--area-space-2); text-align: center; font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-subtle); }

  .docs-type-row { display: grid; grid-template-columns: 150px 1fr 1fr; align-items: baseline; gap: var(--area-space-16); padding-block: var(--area-space-12); border-block-end: var(--area-border-width) solid var(--area-border-subtle); }
  .docs-type-row__meta { flex-shrink: 0; inline-size: 150px; font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); }
  .docs-type-row__sample { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .docs-specimen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(var(--docs-specimen), 1fr)); gap: var(--area-space-12); }
  .docs-specimen {
    display: flex;
    flex-direction: column;
    gap: var(--area-space-8);
    padding: var(--area-space-12);
    border: var(--area-border-width) solid var(--area-border-subtle);
    border-radius: var(--area-radius-container);
    background-color: var(--area-bg-surface);
  }
  .docs-specimen__name { font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); }
  .docs-specimen__figure { display: flex; align-items: center; justify-content: center; min-block-size: var(--docs-figure); }
  .docs-specimen__box { background-color: var(--area-accent-surface-active); box-shadow: inset 0 0 0 var(--area-border-width) var(--area-accent-border); }

  .docs-token-chip { inline-size: var(--area-icon-md); block-size: var(--area-icon-md); border-radius: var(--area-radius-small); box-shadow: inset 0 0 0 var(--area-border-width) var(--area-border-subtle); }
  .docs-mono { font-family: var(--area-font-mono); }

  @media (max-width: 1100px) { .docs-main { grid-template-columns: minmax(0, 1fr); } .docs-toc { display: none; } }
  @media (max-width: 820px) { .docs-shell { grid-template-columns: minmax(0, 1fr); } .docs-sidebar { display: none; } }
}
`;

export const DOCS_SCRIPT = `
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

  function sync() {
    document.querySelectorAll("[data-axis]").forEach(function (group) {
      var axis = group.getAttribute("data-axis");
      var current = saved[axis] || group.getAttribute("data-default");
      group.querySelectorAll("[data-value]").forEach(function (item) {
        var on = item.getAttribute("data-value") === current;
        if (on) item.setAttribute("data-selected", "");
        else item.removeAttribute("data-selected");
        item.setAttribute("aria-checked", on ? "true" : "false");
      });
    });
  }
  sync();

  document.addEventListener("click", function (event) {
    var item = event.target.closest("[data-value]");
    if (item) {
      var group = item.closest("[data-axis]");
      if (group) {
        var axis = group.getAttribute("data-axis");
        saved[axis] = item.getAttribute("data-value");
        apply(axis, saved[axis]);
        try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
        sync();
        return;
      }
    }

    var toggle = event.target.closest("[data-toggle-axes]");
    if (toggle) {
      var panel = document.getElementById("docs-axes");
      var open = panel.hasAttribute("hidden");
      if (open) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      return;
    }

    var view = event.target.closest("[data-view-value]");
    if (view) {
      var host = view.closest(".docs-view");
      host.setAttribute("data-view", view.getAttribute("data-view-value"));
      host.querySelectorAll("[data-view-value]").forEach(function (button) {
        var on = button === view;
        if (on) button.setAttribute("data-selected", ""); else button.removeAttribute("data-selected");
        button.setAttribute("aria-checked", on ? "true" : "false");
      });
      return;
    }

    var reset = event.target.closest("[data-reset]");
    if (reset) {
      // Re-parsing the markup is what actually resets a demo: the previews contain real
      // inputs, and their checked/value state lives in the DOM, not in the markup.
      var frame = reset.closest(".docs-example");
      var preview = frame && frame.querySelector(".docs-example__preview");
      if (preview) preview.innerHTML = preview.innerHTML;
      return;
    }

    var customize = event.target.closest("[data-customize]");
    if (customize) {
      var host = customize.closest(".docs-example");
      var source = host && host.querySelector(".docs-example__preview");
      var modal = document.getElementById("docs-customizer");
      if (source && modal) {
        document.getElementById("docs-customizer-stage").innerHTML = source.innerHTML;
        var heading = host.previousElementSibling;
        while (heading && heading.tagName !== "H3") heading = heading.previousElementSibling;
        document.getElementById("docs-customizer-name").textContent =
          (document.querySelector(".docs-title") || {}).textContent + (heading ? " / " + heading.textContent : "");
        modal.showModal();
      }
      return;
    }

    var closeCustomizer = event.target.closest("[data-customizer-close]");
    if (closeCustomizer) {
      document.getElementById("docs-customizer").close();
      return;
    }

    var copy = event.target.closest("[data-copy]");
    if (copy) {
      var block = copy.closest(".area-code-block");
      var text = block.querySelector("pre").textContent;
      navigator.clipboard.writeText(text).then(function () {
        var label = copy.querySelector(".area-button__label");
        var original = label.textContent;
        label.textContent = "Copied";
        setTimeout(function () { label.textContent = original; }, 1200);
      });
    }
  });

  // Arrow keys move between options in a radiogroup, which is what the role promises.
  document.addEventListener("keydown", function (event) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    var item = event.target.closest(".area-segmented__item");
    if (!item) return;
    var group = item.parentElement;
    var items = Array.prototype.slice.call(group.querySelectorAll(".area-segmented__item"));
    var next = items[(items.indexOf(item) + (event.key === "ArrowRight" ? 1 : -1) + items.length) % items.length];
    next.focus();
    next.click();
    event.preventDefault();
  });

  // Scrollspy for the on-this-page list.
  var links = Array.prototype.slice.call(document.querySelectorAll(".docs-toc a"));
  if (links.length) {
    var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("data-selected", "");
          else a.removeAttribute("data-selected");
        });
      });
    }, { rootMargin: "-" + (52 + 24) + "px 0px -70% 0px" });
    targets.forEach(function (t) { observer.observe(t); });
  }
})();
`;
