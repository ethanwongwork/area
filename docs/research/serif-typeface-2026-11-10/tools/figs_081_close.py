"""Build 0.81's figures for the owner, from the final build (Area Serif only; nothing licensed is drawn).

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_close.py \
        build/look081 build/figures/081

BEFORE (build/look081) holds 0.80's build: r080.ufo, r080.ttf, vf080.ttf (from build/snap080). Writes:
  1-g-before-after.png, 1-gss02-before-after.png   g and g.ss02, 0.80 over 0.81 (figs_081.g_figure)
  2-jy-before-after.png, 2-a-exit-before-after.png  j y and the a's exit, 0.80 over 0.81
  3-alternates.png, 3-alternates-weights.png        every set off and on; at 300, 400 and 700
  4-a-exploration.png                               the single-storey a's four constructions (a_explore.py)
  5-signs-struck.png                                signs and struck glyphs, 0.80 over 0.81 at 300 400 550 700
  6-waterfall.png, 7-text-sizes.png                 sheets_081.py
  8-kerning.png                                     kerning, 0.80 over 0.81 at 300 and 700
  9-stump-struck.png                                tools/weight/stump.py (the owner's decision)
  10-taper.png                                      thickness along j y f eng at 300 400 700, before over after
"""
import os
import shutil
import subprocess
import sys

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import figs_081 as F  # noqa: E402
import sheets_081 as SH  # noqa: E402
import shapelib as S  # noqa: E402

SIGNS = "* † ‡ ! ¡ \" ' ∏ ₹ ® ⌘ × § & @"
STRUCK = "Ⱥ Ɇ Ŧ ȼ ł Ł Ø ø Đ đ Ħ ħ ₩ ₦ ₱ ₭ ₮ ₲ ₡ ₿ ₽ ₺ ₫ ¢ ¥ Ɍ"
KERN = "AVATAR To Ty Wa f) v, gj LT P. Yo r. “A” (fj) 'Tavern' WAVY"


def inst(path, w):
    return instantiateVariableFont(TTFont(path), {"wght": w})


def before_after(before_vf, after_vf, text, weights, out, title, px=56):
    blocks = []
    for w in weights:
        blocks.append((f"{title} at {w}: 0.80 then 0.81", [S.strip(inst(before_vf, w), text, {}, px, ss=2),
                                                            S.strip(inst(after_vf, w), text, {}, px, ss=2)]))
    return F.page(blocks, out)


def main():
    before, od = sys.argv[1:3]
    os.makedirs(od, exist_ok=True)
    after_vf = os.path.join(F.SERIF, "build", "AreaSerif[wght].ttf")
    before_vf = os.path.join(before, "vf080.ttf")
    F.g_figure(before, os.path.join(od, "1-g-before-after.png"), "g", {}, "gauging piggy bag · agog · egg", (-300, 112))
    F.g_figure(before, os.path.join(od, "1-gss02-before-after.png"), "g.ss02", {"ss02": True},
               "gauging piggy bag · agog · egg", (-300, 40))
    F.jy_figure(before, os.path.join(od, "2-jy-before-after.png"))
    for ext in ("ufo", "ttf"):                                # a's exit: 0.80 as the before
        dst = os.path.join(before, f"r081r2.{ext}")
        if not os.path.exists(dst):
            (shutil.copytree if ext == "ufo" else shutil.copy)(os.path.join(before, f"r080.{ext}"), dst)
    F.a_exit_figure(before, os.path.join(od, "2-a-exit-before-after.png"))
    F.alternates(os.path.join(od, "3-alternates.png"))
    F.weights(os.path.join(od, "3-alternates-weights.png"))
    tmp = os.path.join(od, "_a")
    subprocess.run([sys.executable, os.path.join(HERE, "a_explore.py"), tmp], check=True)
    shutil.move(os.path.join(tmp, "a-exploration.png"), os.path.join(od, "4-a-exploration.png"))
    shutil.rmtree(tmp, ignore_errors=True)
    blocks = []
    for w in (300, 400, 550, 700):
        for label, text in (("signs", SIGNS), ("struck", STRUCK)):
            blocks.append((f"{label} at {w}: 0.80 then 0.81", [S.strip(inst(before_vf, w), text, {}, 56, ss=2),
                                                                S.strip(inst(after_vf, w), text, {}, 56, ss=2)]))
    F.page(blocks, os.path.join(od, "5-signs-struck.png"))
    SH.waterfall(os.path.join(od, "6-waterfall.png"))
    SH.text_sizes(os.path.join(od, "7-text-sizes.png"))
    before_after(before_vf, after_vf, KERN, (300, 700), os.path.join(od, "8-kerning.png"), "kerning")
    subprocess.run([sys.executable, os.path.join(HERE, "weight", "stump.py"), os.path.join(od, "9-stump-struck.png")], check=True)
    subprocess.run([sys.executable, os.path.join(HERE, "taper_plot.py"), os.path.join(F.SERIF, "build", "m1", "AreaSerif[wght].ttf"),
                    after_vf, os.path.join(od, "10-taper.png")], check=True)


if __name__ == "__main__":
    main()
