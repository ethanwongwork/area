"""Area Serif 0.81: the weight axis checked a second way, on the variable font itself.

    .venv/bin/python audit_rays.py [glyph ...]

audit_axis.py and audit_bold.py read the UFO masters and the engine's own notion of a stroke. This reads neither:
it instances build/AreaSerif[wght].ttf with fontTools at 300, 350, 400, 500, 600 and 700 (the TrueType outlines a
reader gets, quadratic, overlaps kept), and at a fixed set of places round every outline (each segment cut at the
same parameters at every weight, so a place is the same place at every weight) it casts a ray from the edge into
the ink, along the edge's normal, to where the ink ends. That length is the stroke across itself there. Only rays
that leave through an edge facing back within 40 degrees, and that are no longer than twice the glyph's mean stroke,
are kept (a cut across a stroke, not along it), and none that starts nearer a concave corner (a crotch) than
0.6 of its own length (it runs into the junction), and none whose length jumps from its neighbours' (a ray through
a junction where a tail or a bar meets a bowl); a place inside the ink (where two overlapping contours cross) has no
ray.

It fails when, at any kept place:
  bold    the stroke is thinner at a heavier stop than at the lighter one before it (400, 500, 600, 700), by more
          than 3% (the just-noticeable difference in weight) and a unit;
  light   the stroke is thicker at 350 or 300 than at the stop above it (by as much), or thinner at 300
          than the stem's own ratio allows, less 3% (no part thins noticeably faster than the stem, 55 / 78).
A place is compared across weights only where its ray leaves through the same edge at every weight.
Writes build/weight/audit-rays.txt.
"""
import io
import math
import sys

import numpy as np
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

import bold as B

import os as _os
# 0.81: AREA_RAY_WEIGHTS="300,325,..." runs the same test at more stops (every neighbouring pair is compared)
WEIGHTS = tuple(int(w) for w in _os.environ.get("AREA_RAY_WEIGHTS", "300,350,400,500,600,700").split(","))
N_SEG = 6                    # places per curve piece
FACE_DEG = 40
TOL = 1.0
JND = 0.03                   # the just-noticeable difference in weight (Bigelow and Holmes, in the weight research)
JUNCTION = 1.0               # round 3: a junction zone reaches one local stroke width from its branch or crossing


def instance(path, w):
    buf = io.BytesIO()
    instantiateVariableFont(TTFont(path), {"wght": w}).save(buf)
    buf.seek(0)
    return TTFont(buf)


def polylines(gs, name):
    """The glyph's outline cut at fixed parameters: [array (V, 2)] per contour."""
    rec = DecomposingRecordingPen(gs)
    gs[name].draw(rec)
    out, cur = [], []
    for op, args in rec.value:
        if op == "moveTo":
            cur = [args[0]]
        elif op == "lineTo":
            cur.append(args[0])
        elif op == "qCurveTo":
            pts = list(args)
            offs = pts[:-1]
            a = cur[-1]
            for i, q in enumerate(offs):
                e = pts[-1] if i == len(offs) - 1 else ((q[0] + offs[i + 1][0]) / 2, (q[1] + offs[i + 1][1]) / 2)
                for k in range(1, N_SEG + 1):
                    t = k / N_SEG
                    u = 1 - t
                    cur.append((u * u * a[0] + 2 * u * t * q[0] + t * t * e[0], u * u * a[1] + 2 * u * t * q[1] + t * t * e[1]))
                a = e
        elif op == "curveTo":
            a = cur[-1]
            b, c, d = args
            for k in range(1, N_SEG + 1):
                t = k / N_SEG
                u = 1 - t
                cur.append((u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
                            u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]))
        elif op in ("closePath", "endPath"):
            if len(cur) > 1 and math.dist(cur[0], cur[-1]) < 1e-6:
                cur = cur[:-1]
            if len(cur) > 2:
                out.append(np.array(cur, dtype=float))
            cur = []
    return out


