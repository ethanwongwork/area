"""Authored, source-linked observations for run 2. Run with Python's standard library."""
from pathlib import Path
import json,re,subprocess
from functools import lru_cache
ROOT=Path(__file__).parent
SHA='7dae828e7af1daf9d26b663d34335121156606f7'
DATE='2026-09-28'
SYSTEMS={
'U':('Untitled UI','https://www.untitledui.com/react/components/','https://www.untitledui.com/react/components'),
'S':('shadcn/ui','https://ui.shadcn.com/docs/components/','https://ui.shadcn.com/docs/components'),
'R':('Radix Themes','https://www.radix-ui.com/themes/docs/components/','https://www.radix-ui.com/themes/docs/overview/getting-started'),
'B':('Base UI','https://base-ui.com/react/components/','https://base-ui.com/react/overview/quick-start'),
'A':('React Aria / Spectrum 2','https://react-spectrum.adobe.com/','https://react-spectrum.adobe.com/'),
'F':('Fluent 2','https://fluent2.microsoft.design/components/web/react/core/','https://fluent2.microsoft.design/components/web/react'),
'P':('Primer','https://primer.style/product/components/','https://primer.style/product/components/'),
'C':('Carbon','https://carbondesignsystem.com/components/','https://carbondesignsystem.com/components/overview/components/'),
'M':('Material 3','https://developer.android.com/develop/ui/compose/components/','https://m3.material.io/components'),
'N':('Mantine','https://mantine.dev/core/','https://mantine.dev/core/package/'),
'D':('Ant Design','https://ant.design/components/','https://ant.design/components/overview/'),
'K':('Chakra/Ark','https://chakra-ui.com/docs/components/','https://chakra-ui.com/docs/components/concepts/overview'),
'T':('Atlassian','https://atlassian.design/components/','https://atlassian.design/components'),
'Q':('Polaris','https://shopify.dev/docs/api/app-home/latest/web-components/','https://shopify.dev/docs/api/app-home/latest/web-components'),
'G':('GOV.UK','https://design-system.service.gov.uk/components/','https://design-system.service.gov.uk/components/'),
'H':('Apple HIG','https://developer.apple.com/design/human-interface-guidelines/','https://developer.apple.com/design/human-interface-guidelines/components')}
DATA={}
def R(f,sys,page,axes='',structures='',interactions='',kind='component'):
 url=page if page.startswith('https:') else SYSTEMS[sys][1]+page
 obs=DATA.setdefault(f,[])
 for field,text in [('Variant axes',axes),('Structural alternatives',structures),('Interaction patterns',interactions)]:
  if not text:continue
  for part in text.split(';'):
   if field=='Variant axes':
    axis,values=part.split('=',1)
    for value in values.split(','):obs.append(dict(system=sys,url=url,section=field,axis=axis,value=value,kind=kind))
   else:
    obs.append(dict(system=sys,url=url,section=field,axis='structure' if field=='Structural alternatives' else 'interaction',value=part,kind=kind))
