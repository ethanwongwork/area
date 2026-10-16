"""Curated supplemental parts; current source.SHA pins."""
EXTRAS="""
buttonGroup|join|D|root|button-group|73|82|> .area-button + .area-button::before|Shared segment seam; outline variant uses the buttons' borders instead.
splitButton|join|D|root|split-button|45|55|.area-split-button__trigger::before|Internal segment seam, not a control edge.
alignmentPicker|bars|G|dot|alignment-picker|78|104|.area-alignment-picker__dot > i|Selected/preview alignment marks replace the idle dot.
alignmentPicker|native-input|R|cell|alignment-picker|59|66|.area-alignment-picker__cell > input|Invisible radio hit target; cell and marks own all visible paint.
colorSwatch|checker|S|root|color|49|65|.area-color-swatch::before|Checker conveys alpha; preserve semantic pattern.
colorSwatch|sample|S|root|color|66|69|.area-color-swatch::after|Actual color overlays checker; do not replace with theme fill.
colorSwatchPicker|native-input|R|cell|color|107|116|.area-color-swatch-picker__cell > input|Invisible radio input; the visible cell and swatch are separate.
colorPicker|slider-thumb|K|slider|color|274|287|.area-color-picker__slider::-webkit-slider-thumb|Native thumb over channel track; Firefox equivalent is pinned separately.
colorPicker|slider-thumb-moz|K|slider|color|301|306|.area-color-picker__slider::-moz-range-thumb|Firefox implementation of the same physical thumb; not a second simultaneous thumb.
colorPicker|new-checker|S|preview-new|color|49|65|.area-color-picker__preview-new::before|Checker below the new color.
colorPicker|new-sample|S|preview-new|color|66|69|.area-color-picker__preview-new::after|Semantic sample layer.
colorPicker|original-checker|S|preview-original|color|49|65|.area-color-picker__preview-original::before|Checker below original color.
colorPicker|original-sample|S|preview-original|color|66|69|.area-color-picker__preview-original::after|Semantic sample layer on restore button.
colorPicker|contrast-background|S|contrast-pair|color|343|343|.area-color-picker__contrast-pair > span|Second color sample behind contrast comparison.
colorPicker|band-dots|S|band-region|color|352|352|.area-color-picker__band pattern circle|Pattern defines semantic contrast-limit hatching; not decorative grain.
colorPicker|contrast-glyph|G|contrast-level|color|348|348|.area-color-picker__contrast-level svg|Pass/fail icon shares rating slot with text.
colorPicker|contrast-rating-text|T|contrast-level|color|346|348|.area-color-picker__contrast-level text content|AA/AAA rating label; primary parent role is glyph due to status icon.
calendar|range-fill|S|cell|calendar|113|129|.area-calendar__cell[data-range]::before|Range bridge behind day control; flat selection paint, not a raised bar.
input|file-button|R|control|input|171|184|.area-input__control::file-selector-button|Native file action; transparent CSS plate with its own text.
input|placeholder|T|control|input|162|162|.area-input__control::placeholder|Placeholder ink, never a disabled surface.
input|autofill-fill|S|control|input|160|160|.area-input__control:autofill|Large inset shadow paints autofill ground; it is not physical recession.
numberField|scrub-hit|G|scrub|number-field|109|109|.area-number-field__scrub::after|Invisible expanded drag target.
numberField|step-glyph|G|step|number-field|144|144|.area-number-field__step svg|Stepper arrow glyph inside control.
breadcrumb|link-plate|W|link|breadcrumb|24|31|.area-breadcrumb__link::before|Hover/press plate and focus ring drawn behind text; flush at rest.
breadcrumb|ellipsis-plate|W|ellipsis|breadcrumb|46|51|button.area-breadcrumb__ellipsis::before|Button-only hover/open plate.
treeView|row|W|root|tree-view|28|60|[role=treeitem]|Selectable/navigation row; flat state plate and inset focus edge.
treeView|row-edge|E|row|tree-view|60|60|[role=treeitem]:focus-visible|Inset keyboard focus ring; no elevation.
treeView|chevron-plate|W|chevron|tree-view|76|89|.area-tree-view__chevron::before|Hover plate behind the chevron; smaller than its hit target.
treeView|chevron-hit|G|chevron|tree-view|78|78|.area-tree-view__chevron::after|Invisible expanded pointer target.
treeView|check-glyph|G|check|tree-view|126|135|.area-tree-view__check svg|Check mark shown for selected row.
textarea|value|T|root|textarea|9|49|.area-textarea text content|Editable value over field ground; native resize grip is browser-owned.
textarea|placeholder|T|root|textarea|79|79|.area-textarea::placeholder|Placeholder ink.
select|value|T|root|navigation|243|285|.area-select selected text|Native selected option string on field surface.
select|fallback-chevron|G|root|navigation|286|297|.area-select background-image|SVG chevron in classic select path; replaced in base-select branch.
select|picker-icon|G|root|navigation|371|386|.area-select::picker-icon|Enhanced native picker glyph; not an extra arrow beside fallback.
select|picker|F|@host|navigation|387|410|.area-select::picker(select)|Enhanced picker float; classic native popup paint is UA/OS-owned, not specified here.
select|option|W|picker|navigation|432|464|.area-select option|Flat native option row with selection/hover fill.
select|option-text|T|option|navigation|432|464|.area-select option text content|Option text ink; chosen mark is separate.
select|checkmark|G|option|navigation|465|476|.area-select option::checkmark|Native selected marker in enhanced picker.
select|group-label|T|picker|navigation|477|488|.area-select optgroup|Group label font; option rows remain their own controls.
checkbox|mark|G|control|choice|176|202|.area-checkbox__control::after|Check or indeterminate dash; fill is semantic checked state.
radio|mark|S|control|choice|176|217|.area-radio__control::after|Selected center dot.
switch|hover-plate|W|track|switch|88|98|.area-switch__track::before|State wash over track, not another material surface.
slider|rail-webkit|I|control|slider|190|199|.area-slider__control::-webkit-slider-runnable-track|Unfilled rail and selected portion share one gradient; flat today.
slider|rail-moz|I|control|slider|200|209|.area-slider__control::-moz-range-track|Firefox equivalent of the rail.
slider|selected-fill|S|control|slider|190|209|native track gradient before --_pct|Logical paint layer inside native rail gradient, not a separate element.
slider|thumb|K|control|slider|224|249|native slider thumb pseudos|Both browser implementations: surface, border, central dot, shadow-1.
slider|thumb-dot|S|thumb|slider|224|249|thumb radial-gradient center|Selected-tone center is semantic value feedback, separate from thumb body.
slider|tick|S|marks|slider|59|69|.area-slider__marks i|Tick marks; not structural dividers.
sliderRange|rail|I|track|slider|120|129|.area-slider-range__track::after|Unfilled shared rail.
sliderRange|selected-fill|S|track|slider|131|140|.area-slider-range__track::before|Range interval fill; donor Slider rails are transparent.
badge|dot-ink|S|dot|badge|66|66|.area-badge__dot::before|Painted status dot inside its sizing slot.
badge|hit|R|root|badge|182|183|:is(a,button).area-badge::after|Invisible target expansion only for interactive badge.
badge|dismiss-hit|R|dismiss|badge|203|204|.area-badge__dismiss::after|Invisible expanded remove target.
badge|dismiss-glyph|G|dismiss|badge|199|199|.area-badge__dismiss svg|Dismiss glyph within interactive plate.
chip|remove-glyph|G|remove|chip|258|267|.area-chip__remove svg|Remove glyph within control.
indicator|pulse|S|root|indicator|19|23|.area-indicator[data-processing]::before|Animated status halo, not decorative material glow.
indicator|count-text|T|root|indicator|3|13|.area-indicator--count text content|Count characters; status body is indicator/fill.
count|number|T|root|count|15|45|.area-count visible text content|Visible number; __label is screen-reader-only.
presence|status-glyph|G|root|presence|12|12|.area-presence svg|Semantic availability glyph.
accordionItem|chevron-plate|W|chevron|accordion|110|119|.area-accordion-item__chevron::before|Hover plate behind disclosure chevron, flush relative to trigger.
avatar|initials|T|root|display|9|34|.area-avatar fallback text|Initials replace image/icon; inherited ink over avatar backing.
skeleton|wrapped-box|S|root|display|366|386|.area-skeleton--wrap > *|Child boxes receive skeleton paint; child text and pseudos suppressed.
spinner|arc|S|root|display|246|254|.area-spinner::before|Rotating progress arc over ring track.
panel|resize-focus|K|resize|panel|351|359|.area-panel__resize:focus-visible::before|Focus-only grip pill; primary thumb/knob because it affords resizing.
tag|remove-glyph|G|remove|tag|108|108|.area-tag__remove svg|Remove icon ink.
tag|remove-hit|R|remove|tag|113|114|.area-tag__remove::after|Invisible expanded pointer target.
drawer|scrim|X|@host|drawer|38|43|.area-drawer__modal::backdrop|Modal occlusion behind drawer; no scrim for modeless drawer.
commandPalette|scrim|X|@host|command-palette|19|24|.area-command-palette__modal::backdrop|Modal-only backdrop behind panel.
card|media-pixels|G|media|surface|333|341|.area-card__media > :is(img,video)|Intrinsic media; glyph/media role is taxonomic, never a recoloring instruction.
card|media-scrim|X|media|surface|166|174|.area-card--immersive::before|Readability fade over media; scrim role, not a shadow.
card|list-row|C|list|surface|401|406|.area-card__list li|Structured list row layout.
card|list-glyph|G|list-row|surface|407|414|.area-card__list svg|Feature/check glyph in list row.
card|list-text|T|list-row|surface|392|406|.area-card__list li text|List copy, separate from row layout.
card|link-hit|T|link|surface|434|443|.area-card__link::after|Stretched invisible click target; focus outline is an edge, not a fill.
card|carousel-item|C|carousel|surface|521|530|.area-card__carousel > li|Card position in horizontal list; nested Card owns its material.
alert|link-text|T|link|surface|615|627|.area-alert__link a|Actual anchor ink in link wrapper.
dialog|scrim|X|@host|surface|819|824|.area-dialog__modal::backdrop|Backdrop of native modal wrapper, behind the dialog surface.
dialog|direct-scrim|X|@host|surface|889|889|.area-dialog::backdrop|Alternative direct-dialog markup; not stacked with wrapper backdrop.
popover|media-pixels|G|media|surface|1088|1089|.area-popover__media :is(img,video)|Intrinsic media inside surface.
tooltip|arrow|F|root|surface|1404|1417|.area-tooltip--arrow::after|Same surface continuation; flush to tooltip, never its own lift.
tooltip|copy|T|root|surface|1354|1391|.area-tooltip text content|Tooltip text; optional Kbd is a separate composition.
tooltip|pointer-bridge|C|root|surface|1576|1584|.area-tooltip[popover]::before|Invisible bridge for pointer travel; not scrim or shadow.
toaster|item|C|list|surface|1456|1467|.area-toaster__list > li|Position/animation wrapper; child Toast supplies surface.
tabs|selected-mark|S|tab|navigation|54|68|.area-tabs__tab::after|Selection underline; indicator, not structural divider.
table|head-cell|C|root|navigation|181|194|.area-table th|Header backing plus label; sort Button is a nested composition.
table|body-cell|C|root|navigation|166|179|.area-table td|Cell box with row rule; text/content treated separately.
table|cell-text|T|cell|navigation|153|174|.area-table :is(th,td) text|Inherits table ink unless child supplies another semantic tone.
table|row|W|root|navigation|232|234|.area-table tbody tr|Striped/selected/hover fill is flat row state, not raised-control material.
table|caption|T|root|navigation|235|235|.area-table caption|Table caption ink.
table|link-hit|T|link|navigation|207|212|.area-table__link::after|Invisible stretched row link target; focus outline remains an edge.
codeBlock|syntax-keyword|T|text|code|383|383|.area-syntax-keyword|Syntax ink retains semantic palette.
codeBlock|syntax-tag|T|text|code|384|384|.area-syntax-tag|Syntax ink retains semantic palette.
codeBlock|syntax-attr|T|text|code|385|385|.area-syntax-attr|Syntax ink retains semantic palette.
codeBlock|syntax-string|T|text|code|386|386|.area-syntax-string|Syntax ink retains semantic palette.
codeBlock|syntax-comment|T|text|code|387|387|.area-syntax-comment|Syntax ink retains semantic palette.
codeBlock|syntax-punct|T|text|code|388|388|.area-syntax-punct|Syntax ink retains semantic palette.
codeBlock|line-fill|S|line|code|329|342|.area-code-block__line--highlighted/added/removed|Semantic line highlight/diff ground, not a container material.
codeBlock|target-mark|S|line|code|350|354|.area-code-block__line:target|Inset strip is a line-target indicator, not bevel relief.
codeBlock|collapse-scrim|X|toggle|code|490|503|.area-code-block[data-collapsed] .area-code-block__toggle|Same-element gradient above code; no shadow or independent DOM part.
codeBlock|toggle-text|T|toggle|code|416|435|.area-code-block__toggle text content|Show more/less copy over footer or fade.
nav|selected-mark|S|item|nav|182|194|.area-nav--marker .area-nav__item::before|Selection edge marker; primary indicator/fill, not separator.
nav|action-glyph|G|actions|nav|284|287|.area-nav__actions svg|Disclosure glyph in a separate Button action.
colorPicker|heading-text|T|heading|color|406|406|.area-color-picker__heading text|Swatch group label; sibling add Button has its own plate.
colorPicker|slider-thumb-edge|E|slider-thumb|color|274|280|native thumb border and rings|Boundary paint on native thumb; Firefox equivalent at 301–306.
slider|thumb-edge|E|thumb|slider|224|249|native thumb border|Thumb border is distinct from center indicator and lift shadow.
select|picker-edge|E|picker|navigation|387|410|.area-select::picker(select) border|Native enhanced popup perimeter.
card|header-action-glyph|G|header-action|surface|295|303|.area-card__header-action > svg|Direct glyph path when header action itself is interactive.
input|file-button-text|T|file-button|input|171|184|::file-selector-button text|Native file-action label uses the button's text style.
avatar|rings|E|root|display|9|34|.area-avatar box-shadow|Active and overlap rings are edges without blur, not physical lift.
drawer|inner-edge|E|root|drawer|61|69|.area-drawer border-inline-start-width|Only the exposed inner edge gets a border; side variants rotate which edge it is.
hoverCard|meta-item|C|meta|hover-card|31|31|.area-hover-card__meta > *|Metadata item groups glyph and text supplied as content.
hoverCard|meta-text|T|meta-item|hover-card|21|31|.area-hover-card__meta text|Metadata ink; arbitrary embedded components keep their own roles.
fileUpload|icon-ink|G|icon|file-upload|60|60|.area-file-upload__icon > svg|Glyph inside painted housing.
fileUploadItem|icon-ink|G|icon|file-upload|60|60|.area-file-upload-item__icon > svg|Glyph inside painted housing; consumer media retains intrinsic pixels.
emptyState|icon-ink|G|icon|empty-state|70|74|.area-empty-state__icon > svg|Consumer glyph inside painted housing.
descriptionList|term-text|T|term|description-list|38|50|.area-description-list__term text|Label ink beside optional icon.
descriptionList|rule|D|item|description-list|81|88|.area-description-list__item::after|Between-item rule only in divided presentation.
boardCard|title-hit|T|title|board|158|158|.area-board-card__title::after|Invisible stretched link target; title ink is separate.
timelineItem|connector|D|root|timeline|52|59|.area-timeline-item:not(:last-child)::before|Structural timeline connector, absent on last item.
editableText|preview-text|T|preview|editable-text|22|43|.area-editable-text__preview text|Displayed editable value inside focus/hover plate.
editableText|input-text|T|input|editable-text|57|66|.area-editable-text__input value|Editable ink on selected field ground.
toggletip|hit|R|root|toggletip|65|67|.area-toggletip::after|Invisible expanded hit target.
toggletip|glyph|G|root|toggletip|50|52|.area-toggletip > svg|Trigger glyph; tooltip content is separate.
pagination|page-text|T|page|pagination|60|89|.area-pagination__page text|Page number ink separate from repeated state plate.
"""
