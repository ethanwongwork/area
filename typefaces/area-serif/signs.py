"""Area Serif 0.82 (owner round 8): signs built from strokes, one construction each, run again in every master.

A sign of plain strokes (the erase keys, the check, the radical, < and >, <= and >=, the multiplication sign) is
centrelines and stroke weights, and its outline is solved from them: each edge a line at half the stroke from its
centreline, each corner where two edge lines meet (a mitre: an inner outline is a true inset of the outer, an inner
point is sharp), each end cut as its kind says. Nothing here is a union of overlapping bars.

The Regular takes the construction at the Regular's weights (`charset`, which stores the recipe in the glyph's lib
under LIB). Each master takes the same construction with every stroke times the sign law, 1 + (bold.SIGN - 1) ft,
the minus's own law (52 > 40 at 300, > 71 at 700), carried onto the Regular's final points corner by corner
(`bold.construction_signs`): every corner and the points rounding it move as the construction's corner moves. The
corners are linear in the stroke weight, so the 550 instance between the Regular and the Bold is the construction
at its own weight too.

Builders return (outer contours, holes), each a list of (x, y) corners, the same number and order of corners at any
weight. `s` multiplies every stroke weight; `white(w)` (masters only) is the least white the law keeps for a white
that is w in the Regular.
"""
import math

LIB = "area.sign"

# The references' outer flat at the point of < (upright, across the two outer edges), over the stroke across itself
# at 400: Georgia Pro 0.92 (Bold 0.85), Serrif 0.78, Source Serif 4 0.81, Literata 0.72, Merriweather 0.76: median 0.79
# A vertex's outside flat across the bisector, over the stroke (parts.VERTEX: 0.42 of the class's stem)
VERTEX = 0.42
# 0.84 (Regular pass 2, item 5: one corner rule): a point where two strokes meet is finished as the letters' apexes are.
# Measured on the Regular (build/owner9/corners/census.py): v w 33.0, A V W M N 36.0, each a flat across the bisector,
# 0.42 of the class's stem, 0.77 of the class's hairline (33 / 43, 36 / 47). A sign's vertex takes the lowercase's,
# LETTER_FLAT, at the Regular: an arrow's point, a chevron's, the check's elbow, the radical's foot, the control key's.
# It was 21.5 at the arrows' points (0.5 of the hairline), 41 at < > ^ (LESS_FLAT 0.79 of the stroke, the references'
# median), 31.5 at the radical's foot (0.42 of its thick), the control key's apex mitred and softened on 7
LETTER_FLAT = VERTEX * 78.0                            # 32.8: v's outside flat
LESS_FLAT = LETTER_FLAT / 52.0                         # 0.630 of the plain stroke (it was 0.79)


# ---------------------------------------------------------------- geometry

def unit(a, b):
    d = math.hypot(b[0] - a[0], b[1] - a[1])
    return ((b[0] - a[0]) / d, (b[1] - a[1]) / d)


def left(d):
    return (-d[1], d[0])


def line(p, d, off=0.0):
    """The line through p along d, moved off to d's left."""
    n = left(d)
    return ((p[0] + n[0] * off, p[1] + n[1] * off), d)


def meet(L1, L2):
    (p, u), (q, v) = L1, L2
    den = u[0] * v[1] - u[1] * v[0]
    t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den
    return (p[0] + u[0] * t, p[1] + u[1] * t)


def area(P):
    return sum(P[i][0] * P[(i + 1) % len(P)][1] - P[(i + 1) % len(P)][0] * P[i][1] for i in range(len(P))) / 2


def offset_polygon(P, d):
    """A closed polygon moved d inward along every edge (negative: outward); corners where the moved edges meet."""
    sg = 1 if area(P) > 0 else -1                       # counter-clockwise: the inside is each edge's left
    n = len(P)
    L = [line(P[i], unit(P[i], P[(i + 1) % n]), sg * d) for i in range(n)]
    return [meet(L[i - 1], L[i]) for i in range(n)]


def inset_edges(P, ds):
    """A closed polygon's inside outline with each edge moved in by its own distance (ds[i] for P[i] to P[i + 1])."""
    sg = 1 if area(P) > 0 else -1
    n = len(P)
    L = [line(P[i], unit(P[i], P[(i + 1) % n]), sg * ds[i]) for i in range(n)]
    return [meet(L[i - 1], L[i]) for i in range(n)]


def stroke_polyline(P, W, flat=None):
    """An open polyline stroked: segment i (P[i] to P[i + 1]) is W[i] wide about its centreline; joints mitred
    (flat: {joint index: width} cuts that joint's outside across its bisector where the outer edges are that far
    apart); both ends cut square to their segment. One contour: the left side forward, the right side back."""
    flat = flat or {}
    n = len(P) - 1
    D = [unit(P[i], P[i + 1]) for i in range(n)]
    Lft = [line(P[i], D[i], W[i] / 2) for i in range(n)]
    Rgt = [line(P[i], D[i], -W[i] / 2) for i in range(n)]
    ls, rs = [], []
    nl0, nl1 = left(D[0]), left(D[-1])
    ls.append((P[0][0] + nl0[0] * W[0] / 2, P[0][1] + nl0[1] * W[0] / 2))
    rs.append((P[0][0] - nl0[0] * W[0] / 2, P[0][1] - nl0[1] * W[0] / 2))
    for j in range(1, n):
        a, b = meet(Lft[j - 1], Lft[j]), meet(Rgt[j - 1], Rgt[j])
        turn = D[j - 1][0] * D[j][1] - D[j - 1][1] * D[j][0]      # > 0: a left turn, the outside is the right
        if j in flat:
            out_, (o1, o2) = (b, (Rgt[j - 1], Rgt[j])) if turn > 0 else (a, (Lft[j - 1], Lft[j]))
            inn = a if turn > 0 else b
            bis = unit(out_, inn)                                   # into the ink
            e1, e2 = (-o1[1][0], -o1[1][1]), o2[1]                  # the two outer edges leaving the point
            half = math.acos(max(-1.0, min(1.0, e1[0] * e2[0] + e1[1] * e2[1]))) / 2
            s_ = flat[j] / (2 * math.tan(half))
            cut = ((out_[0] + bis[0] * s_, out_[1] + bis[1] * s_), left(bis))
            f1, f2 = meet(o1, cut), meet(o2, cut)
            if turn > 0:
                ls.append(inn)
                rs += [f1, f2]
            else:
                ls += [f1, f2]
                rs.append(inn)
        else:
            ls.append(a)
            rs.append(b)
    ls.append((P[-1][0] + nl1[0] * W[-1] / 2, P[-1][1] + nl1[1] * W[-1] / 2))
    rs.append((P[-1][0] - nl1[0] * W[-1] / 2, P[-1][1] - nl1[1] * W[-1] / 2))
    return ls + rs[::-1]


def cross(c, L, w, angles=(45, 135)):
    """Two straight strokes of width w crossing at c, each arm L from c along its centreline, ends cut square:
    one contour of twelve corners (four ends, four crotches where the edges meet)."""
    dirs = []
    for a in angles:
        r = math.radians(a)
        dirs += [(math.cos(r), math.sin(r)), (-math.cos(r), -math.sin(r))]
    dirs.sort(key=lambda d: math.atan2(d[1], d[0]))
    out = []
    for k, d in enumerate(dirs):
        nxt = dirs[(k + 1) % 4]
        n = left(d)
        e = (c[0] + d[0] * L, c[1] + d[1] * L)
        out += [(e[0] - n[0] * w / 2, e[1] - n[1] * w / 2), (e[0] + n[0] * w / 2, e[1] + n[1] * w / 2)]
        out.append(meet(line(c, d, w / 2), line(c, nxt, -w / 2)))
    return out


# ---------------------------------------------------------------- the constructions

def erase(p, s=1.0, white=None):
    """The erase key (U+232B; U+2326 is it turned over): a frame of one stroke all round, a pentagon pointing left,
    its centreline the Regular outer outline moved in half the Regular stroke; a cross of the same stroke centred in
    the box part (half way between the shoulders' and the right side's centrelines, on the frame's middle)."""
    t0, t = p["t"], p["t"] * s
    tw, th, y0, sh = p["tw"], p["th"], p["y0"], p["shoulder"]
    outer0 = [(tw, y0), (tw, y0 + th), (sh, y0 + th), (0.0, y0 + th / 2), (sh, y0)]
    if p.get("stress"):                                 # 0.83 (symbols 2, A)
        lo0, hi0 = p["stress"]
        mid = inset_edges(outer0, [stress_w(outer0[i], outer0[(i + 1) % 5], lo0, hi0) / 2 for i in range(5)])
        outer, inner = stress_frame(mid, lo0 * s, hi0 * s)
    else:
        mid = offset_polygon(outer0, t0 / 2)
        outer, inner = offset_polygon(mid, -t / 2), offset_polygon(mid, t / 2)
    cy = y0 + th / 2
    cx = (mid[2][0] + mid[0][0]) / 2
    L = p["arm"]
    if white is not None:                               # the white round the cross keeps the law's least
        def gaps(L_, t_, inn):
            ext = L_ / math.sqrt(2) + t_ / (2 * math.sqrt(2))
            return min(inn[1][1] - (cy + ext), inn[0][0] - (cx + ext))
        inner0 = offset_polygon(mid, t0 / 2)
        need = white(gaps(L, t0, inner0))
        if gaps(L, t, inner) < need:
            L = (min(inner[1][1] - cy, inner[0][0] - cx) - need) * math.sqrt(2) - t / 2
    X = cross((cx, cy), L, t)
    if p.get("soft"):
        outer, X = soften(outer), soften(X)
    return [outer], [inner], [X]


