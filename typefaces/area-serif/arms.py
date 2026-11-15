"""Area Serif 0.81, round 3: a sign of arms (balls, waists and tapers: the daggers, the asterisk, the exclamation
marks) in every master, by a width profile instead of the engine's point moves.

Each arm is a centreline, its axis of symmetry, from where it leaves the sign (a junction, where arms cross, or its
own flat base) to its end (a round ball or a flat cut). Every point of the arm is read as (s, h): s along the axis,
h across it. A master's arm is the SAME centreline with h multiplied by one factor f everywhere, so the ball, the
waist and the taper keep their proportions to one another, and the arm keeps its length:

  - within a junction (s under the crossing arm's half width) the arm is the junction scaled by f about its centre,
    so the crotches between two arms move as one point of both;
  - the round end (from the ball's widest place to its tip) is the ball scaled by f about the tip, so it stays
    round and the tip stays where it was;
  - between the two, s runs evenly from the end of the one to the start of the other, h times f.

f is the sign law, (stem / 78) ** bold.SIGN_K, one number for every arm of the sign. It is capped only where two
neighbouring arms would close the white between them below `floor` (the letters' own least white at that weight,
white.Law); the cap is then one f for all the arms alike. A handle takes the profile's own affine stretch where it
lies (each zone is an affine map, so a curve keeps its inflections); a level or upright handle stays so (an extreme
stays at its node).

The sign's symmetry is then made exact by bold.symmetric (moves mirrored as whole units).
"""
import math

import numpy as np


def _area(P):
    n = len(P)
    return sum(P[i][0] * P[(i + 1) % n][1] - P[(i + 1) % n][0] * P[i][1] for i in range(n)) / 2


def _tangents(P, i):
    """The incoming and outgoing directions at node i (through its handles, or its neighbours on a line)."""
    n = len(P)
    a, b = P[(i - 1) % n], P[(i + 1) % n]
    return (P[i][0] - a[0], P[i][1] - a[1]), (b[0] - P[i][0], b[1] - P[i][1])


def crotches(P):
    """Corner nodes where the ink turns inward (a reflex corner of the ink): where two arms meet."""
    ink = _area(P) > 0
    out = []
    for i, q in enumerate(P):
        if q[2] is None or q[3]:
            continue
        u, w = _tangents(P, i)
        cr = u[0] * w[1] - u[1] * w[0]
        if abs(cr) > 1e-9 and (cr > 0) != ink:
            out.append(i)
    return out


def _clusters(P, idx, reach=100.0):
    groups = []
    for i in idx:
        for G in groups:
            if any(math.dist(P[i][:2], P[j][:2]) <= reach for j in G):
                G.append(i)
                break
        else:
            groups.append([i])
    merged = True
    while merged:
        merged = False
        for a in range(len(groups)):
            for b in range(a + 1, len(groups)):
                if any(math.dist(P[i][:2], P[j][:2]) <= reach for i in groups[a] for j in groups[b]):
                    groups[a] += groups.pop(b)
                    merged = True
                    break
            if merged:
                break
    return groups


def _run(P, i, j):
    """Indexes from i to j going forward round the contour, both included."""
    n, out, k = len(P), [i], i
    while k != j:
        k = (k + 1) % n
        out.append(k)
    return out


def _axis_of(P, idx, origin):
    """An arm's direction from `origin`: towards the mean of its outline's far half (on its axis, for an arm drawn
    symmetric about it, whatever nodes its round end has)."""
    pts = [P[k][:2] for k in idx]
    far = max(math.dist(p, origin) for p in pts)
    out = [p for p in pts if math.dist(p, origin) >= 0.6 * far]
    cx, cy = sum(p[0] for p in out) / len(out) - origin[0], sum(p[1] for p in out) / len(out) - origin[1]
    d = math.hypot(cx, cy)
    return (cx / d, cy / d)


