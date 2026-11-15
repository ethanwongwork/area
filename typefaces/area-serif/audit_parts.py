"""Parts audit: are the shared parts of the lowercase built the same way across the letters that use them?

Every value is relative to the font's own n stem, so fonts compare at the same weight. For each part family it
prints each letter's value, the family's spread (max/min) and outliers (more than SPREAD_LIMIT away from the family
median). With --refs it runs the same audit on Serrif and Georgia Pro (installed copies, measured only), so a spread
can be judged against what two finished typefaces allow themselves.

Families:
  balls      largest circle that fits in each ball terminal (a c f r y j J, g's ear)
  flags      head serif (flag) length left of the stem (i j l m n p r u b d h k)
  feet       foot serif projection, left and right (i l m n h k r)
  arches     arch thickness at the x-height (n h m r) and at the baseline (u)
  counters   inner width at mid x-height (n h m u, o b d p q, and a's bowl, e)
  stems      vertical stem thickness (i l n h m u b d p q k r)
  bowls      thickest part of the round strokes (o b d p q c e)
  cap thins  level thin strokes of the capitals (H A bars, E F L T arms, B's middle, where P and R close)
  cap rounds round strokes of the capitals across at their thickest (O D P R, both bowls of B)
  head rise  how far a head serif's top edge rises to the stem (i n m p r u): 1.00 is a level slab
Usage: python audit_parts.py [--refs] [font.ttf]"""
import os
import sys
import statistics
import numpy as np
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from PIL import Image, ImageDraw, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
SPREAD_LIMIT = 0.12          # flag a letter more than 12% from its family's median
LIMITS = {"cap rounds": 0.05}  # both references hold B's bowls within 5% of the O (0.66's lower bowl was 7% over)


class Flat(BasePen):
    def __init__(self, gs):
        super().__init__(gs)
        self.cs = []

    def _moveTo(self, p):
        self.cs.append([p])

    def _lineTo(self, p):
        self.cs[-1].append(p)

    def _qCurveToOne(self, a, c):
        p = self.cs[-1][-1]
        for i in range(1, 13):
            t = i / 12
            u = 1 - t
            self.cs[-1].append((u * u * p[0] + 2 * u * t * a[0] + t * t * c[0], u * u * p[1] + 2 * u * t * a[1] + t * t * c[1]))

    def _curveToOne(self, a, b, c):
        p = self.cs[-1][-1]
        for i in range(1, 13):
            t = i / 12
            u = 1 - t
            self.cs[-1].append(tuple(u ** 3 * p[k] + 3 * u * u * t * a[k] + 3 * u * t * t * b[k] + t ** 3 * c[k] for k in (0, 1)))


class Glyph:
    def __init__(self, font, ch):
        gs = font.getGlyphSet()
        name = font.getBestCmap()[ord(ch)]
        pen = Flat(gs)
        gs[name].draw(pen)
        k = 1000 / font["head"].unitsPerEm
        self.cs = [[(x * k, y * k) for x, y in c] for c in pen.cs if len(c) > 2]
        pts = [q for c in self.cs for q in c]
        self.x0, self.x1 = min(q[0] for q in pts), max(q[0] for q in pts)
        self.y0, self.y1 = min(q[1] for q in pts), max(q[1] for q in pts)

    def _scan(self, v, ax):
        hits = []
        for c in self.cs:
            for i in range(len(c)):
                a, b = c[i], c[(i + 1) % len(c)]
                if (a[ax] <= v < b[ax]) or (b[ax] <= v < a[ax]):
                    t = (v - a[ax]) / (b[ax] - a[ax])
                    hits.append((a[1 - ax] + t * (b[1 - ax] - a[1 - ax]), 1 if b[ax] > a[ax] else -1))
        hits.sort()
        spans, w, st = [], 0, None
        for x, d in hits:
            if w == 0:
                st = x
            w += d
            if w == 0 and x - st > 0.5:
                spans.append((st, x))
        return spans

    def h(self, y):
        return self._scan(y + 0.013, 1)

    def v(self, x):
        return self._scan(x + 0.013, 0)

    def inscribed(self, region, res=2.0):
        """Diameter of the largest circle that fits in the ink inside region (x0, y0, x1, y1), in units."""
        x0, y0, x1, y1 = region
        W, H = int((self.x1 - self.x0) / res) + 6, int((self.y1 - self.y0) / res) + 6
        acc = None
        for c in self.cs:
            layer = Image.new("1", (W, H), 0)
            ImageDraw.Draw(layer).polygon([((x - self.x0) / res + 3, (self.y1 - y) / res + 3) for x, y in c], fill=1)
            acc = layer if acc is None else ImageChops.logical_xor(acc, layer)
        m = np.array(acc, dtype=bool)
        d = chamfer(m) * res
        ys, xs = np.mgrid[0:H, 0:W]
        gx, gy = (xs - 3) * res + self.x0, self.y1 - (ys - 3) * res
        sel = (gx >= x0) & (gx <= x1) & (gy >= y0) & (gy <= y1)
        return 2 * float(d[sel].max()) if sel.any() else 0.0