def check(p, s=1.0, white=None):
    """The check (U+2713): a short stroke down into the vertex and a long one up from it, one weight (the check's
    1.25 of the plain stroke) at every weight; ends cut square to their stroke; the vertex a flat outside (0.42 of the
    stroke, across the bisector) and a point inside."""
    t = p["t"] * s
    pts = [tuple(p["start"]), tuple(p["vertex"]), tuple(p["end"])]
    return [stroke_polyline(pts, [t, t], flat={1: VERTEX * t})], [], []


def radical(p, s=1.0, white=None):
    """The radical (U+221A): a thin lead-in stroke rising into the top of a thick downstroke, a thin upstroke from
    the foot to the top, a level overbar. The two outer edges meet in the foot's point, which stays; each stroke
    grows inward from its outer edge (thick: thick stroke, its fixed share of the thin); the lead-in about its
    centreline, its top edge meeting the downstroke's right edge in a point, its lower edge the left edge in the
    crotch; the upstroke's left edge meets the bar's top in a corner, its right edge the bar's underside."""
    tn, tk, tb = p["thin"] * s, p["thick"] * s, p["bar"] * s
    B, V, T = p["B"], p["V"], p["T"]
    top, xr = p["top"], p["right"]
    u1, u2 = unit(V, B), unit(V, T)
    W1 = (V, u1)                                       # the downstroke's left edge
    E1 = line(V, u1, -tk)                              # its right edge
    E2 = (V, u2)                                       # the upstroke's right edge
    W2 = line(V, u2, tn)                               # its left edge
    Vi = meet(E1, W2)
    C2 = meet(W2, ((0, top), (1, 0)))
    C1 = meet(E2, ((0, top - tb), (1, 0)))
    H0, H1 = p["hook"]
    uh = unit(H0, H1)
    Hl, Hu = line(H0, uh, -tn / 2), line(H0, uh, tn / 2)
    K, P = meet(Hl, W1), meet(Hu, E1)
    nh = left(uh)
    El = (H0[0] - nh[0] * tn / 2, H0[1] - nh[1] * tn / 2)
    Eu = (H0[0] + nh[0] * tn / 2, H0[1] + nh[1] * tn / 2)
    foot = [V]
    if p.get("flat"):                                  # 0.83 (symbols 1): the foot a vertex, a flat across the bisector
        e1, e2 = u1, u2                                # where the two outer edges are `flat` (times the stroke law) apart
        half = math.acos(max(-1.0, min(1.0, e1[0] * e2[0] + e1[1] * e2[1]))) / 2
        bis = unit((0, 0), (e1[0] + e2[0], e1[1] + e2[1]))
        d_ = p["flat"] * s / (2 * math.tan(half))
        cut = ((V[0] + bis[0] * d_, V[1] + bis[1] * d_), left(bis))
        foot = [meet(E2, cut), meet(W1, cut)]
    return [[P, Vi, C2, (xr, top), (xr, top - tb), C1] + foot + [K, El, Eu]], [], []


def chevron(p, s=1.0, white=None):
    """< (U+003C; > is it turned over): two arms of the plain stroke meeting at the point, both ends cut upright at
    one x, the outside of the point an upright flat LESS_FLAT of the stroke, the inside a point where the inner edges
    meet. The centrelines are solved once at the Regular's stroke so the ink fills the Regular box (x0 to x1, cy
    plus and minus hh); the masters keep the centrelines."""
    t0, t = p["t"], p["t"] * s
    x0, x1, cy, hh = p["x0"], p["x1"], p["cy"], p["hh"]
    lo, hi = 1.0, 80.0                                  # the arms' angle, solved by halving at the Regular's stroke
    for _ in range(60):
        th = math.radians((lo + hi) / 2)
        xv = x0 - (LESS_FLAT * t0 / 2 - t0 / (2 * math.cos(th))) / math.tan(th)
        if (x1 - xv) * math.tan(th) + t0 / (2 * math.cos(th)) > hh:
            hi = (lo + hi) / 2
        else:
            lo = (lo + hi) / 2
    th = math.radians((lo + hi) / 2)
    xv = x0 - (LESS_FLAT * t0 / 2 - t0 / (2 * math.cos(th))) / math.tan(th)
    tn, c = math.tan(th), math.cos(th)
    xf = xv + (LESS_FLAT * t / 2 - t / (2 * c)) / tn  # where the outer edges are LESS_FLAT t apart
    yo = (x1 - xv) * tn + t / (2 * c)                 # the ends' outer and inner corners, above cy
    yi = (x1 - xv) * tn - t / (2 * c)
    xi = xv + t / (2 * c) / tn                         # the inner point
    hf = LESS_FLAT * t / 2
    return [[(x1, cy + yo), (x1, cy + yi), (xi, cy), (x1, cy - yi), (x1, cy - yo), (xf, cy - hf), (xf, cy + hf)]], [], []


def chevron_bar(p, s=1.0, white=None):
    """<= (U+2264; >= is it turned over): the chevron over a level bar of the plain stroke, each on its own
    centreline."""
    o, _, _ = chevron(p, s)
    t = p["t"] * s
    x0, x1, yb = p["bar_x0"], p["x1"], p["bar_y"]
    return o + [[(x0, yb - t / 2), (x1, yb - t / 2), (x1, yb + t / 2), (x0, yb + t / 2)]], [], []


def times(p, s=1.0, white=None):
    """The multiplication sign (U+00D7): two strokes of the plain weight crossing square on the maths axis, the
    arms equal, ends cut square."""
    return [cross(tuple(p["c"]), p["arm"], p["t"] * s)], [], []


SOFT = 7          # the letters' radius on a stroke's cut end (derive.SOFT); the A signs' outer corners take it


