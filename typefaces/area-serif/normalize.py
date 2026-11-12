"""Part normalization: one value per shared part, applied by rule after derive.py, in the finished coordinates.

Owner, 2026-11-11: "how are all the ears, terminals, shoulders, counters, etc all designed to be consistent?" The
parts audit (audit_parts.py) showed Area Serif inherits Libre Baskerville's variation: head flags 0.91-1.27 stems,
outer feet 0.98-1.16, stems 0.96-1.12, lowercase balls 1.15-1.37. Serrif builds each part once (flags all 0.92,
feet 0.94, stems 1.00); Georgia Pro holds stems and feet exactly. This pass gives every lowercase letter:
  FLAG   one head-flag length (stems), measured left of the stem; the flag scales toward the stem
  FOOT   one outer foot projection (stems); r's right foot keeps its own width (balance), as in Serrif
  STEM   one stem thickness, measured on the straight part: a lone stem changes evenly on both sides, a stem beside
         a counter or bowl on that side
  U_ARCH u's bottom stroke as thick as n's arch
Each rule moves only the points of that part, as one piece; derive's smooth-join repair runs afterwards.
Ball terminals are set in derive.py (BALL_SIZE), where their centres are known."""
import math
import json
import os
from fontTools.pens.recordingPen import RecordingPen
import derive as D

FLAG = 1.00
FOOT = 1.00
U_ARCH_TO_N = 1.00

FLAG_GLYPHS = "ijmnpru"          # head flags at the x-height
ASC_FLAG_GLYPHS = "bdhkl"        # head flags at the ascender
FOOT_GLYPHS = {"i": "lr", "l": "lr", "m": "lr", "n": "lr", "h": "lr", "k": "l", "r": "l"}
STEM_GLYPHS = "bdpquhmnilkrj"


def flatten(glyph):
    rec = RecordingPen()
    glyph.draw(rec)
    cs, cur = [], None
    for op, args in rec.value:
        if op == "moveTo":
            cur = [args[0]]
            cs.append(cur)
        elif op == "lineTo":
            cur.append(args[0])
        elif op == "curveTo":
            p0 = cur[-1]
            a, b, c = args
            for i in range(1, 17):
                t = i / 16
                u = 1 - t
                cur.append(tuple(u ** 3 * p0[k] + 3 * u * u * t * a[k] + 3 * u * t * t * b[k] + t ** 3 * c[k] for k in (0, 1)))
    return cs


def spans_at(cs, y):
    hits = []
    for c in cs:
        for i in range(len(c)):
            a, b = c[i], c[(i + 1) % len(c)]
            if (a[1] <= y < b[1]) or (b[1] <= y < a[1]):
                t = (y - a[1]) / (b[1] - a[1])
                hits.append((a[0] + t * (b[0] - a[0]), 1 if b[1] > a[1] else -1))
    hits.sort()
    spans, w, st = [], 0, None
    for x, d in hits:
        if w == 0:
            st = x
        w += d
        if w == 0 and x - st > 0.5:
            spans.append((st, x))
    return spans


def points(glyph):
    return [p for c in glyph.contours for p in c.points]


def stem_width(font):
    return (lambda s: s[1] - s[0])(spans_at(flatten(font["n"]), D.X_HEIGHT * 0.35)[0])


def with_handles(g, test):
    """On-curve points passing test, each with its own handles (the off-curve points next to it), so a node and its
    handles always move together and no join bends."""
    out = []
    for c in g.contours:
        pts, n = c.points, len(c.points)
        for k, p in enumerate(pts):
            if p.type and test(p):
                out.append(p)
                for j in ((k - 1) % n, (k + 1) % n):
                    if pts[j].type is None and pts[j] not in out:
                        out.append(pts[j])
    return out


def move(pts, dx=0.0, dy=0.0):
    dx, dy = round(dx), round(dy)            # whole units: points start on the grid, so shapes stay exact
    for p in pts:
        p.x += dx
        p.y += dy


def normalize_flags(font, sw):
    asc = round(D.ASC_RATIO * D.X_HEIGHT)
    for names, top in ((FLAG_GLYPHS, D.X_HEIGHT), (ASC_FLAG_GLYPHS, asc)):
        for ch in names:
            g = font[ch]
            cs = flatten(g)
            st = spans_at(cs, D.X_HEIGHT * 0.6 if ch in ASC_FLAG_GLYPHS else top * 0.6)
            stem = st[-1] if ch == "d" else st[0]
            tip = with_handles(g, lambda p: top * 0.85 < p.y < top + 45 and p.x < stem[0] - 1)   # not i's or j's dot
            if not tip:
                continue
            now = stem[0] - min(p.x for p in tip if p.type)
            k = FLAG * sw / now                # scale toward the stem: points near the bracket barely move
            for p in tip:
                p.x = stem[0] - (stem[0] - p.x) * k


def normalize_feet(font, sw):
    for ch, sides in FOOT_GLYPHS.items():
        g = font[ch]
        st = spans_at(flatten(g), D.X_HEIGHT * 0.3)
        if "l" in sides:
            left = with_handles(g, lambda p: p.y < 40 and p.x < st[0][0] - 1)
            if left:
                move(left, dx=(st[0][0] - min(p.x for p in left if p.type)) - FOOT * sw)
        if "r" in sides:
            right = with_handles(g, lambda p: p.y < 40 and p.x > st[-1][1] + 1)
            if right:
                move(right, dx=FOOT * sw - (max(p.x for p in right if p.type) - st[-1][1]))


STEM_HEIGHTS = {"r": (0.25, 0.40), "u": (0.55, 0.70)}   # where each letter's stems run straight (default 0.40, 0.55)
COUNTER_TO_N = {"h": 1.00, "m": 0.97, "u": 0.97}       # Serrif and Georgia Pro: h = n; m and u 2-4% under n


def straight_stems(g, ch=""):
    """Stems of g: spans whose both edges stand on the same vertical line at 0.40 and 0.55 of the x-height
    (bowls curve, so their edges move between the two heights)."""
    cs = flatten(g)
    f_lo, f_hi = STEM_HEIGHTS.get(ch, (0.40, 0.55))
    lo, hi = spans_at(cs, D.X_HEIGHT * f_lo), spans_at(cs, D.X_HEIGHT * f_hi)
    out = []
    for a, b in hi:
        for c, d in lo:
            if abs(a - c) < 1 and abs(b - d) < 1:
                out.append((a, b))
    return out


def normalize_stems(font, sw):
    """Every lowercase stem at the n's thickness. A lone stem changes evenly on both sides; the outer stems of a
    letter change on the side facing its counter; a middle stem (m) evenly."""
    for ch in STEM_GLYPHS:
        g = font[ch]
        stems = straight_stems(g, ch)
        for idx, (a, b) in enumerate(stems):
            excess = (b - a) - sw
            if abs(excess) < 1:
                continue
            if len(stems) == 1:
                moves = [(a, excess / 2), (b, -excess / 2)]
                if ch in "bp":                      # stem on the left of a bowl: the bowl side
                    moves = [(b, -excess)]
                if ch in "dq":
                    moves = [(a, excess)]
            elif idx == 0:
                moves = [(b, -excess)]
            elif idx == len(stems) - 1:
                moves = [(a, excess)]
            else:
                moves = [(a, excess / 2), (b, -excess / 2)]
            for edge, dx in moves:
                move(with_handles(g, lambda p: abs(p.x - edge) < 1.5 and -240 < p.y < 800), dx=dx)


def counters(g, ch):
    stems = straight_stems(g, ch)
    return stems, [stems[i + 1][0] - stems[i][1] for i in range(len(stems) - 1)]


def normalize_counters(font):
    """h's counter equals n's; m's and u's are 0.97 of it. Each stem right of a counter moves as one piece with its
    foot and the near half of the arch; the advance and the accent anchors follow."""
    n_counter = counters(font["n"], "n")[1][0]
    for ch, ratio in COUNTER_TO_N.items():
        g = font[ch]
        total = 0.0
        for i in range(len(counters(g, ch)[1])):
            stems, gaps = counters(g, ch)
            dx = n_counter * ratio - gaps[i]
            cut = stems[i + 1][0] - 0.35 * gaps[i]
            move(with_handles(g, lambda p: p.x > cut), dx=dx)
            total += round(dx)
        g.width = round(g.width + total)
        for a in g.anchors:
            a.x += total / 2


def normalize_arches(font):
    """h's and m's arches as thick as n's (Serrif keeps n, h and m within 0.58-0.62 stems): the inner top of each
    counter (the arch's underside) rises by the excess, with its handles."""
    n_arch = arch_thickness(font["n"], top=True)
    for ch in "hm":
        g = font[ch]
        stems = straight_stems(g, ch)
        for i in range(len(stems) - 1):
            left, right = stems[i][1], stems[i + 1][0]
            mid = (left + right) / 2
            cs = flatten(g)
            hits = []
            for c in cs:
                for j in range(len(c)):
                    a, b = c[j], c[(j + 1) % len(c)]
                    if (a[0] <= mid < b[0]) or (b[0] <= mid < a[0]):
                        t = (mid - a[0]) / (b[0] - a[0])
                        hits.append(a[1] + t * (b[1] - a[1]))
            hits.sort()
            if len(hits) < 2:
                continue
            arch = hits[-1] - hits[-2]
            excess = arch - n_arch
            if excess < 1:
                continue
            under = hits[-2]
            # the underside's top point, if it has one, rises with its handles
            top = with_handles(g, lambda p: left + 2 < p.x < right - 2 and abs(p.y - under) < 8)
            if [p for p in top if p.type]:
                move(top, dy=excess)
                continue
            # otherwise the curve that spans the counter's middle: raising both of its handles by h raises its middle
            # by 0.75 h
            for c in g.contours:
                pts, n = c.points, len(c.points)
                on = [k for k in range(n) if pts[k].type]
                for idx, k in enumerate(on):
                    k2 = on[(idx + 1) % len(on)]
                    mids = [(k + j) % n for j in range(1, (k2 - k) % n)]
                    if len(mids) != 2:
                        continue
                    xs = sorted((pts[k].x, pts[k2].x))
                    ys = [pts[k].y, pts[k2].y] + [pts[m].y for m in mids]
                    if xs[0] < mid < xs[1] and max(ys) < under + 15 and min(ys) > D.X_HEIGHT * 0.5:
                        for m in mids:
                            pts[m].y += round(excess / 0.75)


def normalize_u_arch(font):
    n_arch = arch_thickness(font["n"], top=True)
    g = font["u"]
    now = arch_thickness(g, top=False)
    excess = now - n_arch * U_ARCH_TO_N
    if excess < 1:
        return
    st = spans_at(flatten(g), D.X_HEIGHT * 0.3)
    move(with_handles(g, lambda p: st[0][1] - 2 < p.x < st[-1][0] + 2 and 15 < p.y < D.X_HEIGHT * 0.3), dy=-excess)


def arch_thickness(g, top=True):
    cs = flatten(g)
    st = spans_at(cs, D.X_HEIGHT * 0.3)
    mid = (st[0][1] + st[-1][0]) / 2
    hits = []
    for c in cs:
        for i in range(len(c)):
            a, b = c[i], c[(i + 1) % len(c)]
            if (a[0] <= mid < b[0]) or (b[0] <= mid < a[0]):
                t = (mid - a[0]) / (b[0] - a[0])
                hits.append(a[1] + t * (b[1] - a[1]))
    hits.sort()
    pairs = [(hits[i], hits[i + 1]) for i in range(0, len(hits) - 1, 2)]
    span = max(pairs, key=lambda s: s[1]) if top else min(pairs, key=lambda s: s[0])
    return span[1] - span[0]


def g_ear_root(font):
    """g's ear leaves the top of the bowl and runs right, as Serrif's does (owner, 2026-11-11: "basically the same
    [as Serrif's], with slight adjustments"). Libre Baskerville roots the ear's upper edge low on the bowl's right
    shoulder, so raising the ear to Serrif's height (derive.G_EAR_TOP) drew a thin vertical stalk. The upper root
    moves up the bowl to EAR_ROOT_DROP below its top, staying on the bowl's ellipse (centre at the top point's x and
    the right extreme's y), and its handles follow the ellipse; the lower root stays. The neck's handles then point
    up and right, so the neck is about one stem thick. Every value comes from the bowl's own top (point 37) and right
    extreme (point 16)."""
    import math
    P = font["g"].contours[0].points
    cx, cy = P[37].x, P[16].y
    a, b = P[16].x - cx, P[37].y - cy                      # the bowl's half width and half height
    y = P[37].y - EAR_ROOT_DROP
    c = (y - cy) / b
    s_ = math.sqrt(max(0.0, 1 - c * c))
    x = cx + a * s_
    tx, ty = -a * c, b * s_                              # the ellipse's tangent toward the top
    k = math.hypot(tx, ty)
    h = 0.36 * (x - cx)                                  # handle length for the short arc to the top
    # the lower root at EAR_LOW_ANGLE on the same ellipse, its arc from the right extreme kept elliptical
    t = math.radians(EAR_LOW_ANGLE)
    lx, ly = cx + a * math.cos(t), cy + b * math.sin(t)
    kk = 4 / 3 * math.tan(t / 4)                         # cubic handle factor for an arc of angle t
    want = {34: (x, y), 35: (x + tx / k * h, y + ty / k * h), 36: (cx + h, P[37].y),
            33: (x + 30, y + 6), 32: (P[31].x - 55, P[31].y),
            17: (P[16].x, cy + b * kk), 18: (lx + a * kk * math.sin(t), ly - b * kk * math.cos(t)), 19: (lx, ly),
            20: (lx + 30, ly + 22), 21: (P[22].x - 20, P[22].y - 6)}
    for q, (px, py) in want.items():
        P[q].x, P[q].y = round(px), round(py)


EAR_LOW_ANGLE = 45                  # the ear's lower edge leaves the bowl at 45 degrees up its right side (Serrif)
EAR_ROOT_DROP = 18                  # the ear's upper edge leaves the bowl 18 units below its top (set on the Serrif overlay)


# Ball terminals as circles (owner, 2026-11-11: J, r, g's ear, a, y, c "don't match Serrif"). Libre Baskerville
# draws teardrops: the ball's top or side node has a slanted tangent, so the ball comes to a point (a beak) and its
# outer stroke runs straight into it. Serrif and Georgia Pro draw round balls. Each ball here is named by two of its
# nodes: the one with a horizontal tangent (its top or bottom) and the one with a vertical tangent (its left or
# right side). The centre is where those two meet (x of the first, y of the second); both nodes move onto one circle
# of the family's radius, and the four handles at them become quarter-circle handles, so the ball is round where it
# is free and joins the stroke where it was drawn to. Radii in stems: lowercase BALL_R (one value), J and g's ear
# their own ratio, as Serrif draws them.
KAPPA = 0.5523
BALL_R = 0.53                        # half width of a soft end, in stems (Serrif's ends 0.98-1.07 stems across)
# Where the end's centre moves, in units, so it sits where Serrif's does relative to the letter's left edge and
# x-height (measured 2026-11-11 by the largest circle inside each end; owner: "base the curves more on Serrif").
BALL_SHIFT = {"a": (-19, -33), "c": (34, -59)}
BALL_NODES = {"a": (20, 17, BALL_R), "c": (15, 18, BALL_R), "f": (31, 34, BALL_R), "r": (9, 12, BALL_R),
              "y": (62, 59, BALL_R), "j": (28, 31, BALL_R), "J": (35, 38, 0.68)}   # g's ear: Libre Baskerville's (G_EAR_LB)


def keep_spacing(g, lsb0, rsb0):
    """After a shape change, the outline shifts back to its old left side bearing and the advance follows the new
    width, so the letter keeps its own space on both sides."""
    xs = [p.x for c in g.contours for p in c.points]
    shift = lsb0 - min(xs)
    if shift:
        for c in g.contours:
            for p in c.points:
                p.x += shift
        for a_ in g.anchors:
            a_.x += shift
    g.width = round(lsb0 + (max(xs) - min(xs)) + rsb0)


def sidebearings(g):
    xs = [p.x for c in g.contours for p in c.points]
    return min(xs), g.width - max(xs)


def round_balls(font, sw):
    for ch, (ia, ib, r_st) in BALL_NODES.items():
        sb = sidebearings(font[ch]) if ch in BALL_SHIFT else None
        P = font[ch].contours[0].points
        n = len(P)
        A, B = P[ia], P[ib]
        assert A.type and B.type, (ch, ia, ib)
        R = r_st * sw
        cx, cy = A.x, B.y
        sy = 1 if A.y > cy else -1                    # A is the top (1) or the bottom (-1)
        sx = 1 if B.x > cx else -1                    # B is the right (1) or the left (-1) side
        sh = BALL_SHIFT.get(ch)
        if sh:                                        # the end's centre moves to where Serrif's sits (measured)
            cx, cy = cx + sh[0], cy + sh[1]
        moves = {ia: (cx, cy + sy * R), ib: (cx + sx * R, cy)}
        for k, (x, y) in moves.items():
            dx, dy = x - P[k].x, y - P[k].y
            P[k].x, P[k].y = x, y
            for h in (P[(k - 1) % n], P[(k + 1) % n]):
                if h.type is None:
                    h.x, h.y = h.x + dx, h.y + dy
        h = KAPPA * R
        for q in ((ia - 1) % n, (ia + 1) % n):        # horizontal tangent at A
            hp = P[q]
            if hp.type is None:
                d = 1 if hp.x > A.x else -1
                hp.x, hp.y = A.x + d * h, A.y
        for q in ((ib - 1) % n, (ib + 1) % n):        # vertical tangent at B
            hp = P[q]
            if hp.type is None:
                d = 1 if hp.y > B.y else -1
                hp.x, hp.y = B.x, B.y + d * h
        for p in P:
            p.x, p.y = round(p.x), round(p.y)
        soften_end(P, NECKS.get(ch))
        if sb:
            keep_spacing(font[ch], *sb)


# Soft ends (owner, 2026-11-11: "less of a ball, more of a smooth curve", for J and then "soften all"). Each ball's
# neck node, where the stroke's inner edge meets the ball, becomes a smooth node: its two handles turn collinear,
# so the inner edge runs into the end in one curve instead of a notch, and no circle is drawn over the end.
NECKS = {"a": 23, "c": 12, "f": 28, "r": 6, "y": 56, "j": 25}


