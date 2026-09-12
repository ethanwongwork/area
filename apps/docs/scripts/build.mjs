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
import { AXIS_SCRIPT, DOCS_CSS, escapeHtml, highlight } from "./layout.mjs";
import { COMPONENT_PAGES } from "../src/pages.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(root, "..", "..");
const out = join(root, "dist");

const tokens = JSON.parse(readFileSync(join(repo, "packages/tokens/dist/tokens.json"), "utf8"));
const { MANIFESTS } = await import(join(repo, "packages/styles/src/manifest.ts"));
const demos = await renderDemos();

const FOUNDATION_PAGES = [
  { slug: "color", name: "Color" },
  { slug: "typography", name: "Typography" },
  { slug: "density", name: "Density" },
  { slug: "radius", name: "Radius" },
  { slug: "surface", name: "Surface" },
  { slug: "motion", name: "Motion" },
];

/* --- Chrome ---------------------------------------------------------------- */

function axisBar() {
  const wanted = ["theme", "accent", "neutral", "type", "density", "radius", "surface", "motion"];
  return `<div class="axis-bar">${wanted
    .map((id) => {
      const axis = tokens.axes.find((a) => a.id === id);
      if (!axis) return "";
      const options = axis.presets
        .map((p) => `<option value="${p.id}"${p.id === axis.defaultPreset ? " selected" : ""}>${escapeHtml(p.label)}</option>`)
        .join("");
      return `<span class="axis-control"><label for="axis-${id}">${escapeHtml(axis.label)}</label><select id="axis-${id}" class="area-select area-select--sm" data-axis="${id}" style="inline-size:auto">${options}</select></span>`;
    })
    .join("")}</div>`;
}

function sidebar(activeSlug) {
  const link = (href, label, slug) =>
    `<a class="sidebar__link" href="${href}"${slug === activeSlug ? ' aria-current="page"' : ""}>${escapeHtml(label)}</a>`;

  return `<aside class="sidebar">
  <div class="sidebar__group">
    <div class="sidebar__title">Getting started</div>
    ${link("./index.html", "Introduction", "index")}
    ${link("./axes.html", "Axes", "axes")}
  </div>
  <div class="sidebar__group">
    <div class="sidebar__title">Foundations</div>
    ${FOUNDATION_PAGES.map((p) => link(`./${p.slug}.html`, p.name, p.slug)).join("\n    ")}
  </div>
  <div class="sidebar__group">
    <div class="sidebar__title">Components</div>
    ${COMPONENT_PAGES.map((p) => link(`./${p.slug}.html`, p.name, p.slug)).join("\n    ")}
  </div>
</aside>`;
}

