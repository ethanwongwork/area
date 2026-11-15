"""Figures for build 0.81's glyph work (Area Serif only; nothing licensed is drawn, so the figures may be kept).

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/figs_081.py \
        build/look081 build/figures/glyphs-081

BEFORE is a folder holding 0.80's build (r080.ufo, r080.ttf, vf080.ttf); the 0.81 build is read from build/.
  g-before-after.png         the default g: outline, nodes, handles and curvature combs on the loop and link, 0.80
                             over 0.81; the ink at 600 px; words at 64, 16 and 13 px (each pixel drawn 3 times)
  gss02-before-after.png     the same for g.ss02, set with ss02
  gss02-neighbours.png       g.ss02 beside j y p q g and itself, both ways round, with the kerning
  a-chosen.png               a.ss03 and its 31 accented forms, and in words
  alternates.png             every alternate large, and in a line with its feature off and on, at 64, 16 and 13 px
  alternates-weights.png     the same lines at 300, 400 and 700 (the variable font)
"""
import os
import sys

import ufoLib2
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
sys.path[:0] = [HERE, SERIF]
import combs as CB  # noqa: E402
import curvecheck as K  # noqa: E402
import shapelib as S  # noqa: E402

LAB = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)


def pixels(tt, text, feats, px, scale=3):
    im = S.strip(tt, text, feats, px, ss=4, pad=0.6)
    return im.resize((im.width * scale, im.height * scale), Image.NEAREST)


