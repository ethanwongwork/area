"""Serif audit on the built UFO: every bracket (upright stem to level serif), every diagonal join, every small
corner, every round end, and each glyph's heights. Prints classes with their spread; an outlier is a value more
than TOL units from its class's most common value. Run from typefaces/area-serif."""
import sys, os, math, collections, unicodedata
sys.path.insert(0, os.getcwd())
import ufoLib2, joins
TOL = 1.5
LC, UC, FIG = "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
f = ufoLib2.Font.open(sys.argv[1] if len(sys.argv) > 1 else "build/AreaSerif-Regular.ufo")
NAMES = list(LC) + list(UC) + FIG
def cls(n): return "lc" if n in LC else "uc" if n in UC else "fig"
def zone(y, n):
    zs = {"lc": (0, 520, 780, -224), "uc": (0, 712), "fig": (0, 712)}[cls(n)]
    return min(zs, key=lambda z: abs(y - z))
def mode(vs): return collections.Counter(vs).most_common(1)[0][0]
def show(title, rows, key=lambda r: r[1], fmt=str):
    """rows: [(label, value)]"""
    if not rows: return
    m = mode([key(r) for r in rows]); bad = [r for r in rows if isinstance(key(r), (int, float)) and abs(key(r) - m) > TOL]
    vals = collections.Counter(key(r) for r in rows)
    print(f"{title}: n={len(rows)} mode {fmt(m)}  values {dict(sorted(vals.items()))}" + (f"  OUTLIERS {[(r[0], key(r)) for r in bad]}" if bad else ""))

# 1. brackets on upright stems
B = collections.defaultdict(list)
for n in NAMES:
    g = f[n]; xs = [p.x for c in g.contours for p in c.points]
    for c in g.contours:
        P = c.points
        for kind, i0, h1, h2, i3 in joins.segs(c):
            if kind != "curve": continue
            a, d = P[i0], P[i3]; dx, dy = abs(d.x - a.x), abs(d.y - a.y)
            if not (30 <= dx <= 160 and 30 <= dy <= 110): continue
            for stem, hs, serif, hf in ((a, P[h1], d, P[h2]), (d, P[h2], a, P[h1])):
                if abs(hs.x - stem.x) > 0.5 or abs(hf.y - serif.y) > 0.5: continue
                z = zone(serif.y, n); tip = abs(serif.y - z)
                if tip > 40: continue
                foot = (serif.y - z) * (stem.y - serif.y) > 0 and stem.y > serif.y   # serif below the stem node
                kind_ = ("foot" if stem.y > serif.y else "head")
                B[(cls(n), kind_, {0: "base", 520: "x", 712: "cap", 780: "asc", -224: "desc"}[z])].append(
                    (n, dx, dy, round(abs(hs.y - stem.y) / dy, 2), round(abs(hf.x - serif.x) / dx, 2), tip, serif.x, stem.x))
print("== 1. brackets (stem upright, serif level): length = stem edge to the bracket's end on the serif; height; handle shares; tip")
for k in sorted(B):
    rows = B[k]; print(f"-- {k}  ({len(rows)}): " + " ".join(sorted(set(r[0] for r in rows))))
    show("   length", [(r[0], r[1]) for r in rows]); show("   height", [(r[0], r[2]) for r in rows])
    show("   share up the stem", [(r[0], r[3]) for r in rows]); show("   share along the serif", [(r[0], r[4]) for r in rows])
    show("   tip thickness", [(r[0], r[5]) for r in rows])

# 2. diagonal joins
print("\n== 2. diagonal joins: side, reach along the serif x height, handle shares (serif / stroke), tip")
for n in NAMES:
    out = []
    for S_, HS, HN, N, X in joins.diagonal_joins(f[n]):
        side = "closed" if (N.x - X[0]) * (S_.x - X[0]) > 0 else "open"
        kf = abs(HS.x - S_.x) / abs(X[0] - S_.x); ks = math.hypot(HN.x - N.x, HN.y - N.y) / math.hypot(X[0] - N.x, X[1] - N.y)
        out.append(f"{side} {abs(X[0]-S_.x):.0f}x{abs(N.y-S_.y)} {kf:.2f}/{ks:.2f} tip {abs(S_.y - zone(S_.y, n))}")
    if out: print(f"   {n}: " + " | ".join(out))

# 3. small corners (softened ends) and round ends
print("\n== 3. softened corners: every curve no larger than 12 x 12")
C = []
for n in NAMES:
    for c in f[n].contours:
        P = c.points
        for kind, i0, h1, h2, i3 in joins.segs(c):
            if kind == "curve":
                a, d = P[i0], P[i3]; dx, dy = abs(d.x - a.x), abs(d.y - a.y)
                if dx <= 12 and dy <= 12: C.append((n, (dx, dy)))
cnt = collections.Counter(v for _, v in C); print("   sizes", dict(cnt.most_common()))
odd = collections.defaultdict(list)
for n, v in C:
    if v not in ((7, 7),): odd[v].append(n)
for v, ns in sorted(odd.items()): print(f"   not 7x7 {v}: " + " ".join(f"{k}x{c}" for k, c in sorted(collections.Counter(ns).items())))
print("\n== 3b. round ends (half circles): diameter")
for n in NAMES:
    b = joins._balls(f[n])
    if b: print(f"   {n}: {[abs(a.x - c_.x) for _, a, t, c_ in b]}", end=";")
print()

# 4. heights: flat or round at each extreme
print("\n== 4. heights: top and bottom of each glyph; F = a level edge 20 or longer there, R = a curve's extreme")
H = collections.defaultdict(list)
for n in NAMES:
    g = f[n]; pts = [p for c in g.contours for p in c.points if p.type]
    for which, y in (("top", max(p.y for p in pts)), ("bottom", min(p.y for p in pts))):
        flat = False
        for c in g.contours:
            P = c.points
            for kind, i0, _, _, i3 in joins.segs(c):
                if kind == "line" and P[i0].y == y == P[i3].y and abs(P[i0].x - P[i3].x) >= 20: flat = True
        H[(cls(n), which, "F" if flat else "R")].append((n, y))
for k in sorted(H):
    vals = collections.defaultdict(list)
    for n, y in H[k]: vals[y].append(n)
    print(f"   {k}: " + "  ".join(f"{y}: {''.join(x if len(x) == 1 else x + ' ' for x in ns)}" for y, ns in sorted(vals.items())))
