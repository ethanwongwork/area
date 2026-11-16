"""Steeper joins (0.49; owner, 2026-11-12: "the curves into a serif or inside a counter should be more steep, not as
long and curved out"). Every rule here reads the finished outline by its geometry, never by point number, and runs
after lightening, just before spacing.

Measured on build 0.46 against the two reference faces, in stems (docs/research/serif-typeface-2026-11-10/
evaluation-0.49.md):
- a foot bracket was twice as full near the stem (serif 0.81 thick at 0.1 from the stem; references 0.57 and 0.62);
- an arm's flare into its beak began 2.4 H stems before the beak (references 1.3 to 1.7) and arrived as a round
  sweep, where the references arrive almost straight;
- the corner where E's and L's lower arm leaves the stem was a sweep 200 units long (references: a corner);
- flat-cut ends were as thin as 23 units (c e t tails, r's foot), under the serif tip's 30."""
import math

from ufoLib2.objects import Point

BRACKET_SHARES = (0.70, 0.90)   # handle shares up the stem and along the serif: 0.45 / 0.75 until 0.46
FLARE_LEN = 1.50                # an arm's flare, in the glyph's own stems, measured back from the beak's inner face
FLARE_K = (0.60, 0.25)          # handle shares along the arm and along the beak's face: 0.65 / 0.55 until 0.46
CORNER = 0.50                   # the fillet where a lower arm leaves its stem, in stems each way
CORNER_K = 0.56
END_MIN = 30                    # no flat-cut end thinner than the serif tip


def segs(c):
    """[(kind, i0, h1, h2, i3)] for each segment of a closed contour."""
    P, n = c.points, len(c.points)
    on = [i for i, p in enumerate(P) if p.type]
    out = []
    for k, i in enumerate(on):
        j = on[(k + 1) % len(on)]
        gap = (j - i) % n
        if gap == 3:
            out.append(("curve", i, (i + 1) % n, (i + 2) % n, j))
        elif gap == 1:
            out.append(("line", i, None, None, j))
    return out


def flares(g):
    """Curves that run level along an arm and turn upright into a beak: (contour, arm node, arm handle, beak handle,
    beak node), in point numbers."""
    found = []
    for ci, c in enumerate(g.contours):
        P = c.points
        S = segs(c)
        for k, (kind, i0, h1, h2, i3) in enumerate(S):
            if kind != "curve":
                continue
            for a, ha, ht, t, nb in ((i0, h1, h2, i3, S[(k + 1) % len(S)]), (i3, h2, h1, i0, S[k - 1])):
                A, HA, HT, T = P[a], P[ha], P[ht], P[t]
                dx, dy = abs(T.x - A.x), abs(T.y - A.y)
                if abs(HA.y - A.y) > 1 or abs(HT.x - T.x) > 1 or not (60 <= dx <= 320 and 40 <= dy <= 150) or dx < dy:
                    continue
                q0, q1 = P[nb[1]], P[nb[4]]
                if nb[0] == "line" and abs(q0.x - q1.x) < 2 and abs(q0.y - q1.y) > 45:
                    continue                                   # an upright line beyond: a serif bracket, not a beak
                found.append((ci, a, ha, ht, t))
    return found


ARMS = "EFLTZ"


def _stem(font, name):
    """The glyph's upright stem, read at a quarter of its height."""
    from normalize import flatten, spans_at
    g = font[name]
    ys = [p.y for c in g.contours for p in c.points]
    s = spans_at(flatten(g), min(ys) + (max(ys) - min(ys)) * (0.5 if name == "L" else 0.25 if name != "T" else 0.4))
    return min(b - a for a, b in s)


def arm_flares(font, names=ARMS):
    """Each arm runs straight and turns into its beak over the last FLARE_LEN stems, arriving almost straight
    (FLARE_K). Where a lower arm left its stem in a long sweep (E, L), the corner becomes a fillet CORNER stems
    each way and the arm runs level from it. A beak's cut end is at least END_MIN wide."""
    done, wide = [], []
    for name in names:
        g = font[name]
        stem = _stem(font, "H" if name.isupper() else "n")
        want = round(FLARE_LEN * stem)
        seen = set()
        for _ in range(8):                                   # point numbers change when a node is inserted
            for ci, a, ha, ht, t in flares(g):
                c = g.contours[ci]
                P, n = c.points, len(c.points)
                A, HA, HT, T = P[a], P[ha], P[ht], P[t]
                if id(A) in seen:
                    continue
                sx = 1 if T.x > A.x else -1
                fwd = (ha - a) % n == 1                      # the contour runs arm -> beak
                o = (a - 1) % n if fwd else (a + 1) % n      # the point on A's other side
                inserted = False
                if P[o].type is None:                        # a sweep from the stem: rebuild it as a corner fillet
                    o2 = (a - 2) % n if fwd else (a + 2) % n
                    b = (a - 3) % n if fwd else (a + 3) % n
                    B = P[b]
                    if abs(P[o2].x - B.x) <= 1 and abs(B.x - A.x) > 60:
                        r = round(CORNER * stem)
                        sy = 1 if B.y > A.y else -1
                        B.y = A.y + sy * r
                        cx = B.x + sx * r
                        P[o].x, P[o].y = round(cx - sx * r * CORNER_K), A.y
                        P[o2].x, P[o2].y = B.x, round(B.y - sy * r * CORNER_K)
                        if fwd:                              # B, o2, o, [new], A: the fillet ends at the new node
                            c.points.insert(a, Point(cx, A.y, "curve", smooth=True))
                            A.type = "line"
                        else:                                # A, [new], o, o2, B
                            c.points.insert(a + 1, Point(cx, A.y, "line", smooth=True))
                        inserted = True
                if abs(T.x - A.x) > want:
                    A.x = T.x - sx * want
                P, n = c.points, len(c.points)
                ti = P.index(T)
                far = P[(ti + 7 * (1 if fwd else -1)) % n]     # the cut's other corner, past two softened corners
                near = [P[(ti + k * (1 if fwd else -1)) % n] for k in (1, 2, 3)]
                if abs(far.y - T.y) <= 2 and all(abs(q.x - T.x) <= 8 and abs(q.y - T.y) <= 8 for q in near):
                    lack = END_MIN - abs(far.x - T.x)
                    if 0 < lack <= 8:                        # the cut end is narrower than the serif tip: widen inward
                        for q in [T] + near:
                            q.x -= sx * lack
                        wide.append(f"{name} +{lack}")
                HA.x, HA.y = round(A.x + (T.x - A.x) * FLARE_K[0]), A.y
                HT.x, HT.y = T.x, round(T.y + (A.y - T.y) * FLARE_K[1])
                A.smooth = True
                seen.add(id(A))
                done.append(f"{name} {abs(T.x - A.x)}")
                if inserted:
                    break
            else:
                break
    return done, wide


