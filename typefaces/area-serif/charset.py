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
        p = union(b, bar((cx - d, y - d * rise), (cx + d, y + d * rise), w))
        put(font, name, p, font[base].width)
    for name, (base, past, inset) in O_SLASH.items():
        b = gp(font, base)
        x0, y0, x1, y1 = bounds(b)
        w = (m.cap_bar if base.isupper() else m.low_bar)
        h = y1 - y0
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
    """f's arc run level into the ascender of `second`, placed at dx."""
    f, st, top = f_parts(font)
    s = gp(font, second)
    ss = _stem_x(s, 640)                                     # the ascender's stem
    s_noflag = op(s, rect(-100, 560, ss[0], 1000), pathops.PathOp.DIFFERENCE)
    cut_x = st[1] + 70
    f_cut = op(f, rect(cut_x, 560, 1000, 1000), pathops.PathOp.DIFFERENCE)
    bridge = rect(cut_x - 2, top[0], dx + ss[0] + 2, top[1])
    return union(f_cut, bridge, moved(s_noflag, dx))


def f_bars(font, f_path, dx_list):
    """The bars of f's at dx_list joined into one bar."""
    f = gp(font, "f")
    st = _stem_x(f, 300)
    sp = [s for s in scan_v(f, st[1] + 30) if s[0] > 400]
    b0, b1 = sp[0]
    return union(f_path, rect(dx_list[0] + st[1], b0, dx_list[-1] + st[0] + 1, b1))


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
SUP_BOLD = 4.0          # units added on each side after scaling
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
    CLEAN.lighten(font, names, -SUP_BOLD)
    for base, name in (("a", "ordfeminine"), ("o", "ordmasculine")):
        p = moved(gp(font, base), 0, 0, SUP_SCALE)
        x0, y0, x1, y1 = bounds(p)
        p = moved(p, 0, SUP_TOP - one_top * SUP_SCALE)               # the superior figures' baseline
        put(font, name, p, 0, list(font[name].unicodes), lsb=SUP_SIDE + 6, rsb=SUP_SIDE + 6)
    CLEAN.lighten(font, ["ordfeminine", "ordmasculine"], -SUP_BOLD)


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
    cy = (bounds(gp(font, "bullet"))[1] + bounds(gp(font, "bullet"))[3]) / 2
    cy = min(cy, X_HEIGHT / 2 + 20)
    put(font, "bullet", ellipse(0, cy, r, r), 0, list(g.unicodes), lsb=86, rsb=86)


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

def single_g(font):
    """g.ss02 (0.77; owner, 2026-11-14: "it would be nice to have an alternate, non decorative g"): a single-storey
    g from finished parts, nothing drawn. The bowl and stem are q's, cut at the baseline; below it the stem runs into
    j's tail (the same 78 stem, the same hook and ball), set under q's stem. It keeps q's advance and sides, and
    kerns as q does. Reached by the stylistic set ss02."""
    q, j = gp(font, "q"), None
    jg = font["j"]
    j = pathops.Path()
    pen = j.getPen()
    body = max(jg.contours, key=lambda c: len(c.points))       # j without its dot
    from fontTools.pens.pointPen import PointToSegmentPen
    body.drawPoints(PointToSegmentPen(pen))
    cut = 2                                                    # j's stem is straight down to here
    qs = scan_h(q, 200)[-1]                                    # q's stem
    js = scan_h(j, 200)[0]
    top = op(q, rect(-500, cut, 3000, 3000), pathops.PathOp.INTERSECTION)
    tail = op(moved(j, qs[0] - js[0]), rect(-1000, -1000, 3000, cut), pathops.PathOp.INTERSECTION)
    put(font, "g.ss02", union(top, tail), font["q"].width)
    font["g.ss02"].unicodes = []
    for name, members in font.groups.items():
        if name.startswith("public.kern") and "q" in members and "g.ss02" not in members:
            members.append("g.ss02")
    return bounds(gp(font, "g.ss02"))


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