def _end(P, idx, origin, u=None):
    """The far end of an arm from `origin` (along u when given): its tip, and whether it is round (one smooth node
    farthest) or a flat cut (two corners)."""
    on = [k for k in idx if P[k][2] is not None]
    if not on:
        return None
    if u is None:
        far = max(math.dist(P[k][:2], origin) for k in on)
        top = [k for k in on if math.dist(P[k][:2], origin) >= far - 3]
    else:
        far = max((P[k][0] - origin[0]) * u[0] + (P[k][1] - origin[1]) * u[1] for k in on)
        top = [k for k in on if (P[k][0] - origin[0]) * u[0] + (P[k][1] - origin[1]) * u[1] >= far - 3]
    tip = (sum(P[k][0] for k in top) / len(top), sum(P[k][1] for k in top) / len(top))
    if u is not None:                                          # the tip on the axis, at the arm's reach along it
        tip = (origin[0] + far * u[0], origin[1] + far * u[1])
    round_ = len(top) == 1 and P[top[0]][3]
    if not round_ and len(top) == 1:                           # a round end whose nodes are off its axis
        round_ = all(P[k][3] for k in on if (P[k][0] - origin[0]) * (u or (0, 0))[0] + (P[k][1] - origin[1]) * (u or (0, 0))[1] >= far - 30)
    return tip, round_, top


def _ball(P, idx, J, u, n_, L, top):
    """A round end's length: from its tip to its widest place (the ball's equator), read on both sides of the
    tip going back along the outline while the half width grows."""
    k0 = idx.index(top[0])
    seen = []
    for step in (1, -1):
        best_h, best_s, k = 0.0, L, k0
        while 0 <= k + step < len(idx):
            k += step
            q = P[idx[k]]
            if q[2] is None:
                continue
            s = (q[0] - J[0]) * u[0] + (q[1] - J[1]) * u[1]
            h = abs((q[0] - J[0]) * n_[0] + (q[1] - J[1]) * n_[1])
            if h < best_h - 0.5:
                break
            best_h, best_s = h, s
        seen.append(best_s)
    return max(0.0, L - sum(seen) / 2)


class Arm:
    """One arm: origin J, axis u, normal n, length L, zones z0 (at J) and z1 (at the far end), and its points."""

    def __init__(s, J, tip, z0, round_, P, idx, far_junction=False, z1=None):
        s.J = J
        d = (tip[0] - J[0], tip[1] - J[1])
        s.L = math.hypot(*d)
        s.u = (d[0] / s.L, d[1] / s.L)
        s.n = (-s.u[1], s.u[0])
        s.z0 = z0
        s.round = round_
        s.idx = idx
        s.tip = tip
        if z1 is not None:
            s.z1 = z1
        elif round_:
            _, _, top = _end(P, idx, J, s.u)
            s.z1 = _ball(P, idx, J, s.u, s.n, s.L, top)
        else:
            s.z1 = 0.0
        s.far_junction = far_junction

    def local(s, p):
        dx, dy = p[0] - s.J[0], p[1] - s.J[1]
        return dx * s.u[0] + dy * s.u[1], dx * s.n[0] + dy * s.n[1]

    def along(s, x, f, reach=1.0):
        """s' and ds'/ds at s. reach (0.81): the arm's length in the master over the Regular's (REACH)."""
        L, z0, z1 = s.L, s.z0, s.z1
        a0, a1 = f * z0, reach * L - f * z1
        if x <= z0:
            return f * x, f
        if x >= L - z1:
            return reach * L - f * (L - x), f
        span = (L - z1) - z0
        k = (a1 - a0) / span if span > 1e-9 else f
        return a0 + (x - z0) * k, k

    def body(s, f):
        """The body's length in the master (under 0: the zones overlap, no room)."""
        return (s.L - f * s.z1) - f * s.z0

    def map(s, p, f, reach=1.0):
        x, h = s.local(p)
        x2, k = s.along(x, f, reach)
        return (s.J[0] + x2 * s.u[0] + f * h * s.n[0], s.J[1] + x2 * s.u[1] + f * h * s.n[1]), k