# Menu
R('menu','U','dropdowns','placement=top,bottom,left,right;state=disabled,selected','icons;shortcuts;groups','single-selection;arrow-navigation;escape-dismiss;typeahead')
R('menu','S','dropdown-menu','item-tone=default,destructive;state=disabled,checked','icons;shortcuts;groups;submenus;checkbox-items;radio-items','arrow-navigation;escape-dismiss')
R('menu','R','dropdown-menu','treatment=solid,soft;size=1,2;contrast=normal,high;state=disabled,checked','shortcuts;groups;submenus;checkbox-items;radio-items','arrow-navigation;escape-dismiss')
R('menu','B','menu','modal=true,false;state=disabled,highlighted,checked','groups;submenus;checkbox-items;radio-items;detached-triggers','typeahead;arrow-navigation;escape-dismiss;hover-open')
R('menu','A','Menu','size=S,M,L,XL;selection=none,single,multiple;state=disabled','icons;descriptions;shortcuts;groups;submenus;checkbox-items;radio-items','typeahead;arrow-navigation;async-loading;context-trigger;long-press')
R('menu','F','menu/usage','','icons;groups;submenus;checkbox-items;radio-items','arrow-navigation')
R('menu','P','action-menu/','size=small,medium,large;state=disabled','icons;descriptions;groups','single-selection;multiple-selection')
R('menu','C','menu/usage/','','icons;shortcuts;groups;submenus;checkbox-items;radio-items','arrow-navigation')
R('menu','M','menu','state=disabled','icons;groups;scrollable-popup','outside-dismiss')
R('menu','N','menu','trigger=click,hover,click-hover;state=disabled','icons;shortcuts;groups;submenus','arrow-navigation;escape-dismiss;outside-dismiss')
R('menu','D','menu','orientation=horizontal,vertical,inline;theme=light,dark;state=disabled,danger','icons;groups;submenus;overflow-menu;collapsed-rail','single-selection;multiple-selection;hover-open;click-open')
R('menu','K','menu','size=sm,md;variant=subtle,solid;state=disabled','icons;shortcuts;groups;submenus;checkbox-items;radio-items','typeahead;arrow-navigation;context-trigger')
R('menu','T','dropdown-menu/examples','appearance=default,tall;spacing=cozy,compact;state=disabled','groups;checkbox-items;radio-items;custom-trigger','arrow-navigation;escape-dismiss')
R('menu','Q','actions/menu','state=disabled','groups;links;custom-trigger','keyboard-navigation')
R('menu','H','menus','','icons;groups;submenus;checkbox-items','keyboard-shortcuts',kind='guidance')
# Navigation
R('nav','U','sidebar-navigations','','sidebar;groups;icons;nested-items;trailing-content',kind='example')
R('nav','S','sidebar','side=left,right;variant=sidebar,floating,inset;collapsible=offcanvas,icon,none','sidebar;groups;icons;nested-items;row-actions;collapsed-rail','collapse-expand;keyboard-shortcut')
R('nav','R','tab-nav','size=1,2;contrast=normal,high','horizontal-links','current-page')
R('nav','B','navigation-menu','orientation=horizontal,vertical','horizontal-links;nested-items;mega-menu','keyboard-navigation;hover-open;click-open')
R('nav','A','https://react-aria.adobe.com/ListBox','selection=none,single,multiple;orientation=horizontal,vertical','links;icons;descriptions','keyboard-navigation',kind='primitive')
R('nav','F','nav/usage','layout=overlay,inline','sidebar;groups;icons;nested-items;row-actions','collapse-expand;current-page')
R('nav','P','nav-list/','','sidebar;groups;icons;nested-items;trailing-content','current-page;collapse-expand')
R('nav','C','UI-shell-left-panel/usage/','','sidebar;nested-items;icons','collapse-expand;current-page')
R('nav','M','drawer','layout=standard,modal','sidebar;groups;icons','swipe-dismiss;collapse-expand')
R('nav','N','nav-link','variant=filled,light,subtle;state=active,disabled','icons;nested-items;descriptions;trailing-content','collapse-expand')
R('nav','D','menu','orientation=horizontal,vertical,inline;theme=light,dark','horizontal-links;sidebar;nested-items;collapsed-rail;overflow-menu','collapse-expand')
R('nav','T','navigation-system/examples','','sidebar;horizontal-links',kind='guidance')
R('nav','Q','https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components/app-nav','','sidebar;responsive-dropdown','current-page',kind='platform-component')
R('nav','G','service-navigation/','','horizontal-links;responsive-disclosure','current-page;collapse-expand')
R('nav','H','sidebars','','sidebar;groups;nested-items;icons','collapse-expand',kind='guidance')
# Numeric entry
R('number-field','U','inputs','size=sm,md;state=disabled,invalid','steppers-horizontal;steppers-stacked;prefix-suffix',kind='example')
R('number-field','B','number-field','state=disabled,read-only,invalid;direction=horizontal,vertical','steppers-horizontal;scrub-handle;prefix-suffix','keyboard-step;min-max-step;locale-format;wheel-step;scrub;change-and-commit')
R('number-field','A','NumberField','size=S,M,L,XL;label-position=top,side;state=disabled,read-only,invalid','steppers;hide-steppers;description;contextual-help','keyboard-step;min-max-step;locale-format;wheel-step')
R('number-field','C','number-input/usage/','size=sm,md,lg;style=default,fluid;state=disabled,read-only,invalid,warning,skeleton','steppers;label-above;label-inside;helper-error;ai-label','keyboard-step;min-max-step')
R('number-field','N','number-input','variant=default,filled,unstyled;size=xs,sm,md,lg,xl;state=disabled,error','steppers-stacked;hide-steppers;prefix-suffix','keyboard-step;min-max-step;decimal-format;clamp-policy;hold-step')
R('number-field','D','input-number','variant=outlined,borderless,filled,underlined;size=small,medium,large;state=disabled,read-only,error,warning','steppers;hide-steppers;prefix-suffix','keyboard-step;min-max-step;decimal-format;wheel-step;change-on-blur')
R('number-field','K','number-input','variant=outline,subtle,flushed;size=xs,sm,md,lg;state=disabled,read-only,invalid','steppers-stacked;steppers-horizontal;scrub-handle','keyboard-step;min-max-step;locale-format;wheel-step;scrub')
R('number-field','Q','forms/number-field','label-visibility=visible,exclusive;state=disabled,read-only,error','prefix-suffix;helper-error','min-max-step;change-and-commit')
R('number-field','H','steppers','','steppers','increment-decrement',kind='guidance')
# Panel / inspector, adjacent layout primitives are not counted as complete inspectors.
R('panel','S','resizable','orientation=horizontal,vertical','resize-handle;split-panes','pointer-resize;keyboard-resize',kind='primitive')
R('panel','P','split-page-layout/','','sidebar;split-panes;header;footer',kind='primitive')
R('panel','N','splitter','orientation=horizontal,vertical','split-panes;resize-handle','pointer-resize;collapse-expand',kind='primitive')
R('panel','D','splitter','orientation=horizontal,vertical','split-panes;resize-handle','pointer-resize;collapse-expand;lazy-resize;double-click-reset',kind='primitive')
R('panel','K','splitter','orientation=horizontal,vertical','split-panes;resize-handle','pointer-resize;keyboard-resize;collapse-expand',kind='primitive')
R('panel','T','panel/examples','','header;footer;resizable-panel','pointer-resize;collapse-expand')
R('panel','Q','layout-and-structure/section','','header;row-actions;sections',kind='primitive')
R('panel','H','split-views','','split-panes;resizable-panel','pointer-resize;collapse-expand',kind='guidance')
# Popover
R('popover','S','popover','side=top,right,bottom,left','title-description;fields','click-open;escape-dismiss;outside-dismiss;focus-return')
R('popover','R','popover','size=1,2,3,4','title-description;fields;close-button','click-open;escape-dismiss;outside-dismiss')
R('popover','B','popover','modal=true,false,trap-focus;side=top,right,bottom,left','arrow;title-description;close-button;detached-triggers','click-open;hover-open;escape-dismiss;outside-dismiss;collision-handling;focus-return')
R('popover','A','Popover','size=S,M,L;placement=top,bottom,left,right','arrow;hide-arrow;title-description;fields','escape-dismiss;outside-dismiss;collision-handling;focus-return')
R('popover','F','popover/usage','','arrow;title-description;fields','click-open;outside-dismiss')
R('popover','P','popover/','','title-description;close-button',kind='component')
R('popover','C','popover/usage/','tip=none,caret','arrow;hide-arrow;header;footer;scrollable-body','collision-handling')
R('popover','N','popover','position=top,bottom,left,right','arrow;fields;close-button','click-open;escape-dismiss;outside-dismiss;focus-trap;collision-handling')
R('popover','D','popover','trigger=hover,focus,click,contextMenu;placement=top,topLeft,topRight,bottom,bottomLeft,bottomRight,left,leftTop,leftBottom,right,rightTop,rightBottom','arrow;title-description','collision-handling;controlled-open')
R('popover','K','popover','size=xs,sm,md,lg;modal=true,false','arrow;header;body;footer;close-button','click-open;escape-dismiss;outside-dismiss;focus-return')
R('popover','T','popup/examples','appearance=default,tooltip;placement=top,bottom,left,right','custom-trigger','click-open;escape-dismiss;outside-dismiss;focus-trap')
R('popover','Q','overlays/popover','','fields;custom-trigger','click-open;escape-dismiss;outside-dismiss')
R('popover','H','popovers','','arrow;close-button','outside-dismiss;adaptive-presentation',kind='guidance')
# Radio
R('radio','U','radio-buttons','state=disabled,checked','label;description','single-selection')
R('radio','U','radio-groups','','choice-cards;icons;rich-options',kind='example')
R('radio','S','radio-group','state=disabled,invalid','label;description;choice-cards','single-selection;arrow-navigation')
R('radio','R','radio-group','variant=surface,classic,soft;size=1,2,3;contrast=normal,high;state=disabled','label','single-selection')
R('radio','R','radio-cards','variant=surface,classic;size=1,2,3','choice-cards;rich-options','single-selection')
R('radio','B','radio-group','state=disabled,read-only','label','single-selection;arrow-navigation')
R('radio','A','RadioGroup','size=S,M,L,XL;orientation=horizontal,vertical;emphasis=default,emphasized;state=disabled,read-only,invalid','label;description;contextual-help','single-selection;arrow-navigation')
R('radio','F','radiogroup/usage','orientation=horizontal,vertical','label-beside;label-below','single-selection;arrow-navigation')
R('radio','P','radio-group/','orientation=horizontal,vertical','label;description','single-selection')
R('radio','C','radio-button/usage/','orientation=horizontal,vertical;state=disabled,read-only,invalid,warning','label;helper-error;ai-label','single-selection')
R('radio','M','radio-button','state=checked,disabled','label','single-selection')
R('radio','N','radio','variant=filled,outline;size=xs,sm,md,lg,xl;state=disabled,error','label;description;choice-cards','single-selection')
R('radio','D','radio','size=small,medium,large;option-type=default,button;button-style=outline,solid;state=disabled','label;button-options','single-selection')
R('radio','K','radio','variant=outline,subtle,solid;size=xs,sm,md,lg;orientation=horizontal,vertical;state=disabled,read-only,invalid','label;description','single-selection;arrow-navigation')
R('radio','K','radio-card','variant=surface,subtle,outline,solid;size=sm,md,lg;orientation=horizontal,vertical;indicator-placement=start,end,inside','choice-cards;rich-options;hide-indicator','single-selection')
R('radio','T','radio/examples','state=disabled,invalid','label','single-selection')
R('radio','Q','forms/choice-list','state=disabled,error','label;description;conditional-content','single-selection')
R('radio','G','radios/','size=default,small;orientation=vertical,horizontal;state=error,disabled','label;description;conditional-content;or-divider','single-selection')
R('radio','H','toggles','','radio-options','single-selection',kind='guidance')
# Segmented
R('segmented','U','button-groups','state=disabled,selected','icons;text-options','single-selection;multiple-selection',kind='example')
R('segmented','S','toggle-group','variant=default,outline;size=sm,default,lg;orientation=horizontal,vertical;state=disabled','icons;text-options','single-selection;multiple-selection',kind='primitive')
R('segmented','R','segmented-control','variant=surface,classic;size=1,2,3;radius=none,small,medium,large,full','text-options','single-selection')
R('segmented','B','toggle-group','orientation=horizontal,vertical;state=disabled','icons;text-options','single-selection;multiple-selection;roving-focus',kind='primitive')
R('segmented','A','SegmentedControl','state=disabled','text-options;equal-width','single-selection;arrow-navigation')
R('segmented','C','content-switcher/usage/','size=sm,md,lg;state=disabled','icons;text-options;equal-width','single-selection')
R('segmented','M','segmented-button','state=disabled,selected','icons;text-options;joined-outline','single-selection;multiple-selection')
R('segmented','N','segmented-control','size=xs,sm,md,lg,xl;orientation=horizontal,vertical','icons;text-options;equal-width','single-selection;animated-indicator')
R('segmented','D','segmented','size=small,middle,large;shape=default,round;state=disabled','icons;text-options;equal-width;rich-options','single-selection')
R('segmented','K','segmented-control','size=xs,sm,md,lg;orientation=horizontal,vertical;state=disabled,read-only','icons;text-options','single-selection')
R('segmented','H','segmented-controls','','icons;text-options;equal-width','single-selection;multiple-selection',kind='guidance')
# Select: searchable/multiple observations are kept explicit as adjacent jobs.
R('select','U','select','size=sm,md,lg;state=disabled','custom-listbox;icons;avatars;groups','single-selection;keyboard-navigation')
R('select','S','select','size=sm,default;state=disabled,invalid','custom-listbox;groups;scrollable-popup','single-selection;typeahead')
R('select','S','native-select','size=sm,default;state=disabled,invalid','native-picker;groups','single-selection;native-keyboard')
R('select','R','select','trigger-variant=classic,surface,soft,ghost;popup-variant=solid,soft;size=1,2,3;radius=none,small,medium,large,full;contrast=normal,high','custom-listbox;groups;inline-trigger;selected-item-alignment','single-selection;typeahead')
R('select','B','select','state=disabled,read-only,invalid','custom-listbox;groups;selected-item-alignment','single-selection;multiple-selection;typeahead;touch-placement')
R('select','A','Picker','size=S,M,L,XL;label-position=top,side;quiet=false,true;selection=single,multiple;state=disabled,invalid','custom-listbox;icons;descriptions;groups;inline-trigger','single-selection;multiple-selection;async-loading;typeahead')
R('select','P','select/','size=small,medium,large;state=disabled,invalid','native-picker;description','single-selection;native-keyboard')
R('select','C','select/usage/','style=default,inline;size=sm,md,lg;state=disabled,read-only,invalid,warning','native-picker;label;helper-error;ai-label','single-selection;native-keyboard')
R('select','N','select','variant=default,filled,unstyled;size=xs,sm,md,lg,xl;state=disabled,error,loading','custom-listbox;groups;icons;clear-button','single-selection;search-filter;deselect;async-loading')
R('select','N','native-select','variant=default,filled,unstyled;size=xs,sm,md,lg,xl;state=disabled,error,loading','native-picker;groups;icons','single-selection;native-keyboard')
R('select','D','select','variant=outlined,borderless,filled,underlined;size=small,middle,large;mode=single,multiple,tags;state=disabled,error,warning,loading','custom-listbox;groups;icons;clear-button;tag-values','search-filter;multiple-selection;create-option;virtualization')
R('select','K','select','variant=outline,subtle,ghost;size=xs,sm,md,lg;state=disabled,invalid','custom-listbox;groups;icons;clear-button','single-selection;multiple-selection;async-loading;typeahead')
R('select','K','native-select','variant=outline,subtle,plain,ghost;size=xs,sm,md,lg,xl;state=disabled,invalid','native-picker;groups','single-selection;native-keyboard')
R('select','T','select/examples','state=disabled,invalid,loading','custom-listbox;groups;clear-button;tag-values','single-selection;multiple-selection;search-filter')
R('select','Q','forms/select','state=disabled,error;label-visibility=visible,exclusive','groups;description','single-selection')
R('select','G','select/','state=disabled,error','native-picker;label;description','single-selection;native-keyboard')
R('select','H','pickers','','menu-picker;wheel-picker;segmented-picker','single-selection',kind='guidance')
# Slider
R('slider','U','sliders','','single-thumb;range-thumbs;value-label','pointer-drag')
R('slider','S','slider','orientation=horizontal,vertical;state=disabled','single-thumb;range-thumbs','pointer-drag;keyboard-step')
R('slider','R','slider','variant=surface,classic,soft;size=1,2,3;radius=none,small,medium,large,full;contrast=normal,high','single-thumb;range-thumbs','pointer-drag;keyboard-step')
R('slider','B','slider','orientation=horizontal,vertical;thumb-alignment=center,edge,edge-client-only;collision=push,swap,none;state=disabled','single-thumb;range-thumbs','pointer-drag;keyboard-step;change-and-commit;min-max-step')
R('slider','A','Slider','size=S,M,L,XL;track-style=thin,thick;thumb-style=default,precise;label-position=top,side;emphasis=default,emphasized;state=disabled','single-thumb;range-thumbs;value-label','pointer-drag;keyboard-step;locale-format')
R('slider','F','slider/usage','orientation=horizontal,vertical','single-thumb;step-marks;value-tooltip','pointer-drag;keyboard-step;track-click')
R('slider','C','slider/usage/','state=disabled,read-only,error,warning,skeleton','single-thumb;range-thumbs;number-input;min-max-labels','pointer-drag;keyboard-step')
R('slider','M','slider','state=disabled','single-thumb;range-thumbs;step-marks','pointer-drag;min-max-step')
R('slider','N','slider','orientation=horizontal,vertical;size=xs,sm,md,lg,xl;state=disabled','single-thumb;range-thumbs;step-marks;value-tooltip;thumb-icon','pointer-drag;keyboard-step;change-and-commit;marks-only;custom-domain')
R('slider','D','slider','orientation=horizontal,vertical;state=disabled;tooltip=auto,always,never','single-thumb;range-thumbs;step-marks;value-tooltip','pointer-drag;keyboard-step;editable-thumbs;draggable-range;reverse')
R('slider','K','slider','variant=outline,solid;size=sm,md,lg;orientation=horizontal,vertical;collision=push,swap,none;state=disabled','single-thumb;range-thumbs;step-marks;value-tooltip','pointer-drag;keyboard-step;change-and-commit')
R('slider','T','range/examples','state=disabled','single-thumb','pointer-drag;min-max-step')
R('slider','H','sliders','','single-thumb;step-marks;min-max-labels','pointer-drag;continuous-or-discrete',kind='guidance')
# Switch
R('switch','U','toggles','track=default,slim;state=checked,disabled','label;description','toggle')
R('switch','S','switch','size=default,sm;state=disabled','label;description','toggle')
R('switch','R','switch','variant=surface,classic,soft;size=1,2,3;radius=none,small,medium,large,full;contrast=normal,high;state=disabled','label','toggle')
R('switch','B','switch','state=disabled,read-only','label','toggle')
R('switch','A','Switch','size=S,M,L,XL;emphasis=default,emphasized;state=disabled,read-only','label;description','toggle')
R('switch','F','switch/usage','label-position=above,before,after','label;thumb-icon','toggle')
R('switch','P','toggle-switch/','size=small,medium;state=disabled,loading','label;status-label','toggle')
R('switch','C','toggle/usage/','size=default,small;state=disabled,read-only','label;status-label','toggle')
R('switch','M','switch','state=checked,disabled','thumb-icon','toggle;thumb-drag')
R('switch','N','switch','size=xs,sm,md,lg,xl;label-position=left,right;state=disabled,error','label;description;track-label;thumb-icon','toggle;group-selection')
R('switch','D','switch','size=default,small;state=disabled,loading','track-label;thumb-icon','toggle')
R('switch','K','switch','variant=solid,raised;size=xs,sm,md,lg;state=disabled,read-only,invalid','label;thumb-icon;track-label','toggle')
R('switch','T','toggle/examples','size=regular,large;state=disabled','thumb-icon','toggle')
R('switch','Q','forms/switch','state=disabled;label-visibility=visible,exclusive','label','toggle')
R('switch','H','toggles','','switch;checkbox;toggle-button','toggle',kind='guidance')
# Tabs
R('tabs','U','tabs','treatment=button-brand,button-gray,button-border,button-minimal,underline,line;size=sm,md;orientation=horizontal,vertical','icons;counts;equal-width','single-selection;arrow-navigation')
R('tabs','S','tabs','variant=default,line;orientation=horizontal,vertical;state=disabled','icons','single-selection;arrow-navigation')
R('tabs','R','tabs','size=1,2;contrast=normal,high','underline','single-selection;arrow-navigation')
R('tabs','B','tabs','orientation=horizontal,vertical;state=disabled','indicator','automatic-activation;manual-activation;roving-focus')
R('tabs','A','Tabs','orientation=horizontal,vertical;density=compact,regular;state=disabled','icons;overflow-menu','automatic-activation;manual-activation;arrow-navigation')
R('tabs','F','tablist/usage','orientation=horizontal,vertical','icons;icon-only;overflow-menu','single-selection;arrow-navigation')
R('tabs','P','underline-nav/','','underline;icons;counts;overflow-menu','current-page',kind='adjacent')
R('tabs','C','tabs/usage/','treatment=line,contained;orientation=horizontal,vertical','icons;secondary-label;scroll-buttons;equal-width','single-selection;arrow-navigation')
R('tabs','M','tabs','hierarchy=primary,secondary','icons;underline','single-selection')
R('tabs','N','tabs','variant=default,outline,pills,none;orientation=horizontal,vertical;state=disabled','icons;trailing-content;equal-width','automatic-activation;manual-activation;deactivate;lazy-panels')
R('tabs','D','tabs','type=line,card,editable-card;size=small,middle,large;position=top,right,bottom,left','icons;counts;overflow-menu;close-button;add-button','single-selection;add-remove;lazy-panels')
R('tabs','K','tabs','variant=line,subtle,enclosed,outline,plain;size=sm,md,lg;orientation=horizontal,vertical;state=disabled','icons;indicator','automatic-activation;manual-activation;lazy-panels;add-remove')
R('tabs','T','tabs/examples','state=disabled','underline','single-selection')
R('tabs','G','tabs/','','underline;stacked-narrow-layout','hash-links;progressive-enhancement')
R('tabs','H','tab-views','','segmented-control;toolbar-style','single-selection',kind='guidance')
# Tree
R('tree-view','U','tree-views','size=sm,md;selection=single,multiple','icons;connector-lines;row-actions','collapse-expand;multiple-selection;drag-reorder')
R('tree-view','A','TreeView','selection=none,single,multiple;selection-style=highlight,checkbox;disabled-behavior=selection,all','icons;descriptions;row-actions;checkboxes','collapse-expand;multiple-selection;async-loading;drag-reorder;typeahead;arrow-navigation')
R('tree-view','F','tree/usage','selection=none,single,multiple','icons;avatars;row-actions;checkboxes','collapse-expand;multiple-selection;arrow-navigation')
R('tree-view','P','tree-view/','','icons;row-actions;trailing-content','collapse-expand;arrow-navigation;typeahead;async-loading')
R('tree-view','C','tree-view/usage/','size=xs,sm','icons','collapse-expand;arrow-navigation')
R('tree-view','N','tree','selection=single,multiple','icons;checkboxes;row-actions','collapse-expand;multiple-selection;async-loading;drag-reorder;search-filter;checkbox-cascade')
R('tree-view','D','tree','selection=single,multiple;state=disabled','icons;checkboxes;connector-lines;full-width-row','collapse-expand;multiple-selection;async-loading;drag-reorder;virtualization;checkbox-cascade;search-filter')
R('tree-view','K','tree-view','variant=subtle,solid;size=xs,sm,md;selection=single,multiple;state=disabled','icons;checkboxes','collapse-expand;multiple-selection;async-loading;typeahead;arrow-navigation')
R('tree-view','H','outline-views','','icons;columns','collapse-expand;keyboard-navigation',kind='guidance')
# Loading and completion
R('progress','U','progress-indicators','','linear;circular;semicircular;value-label','determinate')
R('progress','S','progress','','linear','determinate')
R('progress','R','progress','variant=classic,surface,soft;size=1,2,3;radius=none,small,medium,large,full;contrast=normal,high','linear','determinate;indeterminate;estimated-duration')
R('progress','B','progress','','linear;value-label','determinate;indeterminate')
R('progress','A','ProgressBar','size=S,M,L,XL;label-position=top,side;static-color=white,black,auto','linear;value-label','determinate;indeterminate;locale-format')
R('progress','A','ProgressCircle','size=S,M,L;static-color=white,black,auto','circular','determinate;indeterminate')
R('progress','F','progressbar/usage','','linear;label;helper-error','determinate;indeterminate;error;success')
R('progress','P','progress-bar/','size=small,default,large','linear;segmented-track','determinate')
R('progress','C','progress-bar/usage/','size=small,big;state=active,finished,error','linear;label;helper-error','determinate;indeterminate')
R('progress','M','progress','','linear;circular','determinate;indeterminate')
R('progress','N','progress','size=xs,sm,md,lg,xl','linear;segmented-track;value-label','determinate;striped;animated-stripes')
R('progress','N','ring-progress','','circular;segmented-track;center-label','determinate')
R('progress','D','progress','type=line,circle,dashboard;size=small,default;status=success,exception,normal,active;cap=round,butt,square','linear;circular;semicircular;segmented-track;value-label','determinate;gradient-fill;success-segment')
R('progress','K','progress','variant=outline,subtle;size=xs,sm,md,lg,xl;shape=square,rounded,full','linear;value-label','determinate;indeterminate;striped;animated-stripes')
R('progress','K','progress-circle','size=xs,sm,md,lg,xl','circular;center-label','determinate;indeterminate')
R('progress','T','progress-bar/examples','appearance=default,inverse;state=determinate,indeterminate','linear','determinate;indeterminate')
R('progress','Q','feedback-and-status-indicators/progress','tone=info,success,warning,critical,auto,neutral,caution','linear','determinate;indeterminate')
R('progress','H','progress-indicators','','linear;circular','determinate;indeterminate',kind='guidance')
R('spinner','U','loading-indicators','style=line-simple,line-spinner,dot-circle','label;inline','indeterminate')
R('spinner','S','spinner','','inline;label','indeterminate;custom-icon')
R('spinner','R','spinner','size=1,2,3','inline;replace-children','indeterminate;preserve-layout')
R('spinner','A','ProgressCircle','size=S,M,L;static-color=white,black,auto','circular','indeterminate')
R('spinner','F','spinner/usage','','label;region-centered','indeterminate;status-announcement')
R('spinner','P','spinner/','size=small,medium,large','circular','indeterminate')
R('spinner','C','loading/usage/','size=small,large','circular;overlay','indeterminate;block-interaction')
R('spinner','M','progress','','circular','indeterminate')
R('spinner','N','loader','type=oval,bars,dots;size=xs,sm,md,lg,xl','inline','indeterminate;custom-loader')
R('spinner','D','spin','size=small,default,large','label;overlay;fullscreen','indeterminate;delayed-display;determinate-percent')
R('spinner','K','spinner','size=inherit,xs,sm,md,lg,xl','label;overlay','indeterminate')
R('spinner','T','spinner/examples','size=xsmall,small,medium,large,xlarge;appearance=inherit,invert','inline','indeterminate;delayed-display')
R('spinner','Q','feedback-and-status-indicators/spinner','size=base,large,large-100','inline;region-centered','indeterminate;status-announcement')
R('spinner','H','progress-indicators','','circular','indeterminate',kind='guidance')
R('skeleton','S','skeleton','','text;circle;rectangle;card-composition','loading-placeholder')
R('skeleton','R','skeleton','','text;replace-children','loading-placeholder;preserve-layout;disable-children')
R('skeleton','A','Skeleton','','text;image;icon;replace-children','shimmer;disable-children')
R('skeleton','F','skeleton/usage','animation=wave,pulse','content-layout','loading-placeholder;synchronized-animation')
R('skeleton','P','skeleton-box/','','rectangle','loading-placeholder')
R('skeleton','N','skeleton','animation=on,off','circle;rectangle;replace-children','loading-placeholder;preserve-layout')
R('skeleton','D','skeleton','shape=circle,square,round;size=small,default,large','avatar;paragraph;title;button;input;image','pulse;loading-placeholder')
R('skeleton','K','skeleton','variant=pulse,shine,none','circle;text;replace-children','loading-placeholder;fade-in')
R('skeleton','T','skeleton/examples','shape=circle,rectangle','rectangle;circle','loading-placeholder')
# Rules
R('separator','U','content-dividers','','text-label;icon;button;avatar',kind='example')
R('separator','S','separator','orientation=horizontal,vertical','','semantic-or-decorative')
R('separator','R','separator','orientation=horizontal,vertical;size=1,2,3,4','','semantic-or-decorative')
R('separator','B','separator','orientation=horizontal,vertical','','semantic-separator')
R('separator','A','https://react-aria.adobe.com/Separator','orientation=horizontal,vertical','','semantic-separator',kind='primitive')
R('separator','F','divider/usage','inset=false,true','text-label;icon','semantic-or-decorative')
R('separator','M','divider','orientation=horizontal,vertical','inset','semantic-separator')
R('separator','N','divider','variant=solid,dashed,dotted;size=xs,sm,md,lg,xl;orientation=horizontal,vertical;label-position=left,center,right','text-label;icon','semantic-separator')
R('separator','D','divider','variant=solid,dashed,dotted;orientation=horizontal,vertical;title-placement=start,center,end','text-label','semantic-separator')
R('separator','K','separator','variant=solid,dashed,dotted;size=xs,sm,md,lg;orientation=horizontal,vertical','text-label','semantic-or-decorative')
R('separator','Q','layout-and-structure/divider','direction=inline,block;color=base,strong','','semantic-separator')
# Table: engine features are explicitly separated in proposed range.
R('table','U','tables','size=sm,md;state=empty,error,offline','header;footer;checkbox-column;avatars;row-actions','sort;row-selection;pagination',kind='example')
R('table','S','table','','header;footer;caption;horizontal-scroll','semantic-table')
R('table','S','data-table','','checkbox-column;pagination;column-menu','sort;row-selection;search-filter;column-visibility',kind='recipe')
R('table','R','table','variant=surface,ghost;size=1,2,3','header;row-header','semantic-table')
R('table','A','TableView','density=compact,regular,spacious;overflow=wrap,truncate;quiet=false,true;selection=none,single,multiple;selection-style=checkbox,highlight','checkbox-column;nested-rows;resizable-columns;row-actions','sort;row-selection;drag-reorder;async-loading;keyboard-grid')
R('table','P','data-table/','density=condensed,normal,relaxed','header;row-actions;pagination','sort;row-selection')
R('table','C','data-table/usage/','size=xs,sm,md,lg,xl','header;checkbox-column;radio-column;expandable-rows;batch-toolbar;pagination','sort;row-selection;search-filter')
R('table','N','table','variant=default,vertical;stripe=odd,even','header;footer;caption;horizontal-scroll;sticky-header;checkbox-column;column-borders','semantic-table;row-selection;sort;virtualization-recipe')
R('table','D','table','size=small,middle,large;state=loading','header;footer;expandable-rows;nested-rows;checkbox-column;radio-column;fixed-columns;sticky-header;summary;pagination','sort;row-selection;search-filter;virtualization;editable-cells-recipe;drag-reorder-recipe')
R('table','K','table','variant=line,outline;size=sm,md,lg;stripe=false,true','header;footer;caption;horizontal-scroll;sticky-header;fixed-columns;checkbox-column','semantic-table;row-selection')
R('table','T','dynamic-table/examples','state=loading,empty','pagination;row-actions','sort;drag-reorder')
R('table','Q','layout-and-structure/table','variant=auto,list;state=loading','responsive-list;pagination','semantic-table')
R('table','G','table/','','caption;row-header;numeric-cells','semantic-table')
R('table','H','lists-and-tables','','row-actions;columns','sort;row-selection',kind='guidance')
# Textarea
R('textarea','U','textareas','state=disabled,invalid','label;description;helper-error')
R('textarea','S','textarea','state=disabled,invalid','label;description')
R('textarea','R','text-area','variant=surface,classic,soft;size=1,2,3;radius=none,small,medium,large,full;resize=none,vertical,horizontal,both','placeholder','native-editing')
R('textarea','A','TextArea','size=S,M,L,XL;label-position=top,side;state=disabled,read-only,invalid','label;description;contextual-help','native-editing;validation')
R('textarea','F','textarea/usage','resize=none,vertical,horizontal,both','label;placeholder','native-editing')
R('textarea','P','textarea/','state=disabled,invalid','label;description','native-editing')
R('textarea','C','text-input/usage/','style=default,fluid;state=disabled,read-only,error,warning','label-above;label-inside;helper-error;character-count;ai-label','native-editing')
R('textarea','N','textarea','variant=default,filled,unstyled;size=xs,sm,md,lg,xl;resize=none,vertical,both;state=disabled,error,loading','label;description;left-right-sections','autosize;min-max-rows;native-editing')
R('textarea','D','input','variant=outlined,borderless,filled,underlined;state=disabled,error,warning','character-count;clear-button','autosize;min-max-rows;native-editing')
R('textarea','K','textarea','variant=outline,subtle,flushed;size=xs,sm,md,lg,xl;resize=none,vertical,horizontal,both;state=disabled,invalid','label;description','autosize;native-editing')
R('textarea','T','textarea/examples','appearance=standard,subtle,none;resize=auto,vertical,horizontal,smart;state=disabled,invalid','label','autosize;native-editing')
R('textarea','Q','forms/text-area','label-visibility=visible,exclusive;state=disabled,read-only,error','label;description','rows;max-length;native-editing')
R('textarea','G','textarea/','state=error,disabled','label;description','rows;native-editing')
R('textarea','G','character-count/','','character-count;word-count','limit-announcement')
R('textarea','H','text-views','','multiline-text','native-editing;selection;scrolling',kind='guidance')
# Toast
R('toast','U','notifications','icon=default,gray,brand,error','title-description;avatar;actions;close-button','dismiss',kind='example')
R('toast','S','toast','type=default,success,info,warning,error,loading','title-description;actions;close-button','queue;auto-dismiss;promise-state')
R('toast','B','toast','type=loading,success,error','title-description;actions;close-button;stack','queue;auto-dismiss;pause-on-hover-focus;swipe-dismiss;promise-state')
R('toast','A','Toast','tone=neutral,positive,negative,info','actions;close-button','queue;auto-dismiss;pause-on-hover-focus;persistent-actionable;focus-shortcut')
R('toast','F','toast/usage','intent=success,error,warning,info,progress','title-description;actions;close-button;progress-content','queue;auto-dismiss;persistent;pause-on-hover-focus')
R('toast','C','notification/usage/','status=error,info,success,warning;contrast=low,high','title-description;actions;close-button;timestamp','dismiss')
R('toast','M','snackbar','duration=short,long,indefinite','actions;close-button','queue;auto-dismiss')
R('toast','N','notification','state=loading','title-description;icon;close-button','swipe-dismiss')
R('toast','D','notification','type=success,info,warning,error;placement=topLeft,topRight,bottomLeft,bottomRight,top,bottom','title-description;actions;close-button;stack','queue;auto-dismiss;pause-on-hover;progress-timer')
R('toast','K','toast','type=info,warning,success,error,loading;placement=top-start,top,top-end,bottom-start,bottom,bottom-end','title-description;actions;close-button;stack','queue;auto-dismiss;pause-resume;promise-state')
R('toast','T','flag/examples','appearance=normal,bold','title-description;actions;close-button','queue;auto-dismiss')
# Toolbar / split action
R('toolbar','B','toolbar','orientation=horizontal,vertical;state=disabled','groups;separator;toggle-group;links;input','roving-focus;arrow-navigation')
R('toolbar','A','https://react-aria.adobe.com/Toolbar','orientation=horizontal,vertical','groups;toggle-group;links;input','roving-focus;arrow-navigation',kind='primitive')
R('toolbar','F','toolbar/usage','','groups;separator;overflow-menu;icons','responsive-overflow;arrow-navigation')
R('toolbar','P','action-bar/','','groups;separator;overflow-menu;icons','responsive-overflow')
R('toolbar','H','toolbars','','groups;icons;labels;overflow-menu;customizable-items','customize;responsive-overflow',kind='guidance')
R('split-button','S','button-group','orientation=horizontal,vertical','primary-action;menu-trigger;separator','two-tab-stops;menu-keyboard',kind='recipe')
R('split-button','D','dropdown','','primary-action;menu-trigger;icons','two-actions',kind='component')
# Conversation jobs: adjacent controls are recorded without pretending they ship the whole job.
R('message','U','messaging','','bubble;avatar;timestamp;attachments','conversation-layout',kind='example')
R('message','S','message','alignment=start,end','avatar;header;footer;action-row;sender-group;attachments','conversation-layout')
R('message','S','bubble','variant=default,secondary,muted,tinted,outline,ghost,destructive;alignment=start,end','bubble;unframed-prose;reactions;sender-group;collapsible-content','collapse-expand')
R('message','D','https://x.ant.design/components/bubble','variant=filled,outlined,shadow,borderless;placement=start,end;shape=default,round,corner;state=loading,updating,success,error,abort','bubble;unframed-prose;avatar;header;footer;action-row','streaming;typing-animation;auto-scroll')
R('message','T','comment/examples','','avatar;author;timestamp;action-row;nested-replies','comment-actions',kind='adjacent')
R('model-picker','U','dropdowns','','descriptions;icons','single-selection',kind='primitive')
R('model-picker','S','dropdown-menu','','radio-items;groups;icons','single-selection',kind='primitive')
R('model-picker','R','dropdown-menu','','radio-items;groups','single-selection',kind='primitive')
R('model-picker','B','menu','','radio-items;groups','single-selection',kind='primitive')
R('model-picker','A','Menu','','descriptions;icons;groups;radio-items','single-selection',kind='primitive')
R('model-picker','K','menu','','radio-items;groups','single-selection',kind='primitive')
R('prompt-suggestions','D','https://x.ant.design/components/prompts','orientation=horizontal,vertical;state=disabled','icons;description;wrap;groups','activate-prompt')
R('prompt-suggestions','S','bubble','variant=default,secondary,muted,tinted,outline,ghost,destructive','button-bubble','activate-prompt',kind='recipe')
R('property-list','A','https://react-aria.adobe.com/ListBox','orientation=horizontal,vertical;selection=none,single,multiple','drag-handle;drop-indicator;rich-rows','drag-reorder;keyboard-reorder;drop-announcement',kind='primitive')
R('property-list','T','pragmatic-drag-and-drop/examples','','drag-handle;drop-indicator','drag-reorder',kind='recipe')
R('property-list','T','pragmatic-drag-and-drop/accessibility-guidelines','','move-actions','keyboard-alternative;drop-announcement',kind='guidance')
R('scroll-to-latest','S','message-scroller','','floating-button;new-content-indicator','scroll-to-latest;pause-follow-on-user-intent;resume-follow;history-anchor;message-jump')
R('scroll-to-latest','D','float-button','shape=circle,square','floating-button','scroll-to-top',kind='adjacent')
# Tooltip
R('tooltip','U','tooltips','placement=top,bottom,left,right','arrow;description','hover-focus')
R('tooltip','S','tooltip','side=top,right,bottom,left','arrow','hover-focus;delay')
R('tooltip','R','tooltip','','text','hover-focus')
R('tooltip','B','tooltip','state=disabled','arrow;detached-triggers','hover-focus;delay;escape-dismiss;skip-touch')
R('tooltip','A','Tooltip','trigger=hover,focus;state=disabled','text','hover-focus;delay;escape-dismiss')
R('tooltip','F','tooltip/usage','','arrow;text','hover-focus;blur-dismiss')
R('tooltip','P','tooltip/','direction=n,s,e,w,ne,nw,se,sw','text','hover-focus')
R('tooltip','C','tooltip/usage/','','text;definition-term','hover-focus')
R('tooltip','M','tooltip','type=plain,rich','text;title-description;actions','hover-focus;long-press')
R('tooltip','N','tooltip','position=top,bottom,left,right;arrow-position=center,side,merge','arrow;multiline','hover-focus;delay;follow-pointer;group-delay')
R('tooltip','D','tooltip','trigger=hover,focus,click,contextMenu;placement=top,topLeft,topRight,bottom,bottomLeft,bottomRight,left,leftTop,leftBottom,right,rightTop,rightBottom','arrow','collision-handling;controlled-open')
R('tooltip','K','tooltip','state=disabled','arrow','hover-focus;delay;interactive-content')
R('tooltip','T','tooltip/examples','position=top,right,bottom,left,mouse','text','hover-focus;delay;follow-pointer')
R('tooltip','Q','typography-and-content/tooltip','','text;definition-term','hover-focus')
# API gaps filled from the public Fluent source, pinned before extraction.
FLUENT='https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/'
R('number-field','F',FLUENT+'react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts','appearance=outline,underline,filled-darker,filled-lighter;size=small,medium','steppers-stacked','keyboard-step;min-max-step;decimal-format;change-on-blur')
R('split-button','F',FLUENT+'react-button/library/src/components/SplitButton/SplitButton.types.ts','','primary-action;menu-trigger')
R('split-button','F',FLUENT+'react-button/library/src/components/Button/Button.types.ts','appearance=secondary,primary,outline,subtle,transparent;shape=rounded,circular,square;size=small,medium,large;state=disabled,disabled-focusable;icon-position=before,after','icons')
R('split-button','T','button/split-button/examples','appearance=default,primary','primary-action;menu-trigger;separator','two-actions')
R('table','F',FLUENT+'react-table/library/src/components/Table/Table.types.ts','size=extra-small,small,medium;native-elements=true,false','','sort;semantic-table')
R('select','F','select/usage/','','native-picker','single-selection;native-keyboard')
R('select','F','dropdown/usage/','','custom-listbox;checkbox-options','single-selection;multiple-selection;typeahead')
R('segmented','P','segmented-control/','size=small,medium','icons;text-options','single-selection')
R('separator','A','Divider','size=S,M,L','','semantic-separator')
R('toolbar','A','ActionButtonGroup','size=S,M,L,XL;density=regular,compact;orientation=horizontal,vertical','groups','single-selection;multiple-selection',kind='adjacent')
# Corrections after checking the live pages: do not infer undocumented props from neighbours.
def remove(f,sys,axis,values):
 DATA[f]=[o for o in DATA[f] if not(o['system']==sys and o['axis']==axis and o['value'] in values.split(','))]
