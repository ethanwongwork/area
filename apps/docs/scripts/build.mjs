/**
 * Builds the documentation site.
 *
 * Static HTML. Previews are the real React components rendered with react-dom/server, and
 * each snippet is the source of the very demo beside it -- so the two cannot disagree.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderDemos } from "./render.mjs";
import {
  DOCS_CSS,
  DOCS_SCRIPT,
  codeBlock,
  escapeHtml,
  highlight,
  table,
  tokenCard,
  tokenChip,
  tokenSection,
  customizer,
  viewToggle,
} from "./layout.mjs";
import { COMPONENT_PAGES } from "../src/pages.mjs";
import { PRACTICES } from "../src/practices.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(root, "..", "..");
const out = join(root, "dist");

const tokens = JSON.parse(readFileSync(join(repo, "packages/tokens/dist/tokens.json"), "utf8"));
const { MANIFESTS } = await import(join(repo, "packages/styles/src/manifest.ts"));
const demos = await renderDemos();

const FOUNDATION_PAGES = [
  { slug: "color", name: "Color" },
  { slug: "typography", name: "Typography" },
  { slug: "iconography", name: "Iconography" },
  { slug: "density", name: "Density" },
  { slug: "radius", name: "Radius" },
  { slug: "surface", name: "Surface" },
  { slug: "motion", name: "Motion" },
];

/* --- Chrome ---------------------------------------------------------------- */

/**
 * The axis panel.
 *
 * Every picker is a real segmented control from the system. The accent picker renders its
 * twelve options as swatches of each scale's own solid fill, which is both the clearest way
 * to choose a hue and a working demonstration that the scales are addressable as tokens.
 * The solid level differs per hue -- blue's is 51, yellow's is 90 -- so the swatch has to
 * ask the scale rather than assume a fixed rung.
 */
function axisGroups() {
  return tokens.axes
    .map((axis) => {
      const items = axis.presets
        .map((preset) => {
          const selected = preset.id === axis.defaultPreset;
          const body =
            axis.id === "accent"
              ? `<span class="area-segmented__icon" aria-hidden="true"><span class="docs-swatch" style="background:var(--area-${preset.id}-${tokens.scales[preset.id].solid.level})"></span></span>`
              : escapeHtml(preset.label);
          return `<button type="button" role="radio" class="area-segmented__item" data-value="${preset.id}" aria-checked="${selected}" aria-label="${escapeHtml(preset.label)}"${selected ? " data-selected" : ""}>${body}</button>`;
        })
        .join("");

      return `<div class="docs-axis">
      <span class="docs-axis__name">${escapeHtml(axis.label)}</span>
      <div class="area-segmented area-segmented--sm" role="radiogroup" aria-label="${escapeHtml(axis.label)}" data-axis="${axis.id}" data-default="${axis.defaultPreset}" style="flex-wrap:wrap">${items}</div>
    </div>`;
    })
    .join("");
}

function axisPanel() {
  return `<div class="docs-axes" id="docs-axes" hidden>
    <div class="docs-axes__inner">${axisGroups()}</div>
  </div>`;
}

/** A compact segmented control for one axis, for the topbar. */
function axisSwitch(axisId, label) {
  const axis = tokens.axes.find((a) => a.id === axisId);
  const items = axis.presets
    .map(
      (p) =>
        `<button type="button" role="radio" class="area-segmented__item" data-value="${p.id}" aria-checked="${p.id === axis.defaultPreset}"${p.id === axis.defaultPreset ? " data-selected" : ""}>${escapeHtml(p.label)}</button>`,
    )
    .join("");

  return `<div class="area-segmented area-segmented--xs" role="radiogroup" aria-label="${escapeHtml(label)}" data-axis="${axisId}" data-default="${axis.defaultPreset}">${items}</div>`;
}

function topbarControls() {
  return `${axisSwitch("density", "Density")}
  ${axisSwitch("theme", "Theme")}
  <button type="button" class="area-button area-button--outline area-button--neutral area-button--sm" data-toggle-axes aria-expanded="false" aria-controls="docs-axes">
    <span class="area-button__label">Customize</span>
  </button>`;
}

function sidebar(activeSlug) {
  const item = (href, label, slug) =>
    `<a class="area-menu__item" href="${href}"${slug === activeSlug ? ' data-selected aria-current="page"' : ""}>${escapeHtml(label)}</a>`;

  const group = (title, links) =>
    `<nav class="area-menu area-menu--inline" aria-label="${escapeHtml(title)}">
      <div class="area-menu__label">${escapeHtml(title)}</div>
      ${links}
    </nav>`;

  return `<aside class="docs-sidebar">
  ${group("Getting started", [item("./index.html", "Introduction", "index"), item("./axes.html", "Axes", "axes")].join("\n      "))}
  ${group("Foundations", FOUNDATION_PAGES.map((p) => item(`./${p.slug}.html`, p.name, p.slug)).join("\n      "))}
  ${group("Components", COMPONENT_PAGES.map((p) => item(`./${p.slug}.html`, p.name, p.slug)).join("\n      "))}
</aside>`;
}

function page({ slug, title, lede, body, toc = [] }) {
  const tocHtml = toc.length
    ? `<nav class="docs-toc area-menu area-menu--inline" aria-label="On this page">
      <div class="area-menu__label">On this page</div>
      ${toc.map((t) => `<a class="area-menu__item" href="#${t.id}"${t.nested ? ' style="padding-inline-start:var(--area-space-16)"' : ""}>${escapeHtml(t.title)}</a>`).join("")}
    </nav>`
    : "<div></div>";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} — Area</title>
<meta name="description" content="${escapeHtml(lede)}">
<link rel="stylesheet" href="./area.css">
<style>${DOCS_CSS}</style>
</head>
<body>
<header class="docs-topbar">
  <a class="docs-brand" href="./index.html"><span class="docs-brand__mark"></span> Area</a>
  <span class="docs-topbar__spacer"></span>
  ${topbarControls()}
</header>
${axisPanel()}
${customizer(axisGroups())}
<div class="docs-shell">
  ${sidebar(slug)}
  <main class="docs-main">
    <div class="docs-content">
      <h1 class="docs-title">${escapeHtml(title)}</h1>
      <p class="docs-lede">${escapeHtml(lede)}</p>
      ${body}
    </div>
    ${tocHtml}
  </main>
