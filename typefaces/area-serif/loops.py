"""The double-storey g's lower loop, as one construction (0.81; owner, 2026-11-14: "the descender on the double story
g also does not look super smooth, so please confirm").

What 0.80 had (measured with curvecheck.py, tools/combs.py and tools/loop_profile.py, before over after in
docs/research/serif-typeface-2026-11-10/img/081/):
  - Libre Baskerville's loop with its hook lifted into the link (derive.g_closed_loop): the loop's left side ran up
    as a leaning, nearly straight stroke and ended in a round knob (radius 44) that overlapped the link and left a
    notch outside. Its thickness rose on the way up, 1.12 hairlines at the left to 1.34-1.39 where it met the link,
    where Georgia Pro, Serrif, Source Serif 4 and Literata all thin to 0.62, 0.78, 0.50 and 0.69 (mean 0.65).
  - The link's two straight edges ran into the loop's shoulder with the curvature jumping from nothing to a radius
    of 160 inside and 270 outside (57% of the curve's tightest at the join), the comb's visible steps.
  - The counter's lowest point had 1.56 times the curvature on one side as the other.

The loop now (owner decisions kept: wide and flat-ish like Serrif's, raised into the link; the ear and bowl as
they were). Every curve is a cubic in the triangle of its two end tangents, its handles a share of the triangle's
sides; the link's straight edges, its outer curl, the bowl and the ear are 0.80's points.
  - Outside, three quarters (left, lowest, right) at the bowl's outer tension, LOOP_K[0] = 0.57; inside, three at
    the counter's, LOOP_K[1] = 0.61 (parts.py's bowl: 0.57 outside, 0.61 inside, so the stroke thins toward the
    extremes by itself).
  - Each lowest point sits where the curvature on its two sides is equal (b / a^2 the same on both quarters).
  - The loop's extremes keep 0.80's places across (outer 30 and 521, inner 103 and 451, lowest -233 and -190: the
    sides 73 and 70, the bottom 43, one hairline). Their heights are solved: the counter's left extreme at
    LEFT_SHARE and its right at RIGHT_SHARE of the counter's height (Georgia Pro, Serrif, Source Serif 4,
    Literata: left 0.49 0.51 0.50 0.48, right 0.60 0.51 0.56 0.61), each outer extreme level with its inner one.
  - The left side rises into the link as a branch does from a stem (the construction skill's ladder): outside, it
    meets the link's curl in a corner (the notch), inside it meets the link's lower edge in a corner (the crotch),
    the two edges arriving parallel, and the stroke between notch and counter is the branch neck, parts.NECK_BRANCH
    (32; the references' 0.65 hairlines are 28).
  - The arcs that run into the link (right shoulder into the upper edge, the counter's top-right into the lower
    edge) leave the straight with their curvature at most EASE of their tightest (0.80: 0.57) and tighten steadily
    from there to the extreme, where they are tightest; the left side's edges have no flat place on their way up;
    every smooth node has the same curvature on both sides. The handle at each such node is solved for it (within
    TENSION).
The unknowns (the four solved handles, the two at the link, the notch's place on the curl, the crotch's on the lower
edge, the arrival angle, the four extreme heights) are found by one deterministic simplex search from fixed starts;
the result is written in whole units. curvecheck.py checks the outcome; loop_profile.py measures the thickness.
"""
import math

import numpy as np

import curvecheck as K

LOOP_K = (0.57, 0.61)           # outside, inside: parts.py's bowl tensions
LEFT_SHARE, RIGHT_SHARE = 0.495, 0.57
EASE = 0.35                     # a curve leaving a straight: its curvature there / its tightest
TENSION = (0.45, 0.92)          # a solved handle's share of its side
NECK = 32                       # parts.NECK_BRANCH


def _unit(v):
    h = math.hypot(*v)
    return (v[0] / h, v[1] / h)


def _arc(P0, d0, P3, d3, k0, k3):
    a = np.array([[d0[0], d3[0]], [d0[1], d3[1]]], float)
    b = np.array([P3[0] - P0[0], P3[1] - P0[1]], float)
    u, v = np.linalg.solve(a, b)
    if u <= 0 or v <= 0:
        raise ValueError("no triangle")
    return (tuple(P0), (P0[0] + k0 * u * d0[0], P0[1] + k0 * u * d0[1]),
            (P3[0] - k3 * v * d3[0], P3[1] - k3 * v * d3[1]), tuple(P3))


def _split(c, t):
    p0, p1, p2, p3 = [np.array(p, float) for p in c]
    a = p0 + (p1 - p0) * t
    b = p1 + (p2 - p1) * t
    cc = p2 + (p3 - p2) * t
    d = a + (b - a) * t
    e = b + (cc - b) * t
    f = d + (e - d) * t
    return (tuple(p0), tuple(a), tuple(d), tuple(f))


def _k(c, t):
    return K.curvature(("C", c), t)


def _peak(c):
    return max(abs(_k(c, i / 40)) for i in range(41))


def _lr(a, b):
    return math.log(max(abs(a), 1e-9) / max(abs(b), 1e-9))


def _sample(c, n=60):
    return [K.pt(("C", c), i / n) for i in range(n + 1)]


