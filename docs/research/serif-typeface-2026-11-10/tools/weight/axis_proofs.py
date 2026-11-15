"""Proof sheets for build 0.81's weight axis, Area Serif only: for each class of fault, 0.80 over 0.81 at one scale,
and the whole set that failed in 0.80 drawn at 300 and 700 as 0.81 has it. Into build/figures/axis-081/.

    cd typefaces/area-serif && .venv/bin/python \\
        ../../docs/research/serif-typeface-2026-11-10/tools/weight/axis_proofs.py build/snap080 build/figures/axis-081

Glyphs are drawn from the masters as the variable font blends them (axislib.Masters), filled by non-zero winding;
a red ring marks where the outline crosses itself and a red stroke the curve that gains a turn, where the 0.80
audit found one. thin-at-points.png: the wedge accents' thinnest level or upright cut (red) beside the cut across
the arm (blue), at 400, 550 and 700.
"""
import os
import sys

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import axislib as A  # noqa: E402

CLASSES = [
    ("1-struck", "A stroke across a letter: one merged outline (0.80) / the letter and its strokes overlapping (0.81)",
     ["Astroke", "Estroke", "uni20A9", "uni20A1", "cstroke"], [300, 400, 550, 625, 700]),
    ("2-crotch", "A crotch moved past the curve leaving it (0.80) / held between its neighbours' levels (0.81)",
     ["glottalstop", "glottalstopreversed", "quoteleft", "ring_acutecomb"], [300, 400, 475, 700]),
    ("3-comma", "The comma read afresh in each drawing (0.80) / the comma's own move, sized and turned (0.81)",
     ["quoteright", "apostrophemod", "commaaccentcomb", "commaturnedabovecomb"], [300, 400, 625, 700]),
    ("4-small", "Small figures and ordinals on full-size gains (0.80) / their figure's move at their scale (0.81)",
     ["sixsuperior", "ninesuperior", "sixinferior", "ordfeminine"], [300, 400, 700]),
    ("5-signs", "Small signs on the letters' gains (0.80) / one law, (stem ratio) ^ 0.77 (0.81)",
     ["asterisk", "dagger", "daggerdbl", "trademark"], [300, 400, 700]),
    ("6-slant", "Serif and fillet on a slanted stroke moved by knots (0.80) / kept from the corner the edge lines make (0.81)",
     ["x", "Whook", "Nhookleft", "whook"], [300, 400, 475, 700]),
    ("7-fallbacks", "No master of their own (0.80: the Regular's outline or upright parts only) / built by rule (0.81)",
     ["uni2318", "uni2196", "uni20A1", "commaturnedabovecomb"], [300, 400, 700]),
    ("8-marks", "Wedge accents swelled then pressed into their box (0.80) / swollen into it, level cuts kept (0.81)",
     ["acute", "circumflex", "caron.case", "tilde", "hungarumlaut.case"], [300, 400, 550, 700]),
]


def cell(m, name, w, s, box, mark=True):
    cs = m.at(name, w, decompose=False)
    im = A.ink(cs, s, box, color=(30, 30, 30))
    return im


def class_sheet(old, new, key, title, names, weights, out):
    rows, titles = [], []
    for name in names:
        sets = [m.at(name, w, decompose=False) for m in (old, new) for w in weights]
        box = A.box_of(*sets, pad=25)
        s = 150 / max(box[3] - box[1], 1)
        for lab, m in (("0.80", old), ("0.81", new)):
            cells = [(f"{name} {lab} at {w}", cell(m, name, w, s, box)) for w in weights]
            rows.append(A.grid(cells, len(weights), label_h=16, gap=6))
        titles += [None, None]
    sheet = A.stack(rows, titles=[title] + [None] * (len(rows) - 1))
    sheet.save(os.path.join(out, f"{key}.png"))


def all_failing(new, names, out):
    for w in (300, 700):
        cells = []
        for n in names:
            try:
                cs = new.at(n, w, decompose=False)
            except KeyError:
                continue
            box = A.box_of(cs, pad=20)
            box = (box[0], -260, box[2], 1000)
            cells.append((n, A.ink(cs, 0.12, box)))
        A.grid(cells, 12, label_h=14, gap=6).save(os.path.join(out, f"all-failing-080-at-{w}.png"))


