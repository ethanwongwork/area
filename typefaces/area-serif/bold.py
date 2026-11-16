"""Area Serif: the Bold master, made from the Regular's own points by rule.

Nothing here draws. A glyph's on-curve points sit on a set of x positions and a set of y positions (its knots).
`read` finds, on the Regular, which pairs of knots are the two edges of a stroke, which are the two sides of a
counter, which are a serif's reach and which are a stroke's end; `targets` gives each its Bold size from ONE number,
the lowercase stem (`vector`); `solve` moves the knots so every stroke is exactly its target and everything else
changes as little as it can, in proportion to its length (a 7-unit corner stays 7, a long stem takes up the slack).
Heights are pinned. Handles are never placed: a curve is carried into the box its two nodes now span, so its
tension and the direction it leaves each node are the Regular's, which is what keeps every instance between the
masters free of kinks.

docs/research/serif-typeface-2026-11-10/bold-master-plan.md has the measurements behind every number.
"""
import math

import numpy as np

REG_STEM = 78
STEM = 140                        # the Bold's lowercase stem: the one number (128 is `bold.vector(128)`)
STEM_REF = 140                    # the stem the references' ratios were read at
# Gains when the lowercase stem gains 62. Mean of Georgia Pro's and Serrif's Bold / Regular, on Area's Regular.
THICK = dict(straight=62, round=64)        # stems 78 > 140 and 86 > 148; round strokes 82 > 146 and 92 > 156
THIN_UPRIGHT = 1.32                        # upright hairlines (N's, M's): 1.10 to 1.25, 1.42 to 1.48
HAIR = {43: 53, 47: 59, 50: 66}            # a round letter's thin stroke, lowercase and capitals; an arch at its top
CAP_STEM, CAP_HAIR, LC_HAIR = 86, 47, 43      # the ladder's capital stem and the hairlines (construction skill)
HAIR_RATIO = 1.24                          # any other curved thin stroke
BAR = {49: 65}                             # H's bar
LEVEL = 1.33                               # arms and other straight level strokes (46 > 61)
TIP = 41 / 30                              # serif tips and a flag's end (Georgia Pro 39.5, Serrif 44.4 at Bold;
#                                            34, Libre Baskerville's step, is under both: `vector(140, tip=34)`)
FOOT = 0.95                                # a serif's reach from its stem (Georgia Pro 1.05, Serrif 0.85)
INWARD = dict(straight=0.34, round=0.53)   # of the ink gained, the share the counter gives up
BEARING = 0.80                             # side bearings (n: Georgia Pro 0.71, Serrif 0.90)
DOT = 1.51                                 # i's dot; its centre holds
DOT_ALONE = dict(mark=1.38, point=1.47)     # a dieresis's dots (Georgia Pro 1.34, Serrif 1.42); the period (1.43, 1.52)
BALL = 1.40                                # a ball terminal's width (a 1.43, c 1.49, f 1.34, r 1.29: the two's mean)
SPINE = 58                                 # the spine of s and S across itself (84 > 142, 95 > 154: 1.70 and 1.61)
# A round stroke thinner than a stem gains a multiple of what the o's round stroke gains (bold_diag.py, level cut at
# the stroke's extreme). The turns of s: Georgia Pro 1.22 and 1.36, Serrif 1.22 and 1.23, mean 1.26: in both Bolds
# the turns reach the o's weight (188 and 200 beside 191; 177 and 182 beside 180). The sides of g's loop: Georgia
# Pro 0.91 and 1.00, Serrif 0.55 and 1.74, mean 1.05.
SUB_ROUND = dict(turn=1.26, loop=1.05)
LEVEL_THICK = 1.57                         # g's loop at its top, 81 > 127 (Georgia Pro 1.38, Serrif 1.75); Q's tail by the same
# Signs (bold_signs.py). A sign's own stroke (Area 52: hyphen, dashes, plus, equals, slash, bar; 54 on less-than):
# hyphen 1.39 and 1.44, dashes 1.28 and 1.44, plus 1.28 to 1.42, equals 1.29 and 1.43, slash 1.37 and 1.37, bar 1.35
# and 1.43, less-than 1.33 and 1.43 (Georgia Pro, Serrif). Mean 1.37.
SIGN = 1.37
# An upright stroke lighter than a stem in a sign (bracket 73, brace 73): bracket 1.76 and 1.75, brace 1.80 and 1.79.
SIGN_UPRIGHT = 1.77
BULLET = 1.22                              # the bullet's width: 1.20, 1.24
NECK = 1.22                                # a branch's neck grows as the hairline does
ZONES = (0, 520, 712, 780, -224)
MATCH = 1.0                                # a scan line's ink edge within this of a knot is that knot's edge
RUN = 10                                   # and for at least this many units, to be a stroke or a counter


# 0.80, the Light master: the same engine run below the Regular (f under 0). Thick parts follow the stem as they do
# towards the Bold. Thin parts do not: a Bold's hairline gains little (contrast rises), and a Light's gives up
# more of what the stem does (contrast nearly holds). tools/light_refs.py, Light over Regular on six faces (Georgia
# Pro, Serrif, Source Serif 4, Literata, Newsreader, Merriweather):
#   n's stem        0.629 0.792 0.576 0.763 0.674 0.766   mean 0.700   Area 78 > 55
#   o's hairline    0.947 0.902 0.643 0.846 0.666 0.912   mean 0.819
#   H's bar         0.909 0.886 0.664 0.810 0.680 0.854   mean 0.800
#   a serif's tip   0.919 0.856 0.714 0.778 0.751 0.870   mean 0.815
#   i's dot         0.656 0.878 0.670 0.815 0.796 0.868   mean 0.781
#   n's advance     0.970 0.981 0.998 0.973 0.972 0.985   mean 0.980
#   a foot's reach  0.986 1.040 1.133 1.000 1.000 1.054   mean 1.036
# At stem 55 the thick parts' share of the Bold's step is f = -0.371. The share that brings each thin part to its
# ratio: the hairline -0.78, other curved thins -0.75, upright thins -0.57, the bar -0.61, level strokes -0.61, the
# tip -0.50: mean -0.64, which is LIGHT_THIN times f. The dot wants -0.43 and the reach and the advance come out at
# 1.02 and 0.98 on f itself, so those stay on f.
LIGHT_STEM = 55
LIGHT_THIN = 1.72


def vector(stem=STEM, **over):
    f = (stem - REG_STEM) / (STEM_REF - REG_STEM)
    ft = f if f >= 0 else f * LIGHT_THIN
    v = dict(stem=stem, f=f, ft=ft, tip=1 + (TIP - 1) * ft, foot=1 - (1 - FOOT) * f, bearing=1 - (1 - BEARING) * f,
             dot=1 + (DOT - 1) * f, neck=1 + (NECK - 1) * ft)
    if "tip" in over:
        v["tip"] = over["tip"] / 30
    return v


# ---------------------------------------------------------------- reading the Regular

def _bez(p, t):
    u = 1 - t
    return tuple(u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k] for k in (0, 1))


def segments(P):
    """[(i, [handle indices], j)] round a closed contour, lines included (no handles)."""
    on = [i for i, p in enumerate(P) if p.type is not None]
    out = []
    for k, i in enumerate(on):
        j = on[(k + 1) % len(on)]
        mid, q = [], (i + 1) % len(P)
        while q != j:
            mid.append(q)
            q = (q + 1) % len(P)
        out.append((i, mid, j))
    return out


def polys(contours, step=1.5):
    """contours: [[(x, y, type, smooth)]]. Closed polylines."""
    out = []
    for P in contours:
        class _P:                                           # segments() reads .type
            def __init__(s, q):
                s.type = q[2]
        poly = []
        for i, mid, j in segments([_P(q) for q in P]):
            a = P[i][:2]
            if not mid:
                poly.append(a)
                continue
            pts = [a] + [P[m][:2] for m in mid] + [P[j][:2]]
            if len(pts) != 4:
                raise ValueError("not a cubic")
            n = max(2, int(math.ceil(sum(math.dist(pts[k], pts[k + 1]) for k in range(3)) / step)))
            poly += [_bez(pts, k / n) for k in range(n)]
        out.append(poly)
    return out


def scan(polys_, v, ax):
    """Ink spans along the line where coordinate `ax` equals v (non-zero winding): [(lo, hi)] on the other axis."""
    hits = []
    v += 0.0137
    o = 1 - ax
    for c in polys_:
        n = len(c)
        for i in range(n):
            a, b = c[i], c[(i + 1) % n]
            a0, b0 = a[ax], b[ax]
            if (a0 <= v < b0) or (b0 <= v < a0):
                t = (v - a0) / (b0 - a0)
                hits.append((a[o] + t * (b[o] - a[o]), 1 if b0 > a0 else -1))
    hits.sort()
    spans, w, st = [], 0, None
    for x, d in hits:
        if w == 0:
            st = x
        w += d
        if w == 0 and st is not None and x - st > 0.3:
            spans.append((st, x))
    return spans


def _longest(vals, step):
    """The longest run of consecutive scan positions: (length in units, lo, hi)."""
    best, lo = (0, None, None), None
    prev = None
    for v in vals:
        if prev is None or v - prev > step * 1.5:
            lo = v
        if v - lo + step > best[0]:
            best = (v - lo + step, lo, v)
        prev = v
    return best


def read_axis(polys_, knots, ax, lo, hi, step=2.0):
    """Strokes and counters across one axis. ax = 1 scans level lines (strokes between x knots), ax = 0 upright
    lines (strokes between y knots). {(ka, kb): {"run": units, "at": (lo, hi), "straight": bool}}."""
    def near(x):
        return [k for k in knots if abs(k - x) <= MATCH]
    strokes, gaps = {}, {}
    v = lo + 1.0
    while v < hi:
        sp = scan(polys_, v, ax)
        m = [(near(a), near(b)) for a, b in sp]
        for (A, B), (a, b) in zip(m, sp):
            for ka in A:
                for kb in B:
                    if kb > ka:
                        strokes.setdefault((ka, kb), []).append((v, abs(a - ka), abs(b - kb)))
        for k in range(len(sp) - 1):
            for ka in m[k][1]:
                for kb in m[k + 1][0]:
                    if kb > ka:
                        gaps.setdefault((ka, kb), []).append((v, abs(sp[k][1] - ka), abs(sp[k + 1][0] - kb)))
        v += step
    out = []
    for d in (strokes, gaps):
        res = {}
        for key, rows in d.items():
            n, a, b = _longest([r[0] for r in rows], step)
            if n >= RUN:
                run = [r for r in rows if a <= r[0] <= b]
                da, db = sum(r[1] for r in run) / len(run), sum(r[2] for r in run) / len(run)
                res[key] = {"run": n, "at": (a, b), "straight": (da < 0.05, db < 0.05), "off": da + db}
        for key in sorted(res, key=lambda k: res[k]["off"]):     # two knots a unit apart: the edge is the nearer
            if key not in res:
                continue
            for other in list(res):
                if other != key and abs(other[0] - key[0]) <= MATCH and abs(other[1] - key[1]) <= MATCH \
                        and res[other]["at"][0] <= res[key]["at"][1] and res[key]["at"][0] <= res[other]["at"][1]:
                    del res[other]
        out.append(res)
    return out


def one_stroke(found, reach=20):
    """A stroke read twice because one of its edges has two nodes a little apart (a stem that tapers by two units, a
    bar whose top steps): the longer reading is the stroke; the other edge's second node keeps its distance from
    the first. Returns (strokes, [(knot, knot)] to keep)."""
    keys = sorted(found, key=lambda k: -(found[k].get("run") or 0))
    keep, drop = [], set()
    for i, k in enumerate(keys):
        if k in drop:
            continue
        for o in keys[i + 1:]:
            if o in drop:
                continue
            if k[0] == o[0] and 0 < abs(k[1] - o[1]) <= reach:
                drop.add(o)
                keep.append(tuple(sorted((k[1], o[1]))))
            elif k[1] == o[1] and 0 < abs(k[0] - o[0]) <= reach:
                drop.add(o)
                keep.append(tuple(sorted((k[0], o[0]))))
    return {k: v_ for k, v_ in found.items() if k not in drop}, keep


def end_caps(contours):
    """A stroke's squared end with softened corners: node, corner curve, short straight, corner curve, node.
    [(axis the stroke's thickness lies on, lo, hi)]."""
    out = []
    for P in contours:
        on = [q for q in P if q[2] is not None]
        n = len(on)
        for i in range(n):
            a, b, c, d = on[i], on[(i + 1) % n], on[(i + 2) % n], on[(i + 3) % n]
            for ax in (0, 1):                               # the short straight runs along axis 1 - ax...
                o = 1 - ax
                if b[ax] == c[ax] and 4 <= abs(b[o] - c[o]) <= 60 and abs(a[ax] - b[ax]) <= 9 and abs(d[ax] - c[ax]) <= 9 \
                        and a[ax] == d[ax] and a[ax] != b[ax] and abs(a[o] - b[o]) <= 12 and abs(d[o] - c[o]) <= 12:
                    out.append((o, min(a[o], d[o]), max(a[o], d[o])))
    return out


def corners(contours):
    """Softened corners (a curve no more than 9 units each way): [(axis, lo, hi)]. They keep their size."""
    out = set()
    for P in contours:
        class _Q:
            def __init__(s, q):
                s.type = q[2]
        for i, mid, j in segments([_Q(q) for q in P]):
            a, b = P[i], P[j]
            if mid and 0 < abs(a[0] - b[0]) <= 9 and 0 < abs(a[1] - b[1]) <= 9:
                for ax in (0, 1):
                    out.add((ax, min(a[ax], b[ax]), max(a[ax], b[ax])))
    return out


def extreme_pairs(contours, polys_, ax, reach=8, apart=80):
    """Strokes between two facing extremes that do not sit over each other (an arch: its counter's top and its own
    top are 42 units apart on n). ax = 1: level extremes, strokes between y knots. [(lo, hi)]."""
    o = 1 - ax
    ext = []
    for P in contours:
        n = len(P)
        for i, q in enumerate(P):
            if q[2] is None or not q[3]:
                continue
            a, b = P[i - 1], P[(i + 1) % n]
            if a[2] is None and b[2] is None and a[ax] == q[ax] == b[ax]:
                ext.append(q)
    out = set()
    for q in ext:
        for lo, hi in scan(polys_, q[o], o):
            for mine, far in ((lo, hi), (hi, lo)):
                if abs(mine - q[ax]) > 0.6:
                    continue
                cand = [e for e in ext if e is not q and abs(e[ax] - far) <= reach and abs(e[o] - q[o]) <= apart]
                if cand:
                    e = min(cand, key=lambda e: abs(e[ax] - far))
                    if 20 <= abs(e[ax] - q[ax]) <= 130:
                        out.add((min(e[ax], q[ax]), max(e[ax], q[ax])))
                elif 20 <= abs(far - q[ax]) < 64:              # a thin stroke whose other edge has no extreme (the
                    hit = (q[o], far) if ax == 1 else (far, q[o])   # foot of g's bowl): its nearest node stands for it
                    near = [e for P in contours for e in P if e[2] is not None and e is not q
                            and math.hypot(e[0] - hit[0], e[1] - hit[1]) <= 28 and abs(e[ax] - far) <= 12
                            and 20 <= abs(e[ax] - q[ax]) < 64]
                    if near:
                        e = min(near, key=lambda e: math.hypot(e[0] - hit[0], e[1] - hit[1]))
                        out.add((min(e[ax], q[ax]), max(e[ax], q[ax])))
    return sorted(out)


def roots(contours, polys_):
    """A thin stroke's root on a stem: two corners on one upright edge, the stroke's ink between them on one side
    and none above or below it there (the upper stroke of a's bowl where it enters the stem). [(y lo, y hi)]."""
    def ink(x, y):
        return any(a <= x <= b for a, b in scan(polys_, y, 1))
    corners_ = [q for P in contours for q in P if q[2] is not None and not q[3]]
    out = set()
    for i, p in enumerate(corners_):
        for q in corners_[i + 1:]:
            if p[0] != q[0] or not 25 <= abs(p[1] - q[1]) < 64:
                continue
            lo, hi = sorted((p[1], q[1]))
            ym = (lo + hi) / 2
            for d in (-5, 5):
                if ink(p[0] + d, ym) and ink(p[0] - d, ym) and not ink(p[0] + d, hi + 6) and not ink(p[0] + d, lo - 6) \
                        and ink(p[0] - d, hi + 6) and ink(p[0] - d, lo - 6):
                    out.add((lo, hi))
    return sorted(out)


def is_dot(P):
    xs, ys = [q[0] for q in P], [q[1] for q in P]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    return len(P) == 12 and 60 <= w < 262 and abs(w - h) <= 2 and not any(q[2] == "line" for q in P)


# ---------------------------------------------------------------- the Bold's sizes

def thick_gain(t, straight, v):
    return (THICK["straight"] if straight else THICK["round"]) * v["f"]


def x_target(t, straight, v):
    if t > 130:
        return None
    if v.get("sub") == "small sign" and THIN_READ <= t < 130:   # 0.81: SIGN_K
        return t * sign_ratio(v)
    if v.get("sub") == "sign":
        if 56 <= t < 76:
            return t * (1 + (SIGN_UPRIGHT - 1) * v["f"])
        if 50 <= t <= 55:
            return t * (1 + (SIGN - 1) * v["f"])
    if v["f"] < 0 and (t >= 76 or (straight and t >= 64) or (t >= 56 and not straight)):
        # 0.81, towards the Light: a thick part loses in proportion to itself, as the stem does (78 > 55). The
        # Bold's gains are amounts (the stem's 62, s's turns 1.26 of the round stroke's 64, measured on Bold
        # references); run backwards as amounts they took from a 60-unit turn what they take from a 78 stem, and
        # s's turns, j's tail, g's bowl thinned half as fast again as the stem (rays on the variable font, 0.81).
        return t * v["stem"] / REG_STEM
    if t >= 76 or (straight and t >= 64):
        return t + thick_gain(t, straight, v)
    if t >= 56 and not straight:
        return t + SUB_ROUND[v.get("sub", "loop")] * THICK["round"] * v["f"]
    if t >= 35:
        return t * (1 + (THIN_UPRIGHT - 1) * v["ft"])
    if t >= THIN_READ:                           # 0.81: an upright stroke thinner than a hairline (the asterisk's
        return t * v["tip"]                      # arms, a small figure's hairline) follows the serif tip, as a level
    return None                                  # one under 36 always has (y_target); 0.80 left it to the slack


THIN_READ = 18                                   # thinner than this across is a corner or a sliver, not a stroke
# 0.81: a sign's parts that are not plain strokes (the asterisk's arms and their round ends, the daggers' stems,
# bars and ends, the small T and M of the trademark) change with weight by part(w) / part(400) = (stem(w) /
# stem(400)) ** SIGN_K, on both sides. Measured (tools/weight/sign_k.py, scan lines on Georgia Pro's Light, Regular
# and Bold and on Serrif, Crimson Pro, Literata, Source Serif 4, Newsreader, Merriweather, Lora at 300, 400, 700):
# asterisk arm 0.81 / 0.77 (Light side / Bold side medians), dagger stem 0.75 / 0.90, trademark's T 0.71 / 0.68;
# the mean of the six, 0.77. Those signs: SMALL_SIGNS (the signs the measure was made on and their kin), drawn at
# a size of their own with no part at a stem's weight. Georgia Pro holds its signs (0.26 to 0.47), Merriweather lets them run with the stem
# (0.6 to 1.1). Until 0.80 they took the letters' rules: a petal 60 wide gained the round stroke's 64 (a balloon at
# 700) and lost the hairline's share at 300 (the asterisk's arms 23 > 15).
SIGN_K = 0.77
SMALL_SIGNS = ("asterisk", "dagger", "daggerdbl", "trademark", "servicemark")


def sign_ratio(v):
    return (v["stem"] / REG_STEM) ** SIGN_K


def y_target(t, straight, v):
    f = v["ft"]
    if t <= 36:
        return t * (sign_ratio(v) if v.get("sub") == "small sign" and t >= THIN_READ else v["tip"])
    if t >= 64:                                  # a thick level stroke: only a curved one (the top of g's loop,
        return None if straight or t > 130 else t * (v["stem"] / REG_STEM if v["f"] < 0 else 1 + (LEVEL_THICK - 1) * v["f"])   # Q's tail); bold() lets through
        #                                          only those between two facing extremes
    if v.get("sub") == "sign" and straight and 50 <= t <= 55:
        return t * (1 + (SIGN - 1) * f)
    if v.get("sub") == "small sign" and THIN_READ <= t <= 130:
        return t * sign_ratio(v)
    table = BAR if straight else HAIR
    if t in table:
        return t + (table[t] - t) * f
    return t * (1 + ((LEVEL if straight else HAIR_RATIO) - 1) * f)


# Slanted strokes (bold_diag.py reads v y V A in each face, Regular and Bold).
# The opening between two slanted strokes gives up a share of what the two gain across: Georgia Pro 0.09, 0.16,
# 0.01, 0.03 (it widens the letter instead); Serrif 0.38, 0.39, 0.53, 0.43. Mean of the eight.
DIAG_INWARD = 0.25
# The flat where two slanted strokes meet outside (v's foot, A's head) is parts.VERTEX of its class's stem in the
# Regular (0.42: 33 and 36). The Bold keeps that rule on its own stems: 59 and 62. (The references' Bold flats
# are 0.57 and 0.39 of their stems on v, 0.54 and 0.54 on V; their Regulars 0.44 and 0.50.)
# Everything else about a slanted stroke follows parts.vertices, the Regular's construction: its thickness across
# itself is exact; its two edges are one line each, through the ends that stay (a serif end, a flat's end); a
# corner it makes with another straight edge is where the two lines meet, so a counter's vertex climbs, a crossing
# opens and an arm's end slides along its stem by geometry, with no number set for any of them.
DIAG = dict(thick_lc=59, thick_cap=60, thin_lc=1.27, thin_cap=1.32)
# Diagonals across themselves, Bold / Regular: v w x z thick 1.72 to 1.77 (Georgia Pro) and 1.82 to 1.86 (Serrif),
# thin 1.18 to 1.26 and 1.35 to 1.37; capitals thick 1.60 to 1.69 and 1.70 to 1.77, thin 1.10 to 1.25 and 1.42 to 1.48.


def diag_target(t, v):
    f = v["f"]
    if v.get("sub") == "small sign":
        return t * sign_ratio(v)
    if v.get("sub") == "sign" and 50 <= t <= 55:
        return t * (1 + (SIGN - 1) * f)
    if t >= 64:
        return t + (DIAG["thick_lc"] if t < 80 else DIAG["thick_cap"]) * f
    return t * (1 + ((DIAG["thin_lc"] if t < 44 else DIAG["thin_cap"]) - 1) * v["ft"])


def diagonals(contours, polys_, tmax=130):
    """Slanted strokes: two straight edges, near parallel, with ink between. [(e1, e2, thickness)], an edge being
    its two nodes, e1 the left one."""
    edges = []
    for P in contours:
        on = [q for q in P if q[2] is not None]
        idx = [i for i, q in enumerate(P) if q[2] is not None]
        for k in range(len(on)):
            i, j = idx[k], idx[(k + 1) % len(on)]
            if (j - i) % len(P) != 1:
                continue
            a, b = on[k], on[(k + 1) % len(on)]
            dx, dy = b[0] - a[0], b[1] - a[1]
            if math.hypot(dx, dy) >= 70 and abs(dx) >= 12 and abs(dy) >= 30:
                edges.append((a[:2], b[:2]) if a[1] < b[1] else (b[:2], a[:2]))

    def x_at(e, y):
        return e[0][0] + (y - e[0][1]) * (e[1][0] - e[0][0]) / (e[1][1] - e[0][1])

    def ink(x, y):
        return any(a <= x <= b for a, b in scan(polys_, y, 1))
    out = []
    for i, e1 in enumerate(edges):
        for e2 in edges[i + 1:]:
            s1 = (e1[1][0] - e1[0][0]) / (e1[1][1] - e1[0][1])
            s2 = (e2[1][0] - e2[0][0]) / (e2[1][1] - e2[0][1])
            if abs(math.atan(s1) - math.atan(s2)) > 0.12:
                continue
            lo, hi = max(e1[0][1], e2[0][1]), min(e1[1][1], e2[1][1])
            if hi - lo < 30:
                continue
            ym = (lo + hi) / 2
            xa, xb = x_at(e1, ym), x_at(e2, ym)
            L, R = (e1, e2) if xa < xb else (e2, e1)
            h = abs(xb - xa)
            t = h / math.sqrt(1 + ((s1 + s2) / 2) ** 2)
            if 25 <= t <= tmax and ink((xa + xb) / 2, ym) and ink(min(xa, xb) + 2, ym) and ink(max(xa, xb) - 2, ym) \
                    and not ink(min(xa, xb) - 3, ym) and not ink(max(xa, xb) + 3, ym):
                out.append((L, R, t))
    return out


def slant_measure(st, at):
    """A slanted stroke across itself at the middle of its length, and how much wider it is at its upper end than
    its lower (its taper), from where `at` puts its nodes: a line through each edge's two farthest nodes."""
    def line(es):
        ns = sorted({at(q) for e in es for q in e}, key=lambda q: q[1])
        m = (ns[-1][0] - ns[0][0]) / (ns[-1][1] - ns[0][1])
        return m, ns[0][0] - m * ns[0][1], ns[0][1], ns[-1][1]
    (ml, cl, a0, a1), (mr, cr, b0, b1) = line(st["L"]), line(st["R"])
    lo, hi = max(a0, b0), min(a1, b1)
    if hi <= lo:
        lo, hi = min(a0, b0), max(a1, b1)
    cos = 1 / math.sqrt(1 + ((ml + mr) / 2) ** 2)
    w = lambda y: ((mr * y + cr) - (ml * y + cl)) * cos    # noqa: E731
    return w((lo + hi) / 2), (mr - ml) * cos * 100             # the taper: units wider per 100 units of height


