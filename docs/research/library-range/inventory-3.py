#!/usr/bin/env python3
"""Build a line-linked public evidence inventory. Does not infer product support."""
import json,re,subprocess
from pathlib import Path
from urllib.parse import quote
P=Path(__file__).resolve().parent
ROOT=P.parents[2]
PINS=json.loads((P/'source-pins-3.json').read_text())
PAGES=json.loads((P/'.pages-cache-3.json').read_text())
MAP=json.loads((P/'mapping-3.json').read_text())
SYSTEMS={'u':'Untitled UI','s':'shadcn/ui','r':'Radix Themes','b':'Base UI','a':'React Aria / Spectrum 2','f':'Fluent 2','p':'Primer','c':'Carbon','m':'Material 3','t':'Mantine','n':'Ant Design','k':'Chakra/Ark','l':'Atlassian','o':'Polaris','g':'GOV.UK','h':'Apple HIG'}
PINKEY={'s':'shadcn','r':'radix-themes','b':'base-ui','a':'react-spectrum','f':'fluent','p':'primer','c':'carbon','m':'material3','t':'mantine','n':'ant-design','k':'ark','l':'atlassian','u':'untitled'}
def cleanunit(s):return s.lstrip('~+!')
def kebab(s):return re.sub(r'(?<!^)(?=[A-Z])','-',s).lower()
def link(n,path,line=1,end=None):
    pin=PINS[n];suffix=f'#L{line}'+(f'-L{end}' if end and end!=line else '')
    if pin.get('host')=='bitbucket.org':return pin['url']+'/'+quote(str(path),safe='/@')+f'#lines-{line}'+(f':{end}' if end and end!=line else '')
    return 'https://github.com/'+pin['repo']+'/blob/'+pin['sha']+'/'+quote(str(path),safe='/@')+suffix

