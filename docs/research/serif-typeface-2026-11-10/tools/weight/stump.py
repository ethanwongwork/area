"""Round 3, item B: Astroke and Tdiagonalstroke at the Bold, the honest attempt (the letter and its whole stroke,
overlapping, as the build has them) beside a stump form (the stroke cut where it crosses the letter: kept only
outside the letter's convex hull), at 550, 625 and 700. For the owner's decision; nothing here is built into the font.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/stump.py OUT.png
"""
import os
import sys

import numpy as np
import pathops
import ufoLib2

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import axislib as A  # noqa: E402


def path_of(contours):
    p = pathops.Path()
    pen = p.getPen()
    for P in contours:
        on = [i for i, q in enumerate(P) if q[2] is not None]
        n = len(P)
        s = on[0]
        pen.moveTo(P[s][:2])
        buf = []
        for k in range(1, n + 1):
            q = P[(s + k) % n]
            if q[2] is None:
                buf.append(q[:2])
                continue
            pen.curveTo(*buf, q[:2]) if buf else pen.lineTo(q[:2])
            buf = []
        pen.closePath()
    return p


def contours_of_path(p):
    import overlap as OV
    return OV._path_contours(p)


def hull(points):
    pts = sorted(set(points))

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, hi = [], []
    for p in pts:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0:
            lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(hi) >= 2 and cross(hi[-2], hi[-1], p) <= 0:
            hi.pop()
        hi.append(p)
    return lo[:-1] + hi[:-1]


def main():
    out = sys.argv[1]
    sys.path.insert(0, os.getcwd())
    m = A.Masters("build")
    reg = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    rows = []
    for name in ("Astroke", "Tdiagonalstroke"):
        nl = reg.layers["overlap"][name].lib["area.overlap"]["letter_contours"]
        cells = []
        for w in (550, 625, 700):
            cs = m.at(name, w, decompose=False)
            letter, strokes = cs[:nl], cs[nl:]
            H = hull([tuple(map(float, q[:2])) for P in letter for q in P if q[2] is not None])
            hp = pathops.Path()
            pen = hp.getPen()
            pen.moveTo(H[0])
            for q in H[1:]:
                pen.lineTo(q)
            pen.closePath()
            stump = pathops.op(path_of(strokes), hp, pathops.PathOp.DIFFERENCE)
            stump_cs = contours_of_path(pathops.op(path_of(letter), stump, pathops.PathOp.UNION))
            box = A.box_of(cs, pad=25)
            s = 220 / max(box[3] - box[1], 1)
            cells.append((f"{name} {w}: honest (whole stroke)", A.ink(cs, s, box)))
            cells.append((f"{name} {w}: stump (cut inside the letter)", A.ink(stump_cs, s, box)))
        rows.append(A.grid(cells, 6, label_h=16, gap=8))
    # 0.81: both glyphs (stack's titles zip with its images: one title alone dropped the second row)
    A.stack(rows, titles=["Struck letters at the Bold: the pocket closes from 625 (honest) / the stroke cut where it "
                          "crosses the letter (stump). The owner's decision; neither swap is built."]
            + [None] * (len(rows) - 1)).save(out)


if __name__ == "__main__":
    main()