remove('menu','P','size','small,medium,large')
remove('popover','T','appearance','default,tooltip')
remove('radio','P','orientation','horizontal,vertical')
remove('spinner','T','appearance','inherit,invert')
remove('skeleton','T','shape','circle,rectangle')
remove('table','P','density','condensed,normal,relaxed')
remove('radio','H','structure','radio-options')
remove('radio','H','interaction','single-selection')
# Preserve source terminology (API names differ across release lines).
for f in ['segmented','select','tabs','table']:
 for o in DATA[f]:
  if o['system']=='D' and o['axis']=='size' and o['value']=='middle':o['value']='medium'
for f in ['segmented','table']:
 for o in DATA[f]:
  if o['system']=='C' and o['axis']=='size':o['value']={'xs':'extra-small','sm':'small','md':'medium','lg':'large','xl':'extra-large'}.get(o['value'],o['value'])
# Source colour/radius values are foundation hooks, not new Area palette or density variants.
ANDROID='https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/'
R('split-button','M',ANDROID+'SplitButton.kt','appearance=filled,tonal,elevated,outlined;size=extra-small,small,medium,large,extra-large','primary-action;menu-trigger;icons','shape-animation',kind='experimental-component')
R('toolbar','M',ANDROID+'FloatingToolbar.kt','orientation=horizontal,vertical','floating-surface;leading-content;trailing-content;fab;scrollable-content','collapse-expand;scroll-responsive',kind='experimental-component')
R('textarea','M','https://developer.android.com/develop/ui/compose/text/user-input','variant=filled,outlined','label;placeholder','native-editing;min-max-rows')
R('toast','Q','https://shopify.dev/docs/api/app-home/latest/apis/user-interface-and-interactions/toast-api','tone=default,error','actions;close-button','auto-dismiss;programmatic-dismiss',kind='platform-component')
R('toast','N','https://mantine.dev/x/notifications/','position=top-left,top-center,top-right,bottom-left,bottom-center,bottom-right','stack','queue;auto-dismiss;pause-on-hover;update-toast')
R('table','P','data-table/','cell-padding=condensed,normal,spacious')
R('split-button','T','button/split-button/examples','spacing=default,compact')
R('toolbar','A','ActionButtonGroup','size=XS;quiet=false,true;static-color=white,black,auto','equal-width',kind='adjacent')
remove('toolbar','A','interaction','single-selection,multiple-selection')
remove('model-picker','U','structure','descriptions')
remove('prompt-suggestions','D','structure','groups')
# These behavior claims were not recoverable in the named public page. They are not counted.
UNCONFIRMED={
'menu':{'U':['typeahead'],'B':['typeahead'],'A':['async-loading'],'P':['groups'],'N':['outside-dismiss'],'T':['arrow-navigation']},
'popover':{'S':['outside-dismiss','focus-return'],'R':['outside-dismiss'],'A':['focus-return'],'P':['close-button'],'T':['outside-dismiss'],'Q':['escape-dismiss','outside-dismiss']},
'radio':{'S':['arrow-navigation'],'B':['arrow-navigation'],'A':['arrow-navigation'],'F':['arrow-navigation'],'K':['arrow-navigation']},
'segmented':{'S':['multiple-selection'],'A':['arrow-navigation']},
'select':{'S':['typeahead'],'R':['typeahead'],'K':['typeahead']},
 'tabs':{'S':['arrow-navigation'],'R':['arrow-navigation'],'F':['arrow-navigation'],'P':['overflow-menu']},
 'tree-view':{'U':['row-actions'],'F':['arrow-navigation'],'K':['arrow-navigation']},
 'table':{'U':['sort'],'N':['sort']},'toast':{'M':['queue'],'T':['queue']},'toolbar':{'F':['arrow-navigation']},'tooltip':{'A':['escape-dismiss']}}
