"""Spacing (0.38; owner, 2026-11-12: "can you do an optical spacing/kerning/tracking adjustment too so its easier to
see the letters in context").

Until now every side bearing was Libre Baskerville's, scaled, under letters whose serifs, widths and weights had
changed: n's bearings were 49 and 34 units, r's right 72, s's left 65, t's left 50.

Sidebearings. Tried first: equal white beside every letter (HT Letterspacer's rule). On a face with serifs it sets
rounds and diagonals far too loose (o 63 against n 39), because a stem's serif already fills its bearing. So the
fit is measured instead, the way the widths are (guidelines, Widths): each a-z and A-Z bearing follows Georgia
Pro's, measured in the letter's own zone (baseline to x-height, or to cap height) to the outermost ink there, scaled
to Area's heights, plus one offset per case. The offset keeps Area looser than Georgia Pro, whose stems are a sixth
heavier: n and H end TRACK units a side tighter than they were. Only bearings are measured; no outline is read.

Kerning. Libre Baskerville's pairs are kept, each moved by the change in its two bearings beyond the tracking, so a
kerned pair keeps its designed fit. Then every pair among letters, figures and . , - ' is checked for ink closer
than MIN_GAP anywhere, and opened to it.

Accented letters are components: they take their base's shift and advance. Figures and punctuation keep their own
bearings. Called last in normalize.normalize."""
import string

X_HEIGHT, CAP_HEIGHT = 520, 712
STEP = 10
TRACK = {"lower": 6, "upper": -10, "other": 0}    # units a side tighter than n's and H's bearings were
# 0.66, capitals: 3 until now, which left H's stems 238 units from the next H's (at Area's heights Serrif sets 273 and
# Georgia Pro 290: Area's serifs are shorter, so equal bearings at the tips put its stems closer). 13 looser a side:
# the most that keeps the round capitals inside the references' range (O's bearing 45; theirs 40 and 46). H to H 264.
# The lowercase stays: n to n is 215 (216 and 209), the word space 250 (261 and 249).
MAX_MOVE = 70
MIN_GAP = 13                  # ink never closer than this. 22 until 0.66; measured (tools/fit): Serrif holds 9 to 13
                              # between serif tips (VV WW AA vv ww), Georgia Pro lets them overlap
WORD_SPACE = 250              # 287 until 0.38; 0.48 of the x-height
LOWER, UPPER = string.ascii_lowercase, string.ascii_uppercase
FIGS = "zero one two three four five six seven eight nine".split()
PUNCT = ["period", "comma", "hyphen", "quotesingle", "quoteright", "colon", "semicolon", "exclam", "question",
         "endash", "emdash", "quotedbl", "quoteleft", "quotedblleft", "quotedblright", "parenleft", "parenright", "slash"]
# Georgia Pro Regular's bearings [left, right] in each letter's zone, in Area's units (measured 2026-11-12)
REFERENCE = {
    "a": [42, 14], "b": [89, 39], "c": [38, 3], "d": [38, 12], "e": [38, 23], "f": [13, 4],
    "g": [53, 25], "h": [28, 26], "i": [23, 26], "j": [11, 89], "k": [28, -10], "l": [28, 27],
    "m": [30, 23], "n": [32, 26], "o": [37, 38], "p": [17, 38], "q": [38, 82], "r": [32, 7],
    "s": [39, 40], "t": [6, 13], "u": [18, 26], "v": [-10, -15], "w": [-2, -16], "x": [6, 6],
    "y": [-10, -16], "z": [29, 29], "A": [-21, -24], "B": [47, 46], "C": [39, 14], "D": [47, 39],
    "E": [43, 24], "F": [43, 15], "G": [39, 8], "H": [49, 51], "I": [40, 40], "J": [5, 28],
    "K": [51, -27], "L": [49, 0], "M": [24, 46], "N": [13, 9], "O": [40, 40], "P": [45, 33],
    "Q": [40, 40], "R": [49, -22], "S": [47, 40], "T": [7, 9], "U": [37, 7], "V": [-20, -21],
    "W": [-2, -15], "X": [6, -1], "Y": [-22, -28], "Z": [14, 10],
}


