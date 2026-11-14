"""Shared geometry for the 2026-11-13 evaluation: every test reads a font through this file, so Area Serif and the
reference faces are measured by the same code. All lengths are normalised to 1000 units per em.

Reference fonts are read in memory only. Nothing here writes an outline of a reference face to disk."""
import math
import os

from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", "..", ".."))
AREA_DIR = os.path.join(ROOT, "typefaces", "area-serif")
AREA_TTF = os.path.join(AREA_DIR, "build", "AreaSerif-Regular.ttf")
AREA_UFO = os.path.join(AREA_DIR, "build", "AreaSerif-Regular.ufo")
USER_FONTS = os.path.expanduser("~/Library/Fonts/")
DL = os.environ.get("EVAL_FONTS", "")           # folder holding the downloaded OFL faces
OUT = os.environ.get("EVAL_OUT", os.path.join(AREA_DIR, "build", "evaluation"))

# key -> (label, path, variation settings or None, licence class)
FACES = {
    "area": ("Area Serif 0.70", AREA_TTF, None, "own"),
    "georgia": ("Georgia Pro", USER_FONTS + "GeorgiaPro-Regular.ttf", None, "licensed"),
    "serrif": ("Serrif", USER_FONTS + "SerrifCollectionVF-TRIAL.ttf", {"wght": 400, "wdth": 100, "slnt": 0}, "licensed"),
    "baskerville": ("Libre Baskerville", os.path.join(DL, "LibreBaskerville.ttf"), {"wght": 400}, "ofl"),
    "source": ("Source Serif 4", os.path.join(DL, "SourceSerif4.ttf"), {"wght": 400, "opsz": 20}, "ofl"),
    "literata": ("Literata", os.path.join(DL, "Literata.ttf"), {"wght": 400, "opsz": 12}, "ofl"),
    "newsreader": ("Newsreader", os.path.join(DL, "Newsreader.ttf"), {"wght": 400, "opsz": 18}, "ofl"),
    "lora": ("Lora", os.path.join(DL, "Lora.ttf"), {"wght": 400}, "ofl"),
    "merriweather": ("Merriweather", os.path.join(DL, "Merriweather.ttf"), {"wght": 400, "wdth": 100, "opsz": 18}, "ofl"),
}
ORDER = list(FACES)
LOWER = "abcdefghijklmnopqrstuvwxyz"
UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
DIGITS = "0123456789"
CORE = LOWER + UPPER + DIGITS

_cache = {}


def face(key):
    """A static TTFont for the face, instanced in memory."""
    if key not in _cache:
        _, path, var, _ = FACES[key]
        f = TTFont(path)
        if var and "fvar" in f:
            f = instantiateVariableFont(f, var, inplace=True)
        _cache[key] = f
    return _cache[key]


def available():
    return [k for k in ORDER if os.path.exists(FACES[k][1])]


class SegPen(BasePen):
    """Contours as lists of segments, scaled to 1000 upm:
    ('L', p0, p1) | ('Q', p0, c, p1) | ('C', p0, c1, c2, p1)."""

    def __init__(self, gs, k=1.0):
        super().__init__(gs)
        self.k = k
        self.contours = []
        self._start = self._last = None

    def _s(self, p):
        return (p[0] * self.k, p[1] * self.k)

    def _moveTo(self, p):
        self.contours.append([])
        self._start = self._last = self._s(p)

    def _lineTo(self, p):
        p = self._s(p)
        if p != self._last:
            self.contours[-1].append(("L", self._last, p))
        self._last = p

    def _qCurveToOne(self, c, p):
        c, p = self._s(c), self._s(p)
        self.contours[-1].append(("Q", self._last, c, p))
        self._last = p

    def _curveToOne(self, a, b, p):
        a, b, p = self._s(a), self._s(b), self._s(p)
        self.contours[-1].append(("C", self._last, a, b, p))
        self._last = p

    def _closePath(self):
        if self._last != self._start:
            self.contours[-1].append(("L", self._last, self._start))

    _endPath = _closePath


def segs(font, ch=None, name=None):
    """(contours, advance) for a character or glyph name, at 1000 upm."""
    name = name or font.getBestCmap().get(ord(ch))
    if name is None:
        return None, 0
    gs = font.getGlyphSet()
    k = 1000 / font["head"].unitsPerEm
    pen = SegPen(gs, k)
    gs[name].draw(pen)
    return [c for c in pen.contours if c], gs[name].width * k


