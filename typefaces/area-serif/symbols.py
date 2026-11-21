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
HOOKS = ("hookabovecomb", "hookabovecomb.case")   # owner round 8, item 18: the Regular, and each master's curl


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


# ------------------------------------------------------------------ owner round 8, item 17: ð's upper stroke
# (called "the bar" in item 10's notes and the brief: the ascender's curve from where it crosses the bar up to its cut
# end at the top left, the stroke audit_rays read at (279, 697))
def eth_bar_edges(g):
    """ð's bar: the short straight cut (30 to 60 long between two corners) at the glyph's top left, the curve into
    it (the bar's upper edge) and the curve out of it (its lower edge). Returns (contour, [upper indices from the
    junction to the cut], [lower indices from the cut to the junction]) or None."""
    for ci, c in enumerate(g.contours):
        P = c.points
        n = len(P)
        best = None
        for i, q in enumerate(P):
            a = P[i - 1]
            if q.type == "line" and a.type and 30 <= ((a.x - q.x) ** 2 + (a.y - q.y) ** 2) ** 0.5 <= 60:
                key = -(a.y + q.y) + (a.x + q.x)       # top left
                if P[i - 2].type is None and P[(i + 1) % n].type is None and (best is None or key < best[0]):
                    best = (key, i)
        if best:
            i = best[1]
            up = [(i - 4) % n, (i - 3) % n, (i - 2) % n, (i - 1) % n]
            lo = [i, (i + 1) % n, (i + 2) % n, (i + 3) % n]
            if P[up[0]].type and P[lo[3]].type:
                return ci, up, lo
    return None


def eth_bar(reg, font, name="eth"):
    """ð's upper stroke (the ascender's curve past the crossing, up to its cut end) keeps the Regular's thickness times
    the hairline's law in this master (o's top, as amp reads it): its
    centreline as the engine left it, each pair of points across it (the cut's corners, the handles, the junction's
    corners) set apart by the Regular's offset times the law; the junction's corners slide along the ascender's edges.
    The engine read it as a part of the ascender's thick: 51.7 at 300 against 48.4 at 400 at its middle (audit_rays 53.1
    against 50.4, (279, 697)), 53.0 at the Bold (1.10)."""
    if name not in reg or name not in font:
        return None
    e0, e1 = eth_bar_edges(reg[name]), eth_bar_edges(font[name])
    if not e0 or not e1 or e0[1:] != e1[1:]:
        return f"{name}: bar not found, left"
    law = A.readings(font)["h"] / A.readings(reg)["h"]
    ci, up, lo = e1
    R = reg[name].contours[ci].points
    P = font[name].contours[ci].points
    pairs = list(zip(up, reversed(lo)))                # junction-upper with junction-lower ... cut corners
    before = []
    for k, (u, l_) in enumerate(pairs):
        dR = (R[u].x - R[l_].x, R[u].y - R[l_].y)
        c = ((P[u].x + P[l_].x) / 2, (P[u].y + P[l_].y) / 2)
        before.append(round(((P[u].x - P[l_].x) ** 2 + (P[u].y - P[l_].y) ** 2) ** 0.5))
        tu = (c[0] + dR[0] * law / 2, c[1] + dR[1] * law / 2)
        tl = (c[0] - dR[0] * law / 2, c[1] - dR[1] * law / 2)
        for idx, t in ((u, tu), (l_, tl)):
            if k == 0:                                 # a junction corner slides along its other edge (a line)
                n = len(P)
                nb = P[(idx - 1) % n] if idx == up[0] else P[(idx + 1) % n]
                d = A.unit((P[idx].x - nb.x, P[idx].y - nb.y))
                s = (t[0] - P[idx].x) * d[0] + (t[1] - P[idx].y) * d[1]
                t = (P[idx].x + d[0] * s, P[idx].y + d[1] * s)
            P[idx].x, P[idx].y = round(t[0]), round(t[1])
    after = [round(((P[u].x - P[l_].x) ** 2 + (P[u].y - P[l_].y) ** 2) ** 0.5) for u, l_ in pairs]
    return f"{name}: bar x{law:.3f} (pairs across {before} > {after})"


# 0.84 (Regular pass 3, the owner's visual notes, item 2: "§ has some rough parts that need smoothing"). The section
# sign is Libre Baskerville's drawing: two S strokes whose middle loop is the upper stroke's spine and right side over
# the lower stroke's spine and left side. Where each side runs into the other stroke the outline turned at a point:
# the two crotches outside (left at the upper stroke's side, right at the lower's), a notch, and the counter's two ends
# (top left, bottom right), a point between a curve and the spine's straight edge. Each is now a join, not a point:
#   a crotch outside   a concave fillet of SECTION_CROTCH (the @'s a and the ampersand's arm: 0.30 of the stem; the
#                      capitals' 86, figures and signs at cap size), as a branch leaves a stem;
#   a counter's end    the counter is one smooth loop: its end is rounded where the two edges meet, cut back
#                      SECTION_END along each (the turn there is some 60 degrees: a quarter of the loop's own side
#                      radius, 0.5 of the counter's side's width across, so the end turns as the loop's sides do).
# Both by `at.fillet` (both pieces cut back by arc length, one cubic along their tangents, handles 0.55 of the chord).
# In the Regular only (normalize, before spacing): the masters' engine carries the Regular's points, as every other
# point of this drawing.
SECTION_CROTCH = 0.30 * 86
SECTION_END = 0.5



