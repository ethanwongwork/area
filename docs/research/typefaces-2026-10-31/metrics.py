import sys, os, json
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
rows=[]
for p in sorted(sys.argv[1:]):
    try: f=TTFont(p)
    except Exception as e: print(p,e); continue
    upm=f['head'].unitsPerEm; gs=f.getGlyphSet(); cmap=f.getBestCmap()
    def bb(ch):
        g=cmap.get(ord(ch));
        if not g: return None
        pen=BoundsPen(gs); gs[g].draw(pen); return pen.bounds
    H=bb('H'); x=bb('x'); l=bb('l')
    cap=H[3]/upm if H else None; xh=x[3]/upm if x else None
    hm=f['hmtx']; adv=sum(hm[cmap[ord(c)]][0] for c in 'abcdefghijklmnopqrstuvwxyz' if ord(c) in cmap)/26/upm
    hh=f['hhea']; os2=f['OS/2']
    if os2.fsSelection & (1<<7): asc,desc,gap=os2.sTypoAscender,os2.sTypoDescender,os2.sTypoLineGap
    else: asc,desc,gap=hh.ascent,hh.descent,hh.lineGap
    feats=set()
    if 'GSUB' in f and f['GSUB'].table.FeatureList:
        feats={r.FeatureTag for r in f['GSUB'].table.FeatureList.FeatureRecord}
    name=os.path.basename(p)[:-4]
    rows.append(dict(name=name,cap=round(cap,3),xh=round(xh,3),xcap=round(xh/cap,3),adv=round(adv,3),
        line=round((asc-desc+gap)/upm,3),glyphs=len(f.getGlyphOrder()),
        tnum='tnum' in feats, ss=sorted(t for t in feats if t.startswith('ss') or t.startswith('cv'))[:40],
        zero='zero' in feats, case='case' in feats, size=os.path.getsize(p)))
geist=[r for r in rows if r['name']=='Geist'][0]
print(f"{'face':28}{'cap':>6}{'x':>6}{'x/cap':>7}{'width':>7}{'line':>6}{'xAdj':>6}{'glyph':>6} tnum zero case  ss/cv")
for r in sorted(rows,key=lambda r:-r['xh']):
    print(f"{r['name']:28}{r['cap']:6}{r['xh']:6}{r['xcap']:7}{r['adv']:7}{r['line']:6}{geist['xh']/r['xh']:6.2f}{r['glyphs']:6}  {'y' if r['tnum'] else '-'}    {'y' if r['zero'] else '-'}    {'y' if r['case'] else '-'}   {len(r['ss'])}")
json.dump(rows,open(os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])),'metrics.json'),'w'),indent=1)
