#!/usr/bin/env python3
"""Corner radii across the set (cohesion pass, owner 2026-11-01: "are there inconsistencies with the corner
radius rounding?"). For every closed or open shape in packages/icons/sources, lists the radius of each corner
fillet (an arc of under 3 units joining two straight runs) and each rect's rx, against the shape's size (the
shorter side of its box). The rule (construction rules, Shared parts): r 2 for large containers and frames,
1.5 for mid containers, 1 for bars and small parts, so the softness is even. Prints a size × radius table and
the shapes whose radius sits off the most common one for their size.

  python3 docs/research/icon-cohesion-2026-10-31/tools/radii.py [--list]
"""
import collections, glob, math, os, re, sys

TOK = re.compile(r"[MLHVCSQAZmlhvcsqaz]|-?\d*\.?\d+(?:e-?\d+)?")
def parse(d):
    toks, i, cmds = TOK.findall(d), 0, []
    cur = None
    while i < len(toks):
        t = toks[i]
        if t.isalpha(): cur = t; i += 1; continue
        n = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "A": 7}[cur.upper()]
        cmds.append((cur, [float(x) for x in toks[i:i + n]])); i += n
        if cur == "M": cur = "L"
    return cmds

def corners(d):
    """(radius, bbox) for each small arc that sits between straight segments."""
    pts, out, x, y, prev = [], [], 0, 0, None
    segs = []
    for c, a in parse(d):
        if c == "M": x, y = a; segs.append(("M", (x, y))); pts.append((x, y)); continue
        if c == "L": x, y = a
        elif c == "H": x = a[0]
        elif c == "V": y = a[0]
        elif c == "A": x, y = a[5], a[6]
        elif c in "CSQ": x, y = a[-2], a[-1]
        segs.append((c, a)); pts.append((x, y))
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    box = (min(xs), min(ys), max(xs), max(ys)) if pts else (0, 0, 0, 0)
    for k, (c, a) in enumerate(segs):
        if c != "A" or a[0] > 3 or abs(a[0] - a[1]) > 1e-6: continue
        before = segs[k - 1][0] if k else None
        after = segs[k + 1][0] if k + 1 < len(segs) else ("L" if any(s[0] == "Z" for s in segs) else None)
        if before in ("L", "H", "V", "M") and after in ("L", "H", "V", "Z", None):
            out.append(a[0])
    return out, box

rows = []
for f in sorted(glob.glob("packages/icons/sources/*.svg")):
    name = os.path.basename(f)[:-4]
    t = open(f).read()
    if "data-alias-of" in t: continue
    for tag, body in re.findall(r"<(path|rect)\b([^>]*)/>", t):
        a = dict(re.findall(r'([\w-]+)="([^"]*)"', body))
        if a.get("data-filled") in ("gap", "fill", "stroke", "halo", "inset") or a.get("stroke", "none") == "none": continue
        if tag == "rect":
            w, h, rx = float(a["width"]), float(a["height"]), float(a.get("rx", 0))
            rows.append((name, "rect", rx, min(w, h), max(w, h)))
        else:
            rs, (x0, y0, x1, y1) = corners(a["d"])
            side, long = min(x1 - x0, y1 - y0), max(x1 - x0, y1 - y0)
            for r in rs: rows.append((name, "path", r, side, long))

def size_class(side, long):
    if long >= 9 and side >= 7: return "large (≥ 9 × 7)"
    if long >= 6 and side >= 4: return "mid (≥ 6 × 4)"
    return "small"
table = collections.defaultdict(collections.Counter)
icons = collections.defaultdict(lambda: collections.defaultdict(set))
for name, kind, r, side, long in rows:
    cls = size_class(side, long)
    table[cls][r] += 1; icons[cls][r].add(name)
print("corner radius by shape size (count of corners)")
for cls in ("large (≥ 9 × 7)", "mid (≥ 6 × 4)", "small"):
    common = table[cls].most_common()
    print(f"  {cls}: " + ", ".join(f"r {r:g} × {n}" for r, n in sorted(common)))
if "--list" in sys.argv:
    for cls in ("large (≥ 9 × 7)", "mid (≥ 6 × 4)", "small"):
        for r in sorted(icons[cls]):
            print(f"{cls} r {r:g}: {' '.join(sorted(icons[cls][r]))}")