function page({ slug, title, lede, body, toc = [] }) {
  const tocHtml = toc.length
    ? `<nav class="toc"><div class="toc__title">On this page</div>${toc
        .map((t) => `<a href="#${t.id}">${escapeHtml(t.title)}</a>`)
        .join("")}</nav>`
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
<header class="topbar">
  <a class="brand" href="./index.html"><span class="brand__mark"></span> Area</a>
  <span class="topbar__spacer"></span>
  ${axisBar()}
</header>
<div class="shell">
  ${sidebar(slug)}
  <main class="main">
    <div class="content">
      <h1 class="page-title">${escapeHtml(title)}</h1>
      <p class="page-lede">${escapeHtml(lede)}</p>
      ${body}
    </div>
    ${tocHtml}
  </main>
</div>
<script>${AXIS_SCRIPT}</script>
</body>
</html>`;
}

/* --- Component pages -------------------------------------------------------- */

function exampleBlock(example) {
  const demo = demos[example.demo];
  if (!demo) throw new Error(`Page references demo "${example.demo}", which does not exist.`);

  const column = /column/.test(example.demo) || ["InputSizes", "FieldDefault", "FieldError", "RadioDefault", "AlertTones"].includes(example.demo);

  return `<h3 class="example" id="${example.id}">${escapeHtml(example.title)}</h3>
${example.note ? `<p class="note">${escapeHtml(example.note)}</p>` : ""}
<div class="example-block">
  <div class="preview${column ? " preview--column" : ""}">${demo.html}</div>
  <details class="code">
    <summary>View code</summary>
    <pre class="code-block"><code>${highlight(demo.code)}</code></pre>
  </details>
</div>`;
}

function componentPage(spec) {
  const manifest = MANIFESTS[spec.manifest];
  const lede = manifest?.description ?? "";

  const install = `<h2 class="section" id="installation">Installation</h2>
<div class="example-block"><pre class="code-block"><code>${highlight(`npm install @area/react @area/styles`)}</code></pre></div>
<h2 class="section" id="usage">Usage</h2>
<div class="example-block"><pre class="code-block"><code>${highlight(
    `import { ${spec.name} } from "@area/react";\nimport "@area/styles/area.css";`,
  )}</code></pre></div>
<div class="example-block" style="margin-block-start:8px"><pre class="code-block"><code>${highlight(
    demos[spec.examples[0].demo].code,
  )}</code></pre></div>`;

  const examples = `<h2 class="section" id="examples">Examples</h2>${spec.examples.map(exampleBlock).join("\n")}`;

  const api = `<h2 class="section" id="api">API reference</h2>
<table class="api-table">
  <thead><tr><th>Prop</th><th>Type</th><th>Default</th></tr></thead>
  <tbody>${spec.api
    .map(([name, type, dflt]) => `<tr><td>${escapeHtml(name)}</td><td>${escapeHtml(type)}</td><td>${escapeHtml(dflt)}</td></tr>`)
    .join("")}</tbody>
</table>`;

  const cssNote = `<h2 class="section" id="css">Without React</h2>
<p class="note">Every component is plain CSS. Use the classes directly when you are not using React.</p>
<div class="example-block"><pre class="code-block"><code>${highlight(demos[spec.examples[0].demo].html)}</code></pre></div>`;

  const toc = [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    { id: "examples", title: "Examples" },
    ...spec.examples.map((e) => ({ id: e.id, title: "  " + e.title })),
    { id: "api", title: "API reference" },
    { id: "css", title: "Without React" },
  ];

  return page({ slug: spec.slug, title: spec.name, lede, body: install + examples + api + cssNote, toc });
}

/* --- Foundation pages ------------------------------------------------------- */

function swatchRow(name, theme) {
  const scale = tokens.scales[name][theme];
  return `<div class="swatch-row">
  <div class="swatch-row__name">${name}</div>
  <div class="swatch-grid">${scale.steps
    .map((s) => `<div class="swatch" style="background:${s.hex}" title="${name}-${s.step} ${s.hex} — ${s.role}"></div>`)
    .join("")}</div>
</div>`;
}

function colorPage() {
  const steps = tokens.stepRoles
    .map((role, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(role)}</td></tr>`)
    .join("");

  const body = `<div class="prose">
<p>Every scale has twelve steps, and step <em>n</em> means the same thing in every scale and both themes. A component asks for step 4 and gets a hover background whether the scale is gray, blue or amber — which is what lets the accent axis repaint an interface without touching a single component rule.</p>
</div>
<h2 class="section" id="steps">Step roles</h2>
<table class="api-table api-table--prose"><thead><tr><th>Step</th><th>Role</th></tr></thead><tbody>${steps}</tbody></table>

<h2 class="section" id="light">Scales, light</h2>
<div class="step-legend">${tokens.stepRoles.map((_, i) => `<span>${i + 1}</span>`).join("")}</div>
${Object.keys(tokens.scales).map((n) => swatchRow(n, "light")).join("")}

<h2 class="section" id="dark">Scales, dark</h2>
<div class="step-legend">${tokens.stepRoles.map((_, i) => `<span>${i + 1}</span>`).join("")}</div>
${Object.keys(tokens.scales).map((n) => swatchRow(n, "dark")).join("")}

<h2 class="section" id="semantic">Semantic tokens</h2>
<p class="note">The only colour vocabulary a component may use. Each one points at a role and a step, never at a literal.</p>
<div class="token-list">${Object.entries(tokens.semantics)
    .map(
      ([name, meta]) =>
        `<div class="token-row"><span class="token-row__name">--area-${escapeHtml(name)}</span><span class="token-row__value">${escapeHtml(
          meta.step ? `${meta.role} ${meta.step}` : (meta.role ?? meta.kind),
        )}</span><span class="token-row__chip" style="background:var(--area-${escapeHtml(name)})"></span></div>`,
    )
    .join("")}</div>

<h2 class="section" id="contrast">Contrast</h2>
<div class="prose">
<p>Colour pairings are a build gate, not a review-time opinion. Every pairing a component can render is asserted under WCAG 2.2 and APCA across all 72 shipped theme combinations, and a failing colour cannot be published.</p>
<p>APCA is enforced as a hard gate in dark themes specifically, because the WCAG 2.x formula overstates contrast near black — a dark theme can clear 4.5:1 and still be unreadable.</p>
</div>`;

  return page({
    slug: "color",
    title: "Color",
    lede: "Twelve steps, generated in OKLCH, with a fixed role per step.",
    body,
    toc: [
      { id: "steps", title: "Step roles" },
      { id: "light", title: "Scales, light" },
      { id: "dark", title: "Scales, dark" },
      { id: "semantic", title: "Semantic tokens" },
      { id: "contrast", title: "Contrast" },
    ],
  });
}

