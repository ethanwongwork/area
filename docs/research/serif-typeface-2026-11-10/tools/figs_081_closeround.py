"""Build 0.81, close round: figures for the rules and readings added after the integration round (Area Serif only;
nothing licensed is drawn).

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081_closeround.py \
        build/pre-close build/figures/081

BEFORE (build/pre-close) holds the integration round's build: its three UFO masters and its variable TTF. Writes:
  13-at.png              @ at 400, 550, 700: before over after (the slanted-stem rule), the audit's thinnest cut in red
  13-asterisk.png        the asterisk at 400 and 700 among Bold text, before over after (the star's reach)
  13-word-space-j.png    a word space before j at 400 and 700, before over after (space before j's class)
  13-comma-cut.png       the comma accent below a capital at 400 and 700: the old upright cut and the cut across
  13-hook-above.png      the capital hook above at 400, 552, 700 (not fixed: its slot closes)
"""
import math
import os
import sys

import numpy as np
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(HERE, "weight"))
import axislib as A  # noqa: E402
import figs_081 as F  # noqa: E402
import shapelib as S  # noqa: E402

SERIF = A.SERIF
sys.path.insert(0, SERIF)
import audit_axis as AX  # noqa: E402
import bold as B  # noqa: E402


def cut_of(cs, across=True):
    """The audit's thinnest cut: (value, middle, direction in degrees)."""
    rec = {}
    orig = AX.chords

    def spy(E, m, D, ends=False):
        got = orig(E, m, D, ends=ends)
        for g, d in zip(got, D):
            g = g[0] if ends and g is not None else g          # 0.81 (last round): chords may give the cut's ends
            if g is not None and (rec.get("v") is None or g < rec["v"]):
                rec.update(v=g, m=tuple(m), d=math.degrees(math.atan2(d[1], d[0])))
        return got
    AX.chords = spy
    try:
        v = AX.thinnest(AX.flat(cs), points=AX.points_of(cs), across=across)
    finally:
        AX.chords = orig
    return v, rec


def panel(cs, box, s, label, across=True):
    im = A.ink(cs, s, box, color=(185, 185, 185))
    A.outline(im, cs, s, box, nodes=True, color=(0, 90, 200))
    v, rec = cut_of(cs, across)
    if rec.get("m"):
        mx, my = rec["m"]
        L = rec["v"] / 2
        dx, dy = math.cos(math.radians(rec["d"])) * L, math.sin(math.radians(rec["d"])) * L
        ImageDraw.Draw(im).line([((mx - dx - box[0]) * s, (box[3] - my + dy) * s), ((mx + dx - box[0]) * s, (box[3] - my - dy) * s)],
                                fill=(220, 0, 0), width=4)
    return (f"{label}: thinnest across {v:.1f}" if v else label), im


def glyph_rows(before, after, name, weights, out, size=360):
    mb, ma = A.Masters(before), A.Masters(after)
    sets = [(t, m.at(name, w, False), w) for t, m in (("0.81 integration", mb), ("0.81 close", ma)) for w in weights]
    box = A.box_of(*[c for _, c, _ in sets], pad=20)
    s = size / max(box[2] - box[0], box[3] - box[1])
    cells = [panel(cs, box, s, f"{t}, {name} {w}") for t, cs, w in sets]
    A.grid(cells, len(weights)).save(out)


def strips(before_vf, after_vf, text, weights, out, title, px=64):
    blocks = []
    for w in weights:
        a = instantiateVariableFont(TTFont(before_vf), {"wght": w})
        b = instantiateVariableFont(TTFont(after_vf), {"wght": w})
        blocks.append((f"{title} at {w}: 0.81 integration, then 0.81 close", [S.strip(a, text, {}, px, ss=2), S.strip(b, text, {}, px, ss=2)]))
    F.page(blocks, out)


def comma_cut(after, out, size=320):
    m = A.Masters(after)
    sets = [(w, m.at("commaaccentcomb.case", w, False)) for w in (400, 700)]
    box = A.box_of(*[c for _, c in sets], pad=20)
    s = size / max(box[2] - box[0], box[3] - box[1])
    cells = []
    for w, cs in sets:
        for across in (False, True):
            cells.append(panel(cs, box, s, f"{w}, {'across the stroke' if across else 'level or upright (0.81 integration)'}", across))
    A.grid(cells, 4).save(out)


def main():
    before, od = sys.argv[1:3]
    after = os.path.join(SERIF, "build")
    vf_b, vf_a = os.path.join(before, "AreaSerif[wght].ttf"), os.path.join(after, "AreaSerif[wght].ttf")
    os.makedirs(od, exist_ok=True)
    glyph_rows(before, after, "at", (400, 550, 700), os.path.join(od, "13-at.png"))
    strips(vf_b, vf_a, "a*b, c.d f*g “h” * 1*2 @at", (400, 700), os.path.join(od, "13-asterisk.png"), "the asterisk", px=72)
    strips(vf_b, vf_a, "his jest · was just · as joy · by jury · new jam · yes, just", (400, 700),
           os.path.join(od, "13-word-space-j.png"), "a word space before j")
    comma_cut(after, os.path.join(od, "13-comma-cut.png"))
    glyph_rows(before, after, "hookabovecomb.case", (400, 552, 700), os.path.join(od, "13-hook-above.png"), size=260)
    print("figures in", od)


if __name__ == "__main__":
    main()
