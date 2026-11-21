"""Area Serif 0.84 (Regular pass 6, item 4): stray stroke values onto the ladder (ladder.py).

The owner: "The thickness of strokes should be defined to be a range of values and set as a specific number of values
to prevent too much of a wide range of thicknesses across all glyphs." The census of snap084i / snap084j
(build/owner12/study/ladder/offladder.csv) listed the straight strokes off the ladder; these rules put the ones the
owner named on a step, each by moving a stroke's two edges about its middle (whites grow or shrink by what the stroke
gives back, the centreline stays):

- the 4's crossbar: the figures' hairline (FOUR_BAR; it read 57);
- Ə's bar the capitals' hairline, ə's bar e's bar (SCHWA_BAR; 67 and 51);
- the struck letters' bars and slashes: the sign stroke across themselves (struck_strokes, in the source before the
  merge, so the merged Regular and the overlap layer carry one stroke; 56 to 60 and 49 to 71);
- ¶'s two stems the sign stroke (PILCROW; 61), ° sides the sign stroke and top the capitals' hairline (DEGREE; 47);
- ™ ℠ Area's T M S at the small figures' size and weights (they were drawn strokes of 22 to 50).
"""
import math

import ladder as LD

FOUR_BAR = LD.CAP_HAIR
SCHWA_BAR = {"Schwa": LD.CAP_HAIR, "schwa": None}     # None: e's bar, read on the font
# Ə: the bar's top runs into the bowl at a corner the curve rules then even; moving it put a handle past its triangle,
# so Ə's bar thins from its foot (the counter's top) only, the bar's top as drawn ("foot"); ə about its middle
SCHWA_MODE = {"Schwa": "foot", "schwa": "middle"}


def _level_pairs(g, ylo, yhi, min_len=60):
    """Level straight edges (y, contour index) of a glyph between ylo and yhi, each min_len or longer."""
    out = set()
    for ci, c in enumerate(g.contours):
        P = c.points
        n = len(P)
        for i in range(n):
            a, b = P[i], P[(i + 1) % n]
            if a.type and b.type == "line" and a.y == b.y and abs(a.x - b.x) >= min_len and ylo < a.y < yhi:
                out.add((a.y, ci))
    return sorted(out)


def _move_edge(g, ci_set, y_old, dy, soft=8):
    """Every point of the named contours on the level y_old moves upright by dy, with the handles next to it; a corner
    whose other edge is a straight leaning line slides along that line; the points of a soft corner (within `soft`
    upright of the edge, at the end of a level run) move with it."""
    for ci, c in enumerate(g.contours):
        if ci not in ci_set:
            continue
        P = c.points
        n = len(P)
        on_edge = [i for i, p in enumerate(P) if p.type and abs(p.y - y_old) < 0.5]
        moved = set()
        for i in on_edge:
            p = P[i]
            # a leaning straight neighbour: slide along it
            lean = None
            for j in ((i - 1) % n, (i + 1) % n):
                q = P[j]
                if q.type and (P[i].type == "line" if j == (i - 1) % n else q.type == "line") \
                        and abs(q.y - p.y) > 20 and abs(q.x - p.x) > 2:
                    lean = q
            if lean is not None:
                p.x = round(p.x + dy * (lean.x - p.x) / (lean.y - p.y))
            p.y += dy
            moved.add(i)
            for j in ((i - 1) % n, (i + 1) % n):
                if P[j].type is None and j not in moved:
                    P[j].y += dy
                    moved.add(j)
        # soft corners at the edge's ends: off-curve and on-curve points within `soft` of the old edge, not yet moved,
        # whose run reaches the edge without leaving the band
        for i, p in enumerate(P):
            if i in moved or abs(p.y - y_old) > soft or abs(p.y - y_old) < 0.5:
                continue
            for step in (-1, 1):
                k = i
                ok = False
                for _ in range(4):
                    k = (k + step) % n
                    if k in moved and abs(P[k].y - (y_old + dy)) < 0.5:
                        ok = True
                        break
                    if abs(P[k].y - y_old) > soft:
                        break
                if ok:
                    p.y += dy
                    moved.add(i)
                    break


def bar(g, top, bottom, want, top_cs, bottom_cs):
    """A level stroke between the edges `top` and `bottom` (y) made `want` thick about its middle (whole units)."""
    d = (top - bottom) - want
    if not d:
        return 0
    down = round(d / 2)
    up = d - down
    _move_edge(g, top_cs, top, -down)
    _move_edge(g, bottom_cs, bottom, up)
    return d


def four_bar(font):
    g = font["four"]
    E = _level_pairs(g, 150, 320)
    ys = sorted({y for y, _ in E})
    if len(ys) != 2:
        return f"four: bar not read {E}"
    lo, hi = ys
    was = hi - lo
    bar(g, hi, lo, FOUR_BAR, {ci for y, ci in E if y == hi}, {ci for y, ci in E if y == lo})
    return f"four: bar {was} > {FOUR_BAR}"


