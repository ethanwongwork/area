"""Stroke tests: thicks and thins, on every face with the same code.

  stems     upright strokes found by horizontal scanlines every 10 units: a run of at least 120 units whose two
            edges stay within 0.75 of a unit. Width, height, and any taper outside that run.
  bars      level strokes found the same way with vertical scanlines (e, f, t, A, H, E, F, ...).
  ray       stroke thickness at every outline sample: a ray along the inward normal to the opposite edge, kept only
            where the opposite edge is roughly parallel (so joins and crotches don't count as thin strokes).
            Gives each glyph's thinnest and thickest curved stroke, where they are, and the stress angle.
  profile   the thickness along the outline of round letters, to see whether thick turns to thin evenly.

Usage: python test_strokes.py  -> strokes.json"""
import json
import math
import os

import numpy as np

import evlib as E

ROUND_L = "ocebdpq"
ROUND_U = "OCGQD"


def stems(shape, lo, hi, step=10):
    """Upright stems between y=lo and y=hi: [{x0,x1,w,y0,y1}]."""
    rows = []
    y = lo
    while y <= hi:
        rows.append((y, shape.h(y)))
        y += step
    tracks = []                                        # each: list of (y, x0, x1)
    for y, spans in rows:
        used = set()
        for tr in tracks:
            if tr["open"]:
                _, a, b = tr["pts"][-1]
                best = None
                for i, (x0, x1) in enumerate(spans):
                    if i not in used and abs(x0 - a) <= 0.75 and abs(x1 - b) <= 0.75:
                        best = i
                        break
                if best is None:
                    tr["open"] = False
                else:
                    used.add(best)
                    tr["pts"].append((y, *spans[best]))
        for i, (x0, x1) in enumerate(spans):
            if i not in used:
                tracks.append({"open": True, "pts": [(y, x0, x1)]})
    out = []
    for tr in tracks:
        p = tr["pts"]
        if p[-1][0] - p[0][0] >= 120:
            ws = [b - a for _, a, b in p]
            out.append({"x0": round(p[0][1], 1), "x1": round(p[0][2], 1), "w": round(sum(ws) / len(ws), 2),
                        "wmin": round(min(ws), 2), "wmax": round(max(ws), 2), "y0": p[0][0], "y1": p[-1][0]})
    return out


def bars(shape, step=5):
    """Level bars: [{y0,y1,t,x0,x1}] at least 30 units long with both edges level within 0.75."""
    tracks = []
    x = shape.x0 + 2
    while x <= shape.x1 - 2:
        spans = shape.v(x)
        used = set()
        for tr in tracks:
            if tr["open"]:
                _, a, b = tr["pts"][-1]
                best = None
                for i, (y0, y1) in enumerate(spans):
                    if i not in used and abs(y0 - a) <= 0.75 and abs(y1 - b) <= 0.75:
                        best = i
                        break
                if best is None:
                    tr["open"] = False
                else:
                    used.add(best)
                    tr["pts"].append((x, *spans[best]))
        for i, (y0, y1) in enumerate(spans):
            if i not in used:
                tracks.append({"open": True, "pts": [(x, y0, y1)]})
        x += step
    out = []
    for tr in tracks:
        p = tr["pts"]
        if p[-1][0] - p[0][0] >= 30:
            ts = [b - a for _, a, b in p]
            if max(ts) < 200:
                out.append({"y0": round(p[0][1], 1), "y1": round(p[0][2], 1), "t": round(sum(ts) / len(ts), 2),
                            "x0": round(p[0][0], 1), "x1": round(p[-1][0], 1)})
    return out