def read(contours, axis_x=None):
    """The arms of a sign: (arms, roles) where roles[c][i] is the arm index of point i of contour c (or 'J', junction
    index, or 'dot'). None when the sign is not one of arms (a straight stroke that is not an end cut, no round end)."""
    import bold as B
    arms, roles = [], []
    any_ball = False
    for ci, P in enumerate(contours):
        n = len(P)
        if B.is_dot(P):
            roles.append(["dot"] * n)
            continue
        on = [i for i, q in enumerate(P) if q[2] is not None]
        for k, i in enumerate(on):                             # straight runs only as end cuts (under 60, at an end)
            j = on[(k + 1) % len(on)]
            if P[j][2] == "line" and math.dist(P[i][:2], P[j][:2]) > 60:
                return None
        cr = crotches(P)
        role = [None] * n
        if not cr:                                            # one arm on its own upright axis, base to tip
            axis_x = _axis([P])
            if axis_x is None:
                return None
            ys = [P[i][1] for i in on]
            lo = [i for i in on if P[i][1] <= min(ys) + 3]
            hi = [i for i in on if P[i][1] >= max(ys) - 3]
            ends = []
            for grp in (lo, hi):
                ends.append(((axis_x, sum(P[i][1] for i in grp) / len(grp)), len(grp) == 1 and P[grp[0]][3], grp))
            (b0, r0, g0), (b1, r1, g1) = ends
            if r0 and not r1:                                  # the round end is the far one
                (b0, r0, g0), (b1, r1, g1) = (b1, r1, g1), (b0, r0, g0)
            if r0:
                return None                                    # two round ends: not this construction
            arm = Arm(b0, b1, 0.0, r1, P, list(range(n)))
            any_ball |= r1
            arms.append(arm)
            roles.append([len(arms) - 1] * n)
            continue
        groups = _clusters(P, cr)
        Js = [(sum(P[i][0] for i in G) / len(G), sum(P[i][1] for i in G) / len(G)) for G in groups]
        gof = {i: gi for gi, G in enumerate(groups) for i in G}
        for k, i in enumerate(cr):
            j = cr[(k + 1) % len(cr)]
            idx = _run(P, i, j)
            inner = idx[1:-1]
            if gof[i] == gof[j]:                              # a lobe: an arm of junction gof[i]
                J = Js[gof[i]]
                if not [k for k in inner if P[k][2] is not None]:
                    return None
                u = _axis_of(P, inner, J)
                tip, round_, top = _end(P, inner, J, u)
                ons = [k for k in inner if P[k][2] is not None]
                far_ = [k for k in ons if (P[k][0] - J[0]) * u[0] + (P[k][1] - J[1]) * u[1] >= max((P[m][0] - J[0]) * u[0] + (P[m][1] - J[1]) * u[1] for m in ons) - 30]
                round_ = all(P[k][3] for k in far_)
                z0 = max(abs((P[c][0] - J[0]) * u[0] + (P[c][1] - J[1]) * u[1]) for c in (i, j))
                arm = Arm(J, tip, z0, round_, P, inner)
                any_ball |= round_
            else:                                             # a bridge between two junctions: one side of it
                Ja, Jb = Js[gof[i]], Js[gof[j]]
                d = (Jb[0] - Ja[0], Jb[1] - Ja[1])
                L = math.hypot(*d)
                u = (d[0] / L, d[1] / L)
                za = max(abs((P[c][0] - Ja[0]) * u[0] + (P[c][1] - Ja[1]) * u[1]) for c in groups[gof[i]])
                zb = max(abs((P[c][0] - Jb[0]) * u[0] + (P[c][1] - Jb[1]) * u[1]) for c in groups[gof[j]])
                arm = Arm(Ja, Jb, za, False, P, inner, far_junction=True, z1=zb)
            arms.append(arm)
            for q in inner:
                role[q] = len(arms) - 1
        for i in cr:
            role[i] = ("J", gof[i])
        roles.append(role)
        roles[-1] = role
        roles[-1] = [r if r is not None else ("J", 0) for r in role]
        for gi, J in enumerate(Js):
            arms.append(("junction", J))
            # junction centres are kept as pseudo arms so a crotch maps by its own junction
        roles[-1] = [(("J", len(arms) - len(Js) + r[1]) if isinstance(r, tuple) else r) for r in roles[-1]]
    if not any_ball:
        return None
    one_part(arms)
    return arms, roles