def base_s(font):
    """S.ss03, s.ss03, dollar.ss03 (0.78; owner, 2026-11-14: "i like the S, s and $ of libre baskerville"). The two
    letters arrive from derive as the base's own drawings at Area's weight and width; here they take the default
    letters' side bearings and kerning groups."""
    done = []
    for alt, base, height in (("S.ss03", "S", 712), ("s.ss03", "s", 520)):
        # the spine on Area's ladder: the base's is a quarter heavier across itself (119 and 106 against 95 and 84).
        # Its two edges close on each other until it measures what the default's does; nothing else moves.
        for _pass in range(3):
            over = spine_across(gp(font, alt)) - spine_across(gp(font, base))
            if over < 1:
                break
            CLEAN.spine_thin(font, alt, height, (round(over * 0.6), round(over * 0.6)))
        done.append((alt, "spine", round(spine_across(gp(font, alt)), 1), round(spine_across(gp(font, base)), 1)))
        p, b0 = gp(font, alt), bounds(gp(font, base))
        put(font, alt, p, 0, lsb=b0[0], rsb=font[base].width - b0[2])
        font[alt].unicodes = []
        done.append((alt, font[alt].width, font[base].width))
    # the dollar: the base's own drawing (its ends are balls, not its S's barbs), so not the S and a stroke as the
    # default is. Its stroke takes the capital hairline, as the default's: the two upright edges move in, each by
    # half the excess, wherever they show (the stubs above and below, the sides of the two counters).
    g = font["dollar.ss03"]
    p0 = gp(font, "dollar.ss03")
    b = bounds(p0)
    st = scan_h(p0, b[3] - 10)[0]
    over = (st[1] - st[0]) - STROKE_UP
    for c in g.contours:
        for q in c.points:
            if abs(q.x - st[0]) < 1.5:
                q.x = round(st[0] + over / 2)
            elif abs(q.x - st[1]) < 1.5:
                q.x = round(st[1] - over / 2)
    db = bounds(gp(font, "dollar"))
    put(font, "dollar.ss03", gp(font, "dollar.ss03"), 0, lsb=db[0], rsb=font["dollar"].width - db[2])
    font["dollar.ss03"].unicodes = []
    done.append(("dollar.ss03 stroke", round(st[1] - st[0]), STROKE_UP))
    done.append(("dollar.ss03", font["dollar.ss03"].width, font["dollar"].width))
    for alt, base in (("S.ss03", "S"), ("s.ss03", "s"), ("dollar.ss03", "dollar")):
        for name, members in font.groups.items():
            if name.startswith("public.kern") and base in members and alt not in members:
                members.append(alt)
    return done


def arrows(font, m, adv):
    """Arrows on the maths' axis and weight: the shaft is the minus, the head two strokes of the same weight meeting
    in a point (Serrif's open head; Georgia Pro has none)."""
    w = m.math
    L = 0.80 * adv * 1.0
    head = 0.36 * L                    # each head stroke's run along the shaft
    cy = m.math_y

    def east(length=L):
        """0.77 (owner, 2026-11-14: "does uni21b5 arrow tip need to be fixed?"). The head was two bars and a small
        triangle joined by a union: the triangle's sides did not lie on the bars' outer edges, so the tip came out
        as a zigzag of three 12-unit steps on every arrow. The head is one outline now: the two strokes' outer
        edges meet in the point, their inner edges in the crotch (a mitre), and nothing is left to a union there."""
        x0, x1 = 0.0, length
        px, py = x1 - head, head                           # the upper stroke's far end, from the axis
        qx = x1 - w * 0.5
        L_ = math.hypot(qx - px, py)
        dx_, dy_ = (qx - px) / L_, -py / L_                # along the stroke, towards the point
        nx_, ny_ = -dy_ * w / 2, dx_ * w / 2               # to its outer side
        ou, iu = (px + nx_, py + ny_), (px - nx_, py - ny_)
        apex = ou[0] + dx_ * (ou[1] / -dy_)                # where each edge crosses the axis
        crotch = iu[0] + dx_ * (iu[1] / -dy_)
        sh = x1 - apex                                     # the point stays where the arrow ended
        pts = [(apex + sh, 0), (ou[0] + sh, ou[1]), (iu[0] + sh, iu[1]), (crotch + sh, 0), (iu[0] + sh, -iu[1]), (ou[0] + sh, -ou[1])]
        head_ = shape([(x, cy + y) for x, y in pts])
        shaft = rect(x0, cy - w / 2, crotch + sh + 1, cy + w / 2)
        return union(shaft, head_)

    e = east()
    side = 44
    put(font, "arrowright", e, 0, [0x2192], lsb=side, rsb=side)
    put(font, "arrowleft", moved(e, 0, 0, -1, 1), 0, [0x2190], lsb=side, rsb=side)
    both = union(e, moved(e, L, 0, -1, 1))
    put(font, "arrowboth", both, 0, [0x2194], lsb=side, rsb=side)
    up = moved(e, 0, 0, 1, 1, 90, (0, cy))
    vside = (adv - (bounds(up)[2] - bounds(up)[0])) / 2          # vertical arrows: centred in the maths' width
    # vertical arrows: the same arrow turned, standing from the descender to the cap height's middle
    for name, u, rot in (("arrowup", 0x2191, 90), ("arrowdown", 0x2193, -90)):
        p = moved(e, 0, 0, 1, 1, rot, (L / 2, cy))
        x0, y0, x1, y1 = bounds(p)
        p = moved(p, 0, (CAP_HEIGHT - (y1 - y0)) / 2 - y0 - 30)
        put(font, name, p, 0, [u], lsb=vside, rsb=vside)
    ud = moved(both, 0, 0, 1, 1, 90, (L / 2, cy))
    x0, y0, x1, y1 = bounds(ud)
    put(font, "arrowupdn", moved(ud, 0, (CAP_HEIGHT - (y1 - y0)) / 2 - y0 - 30), 0, [0x2195], lsb=vside, rsb=vside)
    d = moved(e, 0, 0, 0.92, 0.92)
    for name, u, rot in (("uni2197", 0x2197, 45), ("uni2196", 0x2196, 135), ("uni2199", 0x2199, -135),
                         ("uni2198", 0x2198, -45)):
        p = moved(d, 0, 0, 1, 1, rot, (L * 0.43, cy))
        x0, y0, x1, y1 = bounds(p)
        p = moved(p, 0, (CAP_HEIGHT - (y1 - y0)) / 2 - y0 - 30)
        put(font, name, p, 0, [u], lsb=side * 0.8, rsb=side * 0.8)


