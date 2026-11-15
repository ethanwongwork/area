"""Descender tails measured the same way on Area Serif and the references (numbers only; nothing drawn or stored):
the single-storey g (Area's and Serrif's g.ss02, Source Serif 4's and Literata's U+0261), j and y.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/tail_profile.py [area.ttf ...]

For each, in the face's own x-height (xh) and hairline (o's, `hair`):
  depth       lowest point under the baseline / xh
  width       the tail's reach left of the stem's right edge / xh
  low_x       where the lowest point lies, as a share of that reach from the stem's right edge
  k_spread    on the outer edge from where it leaves the stem to the ball's lowest-left point: the largest curvature
              over the smallest (smoothed over 24 units), the measure of "one round arc" (1 is a circle)
  k_turns     times the outer edge's curvature turns from rising to falling there (0 or 1 is one arc)
  thick       the stroke across itself at the stem (at y = -0.05 xh), at the lowest point, and its thinnest
              before the ball, each / hair; `thin_at` where the thinnest is, as a share of the reach
  ball        the terminal's height / hair, and its top under the baseline / xh
"""
import math
import os
import sys

import numpy as np
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402
import loop_profile as LP  # noqa: E402
import shapelib as S  # noqa: E402


def glyph_for(tt, key, ch):
    cmap = tt.getBestCmap()
    if ch == "g1":
        if 0x0261 in cmap:
            return cmap[0x0261]
        lay, _ = S.layout(tt, "g", {"ss02": True})
        return lay[0][0]
    return cmap[ord(ch)]


def resample(poly, step=3.0):
    out = [poly[0]]
    acc = 0.0
    P = poly + poly[:1]
    for a, b in zip(P, P[1:]):
        d = math.dist(a, b)
        while acc + d >= step:
            t = (step - acc) / d
            a = (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
            out.append(a)
            d = math.dist(a, b)
            acc = 0.0
        acc += d
    return out


def curv(pts, w=8):
    n = len(pts)
    ks = []
    for i in range(n):
        a, b, c = pts[(i - w) % n], pts[i], pts[(i + w) % n]
        ab, bc, ca = math.dist(a, b), math.dist(b, c), math.dist(c, a)
        cr = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        ks.append(2 * cr / (ab * bc * ca) if ab * bc * ca > 1e-9 else 0.0)
    return ks


def measure(tt, name):
    m = E.metrics(tt)
    xh = m["xh"]
    h = LP.hair(tt)
    P = LP.union_polys(tt, name, 1.0)
    outer = max(P, key=lambda q: abs(LP.area(q)))
    pts = resample(outer, 3.0)
    if LP.area(pts) < 0:
        pts = pts[::-1]
    arr = np.array(pts)
    low_i = int(np.argmin(arr[:, 1]))
    depth = arr[low_i, 1]
    # stem right edge: rightmost ink at y = -0.05 xh
    yy = -0.05 * xh
    xs = sorted(x for x, _ in LP.spans(P, yy, 1)) if hasattr(LP, "spans") else None
    sp = spans(P, yy)
    stem_r = sp[-1][1]
    stem_l = sp[-1][0]
    tail = [p for p in pts if p[1] < 0]
    reach_x = min(p[0] for p in pts if p[1] < -0.04 * xh)
    width = stem_r - reach_x
    # walk the outer edge from the stem's right edge at yy, counterclockwise means going down the right side first
    n = len(pts)
    i0 = min(range(n), key=lambda i: abs(pts[i][1] - yy) + abs(pts[i][0] - stem_r))
    # the ball's lowest-left: leftmost point under the baseline
    i1 = min((i for i in range(n) if pts[i][1] < -0.04 * xh), key=lambda i: pts[i][0])
    seg = [pts[(i0 + k) % n] for k in range((i1 - i0) % n + 1)]
    if len(seg) > n / 2:
        seg = [pts[(i0 - k) % n] for k in range((i0 - i1) % n + 1)]
    ks = [abs(k) for k in curv(seg, 8)][8:-8]
    sm = np.convolve(ks, np.ones(8) / 8, mode="valid")
    spread = max(sm) / max(min(sm), 1e-6)
    turns, d = 0, 0
    for a, b in zip(sm, sm[1:]):
        if abs(b - a) < 2e-5:
            continue
        s_ = 1 if b > a else -1
        if d == 1 and s_ == -1:
            turns += 1
        d = s_
    # thickness: across the stroke = shortest distance from inner tail points to the outer edge
    inner = [p for p in pts if p[1] < 0 and p[0] < stem_l + 1]
    def across(x, y):
        return min(math.dist((x, y), q) for q in seg)
    th_stem = sp[-1][1] - sp[-1][0]
    low = pts[low_i]
    v = spans(P, low[0], ax=0)
    th_low = min((s for s in v if s[0] < 0), key=lambda s: s[0])
    th_low = th_low[1] - th_low[0]
    thin, thin_x = 9e9, None
    ballw = width * 0.30
    for x in np.arange(reach_x + ballw, stem_l, 3):
        v = [s for s in spans(P, x, ax=0) if s[0] < -0.02 * xh]
        if v:
            s = min(v, key=lambda s: s[0])
            if s[1] - s[0] < thin:
                thin, thin_x = s[1] - s[0], x
    # ball: ink height at reach_x + 0.07 xh
    bv = [s for s in spans(P, reach_x + 0.07 * xh, ax=0) if s[1] < 0]
    ball_h = max(s[1] - s[0] for s in bv) if bv else 0
    ball_top = max(s[1] for s in bv) if bv else 0
    return dict(depth=-depth / xh, width=width / xh, low_x=(stem_r - low[0]) / width, k_spread=spread, k_turns=turns,
                th_stem=th_stem / h, th_low=th_low / h, thin=thin / h, thin_at=(stem_r - thin_x) / width,
                ball_h=ball_h / h, ball_top=-ball_top / xh)


def spans(P, v, ax=1):
    """Ink spans along x at y = v (ax 1) or along y at x = v (ax 0), even-odd."""
    hits = []
    for poly in P:
        n = len(poly)
        for i in range(n):
            a, b = poly[i], poly[(i + 1) % n]
            if (a[ax] <= v) != (b[ax] <= v):
                t = (v - a[ax]) / (b[ax] - a[ax])
                hits.append(a[1 - ax] + t * (b[1 - ax] - a[1 - ax]))
    hits.sort()
    return list(zip(hits[::2], hits[1::2]))


def row(label, r):
    return (f"{label:22s} " + " ".join(f"{k} {v:.3f}" if isinstance(v, float) else f"{k} {v}" for k, v in r.items()))


if __name__ == "__main__":
    faces = [(os.path.basename(p), TTFont(p)) for p in sys.argv[1:]]
    faces += [(E.FACES[k][0], E.face(k)) for k in ("area", "serrif", "source", "literata", "georgia")
              if os.path.exists(E.FACES[k][1])]
    for ch in ("g1", "j", "y"):
        print(f"== {ch}")
        for label, tt in faces:
            try:
                name = glyph_for(tt, None, ch)
                if ch == "g1" and name == tt.getBestCmap()[ord("g")]:
                    continue
                print(row(label, measure(tt, name)))
            except Exception as e:  # noqa: BLE001
                print(f"{label:22s} ({e})")
