"""Before over after for build 0.79's six items, Area Serif only (0.78 from a snapshot folder), into build/figures.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/ba_079.py build/snap078 build/figures
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
B1 = instantiateVariableFont(TTFont(os.path.join(new_dir, "AreaSerif[wght].ttf")), {"wght": 700})
sc = 2


def pair(label, text, feats=None, sizes=(110, 16), bold=True):
    rows = []
    for tag, a, b in (("Regular", R0, R1),) + ((("Bold", B0, B1),) if bold else ()):
        for when, f in (("0.78", a), ("0.79", b)):
            rows.append((f"{label} · {tag} · {when}", [S.strip(f, text, feats or {}, px * sc, pad=0.4 if px > 30 else 0.6) for px in sizes]))
    return rows


W.page(pair("Plain signs", "- – — − + = | / _ [ ] ± → ł đ ħ €", sizes=(90,)) + pair("In text", "re-read 3 + 4 = 7, pages 12–18 — a/b, x | y, file_name (2 − 1)", sizes=(32, 16, 13)),
       os.path.join(out, "1-signs.png"))
W.page(pair("Single-storey g (ss02)", "g gauging pig", {"ss02": True}, sizes=(150, 16)), os.path.join(out, "3-single-storey-g.png"))
W.page(pair("5 beside 3 6 9", "5 3569 2025", sizes=(150, 16)), os.path.join(out, "4-five.png"))
W.page(pair("Ligatures on", "fi fl ff ffi ffl fj fb fh fk ft", sizes=(100,)) + pair("Ligatures on, text", "office affluent fjord shelfful, five difficult files", sizes=(32, 16, 13))
       + pair("Ligatures off (unchanged)", "fi fl ff ffi ffl fj · office fjord", {"liga": False}, sizes=(60, 16)), os.path.join(out, "5-ligatures.png"))
print(out)