def one_part(arms):
    """Arms drawn alike are one part: arms within 6 units of one another in length and in their two zones take the
    mean of the three, and a star's arms (five or more round a junction) lie at exact turns of one another from the
    upright. So the map is the same for each copy, and their moves are each other's turned."""
    real = [a for a in arms if isinstance(a, Arm)]
    groups = []
    for a in real:
        for G in groups:
            b = G[0]
            if a.round == b.round and a.far_junction == b.far_junction and abs(a.L - b.L) <= 6 \
                    and abs(a.z0 - b.z0) <= 6 and abs(a.z1 - b.z1) <= 6:
                G.append(a)
                break
        else:
            groups.append([a])
    for G in groups:
        L, z0, z1 = (sum(getattr(a, k) for a in G) / len(G) for k in ("L", "z0", "z1"))
        for a in G:
            a.L, a.z0, a.z1 = L, z0, z1
    by_j = {}
    for a in real:
        if not a.far_junction:
            by_j.setdefault((round(a.J[0], 3), round(a.J[1], 3)), []).append(a)
    for js, G in by_j.items():
        n = len(G)
        if n < 5:
            continue
        step = 2 * math.pi / n
        for a in G:
            ang = math.atan2(a.u[1], a.u[0])
            ang = math.pi / 2 + round((ang - math.pi / 2) / step) * step
            a.u = (math.cos(ang), math.sin(ang))
            a.n = (-a.u[1], a.u[0])


def _handles(P):
    """For each off-curve point, the on-curve node it belongs to (the nearer one along the outline)."""
    n = len(P)
    own = {}
    for i, q in enumerate(P):
        if q[2] is not None:
            continue
        if P[(i - 1) % n][2] is not None:
            own[i] = (i - 1) % n
        else:
            own[i] = (i + 1) % n
    return own


def master(contours, f, engine=None, reach=1.0):
    """The sign at a master: every arm's points mapped by its profile at f; dots as the engine made them (the
    period's rule). contours: the Regular's; engine: the engine's output (for the dots). reach: each arm's length
    over the Regular's (REACH). Floats."""
    got = read(contours, _axis(contours))
    if got is None:
        return None
    arms, roles = got
    out = []
    for ci, P in enumerate(contours):
        role = roles[ci]
        if role and role[0] == "dot":
            out.append([q[:2] for q in (engine[ci] if engine else P)])
            continue
        own = _handles(P)
        new, stretch = {}, {}
        for i, q in enumerate(P):
            if q[2] is None:
                continue
            r = role[i]
            if isinstance(r, tuple):                           # a crotch: its junction scaled about its centre
                J = arms[r[1]][1]
                new[i] = (J[0] + f * (q[0] - J[0]), J[1] + f * (q[1] - J[1]))
                stretch[i] = (None, f)
            else:
                arm = arms[r]
                new[i], k = arm.map(q[:2], f, reach)
                stretch[i] = (arm, k)
        for i, q in enumerate(P):
            if q[2] is not None:
                continue
            o = own[i]
            arm, _ = stretch[o]
            if arm is None:                                    # a crotch's handle lies along the arm it leaves for
                far = (i + 1) % len(P) if o == (i - 1) % len(P) else (i - 1) % len(P)
                while P[far][2] is None:
                    far = (far + (1 if o == (i - 1) % len(P) else -1)) % len(P)
                arm = stretch[far][0]
            hv = (q[0] - P[o][0], q[1] - P[o][1])
            if arm is None:
                nv = (hv[0] * f, hv[1] * f)
            else:                                              # the profile's own stretch where the handle lies:
                a_ = hv[0] * arm.u[0] + hv[1] * arm.u[1]       # an affine map in each zone, so a curve keeps its
                b_ = hv[0] * arm.n[0] + hv[1] * arm.n[1]       # inflections; a level or upright handle stays so
                mid = arm.local(((q[0] + P[o][0]) / 2, (q[1] + P[o][1]) / 2))[0]
                _, k = arm.along(mid, f, reach)
                nv = (a_ * k * arm.u[0] + b_ * f * arm.n[0], a_ * k * arm.u[1] + b_ * f * arm.n[1])
                if abs(hv[1]) < 1e-9 or abs(hv[0]) < 1e-9:
                    ln = math.hypot(*nv)
                    nv = (math.copysign(ln, hv[0]), 0.0) if abs(hv[1]) < 1e-9 else (0.0, math.copysign(ln, hv[1]))
            new[i] = (new[o][0] + nv[0], new[o][1] + nv[1])
        out.append([new[i] for i in range(len(P))])
    return out