for family,systems in UNCONFIRMED.items():
 for system,values in systems.items():DATA[family]=[o for o in DATA[family] if not(o['system']==system and o['value'] in values)]
# Preserve a smaller, literal support claim when API tables are unavailable.
remove('menu','P','state','disabled')
remove('skeleton','T','structure','circle')
# Aliases here describe meaning; they do not assert numeric equivalence between size systems.
AREA={
'menu':dict(yes='structure:icons structure:shortcuts structure:groups structure:descriptions structure:checkbox-items structure:radio-items interaction:arrow-navigation interaction:escape-dismiss interaction:typeahead interaction:keyboard-navigation state:disabled state:highlighted state:selected item-tone:destructive',partial='structure:submenus',note='Menu owns action rows and in-menu keys. A trigger enables native-popover anchoring, flip/shift, dismissal and focus return. Submenu keyboard is explicitly not implemented; a visual chevron or nested content does not establish it.'),
'message':dict(yes='structure:bubble structure:unframed-prose structure:action-row interaction:streaming alignment:start alignment:end',composition='structure:attachments',note='User bubble and assistant prose, named articles, action rows and streaming state are built. Rich content composes other components. Avatar/header/footer/reactions and sender grouping are not declared slots.'),
'model-picker':dict(yes='structure:descriptions structure:radio-items interaction:single-selection',note='Composer trigger opens a Menu of model radio items, with notes and a selected check. Opens on the current item; choosing closes and returns focus. No design-time axes in the manifest.'),
'nav':dict(yes='structure:sidebar structure:horizontal-links structure:groups structure:icons structure:trailing-content structure:row-actions interaction:current-page interaction:collapse-expand state:disabled orientation:horizontal orientation:vertical',composition='structure:nested-items',note='Vertical/horizontal destination links, neutral/accent selected paint, plate/marker, groups, counts, actions and expandable composition. Horizontal lists scroll. No responsive rail or mega-menu contract.'),
'number-field':dict(yes='structure:steppers structure:steppers-stacked structure:hide-steppers structure:scrub-handle structure:prefix-suffix interaction:keyboard-step interaction:min-max-step interaction:locale-format interaction:decimal-format interaction:scrub interaction:change-and-commit state:disabled state:read-only state:invalid state:warning appearance:outline variant:outline variant:soft',composition='structure:description structure:helper-error',note='Outline/soft; three tiers; units, optional steppers and letter/icon/grip scrubbing; mixed values; locale formatting; arithmetic parsing; fine/coarse stepping; commit/cancel. Horizontal flanking steppers and wheel/hold policies are not found in this spec.'),
'panel':dict(yes='structure:header structure:footer structure:sections structure:row-actions structure:resizable-panel structure:resize-handle interaction:pointer-resize interaction:keyboard-resize',partial='interaction:collapse-expand',composition='structure:sidebar',note='sm/md inspector, flush docking, bare bar, action column, sections and pinned footer. Start/end edge width resizing has pointer/keyboard bounds and cancellation. Collapsible sections exist; collapse-to-zero and height resizing are explicitly excluded. General split panes remain a different job.'),
'popover':dict(yes='structure:arrow structure:hide-arrow structure:header structure:body structure:footer structure:title-description structure:close-button interaction:click-open interaction:escape-dismiss interaction:outside-dismiss interaction:collision-handling interaction:focus-return side:top side:right side:bottom side:left placement:top placement:right placement:bottom placement:left',composition='structure:fields structure:scrollable-body',note='Four sides, optional arrow, header/body/footer/media. Trigger mode adds native nonmodal popover behavior; without a trigger it is a static surface. Modal focus trapping is not an established Popover option.'),
'progress':dict(yes='structure:linear interaction:determinate interaction:indeterminate',composition='structure:label structure:value-label',note='Linear determinate or indeterminate progress, sm/md/lg rail tiers, neutral/accent. Label and numeric output are composed outside the component. No circular, segmented or semantic error/success API.'),
'prompt-suggestions':dict(yes='structure:icons structure:wrap interaction:activate-prompt state:disabled',partial='structure:button-bubble',note='List is the default; chips are the second layout. List items have optional dismiss controls; the chip recipe has no dismiss. Activation is consumer-owned (fill or send). Descriptions and grouped suggestion cards are not declared.'),
'property-list':dict(yes='structure:drag-handle structure:drop-indicator interaction:drag-reorder interaction:keyboard-reorder interaction:drop-announcement interaction:keyboard-alternative',composition='structure:rich-rows structure:move-actions',note='Ordered flat properties with handle, value/actions, inactive state, pointer capture and Escape cancel. Keyboard arrows/Home/End move items while preserving focus and announcing position. Nesting and multi-selection are explicitly out of scope.'),
'radio':dict(yes='structure:choice-cards structure:icons structure:rich-options orientation:horizontal orientation:vertical state:disabled state:checked state:invalid structure:label structure:description interaction:single-selection interaction:arrow-navigation',composition='structure:helper-error',note='Native radio inputs and fieldset group; md/lg and neutral/accent. Radio and Checkbox both support variant=card and layout=row/tile; layout applies only with card. Group orientation is independently horizontal/vertical; leading visuals and captions are supported.'),
'scroll-to-latest':dict(yes='structure:floating-button interaction:scroll-to-latest shape:circle',note='Round outline button appears away from the end, is unfocusable when hidden, scrolls smoothly or instantly with reduced motion. Stream following, history anchoring and arbitrary-message navigation are not described.'),
'segmented':dict(yes='structure:icons structure:text-options structure:equal-width interaction:single-selection interaction:arrow-navigation interaction:roving-focus state:disabled state:selected orientation:horizontal',partial='orientation:vertical',note='One raised-track appearance; three sizes; fullWidth and iconOnly. Radio semantics with RTL-aware arrows, Home/End and disabled-item skipping. Multiple independent toggles belong to a separate semantic mode, not an interchangeable radio state.'),
'select':dict(yes='variant:outline variant:soft state:disabled state:invalid state:warning structure:native-picker structure:groups interaction:single-selection interaction:native-keyboard interaction:typeahead',composition='structure:label structure:description',partial='structure:custom-listbox',note='Native select, outline/soft, three tiers, fullWidth, optgroups and validation. appearance: base-select styles the native popup where supported; this is not a headless custom-listbox implementation. Search, multiple and rich options are explicitly excluded; borderless/ghost is a candidate.'),
'separator':dict(yes='orientation:horizontal orientation:vertical structure:inset interaction:semantic-separator',partial='interaction:semantic-or-decorative',note='Horizontal/vertical rule, spacing none/normal and optional inset. Always renders separator semantics in the documented API; no labeled, dashed or dotted variant.'),
'skeleton':dict(yes='animation:off animation:on variant:none interaction:shimmer interaction:disable-children structure:replace-children structure:multiline interaction:preserve-layout structure:text structure:circle structure:rectangle interaction:loading-placeholder',composition='structure:card-composition structure:content-layout',note='Shapes are block (default), text and circle. Boolean static disables shimmer; wrap preserves child layout and makes the placeholder subtree inert. Multiline text uses lines. Placeholders are aria-hidden; the host owns busy announcements.'),
'slider':dict(yes='orientation:horizontal orientation:vertical state:disabled structure:single-thumb structure:range-thumbs structure:step-marks structure:value-label interaction:pointer-drag interaction:keyboard-step interaction:min-max-step',composition='structure:number-input structure:min-max-labels',note='Native range-based slider; sm/md/lg, neutral/accent, inline/top label, vertical orientation, readout and marks. Range with inputs is documented as a composition; see the Area status on that option rather than inferring a general arbitrary-thumb engine.'),
'spinner':dict(yes='structure:circular structure:inline interaction:indeterminate interaction:status-announcement',composition='structure:label structure:region-centered',note='One rotating shape; sm/md/lg, neutral/accent. Labeled spinners announce status; unlabeled ones are decorative and the host announces busy state. Bars/dots and overlay ownership are not public variants.'),
'split-button':dict(yes='structure:primary-action structure:menu-trigger structure:icons structure:separator interaction:two-actions interaction:two-tab-stops interaction:menu-keyboard state:disabled appearance:outline',note='Manifest declares solid/soft/outline/ghost plus icon-only. Spec inherits Button sizes and tones, documents two tab stops and menu keys, but explicitly excludes ghost. Treat that disagreement as an open contract question, not a completed range decision.'),
'switch':dict(yes='state:disabled state:read-only state:loading state:checked structure:label structure:description interaction:toggle label-position:before label-position:after label-position:left label-position:right',composition='structure:status-label',note='sm/md/lg; label start/end; short/long track; neutral/accent/custom tone; fullWidth; disabled/read-only/loading. Track labels and icons in the thumb are not declared slots.'),
'table':dict(yes='structure:header structure:footer structure:caption structure:row-header structure:horizontal-scroll structure:column-borders structure:numeric-cells interaction:semantic-table stripe:odd stripe:even',composition='structure:checkbox-column structure:row-actions interaction:row-selection interaction:sort',note='Semantic table, sm/md/lg cell insets, interactive/striped/columnDividers and numeric/fit cells. Sorting, selection, empty and loading are compositions. No grid keyboard, resizing, editing or virtualization engine.'),
'tabs':dict(yes='orientation:horizontal orientation:vertical state:disabled structure:underline structure:indicator structure:icons structure:counts interaction:single-selection interaction:automatic-activation interaction:manual-activation interaction:arrow-navigation interaction:roving-focus',note='sm/md/lg underline with rounded indicator, optional track, both orientations, icons/counts, disabled and automatic/manual activation. Pill/enclosed treatments, overflow behavior and add/close contracts are not declared.'),
'textarea':dict(yes='variant:outline variant:soft resize:none resize:vertical resize:horizontal resize:both state:disabled state:read-only state:invalid state:warning structure:placeholder interaction:native-editing interaction:rows interaction:max-length',composition='structure:label structure:description structure:helper-error interaction:validation',note='Native textarea; outline/soft, sm/md/lg, all four resize policies, fullWidth, readonly/disabled and validation. Rows own height. No autosize or character counter API in the spec.'),
'toast':dict(yes='structure:title-description structure:actions structure:close-button interaction:dismiss',composition='interaction:programmatic-dismiss',note='Neutral/info/danger/warning/success surface with title, description, action and dismiss. role=status and atomic announcements. Placement, lifetime, stacking and focus return are consumer-owned; no global queue/timer.'),
'toolbar':dict(yes='orientation:horizontal orientation:vertical structure:groups structure:separator structure:icons interaction:roving-focus interaction:arrow-navigation',composition='structure:toggle-group structure:input structure:links structure:floating-surface',partial='structure:overflow-menu interaction:responsive-overflow',note='Plain/surface; sm/md/lg; horizontal/vertical; fullWidth; grouping, track composition and overflow disclosure. It uses native details with Buttons; it is not a menu and does not automatically move overflowing items. The spec explicitly disclaims Primer overflow parity.'),
'tooltip':dict(yes='side:top side:right side:bottom side:left placement:top placement:right placement:bottom placement:left structure:arrow structure:text interaction:hover-focus interaction:delay interaction:escape-dismiss interaction:blur-dismiss',composition='structure:description structure:multiline',note='Four sides, optional arrow, inverse text surface. Trigger adds delayed hover, immediate keyboard focus and dismissal. Noninteractive by contract; rich interactive help belongs to Popover, even when another system names it a tooltip.'),
'tree-view':dict(yes='structure:icons structure:checkboxes structure:row-actions structure:trailing-content interaction:collapse-expand interaction:multiple-selection interaction:arrow-navigation interaction:typeahead state:disabled',partial='selection:multiple',note='Navigation and checkbox modes; flat DOM with ARIA levels, counts/status, row actions and disabled skipping. Controlled/initial expansion and current item; no general multiselect modifier contract, lazy data, drag, filtering or virtualization in the spec.')}
# Tighten two compositions that must not be read as built-in capabilities.
AREA['slider']['yes']=AREA['slider']['yes'].replace('structure:range-thumbs','')
AREA['slider']['composition']+=' structure:range-thumbs'
AREA['table']['yes']=AREA['table']['yes'].replace('stripe:odd','')
AREA['prompt-suggestions']['yes']=AREA['prompt-suggestions']['yes'].replace('state:disabled','')
AREA['menu']['partial']='structure:submenus'
AREA['menu']['yes']+=' interaction:outside-dismiss interaction:single-selection placement:top placement:bottom placement:left placement:right'
AREA['segmented']['partial']=''
# Additional catalogue entries whose names differ from Area's.
R('tabs','P','underline-panels/','','underline;icons;counts','single-selection')
R('skeleton','P','skeleton-avatar/','shape=circle,square','avatar')
R('skeleton','P','skeleton-text/','text-size=display,titleLarge,titleMedium,titleSmall,bodyLarge,bodyMedium,bodySmall,subtitle','text;multiline')
R('toolbar','N','action-bar/','','floating-surface;separator;close-button','bulk-actions',kind='adjacent')
R('toolbar','K','action-bar','size=xs,sm,md,lg;placement=bottom-start,bottom,bottom-end','floating-surface;separator;close-button','bulk-actions',kind='adjacent')
R('panel','K','floating-panel','stage=default,minimized,maximized;resize-axis=n,s,e,w,ne,nw,se,sw','floating-surface;header;close-button','pointer-resize;pointer-move;minimize-maximize',kind='adjacent')
R('toast','D','message/','type=info,success,error,warning,loading','compact-message;stack','queue;auto-dismiss;promise-state;update-toast')
R('panel','G','panel/','','confirmation-panel;interruption-panel','confirm-completion',kind='different-job')
# Stable identities for source lookups and Area's exact manifest blocks.
NAMES={'menu':'Menu','message':'Message','model-picker':'ModelPicker','nav':'Nav','number-field':'NumberField','panel':'Panel','popover':'Popover','progress':'Progress','prompt-suggestions':'PromptSuggestions','property-list':'PropertyList','radio':'Radio','scroll-to-latest':'ScrollToLatest','segmented':'Segmented','select':'Select','separator':'Separator','skeleton':'Skeleton','slider':'Slider','spinner':'Spinner','split-button':'SplitButton','switch':'Switch','table':'Table','tabs':'Tabs','textarea':'Textarea','toast':'Toast','toolbar':'Toolbar','tooltip':'Tooltip','tree-view':'TreeView'}
TERMS={'menu':'menu, dropdown, action menu, overflow menu','message':'message, messaging, bubble, comment (exclude status Message)','model-picker':'model picker, model select; single-choice menu as a primitive','nav':'nav, navigation, sidebar, tab nav, side navigation','number-field':'number field, number input, spinbutton, stepper','panel':'panel, inspector, splitter, split view (exclude confirmation Panel)','popover':'popover, popup, anchored overlay','progress':'progress, progress bar, progress circle (exclude step indicators)','prompt-suggestions':'prompt suggestions, prompts, suggested reply','property-list':'property list, reorderable list, sortable list, drag and drop','radio':'radio, radio group, radio cards, choice list','scroll-to-latest':'scroll to latest, message scroller, back to top (opposite direction)','segmented':'segmented control, segmented button, content switcher, toggle group','select':'select, native select, picker, dropdown (search is adjacent)','separator':'separator, divider, content divider','skeleton':'skeleton, skeleton box, skeleton text, placeholder','slider':'slider, range slider, range','spinner':'spinner, loading, loader, indeterminate progress circle','split-button':'split button, dropdown button, button with dropdown, button group split','switch':'switch, toggle','table':'table, data table, table view (grid features are a separate tier)','tabs':'tabs, tablist, underline panels, tab view','textarea':'textarea, text area, multiline text field, text view','toast':'toast, notification, snackbar, flag, status message','toolbar':'toolbar, action bar, action button group (group semantics are adjacent)','tooltip':'tooltip, definition tooltip (interactive rich tooltip is adjacent)','tree-view':'tree view, tree, outline view'}
PROPOSE={}
def P(f,id,layer,label,selectors,why):PROPOSE.setdefault(f,[]).append(dict(id=id,layer=layer,label=label,selectors=selectors.split(),why=why))
P('menu','checkable',3,'Checkable items with independent sections','structure:checkbox-items structure:radio-items','Keep action, single choice and multiple choice semantics explicit; Area already has check/toggle anatomy.')
P('menu','nested',3,'Nested submenus','structure:submenus','Add the missing submenu focus and dismissal contract before expanding menu-shaped surfaces.')
P('menu','emphasis',2,'Soft/solid item emphasis and destructive intent','treatment:soft treatment:solid item-tone:destructive','Expose emphasis independently of selection and danger intent; preserve fixed foreground on hover.')
P('menu','dense',2,'A deliberate compact row tier','spacing:compact size:1 size:sm','Make dense command menus an intentional tier rather than arbitrary per-consumer padding.')
P('message','surfaces',2,'Bubble surface choices: filled, quiet, outline and unframed','variant:filled variant:muted variant:tinted variant:outline variant:outlined variant:ghost variant:borderless','Separate author identity from visual treatment and alignment.')
P('message','anatomy',3,'Avatar, header/footer and delivery metadata','structure:avatar structure:header structure:footer structure:timestamp','Serve team conversation as well as assistant prose without changing Message into a transport layer.')
P('message','grouped',3,'Consecutive-sender grouping and reactions','structure:sender-group structure:reactions','Offer message grouping and reactions as optional anatomy, retaining one-turn semantics.')
P('message','stream',2,'Streaming, loading and failed delivery','interaction:streaming state:loading state:error','Extend runtime states; keep animation policy in the motion system.')
P('model-picker','noted-choice',3,'Single-choice menu with descriptions','structure:descriptions structure:radio-items','Retain the current recipe. Counts here establish supporting menu primitives, not dedicated model selectors.')
P('model-picker','groups',3,'Grouped model choices','structure:groups','Useful when modes or providers create meaningful groups; do not expose arbitrary nested menus before Menu supports them.')
P('model-picker','icons',3,'Optional model/provider icon slot','structure:icons','Optional identifying content should not determine the selected-state behavior.')
P('nav','rail',3,'Collapsible icon rail','structure:collapsed-rail','A distinct sidebar anatomy with accessible labels and expanded content.')
P('nav','responsive',3,'Responsive navigation disclosure','structure:responsive-dropdown structure:responsive-disclosure','Let compact layouts change composition while retaining destination links.')
P('nav','mega',3,'Horizontal navigation with rich panels','structure:mega-menu','A later navigation recipe; keep its links separate from action Menu semantics.')
P('nav','row',3,'Rich grouped rows with trailing actions','structure:groups structure:row-actions structure:trailing-content','Retain and formalize existing composition slots before introducing visual duplicates.')
P('number-field','treatments',3,'Underline and borderless alongside outline/soft','variant:underlined variant:borderless appearance:underline variant:flushed','Useful alternatives for inline values; require a field-wide treatment decision rather than NumberField-only paint.')
P('number-field','stepper-layout',3,'Flanking or stacked steppers; optional scrub handle','structure:steppers-horizontal structure:steppers-stacked structure:scrub-handle','Keep anatomy independent of size and number parsing.')
P('number-field','labels',3,'Top/side labels and contextual help','label-position:top label-position:side structure:contextual-help','Compose Field rather than repeat validation wiring in every numeric layout.')
P('number-field','commit',2,'Explicit wheel, hold and commit policies','interaction:wheel-step interaction:hold-step interaction:change-and-commit','Treat these as opt-in behavioral contracts; avoid accidental value changes while scrolling.')
P('panel','inspector',3,'Header, sections, action column and pinned footer','structure:header structure:footer structure:sections','Keep Area’s inspector job; general splitters are supporting primitives rather than equivalent inspectors.')
P('panel','resizing',3,'Resizable edge with keyboard parity','interaction:pointer-resize interaction:keyboard-resize','Retain current width resizing and document bounds/cancel behavior.')
P('panel','split',3,'General split panes as a separate composition','structure:split-panes','Route this to the layout backlog, not an implicit extension of Panel’s one-edge inspector resizing.')
P('panel','floating',3,'Optional floating inspector recipe','structure:floating-surface interaction:minimize-maximize','Explore only after owner selection; it adds move, resize and window-state behavior.')
P('popover','surface-size',2,'A small set of surface sizes','size:1 size:2 size:3 size:4 size:S size:M size:L size:xs size:sm size:md size:lg','Offer predictable padding/content width choices without turning every width into a named variant.')
P('popover','anatomy',3,'Header/body/footer with optional arrow','structure:header structure:footer structure:arrow structure:hide-arrow','Retain current slots and make scrollable-body versus fixed footer explicit.')
P('popover','focus',2,'Nonmodal, trapped-focus and modal behavior are distinct','modal:false modal:trap-focus modal:true','Keep Area nonmodal by default; a modal option needs a deliberate accessibility contract.')
P('progress','circle',3,'Circular progress with center label','structure:circular structure:center-label','The largest missing anatomy; keep it distinct from indeterminate Spinner.')
P('progress','segments',3,'Segmented linear or circular track','structure:segmented-track','Useful for categorized totals. Each segment needs accessible meaning rather than color alone.')
P('progress','status',2,'Semantic success/error/warning tones','tone:success tone:warning tone:critical status:success status:exception interaction:error interaction:success','Separate task outcome from determinate/indeterminate mode.')
P('prompt-suggestions','cards',3,'Optional icon and description cards','structure:description structure:icons','Add a richer anatomy to list/chips while preserving button activation.')
P('prompt-suggestions','layout',3,'Horizontal/wrapping and vertical layouts','orientation:horizontal orientation:vertical structure:wrap','Retain the existing list/chips distinction; keep selection and send behavior consumer-owned.')
P('prompt-suggestions','disabled',2,'Disabled suggestions','state:disabled','Offer an explicit unavailable state; avoid treating a suggestion as a selected filter chip.')
P('property-list','reorder',3,'Flat reorderable property row','structure:drag-handle structure:drop-indicator interaction:drag-reorder','Retain the current value/actions composition. Evidence is for sortable primitives, not a full inspector property editor.')
P('property-list','keyboard',2,'Keyboard reordering and move announcements','interaction:keyboard-reorder interaction:keyboard-alternative interaction:drop-announcement','Keep as required behavior; add explicit move commands if drag is difficult on a target platform.')
P('property-list','multi',2,'Multi-selection only as a later mode','selection:multiple','The evidence comes from collection primitives; needs a product need and an expanded reorder contract.')
P('radio','cards',3,'Choice cards with optional indicator and rich content','structure:choice-cards structure:hide-indicator structure:rich-options','The principal radio anatomy gap; retain native mutually exclusive form semantics.')
P('radio','treatments',2,'Outline/soft/solid appearances','variant:outline variant:soft variant:subtle variant:solid','Keep tone separate; avoid making the choice-card structure a tone modifier.')
P('radio','conditional',3,'Conditional supporting field','structure:conditional-content','A form recipe, with expansion and validation tied to the chosen option.')
P('scroll-to-latest','follow',2,'Explicit follow/paused/resume behavior','interaction:pause-follow-on-user-intent interaction:resume-follow','Preserve a reader’s position during streaming rather than pulling them to the end.')
P('scroll-to-latest','indicator',3,'New-content indicator beside the jump action','structure:new-content-indicator','Optional information anatomy beyond Area’s existing icon-only button.')
P('scroll-to-latest','history',3,'History and message anchors in a transcript wrapper','interaction:history-anchor interaction:message-jump','Keep this in a conversation-scroll composition; the button alone should not own transcript state.')
P('segmented','treatments',3,'Raised track and joined outline','variant:surface variant:classic structure:joined-outline variant:outline','Offer a second anatomy without merging it with underline Tabs.')
P('segmented','vertical',3,'Vertical segmented choices','orientation:vertical','Requires orientation-aware keyboard behavior as well as layout.')
P('segmented','multi',2,'Optional multiple-toggle semantic mode','interaction:multiple-selection','Keep it distinct from the existing radio contract and name the mode explicitly.')
P('select','custom',3,'Optional custom listbox and rich rows','structure:custom-listbox structure:icons structure:descriptions','Keep native select available; a custom popup needs a complete selection/focus/touch contract.')
P('select','inline',3,'Quiet/ghost inline trigger','trigger-variant:ghost variant:ghost quiet:true variant:borderless structure:inline-trigger','This is already an owner decision point in Area’s spec.')
P('select','multi',2,'Multiple selection in a separately documented mode','interaction:multiple-selection','Do not silently add search or create-on-type to Select; route those to Combobox/MultiSelect ownership.')
P('separator','content',3,'Labeled and icon separators','structure:text-label structure:icon','Content-bearing rules need a deliberate anatomy and decorative/semantic policy.')
P('separator','stroke',2,'Solid, dashed and dotted strokes','variant:solid variant:dashed variant:dotted','Optional low-cost range; default remains the shared divider role.')
P('skeleton','motion',2,'Pulse, shimmer/wave and static','animation:wave animation:pulse variant:pulse variant:shine variant:none animation:off','Connect all animation choices to reduced-motion policy.')
P('skeleton','wrapper',3,'Layout-preserving content wrapper','structure:replace-children interaction:preserve-layout','Useful when layout is already known; disable hidden interactive descendants.')
P('skeleton','text',3,'Multiline text and avatar presets','structure:multiline structure:avatar','Reuse the actual typography and avatar geometry rather than invent new fixed dimensions.')
P('slider','anatomy',3,'Single/range thumbs and paired number inputs','structure:single-thumb structure:range-thumbs structure:number-input','Clarify whether the range recipe becomes a first-class contract before adding more thumbs.')
P('slider','feedback',3,'Step marks and transient/always-visible value labels','structure:step-marks structure:value-tooltip structure:value-label','Keep formatting, marks and precise numeric entry separate.')
P('slider','collision',2,'Explicit range-thumb collision policy','collision:push collision:swap collision:none','Only if Area adopts a custom range engine; these policies are not visual aliases.')
P('spinner','shapes',2,'Arc, dots and bars','type:oval type:dots type:bars style:dot-circle','Offer a small shape vocabulary that works in the same loading slot.')
P('spinner','host',3,'Inline, labeled region and overlay compositions','structure:inline structure:label structure:overlay','Blocking overlay behavior belongs to a host recipe, not the glyph.')
P('split-button','treatments',2,'Primary/soft/outline and an owner decision on ghost','appearance:primary appearance:secondary appearance:outline appearance:subtle appearance:transparent appearance:filled appearance:tonal appearance:outlined','Resolve the manifest/spec conflict. Fluent supplies quiet styles while Area’s spec rejects ghost.')
P('split-button','anatomy',3,'Text/icon primary action plus independently named menu trigger','structure:primary-action structure:menu-trigger structure:icons','Retain two actions and their keyboard stops; changing the primary action after selection is a separate policy.')
P('split-button','shape',2,'Shape and expressive motion as optional future range','shape:rounded shape:circular shape:square interaction:shape-animation','Do not copy platform geometry; expressive source is experimental and not a baseline requirement.')
P('switch','treatments',2,'Flat/soft and raised appearances','variant:surface variant:classic variant:soft variant:raised','Keep appearance independent of the current short/long track option.')
P('switch','content',3,'Optional thumb icon or on/off track labels','structure:thumb-icon structure:track-label','Validate small sizes and accessible names; labels must not be the sole state signal.')
P('switch','states',2,'Read-only and loading remain independent of disabled','state:read-only state:loading state:disabled','Retain Area’s richer state contract and document async update behavior.')
P('table','layout',3,'Sticky header and responsive list presentation','structure:sticky-header structure:responsive-list','Useful range beyond scrolling; the list transformation needs an accessible reading-order contract.')
P('table','expansion',3,'Expandable detail rows and batch-action toolbar','structure:expandable-rows structure:batch-toolbar','Keep table semantics and compose the toolbar; distinguish nested rows from full TreeGrid.')
P('table','surface',2,'Plain versus contained outline surface','variant:ghost variant:surface variant:line variant:outline','Separate container treatment from stripes, row state and cell density.')
P('table','grid-boundary',3,'DataGrid tier as a separate future job','interaction:keyboard-grid structure:resizable-columns interaction:virtualization','Do not imply these are already Table variants; align with the backlog session.')
P('tabs','treatments',3,'Underline, enclosed/pill and quiet tab treatments','structure:underline treatment:underline treatment:line variant:line type:line variant:pills variant:enclosed variant:outline variant:subtle treatment:button-brand treatment:button-gray treatment:button-border treatment:button-minimal','This is a core structural gap under the brief; keep orientation independent.')
P('tabs','overflow',3,'Scrollable strip or overflow menu','structure:scroll-buttons structure:overflow-menu','Make the policy explicit and maintain access to the active tab.')
P('tabs','editable',3,'Optional add/close affordances','structure:add-button structure:close-button interaction:add-remove','Needed for document-style workspaces; requires focus placement after close.')
P('textarea','treatments',3,'Outline/soft plus underlined or borderless','variant:flushed variant:underlined variant:borderless variant:unstyled','Choose field-wide treatment semantics rather than isolated textarea paint.')
P('textarea','grow',3,'Autosizing with bounded rows','interaction:autosize interaction:min-max-rows','A behavior/anatomy option independent of text-size tier.')
P('textarea','count',3,'Character/word count and clear action','structure:character-count structure:word-count structure:clear-button','Compose with Field, include limit announcements, and keep native editing intact.')
P('toast','lifecycle',2,'Queue, timed/persistent and pause behavior','interaction:queue interaction:auto-dismiss interaction:persistent interaction:persistent-actionable interaction:pause-on-hover-focus','Close the largest Toast behavior gap without conflating surface tone with queue ownership.')
P('toast','async',2,'Loading-to-success/error updates','interaction:promise-state interaction:update-toast','Update one notification instead of appending a new message for every state change.')
P('toast','layout',3,'Compact text, rich actions and stacked presentation','structure:compact-message structure:actions structure:stack','Keep the action and dismiss targets independent; prefer nonexpiring actionable toasts.')
P('toolbar','overflow',3,'Responsive overflow with labeled hidden commands','interaction:responsive-overflow structure:overflow-menu','Area’s manual details disclosure is not automatic overflow; this deserves its own contract.')
P('toolbar','floating',3,'Docked/plain versus floating toolbar','structure:floating-surface','Preserve the base command grouping while offering a deliberate surface composition.')
P('toolbar','bulk',3,'Selection-driven action bar recipe','interaction:bulk-actions','Keep selection ownership outside Toolbar; not every action group is a roving-focus toolbar.')
P('tooltip','content',3,'Plain text, description and multiline','structure:text structure:description structure:multiline','Retain a noninteractive Tooltip. Material’s rich tooltip belongs to Area Popover when it has actions.')
P('tooltip','position',2,'Placement, arrow and delay grouping','structure:arrow interaction:group-delay interaction:delay','Make shared timing predictable; avoid treating follow-pointer as the default.')
P('tree-view','multi',2,'Separate checkbox and modifier-key selection modes','selection:multiple structure:checkboxes','Existing checkbox mode is not proof of shift/range-selection support.')
P('tree-view','async',2,'Lazy children, loading and failure recovery','interaction:async-loading','Define loading ownership and focus stability before adding virtualized trees.')
P('tree-view','reorder',3,'Drag handles and keyboard-equivalent reordering','interaction:drag-reorder','Build on PropertyList’s accessibility contract, extended to hierarchy and drop targets.')
P('tree-view','rows',3,'Connector lines and rich identity rows','structure:connector-lines structure:avatars structure:descriptions','Offer optional row anatomy without changing indent semantics.')
# Additional API-table limits: omit fields that the inspected page did not expose.
for f,sys,axis,values in [
 ('menu','S','state','disabled,checked'),('menu','R','state','disabled,checked'),('menu','T','state','disabled'),
 ('number-field','A','state','invalid'),('radio','A','state','invalid'),('select','P','state','invalid'),('select','T','state','invalid'),
 ('progress','C','state','finished'),('textarea','A','state','invalid'),('textarea','P','state','disabled,invalid'),('textarea','K','state','disabled,invalid'),('textarea','T','state','disabled,invalid')]:
 remove(f,sys,axis,values)
