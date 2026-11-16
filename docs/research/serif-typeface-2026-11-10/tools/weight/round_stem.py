"""Round stroke against stem across weight (0.81): o's side at half the x-height (its thickest cut) over n's stem, at
300, 400 and 700, in Georgia Pro (Light, Regular, Bold), Source Serif 4, Literata, and Area Serif's variable font.

    cd typefaces/area-serif && EVAL_FONTS=build/eval-fonts .venv/bin/python \\
        ../../docs/research/serif-typeface-2026-11-10/tools/weight/round_stem.py
"""
import io
import os
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sign_k as K  # noqa: E402


def ratio(font):
    n, o = K.polys(font, "n"), K.polys(font, "o")
    xh = max(p[1] for c in n for p in c) - 10
    st = K.spans(n, 0.45 * xh)[0]
    sp = K.spans(o, 0.5 * xh)
    rnd = sp[0][1] - sp[0][0]
    return st[1] - st[0], rnd, rnd / (st[1] - st[0])


def inst(path, w, **pins):
    buf = io.BytesIO()
    instantiateVariableFont(TTFont(path), dict(pins, wght=w)).save(buf)
    buf.seek(0)
    return TTFont(buf)


def main():
    U, E = K.USER, K.EVAL
    rows = {"Georgia Pro": {w: TTFont(U + f"GeorgiaPro-{s}.ttf") for w, s in ((300, "Light"), (400, "Regular"), (700, "Bold"))}}
    for name, f in (("Source Serif 4", "SourceSerif4.ttf"), ("Literata", "Literata.ttf")):
        p = os.path.join(E, f)
        ax = {a.axisTag: a.defaultValue for a in TTFont(p)["fvar"].axes if a.axisTag != "wght"}
        rows[name] = {w: inst(p, w, **ax) for w in (300, 400, 700)}
    rows["Area Serif 0.81"] = {w: inst("build/AreaSerif[wght].ttf", w) for w in (300, 400, 700)}
    for name, fs in rows.items():
        print(name, "  ".join(f"{w}: stem {a:.1f} round {b:.1f} ratio {c:.3f}" for w, (a, b, c) in ((w, ratio(f)) for w, f in fs.items())))


if __name__ == "__main__":
    main()
