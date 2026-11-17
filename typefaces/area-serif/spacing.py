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


# 0.81 (close): a word space before j. j's tail reaches 244 units left of its stem (Georgia Pro 210, Serrif 109 at
# Area's x-height) and its stem's side follows Georgia Pro's at the serif, so the tail runs under the word space
# before it: the least white between a letter and j across a space (HarfBuzz, kerning on) was 63 units under the
# nearer reference's at 400, the median over a to z (s j 252 against Georgia Pro 322 and Serrif 345; n j 185 against
# 254 and 304; v j and y j already inside), and 42 under at 700. fit.py's pair measure reads only the rows where both
# letters have ink and never saw it. The kerning rule (a pair outside both references by 8 or more goes to the
# nearer): space before j's class by the median shortfall. The masters take it by the transfer rule.
SPACE_BEFORE = {"public.kern2.KERN_j_2ND": 63}


def space_kerning(font):
    n = 0
    for b, v in SPACE_BEFORE.items():
        if "space" in font and (b in font.groups or b in font):
            font.kerning[("space", b)] = v
            n += 1
    return n


def run(font):
    delta = space(font)
    moved = rekern(font, delta)
    fitted = fit_kerning(font) + space_kerning(font)
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


# ---------------------------------------------------------------------------------------------------- 0.81
# Kerning per master. Until 0.80 the Light and the Bold took the Regular's pairs unchanged and only opened the pairs
# their heavier or lighter ink brought under MIN_GAP (the Bold 6,444 of them). Measured (tools/fit/weights.py, the
# white between every pair fit.py measures, at 300 / 400 / 700, against its control nn HH Hn nH):
#
#                      control white nn, 300 and 700 over 400   rel (pair less control), slope against 400
#     Georgia Pro      1.054   0.907                            1.019   0.855
#     Serrif           1.021   0.875                            1.006   0.926
#     Source Serif 4   1.080   0.752                            1.072   0.557
#     Literata         1.065   0.823                            1.072   0.661
#
# In the two faces Area's fit follows, a pair's departure from the control scales as the control white does: Bold
# slope 0.891 against nn 0.891 (the means), Light 1.013 against 1.038. So the rule: every pair's white in a master is
# the Regular's white times the master's own control white over the Regular's (nn for two lowercase, HH for two
# capitals, Hn and nH mixed; punctuation counts as lowercase, figures by 00). Read on each master's own outlines, so
# a serif that grows, a diagonal that thickens or a bearing that tightens is measured, not assumed:
#
#     k_M(pair) = s_M * (N_R + k_R) - N_M        N: the pair's white unkerned (fit.py's mean over the rows both
#                                                inks share, each no deeper than DEPTH behind its outermost ink)
#
# A kerning key that covers many pairs (a class) takes the mean over its letters (accented forms kern as their
# letter, so the letter stands for its family). Then, as for the Regular, every pair that stands outside both
# references at the same weight (Georgia Pro Light or Bold, Serrif 300 or 700) by KERN_MIN or more is moved to the
# nearer (fit_kerning.json "masters"; AREA_KERN_FIT=1 measures them again). Last the collision passes, with the
# floor scaled the same way: MIN_GAP * s_M (Serrif, the reference that holds a floor, keeps 9.5 / 9.4 / 6.0 units at
# the 2nd percentile of its closest pairs, 15.6 / 17.8 / 14.8 at the 10th: it falls towards the Bold with the white,
# not with the hairline, which rises). The three masters keep one set of keys: a key one master lacks takes the
# value that master's classes give it.
O_STEP = 10
O_ROWS = list(range(-240, 801, O_STEP))
O_DEPTH = {"l": 80, "u": 105}                  # fit.py's DEPTH: 0.15 of the x-height and of the cap height
KERN_MIN = 8                                   # fit.py's: a pair moves when off both references by this much
CONTROLS = {"ll": ("n", "n"), "lu": ("n", "H"), "ul": ("H", "n"), "uu": ("H", "H"), "00": ("zero", "zero")}
MASTER_FIT = "masters"                         # fit_kerning.json's section for the Light and the Bold