def page(blocks, out, gap=26):
    """blocks: [(title, [images])]; images may be RGB or L."""
    ims = [(t, [i.convert("RGB") for i in imgs]) for t, imgs in blocks]
    W = max(i.width for _t, imgs in ims for i in imgs) + 40
    H = sum(36 + sum(i.height for i in imgs) + gap for _t, imgs in ims) + 10
    pg = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(pg)
    y = 10
    for t, imgs in ims:
        d.text((20, y), t, font=LAB, fill=(70, 70, 70))
        y += 32
        for i in imgs:
            pg.paste(i, (20, y))
            y += i.height
        y += gap
        d.line([(20, y - gap // 2), (W - 20, y - gap // 2)], fill=(225, 225, 225), width=2)
    pg.save(out)
    print(out)
    return out


def side(*imgs, gap=20):
    W = sum(i.width for i in imgs) + gap * (len(imgs) - 1)
    H = max(i.height for i in imgs)
    out = Image.new("RGB", (W, H), "white")
    x = 0
    for i in imgs:
        out.paste(i.convert("RGB"), (x, 0))
        x += i.width + gap
    return out


def ink(tt, text, feats, s, title):
    """The glyph as the built font draws it (overlaps removed), s pixels per unit."""
    im = S.strip(tt, text, feats, 1000 * s, ss=2, pad=0.05).convert("RGB")
    ImageDraw.Draw(im).text((10, 8), title, font=LAB, fill=(30, 30, 30))
    return im


def g_figure(before, out, name, feats, words, yr):
    r0 = ufoLib2.Font.open(os.path.join(before, "r080.ufo"))
    r1 = ufoLib2.Font.open(os.path.join(SERIF, "build", "AreaSerif-Regular.ufo"))
    t0, t1 = TTFont(os.path.join(before, "r080.ttf")), TTFont(os.path.join(SERIF, "build", "AreaSerif-Regular.ttf"))
    box = (-40, -270, 680, 600)
    b0, w0, *_r = K.report(name, K.glyph_points(r0, name), yr)
    b1, w1, *_r = K.report(name, K.glyph_points(r1, name), yr)
    blocks = [
        (f"{name}, 0.80: outline, handles, curvature combs on the descender ({len(b0)} faults by curvecheck.py: "
         + "; ".join(x.split(': ', 1)[1] for x in b0)[:150] + ")",
         [side(CB.draw_glyph(K.glyph_points(r0, name), r0[name].width, 1.0, "0.80", yr, box=box, numbers=True),
               ink(t0, "g", feats, 0.75, "0.80 as built"))]),
        (f"{name}, 0.81 ({len(b1)} faults; worst curvature ratio at a smooth node {w1:.2f})",
         [side(CB.draw_glyph(K.glyph_points(r1, name), r1[name].width, 1.0, "0.81", yr, box=box, numbers=True),
               ink(t1, "g", feats, 0.75, "0.81 as built"))]),
        ("0.80 then 0.81 at 64 px", [S.strip(t0, words, feats, 64, ss=2), S.strip(t1, words, feats, 64, ss=2)]),
        ("0.80 then 0.81 at 16 px and 13 px (each pixel 3 times larger)",
         [pixels(t0, words, feats, 16), pixels(t1, words, feats, 16), pixels(t0, words, feats, 13), pixels(t1, words, feats, 13)]),
    ]
    return page(blocks, out)


def neighbours(out):
    t1 = TTFont(os.path.join(SERIF, "build", "AreaSerif-Regular.ttf"))
    t0 = TTFont(os.path.join(SERIF, "build", "look081", "r080.ttf"))
    text = "gj gy gp gq gg jg yg pg qg · jig gyp gjallar · eggjárn · gypsy · agog"
    f = {"ss02": True}
    return page([("g.ss02 beside the descenders, 0.80 (it touched j) then 0.81 (kerned, never under 13 units)",
                  [S.strip(t0, text, f, 72, ss=2), S.strip(t1, text, f, 72, ss=2)]),
                 ("at 16 and 13 px", [pixels(t1, text, f, 16), pixels(t1, text, f, 13)])], out)


def a_chosen(out):
    r1 = ufoLib2.Font.open(os.path.join(SERIF, "build", "AreaSerif-Regular.ufo"))
    t1 = TTFont(os.path.join(SERIF, "build", "AreaSerif-Regular.ttf"))
    accented = "".join(chr(g.unicodes[0]) for g in r1 if g.components and g.components[0].baseGlyph == "a" and g.unicodes)
    big = CB.draw_glyph(K.glyph_points(r1, "a.ss03"), r1["a.ss03"].width, 0.9, "a.ss03", (-20, 140),
                        box=(-40, -60, 700, 600), numbers=True)
    f = {"ss03": True}
    return page([("a.ss03: outline, handles, combs on the foot · the two-storey a beside it",
                  [side(big, CB.draw_glyph(K.glyph_points(r1, "a"), r1["a"].width, 0.9, "a", None,
                                           box=(-40, -60, 700, 600), nodes=True))]),
                 ("its accented forms (ss03 on)", [S.strip(t1, accented[:16], f, 110, ss=2), S.strip(t1, accented[16:], f, 110, ss=2)]),
                 ("the same, ss03 off", [S.strip(t1, accented[:16], {}, 110, ss=2), S.strip(t1, accented[16:], {}, 110, ss=2)]),
                 ("words, ss03 on, 64 / 16 / 13 px",
                  [S.strip(t1, "Pagination · a banana animal · Ångström · Đà Nẵng · gala", f, 64, ss=2),
                   pixels(t1, "Pagination · a banana animal · Ångström · Đà Nẵng · gala · data plan", f, 16),
                   pixels(t1, "Pagination · a banana animal · Ångström · Đà Nẵng · gala · data plan", f, 13)]),
                 ("with ss02 too", [S.strip(t1, "a gala, again · baggage · Pagination", {"ss02": True, "ss03": True}, 64, ss=2)])],
                out)


ALTS = [("ss01", "1 2021 11:11 · 1l Il", "footless 1"), ("ss02", "g gauging pig · jigsaw", "single-storey g"),
        ("ss03", "a banana · Pagination · data", "single-storey a"),
        ("ss04", "l Illegal 1l lIl1 · hello · filling · Łódź · fl ffl", "tailed l"),
        ("zero", "0 O0o · 2026 · 100,000 · B0D8 · ID 0O8", "slashed zero"),
        ("ss05", "0 O0o · 2026 · 100,000 · B0D8 · ID 0O8", "dotted zero"),
        ("ss06", "7 1717 7/1 27,707 · z zigzag jazz · Żółć", "barred 7 and z")]


def alternates(out):
    t1 = TTFont(os.path.join(SERIF, "build", "AreaSerif-Regular.ttf"))
    r1 = ufoLib2.Font.open(os.path.join(SERIF, "build", "AreaSerif-Regular.ufo"))
    names = ["one.ss01", "g.ss02", "a.ss03", "l.ss04", "zero.zero", "zero.ss05", "seven.ss06", "z.ss06"]
    big = side(S.strip(t1, "1gal", {"ss01": True, "ss02": True, "ss03": True, "ss04": True}, 200, ss=2, pad=0.1),
               S.strip(t1, "0", {"zero": True}, 200, ss=2, pad=0.1), S.strip(t1, "0", {"ss05": True}, 200, ss=2, pad=0.1),
               S.strip(t1, "7z", {"ss06": True}, 200, ss=2, pad=0.1), gap=0)
    blocks = [("every alternate, Regular", [big])]
    for tag, text, label in ALTS:
        blocks.append((f"{tag} · {label} · off, then on (64 px; 16 and 13 px, each pixel 3 times larger)",
                       [S.strip(t1, text, {}, 64, ss=2), S.strip(t1, text, {tag: True}, 64, ss=2),
                        pixels(t1, text, {}, 16), pixels(t1, text, {tag: True}, 16),
                        pixels(t1, text, {}, 13), pixels(t1, text, {tag: True}, 13)]))
    tab = "0123456789 · 1000.00 · 7,070.07"
    blocks.append(("tabular figures (tnum) with zero, ss05, ss06: the columns hold",
                   [S.strip(t1, tab, {"tnum": True}, 56, ss=2), S.strip(t1, tab, {"tnum": True, "zero": True}, 56, ss=2),
                    S.strip(t1, tab, {"tnum": True, "ss05": True}, 56, ss=2), S.strip(t1, tab, {"tnum": True, "ss06": True}, 56, ss=2)]))
    return page(blocks, out)


def weights(out):
    vf = TTFont(os.path.join(SERIF, "build", "AreaSerif[wght].ttf"))
    feats = {t: True for t, _x, _l in ALTS}
    text = "1 g a l 0 0 7 z · agile gala · fl 2070 jazz"
    blocks = []
    for w in (300, 400, 700):
        tt = instantiateVariableFont(TTFont(os.path.join(SERIF, "build", "AreaSerif[wght].ttf")), {"wght": w})
        f2 = dict(feats)
        blocks.append((f"{w}: every set on (ss05 then zero last wins: dotted)", [S.strip(tt, text, f2, 72, ss=2),
                                                                               S.strip(tt, text, {}, 72, ss=2)]))
    return page(blocks, out)


if __name__ == "__main__":
    before, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    g_figure(before, os.path.join(outdir, "g-before-after.png"), "g", {}, "gauging piggy bag · agog · egg", (-300, 112))
    g_figure(before, os.path.join(outdir, "gss02-before-after.png"), "g.ss02", {"ss02": True}, "gauging piggy bag · agog · egg", (-300, 40))
    neighbours(os.path.join(outdir, "gss02-neighbours.png"))
    a_chosen(os.path.join(outdir, "a-chosen.png"))
    alternates(os.path.join(outdir, "alternates.png"))
    weights(os.path.join(outdir, "alternates-weights.png"))
