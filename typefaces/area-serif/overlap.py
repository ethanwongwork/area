"""Area Serif 0.81: a letter with strokes across it, as overlapping contours in the variable font.

The static Regular keeps one merged outline per struck glyph (normalize, charset.put). A merged outline has corners
where a stroke's edge meets the letter's edge; such a corner is where two edge lines cross, and when both lines move
between two masters the crossing does not move in a straight line (it misses by about t(1 - t) times the move over
the sine of the angle between them), so the instance between the masters gains slivers, crossings and turns that no
master has (Astroke, Estroke, cstroke, won, the colon sign: build 0.80). In the variable font's masters such a glyph
is the finished letter's own contours and each stroke as one closed contour of its own, overlapping it; the
renderer fills the union (non-zero winding, the overlap flag set). Every master takes the letter as that master's
letter, point for point, and each stroke by one rule (`move_stroke`): its two ends ride the letter's node map, its
two long sides stay parallel and part by the stroke's own weight rule.

Where it lives: the Regular UFO's layer "overlap" holds the overlapping form of each struck glyph; the Bold and
Light UFOs hold it in their default layer; build.variable puts the overlap layer in the Regular source.
"""
import math

import pathops

LAYER = "overlap"


def _path_contours(path):
    """A pathops Path's contours as [[(x, y, type, smooth)]], whole units, curves cubic."""
    import ufoLib2
    import charset as CHARSET
    f = ufoLib2.Font()
    g = f.newGlyph("_")
    CHARSET._draw_cubic(path, g.getPen())
    return [[(round(p.x), round(p.y), p.type, p.smooth) for p in c.points] for c in g.contours]


def _soft(contours):
    """The letters' soft corners (charset.soft_ends) on a lone stroke's cut ends."""
    import ufoLib2
    from ufoLib2.objects import Contour, Point
    import charset as CHARSET
    f = ufoLib2.Font()
    g = f.newGlyph("_stroke")
    for P in contours:
        c = Contour()
        c.points = [Point(x, y, t, smooth=s) for x, y, t, s in P]
        g.contours.append(c)
    CHARSET.soft_ends(f, skip=set())
    return [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in g.contours]


def _ccw(P):
    a = sum(P[i][0] * P[(i + 1) % len(P)][1] - P[(i + 1) % len(P)][0] * P[i][1] for i in range(len(P)))
    return a > 0


def _orient(P, ccw):
    """A closed contour turned to run the other way when its direction is not `ccw` (start point kept on a node)."""
    if _ccw(P) == ccw:
        return P
    on = [i for i, q in enumerate(P) if q[2] is not None]
    # reverse: segment types move to the other end of each segment
    n = len(P)
    rev = list(reversed(P))
    types = [q[2] for q in P]
    out = []
    # In reversed order, a node's type is the type of the node that followed it in the original (what arrives at
    # it now is what left it before).
    for k, q in enumerate(rev):
        i = n - 1 - k
        if q[2] is None:
            out.append(q)
            continue
        j = (i + 1) % n                     # original next point
        while P[j][2] is None:
            j = (j + 1) % n
        nxt_type = types[j]
        out.append((q[0], q[1], "curve" if P[(i + 1) % n][2] is None else "line", q[3]) if nxt_type else q)
    del on
    return out


def letter_contours(font, letter):
    """A letter's own contours (its overlapping form when it is struck itself, as dong's dcroat), components drawn."""
    src = font.layers[LAYER][letter] if LAYER in font.layers and letter in font.layers[LAYER] else font[letter]
    out = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in src.contours]
    for comp in src.components:
        t = comp.transformation
        for P in letter_contours(font, comp.baseGlyph):
            out.append([(t[0] * x + t[2] * y + t[4], t[1] * x + t[3] * y + t[5], ty, s) for x, y, ty, s in P])
    return out


def source_struck(font):
    """Before normalize merges them: every source glyph that is a letter (one component) and strokes (its own
    contours). {name: (letter, (dx, dy), [contours])}."""
    import re
    out = {}
    for g in font:
        if g.components and g.contours and re.search(r"(stroke|bar|middletilde)$", g.name) and len(g.components) == 1:
            c = g.components[0]
            t = tuple(c.transformation)
            if t[:4] != (1, 0, 0, 1):
                continue
            out[g.name] = (c.baseGlyph, (t[4], t[5]), [[(p.x, p.y, p.type, p.smooth) for p in k.points] for k in g.contours])
    return out


