import json,sys,re
R=sys.argv[1]
css=open(f'{R}/packages/styles/dist/area.css').read()
# Geist comes from Google Fonts on the page; the viewer blocks jsDelivr, so drop Area's own @font-face rules.
css=re.sub(r'@font-face\s*\{[^}]*cdn\.jsdelivr[^}]*\}','',css)
assert 'cdn.jsdelivr' not in css and '</style' not in css
s=open('choice-illustrations.src.html').read(); d=json.load(open('axes-data.json'))
sc=json.load(open('scenes/screens.json')); sc.pop('errors',None)
out=s.replace('__AREA_CSS__',css).replace('__DATA__', json.dumps(d,separators=(',',':'))).replace('__SCREENS__', json.dumps(sc,separators=(',',':')).replace('</','<\\/'))
open('choice-illustrations.html','w').write(out); print(len(out))
