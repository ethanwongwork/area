"""Is the Regular ready for a second master? Structure counts only; writes nothing into the build."""
import sys, io, contextlib, string, traceback
sys.path.insert(0, '.')
import ufoLib2
core = list(string.ascii_letters) + "zero one two three four five six seven eight nine".split()
def sig(g):
    return [[(p.type or 'o') for p in c.points] for c in g.contours]
def cmp(a, b, names):
    same = sum(1 for n in names if n in a and n in b and sig(a[n]) == sig(b[n]))
    return same, len(names)
area = ufoLib2.Font.open('build/AreaSerif-Regular.ufo')
lb = ufoLib2.Font.open('build/libre-baskerville/LibreBaskerville-Regular.ufo')
lbb = ufoLib2.Font.open('build/libre-baskerville/LibreBaskerville-Bold.ufo')
own = [g.name for g in area if g.contours and g.name in lb]
print('Libre Baskerville Regular vs Bold, same structure:', cmp(lb, lbb, [g.name for g in lb if g.contours]))
print('Area 0.73 vs Libre Baskerville Regular, same structure: core', cmp(area, lb, core), 'all own outlines', cmp(area, lb, own))
pts = lambda f, names: sum(len(c.points) for n in names for c in f[n].contours)
print('points, core: Libre Baskerville', pts(lb, core), 'Area', pts(area, core))
# smooth nodes whose handles are not on one line (they would kink between masters), core
import math
bad = n_s = 0
for n in core:
    for c in area[n].contours:
        P = c.points; k = len(P)
        for i, p in enumerate(P):
            a, b = P[i-1], P[(i+1) % k]
            if p.type and p.smooth and a.type is None and b.type is None:
                n_s += 1
                v1, v2 = (p.x-a.x, p.y-a.y), (b.x-p.x, b.y-p.y)
                ang = abs(math.degrees(math.atan2(v1[0]*v2[1]-v1[1]*v2[0], v1[0]*v2[0]+v1[1]*v2[1])))
                bad += ang > 1.0
print('core smooth curve nodes', n_s, 'with handles over 1 degree off one line', bad)
# the pipeline at a bold weight
import derive as D
ufoLib2.Font.save = lambda *a, **k: None
with contextlib.redirect_stdout(io.StringIO()):
    reg = D.derive()
D.TARGET_STEM, D.TARGET_CAP_STEM = 144, 152                  # 140 and 148 after lighten's 4
D.TX, D.TX_UP, D.DELTA = D.solve(); D.T = D.TX
D.K_LOW = D.LB["xh"] / (D.LB["xh"] + 2 * D.DELTA); D.K_UP = D.LB["cap"] / (D.LB["cap"] + 2 * D.DELTA)
print('bold solve: TX', round(D.TX, 3), 'TX_UP', round(D.TX_UP, 3), 'DELTA', round(D.DELTA, 2), '(Regular: TX -0.183)')
try:
    with contextlib.redirect_stdout(io.StringIO()):
        bold = D.derive()
    names = [g.name for g in reg if g.contours]
    print('derive at the bold weight vs derive at Regular, same structure: core', cmp(reg, bold, core), 'all', cmp(reg, bold, names))
    diff = [n for n in core if sig(reg[n]) != sig(bold[n])]
    print('  core glyphs that differ:', diff)
except Exception as e:
    print('derive at bold failed:', repr(e)); traceback.print_exc(limit=2)
    bold = None
if bold is not None:
    import normalize as N
    try:
        with contextlib.redirect_stdout(io.StringIO()):
            N.normalize(bold)
        print('normalize ran on the bold derive; same structure as Area 0.73: core', cmp(area, bold, core))
        print('  differ:', [n for n in core if sig(area[n]) != sig(bold[n])])
    except Exception as e:
        tb = traceback.extract_tb(e.__traceback__)
        print('normalize on the bold derive stops at:', tb[-1].name, 'line', tb[-1].lineno, '-', repr(e)[:160])
        print('  called from:', [f.name for f in tb][-4:])
