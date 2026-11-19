"""Area Serif 0.82 (owner round 8, item 15): the at sign, one construction run in every master.

The owner, on the symbols: "uneven thicks and thins, non smooth curves, and visual/optical imbalance". The @ was
Libre Baskerville's drawing: an italic two-storey-like a drawn into its ring as one contour, so no rule could place or
weight the a. Measured on snap082h (build/owner8/item15/area-before.txt): the ring's top 49 and bottom 51 against
sides 74 (left) and 39 (right) at 400; towards the Bold the a's thinnest place thinned (41 > 35 > 34 at old 675 to
700); towards the Light a place was 0.667 of the Regular where the stem's law is 0.705 and another thicker at 300 than
at 400 (510, 170); the a looked italic and pasted in and the ring's weight changed where it turned into the a.

What the references do (`build/owner8/item15/refo.py`, `refo2.txt`; Georgia Pro, Source Serif 4, Serrif, Literata,
Newsreader, Merriweather, Crimson Pro at 300 / 400 / 700, numbers only). Medians:

- The ring has the letters' vertical stress: thin at top and bottom, at their o's top (ring top / o's top 1.05,
  bottom 1.02 at 400; 1.05 / 1.03 at 300; 0.96 / 1.09 at 700); the left side 0.86 of the stem at 400 (0.69 to 1.09),
  the right side 0.883 of the left (0.55 to 0.98; 0.866 at 300, 0.874 at 700). Every reference; none is even all
  round, none has Area's © ring's horizontal stress. The ring keeps its contrast along the axis (left / top 1.74,
  1.85, 1.74 at 300, 400, 700) and grows as the hairline does (left 0.83 / 1.27, top 0.88 / 1.25 of the 400 at 300 /
  700; Area's hairline 0.86 / 1.23).
- Its box: top 0.985 of the cap height, bottom -0.231 (the same at 300 and 700), width over height 0.941 / 0.968 /
  1.012 at 300 / 400 / 700.
- The inner letter is upright or italic by face; its height 0.545 / 0.558 / 0.597 of the ring's counter, its centre
  0.011 of the ring's height over the ring's; its stem 0.984 / 0.841 / 0.778 of the stem; its top and bottom strokes
  1.18 / 1.21 / 1.26 of the ring's thin; the white right of its stem 1.24 times the white left of its bowl.

The construction. The ring is one stroke from the a's foot: out of the foot (the a's own foot and exit lowest point),
up the right side, over the top, down the left, along the bottom and out to the tail's cut. Its two edges are each
one chain of curves (amp.Chain: handle lengths solved for one curvature at every smooth node, a curve leaving the
stem's straight eases off it). Thickness at its four extremes: top and bottom the master's hairline (o's top); the
left 0.86 of the Regular's stem, the right 0.883 of the left, both carried by the hairline's law into each master; the
tail's cut 0.853 of the hairline (the drawn 36.7 over 43). The a is Area's a.ss03 (upright, single-storey) in this
master, scaled so its height is the references' share of the ring's counter, then its strokes made the references'
weight: level by the stem's share, upright by the inner letter's share of the ring's thin (each node moves along its
own normal, its handles with it). It stands with the white right of its stem 1.24 times the white left of its bowl,
its centre 0.011 of the ring's height over the ring's. One contour: the a's outline from its stem's top round the
bowl to the crotch under it, the ring's outer edge from there, the tail's cut, the ring's inner edge back to the a's
stem, up the stem; the a's counter its own.

In a master the same construction at that master's letters (o's top, the stem, the master's a.ss03) and at the
references' shares for its weight (interpolated on the stem's logarithm between their 300, 400 and 700, which stand at
Area's 55, 78 and 140). The mid master (600) is the construction at the readings that far along.
"""
import math

import amp as A

