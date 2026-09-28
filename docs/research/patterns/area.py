"""Pinned Area evidence and explicit reusable-capability boundaries."""
import re, subprocess
BASE='18b86465d542f620d532fee351c4f28d50c8ac3a'
RANGE={1:'e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a',2:'969d91e60b1cd565d12aa84e0c8ee7162f9a501c',3:'7435813c947188664c665dc59f5fa0ffc5de4e8c'}
REPO='https://github.com/ethanwongwork/area/blob/'
def read(commit,path):return subprocess.check_output(['git','show',f'{commit}:{path}'],text=True,stderr=subprocess.DEVNULL)
def evidence(commit,path,line=1,end=None):
    return dict(commit=commit,path=path,line=line,url=f'{REPO}{commit}/{path}#L{line}'+(f'-L{end}' if end else ''))
def locate(commit,path,needle):
    lines=read(commit,path).splitlines()
    return evidence(commit,path,next(i for i,l in enumerate(lines,1) if needle in l))
def range_evidence(slug,run):
    path=f'docs/research/library-range/{slug}.md'
    try:
        s=read(RANGE[run],path)
        heading='## Area today' if run<3 else '## Reuses in Area'
        line=next((i for i,l in enumerate(s.splitlines(),1) if l==heading),1)
        return evidence(RANGE[run],path,line)
    except subprocess.CalledProcessError:
        return evidence(RANGE[run],f'docs/research/library-range/README-{run}.md',1)
CAPABILITIES={}
def G(id,label,status,kind,reuse,note,inventory,range_slug=None,spec=None):
    CAPABILITIES[id]=dict(id=id,label=label,area_status=status,kind=kind,
       reuse_candidates=reuse.split(),status_note=note,inventory_term=inventory,
       range_slug=range_slug or id,spec=spec)
G('sidebar','Sidebar recipe','recipe','composition','nav menu button',
  'No named Sidebar export found. Compose Nav and ordinary landmarks; route/collapse persistence is recipe work.','PageHeader, Sidebar','sidebar')
G('page-header','PageHeader recipe','recipe','composition','breadcrumb button badge',
  'No named PageHeader export found. Compose a semantic heading, context and actions.','PageHeader, Sidebar')
G('responsive-layout','Responsive layout recipe','recipe','composition','panel card separator',
  'No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here.','responsive layout primitives','responsive-layout')
G('drawer','Drawer / Sheet','partial','behavior','dialog panel button',
  'Dialog and Panel exist; no dedicated edge-sheet presentation and responsive modality contract found.','Drawer/Sheet','drawer','dialog')
G('splitter','General Splitter','partial','behavior','panel',
  'Panel already has keyboard/pointer resizing. A general coordinated multi-pane splitter is not found; do not rebuild Panel resizing.','Resizable/Splitter','splitter','resizable-panel')
G('dockable-inspector','Dockable inspector','missing','adapter','panel toolbar property-list',
  'No docking, detach/reattach or pane-persistence engine found. Existing Panel is useful anatomy.','dockable inspector','dockable-inspector')
G('accordion','Accordion / Disclosure recipe','recipe','composition','panel button',
  'PanelSection already collapses. No standalone Accordion group API found; reuse PanelSection or native details for simple sections.','Accordion/Disclosure','accordion','panel')
G('empty-state','EmptyState recipe','recipe','composition','card button',
  'No named EmptyState export found. Headings, explanation and a useful action are composable.','EmptyState','empty-state')
G('result-state','Result / ErrorState recipe','recipe','composition','alert card button',
  'No named Result export found. Compose semantic content and recovery actions; avoid conflating different failures.','Result/ErrorState','result')
G('search-field','SearchField recipe','recipe','composition','input button kbd',
  'Input supports native search entry. No specialized clear/shortcut/search lifecycle wrapper found.','SearchField','search-field')
G('password-field','PasswordField recipe','recipe','composition','input field button',
  'Native password entry is available through Input; a reusable reveal and announcement wrapper is not found.','PasswordField','password-field')
G('form-validation','Form validation and error summary','partial','behavior','field input alert button',
  'Field provides local help/error association. No aggregate Form/ErrorSummary contract found for linked errors, focus and submission state.','Form validation and error','form-validation','field')
G('alert-dialog','AlertDialog contract','partial','behavior','dialog button',
  'Dialog provides a modal foundation. A separate alert-decision family and complete policy for destructive confirmation were not found.','AlertDialog','alert-dialog','dialog')
G('stepper','Stepper recipe','recipe','composition','progress button badge',
  'No named Stepper export found. An ordered step list is possible; branching and validation belong to the flow.','Stepper','stepper')
G('otp-input','OTP input','missing','primitive','input field',
  'No specialized code-entry, paste and focus contract found; a single native input is a simpler application recipe.','OTP input','otp-input')
