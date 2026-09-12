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
import { DOCS_CSS, DOCS_SCRIPT, codeBlock, escapeHtml, highlight, table, viewToggle } from "./layout.mjs";
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

/**
 * The axis panel.
 *
 * Every picker is a real segmented control from the system. The accent picker renders its
 * twelve options as swatches of each scale's own step 9, which is both the clearest way to
 * choose a hue and a working demonstration that the scales are addressable as tokens.
 */
function axisPanel() {
  const groups = tokens.axes
    .map((axis) => {
      const items = axis.presets
        .map((preset) => {
          const selected = preset.id === axis.defaultPreset;
          const body =
            axis.id === "accent"
              ? `<span class="area-segmented__icon" aria-hidden="true"><span class="docs-swatch" style="background:var(--area-${preset.id}-9)"></span></span>`
              : escapeHtml(preset.label);
          return `<button type="button" role="radio" class="area-segmented__item" data-value="${preset.id}" aria-checked="${selected}" aria-label="${escapeHtml(preset.label)}"${selected ? " data-selected" : ""}>${body}</button>`;
        })
        .join("");

      return `<div class="docs-axis">
      <span class="docs-axis__name" id="axis-label-${axis.id}">${escapeHtml(axis.label)}</span>
      <div class="area-segmented area-segmented--sm" role="radiogroup" aria-labelledby="axis-label-${axis.id}" data-axis="${axis.id}" data-default="${axis.defaultPreset}" style="flex-wrap:wrap">${items}</div>
    </div>`;
    })
    .join("");

  return `<div class="docs-axes" id="docs-axes" hidden>
    <div class="docs-axes__inner">${groups}</div>
  </div>`;
}

function topbarControls() {
  const theme = tokens.axes.find((a) => a.id === "theme");
  const themeItems = theme.presets
    .map(
      (p) =>
        `<button type="button" role="radio" class="area-segmented__item" data-value="${p.id}" aria-checked="${p.id === theme.defaultPreset}" ${p.id === theme.defaultPreset ? "data-selected" : ""}>${escapeHtml(p.label)}</button>`,
    )
    .join("");

  return `<div class="area-segmented area-segmented--xs" role="radiogroup" aria-label="Theme" data-axis="theme" data-default="${theme.defaultPreset}">${themeItems}</div>
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
  ${codeBlock(demo.code, { flush: true })}
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

  const cssNote = `<h2 class="docs-h2" id="css">Without React</h2>
<p class="docs-note">Every component is plain CSS. Use the classes directly when you are not using React.</p>
${codeBlock(demos[spec.examples[0].demo].html, { title: "index.html" })}`;

  const toc = [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    { id: "examples", title: "Examples" },
    ...spec.examples.map((e) => ({ id: e.id, title: e.title, nested: true })),
    { id: "api", title: "API reference" },
    { id: "css", title: "Without React" },
  ];

  return page({ slug: spec.slug, title: spec.name, lede, body: install + examples + api + cssNote, toc });
}

/* --- Foundation pages ------------------------------------------------------- */

function swatchRow(name) {
  const light = tokens.scales[name].light;
  const dark = tokens.scales[name].dark;
  return `<div class="docs-swatch-row">
  <div class="docs-swatch-row__name">${name}</div>
  <div class="docs-swatch-grid">${light.steps
    .map(
      (s, i) =>
        `<div style="background:var(--area-${name}-${s.step})" title="${name}-${s.step} — ${s.role} — light ${s.hex} / dark ${dark.steps[i].hex}"></div>`,
    )
    .join("")}</div>
</div>`;
}

function colorPage() {
  const steps = table(
    ["Step", "Role"],
    tokens.stepRoles.map((role, i) => [`<span class="docs-mono">${i + 1}</span>`, escapeHtml(role)]),
  );

  const body = `<div class="docs-prose">
<p>Every scale has twelve steps, and step <em>n</em> means the same thing in every scale and both themes. A component asks for step 4 and gets a hover background whether the scale is gray, blue or amber — which is what lets the accent axis repaint an interface without touching a single component rule.</p>
</div>
<h2 class="docs-h2" id="steps">Step roles</h2>
${steps}

<h2 class="docs-h2" id="scales">Scales</h2>
<p class="docs-note">Rendered from the tokens themselves, so these react to the theme and neutral axes. Switch the theme above to see the dark ramps.</p>
${viewToggle("scales", {
  grid: `<div class="docs-step-legend">${tokens.stepRoles.map((_, i) => `<span>${i + 1}</span>`).join("")}</div>
${Object.keys(tokens.scales).map((n) => swatchRow(n)).join("")}`,
  table: table(
    ["Scale", "Step", "Role", "Light", "Dark"],
    Object.keys(tokens.scales).flatMap((name) =>
      tokens.scales[name].light.steps.map((step, i) => [
        `<span class="docs-mono">${name}</span>`,
        `<span class="docs-mono">${step.step}</span>`,
        escapeHtml(step.role),
        `<span class="docs-mono">${step.hex}</span>`,
        `<span class="docs-mono">${tokens.scales[name].dark.steps[i].hex}</span>`,
      ]),
    ),
  ),
})}

<h2 class="docs-h2" id="semantic">Semantic tokens</h2>
<p class="docs-note">The only colour vocabulary a component may use. Each one points at a role and a step, never at a literal.</p>
${table(
  ["Token", "Resolves to", ""],
  Object.entries(tokens.semantics).map(([name, meta]) => [
    `<span class="docs-mono">--area-${escapeHtml(name)}</span>`,
    `<span class="docs-mono" style="color:var(--area-fg-muted)">${escapeHtml(meta.step ? `${meta.role} ${meta.step}` : (meta.role ?? meta.kind))}</span>`,
    `<span class="docs-token-chip" style="background:var(--area-${escapeHtml(name)})"></span>`,
  ]),
)}

<h2 class="docs-h2" id="contrast">Contrast</h2>
<div class="docs-prose">
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
      { id: "scales", title: "Scales" },
      { id: "semantic", title: "Semantic tokens" },
      { id: "contrast", title: "Contrast" },
    ],
  });
}