def anchors(P):
    """0.80's loop read by geometry from g's outer contour (point list): the extremes, the link's straight edges,
    its outer curl and the node where its upper edge meets the curl. Index-free, so it holds wherever the glyph
    sits."""
    n = len(P)
    on = [i for i in range(n) if P[i][2]]
    below = [i for i in on if P[i][1] < 0]
    iB = min(below, key=lambda i: P[i][1])
    xL = min(P[i][0] for i in below)
    xR = max(P[i][0] for i in below)
    yB = P[iB][1]
    inner = [i for i in below if P[i][3] and xL + 20 < P[i][0] < xR - 20]
    yIB = min(P[i][1] for i in inner if P[i][1] > yB + 5)
    xIL = min(P[i][0] for i in inner)
    xIR = max(P[i][0] for i in inner if P[i][1] < -20)
    # the link: two straight edges, lower (nearer the baseline) and upper
    lines = [i for i in on if P[i][2] == "line" and P[i - 1][2] and abs(P[i][1] - P[i - 1][1]) < 0.25 * abs(P[i][0] - P[i - 1][0])
             and -40 < min(P[i][1], P[i - 1][1]) and max(P[i][1], P[i - 1][1]) < 160]
    low = min(lines, key=lambda i: P[i][1] + P[i - 1][1])
    up = max(lines, key=lambda i: P[i][1] + P[i - 1][1])
    # the lower edge runs left to right (towards the loop's inside top right), the upper right to left
    lo0, lo1 = (P[low - 1], P[low]) if P[low - 1][0] < P[low][0] else (P[low], P[low - 1])
    up0, up1 = (P[up - 1], P[up]) if P[up - 1][0] > P[up][0] else (P[up], P[up - 1])
    i7 = up if P[up][0] < P[up - 1][0] else up - 1          # the upper edge's left end, where the curl starts
    # the curl's outside: the smooth node furthest left between the link's edges and the bowl
    iL = min((i for i in on if P[i][3] and 40 < P[i][1] < 170), key=lambda i: P[i][0])
    j = (iL + 1) % n
    Lc = (P[iL][:2], P[j][:2], P[(j + 1) % n][:2], P[(j + 2) % n][:2])
    return dict(xL=xL, xR=xR, yB=yB, xIL=xIL, xIR=xIR, yIB=yIB, Lc=Lc, iL=iL, i7=i7,
                low0=lo0[:2], low_slope=(lo1[1] - lo0[1]) / (lo1[0] - lo0[0]), low_dir=_unit((lo1[0] - lo0[0], lo1[1] - lo0[1])),
                N53=lo1[:2], N6=up0[:2], N7=up1[:2], up_dir=_unit((up1[0] - up0[0], up1[1] - up0[1])))


def build(A, x):
    kOR, kIR, kOL, kIL, tV, sIC, th, k6, k53, yOL, yIL, yOR, yIR = x
    KO, KI = LOOP_K
    xL, xR, yB = A["xL"], A["xR"], A["yB"]
    xIL, xIR, yIB = A["xIL"], A["xIR"], A["yIB"]
    IC = (sIC, A["low0"][1] + (sIC - A["low0"][0]) * A["low_slope"])
    r = math.sqrt((yOL - yB) / (yOR - yB))                  # equal curvature either side of the lowest point
    xOB = xL + (xR - xL) * r / (1 + r)
    ri = math.sqrt((yIL - yIB) / (yIR - yIB))
    xIB = xIL + (xIR - xIL) * ri / (1 + ri)
    OB, OL, OR = (xOB, yB), (xL, yOL), (xR, yOR)
    IB, IL, IR = (xIB, yIB), (xIL, yIL), (xIR, yIR)
    up, dn, rt, lf = (0, 1), (0, -1), (1, 0), (-1, 0)
    dth = (math.cos(th), math.sin(th))
    LV = _split(A["Lc"], tV)
    V = LV[3]
    S = dict(OB=OB, OL=OL, OR=OR, IB=IB, IL=IL, IR=IR, V=V, IC=IC, LV=LV)
    S["q_OL_OB"] = _arc(OL, dn, OB, rt, KO, KO)
    S["q_OB_OR"] = _arc(OB, rt, OR, up, KO, KO)
    S["a_OR_6"] = _arc(OR, up, A["N6"], A["up_dir"], kOR, k6)
    S["a_V_OL"] = _arc(V, (-dth[0], -dth[1]), OL, dn, KO, kOL)
    S["a_53_IR"] = _arc(A["N53"], A["low_dir"], IR, dn, k53, kIR)
    S["q_IR_IB"] = _arc(IR, dn, IB, lf, KI, KI)
    S["q_IB_IL"] = _arc(IB, lf, IL, up, KI, KI)
    S["a_IL_IC"] = _arc(IL, up, IC, dth, kIL, KI)
    return S


def _valley(c, rising=None):
    """How far |k| inside c falls and rises again (a flat place), as a share; with rising=True or False, how far it
    goes against that direction (a transition curve tightens steadily one way)."""
    ks = [abs(_k(c, i / 24)) for i in range(25)]
    if rising is not None:
        ks = ks if rising else ks[::-1]
        return sum(max(0.0, (a - b) / max(a, 1e-9)) for a, b in zip(ks, ks[1:]))
    best, top = 0.0, ks[0]
    for i in range(1, len(ks)):
        top = max(top, ks[i])
        right = max(ks[i:])
        best = max(best, (min(top, right) - ks[i]) / max(min(top, right), 1e-9))
    return best


def neck(S):
    pts = _sample(S["a_IL_IC"]) + [(S["IC"][0] + i * 5, S["IC"][1]) for i in range(10)]
    return min(math.dist(S["V"], p) for p in pts)


def cost(A, x, terms_out=None):
    try:
        S = build(A, x)
    except (ValueError, np.linalg.LinAlgError, ZeroDivisionError):
        return 1e9
    kOR, kIR, kOL, kIL, tV, sIC, th, k6, k53, yOL, yIL, yOR, yIR = x
    ks = (kOR, kIR, kOL, kIL, k6, k53)
    if not (0.02 < tV < 0.98) or not (0.2 < th < 1.5) or min(ks) < TENSION[0] or max(ks) > TENSION[1] \
            or sIC > A["N53"][0] - 40 or min(yOL, yIL, yOR, yIR) <= A["yIB"] + 10:
        return 1e9
    h = S["IC"][1] - A["yIB"]
    e6 = abs(_k(S["a_OR_6"], 1.0)) / _peak(S["a_OR_6"])
    e53 = abs(_k(S["a_53_IR"], 0.0)) / _peak(S["a_53_IR"])
    terms = {
        "OL": _lr(_k(S["a_V_OL"], 1), _k(S["q_OL_OB"], 0)),
        "OR": _lr(_k(S["q_OB_OR"], 1), _k(S["a_OR_6"], 0)),
        "IR": _lr(_k(S["a_53_IR"], 1), _k(S["q_IR_IB"], 0)),
        "IL": _lr(_k(S["q_IB_IL"], 1), _k(S["a_IL_IC"], 0)),
        "e6": max(0, e6 - EASE) * 4, "e53": max(0, e53 - EASE) * 4,
        "neck": (neck(S) - NECK) / 2,
        "ls": ((yIL - A["yIB"]) / h - LEFT_SHARE) * 6, "rs": ((yIR - A["yIB"]) / h - RIGHT_SHARE) * 6,
        "pairL": (yOL - yIL) / 25, "pairR": (yOR - yIR) / 25,
        "reg": 0.1 * sum(abs(k - 0.59) for k in ks),
        # the curves off the link's straights tighten steadily to the extreme; the left side's two edges have no
        # flat place on the way up
        "t6": 2 * _valley(S["a_OR_6"], rising=False), "t53": 2 * _valley(S["a_53_IR"], rising=True),
        "vV": 2 * _valley(S["a_V_OL"]), "vI": 2 * _valley(S["a_IL_IC"]),
    }
    if terms_out is not None:
        terms_out.update(terms)
    return sum(v * v for v in terms.values())


