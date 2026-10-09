"""Hand-reviewed exceptions to lexical source selection and context-dependent depth."""
# file, start, end. Short CSS rules can prove a contract exists without proving its paint;
# add the donor CSS or actual markup when a class only has an override/positioning rule.
SOURCES={
'button.root':[('components/button.css',319,320)],
'colorPicker.fields':[('components/color.css',374,376)],
'colorPicker.band-region':[('@packages/react/src/components/ColorPicker.tsx',336,340)],
'calendar.root':[('components/calendar.css',32,46)],
'calendar.day-number':[('@packages/react/src/components/Calendar.tsx',268,273)],
'composer.submit':[('@packages/react/src/components/Composer.tsx',111,115),('components/button.css',61,98)],
'input.action-tooltip':[('@packages/react/src/components/Input.tsx',77,77),('components/surface.css',1332,1369)],
'sliderRange.end':[('@packages/react/src/components/SliderRange.tsx',103,107)],
'combobox.option':[('@packages/react/src/components/Combobox.tsx',219,235),('components/surface.css',1105,1137)],
'customSelect.option':[('@packages/react/src/components/CustomSelect.tsx',207,216),('components/surface.css',1105,1137)],
'tagPicker.option':[('@packages/react/src/components/TagPicker.tsx',226,232),('components/surface.css',1105,1137)],
'drawer.root':[('components/drawer.css',46,74)],
'drawer.modal':[('components/drawer.css',22,36)],
'hoverCard.root':[('@packages/react/src/components/HoverCard.tsx',74,82),('components/surface.css',957,977)],
'badgeGroup.overflow-content':[('components/badge.css',217,218),('components/surface.css',957,977)],
'alert.dismiss':[('components/surface.css',744,754)],
'colorPicker.preview-new':[('@packages/react/src/components/ColorPicker.tsx',353,356)],
'switch.loading':[('@packages/react/src/components/Switch.tsx',106,113)],
}
# Extra sources augment, except these where a misleading lexical match is removed.
REPLACE={'colorPicker.fields','drawer.root','drawer.modal','hoverCard.root','input.action-tooltip','composer.submit','sliderRange.end','combobox.option','customSelect.option','tagPicker.option','badgeGroup.overflow-content','alert.dismiss'}
VARIANTS={
 'toolbar.root':[('surface toolbar plate','raised','toolbar',32,36)],
'calendar.root':[('surface shell','raised','calendar',32,46),('plain inside DatePicker/another surface','flush','calendar',46,46)],
'colorPicker.root':[('surface shell','raised','color',242,247),('plain embedded picker','flush','color',248,248)],
'card.root':[('Surface axis gives shadow-card a non-none lift','raised','surface',72,102),('Flat/no lift','flush','surface',72,102)],
'panel.root':[('flush docked variant','flush','panel',75,81)],
'badge.root':[('modern variant shadow','raised','badge',188,188)],
'segmented.item':[('selected item','raised','segmented',103,111)],
'commandPalette.root':[('inline presentation','flush','command-palette',86,87)],
'menu.root':[('embedded search-surface Menu','flush','surface',1319,1325)],
'codeBlock.toggle':[('collapsed overlay over code','floating','code',490,503)],
'card.overlay':[('over media','floating','surface',367,380)],
}
