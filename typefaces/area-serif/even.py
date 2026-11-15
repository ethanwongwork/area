"""Area Serif: a stroke's thickness changes evenly along a curve (0.77; owner, 2026-11-14: a's bowl "looks a bit
uneven from thick and thin at the very top left of the counter/bowl and the bottom left").

Round every closed counter, at each step of STEP units along it, the stroke's thickness is the distance from the
counter's edge through the ink, along the edge's normal, to the far edge. Along a smooth run of the counter (between
its corners) that thickness should rise and fall at a steady rate. What reads as uneven is the rate changing
abruptly: thick, a flat stretch, then thick again. `runs` gives each smooth run's thickness; `rate_jump` the largest
change in rate between neighbouring steps (units of thickness per step, per step); `audit` compares every counter
with LIMIT; `even` redraws a run that fails by changing only the lengths of its curves' handles (never a node,
never a handle's direction), so the outer arc and every extreme stay where they are.

    .venv/bin/python even.py            the audit on build/AreaSerif-Regular.ufo; exits 1 on a failure
"""
import math
import sys

import numpy as np

STEP = 10
SMOOTH = 3                        # thickness is read as the mean of this many neighbouring steps (whole-unit noise)
BREAK = 8                         # a step in thickness larger than this between two samples is a different far edge
MAX_STROKE = 150                  # further than this through the ink is not a stroke (a counter facing a stem's length)

def _bez(p, t):
    u = 1 - t
    return (u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0],
            u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1])


def flatten(contour, step=3.0):
    """[(x, y, corner?)] for a contour given as [(x, y, type, smooth)]; corner marks an on-curve node that is not
    smooth."""
    on = [i for i, q in enumerate(contour) if q[2] is not None]
    out = []
    for k, i in enumerate(on):
        j = on[(k + 1) % len(on)]
        mid, q = [], (i + 1) % len(contour)
        while q != j:
            mid.append(q)
            q = (q + 1) % len(contour)
        a = contour[i]
        corner = not a[3]
        if len(mid) == 2:
            pts = [a[:2], contour[mid[0]][:2], contour[mid[1]][:2], contour[j][:2]]
            n = max(2, int(sum(math.dist(pts[m], pts[m + 1]) for m in range(3)) / step))
            out += [_bez(pts, m / n) + (corner and m == 0,) for m in range(n)]
        else:
            b = contour[j]
            n = max(1, int(math.dist(a[:2], b[:2]) / step))
            out += [(a[0] + (b[0] - a[0]) * m / n, a[1] + (b[1] - a[1]) * m / n, corner and m == 0) for m in range(n)]
    return out


def counters(polys):
    boxes = [(min(q[0] for q in p), min(q[1] for q in p), max(q[0] for q in p), max(q[1] for q in p)) for p in polys]
    return [i for i, b in enumerate(boxes)
            if any(j != i and o[0] < b[0] and o[1] < b[1] and o[2] > b[2] and o[3] > b[3] for j, o in enumerate(boxes))]


def _segments(polys, skip):
    seg = []
    for i, p in enumerate(polys):
        a = np.array([q[:2] for q in p], dtype=float)
        seg.append(np.hstack([a, np.roll(a, -1, axis=0)]))
    return np.vstack(seg)


def _hit(S, px, py, nx, ny):
    """Distance from (px, py) along (nx, ny) to the nearest edge in S that is more than a unit away."""
    x1, y1, x2, y2 = S[:, 0], S[:, 1], S[:, 2], S[:, 3]
    ex, ey = x2 - x1, y2 - y1
    den = nx * ey - ny * ex
    with np.errstate(divide="ignore", invalid="ignore"):
        t = ((x1 - px) * ey - (y1 - py) * ex) / den
        u = ((x1 - px) * ny - (y1 - py) * nx) / den
    ok = (np.abs(den) > 1e-9) & (t > 1.0) & (u >= 0) & (u <= 1)
    return float(t[ok].min()) if ok.any() else None