LIB = "area.at"
CAP = 712.0
TOP = round(0.985 * CAP)            # 701: the references' ring top over the cap height
BOTTOM = round(-0.231 * CAP)        # -164
REG_STEM, REG_H = 78.0, 43.0
LEFT = 0.86 * REG_STEM / REG_H      # ring's left side over the hairline (67.1 at the Regular's 43)
RIGHT = 0.883 * LEFT                # ring's right side (59.2)
CUT = 36.7 / 43.0                   # the tail's cut over the hairline (the drawn tail)
TAIL = (0.0865, 0.1293)             # the tail's outer end: in from the ring's right, up from its bottom (drawn), shares
TAIL_DIR = (107.0, 74.0)            # the tail's direction at its cut (drawn)
WHITE_RL = 1.24                     # white right of the a's stem over white left of its bowl
LIFT = 0.011                        # the a's centre over the ring's, of the ring's height
EVEN_WHITE = True                   # 0.84: the white between the a and the ring one width all round (construct)
RISE = 0.107                        # the ring's right extremes over its centre, of its height (the drawn: 90 over 843),
                                    # so the stroke out of the a's foot climbs as one long turn
# the references' medians at their 300 / 400 / 700, placed at Area's stems 55 / 78 / 140
SHARES = {55.0: {"ah": 0.545, "athin": 1.18, "astem": 0.984, "wh": 0.941},
          78.0: {"ah": 0.558, "athin": 1.21, "astem": 0.841, "wh": 0.968},
          140.0: {"ah": 0.597, "athin": 1.26, "astem": 0.778, "wh": 1.012}}


def shares(stem):
    ks = sorted(SHARES)
    s = min(max(stem, ks[0]), ks[-1])
    for a, b in zip(ks, ks[1:]):
        if a <= s <= b:
            t = math.log(s / a) / math.log(b / a)
            return {k: SHARES[a][k] + (SHARES[b][k] - SHARES[a][k]) * t for k in SHARES[a]}
    return dict(SHARES[ks[-1]])


# ------------------------------------------------------------------ readings
def _pts(g):
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def readings(font):
    """o's top (the hairline) and this master's a.ss03 (its points, stem, height and hairline)."""
    R = A.readings(font)
    a = _pts(font["a.ss03"])
    c0, c1 = a
    stem = c0[0][0] - c1[9][0]                    # the stem's right edge (node 0) less its left (the counter's 9)
    height = c0[5][1] - c0[11][1]                 # the bowl's outer top less its outer bottom
    hair = (c0[5][1] - c1[6][1] + c1[0][1] - c0[11][1]) / 2      # the bowl's top and bottom strokes
    return {"h": R["h"], "stem": stem, "height": height, "hair": hair, "a": a}


def _mix(R0, R1, t):
    out = {k: R0[k] + (R1[k] - R0[k]) * t for k in ("h", "stem", "height", "hair")}
    out["a"] = [[(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2], p[3]) for p, q in zip(P, Q)]
                for P, Q in zip(R0["a"], R1["a"])]
    return out


# ------------------------------------------------------------------ the a: scaled, its strokes made heavier
MITRE = 1.0


def _mitre(ti, to):
    ni, no = (ti[1], -ti[0]), (to[1], -to[0])
    dot = ni[0] * no[0] + ni[1] * no[1]
    m = ((ni[0] + no[0]) / (1 + dot), (ni[1] + no[1]) / (1 + dot)) if dot > -0.9 else ni
    lm = math.hypot(*m)
    convex = ti[0] * to[1] - ti[1] * to[0] > 0       # a left turn with the ink on the left
    if not convex and lm > MITRE:                   # a crotch's cusp: the mitre held to MITRE (uncapped it ran the
        m = (m[0] * MITRE / lm, m[1] * MITRE / lm)  # Bold crotch 40 units down into a bump); a convex corner keeps
    return m                                        # its true mitre, so a straight edge moves parallel


