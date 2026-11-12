import sys
sys.argv=['x']
exec(open('survey2.py').read().split("def gl(f,ch)")[0])
from lib import G
from PIL import Image, ImageDraw, ImageChops
import numpy as np
SERIF.append(('Area Serif 0.3', lambda: TTFont('/Users/ethanwong/Desktop/area/.claude/worktrees/variable-serif-typeface-df1f42/typefaces/area-serif/build/AreaSerif-Regular.ttf')))
want=['Georgia','Charter','PT Serif','Source Serif 4 (12)','Literata (12)','Roboto Serif (12)','Noto Serif','Serrif','Libre Baskerville','Area Serif 0.3']
w=lambda s:s[1]-s[0]
def mask(g, sc=0.5):
    xs=[q[0] for c in g.cs for q in c]; ys=[q[1] for c in g.cs for q in c]
    W=int((max(xs)-min(xs))*sc)+4; H=int((max(ys)-min(ys))*sc)+4
    acc=None
    for c in g.cs:
        L=Image.new('1',(W,H),0); ImageDraw.Draw(L).polygon([((x-min(xs))*sc+2,(max(ys)-y)*sc+2) for x,y in c],fill=1)
        acc=L if acc is None else ImageChops.logical_xor(acc,L)
    a=np.array(acc,dtype=float); return a, min(xs), sc
print('%-20s %6s %6s %6s %6s %6s %6s %7s'%('font','footL','footR','arm','term','adv','foot/w','balance'))
for n,load in SERIF:
    if n not in want: continue
    f=load(); cm=f.getBestCmap(); upm=f['head'].unitsPerEm
    r=G(f,cm[ord('r')]); x=G(f,cm[ord('x')]); xh=x.y1
    st=r.h(xh*0.3)[0]; stem=w(st)
    ft=r.h(xh*0.015) or r.h(2); fl=st[0]-ft[0][0]; fr=ft[-1][1]-st[1]
    arm=r.x1-st[1]
    tx=r.x1-(r.x1-r.x0)*0.08; ts=r.v(tx); term=w(ts[-1]) if ts else 0
    a,x0,sc=mask(r); cols=a.sum(0); cx=(cols*np.arange(len(cols))).sum()/cols.sum()/sc+x0
    footc=(ft[0][0]+ft[-1][1])/2
    # balance: ink centroid minus foot centre, in stems (positive = right heavy)
    print('%-20s %6.2f %6.2f %6.2f %6.2f %6.2f %6.2f %7.2f'%(n,fl/stem,fr/stem,arm/stem,term/stem,r.adv/xh,(ft[-1][1]-ft[0][0])/(r.x1-r.x0),(cx-footc)/stem))