# Field size variants should not be inferred from generic button examples.
remove('segmented','S','size','sm')
remove('select','S','size','sm')
# Source names retained for labels; default is the absence of a prop, not a new token.
for o in DATA['switch']:
 if o['system']=='F' and o['axis']=='label-position':o['value']={'above':'top','before':'left','after':'right'}.get(o['value'],o['value'])

# Rendering and audit: facts remain in the observations above; no external dependency is needed.
SECTIONS=['Job','Variant axes','Structural alternatives','Interaction patterns','Area today','Proposed range','Sources']
def source_link(path,start=1,end=None):
 return f'https://github.com/ethanwongwork/area/blob/{SHA}/{path}#L{start}'+(f'-L{end}' if end else '')
@lru_cache(maxsize=None)
def spec_lines(slug):
 return subprocess.check_output(['git','show',f'{SHA}:docs/specs/{slug}.md'],cwd=ROOT.parents[3],text=True).splitlines()
@lru_cache(maxsize=None)
def spec_section(slug,heading):
 path=f'docs/specs/{slug}.md';lines=spec_lines(slug)
 start=next((i+1 for i,l in enumerate(lines) if l.startswith('## ') and heading.lower() in l.lower()),None)
 if start is None:return source_link(path,1,len(lines))
 end=next((i for i in range(start,len(lines)) if lines[i].startswith('## ')),len(lines))
 return source_link(path,start,end)