SHORT = 20.0           # a segment shorter than this (a soft corner's curve, a serif's step, a crotch's short line) is
                       # part of one corner: its nodes move together on that corner's mitre, so the corner keeps its
                       # radius (the C's barb corners grew 7 > 20 between masters otherwise) and nothing crosses (R's
                       # leg crotch in (R) crossed itself)


def embolden(cs, dx, dy):
    """Each on-curve node moves along its outward normal (a corner along its mitre) by dx / 2 level and dy / 2 upright
    shares; its handles move with it. UFO winding (ink on the left of travel). Runs of segments under SHORT move
    as one corner."""
    out = []
    for P in cs:
        n = len(P)
        Q = [list(q) for q in P]
        on = [i for i, q in enumerate(P) if q[2]]
        m_ = len(on)

        def tang_in(i):
            a = P[i - 1]
            q = P[i]
            if math.dist(q[:2], a[:2]) < 1e-6:
                a = P[i - 2]
            return A.unit((q[0] - a[0], q[1] - a[1]))

        def tang_out(i):
            b = P[(i + 1) % n]
            q = P[i]
            if math.dist(q[:2], b[:2]) < 1e-6:
                b = P[(i + 2) % n]
            return A.unit((b[0] - q[0], b[1] - q[1]))
        # groups of nodes joined by short segments
        short = [math.dist(P[on[k]][:2], P[on[(k + 1) % m_]][:2]) < SHORT for k in range(m_)]
        group = list(range(m_))
        for k in range(m_):
            if short[k]:
                g0, g1 = group[k], group[(k + 1) % m_]
                if g0 != g1:
                    group = [g0 if g == g1 else g for g in group]
        delta = {}
        for gid in set(group):
            ks = [k for k in range(m_) if group[k] == gid]
            if len(ks) == m_:
                ks = ks[:1]
            # the run's first node is the one whose previous segment is not short
            first = next((k for k in ks if not short[(k - 1) % m_]), ks[0])
            last = next((k for k in ks if not short[k]), ks[-1])
            ti_, to_ = tang_in(on[first]), tang_out(on[last])
            # the run's turning, summed along its points (two opposite edges, as a serif's end, cross to 0)
            order_ = [first]
            while order_[-1] != last and len(order_) <= m_:
                order_.append((order_[-1] + 1) % m_)
            i_a, i_b = on[order_[0]], on[order_[-1]]
            idx_ = list(range(i_a - 1, i_a + ((i_b - i_a) % n) + 2))
            pl_ = [P[j % n][:2] for j in idx_]
            turn_ = 0.0
            for j in range(1, len(pl_) - 1):
                a_ = (pl_[j][0] - pl_[j - 1][0], pl_[j][1] - pl_[j - 1][1])
                b_ = (pl_[j + 1][0] - pl_[j][0], pl_[j + 1][1] - pl_[j][1])
                if math.hypot(*a_) > 1e-6 and math.hypot(*b_) > 1e-6:
                    turn_ += math.atan2(a_[0] * b_[1] - a_[1] * b_[0], a_[0] * b_[0] + a_[1] * b_[1])
            convex_u = turn_ > math.radians(120)
            if len(ks) == 1:
                m = _mitre(tang_in(on[ks[0]]), tang_out(on[ks[0]]))
                delta[on[ks[0]]] = (m[0] * dx / 2, m[1] * dy / 2)
                continue
            if convex_u:                                # a stroke's end (a serif's end, turning back outward): two
                order = [first]                         # corners, split at the run's longest segment (the end's cut),
                while order[-1] != last:                # each on its own mitre
                    order.append((order[-1] + 1) % m_)
                segl = [math.dist(P[on[order[j]]][:2], P[on[order[j + 1]]][:2]) for j in range(len(order) - 1)]
                cut = max(range(len(segl)), key=lambda j: segl[j]) if segl else 0
                for part in (order[:cut + 1], order[cut + 1:]):
                    if not part:
                        continue
                    m = _mitre(tang_in(on[part[0]]), tang_out(on[part[-1]]))
                    for k in part:
                        delta[on[k]] = (m[0] * dx / 2, m[1] * dy / 2)
                continue
            m = _mitre(ti_, to_)
            for k in ks:
                delta[on[k]] = (m[0] * dx / 2, m[1] * dy / 2)
        for i in on:
            d = delta[i]
            Q[i][0] += d[0]
            Q[i][1] += d[1]
            for j in (i - 1, (i + 1) % n):          # its handles (an off-curve point next to it)
                if not P[j][2]:
                    Q[j][0] += d[0]
                    Q[j][1] += d[1]
        # each curve's handles keep their share of the curve's run (level and upright apart), as a part made longer
        # keeps its pieces (charset.restretch_x): moved with their nodes alone, the a's foot turned boxy (0.74 > 0.87)
        for i, q in enumerate(P):
            if q[2] != "curve" or P[(i - 1) % n][2] is not None or P[(i - 2) % n][2] is not None:
                continue
            a0, b0 = P[(i - 3) % n], q
            a1, b1 = Q[(i - 3) % n], Q[i]
            for j in ((i - 2) % n, (i - 1) % n):
                for k in (0, 1):
                    run0, run1 = b0[k] - a0[k], b1[k] - a1[k]
                    if abs(run0) > 1:
                        Q[j][k] = a1[k] + (P[j][k] - a0[k]) * run1 / run0
        out.append([tuple(q) for q in Q])
    return out


