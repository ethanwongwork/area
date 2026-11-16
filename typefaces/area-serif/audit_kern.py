"""Collision and near-touch audit along the weight axis (0.81). Usage:  .venv/bin/python audit_kern.py [font] [--list N]

On the variable font (build/AreaSerif[wght].ttf unless named) at 300, 350, 400, 550 and 700: for every pair of a
broad set, the least white between the two glyphs' ink at the pair's kerned distance (HarfBuzz at that weight,
ligatures off, an alternate by its own feature on its own character), read as spacing.open_all reads it: every 10
units from -280 to 1080, the second glyph's left edge the least of three rows.

The floor follows the weight. spacing.MIN_GAP (13) is the Regular's; at another weight it is MIN_GAP times that
weight's control white (fit.py's nn white, measured on the instance) over the Regular's, the rule the masters' own
collision passes use (spacing.master_floor). A pair fails under the floor less TOL: the passes' own tolerance (they
open a pair short by 4 or more) and the TrueType conversion's unit, so a pass that did its job never fails here.

The set: every letter with every letter; letters with punctuation both ways; figures with figures and with . , : - /;
every alternate with every letter and punctuation mark both ways; every accented capital beside the ascender letters
(b d f h k l t i j and their accented forms), the capitals and the quotes, both ways; the descender letters with each
other (g j, g.ss02 j, y j, q j, p j and their accented forms); f before ) ] } ? ! * and every quote, and before every
i and j (the dots, ligatures off)."""
import os
import sys
import unicodedata

import numpy as np
import uharfbuzz as hb
from fontTools.pens.basePen import BasePen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import spacing as SP  # noqa: E402

WEIGHTS = tuple(int(w) for w in os.environ.get("AREA_KERN_WEIGHTS", "300,350,400,550,700").split(","))   # 0.81
TOL = 5                      # the collision passes open a pair short by 4 or more, read on the UFO's cubics; the
#                              TrueType build's quadratics stand up to 1 unit off them
YS = list(range(-280, 1081, SP.STEP))
PUNCT = ".,:;!?-–—'\"‘’“”‚„()[]{}/*&…"
FIG = "0123456789"
ASCENDERS = "bdfhkltij"
DESC = "gjpqy"
AFTER_F = ")]}?!*'\"‘’“”"
NO = {0x2044, 0x2215}


class Flat(BasePen):
    def __init__(self, gs):
        super().__init__(gs)
        self.cs = []

    def _moveTo(self, p):
        self.cs.append([p])

    def _lineTo(self, p):
        self.cs[-1].append(p)

    def _curveToOne(self, a, b, c):
        p = self.cs[-1][-1]
        for i in range(1, 13):
            t = i / 12
            u = 1 - t
            self.cs[-1].append((u ** 3 * p[0] + 3 * u * u * t * a[0] + 3 * u * t * t * b[0] + t ** 3 * c[0],
                                u ** 3 * p[1] + 3 * u * u * t * a[1] + 3 * u * t * t * b[1] + t ** 3 * c[1]))

    def _qCurveToOne(self, a, c):
        p = self.cs[-1][-1]
        for i in range(1, 13):
            t = i / 12
            u = 1 - t
            self.cs[-1].append((u * u * p[0] + 2 * u * t * a[0] + t * t * c[0], u * u * p[1] + 2 * u * t * a[1] + t * t * c[1]))

    def _closePath(self):
        pass


def edges(cs, y):
    y += 0.37
    xs = []
    for c in cs:
        n = len(c)
        for i in range(n):
            a, b = c[i], c[(i + 1) % n]
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1]):
                xs.append(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]))
    return (min(xs), max(xs)) if xs else None


class Instance:
    def __init__(self, path, w):
        self.tt = TTFont(path)
        self.gs = self.tt.getGlyphSet(location={"wght": w})
        self.hbf = hb.Font(hb.Face(open(path, "rb").read()))
        self.hbf.set_variations({"wght": w})
        self.prof = {}

    def rows(self, name):
        if name not in self.prof:
            p = Flat(self.gs)
            self.gs[name].draw(p)
            cs = [c for c in p.cs if len(c) > 2]
            w = self.gs[name].width
            r = np.full(len(YS), np.inf)
            le = np.full(len(YS), np.inf)
            for i, y in enumerate(YS):
                e = edges(cs, y)
                if e:
                    le[i], r[i] = e[0], w - e[1]
            l3 = np.minimum(le, np.minimum(np.roll(le, 1), np.roll(le, -1)))
            l3[0], l3[-1] = min(le[0], le[1]), min(le[-1], le[-2])
            self.prof[name] = (r, l3, le)
        return self.prof[name]

    def kern(self, a, b):
        """(first glyph's advance change, the two glyph names HarfBuzz set) for two (char, feature) items."""
        buf = hb.Buffer()
        buf.add_str(a[0] + b[0])
        buf.guess_segment_properties()
        feats = {"kern": True, "liga": False, "clig": False, "dlig": False, "calt": False}
        for i, (_, tag) in enumerate((a, b)):
            if tag:
                feats.setdefault(tag, []).append((i, i + 1, 1))
        hb.shape(self.hbf, buf, feats)
        if len(buf.glyph_infos) != 2:
            return None
        names = [self.tt.getGlyphName(g.codepoint) for g in buf.glyph_infos]
        return buf.glyph_positions[0].x_advance - self.gs[names[0]].width + buf.glyph_positions[1].x_offset, names

    def gap(self, a, b):
        k = self.kern(a, b)
        if k is None:
            return None
        k, (na, nb) = k
        ra, _, _ = self.rows(na)
        _, lb, _ = self.rows(nb)
        g = ra + lb
        g = g[np.isfinite(g)]
        return (float(g.min()) + k if len(g) else None), na, nb, k

    def nn(self):
        """fit.py's nn white: the mean over n's rows of the white, each side no deeper than 80 behind the outermost."""
        _, _, le = self.rows("n")
        r, _, _ = self.rows("n")
        zr = np.array([10 <= y <= 510 for y in YS]) & np.isfinite(le)
        both = np.isfinite(le)
        cl = np.minimum(le, le[zr].min() + 80)
        cr = np.minimum(r, r[zr].min() + 80)
        return float(np.mean(cr[both] + cl[both]))


