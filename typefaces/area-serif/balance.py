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
    # (0.58 set a's lower arc here; since 0.65 it is parts.a_join's: the arch's thickness, 50)
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
    if A_OPTION == "C-corner":                              # 0.65: the join is parts.py's now (one neck on every branch);
        m = len(Q)                                           # C's squarer corner left the stroke 19 units at the stem
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
    import parts

    def parts_run(f):
        return [x for _, did in parts.run(f) for x in did]
    def a_join(f):                                           # after a_option, which sets a's stem
        return parts.a_join(f)
    def vertices(f):                                         # after diagonals, which sets each stroke's width
        return parts.vertices(f)
    for fn in (heights, bars, same_arches, even_stems, parts_run, widen_w, diagonals, vertices, lean_serifs, a_option, a_join, arcs, stems, e_g):
        out.append((fn.__name__, fn(font)))
    return out


# Capital thin strokes and B's lower bowl (0.67; evaluation of 2026-11-13, owner: "fix those three").
# The level thin strokes of the capitals measured 40 (L's arm), 43 (E and F middle arms), 45-46 (E F T Z arms), 47 (B's
# middle, the tops of B D P R), 52 (A and H bars) and 53-55 (where the bowls of P and R close): a 15-unit range where
# Georgia Pro holds 4.5 and Serrif 4.4. As shares of each reference's own O hairline: arms 0.92 and 1.02, crossbars
# 1.00 and 1.08, closing strokes 1.01 / 0.98 and 1.00 / 1.00. On Area's 47: arms 46 (E's, F's and T's own value),
# crossbars 49, closing strokes 47.
CAP_ARM = 46
CAP_BAR = 49


def cap_thins(font, cap=CAP):
    done = []
    # H: the crossbar thins from its underside (the top holds the upper counters)
    P = _pts(font["H"])
    ys = sorted({p.y for p in P if p.type == "line" and 0.4 * cap < p.y < 0.6 * cap})
    if len(ys) == 2 and 0 < (ys[1] - ys[0]) - CAP_BAR <= 6:
        d = (ys[1] - ys[0]) - CAP_BAR
        for p in P:
            if p.y == ys[0] and p.type == "line":
                p.y += d
        done.append(f"H bar {ys[1] - ys[0]}>{CAP_BAR}")
    # A: the same, its underside's ends sliding up the legs' inner edges
    g = font["A"]
    outer, inner = g.contours[0], g.contours[1]
    top = min(p.y for p in inner.points)
    O, n = outer.points, len(outer.points)
    ends = [i for i, p in enumerate(O) if p.type == "line" and 0.25 * cap < p.y < top - 20]
    if len(ends) == 2 and O[ends[0]].y == O[ends[1]].y and 0 < (top - O[ends[0]].y) - CAP_BAR <= 6:
        was = top - O[ends[0]].y
        d = was - CAP_BAR
        for i in ends:
            p = O[i]
            q = next(q for q in (O[i - 1], O[(i + 1) % n]) if q.type and q.y < p.y - 50)     # the leg's lower node
            p.x = round(p.x + d * (p.x - q.x) / (p.y - q.y))
            p.y += d
        done.append(f"A bar {was}>{CAP_BAR}")
    # E, F: the middle arm, CAP_ARM about the centre of its own flare
    for name in "EF":
        P = _pts(font[name])
        n = len(P)
        face = [(P[i], P[(i + 1) % n]) for i in range(n) if P[i].type and P[(i + 1) % n].type == "line"
                and P[i].x == P[(i + 1) % n].x and abs(P[i].y - P[(i + 1) % n].y) > 150
                and all(0.25 * cap < q.y < 0.75 * cap for q in (P[i], P[(i + 1) % n]))]
        if len(face) != 1:
            done.append(f"{name} middle arm: no flare found")
            continue
        a, b = face[0]
        c = (a.y + b.y) / 2
        ys = sorted({p.y for p in P if p.type and abs(p.y - c) < 40 and p.x < a.x - 25})
        if len(ys) != 2 or not 0 < CAP_ARM - (ys[1] - ys[0]) <= 6:
            continue
        lo = round(c - CAP_ARM / 2)
        for p in P:
            if p.x < a.x - 25 and p.y in ys:
                p.y = lo if p.y == ys[0] else lo + CAP_ARM
        done.append(f"{name} middle arm {ys[1] - ys[0]}>{CAP_ARM} ({lo}-{lo + CAP_ARM})")
    # L: E's bottom arm. Its top edge and the fillet into the stem rise together
    P = _pts(font["L"])
    ys = {p.y for p in P if p.type == "line" and 30 < p.y < 60 and p.x > 200}
    if len(ys) == 1:
        y = ys.pop()
        d = CAP_ARM - y
        if 0 < d <= 8:
            x0 = min(p.x for p in P if p.y == y)
            for p in P:
                if p.y == y or (y < p.y <= y + 50 and x0 - 25 <= p.x <= x0):
                    p.y += d
            done.append(f"L arm {y}>{CAP_ARM}")
    # P, R: where the bowl closes on the stem. The counter's level bottom moves; the outside holds the leg and the height
    for name in "PR":
        g = font[name]
        inner = g.contours[1].points
        bottom = min(p.y for p in inner)
        xs = min(p.x for p in inner)
        under = [p.y for p in g.contours[0].points if p.type == "line" and abs(p.x - xs) <= 2 and 0.35 * cap < p.y < bottom]
        if not under:
            done.append(f"{name}: no closing stroke found")
            continue
        d = (bottom - max(under)) - CAP_THIN
        if 0 < d <= 9:
            for p in inner:
                if p.y == bottom:
                    p.y -= d
            done.append(f"{name} closing stroke {bottom - max(under)}>{CAP_THIN}")
    return done


