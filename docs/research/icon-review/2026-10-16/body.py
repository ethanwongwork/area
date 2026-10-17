# The shared writing tool on the 45° axis (tip bottom-left, end top-right), 60° tip, as docs/specs/icons.md "Pens and pencils".
import math
R2 = math.sqrt(2); U = (1 / R2, -1 / R2); N = (1 / R2, 1 / R2)
f = lambda v: f"{v:.3f}".rstrip("0").rstrip(".")
P = lambda p: f"{f(p[0])} {f(p[1])}"
add = lambda a, b, k=1: (a[0] + k * b[0], a[1] + k * b[1])
def on_side(axis, side, xmy):  # point with x+y = axis + side and x−y = xmy
    s = axis + side; return ((s + xmy) / 2, (s - xmy) / 2)
def geometry(tip, h, rs):
    axis = tip[0] + tip[1]; t = h * math.sqrt(3)
    c = add(tip, U, t); A = add(c, N, -h); B = add(c, N, h)
    k = rs * math.tan(math.radians(15))
    eA = ((A[0] - tip[0]) / math.dist(A, tip), (A[1] - tip[1]) / math.dist(A, tip)); eB = ((B[0] - tip[0]) / math.dist(B, tip), (B[1] - tip[1]) / math.dist(B, tip))
    return axis, A, B, add(A, eA, -k), add(A, U, k), add(B, eB, -k), add(B, U, k)
def pencil(tip, h, back, rs=0.5, rc=0.5):
    axis, A, B, a1, a2, b1, b2 = geometry(tip, h, rs); side = h * R2
    CA = on_side(axis, -side, back); CB = on_side(axis, side, back)
    ca1 = add(CA, U, -rc); ca2 = add(CA, N, rc); cb1 = add(CB, N, -rc); cb2 = add(CB, U, -rc)
    d = f"M{P(tip)}L{P(a1)}A{f(rs)} {f(rs)} 0 0 1 {P(a2)}L{P(ca1)}A{f(rc)} {f(rc)} 0 0 1 {P(ca2)}L{P(cb1)}A{f(rc)} {f(rc)} 0 0 1 {P(cb2)}L{P(b2)}A{f(rs)} {f(rs)} 0 0 1 {P(b1)}L{P(tip)}Z"
    band = f"M{P(on_side(axis, -side, back - 3))}L{P(on_side(axis, side, back - 3))}"
    return d, band
def pen(tip, h, apex, rs=0.5):
    axis, A, B, a1, a2, b1, b2 = geometry(tip, h, rs); side = h * R2
    cx = apex - side  # x−y of the round end's centre
    TA = on_side(axis, -side, cx); TB = on_side(axis, side, cx)
    d = f"M{P(TA)}L{P(a2)}A{f(rs)} {f(rs)} 0 0 0 {P(a1)}L{P(tip)}L{P(b1)}A{f(rs)} {f(rs)} 0 0 0 {P(b2)}L{P(TB)}A{f(h)} {f(h)} 0 0 0 {P(TA)}Z"
    return d, TA, TB
if __name__ == "__main__":
    # check: reproduces today's pencil (h = sqrt2, back x−y = 10) and pen
    print(pencil((2.5, 13.5), R2, 10)); print(pen((2.5, 13.5), R2, 10)[0])
