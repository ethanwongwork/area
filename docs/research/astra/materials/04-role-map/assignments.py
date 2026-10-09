"""Reviewed role assignments. Codes are expanded by build.py; no name-based role guessing."""
ROLES={'P':'page','C':'container','F':'floating surface','R':'raised control','I':'recessed field/track','K':'thumb/knob','S':'indicator/fill','D':'divider','E':'edge','G':'glyph','T':'text','X':'scrim'}
# First token: root. Every manifest element must appear exactly once thereafter.
MAP='''
button R G:icon T:label
buttonGroup C
splitButton C R:action,trigger F:menu
toolbar C C:group D:separator
alignmentPicker C R:cell S:dot
colorPicker C C:header,body,contrast,preview,values,controls,tracks,channel-row,swatches,heading S:contrast-pair,band,band-region I:area,channel,slider,hue,alpha,model,text-field,opacity,views,fields G:contrast-level E:band-edge K:thumb T:contrast-ratio,contrast-unit,channel-label,note S:preview-new R:preview-original C:grid
calendar C C:months,month,header,grid,cell,week,nav T:title,weekday,day-number,day-weekday,day-month R:day S:marker
colorSwatch S
colorSwatchPicker C R:cell
colorField I I:opacity
field C T:label,description,validation,error G:required
input I T:control,affix G:icon,action-icon C:action R:action-button F:action-tooltip
numberField I T:control,unit G:scrub C:steppers R:step
inputGroup I T:text
breadcrumb C C:list,item T:link,page G:separator,chevron,ellipsis
treeView C G:chevron,icon I:check T:label C:trailing,actions
composer I C:entry,actions,extras,footer T:input R:submit
textarea I
select I
checkbox C I:control G:visual
checkboxGroup C T:legend,description,validation C:options
radio C I:control G:visual
radioGroup C T:legend,description,validation C:options
switch C I:control,track K:thumb C:text T:label,description S:loading
slider C T:label,value I:control C:marks
sliderRange C I:track,input C:end
chip R S:swatch G:icon,trailing-icon,avatar,image T:label R:action,remove
chipGroup C
choiceLabel C T:title,description
badge C S:dot G:leading-icon,trailing-icon,avatar,flag T:label R:dismiss
presence S
indicatorAnchor C C:indicator
indicator S
count S T:label
accordionItem C C:heading,content R:trigger G:chevron T:label
accordion C
badgeGroup C C:item R:overflow-trigger F:overflow-content
avatar C G:image,icon
avatarGroup C C:item,overflow
separator D
skeleton S C:lines
spinner I
progress I S:bar
panel C E:resize C:bar,body,section,heading,actions,summary,rows,row,row-controls,row-action,stack,footer T:title,heading-text,toggle-text,row-label R:toggle G:chevron
propertyList C C:item,value,actions G:handle S:indicator
boxField C T:label C:fields I:field R:toggle
combobox C F:listbox R:option T:description,empty C:group
customSelect C I:trigger F:listbox G:icon,chevron T:value C:group R:option D:separator
tag C G:icon T:label R:remove
tagPicker C I:field T:input,hint,empty F:listbox R:option,create
datePicker C I:trigger G:icon T:value F:panel C:footer
confirmDialog F
drawer F C:modal,header,heading,body,footer T:title,description R:close
commandPalette F C:modal,search,list,footer,group T:input,text,description,empty G:search-icon R:item,hint-button C:hint
contextMenu C F:menu
hoverCard F C:identity,meta
promptSuggestions C C:row,dismiss R:item G:icon T:text
message C C:bubble,content,actions S:cursor
scrollToLatest C
modelPicker C R:trigger
card C T:title,description,value,action,link C:content,header,heading,header-action,footer,media,overlay,list,carousel
alert C G:icon C:content,link,actions,dismiss T:title,description
dialog F C:header,heading,body,footer,modal T:title,description R:close
popover F C:header,body,footer,media T:title,description F:arrow E:arrow-edge
menu F R:item G:icon,check,sub-chevron C:lines T:text,description,label,shortcut D:separator I:toggle F:search-surface
tooltip F
toast F G:icon C:content,action,dismiss T:title,description
toaster C C:list
tabs C C:list,panel R:tab T:label G:icon
table C C:cell T:link
tableWrapper C
segmented I R:item G:icon T:label
code C S:swatch T:label
codeBlock C C:header,actions,body,line,gutter,languages T:title,language,pre,code,linenumber,text I:select G:marker R:toggle
nav C C:group,trailing,row,actions T:label,text R:item G:icon D:separator
token C S:swatch T:label
kbd C T:key
kbdGroup C
'''
# Parent changes from the root. @host is the outside composition; roots normally live there.
PARENTS={
'button':{'icon':'root','label':'root'},
'splitButton':{'menu':'@host'},
'alignmentPicker':{'dot':'cell'},
'colorPicker':{'header':'root','body':'root','area':'body','thumb':'area','channel':'area','band':'area','band-region':'band','band-edge':'band','views':'body','contrast':'body','contrast-pair':'contrast','contrast-ratio':'contrast','contrast-unit':'contrast-ratio','contrast-level':'contrast','grid':'body','controls':'body','tracks':'controls','channel-row':'tracks','channel-label':'channel-row','slider':'channel-row','hue':'tracks','alpha':'tracks','preview':'controls','preview-new':'preview','preview-original':'preview','values':'body','model':'values','fields':'values','text-field':'fields','opacity':'fields','note':'body','swatches':'root','heading':'swatches'},
'calendar':{'month':'months','header':'month','title':'header','nav':'header','grid':'month','weekday':'grid','cell':'grid','day':'cell','day-number':'day','day-weekday':'day','day-month':'day','marker':'day'},
'input':{'action-button':'action','action-icon':'action-button','action-tooltip':'@host'},
'numberField':{'step':'steppers'},
'breadcrumb':{'item':'list','link':'item','page':'item','separator':'item','chevron':'item','ellipsis':'item'},
'treeView':{k:'row' for k in ['chevron','check','icon','label','trailing','actions']},
'composer':{'input':'entry','submit':'actions'},
'switch':{'thumb':'track','loading':'root','label':'text','description':'text'},
'accordionItem':{'trigger':'heading','label':'trigger','chevron':'trigger'},
'badgeGroup':{'overflow-content':'@host'},
'indicatorAnchor':{'indicator':'root'},
'panel':{'root':'@host','title':'bar','section':'body','heading':'section','heading-text':'heading','actions':'heading','toggle':'heading','toggle-text':'toggle','chevron':'toggle','summary':'toggle','rows':'section','row':'rows','row-label':'row','row-controls':'row','row-action':'row','stack':'@host'},
'propertyList':{'handle':'item','value':'item','actions':'item'},
'boxField':{'field':'fields'},
'field':{'required':'label'},
'segmented':{'icon':'item','label':'item'},
'combobox':{'listbox':'@host','option':'listbox','description':'option','empty':'listbox','group':'listbox'},
'customSelect':{'icon':'trigger','value':'trigger','chevron':'trigger','listbox':'@host','option':'listbox','group':'listbox','separator':'listbox'},
 'tagPicker':{'input':'field','listbox':'@host','hint':'listbox','option':'listbox','create':'listbox','empty':'listbox'},
'datePicker':{'icon':'trigger','value':'trigger','panel':'@host','footer':'panel'},
'drawer':{'root':'modal','modal':'@host','heading':'header','title':'heading','description':'heading','close':'header'},
'commandPalette':{'root':'modal','modal':'@host','search-icon':'search','input':'search','group':'list','empty':'list','item':'group','text':'item','description':'item','hint':'footer','hint-button':'footer'},
'contextMenu':{'menu':'@host'},
'promptSuggestions':{'item':'row','icon':'item','text':'item','dismiss':'row'},
'message':{'content':'bubble'},
'card':{'title':'heading','description':'heading','header-action':'header','heading':'header','overlay':'media'},
'alert':{'title':'content','description':'content','link':'content'},
'dialog':{'root':'modal','modal':'@host','heading':'header','title':'heading','description':'heading','close':'header'},
'popover':{'title':'header','description':'body','arrow-edge':'arrow'},
'menu':{'icon':'item','lines':'item','text':'lines','description':'lines','shortcut':'item','check':'item','toggle':'item','sub-chevron':'item','search-surface':'@host'},
'toast':{'title':'content','description':'content'},
'tabs':{'tab':'list','label':'tab','icon':'tab'},
'codeBlock':{'title':'header','language':'header','languages':'header','select':'header','actions':'header','pre':'body','code':'pre','line':'code','gutter':'line','linenumber':'gutter','marker':'gutter','text':'line','toggle':'body'},
'nav':{'label':'group','item':'row','icon':'item','text':'item','trailing':'item','actions':'row'},
}
# These are paint readings, not an instruction to add relief. Default is flush.
DEPTH={
'button.root':'flush','calendar.root':'raised','colorPicker.root':'raised',
'colorPicker.thumb':'raised','colorPicker.slider-thumb':'raised','switch.thumb':'raised',
'slider.thumb':'raised','panel.root':'raised',
'dialog.root':'floating','drawer.root':'floating','commandPalette.root':'floating','confirmDialog.root':'floating',
'popover.root':'floating','menu.root':'floating','tooltip.root':'floating','toast.root':'floating','hoverCard.root':'floating',
'splitButton.menu':'floating','input.action-tooltip':'floating','badgeGroup.overflow-content':'floating',
'combobox.listbox':'floating','customSelect.listbox':'floating','tagPicker.listbox':'floating','datePicker.panel':'floating','contextMenu.menu':'floating','menu.search-surface':'floating',
'avatarGroup.item':'flush','scrollToLatest.root':'floating',
}
# Primary role remains singular. These alternate meanings are contextual, never extra paint passes.
NOTES={
'button.root':('R','All current variants explicitly omit shadows; raised-control is a material assignment, not current relief.'),
'buttonGroup.root':('','Layout/group shell; child Button shadows are suppressed. Shared dividers are separate paint.'),
'splitButton.root':('','Layout shell; action and trigger reuse Button; menu is a sibling overlay, not a third attached segment.'),
'toolbar.root':('F','Plain is layout-only; surface adds a plate and shadow. A floating toolbar is a placement, not a new part.'),
'alignmentPicker.dot':('G','Idle dot becomes alignment bars when selected/previewed. Both communicate position, not a movable thumb.'),
'colorPicker.root':('F','Surface variant has a lifted shell; plain removes the shell. Embedding in an overlay changes contextual depth.'),
'colorPicker.band':('','SVG contrast mask, not a new container material; regions and edge have separate paint.'),
'colorPicker.channel':('','Invisible range input for keyboard/pointer access; no independent material paint.'),
'colorPicker.grid':('','ColorSwatchPicker palette grid; cells carry semantic color samples, not a neutral panel fill.'),
'colorPicker.area':('S','Color-coordinate field; gradient is semantic data, not an arbitrary decorative material fill.'),
'colorPicker.hue':('S','Hue ramp is the track paint, not a surface tint. Native thumb is separate.'),
'colorPicker.alpha':('S','Alpha ramp over a checker; preserve transparency information.'),
'colorPicker.contrast-level':('T','Rating text and pass/fail glyph share this slot; split their foregrounds only if the markup separates them.'),
'colorPicker.preview-new':('','Passive new-color sample (span role=img); checker and sample layers are listed separately.'),
'colorPicker.preview-original':('S','Clickable restore sample; semantic color is not replaced by material fill.'),
'calendar.root':('F','Surface has shadow-float; plain removes chrome. Inside DatePicker the parent supplies elevation.'),
'calendar.day':('S','Interactive day plate; selected fill and range bridge express selection. No default physical lift.'),
'field.validation':('','Text may carry state-specific ink. Semantics remain authoritative.'),
'input.control':('I','Transparent editable text inside the field shell; autofill can paint a background, not an inset relief.'),
'input.action':('','Layout wrapper; action-button owns the state plate and action-icon owns ink.'),
'input.affix':('G','Normally prefix/suffix text; arbitrary visual content requires its own child role.'),
'numberField.scrub':('R','Glyph acts as a drag control. Extended hit target is not paint; no separate raised slab is present.'),
'inputGroup.root':('C','One field shell around multiple controls. Child Input/NumberField/Select chrome is removed.'),
'inputGroup.text':('G','Affix is text by default; data-visual substitutes a glyph.'),
'breadcrumb.link':('R','Text link with a separate hover plate; do not apply a raised button body to its text.'),
'breadcrumb.ellipsis':('R','May be passive ellipsis or menu-trigger button; button hover plate is separate.'),
'treeView.trailing':('T','Consumer slot: quiet metadata, count or another component; recurse into supplied children.'),
'composer.root':('C','Editable field shell also groups action controls; no inset shadow is asserted.'),
'checkbox.root':('R','Row is layout-only; card/tile variants add a selectable container plate. Native box remains separate.'),
'radio.root':('R','Row is layout-only; card/tile variants add a selectable container plate. Native circle remains separate.'),
'checkbox.visual':('','Optional leading visual/icon; this is not the checkmark.'),
'radio.visual':('','Optional leading visual/icon; this is not the selection dot.'),
'switch.control':('','Invisible native input; track/thumb carry paint. Do not apply material to the hit target.'),
'switch.track':('','Field/track role; CSS fill and border read flat, with no inset relief.'),
'slider.control':('','Native input is a hit/layout host; browser track/thumb pseudos carry visible material.'),
'sliderRange.track':('C','Wrapper positions the rail and selected fill; its before/after pseudos own those paints.'),
'sliderRange.end':('','End Slider wrapper; overlapping duplicate thumb can be hidden.'),
'chip.root':('C','Button/link chip is a control; removable input chip is a wrapper around label plus removal control.'),
'chip.action':('G','An action can be a button or a passive trailing visual; only the former has a control plate.'),
'chip.avatar':('C','Avatar/photo media: preserve intrinsic content; do not fill the image with a material.'),
'chip.image':('','Intrinsic image is classified as glyph/media under the closed role vocabulary, not tinted icon ink.'),
'badge.root':('R','Passive badge body by default; link/button variants are interactive without changing semantic tone.'),
'badge.avatar':('','Intrinsic avatar image is glyph/media, not a recolorable status glyph.'),
'badge.flag':('','Intrinsic flag image is glyph/media; preserve its colors.'),
'presence.root':('G','Status disc/ring and status glyph coexist; ring is edge, glyph is separate.'),
'indicatorAnchor.indicator':('S','Positioning slot, not paint; the child Indicator or Presence paints status.'),
'indicator.root':('T','Dot or count disc; count characters get a separate text row.'),
'count.root':('T','Numerical status plate; text is separate from the plate.'),
'count.label':('','Visually hidden accessible label; excluded from material paint.'),
'accordion.root':('','Stack layout; each item owns its trigger, body and optional dividing edge.'),
'badgeGroup.overflow-trigger':('S','Badge-shaped count acts as a button; shared Badge internal roles apply.'),
'avatarGroup.overflow':('C','Static Avatar with overflow count in current React; no button or lift is asserted.'),
'skeleton.root':('C','Placeholder fill substitutes for content; wrap mode skeletonizes child boxes, not the display:contents root.'),
'spinner.root':('S','Ring track is recessed-field/track by role only; current CSS is flat. Arc is separate indicator paint.'),
'progress.root':('','Flat track, not measured physical recess; bar is semantic progress paint.'),
'panel.root':('P','Raised by shadow-2; flush docking removes shadow and adopts page background.'),
'panel.resize':('K','Invisible edge hit target; visible focus pill is separate. It behaves as a handle, not a permanent knob.'),
'panel.summary':('T','Mixed collapsed summary: text, swatches or controls; apply the child component roles.'),
'panel.row-action':('','Layout slot, not a button; the supplied Button owns its paint.'),
'propertyList.handle':('R','Drag grip glyph, only shown in active row contexts; do not add a slab by default.'),
'propertyList.indicator':('D','Insertion line is semantic feedback; primary indicator/fill, not a structural separator.'),
'customSelect.trigger':('R','Field-shaped button, even though it is not editable text; options remain controls in a Menu surface.'),
'datePicker.trigger':('R','Field-shaped button; date value and calendar glyph remain separate ink.'),
'confirmDialog.root':('','Specializes Dialog; inherited title/description/body/footer plus Cancel/confirm Buttons are referenced below.'),
'commandPalette.root':('C','Modal is floating; inline variant is flush and removes shadow. Modal wrapper is transparent.'),
'commandPalette.hint':('T','Hint wrapper can contain text and Kbd keycaps.'),
'contextMenu.root':('','display:contents wrapper, no material body; menu owns all overlay paint.'),
'hoverCard.root':('','Popover surface reuse; identity/meta are content layout, not additional floating surfaces.'),
'promptSuggestions.dismiss':('','Positioning slot; its child Button owns the control plate.'),
'message.bubble':('','User message paints a quiet bubble; assistant copy remains on the parent ground.'),
'message.content':('T','Rich-text content slot, not a second bubble; embedded Code/CodeBlock keep their own roles.'),
'scrollToLatest.root':('F','Floating positioning wrapper has no fill; nested Button is the visible control.'),
'card.media':('G','Media slot/optional well; image or video retains intrinsic pixels. Well may look recessed without an inset shadow.'),
'card.header-action':('R','Wrapper for supplied header action, not necessarily painted itself.'),
'card.overlay':('F','Positioned controls over media; wrapper is not a scrim or a separate panel.'),
'card.action':('R','Text link action, not a button plate.'),
'card.link':('R','Text link with stretched hit-target pseudo; focus edge can outline the card.'),
'alert.link':('T','Layout wrapper; descendant anchor supplies visible text.'),
'alert.dismiss':('R','Slot positions a child Button; avoids painting the wrapper twice.'),
'dialog.modal':('','Transparent native dialog top-layer wrapper; panel and backdrop own paint.'),
'drawer.modal':('','Transparent dialog wrapper; backdrop is absent in modeless presentation.'),
'popover.arrow':('E','Continuation of the same surface, flush relative to it; not independently elevated. arrow-edge is its outline.'),
'menu.toggle':('K','Switch track inside a row; thumb remains a separate reused Switch part.'),
'menu.search-surface':('C','Deprecated Combobox search surface; legacy layout only, do not introduce as a new component.'),
'menu.shortcut':('C','Text by default, or Kbd composition if keycaps are provided.'),
'menu.root':('C','Menu surface normally floats; inline and embedded search menus suppress duplicate chrome.'),
'tooltip.root':('','Floating surface; text and optional Kbd plus arrow are separately accounted.'),
'toast.action':('R','Wrapper for action Button; the wrapper has no independent control paint.'),
'toast.dismiss':('R','Wrapper for dismiss Button; the wrapper has no independent control paint.'),
'toaster.root':('F','Fixed viewport placement only; Toast children own floating surfaces.'),
'table.cell':('T','Cell box is a layout/container; text or nested component remains separate.'),
'segmented.root':('C','Shared track visually flush today; do not assume an inset shadow.'),
'segmented.item':('K','Selected button has shadow-1 and resembles a thumb; it is not a separately moving thumb element.'),
'codeBlock.pre':('C','Preformatted text region also clips/scrolls code; line/text children provide ink when numbered.'),
'codeBlock.gutter':('T','Layout groups line-number text and optional diff marker glyph.'),
'codeBlock.toggle':('F','Expanded footer control is flush; collapsed control overlays the last lines and carries a fade scrim.'),
'nav.item':('S','Navigation row control with selected plate; not a physically raised button.'),
'nav.trailing':('T','Consumer slot can hold text, Count or another component; recurse into its contents.'),
'nav.row':('','Row layout can also paint the selected background for an item with separate actions.'),
'code.root':('T','Inline code backing and literal text are distinct layers; no control behavior.'),
'token.root':('T','Deprecated compatibility spelling of Code; includes the same body and text paint.'),
'kbd.root':('R','Passive keycap, not an interactive button. Default has a border and no shadow; quiet removes backing.'),
}
# Manifest contracts sharing a spec, plus legacy compatibility names.
SPEC_ALIASES={'checkboxGroup':'checkbox','radioGroup':'radio','choiceLabel':'checkbox','switch':'switch','sliderRange':'slider','chipGroup':'chip','presence':'indicator','indicatorAnchor':'indicator','accordionItem':'accordion','avatarGroup':'avatar','toaster':'toast','tableWrapper':'table','token':'code','kbdGroup':'kbd'}