# 0.66, the optical pass (owner: "a final optical spacing, kerning, tracking pass"). REFERENCE sets each bearing from
# the outermost ink, which is a serif's tip: a letter whose serifs differ from n's or H's ends with its stem nearer or
# further than theirs. tools/fit/fit.py measures the white a side really shows (the mean over the zone's rows, each
# no deeper than 0.15 of the height behind the outermost ink) against the face's own n or H, in Area and in both
# references. Where Area stands off BOTH references in the same direction, the side moves by the smaller of the two
# differences (3 units or more); where they disagree it stays. Units added to [left, right] after REFERENCE:
OPTICAL = {
    "a": [4, -3], "c": [0, 3], "f": [0, 7], "i": [4, 0], "j": [5, -5], "m": [3, 0], "p": [4, 0], "t": [4, 0],
    "u": [0, -9], "z": [-3, 0],
    "B": [0, -13], "E": [6, -5], "F": [6, -7], "G": [0, -13], "I": [8, 9], "J": [0, 3], "M": [8, 3], "N": [7, 10],
    "P": [5, -16], "U": [-4, 5], "W": [-7, 0], "Z": [-6, 0],
}
# r's right side (0.68; owner, 2026-11-13: "i prefer a wider r"). r's ink was already the widest of the nine faces
# measured (4.81 stems; 3.72 to 4.69 elsewhere) with the longest arm (2.91) and foot (1.67), but its advance was the
# narrowest against n: 0.659 (Serrif 0.671, Georgia Pro 0.694, the eight references 0.671 to 0.715). So what read as
# narrow was the white after it, not the letter. R_AIR brings the advance to the two references' mean, 0.6825 of n.
# Kerned pairs (r before a round letter) keep their distance; r before a stem gains the white.
import os as _os
R_AIR = int(_os.environ.get("AREA_R_AIR", 15))
if R_AIR:
    OPTICAL["r"] = [0, R_AIR]
# and on punctuation, which REFERENCE never covered (the dashes stood 20 units a side looser than either
# reference's against n, the parentheses 11 and 19 tighter):
OPTICAL_MORE = {
    "hyphen": [-20, -21], "endash": [-20, -21], "emdash": [-20, -20], "parenleft": [11, 19], "parenright": [19, 11],
    "exclam": [9, 10], "quoteleft": [-5, 0], "quotedblleft": [-5, 0],
    # 0.73, the same measure on the signs 0.66 did not reach (36 measured; these stood off both references the same
    # way by 8 or more). A sign that is symmetric keeps equal sides (the smaller of its two differences, so the bar,
    # dagger, degree, bullet and yen stay); a mirrored pair takes the smaller of the pair's (so braces and guillemets
    # stay; the right bracket follows the left through charset.mirrors); plus and equals keep the maths' one advance.
    "percent": [0, 26], "exclamdown": [0, 18], "dollar": [17, 15], "trademark": [-24, 0], "bracketleft": [0, 11],
    "underscore": [-19, -19], "at": [0, 9], "numbersign": [0, 12], "sterling": [10, 0],
}


def _flat(g, font):
    from fontTools.pens.recordingPen import DecomposingRecordingPen
    pen = DecomposingRecordingPen(font)
    g.draw(pen)
    cs, cur = [], None
    for op, pts in pen.value:
        if op == "moveTo":
            cs.append([pts[0]])
        elif op == "lineTo":
            cs[-1].append(pts[0])
        elif op == "curveTo":
            a = cs[-1][-1]
            b, c, d = pts
            for t in range(1, 13):
                t /= 12
                u = 1 - t
                cs[-1].append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
                               u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]))
    return [c for c in cs if len(c) > 2]


