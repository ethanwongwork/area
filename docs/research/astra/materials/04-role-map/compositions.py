"""Curated current composition evidence."""
BINDINGS="""
button|icon|spinner|*|Button|91|91|Loading replaces the icon; ring and arc remain flat to the icon slot.
buttonGroup|root|button|*|ButtonGroup|13|16|Child buttons; group CSS removes independent shadows and manages shared seams.
splitButton|action|button|*|SplitButton|107|112|Same-element Button specialization; no second root plate.
splitButton|trigger|button|*|SplitButton|114|116|Same-element Button specialization, icon-only so label absent.
splitButton|menu|menu|root,item,icon,text,lines,description,label,separator,shortcut,check,toggle,sub-chevron|SplitButton|117|120|Same-element Menu surface, optional consumer menu-item parts.
toolbar|root|button|*|Toolbar|111|112|Overflow trigger; other commands are consumer-supplied children.
toolbar|root|menu|root,item,icon,text,lines,description,label,separator,shortcut,check,toggle,sub-chevron|Toolbar|111|112|Overflow menu is floating relative to host, not clipped inside toolbar.
calendar|nav|button|*|Calendar|262|265|Month previous/next icon buttons; week arrows live beside the week grid (232–245). No labels rendered.
colorSwatchPicker|cell|colorSwatch|*|ColorSwatchPicker|119|119|Sample is inside radio cell; selection outline belongs to cell.
colorField|root|input|*|ColorField|68|79|Single field path; alpha path mounts this field in InputGroup and strips duplicate shell chrome.
colorField|root|inputGroup|root|ColorField|82|88|Alpha-only outer shell; Input and NumberField are same-level segments, not nested relief.
colorField|root|colorSwatch|*|ColorField|77|77|Leading input visual is a semantic color sample.
colorField|opacity|numberField|root,control,unit|ColorField|85|88|Percent segment inside alpha group; one outer edge, no independent field shadow.
colorPicker|views|segmented|*|ColorPicker|322|323|Same-element view switch; selected item depth follows Segmented.
colorPicker|grid|colorSwatchPicker|*|ColorPicker|346|348|Palette composition; grid is not a bitmap/canvas.
colorPicker|controls|button|*|ColorPicker|350|351|Optional eyedropper icon button, no visible label.
colorPicker|model|select|*|ColorPicker|360|362|Same-element model selector; native picker floats relative to host.
colorPicker|fields|inputGroup|root|ColorPicker|364|369|Same-element shared field shell.
colorPicker|fields|numberField|root,control,unit|ColorPicker|275|278|Channel fields share group chrome; numeric ink and unit remain separate.
colorPicker|text-field|input|root,control,placeholder|ColorPicker|66|72|CSS/hex value text Input specialization.
colorPicker|opacity|numberField|root,control,unit|ColorPicker|366|368|Percent field inside the same fields group.
colorPicker|swatches|colorSwatchPicker|*|ColorPicker|377|378|Saved color palette; inherit semantic samples and selection rings.
colorPicker|heading|button|*|ColorPicker|375|376|Optional add-swatch icon control.
input|icon|spinner|*|Input|139|139|Loading indicator replaces leading/trailing icon when requested.
input|action-tooltip|tooltip|root,copy,arrow,pointer-bridge|Input|77|77|Same Tooltip surface; arrow is optional donor feature, default has none.
breadcrumb|ellipsis|menu|root,item,text|Breadcrumb|57|57|Ellipsis-triggered Menu floats relative to host; ellipsis itself keeps breadcrumb plate.
composer|submit|button|*|Composer|111|115|Same-element icon-only submit/stop Button, label absent.
checkboxGroup|options|checkbox|*|forms|205|223|Group children reuse Checkbox; exact count/content is consumer supplied.
radioGroup|options|radio|*|forms|280|298|Group children reuse Radio; exact count/content is consumer supplied.
checkbox|root|choiceLabel|*|forms|153|187|Optional title/description slots; children supplied by consumer.
radio|root|choiceLabel|*|forms|318|340|Optional title/description slots; children supplied by consumer.
switch|loading|spinner|*|Switch|106|110|Loading spinner is a sibling of track and text, not a second thumb.
sliderRange|root|slider|*|SliderRange|103|107|Start Slider; its native rail paint is transparent, shared range rail supplies it.
sliderRange|end|slider|*|SliderRange|105|107|End Slider; native rails transparent; overlapping end thumb may be hidden.
sliderRange|input|input|root,control,placeholder|SliderRange|88|91|Optional numeric end-value input; same-element Input specialization.
chipGroup|root|chip|*|primitives|1016|1021|Grouping contract; supplied Chip children retain all their own parts.
accordion|root|accordionItem|*|Accordion|101|120|Stack of item components; no extra accordion material shell.
badgeGroup|item|badge|*|BadgeGroup|81|85|Visible and overflow badges retain Badge's own roles.
badgeGroup|overflow-trigger|badge|root,label|BadgeGroup|81|85|Same badge-shaped trigger, count label as text; root is a control in this context.
badgeGroup|overflow-content|popover|root|BadgeGroup|84|88|Same-element Popover panel; contents are overflow badges.
avatarGroup|item|avatar|*|primitives|138|140|Each visible Avatar paints its own content and overlap ring.
avatarGroup|overflow|avatar|root,initials|primitives|140|140|Same-element passive count Avatar; no interactive trigger in current implementation.
boxField|field|numberField|*|BoxField|105|115|Same-element NumberField; optional unit/steppers depend on props.
boxField|toggle|button|*|BoxField|117|119|Same-element icon-only expand/collapse button, label absent.
combobox|root|input|*|Combobox|252|266|Editable field with optional icon/clear/loading slots.
combobox|listbox|menu|root,item,icon,text,check,label|Combobox|220|236|Menu paint reused by options, create row and group labels; wrapper instantiation at 270.
customSelect|listbox|menu|root,item,icon,lines,text,description,check,label,separator|CustomSelect|208|242|Single Menu surface with option body, description, chosen check, group label and dividers.
tagPicker|field|tag|*|TagPicker|193|196|Chosen tokens are Tag (not Badge); removal is optional.
tagPicker|listbox|menu|root,item,text,label,check|TagPicker|210|233|Same Menu surface and rows; hint, create text, chosen check remain distinct.
tagPicker|option|tag|root,label|TagPicker|232|233|Passive Tag within option; selection belongs to the Menu row.
tagPicker|create|tag|root,label|TagPicker|221|222|Preview Tag follows the literal Create text.
datePicker|panel|popover|root|DatePicker|119|120|Same-element floating panel; do not apply an extra inner Popover body.
datePicker|panel|input|*|DatePicker|126|129|Editable date text field inside panel.
datePicker|panel|calendar|*|DatePicker|130|133|Plain Calendar: root flush and unpainted; keep days, markers, range and navigation roles.
datePicker|footer|menu|separator,item,text|DatePicker|134|140|Footer clear row and divider only; no nested Menu floating shell.
confirmDialog|root|dialog|root,modal,header,heading,title,description,body,footer,scrim|ConfirmDialog|68|73|Same Dialog shell and modal backdrop; showCloseButton=false, so no close action.
confirmDialog|root|button|*|ConfirmDialog|71|72|Cancel and confirm Buttons mounted in inherited footer. Loading icon only when busy.
drawer|close|button|*|Drawer|85|87|Same-element ghost icon button, label absent.
commandPalette|list|menu|item,icon,text,shortcut,label|CommandPalette|163|196|Rows and group labels only; no nested Menu surface.
commandPalette|hint|kbd|*|CommandPalette|205|215|Quiet keycaps inside clickable footer hints; flat to hint control.
commandPalette|item|kbd|*|CommandPalette|171|171|Optional quiet shortcut keys in trailing Menu shortcut slot.
contextMenu|menu|menu|root,item,icon,text,lines,description,label,separator,shortcut,check,toggle,sub-chevron|ContextMenu|113|116|Same-element Menu surface; child content supplied through Menu items.
hoverCard|root|popover|root,header,title,description,body,footer,media,media-pixels,arrow,arrow-edge|HoverCard|69|83|Popover paint specialization; optional content/arrow parts only when supplied.
promptSuggestions|row|button|*|PromptSuggestions|39|39|Chips presentation uses Button instead of list item markup.
promptSuggestions|dismiss|button|*|PromptSuggestions|50|52|Child ghost icon-only dismiss, no label.
scrollToLatest|root|button|*|ScrollToLatest|58|60|Only painted child; outline pill, no extra shadow supplied by wrapper.
modelPicker|trigger|button|*|ModelPicker|54|60|Same-element ghost Button with selected model label and caret.
modelPicker|root|menu|root,item,text,lines,description,check|ModelPicker|54|64|Menu surface and radio-option rows; menu floats relative to host.
alert|dismiss|button|*|primitives|206|206|Child dismiss icon button, no label.
dialog|close|button|*|primitives|1598|1601|Same-element ghost icon-only button.
menu|toggle|switch|root,track,thumb|primitives|1400|1406|Visual-only Switch parts in checkable menu row; no extra native input/labels.
menu|root|menu|root,item,icon,text,lines,description,label,separator,shortcut,check,toggle,sub-chevron|primitives|1335|1339|Submenu recursion: a separate floating Menu adjacent to its parent item, repeated per nesting level.
toast|dismiss|button|*|primitives|1438|1438|Child ghost icon button; action is consumer supplied.
toaster|item|toast|*|Toaster|178|178|Each Toast is independently floating relative to host; list wrapper is unpainted.
tableWrapper|root|table|*|primitives|1065|1077|Table is inside scroll wrapper; only wrapper provides outer rounded border.
codeBlock|languages|tabs|root,list,tab,label,panel|primitives|1931|1959|Language tab strip; code body is its panel, not a separate elevated panel.
codeBlock|select|select|*|primitives|1967|1978|Alternative language chooser; native popup handled by Select.
codeBlock|actions|button|*|primitives|1985|1996|Copy icon Button, glyph changes to check; no label.
badge|avatar|avatar|root,image,icon,initials,rings|css:badge|192|194|Optional Avatar composition inside badge media slot; intrinsic media preserved.
chip|avatar|avatar|root,image,icon,initials,rings|css:chip|178|186|Optional Avatar composition within chip; no extra outer chip plate.
inputGroup|root|input|*|css:input-group|57|78|Optional grouped Input; donor root border/background suppressed so group paints shell once.
inputGroup|root|numberField|*|css:input-group|57|78|Optional grouped NumberField; donor chrome suppressed, ink and controls remain.
inputGroup|root|select|*|css:input-group|57|78|Optional grouped native Select; outer field chrome suppressed, picker still floats.
inputGroup|root|button|*|css:input-group|80|92|Optional grouped action Button; chrome suppression follows pinned group rule.
indicatorAnchor|indicator|indicator|*|css:indicator|57|66|Positioned semantic Indicator; same-plane attachment with overlap ring, not a lifted popover.
indicatorAnchor|indicator|presence|*|css:indicator|57|66|Alternative Presence child at same anchor, not simultaneous mandatory status.
indicatorAnchor|root|tabs|tab,label,icon,selected-mark|css:indicator|77|77|Optional Tab as anchor content; layout rule does not add a new surface.
panel|row-controls|boxField|*|css:box-field|36|36|Optional property recipe; label/control roles remain separate.
panel|row-controls|field|*|css:field|76|107|Optional horizontal form row; field label and child control retain roles.
panel|row-controls|switch|*|css:field|107|109|Optional horizontal switch in inspector row.
field|root|textarea|*|css:field|91|97|Optional multiline field child; arbitrary alternative inputs resolve to their own family map.
menu|shortcut|kbd|*|css:kbd|90|93|Quiet keycaps in menu shortcut slot; no extra raised plate.
tooltip|root|kbd|*|css:kbd|110|121|On-color tooltip keys; no change to tooltip surface depth.
button|label|kbd|*|css:kbd|134|147|Optional shortcut keycap inside Button; concentric corner, not an extra interactive control.
kbdGroup|root|kbd|*|primitives|2165|2171|Optional sequence of keycaps inside a layout-only group.
nav|actions|button|*|css:nav|278|287|Optional row actions; each Button is independent of row state plate.
tabs|list|indicatorAnchor|root,indicator|css:navigation|32|32|Optional tab with attached status; do not recurse the anchor's Tab-content recipe again.
table|head-cell|button|*|css:navigation|213|216|Optional sort button; flush to header cell, not a raised row.
card|header-action|button|*|css:surface|314|315|Optional child Button rather than directly interactive header-action slot.
card|footer|toolbar|*|css:surface|481|485|Optional footer toolbar; plain toolbar remains layout-only.
alert|actions|badge|*|css:surface|691|696|Optional banner status Badge, not a command button.
popover|root|calendar|*|css:surface|1020|1020|Optional sole Calendar child; variant determines whether nested shell is omitted.
popover|header|button|*|css:surface|1061|1080|Optional header action Button owns plate and glyph.
toolbar|root|select|*|css:toolbar|45|47|Optional native field control in toolbar; picker remains floating.
toolbar|group|segmented|*|css:toolbar|59|62|Documented one-of-many toolbar composition; selected segment retains its own lift.
toolbar|group|splitButton|*|css:toolbar|59|62|Documented ghost split command; its menu floats relative to host.
treeView|actions|button|*|css:tree-view|89|113|Optional trailing row commands; hover wash remains legible over selected row plate.
fileUpload|action|link|root|FileUpload|77|82|Co-classed link action text.
fileUploadItem|progress|progress|*|FileUpload|148|151|Uploading only; Progress owns track and semantic fill.
fileUploadItem|actions|button|*|FileUpload|140|145|Optional retry/remove Button children.
toggleGroup|root|button|*|ToggleGroup|131|145|ToggleGroupItem renders Button; selected state retained.
toggleGroup|root|buttonGroup|root,join|ToggleGroup|66|76|Joined presentation co-classes ButtonGroup; do not paint twice.
meter|track|progress|*|Meter|43|48|Co-classed Progress track and bar encode the measured value.
searchField|root|input|*|SearchField|80|109|Input owns field shell, value, icon and action receiver.
searchField|shortcut|kbd|*|SearchField|110|110|Optional Kbd child; preserve current quiet/context recipe.
shortcutList|keys|kbd|*|ShortcutList|54|60|One keycap template per shortcut chord.
dateRangePicker|root|datePicker|*|DateRangePicker|100|127|Shared date trigger/panel/footer classes; use range Calendar below.
dateRangePicker|root|calendar|*|DateRangePicker|119|122|Plain range calendar inside acquired Popover shell.
dateRangePicker|preset|menu|item,text,check|DateRangePicker|108|117|Co-classed Menu row; row-plate owns state.
zoomControl|root|button|*|ZoomControl|73|75|Co-classed Button trigger.
zoomControl|menu|menu|*|ZoomControl|72|90|Menu shell, entries and separators.
zoomControl|field|input|*|ZoomControl|77|81|Editable zoom Input child.
boardColumn|count|badge|*|Board|43|43|Badge paints the count; co-classed slot does not add paint.
boardColumn|cards|boardCard|*|Board|46|46|Supplied cards instantiate the BoardCard contract.
board|root|boardColumn|*|Board|12|13|Consumer children instantiate BoardColumn; host remains layout-only.
editableText|preview|tooltip|*|EditableText|105|105|Optional hint Tooltip floats relative to host, not to text baseline.
toggletip|surface|tooltip|*|Toggletip|51|51|Shared Tooltip CSS surface; interaction is Toggletip.
pagination|step|button|*|Pagination|90|106|Previous/next controls co-class Button, with glyph and optional label.
menu|root|scrollArea|*|primitives|1210|1215|Anchored Menu renders ScrollArea; no extra shell.
panel|body|scrollArea|*|primitives|577|577|Panel body scroll receiver.
customSelect|listbox|scrollArea|*|CustomSelect|236|242|Listbox uses ScrollArea; focus remains on options.
tagPicker|listbox|scrollArea|*|TagPicker|210|213|Listbox uses ScrollArea.
commandPalette|list|scrollArea|*|CommandPalette|192|196|Result list uses ScrollArea; active descendant focus remains on row.
"""

BINDINGS += """
combobox|listbox|scrollArea|*|Combobox|269|274|Current listbox uses ScrollArea; focus remains active-descendant driven.
drawer|body|scrollArea|*|Drawer|88|88|Current Drawer body uses ScrollArea.
"""
