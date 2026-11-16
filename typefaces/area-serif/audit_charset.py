"""The character set's audit (0.71): the rules charset.py holds beyond a-z, A-Z and 0-9, re-measured on the built
UFO. Fails QA when one drifts. Every check here fails on build 0.70.

  ampersand      its arm is a stroke, not a wedge (derive.BRACKET_MAX_TURN): ink no more than AMP_INK
  marks          a symmetric mark's ink centre sits where charset.MARK_X puts it over its base, and every capital
                 carries its marks at one height
  capital marks  the capital ring is the lowercase ring; circumflex and caron stand at one height
  plain strokes  plus, plus-minus, not, bar, broken bar, underscore and slash are one thickness (the minus's)
  letter signs   dollar, cent and yen carry the finished S, c and Y
  mirrors        a right-hand bracket is its left-hand one turned over, point for point
  Vietnamese     a grave beside a circumflex stands as close as an acute does

Usage: python audit_charset.py [UFO]"""
import math
import os
import sys

import ufoLib2

import charset as C

HERE = os.path.dirname(os.path.abspath(__file__))
AMP_INK = 3.0             # ampersand: ink area / (H stem x height). 3.27 with the wedge (0.70), 2.81 without
SYMMETRIC = ("dieresiscomb", "macroncomb", "circumflexcomb", "caroncomb", "brevecomb", "ringcomb", "dotaccentcomb",
             "tildecomb", "dotbelowcomb")


def on_points(font, name):
    pts = []
    for verb, P in C.gp(font, name).segments:
        if P:
            pts.append((round(P[-1][0]), round(P[-1][1])))
    return pts


def flat(path, n=8):
    out, cur = [], None
    for verb, P in path.segments:
        if verb in ("moveTo", "lineTo"):
            cur = P[0]
            out.append(cur)
        elif verb == "curveTo":
            a = cur
            b, c, d = P
            for k in range(1, n + 1):
                t = k / n
                u = 1 - t
                out.append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
                            u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]))
            cur = d
        elif verb == "qCurveTo":
            out.extend(P)
            cur = P[-1]
    return out


def comp_path(font, comp):
    t = comp.transformation
    return C.moved(C.gp(font, comp.baseGlyph), t[4], t[5])


def root(font, g):
    base = g.components[0].baseGlyph
    while not font[base].contours and font[base].components:
        base = font[base].components[0].baseGlyph
    return base