def e_bar(font):
    """e's bar across, read upright through the bar's middle (the counter's foot over the bar's top)."""
    import charset as C
    p = C.gp(font, "e")
    b = C.bounds(p)
    sp = C.scan_v(p, (b[0] + b[2]) / 2 + 20)
    mids = [s for s in sp if 200 < (s[0] + s[1]) / 2 < 330]
    return round(mids[0][1] - mids[0][0]) if mids else 41


def schwa_bars(font):
    out = []
    for name, want in SCHWA_BAR.items():
        if name not in font:
            continue
        want = want if want is not None else e_bar(font)
        g = font[name]
        # the bar: the outer contour's level edge (its top) over the counter's level edge (its foot)
        E = _level_pairs(g, 100, 400)
        if len(E) != 2 or E[0][1] == E[1][1]:
            out.append(f"{name}: bar not read {E}")
            continue
        (lo, clo), (hi, chi) = E
        was = hi - lo
        if SCHWA_MODE.get(name) == "foot":
            _move_edge(g, {clo}, lo, was - want)
        else:
            bar(g, hi, lo, want, {chi}, {clo})
        out.append(f"{name}: bar {was} > {want} ({SCHWA_MODE.get(name)})")
    return out


def run_letters(font):
    """Before spacing and the charset (the small 4s are built from the 4)."""
    return [four_bar(font)] + schwa_bars(font)


def _move_x(g, x_old, dx, soft=8):
    """_move_edge turned a quarter: the points on the upright x_old (and their handles, and a soft corner's points
    within `soft` of it) move level by dx."""
    for c in g.contours:
        for p in c.points:
            p.x, p.y = p.y, p.x
    try:
        _move_edge(g, set(range(len(g.contours))), x_old, dx, soft)
    finally:
        for c in g.contours:
            for p in c.points:
                p.x, p.y = p.y, p.x


def uprights(font, name, want, y):
    """Each upright stroke crossed at height y (two upright straight edges) made `want` across about its middle."""
    import charset as C
    g = font[name]
    sp = C.scan_h(C.gp(font, name), y)
    out = []
    for a, b in sp:
        a, b = round(a), round(b)
        d = (b - a) - want
        if not d or b - a > 2 * want:
            continue
        right = round(d / 2)
        _move_x(g, a, d - right)
        _move_x(g, b, -right)
        out.append(f"{b - a}>{want}")
    return f"{name}: stems {out}"


# ¶ (the owner: "¶ reads dark"): its two stems the sign stroke (61 > 58); the bowl as drawn
PILCROW = LD.SIGN


def pilcrow(font):
    return uprights(font, "paragraph", PILCROW, 200) if "paragraph" in font else "paragraph: none"


# ° (the owner: "° light by eye"): the ring's sides the sign stroke, top and bottom the capitals' hairline (it was 47
# all round; the ring's outside as drawn). The small zero's weights (72 / 39) were tried: in a line they read as a
# bold o (build/owner13/stray/degree.png)
DEGREE = (LD.SIGN, LD.CAP_HAIR)


def degree(font):
    import charset as C
    g = font["degree"]
    b = C.bounds(C.gp(font, "degree"))
    cx, cy, rx, ry = (b[0] + b[2]) / 2, (b[1] + b[3]) / 2, (b[2] - b[0]) / 2, (b[3] - b[1]) / 2
    C.put(font, "degree", C.ring(cx, cy, rx, ry, DEGREE[0], DEGREE[1]), g.width)
    return f"degree: sides {DEGREE[0]}, top {DEGREE[1]}"


# ™ ℠ (the owner: "far too light", strokes 22 to 23): Area's own capitals T M S at the small figures' size and weight,
# as a superior figure is its figure: SUP_SCALE, stem the small figures' (72), hairline 47 / 86 of it (39), by
# charset.small_weights' two moves; each letter at its own advance scaled, the pair on the superiors' top (SUP_TOP);
# the drawing's side bearings kept
TM = {"trademark": "TM", "servicemark": "SM"}
TM_GAP = 34          # the drawing's 27 between its letters, at its 0.435 scale carried to SUP_SCALE