def ink_deviation(a_contours, merged_glyph, font, px=4):
    """How far the ink of `a_contours` (non-zero winding) strays from the merged glyph's ink, in units: both are
    filled at `px` pixels a unit, and the widest piece of ink that one has and the other has not is measured across
    (twice the largest circle inside it). A second method: rasterised ink, not the outlines' own arithmetic. An
    edge moved by e reads e; a 3-unit sliver of white that the merge filled reads 3, wherever it sits."""
    import numpy as np
    from scipy import ndimage
    m = [[(p.x, p.y, p.type, p.smooth) for p in c.points] for c in merged_glyph.contours]
    for comp in merged_glyph.components:
        t = comp.transformation
        m += [[(t[0] * x + t[2] * y + t[4], t[1] * x + t[3] * y + t[5], ty, sm) for x, y, ty, sm in P]
              for P in letter_contours(font, comp.baseGlyph)]
    A, M = raster(a_contours, px, m), raster(m, px, a_contours)
    D = A ^ M
    if not D.any():
        return 0.0
    return 2 * float(ndimage.distance_transform_edt(D).max()) / px


def contour_deviation(a_contours, b_contours, px=4):
    """ink_deviation between two sets of contours (both filled non-zero)."""
    from scipy import ndimage
    A, M = raster(a_contours, px, b_contours), raster(b_contours, px, a_contours)
    D = A ^ M
    return 0.0 if not D.any() else 2 * float(ndimage.distance_transform_edt(D).max()) / px


def raster(contours, px, also=()):
    """A boolean image of contours' ink, non-zero winding, px pixels a unit, over the box of both sets."""
    import numpy as np
    import skia
    pts = [q for P in list(contours) + list(also) for q in P]
    x0, y0 = min(q[0] for q in pts) - 4, min(q[1] for q in pts) - 4
    x1, y1 = max(q[0] for q in pts) + 4, max(q[1] for q in pts) + 4
    W, H = int((x1 - x0) * px) + 1, int((y1 - y0) * px) + 1
    path = skia.Path()
    path.setFillType(skia.PathFillType.kWinding)
    tr = lambda q: ((q[0] - x0) * px, (y1 - q[1]) * px)    # noqa: E731
    for P in contours:
        on = [i for i, q in enumerate(P) if q[2] is not None]
        n = len(P)
        s0 = on[0]
        path.moveTo(*tr(P[s0]))
        buf = []
        for step in range(1, n + 1):
            q = P[(s0 + step) % n]
            if q[2] is None:
                buf.append(q)
                continue
            if len(buf) == 2:
                path.cubicTo(*tr(buf[0]), *tr(buf[1]), *tr(q))
            elif len(buf) == 1:
                path.quadTo(*tr(buf[0]), *tr(q))
            else:
                path.lineTo(*tr(q))
            buf = []
        path.close()
    surf = skia.Surface(W, H)
    c = surf.getCanvas()
    c.clear(skia.ColorBLACK)
    paint = skia.Paint(Color=skia.ColorWHITE, AntiAlias=False)
    c.drawPath(path, paint)
    img = surf.makeImageSnapshot().toarray()
    return img[..., 0] > 127


def _draw(P, pen):
    on = [i for i, q in enumerate(P) if q[2] is not None]
    n = len(P)
    s = on[0]
    pen.moveTo(P[s][:2])
    k = s
    buf = []
    for step in range(1, n + 1):
        i = (s + step) % n
        q = P[i]
        if q[2] is None:
            buf.append(q[:2])
            continue
        if buf:
            pen.curveTo(*buf, q[:2])
        else:
            pen.lineTo(q[:2])
        buf = []
        k = i
    del k
    pen.closePath()