def maths(font, m, adv):
    w = m.math
    cy = m.math_y
    # <= >= : the less and greater signs over a bar (Georgia Pro, Serrif)
    for src, name, u in (("less", "lessequal", 0x2264), ("greater", "greaterequal", 0x2265)):
        s = gp(font, src)
        x0, y0, x1, y1 = bounds(s)
        k = 0.82
        s = moved(s, 0, 0, 1, k, 0, (0, y1))
        s = moved(s, 0, 50)
        bx0, by0, bx1, by1 = bounds(s)
        line = rect(bx0, by0 - 0.9 * w - w * 1.0 - 30, bx1, by0 - 0.9 * w - 30)
        put(font, name, union(s, line), adv, [u], lsb=(adv - (bx1 - bx0)) / 2)
        font[name].width = adv
    # ~~ : two of Area's tildes
    t = gp(font, "asciitilde")
    x0, y0, x1, y1 = bounds(t)
    gap = 0.75 * (y1 - y0) + w * 0.6
    p = union(moved(t, 0, cy + gap / 2 - (y0 + y1) / 2), moved(t, 0, cy - gap / 2 - (y0 + y1) / 2))
    put(font, "approxequal", p, adv, [0x2248], lsb=(adv - (x1 - x0)) / 2)
    font["approxequal"].width = adv
    # infinity: two loops, each a ring stressed upright like the o, crossing at the middle
    infinity(font, m, adv)
    # root: a short thin stroke up, a thick stroke down, a thin stroke up to the top, then a level arm
    th = m.stem * 0.96
    tn = w
    top = CAP_HEIGHT + 30
    B, V, T = (150, 372), (262, -12), (448, top)
    def unit(a, b):
        d = math.hypot(b[0] - a[0], b[1] - a[1])
        return ((b[0] - a[0]) / d, (b[1] - a[1]) / d)
    u1, u2 = unit(B, V), unit(V, T)
    n1, n2 = (-u1[1], u1[0]), (-u2[1], u2[0])                       # left of each stroke's direction
    B1 = (B[0] + n1[0] * th, B[1] + n1[1] * th)                     # the thick stroke: its right edge runs into V
    T1 = (T[0] + n2[0] * tn, T[1] + n2[1] * tn)                     # the thin stroke: its left edge, offset tn
    def meet(p, u, q, v):
        den = u[0] * v[1] - u[1] * v[0]
        t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den
        return (p[0] + u[0] * t, p[1] + u[1] * t)
    Vi = meet(B1, u1, T1, u2)                                        # where the thick's other edge meets the thin's
    vee = shape([B, V, (T[0] + 8, T[1]), (T1[0], T[1]), Vi, B1])
    p = union(vee, bar((60, 318), (B[0] + 6, B[1] + 6), tn), rect(T1[0], top - tn, 640, top))
    p = op(p, rect(-100, top, 2000, 2000), pathops.PathOp.DIFFERENCE)
    put(font, "radical", p, 0, [0x221A], lsb=30, rsb=10)
    # increment: a triangle with A's weights (thin left, thick right, a thin base)
    tri_out = shape([(0, 0), (560, 0), (280, CAP_HEIGHT)])
    a = math.atan2(CAP_HEIGHT, 280)
    tl = m.cap_bar / math.sin(a) * 1.0
    tr = m.cap_stem / math.sin(a)
    inner = shape([(tl + 0.65 * m.cap_bar / math.tan(a) + 22, m.cap_bar * 0.9),
                   (560 - tr - m.cap_bar * 0.9 / math.tan(a) + 6, m.cap_bar * 0.9),
                   (280 + (tl - tr) / 2 * 0.5, CAP_HEIGHT - (tl + tr) * 0.95)])
    put(font, "increment", op(tri_out, inner, pathops.PathOp.DIFFERENCE), 0, [0x2206], lsb=24, rsb=24)
    # product and sum: Pi from H's stems under one bar; Sigma is Area's Esh capital (the Greek letter's shape)
    H = gp(font, "H")
    hs = scan_h(H, 200)
    keep = op(H, rect(hs[0][1], 150, hs[1][0], 600), pathops.PathOp.DIFFERENCE)     # no crossbar
    keep = op(keep, rect(-100, CAP_HEIGHT - 60, 2000, 1000), pathops.PathOp.DIFFERENCE)   # no head serifs
    top_bar = rect(hs[0][0] - 0.7 * m.cap_stem, CAP_HEIGHT - m.cap_bar * 1.15, hs[1][1] + 0.7 * m.cap_stem, CAP_HEIGHT)
    Pi = union(keep, top_bar)
    pb = bounds(Pi)                                    # 0.74: narrowed between its stems (it was scaled: stems 74)
    put(font, "product", narrow(Pi, hs[0][1] + 90, round(0.14 * (pb[2] - pb[0]))), 0, [0x220F], lsb=30, rsb=30)
    if "uni01A9" in font or "Esh" in font:
        put(font, "summation", gp(font, "Esh"), 0, [0x2211], lsb=30, rsb=30)
    # integral: Area's esh, on the figures' height
    put(font, "integral", gp(font, "esh"), 0, [0x222B], lsb=20, rsb=20)
    # partial: Area's 6 turned to face left, its bowl on the baseline
    six = gp(font, "six")
    put(font, "partialdiff", moved(six, 0, 0, -1, 1), 0, [0x2202], lsb=50, rsb=50)
    # lozenge
    lw, lh = 0.66 * adv, CAP_HEIGHT + 20
    out = shape([(lw / 2, -10), (lw, lh / 2 - 10), (lw / 2, lh - 10), (0, lh / 2 - 10)])
    k = m.cap_stem * 0.75
    inn = shape([(lw / 2, -10 + k * 1.4), (lw - k, lh / 2 - 10), (lw / 2, lh - 10 - k * 1.4), (k, lh / 2 - 10)])
    put(font, "lozenge", op(out, inn, pathops.PathOp.DIFFERENCE), 0, [0x25CA], lsb=30, rsb=30)
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