def files_for(sys,unit):
    n='carbon-charts' if sys=='c' and unit=='@Charts' else PINKEY.get(sys);out=[]
    if not n:return []
    r=ROOT/PINS[n]['path'];u=unit.lstrip('@')
    def add(path):
        q=r/path
        if q.is_file():out.append(q)
    def glob(path,pattern,limit=None):
        found=sorted((r/path).glob(pattern));out.extend(found[:limit] if limit else found)
    if sys=='s' and unit=='@FileUploadCard':
        add('apps/v4/registry/bases/base/blocks/preview/cards/file-upload.tsx')
    elif sys=='a' and unit in ['@SheetExample','@EmojiPickerExample','@SidebarExample']:
        target={'@SheetExample':'sheet.mdx','@EmojiPickerExample':'emoji-picker.mdx','@SidebarExample':'photos/Sidebar.tsx'}[unit]
        add('packages/dev/s2-docs/pages/react-aria/examples/'+target)
    elif sys=='t' and unit=='@TransferList':
        add('apps/mantine.dev/src/combobox-examples/examples/TransferList/TransferList.tsx')
    elif sys=='f' and unit=='@Charts':
        add('packages/charts/react-charts/library/README.md')
        glob('packages/charts/react-charts/library/src/components','**/*.types.ts')
    elif sys=='l' and unit=='@ForgeCharts':
        glob('forge/forge-react-types/src/components/charts','*.tsx')
    elif sys=='l' and unit=='@MediaPicker':
        for q in ['src/index.ts','src/types.ts','src/components/types.ts','docs/content/dropzone/dropzone-minimal-example.tsx']:
            add('media/media-picker/'+q)
    elif sys=='c' and unit=='@Callout':
        add('packages/react/src/components/Notification/Notification.tsx')
    elif sys=='u':
        paths={'inputs':['base/input'],'multi-select':['base/select'],'verification-code-inputs':['base/input'],'date-pickers':['application/date-picker'],'drawers':['application/slideout-menus'],'file-uploaders':['application/file-upload','base/file-upload-trigger'],'empty-states':['application/empty-state'],'pagination':['application/pagination'],'progress-indicators':['base/progress-indicators'],'activity-gauges':['application/charts'],'sidebar-navigations':['application/app-navigation'],'header-navigations':['application/app-navigation'],'tables':['application/table'],'carousels':['application/carousel'],'line-bar-charts':['application/charts'],'pie-charts':['application/charts'],'radar-charts':['application/charts']}
        for folder in paths.get(u,[]):glob('components/'+folder,'*.tsx')
        out=[q for q in out if '.demo.' not in q.name]
        exact={'inputs':{'input.tsx','input-group.tsx','label.tsx','hint-text.tsx'},'verification-code-inputs':{'pin-input.tsx'},'multi-select':{'multi-select.tsx','select-shared.tsx','select-item.tsx','popover.tsx'},'activity-gauges':set(),'line-bar-charts':{'charts-base.tsx'},'pie-charts':{'charts-base.tsx'},'radar-charts':{'charts-base.tsx'}}
        if u in exact:out=[q for q in out if q.name in exact[u]]
    elif sys=='s':
        add(f'apps/v4/content/docs/components/base/{u}.mdx')
        glob('apps/v4/registry/base-nova/ui',u+'.tsx')
        if not any(x.suffix=='.tsx' for x in out):glob('apps/v4/registry','**/ui/'+u+'.tsx',1)
    elif sys=='a':
        if unit.startswith('@'):
            add(f'packages/dev/s2-docs/pages/s2/{u}.mdx');add(f'packages/@react-spectrum/s2/src/{u}.tsx')
        else:
            add(f'packages/dev/s2-docs/pages/s2/{u}.mdx');add(f'packages/@react-spectrum/s2/src/{u}.tsx')
            add(f'packages/dev/s2-docs/pages/react-aria/{u}.mdx');glob(f'packages/dev/s2-docs/pages/react-aria/{u}','use*.mdx');add(f'packages/react-aria-components/src/{u}.tsx')
            types={'DateField':'datepicker','DatePicker':'datepicker','DateRangePicker':'datepicker','TimeField':'datepicker','SearchField':'searchfield','Meter':'progress','ListBox':'listbox','GridList':'grid','Table':'table','TokenField':'combobox','Select':'select','Link':'link','ToggleButtonGroup':'button','Disclosure':'disclosure','DisclosureGroup':'disclosure'}
            if u in types:glob('packages/@react-types/'+types[u],'**/*.d.ts')
            if u in types:
                for group in ['react-aria','react-stately']:
                    glob('packages/'+group+'/src/'+types[u],'*types*.ts');glob('packages/'+group+'/src/'+types[u],'use'+u+'*.ts')
    elif sys=='b':
        add(f'docs/src/app/(docs)/react/components/{u}/page.mdx')
        glob('packages/react/src/'+u,'**/*.tsx')
        glob('packages/react/src/'+u,'**/*DataAttributes.ts')
    elif sys=='r':
        add(f'packages/radix-ui-themes/src/components/{u}.props.tsx');add(f'packages/radix-ui-themes/src/components/{u}.tsx')
        for q in list(out):
            for ref in re.findall(r"from ['\"](../props/[^'\"]+)\.js['\"]",q.read_text()):
                target=q.parent/(ref+'.ts')
                if target.exists() and target.name!='prop-def.ts':out.append(target)
    elif sys=='t':
        if unit.startswith('@'):
            group={'Dropzone':'dropzone','RichTextEditor':'tiptap','Charts':'charts','Form':'form','Carousel':'carousel'}.get(u,'dates')
            path='packages/@mantine/'+group+'/src'
            glob(path,'**/'+u+'.tsx')
            if u=='Charts':glob(path,'**/*Chart.tsx')
            if u=='Form':glob(path,'types.ts');add('apps/mantine.dev/src/pages/form/validation.mdx')
            if group=='carousel':add('apps/mantine.dev/src/pages/x/carousel.mdx')
            if group=='dates':add(f'apps/mantine.dev/src/pages/dates/{kebab(u)}.mdx')
            else:add(f'apps/mantine.dev/src/pages/{group}.mdx')
        else:
            path='packages/@mantine/core/src/components/'+u
            add(path+'/'+u+'.tsx');glob(path,'**/*.types.ts');glob(path,'**/*Props.ts')
            add(f'apps/mantine.dev/src/pages/core/{kebab(u)}.mdx')
    elif sys=='n':
        part=u.split('/')[0];add(f'components/{part}/index.en-US.md')
        if '/' in u:add('components/'+u+'.tsx');add('components/'+u+'/index.tsx')
        else:
            add(f'components/{part}/index.tsx');add(f'components/{part}/interface.ts');add(f'components/{part}/interface.tsx')
    elif sys=='f':
        names={'searchbox':'SearchBox','tagpicker':'TagPicker','dropdown':'Dropdown','accordion':'Accordion','drawer':'OverlayDrawer','dialog':'Dialog','list':'List','rating':'Rating','toolbar':'Toolbar','nav':'Nav','messagebar':'MessageBar','toast':'Toast','carousel':'Carousel','infolabel':'InfoLabel','tree':'Tree','link':'Link'}
        name=names.get(u,u)
        glob('packages/react-components','*/library/src/components/'+name+'/'+name+'.types.ts')
        out=[q for q in out if '/react-headless-components-preview/' not in str(q)]
        if name in ['OverlayDrawer','Rating','TagPicker','DataGrid']:
            for q in list(out):out.extend(q.parent.parent.glob('*/*.types.ts'))
        for q in list(out):
            pkg=q.parents[3]
            if (pkg/'src/utils').is_dir():out.extend((pkg/'src/utils').glob('*.types.ts'))
        if name=='TagPicker':add('packages/react-components/react-combobox/library/src/utils/ComboboxBase.types.ts')
        if name=='OverlayDrawer':glob('packages/react-components','react-drawer/library/src/components/DrawerBase/DrawerBase.types.ts')
    elif sys=='p':
        name={'action-list':'ActionList','text-input-with-tokens':'TextInputWithTokens','select-panel':'SelectPanel','confirmation-dialog':'ConfirmationDialog','split-page-layout':'SplitPageLayout','form-control':'FormControl','page-header':'PageHeader','nav-list':'NavList','page-layout':'PageLayout','data-table':'DataTable','keybinding-hint':'KeybindingHint','tree-view':'TreeView'}.get(u,''.join(x.title() for x in u.split('-')))
        if unit.startswith('@'):name=u
        glob('packages/react/src/'+name,'*.tsx')
        glob('packages/react/src/'+name,'*.types.ts')
    elif sys=='c' and unit=='@Charts':
        add('README.md');glob('packages/core/src/interfaces','**/*.ts');glob('packages/core/src/charts','*.ts')
    elif sys=='c':
        add('packages/react/src/components/'+u+'/'+u+'.tsx');add('packages/react/src/components/'+u+'/'+u+'.ts')
        if not out:glob('packages/react/src/components/'+u,'*.tsx')
        if u=='PasswordInput':add('packages/react/src/components/TextInput/PasswordInput.tsx')
        if u=='FlexGrid':glob('packages/react/src/components/FlexGrid','*.ts')
    elif sys=='k':
        add('website/src/content/pages/components/'+u+'.mdx')
    elif sys=='l':
        groups={'pragmatic-drag-and-drop':'pragmatic-drag-and-drop/documentation','emoji':'elements/emoji','reactions':'elements/reactions','user-picker':'elements/user-picker','editor-core':'editor/editor-core','media-viewer':'media/media-viewer'}
        group=groups.get(u,'design-system/'+u)
        if u.startswith('primitives/'):
            group='design-system/primitives'
            glob(group+'/src','**/'+u.split('/')[-1]+'.tsx')
        add(group+'/README.md');glob(group+'/docs','*.mdx');glob(group+'/docs','*.tsx')
        for q in ['src/types.ts','src/types.tsx','src/types/index.ts','src/types/index.tsx']:add(group+'/'+q)
        if not any(x.name.startswith('types.') for x in out):
            glob(group+'/src','**/types.ts*',8)
            glob(group+'/src','**/*.tsx',8)
        if not out:glob(group+'/src','*.tsx',3)
    elif sys=='m':
        glob('lib/java/com/google/android/material/'+u,'*.java')
        names={'datepicker':'DatePicker','timepicker':'TimePicker','bottomsheet':'BottomSheet','sidesheet':'SideSheet','navigation':'NavigationView','navigationrail':'NavigationRail','carousel':'Carousel','progressindicator':'ProgressIndicator','dialog':'Dialog','search':'Search','button':'Button','listitem':'ListItem'}
        if u in names:glob('docs/components',names[u]+'*.md')
    if sys=='t':
        contents='\n'.join(q.read_text(errors='replace') for q in out)
        if '__BaseInputProps' in contents or 'InputVariant' in contents:
            add('packages/@mantine/core/src/components/Input/Input.tsx')
            add('packages/@mantine/core/src/components/Input/InputWrapper/InputWrapper.tsx')
        if 'MantineSize' in contents or 'MantineRadius' in contents:
            glob('packages/@mantine/core/src/core/MantineProvider','**/*theme*types*.ts')
    # Test/story files are not public API. Docs/example headings supply alternative evidence separately.
    return list(dict.fromkeys(q for q in out if not re.search(r'\.(test|spec|stories|story|figma)\.',q.name)))