def glyph_case(font, name, _cache={}):
    """'l' (lowercase), 'u' (capitals), '0' (figures) or 'p' (punctuation and signs), from the glyph's character or,
    for an alternate, its base's."""
    import unicodedata
    key = (id(font), name)
    if key not in _cache:
        base = name.split(".")[0]
        us = list(font[name].unicodes) or (list(font[base].unicodes) if base in font else [])
        cat = unicodedata.category(chr(us[0])) if us else "Ll" if len(base) == 1 or "_" in base else "Po"
        _cache[key] = "0" if cat == "Nd" or base in FIGS else "u" if cat in ("Lu", "Lt") else "l" if cat[0] == "L" else "p"
    return _cache[key]


def optical_profile(font, name):
    """Left and right white per row on fit.py's rows (nan where the row has no ink), and the same capped DEPTH
    behind the outermost ink in the glyph's zone (fit.capped: x-height for the lowercase, cap height for capitals
    and figures, every row for punctuation)."""
    import numpy as np
    cs = _flat(font[name], font)
    w = font[name].width
    L = np.full(len(O_ROWS), np.nan)
    R = np.full(len(O_ROWS), np.nan)
    for i, y in enumerate(O_ROWS):
        e = _edges(cs, y + 3.33)                 # _edges adds 0.37: fit.py reads at y + 3.7
        if e:
            L[i], R[i] = e[0], w - e[1]
    case = glyph_case(font, name)
    z = {"l": (10, 510), "u": (10, 700), "0": (10, 700)}.get(case)
    ink = ~np.isnan(L)
    zr = ink & np.array([z is None or z[0] <= y <= z[1] for y in O_ROWS])
    if not zr.any():
        zr = ink
    if not zr.any():
        return L, R, L, R
    D = O_DEPTH["u" if case in ("u", "0") else "l"]
    return L, R, np.minimum(L, np.nanmin(L[zr]) + D), np.minimum(R, np.nanmin(R[zr]) + D)


class Optical:
    """fit.py's pair white on a UFO master, unkerned, for any two glyphs."""

    def __init__(self, font):
        self.font, self.p = font, {}

    def prof(self, n):
        if n not in self.p:
            self.p[n] = optical_profile(self.font, n) if (self.font[n].contours or self.font[n].components) else None
        return self.p[n]

    def white(self, a, b):
        import numpy as np
        pa, pb = self.prof(a), self.prof(b)
        if pa is None or pb is None:
            return None
        both = ~np.isnan(pa[1]) & ~np.isnan(pb[0])
        if not both.any():
            return None
        return float(np.mean(pa[3][both] + pb[2][both]))

    def control(self, a, b):
        ca, cb = (glyph_case(self.font, n).replace("p", "l") for n in (a, b))
        key = "00" if "0" in (ca, cb) else ca + cb
        return key, self.white(*CONTROLS[key])


def _group_maps(font):
    g1 = {m: k for k, ms in font.groups.items() if k.startswith("public.kern1.") for m in ms}
    g2 = {m: k for k, ms in font.groups.items() if k.startswith("public.kern2.") for m in ms}
    return g1, g2


def effective_key(kerning, g1, g2, a, b):
    """The kerning key that sets the pair a b (the UFO's order: glyph-glyph, glyph-class, class-glyph, class-class)."""
    for c in ((a, b), (a, g2.get(b)), (g1.get(a), b), (g1.get(a), g2.get(b))):
        if None not in c and c in kerning:
            return c
    return None


REP_MAX = 6


def representatives(font, key, g1, g2):
    """The pairs a key stands for and sets: its members that are core letters, figures or the measured punctuation
    (else its first REP_MAX members by name), paired, where this key is the one that applies."""
    core = set(LOWER + UPPER) | set(FIGS) | set(PUNCT)

    def members(side, k):
        if not k.startswith("public.kern"):
            return [k] if k in font else []
        ms = [m for m in font.groups.get(k, []) if m in font]
        c = sorted(m for m in ms if m in core)
        return c or sorted(ms)[:REP_MAX]
    A, B = members(1, key[0]), members(2, key[1])
    return [(a, b) for a in A for b in B if effective_key(font.kerning, g1, g2, a, b) == key]


