"""The full character set (0.47; owner, 2026-11-13: "complete its full character set: every glyph a UI/web text face
needs, drawn in Area Serif's current style").

Libre Baskerville's source already covers Basic Latin, Latin-1, Latin Extended-A (all but two), Vietnamese and much of
Extended-B. Its accented letters are components, so they follow Area's letters. Everything else with its own outline
kept Libre Baskerville's drawing under derive's transforms: it missed every rule since (normalize, clean), and the
punctuation, symbols and marks missed `clean.lighten`. This module runs last, on the finished letters, and

  1. lightens what lighten skipped (punctuation, symbols, marks), so every stroke comes off the same 4 units;
  2. rebuilds, from Area's finished letters, every glyph that is a letter plus a part: dotless i and j, the barred
     and slashed letters (D d H h T t L l O o), the thorns, long s, the f ligatures, superiors, inferiors and
     ordinals; fractions are components of the superiors and inferiors, so they follow;
  3. sets the dashes and hyphen to the minus's weight, the bullet to the references' size, one advance for the maths;
  4. adds tabular figures (`tnum`, and `pnum` back), and draws the glyphs Libre Baskerville never had: arrows,
     maths (<= >= ~~ infinity root partial increment product sum integral lozenge pi Omega), primes, currencies
     (rupee, ruble, lira, won, sheqel, dong), the typographic spaces, the extra dashes and the interface symbols
     (command, option, shift, delete, check, cross, circles).

Proportions of new and rebuilt parts are measured on Georgia Pro and Serrif (`docs/research/serif-typeface-
2026-11-10/charset-0.47.md`), in Area's own stems; nothing is read from their outlines but numbers. Every outline
here is Area's own: its letters' points, or geometry written below."""
import itertools
import math

import pathops
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
from ufoLib2.objects import Component

import clean as CLEAN

X_HEIGHT, CAP_HEIGHT, ASC = 520, 712, 780
# The set a UI and web text face covers (check.py fails on any one missing): Basic Latin, Latin-1, Latin Extended-A,
# then punctuation, currency, maths, arrows and interface symbols in common use.
COVERAGE = (list(range(0x20, 0x7F)) + [c for c in range(0xA0, 0x100) if c != 0xAD]   # no soft hyphen: the
            # browser draws it (fontbakery soft_hyphen)
             + list(range(0x100, 0x180))
            + [0x0192, 0x0218, 0x0219, 0x021A, 0x021B, 0x0237, 0x02BC, 0x02C6, 0x02C7, 0x02D8, 0x02D9, 0x02DA, 0x02DB,
               0x02BB, 0x02DC, 0x02DD, 0x0300, 0x0301, 0x0302, 0x0303, 0x0304, 0x0306, 0x0307, 0x0308, 0x030A, 0x030B,
               0x030C, 0x0326, 0x0327, 0x0328, 0x03A9, 0x03BC, 0x03C0, 0x1E9E, 0x2002, 0x2003, 0x2004, 0x2005,
               0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2015, 0x2018,
               0x2019, 0x201A, 0x201C, 0x201D, 0x201E, 0x2020, 0x2021, 0x2022, 0x2026, 0x202F, 0x2030, 0x2032,
               0x2033, 0x2039, 0x203A, 0x2044, 0x205F, 0x2070, 0x2074, 0x2075, 0x2076, 0x2077, 0x2078, 0x2079,
               0x2080, 0x2081, 0x2082, 0x2083, 0x2084, 0x2085, 0x2086, 0x2087, 0x2088, 0x2089, 0x20A9, 0x20AA,
               0x20AB, 0x20AC, 0x20B9, 0x20BA, 0x20BD, 0x2116, 0x2117, 0x2122, 0x2126, 0x2153, 0x2154, 0x215B,
               0x215C, 0x215D, 0x215E, 0x2190, 0x2191, 0x2192, 0x2193, 0x2194, 0x2195, 0x2196, 0x2197, 0x2198,
               0x2199, 0x21E7, 0x2202, 0x2206, 0x220F, 0x2211, 0x2212, 0x2215, 0x2219, 0x221A, 0x221E, 0x222B,
               0x2248, 0x2260, 0x2264, 0x2265, 0x2318, 0x2325, 0x232B, 0x25CA, 0x25CB, 0x25CF, 0x2713, 0x2715,
               0xFB01, 0xFB02]
            + [0x0309, 0x031B, 0x01A0, 0x01A1, 0x01AF, 0x01B0] + list(range(0x1EA0, 0x1EFA))   # Vietnamese (0.48)
            # 0.72: fractions, currencies from capitals, keys, menu dots, solid shapes
            + [0x2150, 0x2151, 0x2155, 0x2156, 0x2157, 0x2158, 0x2159, 0x215A, 0x20A1, 0x20A6, 0x20AD, 0x20AE,
               0x20B1, 0x20B2, 0x20B8, 0x20BF, 0x22EE, 0x22EF, 0x2303, 0x21E4, 0x21E5, 0x21B5, 0x23CE, 0x2326,
               0x21EA, 0x25B2, 0x25BC, 0x25B6, 0x25C0, 0x25B4, 0x25BE, 0x25B8, 0x25C2, 0x25A0, 0x25A1, 0x25C6,
               0x2605, 0x2606])
KAPPA = 0.5523


# ---------------------------------------------------------------- outline kit

def glyph_path(font, name, t=Transform()):
    """A glyph, components decomposed, as a pathops Path under transform t."""
    rec = DecomposingRecordingPen(font)
    font[name].draw(rec)
    p = pathops.Path()
    rec.replay(TransformPen(p.getPen(), t))
    return p


def shape(*contours):
    """Contours of (x, y) on-curve points, or ("c", h1, h2, p) cubic steps, as a Path. Closed."""
    p = pathops.Path()
    pen = p.getPen()
    for c in contours:
        pen.moveTo(c[0])
        for s in c[1:]:
            if s[0] == "c":
                pen.curveTo(s[1], s[2], s[3])
            else:
                pen.lineTo(s)
        pen.closePath()
    return p


def rect(x0, y0, x1, y1):
    return shape([(x0, y0), (x1, y0), (x1, y1), (x0, y1)])


def bar(p, q, w):
    """A straight stroke of width w from p to q, ends cut square to the stroke."""
    dx, dy = q[0] - p[0], q[1] - p[1]
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * w / 2, dx / L * w / 2
    return shape([(p[0] - nx, p[1] - ny), (q[0] - nx, q[1] - ny), (q[0] + nx, q[1] + ny), (p[0] + nx, p[1] + ny)])


def ellipse(cx, cy, rx, ry, reverse=False):
    kx, ky = rx * KAPPA, ry * KAPPA
    c = [(cx + rx, cy),
         ("c", (cx + rx, cy + ky), (cx + kx, cy + ry), (cx, cy + ry)),
         ("c", (cx - kx, cy + ry), (cx - rx, cy + ky), (cx - rx, cy)),
         ("c", (cx - rx, cy - ky), (cx - kx, cy - ry), (cx, cy - ry)),
         ("c", (cx + kx, cy - ry), (cx + rx, cy - ky), (cx + rx, cy))]
    return shape(c)


def ring(cx, cy, rx, ry, w_side, w_top):
    return op(ellipse(cx, cy, rx, ry), ellipse(cx, cy, rx - w_side, ry - w_top), pathops.PathOp.DIFFERENCE)


def op(a, b, kind=pathops.PathOp.UNION):
    return pathops.op(a, b, kind, fix_winding=True, keep_starting_points=False, clockwise=False)


def union(*paths):
    out = pathops.Path()
    for p in paths:
        out = op(out, p)
    return out


def moved(p, dx=0, dy=0, sx=1, sy=None, rotate=0, about=(0, 0)):
    t = Transform().translate(dx, dy).translate(*about).rotate(math.radians(rotate)).scale(sx, sy if sy is not None else sx).translate(-about[0], -about[1])
    out = pathops.Path()
    p.draw(TransformPen(out.getPen(), t))
    return out


def bounds(p):
    return p.bounds        # (xmin, ymin, xmax, ymax)


SCRAP = 150             # square units
# 0.81: a glyph made of a finished letter and strokes across it is one merged outline in the static Regular, and the
# letter's own contours plus each stroke as its own overlapping contour in the variable font's masters (overlap.py),
# so no corner where a stroke's edge meets the letter's has to travel between the masters. name: (letter, [Paths]).
STRUCK = {}
REBUILT, COMPOSED = set(), set()     # glyphs this module draws or composes (see follow_rebuilt)


def put(font, name, path, width, unicodes=None, lsb=None, rsb=None):
    """Writes path into glyph name (created if missing). With lsb and rsb, the ink is placed between those bearings
    and the advance follows; with lsb alone the advance stays width."""
    path = op(path, pathops.Path())          # resolve overlaps, outer contours counter-clockwise
    REBUILT.add(name)
    if name in font:
        g = font[name]
        g.clearContours()
        g.clearComponents()
    else:
        g = font.newGlyph(name)
    if lsb is not None:
        x0, _, x1, _ = bounds(path)
        path = moved(path, lsb - x0)
        if rsb is not None:
            width = round(lsb + (x1 - x0) + rsb)
    _draw_cubic(path, g.getPen())
    for c in g.contours:
        for pt in c.points:
            pt.x, pt.y = round(pt.x), round(pt.y)
    _drop_tiny(g)
    _drop_dents(g)
    for c in list(g.contours):                           # 0.74: a sliver where two outlines met (the kip's bar and
        P, n = c.points, len(c.points)                   # K's arm left 100 square units of white): under SCRAP, gone
        if abs(sum(P[i].x * P[(i + 1) % n].y - P[(i + 1) % n].x * P[i].y for i in range(n))) / 2 < SCRAP:
            g.contours.remove(c)
    g.width = round(width)
    if unicodes is not None:
        g.unicodes = list(unicodes)
    return g


def put_built(font, name, info, width, unicodes=None, lsb=None, rsb=None):
    """0.82: a sign from its construction (signs.py) at the Regular's weights; the recipe is kept in the glyph's lib
    so each master builds it again at its own (bold.construction_signs)."""
    import signs as SG
    a, b, c = SG.build(info)
    path = union(*[shape(P) for P in a])
    if b:
        path = op(path, union(*[shape(P) for P in b]), pathops.PathOp.DIFFERENCE)
    if c:
        path = union(path, *[shape(P) for P in c])
    if lsb is not None:                                  # 0.83: moved by whole units, so a construction's handle and
        x0_ = bounds(path)[0]                            # its node (an extreme) round alike
        lsb = x0_ + round(lsb - x0_)
    g = put(font, name, path, width, unicodes, lsb=lsb, rsb=rsb)
    g.lib[SG.LIB] = info
    soft_flags(g)
    return g


def _built_mid(info, cy):
    """How far a construction's ink middle stands over cy."""
    import signs as SG
    a, b, c = SG.build(info)
    bb = bounds(union(*[shape(P) for P in a + (c or [])]))
    return (bb[1] + bb[3]) / 2 - cy


def soft_flags(g, chord=16):
    """0.83 (symbols 2): a corner rounded on the letters' radius (a curve under `chord` between two lines) is two
    corners, as soft_ends marks them, not smooth nodes (its 4-unit handles cannot hold a tangent in whole units)."""
    for c in g.contours:
        P, n = c.points, len(c.points)
        on = [i for i in range(n) if P[i].type]
        for k, i in enumerate(on):
            j = on[(k + 1) % len(on)]
            if P[j].type == "curve" and (j - i) % n == 3 and math.dist((P[i].x, P[i].y), (P[j].x, P[j].y)) <= chord:
                P[i].smooth = False
                P[j].smooth = False


def _draw_cubic(path, pen):
    """Draws a Path with every quadratic piece raised to a cubic (skia leaves a few where it splits curves)."""
    cur = None
    for verb, P in path.segments:
        if verb == "moveTo":
            pen.moveTo(P[0])
            cur = P[0]
        elif verb == "lineTo":
            pen.lineTo(P[0])
            cur = P[0]
        elif verb == "curveTo":
            pen.curveTo(*P)
            cur = P[-1]
        elif verb == "qCurveTo":
            pts = list(P)
            offs, end = pts[:-1], pts[-1]
            for k, q in enumerate(offs):           # implied on-curve points between consecutive off-curves
                e = end if k == len(offs) - 1 else ((q[0] + offs[k + 1][0]) / 2, (q[1] + offs[k + 1][1]) / 2)
                pen.curveTo((cur[0] + 2 / 3 * (q[0] - cur[0]), cur[1] + 2 / 3 * (q[1] - cur[1])),
                            (e[0] + 2 / 3 * (q[0] - e[0]), e[1] + 2 / 3 * (q[1] - e[1])), e)
                cur = e
        elif verb == "closePath":
            pen.closePath()
        elif verb == "endPath":
            pen.endPath()


def _drop_dents(g):
    """0.77: where two outlines met a hair apart a union can leave a dent of a few units between straight edges
    (the summation's inner vertex had a 3-unit zigzag). A corner between two straight steps that are both under 8
    units long and that sits under 3 units off the line between its neighbours is dropped."""
    for c in g.contours:
        P = c.points
        again = True
        while again and len(P) > 6:
            again = False
            n = len(P)
            for i in range(n):
                a, p, b = P[i - 1], P[i], P[(i + 1) % n]
                if not (a.type and p.type == "line" and b.type == "line"):
                    continue
                la, lb = math.hypot(p.x - a.x, p.y - a.y), math.hypot(b.x - p.x, b.y - p.y)
                L = math.hypot(b.x - a.x, b.y - a.y)
                if la >= 8 or lb >= 8 or L < 1e-6:
                    continue
                off = abs((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) / L
                if off < 3:
                    del P[i]
                    again = True
                    break


def _drop_tiny(g):
    """pathops can leave a 1-unit segment where two outlines met at a hair: drop the on-curve nodes it doubles.
    0.65: also a curve whose two ends are within 2 units (its handles go with it); the f ligatures, thorn, oe and the
    small figures each carried one or two."""
    for c in g.contours:
        P = c.points
        again = True
        while again and len(P) > 6:
            again = False
            n = len(P)
            for i in range(n):
                a, h1, h2, b = P[i], P[(i + 1) % n], P[(i + 2) % n], P[(i + 3) % n]
                if not (a.type and h1.type is None and h2.type is None and b.type == "curve"):
                    continue
                if abs(a.x - b.x) > 2 or abs(a.y - b.y) > 2:
                    continue
                if a.type == "line":                   # the line into a now ends on b
                    b.type, b.smooth = "line", False
                    drop = (a, h1, h2)
                else:                                  # what leaves b now leaves a
                    a.smooth = a.smooth and b.smooth
                    drop = (h1, h2, b)
                for q in drop:
                    P.remove(q)
                again = True
                break
        i = 0
        while i < len(P) and len(P) > 4:
            a, b = P[i], P[(i + 1) % len(P)]
            if a.type and b.type == "line" and abs(a.x - b.x) <= 1 and abs(a.y - b.y) <= 1:
                if a.type == "line":
                    del P[i]
                else:                                  # a curve's end, then a 1-unit line: the curve ends on the line's end
                    a.x, a.y, a.smooth = b.x, b.y, False
                    P.remove(b)
                continue
            i += 1


def compose(font, name, parts, width, unicodes=None):
    COMPOSED.add(name)
    if name in font:
        g = font[name]
        g.clearContours()
        g.clearComponents()
    else:
        g = font.newGlyph(name)
    for base, dx, dy in parts:
        g.components.append(Component(base, (1, 0, 0, 1, dx, dy)))
    g.width = width
    if unicodes is not None:
        g.unicodes = list(unicodes)
    return g


def scan_h(path, y):
    """Ink spans along a horizontal line through a Path."""
    return _scan(path, y, 1)


def scan_v(path, x):
    return _scan(path, x, 0)


def _scan(path, v, ax):
    cur = None
    flat = []
    for verb, P in path.segments:
        if verb == "moveTo":
            cur = [P[0]]
            flat.append(cur)
        elif verb == "lineTo":
            cur.append(P[0])
        elif verb == "curveTo":
            a = cur[-1]
            b, c, d = P
            for k in range(1, 17):
                t = k / 16
                u = 1 - t
                cur.append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
                            u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]))
        elif verb == "qCurveTo":
            cur.extend(P)
    hits = []
    for c in flat:
        for i in range(len(c)):
            a, b = c[i], c[(i + 1) % len(c)]
            if (a[ax] <= v < b[ax]) or (b[ax] <= v < a[ax]):
                t = (v - a[ax]) / (b[ax] - a[ax])
                hits.append(a[1 - ax] + t * (b[1 - ax] - a[1 - ax]))
    hits.sort()
    return [(hits[i], hits[i + 1]) for i in range(0, len(hits) - 1, 2)]


def gp(font, name):
    return glyph_path(font, name)


# ---------------------------------------------------------------- measurements on Area's finished letters

class M:
    """Stems and thin strokes as the finished letters have them (after lighten)."""

    def __init__(self, font):
        n = gp(font, "n")
        self.stem = _first(scan_h(n, 260))                         # 78
        H = gp(font, "H")
        self.cap_stem = _first(scan_h(H, 200))                     # 86
        hx = (bounds(H)[0] + bounds(H)[2]) / 2
        spans = scan_v(H, hx)
        self.cap_bar = spans[0][1] - spans[0][0] if spans else 50  # H's crossbar
        self.cap_bar_y = (spans[0][0] + spans[0][1]) / 2 if spans else 340
        t = gp(font, "t")
        tx = bounds(t)[2] - 20
        sp = [s for s in scan_v(t, tx) if s[0] > 400]
        self.low_bar = sp[0][1] - sp[0][0] if sp else 49           # t's bar
        m = gp(font, "minus")
        sp = scan_v(m, (bounds(m)[0] + bounds(m)[2]) / 2)
        self.math = sp[0][1] - sp[0][0]                            # the minus's stroke
        self.math_y = (sp[0][0] + sp[0][1]) / 2
        o = gp(font, "o")                                           # 0.83: the hairline, o's top (43)
        ob = bounds(o)
        top = scan_v(o, (ob[0] + ob[2]) / 2)
        self.hair = round(top[-1][1] - top[-1][0]) if top else 43


def _first(spans):
    return spans[0][1] - spans[0][0]


def _stem_x(path, y):
    """Left and right edge of the first stem crossed at height y."""
    s = scan_h(path, y)
    return s[0]


# ---------------------------------------------------------------- 1. lighten what lighten skipped

LIGHT_SKIP = {".notdef", "space", "nbspace"}


def lighten_rest(font, done):
    names = [g.name for g in font if g.contours and not g.components and g.name not in done
             and g.name not in LIGHT_SKIP]
    CLEAN.lighten(font, names)
    return names


# ---------------------------------------------------------------- 2. letters plus a part

def dotless(font):
    """idotless and jdotless are i and j without their dots (they were Libre Baskerville's old i and j)."""
    for base, name in (("i", "idotless"), ("j", "jdotless")):
        g = font[base]
        keep = [c for c in g.contours if not (max(p.y for p in c.points) > X_HEIGHT + 60
                                              and min(p.y for p in c.points) > X_HEIGHT + 60)]
        p = pathops.Path()
        pen = p.getPen()
        for c in keep:
            c.draw(pen)
        u = font[name].unicodes if name in font else []
        put(font, name, p, g.width, u)


# Bars and slashes, in the base's own stems (S = H's stem for capitals, n's for lowercase); y in cap or x-heights.
# Measured on Serrif and Georgia Pro (charset-0.47.md); the bar is the base's own thin bar (H's crossbar, t's bar).
BARS = {
    #  glyph:   (base, y centre, from the stem's left edge, past the stem's right edge, which stem)
    "Dcroat": ("D", 0.50, 0.94, 1.37, 0),
    "dcroat": ("d", 1.156, 1.87, 0.93, -1),
    "Hbar": ("H", 0.725, 0.99, 1.11, None),      # None: the bar runs from the first stem to past the last
    "hbar": ("h", 1.156, 0.92, 1.88, 0),
    "Tbar": ("T", 0.50, 1.15, 1.15, 0),
    "tbar": ("t", 0.60, 0.91, 1.62, 0),
}
SLASHES = {
    #  glyph:    (base, centre y in heights, half run in stems, rise per unit of run)
    "Lslash": ("L", 0.43, 1.45, 0.42),
    "lslash": ("l", 1.00, 1.40, 0.45),       # centre at the x-height on the ascender stem
}
O_SLASH = {"Oslash": ("O", 0.06, 0.10), "oslash": ("o", 0.07, 0.10)}   # past the bowl, below and above; in from the side


def bars(font, m):
    for name, (base, yc, left, right, which) in BARS.items():
        b = gp(font, base)
        cap = base.isupper()
        S = m.cap_stem if cap else m.stem
        w = m.cap_bar if cap else m.low_bar
        h = CAP_HEIGHT if cap else X_HEIGHT
        y = yc * h
        stems = [s for s in scan_h(b, y if base != "t" else 300) if s[1] - s[0] < S * 1.4]
        if base in "dh":
            stems = [s for s in scan_h(b, 650) if s[1] - s[0] < S * 1.4]
        if which is None:
            x0, x1 = stems[0][0] - left * S, stems[-1][1] + right * S
        else:
            st = stems[which]
            x0, x1 = st[0] - left * S, st[1] + right * S
        STRUCK[name] = (base, [rect(x0, band(y, w)[0], x1, band(y, w)[1])])
        p = union(b, rect(x0, band(y, w)[0], x1, band(y, w)[1]))
        put(font, name, p, font[base].width)
    if "Eth" in font and font["Eth"].components:
        compose(font, "Eth", [("Dcroat", 0, 0)], font["Dcroat"].width)
    for name, (base, yc, run, rise) in SLASHES.items():
        b = gp(font, base)
        cap = base.isupper()
        S = m.cap_stem if cap else m.stem
        w = m.cap_bar if cap else m.low_bar
        y = yc * (CAP_HEIGHT if cap else X_HEIGHT)
        st = [s for s in scan_h(b, y) if s[1] - s[0] < S * 1.4][0]
        cx = (st[0] + st[1]) / 2
        d = run * S
        STRUCK[name] = (base, [bar((cx - d, y - d * rise), (cx + d, y + d * rise), w)])
        p = union(b, bar((cx - d, y - d * rise), (cx + d, y + d * rise), w))
        put(font, name, p, font[base].width)
    for name, (base, past, inset) in O_SLASH.items():
        b = gp(font, base)
        x0, y0, x1, y1 = bounds(b)
        w = (m.cap_bar if base.isupper() else m.low_bar)
        h = y1 - y0
        STRUCK[name] = (base, [bar((x0 + inset * (x1 - x0), y0 - past * h), (x1 - inset * (x1 - x0), y1 + past * h), w)])
        p = union(b, bar((x0 + inset * (x1 - x0), y0 - past * h), (x1 - inset * (x1 - x0), y1 + past * h), w))
        put(font, name, p, font[base].width)


def thorns(font, m):
    """thorn: p's stem and bowl under b's ascender (p's head flag cut off); Thorn: P's bowl lowered on I's stem."""
    p = gp(font, "p")
    b = gp(font, "b")
    st = _stem_x(p, 300)
    p_noflag = op(p, rect(-100, 300, st[0], 1000), pathops.PathOp.DIFFERENCE)
    bs = _stem_x(b, 300)
    b_top = op(b, rect(-100, 300, bs[1] + 0.5, 1000), pathops.PathOp.INTERSECTION)
    put(font, "thorn", union(p_noflag, moved(b_top, st[0] - bs[0])), font["p"].width)
    P = gp(font, "P")
    I = gp(font, "I")
    ps, is_ = _stem_x(P, 200), _stem_x(I, 200)
    low = min(s[0] for s in scan_v(P, ps[1] + 30) if s[0] > 100)      # the bowl's lower stroke
    bowl = op(P, rect(ps[1] - 12, low - 2, 2000, 1000), pathops.PathOp.INTERSECTION)
    y0, y1 = bounds(bowl)[1], bounds(bowl)[3]
    drop = (CAP_HEIGHT - (y1 - y0)) / 2 - y0 + 6                # the bowl centred on the stem's height
    stem = moved(I, ps[0] - is_[0])
    put(font, "Thorn", union(stem, moved(bowl, 0, drop)), font["P"].width)


def long_s(font):
    """long s: Area's f without its bar."""
    f = gp(font, "f")
    st = _stem_x(f, 300)
    cut = union(rect(-100, X_HEIGHT - 70, st[0], X_HEIGHT + 4), rect(st[1], X_HEIGHT - 70, 1000, X_HEIGHT + 4))
    p = op(f, cut, pathops.PathOp.DIFFERENCE)
    put(font, "longs", p, font["f"].width - 40, [0x017F])


# f ligatures. fi is f and a dotless i (the dot is what met f's end); fl, fb, fh, fk run f's top into the second
# letter's ascender, which loses its flag; ff joins the two bars. Each pair keeps f's own advance and kerning.
F_JOIN_TOP = 6          # the bridge's top runs this far under the ascender's top, the arc's own height above


def f_parts(font):
    f = gp(font, "f")
    st = _stem_x(f, 300)                                     # f's stem
    x0, y0, x1, y1 = bounds(f)
    # the arc's top stroke: the ink's top and the counter's top above the stem's right edge
    col = scan_v(f, st[1] + 70)
    top = max(col, key=lambda s: s[1])
    return f, st, top


def f_join(font, second, dx):
    """f's arc run level into the ascender of `second`, placed at dx. 0.79: the arc is cut at its highest point and
    runs on from there at the ascender's own top, across the whole stem: one level edge from the arc to the stem's
    far corner. (Until 0.78 the bridge left the arc 15 units before its top, 6 under the ascender line, and stopped
    at the stem's near edge: the stem's slanted top stood over it as a step.)"""
    f = gp(font, "f")
    s = gp(font, second)
    ss = _stem_x(s, 640)                                     # the ascender's stem
    s_noflag = op(s, rect(-100, 560, ss[0], 1000), pathops.PathOp.DIFFERENCE)
    P = _pts(max(font["f"].contours, key=lambda q: len(q.points)))
    n = len(P)
    level = [i for i in range(n) if P[i][2] and P[i - 1][2] is None and P[(i + 1) % n][2] is None
             and P[i - 1][1] == P[i][1] == P[(i + 1) % n][1]]
    top_out = max(level, key=lambda i: P[i][1])
    cut_x, top_y = P[top_out][0], max(P[top_out][1], bounds(s)[3])
    lo = max(scan_v(f, cut_x), key=lambda sp: sp[1])[0]             # the arc's underside at its top
    f_cut = op(f, rect(cut_x, 560, 1000, 1000), pathops.PathOp.DIFFERENCE)
    bridge = rect(cut_x - 2, round(lo), dx + ss[1], top_y)
    return union(f_cut, bridge, moved(s_noflag, dx))


def f_bars(font, f_path, dx_list):
    """The bars of f's at dx_list joined into one bar."""
    f = gp(font, "f")
    st = _stem_x(f, 300)
    sp = [s for s in scan_v(f, st[1] + 30) if s[0] > 400]
    b0, b1 = sp[0]
    return union(f_path, rect(dx_list[0] + st[1], b0, dx_list[-1] + st[0] + 1, b1))


# f before i and j in a ligature (0.79; owner, 2026-11-14: "should f's top reach further toward the i, so the end of
# the hook sits almost over the dot?"). Until 0.78 fi was the plain f and a dotless i at their ordinary fit: the hook
# stopped 0.99 stems short of the i's stem centre and nothing stood where the dot had been, so the pair read as f
# and a dotless i. Measured on eight faces (tools/ligatures.py, HarfBuzz, each in its own n stems): seven draw fi as
# one glyph without a dot, the hook reaching past the i's stem centre by 0.31 to 0.63 (Georgia Pro 0.41, Serrif
# 0.43), so its end stands where the dot was; and they set the two stems closer than the letters apart: Georgia Pro
# 3.18 against 3.58, Serrif 3.66 against 4.15 (0.888 and 0.882 of the unligated distance).
# With ligatures off nothing changes: f's hook ends 1.29 stems before the dot's centre (the others 0.84 to 1.46)
# and 0.56 clear of it (0.17 to 0.79), inside the references.
F_HOOK_PAST = 0.42      # of the stem: the hook's end past the second letter's stem centre (0.41, 0.43)
F_LIG_STEMS = 0.885     # stem to stem in the ligature, of the two letters set apart (0.888, 0.882)


def restretch_x(P, new_x):
    """P: [(x, y, type, smooth)]; new_x: {index: x} for on-curve points that move. Each handle keeps its share of
    its own curve across (its offset from its node, scaled by how much the curve's run changed)."""
    n = len(P)
    out = [list(p) for p in P]
    for i, x in new_x.items():
        out[i][0] = x
    for i in range(n):
        a, h1, h2, b = i, (i + 1) % n, (i + 2) % n, (i + 3) % n
        if not (P[a][2] and P[h1][2] is None and P[h2][2] is None and P[b][2]):
            continue
        old = P[b][0] - P[a][0]
        s = (out[b][0] - out[a][0]) / old if old else None
        for h, node in ((h1, a), (h2, b)):
            off = P[h][0] - P[node][0]
            out[h][0] = round(out[node][0] + (off * s if s is not None else off))
    return [tuple(p) for p in out]


def f_hook(font, reach):
    """f with its hook's end at x = reach: the ball moves as one piece, the arc's two highest points keep their
    share of the arc, every handle its share of its curve. The stem, the bar and the foot do not move."""
    g = font["f"]
    c = max(g.contours, key=lambda q: len(q.points))
    P = _pts(c)
    n = len(P)
    on = [i for i in range(n) if P[i][2]]
    asc = max(P[i][1] for i in on)
    level = [i for i in on if P[i - 1][2] is None and P[(i + 1) % n][2] is None and P[i - 1][1] == P[i][1] == P[(i + 1) % n][1]]
    top_out = max(level, key=lambda i: P[i][1])                                  # the arc's top, outside
    top_in = max((i for i in level if P[i][1] < asc - 20 and P[i][1] > asc - 80), key=lambda i: P[i][1])   # and inside
    k0, k1 = sorted((on.index(top_in), on.index(top_out)))
    ball = on[k0 + 1:k1]                                                         # the nodes between them
    ball_r = max(P[i][0] for i in ball)
    ball_l = min(P[i][0] for i in ball)
    d = reach - ball_r
    # where each side of the arc starts: the stem's edge it leaves
    st_out = P[on[(k1 + 1) % len(on)]][0] if on[k1] == top_out else P[on[k0 - 1]][0]
    st_in = P[on[k0 - 1]][0] if on[k0] == top_in else P[on[(k1 + 1) % len(on)]][0]
    new = {i: P[i][0] + d for i in ball}
    new[top_out] = round(st_out + (P[top_out][0] - st_out) * (ball_r + d - st_out) / (ball_r - st_out))
    new[top_in] = round(st_in + (P[top_in][0] - st_in) * (ball_l + d - st_in) / (ball_l - st_in))
    p = pathops.Path()
    pen = p.getPen()
    from fontTools.pens.pointPen import PointToSegmentPen
    pp = PointToSegmentPen(pen)
    pp.beginPath()
    for x, y, t, s in restretch_x(P, new):
        pp.addPoint((x, y), segmentType=t, smooth=s)
    pp.endPath()
    return p


def lig_offset(font, second):
    """Where the second letter (i or j) stands after f in a ligature: its stem centre F_LIG_STEMS of the way it
    stands with ligatures off (the fit, kerning, and the opening spacing.f_before_dots gives the dot)."""
    import spacing as SPACING
    base = {"i": "idotless", "j": "jdotless"}[second]
    fs = _stem_x(gp(font, "f"), 300)
    ss = scan_h(gp(font, base), 300)[-1] if second == "j" else _stem_x(gp(font, base), 300)
    fc, sc = (fs[0] + fs[1]) / 2, (ss[0] + ss[1]) / 2
    gap, k = SPACING.f_gap(font, "f", second)
    k_off = k + max(0, round(SPACING.F_DOT - gap)) if gap is not None else k
    apart = font["f"].width + k_off + sc - fc
    dx = round(fc + F_LIG_STEMS * apart - sc)
    reach = round(dx + sc + F_HOOK_PAST * (fs[1] - fs[0]))
    return dx, reach


LIGATURES = {
    # name: (letters after f or ff, how the last one meets: "i" set apart, "asc" joined at the top, "plain")
    "fi": ("i",), "fl": ("l",), "f_f": (), "f_f_i": ("i",), "f_f_l": ("l",),
    "f_b": ("b",), "f_h": ("h",), "f_k": ("k",), "f_j": ("j",), "f_t": ("t",),
    "f_f_b": ("b",), "f_f_h": ("h",), "f_f_k": ("k",), "f_f_j": ("j",), "f_f_t": ("t",),
}


