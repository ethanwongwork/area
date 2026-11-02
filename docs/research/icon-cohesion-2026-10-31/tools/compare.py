#!/usr/bin/env python3
"""Area against the libraries' consensus, concept by concept (icon cohesion pass, 2026-10-31).

Every library has its own scale (Lucide's icons are larger, Phosphor's lighter), so an icon is
compared by where it sits in its own set: rel = value / the set's median. For each Area icon with
counterparts in docs/research/icon-audit/area-map.json, the consensus is the median rel of its
Lucide, Phosphor and Fluent counterparts. An Area icon that sits well off the consensus for its
own concept is an outlier the libraries do not share: the concept doesn't explain it, the drawing does.

  python3 docs/research/icon-cohesion-2026-10-31/tools/compare.py <measures dir> [names…] [--md]

<measures dir> holds measure.mjs's area.json, lucide.json, phosphor.json, fluent.json (and the
others for the set table). Flags: size off by more than 7%, density by more than 20%, mass by 25%.
"""
import json, os, statistics as st, sys

ROOT = os.getcwd()
args = [a for a in sys.argv[1:] if not a.startswith("--")]
md = "--md" in sys.argv
mdir, names = args[0], set(args[1:])
load = lambda s: json.load(open(os.path.join(mdir, s + ".json")))
area = load("area")
libs = {s: load(s) for s in ("lucide", "phosphor", "fluent")}
amap = json.load(open(os.path.join(ROOT, "docs/research/icon-audit/area-map.json")))
med = lambda d, k: st.median(v[k] for v in d.values())
M = {s: {k: med(d, k) for k in ("size", "density", "mass")} for s, d in [("area", area), *libs.items()]}

rows = []
for name, a in area.items():
    if names and name not in names: continue
    m = amap.get(name, {})
    ref = {s: libs[s].get(m.get(s)) for s in libs if m.get(s)}
    ref = {s: v for s, v in ref.items() if v}
    if not ref: continue
    row = {"name": name, "refs": len(ref)}
    for k in ("size", "density", "mass"):
        ar = a[k] / M["area"][k]
        cons = st.median(v[k] / M[s][k] for s, v in ref.items())
        row[k] = ar / cons - 1
    row["solid"], row["blob"] = a["solid"], a["blob"]
    row["refsolid"] = st.median(v["solid"] for v in ref.values())
    row["flag"] = ",".join(f for f, hit in (("small", row["size"] < -0.07), ("large", row["size"] > 0.07),
        ("dense", row["density"] > 0.2), ("light", row["density"] < -0.2), ("heavy", row["mass"] > 0.25),
        ("faint", row["mass"] < -0.25), ("solids", a["solid"] > 0.05 and row["refsolid"] < 0.02)) if hit)
    rows.append(row)

rows.sort(key=lambda r: -(abs(r["size"]) * 3 + abs(r["density"]) + abs(r["mass"])))
pct = lambda v: f"{v * 100:+.0f}%"
if md:
    print("| Icon | Size vs consensus | Density | Mass | Solid share (Area / libraries) | Flags |\n|---|---|---|---|---|---|")
    for r in rows:
        if names or r["flag"]: print(f"| {r['name']} | {pct(r['size'])} | {pct(r['density'])} | {pct(r['mass'])} | {r['solid']:.2f} / {r['refsolid']:.2f} | {r['flag']} |")
else:
    print(f"{'icon':22} {'refs':>4} {'size':>6} {'dens':>6} {'mass':>6} {'solid':>6} {'ref':>5}  flags")
    for r in rows:
        if names or r["flag"]: print(f"{r['name']:22} {r['refs']:4} {pct(r['size']):>6} {pct(r['density']):>6} {pct(r['mass']):>6} {r['solid']:6.2f} {r['refsolid']:5.2f}  {r['flag']}")
    flagged = [r for r in rows if r["flag"]]
    print(f"\n{len(rows)} Area icons with counterparts; {len(flagged)} flagged")
    from collections import Counter
    print(Counter(f for r in flagged for f in r["flag"].split(",")))