def infinity(font, m, adv):
    s = m.stem
    thin = m.math
    rx, ry = 168, 124
    cy = m.math_y + 10
    loops = []
    for cx in (rx, 3 * rx - 0.92 * s):                 # the two loops share one upright stroke where they meet
        loops.append(ring(cx, cy, rx, ry, s * 0.92, thin))
    p = union(*loops)
    put(font, "infinity", p, 0, [0x221E], lsb=34, rsb=34)


def primes(font, m):
    """Primes: Area's straight quote, leaning like Georgia Pro's and Serrif's."""
    q = gp(font, "quotesingle")
    x0, y0, x1, y1 = bounds(q)
    p = moved(q, 0, 0, 1, 1, -14, ((x0 + x1) / 2, y0))
    put(font, "minute", p, 0, [0x2032], lsb=40, rsb=40)
    w = bounds(p)[2] - bounds(p)[0]
    put(font, "second", union(p, moved(p, w + 40)), 0, [0x2033], lsb=40, rsb=40)


def currencies(font, m):
    cb, lb = m.cap_bar, m.low_bar
    S = m.cap_stem
    # ruble: P with a second bar across its stem below the bowl
    P = gp(font, "P")
    ps = _stem_x(P, 200)
    put(font, "uni20BD", union(P, rect(ps[0] - 0.9 * S, 0.24 * CAP_HEIGHT - cb / 2, ps[1] + 1.7 * S,
                                       0.24 * CAP_HEIGHT + cb / 2)), font["P"].width, [0x20BD])
    # lira (Turkish): L's stem crossed by two rising bars, as the sign is drawn
    L = gp(font, "L")
    ls = _stem_x(L, 300)
    cx = (ls[0] + ls[1]) / 2
    bars2 = union(bar((cx - 1.0 * S, 0.36 * CAP_HEIGHT), (cx + 1.6 * S, 0.50 * CAP_HEIGHT), cb),
                  bar((cx - 1.0 * S, 0.52 * CAP_HEIGHT), (cx + 1.6 * S, 0.66 * CAP_HEIGHT), cb))
    put(font, "uni20BA", union(L, bars2), font["L"].width, [0x20BA])
    # won: W with two level bars across
    W = gp(font, "W")
    x0, _, x1, _ = bounds(W)
    put(font, "uni20A9", union(W, rect(x0 - 10, 0.42 * CAP_HEIGHT - cb / 2, x1 + 10, 0.42 * CAP_HEIGHT + cb / 2),
                               rect(x0 - 10, 0.62 * CAP_HEIGHT - cb / 2, x1 + 10, 0.62 * CAP_HEIGHT + cb / 2)),
        font["W"].width, [0x20A9])
    # dong: d-bar over a bar under the baseline
    db = gp(font, "dcroat")
    x0, _, x1, _ = bounds(db)
    put(font, "dong", union(db, rect(x0 + 20, -150 - lb, x1 - 20, -150)), font["d"].width, [0x20AB])
    # rupee: a level top bar, a second bar under it, and the bowl's stroke turning into a long diagonal leg
    r = m.cap_bar
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