def _flatten(path, step=1.0):
    pts = []
    cur = start = None
    for verb, P in path.segments:
        if verb == "moveTo":
            cur = start = P[0]
            pts.append(cur)
        elif verb == "lineTo":
            a, b = cur, P[0]
            n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / step))
            pts += [(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n) for k in range(1, n + 1)]
            cur = b
        elif verb == "curveTo":
            a, (b, c, d) = cur, P
            for k in range(1, 17):
                t = k / 16
                u = 1 - t
                pts.append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
                            u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]))
            cur = d
        elif verb == "qCurveTo":
            for q in P:
                pts.append(q)
            cur = P[-1]
        elif verb == "closePath" and start is not None and cur is not None:
            a, b = cur, start
            n = max(1, int(math.hypot(b[0] - a[0], b[1] - a[1]) / step))
            pts += [(a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n) for k in range(1, n)]
    return pts


def build_layer(font, source, charset_struck):
    """The layer of overlapping forms, after every rule has run on the merged glyphs. source: source_struck()'s
    result, taken before the merge; charset_struck: charset.STRUCK. Returns {name: ink deviation from the merged}."""
    from ufoLib2.objects import Contour, Point
    if LAYER in font.layers:
        del font.layers[LAYER]
    layer = font.layers.newLayer(LAYER)
    plan = {}
    for name, (letter, off, strokes) in source.items():
        plan[name] = (letter, off, [P for P in strokes])
    for name, (letter, paths) in charset_struck.items():
        cs = []
        for p in paths:
            cs += _path_contours(pathops.op(p, pathops.Path(), pathops.PathOp.UNION, fix_winding=True, keep_starting_points=False, clockwise=False))
        plan[name] = (letter, None, cs)
    report = {}
    order = sorted(plan, key=lambda n: plan[n][0] in plan)       # a struck letter before what is built on it
    for name in order:
        if name not in font:
            continue
        letter, off, strokes = plan[name]
        L = letter_contours(font, letter)
        merged = font[name]
        mx = [p.x for c in merged.contours for p in c.points]
        if off is None:                                        # charset placed the union by its bearings
            import charset as CHARSET
            lp = CHARSET.glyph_path(font, letter)
            u = CHARSET.union(lp, *[_to_path([P]) for P in strokes])
            off = (round(min(mx) - CHARSET.bounds(u)[0]), 0)
        L = [[(x + off[0], y + off[1], t, s) for x, y, t, s in P] for P in L]
        S = [[(x + (off[0] if name not in source else 0), y + (off[1] if name not in source else 0), t, s) for x, y, t, s in P]
             for P in strokes]
        S = [[(round(x), round(y), t, s) for x, y, t, s in P] for P in S]
        outer_ccw = _ccw(max(L, key=lambda P: abs(sum(P[i][0] * P[(i + 1) % len(P)][1] - P[(i + 1) % len(P)][0] * P[i][1] for i in range(len(P))))))
        S = _soft([_orient(P, outer_ccw) for P in S])
        S, _inset = inset_ends(L, S)                           # 0.81: a stroke's side never on the letter's edge
        g = layer.newGlyph(name)
        g.width = merged.width
        g.unicodes = list(merged.unicodes)
        for P in L + S:
            c = Contour()
            c.points = [Point(x, y, t, smooth=s) for x, y, t, s in P]
            g.contours.append(c)
        for a in merged.anchors:
            g.appendAnchor({"name": a.name, "x": a.x, "y": a.y})
        g.lib["area.overlap"] = {"letter": letter, "offset": list(off), "letter_contours": len(L)}
        report[name] = round(ink_deviation(L + S, merged, font), 2)
    return report


def _to_path(contours):
    p = pathops.Path()
    pen = p.getPen()
    for P in contours:
        _draw(P, pen)
    return p


# ---------------------------------------------------------------- the stroke in another master

