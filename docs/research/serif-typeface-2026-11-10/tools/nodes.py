from lib import *
from PIL import Image, ImageDraw
def draw(d,f,ch,ox,oy,sc,gname=None):
    gn=gname or name(f,ch); gl=f['glyf'][gn]; G_=G(f,gn)
    for c in G_.cs:
        pts=[(ox+x*sc,oy-y*sc) for x,y in c]; d.line(pts+[pts[0]],fill=(40,40,40),width=2)
    if gl.isComposite(): return G_.adv
    co,ends,fl=gl.getCoordinates(f['glyf'])
    for (x,y),on in zip(co,fl):
        X=ox+x*sc; Y=oy-y*sc
        if on&1: d.rectangle([X-4,Y-4,X+4,Y+4],fill=(220,40,40))
        else: d.ellipse([X-3,Y-3,X+3,Y+3],outline=(40,90,220),width=2)
    return G_.adv
def sheet(path,chars,em=620):
    gf=georgia('Regular'); sf=serrif(400)
    W=60+sum(1 for _ in chars)*0; 
    im=Image.new('RGB',(2400,int(em*2.5)),'white'); d=ImageDraw.Draw(im)
    for row,f in enumerate((gf,sf)):
        sc=em/f['head'].unitsPerEm; ox=40; oy=int(em*0.85+row*em*1.22)
        d.line([(0,oy),(2400,oy)],fill=(200,200,200))
        for ch in chars:
            adv=draw(d,f,ch,ox,oy,sc); ox+=adv*sc+30
    im.save(path)
sheet('img/6_nodes_lc.png','naegs')
sheet('img/7_nodes_lc2.png','fryct')
sheet('img/8_nodes_uc.png','RGQS')
sheet('img/9_nodes_fig.png','1247&')
# serrif alternates
sf=serrif(400); im=Image.new('RGB',(2400,620),'white'); d=ImageDraw.Draw(im); ox=30
for gn in ['a','a.ss01','g','g.ss02','G','G.ss03','at','at.ss04','Z.swsh','z.swsh','M.titl','T_h.liga','f_f_i','r_a','zero.zero']:
    G_=G(sf,gn)
    for c in G_.cs:
        pts=[(ox+x*0.36,430-y*0.36) for x,y in c]; d.line(pts+[pts[0]],fill='black',width=2)
    d.text((ox,560),gn,fill=(160,60,60)); ox+=G_.adv*0.36+25
im.save('img/10_serrif_alts.png')
