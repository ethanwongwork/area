"""Evenness pass (0.36; owner, 2026-11-12: "audit area serif against georgia pro. i like how straight the lines are,
the thicks and thins are clean and even ... make each character cleaner, more straight/perpendicular lines, smooth
round curves ... theres something about area serif that just makes the forms feel more organic/inconsistent").

Measured on both faces (docs/research/serif-typeface-2026-11-10/evaluation-0.36.md): Georgia Pro holds one value for
each of these across the set, and Area held several. No shape is replaced here: each rule brings a spread to one
value. Georgia Pro is measured only; every point is Area's own.

  true_lines     a line 1-3 units off upright or level becomes exact
  shoulders      n h m: the arch meets the right stem at one height, with one curve
  thin_floor     the thinnest point of each arch and open top comes to one value
  barb_faces     the cut face of an end barb is upright; arm beaks lean by one angle
  even_tension   quarter arcs of bowls carry one handle share outside and one inside

Called from normalize.normalize, before bracket_handles, harmonize and soften_ends."""
import math
import os

X_HEIGHT = 520

# ---------------------------------------------------------------------------------------------------- helpers


def _segs(c):
    """[(kind, i0, h1, h2, i3)] point indices for a closed contour; h1/h2 None for lines."""
    P, n = c.points, len(c.points)
    start = next(i for i, p in enumerate(P) if p.type)
    out, buf, prev = [], [], start
    for k in range(1, n + 1):
        i = (start + k) % n
        if P[i].type is None:
            buf.append(i)
            continue
        if P[i].type == "curve" and len(buf) == 2:
            out.append(("curve", prev, buf[0], buf[1], i))
        else:
            out.append(("line", prev, None, None, i))
        prev, buf = i, []
    return out


def _ink_sign(g):
    """+1 when the glyph's outer contours run counter-clockwise (ink on the left of travel)."""
    big = max(g.contours, key=lambda c: abs(_area(c)))
    return 1 if _area(big) > 0 else -1


def _area(c):
    on = [p for p in c.points if p.type]
    return sum(on[i].x * on[(i + 1) % len(on)].y - on[(i + 1) % len(on)].x * on[i].y for i in range(len(on))) / 2


def _flat(g):
    cs = []
    for c in g.contours:
        P = c.points
        pts = []
        for kind, i0, h1, h2, i3 in _segs(c):
            a, d = P[i0], P[i3]
            if kind == "line":
                pts.append((d.x, d.y))
            else:
                b, cc = P[h1], P[h2]
                for t in range(1, 25):
                    t /= 24
                    u = 1 - t
                    pts.append((u ** 3 * a.x + 3 * u * u * t * b.x + 3 * u * t * t * cc.x + t ** 3 * d.x,
                                u ** 3 * a.y + 3 * u * u * t * b.y + 3 * u * t * t * cc.y + t ** 3 * d.y))
        cs.append(pts)
    return cs


def _vruns(cs, x):
    x += 0.013
    out = []
    for c in cs:
        n = len(c)
        for i in range(n):
            a, b = c[i], c[(i + 1) % n]
            if (a[0] <= x < b[0]) or (b[0] <= x < a[0]):
                out.append(a[1] + (x - a[0]) / (b[0] - a[0]) * (b[1] - a[1]))
    out.sort()
    return [(out[i], out[i + 1]) for i in range(0, len(out) - 1, 2)]


def _neighbour_handles(P, i):
    n = len(P)
    return [P[j] for j in ((i - 1) % n, (i + 1) % n) if P[j].type is None]


# ------------------------------------------------------------------------------------------------- true lines
# Georgia Pro's stems and bars are exact: of its 580 lines, none is within 3 units of an axis without being on it,
# except serif undersides drawn that way. Area had 17 (n's right stem 2 units off upright, k's 3, e's bar 2, r's
# base 3, T's beak faces 2 ...), left by rules that moved one end of a line. Each becomes exact: the end that shares
# its coordinate with more of the glyph's nodes stays, the other moves with its handle.
TRUE_MAX = 3
STEMS = (82, 90)
TRUE_SKIP = {"one"}          # the 1's stem tapers by the owner's 0.22 note; its other lines are handled by name


def true_lines(font, names):
    fixed = []
    for name in names:
        g = font[name]
        uprights = [c.points[i0].x for c in g.contours for kind, i0, _, _, i3 in _segs(c)
                    if kind == "line" and c.points[i0].x == c.points[i3].x and abs(c.points[i0].y - c.points[i3].y) > 40]
        for c in g.contours:
            P = c.points
            for kind, i0, _, _, i3 in _segs(c):
                if kind != "line":
                    continue
                a, b = P[i0], P[i3]
                dx, dy = b.x - a.x, b.y - a.y
                L = math.hypot(dx, dy)
                small = min(abs(dx), abs(dy))
                if L < 12 or small == 0 or small > TRUE_MAX or math.degrees(math.atan2(small, L)) > 4:
                    continue
                if name in TRUE_SKIP and L > 300:
                    continue
                ax = "x" if abs(dx) < abs(dy) else "y"
                va, vb = getattr(a, ax), getattr(b, ax)
                on = [getattr(p, ax) for cc in g.contours for p in cc.points if p.type]
                score = lambda v: on.count(v) + (10 if ax == "x" and any(abs(abs(v - x) - w) < 0.5 for x in uprights
                                                                      for w in STEMS) else 0)
                keep_a = score(va) >= score(vb)           # the end that makes a true stem width stays
                mover, target, idx = (b, va, i3) if keep_a else (a, vb, i0)
                d = target - getattr(mover, ax)
                setattr(mover, ax, target)
                for h in _neighbour_handles(P, idx):
                    setattr(h, ax, getattr(h, ax) + d)
                fixed.append((name, ax, round(d)))
    return fixed


# -------------------------------------------------------------------------------------------------- shoulders
# Where the arch comes down into the right stem. Georgia Pro: n, h and m all run straight up to 0.77 (outside) and
# 0.74 (inside) of the x-height. Area: n 0.69 / 0.66, h 0.71 / 0.70, m 0.79 / 0.73, from nodes at 322, 348 and 388:
# three shoulders in one family. They become one, a little squarer than n's was (part of the way to Georgia Pro's),
# and the quarter arcs above them carry the same handles.
SHOULDER_OUT = 352            # y of the outer node on the right stem (0.68 of the x-height)
SHOULDER_IN = 348
SHOULDER_K = (0.60, 0.62)     # outer arc: share up the stem, share along the top
SHOULDER_K_IN = (0.52, 0.62)  # inner arc (h's own values, the middle of the three)


def shoulders(font):
    done = 0
    for name in "nhm":
        sign = _ink_sign(font[name])
        for c in font[name].contours:
            P = c.points
            for kind, i0, h1, h2, i3 in _segs(c):
                if kind != "curve":
                    continue
                a, b, cc, d = P[i0], P[h1], P[h2], P[i3]
                # one end on an upright stem edge (upright handle), the other a level extreme near the x-height
                for stem, hs, top, ht in ((a, b, d, cc), (d, cc, a, b)):
                    if abs(hs.x - stem.x) > 0.5 or abs(ht.y - top.y) > 0.5:
                        continue
                    if not (430 < top.y < 545 and 300 < stem.y < 400 and stem.x > top.x + 80):
                        continue
                    cross = (b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x)
                    convex = cross * sign > 0
                    stem.y = SHOULDER_OUT if convex else SHOULDER_IN
                    kv, kh = SHOULDER_K if convex else SHOULDER_K_IN
                    hs.x, hs.y = stem.x, round(stem.y + kv * (top.y - stem.y))
                    ht.y, ht.x = top.y, round(top.x + kh * (stem.x - top.x))
                    done += 1
    return done


# ------------------------------------------------------------------------------------------------- thin floor
# The thinnest point of a round stroke, by a vertical scan across the middle of the letter, in stems. Georgia Pro:
# 0.41 on o c e b d q n h m a s alike (0.36-0.42), 0.38-0.41 on the capitals. Area's closed bowls agree with each
# other (o b d q 0.64-0.68) but its arches and open tops did not: n 0.50, h 0.54, m 0.55, u 0.62, c and e 0.46,
# a 0.45, g 0.50, s 0.44; G's bottom 0.45 against C's 0.59, S's bottom 0.51 against its top 0.59. Thin parts of
# different weight flicker in text. Each comes to one value for its kind by moving the counter's own extreme point
# (with its handles) toward the counter: the outside of the letter, its height and its width do not move.
# 0.38 (owner: "part of the approach seems to be making the thinner parts ... thicker, but id actually prefer to make
# the thicker parts thinner"): the one value is the arches' own, and the bowls come down to it. 0.36 and 0.37 had
# raised the arches to the bowls' 0.65.
THIN_ARCH = 0.52              # n was 0.50, h 0.54, m 0.55 before 0.36; the closed bowls were 0.65
THIN_CAP = 0.525              # 0.58 audit: 47 units after lightening, 0.55 of H's stem, the lowercase's own share of n's
                              # (0.57, 51 units, until then: the round capitals carried 5-10% more ink than the straight
                              # ones against both references, whose thin arcs and serif tips are one weight). D's and P's; O was 0.63
