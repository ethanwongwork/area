// Reopen icons on the review page: icons whose drawing changed after the owner's last verdict, and old fix / replace
// verdicts that were redrawn without a new one, and icons never put in a review pool (verdict null, `batch` its
// batches.json title) (README, "batches.json synced with the review page"). Takes the
// published data.js and adds `reopened` rows: `staleAt` is the verdict being reopened, `before` the drawing committed
// at that verdict, `change` the commits since. From the repository root:
//   node docs/research/icon-review/2026-10-10/reopen.mjs <published data.js> <reopen.json> <before.tsx> <out data.js>
// reopen.json: { name: { round, verdict, at, notes, commits: ["YYYY-MM-DD subject"] } }; before.tsx: those icons
// emitted by gen-pilot-icons.mjs --only … --emit from a copy of the sources with each one at its verdict's commit.
import { build } from "esbuild"; import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from "node:fs";
const [dataPath, reopenPath, beforePath, out] = process.argv.slice(2);
const cache = process.cwd() + "/apps/docs/.cache"; mkdirSync(cache, { recursive: true }); copyFileSync(beforePath, cache + "/before-reopen.tsx");
writeFileSync(cache + "/reopen.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import * as B from "./before-reopen.tsx";
const r = (C, p) => renderToStaticMarkup(h(C, { weight: 1.125, ...p })).replace(/ aria-hidden="true"| focusable="false"/g, "");
const pascal = n => n.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("");
export const before = name => { const O = B["Pilot" + pascal(name) + "Icon"], F = B["Pilot" + pascal(name) + "FilledIcon"]; if (!O) return null;
  return { o: r(O, { width: 16, height: 16 }), f: F ? r(F, { width: 16, height: 16 }) : "", os: [16, 24, 32].map(s => r(O, { size: s })), fs: F ? [16, 24, 32].map(s => r(F, { size: s })) : [] }; };`);
await build({ entryPoints: [cache + "/reopen.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/reopen.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { before } = await import(cache + "/reopen.out.mjs?" + Date.now());
const w = {}; new Function("window", readFileSync(dataPath, "utf8"))(w);
const reopen = JSON.parse(readFileSync(reopenPath, "utf8")); let n = 0; const unchanged = [];
for (const row of w.ICONS) { const r = reopen[row.name]; if (!r) continue; n++;
  if (!r.verdict) { row.changed = true; row.reopened = true; row.staleAt = ""; row.change = `Drawn in ${r.batch}; it was never in a review round.`; delete row.before; continue; }
  const what = r.verdict === "approve" ? "Changed after you approved it" : `Redrawn after your ${r.verdict} note`;
  const since = r.commits.length ? " in " + [...r.commits].reverse().map(c => c.replace(/^(\S+) Icons?: /, "$1, ")).join("; ") : "";
  row.changed = true; row.reopened = true; row.staleAt = r.at;
  row.change = `${what} (${r.at.slice(0, 10)})${since}.` + (r.notes ? ` Your note: “${r.notes}”` : "");
  const b = before(row.name); if (b) row.before = b; else delete row.before;
  // Drawn the same as at the verdict (the change was in source only): an approval stands, so it is not reopened
  // (the caller marks it approved); a note is shown without a Before.
  const k = s => s.replace(/id="[^"]*"|url\(#[^)]*\)|mask="[^"]*"/g, "");
  if (b && [["o"], ["f"]].every(([x]) => k(b[x]) === k(row[x])) && row.os.every((x, i) => k(x) === k(b.os[i])) && row.fs.every((x, i) => k(x) === k(b.fs[i] ?? ""))) {
    if (r.verdict === "approve") { delete row.changed; delete row.reopened; delete row.staleAt; delete row.change; delete row.before; n--; unchanged.push(row.name); continue; }
    delete row.before; row.change = `No visible change since your ${r.verdict} note (${r.at.slice(0, 10)}).` + (r.notes ? ` Your note: “${r.notes}”` : ""); } }
writeFileSync(out, "window.REDRAWN_AT = " + JSON.stringify(new Date().toISOString()) + ";\nwindow.ICONS = " + JSON.stringify(w.ICONS) + ";\nwindow.CANDIDATES = " + JSON.stringify(w.CANDIDATES) + ";\n");
console.log(out, n, "reopened of", Object.keys(reopen).length, "· approval stands (drawn the same):", unchanged.join(" "));