def chamfer(mask):
    """Distance from each ink pixel to the nearest background pixel (3-4 chamfer, in pixels)."""
    INF = 10 ** 6
    d = np.where(mask, INF, 0).astype(np.int64)
    H, W = d.shape
    for y in range(H):
        for x in range(W):
            if d[y, x]:
                best = d[y, x]
                if x > 0:
                    best = min(best, d[y, x - 1] + 3)
                if y > 0:
                    best = min(best, d[y - 1, x] + 3)
                    if x > 0:
                        best = min(best, d[y - 1, x - 1] + 4)
                    if x < W - 1:
                        best = min(best, d[y - 1, x + 1] + 4)
                d[y, x] = best
    for y in range(H - 1, -1, -1):
        for x in range(W - 1, -1, -1):
            if d[y, x]:
                best = d[y, x]
                if x < W - 1:
                    best = min(best, d[y, x + 1] + 3)
                if y < H - 1:
                    best = min(best, d[y + 1, x] + 3)
                    if x < W - 1:
                        best = min(best, d[y + 1, x + 1] + 4)
                    if x > 0:
                        best = min(best, d[y + 1, x - 1] + 4)
                d[y, x] = best
    return d / 3.0


def w(s):
    return s[1] - s[0]


def audit(font):
    g = {ch: Glyph(font, ch) for ch in "abcdefghijklmnopqrstuyJxHoABDEFLOPRT"}
    xh, cap = g["x"].y1, g["H"].y1
    stem = w(g["n"].h(xh * 0.35)[0])
    S = lambda v: v / stem
    out = {}

    def ball(ch, where):
        G = g[ch]
        wdt, hgt = G.x1 - G.x0, G.y1 - G.y0
        regions = {"tl": (G.x0, G.y0 + hgt * 0.55, G.x0 + wdt * 0.45, G.y1),
                   "tr": (G.x0 + wdt * 0.55, G.y0 + hgt * 0.55, G.x1, G.y1),
                   "bl": (G.x0, G.y0, G.x0 + wdt * 0.45, G.y0 + hgt * 0.4),
                   # g's ball only: right of the bowl, above it, so the ear's neck and root are not counted
                   "ear": (G.x1 - wdt * 0.2, xh * 0.85, G.x1, G.y1)}
        return S(G.inscribed(regions[where]))
    out["balls"] = {"a": ball("a", "tl"), "c": ball("c", "tr"), "f": ball("f", "tr"), "r": ball("r", "tr"),
                    "y": ball("y", "bl"), "j": ball("j", "bl"), "J": ball("J", "bl"), "g ear": ball("g", "ear")}

    def flag(ch, top):
        G = g[ch]
        st = G.h(top * 0.6)[0] if ch not in "bdhkl" else G.h(xh * 0.6)[0]
        if ch == "d":
            st = G.h(xh * 0.6)[-1]
        up = [q for c in G.cs for q in c if q[1] > top * 0.85 and q[0] < st[0] + 1]
        return S(st[0] - min(q[0] for q in up)) if up else 0.0
    asc = g["l"].y1
    out["flags"] = {ch: flag(ch, xh) for ch in "ijmnpru"}
    out["flags"].update({ch: flag(ch, asc) for ch in "bdhkl"})

    def feet(ch):
        G = g[ch]
        st = G.h(xh * 0.3)
        ft = G.h(3)
        return S(st[0][0] - ft[0][0]), S(ft[-1][1] - st[-1][1])
    out["feet (left)"] = {}
    out["feet (right)"] = {}
    for ch in "ilmnhkr":
        lft, rgt = feet(ch)
        out["feet (left)"][ch] = lft
        if ch not in "kr":
            out["feet (right)"][ch] = rgt

    def arch(ch, at_top=True):
        G = g[ch]
        st = G.h(xh * 0.3)
        mid = (st[0][1] + st[1][0]) / 2 if len(st) > 1 else (G.x0 + G.x1) / 2
        v = G.v(mid)
        span = max(v, key=lambda s: s[1]) if at_top else min(v, key=lambda s: s[0])
        return S(w(span))
    out["arches"] = {"n": arch("n"), "h": arch("h"), "m": arch("m"), "r": None, "u (base)": arch("u", False)}
    out["arches"].pop("r")

    def counter(ch, which=0):
        sp = g[ch].h(xh * 0.5)
        gaps = [sp[i + 1][0] - sp[i][1] for i in range(len(sp) - 1)]
        return S(gaps[which]) if len(gaps) > which else 0.0
    out["counters"] = {"n": counter("n"), "h": counter("h"), "m left": counter("m", 0), "m right": counter("m", 1),
                       "u": counter("u"), "o": counter("o"), "b": counter("b"), "d": counter("d"), "p": counter("p"),
                       "q": counter("q")}
    # measured on the straight part (half the x-height), not where bowls and arches join and the stem flares
    out["stems"] = {ch: S(w(g[ch].h(xh * (0.25 if ch in "kr" else 0.5))[0 if ch not in "dq" else -1]))
                    for ch in "ilnhmubdpqkr"}   # k's arm and r's shoulder join near half the x-height

    def bowl(ch):
        sp = g[ch].h(xh * 0.5)
        if ch in "bp":
            return S(w(sp[-1]))
        return S(w(sp[0]))
    out["bowls"] = {ch: bowl(ch) for ch in "obdpqce"}

    # 0.67 (evaluation of 2026-11-13): the three parts that had no row here, so their drift passed QA.
    cap = g["H"].y1

    def level(ch, lo, hi, min_len=60):
        """Thickness of the longest level stroke whose underside lies between lo and hi (shares of the cap height)."""
        G = g[ch]
        runs, x = {}, G.x0 + 4
        while x < G.x1 - 4:
            for a, b in G.v(x):
                if lo * cap <= a <= hi * cap and b - a < 120:
                    runs.setdefault(round(a), []).append(b - a)
            x += 5
        best = max(runs.values(), key=len, default=[])
        return S(statistics.median(best)) if len(best) * 5 >= min_len else 0.0
    out["cap thins"] = {"H bar": level("H", 0.4, 0.6), "A bar": level("A", 0.25, 0.5), "E top": level("E", 0.88, 0.96),
                        "E mid": level("E", 0.44, 0.56), "E bottom": level("E", -0.01, 0.01, 150),
                        "F mid": level("F", 0.42, 0.54), "L arm": level("L", -0.01, 0.01, 150),
                        "T arm": level("T", 0.88, 0.96), "B mid": level("B", 0.45, 0.56),
                        "P close": level("P", 0.4, 0.5), "R close": level("R", 0.42, 0.52)}

    def cap_round(ch, lo=0.3, hi=0.7, side=-1):
        """The round stroke across at its thickest: from the counter's side to the nearest point outside."""
        G = g[ch]
        zone = [(y, G.h(y)) for y in range(int(lo * cap), int(hi * cap), 6)]
        y, sp = max(((y, sp) for y, sp in zone if sp), key=lambda r: r[1][side][1] if side == -1 else -r[1][side][0])
        inner = sp[side][0] if side == -1 else sp[side][1]
        pts = [q for c in G.cs for q in c]
        outer = [q for q in pts if (q[0] > inner + 40 if side == -1 else q[0] < inner - 40) and abs(q[1] - y) < 160]
        return S(min(((q[0] - inner) ** 2 + (q[1] - y) ** 2) ** 0.5 for q in outer)) if outer else 0.0
    out["cap rounds"] = {"O": cap_round("O"), "D": cap_round("D"), "P": cap_round("P", 0.6, 0.9),
                         "R": cap_round("R", 0.6, 0.9), "B upper": cap_round("B", 0.62, 0.9),
                         "B lower": cap_round("B", 0.12, 0.42)}

    def head_rise(ch):
        """How far the head serif's top edge rises from 12 units inside its tip to the stem's far edge (0 on a slab)."""
        G = g[ch]
        st = G.h(xh * 0.45)[0]
        tip = min(q[0] for c in G.cs for q in c if xh * 0.85 < q[1] < xh + 40 and q[0] < st[0])
        top = lambda x: max((b for a, b in G.v(x) if b < xh + 40), default=0)
        return S(top(st[1] - 2) - top(tip + 12)) + 1.0        # +1 stem so a slab (0) still has a share of the median
    out["head rise"] = {ch: head_rise(ch) for ch in "inmpru"}
    return out