def transfer(reg, master, scale=None):
    """The master's kerning from the Regular's by the rule above, on the master's own outlines. Returns
    ({key: value}, {control: s}, unmeasured keys)."""
    from fontTools.ufoLib.kerning import lookupKerningValue
    oR, oM = Optical(reg), Optical(master)
    s = {}
    for k, (a, b) in CONTROLS.items():
        if all(n in reg and n in master for n in (a, b)):
            s[k] = scale if scale is not None else oM.white(a, b) / oR.white(a, b)
    g1, g2 = _group_maps(reg)
    out, blind = {}, []
    for key, kr in sorted(reg.kerning.items()):
        vals = []
        for a, b in representatives(reg, key, g1, g2):
            if a not in master or b not in master:
                continue
            nr, nm = oR.white(a, b), oM.white(a, b)
            if nr is None or nm is None:
                continue
            ctl, _ = oR.control(a, b)
            k_r = lookupKerningValue((a, b), reg.kerning, reg.groups) or 0
            vals.append(s[ctl] * (nr + k_r) - nm)
        if vals:
            out[key] = round(sum(vals) / len(vals))
        else:                                    # no row both inks share (a quote and a period): the value scales
            reps = representatives(reg, key, g1, g2) or [(None, None)]
            a, b = reps[0]
            ctl = oR.control(a, b)[0] if a else "ll"
            out[key] = round(kr * s[ctl])
            blind.append(key)
    return out, s, blind


def master_floor(s):
    """The collision floor in a master: MIN_GAP times the master's control white over the Regular's."""
    return MIN_GAP * s["ll"]


def alternates_of(font):
    cats = font.lib.get("public.openTypeCategories", {})
    return sorted(g.name for g in font if not g.unicodes and "." in g.name and g.width > 0 and cats.get(g.name) != "mark"
                  and not any(t in g.name for t in (".tf", ".case", "comb", ".locl", ".notdef", ".alt"))
                  and (g.contours or g.components))


def open_master(font, codepoints, floor, alts=()):
    """open_all and alternates.kern_and_open in one pass, at a master's floor: every glyph of the set and every
    alternate, no two inks closer than `floor` (rows -280 to 1080, one row of slack up and down)."""
    import numpy as np
    import unicodedata
    from fontTools.ufoLib.kerning import lookupKerningValue
    want = set(codepoints)
    cats = font.lib.get("public.openTypeCategories", {})
    names = [g.name for g in font if any(u in want for u in g.unicodes) and (g.contours or g.components)
             and g.width > 0 and cats.get(g.name) != "mark" and not NO_COLLISION & set(g.unicodes)
             and not any(unicodedata.category(chr(u)) in ("Mn", "Mc", "Lm", "Sk") for u in g.unicodes)]
    names += [a for a in alts if a in font and a not in names]
    R, L = edge_rows(font, names)
    names = [n for n in names if n in R]
    Lm = np.stack([L[n] for n in names])
    core = set(LOWER + UPPER) | set(FIGS) | set(PUNCT)
    g1, g2 = _group_maps(font)

    def alone(name, g):                      # the class that is this letter and its family alone
        k = g.get(name)
        return k if k and sum(1 for m in font.groups[k] if m in core) == 1 else name
    opened = []
    reach = max(80, -min(font.kerning.values(), default=0))  # open_all's 80 missed T atilde.ss03 (natural 92, kern -95)
    # first the letters, figures and punctuation: on the key their family shares (as the Regular's open_collisions
    # and kern_families leave them), then every glyph of the set, by exception where it needs more than its letter
    for first in (True, False):
        for a in names:
            if first and a not in core:
                continue
            gaps = (Lm + R[a]).min(axis=1)
            for j in np.where(gaps < floor + reach)[0]:
                b = names[j]
                if first and b not in core:
                    continue
                k = lookupKerningValue((a, b), font.kerning, font.groups) or 0
                gap = float(gaps[j]) + k
                if gap < floor:
                    add = round(floor - gap)
                    if add >= 4:
                        key = (alone(a, g1), alone(b, g2)) if first else (a, b)
                        font.kerning[key] = k + add
                        if (lookupKerningValue((a, b), font.kerning, font.groups) or 0) != k + add:
                            font.kerning[(a, b)] = k + add
                        opened.append((a, b, round(gap), k + add))
    return opened


def edge_rows(font, names):
    """{name: right white per row}, {name: left white per row, the least of three rows}: open_all's reading."""
    import numpy as np
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
    return R, L


def f_dots_master(font, s):
    """f before a dot, the Regular's rule (F_DOT, F_ACCENT) with the white scaled."""
    global F_DOT, F_ACCENT
    keep = F_DOT, F_ACCENT
    F_DOT, F_ACCENT = round(keep[0] * s), round(keep[1] * s)
    try:
        return f_before_dots(font)
    finally:
        F_DOT, F_ACCENT = keep