def ray_thickness(contours, step=3.0):
    """Per outline sample: (x, y, thickness, nx, ny, curved, parallel) with an inward-normal ray."""
    polys, meta = [], []
    for c in contours:
        poly = []
        for s in c:
            L = E.seg_len(s)
            n = max(1, int(math.ceil(L / step)))
            for i in range(n):
                t = i / n
                x, y = E.pt(s, t)
                dx, dy = E.d1(s, t)
                if s[0] != "L" and math.hypot(dx, dy) < 1e-6:
                    dx, dy = E.d1(s, min(1, t + 0.01))
                k = E.curvature(s, t)
                poly.append((x, y, dx, dy, k, s[0] != "L"))
        if len(poly) > 2:
            polys.append(poly)
    if not polys:
        return []
    # orientation: total signed area tells which side is ink. Outer contours of a TrueType glyph run clockwise.
    A = []
    B = []
    for poly in polys:
        n = len(poly)
        for i in range(n):
            A.append(poly[i][:2])
            B.append(poly[(i + 1) % n][:2])
    A, B = np.array(A), np.array(B)
    D = B - A
    out = []

    def inside(px, py):
        # even-odd is not right for overlapping contours, but the built fonts have overlaps removed
        cond = ((A[:, 1] <= py) & (B[:, 1] > py)) | ((B[:, 1] <= py) & (A[:, 1] > py))
        if not cond.any():
            return False
        t = (py - A[cond, 1]) / (B[cond, 1] - A[cond, 1])
        xs = A[cond, 0] + t * D[cond, 0]
        return int((xs > px).sum()) % 2 == 1

    for poly in polys:
        for (x, y, dx, dy, k, curved) in poly:
            L = math.hypot(dx, dy)
            if L < 1e-9:
                continue
            nx, ny = -dy / L, dx / L
            if not inside(x + nx * 0.6, y + ny * 0.6):
                nx, ny = -nx, -ny
                if not inside(x + nx * 0.6, y + ny * 0.6):
                    continue
            # ray p + t n against every edge A + u D
            den = nx * D[:, 1] - ny * D[:, 0]
            ok = np.abs(den) > 1e-9
            wx, wy = A[:, 0] - x, A[:, 1] - y
            with np.errstate(divide="ignore", invalid="ignore"):
                t = (wx * D[:, 1] - wy * D[:, 0]) / den
                u = (wx * ny - wy * nx) / den
            hit = ok & (t > 0.8) & (u >= 0) & (u <= 1)
            if not hit.any():
                continue
            idx = np.where(hit)[0]
            j = idx[np.argmin(t[idx])]
            tt = float(t[j])
            ex, ey = D[j]
            el = math.hypot(ex, ey)
            par = abs((ex * (-ny) + ey * nx) / el) if el > 0 else 0     # 1 when the far edge is parallel
            out.append((round(x, 1), round(y, 1), round(tt, 2), round(nx, 3), round(ny, 3), curved, round(par, 3),
                        round(k, 5)))
    return out


def summarise(samples):
    """Thinnest and thickest parallel-sided curved stroke and where."""
    good = [s for s in samples if s[6] >= 0.94 and abs(s[7]) < 1 / 16]
    if not good:
        return None
    thin = min(good, key=lambda s: s[2])
    curved = [s for s in good if s[5]]
    thick = max(curved, key=lambda s: s[2]) if curved else None
    return {"thin": thin[2], "thin_at": [thin[0], thin[1]], "thin_angle": round(math.degrees(math.atan2(thin[4], thin[3])) % 180, 1),
            "thick": thick[2] if thick else None, "thick_at": [thick[0], thick[1]] if thick else None}


def main():
    os.makedirs(E.OUT, exist_ok=True)
    res = {}
    for key in E.available():
        f = E.face(key)
        m = E.metrics(f)
        per = {}
        for ch in E.CORE:
            sh = E.Shape(f, ch)
            if sh.empty:
                continue
            st = stems(sh, sh.y0 + 5, sh.y1 - 5)
            br = bars(sh)
            rays = ray_thickness(sh.contours)
            per[ch] = {"stems": st, "bars": br, "ray": summarise(rays), "adv": round(sh.adv, 1),
                       "bbox": [round(sh.x0, 1), round(sh.y0, 1), round(sh.x1, 1), round(sh.y1, 1)]}
            if key == "area" or ch in "onHOes":
                per[ch]["samples"] = rays
        res[key] = {"metrics": m, "glyphs": per}
        # headline numbers
        n = per["n"]["stems"]
        H = per["H"]["stems"]
        o = per["o"]["ray"]
        print(f"{E.FACES[key][0]:20} xh {m['xh']:.0f} cap {m['cap']:.0f}  n stem {n[0]['w'] if n else None}  H stem {H[0]['w'] if H else None}"
              f"  o thin {o['thin']} thick {o['thick']}")
    json.dump(res, open(os.path.join(E.OUT, "strokes.json"), "w"))


if __name__ == "__main__":
    main()