def _simplex(f, x0, steps, iters):
    n = len(x0)
    pts = [np.array(x0, float)] + [np.array(x0, float) + np.eye(n)[i] * steps[i] for i in range(n)]
    vals = [f(p) for p in pts]
    for _ in range(iters):
        o = np.argsort(vals)
        pts, vals = [pts[i] for i in o], [vals[i] for i in o]
        c = sum(pts[:-1]) / n
        xr = c + (c - pts[-1])
        fr = f(xr)
        if fr < vals[0]:
            xe = c + 2 * (c - pts[-1])
            fe = f(xe)
            pts[-1], vals[-1] = (xe, fe) if fe < fr else (xr, fr)
        elif fr < vals[-2]:
            pts[-1], vals[-1] = xr, fr
        else:
            xc = c + 0.5 * (pts[-1] - c)
            fc = f(xc)
            if fc < vals[-1]:
                pts[-1], vals[-1] = xc, fc
            else:
                pts = [pts[0]] + [pts[0] + 0.5 * (p - pts[0]) for p in pts[1:]]
                vals = [vals[0]] + [f(p) for p in pts[1:]]
    i = int(np.argmin(vals))
    return pts[i], vals[i]


def solve(A):
    best = None
    mid_l = A["yIB"] + LEFT_SHARE * (A["low0"][1] - A["yIB"])
    mid_r = A["yIB"] + RIGHT_SHARE * (A["low0"][1] - A["yIB"])
    for th in (0.5, 0.9, 1.2):
        for tv in (0.4, 0.7):
            for s in (A["low0"][0] - 12, A["low0"][0] + 23):
                x0 = [0.6, 0.6, 0.6, 0.6, tv, s, th, 0.75, 0.75, mid_l, mid_l, mid_r, mid_r]
                x, v = _simplex(lambda z: cost(A, z), x0, [0.06] * 4 + [0.1, 15, 0.15, 0.06, 0.06, 10, 10, 10, 10], 2500)
                if best is None or v < best[1]:
                    best = (x, v)
    return best


CORNER_EASE = 0.45      # curvecheck.EASE: this corner has the least room (the link's lower edge is 74 above the extreme)
CORNER_RUN = 90         # how far the turn may start back along the link's lower edge (its straight is 177 long)
CORNER_RATIO = 1.20     # round 2: the counter's top-right turn (0.81's first solve left 1.60, a spike in the comb)


def ease_corner(A, x):
    """The counter's top-right turn, from the link's lower edge into the right extreme, once more with its two handles
    and its start on the link's straight edge free (every extreme stays): the curvature across the extreme within
    CORNER_RATIO, the start off the straight within CORNER_EASE, no flat place inside, and its tightest as open as
    those allow (a pinched corner is a spike in the comb). Its tightest may sit inside the turn, as on any round
    corner. Returns (x, A) with A's N53 (where the straight ends) moved along the edge."""
    x = list(x)
    x0, y0 = A["N53"]
    dx, dy = A["low_dir"]

    def at(z):
        y = list(x)
        y[1], y[8] = z[0], z[1]
        B = dict(A, N53=(x0 - z[2] * dx, y0 - z[2] * dy))
        return y, B

    def f(z):
        if not (TENSION[0] <= z[0] <= 1.0 and TENSION[0] <= z[1] <= TENSION[1] and 0 <= z[2] <= CORNER_RUN):
            return 1e9
        y, B = at(z)
        try:
            S = build(B, y)
        except (ValueError, np.linalg.LinAlgError):
            return 1e9
        c = S["a_53_IR"]
        r = abs(_lr(_k(c, 1), _k(S["q_IR_IB"], 0)))
        e = abs(_k(c, 0.0)) / _peak(c)
        q = abs(_k(S["q_IR_IB"], 0))                      # the counter's own curvature at the extreme
        return ((max(0, r - math.log(CORNER_RATIO)) * 20) ** 2 + r * r + (max(0, e - CORNER_EASE) * 8) ** 2
                + (2 * _valley(c)) ** 2 + (0.5 * math.log(_peak(c) / q)) ** 2 + (z[2] / 400) ** 2)
    z, _v = _simplex(f, [x[1], x[8], 20.0], [0.05, 0.05, 15], 800)
    y, B = at(z)
    B["N53"] = (round(B["N53"][0]), round(B["N53"][1]))
    return y, B


def _r(p):
    return (int(round(float(p[0]))), int(round(float(p[1]))))


def lists(S, P, A):
    """g's new outer contour and the loop's counter, from the old outer contour P."""
    on = lambda p, s=True: (*_r(p), "curve", s)            # noqa: E731
    off = lambda p: (*_r(p), None, False)                    # noqa: E731
    n = len(P)
    out = [on(S["OB"])]
    c = S["q_OB_OR"]
    out += [off(c[1]), off(c[2]), on(c[3])]
    c = S["a_OR_6"]
    out += [off(c[1]), off(c[2]), on(c[3])]
    i7, iL = A["i7"], A["iL"]
    k = i7
    while True:                                              # the link's upper edge, curl, bowl and ear, as they were
        out.append(tuple(P[k]))
        if k == iL:
            break
        k = (k + 1) % n
    LV = S["LV"]
    out += [off(LV[1]), off(LV[2]), on(LV[3], False)]
    c = S["a_V_OL"]
    out += [off(c[1]), off(c[2]), on(c[3])]
    c = S["q_OL_OB"]
    out += [off(c[1]), off(c[2])]
    inner = [(*_r(S["IC"]), "curve", False), (*_r(A["N53"]), "line", True)]
    for key in ("a_53_IR", "q_IR_IB", "q_IB_IL", "a_IL_IC"):
        c = S[key]
        inner += [off(c[1]), off(c[2]), on(c[3])]
    return out, inner[:-1]


