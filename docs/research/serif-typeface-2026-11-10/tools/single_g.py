"""The single-storey g, measured on the faces that have one (Serrif's ss02, Source Serif 4's and Literata's U+0261)
and on Area's g.ss02. Numbers only; nothing is drawn from a reference.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/single_g.py [AreaSerif.ttf]

Per face, in its own q stems unless said: where the tail ends on the left against the bowl's left side (share of
the bowl's width from the stem's right edge), its depth against q's descender, its thickness at the lowest point
against the round letters' hairline, the terminal's height and how far its top stands under the baseline, the white
between bowl and tail under the bowl's middle, and the bowl against q's (lowest point, left side)."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402

REFS = {"serrif": "g.ss02", "source": "uni0261", "literata": "uni0261"}


def polys(font, name):
    cs, adv = E.segs(font, None, name)
    return E.flatten(cs, 1.0)


def spans(P, v, ax):
    """Ink spans along the other axis at x = v (ax 0) or y = v (ax 1), even-odd."""
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


def measure(font, name, qname="q", oname="o"):
    m = E.metrics(font)
    xh = m["xh"]
    G, Q, O = polys(font, name), polys(font, qname), polys(font, oname)
    pts = [p for poly in G for p in poly]
    qs = spans(Q, xh * 0.5, 1)[-1]
    stem = qs[1] - qs[0]
    gs = spans(G, xh * 0.5, 1)
    stem_r, bowl_l = gs[-1][1], gs[0][0]
    bowl_w = stem_r - bowl_l
    low = [p for p in pts if p[1] < -0.12 * xh]
    tail_l = min(p[0] for p in low)
    depth = min(p[1] for p in pts)
    bottom_x = min(low, key=lambda p: p[1])[0]
    thick = [s for s in spans(G, bottom_x, 0) if s[0] < -0.12 * xh][0]
    hair = spans(O, (min(p[0] for poly in O for p in poly) + max(p[0] for poly in O for p in poly)) / 2, 0)[-1]
    ball = [s for s in spans(G, tail_l + 0.5 * stem, 0) if s[1] < 0][0]
    ball_top = max(p[1] for p in low if p[0] < tail_l + 1.2 * stem)
    ball_bot = min(p[1] for p in low if p[0] < tail_l + 0.25 * stem)
    mid = (bowl_l + gs[-1][0]) / 2
    col = spans(G, mid, 0)
    bowl_bot = [s for s in col if s[1] > -0.1 * xh][0][0]
    tail_top = max(s[1] for s in col if s[1] < bowl_bot - 1) if any(s[1] < bowl_bot - 1 for s in col) else None
    qpts = [p for poly in Q for p in poly]
    q_bowl_bot = [s for s in spans(Q, (spans(Q, xh * .5, 1)[0][0] + qs[0]) / 2, 0)][0][0]
    return dict(xh=round(xh), stem=round(stem), bowl_w=round(bowl_w / stem, 2),
                tail_left=round((stem_r - tail_l) / bowl_w, 3), depth_of_q=round(depth / min(p[1] for p in qpts), 3),
                depth_xh=round(-depth / xh, 3), bottom_at=round((stem_r - bottom_x) / bowl_w, 3),
                tail_thick_hair=round((thick[1] - thick[0]) / (hair[1] - hair[0]), 2),
                tail_thick_stem=round((thick[1] - thick[0]) / stem, 2),
                ball_h=round((ball[1] - ball[0]) / stem, 2), ball_top_xh=round(-ball_top / xh, 3),
                gap=None if tail_top is None else round((bowl_bot - tail_top) / stem, 2),
                bowl_bot_xh=round(bowl_bot / xh, 3), q_bowl_bot_xh=round(q_bowl_bot / xh, 3),
                bowl_w_of_q=round(bowl_w / (qs[1] - spans(Q, xh * .5, 1)[0][0]), 3))


def main():
    rows = {k: measure(E.face(k), g) for k, g in REFS.items() if k in E.available()}
    area = TTFont(sys.argv[1]) if len(sys.argv) > 1 else E.face("area")
    if "g.ss02" in area.getGlyphOrder():
        rows["area"] = measure(area, "g.ss02")
    keys = list(next(iter(rows.values())))
    print(f"{'':18s}" + "".join(f"{k:>10s}" for k in rows) + f"{'mean refs':>11s}")
    for k in keys:
        vals = [rows[f][k] for f in rows]
        refs = [rows[f][k] for f in rows if f != "area" and rows[f][k] is not None]
        print(f"{k:18s}" + "".join(f"{str(v):>10s}" for v in vals) + f"{sum(refs) / len(refs):11.3f}")


if __name__ == "__main__":
    main()