def winding(pts, polys):
    """Non-zero winding number of each point (P, 2) against closed polylines."""
    w = np.zeros(len(pts), dtype=int)
    for P in polys:
        a, b = P, np.roll(P, -1, axis=0)
        x, y = pts[:, 0][:, None], pts[:, 1][:, None]
        up = (a[:, 1][None] <= y) & (b[:, 1][None] > y)
        dn = (b[:, 1][None] <= y) & (a[:, 1][None] > y)
        cr = (b[:, 0] - a[:, 0])[None] * (y - a[:, 1][None]) - (x - a[:, 0][None]) * (b[:, 1] - a[:, 1])[None]
        w += (up & (cr > 0)).sum(axis=1) - (dn & (cr < 0)).sum(axis=1)
    return w


def rays(polys, close=True):
    """Across-the-stroke length at every vertex of every polyline (nan where no ray is kept). close (0.81, close
    round): the end zones, soft crotches and the return ray; False reads as the integration round did (the build's
    taper rule, white.taper_readings, reads that way: the masters' handles were tuned on it)."""
    if not polys:
        return np.array([]), np.array([], dtype=int)
    allp = np.vstack(polys)
    # concave corners (a crotch, where two strokes meet): a ray that starts near one runs into the junction, not
    # across one stroke, so it is not kept (below)
    cav = []
    for P in polys:
        a_, b_ = np.roll(P, 1, axis=0), np.roll(P, -1, axis=0)
        u, w = P - a_, b_ - P
        turn = np.degrees(np.arctan2(u[:, 0] * w[:, 1] - u[:, 1] * w[:, 0], (u * w).sum(axis=1)))
        area = float(np.sum(P[:, 0] * b_[:, 1] - b_[:, 0] * P[:, 1]))
        inside = winding(P + 0.6 * np.stack([-(w + u)[:, 1], (w + u)[:, 0]], axis=1) / (np.hypot(*(w + u).T)[:, None] + 1e-9), polys) != 0
        cav.append(P[(np.sign(turn) == -np.sign(area)) & (np.abs(turn) > 25)])
    cav = np.vstack(cav) if cav else np.zeros((0, 2))
    del inside
    ends = end_corners(polys) if close else np.zeros((0, 2))
    cav = np.vstack([cav, crossings_of(polys)])               # round 3: where two contours' inks overlap
    if close:
        cav = np.vstack([cav, end_corners(polys, -1, SOFT_TURN)])   # 0.81 (close): a crotch drawn soft
    A = np.vstack([P for P in polys])
    Bv = np.vstack([np.roll(P, -1, axis=0) for P in polys])
    E = Bv - A
    out = []
    for P in polys:
        prev, nxt = np.roll(P, 1, axis=0), np.roll(P, -1, axis=0)
        tng = nxt - prev
        L = np.hypot(tng[:, 0], tng[:, 1])[:, None] + 1e-12
        tng = tng / L
        nrm = np.stack([-tng[:, 1], tng[:, 0]], axis=1)
        inside_a = winding(P + 0.6 * nrm, polys) != 0
        inside_b = winding(P - 0.6 * nrm, polys) != 0
        nrm = np.where(inside_a[:, None], nrm, -nrm)
        edge = inside_a ^ inside_b                          # on the ink's edge, not inside it
        # ray p + s n against every edge a + u e
        d = nrm[:, None, :]
        q = A[None] - P[:, None, :]
        den = d[..., 0] * E[None, :, 1] - d[..., 1] * E[None, :, 0]
        with np.errstate(divide="ignore", invalid="ignore"):
            s = (q[..., 0] * E[None, :, 1] - q[..., 1] * E[None, :, 0]) / den
            u = (q[..., 0] * d[..., 1] - q[..., 1] * d[..., 0]) / den
        hit = (np.abs(den) > 1e-9) & (s > 0.5) & (u >= 0) & (u <= 1)
        res = np.full(len(P), np.nan)
        eid = np.full(len(P), -1)
        for i in np.where(edge)[0]:
            ss = np.sort(s[i][hit[i]])
            if not len(ss):
                continue
            mids = (np.concatenate([[0.0], ss[:-1]]) + ss) / 2
            probe = P[i] + ss[:, None] * nrm[i] + 0.6 * nrm[i]
            out_ = winding(probe, polys) == 0
            k = np.where(out_)[0]
            if not len(k):
                continue
            sx = ss[k[0]]
            j = np.where(hit[i] & (np.abs(s[i] - sx) < 1e-9))[0]
            if not len(j):
                continue
            e = E[j[0]] / (np.hypot(*E[j[0]]) + 1e-12)
            en = np.array([-e[1], e[0]])
            if abs(float(en @ nrm[i])) < math.cos(math.radians(FACE_DEG)):
                continue
            # round 3: a junction zone is everything within one local stroke width (this ray's own length) of a
            # branch node (a concave corner) or of a place where two contours' edges cross (overlapping ink)
            if len(cav) and float(np.hypot(*(cav - P[i]).T).min()) < JUNCTION * sx:
                continue
            # 0.81 (close): an end zone likewise. A ray that starts within its own length of a stroke's end (a corner
            # of its cut, soft or sharp) reads how the end is cut, from its side, not the stroke across itself: c's
            # and C's barbs read 30.9 > 28.6 there while their strokes thicken (audit_axis already leaves the
            # places by a pointed end out; this is the same reading at a cut end)
            if len(ends) and float(np.hypot(*(ends - P[i]).T).min()) < END_ZONE * sx:
                continue
            # 0.81 (close): across one stroke the cut is the same both ways. From where the ray leaves, a ray along
            # that edge's own normal into the ink comes back to where this one started (within RECIPROCAL of its
            # length); a ray that crossed a junction (a hook sweeping into a stem's shoulder, a bar into a bowl, both
            # edges smooth, so no crotch marks it) lands its return somewhere else
            if close and RECIPROCAL is not None:
                q_ = P[i] + sx * nrm[i]
                back = -en if float(en @ nrm[i]) > 0 else en
                r_ = _first_exit(q_ - 0.6 * back * 0 + 0.0, back, A, E, polys)
                if r_ is None or float(np.hypot(*(q_ + r_ * back - P[i]))) > RECIPROCAL * sx + 2.0:
                    continue
            res[i] = sx
            eid[i] = j[0]
            del mids
        out.append((res, eid))
    del allp
    return np.concatenate([r for r, _ in out]), np.concatenate([e for _, e in out])