G('description-list','DescriptionList recipe','recipe','composition','badge code',
  'No dedicated DescriptionList found. Use native dl/dt/dd and existing value controls.','DescriptionList','description-list')
G('pagination','Pagination recipe','recipe','composition','button select input',
  'No named Pagination export found. Compose page links/buttons and summary text; query state and loading remain application-owned.','Pagination','pagination')
G('multi-select','MultiSelect / TagPicker','partial','behavior','combobox chip checkbox popover',
  'Single-value Combobox and removable Chips exist; a combined multi-value focus, selection and async collection contract is not found.','MultiSelect','multi-select','combobox')
G('selectable-list','Selectable List','partial','behavior','checkbox avatar button',
  'Native lists, links and checkboxes are composable; no managed selectable collection/ListBox family found.','selectable List','selectable-list')
G('data-grid','DataGrid','missing','adapter','table checkbox input menu',
  'Table explicitly has no keyboard-grid or virtualization engine; editable/resizable grid behavior needs an adapter.','DataGrid','data-grid','table')
G('tree-grid','TreeGrid','missing','adapter','table tree-view',
  'No hierarchical grid contract found. Table and TreeView are not interchangeable with a TreeGrid.','TreeGrid','tree-grid')
G('stat','Stat recipe','recipe','composition','card progress badge',
  'CardValue and Card content support numeric summaries. No separately named Stat family found.','Stat','stat','card')
G('charts','Chart integration','missing','adapter','card tooltip table',
  'No chart engine or accessible chart adapter found; use an explicit engine boundary and data alternatives.','charts','charts')
G('date-picker','DatePicker','partial','behavior','calendar popover input field',
  'Calendar is built. A composed date-entry and popup contract, including segmented input, is not found.','DatePicker','date-picker','calendar')
G('date-range-picker','DateRangePicker','partial','behavior','calendar popover input field',
  'Calendar range selection exists; a complete range field, validation and popup contract is not found.','DateRangePicker','date-range-picker','calendar')
G('editable-text','Editable title / text','recipe','composition','input field button',
  'Inline title editing can compose Input. No general display/edit wrapper with commit/cancel ownership found.','editable text','editable-text')
G('timeline','Timeline recipe','recipe','composition','avatar badge separator',
  'No named Timeline family found. Compose an ordered event list; date grouping is application logic.','Timeline','timeline')
G('comment-thread','CommentThread recipe','recipe','composition','avatar message composer button',
  'No standalone CommentThread found. Message, Avatar and Composer provide much of its anatomy; nesting and persistence remain recipe/app work.','CommentThread','comment-thread','message')
G('notification-queue','Live notification queue','missing','behavior','toast',
  'Toast exists; its spec assigns placement, lifetime and stacking to consumers. No shared queue manager found.','live notification queue','notification-queue','toast')
G('source-chip','SourceChip recipe','recipe','composition','chip hover-card',
  'No independent citation family found. Compose Chip and HoverCard; source identity and validity belong to the application.','SourceChip','source-chip')
G('thinking-disclosure','ThinkingDisclosure recipe','recipe','composition','panel message spinner',
  'No dedicated process-disclosure contract found. A collapsible status section can reuse Panel; timers and event data remain application-owned.','ThinkingDisclosure','thinking-disclosure')
G('attachment-card','AttachmentCard recipe','recipe','composition','card progress button',
  'No standalone AttachmentCard found. File identity/progress can compose existing controls; actual upload is a separate dependency.','AttachmentCard','attachment-card')
G('file-upload','FileUpload / DropZone','missing','primitive','input button progress alert',
  'Native file selection can use Input, but a reusable drop zone, file validation and per-file lifecycle contract are not found.','FileUpload/DropZone','file-upload')
G('rich-text-editor','Rich-text editor integration','missing','adapter','toolbar menu popover',
  'No rich-document editing engine found; formatting surfaces do not provide schema, selection or undo.','rich text and code-editor','rich-text-editor')
G('code-editor','Code editor integration','missing','adapter','code-block toolbar textarea',
  'No syntax-aware editing engine found. CodeBlock is display and Textarea is native text entry.','rich text and code-editor','code-editor','code-block')
G('floating-format-bar','FloatingFormatBar','partial','adapter','toolbar popover',
  'Toolbar and Popover exist, but editor-selection anchoring and command state require an editing adapter.','FloatingFormatBar','floating-format-bar')
G('gradient-editor','GradientEditor','partial','behavior','color-picker color-swatch slider',
  'Solid-color controls are built; no complete stop model, stop manipulation and interpolation contract found.','GradientEditor','gradient-editor','color-picker')
G('font-picker','FontPicker','partial','adapter','combobox select',
  'A plain font-name selection is possible. Font preview/loading and variable axes are not a dedicated Area contract.','FontPicker','font-picker','combobox')
G('media-preview','Media preview integration','missing','adapter','dialog button panel',
  'No general file/media preview engine found. Native images and text can be composed; arbitrary document preview and zoom require an adapter.','image/media preview','media-preview')