def ligatures(font):
    fw = font["f"].width
    for name, rest in LIGATURES.items():
        ffs = 2 if name.startswith("f_f") else 1
        dxs = [fw * k for k in range(ffs)]
        p = pathops.Path()
        for dx in dxs[:-1]:
            p = union(p, moved(gp(font, "f"), dx))
        last_dx = dxs[-1]
        width = last_dx + fw
        ch = ""
        carets = dxs[1:]
        if rest:
            ch = rest[0]
            dx = last_dx + fw + _kern(font, "f", ch)
            if ch in "lbhk":
                p = union(p, moved(f_join(font, ch, dx - last_dx), last_dx))
            elif ch in "ij":                                   # 0.79: the hook runs over the stem, where the dot was
                off, reach = lig_offset(font, ch)
                dx = last_dx + off
                p = union(p, moved(f_hook(font, reach), last_dx), moved(gp(font, ch + "dotless"), dx))
                # f's bar runs into the second letter's flag (as it does into t and the second f; six of the eight
                # faces join them). Tucked in, the bar's end stood 12 from the flag: two inks that close on each
                # other as the weight rises.
                fst = _stem_x(gp(font, "f"), 300)
                bar = [s for s in scan_v(gp(font, "f"), fst[1] + 30) if s[0] > 400][0]
                sst = scan_h(gp(font, ch + "dotless"), 300)[-1]
                flag_top = max(s[1] for s in scan_v(gp(font, ch + "dotless"), sst[0] - 4) if s[0] > 400)
                p = union(p, rect(last_dx + fst[1] - 2, bar[0], dx + sst[0] + 2, min(bar[1], flag_top)))
            else:
                base = {"i": "idotless", "j": "jdotless"}.get(ch, ch)
                p = union(p, moved(gp(font, "f"), last_dx), moved(gp(font, base), dx))
            width = dx + font[{"i": "idotless", "j": "jdotless"}.get(ch, ch)].width
            carets = carets + [dx]
        else:
            p = union(p, moved(gp(font, "f"), last_dx))
        if ffs == 2 or ch == "t":
            bars_at = dxs if ffs == 2 else [0]
            p = f_bars(font, p, bars_at)
            if ch == "t":                                      # f's bar runs into t's
                f = gp(font, "f")
                st = _stem_x(f, 300)
                t = gp(font, "t")
                ts = _stem_x(t, 300)
                sp = [s for s in scan_v(t, ts[1] + 20) if s[0] > 400][0]
                fsp = [s for s in scan_v(f, st[1] + 30) if s[0] > 400][0]
                lo, hi = max(sp[0], fsp[0]), min(sp[1], fsp[1])
                p = union(p, rect(last_dx + st[1] - 2, lo, dx + ts[0] + 2, hi))
        g = put(font, name, p, width)
        g.clearAnchors()
        for k, x in enumerate(carets, 1):                      # the caret between letters (GDEF, by ufo2ft)
            g.appendAnchor({"name": f"caret_{k}", "x": round(x), "y": 0})


def _kern(font, a, b):
    """The pair's kerning, by glyph or by group."""
    k = font.kerning
    ga = next((g for g, m in font.groups.items() if g.startswith("public.kern1") and a in m), None)
    gb = next((g for g, m in font.groups.items() if g.startswith("public.kern2") and b in m), None)
    for pair in ((a, b), (a, gb), (ga, b), (ga, gb)):
        if pair in k:
            return k[pair]
    return 0


def kern_like(font, name, left_as, right_as):
    """A new glyph kerns as `left_as` on its left side and `right_as` on its right."""
    for g, members in font.groups.items():                 # its own old groups go: it kerns as its parts now
        if g.startswith(("public.kern1", "public.kern2")) and name in members:
            members.remove(name)
    for pair in [p for p in font.kerning if name in p]:
        del font.kerning[pair]
    for g, members in font.groups.items():
        if g.startswith("public.kern2") and left_as in members and name not in members:
            members.append(name)
        if g.startswith("public.kern1") and right_as in members and name not in members:
            members.append(name)
    in1 = any(right_as in m for g, m in font.groups.items() if g.startswith("public.kern1"))
    in2 = any(left_as in m for g, m in font.groups.items() if g.startswith("public.kern2"))
    for (a, b), v in list(font.kerning.items()):
        if a == right_as and not in1:
            font.kerning[(name, b)] = v
        if b == left_as and not in2:
            font.kerning[(a, name)] = v


# Superiors, inferiors and ordinals: Area's figures and a o, scaled, then made heavier than plain scaling would leave
# them (a small figure reads light). Serrif's are 0.60 of the figure and 1.15 times heavier for their size, Georgia
# Pro's 0.66 and 1.33; Libre Baskerville's were 0.42 and 0.96, which read faint in a footnote mark.
SUP_SCALE = 0.54
SUP_TOP = 770           # superiors' figure top (the 1's flag); inferiors stand on the baseline (fractions use them)
SUP_BOLD = 4.0          # units added on each side after scaling (the ordinals ª º)
# 0.84 (Regular pass 3, the owner's visual notes, item 6: "½ ¾ slashed numbers appear much lighter, along with the %";
# "the fractions are still very light looking"). At 4 the small figures' stem was 54 (0.63 of the figures' 86 at 0.54
# of their size: 1.16 times heavier than scaled, Serrif's 1.15), its hairline 33. Now the heavier reference's share,
# Georgia Pro's 1.33: stem 0.54 x 86 x 1.33 = 62, so 8 on each side (the hairline 25 + 16 = 41, the contrast a small
# figure's). The fraction bar, % and ‰ follow (their figures are these; the bar below)
SUP_BOLD_FIG = 8.0
SUP_SIDE = 14           # each side bearing, after scaling
FIGS = "zero one two three four five six seven eight nine".split()


def small_figures(font):
    one_top = bounds(gp(font, "one"))[3]
    for i, fig in enumerate(FIGS):
        p = moved(gp(font, fig), 0, 0, SUP_SCALE)
        x0, _, x1, _ = bounds(p)
        w = (font[fig].width * SUP_SCALE) + 2 * SUP_SIDE
        sup = moved(p, -x0 + SUP_SIDE, SUP_TOP - one_top * SUP_SCALE)
        inf = moved(p, -x0 + SUP_SIDE, 0)
        lsb0 = (font[fig].width * SUP_SCALE - (x1 - x0)) / 2
        for name, path in ((fig + "superior", sup), (fig + "inferior", inf)):
            g = font[name]
            u = list(g.unicodes)
            put(font, name, path, w, u, lsb=SUP_SIDE + lsb0 * 0.5, rsb=SUP_SIDE + lsb0 * 0.5)
    names = [f + s for f in FIGS for s in ("superior", "inferior")]
    before = {n: [[(p.x, p.y) for p in c.points] for c in font[n].contours] for n in names}
    CLEAN.lighten(font, names, -SUP_BOLD_FIG)
    folded = fold_steps(font, names, before)
    if folded:
        print("small figures: steps folded", folded)
    for base, name in (("a", "ordfeminine"), ("o", "ordmasculine")):
        p = moved(gp(font, base), 0, 0, SUP_SCALE)
        x0, y0, x1, y1 = bounds(p)
        p = moved(p, 0, SUP_TOP - one_top * SUP_SCALE)               # the superior figures' baseline
        put(font, name, p, 0, list(font[name].unicodes), lsb=SUP_SIDE + 6, rsb=SUP_SIDE + 6)
    CLEAN.lighten(font, ["ordfeminine", "ordmasculine"], -SUP_BOLD)


# 0.84 (Regular pass 4, item A1): the 9's crotch (and the 6's, turned) is a short step, a straight of 7 between two
# corners where the counter's lower curve meets the tail's inner edge (figs.nine_tail). Made heavier by SUP_BOLD_FIG,
# the tail's edge moves 8 toward the counter and passes the curve's end: the step turns back on itself and the contour
# crosses itself (pathlint, ⁶ ₆ ⁹ ₉). Where the heavier outline's step runs against the scaled one, the two edges
# meet before it: the step's first corner goes where the curve's end tangent meets the next edge's line, and the
# step's second corner is dropped. The full-size figures are not touched.
def fold_steps(font, names, before):
    out = []
    for name in names:
        g = font[name]
        for c, old in zip(g.contours, before[name]):
            P, n = c.points, len(c.points)
            for i in range(n):
                a, b = P[i], P[(i + 1) % n]
                if not (a.type and b.type == "line"):
                    continue
                o0, o1 = old[i], old[(i + 1) % n]
                vo = (o1[0] - o0[0], o1[1] - o0[1])
                vn = (b.x - a.x, b.y - a.y)
                if vo[0] * vn[0] + vo[1] * vn[1] >= 0 or math.hypot(*vo) > 20:
                    continue
                pa, pb = P[(i - 1) % n], P[(i + 2) % n]
                d1 = (a.x - pa.x, a.y - pa.y)
                d2 = (pb.x - b.x, pb.y - b.y)
                den = d1[0] * d2[1] - d1[1] * d2[0]
                if abs(den) < 1e-9:
                    continue
                t = ((b.x - a.x) * d2[1] - (b.y - a.y) * d2[0]) / den
                a.x, a.y = round(a.x + d1[0] * t), round(a.y + d1[1] * t)
                del c.points[(i + 1) % n]
                out.append(f"{name} ({a.x}, {a.y})")
                break
    return out


# ---------------------------------------------------------------- 3. dashes, bullet, maths widths

DASH = 0.66             # hyphen and dashes, in n stems (Libre Baskerville 1.10; Georgia Pro 0.74, Serrif 0.49)
DASH_Y = 278            # their centre (0.53 of the x-height, as Georgia Pro and Serrif)
BULLET = 0.48           # the bullet's diameter in x-heights (Libre Baskerville 0.58; Georgia Pro 0.52, Serrif 0.49)
MATH_ADV = None         # set to the tabular figure's advance


def dashes(font, m):
    w = DASH * m.stem
    for name in ("hyphen", "endash", "emdash"):
        g = font[name]
        x0, _, x1, _ = bounds(gp(font, name))
        put(font, name, rect(x0, DASH_Y - w / 2, x1, DASH_Y + w / 2), g.width)
    hy = font["hyphen"]
    compose(font, "uni2010", [("hyphen", 0, 0)], hy.width, [0x2010])
    compose(font, "uni2011", [("hyphen", 0, 0)], hy.width, [0x2011])
    em = font["emdash"]
    compose(font, "uni2015", [("emdash", 0, 0)], em.width, [0x2015])


def bullet(font, m):
    g = font["bullet"]
    r = BULLET * X_HEIGHT / 2
    # 0.84 (placement): the bullet, the middle dot and the bullet operator centred on the maths axis (Georgia Pro,
    # Times New Roman, Source Serif 4, Literata, Newsreader within 5 of their minus's middle); · stood at 269, • at
    # 280, ∙ at 255. The two small ones are the period's dot (124; ∙ was 118)
    cy = m.math_y
    put(font, "bullet", ellipse(0, cy, r, r), 0, list(g.unicodes), lsb=86, rsb=86)
    for name in ("periodcentered", next((g_.name for g_ in font if 0x2219 in g_.unicodes), "bulletoperator")):
        if name in font and len(font[name].contours) == 1 and not font[name].components:
            c = font[name].contours[0]
            _place_dot(font, c, "period", "centre")
            d = round(cy - (min(q.y for q in c.points) + max(q.y for q in c.points)) / 2)
            for q in c.points:
                q.y += d


MATH = ["plus", "minus", "multiply", "divide", "equal", "notequal", "greater", "less", "plusminus", "logicalnot",
        "asciitilde", "asciicircum", "lessequal", "greaterequal", "approxequal", "infinity", "uni2219", "periodcentered"]


def math_widths(font, adv):
    for name in MATH:
        if name not in font or name in ("periodcentered", "uni2219", "asciicircum", "asciitilde"):
            continue
        g = font[name]
        p = gp(font, name)
        x0, _, x1, _ = bounds(p)
        d = (adv - (x1 - x0)) / 2 - x0
        if g.components:                    # notequal: its parts move, as components
            COMPOSED.add(name)                # placed here: follow_rebuilt leaves it alone
            for c in g.components:
                t = list(c.transformation)
                t[4] += round(d)
                c.transformation = tuple(t)
            g.width = adv
            continue
        put(font, name, moved(p, d), adv)


# ---------------------------------------------------------------- 4. tabular figures

TAB_SIDE = 36           # the widest figure's bearing in the tabular width (Area's 0 has 61 / 60 proportional)


def tabular(font):
    inks = {f: bounds(gp(font, f)) for f in FIGS}
    width = round(max(b[2] - b[0] for b in inks.values()) + 2 * TAB_SIDE)
    for f in FIGS:
        x0, _, x1, _ = inks[f]
        d = (width - (x1 - x0)) / 2 - x0
        compose(font, f + ".tf", [(f, round(d), 0)], width)
    return width


TNUM = """
feature tnum {
    sub [zero one two three four five six seven eight nine] by [zero.tf one.tf two.tf three.tf four.tf five.tf six.tf seven.tf eight.tf nine.tf];
} tnum;

feature pnum {
    sub [zero.tf one.tf two.tf three.tf four.tf five.tf six.tf seven.tf eight.tf nine.tf] by [zero one two three four five six seven eight nine];
} pnum;
"""


def features(font):
    t = font.features.text
    if "feature tnum" not in t:
        font.features.text = t + "\n" + TNUM


# ---------------------------------------------------------------- 5. new glyphs

# The single-storey g, 0.79 (owner, 2026-11-14, on 0.78's: "needs a lot of work ... the bottom of the g is flat").
# What was wrong: 0.77 cut q level at y = 2 to take its top, which sliced off the bowl's overshoot (it reaches -10):
# the bowl stood on a 132-unit flat. And the tail was j's narrow hook, ending 0.66 of the bowl's width left of the
# stem's right edge, where a single-storey g's tail runs under the whole bowl.
# Measured on the three faces that have the letter (tools/single_g.py: Serrif's ss02, Source Serif 4's and
# Literata's U+0261), each against its own q:
#   the bowl is q's, whole (width 0.996, 1.000, 1.000 of q's)
#   the tail ends 0.973, 0.972, 0.933 of the bowl's width left of the stem's right edge     mean 0.959
#   its lowest point lies 0.510, 0.529, 0.515 of that width from the same edge              mean 0.518
#   its depth is 1.043, 1.042, 1.060 of q's descender (Area's j: 1.040, kept)
# The letter is spliced point for point, no union: q's outline from the top of its stem round the bowl to the
# crotch, then j's tail from the stem's left edge round the ball and back up the right edge. The tail is j's own
# (stem, thickness at its lowest point, ball); only its reach changes: the ball moves left as one piece, the lowest
# points go to their share, and each curve's handles keep their share of the curve (a part scaled across its
# counter, as m's arches are; stems and the ball never scale). The same splice on the Bold's q and j makes the
# Bold's (bold.bold_font), so its bowl is the Bold q's and the two masters match point for point.
G_TAIL_END = 0.959
G_TAIL_LOW = 0.518
# 0.80 (owner, 2026-11-14, on 0.79's: "needs adjustments to the tail, its not very smooth, round, and looks off").
# What was wrong: the tail was still j's hook with its points slid sideways. Its inside ran level for 70 units and
# then turned into the ball in 41 units of height, and the ball sat as low as j's (top 0.187 of the x-height under
# the baseline; the references' 0.121, 0.158, 0.134), so the tail read as a flat tray with a knob on its end.
# The tail is its own part now, four quarter turns between five fixed places: the stem's two edges, the lowest
# point (outside at the descender's depth, inside one tail thickness above it), and the ball. Every quarter's
# handles are G_ROUND of their side (0.55, a quarter of an ellipse), so no stretch is level or straight.
#   the ball's top under the baseline, of the x-height: 0.121, 0.158, 0.134                 mean 0.138
#   the tail's thickness at its lowest point, of the round letters' hairline: 0.97, 1.00, 0.92   mean 0.963
# The ball itself is still j's, moved whole.
G_BALL_TOP_080 = 0.138
G_TAIL_THICK = 0.963
G_ROUND = 0.55
# 0.81 (owner, 2026-11-14, on 0.80's: "smoothing out and rounding out the arc on the descender").
# What was wrong, measured (curvecheck.py, tools/combs.py): the four quarters met at the lowest points with the
# curvature jumping 1.45 times outside and 1.38 inside, and the bottom was the flattest place on the tail: outside,
# radius 218 where it left the stem, 402 just left of the lowest point, then 65 at the ball. A round tail tightens
# from the stem to the ball and never opens out on the way. Two things change, both by rule:
#  1. The handles of the four curves are solved, not set to one share: inside and outside, from the stem's edge to
#     the ball, the curvature never falls (no flat), it is the same on both sides of the lowest point, and it
#     arrives at the ball at the ball's own curvature (`_round_tail`). Each handle stays within G_TENSION of its
#     side, inside the triangle.
#  2. The ball sits higher, 0.100 of the x-height under the baseline (0.80: 0.138). A tail that runs 217 units left
#     of its lowest point and rises only 118 to a ball at 0.138 cannot tighten evenly in one curve: its radius has to
#     go from about 400 to 45 in a quarter. At 0.100 the outside's radius stays between 216 and 273 from the stem
#     to past the lowest point, then tightens into the ball. The references by the same measure
#     (tools/tail_profile.py, top of the ball 0.07 x-height in from the tail's end): Serrif 0.023, Source Serif 4
#     0.164, Literata 0.144, mean 0.110; 0.100 is inside their range.
G_BALL_TOP = 0.100
G_TENSION = (0.30, 0.72)
# Along the weight axis (Source Serif 4 and Literata at 700, stems 159): the lowest point moves to 0.565, 0.554 of
# the bowl's width (mean 0.560), so the inside of a heavier tail stays a round quarter; the ball rises by the
# references' own change from 400 to 700 (Source Serif 4 0.158 to 0.120, Literata 0.134 to 0.120, mean 0.026 of
# the x-height), taken from the Regular's height. Both go with the stem, in a line from the Regular's values.
G_BALL_TOP_BOLD = G_BALL_TOP - 0.026
G_TAIL_LOW_BOLD = 0.560
G_STEMS = (78, 140)                # the Regular's and the Bold's lowercase stems, where the two pairs of values hold
# 0.81, round 2: three tails drawn by the same rules for the owner (img/081/gss02-variants.png), one in the font.
#   ball      the ball's top under the baseline, of the x-height
#   end       the tail's left end, of the bowl's width left of the stem's right edge
#   low       the lowest point, of the bowl's width left of the stem's right edge
#   thick     the stroke at the lowest point, of the round letters' hairline
G_TAIL_FORMS = {
    "080": dict(ball=0.138, end=G_TAIL_END, low=G_TAIL_LOW, thick=G_TAIL_THICK),
    "081": dict(ball=0.100, end=G_TAIL_END, low=G_TAIL_LOW, thick=G_TAIL_THICK),
    "A": dict(ball=0.030, end=G_TAIL_END, low="mid", thick=1.15, rise="ball"),
    "B": dict(ball=0.080, end=1.000, low="mid", thick=1.15, rise="ball"),
    "C": dict(ball=0.100, end=G_TAIL_END, low=0.470, thick=G_TAIL_THICK),
    # 0.81 (owner, 15 November, on "A": "0.80's tail is preferred: 0.81's is too long and too high, the ball rises too
    # far toward the bowl"). 0.80's proportions on A's construction: the ball's top back to 0.80's 0.138 of the
    # x-height under the baseline (the references' mean, above; the Bold by the same 0.026 change as before), the
    # tail's end where both had it (G_TAIL_END); A's half-ellipse and its solved handles kept, so the tail stays
    # curvature-continuous (curvecheck.py: Regular worst ratio 1.03, valley 10%). The lowest point stays half way to
    # the tail's end: at 0.80's share (G_TAIL_LOW) the half-ellipse's two quarters meet at 1.23 in the Regular and
    # 1.77 in the Bold.
    "D": dict(ball=G_BALL_TOP_080, end=G_TAIL_END, low="mid", thick=1.15, rise="ball"),
    # 0.82 (owner round 8, 16 November, comparing 0.80, the 0.81 tip and form D at 300 400 550 700: "the g from 0.80
    # is the best one. the new single story g is not smooth at all on the bottom right curve"). Form D's outside ran
    # straight down the stem to the ball's height (-115) and then turned in a quarter 158 wide and 69 tall: a flat
    # run and a tight corner. 0.80's construction is restored whole (`_tail_080`): four quarter turns between five
    # places, each handle G_ROUND (0.55) of its side; the outside leaves the stem at the baseline (`leave`, 0.80's j
    # as drawn: its outer stem edge ended 2 units up in the Regular and the Light, 3 in the Bold), so the lower right
    # is one quarter 255 wide and 235 tall; the inside leaves where j's inner stem edge ends; the lowest point at
    # 0.518 of the bowl's width (0.560 at the Bold stem); the ball's top 0.138 of the x-height under the baseline
    # (0.120 at the Bold stem), all as 0.80 had them. The ball is j's ball as the weight engine reads it (0.80's path:
    # in a master bold.bold_font passes this master's j from before the 0.81 tail rebuild). By the owner's choice
    # over curvecheck, which reads 1.38 to 1.65 at its nodes (curvecheck.EXPECTED).
    "E": dict(construction="080", ball=G_BALL_TOP_080, ball_bold=0.120, end=G_TAIL_END, low=G_TAIL_LOW,
              low_bold=G_TAIL_LOW_BOLD, thick=G_TAIL_THICK, leave=2),
}
G_TAIL_FORM = "E"


def _pts(c):
    return [(p.x, p.y, p.type, p.smooth) for p in c.points]


def _edge_top(P):
    """The upper end of the longest upright edge that runs upward (a stem's right side on these outlines)."""
    n = len(P)
    ups = [i for i in range(n) if P[i][2] == "line" and P[i - 1][2] and P[i - 1][0] == P[i][0] and P[i][1] > P[i - 1][1]]
    return max(ups, key=lambda i: P[i][1] - P[i - 1][1])


def o_hair(contours):
    """The round letters' hairline: o's thickness at its lowest point, from its point lists."""
    lows = sorted(min(p[1] for p in c) for c in contours)
    return lows[1] - lows[0]


def _curv(c, t):
    """Signed curvature of the cubic c = (p0, p1, p2, p3) at t."""
    u = 1 - t
    d1 = [3 * u * u * (c[1][i] - c[0][i]) + 6 * u * t * (c[2][i] - c[1][i]) + 3 * t * t * (c[3][i] - c[2][i]) for i in (0, 1)]
    d2 = [6 * u * (c[2][i] - 2 * c[1][i] + c[0][i]) + 6 * t * (c[3][i] - 2 * c[2][i] + c[1][i]) for i in (0, 1)]
    v = (d1[0] ** 2 + d1[1] ** 2) ** 1.5
    return (d1[0] * d2[1] - d1[1] * d2[0]) / v if v > 1e-9 else 0.0


def _round_tail(top, low, end, end_dir, end_k, inner):
    """Handle shares for a tail's two curves, from the stem's edge (top, its tangent straight down) round the lowest
    point (low, level) to end (the ball's side, outside; the neck, inside), arriving along end_dir (upward for the
    ball's side; the ball's own direction at the neck). The first curve is a quarter circle (its box is square, see
    single_g_points; both handles KAPPA). Returns ((top's, low's) of the first curve, (low's, end's) of the
    second): the second curve's shares, within G_TENSION, for which the curvature from top to end never falls (a
    tail tightens into its ball and never opens out), is equal on both sides of the lowest point, and meets end_k
    at the end (outside: the ball's curvature; inside, the neck, left free). A grid, then finer steps about the
    best: the same numbers give the same handles."""
    lo, hi = G_TENSION

    def curves(t):
        a, b, c, d = t
        c1 = (top[:2], (top[0], top[1] - a * (top[1] - low[1])), (low[0] + b * (top[0] - low[0]), low[1]), low[:2])
        if inner:
            r = d * (end[1] - low[1])
            p2 = (end[0] + end_dir[0] * r, end[1] + end_dir[1] * r)
        else:
            p2 = (end[0], end[1] - d * (end[1] - low[1]))
        c2 = (low[:2], (low[0] - c * (low[0] - end[0]), low[1]), p2, end[:2])
        return c1, c2

    def score(t):
        c1, c2 = curves((KAPPA, KAPPA) + tuple(t))
        ks = [abs(_curv(c1, i / 12)) for i in range(13)] + [abs(_curv(c2, i / 12)) for i in range(1, 13)]
        fall = sum(max(0.0, (a_ - b_) / a_) for a_, b_ in zip(ks, ks[1:]) if a_ > 1e-9)
        jump = abs(math.log(max(abs(_curv(c1, 1.0)), 1e-9) / max(abs(_curv(c2, 0.0)), 1e-9)))
        arrive = 0.0 if inner else 0.5 * abs(math.log(max(ks[-1], 1e-9) / max(abs(end_k), 1e-9)))
        return fall + jump + arrive

    grid = [lo + i * (hi - lo) / 16 for i in range(17)]
    best = min(((score(t), t) for t in itertools.product(grid, repeat=2)))
    step = (hi - lo) / 16
    while step > 0.004:
        improved = True
        while improved:
            improved = False
            for i in range(2):
                for dv in (-step, step):
                    t = list(best[1])
                    t[i] = min(hi, max(lo, t[i] + dv))
                    sc = score(tuple(t))
                    if sc < best[0] - 1e-9:
                        best, improved = (sc, tuple(t)), True
        step /= 2
    return (KAPPA, KAPPA), best[1]


def single_g_points(q_outer, q_counter, j_body, hair, form=None, least_white=None, ball_from=None):
    """The single-storey g's two contours from q's and j's point lists [(x, y, type, smooth)]. least_white (0.81, a
    master's white law): the ball rises towards the Bold by the references' change only as far as the white between
    it and the bowl above it, inside the one contour, keeps that much (ball_white); short of it, the ball stays
    lower by as little as holds it (steps of 0.001 of the x-height). ball_from (0.82, form E): another reading of
    the same j (a master's j before its tail was built again) whose ball's shape the tail takes."""
    pts = _single_g_points(q_outer, q_counter, j_body, hair, form, ball_from=ball_from)
    if least_white is None:
        return pts
    k = 0
    while ball_white(pts[0]) < least_white - 0.5 and k < 300:
        k += 1
        pts = _single_g_points(q_outer, q_counter, j_body, hair, form, lower=0.001 * k, ball_from=ball_from)
    return pts


def ball_white(outer, parts=None):
    """g.ss02's white between the tail's ball and the bowl above it, inside its one outer contour: the nearest
    approach between the ball's outline and the bowl's (q's upper part). parts: (first ball point, last ball point,
    first bowl point, last bowl point) in the contour; by default as _single_g_points lays them out."""
    import numpy as np
    import white as WHITE
    b0, b1, u0, u1 = parts or _BALL_PARTS[len(outer)]
    D = WHITE._dense(outer, 1.0)
    ball = np.array([d[:2] for d in D if b0 <= d[2] < b1])
    bowl = np.array([d[:2] for d in D if u0 <= d[2] < u1])
    d = np.hypot(ball[:, None, 0] - bowl[None, :, 0], ball[:, None, 1] - bowl[None, :, 1])
    return float(d.min())


_BALL_PARTS = {}


def _single_g_points(q_outer, q_counter, j_body, hair, form=None, lower=0.0, ball_from=None):
    # q: the stem's right edge is the upright line that reaches the x-height; the crotch is where the bowl's lower
    # stroke meets the stem's left edge
    n = len(q_outer)
    top = _edge_top(q_outer)
    stem_r = q_outer[top][0]
    crotch = next(i for i in range(top, top + n) if q_outer[i % n][2] and q_outer[(i + 1) % n][2] == "line"
                  and q_outer[(i + 1) % n][0] == q_outer[i % n][0] and q_outer[(i + 1) % n][1] < 0 and i != top)
    stem_l = q_outer[crotch % n][0]
    upper = [q_outer[i % n] for i in range(top, crotch + 1)]
    bowl_l = min(p[0] for p in upper if p[2])
    # j: from the stem's left edge below the baseline round the tail to the stem's right edge
    m = len(j_body)
    jr = _edge_top(j_body)
    j_r, j_l = j_body[jr][0], None
    start = next(i for i in range(jr, jr + m) if j_body[i % m][2] == "line" and j_body[i % m][1] < 0
                 and j_body[(i - 1) % m][0] == j_body[i % m][0])                         # the left edge's lower end
    j_l = j_body[start % m][0]
    assert abs((j_r - j_l) - (stem_r - stem_l)) <= 1, "q's and j's stems differ"
    tail = [list(j_body[i % m]) for i in range(start, jr + m)]                          # ends at the right edge's foot
    dx = stem_r - j_r
    for p in tail:
        p[0] += dx
    on = [i for i, p in enumerate(tail) if p[2]]
    assert len(on) == 7, "j's tail is not stem, inner low point, neck, top, left, outer low point, stem"
    start, neck, left, end = tail[0], on[2], on[4], tail[-1]
    xh = q_outer[top][1]
    bowl_w = stem_r - bowl_l
    depth = tail[on[5]][1]
    # the ball, whole: its left side to the tail's end, its top to its height under the baseline
    ball = [list(p) for p in tail[neck:left + 1]]
    tw = ((stem_r - stem_l) - G_STEMS[0]) / (G_STEMS[1] - G_STEMS[0])
    F = G_TAIL_FORMS[form or G_TAIL_FORM]
    if F.get("construction") == "080":
        if ball_from is not None:                     # the ball's shape from another reading of this master's j
            m2 = len(ball_from)
            jr2 = _edge_top(ball_from)
            s2 = next(i for i in range(jr2, jr2 + m2) if ball_from[i % m2][2] == "line" and ball_from[i % m2][1] < 0
                      and ball_from[(i - 1) % m2][0] == ball_from[i % m2][0])
            tb = [list(ball_from[i % m2]) for i in range(s2, jr2 + m2)]
            assert len(tb) == len(tail) and [bool(p[2]) for p in tb] == [bool(p[2]) for p in tail], "j's two readings differ"
            for k in range(neck, left + 1):
                tail[k] = [tail[neck][0] + tb[k][0] - tb[neck][0], tail[neck][1] + tb[k][1] - tb[neck][1]] + list(tb[k][2:])
        tail = _tail_080(F, tail, on, stem_r, bowl_w, xh, depth, hair, tw, lower)
        outer = [tuple(p) for p in tail[1:]] + upper + [tuple(tail[0])]
        _BALL_PARTS[len(outer)] = (5, 11, len(tail) - 1, len(tail) - 1 + len(upper) - 1)
        return [outer, list(q_counter)]
    ball_top = F["ball"] + tw * (G_BALL_TOP_BOLD - G_BALL_TOP) + lower
    tail_low = (F["low"] if F["low"] != "mid" else 0) + tw * (G_TAIL_LOW_BOLD - G_TAIL_LOW)
    bx = round(stem_r - F["end"] * bowl_w) - tail[left][0]
    by = round(-ball_top * xh) - tail[on[3]][1]
    for p in ball:
        p[0] += bx
        p[1] += by
    nk, lf = ball[0], ball[-1]
    low_x = round(stem_r - tail_low * bowl_w)
    if F["low"] == "mid":                                  # the lowest point half way between the stem and the tail's end
        low_x = round((stem_r + lf[0]) / 2 - tail_low * bowl_w)
    in_y = depth + round(F["thick"] * hair)
    # into the neck along the ball's own direction there, so the join is smooth
    after = ball[1]
    vx, vy = nk[0] - after[0], nk[1] - after[1]
    ln = math.hypot(vx, vy)
    in_low = (low_x, in_y, "curve", True)
    out_low = (low_x, depth, "curve", True)
    # the turn off the stem is a quarter circle on both edges: each edge's straight run ends one quarter's width
    # above its lowest point (0.80 ended both where j's do, so the outside's box was 255 wide and 235 tall and its
    # bottom the flattest place on the tail)
    if F.get("rise") == "ball":                            # a half-ellipse: the turn off the stem as tall as the rise
        end = (end[0], lf[1], "curve", end[3])            # to the ball, both edges leaving the stem at one height
        start = (start[0], lf[1], "line", start[3])
    else:
        start = (start[0], in_y + (start[0] - low_x), "line", start[3])
        end = (end[0], depth + (end[0] - low_x), "curve", end[3])
    ball_k = _curv((ball[-4][:2], ball[-3][:2], ball[-2][:2], ball[-1][:2]), 1.0)      # the ball at its left side
    neck_k = _curv((nk[:2], ball[1][:2], ball[2][:2], ball[3][:2]), 0.0)            # and where the inside meets it
    (t1, t2), (t3, t4) = _round_tail(start, in_low, nk, (vx / ln, vy / ln), neck_k, True)
    i1 = [(start[0], round(start[1] - t1 * (start[1] - in_y)), None, False),
          (round(low_x + t2 * (start[0] - low_x)), in_y, None, False)]
    reach = t4 * (nk[1] - in_y)
    i2 = [(round(low_x - t3 * (low_x - nk[0])), in_y, None, False),
          (round(nk[0] + vx / ln * reach), round(nk[1] + vy / ln * reach), None, False)]
    (u1, u2), (u3, u4) = _round_tail(end, out_low, lf, (0.0, 1.0), ball_k, False)
    o1 = [(lf[0], round(lf[1] - u4 * (lf[1] - depth)), None, False),
          (round(low_x - u3 * (low_x - lf[0])), depth, None, False)]
    o2 = [(round(low_x + u2 * (end[0] - low_x)), depth, None, False),
          (end[0], round(end[1] - u1 * (end[1] - depth)), None, False)]
    tail = ([tuple(start)] + i1 + [in_low] + i2 + [tuple(p) for p in ball] + o1 + [out_low] + o2 + [tuple(end)])
    outer = [tuple(p) for p in tail[1:]] + upper + [tuple(tail[0])]
    b0 = 5                                                  # tail[1:]: i1 (2), in_low, i2 (2), then the ball
    _BALL_PARTS[len(outer)] = (b0, b0 + len(ball) - 1, len(tail) - 1, len(tail) - 1 + len(upper) - 1)
    # contour order: ... tail's last point (the right edge's foot, a curve's end), q's stem top (line), q's bowl,
    # the crotch, then the tail's first point (line, down the left edge)
    return [outer, list(q_counter)]