def stress_w(a, b, lo, hi):
    """The A signs' stroke along the edge a to b: lo level, hi upright, lo + (hi - lo) sin^2 between."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    return lo + (hi - lo) * dy * dy / (dx * dx + dy * dy)


def soften(P, r=SOFT, k=0.55, keep=()):
    """A polygon's convex corners (the ink's outside corners: for an outer contour, those turning its own way)
    rounded on r as the letters' cut ends are (a point r along each edge, the handles k of the way to the corner);
    concave corners (meetings) stay sharp, and so do the corners in `keep` (a vertex's flat: 0.84, as the letters')."""
    ar = area(P)
    n = len(P)
    out = []
    for i in range(n):
        a, p_, b = P[i - 1], P[i], P[(i + 1) % n]
        cr = (p_[0] - a[0]) * (b[1] - p_[1]) - (p_[1] - a[1]) * (b[0] - p_[0])
        if i in keep or cr * ar <= 1e-9 or math.dist(a, p_) < 3 * r or math.dist(p_, b) < 3 * r:
            out.append(p_)
            continue
        ua, ub = unit(p_, a), unit(p_, b)
        pa = (p_[0] + ua[0] * r, p_[1] + ua[1] * r)
        pb = (p_[0] + ub[0] * r, p_[1] + ub[1] * r)
        out.append(pa)
        out.append(("c", (pa[0] + (p_[0] - pa[0]) * k, pa[1] + (p_[1] - pa[1]) * k),
                    (pb[0] + (p_[0] - pb[0]) * k, pb[1] + (p_[1] - pb[1]) * k), pb))
    return out


def stress_frame(mid, lo, hi):
    """An outline of one stroke all round its centreline polygon `mid`, each edge's stroke by stress_w: (outer,
    inner), every corner where two moved edges meet."""
    n = len(mid)
    ws = [stress_w(mid[i], mid[(i + 1) % n], lo, hi) for i in range(n)]
    return inset_edges(mid, [-w / 2 for w in ws]), inset_edges(mid, [w / 2 for w in ws])


def frame(p, s=1.0, white=None):
    """A closed outline of one stroke all round (the shift arrow, caps lock, the lozenge): the centreline is the
    Regular outer outline moved in half the Regular stroke, the outlines half the stroke either side of it, so the
    inner outline is a true inset at every weight. caps lock's bar (bar: x0, x1, gap) is a level stroke under the
    outline's foot, the Regular's gap below it (in a master towards the Bold, the law's least for that gap)."""
    t0, t = p["t"], p["t"] * s
    if p.get("stress"):                                 # 0.83 (symbols 2, A): uprights hi, levels lo, between by sin^2
        lo0, hi0 = p["stress"]
        P0 = [tuple(q) for q in p["outer"]]
        n_ = len(P0)
        mid = inset_edges(P0, [stress_w(P0[i], P0[(i + 1) % n_], lo0, hi0) / 2 for i in range(n_)])
        outer, inner = stress_frame(mid, lo0 * s, hi0 * s)
        t = lo0 * s                                     # caps lock's bar: a level stroke
    else:
        mid = offset_polygon([tuple(q) for q in p["outer"]], t0 / 2)
        outer, inner = offset_polygon(mid, -t / 2), offset_polygon(mid, t / 2)
    more = []
    if p.get("bar"):
        b = p["bar"]
        foot = min(q[1] for q in outer)
        gap = white(b["gap"]) if white is not None else b["gap"]
        more.append([(b["x0"], foot - gap - t), (b["x1"], foot - gap - t), (b["x1"], foot - gap), (b["x0"], foot - gap)])
    if p.get("soft"):
        outer = soften(outer)
        more = [soften(q) for q in more]
    return [outer], [inner], more


def caret(p, s=1.0, white=None):
    """The control key (U+2303): the arrows' head alone, two strokes of the plain weight meeting in a point (outside
    and inside mitred, as the arrows' heads), ends cut square. It was the up arrow cut across with its shaft's stub
    taken out: a 54 by 16 notch in the crotch and two 2-unit steps at the ends."""
    a, h, t = p["apex"], p["head"], p["t"] * s
    dx = p.get("run", h - p["t"] / 2)                   # the arrows' head stroke: across run (0.82: h - t/2), down h
    # 0.84 (item 5): the apex a vertex, the letters' flat (LESS_FLAT of the stroke: 33 at the Regular), its two
    # corners sharp as v's; the free ends' corners soft
    P = stroke_polyline([(a[0] - dx, a[1] - h), tuple(a), (a[0] + dx, a[1] - h)], [t, t], flat={1: LESS_FLAT * t})
    flat_i = {i for i, q in enumerate(P) if math.dist(q, tuple(a)) < 2 * t} - {i for i, q in enumerate(P) if q[1] < a[1] - h + 1}
    return [soften(P, keep=flat_i) if p.get("soft") else P], [], []


def option(p, s=1.0, white=None):
    """The option key (U+2325), A: a level stroke, a falling stroke, a level stroke (one centreline, mitred), and a
    short level stroke at the top right; each segment's stroke by stress_w; outer corners soft."""
    lo, hi = p["stress"][0] * s, p["stress"][1] * s
    lo0 = p["stress"][0]
    W, t_ = p["W"], p["top"]
    y0 = p["y0"]
    yt, yb = y0 + t_ - lo0 / 2, y0 + lo0 / 2         # the level strokes' centrelines (their outer edges fixed)
    x1, x2 = p["x1"], p["x2"]
    C = [(0.0, yt), (x1, yt), (x2, yb), (W, yb)]
    ws = [stress_w(C[i], C[i + 1], lo, hi) for i in range(3)]
    P = stroke_polyline(C, ws)
    bar_ = [(p["x3"], yt - lo / 2), (W, yt - lo / 2), (W, yt + lo / 2), (p["x3"], yt + lo / 2)]
    return [soften(P), soften(bar_)], [], []


BUILDERS = {"option": option, "caret": caret, "frame": frame, "erase": erase, "check": check, "radical": radical, "chevron": chevron, "chevron_bar": chevron_bar,
            "times": times}


TAPERED = set()


def build(info, s=1.0, white=None, sh=None):
    """(outer contours, holes, more outer contours) for a stored recipe {"build": name, "params": {...}}. sh: the
    hairline's law, for the tapered signs (their join is the hairline); s the plain stroke's."""
    if info["build"] in TAPERED:
        import json as _json
        key = _json.dumps(info, sort_keys=True)
        regular = s == 1.0 and (sh is None or sh == 1.0)
        if regular:
            _PLAN.clear()
            _PLAN["record"] = []
        elif key in _PLANS:
            _PLAN.clear()
            _PLAN["replay"] = [list(x) for x in _PLANS[key]]
        try:
            out = BUILDERS[info["build"]](info["params"], s, white, sh=s if sh is None else sh)
        finally:
            if regular:
                _PLANS[key] = _PLAN.get("record", [])
            _PLAN.clear()
        return out
    return BUILDERS[info["build"]](info["params"], s, white)


def corners(info, s=1.0, white=None, sh=None):
    """Every point of the construction (corners, and the points of its curves), in one fixed order."""
    a, b, c = build(info, s, white, sh)
    out = []
    for P in a + b + c:
        for q in P:
            if q[0] == "c":
                out += [q[1], q[2], q[3]]
            else:
                out.append(q)
    return out


# ---------------------------------------------------------------- 0.83 (Regular pass, symbols): strokes with a width
# profile along a centreline (as arms.py reads the asterisk's arms), outlines fitted as cubics

def fit_cubic(S, d0, d1):
    """One cubic through the samples S (first and last fixed), leaving along d0 and arriving along d1 (unit vectors,
    the direction of travel at both ends); the two handle lengths by least squares on chord-length parameters, then
    the parameters refined against the curve twice."""
    p0, p3 = S[0], S[-1]
    L = [0.0]
    for a, b in zip(S, S[1:]):
        L.append(L[-1] + math.dist(a, b))
    T = [l / L[-1] for l in L]
    span = math.dist(p0, p3)
    al = be = span / 3
    for _ in range(4):
        # B(t) = A0 + al * A1 + be * A2, A1 = 3u^2 t d0, A2 = -3u t^2 d1
        a11 = a12 = a22 = r1 = r2 = 0.0
        for (x, y), t in zip(S, T):
            u = 1 - t
            b0, b3 = u ** 3 + 3 * u * u * t, 3 * u * t * t + t ** 3
            ax, ay = b0 * p0[0] + b3 * p3[0], b0 * p0[1] + b3 * p3[1]
            c1 = (3 * u * u * t * d0[0], 3 * u * u * t * d0[1])
            c2 = (-3 * u * t * t * d1[0], -3 * u * t * t * d1[1])
            a11 += c1[0] ** 2 + c1[1] ** 2
            a12 += c1[0] * c2[0] + c1[1] * c2[1]
            a22 += c2[0] ** 2 + c2[1] ** 2
            r1 += c1[0] * (x - ax) + c1[1] * (y - ay)
            r2 += c2[0] * (x - ax) + c2[1] * (y - ay)
        det = a11 * a22 - a12 * a12
        if abs(det) > 1e-9:
            al, be = (r1 * a22 - r2 * a12) / det, (a11 * r2 - a12 * r1) / det
        al, be = max(al, span * 0.05), max(be, span * 0.05)
        den_ = d0[0] * d1[1] - d0[1] * d1[0]           # the handles stay inside their triangle: neither runs past
        if abs(den_) > 1e-9:                           # the point where the two end directions meet
            ta = ((p3[0] - p0[0]) * d1[1] - (p3[1] - p0[1]) * d1[0]) / den_
            tb = (d0[0] * (p3[1] - p0[1]) - d0[1] * (p3[0] - p0[0])) / den_
            if ta > 0 and tb > 0:
                al, be = min(al, 0.92 * ta), min(be, 0.92 * tb)
        P = [p0, (p0[0] + d0[0] * al, p0[1] + d0[1] * al), (p3[0] - d1[0] * be, p3[1] - d1[1] * be), p3]
        T2 = []
        for (x, y), t in zip(S, T):                      # Newton on each parameter
            for _k in range(3):
                u = 1 - t
                B = [u ** 3 * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t ** 3 * P[3][i] for i in (0, 1)]
                D = [3 * u * u * (P[1][i] - P[0][i]) + 6 * u * t * (P[2][i] - P[1][i]) + 3 * t * t * (P[3][i] - P[2][i]) for i in (0, 1)]
                E = [6 * u * (P[2][i] - 2 * P[1][i] + P[0][i]) + 6 * t * (P[3][i] - 2 * P[2][i] + P[1][i]) for i in (0, 1)]
                num = (B[0] - x) * D[0] + (B[1] - y) * D[1]
                den = D[0] ** 2 + D[1] ** 2 + (B[0] - x) * E[0] + (B[1] - y) * E[1]
                if abs(den) < 1e-9:
                    break
                t = min(1.0, max(0.0, t - num / den))
            T2.append(t)
        T = T2
    return P


def offset_sides(C, nodes, width, n=32):
    """A centreline C(t) -> (x, y) stroked with width(t) across: the left and the right edge, each a list of cubics
    (p0, p1, p2, p3), one per span between consecutive node parameters. Every point of an edge is the centreline
    point moved half the width along the centreline's normal; each span's cubic leaves and arrives along the edge's
    own tangent (read from the edge, so a changing width tilts it) and is fitted to the edge between."""
    h = 1e-5

    def edge(t, sg):
        (x, y), (xa, ya), (xb, yb) = C(t), C(t - h), C(t + h)
        dx, dy = xb - xa, yb - ya
        m = math.hypot(dx, dy)
        w = width(t) / 2 * sg
        return (x - dy / m * w, y + dx / m * w)

    def tan(t, sg, at_start):
        a, b = (edge(t, sg), edge(t + 1e-4, sg)) if at_start else (edge(t - 1e-4, sg), edge(t, sg))
        return unit(a, b)
    sides = []
    for sg in (1, -1):
        segs = []
        for t0, t1 in zip(nodes, nodes[1:]):
            S = [edge(t0 + (t1 - t0) * k / n, sg) for k in range(n + 1)]
            segs.append(fit_cubic(S, tan(t0, sg, True), tan(t1, sg, False)))
        sides.append(segs)
    return sides


def stress(lo, hi):
    """The signs' damped upright stress (the letters' own, much damped): a stroke lo wide where it runs level, hi
    where it runs upright, lo + (hi - lo) sin^2 between, as a function of the direction (dx, dy)."""
    def w(dx, dy):
        s2 = dy * dy / (dx * dx + dy * dy)
        return lo + (hi - lo) * s2
    return w


def _dir(C, t, h=1e-5):
    (xa, ya), (xb, yb) = C(t - h), C(t + h)
    return xb - xa, yb - ya


def ribbon(C, nodes, width):
    """The stroked centreline as closed pieces (shape() contours), one per span: left edge forward, right edge back.
    Unioned they are the ink; the pieces' cut lines are shared exactly, so nothing is left on them."""
    L, R = offset_sides(C, nodes, width)
    out = []
    for a, b in zip(L, R):
        out.append([a[0], ("c", a[1], a[2], a[3]), b[3], ("c", b[2], b[1], b[0])])
    return out


WAVE_INFL_R = 4000.0   # 0.84 (pass 2): an edge's radius where it reaches an inflection node (not 0: a node where both
                       # sides read flat cannot be told from a kink in whole units; at 4000 the curvature still only
                       # falls from the extreme to the node, curvecheck reads the node as a flip, and whole-unit
                       # rounding, at most 0.6e-4, leaves its sign)


def _g2_cubic(p0, T0, k0, p3, T1, k1, balanced=False):
    """The cubic from p0 (leaving along T0, signed curvature k0) to p3 (arriving along T1, curvature k1): both
    handle lengths solved so the curvature at each end is the one asked (G2 Hermite). None if no positive pair. Of
    several solutions the first (shortest first handle), or with `balanced` the one whose two handles are nearest
    equal (a near-zero handle is a solution too, and a cusp)."""
    cr = lambda a, b: a[0] * b[1] - a[1] * b[0]                 # noqa: E731
    D = (p3[0] - p0[0], p3[1] - p0[1])
    c = cr(T0, T1)
    if abs(c) < 1e-12:
        return None

    def fa(a):
        b = (cr(T0, D) - 1.5 * k0 * a * a) / c
        return 1.5 * k1 * b * b - (cr(D, T1) - a * c)
    span = math.hypot(*D)
    grid = [span * (i + 1) / 400 for i in range(1000)]          # up to 2.5 chords (a nearly straight span)
    vals = [fa(a) for a in grid]
    sols = []
    for i in range(len(grid) - 1):
        if vals[i] * vals[i + 1] > 0:
            continue
        lo_, hi_ = grid[i], grid[i + 1]
        for _ in range(80):
            mid = (lo_ + hi_) / 2
            if fa(lo_) * fa(mid) <= 0:
                hi_ = mid
            else:
                lo_ = mid
        a = (lo_ + hi_) / 2
        b = (cr(T0, D) - 1.5 * k0 * a * a) / c
        if a > 0 and b > 0:
            sols.append((a, b))
            if not balanced:
                break
    if not sols:
        return None
    a, b = min(sols, key=lambda ab: abs(math.log(ab[0] / ab[1]))) if balanced else sols[0]
    return (p0, (p0[0] + T0[0] * a, p0[1] + T0[1] * a), (p3[0] - T1[0] * b, p3[1] - T1[1] * b), p3)


def wave_sides(C, nodes, width, extremes, r_infl=WAVE_INFL_R):
    """0.84 (Regular pass 2, item 2, second pass): a wave's two edges, each the parallel of the centreline C at half
    the width (laid on symmetrically along the normal). Each span runs between an extreme (a crest or trough of the
    centreline; `extremes` the node parameters that are) and an inflection; its cubic is solved for the edge's own
    curvature at the extreme (read on the parallel itself) and WAVE_INFL_R at the inflection (G2 at both ends), so the
    curvature only falls from the extreme to the inflection and changes sign there once. Returns (left, right)."""
    h = 1e-5

    def edge(t, sg):
        (x, y), (xa, ya), (xb, yb) = C(t), C(t - h), C(t + h)
        dx, dy = xb - xa, yb - ya
        m = math.hypot(dx, dy)
        w = width(t) / 2 * sg
        return (x - dy / m * w, y + dx / m * w)

    def k_at(t, sg, e=1e-3):
        a, b, c = edge(t - e, sg), edge(t, sg), edge(t + e, sg)
        d1 = ((c[0] - a[0]) / 2, (c[1] - a[1]) / 2)
        d2 = (c[0] - 2 * b[0] + a[0], c[1] - 2 * b[1] + a[1])
        return (d1[0] * d2[1] - d1[1] * d2[0]) / math.hypot(*d1) ** 3

    def tan(t, sg):
        return unit(edge(t - 1e-4, sg), edge(t + 1e-4, sg))
    sides = []
    for sg in (1, -1):
        segs = []
        for t0, t1 in zip(nodes, nodes[1:]):
            ext0 = any(abs(t0 - e) < 1e-9 for e in extremes)
            te, ti = (t0, t1) if ext0 else (t1, t0)
            ke = k_at(te, sg)
            Te, Ti = tan(te, sg), tan(ti, sg)
            if not ext0:                                    # solved from the extreme towards the inflection
                Te, Ti = (-Te[0], -Te[1]), (-Ti[0], -Ti[1])
                ke = -ke
            ki = math.copysign(1.0 / r_infl, ke)
            s3 = _g2_cubic(edge(te, sg), Te, ke, edge(ti, sg), Ti, ki)
            if s3 is None:
                raise ValueError("wave_sides: no G2 cubic for a span")
            segs.append(s3 if ext0 else (s3[3], s3[2], s3[1], s3[0]))
        sides.append(segs)
    return sides


def _cubic_split(s, t):
    lerp = lambda a, b: (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)   # noqa: E731
    a, b, c = lerp(s[0], s[1]), lerp(s[1], s[2]), lerp(s[2], s[3])
    d, e = lerp(a, b), lerp(b, c)
    f = lerp(d, e)
    return (s[0], a, d, f), (f, e, c, s[3])


def _cut_back(s, r, at_end):
    """The cubic s less its last (at_end) or first r units of arc."""
    n = 400
    pts = [_cubic_split(s, i / n)[0][3] if 0 < i < n else (s[0] if i == 0 else s[3]) for i in range(n + 1)]
    seq = range(n, 0, -1) if at_end else range(n)
    acc = 0.0
    for i in seq:
        j = i - 1 if at_end else i + 1
        acc += math.dist(pts[i], pts[j])
        if acc >= r:
            return _cubic_split(s, j / n)[0] if at_end else _cubic_split(s, j / n)[1]
    return s


def _soft_wave(L, R, r):
    """A wave's outline from its two edges (lists of cubics, both running from the start to the end), each end cut
    square between the edges' end points, both corners of each cut on the letters' radius r as soft_ends rounds a
    plain stroke's (the edge cut back r along itself, the cut r in, handles 0.55 of the way to the corner, along the
    edge's own tangent). Starts at the end cut's lower point; the closing line is that cut."""
    k = 0.55
    A, B = L[-1][3], R[-1][3]              # the end cut: top corner (left edge), bottom corner (right edge)
    Cc, D = R[0][0], L[0][0]               # the start cut: bottom corner, top corner
    Lf = [_cut_back(L[0], r, False)] + list(L[1:-1]) + [_cut_back(L[-1], r, True)]
    Rf = [_cut_back(R[0], r, False)] + list(R[1:-1]) + [_cut_back(R[-1], r, True)]
    rev = [(c[3], c[2], c[1], c[0]) for c in reversed(Rf)]

    def toward(p, q, ln):
        u_ = unit(p, q)
        return (p[0] + u_[0] * ln, p[1] + u_[1] * ln)

    def corner(p, tp, c, q):
        # from p (leaving along tp) round the corner c to q on the straight cut
        lp, lq = k * math.dist(p, c), k * math.dist(q, c)
        return ("c", (p[0] + tp[0] * lp, p[1] + tp[1] * lp), toward(q, c, lq), q)

    def corner_in(p, c, q, tq):
        # from p on the cut round c to q, arriving along tq
        lp, lq = k * math.dist(p, c), k * math.dist(q, c)
        return ("c", toward(p, c, lp), (q[0] - tq[0] * lq, q[1] - tq[1] * lq), q)
    a1, a2 = Lf[-1][3], toward(A, B, r)
    b1, b2 = toward(B, A, r), rev[0][0]
    c1, c2 = rev[-1][3], toward(Cc, D, r)
    d0, d1 = toward(D, Cc, r), Lf[0][0]
    out = [b1, corner_in(b1, B, b2, unit(rev[0][0], rev[0][1]))]
    out += [("c", c[1], c[2], c[3]) for c in rev]
    out += [corner(c1, unit(rev[-1][2], rev[-1][3]), Cc, c2), d0, corner_in(d0, D, d1, unit(Lf[0][0], Lf[0][1]))]
    out += [("c", c[1], c[2], c[3]) for c in Lf]
    out += [corner(a1, unit(Lf[-1][2], Lf[-1][3]), A, a2)]
    return out


def _cubic_k(s, t):
    u = 1 - t
    dx = 3 * (u * u * (s[1][0] - s[0][0]) + 2 * u * t * (s[2][0] - s[1][0]) + t * t * (s[3][0] - s[2][0]))
    dy = 3 * (u * u * (s[1][1] - s[0][1]) + 2 * u * t * (s[2][1] - s[1][1]) + t * t * (s[3][1] - s[2][1]))
    ddx = 6 * (u * (s[2][0] - 2 * s[1][0] + s[0][0]) + t * (s[3][0] - 2 * s[2][0] + s[1][0]))
    ddy = 6 * (u * (s[2][1] - 2 * s[1][1] + s[0][1]) + t * (s[3][1] - 2 * s[2][1] + s[1][1]))
    v = math.hypot(dx, dy)
    return (dx * ddy - dy * ddx) / v ** 3 if v > 1e-9 else 0.0


def whole_units(steps, g1=2.0, rounds=6):
    """0.84 (pass 2): a closed shape() contour (a point, then points and ("c", h1, h2, p) steps; the closing step a
    line) on whole units without losing what the construction solved: nodes rounded; then every handle moved over the
    whole-unit places within 2 of its own (a level or upright extreme's handles along their axis only; the two handles
    of a smooth node together, on one line through it) to the least of: the curvature ratio across each smooth node
    between two curves, the two handles' angle there, |k| turning back inside a curve, the distance from the drawn
    places. A node is smooth where its tangents run on within g1 degrees."""
    n = len(steps)

    def node(k):
        q = steps[k % n]
        return q[3] if q[0] == "c" else q
    P = []                                                   # [x, y, kind]; kind None for a handle
    smooth, axis = {}, {}
    for k, q in enumerate(steps):
        p_ = node(k)
        prev_ = steps[k][2] if steps[k][0] == "c" else node(k - 1)
        nxt = steps[(k + 1) % n]
        next_ = nxt[1] if nxt[0] == "c" else node(k + 1)
        if q[0] == "c":
            P += [[q[1][0], q[1][1], None], [q[2][0], q[2][1], None]]
        P.append([p_[0], p_[1], "c" if q[0] == "c" else "l"])
        i = len(P) - 1
        if math.dist(prev_, p_) > 1e-9 and math.dist(p_, next_) > 1e-9:
            u, v = unit(prev_, p_), unit(p_, next_)
            if u[0] * v[0] + u[1] * v[1] > math.cos(math.radians(g1)):
                smooth[i] = True
                if abs(u[1]) < 1e-3 and abs(v[1]) < 1e-3:
                    axis[i] = "level"
                elif abs(u[0]) < 1e-3 and abs(v[0]) < 1e-3:
                    axis[i] = "upright"
    N = len(P)
    ideal = [tuple(q[:2]) for q in P]
    for q in P:
        q[0], q[1] = float(round(q[0])), float(round(q[1]))
    # segments: for each node index i of a curve, its cubic (i-3 .. i)
    curves = [i for i in range(N) if P[i][2] == "c" and math.dist(ideal[(i - 3) % N], ideal[i]) >= 30]

    def seg(i):
        return tuple((P[(i - 3 + k) % N][0], P[(i - 3 + k) % N][1]) for k in range(4))
    def long_(i):                                            # a curve ending at node i of a real span (not a corner's round)
        return P[i][2] == "c" and math.dist(P[(i - 3) % N][:2], P[i][:2]) >= 30
    cc_nodes = [i for i in smooth if long_(i) and P[(i + 1) % N][2] is None and long_((i + 3) % N)]

    ccs = set(cc_nodes)

    def node_cost(i):
        ka, kb = _cubic_k(seg(i), 1.0), _cubic_k(seg((i + 3) % N), 0.0)
        lo_, hi_ = sorted((abs(ka), abs(kb)))
        c = 400 * math.log((hi_ + 1e-7) / (lo_ + 1e-7)) ** 2
        a, b = P[(i - 1) % N], P[(i + 1) % N]
        u = (P[i][0] - a[0], P[i][1] - a[1]); v = (b[0] - P[i][0], b[1] - P[i][1])
        ang = abs(math.degrees(math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1])))
        return c + 40 * max(0.0, ang - 0.25) ** 2

    def curve_cost(i):
        s_ = seg(i)
        ks = [abs(_cubic_k(s_, t / 24)) for t in range(25)]
        top = max(ks) or 1e-9
        sgn = 1 if ks[-1] >= ks[0] else -1
        c = 200 * sum(max(0.0, -sgn * (b_ - a_)) for a_, b_ in zip(ks, ks[1:])) / top
        # each handle inside the triangle: never past where the two handles' lines meet
        d0 = (s_[1][0] - s_[0][0], s_[1][1] - s_[0][1]); d3 = (s_[2][0] - s_[3][0], s_[2][1] - s_[3][1])
        den = d0[0] * d3[1] - d0[1] * d3[0]
        if abs(den) > 1e-9:
            w_ = (s_[3][0] - s_[0][0], s_[3][1] - s_[0][1])
            ta = (w_[0] * d3[1] - w_[1] * d3[0]) / den
            tb = (w_[0] * d0[1] - w_[1] * d0[0]) / den
            if ta > 0 and tb > 0:
                c += 1000 * (max(0.0, 1.0 - ta + 0.02) + max(0.0, 1.0 - tb + 0.02)) if min(ta, tb) < 1.02 else 0.0
        return c

    def local(hs):
        cv = {i for i in curves for h in hs if 0 < (i - h) % N < 3}
        nd = {j for i in cv for j in (i, (i - 3) % N) if j in ccs}
        return (sum(curve_cost(i) for i in cv) + sum(node_cost(j) for j in nd)
                + 0.02 * sum((P[h][0] - ideal[h][0]) ** 2 + (P[h][1] - ideal[h][1]) ** 2 for h in hs))
    one = [(dx, dy) for dx in (-2, -1, 0, 1, 2) for dy in (-2, -1, 0, 1, 2)]
    pair = [(dx, dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)]
    groups = []
    for i in range(N):
        if P[i][2] is None:
            continue
        a, b = (i - 1) % N, (i + 1) % N
        if i in cc_nodes:
            groups.append((i, [a, b]))
    owned = {h for _i, hs in groups for h in hs}
    for j in range(N):
        if P[j][2] is None and j not in owned:
            groups.append((None, [j]))
    for _ in range(rounds):
        moved = False
        for i, hs in groups:
            ax = axis.get(i)
            offs = one if len(hs) == 1 else pair
            ok = [o for o in offs if (ax != "level" or o[1] == 0) and (ax != "upright" or o[0] == 0)]
            base = [(P[h][0], P[h][1]) for h in hs]
            best, choice = local(hs), None
            combos = [(o,) for o in ok] if len(hs) == 1 else [(o1, o2) for o1 in ok for o2 in ok]
            for cmb in combos:
                for h, (x0_, y0_), o in zip(hs, base, cmb):
                    P[h][0], P[h][1] = x0_ + o[0], y0_ + o[1]
                c = local(hs)
                if c < best - 1e-9:
                    best, choice = c, cmb
            for h, (x0_, y0_), o in zip(hs, base, choice or [(0, 0)] * len(hs)):
                P[h][0], P[h][1] = x0_ + o[0], y0_ + o[1]
            moved = moved or choice is not None
        if not moved:
            break
    out, buf = [], []
    for q in P:
        if q[2] is None:
            buf.append((q[0], q[1]))
        elif q[2] == "c":
            out.append(("c", buf[0], buf[1], (q[0], q[1])))
            buf = []
        else:
            out.append((q[0], q[1]))
    return out