function typographyPage() {
  const preset = tokens.axes.find((a) => a.id === "type").presets.find((p) => p.id === "geist");
  const groups = { text: [], heading: [], display: [] };

  for (const [name, value] of Object.entries(preset.tokens)) {
    const m = name.match(/^--area-(text|heading|display)-([\w]+)-size$/);
    if (!m) continue;
    const [, group, step] = m;
    groups[group].push({
      step,
      size: value,
      leading: preset.tokens[`--area-${group}-${step}-leading`],
      tracking: preset.tokens[`--area-${group}-${step}-tracking`],
    });
  }

  const rows = (group, weight) =>
    groups[group]
      .sort((a, b) => parseFloat(a.size) - parseFloat(b.size))
      .map(
        (r) =>
          `<div class="type-row"><div class="type-row__meta">${group}-${r.step}<br>${r.size} / ${r.leading} / ${r.tracking}</div><div class="type-row__sample" style="font-size:${r.size};line-height:${r.leading};letter-spacing:${r.tracking};font-weight:${weight}">The quick brown fox</div></div>`,
      )
      .join("");

  const body = `<div class="prose">
<p>Geist Sans and Geist Mono, self-hosted. Geist has a single weight axis and no optical-size axis, so tracking is built by hand — when a face carries optical sizing the font already adjusts its own spacing, and manual tracking double-corrects.</p>
<p>Negative tracking follows the convergent practice of systems built on faces without optical sizing. Line heights land on the 4px grid and the ratio falls as size rises: 1.43 at the 14px default, 1.5 at 16px body, 1.0 at display.</p>
</div>
<h2 class="section" id="text">Text</h2><p class="note">Weight 400. The 14px step is the default for all UI.</p>${rows("text", 400)}
<h2 class="section" id="heading">Heading</h2><p class="note">Weight 600.</p>${rows("heading", 600)}
<h2 class="section" id="display">Display</h2><p class="note">Weight 600. Marketing scale.</p>${rows("display", 600)}`;

  return page({
    slug: "typography",
    title: "Typography",
    lede: "One ramp for text, one for headings, one for display.",
    body,
    toc: [
      { id: "text", title: "Text" },
      { id: "heading", title: "Heading" },
      { id: "display", title: "Display" },
    ],
  });
}

function axisPresetTable(axisId) {
  const axis = tokens.axes.find((a) => a.id === axisId);
  return `<table class="api-table api-table--prose">
  <thead><tr><th>Preset</th><th>Attribute</th><th>Description</th></tr></thead>
  <tbody>${axis.presets
    .map(
      (p) =>
        `<tr><td>${escapeHtml(p.label)}${p.id === axis.defaultPreset ? " (default)" : ""}</td><td>${axis.attribute}="${p.id}"</td><td style="font-family:var(--area-font-sans)">${escapeHtml(p.description)}</td></tr>`,
    )
    .join("")}</tbody>
</table>`;
}

function simpleAxisPage(axisId, slug, title, lede, prose, extra = "") {
  const body = `<div class="prose">${prose}</div>
<h2 class="section" id="presets">Presets</h2>
${axisPresetTable(axisId)}
${extra}`;
  return page({ slug, title, lede, body, toc: [{ id: "presets", title: "Presets" }] });
}

