"""Generate task-18 model results. Writes only alongside this script.

Usage: python3 build.py [--check] [--gate]
--gate fails on any requested-paint WCAG failure or unresolved input. Expected
failures remain report data during normal generation; never become waived passes.
"""
from pathlib import Path
from functools import lru_cache
from collections import Counter
import csv, hashlib, html, io, json, sys, subprocess
from paint import Paint, Stop, Unresolved, rgb, worst

HERE=Path(__file__).resolve().parent
INPUT=json.loads((HERE/'inputs.json').read_text())
PRESET_SOURCE=subprocess.check_output(['git','show',INPUT['researchCommit']+':'+INPUT['presets']['path']],cwd=HERE.parents[4])
assert hashlib.sha256(PRESET_SOURCE).hexdigest()==INPUT['presets']['sha256'], 'Preset lock changed'
PRESETS=json.loads(PRESET_SOURCE)
ROLES=PRESETS['roles']
MODES=['light','dark']
SCENARIOS=['requested','guarded','f0']
RESEARCH=INPUT['researchCommit']; AREA=INPUT['areaCommit']
ROOT='https://github.com/ethanwongwork/area/blob/'

def assertion_pin(assertion):
    # These source blocks produce the concrete input assertions; records retain
    # their index so the exact source-generated pair is also reproducible.
    note=assertion['note']
    if note in ['body copy','secondary copy','placeholder']: lines='70-L81'
    elif 'inverse Badge' in note: lines='195-L205'
    elif note in ['UI label in interactive state','required boundary, state or opaque focus'] or any(
        s in note for s in ['input edge','checked mark','unchecked switch','neutral button hover',
                           'opaque focus on a tinted','tonal UI label','selected chip']): lines='207-L230'
    elif any(s in note for s in ['text','tag label','solid button label']) and note!='tooltip and toast text': lines='83-L146'
    else: lines='148-L192'
    return f'{ROOT}{AREA}/packages/tokens/src/contrast/assertions.ts#L{lines}'

def hosts(bg):
    # Authored coverage bindings, not a claim that each token occurs in all
    # components. Every declared source pairing is retained unchanged.
    if bg=='bg-page': return ['page','raised-control'] # latter is a transparent action's host ground
    if bg=='bg-surface': return ['container','floating-surface','thumb-knob']
    if bg in ['bg-code','bg-stripe']: return ['container']
    if bg=='bg-subtle': return ['container','recessed-field-track']
    if bg.startswith('bg-component'): return ['raised-control','recessed-field-track']
    if bg=='bg-inverse': return ['floating-surface']
    if bg=='stroke-control': return ['recessed-field-track']
    if '-solid' in bg: return ['raised-control','indicator-fill']
    if '-surface' in bg: return ['raised-control','indicator-fill']
    raise ValueError('Unmapped source background '+bg)

def kind(a):
    if a['wcag']>=4.5: return 'text'
    if a['wcag']==3:
        return 'glyph' if a['note'] in ['checked mark or switch thumb','increased-contrast unchecked switch thumb'] else 'edge'
    return None

FIXTURES=[]; EXCLUDED=[]
for i,a in enumerate(INPUT['assertions']):
    if kind(a) is None:
        EXCLUDED.append(dict(index=i,**a,reason='Decorative/aesthetic or disabled floor; not a required 4.5/3:1 pairing.'))
        continue
    for host in hosts(a['bg']):
        FIXTURES.append(dict(id=f'a{i:03d}-{host}',assertion=i,role=host,kind=kind(a),
            fg=a['fg'],bg=a['bg'],threshold=a['wcag'],apcaFloor=a['apca'],note=a['note'],
            source=assertion_pin(a),
            fixedFamilyGuard=a['bg'] in ['bg-page','bg-code','bg-stripe','bg-subtle','bg-inverse','stroke-control']
                or host=='indicator-fill'))
BY_ID={f['id']:f for f in FIXTURES}

def gradient(controls,mode):
    g=controls['gradients'].get('body-reflection')
    if not g: return ()
    if g['kind']!='linear' or g['interpolation']!='srgb': raise Unresolved('Unsupported body gradient')
    stops=[]
    for s in g['stops']:
        color=rgb('#ffffff') if s['source']=='highlight-white' else rgb(s['customLight' if mode=='light' else 'customDark'])
        stops.append(Stop(s['position']/100,color,s['alpha']))
    return tuple(stops)

@lru_cache(maxsize=None)
def measure(fg,paint,threshold): return worst(rgb(fg),paint,threshold)