def soften_end(P, k):
    if k is None:
        return
    n = len(P)
    node, h0, h1 = P[k], P[(k - 1) % n], P[(k + 1) % n]
    if h0.type is not None or h1.type is not None:
        return
    dx, dy = h1.x - h0.x, h1.y - h0.y
    d = math.hypot(dx, dy)
    if d < 1e-6:
        return
    dx, dy = dx / d, dy / d
    l0 = math.hypot(h0.x - node.x, h0.y - node.y)
    l1 = math.hypot(h1.x - node.x, h1.y - node.y)
    h0.x, h0.y = round(node.x - dx * l0), round(node.y - dy * l0)
    h1.x, h1.y = round(node.x + dx * l1), round(node.y + dy * l1)
    node.smooth = True


def add_circle(glyph, cx, cy, R):
    """A whole circle over the ball, wound like the glyph's outer contour; the build's overlap removal merges it, so
    the ball is round on every side however the stroke enters it."""
    from fontTools.pens.areaPen import AreaPen
    pen = AreaPen()
    glyph.contours[0].draw(pen)
    ccw = pen.value > 0
    h = KAPPA * R
    q = [(cx + R, cy), (cx, cy + R), (cx - R, cy), (cx, cy - R)]          # counter-clockwise from the right
    pts = []
    for i in range(4):
        x0, y0 = q[i]
        x1, y1 = q[(i + 1) % 4]
        t0 = [(0, h), (-h, 0), (0, -h), (h, 0)][i]                       # tangent leaving q[i]
        t1 = [(0, h), (-h, 0), (0, -h), (h, 0)][(i + 1) % 4]
        pts += [(x0 + t0[0], y0 + t0[1], None), (x1 - t1[0], y1 - t1[1], None), (x1, y1, "curve")]
    if not ccw:
        on = [pp for pp in pts if pp[2]]
        offs = [pp for pp in pts if not pp[2]]
        seq = []
        for i in range(4):                                               # reverse the order of travel
            j = (3 - i) % 4
            seq += [(offs[2 * ((j) % 4) + 1][0], offs[2 * (j % 4) + 1][1], None),
                    (offs[2 * (j % 4)][0], offs[2 * (j % 4)][1], None), (on[(j - 1) % 4][0], on[(j - 1) % 4][1], "curve")]
        pts = seq
    from ufoLib2.objects import Contour, Point
    glyph.contours.append(Contour(points=[Point(round(x), round(y), t, smooth=bool(t)) for x, y, t in pts]))


def terminal_approach(font, sw):
    """How the stroke reaches the ball, from the Serrif overlays (owner, 2026-11-11: J and r "don't match Serrif").
    J: Serrif's hook is a round U and its ball sits at the far end on a thin neck; Libre Baskerville's hook climbs
    early, filling the hook's counter. The neck node moves to the ball's lower right and the inner bottom runs further
    left before it rises. r: Serrif's ball hangs lower and further right, under a thinner arm; the ball moves and the
    arm's underside rises. Every position is relative to the ball's centre and radius (round_balls)."""
    j_smooth_end(font)
    y_smooth_end(font)
    r0 = font["r"].contours[0]
    dx, dy = R_BALL_MOVE
    P = r0.points
    for k in range(7, 16):                      # the ball's own nodes and handles in the stroke follow it
        P[k].x, P[k].y = P[k].x + dx, P[k].y + dy
    for k, lift in R_ARM_LIFT.items():          # the arm's underside, thinner toward the ball
        P[k].y += lift


def j_smooth_end(font):
    """J's and j's ends as one smooth curve, not a ball on a neck (owner, 2026-11-11: "not as apparent as a ball,
    more of a smooth curve; follow Serrif's overall shape and curve, don't copy it"; then "soften all"). The two hooks
    share Libre Baskerville's point order (j's indices are J's minus 7), so one construction draws both: the inside of
    the hook rises in a quarter round, through a smooth node on the end's right side, over the rounded top and down
    the left side into the bottom curve. Positions are relative to the end's centre (cx, cy) and half width R."""
    for name, b in (("J", 29), ("j", 22)):
        g = font[name]
        while len(g.contours) > 1 and name == "J":    # round_balls' circle: not wanted here
            g.contours.pop()
        P = g.contours[0].points
        n_ = len(P)
        I = lambda o: (b + o) % n_                    # J's own indices are b + 0 ... b + 11, then the outer bottom
        cx, cy = P[I(6)].x, P[I(9)].y
        R = P[I(6)].y - cy
        k = KAPPA * R
        dx, dy = J_END_TANGENT
        n = math.hypot(dx, dy)
        dx, dy = dx / n, dy / n                       # direction of travel up the end's right side
        nx, ny = cx + J_END_SIDE[0] * R, cy + J_END_SIDE[1] * R
        lx, low_y = P[I(12)].x, P[I(12)].y
        ib = P[I(0)]
        want = {I(3): (nx, ny), I(4): (nx + J_END_UP * R * dx, ny + J_END_UP * R * dy),
                I(2): (nx - J_END_DOWN * (ny - ib.y) * dx, ny - J_END_DOWN * (ny - ib.y) * dy),
                I(1): (ib.x - J_END_DOWN * (ib.x - nx), ib.y),
                I(5): (cx + k, cy + R), I(7): (cx - k, cy + R), I(8): (cx - R, cy + k),
                I(10): (cx - R, low_y + 0.42 * (cy - low_y)), I(11): (lx - 0.62 * (lx - (cx - R)), low_y)}
        for q, (x, y) in want.items():
            P[q].x, P[q].y = round(x), round(y)
        P[I(3)].smooth = True


def y_smooth_end(font):
    """y's end has no top node: the tail's upper edge ran straight into a pointed end. Its neck node (56) becomes the
    end's rounded top, a smooth node with a horizontal tangent, over the end's centre; its left (59) and bottom (62)
    stay where round_balls put them."""
    P = font["y"].contours[0].points
    cx, cy = P[62].x, P[59].y
    R = cx - P[59].x
    k = KAPPA * R
    tx, ty = P[56].x, cy + R * Y_END_TOP
    inc = math.hypot(P[53].x - tx, P[53].y - ty)
    want = {56: (cx + 0.15 * R, ty), 57: (cx + 0.15 * R - k, ty), 58: (cx - R, cy + k),
            55: (cx + 0.15 * R + Y_END_IN * inc, ty)}
    for q, (x, y) in want.items():
        P[q].x, P[q].y = round(x), round(y)
    P[56].smooth = True


Y_END_TOP = 1.05     # the y's end rises a little above its half width, so it reads as a soft swelling
Y_END_IN = 0.35      # the upper edge's handle into the top, as a share of the distance from the tail


J_END_SIDE = (0.98, -0.12)    # the smooth node on the end's right side, in R from its centre: at full width, so the top is a half-round, not a peak
J_END_TANGENT = (-0.04, 1.0)  # the curve's direction through it: straight up, into the round top
J_END_UP, J_END_DOWN = 0.55, 0.68  # handle toward the top (in R); handles of the inside's quarter round (of its span)


EAR_UNDER_OUT, EAR_UNDER_IN = 0.35, 0.35   # the ear underside's handles, as shares of its width
EAR_SHIFT = (-15, 0)                 # g: the ear's ball reaches less far right, as in the Serrif overlay


def g_ear_reach(font):
    """After the ear is rooted (g_ear_root), its ball and the nodes around it (points 21-31 and the ball's circle)
    move by EAR_SHIFT; the roots stay on the bowl, so the neck shortens."""
    g = font["g"]
    dx, dy = EAR_SHIFT
    for k in range(21, 32):
        p = g.contours[0].points[k]
        p.x, p.y = p.x + dx, p.y + dy
    for c in g.contours[2:]:
        for p in c.points:
            p.x, p.y = p.x + dx, p.y + dy
    # one smooth underside: a single cubic from the root (19) that rises steadily and arrives level at the end's
    # bottom (25), split at its middle so points 20-24 lie exactly on it (no hump, no wave)
    P = g.contours[0].points
    r, e = P[19], P[25]
    span = e.x - r.x
    c0 = (r.x, r.y)
    c1 = (r.x + EAR_UNDER_OUT * span, r.y + 0.6 * (e.y - r.y))
    c2 = (e.x - EAR_UNDER_IN * span, e.y)
    c3 = (e.x, e.y)
    mid = lambda a, b: ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    m01, m12, m23 = mid(c0, c1), mid(c1, c2), mid(c2, c3)
    a_, b_ = mid(m01, m12), mid(m12, m23)
    m = mid(a_, b_)
    for q, (x, y) in {20: m01, 21: a_, 22: m, 23: b_, 24: m23}.items():
        P[q].x, P[q].y = round(x), round(y)
    P[22].smooth = True


R_BALL_MOVE = (12, -8)
R_ARM_LIFT = {5: 6, 6: 10}


# J's end, set from Serrif measured at the same cap height (owner, 2026-11-11: "match that exactly"; measured, not
# traced: Serrif's licence allows measuring only). Values in cap heights, x from the stem's right edge.
J_BALL_LEFT = 0.580       # the ball's left edge (Serrif 580/1000; was 528)
J_BALL_CY = 0.236         # the ball's centre above the hook's bottom (Serrif: widest at 0.20-0.25, top about 0.31)
J_BALL_R = 0.072          # the terminal's half width (a smooth end, smaller than Serrif's ball by choice)
J_LOW_X = 0.310           # the hook's lowest point (Serrif about 0.31; was 0.36)
J_LOW_Y = -0.011          # its depth below the baseline (Serrif -11/1000)
J_BALL_NARROW = 0.92      # the ball's width / height (Serrif's drop)
J_BOTTOM = 0.053          # the bottom stroke's thickness (Serrif 53/1000; was 77)


def j_end(font):
    """Moves J's ball (points 33-39) and reshapes the hook's bottom (outer 0, inner 29) to Serrif's measures. Runs
    before round_balls, which then makes the ball a circle of J_BALL_R about its new centre."""
    P = font["J"].contours[0].points
    cap = max(p.y for c in font["H"].contours for p in c.points)
    sr = P[3].x                                           # the stem's right edge
    R = J_BALL_R * cap
    low_y = J_LOW_Y * cap
    cx, cy = sr - J_BALL_LEFT * cap + R, low_y + J_BALL_CY * cap
    dx, dy = cx - P[35].x, cy - P[38].y                    # the ball's top node gives x, its left node y
    for k in range(33, 40):
        P[k].x, P[k].y = P[k].x + dx, P[k].y + dy
    BALL_NODES["J"] = (35, 38, R / stem_width(font))
    lx = sr - J_LOW_X * cap
    P[0].x, P[0].y = lx, low_y                             # outer bottom, horizontal tangent
    P[1].x, P[1].y = lx + 0.55 * (sr - lx), low_y
    P[40].x, P[40].y = lx - 0.5 * (lx - (cx - R)), low_y
    P[39].x, P[39].y = cx - R, low_y + 0.45 * (cy - low_y)  # up the ball's left side
    iy = low_y + J_BOTTOM * cap                            # inner bottom
    si = P[26].x                                           # the stem's inner edge
    P[29].x, P[29].y = lx + 0.04 * cap, iy
    P[28].x, P[28].y = P[29].x + 0.55 * (si - P[29].x), iy
    P[30].x, P[30].y = P[29].x - 0.03 * cap, iy
    for p in P:
        p.x, p.y = round(p.x), round(p.y)


def f_narrow(font):
    """f was the widest of the six faces (ink 0.90 x-height; Serrif 0.73, Georgia Pro 0.79): Libre Baskerville's
    hook reaches far right. Its arch and end (points 22-37) scale horizontally about the stem's right edge by
    F_HOOK_SCALE, so the end's centre lands where Serrif's does; the end then drops F_END_DROP units (Serrif's sits
    lower). The crossbar stays."""
    P = font["f"].contours[0].points
    x0 = P[19].x
    for k in range(22, 38):
        P[k].x = round(x0 + (P[k].x - x0) * F_HOOK_SCALE)
    for k in range(28, 37):
        P[k].y -= F_END_DROP
    g = font["f"]                                  # the advance follows the hook in, so "fi", "ft" keep their fit
    right = max(p.x for c in g.contours for p in c.points)
    g.width = round(g.width - (F_RIGHT_BEFORE - right)) if right < F_RIGHT_BEFORE else g.width


F_HOOK_SCALE = 0.70
F_END_DROP = 20
F_RIGHT_BEFORE = 493      # f's rightmost ink before narrowing (its end's right side)


def d_joins(font):
    """d, toward Serrif (owner, 2026-11-11): the bowl's top joined the stem 55 units under the x-height (points
    35-38) and the stem's bottom dipped to -10 before the foot (points 5-6). The join rises to D_JOIN_Y with the
    bowl arriving at a shallower angle, and the stem and foot sit flat on the baseline, as Serrif's do."""
    P = font["d"].contours[0].points
    P[35].y = P[36].y = D_JOIN_Y
    P[37].x, P[37].y = D_JOIN_HANDLE
    P[5].y = 0
    P[6].y = 0


D_JOIN_Y = 488
D_JOIN_HANDLE = (425, 512)


def f_bar(font):
    """f's crossbar sat 19 units under the x-height; Serrif's top is on it. Both ends of the bar rise together."""
    P = font["f"].contours[0].points
    for k in (15, 16, 17, 18, 41, 42, 43, 44):
        P[k].y += F_BAR_RAISE


F_BAR_RAISE = 19


def k_leg_foot(font):
    """k: the right leg ends with a foot serif to the right only, as Serrif's does (owner, 2026-11-11: "no left side
    serif for the right leg of the k"). The leg's left edge runs straight on from point 17 at its own slope to the
    baseline; points 18-30 (the left half of the foot and its corner) go."""
    from ufoLib2.objects import Point
    c = font["k"].contours[0]
    P = c.points
    a, b = P[16], P[17]
    slope = (b.x - a.x) / (b.y - a.y)
    x0 = round(b.x - slope * b.y)
    c.points[18:31] = [Point(x0, 0, "line")]


def c_no_spur(font):
    """C: the lower end had a serif hanging to the baseline (points 13-15); Serrif and Georgia Pro end the stroke with
    a plain cut (owner, 2026-11-11: "no need for a bottom serif tail on C"). The end becomes a straight cut from the
    outer curve's end (12) to the inner curve's start (16)."""
    c = font["C"].contours[0]
    del c.points[13:16]
    c.points[13].type = "line"


def w_apex(font):
    """W: Georgia Pro's middle apex is the two middle strokes meeting at cap height in a narrow flat, with no serif
    (owner, 2026-11-11: "the middle tallest point should not have a serif"). Points 1-23 (Libre Baskerville's
    serifed middle top) go; each stroke's edge runs straight on to the cap height."""
    from ufoLib2.objects import Point
    c = font["W"].contours[0]
    P = c.points
    cap = 712
    def at_cap(a, b):                       # the line through a and b, where it meets the cap height
        return round(a.x + (b.x - a.x) * (cap - a.y) / (b.y - a.y))
    xr = at_cap(P[81], P[0])                # the right middle stroke's edge (762,136)->(637,554)
    xl = at_cap(P[25], P[24])               # the left middle stroke's edge (356,140)->(516,582)
    c.points[1:24] = [Point(xr, cap, "line"), Point(xl, cap, "line")]
    c.points[3].type = "line"


def K_leg(font):
    """K: like the k, the leg ends in a foot serif to the right only (owner: "lowercase k consistency"); its left
    edge runs straight on from points 16-17 to the baseline. Points 18-30 go."""
    from ufoLib2.objects import Point
    c = font["K"].contours[0]
    a, b = c.points[16], c.points[17]
    x0 = round(b.x - (b.x - a.x) / (b.y - a.y) * b.y)
    c.points[18:31] = [Point(x0, 0, "line")]


def T_symmetric(font):
    """T: Libre Baskerville's top serifs differ left and right (the right one slants). Georgia Pro and Serrif draw
    them alike (owner: "should it be more symmetrical?"). The right half (points 32-39 and 0) mirrors the left half
    (points 1-9) about the stem's centre line."""
    P = font["T"].contours[0].points
    axis = (P[9].x + P[32].x) / 2
    mirror = {0: 1, 39: 2, 38: 3, 37: 4, 36: 5, 35: 6, 34: 7, 33: 8}
    for r, l in mirror.items():
        P[r].x, P[r].y = round(2 * axis - P[l].x), P[l].y


def G_chin(font):
    """G: Libre Baskerville's bowl curls into a spur at the foot of the right stem (points 3-6). In Georgia Pro the
    stem's outer edge runs straight down nearly to the bottom and the bowl meets it there at a corner: the stem now
    runs down to G_CHIN_JOIN and the bowl's outer curve rises gently into that corner. The bar's right serif is G_BAR_TRIM units shorter, as in Georgia Pro."""
    P = font["G"].contours[0].points
    sx = P[7].x                                 # the stem's outer edge
    # one curve from the bowl's bottom (0) to the corner at the stem, split at its middle so points 1-5 lie on it
    x0, y0, J = P[0].x, P[0].y, G_CHIN_JOIN
    w = sx - x0
    c = [(x0, y0), (x0 + 0.50 * w, y0), (sx - 0.22 * w, J - 0.10 * (J - y0)), (sx, J)]
    mid = lambda a, b: ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    m01, m12, m23 = mid(c[0], c[1]), mid(c[1], c[2]), mid(c[2], c[3])
    a_, b_ = mid(m01, m12), mid(m12, m23)
    for k, (x, y) in {1: m01, 2: a_, 3: mid(a_, b_), 4: b_, 5: m23, 6: c[3]}.items():
        P[k].x, P[k].y = round(x), round(y)
    P[3].smooth = True
    P[6].smooth = False
    for k in range(10, 18):
        P[k].x -= G_BAR_TRIM
    P[9].x, P[9].y = sx + round(0.5 * (P[10].x - sx)), P[10].y
    P[8].x, P[8].y = sx, round(P[7].y + 0.5 * (P[10].y - P[7].y))


