/**
 * The component gallery (index.html): every family's specimens on one canvas, a component
 * list on the left and a theme panel on the right. The source of truth for how the system's
 * components look.
 *
 * The canvas is the only theme scope the controls write to. It carries data-area-theme and
 * data-area-ui itself, so the rails beside it -- Area's own Panel, Nav and Segmented, rendered
 * from src/gallery/chrome.tsx -- keep the system defaults whatever the canvas shows.
 *
 * A new family appears here once it is in src/pages.mjs; its tiles come from the build's
 * specimen table (or its Gallery<Name> demo).
 */
import { build } from "esbuild";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DOCS_CSS, escapeHtml, table } from "./layout.mjs";
import { SPECIMEN_GROUPS, specimenGroup, specimenLabel, specimenName } from "./specimen-names.mjs";
import { GALLERY_CANVAS_ID, GALLERY_CONTROLS, GALLERY_STORAGE_KEY } from "../src/gallery/controls.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/*
 * Modelled on Cursor: docked rails at the compact UI scale (the rails pin it), a quiet canvas
 * in the middle. The canvas paints its own ground (neutral 25, owner 2026-10-03; neutral 975 in
 * dark, Area's near-black page) so a dark canvas reads as one surface beside the light rails.
 * Headings and tile labels are gallery chrome: they pin the compact UI scale too, and tiles take
 * their corner from the density-independent radius base, so the canvas's density changes the
 * specimens and leaves the grid where it was.
 *
 * Tiles are 4:3 with the title in the top left (owner, 2026-10-03). The grid fits as many
 * columns as --docs-tile-min allows and stretches them to fill the canvas; rows are three
 * quarters of a column. One 8 step separates tiles, rows and the canvas edge.
 * src/gallery/fit.ts scales a specimen that doesn't fit its tile and gives the few that would
 * fall below half size a 2 x 2 tile. Dense packing lets later tiles fill the holes those leave.
 */
export const GALLERY_CSS = `
@layer area.base {
  .gallery-app {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    block-size: 100vh;
    overflow: hidden;
    background: var(--area-bg-page);
    color: var(--area-fg-default);
  }
  .gallery-app__rail {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    min-block-size: 0;
  }
  .gallery-controls__scope {
    color: var(--area-fg-muted);
    font-size: var(--area-ui-size);
    line-height: var(--area-ui-leading);
    font-weight: var(--area-weight-regular);
  }
  .gallery-canvas {
    container-type: inline-size;
    min-inline-size: 0;
    overflow: auto;
    padding: var(--area-space-8);
    background: light-dark(var(--area-neutral-25), var(--area-neutral-975)); /* spec: owner, neutral 25 */
    color: var(--area-fg-default);
  }
  .gallery-section { scroll-margin-block-start: var(--area-space-8); }
  .gallery-section + .gallery-section { margin-block-start: var(--area-space-24); }
  .gallery-section__title {
    margin: 0 0 var(--area-space-8);
    padding-inline: var(--area-space-4);
    font-size: var(--area-text-sm-size);
    line-height: var(--area-text-sm-leading);
    font-weight: var(--area-weight-strong);
  }
  .gallery-grid {
    --docs-tile-min: 280px;
    --_gap: var(--area-space-8);
    --_columns: max(1, round(down, calc((100cqw + var(--_gap)) / (var(--docs-tile-min) + var(--_gap))), 1));
    --_column: calc((100cqw - (var(--_columns) - 1) * var(--_gap)) / var(--_columns));
    display: grid;
    grid-template-columns: repeat(var(--_columns), minmax(0, 1fr));
    grid-auto-rows: calc(var(--_column) * 3 / 4);
    grid-auto-flow: row dense;
    gap: var(--_gap);
  }
  .gallery-tile {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    min-inline-size: 0;
    min-block-size: 0;
    /* inset.css: border + padding make the 8 inset, the border counted once. */
    padding: calc(var(--area-space-8) - var(--area-border-width));
    overflow: clip;
    border: var(--area-border-width) solid var(--area-border-decorative);
    border-radius: var(--area-radius-base-container);
    background: var(--area-bg-surface);
    scroll-margin-block-start: var(--area-space-8);
  }
  .gallery-tile[data-span="2x2"] { grid-column: span min(2, var(--_columns)); grid-row: span 2; }
  .gallery-tile__label {
    margin: 0;
    overflow: hidden;
    color: var(--area-fg-muted);
    font-size: var(--area-text-xs-size);
    line-height: var(--area-text-xs-leading);
    font-weight: var(--area-weight-regular);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* One fixed track, and unsafe centring: a stage larger than the view overflows evenly on
     every side, so scaling it about its centre lands it inside the view. */
  .gallery-tile__view {
    display: grid;
    grid-template: minmax(0, 1fr) / minmax(0, 1fr);
    place-items: unsafe center;
    min-block-size: 0;
    padding: var(--area-space-8);
  }
  .gallery-tile__stage {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    flex-shrink: 0;
  }
  .gallery-canvas:not([data-fitted]) .gallery-tile__stage { visibility: hidden; }

  /* Roundness page: five columns, -2 to +2, each its own data-area-roundness scope. The cells
     are chrome (fixed corner from the radius base), the specimens inside them are not. */
  .roundness-prose {
    max-inline-size: var(--docs-measure);
    margin-block-end: var(--area-space-12);
    padding-inline: var(--area-space-4);
    color: var(--area-fg-muted);
    font-size: var(--area-text-sm-size);
    line-height: var(--area-text-sm-leading);
  }
  .roundness-prose p { margin: 0 0 var(--area-space-8); }
  .roundness-prose ul { margin: 0 0 var(--area-space-8); padding-inline-start: var(--area-space-20); }
  .roundness-prose strong { color: var(--area-fg-default); font-weight: var(--area-weight-strong); }
  .roundness-row__title {
    margin: var(--area-space-16) 0 var(--area-space-8);
    padding-inline: var(--area-space-4);
    color: var(--area-fg-default);
    font-size: var(--area-text-sm-size);
    line-height: var(--area-text-sm-leading);
    font-weight: var(--area-weight-regular);
  }
  .roundness-row {
    --docs-roundness-stage: 120px;
    --docs-roundness-cell: 168px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--docs-roundness-cell), 1fr));
    gap: var(--area-space-8);
  }
  .roundness-cell[data-default] { border-color: var(--area-border-divider); }
  .roundness-cell {
    display: grid;
    grid-template-rows: auto var(--docs-roundness-stage) auto;
    gap: var(--area-space-8);
    min-inline-size: 0;
    padding: calc(var(--area-space-8) - var(--area-border-width));
    overflow: clip;
    border: var(--area-border-width) solid var(--area-border-decorative);
    border-radius: var(--area-radius-base-container);
    background: var(--area-bg-surface);
  }
  .roundness-cell__head,
  .roundness-cell__loupe {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--area-space-8);
    color: var(--area-fg-muted);
    font-size: var(--area-text-xs-size);
    line-height: var(--area-text-xs-leading);
  }
  .roundness-cell__step { color: var(--area-fg-default); font-weight: var(--area-weight-strong); }
  .roundness-cell__value { display: inline-flex; align-items: center; gap: var(--area-space-4); }
  /* Small things centred; anything larger anchored at its top-left corner, which is what is compared. */
  .roundness-cell__stage {
    display: flex;
    align-items: safe center;
    justify-content: safe center;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: clip;
  }
  .roundness-cell__loupe { justify-content: flex-start; }
  .roundness-cell__loupe svg { flex: none; inline-size: var(--area-space-64); block-size: var(--area-space-64); }
  .roundness-loupe__frame { fill: none; stroke: var(--area-border-decorative); }
  .roundness-loupe__shell { fill: none; stroke: var(--area-fg-muted); }
  .roundness-loupe__guide { fill: none; stroke: var(--area-fg-muted); }
  .roundness-loupe__nested { fill: none; stroke: var(--area-fg-accent); }
}
`;

/** Renders the chrome to HTML with the same module and id prefixes the client hydrates. */
async function renderChrome(sections, page = "components") {
  const outdir = join(root, ".cache");
  mkdirSync(outdir, { recursive: true });
  const outfile = join(outdir, `gallery-chrome.${Date.now()}.mjs`);
  await build({
    entryPoints: [join(root, "src/gallery/chrome.tsx")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    jsx: "automatic",
    external: ["react", "react-dom", "react/jsx-runtime", "react-dom/server"],
    logLevel: "silent",
  });
  try {
    const { GalleryNav, GalleryControls, sectionId } = await import(pathToFileURL(outfile).href);
    const { renderToString } = await import("react-dom/server");
    const { createElement } = await import("react");
    return {
      sectionId,
      nav: renderToString(createElement(GalleryNav, { sections, page }), { identifierPrefix: "gallery-nav-" }),
      controls: renderToString(createElement(GalleryControls), { identifierPrefix: "gallery-controls-" }),
    };
  } finally {
    rmSync(outfile, { force: true });
  }
}

/*
 * One family: its name over one grid of its tiles. Tiles run in the review gallery's group
 * order (Default, Variants, Tones, Sizes, ...) and each is labelled group / value, so a
 * family reads as one block of containers rather than a heading per group.
 */
function section(component, specimens, { demos, demoMarkup, sectionId }) {
  const hasDefault = specimens.some(example => specimenName(example, component.slug) === "default");
  const tiles = specimens.map((example, index) => {
    const demo = demos[example.demo];
    if (!demo) throw new Error(`Gallery specimen missing: ${example.demo}`);
    const id = `gallery-${component.slug}-${example.id}`;
    const name = specimenName(example, component.slug);
    const group = !hasDefault && index === 0 ? "Default" : (example.group ?? specimenGroup(name, component.slug));
    const value = group === "Default" && !hasDefault ? name : specimenLabel(name, group);
    const label = group === "Default" ? value : `${group} / ${value}`;
    return { order: SPECIMEN_GROUPS.indexOf(group), html: `<article class="gallery-tile" id="${id}" aria-labelledby="${id}-title">
          <h3 class="gallery-tile__label" id="${id}-title" data-area-ui="compact">${escapeHtml(label)}</h3>
          <div class="gallery-tile__view"><div class="gallery-tile__stage">${demoMarkup(example.demo, demo.html)}</div></div>
        </article>` };
  }).sort((a, b) => a.order - b.order);
  const id = sectionId(component.slug);
  return `<section class="gallery-section" id="${id}" data-slug="${component.slug}" aria-labelledby="${id}-title">
      <h2 class="gallery-section__title" id="${id}-title" data-area-ui="compact">${escapeHtml(component.name)}</h2>
      <div class="gallery-grid">${tiles.map(tile => tile.html).join("\n")}</div>
    </section>`;
}

/*
 * Restores the saved selection onto the canvas before it paints. Only known values are
 * applied, so a stale or edited preference falls back to the defaults.
 */
const restoreScript = `(function (canvas) {
  var allowed = ${JSON.stringify(Object.fromEntries(GALLERY_CONTROLS.map(control => [control.axis, control.items.map(item => item.value)])))};
  try {
    var saved = JSON.parse(localStorage.getItem(${JSON.stringify(GALLERY_STORAGE_KEY)}) || "{}");
    Object.keys(allowed).forEach(function (axis) {
      if (allowed[axis].indexOf(saved[axis]) >= 0) canvas.setAttribute("data-area-" + axis, saved[axis]);
    });
  } catch (error) {}
})(document.currentScript.parentElement);`;

/** The page around a canvas: nav, canvas with the restored theme selection, theme panel. */
function shell({ title, description, chrome, sections, page, canvas, clients }) {
  const canvasAxes = GALLERY_CONTROLS.map(control => `data-area-${control.axis}="${control.defaultValue}"`).join(" ");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} — area</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="stylesheet" href="./area.css">
<style>${DOCS_CSS}${GALLERY_CSS}</style>
</head>
<body>
<div class="gallery-app">
  <div class="gallery-app__rail" id="gallery-nav" data-area-ui="compact">${chrome.nav}</div>
  <main class="gallery-canvas" id="${GALLERY_CANVAS_ID}" ${canvasAxes} aria-label="${escapeHtml(title)}">
    <script>${restoreScript}</script>
    ${canvas}
  </main>
  <div class="gallery-app__rail" id="gallery-controls" data-area-ui="compact">${chrome.controls}</div>
</div>
<script type="application/json" id="gallery-nav-data">${JSON.stringify({ sections, page }).replaceAll("<", "\\u003c")}</script>
<script src="./area-capture.js"></script>
<script type="module" src="./gallery.js"></script>
${clients.map(file => `<script type="module" src="./${file}"></script>`).join("\n")}
</body>
</html>`;
}

/**
 * @param components families in gallery order ({ slug, name, ... } from src/pages.mjs)
 * @param specimensOf (component) => the family's tiles ({ id, title, demo })
 * @param demos rendered demos by name ({ html })
 * @param demoMarkup (name, html) => the demo wrapped for its hydration client
 * @param clients the demo hydration bundles the canvas needs
 */
export async function componentGalleryPage({ components, specimensOf, demos, demoMarkup, clients }) {
  const sections = components.map(component => ({ slug: component.slug, name: component.name }));
  const chrome = await renderChrome(sections);
  const canvas = components.map(component => section(component, specimensOf(component), { demos, demoMarkup, sectionId: chrome.sectionId })).join("\n");
  return shell({ title: "Components", description: "Every Area component and variant, themed from one panel.", chrome, sections, page: "components", canvas, clients });
}

/* --- Roundness ------------------------------------------------------------- */

/* The roundness steps, 2px apart (axes/roundness.ts). */
const STEPS = [-12, -10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10, 12];
const stepLabel = step => (step > 0 ? `+${step}` : String(step)).replace("-", "−");

/*
 * A static copy of a demo: no ids or id references (copies of one demo would collide), radio
 * groups renamed, nothing hydrated. src/gallery/roundness.ts clones it once per step.
 */
let copies = 0;
const inertCopy = html => {
  const copy = ++copies;
  return html
    .replace(/\s(id|for|aria-labelledby|aria-describedby|aria-controls|aria-activedescendant|aria-owns|popovertarget|list)="[^"]*"/g, "")
    .replace(/\sname="([^"]*)"/g, (_, name) => ` name="roundness-${copy}-${name}"`);
};

/* One specimen; the client lays it out at every step from square to pill. */
function roundnessRow(html, { label, outer, inner } = {}) {
  return `${label ? `<h3 class="roundness-row__title" data-area-ui="compact">${escapeHtml(label)}</h3>` : ""}<div class="roundness-row" data-roundness-row${outer ? ` data-outer="${escapeHtml(outer)}" data-inner="${escapeHtml(inner)}"` : ""}><template>${inertCopy(html)}</template></div>`;
}

/* Shapes nested in a shell, the inset case: [label, demo, shell selector, nested selector]. */
const INSET_EXAMPLES = [
  ["Segmented: items in the track (inset 2)", "GallerySegmented", ".area-segmented", ".area-segmented__item"],
  ["Input: action button in the field (inset 4)", "GalleryInputPassword", ".area-input", ".area-input__action-button"],
  ["Number field: steppers in the field (inset 4)", "NumberFieldSteppers", ".area-number-field", ".area-number-field__step"],
  ["Menu: rows in the surface (inset 4)", "GalleryMenu", ".area-menu", ".area-menu__item"],
  ["Card: media in the card (inset 8)", "CardVertical", ".area-card", ".area-card__media"],
  ["Card: a card in a media well (inset 8)", "CardWell", ".area-card__media--well", ".area-card__media--well > .area-card"],
];

/** How the roundness offset reaches each component, and how an inset corner follows its shell. */
export async function roundnessPage({ components, specimensOf, demos, clients }) {
  const sections = [
    { slug: "roundness-model", name: "How roundness works" },
    { slug: "roundness-inset", name: "Inset corners" },
    ...components.map(component => ({ slug: component.slug, name: component.name })),
  ];
  const chrome = await renderChrome(sections, "roundness");
  const head = (slug, title) => `<h2 class="gallery-section__title" id="${chrome.sectionId(slug)}-title" data-area-ui="compact">${escapeHtml(title)}</h2>`;
  const open = slug => `<section class="gallery-section" id="${chrome.sectionId(slug)}" data-slug="${slug}" aria-labelledby="${chrome.sectionId(slug)}-title">`;
  const curve = [[20, 4], [24, 6], [28, 6], [32, 8], [40, 10], [48, 12]];
  const value = (height, base, step) => { const corner = Math.max(0, base + step); return corner >= height / 2 ? "pill" : corner === 0 ? "0" : String(corner); };
  const model = `${open("roundness-model")}${head("roundness-model", "How roundness works")}
      <div class="roundness-prose" data-area-ui="compact">
        <p>Roundness moves every corner the radius family draws in steps of 2px, from square to pill: controls, rows, small shapes and surfaces alike. A component with an 8px corner reads 0, 2, 4, 6, <strong>8</strong>, 10, 12, 14 and then a pill.</p>
        <ul>
          <li><strong>Square is the floor.</strong> Below 0 a corner stays square.</li>
          <li><strong>Half the height is a pill.</strong> Past it the browser draws a pill, so each component's row on this page stops at its first pill.</li>
          <li><strong>The family's cap still shapes the default</strong> (a 12px family on a 20px control reads 8, 40% of its height); the offset moves from there.</li>
          <li><strong>Inset shapes are concentric</strong>: the shell's corner less the inset, never sharper than 4 (which moves with the offset too).</li>
          <li><strong>Shells follow what they hold</strong>: Card, Composer and the Segmented track are their control's corner plus their inset.</li>
          <li>Shapes that are always round (Badge, Avatar, Switch) do not move; Sharp ignores the offset.</li>
        </ul>
        <p>Controls by painted height, the same at both densities. Every corner is even.</p>
      </div>
      ${table(["Height", ...STEPS.map(stepLabel)], [
        ...curve.map(([height, base]) => [`${height}px`, ...STEPS.map(step => step === 0 ? `<strong>${value(height, base, step)}</strong>` : value(height, base, step))]),
        ["Surface", ...STEPS.map(step => step === 0 ? "<strong>12</strong>" : String(Math.max(0, 12 + step)))],
      ])}
    </section>`;
  const inset = `${open("roundness-inset")}${head("roundness-inset", "Inset corners")}
      <div class="roundness-prose" data-area-ui="compact"><p>Each step shows the shell's corner (grey), the concentric corner it implies, the shell's corner less the inset (dashed), and the nested shape's corner (accent). Where the dashed line is sharper than 4, the nested shape keeps 4 instead (floor), which moves with the steps.</p></div>
      ${INSET_EXAMPLES.map(([label, demo, outer, inner]) => {
        if (!demos[demo]) throw new Error(`Roundness example missing: ${demo}`);
        return roundnessRow(demos[demo].html, { label, outer, inner });
      }).join("")}
    </section>`;
  const rows = components.map(component => {
    const specimens = specimensOf(component);
    const first = specimens.find(example => specimenName(example, component.slug) === "default") ?? specimens[0];
    const demo = demos[first.demo];
    if (!demo) throw new Error(`Gallery specimen missing: ${first.demo}`);
    return `${open(component.slug)}${head(component.slug, component.name)}${roundnessRow(demo.html)}</section>`;
  }).join("\n");
  return shell({ title: "Roundness", description: "How the roundness offset reaches every Area component.", chrome, sections, page: "roundness", canvas: model + inset + rows, clients });
}
