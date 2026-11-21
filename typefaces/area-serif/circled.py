"""Area Serif 0.82 (owner round 8, item 16): the letters in a ring (© ® ℗), one ring and one rule for the letter.

Measured on snap082h (build/owner8/item16/area-before.txt): ©'s ring (Libre Baskerville's, which ® and ℗ carry
point for point) was thicker at top and bottom than at the sides: 52 against 40 at 400 (44.5 / 32 at 300, 65 / 53 at
800), a horizontal stress against every letter's upright one. Its C was Libre Baskerville's small C (barbs at both
ends, not this round's C); ®'s R a drawn R with its own serifs, ℗'s P Area's P scaled to 0.52 and lightened.

The references (build/owner8/item16/refring.py, refs.txt; seven faces, numbers only; medians at 300 / 400 / 700):

- The ring has the letters' upright stress, mildly: top / side 0.872 / 0.864 / 0.876 (©; ® 0.888 / 0.887 / 0.887,
  ℗ 0.868 / 0.858 / 0.853; every face between 0.79 and 0.95). Side 0.714 / 0.557 / 0.406 of the stem.
- The letter: its height 0.626 / 0.636 / 0.651 of the ring's counter (R 0.598 / 0.616 / 0.633, P 0.621 / 0.628 /
  0.652); its box's centre off the counter's -0.025 / -0.024 / -0.019 of the counter's width for C (an open letter
  stands left), +0.027 / +0.023 / +0.023 for R, +0.024 / +0.026 / +0.029 for P, and +0.002 to +0.010 of its height up;
  its thick (C's round side, R's and P's stem) 1.43 / 1.47 / 2.23 the ring's side for C, 1.21 / 1.25 / 1.43 for R,
  1.22 / 1.29 / 1.60 for P; its thin (C's top and bottom) 1.06 / 1.12 / 1.22 the ring's top.

The rule. One ring for all three: the Regular's outer outline (©'s, as drawn) in every master; the inner outline the
outer's extremes moved in by the side and the top, each quarter at the outer's own tension; side the references'
share of the stem, top 0.87 of the side (0.864 to 0.888). The letter is Area's own (C, R, P) in this master, scaled
about its box's centre to the references' share of the ring's counter, its strokes then made the references' weight
relative to the ring (level by the thick's share, upright by the thin's: at.embolden), its box's centre placed off the
counter's by the references' offsets. © thus carries this round's C, both terminals on one vertical. In a master the
same at the master's stem (the shares interpolated on the stem's logarithm between the references' 300, 400 and 700,
at Area's 55, 78 and 140) and the master's letters; a mid master where the glyph has one, at the readings that far.
"""
import math

import amp as A
import at as AT

LIB = "area.circled"
GLYPHS = {"copyright": "C", "registered": "R", "uni2117": "P"}
TOP_SIDE = 0.87
# 0.84 (Regular pass 6, item 4): at the Regular the ring's top and bottom the small figures' hairline (39: TOP_SIDE of
# the side, 0.899, inside the references' 0.79 to 0.95) and the letter the small figures' weights (stem 72, hairline
# 39) where the references gave 64 / 42 (C), 54 / 42 (R P); the masters take the Regular's additions by the stem's
# law as before
import ladder as LD
TOP_SIDE = LD.SMALL_HAIR / (0.557 * LD.STEM)
LETTER_OWN = (LD.SMALL_STEM, LD.SMALL_HAIR)
SIDE = {55.0: 0.714, 78.0: 0.557, 140.0: 0.406}
LETTER = {   # height of the counter, centre dx (counter's width), dy (counter's height), thick / ring side, thin / ring top
    "C": {55.0: (0.626, -0.025, 0.002, 1.43, 1.06), 78.0: (0.636, -0.024, 0.003, 1.47, 1.12), 140.0: (0.651, -0.019, 0.003, 2.23, 1.22)},
    "R": {55.0: (0.598, 0.027, 0.010, 1.21, 1.06), 78.0: (0.616, 0.023, 0.009, 1.25, 1.12), 140.0: (0.633, 0.023, 0.009, 1.43, 1.22)},
    "P": {55.0: (0.621, 0.024, -0.004, 1.22, 1.06), 78.0: (0.628, 0.026, -0.005, 1.29, 1.12), 140.0: (0.652, 0.029, -0.004, 1.60, 1.22)},
}


def _interp(table, stem):
    ks = sorted(table)
    s = min(max(stem, ks[0]), ks[-1])
    for a, b in zip(ks, ks[1:]):
        if a <= s <= b:
            t = math.log(s / a) / math.log(b / a)
            va, vb = table[a], table[b]
            if isinstance(va, tuple):
                return tuple(x + (y - x) * t for x, y in zip(va, vb))
            return va + (vb - va) * t
    return table[ks[-1]]


# ------------------------------------------------------------------ readings
def _box(cs):
    xs = [q[0] for P in cs for q in P]
    ys = [q[1] for P in cs for q in P]
    return min(xs), min(ys), max(xs), max(ys)