def interface(font, m, adv):
    """Symbols on keys and in menus, on the figures' height and the maths' weight."""
    w = m.math
    h = 0.80 * CAP_HEIGHT
    # check and cross
    put(font, "uni2713", union(bar((40, 300), (190, 120), w * 1.25), bar((180, 120), (480, 600), w * 1.25)), 0,
        [0x2713], lsb=40, rsb=40)
    c = 270
    put(font, "uni2715", union(bar((c - 180, m.math_y - 180), (c + 180, m.math_y + 180), w * 1.1),
                               bar((c - 180, m.math_y + 180), (c + 180, m.math_y - 180), w * 1.1)), 0, [0x2715],
        lsb=50, rsb=50)
    # circles: black circle the bullet's sibling at the figures' size, white circle its outline
    R = 0.40 * CAP_HEIGHT
    put(font, "uni25CF", ellipse(0, m.math_y + 30, R, R), 0, [0x25CF], lsb=50, rsb=50)
    put(font, "uni25CB", ring(0, m.math_y + 30, R, R, w, w), 0, [0x25CB], lsb=50, rsb=50)
    # command: a square whose sides run on past its corners and curl into four loops (three quarters of a circle)
    qc, rc = 104, 80            # the square's and the loops' centre lines
    parts = []
    for k in (-1, 1):
        parts.append(rect(-(qc + rc), k * qc - w / 2, qc + rc, k * qc + w / 2))      # level sides, run on
        parts.append(rect(k * qc - w / 2, -(qc + rc), k * qc + w / 2, qc + rc))      # upright sides, run on
    for sx in (-1, 1):
        for sy in (-1, 1):
            cx, cy = sx * (qc + rc), sy * (qc + rc)
            loop = ring(cx, cy, rc + w / 2, rc + w / 2, w, w)
            facing = rect(min(cx, sx * qc), min(cy, sy * qc), max(cx, sx * qc), max(cy, sy * qc))
            parts.append(op(loop, facing, pathops.PathOp.DIFFERENCE))
    cmd = union(*parts)
    put(font, "uni2318", moved(cmd, 0, h / 2), 0, [0x2318], lsb=50, rsb=50)
    # option: a level stroke, a falling diagonal, a level stroke; a short level stroke at the right top
    W = 520
    t = h * 0.86
    p = union(rect(0, t - w, 0.30 * W, t), bar((0.30 * W - w * 0.4, t - w / 2), (0.72 * W, w / 2), w * 1.05),
              rect(0.70 * W, 0, W, w), rect(0.56 * W, t - w, W, t))
    put(font, "uni2325", p, 0, [0x2325], lsb=50, rsb=50)
    # shift: an outlined arrow pointing up
    sw, sh = 520, h
    out = shape([(sw / 2, sh), (sw, sh * 0.48), (sw * 0.72, sh * 0.48), (sw * 0.72, 0), (sw * 0.28, 0),
                 (sw * 0.28, sh * 0.48), (0, sh * 0.48)])
    k = w
    inn = shape([(sw / 2, sh - k * 1.55), (sw - k * 2.35, sh * 0.48 + k * 0.6), (sw * 0.72 - k, sh * 0.48 + k * 0.6),
                 (sw * 0.72 - k, k), (sw * 0.28 + k, k), (sw * 0.28 + k, sh * 0.48 + k * 0.6),
                 (k * 2.35, sh * 0.48 + k * 0.6)])
    put(font, "uni21E7", op(out, inn, pathops.PathOp.DIFFERENCE), 0, [0x21E7], lsb=50, rsb=50)
    # erase to the left: an outlined tag pointing left with a cross inside
    tw, th = 700, h * 0.80
    y0 = (h - th) / 2
    out = shape([(0, y0 + th / 2), (tw * 0.30, y0 + th), (tw, y0 + th), (tw, y0), (tw * 0.30, y0)])
    inn = shape([(k * 1.9, y0 + th / 2), (tw * 0.30 + k * 0.45, y0 + th - k), (tw - k, y0 + th - k), (tw - k, y0 + k),
                 (tw * 0.30 + k * 0.45, y0 + k)])
    cxx, cyy, d = tw * 0.62, y0 + th / 2, th * 0.22
    x = union(bar((cxx - d, cyy - d), (cxx + d, cyy + d), w), bar((cxx - d, cyy + d), (cxx + d, cyy - d), w))
    put(font, "uni232B", union(op(out, inn, pathops.PathOp.DIFFERENCE), x), 0, [0x232B], lsb=50, rsb=50)


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
    put(font, "AE", union(A_cut, moved(E_noserif, dx)), dx + font["E"].width)
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
    compose(font, "ldot", [("l", 0, 0), ("periodcentered", round(dx), 39)], round(font["l"].width + 61), [0x0140])


def letters_extra(font):
    """n preceded by apostrophe (deprecated but in Latin Extended-A), and sound recording copyright."""
    if not any(0x02BB in g.unicodes for g in font):                 # turned comma (okina), English auxiliary
        compose(font, "uni02BB", [("quoteleft", 0, 0)], font["quoteleft"].width, [0x02BB])
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
            if mname == "dotbelowcomb":
                mg = font[mname + suf] if (mname + suf) in font else font[mname]
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
FRACTION_BAR = 48       # the bar of the fraction slash, the percent sign and every fraction, level width (they ran 40 to 54)


