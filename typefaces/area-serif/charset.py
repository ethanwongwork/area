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
            + [0x0309, 0x031B, 0x01A0, 0x01A1, 0x01AF, 0x01B0] + list(range(0x1EA0, 0x1EFA)))   # Vietnamese (0.48)
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


def _drop_tiny(g):
    """pathops can leave a 1-unit segment where two outlines met at a hair: drop the on-curve nodes it doubles."""
    for c in g.contours:
        P = c.points
        i = 0
        while i < len(P) and len(P) > 4:
            a, b = P[i], P[(i + 1) % len(P)]
            if a.type == "line" and b.type == "line" and abs(a.x - b.x) <= 1 and abs(a.y - b.y) <= 1:
                del P[i]
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
        p = union(b, rect(x0, y - w / 2, x1, y + w / 2))
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

def arrows(font, m, adv):
    """Arrows on the maths' axis and weight: the shaft is the minus, the head two strokes of the same weight meeting
    in a point (Serrif's open head; Georgia Pro has none)."""
    w = m.math
    L = 0.80 * adv * 1.0
    head = 0.36 * L                    # each head stroke's run along the shaft
    cy = m.math_y

    def east(length=L):
        x0, x1 = 0.0, length
        shaft = rect(x0, cy - w / 2, x1 - w * 0.6, cy + w / 2)
        a = bar((x1 - head, cy + head), (x1 - w * 0.5, cy), w)
        b = bar((x1 - head, cy - head), (x1 - w * 0.5, cy), w)
        point = shape([(x1 - w * 1.2, cy + w * 0.75), (x1, cy), (x1 - w * 1.2, cy - w * 0.75)])
        return union(shaft, a, b, point)

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
    put(font, "product", moved(Pi, 0, 0, 0.86, 1.0), 0, [0x220F], lsb=30, rsb=30)
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


# ---------------------------------------------------------------- Vietnamese (0.48)
# Vietnamese adds two marks (hook above, horn), four horned letters and 134 letters with a tone mark, many of them
# with two marks. Measured in Area's own accents: the accents are about 50 units thick at their heaviest and 150 tall
# (106 in the capital forms). Placement follows the common practice in Vietnamese type: a tone mark that meets a
# circumflex (acute, grave, hook above) sits beside it at its upper right; a tilde, and every tone over a breve, sits
# above it; the dot below goes under the letter as on its own.

HOOK = {"": (628, 172, 50, 32), ".case": (775, 124, 46, 30)}   # bottom, height, side stroke, top stroke


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
        g.appendAnchor({"name": "_top", "x": round(cx + wt * 0.35), "y": 632 if not suf else 763})
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
STACK_GAP = 22          # a mark above another: this much white between them


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
                dx, dy = top[0] - ma[0], (top[1] - ma[1]) if upper else 0
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


# ---------------------------------------------------------------- run

def run(font, lightened):
    REBUILT.clear()
    COMPOSED.clear()
    before = snapshot(font)
    skipped = lighten_rest(font, set(lightened))
    m = M(font)
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
    letters_extra(font)
    diphthongs(font, m)
    ogonek_letters(font)
    for name, l, r in (("fi", "f", "i"), ("fl", "f", "l"), ("f_f", "f", "f"), ("f_f_i", "f", "i"), ("f_f_l", "f", "l"),
                       ("longs", "f", "f"), ("Dcroat", "D", "D"), ("dcroat", "d", "d"), ("Hbar", "H", "H"),
                       ("hbar", "h", "h"), ("Tbar", "T", "T"), ("tbar", "t", "t"), ("Lslash", "L", "L"),
                       ("lslash", "l", "l"), ("Oslash", "O", "O"), ("oslash", "o", "o"), ("thorn", "p", "p"),
                       ("Thorn", "I", "P")):
        kern_like(font, name, l, r)
    followed = follow_rebuilt(font, before)
    anchored = align_anchors(font)
    hook_above(font)
    horns(font)
    viet = vietnamese(font)
    print(f"charset: Vietnamese, {viet} letters composed")
    print(f"charset: {followed} composites follow their rebuilt base; {anchored} anchors set from the precomposed letters")
    return len(skipped), adv