def _frame(P):
    """A stroke contour's axis: (centre, u along, n across, s range, d range) from its longest straight edge."""
    on = [q for q in P if q[2] is not None]
    best = None
    n = len(P)
    for i, q in enumerate(P):
        if q[2] is None:
            continue
        j = (i + 1) % n
        if P[j][2] == "line":
            L = math.dist(q[:2], P[j][:2])
            if best is None or L > best[0]:
                best = (L, q, P[j])
    if best is None:                                           # no straight edge: the box's long side
        xs, ys = [q[0] for q in on], [q[1] for q in on]
        u = (1.0, 0.0) if max(xs) - min(xs) >= max(ys) - min(ys) else (0.0, 1.0)
    else:
        d = (best[2][0] - best[1][0], best[2][1] - best[1][1])
        L = math.hypot(*d)
        u = (d[0] / L, d[1] / L)
        if u[0] < -1e-9 or (abs(u[0]) < 1e-9 and u[1] < 0):
            u = (-u[0], -u[1])
    nrm = (-u[1], u[0])
    cx = sum(q[0] for q in on) / len(on)
    cy = sum(q[1] for q in on) / len(on)
    s = [(q[0] - cx) * u[0] + (q[1] - cy) * u[1] for q in P]
    d = [(q[0] - cx) * nrm[0] + (q[1] - cy) * nrm[1] for q in P]
    return (cx, cy), u, nrm, s, d


def stroke_weight(T, u, v):
    """A stroke's thickness in another master: a level bar by the bars' rule, an upright one by the upright thin
    strokes', a slanted one by the thin diagonals' (bold.y_target, x_target, diag_target)."""
    import bold as B
    ang = abs(math.degrees(math.atan2(u[1], u[0])))
    ang = min(ang, 180 - ang)
    if ang <= 10:
        w = B.y_target(round(T), True, v)
    elif ang >= 80:
        w = B.x_target(round(T), True, v)
    else:                                                      # 0.81 round 2: a stroke across a letter is a
        w = B.thin_law(v, lambda ft: T * (1 + (B.HAIR_RATIO - 1) * ft))   # hairline, slanted or not (the thin diagonal's
    return T if w is None else w                               # 1.32 closed Astroke's pockets from 625)


def move_stroke(P, mapx, mapy, v):
    """One stroke contour into another master. Its two ends ride the letter's node map (mapx, mapy: functions of a
    Regular coordinate); its long sides stay straight and parallel and part by stroke_weight; each end cap (the
    corners within one stroke width of the end) moves with its end without changing shape."""
    (cx, cy), u, nrm, s, d = _frame(P)
    on = [k for k, q in enumerate(P) if q[2] is not None]
    s0, s1 = min(s[k] for k in on), max(s[k] for k in on)
    d0, d1 = min(d[k] for k in on), max(d[k] for k in on)
    T = d1 - d0
    dm = (d0 + d1) / 2
    ends = [(cx + u[0] * sv + nrm[0] * dm, cy + u[1] * sv + nrm[1] * dm) for sv in (s0, s1)]
    new_ends = [(mapx(e[0]), mapy(e[1])) for e in ends]
    du = (new_ends[1][0] - new_ends[0][0], new_ends[1][1] - new_ends[0][1])
    L1 = math.hypot(*du)
    u2 = (du[0] / L1, du[1] / L1)
    n2 = (-u2[1], u2[0])
    T2 = stroke_weight(T, u, v)
    grow = (T2 - T) / 2
    cap = min(T, (s1 - s0) / 3)
    out = []
    for k, q in enumerate(P):
        b = d[k] - dm
        side = 1 if b > 0 else -1 if b < 0 else 0
        b2 = b + side * grow if abs(b) > 0.25 * T else b * T2 / T
        if s[k] - s0 <= cap:
            a = s[k] - s0
            base = new_ends[0]
        elif s1 - s[k] <= cap:
            a = s[k] - s1
            base = new_ends[1]
        else:                                                  # along the long sides: in proportion
            a = (s[k] - s0) * (L1 / (s1 - s0) if s1 > s0 else 1)
            base = new_ends[0]
            if s[k] - s0 > (s1 - s0) / 2:
                a = (s[k] - s1) * (L1 / (s1 - s0) if s1 > s0 else 1)
                base = new_ends[1]
        x = base[0] + u2[0] * a + n2[0] * b2
        y = base[1] + u2[1] * a + n2[1] * b2
        out.append((round(x), round(y), q[2], q[3]))
    return out