def small_caps_signs(font):
    import charset as C
    import clean as CLEAN
    out = []
    sx, sy = C.small_weights()
    for name, letters in TM.items():
        if name not in font:
            continue
        g = font[name]
        b0 = C.bounds(C.gp(font, name))
        lsb, rsb = b0[0], g.width - b0[2]
        tmp = []
        for k, L in enumerate(letters):
            t = f"_tm_{k}"
            C.put(font, t, C.moved(C.gp(font, L), 0, 0, C.SUP_SCALE), 0)
            tmp.append(t)
            gg = font[t]                               # narrowed upright by what the upright move adds (the figures')
            ys = [q.y for c in gg.contours for q in c.points]
            y0, y1 = min(ys), max(ys)
            kk = (y1 - y0 - 2 * sy) / (y1 - y0)
            for c in gg.contours:
                for q in c.points:
                    q.y = round((y0 + y1) / 2 + (q.y - (y0 + y1) / 2) * kk)
        CLEAN.lighten(font, tmp, -sx)
        C.lighten_upright(font, tmp, -sy)
        import figs as F_                              # handles back inside their triangle, smooth nodes on their line
        for t in tmp:                                  # (as charset.small_figures after the same two moves)
            for c in font[t].contours:
                P = [(q.x, q.y, q.type, q.smooth) for q in c.points]
                P = F_.collinear([tuple(q) for q in F_._in_triangle([list(q) for q in P])])
                for q, r in zip(c.points, P):
                    q.x, q.y = round(r[0]), round(r[1])
        parts, x = [], 0.0
        for t in tmp:                                  # side by side, TM_GAP of white between the inks
            q = C.gp(font, t)
            bb = C.bounds(q)
            parts.append(C.moved(q, x - bb[0], 0))
            x += (bb[2] - bb[0]) + TM_GAP
            del font[t]
            C.REBUILT.discard(t)
        p = C.union(*parts)
        bb = C.bounds(p)
        p = C.moved(p, 0, C.SUP_TOP - bb[3])
        C.put(font, name, p, 0, list(g.unicodes), lsb=lsb, rsb=rsb)
        out.append(f"{name}: {letters} at {C.SUP_SCALE}, stem {C.SUP_STEM_FIG}, advance {font[name].width}")
    return out


def run_signs(font):
    """After the charset (° is built there; ™ ℠ read the finished capitals)."""
    return small_caps_signs(font) + [degree(font), pilcrow(font)]


# The struck letters' strokes (the owner: one value for capitals and lowercase, they read 56, 57 and 59 to 60; the
# slashes of Ø ø Ȼ Ⱦ ⱦ Ɇ ⱥ ɏ and the combining slashes 49 to 71): one law, every stroke drawn across a letter is the
# sign stroke across itself (STRUCK). Each stroke contour of a struck source glyph (overlap.source_struck: a letter
# as its one component and the strokes as its own contours) and of the combining strokes is read on its own axis
# (overlap._frame: its longest straight edge) and its points moved across that axis about the stroke's middle, so
# the stroke keeps its line, its length and its ends' shape. Run in normalize before the merge (the merged Regular and
# the overlap layer then carry the same stroke). Ø ø Ł ł (charset's own slashes) take it in charset.bars.
STRUCK = LD.SIGN
STRUCK_MARKS = ("slashshortcomb", "slashlongcomb", "strokeshortcomb", "strokelongcomb")


def _restroke(P, want):
    import overlap as OV
    (cx, cy), u, nrm, s, d = OV._frame(P)
    on = [k for k, q in enumerate(P) if q[2] is not None]
    d0, d1 = min(d[k] for k in on), max(d[k] for k in on)
    T = d1 - d0
    if not 25 <= T <= 95 or max(s) - min(s) < 1.5 * T:
        return None, T
    dm = (d0 + d1) / 2
    k_ = want / T
    out = []
    for q, sv, dv in zip(P, s, d):
        dn = dm + (dv - dm) * k_
        out.append((cx + u[0] * sv + nrm[0] * dn, cy + u[1] * sv + nrm[1] * dn) + tuple(q[2:]))
    return out, T


def struck_strokes(font):
    import overlap as OV
    from ufoLib2.objects import Point
    names = [n for n in OV.source_struck(font) if not n.endswith("middletilde")] + [n for n in STRUCK_MARKS if n in font]
    log = []
    for name in names:
        g = font[name]
        ws = []
        for c in g.contours:
            P = [(p.x, p.y, p.type, p.smooth) for p in c.points]
            new, T = _restroke(P, STRUCK)
            if new is None:
                continue
            c.points[:] = [Point(round(q[0]), round(q[1]), q[2], smooth=q[3]) for q in new]
            ws.append(round(T))
        if ws:
            log.append(f"{name} {ws}>{STRUCK}")
    return log


def drop_null(g):
    """A curve of no length (its two handles and its end on its start, all within a unit) after a merge: its three
    points dropped (charset._drop_tiny leaves contours of six points or fewer alone)."""
    n_drop = 0
    for c in g.contours:
        P = c.points
        i = 0
        while i < len(P) and len(P) > 4:
            q = P[i]
            if q.type == "curve" and len(P) > 3:
                a, h1, h2 = P[i - 3], P[i - 2], P[i - 1]
                if h1.type is None and h2.type is None and all(abs(r.x - a.x) <= 1 and abs(r.y - a.y) <= 1 for r in (h1, h2, q)):
                    for r in sorted({(i - 2) % len(P), (i - 1) % len(P), i}, reverse=True):
                        del P[r]
                    n_drop += 1
                    i = 0
                    continue
            i += 1
    return n_drop
