#!/usr/bin/env python3
"""Outliers in optical size, ink and balance at every size, within each keyline class (cohesion pass, 2026-11-01).

Reads sizes.mjs's JSON. Icons are compared with their own class (keyline × fill kind: a line glyph with line glyphs, a solid with solids) (square, circle, horizontal, vertical, from
packages/icons/dist/icons.json), because a ring is drawn larger than a square on purpose. At each size an icon's size,
mass and density are divided by its class median there; an icon is flagged when it sits outside the class's 10–90%
band by more than the tolerance at most sizes, or when its standing changes across sizes (fine at 16, heavy at 48),
or when its ink centroid sits more than 3% of the slot off centre.

  python3 docs/research/icon-cohesion-2026-10-31/tools/sizes.py sizes.json [--md] [--top 60]
"""
import collections, json, os, statistics as st, sys

args = [a for a in sys.argv[1:] if not a.startswith("--")]
d = json.load(open(args[0]))
TOP = int(sys.argv[sys.argv.index("--top") + 1]) if "--top" in sys.argv else 60
meta = {x["name"]: x for x in json.load(open(os.path.join(os.getcwd(), "packages/icons/dist/icons.json")))}
sizes = sorted(d, key=int)
skip = {n for n, m in meta.items() if m.get("aliasOf") or m.get("derivedFrom")}
cls = lambda n: meta.get(n, {}).get("keyline", "?") + "/" + meta.get(n, {}).get("fill", "?")
rel = collections.defaultdict(dict)
for s in sizes:
    by = collections.defaultdict(list)
    for n, v in d[s].items():
        if n not in skip: by[cls(n)].append(v)
    med = {c: {k: st.median(x[k] for x in vs) for k in ("size", "mass", "density")} for c, vs in by.items()}
    for n, v in d[s].items():
        if n in skip: continue
        m = med[cls(n)]
        rel[n][s] = {k: v[k] / m[k] - 1 for k in ("size", "mass", "density")} | {"cx": v["cx"], "cy": v["cy"]}
rows = []
for n, r in rel.items():
    sz = [r[s]["size"] for s in sizes]; ms = [r[s]["mass"] for s in sizes]; dn = [r[s]["density"] for s in sizes]
    off = max(abs(st.mean(r[s]["cx"] for s in sizes)), abs(st.mean(r[s]["cy"] for s in sizes)))
    drift = max(dn) - min(dn)
    score = abs(st.mean(sz)) * 3 + abs(st.mean(dn)) + abs(st.mean(ms)) * 0.5 + drift * 2
    flags = []
    if abs(st.mean(sz)) > 0.08: flags.append("large" if st.mean(sz) > 0 else "small")
    if abs(st.mean(dn)) > 0.25: flags.append("dense" if st.mean(dn) > 0 else "light")
    if drift > 0.15: flags.append(f"drifts {min(dn):+.0%}→{max(dn):+.0%}")
    if off > 0.06 and "--balance" in sys.argv: flags.append(f"off-centre {off:.0%}")
    rows.append((score, n, cls(n), st.mean(sz), st.mean(dn), drift, off, flags))
rows.sort(reverse=True)
flagged = [r for r in rows if r[7]]
if "--md" in sys.argv:
    print("| Icon | Keyline | Size vs class | Density vs class | Density drift 16→48 | Off centre | Flags |\n|---|---|---|---|---|---|---|")
    for s, n, c, a, b, dr, off, f in flagged[:TOP]:
        print(f"| {n} | {c} | {a:+.0%} | {b:+.0%} | {dr:.0%} | {off:.1%} | {', '.join(f)} |")
else:
    print(f"{len(rows)} icons, {len(flagged)} flagged; class medians compared at {', '.join(sizes)}px")
    for s, n, c, a, b, dr, off, f in flagged[:TOP]:
        print(f"{n:24} {c:10} size {a:+.0%}  density {b:+.0%}  drift {dr:.0%}  off {off:.1%}  {', '.join(f)}")
