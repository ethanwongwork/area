"""Area Serif 0.84 (Regular pass 2, tail construction; WITHDRAWN, kept as a study, not called by the build).

State when withdrawn: in the Regular j and y both reach -233, ball 88 (circle fit 88.3 / 87.8), thinnest 39.0 / 38.5,
curvecheck clean; in the Bold j and y clean (ball 123, thinnest 49); in the Light j clean, y fails curvecheck (its
outside from the ball to the lowest point falls and rises again, valley 56%). Each change of weights that cleared one
master broke another (the outside's two cubics cannot hold a rising curvature, G2 into the ball and the parallels at
once), the Bold y's ball had to move 40 units left of its reach to make room, and the ball's neck became a tight
pocket at every weight: not a construction that holds yet. See axis-0.81.md, pass 2, spine, tail and diagonal.

The design: j's and y's tail is one construction, a centreline and a width
law, in every master; ȷ ĵ ij f_j f_f_j ŋ ý ÿ ɏ ... carry it (every contour whose ball and lowest point are j's or y's,
loops.tail_kind).

The stroke audit read y's tail thinnest 33.9 against j's 38.6 (g's 42.5), y's lowest point at -209 where j and g reach
the descender line (-233 round), and the balls 80.7 (j) and 82.4 (y) against the round ends' 88 (a c f). 0.84's first
try (loops.tail_law: the ball scaled about its neck, then round_tail) built clean in the Regular but gave the Bold y a
35% flat place in its tail: the engine's points were moved after the fact. This is the construction instead.

A tail leaves a straight (j's stem, y's thin diagonal: the two straight edges the tail's outline leaves), turns round
its lowest point and ends in a ball:

  centreline   a spiral from the straight's middle line: its curvature rises from 0 where it leaves the straight as
               (s / L) ** M to its end, where it heads straight up into the ball's centre; L, M and where it leaves
               the straight solved so it ends on the ball's centre and the outside's lowest point is on the descender
               line (-233, j's and g's round depth);
  width law    the straight's own width where it leaves, falling steadily to THIN at the centreline's lowest point,
               rising steadily to the ball's diameter at the end (flat at all three: sin(pi x / 2) ** P);
  ball         a half circle of the round ends' diameter (88, `joins.round_ends2`: a c f, 2 3 5 6 9) about the
               centreline's end: its left side, top and right side (the neck) are its three nodes, each quarter one
               cubic at the circle's handle (0.5523 of the radius);
  edges        the centreline's two parallels at w / 2 from where they leave the straight to the ball's left side
               (outside) and right side (inside), each two cubics with a node at its lowest point (level); handle
               lengths solved together for position, one curvature at the lowest points, the circle's at the ball's
               left side, curvature easing in off the straight.

THIN, the tail's thinnest: the ladder's thin diagonal, 39 (balance.THIN_LOW: y's tail leaves a 39 stroke, so its
thinnest is at most that; j's was 38.6). The ball's centre stays where each letter had it (its reach), at the height
that puts its top where j's and y's were (-97).

In a master the same construction runs on the master's own straight edges with the master's own values: the ball the
round ends' 88 times the ball law (bold.BALL: 1 + 0.40 f), THIN the master's own y thin diagonal, the depth the
same, the ball's centre where the engine put the ball."""
import math

import numpy as np

THIN = 39.0                 # balance.THIN_LOW
BALL_D = 88.0               # joins.round_ends2's ball, the round ends' part
DEPTH = -233                # the descender's round line (j g)
BALL_TOP = -97              # j's and y's ball top (kept)
P_W = 1.5                   # the width law's shape, as spine.P_SHAPE
KAPPA = 0.5523              # a quarter circle's handle, of the radius
NODE_W = 3000.0
K_END = 0.7                 # the centreline's radius where it enters the ball, at least 1 / K_END ball radii
BALL_DROP = 40.0
BALL_RISE = 40.0
STRAIGHT_KEEP = 20.0        # the inside straight keeps at least this much below its corner
POCKET = 0.5                # the pocket under the ball, at least this share of the tail's thinnest
BALL_REACH = 40.0           # and how far from the drawn reach, both least change            # how far under j's line the ball may sit when the tail cannot reach it otherwise
T0_RANGE = 150.0            # how far from the drawn straight end the tail may leave it
MONO_W = 15.0               # weight of the curvature only rising, against
POS_W = 0.2                 # the fit to the construction's parallels
NECK_R = 30.0               # the inside's radius where it meets the ball, at least this
EASE = 0.30                 # the curvature where a curve leaves the straight, at most this share of its tightest