function typographyPage() {
  const preset = tokens.axes.find((a) => a.id === "type").presets.find((p) => p.id === "geist");
  const groups = { text: [], title: [], display: [] };

  for (const [name, value] of Object.entries(preset.tokens)) {
    const m = name.match(/^--area-(text|title|display)-([\w]+)-size$/);
    if (!m) continue;
    const [, group, step] = m;
    groups[group].push({
      group,
      step,
      size: value,
      leading: preset.tokens[`--area-${group}-${step}-leading`],
      tracking: preset.tokens[`--area-${group}-${step}-tracking`],
    });
  }

  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => parseFloat(a.size) - parseFloat(b.size));
  }

  const style = (r, weight) =>
    `font-size:var(--area-${r.group}-${r.step}-size);line-height:var(--area-${r.group}-${r.step}-leading);letter-spacing:var(--area-${r.group}-${r.step}-tracking);font-weight:var(--area-weight-${weight})`;

  const specimens = (group) =>
    groups[group]
      .map(
        (r) =>
          `<div class="docs-type-row">
      <div class="docs-type-row__meta">${group}-${r.step}<br>${r.size} / ${r.leading} / ${r.tracking}</div>
      <div class="docs-type-row__sample" style="${style(r, "regular")}">Regular</div>
      <div class="docs-type-row__sample" style="${style(r, "strong")}">Strong</div>
    </div>`,
      )
      .join("");

  const rows = (group) =>
    table(
      ["Token", "Size", "Leading", "Ratio", "Tracking"],
      groups[group].map((r) => [
        `<span class="docs-mono">--area-${r.group}-${r.step}</span>`,
        `<span class="docs-mono">${r.size}</span>`,
        `<span class="docs-mono">${r.leading}</span>`,
        `<span class="docs-mono">${(parseFloat(r.leading) / parseFloat(r.size)).toFixed(2)}</span>`,
        `<span class="docs-mono">${r.tracking}</span>`,
      ]),
    );

  const section = (id, name, note) =>
    `<h2 class="docs-h2" id="${id}">${name}</h2>
<p class="docs-note">${note}</p>
${viewToggle(`type-${id}`, { grid: specimens(id), table: rows(id) })}`;

  const body = `<div class="docs-prose">
<p><strong>Weight is orthogonal to role.</strong> A role sets size, leading and tracking — it does not set weight. That is what makes large text at a regular weight possible: a 20px paragraph rather than a 20px heading. A ramp with weight baked into the role cannot express that at all.</p>
<p><strong>Two weights, not three.</strong> Regular at 400 and strong at 550. Every style below exists in both, which is why each row shows both.</p>
<p>Geist has a single weight axis and no optical-size axis, so tracking is built by hand. When a face carries optical sizing the font already adjusts its own spacing and manual tracking double-corrects — which is why Apple's SF Pro tracking table reverses direction above 20pt and must not be copied onto a face like this one.</p>
</div>
${section("text", "Text", "Anything read as prose or rendered inside a control. Leading runs 1.33 to 1.5, rising with size. The 16px step is the size this ramp is meant to be read at; controls take 14px, which is the split Notion uses between content and chrome.")}
${section("title", "Title", "Headings, from a card's to a page's. The same sizes as the upper half of the text ramp, but with tighter leading and real negative tracking, because a title is one or two lines and a paragraph is not.")}
${section("display", "Display", "Hero type. Tracking stops at -0.03em: Inter's published dynamic-metrics curve asymptotes at -0.0223em, which makes anything past roughly -0.03em a stylistic choice rather than an optical correction.")}
<h2 class="docs-h2" id="weights">Weights</h2>
<p class="docs-note">Two, and only two. Material ships a parallel "emphasized" scale that is a uniform one-step increase on the variable weight axis; this is the same idea with one token instead of a second ramp.</p>
${table(
  ["Token", "Geist", "System", "Use"],
  [
    [
      `<span class="docs-mono">--area-weight-regular</span>`,
      `<span class="docs-mono">400</span>`,
      `<span class="docs-mono">400</span>`,
      "Body copy, and any text that is being read rather than scanned.",
    ],
    [
      `<span class="docs-mono">--area-weight-strong</span>`,
      `<span class="docs-mono">550</span>`,
      `<span class="docs-mono">600</span>`,
      "Titles, control labels, and emphasis within text. Not long-form copy.",
    ],
  ],
)}`;

  return page({
    slug: "typography",
    title: "Typography",
    lede: "Three roles, two weights, and every size available in both.",
    body,
    toc: [
      { id: "text", title: "Text" },
      { id: "title", title: "Title" },
      { id: "display", title: "Display" },
      { id: "weights", title: "Weights" },
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
  }));
}

