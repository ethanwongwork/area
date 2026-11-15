// The dark floating edge (plan A7.1, finding VN1): the grey levels across the left edge of every floating surface in
// dark, at its vertical middle, at device scale 2 (two image px per CSS px). capture.mjs samples 6 CSS px either side
// of the edge where the edge is drawn in view (the surface just inside it, the tile's ground outside).
//
// The rule, an assertion since A7.1 landed (2026-11-11): a floating surface draws one edge per side, one luminance step
// between the ground outside and its own fill. The edge zone is the first 2 CSS px (4 device px) past the ground: before
// A7.1 a 1px rim outside a 1px frame drew two steps there ("1, 1, 42, 42, 31, 31, 2"). A step is a run of levels within
// 2 of each other that is neither the ground nor the fill just past the zone, so a row's plate or a field further in
// (the sample line can cross one) is not counted.

// The bars are sampled only in their floating forms: an inline Selection bar or a plain Toolbar draws no surface, so the
// line would cross its first control (2026-11-14: an inline Selection bar's white Button read as two steps).
export const FLOATING = [
  ".area-menu", ".area-composer-menu", ".area-popover", ".area-dialog", ".area-drawer", ".area-calendar", ".area-color-picker",
  ".area-command-palette", ".area-toast", ".area-hover-card", ".area-tooltip", ".area-selection-bar--floating", ".area-toolbar--surface",
  ".area-titlebar--floating",
].map(selector => ({ selector }));

const near = (a, b) => Math.abs(a - b) <= 2;

/** "outside | level×width … | inside" and the number of steps. */
export function readEdge(row) {
  const outside = row[0], inside = row[row.length - 1];
  let start = 0, end = row.length;
  while (start < end && near(row[start], outside)) start++;
  while (end > start && near(row[end - 1], inside)) end--;
  const runs = [];
  for (let i = start; i < end; i++) {
    const last = runs[runs.length - 1];
    if (last && near(row[i], last.level)) last.width++;
    else runs.push({ level: row[i], width: 1 });
  }
  return { steps: runs.length, text: `${outside} | ${runs.map(r => `${r.level}×${r.width}`).join(" ") || "–"} | ${inside}` };
}

/** The steps in the edge zone: runs of the first 4 device px past the ground that are neither it nor the fill after. */
export function edgeSteps(row) {
  const outside = row[0];
  let start = 0;
  while (start < row.length && near(row[start], outside)) start++;
  const zone = row.slice(start, start + 4), fill = row[start + 4] ?? row[row.length - 1];
  const runs = [];
  for (const level of zone) {
    if (near(level, fill)) continue;
    const last = runs[runs.length - 1];
    if (last && near(level, last.level)) last.width++;
    else runs.push({ level, width: 1 });
  }
  return runs;
}

export const rules = [
  {
    id: "dark-floating-edge", item: "A7.1", finding: "VN1", kind: "assert", expectedToday: "pass",
    title: "Each floating surface draws one luminance step across its edge in dark",
    run(families) {
      const violations = [];
      let checked = 0;
      for (const family of families) {
        for (const edge of family.dark?.edges ?? []) {
          checked++;
          const runs = edgeSteps(edge.row);
          if (runs.length > 1) violations.push({ family: family.slug, theme: "dark", part: edge.cls, detail: `${runs.length} steps: ${readEdge(edge.row).text}` });
        }
      }
      return { violations, checked, summary: `${checked} edges sampled` };
    },
  },
];
