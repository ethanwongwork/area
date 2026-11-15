"""Alternates built from finished parts (0.81; owner, 2026-11-14: "for the alternate glyphs, for now keep and refine
all of them as long as you think they are worth including in the full set ... exploring better ways to design the
alternate a"). Runs in normalize after charset (which builds g.ss02), on the finished Regular; the Light and Bold
take these glyphs through bold.py's engine like any other letter.

  a.ss03     single-storey a: a bowl of the b d p q construction narrowed across its counter, q's spur at the top,
             the two-storey a's curled exit at the foot (`single_a`, form "d"; the exploration's other forms are
             kept here for tools/alt_candidates.py)
  l.ss04     tailed l: l's flag and stem on t's hook (`tailed_l`)
  zero.zero  slashed zero, its stroke the figures' hairline, inside the oval (`slashed_zero`); zero.tf.zero
  zero.ss05  dotted zero, the period's dot at the counter's centre (`dotted_zero`); zero.tf.ss05
  seven.ss06, z.ss06   barred: a level bar of the class's hairline through the diagonal (`barred`)
Their accented and ligated forms are composed or rebuilt here from these, never drawn.
"""
import math

import charset as C
import parts as PARTS


def _pts(c):
    return [(p.x, p.y, p.type, p.smooth) for p in c.points]


def _outer(g):
    return max(g.contours, key=lambda c: len(c.points))


def _inner(g):
    return min(g.contours, key=lambda c: len(c.points))


def _set(g, lists):
    from ufoLib2.objects import Contour, Point
    g.clearContours()
    for P in lists:
        c = Contour()
        c.points = [Point(round(x), round(y), t, smooth=s) for x, y, t, s in P]
        g.contours.append(c)


# ------------------------------------------------------------------------------------------- single-storey a
# Measured (tools/single_a.py) on the faces that have the letter, each against its own letters:
#                   advance/n  ink/o  bowl/d  stem top/x-height  exit past the stem (stems)  colour/two-storey a
#   Serrif ss01       0.971    1.110  1.000       1.006               0.95 (a flat foot)          1.091
#   Source Serif 4    0.919    1.142  1.011       1.027               1.13 (a curled exit)        1.084
#   Literata          0.944    1.130  1.000       1.028               1.05 (a curled exit)        1.117
# All three take d's bowl whole. Area's two-storey a is narrower than theirs (its advance 0.87 of n's, their mean
# two-storey a 0.92), so d's bowl with any exit makes Area's single-storey a 0.99 to 1.02 of n, a d with its
# ascender cut (the 0.80 candidate). The exploration (img/081/a-exploration.png):
#   a  d's bowl, q's spur, the two-storey a's curled exit
#   b  a bowl narrowed to the two-storey a's ink width, q's spur, d's flat foot
#   c  d's bowl, spurs at both ends (q's head, and the same turned over at the foot), no exit
#   d  (the choice) a bowl narrowed so the advance stands to n as the references' mean (0.945), q's spur, the
#      two-storey a's curled exit. It keeps the two-storey a's foot, so the alternate changes only the upper storey.
SINGLE_A_FORMS = {"a": (0, "spur", "curl"), "b": (None, "spur", "foot"), "c": (0, "spur", "spur"),
                  "d": ("ref", "spur", "curl")}
SINGLE_A = "d"
A_ADV_N = (0.971 + 0.919 + 0.944) / 3          # 0.945: the references' advance over n's


def _narrow_bowl(font, delta):
    """q with its bowl narrowed by delta across the counter: parts.bowl's construction with the far extremes
    (outer 414, counter 332 from the stem) brought in by delta and the top and bottom extremes kept at their share
    of the width; the stroke at the side, the hairlines, the joins and the spur are the construction's own."""
    tmp = "_q_narrow"
    if tmp in font:
        del font[tmp]
    g = font.newGlyph(tmp)
    _set(g, [_pts(c) for c in font["q"].contours])
    g.width = font["q"].width
    saved = {k: getattr(PARTS, k) for k in ("DXO_T", "DXO_S", "DXC_T", "DXC_S", "Y_BRANCH", "Y_RUN")}
    try:
        k_o = (PARTS.DXO_S - delta) / PARTS.DXO_S
        k_c = (PARTS.DXC_S - delta) / PARTS.DXC_S
        PARTS.DXO_S, PARTS.DXC_S = saved["DXO_S"] - delta, saved["DXC_S"] - delta
        PARTS.DXO_T, PARTS.DXC_T = round(saved["DXO_T"] * k_o), round(saved["DXC_T"] * k_c)
        PARTS.Y_BRANCH = PARTS.solve(PARTS._near_quarter_top(), PARTS.NECK_BRANCH, 0, PARTS.YS_HI + 20, PARTS.X)
        PARTS.Y_RUN = PARTS.solve(PARTS._near_quarter_top(), PARTS.NECK_RUN, 0, PARTS.YS_HI + 20, PARTS.X)
        PARTS.bowl(font, tmp, -1, "spur", "branch")
    finally:
        for k, v in saved.items():
            setattr(PARTS, k, v)
    out = [_pts(c) for c in g.contours]
    del font[tmp]
    return out


