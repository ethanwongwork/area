// Reads audit.mjs output and lists the departures from MOTION.md's recipes, grouped by family.
import { readFileSync } from "node:fs";
const [file, mode = "summary"] = process.argv.slice(2);
const report = JSON.parse(readFileSync(file, "utf8"));
const TIMED = ["background-color", "border-top-color", "border-bottom-color", "box-shadow", "color", "opacity", "scale", "transform", "translate", "fill", "stroke", "text-decoration-color"];
const near = (a, b) => Math.abs(a - b) <= 3;
const findings = {};
const add = (slug, kind, it, detail) => {
  const key = `${kind}|${it.cls || it.tag + (it.role ? "[" + it.role + "]" : "")}|${detail}`;
  ((findings[slug] ||= {})[key] ||= { kind, who: it.cls || it.tag + (it.role ? "[" + it.role + "]" : ""), detail, tiles: new Set() }).tiles.add(it.tile);
};
for (const [slug, { clocks, results, error }] of Object.entries(report)) {
  if (error) { (findings[slug] ||= {})["error"] = { kind: "error", who: "", detail: error, tiles: new Set() }; continue; }
  for (const it of results) {
    const { rest, hover, active, focus } = it.states;
    const diff = (a, b) => { const out = []; for (const k of Object.keys(a)) { if (!b[k]) continue; for (const p of Object.keys(a[k].v)) if (a[k].v[p] !== b[k].v[p]) out.push([k, p]); } return out; };
    const hov = diff(rest, hover), act = diff(hover, active), foc = diff(rest, focus);
    const textInput = it.tag === "input" && !["checkbox", "radio", "range", "button", "submit"].includes(it.type) || it.tag === "textarea";
    if (!hov.length && !textInput && it.tag !== "input" && it.tag !== "select") add(slug, "no-hover", it, "");
    const selfInk = hov.some(([k, p]) => k === "self" && p === "color");
    const inkOf = k => hov.some(([kk, pp]) => pp === "color" && (kk === "self" || kk.startsWith("p")) && k !== kk);
    for (const [k, p] of hov) {
      if (!TIMED.includes(p)) continue;
      if (p === "text-decoration-color" && rest[k].v["text-decoration-line"] === "none") continue;
      // Inherited ink follows its owner's transition (a child's color, fill or stroke from currentColor).
      if (["color", "fill", "stroke", "text-decoration-color", "border-top-color", "border-bottom-color"].includes(p) && k !== "self" && !k.startsWith("p") && hov.some(([kk, pp]) => pp === "color" && kk !== k && (kk === "self" || kk.startsWith("p") || k.startsWith(kk.split(":")[0]))) && rest[k].v[p] === rest[k].v["color"]) continue;
      if (["border-top-color", "border-bottom-color", "text-decoration-color"].includes(p) && rest[k].v[p] === rest[k].v["color"] && hov.some(([kk, pp]) => kk === k && pp === "color")) continue;
      const leave = rest[k].t[p], enter = hover[k].t[p];
      if (!leave || leave.d === 0) add(slug, "snap-out", it, `${k} ${p}`);
      else if (!near(leave.d, clocks.fast) && !near(leave.d, clocks.base)) add(slug, "leave-clock", it, `${k} ${p} ${leave.d}ms`);
      if (enter && !near(enter.d, clocks.hoverIn) && enter.d !== 0) add(slug, "enter-clock", it, `${k} ${p} ${enter.d}ms`);
      if (enter && enter.d === 0 && leave && leave.d > 0) add(slug, "enter-instant", it, `${k} ${p}`);
      if (p === "color" && k === "self") add(slug, "fg-hover", it, `${rest[k].v[p]} → ${hover[k].v[p]}`);
    }
    for (const [k, p] of act) {
      if (!TIMED.includes(p)) continue;
      const enter = active[k].t[p];
      if (enter && !near(enter.d, clocks.pressIn) && enter.d !== 0 && p !== "scale") add(slug, "press-clock", it, `${k} ${p} ${enter.d}ms`);
    }
    const clicky = it.tag === "button" || it.role === "button" || it.tag === "summary";
    if (clicky && hov.length && !act.length) add(slug, "no-press", it, "");
    for (const [k, p] of foc) {
      if (!["outline-color", "outline-width", "box-shadow", "outline-style"].includes(p)) continue;
      const t = focus[k].t[p];
      if (t && t.d > 0) add(slug, "focus-fades", it, `${k} ${p} ${t.d}ms`);
    }
    if (!foc.length && !textInput) add(slug, "no-focus-ring", it, "");
    for (const k of Object.keys(rest)) { const t = rest[k].t["opacity"]; if (t && t.via === "all" && t.d > 0) add(slug, "transition-all", it, k + " " + t.d + "ms"); }
    if (clicky && rest.self.cursor !== "pointer" && it.tag !== "summary") add(slug, "cursor", it, rest.self.cursor);
  }
}
const order = ["error", "snap-out", "enter-instant", "enter-clock", "leave-clock", "press-clock", "transition-all", "focus-fades", "no-focus-ring", "no-press", "no-hover", "fg-hover", "cursor"];
const counts = {};
for (const [slug, f] of Object.entries(findings)) {
  const list = Object.values(f).sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind));
  for (const x of list) counts[x.kind] = (counts[x.kind] || 0) + 1;
  if (mode === "summary" || mode === slug || (mode !== "summary" && mode.split(",").some(m => x => true) && list.some(x => mode.split(",").includes(x.kind)))) {
    const shown = mode === "summary" || mode === slug ? list : list.filter(x => mode.split(",").includes(x.kind));
    if (!shown.length) continue;
    console.log(`\n## ${slug}`);
    for (const x of shown) console.log(`  ${x.kind.padEnd(14)} ${x.who.padEnd(40)} ${x.detail}  [${[...x.tiles].slice(0, 3).join("; ")}${x.tiles.size > 3 ? "; +" + (x.tiles.size - 3) : ""}]`);
  }
}
console.log("\n", counts);