# ------------------------------------------------------------------ the ring's handles
OUT_T, IN_T = 0.57, 0.61            # the bowl's tensions (SKILL: Bowl), the ring's outside and inside


class Ring(A.Chain):
    """A chain whose handles keep the bowl's tension where nothing asks otherwise: least squares on each handle's
    share of its reach, near `tension`; across a smooth node the curvature differs by at most 1.2 (curvecheck's 1.25,
    less a margin); a curve leaving a straight eases off it (at most 0.30 of its mean); no flat place, no inflection."""

    def __init__(self, nodes, kinds, smooth, tension):
        super().__init__(nodes, kinds, smooth)
        self.tension = tension

    def solve(self):
        import numpy as np
        from scipy.optimize import least_squares
        idx = [i for i, k in enumerate(self.kinds) if k == "C"]
        reach = {i: self._reach(i) for i in idx}
        lt = math.log(self.tension)

        def put(x):
            for j, i in enumerate(idx):
                a, b = reach[i]
                self.lens[i] = [a * math.exp(x[2 * j]), b * math.exp(x[2 * j + 1])]

        def res(x):
            put(x)
            S = self.segs()
            out = []
            for j, i in enumerate(idx):
                out += [0.5 * (x[2 * j] - lt), 0.5 * (x[2 * j + 1] - lt)]
                s = S[i]
                dx_, dy_ = s[3][0] - s[0][0], s[3][1] - s[0][1]          # a quarter: evaluate.py's limits on
                if abs(dx_) > 30 and abs(dy_) > 30:                     # each handle's share of its run
                    r0 = abs(s[1][0] - s[0][0]) / abs(dx_) if abs(s[1][1] - s[0][1]) < 1e-6 else abs(s[1][1] - s[0][1]) / abs(dy_)
                    r3 = abs(s[2][0] - s[3][0]) / abs(dx_) if abs(s[2][1] - s[3][1]) < 1e-6 else abs(s[2][1] - s[3][1]) / abs(dy_)
                    out += [10 * max(0.0, 0.33 - min(r0, r3)), 10 * max(0.0, max(r0, r3) - 0.77),
                            30 * max(0.0, max(r0, r3) / max(min(r0, r3), 1e-6) - 1.5)]
                ks = [A.curvature(s, t / 16) for t in range(17)]
                pos, neg = max(ks), min(ks)
                top_ = max(abs(pos), abs(neg)) or 1e-9
                out.append(30 * min(max(pos, 0), max(-neg, 0)) / top_)
                ak = [abs(k) for k in ks]
                dip = max(min(max(ak[:m + 1]), max(ak[m:])) - ak[m] for m in range(17)) / top_
                out.append(20 * max(0.0, dip - 0.04))
            for n in range(1, len(self.nodes) - 1):
                if not self.smooth[n]:
                    continue
                ka, kb = self.kinds[n - 1], self.kinds[n]
                ka, kb = ("C" if ka == "F" else ka), ("C" if kb == "F" else kb)     # a fixed curve is a curve
                if ka == "C" and kb == "C":
                    k1, k2 = A.curvature(S[n - 1], 1.0), A.curvature(S[n], 0.0)
                    out.append(8 * max(0.0, abs(math.log((abs(k1) + 1e-6) / (abs(k2) + 1e-6))) - math.log(1.2)))
                elif ka != kb and (self.kinds[n - 1] != "F" and self.kinds[n] != "F"):
                    s, at = (S[n], 0.0) if kb == "C" else (S[n - 1], 1.0)
                    u0 = A.unit((s[1][0] - s[0][0], s[1][1] - s[0][1]))
                    u1 = A.unit((s[3][0] - s[2][0], s[3][1] - s[2][1]))
                    turn = math.acos(max(-1, min(1, u0[0] * u1[0] + u0[1] * u1[1])))
                    L = sum(math.dist(A.bez(s, t / 24), A.bez(s, (t + 1) / 24)) for t in range(24))
                    out.append(10 * max(0.0, abs(A.curvature(s, at)) / (turn / L + 1e-9) - 0.30))
            return np.array(out)
        x0 = np.array([lt] * (2 * len(idx)))
        r = least_squares(res, x0, bounds=(math.log(0.22), math.log(0.95)), method="trf", diff_step=1e-4,
                          xtol=1e-10, ftol=1e-10, max_nfev=4000)
        put(r.x)
        self.cost = float(np.sum(r.fun ** 2))
        return self.cost


