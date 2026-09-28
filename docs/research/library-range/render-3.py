#!/usr/bin/env python3
"""Render run-3 research. Uses reviewed notes, proposals and pinned source ledger."""
import json,re,hashlib,importlib.util
from pathlib import Path
from collections import defaultdict
P=Path(__file__).resolve().parent
ROOT=P.parents[2]
load=lambda name:json.loads((P/name).read_text())
SCOPE=load('scope-3.json');MAP=load('mapping-3.json');LEDGER=load('source-ledger-3.json');PINS=load('source-pins-3.json');NOTES=load('family-notes-3.json');PROPOSALS=load('range-proposals-3.json')
SYSTEMS={'u':'Untitled UI','s':'shadcn/ui','r':'Radix Themes','b':'Base UI','a':'React Aria / Spectrum 2','f':'Fluent 2','p':'Primer','c':'Carbon','m':'Material 3','t':'Mantine','n':'Ant Design','k':'Chakra/Ark','l':'Atlassian','o':'Polaris','g':'GOV.UK','h':'Apple HIG'}
CATALOGS={
'u':'https://www.untitledui.com/react/components','s':'https://ui.shadcn.com/docs/components','r':'https://www.radix-ui.com/themes/docs/overview/getting-started','b':'https://base-ui.com/react/overview/quick-start','a':'https://react-aria.adobe.com/','f':'https://fluent2.microsoft.design/components/web/react','p':'https://primer.style/product/components/','c':'https://carbondesignsystem.com/components/overview/components/','m':'https://m3.material.io/components','t':'https://mantine.dev/core/package/','n':'https://ant.design/components/overview/','k':'https://www.chakra-ui.com/docs/components/concepts/overview','l':'https://atlassian.design/components','o':'https://shopify.dev/docs/api/app-home/polaris-web-components','g':'https://design-system.service.gov.uk/components/','h':'https://developer.apple.com/design/human-interface-guidelines/components'}
PINKEY={'s':'shadcn','r':'radix-themes','b':'base-ui','a':'react-spectrum','f':'fluent','p':'primer','c':'carbon','m':'material3','t':'mantine','n':'ant-design','k':'ark','l':'atlassian','u':'untitled'}
BASE='c585f8c5f38705a7efa79bf05148a8c6989b142a'
AREA='https://github.com/ethanwongwork/area/blob/'+BASE+'/'
MANIFEST=(ROOT/'packages/styles/src/manifest.ts').read_text()
AREA_REFS={}
for m in re.finditer(r'export const (\w+) = \{',MANIFEST):AREA_REFS[m[1].lower()]=AREA+'packages/styles/src/manifest.ts#L'+str(MANIFEST[:m.start()].count('\n')+1)
CACHE=load('.units-cache-3.json');PAGES=load('.pages-cache-3.json')

def status(raw,sys):
    if sys=='h':return 'platform-guidance'
    if raw.startswith('~'):return 'analogue'
    if raw.startswith('!'):return 'internal'
    if raw.startswith('+'):return 'recipe'
    return 'component'

def url_line(source,idx,end=None):
    base=source['url'].split('#')[0]
    if 'bitbucket.org' in base:return base+'#lines-'+str(idx)+((':'+str(end)) if end and idx!=end else '')
    return base+'#L'+str(idx)+(('-L'+str(end)) if end and idx!=end else '')

def evidence(key,needle):
    r=LEDGER[key];n=needle.casefold()
    for ax in r['axes']:
        if n in (ax['name']+' '+ax['values']).casefold():return dict(unit=key,system=r['system'],url=ax['source'],checked='2026-09-28',locator=needle)
    for h in r['headings']:
        if n in h['name'].casefold():return dict(unit=key,system=r['system'],url=h['source'],checked='2026-09-28',locator=needle)
    for source in r['sources']:
        if 'file' in source:
            pin=next((v for v in PINS.values() if v['sha']==source['sha']),None)
            if not pin:continue
            path=ROOT/pin['path']/source['file']
            lines=path.read_text(errors='replace').splitlines()
            for i,line in enumerate(lines):
                if n in line.casefold():return dict(unit=key,system=r['system'],url=url_line(source,i+1),checked='2026-09-28',locator=needle)
        else:
            for page in PAGES.values():
                if page.get('final_url')==source['url'] and n in page['text'].casefold():return dict(unit=key,system=r['system'],url=source['url'],checked='2026-09-28',locator=needle)
            if key.startswith('h:') and n in CACHE[key].casefold():return dict(unit=key,system=r['system'],url=source['url'],checked='2026-09-28',locator=needle)
    return None

def md(s):return str(s).replace('`','').replace('\n',' ').replace('<','&lt;').replace('>','&gt;')
def cite(ev):return '['+ev['system']+']('+ev['url']+')'
def id_for(s):return re.sub('[^a-z0-9]+','-',s.lower()).strip('-')[:100]