def _edges(cs, y):
    """(leftmost ink x, rightmost ink x) at height y, or None."""
    y += 0.37
    xs = []
    for c in cs:
        n = len(c)
        for i in range(n):
            a, b = c[i], c[(i + 1) % n]
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1]):
                xs.append(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0]))
    return (min(xs), max(xs)) if xs else None


def _profile(font, name, y0, y1):
    cs = _flat(font[name], font)
    return {y: _edges(cs, y) for y in range(y0, y1 + 1, STEP)}


def _zone(name):
    return (10, X_HEIGHT - 10) if name in LOWER else (10, CAP_HEIGHT - 10)


def _zone_bearings(font, name):
    rows = [e for e in _profile(font, name, *_zone(name)).values() if e]
    return min(e[0] for e in rows), font[name].width - max(e[1] for e in rows)


def space(font):
    measured = {name: _zone_bearings(font, name) for name in LOWER + UPPER}
    offset = {}
    for cls, ref in (("lower", "n"), ("upper", "H")):
        offset[cls] = (sum(measured[ref]) - sum(REFERENCE[ref])) / 2 - TRACK[cls]
    delta = {}                                   # name: (shift of the outline, change in advance, d lsb, d rsb)
    for name in LOWER + UPPER:
        o = offset["lower" if name in LOWER else "upper"]
        dl, dr = (max(-MAX_MOVE, min(MAX_MOVE, round(REFERENCE[name][i] + o - measured[name][i])))
                  + OPTICAL.get(name, (0, 0))[i] for i in (0, 1))
        delta[name] = (dl, dl + dr, dl, dr)
    for name, (dl, dr) in OPTICAL_MORE.items():
        if name in font and font[name].contours:
            delta[name] = (dl, dl + dr, dl, dr)
    old_width = {g.name: g.width for g in font}
    for name, (dx, dw, _, _) in delta.items():
        g = font[name]
        for c in g.contours:
            for p in c.points:
                p.x += dx
        for a in g.anchors:
            a.x += dx
        g.width += dw
    for g in font:                               # accented letters and ligatures built from components
        if not g.components or g.name in delta:
            continue
        adv, base_dx, touched = 0, None, False
        for comp in g.components:
            xx, xy, yx, yy, ox, oy = comp.transformation
            if comp.baseGlyph in delta:
                touched = True
                if base_dx is None:
                    base_dx = delta[comp.baseGlyph][0]
                comp.transformation = (xx, xy, yx, yy, ox + adv, oy)
                adv += delta[comp.baseGlyph][1]
            elif base_dx is not None:
                comp.transformation = (xx, xy, yx, yy, ox + base_dx, oy)      # a mark follows its base
        if touched:
            bases = [c.baseGlyph for c in g.components if c.baseGlyph in delta]
            g.width = font[bases[0]].width if len(bases) == 1 else old_width[g.name] + adv
            for a in g.anchors:
                a.x += base_dx or 0
    for name in ("space", "uni00A0", "nbspace"):
        if name in font:
            font[name].width = WORD_SPACE
    return delta


def _rep(key, groups, delta):
    if key in delta:
        return key
    for m in groups.get(key, ()):
        if m in delta:
            return m
    return None


def rekern(font, delta):
    """Kerned pairs keep their fit: each value moves by its two bearings' change beyond the tracking."""
    cls = lambda n: "lower" if n in LOWER else "upper" if n in UPPER else "other"
    moved = 0
    for (a, b), v in list(font.kerning.items()):
        ra, rb = _rep(a, font.groups, delta), _rep(b, font.groups, delta)
        d = 0
        if ra:
            d -= delta[ra][3] + TRACK[cls(ra)]
        if rb:
            d -= delta[rb][2] + TRACK[cls(rb)]
        if d:
            font.kerning[(a, b)] = round(v + d)
            moved += 1
    return moved