# Differences the references share, so not defects: o's counter is larger than the others' in Serrif and Georgia
# Pro too, and both draw J's end about 20% larger than the lowercase ones (Area: 1.27 against 1.04, all soft ends
# since 2026-11-11). g's ear now measures within the lowercase ends' spread.
# The owner's own point edits (owner_edits.json, 2026-11-11) sized three ends on purpose: r smaller, y larger, and
# g's ear smaller than the other lowercase ends.
EXPECTED = {("counters", "o"), ("balls", "J"), ("balls", "r"), ("balls", "y"), ("balls", "g ear")}


def report(name, out):
    bad = []
    print(f"\n### {name}")
    for fam, vals in out.items():
        vs = {k: v for k, v in vals.items() if v}
        med = statistics.median(vs.values())
        lim = LIMITS.get(fam, SPREAD_LIMIT)
        spread = max(vs.values()) / min(vs.values())
        odd = [f"{k} {v:.2f}" for k, v in vs.items() if abs(v - med) / med > lim]
        bad += [(fam, k) for k, v in vs.items() if abs(v - med) / med > lim and (fam, k) not in EXPECTED]
        print(f"{fam:14s} median {med:5.2f}  spread x{spread:4.2f}  " + "  ".join(f"{k}:{v:.2f}" for k, v in vs.items())
              + (f"   OUTLIERS: {', '.join(odd)}" if odd else ""))
    return bad


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    path = args[0] if args else os.path.join(HERE, "build", "AreaSerif-Regular.ttf")
    bad = report("Area Serif", audit(TTFont(path)))
    print(f"\nparts audit: {len(bad)} unexpected outlier(s)" + (": " + ", ".join(f"{f} {k}" for f, k in bad) if bad else ""))
    if "--refs" in sys.argv:
        from fontTools.varLib.instancer import instantiateVariableFont
        F = os.path.expanduser("~/Library/Fonts/")
        report("Serrif", audit(instantiateVariableFont(TTFont(F + "SerrifCollectionVF-TRIAL.ttf"),
                                                       {"wght": 400, "wdth": 100, "slnt": 0})))
        report("Georgia Pro", audit(TTFont(F + "GeorgiaPro-Regular.ttf")))
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
