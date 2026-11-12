import sys, os
from fontTools.ttLib import TTFont
F=os.path.expanduser('~/Library/Fonts/')
for fn in ['GeorgiaPro-Regular.ttf','GeorgiaPro-Light.ttf','GeorgiaPro-Black.ttf','GeorgiaPro-Italic.ttf','GeorgiaPro-CondRegular.ttf','SerrifCollectionVF-TRIAL.ttf','SerrifMonoCollectionVF-TRIAL.ttf']:
    f=TTFont(F+fn)
    n=f['name']
    print('=====',fn)
    for i in (0,1,2,4,5,7,8,9,11,13,14,16,17):
        r=n.getName(i,3,1,0x409) or n.getName(i,1,0,0)
        if r: print(' name',i,':',str(r)[:300])
    h=f['head'];o=f['OS/2'];hh=f['hhea']
    print(' upm',h.unitsPerEm,'glyphs',f['maxp'].numGlyphs,'cmap',len(f.getBestCmap()))
    print(' xH',getattr(o,'sxHeight',None),'cap',getattr(o,'sCapHeight',None),'typoAsc',o.sTypoAscender,'typoDesc',o.sTypoDescender,'gap',o.sTypoLineGap,'winAsc',o.usWinAscent,'winDesc',o.usWinDescent,'hhea',hh.ascent,hh.descent,hh.lineGap)
    print(' weight',o.usWeightClass,'width',o.usWidthClass,'panose',vars(o.panose),'fsType',o.fsType,'vendor',o.achVendID)
    print(' tables',sorted(f.keys()))
    if 'fvar' in f:
        for a in f['fvar'].axes: print(' axis',a.axisTag,a.minValue,a.defaultValue,a.maxValue, n.getDebugName(a.axisNameID))
        for i in f['fvar'].instances: print('  inst',n.getDebugName(i.subfamilyNameID),i.coordinates)
    if 'avar' in f: print(' avar',{k:v for k,v in f['avar'].segments.items()})
    if 'STAT' in f:
        st=f['STAT'].table
        print(' STAT axes',[a.AxisTag for a in st.DesignAxisRecord.Axis])
    for t in ('GSUB','GPOS'):
        if t in f:
            tb=f[t].table
            feats={}
            for fr in tb.FeatureList.FeatureRecord:
                feats.setdefault(fr.FeatureTag,0); feats[fr.FeatureTag]+=1
            print(' ',t,'features',sorted(feats), 'scripts',[s.ScriptTag for s in tb.ScriptList.ScriptRecord],'lookups',len(tb.LookupList.Lookup))
    if 'post' in f: print(' italicAngle',f['post'].italicAngle,'ulPos',f['post'].underlinePosition,'ulThick',f['post'].underlineThickness)
    print(' strike',o.yStrikeoutPosition,o.yStrikeoutSize,'sub',o.ySubscriptYSize,o.ySubscriptYOffset,'sup',o.ySuperscriptYSize,o.ySuperscriptYOffset)
