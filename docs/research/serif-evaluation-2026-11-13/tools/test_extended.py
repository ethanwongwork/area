"""The character set beyond a-z, A-Z and 0-9, on every face with the same code (build 0.71).

  marks     every accent, read from the precomposed letters: the mark is what the letter has and its base has not.
            Size (height and width in x-heights), heaviest stroke (the largest circle that fits inside, in the
            class stem), gap to the letter (from the x-height or the cap height), and how far its ink centre sits
            from the base's. One mark over several bases should hold one gap and one size.
  stacks    Vietnamese letters with two marks: the white between the marks, whether they touch, the stack's top
            against the face's own line box.
  signs     punctuation, currency, maths and letter-like signs: height, heaviest stroke, upright stems and level
            bars where they have them, each as a share of the face's own stem, so Area Serif's share can be read
            against the other faces'.
  follow    Area Serif only: a glyph made from a letter still carries that letter's outline (every sampled point of
            the base lies on the composed glyph or under the part that was added).

Usage: python test_extended.py [--list]  -> extended.json"""
import json
import math
import os
import statistics as st
import sys
import unicodedata

import numpy as np
from PIL import Image, ImageChops, ImageDraw
from scipy import ndimage

import evlib as E
from test_strokes import bars, stems

PX = 2            # raster pixels per unit for the inscribed circle


def polys_of(font, ch=None, name=None):
    cs, adv = E.segs(font, ch, name)
    return E.flatten(cs or [], 1.5), adv


def bbox(polys):
    pts = [p for poly in polys for p in poly]
    return (min(p[0] for p in pts), min(p[1] for p in pts), max(p[0] for p in pts), max(p[1] for p in pts))


def raster(polys, pad=4):
    """Even-odd raster of polylines (the built fonts have no overlaps). Returns (bool array, x0, y1)."""
    x0, y0, x1, y1 = bbox(polys)
    W, H = int((x1 - x0 + 2 * pad) * PX) + 1, int((y1 - y0 + 2 * pad) * PX) + 1
    acc = None
    for poly in polys:
        layer = Image.new("1", (W, H), 0)
        ImageDraw.Draw(layer).polygon([((p[0] - x0 + pad) * PX, (y1 + pad - p[1]) * PX) for p in poly], fill=1)
        acc = layer if acc is None else ImageChops.logical_xor(acc, layer)
    return np.array(acc, dtype=bool), x0 - pad, y1 + pad


def heaviest(polys):
    """Diameter of the largest circle inside the ink, and its centre."""
    a, ox, oy = raster(polys)
    d = ndimage.distance_transform_edt(a)
    i = np.unravel_index(np.argmax(d), d.shape)
    return 2 * float(d[i]) / PX, (ox + i[1] / PX, oy - i[0] / PX)


def ink_area(polys):
    a, _, _ = raster(polys)
    return float(a.sum()) / PX / PX


def split_mark(font, ch, base_ch):
    """(mark polylines, base polylines as placed in the letter) or (None, None): contours of the precomposed letter
    that the base letter does not have. A mark drawn into the base's contour (some cedillas, ogoneks) gives None."""
    full, _ = polys_of(font, ch)
    base, _ = polys_of(font, base_ch)
    if not full or not base:
        return None, None
    bb = [bbox([p]) for p in base]
    mark, kept = [], []
    for poly in full:
        b = bbox([poly])
        w, h = b[2] - b[0], b[3] - b[1]
        if any(abs((c[2] - c[0]) - w) < 2.5 and abs((c[3] - c[1]) - h) < 2.5 and abs(c[1] - b[1]) < 2.5 for c in bb):
            kept.append(poly)
        else:
            mark.append(poly)
    if not mark or not kept:
        return None, None
    return mark, kept


