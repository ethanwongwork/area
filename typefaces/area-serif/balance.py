"""The 0.58 audit's fixes (owner: "a deep serif thickness, roundness and height/width audit ... make sure the thicks
and thins promote good optical ink balance"). Evidence: docs/research/serif-typeface-2026-11-10/audit-0.58.md, tools
in tools/joins/ (audit_serifs.py, audit_thin.py, audit_area.py, audit_ink.py). Every rule reads the finished outline
by geometry and runs with joins.py, after lightening and before spacing. One value per part:

  heights   a flat top sits on its line, a round one on its overshoot; no glyph 1-9 units off its class
  bars      f's and t's bars are one bar (both references); F's top arm is E's; z's and Z's two arms are equal
  diagonals no thin diagonal under 0.50 stems (the face's own floor); thick ones within 2% of their class
  arcs      one thin value on the figures (47 units, the capitals'); g's loop no heavier below than the references' ratio
  stems     t's stem 79 (81), the 5's bowl 92 like every figure (94)
"""
import math

import clean
import joins
from normalize import _diag_edges

X, CAP = 520, 712


def _pts(g):
    return [p for c in g.contours for p in c.points]


def snap(g, old, new, where=lambda p: True):
    """Every point at height `old` (a flat edge, or an extreme with its level handles) goes to `new`."""
    n = 0
    for p in _pts(g):
        if p.y == old and where(p):
            p.y = new
            n += 1
    return n


def heights(font):
    done = []
    for name, old, new in (("b", -11, -10), ("s", 529, 530), ("v", -11, -10), ("J", -8, -9), ("two", 722, 721),
                           ("f", 777, 780)):
        k = snap(font[name], old, new)
        done.append(f"{name} {old}>{new} ({k})")
    # A's apex and the 4's top are flat: they sit on the cap line, their corners staying on the strokes' edges
    for name, old, new in (("A", 710, CAP), ("four", 721, CAP)):
        g = font[name]
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i, p in enumerate(P):
                if p.y != old or not p.type:
                    continue
                for q in (P[i - 1], P[(i + 1) % n]):         # the neighbour down the stroke's edge
                    if q.type and q.y < old - 40 and abs(q.x - p.x) > 2:
                        p.x = round(p.x + (new - old) * (p.x - q.x) / (p.y - q.y))
                p.y = new
        done.append(f"{name} {old}>{new}")
    # the 1 is as tall as the 0 (both references; it stood 9 units over)
    g = font["one"]
    top = max(_pts(g), key=lambda p: p.y)
    zero = max(p.y for p in _pts(font["zero"]))
    if top.type and top.y > zero:
        P = g.contours[0].points
        i, n, d = P.index(top), len(P), top.y - zero
        for q, share in ((P[(i + 1) % n], 2 / 3), (P[(i + 2) % n], 1 / 3)) if P[(i + 1) % n].type is None else \
                ((P[i - 1], 2 / 3), (P[i - 2], 1 / 3)):
            q.y -= round(d * share)                          # the flag's curve eases down with it
        top.y = zero
        done.append(f"one top -{d}")
    return done


