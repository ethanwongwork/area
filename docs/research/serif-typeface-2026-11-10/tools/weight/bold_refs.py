"""Bold against Regular in the reference faces (numbers only): the targets for an Area Serif bold master."""
import os, json, statistics as st
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
import evlib as E, measures as M
U = E.USER_FONTS; D = E.DL
def inst(path, var):
    f = TTFont(path)
    return instantiateVariableFont(f, var, inplace=True) if var else f
faces = {
 'Georgia Pro': (inst(U+'GeorgiaPro-Regular.ttf', None), inst(U+'GeorgiaPro-Bold.ttf', None), inst(U+'GeorgiaPro-SemiBold.ttf', None)),
 'Serrif': tuple(inst(U+'SerrifCollectionVF-TRIAL.ttf', {'wght': w, 'wdth': 100, 'slnt': 0}) for w in (400, 700, 600)),
 'Libre Baskerville': (inst(D+'/LibreBaskerville.ttf', {'wght': 400}), inst(D+'/LibreBaskerville.ttf', {'wght': 700}), None),
 'Source Serif 4': tuple(inst(D+'/SourceSerif4.ttf', {'wght': w, 'opsz': 20}) for w in (400, 700, 600)),
 'Literata': (inst(D+'/Literata.ttf', {'wght': 400, 'opsz': 12}), inst(D+'/Literata.ttf', {'wght': 700, 'opsz': 12}), None),
 'Merriweather': (inst(D+'/Merriweather.ttf', {'wght': 400, 'wdth': 100, 'opsz': 18}), inst(D+'/Merriweather.ttf', {'wght': 700, 'wdth': 100, 'opsz': 18}), None),
}
def foot(f):
    sh = E.Shape(f, 'n'); m = E.metrics(f); s0 = sh.h(m['xh']*0.3)[0]; ft = sh.h(2)[0]; sp = sh.v(ft[0]+6)
    return s0[0]-ft[0], (sp[0][1]-sp[0][0]) if sp else None
def counter(f, ch, zone):
    sp = E.Shape(f, ch).h(zone*0.3)
    return sp[1][0]-sp[0][1] if len(sp) >= 2 else None
def one(f):
    m = M.measure(f); ft = foot(f)
    d = {k: m.get(k) for k in ('stem.n','STEM.H','round.o.L','thin.o.top','ROUND.O.L','THIN.O.top','bar.e','BAR.H','thin.n.arch','xh','cap','asc','desc','w.n','w.o','w.H','w.O','adv.n','adv.o','adv.H','adv.O')}
    d['lc advance'] = st.mean(m['adv.'+c] for c in E.LOWER); d['cap advance'] = st.mean(m['adv.'+c] for c in E.UPPER)
    d['fig advance'] = st.mean(m['adv.'+c] for c in E.DIGITS)
    d['foot serif'] = ft[0]; d['serif tip'] = ft[1]
    d['n counter'] = counter(f, 'n', m['xh']); d['H counter'] = counter(f, 'H', m['cap'])
    d['n sidebearings'] = m['adv.n']-m['w.n']
    return d
area = one(E.face('area'))
out = {n: [one(x) if x else None for x in v] for n, v in faces.items()}
json.dump({'area': area, 'refs': out}, open(os.path.join(E.OUT, 'bold-refs.json'), 'w'))
keys = list(area)
print(f"{'Bold / Regular':16}" + ''.join(f'{n[:13]:>15}' for n in out) + f"{'mean G,S':>10}{'Area Reg':>10}{'-> Bold':>9}")
for k in keys:
    line = f'{k:16}'; rs = {}
    for n, (r, b, sb) in out.items():
        if r[k] and b[k]:
            rs[n] = b[k]/r[k]; line += f'{rs[n]:8.3f}{b[k]*520/b["xh"]:7.0f}'
        else: line += f"{'':15}"
    t = (rs.get('Georgia Pro', 0)+rs.get('Serrif', 0))/2 if 'Georgia Pro' in rs and 'Serrif' in rs else None
    print(line + (f'{t:10.3f}{area[k]:10.1f}{area[k]*t:9.1f}' if t and area[k] else ''))
print('contrast o (thick/thin), Regular > Bold:', {n: (round(r['round.o.L']/r['thin.o.top'], 2), round(b['round.o.L']/b['thin.o.top'], 2)) for n, (r, b, _) in out.items()}, 'Area', round(area['round.o.L']/area['thin.o.top'], 2))
print('stem / x-height, Regular > Bold:', {n: (round(r['stem.n']/r['xh'], 3), round(b['stem.n']/b['xh'], 3)) for n, (r, b, _) in out.items()}, 'Area', round(area['stem.n']/area['xh'], 3))
print('SemiBold / Regular n stem, H stem:', {n: (round(sb['stem.n']/r['stem.n'], 3), round(sb['STEM.H']/r['STEM.H'], 3)) for n, (r, b, sb) in out.items() if sb})
