import os, sys, json
from fontTools.ttLib import TTFont, TTCollection
from fontTools.varLib.instancer import instantiateVariableFont
from lib import G
F=os.path.expanduser('~/Library/Fonts/'); SYS='/System/Library/Fonts/'; SUP=SYS+'Supplemental/'
def var(path, loc):
    f=TTFont(path); axes={a.axisTag:a for a in f['fvar'].axes}
    l={k:max(axes[k].minValue,min(axes[k].maxValue,v)) for k,v in loc.items() if k in axes}
    for k,a in axes.items(): l.setdefault(k,a.defaultValue)
    return instantiateVariableFont(f,l)
def ttc(path, name):
    for f in TTCollection(path).fonts:
        if f['name'].getDebugName(4)==name: return f
    raise SystemExit('no '+name+' in '+path)
SERIF=[('Georgia', lambda: TTFont(SUP+'Georgia.ttf')),
 ('Georgia Pro', lambda: TTFont(F+'GeorgiaPro-Regular.ttf')),
 ('Charter', lambda: ttc(SUP+'Charter.ttc','Charter Roman')),
 ('PT Serif', lambda: ttc(SUP+'PTSerif.ttc','PT Serif')),
 ('Iowan Old Style', lambda: ttc(SUP+'Iowan Old Style.ttc','Iowan Old Style Roman')),
 ('New York 12', lambda: var(SYS+'NewYork.ttf',{'wght':400,'opsz':12})),
 ('Merriweather', lambda: var('ofl/Merriweather[opsz,wdth,wght].ttf',{'wght':400,'opsz':18,'wdth':100})),
 ('Source Serif 4 (12)', lambda: var('ofl/SourceSerif4[opsz,wght].ttf',{'wght':400,'opsz':12})),
 ('Literata (12)', lambda: var('ofl/Literata[opsz,wght].ttf',{'wght':400,'opsz':12})),
 ('Newsreader (12)', lambda: var('ofl/Newsreader[opsz,wght].ttf',{'wght':400,'opsz':12})),
 ('Roboto Serif (12)', lambda: var('ofl/RobotoSerif[GRAD,opsz,wdth,wght].ttf',{'wght':400,'opsz':12,'wdth':100,'GRAD':0})),
 ('Noto Serif', lambda: var('ofl/NotoSerif[wdth,wght].ttf',{'wght':400,'wdth':100})),
 ('Lora', lambda: var('ofl/Lora[wght].ttf',{'wght':400})),
 ('Serrif', lambda: var(F+'SerrifCollectionVF-TRIAL.ttf',{'wght':400,'wdth':100,'slnt':0})),
 ('Libre Baskerville', lambda: var('ofl/LibreBaskerville[wght].ttf',{'wght':400})),
 ('Area Serif 0.2', lambda: TTFont('/Users/ethanwong/Desktop/area/.claude/worktrees/variable-serif-typeface-df1f42/typefaces/area-serif/build/AreaSerif-Regular.ttf'))]
SANS=[('Source Sans 3', lambda: var('ofl/SourceSans3[wght].ttf',{'wght':400})),
 ('Open Sans', lambda: var('ofl/OpenSans[wdth,wght].ttf',{'wght':400,'wdth':100})),
 ('Fira Sans', lambda: TTFont('ofl/FiraSans-Regular.ttf')),
 ('Noto Sans', lambda: var('ofl/NotoSans[wdth,wght].ttf',{'wght':400,'wdth':100})),
 ('Alegreya Sans', lambda: TTFont('ofl/AlegreyaSans-Regular.ttf'))]
def gl(f,ch): return G(f,f.getBestCmap()[ord(ch)])
def w(s): return s[1]-s[0]
rows=[]
for kind,lst in (('serif',SERIF),('sans',SANS)):
    for name,load in lst:
        f=load(); upm=f['head'].unitsPerEm
        x=gl(f,'x'); H=gl(f,'H'); n=gl(f,'n'); o=gl(f,'o'); c=gl(f,'c'); e=gl(f,'e'); r=gl(f,'r'); l=gl(f,'l'); p=gl(f,'p'); I=gl(f,'I')
        xh=x.y1; cap=H.y1
        ns=n.h(xh*0.35); stem=w(ns[0])
        os_=o.h(xh/2); ov=o.v((o.x0+o.x1)/2)
        # c: aperture and terminal size measured near its right end
        cx=c.x1-(c.x1-c.x0)*0.06; cs=c.v(cx)
        ap=(cs[-1][0]-cs[0][1]) if len(cs)>=2 else float('nan')
        cterm_top=w(cs[-1]) if cs else float('nan')
        cterm_bot=w(cs[0]) if cs else float('nan')
        ex=e.x1-(e.x1-e.x0)*0.06; es=e.v(ex); eap=(es[-1][0]-es[0][1]) if len(es)>=2 else float('nan')
        rx=r.x1-(r.x1-r.x0)*0.08; rs=r.v(rx); rterm=w(rs[-1]) if rs else float('nan')
        # serif tip (I foot)
        ft=I.h(2); st=I.h(cap/2)
        proj=st[0][0]-ft[0][0]
        tip=w(I.v(ft[0][0]+proj*0.12)[0]) if proj>5 else 0
        nl=ns[0][0]; nr=n.adv-ns[-1][1]
        d=dict(kind=kind,name=name,x_em=xh/upm,x_cap=xh/cap,asc_x=l.y1/xh,desc_x=-p.y0/xh,
               stem_x=stem/xh,contrast=w(os_[0])/w(ov[0]),nadv_x=n.adv/xh,oadv_x=o.adv/xh,
               c_ap_x=ap/xh,e_ap_x=eap/xh,cterm_stem=cterm_top/stem,cbot_stem=cterm_bot/stem,rterm_stem=rterm/stem,
               tip_stem=tip/stem,proj_stem=proj/stem if proj>5 else 0,sb_x=(nl+nr)/xh,
               stem=stem*1000/upm, hair=w(ov[0])*1000/upm)
        rows.append(d)
keys=['x_em','x_cap','asc_x','desc_x','stem_x','contrast','nadv_x','oadv_x','c_ap_x','e_ap_x','cterm_stem','cbot_stem','rterm_stem','tip_stem','proj_stem','sb_x']
print('%-22s'%'font'+''.join('%9s'%k[:9] for k in keys))
for d in rows: print('%-22s'%d['name'][:22]+''.join('%9.3f'%d[k] for k in keys))
json.dump(rows,open('survey2.json','w'),indent=1)
