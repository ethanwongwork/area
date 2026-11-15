"""Independent verification of a build (0.74): second methods for what the audits read, and consistency sweeps over
every glyph. It asserts nothing by itself; it prints tables to be read, and a list of what stands out.

  accents     an accent's centre from its anchor and from its ink; one distance per mark and case
  parts       upright stems, level bars and flat-cut tips of every glyph, as a histogram by class
  heights     every glyph's lowest and highest point against the face's lines
  sides       symmetric glyphs' two bearings, mirrored pairs, tabular advances, composites' advances
  outlines    whole units, duplicate and near-duplicate nodes, tiny contours, open contours, winding
  tables      cmap against charset.COVERAGE, names, GDEF classes, features firing (HarfBuzz), vertical metrics

Usage: python verify.py [section ...]"""
import collections
import math
import os
import statistics as st
import sys

import ufoLib2
import uharfbuzz as hb

import evlib as E

sys.path.insert(0, E.AREA_DIR)
import charset as C          # noqa: E402

LINES = {0: "baseline", 520: "x-height", 530: "x overshoot", 712: "cap height", 721: "cap overshoot",
         780: "ascender", -224: "descender", -10: "lowercase undershoot", -9: "capital undershoot"}
SYM = ("dieresiscomb", "macroncomb", "circumflexcomb", "caroncomb", "brevecomb", "ringcomb", "dotaccentcomb",
       "tildecomb", "dotbelowcomb")


def ufo():
    return ufoLib2.Font.open(E.AREA_UFO)


def coverage_names(font):
    want = set(C.COVERAGE)
    return [g.name for g in font if any(u in want for u in g.unicodes)]


def root(font, g):
    base = g.components[0].baseGlyph
    while not font[base].contours and font[base].components:
        base = font[base].components[0].baseGlyph
    return base


def comp_bounds(font, comp):
    t = comp.transformation
    b = C.bounds(C.gp(font, comp.baseGlyph))
    return (b[0] + t[4], b[1] + t[5], b[2] + t[4], b[3] + t[5])


def accents(font):
    print("\n== accents: centre from the anchor against centre from the ink (letters the font promises)")
    names = set(coverage_names(font))
    worst, n = [], 0
    gaps = collections.defaultdict(lambda: collections.defaultdict(list))
    for g in font:
        if g.name not in names or len(g.components) < 2:
            continue
        base = root(font, g)
        bg = font[base]
        comp = g.components[1]
        mk = font[comp.baseGlyph]
        ma = {a.name: a for a in mk.anchors}
        side = "top" if "_top" in ma else "bottom" if "_bottom" in ma else None
        if side is None:
            continue
        ba = next((a for a in bg.anchors if a.name == side), None)
        mb = comp_bounds(font, comp)
        bb = C.bounds(C.gp(font, base))
        b0 = g.components[0].transformation[4]
        zone = 712 if (base[0].isupper() or mb[1] > 700) and side == "top" else 520
        if side == "top":
            asc = bb[3] > 600 and not base[0].isupper()
            cls = "capital" if base[0].isupper() else "ascender" if asc else "x-height"
            gaps[comp.baseGlyph][cls].append((round(mb[1] - (712 if cls == "capital" else 780 if cls == "ascender" else 520)), g.name))
        if ba is not None and comp.baseGlyph.replace(".case", "") in SYM and g.components[0].baseGlyph == base:
            ink = (mb[0] + mb[2]) / 2 - ((bb[0] + bb[2]) / 2 + b0)
            mk_b = C.bounds(C.gp(font, comp.baseGlyph))
            anch = ba.x + ((mk_b[0] + mk_b[2]) / 2 - ma["_" + side].x) - (bb[0] + bb[2]) / 2
            n += 1
            worst.append((abs(ink - anch), g.name, round(ink, 1), round(anch, 1)))
    worst.sort(reverse=True)
    print(f"  {n} letters with a symmetric mark; anchor and ink disagree by more than 1.5 on {sum(1 for w in worst if w[0] > 1.5)}:",
          [(w[1], w[2], w[3]) for w in worst if w[0] > 1.5][:20])
    print("  distance of each mark's lowest ink over the letter's line, by class of letter (value: how many letters):")
    for mkname in sorted(gaps):
        row = []
        for cls in ("x-height", "ascender", "capital"):
            vals = collections.Counter(v for v, _ in gaps[mkname][cls])
            if vals:
                row.append(f"{cls} {dict(sorted(vals.items()))}")
        print(f"    {mkname:24}", "; ".join(row))
    return gaps