def is_old_loop(P):
    """0.80's g: the loop is drawn inside the one outer contour (the hook overlaps the link)."""
    return sum(1 for p in P if p[2] and p[1] < 0) >= 6


def g_loop(font, name="g"):
    """Rebuilds g's lower loop (see the module's text). Returns a report line."""
    from ufoLib2.objects import Contour, Point
    g = font[name]
    oc = max(g.contours, key=lambda c: len(c.points))
    P = [(p.x, p.y, p.type, p.smooth) for p in oc.points]
    if not is_old_loop(P):
        return f"{name}: loop already built"
    A = anchors(P)
    x, v = solve(A)
    x, A = ease_corner(A, x)
    S = build(A, x)
    terms = {}
    cost(A, x, terms)
    out, inner = lists(S, P, A)
    idx = g.contours.index(oc)
    new = Contour()
    new.points = [Point(px, py, t, smooth=s) for px, py, t, s in out]
    g.contours[idx] = new
    hole = Contour()
    hole.points = [Point(px, py, t, smooth=s) for px, py, t, s in inner]
    g.contours.append(hole)
    return (f"{name}: loop rebuilt (residual {v:.3f}; neck {neck(S):.1f}; curvature ratio at the solved nodes "
            + ", ".join(f"{k} {math.exp(abs(terms[k])):.2f}" for k in ("OL", "OR", "IR", "IL")) + ")")


# ------------------------------------------------------------------------------------------- j's and y's tails
# 0.81 round 3 (coordinator: "bring j and y into the same tail family"). Measured on 0.80 (curvecheck.py): j's
# outside jumped 1.30 at its lowest point, and y's tail ran through three flat places (its inside 109, 188, then 27
# into the neck; its outside 98, 235, then 49 at its lowest point and 53, 94, 48 into the ball). g.ss02's tail rule,
# carried over: from where the straight edge ends (the stem's for j, the thin diagonal's for y) round the lowest point
# to the ball, each edge is two curves whose curvature only rises toward the ball and is equal across the lowest
# point; the outside meets the ball at the ball's own curvature. The ball, the depth, the stroke at the lowest point
# and the general reach stay. The lowest point is placed at the references' share of the reach (tools/tail_profile.py:
# j: Georgia Pro 0.681, Source Serif 4 0.673, Literata 0.838, Serrif 0.993; y: 0.681, 0.679, 0.656, 0.654), at the
# nearest edge of their range to 0.80's (j 0.589, y 0.714); the inside's lowest point stays where 0.80 had it.
TAIL_LOW = {"j": 0.673, "y": 0.681}
TAIL_THIN = 0.87        # the stroke's thinnest, in hairlines, no less than the references' least (Source Serif 4's j 0.870)


def _ray_y(P0, d, y):
    t = (y - P0[1]) / d[1]
    return (P0[0] + t * d[0], P0[1] + t * d[1])


def _tail_curves(P_line, d_line, s, B, E, e_dir, z):
    a, b, c, dd = z
    P0 = (P_line[0] + s * d_line[0], P_line[1] + s * d_line[1])
    apex = _ray_y(P0, d_line, B[1])
    u, w = math.dist(P0, apex), apex[0] - B[0]
    c1 = (P0, (P0[0] + a * u * d_line[0], P0[1] + a * u * d_line[1]), (B[0] + b * w, B[1]), B)
    h = math.dist(E, B)
    c2 = (B, (B[0] - c * (B[0] - E[0]), B[1]), (E[0] - e_dir[0] * dd * h, E[1] - e_dir[1] * dd * h), E)
    return c1, c2


def _tail_score(c1, c2, e_k, s, s0):
    ks = [abs(_k(c1, i / 16)) for i in range(17)] + [abs(_k(c2, i / 16)) for i in range(1, 17)]
    fall = sum(max(0.0, (p - q) / p) for p, q in zip(ks, ks[1:]) if p > 1e-9)
    g2 = abs(_lr(_k(c1, 1), _k(c2, 0)))
    arrive = 0.0 if e_k is None else abs(_lr(_k(c2, 1), e_k))
    return (3 * fall) ** 2 + (3 * g2) ** 2 + arrive ** 2 + ((s - s0) / 60) ** 2


def _solve_tail(P_line, d_line, s0, s_rng, B, E, e_dir, e_k):
    def f(v):
        s, *z = v
        if not (s_rng[0] <= s <= s_rng[1] and all(0.25 <= q <= 0.85 for q in z)):
            return 1e9
        try:
            c1, c2 = _tail_curves(P_line, d_line, s, B, E, e_dir, z)
        except ZeroDivisionError:
            return 1e9
        return _tail_score(c1, c2, e_k, s, s0)
    best = None
    for start in ([s0, 0.55, 0.55, 0.55, 0.55], [s0, 0.7, 0.45, 0.45, 0.4], [s0, 0.45, 0.6, 0.6, 0.35]):
        v, val = _simplex(f, start, [15, 0.08, 0.08, 0.08, 0.08], 1200)
        if best is None or val < best[1]:
            best = (v, val)
    v = best[0]
    return _tail_curves(P_line, d_line, v[0], B, E, e_dir, v[1:]), best[1]


def _thinnest(inner, outer):
    """The stroke across itself: the least distance from the inside's points (short of the last fifth, the neck)
    to the outside edge."""
    pin = [K.pt(("C", c), i / 30) for c in inner for i in range(31)]
    pin = pin[: int(len(pin) * 0.8)]
    pout = [K.pt(("C", c), i / 60) for c in outer for i in range(61)]
    return min(min(math.dist(p, q) for q in pout) for p in pin)