def audit_074(font, bad, notes):
    """0.74: what the verification pass on 0.73 found (docs/research/serif-evaluation-2026-11-13/tools/verify.py)."""
    import version
    m = C.M(font)
    # a capital's first mark stands on CAP_MARK_Y by its own anchor
    off = []
    for g in font:
        if len(g.components) < 2:
            continue
        base = root(font, g)
        if not (len(base) == 1 and base.isupper()):
            continue
        tops = [c for c in g.components[1:] if any(a.name == "_top" for a in font[c.baseGlyph].anchors)]
        if tops:
            ma = next(a for a in font[tops[0].baseGlyph].anchors if a.name == "_top")
            want = C.CAP_MARK_Y + (C.MARK_DROP if tops[0].baseGlyph in C.DROP_MARKS else 0)   # a lowercase form's anchor
            d = ma.y + tops[0].transformation[5] - want
            if d and abs(d) <= 16:
                off.append(f"{g.name} ({d:+d})")
    if off:
        bad.append(f"{len(off)} capitals carry their accent off the line {C.CAP_MARK_Y}: " + " ".join(off[:14]))
    # a level bar is one thickness along its whole length (euro, sterling)
    for cp in C.SIGN_BAR:
        g = next(g for g in font if cp in g.unicodes)
        p = C.gp(font, g.name)
        b = C.bounds(p)
        seen = set()
        for x in range(int(b[0]) + 6, int(b[2]) - 5, 6):
            for s in C.scan_v(p, x):
                if 40 <= s[1] - s[0] <= 70 and 0.3 * (b[3] - b[1]) < (s[0] + s[1]) / 2 - b[1] < 0.75 * (b[3] - b[1]):
                    seen.add(round(s[1] - s[0]))
        level = {t for t in seen if abs(t - m.cap_bar) > 1.5 and t >= 55}
        if level:
            bad.append(f"{g.name}: its bar is {sorted(level)} thick in places, {m.cap_bar:.0f} elsewhere")
    # dots are circles; glyphs made of one dot carry it
    def dots(name):
        return [c for c in font[name].contours if C._is_dot(c)]
    def box(c):
        xs, ys = [p.x for p in c.points], [p.y for p in c.points]
        return max(xs) - min(xs), max(ys) - min(ys)
    def rel(c):
        x0, y0 = min(p.x for p in c.points), min(p.y for p in c.points)
        return sorted((p.x - x0, p.y - y0) for p in c.points)
    oval = [f"{n} {box(c)[0]}x{box(c)[1]}" for n in list(C.DOT_GLYPHS) + ["colon", "semicolon", "ellipsis", "exclamdown", "questiondown"]
            if n in font for c in dots(n) if box(c)[0] != box(c)[1]]
    if oval:
        bad.append(f"{len(oval)} dots are not circles: " + " ".join(oval[:10]))
    per = rel(dots("period")[0])
    for n in ("colon", "semicolon", "ellipsis"):
        if any(rel(c) != per for c in dots(n)):
            bad.append(f"{n}: its dot is not the period's")
    for n in ("dieresiscomb", "divide"):
        ds = dots(n)
        if len({tuple(rel(c)) for c in ds}) != 1:
            bad.append(f"{n}: its dots differ")
    # turned and doubled glyphs
    def onset(name):
        P = [(p.x, p.y) for c in font[name].contours for p in c.points]
        x0, y0 = min(p[0] for p in P), min(p[1] for p in P)
        return sorted((x - x0, y - y0) for x, y in P)
    def turned(name):
        P = [(-p.x, -p.y) for c in font[name].contours for p in c.points]
        x0, y0 = min(p[0] for p in P), min(p[1] for p in P)
        return sorted((x - x0, y - y0) for x, y in P)
    for a, b in (("exclam", "exclamdown"), ("question", "questiondown"), ("quoteright", "quoteleft")):
        if turned(a) != onset(b):
            bad.append(f"{b} is not {a} turned half round")
    for single, double in (("quoteleft", "quotedblleft"), ("quoteright", "quotedblright"), ("quotesinglbase", "quotedblbase"), ("quotesingle", "quotedbl")):
        one = onset(single)
        for c in font[double].contours:
            x0, y0 = min(p.x for p in c.points), min(p.y for p in c.points)
            if sorted((p.x - x0, p.y - y0) for p in c.points) != one and len(font[single].contours) == 1:
                bad.append(f"{double}: a mark of it is not {single}")
                break
    ys = sorted({p.y for c in font["bracketleft"].contours for p in c.points})
    if len(ys) == 4 and ys[1] - ys[0] != ys[3] - ys[2]:
        bad.append(f"bracketleft: arms {ys[3] - ys[2]} and {ys[1] - ys[0]}")
    # macron: one thickness in both cases
    def thick(name):
        ys_ = sorted({p.y for c in font[name].contours for p in c.points})
        return ys_[-1] - ys_[0]
    if thick("macroncomb") != thick("macroncomb.case"):
        bad.append(f"macron {thick('macroncomb')} thick, its capital form {thick('macroncomb.case')}")
    # marks below at one depth
    deep = {"ogonek": set(), "dotbelow": set()}
    for g in font:
        if len(g.components) < 2:
            continue
        for comp in g.components[1:]:
            n = comp.baseGlyph
            kind = "ogonek" if n.startswith("ogonek") else "dotbelow" if n.startswith("dotbelow") and g.components[0].baseGlyph[:1].isupper() else None
            if kind:
                low = round(C.bounds(C.gp(font, n))[1] + comp.transformation[5])
                if abs(low - C.BELOW[kind]) <= 14:
                    deep[kind].add(low)
    for kind, vals in deep.items():
        if vals - {C.BELOW[kind]}:
            bad.append(f"{kind}: reaches {sorted(vals)}, not {C.BELOW[kind]} everywhere")
    # no scrap, in any glyph
    scraps = []
    for g in font:
        for c in g.contours:
            P, n = c.points, len(c.points)
            if abs(sum(P[i].x * P[(i + 1) % n].y - P[(i + 1) % n].x * P[i].y for i in range(n))) / 2 < 150:
                scraps.append(g.name)
    if scraps:
        bad.append(f"contours under 150 square units: {' '.join(sorted(set(scraps))[:12])}")
    # nothing scaled: the tenge's arm is T's, caps lock's level strokes the minus's, the product's stems H's
    def col(name, frac):
        p = C.gp(font, name)
        b = C.bounds(p)
        return [round(s[1] - s[0]) for s in C.scan_v(p, b[0] + frac * (b[2] - b[0]))]
    def row(name, y):
        return [round(s[1] - s[0]) for s in C.scan_h(C.gp(font, name), y)]
    t_arm = max(col("T", 0.25))
    if "uni20B8" in font and sorted(col("uni20B8", 0.25)) != [t_arm, t_arm]:
        bad.append(f"tenge: bars {col('uni20B8', 0.25)} at a quarter of its width, T's arm {t_arm}")
    if "uni21EA" in font and round(m.math) not in col("uni21EA", 0.5)[:1]:
        bad.append(f"caps lock: its bar {col('uni21EA', 0.5)[:1]}, the minus {m.math:.0f}")
    if "product" in font and any(abs(v - m.cap_stem) > 1 for v in row("product", 300)):
        bad.append(f"product: stems {row('product', 300)}, H's {m.cap_stem:.0f}")
    for name, want in (("tbar", m.low_bar), ("dcroat", m.low_bar), ("uni20B2", C.STROKE_UP), ("dollar", C.STROKE_UP)):
        pass
    g2 = [v for v in row("uni20B2", -40)] if "uni20B2" in font else []
    if g2 and g2 != [C.STROKE_UP]:
        bad.append(f"guarani: stroke {g2}, the capital hairline {C.STROKE_UP}")
    # the font's version is the build's
    want_minor = int(version.BUILD.split(".")[1].ljust(3, "0"))
    if (font.info.versionMajor, font.info.versionMinor) != (int(version.BUILD.split(".")[0]), want_minor):
        bad.append(f"font version {font.info.versionMajor}.{font.info.versionMinor:03d}, build {version.BUILD}")
    if C.MARK_DROP != 19 or C.SIGN_STROKE.get(0x00F0) != 83:
        bad.append("MARK_DROP or the eth's stroke is not the re-derived value (19, 83)")


