"""Rhythm and pair white on rendered text, the second method for the masters' kerning (0.81).

Text is shaped by HarfBuzz at the weight (kerning on, ligatures off) and each glyph rasterised by FreeType at that
weight, unhinted, at its fractional position: what a browser draws, not the outlines the kerning was fitted on.

  rhythm   for each word ("minimum", "illumination", "hnhnh", "nonon", "HHOHH"): the column ink of a band through
           the middle of the x-height (cap height for capitals), the stems found as the columns darker than half the
           word's darkest, and the white between each stem and the next (summed coverage). Spread = the coefficient
           of variation of those whites over all words: even stems give 0.
  pairs    for each kern-heavy pair, the white between the two glyphs' ink (each rendered alone at its place), per
           pixel row the two share, each side no deeper than fit.py's DEPTH behind its outermost ink, as a fraction
           of nn's (HH's for capitals) at the same size and weight. Spread = their standard deviation; drift = the
           mean difference from the same pair at 400.

    .venv/bin/python rhythm.py numbers FONT [FONT_BEFORE]     prints the table (both fonts when two are given)
    .venv/bin/python rhythm.py sheets BEFORE AFTER OUT_DIR     before-over-after sheets (text, kern-heavy, worst pairs)"""
import json
import os
import statistics as st
import sys

import freetype
import numpy as np
import uharfbuzz as hb
from PIL import Image, ImageDraw, ImageFont

WEIGHTS = (300, 400, 700)
SIZES = (13, 16, 64)
WORDS = ["minimum", "illumination", "hnhnh", "nonon", "HHOHH"]
KERN_HEAVY = ["AV", "VA", "AT", "TA", "To", "Ty", "Ta", "Te", "Wa", "We", "Yo", "LT", "LV", "LY", "P.", "P,", "r.",
              "r,", "y.", "v,", "w.", "f)", "f?", "f'", "F.", "T.", "V.", "Y.", "'A", "A'", "“A", "L’", "ry", "av",
              "vo", "ky", "AY", "FA", "PA", "gj", "yj", "qj"]
FEATS = {"kern": True, "liga": False, "clig": False, "calt": False}
HELV = "/System/Library/Fonts/Helvetica.ttc"


class Face:
    def __init__(self, path, w):
        self.path, self.w = path, w
        self.ft = freetype.Face(path)
        try:
            self.ft.set_var_design_coords([w])
        except Exception:
            pass
        self.upm = self.ft.units_per_EM
        self.hbf = hb.Font(hb.Face(open(path, "rb").read()))
        self.hbf.set_variations({"wght": w})

    def shape(self, items):
        """items: [(char, feature or None)] -> [(glyph id, x in font units)], total advance."""
        buf = hb.Buffer()
        buf.add_str("".join(c for c, _ in items))
        buf.guess_segment_properties()
        f = dict(FEATS)
        for i, (_, tag) in enumerate(items):
            if tag:
                f.setdefault(tag, []).append((i, i + 1, 1))
        hb.shape(self.hbf, buf, f)
        x, out = 0, []
        for gi, gp in zip(buf.glyph_infos, buf.glyph_positions):
            out.append((gi.codepoint, x + gp.x_offset))
            x += gp.x_advance
        return out, x

    def render(self, glyphs, size, pad=None, split=False):
        """Coverage in [0, 1] (rows top down), baseline row, and with split a list of one array per glyph."""
        k = size / self.upm
        asc, desc = int(np.ceil(1.0 * size)), int(np.ceil(0.35 * size))
        pad = pad if pad is not None else size
        width = int(max(x for _, x in glyphs) * k + 2.5 * size) + 2 * pad
        base = asc + 2
        layers = []
        canvas = np.zeros((asc + desc + 4, width))
        self.ft.set_char_size(int(size * 64))
        for gid, x in glyphs:
            px = pad + x * k
            ix = int(np.floor(px))
            frac = px - ix
            self.ft.set_transform(freetype.Matrix(65536, 0, 0, 65536), freetype.Vector(int(frac * 64), 0))
            self.ft.load_glyph(gid, freetype.FT_LOAD_NO_HINTING | freetype.FT_LOAD_RENDER)
            g = self.ft.glyph
            bm = g.bitmap
            arr = np.array(bm.buffer, dtype=float).reshape(bm.rows, bm.width) / 255 if bm.rows and bm.width else None
            layer = np.zeros_like(canvas) if split else None
            if arr is not None:
                top = base - g.bitmap_top
                left = ix + g.bitmap_left
                y0, x0 = max(top, 0), max(left, 0)
                y1, x1 = min(top + bm.rows, canvas.shape[0]), min(left + bm.width, canvas.shape[1])
                sub = arr[y0 - top:y1 - top, x0 - left:x1 - left]
                canvas[y0:y1, x0:x1] = np.minimum(1, canvas[y0:y1, x0:x1] + sub)
                if split:
                    layer[y0:y1, x0:x1] = sub
            if split:
                layers.append(layer)
        return canvas, base, layers


