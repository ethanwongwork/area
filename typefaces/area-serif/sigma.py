"""Area Serif 0.83 (Regular pass, item A): the summation (U+2211) and Esh (U+01A9), one construction from Area's
capitals, run in the Regular and again in every master.

The owner, twice: "looks very off and wonky" / "still looks weird": the top bar's underside ran into the upper
diagonal through a long S-shaped bracket, the bottom the same; the point was cut to a short upright flat that read
chipped; hooked heels at the top-left and bottom-left corners; the two right serifs differed in size and angle; it
leaned. Both glyphs were Libre Baskerville's Esh, read by the engine as loose parts.

Measured on the references at 400 (build/owner8/reg/a/refsum2.py, tip.py; numbers only; Georgia Pro, Serrif, Source
Serif 4, Literata, Merriweather, Crimson Pro; PP Kyoto Medium beside them): every one stands the summation from the
cap height down past the baseline, a large operator (bottom -0.119 to -0.292 of the cap, median -0.200; PP Kyoto
-0.189); its ink width 0.876 to 1.133 of the face's own E (median 0.982); the point 0.605 to 0.700 of the width from
the left (median 0.637) and 0.516 to 0.531 of the height up (median 0.523: the lower half a little larger); the top
bar's right end 0.945 to 1.042 of the bottom bar's (median 0.974: the lower bar reaches further); each right end a beak
1.0 to 1.34 times the face's own E beak (median 1.11 top, 1.16 bottom); the bars' left ends on one vertical (heel -10
to +22, median -3); the upper diagonal 0.89 to 1.15 of the stem, the lower 0.39 to 0.78; the point sharp in four of
six (Georgia Pro 0.13 of the stem, Literata 0.16 flat; the rest no flat at all).

The construction, from the master's own capitals (`readings`): the two bars E's top arm across, each ending at the right
in E's top arm's beak, the bottom one turned over (both one size: the owner's "equal size top and bottom"; the
references' bottom bar is heavier, 1.6 of the top, not taken); the upper diagonal Z's diagonal across (the capitals'
thick diagonal), the lower A's thin diagonal; every edge straight. The bars' left ends stand on one vertical, each a
square cut its bar's height, the upper diagonal's outer edge leaving the top bar's left end at the underside's height
and the lower diagonal's inner edge the bottom bar's at its top, both straight on to where they meet (the inner notch:
a point); the diagonals' other edges meet the bars in plain corners (Z's joins: no bracket, no S) and each other at the
point, sharp, as the references' median (the capitals' 0.42 flat is for a vertex on a zone line, where it stands in
for the overshoot; mid-height the owner read it as chipped). Width 0.982 of E's ink, the bottom bar's end; the top
bar's end 0.974 of that; the point 0.637 across and 0.523 up. The summation from the cap height to -0.200 of it;
Esh, a capital letter, from the baseline to the cap height on the same construction. In a master the width changes as
E's ink does, every weight read from that master's capitals; the sides are set as a sign's.
"""
import math