def parts(font):
    from test_strokes import bars, stems
    print("\n== parts: upright stems and level bars of every promised glyph with ink (TrueType build)")
    f = E.face("area")
    cm = f.getBestCmap()
    S, B = collections.defaultdict(list), collections.defaultdict(list)
    for cp in C.COVERAGE:
        if cp not in cm:
            continue
        sh = E.Shape(f, name=cm[cp])
        if sh.empty:
            continue
        ch = chr(cp)
        import unicodedata
        cat = unicodedata.category(ch)
        cls = "lowercase" if cat == "Ll" else "capital" if cat == "Lu" else "figure" if cat in ("Nd", "No") else "sign"
        for s in stems(sh, sh.y0 + 5, sh.y1 - 5):
            S[cls].append((round(s["w"], 1), ch))
        for b in bars(sh):
            if b["x1"] - b["x0"] >= 60:
                B[cls].append((round(b["t"], 1), ch))
    for label, D in (("stems", S), ("bars", B)):
        for cls in ("lowercase", "capital", "figure", "sign"):
            cnt = collections.Counter(round(v) for v, _ in D[cls])
            print(f"  {label:6} {cls:10}", dict(sorted(cnt.items())))
            for val in sorted(cnt):
                who = sorted({c for v, c in D[cls] if round(v) == val})
                if cnt[val] <= 12 or len(who) <= 14:
                    print(f"      {val}: {''.join(who)}")
    return S, B


def heights(font):
    print("\n== heights: lowest and highest ink of every promised glyph (UFO), against the lines")
    names = coverage_names(font)
    lo, hi = collections.defaultdict(list), collections.defaultdict(list)
    for n in names:
        g = font[n]
        if not (g.contours or g.components):
            continue
        b = C.bounds(C.gp(font, n))
        if b[2] - b[0] <= 0:
            continue
        lo[round(b[1])].append(n)
        hi[round(b[3])].append(n)
    for label, D in (("lowest", lo), ("highest", hi)):
        print(f"  {label}:")
        for y in sorted(D):
            who = D[y]
            tag = LINES.get(y, "")
            print(f"    {y:6} {len(who):4}  {tag:22} {' '.join(who[:10])}{' ...' if len(who) > 10 else ''}")


def sides(font):
    print("\n== sides and advances")
    names = coverage_names(font)
    sym = ["H", "I", "O", "o", "T", "U", "V", "W", "X", "Y", "v", "w", "x", "A", "M", "zero", "eight", "period", "colon", "hyphen",
           "endash", "emdash", "underscore", "bar", "plus", "minus", "equal", "multiply", "divide", "bullet", "periodcentered",
           "degree", "asterisk", "quotesingle", "quotedbl", "ellipsis", "uni25CF", "uni25CB", "uni25A0", "uni25A1", "uni25C6",
           "uni2605", "uni2606", "uni25B2", "uni25BC", "uni22EF", "uni22EE", "lozenge", "increment", "infinity"]
    rows = []
    for n in sym:
        if n in font:
            b = C.bounds(C.gp(font, n))
            rows.append((n, round(b[0]), round(font[n].width - b[2])))
    print("  glyphs symmetric in shape, left / right bearing (differing by more than 1):",
          [(n, l, r) for n, l, r in rows if abs(l - r) > 1])
    for a, b in C.MIRRORS + [(0x2018, 0x2019), (0x201C, 0x201D), ("uni25B6", "uni25C0"), ("uni25B8", "uni25C2"), ("uni21E5", "uni21E4"),
                             ("arrowright", "arrowleft"), ("uni232B", "uni2326"), ("slash", "backslash")]:
        a, b = C._name(font, a), C._name(font, b)
        ba, bb = C.bounds(C.gp(font, a)), C.bounds(C.gp(font, b))
        la, ra, lb, rb = ba[0], font[a].width - ba[2], bb[0], font[b].width - bb[2]
        ok = abs(la - rb) <= 1 and abs(ra - lb) <= 1 and font[a].width == font[b].width
        print(f"  pair {a} / {b}: bearings {la:.0f},{ra:.0f} / {lb:.0f},{rb:.0f}, advances {font[a].width},{font[b].width} {'' if ok else '<-- not mirrored'}")
    tf = {n: font[n].width for n in font.keys() if n.endswith(".tf")}
    print("  tabular figures' advances:", set(tf.values()), "; maths:", {n: font[n].width for n in C.MATH if n in font})
    print("  proportional figures:", {n: font[n].width for n in C.FIGS})
    print("  spaces:", {n: font[n].width for n in list(C.SPACES) + ["space"] if n in font})
    # composites: advance against the base's
    odd = []
    for n in names:
        g = font[n]
        if len(g.components) >= 2 and not g.contours:
            base = g.components[0].baseGlyph
            if font[base].width != g.width and font[base].width > 0:
                odd.append((n, base, font[base].width, g.width))
    print(f"  composites whose advance is not their first part's ({len(odd)}):", odd)
    # components that point nowhere, or nest
    missing = [(g.name, c.baseGlyph) for g in font for c in g.components if c.baseGlyph not in font]
    scaled = [(g.name, c.baseGlyph) for g in font for c in g.components if tuple(c.transformation[:4]) != (1, 0, 0, 1)]
    print("  components that point to no glyph:", missing, "; scaled or turned components:", scaled[:10], len(scaled))