def tilde(p, s=1.0, white=None):
    """The tilde (U+007E), and the almost-equal sign's two (U+2248): one period of a sine wave, from an inflection
    rising to the crest, down through the middle inflection to the trough and up to the last inflection, each end
    run on straight along its own tangent for half the stroke (curvature 0 there, so the run is a smooth join) and
    cut square to the stroke. Weights: the signs' damped stress (stress(lo, hi)). p: x0, x1 (the centreline's ends,
    the runs inside them), cy (or cys, several), amp, lo, hi."""
    lo, hi = p["lo"] * s, p["hi"] * s
    wf = stress(lo, hi)
    x0, x1, A = p["x0"], p["x1"], p["amp"]
    run = p.get("run", 0.5) * (lo + hi) / 2
    out = []
    for cy in p.get("cys", [p.get("cy")]):
        if p.get("slope"):
            # 0.84 (Regular pass 2, item 2): the wave set by its slope at the inflections (the owner: "too sharp
            # angled"): its height follows from its length, so the crests' radius is lam / (2 pi tan slope)
            k = math.tan(math.radians(p["slope"]))
            lam = (x1 - x0) - 2 * run / math.sqrt(1 + k * k)
            A = k * lam / (2 * math.pi)
        else:
            lam = (x1 - x0) - 2 * run * math.cos(math.atan(2 * math.pi * A / max(1.0, (x1 - x0))))
            for _ in range(20):                          # the wave's length so the runs end at x0 and x1
                k = 2 * math.pi * A / lam
                lam = (x1 - x0) - 2 * run / math.sqrt(1 + k * k)
            k = 2 * math.pi * A / lam
        ca, sa = 1 / math.sqrt(1 + k * k), k / math.sqrt(1 + k * k)
        xs = x0 + run * ca
        ys = cy                                          # the wave starts here (an inflection, rising), on its axis

        def C(t, xs=xs, ys=ys, lam=lam, A=A):
            return (xs + t * lam, ys + A * math.sin(2 * math.pi * t))
        width = lambda t, C=C: wf(*_dir(C, t))
        nodes = [0.0, 0.25, 0.5, 0.75, 1.0]
        if p.get("parallel"):
            # 0.84 (Regular pass 2, item 2, second pass; the owner: "the inside seems a bit sharp ... the negative
            # space isn't even"): both edges the centreline's parallels, each span G2 at both its ends (wave_sides);
            # no straight run (run 0): each end is the wave's own inflection, cut square to the stroke there
            L, R = wave_sides(C, nodes, width, (0.25, 0.75))
            sw = _soft_wave(L, R, p.get("soft", SOFT))
            out.append(whole_units(sw) if p.get("whole") else sw)
            continue
        L, R = offset_sides(C, nodes, width)
        w0, w1 = width(0.0), width(1.0)
        n0 = (-sa, ca)                                   # the left normal at both ends (the same slope there)
        r0, r1 = run, run

        def at(pt, d, ln, sg, w):
            return (pt[0] + d[0] * ln + n0[0] * w / 2 * sg, pt[1] + d[1] * ln + n0[1] * w / 2 * sg)
        P0, P1 = C(0.0), C(1.0)
        d = (ca, sa)
        def run_on(q, h, ln):                          # an edge run on straight along its own tangent (q to h)
            u_ = unit(h, q)
            return (q[0] + u_[0] * ln, q[1] + u_[1] * ln)
        contour = [run_on(L[0][0], L[0][1], r0), L[0][0]]
        for a in L:
            contour.append(("c", a[1], a[2], a[3]))
        contour += [run_on(L[-1][3], L[-1][2], r1), run_on(R[-1][3], R[-1][2], r1), R[-1][3]]
        for b in reversed(R):
            contour.append(("c", b[2], b[1], b[0]))
        contour.append(run_on(R[0][0], R[0][1], r0))
        out.append(contour)
    return out, [], []