# The top end of C, G and S (owner, 0.49: "adjusting the top part of the G and C to match georgia pro and serrif").
# Measured at one cap height: the end's barb stops at 0.650 (Georgia Pro) and 0.695 (Serrif) of the cap height, Area's
# at 0.755; and across the stroke at 60 degrees from the bowl's centre both references are 0.6-0.7 H stems, Area's
# C 0.83 and G 1.08, because the inside curve cut the corner toward a short barb. C's barb was 40 wide, G's 53.
END_BARB_FOOT = 0.68            # the barb's cut end, as a share of the cap height. 0.695 in 0.49 (Serrif's); 0.54, owner with
                                # pictures over Georgia Pro (0.643 on C, 0.651 on G): most of the way to it
END_LEAN = 0.10                 # the barb's inside edge leans this much (run over rise) as it reaches the cut, so the barb is
                                # a wedge: 1.7 times its foot's width 0.14 cap heights up, as Georgia Pro's (0.54; upright before)
END_BARB_W = 36                 # the barb's width at its cut end, on C, G and S alike: 0.42 H stems, Georgia Pro's
                                # share of its stem (0.58 audit: 42 was its share of the cap height, on a lighter face)
END_K = (0.62, 0.55)            # the inside curve's handles, toward the corner where its two tangents meet: along the
                                # top (the bowls' tension), and up the barb's leaning inside edge


def barb_tops(font, names="CGS", cap=712):
    done = []
    for name in names:
        g = font[name]
        xs = [p.x for c in g.contours for p in c.points]
        for c in g.contours:
            P, n = c.points, len(c.points)
            for kind, i0, h1, h2, i3 in segs(c):
                if kind != "curve":
                    continue
                for a, ha, ht, t in ((i0, h1, h2, i3), (i3, h2, h1, i0)):
                    N, T = P[a], P[t]
                    if not (N.y > 0.9 * cap and abs(P[ha].y - N.y) <= 1 and 0.7 * cap < T.y < 0.8 * cap
                            and T.x > N.x + 80 and T.x > min(xs) + 0.7 * (max(xs) - min(xs))):
                        continue
                    band = [p for p in P if p.x >= T.x - 1 and T.y - 9 <= p.y <= T.y + 1]
                    right = max(p.x for p in band)
                    drop = (min(p.y for p in band)) - round(END_BARB_FOOT * cap)
                    shift = (right - END_BARB_W) - T.x
                    for p in band:
                        p.y -= drop
                        if p.x <= T.x + 8:
                            p.x += shift
                    cx = T.x - END_LEAN * (N.y - T.y)        # where the leaning edge's line meets the top's level
                    P[ha].x, P[ha].y = round(N.x + END_K[0] * (cx - N.x)), N.y
                    P[ht].x, P[ht].y = round(T.x + END_K[1] * (cx - T.x)), round(T.y + END_K[1] * (N.y - T.y))
                    done.append(f"{name} foot {T.y - 7} inner {T.x}")
    return done


TIP = 30                        # a serif tip's thickness (derive.TARGET_TIP)


def brackets_rest(font, names):
    """The brackets clean.brackets_one does not reach (its stem end must sit on a long upright line): K's head, k's
    and the 1's feet, p's and q's bowl-side feet. And r's long right foot, whose top sat at 23, comes up to the
    tip every other foot has."""
    done = []
    P = font["r"].contours[0].points
    low = [p for p in P if 10 < p.y < 27 and p.x > 150]
    if low and max(p.y for p in low) < TIP:
        up = TIP - max(p.y for p in low)
        for p in low:
            p.y += up
        done.append(f"r foot +{up}")
    for name in names:
        for c in font[name].contours:
            P = c.points
            for kind, i0, h1, h2, i3 in segs(c):
                if kind != "curve":
                    continue
                a, d = P[i0], P[i3]
                dx, dy = abs(d.x - a.x), abs(d.y - a.y)
                if not (50 <= dx <= 135 and 50 <= dy <= 80):
                    continue
                for stem, hs, serif, hf in ((a, P[h1], d, P[h2]), (d, P[h2], a, P[h1])):
                    if abs(hs.x - stem.x) > 0.5 or abs(hf.y - serif.y) > 0.5:
                        continue
                    ks, kf = abs(hs.y - stem.y) / dy, abs(hf.x - serif.x) / dx
                    near_line = min(abs(abs(serif.y - z) - TIP) for z in (0, 520, 712, -224, -233)) <= 3
                    if near_line and (0.38 <= ks <= 0.66 and 0.62 <= kf <= 0.82 or name == "r" and serif.y == TIP):
                        hs.y = round(stem.y + BRACKET_SHARES[0] * (serif.y - stem.y))
                        hf.x = round(serif.x + BRACKET_SHARES[1] * (stem.x - serif.x))
                        done.append(f"{name} {ks:.2f}/{kf:.2f}")
    return done


