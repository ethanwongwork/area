"""Area Serif 0.82 (owner round 8, item 10): symbols whose strokes the engine read the wrong way along the axis.

Each rule here runs in a master (bold.bold_font, after the engine and the signs) on glyphs the engine has already
moved, and puts back one stroke's thickness from a law read on the master's own letters, so that no place is thinner
at a heavier weight. Points are found by what they are (a level line of a given length), never by their numbers.
"""
import amp as A


def _levels(P, least):
    """The level straight lines of a UFO point list at least `least` long: [(y, x0, x1)]."""
    on = [q for q in P if q.type]
    out = []
    n = len(P)
    for i, q in enumerate(P):
        if q.type != "line":
            continue
        a = P[i - 1]
        if a.type and a.y == q.y and abs(a.x - q.x) >= least:
            out.append((q.y, min(a.x, q.x), max(a.x, q.x)))
    return out


def _span_mid(font, name, frac=0.5, k=1):
    """The k-th span (from the bottom) of a glyph's ink on the upright at frac of its width."""
    P = A._flat(font[name])
    xs = [q[0] for Q in P for q in Q]
    x = min(xs) + (max(xs) - min(xs)) * frac
    sp = A._spans(P, x, 0)
    return sp[k][1] - sp[k][0]


def bar_law(reg, font):
    """A capital's level middle stroke: E's middle arm in this master over the Regular's."""
    return _span_mid(font, "E") / _span_mid(reg, "E")


def schwa_bar(reg, font, name="Schwa"):
    """Ə's bar: the Regular's thickness times the capitals' middle-arm law, about the bar's middle as the engine left
    it. The bar's top is the outer contour's long level line, its underside the lower counter's; the points on the
    bar's top (its level line, the left end's corner and the curve into the bowl's right side up to 20 units above)
    and on the counter's top (its level line and the handles beside it) move level by the change."""
    if name not in reg or name not in font:
        return None
    def bar(g):
        top = [(y, x0, x1, ci) for ci, c in enumerate(g.contours) for (y, x0, x1) in _levels(c.points, 200)]
        if len(top) != 2:
            return None
        (b, *_), (t, *_) = sorted(top)[0], sorted(top)[1]
        return t, b, sorted(top)
    r, m = bar(reg[name]), bar(font[name])
    if not r or not m:
        return f"{name}: bar not found, left"
    law = bar_law(reg, font)
    t0, b0, _ = r
    t, b, lines = m
    want = (t0 - b0) * law
    c = (t + b) / 2
    dt, db = round(c + want / 2 - t), round(c - want / 2 - b)
    (yb, bx0, bx1, cb), (yt, tx0, tx1, ct) = lines
    g = font[name]
    for q in g.contours[ct].points:                      # whole on the top line; fading over 30 units below it
        if not tx0 - 45 <= q.x <= tx1 + 20:              # (the left end's corner) and 40 above it (the curve into
            continue                                     # the bowl's right side)
        if abs(q.y - t) <= 1:
            q.y += dt
        elif t - 30 < q.y < t:
            q.y += round(dt * (q.y - (t - 30)) / 30)
        elif t < q.y < t + 40:
            q.y += round(dt * (1 - (q.y - t) / 40))
    for q in g.contours[cb].points:
        if q.y >= b - 10:
            q.y += db
    return f"{name}: bar {t - b} > {t - b + dt - db} (Regular {t0 - b0} x {law:.3f})"


def _rigid(P, delta):
    """Moves each node of a contour upright by delta(node), its handles with it (a smooth node's two handles stay on
    one line); a handle between two nodes goes with the nearer."""
    n = len(P)
    on = [i for i, q in enumerate(P) if q.type]
    d = {i: delta(P[i]) for i in on}
    for i, q in enumerate(P):
        if q.type:
            continue
        a = next(j for j in on[::-1] + [on[-1]] if j < i) if any(j < i for j in on) else on[-1]
        b = next((j for j in on if j > i), on[0])
        near_ = a if (P[(i - 1) % n].type or not P[(i + 1) % n].type) else b
        q.y += d[near_]
    for i in on:
        P[i].y += d[i]


def _v_spans(g, x):
    return A._spans(A._flat(g), x, 0)


def _question_law(reg, font):
    """? in this master over the Regular: its hook's lower and upper strokes, upright across them at 0.6 of its width
    (the place where neither the ball nor the stem is in the cut)."""
    def at(f):
        P = A._flat(f["question"])
        xs = [q[0] for Q in P for q in Q]
        x = min(xs) + 0.6 * (max(xs) - min(xs))
        sp = [s for s in A._spans(P, x, 0) if s[0] > 200]   # above the dot
        return sp[0][1] - sp[0][0], sp[-1][1] - sp[-1][0]
    (b0, t0), (b1, t1) = at(reg), at(font)
    return b1 / b0, t1 / t0


