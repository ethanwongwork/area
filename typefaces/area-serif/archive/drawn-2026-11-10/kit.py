"""Parts kit: contours, stems, serifs, ellipses. Cubic, integer coordinates, overlaps kept."""
K = 0.5523


class Contour:
    """A closed cubic contour. segs: ('L', p) or ('C', c1, c2, p); start is the first point."""

    def __init__(self, x, y):
        self.start = (x, y)
        self.segs = []

    def l(self, x, y):
        self.segs.append(("L", (x, y)))
        return self

    def c(self, x1, y1, x2, y2, x, y):
        self.segs.append(("C", (x1, y1), (x2, y2), (x, y)))
        return self

    def points(self):
        pts = [self.start]
        for s in self.segs:
            if s[0] == "L":
                pts.append(s[1])
            else:
                p0 = pts[-1]
                for i in range(1, 13):
                    t = i / 12
                    u = 1 - t
                    pts.append(tuple(u**3 * p0[k] + 3 * u * u * t * s[1][k] + 3 * u * t * t * s[2][k] + t**3 * s[3][k] for k in (0, 1)))
        return pts

    def area(self):
        p = self.points()
        return sum(p[i][0] * p[(i + 1) % len(p)][1] - p[(i + 1) % len(p)][0] * p[i][1] for i in range(len(p))) / 2

    def reversed(self):
        nodes = [self.start] + [s[-1] for s in self.segs]
        out = Contour(*nodes[-1])
        for i in range(len(self.segs) - 1, -1, -1):
            s = self.segs[i]
            if s[0] == "L":
                out.l(*nodes[i])
            else:
                out.c(*s[2], *s[1], *nodes[i])
        return out

    def rounded(self, corners, r):
        """Round the listed corner nodes (x, y) by radius r. Each must have a straight or
        near-straight run on both sides longer than r."""
        if not r:
            return self
        want = {(round(x), round(y)) for x, y in corners}
        nodes = [self.start] + [s[-1] for s in self.segs]
        closed = list(self.segs)
        if (round(nodes[-1][0]), round(nodes[-1][1])) != (round(self.start[0]), round(self.start[1])):
            closed.append(("L", self.start))
            nodes.append(self.start)
        n = len(closed)

        def toward(p, q):
            dx, dy = q[0] - p[0], q[1] - p[1]
            d = (dx * dx + dy * dy) ** 0.5 or 1
            return (p[0] + dx / d * r, p[1] + dy / d * r)

        mid = lambda a, c: (a[0] + (c[0] - a[0]) * 0.55, a[1] + (c[1] - a[1]) * 0.55)
        out, start = [], None
        for i in range(n):
            seg = closed[i]
            end = seg[-1]
            nxt = closed[(i + 1) % n]
            key = (round(end[0]), round(end[1]))
            if key in want:
                prev = seg[2] if seg[0] == "C" else nodes[i]
                a = toward(end, prev)
                b = toward(end, nxt[1])
                out.append(("L", a) if seg[0] == "L" else ("C", seg[1], seg[2], a))
                out.append(("C", mid(a, end), mid(b, end), b))
                if i == n - 1:
                    start = b
            else:
                out.append(seg)
        c = Contour(*(start or self.start))
        c.segs = out
        return c

    def oriented(self, counter=False):
        """Outer contours counter-clockwise, counters clockwise (cubic source convention)."""
        ccw = self.area() > 0
        return self if ccw != counter else self.reversed()

    def draw(self, pen):
        r = lambda p: (round(p[0]), round(p[1]))
        pen.moveTo(r(self.start))
        segs = list(self.segs)
        if segs and r(segs[-1][-1]) == r(self.start) and segs[-1][0] == "L":
            segs.pop()
        for s in segs:
            if s[0] == "L":
                pen.lineTo(r(s[1]))
            else:
                pen.curveTo(r(s[1]), r(s[2]), r(s[3]))
        pen.closePath()


def ellipse(x0, y0, x1, y1, k=K, counter=False):
    cx, cy, rx, ry = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2
    c = Contour(cx, y0)
    c.c(cx + rx * k, y0, x1, cy - ry * k, x1, cy)
    c.c(x1, cy + ry * k, cx + rx * k, y1, cx, y1)
    c.c(cx - rx * k, y1, x0, cy + ry * k, x0, cy)
    c.c(x0, cy - ry * k, cx - rx * k, y0, cx, y0)
    return c.oriented(counter)


def stem(x0, x1, y0, y1, tip, foot=(0, 0), head=(0, 0), bracket=50, flag=None, soft=0):
    """Vertical stem with optional foot and head serifs (left, right projections).
    flag = (proj, tip, slope): one-sided lowercase head serif on the left."""
    c = Contour(x0 - foot[0], y0)
    # foot, left to right
    c.l(x1 + foot[1], y0)
    if foot[1]:
        c.l(x1 + foot[1], y0 + tip)
        c.c(x1 + foot[1] * 0.26, y0 + tip, x1, y0 + tip + bracket * 0.30, x1, y0 + tip + bracket)
    # up the right side, head
    if flag:
        fp, ft, fs = flag
        c.l(x1, y1)
        c.l(x0 - fp, y1 - fs)
        c.l(x0 - fp, y1 - fs - ft)
        c.c(x0 - fp * 0.26, y1 - fs - ft + 2, x0, y1 - fs - ft - bracket * 0.25, x0, y1 - fs - ft - bracket * 0.85)
    else:
        if head[1]:
            c.l(x1, y1 - tip - bracket)
            c.c(x1, y1 - tip - bracket * 0.30, x1 + head[1] * 0.26, y1 - tip, x1 + head[1], y1 - tip)
            c.l(x1 + head[1], y1)
        else:
            c.l(x1, y1)
        c.l(x0 - head[0], y1)
        if head[0]:
            c.l(x0 - head[0], y1 - tip)
            c.c(x0 - head[0] * 0.26, y1 - tip, x0, y1 - tip - bracket * 0.30, x0, y1 - tip - bracket)
    # down the left side
    if foot[0]:
        c.l(x0, y0 + tip + bracket)
        c.c(x0, y0 + tip + bracket * 0.30, x0 - foot[0] * 0.26, y0 + tip, x0 - foot[0], y0 + tip)
    else:
        c.l(x0, y0)
    c.l(x0 - foot[0], y0)
    tips = []
    if foot[0]:
        tips += [(x0 - foot[0], y0), (x0 - foot[0], y0 + tip)]
    if foot[1]:
        tips += [(x1 + foot[1], y0), (x1 + foot[1], y0 + tip)]
    if flag:
        tips += [(x0 - flag[0], y1 - flag[2]), (x0 - flag[0], y1 - flag[2] - flag[1])]
    else:
        if head[0]:
            tips += [(x0 - head[0], y1), (x0 - head[0], y1 - tip)]
        if head[1]:
            tips += [(x1 + head[1], y1), (x1 + head[1], y1 - tip)]
    return c.rounded(tips, soft).oriented()


def rect(x0, y0, x1, y1):
    return Contour(x0, y0).l(x1, y0).l(x1, y1).l(x0, y1).oriented()