# Concrete native options are grouped only on an identical axis + literal value.
# No conversion from "sm" to "small", and no invented values for imported types.
def native_options(family):
    options={}
    for sys,units in MAP[family].items():
        for raw in units:
            kind=status(raw,sys);unit=raw.lstrip('~+!');key=sys+':'+unit;r=LEDGER[key]
            if kind not in ('component','recipe') or not r['verified']:continue
            for a in r['axes']:
                name=a['name'];value=a['values'];owner=a.get('owner','published API')
                if a['kind']=='constant':continue
                if a['kind'] not in ['published-prop','enum'] and not re.search('Props|Slots|RenderProps|State',owner):continue
                if a['kind']=='runtime-state' and not re.fullmatch(r'(?:is)?(?:Disabled|ReadOnly|Invalid|Selected|Expanded|Open|Checked|Indeterminate|Hovered|Pressed|Focused|FocusVisible|Loading|Pending)|disabled|readOnly|invalid|selected|expanded|open|checked|indeterminate|hovered|pressed|focused|loading',name):continue
                if name.startswith(('_','UNSAFE','data-')) or re.search('^[a-z]$',name):continue
                if a['kind']=='enum' and not re.search('Variant|Appearance|Size|Mode|Orientation|Shape|Status|Align|Position|Placement|Type|Granularity|HourCycle|^(sizes|variants|underline|orientationValues|colors|radius)$',name):continue
                if sys=='a' and unit in ['DateField','TimeField'] and a.get('owner') and re.search('DateRange|DatePicker',owner):continue
                if name.startswith(('default','aria','analytics','test','__')) or name in ['root','ref','props','items','options','value','values','data','ids','translations','positioning','locale','classNames','asChild','alignItems','justifyContent'] or any(x in name for x in ['Label','label','Description','description','Text','text']) and a['kind']!='slot':continue
                if owner in ['anonymous type'] or re.search('Context|Internal|Config|Factory|CSS|Hook|Info|Event',owner):continue
                if name in ['type','required'] and sys=='r':continue
                if 'SECRET' in value or len(value)>200 or re.search('Record<|Map<|HTMLElement|HTMLInputElement|RefObject|ComponentProps|Dispatch|Event|HTMLAttributes',value):continue
                if a['kind']=='slot':category='structure';layer=3
                elif a['kind']=='runtime-state' or re.search(r'^(is|has)[A-Z]|disabled|invalid|readOnly|checked|loading|expanded|selected|open$',name):category='state';layer=2
                elif re.search('size|Size|variant|Variant|appearance|Appearance|tone|intent|radius|shape|color|underline',name):category='appearance';layer=2
                elif re.search('orientation|position|placement|align|wrap|columns|rows|display|fullWidth',name,re.I):category='structure';layer=3
                else:category='interaction';layer=2
                # Extract facts only: identifiers for named types remain explicitly unresolved.
                literals=re.findall(r"['\"]([^'\"]+)['\"]",value)
                if re.search(r'\[\s*[\'\"]',value) and a['kind']!='enum':literals=[]
                if 'Slot<' in value or 'ReactNode' in value:literals=[]
                if not literals and re.fullmatch(r'[a-z0-9-]+(?:\s*\|\s*[a-z0-9-]+)+',value) and not any(x in value for x in ['string','number','undefined','null','boolean']):literals=re.split(r'\s*\|\s*',value)
                if literals and len(literals)<=40 and not any(' ' in x or '--' in x for x in literals):vals=list(dict.fromkeys(literals));domain='enumerated'
                elif re.fullmatch(r'boolean(?: \| undefined)?',value):vals=['false','true'];domain='boolean'
                else:
                    if category!='structure' and not re.search('variant|appearance|size|radius|shape|orientation|mode|selection|granularity|hourCycle|type|status',name,re.I):continue
                    vals=[value];domain='open-or-named-type'
                axis={'sizes':'size','variants':'variant','orientationValues':'orientation'}.get(name,name)
                for val in vals:
                    oid='native-'+id_for(axis)+'-'+hashlib.sha256(val.encode()).hexdigest()[:8]
                    opt=options.setdefault(oid,dict(label=axis+': '+val,axis=axis,value=val,value_domain=domain,layer=layer,category=category,proposed=False,systems=[],system_count=0,reuses=[],evidence=[]))
                    if r['system'] not in opt['systems']:opt['systems'].append(r['system'])
                    ev=dict(system=r['system'],unit=key,url=a['source'],checked='2026-09-28',owner=owner,source_kind=kind)
                    if ev not in opt['evidence']:opt['evidence'].append(ev)
    for opt in options.values():opt['systems'].sort();opt['system_count']=len(opt['systems'])
    return options