def barb_bottom(font, name="S", cap=712, spur=True):
    """S's lower-left barb is its top barb turned half round: the same rule, on the glyph rotated 180 degrees."""
    g = font[name]
    def turn():
        for c in g.contours:
            for p in c.points:
                p.x, p.y = -p.x, cap - p.y
    turn()
    try:
        return barb_tops(font, name, cap) + (barb_spurs(font, name, cap) if spur else [])
    finally:
        turn()


# Head serifs (0.50; owner took proposal 1). The flags on b d h i j k l m n p r sloped 13.5 to 15 degrees; Georgia
# Pro's slope 3.5, Serrif's 12.9. A steep flag was the strongest old-style mark left. The flag turns about the stem's
# top corner, which stays (so heights hold): its tip, underside and bracket rise together, so its thickness, length
# and bracket are the same. n's tip top goes from 0.955 to 0.98 of the x-height (Georgia Pro 0.993, Serrif 0.948).
FLAG_DEG = 8
FLAGS = "bdhijklmnpr"


def _flags(g, lo, hi, xh):
    """Each head serif of a glyph: (tip node, stem corner node, [the tip and every point of the flag's face,
    underside and bracket, down to the bracket's node on the stem])."""
    out = []
    for c in g.contours:
        P, n = c.points, len(c.points)
        for kind, i0, _, _, i3 in segs(c):
            if kind != "line":
                continue
            t, k = (i0, i3) if P[i0].x < P[i3].x else (i3, i0)
            T, C = P[t], P[k]
            run, rise = C.x - T.x, C.y - T.y
            if not (80 <= run <= 170 and T.y > 0.8 * xh and rise > 0
                    and lo <= math.degrees(math.atan2(rise, run)) <= hi):
                continue
            step = 1 if (t + 1) % n != k else -1             # walk from the tip away from the corner
            group, i = [T], t
            for _ in range(14):
                i = (i + step) % n
                p = P[i]
                group.append(p)
                if p.type:
                    j = (i + step) % n
                    while not P[j].type:
                        j = (j + step) % n
                    if abs(P[j].x - p.x) <= 1 and p.y - P[j].y > 100:
                        out.append((T, C, group))            # the bracket's node on the stem: the flag ends here
                        break
    return out


def flatter_flags(font, names=FLAGS, xh=520):
    done = []
    want = math.tan(math.radians(FLAG_DEG))
    for name in names:
        for T, C, group in _flags(font[name], 10, 22, xh):
            run, rise = C.x - T.x, C.y - T.y
            up = round(rise - run * want)
            for p in group:
                p.y += up
            under = min(p.y for p in group if abs(p.x - T.x) <= 8)
            lift = (T.y - under) - TIP                       # 0.58: the tip as thick as a foot's (30; it was 32)
            if 0 < lift <= 6:
                for p in group:
                    if p.y < T.y - 9:
                        p.y += lift
            done.append(f"{name} {math.degrees(math.atan2(rise, run)):.1f} +{up}")
    return done


# One height (0.51; owner: "align them"). The head serif's corner sat at 1.00 of the x-height on n and m, 0.99 on p
# and 0.97 on r; both references hold one height on all four. p's and r's whole head serif (corner, tip, underside,
# bracket) rises to n's. r's notch and arm, fitted in 0.45, do not move: the cut from the corner down to the notch
# is 13 units longer.
FLAG_LEVEL = "pr"


def level_flags(font, names=FLAG_LEVEL, xh=520):
    ref = max(C.y for _, C, _ in _flags(font["n"], 5, 12, xh))
    done = []
    for name in names:
        for T, C, group in _flags(font[name], 5, 12, xh):
            up = ref - C.y
            if up:
                for p in group + [C]:
                    p.y += up
                done.append(f"{name} +{up}")
    return done


# u's head serifs (0.67; evaluation of 2026-11-13, owner: "fix those three"). u is n turned half round, so its two
# heads were n's feet: level slabs stopping on the x-height, where every other x-height stem starts with the flag
# (8 degrees, corner 10 over the x-height). Both references give u the flag of n and i. i is the control (a stem and
# a flag, nothing else): each of u's heads takes i's flag point for point, from the stem's top corner round the tip
# to the bracket's node on the stem, placed on its own stem's left edge.
def u_flags(font, xh=520):
    src = _flags(font["i"], 5, 12, xh)
    if len(src) != 1:
        return ["u: i's flag was not found"]
    T, C, group = src[0]
    xi = group[-1].x                                         # i's stem edge
    kinds = [bool(p.type) for p in group]
    done = []
    c = font["u"].contours[0]
    P, n = c.points, len(c.points)
    for i in range(n):
        A, B = P[i], P[(i + 1) % n]                          # corner, then the tip, along the head's top edge
        if not (A.type == "line" and B.type == "line" and 100 <= A.x - B.x <= 170 and 0.9 * xh < B.y <= A.y <= xh + 12
                and A.y - B.y <= 30):
            continue
        mine = [P[(i + 1 + k) % n] for k in range(len(group))]
        if [bool(p.type) for p in mine] != kinds:
            done.append(f"u head at {A.x}: not drawn as i's flag is ({len(mine)} points)")
            continue
        xu = mine[-1].x
        if abs((A.x - xu) - (C.x - xi)) > 2:
            done.append(f"u head at {A.x}: stem {A.x - xu} wide, i's {C.x - xi}")
            continue
        was = (A.y, B.y)
        A.y = C.y
        for q, p in zip(mine, group):
            q.x, q.y = p.x - xi + xu, p.y
        done.append(f"u head on the stem at {xu}: top {was[1]}-{was[0]} > {B.y}-{A.y}")
    return done or ["u: no head found"]