def _tail_080(F, tail, on, stem_r, bowl_w, xh, depth, hair, tw, lower=0.0):
    """0.80's tail (form E, restored in owner round 8): j's tail points (stem's left edge round the ball to the
    right edge's foot, moved to q's stem) re-placed as 0.80's charset.single_g_points placed them: the ball whole,
    four quarter turns between five places, each handle G_ROUND of its side of the quarter's box."""
    start, neck, left = list(tail[0]), on[2], on[4]
    end = list(tail[-1])
    end[1] = F["leave"]                          # the outside leaves the stem where 0.80's j's did
    ball = [list(p) for p in tail[neck:left + 1]]
    ball_top = F["ball"] + tw * (F["ball_bold"] - F["ball"]) + lower
    tail_low = F["low"] + tw * (F["low_bold"] - F["low"])
    bx = round(stem_r - F["end"] * bowl_w) - tail[left][0]
    by = round(-ball_top * xh) - tail[on[3]][1]
    for p in ball:
        p[0] += bx
        p[1] += by
    nk, lf = ball[0], ball[-1]
    low_x = round(stem_r - tail_low * bowl_w)
    in_y = depth + round(F["thick"] * hair)
    K = G_ROUND

    def arc(p0, p1, upright_first):
        if upright_first:
            return [(p0[0], round(p0[1] + K * (p1[1] - p0[1])), None, False),
                    (round(p1[0] + K * (p0[0] - p1[0])), p1[1], None, False)]
        return [(round(p0[0] + K * (p1[0] - p0[0])), p0[1], None, False),
                (p1[0], round(p1[1] + K * (p0[1] - p1[1])), None, False)]

    after = ball[1]                              # into the neck along the ball's own direction there
    vx, vy = nk[0] - after[0], nk[1] - after[1]
    ln = math.hypot(vx, vy)
    reach = K * (nk[1] - in_y)
    in_low = (low_x, in_y, "curve", True)
    out_low = (low_x, depth, "curve", True)
    return ([tuple(start)] + arc(start, in_low, True) + [in_low,
            (round(low_x + K * (nk[0] - low_x)), in_y, None, False),
            (round(nk[0] + vx / ln * reach), round(nk[1] + vy / ln * reach), None, False)]
            + [tuple(p) for p in ball] + arc(lf, out_low, True) + [out_low] + arc(out_low, end, False) + [tuple(end)])


def single_g(font, layer=None, form=None, name="g.ss02", least_white=None, ball_from=None):
    """g.ss02 from this font's q and j (see above). Returns its box. It keeps q's advance and kerns as q does.
    form: a key of G_TAIL_FORMS (default G_TAIL_FORM); name: the glyph to write (the variants' sheet uses others)."""
    from ufoLib2.objects import Contour, Point
    src = layer if layer is not None else font
    q, j = src["q"], src["j"]
    q_outer = max(q.contours, key=lambda c: len(c.points))
    q_counter = min(q.contours, key=lambda c: len(c.points))
    j_body = max(j.contours, key=lambda c: len(c.points))       # j without its dot
    g = src[name] if name in src else src.newGlyph(name)
    g.clearContours()
    hair = o_hair([_pts(c) for c in src["o"].contours])
    for pts in single_g_points(_pts(q_outer), _pts(q_counter), _pts(j_body), hair, form, least_white, ball_from):
        c = Contour()
        c.points = [Point(x, y, t, smooth=s) for x, y, t, s in pts]
        g.contours.append(c)
    g.width = q.width
    g.unicodes = []
    for gname, members in font.groups.items():
        if gname.startswith("public.kern") and "q" in members and name not in members:
            members.append(name)
    return bounds(gp(src, name)) if layer is None else None


def spine_across(path):
    """An S's spine across itself: the shortest straight cut of ink through the middle of the letter's box."""
    b = bounds(path)
    xc, yc = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
    best = 9e9
    for k in range(-20, 21):
        a = math.radians(90 + k * 3)
        dx, dy = math.cos(a), math.sin(a)
        d = 0
        for sg in (1, -1):
            t = 0
            while t < 200:
                x, y = xc + sg * t * dx, yc + sg * t * dy
                if not any(l <= x <= r for l, r in scan_h(path, y)):
                    break
                t += 1
            d += t
        best = min(best, d)
    return best


# 0.83 (Regular pass, symbols 1): one arrow. Its length is twice the maths axis (626, 1.20 x-heights; it was 0.80 of
# the maths' advance, 490, 0.94 x-height, the references 1.21 to 1.32), so the vertical arrows, centred on the axis
# as every arrow is, stand on the baseline. One head for every arrow: two arms at 45 degrees off the shaft (the
# slanted arrows, turned 45 degrees, then have one arm level and one upright; the level arrows' head was 99 degrees
# and the slanted ones' 90), each arm's centreline ARROW_ARM long (the head's outer span 0.60 of the arrow, as
# before). Every arrow is this one turned or turned over, at its full length (the slanted ones were 0.92 of it).
ARROW_LENGTH = 2.0                 # of the maths axis
ARROW_ARM = 240                    # an arm's centreline, from the shaft's end to its free end
ARROW_HALF = 45.0                  # degrees off the shaft


def arrows(font, m, adv):
    """Arrows on the maths' axis and weight: the shaft is the minus, the head two strokes of the same weight meeting
    in a point (Serrif's open head; Georgia Pro has none)."""
    w = m.math
    L = ARROW_LENGTH * m.math_y
    cy = m.math_y

    def east(length=L, both=False):
        """0.77 (owner, 2026-11-14: "does uni21b5 arrow tip need to be fixed?"). The head is one outline: the two
        strokes' outer edges meet in the point, their inner edges in the crotch (a mitre), nothing left to a union.
        0.83 (Regular pass, item B): the shaft stops at the head's crotch and the head is solid from there to its
        point. The two-headed arrow is one shaft from crotch to crotch with this head at both ends, the left one the
        right one turned over about the arrow's middle. 0.83 (symbols 1): the arm ARROW_ARM long at ARROW_HALF
        degrees off the shaft, for every arrow."""
        x0, x1 = 0.0, length
        qx = x1 - w * 0.5                                  # the arms' centrelines meet on the axis here
        a_ = math.radians(ARROW_HALF)
        px, py = qx - ARROW_ARM * math.cos(a_), ARROW_ARM * math.sin(a_)
        L_ = math.hypot(qx - px, py)
        dx_, dy_ = (qx - px) / L_, -py / L_                # along the stroke, towards the point
        nx_, ny_ = -dy_ * w / 2, dx_ * w / 2               # to its outer side
        ou, iu = (px + nx_, py + ny_), (px - nx_, py - ny_)
        apex = ou[0] + dx_ * (ou[1] / -dy_)                # where each edge crosses the axis
        crotch = iu[0] + dx_ * (iu[1] / -dy_)
        sh = x1 - apex                                     # the point stays where the arrow ended
        pts = [(apex + sh, 0), (ou[0] + sh, ou[1]), (iu[0] + sh, iu[1]), (crotch + sh, 0), (iu[0] + sh, -iu[1]), (ou[0] + sh, -ou[1])]
        head_ = shape([(x, cy + y) for x, y in pts])
        if not both:
            shaft = rect(x0, cy - w / 2, crotch + sh + 1, cy + w / 2)
            return union(shaft, head_)
        left_ = moved(head_, length, 0, -1, 1)             # the same head turned over about the middle
        shaft = rect(length - (crotch + sh) - 1, cy - w / 2, crotch + sh + 1, cy + w / 2)
        return union(shaft, head_, left_)

    # 0.83 (Regular pass, symbols 2): the arrows of the gentle taper (B, signs.tarrow), on the same skeleton (the length,
    # the 45-degree arm, the axis): every stroke thins to the hairline where it joins (the head's point, where the
    # shaft runs in) and widens to a round end where it is free (TAPER_END of the plain stroke: 60), the point cut
    # flat across its bisector (TAPER_FLAT of the hairline). One contour each; the masters build it again at their
    # own hairline and plain stroke (bold.construction_signs)
    e = east()
    side = 44
    eb = bounds(e)
    crotch_x = max((sp[0] for sp in scan_h(e, cy + w / 2 + 2)), default=eb[2])
    depth = eb[2] - crotch_x

    def tap(**k):
        d = dict(L=L, arm=ARROW_ARM, half=ARROW_HALF, w0=m.hair, w1=TAPER_END * w, flat=TAPER_FLAT)
        d.update(k)
        return dict(build="tarrow", params=d)
    put_built(font, "arrowright", tap(at=[L / 2, cy]), 0, [0x2192], lsb=side, rsb=side)
    put_built(font, "arrowleft", tap(at=[L / 2, cy], rot=180), 0, [0x2190], lsb=side, rsb=side)
    put_built(font, "arrowboth", tap(L=L + depth, kind="both", shaft=SHAFT_BOTH * m.hair, at=[(L + depth) / 2, cy]), 0, [0x2194],
              lsb=side, rsb=side)
    up = built_path(tap(at=[0, cy], rot=90))
    vside = (adv - (bounds(up)[2] - bounds(up)[0])) / 2          # vertical arrows: centred in the maths' width
    for name, u, rot in (("arrowup", 0x2191, 90), ("arrowdown", 0x2193, -90)):
        put_built(font, name, tap(at=[0, cy], rot=rot), 0, [u], lsb=vside, rsb=vside)
    # 0.83 (Regular pass, consistency 0a): the up-down arrow keeps the up arrow's extent (its length, 2 axes: from the
    # baseline to 626, centred on the axis), its heads the shared head; at the two-headed level arrow's length (728) it
    # hung 51 under the baseline
    put_built(font, "arrowupdn", tap(L=L, kind="both", shaft=SHAFT_BOTH * m.hair, at=[0, cy], rot=90), 0, [0x2195],
              lsb=vside, rsb=vside)
    for name, u, rot in (("uni2197", 0x2197, 45), ("uni2196", 0x2196, 135), ("uni2199", 0x2199, -135),
                         ("uni2198", 0x2198, -45)):
        # 0.84 (placement): the ink, not the arrow's middle, on the axis (the head is wider than the shaft's end:
        # the box stood 4 off, up for the two pointing up)
        put_built(font, name, tap(at=[0, cy - _built_mid(tap(at=[0, cy], rot=rot), cy)], rot=rot), 0, [u],
                  lsb=side * 0.8, rsb=side * 0.8)


TAPER_END = 60 / 52                # the free end's round cap across, over the plain stroke (the study's B: 1.15)
TAPER_FLAT = 0.42 * 78.0 / 43.0    # a head's point cut flat, over the hairline: 0.84 (item 5) the letters' vertex
                                   # flat (v's 33, signs.LETTER_FLAT), 0.762 of the hairline; it was 0.5 (21.5)
SHAFT_BOTH = 1.0                   # 0.83 (consistency 0a): a shaft between two heads, one width, of the hairline (43)
TAB_BAR = 57 / 52                  # 0.83 (consistency 0b): the tab arrows' bar, one width, of the plain stroke (A's upright 57)


def maths(font, m, adv):
    w = m.math
    cy = m.math_y
    # owner round 8 (0.82): < and <= are constructions (signs.chevron, chevron_bar): arms of the minus's weight
    # meeting in an upright flat outside and a point inside, both ends cut upright at one x, the point on the maths
    # axis; > and >= are them turned over (MIRRORS). Until 0.81 < was Libre Baskerville's drawing (arms 49.2 and
    # 48.3 across, a 66-unit flat at the point, its middle 2 under the axis) and <= that drawing squashed to 0.82 of
    # its height (arms 41 across beside a 52 bar). The box is the old one's: x 98 to 514, 244 each side of the axis
    # 0.83 (symbols 1): every maths operator is the minus's width (94 to 518 in the maths' advance, the + box) and
    # its ink centred on the maths axis; < was 98 to 514 and <= stood 26 over the axis (its ink 75 to 603)
    x0_, x1_ = 94, 518
    put_built(font, "less", dict(build="chevron", params=dict(t=w, x0=x0_, x1=x1_, cy=cy, hh=244)), adv, [0x3C])
    le_cy, le_bar = 405, 101                          # the chevron over its bar as drawn, then the whole on the axis
    probe = dict(build="chevron_bar", params=dict(t=w, x0=x0_, x1=x1_, cy=le_cy, hh=200, bar_x0=x0_, bar_y=le_bar))
    import signs as SG
    ys_ = [q[1] for q in SG.corners(probe)]
    dy_ = cy - (min(ys_) + max(ys_)) / 2
    le = dict(build="chevron_bar", params=dict(t=w, x0=x0_, x1=x1_, cy=le_cy + dy_, hh=200, bar_x0=x0_, bar_y=le_bar + dy_))
    put_built(font, "lessequal", le, adv, [0x2264])
    put(font, "greaterequal", moved(gp(font, "lessequal"), adv, 0, -1, 1), adv, [0x2265])
    # the multiplication sign: two strokes of the minus's weight crossing square on the maths axis, arms equal (it
    # was Libre Baskerville's, 49.1 and 45.6 across); its ink box the old one's, 346 across
    put_built(font, "multiply", dict(build="times", params=dict(t=w, c=[adv / 2, cy], arm=173 * math.sqrt(2) - w / 2)),
              adv, [0xD7])
    # the division sign's dots stand over the bar's middle (they stood 3 right of it)
    g = font["divide"]
    if len(g.contours) == 3:
        boxes = [(min(q.x for q in c.points), max(q.x for q in c.points)) for c in g.contours]
        bar_c = max(range(3), key=lambda k: boxes[k][1] - boxes[k][0])
        bx = (boxes[bar_c][0] + boxes[bar_c][1]) / 2
        for k, c in enumerate(g.contours):
            if k != bar_c:
                dx = round(bx - (boxes[k][0] + boxes[k][1]) / 2)
                for q in c.points:
                    q.x += dx
    # 0.83 (symbols 1): the tilde, the almost-equal sign and infinity are one stroke each along a smooth centreline
    # (signs.tilde, signs.infinity), the signs' damped upright stress (level 47, upright 57: the plain stroke's 52 on
    # average; the letters' stress, much damped). ~ was 349 wide (0.67 of the + box's 424) with a 25-unit thinnest
    # place and curvature jumps of 1.54; ~ is one period of a sine wave from inflection to inflection, the + box wide,
    # on the maths axis; the almost-equal sign is two of it on the equals sign's two lines; infinity was two o's
    # (vertical stress, 248 tall) and is a lemniscate the + box tall
    tilde_signs(font, m, adv)
    caret_sign(font, m)
    # root (owner round 8, 0.82: signs.radical)
    # root (owner round 8, 0.82: signs.radical): a thin lead-in rising into the top of the thick downstroke, a thin
    # upstroke from the foot to the top, a level overbar, one outline with a corner at each junction (it was a union
    # of a bar, a vee and a rectangle: a jag where the lead-in met the downstroke). Thin, lead-in and bar the minus's
    # weight; the thick its 1.44 (Area's 0.96 stem over the minus), at every weight
    put_built(font, "radical", dict(build="radical", params=dict(
        thin=w, bar=w, thick=m.stem * 0.96, B=[150, 372], V=[262, -12], T=[448, CAP_HEIGHT + 30],
        top=CAP_HEIGHT + 30, right=640, hook=[[60, 318], [156, 378]],
        flat=VERTEX_CAP * m.stem)), 0, [0x221A], lsb=30, rsb=10)   # 0.84 (item 5): v's flat, 0.42 of the stem (33)
    # 0.83 (symbols 1): the radical's foot is a vertex (the face's vertex rule: a flat 0.42 of the thick stroke
    # across the bisector, 31.5); it was a sharp point
    # increment: a triangle with A's weights, thin left (A's thin diagonal, the capital bar), thick right (the capital
    # stem), a thin base (0.9 of the bar); owner round 8 (0.82): each side's inner edge parallel to its outer edge at
    # its weight, corners where the inner edges meet (signs.inset_edges; the inner corners were set by hand and the
    # sides ran 52 to 76 and 69 to 97 across). In the masters it is a capital (bold.HINTS), as A is
    import signs as SG
    tri = [(0, 0), (560, 0), (280, CAP_HEIGHT)]
    inn = SG.inset_edges(tri, [m.cap_bar * 0.9, m.cap_stem, m.cap_bar])
    # 0.84 (Regular pass 2, item 5): each outer corner a vertex as A's apex: a flat 0.42 of the capital stem (36)
    # across its bisector, its inner corners points (it was sharp at all three, 43 and 69 degrees)
    put(font, "increment", op(shape(vertex_flats(tri, VERTEX_CAP * m.cap_stem)), shape(inn), pathops.PathOp.DIFFERENCE),
        0, [0x2206], lsb=24, rsb=24)
    # product and sum: Pi from H's stems under one bar; Sigma is Area's Esh capital (the Greek letter's shape)
    H = gp(font, "H")
    hs = scan_h(H, 200)
    keep = op(H, rect(hs[0][1], 150, hs[1][0], 600), pathops.PathOp.DIFFERENCE)     # no crossbar
    # 0.81 round 3: the stems run 2 units into the bar, so the two are one outline (they were cut at 60 under the
    # cap height, 4 short of the bar's underside: a 4-unit sliver of white that closed at 675). Georgia Pro draws
    # its product as one contour, Source Serif 4 as stems overlapping the bar: the parts touch.
    # 0.84 (Regular pass 2, item 4): the bar the capitals' arm (balance.CAP_ARM 46: E's and T's top arms, the
    # summation's bars); it was 1.15 of H's crossbar (56), a number with no derivation
    import balance as _BAL
    bar_lo = CAP_HEIGHT - _BAL.CAP_ARM
    keep = op(keep, rect(-100, bar_lo + 2, 2000, 1000), pathops.PathOp.DIFFERENCE)   # no head serifs
    top_bar = rect(hs[0][0] - 0.7 * m.cap_stem, bar_lo, hs[1][1] + 0.7 * m.cap_stem, CAP_HEIGHT)
    Pi = union(keep, top_bar)
    pb = bounds(Pi)                                    # 0.74: narrowed between its stems (it was scaled: stems 74)
    put(font, "product", narrow(Pi, hs[0][1] + 90, round(0.14 * (pb[2] - pb[0]))), 0, [0x220F], lsb=30, rsb=30)
    # 0.83 (Regular pass, item A): an n-ary operator hangs below the baseline as the summation does (sigma.KIND: -0.25
    # to 1.00 of the cap; Georgia Pro and PP Kyoto's product -0.29 / -0.19): its stems run down to -178, the feet whole
    g_ = font["product"]
    for c_ in g_.contours:
        for q_ in c_.points:
            if q_.y < CAP_HEIGHT / 2:
                q_.y -= round(0.25 * CAP_HEIGHT)
    if "uni01A9" in font or "Esh" in font:
        put(font, "summation", gp(font, "Esh"), 0, [0x2211], lsb=30, rsb=30)
        sum_vertex(font["summation"], m.cap_stem)
    # integral: Area's esh, on the figures' height
    put(font, "integral", gp(font, "esh"), 0, [0x222B], lsb=20, rsb=20)
    # partial: Area's 6 turned to face left, its bowl on the baseline
    six = gp(font, "six")
    put(font, "partialdiff", moved(six, 0, 0, -1, 1), 0, [0x2202], lsb=50, rsb=50)
    # lozenge
    lw, lh = 0.66 * adv, CAP_HEIGHT + 20
    # owner round 8 (0.82): one stroke all round, the minus's (signs.frame); its inner outline was set by hand, the
    # sides running 43 to 57 across
    put_built(font, "lozenge", dict(build="frame", params=dict(t=w, stress=list(SIGN_A), soft=True,
                                                               outer=[[lw / 2, -10], [lw, lh / 2 - 10],
                                                                      [lw / 2, lh - 10], [0, lh / 2 - 10]])),
              0, [0x25CA], lsb=30, rsb=30)
    # pi: two stems under a bar at the x-height, the right one ending in a short turn
    s = m.stem
    left = bar((150, -2), (165, X_HEIGHT - 10), s * 0.92)
    right = union(rect(360, 60, 360 + s, X_HEIGHT - 10),
                  shape([(360, 60), ("c", (360, 10), (380, -10), (430, -10)), (480, -10), (480, 26),
                         ("c", (450, 26), (360 + s, 36), (360 + s, 70))]))
    topb = rect(40, X_HEIGHT - m.low_bar * 1.1, 560, X_HEIGHT)
    put(font, "pi", union(left, right, topb), 0, [0x03C0], lsb=24, rsb=24)
    # Omega: O open at the foot, each end turned out into a foot on the baseline
    O = gp(font, "O")
    x0, y0, x1, y1 = bounds(O)
    cx = (x0 + x1) / 2
    gapw = 0.22 * (x1 - x0)
    cutO = op(O, rect(cx - gapw, -100, cx + gapw, 0.30 * CAP_HEIGHT), pathops.PathOp.DIFFERENCE)
    cutO = op(cutO, rect(-100, -100, 2000, 0.13 * CAP_HEIGHT), pathops.PathOp.DIFFERENCE)
    cutO = moved(cutO, 0, 0.13 * CAP_HEIGHT * 0.6, 1, 0.92, 0, (0, CAP_HEIGHT))
    feet = union(rect(x0 + 0.08 * (x1 - x0), 0, cx - gapw + m.cap_stem * 0.3, m.cap_bar),
                 rect(cx + gapw - m.cap_stem * 0.3, 0, x1 - 0.08 * (x1 - x0), m.cap_bar))
    legs = union(rect(cx - gapw - m.cap_stem * 0.85, 0, cx - gapw + 2, 0.36 * CAP_HEIGHT),
                 rect(cx + gapw - 2, 0, cx + gapw + m.cap_stem * 0.85, 0.36 * CAP_HEIGHT))
    Om = union(cutO, feet, legs)
    put(font, "Omega", Om, 0, [0x03A9, 0x2126], lsb=30, rsb=30)


def vertex_flats(P, w):
    """A convex polygon's corners each cut by a flat w across its bisector (where the two edges are w apart)."""
    n = len(P)
    out = []
    for i in range(n):
        a, p, b = P[i - 1], P[i], P[(i + 1) % n]
        ua = ((a[0] - p[0]) / math.dist(a, p), (a[1] - p[1]) / math.dist(a, p))
        ub = ((b[0] - p[0]) / math.dist(b, p), (b[1] - p[1]) / math.dist(b, p))
        half = math.acos(max(-1.0, min(1.0, ua[0] * ub[0] + ua[1] * ub[1]))) / 2
        d = w / 2 / math.sin(half)                    # along each edge to the flat's end
        out += [(p[0] + ua[0] * d, p[1] + ua[1] * d), (p[0] + ub[0] * d, p[1] + ub[1] * d)]
    return out


def sum_vertex(g, stem):
    """owner round 8 (0.82): the summation's point, where its two diagonals' outer edges meet, is a capital's vertex
    (parts.VERTEX): a flat 0.42 of the capital stem across the bisector, where the two edges are that far apart. Esh's
    union left four nodes there within 31 units, a zigzag (464,355 463,379 466,380 461,386)."""
    import signs as SG
    for c in g.contours:
        P = c.points
        n = len(P)
        ys = [q.y for q in P]
        band = [q for q in P if q.type and 0.3 <= (q.y - min(ys)) / (max(ys) - min(ys)) <= 0.7]
        if not band:
            continue
        xm = max(q.x for q in band)                      # the point: the rightmost node of the middle band
        run = [i for i, q in enumerate(P) if q.type == "line" and q.x >= xm - 12
               and 0.3 <= (q.y - min(ys)) / (max(ys) - min(ys)) <= 0.7]
        if len(run) < 2:
            continue
        i0, i1 = run[0], run[-1]
        if (i1 - i0) != len(run) - 1:
            continue
        a, b = P[(i0 - 1) % n], P[(i1 + 1) % n]
        if a.type is None or b.type != "line":
            continue
        L1 = ((a.x, a.y), SG.unit((a.x, a.y), (P[i0].x, P[i0].y)))
        L2 = ((b.x, b.y), SG.unit((b.x, b.y), (P[i1].x, P[i1].y)))
        o = SG.meet(L1, L2)
        e1, e2 = (-L1[1][0], -L1[1][1]), (-L2[1][0], -L2[1][1])
        bis = SG.unit((0, 0), (e1[0] + e2[0], e1[1] + e2[1]))
        half = math.acos(e1[0] * e2[0] + e1[1] * e2[1]) / 2
        d = VERTEX_CAP * stem / (2 * math.tan(half))
        cut = ((o[0] + bis[0] * d, o[1] + bis[1] * d), SG.left(bis))
        f1, f2 = SG.meet(L1, cut), SG.meet(L2, cut)
        from ufoLib2.objects import Point
        new = [Point(round(f1[0]), round(f1[1]), "line"), Point(round(f2[0]), round(f2[1]), "line")]
        c.points[:] = [q for k, q in enumerate(P) if k < i0] + new + [q for k, q in enumerate(P) if k > i1]
        return f"flat {math.dist(f1, f2):.0f} at ({o[0]:.0f}, {o[1]:.0f})"


VERTEX_CAP = 0.42                 # parts.VERTEX


SIGN_LO, SIGN_HI = 47, 57         # the signs' damped stress: a stroke running level, upright (mean 52, the plain stroke)
EQUAL_GAP = 154                    # the equals sign's two bars, centre to centre (as drawn)
TILDE_AMP = 54                     # the tilde's wave, its centreline's height over the axis (slope 40 degrees at its inflections)
INF_WIDTH = 1.85                   # infinity's ink width over its height (the references 1.58 to 2.2); 0.82 to symbols 2
# 0.83 (Regular pass, consistency 0c): infinity sized as an operator's colour, not the + box's full height (784 x 424
# read oversized beside + = <): its height INF_H of the + box, its width INF_W of the minus's
TILDE_K = 1.04                     # 0.83 (consistency 0d): ~'s mean width along its centreline was 49.9 against the
                                   # minus's 52 (thinnest 47 over the crests; ink 23,799 over a 494-unit centreline):
                                   # the damped stress scaled so the mean is the plain stroke's (48.9 level, 59.3 upright)
INF_H = 0.78
# 0.84 (Regular pass 2, item 2; the owner: ~ and ≈ "too sharp angled, not smooth enough"): the wave set by its slope at
# the inflections, TILDE_SLOPE (it was 40 to 45 degrees: amplitude 54 on a 370 wave, crest radius 1.2 strokes); at 32
# the crests' radius is about 2 strokes. Its weight: the damped stress scaled so the mean width along the centreline is
# the plain stroke's (52), read on the wave itself (`tilde_k`), so ~ has the minus's colour at any slope
TILDE_SLOPE = 32.0
# 0.84 (Regular pass 2, second pass; the owner: "still near 45 degree diagonals, not gentle waves. the inside seems a
# bit sharp of an angle still. the negative space isn't even"): measured on 0.84a, 31.7 degrees at the inflections,
# the inside edges' radius 34 at crest and trough where a parallel of the centreline gives 45 to 50 (the stress, laid
# across a tight crest, tightened the inside), a 2.95-degree break where the straight end run met the wave, and the
# ink 2.4 a side short of the + box (soft_ends trimmed the end corners after the box was solved). Now: the wave 22.5
# degrees at its inflections (20, 22.5 and 25 set in text beside - + =; build/owner9/pass2/tilde), both edges the
# centreline's parallels (signs.wave_sides: each quarter G2 at its two ends), the ends the wave's own inflections cut
# square (no run), the box solved on the softened ink. TILDE_STRESS: the share of the signs' damped stress (47 level,
# 57 upright) laid on, symmetric about the centreline; 0, a stroke of one width, so the edges are true parallels
TILDE_SLOPE = 22.5
TILDE_STRESS = 0.0


def tilde_k(slope, mean=None, lo=None, hi=None):
    """The stress's scale so the stroke's mean width along a sine centreline of this inflection slope is the plain
    stroke's ((SIGN_LO + SIGN_HI) / 2, the minus's 52); lo, hi the stress's level and upright widths (the signs')."""
    lo, hi = (SIGN_LO if lo is None else lo), (SIGN_HI if hi is None else hi)
    mean = mean or (SIGN_LO + SIGN_HI) / 2
    k = math.tan(math.radians(slope))
    n, tot, ln = 720, 0.0, 0.0
    for i in range(n):
        t = (i + 0.5) / n
        dy = k * math.cos(2 * math.pi * t)               # dy/dx of y = k / (2 pi) sin (2 pi t), x = t
        ds = math.sqrt(1 + dy * dy)
        tot += (lo + (hi - lo) * dy * dy / (1 + dy * dy)) * ds
        ln += ds
    return mean / (tot / ln)


INF_W = 1.50
POINTED = 0.60                     # 0.83 (consistency 0d): the pointed shapes' area over the circle's (symbols 1: 0.70)


def built_path(info):
    import signs as SG
    a, b, c = SG.build(info)
    p = union(*[shape(P) for P in a])
    if b:
        p = op(p, union(*[shape(P) for P in b]), pathops.PathOp.DIFFERENCE)
    if c:
        p = union(p, *[shape(P) for P in c])
    return p


def tilde_signs(font, m, adv):
    """0.83 (symbols 1): ~ and its kin, from their centrelines (signs.tilde, signs.infinity). ~'s ink is the minus's
    width, the wave on the maths axis; the almost-equal sign its two tildes on the equals sign's lines (axis plus and
    minus half EQUAL_GAP); infinity's ink the + box's height (the minus's width, the + is square) and INF_WIDTH of it
    across, on the axis."""
    w, cy = m.math, m.math_y
    mb = bounds(gp(font, "minus"))
    want = mb[2] - mb[0]

    mid_ = (SIGN_LO + SIGN_HI) / 2
    lo_ = mid_ + (SIGN_LO - mid_) * TILDE_STRESS
    hi_ = mid_ + (SIGN_HI - mid_) * TILDE_STRESS
    K_ = tilde_k(TILDE_SLOPE, lo=lo_, hi=hi_)

    def tilde_info(cys, x0, x1):
        return dict(build="tilde", params=dict(x0=x0, x1=x1, cys=cys, amp=TILDE_AMP, slope=TILDE_SLOPE,
                                               lo=lo_ * K_, hi=hi_ * K_, run=0.0, parallel=True))
    x0, x1 = mb[0], mb[2]
    for _ in range(30):                                  # the centreline's ends so the ink, its end corners softened
        b = bounds(built_path(tilde_info([cy], x0, x1)))   # (its corners softened by the construction) is the minus's width
        d = (want - (b[2] - b[0])) / 2
        if abs(d) < 0.01:
            break
        x0, x1 = x0 - d, x1 + d
    _info = tilde_info

    def tilde_info(cys, x0, x1):                         # 0.84 pass 2: the stored recipe puts its points on whole units
        d_ = _info(cys, x0, x1)                          # itself (signs.whole_units), keeping its curvature
        d_["params"]["whole"] = True
        return d_
    # kept as constructions (put_built): each master builds the same wave at its own stroke (the engine read the
    # wave's near-straight quarters and gave them an inflection between the masters)
    put_built(font, "asciitilde", tilde_info([cy], x0, x1), 0, [0x7E],
              lsb=(font["asciitilde"].width - want) / 2, rsb=(font["asciitilde"].width - want) / 2)
    put_built(font, "approxequal", tilde_info([cy - EQUAL_GAP / 2, cy + EQUAL_GAP / 2], x0, x1), 0, [0x2248],
              lsb=(adv - want) / 2, rsb=(adv - want) / 2)
    H = INF_H * want                                     # its height, a share of the + box's (consistency 0c)
    b_ = (H - SIGN_LO) / 2                               # the centreline's half height (thin over the tops)
    a_ = (INF_W * want - SIGN_HI) / 2                    # its half width (thick at the outer ends), a share of the minus's
    p = built_path(dict(build="infinity", params=dict(a=a_, b=b_, cx=0, cy=cy, lo=SIGN_LO, hi=SIGN_HI)))
    put(font, "infinity", p, 0, [0x221E], lsb=34, rsb=34)


