"""Builds Area Serif: derive.py (Libre Baskerville -> Area Serif source), then TTF and WOFF2.
Usage: .venv/bin/python build.py   (keeps the last TTF in build/previous/ for qa.py --diff)"""
import os
import shutil
from fontTools.ttLib import newTable
from fontTools.ttLib.tables import ttProgram
from ufo2ft import compileTTF
import derive
import normalize

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "build")


def unhinted(ttf):
    """Unhinted on purpose (plan: renderers ignore x-hints; Google ships variable fonts unhinted).
    Smooth at every size, and smart dropout control so thin parts don't vanish."""
    gasp = newTable("gasp")
    gasp.version = 1
    gasp.gaspRange = {0xFFFF: 0x000F}
    ttf["gasp"] = gasp
    prep = newTable("prep")
    prep.program = ttProgram.Program()
    prep.program.fromAssembly(["PUSHW[ ]", "511", "SCANCTRL[ ]", "PUSHB[ ]", "4", "SCANTYPE[ ]"])
    ttf["prep"] = prep


def main():
    os.makedirs(OUT, exist_ok=True)
    ufo = derive.derive()
    normalize.normalize(ufo)                 # one value per shared part (flags, feet, stems, u's arch)
    ufo.save(derive.OUT, overwrite=True)
    ttf = compileTTF(ufo, removeOverlaps=True, flattenComponents=True)   # no nested components
    unhinted(ttf)
    head = ttf["head"]                       # Windows clips outside these: cover every glyph
    ttf["OS/2"].usWinAscent = max(head.yMax, ttf["hhea"].ascent)
    ttf["OS/2"].usWinDescent = max(-head.yMin, -ttf["hhea"].descent)
    path = os.path.join(OUT, "AreaSerif-Regular.ttf")
    if os.path.exists(path):
        os.makedirs(os.path.join(OUT, "previous"), exist_ok=True)
        shutil.copy(path, os.path.join(OUT, "previous", "AreaSerif-Regular.ttf"))
    ttf.save(path)
    ttf.flavor = "woff2"
    ttf.save(os.path.join(OUT, "AreaSerif-Regular.woff2"))
    print("built", path)


if __name__ == "__main__":
    main()