def _segs_of(P):
    """A closed UFO point list [(x, y, type, smooth)] as [(kind, seg)] from its first on-curve point; seg the cubic
    (lines as their thirds)."""
    n = len(P)
    s0 = next(i for i, q in enumerate(P) if q[2])
    Q = P[s0:] + P[:s0]
    out, offs, prev = [], [], Q[0]
    for q in Q[1:] + [Q[0]]:
        if q[2] is None:
            offs.append(q)
            continue
        a, b = (prev[0], prev[1]), (q[0], q[1])
        if len(offs) == 2:
            out.append(("C", (a, (offs[0][0], offs[0][1]), (offs[1][0], offs[1][1]), b), prev[3]))
        else:
            out.append(("L", (a, (a[0] + (b[0] - a[0]) / 3, a[1] + (b[1] - a[1]) / 3),
                              (a[0] + 2 * (b[0] - a[0]) / 3, a[1] + 2 * (b[1] - a[1]) / 3), b), prev[3]))
        prev, offs = q, []
    return out


def _fillet(segs, k, r, share=0.55):
    """at.fillet with its handles on the tangents' meeting point: the corner between segs[k] and segs[k + 1] cut back
    by r along each, joined by one cubic whose handles run share of the way to where the two tangents meet (a sharp
    notch would carry handles of a share of the chord past that point, a loop)."""
    import at as AT
    (ka, sa), (kb, sb) = segs[k], segs[k + 1]
    a_kept, pa, ta = AT._cut(sa, r, True)
    b_kept, pb, tb = AT._cut(sb, r, False)
    t1 = A.meet(pa, ta, pb, (-tb[0], -tb[1]))
    t2 = A.meet(pb, (-tb[0], -tb[1]), pa, ta)
    ch = A.math.dist(pa, pb) if hasattr(A, "math") else 0
    if t1 is None or t2 is None or t1 <= 0 or t2 <= 0:
        t1 = t2 = 0.4 * ch
    f = (pa, (pa[0] + ta[0] * share * t1, pa[1] + ta[1] * share * t1),
         (pb[0] - tb[0] * share * t2, pb[1] - tb[1] * share * t2), pb)
    if ka == "L":
        a_kept = (sa[0], sa[0], pa, pa)
    if kb == "L":
        b_kept = (pb, pb, sb[3], sb[3])
    return segs[:k] + [(ka, a_kept), ("C", f), (kb, b_kept)] + segs[k + 2:]


def _round_end(segs, k, r):
    """A counter's end where a curve meets the spine's straight edge: no new node. The corner slides r along the
    straight and becomes smooth; the curve's handle there turns onto the straight's line, its length 0.55 of the way
    to where the curve's other tangent meets that line (a fillet with new nodes left the Bold's counter ends bending
    2.5 degrees half way, and the § fell back to its upright parts)."""
    (ka, sa), (kb, sb) = segs[k], segs[(k + 1) % len(segs)]
    if (ka == "L") == (kb == "L"):
        return segs
    if ka == "C":                                       # curve in, line out
        c, ln = sa, sb
        d = A.unit((ln[3][0] - ln[0][0], ln[3][1] - ln[0][1]))
        p = (ln[0][0] + d[0] * r, ln[0][1] + d[1] * r)
        t0 = A.unit((c[1][0] - c[0][0], c[1][1] - c[0][1]))
        m = A.meet(c[0], t0, p, (-d[0], -d[1]))
        L = 0.55 * (A.math.dist(p, (c[0][0] + t0[0] * m, c[0][1] + t0[1] * m)) if m and m > 0 else A.math.dist(c[0], p) / 3)
        c2 = (c[0], c[1], (p[0] - d[0] * L, p[1] - d[1] * L), p)
        ln2 = (p, ln[1], ln[2], ln[3])
        out = list(segs); out[k] = (ka, c2); out[(k + 1) % len(segs)] = (kb, ln2)
        return out
    c, ln = sb, sa                                      # line in, curve out
    d = A.unit((ln[0][0] - ln[3][0], ln[0][1] - ln[3][1]))   # from the corner back along the line
    p = (ln[3][0] + d[0] * r, ln[3][1] + d[1] * r)
    t3 = A.unit((c[2][0] - c[3][0], c[2][1] - c[3][1]))
    m = A.meet(c[3], t3, p, (-d[0], -d[1]))
    L = 0.55 * (A.math.dist(p, (c[3][0] + t3[0] * m, c[3][1] + t3[1] * m)) if m and m > 0 else A.math.dist(c[3], p) / 3)
    c2 = (p, (p[0] - d[0] * L, p[1] - d[1] * L), c[2], c[3])
    ln2 = (ln[0], ln[1], ln[2], p)
    out = list(segs); out[k] = (ka, ln2); out[(k + 1) % len(segs)] = (kb, c2)
    return out


