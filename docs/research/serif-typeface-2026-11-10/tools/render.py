from lib import *
from PIL import Image, ImageDraw, ImageFont, ImageChops
SV=F+'SerrifCollectionVF-TRIAL.ttf'
def pf(kind,size,w=400,slnt=0,style=None):
    if kind=='G': return ImageFont.truetype(F+'GeorgiaPro-%s.ttf'%(style or 'Regular'),size)
    f=ImageFont.truetype(SV,size); f.set_variation_by_axes([w,slnt,100]); return f
lab=ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc',18)
def sheet(path,rows,size,W=2000,pad=30,lh=1.25):
    H=int(pad*2+len(rows)*size*lh); im=Image.new('RGB',(W,H),'white'); d=ImageDraw.Draw(im); y=pad
    for label,font,text in rows:
        d.text((pad,y),label,font=lab,fill=(160,60,60)); d.text((pad+150,y),text,font=font,fill='black'); y+=int(size*lh)
    im.save(path)
s=120
sheet('img/1_words.png',[('Georgia Pro',pf('G',s),'Hamburgefonstiv Rag'),('Serrif',pf('S',s),'Hamburgefonstiv Rag'),('Georgia Pro',pf('G',s),'abcdefghijklmnopqrstuvwxyz'),('Serrif',pf('S',s),'abcdefghijklmnopqrstuvwxyz')],s,W=2100)
sheet('img/2_caps.png',[('Georgia Pro',pf('G',s),'ABCDEFGHIJKLMNOPQRS'),('Serrif',pf('S',s),'ABCDEFGHIJKLMNOPQRS'),('Georgia Pro',pf('G',s),'TUVWXYZ 0123456789'),('Serrif',pf('S',s),'TUVWXYZ 0123456789'),('Georgia Pro',pf('G',s),'&@?!$€£%#*(){}[]“”‘’;:,.'),('Serrif',pf('S',s),'&@?!$€£%#*(){}[]“”‘’;:,.')],s,W=2100)
sheet('img/3_italic.png',[('Georgia It',pf('G',s,style='Italic'),'Hamburgefonstiv abcdefgkpvwxyz'),('Serrif -10',pf('S',s,slnt=-10),'Hamburgefonstiv abcdefgkpvwxyz'),('Georgia It',pf('G',s,style='Italic'),'ABCDEFGQR 0123456789 &'),('Serrif -10',pf('S',s,slnt=-10),'ABCDEFGQR 0123456789 &')],s,W=2300)
rows=[]
for st in ('Light','Regular','SemiBold','Bold','Black'): rows.append(('G '+st,pf('G',90,style=st),'Hamburgefonstiv 0123 Rag'))
for w in (100,300,400,500,600,700,900): rows.append(('S %d'%w,pf('S',90,w=w),'Hamburgefonstiv 0123 Rag'))
sheet('img/4_weights.png',rows,90,W=1700)
# small sizes, 1x then 4x nearest
txt='Settings saved. Illegal 1lI| O0o rn m cl d  3 files, 128.5 MB — Rename, Duplicate, Delete'
rows=[]
im=Image.new('RGB',(760,330),'white'); d=ImageDraw.Draw(im); y=6
for sz in (11,12,13,14,16):
    for k in ('G','S'):
        d.text((6,y),txt,font=pf(k,sz),fill='black'); y+=int(sz*1.5)
    y+=6
im.resize((760*3,330*3),Image.NEAREST).save('img/5_small.png')