def round_tail(font, name, kind=None, master=False):
    """j's or y's tail by the rule above; the ball (neck, top, left side) is the letter's own and does not move.
    kind: whose reach share the tail takes ("j" or "y"; by default the glyph's name). master: a weight master's
    tail (the handle into the neck kept on the ball's line in whole units; the Regular keeps its own rounding)."""
    from ufoLib2.objects import Point
    g = font[name]
    oc = max(g.contours, key=lambda c: len(c.points))
    P = oc.points
    n = len(P)
    on = [i for i, p in enumerate(P) if p.type]
    iB = min(on, key=lambda i: (P[i].y, P[i].x))           # the outside's lowest point
    iC, iN, iBi, iDi = [(iB - 3 * k) % n for k in (1, 3, 4, 5)]
    iD = (iB + 3) % n
    assert P[iDi].type == "line" and P[(iD + 1) % n].type == "line", f"{name}: the tail is not drawn as expected"
    xy = lambda i: (P[i].x, P[i].y)                       # noqa: E731
    unit = lambda v: (v[0] / math.hypot(*v), v[1] / math.hypot(*v))   # noqa: E731
    # the straight edges the tail leaves: outside, the line ending at D; inside, the line ending at D'
    d_out = unit((P[iD].x - P[(iD + 1) % n].x, P[iD].y - P[(iD + 1) % n].y))
    d_in = unit((P[iDi].x - P[iDi - 1].x, P[iDi].y - P[iDi - 1].y))
    depth, in_y = P[iB].y, P[iBi].y
    C, N = xy(iC), xy(iN)
    # where the straight edge meets the descender zone's top, for the reach (tail_profile's stem_r at -0.05 x-height)
    edge = _ray_y(xy(iD), d_out, -26)[0]
    Bx = round(edge - TAIL_LOW[kind or name] * (edge - C[0]))
    Bix = P[iBi].x                                         # the inside's lowest point stays (it sets the stroke there)
    ball_k = _k((xy(iC - 3), xy(iC - 2), xy(iC - 1), C), 1.0)
    after = xy((iN + 1) % n)
    e_in = unit((after[0] - N[0], after[1] - N[1]))
    # the stroke's thinnest across itself before (inside points to the outside edge, short of the neck): kept
    old_in = [tuple((P[(iDi + k) % n].x, P[(iDi + k) % n].y) for k in range(4)),
              tuple((P[(iBi + k) % n].x, P[(iBi + k) % n].y) for k in range(4))]
    old_out = [tuple((P[(iC + k) % n].x, P[(iC + k) % n].y) for k in range(4)),
               tuple((P[(iB + k) % n].x, P[(iB + k) % n].y) for k in range(4))]
    thin0 = _thinnest(old_in, old_out)
    (o1, o2), vo = _solve_tail(xy(iD), d_out, 0.0, (-60, 60), (Bx, depth), C, (0.0, 1.0), ball_k)
    # the inside's lowest point: where it was or toward the outside's move, by steps of 4: the smoothest inside
    # (least residual) of those that keep the stroke's thinnest at 0.80's or at the references' least, whichever is less
    cands = []
    lo = min(Bix, Bix + (Bx - P[iB].x))
    for x_try in sorted({Bix, *range(int(lo), int(Bix) + 1, 4)}, reverse=True):
        (c1, c2), v_ = _solve_tail(xy(iDi), d_in, 0.0, (-60, 60), (x_try, in_y), N, e_in, None)
        th = _thinnest([c1, c2], [o2[::-1], o1[::-1]])
        cands.append((th < min(thin0 - 1, TAIL_THIN * 43), v_, x_try, c1, c2))
    _bad, vi, _x, i1, i2 = min(cands, key=lambda c: (c[0], c[1]))       # the smoothest that keeps the stroke
    R = lambda p: (int(round(p[0])), int(round(p[1])))     # noqa: E731
    want = {iDi: i1[0], (iDi + 1) % n: i1[1], (iDi + 2) % n: i1[2], iBi: i1[3], (iBi + 1) % n: i2[1],
            (iBi + 2) % n: i2[2],
            (iC + 1) % n: o2[2], (iC + 2) % n: o2[1], iB: o1[3], (iB + 1) % n: o1[2], (iB + 2) % n: o1[1], iD: o1[0]}
    for i, p in want.items():
        P[i].x, P[i].y = R(p)
    # the handle into the neck in whole units on the ball's own line there (rounding a short handle turned it off the
    # line by 4.4 degrees on the Bold y): of the four nearest whole points, the one nearest that line
    h_ = (iBi + 2) % n
    ex = i2[2]
    if not master:
        return (f"{name}: tail rebuilt (lowest point {P[iB].x}, {P[iB].y}; inside's {P[iBi].x}; thinnest "
                f"{_thinnest([i1, i2], [o2[::-1], o1[::-1]]):.0f}, was {thin0:.0f}; residual outside {vo:.3f}, inside {vi:.3f})")
    P[h_].x, P[h_].y = min(((fx(ex[0]), fy(ex[1])) for fx in (math.floor, math.ceil) for fy in (math.floor, math.ceil)),
                           key=lambda q: (abs((q[0] - N[0]) * e_in[1] - (q[1] - N[1]) * e_in[0]), math.dist(q, ex)))
    return (f"{name}: tail rebuilt (lowest point {P[iB].x}, {P[iB].y}; inside's {P[iBi].x}; thinnest "
            f"{_thinnest([i1, i2], [o2[::-1], o1[::-1]]):.0f}, was {thin0:.0f}; residual outside {vo:.3f}, inside {vi:.3f})")


# ------------------------------------------------------------------------------------------- the tail in every master
# 0.81 (owner, 15 November, on the Bold: "the tails are not smooth and the tips are not consistent with the other
# tails"; j and y lumpy, y's ball pinched). The masters' tails were the engine's point moves: it read the ball's box
# from the neck to the left side (83 by 48 on j) as a round end's (88 by 44) and grew it 1.42 across and 1.14 up, so
# the Bold's ball was 61 by 49 (the Light's 36 by 40) and the tail met it at 1.80 times its curvature (curvecheck on
# the Bold: j 1.80, y 1.54 and a flat place; g.ss02, spliced from j, 1.34 and a 49% valley). The rule, in every master:
#  1. the ball is the round ends' part: the Regular's ball (neck, top, left side and the handles between) scaled by
#     the round ends' own law (bold.BALL: 1 + 0.40 f, as a c f r 2 3 5 6 9 take it, 1.40 at the Bold and 0.85 at the
#     Light, measured on those masters) about its centre (the top's x, the left side's height), centred where the
#     engine put it: a similarity, so its shape is the Regular's at every weight;
#  2. the tail between the straight edge and the ball is solved again by round_tail on the master's own edges, ball
#     and depth (the Regular's rule: curvature only rising toward the ball, equal across the lowest point).
# The Regular is unchanged (at f 0 the ball's scale is 1 and its centre its own; round_tail is the Regular's rule).