def master_fit_table():
    import json
    import os
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), FIT)
    return json.load(open(path)).get(MASTER_FIT, {}) if os.path.exists(path) else {}


def kern_master(reg, master, style, codepoints, fit_fn=None, reg_shapes=None, base=None):
    """The master's kerning, replacing what it has: the Regular's carried by the rule (transfer), the same-weight fit
    (fit_fn(master) measures it, else fit_kerning.json's stored "masters" values), the collision passes at the
    master's floor. Returns a report dict ("fit": the same-weight changes applied, to store)."""
    vals, s, blind = transfer(reg, master)
    master.groups.clear()
    master.groups.update({k: list(v) for k, v in reg.groups.items()})
    master.kerning.clear()
    master.kerning.update(vals)
    fit = fit_fn(master) if fit_fn else master_fit_table().get(style, [])
    fitted = 0
    for a, b, d in fit:
        if (a.startswith("public.") and a not in master.groups) or (b.startswith("public.") and b not in master.groups):
            continue
        master.kerning[(a, b)] = master.kerning.get((a, b), 0) + d
        fitted += 1
    floor = master_floor(s)
    opened = open_master(master, codepoints, floor, alternates_of(master))
    dots = f_dots_master(master, s["ll"])
    import bold as B
    stems = dict(B.axis_map(B.STEM, B.LIGHT_WEIGHTS + B.WEIGHTS))
    between = open_between(reg, master, style, codepoints, stems.__getitem__, reg_shapes, base)
    return dict(style=style, scale=s, floor=floor, transferred=len(vals), blind=len(blind), fitted=fitted, fit=fit,
                opened=len(opened), dots=dots, opened_pairs=opened, between=between)


def equalize(fonts):
    """One set of keys in every master: a key a master lacks takes the value its own classes give that pair."""
    from fontTools.ufoLib.kerning import lookupKerningValue
    keys = set()
    for f in fonts:
        keys |= set(f.kerning.keys())
    added = 0
    for f in fonts:
        missing = [k for k in keys if k not in f.kerning]
        for k in missing:
            f.kerning[k] = lookupKerningValue(k, f.kerning, f.groups) or 0 if not (k[0].startswith("public.") or k[1].startswith("public.")) \
                else _class_value(f, k)
        added += len(missing)
    return added


def _class_value(f, k):
    """What a group key's pairs are set to in a font that does not have the key: its first member pair's lookup
    with this key absent (a class-class key absent is 0; a glyph-class key falls to the class-class)."""
    from fontTools.ufoLib.kerning import lookupKerningValue
    a = f.groups[k[0]][0] if k[0].startswith("public.") and f.groups.get(k[0]) else k[0]
    b = f.groups[k[1]][0] if k[1].startswith("public.") and f.groups.get(k[1]) else k[1]
    g1, g2 = _group_maps(f)
    # the keys that could set a b, in order, after k itself
    order = [(a, b), (a, g2.get(b)), (g1.get(a), b), (g1.get(a), g2.get(b))]
    i = order.index(k) if k in order else 0
    for c in order[i + 1:]:
        if None not in c and c in f.kerning:
            return f.kerning[c]
    return 0


# The Light's side bearings (0.81) are bold.bearing_change's (light_bearings.json), one path for every master.


# Between the masters (0.81, audit_kern found it). A pair clear in both masters can still close up between them: a
# row's edge is not linear in the weight where an outline also moves up or down (a mark rising over a Bold letter,
# the Bold's mid master for g and the quotes), so the least white is not the masters' chord. At 350 (the Light's
# side) and 550 (the Bold's mid master) the instance is built from the masters' points and the same collision pass
# runs on it, at that instance's own floor; a pair short there by 4 or more takes the change in the master that brings
# the interpolated value up to the floor (the change divided by the instance's share of the master).
# 0.82 (owner round 8, axis): weights on the 0.82 axis (weightaxis.py); the same design places as 0.81's 350 / 300
# and 550 / 700 (the Bold master is 800 now, its mid master 600: stems 104.5 and 140 as before).
BETWEEN = {"Light": (350, 300), "Bold": (600, 800), "ExtraLight": (250, 200), "Thin": (200, 100)}
# 0.82 (axis B): the lightest master's pass is between the Light and it (the variable font's segment there), half way
BETWEEN_BASE = {"ExtraLight": 300, "Thin": 300}