def infinity(p, s=1.0, white=None):
    """The infinity sign (U+221E): one stroke round a lemniscate of Gerono, x = a cos t, y = b sin 2t, crossing
    itself at the middle; the signs' damped stress (thick where it runs upright, at the outer ends; thin over the
    lobes' tops and bottoms; between on the crossing). Nodes at every extreme and at the crossing. Returns the
    stroke's pieces (unioned by the caller): a closed stroke has no ends."""
    lo, hi = p["lo"] * s, p["hi"] * s
    wf = stress(lo, hi)
    a, b, cx, cy = p["a"], p["b"], p["cx"], p["cy"]

    def C(t):
        return (cx + a * math.cos(t), cy + b * math.sin(2 * t))
    width = lambda t: wf(*_dir(C, t))
    nodes = [k * math.pi / 4 for k in range(9)]
    return ribbon(C, nodes, width), [], []


def _arm(J, u, L, w0, d, a0, lead=0.5, enter=1.6, hold=0.55):
    """One arm of a reference mark (the dagger's, as the asterisk's): from the junction J along the unit u, w0 across
    where it leaves (a0 from J: the crossing arm's half width), widening steadily to a round end of diameter d whose
    tip is L from J. phi is the side's straight flare (from the leaving point to the end's widest); each side is one
    cubic leaving lead * phi out from u and arriving tangent on the end's circle where the circle turns enter * phi
    out (a gently concave side: the arm swells as it nears the end), both handles `hold` of the way to where the two
    directions meet. The end is the circle's arc over the tip, split at the tip (an extreme). Returns shape() steps
    from the left leaving point round the end to the right one (clockwise round the arm)."""
    n = (-u[1], u[0])
    r = d / 2
    c = (J[0] + u[0] * (L - r), J[1] + u[1] * (L - r))
    tip = (J[0] + u[0] * L, J[1] + u[1] * L)
    phi = math.atan2(r - w0 / 2, (L - r) - a0)
    b, l_ = enter * phi, lead * phi
    sides = []
    for sg in (1, -1):
        s0 = (J[0] + u[0] * a0 + n[0] * w0 / 2 * sg, J[1] + u[1] * a0 + n[1] * w0 / 2 * sg)
        lu = (u[0] * math.cos(l_) + n[0] * sg * math.sin(l_), u[1] * math.cos(l_) + n[1] * sg * math.sin(l_))
        tp = (c[0] + r * (n[0] * sg * math.cos(b) - u[0] * math.sin(b)), c[1] + r * (n[1] * sg * math.cos(b) - u[1] * math.sin(b)))
        td = (u[0] * math.cos(b) + n[0] * sg * math.sin(b), u[1] * math.cos(b) + n[1] * sg * math.sin(b))
        m = meet((s0, lu), (tp, td))
        h1 = (s0[0] + (m[0] - s0[0]) * hold, s0[1] + (m[1] - s0[1]) * hold)
        h2 = (tp[0] + (m[0] - tp[0]) * hold, tp[1] + (m[1] - tp[1]) * hold)
        sides.append((s0, h1, h2, tp))
    (l0, l1, l2, l3), (r0, r1, r2, r3) = sides
    steps = [l0, ("c", l1, l2, l3)]
    steps += _arc(c, r, l3, tip, ccw=False) + _arc(c, r, tip, r3, ccw=False)
    steps.append(("c", r2, r1, r0))
    return steps