# 0.81 (integration): a star's arms reach further at the Bold and less far at the Light, as the references' asterisks
# do (span, width and height, master over Regular: Georgia Pro 1.035 / 1.045, Source Serif 4 1.017 / 1.018, Literata
# 1.092 / 1.077 at Bold; 0.981 / 0.976, 0.989 / 0.987, 0.987 / 0.981 at Light; tools/sheets_081.py). With the arms
# kept at the Regular's length the white law capped the Bold asterisk at f 1.199: its ink gained 0.74 of n's gain
# where the references' gain 0.82 to 0.94 of theirs, and it read nearly Regular beside Bold text. REACH: the mean
# span ratio at each end of the axis; a master between takes it in proportion to its stem step (f).
REACH = {"asterisk": (1.047, 0.983)}


def reach_of(name, v):
    r = REACH.get(name)
    if not r:
        return 1.0
    import bold as B
    f_light = B.vector(B.LIGHT_STEM)["f"]
    return r[0] ** v["f"] if v["f"] >= 0 else r[1] ** (v["f"] / f_light)


def _axis(contours):
    import bold as B
    for M, c, j, name in B.symmetries(contours):
        if name == "mirror |":
            return c[0]
    return None


def arm_pairs(arms):
    return [a for a in arms if isinstance(a, Arm)]


def white_between(contours, f, step=3.0, reach=1.0):
    """The least white between two different arms' outer halves (s over half the arm's length) at f."""
    got = read(contours, _axis(contours))
    arms, roles = got
    mapped = master(contours, f, reach=reach)
    pts = {}
    import bold as B
    for ci, P in enumerate(contours):
        if roles[ci] and roles[ci][0] == "dot":
            continue
        Q = [(x, y) + tuple(q[2:]) for (x, y), q in zip(mapped[ci], P)]
        on = [i for i, q in enumerate(P) if q[2] is not None]

        class _P:
            def __init__(s_, q):
                s_.type = q[2]
        for i, mid, j in B.segments([_P(q) for q in P]):
            r = roles[ci][i] if not isinstance(roles[ci][i], tuple) else roles[ci][j]
            if isinstance(r, tuple):
                continue
            arm = arms[r]
            c = [Q[i][:2]] + [Q[m][:2] for m in mid] + [Q[j][:2]]
            for t in np.linspace(0, 1, 12, endpoint=False):
                p = B._bez(c, t) if len(c) == 4 else (c[0][0] + (c[-1][0] - c[0][0]) * t, c[0][1] + (c[-1][1] - c[0][1]) * t)
                x, _ = arm.local(p)
                if x > arm.L / 2 and not arm.far_junction:
                    pts.setdefault(r, []).append(p)
        del on
    best = None
    keys = sorted(pts)
    home = {r: ci for ci, role in enumerate(roles) for r in role if isinstance(r, int)}
    for a in range(len(keys)):
        for b in range(a + 1, len(keys)):
            if home[keys[a]] != home[keys[b]]:              # arms of one contour; separate inks: keep_apart
                continue
            A_, C_ = np.array(pts[keys[a]]), np.array(pts[keys[b]])
            d = np.hypot(A_[:, None, 0] - C_[None, :, 0], A_[:, None, 1] - C_[None, :, 1]).min()
            best = d if best is None or d < best else best
    return best