def runs(polys, which):
    """The counter's smooth runs: [[(index into the counter's polyline, x, y, thickness)]], sampled every STEP."""
    p = polys[which]
    S = _segments(polys, which)
    n = len(p)
    area = sum(p[i][0] * p[(i + 1) % n][1] - p[(i + 1) % n][0] * p[i][1] for i in range(n))
    sgn = 1.0 if area > 0 else -1.0                      # a counter runs against the outline: its outside is ink
    out, cur, acc = [], [], 0.0
    for i in range(n):
        a, b = p[i - 1], p[(i + 1) % n]
        if p[i][2] and cur:
            out.append(cur)
            cur = []
        acc += math.dist(p[i - 1][:2], p[i][:2])
        if acc < STEP:
            continue
        acc = 0.0
        d = (b[0] - a[0], b[1] - a[1])
        L = math.hypot(*d)
        if L < 1e-6:
            continue
        nx, ny = d[1] / L * sgn, -d[0] / L * sgn
        t = _hit(S, p[i][0], p[i][1], nx, ny)
        if t is None:
            nx, ny = -nx, -ny
            t = _hit(S, p[i][0], p[i][1], nx, ny)
        if t is None or t > MAX_STROKE:
            if cur:
                out.append(cur)
                cur = []
            continue
        if cur and abs(t - cur[-1][3]) > BREAK:              # the far edge is another stroke now (a bowl meeting its
            out.append(cur)                                    # stem): not this stroke's thickness changing
            cur = []
        cur.append((i, p[i][0], p[i][1], t))
    if cur:
        out.append(cur)
    return [r for r in out if len(r) >= 8]


def rate_jump(run):
    """(the largest change in the thickness's rate between neighbouring steps, where: index into the run)."""
    t = np.array([r[3] for r in run])
    k = np.ones(SMOOTH) / SMOOTH
    ts = np.convolve(t, k, mode="valid")
    d2 = np.abs(np.diff(ts, 2))
    if not len(d2):
        return 0.0, 0
    i = int(d2.argmax())
    return float(d2[i]), i + SMOOTH // 2 + 1


def shelf(run):
    """How far the thickness strays (units) from one smooth rise or fall between its thickest and thinnest places
    on this run: the largest distance of the samples from the cubic through them by least squares. A stroke that
    thins, holds, then thins again (a shelf) strays; one that thins steadily does not."""
    t = np.array([r[3] for r in run], dtype=float)
    i, j = sorted((int(t.argmax()), int(t.argmin())))
    if j - i < 8:
        return 0.0, None
    seg = t[i:j + 1]
    x = np.linspace(-1, 1, len(seg))
    fit = np.polyval(np.polyfit(x, seg, 3), x)
    k = int(np.abs(seg - fit).argmax())
    return float(np.abs(seg - fit).max()), i + k


def glyph_polys(g):
    return [flatten([(p.x, p.y, p.type, p.smooth) for p in c.points]) for c in g.contours]


def measure(g):
    """[(counter, run, jump, (x, y) where)] for every smooth run of every counter."""
    polys = glyph_polys(g)
    out = []
    for ci in counters(polys):
        for ri, run in enumerate(runs(polys, ci)):
            j, at = rate_jump(run)
            out.append((ci, ri, round(j, 2), (round(run[at][1]), round(run[at][2])), run))
    return out


# ---------------------------------------------------------------- the fix: handle lengths only

def _objective(g, ci):
    """What `even` lowers: each run's shelf plus its rate jump, the worst run of the counter."""
    polys = glyph_polys(g)
    return max([shelf(run)[0] + rate_jump(run)[0] for run in runs(polys, ci)] or [0.0])


def worst(g):
    """(largest shelf, largest rate jump) over the glyph's counters."""
    polys = glyph_polys(g)
    rs = [run for ci in counters(polys) for run in runs(polys, ci)]
    return (max([shelf(r)[0] for r in rs] or [0.0]), max([rate_jump(r)[0] for r in rs] or [0.0]))


def _mean_thickness(g, ci):
    polys = glyph_polys(g)
    v = [r[3] for run in runs(polys, ci) for r in run]
    return sum(v) / len(v) if v else 0.0


REACH = (0.75, 1.3)               # a handle may end between these shares of its own length, no further