def web_for(sys,unit):
    u=unit.lstrip('@');name=SYSTEMS[sys];result=[]
    suffix={'u':'/react/components/'+u,'f':'/components/web/react/core/'+u+'/usage','p':'/product/components/'+u+'/','c':'/components/'+kebab(u)+'/usage/','k':'/docs/components/'+u,'l':'/components/'+u,'g':'/components/'+u+'/'}.get(sys)
    if sys=='p' and 'Primer|/product/internal-components/'+u+'/' in PAGES and 'Primer|'+str(suffix) not in PAGES:suffix='/product/internal-components/'+u+'/'
    keys=[name+'|'+suffix] if suffix else []
    if sys in ['r','o','h']:keys.append(name+'|'+u)
    if sys=='t':keys.append(name+'|'+kebab(u))
    if u=='faq-sections':keys.append('Untitled UI|faq-sections')
    if u=='Charts':keys.append(SYSTEMS[sys]+'|charts')
    if u=='pragmatic-drag-and-drop':keys += ['Atlassian|drag-accessibility','Atlassian|drag-design']
    for k in keys:
        if k in PAGES and PAGES[k]['status']==200 and len(PAGES[k]['text'])>300:result.append(PAGES[k])
    return result

SKIP={'children','className','classNames','style','styles','ref','id','name','key','slot','slots','as','asChild','render','component','testId','data-testid','__staticSelector','unstyled','vars','attributes','locale','dir'}
def axes_source(text,url_fn):
    results=[];lines=text.splitlines()
    for i,line in enumerate(lines):
        m=re.match(r'const (\w+) = (\[[^\n]+\]) as const;',line)
        if m:results.append(dict(name=m[1],values=m[2],source=url_fn(i+1,i+1),kind='enum'))
        m=re.search(r'public static final (?:int|float|String) ([A-Z_]+) = ([^;]+);',line)
        if m:results.append(dict(name=m[1],values=m[2],source=url_fn(i+1,i+1),kind='constant'))
    for i,line in enumerate(lines):
        # Enum aliases (visual or behavioral, not CSS selector or utility types).
        match=re.match(r'(?:export )?type (\w+)\s*=\s*(.+)',line)
        if match and not re.search('StylesNames|CssVariables|Element|Ref|Events|Context|Factory|Props|State|Slots',match[1]):
            val=match[2];j=i
            while ';' not in val and j<i+8 and j+1<len(lines):j+=1;val+=' '+lines[j].strip()
            if re.fullmatch(r"[\s|'\"a-zA-Z0-9_-]+;",val) and re.search(r"['\"]",val):
                results.append(dict(name=match[1],values=val.rstrip(';').strip(),source=url_fn(i+1,j+1),kind='enum'))
        # Declared props, not JS assignments. Preserve open-ended types as open-ended.
        match=re.match(r'^[ \t]+(?:readonly )?([\w-]+)\??:\s*(.+)',line)
        if not match:continue
        key,val=match.groups()
        if line.rstrip().endswith(',') or key=='root' and '--' in val:continue
        if key in SKIP or key.startswith(('on','aria-','__')) or key in ['props','vars','staticComponents','signature','data','items','options','collection','contentRef']:continue
        j=i
        while ';' not in val and j<i+7 and j+1<len(lines):j+=1;val+=' '+lines[j].strip()
        if ';' not in val or '=>' in val or len(val)>260 or any(x in val for x in ['satisfies','})','return ', 'state.', 'props.']) or val.strip().startswith(('{','[','typeof')):continue
        val=val.split(';')[0].strip()
        if any(x in val for x in ['boolean',"'",'"','Size','Variant','Orientation','Appearance','Position','Selection','ReactNode','number','string','Radius','Multiple','SelectionMode','Granularity']):
            kind='slot' if 'ReactNode' in val or 'Slot<' in val else 'prop'
            results.append(dict(name=key,values=val,source=url_fn(i+1,j+1),kind=kind))
    return list({(v['name'],v['values']):v for v in results}.values())

