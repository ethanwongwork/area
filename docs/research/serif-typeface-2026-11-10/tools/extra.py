from lib import *
import math
gf=georgia('Regular'); sf=serrif(400); gi=georgia('Italic'); si=serrif(400,100,-10)
def adv(f,gn): return round(f['hmtx'][gn][0]*1000/f['head'].unitsPerEm)
def box(f,gn):
    g_=G(f,gn); k=1000/f['head'].unitsPerEm; return round(g_.y0*k),round(g_.y1*k),round(g_.adv*k)
print('G default figs adv',[adv(gf,n) for n in ['zero','one','two','three','four','five','six','seven','eight','nine']])
print('G pnum figs adv',[adv(gf,'glyph%05d'%i) for i in range(615,625)])
print('G onum figs (y0,y1,adv)',[box(gf,'glyph%05d'%i) for i in range(19,29)])
print('G smallcap H,O,X',[box(gf,'glyph%05d'%i) for i in (650,657,666)])
print('S default figs adv',[adv(sf,n) for n in ['zero','one','two','three','four','five','six','seven','eight','nine']])
print('S tf figs adv',[adv(sf,n+'.tf') for n in ['zero','one','two','three','four','five','six','seven','eight','nine']])
for lab,f in (('G',gf),('S',sf)):
    print(lab,'Aring',box(f,name(f,'Å')),'Eacute',box(f,name(f,'É')),'aacute',box(f,name(f,'á')),'Ccedil',box(f,name(f,'Ç')),'paren',box(f,name(f,'(')),'bar',box(f,name(f,'|')),'hyphen',box(f,name(f,'-')),'period',box(f,name(f,'.')),'i',box(f,name(f,'i')),'t',box(f,name(f,'t')),'sups one',box(f,name(f,'¹')))
    # dot of i size
    gi_=G(f,name(f,'i')); k=1000/f['head'].unitsPerEm
    dot=[c for c in gi_.cs if min(p[1] for p in c)>gi_.y1*0.6]
    if dot:
        c=dot[0]; print('  i dot w,h,y0',round((max(p[0] for p in c)-min(p[0] for p in c))*k),round((max(p[1] for p in c)-min(p[1] for p in c))*k),round(min(p[1] for p in c)*k))
    gp=G(f,name(f,'.')); print('  period w',round((gp.x1-gp.x0)*k))
# italic angle: l stem in italic
for lab,f in (('G It',gi),('S slnt',si)):
    k=1000/f['head'].unitsPerEm; l=g(f,'l'); a=l.h(200/k)[0]; b=l.h(550/k)[0]
    print(lab,'angle',round(math.degrees(math.atan((b[0]-a[0])/(350/k))),2),'xh',round(g(f,'x').y1*k),'n adv',round(g(f,'n').adv*k),'o adv',round(g(f,'o').adv*k),'avg lc',round(sum(f['hmtx'][name(f,ch)][0] for ch in 'abcdefghijklmnopqrstuvwxyz')*k/26), 'n stem', round((lambda s:(s[0][1]-s[0][0]))(g(f,'n').h(170/k))*k))
for wd in (50,75,100):
    f=serrif(400,wd); print('S wdth',wd,'n adv',g(f,'n').adv,'o adv',g(f,'o').adv,'H',g(f,'H').adv, 'n stem', round((lambda s:(s[0][1]-s[0][0]))(g(f,'n').h(170))))
fc=georgia('CondRegular'); k=1000/2048; print('G Cond n adv',round(g(fc,'n').adv*k),'o',round(g(fc,'o').adv*k),'H',round(g(fc,'H').adv*k))
# kerning samples georgia
import itertools
from fontTools.ttLib.tables import otTables
def kern(f,a,b):
    st_all=[st for lk in f['GPOS'].table.LookupList.Lookup for st in lk.SubTable]
    tot=None
    for st in st_all:
        if hasattr(st,'ExtSubTable'): st=st.ExtSubTable
        if type(st).__name__!='PairPos': continue
        if a not in st.Coverage.glyphs: continue
        if st.Format==1:
            ps=st.PairSet[st.Coverage.glyphs.index(a)]
            for r in ps.PairValueRecord:
                if r.SecondGlyph==b: return r.Value1.XAdvance
        else:
            c1=st.ClassDef1.classDefs.get(a,0); c2=st.ClassDef2.classDefs.get(b,0)
            v=st.Class1Record[c1].Class2Record[c2].Value1
            if v and v.XAdvance: return v.XAdvance
    return 0
for lab,f in (('G',gf),('S',sf)):
    k=1000/f['head'].unitsPerEm
    print(lab,'kern',{p:round(kern(f,name(f,p[0]),name(f,p[1]))*k) for p in ['AV','To','Ty','Va','LT','r.','f)','Yo','We','P,','ry','AT']})