BOWL_R, BOWL_L = (42, 80), (20, 58)
THIN_FLOOR = [                # (glyph, side, target, scan range in % of the ink width)
    ("n", "top", THIN_ARCH, (48, 78)), ("h", "top", THIN_ARCH, (50, 80)),      # the arch past its branch
    ("m", "top", THIN_ARCH, (30, 46)), ("m", "top", THIN_ARCH, (66, 86)),
    ("u", "bottom", THIN_ARCH, (25, 75)),
    ("c", "top", THIN_ARCH, (25, 75)), ("e", "top", THIN_ARCH, (25, 75)), ("e", "bottom", 0.62, (35, 65)),   # 0.59: c's own lower arc (51 units); 0.70 until then
    ("g", "top", THIN_ARCH, (25, 75)), ("a", "top", THIN_ARCH, (25, 75)),
    ("s", "top", THIN_ARCH, (25, 75)), ("s", "bottom", THIN_ARCH, (25, 75)),
    ("o", "top", THIN_ARCH, (25, 75)), ("o", "bottom", THIN_ARCH, (25, 75)),
    ("b", "top", THIN_ARCH, BOWL_R), ("b", "bottom", THIN_ARCH, BOWL_R),
    ("p", "top", THIN_ARCH, BOWL_R), ("p", "bottom", THIN_ARCH, BOWL_R),
    ("d", "top", THIN_ARCH, BOWL_L), ("d", "bottom", THIN_ARCH, BOWL_L),
    ("q", "top", THIN_ARCH, BOWL_L), ("q", "bottom", THIN_ARCH, BOWL_L),
    ("O", "top", THIN_CAP, (25, 75)), ("O", "bottom", THIN_CAP, (25, 75)), ("Q", "top", THIN_CAP, (25, 75)),
    ("C", "top", THIN_CAP, (25, 75)), ("C", "bottom", THIN_CAP, (25, 75)),
    ("G", "top", THIN_CAP, (25, 75)), ("G", "bottom", THIN_CAP, (25, 75)),
    ("S", "top", THIN_CAP, (25, 75)), ("S", "bottom", THIN_CAP, (25, 75)),
    ("D", "bottom", THIN_CAP, (30, 75)), ("D", "top", THIN_CAP, (30, 75)), ("Q", "bottom", THIN_CAP, (25, 60)),
    ("B", "top", THIN_CAP, (35, 75)), ("P", "top", THIN_CAP, (35, 75)), ("R", "top", THIN_CAP, (35, 75)),
]


def _thin(g, side, span=(25, 75)):
    cs = _flat(g)
    xs = [p[0] for c in cs for p in c]
    ys = [p[1] for c in cs for p in c]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    if y1 > 745 and y0 > -40:
        y1 = X_HEIGHT + 10                                    # h b d: the arch or bowl, not the ascender
    if y0 < -150 and y1 < 600:
        y0 = -10                                              # p q: the bowl, not the descender
    best = None
    for i in range(span[0], span[1] + 1):
        x = x0 + (x1 - x0) * i / 100
        r = _vruns(cs, x)
        if not r:
            continue
        run = max((q for q in r if q[1] <= y1 + 1), key=lambda q: q[1], default=None) if side == "top" \
            else min((q for q in r if q[0] >= y0 - 1), key=lambda q: q[0], default=None)
        if run is None:
            continue
        edge_ok = run[1] > y1 - 0.12 * (y1 - y0) if side == "top" else run[0] < y0 + 0.12 * (y1 - y0)
        if edge_ok and (best is None or run[1] - run[0] < best[0]):
            best = (run[1] - run[0], x, run[0] if side == "top" else run[1])
    return best


def thin_floor(font, stems):
    report = []
    for name, sd, target, span in THIN_FLOOR:
        g = font[name]
        unit = stems[0] if name.islower() else stems[1]
        if True:
            for _ in range(3):
                t = _thin(g, sd, span)
                if t is None:
                    break
                d = target * unit - t[0]
                if abs(d) < 0.75:
                    break
                # the counter's level extreme nearest the thin spot
                cand = None
                for c in g.contours:
                    P, n = c.points, len(c.points)
                    for i, p in enumerate(P):
                        if not p.type or not p.smooth:
                            continue
                        hs = [P[(i - 1) % n], P[(i + 1) % n]]
                        if any(h.type for h in hs) or any(abs(h.y - p.y) > 0.5 for h in hs):
                            continue
                        dist = math.hypot(p.x - t[1], p.y - t[2])
                        if abs(p.y - t[2]) < 25 and dist < 130 and (cand is None or dist < cand[0]):
                            cand = (dist, p, hs)
                if cand is None:
                    print(f"thin_floor: {name} {sd}: no level extreme at the thin spot; skipped")
                    break
                step = round(d) * (-1 if sd == "top" else 1)
                for q in [cand[1]] + cand[2]:
                    q.y += step
            report.append((name, sd, round((_thin(g, sd, span) or (0,))[0] / unit, 2)))
    return report


# ------------------------------------------------------------------------------------------------- barb faces
# The cut face of a barb or beak. Georgia Pro: the end barbs of C G S s are upright within 1-3 degrees; arm beaks
# lean 4-6 degrees. Area: S's top face leaned 5 degrees and its bottom 0; s's leaned 2 and 11; C's and G's 5-6; arm
# beaks 4.1-5.4. End barbs become upright; arm beaks lean by one angle. The tip keeps its place (ink width holds).
FACE_UPRIGHT = "CGSs"
FACE_LEAN = "EFLZz"
BEAK_LEAN = 4.6               # degrees


def barb_faces(font):
    done = []
    for name in FACE_UPRIGHT + FACE_LEAN:
        g = font[name]
        allx = [p.x for c in g.contours for p in c.points if p.type]
        mid = (min(allx) + max(allx)) / 2
        for c in g.contours:
            P = c.points
            for kind, i0, _, _, i3 in _segs(c):
                if kind != "line":
                    continue
                a, b = P[i0], P[i3]
                dx, dy = b.x - a.x, b.y - a.y
                if abs(dy) < 85 or abs(dx) > 0.25 * abs(dy) or (dx == 0 and name in FACE_UPRIGHT):
                    continue
                if a.smooth or b.smooth:
                    continue
                if name in FACE_LEAN and (abs(dy) > 220 or dx == 0):
                    continue                                  # a stem, not a beak
                # the tip: the end farther from the letter's middle
                tip, other, io = (a, b, i3) if abs(a.x - mid) >= abs(b.x - mid) else (b, a, i0)
                lean = 0 if name in FACE_UPRIGHT else round(abs(dy) * math.tan(math.radians(BEAK_LEAN)))
                target = tip.x - lean * (1 if tip.x > mid else -1)
                d = target - other.x
                if d == 0:
                    continue
                other.x = target
                for h in _neighbour_handles(P, io):
                    h.x += d
                done.append((name, round(d)))
    return done


# ----------------------------------------------------------------------------------------------- even tension
# A quarter arc's handles, as shares of its reach. Georgia Pro's bowls are one curve: o outside 0.59 on all four
# quarters, inside 0.63; b d p q's bowl side 0.60-0.62. Area's o was even (0.52-0.58 outside, 0.57-0.62 inside) but
# the letters built beside it were not: c's counter 0.47-0.67, e's outside 0.56-0.70, d's counter 0.56-0.69 against
# b's 0.51-0.60, G 0.48-0.82. Each bowl quarter comes to one share outside and one inside, a step squarer than
# Area's o was and short of Georgia Pro's.
TENSION_OUT = 0.57
TENSION_IN = 0.61
TENSION_BAND = 0.01
TENSION_MAX = 20              # units a handle may move
TENSION_MIN_REACH = 90
TENSION_SET = list("ocebdpqg") + list("OQCGD") + ["zero", "six", "eight", "nine"] + list("sS")
TENSION_SKIP_CONTOUR = {"g": {0}}        # the loop is Serrif's shape, not a bowl