def open_collisions(font):
    from fontTools.ufoLib.kerning import lookupKerningValue
    names = [n for n in list(LOWER + UPPER) + FIGS + PUNCT if n in font]
    prof = {n: _profile(font, n, -240, 800) for n in names}
    opened = []
    for a in names:
        wa = font[a].width
        for b in names:
            k = lookupKerningValue((a, b), font.kerning, font.groups) or 0
            gap = None
            ys = sorted(prof[a])
            for i, y in enumerate(ys):
                ea = prof[a][y]
                if not ea:
                    continue
                for yb in ys[max(0, i - 1):i + 2]:               # one step of slack up and down
                    eb = prof[b][yb]
                    if eb:
                        d = (wa - ea[1]) + eb[0] + k
                        gap = d if gap is None else min(gap, d)
            if gap is not None and gap < MIN_GAP:
                add = round(MIN_GAP - gap)
                if add >= 4:
                    font.kerning[(a, b)] = k + add
                    opened.append((a, b, round(gap), k + add))
    return opened


# 0.66: kerning from the fit. rekern (0.38) keeps every pair Libre Baskerville kerned at ITS gap, while pairs it left
# alone took the new bearings: "fo" "we" "ro" stood 25 to 90 units tighter than either reference sets them, "iw" "Gw"
# "GA" 40 to 100 looser. tools/fit/fit.py measures the white between each pair of letters and common punctuation in
# all three faces, against each face's own nn / HH / Hn; where Area stands outside both references by 8 or more, the
# pair is kerned to the nearer one. The values are in fit_kerning.json (regenerate it after any change to bearings:
# fit.py measure, then fit.py kern, on a build made WITHOUT the file).
FIT = "fit_kerning.json"


def fit_kerning(font):
    import json
    import os
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), FIT)
    if not os.path.exists(path) or os.environ.get("AREA_NO_FIT"):
        return 0
    n = 0
    for a, b, v in json.load(open(path))["pairs"]:
        if (a.startswith("public.") and a not in font.groups) or (b.startswith("public.") and b not in font.groups):
            continue
        if v == 0:
            font.kerning.pop((a, b), None)
        else:
            font.kerning[(a, b)] = v
        n += 1
    return n


def run(font):
    delta = space(font)
    moved = rekern(font, delta)
    fitted = fit_kerning(font)
    opened = open_collisions(font)
    print(f"spacing: {fitted} kerning values from the fit")
    return delta, moved, opened


# ---------------------------------------------------------------------------------------------------- 0.73
# Kerning beyond the 62 core characters (evaluation suite, test_fit_ext.py: 75,161 pairs of punctuation, signs and
# accented letters with the core and each other, shaped, against Georgia Pro and Serrif).
#
# 1. A letter's accented forms kern as the letter. 0.66's fit and collision values were written for the glyphs
#    measured (K A = +51), so K before A-grave still had Libre Baskerville's class value and overlapped by 38;
#    the Vietnamese letters composed in 0.48 were in no class and had no kerning at all. Each value written for a
#    letter now belongs to its family: the letter and every glyph that is that letter with marks and shows the
#    same edge on that side (within FAMILY_EDGE). Where Libre Baskerville's class is already that family the value
#    moves to the class; where the class mixes letters (H I K ... on their left) it is copied to the family.
# 2. No two glyphs of the set the font promises come closer than MIN_GAP, kerning included: the collision pass,
#    which looked at letters, figures and 18 punctuation marks, looks at all of them (an accent under f's hood, j's
#    tail under a bracket, a caron beside a tall letter).
FAMILY_EDGE = 5
NO_COLLISION = {0x2044, 0x2215}       # the fraction slashes reach into their neighbours on purpose
CORE = set(LOWER + UPPER)


def _ink_x(font, name):
    cs = _flat(font[name], font)
    xs = [p[0] for c in cs for p in c]
    return (min(xs), max(xs)) if xs else None


