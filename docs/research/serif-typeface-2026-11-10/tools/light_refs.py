"""The Light master's targets: what the open references with a weight axis do between 400 and 300 (Source Serif 4,
Literata, Newsreader, Merriweather), on the parts the Bold engine sets from one number. Numbers only.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \
        ../../docs/research/serif-typeface-2026-11-10/tools/light_refs.py

Per face and weight, in units of its own em: n's stem, o's round stroke at its side and hairline at its top, H's
stem and bar, n's foot serif (thickness at its tip, reach beyond the stem), i's dot, n's advance and counter."""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools")))
import evlib as E  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402
from fontTools.varLib.instancer import instantiateVariableFont as inst  # noqa: E402
from single_g import spans  # noqa: E402

FACES = {"SourceSerif4": {"opsz": 20}, "Literata": {"opsz": 12}, "Newsreader": {"opsz": 18}, "Merriweather": {"opsz": 18, "wdth": 100}}


def P(font, ch):
    cs, adv = E.segs(font, ch, None)
    k = 1000 / font["head"].unitsPerEm
    return [[(x * k, y * k) for x, y in poly] for poly in E.flatten(cs, 1.0)], adv * k


def measure(font):
    m = E.metrics(font)
    k = 1000 / font["head"].unitsPerEm
    xh, cap = m["xh"] * k, m["cap"] * k
    n, nadv = P(font, "n")
    o, _ = P(font, "o")
    H, _ = P(font, "H")
    i, _ = P(font, "i")
    ns = spans(n, xh * 0.45, 1)
    stem = ns[0][1] - ns[0][0]
    counter = ns[1][0] - ns[0][1]
    os_ = spans(o, xh * 0.5, 1)
    rnd = os_[0][1] - os_[0][0]
    ox = (os_[0][0] + os_[-1][1]) / 2
    ov = spans(o, ox, 0)
    hair = ov[-1][1] - ov[-1][0]
    hs = spans(H, cap * 0.25, 1)
    hstem = hs[0][1] - hs[0][0]
    hx = (hs[0][1] + hs[1][0]) / 2
    bar = [s for s in spans(H, hx, 0)][0]
    # n's left foot serif: its ink at y = 4 (the tip) and how far it reaches left of the stem
    foot = spans(n, 2, 1)[0]
    reach = ns[0][0] - foot[0]
    tipx = foot[0] + 0.25 * reach
    tip = spans(n, tipx, 0)[0]
    dots = [poly for poly in i if min(p[1] for p in poly) > xh]
    dot = max(p[0] for p in dots[0]) - min(p[0] for p in dots[0]) if dots else 0
    return dict(stem=stem, round=rnd, hair=hair, Hstem=hstem, Hbar=bar[1] - bar[0], tip=tip[1] - tip[0], reach=reach,
                foot_w=foot[1] - foot[0], dot=dot, n_adv=nadv, n_counter=counter, xh=xh)


def main():
    rows = {}
    for name, fixed in FACES.items():
        path = os.path.join(os.environ["EVAL_FONTS"], name + ".ttf")
        for w in (300, 400, 700):
            rows[(name, w)] = measure(inst(TTFont(path), dict(fixed, wght=w)))
    keys = list(next(iter(rows.values())))
    print(f"{'':22s}" + "".join(f"{k:>10s}" for k in keys))
    for (name, w), r in rows.items():
        print(f"{name + ' ' + str(w):22s}" + "".join(f"{r[k]:10.1f}" for k in keys))
    print("\n300 / 400, and (400 - 300) / (700 - 400): how much of the Bold's step the Light takes back")
    for name in FACES:
        a, b, c = rows[(name, 300)], rows[(name, 400)], rows[(name, 700)]
        print(f"{name:22s}" + "".join(f"{a[k] / b[k]:10.3f}" for k in keys))
        print(f"{'':22s}" + "".join(f"{(b[k] - a[k]) / (c[k] - b[k]) if abs(c[k] - b[k]) > 0.5 else 0:10.2f}" for k in keys))


if __name__ == "__main__":
    main()