def option_area_sources(slug,observation,manifest_link):
 heading={'Variant axes':'Variants','Structural alternatives':'Anatomy','Interaction patterns':'Behavior'}[observation['section']]
 refs=[manifest_link,spec_section(slug,heading),spec_section(slug,'Decisions')]
 if observation['axis']=='state':refs.append(spec_section(slug,'States'))
 if slug=='panel':refs.append(source_link('docs/specs/resizable-panel.md',12,29))
 if slug=='radio':refs.append(source_link('packages/styles/src/manifest.ts',251,259))
 return list(dict.fromkeys(refs))
def keys(text):return set(text.split())
def area_status(f,oid,manifest):
 a=AREA[f];axis,value=oid.split(':',1)
 for status in ['yes','composition','partial']:
  if oid in keys(a.get(status,'')):return status
 if axis=='size' and value in manifest.get('variants',{}).get('size',[]):return 'yes'
 if axis=='size':
  tier={'small':'sm','medium':'md','middle':'md','large':'lg','S':'sm','M':'md','L':'lg','1':'sm','2':'md','3':'lg'}.get(value)
  if tier in manifest.get('variants',{}).get('size',[]):return 'equivalent tier / geometry not asserted'
 equivalent={
  'tabs':{'treatment:underline','treatment:line','type:line','variant:line'},
  'number-field':{'variant:outlined','variant:filled','variant:subtle','appearance:filled-darker','appearance:filled-lighter'},
  'textarea':{'variant:outlined','variant:filled','variant:subtle','variant:surface'},
  'select':{'variant:outlined','variant:filled','variant:subtle','trigger-variant:surface'},
  'split-button':{'appearance:primary','appearance:filled','appearance:secondary','appearance:tonal','appearance:outlined'},
  'segmented':{'variant:surface','variant:classic'},
  'switch':{'track:default','track:slim'},
  'radio':{'emphasis:default','emphasis:emphasized'},
  'slider':{'emphasis:default','emphasis:emphasized'}}
 if oid in equivalent.get(f,set()):return 'equivalent concept / source styling differs'
 if axis in ('variant','treatment','appearance','trigger-variant') and value in manifest.get('variants',{}).get('variant',[]):return 'yes'
 if value in manifest.get('variants',{}).get(axis,[]):return 'yes'
 if axis=='state' and value in manifest.get('states',[]):return 'yes'
 if axis in ('theme','radius','contrast','density','color','static-color'):return 'system-level / not this exact option'
 return 'not found'
