"""Area Serif: the four control letters (H O n o) at a bold weight, by rule. A trial: writes nothing into the build.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/weight.py [stems...]

The Bold is the Regular's own points. Every on-curve point has a role (stem edge, serif tip, bowl extreme, bar
edge, crotch); a role has a Bold position that follows from ONE number, the lowercase stem (`vector`). Handles are
never placed: each curve between two nodes is carried into the box its two nodes now span, so its tension and the
direction it leaves each node are the Regular's (the condition for an instance between the masters to have no kink).

Writes build/weight/: a two-master variable font per stem, static Bolds, instances every 25 units, measures, proofs.
"""
import json
import logging
import math
import os
import sys

import ufoLib2
from fontTools.designspaceLib import AxisDescriptor, DesignSpaceDocument, SourceDescriptor
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", ".."))
SERIF = os.path.join(ROOT, "typefaces", "area-serif")
SUITE = os.path.join(ROOT, "docs", "research", "serif-evaluation-2026-11-13", "tools")
OUT = os.path.join(SERIF, "build", "weight")
sys.path[:0] = [SERIF, SUITE]

REG = dict(stem=78, cap_stem=86, round=82, cap_round=92, hair=43, cap_hair=47, bar=49, arch=50, tip=30, neck=None)
STEM_REF = 140                    # the stem the plan's ratios were read at (1.80 of 78: Georgia Pro 1.76, Serrif 1.84)
# What each part gains when the lowercase stem gains 62 (78 to 140). Each is the mean of Georgia Pro's and Serrif's
# Bold / Regular ratio applied to Area's Regular value (bold-master-plan.md, Targets).
GAIN = dict(stem=62, cap_stem=62, round=64, cap_round=64, hair=10, cap_hair=12, bar=16, arch=16, tip=11)
NECK_RATIO = 1.22                 # a branch's neck grows as the hairline does
FOOT = 0.95                       # a serif's reach from its stem (Georgia Pro 1.05, Serrif 0.85)
# Of the ink a letter gains, the share its counter gives up (the rest makes the letter wider). Measured as counter
# lost / (2 x stroke gained): n Georgia Pro 0.22, Serrif 0.47; H 0.21, 0.47; o 0.38, 0.65; O 0.45, 0.64.
INWARD = dict(straight=0.34, round=0.53)
BEARING = 0.80                    # side bearings at the reference stem (n: Georgia Pro 0.71, Serrif 0.90)
BRACKET = dict(foot=66, cap_foot=58, cap_head=61)   # a bracket's climb up its stem, held


DOT = 1.51                        # a dot's width (i: Georgia Pro 1.53, Serrif 1.49); its centre holds (-12, +7)


def vector(stem, **over):
    """Every Bold value from the lowercase stem. `over` replaces single values (tip=34) for a comparison."""
    f = (stem - REG["stem"]) / (STEM_REF - REG["stem"])
    v = {k: round(REG[k] + GAIN[k] * f) for k in GAIN}
    v.update(over)
    v["f"] = f
    v["bearing"] = 1 - (1 - BEARING) * f
    v["foot"] = 1 - (1 - FOOT) * f
    return v


def band(centre, w):
    lo = round(centre - w / 2)
    return lo, lo + round(w)


# ---------------------------------------------------------------- roles: where each on-curve coordinate goes

def roles_H(g, v):
    S, p, t = v["cap_stem"], round(77 * v["foot"]), v["tip"]
    c = 408 - round(INWARD["straight"] * 2 * (S - 86))
    a = round(54 * v["bearing"])
    L, L2 = a + p, a + p + S + c
    R, R2 = L + S, L2 + S
    lo, hi = band(365.5, v["bar"])
    X = {54: a, 61: a + 7, 131: L, 217: R, 287: R + p - 7, 294: R + p, 548: L2 - p, 555: L2 - p + 7, 625: L2,
         711: R2, 781: R2 + p - 7, 788: R2 + p}
    Y = {0: 0, 7: 7, 23: t - 7, 30: t, 88: t + BRACKET["cap_foot"], 341: lo, 390: hi,
         621: 712 - t - BRACKET["cap_head"], 682: 712 - t, 689: 712 - t + 7, 705: 705, 712: 712}
    return X, Y, R2 + p + round(56 * v["bearing"])


