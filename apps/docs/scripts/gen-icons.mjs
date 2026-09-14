import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(dirname(require.resolve("@fluentui/svg-icons/package.json")), "icons");
const ASSETS = join(ROOT, "assets");

/*
 * Stadium's own marks, vendored.
 *
 * Twenty-nine glyphs Fluent does not draw, or draws differently: the inspector-panel
 * vocabulary -- gap, padding, flow, corner radius, opacity, aspect ratio, the corner marks.
 * Stadium authored them on the 16 grid to sit beside the Fluent set, and twenty-eight of
 * them are *stroked* rather than filled, which is the one place Area's "Fluent icons are
 * filled paths, never strokes" rule has to be read as what it actually protects: an icon
 * that has not been fitted to the set's optical weight will not match it. These were
 * fitted, by measurement -- a 1-unit rule, round terminals, and an ink box of 12 units for
 * a rectilinear mark or 14 for a round one, which is where Fluent's own square and round
 * marks land. Their inner markup is taken verbatim, stroke attributes and all, because
 * reducing them to a path list is exactly what would break that fit.
 */
const stadium = (dir) =>
  Object.fromEntries(
    readdirSync(`${ASSETS}/${dir}`)
      .filter((f) => f.endsWith(".svg"))
      .map((f) => {
        const svg = readFileSync(`${ASSETS}/${dir}/${f}`, "utf8");
        const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>[\s\S]*$/, "").trim();
        return [f.replace(/\.svg$/, ""), inner.replace(/\n\s*/g, "")];
      }),
  );

const STADIUM = stadium("stadium-icons");
const STADIUM_FILLED = stadium("stadium-icons-filled");
// name -> Fluent icon id. 16px Regular throughout: that is Fluent's own inline size.
const MAP = {
  PlusIcon: "add_16_regular",
  SearchIcon: "search_16_regular",
  CheckIcon: "checkmark_16_regular",
  InfoIcon: "info_16_regular",
  AlertIcon: "warning_16_regular",
  ArrowIcon: "arrow_right_16_regular",
  ChevronIcon: "chevron_down_16_regular",
  DismissIcon: "dismiss_16_regular",
  AlignTopIcon: "align_top_16_regular",
  AlignMiddleIcon: "align_center_vertical_16_regular",
  AlignBottomIcon: "align_bottom_16_regular",
};
// Inline SVG for the documentation's own chrome: toolbars, and the sidebar's section
// icons. Keyed by the page slug where it names one, so a new foundation page gets an icon
// by adding one line here rather than by editing markup.
const TOOLBAR = {
  copy: "copy_16_regular",
  reset: "arrow_counterclockwise_16_regular",
  expand: "arrow_expand_16_regular",
  close: "dismiss_16_regular",
  panelLeft: "panel_left_16_regular",
  panelRight: "panel_right_16_regular",
  // Getting started
  // Keyed by page slug; the Introduction page ships as index.html.
  index: "book_open_16_regular",
  axes: "options_16_regular",
  // Foundations
  color: "color_16_regular",
  typography: "text_font_16_regular",
  iconography: "shapes_16_regular",
  density: "line_horizontal_4_16_regular",
  radius: "square_hint_16_regular",
  surface: "layer_diagonal_16_regular",
  motion: "flash_16_regular",
};
/** kebab -> Pascal, so `flow-wrap` exports as `FlowWrapIcon`. */
const pascal = (name) => name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());

/*
 * SVG attributes are hyphenated; JSX wants them camelCased. Only the attributes this set
 * actually uses are converted -- an unknown one would be passed through and silently
 * dropped by React, so the list is deliberately closed rather than a general rule.
 */
const JSX_ATTRS = {
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-miterlimit": "strokeMiterlimit",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
};

const jsx = (markup) => {
  let out = markup;
  for (const [from, to] of Object.entries(JSX_ATTRS)) out = out.replaceAll(`${from}=`, `${to}=`);
  const unknown = out.match(/\s([a-z]+-[a-z-]+)=/);
  if (unknown) throw new Error(`unconverted SVG attribute "${unknown[1]}" -- add it to JSX_ATTRS`);
  return out.replace(/>(?=<)/g, ">\n    ");
};