def capped(contours, f, least_of, reach=1.0):
    """f, or the largest f under it at which no two arms' white falls under least_of(the Regular's white): the
    white between parts' own law (white.least)."""
    w0 = white_between(contours, 1.0)
    if w0 is None:
        return f
    least = least_of(w0)
    if f <= 1.0 or white_between(contours, f, reach=reach) >= least:
        return f
    lo, hi = 1.0, f
    for _ in range(30):
        mid = (lo + hi) / 2
        if white_between(contours, mid, reach=reach) >= least:
            lo = mid
        else:
            hi = mid
    return lo


# ---------------------------------------------------------------- the Regular: each arm drawn once

def _types(Q):
    """On-curve types from the structure: a node after an off-curve point ends a curve, else a line."""
    n = len(Q)
    return [(x, y, None if t is None else ("curve" if Q[(i - 1) % n][2] is None else "line"), s)
            for i, (x, y, t, s) in enumerate(Q)]


def mirrored_half(P, c):
    """Contour P made exactly symmetric about the upright x = c from its right half (x > c): the left half is the
    right half turned over, point for point. A node within 1.5 of the axis is on it; a flat end crossing the axis
    keeps its two corners. None when the contour does not cross the axis twice."""
    n = len(P)
    side = [0 if q[2] is not None and abs(q[0] - c) <= 1.5 else (1 if q[0] > c else -1) for q in P]
    events = []                                                # (index, kind): an axis node, or a line across
    for i in range(n):
        if side[i] == 0:
            events.append((i, "node"))
        j = (i + 1) % n
        if P[i][2] is not None and P[j][2] == "line" and side[i] * side[j] == -1:
            events.append((i, "line"))
    if len(events) != 2:
        return None
    (a, ka), (b, kb) = events
    runs = []
    for s0, k0, s1, k1 in ((a, ka, b, kb), (b, kb, a, ka)):
        start = (s0 + 1) % n if k0 == "node" else (s0 if side[s0] == 1 else (s0 + 1) % n)
        stop = s1 if k1 == "node" else ((s1 + 1) % n if side[s1] == -1 else s1)
        run, k = [], start
        while True:
            run.append(k)
            if k == (stop - 1) % n if k1 == "node" else k == stop:
                break
            k = (k + 1) % n
            if len(run) > n:
                return None
        runs.append((run, s0, k0, s1, k1))
    run, s0, k0, s1, k1 = max(runs, key=lambda r: sum(P[k][0] - c for k in r[0]))
    if any(side[k] < 0 for k in run):
        return None
    m = lambda q: (2 * c - q[0], q[1], q[2], q[3])             # noqa: E731
    Q = []
    if k0 == "node":
        Q.append((c, P[s0][1], P[s0][2], P[s0][3]))
    Q += [P[k] for k in run]
    if k1 == "node":
        Q.append((c, P[s1][1], P[s1][2], P[s1][3]))
    Q += [m(P[k]) for k in reversed(run)]
    if k0 != "node" and k1 != "node":
        return None
    return _types(Q)


def _rot(p, J, a):
    ca, sa = math.cos(a), math.sin(a)
    x, y = p[0] - J[0], p[1] - J[1]
    return (J[0] + x * ca - y * sa, J[1] + x * sa + y * ca)