def _adjacent(contours):
    """node -> (previous node, joined by a straight line?, next node, joined by a straight line?)."""
    adj = {}
    for P in contours:
        idx = [i for i, q in enumerate(P) if q[2] is not None]
        n = len(idx)
        for k, i in enumerate(idx):
            pi, ni = idx[k - 1], idx[(k + 1) % n]
            adj[P[i][:2]] = (P[pi][:2], (i - pi) % len(P) == 1, P[ni][:2], (ni - i) % len(P) == 1)
    return adj


def slant_strokes(dg):
    """Slanted strokes whole: an edge cut in two by a crossing stroke or a bar is one line. [{"L": [edges],
    "R": [edges], "t": thickness, "m": lean (dx / dy)}]."""
    edges = sorted({e for L, R, t in dg for e in (L, R)})
    group = {e: i for i, e in enumerate(edges)}
    for i, a in enumerate(edges):
        for b in edges[i + 1:]:
            d = (a[1][0] - a[0][0], a[1][1] - a[0][1])
            n = math.hypot(*d)
            off = [abs(d[0] * (q[1] - a[0][1]) - d[1] * (q[0] - a[0][0])) / n for q in b]
            if max(off) <= 2.5 and (b[0][1] >= a[1][1] - 1 or b[1][1] <= a[0][1] + 1):
                ga, gb = group[a], group[b]
                for e in edges:
                    if group[e] == gb:
                        group[e] = ga
    strokes = {}
    for L, R, t in dg:
        key = (group[L], group[R])
        st = strokes.setdefault(key, {"L": set(), "R": set(), "ts": []})
        st["ts"].append(t)
    for (gl, gr), st in strokes.items():
        st["L"] = [e for e in edges if group[e] == gl]
        st["R"] = [e for e in edges if group[e] == gr]
        st["t"] = sum(st["ts"]) / len(st["ts"])
        es = st["L"] + st["R"]
        st["m"] = sum((e[1][0] - e[0][0]) / (e[1][1] - e[0][1]) for e in es) / len(es)
    return list(strokes.values())


def _outer_flat(q, nx, adj, polys_):
    """A level edge between two slanted strokes is a vertex's flat when the ink lies on one side of it only and the
    strokes leave it on that side (a bar that crosses two slanted strokes has such edges too, with a stroke going
    on past them: those are not flats)."""
    pv, nn = adj[q][0], adj[nx][2]
    side = (pv[1] - q[1], nn[1] - nx[1])
    return side[0] * side[1] > 0                               # both strokes leave towards the same side


def _held(q, adj, pinned):
    """A corner on a pinned height that cannot slide along it (no level edge leaves it): the figure one's flag at
    the top of its stem."""
    pv, pl_, nx, nl = adj[q]
    return pl_ and nl and q[1] in pinned and pv[1] != q[1] and nx[1] != q[1]


LEAN_KEEP = 0.2                 # radians: a slanted stroke whose anchors would turn it further keeps the Regular's lean
# 0.81 (owner, 15 November: letters "start to lean as weight rises"). A thick diagonal keeps its lean within the
# references' own change from Regular to Bold: x's thick stroke 33.8 > 34.8 degrees (Georgia Pro), 34.4 > 32.2
# (Source Serif 4), at most 2.2 degrees (0.038 rad); Area's turned 36.4 > 42.7 as the anchors placed by the x knot map
# pulled its foot out, and the x leaned (top half's ink centre against the bottom's, -0.124 of its height from 400 to
# 700; the references -0.018 and -0.037). Thin diagonals turn more in the references (Georgia Pro's x 5.1 degrees)
# and keep LEAN_KEEP. Crossing strokes only (x X, whose edges the other stroke cuts in two): on v w V W, whose thick
# strokes meet at a vertex, keeping the lean pressed the vertices (W's middle stroke 41 > 27 at 700, an inflection in
# v's and V's brackets at 437, R's leg into the ring of the registered sign), so those keep LEAN_KEEP.
# tools: audit_lean.py, build/scratch4/ang.py (numbers only).
# NOT IN USE (None): kept on the x it left an inflection in both brackets of the thick stroke's top-left and
# bottom-right serifs between the masters (x at 315, 323, 443, 454; audit_bold --sweep at 325): serif_on_slant places
# the bracket's far end from the x knot map, not from the kept edge, so the Bold's bracket end stood 22 units left of
# the edge's line where the Regular's stands 10 right of it. The rule needs the serif placed from the kept edge first.
LEAN_KEEP_THICK = 0.038
LEAN_ALL = False


def slant_lines(strokes, pos, adj, flats, v, pinned=()):
    """Each stroke's two edge lines in the Bold. pos: where the upright solve put every node. Anchors are the ends
    that stay: a node where the edge runs into a curve (a serif's bracket) and a flat's end; where a stroke has none
    apart in height, its corners (on stems, bars) guide it instead. Sets st["lines"] = ((m, c) left, (m, c) right): x = m y + c."""
    for st in strokes:
        want = diag_target(st["t"], v) + st.get("bias", 0.0)
        rows = []
        for side, es in ((-1, st["L"]), (1, st["R"])):
            for q in {q for e in es for q in e}:
                pv, pl_, nx, nl = adj[q]
                corner = pl_ and nl
                w = 100.0 if q in flats or _held(q, adj, pinned) else 0.01 if corner else 1.0
                rows.append((side, pos[q][0], pos[q][1], w))
        strong = [r for r in rows if r[3] >= 1.0]
        fit_m = len(strong) >= 2 and max(r[2] for r in strong) - min(r[2] for r in strong) >= 40
        if not fit_m:
            strong = rows
            fit_m = max(r[2] for r in rows) - min(r[2] for r in rows) >= 40 and not any(r[3] >= 1.0 for r in rows)
        m = st["m"]
        slope = lambda es: sum((e[1][0] - e[0][0]) / (e[1][1] - e[0][1]) for e in es) / len(es)   # noqa: E731
        taper = slope(st["R"]) - slope(st["L"])                # the Regular's stroke may widen along its length (k's
        ends = [[pos[q][1] for e in es for q in e] for es in (st["L"], st["R"])]   # leg, 61 to 87): the Bold keeps
        lo_, hi_ = max(min(ends[0]), min(ends[1])), min(max(ends[0]), max(ends[1]))   # that, about the middle of
        ym = (lo_ + hi_) / 2 if hi_ > lo_ else sum(r[2] for r in rows) / len(rows)    # where its two edges face
        ym = st.get("ym", ym)                                  # (where they face once its ends have slid: bold())
        for _ in range(8):
            hw = want * math.sqrt(1 + m * m) / 2
            A, bvec = [], []
            for side, x, y, w in rows:
                sw = math.sqrt(w)
                off = side * (hw + taper / 2 * (y - ym))
                A.append([y * sw, sw] if fit_m else [sw])
                bvec.append((x - off) * sw if fit_m else (x - off - m * y) * sw)
            sol = np.linalg.lstsq(np.array(A), np.array(bvec), rcond=None)[0]
            if fit_m:
                m, c = float(sol[0]), float(sol[1])
                crossed = len(st["L"]) > 1 or len(st["R"]) > 1    # an edge cut in two: a stroke crossing another
                keep_ = LEAN_KEEP_THICK if (st["t"] >= 64 and (crossed or LEAN_ALL) and LEAN_KEEP_THICK) else LEAN_KEEP
                if abs(math.atan(m) - math.atan(st["m"])) > keep_:
                    # the ends that stay do not fix a lean this far
                    fit_m, m = False, st["m"]                       # from the Regular's (12 degrees): keep its lean
            else:
                c = float(sol[0])
        hw = want * math.sqrt(1 + m * m) / 2
        st["lines"] = ((m - taper / 2, c - hw + taper / 2 * ym), (m + taper / 2, c + hw - taper / 2 * ym))
        st["want"] = diag_target(st["t"], v)
        st["taper"] = taper


def serif_on_slant(strokes, adj, contours, X, Y, moved_to, v):
    """0.81: a serif on a slanted stroke keeps its reach from the stroke's edge. Its bracket runs from a node on the
    edge to a node where it leaves the serif's level underside (a level handle); the reach is measured from where
    the edge's line crosses that level (the corner the bracket rounds), and is the Regular's times v["foot"], as an
    upright stem's serif's is: that node and the serif's end beyond it move out together. 0.80 moved the serif's end
    with its x knot alone while the edge moved out with the stroke: x's top left serif kept none of its 47 units
    of reach at the Bold, and its bracket, with no room left, turned."""
    nodes_of = {}
    for ci, P in enumerate(contours):
        on = [i for i, q in enumerate(P) if q[2] is not None]
        for k, i in enumerate(on):
            nodes_of.setdefault(P[i][:2], (ci, k, on))
    for st in strokes:
        if "lines" not in st:
            continue
        for side, es in enumerate((st["L"], st["R"])):
            m, c = st["lines"][side]
            pts = sorted({q for e in es for q in e}, key=lambda q: q[1])
            if len(pts) < 2 or pts[-1][1] == pts[0][1]:
                continue
            (x0, y0), (x1, y1) = pts[0], pts[-1]
            mr = (x1 - x0) / (y1 - y0)
            for q in pts:
                pv, pl_, nx, nl = adj[q]
                for o, straight, step in ((pv, pl_, -1), (nx, nl, 1)):
                    if straight or o not in nodes_of:
                        continue
                    ci, k, on = nodes_of[o]
                    P = contours[ci]
                    # 0.81 (owner round): a bracket drawn as two curves (x's: from the edge up to an upright tangent,
                    # then round into the level underside) is one construction too: the node where it leaves the
                    # underside is found up to two nodes on, and the node between moves with the serif. Without it
                    # x's bracket end stayed on the knot map while its edge kept its lean, and the bracket turned
                    mids = []
                    for _hop in range(2):
                        i = on[k]
                        h = P[(i + 1) % len(P)] if step == -1 else P[i - 1]    # o's handle towards the bracket
                        if h[2] is None and h[1] == o[1]:
                            break
                        nxt_ = P[on[(k + step) % len(on)]]
                        if P[i][2] is None or nxt_[2] != "curve" and step == 1 or P[i][2] != "curve" and step == -1:
                            o = None
                            break
                        mids.append(o)
                        k = (k + step) % len(on)
                        o = P[on[k]][:2]
                    else:
                        o = None
                    if mids:
                        # the node between keeps its offset from the edge's line, the Regular's times the foot rule
                        # (the bracket's lower curve is the stroke's; its upper curve and the serif stay as placed)
                        mq = mids[0]
                        off_r = mq[0] - (x0 + (mq[1] - y0) * mr)
                        yb = moved_to.get(mq, (0, Y.get(mq[1], mq[1])))[1]
                        want = m * yb + c + off_r * v["foot"]
                        now = moved_to.get(mq, (X.get(mq[0], mq[0]), yb))[0]
                        if round(want - now):
                            moved_to[mq] = (now + round(want - now), yb)
                        continue
                    if o is None:
                        continue                                # the bracket does not leave a level underside
                    vr = x0 + (o[1] - y0) * mr                  # where the edge's line crosses that level
                    beyond = [P[on[(k + step * j) % len(on)]][:2] for j in range(1, 7)]
                    beyond = [w_ for w_ in beyond if (w_[0] - vr) * (o[0] - vr) > 0 and abs(w_[0] - vr) >= abs(o[0] - vr) - 1
                              and abs(w_[0] - o[0]) <= 20]
                    if not beyond or (o[0] - vr) * (q[0] - vr) > 0:
                        continue
                    yb = moved_to.get(o, (0, Y.get(o[1], o[1])))[1]
                    want = m * yb + c + (o[0] - vr) * v["foot"]
                    now = moved_to.get(o, (X.get(o[0], o[0]), yb))[0]
                    dx = round(want - now)
                    if not dx:
                        continue
                    for w_ in [o] + beyond:
                        cur = moved_to.get(w_, (X.get(w_[0], w_[0]), Y.get(w_[1], w_[1])))
                        moved_to[w_] = (cur[0] + dx, cur[1])


def slant_place(strokes, pos, adj, pinned=(), handles=None):
    """Every node on a slanted edge: an end that runs into a curve moves onto its line at its own height; a corner
    goes where its two edges' lines meet. Returns {node: (x, y)}."""
    line_of = {}
    for st in strokes:
        for es, (m, c) in zip((st["L"], st["R"]), st["lines"]):
            for e in es:
                line_of[frozenset(e)] = (m, c)                 # x = m y + c
    out = {}
    nodes = {q for st in strokes for e in st["L"] + st["R"] for q in e}

    def near(q, x, y, m1, c1):
        """Where two near-parallel lines meet is far away and means nothing (a slash through a letter): such a
        corner goes onto its own edge's line at its own height instead."""
        if math.hypot(x - pos[q][0], y - pos[q][1]) > 120:
            return (m1 * pos[q][1] + c1, pos[q][1])
        return (x, y)
    for q in nodes:
        pv, pl_, nx, nl = adj[q]
        mine = [line_of[frozenset((q, o))] for o, straight in ((pv, pl_), (nx, nl)) if straight and frozenset((q, o)) in line_of]
        other = [(o, straight) for o, straight in ((pv, pl_), (nx, nl)) if not (straight and frozenset((q, o)) in line_of)]
        if _held(q, adj, pinned):
            continue
        if len(mine) == 2:
            (m1, c1), (m2, c2) = mine
            if abs(m1 - m2) < 1e-6:
                continue
            y = (c2 - c1) / (m1 - m2)
            out[q] = near(q, m1 * y + c1, y, m1, c1)
            continue
        m1, c1 = mine[0]
        o, straight = other[0]
        if not straight:                                       # into a curve: the node keeps its height
            out[q] = (m1 * pos[q][1] + c1, pos[q][1])
            f_ = _fillet(q, o, adj, pos, m1, c1, nodes, handles or {})
            if f_:
                out[q], out[o] = f_
            continue
        (qx, qy), (ox, oy) = pos[q], pos[o]
        if math.hypot(ox - qx, oy - qy) < 20 and o not in nodes:
            f_ = _fillet(q, o, adj, pos, m1, c1, nodes, handles or {})
            if f_:                                             # 0.81: a short flat between this edge and a stem's
                out[q], out[o] = f_                            # (Nhookleft's 3-unit notch) keeps its place from
                continue                                       # the corner the two lines make
        if math.hypot(ox - qx, oy - qy) < 20 and abs(oy - qy) > 1e-6 and o not in nodes:
            out[q] = (m1 * qy + c1, qy)                        # a cut corner (z's 6-unit chamfer) goes with the edge
            out[o] = (ox + out[q][0] - qx, oy)
            continue
        if abs(oy - qy) < 1e-6:                                # a level edge
            out[q] = (m1 * qy + c1, qy)
        else:
            m2 = (ox - qx) / (oy - qy)                         # the other edge as it stands: x = m2 y + c2
            c2 = ox - m2 * oy if o not in out else qx - m2 * qy
            c2 = ox - m2 * oy
            if abs(m1 - m2) < 1e-6:
                continue
            y = (c2 - c1) / (m1 - m2)
            out[q] = near(q, m1 * y + c1, y, m1, c1)
    return out


def handles_of(contours):
    """{(node, the next node along): the node's handle towards it} for every curve."""
    out = {}
    for P in contours:
        n = len(P)
        for i, mid, j in segments([_Pt(q) for q in P]):
            if len(mid) == 2:
                out[(P[i][:2], P[j][:2])] = P[mid[0]][:2]
                out[(P[j][:2], P[i][:2])] = P[mid[1]][:2]
        del n
    return out


def _fillet(q, o, adj, pos, m1, c1, slanted, handles):
    """0.81: a slanted edge that runs into a short curve (a softened corner, under 20 units) and from it into a
    straight edge (Whook's diagonal into its upright, an N's diagonal into its stem): the two nodes of the curve
    stay where they are from the corner the two edges' lines make, in every master. 0.80 moved the slanted end along
    its own line at its own height and the other end with its knots: the slanted end passed the upright (Whook's
    17-unit fillet turned from 450). Returns ((x, y), (x, y)) or None."""
    if math.hypot(o[0] - q[0], o[1] - q[1]) > 20 or o in slanted:
        return None
    pv, pl_, nx, nl = adj[o]
    o2 = nx if pv == q else pv
    straight = nl if pv == q else pl_
    if straight:
        if math.hypot(o2[0] - o[0], o2[1] - o[1]) < 20:
            return None
        d2 = (o2[0] - o[0], o2[1] - o[1])
    else:                                                      # into a curve: its handle at o gives the edge
        h = handles.get((o, o2))
        if h is None or math.hypot(h[0] - o[0], h[1] - o[1]) < 10:
            return None
        d2 = (h[0] - o[0], h[1] - o[1])

    def meet(a1, b1, a2, b2):                                  # lines through two points each
        d1 = (b1[0] - a1[0], b1[1] - a1[1])
        d2 = (b2[0] - a2[0], b2[1] - a2[1])
        den = d1[0] * d2[1] - d1[1] * d2[0]
        if abs(den) < 1e-9:
            return None
        t = ((a2[0] - a1[0]) * d2[1] - (a2[1] - a1[1]) * d2[0]) / den
        return (a1[0] + t * d1[0], a1[1] + t * d1[1])
    pq = adj[q]
    far = pq[0] if pq[2] == o else pq[2]                       # q's slanted edge runs to `far`
    VR = meet(far, q, (o[0] + d2[0], o[1] + d2[1]), o)
    VB = meet((m1 * pos[far][1] + c1, pos[far][1]), (m1 * pos[q][1] + c1, pos[q][1]), (pos[o][0] + d2[0], pos[o][1] + d2[1]), pos[o])
    if VR is None or VB is None or math.hypot(VR[0] - q[0], VR[1] - q[1]) > 40 or math.hypot(VB[0] - pos[q][0], VB[1] - pos[q][1]) > 120:
        return None
    nq = (VB[0] + q[0] - VR[0], VB[1] + q[1] - VR[1])
    # 0.81 (last round): the corner stays on its own edge: it never passes the level of the edge's far end (neck_range's
    # rule for a crotch). Where the two lines meet at a shallow angle a small move of the edge carries their meeting
    # far along it: @'s a's top crotch rode 100 up its slanted stem, 21 over the stem's top (a nub at the Bold)
    if (nq[1] - pos[far][1]) * (q[1] - far[1]) <= 0:
        return None
    return (nq, (VB[0] + o[0] - VR[0], VB[1] + o[1] - VR[1]))


def inside_flats(strokes, pos, adj, placed, pinned):
    """A short level flat between two slanted edges that is not on a pinned height (Y's crotch) keeps the width the
    solve gave it: it sits at the height where its two edges are that far apart."""
    line_of = {}
    for st in strokes:
        for es, (m, c) in zip((st["L"], st["R"]), st["lines"]):
            for e in es:
                line_of[frozenset(e)] = (m, c)
    for q, (pv, pl_, nx, nl) in adj.items():
        if not (nl and pl_ and q[1] == nx[1] and 1 <= abs(q[0] - nx[0]) <= 90) or q[1] in pinned:
            continue
        nn = adj[nx][2]
        if not adj[nx][3] or frozenset((pv, q)) not in line_of or frozenset((nx, nn)) not in line_of:
            continue
        (m1, c1), (m2, c2) = line_of[frozenset((pv, q))], line_of[frozenset((nx, nn))]
        w = pos[nx][0] - pos[q][0]
        if abs(m2 - m1) < 0.05:
            continue
        y = (w - (c2 - c1)) / (m2 - m1)
        if abs(y - pos[q][1]) > 120:                           # near-parallel edges: no meaning in where they part
            continue
        placed[q], placed[nx] = (m1 * y + c1, y), (m2 * y + c2, y)


def fork_stem(strokes, pos, adj, placed):
    """A stem under a fork (Y): its two edges each end on a slanted edge of a different stroke. It stands where the
    two junctions keep the difference in height they have in the Regular. Returns {node: (x, y)} for the stem's
    own nodes (everything between the two junctions that is not on a slanted edge), shifted."""
    slanted = {q for st in strokes for e in st["L"] + st["R"] for q in e}
    line_of = {}
    for si, st in enumerate(strokes):
        for es, (m, c) in zip((st["L"], st["R"]), st["lines"]):
            for e in es:
                line_of[frozenset(e)] = (m, c, si)
    ends = []
    for q in slanted:
        pv, pl_, nx, nl = adj[q]
        for o, straight, back, bstraight in ((pv, pl_, nx, nl), (nx, nl, pv, pl_)):
            if straight and bstraight and o[0] == q[0] and abs(o[1] - q[1]) >= 25 and frozenset((q, back)) in line_of \
                    and frozenset((q, o)) not in line_of:
                ends.append((q, o, line_of[frozenset((q, back))], o is nx))
    out = {}
    for i, (q1, o1, l1, fwd1) in enumerate(ends):
        for q2, o2, l2, fwd2 in ends[i + 1:]:
            if l1[2] == l2[2] or fwd1 == fwd2 or q1[0] == q2[0]:
                continue
            a, b = (q1, q2) if fwd1 else (q2, q1)              # walk from a forwards to b: the stem's own nodes
            chain, cur_ = [], adj[a][2]
            while cur_ != b and len(chain) < 200:
                chain.append(cur_)
                cur_ = adj[cur_][2]
            if cur_ != b or any(c in slanted for c in chain):
                continue
            (m1, c1, _), (m2, c2, _) = l1, l2
            x1, x2 = pos[q1][0], pos[q2][0]
            if abs(m1) < 1e-6 or abs(m2) < 1e-6 or abs(1 / m1 - 1 / m2) < 1e-9:
                continue
            want = q1[1] - q2[1]
            dx = (want - (x1 - c1) / m1 + (x2 - c2) / m2) / (1 / m1 - 1 / m2)
            if abs(dx) > 120:
                continue
            for c in chain:
                out[c] = (pos[c][0] + dx, pos[c][1])
            out[q1] = (x1 + dx, (x1 + dx - c1) / m1)
            out[q2] = (x2 + dx, (x2 + dx - c2) / m2)
            out["dx"] = dx
    return out


def balls(contours):
    """A ball terminal: two quarter turns the same way, about as wide as tall, that make a half round 50 to 130
    across. [(axis the diameter lies on, lo, hi, the other axis, lo, hi)]."""
    out = []
    sa = [sum(P[i][0] * P[(i + 1) % len(P)][1] - P[(i + 1) % len(P)][0] * P[i][1] for i in range(len(P))) for P in contours]
    ink = max(sa, key=abs) > 0 if sa else True
    for P, a_ in zip(contours, sa):
        if (a_ > 0) != ink:                                    # 0.81: a counter is not a ball (the command sign's
            continue                                           # round holes were read as balls and grew 1.4 times)
        on = [(i, q) for i, q in enumerate(P) if q[2] is not None]
        n = len(on)
        for k in range(n):
            (ia, a), (ib, b), (ic, c) = on[k], on[(k + 1) % n], on[(k + 2) % n]
            if (ib - ia) % len(P) != 3 or (ic - ib) % len(P) != 3:
                continue
            for ax in (0, 1):
                o = 1 - ax
                d = abs(c[ax] - a[ax])
                if abs(a[o] - c[o]) <= 6 and 50 <= d <= 130 and abs(abs(b[o] - a[o]) - d / 2) <= 0.2 * d \
                        and abs(b[ax] - (a[ax] + c[ax]) / 2) <= 0.15 * d:
                    cr1 = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
                    if abs(cr1) > 0.3 * d * d:
                        out.append((ax, min(a[ax], c[ax]), max(a[ax], c[ax]), o, min(a[o], b[o]), max(a[o], b[o])))
    return out


def shallow(contours, polys_):
    """Slanted strokes that lie nearer level than upright (the top of g's loop): two straight edges, near parallel,
    ink between. [(lower edge, upper edge, thickness)], an edge its two nodes, left first."""
    edges = []
    for P in contours:
        idx = [i for i, q in enumerate(P) if q[2] is not None]
        for k, i in enumerate(idx):
            j = idx[(k + 1) % len(idx)]
            a, b = P[i][:2], P[j][:2]
            if (j - i) % len(P) == 1 and abs(b[0] - a[0]) >= 70 and 4 <= abs(b[1] - a[1]) < 0.6 * abs(b[0] - a[0]):
                edges.append((a, b) if a[0] < b[0] else (b, a))

    def ink(x, y):
        return any(a <= x <= b for a, b in scan(polys_, y, 1))
    out = []
    for i, e1 in enumerate(edges):
        for e2 in edges[i + 1:]:
            s1 = (e1[1][1] - e1[0][1]) / (e1[1][0] - e1[0][0])
            s2 = (e2[1][1] - e2[0][1]) / (e2[1][0] - e2[0][0])
            lo, hi = max(e1[0][0], e2[0][0]), min(e1[1][0], e2[1][0])
            if abs(math.atan(s1) - math.atan(s2)) > 0.12 or hi - lo < 30:
                continue
            xm = (lo + hi) / 2
            ya = e1[0][1] + (xm - e1[0][0]) * s1
            yb = e2[0][1] + (xm - e2[0][0]) * s2
            t = abs(yb - ya) / math.sqrt(1 + ((s1 + s2) / 2) ** 2)
            if 25 <= t <= 130 and ink(xm, (ya + yb) / 2) and not ink(xm, min(ya, yb) - 3) and not ink(xm, max(ya, yb) + 3):
                out.append(((e1, e2) if ya < yb else (e2, e1)) + (t,))
    return out