def _level_cut(c):
    """A four-point contour with two level edges: ((x0, x1, y) lower, (x0, x1, y) upper), or None."""
    P = c.points
    if len(P) != 4 or any(p.type != "line" for p in P):
        return None
    ys = sorted({p.y for p in P})
    if len(ys) != 2:
        return None
    lo = sorted(p.x for p in P if p.y == ys[0])
    hi = sorted(p.x for p in P if p.y == ys[1])
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
    b = bounds(gp(font, "plus"))
    cx, cy = (b[0] + b[2]) / 2, m.math_y
    plus = union(rect(b[0], cy - w / 2, b[2], cy + w / 2), rect(cx - w / 2, b[1], cx + w / 2, b[3]))
    put(font, "plus", plus, font["plus"].width)
    g = font["plusminus"]                                # its plus, and the bar under it as it is
    boxes = sorted((bounds(_contour_path(c)) for c in g.contours), key=lambda q: q[3] - q[1])
    bar_, pl = boxes[0], boxes[-1]
    pcx, pcy = (pl[0] + pl[2]) / 2, (pl[1] + pl[3]) / 2
    put(font, "plusminus", union(rect(pl[0], pcy - w / 2, pl[2], pcy + w / 2), rect(pcx - w / 2, pl[1], pcx + w / 2, pl[3]),
                                 rect(bar_[0], bar_[1], bar_[2], bar_[1] + w)), g.width)
    b = bounds(gp(font, "logicalnot"))
    put(font, "logicalnot", union(rect(b[0], b[3] - w, b[2], b[3]), rect(b[2] - w, b[1], b[2], b[3])), font["logicalnot"].width)
    b = bounds(gp(font, "underscore"))
    cy = (b[1] + b[3]) / 2
    put(font, "underscore", rect(b[0], cy - w / 2, b[2], cy + w / 2), font["underscore"].width)
    for name in ("bar", "brokenbar"):
        g = font[name]
        boxes = [bounds(_contour_path(c)) for c in g.contours]
        cx = (boxes[0][0] + boxes[0][2]) / 2
        put(font, name, union(*[rect(cx - w / 2, q[1], cx + w / 2, q[3]) for q in boxes]), g.width)
    g = font["slash"]
    lo, hi = _level_cut(g.contours[0])
    side = (lo[0], g.width - hi[1])
    s = _slash(lo, hi, w)
    put(font, "slash", s, 0, lsb=side[0], rsb=side[1])
    put(font, "backslash", moved(s, 0, 0, -1, 1), 0, lsb=side[1], rsb=side[0])
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


def letter_signs(font, m):
    done = []
    # dollar: S, the stroke through it
    old = gp(font, "dollar")
    ob = bounds(old)
    st = scan_h(old, ob[3] - 20)[0]                              # the stroke's stub above the S
    S = gp(font, "S")
    sb = bounds(S)
    xc = sb[0] + (sb[2] - sb[0]) * ((st[0] + st[1]) / 2 - ob[0]) / (ob[2] - ob[0])
    sx = band(xc, STROKE_UP)
    p = union(S, rect(sx[0], ob[1], sx[1], ob[3]))
    w0 = font["dollar"].width
    put(font, "dollar", p, 0, lsb=ob[0], rsb=w0 - ob[2])
    done.append(f"dollar: S + stroke {st[1] - st[0]:.0f}>{STROKE_UP}")
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
        bars_ = [rect(cx - half, band((a + b) / 2, m.cap_bar)[0], cx + half, band((a + b) / 2, m.cap_bar)[1])
                 for a, b in ((ys[0], ys[1]), (ys[2], ys[3]))]
        w0 = g.width
        put(font, "yen", union(Y, *bars_), 0, lsb=ob[0], rsb=w0 - ob[2])
        done.append(f"yen: Y + bars {ys[1] - ys[0]:.0f}>{m.cap_bar:.0f}")
    else:
        done.append(f"yen: bars not found ({ys})")
    return done


# A right-hand bracket is its left-hand one turned over. Each pair had drifted by a unit or two through lightening
# and rounding (bracket stems 73 and 74, braces 233 and 234 wide, 4 to 62 points apart).
MIRRORS = [("parenleft", "parenright"), ("bracketleft", "bracketright"), ("braceleft", "braceright"),
           (0x00AB, 0x00BB), (0x2039, 0x203A), ("less", "greater")]


def _name(font, key):
    if isinstance(key, str):
        return key
    return next(g.name for g in font if key in g.unicodes)