def _families(font):
    """{base: ([glyphs showing base's left edge], [glyphs showing base's right edge])} for the core letters."""
    cats = font.lib.get("public.openTypeCategories", {})

    def is_mark(n):                 # a mark attaches by an anchor of its own
        return cats.get(n) == "mark" or font[n].width == 0 or any(a.name.startswith("_") for a in font[n].anchors)
    fam = {}
    ink = {}
    for g in font:
        if len(g.components) < 2:
            continue
        base = g.components[0].baseGlyph
        while base in font and not font[base].contours and font[base].components:
            base = font[base].components[0].baseGlyph
        base = {"idotless": "i", "jdotless": "j"}.get(base, base)
        if base not in CORE or g.components[0].transformation[4] != 0:
            continue
        if not all(is_mark(c.baseGlyph) for c in g.components[1:]):
            continue
        for n in (base, g.name):
            if n not in ink:
                ink[n] = _ink_x(font, n)
        if not ink[g.name] or not ink[base]:
            continue
        left = abs(ink[g.name][0] - ink[base][0]) <= FAMILY_EDGE
        right = abs((font[g.name].width - ink[g.name][1]) - (font[base].width - ink[base][1])) <= FAMILY_EDGE
        f = fam.setdefault(base, ([], []))
        if left:
            f[0].append(g.name)
        if right:
            f[1].append(g.name)
    return fam


def kern_families(font):
    fam = _families(font)
    K, G = font.kerning, font.groups
    grp = {1: {}, 2: {}}
    for name, members in G.items():
        side = 1 if name.startswith("public.kern1") else 2 if name.startswith("public.kern2") else 0
        if side:
            for m in members:
                grp[side][m] = name
    target = {1: {}, 2: {}}          # base -> the class that is its family, or the list of glyphs to copy to
    joined = 0
    for base, (lefts, rights) in fam.items():
        for side, members in ((1, rights), (2, lefts)):       # a pair's first glyph shows its right edge
            gname = grp[side].get(base)
            if gname:
                for m in members:                             # the letter's class on this side is its family's too
                    if grp[side].get(m) != gname:
                        old = grp[side].get(m)
                        if old:
                            G[old].remove(m)
                        G[gname].append(m)
                        grp[side][m] = gname
                        joined += 1
            if gname and sum(1 for m in G[gname] if m in CORE) == 1:
                target[side][base] = gname                    # the class is this letter alone: its values move to it
            else:
                target[side][base] = [m for m in members]
    promoted = copied = 0
    for (a, b), v in list(K.items()):
        ta, tb = target[1].get(a), target[2].get(b)
        A = ta if isinstance(ta, str) else a
        B = tb if isinstance(tb, str) else b
        if (A, B) != (a, b):
            del K[(a, b)]
            K[(A, B)] = v
            promoted += 1
        for a2 in ([A] + (ta if isinstance(ta, list) else [])):
            for b2 in ([B] + (tb if isinstance(tb, list) else [])):
                if (a2, b2) != (A, B) and (a2, b2) not in K:
                    K[(a2, b2)] = v
                    copied += 1
    return joined, promoted, copied


