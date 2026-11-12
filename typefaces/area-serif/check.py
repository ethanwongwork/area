"""Re-measures the built font and compares it with the plan's targets (per 1000 units)."""
import os
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
import derive as D

HERE = os.path.dirname(os.path.abspath(__file__))


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
        for i in range(1, 25):
            t = i / 24
            u = 1 - t
            self.cs[-1].append((u * u * p[0] + 2 * u * t * a[0] + t * t * c[0], u * u * p[1] + 2 * u * t * a[1] + t * t * c[1]))

    def _curveToOne(self, a, b, c):
        raise NotImplementedError


class G:
    def __init__(self, font, ch):
        gs = font.getGlyphSet()
        name = font.getBestCmap()[ord(ch)]
        pen = Flat(gs)
        gs[name].draw(pen)
        self.cs = pen.cs
        self.adv = gs[name].width
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


def main():
    f = TTFont(os.path.join(HERE, "build", "AreaSerif-Regular.ttf"))
    g = lambda ch: G(f, ch)
    n, o, H, O, I, l, e = g("n"), g("o"), g("H"), g("O"), g("I"), g("l"), g("e")
    xh, cap = D.X_HEIGHT, D.CAP_HEIGHT
    w = lambda s: s[1] - s[0]
    ns, os_, Hs, Is = n.h(175), o.h(250), H.h(250), I.h(350)
    ov = o.v((o.x0 + o.x1) / 2)
    ev = e.v((e.x0 + e.x1) / 2)
    Hb = H.v((Hs[0][1] + Hs[-1][0]) / 2)
    ft = I.h(15)   # mid-height of the tip, clear of its rounded corners
    proj = Is[0][0] - ft[0][0]
    tip = w(I.v(ft[0][0] + proj * 0.12)[0])
    near = w(I.v(ft[0][0] + proj * 0.88)[0])
    lf = l.h(15)
    os2, hh = f["OS/2"], f["hhea"]
    cap_t = D.CAP_HEIGHT
    tip_t = D.TARGET_TIP
    nadv_t = round((D.LB["nadv"] + D.TX * D.LB["nadv_d"]) * D.SCALE * D.SX)
    asc_t = round(D.ASC_RATIO * D.X_HEIGHT)
    rows = [
        ("x-height (OS/2)", os2.sxHeight, D.X_HEIGHT, 0), ("cap height (OS/2)", os2.sCapHeight, cap_t, 0),
        ("cap height (H, measured)", H.y1, cap_t, 1), ("x-height (x, measured)", g("x").y1, D.X_HEIGHT, 1),
        ("ascender (l, measured)", l.y1, asc_t, 3), ("descender (p, measured)", g("p").y0, -round(D.DESC_RATIO * D.X_HEIGHT), 3),
        ("n stem", w(ns[0]), D.TARGET_STEM, 1.5), ("H stem", w(Hs[0]), D.TARGET_CAP_STEM, 2),
        ("o thick / n stem", w(os_[0]) / w(ns[0]), D.ROUND_TO_STEM, 0.03),
        ("o contrast (thick / hairline)", w(os_[0]) / w(ov[0]), 1.64, 0.1),
        ("n advance", n.adv, nadv_t, 3), ("serif tip (I)", tip, tip_t, 2),
        ("J sits on the baseline", g("J").y0, -10, 12),
        ("line ascender", hh.ascent, 956, 0), ("line descender", hh.descent, -244, 0),
        ("typo = hhea", int(os2.sTypoAscender == hh.ascent and os2.sTypoDescender == hh.descent), 1, 0),
        ("caps centered in line box", (hh.ascent + hh.descent) / 2 - cap_t / 2, 0, 1),
    ]
    bad = 0
    for name, got, want, tol in rows:
        ok = abs(got - want) <= tol
        bad += not ok
        print(f"{'ok ' if ok else 'OFF'} {name:32s} {got:8.2f}  target {want}  (±{tol})")
    print(f"{len(rows) - bad} of {len(rows)} within tolerance")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