def bars(font):
    done = []
    # t's bar becomes f's: the same underside and top (0.900 and 1.000 of the x-height, both references' way)
    f, t = font["f"], font["t"]
    fb = sorted({p.y for p in _pts(f) if p.type == "line" and 440 < p.y < 540 and p.x > 300} | {468, 520})
    lo_f, hi_f = 468, 520
    ys = sorted({p.y for p in _pts(t) if p.type and 455 < p.y < 525})
    lo_t, hi_t = ys[0], ys[-1]
    for p in _pts(t):
        if lo_t - 1 <= p.y <= hi_t + 1:
            p.y += (hi_f - hi_t) if p.y > (lo_t + hi_t) / 2 else (lo_f - lo_t)
    done.append(f"t bar {lo_t}-{hi_t} > {lo_f}-{hi_f}")
    # F's top arm is E's
    E, F = font["E"], font["F"]
    under = lambda g: max(p.y for p in _pts(g) if p.type == "line" and 600 < p.y < 700 and 300 < p.x < 480)
    d = under(E) - under(F)
    if d:
        uf = under(F)
        for p in _pts(F):
            if uf - 12 <= p.y <= uf and p.x < 520:
                p.y += d
        done.append(f"F top arm underside +{d}")
    # z and Z: the lower arm as thick as the upper one; its end on the diagonal slides along the diagonal's edge
    for name, top_line in (("z", X), ("Z", CAP)):
        g = font[name]
        P, n = g.contours[0].points, len(g.contours[0].points)
        upper = top_line - max(p.y for p in P if p.type == "line" and top_line - 60 < p.y < top_line - 30)
        cand = [p for p in P if p.type and 35 < p.y < 62]
        yb = max(p.y for p in cand)
        d = yb - upper
        if 0 < d <= 8:
            for i, p in enumerate(P):
                if p.y != yb:
                    continue
                for q in (P[i - 1], P[(i + 1) % n]):
                    if q.type and q.y > yb + 200:            # the diagonal's edge: slide along it
                        p.x = round(p.x - d * (q.x - p.x) / (q.y - p.y))
                p.y = upper
            done.append(f"{name} lower arm {yb}>{upper}")
    # z's upper beak: its cut leaned (6 units over 12) and was 26 wide; the lower one is level and 32. Level, 30 wide.
    g = font["z"]
    P, n = g.contours[0].points, len(g.contours[0].points)
    x0 = min(p.x for p in P if 370 <= p.y <= 402)
    band = [i for i, p in enumerate(P) if 370 <= p.y <= 402 and p.x < x0 + 40]
    if len(band) == 8 and band == list(range(band[0], band[0] + 8)):
        i = band[0]
        face, top = P[i], P[i - 1]                           # the outer face runs down from `top` to `face`
        lean = (top.x - face.x) / (top.y - face.y)
        cut = min(P[k].y for k in band)                      # the cut's lowest point becomes its level
        xc = face.x + lean * (cut - face.y)                  # the outer corner, on the face's line
        xi = round(xc) + joins.END_MIN                       # the inner corner
        new = [(xc + lean * 7, cut + 7), (xc + lean * 3, cut + 3), (xc + 3, cut), (xc + 7, cut),
               (xi - 7, cut), (xi - 3, cut), (xi, cut + 3), (xi, cut + 7)]
        dT = (new[7][0] - P[i + 7].x, new[7][1] - P[i + 7].y)
        for k, (x, y) in enumerate(new):
            P[i + k].x, P[i + k].y = round(x), round(y)
        h = P[(i + 8) % n]                                   # the flare's handle at the beak follows its node
        h.x, h.y = round(h.x + dT[0]), round(h.y + dT[1])
        done.append(f"z upper beak level at {cut}, {joins.END_MIN} wide")
    else:
        done.append("z upper beak: not found")
    return done


def diag(g, sign, target, y_at):
    """Sets the perpendicular width of every straight stroke leaning one way (sign +1: leans right going up) to
    `target`, each stroke by its own slope. normalize.set_diagonal_widths with a per-stroke width: both edges move by
    half the difference, with the nodes on them and those nodes' handles; a node on two moved edges goes to where
    they meet. Returns the widths before and after."""
    lines = _diag_edges(g)
    group = sorted((L for L in lines if (L[3] > 0) == (sign > 0)), key=lambda L: L[3] * y_at + L[4])
    edges = []                                               # segments on one line (split by a crossing) are one edge
    for L in group:
        x = L[3] * y_at + L[4]
        if edges and abs(edges[-1][0][3] - L[3]) < 0.08 and abs(edges[-1][0][3] * y_at + edges[-1][0][4] - x) < 10:
            edges[-1].append(L)
        else:
            edges.append([L])
    if not edges or len(edges) % 2:
        return None
    shifts, before, after = {}, [], []
    for left, right in zip(edges[::2], edges[1::2]):
        m = sum(L[3] for L in left + right) / len(left + right)
        k = math.sqrt(1 + m * m)
        xl = sum(L[3] * y_at + L[4] for L in left) / len(left)
        xr = sum(L[3] * y_at + L[4] for L in right) / len(right)
        before.append(round((xr - xl) / k, 1))
        d = ((xr - xl) - target * k) / 2
        after.append(target)
        for side, dd in ((left, d), (right, -d)):
            for L in side:
                L.append(dd)
                shifts.setdefault((L[0], L[1]), []).append(L)
                shifts.setdefault((L[0], L[2]), []).append(L)
    for (ci, pi), ls in shifts.items():
        P, n = g.contours[ci].points, len(g.contours[ci].points)
        p = P[pi]
        if len(ls) == 1 or abs(ls[0][3] - ls[1][3]) < 1e-6:
            L = ls[0]
            other = [k for k in ((pi - 1) % n, (pi + 1) % n) if k not in (L[1], L[2])]
            q = P[other[0]] if other else None
            straight = q is not None and q.type and (p.type == "line" if other[0] == (pi - 1) % n else q.type == "line")
            ux, uy = (q.x - p.x, q.y - p.y) if straight else (0, 0)
            den = ux - L[3] * uy
            if straight and math.hypot(ux, uy) > 30 and abs(den) > 1e-6 and abs(uy) > 0.2 * abs(ux):
                # the node's other edge is a straight stroke edge that does not move: slide along it, so that
                # stroke keeps its width (a sideways shift would turn it)
                t = (L[3] * p.y + L[4] + L[5] - p.x) / den
                p.x, p.y = p.x + t * ux, p.y + t * uy
            else:
                dx = L[5]
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
    return before, after


