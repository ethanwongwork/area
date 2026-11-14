"""Spacing beyond the core (build 0.73): punctuation, quotes, brackets, dashes, signs and accented letters, each
against the 62 core characters and against each other, shaped with kerning (HarfBuzz), on every face the same way.

  gap      the narrowest white between the two glyphs: every 10 units of height, each row against the rows one
           step above and below it (so a serif passing a diagonal is seen), kerning included. Under 0 they collide;
           under 13 (spacing.MIN_GAP) they nearly touch.
  optical  the mean white over the rows where both have ink (each side no deeper than 0.3 x-heights behind its
           outermost ink), as a difference from the face's own n n (so a looser or tighter face compares like with
           like). A pair far from where both references set it is too loose or too tight for the face's rhythm.

Usage: python test_fit_ext.py [--list]  -> fit_ext.json"""
import json
import os
import sys
import unicodedata

import uharfbuzz as hb

import evlib as E

STEP = 10
MIN_GAP = 13
PUNCT = ".,:;!?¡¿'\"‘’“”‚„‹›«»()[]{}/\\|-–—_*†‡§@&#%$€£¥+=~°™…·•"
OFF = 25             # an optical gap this far outside both references, in units of Area's 1000


def accented(font):
    """Letters of Latin-1, Latin Extended-A and Vietnamese that decompose to a core letter and marks."""
    out = []
    cm = font.getBestCmap()
    for cp in list(range(0xC0, 0x180)) + list(range(0x1EA0, 0x1EFA)) + [0x1A0, 0x1A1, 0x1AF, 0x1B0, 0x218, 0x219, 0x21A, 0x21B]:
        if cp in cm and unicodedata.category(chr(cp))[0] == "L":
            out.append(chr(cp))
    return "".join(out)


def profile(sh, lo=-280, hi=1080):
    rows = {}
    y = lo
    while y <= hi:
        sp = sh.h(y)
        if sp:
            rows[y] = (sp[0][0], sh.adv - sp[-1][1])
        y += STEP
    return rows


def measure(key, lefts, rights, pairs=None):
    label, path, var, _ = E.FACES[key]
    f = E.face(key)
    m = E.metrics(f)
    k = 1000 / f["head"].unitsPerEm
    hfont = hb.Font(hb.Face(hb.Blob.from_file_path(path)))
    if var:
        hfont.set_variations(var)
    cm = f.getBestCmap()
    chars = sorted(set(lefts) | set(rights) | set("nH"))
    shapes = {c: E.Shape(f, c) for c in chars if ord(c) in cm}
    shapes = {c: s for c, s in shapes.items() if not s.empty}
    prof = {c: profile(s) for c, s in shapes.items()}
    depth = 0.3 * m["xh"]
    lo = {c: (min(v[0] for v in p.values()), min(v[1] for v in p.values())) for c, p in prof.items()}

    def kern(a, b):
        buf = hb.Buffer()
        buf.add_str(a + b)
        buf.guess_segment_properties()
        hb.shape(hfont, buf, {"kern": True, "liga": False, "calt": False})
        if len(buf.glyph_infos) != 2:
            return None
        return (buf.glyph_positions[0].x_advance + buf.glyph_positions[1].x_offset) * k - shapes[a].adv

    def one(a, b):
        kn = kern(a, b)
        if kn is None:
            return None
        pa, pb = prof[a], prof[b]
        gap, opt = None, []
        for y, va in pa.items():
            for yb in (y - STEP, y, y + STEP):
                vb = pb.get(yb)
                if vb:
                    d = va[1] + vb[0] + kn
                    gap = d if gap is None else min(gap, d)
            vb = pb.get(y)
            if vb:
                opt.append(min(va[1], lo[a][1] + depth) + min(vb[0], lo[b][0] + depth) + kn)
        return [None if gap is None else round(gap, 1), round(sum(opt) / len(opt), 1) if opt else None, round(kn, 1)]

    nn = one("n", "n")[1]
    out = {}
    todo = pairs if pairs is not None else [(a, b) for a in lefts for b in rights]
    for a, b in todo:
        if a in shapes and b in shapes:
            r = one(a, b)
            if r:
                out[a + b] = r
    scale = 520 / m["xh"]
    return {"nn": nn, "scale": scale, "pairs": out}


