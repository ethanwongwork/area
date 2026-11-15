import sys
sys.argv=['x']
exec(open('survey2.py').read().split("def gl(f,ch)")[0])
from lib import G
def kern(f,a,b):
    if 'GPOS' not in f: return 0
    for lk in f['GPOS'].table.LookupList.Lookup:
        for st in lk.SubTable:
            st=getattr(st,'ExtSubTable',st)
            if type(st).__name__!='PairPos' or a not in st.Coverage.glyphs: continue
            if st.Format==1:
                ps=st.PairSet[st.Coverage.glyphs.index(a)]
                for r in ps.PairValueRecord:
                    if r.SecondGlyph==b and r.Value1: return r.Value1.XAdvance or 0
            else:
                c1=st.ClassDef1.classDefs.get(a,0); c2=st.ClassDef2.classDefs.get(b,0)
                v=st.Class1Record[c1].Class2Record[c2].Value1
                if v and v.XAdvance: return v.XAdvance
    return 0
SERIF.append(('Area now', lambda: TTFont('/Users/ethanwong/Desktop/area/.claude/worktrees/variable-serif-typeface-df1f42/typefaces/area-serif/build/AreaSerif-Regular.ttf')))
for n,load in SERIF:
    if n in ('Georgia Pro','Area Serif 0.2'): continue
    try: f=load()
    except Exception as e: continue
    cm=f.getBestCmap(); k=1000/f['head'].unitsPerEm
    r=G(f,cm[ord('r')]); nn=G(f,cm[ord('n')]); m=G(f,cm[ord('m')])
    rf=r.h(3); nf=nn.h(3); mf=m.h(3)
    if len(mf)<2: continue
    gap=(r.adv-rf[-1][1])+nf[0][0]+kern(f,cm[ord('r')],cm[ord('n')])
    mg=mf[1][0]-mf[0][1]
    print('%-22s r-n %4.0f  m %4.0f  ratio %.2f'%(n,gap*k,mg*k,gap/mg))