def facing(contours, polys_):
    """Slanted smooth nodes and what faces them across the ink: another slanted smooth node (s's spine), or a
    straight slanted edge (R's leg: one edge straight, one curved). [(node, node or edge, thickness, kind)]."""
    nodes, lines = [], []
    for P in contours:
        n = len(P)
        idx = [i for i, q in enumerate(P) if q[2] is not None]
        for k, i in enumerate(idx):
            j = idx[(k + 1) % len(idx)]
            a, b = P[i], P[j]
            if (j - i) % n == 1 and math.hypot(b[0] - a[0], b[1] - a[1]) >= 70 and abs(b[0] - a[0]) >= 12 and abs(b[1] - a[1]) >= 30:
                lines.append((a[:2], b[:2]) if a[1] < b[1] else (b[:2], a[:2]))
        for i, q in enumerate(P):
            if q[2] is None or not q[3]:
                continue
            a, b = P[i - 1], P[(i + 1) % n]
            if a[2] is not None and b[2] is not None:
                continue
            d = (b[0] - q[0], b[1] - q[1]) if b[2] is None else (q[0] - a[0], q[1] - a[1])
            L = math.hypot(*d)
            if L >= 5 and abs(d[0]) >= 0.25 * L and abs(d[1]) >= 0.25 * L:
                nodes.append((q[:2], (d[0] / L, d[1] / L)))

    def ink(x, y):
        return any(a <= x <= b for a, b in scan(polys_, y, 1))
    out, seen = [], set()
    for q, u in nodes:
        for nrm in ((-u[1], u[0]), (u[1], -u[0])):
            if not ink(q[0] + nrm[0] * 3, q[1] + nrm[1] * 3):
                continue
            t = 3.0
            while t < 140 and ink(q[0] + nrm[0] * t, q[1] + nrm[1] * t):
                t += 1.0
            if t >= 140 or t < 25:
                continue
            ex = (q[0] + nrm[0] * t, q[1] + nrm[1] * t)
            cand = [(math.dist(ex, o), o) for o, _ in nodes if o != q and math.dist(ex, o) <= 28]
            if cand:
                o = min(cand)[1]
                if frozenset((q, o)) not in seen:
                    seen.add(frozenset((q, o)))
                    up, low = (q, o) if q[1] >= o[1] else (o, q)
                    out.append((up, low, t, "node"))
                continue
            for e in lines:
                (x0, y0), (x1, y1) = e
                L = math.hypot(x1 - x0, y1 - y0)
                off = abs((x1 - x0) * (ex[1] - y0) - (y1 - y0) * (ex[0] - x0)) / L
                along = ((ex[0] - x0) * (x1 - x0) + (ex[1] - y0) * (y1 - y0)) / L
                if off <= 2.5 and 0 <= along <= L and abs(u[0] * (x1 - x0) + u[1] * (y1 - y0)) / L > 0.9:
                    out.append((q, e, t, "edge"))
    return out


def spine(contours, up, low, v, t=None):
    """A curved slanted stroke (the spine of s; any stroke with a node on each edge facing the other): the two nodes
    move apart along the stroke's normal until it has its Bold thickness across itself. Returns the x and y
    constraints."""
    def tangent(pt):
        for P in contours:
            for i, q in enumerate(P):
                if q[:2] == pt and q[2] is not None:
                    h = P[(i + 1) % len(P)]
                    d = (h[0] - q[0], h[1] - q[1])
                    L = math.hypot(*d)
                    return (d[0] / L, d[1] / L)
        raise KeyError(f"no node at {pt}")
    tu, tl = tangent(up), tangent(low)
    if tu[0] * tl[0] + tu[1] * tl[1] < 0:
        tl = (-tl[0], -tl[1])
    t = ((tu[0] + tl[0]) / 2, (tu[1] + tl[1]) / 2)
    L = math.hypot(*t)
    nrm = (-t[1] / L, t[0] / L)
    d = (up[0] - low[0], up[1] - low[1])
    if d[0] * nrm[0] + d[1] * nrm[1] < 0:
        nrm = (-nrm[0], -nrm[1])
    across = d[0] * nrm[0] + d[1] * nrm[1]
    gain = SPINE * v["f"] if across >= 64 else across * (DIAG["thin_lc"] - 1) * v["ft"]
    if v.get("sub") == "small sign":                           # 0.81: SIGN_K, as every other part of such a sign
        gain = abs(across) * (sign_ratio(v) - 1)
    cons = {"x": [], "y": []}
    for ax, key in ((0, "x"), (1, "y")):
        a, b = sorted((low[ax], up[ax]))
        sign = 1 if up[ax] >= low[ax] else -1
        if a != b:
            cons[key].append((a, b, (b - a) + sign * gain * nrm[ax], "spine"))
    return cons, d[0] * nrm[0] + d[1] * nrm[1]


# ---------------------------------------------------------------- moving the knots

def solve(knots, cons, pins):
    """knots: sorted values. cons: [(a, b, target gap, weight)]. pins: {knot: value}. Least squares, then whole
    units. Returns {knot: new}."""
    idx = {k: i for i, k in enumerate(knots)}
    free = [k for k in knots if k not in pins]
    col = {k: i for i, k in enumerate(free)}
    rows, rhs = [], []
    for con in cons:
        if len(con) == 4:
            a, b, target, w = con
            coefs = {b: 1.0, a: -1.0}
        else:
            coefs, target, w = con
        r = [0.0] * len(free)
        c = target
        for k, cf in coefs.items():
            if k in pins:
                c -= cf * pins[k]
            else:
                r[col[k]] += cf
        if any(r):
            sw = math.sqrt(w)
            rows.append([x * sw for x in r])
            rhs.append(c * sw)
    if not free:
        return dict(pins)
    x = np.linalg.lstsq(np.array(rows), np.array(rhs), rcond=None)[0]
    out = dict(pins)
    for k in free:
        out[k] = float(x[col[k]])
    return out


def _cons(knots, strokes, gaps, extra, v, target, ax, keep=(), spans=()):
    """One axis's constraints: ([(a, b, target gap, weight)], strokes held exactly, counters)."""
    cons, hard = [], []
    for a, b in zip(knots, knots[1:]):
        g = b - a
        cons.append((a, b, g, 1e-3 / (g * g)))                   # a tie-breaker only
    for a, b in spans:
        g = b - a
        cons.append((a, b, g, 1.0 / (g * g)))                    # every piece of outline keeps its size, in proportion
    gain = {}
    for (a, b), s in strokes.items():
        t = b - a
        want = target(t, all(s["straight"]), v)
        if want is None:
            continue
        hard.append((a, b, t, want, "stroke"))
        gain[a] = gain[b] = (want - t, all(s["straight"]))
    for a, b, want, kind in extra:
        hard = [h for h in hard if (h[0], h[1]) != (a, b)]
        hard.append((a, b, b - a, want, kind))
    for a, b, t, want, kind in hard:
        cons.append((a, b, want, 1e4))
    soft = []
    if ax == 0:
        for (a, b), s in gaps.items():
            ga, gb = gain.get(a), gain.get(b)
            if not ga or not gb:                               # a counter lies between two strokes (a gap to a
                continue                                       # serif's tip is not one)
            lose = sum(INWARD["straight" if g[1] else "round"] * g[0] for g in (ga, gb) if g)
            c = b - a
            cons.append((a, b, c - lose, 400.0 / (c * c)))
            soft.append((a, b, c, c - lose, "counter"))
    for a, b in keep:
        cons.append((a, b, b - a, 1e3))
    return cons, hard, soft


def _exact(new, knots, hard, soft, keep, pins, spans, ax):
    """Whole units, with every stroke exactly its size. Returns the report rows."""
    exact = [(a, b, round(want)) for a, b, t, want, kind in hard]
    if ax == 0:
        exact += [(a, b, round(want)) for a, b, c, want, kind in soft]
    for a, b, w in sorted(exact, key=lambda e: (e[1], e[0])):
        d = (new[b] - new[a]) - w
        if not d:
            continue
        if ax == 0:
            for k in knots:                                    # across: everything from this edge on moves over
                if k >= b:
                    new[k] -= d
        elif b not in pins:
            new[b] -= d
        elif a not in pins:
            new[a] += d
    held = {k for e in exact for k in e[:2]} | set(pins)
    for a, b in sorted(keep):                                    # a softened corner keeps its size
        d = (new[b] - new[a]) - (b - a)
        if not d:
            continue
        if a not in held:
            new[a] += d
        elif b not in held:
            new[b] -= d
    rep = [(a, b, b - a, b - a, new[b] - new[a], "turned over") for a, b in spans if new[b] < new[a]]
    rep += [(a, b, t, round(want, 1), new[b] - new[a], kind) for a, b, t, want, kind in hard]
    rep += [(a, b, c, round(want, 1), new[b] - new[a], kind) for a, b, c, want, kind in soft]
    return rep


def carry(P, new_on):
    """Every point of a contour from its nodes' new places: a curve goes into the box its two nodes now span."""
    class _Q:
        def __init__(s, q):
            s.type = q[2]
    new = [None] * len(P)
    for i, q in enumerate(P):
        if q[2] is not None:
            new[i] = new_on[i]
    for i, mid, j in segments([_Q(q) for q in P]):
        a, b = P[i], P[j]
        for k, m in enumerate(mid):
            end_old, end_new = (a, new[i]) if k == 0 else (b, new[j])
            xy = []
            for ax in (0, 1):
                if abs(b[ax] - a[ax]) < 1e-6:
                    xy.append(end_new[ax] + (P[m][ax] - end_old[ax]))
                else:
                    xy.append(new[i][ax] + (P[m][ax] - a[ax]) * (new[j][ax] - new[i][ax]) / (b[ax] - a[ax]))
            new[m] = (round(xy[0]), round(xy[1]))
    return [(x, y, q[2], q[3]) for (x, y), q in zip(new, P)]


def keep_tangents(P, N):
    """At a smooth node that is not level or upright, both handles go back onto the Regular's direction (their
    lengths as carried), so the instance half way has the same tangent as both masters."""
    n = len(P)
    out = list(N)
    for i, q in enumerate(P):
        if q[2] is None or not q[3]:
            continue
        a, b = P[i - 1], P[(i + 1) % n]
        if a[2] is not None and b[2] is not None:
            continue
        for h, other in ((i - 1, (i + 1) % n), ((i + 1) % n, i - 1)):
            if P[h][2] is not None:
                continue
            d = (P[h][0] - q[0], P[h][1] - q[1])
            L = math.hypot(*d)
            if L < 5 or abs(d[0]) < 0.02 * L or abs(d[1]) < 0.02 * L:
                continue                                           # a softened corner, or level or upright
            if P[other][2] is not None:
                # a line on the other side: the handle follows the line's new direction
                ln = (N[i][0] - N[other][0], N[i][1] - N[other][1])
                Ln = math.hypot(*ln)
                u = (ln[0] / Ln, ln[1] / Ln)
            else:
                u = (d[0] / L, d[1] / L)
            nl = (N[h][0] - N[i][0]) * u[0] + (N[h][1] - N[i][1]) * u[1]
            nl = max(nl, 1.0) if P[other][2] is None else abs(nl)
            step = -1 if h == i - 1 else 1                       # the curve's other node: the handle stays in its box
            e = (i + 3 * step) % n
            for ax in (0, 1):
                room = (N[e][ax] - N[i][ax]) * (1 if u[ax] > 0 else -1)
                if abs(u[ax]) > 1e-9 and room >= 0:
                    nl = min(nl, room / abs(u[ax]))
            out[h] = (round(N[i][0] + u[0] * nl), round(N[i][1] + u[1] * nl), None, False)
    return out


def no_turn_back(P, N):
    """A curve that runs one way on an axis in the Regular runs one way in the Bold: a handle carried past its
    curve's nodes (after a node was placed on a line or a neck was set) is drawn back towards its own node, along
    its own direction, until it is inside the nodes' span. A handle never sits on its node."""
    class _Q:
        def __init__(s, q):
            s.type = q[2]
    out = list(N)
    for i, mid, j in segments([_Q(q) for q in P]):
        if len(mid) != 2:
            continue
        for m, own, far in ((mid[0], i, j), (mid[1], j, i)):
            k = 1.0
            for ax in (0, 1):
                reg = [P[i][ax], P[mid[0]][ax], P[mid[1]][ax], P[j][ax]]
                d = [b - a for a, b in zip(reg, reg[1:])]
                if any(x > 0 for x in d) and any(x < 0 for x in d):
                    continue
                lo, hi = sorted((out[own][ax], out[far][ax]))
                hv = out[m][ax] - out[own][ax]
                if out[m][ax] < lo or out[m][ax] > hi:
                    room = (hi - out[own][ax]) if hv > 0 else (out[own][ax] - lo)
                    k = min(k, max(room, 0) / abs(hv))
            if k < 1.0:
                out[m] = (round(out[own][0] + (out[m][0] - out[own][0]) * k), round(out[own][1] + (out[m][1] - out[own][1]) * k), None, False)
            xy = list(out[m][:2])
            for ax in (0, 1):                                  # the last unit, where whole units left it outside
                reg = [P[i][ax], P[mid[0]][ax], P[mid[1]][ax], P[j][ax]]
                d = [b - a for a, b in zip(reg, reg[1:])]
                if not (any(x > 0 for x in d) and any(x < 0 for x in d)):
                    lo, hi = sorted((out[own][ax], out[far][ax]))
                    xy[ax] = min(max(xy[ax], lo), hi)
            if tuple(xy) == out[own][:2] and P[m][:2] != P[own][:2]:
                ax = 0 if abs(out[far][0] - out[own][0]) >= abs(out[far][1] - out[own][1]) else 1
                if out[far][ax] != out[own][ax]:
                    xy[ax] += 1 if out[far][ax] > out[own][ax] else -1
            out[m] = (xy[0], xy[1], None, False)
        for ax in (0, 1):                                      # and the two handles in the order the curve runs
            reg = [P[i][ax], P[mid[0]][ax], P[mid[1]][ax], P[j][ax]]
            d = [b - a for a, b in zip(reg, reg[1:])]
            if any(x > 0 for x in d) and any(x < 0 for x in d):
                continue
            run = out[j][ax] - out[i][ax]
            h1, h2 = out[mid[0]], out[mid[1]]
            if run * (h2[ax] - h1[ax]) < 0:
                q = list(h1[:2])
                q[ax] = h2[ax]
                out[mid[0]] = (q[0], q[1], None, False)
    return out


def no_inflection(P, N):
    """A curve that bends one way in the Regular bends one way in the Bold: where carrying it into a narrower box
    has made it an S (a bracket whose end moved onto its stroke's line), the handle that overshoots is drawn back
    along its own direction until the curve bends one way again."""
    class _Q:
        def __init__(s, q):
            s.type = q[2]

    def turn(a, h1, h2, b):
        c1 = (h1[0] - a[0]) * (h2[1] - h1[1]) - (h1[1] - a[1]) * (h2[0] - h1[0])
        c2 = (h2[0] - h1[0]) * (b[1] - h2[1]) - (h2[1] - h1[1]) * (b[0] - h2[0])
        return c1, c2
    out = list(N)
    for i, mid, j in segments([_Q(q) for q in P]):
        if len(mid) != 2:
            continue
        r1, r2 = turn(P[i], P[mid[0]], P[mid[1]], P[j])
        b1, b2 = turn(out[i], out[mid[0]], out[mid[1]], out[j])
        if r1 * r2 < 0 or b1 * b2 >= 0:
            continue
        done = False
        for m, own in ((mid[0], i), (mid[1], j)):
            for k in (0.85, 0.7, 0.55):                        # no further: a handle cut shorter than this redraws the curve
                h = (round(out[own][0] + (out[m][0] - out[own][0]) * k), round(out[own][1] + (out[m][1] - out[own][1]) * k), None, False)
                trial = list(out)
                trial[m] = h
                t1, t2 = turn(trial[i], trial[mid[0]], trial[mid[1]], trial[j])
                if t1 * t2 >= 0 and h[:2] != out[own][:2]:
                    out, done = trial, True
                    break
            if done:
                break
    return out


def _interp(m, x):
    ks = sorted(m)
    if not ks:
        return x
    if x <= ks[0]:
        return m[ks[0]] + (x - ks[0])
    if x >= ks[-1]:
        return m[ks[-1]] + (x - ks[-1])
    for a, b in zip(ks, ks[1:]):
        if a <= x <= b:
            return m[a] + (x - a) * (m[b] - m[a]) / (b - a)


class _Pt:
    def __init__(s, q):
        s.x, s.y, s.type, s.smooth = q


class _Glyph:
    def __init__(s, contours):
        s.contours = [type("C", (), {"points": [_Pt(q) for q in P]})() for P in contours]


def necks_of(contours, pinned=()):
    """The crotches of parts.joins_of that are necks: between a branch's 32 and a run-in's 54 (parts.NECK_BRANCH,
    NECK_RUN; a's bowl stroke at its stem, 58, is a stroke, as parts.EXPECT has it), and not on a pinned height
    (the figure one's flag leaves the top of its stem at the cap line)."""
    import parts as PARTS
    return [r for r in PARTS.joins_of(_Glyph(contours)) if 25 <= r[2] <= PARTS.NECK_RUN + 2 and r[1] not in pinned]


def set_necks(reg, new, v, pinned=()):
    """A crotch (where a curve leaves a stem's edge) climbs or drops along its stem until the neck, the least
    distance from the crotch to the curve facing it, is the Regular's times the hairline's growth. The curve's
    last handle moves with the crotch."""
    import parts as PARTS
    done = []
    for x, y, d, leave, flat in necks_of(reg, pinned):
        ci, i = next((ci, i) for ci, P in enumerate(reg) for i, q in enumerate(P) if q[:2] == (x, y) and q[2] and not q[3])
        P, N = reg[ci], new[ci]
        n = len(P)
        h = (i - 1) % n if P[i - 1][2] is None else (i + 1) % n
        want = d * v["neck"]
        segs = []
        for cj, Q in enumerate(new):
            for a, mid, b in segments([_Pt(q) for q in Q]):
                if mid and not (cj == ci and i in (a, b)):
                    segs.append([Q[a][:2]] + [Q[m][:2] for m in mid] + [Q[b][:2]])
        nx, ny = N[i][:2]
        rng = neck_range(P, N, i, h)
        if rng is None:
            continue
        score = lambda yy: abs(min(PARTS.neck((nx, yy), sg) for sg in segs) - want)   # noqa: E731
        if v["f"] < 0:
            # 0.81, towards the Light (which has no sparse master): a neck is a distance between a point and a
            # curve, so half way it sags off the straight line between its two values (g's ear 1.6 under at 375).
            # The crotch goes where the worse of the two misses, at the master and half way, is least: the rule
            # bold() keeps for a slanted stroke's thickness.
            half = [[((p[0] + q[0]) / 2, (p[1] + q[1]) / 2) + p[2:] for p, q in zip(Pr, Qn)] for Pr, Qn in zip(reg, new)]
            hsegs = []
            for cj, Q in enumerate(half):
                for a, mid, b in segments([_Pt(q) for q in Q]):
                    if mid and not (cj == ci and i in (a, b)):
                        hsegs.append([Q[a][:2]] + [Q[m][:2] for m in mid] + [Q[b][:2]])
            want_h = d * (1 + (v["neck"] - 1) / 2)
            score = lambda yy: max(abs(min(PARTS.neck((nx, yy), sg) for sg in segs) - want),   # noqa: E731
                                   abs(min(PARTS.neck(((x + nx) / 2, (y + yy) / 2), sg) for sg in hsegs) - want_h))
        best = min(range(max(ny - 60, rng[0]), min(ny + 60, rng[1]) + 1), key=score, default=ny)
        dy = best - ny
        N[i] = (nx, best) + N[i][2:]
        N[h] = (N[h][0], N[h][1] + dy, None, False)
        done.append((x, y, d, round(want, 1), round(min(PARTS.neck((nx, best), sg) for sg in segs), 1), dy))
    return done


def neck_range(P, N, i, h):
    """0.81: where a crotch may go: (lowest y, highest y) in the other master N. The curves on both sides of it keep
    running the way they run in the Regular: the crotch never passes the level of either neighbouring node. 0.80
    moved a comma's crotch 57 up its tail past the ball's top (the quotes' balls swallowed their crotch and the
    curve turned), and dropped glottal stop's crotch 19 under the near-level curve leaving it, which turned back."""
    n = len(P)
    lo, hi = -10 ** 6, 10 ** 6
    for step in (-1, 1):
        far = (i + step) % n
        while P[far][2] is None:
            far = (far + step) % n
        if P[far][1] < P[i][1]:
            lo = max(lo, N[far][1])
        elif P[far][1] > P[i][1]:
            hi = min(hi, N[far][1])
        else:
            lo, hi = max(lo, N[far][1]), min(hi, N[far][1])
    del h
    return (lo, hi) if lo <= hi else None


# A neck is a distance between a point and a curve that both travel in straight lines from one master to the
# other, so along the axis it sags under the straight line between its two values (g's ear: 2.6 under at weight
# 550, 6% of the neck; every other neck stays within 1.5). No place for the Bold's crotch holds both the Bold and
# the middle (the best leaves 1.7 over and 1.8 under). So a glyph whose neck sags more than MID_MISS has a third,
# sparse master at MID_WEIGHT, where the sag peaks: the instance there, with the crotch moved along its stem until
# the neck is on its target. The research report's rule: an intermediate master only where a measured residual
# exceeds tolerance, and only for the glyphs that need it.
MID_WEIGHT = 550
MID_MISS = 1.5


def mid_master(reg, new, v, pinned=None):
    """The glyph at MID_WEIGHT if it needs a master there, else None. reg, new: its two masters' contours."""
    import parts as PARTS
    stem = v["stem"]
    tm = (dict(axis_map(stem))[MID_WEIGHT] - REG_STEM) / (stem - REG_STEM)
    ys = sorted({q[1] for P in reg for q in P if q[2] is not None and not is_dot(P)})
    if pinned is None:
        pinned = {y for y in ys if y in ZONES or (min(abs(y - ys[0]), abs(y - ys[-1])) <= 1 and any(abs(y - z) <= 15 for z in ZONES))}
    M = [[(p[0] + (q[0] - p[0]) * tm, p[1] + (q[1] - p[1]) * tm, p[2], p[3]) for p, q in zip(P, Q)] for P, Q in zip(reg, new)]
    changed = False
    for x, y, d, leave, flat in necks_of(reg, pinned):
        ci, i = next((ci, i) for ci, P in enumerate(reg) for i, q in enumerate(P) if q[:2] == (x, y) and q[2] and not q[3])
        n = len(reg[ci])
        h = (i - 1) % n if reg[ci][i - 1][2] is None else (i + 1) % n
        segs = []
        for cj, Q in enumerate(M):
            for a, mid, b in segments([_Pt(q) for q in Q]):
                if mid and not (cj == ci and i in (a, b)):
                    segs.append([Q[a][:2]] + [Q[m][:2] for m in mid] + [Q[b][:2]])
        want = d * (1 + (v["neck"] - 1) * tm)
        cx, cy = M[ci][i][:2]
        got = min(PARTS.neck((cx, cy), sg) for sg in segs)
        if abs(got - want) <= MID_MISS:
            continue
        best = min(range(round(cy) - 25, round(cy) + 26), key=lambda yy: abs(min(PARTS.neck((cx, yy), sg) for sg in segs) - want))
        dy = best - cy
        M[ci][i] = (cx, best) + M[ci][i][2:]
        M[ci][h] = (M[ci][h][0], M[ci][h][1] + dy, None, False)
        changed = True
    if not changed:
        return None
    return [[(round(x), round(y), t, s_) for x, y, t, s_ in P] for P in M]


HINTS = {
    # e: the bar keeps its upper edge (the eye gives up only the hairline's gain: Georgia Pro 0.98, Serrif 0.90 of
    # its height) and thickens downward, 41 to 49 (1.02, 1.36)
    "e": {"y": [(279, 320, lambda v: 41 + 8 * v["ft"], "bar")], "ypin": [320]},
    "s": {"sub": "turn"},
}
_UNUSED = {}                        # glyph: {"x": [(a, b, target or None, kind)], "y": [...], "ypin": [y]}  (see families)