def caret_sign(font, m):
    """0.83 (symbols 1): ^ (U+005E) is the less-than sign's chevron turned to point up, at its angle and with its
    upright flat at the point, 0.60 of the x-height tall, its point at the cap height (it was 0.35 x-height tall, on
    the maths axis, its arms tapering 35 to 66); ends cut level."""
    import signs as SG
    w = m.math
    hgt = 0.60 * X_HEIGHT
    half = hgt * 244 / (518 - 94)                        # <'s arms' rise over their run, as the chevron is solved
    info = dict(build="chevron", params=dict(t=w, x0=0, x1=hgt, cy=0, hh=half))
    p = built_path(info)
    p = moved(p, 0, 0, 1, 1, -90, (0, 0))                # the point to the top
    b = bounds(p)
    p = moved(p, -(b[0] + b[2]) / 2, CAP_HEIGHT - b[3])
    put(font, "asciicircum", p, 0, [0x5E], lsb=60, rsb=60)


def primes(font, m):
    """Primes: Area's straight quote, leaning like Georgia Pro's and Serrif's."""
    q = gp(font, "quotesingle")
    x0, y0, x1, y1 = bounds(q)
    p = moved(q, 0, 0, 1, 1, -14, ((x0 + x1) / 2, y0))
    put(font, "minute", p, 0, [0x2032], lsb=40, rsb=40)
    w = bounds(p)[2] - bounds(p)[0]
    put(font, "second", union(p, moved(p, w + 40)), 0, [0x2033], lsb=40, rsb=40)


def currencies(font, m):
    # 0.84 (pass 2, leftovers): every currency bar one value, the capitals' hairline (STROKE_UP 47); they were H's
    # crossbar (49) here; the tenge keeps T's arm (46), its lower bar is T's own
    cb, lb = CURRENCY_BAR, CURRENCY_BAR
    S = m.cap_stem
    # ruble: P with a second bar across its stem below the bowl
    P = gp(font, "P")
    ps = _stem_x(P, 200)
    STRUCK["uni20BD"] = ("P", [rect(ps[0] - 0.9 * S, 0.24 * CAP_HEIGHT - cb / 2, ps[1] + 1.7 * S, 0.24 * CAP_HEIGHT + cb / 2)])
    put(font, "uni20BD", union(P, rect(ps[0] - 0.9 * S, 0.24 * CAP_HEIGHT - cb / 2, ps[1] + 1.7 * S,
                                       0.24 * CAP_HEIGHT + cb / 2)), font["P"].width, [0x20BD])
    # lira (Turkish): L's stem crossed by two rising bars, as the sign is drawn
    L = gp(font, "L")
    ls = _stem_x(L, 300)
    cx = (ls[0] + ls[1]) / 2
    bars2 = union(bar((cx - 1.0 * S, 0.36 * CAP_HEIGHT), (cx + 1.6 * S, 0.50 * CAP_HEIGHT), cb),
                  bar((cx - 1.0 * S, 0.52 * CAP_HEIGHT), (cx + 1.6 * S, 0.66 * CAP_HEIGHT), cb))
    STRUCK["uni20BA"] = ("L", [bar((cx - 1.0 * S, 0.36 * CAP_HEIGHT), (cx + 1.6 * S, 0.50 * CAP_HEIGHT), cb),
                               bar((cx - 1.0 * S, 0.52 * CAP_HEIGHT), (cx + 1.6 * S, 0.66 * CAP_HEIGHT), cb)])
    put(font, "uni20BA", union(L, bars2), font["L"].width, [0x20BA])
    # won: W with two level bars across
    W = gp(font, "W")
    x0, _, x1, _ = bounds(W)
    STRUCK["uni20A9"] = ("W", [rect(x0 - 10, 0.42 * CAP_HEIGHT - cb / 2, x1 + 10, 0.42 * CAP_HEIGHT + cb / 2),
                               rect(x0 - 10, 0.62 * CAP_HEIGHT - cb / 2, x1 + 10, 0.62 * CAP_HEIGHT + cb / 2)])
    put(font, "uni20A9", union(W, rect(x0 - 10, 0.42 * CAP_HEIGHT - cb / 2, x1 + 10, 0.42 * CAP_HEIGHT + cb / 2),
                               rect(x0 - 10, 0.62 * CAP_HEIGHT - cb / 2, x1 + 10, 0.62 * CAP_HEIGHT + cb / 2)),
        font["W"].width, [0x20A9])
    # dong: d-bar over a bar under the baseline
    db = gp(font, "dcroat")
    x0, _, x1, _ = bounds(db)
    STRUCK["dong"] = ("dcroat", [rect(x0 + 20, -150 - lb, x1 - 20, -150)])
    put(font, "dong", union(db, rect(x0 + 20, -150 - lb, x1 - 20, -150)), font["d"].width, [0x20AB])
    # rupee: a level top bar, a second bar under it, and the bowl's stroke turning into a long diagonal leg
    r = CURRENCY_BAR
    w = 0.78 * CAP_HEIGHT
    top = CAP_HEIGHT
    bowl = ring(0.40 * w, 0.73 * CAP_HEIGHT, 0.24 * w, 0.27 * CAP_HEIGHT * 0.62, S * 0.95, r)
    bowl = op(bowl, rect(-100, 0.73 * CAP_HEIGHT, 0.40 * w, 2000), pathops.PathOp.DIFFERENCE)
    bowl = op(bowl, rect(-100, -100, 0.40 * w, 0.73 * CAP_HEIGHT), pathops.PathOp.DIFFERENCE)
    p = union(rect(0, top - r, w, top), rect(0, 0.80 * CAP_HEIGHT - r, w, 0.80 * CAP_HEIGHT),
              bowl, rect(0, 0.73 * CAP_HEIGHT - 0.27 * CAP_HEIGHT * 0.62, 0.40 * w + 2,
                         0.73 * CAP_HEIGHT - 0.27 * CAP_HEIGHT * 0.62 + r),
              bar((0.18 * w, 0.73 * CAP_HEIGHT - 0.27 * CAP_HEIGHT * 0.62 + r / 2), (0.70 * w, 0), S * 0.95))
    p = op(p, rect(-100, -100, 2000, 0), pathops.PathOp.DIFFERENCE)
    put(font, "uni20B9", p, 0, [0x20B9], lsb=36, rsb=36)
    # sheqel: two interlocking hooks, an arch from the left stem over to a leg that stops short of the baseline,
    # and a cup from a short inner stem round to the right stem
    sw = 0.80 * m.stem
    h = 0.70 * CAP_HEIGHT
    wd = 600
    xs = [0, 0.30 * wd, 0.70 * wd - sw, wd - sw]
    arch = union(rect(xs[0], 0, xs[0] + sw, h), rect(xs[0], h - sw, xs[2] + sw, h), rect(xs[2], 0.30 * h, xs[2] + sw, h))
    cup = union(rect(xs[1], 0, xs[3] + sw, sw), rect(xs[3], 0, xs[3] + sw, h), rect(xs[1], 0, xs[1] + sw, 0.70 * h))
    put(font, "uni20AA", union(arch, cup), 0, [0x20AA], lsb=40, rsb=40)


SPACES = {   # name: (unicode, advance or a glyph whose advance it takes)
    "uni2002": (0x2002, 500), "uni2003": (0x2003, 1000), "uni2004": (0x2004, 333), "uni2005": (0x2005, 250),
    "uni2006": (0x2006, 167), "uni2007": (0x2007, "zero.tf"), "uni2008": (0x2008, "period"),
    "uni2009": (0x2009, 200), "uni200A": (0x200A, 100), "uni202F": (0x202F, 200), "uni205F": (0x205F, 222),
}


def spaces(font):
    for name, (u, adv) in SPACES.items():
        if name not in font:
            g = font.newGlyph(name)
        else:
            g = font[name]
            g.clearContours()
            g.clearComponents()
        g.unicodes = [u]
        g.width = font[adv].width if isinstance(adv, str) else adv
    w = font["zero.tf"].width
    put(font, "figuredash", rect(30, DASH_Y - DASH * 39, w - 30, DASH_Y + DASH * 39), w, [0x2012])


SIGN_A = (47, 57)                 # the A signs' level and upright strokes (the study's A: 0.90 and 1.10 plain strokes)


def interface(font, m, adv):
    """Symbols on keys and in menus, on the figures' height and the maths' weight."""
    w = m.math
    h = 0.80 * CAP_HEIGHT
    # 0.83 (symbols 1): the key box. Every interface sign and geometric shape is centred on the maths axis, as the
    # arrows and the operators are (one axis for every sign that is not a letter or punctuation); the key signs share
    # one box h tall (0.80 cap, 570). They stood on the baseline (command, option, shift, caps lock), at 285 (the erase
    # keys), at 343 (the circles, squares, triangles, diamond and stars), at 350 (the check); option was 0.86 h tall
    ky0 = m.math_y - h / 2
    import signs as SG
    # 0.83 (symbols 2): the check and the cross key of the gentle taper (B: signs.tcheck, tcross), from the hairline
    # at the vertex or crossing to round ends of TAPER_END; the check was 1.25 plain strokes all along, the cross 1.1
    tw_ = dict(w0=m.hair, w1=TAPER_END * w, flat=TAPER_FLAT)
    chk = dict(build="tcheck", params=dict(tw_, start=[40, 300], vertex=[185, 120], end=[480, 600]))
    cys_ = [q[1] for q in SG.corners(chk)]
    dy_ = m.math_y - (min(cys_) + max(cys_)) / 2
    chk["params"] = dict(tw_, start=[40, 300 + dy_], vertex=[185, 120 + dy_], end=[480, 600 + dy_])
    # A: the closed and boxed key signs (barely perceptible contrast): uprights SIGN_A[1], level strokes SIGN_A[0],
    # slanted ones between by the sine squared of their slope, outer corners soft as the letters' cut ends
    A_ = list(SIGN_A)
    # check and cross
    # owner round 8 (0.82): one construction (signs.check): the short stroke into the vertex and the long one out of
    # it, 1.25 of the minus's weight both, ends cut square, the vertex a flat outside and a point inside (it was two
    # overlapping bars: the short one's foot stood out past the long one in a notch)
    put_built(font, "uni2713", chk, 0, [0x2713], lsb=40, rsb=40)
    c = 270
    put_built(font, "uni2715", dict(build="tcross", params=dict(tw_, c=[c, m.math_y],
                                                                    arm=(197 - TAPER_END * w / 2) * math.sqrt(2) + TAPER_END * w / 2)),
              0, [0x2715], lsb=50, rsb=50)
    # circles: black circle the bullet's sibling at the figures' size, white circle its outline
    R = 0.40 * CAP_HEIGHT
    put(font, "uni25CF", ellipse(0, m.math_y, R, R), 0, [0x25CF], lsb=50, rsb=50)
    # the white circle, A: the circle outside, its sides SIGN_A[1] and top and bottom SIGN_A[0] across (the counter
    # an ellipse, as the o's)
    put(font, "uni25CB", ring(0, m.math_y, R, R, A_[1], A_[0]), 0, [0x25CB], lsb=50, rsb=50)
    # command: a square whose sides run on past its corners and curl into four loops (three quarters of a circle)
    qc, rc = 104, 80            # the square's and the loops' centre lines
    parts = []
    for k in (-1, 1):
        parts.append(rect(-(qc + rc), k * qc - A_[0] / 2, qc + rc, k * qc + A_[0] / 2))      # level sides, run on
        parts.append(rect(k * qc - A_[1] / 2, -(qc + rc), k * qc + A_[1] / 2, qc + rc))      # upright sides, run on
    for sx in (-1, 1):
        for sy in (-1, 1):
            cx, cy = sx * (qc + rc), sy * (qc + rc)
            loop = ring(cx, cy, rc + A_[1] / 2, rc + A_[0] / 2, A_[1], A_[0])
            facing = rect(min(cx, sx * qc), min(cy, sy * qc), max(cx, sx * qc), max(cy, sy * qc))
            parts.append(op(loop, facing, pathops.PathOp.DIFFERENCE))
    cmd = union(*parts)
    put(font, "uni2318", moved(cmd, 0, m.math_y), 0, [0x2318], lsb=50, rsb=50)
    # option: a level stroke, a falling diagonal, a level stroke; a short level stroke at the right top
    W = 520
    t = h
    put_built(font, "uni2325", dict(build="option", params=dict(stress=A_, W=W, top=t, y0=ky0, x1=0.29 * W, x2=0.71 * W,
                                                                 x3=0.56 * W)), 0, [0x2325], lsb=50, rsb=50)
    # shift: an outlined arrow pointing up (owner round 8, 0.82: signs.frame, one stroke all round; the inner outline
    # was set by hand, its head's flanges 32 across beside sides of 52)
    sw, sh = 520, h
    shift_out = [[x, y + ky0] for x, y in [[sw / 2, sh], [sw, sh * 0.48], [sw * 0.72, sh * 0.48], [sw * 0.72, 0],
                                            [sw * 0.28, 0], [sw * 0.28, sh * 0.48], [0, sh * 0.48]]]
    k = w
    d_ = _built_mid(dict(build="frame", params=dict(t=w, outer=shift_out, stress=A_, soft=True)), m.math_y)
    shift_out = [[x, y - d_] for x, y in shift_out]          # 0.84 (placement): the ink on the axis (it stood 1.75 low)
    put_built(font, "uni21E7", dict(build="frame", params=dict(t=w, outer=shift_out, stress=A_, soft=True)), 0, [0x21E7], lsb=50, rsb=50)
    # caps lock: the shift arrow, its shaft shorter by a fifth of its height (nothing scaled), over a level bar of the
    # plain stroke under the shaft, 39 below its foot
    by_ = round(0.20 * sh)
    caps_out = [[x, y if y > ky0 + 0.5 else ky0 + by_] for x, y in shift_out]
    put_built(font, "uni21EA", dict(build="frame", params=dict(t=w, outer=caps_out, stress=A_, soft=True,
                                                               bar=dict(x0=sw * 0.28, x1=sw * 0.72, gap=by_ - w))),
              0, [0x21EA], lsb=50, rsb=50)
    # erase to the left (owner round 8, 0.82: signs.erase): a frame of one stroke all round, its inner outline a
    # true inset of the outer with a sharp inner point (the inner point was set 1.9 strokes in and the slanted sides
    # ran 52 to 73 across), the cross centred in the box part. U+2326 is it turned over (MIRRORS)
    th_ = h * 0.80
    put_built(font, "uni232B", dict(build="erase", params=dict(t=w, stress=A_, soft=True, tw=700, th=th_, y0=m.math_y - th_ / 2, shoulder=0.30 * 700,
                                                               arm=th_ * 0.22 * math.sqrt(2))), 0, [0x232B], lsb=50, rsb=50)


# 0.84 (Regular pass 3, the owner's visual notes, item 8: "Æ should have a larger A, the balance/width of the A and E
# should be more or less equal"). The A half (A's left leg, its crossbar and foot, cut at the apex) was 326 wide against
# the E half's 522 (its stem to its arms' farthest end): 0.62. The A half now reaches AE_BALANCE of the E half: its leg
# leans out about the apex (every point above the foot moved left by its height's share of the way down from the
# apex, the foot serif with the leg's bottom whole; what lies right of the leg stretched about the apex, so the
# crossbar runs on to the E's stem), the leg's outer edge moved out a little more so the leg keeps its thickness
# across at the new lean (its level width times cos of the old lean over cos of the new); the E stays. æ is a and e joined at a's stem (no such fault: left).
AE_BALANCE = 0.9      # "more or less equal": at 1.0 the leg leant 36 degrees, an italic stroke beside upright E (looked at)
AE_FOOT = 30            # under this height the A half moves whole (the foot serif; its brackets lean with the leg: at 100
                        # the inner bracket met the steeper leg with a corner, curvecheck infinite)


def ae_wide(A_cut, E_part, apex_x, e_stem_x):
    """A_cut widened as the rule above: (new path, shift that puts it back left of the apex)."""
    from fontTools.pens.filterPen import FilterPen
    a0, _, _, ytop = bounds(A_cut)
    _, _, e1, _ = bounds(E_part)
    a_half, e_half = apex_x - a0, e1 - e_stem_x
    d = AE_BALANCE * e_half - a_half
    if d <= 1:
        return A_cut, 0.0
    # the leg's lean before and after, read on its leftmost span's middle at two heights
    y1, y2 = AE_FOOT + 40, ytop - 200
    c1, c2 = [sum(scan_h(A_cut, y)[0]) / 2 for y in (y1, y2)]
    w_h = scan_h(A_cut, (y1 + y2) / 2)[0]
    w_h = w_h[1] - w_h[0]
    f = lambda y: min(1.0, max(0.0, (ytop - y) / (ytop - AE_FOOT)))      # noqa: E731
    run0 = c2 - c1
    run1 = run0 + d * (f(y1) - f(y2))
    phi0, phi1 = math.atan2(abs(run0), y2 - y1), math.atan2(abs(run1), y2 - y1)
    e = w_h * (math.cos(phi0) / math.cos(phi1) - 1)

    # the leg's two edges as lines (read under the crossbar and over it, where the leftmost span is the leg alone)
    ya, yb = AE_FOOT + 40, ytop - 250
    (oa, ia), (ob, ib) = scan_h(A_cut, ya)[0], scan_h(A_cut, yb)[0]
    edge = lambda p, q, y: p + (q - p) * (y - ya) / (yb - ya)          # noqa: E731

    def mapx(x, y):
        sp = (edge(oa, ob, y), edge(ia, ib, y))
        if x >= apex_x - 1 and abs(x - sp[1]) < 3 and y > AE_FOOT:
            # the counter's top corner, where the leg's inner edge meets the stem's line: slid down the new inner edge
            # to where it meets that line again (bisection on the height)
            lo_, hi_ = AE_FOOT, y
            for _ in range(40):
                mid = (lo_ + hi_) / 2
                if edge(ia, ib, mid) - d * f(mid) < x:
                    lo_ = mid
                else:
                    hi_ = mid
            return x, lo_
        if x > sp[1] + 1.0 and y > AE_FOOT:
            # right of the leg (the crossbar, the counter, the cut by the apex): stretched about the apex, nothing at
            # or right of it moves
            k = max(0.0, (apex_x - x) / max(apex_x - sp[1], 1e-6))
            return x - d * f(y) * min(1.0, k), y
        outer = x < (sp[0] + sp[1]) / 2 and y > AE_FOOT
        return x - d * f(y) - (e * f(y) if outer else 0.0), y

    class _P(FilterPen):
        def moveTo(self, p): self._outPen.moveTo(mapx(*p))
        def lineTo(self, p): self._outPen.lineTo(mapx(*p))
        def curveTo(self, *ps): self._outPen.curveTo(*[mapx(*p) for p in ps])
        def qCurveTo(self, *ps): self._outPen.qCurveTo(*[mapx(*p) if p else p for p in ps])
    out = pathops.Path()
    A_cut.draw(_P(out.getPen()))
    out = op(out, out)                          # simplified
    return out, d


def diphthongs(font, m):
    """ae and oe: the e's left stroke is the a's stem or the o's right stroke. AE and OE: E's stem takes the place of
    A's right leg or O's right side, without E's serifs on that side."""
    a, e, o = gp(font, "a"), gp(font, "e"), gp(font, "o")
    a_st = [s for s in scan_h(a, 260)][-1]                  # a's stem
    e_x0 = bounds(e)[0]
    dx = a_st[0] - e_x0 + 4
    a_cut = op(a, union(rect(a_st[0] + 30, -100, 2000, 2000), rect(a_st[0] - 6, -100, 2000, 140)),
               pathops.PathOp.DIFFERENCE)
    put(font, "ae", union(a_cut, moved(e, dx)), dx + font["e"].width)
    o_r = scan_h(o, 260)[-1]
    dx = o_r[0] - e_x0
    o_cut = op(o, rect(o_r[0] + 20, -100, 2000, 2000), pathops.PathOp.DIFFERENCE)
    put(font, "oe", union(o_cut, moved(e, dx)), dx + font["e"].width)
    A, E, O = gp(font, "A"), gp(font, "E"), gp(font, "O")
    es = _stem_x(E, 300)
    E_noserif = op(E, union(rect(-100, CAP_HEIGHT - 80, es[0], 1000)), pathops.PathOp.DIFFERENCE)
    apex = scan_h(A, CAP_HEIGHT - 40)[0]                      # the apex near the top
    dx = apex[0] - es[0] + 8
    A_cut = op(A, rect(apex[0] + 30, -100, 2000, 2000), pathops.PathOp.DIFFERENCE)
    A_cut, d_ = ae_wide(A_cut, E_noserif, apex[0], es[0])
    dx += d_
    put(font, "AE", union(moved(A_cut, d_), moved(E_noserif, dx)), dx + font["E"].width)
    E_bare = op(E, union(rect(-100, CAP_HEIGHT - 80, es[0], 1000), rect(-100, -100, es[0], 80)),
                pathops.PathOp.DIFFERENCE)
    ox0, _, ox1, _ = bounds(O)
    xs = [x for x in range(int((ox0 + ox1) / 2), int(ox1)) if max(t for _, t in scan_v(O, x)) <= CAP_HEIGHT]
    xj = xs[0] if xs else (ox0 + ox1) / 2                      # where O's top comes down to the cap height
    O_cut = op(O, rect(xj + 24, -100, 2000, 2000), pathops.PathOp.DIFFERENCE)
    dx = xj - es[0]
    put(font, "OE", union(O_cut, moved(E_bare, dx)), dx + font["E"].width)
    for name, l, r in (("ae", "a", "e"), ("oe", "o", "e"), ("AE", "A", "E"), ("OE", "O", "E")):
        kern_like(font, name, l, r)


# The ogonek letters that were Libre Baskerville's own drawings (a e i u E; A I O U o were already components), and
# l with a middle dot: Area's letter and the mark, by anchor. e, i and u had no ogonek anchor: e's hangs from the bowl a
# little right of its bottom, i's under the stem, u's under the right stem's foot (as A I U and the references).
OGONEK_AT = {"e": ("bottom", 0.09, 10), "i": ("bottom", 0.06, 10), "u": (None, 0, 10)}


def ogonek_letters(font):
    og = next(a for a in font["ogonek"].anchors if a.name == "_ogonek")
    for base, name in (("a", "aogonek"), ("e", "eogonek"), ("i", "iogonek"), ("u", "uogonek"), ("E", "Eogonek")):
        g = font[base]
        anc = next((a for a in g.anchors if a.name == "ogonek"), None)
        if anc is None:
            ref, k, dy = OGONEK_AT.get(base, ("bottom", 0.10, 10))
            if ref is None:                                          # u: the right stem's centre
                st = scan_h(gp(font, base), 200)[-1]
                x = (st[0] + st[1]) / 2 + 8
            else:
                b = next(a for a in g.anchors if a.name == ref)
                x = b.x + k * g.width
            g.appendAnchor({"name": "ogonek", "x": round(x), "y": 4 + dy})
            anc = g.anchors[-1]
        u = list(font[name].unicodes)
        compose(font, name, [(base, 0, 0), ("ogonek", round(anc.x - og.x), round(anc.y - og.y))], g.width, u)
    # l with a middle dot: the dot keeps its distance from the stem (90 units) and its height
    l = gp(font, "l")
    st = _stem_x(l, 300)
    pc = bounds(gp(font, "periodcentered"))
    dx = st[1] + 90 - pc[0]
    compose(font, "ldot", [("l", 0, 0), ("periodcentered", round(dx), 0)], round(font["l"].width + 61), [0x0140])