def probe(preset,mode,fixture,scenario):
    c=preset['modes'][mode]['roles'][fixture['role']]['controls']
    if c['filters'] or c['backdrop']['mapping']!='unchanged': raise Unresolved('Unsupported filter/refraction')
    colors=INPUT['themes'][mode]; base=rgb(colors[fixture['bg']])
    suppress=fixture['fixedFamilyGuard'] or scenario=='f0' or (scenario=='guarded' and fixture['kind'] in ['text','glyph'])
    alpha=1 if suppress else 1-c['body']['transparency']
    state_suppresses_reflection=(fixture['fg']=='focus-color' or
        (fixture['kind']=='edge' and fixture['fg'] in ['fg-danger','fg-danger-vivid']))
    stops=() if suppress or state_suppresses_reflection else gradient(c,mode)
    # Optional perimeter relief/grain/gloss/rims/halos are excluded from each
    # required-cue local comparison strip by this fixture's declared mask.
    # This is a test fixture assumption, not verified component geometry.
    paint=Paint(base,alpha,stops)
    inside=measure(colors[fixture['fg']],paint,fixture['threshold'])
    record=dict(inside); record['adjacency']='inside'; record['transmission']=1-alpha
    record['gradient']=bool(stops)
    record['backdropDependent']=alpha<1
    if fixture['kind']=='edge':
        outside=measure(colors[fixture['fg']],Paint(rgb(colors['bg-page'])),fixture['threshold'])
        if outside['ratio']<record['ratio']:
            record=dict(outside,adjacency='outside-page',transmission=0,gradient=False,backdropDependent=False)
    return record

def rounded(value):
    if isinstance(value,float): return round(value,12)
    if isinstance(value,dict): return {k:rounded(v) for k,v in value.items()}
    if isinstance(value,list): return [rounded(v) for v in value]
    return value

def show_rgb(c):
    return 'rgb('+', '.join(f'{v*255:.4f}' for v in c)+')'

def witness(r):
    if not r.get('backdropDependent'): return 'any backdrop'
    return show_rgb(r['backdrop'])

def aggregate(records,fixture_ids):
    values=[dict(records[k],fixture=k) for k in fixture_ids]
    if not values: return dict(status='N/A',count=0,reason='No required text/indicator paint in this role; see coverage.md.')
    counts=dict(Counter(v['status'] for v in values))
    status='FAIL' if counts.get('FAIL') else 'UNRESOLVED' if counts.get('UNRESOLVED') else 'PASS'
    candidates=[v for v in values if 'ratio' in v]
    # Tightest proportional margin is meaningful when 4.5 and 3 floors differ.
    result=min(candidates,key=lambda v:v['ratio']/BY_ID[v['fixture']]['threshold']) if candidates else None
    return dict(status=status,count=len(values),counts=counts,worst=result)

def ids_for(role,target):
    if role in ['divider','scrim']: return []
    if role=='text': return [f['id'] for f in FIXTURES if f['kind']=='text'] if target=='text' else []
    if role=='glyph': return [f['id'] for f in FIXTURES if f['kind']=='glyph'] if target=='edge' else []
    if role=='edge': return [f['id'] for f in FIXTURES if f['kind']=='edge'] if target=='edge' else []
    return [f['id'] for f in FIXTURES if f['role']==role and (f['kind']=='text' if target=='text' else f['kind']!='text')]

def compact_cell(aggregate_value):
    if aggregate_value['status']=='N/A': return 'N/A'
    r=aggregate_value['worst']
    if r is None: return 'UNRESOLVED'
    f=BY_ID[r['fixture']]
    return f"{aggregate_value['status']} {r['ratio']:.4f}/{f['threshold']:g} · {f['fg']} / {f['bg']} · {witness(r)} · t={r['position']:.5f}"

def write(path,value):
    path=HERE/path
    if isinstance(value,(dict,list)): value=json.dumps(rounded(value),separators=(',',':'),ensure_ascii=False)+'\n'
    if path.suffix=='.json': assert len(value.encode())<1_000_000, path.name
    if '--check' in sys.argv:
        assert path.read_text()==value, f'Stale generated artifact: {path.name}'
    else: path.write_text(value)

