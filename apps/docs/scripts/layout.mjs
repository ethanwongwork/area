import { restoreAxisPreferences } from "./axis-preferences.mjs";
import { AXIS_PRESETS } from "@area/tokens/config";
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

/**
 * A chrome button: icon only, with the label carried by `aria-label` instead of a span.
 *
 * These sit on top of content rather than in a bar of their own -- Copy on the code,
 * Customize on a preview -- and at that size a word beside the glyph is what makes a
 * floating control read as an obstruction.
 */
function toolbarButton(icon, label, attr, variant = "outline") {
  return `<button type="button" class="area-button area-button--${variant} area-button--neutral area-button--sm area-button--icon-only" aria-label="${escapeHtml(label)}" ${attr}>
      <span class="area-button__icon" aria-hidden="true">${ICONS[icon]}</span>
    </button>`;
}

/** A code block with a copy button, in the shape the design system defines. */
/** Opens the fullscreen axis panel. Ghost, because it floats on the preview it acts on. */
export function customizeButton() {
  return toolbarButton("expand", "Customize", "data-customize", "ghost");
}

export function codeBlock(code, { flush = false, wrap = true } = {}) {
  const cls = ["area-code-block", flush && "area-code-block--flush", wrap && "area-code-block--wrap"]
    .filter(Boolean)
    .join(" ");

  // Only a block long enough to need it gets the control; wrapping a three-line import in
  // "Show code" would cost a row to hide nothing.
  const COLLAPSE_AFTER = 8;
  const collapsible = code.split("\n").length > COLLAPSE_AFTER;
  const collapsed = collapsible ? " data-collapsed" : "";

  const pre = `<pre class="area-code-block__pre"><code>${highlight(code)}</code></pre>`;
  const body = collapsible
    ? `<div class="area-code-block__body">${pre}
    <button type="button" class="area-code-block__toggle" data-code-toggle aria-expanded="false">
      <span data-code-toggle-label>Show code</span>
    </button>
  </div>`
    : `<div class="area-code-block__body">${pre}</div>`;

  // Copy is the block's only action. Reset is gone -- it undid a customisation the axis
  // panel already reverts, from a button most readers never had reason to press -- and
  // Customize moved onto the preview it acts on.
  return `<div class="${cls}"${collapsed}>
  <span class="area-code-block__actions">${toolbarButton("copy", "Copy code", "data-copy")}</span>
  ${body}
</div>`;
}

/**
 * The fullscreen customizer.
 *
 * One per page, reused by every example. Opening it copies that example's rendered preview
 * onto a stage and puts every axis beside it, so a component can be pushed through the
 * whole system at a size worth looking at.
 *
 * It is handed the docked inspector's own body rather than a second set of controls, so
 * the two cannot drift: every control carries `data-axis`, one delegated handler drives
 * both, and one sync writes both. Because custom properties inherit into the top layer, a
 * change made here repaints the page behind it as well.
 */
