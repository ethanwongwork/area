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

WEIGHTS = (300, 350, 400, 500, 600, 700)
N_SEG = 6                    # places per curve piece
FACE_DEG = 40
TOL = 1.0
JND = 0.03                   # the just-noticeable difference in weight (Bigelow and Holmes, in the weight research)


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


def rays(polys):
    """Across-the-stroke length at every vertex of every polyline (nan where no ray is kept)."""
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
            if len(cav) and float(np.hypot(*(cav - P[i]).T).min()) < 0.6 * sx:
                continue
            res[i] = sx
            eid[i] = j[0]
            del mids
        out.append((res, eid))
    del allp
    return np.concatenate([r for r, _ in out]), np.concatenate([e for _, e in out])


def mean_stroke(polys):
    a = length = 0.0
    for P in polys:
        Q = np.roll(P, -1, axis=0)
        a += float(np.sum(P[:, 0] * Q[:, 1] - Q[:, 0] * P[:, 1])) / 2
        length += float(np.sum(np.hypot(*(Q - P).T)))
    return 2 * abs(a) / length if length else 0.0


def main():
    names = [a for a in sys.argv[1:] if not a.startswith("-")]
    vf = "build/AreaSerif[wght].ttf"
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
        n_rays += T.shape[1]
        i400 = WEIGHTS.index(400)
        worst = []
        for a, b in ((400, 500), (500, 600), (600, 700)):
            d = T[WEIGHTS.index(b)] - T[WEIGHTS.index(a)] + JND * T[WEIGHTS.index(a)]
            if (d < -TOL).any():
                k = int(np.argmin(d))
                worst.append(f"thinner at {b} than at {a}: {T[WEIGHTS.index(a), k]:.1f} > {T[WEIGHTS.index(b), k]:.1f}")
        for a, b in ((400, 350), (350, 300)):
            d = T[WEIGHTS.index(b)] - T[WEIGHTS.index(a)] - JND * T[WEIGHTS.index(a)]
            if (d > TOL).any():
                k = int(np.argmax(d))
                worst.append(f"thicker at {b} than at {a}: {T[WEIGHTS.index(a), k]:.1f} < {T[WEIGHTS.index(b), k]:.1f}")
        floor = T[i400] * q300 * (1 - JND) - TOL
        d = T[WEIGHTS.index(300)] - floor
        if (d < 0).any():
            k = int(np.argmin(d))
            worst.append(f"at 300 {T[WEIGHTS.index(300), k]:.1f} where 400 has {T[i400, k]:.1f} (no part thins faster than the stem, x {q300:.3f})")
        rows.append((name, T.shape[1], float(T[i400].min()), float(T[WEIGHTS.index(300)].min()), float(T[WEIGHTS.index(700)].min())))
        if worst:
            fails.append(f"{name}: " + "; ".join(worst))
    with open("build/weight/audit-rays.txt", "w") as f:
        f.writelines(f"{r}\n" for r in fails)
        f.writelines(f"{n}\t{k} rays\tthinnest 400 {a:.1f}  300 {b:.1f}  700 {c:.1f}\n" for n, k, a, b, c in rows)
    print(f"rays across the stroke, variable font at {', '.join(map(str, WEIGHTS))}: {len(rows)} glyphs, {n_rays} places")
    print(f"  {'ok' if not fails else str(len(fails)) + ' glyphs: ' + ' | '.join(fails[:8])}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
