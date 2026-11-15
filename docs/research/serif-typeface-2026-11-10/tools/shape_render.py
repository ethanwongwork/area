import sys, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from PIL import Image, ImageDraw, ImageChops
class Flat(BasePen):
    def __init__(s,gs): super().__init__(gs); s.cs=[]
    def _moveTo(s,p): s.cs.append([p])
    def _lineTo(s,p): s.cs[-1].append(p)
    def _qCurveToOne(s,a,c):
        p=s.cs[-1][-1]
        for i in range(1,9):
            t=i/8;u=1-t; s.cs[-1].append((u*u*p[0]+2*u*t*a[0]+t*t*c[0],u*u*p[1]+2*u*t*a[1]+t*t*c[1]))
def line(path, text, size, ss=4, var=None):
    blob=hb.Blob.from_file_path(path); face=hb.Face(blob); font=hb.Font(face)
    if var: font.set_variations(var)
    buf=hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); hb.shape(font,buf,{'kern':True,'liga':True})
    tt=TTFont(path)
    if var and 'fvar' in tt:
        from fontTools.varLib.instancer import instantiateVariableFont
        tt=instantiateVariableFont(tt,var)
    gs=tt.getGlyphSet(); order=tt.getGlyphOrder(); upm=tt['head'].unitsPerEm; sc=size/upm*ss
    W=int(sum(p.x_advance for p in buf.glyph_positions)*sc)+20; H=int(size*1.4*ss)
    img=Image.new('L',(W,H),0); x=10*ss; base=size*1.05*ss
    for info,pos in zip(buf.glyph_infos,buf.glyph_positions):
        pen=Flat(gs); gs[order[info.codepoint]].draw(pen)
        acc=None
        for c in pen.cs:
            L=Image.new('1',(W,H),0); ImageDraw.Draw(L).polygon([(x+(px+pos.x_offset)*sc, base-(py+pos.y_offset)*sc) for px,py in c],fill=1)
            acc=L if acc is None else ImageChops.logical_xor(acc,L)
        if acc: img=ImageChops.lighter(img,acc.convert('L'))
        x+=pos.x_advance*sc
    return Image.eval(img.resize((W//ss,H//ss),Image.LANCZOS),lambda v:255-v)
if __name__=='__main__':
    out=sys.argv[1]; rows=[]
    for spec in sys.argv[2:]:
        path,size,text=spec.split('|',2); rows.append(line(path,text,int(size),var={'wght':400,'wdth':100,'slnt':0} if 'Serrif' in path else None))
    W=max(r.width for r in rows); H=sum(r.height for r in rows)
    sheet=Image.new('L',(W,H),255); y=0
    for r in rows: sheet.paste(r,(0,y)); y+=r.height
    sheet.save(out)
