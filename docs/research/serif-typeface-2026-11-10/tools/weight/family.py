"""A family of letters through bold.py: what the engine read on each, the checks, and a sheet with the Bold's ink,
the Regular's outline (black) and Georgia Pro Bold (blue) and Serrif 700 (red) at one x-height.

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/weight/family.py NAME glyph...
"""
import os
import sys

import ufoLib2
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

import weight as W
import bold as B
import evlib as E
import proof_weight as PW


def sheet(reg, names, stem, path, size=380, cols=5):
    refs = [(TTFont(p), 0.520 / PW.flat_x(p), col) for (lab, p), col in zip(PW.refs(), ((30, 90, 220), (220, 50, 40)))]
    cells = []
    for name in names:
        pts, width, rep = B.glyph_bold(reg[name], B.vector(stem))
        ss = 3
        im = Image.new("RGB", (size * ss, size * ss), "white")
        d = ImageDraw.Draw(im)
        k = size * ss / 1250
        bp = B.polys(pts, 3)
        xs = [x for p in bp for x, y in p]
        cx = (min(xs) + max(xs)) / 2

        def T(poly, kk=1.0, c=cx):
            return [((x * kk - c) * k + size * ss / 2, size * ss * 0.72 - y * kk * k) for x, y in poly]
        mask = Image.new("1", im.size, 0)
        from PIL import ImageChops
        for poly in bp:                                        # even-odd is right for these outlines (no overlaps)
            m = Image.new("1", im.size, 0)
            ImageDraw.Draw(m).polygon(T(poly), fill=1)
            mask = ImageChops.logical_xor(mask, m)
        im.paste((200, 200, 200), mask=mask)
        rp = B.polys(B.glyph_contours(reg[name]), 3)
        rx = [x for p in rp for x, y in p]
        for poly in rp:
            q = T(poly, 1.0, (min(rx) + max(rx)) / 2)
            d.line(q + [q[0]], fill=(0, 0, 0), width=1)
        ch = chr(reg[name].unicodes[0]) if reg[name].unicodes else None
        for f, kk, col in refs:
            if ch and ord(ch) in f.getBestCmap():
                s = E.Shape(f, ch)
                for poly in s.polys:
                    q = T(poly, kk, (s.x0 + s.x1) / 2 * kk)
                    d.line(q + [q[0]], fill=col, width=ss)
        d.text((8 * ss, 6 * ss), name, fill=(90, 90, 90), font=ImageFont.load_default(size=12 * ss))
        cells.append(im.resize((size, size), Image.LANCZOS))
    rows = (len(cells) + cols - 1) // cols
    out = Image.new("RGB", (size * min(cols, len(cells)), size * rows), "white")
    for i, im in enumerate(cells):
        out.paste(im, ((i % cols) * size, (i // cols) * size))
    out.save(path)
    return path


def run(tag, names, stem=B.STEM, quiet=False):
    reg = ufoLib2.Font.open(os.path.join(W.SERIF, "build", "AreaSerif-Regular.ufo"))
    fail = []
    for name in names:
        pts, width, rep = B.glyph_bold(reg[name], B.vector(stem))
        errs = B.sound(B.glyph_contours(reg[name]), pts)
        bend = 0.0
        fail += [f"{name}: {e}" for e in errs]
        if rep.get("fallback"):
            fail.append(f"{name}: {rep['fallback']}")
        for ax in "xy":
            for a, b, was, want, got, kind in rep[ax]:
                if kind == "diagonal not parallel":
                    fail.append(f"{name}: a slanted stroke's edges are {got} apart in thickness along it")
                elif kind == "turned over":
                    fail.append(f"{name}: {ax} {a}..{b} turned over")
                elif kind not in ("counter", "opening") and abs(got - round(want)) > 1.5:
                    fail.append(f"{name}: {ax} {kind} {a}..{b} is {got}, not {round(want)}")
        if not quiet:
            print(f"{name}: width {reg[name].width} > {width}; bend half way {bend:.2f}")
            for ax in "xy":
                print("   " + ax + ": " + "; ".join(f"{kind} {a}..{b} {was}>{got}" for a, b, was, want, got, kind in rep[ax]))
            if rep.get("necks"):
                print("   necks: " + "; ".join(f"at {x},{y} {d}>{got} (want {want}, moved {dy})" for x, y, d, want, got, dy in rep["necks"]))
    p = sheet(reg, names, stem, os.path.join(W.OUT, f"family-{tag}.png"))
    print(p)
    print("FAIL" if fail else "PASS", *fail, sep="\n  ")
    return fail


if __name__ == "__main__":
    run(sys.argv[1], sys.argv[2:])