def mirrors(font):
    done = []
    for a, b in MIRRORS:
        a, b = _name(font, a), _name(font, b)
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
MARK_BAND = 6
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
    Level bars are H's crossbar; upright and leaning strokes the capital hairline."""
    cb, S, hair = m.cap_bar, m.cap_stem, STROKE_UP
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
    done("uni20A6", 0x20A6, union(N, rect(x0 - 10, lev(0.42)[0], x1 + 10, lev(0.42)[1]),       # 0.426, 0.418
                                  rect(x0 - 10, lev(0.59)[0], x1 + 10, lev(0.59)[1])), "N")    # 0.595, 0.582
    P = gp(font, "P")
    ps = _stem_x(P, 200)
    px1 = bounds(P)[2]
    done("uni20B1", 0x20B1, union(P, rect(ps[0] - 0.9 * S, lev(0.62)[0], px1 + 0.25 * S, lev(0.62)[1]),   # 0.588, 0.645
                                  rect(ps[0] - 0.9 * S, lev(0.78)[0], px1 + 0.25 * S, lev(0.78)[1])), "P")  # 0.756, 0.810
    T = gp(font, "T")
    tb = bounds(T)
    arm = max(s[1] - s[0] for s in scan_v(T, tb[0] + 0.25 * (tb[2] - tb[0])))       # the arm's thickness
    low = cut_out(T, 200, round((1 - 0.83) * CAP_HEIGHT))                            # T's top at 0.83 (Georgia Pro 0.829)
    done("uni20B8", 0x20B8, union(low, rect(tb[0], CAP_HEIGHT - arm, tb[2], CAP_HEIGHT)), "T")
    B = gp(font, "B")
    bs = _stem_x(B, 200)
    out = round(0.155 * CAP_HEIGHT)                                                  # 0.14 / 0.13 and 0.18 / 0.18
    xs = (round(bs[1] + 0.35 * S), round(bs[1] + 1.75 * S))
    stubs = [rect(x, -out, x + hair, 20) for x in xs] + [rect(x, CAP_HEIGHT - 20, x + hair, CAP_HEIGHT + out) for x in xs]
    done("uni20BF", 0x20BF, union(B, *stubs), "B")
    K = gp(font, "K")
    ks = _stem_x(K, 200)
    done("uni20AD", 0x20AD, union(K, rect(ks[0] - 0.9 * S, lev(0.51)[0], ks[1] + 2.4 * S, lev(0.51)[1])), "K")   # Georgia Pro 0.510
    ts = _stem_x(T, 200)
    cx = (ts[0] + ts[1]) / 2
    done("uni20AE", 0x20AE, union(T, bar((cx - 1.3 * S, 0.30 * CAP_HEIGHT), (cx + 1.3 * S, 0.44 * CAP_HEIGHT), cb),
                                  bar((cx - 1.3 * S, 0.46 * CAP_HEIGHT), (cx + 1.3 * S, 0.60 * CAP_HEIGHT), cb)), "T")
    out = round(0.14 * CAP_HEIGHT)                                                   # Georgia Pro 0.16 below, 0.12 above
    G = gp(font, "G")
    gb = bounds(G)
    gx = band(gb[0] + 0.50 * (gb[2] - gb[0]), hair)
    done("uni20B2", 0x20B2, union(G, rect(gx[0], -out, gx[1], CAP_HEIGHT + out)), "G")
    C_ = gp(font, "C")
    c0 = bounds(C_)
    ccx = c0[0] + 0.50 * (c0[2] - c0[0])
    lean = 0.16 * CAP_HEIGHT
    strokes = [bar((ccx + dx - lean / 2, -out - 40), (ccx + dx + lean / 2, CAP_HEIGHT + out + 40), hair) for dx in (-0.55 * S, 0.55 * S)]
    p = union(C_, *strokes)
    p = op(p, union(rect(-500, -500, 3000, -out), rect(-500, CAP_HEIGHT + out, 3000, 3000)), pathops.PathOp.DIFFERENCE)
    done("uni20A1", 0x20A1, p, "C")
    return made