RECIPROCAL = 0.5            # a return ray may land this share of the ray's length from its start


def _first_exit(p, d, A, E, polys):
    """Distance from p along d (unit, into the ink) to where the ink ends (non-zero winding), or None."""
    q = A - p
    den = d[0] * E[:, 1] - d[1] * E[:, 0]
    with np.errstate(divide="ignore", invalid="ignore"):
        s = (q[:, 0] * E[:, 1] - q[:, 1] * E[:, 0]) / den
        u = (q[:, 0] * d[1] - q[:, 1] * d[0]) / den
    ok = (np.abs(den) > 1e-9) & (s > 0.5) & (u >= 0) & (u <= 1)
    ss = np.sort(s[ok])
    if not len(ss):
        return None
    probe = p + ss[:, None] * d + 0.6 * d
    out_ = np.where(winding(probe, polys) == 0)[0]
    return float(ss[out_[0]]) if len(out_) else None


END_TURN = 60.0             # degrees of outward turn ...
END_ARC = 12.0              # ... within this much outline: a corner (a cut end's soft corners are 7 units round)
END_ZONE = 0.5              # a ray that starts within this share of its own length of such a corner reads the end's cut
SOFT_TURN = 90.0            # a concave turn this sharp within END_ARC is a crotch, however soft its corner