G_CHIN_JOIN = 100      # Georgia Pro's stem reaches about 0.09 cap height before the bowl meets it
G_BAR_TRIM = 45


def thin_diagonals(g, k_neg, k_pos, min_len=80):
    """Thins the two strokes of a crossing letter (X, x) by moving each stroke's straight edges toward each other,
    horizontally. Edges are the long straight segments; they group by direction (k_neg for the stroke running
    top-left to bottom-right, k_pos for the other) and, within a direction, into a left and a right edge by where
    they cross the baseline. A node on one edge moves with it (with its handles); a node where two edges meet (the
    crossing's notches) moves to where the moved edges now intersect, so both strokes stay straight."""
    pts = [(ci, pi) for ci, c in enumerate(g.contours) for pi in range(len(c.points))]
    lines = []                                      # (ci, a_index, b_index, slope dx/dy, intercept)
    for ci, c in enumerate(g.contours):
        P, n = c.points, len(c.points)
        for i in range(n):
            a_, b_ = P[i], P[(i + 1) % n]
            if b_.type != "line" or a_.type is None:
                continue
            dx, dy = b_.x - a_.x, b_.y - a_.y
            if (dx * dx + dy * dy) ** 0.5 < min_len or abs(dy) < 1 or not 0.2 < abs(dx / dy) < 5:
                continue
            m = dx / dy
            lines.append([ci, i, (i + 1) % n, m, a_.x - m * a_.y])
    shifts = {}
    for sign, k in ((-1, k_neg), (1, k_pos)):
        group = [L for L in lines if (L[3] > 0) == (sign > 0)]
        if len(group) < 2:
            continue
        bs = sorted(L[4] for L in group)
        cut = max(range(1, len(bs)), key=lambda j: bs[j] - bs[j - 1])
        left, right = bs[:cut], bs[cut:]
        width = sum(right) / len(right) - sum(left) / len(left)
        d = (1 - k) * width / 2
        for L in group:
            L.append(d if L[4] in left else -d)    # left edge moves right, right edge moves left
            shifts.setdefault((L[0], L[1]), []).append(L)
            shifts.setdefault((L[0], L[2]), []).append(L)
    for (ci, pi), ls in shifts.items():
        P, n = g.contours[ci].points, len(g.contours[ci].points)
        p = P[pi]
        if len(ls) == 1 or abs(ls[0][3] - ls[1][3]) < 1e-6:
            dx = ls[0][5]
            moved = [(p, dx)] + [(P[q], dx) for q in ((pi - 1) % n, (pi + 1) % n) if P[q].type is None]
            for q, ddx in moved:
                q.x += ddx
        else:                                       # on two edges: the new edges' intersection
            (m1, b1, s1), (m2, b2, s2) = (ls[0][3], ls[0][4], ls[0][5]), (ls[1][3], ls[1][4], ls[1][5])
            b1, b2 = b1 + s1, b2 + s2
            y = (b2 - b1) / (m1 - m2)
            p.x, p.y = m1 * y + b1, y
    for c in g.contours:
        for p in c.points:
            p.x, p.y = round(p.x), round(p.y)


# x and X were heavier than Georgia Pro and Serrif (owner: "the legs are a bit too thick"), measured against each
# face's own n stem: x thick 1.24-1.27 (Serrif 1.22, Georgia Pro 1.11), thin 0.58-0.71 (0.50, 0.47); X thick
# 1.44-1.53 (1.37, 1.33), thin 0.73-0.75 (0.62, 0.60).
THIN_X = {"x": (0.92, 0.80), "X": (0.92, 0.84)}


def S_tails(font):
    """S: the top and bottom end serifs (points 21-22 at the top right, 0 and 43 at the bottom left) were 20-35
    units wide, thinner than the curves (owner, 2026-11-11: "make the top and bottom tails a bit wider, match the
    width of the curves"). Each grows outward to the thickness of the S's top stroke, as Georgia Pro's do."""
    sb = sidebearings(font["S"])
    P = font["S"].contours[0].points
    W = P[27].y - P[17].y                      # the top stroke's thickness, at the S's top
    P[21].x = P[20].x + W
    P[22].x = P[23].x + W
    P[43].x = P[42].x - W
    P[0].x = P[1].x - W
    keep_spacing(font["S"], *sb)


def e_bar_join(font):
    """e: the counter's wall stepped sideways just under the crossbar (points 6-9), a visible kink (owner, 2026-11-11).
    Serrif's wall runs straight up into the bar with only a small round. The wall now keeps its line (x of point 6)
    up to a fillet of E_FILLET units under the bar."""
    P = font["e"].contours[0].points
    x, bar = P[6].x, P[9].y
    P[7].x, P[7].y = x, bar - E_FILLET - KAPPA * 0           # straight on up the wall
    P[7].y = round(P[6].y + 0.55 * (bar - E_FILLET - P[6].y))
    P[8].x, P[8].y = x, bar - round(E_FILLET * (1 - KAPPA))
    P[9].x = x + E_FILLET


E_FILLET = 8


OWNER_EDITS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "owner_edits.json")


OWNER_MOVED = {}   # glyph -> {(contour, point)} the owner moved; cleanup leaves these where they are


def OWNER_NAMES():
    return list(json.load(open(OWNER_EDITS))) if os.path.exists(OWNER_EDITS) else []


def owner_edits(font, late=False, final=False):
    """The owner's own point edits from the point editor page, folded in by apply_edits.py as moves (dx, dy per
    point) against the build they were made on, so every rule before this still shapes the glyph. A point the owner
    moved goes exactly where they put it (the save's own coordinates, offset by the median shift of the points they
    did not move, i.e. the glyph's spacing), so a later rule never pulls an edit away (owner, 2026-11-12: "some of
    my bezier curve changes dont look like they were implemented at all"). A move of a node does not drag its handles here: the editor already recorded the handles'
    own moves. A glyph whose structure has changed since the edit is skipped and reported. The curve hygiene that
    follows cleans up (collinear handles at smooth nodes, handles inside their triangles, whole units)."""
    if not os.path.exists(OWNER_EDITS):
        return set()
    done = set()
    entries = []
    for name, e in json.load(open(OWNER_EDITS)).items():
        if e.get("early"):                        # an earlier save's edits, kept apart from a later (late) save
            entries.append((name, dict(e["early"], late=False)))
        entries.append((name, e))
    for name, e in entries:
        if name not in font or not (e.get("moves") or e.get("smooth") or e.get("advance")):
            continue
        if (e.get("stage") == "final") != final:   # final: saved on the cleaned-up points (simplify), applied last
            continue
        if not final and bool(e.get("late")) != late:   # late: saved on points a later rule makes, applied after it
            continue
        g = font[name]
        if e.get("shape") and e["shape"] != [len(c.points) for c in g.contours]:
            print(f"owner edit for {name} skipped: the glyph's points changed since it was made")
            continue
        xs0 = [p.x for c in g.contours for p in c.points]
        lsb0, rsb0 = min(xs0), g.width - max(xs0)
        try:
            moved = {(ci, pi) for ci, pi, *_ in e.get("moves", [])}
            saved = e.get("saved")
            if saved:   # where the owner put each point, offset by how far the rest of the glyph has moved since
                import statistics
                rest = [(p.x - q[0], p.y - q[1]) for ci, (c, cs) in enumerate(zip(g.contours, saved))
                        for pi, (p, q) in enumerate(zip(c.points, cs)) if (ci, pi) not in moved]
                ox = statistics.median(r[0] for r in rest) if rest else 0
                oy = statistics.median(r[1] for r in rest) if rest else 0
            for ci, pi, dx, dy in e.get("moves", []):
                p = g.contours[ci].points[pi]
                if saved:
                    p.x, p.y = saved[ci][pi][0] + ox, saved[ci][pi][1] + oy
                else:
                    p.x, p.y = p.x + dx, p.y + dy
                OWNER_MOVED.setdefault(name, set()).add((ci, pi))
            for ci, pi, dx, dy in e.get("extra_moves", []):   # a later small nudge, relative to the placed points
                p = g.contours[ci].points[pi]
                p.x, p.y = p.x + dx, p.y + dy
                OWNER_MOVED.setdefault(name, set()).add((ci, pi))
            for ci, pi, sm in e.get("smooth", []):
                g.contours[ci].points[pi].smooth = bool(sm)
        except IndexError:
            print(f"owner edit for {name} skipped: the build's points changed since it was made")
            continue
        # the glyph keeps its side spacing: the outline shifts back to its old left side bearing and the advance
        # follows the new width (an edit that widens a letter widens its advance, not into its neighbours)
        xs1 = [p.x for c in g.contours for p in c.points]
        shift = lsb0 - min(xs1)
        if shift:
            for c in g.contours:
                for p in c.points:
                    p.x += shift
            for a_ in g.anchors:
                a_.x += shift
        g.width = round(lsb0 + (max(xs1) - min(xs1)) + rsb0 + (e.get("advance", 0) or 0))
        done.add(name)
    return done


def normalize(font):
    sw = stem_width(font)
    touched = set(FLAG_GLYPHS + ASC_FLAG_GLYPHS + "".join(FOOT_GLYPHS) + STEM_GLYPHS + "u" + "".join(COUNTER_TO_N)
                  + "".join(CAP_SERIFS))
    touched |= {g.name for g in font if any((p.identifier or "").startswith("bracket")   # shortened brackets
                                            for c in g.contours for p in c.points)}
    before = {ch: [[type("P", (), {"x": p.x, "y": p.y})() for p in c.points] for c in font[ch].contours]
              for ch in touched}
    normalize_stems(font, sw)
    normalize_flags(font, sw)
    normalize_feet(font, sw)
    cap_serifs(font)
    normalize_u_arch(font)
    normalize_counters(font)
    normalize_arches(font)                   # after counters: moving a stem reshapes its arch
    if not D.G_EAR_LB:
        g_ear_root(font)
    e_bar_join(font)
    f_narrow(font)
    f_bar(font)
    d_joins(font)
    k_leg_foot(font)
    c_no_spur(font)
    w_apex(font)
    K_leg(font)
    T_symmetric(font)
    G_chin(font)
    S_tails(font)
    j_end(font)
    round_balls(font, sw)
    terminal_approach(font, sw)
    if not D.G_EAR_LB:
        g_ear_reach(font)
    figures(font)                            # rebuilt or reshaped: their old points no longer match, so they get the
    figs = set(FIG_STRETCH) | FIG_REBUILT | {"one", "two", "five"}   # gentle cleanup below, not the clamp
    touched -= figs
    for ch in figs:
        D.make_smooth(font[ch])
        D.snap_smooth(font[ch])
        for p in points(font[ch]):
            p.x, p.y = round(p.x), round(p.y)
    for ch in OWNER_NAMES():                 # hygiene compares against the glyph before the owner's moves, so a handle
        if ch in font and ch not in before:  # a move pushed past its curve's corner is pulled back
            before[ch] = [[type("P", (), {"x": p.x, "y": p.y})() for p in c.points] for c in font[ch].contours]
    edited = owner_edits(font)
    if "S" in edited:     # the note on that same save asked for wider tails: the rule wins over the saved tail points
        S_tails(font)
    cap_barbs(font)       # after the owner's points: the owner asked for every capital's barbs to be shorter (S too)
    barb_flares(font)
    bowl_widths(font)
    G_bar(font)
    # Q: the owner prefers Libre Baskerville's tail (2026-11-12: "i like baskervilles Q"): Q_tail and Q_tail_right off
    G_bottom(font)
    touched.discard("G")
    k_junction(font)
    inner_serifs(font)
    Z_bottom(font)
    r_ear(font)
    U_stem(font)
    letter_tension(font)
    touched.discard("Q")                     # its points changed count: the clamp's snapshot no longer matches
    tails(font, sw)       # the owner asked for c, e and t's tails to match: the rule wins over their saved tail points
    unify_diagonals(font, sw)   # one weight per diagonal role; moves the owner's nodes with their edges, shapes kept
    A_inner_leg(font)
    touched.discard("A")                     # its points changed count: the clamp's snapshot no longer matches
    straight_through(font["x"])
    # R_crotch(font): the owner's 0.15 save reshaped this notch themselves (moves on 50-54); kept for a later note
    # R_leg(font): tried 2026-11-12; Serrif's inner leg bows only ~7 units left of a straight line, the straight
    # edge is closer to it than this curve
    touched |= edited
    for ch in edited:                        # the owner's glyphs: gentle cleanup only. Their curves are theirs, so no
        g = font[ch]                         # clamping into the old shape; smooth nodes straighten by turning the
        D.make_smooth(g, frozenset(OWNER_MOVED.get(ch, ())))   # handle they did not move; nothing else changes
        D.snap_smooth(g)
        for p in points(g):
            p.x, p.y = round(p.x), round(p.y)
    for ch in touched - edited:              # the same curve hygiene as derive.py, against the points before
        g = font[ch]
        fixed = D.keep_monotone(g, before[ch])
        D.make_smooth(g, fixed)
        for _ in range(2):                   # clamp last, so smoothing never pushes a handle back out
            D.keep_monotone(g, before[ch])
            D.keep_triangles(g, before[ch])
            for p in points(g):
                p.x, p.y = round(p.x), round(p.y)
        D.snap_smooth(g)
        align_short_handles(g, before[ch])
        D.keep_triangles(g, before[ch])
        for p in points(g):
            p.x, p.y = round(p.x), round(p.y)
    # a_junction(font): reverted 2026-11-12 (owner: "what happened to the a? this is horrible"): it turned the
    # bowl-to-stem join into a curve dropping straight down the stem, a heavy wedge unlike every reference
    one_curve_shoulders(font)
    late = owner_edits(font, late=True)      # saved on later builds' points (G 0.21; k n r t u 0.23)
    for ch in late:
        g = font[ch]
        D.make_smooth(g, frozenset(OWNER_MOVED.get(ch, ())))
        D.snap_smooth(g)
        for p in points(g):
            p.x, p.y = round(p.x), round(p.y)
    k_junction(font)                         # the owner moved k's junction (56): the leg's start follows it
    arch_rise(font)
    bowl_junctions(font)
    merge_quarters(font)
    u_bowl(font)                             # on the merged points
    s_barbs(font)
    simplify(font)
    rejoin(font)
    rejoin_fit(font)
    owner_positions(font)                    # saves made on 0.24's points, matched by position
    for ch in ("j", "h", "s"):                # smooth nodes the owner's moved handles left bent
        D.make_smooth(font[ch], frozenset(OWNER_MOVED.get(ch, ())))
        for p in points(font[ch]):
            p.x, p.y = round(p.x), round(p.y)
    r_ear_redraw(font)
    f_hook_redraw(font)
    h_j_smooth(font)
    arch_tops(font, stem_width(font))
    five_foot_handle(font)
    t_top_clean(font)
    round_ends(font)
    G_bottom_serrif(font)
    f_hook_serrif(font)
    final = owner_edits(font, final=True)    # saves made on the cleaned-up points
    for ch in final:
        g = font[ch]
        D.make_smooth(g, frozenset(OWNER_MOVED.get(ch, ())))
        D.snap_smooth(g)
        for p in points(g):
            p.x, p.y = round(p.x), round(p.y)
    for g in font:                           # derive.py's bracket marks were for this build only
        for c in g.contours:
            for p in c.points:
                if (p.identifier or "").startswith(("bracket", "acute")):
                    p.identifier = None
    return font


def _turns_back(p0, c1, c2, p3):
    for ax in ("x", "y"):
        lo, hi = sorted((getattr(p0, ax), getattr(p3, ax)))
        if not all(lo <= getattr(q, ax) <= hi for q in (c1, c2)):
            return True
    return False


def _was_turning(ends, old, short):
    nx, ny = short.x, short.y
    short.x, short.y = old
    r = _turns_back(*ends)
    short.x, short.y = nx, ny
    return r


def align_short_handles(g, before, tol=0.5):
    """Last pass: at a smooth node whose handles still bend after rounding, turn the shorter handle onto the longer
    one's line (the smaller move) and round it."""
    for c in g.contours:
        pts, n = c.points, len(c.points)
        for k, p in enumerate(pts):
            a, b = pts[(k - 1) % n], pts[(k + 1) % n]
            if not (p.type and p.smooth and a.type is None and b.type is None):
                continue
            la, lb = math.dist((a.x, a.y), (p.x, p.y)), math.dist((b.x, b.y), (p.x, p.y))
            if la < 1 or lb < 1:
                continue
            long_, short, ls = (a, b, lb) if la >= lb else (b, a, la)
            ux, uy = (p.x - long_.x), (p.y - long_.y)
            ul = math.hypot(ux, uy)
            nx, ny = round(p.x + ux / ul * ls), round(p.y + uy / ul * ls)
            off = abs((short.x - p.x) * uy - (short.y - p.y) * ux) / ul
            if off > tol:
                old = (short.x, short.y)
                short.x, short.y = nx, ny
                # keep the change only if the short handle's curve does not now turn back where it did not before
                j = (k + 1) % n if short is b else (k - 1) % n
                seg = [pts[(j + d) % n] for d in ((0, 1, 2) if short is b else (-2, -1, 0))]
                ends = (p, seg[1], seg[2], pts[(j + 2) % n]) if short is b else (pts[(j - 2) % n], seg[0], seg[1], p)
                if all(q is not None for q in ends) and _turns_back(*ends) and not _was_turning(ends, old, short):
                    short.x, short.y = old


# Figures (owner, 2026-11-11: "shape more like georgia pro and serrif"). Libre Baskerville's figures are narrow and
# carry its swashes: a beaked 7, a serifed 4, a curled 5 flag, a 2 whose base rises into a serif. Georgia Pro and
# Serrif draw them plainer and wider. Values below are measured on both at one cap height (cap thousandths); stroke
# thicknesses are Georgia Pro's scaled by Area's figure stem over Georgia's (117 / 136).
FIG_STRETCH = {          # glyph: (zone left, zone right, added width): everything right of the zone moves right by
    "two": (250, 395, 25),     # the added width, the zone stretches evenly, so strokes outside it keep their thickness
    "three": (240, 380, 36),   # ink widths (cap): Georgia .67-.71, Serrif .68-.75; Area was .62-.67
    "five": (215, 355, 42),
    "six": (170, 380, 30),
    "nine": (210, 420, 30),
    "eight": (160, 395, 58),
}
FIG_REBUILT = {"four", "seven"}