</div>
<script>${DOCS_SCRIPT}</script>
</body>
</html>`;
}

/* --- Component pages -------------------------------------------------------- */

function exampleBlock(example) {
  const demo = demos[example.demo];
  if (!demo) throw new Error(`Page references demo "${example.demo}", which does not exist.`);

  const column = COLUMN_DEMOS.has(example.demo);

  return `<h3 class="docs-h3" id="${example.id}">${escapeHtml(example.title)}</h3>
${example.note ? `<p class="docs-note">${escapeHtml(example.note)}</p>` : ""}
<div class="docs-example">
  <div class="docs-example__preview${column ? " docs-example__preview--column" : ""}">${demo.html}</div>
  ${codeBlock(demo.code, { flush: true, live: true })}
</div>`;
}

/** Demos whose instances stack rather than sit in a row. */
const COLUMN_DEMOS = new Set([
  "InputSizes",
  "FieldDefault",
  "FieldError",
  "RadioDefault",
  "AlertTones",
  "InputDefault",
  "InputWithIcon",
  "InputWithAffix",
  "InputInvalid",
  "TextareaDefault",
  "SelectDefault",
  "CheckboxDescription",
  "ButtonToneMatrix",
]);

function componentPage(spec) {
  const manifest = MANIFESTS[spec.manifest];
  const lede = manifest?.description ?? "";

  const install = `<h2 class="docs-h2" id="installation">Installation</h2>
${codeBlock("npm install @area/react @area/styles", { title: "terminal" })}
<h2 class="docs-h2" id="usage">Usage</h2>
<div class="docs-stack">
${codeBlock(`import { ${spec.name} } from "@area/react";\nimport "@area/styles/area.css";`, { title: "app.tsx" })}
${codeBlock(demos[spec.examples[0].demo].code, { title: "app.tsx" })}
</div>`;

  const examples = `<h2 class="docs-h2" id="examples">Examples</h2>${spec.examples.map(exampleBlock).join("\n")}`;

  const api = `<h2 class="docs-h2" id="api">API reference</h2>
${table(
  ["Prop", "Type", "Default"],
  spec.api.map(([name, type, dflt]) => [
    `<span class="docs-mono">${escapeHtml(name)}</span>`,
    `<span class="docs-mono" style="color:var(--area-fg-accent)">${escapeHtml(type)}</span>`,
    `<span class="docs-mono" style="color:var(--area-fg-muted)">${escapeHtml(dflt)}</span>`,
  ]),
)}`;

  const guidance = PRACTICES[spec.slug] ?? [];
  const practices = guidance.length
    ? `<h2 class="docs-h2" id="practices">Best practices</h2>
<ul class="docs-list">${guidance.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : "";

  const cssNote = `<h2 class="docs-h2" id="css">Without React</h2>
<p class="docs-note">Every component is plain CSS. Use the classes directly when you are not using React.</p>
${codeBlock(demos[spec.examples[0].demo].html, { title: "index.html" })}`;

  const toc = [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    { id: "examples", title: "Examples" },
    ...spec.examples.map((e) => ({ id: e.id, title: e.title, nested: true })),
    ...(guidance.length ? [{ id: "practices", title: "Best practices" }] : []),
    { id: "api", title: "API reference" },
    { id: "css", title: "Without React" },
  ];

  return page({ slug: spec.slug, title: spec.name, lede, body: install + examples + practices + api + cssNote, toc });
}

/* --- Foundation pages ------------------------------------------------------- */

/** One colour scale, as a table of stops and a grid of cards printed on the colour itself. */
function scaleSection(name) {
  const scale = tokens.scales[name];

  const rows = scale.steps.map((step) => ({
    level: step.level,
    name: `${name}/${step.level}`,
    hex: step.hex,
    oklch: step.oklch,
    // Retained: it decides whether the card's own label is legible on the swatch.
    onColor: step.contrast.fg,
  }));

  // Role and contrast are deliberately absent. This is the global ramp -- raw colour,
  // nothing else. A level's role is a decision the semantic layer makes per theme and is
  // shown once, in the inversion table; contrast is a property of a *pairing*, so quoting
  // a number against an assumed foreground would describe something this table does not
  // show.
  const columns = [
    { header: "Token", cell: (r) => tokenChip(r.name, { swatch: `var(--area-${name}-${r.level})` }) },
    { header: "Hex", cell: (r) => `<span class="docs-mono">${r.hex}</span>` },
    { header: "OKLCH", cell: (r) => `<span class="docs-mono">${escapeHtml(r.oklch)}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><span class="docs-token-chip" style="background:var(--area-${name}-${r.level})"></span></div>`,
    },
  ];

  return tokenSection({
    id: `scale-${name}`,
    title: name,
    description: tokens.scaleDescriptions[name],
    rows,
    columns,
    card: (r) =>
      tokenCard({
        name: r.name,
        onColor: true,
        style: `background:var(--area-${name}-${r.level});color:var(--area-${r.onColor === "#ffffff" ? "white" : "black"})`,
        meta: [r.hex, escapeHtml(r.oklch)],
      }),
  });
}

/** The slot -> level map, which is the whole of what a theme change does. */
function inversionSection() {
  const rows = Object.entries(tokens.inversion).map(([slot, pair]) => ({
    slot,
    light: pair.light,
    dark: pair.dark,
  }));

  const swatch = (level) =>
    `<span class="docs-token-chip" style="background:var(--area-neutral-${level})"></span>`;

  return tokenSection({
    id: "inversion",
    title: "The inversion",
    description:
      "Each slot reads one level in light and another in dark. This table is the only difference between the two themes.",
    rows,
    columns: [
      { header: "Slot", cell: (r) => `<span class="docs-mono">${escapeHtml(r.slot)}</span>` },
      { header: "Light", cell: (r) => tokenChip(String(r.light), { swatch: `var(--area-neutral-${r.light})` }) },
      { header: "Dark", cell: (r) => tokenChip(String(r.dark), { swatch: `var(--area-neutral-${r.dark})` }) },
      {
        header: "Preview",
        cell: (r) => `<div class="docs-preview-cell">${swatch(r.light)}${swatch(r.dark)}</div>`,
      },
    ],
    card: (r) =>
      tokenCard({
        name: r.slot,
        meta: [`light ${r.light}`, `dark ${r.dark}`],
        figure: `<div style="display:flex;inline-size:100%">${swatch(r.light)}${swatch(r.dark)}</div>`,
      }),
  });
}