def even_tension(font, names=None):
    moved = 0
    for name in names or TENSION_SET:
        g = font[name]
        sign = _ink_sign(g)
        for ci, c in enumerate(g.contours):
            if ci in TENSION_SKIP_CONTOUR.get(name, ()):
                continue
            P = c.points
            for kind, i0, h1, h2, i3 in _segs(c):
                if kind != "curve":
                    continue
                a, b, cc, d = P[i0], P[h1], P[h2], P[i3]
                dx, dy = d.x - a.x, d.y - a.y
                up0, lv0 = abs(b.x - a.x) < 0.5, abs(b.y - a.y) < 0.5
                up3, lv3 = abs(cc.x - d.x) < 0.5, abs(cc.y - d.y) < 0.5
                if not ((up0 and lv3) or (lv0 and up3)):
                    continue
                if min(abs(dx), abs(dy)) < TENSION_MIN_REACH or not 0.45 < abs(dx) / abs(dy) < 2.2:
                    continue
                if name == "Q" and min(a.y, d.y) < -20:
                    continue                                  # the tail
                if not (a.smooth and d.smooth):
                    continue                                  # an arc that ends in a corner is a join, not a bowl
                cross = (b.x - a.x) * dy - (b.y - a.y) * dx
                target = TENSION_OUT if cross * sign > 0 else TENSION_IN
                for node, h, upright in ((a, b, up0), (d, cc, up3)):
                    reach = abs(dy) if upright else abs(dx)
                    cur = (abs(h.y - node.y) if upright else abs(h.x - node.x)) / reach
                    if not 0.42 <= cur <= 0.75:
                        continue
                    new = min(max(cur, target - TENSION_BAND), target + TENSION_BAND)
                    step = max(-TENSION_MAX, min(TENSION_MAX, (new - cur) * reach))
                    if abs(step) < 0.5:
                        continue
                    length = cur * reach + step
                    if upright:
                        h.y = round(node.y + math.copysign(length, h.y - node.y))
                    else:
                        h.x = round(node.x + math.copysign(length, h.x - node.x))
                    moved += 1
    return moved


# ------------------------------------------------------------------------------------------------ 0.38 redraws
# Owner, 2026-11-12: "the s should be redrawn to look more like georgia and serrif, and the t redrawn with a slightly
# taller cap height, more similar to georgia pro ... i want the lowercase r to be a bit wider overall". Measured:
#   s  its upper-left stroke was 0.81 H stems and its lower-right 0.97 (Georgia Pro 0.72 and 0.72, both lighter than
#      the spine), and the spine 1.08 (Georgia Pro 0.96, the weight of its o): a heavy lower bowl under a light upper
#      one. The two bowl strokes come to S_LOW (68, 74 units) and the spine to the o's round stroke.
#   t  top at 1.20 of the x-height (Serrif 1.21, Georgia Pro 1.31); bar's right end at 0.91 of the width (0.97).
#   r  ink width 0.694 of the x-height (Serrif 0.727, Georgia Pro 0.778); the ear reached 0.40 past the stem (0.43).
S_LOW = (66, 68)             # 0.60: the lower-right bowl stroke was 0.83-0.97 stems down its length (both references 0.71-0.79); (68, 74) until then
S_SPINE = (3, 4)              # the spine's upper edge down, lower edge up: 97 to 90 units
T_RISE = 47                   # 1.20 to 1.29 (1.26 in 0.38; owner, 0.41: "a bit taller still"; Georgia Pro 1.31)
T_BAR_OUT = 10
R_WIDER = int(os.environ.get("AREA_R_WIDER", 22))                  # 0.694 to 0.736


def _node_with_handles(P, i):
    n = len(P)
    return [P[i]] + [P[j] for j in ((i - 1) % n, (i + 1) % n) if P[j].type is None]


def s_balance(font):
    P = font["s"].contours[0].points
    n = len(P)
    ext = [i for i, p in enumerate(P) if p.type == "curve" and p.smooth and P[i - 1].type is None
           and P[(i + 1) % n].type is None and abs(P[i - 1].x - p.x) < 1 and abs(P[(i + 1) % n].x - p.x) < 1]
    up = sorted((i for i in ext if P[i].y > X_HEIGHT / 2), key=lambda i: P[i].x)
    lo = sorted((i for i in ext if P[i].y < X_HEIGHT / 2), key=lambda i: P[i].x)
    if len(up) < 2 or len(lo) < 2:
        print("s_balance: s's extremes not found; skipped")
        return
    for q in _node_with_handles(P, up[1]):
        q.x = P[up[0]].x + S_LOW[0]
    for q in _node_with_handles(P, lo[-2]):
        q.x = P[lo[-1]].x - S_LOW[1]
    mid = (min(p.x for p in P) + max(p.x for p in P)) / 2
    spine = sorted((i for i, p in enumerate(P) if p.type == "curve" and p.smooth and abs(p.x - mid) < 40
                    and 0.3 * X_HEIGHT < p.y < 0.7 * X_HEIGHT), key=lambda i: -P[i].y)
    if len(spine) == 2:
        for q in _node_with_handles(P, spine[0]):
            q.y -= S_SPINE[0]
        for q in _node_with_handles(P, spine[1]):
            q.y += S_SPINE[1]
    else:
        print("s_balance: spine nodes not found")


def t_taller(font):
    g = font["t"]
    for p in g.contours[0].points:
        if p.y > X_HEIGHT + 10:
            p.y += T_RISE
        if p.x >= 340 and 455 <= p.y <= 520:
            p.x += T_BAR_OUT
    for a in g.anchors:
        if a.y > X_HEIGHT + 10:
            a.y += T_RISE


def r_wider(font):
    g = font["r"]
    P = g.contours[0].points
    stem = max(p.x for p in P if p.type and 100 < p.y < 200)
    a, b = stem + 8, stem + 91
    for p in P:
        if p.y > 300 and p.x > a:
            p.x = round(p.x + (R_WIDER if p.x >= b else R_WIDER * (p.x - a) / (b - a)))
    g.width += R_WIDER


# e (owner: "maybe redraw the e to be more like georgia pro too"). The bar is one of the thins (E_BAR 0.52) and sits
# at Georgia Pro's height (top at 0.615 of the x-height; E_BAR_DROP), which gives the eye Georgia Pro's proportion
# (0.32 of the x-height, was 0.28; Georgia Pro 0.335). The letter's right extreme and the eye's follow the bar down
# (0.64 to 0.62; Georgia Pro 0.60), and the bottom thins from 0.79 to 0.70 (THIN_FLOOR). The tail stays Serrif's.
E_RIGHT_DOWN = (10, 8)


def e_follow(font):
    g = font["e"]
    for c, d in zip(g.contours[:2], E_RIGHT_DOWN):
        P = c.points
        n = len(P)
        ext = [i for i, p in enumerate(P) if p.type == "curve" and p.smooth and p.y > 300 and P[i - 1].type is None
               and P[(i + 1) % n].type is None and abs(P[i - 1].x - p.x) < 1 and abs(P[(i + 1) % n].x - p.x) < 1]
        if not ext:
            print("e_follow: right extreme not found")
            continue
        i = max(ext, key=lambda k: P[k].x)
        for q in _node_with_handles(P, i):
            q.y -= d


# 0.39 (owner: "Yes, thin thicks"): the round strokes' thick part comes from 1.12 to 1.05 stems (derive.ROUND_TO_STEM;
# capitals 1.13 to 1.07 H stems). The e's left stroke is drawn by its own points and did not follow: set here.
E_LEFT = 1.05


def e_left(font, stem):
    P = font["e"].contours[0].points
    n = len(P)
    ext = sorted((i for i, p in enumerate(P) if p.type == "curve" and p.smooth and P[i - 1].type is None
                  and P[(i + 1) % n].type is None and abs(P[i - 1].x - p.x) < 1 and abs(P[(i + 1) % n].x - p.x) < 1
                  and 150 < p.y < 400 and p.x < 250), key=lambda i: P[i].x)
    if len(ext) < 2:
        print("e_left: e's left extremes not found")
        return
    x = P[ext[0]].x + round(E_LEFT * stem)
    for q in _node_with_handles(P, ext[1]):
        q.x = x


# ------------------------------------------------------------------------------------------------ 0.40 lighten
# Owner, 2026-11-12: "Yes, lighter stems". A lighter stem set in derive.py moves every point 2-4 units, and the rules
# and the owner's saved points are keyed to positions (tried in 0.39: f's hook and e's bar rules lost their points;
# in 0.40: the owner's h and L saves no longer matched). So the weight comes off the finished outlines instead: every
# point moves toward its ink by LIGHTEN units times the sideways part of its outward direction. An upright edge
# moves the full amount, a level edge not at all, a diagonal in proportion. Stems 82 to 78, H 90 to 86, round
# strokes 86 to 82; heights, thins (horizontal), overshoots and serif lengths from the stem do not change. Each
# letter is 4 units narrower; spacing.py runs after and re-fits it. Dots are left round.
LIGHTEN = 2
DOT_MAX = 135                 # a contour narrower and shorter than this is a dot


