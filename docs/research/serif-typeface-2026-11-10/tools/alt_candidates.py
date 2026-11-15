"""Alternate candidates for Area Serif (owner, 2026-11-14: "show me all the alternate glyph candidates like g,
such as a, etc. look into the other alternates too"). Candidates only: nothing here goes into the font.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts PYTHONPATH=. .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/alt_candidates.py build/figures

Each candidate is made from the finished Regular's own parts (build/AreaSerif-Regular.ufo), never by scaling:
  a  single-storey    q's stem top and bowl on d's foot: the letter is d under the x-height with q's top
  l  tailed           l's flag and stem on t's hook (t's own curve, moved to l's stem)
  0  slashed          the zero and a stroke of its own hairline across the counter, corner to corner, inside the oval
  0  dotted           the zero and the period's dot at the counter's middle
  7  barred           the seven and a bar of the figures' hairline across the diagonal, half way up
  z  barred           the z and a bar of the lowercase hairline across the diagonal, half way up
Writes candidate fonts into build/look (the candidates stand in for the defaults there, so words can be set), a
sheet into the out folder, and prints what the references that have the letter do (numbers only).
"""
import copy
import os
import sys

import pathops
import ufoLib2
from fontTools.ttLib import TTFont
from ufo2ft import compileTTF
from ufoLib2.objects import Contour, Point

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import charset as C  # noqa: E402
import shapelib as S  # noqa: E402
import weight_samples as W  # noqa: E402

SERIF = W.SERIF


def pts(c):
    return [(p.x, p.y, p.type, p.smooth) for p in c.points]


def set_contours(g, lists):
    g.clearContours()
    for P in lists:
        c = Contour()
        c.points = [Point(x, y, t, smooth=s) for x, y, t, s in P]
        g.contours.append(c)


def single_a(font):
    """d under the x-height with q's top. d's outline runs from the bowl's lowest point through the lower join and
    the foot up the stem's right edge; q's runs from its stem top (the spur) round the bowl. Spliced point for
    point where both are the same bowl, so no union and no scaling."""
    d, q = font["d"], font["q"]
    D = pts(max(d.contours, key=lambda c: len(c.points)))
    Q = pts(max(q.contours, key=lambda c: len(c.points)))
    top = C._edge_top(Q)                                   # q's stem top, right corner
    n = len(Q)
    crotch = next(i for i in range(top, top + n) if Q[i % n][2] and Q[(i + 1) % n][2] == "line"
                  and Q[(i + 1) % n][0] == Q[i % n][0] and Q[(i + 1) % n][1] < 0 and i != top)
    q_upper = [Q[i % n] for i in range(top, crotch + 1)]   # stem top, spur, bowl round to the lower join
    low = min(range(len(q_upper)), key=lambda i: q_upper[i][1] if q_upper[i][2] else 9e9)   # the bowl's lowest point
    # d from its bowl's lowest point to the top of the straight right edge of its stem
    start = next(i for i, p in enumerate(D) if p[2] and p[1] == q_upper[low][1] and p[0] == q_upper[low][0])
    up = next(i for i in range(start, start + len(D)) if D[i % len(D)][2] == "line" and D[i % len(D)][1] > 700)
    d_lower = [D[i % len(D)] for i in range(start, up)]    # ends at the foot's last curve point on the stem's edge
    outer = d_lower + q_upper[:low]                        # then up the edge to q's stem top and round the bowl
    counter = pts(min(q.contours, key=lambda c: len(c.points)))
    return [outer, counter], d.width


def tailed_l(font):
    """l's flag and stem on t's hook."""
    l, t = font["l"], font["t"]
    L, T = pts(l.contours[0]), pts(t.contours[0])
    lx0, lx1 = 106, None
    ups = [p for p in L if p[2] == "line" and p[1] > 700]
    lx1 = max(p[0] for p in ups)                                   # the stem's right edge (its top corner)
    lx0 = next(p[0] for p in L if p[2] == "curve" and p[3] and 600 < p[1] < 700)   # the left edge under the flag
    # t: from the left edge's lower end round the hook to the right edge's lower end
    a = next(i for i, p in enumerate(T) if p[2] == "line" and p[3] and T[i - 1][0] == p[0] and p[1] < 200)
    b = next(i for i in range(a, a + len(T)) if T[i % len(T)][2] == "curve" and T[i % len(T)][3] and T[(i + 1) % len(T)][2] == "line"
             and T[(i + 1) % len(T)][0] == T[i % len(T)][0] and i != a)
    hook = [list(T[i % len(T)]) for i in range(a, b + 1)]
    tx0, tx1 = hook[0][0], hook[-1][0]
    for p in hook:
        p[0] += lx0 - tx0
    for p in hook[-3:]:                                            # the right edge and its handle follow l's stem
        p[0] += lx1 - (tx1 + lx0 - tx0)
    i0 = next(i for i, p in enumerate(L) if p[0] == lx1 and p[1] > 700)
    i1 = next(i for i, p in enumerate(L) if p[2] == "curve" and p[3] and p[0] == lx0 and 600 < p[1] < 700)
    head = [L[i % len(L)] for i in range(i0, i1 + 1)]
    outer = head + [tuple(p) for p in hook]
    right = max(p[0] for p in outer)
    return [outer], round(right + (t.width - max(p[0] for p in T)))