def chars(s):
    """'g.ss02+j' and plain text to [(char, feature)]."""
    out, i = [], 0
    while i < len(s):
        if s.startswith("g.ss02", i):
            out.append(("g", "ss02"))
            i += 6
            if i < len(s) and s[i] == "+":
                i += 1
            continue
        out.append((s[i], None))
        i += 1
    return out


def stem_whites(face, word, size):
    """[(white, between letters?)] from each stem to the next across a word."""
    gl, _ = face.shape(chars(word))
    cov, base, layers = face.render(gl, size, split=True)
    h = 0.52 if word[0].islower() else 0.712
    y0, y1 = int(round(base - 0.7 * h * size)), int(round(base - 0.3 * h * size))
    col = cov[y0:y1 + 1].mean(axis=0)
    own = np.stack([lay[y0:y1 + 1].mean(axis=0) for lay in layers])
    dark = col > 0.5 * col.max()
    runs, i = [], 0
    while i < len(dark):
        if dark[i]:
            j = i
            while j < len(dark) and dark[j]:
                j += 1
            runs.append((i, j, int(own[:, i:j].sum(axis=1).argmax())))
            i = j
        else:
            i += 1
    return [(float(np.sum(1 - col[a1:b0])), ga != gb) for (a0, a1, ga), (b0, b1, gb) in zip(runs, runs[1:])]


def rhythm(face, size):
    """(cv of every stem-to-stem white, cv of the whites between letters, mean between / mean within)"""
    ws = [w for word in WORDS for w in stem_whites(face, word, size)]
    allw = [w for w, _ in ws]
    btw = [w for w, b in ws if b]
    inn = [w for w, b in ws if not b]
    return st.pstdev(allw) / st.mean(allw), st.pstdev(btw) / st.mean(btw), st.mean(btw) / st.mean(inn)


DEPTH = {"l": 0.080, "u": 0.105}


def pair_white(face, pair, size):
    items = chars(pair)
    gl, _ = face.shape(items)
    if len(gl) != 2:
        return None
    _, base, (la, lb) = face.render(gl, size, split=True)
    ink_a, ink_b = la > 0.5, lb > 0.5
    rows = [y for y in range(la.shape[0]) if ink_a[y].any() and ink_b[y].any()]
    if not rows:
        return None

    def edge(layer, y, right):
        r = layer[y]
        idx = np.where(r > 0.5)[0]
        if right:                     # subpixel: the last dark column plus its coverage beyond
            i = idx[-1]
            return i + 0.5 + (r[i + 1] if i + 1 < len(r) else 0)
        i = idx[0]
        return i + 0.5 - (r[i - 1] if i > 0 else 0)
    ra = {y: edge(la, y, True) for y in rows}
    lb_ = {y: edge(lb, y, False) for y in rows}
    ca, cb = (DEPTH["u" if c.isupper() else "l"] * size for c in (pair[0], pair[-1]))
    za = max(ra.values())
    zb = min(lb_.values())
    return float(np.mean([min(lb_[y], zb + cb) - max(ra[y], za - ca) for y in rows]))


def pair_rel(face, size):
    ctl = {"l": pair_white(face, "nn", size), "u": pair_white(face, "HH", size)}
    out = {}
    for p in KERN_HEAVY:
        w = pair_white(face, p, size)
        c = ctl["u" if p[0].isupper() and p[-1].isupper() else "l"]
        if w is not None:
            out[p] = w / c
    return out


def numbers(path):
    res = {}
    for w in WEIGHTS:
        f = Face(path, w)
        for s in SIZES:
            res[(w, s)] = dict(rhythm=rhythm(f, s), pairs=pair_rel(f, s))
    rows = []
    for s in SIZES:
        reg = res[(400, s)]["pairs"]
        for w in WEIGHTS:
            p = res[(w, s)]["pairs"]
            common = [k for k in p if k in reg]
            r = res[(w, s)]["rhythm"]
            rows.append(dict(size=s, weight=w, rhythm=r[0], between=r[1], ratio=r[2], pair_spread=st.pstdev(p.values()),
                             drift=st.mean(abs(p[k] - reg[k]) for k in common), pairs=p))
    return rows, res


def print_numbers(paths):
    allrows = {}
    for label, path in paths:
        rows, res = numbers(path)
        allrows[label] = rows
    print("size weight  " + "".join(f"{label:>48s}" for label, _ in paths))
    print("             " + "".join(f"{'stems cv  between cv  btw/in  pairs sd  drift':>48s}" for _ in paths))
    for i, r in enumerate(allrows[paths[0][0]]):
        line = f"{r['size']:4d} {r['weight']:5d}  "
        for label, _ in paths:
            q = allrows[label][i]
            line += f"   {q['rhythm']:8.4f} {q['between']:10.4f} {q['ratio']:7.3f} {q['pair_spread']:9.4f} {q['drift']:6.4f}"
        print(line)
    return allrows


# ------------------------------------------------------------------------------------------------------- sheets
def line_image(face, text, size, width=None):
    gl, adv = face.shape(chars(text))
    cov, base, _ = face.render(gl, size, pad=12)
    im = Image.fromarray((255 - cov * 255).astype(np.uint8))
    return im