# mark -> letters that carry it (lowercase, capitals). i's are measured apart: their base is the dotless i.
MARKS = {
    "acute": ("áéóúńćźś", "ÁÉÓÚŃĆŹŚ"), "grave": ("àèòù", "ÀÈÒÙ"), "circumflex": ("âêôûĉŝ", "ÂÊÔÛĈŜ"),
    "caron": ("čšžěňř", "ČŠŽĚŇŘ"), "tilde": ("ãõñ", "ÃÕÑ"), "dieresis": ("äëöü", "ÄËÖÜ"),
    "macron": ("āēōū", "ĀĒŌŪ"), "breve": ("ăĕŏŭ", "ĂĔŎŬ"), "ring": ("åů", "ÅŮ"), "dot": ("ċėż", "ĊĖŻ"),
    "hungarumlaut": ("őű", "ŐŰ"), "cedilla": ("çş", "ÇŞ"), "ogonek": ("ąęų", "ĄĘŲ"), "commabelow": ("șțņķļ", "ȘȚŅĶĻ"),
    "hook": ("ảẻỏủ", "ẢẺỎỦ"), "dotbelow": ("ạẹọụ", "ẠẸỌỤ"),
}
I_MARKS = {"acute": "í", "grave": "ì", "circumflex": "î", "dieresis": "ï", "tilde": "ĩ", "macron": "ī", "breve": "ĭ"}
BELOW = {"cedilla", "ogonek", "commabelow", "dotbelow"}
STACKS = "ấầẩẫắằẳẵếềểễốồổỗẤẦẨẪẮẰẲẴẾỀỂỄỐỒỔỖ"


def base_of(ch):
    b = unicodedata.normalize("NFD", ch)[0]
    return {"i": "ı"}.get(b, b)


def mark_measures(font, m, stem, cap_stem):
    xh, cap = m["xh"], m["cap"]
    out = {}
    cmap = font.getBestCmap()
    for mark, (lows, ups) in MARKS.items():
        for case, letters in (("lc", lows + (I_MARKS.get(mark, ""))), ("uc", ups)):
            rows = {}
            for ch in letters:
                b = base_of(ch)
                if ord(ch) not in cmap or ord(b) not in cmap:
                    continue
                mk, kept = split_mark(font, ch, b)
                if mk is None:
                    continue
                mb, kb = bbox(mk), bbox(kept)
                zone = xh if case == "lc" else cap
                S = stem if case == "lc" else cap_stem
                heavy, _ = heaviest(mk)
                if mark in BELOW:
                    gap = kb[1] - mb[3]                      # white under the letter (negative: the mark laps it)
                else:
                    gap = mb[1] - (zone if b not in "bdfhklt" else m["asc"])
                rows[ch] = {"h": round((mb[3] - mb[1]) / xh, 3), "w": round((mb[2] - mb[0]) / xh, 3),
                            "heavy": round(heavy / S, 3), "gap": round(gap / xh, 3),
                            "cx": round(((mb[0] + mb[2]) / 2 - (kb[0] + kb[2]) / 2) / S, 3),
                            "top": round(mb[3], 1), "bot": round(mb[1], 1), "units": [round(mb[3] - mb[1], 1), round(mb[2] - mb[0], 1), round(heavy, 1), round(gap, 1)]}
            if rows:
                out[f"{mark}.{case}"] = rows
    return out


def stack_measures(font, m):
    """Two marks over one letter: the white between them and the stack's top."""
    out = {}
    cmap = font.getBestCmap()
    for ch in STACKS:
        b = base_of(ch)
        if ord(ch) not in cmap:
            continue
        mk, kept = split_mark(font, ch, b)
        if mk is None or len(mk) < 2:
            continue
        boxes = sorted((bbox([p]) for p in mk), key=lambda q: q[1])
        lower, upper = boxes[0], boxes[-1]
        # the narrowest white between the two marks' inks, by raster dilation
        a, ox, oy = raster(mk)
        lab, n = ndimage.label(a)
        gap = None
        if n >= 2:
            sizes = ndimage.sum(a, lab, range(1, n + 1))
            order = np.argsort(sizes)[::-1][:2] + 1
            d = ndimage.distance_transform_edt(lab != order[0])
            gap = float(d[lab == order[1]].min()) / PX
        out[ch] = {"top": round(max(q[3] for q in boxes), 1), "gap": None if gap is None else round(gap, 1),
                   "pieces": int(n), "over": round(upper[1] - lower[3], 1), "side": round(upper[0] - lower[0], 1)}
    return out