export function customizer(inspectorHtml) {
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
    <aside class="docs-customizer__panel"><div class="docs-inspector__body">${inspectorHtml}</div></aside>
  </div>
</dialog>`;
}

/** Names a token, optionally with a swatch of what it resolves to. */
export function tokenChip(name, { swatch, onColor = false } = {}) {
  return `<code class="area-code area-code--swatch docs-token-chip${onColor ? " area-code--on-color" : ""}">${
    swatch ? `<span class="area-code__swatch" style="background:${swatch}" aria-hidden="true"></span>` : ""
  }<span class="area-code__label">${escapeHtml(name)}</span></code>`;
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
    `<button type="button" role="radio" class="area-segmented__item" data-view-value="${value}" aria-checked="${value === initial}"${value === initial ? " data-selected" : ""}><span class="area-segmented__label">${label}</span></button>`;

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
    --docs-sidebar: 208px;
    /*
     * The site's own spacing, derived from the density axis rather than fixed, so the
     * documentation tightens with the system it documents instead of staying put while the
     * components around it shrink.
     *
     * --docs-pad is the interior inset -- the Customize button's offset inside a preview,
     * the customizer dialog's own chrome. --docs-gutter is the page's, one tier up.
     *
     * The two rails do not read either of these. They are area-panel --xs, so their inset
     * is the panel's own tier on the gutter ramp, which is what a component's padding has
     * to come from if a compact panel is to tighten like the controls inside it.
     */
    --docs-pad: var(--area-gutter-sm);
    /*
     * One 4px step above the widest gutter. The page had the density ramp's own top stop,
     * which is the right inset for a control's interior and slightly tight as the margin
     * of a document; the step keeps it on the ramp and still moving with density.
     */
    --docs-gutter: calc(var(--area-gutter-xl) + var(--area-space-4));
    /*
     * The customizer dialog's own bar. The rails derive theirs from area-panel instead;
     * this one is a dialog, not a panel, and is the only bar left that is neither.
     */
    --docs-topbar: calc(var(--area-control-sm) + var(--area-gutter-md) * 2 + var(--area-border-width));
    --docs-measure: 720px;
    --docs-max: 1400px;
    --docs-blur: 8px;
    --docs-inspector: 248px;
    --docs-toc: 192px;
    --docs-preview-min: calc(var(--area-space-96) * 3);
    --docs-specimen: 150px;
    --docs-figure: 72px;
    --docs-card: 230px;
    --docs-card-sm: 88px;
    --docs-customizer-panel: 280px;
  }

  html { scroll-behavior: smooth; scroll-padding-block-start: var(--docs-gutter); }
  body { margin: 0; }
  a { color: inherit; text-decoration: none; }

  /* --- Shell ------------------------------------------------------------- */

  /* --- Rails -------------------------------------------------------------- */

  /*
   * There is no page header. Each rail is an area-panel --flush carrying its own bar, and
   * because both are panels at the same tier their bars derive the same height -- so the
   * wordmark on the left and the panel title on the right sit on one line with the
   * document between them. That is the shape Figma, Framer and ChatGPT converge on once
   * the chrome is rails rather than a strip across the top.
   *
   * The seam is a pseudo-element rather than a border. A docked panel has no border by
   * design, and a docs rule adding one back would be written in area.base and lose to
   * area.components without saying so -- the exact failure the audit exists to catch.
   */
  /*
   * Placed explicitly, not auto-placed. A closed rail is display:none, which takes it out
   * of the grid altogether rather than leaving an empty track -- so with auto-placement the
   * document slid left into the collapsed column and rendered one character wide. Naming
   * each child's column makes a hidden rail cost its track and nothing else.
   */
  .docs-sidebar { grid-column: 1; }
  .docs-main { grid-column: 2; }
  .docs-inspector { grid-column: 3; }

  .docs-sidebar,
  .docs-inspector {
    position: sticky;
    inset-block-start: 0;
    align-self: start;
    block-size: 100vh;
  }

  .docs-sidebar::after,
  .docs-inspector::after {
    content: "";
    position: absolute;
    inset-block: 0;
    inline-size: var(--area-border-width);
    background-color: var(--area-border-decorative);
  }

  .docs-sidebar { position: sticky; }
  .docs-sidebar::after { inset-inline-end: 0; }
  .docs-inspector::after { inset-inline-start: 0; }

  .docs-sidebar__body { padding-block-start: 0; }

  /* Rails are denser than a floating inspector: normal-sized controls, smaller inset. */
  /*
   * The seam between nav groups. Each group already opens with a label that occupies a full
   * item row, so the label is doing most of the separating on its own -- 12 on top of that
   * read as a gap between three lists rather than as one list with headings.
   */
  .docs-sidebar__group + .docs-sidebar__group { margin-block-start: 0; }
  .docs-sidebar__complete-marker {
    inline-size: var(--area-space-6);
    block-size: var(--area-space-6);
    border-radius: var(--area-radius-full);
    background-color: var(--area-accent-solid);
  }

  .docs-inspector__actions { display: flex; align-items: center; gap: var(--area-space-2); }

  /*
   * The wordmark is set in the mono face and lower case. A mono wordmark sits on the
   * system's own grid rather than beside it, and lower case keeps it from competing with
   * the page title.
   *
   * One role above the UI size, not two: sharing a bar with a 28px icon button, a large
   * role out-measured the control beside it and the pair stopped reading as one bar.
   */
  .docs-wordmark {
    display: flex;
    align-items: center;
    /*
     * The bar and body share the panel inset. A menu heading then takes its own 8px optical
     * inset, so the wordmark takes that same 8px step. This aligns the wordmark with the
     * section-heading ink and an icon viewport's leading edge; a row without an icon does
     * not reserve an empty lane merely to satisfy the sidebar chrome.
     */
    font-family: var(--area-font-mono);
    font-size: var(--area-text-md-size);
    /* One line, centred by the bar: it takes the cap height it needs, the bar the leading. */
    line-height: 1;
    font-weight: var(--area-weight-strong);
    letter-spacing: var(--area-text-md-tracking);
    text-transform: lowercase;
    /* Align the wordmark's painted left edge with the shared sidebar content edge. */
    margin-inline-start: var(--area-space-8);
  }

  /*
   * The corner copy of a rail toggle. It waits at the page corner for when its rail is
   * closed, which is where the control has to be -- a toggle that leaves with the thing it
   * reopens cannot bring it back. Fixed rather than in the grid, so a closed rail costs no
   * column and the document takes the width back.
   */
  .docs-rail-toggle {
    position: fixed;
    inset-block-start: var(--area-gutter-xs);
    z-index: var(--area-z-sticky);
  }

  .docs-rail-toggle[data-rail="nav"] { inset-inline-start: var(--area-gutter-xs); }
  .docs-rail-toggle[data-rail="panel"] { inset-inline-end: var(--area-gutter-xs); }

  .docs-shell[data-nav="closed"] { --docs-col-nav: 0px; }
  /* Closing the panel hands the column to the outline, which is the rail's other occupant. */
  .docs-shell[data-panel="closed"] { --docs-col-side: var(--docs-toc); }
  .docs-shell[data-panel="closed"][data-toc="none"] { --docs-col-side: 0px; }

  /*
   * With no rail on that side, the document would start under the corner toggle.
   *
   * Symmetric when the nav is closed, even though only one side has a toggle to clear:
   * auto margins centre within the *padding* box, so clearing one side alone put the
   * measure 28px left of centre -- centred by the box and visibly not by the window.
   */
  .docs-shell[data-nav="closed"] .docs-main { padding-inline: calc(var(--docs-gutter) + var(--area-control-sm)); }
  .docs-shell[data-nav="open"][data-panel="closed"][data-toc="none"] .docs-main { padding-inline-end: calc(var(--docs-gutter) + var(--area-control-sm)); }

  /*
   * Centred once the nav is gone. With a rail on the left the measure is read against it
   * and belongs at the start of its column; with nothing there, a column of text pinned to
   * the left of a wide window reads as a layout that failed rather than one that chose.
   */
  .docs-shell[data-nav="closed"] .docs-content { margin-inline: auto; }

  /*
   * Two of the three columns vary, so each is a variable and every state sets one of them.
   * Written as four full grid-template-columns declarations it needed a rule per
   * combination, and the nav-closed-and-panel-closed case had to repeat both.
   */
  .docs-shell {
    display: grid;
    grid-template-columns: var(--docs-col-nav) minmax(0, 1fr) var(--docs-col-side);
    --docs-col-nav: var(--docs-sidebar);
    --docs-col-side: var(--docs-inspector);
    max-inline-size: var(--docs-max);
    margin-inline: auto;
  }

  .docs-rail-resizer {
    position: absolute;
    inset-block: 0;
    z-index: var(--area-z-sticky);
    inline-size: var(--area-space-12);
    padding: 0;
    border: 0;
    background: transparent;
    cursor: col-resize;
    touch-action: none;
  }
  .docs-sidebar .docs-rail-resizer { inset-inline-end: calc(var(--area-space-6) * -1); }
  .docs-inspector .docs-rail-resizer { inset-inline-start: calc(var(--area-space-6) * -1); }
  .docs-rail-resizer:focus-visible { outline: none; }
  .docs-rail-resizer:focus-visible::after {
    content: "";
    position: absolute;
    inset-block: 0;
    inset-inline: calc(var(--area-space-4) + var(--area-border-width));
    background-color: var(--area-focus-color);
  }

  .docs-sidebar {
    position: sticky;
    inset-block-start: 0;
    align-self: start;
    block-size: 100vh;
    display: flex;
    flex-direction: column;
    min-block-size: 0;
    border-inline-end: var(--area-border-width) solid var(--area-border-decorative);
  }


  .docs-main {
    padding: var(--docs-gutter) var(--docs-gutter) calc(var(--docs-gutter) * 4);
  }
  .docs-content { min-inline-size: 0; max-inline-size: var(--docs-measure); }

  /*
   * Layout only -- area-menu owns the list's geometry. The outline shares column three with
   * the inspector and the two never show together, so both are sticky from the same edge.
   */
  .docs-toc {
    grid-column: 3;
    position: sticky;
    inset-block-start: var(--docs-gutter);
    align-self: start;
    margin-block: var(--docs-gutter);
    margin-inline-end: var(--docs-gutter);
  }

  /* Gallery frames are document layout, never component skins. */
  .docs-content--wide { max-inline-size: none; }
  .docs-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--area-space-64) * 4 + var(--area-space-32))), 1fr));
    gap: var(--area-space-16);
    margin-block-start: var(--area-space-24);
  }
  .docs-gallery-tile {
    aspect-ratio: 1;
    min-inline-size: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    border: 1px solid var(--area-border-decorative);
    border-radius: var(--area-radius-container);
    background: var(--area-bg-surface);
  }
  .docs-gallery-tile__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--area-space-8);
    padding: var(--area-gutter-md);
    padding-block-end: 0;
  }
  .docs-gallery-tile__title {
    margin: 0;
    font-size: var(--area-ui-size);
    line-height: var(--area-ui-leading);
    font-weight: var(--area-weight-regular);
  }
  .docs-gallery-tile__preview {
    min-inline-size: 0;
    min-block-size: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--area-gutter-md);
  }
  .docs-gallery-tile__specimen {
    min-inline-size: 0;
    inline-size: 100%;
    max-inline-size: calc(var(--area-space-64) * 4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .docs-gallery-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--area-space-12);
    inline-size: 100%;
    min-inline-size: 0;
  }
  .docs-gallery-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--area-space-8);
  }
  .docs-gallery-caption {
    color: var(--area-fg-muted);
    font-size: var(--area-ui-size);
    line-height: var(--area-ui-leading);
  }

  /* The visual gallery is a full-screen inspection surface. Its persistent right rail
   * uses the same axis controls as the documentation shell, so every specimen changes
   * together while the family grid keeps its uniform tile scale. */
  .docs-visual-gallery {
    min-block-size: 100vh;
    padding: var(--area-space-8);
    background: var(--area-bg-subtle);
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--docs-gallery-rail, minmax(var(--area-space-80), calc(var(--area-space-80) * 3)));
    align-items: start;
    gap: var(--area-space-8);
  }
  .docs-visual-gallery[data-gallery-panel="closed"] {
    --docs-gallery-rail: var(--area-space-12);
  }
  .docs-visual-gallery__content {
    min-inline-size: 0;
  }
  .docs-visual-gallery__inspector {
    position: sticky;
    inset-block-start: var(--area-space-8);
    max-block-size: calc(100vh - var(--area-space-16));
    overflow: auto;
    min-inline-size: 0;
    transition: inline-size 160ms ease, opacity 160ms ease;
  }
  .docs-visual-gallery__inspector-actions {
    display: flex;
    align-items: center;
    gap: var(--area-space-2);
  }
  .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__inspector {
    overflow: hidden;
  }
  .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__inspector-title,
  .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__inspector-body,
  .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__inspector [data-reset-axes] {
    display: none;
  }
  .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__inspector-bar {
    justify-content: center;
    padding-inline: 0;
  }
  .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__inspector-actions {
    display: block;
  }
  .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__rail-toggle {
    transform: rotate(180deg);
  }
  .docs-audit-label[data-audit="complete"],
  .docs-visual-gallery__tile[data-audit="complete"] .docs-visual-gallery__tile-title {
    color: var(--area-green-500);
  }
  .docs-audit-label[data-audit="unrefined"],
  .docs-visual-gallery__tile[data-audit="unrefined"] {
    background: var(--area-red-25);
    color: var(--area-red-500);
  }
  .docs-audit-label {
    display: inline-block;
    padding: var(--area-space-2) var(--area-space-4);
    border-radius: var(--area-radius-small);
  }
  .docs-gallery-index {
    display: grid;
    gap: var(--area-space-16);
    margin-block: var(--area-space-24);
  }
  .docs-gallery-index__links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--area-space-8);
  }
  .docs-visual-gallery__header {
    margin-block-end: var(--area-space-8);
  }
  .docs-visual-gallery__title,
  .docs-visual-gallery__section-title,
  .docs-visual-gallery__tile-title {
    margin: 0;
    font-weight: var(--area-weight-regular);
  }
  .docs-visual-gallery__title {
    font-size: var(--area-text-xl-size);
    line-height: var(--area-text-xl-leading);
  }
  .docs-visual-gallery__section + .docs-visual-gallery__section {
    margin-block-start: var(--area-space-8);
  }
  .docs-visual-gallery__section-title {
    margin-block-end: var(--area-space-8);
    font-size: var(--area-ui-size);
    line-height: var(--area-ui-leading);
  }
  .docs-visual-gallery__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, calc(var(--area-space-64) * 4)), 1fr));
    gap: var(--area-space-8);
  }
  .docs-visual-gallery__tile {
    aspect-ratio: 1;
    min-inline-size: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    border: 1px solid var(--area-border-decorative);
    background: var(--area-bg-surface);
    border-radius: var(--area-radius-container);
  }
  .docs-visual-gallery__tile--expanded { aspect-ratio: auto; grid-column: 1 / -1; }
  .docs-visual-gallery__tile-title {
    padding: var(--area-space-12);
    font-size: var(--area-ui-size);
    line-height: var(--area-ui-leading);
  }
  .docs-visual-gallery__tile-preview {
    min-inline-size: 0;
    min-block-size: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--area-space-12);
  }
  .docs-visual-gallery__tile--large .docs-visual-gallery__tile-preview {
    padding: var(--area-space-24);
  }
  .docs-visual-gallery__tile-preview > * {
    max-inline-size: 100%;
  }
  @media (max-width: 980px) {
    .docs-visual-gallery { display: block; }
    .docs-visual-gallery__inspector { position: static; max-block-size: none; margin-block-start: var(--area-space-8); }
    .docs-visual-gallery[data-gallery-panel="closed"] .docs-visual-gallery__inspector { inline-size: var(--area-space-12); margin-inline-start: auto; }
  }

  /* --- Icon browser ------------------------------------------------------- */

  /*
   * A field of marks with its controls above it. The cell is square because the mark is:
   * every glyph is authored on a 16 grid and a square cell is the only one that gives the
   * wide ones and the tall ones the same room, which is what lets the eye sweep a column
   * without re-centring on each row.
   *
   * The grid auto-fills rather than fixing a column count, so the same page works beside an
   * open inspector and with both rails closed.
   */
  .docs-iconbrowser {
    --docs-icon-size: var(--area-icon-lg);
    margin-block-end: var(--docs-gutter);
  }

  .docs-iconbrowser__bar {
    position: sticky;
    inset-block-start: 0;
    z-index: var(--area-z-sticky);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--area-space-8);
    padding-block: var(--area-space-12);
    background-color: var(--area-bg-page);
  }

  .docs-iconbrowser__search { flex: 1 1 var(--docs-specimen); }
  .docs-iconbrowser__size { display: flex; align-items: center; gap: var(--area-space-8); }
  /*
   * flex-basis, not inline-size. The slider sets inline-size: 100% in area.components so it
   * fills a panel row, and a width written here would lose to it silently -- but a flex item
   * takes its main size from flex-basis, which the component does not set. The audit allows
   * the property for exactly this reason.
   */
  .docs-iconbrowser__size .area-slider { flex: 0 0 var(--docs-figure); }
  .docs-iconbrowser__count { color: var(--area-fg-muted); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); }

  .docs-iconbrowser__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--docs-card-sm), 1fr));
    gap: var(--area-space-2);
  }

  .docs-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--area-space-6);
    aspect-ratio: 1;
    padding: var(--area-space-6);
    border: 0;
    border-radius: var(--area-radius-container);
    background: transparent;
    color: var(--area-fg-default);
    font-family: inherit;
    cursor: pointer;
    transition: var(--area-transition);
  }

  .docs-icon:hover { background-color: var(--area-bg-hover); }
  .docs-icon:focus-visible { outline: none; outline: var(--area-focus-width) solid var(--area-focus-color); outline-offset: var(--area-focus-offset); }
  .docs-icon[data-copied] { background-color: var(--area-accent-surface); color: var(--area-fg-accent); }

  .docs-icon__mark {
    display: inline-flex;
    inline-size: var(--docs-icon-size);
    block-size: var(--docs-icon-size);
    transition: var(--area-transition);
  }
  .docs-icon__mark > svg { inline-size: 100%; block-size: 100%; fill: currentColor; }

  /*
   * The name is the smallest step the type ramp has and still clips on the long end --
   * text-align-distribute-vertical is 33 characters against a cell built for a 16px mark.
   * Truncated rather than wrapped: two lines would make the cell the tallest thing in its
   * row and break the square the grid is built on.
   */
  .docs-icon__name {
    max-inline-size: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: var(--area-text-xs-size);
    line-height: var(--area-text-xs-leading);
    color: var(--area-fg-muted);
  }

  .docs-iconbrowser__empty { color: var(--area-fg-muted); }

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
  .docs-list li::marker { color: var(--area-fg-muted); }

  /*
   * The example frame: a clipped container holding a preview on the page surface and a
   * flush code block beneath it. The shape is the original playground's; the density and
   * the tokens are the current system's.
   */
  .docs-example {
    border: var(--area-border-width) solid var(--area-border-decorative);
    border-radius: var(--area-radius-container);
    overflow: hidden;
    background-color: var(--area-bg-surface);
  }
  /*
   * Customize acts on the preview, so it sits on the preview. In a shared toolbar below it
   * was equidistant from the thing it changed and the thing it did not.
   */
  .docs-example__preview {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    align-content: center;
    gap: var(--area-space-24);
    padding: var(--area-space-32);
    min-block-size: var(--docs-preview-min);
  }
  .docs-example__preview--column { align-items: center; justify-content: center; }
  .docs-example__actions {
    position: absolute;
    inset-block-start: var(--docs-pad);
    inset-inline-end: var(--docs-pad);
  }

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
    border-block-end: var(--area-border-width) solid var(--area-border-decorative);
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

  /*
   * The dialog's panel is the same inspector, so it owns only the seam between itself and
   * the stage. Everything inside it -- inset, section rules, row geometry -- comes from
   * .docs-inspector__body, which is what keeps the docked panel and this one from
   * drifting apart as controls are added.
   */
  .docs-customizer__panel {
    display: flex;
    flex-direction: column;
    min-block-size: 0;
    border-inline-start: var(--area-border-width) solid var(--area-border-decorative);
    background-color: var(--area-bg-subtle);
  }


  @media (max-width: 820px) {
    .docs-customizer__body { grid-template-columns: minmax(0, 1fr); grid-template-rows: 1fr auto; }
    .docs-customizer__panel { border-inline-start: 0; border-block-start: var(--area-border-width) solid var(--area-border-decorative); }
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
  /*
   * A card is a table row in another shape, so it is set like one.
   *
   * It carried no font-size of its own and inherited the page's 16px, which made every badge
   * inside it resolve its 0.875em against the wrong number -- 14px in a card against 12.25px
   * in a cell, for the same token. The padding matches a cell's for the same reason: the two
   * views show identical rows and the toggle between them should change the arrangement, not
   * the type.
   */
  .docs-card {
    display: flex;
    flex-direction: column;
    padding: var(--area-space-10) var(--area-space-12);
    border: var(--area-border-width) solid var(--area-border-decorative);
    border-radius: var(--area-radius-container);
    background-color: var(--area-bg-surface);
    font-size: var(--area-ui-size);
    line-height: var(--area-ui-leading);
    overflow: hidden;
  }

  /*
   * One line of text between the token and its values. Using the text's own line-height
   * rather than a spacing step keeps the gap on the same rhythm as the lines below it,
   * so the block reads as four lines rather than as two stacked elements.
   *
   * The size comes from the card now rather than being restated here, so a cell and a card
   * cannot drift apart.
   */
  .docs-card__meta {
    margin-block-start: var(--area-ui-leading);
    font-family: var(--area-font-mono);
    word-break: break-word;
  }

  .docs-card__figure {
    margin-block-start: auto;
    padding-block-start: var(--area-space-8);
    display: flex;
    align-items: center;
  }

  /* A card with a figure and no values still needs the line of separation. */
  .docs-card > .docs-token-chip + .docs-card__figure {
    margin-block-start: var(--area-text-xs-leading);
  }

  .docs-card > .docs-token-chip { align-self: flex-start; }

  /* Table previews sit in a fixed column, so a tall specimen cannot stretch the row. */
  .docs-preview-cell { display: flex; align-items: center; min-block-size: var(--area-space-24); }

  /* --- Foundations ------------------------------------------------------- */

  .docs-swatch-row { margin-block-end: var(--area-space-16); }
  .docs-swatch-row__name { font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); margin-block-end: var(--area-space-4); }
  .docs-swatch-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--area-space-2); }
  .docs-swatch-grid > div { aspect-ratio: 1 / 1.5; border-radius: var(--area-radius-small); }
  .docs-step-legend { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--area-space-2); text-align: center; font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); }

  .docs-type-row { display: grid; grid-template-columns: 150px 1fr 1fr; align-items: baseline; gap: var(--area-space-16); padding-block: var(--area-space-12); border-block-end: var(--area-border-width) solid var(--area-border-decorative); }
  .docs-type-row__meta { flex-shrink: 0; inline-size: 150px; font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); }
  .docs-type-row__sample { min-inline-size: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .docs-specimen-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(var(--docs-specimen), 1fr)); gap: var(--area-space-12); }
  .docs-specimen {
    display: flex;
    flex-direction: column;
    gap: var(--area-space-8);
    padding: var(--area-space-12);
    border: var(--area-border-width) solid var(--area-border-decorative);
    border-radius: var(--area-radius-container);
    background-color: var(--area-bg-surface);
  }
  .docs-specimen__name { font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); color: var(--area-fg-muted); }
  .docs-specimen__figure { display: flex; align-items: center; justify-content: center; min-block-size: var(--docs-figure); }
  .docs-specimen__box { background-color: var(--area-accent-surface-active); box-shadow: inset 0 0 0 var(--area-border-width) var(--area-accent-border); }

  /*
   * The preview swatch. Deliberately the same radius expression as the badge's own swatch --
   * the small radius less the padding it would be inset by -- so a colour shown beside a
   * token name and the same colour shown in a preview column read as one object. At the bare
   * small radius it was 75% of the way to a circle, which reads as a status dot.
   */
  .docs-token-chip { inline-size: var(--area-icon-md); block-size: var(--area-icon-md); border-radius: max(0px, calc(var(--area-radius-small) - var(--area-space-2))); box-shadow: inset 0 0 0 var(--area-border-width) var(--area-border-subtle); }
  .docs-mono { font-family: var(--area-font-mono); }

  /* Narrow rails open in document flow. No overlaid content or modal behavior is implied. */
  @media (max-width: 1100px) {
    .docs-shell { grid-template-columns: var(--docs-col-nav) minmax(0, 1fr); }
    .docs-main { grid-column: 2; padding-block-start: calc(var(--docs-gutter) + var(--area-control-sm)); }
    .docs-sidebar { grid-column: 1; }
    .docs-inspector {
      grid-column: 1 / -1;
      grid-row: 1;
      position: relative;
      block-size: auto;
      max-block-size: 60vh;
    }
    .docs-shell[data-panel="open"] .docs-main,
    .docs-shell[data-panel="open"] .docs-sidebar { grid-row: 2; }
  }
  @media (max-width: 820px) {
    .docs-shell { grid-template-columns: minmax(0, 1fr); }
    .docs-shell .docs-sidebar {
      grid-column: 1;
      grid-row: 1;
      position: relative;
      block-size: auto;
      max-block-size: 60vh;
    }
    .docs-shell .docs-inspector { grid-row: 2; }
    .docs-shell[data-nav="closed"] .docs-main,
    .docs-shell[data-nav="open"] .docs-main,
    .docs-shell[data-nav="open"][data-panel="closed"][data-toc="none"] .docs-main {
      grid-column: 1;
      grid-row: 3;
      padding-inline: var(--docs-gutter);
    }
  }
}
/*
 * Rail visibility, in area.utilities rather than area.base.
 *
 * Both targets carry an Area class -- the corner toggle is an area-button, each rail is an
 * area-panel -- and both of those set display in area.components. A display rule written
 * in area.base loses to them silently, which is the exact failure the dogfood audit was
 * built to catch; it did not catch this one only because these selectors name no .area-
 * class themselves. The layer order declares utilities after components precisely so a
 * rule like this can win without !important, so this is the sanctioned door, not a
 * workaround.
 *
 * Which copy of a toggle shows is therefore a function of a server-rendered attribute: the
 * page is correct before the script runs, and the script only ever writes that attribute.
 * The corner copies are rendered after the shell because ~ is a following-sibling
 * combinator -- written before it, the rule matched nothing and both copies painted at
 * once, the corner one sitting on top of the wordmark.
 */
@layer area.utilities {
  .docs-shell[data-nav="open"] ~ .docs-rail-toggle[data-rail="nav"],
  .docs-shell[data-panel="open"] ~ .docs-rail-toggle[data-rail="panel"] { display: none; }

  .docs-shell[data-nav="closed"] .docs-sidebar,
  .docs-shell[data-panel="closed"] .docs-inspector,
  .docs-shell[data-panel="open"] .docs-toc { display: none; }

  /* A filtered-out cell. Here because .docs-icon is a button, and area.components sets its display. */
  .docs-icon[hidden] { display: none; }
  /* The outline has no independent column at these widths. */
  @media (max-width: 1100px) { .docs-toc { display: none; } }
  @media (max-width: 1100px) { .docs-rail-resizer { display: none; } }
}

`;

export const DOCS_SCRIPT = `
  // Show / hide code. Collapsed is the server-rendered state, so a block is never briefly
  // full-height before the script runs.
  document.querySelectorAll("[data-code-toggle]").forEach(function (button) {
    var block = button.closest(".area-code-block");
    var label = button.querySelector("[data-code-toggle-label]");
    button.addEventListener("click", function () {
      var collapsed = block.hasAttribute("data-collapsed");
      if (collapsed) block.removeAttribute("data-collapsed");
      else block.setAttribute("data-collapsed", "");
      button.setAttribute("aria-expanded", String(collapsed));
      label.textContent = collapsed ? "Hide code" : "Show code";
      // Re-collapsing from below the fold would otherwise leave the viewport mid-page.
      if (!collapsed) block.scrollIntoView({ block: "nearest" });
    });
  });

/*
 * Rail collapse.
 *
 * The state lives on the shell as data-nav / data-panel, which CSS reads to decide both
 * the grid columns and which copy of each toggle is on screen -- so this handler only ever
 * writes one attribute. The server renders both rails open, and the stored state is
 * applied before paint by the inline script rather than after, so a reader who closed the
 * nav does not watch it close again on every navigation.
 */
/*
 * The icon browser.
 *
 * Every cell is server-rendered and filtering only hides, so the grid is whole before this
 * runs. Three filters compose -- a search term, a source, and a style -- and each writes the
 * browser's own state rather than touching cells directly, so adding a fourth is one line
 * here and one in the predicate.
 *
 * Style swaps the sprite the whole grid points at. The two files hold the same ids under
 * the same names, which is what lets one href rewrite change 1,739 marks at once.
 */
(function () {
  var browser = document.getElementById("icon-browser");
  if (!browser) return;

  var grid = browser.querySelector("[data-icon-grid]");
  var cells = Array.prototype.slice.call(grid.querySelectorAll(".docs-icon"));
  var countEl = browser.querySelector("[data-icon-count]");
  var emptyEl = browser.querySelector("[data-icon-empty]");
  var term = "";

  function render() {
    var source = browser.getAttribute("data-source");
    var shown = 0;
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var ok =
        (source === "all" || cell.getAttribute("data-source") === source) &&
        (term === "" || cell.getAttribute("data-terms").indexOf(term) >= 0);
      // Only touch the attribute when it actually changes: writing all 1,739 on every
      // keystroke is what makes a grid this size feel slow.
      if (ok === cell.hasAttribute("hidden")) {
        if (ok) cell.removeAttribute("hidden");
        else cell.setAttribute("hidden", "");
      }
      if (ok) shown++;
    }
    countEl.textContent = shown === cells.length ? shown + " icons" : shown + " of " + cells.length;
    if (shown === 0) emptyEl.removeAttribute("hidden");
    else emptyEl.setAttribute("hidden", "");
  }
  render();

  browser.addEventListener("input", function (event) {
    var target = event.target;

    if (target.hasAttribute("data-icon-search")) {
      term = target.value.trim().toLowerCase();
      return render();
    }

    var slider = target.closest("[data-icon-size]");
    if (slider) {
      browser.style.setProperty("--docs-icon-size", target.value + "px");
      browser.querySelector("[data-icon-size-value]").textContent = target.value;
      slider.style.setProperty("--_pct", ((target.value - 16) / 32) * 100 + "%");
    }
  });

  browser.addEventListener("click", function (event) {
    var style = event.target.closest("[data-icon-style]");
    if (style) {
      var value = style.getAttribute("data-icon-style");
      browser.setAttribute("data-style", value);
      var file = value === "filled" ? "./icons-filled.svg" : "./icons.svg";
      grid.querySelectorAll("use").forEach(function (use) {
        use.setAttribute("href", file + use.getAttribute("href").replace(/^[^#]*/, ""));
      });
      style.parentElement.querySelectorAll("[data-icon-style]").forEach(function (item) {
        var on = item === style;
        if (on) item.setAttribute("data-selected", ""); else item.removeAttribute("data-selected");
        item.setAttribute("aria-checked", on ? "true" : "false");
      });
      return;
    }

    var source = event.target.closest("[data-icon-source]");
    if (source) {
      browser.setAttribute("data-source", source.getAttribute("data-icon-source"));
      source.parentElement.querySelectorAll("[data-icon-source]").forEach(function (chip) {
        var on = chip === source;
        if (on) chip.setAttribute("data-selected", ""); else chip.removeAttribute("data-selected");
        chip.setAttribute("aria-pressed", on ? "true" : "false");
      });
      return render();
    }

    // A cell copies its own name, which is what you came for.
    var cell = event.target.closest(".docs-icon");
    if (cell) {
      navigator.clipboard.writeText(cell.getAttribute("data-icon")).then(function () {
        cell.setAttribute("data-copied", "");
        setTimeout(function () { cell.removeAttribute("data-copied"); }, 900);
      });
    }
  });
})();

(function () {
  var KEY = "area-docs-rails";
  var shell = document.querySelector(".docs-shell");
  if (!shell) return;

  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}

  function write(rail, open) {
    shell.setAttribute("data-" + rail, open ? "open" : "closed");
    document.querySelectorAll('[data-rail="' + rail + '"]').forEach(function (button) {
      button.setAttribute("aria-expanded", String(open));
    });
  }

  // Desktop preferences survive a narrow viewport. Mobile opens are temporary and
  // never overwrite the reader's saved desktop arrangement.
  var narrow = { nav: matchMedia("(max-width: 820px)"), panel: matchMedia("(max-width: 1100px)") };
  var narrowState = { nav: false, panel: false };
  function syncViewport() {
    ["nav", "panel"].forEach(function (rail) {
      write(rail, narrow[rail].matches ? narrowState[rail] : state[rail] !== "closed");
    });
  }
  ["nav", "panel"].forEach(function (rail) {
    narrow[rail].addEventListener("change", syncViewport);
  });
  syncViewport();

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-rail]");
    if (!button) return;
    var rail = button.getAttribute("data-rail");
    var open = shell.getAttribute("data-" + rail) !== "open";
    write(rail, open);
    if (narrow[rail].matches) {
      narrowState[rail] = open;
      // The compact page has one working rail at a time.
      var other = rail === "nav" ? "panel" : "nav";
      if (open && narrow[other].matches) {
        narrowState[other] = false;
        write(other, false);
      }
    } else {
      state[rail] = open ? "open" : "closed";
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }
    if (open && narrow[rail].matches) {
      var target = shell.querySelector(rail === "nav" ? ".docs-sidebar" : ".docs-inspector");
      target.scrollIntoView({ block: "start" });
      var close = target.querySelector("[data-rail]");
      if (close) close.focus({ preventScroll: true });
    } else if (!open) {
      var corner = document.querySelector('.docs-rail-toggle[data-rail="' + rail + '"]');
      if (corner) corner.focus({ preventScroll: true });
    }
  });
})();

(function () {
  var gallery = document.querySelector(".docs-visual-gallery");
  if (!gallery) return;
  var KEY = "area-gallery-customizer";
  var toggle = gallery.querySelector("[data-gallery-rail=panel]");
  if (!toggle) return;
  var open = true;
  try { open = localStorage.getItem(KEY) !== "closed"; } catch (e) {}

  function write(next) {
    open = next;
    gallery.setAttribute("data-gallery-panel", open ? "open" : "closed");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Collapse customize panel" : "Expand customize panel");
  }

  write(open);
  toggle.addEventListener("click", function () {
    write(!open);
    try { localStorage.setItem(KEY, open ? "open" : "closed"); } catch (e) {}
    toggle.focus({ preventScroll: true });
  });
})();

(function () {
  var shell = document.querySelector(".docs-shell");
  if (!shell) return;

  var KEY = "area-docs-rail-widths";
  var limits = { nav: [192, 320], panel: [220, 360] };
  var widths = {};
  try { widths = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}

  function property(rail) { return rail === "nav" ? "--docs-sidebar" : "--docs-inspector"; }
  function clamp(rail, value) { return Math.max(limits[rail][0], Math.min(limits[rail][1], value)); }
  function apply(rail, value, save) {
    var width = clamp(rail, value);
    shell.style.setProperty(property(rail), width + "px");
    document.querySelectorAll('[data-resize-rail="' + rail + '"]').forEach(function (handle) {
      handle.setAttribute("aria-valuenow", String(width));
    });
    if (save) {
      widths[rail] = width;
      try { localStorage.setItem(KEY, JSON.stringify(widths)); } catch (e) {}
    }
  }

  Object.keys(widths).forEach(function (rail) {
    if (limits[rail] && Number.isFinite(widths[rail])) apply(rail, widths[rail], false);
  });

  document.querySelectorAll("[data-resize-rail]").forEach(function (handle) {
    var rail = handle.getAttribute("data-resize-rail");
    handle.addEventListener("pointerdown", function (event) {
      if (event.button !== 0) return;
      var startX = event.clientX;
      var start = shell.querySelector(rail === "nav" ? ".docs-sidebar" : ".docs-inspector").getBoundingClientRect().width;
      handle.setPointerCapture(event.pointerId);
      function move(next) {
        var delta = next.clientX - startX;
        apply(rail, rail === "nav" ? start + delta : start - delta, false);
      }
      function end(next) {
        move(next);
        apply(rail, Number.parseFloat(getComputedStyle(shell).getPropertyValue(property(rail))), true);
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", end);
        handle.removeEventListener("pointercancel", end);
      }
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", end);
      handle.addEventListener("pointercancel", end);
      event.preventDefault();
    });
    handle.addEventListener("keydown", function (event) {
      var step = event.shiftKey ? 24 : 8;
      var current = Number.parseFloat(getComputedStyle(shell).getPropertyValue(property(rail)));
      if (event.key === "ArrowLeft") apply(rail, current + (rail === "nav" ? -step : step), true);
      else if (event.key === "ArrowRight") apply(rail, current + (rail === "nav" ? step : -step), true);
      else if (event.key === "Home") apply(rail, limits[rail][0], true);
      else if (event.key === "End") apply(rail, limits[rail][1], true);
      else return;
      event.preventDefault();
    });
  });
})();

(function () {
  var KEY = "area-docs-axes";
  var root = document.documentElement;
  var saved = {};
  try { saved = (${restoreAxisPreferences.toString()})(localStorage, ${JSON.stringify(AXIS_PRESETS)}); } catch (e) {}

  function apply(axis, value) {
    if (value) root.setAttribute("data-area-" + axis, value);
    else root.removeAttribute("data-area-" + axis);
  }
  Object.keys(saved).forEach(function (axis) { apply(axis, saved[axis]); });

  /*
   * One sync for four control shapes. Each axis control declares data-axis and its own
   * default, and the shape is read off the markup rather than configured: a group with
   * [data-value] children is a segmented or a chip set, a <select> is a select, an
   * input with data-on is a switch, and one with data-values is a slider over presets.
   *
   * There may be several controls for one axis on a page -- the docked panel and the
   * dialog's copy of it -- so every one is written on every sync.
   */
  function sync() {
    document.querySelectorAll("[data-axis]").forEach(function (group) {
      var axis = group.getAttribute("data-axis");
      var current = saved[axis] || group.getAttribute("data-default");

      if (group.tagName === "SELECT") {
        group.value = current;
        return;
      }

      var values = group.getAttribute("data-values");
      if (values) {
        var list = values.split(" ");
        var labels = (group.getAttribute("data-labels") || "").split("|");
        var index = list.indexOf(current);
        if (index < 0) index = 0;
        var range = group.querySelector("input");
        var readout = group.querySelector(".area-slider__value");
        range.value = String(index);
        group.style.setProperty("--_pct", (index / (list.length - 1)) * 100 + "%");
        if (readout) readout.textContent = labels[index] || current;
        return;
      }

      var on = group.getAttribute("data-on");
      if (on) {
        group.checked = current === on;
        return;
      }

      group.querySelectorAll("[data-value]").forEach(function (item) {
        var isOn = item.getAttribute("data-value") === current;
        if (isOn) item.setAttribute("data-selected", "");
        else item.removeAttribute("data-selected");
        // Chips are buttons in a group and report aria-pressed; segmented items are
        // radios and report aria-checked. Write whichever the markup already declares.
        if (item.hasAttribute("aria-pressed")) item.setAttribute("aria-pressed", isOn ? "true" : "false");
        else item.setAttribute("aria-checked", isOn ? "true" : "false");
      });
    });
  }

  function choose(axis, value) {
    saved[axis] = value;
    apply(axis, value);
    try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    sync();
  }

  /*
   * A select fires change, a slider and a switch fire input. All three are listened
   * for on the document so a control added later -- the dialog clones the whole panel --
   * needs no wiring of its own.
   */
  document.addEventListener("input", function (event) {
    var group = event.target.closest("[data-axis]");
    if (!group) return;

    if (group.tagName === "SELECT") return choose(group.getAttribute("data-axis"), group.value);

    var values = group.getAttribute("data-values");
    if (values) {
      var list = values.split(" ");
      return choose(group.getAttribute("data-axis"), list[Number(group.querySelector("input").value)]);
    }

    var on = group.getAttribute("data-on");
    if (on) {
      return choose(group.getAttribute("data-axis"), group.checked ? on : group.getAttribute("data-off"));
    }
  });

  sync();

  document.addEventListener("click", function (event) {
    var item = event.target.closest("[data-value]");
    if (item) {
      var group = item.closest("[data-axis]");
      if (group) {
        choose(group.getAttribute("data-axis"), item.getAttribute("data-value"));
        return;
      }
    }

    // Reset returns every axis to its declared default rather than to whatever the last
    // control touched was, which is why it clears the store instead of replaying values.
    var resetAxes = event.target.closest("[data-reset-axes]");
    if (resetAxes) {
      Object.keys(saved).forEach(function (axis) { apply(axis, null); });
      saved = {};
      try { localStorage.removeItem(KEY); } catch (e) {}
      sync();
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
