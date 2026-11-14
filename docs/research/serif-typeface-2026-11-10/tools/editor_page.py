"""Builds the Area Serif page, the one place the owner reviews and edits the typeface: every glyph's built points
(nodes, handles, smooth flags) with Libre Baskerville, Serrif, Georgia Pro, Inter and Atkinson Hyperlegible Next drawn
underneath at the same x-height; under the editor, the glyph over each face, in words in each face, and a type tester;
at the top, what changed in this build (changes.json) and which saves are in the build (owner_edits.json). The owner drags points;
saves land in the page's db (collection `edits`, one document per glyph), which Claude reads with ArtifactData and
folds into the build as `typefaces/area-serif/owner_edits.json` (applied last in normalize.py, then cleaned up).

Usage (from typefaces/area-serif, with its .venv), after pulling every save and running apply_edits.py:
  python ../../docs/research/serif-typeface-2026-11-10/tools/editor_page.py OUT.html LB.ttf INTER.woff2 [GLYPHS]
"""
import base64
import json
import os
import sys

import ufoLib2
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

F = os.path.expanduser("~/Library/Fonts/")
HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
BUILD = "0.66"   # bump on every regeneration; a save from another build loads only if owner_edits.json has not folded it in
NAMES = {str(i): n for i, n in enumerate("zero one two three four five six seven eight nine".split())}


def ufo_glyph(ufo, ch):
    name = NAMES.get(ch, ch)
    g = ufo[name]
    cs = [[[p.x, p.y, p.type or "", 1 if p.smooth else 0] for p in c.points] for c in g.contours]
    return name, {"char": ch, "advance": g.width, "contours": cs}


def bounds_ttf(font, ch):
    gs = font.getGlyphSet()
    bp = BoundsPen(gs)
    gs[font.getBestCmap()[ord(ch)]].draw(bp)
    return bp.bounds


def ref_path(font, ch, area_bounds, area_h, upper):
    """A reference glyph as an SVG path in Area's units (y up): scaled to Area's x-height or cap height and centred
    on Area's ink centre."""
    gs = font.getGlyphSet()
    h = bounds_ttf(font, "H" if upper else "x")[3]
    k = area_h / h
    x0, _, x1, _ = bounds_ttf(font, ch)
    ax = (area_bounds[0] + area_bounds[2]) / 2
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    gs[font.getBestCmap()[ord(ch)]].draw(TransformPen(pen, (k, 0, 0, k, ax - (x0 + x1) / 2 * k, 0)))
    return pen.getCommands()


def words():
    sys.path.insert(0, HERE)
    from letters_page import WORDS
    return WORDS


def build(out, lb, inter, chars):
    ufo = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    area = TTFont("build/AreaSerif-Regular.ttf")
    refs = {"lb": instantiateVariableFont(TTFont(lb), {"wght": 400}),
            "serrif": instantiateVariableFont(TTFont(F + "SerrifCollectionVF-TRIAL.ttf"), {"wght": 400, "wdth": 100, "slnt": 0}),
            "georgia": TTFont(F + "GeorgiaPro-Regular.ttf"),
            "inter": instantiateVariableFont(TTFont(inter), {"wght": 400}),
            "atkinson": instantiateVariableFont(TTFont(F + "AtkinsonHyperlegibleNext-VariableFont_wght.ttf"), {"wght": 400})}
    xh = bounds_ttf(area, "x")[3]
    cap = bounds_ttf(area, "H")[3]
    glyphs, order = {}, []
    for ch in chars:
        name, data = ufo_glyph(ufo, ch)
        b = bounds_ttf(area, ch)
        up = ch.isupper() or ch.isdigit()
        data["refs"] = {k: ref_path(f, ch, b, cap if up else xh, up) for k, f in refs.items()}
        glyphs[name] = data
        order.append(name)
    space = ufo["space"].width
    folded = {n: e.get("savedAt") for n, e in json.load(open("owner_edits.json")).items()}
    changes = json.load(open(os.path.join(HERE, "changes.json")))
    meta = {"xh": xh, "cap": cap, "asc": ufo.info.ascender, "desc": ufo.info.descender, "space": space,
            "order": order, "build": BUILD, "folded": folded, "changes": changes, "words": words()}
    page = open(os.path.join(HERE, "editor_template.html")).read()
    page = page.replace("/*DATA*/", json.dumps({"meta": meta, "glyphs": glyphs}, separators=(",", ":")))
    page = page.replace("/*AREA_WOFF2*/", base64.b64encode(open("build/AreaSerif-Regular.woff2", "rb").read()).decode())
    open(out, "w").write(page)
    print(out, len(page) // 1024, "KB")


if __name__ == "__main__":
    build(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else DEFAULT)