def letters_extra(font):
    """n preceded by apostrophe (deprecated but in Latin Extended-A), and sound recording copyright."""
    if not any(0x02BB in g.unicodes for g in font):                 # turned comma (okina), English auxiliary
        compose(font, "uni02BB", [("quoteleft", 0, 0)], font["quoteleft"].width, [0x02BB])
    apos = next((g.name for g in font if 0x02BC in g.unicodes), None)    # 0.84 (placement): ʼ is ’
    if apos is not None:
        compose(font, apos, [("quoteright", 0, 0)], font["quoteright"].width, [0x02BC])
    compose(font, "napostrophe", [("quoteright", 0, 0), ("n", font["quoteright"].width - 30, 0)],
            font["quoteright"].width - 30 + font["n"].width, [0x0149])
    c = gp(font, "copyright")
    x0, y0, x1, y1 = bounds(c)
    ring_only = op(c, ellipse((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 * 0.80, (y1 - y0) / 2 * 0.80),
                   pathops.PathOp.DIFFERENCE)
    P = gp(font, "P")
    k = 0.48 * (y1 - y0) / CAP_HEIGHT
    Ps = moved(P, 0, 0, k)
    px0, py0, px1, py1 = bounds(Ps)
    Ps = moved(Ps, (x0 + x1) / 2 - (px0 + px1) / 2, (y0 + y1) / 2 - (py0 + py1) / 2)
    put(font, "uni2117", union(ring_only, Ps), font["copyright"].width, [0x2117])
    CLEAN.lighten(font, ["uni2117"], -2.0 * (1 - k))


# ---------------------------------------------------------------- letters that are a letter plus a part (0.65)
# eng and mu kept Libre Baskerville's drawings (its own arch, a join cut flat, a tapered descender): every rule since
# had passed them by. They are Area's n and u now, so they carry the same arch, join and stems.
ENG_CUT = 110           # n's right stem is cut here, above its foot's bracket; j's stem and tail go on below
MU_DESC = 0.86          # mu's descender in p's (Georgia Pro 0.84, Serrif 0.88), cut level


def eng_mu(font):
    n, j, u, pp = gp(font, "n"), gp(font, "j"), gp(font, "u"), gp(font, "p")
    r0, r1 = scan_h(n, 200)[1]
    body = op(n, rect(r0 - 75, -60, r1 + 140, ENG_CUT), pathops.PathOp.DIFFERENCE)
    j0 = _stem_x(j, 200)[0]
    tail = op(j, rect(-1000, -1000, 2000, ENG_CUT + 1), pathops.PathOp.INTERSECTION)
    put(font, "eng", union(body, moved(tail, r0 - j0)), font["n"].width)
    l0, l1 = _stem_x(u, 300)
    deep = bounds(pp)[1] * MU_DESC
    mu = union(u, rect(l0, deep, l1, 200))
    for name in ("mu", "micro"):
        if name in font:
            put(font, name, mu, font["u"].width)


# ---------------------------------------------------------------- Vietnamese (0.48)
# Vietnamese adds two marks (hook above, horn), four horned letters and 134 letters with a tone mark, many of them
# with two marks. Measured in Area's own accents: the accents are about 50 units thick at their heaviest and 150 tall
# (106 in the capital forms). Placement follows the common practice in Vietnamese type: a tone mark that meets a
# circumflex (acute, grave, hook above) sits beside it at its upper right; a tilde, and every tone over a breve, sits
# above it; the dot below goes under the letter as on its own.

# 0.71: the side stroke 50 > 58 and 46 > 52 (top 32 > 36, 30 > 34). The hook was 0.66 of the acute's weight; the five
# faces measured with Vietnamese hold 0.77 to 0.97. 0.75 is what its size carries with the counter still open (36).
# 0.74: the capital form is 124 tall: at 52 its counter closed to a 76-square-unit scrap (found by verify.py), so it
# keeps 46 and 30. A hook's side stroke leaves at least 9 units of counter each side of its centre line.
HOOK = {"": (628, 172, 58, 36), ".case": (775, 124, 46, 30)}   # bottom, height, side stroke, top stroke


def hook_above(font):
    """Hook above: the top of a question mark in small, an open curve over a short upright tail, its free end round
    like Area's other ends (ball terminals)."""
    for suf, (y0, h, ws, wt) in HOOK.items():
        rx = 0.44 * h
        ry = 0.34 * h
        cx, cy = rx, y0 + h - ry
        arc = ring(cx, cy, rx, ry, ws, wt)
        arc = op(arc, rect(-100, -100, cx, cy), pathops.PathOp.DIFFERENCE)        # open at the lower left
        ball = ellipse(ws / 2, cy, ws / 2, ws / 2)                                 # the free end, round
        tail = rect(cx - wt * 0.15, y0, cx + wt * 0.85, cy - ry + wt)
        p = union(arc, ball, tail)
        name = "hookabovecomb" + suf
        g = put(font, name, p, 0, [0x0309] if not suf else [])
        g.clearAnchors()
        g.appendAnchor({"name": "_top", "x": round(cx + wt * 0.35), "y": 632 + MARK_DROP if not suf else 763})
        g.appendAnchor({"name": "top", "x": round(cx + wt * 0.35), "y": round(y0 + h + 25)})
        font.lib.setdefault("public.openTypeCategories", {})[name] = "mark"


def _horn(S, C, T, w0, w1, rb):
    """A tapered stroke from S (inside the letter) through the pull of C to a round end at T."""
    def unit(a, b):
        d = math.hypot(b[0] - a[0], b[1] - a[1])
        return ((b[0] - a[0]) / d, (b[1] - a[1]) / d)
    t0, t1 = unit(S, C), unit(C, T)
    n0, n1 = (-t0[1], t0[0]), (-t1[1], t1[0])
    side = []
    for sgn in (1, -1):
        a = (S[0] + sgn * n0[0] * w0 / 2, S[1] + sgn * n0[1] * w0 / 2)
        b = (T[0] + sgn * n1[0] * w1 / 2, T[1] + sgn * n1[1] * w1 / 2)
        c = (C[0] + sgn * (n0[0] + n1[0]) / 2 * (w0 + w1) / 4, C[1] + sgn * (n0[1] + n1[1]) / 2 * (w0 + w1) / 4)
        side.append((a, (a[0] + 2 / 3 * (c[0] - a[0]), a[1] + 2 / 3 * (c[1] - a[1])),
                     (b[0] + 2 / 3 * (c[0] - b[0]), b[1] + 2 / 3 * (c[1] - b[1])), b))
    (a0, h1, h2, b0), (a1, k1, k2, b1) = side
    body = shape([a0, ("c", h1, h2, b0), b1, ("c", k2, k1, a1)])
    return union(body, ellipse(T[0], T[1], rb, rb))


# Horn geometry per letter, in units from the letter's own points: S where it leaves the letter (inside the stroke),
# C the pull (it goes out to the right first, then up), T the round end, stroke widths and the end's radius.
HORNS = {   # Georgia Pro's horns end 1.20 x-heights up (1.14 cap heights), 0.6-0.8 stems right of the letter's ink: a short
    # thick spur leaving the letter's upper right, rising, tapering into a round end (no neck)
    "o": ("ohorn", 0x01A1, lambda b, st: ((b[2] - 34, 462), (b[2] + 10, 500), (b[2] + 24, 624 - 25)), 66, 50, 25),
    "u": ("uhorn", 0x01B0, lambda b, st: ((st[1] - 26, 470), (st[1] + 46, 492), (st[1] + 66, 624 - 25)), 66, 50, 25),
    "O": ("Ohorn", 0x01A0, lambda b, st: ((b[2] - 44, 640), (b[2] + 8, 690), (b[2] + 16, 812 - 29)), 74, 58, 29),
    "U": ("Uhorn", 0x01AF, lambda b, st: ((st[1] - 28, 672), (st[1] + 60, 694), (st[1] + 84, 812 - 29)), 74, 58, 29),
}


def horns(font):
    for base, (name, u, geo, w0, w1, rb) in HORNS.items():
        p = gp(font, base)
        b = bounds(p)
        st = scan_h(p, 300)[-1]                      # the right stem (u U) or the bowl's right side (o O)
        S, C, T = geo(b, st)
        horn = _horn(S, C, T, w0, w1, rb)
        g = put(font, name, union(p, horn), font[base].width, [u])
        g.clearAnchors()
        for a in font[base].anchors:
            g.appendAnchor({"name": a.name, "x": a.x, "y": a.y})
        right = T[0] + rb
        g.width = round(max(font[base].width, right + 20))
        if base == "o":                               # the combining horn: the part outside the o, on its anchor
            mark = op(horn, p, pathops.PathOp.DIFFERENCE)
            tr = next(a for a in font["o"].anchors if a.name == "topright")
            m = put(font, "horncomb", mark, 0, [0x031B])
            m.clearAnchors()
            m.appendAnchor({"name": "_topright", "x": tr.x, "y": tr.y})
            font.lib.setdefault("public.openTypeCategories", {})["horncomb"] = "mark"
        kern_like(font, name, base, base)


TONE = {"\u0301": "acutecomb", "\u0300": "gravecomb", "\u0309": "hookabovecomb", "\u0303": "tildecomb",
        "\u0302": "circumflexcomb", "\u0306": "brevecomb", "\u0323": "dotbelowcomb"}
BASES = {"a": "a", "e": "e", "i": "idotless", "o": "o", "u": "u", "y": "y", "A": "A", "E": "E", "I": "I", "O": "O",
         "U": "U", "Y": "Y", "\u01a1": "ohorn", "\u01b0": "uhorn", "\u01a0": "Ohorn", "\u01af": "Uhorn"}
BESIDE = 0.30           # a tone beside a circumflex: its left edge this share of the circumflex's width right of centre
BESIDE_DROP = 0.12      # and its foot this share of the circumflex's height below the circumflex's top
STACK_GAP = 13          # a mark above another: this much white between them (0.75: the face's own minimum,
                        # spacing.MIN_GAP; 22 until then). It takes 9 units off the tallest Vietnamese capitals


def _anchor(g, name):
    return next(((a.x, a.y) for a in g.anchors if a.name == name), None)


def vietnamese(font):
    import unicodedata
    cps = [c for c in range(0x1EA0, 0x1EFA)] + [0x01A0, 0x01A1, 0x01AF, 0x01B0]
    made = 0
    for cp in cps:
        old = next((g.name for g in font if cp in g.unicodes), None)
        if old and old != "uni%04X" % cp:
            continue                                                 # already in the font (composed by Libre Baskerville)
        ch = unicodedata.normalize("NFD", chr(cp))
        base_ch, marks = ch[0], list(ch[1:])
        if not marks or cp in (0x01A0, 0x01A1, 0x01AF, 0x01B0):
            continue
        if "\u031b" in marks:                                        # horn: the horned letter is the base
            base_ch = {"o": "\u01a1", "u": "\u01b0", "O": "\u01a0", "U": "\u01af"}[base_ch]
            marks.remove("\u031b")
        upper = base_ch.isupper()
        suf = ".case" if upper else ""
        base = BASES[base_ch]
        bg = font[base]
        parts = [(base, 0, 0)]
        top = _anchor(bg, "top")
        ink = bounds(gp(font, base))
        bottom = _anchor(bg, "bottom") or ((ink[0] + ink[2]) / 2, 4)
        prev = None                                                  # the mark already above, and its ink box
        for mk in marks:
            mname = TONE[mk]
            if mname == "dotbelowcomb":                              # 0.84: one dot below under both cases
                mg = font[mname]
                ma = _anchor(mg, "_bottom")
                parts.append((mg.name, round(bottom[0] - ma[0]), round(bottom[1] - ma[1]) if upper else 0))
                continue
            mg = font[mname + suf] if (mname + suf) in font else font[mname]
            ma = _anchor(mg, "_top")
            mb = bounds(gp(font, mg.name))
            if prev is None:
                dx, dy = top[0] - ma[0], top[1] - ma[1]      # by anchor in both cases (0.71: MARK_DROP)
            elif prev[0].startswith("circumflex") and mname == "gravecomb":
                # 0.71: the grave is the acute turned over, so it meets the circumflex on the other side, its foot
                # toward the peak. At the acute's place its foot pointed away and it stood 100 units off (the acute
                # 31; five faces with Vietnamese keep 15 to 67). Source Serif 4 and Newsreader put it here.
                pb = prev[1]
                dx = (pb[0] + pb[2]) / 2 - BESIDE * (pb[2] - pb[0]) - mb[2]
                dy = pb[3] - BESIDE_DROP * (pb[3] - pb[1]) - mb[1]
            elif prev[0].startswith("circumflex") and mname != "tildecomb":
                pb = prev[1]
                dx = (pb[0] + pb[2]) / 2 + BESIDE * (pb[2] - pb[0]) - mb[0]
                dy = pb[3] - BESIDE_DROP * (pb[3] - pb[1]) - mb[1]
            else:                                                    # stacked above the first mark, centred on it
                pb = prev[1]
                dx = (pb[0] + pb[2]) / 2 - (mb[0] + mb[2]) / 2
                dy = pb[3] + STACK_GAP - mb[1]
            parts.append((mg.name, round(dx), round(dy)))
            prev = (mname, (mb[0] + dx, mb[1] + dy, mb[2] + dx, mb[3] + dy))
        name = "uni%04X" % cp
        compose(font, name, parts, bg.width, [cp])
        g = font[name]
        for a in bg.anchors:
            g.appendAnchor({"name": a.name, "x": a.x, "y": a.y})
        made += 1
    return made


# ---------------------------------------------------------------- composites and anchors follow the rebuilt glyphs

def _ink_cx(font, name):
    b = bounds(gp(font, name))
    return (b[0] + b[2]) / 2


def snapshot(font):
    return {g.name: (g.width, _ink_cx(font, g.name)) for g in font if g.contours}


def follow_rebuilt(font, before):
    """An accented letter is its base plus marks at fixed offsets, made for the base Libre Baskerville drew. When this
    module redraws a base (dotless i and j were 46 and 26 units narrower, O-slash, ae, AE), each composite on it takes
    the new advance and its marks move with the base's ink centre; the base's own anchors move with it too."""
    cats = font.lib.get("public.openTypeCategories", {})
    moved_by = {}
    for name in REBUILT:
        if name in before:
            w0, c0 = before[name]
            moved_by[name] = (font[name].width - w0, _ink_cx(font, name) - c0)
    n = 0
    for g in font:
        if not g.components or g.name in COMPOSED or g.components[0].baseGlyph not in moved_by:
            continue
        if any(cats.get(c.baseGlyph) != "mark" and not c.baseGlyph.endswith((".case", "comb")) and
               c.baseGlyph not in MARKS_SPACING for c in g.components[1:]):
            continue                                  # not a base with marks (a fraction, a ligature of letters)
        dw, dx = moved_by[g.components[0].baseGlyph]
        for c in g.components[1:]:
            t = list(c.transformation)
            t[4] += round(dx)
            c.transformation = tuple(t)
        g.width += dw
        for a in g.anchors:
            a.x += round(dx)
        n += 1
    for name, (dw, dx) in moved_by.items():
        for a in font[name].anchors:
            a.x += round(dx)
    return n


MARKS_SPACING = {"acute", "grave", "circumflex", "caron", "breve", "dieresis", "dotaccent", "macron", "ring", "tilde",
                 "hungarumlaut", "cedilla", "ogonek", "dotbelow", "commaaccent", "commaaccentcomb"}


def align_anchors(font):
    """The mark feature places a combining accent by anchors; the precomposed letters place it by component offsets.
    They had drifted apart (lowercase marks 29 units lower, capitals whose widths were set up to 40 units off centre).
    Each base's top and bottom anchor is set to where its precomposed letters put their marks, so a typed sequence and
    the precomposed letter look the same."""
    import statistics
    seen = {}
    for g in font:
        if len(g.components) < 2 or g.name.endswith(".tf"):
            continue
        base = g.components[0].baseGlyph
        for c in g.components[1:]:
            m = font[c.baseGlyph]
            for a in m.anchors:
                if a.name in ("_top", "_bottom") and abs(c.transformation[0] - 1) < 1e-6:
                    seen.setdefault((base, a.name[1:]), []).append((c.transformation[4] + a.x, c.transformation[5] + a.y))
            break                                      # the first mark only: a second is stacked on the first
    n = 0
    for (base, name), pts in seen.items():
        g = font[base]
        x = statistics.median(p[0] for p in pts)
        y = statistics.median(p[1] for p in pts)
        anc = next((a for a in g.anchors if a.name == name), None)
        if anc is None:
            g.appendAnchor({"name": name, "x": round(x), "y": round(y)})
        elif abs(anc.x - x) > 1 or abs(anc.y - y) > 1:
            anc.x, anc.y = round(x), round(y)
        else:
            continue
        n += 1
    return n


# ---------------------------------------------------------------- 0.71: the evaluation beyond a-z, A-Z, 0-9
# Measured on all nine faces with docs/research/serif-evaluation-2026-11-13/tools/test_extended.py and looked at
# glyph by glyph (sheets.py). Each rule below is checked by audit_charset.py, which fails on build 0.70.

# One stroke for the signs that are plain strokes. Both references draw plus, minus, bar, slash and underscore at
# one weight (Georgia Pro 61 / 62 / 61 / 61, Serrif 46 / 45 / 45 / 47 for plus / bar / slash / underscore). Area's
# minus and dashes are 52 (0.60 H stems); the plus had a 40 upright on a 52 bar (derive thickens level strokes for
# contrast and lighten thins upright ones: Libre Baskerville's was 52 on 50), the not sign 39 on 50, the bar 65, the
# underscore 72, the slash 41 at its top and 49 at its foot.
FRACTION_BAR = 56       # the bar of the fraction slash, the percent sign and every fraction, level width (they ran 40 to 54;
                        # 48 until 0.84 pass 3: raised with the small figures' stem, 54 > 62, x 1.15)


def _level_cut(c):
    """A four-cornered contour with two level edges: ((x0, x1, y) lower, (x0, x1, y) upper), or None. Since 0.79 its
    corners may be rounded (soft_ends): the corners are then where its four straight edges would meet."""
    P = c.points
    if len(P) == 16 and [p.type for p in P].count("line") == 4:
        n, edges = len(P), []
        for i, p in enumerate(P):
            q = P[(i + 1) % n]
            if p.type and q.type == "line":
                edges.append(((p.x, p.y), (q.x, q.y)))
        pts = []
        for (a, b), (c2, d) in zip(edges, edges[1:] + edges[:1]):
            r, s = (b[0] - a[0], b[1] - a[1]), (d[0] - c2[0], d[1] - c2[1])
            den = r[0] * s[1] - r[1] * s[0]
            if abs(den) < 1e-9:
                return None
            t = ((c2[0] - a[0]) * s[1] - (c2[1] - a[1]) * s[0]) / den
            pts.append((round(a[0] + t * r[0], 2), round(a[1] + t * r[1], 2)))
    elif len(P) == 4 and all(p.type == "line" for p in P):
        pts = [(p.x, p.y) for p in P]
    else:
        return None
    ys = sorted({round(y) for _x, y in pts})
    if len(ys) != 2:
        return None
    lo = sorted(x for x, y in pts if round(y) == ys[0])
    hi = sorted(x for x, y in pts if round(y) == ys[1])
    return (lo[0], lo[1], ys[0]), (hi[0], hi[1], ys[1])


def _slash(lo, hi, perp=None):
    """A leaning stroke between two level cuts, one thickness from end to end: `perp` across the stroke, or (None)
    the mean of the two cuts it had."""
    bc, tc = (lo[0] + lo[1]) / 2, (hi[0] + hi[1]) / 2
    if perp is None:
        wh = ((lo[1] - lo[0]) + (hi[1] - hi[0])) / 2
    else:
        wh = perp * math.hypot(tc - bc, hi[2] - lo[2]) / (hi[2] - lo[2])
    return shape([(bc - wh / 2, lo[2]), (bc + wh / 2, lo[2]), (tc + wh / 2, hi[2]), (tc - wh / 2, hi[2])])


def plain_strokes(font, m):
    w = m.math
    done = []
    # 0.83 (symbols 1): the + box. Every maths operator is the minus's width (mb); the + is square (it was 424 wide
    # and 430 tall) on the maths axis; = (it stood 22 over the axis, 412 wide), the plus-minus sign (55 over), the
    # not sign (414 wide) are the minus's width with their ink centred on the axis (the not sign: its bar on it)
    mb = bounds(gp(font, "minus"))
    cx, cy = (mb[0] + mb[2]) / 2, m.math_y
    hw = (mb[2] - mb[0]) / 2
    plus = union(rect(mb[0], cy - w / 2, mb[2], cy + w / 2), rect(cx - w / 2, cy - hw, cx + w / 2, cy + hw))
    put(font, "plus", plus, font["plus"].width)
    g = font["plusminus"]                                # its plus, and the bar under it at the gap it had
    boxes = sorted((bounds(_contour_path(c)) for c in g.contours), key=lambda q: q[3] - q[1])
    bar_, pl = boxes[0], boxes[-1]
    gap_ = pl[1] - (bar_[1] + w)                         # white between the plus's foot and the bar
    tot = 2 * hw + gap_ + w
    py0 = cy - tot / 2                                   # the bar's foot
    pcy = py0 + w + gap_ + hw
    put(font, "plusminus", union(rect(mb[0], pcy - w / 2, mb[2], pcy + w / 2), rect(cx - w / 2, pcy - hw, cx + w / 2, pcy + hw),
                                 rect(mb[0], py0, mb[2], py0 + w)), g.width)
    b = bounds(gp(font, "logicalnot"))
    drop = b[3] - b[1] - w                               # the hook's drop under the bar, as drawn
    put(font, "logicalnot", union(rect(mb[0], cy - w / 2, mb[2], cy + w / 2), rect(mb[2] - w, cy + w / 2 - w - drop, mb[2], cy + w / 2)),
        font["logicalnot"].width)
    # = : two bars of the minus, EQUAL_GAP apart, on the axis; the not-equal sign's slash moves with them
    put(font, "equal", union(rect(mb[0], cy - EQUAL_GAP / 2 - w / 2, mb[2], cy - EQUAL_GAP / 2 + w / 2),
                             rect(mb[0], cy + EQUAL_GAP / 2 - w / 2, mb[2], cy + EQUAL_GAP / 2 + w / 2)), font["equal"].width)
    if "notequal" in font:                              # the = in place, the slash's middle on the ='s middle
        ne = font["notequal"]
        for comp in ne.components:
            comp.transformation = (1, 0, 0, 1, 0, 0)
        xs_ = [q.x for c in ne.contours for q in c.points]
        ys_ = [q.y for c in ne.contours for q in c.points]
        ddx, ddy = round(cx - (min(xs_) + max(xs_)) / 2), round(cy - (min(ys_) + max(ys_)) / 2)
        for c in ne.contours:
            for q in c.points:
                q.x += ddx
                q.y += ddy
    b = bounds(gp(font, "underscore"))
    cy = (b[1] + b[3]) / 2
    put(font, "underscore", rect(b[0], cy - w / 2, b[2], cy + w / 2), font["underscore"].width)
    for name in ("bar", "brokenbar"):
        g = font[name]
        boxes = [bounds(_contour_path(c)) for c in g.contours]
        cx = (boxes[0][0] + boxes[0][2]) / 2
        if name == "brokenbar" and len(boxes) == 2:      # 0.84 (placement): the bar's extent (it stood -174 to 732,
            lo_, hi_ = sorted(boxes, key=lambda q: q[1])  # the bar -229 to 758), its gap kept and centred on the bar
            bb_ = bounds(gp(font, "bar"))
            gap, mid = hi_[1] - lo_[3], (bb_[1] + bb_[3]) / 2
            boxes = [(0, bb_[1], 0, round(mid - gap / 2)), (0, round(mid + gap / 2), 0, bb_[3])]
        put(font, name, union(*[rect(cx - w / 2, q[1], cx + w / 2, q[3]) for q in boxes]), g.width)
    g = font["slash"]
    lo, hi = _level_cut(g.contours[0])
    side = (lo[0], g.width - hi[1])
    s = _slash(lo, hi, w)
    put(font, "slash", s, 0, lsb=side[0], rsb=side[1])
    put(font, "backslash", moved(s, 0, 0, -1, 1), 0, lsb=side[1], rsb=side[0])
    # owner round 8 (0.82): the not-equal sign's stroke is the minus's across itself on its own centreline (it was 46,
    # beside bars of 52)
    if "notequal" in font:
        for c in font["notequal"].contours:
            cut = _level_cut(c)
            if not cut:
                continue
            tmp = put(font, "_notequal_slash", _slash(cut[0], cut[1], w), 0)
            from ufoLib2.objects import Point
            c.points[:] = [Point(q.x, q.y, q.type, smooth=q.smooth) for q in tmp.contours[0].points]
            del font["_notequal_slash"]
            REBUILT.discard("_notequal_slash")
            done.append("notequal")
    lo, hi = _level_cut(font["fraction"].contours[0])    # the fraction bar keeps its own lighter weight, one
    bc, tc = (lo[0] + lo[1]) / 2, (hi[0] + hi[1]) / 2    # width (FRACTION_BAR) here and in every ready-made fraction
    put(font, "fraction", shape([(bc - FRACTION_BAR / 2, lo[2]), (bc + FRACTION_BAR / 2, lo[2]),
                                 (tc + FRACTION_BAR / 2, hi[2]), (tc - FRACTION_BAR / 2, hi[2])]), font["fraction"].width)
    bars_in = ["percent", "perthousand"] + [g.name for g in font if g.components and len(g.contours) == 1
                                            and any(c.baseGlyph.endswith("inferior") for c in g.components)]
    for name in bars_in:                                 # their bar is a contour beside the small figures
        for c in font[name].contours:
            cut = _level_cut(c)
            if not cut:
                continue
            lo, hi = cut
            wh = FRACTION_BAR
            for p in c.points:
                l, r, _ = lo if p.y == lo[2] else hi
                mid = (l + r) / 2
                p.x = round(mid - wh / 2) if p.x == l else round(mid - wh / 2) + wh
            done.append(f"{name} bar {lo[1] - lo[0]} / {hi[1] - hi[0]} > {wh}")
    return done


# 0.79 (owner, 2026-11-14, on the three options drawn in 0.78: option 1, soft corners). A plain stroke is two
# straight, parallel edges ended by a straight cut: the hyphen, the dashes, minus, plus, equals, underscore, bar,
# slash, the arrows' shafts and heads, the brackets' arms, the bars struck through letters and currency signs. The
# letters round such an end on radius 7 (normalize.soften_ends: serif tips, the bar ends of f and t); everything
# this module draws had stayed sharp, so a hyphen beside an f's bar was the one square-cornered thing in a line.
# The rule is the letters' own, with the same numbers (derive.SOFT, END_ANGLE), on every glyph outside the letters:
# a cut whose two corners are sharp and whose two neighbouring edges are straight and parallel. A meeting (the
# inside of the plus, a vertex) is never an end and stays sharp. The cut's length runs to SOFT_FACE: a 52 stroke cut
# level at the slash's slope measures 55; the heaviest plain stroke in the set (the long stroke overlay, 59 to 60).
SOFT = 7                          # derive.SOFT, the letters' radius
SOFT_FACE = (20, 62)
SOFT_WIDE = {"uni2713": 70}       # 0.83 (symbols 1): the check's ends (1.25 plain strokes, 65) are plain ends too
SOFT_ANGLE = (54, 126)            # normalize.END_ANGLE is 70 to 125; a leaning stroke cut level has corners of its
                                  # slope and the rest of 180: the slash 65.6 / 114.4, the fraction bar 54.5 / 125.5
SOFT_PARALLEL = 8                 # degrees the two edges may differ: a plain stroke, not a wedge


def soft_skip(font):
    """Not this rule's: the letters and figures (normalize.soften_ends has them) and the small figures scaled from
    them, whose stems' feet are meetings with the baseline, not ends."""
    core = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") | set(FIGS)
    return core | {g.name for g in font if g.name.endswith(("superior", "inferior")) or g.name.split(".")[0] in core}


def _plain_ends(c, ink_ccw, face_max=None):
    """Indexes of the corners at the ends of plain strokes in one contour."""
    P, n = c.points, len(c.points)
    if any(p.type == "qcurve" for p in P):
        return set()
    on = [i for i in range(n) if P[i].type]
    info = {}
    for k, i in enumerate(on):
        p, a, b = P[i], P[(i - 1) % n], P[(i + 1) % n]
        v1, v2 = (p.x - a.x, p.y - a.y), (b.x - p.x, b.y - p.y)
        if math.hypot(*v1) < 0.5 or math.hypot(*v2) < 0.5:
            continue
        turn = math.degrees(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1]))
        if abs(turn) < 25 or (turn > 0) != ink_ccw:
            continue
        info[i] = (180 - abs(turn), on[k - 1], on[(k + 1) % len(on)])
    chosen = set()
    for i, (ang, prev, nxt) in info.items():
        if nxt not in info or P[nxt].type != "line" or P[i].type != "line" or P[info[nxt][2]].type != "line":
            continue                                           # the cut and both edges beside it are straight
        face = math.hypot(P[nxt].x - P[i].x, P[nxt].y - P[i].y)
        if not (SOFT_FACE[0] <= face <= (face_max or SOFT_FACE[1]) and SOFT_ANGLE[0] <= ang <= SOFT_ANGLE[1]
                and SOFT_ANGLE[0] <= info[nxt][0] <= SOFT_ANGLE[1]):
            continue
        q0, q1 = P[prev], P[info[nxt][2]]
        e0, e1 = (P[i].x - q0.x, P[i].y - q0.y), (P[nxt].x - q1.x, P[nxt].y - q1.y)
        l0, l1 = math.hypot(*e0), math.hypot(*e1)
        if min(l0, l1) < face * 0.45:                          # a stub shorter than half its own width is a notch
            continue
        cross = abs(e0[0] * e1[1] - e0[1] * e1[0]) / (l0 * l1)
        if math.degrees(math.asin(min(1, cross))) > SOFT_PARALLEL or e0[0] * e1[0] + e0[1] * e1[1] < 0:
            continue
        chosen |= {i, nxt}
    return chosen


def soft_ends(font, skip=None):
    """Every plain stroke's end outside the letters gets the letters' radius. Returns the glyphs changed."""
    from fontTools.pens.areaPen import AreaPen
    from ufoLib2.objects import Point
    done = {}
    skip = soft_skip(font) if skip is None else skip
    for g in font:
        if g.name in skip or not g.contours:
            continue
        areas = []
        for c in g.contours:
            pen = AreaPen()
            c.draw(pen)
            areas.append(pen.value)
        outer = max(areas, key=abs) > 0
        for c, sg in zip(g.contours, areas):
            chosen = _plain_ends(c, (sg > 0) == outer, SOFT_WIDE.get(g.name))
            if not chosen:
                continue
            P, n, out = c.points, len(c.points), []
            for i, p in enumerate(P):
                if i not in chosen:
                    out.append(p)
                    continue
                a, b = P[(i - 1) % n], P[(i + 1) % n]

                def toward(q):
                    dd = math.hypot(q.x - p.x, q.y - p.y)
                    r = min(SOFT, dd * 0.33)
                    return p.x + (q.x - p.x) / dd * r, p.y + (q.y - p.y) / dd * r
                (ax, ay), (bx, by) = toward(a), toward(b)
                out.append(Point(round(ax), round(ay), p.type, smooth=False))
                out.append(Point(round(ax + (p.x - ax) * 0.55), round(ay + (p.y - ay) * 0.55), None))
                out.append(Point(round(bx + (p.x - bx) * 0.55), round(by + (p.y - by) * 0.55), None))
                out.append(Point(round(bx), round(by), "curve", smooth=False))
            c.points[:] = out
            done[g.name] = done.get(g.name, 0) + len(chosen) // 2
    return done