def pt(seg, t):
    u = 1 - t
    if seg[0] == "L":
        (ax, ay), (bx, by) = seg[1], seg[2]
        return (ax + (bx - ax) * t, ay + (by - ay) * t)
    if seg[0] == "Q":
        a, c, b = seg[1:]
        return tuple(u * u * a[i] + 2 * u * t * c[i] + t * t * b[i] for i in (0, 1))
    a, c1, c2, b = seg[1:]
    return tuple(u ** 3 * a[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t ** 3 * b[i] for i in (0, 1))


def d1(seg, t):
    u = 1 - t
    if seg[0] == "L":
        return (seg[2][0] - seg[1][0], seg[2][1] - seg[1][1])
    if seg[0] == "Q":
        a, c, b = seg[1:]
        return tuple(2 * u * (c[i] - a[i]) + 2 * t * (b[i] - c[i]) for i in (0, 1))
    a, c1, c2, b = seg[1:]
    return tuple(3 * u * u * (c1[i] - a[i]) + 6 * u * t * (c2[i] - c1[i]) + 3 * t * t * (b[i] - c2[i]) for i in (0, 1))


def d2(seg, t):
    if seg[0] == "L":
        return (0.0, 0.0)
    if seg[0] == "Q":
        a, c, b = seg[1:]
        return tuple(2 * (b[i] - 2 * c[i] + a[i]) for i in (0, 1))
    a, c1, c2, b = seg[1:]
    u = 1 - t
    return tuple(6 * u * (c2[i] - 2 * c1[i] + a[i]) + 6 * t * (b[i] - 2 * c2[i] + c1[i]) for i in (0, 1))


def curvature(seg, t):
    x1, y1 = d1(seg, t)
    x2, y2 = d2(seg, t)
    v = (x1 * x1 + y1 * y1) ** 1.5
    return (x1 * y2 - y1 * x2) / v if v > 1e-9 else 0.0


def end_tangent(seg, at_end):
    """Unit tangent at a segment's start or end, falling back to the chord when a handle has zero length."""
    for t in ((1.0, 0.999, 0.98, 0.9) if at_end else (0.0, 0.001, 0.02, 0.1)):
        x, y = d1(seg, t)
        n = math.hypot(x, y)
        if n > 1e-6:
            return (x / n, y / n)
    return (1.0, 0.0)


def seg_len(seg, n=12):
    if seg[0] == "L":
        return math.hypot(seg[2][0] - seg[1][0], seg[2][1] - seg[1][1])
    pts = [pt(seg, i / n) for i in range(n + 1)]
    return sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(n))


def flatten(contours, step=2.0):
    """Polylines (closed, first point not repeated) sampled about every `step` units."""
    out = []
    for c in contours:
        poly = []
        for s in c:
            n = max(1, int(math.ceil(seg_len(s) / step)))
            for i in range(n):
                poly.append(pt(s, i / n))
        if len(poly) > 2:
            out.append(poly)
    return out


def area(poly):
    return 0.5 * sum(poly[i][0] * poly[(i + 1) % len(poly)][1] - poly[(i + 1) % len(poly)][0] * poly[i][1]
                     for i in range(len(poly)))


class Shape:
    """A glyph as flattened polylines with scanlines (non-zero winding)."""

    def __init__(self, font, ch=None, name=None, step=1.0):
        self.contours, self.adv = segs(font, ch, name)
        self.polys = flatten(self.contours or [], step)
        pts = [p for poly in self.polys for p in poly]
        self.empty = not pts
        if pts:
            self.x0 = min(p[0] for p in pts)
            self.x1 = max(p[0] for p in pts)
            self.y0 = min(p[1] for p in pts)
            self.y1 = max(p[1] for p in pts)

    def _scan(self, v, ax):
        hits = []
        v += 0.0137
        for c in self.polys:
            n = len(c)
            for i in range(n):
                a, b = c[i], c[(i + 1) % n]
                a0, b0 = a[ax], b[ax]
                if (a0 <= v < b0) or (b0 <= v < a0):
                    t = (v - a0) / (b0 - a0)
                    o = 1 - ax
                    hits.append((a[o] + t * (b[o] - a[o]), 1 if b0 > a0 else -1))
        hits.sort()
        spans, w, st = [], 0, None
        for x, d in hits:
            if w == 0:
                st = x
            w += d
            if w == 0 and st is not None and x - st > 0.3:
                spans.append((st, x))
        return spans

    def h(self, y):
        """Ink spans along the horizontal line at y: [(x0, x1)]."""
        return self._scan(y, 1)

    def v(self, x):
        """Ink spans along the vertical line at x: [(y0, y1)]."""
        return self._scan(x, 0)


def metrics(font):
    """Measured vertical metrics at 1000 upm, from the letters themselves (flat parts, not overshoots)."""
    def flat_top(ch):
        s = Shape(font, ch)
        return s.y1
    x = Shape(font, "x")
    H = Shape(font, "H")
    o = Shape(font, "o")
    O = Shape(font, "O")
    return {"xh": x.y1, "cap": H.y1, "asc": Shape(font, "l").y1, "desc": Shape(font, "p").y0,
            "o_top": o.y1, "o_bot": o.y0, "O_top": O.y1, "O_bot": O.y0,
            "fig": Shape(font, "1").y1 if font.getBestCmap().get(ord("1")) else None}