def _unit(dx, dy):
    L = math.hypot(dx, dy)
    return (dx / L, dy / L) if L > 1e-6 else (0.0, 0.0)


def lighten(font, names, amount=LIGHTEN):
    done = 0
    for name in names:
        g = font[name]
        if not g.contours:
            continue
        sign = _ink_sign(g)
        for c in g.contours:
            P, n = c.points, len(c.points)
            xs = [p.x for p in P]
            ys = [p.y for p in P]
            if max(xs) - min(xs) < DOT_MAX and max(ys) - min(ys) < DOT_MAX:
                continue
            on = [i for i in range(n) if P[i].type]
            old = [(p.x, p.y) for p in P]
            move = {}
            for k, i in enumerate(on):
                # directions into and out of the node (through its handles when it has them)
                j = (i - 1) % n
                while old[j] == old[i] and j != i:
                    j = (j - 1) % n
                m = (i + 1) % n
                while old[m] == old[i] and m != i:
                    m = (m + 1) % n
                tin = _unit(old[i][0] - old[j][0], old[i][1] - old[j][1])
                tout = _unit(old[m][0] - old[i][0], old[m][1] - old[i][1])
                nin, nout = tin[1] * sign, tout[1] * sign          # sideways part of each edge's outward direction
                if P[i].smooth:
                    nx = (nin + nout) / 2
                elif nin * nout < 0:
                    nx = nin + nout                                 # a point between two facing edges
                else:
                    nx = nin if abs(nin) >= abs(nout) else nout     # a corner: the more upright edge decides
                move[i] = -amount * nx
            for k, i in enumerate(on):                              # round ends stay round: a circle quarter's
                m = on[(k + 1) % len(on)]                           # nodes do not move
                if P[m].type == "curve" and (m - i) % n == 3:
                    a, h1, h2, b = old[i], old[(i + 1) % n], old[(i + 2) % n], old[m]
                    dx, dy = abs(b[0] - a[0]), abs(b[1] - a[1])
                    if 28 <= dx <= 70 and abs(dx - dy) <= 1.5:
                        l1 = math.hypot(h1[0] - a[0], h1[1] - a[1])
                        l2 = math.hypot(h2[0] - b[0], h2[1] - b[1])
                        axis = (h1[0] == a[0] or h1[1] == a[1]) and (h2[0] == b[0] or h2[1] == b[1])
                        if axis and abs(l1 - 0.5523 * dx) <= 2.5 and abs(l2 - 0.5523 * dx) <= 2.5:
                            move[i] = move[m] = 0.0
            for _ in range(2):                                      # a softened corner moves as one piece
                for k, i in enumerate(on):
                    m = on[(k + 1) % len(on)]
                    if math.hypot(old[m][0] - old[i][0], old[m][1] - old[i][1]) < 12 and P[m].type == "curve":
                        big = move[i] if abs(move[i]) >= abs(move[m]) else move[m]
                        move[i] = move[m] = big
            for k, i in enumerate(on):
                P[i].x = round(old[i][0] + move[i])
                prev_on, next_on = on[k - 1], on[(k + 1) % len(on)]
                j = (i + 1) % n
                steps = 0
                while P[j].type is None:                            # outgoing handles: the first follows this node
                    owner = i if steps == 0 else next_on
                    P[j].x = round(old[j][0] + move[owner])
                    j = (j + 1) % n
                    steps += 1
            done += 1
    return done


# ------------------------------------------------------------------------------------------------------ 0.41
# r (owner, 2026-11-13: "i want the r to be wider, base the top part on libre baskerville"). The arm and ear are
# Libre Baskerville's own points again (derive.py's r, before any rule: SIL OFL), placed on Area's stem, with the arm
# lengthened: the ear moves R_REACH - 190 units right as one piece and the arm between stretches. Libre Baskerville's
# ear reaches 190 units past the stem; Area's 0.40 reached 231 (Georgia Pro 224 at this size). This replaces the
# Serrif-proportioned ear (r_ear_redraw) and the owner's earlier points on it.
R_REACH = int(os.environ.get("AREA_R_REACH", 245))        # the env values are for option sheets only
R_EAR_THIN = float(os.environ.get("AREA_R_EAR", 0.88))             # the ear's depth: 90 units in Libre Baskerville, 79 here (r's thick stroke was 99 against n's 85)
R_ARM = (216, 262)            # in Libre Baskerville's r: the arm, from the notch to where its underside levels; the ear beyond moves whole


def r_top_lb(font, source):
    from ufoLib2.objects import Point
    c = font["r"].contours[0]
    P, L = c.points, source["r"].contours[0].points
    flag = lambda pts: next((i for i, p in enumerate(pts) if p.type == "line" and p.y > 500 and p.x < 230), None)
    ip, il = flag(P), flag(L)
    if ip is None or il is None or not (P[0].type == "line" and abs(P[0].y - L[0].y) < 3):
        print("r_top_lb: r's points moved; skipped")
        return
    off = P[0].x - L[0].x
    d = R_REACH - 190
    top = max(p.y for p in L[1:il])
    a, b = R_ARM
    new = []
    for p in L[1:il]:
        x = p.x + off + d * max(0.0, min(1.0, (p.x - a) / (b - a)))
        y = top - (top - p.y) * R_EAR_THIN if (p.x > 240 and p.y > 420) else p.y     # the ear, lighter (ink balance)
        new.append(Point(round(x), round(y), p.type, smooth=p.smooth))
    c.points[1:ip] = new


# The owner's saves made on 0.40 and later are matched after lightening and spacing, on the page's own points:
# [x from the ink's left edge, y, new x from the ink's left edge, new y].
def owner_final(font, edits, near=3.0):
    for name, e in edits.items():
        rows = e.get("by_position_final") if isinstance(e, dict) else None
        if not rows or name not in font:
            continue
        pts = [p for c in font[name].contours for p in c.points]
        x0 = min(p.x for p in pts if p.type)
        for fx, fy, tx, ty in rows:
            hit = [p for p in pts if abs(p.x - x0 - fx) <= near and abs(p.y - fy) <= near]
            if len(hit) != 1:
                print(f"owner_final: {name} ({fx},{fy}): {len(hit)} matches; skipped")
                continue
            hit[0].x, hit[0].y = x0 + tx, ty


# Ink balance (owner, 2026-11-13: "do an optical ink balance across all characters, making sure the optical weight of
# all characters is consistent"). Every stroke of every character was measured across the stroke (the shortest
# crossing through sampled points of ink) and compared with the same measure on Georgia Pro, as a ratio to n's and
# H's. Out of line, and brought down (never up):
#   T      its stem was 105 units before lightening against H's 90: 17% heavy (Georgia Pro's T and H stems are equal)
#   N M    diagonals 1.23 and 1.12 of H's stroke (Georgia Pro 0.93 and 0.93)
#   S      spine 1.11 of H's stroke (Georgia Pro 1.03)
#   v w y  thick diagonal 1.06-1.10 of n's stroke (Georgia Pro 0.97): normalize.DIAG_THICK 1.12 to 1.03
#   r      the new ear (R_EAR_THIN)
T_STEM = 90
N_DIAG, M_DIAG = 122, 97      # horizontal width of the thick diagonal at half the cap height (were 155, 112)
S_SPINE_CAP = (3, 4)


def T_stem(font):
    P = font["T"].contours[0].points
    n = len(P)
    ups = sorted({P[i].x for i in range(n) if P[i].type == "line" and P[i - 1].type and P[i].x == P[i - 1].x
                  and abs(P[i].y - P[i - 1].y) > 300})
    if len(ups) != 2:
        print("T_stem: T's stem not found; skipped")
        return
    xl, xr = ups
    over = (xr - xl) - T_STEM
    if over < 2:
        return
    dl = round(over / 2)
    dr = over - dl
    cx = (xl + xr) / 2
    for p in P:
        if abs(p.x - xl) < 0.5 or (p.x < cx and (p.y < 110 or (p.y > 600 and p.x > xl - 45))):
            p.x += dl
        elif abs(p.x - xr) < 0.5 or (p.x >= cx and (p.y < 110 or (p.y > 600 and p.x < xr + 45))):
            p.x -= dr