def _q_upper(q_outer):
    """q's outline from the top of its stem's right edge round the spur and the bowl to the crotch."""
    n = len(q_outer)
    top = C._edge_top(q_outer)
    crotch = next(i for i in range(top, top + n) if q_outer[i % n][2] and q_outer[(i + 1) % n][2] == "line"
                  and q_outer[(i + 1) % n][0] == q_outer[i % n][0] and q_outer[(i + 1) % n][1] < 0 and i != top)
    return [q_outer[i % n] for i in range(top, crotch + 1)]


def _a_curl(font, stem_l):
    """The two-storey a's foot: from its crotch round the curled exit to the foot of its stem's right edge, moved
    whole so its stem's left edge is stem_l."""
    A = _pts(_outer(font["a"]))
    n = len(A)
    xe = max(p[0] for p in _pts(_inner(font["a"])))            # a's stem's left edge is its counter's right
    k = next(i for i, p in enumerate(A) if p[2] and not p[3] and abs(p[0] - xe) <= 1 and 40 < p[1] < 160)
    xr = xe + PARTS.S
    e = next(i for i in range(k + 1, k + n) if A[i % n][2] and A[i % n][0] == xr and A[(i + 1) % n][2] == "line")
    dx = stem_l - xe
    return [(A[i % n][0] + dx, A[i % n][1], A[i % n][2], A[i % n][3]) for i in range(k + 1, e + 1)], 568 - 550


def _d_foot(font):
    D = _pts(_outer(font["d"]))
    n = len(D)
    xe = max(p[0] for p in _pts(_inner(font["d"])))
    k = next(i for i, p in enumerate(D) if p[2] and not p[3] and p[0] == xe and 40 < p[1] < 160)
    e = next(i for i in range(k + 1, k + n) if D[i % n][2] and D[i % n][0] == xe + PARTS.S and D[(i + 1) % n][2] == "line"
             and D[(i + 1) % n][1] > 500)
    return [D[i % n] for i in range(k + 1, e + 1)], xe


def single_a_points(font, form=None):
    """(contours, advance) of a single-storey a of the given form (SINGLE_A_FORMS)."""
    form = form or SINGLE_A
    delta, top, exit_ = SINGLE_A_FORMS[form]
    q = font["q"]
    q_lists = [_pts(c) for c in q.contours]
    xs_q = [p[0] for c in q_lists for p in c]
    lsb = min(xs_q)                                        # q's left side: the bowl's outer extreme
    stem_l = max(p[0] for p in min(q_lists, key=len))     # q's stem's left edge
    stem_r = stem_l + PARTS.S
    curl_rsb = font["a"].width - max(p.x for c in font["a"].contours for p in c.points)
    if delta == "ref":                                     # the references' advance over n's
        curl, _r = _a_curl(font, stem_l)
        reach = max(p[0] for p in curl) - stem_r
        want = A_ADV_N * font["n"].width
        delta = round((stem_r + reach + curl_rsb) - want)
    elif delta is None:                                    # the two-storey a's ink width
        foot, _x = _d_foot(font)
        reach = max(p[0] for p in foot) - stem_r
        a_ink = max(p.x for c in font["a"].contours for p in c.points) - min(p.x for c in font["a"].contours for p in c.points)
        delta = round((stem_r + reach - lsb) - a_ink)
    lists = _narrow_bowl(font, delta) if delta else q_lists
    outer = max(lists, key=len)
    counter = min(lists, key=len)
    upper = _q_upper(outer)
    if exit_ == "curl":
        tail, _r = _a_curl(font, stem_l)
        pts = upper + tail
        width = max(p[0] for p in pts) + curl_rsb
    elif exit_ == "foot":
        tail, _x = _d_foot(font)
        pts = upper + tail
        width = max(p[0] for p in pts) + (font["d"].width - max(p.x for c in font["d"].contours for p in c.points))
    else:                                                  # the spur turned over: q's head about the mid-height
        n = len(upper)
        b = min((i for i, p in enumerate(upper) if p[2]), key=lambda i: upper[i][1])
        head = upper[:upper.index(next(p for p in upper[1:] if p[2] and p[1] > 500 and p[3])) + 1]   # stem top .. bowl top
        X = PARTS.X
        turned = [(x, X - y, t, s) for x, y, t, s in head]
        # from the bowl's lowest point back to the stem: the head's points in reverse, each segment's type moved to
        # the node that now ends it
        seq = []
        for j in range(len(turned) - 2, -1, -1):          # from the bowl's lowest point back to the stem
            x, y, t, sm = turned[j]
            if t:                                          # a node takes the type of the segment that now ends at it,
                t = next(q[2] for q in turned[j + 1:] if q[2])   # which ran from it to the next node before
            seq.append((x, y, t, sm))
        pts = upper[:b + 1] + seq
        width = q.width
    # a narrowed bowl moves the left side in: the letter moves back to q's left side bearing
    lists = [pts, counter]
    if delta:
        lists = [[(x - delta, y, t, sm) for x, y, t, sm in P] for P in lists]
        width -= delta
    return lists, width, lsb