function densityPage() {
  const rows = densityRows("default");
  const grid = specimenGrid(
    rows.map((r) =>
      specimen(
        `control-${r.tier}`,
        `<div class="docs-specimen__box" style="inline-size:100%;block-size:var(--area-control-${r.tier});border-radius:var(--area-radius-control)"></div>`,
        `${r.height} · pad ${r.gutter} · icon ${r.icon}`,
      ),
    ),
  );

  const body = `<div class="docs-prose">
<p>The default tier is 32px — the most common default across every system measured. The ladder 24/28/32/40/48 is Primer's exact scale.</p>
<p>Presets shift which rung is medium; they do not rescale the spacing primitives. Compact means components pick smaller steps, not that 12px quietly becomes 10px.</p>
</div>
<h2 class="docs-h2" id="tiers">Control tiers</h2>
${viewToggle("density-tiers", {
  grid,
  table: table(
    ["Tier", "Height", "Padding", "Icon", "Gap"],
    rows.map((r) => [
      `<span class="docs-mono">${r.tier}</span>`,
      `<span class="docs-mono">${r.height}</span>`,
      `<span class="docs-mono">${r.gutter}</span>`,
      `<span class="docs-mono">${r.icon}</span>`,
      `<span class="docs-mono">${r.gap}</span>`,
    ]),
  ),
})}
<h2 class="docs-h2" id="spacing">Spacing ramp</h2>
<p class="docs-note">Fixed primitives, named by their pixel value. The density axis moves which step a component reaches for; it never rescales the ramp.</p>
${viewToggle("density-space", {
  grid: specimenGrid(
    tokens.spaceRamp.filter((n) => n > 0).map((n) =>
      specimen(
        `space-${n}`,
        `<div class="docs-specimen__box" style="inline-size:var(--area-space-${n});block-size:var(--area-space-${n});border-radius:var(--area-radius-2)"></div>`,
        `${n}px`,
      ),
    ),
  ),
  table: table(
    ["Token", "Value"],
    tokens.spaceRamp.map((n) => [`<span class="docs-mono">--area-space-${n}</span>`, `<span class="docs-mono">${n}px</span>`]),
  ),
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
      { id: "spacing", title: "Spacing ramp" },
      { id: "presets", title: "Presets" },
    ],
  });
}

function radiusPage() {
  const axis = tokens.axes.find((a) => a.id === "radius");
  const grid = specimenGrid(
    axis.presets.map((p) =>
      specimen(
        p.id,
        `<div class="docs-specimen__box" data-area-radius="${p.id}" style="inline-size:var(--area-control-xl);block-size:var(--area-control-xl);border-radius:var(--area-radius-control)"></div>`,
        `${Math.round(32 * parseFloat(p.tokens["--area-radius-scale"]))}px control · ${p.tokens["--area-radius-container"]} container`,
      ),
    ),
  );

  const body = `<div class="docs-prose">
<p>Controls take a unitless multiplier of their own height rather than a fixed pixel value. That is what keeps this axis independent of density — otherwise every radius preset would need a variant for every density preset.</p>
<p>The default resolves to 6px on a 32px control, which is what Primer, Vercel, Linear and Notion all ship. Containers sit at 12px, the single most agreed-upon number in the survey.</p>
</div>
<h2 class="docs-h2" id="presets">Presets</h2>
${viewToggle("radius-presets", {
  grid,
  table: table(
    ["Preset", "Scale", "Control at 32px", "Container", "Small"],
    axis.presets.map((p) => [
      escapeHtml(p.label) + (p.id === axis.defaultPreset ? " (default)" : ""),
      `<span class="docs-mono">${p.tokens["--area-radius-scale"]}</span>`,
      `<span class="docs-mono">${Math.round(32 * parseFloat(p.tokens["--area-radius-scale"]))}px</span>`,
      `<span class="docs-mono">${p.tokens["--area-radius-container"]}</span>`,
      `<span class="docs-mono">${p.tokens["--area-radius-small"]}</span>`,
    ]),
  ),
})}`;

  return page({
    slug: "radius",
    title: "Radius",
    lede: "How rounded controls and containers are.",
    body,
    toc: [{ id: "presets", title: "Presets" }],
  });
}

function surfacePage() {
  const axis = tokens.axes.find((a) => a.id === "surface");
  const grid = specimenGrid(
    [1, 2, 3, 4].map((level) =>
      specimen(
        `shadow-${level}`,
        `<div style="inline-size:var(--area-control-xl);block-size:var(--area-control-xl);border-radius:var(--area-radius-container);background:var(--area-bg-surface);box-shadow:var(--area-shadow-${level})"></div>`,
        level === 1 ? "resting" : level === 2 ? "raised" : level === 3 ? "floating" : "modal",
      ),
    ),
  );

  const body = `<div class="docs-prose">
<p>Elevation uses negative spread so a shadow reads as lift rather than as a grey halo. Shadow colour is its own token, so a dark theme can deepen it — a shadow authored as flat black disappears on a dark surface.</p>
</div>
<h2 class="docs-h2" id="elevation">Elevation</h2>
${viewToggle("surface-elevation", {
  grid,
  table: table(
    ["Token", "Value"],
    [1, 2, 3, 4].map((level) => [
      `<span class="docs-mono">--area-shadow-${level}</span>`,
      `<span class="docs-mono">${escapeHtml(axis.presets.find((p) => p.id === axis.defaultPreset).tokens[`--area-shadow-${level}`])}</span>`,
    ]),
  ),
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
      { id: "presets", title: "Presets" },
    ],
  });
}