def spine_thin(font, name, height, down_up):
    P = font[name].contours[0].points
    mid = (min(p.x for p in P) + max(p.x for p in P)) / 2
    spine = sorted((i for i, p in enumerate(P) if p.type == "curve" and p.smooth and abs(p.x - mid) < 40
                    and 0.3 * height < p.y < 0.7 * height), key=lambda i: -P[i].y)
    if len(spine) != 2:
        print(f"spine_thin: {name}'s spine nodes not found")
        return
    for q in _node_with_handles(P, spine[0]):
        q.y -= down_up[0]
    for q in _node_with_handles(P, spine[1]):
        q.y += down_up[1]


# 0.42 (owner: "Yes, thicken", of the figures 1, 4 and 7). Measured in H stems: the 1's stem tapered from 0.99 at the
# foot to 0.90 at the top (Georgia Pro's is even), and the 1's and 4's stems were 0.92 of H's. Both stems are H's
# now and the 1's is upright. The 7's diagonal already sat at Georgia Pro's ratio to H (0.555, 0.557); it gains
# SEVEN_DIAG units so it does not read lighter than the 1 and 4 beside it.
FIG_STEM = 90                 # before lightening: H's stem
SEVEN_DIAG = 4


def figure_stems(font):
    # 1: left edge upright already; the right edge ran from the foot's bracket to the apex, leaning
    P = font["one"].contours[0].points
    n = len(P)
    apex = next((i for i, p in enumerate(P) if p.type == "line" and p.y > 700 and P[i - 1].type and P[i - 1].y < 130), None)
    left = [P[i].x for i in range(n) if P[i].type == "line" and P[i - 1].type and P[i].x == P[i - 1].x
            and abs(P[i].y - P[i - 1].y) > 300]
    if apex is None or len(left) != 1:
        print("figure_stems: 1's stem not found")
    else:
        xr = left[0] + FIG_STEM
        base = P[apex - 1]
        d = xr - base.x
        cx = (left[0] + base.x) / 2
        for p in P:
            if p is not P[apex] and p.y < 110 and p.x > cx:
                p.x += d
        P[apex].x = xr
    # 4: the stem's right edge moves out, with the foot's right half
    P = font["four"].contours[0].points
    n = len(P)
    ups = sorted({P[i].x for i in range(n) if P[i].type == "line" and P[i - 1].type and P[i].x == P[i - 1].x
                  and abs(P[i].y - P[i - 1].y) > 100})
    inner = max(p.x for p in font["four"].contours[1].points)
    right = [x for x in ups if 40 < x - inner < 130]
    if not right:
        print("figure_stems: 4's stem not found")
    else:
        xr = right[0]
        d = inner + FIG_STEM - xr
        for p in P:
            if abs(p.x - xr) < 0.5 or (p.y < 110 and p.x > (inner + xr) / 2):
                p.x += d
    # 7: the diagonal's left edge
    P = font["seven"].contours[0].points
    n = len(P)
    for i in range(n):
        a, b = P[i - 1], P[i]
        if a.type and b.type == "line" and abs(b.y - a.y) > 500 and b.x < a.x and a.y > b.y:
            a.x -= SEVEN_DIAG
            b.x -= SEVEN_DIAG
            break
    else:
        print("figure_stems: 7's diagonal not found")


# 0.43 (owner: "redraw the 6 8 9 too"). Measured in H stems against Georgia Pro:
#   6 9  the long stroke (6's left, 9's right) was 1.16 at a third of the height and 1.59 at the middle, where the
#        bowl joins it; Georgia Pro 1.00 and 1.16. It was 10 units heavier than the figure's own bowl stroke. The
#        stroke's inner edge, the join and the counter's side move over so the long stroke is the bowl's weight.
#   8    the band where the two strokes cross was 1.17 of H's stroke (Georgia Pro 0.91): each counter's end at the
#        waist moves EIGHT_WAIST units toward the middle.
EIGHT_WAIST = (6, 6)          # upper counter's bottom down, lower counter's top up


def figure_joins(font):
    for name, side in (("six", -1), ("nine", 1)):
        g = font[name]
        outer, counter = g.contours[0].points, g.contours[1].points
        ox = [p.x for p in outer if p.type]
        cx = [p.x for p in counter if p.type]
        if side < 0:
            bowl = max(ox) - max(cx)                 # the bowl's own stroke, on the other side
            edge = min(cx)
            d = (min(ox) + bowl) - edge
        else:
            bowl = min(cx) - min(ox)
            edge = max(cx)
            d = (max(ox) - bowl) - edge
        if abs(d) < 2 or abs(d) > 20:
            print(f"figure_joins: {name}: long stroke off by {d:.0f}; skipped")
            continue
        ys = [p.y for p in counter if p.type and abs(p.x - edge) < 1.5]
        lo, hi = (min(ys), 1000) if side < 0 else (-1000, max(ys))
        for p in counter:
            if abs(p.x - edge) < 1.5:
                p.x += d
        for p in outer:                              # the stroke's inner edge above (6) or below (9) the counter
            if abs(p.x - edge) <= 8 and lo - 5 <= p.y <= hi + 5 and not (min(ys) + 30 < p.y < max(ys) - 30):
                p.x += d
    g = font["eight"]
    if len(g.contours) == 3:
        cs = sorted(g.contours[1:], key=lambda c: -max(p.y for p in c.points))
        up, low = cs[0].points, cs[1].points
        yb = min(p.y for p in up if p.type)
        yt = max(p.y for p in low if p.type)
        for P, y0, dy in ((up, yb, -EIGHT_WAIST[0]), (low, yt, EIGHT_WAIST[1])):
            n = len(P)
            for i, p in enumerate(P):
                if p.type and abs(p.y - y0) < 45:
                    for q in _node_with_handles(P, i):
                        q.y += dy
    else:
        print("figure_joins: 8's counters not found")


# 0.44, r (owner, 2026-11-13, of option C, the round end on a neck: "the end should be more round/smooth, and thicker
# and the arc should be rounder, more circular, not so straight"). The arm and end are drawn here from a few numbers,
# as Area's own curves: the arm's top and underside are each one quarter of an ellipse (handles R_K of the reach),
# and the end is a circle of radius R_BALL (lighten leaves circle quarters alone, so it stays round).
_E = lambda k, v: type(v)(os.environ.get("AREA_" + k, v))      # the env values are for option sheets only
R_BALL = _E("R_BALL", 52)             # 47 in 0.40
R_END_REACH = _E("R_END_REACH", 258)  # the end's right side, from the stem's right edge
R_ARM_THICK = _E("R_ARM_THICK", 66)   # the arm where it meets the end
R_LEAVE = _E("R_LEAVE", 300)          # the underside leaves the stem here
R_NOTCH = _E("R_NOTCH", 404)          # the top arc meets the flag's notch here
R_K = _E("R_K", 0.56)
R_NECK_BACK = _E("R_NECK_BACK", 10)   # how far left of the end the underside peaks: further is a longer, shallower dip
R_STYLE = _E("R_STYLE", "neck")       # "neck": the underside peaks, then dips into the end; "tear": one curve from the
                                      # stem into the end's bottom, the arm swelling all the way (no neck)


def r_top_round(font, top=None):
    from ufoLib2.objects import Point
    c = font["r"].contours[0]
    P = c.points
    ip = next((i for i, p in enumerate(P) if p.type == "line" and p.y > 500 and p.x < P[0].x + 25 and i > 3), None)
    if ip is None or P[0].type != "line":
        print("r_top_round: r's points moved; skipped")
        return
    xs = P[0].x
    top = top or max(p.y for p in P[1:ip])
    rx, ry = R_BALL, R_BALL                                     # a true circle: lighten leaves circles alone
    cx, cy = xs + R_END_REACH - rx, top - ry
    kc = 0.5523
    T = (cx - rx - R_NECK_BACK, top - R_ARM_THICK)              # the neck: the underside's highest point
    N = (xs + 3, R_NOTCH)
    pt = lambda x, y, t=None, sm=False: Point(round(x), round(y), t, smooth=sm)
    new = [
        pt(xs, R_LEAVE, "line", True),
        pt(xs, R_LEAVE + R_K * (T[1] - R_LEAVE)), pt(T[0] - R_K * (T[0] - xs), T[1]), pt(T[0], T[1], "curve", True),
        pt(T[0] + 0.45 * (cx - T[0]), T[1]), pt(cx - 0.55 * rx, cy - ry), pt(cx, cy - ry, "curve", True),
        pt(cx + kc * rx, cy - ry), pt(cx + rx, cy - kc * ry), pt(cx + rx, cy, "curve", True),
        pt(cx + rx, cy + kc * ry), pt(cx + kc * rx, cy + ry), pt(cx, cy + ry, "curve", True),
        pt(cx - R_K * (cx - N[0]), cy + ry), pt(N[0], N[1] + R_K * (cy + ry - N[1])), pt(N[0], N[1], "curve", False),
    ]
    if R_STYLE == "tear":
        B = (cx, cy - ry)
        new[1:7] = [pt(xs, R_LEAVE + R_K * (B[1] - R_LEAVE)), pt(B[0] - 0.62 * (B[0] - xs), B[1]),
                    pt(B[0], B[1], "curve", True)]
    c.points[1:ip] = new