def thin_at_points(new, out):
    import bold as B
    import audit_axis as AX
    names = ["acute", "circumflex", "caron.case", "hungarumlaut"]
    cells = []
    for n in names:
        sets = [new.at(n, w, decompose=False) for w in (400, 550, 700)]
        box = A.box_of(*sets, pad=15)
        s = 320 / max(box[2] - box[0], box[3] - box[1])
        for w, cs in zip((400, 550, 700), sets):
            im = A.ink(cs, s, box, color=(150, 150, 150))
            d = ImageDraw.Draw(im)
            t = _thin_at(A.flat(cs, 8))
            if t:
                wv, ax, v, a, b = t
                p, q = ((a, v), (b, v)) if ax == 1 else ((v, a), (v, b))
                d.line([((p[0] - box[0]) * s, (box[3] - p[1]) * s), ((q[0] - box[0]) * s, (box[3] - q[1]) * s)], fill=(220, 0, 0), width=3)
            arm = _arm_cut(cs)
            if arm:
                (p, q), wd = arm
                d.line([((p[0] - box[0]) * s, (box[3] - p[1]) * s), ((q[0] - box[0]) * s, (box[3] - q[1]) * s)], fill=(0, 70, 230), width=3)
            lab = f"{n} {w}: thinnest cut {t[0]:.0f} (red)" + (f", across the arm {arm[1]:.0f} (blue)" if arm else "")
            cells.append((lab, im))
    A.grid(cells, 3, label_h=16).save(os.path.join(out, "thin-at-points.png"))
    del B, AX


def _thin_at(polys, step=4):
    import bold as B
    best = None
    pts = [q for p in polys for q in p]
    for ax in (0, 1):
        lo, hi = min(q[ax] for q in pts), max(q[ax] for q in pts)
        rows, vs = [], []
        v = lo + step / 2
        while v < hi:
            rows.append(B.scan(polys, v, ax))
            vs.append(v)
            v += step
        for k in range(2, len(rows) - 2):
            for a, b in rows[k]:
                w = b - a
                if best is not None and w >= best[0]:
                    continue
                if all(any(min(b, d) - max(a, c) > 0.5 * w and abs((d - c) - w) <= 0.2 * w + 2 for c, d in rows[j]) for j in (k - 2, k - 1, k + 1, k + 2)):
                    best = (w, ax, vs[k], a, b)
    return best


def _arm_cut(cs):
    """The longest straight edge's middle, measured along its normal into the ink to the far edge."""
    import math
    import numpy as np
    best = None
    for P in cs:
        n = len(P)
        for i, q in enumerate(P):
            r = P[(i + 1) % n]
            if q[2] is None or r[2] != "line":
                continue
            L = math.dist(q[:2], r[:2])
            if best is None or L > best[0]:
                best = (L, q, r)
    if not best:
        return None
    _, q, r = best
    mid = np.array([(q[0] + r[0]) / 2, (q[1] + r[1]) / 2])
    t = np.array([r[0] - q[0], r[1] - q[1]]) / best[0]
    polys = A.flat(cs, 16)
    import bold as B
    for sgn in (1, -1):
        nrm = sgn * np.array([-t[1], t[0]])
        s_ = 1.0
        inside = lambda p: any(a <= p[0] <= b for a, b in B.scan(polys, p[1], 1))   # noqa: E731
        if not inside(mid + 2 * nrm):
            continue
        while s_ < 300 and inside(mid + s_ * nrm):
            s_ += 0.5
        return (tuple(mid), tuple(mid + s_ * nrm)), s_
    return None


def main():
    old_dir, out = sys.argv[1], sys.argv[2]
    os.makedirs(out, exist_ok=True)
    old, new = A.Masters(old_dir), A.Masters("build")
    for key, title, names, weights in CLASSES:
        class_sheet(old, new, key, title, names, weights, out)
    fails = set()
    for f in ("audit-axis.txt", "audit-axis-light.txt"):
        p = os.path.join(old_dir, f)
        if os.path.exists(p):
            fails |= {line.split("\t")[1].split(" ")[0] for line in open(p) if "\t" in line}
    fails |= {"Astroke", "dagger", "uni20A1", "uni2318", "uni2196", "uni2197", "uni2198", "uni2199", "commaturnedabovecomb"}
    all_failing(new, sorted(fails), out)
    thin_at_points(new, out)
    print("written", sorted(os.listdir(out)))


if __name__ == "__main__":
    main()