def outlines(font):
    print("\n== outlines (UFO, every glyph)")
    frac = dup = near = tiny = small = 0
    lists = collections.defaultdict(list)
    for g in font:
        for ci, c in enumerate(g.contours):
            P = c.points
            if any(p.x != round(p.x) or p.y != round(p.y) for p in P):
                frac += 1
                lists["fractional"].append(g.name)
            on = [p for p in P if p.type]
            if len(on) < 3 and not any(p.type is None for p in P):
                lists["under three points"].append(g.name)
            if P and P[0].type == "move":
                lists["open contour"].append(g.name)
            for i, p in enumerate(on):
                q = on[(i + 1) % len(on)]
                d = math.hypot(p.x - q.x, p.y - q.y)
                if d == 0 and len(on) > 1:
                    dup += 1
                    lists["duplicate node"].append(g.name)
                elif d < 2:
                    near += 1
                    lists["nodes under 2 apart"].append(g.name)
            # zero-length handles
            n = len(P)
            for i, p in enumerate(P):
                if p.type is None:
                    owner = P[i - 1] if P[i - 1].type else P[(i + 1) % n]
                    if owner.type and (owner.x, owner.y) == (p.x, p.y):
                        lists["handle on its node"].append(g.name)
            area = abs(sum(P[i].x * P[(i + 1) % n].y - P[(i + 1) % n].x * P[i].y for i in range(n))) / 2
            if area < 60:
                tiny += 1
                lists["contour under 60 square units"].append(g.name)
            elif area < 400:
                small += 1
                lists["contour under 400 square units"].append(g.name)
    for k, v in lists.items():
        c = collections.Counter(v)
        print(f"  {k}: {len(v)} in {len(c)} glyphs:", " ".join(f"{n}" + (f"x{k2}" if k2 > 1 else "") for n, k2 in list(c.items())[:40]))
    if not lists:
        print("  nothing")
    # winding and overlaps on the TrueType build: outer contours clockwise, total area positive
    f = E.face("area")
    gs = f.getGlyphSet()
    wrong = []
    for name in f.getGlyphOrder():
        cs, _ = E.segs(f, name=name)
        if not cs:
            continue
        polys = E.flatten(cs, 2.0)
        areas = [E.area(p) for p in polys]
        if sum(areas) > 0:                              # TrueType: outer contours clockwise (negative area here)
            wrong.append(name)
    print("  TrueType build, glyphs whose winding is not outer-clockwise:", wrong[:20], len(wrong))