def end_corners(polys, sign=1, least=None):
    """Convex corners (sign -1: concave ones, a crotch whose corner is soft or drawn as a tight curve): places where the outline turns outward by END_TURN or more within END_ARC of outline (a
    stroke's cut end, its corners soft or sharp, a serif's tip, a pointed end). A smooth curve turns far less in so
    little outline (the tightest round in the face, a ball 88 across, turns 16 degrees in 12 units)."""
    out = []
    for P in polys:
        n = len(P)
        if n < 3:
            continue
        a_, b_ = np.roll(P, 1, axis=0), np.roll(P, -1, axis=0)
        u, w = P - a_, b_ - P
        turn = np.degrees(np.arctan2(u[:, 0] * w[:, 1] - u[:, 1] * w[:, 0], (u * w).sum(axis=1)))
        area = float(np.sum(P[:, 0] * b_[:, 1] - b_[:, 0] * P[:, 1]))
        convex = sign * turn * np.sign(area)                   # > 0 where the outline turns round the ink
        seg = np.hypot(*w.T)
        for i in range(n):
            tot, arc, k = convex[i], 0.0, i
            while arc < END_ARC / 2 and k - i < n:              # forward half
                arc += seg[k % n]
                k += 1
                tot += convex[k % n]
            arc, k = 0.0, i
            while arc < END_ARC / 2 and i - k < n:              # backward half
                k -= 1
                arc += seg[k % n]
                tot += convex[k % n]
            if tot >= (least or END_TURN):
                out.append(P[i])
    return np.array(out) if out else np.zeros((0, 2))


def crossings_of(polys):
    """Points where an edge of one contour crosses an edge of another (two inks overlapping: a struck stroke over
    its letter, an asterisk's arms)."""
    out = []
    for a in range(len(polys)):
        for b in range(a + 1, len(polys)):
            P, Q = polys[a], polys[b]
            p0, p1 = P, np.roll(P, -1, axis=0)
            q0, q1 = Q, np.roll(Q, -1, axis=0)
            r = p1 - p0
            s = q1 - q0
            den = r[:, None, 0] * s[None, :, 1] - r[:, None, 1] * s[None, :, 0]
            qp = q0[None, :, :] - p0[:, None, :]
            with np.errstate(divide="ignore", invalid="ignore"):
                t_ = (qp[..., 0] * s[None, :, 1] - qp[..., 1] * s[None, :, 0]) / den
                u_ = (qp[..., 0] * r[:, None, 1] - qp[..., 1] * r[:, None, 0]) / den
            ok = (np.abs(den) > 1e-9) & (t_ >= 0) & (t_ <= 1) & (u_ >= 0) & (u_ <= 1)
            ii, jj = np.where(ok)
            if len(ii):
                out.append(p0[ii] + t_[ii, jj][:, None] * r[ii])
    return np.vstack(out) if out else np.zeros((0, 2))


def mean_stroke(polys):
    a = length = 0.0
    for P in polys:
        Q = np.roll(P, -1, axis=0)
        a += float(np.sum(P[:, 0] * Q[:, 1] - Q[:, 0] * P[:, 1])) / 2
        length += float(np.sum(np.hypot(*(Q - P).T)))
    return 2 * abs(a) / length if length else 0.0


