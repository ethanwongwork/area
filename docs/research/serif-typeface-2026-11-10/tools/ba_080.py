"""Before over after for build 0.80, Area Serif only (0.79 from a snapshot folder), into build/figures.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/ba_080.py build/snap079 build/figures

  080-1-single-storey-g.png   the tail, Regular and Bold, 0.79 over 0.80, and the Light
  080-2-dollar.png            the one dollar: 0.79's default and alternate over 0.80's
  080-3-serifs.png            feet, flags and capital serifs at 300, 400, 500, 600, 700, large
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import shapelib as S  # noqa: E402
import weight_samples as W  # noqa: E402
from fontTools.ttLib import TTFont  # noqa: E402
from fontTools.varLib.instancer import instantiateVariableFont  # noqa: E402

old_dir, out = sys.argv[1], sys.argv[2]
new_dir = os.path.join(W.SERIF, "build")
R0, R1 = TTFont(os.path.join(old_dir, "AreaSerif-Regular.ttf")), TTFont(os.path.join(new_dir, "AreaSerif-Regular.ttf"))
B0 = instantiateVariableFont(TTFont(os.path.join(old_dir, "AreaSerif[wght].ttf")), {"wght": 700})
at = {w: instantiateVariableFont(TTFont(os.path.join(new_dir, "AreaSerif[wght].ttf")), {"wght": w}) for w in W.WEIGHTS}
sc = 2


def rows(label, text, fonts, feats=None, sizes=(150, 16)):
    return [(f"{label} · {tag}", [S.strip(f, text, feats or {}, px * sc, pad=0.4 if px > 30 else 0.6) for px in sizes]) for tag, f in fonts]


W.page(rows("Single-storey g (ss02)", "g gauging pig", (("Regular · 0.79", R0), ("Regular · 0.80", R1), ("Bold · 0.79", B0), ("Bold · 0.80", at[700]),
                                                        ("Light · 0.80", at[300])), {"ss02": True}),
       os.path.join(out, "080-1-single-storey-g.png"))
W.page(rows("Dollar", "$ $51 US$1,250.00", (("0.79 default", R0),)) + rows("Dollar", "$ $51 US$1,250.00", (("0.79 ss03", R0),), {"ss03": True})
       + rows("Dollar", "$ $51 US$1,250.00", (("0.80, the one dollar", R1), ("0.80 Light", at[300]), ("0.80 Bold", at[700]))),
       os.path.join(out, "080-2-dollar.png"))
W.page([(f"Serifs · {W.NAMES[w]}", [S.strip(at[w], "nil HIE pud", {}, 260 * sc, pad=0.25)]) for w in W.WEIGHTS], os.path.join(out, "080-3-serifs.png"))
print(out)