def more_symbols(font, m, adv):
    w, cy = m.math, m.math_y
    made = []

    def add(name, cp, path, side=50):
        put(font, name, path, 0, cp if isinstance(cp, list) else [cp], lsb=side, rsb=side)
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
    head = op(au, rect(-500, ub[3] - (ab[3] - ab[1]) / 2 - w * 0.2, 3000, 3000), pathops.PathOp.INTERSECTION)
    ucx = (ub[0] + ub[2]) / 2                              # without the shaft's stub under the point
    head = op(head, rect(ucx - w / 2 - 1, -500, ucx + w / 2 + 1, ub[3] - w * 1.42 - 2), pathops.PathOp.DIFFERENCE)
    add("uni2303", 0x2303, head, side=ub[0])
    tab = union(ar, rect(ab[2], ab[1], ab[2] + w, ab[3]))
    add("uni21E5", 0x21E5, tab, side=44)
    add("uni21E4", 0x21E4, moved(tab, 0, 0, -1, 1), side=44)
    al = gp(font, "arrowleft")
    lb = bounds(al)
    ret = union(al, rect(lb[2] - w, cy - w / 2, lb[2], cy + 0.42 * CAP_HEIGHT))
    add("uni21B5", [0x21B5, 0x23CE], ret, side=44)
    add("uni2326", 0x2326, moved(gp(font, "uni232B"), 0, 0, -1, 1))
    sh = gp(font, "uni21E7")
    sb = bounds(sh)
    by = round(0.20 * (sb[3] - sb[1]))                    # the shaft shortened, nothing scaled (0.74)
    up = moved(cut_out(sh, sb[1] + 80, by), 0, by)
    add("uni21EA", 0x21EA, union(up, rect(sb[0] + 0.28 * (sb[2] - sb[0]), sb[1], sb[0] + 0.72 * (sb[2] - sb[0]), sb[1] + w)))
    # solid shapes on the black circle's size and centre
    cb_ = bounds(gp(font, "uni25CF"))
    R = (cb_[3] - cb_[1]) / 2
    oy = (cb_[1] + cb_[3]) / 2
    tri = shape([(-R, -0.87 * R), (R, -0.87 * R), (0, 0.87 * R)])                 # level base, as wide as the circle
    for name, cp, rot, sc in (("uni25B2", 0x25B2, 0, 1), ("uni25BC", 0x25BC, 180, 1), ("uni25B6", 0x25B6, -90, 1),
                              ("uni25C0", 0x25C0, 90, 1), ("uni25B4", 0x25B4, 0, 0.55), ("uni25BE", 0x25BE, 180, 0.55),
                              ("uni25B8", 0x25B8, -90, 0.55), ("uni25C2", 0x25C2, 90, 0.55)):
        add(name, cp, moved(moved(tri, 0, 0, sc, sc, rot), 0, oy if sc == 1 else cy))
    q = 0.88 * R
    add("uni25A0", 0x25A0, rect(-q, oy - q, q, oy + q))
    add("uni25A1", 0x25A1, op(rect(-q, oy - q, q, oy + q), rect(-q + w, oy - q + w, q - w, oy + q - w), pathops.PathOp.DIFFERENCE))
    add("uni25C6", 0x25C6, shape([(0, oy - R), (R, oy), (0, oy + R), (-R, oy)]))

    def star(r_out, r_in):
        pts = []
        for i in range(10):
            a = math.radians(90 + 36 * i)
            r = r_out if i % 2 == 0 else r_in
            pts.append((r * math.cos(a), oy + r * math.sin(a)))
        return shape(pts)
    R5 = R * 1.08
    r_in = 0.382 * R5
    # the white star's inside: the same star, each edge moved in by the maths' stroke
    a0, a1 = math.radians(90), math.radians(126)
    p0, p1 = (R5 * math.cos(a0), R5 * math.sin(a0)), (r_in * math.cos(a1), r_in * math.sin(a1))
    d0 = abs(p0[0] * p1[1] - p0[1] * p1[0]) / math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    kk = (d0 - w) / d0
    add("uni2605", 0x2605, star(R5, r_in))
    add("uni2606", 0x2606, op(star(R5, r_in), star(R5 * kk, r_in * kk), pathops.PathOp.DIFFERENCE))
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
        w = font[dst].width
        rsb = w - bounds(gp(font, dst))[2]
        _turned(font, src, dst)
        font[dst].width = round(bounds(gp(font, dst))[2] + rsb)
    for single, double in (("quoteleft", "quotedblleft"), ("quoteright", "quotedblright"), ("quotesinglbase", "quotedblbase"),
                           ("quotesingle", "quotedbl")):
        g = font[double]
        old = sorted((bounds(_contour_path(c)) for c in g.contours), key=lambda b: b[0])
        sb = bounds(gp(font, single))
        rsb = g.width - max(b[2] for b in old)
        g.clearContours()
        pen = g.getPen()
        for b in old:
            font[single].draw(TransformPen(pen, Transform(1, 0, 0, 1, round(b[0] - sb[0]), round(old[0][1] - sb[1]))))
        for c in g.contours:
            for p in c.points:
                p.x, p.y = round(p.x), round(p.y)
        g.width = round(bounds(gp(font, double))[2] + rsb)


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
    for src, dst in (("exclam", "exclamdown"), ("question", "questiondown"), ("quoteright", "quoteleft")):
        w = font[dst].width
        rsb = w - bounds(gp(font, dst))[2]
        _turned(font, src, dst)
        font[dst].width = round(bounds(gp(font, dst))[2] + rsb)
        done.append(dst)
    for single, double in (("quoteleft", "quotedblleft"), ("quoteright", "quotedblright"), ("quotesinglbase", "quotedblbase"),
                           ("quotesingle", "quotedbl")):
        g = font[double]
        old = sorted((bounds(_contour_path(c)) for c in g.contours), key=lambda b: b[0])
        sb = bounds(gp(font, single))
        rsb = g.width - max(b[2] for b in old)
        g.clearContours()
        pen = g.getPen()
        for b in old:
            font[single].draw(TransformPen(pen, Transform(1, 0, 0, 1, round(b[0] - sb[0]), round(old[0][1] - sb[1]))))
        for c in g.contours:
            for p in c.points:
                p.x, p.y = round(p.x), round(p.y)
        g.width = round(bounds(gp(font, double))[2] + rsb)
        REBUILT.add(double)
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
BELOW = {"ogonek": -215, "dotbelow": -219}


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
    put(font, name, union(N, moved(tail, n_st[1] - o_st[1])), font["N"].width)
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
    print("charset: mirrored pairs", mirrors(font))                    # 0.71
    print("charset: sign weights", cap_strokes(font))                  # 0.71
    print("charset: Eng", eng_capital(font))                           # 0.75
    print("charset: degree", degree_ring(font))                        # 0.75
    print("charset: fractions", fractions(font))                       # 0.72
    print(f"charset: fraction figures {FRAC_GAP} from the bar (they were)", fraction_fit(font))   # 0.72
    print("charset: currencies from capitals", letter_currencies(font, m))   # 0.72
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
    anchored = align_anchors(font)
    print("charset: capital marks", case_marks(font))                  # 0.71
    centred, n_centred = centre_marks(font)                            # 0.71
    print(f"charset: marks centred on {len(centred)} anchors, {n_centred} letters follow", centred)
    print(f"charset: lowercase accents {MARK_DROP} closer on", drop_marks(font), "letters")   # 0.71
    hook_above(font)
    horns(font)
    viet = vietnamese(font)
    print("charset: marks below", below_depths(font))                  # 0.74
    print("charset: digraphs", digraphs(font))                         # 0.73
    print("charset: numero", numero(font))                             # 0.73
    for g in font:                                    # 0.65: every outline, not only the ones this module wrote
        _drop_tiny(g)
    print(f"charset: Vietnamese, {viet} letters composed")
    print(f"charset: {followed} composites follow their rebuilt base; {anchored} anchors set from the precomposed letters")
    return len(skipped), adv