# 0.45, r (owner, 2026-11-13: "can you just copy serrifs r as close as possible, and then just make it a bit wider,
# while keeping the curves and maintaining roundness"). Serrif is licensed, so its points are not read: its r was
# measured at Area's x-height (the arm's top and underside every 12 units from the stem, the end's extremes) and
# Area's own curves were fitted to that profile, to 0.4 and 0.9 units rms. Positions are from the stem's right edge.
#   top arc     from the notch (2, 412) to the level top at x 130; handles 0.20 up, 0.65 along
#   underside   leaves the stem at 330, peaks at (88, 465); handles 0.25 up, 0.60 along; then dips into the end
#   end         a circle, radius 54, centre (153, 474): the arm is 49 thick at its thinnest, the end 108
# Then wider: everything past the stem moves out in proportion, the end by RS_WIDEN whole (Serrif reaches 206).
RS_NOTCH, RS_K_TOP = (2, 412), (0.15, 0.78)   # 0.46: one curve to the end's top (was an arc to x 130, then level)
RS_TOP_EASE = 0.66            # the end's top handle, as a share of its radius: the arc runs into the end without a flat
RS_LEAVE, RS_PEAK, RS_K_UNDER = 330, (88, 465), (0.25, 0.60)
RS_BALL, RS_CENTRE = 50, (157, 478)   # 0.46: radius 54 to 50 (the end was 1.30 stems against the set's 1.15); same top and reach
RS_WIDEN = _E("RS_WIDEN", 18)


def r_top_measured(font):
    from ufoLib2.objects import Point
    c = font["r"].contours[0]
    P = c.points
    ip = next((i for i, p in enumerate(P) if p.type == "line" and p.y > 500 and p.x < P[0].x + 25 and i > 3), None)
    if ip is None or P[0].type != "line":
        print("r_top_measured: r's points moved; skipped")
        return
    xs = P[0].x
    w = RS_WIDEN
    f = (RS_CENTRE[0] + w) / RS_CENTRE[0]                       # the arm stretches; the end keeps its size
    R = RS_BALL
    cx, cy = xs + RS_CENTRE[0] + w, RS_CENTRE[1]
    top = cy + R
    Tn = (xs + RS_PEAK[0] * f, RS_PEAK[1])
    N = (xs + RS_NOTCH[0], RS_NOTCH[1])
    kc = 0.5523
    pt = lambda x, y, t=None, sm=False: Point(round(x), round(y), t, smooth=sm)
    new = [
        pt(xs, RS_LEAVE, "line", True),
        pt(xs, RS_LEAVE + RS_K_UNDER[0] * (Tn[1] - RS_LEAVE)), pt(Tn[0] - RS_K_UNDER[1] * (Tn[0] - xs), Tn[1]),
        pt(Tn[0], Tn[1], "curve", True),
        pt(Tn[0] + 0.40 * (cx - Tn[0]), Tn[1]), pt(cx - 0.62 * R, cy - R), pt(cx, cy - R, "curve", True),
        pt(cx + kc * R, cy - R), pt(cx + R, cy - kc * R), pt(cx + R, cy, "curve", True),
        pt(cx + R, cy + kc * R), pt(cx + RS_TOP_EASE * R, cy + R), pt(cx, cy + R, "curve", True),
        pt(cx - RS_K_TOP[1] * (cx - N[0]), top), pt(N[0], N[1] + RS_K_TOP[0] * (top - N[1])), pt(N[0], N[1], "curve", False),
    ]
    c.points[0:ip] = new                                       # the old first point sat on the stem's line: gone
    return


# 0.46, the final pass (owner: "another final pass on visual consistency, weight, smoothness, optical weight, and all
# other technical details. make sure there are no uneccessary points, unsmooth curves, random gaps").
BRACKET_SHARES = (0.70, 0.90)     # up the stem, along the serif. 0.45 / 0.75 until 0.46 (derive.BRACKET_K_*, which still
                                  # draws them so): fitted to the references' measured bracket (joins.py, 0.49)


def brackets_one(font, names):
    """Every serif bracket is one curve. The head serifs of b d h i j m p had 0.74-0.93 up the stem against the
    0.45 of u, r and every foot; r's long right foot had 0.69 / 0.41; G's under its bar 0.49 / 0.17."""
    fixed = []
    for name in names:
        for c in font[name].contours:
            P, n = c.points, len(c.points)
            S = _segs(c)
            for k, (kind, i0, h1, h2, i3) in enumerate(S):
                if kind != "curve":
                    continue
                a, b, cc, d = P[i0], P[h1], P[h2], P[i3]
                dx, dy = abs(d.x - a.x), abs(d.y - a.y)
                if not (50 <= dx <= 135 and 55 <= dy <= 80):
                    continue
                for stem, hs, serif, hf, nb in ((a, b, d, cc, S[k - 1]), (d, cc, a, b, S[(k + 1) % len(S)])):
                    if abs(hs.x - stem.x) > 0.5 or abs(hf.y - serif.y) > 0.5:
                        continue
                    q0, q1 = P[nb[1]], P[nb[4]]
                    if nb[0] != "line" or q0.x != q1.x or abs(q0.y - q1.y) < 40:
                        continue                               # the stem end must sit on an upright line
                    was = (abs(hs.y - stem.y) / dy, abs(hf.x - serif.x) / dx)
                    ny = round(stem.y + BRACKET_SHARES[0] * (serif.y - stem.y))
                    nx = round(serif.x + BRACKET_SHARES[1] * (stem.x - serif.x))
                    if abs(ny - hs.y) >= 2 or abs(nx - hf.x) >= 2:
                        hs.y, hf.x = ny, nx
                        fixed.append(f"{name} {was[0]:.2f}/{was[1]:.2f}")
    return fixed


def tidy(font, names):
    """Points with no job: a node within 3 units of the one before it on a straight run, and a node lying on the
    straight line between its two neighbours."""
    removed = []
    for name in names:
        for c in font[name].contours:
            again = True
            while again:
                again = False
                P, n = c.points, len(c.points)
                for i in range(n):
                    p, a, b = P[i], P[i - 1], P[(i + 1) % n]
                    if p.type != "line" or not a.type or not b.type or b.type != "line":
                        continue
                    d1 = math.hypot(p.x - a.x, p.y - a.y)
                    base = math.hypot(b.x - a.x, b.y - a.y)
                    off = abs((p.x - a.x) * (b.y - a.y) - (p.y - a.y) * (b.x - a.x)) / base if base else 9
                    along = (p.x - a.x) * (b.x - p.x) + (p.y - a.y) * (b.y - p.y) > 0
                    if (d1 < 3 and off < 1.5) or (off < 1.0 and along):
                        del c.points[i]
                        removed.append(f"{name} ({p.x:.0f},{p.y:.0f})")
                        again = True
                        break
    return removed


def e_eye_corner(font):
    """The eye's corner at the bar: its level handle ran 0.98 of the way to the corner, a near-square turn. 0.82."""
    P = font["e"].contours[1].points
    for kind, i0, h1, h2, i3 in _segs(font["e"].contours[1]):
        if kind != "curve":
            continue
        a, b, cc, d = P[i0], P[h1], P[h2], P[i3]
        for node, h, other in ((a, b, d), (d, cc, a)):
            dx = other.x - node.x
            if abs(h.y - node.y) < 0.5 and abs(dx) > 30 and abs(h.x - node.x) > 0.9 * abs(dx):
                h.x = round(node.x + 0.82 * dx)