LIB = "area.sigma"
CAP = 712.0
W_E = 0.982             # ink width over the face's E's ink width (references 0.876 to 1.133, median 0.982)
TOP_R = 0.974           # the top bar's right end over the bottom bar's, from the left end (references' median)
VX = 0.637              # the point's place across the ink (references 0.605 to 0.700, median 0.637)
VY = 0.523              # and up the height (references 0.516 to 0.531, median 0.523)
VERTEX = 0.0            # the point's flat, a share of the capital stem: sharp (four references of six)
NAMES = ("Esh", "summation")
# 0.83 item A, second pass (the reference study, build/refstudy/spec.md, Georgia Pro / Serrif / PP Kyoto): the
# summation is the n-ary operator, not the Greek capital. Its extent -0.25 to 1.00 of the cap (references -0.19 to
# -0.29, height 1.23 to 1.29 cap; centre 267, 0.065 cap under the maths axis as theirs 0.04 to 0.13); width 0.79 cap
# (references 0.69 to 0.96) at the Regular's E, so 0.9375 of E's ink in any master; its bottom bar heavy, 0.90 of n's
# stem (Georgia Pro 0.96, Serrif 0.89: the operator's mark), the top bar E's arm (references 1.07 to 1.20 hair); the
# diagonals' long edges at 55 and 52 degrees from level (references 53 / 50, 59 / 53, 65 / 67), the point where they
# meet; the point's flat 0.13 of the capital stem across the bisector (Georgia Pro's 0.127; Serrif's is sharp; the
# capitals' 0.42 flat read "chipped" to the owner mid-height). Esh is the letter: cap height, E's arms both, places
# from the median summation (VX, VY above), sharp.
KIND = {
    "Esh": dict(span=(CAP, 0.0), w_e=W_E, bot=None, angles=None, flat=0.42),
    "summation": dict(span=(CAP, -0.25 * CAP), w_e=0.79 * CAP / 600.0, bot=None, angles=(55.0, 52.0), flat=0.42),
}
# 0.84 (Regular pass 2, item 4; the owner: "is the top part of summation supposed to be thicker?"): both bars E's arm
# again. The bottom bar was 0.90 of n's stem (70, the references' operator mark) under a 46 top: Area's own letters
# give no reason for a difference (E's top and bottom arms are both 46, balance.CAP_ARM), so the two agree; the top
# read heavier because the thick diagonal (Z's, 89 upright) joins it in a wide dark corner, not by the bar
SPAN = {k: v["span"] for k, v in KIND.items()}


