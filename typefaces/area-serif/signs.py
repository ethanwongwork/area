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
LESS_FLAT = 0.79
# A vertex's outside flat across the bisector, over the stroke (parts.VERTEX: 0.42 of the class's stem)
VERTEX = 0.42


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
    return [outer], [inner], [cross((cx, cy), L, t)]


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


def frame(p, s=1.0, white=None):
    """A closed outline of one stroke all round (the shift arrow, caps lock, the lozenge): the centreline is the
    Regular outer outline moved in half the Regular stroke, the outlines half the stroke either side of it, so the
    inner outline is a true inset at every weight. caps lock's bar (bar: x0, x1, gap) is a level stroke under the
    outline's foot, the Regular's gap below it (in a master towards the Bold, the law's least for that gap)."""
    t0, t = p["t"], p["t"] * s
    mid = offset_polygon([tuple(q) for q in p["outer"]], t0 / 2)
    outer, inner = offset_polygon(mid, -t / 2), offset_polygon(mid, t / 2)
    more = []
    if p.get("bar"):
        b = p["bar"]
        foot = min(q[1] for q in outer)
        gap = white(b["gap"]) if white is not None else b["gap"]
        more.append([(b["x0"], foot - gap - t), (b["x1"], foot - gap - t), (b["x1"], foot - gap), (b["x0"], foot - gap)])
    return [outer], [inner], more


def caret(p, s=1.0, white=None):
    """The control key (U+2303): the arrows' head alone, two strokes of the plain weight meeting in a point (outside
    and inside mitred, as the arrows' heads), ends cut square. It was the up arrow cut across with its shaft's stub
    taken out: a 54 by 16 notch in the crotch and two 2-unit steps at the ends."""
    a, h, t = p["apex"], p["head"], p["t"] * s
    dx = p.get("run", h - p["t"] / 2)                   # the arrows' head stroke: across run (0.82: h - t/2), down h
    return [stroke_polyline([(a[0] - dx, a[1] - h), tuple(a), (a[0] + dx, a[1] - h)], [t, t])], [], []


BUILDERS = {"caret": caret, "frame": frame, "erase": erase, "check": check, "radical": radical, "chevron": chevron, "chevron_bar": chevron_bar,
            "times": times}


def build(info, s=1.0, white=None):
    """(outer contours, holes, more outer contours) for a stored recipe {"build": name, "params": {...}}."""
    return BUILDERS[info["build"]](info["params"], s, white)


def corners(info, s=1.0, white=None):
    """Every corner of the construction, in one fixed order."""
    a, b, c = build(info, s, white)
    return [q for P in a + b + c for q in P]


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
        lam = (x1 - x0) - 2 * run * math.cos(math.atan(2 * math.pi * A / max(1.0, (x1 - x0))))
        for _ in range(20):                              # the wave's length so the runs end at x0 and x1
            k = 2 * math.pi * A / lam
            lam = (x1 - x0) - 2 * run / math.sqrt(1 + k * k)
        k = 2 * math.pi * A / lam
        ca, sa = 1 / math.sqrt(1 + k * k), k / math.sqrt(1 + k * k)
        xs = x0 + run * ca
        ys = cy                                          # the wave starts here (an inflection, rising), on its axis

        def C(t, xs=xs, ys=ys, lam=lam):
            return (xs + t * lam, ys + A * math.sin(2 * math.pi * t))
        width = lambda t, C=C: wf(*_dir(C, t))
        nodes = [0.0, 0.25, 0.5, 0.75, 1.0]
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
