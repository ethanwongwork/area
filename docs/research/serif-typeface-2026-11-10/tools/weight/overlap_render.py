"""The variable font's overlaps on screen (0.81). For every struck glyph (overlap.py) the variable font is instanced
at 300, 400 and 700 twice: as it ships (overlapping contours, the overlap flag set) and with its overlaps removed
(fontTools instancer, removeOverlaps). Both are rendered by FreeType at 13, 16 and 64 px; any pixel that differs
by more than 8 of 255 is a seam or a sliver where two contours meet. Also: the static Regular has no overlapping
contours in those glyphs (its outline is the merge), and the flag is set in the variable font's glyf.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/overlap_render.py
"""
import io
import os
import sys

import freetype
import numpy as np
import pathops
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SERIF = os.getcwd()
sys.path.insert(0, SERIF)


def inst(w, merge):
    buf = io.BytesIO()
    instantiateVariableFont(TTFont("build/AreaSerif[wght].ttf"), {"wght": w}, overlap=2 if merge else 1).save(buf)
    return buf.getvalue()


def render(data, gid, px):
    face = freetype.Face(io.BytesIO(data))
    face.set_pixel_sizes(0, px)
    face.load_glyph(gid, freetype.FT_LOAD_NO_HINTING | freetype.FT_LOAD_RENDER)
    bm = face.glyph.bitmap
    a = np.array(bm.buffer, dtype=np.int16).reshape(bm.rows, bm.width) if bm.rows else np.zeros((1, 1), np.int16)
    return a, face.glyph.bitmap_left, face.glyph.bitmap_top


def main():
    import ufoLib2
    R = ufoLib2.Font.open("build/AreaSerif-Regular.ufo")
    names = [g.name for g in R.layers["overlap"]] if "overlap" in R.layers else []
    vf = TTFont("build/AreaSerif[wght].ttf")
    order = vf.getGlyphOrder()
    rev = {}
    post = vf["post"]
    del post
    # production names in the TTF may differ: map by unicode
    cmap = vf.getBestCmap()
    by_uni = {u: n for u, n in cmap.items()}
    targets = []
    for n in names:
        g = R[n]
        tn = by_uni.get(g.unicodes[0]) if g.unicodes else (n if n in order else None)
        if tn:
            targets.append((n, tn, order.index(tn)))
    flags_ok = all(vf["glyf"][tn].flags[0] & 0x40 for _, tn, _ in targets if vf["glyf"][tn].numberOfContours > 0)
    worst, darker = [], []
    for w in (300, 400, 700):
        a, b = inst(w, False), inst(w, True)
        for n, tn, gid in targets:
            for px in (13, 16, 64):
                x, xl, xt = render(a, gid, px)
                y, yl, yt = render(b, gid, px)
                if x.shape != y.shape or (xl, xt) != (yl, yt):
                    worst.append((n, w, px, "box differs"))
                    continue
                light = int((y - x).max())                     # kept lighter than merged: a white sliver
                dark = int((x - y).max())                      # kept darker: two edges' coverage added
                if light > 8:
                    worst.append((n, w, px, "lighter", light))
                if dark > 8:
                    darker.append((n, w, px, dark))
    st = TTFont("build/AreaSerif-Regular.ttf")
    gs = st.getGlyphSet()
    stcmap = st.getBestCmap()
    lapped = []
    for n, tn, gid in targets:
        sn = stcmap.get(R[n].unicodes[0]) if R[n].unicodes else None
        if not sn:
            continue
        rec = DecomposingRecordingPen(gs)
        gs[sn].draw(rec)
        p = pathops.Path()
        rec.replay(p.getPen())
        before = len(list(p.contours))
        u = pathops.op(p, pathops.Path(), pathops.PathOp.UNION)
        if len(list(u.contours)) != before:
            lapped.append(n)
    print(f"overlap flag set on every struck glyph in the variable font: {flags_ok}")
    print(f"{len(targets)} struck glyphs at 300, 400, 700 and 13, 16, 64 px, FreeType, overlaps kept against removed: "
          f"{'no pixel lighter by more than 8 of 255 (no white sliver)' if not worst else worst[:20]}")
    print(f"darker where two edges meet (anti-aliasing adds their coverage): {len(darker)} renders, "
          f"{len({d[0] for d in darker})} glyphs, at most {max((d[3] for d in darker), default=0)} of 255", sorted({d[0] for d in darker})[:20])
    print(f"static Regular: {'no overlapping contours in them' if not lapped else 'overlaps left in ' + ', '.join(lapped)}")
    sys.exit(1 if worst or lapped or not flags_ok else 0)


if __name__ == "__main__":
    main()