const path = (id) => {
  const svg = readFileSync(`${DIR}/${id}.svg`, "utf8");
  const ds = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  if (!ds.length) throw new Error(`no path in ${id}`);
  return ds;
};
const tsx = `/**
 * Fluent System Icons, 16px Regular.
 *
 * Microsoft's set, taken verbatim from \`@fluentui/svg-icons\` -- the path data below is
 * generated from that package, never drawn by hand. Fluent's 16px grid is the same inline
 * size Area's density axis uses, so an icon here needs no rescaling to sit on a control.
 *
 * Two things follow from using the real set rather than approximating it. Fluent icons are
 * *filled* paths, not strokes, so they take \`fill\` and never \`stroke\` or \`stroke-width\`;
 * and they are optically corrected per size, which is why the 16px cut is used at 16px
 * instead of scaling the 20 or 24.
 *
 * Regenerate with \`node scripts/gen-icons.mjs\` after changing the map there.
 */
const base = {
  viewBox: "0 0 16 16",
  // Fluent's own intrinsic size. A slot that owns an icon token overrides it in CSS;
  // this is only the fallback for an icon rendered outside one.
  width: 16,
  height: 16,
  fill: "currentColor",
  focusable: false as const,
  "aria-hidden": true,
};

${Object.entries(MAP)
  .map(
    ([name, id]) =>
      `/** Fluent \`${id}\`. */\nexport const ${name} = () => (\n  <svg {...base}>\n${path(id)
        .map((d) => `    <path d="${d}" />`)
        .join("\n")}\n  </svg>\n);`,
  )
  .join("\n\n")}

/*
 * Stadium's marks. They are stroked rather than filled, so they take their own base: the
 * fill is off and the colour rides on the stroke. Fitted to Fluent's optical weight by
 * measurement -- see the note in gen-icons.mjs.
 */
const stadiumBase = { ...base, fill: "none" };

${Object.entries(STADIUM)
  .map(
    ([name, inner]) =>
      `/** Stadium \`${name}\`. */\nexport const ${pascal(name)}Icon = () => (\n  <svg {...stadiumBase}>\n    ${jsx(inner)}\n  </svg>\n);`,
  )
  .join("\n\n")}
`;
writeFileSync(join(ROOT, "src/icons.tsx"), tsx);

const js = `/**
 * Toolbar icons: Fluent System Icons, 16px Regular, generated from \`@fluentui/svg-icons\`.
 * Filled paths, sized from CSS and never from font-size.
 */
export const ICONS = {
${Object.entries(TOOLBAR)
  .map(
    ([k, id]) =>
      `  // Fluent \`${id}\`\n  ${k}: \`<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">${path(id)
        .map((d) => `<path d="${d}"/>`)
        .join("")}</svg>\`,`,
  )
  .join("\n")}
};`;
writeFileSync(join(ROOT, "scripts/icons.generated.mjs"), js);

/* --- The catalogue and its sprites ---------------------------------------- */

/*
 * The browser documents the whole set, not a curated corner of it, which is 1,710 Fluent
 * glyphs on the 16 grid plus Stadium's 29 -- 711 KB of path data in one style alone. Inlined
 * per page that is unservable, so the marks ship as two SVG sprites and the page carries
 * `<use>` references: one element per cell, and the sprite cached once for the whole site.
 *
 * Two files rather than one because style is a filter. A reader looking at regular never
 * pays for filled, and the browser swaps the href prefix rather than loading both up front.
 */
const fluentIds = (style) =>
  readdirSync(DIR)
    .filter((f) => f.endsWith(`_16_${style}.svg`))
    .map((f) => f.replace(`_16_${style}.svg`, ""))
    .sort();

const REGULAR = fluentIds("regular");
const FILLED = new Set(fluentIds("filled"));

/** Fluent's ids are snake_case; the catalogue is kebab, which is what a reader searches. */
const kebab = (id) => id.replace(/_/g, "-");

function sprite(style) {
  const symbols = [];
  for (const [name, inner] of Object.entries(style === "filled" ? STADIUM_FILLED : STADIUM)) {
    symbols.push(`<symbol id="st-${name}" viewBox="0 0 16 16" fill="none">${inner}</symbol>`);
  }
  for (const id of REGULAR) {
    // A Fluent glyph with no filled cut falls back to its regular one, so every cell in the
    // grid draws something rather than leaving a hole where a style does not exist.
    const use = style === "filled" && FILLED.has(id) ? "filled" : "regular";
    const svg = readFileSync(`${DIR}/${id}_16_${use}.svg`, "utf8");
    const ds = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
    if (!ds.length) continue;
    symbols.push(
      `<symbol id="fl-${kebab(id)}" viewBox="0 0 16 16">${ds.map((d) => `<path d="${d}"/>`).join("")}</symbol>`,
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join("")}</svg>`;
}

writeFileSync(`${ASSETS}/icons.svg`, sprite("regular"));
writeFileSync(`${ASSETS}/icons-filled.svg`, sprite("filled"));

/*
 * The catalogue carries names, not geometry -- the sprite has the geometry. Each entry also
 * carries its search terms, split here rather than in the browser so the page does no work
 * a build can do once.
 */
const catalog = [
  ...Object.keys(STADIUM).sort().map((name) => ({ id: `st-${name}`, name, source: "stadium" })),
  ...REGULAR.map((id) => ({ id: `fl-${kebab(id)}`, name: kebab(id), source: "fluent", filled: FILLED.has(id) })),
].map((entry) => ({ ...entry, terms: entry.name.split("-").join(" ") }));

writeFileSync(
  join(ROOT, "scripts/icons.catalog.mjs"),
  `/**
 * The icon catalogue: every mark the browser lists, by name and sprite id.
 *
 * Generated by \`scripts/gen-icons.mjs\`. Geometry lives in \`assets/icons.svg\` and
 * \`assets/icons-filled.svg\`; this file is only what a reader searches and filters on.
 */
export const CATALOG = ${JSON.stringify(catalog)};
`,
);

console.log(
  "generated",
  Object.keys(MAP).length,
  "component icons,",
  Object.keys(TOOLBAR).length,
  "toolbar icons,",
  catalog.length,
  `catalogued (${Object.keys(STADIUM).length} Stadium + ${REGULAR.length} Fluent)`,
);