def sharp_ends(font, skip=None):
    """The audit's side of soft_ends: the plain stroke ends still sharp, per glyph."""
    from fontTools.pens.areaPen import AreaPen
    left = {}
    skip = soft_skip(font) if skip is None else skip
    for g in font:
        if g.name in skip or not g.contours:
            continue
        areas = []
        for c in g.contours:
            pen = AreaPen()
            c.draw(pen)
            areas.append(pen.value)
        outer = max(areas, key=abs) > 0
        k = sum(len(_plain_ends(c, (sg > 0) == outer, SOFT_WIDE.get(g.name))) // 2 for c, sg in zip(g.contours, areas))
        if k:
            left[g.name] = k
    return left


def _contour_path(c):
    p = pathops.Path()
    c.draw(p.getPen())
    return p


# Signs made of a letter and a stroke are the finished letter and a stroke (the rule every other such glyph here
# follows). The dollar, cent and yen kept Libre Baskerville's own S, c and Y: the dollar's S 122 across at its
# heaviest where Area's S is 102, the yen's bars 63 where a capital's thin strokes are 46 to 49, the cent's c scaled
# with the capitals (0.94). The stroke is the case's hairline (47 capitals, 43 lowercase), where and as long as
# Libre Baskerville had it; the yen's bars are H's crossbar, as the won's, the ruble's and the lira's.
STROKE_UP, STROKE_LOW = 47, 43          # the ladder's hairlines (balance.CAP_THIN, clean.THIN_ARCH x stem)
CURRENCY_BAR = STROKE_UP                # 0.84 (pass 2, leftovers): every currency sign's bar, one value


def letter_signs(font, m):
    done = []
    # dollar. 0.80 (owner, 2026-11-14: "just choose 1 dollar symbol, i prefer the rounded pill shaped one"): the
    # base's own drawing, whose ends are balls, is the one dollar; 0.71 to 0.79 built the default from the finished
    # S (barb ends) and a stroke, and 0.78 and 0.79 kept the base's as dollar.ss03. Its stroke takes the capital
    # hairline, as every stroke through a letter: the two upright edges move in, each by half the excess, wherever
    # they show (the stubs above and below, the sides of the two counters).
    g = font["dollar"]
    p0 = gp(font, "dollar")
    b = bounds(p0)
    st = scan_h(p0, b[3] - 10)[0]
    over = (st[1] - st[0]) - STROKE_UP
    for c in g.contours:
        for q in c.points:
            if abs(q.x - st[0]) < 1.5:
                q.x = round(st[0] + over / 2)
            elif abs(q.x - st[1]) < 1.5:
                q.x = round(st[1] - over / 2)
    done.append(f"dollar: the base's, ball ends; stroke {st[1] - st[0]:.0f}>{STROKE_UP}")
    # cent: c at its own size, the stroke through it
    old = gp(font, "cent")
    ob = bounds(old)
    st = scan_h(old, ob[3] - 20)[0]
    cols = [scan_v(old, x) for x in range(int(ob[0]) + 5, int(st[0]) - 5, 5)]     # the old c, left of the stroke
    old_top = max(s[1] for col in cols for s in col)
    old_bot = min(s[0] for col in cols for s in col)
    c = gp(font, "c")
    cb = bounds(c)
    xc = cb[0] + (cb[2] - cb[0]) * ((st[0] + st[1]) / 2 - ob[0]) / (ob[2] - ob[0])
    sx = band(xc, STROKE_LOW)
    STRUCK["cent"] = ("c", [rect(sx[0], cb[1] + (ob[1] - old_bot), sx[1], cb[3] + (ob[3] - old_top))])
    p = union(c, rect(sx[0], cb[1] + (ob[1] - old_bot), sx[1], cb[3] + (ob[3] - old_top)))
    w0 = font["cent"].width
    put(font, "cent", p, 0, lsb=ob[0], rsb=w0 - ob[2])
    done.append(f"cent: c + stroke {st[1] - st[0]:.0f}>{STROKE_LOW}, c top {old_top:.0f}>{cb[3]:.0f}")
    # yen: Y, two bars across its stem
    g = font["yen"]
    P = [q for c_ in g.contours for q in c_.points if q.type == "line"]
    mid = [q for q in P if 100 < q.y < 0.5 * CAP_HEIGHT]
    left = min(q.x for q in mid)
    ys = sorted({q.y for q in mid if q.x == left})                              # the bars' four level edges
    ob = bounds(gp(font, "yen"))
    if len(ys) == 4:
        xs = [q.x for q in P if q.y in ys]
        Y = gp(font, "Y")
        yb = bounds(Y)
        stem = scan_h(Y, 100)[0]
        cx = (stem[0] + stem[1]) / 2
        half = (max(xs) - min(xs)) / 2
        bars_ = [rect(cx - half, band((a + b) / 2, CURRENCY_BAR)[0], cx + half, band((a + b) / 2, CURRENCY_BAR)[1])
                 for a, b in ((ys[0], ys[1]), (ys[2], ys[3]))]
        w0 = g.width
        STRUCK["yen"] = ("Y", list(bars_))
        put(font, "yen", union(Y, *bars_), 0, lsb=ob[0], rsb=w0 - ob[2])
        done.append(f"yen: Y + bars {ys[1] - ys[0]:.0f}>{CURRENCY_BAR:.0f}")
    else:
        done.append(f"yen: bars not found ({ys})")
    return done


# A right-hand bracket is its left-hand one turned over. Each pair had drifted by a unit or two through lightening
# and rounding (bracket stems 73 and 74, braces 233 and 234 wide, 4 to 62 points apart).
MIRRORS = [("parenleft", "parenright"), ("bracketleft", "bracketright"), ("braceleft", "braceright"),
           (0x00AB, 0x00BB), (0x2039, 0x203A), ("less", "greater"), ("lessequal", "greaterequal"),
           (0x21E4, 0x21E5), (0x232B, 0x2326),      # 0.81: the tab arrows and the erase keys, one drawing each
           ("arrowright", "arrowleft"), ("uni2197", "uni2196"), ("uni2198", "uni2199")]   # 0.83: the arrows too


# 0.84 (Regular pass 2, placement). The three bracket pairs had three extents: ( ) -176 to 767, [ ] -137 to 758, { }
# -137 to 767. One top and one bottom for all six: the top 767 (four of the six), the bottom at Georgia Pro's ratio of
# bottom to top (-160 / 748; its ( [ { stand within 12 of one another) on that top, -164. A square bracket's arms move
# whole (its stem lengthens, the arms keep their thickness); a parenthesis and a brace, all curves, are scaled upright
# onto the extent (their strokes are upright: their thickness across does not change). The right forms follow
# (mirrors).
BRACKET_TOP = 767
BRACKET_BOTTOM = -164


def bracket_extent(font):
    done = []
    for name in ("parenleft", "bracketleft", "braceleft"):
        if name not in font or not font[name].contours:
            continue
        pts = [p for c in font[name].contours for p in c.points]
        lo, hi = min(p.y for p in pts), max(p.y for p in pts)
        if (lo, hi) == (BRACKET_BOTTOM, BRACKET_TOP):
            continue
        if name == "bracketleft":
            mid = (lo + hi) / 2
            for p in pts:
                p.y += (BRACKET_TOP - hi) if p.y > mid else (BRACKET_BOTTOM - lo)
        else:
            k = (BRACKET_TOP - BRACKET_BOTTOM) / (hi - lo)
            for p in pts:
                p.y = round(BRACKET_BOTTOM + (p.y - lo) * k)
        done.append(f"{name} {lo} to {hi} > {BRACKET_BOTTOM} to {BRACKET_TOP}")
    return done


def _name(font, key):
    if isinstance(key, str):
        return key
    return next((g.name for g in font if key in g.unicodes), None)


# 0.84 (Regular pass 4, item 4; the cohesion study: « » ‹ › read small and light beside the lowercase, ink 0.36 of
# the lowercase median, top at 0.78 of the x-height). The guillemets are letters: each chevron v's two diagonals
# (signs.guillemet: the arm running down from the point v's thick, GUIL_THICK, the arm running up v's thin, GUIL_THIN;
# an upright flat of the letters' vertex, 0.42 of the stem, at the point), its ends cut level on GUIL_TOP and
# GUIL_BOTTOM of the x-height (the top near the x-height; the middle 0.52 of it, the references' median, where the
# drawing's stood at 0.50); the outer edges' run over the height GUIL_RUN (the drawing's 0.55, a little narrowed so
# the heavier strokes keep its ink width's share of the height); « the two chevrons GUIL_GAP of the height apart (the
# drawing's 155 over 299). Sides the drawing's (46 before the point, 82 after). › » are these turned over (MIRRORS).
GUIL_THICK, GUIL_THIN = 74, 39       # v's diagonals as read on the Regular (74.0, 39.4)
GUIL_TOP, GUIL_BOTTOM = 0.96, 0.08
GUIL_RUN = 0.38
GUIL_GAP = 0.40


def guillemets(font, m):
    done = []
    top, bot = round(GUIL_TOP * X_HEIGHT), round(GUIL_BOTTOM * X_HEIGHT)
    H = top - bot
    for name, n, cp in (("guilsinglleft", 1, 0x2039), ("guillemetleft", 2, 0xAB)):
        if name not in font:
            continue
        info = dict(build="guillemet", params=dict(x0=0, cy=(top + bot) / 2, top=top, bottom=bot,
                                                   run=round(GUIL_RUN * H), thick=GUIL_THICK, thin=GUIL_THIN,
                                                   flat=VERTEX_CAP * m.stem, n=n, gap=round(GUIL_GAP * H)))
        g = put_built(font, name, info, 0, list(font[name].unicodes) or [cp], lsb=46, rsb=82)
        b = bounds(gp(font, name))
        done.append(f"{name} {b[2] - b[0]:.0f} x {b[3] - b[1]:.0f}, advance {g.width}")
    return done


def mirrors(font):
    done = []
    for a, b in MIRRORS:
        a, b = _name(font, a), _name(font, b)
        if a not in font or b not in font:                 # not drawn yet (the keys come later in charset)
            continue
        ga, gb_ = font[a], font[b]
        if ga.components or gb_.components:
            continue
        x0, _, x1, _ = bounds(gp(font, a))
        # point for point (not through pathops, which may start or split a contour elsewhere): x turned about
        # the ink, the contour's direction turned back
        from fontTools.pens.reverseContourPen import ReverseContourPen
        gb_.clearContours()
        ga.draw(ReverseContourPen(TransformPen(gb_.getPen(), Transform(-1, 0, 0, 1, x0 + x1, 0))))
        d = round((ga.width - x1) - x0)                    # its bearings are the other's, swapped
        for c in gb_.contours:
            for q in c.points:
                q.x, q.y = round(q.x + d), round(q.y)
        gb_.width = ga.width
        REBUILT.add(b)
        done.append(b)
    return done


# The ring over a capital. Capital accents are flatter than lowercase ones so that they fit the line, but a ring
# cannot be flattened: Libre Baskerville scaled it instead, to 0.73 (120 units across, its stroke 35, its counter
# 50: under 0.7 px at 13 px). Every other face measured keeps one ring for both cases (ring height in x-heights,
# capital / lowercase: Georgia Pro 0.45 / 0.45, Serrif 0.36 / 0.37, Source Serif 4 0.39 / 0.43). So the capital
# form is the lowercase ring, standing where the small one stood.
# The circumflex over a capital sat 11 units higher than the caron, which is the same mark turned over (their
# lowercase forms share one height, and both references hold one height for the two).
def case_marks(font):
    done = []

    def anchor(g, name):
        return next(a for a in g.anchors if a.name == name)

    ring = gp(font, "ringcomb")
    rb = bounds(ring)
    ra = anchor(font["ringcomb"], "_top")
    for name in ("ringcomb.case", "ring.case"):
        if name not in font:
            continue
        g = font[name]
        a = anchor(g, "_top")
        ob = bounds(gp(font, name))
        keep = [(q.name, q.x, q.y) for q in g.anchors]
        dx = a.x - ra.x                                    # the ring's own anchor on the capital form's anchor
        dy = ob[1] - rb[1]                                 # standing where the small ring stood
        width, uni = g.width, list(g.unicodes)
        put(font, name, moved(ring, dx, dy), width, uni)
        g = font[name]
        g.clearAnchors()
        for nm, x, y in keep:
            g.appendAnchor({"name": nm, "x": x, "y": y})
        if width:                                          # the spacing form: its ink inside its advance
            b = bounds(gp(font, name))
            side = bounds(gp(font, "ring"))[0]
            d = round(side - b[0])
            for c in g.contours:
                for q in c.points:
                    q.x += d
            for q in g.anchors:
                q.x += d
            g.width = round(b[2] - b[0] + 2 * side)
            for o in font:                                 # whoever is built on it stays where it was
                for comp in o.components:
                    if comp.baseGlyph == name:
                        t = list(comp.transformation)
                        t[4] -= d
                        comp.transformation = tuple(t)
        done.append(f"{name}: {ob[2] - ob[0]:.0f} x {ob[3] - ob[1]:.0f} > {rb[2] - rb[0]:.0f} x {rb[3] - rb[1]:.0f}")
    ref = font["acutecomb.case"]                       # 0.74: the acute's, for caron and circumflex alike (they
    gap = bounds(gp(font, "acutecomb.case"))[1] - anchor(ref, "_top").y   # stood 1 over it)
    for name in ("circumflexcomb.case", "circumflex.case", "caroncomb.case", "caron.case"):
        g = font[name]
        d = round(gap - (bounds(gp(font, name))[1] - anchor(g, "_top").y))
        if d:
            for c in g.contours:
                for q in c.points:
                    q.y += d
            for q in g.anchors:
                if not q.name.startswith("_"):
                    q.y += d
            done.append(f"{name}: {d:+d}")
    return done


# Where a mark sits over or under its letter. A mark was placed for the letter Libre Baskerville drew; Area has
# since changed the width of o c z O D T Z U (set_widths), redrawn s, widened w and re-spaced I, and each change left
# the marks where the old ink was: 42 units right of centre on O, 41 on T, 24 on I, 14 on o, 43 on z, 27 left on s,
# 37 left on w. Eight other faces centre a mark on O to within 2 units.
# MARK_X is where a symmetric mark's ink centre sits, in units right of the base's ink centre: the mean of Georgia
# Pro and Serrif (each measured over every letter the base has with a dieresis, macron, circumflex, caron, breve,
# ring, dot or tilde, in its own zone height, scaled to Area's; within 5 of the centre on a letter that is
# symmetric there, the centre). A base moves only when it stands more than MARK_BAND from this, so letters that
# already agree keep the designer's placement. i, j, J, h and t are not in the table: on those the references' longer
# serifs and bars move the ink centre, not the mark. Tool: build/anchors_ref.py (numbers only).
MARK_X = {"top": {"A": 0, "a": -36, "C": 45, "c": 13, "D": -24, "E": 5, "e": 11, "G": 13, "g": -21, "H": 0, "I": 0,
                  "N": 0, "n": 0, "O": 0, "o": 0, "R": -46, "r": 0, "S": 0, "s": 0, "T": 0, "U": 10, "u": 0,
                  "W": 18, "w": 20, "Y": 13, "y": 16, "Z": 9, "z": 8},
          "bottom": {"A": -16, "a": -20, "E": 11, "e": 8, "I": 0, "O": 0, "o": 0, "S": 7, "s": 0, "T": 8, "U": 0,
                     "u": 0}}
MARK_BAND = 1           # 0.84 (placement): every letter's marks on MARK_X (6 left 34 letters 3 to 6 off it)
MARK_ALIAS = {"Oslash": "O", "oslash": "o"}     # a struck letter takes its letter's move (its ink includes the stroke)
CAP_MARK_Y = 763        # one height for the marks over every capital, as both references (O's sat 11 lower, B H K
                        # M P V X 4, D G S T 2: Libre Baskerville's own offsets)


def centre_marks(font):
    """Moves each base's top and bottom anchor to MARK_X (and capitals' top anchors to one height), and every mark
    of every letter composed on that base with it. Runs after align_anchors, so an anchor is where the precomposed
    letters put their marks."""
    cats = font.lib.get("public.openTypeCategories", {})
    delta = {}
    done = []
    for side, table in MARK_X.items():
        for base, off in table.items():
            if base not in font:
                continue
            g = font[base]
            a = next((q for q in g.anchors if q.name == side), None)
            if a is None:
                continue
            b = bounds(gp(font, base))
            dx = round((b[0] + b[2]) / 2 + off - a.x)
            if abs(dx) <= MARK_BAND:
                dx = 0
            delta[(base, side)] = [dx, 0]
    for g in font:                                       # capitals: one height
        if len(g.name) == 1 and g.name.isupper():
            a = next((q for q in g.anchors if q.name == "top"), None)
            if a is not None and CAP_MARK_Y - 13 <= a.y < CAP_MARK_Y:
                delta.setdefault((g.name, "top"), [0, 0])[1] = CAP_MARK_Y - a.y
    for alias, base in MARK_ALIAS.items():
        for side in ("top", "bottom"):
            if (base, side) in delta and alias in font:
                delta[(alias, side)] = list(delta[(base, side)])
    delta = {k: v for k, v in delta.items() if v[0] or v[1]}
    for (base, side), (dx, dy) in sorted(delta.items()):
        for a in font[base].anchors:
            if a.name == side:
                a.x += dx
                a.y += dy
        done.append(f"{base} {side} {dx:+d}" + (f" up {dy}" if dy else ""))
    n = 0
    for g in font:
        if len(g.components) < 2:
            continue
        base = g.components[0].baseGlyph
        while base in font and not font[base].contours and font[base].components:
            base = font[base].components[0].baseGlyph      # a letter built on an accented letter: the letter under it
        hit = False
        for comp in g.components[1:]:
            mk = font[comp.baseGlyph]
            names = {a.name for a in mk.anchors}
            side = "top" if "_top" in names else "bottom" if "_bottom" in names else None
            if side is None or (base, side) not in delta:
                continue
            dx, dy = delta[(base, side)]
            t = list(comp.transformation)
            t[4] += dx                                    # (the height of a capital's marks is set below, absolutely)
            comp.transformation = tuple(t)
            hit = True
        # a first mark more than 3 units off its base's anchor goes onto it (capitals carrying a lowercase macron
        # stood 13 or 14 right of it), and any mark stacked on it moves along
        first = g.components[1]
        mk = font[first.baseGlyph]
        ma = next((a for a in mk.anchors if a.name == "_top"), None)
        ba = next((a for a in font[base].anchors if a.name == "top"), None) if base in MARK_X["top"] else None
        if ma is not None and ba is not None and g.components[0].baseGlyph == base:
            off = first.transformation[4] + ma.x - (ba.x + g.components[0].transformation[4])
            if abs(off) > 3:
                for comp in g.components[1:]:
                    if any(a.name == "_top" for a in font[comp.baseGlyph].anchors):
                        t = list(comp.transformation)
                        t[4] -= off
                        comp.transformation = tuple(t)
                hit = True
        if hit:
            n += 1
            for a in g.anchors:
                if (base, a.name) in delta:
                    a.x += delta[(base, a.name)][0]
                    a.y += delta[(base, a.name)][1]
    # 0.74: a capital's first mark stands with its own anchor on CAP_MARK_Y, wherever it stood. 0.71 moved each
    # letter's marks by what its anchor moved; but an anchor is the median of its letters' marks, and D G S T H
    # carried letters already on the line (H-circumflex, D-caron ...), which went 2 to 4 units too high.
    raised = 0
    for g in font:
        if len(g.components) < 2:
            continue
        base = g.components[0].baseGlyph
        while base in font and not font[base].contours and font[base].components:
            base = font[base].components[0].baseGlyph
        if not (len(base) == 1 and base.isupper()) and base not in ("Oslash",):
            continue
        tops = [c for c in g.components[1:] if any(a.name == "_top" for a in font[c.baseGlyph].anchors)]
        if not tops:
            continue
        ma = next(a for a in font[tops[0].baseGlyph].anchors if a.name == "_top")
        need = CAP_MARK_Y - (ma.y + tops[0].transformation[5])
        if need and abs(need) <= 16:                       # (O's lowercase-form marks stood 15 low)
            for c in tops:
                t = c.transformation
                c.transformation = (t[0], t[1], t[2], t[3], t[4], t[5] + need)
            raised += 1
    done.append(f"capital marks set on {CAP_MARK_Y}: {raised}")
    return done, n


# Signs that kept Libre Baskerville's weight. Measured across the stroke (a ray along the inward normal to the facing
# edge, only where that edge runs alongside): the daggers' round ends were 121 across, where the letters' ball
# terminals are 88 to 100 (Georgia Pro's daggers 0.69 of its capital stem at their heaviest, Serrif's 0.98, Area's
# 1.41), and the eth's bowl 94 where o is 82 and a lowercase round stroke at most 86.
# The rule: no stroke of a sign is thicker than the like part of the letters it stands with. Where one is, its two
# edges come in by half the excess each; hairlines, joins and counters do not move. One number per sign to change
# back: delete its line.
# Not here, after measuring: the euro (round stroke 92, the O's), sterling (93 to 98) and the section sign (92 to 103)
# hold the capitals' round stroke within the 5% the capitals themselves are allowed. The largest circle inside them
# (120, 109, 105) sits where a bar or the spine joins, which is not a stroke; 0.71's first report read it as one.
# 0.75, the recommendations left open in 0.71, each one line to change back. The tilde's thick part was 80 (1.02 of
# the stem) and its capital form 76 (0.89): Georgia Pro 0.84 and 0.73, Serrif 0.68 and 0.61; each goes to the nearer
# reference, 66 and 63. The sharp s keeps Libre Baskerville's form, which is the references' form, at the letters'
# weight: no round stroke over 83 (it was 105 at its heaviest), the capital's over 95.
SIGN_STROKE_NAMES = {"tilde": 66, "tildecomb": 66, "tilde.case": 63, "tildecomb.case": 63, "germandbls": 83, "Germandbls": 95}
SIGN_STROKE = {0x2020: 100, 0x2021: 100,                # daggers: their round ends no larger than a ball terminal
               0x00F0: 83}                              # eth: the lowercase rounds' thickest (o 82, e and s 83; 0.71 wrote 86, the value before lightening)
SIGN_BAR = {0x20AC: None, 0x00A3: None}                 # their level bars: H's crossbar (they were 60 to 64)


def _polys(g):
    out = []
    for c in g.contours:
        p = pathops.Path()
        c.draw(p.getPen())
        pts, cur = [], None
        for verb, P in p.segments:
            if verb in ("moveTo", "lineTo"):
                cur = P[0]
                pts.append(cur)
            elif verb == "curveTo":
                a = cur
                b, c2, d = P
                for k in range(1, 13):
                    t = k / 12
                    u = 1 - t
                    pts.append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c2[0] + t ** 3 * d[0],
                                u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c2[1] + t ** 3 * d[1]))
                cur = d
        out.append(pts)
    return out


def _inside(polys, x, y):
    n = 0
    for pts in polys:
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1]):
                if a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]) > x:
                    n += 1
    return n % 2 == 1


def _ray(polys, x, y, nx, ny):
    """Distance along (nx, ny) from (x, y) to the nearest edge, and how parallel that edge runs to the edge we left."""
    best = None
    for pts in polys:
        for i in range(len(pts)):
            a, b = pts[i], pts[(i + 1) % len(pts)]
            ex, ey = b[0] - a[0], b[1] - a[1]
            den = nx * ey - ny * ex
            if abs(den) < 1e-9:
                continue
            t = ((a[0] - x) * ey - (a[1] - y) * ex) / den
            u = ((a[0] - x) * ny - (a[1] - y) * nx) / den
            if t > 1.5 and 0 <= u <= 1 and (best is None or t < best[0]):
                el = math.hypot(ex, ey)
                best = (t, abs(ex * -ny + ey * nx) / el if el else 0)
    return best


def cap_strokes(font):
    done = []
    todo = [(next((g.name for g in font if cp in g.unicodes), None), t) for cp, t in SIGN_STROKE.items()]
    todo += [(n, t) for n, t in SIGN_STROKE_NAMES.items() if n in font]
    for name, target in todo:
        if name is None:
            continue
        g = font[name]
        moved_most = 0.0
        for _ in range(8):                               # until no stroke is over (3 passes left the sharp s at 87)
            polys = _polys(g)
            moves = []
            for c in g.contours:
                P, n = c.points, len(c.points)
                for i, p in enumerate(P):
                    a, b = P[i - 1], P[(i + 1) % n]
                    if p.type != "curve" or not p.smooth or a.type is not None or b.type is not None:
                        continue                              # a smooth node on a curve, both handles its own
                    tx, ty = b.x - a.x, b.y - a.y
                    L = math.hypot(tx, ty)
                    if L < 1e-6:
                        continue
                    nx, ny = -ty / L, tx / L
                    if not _inside(polys, p.x + nx * 1.5, p.y + ny * 1.5):
                        nx, ny = -nx, -ny
                        if not _inside(polys, p.x + nx * 1.5, p.y + ny * 1.5):
                            continue
                    hit = _ray(polys, p.x, p.y, nx, ny)
                    if not hit or hit[1] < 0.85 or not target + 1.5 < hit[0] < 1.6 * target:
                        continue
                    d = (hit[0] - target) / 2
                    moves.append((p, a, b, nx * d, ny * d))
            if not moves:
                break
            for p, a, b, dx, dy in moves:
                for q in (p, a, b):
                    q.x, q.y = q.x + dx, q.y + dy
                moved_most = max(moved_most, math.hypot(dx, dy))
        for c in g.contours:
            for q in c.points:
                q.x, q.y = round(q.x), round(q.y)
        done.append(f"{name}: at most {target} across, edges in by up to {moved_most:.0f}")
    m_bar = M(font).cap_bar
    for cp in SIGN_BAR:
        name = next((g.name for g in font if cp in g.unicodes), None)
        if name is None:
            continue
        g = font[name]
        # a bar: two level straight edges, each 60 or more long, 52 to 70 apart, one over the other
        edges = []
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i, p in enumerate(P):
                q = P[(i + 1) % n]
                if q.type == "line" and p.y == q.y and abs(p.x - q.x) >= 40:
                    edges.append((p.y, min(p.x, q.x), max(p.x, q.x)))
        polys = _polys(g)
        pairs = [(lo, hi) for lo in edges for hi in edges if 52 <= hi[0] - lo[0] <= 70
                 and min(lo[2], hi[2]) - max(lo[1], hi[1]) >= 50
                 and _inside(polys, (max(lo[1], hi[1]) + min(lo[2], hi[2])) / 2, (lo[0] + hi[0]) / 2)]
        seen = set()
        for lo, hi in pairs:
            if (lo[0], hi[0]) in seen:
                continue
            seen.add((lo[0], hi[0]))
            nlo, nhi = band((lo[0] + hi[0]) / 2, m_bar)
            for c in g.contours:                          # every point on the bar's two edges, the whole length of
                for q in c.points:                        # the bar (0.71 moved only the stretch where it found both
                    if q.y == lo[0]:                      # edges, and left the euro's and sterling's bars stepped)
                        q.y = nlo
                    elif q.y == hi[0]:
                        q.y = nhi
            done.append(f"{name}: bar {hi[0] - lo[0]:.0f}>{m_bar:.0f} at {lo[0]:.0f}")
    return done


# 0.84 (Regular pass 4, item 8; the cohesion study: ð stopped at 736, under b d h k l's ascender line). Its ascender
# and its bar go up together to the ascender line (ASC, 780) as one piece: every point of the outline from where the
# ascender's inner edge leaves the bowl (the crotch, the last corner over the bowl's right extreme) round to the
# bowl's right extreme moves up by a share that rises from 0 at the crotch's height to 1 at the bar's lowest point,
# so the bar, the crossing and the ascender's cut end move whole (no stroke over the bar changes) and only the
# ascender's run between the bowl and the bar is drawn longer (a steep stroke: it gains some 7% across there, which
# cap_strokes' 83 for ð then takes back). The bowl and its counter stay.
def eth_ascender(font):
    name = next((g.name for g in font if 0xF0 in g.unicodes), None)
    if name is None:
        return "no eth"
    g = font[name]
    c = max(g.contours, key=lambda c_: len(c_.points))
    P, n = c.points, len(c.points)
    top = bounds(gp(font, name))[3]
    d = ASC - top
    if d <= 0.5:
        return f"{name}: top {top:.0f}, kept"
    on = [i for i, q in enumerate(P) if q.type]
    right = max(on, key=lambda i: (P[i].x, -P[i].y))   # the bowl's right extreme
    # walking on from the right extreme: the ascender's outer edge, the bar, the cut, the inner edge, to the crotch
    # (the first corner after the topmost point whose next on-curve node lies left and lower: the bowl's top)
    run, k = [], (right + 1) % n
    seen_top = False
    while k != right:
        run.append(k)
        if P[k].y >= top - 1:
            seen_top = True
        nxt = next(j for j in on if (j - k) % n > 0) if k != on[-1] else on[0]
        if seen_top and P[k].type and not P[k].smooth and P[k].y < P[right].y + 200 and P[nxt].x < P[k].x - 3:
            break
        k = (k + 1) % n
    crotch = run[-1]
    y0 = P[crotch].y
    xc = P[crotch].x
    y1 = min(P[i].y for i in run if P[i].x < xc - 150)     # the bar's and the cut end's lowest point
    for i in run:
        q = P[i]
        t = min(1.0, max(0.0, (q.y - y0) / (y1 - y0)))
        q.y = round(q.y + d * t)
    return f"{name}: top {top:.0f} > {bounds(gp(font, name))[3]:.0f} (crotch at {y0}, whole over {y1})"


# Greenlandic kra is k without its ascender (Libre Baskerville's was its own small capital K: 105 across at its
# heaviest where k is 92, its own serifs and arm). k's arm and leg, the stem under dotless i's head.
def kra(font):
    name = next((g.name for g in font if 0x0138 in g.unicodes), None)
    if name is None:
        return []
    k, i = gp(font, "k"), gp(font, "idotless")
    ks, is_ = _stem_x(k, 300), _stem_x(i, 300)
    cut = X_HEIGHT - 150                                   # under the head serif's bracket, over the arm's join
    body = op(k, rect(-200, cut, ks[1], 2000), pathops.PathOp.DIFFERENCE)
    body = op(body, rect(-200, X_HEIGHT + 12, 2000, 2000), pathops.PathOp.DIFFERENCE)
    head = op(i, rect(-200, cut - 1, is_[1] + 0.5, 2000), pathops.PathOp.INTERSECTION)
    put(font, name, union(body, moved(head, ks[0] - is_[0])), font["k"].width)
    kern_like(font, name, "k", "k")
    return [f"{name}: k under dotless i's head"]


# How far a lowercase accent stands off its letter. The acute, grave, circumflex, caron, breve, ring and double acute
# stood 108 units over the x-height (103 and 113 for breve and ring): 0.208 x-heights, further than seven of the
# eight other faces (0.127 to 0.184; Georgia Pro 0.127, Serrif 0.145; only Libre Baskerville, whose marks these
# are, stands further). They come down MARK_DROP, half the way to the mean of Georgia Pro and Serrif: 90 units,
# 0.173. One number to change back. The tilde, dieresis, dot and macron stay: Georgia Pro holds them where Area
# does, so the references do not agree. Letters with an ascender and capitals that carry these marks keep them
# where they were (h with a circumflex would touch its ascender).
MARK_DROP = 19          # 108.2 to 89.4 (the half-way point; 0.71 to 0.73 had 18)
DROP_MARKS = ("acutecomb", "gravecomb", "circumflexcomb", "caroncomb", "brevecomb", "ringcomb", "hungarumlautcomb",
              "acute", "grave", "circumflex", "caron", "breve", "ring", "hungarumlaut")
X_ANCHOR = 632          # the top anchor of every letter that ends at the x-height


def drop_marks(font):
    n = 0
    for g in font:
        if len(g.components) < 2:
            continue
        base = g.components[0].baseGlyph
        while base in font and not font[base].contours and font[base].components:
            base = font[base].components[0].baseGlyph
        a = next((q for q in font[base].anchors if q.name == "top"), None)
        first = g.components[1]
        if a is None or a.y != X_ANCHOR or first.baseGlyph not in DROP_MARKS or g.components[0].baseGlyph != base:
            continue
        for comp in g.components[1:]:
            if any(q.name == "_top" for q in font[comp.baseGlyph].anchors):
                t = list(comp.transformation)
                t[5] -= MARK_DROP
                comp.transformation = tuple(t)
        n += 1
    for name in DROP_MARKS:                             # so a typed accent lands where the ready-made letter has it
        if name in font:
            for q in font[name].anchors:
                if q.name == "_top":
                    q.y += MARK_DROP
    return n


# 0.84 (Regular pass 2, placement). The census (build/owner9/place/report.md, 3.3) found 64 capitals composed by
# Libre Baskerville with the lowercase marks (a dot 112 across at 794 where Ċ's is 94 at 787, carons and acutes at 759
# where Č's and Á's are at 780), Ḟ's dot 59 lower again, and first marks standing a unit or more off their letter's
# anchor on 83 letters. The rules: a capital carries the capital (.case) form of every mark that has one, its first
# mark above with its anchor on the capitals' one height (CAP_MARK_Y) at the x where its mark stood, a mark stacked on
# it centred on it STACK_GAP over it (the Vietnamese capitals' rule); and after every other mark rule, each letter's
# first mark above and first mark below stand with their anchor exactly on the letter's anchor (BOTTOM_ANCHOR one
# height under every letter), the marks stacked on them moving along. Exception, by MARK_DROP's own rule: on letters
# with an ascender the dropped marks keep their old height, 19 over the anchor that a typed mark uses.
BOTTOM_ANCHOR = 4       # the bottom anchor of 99 of the 101 base letters (H and s stood at 5)


def _is_mark(font, name):
    cats = font.lib.get("public.openTypeCategories", {})
    return cats.get(name) == "mark" or name in MARKS_SPACING or name.endswith("comb")


def _case_form(font, name):
    if "." in name:
        return None
    for cand in (name + ".case", name + "comb.case"):     # dotbelow (spacing) has dotbelowcomb.case
        if cand in font:
            return cand
    return None


def _root(font, name):
    dx = dy = 0
    while name in font and not font[name].contours and font[name].components:
        c = font[name].components[0]
        dx, dy = dx + c.transformation[4], dy + c.transformation[5]
        name = c.baseGlyph
    return name, dx, dy


def _capital(font, name):
    import unicodedata
    return name in font and any(unicodedata.category(chr(u)) == "Lu" for u in font[name].unicodes)


def case_forms(font):
    """Every capital's marks in their capital form (the rule above). Returns the glyphs with marks stacked above,
    for `restack` (after case_marks, which moves the capital circumflex and caron)."""
    stacked = []
    for g in font:
        if len(g.components) < 2 or not _capital(font, _root(font, g.components[0].baseGlyph)[0]):
            continue
        tops, swapped = [], False
        for comp in g.components[1:]:
            n = comp.baseGlyph
            if not _is_mark(font, n):
                continue
            side = "_top" if _anchor(font[n], "_top") else None    # marks above only: below the baseline both
            if side is None:                                         # cases share one space and one form
                continue
            tops.append(comp)
            new = _case_form(font, n)
            if new is None or _anchor(font[new], side) is None:
                continue
            a0, a1 = _anchor(font[n], side), _anchor(font[new], side)
            t = comp.transformation
            x, y = t[4] + a0[0], t[5] + a0[1]           # where the mark's anchor stood
            if side == "_top" and len(tops) == 1:
                y = CAP_MARK_Y
            comp.baseGlyph = new
            comp.transformation = (1, 0, 0, 1, round(x - a1[0]), round(y - a1[1]))
            swapped = True
        if swapped and len(tops) > 1:
            stacked.append(g.name)
    return stacked


def restack(font, names):
    """A mark stacked over a capital's first mark: centred on its ink, STACK_GAP over it."""
    done = []
    for name in names:
        g = font[name]
        tops = [c for c in g.components[1:] if _anchor(font[c.baseGlyph], "_top")]
        for prev, comp in zip(tops, tops[1:]):
            pt, t = prev.transformation, comp.transformation
            pb, mb = bounds(gp(font, prev.baseGlyph)), bounds(gp(font, comp.baseGlyph))
            dx = round((pb[0] + pb[2]) / 2 + pt[4] - (mb[0] + mb[2]) / 2)
            dy = round(pb[3] + pt[5] + STACK_GAP - mb[1])
            comp.transformation = (1, 0, 0, 1, dx, dy)
        done.append(name)
    return done


def marks_on_anchors(font):
    """Each letter's first mark above and below with its anchor on the letter's (the rule above)."""
    done, left, combos = [], [], set()
    for g in font:
        if g.contours:
            for a in g.anchors:
                if a.name == "bottom" and a.y != BOTTOM_ANCHOR and abs(a.y - BOTTOM_ANCHOR) <= 2:
                    done.append(f"{g.name} bottom anchor {a.y}>{BOTTOM_ANCHOR}")
                    a.y = BOTTOM_ANCHOR
    for g in font:
        if len(g.components) < 2:
            continue
        b0 = g.components[0]
        if _is_mark(font, b0.baseGlyph):
            continue                                     # a mark made of marks
        base, bx, by = _root(font, b0.baseGlyph)
        bx, by = bx + b0.transformation[4], by + b0.transformation[5]
        if base not in font:
            continue
        for side in ("top", "bottom"):
            ba = _anchor(font[base], side)
            marks = [c for c in g.components[1:] if _anchor(font[c.baseGlyph], "_" + side)]
            if ba is None or not marks:
                continue
            ma = _anchor(font[marks[0].baseGlyph], "_" + side)
            t = marks[0].transformation
            dx, dy = round(ba[0] + bx - t[4] - ma[0]), round(ba[1] + by - t[5] - ma[1])
            if not (dx or dy):
                continue
            mk = font[marks[0].baseGlyph]
            if "_" in mk.name and mk.name not in combos:   # a mark drawn as two (ring and acute): it stands where
                combos.add(mk.name)                        # its letters put it (nested lower than the ring alone);
                for q in mk.anchors:                       # its anchor goes there, as align_anchors sets a letter's
                    if q.name == "_" + side:
                        q.x, q.y = q.x + dx, q.y + dy
                done.append(f"{mk.name} anchor ({dx:+d}, {dy:+d})")
                continue
            if side == "top" and marks[0].baseGlyph in DROP_MARKS and (dx, dy) == (0, -MARK_DROP):
                continue                                 # an ascender's dropped mark: kept where it was (MARK_DROP)
            if abs(dx) > 16 or abs(dy) > 16:            # (a lowercase macron's 13 or 14 is moved; a digraph is not)
                left.append(f"{g.name} {side} ({dx:+d}, {dy:+d})")
                continue
            for c in marks:
                t = c.transformation
                c.transformation = (t[0], t[1], t[2], t[3], t[4] + dx, t[5] + dy)
            done.append(f"{g.name} {side} ({dx:+d}, {dy:+d})")
    return {"moved": len(done), "left": left, "list": done}


# ---------------------------------------------------------------- 0.72: more glyphs, from the letters and parts
# What a UI face needs next (charset-0.47.md's gap list, and the keys, menus and tables of an interface): the
# fractions the font lacked, currency signs that are a capital and strokes, the remaining key symbols, menu dots,
# and solid shapes on the figures' height. Nothing here is drawn by hand: each is a finished letter, an existing
# glyph turned or cut, or geometry on the maths' axis at the maths' weight.

FRACTIONS = {0x2155: (1, 5), 0x2156: (2, 5), 0x2157: (3, 5), 0x2158: (4, 5), 0x2159: (1, 6), 0x215A: (5, 6),
             0x2150: (1, 7), 0x2151: (1, 9)}
FRAC_NAMES = {0x2155: "onefifth", 0x2156: "twofifths", 0x2157: "threefifths", 0x2158: "fourfifths",
              0x2159: "onesixth", 0x215A: "fivesixths", 0x2150: "oneseventh", 0x2151: "oneninth"}


def fractions(font):
    """As the fractions the font has: a superior, the bar, an inferior. The figures stand where one eighth's stand
    (their ink centres), the bar is one eighth's."""
    src = font["oneeighth"]
    num = next(c for c in src.components if c.baseGlyph.endswith("superior"))
    den = next(c for c in src.components if c.baseGlyph.endswith("inferior"))

    def centre(name):
        b = bounds(gp(font, name))
        return (b[0] + b[2]) / 2
    ncx = num.transformation[4] + centre(num.baseGlyph)
    dcx = den.transformation[4] + centre(den.baseGlyph)
    made = []
    for cp, (a, b) in FRACTIONS.items():
        name = FRAC_NAMES[cp]
        g = font.newGlyph(name) if name not in font else font[name]
        g.clearContours()
        g.clearComponents()
        for c in src.contours:
            c.draw(g.getPen())
        sup, inf = FIGS[a] + "superior", FIGS[b] + "inferior"
        g.components.append(Component(sup, (1, 0, 0, 1, round(ncx - centre(sup)), 0)))
        g.components.append(Component(inf, (1, 0, 0, 1, round(dcx - centre(inf)), 0)))
        g.width = src.width
        g.unicodes = [cp]
        COMPOSED.add(name)
        made.append(name)
    t = font.features.text
    anchor = "\tsub one [slash fraction] eight by oneeighth;"
    for cp, (a, b) in FRACTIONS.items():
        line = f"\tsub {FIGS[a]} [slash fraction] {FIGS[b]} by {FRAC_NAMES[cp]};"
        if line not in t and anchor in t:
            t = t.replace(anchor, anchor + "\n" + line, 1)
    font.features.text = t
    return made


# The figures of a fraction and its bar. 0.47 made the small figures larger (0.42 to 0.54 of the figure height) and
# left each fraction's figures where the smaller ones had stood: the numerator 4 to 22 units from the bar (two
# thirds touched it), where Georgia Pro keeps 55 to 99 and Serrif 78 to 89 (Libre Baskerville itself 74 to 103).
# Each figure's nearest ink now stands FRAC_GAP from the bar: the mean of the two references' nearest (55 and 78).
# The fraction keeps its side bearings; its advance follows.
FRAC_GAP = 66


def _seg_dist(p, a, b):
    vx, vy = b[0] - a[0], b[1] - a[1]
    L2 = vx * vx + vy * vy
    t = max(0.0, min(1.0, ((p[0] - a[0]) * vx + (p[1] - a[1]) * vy) / L2)) if L2 else 0.0
    return math.hypot(p[0] - a[0] - t * vx, p[1] - a[1] - t * vy)