def star(P, n):
    """A star of n arms (the asterisk): the upright arm, made symmetric about its own axis, turned round the
    junction by 360/n degrees n - 1 times. The crotch between two arms is where the arm's edge, run on along its
    tangent, meets the line half way between the two arms' axes. One contour; floats."""
    cr = crotches(P)
    if len(cr) != n:
        return None
    J = (round(sum(P[i][0] for i in cr) / n), round(sum(P[i][1] for i in cr) / n))
    best = None
    for k, i in enumerate(cr):                                 # the upright arm: the lobe whose far end is highest
        j = cr[(k + 1) % n]
        idx = _run(P, i, j)
        top = max(P[t][1] for t in idx)
        if best is None or top > best[0]:
            best = (top, idx)
    idx = best[1]
    arm = [P[t] for t in idx]                                  # crotch, ..., crotch
    tip = max((t for t in range(len(arm)) if arm[t][2] is not None), key=lambda t: arm[t][1])
    c = arm[tip][0]
    J = (c, J[1])
    whole = mirrored_half(arm + [(J[0], J[1] - 40, "line", False)], c)   # closed through a point under J
    if whole is None:
        return None
    # back to the open arm: drop the closing point, start at the right crotch
    k0 = [k for k, q in enumerate(whole) if q[1] == J[1] - 40 and q[0] == c][0]
    whole = whole[k0 + 1:] + whole[:k0]
    right, left = whole[0], whole[-1]
    # the crotch on the half-way line: along the right edge's tangent from the old crotch
    h = whole[1]                                               # the right crotch's handle (or next node)
    d = (h[0] - right[0], h[1] - right[1])
    half = math.pi / 2 - math.pi / n                           # the half-way line between this arm and the next
    u = (math.cos(half), math.sin(half))
    # right + s d = J + r u
    det = d[0] * (-u[1]) - d[1] * (-u[0])
    rx, ry = J[0] - right[0], J[1] - right[1]
    s = (rx * (-u[1]) - ry * (-u[0])) / det
    newc = (right[0] + s * d[0], right[1] + s * d[1])
    arm_open = [(newc[0], newc[1], right[2], right[3])] + whole[1:-1]
    if n != 6:
        out = []
        for k in range(n):
            a = 2 * math.pi * k / n
            out += [_rot(q[:2], J, a) + tuple(q[2:]) for q in arm_open]
        return _types(out), J
    # six arms: the upright arm and the one turned to 30 degrees are drawn; the other four are their mirror images
    # (exact in whole units), so the star is mirror-symmetric point for point both ways. The turned arm takes a node
    # at each of its own extremes (each copy's extremes are its own, so a sixth's turn is not point for point).
    rnd = lambda Q: [(round(q[0]), round(q[1])) + tuple(q[2:]) for q in Q]            # noqa: E731
    a0 = rnd(arm_open)
    a5 = rnd(_split_extremes([_rot(q[:2], J, -math.pi / 3) + tuple(q[2:]) for q in arm_open]))
    mx = lambda q: (2 * J[0] - q[0], q[1]) + tuple(q[2:])                              # noqa: E731
    my = lambda q: (q[0], 2 * J[1] - q[1]) + tuple(q[2:])                              # noqa: E731
    first = lambda nxt: nxt[0]                                                         # noqa: E731

    def turned_over(arm, nxt_crotch, m):
        """arm (its right crotch first), mirrored by m and run the other way: its own right crotch is the mirror of
        the crotch that follows it."""
        return [m(nxt_crotch)] + [m(q) for q in reversed(arm[1:])]
    a4 = turned_over(a5, first(a0), my)                        # 330: a5 turned over the level
    a1 = turned_over(a5, first(a0), mx)                        # 150
    a3 = turned_over(a0, first(a1), my)                        # 270: the upright, turned over the level
    a1 = turned_over(a5, first(a0), mx)                        # 150
    a2 = turned_over(a4, first(a5), mx)                        # 210
    out = a0 + a1 + a2 + a3 + a4 + a5
    return _types(out), J