def scraps(font):
    """A vertex left ragged by a union: three straight steps in a row, each under 22 units, that turn one way and
    then the other (0.77: every arrow's point was one). [(glyph, the four nodes)]."""
    import math
    out = []
    for g in font:
        for c in g.contours:
            on = [(p.x, p.y, p.type) for p in c.points if p.type is not None]
            if any(p.type is None for p in c.points) and len(on) < 4:
                continue
            m = len(on)
            for i in range(m):
                a, b, c2, d = on[i], on[(i + 1) % m], on[(i + 2) % m], on[(i + 3) % m]
                if all(q[2] == "line" for q in (b, c2, d)) and max(math.dist(a[:2], b[:2]), math.dist(b[:2], c2[:2]), math.dist(c2[:2], d[:2])) < 22:
                    t1 = (b[0] - a[0]) * (c2[1] - b[1]) - (b[1] - a[1]) * (c2[0] - b[0])
                    t2 = (c2[0] - b[0]) * (d[1] - c2[1]) - (c2[1] - b[1]) * (d[0] - c2[0])
                    if t1 * t2 < 0:
                        out.append((g.name, a[:2], b[:2], c2[:2], d[:2]))
                        break
    return out


def audit(font):
    bad, notes = [], []
    m = C.M(font)

    # ampersand
    p = C.op(C.gp(font, "ampersand"), C.pathops.Path())
    b = C.bounds(p)
    ink = abs(p.area) / (m.cap_stem * (b[3] - b[1]))
    notes.append(f"ampersand ink {ink:.2f} (at most {AMP_INK})")
    if ink > AMP_INK:
        bad.append(f"ampersand: ink {ink:.2f} of stem x height, over {AMP_INK}: its arm is filled")

    # marks: where a symmetric mark's ink sits over its base
    worst = {}
    for g in font:
        if len(g.components) < 2:
            continue
        comp = g.components[1]
        mk = comp.baseGlyph
        if not mk.replace(".case", "") in SYMMETRIC:
            continue
        side = "bottom" if mk.startswith("dotbelow") else "top"
        base = root(font, g)
        base = C.MARK_ALIAS.get(base, base)
        if base not in C.MARK_X[side] or g.components[0].baseGlyph != root(font, g):
            continue
        bb = C.bounds(C.gp(font, base))
        mb = C.bounds(comp_path(font, comp))
        b0 = g.components[0].transformation[4]
        off = (mb[0] + mb[2]) / 2 - ((bb[0] + bb[2]) / 2 + b0) - C.MARK_X[side][base]
        if abs(off) > abs(worst.get((base, side), (0, ""))[0]):
            worst[(base, side)] = (off, g.name)
    for (base, side), (off, name) in sorted(worst.items()):
        if abs(off) > C.MARK_BAND + 2:
            bad.append(f"marks: {name} sits {off:+.0f} from where {base}'s {side} marks belong (band {C.MARK_BAND})")
    notes.append(f"marks: {len(worst)} base sides checked, worst {max((abs(v[0]) for v in worst.values()), default=0):.0f}")
    ys = {g.name: a.y for g in font if len(g.name) == 1 and g.name.isupper() for a in g.anchors
          if a.name == "top" and C.CAP_MARK_Y - 13 <= a.y <= C.CAP_MARK_Y}
    off_y = {k: v for k, v in ys.items() if v != C.CAP_MARK_Y}
    if off_y:
        bad.append(f"marks: capitals carry their marks at different heights: {off_y}")

    # capital marks
    rb, cb = C.bounds(C.gp(font, "ringcomb")), C.bounds(C.gp(font, "ringcomb.case"))
    if abs((rb[2] - rb[0]) - (cb[2] - cb[0])) > 1 or abs((rb[3] - rb[1]) - (cb[3] - cb[1])) > 1:
        bad.append(f"capital ring {cb[2] - cb[0]:.0f} x {cb[3] - cb[1]:.0f}, lowercase {rb[2] - rb[0]:.0f} x {rb[3] - rb[1]:.0f}")

    def gap(name):
        a = next(q for q in font[name].anchors if q.name == "_top")
        return C.bounds(C.gp(font, name))[1] - a.y
    if abs(gap("circumflexcomb.case") - gap("caroncomb.case")) > 1:
        bad.append(f"capital circumflex stands {gap('circumflexcomb.case'):.0f} over its anchor, caron {gap('caroncomb.case'):.0f}")

    # lowercase accents: 90 over the x-height (0.173), and one height for the family
    gaps = {}
    for name in ("aacute", "agrave", "acircumflex", "ecaron", "ohungarumlaut", "eacute", "oacute", "uacute", "nacute"):
        if name in font and len(font[name].components) > 1:
            gaps[name] = C.bounds(comp_path(font, font[name].components[1]))[1] - C.X_HEIGHT
    want = 108 - C.MARK_DROP
    if any(abs(v - want) > 1 for v in gaps.values()):
        bad.append(f"lowercase accents stand {sorted(set(gaps.values()))} over the x-height, not {want}")
    hk = next((g for g in font if 0x1EA3 in g.unicodes), None)
    if hk is not None:
        hb = C.bounds(comp_path(font, hk.components[1]))
        if abs(hb[1] - C.X_HEIGHT - want) > 1:
            bad.append(f"hook above stands {hb[1] - C.X_HEIGHT:.0f} over the x-height, not {want}")
    if C.HOOK[""][2] < 0.74 * 77:
        bad.append(f"hook above: side stroke {C.HOOK[''][2]}, under 0.75 of the acute's 77")

    # signs no heavier than the letters' like parts
    signs = [(next((g for g in font if cp in g.unicodes), None), t) for cp, t in C.SIGN_STROKE.items()]
    signs += [(font[n], t) for n, t in C.SIGN_STROKE_NAMES.items() if n in font]
    for g, target in signs:
        if g is None:
            continue
        polys = C._polys(g)
        worst_t = 0
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i, p in enumerate(P):
                a, b = P[i - 1], P[(i + 1) % n]
                if p.type != "curve" or not p.smooth or a.type is not None or b.type is not None:
                    continue
                tx, ty = b.x - a.x, b.y - a.y
                L = math.hypot(tx, ty)
                if L < 1e-6:
                    continue
                nx, ny = -ty / L, tx / L
                if not C._inside(polys, p.x + nx * 1.5, p.y + ny * 1.5):
                    nx, ny = -nx, -ny
                hit = C._ray(polys, p.x, p.y, nx, ny)
                if hit and hit[1] >= 0.85 and hit[0] < 1.6 * target:
                    worst_t = max(worst_t, hit[0])
        if worst_t > target + 2.5:
            bad.append(f"{g.name}: {worst_t:.0f} across a stroke, over {target}")
    for cp in C.SIGN_BAR:
        g = next((g for g in font if cp in g.unicodes), None)
        ys = sorted({p.y for c in g.contours for i, p in enumerate(c.points)
                     if c.points[(i + 1) % len(c.points)].type == "line" and p.y == c.points[(i + 1) % len(c.points)].y
                     and abs(p.x - c.points[(i + 1) % len(c.points)].x) >= 60})
        thick = [b - a for a, b in zip(ys, ys[1:]) if 40 <= b - a <= 70]
        if any(abs(t - m.cap_bar) > 1.5 for t in thick[:1]):
            bad.append(f"{g.name}: bar {thick[0]:.0f}, H's crossbar {m.cap_bar:.0f}")
    kr = next((g for g in font if 0x138 in g.unicodes), None)
    if kr is not None:
        K, G = on_points(font, "k"), set(on_points(font, kr.name))
        low = [q for q in K if q[1] < C.X_HEIGHT - 160]
        if sum(1 for q in low if q in G) / len(low) < 0.8:
            bad.append("kra is not built on the finished k")

    # plain strokes
    w = m.math

    def boxes(name):
        return [C.bounds(C._contour_path(c)) for c in font[name].contours]
    for name in ("plus", "plusminus", "logicalnot"):
        p = C.gp(font, name)
        b = C.bounds(p)
        # the upright: the narrowest level span; the bar: the narrowest upright span
        cols = [s[1] - s[0] for x in range(int(b[0]) + 12, int(b[2]) - 11, 7) for s in C.scan_v(p, x)]   # clear of
        rows = [s[1] - s[0] for y in range(int(b[1]) + 12, int(b[3]) - 11, 7) for s in C.scan_h(p, y)]   # the round ends
        import collections                      # 0.79: the commonest narrow span (a round end's own rows are narrower)
        common = lambda v: collections.Counter(round(q) for q in v if q < 2 * w).most_common(1)[0][0]   # noqa: E731
        if abs(common(cols) - w) > 0.6 or abs(common(rows) - w) > 0.6:
            bad.append(f"{name}: level stroke {common(cols):.0f}, upright {common(rows):.0f}, the minus {w:.0f}")
    for name in ("bar", "brokenbar"):
        ws = {q[2] - q[0] for q in boxes(name)}
        if any(abs(v - w) > 0.6 for v in ws):
            bad.append(f"{name}: {sorted(ws)} wide, the minus {w:.0f}")
    b = boxes("underscore")[0]
    if abs((b[3] - b[1]) - w) > 0.6:
        bad.append(f"underscore: {b[3] - b[1]:.0f} thick, the minus {w:.0f}")
    frs = [g.name for g in font if g.components and len(g.contours) == 1
           and any(c.baseGlyph.endswith("inferior") for c in g.components)]
    for name in ["slash", "backslash", "fraction", "percent", "perthousand"] + frs:
        for c in font[name].contours:
            cut = C._level_cut(c)
            if not cut:
                continue
            lo, hi = cut
            if name not in ("slash", "backslash") and max(abs(lo[1] - lo[0] - C.FRACTION_BAR), abs(hi[1] - hi[0] - C.FRACTION_BAR)) > 1:
                bad.append(f"{name}: its bar is {hi[1] - hi[0]} / {lo[1] - lo[0]} wide, not {C.FRACTION_BAR}")
            elif abs((lo[1] - lo[0]) - (hi[1] - hi[0])) > 1:
                bad.append(f"{name}: its bar is {hi[1] - hi[0]} wide at the top and {lo[1] - lo[0]} at the foot")
            if name in ("slash", "backslash"):
                bc, tc = (lo[0] + lo[1]) / 2, (hi[0] + hi[1]) / 2
                perp = (lo[1] - lo[0]) * (hi[2] - lo[2]) / math.hypot(tc - bc, hi[2] - lo[2])
                if abs(perp - w) > 1.2:
                    bad.append(f"{name}: {perp:.1f} across, the minus {w:.0f}")

    # 0.79: every plain stroke outside the letters ends on the letters' radius (0.78: 157 glyphs sharp), and the
    # slash and the fraction bars are still found by the checks above
    left = C.sharp_ends(font)
    notes.append(f"plain stroke ends still sharp: {sum(left.values())} on {len(left)} glyphs")
    if left:
        bad.append(f"plain stroke ends with sharp corners (the letters' are rounded on {C.SOFT}): "
                   + " ".join(f"{k} {v}" for k, v in sorted(left.items())[:14]) + (" ..." if len(left) > 14 else ""))
    for name in ("slash", "backslash", "fraction", "percent"):
        if not any(C._level_cut(c) for c in font[name].contours):
            bad.append(f"{name}: its stroke is not read (the checks above skipped it)")
    for name in ("hyphen", "endash", "emdash", "minus", "underscore", "bar", "plus", "equal", "slash"):
        if not any(p.type == "curve" for c in font[name].contours for p in c.points):
            bad.append(f"{name}: no rounded end")

    # letter signs: the letter's own points, moved as one, are the sign's points (but where the stroke covers them)
    for sign, letter in (("cent", "c"), ("yen", "Y")):
        S, G = on_points(font, letter), set(on_points(font, sign))
        best = 0
        for dx in range(-80, 81):
            hit = sum(1 for (x, y) in S if (x + dx, y) in G)
            best = max(best, hit / len(S))
        notes.append(f"{sign}: {best:.0%} of {letter}'s points")
        if best < 0.6:
            bad.append(f"{sign}: only {best:.0%} of {letter}'s points are on it; it is not built on the finished {letter}")

    # 0.72: fractions' figures stand FRAC_GAP from the bar; the new currency signs carry their capitals
    for name in C.fraction_names(font):
        g = font[name]
        gaps = [C.fraction_gap(font, g, comp) for comp in g.components]
        if any(abs(v - C.FRAC_GAP) > 2.5 for v in gaps):
            bad.append(f"{name}: its figures stand {gaps[0]:.0f} and {gaps[1]:.0f} from the bar, not {C.FRAC_GAP}")
    for cp, letter in ((0x20A6, "N"), (0x20B1, "P"), (0x20BF, "B"), (0x20AD, "K"), (0x20AE, "T"), (0x20B2, "G"), (0x20A1, "C")):
        g = next((g for g in font if cp in g.unicodes), None)
        if g is None:
            bad.append(f"U+{cp:04X} is missing")
            continue
        S_, G_ = on_points(font, letter), set(on_points(font, g.name))
        best = max(sum(1 for (x, y) in S_ if (x + dx, y) in G_) / len(S_) for dx in range(-60, 61))
        if best < 0.6:
            bad.append(f"{g.name}: only {best:.0%} of {letter}'s points are on it")
    missing = [f"U+{cp:04X}" for cp in C.COVERAGE if not any(cp in g.unicodes for g in font)]
    if missing:
        bad.append(f"missing from the set: {' '.join(missing[:40])}")

    # 0.73: spacing beyond the core
    import spacing as SP
    close = SP.open_all(font, C.COVERAGE, dry=True)
    notes.append(f"pairs in the whole set closer than {SP.MIN_GAP - 3}: {len(close)}")
    if close:
        bad.append(f"{len(close)} pairs in the set come closer than {SP.MIN_GAP - 3} units, kerning included: "
                   + " ".join(f"{a} {b} ({g})" for a, b, g, _ in sorted(close, key=lambda t: t[2])[:12]))
    drift = SP.family_drift(font)
    if drift:
        bad.append(f"{len(drift)} accented letters are outside their letter's kerning class: "
                   + " ".join(f"{m} ({b})" for m, b, _ in drift[:12]))
    for name in ("IJ", "ij"):
        g = font[name]
        a_, b_ = [c.baseGlyph for c in g.components[:2]]
        want_w = font[a_].width + C._kern(font, a_, b_) + font[b_].width
        if abs(g.width - want_w) > 1:
            bad.append(f"{name}: advance {g.width}, its two letters set side by side {want_w}")
    if "numero" in font:
        nb = C.bounds(C.gp(font, "numero"))
        if nb[2] > font["numero"].width:
            bad.append(f"numero: its ink runs {nb[2] - font['numero'].width:.0f} past its advance")

    # mirrors
    for a, bname in C.MIRRORS:
        a, bname = C._name(font, a), C._name(font, bname)
        if font[a].components:
            continue
        A, B = on_points(font, a), on_points(font, bname)
        ax0, ax1 = min(p[0] for p in A), max(p[0] for p in A)
        bx0 = min(p[0] for p in B)
        M = set((bx0 + (ax1 - x), y) for x, y in A)
        B = set(B)
        if M != B:
            bad.append(f"{bname} is not {a} turned over ({len(M ^ B)} points differ)")

    # Vietnamese: the white between a circumflex and the tone beside it
    for cp, label in ((0x1EA7, "a circumflex grave"), (0x1EA5, "a circumflex acute"), (0x1EA6, "A circumflex grave")):
        g = next((g for g in font if cp in g.unicodes), None)
        if g is None or len(g.components) < 3:
            continue
        P1, P2 = flat(comp_path(font, g.components[1])), flat(comp_path(font, g.components[2]))
        d = min(math.hypot(a[0] - b[0], a[1] - b[1]) for a in P1 for b in P2)
        notes.append(f"{label}: {d:.0f} between the marks")
        if d > 70:
            bad.append(f"{label}: the marks stand {d:.0f} apart (at most 70)")
    audit_074(font, bad, notes)
    # 0.77: no vertex left ragged by a union; f clear of the dot of i and j when ligatures are off; k's foot
    sc = scraps(font)
    notes.append(f"ragged vertices: {len(sc)}")
    bad += [f"{n}: a ragged vertex at {b} {c2} (a union's scrap)" for n, a, b, c2, d in sc]
    import spacing as S_
    for second, want in (("i", S_.F_DOT), ("j", S_.F_DOT), ("idieresis", S_.F_ACCENT), ("icircumflex", S_.F_ACCENT)):
        gap, k = S_.f_gap(font, "f", second)
        notes.append(f"f before {second}, ligatures off: {gap:.0f} apart")
        if gap < want - 1:
            bad.append(f"f before {second} with ligatures off: {gap:.0f} apart above the x-height, under {want}")
    kp = [p.x for p in font["k"].contours[0].points if p.type and p.y <= 30 and p.x < 330]
    ks = [p.x for p in font["k"].contours[0].points if p.type and 90 < p.y < 330 and 150 < p.x < 200]
    foot = max(kp) - max(ks)
    notes.append(f"k: right foot of the stem {foot}")
    if foot > 74:
        bad.append(f"k: the stem's right foot reaches {foot}, the others 70")
    # 0.75: Eng is N and a tail; the degree's ring is the capital hairline; a stacked mark stands MIN_GAP over the other
    eng = next((g for g in font if 0x014A in g.unicodes), None)
    if eng is not None:
        N_, G_ = on_points(font, "N"), set(on_points(font, eng.name))
        if sum(1 for q in N_ if q in G_) / len(N_) < 0.7:
            bad.append("Eng is not built on the finished N")
    p = C.gp(font, "degree")
    b_ = C.bounds(p)
    ringw = [round(s_[1] - s_[0]) for s_ in C.scan_h(p, (b_[1] + b_[3]) / 2)]
    if ringw[:1] != [C.STROKE_UP]:
        bad.append(f"degree: ring {ringw}, the capital hairline {C.STROKE_UP}")
    for cp in (0x1EB5, 0x1EAB, 0x1EAA):
        g = next((g for g in font if cp in g.unicodes), None)
        if g is not None and len(g.components) >= 3:
            lo, hi = C.bounds(comp_path(font, g.components[1])), C.bounds(comp_path(font, g.components[2]))
            if abs((hi[1] - lo[3]) - C.STACK_GAP) > 1.5:
                bad.append(f"{g.name}: its upper mark stands {hi[1] - lo[3]:.0f} over the lower, not {C.STACK_GAP}")
    return bad, notes


