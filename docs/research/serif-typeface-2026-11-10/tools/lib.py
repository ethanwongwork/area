import os
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.varLib.instancer import instantiateVariableFont
F=os.path.expanduser('~/Library/Fonts/')
def georgia(style): return TTFont(F+'GeorgiaPro-%s.ttf'%style)
_serrif={}
def serrif(wght=400,wdth=100,slnt=0):
    k=(wght,wdth,slnt)
    if k not in _serrif:
        f=TTFont(F+'SerrifCollectionVF-TRIAL.ttf')
        _serrif[k]=instantiateVariableFont(f,{'wght':wght,'wdth':wdth,'slnt':slnt},inplace=True)
    return _serrif[k]
class Flat(BasePen):
    def __init__(s,gs): super().__init__(gs); s.cs=[]; s.on=0; s.off=0
    def _moveTo(s,p): s.cs.append([p]); s.on+=1
    def _lineTo(s,p): s.cs[-1].append(p); s.on+=1
    def _curveToOne(s,a,b,c):
        p=s.cs[-1][-1]; s.on+=1; s.off+=2
        for i in range(1,25):
            t=i/24; u=1-t
            s.cs[-1].append((u**3*p[0]+3*u*u*t*a[0]+3*u*t*t*b[0]+t**3*c[0],u**3*p[1]+3*u*u*t*a[1]+3*u*t*t*b[1]+t**3*c[1]))
    def _qCurveToOne(s,a,c):
        p=s.cs[-1][-1]; s.on+=1; s.off+=1
        for i in range(1,25):
            t=i/24; u=1-t
            s.cs[-1].append((u*u*p[0]+2*u*t*a[0]+t*t*c[0],u*u*p[1]+2*u*t*a[1]+t*t*c[1]))
    def _closePath(s): pass
class G:
    def __init__(s,font,name):
        gs=font.getGlyphSet(); p=Flat(gs); gs[name].draw(p)
        s.cs=[c for c in p.cs if len(c)>2]; s.adv=gs[name].width
        pts=[q for c in s.cs for q in c]
        s.x0=min(q[0] for q in pts); s.x1=max(q[0] for q in pts); s.y0=min(q[1] for q in pts); s.y1=max(q[1] for q in pts)
    def _scan(s,v,ax):
        hits=[]
        for c in s.cs:
            n=len(c)
            for i in range(n):
                a=c[i]; b=c[(i+1)%n]
                a0,b0=a[ax],b[ax]
                if (a0<=v<b0) or (b0<=v<a0):
                    t=(v-a0)/(b0-a0); o=1-ax
                    hits.append((a[o]+t*(b[o]-a[o]), 1 if b0>a0 else -1))
        hits.sort(); spans=[]; w=0; st=None
        for x,d in hits:
            if w==0: st=x
            w+=d
            if w==0 and st is not None:
                if x-st>0.5: spans.append((st,x))
        return spans
    def h(s,y): return s._scan(y+0.013,1)
    def v(s,x): return s._scan(x+0.013,0)
def name(font,ch): return font.getBestCmap()[ord(ch)]
def g(font,ch): return G(font,name(font,ch))