def bold(contours, width, v, name="", hints=None):
    """One glyph. contours: [[(x, y, type, smooth)]]. Returns (contours, width, report)."""
    hints = hints or HINTS.get(name, {})
    v = dict(v, sub=hints.get("sub", "loop"))
    body = [P for P in contours if not is_dot(P)]
    nodes = [q for P in body for q in P if q[2] is not None]
    if not nodes:                                              # dots only (period, colon, dieresis): each grows about
        kind = "mark" if any(k in name for k in ("dieresis", "dotaccent", "dotbelow")) else "point"   # its centre;
        r = 1 + ((BULLET if name == "bullet" else DOT_ALONE[kind]) - 1) * v["f"]   # dots side by side keep the gap between them
        boxes = [(min(q[0] for q in P), max(q[0] for q in P), min(q[1] for q in P), max(q[1] for q in P)) for P in contours]
        order = sorted(range(len(contours)), key=lambda i: boxes[i][0])
        mid = (min(b[0] for b in boxes) + max(b[1] for b in boxes)) / 2
        out, rep = [None] * len(contours), []
        cols = sorted({round((b[0] + b[1]) / 2) for b in boxes})
        for i, P in enumerate(contours):
            x0, x1, y0, y1 = boxes[i]
            d = 2 * round((x1 - x0) * r / 2)
            col = cols.index(round((x0 + x1) / 2))
            cx = round((x0 + x1) / 2 + (col - (len(cols) - 1) / 2) * (d - (x1 - x0)))
            cy = round((y0 + y1) / 2)
            mx = {x: cx - d // 2 if x == x0 else cx + d // 2 if x == x1 else cx for x in {q[0] for q in P}}
            my = {y: cy - d // 2 if y == y0 else cy + d // 2 if y == y1 else cy for y in {q[1] for q in P}}
            out[i] = carry(P, [(mx[q[0]], my[q[1]]) if q[2] is not None else None for q in P])
            rep.append((x0, x1, x1 - x0, round((x1 - x0) * r, 1), d, "dot"))
        lsb, rsb = min(b[0] for b in boxes), width - max(b[1] for b in boxes)
        left, right = min(q[0] for P in out for q in P), max(q[0] for P in out for q in P)
        dx = round(mid - (left + right) / 2) if width == 0 else round(lsb * v["bearing"]) - left
        out = [[(x + dx, y, t, s_) for x, y, t, s_ in P] for P in out]
        y0, y1 = min(b[2] for b in boxes), max(b[3] for b in boxes)
        ny = [q[1] for P in out for q in P]
        maps = {"X": {min(b[0] for b in boxes): left + dx, max(b[1] for b in boxes): right + dx}, "Y": {y0: min(ny), y1: max(ny)}}
        return out, 0 if width == 0 else right + dx + round(rsb * v["bearing"]), dict({"x": rep, "y": [], "necks": [], "where": {}}, **maps)
    xk = sorted({q[0] for q in nodes})
    yk = sorted({q[1] for q in nodes})
    pl = polys(body)
    xs, xg = read_axis(pl, xk, 1, yk[0], yk[-1])
    ys, yg = read_axis(pl, yk, 0, xk[0], xk[-1])
    caps = end_caps(body)
    for axis, found, knots_ in ((1, ys, yk), (0, xs, xk)):
        for a, b in extreme_pairs(body, pl, axis):
            if not any(abs(k[0] - a) <= 8 and abs(k[1] - b) <= 8 for k in found):
                found[(a, b)] = {"run": 0, "at": None, "straight": (False, False), "off": 0, "pair": True}
            else:                                              # the scan found it a unit off: the extremes are the edges
                for k in [k for k in found if k != (a, b) and abs(k[0] - a) <= 8 and abs(k[1] - b) <= 8 and 40 < k[1] - k[0]]:
                    found[(a, b)] = dict(found.pop(k), pair=True)
    for a, b in roots(body, pl):
        if not any(abs(k[0] - a) <= 8 and abs(k[1] - b) <= 8 for k in ys):
            ys[(a, b)] = {"run": 0, "at": None, "straight": (False, False), "off": 0, "pair": True}
    xs, same_x = one_stroke(xs)
    ys, same_y = one_stroke(ys)
    xg, same_g = one_stroke(xg)
    # serifs: a slab (a wide level span between two knots) around a thick upright stroke
    extra_x, extra_y, half = [], [], []
    stems = [(a, b) for (a, b), s in xs.items() if 64 <= b - a <= 130 and all(s["straight"])]
    for (a, b), s in xs.items():
        if b - a <= 130:
            continue
        inside = [st for st in stems if a <= st[0] and st[1] <= b]
        if not inside:
            continue
        first, last = min(inside), max(inside)
        if 8 < first[0] - a <= 130:
            extra_x.append((a, first[0], (first[0] - a) * v["foot"], "serif reach"))
        if 8 < b - last[1] <= 130:
            extra_x.append((last[1], b, (b - last[1]) * v["foot"], "serif reach"))
    for o, lo, hi in caps:
        t = hi - lo
        if o == 1 and (lo, hi) not in ys and t <= 36:
            extra_y.append((lo, hi, t * v["tip"], "end"))
    mark = mark_like = bool(hints.get("mark"))                 # a mark is too small for the ball and facing readers
    bl = [] if mark else balls(body)
    ball_knots = {k for ax, lo, hi, o, lo2, hi2 in bl for k in ((lo, hi) if ax == 1 else (lo2, hi2))}
    for key in [k for k, st in ys.items() if k[1] - k[0] >= 64 and (not st.get("pair") or set(k) & ball_knots)]:
        del ys[key]                                            # a thick level thing that is not a stroke (a ball, a blob)
    plain = bool(hints.get("upright"))                         # the fallback: upright and level parts only
    dg = [] if plain else diagonals(body, pl)
    on_straight = {q for L, R, t in dg for e in (L, R) for q in e}
    for q, o, t, kind in ([] if mark or plain else facing(body, pl)):
        if q in on_straight or (kind == "node" and o in on_straight) or (kind == "edge" and any(o in (L, R) for L, R, t in dg)):
            continue                                           # the end of a straight slanted stroke: slant_lines has it
        if kind == "node":                                     # a curved slanted stroke: its two facing nodes part
            cons, was = spine(body, q, o, v, t)
            extra_x += cons["x"]
            extra_y += cons["y"]
        else:
            half.append((q, o, t))
    for ax, lo, hi, o, lo2, hi2 in bl:
        r = sign_ratio(v) if v.get("sub") == "small sign" else 1 + (BALL - 1) * v["f"]
        (extra_x if ax == 0 else extra_y).append((lo, hi, (hi - lo) * r, "ball"))
        (extra_y if ax == 0 else extra_x).append((lo2, hi2, (hi2 - lo2) * r, "ball"))
    for up, low in hints.get("spine", []):
        cons, was = spine(body, up, low, v)
        extra_x += cons["x"]
        extra_y += cons["y"]
    for a, b, want, kind in hints.get("x", []):
        extra_x.append((a, b, want(v) if callable(want) else want, kind))
    for a, b, want, kind in hints.get("y", []):
        extra_y.append((a, b, want(v) if callable(want) else want, kind))
    for key in hints.get("not x", []):
        xs.pop(key, None)
    for key in hints.get("not y", []):
        ys.pop(key, None)
    extra_open = []
    def edge(y):                                               # the glyph's own top or bottom (or a node a unit
        return min(abs(y - yk[0]), abs(y - yk[-1])) <= 1       # inside it)
    near_zone = lambda y: any(abs(y - z) <= 15 for z in ZONES)  # noqa: E731
    pins = {y: y for y in yk if y in ZONES or (edge(y) and near_zone(y))}   # zones, and a top or bottom that is one
    if mark_like:                                              # (an overshoot). A mark's foot holds (0.99 in both
        base = yk[-1] if yk[-1] < 100 else yk[0]               # references); under the letter, its top does
        pins.update({y: y for y in yk if abs(y - base) <= 1})
    # a sign that floats (a hyphen, a plus) has no pinned edge: it grows about its middle
    pins.update({y: y for y in hints.get("ypin", [])})
    cs = corners(body)
    sp = [[], []]
    for P in body:
        on = [q for q in P if q[2] is not None]
        for a, b in zip(on, on[1:] + on[:1]):
            for ax in (0, 1):
                if a[ax] != b[ax]:
                    sp[ax].append((min(a[ax], b[ax]), max(a[ax], b[ax])))
    kx, ky = [(a, b) for ax, a, b in cs if ax == 0], [(a, b) for ax, a, b in cs if ax == 1]
    kx += same_x + same_g
    ky += same_y
    adj = _adjacent(body)
    strokes = slant_strokes(dg) if dg else []
    flats = set()
    if dg:
        lean = lambda st: math.sqrt(1 + st["m"] ** 2)          # noqa: E731
        hg = [(diag_target(st["t"], v) - st["t"]) * lean(st) for st in strokes]
        thick, thin = [g for g, st in zip(hg, strokes) if st["t"] >= 64], [g for g, st in zip(hg, strokes) if st["t"] < 64]
        lose = DIAG_INWARD * (sum(thick) / max(1, len(thick)) + sum(thin) / max(1, len(thin)))
        edges = {k for key in xs for k in key if 35 <= key[1] - key[0] <= 130}
        for (a, b) in xg:                                      # the opening between two slanted strokes (v's top,
            if a not in edges and b not in edges and b - a >= 60:   # A's foot) gives up a share of what they gain
                extra_open.append((a, b, b - a - lose))
        owner = {}
        for si, st in enumerate(strokes):
            for e in st["L"] + st["R"]:
                for q in e:
                    owner.setdefault(q, set()).add(si)
        cap = yk[-1] > 600 and name[:1].isupper()
        for q, (pv, pl_, nx, nl) in adj.items():               # the flat outside a vertex: VERTEX of the class's stem
            # round 3: a flat on a zone line is a vertex's from 8 units (whook's middle apex, 11 at the x-height,
            # turned over at 300); off the zone lines from 12 (w's inner notches, 4, are not flats)
            fl_w = abs(q[0] - nx[0])
            if nl and q[1] == nx[1] and (12 <= fl_w or (8 <= fl_w and q[1] in ZONES)) and fl_w <= 90 and q in owner and nx in owner and not (owner[q] & owner[nx]) \
                    and _outer_flat(q, nx, adj, pl):
                lo, hi = sorted((q[0], nx[0]))
                extra_x.append((lo, hi, (hi - lo) * (1 + ((148 / 86 if cap else 140 / 78) - 1) * v["f"]), "vertex flat"))
                flats |= {q, nx}
        for st, g in zip(strokes, hg):                         # a stroke's two edges where both run into a serif:
            for pick in (max, min):                            # apart by its level gain
                l = pick({q for e in st["L"] for q in e}, key=lambda q: q[1])
                r = pick({q for e in st["R"] for q in e}, key=lambda q: q[1])
                if not (adj[l][1] and adj[l][3]) and not (adj[r][1] and adj[r][3]) and l[0] < r[0]:
                    extra_x.append((l[0], r[0], (r[0] - l[0]) + g, "slanted end"))
    cx_, hx, sx = _cons(xk, xs, xg, extra_x, v, x_target, 0, kx, sp[0])
    half_rep = []
    for q, e, t in half:                                       # a node facing a straight slanted edge: its level
        (x0, y0), (x1, y1) = e                                 # distance to the edge grows by the stroke's level gain
        m = (x1 - x0) / (y1 - y0)
        al = (y1 - q[1]) / (y1 - y0)
        h = q[0] - (al * x0 + (1 - al) * x1)
        sign = 1.0 if h > 0 else -1.0
        coefs = {}
        for k, cf in ((q[0], sign), (x0, -sign * al), (x1, -sign * (1 - al))):
            coefs[k] = coefs.get(k, 0.0) + cf
        cx_.append((coefs, abs(h) + (diag_target(t, v) - t) * math.sqrt(1 + m * m), 1e3))
        half_rep.append((q, e, t))
    for a, b, want in extra_open:
        cx_.append((a, b, want, 400.0 / ((b - a) ** 2)))
        sx.append((a, b, b - a, want, "opening"))
    cy_, hy, sy = _cons(yk, ys, yg, extra_y, v, y_target, 1, ky, sp[1])
    sh = [] if plain else shallow(body, pl)
    for lo_e, up_e, t in sh:                                   # each end of each edge: its upright distance to the
        want = t * (1 + (LEVEL_THICK - 1) * v["f"]) if t >= 64 else t * (1 + (DIAG["thin_lc"] - 1) * v["ft"])
        for edge, other, sign in ((up_e, lo_e, 1.0), (lo_e, up_e, -1.0)):   # other edge grows by the stroke's gain
            (x0, y0), (x1, y1) = other
            sl = (y1 - y0) / (x1 - x0)
            for q in edge:
                al = (x1 - q[0]) / (x1 - x0)
                h = sign * (q[1] - (al * y0 + (1 - al) * y1))
                coefs = {}
                for k, cf in ((q[1], sign), (y0, -sign * al), (y1, -sign * (1 - al))):
                    coefs[k] = coefs.get(k, 0.0) + cf
                cy_.append((coefs, h + (want - t) * math.sqrt(1 + sl * sl), 1e3))
    X = {k: round(x) for k, x in solve(xk, cx_, {xk[0]: xk[0]}).items()}
    if not pins:                                               # nothing pinned: every height prefers its place, so a
        cy_ = cy_ + [({k: 1.0}, float(k), 1e-7) for k in yk]   # lone bar thickens evenly about its middle
    Y = {k: round(y) for k, y in solve(yk, cy_, pins).items()}
    rx = _exact(X, xk, hx, sx, kx, {xk[0]: xk[0]}, sp[0], 0)
    ry = _exact(Y, yk, hy, sy, ky, pins, sp[1], 1)
    for q, e, t in half_rep:
        (x0, y0), (x1, y1) = [(X[p_[0]], Y[p_[1]]) for p_ in e]
        m = (x1 - x0) / (y1 - y0)
        side = 1 if q[0] > e[0][0] + (q[1] - e[0][1]) * (e[1][0] - e[0][0]) / (e[1][1] - e[0][1]) else -1
        X[q[0]] = round(x0 + (Y[q[1]] - y0) * m + side * diag_target(t, v) * math.sqrt(1 + m * m))   # exact, whole units
        got = abs(X[q[0]] - (x0 + (Y[q[1]] - y0) * m)) / math.sqrt(1 + m * m)
        rx.append((0, 0, round(t, 1), round(diag_target(t, v), 1), round(got, 1), "diagonal"))
    for lo_e, up_e, t in sh:
        (x0, y0), (x1, y1) = [(X[p_[0]], Y[p_[1]]) for p_ in lo_e]
        sl = (y1 - y0) / (x1 - x0)
        want = t * (1 + (LEVEL_THICK - 1) * v["f"]) if t >= 64 else t * (1 + (DIAG["thin_lc"] - 1) * v["ft"])
        for q in up_e:                                         # exact, on whole units
            if q[1] not in pins:
                Y[q[1]] = round(y0 + (X[q[0]] - x0) * sl + want * math.sqrt(1 + sl * sl))
        got = [(Y[q[1]] - (y0 + (X[q[0]] - x0) * sl)) / math.sqrt(1 + sl * sl) for q in up_e]
        ry.append((0, 0, round(t, 1), round(want, 1), round(sum(got) / 2, 1), "diagonal"))
    moved_to, fork_dx = {}, 0.0
    if strokes:
        pos = {q: (X[q[0]], Y[q[1]]) for q in adj}
        for _ in range(3):                                     # a tapering stroke has its thickness where its two
            slant_lines(strokes, pos, adj, flats, v, pins)     # edges face; that place moves as its ends slide
            placed = slant_place(strokes, pos, adj, pins, handles_of(body))
            for st in strokes:
                ends = [[placed.get(q, pos[q])[1] for e in es for q in e] for es in (st["L"], st["R"])]
                lo_, hi_ = max(min(ends[0]), min(ends[1])), min(max(ends[0]), max(ends[1]))
                if hi_ > lo_ and abs(st.get("taper", 0)) > 1e-4:
                    st["ym"] = (lo_ + hi_) / 2
                # A stroke whose lean changes between the masters is not, half way, the mean of its two
                # thicknesses (x's ran 1.8 over). Its Bold thickness gives up half of that, so the worst miss
                # along the axis is least: under a unit at the Bold, under a unit half way.
                at1 = lambda q: placed.get(q, pos[q])          # noqa: E731
                half = lambda q: ((q[0] + at1(q)[0]) / 2, (q[1] + at1(q)[1]) / 2)   # noqa: E731
                was = slant_measure(st, lambda q: q)[0]
                over = slant_measure(st, half)[0] - (was + (slant_measure(st, at1)[0] - was) / 2)
                st["bias"] = st.get("bias", 0.0) - over / 2 if abs(over) > 0.3 else st.get("bias", 0.0)
        inside_flats(strokes, pos, adj, placed, pins)
        fork = fork_stem(strokes, pos, adj, placed)
        fork_dx = fork.pop("dx", 0.0)
        placed.update(fork)
        moved_to = {q: (round(x), round(y)) for q, (x, y) in placed.items()}
        serif_on_slant(strokes, adj, contours, X, Y, moved_to, v)
    lsb, rsb = xk[0], width - xk[-1]
    all_x = [q[0] for P in contours for q in P if q[2] is not None]
    lsb, rsb = min(all_x), width - max(all_x)
    out = []
    for P in contours:
        if is_dot(P):
            px, py = [q[0] for q in P], [q[1] for q in P]
            d = 2 * round((max(px) - min(px)) * v["dot"] / 2)
            c0 = (min(px) + max(px)) / 2
            near = min((k for k in xs if 64 <= k[1] - k[0] <= 130), key=lambda k: abs((k[0] + k[1]) / 2 - c0), default=None)
            cx = round((X[near[0]] + X[near[1]]) / 2 + c0 - (near[0] + near[1]) / 2) if near else round(_interp(X, c0))
            cy = round((min(py) + max(py)) / 2)                # a dot keeps its place over its stem and its height
            mx = {x: cx - d // 2 if x == min(px) else cx + d // 2 if x == max(px) else cx for x in px}
            my = {y: cy - d // 2 if y == min(py) else cy + d // 2 if y == max(py) else cy for y in py}
            out.append(carry(P, [(mx[q[0]], my[q[1]]) if q[2] is not None else None for q in P]))
            continue
        N = carry(P, [moved_to.get(q[:2], (X[q[0]], Y[q[1]])) if q[2] is not None else None for q in P])
        out.append(keep_tangents(P, N))
    necks = set_necks(contours, out, v, pins)
    out = [P_ if is_dot(P) else no_turn_back(P, no_inflection(P, straighten(no_turn_back(P, P_), P))) for P, P_ in zip(contours, out)]
    # 0.81 round 2: the last clamp can leave a smooth node off its line (g's link into its curl); its handles back
    # on one line, the curve's other handle sliding along its own direction to keep the two in order
    out = [P_ if is_dot(P) else order_handles(P, straighten(P_, P)) for P, P_ in zip(contours, out)]
    for st in strokes:                                         # each slanted stroke across itself at its middle, on
        at = lambda q: moved_to.get(q, (X[q[0]], Y[q[1]]))     # noqa: E731  the whole-unit nodes it ended on
        got, grow = slant_measure(st, at)
        was, taper = slant_measure(st, lambda q: q)
        rx.append((0, 0, round(st["t"], 1), round(st["want"], 1), round(got, 1), "diagonal"))
        if abs(grow - taper) > 1.5:
            rx.append((0, 0, round(taper, 1), round(taper, 1), round(grow, 1), "diagonal not parallel"))
    left = min(q[0] for P in out for q in P if q[2] is not None)
    right = max(q[0] for P in out for q in P if q[2] is not None)
    if width == 0:                                             # a combining mark: no advance; its middle stays
        dx = round((min(all_x) + max(all_x)) / 2 - (left + right) / 2)
    else:
        dx = round(lsb * v["bearing"]) - left
    out = [[(x + dx, y, t, s) for x, y, t, s in P] for P in out]
    where = {q: moved_to.get(q, (X[q[0]], Y[q[1]])) for q in adj}
    where = {q: (x + dx, y) for q, (x, y) in where.items()}
    new_w = 0 if width == 0 else right + dx + round(rsb * v["bearing"])
    return out, new_w, {"x": rx, "y": ry, "necks": necks, "where": where, "X": {k: x + dx for k, x in X.items()}, "Y": Y}


# 0.79: the last guard, on every outline of the Bold and of the sparse master. audit_axis.py counts, in each curve,
# the extremes and inflections the Regular's curve does not have; until 0.78 the engine's own no_inflection tried
# three shorter handles and gave up (43 glyphs kept a new inflection, W, g and x among them). The same count is
# used here as the test. A curve that fails it is brought back by the smallest of these that passes, in order:
# one handle shorter along its own direction (the tangent at the node stays), both shorter, and only at a corner
# node (which has no tangent to keep) a handle turned towards the curve's chord. Nothing is moved on a curve that
# passes, and no node moves at all.
_TT = None


def curve_turns(c):
    """(x extremes, y extremes, inflections) inside one cubic [(x, y) x 4]; None for a softened corner."""
    import numpy as np
    global _TT
    if _TT is None:
        _TT = np.linspace(0.02, 0.98, 33)[:, None]
    c = np.array(c, dtype=float)
    t = _TT
    d1 = 3 * ((1 - t) ** 2 * (c[1] - c[0]) + 2 * (1 - t) * t * (c[2] - c[1]) + t ** 2 * (c[3] - c[2]))
    d2 = 6 * ((1 - t) * (c[2] - 2 * c[1] + c[0]) + t * (c[3] - 2 * c[2] + c[1]))
    cross = d1[:, 0] * d2[:, 1] - d1[:, 1] * d2[:, 0]

    def changes(v, eps):
        s = np.sign(np.where(np.abs(v) < eps, 0, v))
        s = s[s != 0]
        return int(np.sum(s[1:] != s[:-1]))
    scale = max(1.0, float(np.abs(d1).max()))
    if float(np.abs(c[3] - c[0]).max()) < 12:
        return 0, 0, 0
    return changes(d1[:, 0], 0.01 * scale), changes(d1[:, 1], 0.01 * scale), changes(cross, 0.008 * scale * scale)


def inflection_nodes(R, N, least=0.02):
    """0.81 (integration): an S drawn with its inflection at a node (the curvature changes sign across the node: c_t's
    arc into t's stem), or a curve leaving a straight (the section's lower turn), keeps its start bending the
    Regular's way in every master. The engine moved the curve's ends by
    different rules; the curve after the node began bending the old way, so the inflection slid into it (a new
    inflection in that curve at 431 and 514). Where a curve's start (or end) bends the other way from the Regular's,
    its far handle slides along its own direction towards its node, its tangent kept, until the start bends the
    Regular's way again by the least amount (sin `least`). Returns (N', [(node, handle, share kept)])."""
    def cr(a, c):
        return a[0] * c[1] - a[1] * c[0]

    def sin_(a, c):
        return cr(a, c) / ((math.hypot(*a) * math.hypot(*c)) or 1)
    N = list(N)
    log = []

    class _Q:
        def __init__(s, q):
            s.type = q[2]
    segs = [(i, mid, j) for i, mid, j in segments([_Q(q) for q in R]) if len(mid) == 2]
    for i, (m0, m1), j in segs:
        for side in ("start", "end"):
            if side == "start":
                node, near, far, other = i, m0, m1, j
            else:
                node, near, far, other = j, m1, m0, i
            sR = sin_(_sub(R[near], R[node]), _sub(R[far], R[near])) * (1 if side == "start" else -1)
            sN = sin_(_sub(N[near], N[node]), _sub(N[far], N[near])) * (1 if side == "start" else -1)
            if abs(sR) < 1e-3 or sR * sN >= 0 or not R[node][3]:
                continue
            # the curve on the node's other side must bend the other way in the Regular: an inflection at the node
            prev = [s_ for s_ in segs if (s_[2] == node if side == "start" else s_[0] == node)]
            if not prev:                                       # a straight on the node's other side: the curve's
                n_ = len(R)                                    # end bends the Regular's way out of the straight
                other_side = R[node][2] == "line" if side == "start" else R[(node + 1) % n_][2] == "line"
                if other_side:
                    prev = None
                else:
                    continue
            if prev is None:
                so = -sR
            elif side == "start":
                pi, (pm0, pm1), pj = prev[0]
                so = sin_(_sub(R[pm1], R[pm0]), _sub(R[pj], R[pm1]))       # the curve before: its end
            else:
                pi, (pm0, pm1), pj = prev[0]
                so = sin_(_sub(R[pm0], R[pi]), _sub(R[pm1], R[pm0]))       # the curve after: its start
            if so * sR >= 0:
                continue
            base, h = N[other][:2], N[far][:2]
            best = None
            for k in range(100, 4, -1):
                cand = (round(base[0] + (h[0] - base[0]) * k / 100), round(base[1] + (h[1] - base[1]) * k / 100))
                s2 = sin_(_sub(N[near], N[node]), _sub(cand, N[near])) * (1 if side == "start" else -1)
                if s2 * sR > 0 and abs(s2) >= least:
                    best = (cand, k)
                    break
            if best:
                N[far] = best[0] + tuple(N[far][2:])
                log.append((node, far, best[1] / 100))
    return N, log


def _sub(a, c):
    return (a[0] - c[0], a[1] - c[1])


def fix_turns(R, N, at=((0.0, 1.0),), exact=True):
    """R, N: one contour in the Regular and in another master. `at`: [(u, v)] blends of R and N to test as well as N
    itself (the instances between); `exact` (0.81): every blend between R and N as well, by axis_exact's Bernstein
    test. Returns (N', fixed, left)."""
    class _Q:
        def __init__(s, q):
            s.type = q[2]
    out = list(N)
    fixed = left = 0
    n = len(R)

    def worst(i, m0, m1, j, cand):
        base = curve_turns([R[i][:2], R[m0][:2], R[m1][:2], R[j][:2]])
        if max(abs(R[j][0] - R[i][0]), abs(R[j][1] - R[i][1])) < 12:
            return 0
        over = 0
        for u, v in at:
            pts = [(R[k][0] * u + cand[k][0] * v, R[k][1] * u + cand[k][1] * v) for k in (i, m0, m1, j)]
            got = curve_turns(pts)
            over = max(over, max(g - b_ for g, b_ in zip(got, base)))
        if over <= 0 and exact:                            # 0.81 (integration): over the whole pair, not at blends
            import axis_exact as X                         # (c_t, lira, section turned at 431 to 514, t 0.08 to
            one = lambda P_: [(P_[i][0], P_[i][1], "line", False), (P_[m0][0], P_[m0][1], None, False),   # noqa: E731
                              (P_[m1][0], P_[m1][1], None, False), (P_[j][0], P_[j][1], "curve", False)]
            if [k for k, *_ in X.turns([one(R)], [one(R)], [one(cand)]) if k == 0]:
                over = 1
        return over
    for i, mid, j in segments([_Q(q) for q in R]):
        if len(mid) != 2:
            continue
        m0, m1 = mid
        if worst(i, m0, m1, j, out) <= 0:
            continue
        scales = [1.0, 0.85, 0.7, 0.55, 0.4, 0.3]
        tries = sorted(((2 - a - b_), a, b_) for a in scales for b_ in scales if (a, b_) != (1.0, 1.0))
        done = False

        def put(trial, m, own, k, deg=0.0):
            dx, dy = out[m][0] - out[own][0], out[m][1] - out[own][1]
            if deg:
                ca, sa = math.cos(math.radians(deg)), math.sin(math.radians(deg))
                dx, dy = dx * ca - dy * sa, dx * sa + dy * ca
            x, y = round(out[own][0] + dx * k), round(out[own][1] + dy * k)
            if (x, y) == tuple(out[own][:2]):
                return False
            trial[m] = (x, y, None, False)
            return True
        for _cost, a, b_ in tries:
            trial = list(out)
            if put(trial, m0, i, a) and put(trial, m1, j, b_) and worst(i, m0, m1, j, trial) <= 0:
                out, done = trial, True
                break
        if not done:
            # a corner has no tangent to keep: its handle may turn, and take a length that is a share of the chord
            # (a handle left one unit long cannot be turned). A smooth node between two curves may turn too, both
            # its handles together, if the curve on its other side keeps its own turns.
            chord = math.hypot(out[j][0] - out[i][0], out[j][1] - out[i][1])
            prev_seg = (i - 3) % n if R[i - 1][2] is None and R[(i - 2) % n][2] is None and R[(i - 3) % n][2] is not None else None
            next_seg = j if R[(j + 1) % n][2] is None and R[(j + 2) % n][2] is None and R[(j + 3) % n][2] is not None else None
            kind_i = "corner" if not R[i][3] else ("smooth" if prev_seg is not None else None)
            kind_j = "corner" if not R[j][3] else ("smooth" if next_seg is not None else None)
            angles = [0.0] + [s * d for d in (4, 8, 12, 16, 22, 30, 40) for s in (1, -1)]
            best = None

            def turned(trial, m, own, deg, length=None):
                dx, dy = out[m][0] - out[own][0], out[m][1] - out[own][1]
                L = math.hypot(dx, dy)
                if L < 0.5:
                    return False
                ca, sa = math.cos(math.radians(deg)), math.sin(math.radians(deg))
                dx, dy = dx * ca - dy * sa, dx * sa + dy * ca
                k = (length / L) if length else 1.0
                x, y = round(out[own][0] + dx * k), round(out[own][1] + dy * k)
                if (x, y) == tuple(out[own][:2]):
                    return False
                trial[m] = (x, y, None, False)
                return True
            for da in (angles if kind_i else [0.0]):
                for db in (angles if kind_j else [0.0]):
                    if not da and not db:
                        continue
                    for share in (None, 0.33, 0.2, 0.45):
                        trial = list(out)
                        ok = turned(trial, m0, i, da, share and share * chord if kind_i == "corner" else None) and \
                            turned(trial, m1, j, db, share and share * chord if kind_j == "corner" else None)
                        if ok and da and kind_i == "smooth":
                            ok = turned(trial, (i - 1) % n, i, da) and worst(prev_seg, (prev_seg + 1) % n, (prev_seg + 2) % n, i, trial) <= 0
                        if ok and db and kind_j == "smooth":
                            ok = turned(trial, (j + 1) % n, j, db) and worst(j, (j + 1) % n, (j + 2) % n, (j + 3) % n, trial) <= 0
                        if ok and worst(i, m0, m1, j, trial) <= 0:
                            cost = abs(da) + abs(db) + (8 if share else 0)
                            if best is None or cost < best[0]:
                                best = (cost, trial)
            if best:
                out, done = best[1], True
        fixed += done
        left += not done
    return out, fixed, left


def keep_apart(R, N, ratio, least):
    """Contours standing side by side: per-contour x shifts that keep each neighbouring pair's white at
    max(least, the Regular's x ratio), or None when nothing needs to move."""
    def box(P):
        xs, ys = [q[0] for q in P], [q[1] for q in P]
        return min(xs), min(ys), max(xs), max(ys)
    rb = [box(P) for P in R]
    # islands: a contour inside another's box belongs to it
    owner = list(range(len(R)))
    for i, a in enumerate(rb):
        for j, c in enumerate(rb):
            if i != j and c[0] <= a[0] and c[1] <= a[1] and c[2] >= a[2] and c[3] >= a[3]:
                owner[i] = owner[j]
    isl = sorted(set(owner), key=lambda k: (rb[k][0] + rb[k][2]) / 2)
    if len(isl) < 2:
        return None

    def gap(A, C, dx=0.0):
        pa, pc = np.array(_flat8([A])[0]), np.array(_flat8([C])[0]) + np.array([dx, 0.0])
        d = np.hypot(pa[:, None, 0] - pc[None, :, 0], pa[:, None, 1] - pc[None, :, 1])
        return float(d.min())

    def crosses(A, C, dx):
        pa, pc = np.array(_flat8([A])[0]), np.array(_flat8([C])[0]) + np.array([dx, 0.0])
        return bool(pc[:, 0].min() < pa[:, 0].max() - 0.5 and _poly_hit(pa, pc))
    shifts, total = [0] * len(R), 0
    for a, c in zip(isl, isl[1:]):
        ba, bc_ = rb[a], rb[c]
        if min(ba[3], bc_[3]) - max(ba[1], bc_[1]) <= 0:
            continue                                           # one over the other: not side by side
        if min(ba[2], bc_[2]) - max(ba[0], bc_[0]) > 0 and crosses(R[a], R[c], 0):
            continue                                           # lapped in the Regular: not this rule's
        # 0.81: two inks side by side whose boxes lap (the two wedges of the capital double acute, each leaning
        # over the other's foot) are side by side as much as two whose boxes do not (0.80 skipped them: the
        # wedges ran into each other from 550)
        g0 = gap(R[a], R[c])
        want = least(g0) if callable(least) else min(least, g0)   # round 3: the white law, towards the Bold
        dx = 0
        while (crosses(N[a], N[c], dx) or gap(N[a], N[c], dx) < want - 0.5) and dx < 200:
            dx += 1
        if dx:
            total += dx
        for k in range(len(R)):
            if owner[k] == c or (rb[owner[k]][0] + rb[owner[k]][2]) / 2 > (bc_[0] + bc_[2]) / 2:
                shifts[k] += dx
    return (shifts, total) if total else None


def _poly_hit(pa, pc):
    """Do two closed polylines cross?"""
    S1, S2 = np.hstack([pa, np.roll(pa, -1, axis=0)]), np.hstack([pc, np.roll(pc, -1, axis=0)])
    ax, ay, bx, by = [S1[:, k][:, None] for k in range(4)]
    cx, cy, dx, dy = [S2[:, k][None, :] for k in range(4)]

    def o(px, py, qx, qy, rx, ry):
        return (qx - px) * (ry - py) - (qy - py) * (rx - px)
    return bool(((o(ax, ay, bx, by, cx, cy) * o(ax, ay, bx, by, dx, dy) < 0) & (o(cx, cy, dx, dy, ax, ay) * o(cx, cy, dx, dy, bx, by) < 0)).any())


def glyph_contours(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


# ---------------------------------------------------------------- is a Bold glyph a sound second master?

def _dir(a, b):
    d = (b[0] - a[0], b[1] - a[1])
    n = math.hypot(*d)
    return (d[0] / n, d[1] / n) if n else None


def sound(reg, new):
    """What must hold between a glyph's two masters, on the points: the same point types; at a smooth node the Bold
    bends no more than the Regular (beyond what whole units force: a handle one unit off its line); no handle on
    its node; no curve turned back where the Regular's runs one way; and the instance half way bends at no smooth
    node by more than 1.5 degrees. Returns [failures]."""
    class _Q:
        def __init__(s, q):
            s.type = q[2]
    errs = []
    if [[q[2] for q in P] for P in reg] != [[q[2] for q in P] for P in new]:
        return ["not the Regular's points"]
    xs = [q[0] for R in reg for q in R]
    shift = min(q[0] for B_ in new for q in B_) - min(xs)      # the side bearing's change is not a move
    for R, B_ in zip(reg, new):
        P, N = [q[:2] for q in R], [q[:2] for q in B_]
        far = max((max(abs(b[0] - shift - a[0]) / 320, abs(b[1] - a[1]) / 140), a, b) for a, b in zip(P, N))
        if far[0] > 1:                                         # no rule moves a point this far: the widest letter gains
            errs.append(f"node {far[1]} went to {far[2]}")     # under 200 across, a slid vertex under 110 in height
        M = [((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) for a, b in zip(P, N)]
        m = len(P)
        for i, q in enumerate(R):
            if q[2] is None or not q[3] or min(math.dist(P[i - 1], P[i]), math.dist(P[i], P[(i + 1) % m])) < 5:
                continue
            bend = []
            for A in (P, N, M):
                din, dout = _dir(A[i - 1], A[i]), _dir(A[i], A[(i + 1) % m])
                sn = min(1, abs(din[0] * dout[1] - din[1] * dout[0])) if din and dout else None
                bend.append((sn, min(math.dist(A[i - 1], A[i]), math.dist(A[i], A[(i + 1) % m]))))
            if bend[1][0] is None:
                errs.append(f"node {N[i]}: a handle sits on its node")
                continue
            deg = [math.degrees(math.asin(b[0])) if b[0] is not None else 0 for b in bend]
            if deg[1] > deg[0] + 1.0 and bend[1][0] * bend[1][1] > 0.8:
                errs.append(f"node {N[i]} bends {deg[1]:.1f} deg (regular {deg[0]:.1f})")
            if deg[2] > 1.5 and bend[2][0] * bend[2][1] > 0.8:
                errs.append(f"node {N[i]} bends {deg[2]:.1f} deg half way")
        for i, mid, j in segments([_Q(q) for q in R]):
            for ax in (0, 1):
                back = []
                for A in (P, N):
                    pts = [A[i]] + [A[k] for k in mid] + [A[j]]
                    d = [b - a for a, b in zip([p_[ax] for p_ in pts], [p_[ax] for p_ in pts][1:])]
                    back.append(any(x > 0 for x in d) and any(x < 0 for x in d))
                if back[1] and not back[0]:
                    errs.append(f"curve from {N[i]} turns back on {'xy'[ax]}")
    return errs


# ---------------------------------------------------------------- marks, anchors, composites: the whole master

# A mark whose strokes cannot be read (a wedge: acute, circumflex) grows by what the references' marks grow, Bold
# over Regular, in width and in height (bold_parts.py; Georgia Pro, Serrif, their mean). Its foot keeps its height
# (marks' bottoms: 0.99 in both). Kinds not read in the references take the nearest kind's: breve and the chevrons
# (guillemets, the ASCII circumflex) the circumflex's, hungarumlaut and double grave the acute's.
MARK = {"acute": (1.35, 1.07), "grave": (1.35, 1.07),          # width 1.27, 1.43; height 1.04, 1.10
        "circumflex": (1.15, 1.07), "caron": (1.15, 1.07),     # 1.13, 1.18; 1.04, 1.10
        "tilde": (1.15, 1.23),                                 # 1.16, 1.14; 1.20, 1.27
        "macron": (1.10, 1.40),                                # 1.09, 1.12; 1.19, 1.60
        "ring": (1.13, 1.09),                                  # 1.07, 1.18; 1.03, 1.15
        "cedilla": (1.14, 1.00)}                               # 1.10, 1.18; 0.99, 1.00
MARK_KIN = {"hungarumlaut": "acute", "dblgrave": "acute", "breve": "circumflex", "guil": "circumflex",
            "asciicircum": "circumflex", "ogonek": "cedilla", "hookabove": "ring", "horn": "cedilla"}


def mark_kind(name):
    for k in list(MARK) + list(MARK_KIN):
        if name.startswith(k):
            return MARK_KIN.get(k, k)
    return None


def straighten(P, reg=None):
    """After whole units: at a smooth node, a handle goes back onto the line of what is across the node from it:
    the longer handle, or a straight edge (a stretched or carried curve keeps them on one line; rounding each point
    on its own does not). With `reg`, only where the Regular's are on one line and the Bold's are more than a unit
    off."""
    out = list(P)
    n = len(P)
    for i, q in enumerate(P):
        a, b = P[i - 1], P[(i + 1) % n]
        if q[2] is None or not q[3] or (a[2] is not None and b[2] is not None):
            continue
        da, db = _dir(a[:2], q[:2]), _dir(q[:2], b[:2])
        if not (da and db):
            continue
        la, lb = math.dist(a[:2], q[:2]), math.dist(b[:2], q[:2])
        if min(la, lb) < 5 or abs(da[0] * db[1] - da[1] * db[0]) * min(la, lb) <= 0.8:
            continue
        if reg is not None:
            ra, rb = _dir(reg[i - 1][:2], reg[i][:2]), _dir(reg[i][:2], reg[(i + 1) % n][:2])
            if not (ra and rb) or abs(ra[0] * rb[1] - ra[1] * rb[0]) > 0.05:
                continue
        if a[2] is not None:                                   # a straight edge comes in: the handle out follows it
            fixed, hi, k = a, (i + 1) % n, lb
        elif b[2] is not None:
            fixed, hi, k = b, i - 1, la
        else:
            fixed, hi, k = (a, (i + 1) % n, lb) if la >= lb else (b, i - 1, la)
        L = math.dist(fixed[:2], q[:2])
        u = ((q[0] - fixed[0]) / L, (q[1] - fixed[1]) / L)
        out[hi] = (round(q[0] + u[0] * k), round(q[1] + u[1] * k), None, False)
    return out


# The same marks' mean stroke (2 x area / outline length), Bold over Regular: what the stretch alone does not reach.
MARK_STROKE = {"acute": 1.35, "grave": 1.35,                   # 1.28, 1.41; 1.28, 1.42
               "circumflex": 1.37, "caron": 1.37,              # 1.32, 1.41
               "tilde": 1.42, "macron": 1.34, "ring": 1.28, "cedilla": 1.26}   # 1.32, 1.53; 1.18, 1.50; 1.13, 1.43; 1.18, 1.33


def mean_stroke(contours):
    area = length = 0.0
    for p in polys(contours, 2):
        area += sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p))) / 2
        length += sum(math.dist(p[i], p[(i + 1) % len(p)]) for i in range(len(p)))
    return 2 * abs(area) / length


def swell(P, d):
    """Every node of one outline moved outward by d along its normal (at a corner, along the bisector, as far as
    keeps both edges d out, at most 2 d); each handle goes with its node, so every tangent keeps its direction."""
    n = len(P)
    area = sum(P[i][0] * P[(i + 1) % n][1] - P[(i + 1) % n][0] * P[i][1] for i in range(n))
    sgn = 1.0 if area > 0 else -1.0
    move = {}
    for i, q in enumerate(P):
        if q[2] is None:
            continue
        a, b = P[i - 1], P[(i + 1) % n]
        din, dout = _dir(a[:2], q[:2]), _dir(q[:2], b[:2])
        if not din or not dout:
            din = dout = din or dout
        nin, nout = (din[1] * sgn, -din[0] * sgn), (dout[1] * sgn, -dout[0] * sgn)
        bis = (nin[0] + nout[0], nin[1] + nout[1])
        L = math.hypot(*bis)
        if L < 1e-6:
            bis, k = nin, 1.0
        else:
            bis = (bis[0] / L, bis[1] / L)
            k = min(2.0, 1.0 / max(1e-6, bis[0] * nin[0] + bis[1] * nin[1]))
        move[i] = (bis[0] * d * k, bis[1] * d * k)
    out = []
    for i, q in enumerate(P):
        if q[2] is not None:
            m = move[i]
        else:                                                  # a handle: with the node it belongs to
            m = move[i - 1] if P[i - 1][2] is not None else move[(i + 1) % n]
        out.append((q[0] + m[0], q[1] + m[1], q[2], q[3]))
    return out


def thinnest(polys, step=4):
    """The thinnest cut that is a stroke: an ink span whose neighbours two scan lines before and two after are
    spans of about the same width over the same place (a sliver at a curve's extreme or a wedge's tip is not one)."""
    best = None
    pts = [q for p in polys for q in p]
    for ax in (0, 1):
        lo, hi = min(q[ax] for q in pts), max(q[ax] for q in pts)
        rows = []
        v = lo + step / 2
        while v < hi:
            rows.append(scan(polys, v, ax))
            v += step
        for k in range(2, len(rows) - 2):
            for a, b in rows[k]:
                w = b - a
                if best is not None and w >= best:
                    continue
                if all(any(min(b, d) - max(a, c) > 0.5 * w and abs((d - c) - w) <= 0.2 * w + 2 for c, d in rows[j])
                       for j in (k - 2, k - 1, k + 1, k + 2)):
                    best = w
    return best


def _flat8(contours, n=8):
    class _Q:
        def __init__(s, q):
            s.type = q[2]
    out = []
    for P in contours:
        pts = []
        for i, mid, j in segments([_Q(q) for q in P]):
            if len(mid) == 2:
                c = [P[i][:2], P[mid[0]][:2], P[mid[1]][:2], P[j][:2]]
                pts += [_bez(c, k / n) for k in range(n)]
            else:
                pts.append(P[i][:2])
        if len(pts) > 2:
            out.append(pts)
    return out


def stretch(contours, width, kind, v, below=False):
    """A mark with no stroke read (a wedge, a wave): it reaches its kind's measured width, height and mean stroke.
    Wider and taller by the measured ratios, about its middle, from its foot (from its top when it hangs below the
    letter); and, since that alone leaves the stroke short (1.1 to 1.2 where the references have 1.35 to 1.42),
    swollen outward evenly until the mean stroke is the measured one, inside the same measured box."""
    rw, rh = (1 + (r - 1) * v["f"] for r in MARK[kind])
    xs = [q[0] for P in contours for q in P]
    ys = [q[1] for P in contours for q in P]
    cx, base = (min(xs) + max(xs)) / 2, (max(ys) if below else min(ys))
    W_, H_ = (max(xs) - min(xs)) * rw, (max(ys) - min(ys)) * rh
    want = mean_stroke(contours) * (1 + (MARK_STROKE[kind] - 1) * v["f"])

    def fit(cs):                                               # into the measured box
        x0, x1 = min(q[0] for P in cs for q in P if q[2]), max(q[0] for P in cs for q in P if q[2])
        y0, y1 = min(q[1] for P in cs for q in P if q[2]), max(q[1] for P in cs for q in P if q[2])
        sx, sy = W_ / (x1 - x0), H_ / (y1 - y0)
        yb = base - H_ if below else base
        out_ = [[(cx - W_ / 2 + (x - x0) * sx, yb + (y - y0) * sy, t, s_) for x, y, t, s_ in P] for P in cs]
        # 0.81: the nodes a mark stands on (its foot: every node on its bottom in the Regular, its top when it hangs
        # below) stay on that line. The swell moves a corner along its bisector, further at an acute corner than an
        # obtuse one, so a level cut at an arm's end tilted and the arm ended in a sliver (acute 27 > 24).
        for ci, idx in foot:
            P = out_[ci]
            for i in idx:
                dy = base - P[i][1]
                for k in (i - 1, i, (i + 1) % len(P)):
                    if k == i or P[k][2] is None:
                        P[k] = (P[k][0], P[k][1] + dy) + P[k][2:]
        return out_
    foot = [(ci, [i for i, q in enumerate(P) if q[2] is not None and q[1] == base]) for ci, P in enumerate(contours)]
    cur = fit([list(P) for P in contours])
    # 0.79: the swell goes in steps of at most 1.5 units. Taken in one step, the capital breves' tips folded over
    # (their box is small for their stroke): mean stroke 55.8 for 64.2, thinner than the Regular at the tips, and
    # lighter at 700 than at 650. In steps they reach 60.3 with nothing under the Regular's thinnest cut.
    # 0.80, towards the Light: taking ink off evenly thins a tapered end by more than its share (a breve's ends
    # 32 > 20 at 300 where a serif's tip goes 30 > 24). A mark stops thinning when its thinnest cut would pass
    # under the Regular's thinnest cut times the tip's ratio.
    floor = None
    if v["f"] < 0:
        th0 = thinnest(_flat8(contours))
        floor = th0 * v["tip"] if th0 is not None else None
    if v["f"] > 0:
        cur = _swell_into_box(contours, W_, H_, want, cx, base, below, foot)
    for _ in range(0 if v["f"] > 0 else 60):
        d = (want - mean_stroke(cur)) / 2
        if abs(d) < 0.05:
            break
        nxt = fit([swell(P, max(-1.5, min(1.5, d))) for P in cur])
        if floor is not None:
            th = thinnest(_flat8(nxt))
            if th is not None and th < floor:
                break
        cur = nxt
    out = [straighten(no_turn_back(R, [(round(x), round(y), t, s_) for x, y, t, s_ in P]), R) for P, R in zip(cur, contours)]
    lsb, rsb = min(xs), width - max(xs)
    left, right = min(q[0] for P in out for q in P if q[2]), max(q[0] for P in out for q in P if q[2])
    dx = 0 if width == 0 else round(lsb * v["bearing"]) - left
    out = [[(x + dx, y, t, s_) for x, y, t, s_ in P] for P in out]
    ny = [q[1] for P in out for q in P if q[2]]
    rep = {"x": [(min(xs), max(xs), max(xs) - min(xs), W_, right - left, "mark width")],
           "y": [(min(ys), max(ys), max(ys) - min(ys), H_, max(ny) - min(ny), "mark height"),
                 (0, 0, round(mean_stroke(contours), 1), want, round(mean_stroke(out), 1), "mark stroke")],
           "necks": [], "where": {}, "X": {min(xs): left + dx, max(xs): right + dx}, "Y": {min(ys): min(ny), max(ys): max(ny)}}
    return out, 0 if width == 0 else right + dx + round(rsb * v["bearing"]), rep


def order_handles(P, N):
    """0.81: where a curve that runs one way on an axis in the Regular has its two handles out of order (one was
    turned back onto its node's line), the other handle slides along its own direction, towards its own node,
    until they are in order: no tangent changes (g's link into its curl, 2 units apart in the Regular)."""
    class _Q:
        def __init__(s, q):
            s.type = q[2]
    out = list(N)
    for i, mid, j in segments([_Q(q) for q in P]):
        if len(mid) != 2:
            continue
        for ax in (0, 1):
            reg = [P[i][ax], P[mid[0]][ax], P[mid[1]][ax], P[j][ax]]
            d = [b - a for a, b in zip(reg, reg[1:])]
            if any(x > 0 for x in d) and any(x < 0 for x in d):
                continue
            run = out[j][ax] - out[i][ax]
            h1, h2 = out[mid[0]], out[mid[1]]
            if run * (h2[ax] - h1[ax]) >= 0:
                continue
            dv = (h2[0] - out[j][0], h2[1] - out[j][1])
            if abs(dv[ax]) < 1e-9:
                continue
            k = (h1[ax] - out[j][ax]) / dv[ax]
            if 0 < k < 1:
                out[mid[1]] = (round(out[j][0] + dv[0] * k), round(out[j][1] + dv[1] * k), None, False)
    return out


def _swell_into_box(contours, W_, H_, want, cx, base, below, foot):
    """0.81, a wedge mark towards the Bold: its outline is carried into a box that, once the outline has swollen
    about it by d, is the measured box; d is what brings the mean stroke to its measured value. The stroke is
    swollen last and never pressed back into the box (0.80 swelled, then fitted the swollen outline into the box,
    which pressed every stroke across itself: an acute's thin end 27 > 24, a circumflex's arm's end to a sliver).
    The foot stays on its line. Returns float contours."""
    xs = [q[0] for P in contours for q in P if q[2]]
    ys = [q[1] for P in contours for q in P if q[2]]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    top = y0 if below else y1
    head = [(ci, [i for i, q in enumerate(P) if q[2] is not None and q[1] == top
                  and any(P[k][2] == "line" and P[k][1] == top for k in ((i + 1) % len(P), i - 1))]) for ci, P in enumerate(contours)]

    def place(Wi, Hi, d):
        sx, sy = Wi / (x1 - x0), Hi / (y1 - y0)
        sc = [[(cx + (x - (x0 + x1) / 2) * sx, (base - (y1 - y) * sy) if below else (base + (y - y0) * sy), t, s_)
               for x, y, t, s_ in P] for P in contours]
        sw = [swell(P, d) for P in sc]
        nx = [q[0] for P in sw for q in P if q[2]]
        ny = [q[1] for P in sw for q in P if q[2]]
        dx, dy = cx - (min(nx) + max(nx)) / 2, (base - max(ny)) if below else (base - min(ny))
        out_ = [[(x + dx, y + dy, t, s_) for x, y, t, s_ in P] for P in sw]
        for ci, idx in foot:                                   # the foot on its line, handles with their node
            P = out_[ci]
            for i in idx:
                e = base - P[i][1]
                for k in (i - 1, i, (i + 1) % len(P)):
                    if k == i or P[k][2] is None:
                        P[k] = (P[k][0], P[k][1] + e) + P[k][2:]
        far = min(q[1] for P in out_ for q in P if q[2]) if below else max(q[1] for P in out_ for q in P if q[2])
        for ci, idx in head:                                   # and the cuts on its far side stay level too
            P = out_[ci]
            for i in idx:
                e = far - P[i][1]
                for k in (i - 1, i, (i + 1) % len(P)):
                    if k == i or P[k][2] is None:
                        P[k] = (P[k][0], P[k][1] + e) + P[k][2:]
        return out_
    Wi, Hi, d = W_, H_, 0.0
    cur = place(Wi, Hi, d)
    for _ in range(40):
        nx = [q[0] for P in cur for q in P if q[2]]
        ny = [q[1] for P in cur for q in P if q[2]]
        ew, eh, em = W_ - (max(nx) - min(nx)), H_ - (max(ny) - min(ny)), want - mean_stroke(cur)
        if abs(ew) < 0.2 and abs(eh) < 0.2 and abs(em) < 0.05:
            break
        Wi, Hi, d = max(10.0, Wi + ew), max(10.0, Hi + eh), d + em / 2
        cur = place(Wi, Hi, d)
    return cur


def is_mark(g):
    return any(a.name.startswith("_") for a in g.anchors) or mark_kind(g.name) is not None and not g.name[0].isupper() \
        and g.name.split(".")[0] in ("acute", "grave", "circumflex", "caron", "tilde", "macron", "ring", "cedilla", "breve",
                                      "hungarumlaut", "ogonek", "dieresis", "dotaccent")


def glyph_bold(g, v):
    """A glyph's own outline in the Bold: (contours, width, report)."""
    c = glyph_contours(g)
    mark = is_mark(g)
    hints = dict(HINTS.get(g.name, {}), mark=True) if mark else None
    import unicodedata
    cat = unicodedata.category(chr(g.unicodes[0])) if g.unicodes else ("L" if g.name.split(".")[0].split("_")[0] in ("f", "c", "s", "t") or g.name[:1].isalpha() and len(g.name.split(".")[0]) == 1 else "")
    if not mark and cat[:1] in ("P", "S") and g.name not in HINTS:
        hints = {"sub": "small sign" if g.name in SMALL_SIGNS else "sign"}   # punctuation and symbols: a sign's strokes
    out, w, rep = bold(c, g.width, v, g.name, hints)
    folded = lambda r: any(row[5] == "turned over" for row in r.get("x", []) + r.get("y", []))   # noqa: E731
    if folded(rep) and mark and mark_kind(g.name):
        return stretch(c, g.width, mark_kind(g.name), v, below=max(q[1] for P in c for q in P) < 100)
    if sound(c, out) and not folded(rep) and all("bends" in e for e in sound(c, out)):
        # 0.81: a smooth node left off its line by the last whole-unit clamp: its handles back on one line
        out2 = [order_handles(R, straighten(N, R)) for R, N in zip(c, out)]
        if not sound(c, out2):
            out = out2
    if sound(c, out) or folded(rep):                           # not a sound second master: upright and level parts
        first = sound(c, out) or ["a piece of outline turned over"]   # only, and said so; failing that, the Regular's
        out, w, rep = bold(c, g.width, v, g.name, dict(hints or HINTS.get(g.name, {}), upright=True))
        rep["fallback"] = "upright parts only (" + first[0] + ")"
        if sound(c, out) or folded(rep):
            xs_ = [q[0] for P in c for q in P]
            rep = {"x": [], "y": [], "necks": [], "where": {}, "X": {min(xs_): min(xs_), max(xs_): max(xs_)}, "Y": {},
                   "fallback": "left as the Regular (" + (sound(c, out) or ["a piece of outline turned over"])[0] + ")"}
            out, w = c, g.width
    kind = None if g.name.startswith("caroncomb.alt") else mark_kind(g.name)   # the apostrophe caron is a comma, not a wedge
    wedge = kind in ("acute", "circumflex", "tilde") or (kind == "grave")
    if kind and (wedge or (not rep.get("x") and not rep.get("y"))) and any(q[2] is not None for P in c for q in P if not is_dot(P)):
        ys = [q[1] for P in c for q in P]
        so, sw, srep = stretch(c, g.width, kind, v, below=max(ys) < 100)
        if not sound(c, so):
            return so, sw, srep
        rep["fallback"] = "the engine's reading, not its kind's measured box (" + sound(c, so)[0] + ")"
    return out, w, rep


# Side bearings (tools/weight/bold_bearings.py > bold_bearings.json). spacing.py sets the Regular's from Georgia
# Pro's, read in each letter's own zone to the outermost ink. The Bold's are the Regular's plus what the two
# references change, Bold less Regular, read the same way (mean of Georgia Pro and Serrif, per letter and side;
# -6.0 a side on average in the lowercase, -5.7 in the capitals, -0.9 in the figures), scaled by how much ink Area
# adds beside them (its stem gains 62 where theirs gain 75). Every other glyph takes the letters' mean.
BEARING_SCALE = 62 / 75
BEARING_REST = -5.9                        # the mean of the lowercase's -6.0 and the capitals' -5.7
SPACE = 0.98                               # the word space, Bold over Regular: Georgia Pro 1.05, Serrif 0.91
_CHARS = {"zero": "0", "one": "1", "two": "2", "three": "3", "four": "4", "five": "5", "six": "6", "seven": "7",
          "eight": "8", "nine": "9", "period": ".", "comma": ",", "hyphen": "-", "quotesingle": "'", "colon": ":",
          "semicolon": ";", "exclam": "!", "question": "?", "endash": "\u2013", "emdash": "\u2014", "quotedbl": '"',
          "quoteleft": "\u2018", "quoteright": "\u2019", "quotedblleft": "\u201c", "quotedblright": "\u201d",
          "parenleft": "(", "parenright": ")", "slash": "/"}


def _zone_edges(contours, name):
    """(leftmost, rightmost) ink: in the letter's zone for a letter or a figure, of the whole glyph otherwise."""
    pl = polys(contours, 3)
    if len(name) == 1 and name.isalpha() or name in _CHARS and _CHARS[name].isdigit():
        top = 520 if name.islower() and len(name) == 1 else 712
        lo = hi = None
        for y in range(10, top - 9, 10):
            sp = scan(pl, y, 1)
            if sp:
                lo = sp[0][0] if lo is None else min(lo, sp[0][0])
                hi = sp[-1][1] if hi is None else max(hi, sp[-1][1])
        if lo is not None:
            return lo, hi
    xs = [x for p in pl for x, y in p]
    return min(xs), max(xs)


_BEARINGS = None


def bearing_change(name, v):
    global _BEARINGS
    if _BEARINGS is None:
        import json
        import os
        _BEARINGS = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "bold_bearings.json")))
    ch = name if len(name) == 1 else _CHARS.get(name)
    if v["f"] < 0:                                             # 0.81: the Light's own change where it is measured
        lb = light_bearings()
        if ch in lb:
            return lb[ch]
    d = _BEARINGS.get(ch, [BEARING_REST, BEARING_REST])
    return d[0] * BEARING_SCALE * v["f"], d[1] * BEARING_SCALE * v["f"]