def tables(font):
    from fontTools.ttLib import TTFont
    print("\n== tables (TrueType build)")
    f = TTFont(E.AREA_TTF)
    cm = f.getBestCmap()
    miss = [f"U+{c:04X}" for c in C.COVERAGE if c not in cm]
    print(f"  cmap: {len(cm)} characters; promised and missing: {miss}")
    order = f.getGlyphOrder()
    print(f"  glyphs: {len(order)}; names unique: {len(set(order)) == len(order)}")
    uf = {g.name for g in font}
    print("  UFO glyphs not in the build:", sorted(uf - set(order))[:10], "; build glyphs not in the UFO:", sorted(set(order) - uf)[:10])
    gdef = f["GDEF"].table
    cd = gdef.GlyphClassDef.classDefs if gdef.GlyphClassDef else {}
    cnt = collections.Counter(cd.values())
    print(f"  GDEF classes: base {cnt.get(1, 0)}, ligature {cnt.get(2, 0)}, mark {cnt.get(3, 0)}, unclassed {len(order) - len(cd)}")
    marks_zero = [n for n in order if cd.get(n) == 3 and f['hmtx'][n][0] != 0]
    print("  marks with an advance:", marks_zero[:12])
    new = ["onefifth", "uni20A6", "uni20BF", "uni22EE", "uni2303", "uni25B2", "uni2605", "hookabovecomb", "horncomb", "kgreenlandic"]
    print("  classes of some newer glyphs:", {n: cd.get(n) for n in new if n in order})
    lig = gdef.LigCaretList
    print("  ligature carets:", (len(lig.Coverage.glyphs) if lig and lig.Coverage else 0))
    feats = sorted({fr.FeatureTag for fr in f["GSUB"].table.FeatureList.FeatureRecord})
    print("  GSUB features:", feats)
    print("  GPOS features:", sorted({fr.FeatureTag for fr in f["GPOS"].table.FeatureList.FeatureRecord}))
    hf = hb.Font(hb.Face(hb.Blob.from_file_path(E.AREA_TTF)))

    def shape(text, feats=None):
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(hf, buf, feats or {})
        return [order[i.codepoint] for i in buf.glyph_infos], [(p.x_advance, p.x_offset, p.y_offset) for p in buf.glyph_positions]

    tests = [("1/2 3/5 7/8 1/7", {"frac": True}), ("0123456789", {"tnum": True}), ("0123456789", {}), ("¿H? (H) [H] {H} H-H «H»", {"case": True}),
             ("x2 H1", {"sups": True}), ("H2O", {"sinf": True}), ("fi fl ff ffi ffl fb fh fk fj ft", {}), ("ct st", {"dlig": True}),
             ("1", {"ss01": True}), ("2a 1o", {"ordn": True}), ("ı̇ í ĵ", {}), ("ÁĆÉ", {})]
    for text, fe in tests:
        names, pos = shape(text, fe)
        print(f"    {text!r} {fe or ''} ->", " ".join(names))
    # typed combining sequences against the ready-made letter: where the mark lands
    off = []
    import unicodedata
    for cp in C.COVERAGE:
        ch = chr(cp)
        d = unicodedata.normalize("NFD", ch)
        if len(d) < 2 or cp not in cm or any(ord(x) not in cm for x in d):
            continue
        n1, p1 = shape(ch)
        n2, p2 = shape(d, {"ccmp": False}) if False else shape(d)
        if n2 == n1:
            continue                                   # composed by ccmp: the same glyph
        # the decomposed run: marks placed by GPOS. Compare the ink box with the ready-made letter's
        def box(names_, pos_):
            x = 0
            xs0, ys0, xs1, ys1 = [], [], [], []
            for nm_, (adv, xo, yo) in zip(names_, pos_):
                s = E.Shape(f, name=nm_)
                if not s.empty:
                    xs0.append(s.x0 + x + xo); xs1.append(s.x1 + x + xo); ys0.append(s.y0 + yo); ys1.append(s.y1 + yo)
                x += adv
            return (min(xs0), min(ys0), max(xs1), max(ys1)) if xs0 else None
        b1, b2 = box(n1, p1), box(n2, p2)
        if b1 and b2:
            dmax = max(abs(a - b) for a, b in zip(b1, b2))
            if dmax > 2:
                off.append((round(dmax), ch, n2))
    off.sort(reverse=True)
    print(f"  typed base + combining marks against the ready-made letter (ink box differs by more than 2): {len(off)}")
    print("   ", " ".join(f"{c}({d})" for d, c, _ in off[:60]))
    hh, os2, head = f["hhea"], f["OS/2"], f["head"]
    print(f"  vertical metrics: hhea {hh.ascent} / {hh.descent} / gap {hh.lineGap}; typo {os2.sTypoAscender} / {os2.sTypoDescender} / {os2.sTypoLineGap};"
          f" win {os2.usWinAscent} / {os2.usWinDescent}; head yMax {head.yMax} yMin {head.yMin}; use-typo bit {bool(os2.fsSelection & 128)};"
          f" xHeight {os2.sxHeight} capHeight {os2.sCapHeight}")
    tall = sorted(((E.Shape(f, name=n).y1, n) for n in order if not E.Shape(f, name=n).empty), reverse=True)[:8]
    deep = sorted(((E.Shape(f, name=n).y0, n) for n in order if not E.Shape(f, name=n).empty))[:8]
    print("  tallest:", [(round(y), n) for y, n in tall], "\n  deepest:", [(round(y), n) for y, n in deep])
    over = [n for n in order if not E.Shape(f, name=n).empty and (E.Shape(f, name=n).y1 > hh.ascent or E.Shape(f, name=n).y0 < hh.descent)]
    print(f"  glyphs outside the hhea line box: {len(over)}")
    for rec in f["name"].names:
        if rec.nameID in (1, 2, 3, 4, 5, 6, 13, 16, 17) and rec.platformID == 3:
            print(f"    name {rec.nameID}: {str(rec)[:90]}")


SECTIONS = {"accents": accents, "parts": parts, "heights": heights, "sides": sides, "outlines": outlines, "tables": tables}

if __name__ == "__main__":
    font = ufo()
    for name in (sys.argv[1:] or list(SECTIONS)):
        SECTIONS[name](font)