def audit_079(font, bad, notes, bold=None):
    """0.79: the single-storey g, an alternate differs in form, the 5's bowl, the f ligatures."""
    import clean as CLEAN
    # the single-storey g: q's bowl whole (0.78 cut it level at the baseline) and a tail under the whole bowl
    if "g.ss02" in font:
        g, q = C.gp(font, "g.ss02"), C.gp(font, "q")
        P = [p for c in font["g.ss02"].contours for p in c.points]
        flat = [abs(P[i].x - P[i - 1].x) for i in range(len(P)) if P[i].type == "line" and P[i - 1].type
                and P[i].y == P[i - 1].y and abs(P[i].y) <= 4]
        if flat and max(flat) > 20:
            bad.append(f"g.ss02: a level edge {max(flat)} long at the baseline (the bowl is cut flat)")
        row_g, row_q = C.scan_h(g, 260), C.scan_h(q, 260)
        bowl_l, stem_r = row_g[0][0], row_g[-1][1]
        if abs(bowl_l - row_q[0][0]) > 1 or abs((row_g[0][1] - row_g[0][0]) - (row_q[0][1] - row_q[0][0])) > 1:
            bad.append("g.ss02: its bowl is not q's")
        low = min(p.x for p in P if p.type and p.y < -10)
        share = (stem_r - low) / (stem_r - bowl_l)
        notes.append(f"g.ss02: tail ends {share:.3f} of the bowl's width from the stem's right edge")
        if abs(share - C.G_TAIL_END) > 0.02:
            bad.append(f"g.ss02: its tail ends {share:.2f} of the bowl's width left of the stem, not {C.G_TAIL_END}")
    # an alternate is a different form (owner): the base's S and s had the default's form (barb ends, the same
    # spine; S 5 narrower of 489, s 55 of 379) and are not in the font; the dollar, with ball ends, is
    for name in ("S.ss03", "s.ss03", "dollar.ss03"):
        if name in font:
            bad.append(f"{name}: there is one S, one s and one dollar (0.79, 0.80)")
    # 0.80: the one dollar ends in balls (the owner's pick), so it is not the S, whose ends are barbs
    S_, D_ = on_points(font, "S"), set(on_points(font, "dollar"))
    if max(sum(1 for (x, y) in S_ if (x + dx, y) in D_) / len(S_) for dx in range(-80, 81)) > 0.6:
        bad.append("dollar: it is the S and a stroke (barb ends), not the ball-end dollar")
    # 0.80: every flag's underside is one curve (n's and k's were two, 18 units shorter at the stem)
    for name, x, y in CLEAN.flag_unders(font, apply=False):
        bad.append(f"{name}: the flag at {x},{y} has a two-curve underside, not i's one curve")
    # 5's bowl
    c5 = font["five"].contours[0]
    lo, in_lo, right, in_right, left, foot, top = CLEAN.five_bowl_nodes(c5)
    P = c5.points
    low_at = (P[lo].x - left) / (P[right].x - left)
    wide, in_wide = (P[right].y - foot) / (top - foot), (P[in_right].y - foot) / (top - foot)
    notes.append(f"5: bowl's lowest point at {low_at:.3f} of its width; widest at {wide:.3f}, counter {in_wide:.3f} of its height")
    if abs(low_at - CLEAN.FIVE_LOW) > 0.01:
        bad.append(f"5: the bowl's lowest point lies {low_at:.3f} of its width from the left, not {CLEAN.FIVE_LOW}")
    if in_wide > wide + 0.005:
        bad.append(f"5: the counter is widest ({in_wide:.3f}) above the outside's widest point ({wide:.3f}): heavy low on the right")
    # f ligatures: the hook over i and j; a level top into an ascender; sides and classes of the letters set apart
    stem = C._stem_x(C.gp(font, "f"), 300)
    sw = stem[1] - stem[0]

    def side(f_, n):
        b = C.bounds(C.gp(f_, n))
        return b[0], f_[n].width - b[2]

    def cls(n, k):
        return next((gn for gn, m in font.groups.items() if gn.startswith("public.kern" + k) and n in m), None)
    for name, rest in C.LIGATURES.items():
        if name not in font:
            bad.append(f"{name}: missing")
            continue
        last = rest[0] if rest else "f"
        p = C.gp(font, name)
        rows = C.scan_h(p, 300)
        if last in "ij":
            sc = (rows[-1][0] + rows[-1][1]) / 2
            hook = max(q.x for c in font[name].contours for q in c.points if q.type and q.y > 600)
            past = (hook - sc) / sw
            notes.append(f"{name}: hook ends {past:+.2f} stems past the {last}'s stem centre")
            if abs(past - C.F_HOOK_PAST) > 0.06:
                bad.append(f"{name}: f's hook ends {past:+.2f} stems from the {last}'s stem centre, not +{C.F_HOOK_PAST}")
        if last in "lbhk":
            x0, x1 = rows[-2][1] + 90 if len(rows) > 1 else rows[0][1] + 90, None
            st = C.scan_h(p, 640)[-1]
            tops = [max(s[1] for s in C.scan_v(p, x)) for x in range(int(st[0]) - 60, int(st[1]) - 1, 6)]
            if max(tops) - min(tops) > 1.5:
                bad.append(f"{name}: the top steps by {max(tops) - min(tops):.0f} where f's arc meets the {last}")
        for f_, label in ((font, ""), (bold, "Bold ")):
            if f_ is None or name not in f_:
                continue
            l, r = side(f_, name)
            want_r = side(f_, {"i": "idotless", "j": "jdotless"}.get(last, last))[1]
            if abs(l - side(f_, "f")[0]) > 1 or abs(r - want_r) > 1:
                bad.append(f"{label}{name}: sides {l:.0f} / {r:.0f}, the letters set apart {side(f_, 'f')[0]:.0f} / {want_r:.0f}")
        if cls(name, "2") != cls("f", "2") or cls(name, "1") != cls(last, "1"):
            bad.append(f"{name}: kerns as {cls(name, '2')} / {cls(name, '1')}, not as f on the left and {last} on the right")