# 0.47, the figures' open items (guidelines, Open: "6 and 9's join still 1.53 H stems, 8's upper-left 1.64").
#   6 9  Where the long stroke leaves the bowl, the counter's corner sat 80 units short of the stroke's crotch, so the
#        join was a blob (largest circle inside 1.27 H stems; Georgia Pro 1.03, Serrif 1.09). The counter's corner
#        now reaches toward the crotch, to FIG_JOIN_GAP units from it, as both references draw it: the join becomes
#        the branch's own width. Its handle follows FIG_JOIN_HANDLE of the way, so the counter's top bends evenly.
#   8    The spine (the stroke from upper left to lower right) was 1.20-1.24 H stems all along (Georgia Pro 0.96,
#        Serrif 1.07). Each counter's edge along the spine moves EIGHT_SPINE units across it, into the counter:
#        the spine thins from both sides, nothing is thickened.
#   X    Its thick diagonal was 5% over Serrif's and 9% over Georgia Pro's; a crossing adds ink where the strokes
#        meet, so it is drawn X_DIAG of the width K's leg keeps.
FIG_JOIN_GAP = 44
FIG_JOIN_HANDLE = 0.3       # the corner's handle follows 0.3 of its move: half bent the counter's top unevenly (evaluate.py)
EIGHT_SPINE = 11
X_DIAG = 0.95


def figure_join_corners(font):
    for name, side in (("six", -1), ("nine", 1)):
        g = font[name]
        if len(g.contours) != 2:
            print(f"figure_join_corners: {name}: contours changed; skipped")
            continue
        outer, counter = g.contours[0].points, g.contours[1].points
        crotch = [p for p in outer if p.type and not p.smooth
                  and min(q.y for q in outer) + 150 < p.y < max(q.y for q in outer) - 150]
        corners = [i for i, p in enumerate(counter) if p.type and not p.smooth]
        if not crotch or not corners:
            print(f"figure_join_corners: {name}: crotch or corner not found; skipped")
            continue
        if side < 0:                                   # 6: the counter's top-left corner rises toward the crotch
            i = max(corners, key=lambda k: counter[k].y)
            cy = min(crotch, key=lambda p: abs(p.x - counter[i].x) + abs(p.y - counter[i].y)).y
            d = (cy - FIG_JOIN_GAP) - counter[i].y
        else:                                          # 9: the counter's bottom-right corner drops toward it
            i = min(corners, key=lambda k: counter[k].y)
            cy = min(crotch, key=lambda p: abs(p.x - counter[i].x) + abs(p.y - counter[i].y)).y
            d = (cy + FIG_JOIN_GAP) - counter[i].y
        if d * -side < 0 or abs(d) > 60:
            print(f"figure_join_corners: {name}: move {d:.0f} out of range; skipped")
            continue
        n = len(counter)
        counter[i].y += d
        for j in ((i - 1) % n, (i + 1) % n):
            if counter[j].type is None:
                counter[j].y += round(d * FIG_JOIN_HANDLE)


def eight_spine(font):
    g = font["eight"]
    if len(g.contours) != 3:
        print("eight_spine: 8's counters not found; skipped")
        return
    up, low = sorted(g.contours[1:], key=lambda c: -max(p.y for p in c.points))
    cu = [p for p in up.points if p.type and not p.smooth]       # the counters' corners at the waist
    cl = [p for p in low.points if p.type and not p.smooth]
    if len(cu) != 1 or len(cl) != 1:
        print("eight_spine: corners not found; skipped")
        return
    a = cl[0]                                         # the lower counter's corner at the waist
    # the spine runs from upper left to lower right; its normal points up and to the right, into the upper counter
    tx, ty = 0.906, -0.423
    nx, ny = -ty, tx
    for P, sgn in ((up.points, -1), (low.points, 1)):        # each counter grows toward the spine
        for i, p in enumerate(P):
            if not p.type:
                continue
            # a node on the spine side: the corner, and the curve leaving it along the spine
            along = (p.x - a.x) * tx + (p.y - a.y) * ty
            off = (p.x - a.x) * nx + (p.y - a.y) * ny
            if p is cu[0] or p is cl[0] or (sgn < 0 and off > -5 and along < 0 and p.y < max(q.y for q in P) - 150) \
                    or (sgn > 0 and off < 5 and along > 0 and p.y > min(q.y for q in P) + 150):
                for q in _node_with_handles(P, i):
                    q.x += round(sgn * EIGHT_SPINE * nx)
                    q.y += round(sgn * EIGHT_SPINE * ny)


# 0.65: no outline crosses itself (owner, with a picture of a speck above w's middle peak: "this cannot be
# happening"). pathlint's new check found the same fault in M (its vertex), and one-unit slivers at the notches of
# B, Q, g, 3 and of glyphs built from them. Two edges that run into a tiny segment (6 units or less) and cross
# each other there are joined at one point, the segment's middle: a vertex or a notch is a point, not a twist.
UNCROSS_MAX = 6


def uncross(font, names=None):
    def flat(P, i0, n):
        """The segment starting at on-curve index i0, as points."""
        a = P[i0]
        b, c_ = P[(i0 + 1) % n], P[(i0 + 2) % n]
        if b.type:                                           # a line
            return [(a.x, a.y), (b.x, b.y)]
        d = P[(i0 + 3) % n]
        return [tuple((1 - t) ** 3 * a_ + 3 * (1 - t) ** 2 * t * b_ + 3 * (1 - t) * t * t * c__ + t ** 3 * d_
                      for a_, b_, c__, d_ in ((a.x, b.x, c_.x, d.x), (a.y, b.y, c_.y, d.y))) for t in [k / 12 for k in range(13)]]

    def cross(p, q):
        def side(a, b, c):
            return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        for i in range(len(p) - 1):
            for j in range(len(q) - 1):
                if side(p[i], p[i + 1], q[j]) * side(p[i], p[i + 1], q[j + 1]) < -1e-6 and \
                        side(q[j], q[j + 1], p[i]) * side(q[j], q[j + 1], p[i + 1]) < -1e-6:
                    return True
        return False

    fixed = []
    for g in font:
        if (names is not None and g.name not in names) or not g.contours:
            continue
        for c in g.contours:
            again = True
            while again:
                again = False
                P, n = c.points, len(c.points)
                on = [i for i, p in enumerate(P) if p.type]
                for k, i in enumerate(on):
                    j = on[(k + 1) % len(on)]
                    A, B = P[i], P[j]
                    if (j - i) % n != 1 or math.hypot(B.x - A.x, B.y - A.y) > UNCROSS_MAX or len(on) < 5:
                        continue
                    prev, nxt = on[k - 1], j
                    if cross(flat(P, prev, n), flat(P, nxt, n)):
                        A.x, A.y = round((A.x + B.x) / 2), round((A.y + B.y) / 2)
                        A.smooth = False
                        c.points.remove(B)
                        fixed.append(f"{g.name} ({A.x},{A.y})")
                        again = True
                        break
    return fixed


# A curve that runs into a straight (0.68; evaluation of 2026-11-13). Where a rule had moved a diagonal or a stem
# after its bracket was drawn, the bracket's handle no longer lay on the straight's own line: V 2.3 degrees, W 2.5,
# v 3.3, u's tail 2.0, the outline 1.2 to 1.7 units off the line. The handle turns onto the line, its length kept.
# Fillets (handles under JOIN_MIN_HANDLE) are left: in whole units a 3-unit handle cannot lie on an 8-degree edge.
JOIN_MAX_DEG = 4.5
JOIN_MIN_HANDLE = 12
JOIN_MIN_LINE = 40


def true_joins(font, names, max_deg=None):
    max_deg = max_deg or JOIN_MAX_DEG
    done = []
    for name in names:
        g = font[name]
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i in range(n):
                N = P[i]
                if not N.type:
                    continue
                for step in (1, -1):
                    h, L = P[(i + step) % n], P[(i - step) % n]
                    # h: a handle leaving N one way; L: the other end of a straight arriving the other way
                    straight = (N.type == "line" and L.type) if step == 1 else (L.type == "line")
                    if h.type or not L.type or not straight:
                        continue
                    lx, ly = N.x - L.x, N.y - L.y
                    ll, hl = math.hypot(lx, ly), math.hypot(h.x - N.x, h.y - N.y)
                    if ll < JOIN_MIN_LINE or hl < JOIN_MIN_HANDLE:
                        continue
                    cross = lx * (h.y - N.y) - ly * (h.x - N.x)
                    dot = lx * (h.x - N.x) + ly * (h.y - N.y)
                    ang = abs(math.degrees(math.atan2(cross, dot)))
                    if not 0.6 <= ang <= max_deg:
                        continue
                    x, y = round(N.x + lx / ll * hl), round(N.y + ly / ll * hl)
                    now = abs(math.degrees(math.atan2(lx * (y - N.y) - ly * (x - N.x), lx * (x - N.x) + ly * (y - N.y))))
                    if now < ang - 0.3:
                        h.x, h.y = x, y
                        N.smooth = True
                        done.append(f"{name} ({N.x},{N.y}) {ang:.1f}>{now:.1f}")
    return done