def _arc(c, r, p0, p1, ccw):
    """A circular arc from p0 to p1 about c as cubics (each at most 90 degrees)."""
    a0 = math.atan2(p0[1] - c[1], p0[0] - c[0])
    a1 = math.atan2(p1[1] - c[1], p1[0] - c[0])
    if ccw:
        while a1 <= a0:
            a1 += 2 * math.pi
    else:
        while a1 >= a0:
            a1 -= 2 * math.pi
    k = max(1, math.ceil(abs(a1 - a0) / (math.pi / 2) - 1e-6))
    out = []
    for i in range(k):
        b0, b1 = a0 + (a1 - a0) * i / k, a0 + (a1 - a0) * (i + 1) / k
        h = 4 / 3 * math.tan((b1 - b0) / 4) * r
        q0 = (c[0] + r * math.cos(b0), c[1] + r * math.sin(b0))
        q3 = (c[0] + r * math.cos(b1), c[1] + r * math.sin(b1))
        out.append(("c", (q0[0] - h * math.sin(b0), q0[1] + h * math.cos(b0)),
                    (q3[0] + h * math.sin(b1), q3[1] - h * math.cos(b1)), q3))
    return out


def _between(A, B, a, mid_w, side, k=0.55):
    """The double dagger's upright between its two crossings, one side: from the crotch by A to the crotch by B,
    a from the axis at both, mid_w across at the middle; two cubics, upright at the crotches and at the middle."""
    x, ym = A[0], (A[1] + B[1]) / 2
    sgn = -1 if B[1] < A[1] else 1
    p0 = (x + side * a, A[1] + sgn * a)
    p1 = (x + side * a, B[1] - sgn * a)
    m = (x + side * mid_w / 2, ym)
    d0, d1 = ym - p0[1], p1[1] - ym
    return [("c", (p0[0], p0[1] + d0 * k), (m[0], m[1] - d0 * k), m),
            ("c", (m[0], m[1] + d1 * k), (p1[0], p1[1] - d1 * k), p1)]


def dagger(p, s=1.0, white=None):
    """The dagger (U+2020) and the double dagger (U+2021): crosses of arms, every arm the reference marks' one arm
    (_arm: thin where it leaves the crossing, swelling to a round end, as the asterisk's arms). p: cx, crossings
    [y, ...], top and bottom (the upright arms' tips), reach (the side arms' tips from the axis), w0 (an arm where it
    leaves), d (the round end), mid (the double dagger's upright between its crossings at its widest). One contour,
    clockwise; each crotch the point where two arms' leaving points coincide (half the crossing arm's width out)."""
    cx, ys = p["cx"], sorted(p["crossings"])
    w0, d = p["w0"] * s, p["d"] * s
    lead, enter, hold = p.get("lead", 0.5), p.get("enter", 1.6), p.get("hold", 0.55)
    a = w0 / 2
    yt, yb = ys[-1], ys[0]
    R = p["reach"]
    parts = [_arm((cx, yt), (0, 1), p["top"] - yt, w0, d, a, lead, enter, hold),
             _arm((cx, yt), (1, 0), R, w0, d, a, lead, enter, hold)]
    if yt != yb:
        mid = (w0 + 0.9 * d) / 2                        # half way from the leaving width to the end's: the arms' law
        parts.append(_between((cx, yt), (cx, yb), a, mid, 1))
        parts.append(_arm((cx, yb), (1, 0), R, w0, d, a, lead, enter, hold))
    parts.append(_arm((cx, yb), (0, -1), yb - p["bottom"], w0, d, a, lead, enter, hold))
    parts.append(_arm((cx, yb), (-1, 0), R, w0, d, a, lead, enter, hold))
    if yt != yb:
        parts.append(_between((cx, yb), (cx, yt), a, mid, -1))
        parts.append(_arm((cx, yt), (-1, 0), R, w0, d, a, lead, enter, hold))
    contour = []
    for P in parts:
        for q in P:
            end = contour[-1][3] if contour and contour[-1][0] == "c" else (contour[-1] if contour else None)
            if q[0] != "c" and end is not None and math.dist(q, end) < 1e-6:
                continue
            contour.append(q)
    if contour[-1][0] == "c" and math.dist(contour[-1][3], contour[0]) < 1e-6:
        pass                                            # closes on the first point
    return [contour], [], []


BUILDERS.update({"tilde": tilde, "infinity": infinity, "dagger": dagger})


# ---------------------------------------------------------------- 0.83 (Regular pass, symbols 2): the gentle taper
# The owner's choice from the study's options (B, "gentle taper"): the arrows and the open interface signs (the return,
# tab, check and cross keys) are strokes that thin to the hairline where they join (a head's point, a crossing, a
# vertex) and widen to a round end where they are free: w0 at the join, w1 at the free end, the end a round cap of
# w1's radius, a head's point cut flat (`flat`) across its bisector. Every edge is a straight line (the width changes
# linearly along a straight centreline) tangent to its round end; every corner is two edges meeting. One contour per
# glyph, its round ends split at every extreme, so each point of the outline is a point of the construction and a
# master builds the same points at its own w0 and w1 (`corners`).

def _tangent(P0, E, r, n, sg):
    """The point where a line from P0 touches the circle (E, r), on the side sg of the direction whose left is n."""
    dx, dy = P0[0] - E[0], P0[1] - E[1]
    d = math.hypot(dx, dy)
    th0 = math.atan2(dy, dx)
    b = math.acos(max(-1.0, min(1.0, r / d)))
    best = None
    for s_ in (1, -1):
        T = (E[0] + r * math.cos(th0 + s_ * b), E[1] + r * math.sin(th0 + s_ * b))
        side = (T[0] - E[0]) * n[0] + (T[1] - E[1]) * n[1]
        if best is None or side * sg > best[0]:
            best = (side * sg, T)
    return best[1]


class _Taper:
    """A straight stroke from its join A to its free end F (the ink's tip): w0 across at A, a round end of w1 across
    whose tip is F. sides[sg] = (point at A, direction, tangent point on the end's circle) for sg = +1 (left of A to F)
    and -1."""

    def __init__(self, A, F, w0, w1):
        self.A, self.F = A, F
        self.u = unit(A, F)
        self.n = left(self.u)
        self.r = w1 / 2
        self.E = (F[0] - self.u[0] * self.r, F[1] - self.u[1] * self.r)
        self.sides = {}
        for sg in (1, -1):
            P0 = (A[0] + self.n[0] * w0 / 2 * sg, A[1] + self.n[1] * w0 / 2 * sg)
            T = _tangent(P0, self.E, self.r, self.n, sg)
            self.sides[sg] = (P0, unit(P0, T), T)

    def line(self, sg):
        P0, d, _ = self.sides[sg]
        return (P0, d)

    def T(self, sg):
        return self.sides[sg][2]