def _split_extremes(Q):
    """An open run of points: each cubic cut where it passes an extreme in x or y (not within 8% of its ends), the
    new node smooth with its handles level or upright, exactly on the curve."""
    out = [Q[0]]
    k = 1
    while k < len(Q):
        if Q[k][2] is None and k + 2 < len(Q) + 0 and Q[k + 1][2] is None:
            p0, p1, p2, p3 = out[-1][:2], Q[k][:2], Q[k + 1][:2], Q[k + 2][:2]
            ts = []
            for ax in (0, 1):
                a = -p0[ax] + 3 * p1[ax] - 3 * p2[ax] + p3[ax]
                b = 2 * (p0[ax] - 2 * p1[ax] + p2[ax])
                c = p1[ax] - p0[ax]
                roots = []
                if abs(a) < 1e-12:
                    if abs(b) > 1e-12:
                        roots = [-c / b]
                else:
                    disc = b * b - 4 * a * c
                    if disc >= 0:
                        roots = [(-b + s * math.sqrt(disc)) / (2 * a) for s in (1, -1)]
                ts += [(r, ax) for r in roots if 0.08 < r < 0.92]
            ts.sort()
            seg = [p0, p1, p2, p3]
            done_t = 0.0
            for tt, ax in ts:
                u = (tt - done_t) / (1 - done_t)
                a_, b_, c_, d_ = seg
                ab = _lerp(a_, b_, u)
                bc = _lerp(b_, c_, u)
                cd = _lerp(c_, d_, u)
                abc = _lerp(ab, bc, u)
                bcd = _lerp(bc, cd, u)
                m = _lerp(abc, bcd, u)
                if ax == 0:
                    abc, bcd = (m[0], abc[1]), (m[0], bcd[1])
                else:
                    abc, bcd = (abc[0], m[1]), (bcd[0], m[1])
                out += [(ab[0], ab[1], None, False), (abc[0], abc[1], None, False), (m[0], m[1], "curve", True)]
                seg = [m, bcd, cd, d_]
                done_t = tt
            out += [(seg[1][0], seg[1][1], None, False), (seg[2][0], seg[2][1], None, False), Q[k + 2]]
            k += 3
        else:
            out.append(Q[k])
            k += 1
    return out


def _lerp(a, b, u):
    return (a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u)


SIGNS = None


def is_sign(g):
    """A sign of arms: punctuation or a symbol (not a mark) whose every contour is a dot or arms with at least one
    round end, and nothing straight but end cuts."""
    import unicodedata
    import bold as B
    if not g.contours or g.components or not g.unicodes or B.is_mark(g) or B.mark_kind(g.name):
        return False
    if unicodedata.category(chr(g.unicodes[0]))[:1] not in ("P", "S"):
        return False
    R = B.glyph_contours(g)
    try:
        return read(R, _axis(R)) is not None
    except (ValueError, ZeroDivisionError, IndexError):
        return False


def regular(font):
    """The Regular's signs of arms, each arm drawn once: a contour symmetric about its upright made so from its
    right half; a star (one junction, five arms or more, all round) its upright arm turned. Returns {name: the
    largest ink move, units} (ink compared on a fine raster)."""
    from ufoLib2.objects import Contour, Point
    import bold as B
    done = {}
    for g in font:
        if not is_sign(g):
            continue
        R = B.glyph_contours(g)
        new = []
        for P in R:
            cr = crotches(P)
            if cr and len(_clusters(P, cr)) == 1 and len(cr) >= 5:
                got = star(P, len(cr))
                if got is None:
                    new.append(P)
                    continue
                Q, J = got
                new.append([(round(x), round(y), t, s) for x, y, t, s in Q])
                continue
            if B.is_dot(P):
                new.append(P)
                continue
            if cr:
                groups = _clusters(P, cr)
                c = round(sum(P[i][0] for G in groups for i in G) / len(cr))
            else:
                c = _axis([P])
                if c is None:
                    new.append(P)
                    continue
                c = round(c)
            Q = mirrored_half(P, c)
            new.append(P if Q is None else [(round(x * 2) / 2 if False else x, y, t, s) for x, y, t, s in Q])
        if new == R:
            continue
        before = [list(P) for P in R]
        g.clearContours()
        for P in new:
            cc = Contour()
            cc.points = [Point(x, y, t, smooth=s) for x, y, t, s in P]
            g.contours.append(cc)
        done[g.name] = before
    return done