THIN_LOW = 39          # lowercase thin diagonals: 0.50 of n's stem, the floor the guidelines set for any thin stroke
                       # (34-36 before). Not the arcs' 43: v x y already carry 4-9% more ink than their class
THIN_CAP_DIAG = 48     # capital thin diagonals: 0.56 of H's stem, the value M's and K's already held (A V W X Y were
                       # 0.42-0.49, lighter than every other thin stroke of the capitals, and X V K read light)
DIAGS = [   # glyph, direction (+1 leans right going up), target perpendicular width, height the width is set at
    ("v", 1, THIN_LOW, 260), ("w", 1, THIN_LOW, 260), ("x", 1, THIN_LOW, 260), ("y", 1, THIN_LOW, 260),
    ("w", -1, 73, 260),                    # w's thick strokes after widen_w: v's, x's and y's 0.94 stems (w's were 1.00)
    ("A", 1, THIN_CAP_DIAG, 356), ("V", 1, THIN_CAP_DIAG, 356), ("W", 1, THIN_CAP_DIAG, 356),
    ("X", 1, THIN_CAP_DIAG, 356), ("Y", 1, THIN_CAP_DIAG, 520),
    ("z", 1, 76, 260),                     # 1.07 stems: both references 0.94; 0.97
    ("four", 1, 43, 450),                  # the 4's diagonal: 0.43 H stems, under the floor
    ("K", -1, 84, 180),                    # the leg: 0.90 H stems against X's 0.94-0.98 and both references' 0.98
    ("Y", -1, 87, 520),                    # the thick arm: 1.06; V's and both references' 1.01
]


def diagonals(font):
    done = []
    for name, sign, target, y in DIAGS:
        r = diag(font[name], sign, target, y)
        done.append(f"{name}{'+' if sign > 0 else '-'} {r[0]}>{r[1]}" if r else f"{name}: no stroke found")
    return done


CAP_THIN = 47                  # clean.THIN_CAP after lightening
FIG_THIN = 47                  # 0.55 of H's stem, the capitals' and the lowercase's share
ARCS = [("zero", "top", (25, 75)), ("zero", "bottom", (25, 75)), ("two", "top", (25, 75)), ("three", "top", (30, 75)),
        ("three", "bottom", (25, 70)), ("five", "bottom", (25, 75)), ("six", "bottom", (25, 75)),
        ("eight", "top", (25, 75)), ("eight", "bottom", (25, 75)), ("nine", "top", (25, 75))]


def arc_thin(g, side, target, span):
    """clean.thin_floor's move, to a target in units: the counter's level extreme at the thin spot moves, never the
    outside."""
    for _ in range(3):
        t = clean._thin(g, side, span)
        if t is None:
            return None
        d = target - t[0]
        if abs(d) < 0.75:
            break
        cand = None
        for c in g.contours:
            P, n = c.points, len(c.points)
            for i, p in enumerate(P):
                if not p.type:
                    continue
                hs = [P[(i - 1) % n], P[(i + 1) % n]]
                if any(h.type for h in hs) or any(abs(h.y - p.y) > 0.5 for h in hs):
                    continue
                dist = math.hypot(p.x - t[1], p.y - t[2])
                if abs(p.y - t[2]) < 25 and dist < 130 and (cand is None or dist < cand[0]):
                    cand = (dist, p, hs)
        if cand is None:
            return None
        for q in [cand[1]] + cand[2]:
            q.y += round(d) * (-1 if side == "top" else 1)
    return round(clean._thin(g, side, span)[0])