_PLAN = {}                   # the Regular's arc decisions (snaps, cuts) per recipe, replayed in a master
_PLANS = {}
SNAP = math.radians(4)       # an arc's end this near an extreme is drawn from the extreme (no sliver of a curve
                             # past it, which whole units would fold into the line before it)


def _arc_via(c, r, p0, p1, via, snap=False, start=False):
    """The circle's arc from p0 to p1 that passes the direction of `via`, as cubics split at every multiple of 90
    degrees (a node at each extreme). snap: an end within SNAP of a multiple of 90 degrees moves to it."""
    tau = 2 * math.pi
    a0 = math.atan2(p0[1] - c[1], p0[0] - c[0])
    a1r = math.atan2(p1[1] - c[1], p1[0] - c[0])
    rec = _PLAN.get("replay")
    if snap:
        q_ = math.pi / 2
        if rec is not None and rec:                    # a master: the Regular's decisions, so the points match
            k0, k1, _cuts = rec.pop(0)
            a0 = k0 * q_ if k0 is not None else a0
            a1r = k1 * q_ if k1 is not None else a1r
        else:
            k0 = round(a0 / q_) if abs(a0 - round(a0 / q_) * q_) < SNAP else None
            k1 = round(a1r / q_) if abs(a1r - round(a1r / q_) * q_) < SNAP else None
            a0 = k0 * q_ if k0 is not None else a0
            a1r = k1 * q_ if k1 is not None else a1r
            _cuts = None
            if _PLAN.get("record") is not None:
                _PLAN["record"].append([k0, k1, None])
    av = math.atan2(via[1] - c[1], via[0] - c[0])
    ccw = (av - a0) % tau <= (a1r - a0) % tau
    a1 = a0 + (a1r - a0) % tau if ccw else a0 - (a0 - a1r) % tau
    q = math.pi / 2
    cuts = [a0]
    if ccw:
        k = math.floor(a0 / q) + 1
        while k * q < a1 - 1e-6:
            if k * q > a0 + 1e-6:
                cuts.append(k * q)
            k += 1
    else:
        k = math.ceil(a0 / q) - 1
        while k * q > a1 + 1e-6:
            if k * q < a0 - 1e-6:
                cuts.append(k * q)
            k -= 1
    cuts.append(a1)
    if snap and rec is not None and _cuts is not None:   # a master: the Regular's cuts, in turn
        cuts = [a0] + [k * q for k in _cuts] + [a1]
    elif snap and _PLAN.get("record") is not None:
        _PLAN["record"][-1][2] = [round(c_ / q) for c_ in cuts[1:-1]]
    out = []
    for b0, b1 in zip(cuts, cuts[1:]):
        if abs(b1 - b0) < 1e-6:
            continue
        h = 4 / 3 * math.tan((b1 - b0) / 4) * r
        q0 = (c[0] + r * math.cos(b0), c[1] + r * math.sin(b0))
        q3 = (c[0] + r * math.cos(b1), c[1] + r * math.sin(b1))
        out.append(("c", (q0[0] - h * math.sin(b0), q0[1] + h * math.cos(b0)),
                    (q3[0] + h * math.sin(b1), q3[1] - h * math.cos(b1)), q3))
    if start:
        return out, (c[0] + r * math.cos(a0), c[1] + r * math.sin(a0))
    return out


def _cap(t, sg0=1):
    """A stroke's round end, from its sg0 side over the tip to the other (an arc kept as a placeholder until the
    glyph is placed, so its nodes fall on the placed circle's extremes)."""
    return [("a", t.E, t.r, t.T(sg0), t.T(-sg0), t.F)]


def _xf(steps, f):
    out = []
    for q in steps:
        if q[0] == "c":
            out.append(("c", f(q[1]), f(q[2]), f(q[3])))
        elif q[0] == "a":
            out.append(("a", f(q[1]), q[2], f(q[3]), f(q[4]), f(q[5])))
        else:
            out.append(f(q))
    return out


def _arcs(steps):
    """Placeholders drawn as arcs; an arc whose start snapped to an extreme takes the line's end before it along."""
    out = []
    for q in steps:
        if q[0] == "a":
            A, start = _arc_via(q[1], q[2], q[3], q[4], q[5], snap=True, start=True)
            if out and out[-1][0] != "c" and math.dist(out[-1], q[3]) < 1e-6:
                out[-1] = start
            out += A
        else:
            out.append(q)
    return out


def _head(L, arm, half, w0, w1, flat):
    """A head pointing right, its point's flat at x = L, on the axis y = 0: the two arms (tapers from the arms'
    meeting Q out to their free ends) and the lines and points the outline is cut from."""
    a = math.radians(half)
    Q = (0.0, 0.0)
    arms = {}
    for k, sy in ((1, 1), (2, -1)):
        F = (Q[0] - arm * math.cos(a), Q[1] + sy * arm * math.sin(a))
        arms[k] = _Taper(Q, F, w0, w1)
    # on arm 1 (up and left) the side away from the axis is its right side (-1), on arm 2 its left (+1)
    out1, in1 = arms[1].line(-1), arms[1].line(1)
    out2, in2 = arms[2].line(1), arms[2].line(-1)
    yf = flat / 2
    f1 = meet(out1, ((0, yf), (1, 0)))
    dx = L - f1[0]
    sh = lambda p: (p[0] + dx, p[1])
    for t in arms.values():
        t.A, t.F, t.E = sh(t.A), sh(t.F), sh(t.E)
        t.sides = {s_: (sh(P0), d, sh(T)) for s_, (P0, d, T) in t.sides.items()}
    out1, in1 = arms[1].line(-1), arms[1].line(1)
    out2, in2 = arms[2].line(1), arms[2].line(-1)
    return dict(Q=sh(Q), arms=arms, out1=out1, in1=in1, out2=out2, in2=in2,
                f1=(L, yf), f2=(L, -yf), crotch=meet(in1, in2))