def _stretch(g, a, b, d):
    for c in g.contours:
        for p in c.points:
            t = min(1, max(0, (p.x - a) / (b - a)))
            p.x = round(p.x + d * t)


def _contour(spec):
    """[(x, y, type)] in cap thousandths, from the ink's left edge -> a ufoLib2 contour in units."""
    from ufoLib2.objects import Contour, Point
    k = 712 / 1000
    return Contour(points=[Point(round(x * k), round(y * k), t) for x, y, t in spec])


def seven_georgia(font):
    """7: Georgia Pro's construction. A flat bar (no beak above it) with a short wedge down at its left end, and a
    straight stem of even width from the bar's right end to the baseline (Serrif's curves; Georgia's is straight,
    owner: "shape more like georgia pro"). Ink .70 cap (Georgia .735, Serrif .674); bar .101, stem .074 across."""
    W, BAR, STUB, STUB_LOW, STEM = 700, 101, 45, 723, 74
    def right(y):                       # the stem's right edge: Georgia's slope (x 238 at y 20, 624 at y 800)
        return 238 + 0.495 * (y - 20)
    yb = 1000 - BAR
    y_top = 20 + (W - 238) / 0.495      # where the right edge meets the bar's right end
    xl = right(yb) - STEM               # the stem's left edge at the bar's underside
    spec = [(0, 1000, "line"), (0, STUB_LOW, "line"), (STUB, STUB_LOW, "line"),   # a short upright serif, flat
            (STUB, 820, None), (STUB + 30, yb, None), (STUB + 110, yb, "curve"),    # underneath, bracketed into the bar
            (xl, yb, "line"),                                                       # the inner corner is sharp (Georgia)
            (right(0) - STEM, 0, "line"), (right(0), 0, "line"), (W, y_top, "line"), (W, 1000, "line")]
    _replace(font["seven"], [spec], lsb=0.055, rsb=0.035)


def four_georgia(font):
    """4: no serifs (owner: "remove the serifs on the side?"; Georgia Pro and Serrif have none). The bar runs past
    the stem, the stem runs straight to the baseline, and the bar sits at Georgia's and Serrif's height. Ink .75 cap
    (Georgia .73, Serrif .81); stem .117, bar .080 thick at .29-.37 cap, diagonal .068 across."""
    W, T, B0, B1, D = 750, 117, 289, 369, 68
    sl, sr = 0.70 * W - T / 2, 0.70 * W + T / 2      # stem at 0.70 of the ink (Georgia .71, Serrif .68)
    apex = 1013
    xa = sl + 25 / 136 * T                           # the diagonal's outer edge meets the top just inside the stem
    slope = xa / (apex - B1)
    yi = B1 + (sl - D) / slope                       # the counter's top, on the stem
    outer = [(sl, 0, "line"), (sr, 0, "line"), (sr, B0, "line"), (W, B0, "line"), (W, B1, "line"), (sr, B1, "line"),
             (sr, apex, "line"), (xa, apex, "line"), (0, B1, "line"), (0, B0, "line"), (sl, B0, "line")]
    counter = [(D, B1, "line"), (sl, yi, "line"), (sl, B1, "line")]
    _replace(font["four"], [outer, counter], lsb=0.025, rsb=0.055)


def _replace(g, specs, lsb, rsb):
    g.contours.clear()
    for s in specs:
        g.contours.append(_contour(s))
    keep_spacing(g, round(lsb * 712), round(rsb * 712))


def five_flag(font):
    """5: a flat, square-ended flag on a near-upright stem (Georgia Pro and Serrif), in place of Libre Baskerville's
    curled flag and leaning stem. Points 0-11 (flag) become four corners; the stem's left edge leans 0.11 (Georgia),
    flag .108 cap thick, ending .03 cap inside the bowl's right side."""
    from ufoLib2.objects import Point
    c = font["five"].contours[0]
    P = c.points
    x12, y12 = P[12].x, P[12].y                      # the stem's foot, where it joins the bowl, stays
    top, low = 712, 712 - round(0.108 * 712)
    xl = round(x12 + 0.11 * (top - y12))
    xr_stem = round(x12 + 0.11 * (low - y12)) + 44
    right = max(p.x for p in P[12:]) - round(0.03 * 712)
    c.points[0:12] = [Point(xr_stem, low, "line"), Point(right, low, "line"), Point(right, top, "line"),
                      Point(xl, top, "line")]


def two_base(font):
    """2: a flat base with a square right end (Georgia Pro, Serrif), not Libre Baskerville's base rising into a
    serif. Points 35-40 go; the base is 80 units thick (Georgia's base over its stem, at Area's stem)."""
    from ufoLib2.objects import Point
    c = font["two"].contours[0]
    P = c.points
    xr = P[36].x - 6
    base = 80
    c.points[35:41] = [Point(xr, 0, "line"), Point(xr, base, "line")]
    # the base's top runs to the diagonal; the diagonal's lower end (old 41 and 0) sits on the new base top
    P = c.points
    P[37].y = base
    P[0].y = base + 2
    P[0].x = P[37].x + 1


def one_foot(font):
    """1: Libre Baskerville's top stays (owner: "make the top more like libre baskerville"); the foot reaches as far
    as Georgia Pro's (3.9 stems across, was 3.25)."""
    P = font["one"].contours[0].points
    for i in range(17, 25):
        P[i].x -= 27
    for i in range(25, 33):
        P[i].x += 27
    P[16].x -= 13
    P[33].x += 13


def four_foot(font):
    """4: a foot serif (owner, 2026-11-12: "can you add a serif to the bottom of the 4?"). It is the 1's foot,
    exactly (the two stems are one width), so the figures' feet match: 1's points 14-35 (stem bottom, brackets, foot)
    replace the 4's two plain stem corners."""
    from ufoLib2.objects import Point
    one = font["one"].contours[0].points
    c = font["four"].contours[0]
    sl = c.points[0].x
    dx = sl - one[14].x
    foot = [Point(p.x + dx, p.y, p.type, smooth=p.smooth) for p in one[14:36]]
    c.points[0:2] = foot
    sb = (round(0.025 * 712), round(0.055 * 712))
    keep_spacing(font["four"], *sb)


def figures(font):
    sb = {n: sidebearings(font[n]) for n in list(FIG_STRETCH) + ["one"]}
    seven_georgia(font)
    four_georgia(font)
    five_flag(font)
    two_base(font)
    one_foot(font)
    keep_spacing(font["one"], *sb["one"])
    four_foot(font)
    for n, (a, b, d) in FIG_STRETCH.items():
        _stretch(font[n], a, b, d)
    figure_ends(font)
    five_balance(font)
    five_serrif(font)
    figure_rounds(font)
    for n in ["zero", "two", "three", "five", "six", "eight", "nine"]:
        round_quarters(font[n])
    for n in FIG_STRETCH:
        keep_spacing(font[n], *sb[n])


# Figure ends (owner, 2026-11-12: the 2's and 3's ends "are styled exactly like libre baskerville. the tails, rounded
# ends, etc should look like georgia and serrif"). Libre Baskerville ends these strokes in a large teardrop cut on a
# slant, reaching far into the counter. Serrif and Georgia Pro end them in a round end about one stroke wide: the
# outer edge rounds over at its own extreme (Serrif's 2: left 57 at 720, bottom 649; 3 top: centre .77 cap; 5 and 3
# bottom: centre .22 cap), swells a little past the inner edge, and pinches back into it. The 3's middle ends in a
# square cut (Serrif, Georgia Pro), not a blob. Sizes in Area's figure stem (83 units).
FIG_END_R = 0.55          # half the end's width, in stems: 2R is the stroke plus about 8 units (Serrif's swell)
FIG_END_NECK = 1.6        # the pinch runs this many R along the inner edge, so the swell eases back without a nub
FIG_END_DROP = 1.08       # the end runs a little longer than it is wide (Serrif's: 71 down for 65 across)
FIG_ENDS = {              # glyph: [(contour, outer extreme A, inner node B, tip direction v, inner side s), ...]
    "two": [(0, 9, 18, -1, 1)],
    "three": [(0, 64, 55, 1, 1), (0, 16, 25, -1, 1, 0.78)],   # bottom first: its indices sit after the top's.
                                                              # the top end's centre at .78 cap (Serrif .77; was .83)
    "five": [(0, 28, 22, 1, 1)],
    "six": [(0, 16, 10, -1, -1)],
    "nine": [(0, 16, 10, 1, 1)],
}
THREE_CUT = (0.23, 40)    # the 3's middle: a square end .23 cap in from the ink's left (Serrif .22, Georgia .235), 40 tall


def soft_end(c, ia, ib, v, s, stem, cy_cap=None):
    """Replaces the points between the outer extreme A (index ia, vertical tangent, kept) and the inner node B
    (index ib) with a round end: A rounds over to the tip, the tip to the far side (the swell), and the far side
    pinches into the inner edge at B. B with a vertical tangent (the inner edge's own extreme) slides away from the
    tip along the edge to make room for the pinch; B with a level tangent (the inner bottom or top) stays."""
    from ufoLib2.objects import Point
    P = c.points
    A, B = P[ia], P[ib]
    if cy_cap:
        A.y = round(cy_cap * 712)
    R = FIG_END_R * stem
    Ry = R * FIG_END_DROP
    cx, cy = A.x + s * R, A.y
    far = (A.x + 2 * s * R, cy)
    tip = (cx, cy + v * Ry)
    k = KAPPA
    seq = [(A.x, cy + v * k * Ry, None), (cx - s * k * R, tip[1], None), (tip[0], tip[1], "curve"),
           (cx + s * k * R, tip[1], None), (far[0], cy + v * k * Ry, None), (far[0], far[1], "curve")]
    forward = ia < ib
    after = P[(ib + 1) % len(P)] if forward else P[ib - 1]          # B's handle away from the end
    if abs(after.x - B.x) < 1:                                       # B on the inner edge's extreme: slide it
        nxt = P[(ib + 3) % len(P)] if forward else P[ib - 3]
        by = cy - v * min(FIG_END_NECK * R, 0.3 * abs(nxt.y - cy))   # room for the inner curve to turn (3: abrupt on the left)
        bx = B.x
        h = abs(by - cy)
        seq += [(far[0], cy - v * 0.5 * h, None), (bx, by + v * 0.5 * h, None), (bx, by, "curve")]
        after.y = by + (nxt.y - by) * 0.55
    else:                                                            # B at the inner bottom or top: keep it
        bx, by = B.x, B.y
        seq += [(far[0], cy - v * KAPPA * abs(by - cy), None), (bx + KAPPA * (far[0] - bx), by, None),
                (bx, by, "curve")]
    pts = [Point(round(x), round(y), t, smooth=t is not None) for x, y, t in seq]
    if forward:
        c.points[ia + 1:ib + 1] = pts
    else:   # the contour runs B -> A: the same end, read backwards; types name the segment arriving at each node
        btype = B.type
        rev = list(reversed(pts))                   # B', h, h, far, h, h, tip, h, h
        rev[0].type, rev[3].type, rev[6].type = btype, "curve", "curve"
        for q in (rev[1], rev[2], rev[4], rev[5], rev[7], rev[8]):
            q.type = None
        c.points[ib:ia] = rev
        A.type = "curve"
    A.smooth = True


def three_cut(font):
    """3: the middle stroke ends in a square cut (points 35-45, Libre Baskerville's blob, go)."""
    from ufoLib2.objects import Point
    c = font["three"].contours[0]
    P = c.points
    x0 = min(p.x for p in P)
    x = round(x0 + THREE_CUT[0] * 712)
    top, low = P[34].y + 3, P[46].y - 2
    c.points[35:46] = [Point(x, top, "line"), Point(x, low, "line")]
    c.points[37].type = "line"


def figure_ends(font):
    stem = 0.117 * 712
    for name, ends in FIG_ENDS.items():
        if name == "three":
            three_cut(font)      # before the ends: the cut removes 9 points ahead of the bottom end's indices
        for ci, ia, ib, v, s, *cy in ends:
            if name == "three" and ia > 35:
                ia, ib = ia - 9, ib - 9
            soft_end(font[name].contours[ci], ia, ib, v, s, stem, *cy)


# Tails (owner, 2026-11-12: c, e and t's tails "should be more consistent"). Each ends in a level cut on a thin end
# (Serrif's way). One rule for all three: the end's width, its height, the angles both edges arrive at, and the
# handles' shares of each curve. Measured on Serrif per x-height and stem: end 0.29-0.33 stems wide; c and e end at
# 0.35 x-height, t at 0.21; the outer edge arrives at about 75 degrees, the inner at about 66.
TAILS = {"c": (0, 30), "e": (0, 25), "t": (8, 7)}   # glyph: (cut's inner node L, cut's outer node R), contour 0
TAIL_END = 0.30          # the end's width, in stems
TAIL_TOP = {"c": 0.33, "e": 0.33, "t": 0.20}   # the end's height, in x-heights (c and e one value; t is the small hook)
TAIL_OUT_DEG, TAIL_IN_DEG = 75, 66
TAIL_K_OUT = (0.40, 0.45)   # handle shares of the chord: at the bottom node, at the end
TAIL_K_IN = (0.30, 0.50)


def tails(font, sw):
    xh = 520
    for name, (il, ir) in TAILS.items():
        g = font[name]
        sb = sidebearings(g)
        P = g.contours[0].points
        n = len(P)
        L, R = P[il], P[ir]
        I, Ih1, Ih2 = P[(il + 3) % n], P[(il + 2) % n], P[(il + 1) % n]     # inner: L <- Ih2 <- Ih1 <- I (bottom)
        O, Oh1, Oh2 = P[(ir - 3) % n], P[(ir - 2) % n], P[(ir - 1) % n]     # outer: O -> Oh1 -> Oh2 -> R
        top = round(TAIL_TOP[name] * xh)
        w = TAIL_END * sw
        # the outer edge's end slides along its own arrival line to the new height, so the letter's width holds
        R.x = round(R.x + (top - R.y) / math.tan(math.radians(TAIL_OUT_DEG)))
        R.y = top
        L.x, L.y = round(R.x - w), top
        def handles(bottom, h_bottom, h_end, end, deg, k):
            d = math.hypot(end.x - bottom.x, end.y - bottom.y)
            side = 1 if end.x > bottom.x else -1
            h_bottom.x, h_bottom.y = round(bottom.x + side * k[0] * d), bottom.y
            a = math.radians(deg)
            h_end.x, h_end.y = round(end.x - side * k[1] * d * math.cos(a)), round(end.y - k[1] * d * math.sin(a))
        handles(O, Oh1, Oh2, R, TAIL_OUT_DEG, TAIL_K_OUT)
        handles(I, Ih1, Ih2, L, TAIL_IN_DEG, TAIL_K_IN)
        keep_spacing(g, *sb)


# Diagonal strokes, one weight per role (owner, 2026-11-12: "see what other parts of the typeface can be unified").
# Measured across the faces as horizontal width at half the x-height, in n stems: Area's thin strokes were v 0.67,
# w 0.65-0.66, x 0.57, y 0.51, and y's thick 1.00 against v, w, x 1.12-1.15 (Serrif: thick 1.05-1.22, thin 0.39-0.43
# in all four; Georgia Pro thick 1.02-1.15, thin 0.45). One value each: every stroke running top-left to bottom-right
# (the thick one) at DIAG_THICK, every other (thin) at DIAG_THIN. K's leg takes X's thick stroke (it was 0.27 of the
# cap scan against X's 0.20; Serrif's leg is near its other thick diagonals).
DIAG_THICK, DIAG_THIN = 1.12, 0.52
DIAG_LOWER = "vwy"          # x: its strokes bend at the crossing; THIN_X sets it to the same widths


def _diag_edges(g, min_len=80):
    lines = []
    for ci, c in enumerate(g.contours):
        P, n = c.points, len(c.points)
        for i in range(n):
            a_, b_ = P[i], P[(i + 1) % n]
            if b_.type != "line" or a_.type is None:
                continue
            dx, dy = b_.x - a_.x, b_.y - a_.y
            if (dx * dx + dy * dy) ** 0.5 < min_len or abs(dy) < 1 or not 0.2 < abs(dx / dy) < 5:
                continue
            m = dx / dy
            lines.append([ci, i, (i + 1) % n, m, a_.x - m * a_.y])
    return lines


def set_diagonal_widths(g, targets, y_at):
    """Sets each straight stroke's horizontal width at height y_at: targets maps a direction (-1: top-left to
    bottom-right, +1: the other) to a width in units, or None to leave it. Within a direction, the edges pair up
    left to right into strokes; both edges of a stroke move by half the difference, as one piece with the nodes on
    them and those nodes' handles (so brackets and the owner's curves at the ends keep their shape). A node on two
    moved edges goes to where the moved edges meet."""
    lines = _diag_edges(g)
    shifts = {}
    for sign, target in targets.items():
        if target is None:
            continue
        group = sorted((L for L in lines if (L[3] > 0) == (sign > 0)), key=lambda L: L[3] * y_at + L[4])
        edges = []                                    # segments on one line (split by a crossing) are one edge
        for L in group:
            x = L[3] * y_at + L[4]
            if edges and abs(edges[-1][0][3] - L[3]) < 0.08 and abs(edges[-1][0][3] * y_at + edges[-1][0][4] - x) < 10:
                edges[-1].append(L)
            else:
                edges.append([L])
        if len(edges) % 2:
            continue                                  # an unpaired edge: not a clean set of strokes, leave it
        for left, right in zip(edges[::2], edges[1::2]):
            xl = sum(L[3] * y_at + L[4] for L in left) / len(left)
            xr = sum(L[3] * y_at + L[4] for L in right) / len(right)
            d = ((xr - xl) - target) / 2
            for side, dd in ((left, d), (right, -d)):
                for L in side:
                    L.append(dd)
                    shifts.setdefault((L[0], L[1]), []).append(L)
                    shifts.setdefault((L[0], L[2]), []).append(L)
    for (ci, pi), ls in shifts.items():
        P, n = g.contours[ci].points, len(g.contours[ci].points)
        p = P[pi]
        if len(ls) == 1 or abs(ls[0][3] - ls[1][3]) < 1e-6:
            dx = ls[0][5]
            for q in [p] + [P[q] for q in ((pi - 1) % n, (pi + 1) % n) if P[q].type is None]:
                q.x += dx
        else:
            (m1, b1, s1), (m2, b2, s2) = (ls[0][3], ls[0][4], ls[0][5]), (ls[1][3], ls[1][4], ls[1][5])
            b1, b2 = b1 + s1, b2 + s2
            y = (b2 - b1) / (m1 - m2)
            p.x, p.y = m1 * y + b1, y
    for c in g.contours:
        for p in c.points:
            p.x, p.y = round(p.x), round(p.y)