# Extremes beside a spur or a junction (0.68; evaluation of 2026-11-13). At the top of C the arc arrived with a
# radius of 369 and left toward the spur's notch with 1229, its handle 1.31 times past the point where the two
# handles' lines meet: a flat, then a late turn. G (top and bottom), S and s were the same; in S and s the handle
# ran 1.7 to 3.4 times past the meeting point, so the one curve bent both ways. The short curve from the extreme to
# the notch is rebuilt: both handles at the outside tension of every round in the face (clean's 0.57), the handle at
# the extreme solved so the curvature there equals the long arc's on the other side (curvature = 2/3 x the far
# handle's distance off the tangent / the handle's length squared). The extreme, the notch and the long arc do not
# move; what changes is the angle at which the outline reaches the notch (C 20 to 26 degrees).
EXTREME_TENSION = 0.57
EXTREME_SET = ("C", "G", "S", "s")
EXTREME_INSIDE = ("five",)       # 0.70: the top of 5's bowl, whose short curve runs into the upright (handle 1.16 past)


def even_extremes(font, names=EXTREME_SET + EXTREME_INSIDE):
    done = []
    for name in names:
        g = font[name]
        top, bottom = max(p.y for c in g.contours for p in c.points), min(p.y for c in g.contours for p in c.points)
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i in range(n):
                N = P[i]
                if N.type != "curve" or (name not in EXTREME_INSIDE and min(abs(N.y - top), abs(N.y - bottom)) > 1):
                    continue
                hp, hn = P[i - 1], P[(i + 1) % n]
                if hp.type or hn.type or hp.y != N.y or hn.y != N.y:
                    continue
                sides = []                                   # (handle at N, far handle, far node, step)
                for h, step in ((hp, -1), (hn, 1)):
                    f, e = P[(i + 2 * step) % n], P[(i + 3 * step) % n]
                    if f.type or not e.type:
                        break
                    sides.append((h, f, e))
                if len(sides) != 2:
                    continue
                span = lambda s: math.hypot(s[2].x - N.x, s[2].y - N.y)
                short, long_ = sorted(sides, key=span)
                if span(long_) < 1.5 * span(short):
                    continue                                 # two like quarters: harmonize's business
                h, f, e = short
                H, Fl, _ = long_
                a_long, d_long = abs(H.x - N.x), abs(Fl.y - N.y)
                if a_long < 20 or d_long < 5:
                    continue
                k_long = (2 / 3) * d_long / a_long ** 2
                drop, run = abs(e.y - N.y), abs(e.x - N.x)
                if drop < 20 or run < 60:
                    continue
                a_was = abs(h.x - N.x)
                k_was = (2 / 3) * abs(f.y - N.y) / a_was ** 2 if a_was else 0
                # as drawn: is the handle past the meeting point, or the radius over 1.5 times the long arc's?
                fx, fy = abs(e.x - f.x), abs(e.y - f.y)
                reach_was = run - drop * fx / fy if fy else 0
                if a_was <= 1.02 * reach_was and k_was and 1 / 1.5 <= k_long / k_was <= 1.5:
                    continue
                d = drop * (1 - EXTREME_TENSION)
                a = math.sqrt(d / (1.5 * k_long))
                reach = a / EXTREME_TENSION                  # from N along its tangent to the handles' meeting point
                if not 0.25 * run <= reach <= 0.85 * run:
                    done.append(f"{name} ({N.x},{N.y}): no fit (reach {reach:.0f} of {run:.0f}); left")
                    continue
                sx, sy = (1 if e.x > N.x else -1), (1 if e.y > N.y else -1)
                rest = run - reach                           # the meeting point to the notch, along x
                reach2 = math.hypot(rest, drop)
                s2 = EXTREME_TENSION * reach2
                h.x = round(N.x + sx * a)
                f.x, f.y = round(e.x - sx * s2 * rest / reach2), round(e.y - sy * s2 * drop / reach2)
                k_now = (2 / 3) * abs(f.y - N.y) / abs(h.x - N.x) ** 2
                done.append(f"{name} ({N.x},{N.y}): radius {1 / k_long:.0f} | {1 / k_was if k_was else 0:.0f} > {1 / k_now:.0f}, "
                            f"notch angle {math.degrees(math.atan2(drop, rest)):.0f}")
    return done


# C's lower end (0.52; owner took proposal 3). It rose in an upright face to a point 5 units thick; both references
# end in a cut. The face and the height stay; the point becomes a level cut END_MIN wide with both corners rounded,
# so the end is the top barb's kind (upright face, level cut). Only the inside edge moves: END_MIN left at the cut,
# easing to nothing at the bowl's bottom. Tried first and dropped: c's tail (outer edge arriving at 75 degrees),
# which thinned the stroke's last third to 24 units, thinner than either reference.
ROUND = 7                       # derive.SOFT


