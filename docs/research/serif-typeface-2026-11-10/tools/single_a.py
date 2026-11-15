"""The single-storey a, measured on the faces that have one (Serrif's ss01, Source Serif 4's and Literata's U+0251)
against each face's own o, d, n and two-storey a; and Area's candidates (numbers only; nothing drawn or stored).

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/single_a.py [candidate.ttf ...]

Per face: advance and ink width of the single-storey a over o's and n's; its bowl's ink width (left of the stem)
over d's; the stem's top above the x-height and how far the top reaches left of the stem (a spur or flag); the
exit: how far the ink reaches right of the stem's right edge at the foot, and the foot's height; colour, the ink
area over (stem x x-height), against the two-storey a's."""
import os
import sys

from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402
import loop_profile as LP  # noqa: E402
import shapelib as S  # noqa: E402
import tail_profile as TP  # noqa: E402


def name_of(tt, kind):
    cmap = tt.getBestCmap()
    if kind == "a1":
        if 0x0251 in cmap:
            return cmap[0x0251]
        lay, _ = S.layout(tt, "a", {"ss01": True})
        n = lay[0][0]
        if n != cmap[ord("a")]:
            return n
        lay, _ = S.layout(tt, "a", {"ss03": True})
        return lay[0][0]
    return cmap[ord(kind)]


def ink(tt, name):
    P = LP.union_polys(tt, name, 1.0)
    xs = [p[0] for q in P for p in q]
    ys = [p[1] for q in P for p in q]
    area = sum(LP.area(q) for q in P)
    return P, min(xs), max(xs), min(ys), max(ys), abs(area)


def adv(tt, name):
    return tt["hmtx"][name][0] * 1000 / tt["head"].unitsPerEm


def measure(tt, a1):
    m = E.metrics(tt)
    xh = m["xh"]
    out = {}
    Pa, x0, x1, y0, y1, area = ink(tt, a1)
    Po, ox0, ox1, *_r = ink(tt, name_of(tt, "o"))
    Pd, dx0, dx1, *_d = ink(tt, name_of(tt, "d"))
    Pn = ink(tt, name_of(tt, "n"))
    P2 = ink(tt, name_of(tt, "a"))
    mid = TP.spans(Pa, xh * 0.5)
    stem = mid[-1]
    sw = stem[1] - stem[0]
    dmid = TP.spans(Pd, xh * 0.5)
    out["adv/n"] = adv(tt, a1) / adv(tt, name_of(tt, "n"))
    out["adv/o"] = adv(tt, a1) / adv(tt, name_of(tt, "o"))
    out["ink/o"] = (x1 - x0) / (ox1 - ox0)
    out["bowl/d"] = (stem[0] - mid[0][0]) / (dmid[-1][0] - dmid[0][0])
    out["stem/xh"] = sw / xh
    top = max(p[1] for q in Pa for p in q if p[0] > stem[0] - 2)
    out["top/xh"] = top / xh
    # the stem's top: ink at 0.97 xh, how far left of the stem's left edge
    row = [s for s in TP.spans(Pa, 0.97 * xh) if s[1] > stem[0] - 5]
    out["spur_left/stem"] = (stem[0] - min(s[0] for s in row)) / sw if row else 0
    out["exit_right/stem"] = (x1 - stem[1]) / sw
    foot = [s for s in TP.spans(Pa, 0.04 * xh) if s[0] > stem[0] - 5]
    out["foot_w/stem"] = (max(s[1] for s in foot) - min(s[0] for s in foot)) / sw if foot else 0
    out["colour"] = area / (sw * xh)
    out["colour/2a"] = area / P2[5]
    return out


if __name__ == "__main__":
    faces = [(os.path.basename(p), TTFont(p), "a") for p in sys.argv[1:]]
    for k in ("serrif", "source", "literata"):
        if os.path.exists(E.FACES[k][1]):
            tt = E.face(k)
            faces.append((E.FACES[k][0], tt, name_of(tt, "a1")))
    for label, tt, a1 in faces:
        r = measure(tt, a1)
        print(f"{label:24s} " + " ".join(f"{k} {v:.3f}" for k, v in r.items()))