function motionPage() {
  const axis = tokens.axes.find((a) => a.id === "motion");
  const preset = axis.presets.find((p) => p.id === axis.defaultPreset);
  const durations = Object.keys(preset.tokens).filter((k) => k.includes("-duration-"));
  const easings = Object.keys(preset.tokens).filter((k) => k.includes("-ease-"));

  const body = `<div class="docs-prose">
<p>Every preset keeps the same token names, so no component ever branches on motion. The <code class='area-code'>none</code> preset sets durations to zero rather than removing transitions, which lets it double as the target for <code class='area-code'>prefers-reduced-motion</code>.</p>
</div>
<h2 class="docs-h2" id="durations">Durations</h2>
${viewToggle("motion-durations", {
  grid: specimenGrid(
    durations.map((token) =>
      specimen(
        token.replace("--area-", ""),
        `<div class="docs-specimen__box" style="inline-size:100%;block-size:var(--area-space-8);border-radius:var(--area-radius-full)"></div>`,
        preset.tokens[token],
      ),
    ),
  ),
  table: table(
    ["Token", ...axis.presets.map((p) => p.label)],
    durations.map((token) => [
      `<span class="docs-mono">${token}</span>`,
      ...axis.presets.map((p) => `<span class="docs-mono">${p.tokens[token]}</span>`),
    ]),
  ),
})}
<h2 class="docs-h2" id="easings">Easings</h2>
${table(
  ["Token", "Value"],
  easings.map((token) => [
    `<span class="docs-mono">${token}</span>`,
    `<span class="docs-mono">${escapeHtml(preset.tokens[token])}</span>`,
  ]),
)}
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
${codeBlock(`<html data-area-theme="dark" data-area-accent="violet" data-area-density="compact">`, { title: "index.html" })}
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
<h2 class="docs-h2" id="principles">Principles</h2>
<div class="docs-prose">
<p><strong>Every number is derived.</strong> A control's corner radius is a proportion of its height; a menu item's radius is its panel's radius less the panel's padding. Those relationships are expressed once, in <code class='area-code'>calc()</code>, so they stay true under every combination of axes.</p>
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