# B's lower bowl was 98 across at its extreme (measured across the stroke; 105 on a level scanline just below it),
# against 92 to 94 on O C G Q D P R (references: B's lower bowl within 5% of the O). The counter's extreme moves out
# until the stroke is the O's there. If the stroke were still more than B_OVER over the O's along either quarter of
# the counter, that quarter's tension would rise to bring it under (it is not: 92.3 and 91.8 as drawn).
B_OVER = 1.5
B_TENSION_MAX = 66       # a counter's quarter: 0.61 on the lowercase bowl; past 0.66 it reads square


def B_lower(font, cap=CAP):
    g = font["B"]
    Oo, Oi = font["O"].contours[0].points, font["O"].contours[1].points
    T = min(p.x for p in Oi) - min(p.x for p in Oo)                  # the O's stroke at its extreme
    low = min(g.contours[1:], key=lambda c: min(p.y for p in c.points))
    P, n = low.points, len(low.points)
    outer_x = max(p.x for p in g.contours[0].points if p.type and p.y < cap / 2)
    e = max((i for i in range(n) if P[i].type), key=lambda i: P[i].x)
    E_, up, dn = P[e], None, None
    for j in ((e - 1) % n, (e + 1) % n):
        if P[j].type is None and P[j].x == E_.x:
            if P[j].y > E_.y:
                up = j
            else:
                dn = j
    if up is None or dn is None:
        return ["B: the counter's extreme was not found"]
    was = outer_x - E_.x
    dx = was - T
    if not 0 < dx <= 12:
        return [f"B lower bowl {was}: left"]
    for q in (E_, P[up], P[dn]):
        q.x += dx
    step_dn, step_up = (1 if dn == (e + 1) % n else -1), (1 if up == (e + 1) % n else -1)

    def quarter(h_i, step):
        """(handle at the extreme, handle at the far node, far node) of the quarter leaving the extreme through h_i."""
        return P[h_i], P[(h_i + step) % n], P[(h_i + 2 * step) % n]

    def cubic(a, b, c, d, m=40):
        return [tuple((1 - t) ** 3 * a[k] + 3 * (1 - t) ** 2 * t * b[k] + 3 * (1 - t) * t * t * c[k] + t ** 3 * d[k]
                      for k in (0, 1)) for t in (i / m for i in range(m + 1))]

    O_, m = g.contours[0].points, len(g.contours[0].points)
    edge = []                                                # the bowl's outside, sampled
    for i in range(m):
        if O_[i].type == "curve":
            q = [O_[(i - 3 + k) % m] for k in range(4)]
            if all(p.y < 0.56 * cap for p in q) and max(p.x for p in q) > E_.x - 200:
                edge += cubic(*[(p.x, p.y) for p in q])

    def thickest(h0, h1, far):
        """The stroke across (inside to the nearest point outside) at its thickest along one quarter of the counter."""
        return max(min(math.hypot(x - ex, y - ey) for ex, ey in edge)
                   for x, y in cubic((E_.x, E_.y), (h0.x, h0.y), (h1.x, h1.y), (far.x, far.y), 24)[:-6])

    notes = []
    for h_i, step in ((dn, step_dn), (up, step_up)):
        h0, h1, far = quarter(h_i, step)
        if far.type is None or abs(h1.y - far.y) > 0.5:
            notes.append("quarter not level at its end: left")
            continue
        reach_y, reach_x = far.y - E_.y, far.x - E_.x
        k0 = (abs(h0.y - E_.y) / abs(reach_y), abs(far.x - h1.x) / abs(reach_x))
        if thickest(h0, h1, far) <= T + B_OVER:              # light enough as drawn
            notes.append(f"as drawn ({k0[0]:.2f} / {k0[1]:.2f}), {thickest(h0, h1, far):.1f} at most")
            continue
        for k in [x / 100 for x in range(56, B_TENSION_MAX + 1)]:   # the lowest tension that brings it under
            h0.y = round(E_.y + reach_y * k)
            h1.x = round(far.x - reach_x * k)
            if thickest(h0, h1, far) <= T + B_OVER:
                break
        notes.append(f"tension {k0[0]:.2f} / {k0[1]:.2f} > {k:.2f}, {thickest(h0, h1, far):.1f} at most")
    return [f"B lower bowl {was}>{T} at the extreme; " + "; ".join(notes)]


