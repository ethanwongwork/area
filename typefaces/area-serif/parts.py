"""One construction per repeated part (0.65). Owner, with ten pictures of joins: "these parts do not look consistent
... the bezier curve patterns should be replicated and slightly modified, not custom drawn for each letter. all
points should be mathematically, optically, and technically calculated".

Measured on 0.64 (tools/joins/crotches.py for the references, `report` here for Area), at the point where a curved
stroke meets a stem (the crotch) and across the stroke there (the neck):

  crotch      n h m p b d a were cut flat, 5 to 10 units wide; r u q came to a point. Both references: a point.
  neck        r 22, p 28, n h m 29, b 34, u 44, d 62 at its top, a 19 at its bottom (units). Georgia Pro holds one
              value on every branch, 0.28 to 0.33 of its stem, and Serrif 0.24 to 0.27: about 0.72 of the hairline.
  bowls       b d p q were four drawings: the top's extreme 146 to 162 from the stem, the side's extreme at 254 to
              268, the counter's top at 485 to 487.
  stem tops   n m r: the stem's right edge leaned in to the head serif's corner (15, 15 and 4 units), p's stepped out 6.
              Both references: the edge runs straight up.

The system (all in units; a stem is 78):

  BOWL        one bowl for b d p q, measured from the stem's bowl-side edge: outer extremes 161 out at top and
              bottom and 414 out at mid-height (260); counter 153 and 332; counter top and bottom 43 inside the
              outer (the hairline). The counter runs straight along the stem from 220 to 300. Far quarters carry
              clean.py's tensions (0.57 outside, 0.61 inside). d and q are the mirror image.
  BRANCH      the stroke leaves a stem as an arch does (b p at the top; d q at the bottom, turned half round;
              n h m r; u turned half round; a's bowl at the bottom). The crotch is a point on the stem's edge. Its
              height is solved so the neck is NECK_BRANCH. On b d p q the outer curve has one set of handle shares.
  RUN-IN      the bowl's thin stroke runs into the stem's end (d at the top; p at the bottom, turned half round).
              A point on the stem's edge, solved for NECK_RUN: 1.25 hairlines, as Georgia Pro's (0.49-0.54 stems).
  SPUR        b's foot and q's head, one turned half round from the other.
  STEM EDGE   a stem's edge is straight through every join: up to the head serif's corner on n m p r, down to the
              baseline on d.

q is b turned half round and p is d turned half round, in the x-height zone; b and p share the branch, d and q too.
Runs in balance.run after same_arches (h and m already carry n's arch) and before the head serifs are set.
"""
import math

from ufoLib2.objects import Point

S = 78
X = 520
DXO_T, DXO_S, DXC_T, DXC_S = 161, 414, 153, 332
Y_TOP, Y_BOT, Y_MID = 530, -10, 260
YC_TOP, YC_BOT = 487, 33
YS_HI, YS_LO = 300, 220
T_OUT, T_IN = 0.57, 0.61              # clean.TENSION_OUT, TENSION_IN
C_NEAR = (0.60, 0.62)                 # the counter's quarter beside the stem: up the stem, along the top
NECK_BRANCH = 32                      # 0.41 stems, 0.74 of the 43-unit hairline (Georgia Pro 0.73, Serrif 0.68,
                                      # Computer Modern's thin_join 0.78 of its hairline)
NECK_RUN = 54                         # 0.69 stems, 1.25 hairlines
BRANCH = (0.40, 0.33, 0.65)           # outer curve into a branch: share at the extreme; the crotch handle's x as a
RUN_IN = (0.37, 0.28, 0.62)           # share of 161 and its y as a share of the way up from the crotch
ARCH = 50                             # an arch's stroke at its top: n's 530 - 480
LEAVE = (53, 64)                      # the outer curve's handle at a branch's crotch (the same vector as BRANCH's on
                                      # the bowls: 0.33 x 161 and 0.65 x 98): it leaves the stem at 40 degrees
SPUR_TIP, SPUR_BASE = (-23, 66), (-65, 0)     # from the stem's bowl-side edge; negative is into the stem
SPUR_H = (0.45, (19, 20))
BOWL_EXTREME_ONE = True               # 0.83 (letters 5): the branch's and run-in's handle at the extreme solved (below)