def C_end(font, name="C", cap=712):
    c = font[name].contours[0]
    P, n = c.points, len(c.points)
    for a in range(n):
        A, B = P[a], P[(a + 1) % n]
        if not (A.type and B.type == "line" and abs(A.x - B.x) <= 1 and B.y - A.y > 80 and B.y < 0.45 * cap
                and P[a - 1].type is None and P[(a + 2) % n].type is None):
            continue
        Ih2 = P[(a + 2) % n]                                 # inner: B -> Ih2 -> Ih1 -> I
        x, top = B.x, B.y
        d = math.hypot(B.x - Ih2.x, B.y - Ih2.y)
        ui = ((B.x - Ih2.x) / d, (B.y - Ih2.y) / d)          # the inside edge's direction as it arrives
        L = (x - END_MIN, top)
        pt = lambda px, py, t=None: Point(round(px), round(py), t)
        Ih2.x -= END_MIN
        B.y = top - ROUND                                    # the face ends short of the corner
        new = [pt(x, top - 3), pt(x - 3, top), pt(x - ROUND, top, "curve"),
               pt(L[0] + ROUND, top, "line"), pt(L[0] + 3, top), pt(L[0] - 3 * ui[0], top - 3 * ui[1]),
               pt(L[0] - ROUND * ui[0], top - ROUND * ui[1], "curve")]
        i = P.index(B) + 1
        c.points[i:i] = new
        return f"{name} cut at {top}, {END_MIN} wide"
    return f"{name}: lower end not found"


# Diagonal joins (0.53; owner took proposal 4). Where a leaning stroke meets its serif (A K M N V W X Y, k v w x y)
# the join kept the fuller curve the upright brackets had until 0.49.
DIAG = "AKMNVWXY" "kvwxy"
ZONES = (0, 520, 712)


def diagonal_joins(g):
    """Curves between a serif's level edge and a leaning stroke: (serif node, serif handle, stroke handle, stroke
    node, the corner where the stroke's edge would meet the serif's edge)."""
    out = []
    for c in g.contours:
        P = c.points
        for kind, i0, h1, h2, i3 in segs(c):
            if kind != "curve":
                continue
            for s, hs, hn, nn in ((i0, h1, h2, i3), (i3, h2, h1, i0)):
                S, HS, HN, N = P[s], P[hs], P[hn], P[nn]
                if abs(HS.y - S.y) > 1 or min(abs(abs(S.y - z) - TIP) for z in ZONES) > 4:
                    continue
                dx, dy = HN.x - N.x, HN.y - N.y
                if abs(dy) < 2 or abs(dx) < 0.12 * abs(dy) or not (15 <= abs(N.y - S.y) <= 120):
                    continue                                 # level, or upright (an ordinary bracket)
                t = (S.y - N.y) / dy
                if t <= 0:
                    continue
                X = (N.x + dx * t, S.y)
                if not (8 <= abs(X[0] - S.x) <= 170) or (X[0] - S.x) * (HS.x - S.x) < 0:
                    continue
                out.append((S, HS, HN, N, X))
    return out


def steep_diagonals(font, names=DIAG):
    """Where a stroke leans away from its serif (the open side), the join takes the upright brackets' handle shares
    (BRACKET_SHARES: along the serif, along the stroke). Only handles move: every node stays, the owner's among
    them. The closed side, where the stroke leans back over the serif, keeps its fillet."""
    done = []
    for name in names:
        k = 0
        for S, HS, HN, N, X in diagonal_joins(font[name]):
            if abs(X[0] - S.x) < 25:
                continue                                     # no room for a curve: k's leg where it meets its flag
            if (N.x - X[0]) * (S.x - X[0]) > 0:
                continue                                     # the stroke leans back over the serif: a round fillet,
                                                             # as in both references; the steep shares pinch it into a hook
            HS.x = round(S.x + BRACKET_SHARES[1] * (X[0] - S.x))
            HN.x = round(N.x + BRACKET_SHARES[0] * (X[0] - N.x))
            HN.y = round(N.y + BRACKET_SHARES[0] * (X[1] - N.y))
            k += 1
        done.append(f"{name} {k}")
    return done


# G's bar and stem (0.54; owner: "adjust the bottom part of the G slightly to match a bit more closely to georgia
# pro"). Measured in cap heights: the bar's top at 0.511 (Georgia Pro 0.450), the stem's right edge 0.046 right of the
# top barb's (Georgia Pro's are in line). The bar and stem move as one piece, about half the way: nothing in them
# changes shape. The chin and the bowl's bottom follow the stem sideways only.
G_SHIFT = (-16, -22)


def G_lower(font, name="G", cap=712):
    c = font[name].contours[0]
    P, n = c.points, len(c.points)
    dx, dy = G_SHIFT
    for a in range(n):
        A, B = P[a], P[(a + 1) % n]
        if not (A.type and B.type == "line" and abs(A.x - B.x) <= 1 and B.y - A.y > 100 and A.y < 0.2 * cap
                and B.y < 0.5 * cap):
            continue
        block, i = [], (a + 1) % n
        for _ in range(40):                                  # from the stem's right edge, round the bar, to its left edge
            p = P[i]
            block.append(p)
            nx = P[(i + 1) % n]
            if p is not B and p.type and p.x < B.x - 50 and nx.type is None and abs(nx.x - p.x) <= 1 and nx.y < p.y - 30:
                break
            i = (i + 1) % n
        else:
            return f"{name}: bar not found"
        for p in block:
            p.x += dx
            p.y += dy
        A.x += dx
        P[(i + 1) % n].x += dx                               # the counter's handle under the stem's left edge
        return f"{name} bar and stem {dx}, {dy} ({len(block)} points)"
    return f"{name}: stem not found"


