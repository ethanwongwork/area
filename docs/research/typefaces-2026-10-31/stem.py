import sys, os
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
class Flat(BasePen):
    def __init__(s,gs): super().__init__(gs); s.c=[]; s.cur=None
    def _moveTo(s,p): s.c.append([p]); 
    def _lineTo(s,p): s.c[-1].append(p)
    def _curveToOne(s,a,b,c):
        p0=s.c[-1][-1]
        for i in range(1,17):
            t=i/16; mt=1-t
            s.c[-1].append((mt**3*p0[0]+3*mt*mt*t*a[0]+3*mt*t*t*b[0]+t**3*c[0], mt**3*p0[1]+3*mt*mt*t*a[1]+3*mt*t*t*b[1]+t**3*c[1]))
    def _qCurveToOne(s,a,b):
        p0=s.c[-1][-1]
        for i in range(1,17):
            t=i/16; mt=1-t
            s.c[-1].append((mt*mt*p0[0]+2*mt*t*a[0]+t*t*b[0], mt*mt*p0[1]+2*mt*t*a[1]+t*t*b[1]))
def slice_(f,ch,y):
    gs=f.getGlyphSet(); g=f.getBestCmap()[ord(ch)]; p=Flat(gs); gs[g].draw(p)
    xs=[]
    for c in p.c:
        for (x1,y1),(x2,y2) in zip(c,c[1:]+c[:1]):
            if (y1<=y<y2) or (y2<=y<y1): xs.append(x1+(y-y1)*(x2-x1)/(y2-y1))
    xs.sort(); return xs
out=[]
for p in sorted(sys.argv[1:]):
    try: f=TTFont(p)
    except Exception: print("skip",p); continue
    upm=f['head'].unitsPerEm
    xh=f['OS/2'].sxHeight or 500
    try:
        xs=slice_(f,'l',xh*0.5); stem=(xs[1]-xs[0])/upm
        xs=slice_(f,'n',xh*0.5); nstem=(xs[1]-xs[0])/upm
    except Exception as e: continue
    out.append((os.path.basename(p)[:-4],stem,nstem))
g=[o for o in out if o[0]=='Geist'][0]
for n,s,ns in sorted(out,key=lambda o:-o[1]):
    print(f"{n:28} l-stem {s:.4f}em  n-stem {ns:.4f}em  vs Geist {s/g[1]:.2f}  at14px {s*14:.2f}px")