function colorPage() {
  const semanticRows = Object.entries(tokens.semantics).map(([name, meta]) => ({
    name,
    resolves:
      meta.light !== undefined
        ? `${meta.role} ${meta.light} / ${meta.dark}`
        : (meta.role ? `${meta.role} ${meta.kind}` : meta.kind),
  }));

  const levels = tokens.levels.join(", ");

  const body = `<div class="docs-prose">
<p>The colours are the <strong>Stadium palette</strong>, vendored verbatim — ${Object.keys(tokens.scales).length} families of ${tokens.levels.length} rungs. Area does not generate them. The palette was wall-anchored rather than formula-generated, with per-hue splines and hue held in IPT, and reproducing that from a curve was never going to land closer to it than using it.</p>
<p>A rung is an ordinal position, not a measurement: <strong>higher is darker</strong>, the direction Tailwind, Material and Radix all read. The ladder is ${levels} — finer at the ends than through the middle, because that is where an interface spends its steps. 25/50/75 are three distinguishable page grounds and 925/950/975 three distinguishable dark ones, while the middle, where text and fills live, runs in 50s.</p>
<p>Each family's <code class="docs-code-inline">500</code> is pinned to a contrast wall rather than to a lightness, which is why the hues do not share a lightness at a shared rung — yellow's 500 sits lighter than indigo's because yellow has to. There are two walls: a <em>label</em> ladder that clears AA with white at 500, and a <em>glyph</em> ladder pinned at 3:1 that only reaches AA at 600. Area finds each family's solid fill by measuring, so nothing here hardcodes which family is on which wall.</p>
<p>The three neutrals are one grey at three temperatures. <code class="docs-code-inline">neutral</code> is chroma 0 at every rung; <code class="docs-code-inline">cool</code> carries hue 248 and <code class="docs-code-inline">warm</code> is cool mirrored exactly — 180° away in OKLCh — so neither can drift from the other. Only chroma differs, so contrast is near-invariant across all three: measured, lightness deviates by at most 0.0055 and a white-contrast ratio by at most 0.23:1.</p>
<p>Dark mode is the same ramp read from the other end. There is one set of colours, not two.</p>
</div>
${inversionSection()}
${Object.keys(tokens.scales).map(scaleSection).join("\n")}
${tokenSection({
  id: "semantic",
  title: "Semantic tokens",
  description:
    "The only colour vocabulary a component may use. Each one points at a role and a level per theme, never at a literal.",
  rows: semanticRows,
  columns: [
    { header: "Token", cell: (r) => tokenChip(`--area-${r.name}`, { swatch: `var(--area-${r.name})` }) },
    { header: "Resolves to", cell: (r) => `<span class="docs-mono">${escapeHtml(r.resolves)}</span>` },
    {
      header: "Preview",
      cell: (r) => `<div class="docs-preview-cell"><span class="docs-token-chip" style="background:var(--area-${r.name})"></span></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `--area-${r.name}`,
      swatch: `var(--area-${r.name})`,
      meta: [escapeHtml(r.resolves)],
      figure: `<div style="inline-size:100%;block-size:var(--area-space-32);border-radius:var(--area-radius-small);background:var(--area-${r.name});box-shadow:inset 0 0 0 var(--area-border-width) var(--area-border-subtle)"></div>`,
    }),
})}
<h2 class="docs-h2" id="contrast">Contrast</h2>
<div class="docs-prose">
<p>Colour pairings are a build gate, not a review-time opinion. Every pairing a component can render is asserted under WCAG 2.2 and APCA across all 66 shipped theme combinations, and a failing colour cannot be published.</p>
<p>APCA is enforced as a hard gate in dark themes specifically, because the WCAG 2.x formula overstates contrast near black — a dark theme can clear 4.5:1 and still be unreadable.</p>
</div>`;

  return page({
    slug: "color",
    title: "Color",
    lede: "The Stadium palette, vendored: fourteen families of twenty-three rungs, anchored to contrast.",
    body,
    toc: [
      { id: "inversion", title: "The inversion" },
      ...Object.keys(tokens.scales).map((n) => ({ id: `scale-${n}`, title: n, nested: true })),
      { id: "semantic", title: "Semantic tokens" },
      { id: "contrast", title: "Contrast" },
    ],
  });
}

/** A specimen rendered at the value being documented. */
const AG = "Ag";

/**
 * Iconography.
 *
 * Reads the generated icon module rather than a hand-kept list, so the page cannot drift
 * from what the system actually ships -- the same rule every other foundation page follows.
 */
function iconographyPage() {
  const source = readFileSync(new URL("../src/icons.tsx", import.meta.url), "utf8");
  const rows = [...source.matchAll(/\/\*\* Fluent `([a-z0-9_]+)`\. \*\/\s*export const (\w+)/g)].map(
    ([, fluent, name]) => ({ name, fluent, svg: extractIcon(source, name) }),
  );

  // Read from the density axis rather than typed out. Hand-listing them named
  // `--area-icon-sm` as 12px when it is 16, which is the failure mode the whole
  // generate-the-docs rule exists to prevent.
  const USE = {
    "12px": "Dense chrome: a table row affordance, a chip dismiss.",
    "16px": "The default. Every inline icon beside a label.",
    "24px": "Standalone, where the icon is the whole affordance.",
  };
  const density = tokens.axes.find((a) => a.id === "density").presets.find((p) => p.id === "default");
  const seen = new Map();
  for (const [token, value] of Object.entries(density.tokens)) {
    if (!/^--area-icon-/.test(token)) continue;
    if (!seen.has(value)) seen.set(value, token);
  }
  const sizes = [...seen.entries()]
    .map(([px, token]) => ({ token, px, use: USE[px] ?? "" }))
    .sort((a, b) => parseInt(a.px) - parseInt(b.px));

  const body = `<div class="docs-prose">