G('people-picker','PeoplePicker','partial','behavior','combobox avatar chip',
  'Basic single-person choice can use Combobox. Rich multi-person identity, invitation and async result contracts are not found.','PeoplePicker','people-picker','combobox')
G('reactions','Reactions recipe','recipe','composition','chip button popover',
  'No named Reactions family found; fixed reaction choices can compose Chips/Buttons. A full emoji picker is additional scope.','Reactions','reactions')
G('constraints-picker','ConstraintsPicker recipe','recipe','composition','checkbox alignment-picker',
  'No separate anchor-constraint family found. Opposing anchors can coexist; use independent Checkbox state rather than treating the single-choice AlignmentPicker as a constraints engine.','ConstraintsPicker','constraints-picker')
G('payment-adapter','Payment-provider entry adapter','missing','external-integration','field input alert',
  'Not found in the full COMPONENTS inventory or the three range catalogues. Proposed provider-owned entry; do not build card processing into generic Input.','',None)

def build_registry(used):
    manpath='packages/styles/src/manifest.ts'; man=read(BASE,manpath)
    invpath='docs/COMPONENTS.md'; inv=read(BASE,invpath)
    regpath='apps/docs/src/component-status.mjs'; reg=read(BASE,regpath)
    accepted=set(re.findall(r"'([^']+)'",reg.split('export const COMPLETE_COMPONENTS = new Set([')[1].split(']);')[0]))
    review=set(re.findall(r"'([^']+)'",reg.split('export const REVIEW_COMPONENTS = new Set([')[1].split(']);')[0]))
    blocks={m.group(2):(m.group(1),man[:m.start()].count('\n')+1) for m in re.finditer(r'export const (\w+) = \{\s*block: "area-([^"]+)"',man)}
    result={}
    mz={'menu','message','model-picker','nav','number-field','panel','popover','progress','prompt-suggestions','property-list','radio','scroll-to-latest','segmented','select','separator','skeleton','slider','spinner','split-button','switch','table','tabs','textarea','toast','toolbar','tooltip','tree-view'}
    for slug in sorted(used):
        if slug in CAPABILITIES: continue
        assert slug in blocks, slug
        camel,line=blocks[slug]; label=camel[0].upper()+camel[1:]
        if slug=='switch':label='Switch'
        specpath=f'docs/specs/{slug}.md'; spec=read(BASE,specpath)
        # Inventory is a map of names, not the authority for availability.
        invline=next((i for i,l in enumerate(inv.splitlines(),1) if label in l),27)
        statusline=next(i for i,l in enumerate(reg.splitlines(),1) if "'"+slug+"'" in l)
        e=[evidence(BASE,manpath,line),evidence(BASE,specpath,1),evidence(BASE,invpath,invline),evidence(BASE,regpath,statusline)]
        result[slug]=dict(id=slug,label=label,area_status='built',kind='family',
            owner_status='complete' if slug in accepted else 'review' if slug in review else 'unrefined',
            area_families=[slug],status_note='Built at the pinned baseline; availability does not imply the entire pattern behavior or new owner acceptance.',
            area_evidence=e,range_evidence=[range_evidence(slug,2 if slug in mz else 1)])
    if 'count' in result:
        result['count']['range_evidence']=[locate(RANGE[3],'docs/research/library-range/README-3.md','Count is outside')]
        result['count']['range_note']='The range survey explicitly excludes Count; its current availability is established by the pinned main manifest and spec.'
    for slug in sorted(used & CAPABILITIES.keys()):
        x=CAPABILITIES[slug].copy(); term=x.pop('inventory_term'); rangeslug=x.pop('range_slug'); spec=x.pop('spec')
        invline=next((i for i,l in enumerate(inv.splitlines(),1) if term and term in l),27)
        x['area_evidence']=[evidence(BASE,invpath,invline),evidence(BASE,manpath,689,len(man.splitlines())),evidence(BASE,'packages/react/src/index.ts',12,len(read(BASE,'packages/react/src/index.ts').splitlines()))]
        if spec:x['area_evidence'].append(evidence(BASE,f'docs/specs/{spec}.md',1))
        x['area_families']=x['reuse_candidates'];x['owner_status']='not-a-registered-family'
        if slug=='payment-adapter':
            x['range_evidence']=[evidence(RANGE[n],f'docs/research/library-range/README-{n}.md',1) for n in RANGE]
        else:x['range_evidence']=[range_evidence(rangeslug,3)]
        if slug=='splitter': x['area_evidence'].append(locate(BASE,'packages/react/src/components/primitives.tsx','resizable?:'))
        if slug=='accordion': x['area_evidence'].append(locate(BASE,'packages/react/src/components/primitives.tsx','export const PanelSection'))
        if slug=='form-validation':x['area_evidence'].append(locate(BASE,'packages/react/src/components/Field.tsx','export'))
        result[slug]=x
    return result