def arcs(font):
    done = []
    for name, side, span in ARCS:
        was = clean._thin(font[name], side, span)
        now = arc_thin(font[name], side, FIG_THIN, span)
        done.append(f"{name} {side} {round(was[0]) if was else '?'}>{now}")
    # D B P R: the counter's top runs level from the stem, so there is no extreme to move: the level edge moves.
    # They held 49 to 51 under the top; the capitals' thin is CAP_THIN. B's lower bowl was 45 at the baseline.
    for name in "DBPR":
        g = font[name]
        top = max(p.y for p in _pts(g))
        inner = max(g.contours[1:], key=lambda c: max(p.y for p in c.points))
        y = max(p.y for p in inner.points)
        d = (top - CAP_THIN) - y
        if d and abs(d) <= 6:
            for p in inner.points:
                if y - 13 <= p.y <= y:
                    p.y += d
            done.append(f"{name} top {top - y}>{CAP_THIN}")
    low = min(font["B"].contours[1:], key=lambda c: min(p.y for p in c.points))
    y = min(p.y for p in low.points)
    if 0 < CAP_THIN - y <= 4:
        for p in low.points:
            if p.y == y:
                p.y = CAP_THIN
        done.append(f"B bottom {y}>{CAP_THIN}")
    return done


def stems(font):
    done = []
    g = font["t"]                                            # t's stem: 81 against n's 78; both references 1.01-1.02
    from normalize import flatten, spans_at
    left, right = spans_at(flatten(g), 300)[0]
    left, right = round(left), round(right)
    over = (right - left) - 79
    if 0 < over <= 4:
        for p in _pts(g):
            if abs(p.x - right) <= 1 and p.y > 60:
                p.x -= over
        done.append(f"t stem {right - left}>{right - left - over}")
    g = font["five"]                                         # the 5's bowl: 94 across at its widest; every figure 92
    P = g.contours[0].points
    n = len(P)
    for i, p in enumerate(P):
        a, b = P[i - 1], P[(i + 1) % n]
        if p.type and a.type is None and b.type is None and abs(a.x - p.x) <= 1 and abs(b.x - p.x) <= 1 \
                and 380 < p.x < 440 and 180 < p.y < 330:
            for q in (p, a, b):
                q.x += 2
            done.append("5 bowl inner +2")
    return done


def desc_feet(font):
    """Runs last of all, on the spaced outline: a later pass shortens q's foot by 2, and the descender foot is outside
    the zone spacing reads, so the fit does not change. q's descender stem is 81 wide at this point and 78 before
    that pass, so its width is set here too."""
    done = even_stems(font, "q")
    for name in "pq":                                       # the bowl-side descender foot: p 80, q 78; both 79
        g = font[name]
        low = min(p.y for p in _pts(g))
        for c in g.contours:
            P = c.points
            for kind, i0, h1, h2, i3 in joins.segs(c):
                if kind != "curve":
                    continue
                for stem, hs, serif, hf in ((P[i0], P[h1], P[i3], P[h2]), (P[i3], P[h2], P[i0], P[h1])):
                    dx = abs(serif.x - stem.x)
                    if abs(hs.x - stem.x) > 0.5 or abs(hf.y - serif.y) > 0.5 or not (72 <= dx <= 88) \
                            or abs(serif.y - low - joins.TIP) > 3:
                        continue
                    side = 1 if serif.x > stem.x else -1
                    d = (79 - dx) * side
                    if d:
                        for p in _pts(g):
                            if p.y <= serif.y + 1 and (p.x - serif.x) * side >= -0.5:
                                p.x += d
                        hf.x = round(serif.x + 0.90 * (stem.x - serif.x))
                        done.append(f"{name} bowl-side foot {dx}>79")
    return done