def _unit(v):
    v = np.asarray(v, float)
    return v / np.hypot(*v)


def bez(c, t):
    t = np.asarray(t, float)[:, None]
    return (1 - t) ** 3 * c[0] + 3 * (1 - t) ** 2 * t * c[1] + 3 * (1 - t) * t ** 2 * c[2] + t ** 3 * c[3]


def end_curv(c, end):
    if end == 0:
        a, b = c[1] - c[0], c[2] - c[1]
        return (2.0 / 3.0) * (a[0] * b[1] - a[1] * b[0]) / (np.hypot(*a) ** 3 + 1e-12)
    a, b = c[2] - c[1], c[3] - c[2]
    return (2.0 / 3.0) * (a[0] * b[1] - a[1] * b[0]) / (np.hypot(*b) ** 3 + 1e-12)


def curv(c, t):
    t = np.asarray(t, float)[:, None]
    d = 3 * (1 - t) ** 2 * (c[1] - c[0]) + 6 * (1 - t) * t * (c[2] - c[1]) + 3 * t ** 2 * (c[3] - c[2])
    dd = 6 * (1 - t) * (c[2] - 2 * c[1] + c[0]) + 6 * t * (c[3] - 2 * c[2] + c[1])
    return (d[:, 0] * dd[:, 1] - d[:, 1] * dd[:, 0]) / (np.hypot(d[:, 0], d[:, 1]) ** 3 + 1e-12)


def _h(x):
    return np.sin(np.pi / 2 * np.clip(x, 0, 1)) ** P_W


def indices(P):
    """The tail's nodes by geometry, as loops.round_tail reads them: B the outside's lowest point, C the ball's left
    side, T its top, N the neck, Bi the inside's lowest point, Di the inside's straight end, D the outside's."""
    n = len(P)
    on = [i for i, q in enumerate(P) if q[2]]
    iB = min(on, key=lambda i: (P[i][1], P[i][0]))
    ix = dict(B=iB, C=(iB - 3) % n, T=(iB - 6) % n, N=(iB - 9) % n, Bi=(iB - 12) % n, Di=(iB - 15) % n, D=(iB + 3) % n)
    for k in ("B", "C", "T", "N", "Bi", "D"):
        if P[ix[k]][2] not in ("curve",):
            raise ValueError(f"tail: node {k} at {ix[k]} is not a curve point")
    for k in range(1, 18):
        i = (ix["Di"] + k) % n
        if (P[i][2] is None) != (k % 3 != 0):
            raise ValueError("tail: the tail is not six cubics")
    if P[(ix["D"] + 1) % n][2] != "line" or P[ix["Di"]][2] != "line":
        raise ValueError("tail: the straights are not where expected")
    return ix


def straights(P, ix):
    """The two straight edges the tail leaves: (point, unit direction pointing into the tail)."""
    n = len(P)
    D, D1 = np.array(P[ix["D"]][:2], float), np.array(P[(ix["D"] + 1) % n][:2], float)
    Di, Di0 = np.array(P[ix["Di"]][:2], float), np.array(P[(ix["Di"] - 1) % n][:2], float)
    return (D, _unit(D - D1)), (Di, _unit(Di - Di0))


# ------------------------------------------------------------------------------------------------- centreline

def spiral(S0, th0, turn, L, q, n=600):
    """Points, headings and curvature of a curve leaving S0 at heading th0 and turning clockwise by `turn` over the
    length L, its curvature rising monotonically, piecewise linear: 0 where it leaves the straight, then by the
    non-negative steps q (one per further third), scaled so the whole turn is `turn`."""
    s = np.linspace(0, L, n)
    kn = np.concatenate([[0.0], np.cumsum(np.maximum(q, 0.0))])
    xs = np.linspace(0, 1, len(kn))
    k = np.interp(s / L, xs, kn)
    I = np.concatenate([[0.0], np.cumsum((k[1:] + k[:-1]) / 2 * np.diff(s))])
    k = k * turn / I[-1]
    I = I * turn / I[-1]
    th = th0 - I
    ds = np.diff(s)
    thm = (th[1:] + th[:-1]) / 2
    xy = np.zeros((n, 2))
    xy[0] = S0
    xy[1:] = S0 + np.cumsum(np.stack([np.cos(thm) * ds, np.sin(thm) * ds], 1), 0)
    return s, xy, th, k