# The Light's side bearings (0.81). 0.80 ran the Bold's measured change backwards (bold_bearings.json times
# vector(55)'s f, -0.371): +1.8 a side in the lowercase, +1.7 in the capitals. The references' own Light (Georgia Pro
# Light and Serrif 300 less their Regular, per letter and side, times Area's stem loss over theirs, 0.836:
# tools/weight/bold_bearings.py light) open +2.3 and +2.9, most on the right of the open and diagonal letters (v w y
# K N U W +5 to +10 where the extrapolation gave +1). light_bearings.json holds that change in Area's units, applied
# as is: {"sides": {character: [left, right]}, "scale": 0.836, "note": ...}. A glyph whose character it does not name
# keeps the Bold's change run backwards. One path: bearing_change, for every master (kerning-0.81.md).
LIGHT_BEARINGS = "light_bearings.json"
_LIGHT_BEARINGS = None


def light_bearings():
    """{character: (left change, right change)} from light_bearings.json's "sides" ({} when the file is absent)."""
    global _LIGHT_BEARINGS
    if _LIGHT_BEARINGS is None:
        import json
        import os
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), LIGHT_BEARINGS)
        sides = json.load(open(path))["sides"] if os.path.exists(path) else {}
        _LIGHT_BEARINGS = {ch: (float(d[0]), float(d[1])) for ch, d in sides.items()}
    return _LIGHT_BEARINGS