def single_a(font, name="a.ss03", form=None):
    lists, width, _l = single_a_points(font, form)
    g = font[name] if name in font else font.newGlyph(name)
    _set(g, lists)
    g.width = width
    g.unicodes = []
    return f"{name}: form {form or SINGLE_A}, advance {width} ({width / font['n'].width:.3f} of n)"


# ------------------------------------------------------------------------------------------------ tailed l
# l's flag and stem on t's hook (owner's set: tells l from I and 1). The hook is t's own part, moved whole to l's
# stem: from the stem's left edge where t's straight run ends, round the bottom, up to the hook's cut end and back to
# the stem's right edge. t's stem is 79 and l's 78 (balance: t 79), so the hook's last node and its handle on the
# stem's right edge go one unit in with that edge. The same replacement makes the ligatures' l (fl, ffl).
def _t_hook(font):
    T = _pts(_outer(font["t"]))
    n = len(T)
    a = next(i for i, p in enumerate(T) if p[2] == "line" and p[3] and T[i - 1][2] and T[i - 1][0] == p[0] and p[1] < 200)
    b = next(i for i in range(a + 1, a + n) if T[i % n][2] and T[i % n][3] and T[(i + 1) % n][2] == "line"
             and T[(i + 1) % n][0] == T[i % n][0] and T[(i + 1) % n][1] > T[i % n][1])
    hook = [list(T[i % n]) for i in range(a, b + 1)]
    return hook, hook[0][0], hook[-1][0], font["t"].width - max(p[0] for p in T)


def _tail_stem(P, xl, xr, hook, hx0, hx1):
    """P with the foot of the stem whose edges are xl and xr replaced by the hook: from the left edge's lower end
    (a line node at the foot's top) to the right edge's (a smooth curve node), as t's."""
    n = len(P)
    i0 = next(i for i, p in enumerate(P) if p[0] == xl and p[2] == "line" and p[1] < 200 and P[i - 1][2] and P[i - 1][1] > p[1])
    i1 = next(i for i in range(i0 + 1, i0 + n) if P[i % n][0] == xr and P[i % n][2] and P[i % n][1] < 200
              and P[(i + 1) % n][2] == "line" and P[(i + 1) % n][1] > P[i % n][1])
    dx = xl - hx0
    H = [[p[0] + dx, p[1], p[2], p[3]] for p in hook]
    off = (xr - xl) - (hx1 - hx0)                           # the stems' widths differ by a unit
    for p in H[-3:]:
        if p[0] == hx1 + dx:                               # the node and handle on the stem's right edge
            p[0] += off
    keep = [P[(i1 + 1 + k) % n] for k in range((i0 - i1 - 1) % n)]
    return keep + [tuple(p) for p in H]


