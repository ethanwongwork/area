import os, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from lib import G
from PIL import Image, ImageDraw
F=os.path.expanduser('~/Library/Fonts/')
fonts=[('Area',TTFont('/Users/ethanwong/Desktop/area/.claude/worktrees/variable-serif-typeface-df1f42/typefaces/area-serif/build/AreaSerif-Regular.ttf')),
 ('Libre Baskerville',instantiateVariableFont(TTFont('ofl/LibreBaskerville[wght].ttf'),{'wght':400})),
 ('Serrif',instantiateVariableFont(TTFont(F+'SerrifCollectionVF-TRIAL.ttf'),{'wght':400,'wdth':100,'slnt':0})),
 ('Georgia Pro',TTFont(F+'GeorgiaPro-Regular.ttf'))]
w=lambda s:s[1]-s[0]
print('%-18s %6s %6s %6s %6s %6s %6s %6s %6s'%('J','hook','bottom','bend','ball','serL','serR','adv','stem'))
for n,f in fonts:
    cm=f.getBestCmap(); J=G(f,cm[ord('J')]); H=G(f,cm[ord('H')]); cap=H.y1
    st=J.h(cap*0.55); s=[x for x in st if w(x)>10][-1]; stem=w(s)
    hook=s[0]-J.x0                       # how far the hook reaches left of the stem
    # where the stem stops being straight: scan down until the left edge moves 2% of cap
    y=cap*0.55; left=s[0]
    while y>0:
        sp=[x for x in J.h(y) if x[1]>s[0]-5]
        if not sp or abs(sp[-1][0]-left)>cap*0.01: break
        y-=2
    bend=y/cap
    # ball: thickest vertical span near the hook's left end
    bx=J.x0+(s[0]-J.x0)*0.12; bs=J.v(bx); ball=max(w(x) for x in bs) if bs else 0
    top=J.h(cap-3); serL=s[0]-top[0][0]; serR=top[-1][1]-s[1]
    print('%-18s %6.2f %6.2f %6.2f %6.2f %6.2f %6.2f %6.2f %6.0f'%(n,hook/stem,J.y0/cap,bend,ball/stem,serL/stem,serR/stem,J.adv/cap,stem*1000/f['head'].unitsPerEm))
print()
print('%-18s %7s %7s %7s %7s %7s %7s'%('g','ear top','ear out','ear thk','bowl w','loop w','loop dp'))
for n,f in fonts:
    cm=f.getBestCmap(); g=G(f,cm[ord('g')]); x=G(f,cm[ord('x')]); o=G(f,cm[ord('o')]); xh=x.y1
    ns=G(f,cm[ord('n')]).h(xh*0.35); stem=w(ns[0])
    # bowl: span at 0.75 x-height
    b=g.h(xh*0.72); bowl=(b[0][0],b[-1][1]) if b else (0,0)
    # ear: the parts of g right of the bowl, above 0.6 x-height
    pts=[q for c in g.cs for q in c if q[1]>xh*0.6]
    eartop=max(q[1] for q in pts); earout=g.x1-bowl[1]
    ex=g.x1-(g.x1-bowl[1])*0.3; es=[x for x in g.v(ex) if x[0]>xh*0.5]; ear=max(w(x) for x in es) if es else 0
    loop=g.h(g.y0*0.5); lw=(loop[-1][1]-loop[0][0]) if loop else 0
    print('%-18s %7.2f %7.2f %7.2f %7.2f %7.2f %7.2f'%(n,eartop/xh,earout/stem,ear/stem,(bowl[1]-bowl[0])/xh,lw/xh,-g.y0/xh))
# overlay drawing: J and g, each font scaled to Area's cap / x-height, aligned at stem / bowl
im=Image.new('RGB',(1800,760),'white'); d=ImageDraw.Draw(im,'RGBA')
cols={'Area':(20,23,28),'Libre Baskerville':(15,140,90),'Serrif':(214,60,40),'Georgia Pro':(36,86,201)}
A=fonts[0][1]; capA=G(A,A.getBestCmap()[ord('H')]).y1; xhA=G(A,A.getBestCmap()[ord('x')]).y1
for col,(ch,ref) in enumerate((('J','cap'),('g','x'))):
    for n,f in fonts:
        cm=f.getBestCmap(); gl=G(f,cm[ord(ch)])
        k=(capA/G(f,cm[ord('H')]).y1) if ref=='cap' else (xhA/G(f,cm[ord('x')]).y1)
        if ch=='J':
            s=[x for x in gl.h(G(f,cm[ord('H')]).y1*0.55) if w(x)>10][-1]; ax=s[1]   # align stem's right edge
            ox=col*900+620
        else:
            ax=gl.x0; ox=col*900+170
        sc=0.6
        for c in gl.cs:
            pts=[(ox+(x-ax)*k*sc, 520-y*k*sc) for x,y in c]
            if n=='Area': d.polygon(pts,fill=(20,23,28,40))
            d.line(pts+[pts[0]],fill=cols[n]+(255,),width=3 if n=='Area' else 2)
    d.line([(col*900,520),(col*900+880,520)],fill=(0,0,0,60))
im.save('img/jg-overlay.png')
