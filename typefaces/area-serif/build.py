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
    if os.environ.get("AREA_BOLD", "1") != "0":
        variable(ufo)


def variable(ufo):
    """0.76: the Bold master (bold.py: the Regular's own points, moved by rule) and the two as one variable font,
    weight 400 to 700. The Regular's files above are untouched. Overlaps stay in (both masters must keep one
    structure); the glyphs that have them are flagged for the rasteriser."""
    import bold as BOLD
    stem = int(os.environ.get("AREA_BOLD_STEM", BOLD.STEM))
    bold_ufo, reports, notes = BOLD.bold_font(ufo, stem)
    bold_ufo.save(os.path.join(OUT, "AreaSerif-Bold.ufo"), overwrite=True)
    with open(os.path.join(OUT, "bold-notes.txt"), "w") as f:
        f.write("\n".join(notes + [f"{n}: {r['fallback']}" for n, r in sorted(reports.items()) if r.get("fallback")]))
    # 0.80: the Light master, the same engine run below the Regular (bold.LIGHT_STEM); it has no mid master
    light_ufo, lreports, lnotes = BOLD.bold_font(ufo, BOLD.LIGHT_STEM)
    if "mid" in light_ufo.layers:
        del light_ufo.layers["mid"]
    light_ufo.save(os.path.join(OUT, "AreaSerif-Light.ufo"), overwrite=True)
    with open(os.path.join(OUT, "light-notes.txt"), "w") as f:
        f.write("\n".join(lnotes + [f"{n}: {r['fallback']}" for n, r in sorted(lreports.items()) if r.get("fallback")]))
    lfb = [n for n, r in lreports.items() if r.get("fallback")]
    import overlap as OVERLAP
    reg_vf = OVERLAP.vf_source(ufo)             # 0.81: struck glyphs as letter and strokes, overlapping
    for u in (reg_vf, bold_ufo, light_ufo):
        u.lib["public.truetype.overlap"] = True
        for name in OVERLAP.struck_names(ufo):               # 0.81: the glyf flag, per glyph (ufo2ft reads it there)
            if name in u:
                u[name].lib["public.truetype.overlap"] = True
    vf = BOLD.variable(reg_vf, bold_ufo, stem, light_ufo)
    from fontTools.otlLib.builder import buildStatTable
    buildStatTable(vf, [dict(tag="wght", name="Weight", values=[          # each named weight, Regular linked to Bold
        dict(value=300, name="Light"), dict(value=400, name="Regular", flags=0x2, linkedValue=700), dict(value=500, name="Medium"),
        dict(value=600, name="SemiBold"), dict(value=700, name="Bold")])], macNames=False)
    unhinted(vf)
    head = vf["head"]
    vf["OS/2"].usWinAscent = max(head.yMax, vf["hhea"].ascent)
    vf["OS/2"].usWinDescent = max(-head.yMin, -vf["hhea"].descent)
    path = os.path.join(OUT, "AreaSerif[wght].ttf")
    vf.save(path)
    vf.flavor = "woff2"
    vf.save(os.path.join(OUT, "AreaSerif[wght].woff2"))
    fb = [n for n, r in reports.items() if r.get("fallback")]
    print("built", path, f"(Bold stem {stem}; {len(fb)} glyphs on a fallback: {', '.join(sorted(fb))}; Light stem {BOLD.LIGHT_STEM}; "
          f"{len(lfb)} on a fallback: {', '.join(sorted(lfb))})")


if __name__ == "__main__":
    main()