def tailed_l(font, name="l.ss04"):
    hook, hx0, hx1, t_rsb = _t_hook(font)
    L = _pts(_outer(font["l"]))
    xr = max(p[0] for p in L if p[2] == "line" and p[1] > 700)                 # the stem's right edge at the top
    xl = xr - PARTS.S
    pts = _tail_stem(L, xl, xr, hook, hx0, hx1)
    g = font[name] if name in font else font.newGlyph(name)
    _set(g, [pts])
    g.width = round(max(p[0] for p in pts) + t_rsb)
    g.unicodes = []
    return f"{name}: l's stem on t's hook, advance {g.width}"


def tailed_ligature(font, name, new):
    """fl and ffl with the l's foot on t's hook (the last stem of the ligature)."""
    hook, hx0, hx1, t_rsb = _t_hook(font)
    P = _pts(_outer(font[name]))
    xr = max(p[0] for p in P if p[2] == "line" and p[1] > 700)
    xl = xr - PARTS.S
    pts = _tail_stem(P, xl, xr, hook, hx0, hx1)
    g = font[new] if new in font else font.newGlyph(new)
    _set(g, [pts] + [_pts(c) for c in font[name].contours if c is not _outer(font[name])])
    g.width = round(max(p[0] for p in pts) + t_rsb)
    g.unicodes = []
    return new


# ------------------------------------------------------------------------------------------------- zeros
def slashed_zero(font, name="zero.zero"):
    """The zero and a stroke of its own hairline (its top and bottom, 47) across the counter from corner to corner,
    cut at the oval's outside so no end shows."""
    from fontTools.pens.pointPen import PointToSegmentPen
    import pathops
    z = C.gp(font, "zero")
    out_c, in_c = (_pts(c) for c in sorted(font["zero"].contours, key=lambda c: -max(p.y for p in c.points)))
    hair = max(p[1] for p in out_c) - max(p[1] for p in in_c)
    x0, x1 = min(p[0] for p in in_c), max(p[0] for p in in_c)
    y0, y1 = min(p[1] for p in in_c), max(p[1] for p in in_c)
    dx, dy = x1 - x0, y1 - y0
    stroke = C.bar((x0 - dx, y0 - dy), (x1 + dx, y1 + dy), hair)
    outer = pathops.Path()
    _outer(font["zero"]).drawPoints(PointToSegmentPen(outer.getPen()))
    cut = pathops.op(stroke, outer, pathops.PathOp.INTERSECTION, fix_winding=True, keep_starting_points=False)
    C.put(font, name, C.union(z, cut), font["zero"].width)
    font[name].unicodes = []
    return f"{name}: stroke {hair}"


def dotted_zero(font, name="zero.ss05"):
    """The zero and a round dot at its counter's centre, as wide as the zero's side stroke (its heaviest: the dot is
    no darker than the figure)."""
    out_c, in_c = (_pts(c) for c in sorted(font["zero"].contours, key=lambda c: -max(p.y for p in c.points)))
    cx = (min(p[0] for p in in_c) + max(p[0] for p in in_c)) / 2
    cy = (min(p[1] for p in in_c) + max(p[1] for p in in_c)) / 2
    side = min(p[0] for p in in_c) - min(p[0] for p in out_c)
    r = side / 2
    C.put(font, name, C.union(C.gp(font, "zero"), C.ellipse(cx, cy, r, r)), font["zero"].width)
    font[name].unicodes = []
    return f"{name}: dot {side}"


# ------------------------------------------------------------------------------------------------ barred 7 and z
BAR_SHARE = 0.5          # the bar's length, of the glyph's top arm (centred on the diagonal at half its height)


def barred(font, base, name, hair):
    p = C.gp(font, base)
    b = C.bounds(p)
    y = (b[1] + b[3]) / 2
    arm = C.scan_h(p, b[3] - hair / 2)[-1]
    L = BAR_SHARE * (arm[1] - arm[0])
    sp = C.scan_h(p, y)
    s = max(sp, key=lambda q: q[1] - q[0])
    cx = (s[0] + s[1]) / 2
    C.put(font, name, C.union(p, C.rect(cx - L / 2, y - hair / 2, cx + L / 2, y + hair / 2)), font[base].width)
    font[name].unicodes = []
    return f"{name}: bar {hair} x {L:.0f}"


# ------------------------------------------------------------------------------------------------ families
def _body_cx(font, name):
    """The centre of a's or ɑ's bowl and stem: from the ink's left to the stem's right edge (the exit is a terminal)."""
    g = C.gp(font, name)
    row = C.scan_h(g, 260)
    return (row[0][0] + row[-1][1]) / 2, row[-1][1], C.bounds(g)