def instance(reg, master, t, mid=None):
    """A UFO between the Regular (t = 0) and the master (t = 1), point by point; a glyph the master's mid layer holds
    (at t) is that layer's. Glyphs whose structures differ keep the master's outline."""
    import ufoLib2
    from ufoLib2.objects import Component, Contour, Point
    out = ufoLib2.Font()
    lerp = lambda a, b: a + (b - a) * t
    for g in master:
        if g.name not in reg:
            continue
        r = reg[g.name]
        ng = out.newGlyph(g.name)
        ng.unicodes = list(g.unicodes)
        if mid is not None and g.name in mid:
            src = mid[g.name]
            ng.width = src.width
            for c in src.contours:
                nc = Contour()
                nc.points = [Point(p.x, p.y, p.type) for p in c.points]
                ng.contours.append(nc)
            for c in src.components:
                ng.components.append(Component(c.baseGlyph, c.transformation))
            continue
        same = len(r.contours) == len(g.contours) and all(len(a.points) == len(b.points) for a, b in zip(r.contours, g.contours)) \
            and [c.baseGlyph for c in r.components] == [c.baseGlyph for c in g.components]
        a_, b_ = (r, g) if same else (g, g)
        ng.width = lerp(a_.width, b_.width)
        for ca, cb in zip(a_.contours, b_.contours):
            nc = Contour()
            nc.points = [Point(lerp(p.x, q.x), lerp(p.y, q.y), q.type) for p, q in zip(ca.points, cb.points)]
            ng.contours.append(nc)
        for ca, cb in zip(a_.components, b_.components):
            ta, tb = tuple(ca.transformation), tuple(cb.transformation)
            ng.components.append(Component(cb.baseGlyph, tuple(lerp(x, y) for x, y in zip(ta, tb))))
    out.lib["public.openTypeCategories"] = dict(master.lib.get("public.openTypeCategories", {}))
    return out


def open_between(reg, master, style, codepoints, stem_of, reg_shapes=None, base=None):
    """The collision pass at the weight between the Regular and the master (BETWEEN), on the master's values.
    reg_shapes: the Regular as the variable font's default master (its struck glyphs as overlapping strokes, the
    structure the other masters have), for the outlines; the kerning is `reg`'s."""
    import numpy as np
    import unicodedata
    from fontTools.ufoLib.kerning import lookupKerningValue
    w, wm = BETWEEN[style]
    wb = BETWEEN_BASE.get(style, 400) if base is not None else 400   # base: the master on the segment's other end
    t = (stem_of(w) - stem_of(wb)) / (stem_of(wm) - stem_of(wb))
    import bold as B
    mid = master.layers["mid"] if "mid" in master.layers and abs(w - B.MID_WEIGHT) < 1 else None
    inst = instance(base if base is not None else (reg_shapes if reg_shapes is not None else reg), master, t, mid)
    kbase = base if base is not None else reg
    floor = MIN_GAP * Optical(inst).white("n", "n") / Optical(reg).white("n", "n")
    want = set(codepoints)
    cats = master.lib.get("public.openTypeCategories", {})
    names = [g.name for g in master if any(u in want for u in g.unicodes) and (g.contours or g.components)
             and g.width > 0 and cats.get(g.name) != "mark" and not NO_COLLISION & set(g.unicodes)
             and not any(unicodedata.category(chr(u)) in ("Mn", "Mc", "Lm", "Sk") for u in g.unicodes)]
    names += [a for a in alternates_of(master) if a not in names]
    names = [n for n in names if n in inst]
    R, L = edge_rows(inst, names)
    names = [n for n in names if n in R]
    Lm = np.stack([L[n] for n in names])
    reach = max(80, -min(list(master.kerning.values()) + list(reg.kerning.values()), default=0))
    opened = []
    for a in names:
        gaps = (Lm + R[a]).min(axis=1)
        for j in np.where(gaps < floor + reach)[0]:
            b = names[j]
            kr = lookupKerningValue((a, b), kbase.kerning, kbase.groups) or 0
            km = lookupKerningValue((a, b), master.kerning, master.groups) or 0
            gap = float(gaps[j]) + kr + (km - kr) * t
            if floor - gap >= 4:
                new = km + int(np.ceil((floor - gap) / t))
                master.kerning[(a, b)] = new
                opened.append((a, b, round(gap, 1), km, new))
    return dict(weight=w, t=t, floor=floor, opened=opened)
