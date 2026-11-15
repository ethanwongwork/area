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