def open_all(font, codepoints, dry=False):
    """The collision pass on every glyph of the set, kerning included. dry: change nothing, return what it would open."""
    import numpy as np
    from fontTools.ufoLib.kerning import lookupKerningValue
    want = set(codepoints)
    import unicodedata
    cats = font.lib.get("public.openTypeCategories", {})
    names = [g.name for g in font if any(u in want for u in g.unicodes) and (g.contours or g.components)
             and g.width > 0 and cats.get(g.name) != "mark" and not NO_COLLISION & set(g.unicodes)
             and not any(unicodedata.category(chr(u)) in ("Mn", "Mc", "Lm", "Sk") for u in g.unicodes)]
    ys = list(range(-280, 1081, STEP))
    R, L = {}, {}
    for n in names:
        cs = _flat(font[n], font)
        if not cs:
            continue
        r = np.full(len(ys), np.inf)
        l = np.full(len(ys), np.inf)
        w = font[n].width
        for i, y in enumerate(ys):
            e = _edges(cs, y)
            if e:
                l[i], r[i] = e[0], w - e[1]
        l3 = np.minimum(l, np.minimum(np.roll(l, 1), np.roll(l, -1)))
        l3[0], l3[-1] = min(l[0], l[1]), min(l[-1], l[-2])
        R[n], L[n] = r, l3
    names = [n for n in names if n in R]
    Lm = np.stack([L[n] for n in names])
    opened = []
    for a in names:
        gaps = (Lm + R[a]).min(axis=1)
        for j in np.where(gaps < MIN_GAP + 80)[0]:           # only pairs that could be close once kerned
            b = names[j]
            k = lookupKerningValue((a, b), font.kerning, font.groups) or 0
            gap = gaps[j] + k
            if gap < MIN_GAP:
                add = round(MIN_GAP - gap)
                if add >= 4:
                    if not dry:
                        font.kerning[(a, b)] = k + add
                    opened.append((a, b, round(float(gap)), k + add))
    return opened


def family_drift(font):
    """Accented letters that are not in their letter's kerning class on a side where they show its edge. (A value
    may still differ from the letter's: the collision pass opens a pair where a mark, or the letter's own dot,
    needs room.)"""
    grp = {1: {}, 2: {}}
    for name, members in font.groups.items():
        side = 1 if name.startswith("public.kern1") else 2 if name.startswith("public.kern2") else 0
        if side:
            for m in members:
                grp[side][m] = name
    bad = []
    for base, (lefts, rights) in _families(font).items():
        for side, members in ((1, rights), (2, lefts)):
            g = grp[side].get(base)
            if g:
                bad += [(m, base, side) for m in members if grp[side].get(m) != g]
    return bad


# f before a dot (0.77; owner, 2026-11-14: "shouldnt the fi be a ligature?"). It is: fi ffi fl ffl fj ffj are in the
# font and `liga` is on by default. But any text set with letter-spacing has ligatures turned off by the browser,
# and then f's ball stood 13 units from the dot of i and j: the collision pass's minimum, where the references keep
# 17 and 71 (Georgia Pro, Serrif; Libre Baskerville 30). The pair opens to their mean. An accented i or j keeps at
# least what Serrif keeps before its dieresis (16; Georgia Pro's collide).
F_DOT = 44
F_ACCENT = 16


def f_gap(font, first, second):
    """The least white between `first`'s ink and `second`'s above the x-height, kerning included."""
    from fontTools.ufoLib.kerning import lookupKerningValue
    a, b = _flat(font[first], font), _flat(font[second], font)
    k = lookupKerningValue((first, second), font.kerning, font.groups) or 0
    best = None
    for y in range(X_HEIGHT + 10, 1081, STEP):
        ea, eb = _edges(a, y), _edges(b, y)
        if ea and eb:
            g = font[first].width + k + eb[0] - ea[1]
            best = g if best is None else min(best, g)
    return best, k


def f_before_dots(font):
    done = []
    for g in font:
        base = g.components[0].baseGlyph if g.components else g.name
        if base not in ("i", "j", "idotless", "jdotless", "dotlessi", "dotlessj") or not g.unicodes or g.name in ("idotless", "jdotless"):
            continue
        want = F_DOT if g.name in ("i", "j") else F_ACCENT
        gap, k = f_gap(font, "f", g.name)
        if gap is not None and gap < want:
            font.kerning[("f", g.name)] = k + round(want - gap)
            done.append((g.name, round(gap), want))
    return done


def finish(font, codepoints):
    joined, promoted, copied = kern_families(font)
    opened = open_all(font, codepoints)
    f_before_dots(font)
    return joined, promoted, copied, opened