def main():
    write('bindings.json',dict(description='Authored role-host mapping; exact source-generated token pairs retained.',
        fixtures=FIXTURES,excludedAssertions=EXCLUDED))
    summaries=[]; rows=[]; failures=[]; total=Counter(); measurements={}; measurement_keys={}
    def intern(r):
        key=json.dumps(rounded(r),sort_keys=True)
        if key not in measurement_keys:
            identifier=f'm{len(measurements):04d}'
            measurement_keys[key]=identifier; measurements[identifier]=r
        return measurement_keys[key]
    for p in PRESETS['presets']:
        for mode in MODES:
            scenarios={}
            for scenario in SCENARIOS:
                records={}
                for f in FIXTURES:
                    try: r=probe(p,mode,f,scenario)
                    except Unresolved as error: r=dict(status='UNRESOLVED',reason=str(error))
                    records[f['id']]=r; total[scenario+'-'+r['status']]+=1
                    if r['status']!='PASS': failures.append(dict(preset=p['id'],mode=mode,scenario=scenario,fixture=f['id'],**r))
                scenarios[scenario]=records
            # Required exterior edge with no page/collar backing. A bounded
            # inside fill cannot protect an outline that faces an arbitrary scene.
            outside={}
            for f in FIXTURES:
                if f['kind']!='edge': continue
                r=dict(measure(INPUT['themes'][mode][f['fg']],Paint((0,0,0),0),f['threshold']),
                       adjacency='outside-unbacked-scene',backdropDependent=True)
                outside[f['id']]=r
            write(f'results-{p["id"]}-{mode}.json',dict(preset=p['id'],mode=mode,measurementIndex='measurements.json',
                scenarios={s:{k:intern(r) for k,r in rec.items()} for s,rec in scenarios.items()},
                outsideScene={k:intern(r) for k,r in outside.items()}))
            item=dict(preset=p['id'],mode=mode,roles={})
            for role in ROLES:
                data={scenario:{target:aggregate(scenarios[scenario],ids_for(role,target)) for target in ['text','edge']}
                      for scenario in SCENARIOS}
                data['outsideScene']=aggregate(outside,[k for k in ids_for(role,'edge') if k in outside])
                item['roles'][role]=data
                for target in ['text','edge']:
                    rows.append(dict(preset=p['name'],mode=mode,role=role,target=target,**data))
            summaries.append(item)
    write('summary.json',dict(areaCommit=AREA,researchCommit=RESEARCH,selection=INPUT['selection'],
        counts=dict(total),fixtureCount=len(FIXTURES),coveredAssertions=len({f['assertion'] for f in FIXTURES}),
        excludedAssertions=len(EXCLUDED),results=summaries))
    write('measurements.json',measurements)
    sections=['# Preset × role results\n',
      'Generated by `build.py`. **WCAG numerical model only**, not browser or APCA certification. ',
      'All 12 role names and both modes appear. Every cell is the least threshold-normalized margin ',
      'among its exact bound pairings; the JSON retains every pairing and its witness. ',
      '“Any backdrop” means the tested footprint is opaque. Fractional RGB values are encoded sRGB ',
      '(0–255), not rounded hex; `t` is the full gradient coordinate. Thresholds are 4.5 for text, ',
      '3 for required edges/marks. FAIL counts are never waived. See [coverage](coverage.md) and [method](method.md).\n',
      f'Inputs: **{len(FIXTURES)} host-pair probes / {len({f["assertion"] for f in FIXTURES})} source assertions**, ',
      f'**{len(EXCLUDED)} excluded aesthetic/disabled assertions**. Counts: `{dict(total)}`.\n']
    for p in PRESETS['presets']:
        for mode in MODES:
            sections+= [f'\n## {p["name"]} · {mode}\n',
              f'[All pairings and witnesses](results-{p["id"]}-{mode}.json). ',
              'Requested = raw fill/gradient probe; guarded = opaque reading island, transmitting required-edge strip; ',
              'F0 = opaque baseline. These are explicit fixture variants, not three certification levels.\n',
              '| Role / target | Requested shell | Guarded contract footprint | F0 opaque fallback |\n',
              '| --- | --- | --- | --- |\n']
            for row in rows:
                if row['preset']!=p['name'] or row['mode']!=mode: continue
                target=row['target']
                sections.append('| '+row['role']+' / '+target+' | '+' | '.join(compact_cell(row[s][target]) for s in SCENARIOS)+' |\n')
            external=next(s for s in summaries if s['preset']==p['id'] and s['mode']==mode)['roles']['edge']['outsideScene']
            sections.append('\n**Exterior required edges directly against the scene:** '+compact_cell(external)+
                            '. This applies to every bound required-edge host; backing is necessary.\n')
    write('results.md',''.join(sections))
    buffer=io.StringIO(); writer=csv.writer(buffer,lineterminator='\n')
    writer.writerow(['preset','mode','role','target','scenario','status','count','worst_fixture','ratio','threshold','backdrop_rgb_0_1','gradient_position','ground_rgb_0_1','adjacency'])
    for item in summaries:
        for role,d in item['roles'].items():
            for scenario in SCENARIOS:
                for target,a in d[scenario].items():
                    r=a.get('worst') or {}; f=BY_ID.get(r.get('fixture'),{})
                    writer.writerow([item['preset'],item['mode'],role,target,scenario,a['status'],a['count'],r.get('fixture',''),r.get('ratio',''),f.get('threshold',''),r.get('backdrop',''),r.get('position',''),r.get('ground',''),r.get('adjacency','')])
    write('results.csv',buffer.getvalue())
    write('failures.json',failures)
    print(json.dumps(dict(fixtures=len(FIXTURES),assertions=len({f['assertion'] for f in FIXTURES}),counts=dict(total),cache=measure.cache_info()._asdict())))
    if '--gate' in sys.argv and any(f['scenario']=='requested' for f in failures): sys.exit(1)

if __name__=='__main__': main()