# 0.81 (integration): a mirrored pair is one drawing. In the Regular the right-hand form of a pair is the left-hand
# form turned over, point for point (charset.mirrors: ( [ { « ‹ <; the tab arrow; erase to the right). The engine
# read the two forms each on its own, and its readings differed: ⇥ crossed itself at 300 where ⇤ did not. In every
# master the right-hand form is now the master's left-hand form turned over, by the same correspondence of points
# the Regular has; its sides stay its own (bearing_change: light_bearings.json names ( and ) apart). The pairs are
# charset.MIRRORS (the left-hand form is drawn); a pair whose Regular forms are not each other's mirror within half a
# unit is not one drawing and is left alone (mirror_pairs lists only the ones that are).
def _mirror_map(A, Bc):
    """Contours A turned over (x -> -x, each contour's points in reverse order) matched to Bc point for point up to
    one shift in x: [(contour of A, start offset)] for each contour of Bc, or None."""
    if sorted(len(P) for P in A) != sorted(len(P) for P in Bc):
        return None
    xa = [q[0] for P in A for q in P]
    xb = [q[0] for P in Bc for q in P]
    dx = (min(xb) + max(xb) + min(xa) + max(xa)) / 2       # -x + dx carries A's ink onto B's
    out, used = [], set()
    for P in Bc:
        n, hit = len(P), None
        for ci, Q in enumerate(A):
            if ci in used or len(Q) != n:
                continue
            rev = list(reversed(Q))
            for k in range(n):
                if all(abs(dx - rev[(k + m) % n][0] - P[m][0]) <= 0.5 and abs(rev[(k + m) % n][1] - P[m][1]) <= 0.5
                       for m in range(n)):
                    hit = (ci, k)
                    break
            if hit:
                break
        if hit is None:
            return None
        used.add(hit[0])
        out.append(hit)
    return out


def mirror_pairs(reg):
    """[(left form, right form, map)] for charset.MIRRORS, each pair whose Regular forms are one drawing turned over
    (point for point, within half a unit)."""
    import charset as CHARSET
    out = []
    for a, b in CHARSET.MIRRORS:
        a, b = CHARSET._name(reg, a), CHARSET._name(reg, b)
        if a in reg and b in reg and reg[a].contours and reg[b].contours and not reg[a].components:
            m = _mirror_map(glyph_contours(reg[a]), glyph_contours(reg[b]))
            if m is not None:
                out.append((a, b, m))
    return out


def turn_over(A, width, mapping, types_of):
    """The right-hand form from a master's left-hand form A (its advance `width`): turned over about its ink, set at
    the left form's bearings swapped, each contour started and wound as `mapping` says (types_of: the Regular right
    form's point types and smooth flags)."""
    xa = [x for P in A for x, *_ in P]
    x0, x1 = min(xa), max(xa)
    d = (width - x1) - x0
    out = []
    for (ci, k), T in zip(mapping, types_of):
        Q = A[ci]
        n = len(Q)
        rev = list(reversed(Q))
        out.append([(round(x0 + x1 - rev[(k + m) % n][0] + d), round(rev[(k + m) % n][1])) + tuple(T[m]) for m in range(n)])
    return out


def check_light_bearings(reg, light):
    """The Light's sides as bearing_change sets them (qa.py): for every glyph light_bearings.json names, the Light's
    zone edges stand from its advance's ends by the Regular's plus that change (half a unit for the rounding).
    Returns the misses [(glyph, side, want, got)]."""
    bad = []
    v = vector(LIGHT_STEM)
    for g in reg:
        ch = g.name if len(g.name) == 1 else _CHARS.get(g.name)
        if ch not in light_bearings() or not g.contours or g.components or g.name not in light:
            continue
        r0, r1 = _zone_edges(glyph_contours(g), g.name)
        b0, b1 = _zone_edges(glyph_contours(light[g.name]), g.name)
        dl, dr = bearing_change(g.name, v)
        for side, want, got in (("left", r0 + dl, b0), ("right", g.width - r1 + dr, light[g.name].width - b1)):
            if abs(want - got) > 0.5 + 1e-6:
                bad.append((g.name, side, round(want, 1), round(got, 1)))
    return bad


# 0.81: a part drawn again in other glyphs moves, in every master, as its own glyph does. The comma's ball and tail
# recur in the quotes, the apostrophe, the comma accent and the turned comma above, each drawn on the comma's 19
# points at its own size and turn (0.69 to 0.92 of it, upright or turned half round; within 7 to 21 units of the
# comma so placed). The engine read each of them afresh, and read them differently: the apostrophe's tail was not
# read at all (42 > 20 at 300), the turned comma above's ball swelled over its tail (crossings from 600), the
# quotes' crotch climbed their tails. Now each such contour takes the comma's own move at every point, turned and
# sized as the contour is. KIN: the glyph whose contour is the part, and the most a drawing may stray from it.
KIN = {"comma": (25, "upright or turned"), "arrowright": (8, "any turn")}   # 0.81: the arrows are one arrow turned
#                                          (charset.arrows; the diagonal ones by 45 and 135 degrees: on the engine's
#                                          own reading their Light turned over and fell back to upright parts only)
_KIN = {}


def _similar(base, P, tol, any_turn=False):
    """(scale, rotation matrix, residual) placing base's points on P's (same order), or None."""
    A, C = np.array(base, float), np.array(P, float)
    Ac, Cc = A - A.mean(0), C - C.mean(0)
    U, S, Vt = np.linalg.svd(Ac.T @ Cc)
    Rm = (U @ Vt).T
    if np.linalg.det(Rm) < 0:
        return None
    sc = S.sum() / (Ac ** 2).sum()
    res = float(np.abs(Cc - sc * (Ac @ Rm.T)).max())
    ang = math.degrees(math.atan2(Rm[1, 0], Rm[0, 0]))
    if res > tol or not 0.6 <= sc <= 1.1 or (not any_turn and min(abs(ang), abs(abs(ang) - 180)) > 6):
        return None
    return sc, Rm, res


# 0.81: the small figures and the ordinals are their letter or figure at charset.SUP_SCALE with charset.SUP_BOLD
# added round them (charset.small_figures). In every master each of their points moves by its figure's point's
# move, at that scale; the added weight stays what it is. 0.80 read them afresh, and a superior's strokes took the
# full-size gains (the Light six superior's upper stroke 24 > 16 at 300). This gives them the heavier relative
# weight small glyphs have in every reference (their stem goes 54 > 88 to the Bold and 54 > 42 to the Light,
# a share of the stem's step of 0.82 and 0.74 in the weight research's exponent; their hairline 0.3 and 0.4).
SMALL = {f + s_: f for f in ("zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine")
         for s_ in ("superior", "inferior")}
SMALL.update(ordfeminine="a", ordmasculine="o")


