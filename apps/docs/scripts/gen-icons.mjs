import { readFileSync, writeFileSync } from "node:fs";
const DIR = "/Users/ethanwong/Desktop/area/node_modules/@fluentui/svg-icons/icons";
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
};
// Inline SVG for the documentation's own chrome: toolbars, and the sidebar's section
// icons. Keyed by the page slug where it names one, so a new foundation page gets an icon
// by adding one line here rather than by editing markup.
const TOOLBAR = {
  copy: "copy_16_regular",
  reset: "arrow_counterclockwise_16_regular",
  expand: "arrow_expand_16_regular",
  close: "dismiss_16_regular",
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
`;
writeFileSync("/Users/ethanwong/Desktop/area/apps/docs/src/icons.tsx", tsx);

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
writeFileSync("/Users/ethanwong/Desktop/area/apps/docs/scripts/icons.generated.mjs", js);
console.log("generated", Object.keys(MAP).length, "component icons and", Object.keys(TOOLBAR).length, "toolbar icons");