def width_law(s, th, w_s, thin, d_ball):
    """w along the centreline: w_s at the start, thin at the centreline's lowest point (heading level), d_ball at the
    end; flat at all three."""
    L = s[-1]
    lev = np.abs(np.sin(th))
    i_low = int(np.argmin(np.where(np.arange(len(s)) > 5, np.abs(np.cos(th + np.pi)) + 10 * (np.sin(th) > 0.5), 99)))
    # the lowest point: heading level, pointing back (west for j, the tail running left)
    i_low = int(np.argmin(np.abs(np.sin(th)) + 10 * (np.cos(th) > 0)))
    sl = s[i_low]
    w = np.where(s <= sl, thin + (w_s - thin) * _h((sl - s) / sl), thin + (d_ball - thin) * _h((s - sl) / (L - sl)))
    return w, i_low


def ribbon(cfg, L, q, t0=0.0, n=600):
    """The tail's centreline, width and two edges for the spiral (L, q), leaving the straight t0 past its drawn end."""
    S0 = cfg["mid0"] + t0 * cfg["dmid"]
    th0 = math.atan2(cfg["dmid"][1], cfg["dmid"][0])
    s, C, th, k = spiral(S0, th0, cfg["turn"], L, q, n)
    w, i_low = width_law(s, th, cfg["w_s"], cfg["thin"], cfg["d_ball"])
    N = np.stack([-np.sin(th), np.cos(th)], 1)               # left of travel
    out = C + N * (w / 2)[:, None] * cfg["side"]              # the outside: away from the turn
    ins = C - N * (w / 2)[:, None] * cfg["side"]
    return dict(s=s, C=C, th=th, k=k, w=w, i_low=i_low, out=out, ins=ins)


def solve_centreline(cfg):
    import itertools
    """L, the curvature's steps q and t0 (where it leaves the straight, near its drawn end) so the centreline ends on
    the ball's centre and the outside's lowest point is on the depth line; the curvature where it enters the ball at
    most K_END over the ball's radius; least change of t0."""
    from scipy.optimize import least_squares
    E0 = cfg["E"]
    rb = cfg["d_ball"] / 2

    def res(v):
        L, q1, q2, q3, t0, ey, ex = v
        r = ribbon(cfg, L, [q1, q2, q3], t0, n=300)
        # the pocket: the white between the ball and the inside running under it, at least POCKET thin diagonals
        Ec = np.array([E0[0] + ex, E0[1] + ey])
        ins = r["ins"][: r["i_low"] + 1]
        under = ins[(ins[:, 0] - Ec[0]) * cfg["side"] > -rb * 0.2]
        pocket = (np.hypot(*(under - Ec).T).min() - rb) if len(under) else 99.0
        pk = 5 * max(0.0, POCKET * cfg["thin"] - pocket)
        return [pk, (r["C"][-1][0] - E0[0] - ex) / 2, (r["C"][-1][1] - E0[1] - ey) / 2, (r["out"][:, 1].min() - cfg["depth"]) / 2,
                t0 / 100 + max(0.0, t0) / 25, ey / 10, ex / 30, 20 * max(0.0, r["k"][-1] * rb - K_END), 0.01 * (q1 - q2), 0.01 * (q2 - q3)]
    span = np.hypot(*(E0 - cfg["mid0"]))
    best = None
    for L0 in (1.2 * span, 1.6 * span, 2.0 * span):
        for q0, t00 in itertools.product(((1, 1, 1), (1, 0.2, 0.2), (0.2, 1, 1), (0.2, 0.2, 1), (1, 1, 0.1), (0.05, 0.05, 1),
                                          (0.5, 0.05, 2)), (0.0, -40.0, 40.0)):
            try:
                sol = least_squares(res, [L0, *q0, max(t00, -cfg['t0_room'] + 1), 0.0, 0.0], bounds=([0.4 * span, 0, 0, 0.02, -min(T0_RANGE, cfg['t0_room']), -BALL_DROP, -BALL_REACH], [4 * span, 5, 5, 5, T0_RANGE, BALL_RISE, BALL_REACH]))
            except Exception:  # noqa: BLE001
                continue
            if best is None or sol.cost < best.cost:
                best = sol
    return best