def _on(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def _lines(cs, minlen):
    out = []
    for P in cs:
        n = len(P)
        for i, q in enumerate(P):
            if q[2] == "line":
                a = P[i - 1]
                if a[2] is not None and math.dist(a[:2], q[:2]) >= minlen:
                    out.append((a[:2], q[:2]))
    return out


def _dist_lines(l1, l2):
    (a, b), (c, d) = l1, l2
    u = ((b[0] - a[0]) / math.dist(a, b), (b[1] - a[1]) / math.dist(a, b))
    m = ((c[0] + d[0]) / 2, (c[1] + d[1]) / 2)
    return abs((m[0] - a[0]) * u[1] - (m[1] - a[1]) * u[0])


def _slope(l):
    (a, b) = l
    return (b[0] - a[0]) / (b[1] - a[1]) if b[1] != a[1] else float("inf")


def _beak(E):
    """E's top arm's right end: the segments from the underside's last line node, round the beak, to the top-right
    corner, and the arm's thickness. Segments as (kind, p0, p1, p2, p3)."""
    P = _on(E)[0]
    n = len(P)
    tops = [i for i, q in enumerate(P) if q[2] and abs(q[1] - CAP) < 0.5]
    corner = max(tops, key=lambda i: P[i][0])
    # walk back from the corner to the underside's line node: the last on-curve point before the corner whose incoming
    # segment is a level line longer than 100
    i = corner
    while True:
        i = (i - 1) % n
        q = P[i]
        if q[2] == "line":
            a = P[(i - 1) % n]
            if a[2] is not None and abs(a[1] - q[1]) < 0.5 and abs(a[0] - q[0]) > 100:
                break
    start = i
    t = CAP - P[start][1]
    segs = []
    k = start
    while k != corner:
        j = (k + 1) % n
        if P[j][2] is None:
            segs.append(("C", P[k][:2], P[j][:2], P[(j + 1) % n][:2], P[(j + 2) % n][:2]))
            k = (j + 2) % n
        else:
            segs.append(("L", P[k][:2], P[k][:2], P[j][:2], P[j][:2]))
            k = j
    return segs, t


def readings(font):
    """The master's capitals: E's top arm (thickness and beak), Z's diagonal across, A's thin diagonal across, H's
    stem, E's ink width."""
    segs, t = _beak(font["E"])
    Z = _lines(_on(font["Z"]), 300)
    zd = [l for l in Z if 0 < _slope(l) < 5]
    td = _dist_lines(zd[0], zd[1])
    A = _lines(_on(font["A"]), 150)
    al = sorted([l for l in A if 0 < _slope(l) < 2 and min(l[0][0], l[1][0]) < 330],
                key=lambda l: -math.dist(*l))
    tn = _dist_lines(al[0], al[1])
    H = _on(font["H"])
    xs = []
    for P in H:
        for a, b in zip(P, P[1:] + P[:1]):
            if (a[1] - 300) * (b[1] - 300) < 0 and a[2] and b[2]:
                xs.append(a[0] + (300 - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))
    xs.sort()
    stem = min(xs[i + 1] - xs[i] for i in range(0, len(xs) - 1, 2))
    ex = [q[0] for P in _on(font["E"]) for q in P]
    nst = []
    for P in _on(font["n"]):
        for a, b in zip(P, P[1:] + P[:1]):
            if (a[1] - 200) * (b[1] - 200) < 0 and a[2] and b[2]:
                nst.append(a[0] + (200 - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))
    nst.sort()
    return {"t": t, "beak": segs, "td": td, "tn": tn, "stem": stem, "e_ink": max(ex) - min(ex),
            "nstem": min(nst[i + 1] - nst[i] for i in range(0, len(nst) - 1, 2))}


def _meet(p, u, q, v):
    den = u[0] * v[1] - u[1] * v[0]
    t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den
    return (p[0] + u[0] * t, p[1] + u[1] * t)


def _unit(d):
    m = math.hypot(*d)
    return (d[0] / m, d[1] / m)


def _edge_through(P, V, w, side):
    """The direction of a line through P whose parallel at distance w (on `side`: +1 to its right going along it)
    passes through V. Solved by halving the angle."""
    def f(phi):
        d = (math.sin(phi), -math.cos(phi)) if side > 0 else (math.sin(phi), math.cos(phi))
        cr = d[0] * (V[1] - P[1]) - d[1] * (V[0] - P[0])
        return abs(cr) - w, d
    # the edge runs steeper than the line from P to V (V lies on the stroke's far side): the root between upright and
    # that line's angle (|cr| has a second root past it, the stroke on the wrong side)
    lo, hi = math.radians(1), math.atan2(abs(V[0] - P[0]), abs(V[1] - P[1]))
    flo = f(lo)[0]
    for _ in range(80):
        mid = (lo + hi) / 2
        fm = f(mid)[0]
        if (fm > 0) == (flo > 0):
            lo, flo = mid, fm
        else:
            hi = mid
    return f((lo + hi) / 2)[1]


def construct(R, wd, x0=0.0, span=(CAP, 0.0), tb=None, angles=None, flat=0.0):
    """Segments of one closed outline (kind, p0, p1, p2, p3), counter-clockwise, and info. span: the bars' outer edges'
    heights (top, bottom); tb: the bottom bar (default the top's); angles: the diagonals' long edges from level (upper,
    lower), else the point at VX, VY; flat: the point's flat, a share of the capital stem."""
    t, td, tn = R["t"], R["td"], R["tn"]
    tb = t if tb is None else tb
    beak = R["beak"]
    Y1, Y0 = span
    bx = max(max(s[1][0], s[4][0]) for s in beak)            # the beak's rightmost x in E
    x1 = x0 + wd
    # the top beak: E's, its top on Y1, its end TOP_R of the bottom bar's reach
    dx, dy = x0 + TOP_R * wd - bx, Y1 - CAP
    top = [(k, (a[0] + dx, a[1] + dy), (b[0] + dx, b[1] + dy), (c[0] + dx, c[1] + dy), (d[0] + dx, d[1] + dy))
           for k, a, b, c, d in beak]
    # the bottom beak: E's turned over (its bottom on Y0), run the other way, its end at the full width
    dxb = x1 - bx
    # a heavier bottom bar: the beak's parts under the arm move with the bar's inner edge, so the serif stands as far
    # past the bar as E's does (one size of serif top and bottom)
    deep = lambda p: (p[0], p[1] - (tb - t) if p[1] < CAP - 7 else p[1])                # noqa: E731
    flip = lambda p: (deep(p)[0] + dxb, Y0 + CAP - deep(p)[1])                         # noqa: E731
    bot = [(k, flip(d), flip(c), flip(b), flip(a)) for k, a, b, c, d in reversed(beak)]
    Ptl, Pbl = (x0, Y1 - t), (x0, Y0 + tb)
    if angles:
        # the long edges at their angles from level; the point where the inner edge of the upper and the outer edge of
        # the lower meet
        au, al = math.radians(90 - angles[0]), math.radians(90 - angles[1])
        du = (math.sin(au), -math.cos(au))
        dl = (math.sin(al), math.cos(al))
        # the upper diagonal's inner edge: td to the outer edge's upper right; the lower's outer edge tn to its lower right
        nu = (-du[1], du[0]) if (-du[1]) > 0 else (du[1], -du[0])
        nl = (dl[1], -dl[0]) if dl[1] > 0 else (-dl[1], dl[0])
        V = _meet((Ptl[0] + nu[0] * td, Ptl[1] + nu[1] * td), du, (Pbl[0] + nl[0] * tn, Pbl[1] + nl[1] * tn), dl)
    else:
        V = (x0 + VX * wd, Y0 + VY * (Y1 - Y0))
        # the upper diagonal: its outer edge from Ptl down-right; its inner edge, td to the edge's upper right, through V
        du = _edge_through(Ptl, V, td, +1)
        # the lower diagonal: its inner (upper-left) edge from Pbl up-right; its outer edge tn to its lower right
        dl = _edge_through(Pbl, V, tn, -1)
    notch = _meet(Ptl, du, Pbl, dl)
    A1 = _meet(V, du, (0.0, Y1 - t), (1.0, 0.0))             # inner edge of the upper diagonal under the top bar
    A2 = _meet(V, dl, (0.0, Y0 + tb), (1.0, 0.0))            # outer edge of the lower diagonal over the bottom bar
    # the point cut as the capitals' vertices: a flat VERTEX x stem across the bisector, where the edges are that far
    e1, e2 = _unit((A1[0] - V[0], A1[1] - V[1])), _unit((A2[0] - V[0], A2[1] - V[1]))
    bis = _unit((e1[0] + e2[0], e1[1] + e2[1]))
    half = math.acos(max(-1.0, min(1.0, e1[0] * e2[0] + e1[1] * e2[1]))) / 2
    dcut = (flat or VERTEX) * R["stem"] / (2 * math.tan(half))
    c0 = (V[0] + bis[0] * dcut, V[1] + bis[1] * dcut)
    cd = (-bis[1], bis[0])
    f_up = _meet(V, e1, c0, cd)
    f_dn = _meet(V, e2, c0, cd)

    def L(a, b):
        return ("L", a, a, b, b)
    segs = [L((x0, Y1), Ptl), L(Ptl, notch), L(notch, Pbl), L(Pbl, (x0, Y0)), L((x0, Y0), bot[0][1])]
    segs += bot
    segs += [L(bot[-1][4], A2), L(A2, f_dn), L(f_dn, f_up), L(f_up, A1), L(A1, top[0][1])]   # f_dn == f_up: sharp
    segs += top
    segs += [L(top[-1][4], (x0, Y1))]
    info = {"VX": (V[0] - x0) / wd, "VY": (V[1] - Y0) / (Y1 - Y0), "tb": tb, "V": V, "notch": notch, "A1": A1, "A2": A2, "flat": math.dist(f_up, f_dn), "x1": x1,
            "up_deg": math.degrees(math.atan2(du[0], -du[1])), "low_deg": math.degrees(math.atan2(dl[0], dl[1]))}
    return segs, info


def to_points(segs):
    """Closed segments -> UFO points (x, y, type, smooth), whole units; a line of no length dropped; a node smooth where
    the tangents in and out run on within 3 degrees (E's curve into its beak; the soft corners stay corners)."""
    segs = [s for s in segs if not (s[0] == "L" and math.dist(s[1], s[4]) < 0.5)]

    def t_in(s):
        for a in (s[3], s[2], s[1]):
            if math.dist(a, s[4]) > 1e-6:
                return _unit((s[4][0] - a[0], s[4][1] - a[1]))

    def t_out(s):
        for a in (s[2], s[3], s[4]):
            if math.dist(a, s[1]) > 1e-6:
                return _unit((a[0] - s[1][0], a[1] - s[1][1]))
    pts = []
    n = len(segs)
    for i, s in enumerate(segs):
        u, v = t_in(s), t_out(segs[(i + 1) % n])
        sm = u[0] * v[0] + u[1] * v[1] > math.cos(math.radians(3))
        if s[0] == "L":
            pts.append((round(s[4][0]), round(s[4][1]), "line", sm))
        else:
            pts += [(round(s[2][0]), round(s[2][1]), None, False), (round(s[3][0]), round(s[3][1]), None, False),
                    (round(s[4][0]), round(s[4][1]), "curve", sm)]
    return pts


def _put(g, P):
    from ufoLib2.objects import Contour, Point
    g.clearContours()
    for comp in list(g.components):
        g.components.remove(comp)
    c = Contour()
    c.points = [Point(x, y, t, smooth=sm) for x, y, t, sm in P]
    g.contours.append(c)


def _wd(R, name="Esh"):
    return KIND[name]["w_e"] * R["e_ink"]


def build(R, name):
    k = KIND[name]
    tb = None if k["bot"] is None else k["bot"] * R["nstem"]
    return construct(R, _wd(R, name), 0.0, k["span"], tb, k["angles"], k["flat"])


def regular(font):
    """Esh and the summation from the construction at the Regular's capitals; each keeps its side bearings."""
    if "E" not in font:
        return "no E"
    R = readings(font)
    notes = []
    for name in NAMES:
        if name not in font:
            continue
        g = font[name]
        xs = [p.x for c in g.contours for p in c.points]
        lsb, rsb = (min(xs), g.width - max(xs)) if xs else (30, 30)
        segs, info = build(R, name)
        P = to_points(segs)
        nx = [q[0] for q in P]
        dx = round(lsb - min(nx))
        P = [(x + dx, y, t, sm) for x, y, t, sm in P]
        _put(g, P)
        g.width = round(max(nx) + dx + rsb)
        g.lib[LIB] = {"version": 1}
        notes.append(f"{name} advance {g.width}, width {_wd(R, name):.0f}, span {SPAN[name]}, point flat {info['flat']:.0f} "
                     f"at {info['VX']:.3f} / {info['VY']:.3f}, diagonals {info['up_deg']:.1f} / {info['low_deg']:.1f} deg "
                     f"from upright, bars {R['t']:.0f} / {info['tb']:.0f}, thick {R['td']:.0f}, thin {R['tn']:.0f}")
    return "; ".join(notes)


def master(reg, font, sides, name):
    """A master's glyph: the construction at this master's capitals, its width changed as E's ink; sides(reg points,
    new points) -> (shift, width) as the engine sets a sign's."""
    if name not in reg or LIB not in reg[name].lib or name not in font:
        return None
    R0, R = readings(reg), readings(font)
    segs, info = build(R, name)
    P = to_points(segs)
    Rp = _on(reg[name])
    if [[q[2] for q in Rp[0]]] != [[q[2] for q in P]]:
        raise ValueError(f"{name}: the master's construction does not match the Regular's points "
                         f"({len(P)} against {len(Rp[0])})")
    shift, width = sides(Rp, [P])
    _put(font[name], [(x + shift, y, t, sm) for x, y, t, sm in P])
    font[name].width = width
    return (f"{name}: construction, bars {R['t']:.0f}, thick {R['td']:.0f}, thin {R['tn']:.0f}, flat "
            f"{info['flat']:.0f}, width {_wd(R, name):.0f}, bottom bar {info['tb']:.0f}")

# 0.84 (Regular pass 2, item 5, one corner rule): the point where the two diagonals meet is a vertex finished as A's
# apex, a flat 0.42 of the capital stem (36) across the bisector (KIND flat 0.42 for both; it was 0.13, 11, on the
# summation, Georgia Pro's, and sharp on Esh)