def _outline_points(path, n=10):
    out, cur = [], None
    for verb, P in path.segments:
        if verb in ("moveTo", "lineTo"):
            if cur is not None and verb == "lineTo":
                for k in range(1, n):
                    out.append((cur[0] + (P[0][0] - cur[0]) * k / n, cur[1] + (P[0][1] - cur[1]) * k / n))
            cur = P[0]
            out.append(cur)
        elif verb == "curveTo":
            a = cur
            b, c, d = P
            for k in range(1, n + 1):
                t = k / n
                u = 1 - t
                out.append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
                            u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]))
            cur = d
    return out


def fraction_gap(font, g, comp):
    """The white between one figure of a fraction and its bar."""
    bar_ = [(p.x, p.y) for p in g.contours[0].points]
    t = comp.transformation
    pts = [(x + t[4], y + t[5]) for x, y in _outline_points(gp(font, comp.baseGlyph))]
    return min(_seg_dist(p, bar_[i], bar_[(i + 1) % len(bar_)]) for p in pts for i in range(len(bar_)))


FIG_ROUND = (-9, 721)    # the figures' round baseline and top (0 and 4's flats at 0 / 712)


def percent_fit(font):
    """0.83 (symbols 1): the percent and per-mille signs are set as the fractions are: their figures (a superior zero
    over the bar, inferior zeros under it) each FRAC_GAP from the bar, moved level only (they keep their heights);
    they stood 25 to 40 from it, so % was 1.06 x-heights wide (one half 1.18; the references' % 1.36 to 1.51)."""
    done = []
    for name in ("percent", "perthousand"):
        if name not in font or not font[name].components or len(font[name].contours) != 1:
            continue
        g = font[name]
        b0 = bounds(gp(font, name))
        lsb, rsb = b0[0], g.width - b0[2]
        sup = [c for c in g.components if c.baseGlyph.endswith("superior")]
        inf = [c for c in g.components if c.baseGlyph.endswith("inferior")]
        if not sup or not inf:
            continue
        near = min(inf, key=lambda c: c.transformation[4])
        # 0.84 (placement): on the figures' lines, as a figure stands: the superior zero's top on the figures' round
        # top (721), the inferior zeros' bottom on their round baseline (-9) (% stood 735 / -13, per mille 770 / -5)
        # 0.84 (pass 2, leftovers): the bar's ends on the figures' flat lines (0 and the cap, 712), as %'s: the per
        # mille's stood 752 at its top. The end's points move along the bar's own direction, the bar's weight kept
        Pb = g.contours[0].points
        ys_ = [q.y for q in Pb]
        for edge_y, line, sel in ((max(ys_), CAP_HEIGHT, lambda q, e: q.y > e - 25), (min(ys_), 0, lambda q, e: q.y < e + 25)):
            if edge_y == line:
                continue
            top_ = [q for q in Pb if q.y > max(ys_) - 25]
            bot_ = [q for q in Pb if q.y < min(ys_) + 25]
            ux = (sum(q.x for q in top_) / len(top_) - sum(q.x for q in bot_) / len(bot_))
            uy = (sum(q.y for q in top_) / len(top_) - sum(q.y for q in bot_) / len(bot_))
            dy = line - edge_y
            for q in [q for q in Pb if sel(q, edge_y)]:
                q.x, q.y = round(q.x + dy * ux / uy), q.y + dy
        for group, edge, line in ((sup, 3, FIG_ROUND[1]), (inf, 1, FIG_ROUND[0])):
            for c in group:
                t = c.transformation
                d = round(line - (bounds(gp(font, c.baseGlyph))[edge] + t[5]))
                c.transformation = (1, 0, 0, 1, t[4], t[5] + d)
        # 0.84 (pass 3, owner item 6): the per mille's inferior zeros stand one advance apart, as set (the heavier small
        # figures, 8 a side, ran its two lower zeros into each other)
        inf_s = sorted(inf, key=lambda c: c.transformation[4])
        for c0, c1 in zip(inf_s, inf_s[1:]):
            t0, t1 = c0.transformation, c1.transformation
            c1.transformation = (1, 0, 0, 1, t0[4] + font[c0.baseGlyph].width, t1[5])
        was = []
        for group, sign, probe in ((sup, -1, sup[0]), (inf, 1, near)):
            was.append(round(fraction_gap(font, g, probe)))
            t0 = [c.transformation for c in group]
            lo, hi = -150.0, 250.0
            for _ in range(26):
                mid = (lo + hi) / 2
                for c, t in zip(group, t0):
                    c.transformation = (1, 0, 0, 1, t[4] + sign * mid, t[5])
                if fraction_gap(font, g, probe) < FRAC_GAP:
                    lo = mid
                else:
                    hi = mid
            for c, t in zip(group, t0):
                c.transformation = (1, 0, 0, 1, round(t[4] + sign * hi), t[5])
        b1 = bounds(gp(font, name))
        d = round(lsb - b1[0])
        for c in g.components:
            t = c.transformation
            c.transformation = (1, 0, 0, 1, t[4] + d, t[5])
        for q in g.contours[0].points:
            q.x += d
        w0 = g.width
        g.width = round(lsb + (b1[2] - b1[0]) + rsb)
        done.append(f"{name} gaps {was[0]} / {was[1]} > {FRAC_GAP}, advance {w0} > {g.width}")
    return done


def euro_sign(font, m):
    """0.83 (symbols 1): the euro is Area's C and two level bars of the capitals' crossbar (a sign from a letter, as
    the colon sign is C and strokes): the bars where they were drawn (centres 0.43 and 0.60 of the cap), from 0.9 of
    the capital stem left of the C (as the peso's and the ruble's bars) to 0.66 of the C's width. It was its own
    narrow C (1.04 x-heights where Area's C is 1.17)."""
    if "euro" not in font or "C" not in font:
        return None
    C = gp(font, "C")
    cb = bounds(C)
    x0 = cb[0] - 0.9 * m.cap_stem
    x1 = cb[0] + 0.66 * (cb[2] - cb[0])
    bars_ = [rect(x0, band(y * CAP_HEIGHT, CURRENCY_BAR)[0], x1, band(y * CAP_HEIGHT, CURRENCY_BAR)[1]) for y in (0.43, 0.60)]
    STRUCK["euro"] = ("C", list(bars_))
    lsb, rsb = cb[0], font["C"].width - cb[2]
    put(font, "euro", union(C, *bars_), 0, list(font["euro"].unicodes) or [0x20AC], lsb=lsb, rsb=rsb)
    return f"euro {cb[2] - x0:.0f} wide (C {cb[2] - cb[0]:.0f})"


def fraction_names(font):
    return [g.name for g in font if g.components and len(g.contours) == 1 and g.name not in ("percent", "perthousand")
            and any(c.baseGlyph.endswith("inferior") for c in g.components)
            and any(c.baseGlyph.endswith("superior") for c in g.components)]


def fraction_fit(font):
    done = []
    for name in fraction_names(font):
        g = font[name]
        b0 = bounds(gp(font, name))
        lsb, rsb = b0[0], g.width - b0[2]
        was = []
        for comp in g.components:
            sign = -1 if comp.baseGlyph.endswith("superior") else 1     # the numerator moves left, the other right
            was.append(round(fraction_gap(font, g, comp)))
            t0 = comp.transformation
            lo, hi = -120.0, 200.0                                       # the move away from the bar, by bisection
            for _ in range(24):
                mid = (lo + hi) / 2
                comp.transformation = (1, 0, 0, 1, t0[4] + sign * mid, t0[5])
                if fraction_gap(font, g, comp) < FRAC_GAP:
                    lo = mid
                else:
                    hi = mid
            comp.transformation = (1, 0, 0, 1, round(t0[4] + sign * hi), t0[5])
        b1 = bounds(gp(font, name))
        d = round(lsb - b1[0])
        for comp in g.components:
            t = comp.transformation
            comp.transformation = (1, 0, 0, 1, t[4] + d, t[5])
        for p in g.contours[0].points:
            p.x += d
        g.width = round(lsb + (b1[2] - b1[0]) + rsb)
        done.append(f"{name} {was[0]} / {was[1]}")
    return done


def letter_currencies(font, m):
    """Naira, peso, tenge, bitcoin, kip, tugrik, guarani, colon: a capital and strokes, as the won, ruble and lira.
    Level bars are H's crossbar; upright and leaning strokes the capital hairline. 0.84: level bars too (CURRENCY_BAR)."""
    cb, S, hair = CURRENCY_BAR, m.cap_stem, STROKE_UP
    made = []

    def done(name, cp, path, letter):
        put(font, name, path, font[letter].width, [cp])     # no kerning: a currency sign stands before figures,
        made.append(name)                                   # and its bars reach past the letter's own sides

    # Where the strokes sit is measured on the references (0.74; 0.72 had placed them by eye): bar centres and
    # overshoots in cap heights, the mean of Georgia Pro and Serrif, or Georgia Pro alone where Serrif lacks the sign.
    def lev(y):                                            # a level bar of H's crossbar about y cap heights
        return band(y * CAP_HEIGHT, cb)
    N = gp(font, "N")
    x0, _, x1, _ = bounds(N)
    STRUCK["uni20A6"] = ("N", [rect(x0 - 10, lev(0.42)[0], x1 + 10, lev(0.42)[1]), rect(x0 - 10, lev(0.59)[0], x1 + 10, lev(0.59)[1])])
    done("uni20A6", 0x20A6, union(N, rect(x0 - 10, lev(0.42)[0], x1 + 10, lev(0.42)[1]),       # 0.426, 0.418
                                  rect(x0 - 10, lev(0.59)[0], x1 + 10, lev(0.59)[1])), "N")    # 0.595, 0.582
    P = gp(font, "P")
    ps = _stem_x(P, 200)
    px1 = bounds(P)[2]
    STRUCK["uni20B1"] = ("P", [rect(ps[0] - 0.9 * S, lev(0.62)[0], px1 + 0.25 * S, lev(0.62)[1]),
                               rect(ps[0] - 0.9 * S, lev(0.78)[0], px1 + 0.25 * S, lev(0.78)[1])])
    done("uni20B1", 0x20B1, union(P, rect(ps[0] - 0.9 * S, lev(0.62)[0], px1 + 0.25 * S, lev(0.62)[1]),   # 0.588, 0.645
                                  rect(ps[0] - 0.9 * S, lev(0.78)[0], px1 + 0.25 * S, lev(0.78)[1])), "P")  # 0.756, 0.810
    T = gp(font, "T")
    tb = bounds(T)
    arm = max(s[1] - s[0] for s in scan_v(T, tb[0] + 0.25 * (tb[2] - tb[0])))       # the arm's thickness (0.84: the
    #                                                   tenge's two bars are T's arm, its lower one T's own: kept 46)
    low = cut_out(T, 200, round((1 - 0.83) * CAP_HEIGHT))                            # T's top at 0.83 (Georgia Pro 0.829)
    done("uni20B8", 0x20B8, union(low, rect(tb[0], CAP_HEIGHT - arm, tb[2], CAP_HEIGHT)), "T")
    B = gp(font, "B")
    bs = _stem_x(B, 200)
    out = round(0.155 * CAP_HEIGHT)                                                  # 0.14 / 0.13 and 0.18 / 0.18
    xs = (round(bs[1] + 0.35 * S), round(bs[1] + 1.75 * S))
    stubs = [rect(x, -out, x + hair, 20) for x in xs] + [rect(x, CAP_HEIGHT - 20, x + hair, CAP_HEIGHT + out) for x in xs]
    STRUCK["uni20BF"] = ("B", list(stubs))
    done("uni20BF", 0x20BF, union(B, *stubs), "B")
    K = gp(font, "K")
    ks = _stem_x(K, 200)
    STRUCK["uni20AD"] = ("K", [rect(ks[0] - 0.9 * S, lev(0.51)[0], ks[1] + 2.4 * S, lev(0.51)[1])])
    done("uni20AD", 0x20AD, union(K, rect(ks[0] - 0.9 * S, lev(0.51)[0], ks[1] + 2.4 * S, lev(0.51)[1])), "K")   # Georgia Pro 0.510
    ts = _stem_x(T, 200)
    cx = (ts[0] + ts[1]) / 2
    STRUCK["uni20AE"] = ("T", [bar((cx - 1.3 * S, 0.30 * CAP_HEIGHT), (cx + 1.3 * S, 0.44 * CAP_HEIGHT), cb),
                               bar((cx - 1.3 * S, 0.46 * CAP_HEIGHT), (cx + 1.3 * S, 0.60 * CAP_HEIGHT), cb)])
    done("uni20AE", 0x20AE, union(T, bar((cx - 1.3 * S, 0.30 * CAP_HEIGHT), (cx + 1.3 * S, 0.44 * CAP_HEIGHT), cb),
                                  bar((cx - 1.3 * S, 0.46 * CAP_HEIGHT), (cx + 1.3 * S, 0.60 * CAP_HEIGHT), cb)), "T")
    out = round(0.14 * CAP_HEIGHT)                                                   # Georgia Pro 0.16 below, 0.12 above
    G = gp(font, "G")
    gb = bounds(G)
    gx = band(gb[0] + 0.50 * (gb[2] - gb[0]), hair)
    STRUCK["uni20B2"] = ("G", [rect(gx[0], -out, gx[1], CAP_HEIGHT + out)])
    done("uni20B2", 0x20B2, union(G, rect(gx[0], -out, gx[1], CAP_HEIGHT + out)), "G")
    C_ = gp(font, "C")
    c0 = bounds(C_)
    ccx = c0[0] + 0.50 * (c0[2] - c0[0])
    lean = 0.16 * CAP_HEIGHT
    strokes = [bar((ccx + dx - lean / 2, -out - 40), (ccx + dx + lean / 2, CAP_HEIGHT + out + 40), hair) for dx in (-0.55 * S, 0.55 * S)]
    p = union(C_, *strokes)
    clip = union(rect(-500, -500, 3000, -out), rect(-500, CAP_HEIGHT + out, 3000, 3000))
    STRUCK["uni20A1"] = ("C", [op(s_, clip, pathops.PathOp.DIFFERENCE) for s_ in strokes])
    p = op(p, clip, pathops.PathOp.DIFFERENCE)
    done("uni20A1", 0x20A1, p, "C")
    return made


DAGGER = dict(w0=22, d=78)          # the asterisk's arm where it leaves its centre, and its round end (as read)
DAGGER_W0 = 32                      # 0.83 (consistency 0e): the daggers' arms leave their crossings at the ladder's least
                                    # stroke (the branch neck, 32), not the asterisk's 22: a long arm at 22 read light


# 0.84 (Regular pass 4, item 7; the cohesion study: † ‡ read thin and short beside the letters, their ink 0.63 / 0.81 of
# the references', their top on the cap height). The daggers as letters: the upright the lowercase stem (DAGGER_UP,
# n's 78) from its round head down to the crossing, tapering below it to a round foot of the hairline (o's top, 43);
# the side arms the capitals' thin strokes' weight, leaving at DAGGER_SIDE[0] (50, the A's and H's crossbar class)
# and swelling to a round end of DAGGER_SIDE[1] (54); the head on the ascender line (b d h k l, 780), the foot on the
# overshoot (-9). The cross keeps the asterisk's arm length (its reach), and the head is that far over the crossing,
# so the head of the cross is square; the double dagger's two crossings mirror about the middle of its height.
DAGGER_UP = 78
DAGGER_SIDE = (50, 54)
DAGGER_FOOT = 43
DAGGER_TOP = 780


def dagger_info(font, name):
    """The dagger's construction: the asterisk's arm length (its reach), read from the finished asterisk."""
    if "asterisk" not in font:
        return None
    ab = bounds(gp(font, "asterisk"))
    acy = round((ab[1] + ab[3]) / 2)                     # its centre (its arms' junction)
    arm = ab[3] - acy
    over = -9                                            # the capitals' and figures' overshoot under the baseline
    top = DAGGER_TOP
    xs = [top - arm]
    if name == "daggerdbl":
        xs = [top + over - (top - arm), top - arm]       # whole units, mirrored about the middle of the height
    return dict(build="dagger", params=dict(cx=0, crossings=xs, top=top, bottom=over, reach=arm, w0=DAGGER_W0,
                                            d=DAGGER["d"], up=DAGGER_UP, foot=DAGGER_FOOT, side=DAGGER_SIDE[0],
                                            side_d=DAGGER_SIDE[1]))


def more_symbols(font, m, adv):
    w, cy = m.math, m.math_y
    made = []

    def add(name, cp, path, side=50):
        g_ = put(font, name, path, 0, cp if isinstance(cp, list) else [cp], lsb=side, rsb=side)
        soft_flags(g_)
        made.append(name)

    # menu dots: the period's dot, three of them, at the ellipsis's pitch
    dot = gp(font, "period")
    db = bounds(dot)
    el = bounds(gp(font, "ellipsis"))
    pitch = (el[2] - el[0] - (db[2] - db[0])) / 2
    dcx, dcy = (db[0] + db[2]) / 2, (db[1] + db[3]) / 2
    add("uni22EF", 0x22EF, union(*[moved(dot, k * pitch - dcx, cy - dcy) for k in (0, 1, 2)]), side=db[0])
    add("uni22EE", 0x22EE, union(*[moved(dot, -dcx, cy + k * pitch - dcy) for k in (-1, 0, 1)]), side=db[0])
    # keys. control: the arrows' head alone; tab: an arrow to a bar; return: the left arrow, its shaft turned up;
    # delete forward: erase to the left turned over; caps lock: shift over a bar
    ar = gp(font, "arrowright")
    ab = bounds(ar)
    au = gp(font, "arrowup")
    ub = bounds(au)
    # 0.83 (symbols 1): the arrows' head as its own construction (signs.caret): the arrows' head stroke (the arm's
    # run along the shaft), its point at the top of the key box (it followed the up arrow's point)
    a_ = math.radians(ARROW_HALF)
    hd_ = ARROW_ARM * math.sin(a_)
    tip_ = w / 2 / math.sin(a_)                             # the outer point above the centrelines' meeting
    key_top = cy + 0.80 * CAP_HEIGHT / 2
    put_built(font, "uni2303", dict(build="caret", params=dict(t=w, head=hd_, run=hd_, soft=True, apex=[(ub[0] + ub[2]) / 2, key_top - tip_])),
              0, [0x2303], lsb=ub[0], rsb=ub[0])
    made.append("uni2303")
    # 0.83 (symbols 2): the tab arrows and the return key of the gentle taper (signs.tarrow): the tab arrow's bar at
    # the point is a stroke across it, its back straight, its face thinning from the round ends (the head's span) to
    # the hairline where the arms run into it; the return key's shaft turns up at its tail into a riser to the up
    # arrow's point, the stroke widening from the head along shaft and riser to the riser's round end
    L_ = ARROW_LENGTH * cy
    tp = dict(L=L_, arm=ARROW_ARM, half=ARROW_HALF, w0=m.hair, w1=TAPER_END * w, flat=TAPER_FLAT)
    put_built(font, "uni21E5", dict(build="tarrow", params=dict(tp, kind="bar", bar_w=TAB_BAR * w, at=[L_ / 2, cy])), 0, [0x21E5], lsb=44, rsb=44)
    made.append("uni21E5")
    put_built(font, "uni21E4", dict(build="tarrow", params=dict(tp, kind="bar", bar_w=TAB_BAR * w, at=[L_ / 2, cy], rot=180)), 0, [0x21E4],
              lsb=44, rsb=44)
    made.append("uni21E4")
    put_built(font, "uni21B5", dict(build="tarrow", params=dict(tp, kind="ret", rise=ub[3] - cy, at=[L_ / 2, cy], mirror=True)),
              0, [0x21B5, 0x23CE], lsb=44, rsb=44)
    made.append("uni21B5")
    add("uni2326", 0x2326, moved(gp(font, "uni232B"), 0, 0, -1, 1))
    # caps lock (U+21EA): built with the shift arrow in interface() (owner round 8, 0.82)
    # 0.83 (symbols 1): the geometric shapes, one size and one axis. The circle (the key box, 0.80 cap across) is the
    # measure: the square's area is the circle's (side 0.886 of the diameter); the pointed shapes' (the triangles,
    # the diamond) 0.70 of it, their corners carrying less ink to the eye (an equilateral triangle 0.977 of the
    # diameter tall, the diamond 1.049 across its points; they were 0.87 and 1.00, the triangle 0.56 of the circle's
    # area beside the square's 0.98). Each is centred on the maths axis (they stood 30 over it); a triangle by its
    # optical middle, half way between its box's middle and its centroid; the small triangles are the large ones at
    # 0.55; the stars on their centre point
    cb_ = bounds(gp(font, "uni25CF"))
    D = cb_[3] - cb_[1]
    R = D / 2
    oy = cy
    A_c = math.pi * R * R
    th_ = math.sqrt(POINTED * A_c * math.sqrt(3))              # the triangle's height: h^2 / sqrt(3) = 0.70 of the circle
    sd_ = 2 * th_ / math.sqrt(3)
    # 0.84 (placement): a triangle's box on the axis, as every other shape's. Half way between the box's middle and
    # the centroid (0.83) left ▲ 41 over the axis by its box and ▴ 23; of 79 faces measured with ▲ and a minus,
    # the serif ones put the box's middle within 0.03 of the height of the axis (Times New Roman +0.020, Literata
    # -0.008, Shippori Mincho +0.02), none the centroid (it falls 0.14 to 0.28 of the height under it)
    lift = -th_ / 2
    import signs as SG                                      # 0.83 (symbols 2): every shape's outer corners soft (7)
    tri = shape(SG.soften([(-sd_ / 2, lift), (sd_ / 2, lift), (0, lift + th_)]))
    tb_ = bounds(tri)
    tri = moved(tri, 0, -(tb_[1] + tb_[3]) / 2)             # the soft corners cut the point more than the base
    for name, cp, rot, sc in (("uni25B2", 0x25B2, 0, 1), ("uni25BC", 0x25BC, 180, 1), ("uni25B6", 0x25B6, -90, 1),
                              ("uni25C0", 0x25C0, 90, 1), ("uni25B4", 0x25B4, 0, 0.55), ("uni25BE", 0x25BE, 180, 0.55),
                              ("uni25B8", 0x25B8, -90, 0.55), ("uni25C2", 0x25C2, 90, 0.55)):
        add(name, cp, moved(moved(tri, 0, 0, sc, sc, rot), 0, oy))
    q = math.sqrt(A_c) / 2
    sq_ = [(-q, oy - q), (q, oy - q), (q, oy + q), (-q, oy + q)]
    add("uni25A0", 0x25A0, shape(SG.soften(sq_)))
    put_built(font, "uni25A1", dict(build="frame", params=dict(t=w, outer=[list(v) for v in sq_], stress=list(SIGN_A), soft=True)),
              0, [0x25A1], lsb=50, rsb=50)
    made.append("uni25A1")
    dg = math.sqrt(POINTED * A_c * 2) / 2
    add("uni25C6", 0x25C6, shape(SG.soften([(0, oy - dg), (dg, oy), (0, oy + dg), (-dg, oy)])))

    def star_pts(r_out, r_in):
        pts = []
        for i in range(10):
            a = math.radians(90 + 36 * i)
            r = r_out if i % 2 == 0 else r_in
            pts.append((r * math.cos(a), oy + r * math.sin(a)))
        return pts

    def star(r_out, r_in):
        return shape(SG.soften(star_pts(r_out, r_in)))
    R5 = R * 1.08
    r_in = 0.382 * R5
    # the white star's inside: the same star, each edge moved in by the maths' stroke
    a0, a1 = math.radians(90), math.radians(126)
    p0, p1 = (R5 * math.cos(a0), R5 * math.sin(a0)), (r_in * math.cos(a1), r_in * math.sin(a1))
    d0 = abs(p0[0] * p1[1] - p0[1] * p1[0]) / math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    kk = (d0 - w) / d0
    add("uni2605", 0x2605, star(R5, r_in))
    put_built(font, "uni2606", dict(build="frame", params=dict(t=w, outer=[list(v) for v in star_pts(R5, r_in)],
                                                               stress=list(SIGN_A), soft=True)), 0, [0x2606], lsb=50, rsb=50)
    made.append("uni2606")
    # 0.83 (symbols 1): the daggers are the reference marks' arm (signs.dagger, as the asterisk's: thin where it
    # leaves the crossing, swelling to a round end), one family with the asterisk: the crossing at the asterisk's
    # centre, the upper and side arms the asterisk's arm length, its waist and its round end (the ink's 22 and 78);
    # the lower arm down to the baseline (the round end's foot at the overshoot). They were a spear 0.33 cap under
    # the baseline, 1.84 x-heights tall, heaviest (1.68 stems) under the cross. The double dagger is the same at two
    # crossings, the asterisk's centre and its mirror about half the cap height
    for name in ("dagger", "daggerdbl"):
        if name not in font:
            continue
        info = dagger_info(font, name)
        if info is None:
            continue
        put(font, name, built_path(info), 0, list(font[name].unicodes), lsb=50, rsb=50)
        made.append(name)
    return made


# Two letters in one glyph (IJ, ij, and the DZ, LJ, NJ sets) are those letters set side by side: each at the advance
# of the one before, their kerning between them, the glyph's advance their sum. They kept the offsets Libre
# Baskerville gave them for its own letters: J has since moved 220 units in its advance, so IJ's J hung 100 units
# out of the glyph and every letter after it ran into it (IJ before Y overlapped by 168).
def numero(font):
    """The numero sign is N and the masculine ordinal after it, the ordinal on N's advance (its ink ran 337 units
    past the glyph's own advance, left where Libre Baskerville's narrower N had it)."""
    if "numero" not in font:
        return []
    n_w = font["N"].width
    o = font["ordmasculine"]
    was = font["numero"].width
    compose(font, "numero", [("N", 0, 0), ("ordmasculine", n_w - 12, 0)], n_w - 12 + o.width, list(font["numero"].unicodes))
    return [f"numero {was}>{font['numero'].width}"]


def digraphs(font):
    import unicodedata
    letter = lambda n: any(unicodedata.category(chr(u)) in ("Lu", "Ll", "Lt", "Lo") for u in font[n].unicodes) \
        and font[n].width > 0 and n not in MARKS_SPACING and not n.startswith("ord")   # not accents, not ª º
    done = []
    for g in font:
        if len(g.components) < 2 or g.name in COMPOSED or not letter(g.components[0].baseGlyph) \
                or not letter(g.components[1].baseGlyph):
            continue
        x, prev = 0, None
        for comp in g.components:
            n = comp.baseGlyph
            if letter(n):
                if prev is not None:
                    x += _kern(font, prev, n)
                t = comp.transformation
                d = x - t[4]
                comp.transformation = (t[0], t[1], t[2], t[3], x, t[5])
                x += font[n].width
                prev, last_d = n, d
            else:                                       # a mark on the letter before it moves with that letter
                t = comp.transformation
                comp.transformation = (t[0], t[1], t[2], t[3], t[4] + last_d, t[5])
        was = g.width
        g.width = x
        first = next(c.baseGlyph for c in g.components if letter(c.baseGlyph))
        kern_like(font, g.name, first, prev)
        done.append(f"{g.name} {was}>{x}")
    return done


# ---------------------------------------------------------------- 0.74: the verification pass on 0.73
# docs/research/serif-evaluation-2026-11-13/tools/verify.py re-read every glyph by second methods. What it found
# that is a shape lives here; each rule has its check in audit_charset.py.

def band(centre, w):
    """A stroke w thick about `centre`, on whole units (a stroke centred on a half unit rounded to w - 1 or w + 1:
    t-bar's bar 48 beside d-bar's 49, guarani's stroke 46 beside the dollar's 47)."""
    lo = round(centre - w / 2)
    return lo, lo + round(w)


def cut_out(path, y, by, x0=-3000, x1=3000):
    """Shortens a shape by `by` at height y: what is above comes down, nothing is scaled. The cut must cross only
    upright strokes. (0.72 scaled T to 0.80 for the tenge and the shift arrow for caps lock, which thinned T's arm
    from 46 to 37 and the arrow's level strokes from 52 to 42; 0.47 scaled the product sign's stems to 74.)"""
    low = op(path, rect(x0, y, x1, 5000), pathops.PathOp.DIFFERENCE)
    high = op(path, rect(x0, -5000, x1, y + by), pathops.PathOp.DIFFERENCE)
    return union(low, moved(high, 0, -by))


def narrow(path, x, by):
    """The same sideways: the part right of x + by moves left by `by` (the cut must cross only level strokes)."""
    left = op(path, rect(x, -5000, 5000, 5000), pathops.PathOp.DIFFERENCE)
    right = op(path, rect(-5000, -5000, x + by, 5000), pathops.PathOp.DIFFERENCE)
    return union(left, moved(right, -by, 0))


# Dots. Libre Baskerville's dots are circles (131 by 131). derive thickens level strokes and charset.lighten_rest
# thins upright ones, so every dot outside i and j had become an oval, 7 units taller than wide (the period 123 by
# 130), and dots that are one dot had drifted apart by a unit (colon 124, period 123; the dieresis's two dots 110
# and 111; the division sign's 125 and 124 tall; the inverted marks 118 against 117). A dot is a circle of its
# family's width, on whole units (an even diameter); a glyph made of another's dots carries those dots.
DOT_GLYPHS = {  # glyph: which edge of each dot holds its place ("bottom" for dots that stand on a line)
    "period": "bottom", "exclam": "bottom", "question": "bottom", "periodcentered": "centre", "divide": "centre",
    "dieresis": "centre", "dieresiscomb": "centre", "dieresis.case": "centre", "dieresiscomb.case": "centre",
    "dotaccent": "centre", "dotaccentcomb": "centre", "dotaccent.case": "centre", "dotaccentcomb.case": "centre",
    "dotbelow": "centre", "dotbelowcomb": "centre", "dotbelowcomb.case": "centre", "bulletoperator": "centre",
}


def _is_dot(c):
    P = c.points
    xs, ys = [p.x for p in P], [p.y for p in P]
    w, h = max(xs) - min(xs), max(ys) - min(ys)
    return 60 <= w < CLEAN.DOT_MAX and 60 <= h < CLEAN.DOT_MAX and 0.85 < w / h < 1.18 and not any(p.type == "line" for p in P)


def _circle_into(c, cx, cy, r):
    from ufoLib2.objects import Point
    k = round(r * KAPPA)
    pts = [(cx + r, cy, "curve"), (cx + r, cy + k, None), (cx + k, cy + r, None), (cx, cy + r, "curve"),
           (cx - k, cy + r, None), (cx - r, cy + k, None), (cx - r, cy, "curve"), (cx - r, cy - k, None),
           (cx - k, cy - r, None), (cx, cy - r, "curve"), (cx + k, cy - r, None), (cx + r, cy - k, None)]
    c.points[:] = [Point(x, y, t, smooth=bool(t)) for x, y, t in pts]