# e and g (0.59; owner: "yes, g and e"). After 0.58 e carried 12% more ink than its class against both references and
# g 19%. Profiled level by level (tools/joins/profile.py):
#   e  above the bar its left stroke was 1.02-1.09 stems where both references thin to 0.84-0.94 (the eye is wider
#      on that side); the bar was 45 units (0.58 stems; n's hairline is 43); the lower arc 0.72 against c's 0.65.
#   g  the bowl and loop are the references' widths; the ear reached 0.27 x-heights past the bowl (references 0.17
#      and 0.18), which is the whole of g's extra width; the loop's lower arc was 48 units against the arcs' 43;
#      the loop's top stroke 1.16 stems (references 0.89-1.10); the ear's neck 0.95 stems thick (references 0.5).
E_EYE_LEFT = 9                  # the eye's left side moves out: the stroke above the bar 1.09 to 0.98 stems
E_BAR = 41                      # the bar's thickness, taken from its underside (its top stays at 0.615 x)
G_EAR_IN = 20                   # the ear's end comes in: 0.27 to 0.23 x-heights past the bowl, still the longest
G_LOOP_THIN = 43                # the loop's lower arc: the lowercase hairline
G_EAR_NECK = 63                 # the ear's neck, top to underside: r's neck (it was 74, 0.95 stems; references about 0.5)
G_LOOP_TOP = 10                 # the loop's top stroke, 1.16 stems across (references 0.89 to 1.10): its inside edge up


def e_g(font):
    done = []
    g = font["e"]
    eye = min(g.contours, key=lambda c: max(p.x for p in c.points) - min(p.x for p in c.points))
    out = max(g.contours, key=lambda c: max(p.x for p in c.points) - min(p.x for p in c.points))
    P, n = eye.points, len(eye.points)
    L = min((p for p in P if p.type), key=lambda p: p.x)     # the eye's corner at the bar's left end
    i = P.index(L)
    h = max((P[i - 1], P[(i + 1) % n]), key=lambda p: p.y)   # its handle up the left side
    if h.type is None and h.y > L.y:
        for p in (L, h):
            p.x -= E_EYE_LEFT
        done.append(f"e eye left -{E_EYE_LEFT}")
    top = L.y                                                # the bar's top is the eye's floor
    P = out.points
    under = max(p.y for p in P if p.type == "line" and top - 60 < p.y < top - 30)
    d = (top - E_BAR) - under
    if 0 < d <= 8:
        for kind, i0, h1, h2, i3 in joins.segs(out):         # the outside corner at the bar's right end rises with it
            a, b_ = P[i0], P[i3]
            if kind == "curve" and a.y == under and b_.y > a.y and b_.x > a.x and b_.y - a.y < 60:
                b_.y += d
                P[h2].y += d
        for p in P:
            if under - 10 <= p.y <= under:
                p.y += d
        done.append(f"e bar {top - under}>{E_BAR}")
    # e: the lower counter's top left corner carried a small bevel (10 by 9, a leftover of the base's spur; owner,
    # 0.62: "is this intentional?"). It is a plain corner, as in both references.
    P = out.points
    for kind, i0, h1, h2, i3 in joins.segs(out):
        a, b_ = P[i0], P[i3]
        nxt = P[(i3 + 1) % len(P)]
        if kind == "curve" and 0 < b_.x - a.x <= 14 and 0 < b_.y - a.y <= 14 and nxt.type == "line" \
                and nxt.y == b_.y and nxt.x - b_.x > 150:
            a.y = b_.y
            a.smooth = False
            for q in (P[h1], P[h2], b_):
                out.points.remove(q)
            done.append("e counter corner squared")
            break
    g = font["g"]
    c = max(g.contours, key=lambda c_: len(c_.points))
    P = c.points
    bowl = min(g.contours, key=lambda c_: len(c_.points))
    right = max(p.x for p in bowl.points) + 82              # the bowl's outer right: the counter's plus a stroke
    xmax = max(p.x for p in P)
    ear = [p for p in P if p.y > 400 and p.x > right]
    if ear and xmax - right > 100:
        lo, hi = right + 11, right + 58                      # the shift eases in over the ear's neck; the end moves whole
        for p in ear:
            p.x -= round(G_EAR_IN * min(1, max(0, (p.x - lo) / (hi - lo))))
        done.append(f"g ear {xmax - right}>{max(p.x for p in P) - right} past the bowl")
    n = len(P)
    for i, p in enumerate(P):                                # the ear's neck: its underside, level, just past the bowl
        a, b_ = P[i - 1], P[(i + 1) % n]
        if p.type and a.type is None and b_.type is None and a.y == p.y == b_.y and right + 5 < p.x < right + 45 \
                and 430 < p.y < 480:
            top = max(q.y for q in ear)
            d = (top - p.y) - G_EAR_NECK
            if 0 < d <= 16:
                for q in (p, a, b_):
                    q.y += d
                done.append(f"g ear neck {top - p.y + d}>{G_EAR_NECK}")
    for i, p in enumerate(P):                                # the loop's top stroke: the counter's leaning top edge
        q = P[(i + 1) % n]
        if p.type and q.type == "line" and abs(q.x - p.x) > 120 and abs(q.y - p.y) < 40 and -40 < p.y < 40 \
                and -40 < q.y < 40:
            for r_ in (P[i - 1], p, q, P[(i + 2) % n]):
                r_.y += G_LOOP_TOP
            done.append(f"g loop top stroke -{G_LOOP_TOP}")
            break
    low = min(p.y for p in P)
    for i, p in enumerate(P):                                # the loop's counter, at its lowest: level handles
        a, b_ = P[i - 1], P[(i + 1) % n]
        if p.type and a.type is None and b_.type is None and a.y == p.y == b_.y and low + 30 < p.y < low + 70:
            d = (p.y - low) - G_LOOP_THIN
            if 0 < d <= 8:
                for q in (p, a, b_):
                    q.y -= d
                done.append(f"g loop bottom {p.y + d - low}>{G_LOOP_THIN}")
    return done