def _match(B_, P, scale, far=20.0, skip=20.0):
    """For each point of P, the index of the point of B_ (scaled about its box and set on P's box) it was made
    from, or None for a point the figure no longer has (a node added to one since): the cheapest alignment of the
    two in order round the contour (a point to a point of the same kind within `far`; a point of P left out costs
    `skip`, a point of B_ left out nothing)."""
    bx, by = [q[0] for q in B_], [q[1] for q in B_]
    px, py = [q[0] for q in P], [q[1] for q in P]
    cx = (min(px) + max(px)) / 2 - (min(bx) + max(bx)) / 2 * scale
    cy = (min(py) + max(py)) / 2 - (min(by) + max(by)) / 2 * scale
    T = [(q[0] * scale + cx, q[1] * scale + cy, q[2]) for q in B_]
    n, m = len(T), len(P)
    INF = float("inf")
    best = None
    for k in range(n):
        Tk = T[k:] + T[:k]
        D = [[INF] * (n + 1) for _ in range(m + 1)]
        W = [[None] * (n + 1) for _ in range(m + 1)]
        D[0][0] = 0.0
        for i in range(m + 1):
            for j in range(n + 1):
                c = D[i][j]
                if c == INF:
                    continue
                if j < n and c < D[i][j + 1]:                  # the figure's point left out
                    D[i][j + 1], W[i][j + 1] = c, (i, j, None)
                if i < m and c + skip < D[i + 1][j]:           # the small glyph's point left out
                    D[i + 1][j], W[i + 1][j] = c + skip, (i, j, None)
                if i < m and j < n and (Tk[j][2] is None) == (P[i][2] is None):
                    dd = math.dist(Tk[j][:2], P[i][:2])
                    if dd <= far and c + dd < D[i + 1][j + 1]:
                        D[i + 1][j + 1], W[i + 1][j + 1] = c + dd, (i, j, (k + j) % n)
        if best is None or D[m][n] < best[0]:
            idx = [None] * m
            i, j = m, n
            while (i, j) != (0, 0):
                pi, pj, hit = W[i][j]
                if hit is not None and pi == i - 1 and pj == j - 1:
                    idx[pi] = hit
                i, j = pi, pj
            best = (D[m][n], idx)
    if best is None or best[0] == INF or sum(x is None for x in best[1]) > max(4, m // 6):
        return None
    return best[1]


def kin_parts(reg, g, out, rep, v):
    """Contours of g that are a KIN part: each point moved by the part's own glyph's move, turned and scaled; or a
    SMALL glyph: each point moved by its figure's point's move, at the small glyphs' scale."""
    if g.name in SMALL and SMALL[g.name] in reg:
        import charset as CHARSET
        base_name = SMALL[g.name]
        key = (base_name, v["stem"], "small")
        if key not in _KIN:
            _KIN[key] = (glyph_contours(reg[base_name]), glyph_bold(reg[base_name], v)[0])
        bR, bB = _KIN[key]
        mine = glyph_contours(g)
        if len(bR) != len(mine):
            return out, rep
        new = []
        for P, BR, BB in zip(mine, bR, bB):
            idx = _match(BR, P, CHARSET.SUP_SCALE)
            if idx is None or len(BR) != len(BB):
                return out, rep
            mv = [None if j is None else ((BB[j][0] - BR[j][0]) * CHARSET.SUP_SCALE, (BB[j][1] - BR[j][1]) * CHARSET.SUP_SCALE)
                  for j in idx]
            for i in range(len(mv)):                           # a point the figure has not: its neighbours' move
                if mv[i] is None:
                    a_ = next(mv[(i - d) % len(mv)] for d in range(1, len(mv)) if mv[(i - d) % len(mv)] is not None)
                    b_ = next(mv[(i + d) % len(mv)] for d in range(1, len(mv)) if mv[(i + d) % len(mv)] is not None)
                    mv[i] = ((a_[0] + b_[0]) / 2, (a_[1] + b_[1]) / 2)
            new.append([(round(q[0] + dx), round(q[1] + dy), q[2], q[3]) for q, (dx, dy) in zip(P, mv)])
        rep = dict(rep, kin=[f"{base_name}'s move x {CHARSET.SUP_SCALE}"])
        rep.pop("fallback", None)
        return new, rep
    if not g.contours or g.name in KIN:
        return out, rep
    done = []
    for kname, (tol, turns_) in KIN.items():
        if kname not in reg:
            continue
        key = (kname, v["stem"])
        if key not in _KIN:
            base = glyph_contours(reg[kname])[0]
            bo = glyph_bold(reg[kname], v)[0][0]
            _KIN[key] = (base, bo)
        base, bo = _KIN[key]
        mv = np.array([q[:2] for q in bo], float) - np.array([q[:2] for q in base], float)
        mv -= mv.mean(0)                                       # the part's change of shape, not its place
        for ci, P0 in enumerate(glyph_contours(g)):
            if len(P0) != len(base):
                continue
            fit_ = None
            for k in range(len(P0)):                           # the start point may differ (a turned path)
                P = P0[k:] + P0[:k]
                if [q[2] for q in P] != [q[2] for q in base]:
                    continue
                f_ = _similar([q[:2] for q in base], [q[:2] for q in P], tol, turns_ == "any turn")
                if f_ and (fit_ is None or f_[2] < fit_[0][2]):
                    fit_ = (f_, k)
            if fit_ is None:
                continue
            fit_, k0 = fit_
            P = P0[k0:] + P0[:k0]
            sc, Rm, res = fit_
            d = sc * (mv @ Rm.T)
            N = [(round(q[0] + dx), round(q[1] + dy), q[2], q[3]) for q, (dx, dy) in zip(P, d)]
            for k, q in enumerate(P):                          # a handle level or upright on its node stays so
                if q[2] is not None:                           # (the drawing's turn is not the comma's exactly)
                    continue
                own = k - 1 if P[k - 1][2] is not None else (k + 1) % len(P)
                for ax in (0, 1):
                    if q[ax] == P[own][ax]:
                        N[k] = tuple(N[own][ax] if a == ax else N[k][a] for a in (0, 1)) + N[k][2:]
            cx = (min(q[0] for q in out[ci]) + max(q[0] for q in out[ci])) / 2   # where the engine put it, across
            nx = (min(q[0] for q in N) + max(q[0] for q in N)) / 2
            N = [(x + round(cx - nx), y, t, s_) for x, y, t, s_ in N]
            N = N[len(N) - k0:] + N[:len(N) - k0] if k0 else N        # back to the glyph's own start point
            out[ci] = N
            done.append(f"contour {ci}: {kname}'s move x {sc:.2f}{' turned' if abs(Rm[0, 0] + 1) < 0.2 else ''} (drawn {res:.0f} from it)")
    if done:
        rep = dict(rep, kin=done)
        rep.pop("fallback", None)
    return out, rep


def symmetries(contours, tol=6.0):
    """The symmetries a drawing has, to within tol: [(2x2 matrix, centre, index of each point's image or -1)],
    point indexes running over all contours; kept when at least 0.8 of the points have an image (the dagger's arms
    mirror each other point for point, its top neck does not). Mirrors across the upright and the level through the centre of its
    nodes' box, and turns by a quarter, a fifth, a sixth and an eighth."""
    pts = [(q[0], q[1], q[2] is None) for P in contours for q in P]
    on = [p for p in pts if not p[2]]
    if not on:
        return []
    c = ((min(p[0] for p in on) + max(p[0] for p in on)) / 2, (min(p[1] for p in on) + max(p[1] for p in on)) / 2)
    cands = [((-1.0, 0.0, 0.0, 1.0), "mirror |"), ((1.0, 0.0, 0.0, -1.0), "mirror -")]
    for n in (4, 5, 6, 8):
        a = 2 * math.pi / n
        cands.append(((math.cos(a), -math.sin(a), math.sin(a), math.cos(a)), f"turn 1/{n}"))
    arr = np.array([p[:2] for p in pts], float)
    kind = np.array([p[2] for p in pts])
    out = []
    corners_ = [q[:2] for P in contours for q in P if q[2] is not None and not q[3]]
    c_turn = tuple(np.mean(corners_, axis=0)) if len(corners_) >= 3 else c   # a star turns about its crotches
    for (a, b, c_, d), name in cands:
        cc = c_turn if name.startswith("turn") else c
        q = arr - cc
        img = np.stack([a * q[:, 0] + b * q[:, 1], c_ * q[:, 0] + d * q[:, 1]], axis=1) + cc
        dist = np.hypot(img[:, None, 0] - arr[None, :, 0], img[:, None, 1] - arr[None, :, 1])
        dist[kind[:, None] != kind[None, :]] = 1e9
        j = dist.argmin(axis=1)
        ok = dist[np.arange(len(arr)), j] <= (2.5 * tol if name.startswith("turn") else tol)   # arms drawn apart
        jj = np.where(ok, j, -1)
        back = dist.argmin(axis=0)                             # mutual: i's image is nearest j, j's preimage i
        for i in range(len(arr)):
            if jj[i] >= 0 and dist[:, jj[i]].min() < dist[i, jj[i]] - 1e-9:
                jj[i] = -1
        del back
        n_ = 2 if name.startswith("mirror") else int(name.split("/")[1])
        for i in range(len(arr)):                              # each point's images close on it after n steps
            k_, ok_ = i, True
            for _ in range(n_):
                k_ = jj[k_]
                if k_ < 0:
                    ok_ = False
                    break
            if not ok_ or k_ != i:
                jj[i] = -1
        jj = np.where(jj >= 0, np.where(jj[np.maximum(jj, 0)] >= 0, jj, -1), -1)
        if (jj >= 0).mean() >= 0.8:                            # a part's symmetry (the dagger's arms) is enough
            out.append((np.array([[a, b], [c_, d]]), cc, jj, name))
    # round 3: a symmetry counts only when the drawing's points pair as a group: two products of the symmetries
    # that are the same turn or mirror must send each point to the same point. The multiply sign's quarter turn
    # sends a soft corner's two handles to the far corner's in the other order than its two mirrors do (its corners
    # are not drawn quarter-turn alike), so its moves cannot be both; the mirrors are kept, then turns in order.
    kept = []
    for s_ in out:
        trial = kept + [s_]
        if _consistent(trial, len(arr)):
            kept.append(s_)
    return kept


def _consistent(syms, n):
    elems = [(np.eye(2), np.arange(n))]
    frontier = list(elems)
    while frontier:
        nxt = []
        for M1, j1 in frontier:
            for M, c, j, name in syms:
                M2 = M @ M1
                j2 = np.where(j1 >= 0, j[np.maximum(j1, 0)], -1)
                for Mg, jg in elems:
                    if np.allclose(Mg, M2, atol=1e-6):
                        both = (jg >= 0) & (j2 >= 0)
                        if np.any(jg[both] != j2[both]):
                            return False
                        break
                else:
                    if len(elems) >= 24:
                        return True
                    elems.append((M2, j2))
                    nxt.append((M2, j2))
        frontier = nxt
    return True


def symmetric(g, out, rep):
    """0.81: a sign drawn symmetric (the dagger mirrored, the asterisk turned by a sixth) keeps that symmetry in
    every master: each point's move, less the glyph's whole shift, is the mean over the drawing's symmetries of its
    images' moves turned back. The engine read each arm of the dagger and the asterisk afresh, and the readings
    differed: at 700 the dagger's left arm was a larger lobe than its right."""
    import unicodedata
    if not g.unicodes or unicodedata.category(chr(g.unicodes[0]))[:1] not in ("P", "S"):
        return out, rep
    R = glyph_contours(g)
    if [len(P) for P in R] != [len(P) for P in out]:
        return out, rep
    syms = symmetries(R)
    if not syms:
        return out, rep
    A = np.array([q[:2] for P in R for q in P], float)
    Bm = np.array([q[:2] for P in out for q in P], float)
    mv = Bm - A
    paired = np.all([j >= 0 for _, _, j, _ in syms], axis=0)  # the glyph's shift, read on the points every symmetry
    shift = mv[paired].mean(axis=0) if paired.any() else mv.mean(axis=0)   # pairs (an unpaired part would skew it)
    mv = mv - shift
    group = sym_group(syms, len(A))
    acc = np.zeros_like(mv)
    cnt = np.zeros(len(mv))
    for M, j in group:
        ok = j >= 0
        acc[ok] += mv[j[ok]] @ M                               # M is orthogonal: its inverse is its transpose
        cnt[ok] += 1
    mv = acc / cnt[:, None]
    return _round_orbits(g, R, out, rep, syms, group, A, mv, shift)


def sym_group(syms, n):
    """Every product of the symmetries [(M, index of each point's image or -1)], the identity first."""
    group = [(np.eye(2), np.arange(n))]
    grow = True
    while grow:
        grow = False
        for M1, j1 in list(group):
            for M, c, j, name in syms:
                M2 = M @ M1
                j2 = np.where(j1 >= 0, j[np.maximum(j1, 0)], -1)
                j2 = np.where(j1 >= 0, j2, -1)
                for k_, (Mg, jg) in enumerate(group):
                    if np.allclose(Mg, M2, atol=1e-6):
                        if (j2 >= 0).sum() > (jg >= 0).sum():
                            group[k_] = (Mg, j2)
                        break
                else:
                    if len(group) < 24:
                        group.append((M2, j2))
                        grow = True
    return group


def _round_orbits(g, R, out, rep, syms, group, A, mv, shift):
    # round 3: whole-unit moves, the same for every image: an orbit's first point is rounded and its images take its
    # move turned exactly where the turn keeps whole units (mirrors, quarter and half turns); elsewhere each rounds
    integral = [np.allclose(M, np.round(M), atol=1e-9) for M, _ in group]
    done = np.full(len(mv), False)
    out_mv = np.zeros_like(mv)
    for i in range(len(mv)):
        if done[i]:
            continue
        r = np.sign(mv[i]) * np.floor(np.abs(mv[i]) + 0.5)    # half away from zero: commutes with every mirror,
        out_mv[i], done[i] = r, True                           # so a point a mirror keeps in place stays on it
        for (M, j), whole in zip(group, integral):
            k_ = j[i]
            if k_ < 0 or done[k_]:
                continue
            out_mv[k_] = M @ r if whole else np.sign(mv[k_]) * np.floor(np.abs(mv[k_]) + 0.5)
            done[k_] = True
    sh = np.floor(shift + 0.5)
    flat = [(int(x), int(y)) for x, y in (A + out_mv + sh)]
    new, k = [], 0
    for P in out:
        new.append([flat[k + i] + q[2:] for i, q in enumerate(P)])
        k += len(P)
    new = settle_turns(R, new, group, integral)
    return new, dict(rep, symmetric=[s_[3] for s_ in syms])


def settle_turns(R, N, group, integral):
    """Round 3: whole units can bend a shallow curve the other way (the daggers' necks, 4 units of rise over 60, took
    an inflection from rounding alone). A curve that gains an extreme or an inflection between the Regular and N
    (axis_exact.turns, over every weight between) has its two handles moved by at most a unit each way, the least
    move that clears it, and every image of those handles takes the same move turned (so the symmetry stays exact)."""
    import itertools
    import audit_axis as AA
    import axis_exact as X
    flat_i = []
    for ci, P in enumerate(R):
        for i in range(len(P)):
            flat_i.append((ci, i))
    where = {ci_i: k for k, ci_i in enumerate(flat_i)}
    N = [list(P) for P in N]
    idx = X.cubic_index(R)
    for _ in range(3):
        bad = X.turns(R, R, N, AA.FILLET_SMALL, AA.FILLET_MAX)
        if not bad:
            break
        for kc, _s, _why in bad:
            ci, i0, a, b, j0 = idx[kc]
            best = None
            for da in itertools.product((-1, 0, 1), repeat=4):
                cost = sum(abs(d) for d in da)
                if best is not None and cost >= best[0]:
                    continue
                trial = [list(P) for P in N]
                for (hk, (dx, dy)) in ((a, da[:2]), (b, da[2:])):
                    q = trial[ci][hk]
                    trial[ci][hk] = (q[0] + dx, q[1] + dy) + tuple(q[2:])
                if not [1 for k_, _, _ in X.turns(R, R, trial, AA.FILLET_SMALL, AA.FILLET_MAX) if k_ == kc]:
                    best = (cost, da)
            if best is None or best[0] == 0:
                continue
            da = best[1]
            for hk, d in ((a, np.array(da[:2], float)), (b, np.array(da[2:], float))):
                k0 = where[(ci, hk)]
                for (M, j), whole in zip(group, integral):
                    kk = j[k0]
                    if kk < 0 or not whole:
                        continue
                    cj, ij = flat_i[kk]
                    dd = M @ d
                    q = N[cj][ij]
                    if M is group[0][0] or np.allclose(M, np.eye(2)):
                        N[cj][ij] = (q[0] + int(d[0]), q[1] + int(d[1])) + tuple(q[2:])
                    else:
                        N[cj][ij] = (q[0] + int(round(dd[0])), q[1] + int(round(dd[1]))) + tuple(q[2:])
    return N


def overlap_masters(reg, font, maps, v, reports, notes):
    """0.81: every struck glyph (overlap.py) in this master: the master's own letter, point for point, at the
    Regular's offset, and each stroke moved by overlap.move_stroke on the letter's node map. Writes the default
    layer of `font`; returns the names done."""
    import overlap as OVERLAP
    from ufoLib2.objects import Contour, Point
    if OVERLAP.LAYER not in reg.layers:
        return set()
    layer = reg.layers[OVERLAP.LAYER]
    order = sorted(layer.keys(), key=lambda n: layer[n].lib.get("area.overlap", {}).get("letter") in layer)
    done = set()
    for name in order:
        og = layer[name]
        info = og.lib.get("area.overlap")
        if not info or name not in font:
            continue
        letter, (ox, oy), nl = info["letter"], info["offset"], info["letter_contours"]
        if letter not in font or letter not in maps:
            notes.append(f"{name}: its letter {letter} has no map; left as the engine read it")
            continue
        X, Y = maps[letter]
        rl = [[(q.x, q.y, q.type, q.smooth) for q in c.points] for c in reg[letter].contours] if letter not in layer \
            else [[(q.x, q.y, q.type, q.smooth) for q in c.points] for c in layer[letter].contours]
        bl = [[(q.x, q.y, q.type, q.smooth) for q in c.points] for c in font[letter].contours]
        if len(rl) != nl or [len(P) for P in rl] != [len(c.points) for c in og.contours[:nl]]:
            notes.append(f"{name}: its letter part is not {letter}'s points; left as the engine read it")
            continue
        mx = lambda x: _interp(X, x - ox) + ox if X else x     # noqa: E731
        my = lambda y: _interp(Y, y - oy) + oy if Y else y     # noqa: E731
        strokes = [[(q.x, q.y, q.type, q.smooth) for q in c.points] for c in og.contours[nl:]]
        lt_ = [[(x + ox, y + oy, t, s_) for x, y, t, s_ in P] for P in bl]
        st_, inset_ = OVERLAP.inset_ends(lt_, [OVERLAP.move_stroke(P, mx, my, v) for P in strokes])   # 0.81: no side on
        if inset_:                                                                                    # the letter's edge
            notes.append(f"{name}: stroke end drawn back off the letter's edge {inset_}")
        new = lt_ + st_
        g = font[name]
        g.clearContours()
        for P in new:
            c = Contour()
            c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            g.contours.append(c)
        g.width = og.width + (font[letter].width - reg[letter].width)
        for a, na in zip(og.anchors, g.anchors):
            na.x, na.y = round(mx(a.x)), round(my(a.y))
        maps[name] = ({k + ox: mx(k + ox) for k in X} if X else {}, {k + oy: my(k + oy) for k in Y} if Y else {})
        reports[name] = {"x": [], "y": [], "necks": [], "overlap": letter}
        done.add(name)
    notes.append(f"overlap: {len(done)} struck glyphs as this master's letter and its strokes")
    return done


def bold_font(reg, stem=STEM, **over):
    """The Bold master: every outline by rule, every anchor carried by its glyph's own node map, every component
    moved by what its two anchors moved. Returns (font, {glyph: report}, [notes])."""
    import copy
    from ufoLib2.objects import Point
    v = vector(stem, **over)
    font = copy.deepcopy(reg)
    reports, notes, maps = {}, [], {}
    import arms as ARMS
    import white as WHITE
    signs = [g.name for g in reg if ARMS.is_sign(g)]          # 0.81 round 3: signs of arms, after the letters
    law = None
    for g in [g for g in reg if g.name not in signs] + [reg[n] for n in signs]:
        if not g.contours:
            continue
        out, w, rep = glyph_bold(g, v)
        out, rep = kin_parts(reg, g, out, rep, v)              # 0.81: a comma wherever it recurs
        if g.name in signs:                                    # each arm its centreline and width profile times f
            if law is None:
                law = WHITE.Law(reg, font)
                notes.append(repr(law))
            R_ = glyph_contours(g)
            reach_ = ARMS.reach_of(g.name, v)                 # 0.81: a star's arms reach as the references' do,
            import axis_exact as _X                            # as far as no curve gains a turn the Regular's
            eng_ = out                                         # reach would not give it (halved back towards 1)

            def _arms(rc_):
                f0 = ARMS.capped(R_, sign_ratio(v), law.least, reach=rc_)
                mp_ = ARMS.master(R_, f0, engine=eng_, reach=rc_)
                o_ = [[(x, y) + q[2:] for (x, y), q in zip(M_, P_)] for M_, P_ in zip(mp_, R_)]
                o_, _r = symmetric(g, o_, {})
                return f0, mp_, len(_X.turns(R_, R_, o_))
            if v["f"] > 0 and g.name in ARMS.INK_GAIN and "n" in reg and "n" in font:
                # 0.81 (close): the least reach (from the references' mean, up to their longest) at which the sign's
                # ink gains the references' least share of n's gain (arms.INK_GAIN); solved by halving
                def _ink(cs_):
                    return float(WHITE.raster(cs_)[0].sum())
                n_gain = _ink(glyph_contours(font["n"])) / _ink(glyph_contours(reg["n"]))

                def _gain(rc_):
                    f0, mp_, _t = _arms(rc_)
                    o_ = [[(x, y) + q[2:] for (x, y), q in zip(M_, P_)] for M_, P_ in zip(mp_, R_)]
                    return _ink(o_) / _ink(R_) / n_gain
                lo_, hi_ = reach_, ARMS.REACH_MAX
                if _gain(lo_) < ARMS.INK_GAIN[g.name]:
                    for _ in range(12):
                        mid_ = (lo_ + hi_) / 2
                        if _gain(mid_) >= ARMS.INK_GAIN[g.name]:
                            hi_ = mid_
                        else:
                            lo_ = mid_
                    reach_ = round(hi_, 4)
            f_, mapped, t_ = _arms(reach_)
            if reach_ != 1.0:
                base_t = _arms(1.0)[2]
                for _ in range(6):
                    if t_ <= base_t:
                        break
                    reach_ = 1 + (reach_ - 1) / 2
                    f_, mapped, t_ = _arms(reach_)
                if t_ > base_t:                                # no reach holds the curves: the Regular's length
                    reach_ = 1.0
                    f_, mapped, t_ = _arms(reach_)
            out = [[(x, y) + q[2:] for (x, y), q in zip(M_, P_)] for M_, P_ in zip(mapped, R_)]
            rep = {"x": [], "y": [], "necks": [], "where": {}, "arms": f"f {f_:.3f} (law {sign_ratio(v):.3f})",
                   "X": {min(q[0] for P_ in R_ for q in P_): min(q[0] for P_ in out for q in P_),
                         max(q[0] for P_ in R_ for q in P_): max(q[0] for P_ in out for q in P_)}, "Y": {}}
            notes.append(f"{g.name}: arms at f {f_:.3f} (the sign law {sign_ratio(v):.3f}), reach {reach_:.3f}")
        out, rep = symmetric(g, out, rep)                      # 0.81: a symmetric sign stays symmetric
        if g.width:                                            # side bearings: the Regular's plus the measured change
            rc = glyph_contours(g)
            r0, r1 = _zone_edges(rc, g.name)
            b0, b1 = _zone_edges(out, g.name)
            dl, dr = bearing_change(g.name, v)
            shift = round(r0 + dl - b0)
            out = [[(x + shift, y, t, s_) for x, y, t, s_ in P] for P in out]
            w = round(b1 + shift + (g.width - r1) + dr)
            for key in ("X",):
                if rep.get(key):
                    rep[key] = {k: x + shift for k, x in rep[key].items()}
            if rep.get("where"):
                rep["where"] = {q: (x + shift, y) for q, (x, y) in rep["where"].items()}
        ng = font[g.name]
        for c, P in zip(ng.contours, out):
            c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
        ng.width = w if not g.components else g.width
        reports[g.name] = rep
        maps[g.name] = (rep.get("X") or {}, rep.get("Y") or {})
        for a, na in zip(g.anchors, ng.anchors):
            if maps[g.name][0]:
                na.x, na.y = round(_interp(maps[g.name][0], a.x)), round(_interp(maps[g.name][1], a.y))

    struck = overlap_masters(reg, font, maps, v, reports, notes)   # 0.81: letter and strokes, overlapping
    # 0.81 (last round): the hook above as a curl and a stem, overlapping (overlap.curl_master: the eye and the slot
    # are whites under the law; the capital form's slot closed at 552 and the outline crossed itself)
    import overlap as _OV
    curled = []
    for name in _OV.curl_names(reg):
        if name not in font:
            continue
        if law is None:
            law = WHITE.Law(reg, font)
        X_, Y_ = maps.get(name, ({}, {}))
        R_, N_ = glyph_contours(reg[name])[0], glyph_contours(font[name])[0]
        if len(R_) != len(N_):
            notes.append(f"{name}: not the Regular's points; left as the engine read it")
            continue
        parts_, log_ = _OV.curl_master(R_, N_, (lambda x, X_=X_: _interp(X_, x)) if X_ else (lambda x: x),
                                       (lambda y, Y_=Y_: _interp(Y_, y)) if Y_ else (lambda y: y), v, law.least)
        from ufoLib2.objects import Contour as _Contour
        g_ = font[name]
        g_.clearContours()
        for P in parts_:
            c = _Contour()
            c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            g_.contours.append(c)
        struck.add(name)
        curled.append(f"{name} {log_}")
    notes.append(f"curls on stems: {len(curled)} ({'; '.join(curled)})")

    def anchors(font_, name):
        g = font_[name]
        return {a.name: (a.x, a.y) for a in g.anchors}
    order = [g.name for g in reg if g.components]
    done = set(g.name for g in reg if g.contours and not g.components)
    for _ in range(4):                                         # composites of composites: until all are placed
        for name in order:
            g, ng = reg[name], font[name]
            if name in done or any(c.baseGlyph not in done and reg[c.baseGlyph].components for c in g.components):
                continue
            placed, adv_r, adv_b = [], 0, 0                    # [(glyph, regular offset, bold offset)]
            for c, nc in zip(g.components, ng.components):
                t = c.transformation
                ox, oy = t[4], t[5]
                m = c.baseGlyph
                nox = noy = None
                if tuple(t)[:4] == (1, 0, 0, 1):
                    mine = anchors(reg, m) or anchors(reg, m + "comb") if (m + "comb") in reg else anchors(reg, m)
                    mine_b = anchors(font, m) if anchors(reg, m) else (anchors(font, m + "comb") if (m + "comb") in reg else {})
                    for pg, pro, pbo in reversed(placed):      # the mark's anchor on an earlier component's anchor
                        pa, pb = anchors(reg, pg), anchors(font, pg)
                        for an, (ax, ay) in pa.items():
                            if "_" + an in mine and abs(pro[0] + ax - mine["_" + an][0] - ox) <= 1.5 and abs(pro[1] + ay - mine["_" + an][1] - oy) <= 1.5 \
                                    and "_" + an in mine_b and an in pb:
                                nox = pbo[0] + pb[an][0] - mine_b["_" + an][0]
                                noy = pbo[1] + pb[an][1] - mine_b["_" + an][1]
                                break
                        if nox is not None:
                            break
                    if nox is None and placed and abs(ox - adv_r) <= 40 and abs(oy) <= 40 and not is_mark(reg[m]):
                        nox, noy = adv_b + round((ox - adv_r) * v["bearing"]), oy   # set after the one before it (a digraph)
                    if nox is None and not placed:
                        nox, noy = ox, oy                      # the base
                        if ox or oy:
                            notes.append(f"{name}: first component {m} at {ox},{oy} kept")
                    if nox is None and placed and is_mark(reg[m]) and is_mark(reg[placed[-1][0]]):
                        # round 3: a mark stacked beside another mark with no anchor between them (Vietnamese
                        # grave or hook beside a circumflex) keeps its place relative to that mark: the two inks'
                        # centres stand as in the Regular. (It followed the base's node map, and in the Bold the
                        # circumflex rode a's anchor 58 right while the grave stayed: 62 apart, into each other.)
                        pm, pro, pbo = placed[-1]

                        def _c(f_, n_):
                            bb = f_[n_].getBounds(f_)
                            return ((bb.xMin + bb.xMax) / 2, (bb.yMin + bb.yMax) / 2) if bb else (0, 0)
                        dpx, dpy = (_c(font, pm)[k] - _c(reg, pm)[k] for k in (0, 1))
                        dmx, dmy = (_c(font, m)[k] - _c(reg, m)[k] for k in (0, 1))
                        nox = round(pbo[0] + (ox - pro[0]) + dpx - dmx)
                        noy = round(pbo[1] + (oy - pro[1]) + dpy - dmy)
                        notes.append(f"{name}: {m} kept beside {pm} as in the Regular ({ox},{oy} > {nox},{noy})")
                    if nox is None:                            # no anchor says where: it follows the base's node map
                        bx, by = maps.get(placed[0][0], ({}, {}))
                        mb = reg[m].getBounds(reg) if hasattr(reg[m], "getBounds") else None
                        cxm = (mb.xMin + mb.xMax) / 2 if mb else 0
                        mbb = font[m].getBounds(font) if mb else None
                        if bx and mb:
                            nox = round(_interp(bx, ox + cxm) - (mbb.xMin + mbb.xMax) / 2)
                            noy = round(oy + _interp(by, oy + mb.yMin) - (oy + mb.yMin)) if by else oy
                        else:
                            nox, noy = ox, oy
                        notes.append(f"{name}: {m} has no anchor pair; moved with the base's outline ({ox},{oy} > {nox},{noy})")
                else:
                    nox, noy = ox, oy
                    notes.append(f"{name}: {m} is transformed; offset kept")
                nc.transformation = tuple(t)[:4] + (nox, noy)
                placed.append((m, (ox, oy), (nox, noy)))
                if reg[m].width and not is_mark(reg[m]):       # a mark has no advance of its own in a composite
                    adv_r, adv_b = ox + reg[m].width, nox + font[m].width
            if not g.contours:                                 # advance: the base's, or the run of its parts
                base = g.components[0].baseGlyph
                if g.width == reg[base].width:
                    ng.width = font[base].width
                elif abs(g.width - adv_r) <= 40:
                    ng.width = adv_b + round((g.width - adv_r) * v["bearing"])
                else:
                    ng.width = round(font[base].width + (g.width - reg[base].width) * v["bearing"])
                    notes.append(f"{name}: advance {g.width} is not its base's ({reg[base].width}); {ng.width}")
            for a, na in zip(g.anchors, ng.anchors):           # its own anchors: with the component that carries them
                best = None
                for pg, pro, pbo in placed:
                    for an, (ax, ay) in anchors(reg, pg).items():
                        if an == a.name and abs(pro[0] + ax - a.x) <= 1.5 and abs(pro[1] + ay - a.y) <= 1.5 and an in anchors(font, pg):
                            best = (pbo[0] + anchors(font, pg)[an][0], pbo[1] + anchors(font, pg)[an][1])
                if best is None and placed:
                    bx, by = maps.get(placed[0][0], ({}, {}))
                    best = (round(_interp(bx, a.x)) if bx else a.x + placed[0][2][0] - placed[0][1][0], round(_interp(by, a.y)) if by else a.y)
                na.x, na.y = best
            done.add(name)
    for name in order:
        if name not in done:
            notes.append(f"{name}: not placed")
    # round 3: stacked marks keep the white between them (white.py's law towards the Bold, at least min(Regular,
    # MIN_GAP) either way): a later mark that came closer to an earlier one than that moves away from it along the
    # line between their ink centres, as in the Regular. (The Bold's marks grow; placed anchor to anchor, ẩ's
    # hook and Ǘ's acute ran into the circumflex and the dieresis.)
    import spacing as _SP
    if law is None:
        law = WHITE.Law(reg, font)
    stacked = []

    def _mark_ink(f_, comp):
        t_ = comp.transformation
        cs_ = [[(x + t_[4], y + t_[5], ty, s_) for x, y, ty, s_ in P] for P in glyph_contours(f_[comp.baseGlyph])]
        pts_ = [d[:2] for P in cs_ for d in WHITE._dense(P, 2.0)]
        return np.array(pts_) if pts_ else None
    for name in order:
        g, ng = reg[name], font[name]
        if g.contours:
            continue
        mk = [k for k, c in enumerate(g.components) if c.baseGlyph in reg and is_mark(reg[c.baseGlyph])]
        if len(mk) < 2:
            continue
        moved_any = False
        for b_ in mk[1:]:
            for a_ in mk:
                if a_ >= b_:
                    continue
                ra, rb = _mark_ink(reg, g.components[a_]), _mark_ink(reg, g.components[b_])
                if ra is None or rb is None:
                    continue
                g0 = float(np.hypot(ra[:, None, 0] - rb[None, :, 0], ra[:, None, 1] - rb[None, :, 1]).min())
                want = (law.least(g0) if law.narrow(g0) else min(_SP.MIN_GAP, g0)) if v["f"] > 0 else min(_SP.MIN_GAP, g0)
                dvec = rb.mean(axis=0) - ra.mean(axis=0)
                dvec = dvec / (np.linalg.norm(dvec) or 1.0)
                for _ in range(150):
                    na, nb = _mark_ink(font, ng.components[a_]), _mark_ink(font, ng.components[b_])
                    gap_ = float(np.hypot(na[:, None, 0] - nb[None, :, 0], na[:, None, 1] - nb[None, :, 1]).min())
                    if gap_ >= want - 0.5:
                        break
                    tt = list(ng.components[b_].transformation)
                    step = max(1.0, (want - gap_) / 2)
                    dx_, dy_ = round(dvec[0] * step), round(dvec[1] * step)
                    if (dx_, dy_) == (0, 0):
                        k_ = 0 if abs(dvec[0]) >= abs(dvec[1]) else 1
                        dx_, dy_ = (int(np.sign(dvec[0])), 0) if k_ == 0 else (0, int(np.sign(dvec[1])))
                    tt[4] += dx_
                    tt[5] += dy_
                    ng.components[b_].transformation = tuple(tt)
                    moved_any = True
        if moved_any:
            stacked.append(name)
    notes.append(f"stacked marks: {len(stacked)} composites keep the white between their marks ({', '.join(stacked)})")
    for g in reg:                                              # spaces: by the references' word space
        if not g.contours and not g.components and g.width:
            font[g.name].width = round(g.width * (1 + (SPACE - 1) * v["f"]))
    # round 3: a crotch where a thin straight-edged arm leaves a thick stroke lies on the thick stroke's edge at the
    # arm's own width (hairline rule) from the arm's far edge (white.arm_crotches; the ampersand's tail arm, 25 > 13)
    armed = []
    resided = set()                                            # outlines changed after their sides were set
    ratio_ = 1 + (HAIR_RATIO - 1) * v["ft"]
    for g in reg:
        if not g.contours or g.components or g.name in struck or g.name in signs or g.name not in font:
            continue
        cs = glyph_contours(font[g.name])
        if [len(P) for P in cs] != [len(c.points) for c in g.contours]:
            continue
        new_, log_ = WHITE.arm_crotches(glyph_contours(g), cs, ratio_)
        if log_:
            for c, P in zip(font[g.name].contours, new_):
                c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            armed.append(f"{g.name} {log_}")
            resided.add(g.name)
    notes.append(f"arm crotches: {len(armed)} glyphs ({'; '.join(armed)})")
    # round 3: towards the Light, a neck where one curved stroke branches from another never runs under the
    # hairline's share of the Regular's (white.keep_necks; g's loop out of its link thinned 39 > 13 at 300)
    if v["f"] < 0:
        share = 1 + (HAIR_RATIO - 1) * v["ft"]
        necked = []
        for g in reg:
            if not g.contours or g.components or g.name in struck or g.name in signs or g.name not in font:
                continue
            cs = glyph_contours(font[g.name])
            if [len(P) for P in cs] != [len(c.points) for c in g.contours]:
                continue
            new_, log_ = WHITE.keep_necks(glyph_contours(g), cs, share, 30 * v["tip"])
            if log_:
                for c, P in zip(font[g.name].contours, new_):
                    c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
                necked.append(f"{g.name} {log_}")
                resided.add(g.name)
        notes.append(f"necks between curves: {len(necked)} glyphs ({'; '.join(necked)})")
    # 0.81 (owner, 15 November): a tail into a ball (j's and y's, wherever they recur) is built again in this master:
    # the ball is the round ends' part (the Regular's ball scaled by the ball law about its centre), the tail between
    # the straight edge and the ball solved by the Regular's own rule (loops.master_ball, round_tail). The engine had
    # read the ball's box neck-to-side as a round end's and the Bold's j ball came out 61 by 49, its tail meeting it
    # at 1.80 times its curvature. Before the tapers, so the taper law holds along the rebuilt tail (after them, the
    # Light's j fell to 0.65 of 400 by the stem, 42 against 65); before the splices (g.ss02 takes this master's j).
    import loops as _LOOPS
    tails_ = []
    # Towards the Bold only: towards the Light the engine's tail keeps the Regular's curvature (curvecheck passes on
    # the Light's j, y, g.ss02 as the engine draws them) and the taper law holds it; solved again there, the Light j
    # fell to 0.665 of 400 beside the stem (audit_rays' floor 0.684), and the ball alone left the neck's handles
    # 5.6 degrees off one line.
    for g in (reg if v["f"] > 0 else []):
        if not g.contours or g.components or g.name in struck or g.name in signs or g.name not in font:
            continue
        cs = glyph_contours(font[g.name])
        if [len(P) for P in cs] != [len(c.points) for c in g.contours]:
            continue
        for ci, R_ in enumerate(glyph_contours(g)):
            kind_ = _LOOPS.tail_kind(reg, R_)
            if not kind_ or max(range(len(cs)), key=lambda k: len(cs[k])) != ci:   # round_tail reads the longest
                continue
            M_ = _LOOPS.master_ball(R_, cs[ci], 1 + (BALL - 1) * v["f"])
            font[g.name].contours[ci].points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in M_]
            tails_.append(_LOOPS.round_tail(font, g.name, kind_, master=True).replace(": tail rebuilt", f" ({kind_}'s tail)"))
            resided.add(g.name)
    notes.append(f"tails into a ball: {len(tails_)} ({'; '.join(tails_)})")
    # 0.81 (integration): along a tapering stroke (a tail, a hook, a flag, a terminal) each place keeps its own
    # law's share of the Regular's thickness there, read off the ladder by what it is: a stem's place the stem's
    # ratio, a hairline's the hairline's, a serif tip's or an end's the tip's, in between interpolated
    # (white.keep_taper; eng's tail at 300 was 0.67 of the Regular where the stem goes 0.705). Towards the Bold
    # the same law holds the places the engine read thinner than the Regular (@'s a running into its ring, the
    # footless 1's flag, the ogonek): a stroke never thins as the weight rises
    tapered = []
    import unicodedata as _ud0
    for g in reg:
        if not g.contours or g.components or g.name in struck or g.name in signs or g.name not in font:
            continue
        cs = glyph_contours(font[g.name])
        if [len(P) for P in cs] != [len(c.points) for c in g.contours]:
            continue
        cat = _ud0.category(chr(g.unicodes[0])) if g.unicodes else ("Lu" if g.name[:1].isupper() else "Ll")
        big = cat in ("Lu", "Lt", "Nd") or g.name[:1].isupper()
        st_, hr_ = (CAP_STEM, CAP_HAIR) if big else (REG_STEM, LC_HAIR)
        laws = [(st_, stem / REG_STEM), (hr_, 1 + (HAIR_RATIO - 1) * v["ft"]), (30, v["tip"])]
        # 0.81 (close): the places move (white._taper_places) towards the Light only; towards the Bold they moved the
        # quotes' nodes on the Bold master alone, and between it and the quotes' mid master the tail dipped
        # (quotedblleft 40.8 > 35.3 at 675)
        new_, log_ = WHITE.keep_taper(glyph_contours(g), cs, laws, only_thinner=v["f"] > 0, nodes=v["f"] < 0)
        if log_:
            for c, P in zip(font[g.name].contours, new_):
                c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            tapered.append(f"{g.name} {len(log_)}")
            resided.add(g.name)
    notes.append(f"tapering strokes: {len(tapered)} glyphs keep the ladder's law along them ({', '.join(tapered)})")
    # 0.81 (close): a slanted stem with one straight side (its other side a curve's upright extreme across the ink:
    # the a of @) is a stroke: its level width at the extreme takes x_target, the extreme and the nodes its knot
    # carried move by the corrected map (white.keep_slanted_stems; @'s stem stayed 92 > 91 at the Bold while its
    # counter rode the knots 44 right into the bowl's lower stroke, 29 > 17 at 550). After the tapers: their handle
    # lengths, retuned on the engine's counter, would otherwise press the moved counter back into the bowl's stroke.
    # Towards the Bold only: towards the Light the corrected map ran @'s counter into the a's top crotch (contour 0,
    # which the map does not carry) and the stroke between them fell to 10 at 350; the Light keeps the engine's
    # reading (its stem 95 > 92, a debt) until the crotch moves with the map.
    slanted = []
    for g in (reg if v["f"] > 0 else []):
        if not g.contours or g.components or g.name in struck or g.name in signs or g.name not in font:
            continue
        cs = glyph_contours(font[g.name])
        if [len(P) for P in cs] != [len(c.points) for c in g.contours]:
            continue
        new_, log_ = WHITE.keep_slanted_stems(glyph_contours(g), cs, lambda t: x_target(t, True, v))
        if log_:
            for c, P in zip(font[g.name].contours, new_):
                c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            slanted.append(f"{g.name} {log_}")
            resided.add(g.name)
    notes.append(f"slanted stems: {len(slanted)} glyphs ({'; '.join(slanted)})")
    # 0.81 (integration): a glyph whose outline a later rule changed (arm crotches, necks, tapers) takes its sides
    # again, as the engine set them: the Regular's plus the measured change (S's left side was 1.1 off in the Light)
    for name in sorted(resided):
        g = reg[name]
        if not g.width or g.components:
            continue
        r0, r1 = _zone_edges(glyph_contours(g), name)
        cs = glyph_contours(font[name])
        b0, b1 = _zone_edges(cs, name)
        dl, dr = bearing_change(name, v)
        shift = round(r0 + dl - b0)
        if shift:
            for c in font[name].contours:
                for q in c.points:
                    q.x += shift
            for an in font[name].anchors:
                an.x += shift
        font[name].width = round(b1 + shift + (g.width - r1) + dr)
    from ufoLib2.objects import Contour
    layer = font.layers.newLayer("mid")                        # the sparse master: only the glyphs that need one
    for g in reg:
        if not g.contours:
            continue
        if reports.get(g.name, {}).get("fallback") or not reports.get(g.name, {}).get("necks") or g.name in struck:
            continue
        mc = mid_master(glyph_contours(g), glyph_contours(font[g.name]), v)
        if mc is None:
            continue
        mg = layer.newGlyph(g.name)
        tm = (dict(axis_map(stem))[MID_WEIGHT] - REG_STEM) / (stem - REG_STEM)
        mg.width = round(g.width + (font[g.name].width - g.width) * tm)
        for P in mc:
            c = Contour()
            c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            mg.contours.append(c)
        notes.append(f"{g.name}: a master at weight {MID_WEIGHT} (its neck sags between the two)")
    import overlap as OVERLAP                                  # 0.81: a struck glyph whose letter has a mid master
    if OVERLAP.LAYER in reg.layers:                            # takes it, with its strokes half way as they go
        tm_s = (dict(axis_map(stem))[MID_WEIGHT] - REG_STEM) / (stem - REG_STEM)
        for name in sorted((n for n in struck if n in reg.layers[OVERLAP.LAYER]), key=lambda n: (reg.layers[OVERLAP.LAYER][n].lib["area.overlap"]["letter"] in struck, n)):
            og = reg.layers[OVERLAP.LAYER][name]
            info = og.lib["area.overlap"]
            letter, (ox, oy), nl = info["letter"], info["offset"], info["letter_contours"]
            if letter not in layer:
                continue
            mg = layer.newGlyph(name)
            mg.width = round(og.width + (font[name].width - og.width) * tm_s)
            parts_ = [[(q.x + ox, q.y + oy, q.type, q.smooth) for q in c.points] for c in layer[letter].contours]
            parts_ += [[(round(a.x + (b_.x - a.x) * tm_s), round(a.y + (b_.y - a.y) * tm_s), a.type, a.smooth)
                        for a, b_ in zip(c.points, cb.points)] for c, cb in zip(og.contours[nl:], font[name].contours[nl:])]
            for P in parts_:
                c = Contour()
                c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
                mg.contours.append(c)
            notes.append(f"{name}: a master at weight {MID_WEIGHT}, its letter {letter}'s")
    import charset as CHARSET
    # 0.79: no curve of either master gains an extreme or an inflection, here or half way (fix_turns)
    n_fixed = n_left = 0
    tm0 = (dict(axis_map(stem))[MID_WEIGHT] - REG_STEM) / (stem - REG_STEM)
    for g in reg:
        if not g.contours or reports.get(g.name, {}).get("fallback", "").startswith("left as the Regular") or g.name in struck \
                or g.name in signs:                            # round 3: an arm's handles keep their directions
            continue
        for f_, blends in ((layer, ((0.0, 1.0), (0.5, 0.5), (0.75, 0.25), (0.25, 0.75), (0.875, 0.125))),   # round 3: the quarters too
                           (font, ((0.0, 1.0), (0.5, 0.5), (0.75, 0.25), (0.25, 0.75)))):
            if g.name not in f_:
                continue
            for c, rc in zip(f_[g.name].contours, g.contours):
                R_ = [(q.x, q.y, q.type, q.smooth) for q in rc.points]
                N_ = [(q.x, q.y, q.type, q.smooth) for q in c.points]
                if len(R_) != len(N_):
                    continue
                M_, fx, lf = fix_turns(R_, N_, blends)
                n_fixed += fx
                n_left += lf
                if fx:
                    c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in M_]
        if g.name in layer and g.name in font:               # 0.81: and between the mid master and this one
            for c, mc_ in zip(font[g.name].contours, layer[g.name].contours):
                M0 = [(q.x, q.y, q.type, q.smooth) for q in mc_.points]
                N_ = [(q.x, q.y, q.type, q.smooth) for q in c.points]
                if len(M0) != len(N_):
                    continue
                M_, fx, lf = fix_turns(M0, N_)
                n_fixed += fx
                n_left += lf
                if fx:
                    c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in M_]
    infl = []                                                  # 0.81: an inflection drawn at a node stays there
    for g in reg:
        if not g.contours or g.name in struck or g.name in signs:
            continue
        for f_ in (layer, font):
            if g.name not in f_:
                continue
            for c, rc in zip(f_[g.name].contours, g.contours):
                R_ = [(q.x, q.y, q.type, q.smooth) for q in rc.points]
                N_ = [(q.x, q.y, q.type, q.smooth) for q in c.points]
                if len(R_) != len(N_):
                    continue
                M_, lg = inflection_nodes(R_, N_)
                if lg:
                    c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in M_]
                    infl.append(f"{g.name} {lg}")
    notes.append(f"inflections at nodes: {len(infl)} kept there ({'; '.join(infl)})")
    notes.append(f"curves: {n_fixed} brought back to the Regular's turns, {n_left} not")
    # 0.81 (integration): a struck glyph whose letter is itself struck (₫ on đ) after that letter, so it takes the
    # letter as it now is (a set's order changed with the process: ₫'s Light bowl moved up to 26 units build to build)
    struck_order = sorted((n for n in struck if OVERLAP.LAYER in reg.layers and n in reg.layers[OVERLAP.LAYER]),
                          key=lambda n: (reg.layers[OVERLAP.LAYER][n].lib["area.overlap"]["letter"] in struck, n))
    for name in struck_order:                                  # 0.81: the struck glyphs' letters as they now are
        info = reg.layers[OVERLAP.LAYER][name].lib["area.overlap"]
        letter, (ox, oy), nl = info["letter"], info["offset"], info["letter_contours"]
        for f_ in (font, layer):
            if name in f_ and letter in f_:
                for c, lc in zip(f_[name].contours[:nl], f_[letter].contours):
                    c.points = [Point(q.x + ox, q.y + oy, q.type, smooth=q.smooth) for q in lc.points]
    # 0.79: two inks that stand side by side without touching in the Regular (the two marks of a double quote, a
    # dieresis's dots, a bar beside an arrow) never come closer than spacing.MIN_GAP, the face's own least white
    # between two inks. Until 0.78 such glyphs closed up and crossed between 600 and 700. Marks that lap over each
    # other (the double acute and double grave over capitals) are not this rule's.
    import spacing as SPACING
    apart = []
    # round 3: side by side, the white law too (white.py): a narrow white between two inks keeps the letters'
    # counter share of itself towards the Bold, wider ones at least MIN_GAP; towards the Light whites open by
    # themselves (every part thins) and the old floor stays
    if law is None:
        law = WHITE.Law(reg, font)
    if v["f"] > 0:
        def apart_least(g0, _law=law):                       # parts drawn touching are keep_touching's
            return min(SPACING.MIN_GAP, g0) if g0 < 0.5 or not _law.narrow(g0) else _law.least(g0)
    else:
        apart_least = SPACING.MIN_GAP
    for g in reg:
        if len(g.contours) < 2 or g.components or g.name not in font or g.name in struck:
            continue
        moved = keep_apart(glyph_contours(g), glyph_contours(font[g.name]), v["bearing"],
                           SPACING.MIN_GAP if is_mark(g) or mark_kind(g.name) else apart_least)   # marks: their box
        if not moved:
            continue
        shifts, total = moved
        centre = g.width == 0 or is_mark(g)
        for c, dx in zip(font[g.name].contours, shifts):
            for q in c.points:
                q.x += dx - (round(total / 2) if centre else 0)
        if not centre:
            font[g.name].width += total
        if g.name in layer:
            del layer[g.name]
        apart.append(f"{g.name} {total}")
    notes.append(f"side by side: {len(apart)} glyphs opened ({', '.join(apart)})")
    # round 3: a part drawn to touch another (an arrow's bar against its point) stays touching: the edge it touches
    # takes the node's move across itself (white.keep_touching). Signs only: no letter is drawn so.
    import unicodedata as _ud
    touch = []
    for g in reg:
        if not g.contours or g.components or g.name not in font or g.name in struck or not g.unicodes \
                or _ud.category(chr(g.unicodes[0]))[:1] not in ("P", "S"):
            continue
        cs = glyph_contours(font[g.name])
        if [len(P) for P in cs] != [len(c.points) for c in g.contours]:
            continue
        new_, moved_ = WHITE.keep_touching(glyph_contours(g), cs)
        if moved_:
            for c, P in zip(font[g.name].contours, new_):
                c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            touch.append(g.name)
    notes.append(f"touching: {len(touch)} glyphs keep their parts touching ({', '.join(touch)})")
    # round 3: white between two parts of a sign is a counter (white.keep_white): never under the white law's least
    law_ = law
    kept = []
    for g in reg:
        if len(g.contours) < 2 or g.components or g.name not in font or g.name in struck or not g.unicodes \
                or _ud.category(chr(g.unicodes[0]))[:1] not in ("P", "S") or g.name in signs or is_mark(g) \
                or v["f"] <= 0:
            continue
        cs = glyph_contours(font[g.name])
        new_, log_ = WHITE.keep_white(glyph_contours(g), cs, law_)
        if new_ != cs:
            for c, P in zip(font[g.name].contours, new_):
                c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            kept.append(f"{g.name} {log_}")
    notes.append(f"white between parts: {len(kept)} glyphs ({'; '.join(kept)})")
    for g in reg:                                              # 0.81: last, a symmetric sign made so again
        if g.contours and not g.components and g.name in font and g.name not in struck:
            cs = glyph_contours(font[g.name])
            sym, _ = symmetric(g, cs, {})
            if sym != cs:
                for c, P in zip(font[g.name].contours, sym):
                    c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
    # 0.81 (integration): a mirrored pair is one drawing in every master: the right-hand form is the master's
    # left-hand form turned over (mirror_pairs, turn_over; ⇥ crossed itself at 300 where ⇤ did not)
    turned = []
    for a_, b_, mp in mirror_pairs(reg):
        types_ = [[q[2:] for q in P] for P in glyph_contours(reg[b_])]
        for f_ in (font, layer):
            if a_ in f_:
                if b_ not in f_:
                    f_.newGlyph(b_)
                nb = f_[b_]
                old_ = glyph_contours(nb)                      # its own sides, as bearing_change set them
                keep = (min(q[0] for P in old_ for q in P), nb.width - max(q[0] for P in old_ for q in P)) if old_ else None
                nb.clearContours()
                new_ = turn_over(glyph_contours(f_[a_]), f_[a_].width, mp, types_)
                if keep:
                    dx_ = keep[0] - min(q[0] for P in new_ for q in P)
                    new_ = [[(q0[0] + dx_,) + tuple(q0[1:]) for q0 in P] for P in new_]
                for P in new_:
                    c = Contour()
                    c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
                    nb.contours.append(c)
                nb.width = round(max(q[0] for P in new_ for q in P) + keep[1]) if keep else f_[a_].width
            elif b_ in f_ and f_ is layer:
                del layer[b_]
        turned.append(b_)
    notes.append(f"mirrored pairs: {len(turned)} right-hand forms turned over from their left ({', '.join(turned)})")
    # 0.79: a glyph spliced from two letters is spliced again from this master's letters (and from the mid master's,
    # where either letter has one), so its parts are the letters' own at every weight: the single-storey g's bowl
    # is the Bold q's (the engine's own reading of g.ss02 left the bowl light).
    if "g.ss02" in font and "q" in font and "j" in font:
        # 0.81 (integration): the white between the ball and the bowl, inside the one contour, is a counter too: it
        # keeps the white law's least towards the Bold (charset.ball_white; 62 at 400 fell to 38 at 700, law 52)
        w0_ = CHARSET.ball_white(CHARSET._pts(reg["g.ss02"].contours[0]))
        least_g = law.least(w0_) if v["f"] > 0 else None
        CHARSET.single_g(font, least_white=least_g)
        reports["g.ss02"] = {"x": [], "y": [], "necks": [], "spliced": "q and j"}
        if "g.ss02" in layer:
            del layer["g.ss02"]
        if "q" in layer or "j" in layer:
            tm = (dict(axis_map(stem))[MID_WEIGHT] - REG_STEM) / (stem - REG_STEM)

            def at_mid(name):
                if name in layer:
                    return [[(q.x, q.y, q.type, q.smooth) for q in c.points] for c in layer[name].contours]
                return [[(round(a.x + (b_.x - a.x) * tm), round(a.y + (b_.y - a.y) * tm), a.type, a.smooth)
                         for a, b_ in zip(c.points, cb.points)] for c, cb in zip(reg[name].contours, font[name].contours)]
            qm, jm = at_mid("q"), at_mid("j")
            mg = layer.newGlyph("g.ss02")
            mg.width = round(reg["q"].width + (font["q"].width - reg["q"].width) * tm)
            least_m = w0_ * (1 + (law.counter - 1) * tm) if v["f"] > 0 else None    # the law's counter at 550
            for P in CHARSET.single_g_points(max(qm, key=len), min(qm, key=len), max(jm, key=len),
                                                    CHARSET.o_hair(at_mid("o")), least_white=least_m):
                c = Contour()
                c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
                mg.contours.append(c)
            notes.append(f"g.ss02: a master at weight {MID_WEIGHT}, spliced from q's and j's")
    # 0.81 (owner, 15 November), after the splices: the parts curvecheck reads (the descender's loop and tails, the a's and l's
    # alternates, every j or y tail) meet at one curvature at each smooth node in this master as in the Regular
    # (loops.even_nodes: the node's two handle lengths, nodes and tangents kept, no new fault of the part's)
    import curvecheck as _CC
    regions_ = {k: (tuple(r[1]) + (tuple(r[2]) if len(r) > 2 else ())) for k, r in _CC.REGIONS.items()}
    for g in reg:
        if g.name in regions_ or not g.contours or g.components:
            continue
        kinds_ = {_LOOPS.tail_kind(reg, R_) for R_ in glyph_contours(g)} - {None}
        if kinds_:
            regions_[g.name] = regions_[sorted(kinds_)[0]]
    evened = []
    for name, yr_ in regions_.items():
        for f_ in (font, layer):
            if name not in f_ or name not in reg or name in struck:
                continue
            all0 = [[(q.x, q.y, q.type, q.smooth) for q in c_.points] for c_ in f_[name].contours]
            nb0 = len(_CC.report(name, all0, yr_)[0])
            if not nb0:
                continue
            # the part solved with its other edge (loops.even_part): never at the stroke's cost, no place across
            # the stroke thinner by more than half the weight JND
            new_, nb1, thin_ = _LOOPS.even_part(all0, yr_)
            if thin_ or nb1 >= nb0:
                evened.append(f"{name}{' (mid)' if f_ is layer else ''} kept ({nb0} faults; {nb1} {'thinning' if thin_ else 'left'})")
                continue
            for c_, P in zip(f_[name].contours, new_):
                c_.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            evened.append(f"{name}{' (mid)' if f_ is layer else ''} {nb0} > {nb1} faults")
    notes.append(f"curvature at nodes: {len(evened)} contours ({'; '.join(evened)})")
    # 0.79: an f ligature's sides are its letters' (0.78: every one 4 wider on the left than f, ff 22 on the right)
    def _sides(f_, n):
        xs = [q.x for c in f_[n].contours for q in c.points]
        return min(xs), f_[n].width - max(xs)
    tm_ = (dict(axis_map(stem))[MID_WEIGHT] - REG_STEM) / (stem - REG_STEM)
    for name, rest in CHARSET.LIGATURES.items():
        last = {"i": "idotless", "j": "jdotless"}.get(rest[0], rest[0]) if rest else "f"
        if name not in font or last not in font or font[name].components:
            continue
        wl, wr = _sides(font, "f")[0], _sides(font, last)[1]
        todo = [(font, wl, wr)]
        if name in layer:                                      # its mid master: the letters' sides at that weight
            ml = _sides(layer, "f")[0] if "f" in layer else _sides(reg, "f")[0] + (wl - _sides(reg, "f")[0]) * tm_
            mr = _sides(layer, last)[1] if last in layer else _sides(reg, last)[1] + (wr - _sides(reg, last)[1]) * tm_
            todo.append((layer, round(ml), round(mr)))
        for f_, sl, sr in todo:
            d = sl - _sides(f_, name)[0]
            for c in f_[name].contours:
                for q in c.points:
                    q.x += d
            for an in f_[name].anchors:
                an.x += d
            f_[name].width = max(q.x for c in f_[name].contours for q in c.points) + sr
    # Kerning: the Regular's pairs and groups, unchanged (a pair keeps its designed fit; both masters share one set
    # of groups), then the Regular's own collision pass on the Bold's ink: no pair closer than spacing.MIN_GAP.
    import spacing as SPACING
    opened = SPACING.open_all(font, CHARSET.COVERAGE)
    notes.append(f"kerning: {len(opened)} pairs opened to {SPACING.MIN_GAP} on the Bold's ink")
    import overlap as OVERLAP
    if OVERLAP.LAYER in font.layers:                           # the master's own default layer holds these now
        del font.layers[OVERLAP.LAYER]
    font.info.styleName = "Bold"
    font.info.openTypeOS2WeightClass = 700
    return font, reports, notes