def roles_n(g, v):
    S, p, t = v["stem"], round(70 * v["foot"]), v["tip"]
    c = 283 - round(INWARD["straight"] * 2 * (S - 78))
    a = round(41 * v["bearing"])
    L = a + p
    R = L + S
    L2 = R + c
    R2 = L2 + S
    flag = 509            # a head flag's tip keeps its top and thickens downward (Georgia Pro 516 > 514 and
    under = flag - t      # 481 > 474; Serrif 491 > 490 and 464 > 446, at an x-height of 520)
    X = {41: a, 47: a + 6, 48: a + 7, 107: L - 4, 111: L, 189: R, 252: R + p - 7, 259: R + p, 402: L2 - p,
         409: L2 - p + 7, 472: L2, 550: R2, 613: R2 + p - 7, 620: R2 + p,
         341: R + round((341 - 189) / 283 * c), 383: R + round((383 - 189) / 361 * (R2 - R))}
    Y = {0: 0, 7: 7, 23: t - 7, 30: t, 96: t + BRACKET["foot"], 480: 530 - v["arch"], 530: 530, 529: 529,
         509: flag, 500: flag - 9, 486: under + 7, 479: under, 462: under - 17, 409: under - 70,
         328: 328, 348: 348, 352: 352, 429: 429}
    return X, Y, R2 + p + round(34 * v["bearing"])


def _roles_round(v, key, hair, left, right, inner_l, inner_r, cx, top, bottom, in_top, in_bottom, mids, rsb):
    r = v[key]
    inner = (inner_r - inner_l) - round(INWARD["round"] * 2 * (r - REG[key]))
    a = round(left * v["bearing"])
    W = 2 * r + inner
    X = {left: a, right: a + W, inner_l: a + r, inner_r: a + r + inner, cx: a + round((cx - left) / (right - left) * W)}
    Y = {top: top, bottom: bottom, in_top: top - v[hair], in_bottom: bottom + v[hair]}
    Y.update({m: m for m in mids})
    return X, Y, a + W + round(rsb * v["bearing"])


def roles_o(g, v):
    return _roles_round(v, "round", "hair", 45, 549, 127, 467, 295, 530, -10, 487, 33, (263, 264), 46)


def roles_O(g, v):
    return _roles_round(v, "cap_round", "cap_hair", 45, 725, 137, 633, 385, 721, -9, 674, 38, (348, 351), 45)