def vf_source(ufo):
    """The Regular as the variable font's default master: the static Regular, with each struck glyph's merged
    outline replaced by its letter and strokes as overlapping contours (the layer normalize wrote). The static
    TTF keeps the merged outlines, overlaps removed."""
    import copy
    reg = copy.deepcopy(ufo)
    if LAYER in reg.layers:
        for og in reg.layers[LAYER]:
            g = reg[og.name]
            g.clearContours()
            for c in og.contours:
                g.contours.append(copy.deepcopy(c))
        del reg.layers[LAYER]
    from ufoLib2.objects import Contour, Point
    for name in curl_names(reg):                               # 0.81 (last round): the hook above, curl and stem
        g = reg[name]
        parts = curl_parts([(p.x, p.y, p.type, p.smooth) for p in g.contours[0].points])
        g.clearContours()
        for P in parts:
            c = Contour()
            c.points = [Point(x, y, t, smooth=s_) for x, y, t, s_ in P]
            g.contours.append(c)
    return reg


def struck_names(ufo):
    return ([g.name for g in ufo.layers[LAYER]] if LAYER in ufo.layers else []) + curl_names(ufo)


# ---------------------------------------------------------------- a curl on a stem (0.81, last round)
#
# The hook above (U+0309, its capital form) is a curl whose stroke runs round a small eye and into a short stem. Drawn
# as one outline, the eye's opening (the slot between the curl's ball and the stem's top) is a few units wide; the
# engine reads the outline's knots, the stroke gains inward, and the slot and the eye close (the capital form crossed
# itself at 552). In the variable font's masters it is two parts, overlapping as the struck letters' strokes do: the
# curl (its outline from the stem's right edge round to the eye's foot, closed by a line inside the stem) and the
# stem (from the eye's foot down to its foot). The static Regular keeps the one merged outline.

CURLS = ("hookabovecomb", "hookabovecomb.case")


def curl_names(ufo):
    return [n for n in CURLS if n in ufo and len(ufo[n].contours) == 1 and not ufo[n].components]


def _stem_top(P):
    """The stem's left edge: the longest upright line of the outline; the index of its upper node."""
    best = None
    n = len(P)
    for i, q in enumerate(P):
        j = (i + 1) % n
        if q[2] is not None and P[j][2] == "line" and abs(P[j][0] - q[0]) < 0.5:
            L = abs(P[j][1] - q[1])
            if best is None or L > best[0]:
                best = (L, i if q[1] > P[j][1] else j)
    return best[1]


def curl_parts(P, t=None):
    """(curl, stem) from the merged outline P (Regular or a master: the same points). The curl is P[0] (the
    stem's right edge, where the curl leaves it) round to the node before the stem's left top; the line that
    closes it runs inside the stem. The stem is the rest, closed by its top right corner (x of P[0], y of its
    left top)."""
    t = _stem_top(P) if t is None else t
    assert P[0][2] == "line" and P[t][2] == "line"
    curl = [tuple(q) for q in P[:t]]
    stem = [tuple(q) for q in P[t:]] + [(P[0][0], P[t][1], "line", False)]
    return [curl, stem]


def _eye(P, t):
    """The eye's points: from the handle after the ball's lowest node (the curl's lowest node left of the stem) to
    the node before the stem: [indices]; and its nodes."""
    xl = P[t][0]
    low = min((i for i in range(t) if P[i][2] is not None and P[i][0] < xl), key=lambda i: P[i][1])
    idx = list(range(low + 2, t))
    return idx, [i for i in idx if P[i][2] is not None]