def items(tt):
    """{glyph name: (char, feature)} for every encoded glyph of the set and every alternate a feature reaches."""
    cmap = tt.getBestCmap()
    want = set(__import__("charset").COVERAGE)
    out = {}
    for cp, n in sorted(cmap.items()):
        if cp in want and cp not in NO and n not in out and unicodedata.category(chr(cp)) not in ("Mn", "Mc", "Lm", "Sk", "Zs", "Cc"):
            out[n] = (chr(cp), None)
    rev = {n: c for n, c in out.items()}
    gsub = tt["GSUB"].table
    for fr in gsub.FeatureList.FeatureRecord:
        tag = fr.FeatureTag
        if not (tag.startswith("ss") or tag == "zero"):
            continue
        for li in fr.Feature.LookupListIndex:
            for st in gsub.LookupList.Lookup[li].SubTable:
                m = getattr(st, "mapping", None) or getattr(getattr(st, "ExtSubTable", None), "mapping", None) or {}
                for src, dst in m.items():
                    if src in rev and dst not in out and ".tf" not in dst:
                        out[dst] = (rev[src][0], tag)
    return out


def pair_set(tt):
    it = items(tt)
    by_char = {}
    for n, (c, tag) in it.items():
        if tag is None:
            by_char[c] = n
    base = lambda c: unicodedata.normalize("NFD", c)[0]
    letters = [by_char[c] for c in sorted(by_char) if c.isascii() and c.isalpha()]
    punct = [by_char[c] for c in PUNCT if c in by_char]
    figs = [by_char[c] for c in FIG if c in by_char]
    alts = [n for n, (_, tag) in it.items() if tag]
    acc_caps = [n for n, (c, tag) in it.items() if not tag and unicodedata.category(c) == "Lu" and len(unicodedata.normalize("NFD", c)) > 1]
    asc = [n for n, (c, tag) in it.items() if not tag and base(c) in ASCENDERS and c.isalpha()]
    caps = [by_char[c] for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
    quotes = [by_char[c] for c in "'\"‘’“”" if c in by_char]
    desc = [n for n, (c, tag) in it.items() if base(c) in DESC and c.isalpha()] + [n for n in alts if n.startswith("g.")]
    ij = [n for n, (c, tag) in it.items() if not tag and base(c) in "ij" and c.isalpha()]
    pairs = set()
    add = lambda A, B: pairs.update((a, b) for a in A for b in B)
    add(letters, letters)
    add(letters, punct)
    add(punct, letters)
    add(figs, figs)
    add(figs, [by_char[c] for c in ".,:-/" if c in by_char])
    add([by_char[c] for c in ".,:-/" if c in by_char], figs)
    for A, B in ((alts, letters + punct + alts), (letters + punct, alts)):
        add(A, B)
    add(acc_caps, asc + caps + quotes + acc_caps)
    add(asc + caps + quotes, acc_caps)
    add(desc, desc)
    add([by_char["f"]], [by_char[c] for c in AFTER_F if c in by_char] + ij)
    return sorted(pairs), it


def floors(path, ws=WEIGHTS):
    nn = {w: Instance(path, w).nn() for w in ws}
    return {w: SP.MIN_GAP * nn[w] / nn[400] for w in ws}, nn


def audit(path, ws=WEIGHTS):
    tt = TTFont(path)
    pairs, it = pair_set(tt)
    fl, nn = floors(path, ws)
    res = {}
    for w in ws:
        inst = Instance(path, w)
        rows = []
        for a, b in pairs:
            r = inst.gap(it[a], it[b])
            if r and r[0] is not None:
                rows.append((round(r[0], 1), r[1], r[2], r[3]))
        rows.sort()
        res[w] = rows
    return res, fl, nn, len(pairs)


def main():
    argv = sys.argv[1:]
    if "--list" in argv:
        i = argv.index("--list")
        argv = argv[:i] + argv[i + 2:]
    args = [a for a in argv if not a.startswith("--")]
    path = args[0] if args else os.path.join(HERE, "build", "AreaSerif[wght].ttf")
    n_list = int(sys.argv[sys.argv.index("--list") + 1]) if "--list" in sys.argv else 12
    res, fl, nn, npairs = audit(path)
    bad = 0
    print(f"kerning audit: {npairs} pairs at {', '.join(map(str, WEIGHTS))}; floor = MIN_GAP x nn white over the Regular's, "
          f"fail under floor - {TOL}")
    for w in WEIGHTS:
        rows = res[w]
        under = [r for r in rows if r[0] < fl[w]]
        fail = [r for r in rows if r[0] < fl[w] - TOL]
        bad += len(fail)
        print(f"  {w}: nn {nn[w]:.1f}, floor {fl[w]:.1f}: {len(fail)} fail, {len(under)} under the floor, least "
              f"{rows[0][0]} ({rows[0][1]} {rows[0][2]})")
        for r in fail[:n_list]:
            print(f"      {r[0]:7.1f}  {r[1]} {r[2]}  (kern {r[3]})")
    print("kerning audit:", "pass" if not bad else f"FAIL ({bad})")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