def tail_kind(reg_font, P):
    """Whose tail a Regular contour carries, if any: "j" or "y" when its ball and lowest point are j's or y's,
    point for point (within a unit) up to a move (j, jdotless, eng, f_j, f_f_j; y). Else None."""
    def sig(Q):
        n = len(Q)
        on = [i for i, q in enumerate(Q) if q[2]]
        if len(on) < 7:
            return None
        iB = min(on, key=lambda i: (Q[i][1], Q[i][0]))
        iN = (iB - 9) % n
        if any(Q[(iN + k) % n][2] != ("curve" if k % 3 == 0 else None) for k in range(10)):
            return None
        return [(Q[(iN + k) % n][0] - Q[iN][0], Q[(iN + k) % n][1] - Q[iN][1]) for k in range(10)]
    s = sig(P)
    if s is None:
        return None
    for kind in ("j", "y"):
        oc = max(reg_font[kind].contours, key=lambda c: len(c.points))
        t = sig([(q.x, q.y, q.type, q.smooth) for q in oc.points])
        if t and all(abs(a[0] - b[0]) <= 1 and abs(a[1] - b[1]) <= 1 for a, b in zip(s, t)):   # within a unit: jdotless,
            return kind                                                                    # eng, f_j's neck is 22, j's 23
    return None


def master_ball(R, M, ratio):
    """Rule 1 above on one contour: R the Regular's points, M the master's [(x, y, type, smooth)]; returns M with the
    ball (neck to left side, seven points) the Regular's scaled by ratio about its centre, centred as the master's."""
    n = len(R)
    on = [i for i, q in enumerate(R) if q[2]]
    iB = min(on, key=lambda i: (R[i][1], R[i][0]))
    iC, iT, iN = (iB - 3) % n, (iB - 6) % n, (iB - 9) % n
    cR = (R[iT][0], R[iC][1])
    cM = (M[iT][0], M[iC][1])
    exact = {}
    for k in range(7):
        i = (iN + k) % n
        exact[i] = (cM[0] + ratio * (R[i][0] - cR[0]), cM[1] + ratio * (R[i][1] - cR[1]))
    # whole units: each handle rounded up or down along its own line (level or upright at the top and the side), the
    # choice whose neck curve keeps the Regular's curvature profile nearest and whose quarter from the top to the side
    # is roundest (its curvature's largest over its least; rounding alone made y's ball quarter fall and rise 11 to
    # 12% at the Bold and the Light, past curvecheck's flat place, where the Regular's is 8%)
    import itertools
    hs = [(iN + k) % n for k in (1, 2, 4, 5)]
    base = {i: (round(x), round(y)) for i, (x, y) in exact.items()}

    def prof(Q, a):
        s = ("C", tuple(Q[(a + k) % n][:2] for k in range(4)), 0, 0)
        ks = [abs(K.curvature(s, t / 16)) for t in range(17)]
        m = max(ks) or 1e-9
        return [k_ / m for k_ in ks]
    ref = [prof(R, iN), prof(R, iT)]
    best = None
    for pick in itertools.product((math.floor, math.ceil), repeat=8):
        cand = dict(base)
        for k, i in enumerate(hs):
            own = (iT if i in ((iT - 1) % n, (iT + 1) % n) else iC if i == (iC - 1) % n else iN)
            xy = []
            for ax in (0, 1):
                if R[i][ax] == R[own][ax] and own != iN:      # level or upright with its node: stays so
                    xy.append(cand[own][ax])
                elif abs(exact[i][ax] - round(exact[i][ax])) > 1e-9:
                    xy.append(pick[2 * k + ax](exact[i][ax]))
                else:
                    xy.append(round(exact[i][ax]))
            cand[i] = tuple(xy)
        Q = [cand.get(i, M[i][:2]) + tuple(M[i][2:]) for i in range(n)]
        err = sum((a - b) ** 2 for a, b in zip(ref[0], prof(Q, iN))) + (max(prof(Q, iT)) / max(min(prof(Q, iT)), 1e-9))
        err += sum(math.dist(cand[i], exact[i]) for i in hs) * 1e-6
        if best is None or err < best[0]:
            best = (err, Q)
    return best[1]