def stack(rows, path, label_w=210, gap=10):
    """rows: [(label, PIL image or None)] -> one sheet."""
    lab = ImageFont.truetype(HELV, 15)
    W = label_w + max(im.width for _, im in rows if im is not None) + 20
    H = sum((im.height if im is not None else 26) + gap for _, im in rows) + 20
    sheet = Image.new("L", (W, H), 255)
    d = ImageDraw.Draw(sheet)
    y = 10
    for label, im in rows:
        if im is None:
            d.text((10, y + 4), label, font=ImageFont.truetype(HELV, 18), fill=0)
            y += 26 + gap
            continue
        d.text((10, y + im.height // 2 - 8), label, font=lab, fill=90)
        sheet.paste(im, (label_w, y))
        y += im.height + gap
    sheet.save(path)


TEXT = ["Hamburgefonstiv minimum illumination hnhnh nonon HHOHH",
        "The quick brown fox jumps over the lazy dog. Sphinx of black quartz,",
        "judge my vow. AVATAR Typography: Wavy LT Yoke, “quoted” (fig) 1071"]
KERN_SAMPLE = "AVATAR To Ty Wa r. f) LT P, y. v, 'A \"quoted\" (fig) 1071 gj g.ss02+j"


def sheets(before, after, out):
    os.makedirs(out, exist_ok=True)
    for name, texts, sizes in (("text", TEXT, (16, 32, 64)), ("kern-heavy", [KERN_SAMPLE], (16, 40, 96))):
        rows = []
        for w in WEIGHTS:
            fb, fa = Face(before, w), Face(after, w)
            rows.append((f"wght {w}", None))
            for s in sizes:
                for t in texts:
                    rows.append((f"{w} {s}px before", line_image(fb, t, s)))
                    rows.append((f"{w} {s}px after", line_image(fa, t, s)))
        stack(rows, os.path.join(out, f"{name}.png"))


def worst_sheet(before, after, pairs, out, size=96):
    """pairs: [(weight, glyph a item, glyph b item, label)]: each pair before over after at its weight, with nn."""
    rows = []
    cache = {}
    for w, a, b, label in [p for p in pairs if p]:
        for tag, path in (("before", before), ("after", after)):
            key = (path, w)
            if key not in cache:
                cache[key] = Face(path, w)
            f = cache[key]
            gl, _ = f.shape([("n", None), ("n", None)] + [a, b] + [("n", None), ("n", None)]) if a[0].islower() or b[0].islower() \
                else f.shape([("H", None), ("H", None)] + [a, b] + [("H", None), ("H", None)])
            cov, base, _ = f.render(gl, size, pad=12)
            rows.append((f"{label} {w} {tag}", Image.fromarray((255 - cov * 255).astype(np.uint8))))
    stack(rows, out, label_w=330)


def worst(before, after, out, n=20):
    """The 20 pairs that stand furthest under the floor in the before font (audit_kern, any weight), and the 20 whose
    white departs furthest from the Regular's (as a share of nn) before; each before over after."""
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "..", "..", "typefaces", "area-serif"))
    import audit_kern as AK
    res, fl, _, _ = AK.audit(before, (300, 400, 700))
    _, it = AK.pair_set(AK.TTFont(before))
    by = {}
    for w, rows in res.items():
        for gap, a, b, k in rows:
            d = gap - fl[w]
            if (a, b) not in by or d < by[(a, b)][0]:
                by[(a, b)] = (d, w)
    top = sorted(by.items(), key=lambda kv: kv[1][0])[:n]
    worst_sheet(before, after, [(w, it[a], it[b], f"{a} {b} ({d:+.0f} on the floor)") for (a, b), (d, w) in top],
                os.path.join(out, "worst-collisions.png"), size=72)
    rows_b, _ = numbers(before)
    dev = []
    for r in rows_b:
        if r["size"] != 64 or r["weight"] == 400:
            continue
        reg = next(q for q in rows_b if q["size"] == 64 and q["weight"] == 400)["pairs"]
        dev += [(abs(v - reg[p]), r["weight"], p) for p, v in r["pairs"].items() if p in reg]
    dev = sorted(dev, reverse=True)[:n]
    worst_sheet(before, after, [(w, *chars(p), f"{p} ({d:.2f} nn off the Regular)") if len(chars(p)) == 2 else None
                                for d, w, p in dev if len(chars(p)) == 2], os.path.join(out, "worst-rhythm.png"), size=72)


if __name__ == "__main__":
    if sys.argv[1] == "numbers":
        paths = [("after", sys.argv[2])] + ([("before", sys.argv[3])] if len(sys.argv) > 3 else [])
        rows = print_numbers(paths)
        if len(sys.argv) > 4:
            json.dump(rows, open(sys.argv[4], "w"), indent=1)
    elif sys.argv[1] == "sheets":
        sheets(sys.argv[2], sys.argv[3], sys.argv[4])
        worst(sys.argv[2], sys.argv[3], sys.argv[4])