def curl_master(R, N, mapx, mapy, v, least):
    """A master's curl and stem from the Regular's merged outline R and the engine's merged reading N of it.

    The eye is a counter: its points are the Regular's, about the eye's centre, times least(w) / w (the white law's
    least for its width w: under the letters' floor a white keeps its own width), centred where the engine put the
    eye's centre; the curl's other points are the engine's, so its stroke gains outward, round the eye. The stem is
    a stroke (move_stroke on the node map) whose top is the eye's foot. Where the slot, the white between the curl
    and the stem's side, comes under least(its Regular width), the stem's side gives way into the stem by at most
    what the stem gained (white.keep_white's rule). Towards the Bold only, as keep_white: towards the Light every
    part thins and the whites open by themselves (there the engine's eye; the eye rule's 1.05 bent the ball's inner
    curve, which the engine had moved, into an inflection). Returns ([curl, stem], log)."""
    import numpy as np
    t = _stem_top(R)
    idx, eye_nodes = _eye(R, t)
    xs, ys = [R[i][0] for i in eye_nodes], [R[i][1] for i in eye_nodes]
    cR = ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2)
    nx, ny = [N[i][0] for i in eye_nodes], [N[i][1] for i in eye_nodes]
    cN = ((min(nx) + max(nx)) / 2, (min(ny) + max(ny)) / 2)
    w0 = max(xs) - min(xs)
    k = least(w0) / w0
    M = [tuple(q) for q in N]
    for i in (idx if v["f"] > 0 else []):                     # towards the Light whites open by themselves
        q = R[i]
        M[i] = (round(cN[0] + (q[0] - cR[0]) * k), round(cN[1] + (q[1] - cR[1]) * k)) + tuple(q[2:])
    curlR, stemR = curl_parts(R, t)
    curl = curl_parts(M, t)[0]
    foot = M[t - 1][1]                                          # the eye's foot: the stem's top
    top = R[t][1]
    stem = move_stroke(stemR, mapx, lambda y: foot if abs(y - top) < 0.5 else mapy(y), v)
    # the slot: the white between the curl and the stem's side, read where neither part's ink covers the other's edge
    slot0, side = slot(curlR, stemR)
    log = [("eye", round(w0, 1), round(w0 * k, 1) if v["f"] > 0 else "engine")]
    if slot0 is None or v["f"] <= 0:
        return [curl, stem], log
    want = least(slot0)
    got, _ = slot(curl, stem)
    if got is not None and got < want - 0.5:
        (cx, cy), u, nrm, s, d = _frame(stemR)
        T = max(d) - min(d)
        _, _, _, _, d2 = _frame(stem)
        gain = max(0.0, (max(d2) - min(d2) - T) / 2)
        give = min(want - got, gain)
        xe = min(q[0] for q in stem if q[2] is not None) if side < 0 else max(q[0] for q in stem if q[2] is not None)
        dx = round(-side * give)
        stem = [(q[0] + dx, q[1]) + tuple(q[2:]) if abs(q[0] - xe) <= 8 else q for q in stem]
        log.append(("slot", round(got, 1), round(want, 1), round(slot(curl, stem)[0] or 0, 1)))
    return [curl, stem], log


def slot(curl, stem):
    """The narrowest white between the curl's outline and the stem's side (each read only where it is not under
    the other part's ink), the white between them checked on a raster: (width, side of the stem it is on, -1 left
    or 1 right) or (None, 0)."""
    import numpy as np
    import white as WHITE
    ink, (x0, y0) = WHITE.raster([curl, stem])
    ink_c, (xc, yc) = WHITE.raster([curl])
    ink_s, (xs_, ys_) = WHITE.raster([stem])

    def inside(img, o, p):
        x, y = int(round(p[0] - o[0])), int(round(p[1] - o[1]))
        return 0 <= y < img.shape[0] and 0 <= x < img.shape[1] and bool(img[y, x])
    A = np.array([p[:2] for p in WHITE._dense(curl, 1.0) if not inside(ink_s, (xs_, ys_), p)])
    sx = [q[0] for q in stem if q[2] is not None]
    Bp = np.array([p[:2] for p in WHITE._dense(stem, 1.0) if not inside(ink_c, (xc, yc), p)
                   and min(abs(p[0] - min(sx)), abs(p[0] - max(sx))) < 0.5])
    if not len(A) or not len(Bp):
        return None, 0
    D = np.hypot(A[:, None, 0] - Bp[None, :, 0], A[:, None, 1] - Bp[None, :, 1])
    for o in np.argsort(D, axis=None):
        i, j = np.unravel_index(o, D.shape)
        if D[i, j] < 0.5:
            continue
        a, b = A[i], Bp[j]
        if not any(inside(ink, (x0, y0), a + (b - a) * f) for f in (0.3, 0.5, 0.7)):
            side = -1 if abs(b[0] - min(sx)) < 0.5 else 1
            return float(D[i, j]), side
    return None, 0


# ---------------------------------------------------------------- a stroke's end inside the letter (0.81, integration)