def unify_diagonals(font, sw):
    for ch in DIAG_LOWER:
        sb = sidebearings(font[ch])
        set_diagonal_widths(font[ch], {-1: DIAG_THICK * sw, 1: DIAG_THIN * sw}, 260)
        keep_spacing(font[ch], *sb)
    X = sorted(L[3] * 356 + L[4] for L in _diag_edges(font["X"]) if L[3] < 0)
    xs = [sum(X[:len(X) // 2]) / (len(X) // 2), sum(X[len(X) // 2:]) / (len(X) - len(X) // 2)] if len(X) in (2, 4) else []
    if len(xs) == 2:
        sb = sidebearings(font["K"])
        set_diagonal_widths(font["K"], {-1: xs[1] - xs[0], 1: None}, 356)
        keep_spacing(font["K"], *sb)


def A_inner_leg(font):
    """A: the left leg's inner edge was one long curve from the foot all the way up to the crossbar (Libre
    Baskerville), so the leg bowed. Now it runs straight, parallel to the leg's outer edge, from the crossbar down to
    a short round join into the foot, the same join as every other leaning-back join (derive.BRACKET_ACUTE_R,
    BRACKET_K_ACUTE). Points 12-16 (the curve's handles and middle node) become the join's two handles and node."""
    from ufoLib2.objects import Point
    c = font["A"].contours[0]
    P = c.points
    base, top, o1, o2 = P[11], P[17], P[46], P[45]          # foot's top end, crossbar corner, outer edge
    assert abs(base.y - 27) < 2 and abs(top.y - 263) < 3, "A's points moved; update A_inner_leg"
    m = (o2.x - o1.x) / (o2.y - o1.y)
    cx = top.x + m * (base.y - top.y)                       # where the straight inner edge meets the foot's level
    cy = base.y
    r = 1.05 * D.TARGET_CAP_STEM * D.BRACKET_CAP            # as far as the right leg's join reaches (quarter-way rule)
    L = math.hypot(m, 1)
    nx, ny = cx + m / L * r, cy + 1 / L * r
    # one gradual curve from the foot's end, as every leaning-back join (derive.diagonal_bracket)
    c.points[12:18] = [Point(round(base.x + (cx - base.x) * D.BRACKET_K_SERIF), base.y, None),
                       Point(round(nx + (cx - nx) * D.BRACKET_K_ACUTE), round(ny + (cy - ny) * D.BRACKET_K_ACUTE), None),
                       Point(round(nx), round(ny), "curve", smooth=True), Point(top.x, top.y, "line")]


R_CROTCH_DEG = 20


def R_crotch(font):
    """R: where the leg's outer edge meets the bowl's underside (owner, 2026-11-12: "this part of the R should be
    smoother"). The leg's curve ended at a node (52) and a straight line ran on into a sharp corner under the bowl
    (53). Now that piece is one curve: it leaves 52 in the leg's own direction (smooth) and arrives at 53 almost
    level, so the leg and the bowl meet in a narrow, smooth notch as in Serrif (about 14 degrees between them)."""
    from ufoLib2.objects import Point
    c = font["R"].contours[0]
    P = c.points
    h0, a, b = P[51], P[52], P[53]
    assert a.type is not None and b.type == "line" and P[54].type is None, "R's points moved; update R_crotch"
    d = math.hypot(b.x - a.x, b.y - a.y)
    t = math.radians(R_CROTCH_DEG)            # the curve's direction through 52: 20 degrees above level, so the
    ux, uy = -math.cos(t), math.sin(t)        # turn from the leg into the notch spreads instead of a tight shoulder
    L0 = math.hypot(h0.x - a.x, h0.y - a.y)
    h0.x, h0.y = round(a.x - ux * L0), round(a.y - uy * L0)
    h1 = Point(round(a.x + ux * 0.4 * d), round(a.y + uy * 0.4 * d), None)
    h2 = Point(round(b.x + 0.35 * d), round(b.y - 0.03 * d), None)
    a.smooth = True
    b.type = "curve"
    c.points[53:53] = [h1, h2]


R_LEG_FOOT = (0.25, 1.0)    # the leg's inner edge arriving at the foot: steeper than at the bowl, as in Serrif


def R_leg(font):
    """R: the leg's inner edge was one straight line from the bowl (40) to the foot (41), against the owner's curved
    outer edge (owner, 2026-11-12: "should look more like serrif's R"). It becomes one gentle curve: it leaves the bowl
    in the bowl's own direction (smooth at 40) and steepens into the foot, so both edges of the leg run alike."""
    from ufoLib2.objects import Point
    c = font["R"].contours[0]
    P = c.points
    h, a, b = P[39], P[40], P[41]
    assert h.type is None and a.type is not None and b.type == "line", "R's points moved; update R_leg"
    d = math.hypot(b.x - a.x, b.y - a.y)
    ux, uy = a.x - h.x, a.y - h.y
    L = math.hypot(ux, uy)
    fx, fy = R_LEG_FOOT
    F = math.hypot(fx, fy)
    a.smooth = True
    b.type = "curve"
    c.points[41:41] = [Point(round(a.x + ux / L * 0.4 * d), round(a.y + uy / L * 0.4 * d), None),
                       Point(round(b.x - fx / F * 0.4 * d), round(b.y + fy / F * 0.4 * d), None)]


def straight_through(g):
    """x (owner, 2026-11-12: "the lines through the x should align, both sides should be like intersecting each
    other, not separate pieces"): each stroke edge was two straight pieces meeting at the crossing at different
    angles (0.88 and 0.69 across per unit up). Each edge becomes one line, through the far ends of its two pieces
    (where they leave their brackets, which keep their shape), and every crossing notch goes to where the new lines
    meet, so each stroke reads as one bar passing through the other."""
    lines = _diag_edges(g, min_len=40)
    ends = {}
    for L in lines:
        for k in (1, 2):
            ends.setdefault((L[0], L[k]), []).append(L)
    def far(L):                                  # the end not shared with an edge of the other direction
        for k in (1, 2):
            if not any((M[3] > 0) != (L[3] > 0) for M in ends[(L[0], L[k])]):
                return k
        return None
    sides = []                                   # (direction, list of segments) per edge
    for sign in (-1, 1):
        group = [L for L in lines if (L[3] > 0) == (sign > 0)]
        if len(group) != 4:
            return
        # the edge each piece belongs to: pieces on one edge sit on the same side of the stroke's centre line
        P0 = lambda L, k: g.contours[L[0]].points[L[k]]
        mid_x = lambda L: (P0(L, 1).x + P0(L, 2).x) / 2 - L[3] * ((P0(L, 1).y + P0(L, 2).y) / 2)
        group.sort(key=mid_x)
        sides += [(sign, group[:2]), (sign, group[2:])]
    new = {}
    for sign, segs in sides:
        f = [far(L) for L in segs]
        if None in f:
            return
        (a, b) = [g.contours[L[0]].points[L[k]] for L, k in zip(segs, f)]
        m = (b.x - a.x) / (b.y - a.y)
        for L in segs:
            new[id(L)] = (m, a.x - m * a.y)
    for (ci, pi), ls in ends.items():
        p = g.contours[ci].points[pi]
        if len(ls) == 2 and (ls[0][3] > 0) != (ls[1][3] > 0):
            (m1, b1), (m2, b2) = new[id(ls[0])], new[id(ls[1])]
            y = (b2 - b1) / (m1 - m2)
            p.x, p.y = round(m1 * y + b1), round(y)


# Capital serifs (owner, 2026-11-12: "for alot of the capital letters, the serifs and tails and barbs and spurs are a
# bit too long and heavy ... more subtle ... consistently"). Measured past the stem, in each face's own H stem: Area's
# feet reached 1.13 and heads 1.03, B and D 1.25 (Serrif 1.11 everywhere, Georgia Pro 0.88-1.00). One value for every
# capital foot and head serif on a vertical stem, between the two and shorter than before.
CAP_SERIF = 0.95
CAP_SERIFS = {   # glyph: (scan height in caps, [(stem index, foot sides, head sides), ...])
    "H": (0.3, [(0, "lr", "lr"), (1, "lr", "lr")]), "I": (0.3, [(0, "lr", "lr")]),
    "E": (0.3, [(0, "l", "l")]), "F": (0.3, [(0, "lr", "l")]), "L": (0.3, [(0, "l", "lr")]),
    "B": (0.3, [(0, "l", "l")]), "D": (0.3, [(0, "l", "l")]), "P": (0.3, [(0, "lr", "l")]),
    "R": (0.3, [(0, "lr", "l")]), "K": (0.3, [(0, "lr", "lr")]), "T": (0.3, [(0, "lr", "")]),
    "N": (0.5, [(0, "lr", "l"), (-1, "", "lr")]), "M": (0.3, [(0, "lr", "l"), (-1, "lr", "r")]),
    "U": (0.6, [(0, "", "lr"), (-1, "", "lr")]), "J": (0.6, [(0, "", "lr")]),
}


def cap_serifs(font):
    cap = D.CAP_HEIGHT
    hs = spans_at(flatten(font["H"]), cap * 0.75)[0]
    unit = hs[1] - hs[0]                         # every capital serif reaches the same distance: H's stem is the unit
    for ch, (frac, stems) in CAP_SERIFS.items():
        g = font[ch]
        sb = sidebearings(g)
        st = spans_at(flatten(g), cap * frac)
        for idx, foot, head in stems:
            a, b = st[idx]
            w = b - a
            target = CAP_SERIF * unit
            for sides, test_y in ((foot, lambda y: y < 40), (head, lambda y: y > cap - 40)):
                if "l" in sides:
                    pts = with_handles(g, lambda p: test_y(p.y) and a - 2.0 * w < p.x < a - 1)
                    if pts:
                        move(pts, dx=(a - min(p.x for p in pts if p.type)) - target)
                if "r" in sides:
                    pts = with_handles(g, lambda p: test_y(p.y) and b + 1 < p.x < b + 2.0 * w)
                    if pts:
                        move(pts, dx=target - (max(p.x for p in pts if p.type) - b))
        keep_spacing(g, *sb)


# Capital barbs, terminals and tails (owner, 2026-11-12: "the serifs and tails and barbs and spurs are a bit too long
# and heavy ... more subtle"; "i like how serrifs G doesnt have a huge indent at the end"). Past their arm, in H stems:
# Area's arm barbs hung 1.2-1.5 (E, F, L, T, Z; Serrif 0-0.5, Georgia Pro about 1.3); C, G and S's end barbs 1.6-2.4
# below the stroke's inside, 33-53 units wide. One length for arm barbs, one for the round letters' end barbs, one
# width for those, and no notch where the outer curve meets an end barb.
CAP_BARB = 0.90          # arm barbs, past the arm's edge, in H stems (Serrif's run deeper but thin; the weight was the
                         # wedge, so the length comes down a third and the wedge becomes a light flare, BARB_FLARE)
CAP_END_BARB = 1.0       # C, G, S end barbs, past the stroke's inner edge
CAP_END_W = 42           # their width at the free end (C was 33, G 44, S 53)
BARBS = {   # glyph: [(x_lo, x_hi, y_lo, y_hi, the arm's edge y, length in H stems)]
    "E": [(340, 9e9, 520, 666, 666, CAP_BARB), (230, 9e9, 200, 350, 350, CAP_BARB),
          (230, 9e9, 394, 520, 394, CAP_BARB), (230, 9e9, 46, 200, 46, CAP_BARB)],
    "F": [(340, 9e9, 500, 661, 661, CAP_BARB), (230, 9e9, 150, 333, 333, CAP_BARB),
          (230, 9e9, 376, 500, 376, CAP_BARB)],
    "L": [(230, 9e9, 48, 300, 48, CAP_BARB)],
    "T": [(-9e9, 220, 400, 666, 666, CAP_BARB), (520, 9e9, 400, 666, 666, CAP_BARB)],
    "Z": [(-9e9, 250, 400, 667, 667, CAP_BARB), (440, 9e9, 49, 300, 49, CAP_BARB)],
    "C": [(590, 9e9, 400, 668, 668, CAP_END_BARB)],
    "G": [(590, 9e9, 400, 668, 668, CAP_END_BARB)],
    "S": [(440, 9e9, 400, 668, 668, CAP_END_BARB), (-9e9, 140, 37, 300, 37, CAP_END_BARB)],
}
END_BARBS = {   # glyph: [(inner corner at the free end, outer corner at the free end, outer corner at the stroke,
                #           the notch point, its handle toward the curve, the point between the corner and the notch)]
    "C": [(25, 26, 27, 0, 1, 28)],
    "G": [(40, 41, 42, 44, 45, 43)],
    "S": [(20, 21, 22, 24, 25, 23), (42, 43, 0, 2, 3, 1)],
}


def cap_barbs(font):
    hs = spans_at(flatten(font["H"]), D.CAP_HEIGHT * 0.75)[0]
    unit = hs[1] - hs[0]
    for ch, regions in BARBS.items():
        g = font[ch]
        sb = sidebearings(g)
        pts = [p for c in g.contours for p in c.points]
        for x_lo, x_hi, y_lo, y_hi, edge, length in regions:
            inside = [p for p in pts if x_lo < p.x < x_hi and y_lo <= p.y <= y_hi and abs(p.y - edge) > 0.5]
            on = [abs(p.y - edge) for p in inside if p.type]
            if not on:
                continue
            k = min(1.0, length * unit / max(on))
            for p in inside:
                p.y = round(edge + (p.y - edge) * k)
        P = g.contours[0].points
        for inner, outer, top, notch, h, mid in END_BARBS.get(ch, []):
            # one width at the free end; the outer edge keeps its slant
            dx = (P[inner].x + (CAP_END_W if P[outer].x > P[inner].x else -CAP_END_W)) - P[outer].x
            P[outer].x += dx
            P[top].x += dx
            # no notch: the outer curve meets the barb at the barb's own height, a little in from its corner
            ty = P[top].y
            up = 1 if ty > 300 else -1
            P[notch].x = round(P[top].x + (P[inner].x - P[top].x) * 0.35)
            P[notch].y = ty - up * 12
            P[h].y = P[notch].y + up * 6
            P[h].x = round(P[notch].x + (P[h].x - P[notch].x) * 0.9)
            # the barb's top is level with the curve's end, so the barb drops straight from it (Serrif's G), no step
            P[top].y = P[notch].y
            P[mid].x, P[mid].y = round((P[top].x + P[notch].x) / 2), P[notch].y
        keep_spacing(g, *sb)


BARB_FLARE = {   # glyph: [(the curve's node on the arm's edge, handle, handle, the barb's tip) or reversed order]
    "E": [(4, 5, 6, 7), (41, 42, 43, 44), (50, 49, 48, 47), (37, 36, 35, 34)],
    "F": [(29, 30, 31, 32), (15, 16, 17, 18), (24, 23, 22, 21)],
    "L": [(9, 8, 7, 6)], "T": [(6, 5, 4, 3), (35, 36, 37, 38)], "Z": [(13, 12, 11, 10), (4, 3, 2, 1)],
}
BARB_K = (0.65, 0.55)    # along the arm, along the barb: a light flare that still sweeps, not a tight corner


def barb_flares(font):
    """Each arm barb's inner curve becomes a light concave flare: it runs along the arm's edge and turns into the
    barb close to its end (handles toward the corner where the barb's inside meets the arm's edge), in place of
    Libre Baskerville's full wedge."""
    for ch, curves in BARB_FLARE.items():
        P = font[ch].contours[0].points
        for a, h1, h2, t in curves:
            A, T = P[a], P[t]
            assert A.type and T.type and P[h1].type is None and P[h2].type is None, f"{ch}'s barb points moved"
            cx, cy = T.x, A.y
            P[h1].x, P[h1].y = round(A.x + (cx - A.x) * BARB_K[0]), A.y
            P[h2].x, P[h2].y = T.x, round(T.y + (cy - T.y) * BARB_K[1])


Q_TAIL_SCALE = 0.65      # Q: its tail (points 7-35, contour 0) drawn smaller around where it leaves the bowl


def Q_tail(font):
    g = font["Q"]
    sb = sidebearings(g)
    P = g.contours[0].points
    ox, oy = P[36].x, P[6].y
    for p in P[7:36]:
        p.x = round(ox + (p.x - ox) * Q_TAIL_SCALE)
        p.y = round(oy + (p.y - oy) * Q_TAIL_SCALE)
    keep_spacing(g, *sb)


# Capital bowls (owner, 2026-11-12, "Q, G and bowls"). Ink widths in cap thousandths: Area B 831, D 972, P 760, R 966
# (Georgia Pro 813, 960, 771, 975; Serrif 907, 1019, 860, 1011). Each widens about halfway toward Serrif, through the
# zone between the stem and its counters' right edge, so every stroke keeps its thickness.
BOWL_WIDEN = {"B": 28, "D": 16, "P": 39, "R": 17}


def bowl_widths(font):
    for ch, d in BOWL_WIDEN.items():
        g = font[ch]
        sb = sidebearings(g)
        a = 230
        b = min(max(p.x for p in c.points) for c in g.contours[1:]) - 10
        _stretch(g, a, b, d)
        keep_spacing(g, *sb)


def G_bar(font):
    """G: Serrif's bar sits at 0.47-0.505 of the cap height and reaches 1.4 stems left of the stem and 0.8 right;
    Area's sat at 0.38-0.42 and reached 1.0 and 0.3. The bar (points 7-28, with its brackets into the stem) rises to
    Serrif's height and reaches further each way; its thickness stays."""
    g = font["G"]
    sb = sidebearings(g)
    P = g.contours[0].points
    assert P[18].type == "line" and abs(P[18].y - 297) < 3, "G's points moved; update G_bar"
    rise = round(0.47 * D.CAP_HEIGHT) - P[25].y
    for p in P[7:29]:
        p.y += rise
    stem_l, stem_r = P[28].x, P[7].x
    unit = stem_r - stem_l
    dl = (stem_l - round(1.4 * unit)) - P[22].x
    dr = (stem_r + round(0.8 * unit)) - P[14].x
    for p in P[18:26]:
        p.x += dl
    for p in P[9:18]:
        p.x += dr
    # the stem's left edge stays straight below the raised bar before it turns into the bowl (Serrif)
    P[29].y = P[31].y + 14
    P[30].x = round(P[30].x + (P[29].x - P[30].x) * 0.3)
    keep_spacing(g, *sb)


def Q_tail_right(font):
    """Q: Libre Baskerville's tail swept left under the bowl and curled back (points 7-39). Serrif's leaves the bowl
    just right of its bottom, runs right and down, and ends thin a little past the bowl at 0.16 cap below the
    baseline. One tapering stroke the same way: its lower edge leaves the bowl's bottom (6) level, its upper edge
    meets the bowl's curve again in a notch (the new 39), about half a stem thick at its middle."""
    from ufoLib2.objects import Point
    g = font["Q"]
    sb = sidebearings(g)
    c = g.contours[0]
    P = c.points
    assert P[36].type == "line" and P[6].type == "curve", "Q's points moved; update Q_tail_right"
    bx, by = P[6].x, P[6].y
    right = max(p.x for p in P[40:48])
    ex, ey = right + 30, -round(0.15 * D.CAP_HEIGHT)
    # a curved band: the lower edge sags under the bowl and rises a little into a vertical cut at the end
    new = [Point(bx + 110, by - 40, None), Point(ex - 140, ey - 12, None), Point(ex, ey, "curve"),
           Point(ex, ey + 28, "line"), Point(ex - 120, ey + 44, None), Point(bx + 210, by + 4, None),
           Point(bx + 120, by + 14, "curve")]
    c.points[7:40] = new
    keep_spacing(g, *sb)


# Figure weight and roundness (owner, 2026-11-12: 9 "the right side looks a bit thick"; 5 "the bottom is very heavy";
# 2 "the top curve part ... is not quite smooth/round"; 3 "the top and bottom parts are not round/smooth enough
# curves, its very abrupt"). The thick side of every figure bowl measured 1.21-1.27 of the 1's stem (Serrif 1.00-1.10,
# Georgia Pro 1.08-1.15): one value, FIG_ROUND, by moving the counter's side of each thick stroke outward. Quarter
# curves (from a level tangent to an upright one) were drawn with handles 0.59-0.71 of their span, boxy: FIG_KAPPA.
FIG_ROUND = 1.10
FIG_KAPPA = 0.56
FIG_ROUND_GLYPHS = ["zero", "two", "three", "five", "six", "nine"]


def figure_rounds(font):
    stem = 0.117 * D.CAP_HEIGHT
    target = FIG_ROUND * stem
    for name in FIG_ROUND_GLYPHS:
        g = font[name]
        xs = [p.x for c in g.contours for p in c.points]
        mid = (min(xs) + max(xs)) / 2
        cs = flatten(g)
        moves = []
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i, p in enumerate(P):
                a, b = P[(i - 1) % n], P[(i + 1) % n]
                if not p.type or a.type or b.type or abs(a.x - p.x) > 0.5 or abs(b.x - p.x) > 0.5:
                    continue                        # an upright extreme: both handles straight above and below
                for lo, hi in spans_at(cs, p.y):
                    w = hi - lo
                    if not target < w < 1.5 * target:
                        continue
                    if abs(lo - p.x) < 1 and abs(hi - mid) < abs(lo - mid):      # p is the inner (right) side
                        moves.append((P, i, -(w - target)))
                    elif abs(hi - p.x) < 1 and abs(lo - mid) < abs(hi - mid):    # p is the inner (left) side
                        moves.append((P, i, w - target))
        for P, i, dx in moves:
            n = len(P)
            for q in (P[(i - 1) % n], P[i], P[(i + 1) % n]):
                q.x = round(q.x + dx)


def round_quarters(g, k=FIG_KAPPA):
    """Every curve from a level tangent to an upright one (or back) gets handles k of its span on each axis."""
    for c in g.contours:
        P, n = c.points, len(c.points)
        on = [i for i in range(n) if P[i].type]
        for idx, i in enumerate(on):
            j = on[(idx + 1) % len(on)]
            if (j - i) % n != 3 or P[j].type != "curve":
                continue
            p0, h1, h2, p3 = P[i], P[(i + 1) % n], P[(i + 2) % n], P[j]
            dx, dy = p3.x - p0.x, p3.y - p0.y
            if abs(dx) < 20 or abs(dy) < 20:
                continue
            if abs(h1.y - p0.y) < 0.5 and abs(h2.x - p3.x) < 0.5:          # level, then upright
                h1.x, h2.y = round(p0.x + k * dx), round(p3.y - k * dy)
            elif abs(h1.x - p0.x) < 0.5 and abs(h2.y - p3.y) < 0.5:        # upright, then level
                h1.y, h2.x = round(p0.y + k * dy), round(p3.x - k * dx)


def five_balance(font):
    """5: the flag reaches further both ways and the stem stands more upright (Serrif's flag starts further left and
    ends at the bowl's right; owner: "the top part of the 5 doesnt go out far enough ... more upright"); the bowl sits a
    little lower (its top at 0.62 cap, Serrif 0.62; Area 0.66), so the bottom reads less heavy."""
    g = font["five"]
    P = g.contours[0].points
    assert P[3].type == "line" and P[4].type == "line" and P[4].smooth, "the 5's points moved; update five_balance"
    bowl_right = max(p.x for p in P[5:])
    top = max(p.y for p in P[5:44])
    k = round(0.62 * D.CAP_HEIGHT) / top
    for p in P[4:]:
        if p.y > 0:
            p.y = round(p.y * k)
    P[3].x -= 22
    P[0].x -= 20
    P[1].x = P[2].x = bowl_right - 6


# Curve tension across the letters (owner, 2026-11-12: "go through all the curves, arcs, and make sure they are all
# smooth and round"). Quarter curves (level tangent to upright) have a median handle share of 0.59; Libre
# Baskerville's shoulders (n m h u), a's top, j and t's hooks, and the capitals' counters and inner corners ran
# 0.66-0.92, boxy. Each of those comes to LETTER_KAPPA. Brackets (one handle at 0.45, by design), curves on points
# the owner moved, and curves drawn on purpose (TENSION_KEEP) stay.
LETTER_KAPPA = 0.62
TENSION_KEEP = {("G", 7), ("G", 28)}     # G's bar flare and its straight stem below the bar (G_bar)


def letter_tension(font):
    import string
    for name in string.ascii_letters:
        g = font[name]
        own = OWNER_MOVED.get(name, set())
        for ci, c in enumerate(g.contours):
            P, n = c.points, len(c.points)
            on = [i for i in range(n) if P[i].type]
            for idx, i in enumerate(on):
                j = on[(idx + 1) % len(on)]
                if (j - i) % n != 3 or P[j].type != "curve" or (name, i) in TENSION_KEEP:
                    continue
                if any((ci, q % n) in own for q in (i, i + 1, i + 2, j)):
                    continue
                p0, h1, h2, p3 = P[i], P[(i + 1) % n], P[(i + 2) % n], P[j]
                dx, dy = p3.x - p0.x, p3.y - p0.y
                if abs(dx) < 40 or abs(dy) < 40:
                    continue
                if abs(h1.y - p0.y) < 0.5 and abs(h2.x - p3.x) < 0.5:
                    r1, r2, level_first = (h1.x - p0.x) / dx, (p3.y - h2.y) / dy, True
                elif abs(h1.x - p0.x) < 0.5 and abs(h2.y - p3.y) < 0.5:
                    r1, r2, level_first = (h1.y - p0.y) / dy, (p3.x - h2.x) / dx, False
                else:
                    continue
                if min(r1, r2) < 0.47 or max(r1, r2) <= 0.66:
                    continue                          # a bracket, or already round
                k1, k2 = min(r1, LETTER_KAPPA), min(r2, LETTER_KAPPA)
                if level_first:
                    h1.x, h2.y = round(p0.x + k1 * dx), round(p3.y - k2 * dy)
                else:
                    h1.y, h2.x = round(p0.y + k1 * dy), round(p3.x - k2 * dx)


def U_stem(font):
    """U: the thick left stem measured 1.19 of H's stem (Serrif 1.02). Its inner edge (the straight run, with its
    nodes' handles) moves left so the stem matches H's."""
    cap = D.CAP_HEIGHT
    hs = spans_at(flatten(font["H"]), cap * 0.75)[0]
    g = font["U"]
    a, b = spans_at(flatten(g), cap * 0.6)[0]
    excess = (b - a) - (hs[1] - hs[0])
    if excess < 2:
        return
    pts = with_handles(g, lambda p: abs(p.x - b) < 1.5 and 60 < p.y < cap - 30)
    move(pts, dx=-excess)


def a_junction(font):
    """a: where the stem's inside turns into the bowl's top (node 30), the owner marked the node smooth (0.10 save),
    but it joined two straight lines at 73 degrees, so the flag could not make it round. The second line becomes a
    curve: it leaves the stem straight down and arrives at the bowl's top in the bowl's own direction. Runs after the
    cleanup, so the owner's other points keep their indices and positions."""
    from ufoLib2.objects import Point
    c = font["a"].contours[0]
    P = c.points
    a, b, nb = P[30], P[31], P[32]
    if not (a.type == "line" and b.type == "line" and nb.type is None and a.smooth):
        return
    d = math.hypot(b.x - a.x, b.y - a.y)
    ux, uy = b.x - nb.x, b.y - nb.y
    L = math.hypot(ux, uy)
    b.type = "curve"
    c.points[31:31] = [Point(a.x, round(a.y - 0.35 * d), None),
                       Point(round(b.x + ux / L * 0.45 * d), round(b.y + uy / L * 0.45 * d), None)]


def G_bottom(font):
    """G: the stem's right edge met the bowl's bottom at a corner (6) and the curve wobbled through a middle node (3)
    (owner, 2026-11-12: "the bottom of the G should be fixed, the curve should match serrif"). Serrif's edge runs
    straight down and turns into the bottom in one round curve: node 6 becomes smooth with an upright tangent, and
    one curve with round handles runs from it to the bottom (0)."""
    from ufoLib2.objects import Point
    c = font["G"].contours[0]
    P = c.points
    b, s = P[0], P[6]
    assert P[3].type == "curve" and s.type == "curve" and P[7].type == "line", "G's points moved; update G_bottom"
    k = 0.58
    c.points[1:6] = [Point(round(b.x + k * (s.x - b.x)), b.y, None), Point(s.x, round(s.y - k * (s.y - b.y)), None)]
    s.smooth = True


def k_junction(font):
    """k: the arm met the stem at 56 and the leg 65 units lower at 15, climbing to a small peak (16) before running
    down, a step at the stem (owner, 2026-11-12: "fix the lowercase x and other similar glyphs"). As in Serrif, both
    meet the stem at one point: the leg's edge starts where the arm's does and runs straight to the foot (16 on the
    line, so no peak)."""
    P = font["k"].contours[0].points
    s, a, l, top = P[15], P[16], P[17], P[56]
    if not (s.type == "line" and a.type == "line" and l.type == "line" and abs(s.x - top.x) < 2):
        return
    s.y = top.y
    a.x, a.y = round((s.x + l.x) / 2), round((s.y + l.y) / 2)


# Inner serif halves (owner, 2026-11-12: "i like how the length of the inner serifs are shorter sometimes for
# certain letters, like x. maybe characters like the A, M, N, W ... the X for sure"). On the x each serif reaches
# about as far past its stroke inside the letter as outside (1.2 times); the X's inner halves reached 1.55 (top) and
# 1.9 (feet) times their outer halves. On diagonal strokes, each inner half now reaches at most INNER_SERIF times the
# outer half; the serif's end (its corners, the end of the join along it) moves in, the join's arc stays.
INNER_SERIF = 1.2
INNER_SERIF_GLYPHS = {"X": ("foot", "head"), "A": ("foot",), "V": ("head",), "W": ("head",), "Y": ("head",)}
INNER_SERIF_BY = {"V": 1.0}   # owner, 2026-11-12 (V): "the serifs on the inside are too long"


def inner_serifs(font):
    cap = D.CAP_HEIGHT
    for ch, wheres in INNER_SERIF_GLYPHS.items():
        g = font[ch]
        xs = [p.x for c in g.contours for p in c.points]
        mid = (min(xs) + max(xs)) / 2
        lines = _diag_edges(g)
        for where in wheres:
            yu, band = (27, (-1, 28)) if where == "foot" else (cap - 27, (cap - 28, cap + 1))
            serifs = spans_at(flatten(g), (band[0] + band[1]) / 2)
            for L, R in serifs:
                # the stroke this serif carries: the two edges whose line crosses the serif's underside inside it
                edges = sorted(m * yu + b for _, _, _, m, b in lines if L - 5 < m * yu + b < R + 5)
                if len(edges) < 2:
                    continue
                el, er = edges[0], edges[-1]
                if (L + R) / 2 < mid:                 # serif left of centre: inside is to the right
                    outer, inner = el - L, R - er
                    want = INNER_SERIF_BY.get(ch, INNER_SERIF) * outer
                    if inner <= want + 2:
                        continue
                    dx = -(inner - want)
                    pts = with_handles(g, lambda p: band[0] <= p.y <= band[1] and er + (inner - want) + 8 < p.x <= R + 1)
                else:
                    outer, inner = R - er, el - L
                    want = INNER_SERIF_BY.get(ch, INNER_SERIF) * outer
                    if inner <= want + 2:
                        continue
                    dx = inner - want
                    pts = with_handles(g, lambda p: band[0] <= p.y <= band[1] and L - 1 <= p.x < el - (inner - want) - 8)
                move(pts, dx=dx)
                # the join is rebuilt from the serif's new end: one curve to the same landing point on the stroke,
                # handles toward the corner (as derive.diagonal_bracket draws it), split at its middle if it was two
                corner = er if (L + R) / 2 < mid else el
                on = [p for p in pts if p.type and abs(p.y - yu) < 1.5]
                if on:
                    rebuild_join(g, min(on, key=lambda p: abs(p.x - corner)), yu, 1 if where == "foot" else -1)


def Z_bottom(font):
    """Z: the bottom arm reached 15 units further right than the top (owner, 2026-11-12: "bottom of the Z too wide
    slightly on the right"). Its right end (the barb, points 0-2, and the corner, 17) comes in; the barb's curve
    handle (3) halfway."""
    g = font["Z"]
    sb = sidebearings(g)
    P = g.contours[0].points
    for i in (0, 1, 2, 17):
        P[i].x -= 15
    P[3].x -= 8
    keep_spacing(g, *sb)


def r_ear(font):
    """r: the ear's end was an oval, 33 units across its lower half and 62 its upper (owner, 2026-11-12: "make the ear
    of the r on the right side extend just a bit further out, make sure the end is round and a smooth curve"). It
    becomes round: one circle from the x-height down, its right side 15 units further out; bottom (9), right (12) and
    top (15) nodes on it with circle handles."""
    g = font["r"]
    P = g.contours[0].points
    bot, rgt, top = P[9], P[12], P[15]
    if not (bot.type and rgt.type and top.type):
        return
    R = (top.y - bot.y) / 2
    cy = (top.y + bot.y) / 2
    xr = rgt.x + 15
    cx = xr - R
    k = KAPPA * R
    bot.x, bot.y = round(cx), round(cy - R)
    rgt.x, rgt.y = round(xr), round(cy)
    top.x, top.y = round(cx), round(cy + R)
    P[10].x, P[10].y = round(cx + k), bot.y
    P[11].x, P[11].y = rgt.x, round(cy - k)
    P[13].x, P[13].y = rgt.x, round(cy + k)
    P[14].x, P[14].y = round(cx + k), top.y
    for p in (bot, rgt, top):
        p.smooth = True


SHOULDERS = {"n": (0, 32), "m": (0, 64), "h": (0, 32)}   # glyph: (contour, the shoulder's upright node)


def one_curve_shoulders(font):
    """n, m, h: the outer shoulder was two curves with a middle node, the first nearly straight, so the stroke ran
    flat then bent hard (owner, 2026-11-12, n: "the curves on the top right part arent very smooth"; m: "make sure the
    thick to thin transition is even and consistent"). It becomes one quarter curve from the upright node to the top,
    its handles sized so the curve passes where the middle node was (the shoulder keeps its fullness). Runs after
    the cleanup, so the owner's other points keep their indices."""
    for name, (ci, a) in SHOULDERS.items():
        c = font[name].contours[ci]
        P = c.points
        A, h1, h2, M, h3, h4, B = (P[a + k] for k in range(7))
        if not (A.type and M.type and B.type and abs(h1.x - A.x) < 0.5 and abs(h4.y - B.y) < 0.5):
            continue
        dx, dy = B.x - A.x, B.y - A.y
        mx, my = M.x - (A.x + B.x) / 2, M.y - (A.y + B.y) / 2
        k = (mx * -dx + my * dy) / (0.375 * (dx * dx + dy * dy))
        k = max(0.5, min(0.7, k))
        from ufoLib2.objects import Point
        c.points[a + 1:a + 6] = [Point(A.x, round(A.y + k * dy), None), Point(round(B.x - k * dx), B.y, None)]
        A.smooth = True


def five_serrif(font):
    """5 (owner, 2026-11-12: "copy serrif, the top part of the 5 has to come out more to the left"): Serrif's stem
    leans, its foot near the ball's side (56 cap thousandths in from the ink's left) and its top at the flag's left
    (148). The stem and the bowl's start (points 4-13, and the stem's right edge 0, 43, 44) move to Serrif's line;
    the stem keeps its width."""
    g = font["five"]
    sb = sidebearings(g)
    P = g.contours[0].points
    assert P[3].type == "line" and P[4].type == "line", "the 5's points moved; update five_serrif"
    x0 = min(p.x for p in P)
    k = D.CAP_HEIGHT / 1000
    top_x, foot_x = x0 + round(148 * k), x0 + round(56 * k)
    w = P[0].x - (P[4].x + (P[3].x - P[4].x) * (P[0].y - P[4].y) / (P[3].y - P[4].y))   # stem width at the flag
    dfoot = foot_x - P[4].x
    for i in range(4, 14):
        P[i].x += dfoot if i < 13 else round(dfoot * 0.6)
    P[14].x += round(dfoot * 0.4)
    P[3].x = top_x
    slope = (P[3].x - P[4].x) / (P[3].y - P[4].y)
    L5 = math.hypot(P[5].x - P[4].x, P[5].y - P[4].y)   # the foot's handle runs on along the stem (smooth at 4)
    sl = math.hypot(slope, 1)
    P[5].x, P[5].y = P[4].x - slope / sl * L5, P[4].y - 1 / sl * L5
    P[0].x = round(P[4].x + slope * (P[0].y - P[4].y) + w)
    for i in (43, 44):
        P[i].x = round(P[4].x + slope * (P[i].y - P[4].y) + w)
    keep_spacing(g, *sb)


def rebuild_join(g, base, yu, away):
    """The leaning-back join leaving `base` (on a serif's underside at yu), going `away` (+1 up, -1 down) to its
    landing node on the stroke: redrawn as one curve, handles toward the corner where the stroke's edge meets yu
    (derive.BRACKET_K_SERIF along the serif, BRACKET_K_ACUTE along the stroke), split at its middle when the join is
    two curves."""
    for c in g.contours:
        Q = c.points
        if base not in Q:
            continue
        n = len(Q)
        i = Q.index(base)
        for step in (1, -1):
            seq = [Q[(i + step * k) % n] for k in range(1, 8)]
            if seq[2].type and (seq[2].y - yu) * away > 5 and seq[0].type is None and seq[1].type is None:
                break
        else:
            return
        two = seq[5].type is not None and seq[3].type is None and seq[4].type is None
        node = seq[5] if two else seq[2]
        after = seq[6] if two else seq[3]
        if abs(after.y - node.y) < 1e-6:
            return
        cx = node.x + (after.x - node.x) * (yu - node.y) / (after.y - node.y)
        c1 = (base.x + (cx - base.x) * D.BRACKET_K_SERIF, yu)
        c2 = (node.x + (cx - node.x) * D.BRACKET_K_ACUTE, node.y + (yu - node.y) * D.BRACKET_K_ACUTE)
        if not two:
            seq[0].x, seq[0].y = round(c1[0]), round(c1[1])
            seq[1].x, seq[1].y = round(c2[0]), round(c2[1])
            return
        mid = lambda a, b: ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        p0, p3 = (base.x, base.y), (node.x, node.y)
        m01, m12, m23 = mid(p0, c1), mid(c1, c2), mid(c2, p3)
        a_, b_ = mid(m01, m12), mid(m12, m23)
        for q, xy in zip(seq[:5], (m01, a_, mid(a_, b_), b_, m23)):
            q.x, q.y = round(xy[0]), round(xy[1])
        seq[2].smooth = True
        return


ARCH_RISE = 0.35     # owner's n (2026-11-12): the inner arch meets the right stem 0.35 of its height higher


def arch_rise(font):
    """m, h: the owner raised the n's inner arch where it meets the right stem (point 9 up 70 of the arch's 198), so
    the arch turns into the stem sooner. The same on the right-hand inner arches of m and h: the node where the arch
    lands on the stem (upright tangent, the arch's top above and to its left, a straight stem run below) rises
    ARCH_RISE of the arch's height; its handle stays 0.55 of the remaining height."""
    for name in ("m", "h"):
        for c in font[name].contours:
            P, n = c.points, len(c.points)
            for i, A in enumerate(P):
                if A.type is None:
                    continue
                for step in (1, -1):
                    h1, h2, B = P[(i + step) % n], P[(i + 2 * step) % n], P[(i + 3 * step) % n]
                    other = P[(i - step) % n]
                    if h1.type or h2.type or not B.type or other.type is None:
                        continue
                    if abs(h1.x - A.x) < 0.5 and abs(h2.y - B.y) < 0.5 and B.y - A.y > 100 and B.x < A.x - 40 \
                            and h1.y > A.y and abs(other.x - A.x) < 0.5 and other.y < A.y:
                        A.y += round(ARCH_RISE * (B.y - A.y))
                        h1.y = round(A.y + 0.55 * (B.y - A.y))


def bowl_junctions(font):
    """p, q: where the bowl's bottom meets the stem, the outline ran flat along a short step (p 10 units, q 5) before
    the curve began (owner, 2026-11-12, p: "dont like the straight line gap on the bottom of the arc where it meets
    the stem"; q: "adjust to match p"). As in Serrif, the bowl's curve now meets the stem directly."""
    P = font["p"].contours[0].points
    if P[15].type == "line" and P[16].type == "line" and abs(P[16].y - P[15].y) < 1 and P[17].type is None:
        del P[16]
    Q = font["q"].contours[0].points
    if Q[29].type == "curve" and Q[30].type == "line" and abs(Q[30].y - Q[29].y) < 1:
        Q[29].x = Q[30].x
        del Q[30]


def merge_quarters(font, min_size=80):
    """Every quarter drawn as two curves (a smooth middle node between an upright extreme and a level one) becomes one
    curve, its handles sized so it passes where the middle node was (owner, 2026-11-12: "make each curve from thick
    to thin more smooth, more consistent, more gradual, and the overall shape of each arc should be more
    round/circular or smooth oval"; "get rid of unnecessary points"). Quarters under min_size (serif tips, flags)
    stay; a fit outside 0.4-0.75 (not an arc) stays."""
    from ufoLib2.objects import Point
    import string
    names = list(string.ascii_letters) + "zero one two three four five six seven eight nine".split()
    for name in names:
        for c in font[name].contours:
            changed = True
            while changed:
                changed = False
                P, n = c.points, len(c.points)
                for a in range(n):
                    if a + 6 >= n:
                        break                                # skip quarters that wrap the contour's start
                    A, h1, h2, M, h3, h4, B = P[a:a + 7]
                    if not (A.type and M.type == "curve" and B.type == "curve" and M.smooth) or \
                            any(q.type for q in (h1, h2, h3, h4)):
                        continue
                    dx, dy = B.x - A.x, B.y - A.y
                    if abs(dx) < min_size or abs(dy) < min_size:
                        continue
                    upright = abs(h1.x - A.x) < 0.5 and abs(h4.y - B.y) < 0.5
                    level = abs(h1.y - A.y) < 0.5 and abs(h4.x - B.x) < 0.5
                    if not (upright or level):
                        continue
                    mx, my = M.x - (A.x + B.x) / 2, M.y - (A.y + B.y) / 2
                    if upright:
                        k = (mx * -dx + my * dy) / (0.375 * (dx * dx + dy * dy))
                        new = [Point(A.x, round(A.y + k * dy), None), Point(round(B.x - k * dx), B.y, None)]
                    else:
                        k = (mx * dx - my * dy) / (0.375 * (dx * dx + dy * dy))
                        new = [Point(round(A.x + k * dx), A.y, None), Point(B.x, round(B.y - k * dy), None)]
                    if not 0.4 <= k <= 0.75:
                        continue
                    c.points[a + 1:a + 6] = new
                    changed = True
                    break


def u_bowl(font):
    """u (owner, 2026-11-12: "the thick to thin transition on the bottom left is wonky, its not smooth, the bottom of
    the u isnt a nice curve arc shape. please adjust/ fine tune my adjustments"). The bowl's quarters get round
    handles (inner 0.58 each way, it was 0.75 and 0.50; outer 0.56, it was 0.65); the inner right quarter, two curves
    whose middle node sat outside the arc, becomes one; the right stem's left edge runs straight to a flat foot on
    the baseline (the last edit left it slanting 11 units below)."""
    from ufoLib2.objects import Point
    c = font["u"].contours[0]
    P = c.points
    if not (P[0].type and P[3].type and P[6].type and P[9].type and P[22].type and P[25].type and P[28].type
            and P[30].type == "line" and P[31].type == "line"):
        return
    A, B = P[22], P[25]                          # outer: left stem down to the bottom
    P[23].x, P[23].y = A.x, round(A.y - 0.56 * (A.y - B.y))
    P[24].x, P[24].y = round(B.x - 0.56 * (B.x - A.x)), B.y
    A, B = P[9], P[6]                            # inner: left side down to the bottom
    P[8].x, P[8].y = A.x, round(A.y - 0.58 * (A.y - B.y))
    P[7].x, P[7].y = round(B.x - 0.58 * (B.x - A.x)), B.y
    stem = P[0].x                                # foot: straight edge, flat bottom
    P[29].x, P[29].y = stem, round(P[28].y * 0.5)
    P[30].x, P[30].y = stem, 0
    P[31].y = 0
    P[28].x = stem
    A, B = P[0], P[6]                            # inner right: one quarter from the stem down to the bottom
    k = 0.5
    c.points[1:6] = [Point(A.x, round(A.y - k * (A.y - B.y)), None), Point(round(B.x + k * (A.x - B.x)), B.y, None)]


def s_barbs(font):
    """s (owner, 2026-11-12: "the top part of the s curve is not very smooth, can you make the whole ink match
    serrif more"): where each end's curve met its barb, the curve came in lower than the barb's top, a notch, as on
    C, G and S before (cap_barbs). The same fix: the barb's top is level with the curve's end, a little in from its
    corner. Indices (contour 0): (inner corner, outer corner at the free end, outer corner at the stroke, the notch,
    its handle, the point between)."""
    P = font["s"].contours[0].points
    for inner, outer, top, notch, h, mid in ((18, 19, 20, 22, 23, 21), (40, 41, 42, 0, 1, 43)):
        if not (P[top].type == "line" and P[notch].type == "line" and P[h].type is None):
            continue
        ty = P[top].y
        up = 1 if ty > 300 else -1
        P[notch].x = round(P[top].x + (P[inner].x - P[top].x) * 0.35)
        P[notch].y = ty - up * 12
        P[h].y = P[notch].y + up * 6
        P[top].y = P[notch].y
        P[mid].x, P[mid].y = round((P[top].x + P[notch].x) / 2), P[notch].y


def _cross(p1, p2, p3, p4):
    d = (p2[0] - p1[0]) * (p4[1] - p3[1]) - (p2[1] - p1[1]) * (p4[0] - p3[0])
    if abs(d) < 1e-9:
        return None
    t = ((p3[0] - p1[0]) * (p4[1] - p3[1]) - (p3[1] - p1[1]) * (p4[0] - p3[0])) / d
    return p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])


def simplify(font):
    """Points the outlines do not need (owner, 2026-11-12: "the bezier curves need to be cleaned up, need to get rid
    of uneccessary points"): a node on a straight line between two straight segments goes; points under a unit apart
    merge; two curves that are one curve cut in two become that curve again (rejoin). The serifs' rounded corners
    stay (the owner asked for them back after 0.24). Runs after every rule and
    every owner edit; saves made on these points are applied after it (stage "final")."""
    from ufoLib2.objects import Point
    for g in font:
        for c in g.contours:
            changed = True
            while changed:
                changed = False
                P, n = c.points, len(c.points)
                if n < 6:
                    break
                # rounded serif corners stay (owner, 2026-11-12: "can you revert back each tiny rounded serif corner?")
                if changed:
                    continue
                P, n = c.points, len(c.points)
                for i in range(n):
                    a, b, d = P[i - 1], P[i], P[(i + 1) % n]
                    if b.type != "line" or d.type != "line" or a.type is None:
                        continue
                    span = math.hypot(d.x - a.x, d.y - a.y)
                    off = abs((b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x)) / max(span, 1e-9)
                    if math.hypot(b.x - a.x, b.y - a.y) < 1 or off < 0.5:
                        del c.points[i]
                        changed = True
                        break


def _bez(p0, p1, p2, p3, t):
    u = 1 - t
    return (u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
            u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1])