# Serifs on leaning strokes, lowercase (0.60; owner: "yes continue", after x y v stood 6 to 10% over their class in
# ink). Measured from each stroke's own edge lines at the serif's inner edge (tools/joins/diag_serifs.py), in stems:
# on the closed side (the stroke leans back over the serif) v x y ran 1.11 to 1.42 past the stroke, both references
# 0.74 to 0.98; on the open side 0.48 to 0.92, references 0.47 to 0.60 (0.88 once). So x and y were 5 and 8% wider
# than the reference they take their widths from. One length each side. The capitals already sit with the
# references (V and Y shorter on the closed side, by the owner's notes) and are left.
LEAN_CLOSED = 70                # 0.90 of n's stem
LEAN_OPEN = 45                  # 0.58
LEAN = "vwxy"


def lean_serifs(font, names=LEAN):
    done = []
    for name in names:
        g = font[name]
        k = []
        for S, HS, HN, N, X in joins.diagonal_joins(g):
            if abs(X[0] - S.x) < 25:
                continue
            closed = (N.x - X[0]) * (S.x - X[0]) > 0
            way = 1 if S.x > X[0] else -1                    # the serif runs this way from the stroke
            over = abs(S.x - X[0]) + joins.ROUND             # the tip is one softened corner past the join's end
            d = (LEAN_CLOSED if closed else LEAN_OPEN) - over
            if abs(d) < 1.5:
                continue
            up = 1 if N.y < S.y else -1                      # the serif's body lies this way from its inner edge
            tip = [p for p in _pts(g) if (p.x - S.x) * way >= -0.5 and abs(p.x - S.x) <= 12
                   and 0 <= (p.y - S.y) * up <= joins.TIP + 1]
            for p in tip:
                p.x += round(d) * way
            HS.x = round(S.x + 0.62 * (X[0] - S.x))          # the fillet rules after this set the final shares
            k.append(f"{'closed' if closed else 'open'} {over:.0f}>{over + round(d):.0f}")
        done.append(f"{name}: " + ", ".join(k))
    # a: the bowl's lower arc 50 units to 45 (0.58 stems; its top 0.55; references 1.08 and 1.5 times their tops)
    was = clean._thin(font["a"], "bottom", (25, 60))
    now = arc_thin(font["a"], "bottom", 45, (25, 60))
    done.append(f"a bowl bottom {round(was[0]) if was else '?'}>{now}")
    return done


# w's width (0.61; owner: "yes, widen w"). With its serifs at the common length w's ink was 1.471 x-heights wide,
# Georgia Pro's 1.568 (the widths rule: within 2.5%). The body is stretched sideways by W_WIDER; the strokes then
# come back to their weights (diagonals: thick 73 like v x y, thin THIN_LOW) and the serifs to their lengths (lean_serifs), so
# only the two counters open.
W_WIDER = 1.07