# ------------------------------------------------------------------------------------------- the a's exit
# Round 3: the two-storey a's curled exit (and a.ss03's, which is the same part) ran radius 108, 155, then 57 from
# its lowest point to its cut end: a flat place. By the tail rule its two handles are solved (directions kept: level
# at the lowest point, along the cut end's own tangent there) so the curvature only rises from the lowest point to the
# end and is equal across the lowest point. The lowest point, the cut end and a's width do not move.
def a_exit(font, name="a"):
    g = font[name]
    oc = max(g.contours, key=lambda c: len(c.points))
    P = oc.points
    n = len(P)
    on = [i for i, p in enumerate(P) if p.type]
    xr = max(p.x for p in P if p.type == "line" and p.y > 200)          # the stem's right edge
    # the exit: the curve from the stem's lowest point (level, right of the stem's left edge) to the cut's outer corner
    iB = min((i for i in on if P[i].x > xr - 100 and P[i].y < 20), key=lambda i: P[i].y)
    iE = (iB + 3) % n
    assert P[(iB + 1) % n].type is None and P[(iB + 2) % n].type is None and P[iE].type == "curve", f"{name}: no exit"
    B, E = (P[iB].x, P[iB].y), (P[iE].x, P[iE].y)
    h2 = (P[(iB + 2) % n].x - E[0], P[(iB + 2) % n].y - E[1])
    L2 = math.hypot(*h2)
    u2 = (h2[0] / L2, h2[1] / L2)
    prev = (P[(iB - 3) % n], P[(iB - 2) % n], P[(iB - 1) % n], P[iB])
    k_prev = _k(tuple((q.x, q.y) for q in prev), 1.0)
    span = E[0] - B[0]

    def curve(a, b):
        return (B, (B[0] + a * span, B[1]), (E[0] + u2[0] * b * L2, E[1] + u2[1] * b * L2), E)

    def f(z):
        a, b = z
        if not (0.2 <= a <= 0.9 and 0.3 <= b <= 1.8):
            return 1e9
        c = curve(a, b)
        ks = [abs(_k(c, i / 24)) for i in range(25)]
        fall = sum(max(0.0, (p - q) / p) for p, q in zip(ks, ks[1:]))
        return (3 * fall) ** 2 + (3 * _lr(ks[0], k_prev)) ** 2 + (b - 1) ** 2 * 0.05
    best = min((f((a / 40, b / 20)), a / 40, b / 20) for a in range(8, 37) for b in range(6, 37))
    z, _v = _simplex(f, [best[1], best[2]], [0.03, 0.05], 400)
    c = curve(*z)
    for k, q in ((1, c[1]), (2, c[2])):
        P[(iB + k) % n].x, P[(iB + k) % n].y = int(round(q[0])), int(round(q[1]))
    ks = [abs(_k(c, i / 8)) for i in range(9)]
    return f"{name}: exit radius {', '.join(str(round(1 / k)) for k in ks[::2])} (lowest point to cut end)"


# ------------------------------------------------------------------------------------------- curvature at a node
# 0.81 (owner, 15 November): in the masters the descender's curves met at up to 1.87 times their curvature (the Bold
# g's loop at its left side, the Bold j where its tail meets its ball, a.ss03 1.76, l.ss04 1.91), where the Regular,
# whose handles were solved for it, keeps under curvecheck.RATIO. The rule the Regular's loops and tails were built
# by (two curves at a smooth node meet at one curvature), applied in every master to the parts curvecheck reads: at
# each smooth node whose two curves meet at more than RATIO, the node's two handles change length, along their own
# line (nodes and tangents stay), so the two end curvatures meet at their geometric mean. A curve's end curvature is
# 2/3 of its far handle's distance from the tangent over the near handle's length squared, so each length is solved
# directly; a few rounds settle the far ends. A length moves within 0.5 to 2.5 of its own and stays inside its
# curve's triangle; a change is kept only where the node's ratio falls and the part gains no other fault (a flat, an
# inflection, a turn of the handles).

