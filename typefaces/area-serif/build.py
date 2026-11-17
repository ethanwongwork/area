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
    import spacing as SPACING
    import weightaxis as WAX
    stem = int(os.environ.get("AREA_BOLD_STEM", BOLD.STEM))
    bold_ufo, reports, notes = BOLD.bold_font(ufo, stem)
    # 0.80: the Light master, the same engine run below the Regular (bold.LIGHT_STEM); it has no mid master.
    # 0.81: its side bearings from the references' own Light (bold.bearing_change reads light_bearings.json).
    light_ufo, lreports, lnotes = BOLD.bold_font(ufo, BOLD.LIGHT_STEM)
    if "mid" in light_ufo.layers:
        del light_ufo.layers["mid"]
    import overlap as OVERLAP
    reg_vf = OVERLAP.vf_source(ufo)             # 0.81: struck glyphs as letter and strokes, overlapping
    # the weight beside each master is the references' weight its same-weight fit is measured against (Georgia Pro
    # Light / Bold, Serrif 300 / 700), not an Area axis value: the Bold master is 800 on the 0.82 axis (weightaxis.py)
    kern = kern_masters(ufo, {"Light": (light_ufo, 300), "Bold": (bold_ufo, 700)}, reg_vf)
    notes.append(kern["Bold"])
    lnotes.append(kern["Light"])
    bold_ufo.save(os.path.join(OUT, "AreaSerif-Bold.ufo"), overwrite=True)
    with open(os.path.join(OUT, "bold-notes.txt"), "w") as f:
        f.write("\n".join(notes + [f"{n}: {r['fallback']}" for n, r in sorted(reports.items()) if r.get("fallback")]))
    light_ufo.save(os.path.join(OUT, "AreaSerif-Light.ufo"), overwrite=True)
    with open(os.path.join(OUT, "light-notes.txt"), "w") as f:
        f.write("\n".join(lnotes + [f"{n}: {r['fallback']}" for n, r in sorted(lreports.items()) if r.get("fallback")]))
    lfb = [n for n, r in lreports.items() if r.get("fallback")]
    if os.environ.get("AREA_MASTER_KERN", "1") != "0":
        print(f"kerning: {SPACING.equalize([reg_vf, light_ufo, bold_ufo])} keys made explicit so the three masters share one set")
    for u in (reg_vf, bold_ufo, light_ufo):
        u.lib["public.truetype.overlap"] = True
        for name in OVERLAP.struck_names(ufo):               # 0.81: the glyf flag, per glyph (ufo2ft reads it there)
            if name in u:
                u[name].lib["public.truetype.overlap"] = True
    vf = BOLD.variable(reg_vf, bold_ufo, stem, light_ufo)
    from fontTools.otlLib.builder import buildStatTable
    # 0.82 (owner round 8, axis): one axis value per named weight on the font's axis, Regular elidable and linked to
    # Bold 700 (weightaxis.NAMES)
    low = min(a.minValue for a in vf["fvar"].axes if a.axisTag == "wght")
    buildStatTable(vf, [dict(tag="wght", name="Weight", values=[
        dict(value=w, name=n, **(dict(flags=0x2, linkedValue=700) if w == 400 else {}))
        for w, n in WAX.named() if w >= low])], macNames=False)
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


def kern_masters(reg, masters, reg_shapes=None):
    """0.81: each master's kerning from its own outlines (spacing.kern_master: the Regular's fit carried by the rule,
    the same-weight fit, the collision passes at the master's floor). AREA_KERN_FIT=1 measures the same-weight fit
    again against the references (licensed fonts on this machine) and writes it to fit_kerning.json; otherwise the
    stored values are used. AREA_MASTER_KERN=0 keeps 0.80's behaviour (the Regular's pairs, opened)."""
    import json
    import charset as CHARSET
    import spacing as SPACING
    if os.environ.get("AREA_MASTER_KERN", "1") == "0":
        return {s: "kerning: the Regular's (AREA_MASTER_KERN=0)" for s in masters}
    fit_fn = None
    if os.environ.get("AREA_KERN_FIT") == "1":
        import sys
        sys.path.insert(0, os.path.join(HERE, "..", "..", "docs", "research", "serif-typeface-2026-11-10", "tools", "fit"))
        import weights as WEIGHTS
        fit_fn = WEIGHTS.master_fit
    out, table = {}, {}
    for style, (m, weight) in masters.items():
        rep = SPACING.kern_master(reg, m, style, CHARSET.COVERAGE, reg_shapes=reg_shapes,
                                  fit_fn=(lambda f, w=weight: fit_fn(f, w)) if fit_fn else None)
        table[style] = rep["fit"]
        out[style] = (f"kerning ({style}): {rep['transferred']} keys from the Regular's by the rule (white x "
                      f"{rep['scale']['ll']:.3f} lowercase, {rep['scale']['uu']:.3f} capitals; {rep['blind']} scaled, sharing no row), "
                      f"{rep['fitted']} moved to the nearer reference at weight {weight}, {rep['opened']} opened to {rep['floor']:.1f}, "
                      f"f before a dot {len(rep['dots'])}; at {rep['between']['weight']} (floor {rep['between']['floor']:.1f}) "
                      f"{len(rep['between']['opened'])} more: {', '.join(f'{a} {b}' for a, b, *_ in rep['between']['opened'][:12])}")
        print(out[style])
    if fit_fn:
        path = os.path.join(HERE, SPACING.FIT)
        data = json.load(open(path))
        data[SPACING.MASTER_FIT] = {s: sorted(v) for s, v in table.items()}
        data["masters_note"] = ("0.81, AREA_KERN_FIT=1 python build.py: per master, the change after the Regular's fit is "
                                "carried by the rule (spacing.transfer) that brings each pair outside both references at "
                                "the same weight (Georgia Pro Light / Bold, Serrif 300 / 700) by 8 or more to the nearer")
        json.dump(data, open(path, "w"), ensure_ascii=False, indent=0)
    return out


if __name__ == "__main__":
    main()