def _joins(cs, parts, name="section", evening=True):
    """The joins on §'s contours cs: (new contours, log)."""
    import math
    outer_i = max(range(2), key=lambda k: abs(A.signed_area(cs[k])))
    log = []
    new = []
    for ci, P in enumerate(cs):
        segs = _segs_of(P)
        sgn = 1 if A.signed_area(P) > 0 else -1
        # the corner at the end of segs[k] (between segs[k] and segs[k + 1])
        ks = []
        for k in range(len(segs)):
            (ka, sa, _), (kb, sb, _) = segs[k], segs[(k + 1) % len(segs)]
            d_in = A.unit((sa[3][0] - sa[2][0], sa[3][1] - sa[2][1]))
            d_out = A.unit((sb[1][0] - sb[0][0], sb[1][1] - sb[0][1]))
            turn = math.degrees(math.asin(max(-1, min(1, d_in[0] * d_out[1] - d_in[1] * d_out[0]))))
            ang = math.degrees(math.acos(max(-1, min(1, d_in[0] * d_out[0] + d_in[1] * d_out[1]))))
            if ang < 20:
                continue
            if ci == outer_i and ka == kb == "C" and turn * sgn < 0:
                if "crotch" in parts:
                    ks.append((k, SECTION_CROTCH, "crotch"))
            elif ci != outer_i and "end" in parts:
                ks.append((k, None, "end"))
        segs2 = [(k_, s_) for k_, s_, _ in segs]
        # start the list after a smooth node, so no corner sits at the wrap
        if ks:
            first = next(k for k in range(len(segs)) if k not in {kk for kk, _r, _n in ks})
            rot = (first + 1) % len(segs)
            segs2 = segs2[rot:] + segs2[:rot]
            ks = [((k - rot) % len(segs), r, kind) for k, r, kind in ks]
        for k, r, kind in sorted(ks, reverse=True):
            if r is None:
                # the counter's side across at its widest (the loop's stroke): half of it
                xs = [q[0] for q in P if q[2]]
                r = SECTION_END * (max(xs) - min(xs)) / 4
            segs2 = _fillet(segs2, k, r) if kind == "crotch" else _round_end(segs2, k, r)
            log.append(f"{kind} {r:.0f}")
        Pn = A.to_points(segs2)
        if (A.signed_area(Pn) > 0) != (A.signed_area(P) > 0):
            Pn = A._reverse(Pn)
        new.append(Pn)
    # then every smooth node at one curvature (loops.even_nodes, handle lengths only), kept where curvecheck's faults
    # on the glyph fall (the fillets meet their curves tangent only)
    import curvecheck as K
    import loops as LP
    yr = (-1000, 2000)
    b0, w0 = K.report(name, new, yr)[:2]
    ev = [[(round(q[0]), round(q[1]), q[2], q[3]) for q in LP.even_nodes(P, yr)[0]] for P in new]
    b1, w1 = K.report(name, ev, yr)[:2]
    if evening and (len(b1), w1) < (len(b0), w0):
        new = ev
        log.append(f"evened ({len(b0)} > {len(b1)} faults, worst {w0:.2f} > {w1:.2f})")
    return new, log


def section_joins(font, name="section"):
    """The rule above on the Regular's §. Corners found by geometry: on the outline every corner between two curves
    that turns into the ink (a crotch), on the counter every corner (its ends). Guarded by the masters: of the forms
    below, the first the Bold's and the Light's engine carry soundly (`bold.glyph_bold` with no fallback) is kept: the
    counter's ends moved the engine's reading of the spine's straight edges (a node bending 1.8 to 2.5 degrees half
    way, the § fell back to its upright parts at the Bold)."""
    import bold as BOLD
    from ufoLib2.objects import Point
    if name not in font:
        return f"{name}: none"
    g = font[name]
    cs = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]
    if len(cs) != 2 or g.lib.get("area.section_joins"):
        return f"{name}: {len(cs)} contours; left"
    tried = []
    for parts, ev in ((("crotch", "end"), True), (("crotch", "end"), False), (("crotch",), True), (("crotch",), False)):
        new, log = _joins(cs, parts, name, ev)
        for c, Pn in zip(g.contours, new):
            c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in Pn]
        bad = [st for st in (BOLD.STEM, 55.0) if BOLD.glyph_bold(g, BOLD.vector(st))[2].get("fallback")]
        if not bad:
            g.lib["area.section_joins"] = 1
            return f"{name}: " + ", ".join(log) + (f" (masters refused: {'; '.join(tried)})" if tried else "")
        tried.append("+".join(parts) + (" evened" if ev else "") + f" at {bad}")
    for c, P in zip(g.contours, cs):
        c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
    return f"{name}: left ({'; '.join(tried)})"