# Nodes where a curve needs one (0.69; evaluation of 2026-11-13). A curve should pass a leftmost, rightmost, highest
# or lowest point at a node, and bend one way only. 26 curves in the core passed an extreme without a node (the
# brackets of every diagonal, up to 28 units past the nearest node in V; g's ear; y's tail) and 12 bent both ways
# (Q's tail, R's leg, k's arm, g's link, the balls of 2 and 3). Each is cut in two at that point by de Casteljau's
# construction, which leaves the curve where it was; the new points land on whole units (under half a unit of
# movement), an extreme's handles are set level or upright, and an inflection's handles are kept on one line.
NODE_MIN_SPAN = 30           # shorter curves are fillets and serif corners
NODE_MIN_PAST = 0.75         # an extreme this little past a node is the node
NODE_MIN_PIECE = 8           # never leave a piece shorter than this (24 was tried: six extremes stayed without a node
                             # and the built font's soft kinks, which come from the quadratic conversion, did not change)
NODE_FLEX = 1 / 900          # an inflection counts when both sides bend at least this much


def _split(a, b, c, d, t):
    lerp = lambda p, q: (p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t)
    ab, bc, cd = lerp(a, b), lerp(b, c), lerp(c, d)
    abc, bcd = lerp(ab, bc), lerp(bc, cd)
    return ab, abc, lerp(abc, bcd), bcd, cd


def _d1(a, b, c, d, t):
    u = 1 - t
    return (3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]),
            3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1]))


def _curv(a, b, c, d, t):
    u = 1 - t
    x1, y1 = _d1(a, b, c, d, t)
    x2 = 6 * u * (c[0] - 2 * b[0] + a[0]) + 6 * t * (d[0] - 2 * c[0] + b[0])
    y2 = 6 * u * (c[1] - 2 * b[1] + a[1]) + 6 * t * (d[1] - 2 * c[1] + b[1])
    v = (x1 * x1 + y1 * y1) ** 1.5
    return (x1 * y2 - y1 * x2) / v if v > 1e-9 else 0.0


def _root(f, lo, hi):
    flo = f(lo)
    for _ in range(40):
        mid = (lo + hi) / 2
        if (f(mid) > 0) == (flo > 0):
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def _cut_point(a, b, c, d):
    """('x' | 'y' | 'flex', t) for the first place this curve needs a node, or None."""
    if math.hypot(d[0] - a[0], d[1] - a[1]) < NODE_MIN_SPAN:
        return None
    N = 60
    for axis in (0, 1):
        f = lambda t: _d1(a, b, c, d, t)[axis]
        for i in range(2, N - 2):
            t0, t1 = i / N, (i + 1) / N
            if f(t0) * f(t1) < 0:
                t = _root(f, t0, t1)
                u = 1 - t
                v = u ** 3 * a[axis] + 3 * u * u * t * b[axis] + 3 * u * t * t * c[axis] + t ** 3 * d[axis]
                if min(abs(v - a[axis]), abs(v - d[axis])) >= NODE_MIN_PAST:
                    return ("xy"[axis], t)
    k = lambda t: _curv(a, b, c, d, t)
    ks = [k(i / N) for i in range(1, N)]
    for i in range(1, len(ks)):
        if ks[i] * ks[i - 1] < 0:
            if max(abs(x) for x in ks[:i]) > NODE_FLEX and max(abs(x) for x in ks[i:]) > NODE_FLEX:
                return ("flex", _root(k, i / N, (i + 1) / N))
            break
    return None


def _on_line(origin, toward, ideal):
    """The whole-unit point nearest `ideal` that keeps the direction origin -> toward best (a shortened handle must
    still leave its node the way it did, or the join it belongs to gains a bend)."""
    dx, dy = toward[0] - origin[0], toward[1] - origin[1]
    L = math.hypot(dx, dy)
    if L < 1e-6:
        return (round(ideal[0]), round(ideal[1]))
    best = None
    for ox in (-1, 0, 1):
        for oy in (-1, 0, 1):
            q = (round(ideal[0]) + ox, round(ideal[1]) + oy)
            vx, vy = q[0] - origin[0], q[1] - origin[1]
            l = math.hypot(vx, vy)
            if l < 1:
                continue
            ang = abs(math.atan2(dx * vy - dy * vx, dx * vx + dy * vy))
            key = (round(ang, 4), math.hypot(q[0] - ideal[0], q[1] - ideal[1]))
            if best is None or key < best[0]:
                best = (key, q)
    return best[1] if best else (round(ideal[0]), round(ideal[1]))


def add_nodes(font, names):
    from ufoLib2.objects import Point
    done = []
    for name in names:
        g = font[name]
        for c in g.contours:
            guard = 0
            i = 0
            while i < len(c.points) and guard < 400:
                guard += 1
                P, n = c.points, len(c.points)
                p3 = P[i]
                if p3.type != "curve" or P[i - 1].type or P[i - 2].type or not P[i - 3].type:
                    i += 1
                    continue
                p0, h1, h2 = P[i - 3], P[i - 2], P[i - 1]
                A, B, C, D = ((q.x, q.y) for q in (p0, h1, h2, p3))
                cut = _cut_point(A, B, C, D)
                if not cut:
                    i += 1
                    continue
                kind, t = cut
                ab, abc, m, bcd, cd = _split(A, B, C, D, t)
                m = (round(m[0]), round(m[1]))
                if min(math.hypot(m[0] - A[0], m[1] - A[1]), math.hypot(D[0] - m[0], D[1] - m[1])) < NODE_MIN_PIECE:
                    i += 1
                    continue
                ab, cd = _on_line(A, B, ab), _on_line(D, C, cd)   # the old nodes keep their tangents
                abc, bcd = [(round(q[0]), round(q[1])) for q in (abc, bcd)]
                if kind == "x":
                    abc, bcd = (m[0], abc[1]), (m[0], bcd[1])
                elif kind == "y":
                    abc, bcd = (abc[0], m[1]), (bcd[0], m[1])
                else:                                        # an inflection: the two handles on one line through m
                    vx, vy = bcd[0] - abc[0], bcd[1] - abc[1]
                    L = math.hypot(vx, vy)
                    if L < 4:
                        i += 1
                        continue
                    lb = math.hypot(bcd[0] - m[0], bcd[1] - m[1])
                    la = math.hypot(m[0] - abc[0], m[1] - abc[1])
                    abc = (round(m[0] - vx / L * la), round(m[1] - vy / L * la))
                    bcd = (round(m[0] + vx / L * lb), round(m[1] + vy / L * lb))
                    v1, v2 = (m[0] - abc[0], m[1] - abc[1]), (bcd[0] - m[0], bcd[1] - m[1])
                    bend = abs(math.degrees(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1])))
                    if bend > 1.0:
                        i += 1
                        continue
                if abc == m or bcd == m:
                    i += 1
                    continue
                h1.x, h1.y = ab
                h2.x, h2.y = cd
                idx = i - 1 if i >= 1 else n - 1             # insert before h2
                new = [Point(abc[0], abc[1]), Point(m[0], m[1], "curve", True), Point(bcd[0], bcd[1])]
                pos = P.index(h2)
                c.points[pos:pos] = new
                done.append(f"{name} {kind} ({m[0]},{m[1]})")
                i = 0                                        # indices moved: start this contour again
    return done


# 5's heel (0.69). From the heel's lowest point the outline dipped 2 units under it before rising into the bowl's
# inner curve, so the edge bent three ways in 45 units. The short curve's two handles are put on the tangents of the
# nodes either side (level at the heel, the bowl curve's own direction at the other), a third of the way each: it
# bends one way, and the turn into the bowl happens at the node.
def five_heel(font):
    c = font["five"].contours[0]
    P, n = c.points, len(c.points)
    for i, p in enumerate(P):
        a, h1, h2, b, nh = P[i], P[(i + 1) % n], P[(i + 2) % n], P[(i + 3) % n], P[(i + 4) % n]
        if not (a.type and h1.type is None and h2.type is None and b.type and nh.type is None):
            continue
        if not (b.x - a.x > 20 and 10 < b.y - a.y < 60 and a.y < 0.5 * 712 and a.x < 150 and h2.y < a.y):
            continue
        run = math.hypot(b.x - a.x, b.y - a.y)
        dx, dy = nh.x - b.x, nh.y - b.y
        L = math.hypot(dx, dy)
        was = (h1.x, h1.y, h2.x, h2.y)
        h1.x, h1.y = round(a.x + run / 3), a.y
        h2.x, h2.y = round(b.x - dx / L * run / 3), round(b.y - dy / L * run / 3)
        return [f"5 heel ({a.x},{a.y}): handles {was} > {(h1.x, h1.y, h2.x, h2.y)}"]
    return ["5 heel: not found"]
