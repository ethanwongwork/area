from lib import *
import unicodedata, collections
gf=georgia('Regular'); sf=TTFont(F+'SerrifCollectionVF-TRIAL.ttf')
for label,f in (('GEORGIA PRO',gf),('SERRIF',sf)):
    print('#####',label)
    gs=f['GSUB'].table; n=f['name']
    seen={}
    for fr in gs.FeatureList.FeatureRecord:
        tag=fr.FeatureTag
        if tag in ('aalt',) : continue
        nm=''
        fp=fr.Feature.FeatureParams
        if fp is not None and hasattr(fp,'UINameID'): nm=n.getDebugName(fp.UINameID)
        subs=[]
        for li in fr.Feature.LookupListIndex:
            lk=gs.LookupList.Lookup[li]
            for st in lk.SubTable:
                if hasattr(st,'ExtSubTable'): st=st.ExtSubTable
                if hasattr(st,'mapping'):
                    for a,b in st.mapping.items(): subs.append('%s>%s'%(a,b if isinstance(b,str) else '+'.join(b)))
                elif hasattr(st,'ligatures'):
                    for a,ls in st.ligatures.items():
                        for lg in ls: subs.append('%s+%s>%s'%(a,'+'.join(lg.Component),lg.LigGlyph))
                elif hasattr(st,'alternates'):
                    for a,b in st.alternates.items(): subs.append('%s>[%s]'%(a,','.join(b)))
                else: subs.append('<%s fmt>'%type(st).__name__)
        key=(tag,tuple(subs))
        if key in seen: continue
        seen[key]=1
        print(' %s %s (%d): %s'%(tag,nm or '',len(subs),' '.join(subs[:70])+(' …' if len(subs)>70 else '')))
    if 'FeatureVariations' in dir(gs) and gs.FeatureVariations: print(' FeatureVariations records:',len(gs.FeatureVariations.FeatureVariationRecord))
    # glyph name suffixes
    suf=collections.Counter(nm.split('.',1)[1] if '.' in nm and not nm.startswith('.') else '' for nm in f.getGlyphOrder())
    print(' suffixes',dict(suf))
    cm=f.getBestCmap()
    blocks=collections.Counter()
    for cp in cm:
        try: nm=unicodedata.name(chr(cp))
        except: nm='?'
        sc='Latin' if 'LATIN' in nm else 'Greek' if 'GREEK' in nm else 'Cyrillic' if 'CYRILLIC' in nm else 'Combining' if 'COMBINING' in nm else 'Digit/Fraction' if ('DIGIT' in nm or 'FRACTION' in nm) else 'Arrow' if 'ARROW' in nm else 'Other'
        blocks[sc]+=1
    print(' cmap by kind',dict(blocks))
    # GPOS
    gp=f['GPOS'].table
    for i,lk in enumerate(gp.LookupList.Lookup):
        info=[]
        for st in lk.SubTable:
            if hasattr(st,'ExtSubTable'): st=st.ExtSubTable
            t=type(st).__name__
            if t=='PairPos':
                if st.Format==1: info.append('pairs fmt1: %d first glyphs, %d pairs'%(len(st.Coverage.glyphs),sum(len(ps.PairValueRecord) for ps in st.PairSet)))
                else:
                    nz=sum(1 for c1 in st.Class1Record for c2 in c1.Class2Record if (c2.Value1 and c2.Value1.XAdvance))
                    info.append('class kern %dx%d nonzero %d'%(st.Class1Count,st.Class2Count,nz))
            elif t=='MarkBasePos': info.append('mark-base: %d bases, %d marks, %d classes'%(len(st.BaseCoverage.glyphs),len(st.MarkCoverage.glyphs),st.ClassCount))
            elif t=='MarkMarkPos': info.append('mark-mark: %d'%len(st.Mark1Coverage.glyphs))
            else: info.append(t)
        print(' GPOS lookup',i,lk.LookupType,'; '.join(info)[:400])
    # composites
    gl=f['glyf']; comp=sum(1 for g_ in f.getGlyphOrder() if gl[g_].isComposite()); print(' composites',comp,'of',len(f.getGlyphOrder()))
print('only in Georgia cmap:',''.join(chr(c) for c in sorted(set(gf.getBestCmap())-set(sf.getBestCmap())))[:600])
print('only in Serrif cmap:',''.join(chr(c) for c in sorted(set(sf.getBestCmap())-set(gf.getBestCmap())))[:600])
# gvar masters
gv=sf['gvar']; peaks=set()
for gn in ('n','a','g','O'):
    for tv in gv.variations[gn]: peaks.add(tuple(sorted((k,v[1]) for k,v in tv.axes.items())))
print('Serrif gvar regions (n,a,g,O):',sorted(peaks))
# points
for label,f in (('G',gf),('S',serrif(400))):
    gs=f.getGlyphSet(); tot_on=tot_off=0; out=[]
    for ch in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789&@':
        p=Flat(gs); gs[name(f,ch)].draw(p); tot_on+=p.on; tot_off+=p.off; out.append('%s:%d/%d'%(ch,p.on,p.off))
    print(label,'on/off total',tot_on,tot_off,' '.join(out))