def axes_markdown(text,url_fn):
    out=[];type_index=None;heading='published API'
    for i,line in enumerate(text.splitlines()):
        if line.startswith('#'):heading=line.lstrip('# ').strip()
        if not line.lstrip().startswith('|'):continue
        cells=re.split(r'(?<!\\)\|',line)[1:-1]
        if len(cells)<3:continue
        norm=[re.sub(r'\[([^]]+)\]\([^)]+\)',r'\1',re.sub(r'[`*]','',x)).strip() for x in cells]
        if any(x.lower()=='type' for x in norm):
            type_index=next(i for i,x in enumerate(norm) if x.lower()=='type');continue
        if type_index is None or type_index>=len(cells):continue
        key=norm[0]
        if not key or key.lower() in ['prop','property','name','token name','token','key','component token'] or key.startswith(('on','--','aria-')) or re.fullmatch('[-: ]+',key) or key in SKIP:continue
        val=norm[type_index].replace(r'\|','|')
        if len(key)>65 or len(val)>240 or not val:continue
        out.append(dict(name=key,values=val,source=url_fn(i+1,i+1),kind='published-prop',owner=heading))
    return out

def axes_web(page):
    out=[];text=page['text'];url=page['final_url'];type_index=None
    for line in text.splitlines():
        if not line.startswith(' | '):continue
        cells=[x.strip() for x in line.split('|')][1:]
        if len(cells)<2:continue
        if 'Type' in cells:
            type_index=cells.index('Type');continue
        if type_index is None or type_index>=len(cells):continue
        key=cells[0].rstrip(' *')
        val=' | '.join(cells[type_index:]) if type_index==2 else cells[type_index]
        if not re.fullmatch(r'[a-zA-Z][a-zA-Z0-9? -]{0,45}',key) or key in SKIP or key.lower() in ['prop','property','name','type','key','description'] or key.startswith(('on','aria-')):continue
        if len(val)>260 or not val or val.startswith(('Partial<{','{')):continue
        out.append(dict(name=key,values=val,source=url,kind='published-prop'))
    for mat in re.finditer(r'Anchor to ([a-z][A-Za-z]+)\1\1([^\n]+)',text):
        key=mat[1];raw=mat[2].split('Default:')[0].strip()
        if key in SKIP or key.startswith('on') or len(raw)>260 or 'Callback' in raw:continue
        if len(raw)%2==0 and raw[:len(raw)//2]==raw[len(raw)//2:]:raw=raw[:len(raw)//2]
        if raw:out.append(dict(name=key,values=raw,source=url,kind='published-prop'))
    return list({(v['name'],v['values']):v for v in out}.values())

if __name__=='__main__':
    allunits=sorted(set((sys,cleanunit(u)) for fam in MAP.values() for sys,units in fam.items() for u in units));records={};cache={}
    unitfiles={(s,u):files_for(s,u) for s,u in allunits}
    typefiles=sorted(set(str(f) for files in unitfiles.values() for f in files if f.suffix in ['.ts','.tsx']))
    typed=json.loads(subprocess.check_output(['node',str(P/'extract-types-3.mjs')],input=json.dumps(typefiles),text=True))
    for sys,unit in allunits:
        key=sys+':'+unit;files=unitfiles[(sys,unit)];pages=web_for(sys,unit);sources=[];axes=[];heads=[];texts=[]
        for path in files:
            name='carbon-charts' if sys=='c' and unit=='@Charts' else PINKEY[sys];relative=path.relative_to(ROOT/PINS[name]['path']);txt=path.read_text(errors='replace')
            fn=lambda start,end:link(name,relative,start,end)
            source_start=1243 if sys=='c' and unit=='@Callout' else 1
            sources.append(dict(url=fn(source_start,min(len(txt.splitlines()),source_start+299)),file=str(relative),sha=PINS[name]['sha']))
            if path.suffix in ['.md','.mdx']:
                facts=axes_markdown(txt,fn)
                if sys=='n' and unit.startswith('input/'):
                    sub='Input.'+unit.split('/')[1]
                    facts=[a for a in facts if a['owner'] in ['Input',sub,'VisibilityToggle'] or a['owner'].startswith(sub+' ')]
                axes+=facts
            elif str(path) in typed:
                axes += [dict(name=a['name'],values=a['values'],kind=a['kind'],owner=a['owner'],source=fn(a['line'],a['end'])) for a in typed[str(path)] if not (sys=='c' and unit=='@Callout') or a['owner']=='CalloutProps' or a['name'] in ['NewKindProps','KindProps']]
            elif path.suffix=='.java':axes+=axes_source(txt,fn)
            heads += [dict(name=m[2].strip(),source=fn(txt[:m.start()].count('\n')+1,txt[:m.start()].count('\n')+1)) for m in re.finditer(r'^(#{2,4}) (.+)$',txt,re.M)]
            texts.append(txt)
        for page in pages:
            url=page['final_url']
            if sys=='h':url='https://developer.apple.com/design/human-interface-guidelines/'+unit
            sources.append(dict(url=url,checked=page['checked']))
            if sys in ['k','o']:axes+=axes_web(page)
            heads += [dict(name=x.strip(),source=url) for x in page.get('headings',[])]
            texts.append(page['text'])
        axes=list({(v['name'],v['values']):v for v in axes}.values());heads=list({v['name']:v for v in heads}.values())
        records[key]=dict(system=SYSTEMS[sys],unit=unit,verified=bool(sources),sources=sources,axes=axes,headings=heads)
        cache[key]='\n\n'.join(texts)
    (P/'source-ledger-3.json').write_text(json.dumps(records,indent=2)+'\n')
    (P/'.units-cache-3.json').write_text(json.dumps(cache))
    print('Units:',len(records),'unresolved:',[k for k,v in records.items() if not v['verified']])
    print('Declared/published axes:',sum(len(v['axes']) for v in records.values()))