def roles_i(g, v):
    S, p, t = v["stem"], round(70 * v["foot"]), v["tip"]
    a = round(35 * v["bearing"])
    L = a + p
    R = L + S
    under = 510 - t
    d = 2 * round(116 * (1 + (DOT - 1) * v["f"]) / 2)
    cx = round((L + R) / 2) - 6
    X = {35: a, 40: a + 5, 42: a + 7, 105: L, 183: R, 246: R + p - 7, 253: R + p,
         80: cx - d // 2, 138: cx, 196: cx + d // 2}
    Y = {0: 0, 7: 7, 23: t - 7, 30: t, 96: t + BRACKET["foot"], 530: 530, 510: 510, 502: 502, 487: under + 7,
         480: under, 410: under - 70, 690: 690, 632: 690 - d // 2, 748: 690 + d // 2}
    return X, Y, R + p + round(34 * v["bearing"])


ROLES = {"H": roles_H, "O": roles_O, "n": roles_n, "o": roles_o, "i": roles_i}


# ---------------------------------------------------------------- the move

def _segments(P):
    """[(i0, [handles], i3)] for every curve of a closed contour."""
    on = [i for i, p in enumerate(P) if p.type is not None]
    out = []
    for k, i in enumerate(on):
        j = on[(k + 1) % len(on)]
        mid, q = [], (i + 1) % len(P)
        while q != j:
            mid.append(q)
            q = (q + 1) % len(P)
        if mid:
            out.append((i, mid, j))
    return out


def moved(g, X, Y):
    """The glyph's contours as [[(x, y, type, smooth)]] with every node at its role's place and every curve carried
    into its nodes' new box."""
    out = []
    for c in g.contours:
        P = c.points
        new = [None] * len(P)
        for i, p in enumerate(P):
            if p.type is not None:
                if p.x not in X or p.y not in Y:
                    raise KeyError(f"{g.name}: node {p.x},{p.y} has no role")
                new[i] = (X[p.x], Y[p.y])
        for i, mid, j in _segments(P):
            a, b = P[i], P[j]

            def carry(val, a0, b0, a1, b1, near):
                if abs(b0 - a0) < 1e-6:
                    return near[1] + (val - near[0])
                return a1 + (val - a0) * (b1 - a1) / (b0 - a0)
            for k, q in enumerate(mid):
                end = (a, new[i]) if k == 0 else (b, new[j])
                x = carry(P[q].x, a.x, b.x, new[i][0], new[j][0], (end[0].x, end[1][0]))
                y = carry(P[q].y, a.y, b.y, new[i][1], new[j][1], (end[0].y, end[1][1]))
                new[q] = (round(x), round(y))
        out.append([(x, y, p.type, p.smooth) for (x, y), p in zip(new, P)])
    return out


def crotch(g, pts, v):
    """n's branch: the crotch climbs the stem until the neck (crotch to the counter's curve) is its target."""
    import parts as PARTS
    P0 = g.contours[0].points
    i = next(k for k, p in enumerate(P0) if (p.x, p.y) == (189, 429))
    s = next(k for k, p in enumerate(P0) if (p.x, p.y) == (189, 328))
    was = PARTS.neck((189, 429), [(P0[(s + k) % len(P0)].x, P0[(s + k) % len(P0)].y) for k in range(4)])
    target = was * (1 + (NECK_RATIO - 1) * v["f"])
    c = pts[0]
    curve = [c[(s + k) % len(c)][:2] for k in range(4)]
    x = c[i][0]
    y = PARTS.solve(curve, target, x, curve[0][1] + 20, 520)
    # the outer curve's last handle keeps its place relative to the crotch (the Regular's leave vector)
    dy = y - c[i][1]
    c[i] = (x, y) + c[i][2:]
    h = (i - 1) % len(c)
    c[h] = (c[h][0], round(c[h][1] + dy), None, False)
    return was, target, PARTS.neck((x, y), curve)


OVER = {}                         # single values replaced for a comparison build (weight.OVER["tip"] = 34)


def hand_glyph(reg, name, stem):
    """The first trial's way: every node's place written out by hand for H O n o i. Kept as the second method that
    bold.py (which finds the strokes itself) is checked against."""
    v = vector(stem, **OVER)
    X, Y, width = ROLES[name](reg[name], v)
    pts = moved(reg[name], X, Y)
    info = {}
    if name == "n":
        info["neck"] = crotch(reg[name], pts, v)
    return pts, width, info


def bold_glyph(reg, name, stem):
    import bold as BOLD
    v = BOLD.vector(stem, **OVER)
    pts, width, rep = BOLD.bold(BOLD.glyph_contours(reg[name]), reg[name].width, v, name)
    return pts, width, {"report": rep}


# ---------------------------------------------------------------- checks on the two masters as points

def _dir(a, b):
    d = (b[0] - a[0], b[1] - a[1])
    n = math.hypot(*d)
    return (d[0] / n, d[1] / n) if n else None


def compat(reg_g, pts):
    """Same contours, same point types; at every smooth node the same tangent direction in both masters and both
    sides on one line; every curve's control polygon runs one way on each axis in both."""
    errs, worst = [], 0.0
    for c, n in zip(reg_g.contours, pts):
        P = [(p.x, p.y) for p in c.points]
        if [p.type for p in c.points] != [q[2] for q in n]:
            errs.append("point types differ")
            continue
        N = [q[:2] for q in n]
        m = len(P)
        for i, p in enumerate(c.points):
            if p.type is None or not p.smooth:
                continue
            if min(math.dist(P[i - 1], P[i]), math.dist(P[i], P[(i + 1) % m])) < 5:
                continue                          # a softened corner (a 3-unit handle), not a smooth join
            bend = []
            for A in (P, N):
                din, dout = _dir(A[i - 1], A[i]), _dir(A[i], A[(i + 1) % m])
                bend.append(math.degrees(math.asin(min(1, abs(din[0] * dout[1] - din[1] * dout[0])))) if din and dout else 0)
            short = min(math.dist(N[i - 1], N[i]), math.dist(N[i], N[(i + 1) % m]))
            if bend[1] > bend[0] + 1.0 and math.sin(math.radians(bend[1])) * short > 0.8:
                # the Bold may not bend more at a smooth node than the Regular does, beyond what whole units force
                # (a handle 15 long that is one unit off its line is 3.8 degrees)
                errs.append(f"bold node {N[i]} bends {bend[1]:.1f} deg (regular {bend[0]:.1f})")
            dr, db = _dir(P[i], P[(i + 1) % m]), _dir(N[i], N[(i + 1) % m])
            if not dr or not db:
                errs.append(f"bold node {N[i]}: a handle sits on its node")
                continue
            turn = abs(dr[0] * db[1] - dr[1] * db[0])
            # the kink term: |a_R b_B - a_B b_R| sin(theta), in units, at the middle of the axis
            aR, bR = math.dist(P[i - 1], P[i]), math.dist(P[i], P[(i + 1) % m])
            aB, bB = math.dist(N[i - 1], N[i]), math.dist(N[i], N[(i + 1) % m])
            kink = abs(aR * bB - aB * bR) * turn / max(1e-9, (aR + aB) / 2 + (bR + bB) / 2)
            worst = max(worst, kink)
        for i, mid, j in _segments(c.points):
            for ax in (0, 1):
                back = []
                for A in (P, N):
                    q = [A[i]] + [A[k] for k in mid] + [A[j]]
                    d = [q[k + 1][ax] - q[k][ax] for k in range(len(q) - 1)]
                    back.append(any(x > 0 for x in d) and any(x < 0 for x in d))
                if back[1] and not back[0]:               # the Bold may not turn back where the Regular does not
                    errs.append(f"bold curve from {N[i]} turns back on {'xy'[ax]}")
    return errs, worst


def midpoint_bend(reg_g, pts, t=0.5):
    """The largest bend (degrees) at a smooth node of the instance half way, on the cubic points themselves."""
    worst = 0.0
    for c, n in zip(reg_g.contours, pts):
        M = [((1 - t) * p.x + t * q[0], (1 - t) * p.y + t * q[1]) for p, q in zip(c.points, n)]
        m = len(M)
        for i, p in enumerate(c.points):
            if p.type is None or not p.smooth or min(math.dist(M[i - 1], M[i]), math.dist(M[i], M[(i + 1) % m])) < 5:
                continue
            din, dout = _dir(M[i - 1], M[i]), _dir(M[i], M[(i + 1) % m])
            if din and dout:
                sn = min(1, abs(din[0] * dout[1] - din[1] * dout[0]))
                if sn * min(math.dist(M[i - 1], M[i]), math.dist(M[i], M[(i + 1) % m])) > 0.8:   # more than whole units force
                    worst = max(worst, math.degrees(math.asin(sn)))
    return worst


# ---------------------------------------------------------------- fonts

GLYPHS = ["H", "O", "n", "o", "i"]


def master(reg, stem, style, glyphs=None):
    GLYPHS = glyphs or globals()["GLYPHS"]
    from ufoLib2.objects import Point
    f = ufoLib2.Font()
    for k in ("unitsPerEm", "ascender", "descender", "xHeight", "capHeight", "openTypeOS2TypoAscender",
              "openTypeOS2TypoDescender", "openTypeOS2TypoLineGap", "openTypeHheaAscender", "openTypeHheaDescender",
              "openTypeHheaLineGap", "openTypeOS2WinAscent", "openTypeOS2WinDescent"):
        setattr(f.info, k, getattr(reg.info, k))
    f.info.familyName, f.info.styleName = "Area Serif Trial", style
    f.info.openTypeOS2WeightClass = 400 if stem == REG["stem"] else 700
    infos = {}
    for name in [".notdef", "space"] + GLYPHS:
        g = f.newGlyph(name)
        src = reg[name]
        g.width = src.width
        g.unicodes = list(src.unicodes)
        if name not in GLYPHS or stem == REG["stem"]:
            for c in src.contours:
                nc = ufoLib2.objects.Contour()
                nc.points = [Point(p.x, p.y, p.type, smooth=p.smooth) for p in c.points]
                g.contours.append(nc)
            continue
        pts, width, info = bold_glyph(reg, name, stem)
        infos[name] = info
        g.width = width
        for c in pts:
            nc = ufoLib2.objects.Contour()
            nc.points = [Point(x, y, t, smooth=s) for x, y, t, s in c]
            g.contours.append(nc)
    f.lib["public.glyphOrder"] = [".notdef", "space"] + GLYPHS
    return f, infos


class _Catch(logging.Handler):
    def __init__(self):
        super().__init__(logging.WARNING)
        self.lines = []

    def emit(self, r):
        self.lines.append(r.getMessage())


def geometric(stem, steps=(400, 450, 500, 550, 600, 650, 700)):
    q = stem / REG["stem"]
    return [(w, REG["stem"] * q ** ((w - 400) / 300)) for w in steps]


def variable(reg_ufo, bold_ufo, stem, path):
    import ufo2ft
    ds = DesignSpaceDocument()
    ax = AxisDescriptor()
    ax.name, ax.tag, ax.minimum, ax.default, ax.maximum = "Weight", "wght", 400, 400, 700
    ax.map = [(w, s) for w, s in geometric(stem)]
    ds.addAxis(ax)
    for ufo, loc, style in ((reg_ufo, REG["stem"], "Regular"), (bold_ufo, stem, "Bold")):
        s = SourceDescriptor()
        s.font, s.location, s.familyName, s.styleName = ufo, {"Weight": loc}, "Area Serif Trial", style
        ds.addSource(s)
    catch = _Catch()
    logging.getLogger().addHandler(catch)
    try:
        vf = ufo2ft.compileVariableTTF(ds)
    finally:
        logging.getLogger().removeHandler(catch)
    bad = [l for l in catch.lines if "incompatible" in l.lower() or "skipping" in l.lower()]
    if bad:
        raise SystemExit("variable build: " + "; ".join(bad))
    vf.save(path)
    return catch.lines


# ---------------------------------------------------------------- measures (scan lines, as the suite reads them)

def measure(font):
    import evlib as E
    n, o, H, O = (E.Shape(font, ch) for ch in "noHO")
    hn = n.h(200)
    ho = o.h(264)
    hH = H.h(200)
    hO = O.h(350)
    ox = (ho[0][1] + ho[1][0]) / 2
    Ox = (hO[0][1] + hO[1][0]) / 2
    vo, vO = o.v(ox), O.v(Ox)
    under = max(sp[0] for x in range(int(hn[0][1]) + 2, int(hn[1][0]) - 1, 2) for sp in n.v(x) if sp[1] > 480)
    va = (under, n.y1)                                     # the arch at its top: the letter's top less the counter's
    foot = n.h(2)
    tip = n.v(foot[0][0] + 8)[0]
    Hfoot = H.h(2)
    Hbar = [s for s in H.v((hH[0][1] + hH[1][0]) / 2)]
    return {"n stem": hn[0][1] - hn[0][0], "n stem 2": hn[1][1] - hn[1][0], "n counter": hn[1][0] - hn[0][1],
            "n ink": n.x1 - n.x0, "n advance": n.adv, "n arch": va[1] - va[0],
            "n foot": hn[0][0] - foot[0][0], "n tip": tip[1] - tip[0],
            "o round": ho[0][1] - ho[0][0], "o round R": ho[1][1] - ho[1][0], "o counter": ho[1][0] - ho[0][1],
            "o hair top": vo[-1][1] - vo[-1][0], "o hair bottom": vo[0][1] - vo[0][0], "o ink": o.x1 - o.x0,
            "o advance": o.adv, "o top": o.y1, "o bottom": o.y0,
            "H stem": hH[0][1] - hH[0][0], "H counter": hH[1][0] - hH[0][1], "H bar": Hbar[0][1] - Hbar[0][0],
            "H ink": H.x1 - H.x0, "H advance": H.adv, "H foot": hH[0][0] - Hfoot[0][0], "H top": H.y1,
            "O round": hO[0][1] - hO[0][0], "O counter": hO[1][0] - hO[0][1], "O hair top": vO[-1][1] - vO[-1][0],
            "O ink": O.x1 - O.x0, "O advance": O.adv,
            "contrast o": (ho[0][1] - ho[0][0]) / (vo[-1][1] - vo[-1][0]),
            "stem / counter n": (hn[0][1] - hn[0][0]) / (hn[1][0] - hn[0][1])}


def diag(font, ch, cx, cy, ang=45):
    """Stroke thickness along a ray from (cx, cy) at `ang` degrees: a bowl or shoulder at its stress point."""
    import evlib as E
    s = E.Shape(font, ch)
    ux, uy = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    hits = []
    for c in s.polys:
        m = len(c)
        for i in range(m):
            (x1, y1), (x2, y2) = c[i], c[(i + 1) % m]
            den = ux * (y2 - y1) - uy * (x2 - x1)
            if abs(den) < 1e-12:
                continue
            t = ((x1 - cx) * (y2 - y1) - (y1 - cy) * (x2 - x1)) / den
            u = ((x1 - cx) * uy - (y1 - cy) * ux) / den
            if t > 0 and 0 <= u < 1:
                hits.append(t)
    hits.sort()
    return hits[1] - hits[0] if len(hits) >= 2 else None


def run(stems):
    os.makedirs(OUT, exist_ok=True)
    import ufo2ft
    reg = ufoLib2.Font.open(os.path.join(SERIF, "build", "AreaSerif-Regular.ufo"))
    report = {}
    reg_m, _ = master(reg, REG["stem"], "Regular")
    ufo2ft.compileTTF(reg_m).save(os.path.join(OUT, "trial-regular.ttf"))
    report["regular"] = measure(TTFont(os.path.join(OUT, "trial-regular.ttf")))
    fail = []
    for stem in stems:
        v = vector(stem)
        bold, infos = master(reg, stem, "Bold")
        import parts as PARTS
        rep = {"vector": v, "points": {}, "neck": [(1, 1, j[2]) for j in PARTS.joins_of(bold["n"])][0]}
        tag = "".join(f"-{k}{x}" for k, x in OVER.items())
        for name in GLYPHS:
            pts = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in bold[name].contours]
            errs, kink = compat(reg[name], pts)
            rep["points"][name] = {"errors": errs, "kink term": round(kink, 3),
                                   "bend half way, deg": round(midpoint_bend(reg[name], pts), 3)}
            fail += [f"{stem} {name}: {e}" for e in errs]
        ufo2ft.compileTTF(bold).save(os.path.join(OUT, f"trial-bold-{stem}{tag}.ttf"))
        vf_path = os.path.join(OUT, f"trial-{stem}[wght].ttf")
        rep["build warnings"] = variable(master(reg, REG["stem"], "Regular")[0], bold, stem, vf_path)
        rep["bold"] = measure(TTFont(os.path.join(OUT, f"trial-bold-{stem}{tag}.ttf")))
        sweep = {}
        for w in range(400, 701, 25):
            inst = instantiateVariableFont(TTFont(vf_path), {"wght": w})
            if w in (500, 600):
                inst.save(os.path.join(OUT, f"trial-{stem}-{w}.ttf"))
            m = measure(inst)
            m["n shoulder 45"] = None
            sweep[w] = m
        rep["sweep"] = sweep
        # the ladder along the axis
        want = {w: REG["stem"] * (stem / REG["stem"]) ** ((w - 400) / 300) for w in sweep}
        for w, m in sweep.items():
            if abs(m["n stem"] - want[w]) > 1.0:
                fail.append(f"{stem} wght {w}: n stem {m['n stem']:.1f}, geometric {want[w]:.1f}")
        ws = sorted(sweep)
        for key in ("n stem", "o round", "H stem", "O round", "o hair top", "O hair top", "H bar", "n arch", "n tip",
                    "contrast o", "stem / counter n", "n advance"):
            seq = [sweep[w][key] for w in ws]
            if any(b < a - 0.26 for a, b in zip(seq, seq[1:])):
                fail.append(f"{stem}: {key} not monotone {['%.1f' % x for x in seq]}")
        for key in ("n counter", "o counter", "H counter", "O counter"):
            seq = [sweep[w][key] for w in ws]
            if any(b > a + 0.26 for a, b in zip(seq, seq[1:])):
                fail.append(f"{stem}: {key} not monotone")
        mid = sweep[550]
        for key in ("n stem", "o round", "H stem", "o hair top", "n arch"):
            mean = (sweep[400][key] + sweep[700][key]) / 2
            if mid[key] > mean * 1.03:
                fail.append(f"{stem}: {key} overweight half way ({mid[key]:.1f} > mean {mean:.1f})")
        for key in ("o top", "o bottom", "H top"):
            if any(abs(sweep[w][key] - sweep[400][key]) > 0.01 for w in ws):
                fail.append(f"{stem}: {key} moves")
        report[stem] = rep
    json.dump(report, open(os.path.join(OUT, "trial.json"), "w"), indent=1, default=str)
    return report, fail


if __name__ == "__main__":
    for a in [a for a in sys.argv[1:] if "=" in a]:
        OVER[a.split("=")[0]] = int(a.split("=")[1])
    stems = [int(a) for a in sys.argv[1:] if "=" not in a] or [128, 136, 140]
    report, fail = run(stems)
    keys = ["n stem", "n counter", "n ink", "n advance", "n arch", "n foot", "n tip", "stem / counter n", "o round",
            "o counter", "o hair top", "o hair bottom", "o ink", "o advance", "contrast o", "H stem", "H counter",
            "H bar", "H foot", "H ink", "H advance", "O round", "O counter", "O hair top", "O ink", "O advance"]
    print(f"{'':18}{'Regular':>9}" + "".join(f"{s:>9}" for s in stems))
    for k in keys:
        print(f"{k:18}{report['regular'][k]:9.2f}" + "".join(f"{report[s]['bold'][k]:9.2f}" for s in stems))
    for s in stems:
        print(s, "vector", {k: (round(x, 3) if isinstance(x, float) else x) for k, x in report[s]["vector"].items()})
        print("  neck (was, target, got)", [round(x, 1) for x in report[s]["neck"]])
        print("  points", report[s]["points"])
        print("  build warnings", report[s]["build warnings"])
        print("  n stem along the axis", {w: round(m["n stem"], 1) for w, m in report[s]["sweep"].items()})
        print("  contrast o along the axis", {w: round(m["contrast o"], 2) for w, m in report[s]["sweep"].items()})
    print("FAIL" if fail else "PASS", *fail, sep="\n  ")
    sys.exit(1 if fail else 0)