def rejoin(font, tol=2.5):
    """Two curves meeting at a smooth node that are one curve cut in two (the joins split at their middle, rejoin_
    join, merged quarters) become that one curve (owner, 2026-11-12, of the v: "is this point really necessary ...
    its not a smooth arc anyway"). A pair is rejoined only when a single curve reproduces both within tol units
    (the node and the curve between), so no shape changes."""
    from ufoLib2.objects import Point
    for g in font:
        for c in g.contours:
            changed = True
            while changed:
                changed = False
                P, n = c.points, len(c.points)
                for a in range(n - 6):
                    A, h1, h2, M, h3, h4, B = P[a:a + 7]
                    if not (A.type and M.type == "curve" and B.type == "curve" and M.smooth) or \
                            any(q.type for q in (h1, h2, h3, h4)):
                        continue
                    pa, p1, p2, pm, p3, p4, pb = ((q.x, q.y) for q in (A, h1, h2, M, h3, h4, B))
                    best = None
                    for k in range(15, 86):
                        t = k / 100
                        c1 = (pa[0] + (p1[0] - pa[0]) / t, pa[1] + (p1[1] - pa[1]) / t)
                        c2 = (pb[0] + (p4[0] - pb[0]) / (1 - t), pb[1] + (p4[1] - pb[1]) / (1 - t))
                        err = 0
                        for s_ in (0.25, 0.5, 0.75, 1.0):
                            q1 = _bez(pa, p1, p2, pm, s_)
                            q2 = _bez(pa, c1, c2, pb, s_ * t)
                            err = max(err, math.hypot(q1[0] - q2[0], q1[1] - q2[1]))
                            q1 = _bez(pm, p3, p4, pb, s_)
                            q2 = _bez(pa, c1, c2, pb, t + s_ * (1 - t))
                            err = max(err, math.hypot(q1[0] - q2[0], q1[1] - q2[1]))
                        if best is None or err < best[0]:
                            best = (err, c1, c2)
                    if best and best[0] <= tol:
                        _, c1, c2 = best
                        c.points[a + 1:a + 6] = [Point(round(c1[0]), round(c1[1]), None),
                                                 Point(round(c2[0]), round(c2[1]), None)]
                        changed = True
                        break


