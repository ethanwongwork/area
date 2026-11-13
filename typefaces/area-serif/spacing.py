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
TRACK = {"lower": 6, "upper": 3}      # units a side tighter than n's and H's bearings were
MAX_MOVE = 70
MIN_GAP = 22                  # ink never closer than this (Georgia Pro's rule: letters never touch)
WORD_SPACE = 250              # 287 until 0.38; 0.48 of the x-height
LOWER, UPPER = string.ascii_lowercase, string.ascii_uppercase
FIGS = "zero one two three four five six seven eight nine".split()
PUNCT = ["period", "comma", "hyphen", "quotesingle", "quoteright"]
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
        dl, dr = (max(-MAX_MOVE, min(MAX_MOVE, round(REFERENCE[name][i] + o - measured[name][i]))) for i in (0, 1))
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
    cls = lambda n: "lower" if n in LOWER else "upper"
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


def run(font):
    delta = space(font)
    moved = rekern(font, delta)
    opened = open_collisions(font)
    return delta, moved, opened