def even(g, tries=(0.85, 0.93, 1.07, 1.15)):
    """Each counter with a run over SHELF_AIM: its curves' handles are lengthened or shortened, one at a time,
    keeping every node and every handle's direction, for as long as shelf plus rate jump falls and the stroke's
    mean thickness stays within a unit. Returns [(counter, before, after)]."""
    done = []
    polys = glyph_polys(g)
    for ci in counters(polys):
        if max([shelf(run)[0] for run in runs(polys, ci)] or [0.0]) <= SHELF_AIM:
            continue
        before = _objective(g, ci)
        mean_before = _mean_thickness(g, ci)
        P = g.contours[ci].points
        n = len(P)
        start = {i: (p.x, p.y) for i, p in enumerate(P) if p.type is None}
        best = before
        for _ in range(4):
            improved = False
            for i, p in enumerate(P):
                if p.type is not None:
                    continue
                own = P[i - 1] if P[i - 1].type is not None else P[(i + 1) % n]
                L0 = math.hypot(start[i][0] - own.x, start[i][1] - own.y)
                if L0 < 12:
                    continue
                x0, y0 = p.x, p.y
                for k in tries:
                    nx, ny = own.x + (x0 - own.x) * k, own.y + (y0 - own.y) * k
                    if not REACH[0] * L0 <= math.hypot(nx - own.x, ny - own.y) <= REACH[1] * L0:
                        continue
                    p.x, p.y = round(nx), round(ny)
                    now = _objective(g, ci)
                    if now < best - 0.05 and abs(_mean_thickness(g, ci) - mean_before) <= 1.0:   # the weight stays
                        best, x0, y0, improved = now, p.x, p.y, True
                p.x, p.y = x0, y0
            if not improved:
                break
        done.append((ci, round(before, 2), round(best, 2)))
    return done


# Letters and figures with a closed counter. Not b d p q o: parts.py builds their one bowl and checks it point for
# point, so their evenness is that construction's (b and p stray 3.0, d and q under 1); not 8, whose two bowls cross.
EVEN = {"a": "a", "e": "e", "g": "g", "B": "B", "D": "D", "O": "O", "P": "P", "Q": "Q", "R": "R",
        "0": "zero", "6": "six", "9": "nine"}
SHELF_AIM = 2.0                   # a run that strays more than this from one smooth rise or fall is redrawn
# The references' own letters stray further: Georgia Pro's a 4.1, Libre Baskerville's 4.6 (Area's was 2.8); their
# largest rate jump on a is 2.3 and 2.5. Area's limits are what the handle rule reaches on every letter it covers
# with handles kept within REACH (R 2.7, 6 and 9 2.6, D 2.3, a 2.2); 0.76's a (2.8), R (4.5), 6 and 9 fail them.
SHELF_LIMIT = 2.75
LIMIT = 2.3


def run(font):
    out = []
    for ch, name in EVEN.items():
        w0 = worst(font[name])
        for ci, before, after in even(font[name]):
            out.append(f"{ch} {w0[0]:.1f}>{worst(font[name])[0]:.1f}")
    return out


def audit(font):
    rows, bad = [], []
    for ch, name in list(EVEN.items()) + [(c, c) for c in "bdpqo"]:
        sh, jump = worst(font[name])
        rows.append((ch, round(sh, 1), round(jump, 1)))
        if ch in EVEN and (sh > SHELF_LIMIT or jump > LIMIT):
            bad.append(f"{ch}: its stroke strays {sh:.1f} from one smooth change of thickness (limit {SHELF_LIMIT}), rate jump {jump:.1f} (limit {LIMIT})")
    return rows, bad


if __name__ == "__main__":
    import ufoLib2
    font = ufoLib2.Font.open(sys.argv[1] if len(sys.argv) > 1 else "build/AreaSerif-Regular.ufo")
    rows, bad = audit(font)
    print("evenness: how far a stroke strays from one smooth change of thickness / its largest rate jump")
    print("  " + "  ".join(f"{ch} {sh}/{j}" for ch, sh, j in rows))
    for b in bad:
        print("ERROR", b)
    print(f"evenness: {len(bad)} error(s)")
    sys.exit(1 if bad else 0)
