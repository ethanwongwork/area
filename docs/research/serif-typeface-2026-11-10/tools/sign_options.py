"""Three ways to draw the plain signs (hyphen, dashes, minus, plus, equals, bar, slash, underscore) so they sit
nearer the letters (owner, 2026-11-14). Options only: each is written into a small copy of the font under
build/weight, never into the build. Every size comes from a part Area already has or from `sign_ends.py`.

  soft      every corner takes the radius of the letters' cut ends (7)
  weighted  soft, and the hyphen at 1.13 dashes (Georgia Pro 1.26, Serrif 1.00: the mean)
  flared    soft, and each stroke swells into its ends: from the sign stroke (52) to 1.26 of it over one bracket's
            reach (0.80 stems, 62), the way a hairline arm runs into its end

    cd typefaces/area-serif && .venv/bin/python ../../docs/research/serif-typeface-2026-11-10/tools/sign_options.py
"""
import math
import os
import sys

import ufoLib2
from ufo2ft import compileTTF

HERE = os.path.dirname(os.path.abspath(__file__))
SERIF = os.path.abspath(os.path.join(HERE, "..", "..", "..", "..", "typefaces", "area-serif"))
sys.path[:0] = [SERIF, HERE]
import charset as C  # noqa: E402
import alts_sheet  # noqa: E402

R = 7                    # the letters' cut ends (soften_ends)
HYPHEN = 1.13            # hyphen over dash: mean of Georgia Pro (1.26) and Serrif (1.00)
FLARE = 1.26             # an end over its stroke: the heaviest ratio a reference carries between two of these signs
REACH = 62               # one bracket's reach: 0.80 of the 78 stem
KEEP = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,:;-–—−+=|/_()"


def soft(pts, r=R):
    """A polygon with every corner turned on radius r (a quarter-circle's handles)."""
    out, n, k = [], len(pts), 0.5523
    for i, p in enumerate(pts):
        a, b = pts[i - 1], pts[(i + 1) % n]
        da, db = math.dist(p, a), math.dist(p, b)
        ra, rb = min(r, da / 2), min(r, db / 2)
        p0 = (p[0] + (a[0] - p[0]) * ra / da, p[1] + (a[1] - p[1]) * ra / da)
        p1 = (p[0] + (b[0] - p[0]) * rb / db, p[1] + (b[1] - p[1]) * rb / db)
        c0 = (p0[0] + (p[0] - p0[0]) * k, p0[1] + (p[1] - p0[1]) * k)
        c1 = (p1[0] + (p[0] - p1[0]) * k, p1[1] + (p[1] - p1[1]) * k)
        out += [p0, ("c", c0, c1, p1)]
    return C.shape(out)


def flared(L, t, e=None, F=REACH):
    """A level stroke from 0 to L about y = 0, t thick, swelling to e at both ends over F."""
    e = e or t * FLARE
    F = min(F, L * 0.4)
    h, g = t / 2, e / 2
    lo = [(0, -g), ("c", (F * 0.3, -g + (g - h) * 0.55), (F * 0.5, -h), (F, -h)), (L - F, -h),
          ("c", (L - F * 0.5, -h), (L - F * 0.3, -g + (g - h) * 0.55), (L, -g))]
    hi = [(L, g), ("c", (L - F * 0.3, g - (g - h) * 0.55), (L - F * 0.5, h), (L - F, h)), (F, h),
          ("c", (F * 0.5, h), (F * 0.3, g - (g - h) * 0.55), (0, g))]
    return C.shape(lo + hi)


def box(font, name):
    b = C.bounds(C.gp(font, name))
    return b


def draw(font, kind):
    for name in ("hyphen", "endash", "emdash", "minus", "underscore", "bar", "slash", "plus", "equal"):
        g = font[name]
        w = g.width
        polys = [[(p.x, p.y) for p in c.points] for c in g.contours]
        if kind == "soft" or name == "slash" or (kind == "weighted" and name != "hyphen"):
            C.put(font, name, C.union(*[soft(p) for p in polys]), w)
            continue
        b = box(font, name)
        if kind == "weighted":                         # the hyphen alone
            t, cy = (b[3] - b[1]) * HYPHEN, (b[1] + b[3]) / 2
            C.put(font, name, soft([(b[0], cy - t / 2), (b[2], cy - t / 2), (b[2], cy + t / 2), (b[0], cy + t / 2)]), w)
            continue
        if name == "bar":
            p = C.moved(flared(b[3] - b[1], b[2] - b[0]), rotate=90)
            C.put(font, name, C.moved(p, (b[0] + b[2]) / 2, b[1]), w)
        elif name == "plus":
            t = 52
            cx, cy = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2
            lv = C.moved(flared(b[2] - b[0], t), b[0], cy)
            up = C.moved(C.moved(flared(b[3] - b[1], t), rotate=90), cx, b[1])
            C.put(font, name, C.union(lv, up), w)
        elif name == "equal":
            parts = []
            for p in polys:
                ys = [q[1] for q in p]
                parts.append(C.moved(flared(b[2] - b[0], max(ys) - min(ys)), b[0], (min(ys) + max(ys)) / 2))
            C.put(font, name, C.union(*parts), w)
        else:
            C.put(font, name, C.moved(flared(b[2] - b[0], b[3] - b[1]), b[0], (b[1] + b[3]) / 2), w)


def small(kind):
    font = ufoLib2.Font.open(os.path.join(SERIF, "build", "AreaSerif-Regular.ufo"))
    cmap = {u: g.name for g in font for u in g.unicodes}
    keep = {cmap[ord(c)] for c in KEEP if ord(c) in cmap} | {".notdef"}
    for n in [g.name for g in font if g.name not in keep]:
        del font[n]
    font.features.text = ""
    font.kerning.clear()
    font.groups.clear()
    font.lib["public.glyphOrder"] = [n for n in font.lib.get("public.glyphOrder", []) if n in keep]
    for key in ("public.postscriptNames", "public.openTypeCategories"):
        font.lib.pop(key, None)
    if kind != "now":
        draw(font, kind)
    out = os.path.join(SERIF, "build", "weight", f"AreaSerif-signs-{kind}.ttf")
    compileTTF(font, removeOverlaps=True).save(out)
    return out


if __name__ == "__main__":
    fonts = [(lab, small(k)) for lab, k in (("As built: plain bars, sharp corners", "now"),
                                            ("Option 1, soft: corners on the letters' radius", "soft"),
                                            ("Option 2, weighted: soft, the hyphen a little heavier than the dashes", "weighted"),
                                            ("Option 3, flared: soft, each stroke swells into its ends", "flared"))]
    print(alts_sheet.sheet(fonts, "- – — + = | / _", "re-read 3 + 4 = 7, pages 12–18 — a/b, x | y, file_name (2 − 1)",
                           os.path.join(SERIF, "build", "weight", "sign-options.png"), sizes=(13, 16, 32)))