def tarrow(p, s=1.0, white=None, sh=1.0):
    """An arrow of the gentle taper (B). p: L (the ink's length), arm, half (degrees off the shaft), w0, w1 (scaled by
    the hairline's law sh and the plain stroke's s), flat (a share of w0), kind ("one", "both", "bar", "ret"), rise
    (ret: the riser's top over the axis), rot (degrees), at (where the arrow's middle goes). One contour."""
    w0, w1 = p["w0"] * sh, p["w1"] * s
    L, kind = p["L"], p.get("kind", "one")
    flat = p.get("flat", 0.5) * w0
    H = _head(L, p["arm"], p["half"], w0, w1, flat)
    a1, a2 = H["arms"][1], H["arms"][2]
    Qx = H["Q"][0]
    steps = []
    if kind == "both":
        # the left head is the right one turned over about the middle; the shaft between them w0 at each head's Q
        # and w1 at the middle, each edge one cubic (level at the middle)
        mx = L / 2
        mir = lambda q: (2 * mx - q[0], q[1])
        # 0.83 (Regular pass, consistency 0a): a shaft with no free end is straight, one width from crotch to crotch
        # (`shaft`, of the hairline's law: it was w0 at the heads swelling to w1 at the middle, a lens)
        ws = p["shaft"] * sh if p.get("shaft") else None
        S1 = meet(((Qx, (ws or w0) / 2), (-1, 0)), H["in1"])         # the shaft's top meets arm 1's inside
        S2 = (S1[0], -S1[1])

        def edge(p0, p3, y_mid):
            # two quarters meeting level at the middle (a node at the extreme), each a quadratic raised to a cubic
            m_ = ((p0[0] + p3[0]) / 2, y_mid)
            out_ = []
            for a_, b_ in ((p0, m_), (m_, p3)):
                Q_ = ((a_[0] + b_[0]) / 2, y_mid)
                out_.append(("c", (a_[0] + 2 / 3 * (Q_[0] - a_[0]), a_[1] + 2 / 3 * (Q_[1] - a_[1])),
                             (b_[0] + 2 / 3 * (Q_[0] - b_[0]), b_[1] + 2 / 3 * (Q_[1] - b_[1])), b_))
            return out_
        right = [a1.T(1)] + _cap(a1) + [H["f1"], H["f2"], a2.T(1)] + _cap(a2) + [S2]
        P = [S1] + right + ([mir(S2)] if ws else edge(S2, mir(S2), -w1 / 2))
        left_ = [mir(a2.T(-1))] + _xf([("a", a2.E, a2.r, a2.T(-1), a2.T(1), a2.F)], mir) + \
            [mir(H["f2"]), mir(H["f1"]), mir(a1.T(-1))] + _xf([("a", a1.E, a1.r, a1.T(-1), a1.T(1), a1.F)], mir) + [mir(S1)]
        P += left_ + ([] if ws else edge(mir(S1), S1, w1 / 2))
    else:
        # the shaft: from the tail (x = 0, a free end, w1) to Q (w0)
        tail = _Taper((Qx, 0.0), (0.0, 0.0), w0, w1)           # A at Q, F at the tail's tip; its +1 side is below
        top_line, bot_line = tail.line(-1), tail.line(1)
        S1, S2 = meet(top_line, H["in1"]), meet(bot_line, H["in2"])
        head_steps = [S1, a1.T(1)] + _cap(a1)
        if kind == "bar":
            # the bar at the point: a stroke across it, its back straight (x = L + w0), its face thinning from the
            # round ends (w1) to w0 where the arrow meets it; the arms' outsides run into its face
            span = max(a1.E[1] + a1.r, 0)
            if p.get("bar_w"):
                # 0.83 (Regular pass, consistency 0b): the bar a straight stroke, one width (`bar_w`, of the plain
                # stroke's law) from end to end, its ends half circles of its own width (the family's round ends); its
                # face upright through the head's point. It was w1 at the ends thinning to w0 where the arms run in, a
                # wedge
                wb = p["bar_w"] * s
                xr = L + wb
                topE = (L + wb / 2, span - wb / 2)
                botE = (topE[0], -topE[1])
                K1 = meet(H["out1"], ((L, 0.0), (0.0, 1.0)))
                K2 = (K1[0], -K1[1])
                head_steps += [K1, (L, topE[1]), ("a", topE, wb / 2, (L, topE[1]), (xr, topE[1]), (topE[0], topE[1] + 1))]
                head_steps += [(xr, botE[1]), ("a", botE, wb / 2, (xr, botE[1]), (L, botE[1]), (botE[0], botE[1] - 1))]
                head_steps += [(L, botE[1]), K2]
            else:
                xr = L + w0
                topE = (xr - w1 / 2, span - w1 / 2)
                face_top = ((L, 0.0), unit((L, 0.0), _tangent((L, 0.0), topE, w1 / 2, (1, 0), -1)))
                Tt = _tangent((L, 0.0), topE, w1 / 2, (1, 0), -1)
                K1 = meet(H["out1"], ((L, 0.0), face_top[1]))
                botE = (topE[0], -topE[1])
                Tb = (Tt[0], -Tt[1])
                K2 = (K1[0], -K1[1])
                head_steps += [K1, Tt, ("a", topE, w1 / 2, Tt, (xr, topE[1]), (topE[0], topE[1] + 1))]
                head_steps += [(xr, botE[1]), ("a", botE, w1 / 2, (xr, botE[1]), Tb, (botE[0], botE[1] - 1))]
                head_steps += [K2]
        else:
            head_steps += [H["f1"], H["f2"]]
        head_steps += [a2.T(1)] + _cap(a2) + [S2]
        if kind == "ret":
            # the shaft runs back to a corner and turns up into a riser ending free at `rise` over the axis; the
            # width runs w0 at Q to w1 at the riser's tip, linear along the centreline
            rise = p["rise"]
            Ls, Lr = Qx, rise
            wc = w0 + (w1 - w0) * Ls / (Ls + Lr)
            xc = wc / 2                                          # the riser's centre: its outside at x = 0
            riser = _Taper((xc, 0.0), (xc, rise), wc, w1)        # its +1 side is left (outside)
            sb = ((Qx, -w0 / 2), unit((Qx, -w0 / 2), (xc, -wc / 2)))
            st = ((Qx, w0 / 2), unit((Qx, w0 / 2), (xc, wc / 2)))
            S1, S2 = meet(st, H["in1"]), meet(sb, H["in2"])
            head_steps[0] = S1
            head_steps[-1] = S2
            outer = meet(sb, riser.line(1))
            inner = meet(st, riser.line(-1))
            P = head_steps + [outer, riser.T(1)] + _cap(riser) + [inner]
        else:
            P = head_steps + [tail.T(1)] + _cap(tail) + [tail.T(-1)]
    # place: rotate about the arrow's middle and move the middle to `at`
    rot = math.radians(p.get("rot", 0.0))
    cx_ = p.get("mid", L / 2)
    at = p["at"]
    if p.get("mirror"):
        P = _xf(P, lambda q: (L - q[0], q[1]))
    c_, s_ = math.cos(rot), math.sin(rot)
    f = lambda q: (at[0] + (q[0] - cx_) * c_ - q[1] * s_, at[1] + (q[0] - cx_) * s_ + q[1] * c_)
    P = _arcs(_xf(P, f))                                          # round ends drawn on the placed circles
    return [P], [], []


def tcheck(p, s=1.0, white=None, sh=1.0):
    """The check of the gentle taper: the short stroke and the long one free at their ends (round, w1) and joined at
    the vertex (w0), the vertex's outside cut flat (`flat` of w0) across the bisector, its inside a point."""
    w0, w1 = p["w0"] * sh, p["w1"] * s
    S, V, E_ = tuple(p["start"]), tuple(p["vertex"]), tuple(p["end"])
    a, b = _Taper(V, S, w0, w1), _Taper(V, E_, w0, w1)
    # the outside of the vertex is below: on a (V to S, up-left) its left (+1) side; on b (V to E, up-right) its right
    oa, ia = a.line(1), a.line(-1)
    ob, ib = b.line(-1), b.line(1)
    o = meet(oa, ob)
    inn = meet(ia, ib)
    bis = unit(o, inn)
    e1, e2 = oa[1], ob[1]
    half = math.acos(max(-1.0, min(1.0, e1[0] * e2[0] + e1[1] * e2[1]))) / 2
    d_ = p.get("flat", 0.5) * w0 / (2 * math.tan(half))
    cut = ((o[0] + bis[0] * d_, o[1] + bis[1] * d_), left(bis))
    fa, fb = meet(oa, cut), meet(ob, cut)
    P = [inn, a.T(-1)] + _arc_via(a.E, a.r, a.T(-1), a.T(1), a.F) + [fa, fb, b.T(-1)] + \
        _arc_via(b.E, b.r, b.T(-1), b.T(1), b.F)
    return [P], [], []


def tcross(p, s=1.0, white=None, sh=1.0):
    """The cross key of the gentle taper (U+2715): four arms from the crossing (w0) to round free ends (w1), each
    crotch where two neighbouring arms' sides meet."""
    w0, w1 = p["w0"] * sh, p["w1"] * s
    c, R = tuple(p["c"]), p["arm"]
    arms = []
    for ang in (45, 135, 225, 315):
        a = math.radians(ang)
        arms.append(_Taper(c, (c[0] + R * math.cos(a), c[1] + R * math.sin(a)), w0, w1))
    P = []
    for k, t in enumerate(arms):
        nx = arms[(k + 1) % 4]
        P += [t.T(-1)] + _arc_via(t.E, t.r, t.T(-1), t.T(1), t.F)
        P.append(meet(t.line(1), nx.line(-1)))
    return [P], [], []


BUILDERS.update({"tarrow": tarrow, "tcheck": tcheck, "tcross": tcross})
TAPERED = {"tarrow", "tcheck", "tcross"}


# 0.84 (Regular pass 4, item 4): the guillemets as letters. A chevron is v's two diagonals turned to point left: the
# arm running down from the point (as v's left stroke) is v's thick diagonal, the arm running up its thin; their outer
# edges meet in an upright flat 0.42 of the stem (the letters' vertex, 33), their inner edges in a point; each end cut
# level on its zone (top, bottom). In a master the two weights take v's own laws (the thick the stem's, 1 + 0.80 f;
# the thin the thin diagonal's, 1 + 0.27 ft: v's 74.0 / 39.4 at 400 read 133.2 / 50.0 at the Bold and 52.4 / 33.0 at
# the Light), recovered from the sign law's s (bold.SIGN 1.37, LIGHT_THIN 1.72); the flat the stem's. « is two, `gap`
# apart (vertex to vertex).
GUIL_THICK_LAW, GUIL_THIN_LAW, GUIL_FLAT_LAW = 0.80, 0.27, 0.795
_SIGN, _LIGHT_THIN = 1.37, 1.72


def guillemet(p, s=1.0, white=None):
    ft = (s - 1) / (_SIGN - 1)
    f = ft if ft >= 0 else ft / _LIGHT_THIN
    thick = p["thick"] * (1 + GUIL_THICK_LAW * f)
    thin = p["thin"] * (1 + GUIL_THIN_LAW * ft)
    flat = p["flat"] * (1 + GUIL_FLAT_LAW * f)
    top, bot, cy, R = p["top"], p["bottom"], p["cy"], p["run"]
    H = top - bot
    out = []
    du = (R, top - cy)
    dl = (R, bot - cy)
    # the second chevron keeps the Regular's white to the first: the gap grows by what the thick arm gains level
    # (at the Bold the two touched at the foot)
    gap = p.get("gap", 0) + (thick - p["thick"]) * math.hypot(*dl) / abs(dl[1])
    for k in range(p.get("n", 1)):
        x0 = p["x0"] + k * gap
        # outer edges: (x0, cy) to (x0 + R, top) and to (x0 + R, bot)
        Lu, Ll = math.hypot(*du), math.hypot(*dl)
        nu = (du[1] / Lu, -du[0] / Lu)                  # into the ink: right and down from the upper outer edge
        nl = (-dl[1] / Ll, dl[0] / Ll)                  # right and up from the lower
        pu = (x0 + nu[0] * thin, cy + nu[1] * thin)     # a point on each inner edge
        pl = (x0 + nl[0] * thick, cy + nl[1] * thick)
        xt = pu[0] + (top - pu[1]) * du[0] / du[1]       # the inner edges on the level cuts
        xb = pl[0] + (bot - pl[1]) * dl[0] / dl[1]
        ip = meet((pu, du), (pl, dl))
        xf = x0 + flat * R / H
        out.append([(x0 + R, top), (xt, top), ip, (xb, bot), (x0 + R, bot),
                    (xf, cy + (xf - x0) * (bot - cy) / R), (xf, cy + (xf - x0) * (top - cy) / R)])
    return out, [], []


BUILDERS.update({"guillemet": guillemet})