def coincident(L, P, tol=1.0, least=2.0):
    """Straight edges of the stroke P that lie on a straight edge of the letter L (within tol across, overlapping
    by more than `least` along): [(stroke edge (i, j), letter edge, overlap length)]."""
    def lines(C):
        out = []
        n = len(C)
        on = [i for i, q in enumerate(C) if q[2] is not None]
        for k, i in enumerate(on):
            j = on[(k + 1) % len(on)]
            if C[j][2] == "line":
                out.append((C[i][:2], C[j][:2], (i, j)))
        return out
    found = []
    for a, b, ij in lines(P):
        L_ = math.dist(a, b)
        if L_ < 1:
            continue
        u = ((b[0] - a[0]) / L_, (b[1] - a[1]) / L_)
        for Cc in L:
            for c, d, _ in lines(Cc):
                hc = (c[0] - a[0]) * -u[1] + (c[1] - a[1]) * u[0]
                hd = (d[0] - a[0]) * -u[1] + (d[1] - a[1]) * u[0]
                if abs(hc) > tol or abs(hd) > tol:
                    continue
                sc = (c[0] - a[0]) * u[0] + (c[1] - a[1]) * u[1]
                sd = (d[0] - a[0]) * u[0] + (d[1] - a[1]) * u[1]
                ov = min(L_, max(sc, sd)) - max(0.0, min(sc, sd))
                if ov > least:
                    found.append((ij, (c, d), round(ov, 1)))
    return found


def inset_ends(L, S):
    """A stroke whose straight side lies on one of its letter's edges (two edges on one line: renderers anti-alias
    each, so the seam shows; in the Light, Ɍ's stroke runs on along R's bowl bar, its top on the counter's floor for
    74 units) stops where that edge begins: its inner end, with its cap, is drawn back to the edge's near end (seen
    from the stroke's outer end, the end outside the letter) plus the cap's radius, so the letter's own stroke
    carries on alone. Only strokes with such a side move. L: the letter's contours; S: the
    strokes. Returns (strokes, [(stroke, units drawn back, ink change in square units)])."""
    out, log = [], []
    whole = pathops.op(_to_path(L + S), pathops.Path(), pathops.PathOp.UNION).area
    letter = _to_path(L)
    import numpy as np
    for k, P in enumerate(S):
        if not coincident(L, P):
            out.append(P)
            continue
        (cx, cy), u, nrm, s, d = _frame(P)
        on = [m for m, q in enumerate(P) if q[2] is not None]
        s0, s1 = min(s[m] for m in on), max(s[m] for m in on)
        dm = (min(d[m] for m in on) + max(d[m] for m in on)) / 2
        T = max(d[m] for m in on) - min(d[m] for m in on)
        cap = min(T, (s1 - s0) / 3)
        ink = [letter.contains((cx + u[0] * t + nrm[0] * dm, cy + u[1] * t + nrm[1] * dm)) for t in (s0 + 1, s1 - 1)]
        outer = 0 if not ink[0] else (1 if not ink[1] else None)
        if outer is None:
            out.append(P)
            continue
        # where the letter's edge it lies along begins, seen from the stroke's outer end
        ends_ = [(e_[0] - cx) * u[0] + (e_[1] - cy) * u[1] for _, edge, _ in coincident(L, P) for e_ in edge]
        end_s = min(ends_) if outer == 0 else max(ends_)
        R_ = 7                                                 # the stroke ends' soft corner (charset.soft_ends)
        shift = (s1 - (end_s + R_)) if outer == 0 else ((end_s - R_) - s0)
        if shift <= 0:
            out.append(P)
            continue
        Q = []
        for m, q in enumerate(P):
            near = (s1 - s[m] <= cap) if outer == 0 else (s[m] - s0 <= cap)
            sgn = -1 if outer == 0 else 1
            Q.append((round(q[0] + sgn * u[0] * shift), round(q[1] + sgn * u[1] * shift)) + tuple(q[2:]) if near else q)
        out.append(Q)
        S_ = out + S[k + 1:]
        a = pathops.op(_to_path(L + S_), pathops.Path(), pathops.PathOp.UNION).area
        log.append((k, round(shift), round(a - whole, 1)))
    return out, log