def counted(obs):
 groups={'direct':set(),'experimental':set(),'supporting':set(),'guidance':set(),'different_job':set()}
 for o in obs:
  key=('guidance' if o['kind']=='guidance' else 'different_job' if o['kind']=='different-job' else 'supporting' if o['kind'] in ('primitive','adjacent') else 'experimental' if o['kind']=='experimental-component' else 'direct')
  groups[key].add(SYSTEMS[o['system']][0])
 # One system may supply direct and primitive evidence; only count it in its strongest category.
 for name in list(groups['direct']):
  groups['supporting'].discard(name);groups['guidance'].discard(name);groups['experimental'].discard(name)
 return {k:sorted(v) for k,v in groups.items()}
def count_label(groups):
 bits=[f"{len(groups['direct'])} direct systems"]
 for key,label in [('experimental','experimental implementation'),('supporting','supporting/adjacent systems'),('guidance','guidance systems'),('different_job','different-job systems')]:
  if groups[key]:bits.append(f'{len(groups[key])} {label}')
 return '; '.join(bits)
def render():
 import subprocess
 repo=ROOT.parents[3]
 text=(repo/'packages/styles/src/manifest.ts').read_text()
 pinned=subprocess.check_output(['git','show',f'{SHA}:packages/styles/src/manifest.ts'],cwd=repo,text=True)
 assert text==pinned,'Research baseline manifest changed; do not silently refresh it.'
 manifests=json.loads(subprocess.check_output(['node','--input-type=module','--eval',"import {MANIFESTS} from './packages/styles/src/manifest.ts'; process.stdout.write(JSON.stringify(MANIFESTS))"],cwd=repo,text=True))
 manifest_map={v['block'].replace('area-',''):v for v in manifests.values()}
 blocks={m.group(2):(text[:m.start()].count('\n')+1,text[:m.end()].count('\n')+1) for m in re.finditer(r'export const (\w+) = \{\s*block: "area-([^"]+)".*?satisfies ComponentManifest;',text,re.S)}
 assert set(DATA)==set(NAMES)==set(AREA)==set(PROPOSE)
 idx={'_meta':{'starting_commit':SHA,'checked_on':DATE,'branch':'astra/library-range-2','systems':{k:v[0] for k,v in SYSTEMS.items()},'count_rule':'Distinct systems per option; React Aria/Spectrum 2 and Chakra/Ark each count once. Direct includes components and official examples/recipes. Adjacent primitives, experimental implementations, platform guidance and different jobs are counted separately. Counts are documented lower bounds, never inferred from inherited dependency capabilities.','area_status_rule':'yes = documented at baseline; composition = documented composition, not dedicated API; partial = qualified subset; equivalent = matching concept or named tier without asserting identical styling/geometry; not found = not found in the baseline manifest and spec, not proof impossible; system-level = foundation setting, not this exact family option.','scope':'Categorical component range and meaningful anatomy/behavior. Arbitrary CSS lengths/colors, event callback names, content strings, global foundation palettes and arbitrary custom-render possibilities are not enumerated as variants. Native axis spellings retained; matching size names do not imply equal geometry.','options_are':'Observed options in the inspected public documentation/source; unconfirmed API inheritance and inaccessible detail are explicitly not counted.'},'families':{}}
 for f in sorted(NAMES):
  name=NAMES[f];man=manifest_map[f];start,end=blocks[f];ml=source_link('packages/styles/src/manifest.ts',start,end);sl=source_link(f'docs/specs/{f}.md',1)
  today=source_link(f'docs/specs/{f}.md',1,len(spec_lines(f)))
  opts={}
  for o in DATA[f]:
   oid=o['axis']+':'+o['value']
   opt=opts.setdefault(oid,{'section':o['section'],'axis':o['axis'],'value':o['value'],'systems':{},'area_has_it':{'status':area_status(f,oid,man),'sources':option_area_sources(f,o,ml),'note':'Compare the exact native option, not just a similarly named component. '+('See the family qualification in Area today.' if area_status(f,oid,man) in ('partial','composition') else '')}})
   system=SYSTEMS[o['system']][0];entry={'url':o['url'],'checked_on':DATE,'evidence_kind':o['kind']}
   if entry not in opt['systems'].setdefault(system,[]):opt['systems'][system].append(entry)
  # Record Area-only variants too, so an empty external count is never mistaken for removal advice.
  for axis,vals in man.get('variants',{}).items():
   for value in vals:
    oid=axis+':'+value
    if oid not in opts:opts[oid]={'section':'Variant axes','axis':axis,'value':value,'systems':{},'area_has_it':{'status':'yes','sources':[ml],'note':'Declared in the baseline manifest; no identical external value recorded.'}}
  for oid,opt in opts.items():
   relevant=[o for o in DATA[f] if o['axis']+':'+o['value']==oid]
   opt['support']=counted(relevant);opt['direct_system_count']=len(opt['support']['direct'])
  surveys={}
  for code,(system,base,catalog) in SYSTEMS.items():
   obs=[o for o in DATA[f] if o['system']==code]
   surveys[system]={'result':'documented' if obs else 'not found','searched_terms':TERMS[f],'catalogue':catalog,'checked_on':DATE,'sources':sorted(set(o['url'] for o in obs)),'qualification':('Evidence kinds are recorded per option; a primitive, recipe or HIG convention is not proof of a complete family implementation.' if obs else 'No family-specific option verified in the checked catalogue/pages. This is a scoped research result, not a claim that the system cannot compose it. See source-audit-2.json for attempted pages, redirects and inaccessible content.')}
  baseline_ids=[axis+':'+value for axis,values in man.get('variants',{}).items() for value in values]
  baseline_obs=[o for o in DATA[f] if o['axis']+':'+o['value'] in baseline_ids]
  proposals=[{'id':'retain-baseline-inventory','layer':2,'label':'Retain the documented baseline inventory','selectors':baseline_ids,'option_ids':baseline_ids,'support':counted(baseline_obs),'why':('Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count.' if baseline_ids else 'No design-time variant axis is declared today; keep this focused recipe and choose structural extensions below before introducing additional paint axes.'),'count_note':'Exact native option spellings only; zero does not mean no conceptual equivalent. Baseline contract caveats remain in Area today.','sources':[ml,sl]}]
  for p in PROPOSE[f]:
   selected=[o for o in DATA[f] if o['axis']+':'+o['value'] in p['selectors']]
   assert selected,(f,p['id'],'proposal has no evidence')
   resolved=[x for x in p['selectors'] if x in opts]
   groups=counted(selected)
   proposals.append({**p,'selectors':resolved,'option_ids':resolved,'sources':sorted(set(o['url'] for o in selected)),'support':groups,'count_note':'Union supporting at least one listed alternative; individual option counts remain in options. Not a claim that every named system ships the entire bundle.'})
  idx['families'][f]={'name':name,'job':man['description'],'area_manifest':{'source':ml,**man},'area_spec':sl,'area_today':AREA[f]['note'],'survey':surveys,'options':dict(sorted(opts.items())),'proposed_range':proposals}
  out=[f'# {name} — library range','',f'Baseline `{SHA}` · public references checked {DATE}. Counts and scope rules: [README-2](README-2.md).','', '## Job','',f'{man["description"]} [Area manifest]({ml}).', '',f'Boundary: {AREA[f]["note"]} [Area spec]({sl}).','']
  for section in SECTIONS[1:4]:
   out+=['## '+section,'']
   obs=[o for o in DATA[f] if o['section']==section]
   if not obs:out += [f'No additional named {section.lower()} found in the checked public sources. Area’s current contract is listed below; the complete system-by-system search record is in Sources.','']
   if section=='Interaction patterns':
    for value in dict.fromkeys(o['value'] for o in obs):
     matches=[o for o in obs if o['value']==value]
     refs=list(dict.fromkeys((SYSTEMS[o['system']][0],o['url']) for o in matches))
     out.append('- **'+value+'**: '+', '.join(f'[{system}]({url})' for system,url in refs)+f' (checked {DATE}).')
    out.append('')
    continue
   for code,(system,base,catalog) in SYSTEMS.items():
    oo=[o for o in obs if o['system']==code]
    if not oo:continue
    for url in dict.fromkeys(o['url'] for o in oo):
     row=[o for o in oo if o['url']==url];axes={}
     for o in row:axes.setdefault(o['axis'],[]).append(o['value'])
     summary='; '.join((a+': ' if section=='Variant axes' else '')+', '.join(dict.fromkeys(v)) for a,v in axes.items())
     kinds=', '.join(sorted(set(o['kind'] for o in row)))
     out.append(f'- **{system}** ({kinds}): {summary}. [Source]({url}) (checked {DATE}).')
   out.append('')
  out += ['## Area today','',AREA[f]['note']+f' [Baseline spec]({sl}).','',f'- Exact manifest axes: '+('; '.join(k+' = '+', '.join(v) for k,v in man['variants'].items()) or 'none')+f'. [Manifest]({ml}).',f'- Boolean modifiers: '+(', '.join(man.get('booleans',[])) or 'none declared')+f'. Runtime state hooks: '+(', '.join(man.get('states',[])) or 'none declared')+f'. [Manifest]({ml}).',f'- Slots: '+(', '.join(man.get('elements',[])) or 'none declared')+f'. [Manifest]({ml}).','']
  if f=='radio':out += [f'RadioGroup separately declares horizontal/vertical orientation and disabled/invalid states. [RadioGroup manifest]({source_link("packages/styles/src/manifest.ts",251,259)}).','']
  if f=='panel':out += [f'Resizing scope and exclusions: [resizable-panel spec]({source_link("docs/specs/resizable-panel.md",12,29)}).','']
  out += ['Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):','']
  statuses={}
  for oid,o in opts.items():statuses.setdefault(o['area_has_it']['status'],[]).append(oid)
  for status,ids in statuses.items():
   out.append('- **'+status+'**: '+', '.join('`'+x+'`' for x in sorted(ids))+f'. [Manifest]({ml}); [spec]({today}).')
  out += ['','## Proposed range','','Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).','']
  for p in proposals:
   refs=p['sources']
   names=', '.join(p['support']['direct']) or 'none verified as a direct implementation/example'
   out.append(f'- **Layer {p["layer"]} · {p["label"]}** — {count_label(p["support"])}. Direct: {names}. {p["why"]} Evidence: '+', '.join(f'[{i+1}]({u})' for i,u in enumerate(refs))+'.')
   if p['option_ids']:out.append('  - Individual options: '+ '; '.join(f'`{oid}` ({opts[oid]["direct_system_count"]} direct; Area: {opts[oid]["area_has_it"]["status"]})' for oid in p['option_ids'])+'.')
  out+=['','## Sources','',f'- Area: [manifest, lines {start}–{end}]({ml}); [spec]({sl}). All Area judgments refer to starting commit `{SHA}`, not concurrent work.','- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).','',f'Searched terms: {TERMS[f]}. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.','']
  for system,survey in surveys.items():
   if survey['sources']:
    out.append('- **'+system+'**: '+', '.join(f'[source {i+1}]({u})' for i,u in enumerate(survey['sources']))+f'; checked {DATE}.')
    if system=='Apple HIG':out.append('  - Readable official data: '+', '.join(f'[documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/{u.rsplit("/",1)[-1]}.json)' for u in survey['sources'])+'. Platform guidance is counted separately.')
   else:out.append(f'- **{system} — not found**: checked [catalogue]({survey["catalogue"]}) on {DATE} for {TERMS[f]}. No independently verified option recorded; see the audit for lookup limitations.')
  if f in UNCONFIRMED:
   out += ['', 'Not found at option level (therefore omitted from counts): '+ '; '.join(SYSTEMS[s][0]+': '+', '.join(v) for s,v in UNCONFIRMED[f].items())+'. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.']
  if f=='message':out += ['', 'Ant Design’s core Message is status feedback, not a conversation turn; Ant Design X Bubble is the direct comparison used here. Atlassian Comment is adjacent, not an assistant message runtime.']
  if f=='panel':out += ['', 'GOV.UK Panel is a confirmation/interruption message, not an inspector. Splitter references establish resizing primitives, not a complete inspector.']
  (ROOT/(f+'.md')).write_text('\n'.join(out).rstrip()+'\n')
 man=manifest_map['checkbox'];start,end=blocks['checkbox'];ml=source_link('packages/styles/src/manifest.ts',start,end)
 idx['_meta']['supplements']={'checkbox':{'scope':'Current-main manifest companion; outside-system survey remains in run 1.','area_manifest':{'source':ml,**man}}}
 (ROOT/'checkbox.md').write_text(f"""# Checkbox — current-main companion

Snapshot of commit `{SHA}`. [Run 2](README-2.md). Outside-system comparison remains in the run-1 catalogue; this supplement refreshes only the Area contract.

## Job

{man['description']}

## Variant axes

{'; '.join(k+' = '+', '.join(v) for k,v in man['variants'].items())}. [Manifest]({ml}).

## Structural alternatives

Standard native checkbox or card with leading visual, text/caption and control. Card layout is row or tile.

## Interaction patterns

Native checked/indeterminate, disabled and invalid states. Layout is forwarded only when variant=card. Group orientation is independent.

## Area today

Defaults: size=md and tone=neutral. No sm size remains. Elements: control and visual. [Manifest]({ml}); [React layout guard]({source_link('packages/react/src/components/forms.tsx',143)}).

## Proposed range

Retain the built card anatomy and expose row/tile only when card is selected. No new outside prevalence count is asserted here.

## Sources

- [Current manifest]({ml}).
- [Checkbox spec]({source_link('docs/specs/checkbox.md',1)}).
- [React implementation]({source_link('packages/react/src/components/forms.tsx',143)}).
""")
 (ROOT/'index-2.json').write_text(json.dumps(idx,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'families':len(DATA),'observations':sum(map(len,DATA.values())),'options':sum(len(f['options']) for f in idx['families'].values()),'proposals':sum(len(f['proposed_range']) for f in idx['families'].values())}))
if __name__=='__main__':render()