# Figures' flat strokes and two one-unit mismatches (0.68; evaluation of 2026-11-13). The base of 2 was 80, the flag
# of 5 was 77 and the top of 7 was 72: one kind of stroke, three weights. Serrif and Source Serif 4 draw all three
# at 0.86 of their capital stem, Georgia Pro at 0.82 (mean 0.85): 73 on Area's 86. Each stroke thins or thickens
# from its inside edge (the baseline and the figure height hold); an end on a diagonal or an upright slides along
# that stroke's own edge.
FIG_FLAT = 73


def _slide(p, q, y):
    """Moves p to height y along the line from p to q."""
    if q.y != p.y:
        p.x = round(p.x + (y - p.y) * (q.x - p.x) / (q.y - p.y))
    p.y = y


def fig_flats(font, cap=CAP):
    done = []
    # 2: the base's top edge comes down; its left end and the diagonal's start slide down the diagonal
    P = _pts(font["two"])
    n = len(P)
    ys = [p.y for p in P if p.type == "line" and 60 < p.y < 95 and p.x < 260]
    if ys:
        y = min(ys)
        d = y - FIG_FLAT
        if 0 < d <= 9:
            start = next(i for i, p in enumerate(P) if p.type == "line" and y < p.y <= y + 4 and P[(i + 1) % n].type is None)
            hd = P[(start + 1) % n]                          # the diagonal's own direction at its start
            for i, p in enumerate(P):
                if i == start or (p.y == y and p.x < 260 and p.type == "line"):
                    _slide(p, hd, p.y - d)
                elif y - 8 <= p.y <= y and p.x > 260:
                    p.y -= d
            done.append(f"2 base {y}>{FIG_FLAT}")
    # 5: the flag's underside rises; its left end slides up the upright's inner edge
    P = _pts(font["five"])
    n = len(P)
    top = max(p.y for p in P)
    ys = sorted({p.y for p in P if p.type == "line" and top - 95 < p.y < top - 60})
    if ys:
        y = ys[0]
        d = (top - y) - FIG_FLAT
        if 0 < d <= 9:
            for i, p in enumerate(P):
                if p.y == y and p.type == "line" and P[i - 1].type and P[i - 1].y < y - 100:
                    _slide(p, P[i - 1], y + d)               # the upright's inner edge runs up from the node before
                elif y <= p.y <= y + 8 and p.x > 300:
                    p.y += d
            done.append(f"5 flag {top - y}>{FIG_FLAT}")
    # 7: the top's underside; its right end slides along the diagonal's inner edge
    P = _pts(font["seven"])
    n = len(P)
    top = max(p.y for p in P)
    ys = sorted({p.y for p in P if p.type and top - 95 < p.y < top - 60 and p.x > 100})
    if ys:
        y = ys[0]
        d = (top - y) - FIG_FLAT
        if d and abs(d) <= 9:
            for i, p in enumerate(P):
                if p.y != y:
                    continue
                q = P[(i + 1) % n]
                if p.type == "line" and q.type and q.y < y - 300:
                    _slide(p, q, y + d)
                else:
                    p.y += d
            done.append(f"7 top {top - y}>{FIG_FLAT}")
    # N: its two thin uprights were 48 and 49. The right one takes the left one's width, from its inside edge
    P = _pts(font["N"])
    xs = sorted({p.x for p in P if p.type and 60 < p.y < 660})
    cols = xs                                                # the four upright edges, left to right
    if len(cols) == 4:
        left, right = cols[1] - cols[0], cols[-1] - cols[-2]
        if 0 < abs(right - left) <= 2:
            for p in P:
                if p.x == cols[-2] and p.y > 100:            # the edge's nodes and the upright handle of its bracket
                    p.x += right - left
            done.append(f"N right upright {right}>{left}")
    # 1: the stem's right edge leaned one unit over 633
    P = _pts(font["one"])
    n = len(P)
    for i, p in enumerate(P):
        q = P[(i + 1) % n]
        if p.type and q.type == "line" and q.y - p.y > 500 and 0 < abs(q.x - p.x) <= 2:
            done.append(f"1 stem edge {q.x}>{p.x} at the top")
            q.x = p.x
    return done