RIGHT_MARKS = {"ogonek", "ringhalfright"}
BELOW_MARKS = {"dotbelow", "ringbelowcomb"}


def a_family(font):
    """Every accented a (a composite on a) again on a.ss03: top marks centred on the body as a's are on its own
    (a's offset from its body's centre kept), marks below likewise, the ogonek and right half ring at the foot's
    right as a's are."""
    a_cx, a_r, a_b = _body_cx(font, "a")
    s_cx, s_r, s_b = _body_cx(font, "a.ss03")
    out = []
    for g in list(font):
        if not g.components or g.components[0].baseGlyph != "a" or not g.unicodes or g.name.endswith(".ss03"):
            continue
        parts = [("a.ss03", 0, 0)]
        for c in g.components[1:]:
            t = c.transformation
            if c.baseGlyph in RIGHT_MARKS:
                dx = s_b[2] - a_b[2]
            else:
                dx = s_cx - a_cx
            parts.append((c.baseGlyph, t[4] + round(dx), t[5]))
        C.compose(font, g.name + ".ss03", parts, font["a.ss03"].width)
        font[g.name + ".ss03"].unicodes = []
        out.append(g.name)
    return out


def l_family(font):
    out = []
    for g in list(font):
        if g.components and g.components[0].baseGlyph == "l" and g.unicodes and len(g.components) <= 3:
            parts = [("l.ss04", 0, 0)] + [(c.baseGlyph, c.transformation[4], c.transformation[5]) for c in g.components[1:]]
            C.compose(font, g.name + ".ss04", parts, font["l.ss04"].width + (g.width - font["l"].width))
            font[g.name + ".ss04"].unicodes = []
            out.append(g.name)
    # ł: the slash of lslash, on the tailed l
    base, yc, run, rise = C.SLASHES["lslash"]
    b = C.gp(font, "l.ss04")
    m = C.M(font)
    st = [s for s in C.scan_h(b, yc * C.X_HEIGHT) if s[1] - s[0] < m.stem * 1.4][0]
    cx = (st[0] + st[1]) / 2
    d = run * m.stem
    C.put(font, "lslash.ss04", C.union(b, C.bar((cx - d, yc * C.X_HEIGHT - d * rise), (cx + d, yc * C.X_HEIGHT + d * rise), m.low_bar)),
          font["l.ss04"].width)
    font["lslash.ss04"].unicodes = []
    out.append("lslash")
    for lig in ("fl", "f_f_l"):
        if lig in font:
            tailed_ligature(font, lig, lig + ".ss04")
            out.append(lig)
    return out


# ------------------------------------------------------------------------------------------------ features
SETS = {  # tag: (name in the name table, [(base, alternate)])
    "ss03": "Single-storey a",
    "ss04": "Tailed l",
    "ss05": "Dotted zero",
    "ss06": "Barred seven and z",
}


def features(font, subs):
    """The sets' features, written whole (derive writes `sub base by alt` for ALTS; this adds the families):
    subs {tag: [(base, alt)]}. A stylistic set gets its name; `zero` has none by the spec."""
    import re
    fea = font.features.text
    for tag, pairs in subs.items():
        fea = re.sub(r"\nfeature %s \{.*?\} %s;\n" % (tag, tag), "\n", fea, flags=re.S)
        body = "\n".join(f"  sub {a} by {b};" for a, b in pairs if a in font and b in font)
        name = f'  featureNames {{ name "{SETS[tag]}"; }};\n' if tag in SETS else ""
        fea += f"\nfeature {tag} {{\n{name}{body}\n}} {tag};\n"
    font.features.text = fea