def slashed_zero(font):
    z = C.gp(font, "zero")
    out_c, in_c = (pts(c) for c in font["zero"].contours)
    hair = max(p[1] for p in out_c) - max(p[1] for p in in_c)
    x0, x1 = min(p[0] for p in in_c), max(p[0] for p in in_c)
    y0, y1 = min(p[1] for p in in_c), max(p[1] for p in in_c)
    dx, dy = (x1 - x0), (y1 - y0)
    stroke = C.bar((x0 - dx, y0 - dy), (x1 + dx, y1 + dy), hair)
    oval = pathops.Path()
    pen = oval.getPen()
    font["zero"].contours[0].draw(pen) if hasattr(font["zero"].contours[0], "draw") else None
    outer = pathops.Path()
    from fontTools.pens.pointPen import PointToSegmentPen
    font["zero"].contours[0].drawPoints(PointToSegmentPen(outer.getPen()))
    cut = pathops.op(stroke, outer, pathops.PathOp.INTERSECTION, fix_winding=True, keep_starting_points=False)
    return C.union(z, cut)


def dotted_zero(font):
    z = C.gp(font, "zero")
    in_c = pts(font["zero"].contours[1])
    cx = (min(p[0] for p in in_c) + max(p[0] for p in in_c)) / 2
    cy = (min(p[1] for p in in_c) + max(p[1] for p in in_c)) / 2
    d = C.bounds(C.gp(font, "period"))
    r = (d[2] - d[0]) / 2
    return C.union(z, C.ellipse(cx, cy, r, r))


def barred(font, name, hair, reach):
    """A level bar of thickness `hair` across the glyph's diagonal at half its height, `reach` each side of it."""
    p = C.gp(font, name)
    b = C.bounds(p)
    y = (b[1] + b[3]) / 2
    sp = C.scan_h(p, y)
    s = sp[0] if len(sp) == 1 else max(sp, key=lambda q: q[1] - q[0])
    return C.union(p, C.rect(s[0] - reach, y - hair / 2, s[1] + reach, y + hair / 2))


def candidates(reg):
    out = {}
    f = copy.deepcopy(reg)
    lists, w = single_a(f)
    set_contours(f["a"], lists)
    f["a"].width = w
    out["a"] = ("single-storey a", f, "a", "a banana gala, madam: a data area", "q's top on d's foot")
    f = copy.deepcopy(reg)
    lists, w = tailed_l(f)
    set_contours(f["l"], lists)
    f["l"].width = w
    out["l"] = ("tailed l", f, "l", "l Illegal 1l lIl1 hello filling", "l's stem on t's hook")
    f = copy.deepcopy(reg)
    C.put(f, "zero", slashed_zero(f), f["zero"].width)
    out["0s"] = ("slashed zero", f, "0", "0 O0o 2026 100,000 B0D8", "zero + its hairline across the counter")
    f = copy.deepcopy(reg)
    C.put(f, "zero", dotted_zero(f), f["zero"].width)
    out["0d"] = ("dotted zero", f, "0", "0 O0o 2026 100,000 B0D8", "zero + the period's dot")
    f = copy.deepcopy(reg)
    m = C.M(f)
    C.put(f, "seven", barred(f, "seven", C.STROKE_UP, 70), f["seven"].width)
    out["7"] = ("barred 7", f, "7", "7 1717 7/1 27,707", "seven + a bar of the figures' hairline")
    f = copy.deepcopy(reg)
    C.put(f, "z", barred(f, "z", C.STROKE_LOW, 60), f["z"].width)
    out["z"] = ("barred z", f, "z", "z zigzag 2z jazz", "z + a bar of the lowercase hairline")
    return out


def main(outdir):
    reg = ufoLib2.Font.open(os.path.join(SERIF, "build", "AreaSerif-Regular.ufo"))
    base = TTFont(os.path.join(SERIF, "build", "AreaSerif-Regular.ttf"))
    look = os.path.join(SERIF, "build", "look")
    sc = 2
    blocks = []
    # the two the font already has
    blocks.append(("In the font · ss01 footless 1 · default above, alternate below",
                   [S.strip(base, "1 2021 11:11", {}, 120 * sc, pad=0.3), S.strip(base, "1 2021 11:11", {"ss01": True}, 120 * sc, pad=0.3)]))
    blocks.append(("In the font · ss02 single-storey g (0.80's tail) · default above, alternate below",
                   [S.strip(base, "g gauging pig", {}, 120 * sc, pad=0.3), S.strip(base, "g gauging pig", {"ss02": True}, 120 * sc, pad=0.3)]))
    for key, (label, ufo, ch, text, how) in candidates(reg).items():
        tt = compileTTF(ufo, removeOverlaps=True, flattenComponents=True)
        path = os.path.join(look, f"cand-{key}.ttf")
        tt.save(path)
        tt = TTFont(path)
        blocks.append((f"Candidate · {label} · {how} · default above, candidate below",
                       [S.strip(base, text, {}, 120 * sc, pad=0.3), S.strip(tt, text, {}, 120 * sc, pad=0.3),
                        S.strip(base, text, {}, 16 * sc, pad=0.6), S.strip(tt, text, {}, 16 * sc, pad=0.6)]))
    W.page(blocks, os.path.join(outdir, "alternates-candidates.png"))
    print(os.path.join(outdir, "alternates-candidates.png"))


if __name__ == "__main__":
    main(sys.argv[1])
