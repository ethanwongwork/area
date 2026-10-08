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
 * Modelled on Cursor: docked rails at the default UI scale and radius 10 (the rails pin them;
 * owner, 2026-10-04, were compact), a quiet canvas
 * in the middle. The canvas paints its own ground (neutral 25, owner 2026-10-03; neutral 975 in
 * dark, Area's near-black page) so a dark canvas reads as one surface beside the light rails.
 * Headings and tile labels are gallery chrome: they pin the compact UI scale too, and tiles take
 * their corner from the density-independent radius base, so the canvas's density changes the
 * specimens and leaves the grid where it was.
 *
 * Tiles are 5:4 (owner, 2026-10-04; were 4:3) with the title in the top left (owner, 2026-10-03), all one size. The grid fits
 * as many columns as --docs-tile-min allows and stretches them to fill the canvas; rows are four
 * fifths of a column. One 8 step separates tiles, rows and the canvas edge. Inside, a generous
 * view (owner, 2026-10-04, after Frame Supply's grid): src/gallery/fit.ts shows every specimen
 * at 0.8 at most and smaller where it needs to fit.
 */
export const GALLERY_CSS = `
@layer area.base {
  .gallery-app {
    --docs-tile-radius: var(--area-radius-container);
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
  /* The page links stay at the top of the nav while the component list scrolls under them. */
  .gallery-nav__pages {
    position: sticky;
    inset-block-start: 0;
    z-index: 1;
    background: var(--area-bg-page);
  }
  /* The theme panel's toggle: collapsed, the rail's track closes and the toggle stays where it
     was, drawn over the canvas's corner (offsets measured in src/gallery/chrome.tsx). */
  #gallery-controls { position: relative; }
  .gallery-app:has(> #gallery-controls[data-collapsed]) { grid-template-columns: auto minmax(0, 1fr) 0; }
  .gallery-controls__ghost { position: absolute; z-index: 2; display: flex; }
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
    grid-auto-rows: calc(var(--_column) * 4 / 5); /* 5:4 (owner, 2026-10-04) */
    grid-auto-flow: row dense;
    gap: var(--_gap);
  }
  .gallery-tile {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    min-inline-size: 0;
    min-block-size: 0;
    /* inset.css: border + padding make the 12 inset, the border counted once. */
    padding: calc(var(--area-space-12) - var(--area-border-width));
    overflow: clip;
    border: var(--area-border-width) solid var(--area-border-decorative);
    /* The site's surface corner, resolved outside the canvas so the canvas's radius setting
       reshapes the specimens and not their frames. */
    border-radius: var(--docs-tile-radius);
    background: var(--area-bg-surface);
    scroll-margin-block-start: var(--area-space-8);
  }
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
    /* A wide margin round every specimen (Frame Supply's plates). */
    padding: var(--area-space-24) var(--area-space-32);
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

  /* Corner radius page: one column per radius setting, each its own data-area-radius scope. The cells
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
    /* The site's surface corner, resolved outside the canvas so the canvas's radius setting
       reshapes the specimens and not their frames. */
    border-radius: var(--docs-tile-radius);
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

  /* Review page: specimens at 1:1, each in a tile sized to its content (owner, 2026-10-04). */
  .review-batch__note { margin: 0 0 var(--area-space-12); padding-inline: var(--area-space-4); color: var(--area-fg-muted); font-size: var(--area-text-sm-size); line-height: var(--area-text-sm-leading); }
  .review-family { margin-block-end: var(--area-space-24); }
  .review-family__head { display: flex; align-items: baseline; gap: var(--area-space-8); margin: 0 0 var(--area-space-8); padding-inline: var(--area-space-4); }
  .review-family__name { margin: 0; font-size: var(--area-text-sm-size); line-height: var(--area-text-sm-leading); font-weight: var(--area-weight-strong); }
  .review-family__status { color: var(--area-fg-muted); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); }
  .review-grid { display: flex; flex-wrap: wrap; align-items: flex-start; gap: var(--area-space-8); }
  .review-tile {
    display: grid;
    gap: var(--area-space-12);
    min-inline-size: var(--docs-tile-min);
    max-inline-size: 100%;
    padding: calc(var(--area-space-12) - var(--area-border-width));
    border: var(--area-border-width) solid var(--area-border-decorative);
    border-radius: var(--docs-tile-radius);
    background: var(--area-bg-surface);
  }
  .review-tile__stage { display: flex; align-items: center; justify-content: center; padding: var(--area-space-24) var(--area-space-32); }
  .review-planned { display: grid; gap: var(--area-space-4); }
  .review-planned__reference, .review-planned__reuses { margin: 0; color: var(--area-fg-muted); font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading); }
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
  const id = sectionId(component.slug);
  return `<section class="gallery-section" id="${id}" data-slug="${component.slug}" aria-labelledby="${id}-title">
      <h2 class="gallery-section__title" id="${id}-title" data-area-ui="compact">${escapeHtml(component.name)}</h2>
      <div class="gallery-grid">${galleryTiles(component, specimens, { demos, demoMarkup })}</div>
    </section>`;
}

/* A family's tiles, labelled group / value and in group order: the gallery's and the Review page's
   (owner 2026-10-06: the Review page's containers match the gallery's). */
function galleryTiles(component, specimens, { demos, demoMarkup, prefix = "gallery" }) {
  const hasDefault = specimens.some(example => specimenName(example, component.slug) === "default");
  const tiles = specimens.map((example, index) => {
    const demo = demos[example.demo];
    if (!demo) throw new Error(`Gallery specimen missing: ${example.demo}`);
    const id = `${prefix}-${component.slug}-${example.id}`;
    const name = specimenName(example, component.slug);
    const group = !hasDefault && index === 0 ? "Default" : (example.group ?? specimenGroup(name, component.slug));
    const value = group === "Default" && !hasDefault ? name : specimenLabel(name, group);
    const label = group === "Default" ? value : `${group} / ${value}`;
    return { order: SPECIMEN_GROUPS.indexOf(group), html: `<article class="gallery-tile" id="${id}" aria-labelledby="${id}-title">
          <h3 class="gallery-tile__label" id="${id}-title" data-area-ui="compact">${escapeHtml(label)}</h3>
          <div class="gallery-tile__view"><div class="gallery-tile__stage">${demoMarkup(example.demo, demo.html)}</div></div>
        </article>` };
  }).sort((a, b) => a.order - b.order);
  return tiles.map(tile => tile.html).join("\n");
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
      var value = saved[axis];
      if (typeof value !== "string") return;
      // A set control saves a space-separated list; every name must be known ("" is valid).
      var ok = allowed[axis].indexOf(value) >= 0 || (axis === "pills" && value.split(" ").every(function (name) { return name === "" || allowed[axis].indexOf(name) >= 0; }));
      if (ok) canvas.setAttribute("data-area-" + axis, value);
    });
  } catch (error) {}
})(document.currentScript.parentElement);`;

/* Marks the theme panel collapsed before it paints, so a collapsed panel never flashes open. */
const collapseScript = `(function () {
  try {
    var saved = JSON.parse(localStorage.getItem("area-gallery-rails") || "{}")["controls-collapsed"];
    if (saved && isFinite(saved.top) && isFinite(saved.end)) document.getElementById("gallery-controls").setAttribute("data-collapsed", "");
  } catch (error) {}
})();`;

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
  <div class="gallery-app__rail" id="gallery-nav" data-area-ui="default" data-area-radius="10">${chrome.nav}</div>
  <main class="gallery-canvas" id="${GALLERY_CANVAS_ID}" ${canvasAxes} aria-label="${escapeHtml(title)}">
    <script>${restoreScript}</script>
    ${canvas}
  </main>
  <div class="gallery-app__rail" id="gallery-controls" data-area-ui="default" data-area-radius="10">${chrome.controls}</div>
  <script>${collapseScript}</script>
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

/* The radius settings, named by the medium Button's corner (axes/radius.ts): [id, Button, surface]. */
const STEPS = [["0", 0, 0], ["2", 2, 2], ["4", 4, 4], ["6", 6, 8], ["8", 8, 12], ["10", 10, 16], ["12", 12, 20], ["14", 14, 24], ["pill", 16, 24]];
const stepLabel = ([id]) => (id === "pill" ? "Pill" : id);

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

/*
 * Every component by the rule its corner follows (owner, 2026-10-04: "list every single component by
 * group"). Values are at the default setting, 8, default density; measured on this page and in the
 * gallery at every setting.
 */
const RADIUS_GROUPS = [
  ["Controls by height", "setting × height ÷ 32, even pixels, never under 2; a pill at Pill",
    "32px (md, 8): Button, Split button, Button group, Toolbar buttons, Input, Select, Combobox, Number field, Input group, Color field, Box field, Field, Segmented track, Tabs, Alignment picker, Calendar days. 28px (sm, 6) and 40px (lg, 10): the same components at their small and large sizes. 24px (xs, 6): Breadcrumb plate, inline Code, Accordion plate, Property list actions. A text input is a control: a medium Input is 32px, so it shares the medium Button's corner."],
  ["Rows by height", "the row's height (32, compact 24): 8, compact 6",
    "Nav rows, Tree view rows, Prompt suggestions."],
  ["One-line bars", "the 40px control corner: 10, compact 8; a pill at Pill",
    "Alert (one line), Alert banner, Toast (one line), Tooltip."],
  ["Textarea", "the one-line field corner, never a pill", "Textarea: 8, and 16 at Pill."],
  ["Surfaces", "the surface ladder: 0, 2, 4, 8, 12, 16, 20, 24, and 24 at Pill",
    "Popover, Hover card, Panel, Calendar, Table, Code block, Color picker, Color swatch picker, Property list, multiline Alert, titled Toast: 12."],
  ["List surfaces", "the surface ladder, but no rounder than their rows plus the inset",
    "Menu, Context menu, Command palette, Select's picker, Combobox list: 12; 14, 16, 18 at 10, 12, 14; 20 at Pill."],
  ["Surface + 4", "the surface corner plus 4 (never more than the surface)", "Card (16; sm 14, lg 20, compact 12), Dialog (16)."],
  ["Shells around a control", "the control's corner plus the distance to it", "Composer (8 + 8 = 16), Message bubble (16), Toolbar (control + inset), a Card in a media well."],
  ["Nested shapes", "the shell's corner less the inset, never under min(4, setting)",
    "Segmented items (6), Input action button (4), Number field steppers (4), Alignment picker cells, rows in Menu, Command palette, Select's picker and Combobox (8, capped at the medium Button's corner), Card media (8), Popover media, Color swatch picker cells, Nav and Tree view row actions, Token."],
  ["Own size", "a share of the shape's own side, scaling with the setting",
    "Checkbox and Tree view check (a quarter of the box: 4; at most 7/16, a rounded square at Pill), Color swatch (20% of the side: 4), Kbd (as a 24px box: 6), Skeleton (as a 16px box: 4), Avatar when square (its own corner, at most 7/16)."],
  ["Pill by default", "a pill while data-area-pills names it; otherwise its group's rule",
    "Badge and Badge group (20px label: 4), Chip (control height: 8, swatch and remove concentric), Count (4), Switch (track 4, thumb concentric), Avatar (rounded square). Each also takes pill / pill={false} (Avatar: shape) per instance."],
  ["Pill on request", "follows its group's rule unless data-area-pills names it",
    "Button (and the Composer around a pill send button), Fields (and their action buttons and steppers), Segmented (and its items)."],
  ["Always round", "a circle or pill by identity; the setting does not reach it",
    "Radio, Indicator, Presence, Progress, Slider thumb and rail, Spinner, Color picker thumbs, Tabs' underline."],
  ["No corner", "", "Separator."],
];

/**
 * The Review page: batches of families waiting on the owner, in the gallery's own tiles (same grid,
 * ratio and fit), and the components approved for building that are not built yet.
 */
export async function reviewPage({ components, specimensOf, demos, demoMarkup, batches, status, clients }) {
  const bySlug = new Map(components.map(component => [component.slug, component]));
  const sections = batches.flatMap((batch, index) => [{ slug: `review-batch-${index + 1}`, name: batch.name }, ...batch.families.map(slug => ({ slug, name: bySlug.get(slug)?.name ?? slug }))]);
  const chrome = await renderChrome(sections, "review");
  const body = batches.map((batch, index) => {
    const slug = `review-batch-${index + 1}`;
    const families = batch.families.map(familySlug => {
      const component = bySlug.get(familySlug);
      if (!component) throw new Error(`Review family missing: ${familySlug}`);
      const tiles = galleryTiles(component, specimensOf(component), { demos, demoMarkup, prefix: "review" });
      return `<section class="review-family" id="${chrome.sectionId(familySlug)}" data-slug="${familySlug}">
        <div class="review-family__head" data-area-ui="compact"><h3 class="review-family__name">${escapeHtml(component.name)}</h3><span class="review-family__status">${escapeHtml(status(familySlug))}</span></div>
        <div class="gallery-grid">${tiles}</div>
      </section>`;
    }).join("");
    const planned = (batch.planned ?? []).map(item => `<article class="review-tile review-planned">
        <h4 class="review-family__name" data-area-ui="compact">${escapeHtml(item.name)}</h4>
        <p class="review-planned__reference">${escapeHtml(item.reference)}</p>
        <p class="review-planned__reuses">Builds on ${escapeHtml(item.reuses)}. Not built yet.</p>
      </article>`).join("");
    return `<section class="gallery-section" id="${chrome.sectionId(slug)}" data-slug="${slug}" aria-labelledby="${chrome.sectionId(slug)}-title">
      <h2 class="gallery-section__title" id="${chrome.sectionId(slug)}-title" data-area-ui="compact">${escapeHtml(batch.name)}</h2>
      <p class="review-batch__note" data-area-ui="compact">${escapeHtml(batch.note)}</p>
      ${families}${planned ? `<div class="review-grid">${planned}</div>` : ""}
    </section>`;
  }).join("\n");
  return shell({ title: "Review", description: "Components waiting on approval, in the gallery's tiles.", chrome, sections, page: "review", canvas: body, clients });
}

/** How the radius setting reaches each component, and how an inset corner follows its shell. */
export async function roundnessPage({ components, specimensOf, demos, clients }) {
  const sections = [
    { slug: "roundness-model", name: "How corner radius works" },
    { slug: "roundness-groups", name: "Components by group" },
    { slug: "roundness-inset", name: "Inset corners" },
    ...components.map(component => ({ slug: component.slug, name: component.name })),
  ];
  const chrome = await renderChrome(sections, "roundness");
  const head = (slug, title) => `<h2 class="gallery-section__title" id="${chrome.sectionId(slug)}-title" data-area-ui="compact">${escapeHtml(title)}</h2>`;
  const open = slug => `<section class="gallery-section" id="${chrome.sectionId(slug)}" data-slug="${slug}" aria-labelledby="${chrome.sectionId(slug)}-title">`;
  const heights = [20, 24, 28, 32, 40, 48];
  // corner = setting x height / 32, rounded down to even pixels, never under 2 (emit/base.ts).
  const value = (height, button) => { if (button === 0) return "0"; const corner = Math.max(2, Math.floor(height * button / 32 / 2) * 2); return corner >= height / 2 ? "pill" : String(corner); };
  const bold = (step, text) => (step[0] === "8" ? `<strong>${text}</strong>` : text);
  const model = `${open("roundness-model")}${head("roundness-model", "How corner radius works")}
      <div class="roundness-prose" data-area-ui="compact">
        <p>One setting sets every corner: a single number, the corner it gives a medium Button, 0 (Sharp), 2, 4, 6, <strong>8</strong>, 10, 12, 14, and Pill. Everything else scales off it, so each setting is one coherent theme.</p>
        <ul>
          <li><strong>Controls scale with their height</strong>: setting × height ÷ 32, rounded down to even pixels, never under 2. Every height goes square together at Sharp and becomes a pill together at Pill.</li>
          <li><strong>Surfaces take their own ladder</strong>, 4px a step (a 2px step is a quarter of a Button but a sixth of a surface), and stay finite at Pill. Card and Dialog are the surface plus 4.</li>
          <li><strong>Inset shapes are concentric</strong>: the shell's corner less the inset, never sharper than 4 (2 at the 2 setting), so only Sharp is square anywhere.</li>
          <li><strong>Shells follow what they hold</strong>: Composer and the Segmented track are their control's corner plus their inset.</li>
          <li><strong>Pills are a choice</strong>: data-area-pills lists the components that draw a pill (the Pills control in the Theme panel; by default Badge, Chip, Count, Switch and Avatar). Any of them, and Button, Fields and Segmented, can be switched either way for the whole system or a subtree, and per instance with <code>pill</code>. A checkbox and a square avatar stay rounded squares at Pill; radios stay circles.</li>
        </ul>
        <p>Controls by painted height, the same at both densities; surfaces below them. Every corner is even.</p>
      </div>
      ${table(["Height", ...STEPS.map(stepLabel)], [
        ...heights.map(height => [`${height}px`, ...STEPS.map(step => bold(step, value(height, step[1])))]),
        ["Surface", ...STEPS.map(step => bold(step, String(step[2])))],
        ["Card, Dialog", ...STEPS.map(step => bold(step, String(step[2] + Math.min(4, step[2]))))],
      ])}
    </section>`;
  const groups = `${open("roundness-groups")}${head("roundness-groups", "Components by group")}
      <div class="roundness-prose" data-area-ui="compact"><p>Every component, by the rule its corner follows. Values are at the default setting, 8. The Pills control in the Theme panel (data-area-pills) chooses which components are pills.</p></div>
      ${table(["Group", "Rule", "Components"], RADIUS_GROUPS.map(([group, rule, components]) => [`<strong>${escapeHtml(group)}</strong>`, escapeHtml(rule), escapeHtml(components)]))}
    </section>`;
  const inset = `${open("roundness-inset")}${head("roundness-inset", "Inset corners")}
      <div class="roundness-prose" data-area-ui="compact"><p>Each setting shows the shell's corner (grey), the concentric corner it implies, the shell's corner less the inset (dashed), and the nested shape's corner (accent). Where the dashed line is sharper than 4, the nested shape keeps 4 instead (floor; 2 at the 2 setting).</p></div>
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
  return shell({ title: "Corner radius", description: "How the one radius setting reaches every Area component.", chrome, sections, page: "roundness", canvas: model + groups + inset + rows, clients });
}