index={};failures=[]
for family in SCOPE:
    slug=family['slug'];note=NOTES[slug];coverage={};direct=[];recipes=[]
    for sys,name in SYSTEMS.items():
        entries=[]
        for raw in MAP[slug].get(sys,[]):
            key=sys+':'+raw.lstrip('~+!');r=LEDGER[key];kind=status(raw,sys)
            entries.append(dict(unit=key,status=kind if r['verified'] else 'not-found',sources=r['sources'],looked_for=raw.lstrip('~+!')))
            if r['verified'] and kind=='component':direct.append(name)
            if r['verified'] and kind=='recipe':recipes.append(name)
        coverage[name]=dict(catalog=CATALOGS[sys],checked='2026-09-28',queries=[family['name'],slug]+[x.lstrip('~+!@') for x in MAP[slug].get(sys,[])],findings=entries or [dict(status='not-found',note='Not found in the reviewed catalogues and pinned source inventory; not a claim of ecosystem-wide absence.')])
    native=native_options(slug);options=dict(native);proposed=[]
    for i,item in enumerate(x for x in PROPOSALS if x['family']==slug):
        evs=[];counted=[];analogues=[]
        for ref in item['evidence']:
            ev=evidence(ref['unit'],ref['needle'])
            if not ev:failures.append(slug+': '+ref['unit']+' :: '+ref['needle']);continue
            ev['analogue']=ref['analogue'];evs.append(ev)
            if ref['analogue'] or ref['unit'].startswith('h:'):analogues.append(ev['system'])
            else:counted.append(ev['system'])
        oid='range-'+id_for(item['label']);opt=dict(label=item['label'],layer=item['layer'],category='range-category',proposed=True,systems=sorted(set(counted)),system_count=len(set(counted)),analogue_systems=sorted(set(analogues)),support_scope='At least one documented alternative in this category; exact native axis/value support is indexed separately.',reuses=family['reuses'],evidence=evs)
        options[oid]=opt;proposed.append(opt)
    for opt in options.values():opt['reuses']=family['reuses']
    family_systems=sorted(set(direct+recipes));rec_only=sorted(set(recipes)-set(direct))
    index[slug]=dict(name=family['name'],kind=note['kind'],base_commit=BASE,checked='2026-09-28',family_systems=family_systems,family_system_count=len(family_systems),component_system_count=len(set(direct)),recipe_only_systems=rec_only,reuses=family['reuses'],coverage=coverage,options=options)
    lines=['# '+family['name'],'','## Job','',note['job'],'',f'Observed family coverage: **{len(family_systems)} / 15 implementation systems** ({len(set(direct))} with a component source; {len(rec_only)} recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.','',note['decision'],'','## Variant axes','',
    'The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.','']
    # Collapse exact native values back into per-axis summaries for readable Markdown.
    groups=defaultdict(list)
    for opt in native.values():
        if opt['category'] in ('appearance','state'):groups[opt['axis']].append(opt)
    def render_group(axis,opts):
        rendered=[]
        for opt in opts:
            refs=list({e['system']:e for e in opt['evidence']}.values())
            rendered.append('`'+md(opt['value'])+'` — '+str(opt['system_count'])+' system'+('s' if opt['system_count']!=1 else '')+' ('+', '.join(cite(e) for e in refs)+')')
        return '- **'+md(axis)+'**: '+'; '.join(rendered)+'.'
    if groups:
        lines+=['<details>','<summary>Verified native appearance and state options</summary>','']
        lines += [render_group(axis,opts) for axis,opts in sorted(groups.items())]
        lines+=['','</details>','']
    else:lines+=['Dedicated variant enums: **not found** in the reviewed family sources. Reuse the composing Area families; do not invent a size/tone matrix from analogues.','']
    lines+=['## Structural alternatives','']
    for opt in proposed:
        if opt['layer']==3:
            lines.append('- **'+opt['label']+'** — '+str(opt['system_count'])+' observed implementation systems'+(' (proposal based on analogues; no dedicated implementation counted)' if not opt['system_count'] else '')+'. '+', '.join(cite(e) for e in opt['evidence'])+'.')
    examples=[]
    for sys,units in MAP[slug].items():
        for raw in units:
            if status(raw,sys) not in ('component','recipe'):continue
            key=sys+':'+raw.lstrip('~+!');r=LEDGER[key]
            for h in r['headings']:
                label=h['name'].strip()
                if len(label)>85 or '?' in label or re.search(r'^(API|Props|Properties|Anchor to|How|Why|When|Overview|Components|Internal|UI |Product |Page navigation|Typography|Design Token|Customize|Customizing|Making|Adding|Related|Reference|Feedback|Using|Installation|Getting|Theming|Code implementation|Styles|Rendering|Component Anatomy|Configure|Table of Contents|Import|Updating|Native|Examples)$',label,re.I):continue
                if not re.search(r'with|without|vertical|horizontal|inline|compact|rounded|icon|avatar|image|illustration|card|group|grid|table|position|placement|presets|range|single|multi|legend|header|footer|action|orientation|outline|filled|transparent|timeline|empty|panel|modal|docked|gallery|truncat|wrap|carousel|contained|separated|nested|pagination|subtle|disabled|invalid|loading|readonly|read.only',label,re.I):continue
                oid='example-'+id_for(label)
                opt=options.setdefault(oid,dict(label=label,layer=3,category='documented-example',proposed=False,systems=[],system_count=0,reuses=family['reuses'],evidence=[]))
                if r['system'] not in opt['systems']:opt['systems'].append(r['system'])
                ev=dict(system=r['system'],unit=key,url=h['source'],checked='2026-09-28')
                if ev not in opt['evidence']:opt['evidence'].append(ev)
                opt['system_count']=len(opt['systems'])
                examples.append(opt)
    examples=list({id_for(e['label']):e for e in examples}.values())
    if examples:
        lines+=['','<details>','<summary>Additional named examples in the reviewed documentation</summary>','','These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.','']
        for opt in examples:
            refs=list({e['system']:e for e in opt['evidence']}.values())
            lines.append('- **'+md(opt['label'])+'** — '+str(opt['system_count'])+' system(s): '+', '.join(cite(e) for e in refs)+'.')
        lines+=['','</details>']
    structures=defaultdict(list)
    for opt in native.values():
        if opt['category']=='structure':structures[opt['axis']].append(opt)
    if structures:
        lines+=['','<details>','<summary>Native layout and anatomy declarations</summary>','']+[render_group(a,o) for a,o in sorted(structures.items())]+['','</details>']
    lines+=['','## Interaction patterns','',note['interaction'],'']
    refs=[]
    for key in note['interaction_sources']:
        if key in LEDGER and LEDGER[key]['sources']:refs.append(dict(system=LEDGER[key]['system'],url=LEDGER[key]['sources'][0]['url']))
    lines+=['Evidence: '+', '.join(cite(e) for e in refs)+'.','',
    'Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.']
    behaviors=defaultdict(list)
    for opt in native.values():
        if opt['category']=='interaction':behaviors[opt['axis']].append(opt)
    if behaviors:
        lines+=['','<details>','<summary>Native behavioral options and open parameters</summary>','']+[render_group(a,o) for a,o in sorted(behaviors.items())]+['','</details>']
    lines+=['','## Reuses in Area','',
    ', '.join('['+r+']('+AREA_REFS.get(r.lower(),AREA+'packages/styles/src/manifest.ts')+')' for r in family['reuses'])+'. These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.','',
    'New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.','',
    '## Proposed range','',note['decision'],'',
    'Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.','']
    for opt in proposed:
        lines+=['- **Layer '+str(opt['layer'])+' — '+opt['label']+'**: '+str(opt['system_count'])+' observed systems. '+', '.join(cite(e) for e in opt['evidence'])+'.'+(' **Area proposal from analogues; dedicated support not found.**' if opt['system_count']==0 else '')]
    lines+=['','Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.','',
    '## Sources','',
    'Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `'+family['name']+'`; aliases appear in the JSON coverage record.','']
    for sys,name in SYSTEMS.items():
        c=coverage[name];findings=c['findings'];found=[f for f in findings if f['status']!='not-found']
        if found:
            parts=[]
            for entry in found:
                r=LEDGER[entry['unit']];source=r['sources'][0]['url'];parts.append('['+entry['unit'].split(':',1)[1]+' — '+entry['status']+']('+source+')')
            lines.append('- **'+name+'**: '+'; '.join(parts)+'.')
        else:
            extra=''
            if sys in PINKEY:extra=' and [pinned source inventory]('+PINS[PINKEY[sys]]['url']+')'
            lines.append('- **'+name+'**: **not found** for this job in the reviewed [catalogue]('+c['catalog']+')'+extra+'.'+(' Related lookup(s) also unresolved: '+', '.join(f.get('looked_for','') for f in findings if f.get('looked_for'))+'.' if any(f.get('looked_for') for f in findings) else ''))
    lines+=['','Area scope and reuse baseline: [COMPONENTS.md]('+AREA+'docs/COMPONENTS.md#L112-L215), [manifest.ts]('+AREA+'packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.','']
    (P/(slug+'.md')).write_text('\n'.join(lines))
(P/'index-3.json').write_text(json.dumps(index,indent=2)+'\n')
(P/'.evidence-failures-3.json').write_text(json.dumps(failures,indent=2)+'\n')
print('Rendered',len(index),'families;',sum(len(v['options']) for v in index.values()),'indexed native options/range categories')
print('Unresolved proposed evidence:',len(failures));print('\n'.join(failures))