def sets(font):
    acc = accented(font)
    return [("core + punctuation", E.CORE, PUNCT), ("punctuation + core", PUNCT, E.CORE), ("punctuation + punctuation", PUNCT, PUNCT),
            ("core + accented", E.CORE, acc), ("accented + core", acc, E.CORE), ("accented + punctuation", acc, PUNCT),
            ("punctuation + accented", PUNCT, acc)]


def main():
    os.makedirs(E.OUT, exist_ok=True)
    area = E.face("area")
    S = sets(area)
    res = {}
    for key in ("area", "georgia", "serrif"):
        res[key] = {}
        for name, L, R in S:
            res[key][name] = measure(key, L, R)
        print(E.FACES[key][0], {n: len(v["pairs"]) for n, v in res[key].items()})
    json.dump(res, open(os.path.join(E.OUT, "fit_ext.json"), "w"))
    report(res, "--list" in sys.argv)


def report(res, full=False):
    A = res["area"]
    print(f"\n{'set':28}{'pairs':>7}{'collide':>9}{'under 13':>10}{'loose':>7}{'tight':>7}   Georgia Pro / Serrif collide, under 13")
    tot = [0, 0, 0, 0, 0]
    worst = []
    for name, v in A.items():
        col = [(p, r) for p, r in v["pairs"].items() if r[0] is not None and r[0] < 0]
        near = [(p, r) for p, r in v["pairs"].items() if r[0] is not None and 0 <= r[0] < MIN_GAP]
        loose, tight = [], []
        for p, r in v["pairs"].items():
            if r[1] is None:
                continue
            a = r[1] - v["nn"]
            refs = []
            for k in ("georgia", "serrif"):
                q = res[k][name]["pairs"].get(p)
                if q and q[1] is not None:
                    refs.append((q[1] - res[k][name]["nn"]) * res[k][name]["scale"])
            if len(refs) == 2:
                if a > max(refs) + OFF:
                    loose.append((round(a - max(refs)), p))
                elif a < min(refs) - OFF:
                    tight.append((round(min(refs) - a), p))
        ref = []
        for k in ("georgia", "serrif"):
            pv = res[k][name]["pairs"]
            sc = res[k][name]["scale"]
            ref.append(f"{sum(1 for r in pv.values() if r[0] is not None and r[0] < 0)}, {sum(1 for r in pv.values() if r[0] is not None and 0 <= r[0] * sc < MIN_GAP)}")
        print(f"{name:28}{len(v['pairs']):7}{len(col):9}{len(near):10}{len(loose):7}{len(tight):7}   {' / '.join(ref)}")
        for i, n in enumerate((len(v["pairs"]), len(col), len(near), len(loose), len(tight))):
            tot[i] += n
        worst.append((name, sorted(col, key=lambda t: t[1][0])[:40], sorted(near, key=lambda t: t[1][0])[:30],
                      sorted(loose, reverse=True)[:30], sorted(tight, reverse=True)[:30]))
    print(f"{'all':28}{tot[0]:7}{tot[1]:9}{tot[2]:10}{tot[3]:7}{tot[4]:7}")
    if full:
        for name, col, near, loose, tight in worst:
            print(f"\n{name}")
            print("  collide:", " ".join(f"{p}({r[0]:.0f})" for p, r in col))
            print("  under 13:", " ".join(f"{p}({r[0]:.0f})" for p, r in near))
            print("  loose:", " ".join(f"{p}(+{d})" for d, p in loose))
            print("  tight:", " ".join(f"{p}(-{d})" for d, p in tight))


if __name__ == "__main__":
    main()