# ------------------------------------------------------------------ the construction
def construct(R):
    """R: readings (this master's, or mixed). Returns ([outer segments, counter points], info)."""
    sh = shares(R["stem"])
    h = R["h"]
    H = TOP - BOTTOM
    tl, tr, tt, tb = LEFT * h, RIGHT * h, h, h
    # the a: height the references' share of the ring's counter, strokes their weights
    ah = sh["ah"] * (H - tt - tb)
    athin = sh["athin"] * h
    k = (ah - athin) / (R["height"] - R["hair"])
    dy = athin - k * R["hair"]
    dx = sh["astem"] * R["stem"] - k * R["stem"]
    a = [[(q[0] * k, q[1] * k) + tuple(q[2:]) for q in P] for P in R["a"]]
    a = embolden(a, dx, dy)
    c0 = a[0]
    a_w = c0[0][0] - c0[8][0]                    # bowl's left extreme to the stem's right edge
    if EVEN_WHITE:
        # 0.84 (Regular pass 2, item 3; the owner: the right side "comes out too much ... it can be flatter"): the white
        # between the a and the ring the same all round: each side's white the white over and under the a (the ring's
        # counter less the a's height, halved), so the ring's width follows from the a's (it was the references' 0.968
        # of the height, with the white right of the stem 1.24 of the left: the right stood 245 per mille of the
        # height off the a at 20 to 30 degrees, the top 189)
        white = ((H - tt - tb) - ah) / 2
        Wd = tl + white + a_w + white + tr
        right_white = white
    else:
        Wd = sh["wh"] * H
        white = (Wd - tr - tl - a_w) / (1 + WHITE_RL)
        right_white = white * WHITE_RL
    cx, cy = Wd / 2, (TOP + BOTTOM) / 2
    left_in = tl
    ox = left_in + white - c0[8][0]
    oy = cy + LIFT * H - (c0[5][1] + c0[11][1]) / 2
    a = [[(q[0] + ox, q[1] + oy) + tuple(q[2:]) for q in P] for P in a]
    c0, c1 = a
    pt = lambda i: (c0[i][0], c0[i][1])                                    # noqa: E731
    D, U, L, Rt = (0.0, -1.0), (0.0, 1.0), (-1.0, 0.0), (1.0, 0.0)
    # the ring's places
    ry = cy + RISE * H
    Po = {"r": (Wd, ry), "t": (cx, TOP), "l": (0.0, cy), "b": (cx, BOTTOM)}
    Pi = {"r": (Wd - tr, ry), "t": (cx, TOP - tt), "l": (tl, cy), "b": (cx, BOTTOM + tb)}
    td = A.unit(TAIL_DIR)
    T1 = (Wd * (1 - TAIL[0]), BOTTOM + TAIL[1] * H)
    nt = (-td[1], td[0])
    T2 = (T1[0] + nt[0] * CUT * h, T1[1] + nt[1] * CUT * h)
    d14 = A.unit((c0[15][0] - c0[14][0], c0[15][1] - c0[14][1]))
    # the a's foot (crotch to the foot's lowest point, the stem's edge to the exit's lowest point) keeps the a's own
    # curves (kind "F"); the ring is solved on from them
    P = Ring([(pt(14), d14), (pt(17), Rt), (Po["r"], U), (Po["t"], L), (Po["l"], D), (Po["b"], Rt), (T1, td)],
             ["F"] + ["C"] * 5, [False, True, True, True, True, True, False], OUT_T)
    Q = Ring([(pt(0), D), (pt(27), D), (pt(24), Rt), (Pi["r"], U), (Pi["t"], L), (Pi["l"], D), (Pi["b"], Rt), (T2, td)],
             ["L", "F"] + ["C"] * 5, [False, True, True, True, True, True, True, False], IN_T)
    P.lens[0] = [math.dist(pt(14), pt(15)), math.dist(pt(17), pt(16))]
    Q.lens[1] = [math.dist(pt(27), pt(26)), math.dist(pt(24), pt(25))]
    P.solve()
    Q.solve()
    sP, sQ = P.segs(), Q.segs()
    outer = []
    # the a: stem's top, the spur, the bowl, round to the crotch under it (its own points)
    i = 0
    while i < 14:
        if c0[i + 1][2] is None:
            outer.append(("C", (pt(i), pt(i + 1), pt(i + 2), pt(i + 3))))
            i += 3
        else:
            outer.append(("L", (pt(i), pt(i), pt(i + 1), pt(i + 1))))
            i += 1
    outer += [("C", s) for s in sP]
    outer.append(("L", (T1, T1, T2, T2)))
    for kind, s in reversed(list(zip(Q.kinds, sQ))):
        outer.append(("L" if kind == "L" else "C", (s[3], s[2], s[1], s[0])))
    # the a's two crotches (the spur's into the bowl's top, the bowl's bottom into the foot) rounded: each a fillet of
    # FILLET the a's stem (owner, 17 November: "the a in the @ looks much sharper / not as smooth at thicker weights";
    # at 800 the made-heavier a's crotches read as a notch and a pinch). Bottom first, so the top's index holds
    r_f = FILLET * sh["astem"] * R["stem"]
    outer = fillet(outer, 5, r_f)
    outer = fillet(outer, 1, r_f)
    info = {"k": k, "dx": dx, "dy": dy, "width": Wd, "ring": (tl, tr, tt, tb), "a_stem": sh["astem"] * R["stem"],
            "a_thin": athin, "a_h": ah, "white": (white, right_white), "shares": sh}
    return outer, c1, info