def round_dots(font):
    done = []
    for name, hold in DOT_GLYPHS.items():
        if name not in font:
            continue
        g = font[name]
        dots = [c for c in g.contours if _is_dot(c)]
        if not dots:
            continue
        d = 2 * round(min(max(p.x for p in c.points) - min(p.x for p in c.points) for c in dots) / 2)
        was = []
        for c in dots:
            xs, ys = [p.x for p in c.points], [p.y for p in c.points]
            was.append((max(xs) - min(xs), max(ys) - min(ys)))
            cx = round((min(xs) + max(xs)) / 2)
            cy = min(ys) + d // 2 if hold == "bottom" else round((min(ys) + max(ys)) / 2)
            _circle_into(c, cx, cy, d // 2)
        done.append(f"{name} {was[0][0]}x{was[0][1]}>{d}")
    return done


def _dot_of(font, name):
    c = next(c for c in font[name].contours if _is_dot(c))
    xs, ys = [p.x for p in c.points], [p.y for p in c.points]
    return c, (min(xs) + max(xs)) / 2, min(ys), (min(ys) + max(ys)) / 2


def _place_dot(font, target_contour, src, hold):
    """Makes target_contour the dot of glyph `src`, where the target stood (its centre x; its bottom or its centre)."""
    from ufoLib2.objects import Point
    c, scx, sy0, scy = _dot_of(font, src)
    xs, ys = [p.x for p in target_contour.points], [p.y for p in target_contour.points]
    dx = round((min(xs) + max(xs)) / 2 - scx)
    dy = round(min(ys) - sy0) if hold == "bottom" else round((min(ys) + max(ys)) / 2 - scy)
    target_contour.points[:] = [Point(p.x + dx, p.y + dy, p.type, smooth=p.smooth) for p in c.points]


# 0.84 (Regular pass 2, placement). The census found ’ and ‘ one drawing turned half round but spaced apart (’ 63 / 52,
# advance 252; ‘ 55 / 57, 249; the doubles 63 / 52 against 55 / 58), ‘ a unit under ’ (808, 809), the low quotes a
# drawing of their own beside the comma, and the modifier apostrophe ʼ a smaller drawing. The rules: a turned pair
# is turned whole, its sides swapped and its top on the other's (the closing quote is the drawing, as the apostrophe
# the text uses most); a double quote is two of its single at the single's sides and height, the gap between them
# kept; the low single quote is the comma (Times New Roman, Lora, Inter; Georgia Pro draws its own), keeping its
# sides; ʼ is ’ (as ʻ is ‘). The inverted ! and ? keep their own sides (OPTICAL_MORE fitted ¡).
DOUBLES = (("quoteleft", "quotedblleft"), ("quoteright", "quotedblright"), ("quotesinglbase", "quotedblbase"),
           ("quotesingle", "quotedbl"))


def _shift(g, dx, dy):
    for c in g.contours:
        for p in c.points:
            p.x, p.y = round(p.x + dx), round(p.y + dy)


def _turn_pair(font, src, dst):
    rsb = font[dst].width - bounds(gp(font, dst))[2]
    _turned(font, src, dst)
    if dst == "quoteleft":
        sb, db = bounds(gp(font, src)), bounds(gp(font, dst))
        _shift(font[dst], (font[src].width - sb[2]) - db[0], sb[3] - db[3])
        font[dst].width = font[src].width
    else:
        font[dst].width = round(bounds(gp(font, dst))[2] + rsb)


def _double(font, single, double):
    g = font[double]
    old = sorted((bounds(_contour_path(c)) for c in g.contours), key=lambda b: b[0])
    sb = bounds(gp(font, single))
    gap = round(old[len(old) // 2][0] - old[0][0])     # the second single's place (each single may be contours)
    if double == "quotedblleft" and "quotedblright" in font:   # the turned pair's one gap (184 and 185)
        o2 = sorted((bounds(_contour_path(c)) for c in font["quotedblright"].contours), key=lambda b: b[0])
        gap = round(o2[len(o2) // 2][0] - o2[0][0])
    g.clearContours()
    pen = g.getPen()
    for k in range(2):
        font[single].draw(TransformPen(pen, Transform(1, 0, 0, 1, k * gap, 0)))
    g.width = round(font[single].width + gap)
    REBUILT.add(double)


def low_quote(font):
    """The low single quote is the comma, its sides kept."""
    if "comma" not in font or "quotesinglbase" not in font:
        return
    g = font["quotesinglbase"]
    b = bounds(gp(font, "quotesinglbase"))
    lsb, rsb = b[0], g.width - b[2]
    put(font, "quotesinglbase", gp(font, "comma"), 0, list(g.unicodes), lsb=round(lsb), rsb=round(rsb))


def _turned(font, src, dst):
    """dst is src turned half round within dst's own box (inverted marks, the opening quote)."""
    from fontTools.pens.transformPen import TransformPen as TP
    s, d = font[src], font[dst]
    sb, db = bounds(gp(font, src)), bounds(gp(font, dst))
    lsb, top = round(db[0]), round(db[3])
    d.clearContours()
    s.draw(TP(d.getPen(), Transform(-1, 0, 0, -1, sb[0] + sb[2], sb[1] + sb[3])))
    nb = bounds(gp(font, dst))
    dx, dy = round(lsb - nb[0]), round(top - nb[3])
    for c in d.contours:
        for p in c.points:
            p.x, p.y = round(p.x + dx), round(p.y + dy)
    REBUILT.add(dst)


def turned_pairs(font):
    """Again at the very end of the build: the node and join rules run after charset and may cut a curve of one
    glyph and not of its turned twin."""
    for src, dst in (("exclam", "exclamdown"), ("question", "questiondown"), ("quoteright", "quoteleft")):
        _turn_pair(font, src, dst)
    for single, double in DOUBLES:
        _double(font, single, double)


def no_steps(font, names=("Germandbls",)):
    """0.83 (Regular pass, consistency 1): a stroke's foot is one corner. Where a level line under 20 units near the
    baseline is followed by a short line into a curve (ẞ's lower stroke: (314,12)-(329,12)-(358,56), a 15-unit step
    between the spur's foot and the bowl's outer curve), the step's two corners go and the curve leaves from the foot's
    corner (its first handle kept: it runs level out of the foot)."""
    done = []
    for name in names:
        if name not in font:
            continue
        for c in font[name].contours:
            P = c.points
            n = len(P)
            for i in range(n):
                a, b, d = P[i], P[(i + 1) % n], P[(i + 2) % n]
                if a.type == "line" and b.type == "line" and d.type == "line" and P[(i + 3) % n].type is None \
                        and a.y == b.y and abs(a.y) < 20 and 0 < abs(b.x - a.x) < 20 and d.y > b.y:
                    for q in sorted(((i + 1) % n, (i + 2) % n), reverse=True):
                        del c.points[q]
                    done.append(f"{name} step at ({a.x},{a.y})")
                    break
    return done


BALL_CAP = 1.10 * 88              # the round end at the capitals' size (J 98.5; 1.10 of the lowercase's 88)
QUESTION_BALL = 105.2              # ?'s ball as drawn (largest inscribed circle)


def question_ball(font):
    """0.83 (Regular pass, consistency 1): ?'s ball is a round end at the capitals' size (BALL_CAP; it was 105, the
    heaviest ball in the face beside c's and r's). The ball, from the stroke's top to the neck's node under the ball,
    is scaled about the top node (the outer stroke's level extreme, which stays); the neck's next handle moves with
    its node. ¿ is ? turned (one_drawing)."""
    c = max(font["question"].contours, key=lambda c_: len(c_.points))
    P, n = c.points, len(c.points)
    top = max((i for i, p in enumerate(P) if p.type), key=lambda i: (P[i].y, -P[i].x))
    on = [k % n for k in range(top + 1, top + n) if P[k % n].type]
    if len(on) < 4:
        return "question ball: not found"
    left, bottom, neck = on[0], on[1], on[2]
    if not (P[left].x < P[top].x and P[bottom].y < P[left].y and P[neck].x > P[bottom].x):
        return "question ball: not found"
    k = BALL_CAP / QUESTION_BALL
    ox, oy = P[top].x, P[top].y
    span = [j % n for j in range(top + 1, neck + 1 if neck > top else neck + n + 1)]
    for j in span:
        dx, dy = (P[j].x - ox) * (k - 1), (P[j].y - oy) * (k - 1)
        P[j].x, P[j].y = round(P[j].x + dx), round(P[j].y + dy)
        if j == neck:
            P[(j + 1) % n].x, P[(j + 1) % n].y = round(P[(j + 1) % n].x + dx), round(P[(j + 1) % n].y + dy)
    return f"question ball {QUESTION_BALL} > {BALL_CAP:.1f}"


def one_drawing(font):
    """Glyphs that are another glyph's parts carry those parts: colon and semicolon the period's dot; the ellipsis
    three; the inverted marks the upright ones turned half round; the opening quote the closing one turned; the
    double quotes two singles; a bracket's two arms one thickness."""
    done = []
    for name, hold in (("colon", ("bottom", "centre")), ("semicolon", ("centre",)), ("ellipsis", ("bottom",) * 3)):
        g = font[name]
        dots = sorted((c for c in g.contours if _is_dot(c)), key=lambda c: (min(p.y for p in c.points), min(p.x for p in c.points)))
        for c, h in zip(dots, hold):
            _place_dot(font, c, "period", h)
        done.append(name)
    # 0.83 (Regular pass, consistency 1): one dot in the punctuation, the period's (124): ! and ? carried the i's (116)
    for name in ("exclam", "question"):
        dots = [c for c in font[name].contours if _is_dot(c)]
        if dots:
            _place_dot(font, min(dots, key=lambda c: min(p.y for p in c.points)), "period", "bottom")
    done.append(question_ball(font))
    low_quote(font)
    for src, dst in (("exclam", "exclamdown"), ("question", "questiondown"), ("quoteright", "quoteleft")):
        _turn_pair(font, src, dst)
        done.append(dst)
    for single, double in DOUBLES:
        _double(font, single, double)
        done.append(double)
    g = font["bracketleft"]                                # the upper arm 51, the lower 50: the lower's
    ys = sorted({p.y for c in g.contours for p in c.points})
    if len(ys) == 4 and (ys[3] - ys[2]) != (ys[1] - ys[0]):
        t = ys[1] - ys[0]
        for c in g.contours:
            for p in c.points:
                if p.y == ys[2]:
                    p.y = ys[3] - t
        done.append(f"bracketleft arms {ys[3] - ys[2]} / {t} > {t}")
    return done


# The macron. Both references draw one macron thickness for both cases (Georgia Pro 62 and 63 units, Serrif 49 and
# 49). Area's capital form was the capital hairline (47 or 48) and its lowercase form 59, heavier than the hyphen
# (52) and every level stroke of the lowercase. The lowercase form takes the capital form's thickness, about its
# own centre.
def macron_weight(font):
    done = []

    def thick(name):
        ys = sorted({p.y for c in font[name].contours for p in c.points})
        return ys[0], ys[-1]
    ref = thick("macroncomb.case")
    t = ref[1] - ref[0]
    for name in ("macron", "macroncomb", "macronbelowcomb", "uni0331"):
        if name not in font or not font[name].contours:
            continue
        lo, hi = thick(name)
        if hi - lo == t:
            continue
        nlo, nhi = band((lo + hi) / 2, t)
        for c in font[name].contours:
            for p in c.points:
                p.y = nlo if p.y == lo else nhi if p.y == hi else p.y
        done.append(f"{name} {hi - lo}>{t}")
    return done


# Marks that hang below. The ogonek reached -225 under A, -216 under I and U and -215 under a e i u E; the dot
# below reached -219 under the capitals Libre Baskerville composed and -208 under the horned capitals composed
# here. One depth for each (the commonest: -215 and -219).
BELOW = {"ogonek": -215, "dotbelow": -215}
# 0.84 (placement): the dot below on its anchor under every letter, the lowercase's -215 (the capitals' -219 stood 4
# under their anchor, the horned capitals' smaller capital form 10 over it); one form under both cases


def below_depths(font):
    done = []
    for g in font:
        if len(g.components) < 2:
            continue
        base = g.components[0].baseGlyph
        cap = base[:1].isupper()
        for comp in g.components[1:]:
            n = comp.baseGlyph
            kind = "ogonek" if n.startswith("ogonek") else "dotbelow" if n.startswith("dotbelow") else None
            if kind is None or (kind == "dotbelow" and not cap):
                continue
            t = comp.transformation
            low = bounds(gp(font, n))[1] + t[5]
            d = round(BELOW[kind] - low)
            if d and abs(d) <= 14:
                comp.transformation = (t[0], t[1], t[2], t[3], t[4], t[5] + d)
                done.append(f"{g.name} {d:+d}")
    return done


# ---------------------------------------------------------------- 0.75: the recommendations left open in 0.71
# Eng. All six faces looked at draw the capital as N with its right upright carried below the baseline into a
# hooked tail. Area's was Libre Baskerville's own N of that form, lightened: 125 across at its heaviest where N is
# 105, with its own width, diagonal and serifs. It is Area's N now, and the tail (what Libre Baskerville's Eng has
# under the baseline) on N's right upright. One line to change back: do not call eng_capital.
def eng_capital(font):
    name = next((g.name for g in font if 0x014A in g.unicodes), None)
    if name is None:
        return []
    old, N = gp(font, name), gp(font, "N")
    o_st, n_st = scan_h(old, 100)[-1], scan_h(N, 100)[-1]
    tail = op(old, rect(o_st[0] - 330, -3000, 3000, 30), pathops.PathOp.INTERSECTION)
    was = round(o_st[1] - o_st[0])
    g = put(font, name, union(N, moved(tail, n_st[1] - o_st[1])), font["N"].width)
    # 0.83 (Regular pass, consistency 1): the cut keeps only what hangs under the baseline. A piece of the old left
    # foot's serif (55 x 30, on the baseline right of N's left foot) fell inside the cut's box and stood apart
    for c in list(g.contours):
        ys = [q.y for q in c.points]
        if min(ys) >= -1 and max(ys) - min(ys) <= 40:
            g.contours.remove(c)
    kern_like(font, name, "N", "N")
    return [f"{name}: N and the tail (its upright {was}, N's {n_st[1] - n_st[0]:.0f})"]


# The degree sign's ring was 35 thick, under the half stem the guidelines set as the floor for a thin stroke (it
# breaks up at text sizes). It takes the capital hairline, 47, inside the same outer circle.
def degree_ring(font):
    b = bounds(gp(font, "degree"))
    g = font["degree"]
    cx, cy, rx, ry = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2, (b[2] - b[0]) / 2, (b[3] - b[1]) / 2
    put(font, "degree", ring(cx, cy, rx, ry, STROKE_UP, STROKE_UP), g.width)
    return [f"degree ring > {STROKE_UP}"]


# ---------------------------------------------------------------- run

def run(font, lightened):
    REBUILT.clear()
    COMPOSED.clear()
    before = snapshot(font)
    skipped = lighten_rest(font, set(lightened))
    m = M(font)
    print("charset: round dots", round_dots(font))                     # 0.74
    print("charset: one drawing", one_drawing(font))                   # 0.74
    print("charset: no steps", no_steps(font))                         # 0.83
    print("charset: extended capitals", ext_capitals(font))            # 0.83 (letters 3)
    print("charset: hooked lowercase", ext_lowercase(font))            # 0.83 (letters 4)
    print("charset: turned V", turned_v(font))                         # 0.83 (letters 7)
    print("charset: glottal stops", glottal_balls(font))               # 0.83 (letters 3)
    print("charset: macron", macron_weight(font))                      # 0.74
    dotless(font)
    bars(font, m)
    thorns(font, m)
    long_s(font)
    ligatures(font)
    small_figures(font)
    dashes(font, m)
    bullet(font, m)
    adv = tabular(font)
    math_widths(font, adv)
    features(font)
    arrows(font, m, adv)
    maths(font, m, adv)
    primes(font, m)
    currencies(font, m)
    spaces(font)
    interface(font, m, adv)
    print("charset: plain strokes", plain_strokes(font, m))            # 0.71
    print("charset: signs from letters", letter_signs(font, m))        # 0.71
    print("charset: brackets", bracket_extent(font))                   # 0.84 (placement)
    print("charset: guillemets", guillemets(font, m))                 # 0.84 (pass 4, item 4)
    print("charset: mirrored pairs", mirrors(font))                    # 0.71
    print("charset: eth", eth_ascender(font))                          # 0.84 (pass 4, item 8)
    print("charset: sign weights", cap_strokes(font))                  # 0.71
    print("charset: Eng", eng_capital(font))                           # 0.75
    print("charset: degree", degree_ring(font))                        # 0.75
    print("charset: fractions", fractions(font))                       # 0.72
    print(f"charset: fraction figures {FRAC_GAP} from the bar (they were)", fraction_fit(font))   # 0.72
    print("charset: currencies from capitals", letter_currencies(font, m))   # 0.72
    print("charset: euro", euro_sign(font, m))                         # 0.83
    print("charset: percent", percent_fit(font))                       # 0.83
    print("charset: symbols", more_symbols(font, m, adv))               # 0.72
    print("charset: kra", kra(font))                                   # 0.71
    letters_extra(font)
    eng_mu(font)
    diphthongs(font, m)
    ogonek_letters(font)
    for name, l, r in (("fi", "f", "i"), ("fl", "f", "l"), ("f_f", "f", "f"), ("f_f_i", "f", "i"), ("f_f_l", "f", "l"),
                       ("longs", "f", "f"), ("Dcroat", "D", "D"), ("dcroat", "d", "d"), ("Hbar", "H", "H"),
                       ("hbar", "h", "h"), ("Tbar", "T", "T"), ("tbar", "t", "t"), ("Lslash", "L", "L"),
                       ("lslash", "l", "l"), ("Oslash", "O", "O"), ("oslash", "o", "o"), ("thorn", "p", "p"), ("eng", "n", "n"), ("mu", "u", "u"), ("micro", "u", "u"),
                       ("Thorn", "I", "P")):
        kern_like(font, name, l, r)
    followed = follow_rebuilt(font, before)
    stacked = case_forms(font)                                         # 0.84 (placement)
    anchored = align_anchors(font)
    print("charset: capital marks", case_marks(font))                  # 0.71
    print(f"charset: capitals carry the capital marks, {len(stacked)} stacks", restack(font, stacked))   # 0.84
    centred, n_centred = centre_marks(font)                            # 0.71
    print(f"charset: marks centred on {len(centred)} anchors, {n_centred} letters follow", centred)
    print(f"charset: lowercase accents {MARK_DROP} closer on", drop_marks(font), "letters")   # 0.71
    hook_above(font)
    horns(font)
    viet = vietnamese(font)
    print("charset: marks below", below_depths(font))                  # 0.74
    print("charset: marks on their anchors", marks_on_anchors(font))   # 0.84 (placement)
    print("charset: digraphs", digraphs(font))                         # 0.73
    print("charset: numero", numero(font))                             # 0.73
    for g in font:                                    # 0.65: every outline, not only the ones this module wrote
        _drop_tiny(g)
    print(f"charset: Vietnamese, {viet} letters composed")
    print(f"charset: {followed} composites follow their rebuilt base; {anchored} anchors set from the precomposed letters")
    return len(skipped), adv


# ---------------------------------------------------------------- 0.83 Regular pass, letters 3: the extended capitals
# The audit (A5, A6): the capitals outside A-Z keep Libre Baskerville's first drawings' parts: head serifs 90 to 94 and
# feet 100 to 103 from the stem's edge (every core capital's 77, `balance.CAP_SERIF`), stems 101 to 103 on Ƭ Ʈ Ʋ
# (every capital stem 86), and the glottal stops' balls 106 to 112 across (the round end at the capitals' size, 96.8,
# which ? carries). The rules: an upright capital stem (the same two edges at 0.3 and 0.7 of its height) wider than
# the capital stem by EXT_STEM_MIN or more is the capital stem, both edges moving in by half the difference (every
# point on an edge's line moves with it); a serif slab at the foot or the head reaching EXT_SERIF_MIN to EXT_SERIF_MAX
# from its stem's edge is CAP_SERIF, its end (the tip and its two soft corners) moving in level; a glottal stop's ball
# is a round end, scaled about the stroke's top as ?'s is: the capitals' size where the letter stands to the cap height
# or over, the lowercase's (88) where it stands to the x-height.
EXT_STEM_MIN = 6
EXT_SERIF_MIN, EXT_SERIF_MAX = 80, 130
CAP_STEM_W = 86
LC_BALL = 88
GLOTTALS = ("glottalstop", "glottalstopreversed", "Glottalstopsmall", "glottalstopsmall")


# the capitals with upright stems that are first drawings (outside COVERAGE; the struck, barred and accented capitals
# and Æ Œ are built from the core letters and carry their parts already)
EXT_CAPS = ("Bhook", "Dhook", "Eturned", "Fhook", "Hhook", "Hturned", "Iota-latin", "Khook", "Nhookleft", "Phook",
            "Rtail", "Thook", "Tretroflexhook", "Vhook", "Yhook", "Glottalstopsmall")


# 0.83 (letters 7): Y's foot (102 from the stem, Libre Baskerville's) takes the capital serif too; its stem stands
# only under the arms, so it is read at FOOT_ONLY's shares of the height, and only the foot is read
FOOT_ONLY = {"Y": (0.12, 0.28), "Yhook": (0.12, 0.28)}


def _ext_capitals(font):
    return [n for n in EXT_CAPS + ("Y",) if n in font and font[n].contours]


def ext_capitals(font):
    """The stems and serifs of the capitals outside A-Z on the core capitals' parts (the rules above)."""
    from normalize import flatten, spans_at
    import balance as BALANCE
    done = []
    for name in _ext_capitals(font):
        g = font[name]
        top = max(p.y for c in g.contours for p in c.points)
        h = CAP_HEIGHT if top >= CAP_HEIGHT - 60 else top
        pts = [p for c in g.contours for p in c.points]
        notes = []
        fl = flatten(g)
        lo, hi = spans_at(fl, 0.3 * h), spans_at(fl, 0.7 * h)
        stems = [(a, b) for a, b in lo if any(abs(a - a2) <= 1.5 and abs(b - b2) <= 1.5 for a2, b2 in hi)]
        for a, b in stems:
            w = b - a
            if not CAP_STEM_W + EXT_STEM_MIN <= w <= CAP_STEM_W + 30:
                continue
            d = (w - CAP_STEM_W) / 2
            for edge, sg in ((a, 1), (b, -1)):
                for p in pts:
                    if abs(p.x - edge) <= 1:
                        p.x = round(p.x + sg * d)
            notes.append(f"stem {w:.0f}>{CAP_STEM_W}")
        fl = flatten(g)
        reads = ([(FOOT_ONLY[name][0] * h, 0, FOOT_ONLY[name][1] * h)] if name in FOOT_ONLY else
                 [(0.3 * h, 0, 0.7 * h), (0.7 * h, h, 0.3 * h)])
        for yq, line, y_other in reads:
            for a, b in spans_at(fl, yq):
                if not 60 <= b - a <= 125:
                    continue
                if not any(abs(a - a2) <= 1.5 and abs(b - b2) <= 1.5 for a2, b2 in spans_at(fl, y_other)):
                    continue
                for edge, sg in ((a, -1), (b, 1)):
                    tip = [p for p in pts if abs(p.y - line) <= 30 and EXT_SERIF_MIN - 20 <= (p.x - edge) * sg <= EXT_SERIF_MAX]
                    if len([p for p in tip if p.type]) < 3:
                        continue
                    proj = max((p.x - edge) * sg for p in tip)
                    if not EXT_SERIF_MIN <= proj <= EXT_SERIF_MAX:
                        continue
                    if any(proj + 2 < (p.x - edge) * sg <= proj + 40 for p in pts if abs(p.y - line) <= 30):
                        continue                         # not a slab's end: an arm or a bowl runs on past it
                    slab = [sp for sp in spans_at(fl, 8 if line == 0 else line - 8) if sp[0] <= a + 1 and sp[1] >= b - 1]
                    if not slab or abs((slab[0][1] - b if sg > 0 else a - slab[0][0]) - proj) > 3:
                        continue                         # the slab's own reach (a scan inside it) is not the tip's
                    far = edge + sg * proj
                    dd = round(BALANCE.CAP_SERIF - proj)
                    for p in tip:
                        if abs(p.x - far) <= 8:
                            p.x += sg * dd
                    notes.append(f"{'foot' if line == 0 else 'head'} {proj:.0f}>{BALANCE.CAP_SERIF}")
        if notes:
            done.append(f"{name}: " + ", ".join(notes))
    return done


def _inscribed(P, box, step=2.0):
    """The largest circle inside the contour P [(x, y)] polyline with its centre in box: (diameter, centre)."""
    import numpy as np
    A = np.array(P, float)
    B = np.roll(A, -1, axis=0)
    xs = np.arange(box[0], box[2], step)
    ys = np.arange(box[1], box[3], step)
    X, Y = np.meshgrid(xs, ys)
    Q = np.stack([X.ravel(), Y.ravel()], 1)
    inside = np.zeros(len(Q), bool)
    for (x1, y1), (x2, y2) in zip(A, B):                 # even-odd crossing count
        c = ((y1 > Q[:, 1]) != (y2 > Q[:, 1]))
        with np.errstate(divide="ignore", invalid="ignore"):
            xc = x1 + (Q[:, 1] - y1) * (x2 - x1) / (y2 - y1)
        inside ^= c & (Q[:, 0] < xc)
    Q = Q[inside]
    if not len(Q):
        return 0.0, None
    E = B - A
    L2 = (E ** 2).sum(1) + 1e-12
    best = (0.0, None)
    for q in Q:
        t = np.clip(((q - A) * E).sum(1) / L2, 0, 1)
        dist = np.sqrt(((A + E * t[:, None] - q) ** 2).sum(1)).min()
        if dist > best[0]:
            best = (float(dist), (float(q[0]), float(q[1])))
    return 2 * best[0], best[1]


def round_end_ball(font, name, target):
    """The ball of a ? shape (the stroke's top, then the ball's outer side, its bottom and the neck's node) scaled about
    the top node to `target` across (largest inscribed circle); a ball drawn on the right (ʕ) is read turned over."""
    from normalize import flatten
    g = font[name]
    c = max(g.contours, key=lambda c_: len(c_.points))
    P, n = c.points, len(c.points)
    top = max((i for i, p in enumerate(P) if p.type), key=lambda i: (P[i].y, -P[i].x))
    for direction in (1, -1):
        on = [(top + direction * k) % n for k in range(1, n) if P[(top + direction * k) % n].type]
        side, bottom, neck = on[0], on[1], on[2]
        if not (P[bottom].y < P[side].y < P[top].y and P[top].y - P[bottom].y < 160 and
                abs(P[neck].x - P[side].x) > abs(P[bottom].x - P[side].x)):
            continue
        poly = flatten(g)[font[name].contours.index(c)]
        x0, x1 = sorted((P[side].x, P[top].x + (P[top].x - P[side].x)))
        drawn, _c = _inscribed(poly, (x0, P[bottom].y, x1, P[top].y))
        if not drawn:
            return f"{name}: ball not read"
        k = target / drawn
        ox, oy = P[top].x, P[top].y
        span = [(top + direction * j) % n for j in range(1, ((neck - top) * direction) % n + 1)]
        for j in span:
            dx, dy = (P[j].x - ox) * (k - 1), (P[j].y - oy) * (k - 1)
            P[j].x, P[j].y = round(P[j].x + dx), round(P[j].y + dy)
            if j == neck:
                h_ = (j + direction) % n
                P[h_].x, P[h_].y = round(P[h_].x + dx), round(P[h_].y + dy)
        return f"{name} ball {drawn:.1f}>{target:.1f}"
    return f"{name}: ball not found"


def glottal_balls(font):
    out = []
    for name in GLOTTALS:
        if name in font:
            top = max(p.y for c in font[name].contours for p in c.points)
            out.append(round_end_ball(font, name, BALL_CAP if top > X_HEIGHT + 100 else LC_BALL))
            out.append(_even_ball(font, name))
    return out


def _even_ball(font, name):
    """After the ball is scaled, its smooth nodes at one curvature (`loops.even_nodes`, handle lengths only), as the
    symbols' curves are evened (`symbols.even_curves`): the scaled ball meets the unscaled neck."""
    import curvecheck as K
    import loops as LOOPS
    g = font[name]
    yr = (-1000, 2000)
    for c in g.contours:
        P = [(p.x, p.y, p.type, p.smooth) for p in c.points]
        b0, w0 = K.report(name, [P], yr)[:2]
        Q, _log = LOOPS.even_nodes(P, yr)
        Q = [(round(q[0]), round(q[1]), q[2], q[3]) for q in Q]
        b1, w1 = K.report(name, [Q], yr)[:2]
        if (len(b1), w1) < (len(b0), w0):
            for p, q in zip(c.points, Q):
                p.x, p.y = q[0], q[1]
            return f"{name} evened {w0:.2f}>{w1:.2f}"
    return f"{name} left"



# ---------------------------------------------------------------- 0.83 Regular pass, letters 4: the hooked lowercase
# The audit (B1): the IPA and hooked lowercase letters outside COVERAGE keep Libre Baskerville's first drawings' stems,
# 81 to 83 against the lowercase's 78 (n's), and their feet reach 76 to 105 from the stem against n's 70. The rule, the
# capitals' (letters 3) on the lowercase's own parts read from n: a stem is two upright straight edges facing each other
# (line segments of at least STEM_RUN, overlapping by as much) between n's stem and EXT_LC_MAX apart; it takes n's
# stem, both edges moving in by half the difference, every point on an edge's line (within the stem's height and its
# serifs') moving with it; a foot slab reaching from EXT_LC_FOOT up to EXT_SERIF_MAX from its stem's edge takes n's
# foot, its end moving in level. Flags are left (their angle and length: listed open).
EXT_LOWER = ("dhook", "dtail", "ghook", "hhook", "hturned", "iota-latin", "phook", "rfishhook", "rtail", "s_p", "s_t",
             "thook", "tretroflexhook", "vhook", "c_t", "glottalstop", "glottalstopreversed", "khook", "nhookleft",
             "Vhook")
STEM_RUN = 100
EXT_LC_MAX = 92
EXT_LC_FOOT = 74


def _upright_stems(g, lo, hi):
    """[(left x, right x, y0, y1)]: pairs of upright line segments lo..hi apart facing each other."""
    segs = []
    for c in g.contours:
        P, n = c.points, len(c.points)
        for i in range(n):
            a, b = P[i - 1], P[i]
            if b.type == "line" and a.type and a.x == b.x and abs(b.y - a.y) >= STEM_RUN:
                segs.append((a.x, min(a.y, b.y), max(a.y, b.y), 1 if b.y > a.y else -1))
    out = []
    for x1, a0, a1, d1 in segs:
        for x2, b0, b1, d2 in segs:
            if lo <= x2 - x1 <= hi and d1 != d2 and min(a1, b1) - max(a0, b0) >= STEM_RUN:
                out.append((x1, x2, max(a0, b0), min(a1, b1)))
    return out


def _foot_reach(g, edge, sg):
    pts = [p for c in g.contours for p in c.points]
    tip = [p for p in pts if abs(p.y) <= 30 and 40 <= (p.x - edge) * sg <= EXT_SERIF_MAX]
    if len([p for p in tip if p.type]) < 3:
        return None, tip, pts
    return max((p.x - edge) * sg for p in tip), tip, pts


def ext_lowercase(font):
    n = font["n"]
    st = _upright_stems(n, 60, 100)
    stem = st[0][1] - st[0][0]
    foot = _foot_reach(n, st[0][0], -1)[0]
    done = []
    for name in EXT_LOWER:
        if name not in font or not font[name].contours:
            continue
        g = font[name]
        target = CAP_STEM_W if name[0].isupper() else stem
        notes = []
        moves = {}                                     # an edge shared by two runs (a stem under an arch and the
        pairs = sorted(_upright_stems(g, target + 2, target + 20), key=lambda s_: s_[2] - s_[3])   # ascender) moves once
        for x1, x2, y0, y1 in pairs:
            if x1 in moves and x2 in moves:
                continue
            if x1 in moves:
                moves[x2] = (x1 + moves[x1][0] + target - x2, y0, y1)
            elif x2 in moves:
                moves[x1] = (x2 + moves[x2][0] - target - x1, y0, y1)
            else:
                d = (x2 - x1 - target) / 2
                moves[x1], moves[x2] = (d, y0, y1), (-d, y0, y1)
            notes.append(f"stem {x2 - x1}>{target}")
        for c in g.contours:
            for p in c.points:
                for edge, (d, y0, y1) in moves.items():
                    if abs(p.x - edge) <= 1 and y0 - 60 <= p.y <= y1 + 60:
                        p.x = round(p.x + d)
                        break
        if not name[0].isupper():
            for x1, x2, y0, y1 in _upright_stems(g, target - 1, target + 1):
                if y0 > 130:
                    continue
                for edge, sg in ((x1, -1), (x2, 1)):
                    proj, tip, pts = _foot_reach(g, edge, sg)
                    if proj is None or not EXT_LC_FOOT <= proj <= EXT_SERIF_MAX:
                        continue
                    if any(proj + 2 < (p.x - edge) * sg <= proj + 200 for p in pts if abs(p.y) <= 30):
                        continue
                    far = edge + sg * proj
                    dd = round(foot - proj)
                    for p in tip:
                        if abs(p.x - far) <= 8:
                            p.x += sg * dd
                    notes.append(f"foot {proj:.0f}>{foot:.0f}")
        if notes:
            done.append(f"{name}: " + ", ".join(notes))
    return done



# ---------------------------------------------------------------- 0.83 Regular pass, letters 7: small alignments
def turned_v(font):
    """Ʌ is V turned half round (it was its own drawing standing 2 low: feet at -11, apex at 710): V's points turned,
    its serifs on the baseline, its point at the capitals' overshoot (721), as Ǝ is E turned."""
    if "V" not in font or "Vturned" not in font:
        return "no V or Vturned"
    out = []
    for src, dst in (("V", "Vturned"), ("v", "vturned")):    # 0.84 (placement): ʌ is v turned too (its own
        if dst not in font:                                   # drawing stood with its point at 531)
            continue
        _turned(font, src, dst)
        g = font[dst]
        lo = min(p.y for c in g.contours for p in c.points)
        for c in g.contours:
            for p in c.points:
                p.y -= lo
        out.append(f"{dst}: {src} turned, feet on 0 (were {lo}), top {max(p.y for c in g.contours for p in c.points)}")
    return out
