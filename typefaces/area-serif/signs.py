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
    return [[P, Vi, C2, (xr, top), (xr, top - tb), C1, V, K, El, Eu]], [], []


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
    dx = h - p["t"] / 2                                 # the arrows' head stroke: across h - t/2, down h (east())
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
