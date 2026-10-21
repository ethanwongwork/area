// Groups sweep.mjs output by role and summarises each state, so families can be compared.
//   node analyze.mjs light.json [dark.json]  → prints a markdown report; writes summary.json beside the input
import { readFileSync, writeFileSync } from "node:fs";
const files = process.argv.slice(2);
const ROLE = [
  ["row", /area-(menu__item|nav__row|nav__item|tree-view__row|list-box__option|command-palette__item|combobox__option|select|custom-select__option|table__row|pagination|stepper|toc|table-of-contents)|\[role=(option|menuitem|menuitemcheckbox|menuitemradio|treeitem|row)\]/],
  ["button-solid", /area-button--solid/], ["button-soft", /area-button--soft/], ["button-outline", /area-button--outline/], ["button-ghost", /area-button--ghost|area-button--plain/],
  ["segmented/tab", /area-segmented|area-tabs|\[role=tab\]|area-toggle-group/],
  ["chip/tag/badge", /area-chip|area-tag|area-badge/],
  ["toggle", /area-checkbox|area-radio|area-switch|\[role=(checkbox|radio|switch)\]/],
  ["card", /area-card|area-asset-card|area-file-tile|area-board-card|area-folder|area-file-page|area-file-image|area-attachment/],
  ["link", /^a\.|area-link|area-citation|area-breadcrumb/],
  ["calendar", /area-calendar/], ["swatch", /area-color/],
];
const roleOf = el => (ROLE.find(([, re]) => re.test(el)) ?? ["other"])[0];
const dL = (a, b) => +(b.plateL - a.plateL).toFixed(4);
const report = [];
for (const file of files) {
  const r = JSON.parse(readFileSync(file, "utf8"));
  const byRole = {}, motion = {}, selected = [];
  for (const [slug, fam] of Object.entries(r.families)) {
    for (const i of fam.interactive ?? []) {
      const role = roleOf(i.el);
      const h = { slug, el: i.el, tile: i.tile, rest: i.rest.plate, hover: i.hover.plate, pressed: i.pressed.plate,
        dHover: dL(i.rest, i.hover), dPress: dL(i.rest, i.pressed), hoverVsGround: i.hover.stepVsGround, pressVsHover: dL(i.hover, i.pressed),
        inkChange: i.rest.ink !== i.hover.ink, edgeChange: i.rest.edge !== i.hover.edge, ringChange: i.rest.ring !== i.hover.ring,
        transform: i.pressed.transform, by: i.hover.by };
      (byRole[role] ??= []).push(h);
      const m = i.motion ?? {}; const pick = x => x?.self ?? x?.before;
      const enter = pick(m.enter), leave = pick(m.leave);
      const k = `${enter ? enter.dur.split(",")[0].trim() : "0s"} in / ${leave ? leave.dur.split(",")[0].trim() : "0s"} out · ${(leave?.ease ?? enter?.ease ?? "").split("),")[0].replace("cubic-bezier", "cb")}${leave || enter ? ")" : ""}`;
      (motion[k] ??= new Set()).add(slug + ":" + role);
    }
    for (const s of fam.selected ?? []) selected.push({ slug, el: s.el, tile: s.tile, role: roleOf(s.el), sel: s.selected.plate, selL: s.selected.plateL, unsel: s.unselected?.plate, unselL: s.unselected?.plateL,
      d: s.unselected ? +(s.selected.plateL - s.unselected.plateL).toFixed(4) : null, edge: s.selected.edge, unselEdge: s.unselected?.edge, ring: s.selected.ring.slice(0, 90), ink: s.selected.ink, unselInk: s.unselected?.ink, hover: s.selectedHover.plate, by: s.selected.by });
  }
  report.push(`\n# ${r.theme}\n`);
  for (const [role, list] of Object.entries(byRole)) {
    const fams = [...new Set(list.map(x => x.slug))];
    const hovers = {}; for (const x of list) { const k = `${x.dHover} / ${x.dPress}`; (hovers[k] ??= new Set()).add(x.slug); }
    report.push(`## ${role} (${list.length} elements, ${fams.length} families)\nΔL hover / pressed from rest → families:`);
    for (const [k, v] of Object.entries(hovers).sort((a, b) => b[1].size - a[1].size)) report.push(`- ${k}: ${[...v].join(", ")}`);
    const odd = list.filter(x => x.inkChange); if (odd.length) report.push(`ink changes on hover: ${[...new Set(odd.map(x => x.slug + " " + x.el))].slice(0, 12).join("; ")}`);
    const tr = list.filter(x => x.transform); if (tr.length) report.push(`transform on press: ${[...new Set(tr.map(x => x.slug + " " + x.transform))].slice(0, 8).join("; ")}`);
  }
  report.push(`\n## motion (enter / leave · leave curve)`);
  for (const [k, v] of Object.entries(motion).sort((a, b) => b[1].size - a[1].size)) report.push(`- ${k}: ${v.size} — ${[...v].slice(0, 14).join(", ")}${v.size > 14 ? " …" : ""}`);
  report.push(`\n## selected`);
  for (const s of selected) report.push(`- ${s.slug} · ${s.tile} · ${s.el} · sel ${s.sel} (${s.by}) vs ${s.unsel ?? "—"} ΔL ${s.d ?? "—"} · edge ${s.edge || "—"} (was ${s.unselEdge || "—"}) · ring ${s.ring || "—"} · ink ${s.ink}${s.unselInk && s.unselInk !== s.ink ? " (was " + s.unselInk + ")" : ""} · sel+hover ${s.hover}`);
  writeFileSync(file.replace(/\.json$/, ".summary.json"), JSON.stringify({ byRole, motion: Object.fromEntries(Object.entries(motion).map(([k, v]) => [k, [...v]])), selected }, null, 1));
}
console.log(report.join("\n"));
