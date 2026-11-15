"""The single-storey a, explored (0.81; owner: "exploring better ways to design the alternate a"). Every candidate is
built by typefaces/area-serif/alternates.py (SINGLE_A_FORMS) from the finished Regular's parts, set in a test font
in place of a (build/look081/cand-a-<form>.ttf), and judged by numbers and by eye. Area Serif only: the figures
may be kept.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/a_explore.py OUTDIR

Prints, per candidate: advance over n and o; colour (ink area over stem x x-height) over the two-storey a's;
distance from o and from d once rasterised at 11-13 px (tools/confusable.py's measure: 0 identical, higher is
safer); the bowl's width over g.ss02's. Writes OUTDIR/a-exploration.png: each candidate between n o d q and g.ss02
at 300 px, in words at 64 px, and at 16 and 13 px (each pixel drawn 3 times larger, so the rasterised ink can be read).
"""
import os
import sys

import ufoLib2
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont
from ufo2ft import compileTTF

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
sys.path[:0] = [HERE, SERIF, os.path.abspath(os.path.join(HERE, "..", "..", "serif-evaluation-2026-11-13", "tools"))]
import alternates as AL  # noqa: E402
import confusable as CF  # noqa: E402
import loop_profile as LP  # noqa: E402
import shapelib as S  # noqa: E402

LABEL = {"a": "a · d's bowl, q's spur, the two-storey a's curled exit",
         "b": "b · bowl narrowed to the two-storey a's ink width, q's spur, d's flat foot",
         "c": "c · d's bowl, a spur at both ends (q's head, and turned over at the foot), no exit",
         "d": "d · bowl narrowed to the references' advance (0.945 n), q's spur, the two-storey a's curled exit"}
WORDS = ("a banana animal again", "Pagination · data plan", "gala anagram · aqua dada")


def area_of(tt, name):
    return abs(sum(LP.area(q) for q in LP.union_polys(tt, name, 1.0)))


def candidates():
    reg = os.path.join(SERIF, "build", "AreaSerif-Regular.ufo")
    out = {}
    base = ufoLib2.Font.open(reg)
    tt0 = compileTTF(base, removeOverlaps=True, flattenComponents=True)
    p0 = os.path.join(SERIF, "build", "look081", "cand-a-two.ttf")
    tt0.save(p0)
    out["two-storey"] = p0
    for form in AL.SINGLE_A_FORMS:
        f = ufoLib2.Font.open(reg)
        lists, w, _l = AL.single_a_points(f, form)
        AL._set(f["a"], lists)
        f["a"].width = w
        f["g"].clearContours()                       # g.ss02 in g's place, so words show the pair
        AL._set(f["g"], [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in f["g.ss02"].contours])
        f["g"].width = f["g.ss02"].width
        p = os.path.join(SERIF, "build", "look081", f"cand-a-{form}.ttf")
        compileTTF(f, removeOverlaps=True, flattenComponents=True).save(p)
        out[form] = p
    return out


def numbers(paths):
    two = TTFont(paths["two-storey"])
    xh, stem = 520, 78
    c2 = area_of(two, "a")
    rows = []
    for key, p in paths.items():
        tt = TTFont(p)
        hm = tt["hmtx"]
        a, n, o = hm["a"][0], hm["n"][0], hm["o"][0]
        col = area_of(tt, "a") / (stem * xh)
        do = [CF.distance(CF.font(p, None, s), "a", "o", s) for s in (11, 12, 13)]
        dd = [CF.distance(CF.font(p, None, s), "a", "d", s) for s in (11, 12, 13)]
        P = LP.union_polys(tt, "a", 1.0)
        from tail_profile import spans
        row = spans(P, 260)
        bowl = row[-1][0] - row[0][0]
        G = LP.union_polys(tt, "g", 1.0)
        growr = spans(G, 260)
        gbowl = growr[-1][0] - growr[0][0]
        rows.append((key, a / n, a / o, col, area_of(tt, "a") / c2, do, dd, bowl / gbowl))
    return rows


def pixels(tt, text, px, scale=3):
    im = S.strip(tt, text, {}, px, ss=4, pad=0.6)
    return im.resize((im.width * scale, im.height * scale), Image.NEAREST)


def sheet(paths, rows, out):
    lab = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    blocks = []
    info = {r[0]: r for r in rows}
    for key in ["two-storey"] + list(AL.SINGLE_A_FORMS):
        tt = TTFont(paths[key])
        r = info[key]
        title = (("two-storey a (the default), for comparison" if key == "two-storey" else LABEL[key])
                 + f"   ·   advance {r[1]:.3f} n, {r[2]:.3f} o · colour {r[3]:.2f} ({r[4]:.2f} of the two-storey a) · "
                 f"from o {r[5][2]:.2f}, from d {r[6][2]:.2f} at 13 px")
        ims = [S.strip(tt, "noadqg" if key == "two-storey" else "nodqag", {}, 300, ss=2, pad=0.1)]
        ims += [S.strip(tt, w, {}, 64, ss=2, pad=0.3) for w in WORDS[:2]]
        ims += [pixels(tt, "  ".join(WORDS), 16), pixels(tt, "  ".join(WORDS), 13)]
        blocks.append((title, ims))
    W = max(im.width for _t, ims in blocks for im in ims) + 40
    H = sum(40 + sum(im.height for im in ims) + 30 for _t, ims in blocks)
    page = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(page)
    y = 10
    for title, ims in blocks:
        d.text((20, y), title, font=lab, fill=80)
        y += 34
        for im in ims:
            page.paste(im, (20, y))
            y += im.height
        y += 30
        d.line([(20, y - 15), (W - 20, y - 15)], fill=220, width=2)
    page.save(out)
    return out


if __name__ == "__main__":
    outdir = sys.argv[1]
    os.makedirs(outdir, exist_ok=True)
    paths = candidates()
    rows = numbers(paths)
    print(f"{'form':12} adv/n  adv/o  colour  /two-storey   from o (11 12 13)   from d (11 12 13)   bowl/g.ss02")
    for key, an, ao, col, rel, do, dd, gb in rows:
        print(f"{key:12} {an:.3f}  {ao:.3f}  {col:.2f}    {rel:.3f}       {' '.join(f'{v:.2f}' for v in do)}      "
              f"{' '.join(f'{v:.2f}' for v in dd)}        {gb:.3f}")
    print(sheet(paths, rows, os.path.join(outdir, "a-exploration.png")))