FILLET = 0.30          # a crotch's fillet in the @'s a, of the a's stem (looked at at 800: 0.20 left a notch; 0.45 ran the bottom one into a wave, curvecheck 2.03)


def _cut(seg, r, at_end):
    """A cubic cut back by arc length r from its end (at_end) or start: (the kept part, the cut point, the unit tangent
    at the cut, pointing along the curve's direction)."""
    N = 400
    pts = [A.bez(seg, k / N) for k in range(N + 1)]
    run = 0.0
    rng = range(N, 0, -1) if at_end else range(N)
    for k in rng:
        a, b = (pts[k], pts[k - 1]) if at_end else (pts[k], pts[k + 1])
        run += math.dist(a, b)
        if run >= r:
            t = (k - 1) / N if at_end else (k + 1) / N
            break
    else:
        t = 0.0 if at_end else 1.0
    kept = A.sub(seg, 0.0, t) if at_end else A.sub(seg, t, 1.0)
    e = 1e-4
    p0, p1 = A.bez(seg, max(0.0, t - e)), A.bez(seg, min(1.0, t + e))
    return kept, A.bez(seg, t), A.unit((p1[0] - p0[0], p1[1] - p0[1]))


def fillet(outer, k, r):
    """The corner between outer[k] and outer[k + 1] rounded: both cut back by r along themselves and joined by one
    cubic along their tangents, each handle 0.55 of the chord (a quarter's tension where the two tangents turn by
    about 90 degrees; less turn, the same share of a shorter chord)."""
    (ka, sa), (kb, sb) = outer[k], outer[k + 1]
    a_kept, pa, ta = _cut(sa, r, True)
    b_kept, pb, tb = _cut(sb, r, False)
    ch = math.dist(pa, pb)
    f = (pa, (pa[0] + ta[0] * 0.55 * ch, pa[1] + ta[1] * 0.55 * ch), (pb[0] - tb[0] * 0.55 * ch, pb[1] - tb[1] * 0.55 * ch), pb)
    if ka == "L":
        a_kept = (sa[0], sa[0], pa, pa)
    if kb == "L":
        b_kept = (pb, pb, sb[3], sb[3])
    return outer[:k] + [(ka, a_kept), ("C", f), (kb, b_kept)] + outer[k + 2:]