class _G:                                           # a glyph-like holder for amp._flat
    def __init__(self, cs):
        class _P:
            def __init__(self, q):
                self.x, self.y, self.type = q[0], q[1], q[2]

        class _C:
            def __init__(self, P):
                self.points = [_P(q) for q in P]
        self.contours = [_C(P) for P in cs]


def letter_reading(cs, kind):
    """(thick, thin, box) of a letter's contours: C's round side on the level through its middle and its top and
    bottom strokes on the upright through its middle; R's and P's stem on the level at a quarter of the height and the
    bowl's top on the upright at 0.40 of the width (clear of R's leg)."""
    x0, y0, x1, y1 = _box(cs)
    fl = A._flat(_G(cs))
    if kind == "C":
        lv = A._spans(fl, (y0 + y1) / 2, 1)
        up = A._spans(fl, (x0 + x1) / 2, 0)
        thick = lv[0][1] - lv[0][0]
        thin = ((up[0][1] - up[0][0]) + (up[-1][1] - up[-1][0])) / 2
    else:
        lv = A._spans(fl, y0 + 0.25 * (y1 - y0), 1)
        up = A._spans(fl, x0 + 0.40 * (x1 - x0), 0)
        thick = lv[0][1] - lv[0][0]
        thin = up[-1][1] - up[-1][0]
    return thick, thin, (x0, y0, x1, y1)


def readings(font, ring):
    """The master's stem (n's, as amp reads v and o: here the a.ss03's stem, the same law), its letters C R P, and the
    ring's outer outline (the Regular's ©)."""
    ra = AT.readings(font)
    stem = ra["stem"]
    return {"stem": stem, "h": ra["h"], "ring": ring,
            "letters": {k: [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in font[k].contours] for k in ("C", "R", "P")}}


def _mix(R0, R1, t):
    out = {"stem": R0["stem"] + (R1["stem"] - R0["stem"]) * t, "h": R0["h"] + (R1["h"] - R0["h"]) * t, "ring": R0["ring"],
           "letters": {}}
    for k in R0["letters"]:
        out["letters"][k] = [[(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2], p[3]) for p, q in zip(P, Q)]
                             for P, Q in zip(R0["letters"][k], R1["letters"][k])]
    return out


# ------------------------------------------------------------------ the ring
def _nodes(P):
    return [i for i, q in enumerate(P) if q[2]]


def inner_ring(outer, side, top):
    """The counter: the outer outline's four extremes moved in by side (level) and top (upright), each quarter's
    handles at the outer quarter's own share of its reach; wound the other way."""
    n = len(outer)
    idx = _nodes(outer)
    if len(idx) != 4 or n != 12:
        raise ValueError("circled: the ring's outer outline is not four quarters")
    cx = sum(outer[i][0] for i in idx) / 4
    cy = sum(outer[i][1] for i in idx) / 4
    new = []
    for i in idx:
        x, y = outer[i][:2]
        if abs(x - cx) > abs(y - cy):                 # a side extreme
            new.append((x - math.copysign(side, x - cx), y))
        else:
            new.append((x, y - math.copysign(top, y - cy)))
    quarters = []
    for k, i in enumerate(idx):
        p0, h1, h2, p3 = outer[i][:2], outer[(i + 1) % n][:2], outer[(i + 2) % n][:2], outer[(i + 3) % n][:2]
        s1 = math.dist(p0, h1) / max(abs(p3[0] - p0[0]) if abs(h1[0] - p0[0]) > abs(h1[1] - p0[1]) else abs(p3[1] - p0[1]), 1e-9)
        s2 = math.dist(p3, h2) / max(abs(p3[0] - p0[0]) if abs(h2[0] - p3[0]) > abs(h2[1] - p3[1]) else abs(p3[1] - p0[1]), 1e-9)
        a, b = new[k], new[(k + 1) % 4]
        d1 = A.unit((h1[0] - p0[0], h1[1] - p0[1]))
        d2 = A.unit((h2[0] - p3[0], h2[1] - p3[1]))
        r1 = abs(b[0] - a[0]) if abs(d1[0]) > abs(d1[1]) else abs(b[1] - a[1])
        r2 = abs(b[0] - a[0]) if abs(d2[0]) > abs(d2[1]) else abs(b[1] - a[1])
        quarters.append((a, (a[0] + d1[0] * s1 * r1, a[1] + d1[1] * s1 * r1), (b[0] + d2[0] * s2 * r2, b[1] + d2[1] * s2 * r2), b))
    fwd = []
    for a, h1, h2, b in quarters:
        fwd += [(h1[0], h1[1], None, False), (h2[0], h2[1], None, False), (b[0], b[1], "curve", True)]
    fwd = fwd[-1:] + fwd[:-1]                       # start on the first extreme, as the outer does
    out = A._reverse(fwd)                           # a counter: wound the other way
    return [(round(q[0]), round(q[1]), q[2], q[3]) for q in out]