def audit_081(font, bad, notes, bold=None, light=None):
    """0.81: g's loop and g.ss02's tail by their rules; the alternates built from their parts, their families and
    features, and present in all three masters."""
    import alternates as AL
    import loops as LOOPS
    import parts as PARTS
    # g: the loop's counter is its own contour (0.80 drew it inside the outer one, through a knob), with a branch neck
    g = font["g"]
    lows = [c for c in g.contours if max(p.y for p in c.points) < 60]
    if len(g.contours) != 3 or not lows:
        bad.append("g: the loop's counter is not its own contour (0.80's hook and knob)")
    # g.ss02: its tail by its form (charset.G_TAIL_FORM): the outside leaves the stem at the ball's height (a
    # half-ellipse) or one quarter's width above the lowest point; the ball's top at the form's height
    if "g.ss02" in font:
        F = C.G_TAIL_FORMS[C.G_TAIL_FORM]
        P = [(p.x, p.y, p.type, p.smooth) for p in max(font["g.ss02"].contours, key=lambda c: len(c.points)).points]
        depth = min(p[1] for p in P)
        stem_r = max(p[0] for p in P if p[2] == "line")
        foot = [p for p in P if p[2] and p[0] == stem_r and -200 < p[1] < 80]
        lowx = next(p[0] for p in P if p[2] and p[1] == depth)
        ball_l = min((p for p in P if p[2] and p[1] < 0), key=lambda p: p[0])
        want_y = (F["leave"] if "leave" in F else ball_l[1] if F.get("rise") == "ball"
                  else depth + stem_r - lowx)                  # form E (0.80's, owner round 8): at the baseline
        if not foot or abs(min(f[1] for f in foot) - want_y) > 1:
            bad.append(f"g.ss02: its outside does not leave the stem at {want_y}")
        ball_top = max(p[1] for p in P if p[2] and p[1] < 0 and p[0] < lowx - 100)
        if abs(-ball_top / 520 - F["ball"]) > 0.004:
            bad.append(f"g.ss02: its ball's top {ball_top} under the baseline, not {F['ball']} of the x-height")
        notes.append(f"g.ss02: tail form {C.G_TAIL_FORM}, ball top {-ball_top / 520:.3f} x-height under the baseline")
    want = {"a.ss03": "a", "l.ss04": "l", "zero.zero": "zero", "zero.ss05": "zero", "seven.ss06": "seven",
            "z.ss06": "z", "fl.ss04": "fl", "f_f_l.ss04": "f_f_l", "lslash.ss04": "lslash", "zero.tf.zero": "zero.tf",
            "zero.tf.ss05": "zero.tf"}
    for alt, base in want.items():
        if alt not in font:
            bad.append(f"{alt}: missing")
            continue
        for m, label in ((bold, "Bold"), (light, "Light")):
            if m is not None and alt not in m:
                bad.append(f"{alt}: missing in the {label}")
    if "a.ss03" not in font:
        return
    # a.ss03: the narrowed bowl's stroke at the side is the bowl's (82), its stem 78, its foot the two-storey a's
    # exit moved whole, its advance the references' share of n
    row = C.scan_h(C.gp(font, "a.ss03"), 260)
    if abs((row[0][1] - row[0][0]) - (PARTS.DXO_S - PARTS.DXC_S)) > 2 or abs((row[-1][1] - row[-1][0]) - PARTS.S) > 1:
        bad.append(f"a.ss03: side {row[0][1] - row[0][0]:.0f} and stem {row[-1][1] - row[-1][0]:.0f}, not "
                   f"{PARTS.DXO_S - PARTS.DXC_S} and {PARTS.S}")
    share = font["a.ss03"].width / font["n"].width
    notes.append(f"a.ss03: advance {share:.3f} of n (references {AL.A_ADV_N:.3f})")
    if abs(share - AL.A_ADV_N) > 0.01:
        bad.append(f"a.ss03: advance {share:.3f} of n, not {AL.A_ADV_N:.3f}")
    curl, _r = AL._a_curl(font, row[-1][0])
    A = {(round(x), round(y)) for x, y, _t, _s in AL._pts(AL._outer(font["a.ss03"]))}
    if not all((round(x), round(y)) in A for x, y, _t, _s in curl):
        bad.append("a.ss03: its foot is not the two-storey a's exit")
    # every accented a has its single-storey form, its top marks centred on the body as a's are
    a_cx, _r1, _b1 = AL._body_cx(font, "a")
    s_cx, _r2, _b2 = AL._body_cx(font, "a.ss03")
    for g_ in font:
        if g_.components and g_.components[0].baseGlyph == "a" and g_.unicodes:
            alt = g_.name + ".ss03"
            if alt not in font or font[alt].components[0].baseGlyph != "a.ss03":
                bad.append(f"{alt}: missing or not on a.ss03")
                continue
            for c0, c1 in zip(g_.components[1:], font[alt].components[1:]):
                if c0.baseGlyph not in AL.RIGHT_MARKS and abs((c1.transformation[4] - c0.transformation[4]) - (s_cx - a_cx)) > 1:
                    bad.append(f"{alt}: {c1.baseGlyph} not centred on the body as on {g_.name}")
    # l.ss04: t's hook, whole
    hook, hx0, _hx1, _rsb = AL._t_hook(font, AL.L_HOOK_REACH)
    L = {(round(x), round(y)) for x, y, _t, _s in AL._pts(font["l.ss04"].contours[0])}
    xl = max(p[0] for p in L if p[1] > 700) - PARTS.S              # the stem's left edge
    moved = [(round(x + xl - hx0), round(y)) for x, y, _t, _s in hook[:-3]]
    if sum(1 for q in moved if q in L) < len(moved) - 1:
        bad.append("l.ss04: its hook is not t's construction at L_HOOK_REACH")
    w_l = (font["l.ss04"].width - font["l"].width) / PARTS.S
    notes.append(f"l.ss04: advance {font['l.ss04'].width}, l's plus {w_l:.2f} stems")
    if not 0.5 <= w_l <= 1.0:
        bad.append(f"l.ss04: l's advance plus {w_l:.2f} stems, not 0.5 to 1")
    al = next((g for g in font if 0x0251 in g.unicodes), None)
    if al is not None and (not al.components or al.components[0].baseGlyph != "a.ss03"):
        bad.append(f"{al.name}: U+0251 is not a.ss03")
    # zeros, seven, z: strokes at their hairlines
    zz = C.scan_v(C.gp(font, "zero.zero"), font["zero"].width / 2)
    notes.append(f"zero.zero: the slash across the middle {zz}")
    fea = font.features.text
    for tag, pairs in (("ss03", [("a", "a.ss03")]), ("ss04", [("l", "l.ss04"), ("lslash", "lslash.ss04"), ("fl", "fl.ss04")]),
                       ("zero", [("zero", "zero.zero"), ("zero.tf", "zero.tf.zero")]), ("ss05", [("zero", "zero.ss05")]),
                       ("ss06", [("seven", "seven.ss06"), ("z", "z.ss06")])):
        block = fea[fea.find(f"feature {tag} {{"):]
        block = block[:block.find(f"}} {tag};")]
        for a_, b_ in pairs:
            if f"sub {a_} by {b_};" not in block:
                bad.append(f"feature {tag}: no 'sub {a_} by {b_}'")
        if tag.startswith("ss") and "featureNames" not in block:
            bad.append(f"feature {tag}: no name")


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "build", "AreaSerif-Regular.ufo")
    font = ufoLib2.Font.open(path)
    bad, notes = audit(font)
    bpath = os.path.join(os.path.dirname(path), "AreaSerif-Bold.ufo")
    bold = ufoLib2.Font.open(bpath) if os.path.exists(bpath) else None
    audit_079(font, bad, notes, bold)
    lpath = os.path.join(os.path.dirname(path), "AreaSerif-Light.ufo")
    audit_081(font, bad, notes, bold, ufoLib2.Font.open(lpath) if os.path.exists(lpath) else None)
    for n in notes:
        print("  ", n)
    for b in bad:
        print("ERROR", b)
    print(f"charset audit: {len(bad)} error(s)")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