def outline(R):
    outer, counter, info = construct(R)
    P = A.to_points(outer)
    if A.signed_area(P) < 0:
        P = A._reverse(P)
    C = [[round(q[0]), round(q[1]), q[2], q[3]] for q in counter]
    if A.signed_area(C) > 0:
        C = A._reverse(C)
    cs = [P, [tuple(q) for q in C]]
    return even(cs), info


def even(cs):
    """Every smooth node at one curvature (loops.even_nodes: handle lengths only, nodes and tangents kept), where it
    leaves fewer curvecheck faults on the whole glyph: the a's bowl carries a.ss03's own jumps (1.65 at the Light's
    counter top), and the made-heavier a moves its handles with their nodes."""
    import curvecheck as K
    import loops as L
    yr = (-1000, 2000)
    b0, w0 = K.report("at", cs, yr)[:2]
    new = [[(round(q[0]), round(q[1]), q[2], q[3]) for q in L.even_nodes(P, yr)[0]] for P in cs]
    b1, w1 = K.report("at", new, yr)[:2]
    if (len(b1), w1) < (len(b0), w0) and len(arc_flags(new)) <= len(arc_flags(cs)):
        return new
    return cs


def arc_flags(cs):
    """evaluate.py's quarter-arc reading: a quarter (one handle level, the other upright, over 30 units each way) with a
    handle under 0.30 or over 0.80 of its run (pinched or boxy), or one handle over 1.6 times the other's share."""
    out = []
    for ci, P in enumerate(cs):
        n = len(P)
        for i, q in enumerate(P):
            if q[2] != "curve":
                continue
            p0, p1, p2, p3 = P[(i - 3) % n], P[(i - 2) % n], P[(i - 1) % n], q
            dx, dy = p3[0] - p0[0], p3[1] - p0[1]
            up0, lv0 = abs(p1[0] - p0[0]) < 1, abs(p1[1] - p0[1]) < 1
            up3, lv3 = abs(p2[0] - p3[0]) < 1, abs(p2[1] - p3[1]) < 1
            if abs(dx) > 30 and abs(dy) > 30 and ((up0 and lv3) or (lv0 and up3)):
                r0 = abs(p1[1] - p0[1]) / abs(dy) if up0 else abs(p1[0] - p0[0]) / abs(dx)
                r3 = abs(p2[0] - p3[0]) / abs(dx) if lv3 else abs(p2[1] - p3[1]) / abs(dy)
                if min(r0, r3) < 0.30 or max(r0, r3) > 0.80 or max(r0, r3) / max(min(r0, r3), 1e-6) > 1.6:
                    out.append((ci, i, round(r0, 2), round(r3, 2)))
    return out


