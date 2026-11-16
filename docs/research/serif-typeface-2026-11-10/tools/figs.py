from lib import *
from PIL import Image, ImageDraw, ImageFont
import base64, io, json
SV=F+'SerrifCollectionVF-TRIAL.ttf'
def pf(kind,size,w=400,slnt=0,style=None):
    if kind=='G': return ImageFont.truetype(F+'GeorgiaPro-%s.ttf'%(style or 'Regular'),size)
    f=ImageFont.truetype(SV,size); f.set_variation_by_axes([w,slnt,100]); return f
out={}
def save(key,im):
    # transparent-ink PNG: alpha = darkness, so it themes via CSS filter-free approach
    g_=im.convert('L'); a=g_.point(lambda v:255-v); rgba=Image.new('LA',im.size,0); rgba.putalpha(a)
    b=io.BytesIO(); rgba.save(b,'PNG',optimize=True); out[key]=base64.b64encode(b.getvalue()).decode(); print(key,im.size,len(b.getvalue())//1024,'KB')
def rows(key,items,size,W,lh=1.3,pad=10):
    im=Image.new('L',(W,int(pad*2+len(items)*size*lh)),255); d=ImageDraw.Draw(im); y=pad
    for font,text in items:
        d.text((pad,y),text,font=font,fill=0); y+=int(size*lh)
    save(key,im)
s=84
rows('g_words',[(pf('G',s),'Hamburgefonstiv Rag 0123')],s,1300)
rows('s_words',[(pf('S',s),'Hamburgefonstiv Rag 0123')],s,1300)
rows('g_ital',[(pf('G',s,style='Italic'),'Hamburgefonstiv akvwz')],s,1300)
rows('s_ital',[(pf('S',s,slnt=-10),'Hamburgefonstiv akvwz')],s,1300)
rows('g_conf',[(pf('G',s),'Il1 O0 rn m cl d  a e c s g')],s,1300)
rows('s_conf',[(pf('S',s),'Il1 O0 rn m cl d  a e c s g')],s,1300)
# overlay n a e g at same em, outlines only
def outline(key,chars,em=300):
    gf=georgia('Regular'); sf=serrif(400)
    im=Image.new('L',(1300,int(em*1.25)),255); d=ImageDraw.Draw(im)
    ox=20; oy=int(em*0.9)
    for ch in chars:
        advs=[]
        for f,col,w in ((gf,0,3),(sf,120,2)):
            sc=em/f['head'].unitsPerEm; G_=g(f,ch); advs.append(G_.adv*sc)
            for c in G_.cs:
                pts=[(ox+x*sc,oy-y*sc) for x,y in c]
                if col==0: d.line(pts+[pts[0]],fill=0,width=3)
                else:
                    for i in range(0,len(pts),2): d.line([pts[i],pts[(i+1)%len(pts)]],fill=90,width=2)
        ox+=max(advs)+24
    save(key,im)
outline('ov_lc','naegsfrt')
outline('ov_uc','HORGQ125')
# small sizes 2x zoom
txt='Settings saved. Illegal 1lI O0o rn m — 3 files, 128.5 MB · Rename, Duplicate, Delete'
im=Image.new('L',(640,150),255); d=ImageDraw.Draw(im); y=4
for sz in (12,13,14,16):
    for k in ('G','S'):
        d.text((4,y),txt,font=pf(k,sz),fill=0); y+=int(sz*1.35)
save('small',im.resize((1920,450),Image.NEAREST))
json.dump(out,open('figs.json','w'))