WEIGHTS = (400, 450, 500, 550, 600, 650, 700)


LIGHT_WEIGHTS = (300, 350)


def axis_map(stem=STEM, weights=WEIGHTS):
    """Weight to stem, an equal ratio a step (the research report: optically even steps lie on a geometric curve;
    the axis's design values are the lowercase stem, as in Libre Baskerville's own source). Under 400 the curve
    runs to the Light's stem at 300 the same way."""
    q = stem / REG_STEM
    return [(w, REG_STEM * q ** ((w - 400) / 300) if w >= 400 else REG_STEM * (LIGHT_STEM / REG_STEM) ** ((400 - w) / 100))
            for w in weights]


def variable(reg, bold_ufo, stem=STEM, light_ufo=None):
    """The masters as one variable font (0.80: with the Light, 300 to 700). Fails on any master ufo2ft cannot
    interpolate."""
    import logging
    import ufo2ft
    from fontTools.designspaceLib import AxisDescriptor, DesignSpaceDocument, InstanceDescriptor, SourceDescriptor
    ds = DesignSpaceDocument()
    ax = AxisDescriptor()
    ax.name, ax.tag, ax.minimum, ax.default, ax.maximum = "Weight", "wght", 300 if light_ufo else 400, 400, 700
    ax.map = (axis_map(stem, LIGHT_WEIGHTS) if light_ufo else []) + axis_map(stem)
    ds.addAxis(ax)
    for ufo, loc, style in ((reg, REG_STEM, "Regular"), (bold_ufo, stem, "Bold")) + (((light_ufo, LIGHT_STEM, "Light"),) if light_ufo else ()):
        src = SourceDescriptor()
        src.font, src.location, src.familyName, src.styleName = ufo, {"Weight": loc}, reg.info.familyName, style
        ds.addSource(src)
    if "mid" in bold_ufo.layers and len(bold_ufo.layers["mid"]):
        src = SourceDescriptor()
        src.font, src.layerName, src.familyName, src.styleName = bold_ufo, "mid", reg.info.familyName, "Mid"
        src.location = {"Weight": dict(axis_map(stem))[MID_WEIGHT]}
        ds.addSource(src)
    for w, style in (((300, "Light"),) if light_ufo else ()) + ((400, "Regular"), (500, "Medium"), (600, "SemiBold"), (700, "Bold")):
        inst = InstanceDescriptor()
        inst.familyName, inst.styleName = reg.info.familyName, style
        inst.location = {"Weight": dict(axis_map(stem, LIGHT_WEIGHTS + WEIGHTS))[w]}
        ds.addInstance(inst)

    class _Catch(logging.Handler):
        def __init__(self):
            super().__init__(logging.WARNING)
            self.lines = []

        def emit(self, r):
            self.lines.append(r.getMessage())
    catch = _Catch()
    logging.getLogger().addHandler(catch)
    try:
        vf = ufo2ft.compileVariableTTF(ds, flattenComponents=True)
    finally:
        logging.getLogger().removeHandler(catch)
    bad = [line for line in catch.lines if "incompatible" in line.lower() or "skipping" in line.lower()]
    if bad:
        raise SystemExit("variable font: " + "; ".join(bad[:10]))
    return vf