# The closed side of the lowercase diagonal joins (0.54; owner: "yes" to one curve). Their handles came from separate
# saves and rules: 0.27 to 0.65 of the way to the corner along the serif, 0.43 to 0.71 along the stroke. One round
# fillet now, x's own values (its four agreed). Handles only: no node moves.
FILLET_K = (0.62, 0.60)         # along the serif, along the stroke
FILLETS = "kvwxy"


def even_fillets(font, names=FILLETS):
    done = []
    for name in names:
        k = 0
        for S, HS, HN, N, X in diagonal_joins(font[name]):
            if abs(X[0] - S.x) < 25 or (N.x - X[0]) * (S.x - X[0]) <= 0:
                continue
            HS.x = round(S.x + FILLET_K[0] * (X[0] - S.x))
            HN.x = round(N.x + FILLET_K[1] * (X[0] - N.x))
            HN.y = round(N.y + FILLET_K[1] * (X[1] - N.y))
            k += 1
        done.append(f"{name} {k}")
    return done


# The barb's notch and spur (0.55; owner: "id prefer to add the spur since it removes some visual weight"). Georgia
# Pro's wedge carries its width because a notch is cut from the top: the bowl's top runs down into the notch, a
# straight edge rises to the spur's corner, and the spur's top is level. Measured on its C in cap heights: spur top
# 0.063 wide, notch 0.091 left of the barb's outer edge and 0.063 deep. Area's: the spur's top at the cap height (it
# was 12 under), the same widths, the notch a little shallower (0.05) so it holds at text sizes.
SPUR_W = 38                     # the spur's level top, from the barb's outer edge
NOTCH_IN = 56                   # the notch, left of the barb's outer edge
NOTCH_DEEP = 36                 # and below the spur's top
NOTCH_K = (0.55, 0.36)          # the bowl's top into the notch: handle shares at the top's extreme and at the notch
NOTCH_FALL = 0.36               # the slope the bowl's top arrives at (fall over run)


def barb_spurs(font, names="CGS", cap=712, k=1.0):
    done = []
    for name in names:
        for c in font[name].contours:
            P, n = c.points, len(c.points)
            for r in range(n):
                R, Q, h1, h2, A, below = P[r], P[(r + 1) % n], P[(r + 2) % n], P[(r + 3) % n], P[(r + 4) % n], P[r - 1]
                if not (R.type == "line" and Q.type == "line" and abs(Q.y - R.y) <= 1 and 0 < R.x - Q.x < 60
                        and 0.95 * cap < R.y < cap and abs(below.x - R.x) <= 1 and R.y - below.y > 100
                        and h1.type is None and h2.type is None and A.type and A.y > R.y):
                    continue
                R.y = cap
                Q.x, Q.y = R.x - round(k * SPUR_W), cap      # the spur's inner corner
                V = Point(R.x - round(k * NOTCH_IN), cap - round(k * NOTCH_DEEP), "line")
                run = V.x - A.x
                h2.x, h2.y = round(A.x + NOTCH_K[0] * run), A.y
                h1.x, h1.y = round(V.x - NOTCH_K[1] * run), round(V.y + NOTCH_K[1] * run * NOTCH_FALL)
                c.points.insert((r + 2) % n if (r + 2) % n else n, V)
                done.append(f"{name} notch ({V.x},{V.y})")
                break
    return done


# Lowercase s (0.56; owner: "yes, add to s"). The same notch and spur at the lowercase's scale (n's stem over H's,
# 0.9): the spur's top level at the x-height above and on the baseline below (the barbs' ends were 15 and 12 units
# short of them), as Georgia Pro's s.
S_LOW_SCALE = 0.9


def s_spurs(font, xh=520):
    g = font["s"]
    done = barb_spurs(font, "s", xh, S_LOW_SCALE)
    def turn():
        for c in g.contours:
            for p in c.points:
                p.x, p.y = -p.x, xh - p.y
    turn()
    try:
        done += barb_spurs(font, "s", xh, S_LOW_SCALE)
    finally:
        turn()
    return done


# Figures (0.57; owner took proposal 5). Surveyed against both references first (tools/joins/figw.py, figs.py): the
# thick strokes are 1.07 H stems on every figure (references 1.02 to 1.07) and the ends already follow the
# references, so the proposal's "round sweeps" did not hold up. Two parts were off their own rule:
# the 7's beak was 28 wide (every cut end is END_MIN), and the 5's round end 92 across (2 3 6 9: 88).
FIG_BALLS = ("two", "three", "five", "six", "nine")


def _balls(g):
    """Round ends drawn as half circles: (side node, tip node, side node), sides level with each other."""
    out = []
    for c in g.contours:
        P = c.points
        on = [p for p in P if p.type]
        m = len(on)
        for i in range(m):
            a, t, b = on[i], on[(i + 1) % m], on[(i + 2) % m]
            d = abs(a.x - b.x)
            if abs(a.y - b.y) <= 1 and 70 <= d <= 110 and abs(abs(t.y - a.y) - d / 2) <= 6 and abs(t.x - (a.x + b.x) / 2) <= 6:
                out.append((c, a, t, b))
    return out