function axesPage() {
  const body = `<div class="prose">
<p>Area is built around eight axes. Each one is a dimension you can retune, each ships a small set of presets, and choosing one is a single data attribute on the root element.</p>
<p>The rule that makes eight axes composable rather than a matrix of thousands of combinations is that no two axes write the same custom property. That is checked mechanically on every build — if two axes ever collide, the build stops.</p>
<p>Because custom properties inherit, a subtree can carry its own axis values. A sidebar marked <code>data-area-density="compact"</code> gets shorter controls <em>and</em> correctly re-derived corner radii, without any component knowing it happened.</p>
</div>
<h2 class="section" id="usage">Usage</h2>
<div class="example-block"><pre class="code-block"><code>${highlight(
    `<html data-area-theme="dark" data-area-accent="violet" data-area-density="compact">`,
  )}</code></pre></div>
${tokens.axes
  .map(
    (a) => `<h2 class="section" id="${a.id}">${escapeHtml(a.label)}</h2>
<p class="note">${escapeHtml(a.description)} Owns ${a.namespaces.length} namespace${a.namespaces.length === 1 ? "" : "s"}, ${a.presets.length} preset${a.presets.length === 1 ? "" : "s"}.</p>
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
  const body = `<div class="prose">
<p>Area is a design system whose defining feature is that it is tunable along eight independent axes: theme, neutral, accent, typography, density, radius, surface and motion. Components consume only semantic tokens, so changing an axis reflows the whole system without touching a single component.</p>
<p>Defaults are not taste. The 32px control, 6px control radius, 12px container radius and 14/20 text are the values that GitHub Primer, OpenAI, Vercel, Linear and Notion converge on, measured from their shipped code rather than inferred.</p>
</div>
<h2 class="section" id="install">Installation</h2>
<div class="example-block"><pre class="code-block"><code>${highlight("npm install @area/react @area/styles")}</code></pre></div>
<h2 class="section" id="start">Getting started</h2>
<div class="example-block"><pre class="code-block"><code>${highlight(
    `import { Button } from "@area/react";\nimport "@area/styles/area.css";\n\nexport default function App() {\n  return <Button>Get started</Button>;\n}`,
  )}</code></pre></div>
<h2 class="section" id="principles">Principles</h2>
<div class="prose">
<p><strong>Every number is derived.</strong> A control's corner radius is a proportion of its height; a menu item's radius is its panel's radius less the panel's padding. Those relationships are expressed once, in <code>calc()</code>, so they stay true under every combination of axes.</p>
<p><strong>Contrast is a build gate.</strong> Every colour pairing a component can render is asserted under WCAG 2.2 and APCA across all 72 shipped themes. A failing colour cannot be published.</p>
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
  [
    "density.html",
    simpleAxisPage(
      "density",
      "density",
      "Density",
      "Control heights and the room inside them.",
      "<p>The default tier is 32px — the most common default across every system measured. The ladder 24/28/32/40/48 is Primer's exact scale.</p><p>Presets shift which rung is medium; they do not rescale the spacing primitives. Compact means components pick smaller steps, not that 12px quietly becomes 10px.</p>",
    ),
  ],
  [
    "radius.html",
    simpleAxisPage(
      "radius",
      "radius",
      "Radius",
      "How rounded controls and containers are.",
      "<p>Controls take a unitless multiplier of their own height rather than a fixed pixel value. That is what keeps this axis independent of density — otherwise every radius preset would need a variant for every density preset.</p><p>The default resolves to 6px on a 32px control, which is what Primer, Vercel, Linear and Notion all ship. Containers sit at 12px, the single most agreed-upon number in the survey.</p>",
    ),
  ],
  [
    "surface.html",
    simpleAxisPage(
      "surface",
      "surface",
      "Surface",
      "Stroke weight and elevation.",
      "<p>Elevation uses negative spread so a shadow reads as lift rather than as a grey halo. Shadow colour is its own token, so a dark theme can deepen it — a shadow authored as flat black disappears on a dark surface.</p>",
    ),
  ],
  [
    "motion.html",
    simpleAxisPage(
      "motion",
      "motion",
      "Motion",
      "How long transitions take.",
      "<p>Every preset keeps the same token names, so no component ever branches on motion. The <code>none</code> preset sets durations to zero rather than removing transitions, which lets it double as the target for <code>prefers-reduced-motion</code>.</p>",
    ),
  ],
  ...COMPONENT_PAGES.map((spec) => [`${spec.slug}.html`, componentPage(spec)]),
];

for (const [name, html] of pages) writeFileSync(join(out, name), html, "utf8");

console.log(`\n  @area/docs\n`);
console.log(`  ${pages.length} pages, ${Object.keys(demos).length} demos`);
console.log(`  dist/ -> ${out}\n`);