def rejoin_fit(font, tol=4.0, min_span=30):
    """Two curves at a smooth node that are nearly one curve (the joins after the cleanup nudged their middles):
    one curve with the same end tangents, its handle lengths fitted to the pair by least squares, replaces them when
    it stays within tol units of the pair everywhere. Serif corners and spans under min_span stay."""
    from ufoLib2.objects import Point
    import string
    names = list(string.ascii_letters) + "zero one two three four five six seven eight nine".split()
    for name in names:
        for c in font[name].contours:
            changed = True
            while changed:
                changed = False
                P, n = c.points, len(c.points)
                for a in range(n - 6):
                    A, h1, h2, M, h3, h4, B = P[a:a + 7]
                    if not (A.type and M.type == "curve" and B.type == "curve" and M.smooth) or \
                            any(q.type for q in (h1, h2, h3, h4)):
                        continue
                    if math.hypot(B.x - A.x, B.y - A.y) < min_span:
                        continue
                    if abs(h2.x - M.x) < 0.6 or abs(h2.y - M.y) < 0.6:
                        continue                  # the middle node is an extreme (a round end's side, top or bottom): keep it
                    pa, p1, p2, pm, p3, p4, pb = ((q.x, q.y) for q in (A, h1, h2, M, h3, h4, B))
                    u1 = (p1[0] - pa[0], p1[1] - pa[1]); l1 = math.hypot(*u1)
                    u2 = (p4[0] - pb[0], p4[1] - pb[1]); l2 = math.hypot(*u2)
                    if l1 < 1 or l2 < 1:
                        continue
                    u1 = (u1[0] / l1, u1[1] / l1); u2 = (u2[0] / l2, u2[1] / l2)
                    samples = [_bez(pa, p1, p2, pm, k / 8) for k in range(1, 9)] + \
                              [_bez(pm, p3, p4, pb, k / 8) for k in range(1, 8)]
                    # chord-length parameters for the samples along the pair
                    pts = [pa] + samples + [pb]
                    d = [0]
                    for q0, q1 in zip(pts, pts[1:]):
                        d.append(d[-1] + math.hypot(q1[0] - q0[0], q1[1] - q0[1]))
                    ts = [x / d[-1] for x in d[1:-1]]
                    # least squares for handle lengths a, b
                    S11 = S12 = S22 = R1 = R2 = 0
                    for t, q in zip(ts, samples):
                        b1, b2 = 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t
                        base = ((1 - t) ** 3 + b1) * pa[0] + (b2 + t ** 3) * pb[0], ((1 - t) ** 3 + b1) * pa[1] + (b2 + t ** 3) * pb[1]
                        r = (q[0] - base[0], q[1] - base[1])
                        v1 = (b1 * u1[0], b1 * u1[1]); v2 = (b2 * u2[0], b2 * u2[1])
                        S11 += v1[0] * v1[0] + v1[1] * v1[1]; S22 += v2[0] * v2[0] + v2[1] * v2[1]
                        S12 += v1[0] * v2[0] + v1[1] * v2[1]
                        R1 += v1[0] * r[0] + v1[1] * r[1]; R2 += v2[0] * r[0] + v2[1] * r[1]
                    det = S11 * S22 - S12 * S12
                    if abs(det) < 1e-9:
                        continue
                    la = (R1 * S22 - R2 * S12) / det; lb = (S11 * R2 - S12 * R1) / det
                    if la <= 0 or lb <= 0:
                        continue
                    c1 = (pa[0] + la * u1[0], pa[1] + la * u1[1]); c2 = (pb[0] + lb * u2[0], pb[1] + lb * u2[1])
                    err = max(min(math.hypot(q[0] - z[0], q[1] - z[1]) for z in
                                  (_bez(pa, c1, c2, pb, k / 200) for k in range(201))) for q in samples + [pm])
                    if err <= tol:
                        c.points[a + 1:a + 6] = [Point(round(c1[0]), round(c1[1]), None),
                                                 Point(round(c2[0]), round(c2[1]), None)]
                        changed = True
                        break