<p>Icons are <strong>Fluent System Icons</strong>, Microsoft's set, used at the 16px Regular cut. The path data is generated from <code class="area-code">@fluentui/svg-icons</code> by <code class="area-code">gen-icons.mjs</code> and is never drawn by hand, so an icon here is the same glyph Fluent ships rather than an approximation of it.</p>
<p>Two consequences worth knowing. Fluent icons are <em>filled</em> paths, not strokes, so they take <code class="area-code">fill</code> and never <code class="area-code">stroke-width</code> — a stroke-based icon dropped in beside them will not match at any weight. And they are optically corrected per size, which is why the 16px cut is used at 16px instead of scaling the 20 or 24 down to fit.</p>
<p>An icon never sets its own size. It fills the slot it sits in, and the slot takes its size from the density axis, so every icon in the system moves when density does.</p>
</div>
${tokenSection({
  id: "sizes",
  title: "Sizes",
  description:
    "Three, and nothing between them. VS Code's own token linter permits exactly 16 and 12 and notes that a codicon at 13, 14 or 15px is always a mistake for one of them; Octicons adds 24 for the standalone tier.",
  rows: sizes,
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.token) },
    { header: "Size", cell: (r) => `<span class="docs-mono">${r.px}</span>` },
    { header: "Use", cell: (r) => escapeHtml(r.use) },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><span style="display:inline-flex;inline-size:var(${r.token});block-size:var(${r.token})">${rows[0].svg}</span></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.token,
      meta: [r.px],
      figure: `<span style="display:inline-flex;inline-size:var(${r.token});block-size:var(${r.token})">${rows[0].svg}</span>`,
    }),
})}
${tokenSection({
  id: "set",
  title: "The set",
  description:
    "Every icon the documentation and demos use, with the Fluent identifier each one is generated from.",
  rows,
  columns: [
    { header: "Export", cell: (r) => tokenChip(r.name) },
    { header: "Fluent", cell: (r) => `<span class="docs-mono">${escapeHtml(r.fluent)}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><span style="display:inline-flex;inline-size:var(--area-icon-md);block-size:var(--area-icon-md)">${r.svg}</span></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.name,
      meta: [r.fluent],
      figure: `<span style="display:inline-flex;inline-size:var(--area-icon-lg);block-size:var(--area-icon-lg)">${r.svg}</span>`,
    }),
})}
<h2 class="docs-h2" id="adding">Adding one</h2>
<div class="docs-prose">
<p>Add the export name and its Fluent identifier to the map in <code class="area-code">gen-icons.mjs</code>, then run it. Nothing else is edited by hand — the module below is generated output, and editing it directly is how the set drifts from Fluent.</p>
</div>
${codeBlock(`const MAP = {\n  PlusIcon: "add_16_regular",\n  // ...\n};`, { title: "gen-icons.mjs" })}`;

  return page({
    slug: "iconography",
    title: "Iconography",
    lede: "Fluent System Icons at 16px, generated rather than drawn, sized by the density axis.",
    body,
    toc: [
      { id: "sizes", title: "Sizes" },
      { id: "set", title: "The set" },
      { id: "adding", title: "Adding one" },
    ],
  });
}

/** Pull one icon's inline SVG out of the generated module, for rendering in the docs. */
function extractIcon(source, name) {
  const block = source.slice(source.indexOf(`export const ${name}`));
  const paths = [...block.slice(0, block.indexOf("</svg>")).matchAll(/<path d="([^"]+)"/g)];
  return `<svg viewBox="0 0 16 16" width="100%" height="100%" fill="currentColor" aria-hidden="true">${paths
    .map(([, d]) => `<path d="${d}"/>`)
    .join("")}</svg>`;
}

function typographyPage() {
  const preset = tokens.axes.find((a) => a.id === "type").presets.find((p) => p.id === "geist");
  const px = (token) => (preset.tokens[token] ?? "").replace(/var\(--area-(size|leading)-|\)/g, "");

  const groups = { text: [], title: [], display: [] };
  for (const name of Object.keys(preset.tokens)) {
    const m = name.match(/^--area-(text|title|display)-(\w+)-size$/);
    if (!m) continue;
    const [, group, step] = m;
    groups[group].push({
      group,
      step,
      size: px(`--area-${group}-${step}-size`),
      leading: px(`--area-${group}-${step}-leading`),
      tracking: preset.tokens[`--area-${group}-${step}-tracking`],
    });
  }
  for (const key of Object.keys(groups)) groups[key].sort((a, b) => a.size - b.size);

  const composite = (group, title, description) =>
    tokenSection({
      id: group,
      title,
      description,
      rows: groups[group],
      columns: [
        { header: "Token", cell: (r) => tokenChip(`${r.group}/${r.step}`) },
        { header: "Size", cell: (r) => `<span class="docs-mono">${r.size}px</span>` },
        { header: "Leading", cell: (r) => `<span class="docs-mono">${r.leading}px</span>` },
        { header: "Ratio", cell: (r) => `<span class="docs-mono">${(r.leading / r.size).toFixed(2)}</span>` },
        { header: "Tracking", cell: (r) => `<span class="docs-mono">${r.tracking}</span>` },
        {
          header: "Regular",
          cell: (r) => `<div style="font:var(--area-weight-regular) var(--area-${r.group}-${r.step}-size)/var(--area-${r.group}-${r.step}-leading) var(--area-font-sans);letter-spacing:var(--area-${r.group}-${r.step}-tracking)">${AG}</div>`,
        },
        {
          header: "Strong",
          cell: (r) => `<div style="font:var(--area-weight-strong) var(--area-${r.group}-${r.step}-size)/var(--area-${r.group}-${r.step}-leading) var(--area-font-sans);letter-spacing:var(--area-${r.group}-${r.step}-tracking)">${AG}</div>`,
        },
      ],
      card: (r) =>
        tokenCard({
          name: `${r.group}/${r.step}`,
          meta: [`${r.size}px / ${r.leading}px / ${r.tracking}`],
          figure: `<div style="font:var(--area-weight-regular) var(--area-${r.group}-${r.step}-size)/var(--area-${r.group}-${r.step}-leading) var(--area-font-sans);letter-spacing:var(--area-${r.group}-${r.step}-tracking)">${AG}</div>`,
        }),
    });

  const primitive = (id, title, description, ramp, unit, style) =>
    tokenSection({
      id,
      title,
      description,
      rows: ramp.map((value) => ({ value })),
      columns: [
        { header: "Token", cell: (r) => tokenChip(`${id}/${r.value}`) },
        { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}${unit}</span>` },
        { header: "Preview", cell: (r) => `<div class="docs-preview-cell"><div style="${style(r.value)}">${AG}</div></div>` },
      ],
      card: (r) =>
        tokenCard({
          name: `${id}/${r.value}`,
          meta: [`Value: ${r.value}${unit}`],
          figure: `<div style="${style(r.value)}">${AG}</div>`,
        }),
    });

  const body = `<div class="docs-prose">
<p><strong>Weight is orthogonal to role.</strong> A role sets size, leading and tracking — it does not set weight. That is what makes large text at a regular weight possible: a 20px paragraph rather than a 20px heading. A ramp with weight baked into the role cannot express that at all.</p>
<p><strong>Two weights, not three.</strong> Regular at 400 and strong at 550. Every composite below exists in both, which is why each row shows both.</p>
<p>Composites point at the primitive ramps rather than at literals, so the scale presets move by whole steps rather than multiplying — which is what keeps every preset on the ramp instead of landing on 12.25px.</p>
</div>
${composite("text", "Text", "Anything read as prose or rendered inside a control. Leading runs 1.33 to 1.5, rising with size. The 16px step is the size this ramp is meant to be read at; controls take 14px, the split Notion uses between content and chrome.")}
${composite("title", "Title", "Headings, from a card's to a page's. The same sizes as the upper half of the text ramp, but with tighter leading and real negative tracking, because a title is one or two lines and a paragraph is not.")}
${composite("display", "Display", "Hero type, at a leading ratio of 1.0. Tracking stops at -0.03em: Inter's published metrics curve asymptotes at -0.0223em, so anything beyond roughly -0.03em is a stylistic choice rather than an optical correction.")}
${primitive(
  "size",
  "Size",
  `${tokens.sizeRamp.length} pixel stops from ${tokens.sizeRamp[0]} to ${tokens.sizeRamp.at(-1)}, referenced by every composite.`,
  tokens.sizeRamp,
  "px",
  (v) => `font-size:var(--area-size-${v});line-height:1.1`,
)}
${primitive(
  "leading",
  "Line height",
  `${tokens.leadingRamp.length} pixel stops from ${tokens.leadingRamp[0]} to ${tokens.leadingRamp.at(-1)}, which composites pair with a size by ratio.`,
  tokens.leadingRamp,
  "px",
  (v) => `line-height:var(--area-leading-${v});background:var(--area-accent-surface);display:inline-block`,
)}
${primitive(
  "wght",
  "Weight",
  `${tokens.wghtRamp.length} stops named by their OpenType wght value. The half-steps exist because Geist is variable; a platform font cannot reach them.`,
  tokens.wghtRamp,
  "",
  (v) => `font-weight:var(--area-wght-${v});font-size:var(--area-size-24)`,
)}
${tokenSection({
  id: "weights",
  title: "Semantic weights",
  description:
    "Two, and only two. Material ships a parallel emphasized scale that is a uniform one-step increase on the variable weight axis; this is the same idea with one token instead of a second ramp.",
  rows: [
    { name: "weight/regular", geist: 400, system: 400, use: "Body copy, and any text being read rather than scanned." },
    { name: "weight/strong", geist: 550, system: 600, use: "Titles, control labels, and emphasis within text. Not long-form copy." },
  ],
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    { header: "Geist", cell: (r) => `<span class="docs-mono">${r.geist}</span>` },
    { header: "System", cell: (r) => `<span class="docs-mono">${r.system}</span>` },
    { header: "Use", cell: (r) => escapeHtml(r.use) },
    {
      header: "Preview",
      cell: (r) => `<div class="docs-preview-cell"><div style="font-weight:${r.geist};font-size:var(--area-size-20)">${AG}</div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.name,
      meta: [`Geist: ${r.geist}`, `System: ${r.system}`],
      figure: `<div style="font-weight:${r.geist};font-size:var(--area-size-32)">${AG}</div>`,
    }),
})}`;

  return page({
    slug: "typography",
    title: "Typography",
    lede: "Three roles, two weights, and every size available in both.",
    body,
    toc: [
      { id: "text", title: "Text" },
      { id: "title", title: "Title" },
      { id: "display", title: "Display" },
      { id: "size", title: "Size" },
      { id: "leading", title: "Line height" },
      { id: "wght", title: "Weight" },
      { id: "weights", title: "Semantic weights" },
    ],
  });
}

function axisPresetTable(axisId) {
  const axis = tokens.axes.find((a) => a.id === axisId);
  return table(
    ["Preset", "Attribute", "Description"],
    axis.presets.map((p) => [
      escapeHtml(p.label) + (p.id === axis.defaultPreset ? " (default)" : ""),
      `<span class="docs-mono" style="color:var(--area-fg-accent)">${axis.attribute}="${p.id}"</span>`,
      escapeHtml(p.description),
    ]),
  );
}

function specimen(name, figure, meta) {
  return `<div class="docs-specimen">
  <span class="docs-specimen__name">${escapeHtml(name)}</span>
  <div class="docs-specimen__figure">${figure}</div>
  ${meta ? `<span class="docs-specimen__name">${escapeHtml(meta)}</span>` : ""}
</div>`;
}

function specimenGrid(items) {
  return `<div class="docs-specimen-grid">${items.join("")}</div>`;
}

/** Tier values for the current density preset, read from the token data. */
function densityRows(presetId) {
  const axis = tokens.axes.find((a) => a.id === "density");
  const preset = axis.presets.find((p) => p.id === presetId);
  return ["xs", "sm", "md", "lg", "xl"].map((tier) => ({
    tier,
    height: preset.tokens[`--area-control-${tier}`],
    gutter: preset.tokens[`--area-gutter-${tier}`],
    icon: preset.tokens[`--area-icon-${tier}`],
    gap: preset.tokens[`--area-gap-${tier}`],
    text: (preset.tokens[`--area-control-${tier}-text`] ?? "").replace(/var\(--area-size-|\)/g, "") + "px",
  }));
}

function densityPage() {
  const rows = densityRows("default");
  const compact = densityRows("compact");

  const body = `<div class="docs-prose">
<p>The default tier is 32px — the most common default across every system measured. The ladder 24/28/32/40/48 is Primer's exact scale.</p>
<p>Two presets, each calibrated to real products. <strong>Default</strong> puts medium at 32px, which Primer, OpenAI and Vercel all agree on. <strong>Compact</strong> puts it at 28px, which is Notion's measured in-app row height.</p>
<p><strong>The type steps down with the box.</strong> Each compact tier sits exactly one stop below its default counterpart on the size ramp, so medium goes from 14px to 13px — the UI font size VS&nbsp;Code, Cursor and Linear all ship.</p>
<p>The two references genuinely disagree here. VS&nbsp;Code's own density layer contains no <code class='area-code'>font-size</code> declarations at all: it swaps 24px for 20px and 8px for 4px and leaves type alone, because its base is already 13px and has nowhere to go. Ant Design, starting from a roomier 14px, drops a step. Area starts at 14, so it follows Ant Design.</p>
<p>Chrome follows the density; content does not. <code class='area-code'>--area-ui-size</code> carries the medium tier's size to anything that is scanned rather than read — tables, menu items, field labels — while prose stays on the typography axis at 16px. That is the same split Notion uses between its 14px interface and its 16px documents.</p>
</div>
${tokenSection({
  id: "tiers",
  title: "Control tiers",
  description: "Every dimension a control needs, at each of the five tiers, in both presets.",
  rows,
  columns: [
    { header: "Token", cell: (r) => tokenChip(`control/${r.tier}`) },
    { header: "Compact", cell: (r) => `<span class="docs-mono">${compact.find((c) => c.tier === r.tier).height}</span>` },
    { header: "Default", cell: (r) => `<span class="docs-mono">${r.height}</span>` },
    { header: "Type", cell: (r) => `<span class="docs-mono">${compact.find((c) => c.tier === r.tier).text} / ${r.text}</span>` },
    { header: "Padding", cell: (r) => `<span class="docs-mono">${r.gutter}</span>` },
    { header: "Icon", cell: (r) => `<span class="docs-mono">${r.icon}</span>` },
    { header: "Gap", cell: (r) => `<span class="docs-mono">${r.gap}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-64);block-size:var(--area-control-${r.tier});border-radius:var(--area-radius-control)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `control/${r.tier}`,
      meta: [`${r.height} tall · ${r.text} type`, `${r.gutter} padding · ${r.icon} icon · ${r.gap} gap`],
      figure: `<div class="docs-specimen__box" style="inline-size:100%;block-size:var(--area-control-${r.tier});border-radius:var(--area-radius-control)"></div>`,
    }),
})}
${tokenSection({
  id: "spacing",
  title: "Spacing",
  description:
    "Fixed primitives, named by their pixel value. The density axis moves which step a component reaches for; it never rescales the ramp.",
  rows: tokens.spaceRamp.map((value) => ({ value })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(`spacing/${r.value}`) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}px</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-${r.value});block-size:var(--area-space-16);border-radius:var(--area-radius-2)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `spacing/${r.value}`,
      meta: [`Value: ${r.value}px`],
      figure: `<div class="docs-specimen__box" style="inline-size:var(--area-space-${r.value});block-size:var(--area-space-24);border-radius:var(--area-radius-2)"></div>`,
    }),
})}
${tokenSection({
  id: "icon",
  title: "Icon sizes",
  description: "One per control tier. 16px holds through the middle of the range, which is the near-universal inline icon size.",
  rows,
  columns: [
    { header: "Token", cell: (r) => tokenChip(`icon/${r.tier}`) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.icon}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-icon-${r.tier});block-size:var(--area-icon-${r.tier});border-radius:var(--area-radius-2)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `icon/${r.tier}`,
      meta: [`Value: ${r.icon}`],
      figure: `<div class="docs-specimen__box" style="inline-size:var(--area-icon-${r.tier});block-size:var(--area-icon-${r.tier});border-radius:var(--area-radius-2)"></div>`,
    }),
})}
<h2 class="docs-h2" id="presets">Presets</h2>
${axisPresetTable("density")}`;

  return page({
    slug: "density",
    title: "Density",
    lede: "Control heights and the room inside them.",
    body,
    toc: [
      { id: "tiers", title: "Control tiers" },
      { id: "spacing", title: "Spacing" },
      { id: "icon", title: "Icon sizes" },
      { id: "presets", title: "Presets" },
    ],
  });
}

function radiusPage() {
  const axis = tokens.axes.find((a) => a.id === "radius");

  const body = `<div class="docs-prose">
<p>Flat per preset, and the same at every control tier. An earlier version derived radius as a proportion of control height, but the evidence does not support it: Primer at 32px, Vercel at 32px, Linear at 32px and Notion at 28px all ship exactly 6px. Nobody moves control radius when density changes.</p>
<p>Containers sit at 12px — the single most agreed-upon number in the survey: Primer overlays, OpenAI's popover, dialog and alert, and Linear's cards all use it.</p>
</div>
${tokenSection({
  id: "presets",
  title: "Presets",
  description: "Each preset sets three radii: controls, containers, and small nested shapes.",
  rows: axis.presets.map((p) => ({
    id: p.id,
    label: p.label,
    control: p.tokens["--area-radius-control"],
    container: p.tokens["--area-radius-container"],
    small: p.tokens["--area-radius-small"],
    isDefault: p.id === axis.defaultPreset,
  })),
  columns: [
    { header: "Preset", cell: (r) => tokenChip(`radius/${r.id}`) },
    { header: "Control", cell: (r) => `<span class="docs-mono">${r.control}</span>` },
    { header: "Container", cell: (r) => `<span class="docs-mono">${r.container}</span>` },
    { header: "Small", cell: (r) => `<span class="docs-mono">${r.small}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" data-area-radius="${r.id}" style="inline-size:var(--area-space-24);block-size:var(--area-space-24);border-radius:var(--area-radius-control)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `radius/${r.id}${r.isDefault ? " (default)" : ""}`,
      meta: [`Control: ${r.control}`, `Container: ${r.container}`],
      figure: `<div class="docs-specimen__box" data-area-radius="${r.id}" style="inline-size:var(--area-control-xl);block-size:var(--area-control-xl);border-radius:var(--area-radius-control)"></div>`,
    }),
})}
${tokenSection({
  id: "ramp",
  title: "Radius ramp",
  description: "Fixed primitives, named by their pixel value, from which the presets draw.",
  rows: tokens.radiusRamp.map((value) => ({ value })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(`radius/${r.value}`) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}px</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-24);block-size:var(--area-space-24);border-radius:var(--area-radius-${r.value})"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `radius/${r.value}`,
      meta: [`Value: ${r.value}px`],
      figure: `<div class="docs-specimen__box" style="inline-size:var(--area-space-48);block-size:var(--area-space-48);border-radius:var(--area-radius-${r.value})"></div>`,
    }),
})}`;

  return page({
    slug: "radius",
    title: "Radius",
    lede: "How rounded controls and containers are.",
    body,
    toc: [
      { id: "presets", title: "Presets" },
      { id: "ramp", title: "Radius ramp" },
    ],
  });
}

function surfacePage() {
  const axis = tokens.axes.find((a) => a.id === "surface");
  const current = axis.presets.find((p) => p.id === axis.defaultPreset);
  const ELEVATION = ["resting", "raised", "floating", "modal"];

  const body = `<div class="docs-prose">
<p>Elevation uses negative spread so a shadow reads as lift rather than as a grey halo. Shadow colour is its own token, so a dark theme can deepen it — a shadow authored as flat black disappears on a dark surface.</p>
</div>
${tokenSection({
  id: "elevation",
  title: "Elevation",
  description: "Four levels, each named for what sits at it.",
  rows: [1, 2, 3, 4].map((level) => ({
    level,
    use: ELEVATION[level - 1],
    value: current.tokens[`--area-shadow-${level}`],
  })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(`shadow/${r.level}`) },
    { header: "Use", cell: (r) => escapeHtml(r.use) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${escapeHtml(r.value)}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div style="inline-size:var(--area-space-32);block-size:var(--area-space-32);border-radius:var(--area-radius-small);background:var(--area-bg-surface);box-shadow:var(--area-shadow-${r.level})"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: `shadow/${r.level}`,
      meta: [escapeHtml(r.use)],
      figure: `<div style="inline-size:var(--area-control-xl);block-size:var(--area-control-xl);border-radius:var(--area-radius-container);background:var(--area-bg-surface);box-shadow:var(--area-shadow-${r.level})"></div>`,
    }),
})}
${tokenSection({
  id: "stroke",
  title: "Stroke and ring",
  description: "Border weight, and the geometry of the focus ring every component shares.",
  rows: [
    { name: "border/width", token: "--area-border-width", value: current.tokens["--area-border-width"] },
    { name: "ring/width", token: "--area-ring-width", value: current.tokens["--area-ring-width"] },
    { name: "ring/offset", token: "--area-ring-offset", value: current.tokens["--area-ring-offset"] },
  ].filter((r) => r.value),
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${r.value}</span>` },
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div style="inline-size:var(--area-space-32);block-size:var(--area-space-20);border-radius:var(--area-radius-small);border:var(${r.token}) solid var(--area-border)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.name,
      meta: [`Value: ${r.value}`],
      figure: `<div style="inline-size:100%;block-size:var(--area-space-32);border-radius:var(--area-radius-small);border:var(${r.token}) solid var(--area-border)"></div>`,
    }),
})}
<h2 class="docs-h2" id="presets">Presets</h2>
${axisPresetTable("surface")}`;

  return page({
    slug: "surface",
    title: "Surface",
    lede: "Stroke weight and elevation.",
    body,
    toc: [
      { id: "elevation", title: "Elevation" },
      { id: "stroke", title: "Stroke and ring" },
      { id: "presets", title: "Presets" },
    ],
  });
}

function motionPage() {
  const axis = tokens.axes.find((a) => a.id === "motion");
  const current = axis.presets.find((p) => p.id === axis.defaultPreset);
  const durations = Object.keys(current.tokens).filter((k) => k.includes("-duration-"));
  const easings = Object.keys(current.tokens).filter((k) => k.includes("-ease-"));

  const body = `<div class="docs-prose">
<p>Every preset keeps the same token names, so no component ever branches on motion. The <code class='area-code'>none</code> preset sets durations to zero rather than removing transitions, which lets it double as the target for <code class='area-code'>prefers-reduced-motion</code>.</p>
</div>
${tokenSection({
  id: "durations",
  title: "Durations",
  description: "Four steps, shown across every preset so the presets can be compared directly.",
  rows: durations.map((token) => ({ token, name: token.replace("--area-duration-", "duration/") })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    ...axis.presets.map((p) => ({
      header: p.label,
      cell: (r) => `<span class="docs-mono">${p.tokens[r.token]}</span>`,
    })),
    {
      header: "Preview",
      cell: (r) =>
        `<div class="docs-preview-cell"><div class="docs-specimen__box" style="inline-size:var(--area-space-48);block-size:var(--area-space-8);border-radius:var(--area-radius-full);transition:inline-size var(${r.token}) var(--area-ease-out)"></div></div>`,
    },
  ],
  card: (r) =>
    tokenCard({
      name: r.name,
      meta: axis.presets.map((p) => `${p.label}: ${p.tokens[r.token]}`),
    }),
})}
${tokenSection({
  id: "easings",
  title: "Easings",
  description: "Five curves. Spring overshoots, so it is for elements that enter, never for colour.",
  rows: easings.map((token) => ({ token, name: token.replace("--area-ease-", "easing/"), value: current.tokens[token] })),
  columns: [
    { header: "Token", cell: (r) => tokenChip(r.name) },
    { header: "Value", cell: (r) => `<span class="docs-mono">${escapeHtml(r.value)}</span>` },
  ],
  card: (r) => tokenCard({ name: r.name, meta: [escapeHtml(r.value)] }),
})}
<h2 class="docs-h2" id="presets">Presets</h2>
${axisPresetTable("motion")}`;

  return page({
    slug: "motion",
    title: "Motion",
    lede: "How long transitions take.",
    body,
    toc: [
      { id: "durations", title: "Durations" },
      { id: "easings", title: "Easings" },
      { id: "presets", title: "Presets" },
    ],
  });
}

function axesPage() {
  const body = `<div class="docs-prose">
<p>Area is built around eight axes. Each one is a dimension you can retune, each ships a small set of presets, and choosing one is a single data attribute on the root element.</p>
<p>The rule that makes eight axes composable rather than a matrix of thousands of combinations is that no two axes write the same custom property. That is checked mechanically on every build — if two axes ever collide, the build stops.</p>
<p>Because custom properties inherit, a subtree can carry its own axis values. A sidebar marked <code class='area-code'>data-area-density="compact"</code> gets shorter controls <em>and</em> correctly re-derived corner radii, without any component knowing it happened.</p>
</div>
<h2 class="docs-h2" id="usage">Usage</h2>
${codeBlock(`<html data-area-theme="dark" data-area-accent="purple" data-area-density="compact">`, { title: "index.html" })}
${tokens.axes
  .map(
    (a) => `<h2 class="docs-h2" id="${a.id}">${escapeHtml(a.label)}</h2>
<p class="docs-note">${escapeHtml(a.description)} Owns ${a.namespaces.length} namespace${a.namespaces.length === 1 ? "" : "s"}, ${a.presets.length} preset${a.presets.length === 1 ? "" : "s"}.</p>
${axisPresetTable(a.id)}`,
  )
  .join("")}`;

  return page({
    slug: "axes",
    title: "Axes",
    lede: "Eight independent dimensions, each one data attribute away.",
    body,
    toc: [{ id: "usage", title: "Usage" }, ...tokens.axes.map((a) => ({ id: a.id, title: a.label }))],
  });
}

function indexPage() {
  const body = `<div class="docs-prose">
<p>Area is a design system whose defining feature is that it is tunable along eight independent axes: theme, neutral, accent, typography, density, radius, surface and motion. Components consume only semantic tokens, so changing an axis reflows the whole system without touching a single component.</p>
<p>Defaults are not taste. The 32px control, 6px control radius, 12px container radius and 14/20 text are the values that GitHub Primer, OpenAI, Vercel, Linear and Notion converge on, measured from their shipped code rather than inferred.</p>
</div>
<h2 class="docs-h2" id="install">Installation</h2>
${codeBlock("npm install @area/react @area/styles", { title: "terminal" })}
<h2 class="docs-h2" id="start">Getting started</h2>
${codeBlock(`import { Button } from "@area/react";\nimport "@area/styles/area.css";\n\nexport default function App() {\n  return <Button>Get started</Button>;\n}`, { title: "app.tsx" })}
<h2 class="docs-h2" id="defaults">Defaults</h2>
<p class="docs-note">Measured from shipped code, not chosen. Where the systems disagree, Area follows the majority.</p>
${table(
  ["", "Area", "Primer", "OpenAI", "Vercel", "shadcn", "Notion"],
  [
    ["Control height", "<strong>32</strong>", "32", "32", "40", "36", "28–32"],
    ["Control radius", "<strong>6</strong>", "6", "6–8", "6", "8", "6"],
    ["Container radius", "<strong>12</strong>", "12", "12", "8–12", "10–14", "10"],
    ["Control text", "<strong>14/20</strong>", "14/21", "14/20", "14/20", "14/20", "14/16.8"],
    ["Inline icon", "<strong>16</strong>", "16", "18", "—", "16", "20"],
    ["Spacing base", "<strong>4</strong>", "4", "4", "4", "4", "2"],
  ].map((row) => [
    escapeHtml(row[0]),
    ...row.slice(1).map((v) => `<span class="docs-mono">${v}</span>`),
  ]),
)}
<h2 class="docs-h2" id="principles">Principles</h2>
<div class="docs-prose">
<p><strong>Every number is derived.</strong> A control's corner radius is a proportion of its height; a menu item's radius is its panel's radius less the panel's padding. Those relationships are expressed once, in <code class='area-code'>calc()</code>, so they stay true under every combination of axes.</p>
<p><strong>Contrast is a build gate.</strong> Every colour pairing a component can render is asserted under WCAG 2.2 and APCA across all 66 shipped themes. A failing colour cannot be published.</p>
<p><strong>The CSS and the React API cannot drift.</strong> Both are generated from one manifest per component, and a script fails the build if a declared variant has no selector, or a selector exists that was never declared.</p>
<p><strong>Documentation cannot lie.</strong> Every preview on this site is the real component rendered, and every snippet is that same demo's source.</p>
</div>`;

  return page({
    slug: "index",
    title: "Area",
    lede: "A design system you tune along eight axes.",
    body,
    toc: [
      { id: "install", title: "Installation" },
      { id: "start", title: "Getting started" },
      { id: "defaults", title: "Defaults" },
      { id: "principles", title: "Principles" },
    ],
  });
}

/* --- Emit ------------------------------------------------------------------- */

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(repo, "packages/styles/dist/area.css"), join(out, "area.css"));

const pages = [
  ["index.html", indexPage()],
  ["axes.html", axesPage()],
  ["color.html", colorPage()],
  ["typography.html", typographyPage()],
  ["iconography.html", iconographyPage()],
  ["density.html", densityPage()],
  ["radius.html", radiusPage()],
  ["surface.html", surfacePage()],
  ["motion.html", motionPage()],
  ...COMPONENT_PAGES.map((spec) => [`${spec.slug}.html`, componentPage(spec)]),
];

for (const [name, html] of pages) writeFileSync(join(out, name), html, "utf8");

console.log(`\n  @area/docs\n`);
console.log(`  ${pages.length} pages, ${Object.keys(demos).length} demos`);
console.log(`  dist/ -> ${out}\n`);