# ------------------------------------------------------------------------------------------------- edges

def _fit_two(E_pts, p0, t0, p_mid, p1, t1, k_start, k_end, k_mid_equal=True, ease=False, mono=0, other=None, thin=None, ball=None):
    """Two cubics p0 > p_mid > p1 along the dense edge E_pts: tangents t0 at p0, level at p_mid, t1 at p1; handle
    lengths solved for position, one curvature at p_mid, k_start at p0 (if given; or an ease off a straight), k_end at
    p1 (if given)."""
    from scipy.optimize import least_squares
    from scipy.spatial import cKDTree
    tree = cKDTree(E_pts)
    j = int(np.argmin(np.hypot(*(E_pts - p_mid).T)))
    pieces = [E_pts[: j + 1], E_pts[j:]]
    ptrees = [cKDTree(pc) for pc in pieces]
    tm = np.array([np.sign(p1[0] - p0[0]) if abs(p1[0] - p0[0]) > 1 else 1.0, 0.0])
    tm = np.array([np.sign(p_mid[0] - p0[0]) or -1.0, 0.0])
    ch = [np.hypot(*(p_mid - p0)), np.hypot(*(p1 - p_mid))]
    W = math.sqrt(NODE_W)

    def cubics(v):
        return [np.array([p0, p0 + v[0] * ch[0] * t0, p_mid - v[1] * ch[0] * tm, p_mid]),
                np.array([p_mid, p_mid + v[2] * ch[1] * tm, p1 - v[3] * ch[1] * t1, p1])]

    def res(v):
        cc = cubics(v)
        r = []
        for q, c in enumerate(cc):
            smp = bez(c, np.linspace(0, 1, 40))
            d1, _ = ptrees[q].query(smp)
            d2, _ = cKDTree(smp).query(pieces[q][:: max(1, len(pieces[q]) // 40)])
            r += list(d1 / 6.3 * POS_W) + list(d2 / 6.3 * POS_W)
        ka, kb = end_curv(cc[0], 1), end_curv(cc[1], 0)
        r.append(W * math.log(max(abs(ka), 1e-7) / max(abs(kb), 1e-7)))
        if k_end is not None:
            r.append(W * math.log(max(abs(end_curv(cc[1], 1)), 1e-7) / abs(k_end)))
        else:
            # a neck: the inside turns into the ball no tighter than NECK_R (no point at the neck)
            r.append(W * 4 * max(0.0, abs(end_curv(cc[1], 1)) * NECK_R - 1.0))
        if ease:
            k0 = abs(end_curv(cc[0], 0))
            kt = np.abs(curv(cc[0], np.linspace(0, 1, 33))).max()
            r.append(W * 4 * max(0.0, k0 / max(kt, 1e-9) - EASE))
        if other is not None:
            # the stroke across itself (each place of this edge to the other edge) never under the width law's
            # thinnest, away from the ball (whose neck is the ball's own)
            from scipy.spatial import cKDTree as _T
            smp = np.concatenate([bez(c, np.linspace(0, 1, 30)) for c in cc])
            far = np.hypot(*(smp - ball[0]).T) > ball[1] + 8
            dd, _ = other.query(smp)
            r += list(W * 2 * np.maximum(0.0, thin - dd) * far)
        for c in cc:                               # one bend per curve: no stretch turning the other way
            kk_ = curv(c, np.linspace(0, 1, 25))
            sg = np.sign(kk_[np.argmax(np.abs(kk_))])
            r += list(W * 300 * np.maximum(0.0, -sg * kk_))
        if mono:
            # the curvature only rises from the straight towards the ball (curvecheck's valley: no fall and rise)
            ks = np.concatenate([np.abs(curv(c, np.linspace(0, 1, 25))) for c in cc[:mono]])
            km = ks.max()
            drops = np.maximum(0.0, ks[:-1] - ks[1:]) / km
            r += list(W * MONO_W * drops)
        return np.array(r)
    sol = least_squares(res, np.full(4, 0.5), bounds=(0.08, 1.2))
    return cubics(sol.x), sol


def construct(P, w_s=None, thin=THIN, d_ball=BALL_D, depth=DEPTH, ball_top=None, info=None):
    """The tail of contour P rebuilt (a new point list, same points). w_s: the straight's width (read across the two
    straight edges where they end, by default); the ball's centre at the drawn ball's reach (its top's x) and top."""
    ix = indices(P)
    (D, d_out), (Di, d_in) = straights(P, ix)
    P = [list(q) for q in P]
    n0 = len(P)
    # a straight that narrows towards the tail (y's thin diagonal below its junction: 39 at 260, 31 where the tail
    # leaves) is the stroke at THIN from the junction down: the inside line parallel to the outside at THIN, its
    # corner on the stroke it leaves (the thick's edge) sliding along that edge
    cross = d_out[0] * d_in[1] - d_out[1] * d_in[0]
    if abs(math.degrees(math.asin(max(-1.0, min(1.0, cross))))) > 0.3:
        nrm_o = np.array([-d_out[1], d_out[0]])
        sgn = 1.0 if (Di - D) @ nrm_o > 0 else -1.0
        base = D + nrm_o * sgn * thin
        j1, j0 = (ix["Di"] - 1) % n0, (ix["Di"] - 2) % n0
        if P[j1][2] == "line" and P[j0][2] is not None:
            a0, a1 = np.array(P[j0][:2], float), np.array(P[j1][:2], float)
            e = a1 - a0
            den = e[0] * d_out[1] - e[1] * d_out[0]
            t = ((base - a0)[0] * d_out[1] - (base - a0)[1] * d_out[0]) / den
            corner = a0 + t * e
            P[j1][0], P[j1][1] = round(float(corner[0])), round(float(corner[1]))
            Di = base + d_out * ((Di - base) @ d_out)
            P[ix["Di"]][0], P[ix["Di"]][1] = float(Di[0]), float(Di[1])
            d_in = d_out.copy()
            if info is not None:
                info["straight"] = f"inside parallel at {thin:.0f}, corner {tuple(P[j1][:2])}"
    r = d_ball / 2
    T = np.array(P[ix["T"]][:2], float)
    top = T[1] if ball_top is None else ball_top
    E = np.array([T[0], top - r])
    dmid = _unit(d_out + d_in)
    nrm = np.array([-dmid[1], dmid[0]])
    # the middle line between the two straights, and the straight's width across it
    off_out, off_in = (D - Di) @ nrm, 0.0
    if w_s is None:
        w_s = abs(off_out)
    mid0 = Di + nrm * off_out / 2
    mid0 = mid0 + dmid * min(0.0, (D - mid0) @ dmid, (Di - mid0) @ dmid)     # start where the higher straight end is
    side = 1.0 if (D - Di) @ nrm > 0 else -1.0
    # the outside lies on the left of travel when the tail turns clockwise: side +1 means the outside is +nrm
    th0 = math.atan2(dmid[1], dmid[0])
    turn = (th0 - math.pi / 2) % (2 * math.pi)                # clockwise to heading straight up
    # how far back up the straights the tail may leave them: short of the inside straight's other end (a junction's
    # corner, y), by STRAIGHT_KEEP
    n_ = len(P)
    far_in = np.array(P[(ix["Di"] - 1) % n_][:2], float)
    t0_room = max(1.0, (mid0 - far_in) @ dmid - STRAIGHT_KEEP) if P[(ix["Di"] - 1) % n_][2] == "line" else T0_RANGE
    cfg = dict(t0_room=t0_room, mid0=mid0, dmid=dmid, turn=turn, w_s=w_s, thin=thin, d_ball=d_ball, side=side, E=E, depth=depth)
    sol = solve_centreline(cfg)
    L, qa, qb, qc, t0, ey, ex = sol.x
    E = E + np.array([ex, ey])
    cfg["E"] = E
    rb = ribbon(cfg, L, [qa, qb, qc], t0)
    # the ball is a circle about the centreline's end: each edge runs on the ribbon until it meets the circle, then on
    # the circle to the ball's left side (outside) or its neck (inside): the outline of ribbon and ball together
    def onto_ball(e, ang_end):
        d = np.hypot(*(e - E).T)
        hit = np.nonzero(d <= r + 0.5)[0]
        k0 = int(hit[0]) if len(hit) else len(e) - 1
        a0 = math.atan2(e[k0][1] - E[1], e[k0][0] - E[0])
        da = (ang_end - a0 + math.pi) % (2 * math.pi) - math.pi
        arc = np.array([E + r * np.array([math.cos(a0 + da * t), math.sin(a0 + da * t)]) for t in np.linspace(0, 1, 40)])
        return np.concatenate([e[:k0], arc])
    out_e = onto_ball(rb["out"], math.pi if side > 0 else 0.0)
    in_e = onto_ball(rb["ins"], 0.0 if side > 0 else math.pi)
    # nodes: the ball's three, the lowest points, the straights' ends (where the parallels leave the straight lines)
    C_ = E + np.array([-r, 0.0]) if side > 0 else E + np.array([r, 0.0])
    N_ = E + np.array([r, 0.0]) if side > 0 else E + np.array([-r, 0.0])
    T_ = E + np.array([0.0, r])
    iB = int(np.argmin(out_e[:, 1]))
    iBi = int(np.argmin(in_e[:, 1]))
    B_ = np.array([out_e[iB][0], float(depth)])
    Bi_ = in_e[iBi].copy()
    D_ = D + d_out * ((out_e[0] - D) @ d_out)
    Di_ = Di + d_in * ((in_e[0] - Di) @ d_in)
    k_ball = 1.0 / r
    # outside: D > B > C; the curvature at C the ball's (one circle across the ball's left side)
    oc, so = _fit_two(out_e, D_, d_out, B_, C_, np.array([0.0, 1.0]), None, k_ball, ease=True, mono=2)
    # inside: Di > Bi > N, arriving at the neck heading up
    # the inside: the outside's own parallel at the width law, measured along the outside (so the stroke across
    # itself is the law wherever the outside is drawn), run onto the ball like the outside
    od = np.concatenate([bez(c, np.linspace(0, 1, 300, endpoint=(q == 1))) for q, c in enumerate(oc)])
    dd = np.gradient(od, axis=0)
    tt = dd / np.hypot(dd[:, 0], dd[:, 1])[:, None]
    inward = np.stack([tt[:, 1], -tt[:, 0]], 1) * side          # D > B > C runs with the stroke on its right (j)
    if (inward[len(od) // 2] @ (Bi_ - B_)) < 0:
        inward = -inward
    so_ = np.concatenate([[0.0], np.cumsum(np.hypot(*np.diff(od, axis=0).T))])
    iBo = int(np.argmin(od[:, 1]))
    sB, sL = so_[iBo], so_[-1]
    wo = np.where(so_ <= sB, thin + (w_s - thin) * _h((sB - so_) / sB), thin + (d_ball - thin) * _h((so_ - sB) / (sL - sB)))
    in_p = od + inward * wo[:, None]
    # the neck: where that parallel meets the ball's circle; the inside arrives there along the circle (one tangent)
    # turning the other way (the ball's neck), the ball's circle from there over its top
    dN = np.hypot(*(in_p - E).T)
    hit = np.nonzero(dN <= r)[0]
    kN = int(hit[0]) if len(hit) else len(in_p) - 1
    aN = math.atan2(in_p[kN][1] - E[1], in_p[kN][0] - E[0])
    N_ = E + r * np.array([math.cos(aN), math.sin(aN)])
    tN = np.array([-math.sin(aN), math.cos(aN)]) * side          # along the circle towards the top
    in_e = np.concatenate([in_p[:kN], [N_]])
    iBi = int(np.argmin(in_e[:, 1]))
    Bi_ = in_e[iBi].copy()
    Di_ = Di + d_in * ((in_e[0] - Di) @ d_in)
    ic, si = _fit_two(in_e, Di_, d_in, Bi_, N_, tN, None, None, ease=True, mono=1)
    # the ball: C > T > N, two quarter circles
    h = KAPPA * r
    q1 = [C_, C_ + np.array([0.0, h]), T_ - np.array([h, 0.0]) * (1 if side > 0 else -1), T_]
    span = (math.pi / 2 - aN) if side > 0 else (aN - math.pi / 2)
    span = span % (2 * math.pi)
    h2 = 4.0 / 3.0 * math.tan(span / 4) * r
    q2 = [T_, T_ + np.array([h2, 0.0]) * (1 if side > 0 else -1), N_ + tN * h2, N_]
    n = len(P)
    Q = [list(q) for q in P]

    def put(i, xy):
        Q[i % n][0], Q[i % n][1] = round(float(xy[0])), round(float(xy[1]))
    # contour order: Di > Bi > N > T > C > B > D (the inside forward to the ball, then the outside back up)
    put(ix["Di"], ic[0][0]); put(ix["Di"] + 1, ic[0][1]); put(ix["Di"] + 2, ic[0][2]); put(ix["Bi"], ic[0][3])
    put(ix["Bi"] + 1, ic[1][1]); put(ix["Bi"] + 2, ic[1][2]); put(ix["N"], ic[1][3])
    put(ix["N"] + 1, q2[2]); put(ix["N"] + 2, q2[1]); put(ix["T"], T_)
    put(ix["T"] + 1, q1[2]); put(ix["T"] + 2, q1[1]); put(ix["C"], C_)
    put(ix["C"] + 1, oc[1][2]); put(ix["C"] + 2, oc[1][1]); put(ix["B"], oc[1][0])
    put(ix["B"] + 1, oc[0][2]); put(ix["B"] + 2, oc[0][1]); put(ix["D"], oc[0][0])
    # whole units at the neck: its two handles rounded (floor or ceiling each way) to the pair nearest one line
    import itertools
    iN = ix["N"] % n
    a_ex, b_ex = ic[1][2], q2[2]
    best = None
    for fa in itertools.product((math.floor, math.ceil), repeat=4):
        a = np.array([fa[0](a_ex[0]), fa[1](a_ex[1])], float)
        b = np.array([fa[2](b_ex[0]), fa[3](b_ex[1])], float)
        Nn = np.array(Q[iN][:2], float)
        u, w_ = Nn - a, b - Nn
        ang = abs(math.atan2(u[0] * w_[1] - u[1] * w_[0], u @ w_))
        cost = ang + 1e-4 * (np.hypot(*(a - a_ex)) + np.hypot(*(b - b_ex)))
        if best is None or cost < best[0]:
            best = (cost, a, b)
    Q[(iN - 1) % n][0], Q[(iN - 1) % n][1] = int(best[1][0]), int(best[1][1])
    Q[(iN + 1) % n][0], Q[(iN + 1) % n][1] = int(best[2][0]), int(best[2][1])
    if info is not None:
        info.update(dict(L=round(float(L), 1), q=[round(float(x), 2) for x in (qa, qb, qc)], miss=round(float(sol.cost), 3),
                         w_s=round(float(w_s), 1), t0=round(float(t0), 1),
                         E=E.round(1).tolist(), fit=(round(float(so.cost), 2), round(float(si.cost), 2)),
                         thin_at=rb["C"][rb["i_low"]].round().tolist()))
    return [tuple(q) for q in Q]


def _put(c, Q):
    from ufoLib2.objects import Point
    c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in Q]


def regular(font, names=("j", "y")):
    """j and y in the Regular (their families are built from them in the charset)."""
    log = []
    for name in names:
        if name not in font:
            continue
        g = font[name]
        c = max(g.contours, key=lambda c_: len(c_.points))
        P = [(p.x, p.y, p.type, p.smooth) for p in c.points]
        info = {}
        _put(c, construct(P, info=info))
        log.append(f"{name}: {info}")
    return log


def thin_of(reg, font):
    """The tail's thinnest in a master: THIN times the master's change in v's thin diagonal (hair.across)."""
    import hair as HAIR
    a, b = HAIR.across(reg["v"], 1, 0, 520), HAIR.across(font["v"], 1, 0, 520)
    return THIN * (b / a) if a and b else THIN


def master_contour(P, thin, d_ball):
    info = {}
    Q = construct(P, thin=thin, d_ball=d_ball, info=info)
    return Q, info
