// node diff.mjs out [combo] — new text failures and broken tokens per combo against base (same theme).
import fs from "node:fs";
const dir = process.argv[2], only = process.argv[3];
const load = f => JSON.parse(fs.readFileSync(`${dir}/${f}`));
const key = (slug, t) => `${slug}|${t.tile}|${t.path}|${t.text}`;
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("base.")).sort();
for (const theme of ["light", "dark"]) {
  if (!fs.existsSync(`${dir}/base.${theme}.json`)) continue;
  const base = load(`base.${theme}.json`);
  const baseFails = new Set(); let baseCount = 0;
  for (const [slug, fam] of Object.entries(base.families)) for (const t of fam.text ?? []) { baseFails.add(key(slug, t)); baseCount++; }
  const baseBad = new Set(Object.entries(base.tokens).filter(([, v]) => v === "rgba(0, 0, 0, 0)" || v === "∅").map(([k]) => k));
  console.log(`\n##### ${theme}: base text failures ${baseCount}; base transparent tokens ${baseBad.size}`);
  if (!only) for (const [slug, fam] of Object.entries(base.families)) for (const t of fam.text ?? []) console.log(`   base ${slug} | ${t.tile} | ${t.path} "${t.text}" ${t.ratio}/${t.need} ${t.ink} on ${t.plate}${t.image ? " img" : ""}`);
  for (const f of files.filter(f => f.endsWith(`.${theme}.json`))) {
    const r = load(f); if (only && r.combo !== only) continue;
    const bad = Object.entries(r.tokens).filter(([k, v]) => (v === "rgba(0, 0, 0, 0)" || v === "∅") && !baseBad.has(k)).map(([k]) => k);
    const fresh = []; const errs = []; const over = [], same = [];
    const baseOver = new Set(Object.entries(base.families).flatMap(([slug, f]) => (f.overflow ?? []).map(o => `${slug}|${o.tile}`)));
    const baseSame = new Set(Object.entries(base.families).flatMap(([slug, f]) => (f.sameSelected ?? []).map(o => `${slug}|${o.tile}|${o.path}`)));
    for (const [slug, fam] of Object.entries(r.families)) {
      for (const o of fam.overflow ?? []) if (!baseOver.has(`${slug}|${o.tile}`)) over.push(`${slug} [${o.tile}] +${o.over}px`);
      for (const o of fam.sameSelected ?? []) if (!baseSame.has(`${slug}|${o.tile}|${o.path}`)) same.push(`${slug} [${o.tile}] ${o.path} "${o.text}"`);
    }
    for (const [slug, fam] of Object.entries(r.families)) {
      if (fam.error) errs.push(`${slug}: ${fam.error}`);
      if (fam.errors) errs.push(`${slug}: ${fam.errors.join(" / ")}`);
      if ((fam.tiles ?? 0) !== (base.families[slug]?.tiles ?? 0)) errs.push(`${slug}: tiles ${fam.tiles} vs base ${base.families[slug]?.tiles}`);
      for (const t of fam.text ?? []) if (!baseFails.has(key(slug, t))) fresh.push({ slug, ...t });
    }
    console.log(`\n=== ${r.combo} ${theme}: ${fresh.length} new text failures; ${bad.length} newly transparent tokens; ${errs.length} errors`);
    if (bad.length) console.log("   tokens:", bad.join(" "));
    if (over.length) console.log(`   overflow ${over.length}:`, over.slice(0, 12).join("; "));
    if (same.length) console.log(`   selected = unselected ${same.length}:`, same.slice(0, 12).join("; "));
    for (const e of errs.slice(0, 15)) console.log("   err", e);
    // Group by family + path to keep it readable.
    const groups = new Map();
    for (const t of fresh) { const g = `${t.slug} | ${t.path}`; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(t); }
    for (const [g, list] of [...groups].sort((a, b) => Math.min(...a[1].map(t => t.ratio)) - Math.min(...b[1].map(t => t.ratio)))) {
      const w = list.reduce((a, t) => t.ratio < a.ratio ? t : a);
      console.log(`   ${g} ×${list.length}  worst ${w.ratio}/${w.need} "${w.text}" ${w.ink} on ${w.plate}${w.image ? " img" : ""} [${w.tile}]`);
    }
  }
}