def owner_positions(font, near=3.0):
    """The owner's moves saved on a build whose point numbering has since changed (0.24, before the rounded corners
    came back): each moved point is found by where it was (the nearest point of the same kind within `near` units)
    and goes where the owner put it; a node's handles move with it. Unmatched moves are reported."""
    if not os.path.exists(OWNER_EDITS):
        return
    for name, e in json.load(open(OWNER_EDITS)).items():
        moves = e.get("by_position")
        if not moves or name not in font:
            continue
        g = font[name]
        allp = [(c, i, p) for c in g.contours for i, p in enumerate(c.points)]
        done = set()
        for x0, y0, x1, y1, kind in moves:
            cands = [(math.hypot(p.x - x0, p.y - y0), c, i, p) for c, i, p in allp
                     if (p.type is not None) == (kind == "on") and id(p) not in done]
            if not cands or min(cands)[0] > near:
                print(f"owner move on {name} at ({x0:.0f},{y0:.0f}) not matched")
                continue
            _, c, i, p = min(cands, key=lambda t: t[0])
            p.x, p.y = round(x1), round(y1)
            done.add(id(p))
            OWNER_MOVED.setdefault(name, set()).add((g.contours.index(c), i))


R_EAR = {"R": 47, "centre": (369, 467), "neck": (298, 464), "top": (339, 528),   # Serrif's, measured (Area units)
         "neck_in": (260, 456),   # the owner's 0.26 save: the neck tilts, rising into the dip
         "dip": 0.45}             # the dip's handles, as shares of its span (they were about 0.3: a sharp S)


def r_ear_redraw(font):
    """r's tail (owner, 2026-11-12: "redraw the r tail to match serif"). Measured on Serrif at Area's x-height, lined
    up on the stem: a round end of radius 47 centred at (369, 467), reaching 416; the arm's underside rises from the
    stem to a level neck at (301, 465) and dips into the end's bottom; the arm's top runs from the end's top at
    (339, 528) back to the stem. Drawn here as Area's own curves on those positions (a circle with circle handles,
    round quarters elsewhere), not Serrif's points. Replaces points 1-8 after every other rule."""
    from ufoLib2.objects import Point
    c = font["r"].contours[0]
    P = c.points
    # the stem junction: the curve node near the stem's top right that the arm's top arrives at, a line after it
    j = next((i for i, p in enumerate(P) if p.type == "curve" and 195 < p.x < 225 and 395 < p.y < 430
              and P[(i + 1) % len(P)].type == "line"), None)
    if not (P[0].type and j):
        print("r_ear_redraw: r's points moved; skipped")
        return
    R = R_EAR["R"]
    cx, cy = R_EAR["centre"]
    nx, ny = R_EAR["neck"]
    tx, ty = R_EAR["top"]
    k = KAPPA * R
    base, stem = P[0], P[j]
    bot = (cx, cy - R)
    ix, iy = R_EAR["neck_in"]
    ux, uy = nx - ix, ny - iy                    # the neck's tangent, from the owner's handle
    ul = math.hypot(ux, uy)
    span = math.hypot(bot[0] - nx, bot[1] - ny)
    hd = R_EAR["dip"] * span
    pts = [(base.x, ny - 85, None), (ix, iy, None), (nx, ny, "curve"),                    # underside up to the neck
           (nx + ux / ul * hd, ny + uy / ul * hd, None), (bot[0] - hd, bot[1], None),     # the neck eases down
           (bot[0], bot[1], "curve"),                                                     # into the end's bottom
           (cx + k, bot[1], None), (cx + R, cy - k, None), (cx + R, cy, "curve"),       # the end: a circle
           (cx + R, cy + 0.7 * (ty - cy), None), (tx + 0.55 * (cx + R - tx), ty, None), (tx, ty, "curve"),
           (tx - 0.38 * (tx - stem.x), ty, None), (stem.x + 25, stem.y + 55, None)]  # the arm's top back to the stem
    c.points[1:j] = [Point(round(x), round(y), t, smooth=t is not None) for x, y, t in pts]


def f_hook_redraw(font):
    """f (owner, 2026-11-12: "make the top part more smooth of a transition from thick to thin, and a rounder, more
    circular arc at the top"). The hook's inner arc left the stem with a short handle and overshot with the next, so
    the stroke went thin, lumpy, then thick. Redrawn as round arcs: the outer one nearly a circle (radius 170 from the
    stem's left edge to the top), the inner one a round quarter from the stem's right edge to a thin top (38 units),
    then the same neck and round end as before. Points 19-31 (contour 0)."""
    c = font["f"].contours[0]
    P = c.points
    need = (P[18].type == "line" and P[19].type == "line" and P[22].type and P[25].type and P[28].type
            and P[31].type and P[32].type == "line")
    if not need:
        print("f_hook_redraw: f's points moved; skipped")
        return
    xl, xr = P[31].x, P[19].x                   # the stem's left and right edges
    top = P[28].y
    Ro = 170
    ot = (xl + Ro, top)                         # outer top
    it = (ot[0] - 6, top - 38)                  # inner top: a thin top
    ri = it[0] - xr                             # the inner quarter's width
    iy = it[1] - round(1.15 * ri)               # where the inner arc leaves the stem
    ball = (P[25].x, P[25].y)
    k = 0.56
    spec = {19: (xr, iy), 20: (xr, iy + k * (it[1] - iy)), 21: (it[0] - k * ri, it[1]), 22: it,
            23: (it[0] + 0.5 * (ball[0] - it[0]), it[1]), 24: (ball[0] - 52, ball[1]), 25: ball,
            26: (ball[0] + 74, ball[1]), 27: (ot[0] + 124, top), 28: ot,
            29: (ot[0] - k * Ro, top), 30: (xl, top - k * Ro), 31: (xl, top - Ro)}
    for i, (x, y) in spec.items():
        P[i].x, P[i].y = round(x), round(y)
    for i in (22, 25, 28, 31):
        P[i].smooth = True


def h_j_smooth(font):
    """h (owner, 2026-11-12: "less thick at the top curve, please fine tune my adjustment and smooth it out"): the
    arch's top runs 48 units thick (it was 57: the inner top rises 9), and both of the shoulder's curves get even,
    round handles (0.56; the outer one was 0.43 and 0.70 after the owner lowered its start). j ("smooth out the bottom
    curve more"): the bottom's outer and inner quarters get round handles (0.56; were 0.60-0.65)."""
    k = 0.56
    P = font["h"].contours[0].points
    if all(P[i].type for i in (0, 3, 6, 29, 32)) and P[29].type == "line":
        a, b = P[3], P[6]                      # inner: top to the right stem
        P[4].x = round(a.x + k * (b.x - a.x)); P[5].x, P[5].y = b.x, round(b.y + k * (a.y - b.y))
        a, b = P[29], P[32]                    # outer: the right stem up to the top
        P[30].x, P[30].y = a.x, round(a.y + k * (b.y - a.y)); P[31].x, P[31].y = round(b.x + k * (a.x - b.x)), b.y
    J = font["j"].contours[0].points
    if all(J[i].type for i in (0, 3, 16, 19)):
        a, b = J[0], J[3]                      # outer: bottom up to the stem's right edge
        J[1].x, J[1].y = round(a.x + k * (b.x - a.x)), a.y; J[2].x, J[2].y = b.x, round(b.y - k * (b.y - a.y))
        a, b = J[16], J[19]                    # inner: the stem's left edge down to the bottom
        J[17].x, J[17].y = a.x, round(a.y - k * (a.y - b.y)); J[18].x, J[18].y = round(b.x + k * (a.x - b.x)), b.y


ARCH_TOP = 0.62      # n, m, h: the arch's top thickness, in stems (owner, 2026-11-12, h: "less thick at the top curve";
                     # one value for all three: they measured n 0.71, m 0.72, h 0.69)


def arch_tops(font, sw):
    """The top of every n, m and h arch at ARCH_TOP stems: each inner arch's top node (a level node under an outer
    top, within 60 units of it sideways) moves, with its handles, to the outer top minus the thickness."""
    for name in ("n", "m", "h"):
        g = font[name]
        tops, inner = [], []
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i, p in enumerate(P):
                if not p.type:
                    continue
                a, b = P[(i - 1) % n], P[(i + 1) % n]
                if a.type is None and b.type is None and abs(a.y - p.y) < 0.5 and abs(b.y - p.y) < 0.5:
                    (tops if p.y > 515 else inner if 420 < p.y <= 515 else []).append((c, i, p))
        for c, i, p in inner:
            near = [t for _, _, t in tops if abs(t.x - p.x) < 60]
            if not near:
                continue
            y = round(min(t.y for t in near) - ARCH_TOP * sw)
            P, n = c.points, len(c.points)
            for q in (P[(i - 1) % n], p, P[(i + 1) % n]):
                q.y = y


def five_foot_handle(font):
    """5: the stem's foot (node 4, smooth) carries its handle on along the stem's lean, so the stem runs into the
    bowl's start without a bend (five_serrif leaned the stem; a later pass reset the handle)."""
    P = font["five"].contours[0].points
    a, b, h = P[3], P[4], P[5]
    if not (a.type == "line" and b.type == "line" and h.type is None):
        return
    L = math.hypot(h.x - b.x, h.y - b.y)
    dx, dy = b.x - a.x, b.y - a.y
    d = math.hypot(dx, dy)
    h.x, h.y = round(b.x + dx / d * L), round(b.y + dy / d * L)


def t_top_clean(font):
    """t (owner, 2026-11-12: "this t is all messed up in the top left. straighten the points out, fix the curves,
    make the lines straight, fix the rounding"). Keeping the owner's heights (crossbar 465-514, top 624, left end at
    50): the crossbar's edges level, the stem's right edge upright to a flat top, the flag one concave curve from the
    stem's top into the crossbar's top (level where it arrives), and a square left end with the same small rounded
    corners as the serifs. Points 0 and 15-30 (contour 0)."""
    P = font["t"].contours[0].points
    if len(P) != 31 or not (P[0].type == "line" and P[1].type == "line" and P[16].type == "line"
                            and P[19].type == "line" and P[20].type == "line" and P[23].type and P[30].type):
        print("t_top_clean: t's points moved; skipped")
        return
    bot, top_bar, top = 465, 514, 624
    xs_l, xs_r = P[1].x, P[15].x                    # the stem's left and right edges
    xe = 50                                         # the crossbar's left end
    flag_top = xs_r - 33                            # the flat top's left corner
    r = 6                                           # corner rounding, as on the serifs
    spec = {0: (xs_l, bot), 15: (xs_r, bot), 16: (P[16].x, bot), 17: (P[16].x, top_bar), 18: (xs_r, top_bar),
            19: (xs_r, top), 20: (flag_top, top),
            21: (flag_top - 12, top - 50), 22: (xe + 45, top_bar), 23: (xe + r, top_bar),
            24: (xe + 2, top_bar), 25: (xe, top_bar - 2), 26: (xe, top_bar - r),
            27: (xe, bot + r), 28: (xe, bot + 2), 29: (xe + 2, bot), 30: (xe + r, bot)}
    for i, (x, y) in spec.items():
        P[i].x, P[i].y = round(x), round(y)
    for i in (23, 26, 27, 30):
        P[i].smooth = False


# Round ends, one family (owner, 2026-11-12: "do these shapes all need to go through a consistency pass to be
# slightly more consistent? from c, f, j, g, r, y ... i like how smooth and round the g's ear is ... feel more
# visibly similar and smooth"). Each end's outer quarter becomes a circle: its side node (upright tangent) and the
# node below or above it (level tangent) sit on one circle centred at (that node's x, the side's y), radius the mean
# of the end's own width and height, kept within END_R; both get circle handles. The g's ear measures 40, the r's 47.
END_R = (40, 47)
ROUND_ENDS = {"c": (18, 15), "a": (17, 20), "g": (28, 25), "j": (28, 25)}   # glyph: (side node, its level neighbour)


def _circle_quarter(P, si, li):
    n = len(P)
    S, L = P[si], P[li]
    cx, cy = L.x, S.y
    r = (abs(S.x - cx) + abs(S.y - L.y)) / 2
    r = min(END_R[1], max(END_R[0], r))
    sx = 1 if S.x > cx else -1
    sy = 1 if L.y > cy else -1                          # the level node above (+1) or below (-1) the centre
    S.x = round(cx + sx * r)
    L.y = round(cy + sy * r)
    k = KAPPA * r
    step = 1 if (li - si) % n < n / 2 else -1          # from the side toward the level node along the contour
    hs, hl = P[(si + step) % n], P[(li - step) % n]
    hs.x, hs.y = S.x, round(S.y + sy * k)               # the side's handle toward the level node: upright
    hl.x, hl.y = round(L.x + sx * k), L.y               # the level node's handle toward the side: level
    ho = P[(si - step) % n]                             # the side's other handle: upright too (smooth)
    ho.x = S.x
    hn = P[(li + step) % n]                             # the level node's other handle (toward the neck): level
    if hn.type is None:
        hn.y = L.y
    S.smooth = L.smooth = True


def round_ends(font):
    for name, (si, li) in ROUND_ENDS.items():
        P = font[name].contours[0].points
        if not (P[si].type and P[li].type):
            print(f"round_ends: {name}'s points moved; skipped")
            continue
        _circle_quarter(P, si, li)
    # f: its end was one curve from the bottom over the top; a side node (as the g's and r's ends have) goes in
    from ufoLib2.objects import Point
    c = font["f"].contours[0]
    P = c.points
    if P[25].type and P[28].type and P[26].type is None and P[27].type is None:
        B, T = P[25], P[28]
        r = min(END_R[1], max(END_R[0], 44))
        cx, cy = B.x, B.y + r
        k = KAPPA * r
        sx = cx + r
        c.points[26:28] = [Point(round(B.x + k), B.y, None), Point(round(sx), round(cy - k), None),
                           Point(round(sx), round(cy), "curve", smooth=True),
                           Point(round(sx), round(cy + 0.55 * (T.y - cy)), None),
                           Point(round(T.x + 0.55 * (sx - T.x)), T.y, None)]
        B.smooth = True


G_CORNER = (78, (-0.89, -0.45))   # Serrif, measured at Area's cap height: the stem's right edge runs down to 78, and
                                   # the bowl's outside leaves that corner heading down-left at this direction


def G_bottom_serrif(font):
    """G (owner, 2026-11-12: "make the bottom part of the G match serrif"; replaces 0.21's smooth turn): the stem's
    right edge runs straight down to a corner at G_CORNER's height, and the bowl's outside leaves it at Serrif's
    angle, sweeping level into the bottom (0)."""
    P = font["G"].contours[0].points
    if not (P[0].type == "curve" and P[3].type == "curve" and P[4].type == "line" and P[1].type is None):
        print("G_bottom_serrif: G's points moved; skipped")
        return
    y, (ux, uy) = G_CORNER
    B, C = P[0], P[3]
    C.y = y
    C.smooth = False
    d = math.hypot(C.x - B.x, C.y - B.y)
    P[1].x, P[1].y = round(B.x + 0.58 * (C.x - B.x)), B.y
    P[2].x, P[2].y = round(C.x + ux * 0.45 * d), round(C.y + uy * 0.45 * d)


F_HOOK = dict(leave=600, top_dx=165, ball=(82, -77), ball_r=44, thin=36, inner_dx=10, inner_leave=615, k=0.56)


def f_hook_serrif(font):
    """f (owner, 2026-11-12: "smooth out the top part of the f, more like serrif"). Redrawn in Serrif's proportions
    (measured, not traced): the outer arc a round quarter from the stem's left edge to the top, then a flat quarter to
    a round ball; the inner curve leaves the stem low and rises in one long oval to a thin top, then turns straight
    down into the ball's left side (a vertical tangent there, as in Serrif), so the stroke thins evenly from stem to
    top and swells only in the ball. Replaces the hook's points (contour 0, from the inner stem edge to the outer)."""
    from ufoLib2.objects import Point
    c = font["f"].contours[0]
    P = c.points
    i0 = next((i for i, p in enumerate(P) if p.type == "line" and p.y > 600 and abs(p.x - P[i - 1].x) <= 2
               and P[i - 1].y < 560), None)
    i1 = next((i for i in range(len(P) - 2, 0, -1) if P[i].type == "curve" and P[i + 1].type == "line"
               and P[i + 1].y < 560 and abs(P[i].x - P[i + 1].x) <= 2), None) if i0 is not None else None
    if i0 is None or i1 is None or i1 <= i0:
        print("f_hook_serrif: f's points moved; skipped"); return
    xr, xl = P[i0].x, P[i1].x
    top = max(p.y for p in P[i0:i1 + 1])
    h = F_HOOK; k = h["k"]
    ot = (xl + h["top_dx"], top)
    it = (ot[0] - h["inner_dx"], top - h["thin"])
    cx, cy = ot[0] + h["ball"][0], top + h["ball"][1]; r = h["ball_r"]; q = 0.552 * r
    il = h["inner_leave"]; ol = h["leave"]
    pts = [((xr, il), "line", False),
           ((xr, il + k * (it[1] - il)), None, False), ((it[0] - k * (it[0] - xr), it[1]), None, False),
           (it, "curve", True),
           ((it[0] + k * (cx - r - it[0]), it[1]), None, False), ((cx - r, cy + k * (it[1] - cy)), None, False),
           ((cx - r, cy), "curve", True),
           ((cx - r, cy - q), None, False), ((cx - q, cy - r), None, False), ((cx, cy - r), "curve", True),
           ((cx + q, cy - r), None, False), ((cx + r, cy - q), None, False), ((cx + r, cy), "curve", True),
           ((cx + r, cy + k * (top - cy)), None, False), ((ot[0] + k * (cx + r - ot[0]), top), None, False),
           (ot, "curve", True),
           ((ot[0] - k * (ot[0] - xl), top), None, False), ((xl, ol + k * (top - ol)), None, False),
           ((xl, ol), "curve", True)]
    new = [Point(round(x), round(y), type=t, smooth=s) for (x, y), t, s in pts]
    c.points[i0:i1 + 1] = new