SIGNS = ".,:;!?¡¿'\"‘’“”‚„‹›«»()[]{}/\\|¦-–—_*†‡§¶@&#%‰$¢£¥€ƒ¤+−×÷=≠<>±¬~^°©®™·•…ªº¹²³¼½¾ßæœÆŒøØđðþÞłŁıŋŊĸ"


def sign_measures(font, m, stem, cap_stem):
    out = {}
    cmap = font.getBestCmap()
    for ch in SIGNS:
        if ord(ch) not in cmap:
            continue
        sh = E.Shape(font, ch)
        if sh.empty:
            continue
        polys, adv = polys_of(font, ch)
        heavy, at = heaviest(polys)
        stv = [s for s in stems(sh, sh.y0 + 3, sh.y1 - 3, step=5) if s["y1"] - s["y0"] >= 60]
        brs = [b for b in bars(sh) if b["x1"] - b["x0"] >= 40]
        S = cap_stem if (sh.y1 > m["xh"] * 1.15) else stem
        out[ch] = {"y0": round(sh.y0, 1), "y1": round(sh.y1, 1), "w": round(sh.x1 - sh.x0, 1), "adv": round(adv, 1),
                   "lsb": round(sh.x0, 1), "rsb": round(adv - sh.x1, 1), "heavy": round(heavy, 1),
                   "heavy_s": round(heavy / S, 3), "stems": [round(s["w"], 1) for s in stv],
                   "bars": [round(b["t"], 1) for b in brs], "h_xh": round((sh.y1 - sh.y0) / m["xh"], 3),
                   "top_cap": round(sh.y1 / m["cap"], 3), "bot_xh": round(sh.y0 / m["xh"], 3),
                   "area": round(ink_area(polys) / (S * (sh.y1 - sh.y0)), 3)}
    return out


# Area Serif's glyphs made from a letter (charset.py), as glyph: (base, dx or None = find it)
FOLLOW = {"Dcroat": "D", "dcroat": "d", "Hbar": "H", "hbar": "h", "Tbar": "T", "tbar": "t", "Lslash": "L", "lslash": "l",
          "Oslash": "O", "oslash": "o", "thorn": "p", "eng": "n", "mu": "u", "ae": "e", "oe": "e", "AE": "E", "OE": "E",
          "fi": "f", "fl": "f", "f_f": "f", "longs": "f", "ohorn": "o", "uhorn": "u", "Ohorn": "O", "Uhorn": "U",
          "uni20BD": "P", "uni20BA": "L", "uni20A9": "W", "dong": "d", "idotless": "i", "jdotless": "j", "Thorn": "I",
          "summation": "Esh", "integral": "esh", "germandbls": None, "Eng": None, "kgreenlandic": None}


def follow(ufo):
    """Share of the base letter's outline that lies on the composed glyph's outline (within 0.8 units), trying the
    whole-unit shifts that fit best. Low: the glyph is not built on the finished letter."""
    out = {}

    def pts(name):
        pen = E.SegPen(ufo)
        ufo[name].draw(pen)
        return np.array([p for poly in E.flatten([c for c in pen.contours if c], 4.0) for p in poly])

    for name, base in FOLLOW.items():
        if name not in ufo or base is None or base not in ufo:
            out[name] = None
            continue
        G, B = pts(name), pts(base)
        best = 0.0
        gset = {}
        for x, y in G:
            gset.setdefault((int(round(x / 4)), int(round(y / 4))), []).append((x, y))
        cand = sorted({round(float(dx)) for dx in (G[:, 0].min() - B[:, 0].min(), G[:, 0].max() - B[:, 0].max(), 0)})
        for dx in cand:
            for dy in (0,):
                hit = 0
                for x, y in B[::2]:
                    k = (int(round((x + dx) / 4)), int(round((y + dy) / 4)))
                    ok = False
                    for i in (-1, 0, 1):
                        for j in (-1, 0, 1):
                            for gx, gy in gset.get((k[0] + i, k[1] + j), ()):
                                if abs(gx - x - dx) < 3.2 and abs(gy - y - dy) < 3.2:
                                    ok = True
                    hit += ok
                best = max(best, hit / len(B[::2]))
        out[name] = round(best, 3)
    return out