def kern_and_open(font, alts, codepoints):
    """Kerning for the alternates: each takes the classes of the letters it is made from (C.kern_like), then the
    collision pass (spacing.open_all's) over every pair with an alternate on either side, so no two inks stand closer
    than spacing.MIN_GAP."""
    import numpy as np
    import spacing as SP
    import unicodedata
    from fontTools.ufoLib.kerning import lookupKerningValue
    want = set(codepoints)
    cats = font.lib.get("public.openTypeCategories", {})
    base = [g.name for g in font if any(u in want for u in g.unicodes) and (g.contours or g.components)
            and g.width > 0 and cats.get(g.name) != "mark" and not SP.NO_COLLISION & set(g.unicodes)
            and not any(unicodedata.category(chr(u)) in ("Mn", "Mc", "Lm", "Sk") for u in g.unicodes)]
    names = base + [a for a in alts if a in font and ".tf" not in a]      # tabular figures are never kerned
    ys = list(range(-280, 1081, SP.STEP))
    R, L = {}, {}
    for n in names:
        cs = SP._flat(font[n], font)
        if not cs:
            continue
        r = np.full(len(ys), np.inf)
        l = np.full(len(ys), np.inf)
        w = font[n].width
        for i, y in enumerate(ys):
            e = SP._edges(cs, y)
            if e:
                l[i], r[i] = e[0], w - e[1]
        l3 = np.minimum(l, np.minimum(np.roll(l, 1), np.roll(l, -1)))
        l3[0], l3[-1] = min(l[0], l[1]), min(l[-1], l[-2])
        R[n], L[n] = r, l3
    names = [n for n in names if n in R]
    opened = []
    alt_set = set(alts)
    for a in names:
        for b in names:
            if a not in alt_set and b not in alt_set:
                continue
            gap = float((L[b] + R[a]).min())
            if gap >= SP.MIN_GAP + 80:
                continue
            k = lookupKerningValue((a, b), font.kerning, font.groups) or 0
            if gap + k < SP.MIN_GAP:
                add = round(SP.MIN_GAP - gap - k)
                if add >= 4:
                    font.kerning[(a, b)] = k + add
                    opened.append((a, b, round(gap + k), k + add))
    return opened


def run(font):
    """Builds every alternate of 0.81 on the finished Regular. Returns report lines."""
    rep = [single_a(font), tailed_l(font), slashed_zero(font), dotted_zero(font),
           barred(font, "seven", "seven.ss06", C.STROKE_UP), barred(font, "z", "z.ss06", C.STROKE_LOW)]
    a_acc = a_family(font)
    l_acc = l_family(font)
    for name, tf in (("zero.zero", "zero.tf.zero"), ("zero.ss05", "zero.tf.ss05"), ("seven.ss06", "seven.tf.ss06")):
        if "zero.tf" in font or "seven.tf" in font:
            src = font[tf.split(".")[0] + ".tf"]
            dx = src.components[0].transformation[4] if src.components else 0
            C.compose(font, tf, [(name, dx, 0)], src.width)
            font[tf].unicodes = []
    for g in list(font):                                   # ź ž ż ẑ ẓ ẕ on the barred z
        if g.components and g.components[0].baseGlyph == "z" and g.unicodes and not g.name.startswith("d"):
            C.compose(font, g.name + ".ss06", [("z.ss06", 0, 0)] + [(c.baseGlyph, c.transformation[4], c.transformation[5])
                                                                     for c in g.components[1:]], g.width)
            font[g.name + ".ss06"].unicodes = []
    subs = {"ss03": [("a", "a.ss03")] + [(n, n + ".ss03") for n in a_acc],
            "ss04": [("l", "l.ss04")] + [(n, n + ".ss04") for n in l_acc if n in font],
            "zero": [("zero", "zero.zero"), ("zero.tf", "zero.tf.zero")],
            "ss05": [("zero", "zero.ss05"), ("zero.tf", "zero.tf.ss05")],
            "ss06": [("seven", "seven.ss06"), ("seven.tf", "seven.tf.ss06"), ("z", "z.ss06")]
            + [(g.name[:-5], g.name) for g in font if g.name.endswith(".ss06") and g.name[0] == "z" and g.name != "z.ss06"]}
    features(font, subs)
    for name in ["a.ss03"] + [n + ".ss03" for n in a_acc]:
        C.kern_like(font, name, "d", "a")
    for name in ["l.ss04"] + [n + ".ss04" for n in l_acc if n not in ("fl", "f_f_l", "lj")]:
        C.kern_like(font, name, "l", "t")
    for lig in ("fl.ss04", "f_f_l.ss04"):
        if lig in font:
            C.kern_like(font, lig, "f", "t")
    if "lj.ss04" in font:
        C.kern_like(font, "lj.ss04", "l", "j")
    for name in ("zero.zero", "zero.ss05"):
        C.kern_like(font, name, "zero", "zero")
    C.kern_like(font, "seven.ss06", "seven", "seven")
    for g in list(font):
        if g.name.endswith(".ss06") and g.name[0] == "z":
            C.kern_like(font, g.name, "z", "z")
    rep.append(f"a: {len(a_acc)} accented forms; l: {', '.join(l_acc)}")
    return rep, subs