def regular(font, name="at"):
    """The Regular's @ from the construction at the Regular's letters; its side bearings kept."""
    if name not in font or "a.ss03" not in font:
        return f"{name}: not built"
    g = font[name]
    xs = [p.x for c in g.contours for p in c.points]
    lsb, rsb = min(xs), g.width - max(xs)
    cs, info = outline(readings(font))
    nx = [q[0] for P in cs for q in P]
    dx = round(lsb - min(nx))
    cs = [[(x + dx, y, t, sm) for x, y, t, sm in P] for P in cs]
    A._put(g, cs)
    g.width = round(max(nx) + dx + rsb)
    g.lib[LIB] = {"version": 1}
    return f"{name}: built (advance {g.width}; " + note(info) + ")"


def note(info):
    tl, tr, tt, tb = info["ring"]
    return (f"ring left {tl:.0f} right {tr:.0f} top {tt:.0f} bottom {tb:.0f}, width {info['width']:.0f}; a x{info['k']:.3f}"
            f" stem {info['a_stem']:.0f} thin {info['a_thin']:.0f} height {info['a_h']:.0f} (+{info['dx']:.1f} level,"
            f" +{info['dy']:.1f} upright), white {info['white'][0]:.0f} / {info['white'][1]:.0f}")


def master(reg, font, sides, tm=None, layer=None, name="at"):
    """A master's @: the construction at this master's readings; sides(reg_contours, new_contours) -> (shift, width).
    With a mid layer and tm, the mid master's @ is the construction at the readings that far along."""
    if name not in reg or LIB not in reg[name].lib or name not in font or "a.ss03" not in font:
        return None
    R0, R = readings(reg), readings(font)
    cs, info = outline(R)
    R_c = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in reg[name].contours]
    if [[q[2] for q in P] for P in cs] != [[q[2] for q in P] for P in R_c]:
        raise ValueError(f"{name}: the master's construction does not match the Regular's points: "
                         f"{[len(P) for P in cs]} against {[len(P) for P in R_c]}")
    shift, width = sides(R_c, cs)
    cs = [[(x + shift, y, t, sm) for x, y, t, sm in P] for P in cs]
    A._put(font[name], cs)
    font[name].width = width
    out = f"{name}: construction, " + note(info)
    if layer is not None and tm is not None:
        cm, _ = outline(_mix(R0, R, tm))
        if [[q[2] for q in P] for P in cm] != [[q[2] for q in P] for P in cs]:
            raise ValueError(f"{name}: the mid master's construction does not match")
        x0 = min(q[0] for P in R_c for q in P)
        x1 = min(q[0] for P in cs for q in P)
        dxm = round(x0 + (x1 - x0) * tm - min(q[0] for P in cm for q in P))
        cm = [[(x + dxm, y, t, sm) for x, y, t, sm in P] for P in cm]
        if name not in layer:
            layer.newGlyph(name)
        A._put(layer[name], cm)
        layer[name].width = round(reg[name].width + (width - reg[name].width) * tm)
        out += f"; mid master at {tm:.3f}"
    return out
