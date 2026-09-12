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

/** Minimal JSX highlighting, at build time. Emits Area's own syntax classes. */
export function highlight(code) {
  return escapeHtml(code)
    .replace(/(&lt;\/?)([A-Za-z][\w.]*)/g, '$1<span class="area-syntax-tag">$2</span>')
    .replace(
      /([a-zA-Z-]+)(=)(&quot;[^&]*?&quot;)/g,
      '<span class="area-syntax-attr">$1</span>$2<span class="area-syntax-string">$3</span>',
    )
    .replace(/(\{)([^{}]*)(\})/g, '<span class="area-syntax-punct">$1</span>$2<span class="area-syntax-punct">$3</span>');
}

/** A code block with a copy button, in the shape the design system defines. */
export function codeBlock(code, { title, flush = false, wrap = true } = {}) {
  const cls = [
    "area-code-block",
    flush && "area-code-block--flush",
    wrap && "area-code-block--wrap",
  ]
    .filter(Boolean)
    .join(" ");
  return `<div class="${cls}">
  <div class="area-code-block__toolbar">
    ${title ? `<span class="area-code-block__title">${escapeHtml(title)}</span>` : ""}
    <span class="area-code-block__actions">
      <button type="button" class="area-button area-button--ghost area-button--neutral area-button--xs" data-copy>
        <span class="area-button__label">Copy</span>
      </button>
    </span>
  </div>
  <pre class="area-code-block__pre"><code>${highlight(code)}</code></pre>
</div>`;
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
    --docs-card-min: 120px;
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
  .docs-lede { margin-block-start: var(--area-space-8); font-size: var(--area-text-lg-size); line-height: var(--area-text-lg-leading); color: var(--area-fg-muted); }

  .docs-h2 { margin-block: var(--area-space-40) var(--area-space-12); font-size: var(--area-title-md-size); line-height: var(--area-title-md-leading); letter-spacing: var(--area-title-md-tracking); font-weight: var(--area-weight-strong); }
  .docs-h3 { margin-block: var(--area-space-32) var(--area-space-8); font-size: var(--area-title-xs-size); line-height: var(--area-title-xs-leading); letter-spacing: var(--area-title-xs-tracking); font-weight: var(--area-weight-strong); }
  .docs-note { margin-block-end: var(--area-space-12); color: var(--area-fg-muted); }
  .docs-prose p { margin-block: var(--area-space-12); color: var(--area-fg-muted); }
  .docs-prose p strong { color: var(--area-fg-default); font-weight: var(--area-weight-strong); }
  .docs-stack { display: flex; flex-direction: column; gap: var(--area-space-8); }

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

  /* --- Paired views ------------------------------------------------------ */

  .docs-view { margin-block: var(--area-space-12); }
  .docs-view__bar { display: flex; justify-content: flex-start; margin-block-end: var(--area-space-12); }
  .docs-view[data-view="grid"] .docs-view__pane[data-pane="table"] { display: none; }
  .docs-view[data-view="table"] .docs-view__pane[data-pane="grid"] { display: none; }

  .docs-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(var(--docs-card), 1fr)); gap: var(--area-space-12); }
  .docs-card {
    display: flex;
    flex-direction: column;
    gap: var(--area-space-10);
    padding: var(--area-space-12);
    border: var(--area-border-width) solid var(--area-border-subtle);
    border-radius: var(--area-radius-container);
    background-color: var(--area-bg-surface);
    min-block-size: var(--docs-card-min);
    overflow: hidden;
  }
  .docs-card__meta { font-family: var(--area-font-mono); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); word-break: break-word; }
  .docs-card__figure { margin-block-start: auto; display: flex; align-items: center; }
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