# ------------------------------------------------------------------ the construction
def construct(R, kind, R0=None):
    stem = R["stem"]
    side = _interp(SIDE, stem) * stem
    top = TOP_SIDE * side
    outer = R["ring"]
    inner = inner_ring(outer, side, top)
    cx0, cy0, cx1, cy1 = _box([inner])
    cw, chh = cx1 - cx0, cy1 - cy0
    hs, ox, oy, k_thick, k_thin = _interp(LETTER[kind], stem)
    L = R["letters"][kind]
    thick0, thin0, (x0, y0, x1, y1) = letter_reading(L, kind)
    want_thick, want_thin = k_thick * side, k_thin * top
    if R0 is None and LETTER_OWN:
        want_thick, want_thin = LETTER_OWN
    if R0 is None:
        # the Regular: scaled so that, with its upright strokes made want_thin, its height is the share of the
        # counter; then its strokes made the references' weights
        k = (hs * chh - want_thin) / ((y1 - y0) - thin0)
        ex, ey = want_thick - thick0 * k, want_thin - thin0 * k
    else:
        # a master: the Regular's additions times the stem's law. Each master's own additions (the references'
        # weights reached exactly) added the same amount to every stroke, so a thin upright one (C's barb) came out
        # thicker in the Light than in the Regular (audit_rays 49.2 > 42.0 at 300)
        _c, i0 = construct(R0, kind)
        law = stem / R0["stem"]
        if stem < R0["stem"] and LETTER_OWN:
            # 0.84 pass 6: towards the Light the Regular's larger additions (the small figures' weights) shrink by the
            # hairline's law, not the stem's (by the stem's the R's serif ends read 0.69 of the Regular at 300, under
            # the tip's law: audit_axis thin)
            law = R["h"] / R0["h"]
        ex, ey = i0["dx"] * law, i0["dy"] * law
        k = (hs * chh - ey) / (y1 - y0)
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    S = [[((q[0] - mx) * k, (q[1] - my) * k) + tuple(q[2:]) for q in P] for P in L]
    S = AT.embolden(S, ex, ey)
    bx0, by0, bx1, by1 = _box(S)
    tx = (cx0 + cx1) / 2 + ox * cw - (bx0 + bx1) / 2
    ty = (cy0 + cy1) / 2 + oy * chh - (by0 + by1) / 2
    S = [[(round(q[0] + tx), round(q[1] + ty)) + tuple(q[2:]) for q in P] for P in S]
    got_thick, got_thin, _b = letter_reading(S, kind)
    info = {"side": side, "top": top, "k": k, "thick": got_thick, "thin": got_thin, "dx": ex, "dy": ey,
            "want": (want_thick, want_thin)}
    return [list(outer), inner] + S, info


def note(name, info):
    return (f"{name}: ring side {info['side']:.1f} top {info['top']:.1f}; letter x{info['k']:.3f}, thick {info['thick']:.1f}"
            f" thin {info['thin']:.1f} (references' {info['want'][0]:.1f} / {info['want'][1]:.1f}; {info['dx']:+.1f} level,"
            f" {info['dy']:+.1f} upright)")


def _put(g, cs):
    A._put(g, [[tuple(q) for q in P] for P in cs])


def regular(font):
    """The Regular's ©, ® and ℗ from the construction on ©'s drawn outer ring; advances kept."""
    if "copyright" not in font:
        return "circled: no copyright sign"
    ring = [(p.x, p.y, p.type, p.smooth) for p in font["copyright"].contours[0].points]
    R = readings(font, ring)
    out = []
    for name, kind in GLYPHS.items():
        if name not in font:
            continue
        cs, info = construct(R, kind)
        g = font[name]
        w = g.width
        _put(g, cs)
        g.width = w
        g.lib[LIB] = {"version": 1, "ring": [[q[0], q[1], q[2] or "offcurve", bool(q[3])] for q in ring]}
        out.append(note(name, info))
    return "; ".join(out)


def master(reg, font, layer=None, tm=None):
    """A master's ©, ® and ℗: the construction at this master's stem and letters on the Regular's outer ring; the
    Regular's advance (the ring does not move). The mid master where the glyph has one."""
    out = []
    if "copyright" not in reg or LIB not in reg["copyright"].lib:
        return out
    ring = [(q[0], q[1], None if q[2] == "offcurve" else q[2], q[3]) for q in reg["copyright"].lib[LIB]["ring"]]
    R0, R = readings(reg, ring), readings(font, ring)
    for name, kind in GLYPHS.items():
        if name not in reg or name not in font or LIB not in reg[name].lib:
            continue
        cs, info = construct(R, kind, R0)
        ref = [[q.type for q in c.points] for c in reg[name].contours]
        if [[q[2] for q in P] for P in cs] != ref:
            raise ValueError(f"{name}: the master's construction does not match the Regular's points")
        _put(font[name], cs)
        font[name].width = reg[name].width
        out.append(note(name, info))
        if layer is not None and tm is not None and name in layer:
            cm, _ = construct(_mix(R0, R, tm), kind, R0)
            _put(layer[name], cm)
            layer[name].width = reg[name].width
            out.append(f"{name} (mid) at {tm:.3f}")
    return out