def widen_w(font):
    g = font["w"]
    x0 = min(p.x for p in _pts(g))
    was = max(p.x for p in _pts(g)) - x0
    for p in _pts(g):
        p.x = round(x0 + (p.x - x0) * W_WIDER)
    return [f"w body {was}>{max(p.x for p in _pts(g)) - x0} before strokes and serifs are reset"]


# a: options for the owner (0.61, "yes, draw options"). Measured with the bowl aligned on the stem, in stems: the stem
# 1.08 (references 0.99-1.01); the top arc where it comes down into the stem 0.88 (0.59-0.62); the bowl's lower
# stroke where it meets the stem 0.69 (0.42-0.54), and the stem across that join 1.33 (1.00-1.12). The owner picked
# C from the sheet (img/a-options-0.62.png); AREA_A=A or B rebuilds the others (env values are for option sheets only).
#   B  the stem's left edge moves right 4 (stem 78), and the top arc's inside comes down later: a lighter shoulder
#   C  B, and the counter's lower right corner is squarer and lower, so the bowl's lower stroke stays thin up to the stem
A_OPTION = __import__("os").environ.get("AREA_A", "C")      # the owner picked C (0.63)
A_SHOULDER = 10                 # the inside arc's handle up the stem, raised: the arc turns later
A_CORNER = (25, 12)             # the counter's lower right corner: its handle down the stem, its handle along the bottom


def a_option(font):
    if A_OPTION not in ("B", "C"):
        return ["a: option A (the a before 0.63)"]
    g = font["a"]
    out = max(g.contours, key=lambda c: len(c.points))
    inn = min(g.contours, key=lambda c: len(c.points))
    P = out.points
    right = max(p.x for p in P if p.type and 150 < p.y < 400)          # the stem's right edge
    left = max(p.x for p in P if p.type and 330 < p.y < 370 and p.x < right - 60)
    d = (right - 78) - left
    done = [f"a option {A_OPTION}: stem {right - left}>78"]
    slope = None
    n = len(P)
    for i, p in enumerate(P):
        if p.x != left or p.y < 300:
            continue
        nb = [q for q in (P[i - 1], P[(i + 1) % n]) if q.type and q.x < left - 100]   # the bowl's top edge ends here
        if nb:
            slope = (p.y - nb[0].y) / (p.x - nb[0].x)
            p.y = round(p.y + d * slope)
        p.x += d
    for p in P:                                                          # the inside arc's handle up the stem
        if p.type is None and p.x == left and p.y > 400:
            p.x += d
            p.y += A_SHOULDER
    Q = inn.points
    cr = max(p.x for p in Q)
    top = max((p for p in Q if p.x >= cr - 2), key=lambda p: p.y)
    for p in Q:
        if p.x >= cr - 2:
            if p is top and slope is not None:
                p.y = round(p.y + (right - 78 - cr) * slope)
            p.x = right - 78
    if A_OPTION == "C":
        m = len(Q)
        for i, p in enumerate(Q):
            if p.type is None and p.x == right - 78 and p.y < 200:       # the handle down the stem
                p.y -= A_CORNER[0]
                h = Q[(i + 1) % m] if Q[(i + 1) % m].type is None else Q[i - 1]
                h.x += A_CORNER[1]
                done.append("counter corner lower and squarer")
    return done