def figure_ends(font):
    done = []
    g = font["seven"]                                        # the beak: the cut end hanging at the bar's left
    pts = [p for c in g.contours for p in c.points]
    x0 = min(p.x for p in pts)
    low = min(p.y for p in pts if p.x < x0 + 40)
    face = max(p.x for p in pts if p.x < x0 + 40 and p.y < low + 12)
    lack = END_MIN - (face - x0)
    if 0 < lack <= 8:
        for p in pts:
            if face - 8 <= p.x <= face and p.y < low + 90:
                p.x += lack
        done.append(f"7 beak +{lack}")
    found = [(name,) + b for name in FIG_BALLS for b in _balls(font[name])]
    sizes = sorted(abs(a.x - b.x) for _, _, a, _, b in found)
    want = sizes[len(sizes) // 2]
    for name, c, a, t, b in found:
        d = abs(a.x - b.x)
        if abs(d - want) < 2:
            continue
        xs = [p.x for cc in font[name].contours for p in cc.points]
        keep, move = (a, b) if a.x in (min(xs), max(xs)) else (b, a)      # the side on the figure's edge stays
        sx = 1 if move.x > keep.x else -1
        cx, r = keep.x + sx * want / 2, want / 2
        P, n = c.points, len(c.points)
        i = P.index(move)
        for q in (P[i - 1], P[(i + 1) % n]):                 # its two handles keep their offsets
            q.x += round(keep.x + sx * want - move.x)
        move.x = round(keep.x + sx * want)
        j = P.index(t)
        t.x = round(cx)
        up = 1 if t.y > a.y else -1
        t.y = round(a.y + up * r)
        k = 0.55 * r
        for q in (P[j - 1], P[(j + 1) % n]):
            q.x, q.y = round(cx + (k if q.x > cx else -k)), t.y
        for q, s in ((P[P.index(a) - 1], a), (P[(P.index(a) + 1) % n], a), (P[P.index(b) - 1], b), (P[(P.index(b) + 1) % n], b)):
            if q.type is None and abs(q.x - s.x) <= 1 and (q.y - s.y) * up > 0:
                q.x, q.y = s.x, round(s.y + up * k)          # the handle running up the side toward the tip
        done.append(f"{name} round end {d} to {want}")
    return done


# e, where the bar meets the bowl's right side (0.58; owner, with a picture: "make this part less suddenly wide and
# slightly less round"). Just above the bar the right stroke was 95 units, 1.22 stems: wider than the letter's own
# thick stroke on the left (1.05) and than both references there (1.05 and 1.08 of their stems). 0.34 had moved the
# eye's right side in to match a reference's eye width, on a heavier face. The eye's right side goes back out
# E_EYE_OUT, so the stroke is 1.09 stems; and the two rounded corners there are a little tighter: the outside corner
# under the stroke (28 x 48 to E_CORNER) and the eye's corner at the bar (handle shares to E_EYE_K).
E_EYE_OUT = 10
E_CORNER = (20, 34)             # the outside corner's reach along the bar and up the stroke
E_EYE_K = (0.88, 0.72)          # the eye's corner: along the bar, up the stroke (0.82 / 0.64 before)


def e_junction(font):
    g = font["e"]
    eye = min(g.contours, key=lambda c: max(p.x for p in c.points) - min(p.x for p in c.points))
    out = max(g.contours, key=lambda c: max(p.x for p in c.points) - min(p.x for p in c.points))
    P, n = eye.points, len(eye.points)
    done = []
    E = max((p for p in P if p.type), key=lambda p: p.x)     # the eye's right extreme
    i = P.index(E)
    lo, hi = sorted((P[i - 1], P[(i + 1) % n]), key=lambda p: p.y)
    C = P[(i + (2 if P[(i + 1) % n] is lo else -2)) % n]     # the fillet's other handle, then its node on the bar
    hc = C
    C = P[(P.index(hc) + (1 if P[(i + 1) % n] is lo else -1)) % n]
    if abs(lo.x - E.x) <= 1 and abs(hi.x - E.x) <= 1 and C.type and abs(hc.y - C.y) <= 1:
        for p in (E, lo, hi):
            p.x += E_EYE_OUT
        hc.x = round(C.x + E_EYE_K[0] * (E.x - C.x))
        lo.y = round(E.y - E_EYE_K[1] * (E.y - C.y))
        done.append(f"eye right {E.x}")
    P, n = out.points, len(out.points)
    for kind, i0, h1, h2, i3 in segs(out):                   # the outside corner: bar's underside up into the stroke
        if kind != "curve":
            continue
        B, hb, hr, R = P[i0], P[h1], P[h2], P[i3]
        if abs(hb.y - B.y) <= 1 and abs(hr.x - R.x) <= 1 and R.x > B.x and R.y > B.y and 15 <= R.x - B.x <= 45 \
                and 20 <= R.y - B.y <= 70 and 0.4 * 520 < B.y < 0.7 * 520:
            kb, kr = (hb.x - B.x) / (R.x - B.x), (R.y - hr.y) / (R.y - B.y)
            B.x, R.y = R.x - E_CORNER[0], B.y + E_CORNER[1]
            hb.x, hr.y = round(B.x + kb * (R.x - B.x)), round(R.y - kr * (R.y - B.y))
            done.append(f"outside corner {R.x - B.x}x{R.y - B.y}")
    return done


# Round ends, second pass (0.62; owner, with pictures of y, g and a: "doesn't look very smooth/round ... i would
# prefer if they were a bit more round/smooth like the c end, j tail"). c's, f's and j's ends are a half circle of
# radius 44 whose two sides leave upright in one curve each. y's end was a quarter 75 by 68 with a hump on top; g's
# ear a flat-topped end 40 by 61 on a waved underside; a's drop turned back on itself on its right side (out to 142,
# in to 135). All three are now circles, drawn as c's is: nodes at the side, tip and side, handles 0.55 of the
# radius, one curve away on each side.
END_RADIUS2 = {"a": 44, "g": 46, "y": 44}     # c f j: 44. g's ear a little larger, as it was
# 0.81 (owner round 3): y's ball on the round ends' 44 (was 48, "as it was"): its diameter over the stem was 1.23 in
# the Regular (0.96 Bold, 1.49 Light) where the round ends and j's are 1.10 to 1.13 (0.86 to 0.88, 1.35 to 1.36)
K2 = 0.55


def _pt(x, y, t=None, s=False):
    return Point(round(x), round(y), t, smooth=s)


def round_ends2(font):
    done = []
    # a: the drop at the upper left. Left side, bottom, right side; then one curve up into the arc's inside.
    c = max(font["a"].contours, key=lambda c_: len(c_.points))
    P, n = c.points, len(c.points)
    cand = [i for i, p in enumerate(P) if p.type and 380 < p.y < 440]
    i = min(cand, key=lambda k: P[k].x)
    L, B, R, N = P[i], P[(i + 3) % n], P[(i + 6) % n], P[(i + 9) % n]
    if all(q.type for q in (L, B, R, N)) and B.y < L.y and R.x > B.x and N.y > R.y:
        r = END_RADIUS2["a"]
        k = K2 * r
        by, lx = B.y, L.x
        L.y = by + r
        B.x, R.x, R.y = lx + r, lx + 2 * r, by + r
        for j, (x, y) in zip((1, 2, 4, 5), ((lx, by + r - k), (lx + r - k, by), (lx + r + k, by), (lx + 2 * r, by + r - k))):
            P[(i + j) % n].x, P[(i + j) % n].y = round(x), round(y)
        # The arc into the drop swells as c's does (0.63; owner: "the thick/thin looks uneven"): with the first
        # handles the stroke stayed 42-46 for half the arc and then thickened 6 to 8 units a step. These shares
        # were fitted to c's own profile, 44 to 88 (tools/joins/arc_profile.py): inside 0.50 along the top and
        # 0.55 up the side, outside 0.62 and 0.65.
        A = P[i - 3]
        P[(i + 7) % n].x, P[(i + 7) % n].y = R.x, round(R.y + 0.55 * (N.y - R.y))
        P[(i + 8) % n].x, P[(i + 8) % n].y = round(N.x - 0.50 * (N.x - R.x)), N.y
        P[i - 1].x, P[i - 1].y = lx, round(L.y + 0.65 * (A.y - L.y))
        P[i - 2].x, P[i - 2].y = round(A.x - 0.62 * (A.x - lx)), A.y
        R.smooth = True
        done.append(f"a drop r {r}")
    # g: the ear, between its two corners on the bowl. A circle at its end; the underside one curve from the root.
    c = max(font["g"].contours, key=lambda c_: len(c_.points))
    P = c.points
    corners = [i for i, p in enumerate(P) if p.type and not p.smooth and p.y > 420]
    if len(corners) == 2:
        a, b = corners
        root, join = P[a], P[b]
        mid = P[a + 1:b]
        top, right = max(p.y for p in mid), max(p.x for p in mid)
        r = END_RADIUS2["g"]
        k = K2 * r
        cx, cy = right - r, top - r
        keep = P[b - 1]                                      # the top edge's handle into the bowl stays
        new = [_pt(root.x + 25, root.y + 25), _pt(cx - 30, cy - r), _pt(cx, cy - r, "curve", True),
               _pt(cx + k, cy - r), _pt(right, cy - k), _pt(right, cy, "curve", True),
               _pt(right, cy + k), _pt(cx + k, top), _pt(cx, top, "curve", True),
               _pt(cx - 35, top), _pt(keep.x, keep.y)]
        c.points[a + 1:b] = new
        done.append(f"g ear r {r}")
    # y: the tail's end. Left side, top, a leaning inner side, then one curve up the thin stroke's left edge.
    c = font["y"].contours[0]
    P = c.points
    low = [i for i, p in enumerate(P) if p.type and p.y < -100]
    s = min(low, key=lambda k_: P[k_].x)
    S = P[s]
    st = next(k_ for k_ in range(s - 1, s - 9, -1) if P[k_].type == "line")   # the thin stroke's left edge ends here
    Sn, up = P[st], P[st - 1]
    d = math.hypot(Sn.x - up.x, Sn.y - up.y)
    ux, uy = (Sn.x - up.x) / d, (Sn.y - up.y) / d            # down the stroke
    if up.type and d > 40 and s - st in (5, 6, 7):
        r = END_RADIUS2["y"]
        k = K2 * r
        cx, cy = S.x + r, S.y
        I = (cx + 0.94 * r, cy - 0.13 * r)                   # the inner side, leaning as j's does
        new = [_pt(Sn.x + 70 * ux, Sn.y + 70 * uy), _pt(I[0] + 7, I[1] - 30), _pt(I[0], I[1], "curve", True),
               _pt(I[0] - 6, I[1] + 26), _pt(cx + 0.65 * r, cy + r), _pt(cx, cy + r, "curve", True),
               _pt(cx - k, cy + r), _pt(S.x, cy + k)]
        c.points[st + 1:s] = new
        done.append(f"y end r {r}")
    return done