# Capital serif projections (0.70). On upright stems the tips stood 76 or 77 units from the stem (25 and 26 of them):
# H's left stem had 77 at the foot's left and 76 at its right, the head the other way round. One value, the more
# common: CAP_SERIF. The tip and its two rounded corners move; the bracket's curve follows from its fixed node.
CAP_SERIF = 77


def cap_serifs(font, names="BDEFHIKLMNPRTUY", cap=CAP):
    from normalize import flatten, spans_at
    done = []
    for name in names:
        g = font[name]
        fl = flatten(g)
        moved = 0
        for yq, line in ((0.25 * cap, 0), (0.75 * cap, cap)):
            for a, b in spans_at(fl, yq):
                if not 40 <= b - a <= 95:
                    continue
                for edge, sg in ((round(a), -1), (round(b), 1)):
                    tip = [p for p in _pts(g) if abs(p.y - line) <= 30 and 60 <= (p.x - edge) * sg <= 85]
                    if len([p for p in tip if p.type]) < 3:
                        continue
                    proj = max((p.x - edge) * sg for p in tip)
                    d = CAP_SERIF - proj
                    if d and abs(d) <= 2:
                        far = edge + sg * proj
                        for p in tip:
                            if abs(p.x - far) <= 8:
                                p.x += sg * d
                        moved += 1
        if moved:
            done.append(f"{name} {moved}")
    return done