# One arch on n, h and m (0.64; owner: "review all other thick/thin transitions"). tools/joins/swell.py follows the
# thickness along every stroke. Where the arch leaves the stem, h's stroke was 130 units at the point n's is 111, and
# h's stem stayed over 78 for 30 units longer: the three arches had drifted apart (inner peak at 480, 483 and 484;
# the notch at 431, 439 and 430; h's notch 6 units further from the stem). n is the control letter: h takes its
# arch point for point, m takes it scaled to its narrower counters. h's stem above the arch was 80 wide: 78.
def same_arches(font):
    def arch(P, i):
        """The inner arch from its branch on the stem (7 points) and, further on, the outer arch from the right
        stem's shoulder back to the notch (8 points)."""
        n = len(P)
        inner = [P[(i + k) % n] for k in range(7)]
        j = next(k for k in range(i + 7, i + n) if P[k % n].type == "line" and P[(k + 1) % n].type is None
                 and P[(k + 1) % n].x == P[k % n].x and 330 < P[k % n].y < 370 and P[(k + 1) % n].y > P[k % n].y)
        return inner, [P[(j + k) % n] for k in range(8)]

    def branches(P):
        return [i for i, p in enumerate(P) if p.type == "line" and 300 < p.y < 345 and P[(i + 1) % len(P)].type is None
                and P[(i + 1) % len(P)].x == p.x and P[(i + 1) % len(P)].y > p.y]
    N = font["n"].contours[0].points
    ni, no = arch(N, branches(N)[0])
    R = ni[0].x                                              # n's stem, right edge
    counter = ni[6].x - R
    ref_i = [(p.x - R, p.y) for p in ni]
    ref_o = [(p.x - R, p.y) for p in no]
    done = []
    H = font["h"].contours[0].points
    hi, ho = arch(H, branches(H)[0])
    r = hi[0].x
    for p, (dx, y) in zip(hi, ref_i):
        p.x, p.y = r + dx, y
    for p, (dx, y) in zip(ho[:7], ref_o[:7]):
        p.x, p.y = r + dx, y
    over = ho[7].x - r                                       # the stem above the arch: h's ran 2 units wide
    for p in H:
        if p.x == r + over and p.y >= ho[7].y:
            p.x = r
    ho[7].y = ref_o[7][1]
    done.append(f"h arch = n's; stem above the arch -{over}")
    M = font["m"].contours[0].points
    for i in branches(M):
        mi, mo = None, None
        mi = [M[(i + k) % len(M)] for k in range(7)]
        r = mi[0].x
        s = (mi[6].x - r) / counter
        for p, (dx, y) in zip(mi, ref_i):
            p.x, p.y = round(r + dx * s), y
        # the outer arch over this counter: peak and the points back to the notch (the far side differs on m's
        # first arch, which runs into the middle stem's crotch)
        peak = min((p for p in M if p.type and abs(p.y - 530) <= 1 and r < p.x < mi[6].x + 20), key=lambda p: abs(p.x - (r + ref_o[3][0] * s)))
        k = M.index(peak)
        for q, (dx, y) in zip([M[(k + t) % len(M)] for t in range(0, 4)], ref_o[3:7]):
            q.x, q.y = round(r + dx * s), y
        M[(k - 1) % len(M)].y = 530
        M[(k + 4) % len(M)].y = ref_o[7][1]
        done.append(f"m arch at {r} = n's x {s:.3f}")
    return done


# Stems, one width along their whole length (0.64). Scanned as pairs of straight upright edges: i's stem was 77, l's
# 79; b's and d's 79 above the bowl and 78 beside it; f's 77 under its bar and 78 above; q's 81 in the descender and
# 78 above. All 78. Everything on the moved edge's side moves with it (foot, flag), so serif lengths hold.
def even_stems(font, names="bdfilq"):
    done = []

    def edges(g):
        out = []
        for c in g.contours:
            P = c.points
            for i, p in enumerate(P):
                q = P[(i + 1) % len(P)]
                if p.type and q.type == "line" and p.x == q.x and abs(p.y - q.y) >= 60:
                    out.append((p.x, min(p.y, q.y), max(p.y, q.y)))
        return sorted(out)

    for name in names:
        g = font[name]
        E = edges(g)
        for a in E:
            for b_ in E:
                w = b_[0] - a[0]
                lo, hi = max(a[1], b_[1]), min(a[2], b_[2])
                if not (70 <= w <= 86 and w != 78 and hi - lo >= 30):
                    continue
                d = 78 - w
                # move the edge that has a twin at the right width elsewhere on the stem; else the right one
                twins_a = [e for e in E if e is not a and abs(e[0] - a[0]) <= 4 and e[0] != a[0]]
                move_left = bool(twins_a) and not [e for e in E if e is not b_ and abs(e[0] - b_[0]) <= 4 and e[0] != b_[0]]
                if move_left:
                    for p in _pts(g):
                        if p.x <= a[0] and lo - 70 <= p.y <= hi + 130:
                            p.x -= d
                else:
                    for p in _pts(g):
                        if p.x >= b_[0] and lo - 100 <= p.y <= hi + 130:
                            p.x += d
                done.append(f"{name} {w}>78")
                E = edges(g)
                break
            else:
                continue
            break
    return done


def run(font):
    out = []
    for fn in (heights, bars, same_arches, even_stems, widen_w, diagonals, lean_serifs, a_option, arcs, stems, e_g):
        out.append((fn.__name__, fn(font)))
    return out