def bez(p, n=160):
    return [tuple(sum(c * q[k] for c, q in zip(((1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3), p))
                  for k in (0, 1)) for t in [i / n for i in range(n + 1)]]


def neck(K, curve):
    return min(math.hypot(x - K[0], y - K[1]) for x, y in bez(curve))


def solve(curve, target, x, lo, hi):
    """The height on the line x = const, between lo and hi, where the neck to `curve` is nearest `target`."""
    return min(range(int(lo), int(hi) + 1), key=lambda y: abs(neck((x, y), curve) - target))


def _near_quarter_top():
    """The counter's quarter beside the stem, top: from the stem's edge up and over to the counter's top."""
    return [(0, YS_HI), (0, YS_HI + C_NEAR[0] * (YC_TOP - YS_HI)), (DXC_T * (1 - C_NEAR[1]), YC_TOP), (DXC_T, YC_TOP)]


Y_BRANCH = solve(_near_quarter_top(), NECK_BRANCH, 0, YS_HI + 20, X)      # the crotch of a branch on b d p q
Y_RUN = solve(_near_quarter_top(), NECK_RUN, 0, YS_HI + 20, X)            # and of a run-in


def _pt(x, y, t=None, s=False):
    return Point(round(x), round(y), t, smooth=s)


def _counter(xe, s):
    """The whole counter, clockwise, for a bowl on the s side of the stem edge xe."""
    def P(u, v):
        return (xe + s * u, v)
    hx = DXC_T * (1 - C_NEAR[1])
    lo_h = YS_LO - C_NEAR[0] * (YS_LO - YC_BOT)
    hi_h = YS_HI + C_NEAR[0] * (YC_TOP - YS_HI)
    far_x = DXC_T + T_IN * (DXC_S - DXC_T)
    far_dy = T_IN * (YC_TOP - Y_MID)
    Bc, Slo, Shi, Tc, Rc = P(DXC_T, YC_BOT), P(0, YS_LO), P(0, YS_HI), P(DXC_T, YC_TOP), P(DXC_S, Y_MID)
    A = (P(hx, YC_BOT), P(0, lo_h))                   # Bc -> Slo
    B = (P(0, hi_h), P(hx, YC_TOP))                   # Shi -> Tc
    C = (P(far_x, YC_TOP), P(DXC_S, Y_MID + far_dy))  # Tc -> Rc
    D = (P(DXC_S, Y_MID - far_dy), P(far_x, YC_BOT))  # Rc -> Bc
    if s > 0:
        nodes, segs = [Bc, Slo, Shi, Tc, Rc], [A, None, B, C, D]
    else:
        nodes, segs = [Bc, Rc, Tc, Shi, Slo], [D[::-1], C[::-1], B[::-1], None, A[::-1]]
    out = []
    n = len(nodes)
    for i in range(n):                                # each node carries the type of the segment that ends at it
        prev = segs[i - 1]
        if prev is not None:
            out += [_pt(*prev[0]), _pt(*prev[1])]
        out.append(_pt(*nodes[i], "line" if prev is None else "curve", True))
    return out[2:] + out[:2] if segs[-1] is not None else out      # start on a node


def _find(P, pred):
    return [i for i, p in enumerate(P) if pred(i, p)]


def _level_extreme(P, y):
    n = len(P)
    return _find(P, lambda i, p: p.type and abs(p.y - y) <= 1 and P[i - 1].type is None and P[(i + 1) % n].type is None
                 and abs(P[i - 1].y - p.y) <= 1 and abs(P[(i + 1) % n].y - p.y) <= 1)


def _drop_flat(c, K, xe):
    """A crotch cut flat becomes a point: the flat's other node goes, and the edge beyond it joins the stem's edge.
    Call it before K moves (the flat is found level with K)."""
    P, n = c.points, len(c.points)
    i = P.index(K)
    for d in (1, -1):
        F = P[(i + d) % n]
        if not (F.type and abs(F.y - K.y) <= 1 and 1 <= abs(F.x - K.x) <= 16):
            continue
        beyond = P[(i + 2 * d) % n]
        if beyond.type and abs(beyond.x - xe) <= 16:
            beyond.x = xe
        if d == -1:
            K.type = F.type                           # K now ends the segment that ended at F
        c.points.remove(F)
        return True
    return False


def bowl(font, name, s, top, bottom):
    g = font[name]
    out, inn = (g.contours[0], g.contours[1]) if len(g.contours[0].points) > len(g.contours[1].points) else (g.contours[1], g.contours[0])
    xs = [p.x for p in inn.points]
    xe = min(xs) if s > 0 else max(xs)                # the stem's bowl-side edge
    inn.points[:] = _counter(xe, s)
    P, n = out.points, len(out.points)
    To = _level_extreme(P, Y_TOP)[0]
    Bo = _level_extreme(P, Y_BOT)[0]
    step = 1 if (P[(To + 3) % n].type and abs(P[(To + 3) % n].y - Y_MID) < 25 and P[(To + 6) % n] is P[Bo]) else -1
    Ro = (To + 3 * step) % n
    assert P[(Ro + 3 * step) % n] is P[Bo], f"{name}: the bowl's far side is not two quarters"
    T, R, B = P[To], P[Ro], P[Bo]
    T.x, T.y, R.x, R.y, B.x, B.y = xe + s * DXO_T, Y_TOP, xe + s * DXO_S, Y_MID, xe + s * DXO_T, Y_BOT
    far = T_OUT * (DXO_S - DXO_T)
    dy = T_OUT * (Y_TOP - Y_MID)
    for k, (x, y) in zip((1, 2, 4, 5), ((T.x + s * far, Y_TOP), (R.x, Y_MID + dy), (R.x, Y_MID - dy), (B.x + s * far, Y_BOT))):
        q = P[(To + k * step) % n]
        q.x, q.y = round(x), round(y)
    done = []
    for end, kind, E, back in ((1, top, T, -step), (-1, bottom, B, step)):      # end +1: the top; -1: the bottom
        def Y(v):                                     # the bottom is the top's pattern turned over the mid-height
            return v if end > 0 else X - v
        i = P.index(E)
        h1, h2, K = P[(i + back) % n], P[(i + 2 * back) % n], P[(i + 3 * back) % n]
        if kind == "spur":                            # drawn for the foot (b); q's is the same turned half round
            def Ys(v):
                return v if end < 0 else X - v
            K.x, K.y = xe + s * SPUR_TIP[0], Ys(SPUR_TIP[1])
            h1.x, h1.y = round(xe + s * DXO_T * (1 - SPUR_H[0])), E.y
            h2.x, h2.y = xe + s * SPUR_H[1][0], Ys(SPUR_H[1][1])
            base, corner = P[(i + 4 * back) % n], P[(i + 5 * back) % n]
            base.x, base.y = xe + s * SPUR_BASE[0], Ys(SPUR_BASE[1])
            corner.y = Ys(SPUR_BASE[1])
            done.append("spur")
            continue
        shares, yk = (BRANCH, Y_BRANCH) if kind == "branch" else (RUN_IN, Y_RUN)
        _drop_flat(out, K, xe)
        P, n = out.points, len(out.points)
        K.x, K.y = xe, Y(yk)
        h1.x, h1.y = round(xe + s * DXO_T * (1 - shares[0])), E.y
        h2.x, h2.y = round(xe + s * shares[1] * DXO_T), round(Y(yk + shares[2] * (Y_TOP - yk)))
        if BOWL_EXTREME_ONE:
            # 0.83 (letters 5): the extreme meets its two curves at one curvature. The far quarter's curvature at the
            # extreme is (2/3) far * rise / far^3; the branch's (or run-in's) curve has its far handle `rise_b` off the
            # extreme's level, so its handle at the extreme is sqrt((2/3) rise_b / k): the 0.40 share left the branch
            # side 1.48 times flatter (radius 268 against 181)
            k_far = (2 / 3) * (Y_TOP - Y_MID - dy) / far ** 2
            L = math.sqrt((2 / 3) * abs(h2.y - E.y) / k_far)
            h1.x = round(E.x - s * L)
        K.smooth = False
        # the stem's edge beyond the crotch: straight, on xe
        i = P.index(K)
        for j in ((i + 1) % n, (i - 1) % n):
            q = P[j]
            if q.type and q is not E and 0 < abs(q.x - xe) <= 16 and abs(q.y - K.y) > 30:
                q.x = xe
        done.append(f"{kind} at {K.y}")
    return f"{name}: " + ", ".join(done)


def bowls(font):
    return [bowl(font, "b", 1, "branch", "spur"), bowl(font, "p", 1, "branch", "run-in"),
            bowl(font, "d", -1, "run-in", "branch"), bowl(font, "q", -1, "spur", "branch")]


# ---------------------------------------------------------------------------------------------- arches and a
def _join(c, K, xe, curve, target, lo, hi, end):
    """A crotch K (the outer curve's end) goes to the stem's edge xe as a point, at the height where the neck to the
    inner `curve` is `target`. The outer curve then leaves it as every branch does: LEAVE from the crotch, and a handle
    at the extreme BRANCH[0] of the way back. end +1: a top join; -1: a bottom one."""
    P, n = c.points, len(c.points)
    i = P.index(K)
    back = -1 if P[i - 1].type is None else 1         # toward the outer curve
    _drop_flat(c, K, xe)
    P, n = c.points, len(c.points)
    i = P.index(K)
    h, h1, E = P[(i + back) % n], P[(i + 2 * back) % n], P[(i + 3 * back) % n]
    y = solve(curve, target, xe, lo, hi)
    K.x, K.y = xe, y
    sx = 1 if E.x > K.x else -1
    h.x, h.y = K.x + sx * LEAVE[0], K.y + end * LEAVE[1]
    h1.x, h1.y = round(E.x - sx * BRANCH[0] * abs(E.x - K.x)), E.y
    K.smooth = False
    return y


def u_from_n(font, Kn, Ku):
    """u's bowl is n's arch turned half round, its counter u's own width (normalize holds it at 0.97 of n's).
    Kn, Ku: the two crotches. The arch is the inner curve (7 points from the stem) and the outer (7 ending at the crotch)."""
    def arch(c, K, up):
        P, n = c.points, len(c.points)
        a = next(i for i, p in enumerate(P) if p.type == "line" and 150 < p.y < 400 and P[(i + 1) % n].type is None
                 and P[(i + 1) % n].x == p.x and (P[(i + 1) % n].y > p.y) == up)
        k = P.index(K)
        return [P[(a + j) % n] for j in range(7)] + [P[(k - 6 + j) % n] for j in range(7)]
    N, U = arch(font["n"].contours[0], Kn, True), arch(font["u"].contours[0], Ku, False)
    assert all((a.type is None) == (b.type is None) for a, b in zip(N, U)), "u and n are not drawn alike: %s / %s" % (
        [(q.x, q.y, (q.type or "-")[0]) for q in N], [(q.x, q.y, (q.type or "-")[0]) for q in U])
    n0, n1, u0, u1 = N[0].x, N[6].x, U[0].x, U[6].x   # n: the counter from its left edge to its right; u: right to left
    k = (u0 - u1) / (n1 - n0)
    for a, b in zip(N, U):
        b.x = round(u0 - (a.x - n0) * k) if a.x <= n1 else u1 - (a.x - n1)
        b.y = X - a.y
    return f"u: n's arch turned half round, counter {u0 - u1} ({k:.3f} of n's)"


def _cubic(P, i, step=1):
    n = len(P)
    return [(P[(i + k * step) % n].x, P[(i + k * step) % n].y) for k in range(4)]


def arches(font):
    done = []
    for name in "nhmr":
        c = font[name].contours[0]
        P, n = c.points, len(c.points)
        # each arch: the inner curve leaves the stem at a line node with an upright handle above it
        starts = _find(P, lambda i, p: p.type == "line" and 300 < p.y < 350 and P[(i + 1) % n].type is None
                       and P[(i + 1) % n].x == p.x and P[(i + 1) % n].y > p.y)
        for a in starts:
            A = P[a]
            xe = A.x
            curve = _cubic(P, a)
            # the crotch above it: the outer curve's end, within 16 of the stem's edge
            Ks = [p for p in c.points if p.type == "curve" and abs(p.x - xe) <= 16 and A.y + 60 < p.y < X - 40
                  and (c.points[c.points.index(p) - 1].type is None)]
            if not Ks:
                done.append(f"{name}: no crotch over {xe}")
                continue
            K = Ks[0]
            y = _join(c, K, xe, curve, NECK_BRANCH, A.y + 40, X - 20, 1)
            if name == "n":
                Kn = K
            P, n = c.points, len(c.points)
            # the stem's edge runs straight up from the crotch to the head serif's corner (n m r)
            i = P.index(K)
            for j in ((i + 1) % n, (i - 1) % n):
                q = P[j]
                if q.type == "line" or (q.type and P[i].type == "line"):
                    if q.y > K.y + 60 and abs(q.x - xe) <= 16:
                        q.x = xe
            done.append(f"{name} {xe}: crotch {y}")
    # u: n's arch turned half round, then the same join on the right stem
    c = font["u"].contours[0]
    P, n = c.points, len(c.points)
    a = next(i for i, p in enumerate(P) if p.type == "line" and 150 < p.y < 400 and P[(i + 1) % n].type is None
             and P[(i + 1) % n].x == p.x and P[(i + 1) % n].y < p.y)
    xe = P[a].x
    K = next(p for p in P if p.type == "curve" and abs(p.x - xe) <= 4 and 40 < p.y < 180 and P[P.index(p) - 1].type is None)
    done.append(u_from_n(font, Kn, K))
    y = _join(c, K, xe, _cubic(P, a), NECK_BRANCH, 20, P[a].y - 40, -1)
    done.append(f"u {xe}: crotch {y}")
    return done


def a_join(font):
    """a: the bowl's lower stroke is a branch too, where it rises into the stem. Its thickness at the counter's lowest
    point is the arch's at its top (ARCH: n's 530 - 480), and its neck at the stem is every branch's.
    After balance.a_option, which sets the stem's left edge."""
    g = font["a"]
    out = max(g.contours, key=lambda c_: len(c_.points))
    inn = min(g.contours, key=lambda c_: len(c_.points))
    Q, m = inn.points, len(inn.points)
    r = max(p.x for p in Q)                           # the stem's left edge is the counter's right
    a = next(i for i, p in enumerate(Q) if p.type and p.x == r and Q[(i + 1) % m].type is None and Q[(i + 1) % m].y < p.y)
    b = min((i for i, p in enumerate(Q) if p.type), key=lambda i: Q[i].y)      # the counter's lowest point
    low = [Q[b - 1], Q[b], Q[(b + 1) % m]]
    P = out.points
    K = next(p for p in P if p.type == "curve" and r - 16 <= p.x <= r + 3 and 40 < p.y < 150
             and P[P.index(p) - 1].type is None)
    for _ in range(3):
        y = _join(out, K, r, _cubic(Q, a), NECK_BRANCH, 30, Q[a].y - 40, -1)
        P = out.points
        i = P.index(K)
        curve = bez([(P[i - k].x, P[i - k].y) for k in range(4)])
        under = min(curve, key=lambda q: abs(q[0] - low[1].x))[1]              # the outer edge under that point
        d = round(under + ARCH) - low[1].y
        if d == 0:
            break
        for q in low:
            q.y += d
    i = P.index(K)
    for q in (P[i - 1], P[(i + 1) % len(P)]):         # below the crotch the stem's edge leaves straight down
        if q.type is None and 0 < abs(q.x - r) <= 3 and q.y < K.y - 40:
            q.x = r
    return [f"a {r}: crotch {y}, counter's lowest point {low[1].y} ({ARCH} over the outer edge)"]


# ---------------------------------------------------------------------------------------------- vertices
# Where two diagonal strokes meet (0.66; owner, with w and M: "why are the points on M and W sharp"). Measured on
# 0.65 (tools/joins/apexes.py): the outside of a vertex was cut flat 33 units on v, 23 on V N and W's top, 19 and 20
# under W, 31 on A, 9 and 5 under w, and came to a point on w's middle and under M (0.65's uncross had joined two
# crossed nodes there). The inside corner was a flat of 16 to 26 on v w M N, 9 on y, 6 in A, and a point on V W x X K.
# Both references and Area's own base: a flat outside (Georgia Pro 0.43 to 0.51 of its stem, Serrif 0.56 to 0.73,
# the base 0.40 to 0.60), a point inside.
#   outside   one flat, VERTEX of the class's stem: 33 on the lowercase (v's own), 36 on capitals; it stays centred
#             where the vertex was, on its line
#   inside    a point: the two inner edges meet (as every crotch does since 0.65)
#   strokes   keep their thickness exactly; each turns by the degree or so this takes. A stroke between two
#             vertices is solved for the slope at which its two edges pass both flats; an outer stroke keeps its
#             serif end where it is; M's and N's diagonals keep their top corners on the stems.
VERTEX = 0.42
VERTICES = {"v": (260, 78, "outer"), "w": (260, 78, "outer"), "y": (300, None, None),
            "V": (356, 86, "outer"), "W": (356, 86, "outer"), "A": (356, 86, "outer"),
            "M": (356, 86, "other"), "N": (356, 86, "other")}


def _strokes(g, y_at, min_len=60):
    """Straight sloping strokes, left to right at y_at: {m, l, r, t}; l and r are lists of segments (a, b, m, c)
    on the stroke's left and right edge (x = m y + c), a and b the segment's two nodes."""
    segs = []
    for c in g.contours:
        P, n = c.points, len(c.points)
        for i in range(n):
            a, b = P[i], P[(i + 1) % n]
            if b.type != "line" or a.type is None:
                continue
            dx, dy = b.x - a.x, b.y - a.y
            if math.hypot(dx, dy) < min_len or abs(dy) < 1 or not 0.2 < abs(dx / dy) < 5:
                continue
            m = dx / dy
            segs.append((a, b, m, a.x - m * a.y))
    out = []
    for sign in (1, -1):
        grp = sorted((s for s in segs if (s[2] > 0) == (sign > 0)), key=lambda s: s[2] * y_at + s[3])
        edges = []
        for s in grp:
            x = s[2] * y_at + s[3]
            if edges and abs(edges[-1][0][2] - s[2]) < 0.08 and abs(edges[-1][0][2] * y_at + edges[-1][0][3] - x) < 10:
                edges[-1].append(s)
            else:
                edges.append([s])
        if len(edges) % 2:
            return None
        for l, r in zip(edges[::2], edges[1::2]):
            m = sum(s[2] for s in l + r) / len(l + r)
            xl = sum(s[2] * y_at + s[3] for s in l) / len(l)
            xr = sum(s[2] * y_at + s[3] for s in r) / len(r)
            out.append({"m": m, "l": l, "r": r, "t": (xr - xl) / math.sqrt(1 + m * m), "x": (xl + xr) / 2})
    return sorted(out, key=lambda s: s["x"])


def _nodes(edge):
    seen = []
    for a, b, _, _ in edge:
        for q in (a, b):
            if not any(q is s for s in seen):
                seen.append(q)
    return seen


def _contour_of(g, p):
    return next(c for c in g.contours if any(q is p for q in c.points))


def _idx(P, p):
    return next(i for i, q in enumerate(P) if q is p)


def _meet(S, k, bottom):
    """The outer nodes (left, right) and the inner nodes of the vertex between strokes k and k + 1."""
    pick = (lambda ns: min(ns, key=lambda q: q.y)) if bottom else (lambda ns: max(ns, key=lambda q: q.y))
    return pick(_nodes(S[k]["l"])), pick(_nodes(S[k + 1]["r"])), pick(_nodes(S[k]["r"])), pick(_nodes(S[k + 1]["l"]))


def _solve_stroke(t, cons, m0):
    """The stroke's two edges (m, c_left, c_right) from two points its edges pass: [(side, x, y)] * 2."""
    (s1, x1, y1), (s2, x2, y2) = cons
    if s1 == s2:
        m = (x2 - x1) / (y2 - y1)
        h = t * math.sqrt(1 + m * m)
        cl = x1 - m * y1 - (h if s1 == "r" else 0)
        return m, cl, cl + h
    if s1 == "r":
        (s1, x1, y1), (s2, x2, y2) = (s2, x2, y2), (s1, x1, y1)
    m = m0
    for _ in range(40):                               # m (y2 - y1) + t sqrt(1 + m^2) = x2 - x1
        f = m * (y2 - y1) + t * math.sqrt(1 + m * m) - (x2 - x1)
        m -= f / ((y2 - y1) + t * m / math.sqrt(1 + m * m))
    cl = x1 - m * y1
    return m, cl, cl + t * math.sqrt(1 + m * m)


def _flat_to_point(g):
    """A counter's corner cut flat between two sloping edges becomes the point where they meet (y)."""
    n_done = 0
    for c in g.contours:
        P, n = c.points, len(c.points)
        for i in range(n):
            a, p, q, b = P[i - 1], P[i], P[(i + 1) % n], P[(i + 2) % n]
            if not (a.type and p.type == "line" and q.type == "line" and b.type == "line"):
                continue
            if abs(p.y - q.y) > 1 or not 1 <= abs(p.x - q.x) <= 30:
                continue
            if min(abs(a.y - p.y), abs(b.y - q.y)) < 60 or (a.y - p.y) * (b.y - q.y) <= 0:
                continue
            m1, m2 = (p.x - a.x) / (p.y - a.y), (b.x - q.x) / (b.y - q.y)
            if m1 * m2 >= 0 or min(abs(m1), abs(m2)) < 0.2:
                continue
            c1, c2 = p.x - m1 * p.y, q.x - m2 * q.y
            y = (c2 - c1) / (m1 - m2)
            if abs(y - p.y) > 60 or (y - p.y) * (a.y - p.y) > 0:      # the point lies beyond the flat, away from the strokes
                continue
            p.x, p.y, p.smooth = round(m1 * y + c1), round(y), False
            P.remove(q)
            return 1 + _flat_to_point(g)
    return n_done


def vertices(font):
    done = []
    for name, (y_at, stem, mode) in VERTICES.items():
        g = font[name]
        if stem is None:
            done.append(f"{name}: {_flat_to_point(g)} inside flat > point")
            continue
        S = _strokes(g, y_at)
        if not S:
            done.append(f"{name}: strokes not found")
            continue
        F = round(VERTEX * stem)
        adj = {}                                      # each node's two neighbours, before anything moves
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i, q in enumerate(P):
                adj[id(q)] = (P[i - 1], P[(i + 1) % n])
        cons = {k: [] for k in range(len(S))}
        meets, note, drop = [], [], []
        for k in range(len(S) - 1):
            if S[k]["m"] * S[k + 1]["m"] >= 0:
                continue
            bottom = S[k]["m"] < 0
            nL, nR, iL, iR = _meet(S, k, bottom)
            if abs(nL.y - nR.y) > 2 or abs(nR.x - nL.x) > 80:
                continue
            meets.append((k, iL, iR))
            c, y0 = (nL.x + nR.x) / 2, nL.y
            was = abs(nR.x - nL.x)
            if nL is nR:                              # a point: it becomes the flat's two nodes
                P = _contour_of(g, nL).points
                i = _idx(P, nL)
                prev_left = any(seg[0] is P[i - 1] or seg[1] is P[i - 1] for seg in S[k]["l"])
                extra = Point(nL.x, nL.y, "line")
                P.insert(i + 1, extra)
                nL.smooth = False
                if prev_left:
                    nR = extra
                else:
                    nL, nR = extra, nL
            cons[k].append(("l", c - F / 2, y0, nL))
            cons[k + 1].append(("r", c + F / 2, y0, nR))
            note.append(f"{was:.0f}>{F}")
        if name == "N" and len(S) == 1:               # the diagonal's foot against the right stem: the flat ends on the stem
            nL = min(_nodes(S[0]["l"]), key=lambda q: q.y)
            q = next(q for q in adj[id(nL)] if q.type and abs(q.y - nL.y) <= 1 and q.x > nL.x)
            cons[0].append(("l", q.x - F, nL.y, nL))
            note.append(f"{q.x - nL.x:.0f}>{F}")
        fixed = []
        for k, s in enumerate(S):                     # the second point of a stroke that meets one vertex only
            if len(cons[k]) != 1:
                continue
            side, x, y, node = cons[k][0]
            if mode == "other":
                side = "r" if side == "l" else "l"
            far = max(_nodes(s[side]), key=lambda q: abs(q.y - y))
            cons[k].append((side, far.x, far.y, far))
            fixed.append(far)
        new = {}                                      # segment id -> (m, c)
        for k, s in enumerate(S):
            if len(cons[k]) != 2:
                continue
            m, cl, cr = _solve_stroke(s["t"], [c[:3] for c in cons[k]], s["m"])
            for seg in s["l"]:
                new[id(seg)] = (m, cl)
            for seg in s["r"]:
                new[id(seg)] = (m, cr)
            s["new"] = (m, cl, cr)
        handled = []
        for k, sides in cons.items():                 # 1. the outside: a flat F wide on its line
            if len(sides) == 2:
                for side, x, y, node in sides:
                    node.x, node.y = x, y
                    handled.append(node)
        for k, iL, iR in meets:                       # 2. the inside: a point where the two inner edges meet
            if "new" not in S[k] or "new" not in S[k + 1]:
                continue
            (ma, _, ca), (mb, cb, _) = S[k]["new"], S[k + 1]["new"]
            y = (cb - ca) / (ma - mb)
            if iL is not iR:
                if math.hypot(iL.x - iR.x, iL.y - iR.y) > 40:
                    continue
                drop.append(iR)
                handled.append(iR)
                note.append("inside flat > point")
            iL.x, iL.y, iL.smooth = ma * y + ca, y, False
            handled.append(iL)
        for s in S:                                   # 3. every other node on a moved edge follows it
            for side in ("l", "r"):
                for seg in s[side]:
                    if id(seg) not in new:
                        continue
                    m, c = new[id(seg)]
                    for p in seg[:2]:
                        if any(p is h for h in handled):
                            continue
                        handled.append(p)
                        mate = seg[1] if p is seg[0] else seg[0]
                        before, after = adj[id(p)]
                        q, q_after = (before, False) if after is mate else (after, True)
                        straight = bool(q.type) and (q.type == "line" if q_after else p.type == "line")
                        if straight and abs(q.y - p.y) <= 1 and abs(q.x - p.x) <= 30:
                            r = adj[id(q)][1] if q_after else adj[id(q)][0]
                            if r.type and abs(r.x - q.x) <= 1 and abs(r.y - q.y) > 40:
                                q.y = (q.x - c) / m   # a notch cut flat against a stem: a point on the stem's edge
                                q.smooth = False
                                drop.append(p)
                                handled.append(q)
                                note.append("notch > point")
                                continue
                        ux, uy = (q.x - p.x, q.y - p.y) if straight else (0, 0)
                        den = ux - m * uy
                        if straight and math.hypot(ux, uy) > 8 and abs(den) > 1e-6:
                            k_ = (m * p.y + c - p.x) / den
                            p.x, p.y = p.x + k_ * ux, p.y + k_ * uy
                        else:
                            dx = m * p.y + c - p.x
                            for q2 in [p] + [e for e in (before, after) if e.type is None]:
                                q2.x += dx
        for p in drop:
            P = _contour_of(g, p).points
            i = _idx(P, p)
            nxt = P[(i + 1) % len(P)]
            if p.type == "curve" and nxt.type == "line":          # the curve that ended on p now ends on its neighbour
                nxt.type = "curve"
            del P[i]
        for c in g.contours:
            for p in c.points:
                p.x, p.y = round(p.x), round(p.y)
        done.append(f"{name}: " + ", ".join(note))
    return done


def run(font):
    return [("bowls", bowls(font)), ("joins", arches(font))]


def joins_of(g):
    """Every crotch in a glyph: a corner with a curve on one side and the stem's upright edge on the other.
    [(x, y, neck, leave vector, flat)]: the neck is the nearest other curve; flat, a level neighbour within 16."""
    segs, rows = [], []
    for c in g.contours:
        P, n = c.points, len(c.points)
        for i, p in enumerate(P):
            if p.type == "curve":
                segs.append([P[(i - k) % n] for k in (3, 2, 1, 0)])
    for c in g.contours:
        P, n = c.points, len(c.points)
        for i, p in enumerate(P):
            a, b = P[i - 1], P[(i + 1) % n]
            if not p.type or p.smooth:
                continue
            for h, e in ((a, b), (b, a)):
                if h.type is not None or abs(h.x - p.x) <= 8:
                    continue                          # h: the curve's handle, leaving at an angle
                flat = bool(e.type) and abs(e.y - p.y) <= 1 and 1 <= abs(e.x - p.x) <= 16
                upright = e.x == p.x and abs(e.y - p.y) >= 25 and (e.y - p.y) * (h.y - p.y) > 0
                vee = e.type is None and (e.y - p.y) * (h.y - p.y) > 0 and (e.x - p.x) * (h.x - p.x) < 0 \
                    and abs(h.x - p.x) > abs(e.x - p.x)   # m's middle: the first arch's shoulder ends on the crotch
                if flat or upright or vee:
                    d = min(neck((p.x, p.y), [(q.x, q.y) for q in s]) for s in segs if p not in s)
                    rows.append((p.x, p.y, round(d, 1), (abs(h.x - p.x), abs(h.y - p.y)), flat))
    return rows


EXPECT = {"b": [NECK_BRANCH], "p": [NECK_RUN, NECK_BRANCH], "d": [NECK_BRANCH, NECK_RUN], "q": [NECK_BRANCH],
          "n": [NECK_BRANCH], "h": [NECK_BRANCH], "m": [NECK_BRANCH] * 2, "r": [NECK_BRANCH], "u": [NECK_BRANCH],
          "a": [NECK_BRANCH, None]}                    # a's second: the bowl's upper stroke at the stem (58, its own)


def check(font):
    """What must hold on a built font. Returns (table rows, failures)."""
    rows, bad = [], []
    for name, want in EXPECT.items():
        got = sorted(joins_of(font[name]), key=lambda r: r[1])
        rows += [(name,) + r for r in got]
        if len(got) != len(want):
            bad.append(f"{name}: {len(got)} joins found, {len(want)} expected")
            continue
        for (x, y, d, leave, flat), w in zip(got, sorted(want, reverse=name == "p") if name in "pd" else want):
            if w is None:
                continue
            if flat:
                bad.append(f"{name} ({x},{y}): the crotch is cut flat")
            if abs(d - w) > 1.2:
                bad.append(f"{name} ({x},{y}): neck {d}, not {w}")
            if w == NECK_BRANCH and leave != LEAVE:
                bad.append(f"{name} ({x},{y}): leaves the stem by {leave}, not {LEAVE}")
    # one bowl: b d p q, every point from the stem's bowl-side edge; q is b and p is d turned half round
    shape = {}
    for name, s in (("b", 1), ("p", 1), ("d", -1), ("q", -1)):
        g = font[name]
        out, inn = sorted(g.contours, key=lambda c: -len(c.points))[:2]
        xe = min(p.x for p in inn.points) if s > 0 else max(p.x for p in inn.points)
        zone = lambda c: sorted((s * (p.x - xe), p.y) for p in c.points if s * (p.x - xe) >= 0 and -10 <= p.y <= 530)
        shape[name] = (zone(inn), zone(out))
    turn = lambda pts: sorted((x, X - y) for x, y in pts)
    for a, b, how in (("b", "p", "counter"), ("b", "d", "counter"), ("b", "q", "counter")):
        if shape[a][0] != shape[b][0]:
            bad.append(f"{a} and {b}: the counters differ")
    for a, b in (("b", "q"), ("d", "p")):
        ya, yb = shape[a][1], turn(shape[b][1])
        if [p for p in ya if 0 < p[1] < X] != [p for p in yb if 0 < p[1] < X]:
            bad.append(f"{b} is not {a} turned half round")
    # vertices: one flat outside, a point inside
    for name, (y_at, stem, mode) in VERTICES.items():
        if stem is None:
            continue
        S = _strokes(font[name], y_at)
        if not S:
            bad.append(f"{name}: strokes not found")
            continue
        F = round(VERTEX * stem)
        for k in range(len(S) - 1):
            if S[k]["m"] * S[k + 1]["m"] >= 0:
                continue
            nL, nR, iL, iR = _meet(S, k, S[k]["m"] < 0)
            if abs(nL.y - nR.y) > 2 or abs(nR.x - nL.x) > 80:
                continue
            rows.append((name, round((nL.x + nR.x) / 2), nL.y, abs(nR.x - nL.x), "vertex", iL is not iR))
            if abs(abs(nR.x - nL.x) - F) > 1.5:
                bad.append(f"{name} ({nL.x},{nL.y}): the vertex is cut {abs(nR.x - nL.x)} wide, not {F}")
            if iL is not iR:
                bad.append(f"{name} ({iL.x},{iL.y}): the inside of the vertex is cut flat")
    return rows, bad


if __name__ == "__main__":
    import sys
    import ufoLib2
    f = ufoLib2.Font.open(sys.argv[1] if len(sys.argv) > 1 else "build/AreaSerif-Regular.ufo")
    rows, bad = check(f)
    print("glyph  crotch        neck  leaves by   flat")
    for name, x, y, d, leave, flat in rows:
        print(f"{name:<6} ({x:>3},{y:>3})   {d:>5}  {str(leave):<10}  {'FLAT' if flat else '-'}")
    for b in bad:
        print("ERROR   ", b)
    print(f"parts: {len(bad)} error(s)")
    sys.exit(1 if bad else 0)