# The zero (0.70; owner: "finish the rest of the open items"). 0 carried the O's stroke (92) in a shape 176 units
# narrower, so its counter was the darkest thing in a row of figures. Georgia Pro draws its zero's sides at 0.92 of
# its O's and Serrif at 0.96: 0.94 x 92 = 87. The counter's two side extremes move out; the top and bottom stay on
# the figures' one hairline (FIG_THIN), and the outside does not move, so the zero's width and spacing hold.
ZERO_SIDE = 87


def zero_weight(font):
    g = font["zero"]
    outer = max(g.contours, key=lambda c: max(p.x for p in c.points) - min(p.x for p in c.points))
    inner = next(c for c in g.contours if c is not outer)
    ox0, ox1 = min(p.x for p in outer.points), max(p.x for p in outer.points)
    P, n = inner.points, len(inner.points)
    done = []
    for edge, sg in ((ox0, 1), (ox1, -1)):                   # left side: the counter's extreme is at edge + stroke
        e = (min if sg == 1 else max)((p for p in P if p.type), key=lambda p: p.x)
        i = P.index(e)
        hs = [P[i - 1], P[(i + 1) % n]]
        if any(h.type or h.x != e.x for h in hs):
            done.append("0: counter extreme not found")
            continue
        was = abs(e.x - edge)
        d = was - ZERO_SIDE
        if 0 < d <= 8:
            for q in [e] + hs:
                q.x -= sg * d
            done.append(f"0 side {was}>{ZERO_SIDE}")
    return done


# 0.84 (Regular pass 2, placement). The census (build/owner9/place/report.md, 2.1) found edges a unit or two off their
# line: a and ae's bowls -9, b-hook's -11 (o's -10), the Schwa 722 (O's 721), fi's and ffi's bar 519 (f's 520), the
# turned v's point 531, q-hook-tail's spur 518 (q's 520); and the head serifs of n m p r (and eng, n with a left hook,
# p and r struck, h with a hook) with their stem corner at 529 where i's, j's and u's are at 530, r with a tail's at
# 516. The rules, run on every letter once every letter is drawn:
#   a level edge (two on-curve points, a straight between them, 5 units or longer) within ZONE_FLAT of a line's flat
#   value stands on it, or within ZONE_ROUND of its round value (a vertex's flat) stands on that; a round extreme (a
#   node whose two handles are level with it) within ZONE_ROUND of a round value stands on it; the points move with
#   their handles. Lowercase: flat 0 520 780 -224, round -10 530 780 -233; capitals and figures: flat 0 712, round
#   -9 721. r's ball (528, two under) is its own rule and is outside ZONE_ROUND.
#   every x-height head serif's stem corner stands on i's (the control), the flag moving whole (level_flags' rule,
#   which held p and r to n, now holds every letter to i).
ZONE_FLAT, ZONE_ROUND = 2, 1
ZONES = {"low": ((0, 520, 780, -224), (-10, 530, 780, -233)), "up": ((0, 712), (-9, 721))}
FLAG_REACH = 15                 # a flag's corner this far from i's is a head serif to level (r with a tail's: 14)


def _zone_kind(font, g):
    import unicodedata
    us = g.unicodes or (font[g.name.split(".")[0]].unicodes if g.name.split(".")[0] in font else [])
    cat = unicodedata.category(chr(us[0])) if us else ""
    return "low" if cat == "Ll" else "up" if cat in ("Lu", "Nd") else None