def even_nodes(P, yr, rounds=8, target=None):
    """P: [(x, y, type, smooth)]; yr: curvecheck's region. Returns (new P, [(node, ratio before, after)])."""
    target = target or K.RATIO
    P = [tuple(q) for q in P]
    P_in = list(P)
    n = len(P)
    first = {}
    log = {}

    def near(i, side):
        return (i + side) % n

    for _ in range(rounds):
        changed = False
        for i, xy, g1, ka, kb, ratio, flip, kinds in K.nodes(P, yr):
            if kinds != "CC" or ratio is None or flip or ratio <= target - 0.05:
                continue
            first.setdefault(i, ratio)
            want = math.sqrt(abs(ka) * abs(kb))
            new = list(P)
            for side in (-1, 1):
                h = near(i, side)                      # the node's handle on this side
                far = near(i, 2 * side)                # the curve's other handle
                if P[h][2] is not None or P[far][2] is not None:
                    break
                L = math.dist(P[h][:2], P[i][:2])
                if L < 1:
                    break
                u = ((P[h][0] - P[i][0]) / L, (P[h][1] - P[i][1]) / L)
                # the far handle's distance from the tangent line through the node
                dist = abs((P[far][0] - P[i][0]) * u[1] - (P[far][1] - P[i][1]) * u[0])
                L2 = math.sqrt(2 / 3 * dist / want) if want > 1e-9 else L
                L2 = min(max(L2, 0.5 * L), 2.5 * L)
                # inside the triangle: never past where the node's tangent meets the far end's (construction rule)
                end = near(i, 3 * side)
                w_ = (P[far][0] - P[end][0], P[far][1] - P[end][1])
                den = u[0] * w_[1] - u[1] * w_[0]
                if abs(den) > 1e-9:
                    tmax = ((P[end][0] - P[i][0]) * w_[1] - (P[end][1] - P[i][1]) * w_[0]) / den
                    if tmax > 0:
                        L2 = min(L2, 0.95 * tmax)
                new[h] = (P[i][0] + u[0] * L2, P[i][1] + u[1] * L2) + tuple(P[h][2:])
            else:
                # kept only where the part's own faults (curvecheck) do not grow: a ball's neck turns the other way
                # by design and is left as it is
                def others(Q):                         # the part's faults other than a curvature ratio at a node
                    return {b_ for b_ in K.report("", [Q], yr)[0] if "x across it" not in b_}

                r0_ = {j: r for j, *_x, r, f_, k_ in K.nodes(P, yr) if k_ == "CC" and r is not None}

                def ok(Q):
                    r_ = {j: r for j, *_x, r, f_, k_ in K.nodes(Q, yr) if k_ == "CC" and r is not None}
                    worse = any(r_[j] > max(r0_.get(j, 0), target) + 1e-6 for j in r_ if j != i)
                    return (not worse and others(Q) <= others(P) and r_.get(i, 9e9) < ratio
                            and len(K.report("", [Q], yr)[0]) <= len(K.report("", [P], yr)[0])), r_.get(i, 9e9)
                good, _r = ok(new)
                if not good:
                    # the curves' far handles too, along their own lines (a short curve whose tight bend sat at the
                    # node keeps it inside when only the near handle grows: the Bold l.ss04's inner curve, radius 6)
                    best = None
                    fars = [near(i, -2), near(i, 2)]
                    for sa in (0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.35, 1.5):
                        for sb in (0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.35, 1.5):
                            Q = list(new)
                            for f_i, sc in zip(fars, (sa, sb)):
                                o_ = near(i, -3 if f_i == near(i, -2) else 3)     # the far handle's own node
                                Q[f_i] = (P[o_][0] + (P[f_i][0] - P[o_][0]) * sc, P[o_][1] + (P[f_i][1] - P[o_][1]) * sc) + tuple(P[f_i][2:])
                            g_, r_ = ok(Q)
                            if g_ and (best is None or (r_, abs(sa - 1) + abs(sb - 1)) < best[0]):
                                best = ((r_, abs(sa - 1) + abs(sb - 1)), Q)
                    if best is not None:
                        new, good = best[1], True
                if good:
                    P = new
                    changed = True
        if not changed:
            break
    # a smooth node whose handles stand off one line (curvecheck's G1): a curve's handle turned onto the straight it
    # leaves, two curves' handles onto their mean direction, lengths kept (the Light g's link, 6.3 degrees)
    for i, xy, g1, ka, kb, ratio, flip, kinds in K.nodes(P, yr):
        if g1 <= K.G1:
            continue
        a_, b_ = near(i, -1), near(i, 1)
        La, Lb = math.dist(P[a_][:2], P[i][:2]), math.dist(P[b_][:2], P[i][:2])
        if La < 1 or Lb < 1:
            continue
        ua = ((P[i][0] - P[a_][0]) / La, (P[i][1] - P[a_][1]) / La)       # along the outline at the node
        ub = ((P[b_][0] - P[i][0]) / Lb, (P[b_][1] - P[i][1]) / Lb)
        if kinds == "LC":
            d = ua
        elif kinds == "CL":
            d = ub
        else:
            d = (ua[0] + ub[0], ua[1] + ub[1])
        dl = math.hypot(*d)
        d = (d[0] / dl, d[1] / dl)
        Q = list(P)
        if kinds != "LC":
            Q[a_] = (P[i][0] - d[0] * La, P[i][1] - d[1] * La) + tuple(P[a_][2:])
        if kinds != "CL":
            Q[b_] = (P[i][0] + d[0] * Lb, P[i][1] + d[1] * Lb) + tuple(P[b_][2:])
        if {x for x in K.report("", [Q], yr)[0] if "degrees off" not in x} <= set(K.report("", [P], yr)[0]):
            P = Q
    # a curve that leaves a straight at more than curvecheck's EASE of its tightest: its handle at the join grows along
    # the straight (its end curvature falls as the square of that length), the least that brings it under
    for i, _xy, e in K.eases(P, yr):
        if e <= K.EASE:
            continue
        for side in (-1, 1):
            h = near(i, side)
            if P[h][2] is not None:
                continue
            L = math.dist(P[h][:2], P[i][:2])
            if L < 1:
                continue
            u = ((P[h][0] - P[i][0]) / L, (P[h][1] - P[i][1]) / L)
            far, end = near(i, 2 * side), near(i, 3 * side)
            done_ = False
            for sc, sf in sorted(((a_, b_) for a_ in (1.05, 1.1, 1.15, 1.2, 1.3, 1.4, 1.5, 1.65, 1.8)
                                  for b_ in (1.0, 0.9, 1.1, 0.8, 1.2, 0.7, 1.3, 0.6, 1.45)),
                                 key=lambda z: abs(z[0] - 1) + abs(z[1] - 1)):
                if done_ or P[far][2] is not None:
                    break
                Q = list(P)
                Q[h] = (P[i][0] + u[0] * L * sc, P[i][1] + u[1] * L * sc) + tuple(P[h][2:])
                Q[far] = (P[end][0] + (P[far][0] - P[end][0]) * sf, P[end][1] + (P[far][1] - P[end][1]) * sf) + tuple(P[far][2:])
                e2 = {j: x for j, _q, x in K.eases(Q, yr)}.get(i, 9)
                kinds_ = lambda Z: {b_.split(":")[0] + (" ratio" if "x across" in b_ else b_.split(":")[1][:14])   # noqa: E731
                                    for b_ in K.report("", [Z], yr)[0]}
                r_q = {j: r for j, *_x, r, f_, k_ in K.nodes(Q, yr) if k_ == "CC" and r is not None}
                r_p = {j: r for j, *_x, r, f_, k_ in K.nodes(P, yr) if k_ == "CC" and r is not None}
                if e2 <= K.EASE and kinds_(Q) <= kinds_(P) and all(r_q[j] <= max(r_p.get(j, 0), target) + 1e-6 for j in r_q):
                    P = Q
                    done_ = True
    P = [(int(round(q[0])), int(round(q[1]))) + tuple(q[2:]) for q in P]
    if len(K.report("", [P], yr)[0]) > len(K.report("", [P_in], yr)[0]):
        return [tuple(q) for q in P_in], []                # whole units undid it: the master's own points
    after = {i: r for i, xy, g1, ka, kb, r, flip, kinds in K.nodes(P, yr) if kinds == "CC" and r is not None}
    return P, [(i, round(r0, 2), round(after.get(i, 0), 2)) for i, r0 in first.items()]


def even_part(contours, yr, rounds=6):
    """0.81 (owner round 2): a part whose nodes cannot meet at one curvature without thinning the stroke (the Bold g's
    loop 1.87, a.ss03 1.76, l.ss04 1.91 and 6.05: even_nodes alone thinned a place across the stroke by 2 to 11%) is
    solved with its other edge: each round evens the nodes, then the curves on both sides of every place now thinner
    than it was take back its thickness by their handle lengths (white.keep_taper with the part's own thickness as the
    law: nodes and tangents stay, no curve gains a turn). Returns (contours, faults after, thinned) of the best round."""
    import white as WHITE
    t0, e0, _w = WHITE.taper_readings(contours)
    cur = [list(P) for P in contours]
    best = None
    for r in range(rounds):
        cur = [even_nodes(P, yr)[0] for P in cur]
        cur, _log = WHITE.keep_taper(contours, cur, [(1e6, 1.0), (0, 1.0)], tol=0.5, nodes=False)
        t, e, _w = WHITE.taper_readings(cur)
        ok = ~np.isnan(t0) & ~np.isnan(t) & (e0 == e)
        thin = bool((t[ok] < t0[ok] * 0.985 - 0.5).any())
        nb = len(K.report("", cur, yr)[0])
        if best is None or (thin, nb) < (best[2], best[1]):
            best = ([list(P) for P in cur], nb, thin)
        if nb == 0 and not thin:
            break
    return best