def main():
    names = [a for a in sys.argv[1:] if not a.startswith("-")]
    vf = _os.environ.get("AREA_VF", "build/AreaSerif[wght].ttf")   # 0.81: another build's font
    fonts = {w: instance(vf, w) for w in WEIGHTS}
    gss = {w: f.getGlyphSet() for w, f in fonts.items()}
    glyf = fonts[400]["glyf"]
    names = names or [n for n in fonts[400].getGlyphOrder() if glyf[n].numberOfContours > 0]
    q300 = B.LIGHT_STEM / B.REG_STEM                        # the stem's own ratio, 300 over 400
    fails, rows, n_rays = [], [], 0
    for name in names:
        th, ex = {}, {}
        for w in WEIGHTS:
            ps = polylines(gss[w], name)
            th[w], ex[w] = rays(ps)
        if len({len(a) for a in th.values()}) != 1:
            fails.append(f"{name}: not the same places at every weight")
            continue
        T = np.stack([th[w] for w in WEIGHTS])          # (W, places)
        P400 = np.vstack(polylines(gss[400], name))       # each place's position at 400 (named in the failures)
        X = np.stack([ex[w] for w in WEIGHTS])
        # a place is kept where its ray leaves the ink through the same edge at every weight (across the same
        # stroke); a ray that grazes a junction leaves through one edge at one weight and another at the next
        ok = ~np.isnan(T).any(axis=0) & (np.abs(X - X[WEIGHTS.index(400)]).max(axis=0) <= 1)
        # across a stroke, not along one: a ray longer than twice the glyph's mean stroke at 400 runs down a bar
        # from its end, or through a junction
        ms = mean_stroke(polylines(gss[400], name))
        # a stroke changes its thickness smoothly along its edge; where the ray's length at 400 jumps from one place
        # to the next it passes through a junction (a tail meeting a bowl, a bar a bowl), not across one stroke.
        # Read on the Regular only, so a stroke that thins away towards the Bold is still caught.
        r4 = T[WEIGHTS.index(400)]
        cut = np.cumsum([0] + [len(P) for P in polylines(gss[400], name)])
        smooth = np.zeros(len(r4), dtype=bool)
        for a_, b_ in zip(cut, cut[1:]):
            seg = r4[a_:b_]
            pv, nv = np.roll(seg, 1), np.roll(seg, -1)
            smooth[a_:b_] = (np.abs(seg - pv) <= 0.15 * seg + 2) & (np.abs(seg - nv) <= 0.15 * seg + 2)
        ok &= smooth
        ok &= np.nan_to_num(T[WEIGHTS.index(400)], nan=1e9) <= 2 * ms
        if not ok.any():
            continue
        T = T[:, ok]
        P400 = P400[ok]
        n_rays += T.shape[1]
        at_ = lambda k: f" at ({P400[k][0]:.0f}, {P400[k][1]:.0f})"   # noqa: E731
        i400 = WEIGHTS.index(400)
        worst = []
        up = [w for w in WEIGHTS if w >= 400]
        down = [w for w in WEIGHTS if w <= 400][::-1]
        for a, b in zip(up, up[1:]):
            d = T[WEIGHTS.index(b)] - T[WEIGHTS.index(a)] + JND * T[WEIGHTS.index(a)]
            if (d < -TOL).any():
                k = int(np.argmin(d))
                worst.append(f"thinner at {b} than at {a}: {T[WEIGHTS.index(a), k]:.1f} > {T[WEIGHTS.index(b), k]:.1f}{at_(k)}")
        for a, b in zip(down, down[1:]):
            d = T[WEIGHTS.index(b)] - T[WEIGHTS.index(a)] - JND * T[WEIGHTS.index(a)]
            if (d > TOL).any():
                k = int(np.argmax(d))
                worst.append(f"thicker at {b} than at {a}: {T[WEIGHTS.index(a), k]:.1f} < {T[WEIGHTS.index(b), k]:.1f}{at_(k)}")
        floor = T[i400] * q300 * (1 - JND) - TOL
        d = T[WEIGHTS.index(300)] - floor
        if (d < 0).any():
            k = int(np.argmin(d))
            worst.append(f"at 300 {T[WEIGHTS.index(300), k]:.1f} where 400 has {T[i400, k]:.1f}{at_(k)} (no part thins faster than the stem, x {q300:.3f})")
        rows.append((name, T.shape[1], float(T[i400].min()), float(T[WEIGHTS.index(300)].min()), float(T[WEIGHTS.index(700)].min())))
        if worst:
            fails.append(f"{name}: " + "; ".join(worst))
    with open(_os.environ.get("AREA_RAYS_OUT", "build/weight/audit-rays.txt"), "w") as f:
        f.writelines(f"{r}\n" for r in fails)
        f.writelines(f"{n}\t{k} rays\tthinnest 400 {a:.1f}  300 {b:.1f}  700 {c:.1f}\n" for n, k, a, b, c in rows)
    print(f"rays across the stroke, variable font at {', '.join(map(str, WEIGHTS))}: {len(rows)} glyphs, {n_rays} places")
    print(f"  {'ok' if not fails else str(len(fails)) + ' glyphs: ' + ' | '.join(fails[:8])}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