def main():
    os.makedirs(E.OUT, exist_ok=True)
    res = {}
    for key in E.available():
        f = E.face(key)
        m = E.metrics(f)
        n, H = E.Shape(f, "n"), E.Shape(f, "H")
        stem = n.h(m["xh"] * 0.3)[0]
        stem = stem[1] - stem[0]
        cs = H.h(m["cap"] * 0.3)[0]
        cs = cs[1] - cs[0]
        res[key] = {"metrics": m, "stem": round(stem, 1), "cap_stem": round(cs, 1),
                    "marks": mark_measures(f, m, stem, cs), "stacks": stack_measures(f, m),
                    "signs": sign_measures(f, m, stem, cs),
                    "box": {"hheaAsc": f["hhea"].ascent * 1000 / f["head"].unitsPerEm,
                            "hheaDesc": f["hhea"].descent * 1000 / f["head"].unitsPerEm,
                            "winAsc": f["OS/2"].usWinAscent * 1000 / f["head"].unitsPerEm,
                            "winDesc": f["OS/2"].usWinDescent * 1000 / f["head"].unitsPerEm}}
        print(f"{E.FACES[key][0]:20} marks {len(res[key]['marks'])} stacks {len(res[key]['stacks'])} signs {len(res[key]['signs'])}")
    import ufoLib2
    res["follow"] = follow(ufoLib2.Font.open(E.AREA_UFO))
    json.dump(res, open(os.path.join(E.OUT, "extended.json"), "w"))
    if "--list" in sys.argv:
        report(res)


def med(rows, k):
    v = [r[k] for r in rows.values() if r.get(k) is not None]
    return st.median(v) if v else None


def report(res):
    keys = [k for k in E.ORDER if k in res]
    print("\nMARKS: median over the bases (h, w in x-heights; heavy in class stems; gap in x-heights), and Area's spread")
    print(f"{'':18}" + "".join(f"{k[:9]:>24}" for k in keys))
    for mk in res["area"]["marks"]:
        line = f"{mk:18}"
        for k in keys:
            r = res[k]["marks"].get(mk)
            line += f"{'':24}" if not r else f"  {med(r, 'h'):.2f} {med(r, 'w'):.2f} {med(r, 'heavy'):.2f} {med(r, 'gap'):+.3f}"
        print(line)
        r = res["area"]["marks"][mk]
        gaps = {c: v["units"][3] for c, v in r.items()}
        hv = {c: v["units"][2] for c, v in r.items()}
        cx = {c: v["cx"] for c, v in r.items()}
        print(f"{'':18}  Area gaps {gaps}  heavy {min(hv.values()):.0f}-{max(hv.values()):.0f}  cx {cx}")
    print("\nSIGNS: heaviest stroke in class stems; stems; bars")
    print(f"{'':4}" + "".join(f"{k[:9]:>10}" for k in keys) + "   Area: y0 y1 heavy stems bars")
    for ch in SIGNS:
        if ch not in res["area"]["signs"]:
            print(ch, "missing in Area")
            continue
        a = res["area"]["signs"][ch]
        line = f"{ch:4}" + "".join(f"{(res[k]['signs'][ch]['heavy_s'] if ch in res[k]['signs'] else float('nan')):10.2f}" for k in keys)
        print(line + f"   {a['y0']:.0f} {a['y1']:.0f} {a['heavy']:.0f} {a['stems']} {a['bars']}")
    print("\nFOLLOW (share of the base's outline found on the glyph):")
    print("  " + "  ".join(f"{k} {v}" for k, v in res["follow"].items()))


if __name__ == "__main__":
    main()