def glottal_small(reg, font, name="glottalstopsmall"):
    """ɂ: its hook's lower stroke (into the stem) keeps the Regular's thickness times ?'s law for the same stroke (? is the same drawing at another size: its strokes grow 1.04 and 1.07 at the Bold,
    0.96 and 0.98 at the Light). Read upright where the counter's floor (a level line on the stem's right edge) and its
    ceiling (the level node under the top) are; the outer edges stay the engine's, the counter's floor and ceiling
    move level (their handles with them, the neighbouring handles fading over 40 units)."""
    if name not in reg or name not in font or "question" not in font:
        return None
    lb, lt = _question_law(reg, font)

    def read(g):
        P = g.contours[0].points
        xs = [q.x for q in P]
        x = min(xs) + 0.55 * (max(xs) - min(xs))          # right of the stem, left of the bowl's side
        sp = _v_spans(g, x)
        low, up = sp[1], sp[-1]                           # sp[0] is the foot serif
        floor = next((q.y for i, q in enumerate(P) if q.type == "line" and P[i - 1].type and P[i - 1].y == q.y
                      and 5 < abs(P[i - 1].x - q.x) < 60), None)
        ceil_ = [q for i, q in enumerate(P) if q.type == "curve" and abs(q.y - up[0]) < 25 and abs(q.x - x) < 150
                 and (P[i - 1].y == q.y or P[(i + 1) % len(P)].y == q.y)]
        return low, up, floor, (min(ceil_, key=lambda q: abs(q.x - x)).y if ceil_ else None)
    (l0, u0, _f, _c), (l1, u1, yf, yc) = read(reg[name]), read(font[name])
    if yf is None or yc is None:
        return f"{name}: floor or ceiling not found, left"
    tb0, tt0, tb1, tt1 = l0[1] - l0[0], u0[1] - u0[0], l1[1] - l1[0], u1[1] - u1[0]
    db = round(l1[0] + tb0 * lb - l1[1])                # the floor up (or down) to the law
    dc = 0                                              # the ceiling stays: moving it bent the neck from the ball
    # into an S at the Bold (the top stroke grows 1.52 there against ?'s 1.07: heavier, not thinner; left)
    P = font[name].contours[0].points
    ic = max(i for i, q in enumerate(P) if q.type == "curve" and q.y == yc)
    i_f = next(i for i, q in enumerate(P) if q.type == "line" and q.y == yf)
    run = P[min(ic, i_f):max(ic, i_f) + 1]
    xin = max(q.x for q in run)                         # the counter's right side: outer points lie beyond it
    def delta(q):
        if q.x > xin:
            return 0
        if abs(q.y - yf) <= 1:
            return db
        if yf < q.y < yf + 60 and abs(q.y - yc) > 1:
            return round(db * (1 - (q.y - yf) / 60))
        if abs(q.y - yc) <= 1:
            return dc
        if yc - 20 < q.y < yc:
            return round(dc * (1 - (yc - q.y) / 20))
        return 0
    _rigid(P, delta)
    return (f"{name}: lower stroke {tb1:.0f} > {tb0 * lb:.0f}, upper {tt1:.0f} kept (law {tt0 * lt:.0f}) "
            f"(Regular {tb0:.0f}, {tt0:.0f}; ?'s law {lb:.3f}, {lt:.3f})")


def oe_joined(reg, font, v, name="oe"):
    """œ towards the Light: o and e joined as the Regular joins them (charset.diphthongs: o cut 20 past its counter's
    right side at 260, e's left extreme on that side; the union) from this master's o and e, so the join can be no
    heavier than its parts. The engine read the Light's joins as their own strokes and filled the upper one: 70 at 300
    where the Regular has 58 (audit_rays, (555, 464)). Towards the Bold the same union does not keep the Regular's
    structure (the e's 119-unit left stroke meets the o's counter in three more nodes), so the Bold keeps the engine's."""
    if v["f"] >= 0 or name not in font:
        return None
    import charset as C
    import pathops
    e, o = C.gp(font, "e"), C.gp(font, "o")
    o_r = C.scan_h(o, 260)[-1]
    dx = o_r[0] - C.bounds(e)[0]
    o_cut = C.op(o, C.rect(o_r[0] + 20, -100, 2000, 2000), pathops.PathOp.DIFFERENCE)
    tmp = "_oe_joined"
    t = C.put(font, tmp, C.union(o_cut, C.moved(e, dx)), dx + font["e"].width)
    C.REBUILT.discard(tmp)
    g = font[name]
    same = [[p.type for p in c.points] for c in t.contours] == [[p.type for p in c.points] for c in g.contours]
    if same:
        before = g.width
        for c, c2 in zip(g.contours, t.contours):
            for p, p2 in zip(c.points, c2.points):
                p.x, p.y, p.smooth = p2.x, p2.y, p2.smooth
        g.width = t.width
    del font[tmp]
    return f"{name}: o and e joined ({'advance ' + str(before) + ' > ' + str(g.width) if same else 'structure differs, left'})"


EVEN = ("rtail",)


def even_curves(font, name):
    """ɽ: every smooth node between two curves meets at one curvature (loops.even_nodes: the node's two handles change
    length along their own lines, inside the curve's triangle, no new fault). The tail's drawing jumped 1.81 and 2.14
    across two nodes in the Regular, 2.31 and 2.66 in the Bold. Handle lengths only, so every master keeps the
    Regular's structure and its nodes."""
    import loops as L
    import curvecheck as K
    if name not in font:
        return None
    g = font[name]
    cs = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]
    b0, w0 = K.report(name, cs, (-1000, 2000))[:2]
    new = [[(round(q[0]), round(q[1]), q[2], q[3]) for q in L.even_nodes(P, (-1000, 2000))[0]] for P in cs]
    b1, w1 = K.report(name, new, (-1000, 2000))[:2]
    if (len(b1), w1) >= (len(b0), w0):                   # fewer faults, or as many and a smaller worst
        return f"{name}: curvature {w0:.2f} ({len(b0)} faults), left"
    for c, P in zip(g.contours, new):
        for p, q in zip(c.points, P):
            p.x, p.y = q[0], q[1]
    return f"{name}: worst curvature ratio {w0:.2f} > {w1:.2f}, faults {len(b0)} > {len(b1)}"