def zone_lines(font):
    done = []
    for g in font:
        if not g.contours:
            continue
        kind = _zone_kind(font, g)
        if kind is None:
            continue
        flats, rounds = ZONES[kind]
        moved = []
        for c in g.contours:
            P, n = c.points, len(c.points)
            hit = {}
            for i, p in enumerate(P):
                q = P[(i + 1) % n]
                if p.type and q.type == "line" and p.y == q.y and abs(p.x - q.x) >= 5:
                    t = next((v for v in flats if 0 < abs(p.y - v) <= ZONE_FLAT), None)
                    if t is None:
                        t = next((v for v in rounds if 0 < abs(p.y - v) <= ZONE_ROUND), None)
                    if t is not None:
                        hit[i] = hit[(i + 1) % n] = t - p.y
                a, b = P[i - 1], P[(i + 1) % n]
                if p.type and p.smooth and a.type is None and b.type is None and a.y == p.y == b.y:
                    t = next((v for v in rounds if 0 < abs(p.y - v) <= ZONE_ROUND), None)
                    if t is not None:
                        hit[i] = t - p.y
            for i, d in hit.items():
                for j in (i - 1, i, (i + 1) % n):
                    if j == i or P[j].type is None:
                        P[j].y += d
                moved.append(f"{P[i].y - d}>{P[i].y}")
        if kind == "low":                                # a foot cut short of the baseline (pi's left leg, -1 to -3)
            for c in g.contours:
                P, n = c.points, len(c.points)
                for i, p in enumerate(P):
                    q = P[(i + 1) % n]
                    if p.type and q.type == "line" and -3 <= min(p.y, q.y) and max(p.y, q.y) < 0 and \
                            10 <= abs(p.x - q.x) <= 80:
                        moved.append(f"cut {p.y}/{q.y}>0")
                        p.y = q.y = 0
        if g.name == "s_t":                              # the ligature's s at s's height (its top stood 6 over)
            top = max(p.y for p in font["s"].contours[0].points)
            join = max(p.x for c in g.contours for p in c.points if p.type and p.y == top and not p.smooth) \
                if any(p.type and p.y == top and not p.smooth for c in g.contours for p in c.points) else None
            over = max(p.y for c in g.contours for p in c.points if p.y <= top + 8 and join is not None and p.x < join) - top
            for c in g.contours:
                for p in c.points:
                    if top < p.y <= top + 8 and join is not None and p.x < join:
                        moved.append(f"s top {p.y}>{p.y - over}")
                        p.y -= over
        if moved:
            done.append(f"{g.name} " + " ".join(sorted(set(moved))))
    return done


def _head_flags(g, xh, lo=5, hi=15, tol=3):
    """joins._flags, reading a stem edge that leans up to `tol` (r with a tail's first drawing: 125 to 127)."""
    import math
    from joins import segs
    out = []
    for c in g.contours:
        P, n = c.points, len(c.points)
        for kind, i0, _, _, i3 in segs(c):
            if kind != "line":
                continue
            t, k = (i0, i3) if P[i0].x < P[i3].x else (i3, i0)
            T, C = P[t], P[k]
            run, rise = C.x - T.x, C.y - T.y
            if not (80 <= run <= 170 and T.y > 0.8 * xh and rise > 0 and lo <= math.degrees(math.atan2(rise, run)) <= hi):
                continue
            step = 1 if (t + 1) % n != k else -1
            group, i = [T], t
            for _ in range(14):
                i = (i + step) % n
                p = P[i]
                group.append(p)
                if p.type:
                    j = (i + step) % n
                    while not P[j].type:
                        j = (j + step) % n
                    if abs(P[j].x - p.x) <= tol and p.y - P[j].y > 100:
                        out.append((T, C, group))
                        break
    return out


def flag_line(font):
    import joins as JOINS
    xh = 520
    ref = max(C.y for _, C, _ in JOINS._flags(font["i"], 5, 12, xh))     # i: the control
    done = []
    for g in font:
        if not g.contours or _zone_kind(font, g) != "low":
            continue
        for T, C, group in _head_flags(g, xh):
            P = next(c.points for c in g.contours if any(q is C for q in c.points))
            k = next(i for i, q in enumerate(P) if q is C)
            far = P[(k + 1) % len(P)] if P[k - 1] is T else P[k - 1]
            if far.y >= C.y:
                continue                                 # the stroke runs on level or up from the corner: f's bar end
            up = ref - C.y
            if up and abs(up) <= FLAG_REACH:
                for p in group + [C]:
                    p.y += up
                done.append(f"{g.name} {C.y - up}>{C.y}")
    return done
