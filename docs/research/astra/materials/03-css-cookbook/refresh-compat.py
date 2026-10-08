#!/usr/bin/env python3
"""Reproduce the dated compatibility extracts at immutable upstream commits.
Run from any directory; writes only beside this script. Requires public network access.
"""
import hashlib
import json
from pathlib import Path
from urllib.request import urlopen
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
DATE = '2026-10-08'
BCD = 'ef3eb098c3fea5291e31dc40ed9f8e47de2978bd'
CI = 'e7ddc557408a5caa830e3e2949a302361f5b37c6'
FEATURES = {
 'css/properties/box-shadow.json': ['css.properties.box-shadow'],
 'css/properties/text-shadow.json': ['css.properties.text-shadow'],
 'css/properties/background-clip.json': ['css.properties.background-clip'],
 'css/properties/border-image.json': ['css.properties.border-image'],
 'css/properties/border-radius.json': ['css.properties.border-radius'],
 'css/properties/mask-composite.json': ['css.properties.mask-composite'],
 'css/properties/mask-image.json': ['css.properties.mask-image'],
 'css/properties/backdrop-filter.json': ['css.properties.backdrop-filter'],
 'css/properties/filter.json': ['css.properties.filter','css.properties.filter.svg_elements'],
 'css/properties/corner-shape.json': ['css.properties.corner-shape'],
 'css/properties/opacity.json': ['css.properties.opacity'],
 'css/properties/mix-blend-mode.json': ['css.properties.mix-blend-mode'],
 'css/types/color.json': ['css.types.color.color-mix','css.types.color.rgb.relative_syntax','css.types.color.oklch.relative_syntax','css.types.color.light-dark'],
 'css/types/gradient.json': ['css.types.gradient.linear-gradient','css.types.gradient.radial-gradient','css.types.gradient.conic-gradient','css.types.gradient.linear-gradient.interpolation_color_space'],
 'svg/elements/feDisplacementMap.json': ['svg.elements.feDisplacementMap'],
 'svg/elements/feTurbulence.json': ['svg.elements.feTurbulence'],
 'css/selectors/before.json': ['css.selectors.before'],
}
CI_IDS = ['css-boxshadow','css-textshadow','background-img-opts','border-image','css-masks','css-backdrop-filter','css-filters','svg-filters','css-relative-colors','css-gradients','css-conic-gradients','css-gencontent']
def read(repo, commit, path):
 url=f'https://raw.githubusercontent.com/{repo}/{commit}/{path}'
 with urlopen(url, timeout=40) as response: raw=response.read()
 return raw.decode(), hashlib.sha256(raw).hexdigest()
def write(name, data):
 (HERE/name).write_text(json.dumps(data,indent=2)+'\n')
def main():
 files=[]
 for path, names in FEATURES.items():
  raw, digest=read('mdn/browser-compat-data',BCD,path); data=json.loads(raw); features=[]
  for name in names:
   item=data; offset=0
   for part in name.split('.'):
    item=item[part]; offset=raw.index(json.dumps(part)+':',offset)
   comp=item['__compat']
   features.append({'feature':name,'line':raw[:offset].count('\n')+1,'mdn':comp.get('mdn_url'),'support':{b:comp['support'][b] for b in ['chrome','safari','firefox']}})
  files.append({'path':path,'sha256':digest,'features':features})
 write('compat-data.json',{'repo':'mdn/browser-compat-data','commit':BCD,'checked':DATE,'files':files})
 features=[]
 for feature in CI_IDS:
  path=f'features-json/{feature}.json'; raw,digest=read('Fyrd/caniuse',CI,path); data=json.loads(raw)
  features.append({'id':feature,'title':data['title'],'url':f'https://caniuse.com/{feature}','path':path,'sha256':digest,'notes':data['notes'],'notes_by_num':data['notes_by_num'],'stats':{b:data['stats'][b] for b in ['chrome','safari','firefox']}})
 for feature in ['mdn-css_types_color_color-mix','mdn-css_properties_corner-shape','mdn-css_types_color_light-dark']:
  features.append({'id':feature,'url':f'https://caniuse.com/{feature}','provenance':'MDN BCD bridge, not an independent Fyrd feature dataset. See compat-data.json.'})
 write('caniuse-data.json',{'repo':'Fyrd/caniuse','commit':CI,'checked':DATE,'features':features})
 print(f'Reproduced {len(files)} BCD files and {len(CI_IDS)} Can I use features at pinned commits.')
if __name__ == '__main__': main()
