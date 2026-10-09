# Area material role map

Area snapshot: `6f896789a5200bcbd34fe87de458e60ca82141d6` · checked 2026-10-08. Research assignments, not owner approval.

78 manifest contracts; 65 component specs; 626 normalized part/layer records, including 15 nonpaint records; 107 explicit reuse bindings.

Read [method and limits](README.md) before applying this map. **Flush** is the default visual plane; a role named “raised control” or “recessed field/track” does not assert present relief. Parents are visual groups, not exact DOM parents. Edges are same-element paint, never additional strokes. Optional parts are a union across supported variants.

## Environment

| Part | Role | Parent → depth | Evidence / qualification |
| --- | --- | --- | --- |
| `page`<br>body | page | `@viewport` → flush | Library page ground, not a manifest family. [packages/styles/src/base.css:5](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/base.css#L5-L14) |
| `text`<br>body text | text | `page` → flush | Inherited text; component-local text roles refine it. [packages/styles/src/base.css:7](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/base.css#L7-L13) [docs/specs/typography.md:86](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/typography.md#L86-L107) |
| `selection`<br>::selection | indicator/fill | `text` → flush | Selected-text highlight; not a surface material. [packages/styles/src/base.css:16](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/base.css#L16-L19) |
| `placeholder`<br>::placeholder | text | `@host` → flush | Shared placeholder ink; per-field selectors may override it. [packages/styles/src/base.css:21](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/base.css#L21-L23) |
| `glyph`<br>[data-area-glyph] path | glyph | `@host` → flush | Shared icon ink. Intrinsic photo/video pixels retain content; they are not recolorable glyph paint. [packages/styles/src/base.css:25](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/base.css#L25-L36) [docs/specs/icons.md:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/icons.md#L3-L8) |
| `sr-only`<br>.area-sr-only | text | `@host` → flush | **No paint.** Accessible labels/live regions are not visible material parts. [packages/styles/src/base.css:39](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/base.css#L39-L55) |

## Families

 | Contract | Parts | Spec |
| --- | ---: | --- |
| [button](#button) | 4 | [docs/specs/button.md:80](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/button.md#L80-L98) |
| [buttonGroup](#buttongroup) | 2 | [docs/specs/button-group.md:18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/button-group.md#L18-L23) |
| [splitButton](#splitbutton) | 5 | [docs/specs/split-button.md:77](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/split-button.md#L77-L90) |
| [toolbar](#toolbar) | 4 | [docs/specs/toolbar.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/toolbar.md#L81-L99) |
| [alignmentPicker](#alignmentpicker) | 7 | [docs/specs/alignment-picker.md:68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/alignment-picker.md#L68-L81) |
| [colorPicker](#colorpicker) | 55 | [docs/specs/color-picker.md:70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-picker.md#L70-L88) |
| [calendar](#calendar) | 18 | [docs/specs/calendar.md:70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/calendar.md#L70-L88) |
| [colorSwatch](#colorswatch) | 4 | [docs/specs/color-swatch.md:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-swatch.md#L45-L56) |
| [colorSwatchPicker](#colorswatchpicker) | 4 | [docs/specs/color-swatch-picker.md:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-swatch-picker.md#L59-L71) |
| [colorField](#colorfield) | 3 | [docs/specs/color-field.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-field.md#L60-L73) |
| [field](#field) | 6 | [docs/specs/field.md:53](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/field.md#L53-L66) |
| [input](#input) | 14 | [docs/specs/input.md:61](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/input.md#L61-L77) |
| [numberField](#numberfield) | 10 | [docs/specs/number-field.md:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/number-field.md#L17-L22) |
| [inputGroup](#inputgroup) | 4 | [docs/specs/input-group.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/input-group.md#L57-L71) |
| [breadcrumb](#breadcrumb) | 12 | [docs/specs/breadcrumb.md:53](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/breadcrumb.md#L53-L64) |
| [treeView](#treeview) | 13 | [docs/specs/tree-view.md:65](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tree-view.md#L65-L81) |
| [composer](#composer) | 8 | [docs/specs/composer.md:39](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/composer.md#L39-L50) |
| [textarea](#textarea) | 4 | [docs/specs/textarea.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/textarea.md#L50-L62) |
| [select](#select) | 11 | [docs/specs/select.md:70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/select.md#L70-L85) |
| [checkbox](#checkbox) | 5 | [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/checkbox.md#L47-L65) |
| [checkboxGroup](#checkboxgroup) | 5 | [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/checkbox.md#L47-L65) |
| [radio](#radio) | 5 | [docs/specs/radio.md:48](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/radio.md#L48-L59) |
| [radioGroup](#radiogroup) | 5 | [docs/specs/radio.md:48](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/radio.md#L48-L59) |
| [switch](#switch) | 10 | [docs/specs/switch.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/switch.md#L50-L68) |
| [slider](#slider) | 12 | [docs/specs/slider.md:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/slider.md#L59-L70) |
| [sliderRange](#sliderrange) | 6 | [docs/specs/slider.md:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/slider.md#L59-L70) |
| [chip](#chip) | 14 | [docs/specs/chip.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/chip.md#L57-L73) |
| [chipGroup](#chipgroup) | 1 | [docs/specs/chip.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/chip.md#L57-L73) |
| [choiceLabel](#choicelabel) | 3 | [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/checkbox.md#L47-L65) |
| [badge](#badge) | 14 | [docs/specs/badge.md:124](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/badge.md#L124-L142) |
| [presence](#presence) | 3 | [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/indicator.md#L81-L99) |
| [indicatorAnchor](#indicatoranchor) | 3 | [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/indicator.md#L81-L99) |
| [indicator](#indicator) | 4 | [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/indicator.md#L81-L99) |
| [count](#count) | 3 | [docs/specs/count.md:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/count.md#L45-L55) |
| [accordionItem](#accordionitem) | 9 | [docs/specs/accordion.md:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/accordion.md#L64-L82) |
| [accordion](#accordion) | 1 | [docs/specs/accordion.md:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/accordion.md#L64-L82) |
| [badgeGroup](#badgegroup) | 4 | [docs/specs/badge-group.md:46](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/badge-group.md#L46-L64) |
| [avatar](#avatar) | 5 | [docs/specs/avatar.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/avatar.md#L57-L71) |
| [avatarGroup](#avatargroup) | 3 | [docs/specs/avatar.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/avatar.md#L57-L71) |
| [separator](#separator) | 1 | [docs/specs/separator.md:44](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/separator.md#L44-L57) |
| [skeleton](#skeleton) | 3 | [docs/specs/skeleton.md:56](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/skeleton.md#L56-L68) |
| [spinner](#spinner) | 2 | [docs/specs/spinner.md:43](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/spinner.md#L43-L50) |
| [progress](#progress) | 3 | [docs/specs/progress.md:44](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/progress.md#L44-L55) |
| [panel](#panel) | 26 | [docs/specs/panel.md:67](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/panel.md#L67-L85) |
| [propertyList](#propertylist) | 7 | [docs/specs/property-list.md:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/property-list.md#L15-L21) |
| [boxField](#boxfield) | 5 | [docs/specs/box-field.md:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/box-field.md#L17-L23) |
| [combobox](#combobox) | 6 | [docs/specs/combobox.md:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/combobox.md#L17-L23) |
| [customSelect](#customselect) | 10 | [docs/specs/custom-select.md:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/custom-select.md#L64-L82) |
| [tag](#tag) | 8 | [docs/specs/tag.md:28](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag.md#L28-L35) |
| [tagPicker](#tagpicker) | 9 | [docs/specs/tag-picker.md:51](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag-picker.md#L51-L69) |
| [datePicker](#datepicker) | 7 | [docs/specs/date-picker.md:40](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/date-picker.md#L40-L58) |
| [confirmDialog](#confirmdialog) | 1 | [docs/specs/confirm-dialog.md:29](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/confirm-dialog.md#L29-L34) |
| [drawer](#drawer) | 11 | [docs/specs/drawer.md:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/drawer.md#L15-L20) |
| [commandPalette](#commandpalette) | 18 | [docs/specs/command-palette.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/command-palette.md#L11-L18) |
| [contextMenu](#contextmenu) | 2 | [docs/specs/context-menu.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/context-menu.md#L11-L16) |
| [hoverCard](#hovercard) | 5 | [docs/specs/hover-card.md:12](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/hover-card.md#L12-L18) |
| [promptSuggestions](#promptsuggestions) | 7 | [docs/specs/prompt-suggestions.md:18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/prompt-suggestions.md#L18-L22) |
| [message](#message) | 5 | [docs/specs/message.md:14](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/message.md#L14-L20) |
| [scrollToLatest](#scrolltolatest) | 1 | [docs/specs/scroll-to-latest.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/scroll-to-latest.md#L11-L14) |
| [modelPicker](#modelpicker) | 2 | [docs/specs/model-picker.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/model-picker.md#L11-L16) |
| [card](#card) | 27 | [docs/specs/card.md:87](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/card.md#L87-L105) |
| [alert](#alert) | 10 | [docs/specs/alert.md:62](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/alert.md#L62-L80) |
| [dialog](#dialog) | 12 | [docs/specs/dialog.md:22](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/dialog.md#L22-L27) |
| [popover](#popover) | 11 | [docs/specs/popover.md:26](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/popover.md#L26-L31) |
| [menu](#menu) | 16 | [docs/specs/menu.md:14](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/menu.md#L14-L20) |
| [tooltip](#tooltip) | 5 | [docs/specs/tooltip.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tooltip.md#L60-L77) |
| [toast](#toast) | 8 | [docs/specs/toast.md:22](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/toast.md#L22-L27) |
| [toaster](#toaster) | 4 | [docs/specs/toast.md:22](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/toast.md#L22-L27) |
| [tabs](#tabs) | 9 | [docs/specs/tabs.md:61](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tabs.md#L61-L79) |
| [table](#table) | 11 | [docs/specs/table.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/table.md#L60-L78) |
| [tableWrapper](#tablewrapper) | 2 | [docs/specs/table.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/table.md#L60-L78) |
| [segmented](#segmented) | 6 | [docs/specs/segmented.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/segmented.md#L47-L65) |
| [code](#code) | 5 | [docs/specs/code.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/code.md#L50-L64) |
| [codeBlock](#codeblock) | 31 | [docs/specs/code-block.md:56](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/code-block.md#L56-L74) |
| [nav](#nav) | 13 | [docs/specs/nav.md:69](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/nav.md#L69-L87) |
| [token](#token) | 4 | [docs/specs/code.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/code.md#L50-L64) |
| [kbd](#kbd) | 3 | [docs/specs/kbd.md:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/kbd.md#L58-L73) |
| [kbdGroup](#kbdgroup) | 1 | [docs/specs/kbd.md:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/kbd.md#L58-L73) |

## button

`area-button` — Triggers an action. Manifest: [packages/styles/src/manifest.ts:36](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L36). Spec context: [docs/specs/button.md:80](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/button.md#L80-L98).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-button | raised control | `@host` → flush | All current variants explicitly omit shadows; raised-control is a material assignment, not current relief. [packages/styles/src/components/button.css:21](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L21-L97) [packages/styles/src/components/button.css:319](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L319-L320) |
| `icon`<br>.area-button__icon | glyph | `root` → flush |  [packages/styles/src/components/button.css:100](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L100-L107) |
| `label`<br>.area-button__label | text | `root` → flush |  [packages/styles/src/components/button.css:118](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L118-L122) |
| `root.edge`<br>.area-button [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/button.css:21](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L21-L97) [packages/styles/src/components/button.css:168](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L168-L172) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `icon` | [spinner](#spinner): `root` = recessed field/track; `arc` = indicator/fill | Loading replaces the icon; ring and arc remain flat to the icon slot. [packages/react/src/components/Button.tsx:91](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Button.tsx#L91) |
| `label` | [kbd](#kbd): `root` = container; `key` = text; `root.edge` = edge | Optional shortcut keycap inside Button; concentric corner, not an extra interactive control. [packages/styles/src/components/kbd.css:134](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/kbd.css#L134-L147) |

## buttonGroup

`area-button-group` — Joins related full-size button actions at shared edges. Manifest: [packages/styles/src/manifest.ts:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L59). Spec context: [docs/specs/button-group.md:18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/button-group.md#L18-L23).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-button-group | container | `@host` → flush | Layout/group shell; child Button shadows are suppressed. Shared dividers are separate paint. [packages/styles/src/components/button-group.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button-group.css#L3-L17) |
| `join`<br>> .area-button + .area-button::before | divider | `root` → flush | Shared segment seam; outline variant uses the buttons' borders instead. [packages/styles/src/components/button-group.css:73](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button-group.css#L73-L82) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Child buttons; group CSS removes independent shadows and manages shared seams. [packages/react/src/components/ButtonGroup.tsx:13](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ButtonGroup.tsx#L13-L16) |

## splitButton

`area-split-button` — Joins a default action to a menu of related actions. Manifest: [packages/styles/src/manifest.ts:67](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L67). Spec context: [docs/specs/split-button.md:77](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/split-button.md#L77-L90).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-split-button | container | `@host` → flush | Layout shell; action and trigger reuse Button; menu is a sibling overlay, not a third attached segment. [packages/styles/src/components/split-button.css:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/split-button.css#L11-L17) |
| `action`<br>.area-split-button__action | raised control | `root` → flush |  [packages/styles/src/components/split-button.css:19](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/split-button.css#L19-L20) |
| `trigger`<br>.area-split-button__trigger | raised control | `root` → flush |  [packages/styles/src/components/split-button.css:19](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/split-button.css#L19-L20) |
| `menu`<br>.area-split-button__menu | floating surface | `@host` → floating |  [packages/styles/src/components/split-button.css:109](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/split-button.css#L109-L117) |
| `join`<br>.area-split-button__trigger::before | divider | `root` → flush | Internal segment seam, not a control edge. [packages/styles/src/components/split-button.css:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/split-button.css#L45-L55) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `action` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Same-element Button specialization; no second root plate. [packages/react/src/components/SplitButton.tsx:107](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/SplitButton.tsx#L107-L112) |
| `trigger` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Same-element Button specialization, icon-only so label absent. [packages/react/src/components/SplitButton.tsx:114](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/SplitButton.tsx#L114-L116) |
| `menu` | [menu](#menu): `root` = floating surface; `item` = raised control; `icon` = glyph; `text` = text; `lines` = container; `description` = text; `label` = text; `separator` = divider; `shortcut` = text; `check` = glyph; `toggle` = recessed field/track; `sub-chevron` = glyph; `root.edge` = edge; `item.edge` = edge | Same-element Menu surface, optional consumer menu-item parts. [packages/react/src/components/SplitButton.tsx:117](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/SplitButton.tsx#L117-L120) |

## toolbar

`area-toolbar` — Groups commands with keyboard navigation and optional overflow. Manifest: [packages/styles/src/manifest.ts:76](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L76). Spec context: [docs/specs/toolbar.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/toolbar.md#L81-L99).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-toolbar | container | `@host` → flush | Plain is layout-only; surface adds a plate and shadow. A floating toolbar is a placement, not a new part. Depth exceptions: surface toolbar plate → raised [packages/styles/src/components/toolbar.css:32](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L32-L36). Alternate: floating surface. [packages/styles/src/components/toolbar.css:2](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L2-L25) |
| `group`<br>.area-toolbar__group | container | `root` → flush |  [packages/styles/src/components/toolbar.css:44](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L44) |
| `separator`<br>.area-toolbar__separator | divider | `root` → flush |  [packages/styles/src/components/toolbar.css:68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L68) |
| `root.edge`<br>.area-toolbar [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/toolbar.css:70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L70) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Overflow trigger; other commands are consumer-supplied children. [packages/react/src/components/Toolbar.tsx:111](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Toolbar.tsx#L111-L112) |
| `root` | [menu](#menu): `root` = floating surface; `item` = raised control; `icon` = glyph; `text` = text; `lines` = container; `description` = text; `label` = text; `separator` = divider; `shortcut` = text; `check` = glyph; `toggle` = recessed field/track; `sub-chevron` = glyph; `root.edge` = edge; `item.edge` = edge | Overflow menu is floating relative to host, not clipped inside toolbar. [packages/react/src/components/Toolbar.tsx:111](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Toolbar.tsx#L111-L112) |
| `root` | [select](#select): `root` = recessed field/track; `value` = text; `fallback-chevron` = glyph; `picker-icon` = glyph; `picker` = floating surface; `option` = raised control; `option-text` = text; `checkmark` = glyph; `group-label` = text; `picker-edge` = edge; `root.edge` = edge | Optional native field control in toolbar; picker remains floating. [packages/styles/src/components/toolbar.css:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L45-L47) |
| `group` | [segmented](#segmented): `root` = recessed field/track; `item` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge; `item.edge` = edge | Documented one-of-many toolbar composition; selected segment retains its own lift. [packages/styles/src/components/toolbar.css:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L59-L62) |
| `group` | [splitButton](#splitbutton): `root` = container; `action` = raised control; `trigger` = raised control; `menu` = floating surface; `join` = divider | Documented ghost split command; its menu floats relative to host. [packages/styles/src/components/toolbar.css:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/toolbar.css#L59-L62) |

## alignmentPicker

`area-alignment-picker` — Chooses one of nine physical alignment positions. Manifest: [packages/styles/src/manifest.ts:85](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L85). Spec context: [docs/specs/alignment-picker.md:68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/alignment-picker.md#L68-L81).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-alignment-picker | container | `@host` → flush |  [packages/styles/src/components/alignment-picker.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L9-L35) |
| `cell`<br>.area-alignment-picker__cell | raised control | `root` → flush |  [packages/styles/src/components/alignment-picker.css:42](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L42-L56) |
| `dot`<br>.area-alignment-picker__dot | indicator/fill | `cell` → flush | Idle dot becomes alignment bars when selected/previewed. Both communicate position, not a movable thumb. Alternate: glyph. [packages/styles/src/components/alignment-picker.css:68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L68-L74) |
| `bars`<br>.area-alignment-picker__dot > i | glyph | `dot` → flush | Selected/preview alignment marks replace the idle dot. [packages/styles/src/components/alignment-picker.css:78](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L78-L104) |
| `native-input`<br>.area-alignment-picker__cell > input | raised control | `cell` → flush | **No paint.** Invisible radio hit target; cell and marks own all visible paint. [packages/styles/src/components/alignment-picker.css:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L59-L66) |
| `root.edge`<br>.area-alignment-picker [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/alignment-picker.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L9-L35) |
| `cell.edge`<br>.area-alignment-picker__cell [same-element edge paint] | edge | `cell` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/alignment-picker.css:136](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L136-L140) [packages/styles/src/components/alignment-picker.css:145](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/alignment-picker.css#L145) |

## colorPicker

`area-color-picker` — Edits a color like Figma's fill picker, with spectrum, grid and slider views, six color models, a contrast check, a before/after preview and saved swatches. Manifest: [packages/styles/src/manifest.ts:97](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L97). Spec context: [docs/specs/color-picker.md:70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-picker.md#L70-L88).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-color-picker | container | `@host` → raised | Surface variant has a lifted shell; plain removes the shell. Embedding in an overlay changes contextual depth. Depth exceptions: surface shell → raised [packages/styles/src/components/color.css:242](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L242-L247); plain embedded picker → flush [packages/styles/src/components/color.css:248](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L248). Alternate: floating surface. [packages/styles/src/components/color.css:215](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L215-L239) |
| `header`<br>.area-color-picker__header | container | `root` → flush |  [packages/styles/src/components/color.css:249](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L249-L255) |
| `body`<br>.area-color-picker__body | container | `root` → flush |  [packages/styles/src/components/color.css:257](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L257) |
| `contrast`<br>.area-color-picker__contrast | container | `body` → flush |  [packages/styles/src/components/color.css:337](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L337) |
| `preview`<br>.area-color-picker__preview | container | `controls` → flush |  [packages/styles/src/components/color.css:355](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L355-L359) |
| `values`<br>.area-color-picker__values | container | `body` → flush |  [packages/styles/src/components/color.css:372](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L372) |
| `controls`<br>.area-color-picker__controls | container | `body` → flush |  [packages/styles/src/components/color.css:292](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L292) |
| `tracks`<br>.area-color-picker__tracks | container | `controls` → flush |  [packages/styles/src/components/color.css:293](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L293) |
| `channel-row`<br>.area-color-picker__channel-row | container | `tracks` → flush |  [packages/styles/src/components/color.css:332](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L332) |
| `swatches`<br>.area-color-picker__swatches | container | `root` → flush |  [packages/styles/src/components/color.css:393](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L393-L397) |
| `heading`<br>.area-color-picker__heading | container | `swatches` → flush |  [packages/styles/src/components/color.css:398](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L398) |
| `contrast-pair`<br>.area-color-picker__contrast-pair | indicator/fill | `contrast` → flush |  [packages/styles/src/components/color.css:338](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L338-L342) |
| `band`<br>.area-color-picker__band | indicator/fill | `area` → flush | SVG contrast mask, not a new container material; regions and edge have separate paint. [packages/styles/src/components/color.css:349](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L349) |
| `band-region`<br>.area-color-picker__band-region | indicator/fill | `band` → flush |  [packages/styles/src/components/color.css:351](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L351) [packages/react/src/components/ColorPicker.tsx:336](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L336-L340) |
| `area`<br>.area-color-picker__area | recessed field/track | `body` → flush | Color-coordinate field; gradient is semantic data, not an arbitrary decorative material fill. Alternate: indicator/fill. [packages/styles/src/components/color.css:259](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L259-L264) |
| `channel`<br>.area-color-picker__channel | recessed field/track | `area` → flush | **No paint.** Invisible range input for keyboard/pointer access; no independent material paint. [packages/styles/src/components/color.css:289](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L289) |
| `slider`<br>.area-color-picker__slider | recessed field/track | `channel-row` → flush |  [packages/styles/src/components/color.css:296](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L296-L300) |
| `hue`<br>.area-color-picker__hue | recessed field/track | `tracks` → flush | Hue ramp is the track paint, not a surface tint. Native thumb is separate. Alternate: indicator/fill. [packages/styles/src/components/color.css:308](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L308-L310) |
| `alpha`<br>.area-color-picker__alpha | recessed field/track | `tracks` → flush | Alpha ramp over a checker; preserve transparency information. Alternate: indicator/fill. [packages/styles/src/components/color.css:311](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L311-L314) |
| `model`<br>.area-color-picker__model | recessed field/track | `values` → flush |  [packages/styles/src/components/color.css:373](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L373) |
| `text-field`<br>.area-color-picker__text-field | recessed field/track | `fields` → flush |  [packages/styles/src/components/color.css:386](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L386) |
| `opacity`<br>.area-color-picker__opacity | recessed field/track | `fields` → flush |  [packages/styles/src/components/color.css:383](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L383) |
| `views`<br>.area-color-picker__views | recessed field/track | `body` → flush |  [packages/styles/src/components/color.css:334](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L334) |
| `fields`<br>.area-color-picker__fields | recessed field/track | `values` → flush |  [packages/styles/src/components/color.css:374](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L374-L376) |
| `contrast-level`<br>.area-color-picker__contrast-level | glyph | `contrast` → flush | Rating text and pass/fail glyph share this slot; split their foregrounds only if the markup separates them. Alternate: text. [packages/styles/src/components/color.css:346](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L346) |
| `band-edge`<br>.area-color-picker__band-edge | edge | `band` → flush |  [packages/styles/src/components/color.css:353](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L353) |
| `thumb`<br>.area-color-picker__thumb | thumb/knob | `area` → raised |  [packages/styles/src/components/color.css:267](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L267-L273) |
| `contrast-ratio`<br>.area-color-picker__contrast-ratio | text | `contrast` → flush |  [packages/styles/src/components/color.css:344](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L344) |
| `contrast-unit`<br>.area-color-picker__contrast-unit | text | `contrast-ratio` → flush |  [packages/styles/src/components/color.css:345](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L345) |
| `channel-label`<br>.area-color-picker__channel-label | text | `channel-row` → flush |  [packages/styles/src/components/color.css:333](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L333) |
| `note`<br>.area-color-picker__note | text | `body` → flush |  [packages/styles/src/components/color.css:371](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L371) |
| `preview-new`<br>.area-color-picker__preview-new | indicator/fill | `preview` → flush | Passive new-color sample (span role=img); checker and sample layers are listed separately. [packages/styles/src/components/color.css:360](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L360-L367) [packages/react/src/components/ColorPicker.tsx:353](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L353-L356) |
| `preview-original`<br>.area-color-picker__preview-original | raised control | `preview` → flush | Clickable restore sample; semantic color is not replaced by material fill. Alternate: indicator/fill. [packages/styles/src/components/color.css:360](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L360-L367) |
| `grid`<br>.area-color-picker__grid | container | `body` → flush | ColorSwatchPicker palette grid; cells carry semantic color samples, not a neutral panel fill. [packages/styles/src/components/color.css:335](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L335) |
| `slider-thumb`<br>.area-color-picker__slider::-webkit-slider-thumb | thumb/knob | `slider` → raised | Native thumb over channel track; Firefox equivalent is pinned separately. [packages/styles/src/components/color.css:274](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L274-L287) |
| `slider-thumb-moz`<br>.area-color-picker__slider::-moz-range-thumb | thumb/knob | `slider` → raised | Firefox implementation of the same physical thumb; not a second simultaneous thumb. [packages/styles/src/components/color.css:301](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L301-L306) |
| `new-checker`<br>.area-color-picker__preview-new::before | indicator/fill | `preview-new` → flush | Checker below the new color. [packages/styles/src/components/color.css:49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L49-L65) |
| `new-sample`<br>.area-color-picker__preview-new::after | indicator/fill | `preview-new` → flush | Semantic sample layer. [packages/styles/src/components/color.css:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L66-L69) |
| `original-checker`<br>.area-color-picker__preview-original::before | indicator/fill | `preview-original` → flush | Checker below original color. [packages/styles/src/components/color.css:49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L49-L65) |
| `original-sample`<br>.area-color-picker__preview-original::after | indicator/fill | `preview-original` → flush | Semantic sample layer on restore button. [packages/styles/src/components/color.css:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L66-L69) |
| `contrast-background`<br>.area-color-picker__contrast-pair > span | indicator/fill | `contrast-pair` → flush | Second color sample behind contrast comparison. [packages/styles/src/components/color.css:343](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L343) |
| `band-dots`<br>.area-color-picker__band pattern circle | indicator/fill | `band-region` → flush | Pattern defines semantic contrast-limit hatching; not decorative grain. [packages/styles/src/components/color.css:352](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L352) |
| `contrast-glyph`<br>.area-color-picker__contrast-level svg | glyph | `contrast-level` → flush | Pass/fail icon shares rating slot with text. [packages/styles/src/components/color.css:348](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L348) |
| `contrast-rating-text`<br>.area-color-picker__contrast-level text content | text | `contrast-level` → flush | AA/AAA rating label; primary parent role is glyph due to status icon. [packages/styles/src/components/color.css:346](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L346-L348) |
| `heading-text`<br>.area-color-picker__heading text | text | `heading` → flush | Swatch group label; sibling add Button has its own plate. [packages/styles/src/components/color.css:406](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L406) |
| `slider-thumb-edge`<br>native thumb border and rings | edge | `slider-thumb` → flush | Boundary paint on native thumb; Firefox equivalent at 301–306. [packages/styles/src/components/color.css:274](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L274-L280) |
| `root.edge`<br>.area-color-picker [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:215](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L215-L239) |
| `header.divider`<br>.area-color-picker__header [same-element divider paint] | divider | `header` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/color.css:249](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L249-L255) |
| `preview.edge`<br>.area-color-picker__preview [same-element edge paint] | edge | `preview` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:355](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L355-L359) |
| `swatches.divider`<br>.area-color-picker__swatches [same-element divider paint] | divider | `swatches` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/color.css:393](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L393-L397) |
| `contrast-pair.edge`<br>.area-color-picker__contrast-pair [same-element edge paint] | edge | `contrast-pair` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:338](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L338-L342) |
| `area.edge`<br>.area-color-picker__area [same-element edge paint] | edge | `area` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:259](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L259-L264) |
| `slider.edge`<br>.area-color-picker__slider [same-element edge paint] | edge | `slider` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:274](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L274-L281) [packages/styles/src/components/color.css:291](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L291) |
| `thumb.edge`<br>.area-color-picker__thumb [same-element edge paint] | edge | `thumb` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:267](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L267-L273) [packages/styles/src/components/color.css:290](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L290) |
| `preview-original.edge`<br>.area-color-picker__preview-original [same-element edge paint] | edge | `preview-original` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:370](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L370) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `views` | [segmented](#segmented): `root` = recessed field/track; `item` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge; `item.edge` = edge | Same-element view switch; selected item depth follows Segmented. [packages/react/src/components/ColorPicker.tsx:322](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L322-L323) |
| `grid` | [colorSwatchPicker](#colorswatchpicker): `root` = container; `cell` = raised control; `native-input` = raised control; `cell.edge` = edge | Palette composition; grid is not a bitmap/canvas. [packages/react/src/components/ColorPicker.tsx:346](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L346-L348) |
| `controls` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional eyedropper icon button, no visible label. [packages/react/src/components/ColorPicker.tsx:350](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L350-L351) |
| `model` | [select](#select): `root` = recessed field/track; `value` = text; `fallback-chevron` = glyph; `picker-icon` = glyph; `picker` = floating surface; `option` = raised control; `option-text` = text; `checkmark` = glyph; `group-label` = text; `picker-edge` = edge; `root.edge` = edge | Same-element model selector; native picker floats relative to host. [packages/react/src/components/ColorPicker.tsx:360](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L360-L362) |
| `fields` | [inputGroup](#inputgroup): `root` = recessed field/track; `root.edge` = edge; `root.divider` = divider | Same-element shared field shell. [packages/react/src/components/ColorPicker.tsx:364](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L364-L369) |
| `fields` | [numberField](#numberfield): `root` = recessed field/track; `control` = text; `unit` = text; `root.edge` = edge | Channel fields share group chrome; numeric ink and unit remain separate. [packages/react/src/components/ColorPicker.tsx:275](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L275-L278) |
| `text-field` | [input](#input): `root` = recessed field/track; `control` = text; `placeholder` = text; `root.edge` = edge | CSS/hex value text Input specialization. [packages/react/src/components/ColorPicker.tsx:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L66-L72) |
| `opacity` | [numberField](#numberfield): `root` = recessed field/track; `control` = text; `unit` = text; `root.edge` = edge | Percent field inside the same fields group. [packages/react/src/components/ColorPicker.tsx:366](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L366-L368) |
| `swatches` | [colorSwatchPicker](#colorswatchpicker): `root` = container; `cell` = raised control; `native-input` = raised control; `cell.edge` = edge | Saved color palette; inherit semantic samples and selection rings. [packages/react/src/components/ColorPicker.tsx:377](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L377-L378) |
| `heading` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional add-swatch icon control. [packages/react/src/components/ColorPicker.tsx:375](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorPicker.tsx#L375-L376) |

## calendar

`area-calendar` — Shows a month grid for choosing a date, a range or several dates. Manifest: [packages/styles/src/manifest.ts:104](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L104). Spec context: [docs/specs/calendar.md:70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/calendar.md#L70-L88).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-calendar | container | `@host` → raised | Surface has shadow-float; plain removes chrome. Inside DatePicker the parent supplies elevation. Depth exceptions: surface shell → raised [packages/styles/src/components/calendar.css:32](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L32-L46); plain inside DatePicker/another surface → flush [packages/styles/src/components/calendar.css:46](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L46). Alternate: floating surface. [packages/styles/src/components/calendar.css:4](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L4-L19) [packages/styles/src/components/calendar.css:32](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L32-L46) |
| `months`<br>.area-calendar__months | container | `root` → flush |  [packages/styles/src/components/calendar.css:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L47) |
| `month`<br>.area-calendar__month | container | `months` → flush |  [packages/styles/src/components/calendar.css:48](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L48) |
| `header`<br>.area-calendar__header | container | `month` → flush |  [packages/styles/src/components/calendar.css:49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L49-L53) |
| `grid`<br>.area-calendar__grid | container | `month` → flush |  [packages/styles/src/components/calendar.css:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L58) |
| `cell`<br>.area-calendar__cell | container | `grid` → flush |  [packages/styles/src/components/calendar.css:67](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L67) |
| `week`<br>.area-calendar__week | container | `root` → flush |  [packages/styles/src/components/calendar.css:138](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L138) |
| `nav`<br>.area-calendar__nav | container | `header` → flush |  [packages/styles/src/components/calendar.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L57) |
| `title`<br>.area-calendar__title | text | `header` → flush |  [packages/styles/src/components/calendar.css:56](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L56) |
| `weekday`<br>.area-calendar__weekday | text | `grid` → flush |  [packages/styles/src/components/calendar.css:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L59-L66) |
| `day-number`<br>.area-calendar__day-number | text | `day` → flush |  [packages/styles/src/components/calendar.css:147](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L147) [packages/react/src/components/Calendar.tsx:268](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Calendar.tsx#L268-L273) |
| `day-weekday`<br>.area-calendar__day-weekday | text | `day` → flush |  [packages/styles/src/components/calendar.css:146](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L146) |
| `day-month`<br>.area-calendar__day-month | text | `day` → flush |  [packages/styles/src/components/calendar.css:146](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L146) |
| `day`<br>.area-calendar__day | raised control | `cell` → flush | Interactive day plate; selected fill and range bridge express selection. No default physical lift. Alternate: indicator/fill. [packages/styles/src/components/calendar.css:69](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L69-L84) |
| `marker`<br>.area-calendar__marker | indicator/fill | `day` → flush |  [packages/styles/src/components/calendar.css:102](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L102-L106) |
| `range-fill`<br>.area-calendar__cell[data-range]::before | indicator/fill | `cell` → flush | Range bridge behind day control; flat selection paint, not a raised bar. [packages/styles/src/components/calendar.css:113](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L113-L129) |
| `root.edge`<br>.area-calendar [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/calendar.css:32](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L32-L42) |
| `day.edge`<br>.area-calendar__day [same-element edge paint] | edge | `day` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/calendar.css:90](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L90) [packages/styles/src/components/calendar.css:91](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/calendar.css#L91) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `nav` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Month previous/next icon buttons; week arrows live beside the week grid (232–245). No labels rendered. [packages/react/src/components/Calendar.tsx:262](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Calendar.tsx#L262-L265) |

## colorSwatch

`area-color-swatch` — Displays a color and reveals transparency over a checkerboard. Manifest: [packages/styles/src/manifest.ts:112](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L112). Spec context: [docs/specs/color-swatch.md:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-swatch.md#L45-L56).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-color-swatch | indicator/fill | `@host` → flush |  [packages/styles/src/components/color.css:21](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L21-L48) |
| `checker`<br>.area-color-swatch::before | indicator/fill | `root` → flush | Checker conveys alpha; preserve semantic pattern. [packages/styles/src/components/color.css:49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L49-L65) |
| `sample`<br>.area-color-swatch::after | indicator/fill | `root` → flush | Actual color overlays checker; do not replace with theme fill. [packages/styles/src/components/color.css:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L66-L69) |
| `root.edge`<br>.area-color-swatch [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:155](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L155-L158) [packages/styles/src/components/color.css:161](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L161-L166) |

## colorSwatchPicker

`area-color-swatch-picker` — Chooses one labeled color from a row or grid of swatches. Manifest: [packages/styles/src/manifest.ts:119](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L119). Spec context: [docs/specs/color-swatch-picker.md:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-swatch-picker.md#L59-L71).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-color-swatch-picker | container | `@host` → flush |  [packages/styles/src/components/color.css:75](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L75-L84) |
| `cell`<br>.area-color-swatch-picker__cell | raised control | `root` → flush |  [packages/styles/src/components/color.css:90](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L90-L104) |
| `native-input`<br>.area-color-swatch-picker__cell > input | raised control | `cell` → flush | **No paint.** Invisible radio input; the visible cell and swatch are separate. [packages/styles/src/components/color.css:107](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L107-L116) |
| `cell.edge`<br>.area-color-swatch-picker__cell [same-element edge paint] | edge | `cell` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/color.css:118](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L118-L121) [packages/styles/src/components/color.css:122](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L122-L126) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `cell` | [colorSwatch](#colorswatch): `root` = indicator/fill; `checker` = indicator/fill; `sample` = indicator/fill; `root.edge` = edge | Sample is inside radio cell; selection outline belongs to cell. [packages/react/src/components/ColorSwatchPicker.tsx:119](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorSwatchPicker.tsx#L119) |

## colorField

`area-color-field` — Edits a hex color beside its preview, with optional split opacity. Manifest: [packages/styles/src/manifest.ts:127](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L127). Spec context: [docs/specs/color-field.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/color-field.md#L60-L73).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-color-field | recessed field/track | `@host` → flush |  [packages/styles/src/components/color.css:169](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L169-L171) |
| `opacity`<br>.area-color-field__opacity | recessed field/track | `root` → flush |  [packages/styles/src/components/color.css:191](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L191-L197) |
| `opacity.divider`<br>.area-color-field__opacity [same-element divider paint] | divider | `opacity` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/color.css:191](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/color.css#L191-L197) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [input](#input): `root` = recessed field/track; `control` = text; `affix` = text; `icon` = glyph; `action-icon` = glyph; `action` = container; `action-button` = raised control; `action-tooltip` = floating surface; `file-button` = raised control; `placeholder` = text; `autofill-fill` = indicator/fill; `file-button-text` = text; `root.edge` = edge; `action-button.edge` = edge | Single field path; alpha path mounts this field in InputGroup and strips duplicate shell chrome. [packages/react/src/components/ColorField.tsx:68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorField.tsx#L68-L79) |
| `root` | [inputGroup](#inputgroup): `root` = recessed field/track; `root.edge` = edge; `root.divider` = divider | Alpha-only outer shell; Input and NumberField are same-level segments, not nested relief. [packages/react/src/components/ColorField.tsx:82](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorField.tsx#L82-L88) |
| `root` | [colorSwatch](#colorswatch): `root` = indicator/fill; `checker` = indicator/fill; `sample` = indicator/fill; `root.edge` = edge | Leading input visual is a semantic color sample. [packages/react/src/components/ColorField.tsx:77](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorField.tsx#L77) |
| `opacity` | [numberField](#numberfield): `root` = recessed field/track; `control` = text; `unit` = text; `root.edge` = edge | Percent segment inside alpha group; one outer edge, no independent field shadow. [packages/react/src/components/ColorField.tsx:85](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ColorField.tsx#L85-L88) |

## field

`area-field` — Labels and describes one form control, including its validation message. Manifest: [packages/styles/src/manifest.ts:136](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L136). Spec context: [docs/specs/field.md:53](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/field.md#L53-L66).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-field | container | `@host` → flush |  [packages/styles/src/components/field.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L9-L13) |
| `label`<br>.area-field__label | text | `root` → flush |  [packages/styles/src/components/field.css:20](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L20-L28) |
| `description`<br>.area-field__description | text | `root` → flush |  [packages/styles/src/components/field.css:35](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L35-L39) |
| `validation`<br>.area-field__validation | text | `root` → flush | Text may carry state-specific ink. Semantics remain authoritative. [packages/styles/src/components/field.css:41](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L41-L49) |
| `error`<br>.area-field__error | text | `root` → flush |  [packages/styles/src/components/field.css:41](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L41-L49) |
| `required`<br>.area-field__required | glyph | `label` → flush |  [packages/styles/src/components/field.css:31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L31-L33) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [textarea](#textarea): `root` = recessed field/track; `value` = text; `placeholder` = text; `root.edge` = edge | Optional multiline field child; arbitrary alternative inputs resolve to their own family map. [packages/styles/src/components/field.css:91](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L91-L97) |

## input

`area-input` — Accepts a single line of text. Manifest: [packages/styles/src/manifest.ts:146](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L146). Spec context: [docs/specs/input.md:61](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/input.md#L61-L77).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-input | recessed field/track | `@host` → flush |  [packages/styles/src/components/input.css:13](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L13-L58) |
| `control`<br>.area-input__control | text | `root` → flush | Transparent editable text inside the field shell; autofill can paint a background, not an inset relief. Alternate: recessed field/track. [packages/styles/src/components/input.css:139](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L139-L149) |
| `affix`<br>.area-input__affix | text | `root` → flush | Normally prefix/suffix text; arbitrary visual content requires its own child role. Alternate: glyph. [packages/styles/src/components/input.css:205](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L205-L210) |
| `icon`<br>.area-input__icon | glyph | `root` → flush |  [packages/styles/src/components/input.css:189](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L189-L197) |
| `action-icon`<br>.area-input__action-icon | glyph | `action-button` → flush |  [packages/styles/src/components/input.css:250](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L250-L255) |
| `action`<br>.area-input__action | container | `root` → flush | Layout wrapper; action-button owns the state plate and action-icon owns ink. [packages/styles/src/components/input.css:212](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L212-L217) |
| `action-button`<br>.area-input__action-button | raised control | `action` → flush |  [packages/styles/src/components/input.css:219](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L219-L236) |
| `action-tooltip`<br>.area-input__action-tooltip | floating surface | `@host` → floating |  [packages/react/src/components/Input.tsx:77](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Input.tsx#L77) [packages/styles/src/components/surface.css:1332](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1332-L1369) |
| `file-button`<br>.area-input__control::file-selector-button | raised control | `control` → flush | Native file action; transparent CSS plate with its own text. [packages/styles/src/components/input.css:171](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L171-L184) |
| `placeholder`<br>.area-input__control::placeholder | text | `control` → flush | Placeholder ink, never a disabled surface. [packages/styles/src/components/input.css:162](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L162) |
| `autofill-fill`<br>.area-input__control:autofill | indicator/fill | `control` → flush | Large inset shadow paints autofill ground; it is not physical recession. [packages/styles/src/components/input.css:160](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L160) |
| `file-button-text`<br>::file-selector-button text | text | `file-button` → flush | Native file-action label uses the button's text style. [packages/styles/src/components/input.css:171](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L171-L184) |
| `root.edge`<br>.area-input [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/input.css:13](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L13-L58) [packages/styles/src/components/input.css:74](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L74-L77) |
| `action-button.edge`<br>.area-input__action-button [same-element edge paint] | edge | `action-button` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/input.css:248](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input.css#L248) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `icon` | [spinner](#spinner): `root` = recessed field/track; `arc` = indicator/fill | Loading indicator replaces leading/trailing icon when requested. [packages/react/src/components/Input.tsx:139](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Input.tsx#L139) |
| `action-tooltip` | [tooltip](#tooltip): `root` = floating surface; `copy` = text; `arrow` = floating surface; `pointer-bridge` = container; `root.edge` = edge | Same Tooltip surface; arrow is optional donor feature, default has none. [packages/react/src/components/Input.tsx:77](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Input.tsx#L77) |

## numberField

`area-number-field` — Edits a number with optional units, stepping and scrubbing. Manifest: [packages/styles/src/manifest.ts:156](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L156). Spec context: [docs/specs/number-field.md:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/number-field.md#L17-L22).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-number-field | recessed field/track | `@host` → flush |  [packages/styles/src/components/number-field.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L3-L38) |
| `control`<br>.area-number-field__control | text | `root` → flush |  [packages/styles/src/components/number-field.css:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L66-L76) |
| `unit`<br>.area-number-field__unit | text | `root` → flush |  [packages/styles/src/components/number-field.css:84](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L84) |
| `scrub`<br>.area-number-field__scrub | glyph | `root` → flush | Glyph acts as a drag control. Extended hit target is not paint; no separate raised slab is present. Alternate: raised control. [packages/styles/src/components/number-field.css:94](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L94-L108) |
| `steppers`<br>.area-number-field__steppers | container | `root` → flush |  [packages/styles/src/components/number-field.css:119](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L119-L123) |
| `step`<br>.area-number-field__step | raised control | `steppers` → flush |  [packages/styles/src/components/number-field.css:124](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L124-L141) |
| `scrub-hit`<br>.area-number-field__scrub::after | glyph | `scrub` → flush | **No paint.** Invisible expanded drag target. [packages/styles/src/components/number-field.css:109](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L109) |
| `step-glyph`<br>.area-number-field__step svg | glyph | `step` → flush | Stepper arrow glyph inside control. [packages/styles/src/components/number-field.css:144](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L144) |
| `root.edge`<br>.area-number-field [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/number-field.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L3-L38) [packages/styles/src/components/number-field.css:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L45) |
| `step.edge`<br>.area-number-field__step [same-element edge paint] | edge | `step` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/number-field.css:150](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/number-field.css#L150) |

## inputGroup

`area-input-group` — Combines independently named controls and passive segments in one shell. Manifest: [packages/styles/src/manifest.ts:166](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L166). Spec context: [docs/specs/input-group.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/input-group.md#L57-L71).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-input-group | recessed field/track | `@host` → flush | One field shell around multiple controls. Child Input/NumberField/Select chrome is removed. Alternate: container. [packages/styles/src/components/input-group.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L3-L31) |
| `text`<br>.area-input-group__text | text | `root` → flush | Affix is text by default; data-visual substitutes a glyph. Alternate: glyph. [packages/styles/src/components/input-group.css:94](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L94-L106) |
| `root.edge`<br>.area-input-group [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/input-group.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L3-L31) [packages/styles/src/components/input-group.css:38](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L38) |
| `root.divider`<br>.area-input-group [same-element divider paint] | divider | `root` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/input-group.css:122](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L122) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [input](#input): `root` = recessed field/track; `control` = text; `affix` = text; `icon` = glyph; `action-icon` = glyph; `action` = container; `action-button` = raised control; `action-tooltip` = floating surface; `file-button` = raised control; `placeholder` = text; `autofill-fill` = indicator/fill; `file-button-text` = text; `root.edge` = edge; `action-button.edge` = edge | Optional grouped Input; donor root border/background suppressed so group paints shell once. [packages/styles/src/components/input-group.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L78) |
| `root` | [numberField](#numberfield): `root` = recessed field/track; `control` = text; `unit` = text; `scrub` = glyph; `steppers` = container; `step` = raised control; `scrub-hit` = glyph; `step-glyph` = glyph; `root.edge` = edge; `step.edge` = edge | Optional grouped NumberField; donor chrome suppressed, ink and controls remain. [packages/styles/src/components/input-group.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L78) |
| `root` | [select](#select): `root` = recessed field/track; `value` = text; `fallback-chevron` = glyph; `picker-icon` = glyph; `picker` = floating surface; `option` = raised control; `option-text` = text; `checkmark` = glyph; `group-label` = text; `picker-edge` = edge; `root.edge` = edge | Optional grouped native Select; outer field chrome suppressed, picker still floats. [packages/styles/src/components/input-group.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L57-L78) |
| `root` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional grouped action Button; chrome suppression follows pinned group rule. [packages/styles/src/components/input-group.css:80](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L80-L92) |

## breadcrumb

`area-breadcrumb` — Shows the current page within a hierarchy of links. Manifest: [packages/styles/src/manifest.ts:175](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L175). Spec context: [docs/specs/breadcrumb.md:53](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/breadcrumb.md#L53-L64).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-breadcrumb | container | `@host` → flush |  [packages/styles/src/components/breadcrumb.css:2](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L2) |
| `list`<br>.area-breadcrumb__list | container | `root` → flush |  [packages/styles/src/components/breadcrumb.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L3-L14) |
| `item`<br>.area-breadcrumb__item | container | `list` → flush |  [packages/styles/src/components/breadcrumb.css:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L15) |
| `link`<br>.area-breadcrumb__link | text | `item` → flush | Text link with a separate hover plate; do not apply a raised button body to its text. Alternate: raised control. [packages/styles/src/components/breadcrumb.css:23](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L23) |
| `page`<br>.area-breadcrumb__page | text | `item` → flush |  [packages/styles/src/components/breadcrumb.css:32](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L32) |
| `separator`<br>.area-breadcrumb__separator | glyph | `item` → flush |  [packages/styles/src/components/breadcrumb.css:33](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L33) |
| `chevron`<br>.area-breadcrumb__chevron | glyph | `item` → flush |  [packages/styles/src/components/breadcrumb.css:41](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L41) |
| `ellipsis`<br>.area-breadcrumb__ellipsis | glyph | `item` → flush | May be passive ellipsis or menu-trigger button; button hover plate is separate. Alternate: raised control. [packages/styles/src/components/breadcrumb.css:43](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L43) |
| `link-plate`<br>.area-breadcrumb__link::before | raised control | `link` → flush | Hover/press plate and focus ring drawn behind text; flush at rest. [packages/styles/src/components/breadcrumb.css:24](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L24-L31) |
| `ellipsis-plate`<br>button.area-breadcrumb__ellipsis::before | raised control | `ellipsis` → flush | Button-only hover/open plate. [packages/styles/src/components/breadcrumb.css:46](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L46-L51) |
| `link.edge`<br>.area-breadcrumb__link [same-element edge paint] | edge | `link` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/breadcrumb.css:30](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L30) |
| `ellipsis.edge`<br>.area-breadcrumb__ellipsis [same-element edge paint] | edge | `ellipsis` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/breadcrumb.css:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/breadcrumb.css#L50) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `ellipsis` | [menu](#menu): `root` = floating surface; `item` = raised control; `text` = text; `root.edge` = edge; `item.edge` = edge | Ellipsis-triggered Menu floats relative to host; ellipsis itself keeps breadcrumb plate. [packages/react/src/components/Breadcrumb.tsx:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Breadcrumb.tsx#L57) |

## treeView

`area-tree-view` — Navigates or selects items in an expandable hierarchy. Manifest: [packages/styles/src/manifest.ts:183](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L183). Spec context: [docs/specs/tree-view.md:65](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tree-view.md#L65-L81).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-tree-view | container | `@host` → flush |  [packages/styles/src/components/tree-view.css:2](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L2-L25) |
| `chevron`<br>.area-tree-view__chevron | glyph | `row` → flush |  [packages/styles/src/components/tree-view.css:67](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L67-L75) |
| `icon`<br>.area-tree-view__icon | glyph | `row` → flush |  [packages/styles/src/components/tree-view.css:91](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L91) |
| `check`<br>.area-tree-view__check | recessed field/track | `row` → flush |  [packages/styles/src/components/tree-view.css:118](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L118) |
| `label`<br>.area-tree-view__label | text | `row` → flush |  [packages/styles/src/components/tree-view.css:93](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L93) |
| `trailing`<br>.area-tree-view__trailing | container | `row` → flush | Consumer slot: quiet metadata, count or another component; recurse into supplied children. Alternate: text. [packages/styles/src/components/tree-view.css:94](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L94) |
| `actions`<br>.area-tree-view__actions | container | `row` → flush |  [packages/styles/src/components/tree-view.css:104](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L104-L108) |
| `row`<br>[role=treeitem] | raised control | `root` → flush | Selectable/navigation row; flat state plate and inset focus edge. [packages/styles/src/components/tree-view.css:28](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L28-L60) |
| `row-edge`<br>[role=treeitem]:focus-visible | edge | `row` → flush | Inset keyboard focus ring; no elevation. [packages/styles/src/components/tree-view.css:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L60) |
| `chevron-plate`<br>.area-tree-view__chevron::before | raised control | `chevron` → flush | Hover plate behind the chevron; smaller than its hit target. [packages/styles/src/components/tree-view.css:76](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L76-L89) |
| `chevron-hit`<br>.area-tree-view__chevron::after | glyph | `chevron` → flush | **No paint.** Invisible expanded pointer target. [packages/styles/src/components/tree-view.css:78](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L78) |
| `check-glyph`<br>.area-tree-view__check svg | glyph | `check` → flush | Check mark shown for selected row. [packages/styles/src/components/tree-view.css:126](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L126-L135) |
| `check.edge`<br>.area-tree-view__check [same-element edge paint] | edge | `check` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/tree-view.css:118](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L118) [packages/styles/src/components/tree-view.css:121](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L121) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `actions` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional trailing row commands; hover wash remains legible over selected row plate. [packages/styles/src/components/tree-view.css:89](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tree-view.css#L89-L113) |

## composer

`area-composer` — Writes and submits a message with optional action slots. Manifest: [packages/styles/src/manifest.ts:191](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L191). Spec context: [docs/specs/composer.md:39](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/composer.md#L39-L50).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-composer | recessed field/track | `@host` → flush | Editable field shell also groups action controls; no inset shadow is asserted. Alternate: container. [packages/styles/src/components/composer.css:2](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L2-L40) |
| `entry`<br>.area-composer__entry | container | `root` → flush |  [packages/styles/src/components/composer.css:52](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L52) |
| `actions`<br>.area-composer__actions | container | `root` → flush |  [packages/styles/src/components/composer.css:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L66) |
| `extras`<br>.area-composer__extras | container | `root` → flush |  [packages/styles/src/components/composer.css:71](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L71) |
| `footer`<br>.area-composer__footer | container | `root` → flush |  [packages/styles/src/components/composer.css:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L66) |
| `input`<br>.area-composer__input | text | `entry` → flush |  [packages/styles/src/components/composer.css:54](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L54-L59) |
| `submit`<br>.area-composer__submit | raised control | `actions` → flush |  [packages/react/src/components/Composer.tsx:111](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Composer.tsx#L111-L115) [packages/styles/src/components/button.css:61](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/button.css#L61-L98) |
| `root.edge`<br>.area-composer [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/composer.css:2](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L2-L40) [packages/styles/src/components/composer.css:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/composer.css#L45) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `submit` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Same-element icon-only submit/stop Button, label absent. [packages/react/src/components/Composer.tsx:111](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Composer.tsx#L111-L115) |

## textarea

`area-textarea` — Accepts multiple lines of text. Manifest: [packages/styles/src/manifest.ts:201](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L201). Spec context: [docs/specs/textarea.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/textarea.md#L50-L62).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-textarea | recessed field/track | `@host` → flush |  [packages/styles/src/components/textarea.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/textarea.css#L9-L55) |
| `value`<br>.area-textarea text content | text | `root` → flush | Editable value over field ground; native resize grip is browser-owned. [packages/styles/src/components/textarea.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/textarea.css#L9-L49) |
| `placeholder`<br>.area-textarea::placeholder | text | `root` → flush | Placeholder ink. [packages/styles/src/components/textarea.css:79](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/textarea.css#L79) |
| `root.edge`<br>.area-textarea [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/textarea.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/textarea.css#L9-L55) [packages/styles/src/components/textarea.css:83](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/textarea.css#L83-L86) |

## select

`area-select` — Picks one value from a list. Manifest: [packages/styles/src/manifest.ts:216](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L216). Spec context: [docs/specs/select.md:70](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/select.md#L70-L85).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-select | recessed field/track | `@host` → flush |  [packages/styles/src/components/navigation.css:243](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L243-L293) |
| `value`<br>.area-select selected text | text | `root` → flush | Native selected option string on field surface. [packages/styles/src/components/navigation.css:243](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L243-L285) |
| `fallback-chevron`<br>.area-select background-image | glyph | `root` → flush | SVG chevron in classic select path; replaced in base-select branch. [packages/styles/src/components/navigation.css:286](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L286-L297) |
| `picker-icon`<br>.area-select::picker-icon | glyph | `root` → flush | Enhanced native picker glyph; not an extra arrow beside fallback. [packages/styles/src/components/navigation.css:371](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L371-L386) |
| `picker`<br>.area-select::picker(select) | floating surface | `@host` → floating | Enhanced picker float; classic native popup paint is UA/OS-owned, not specified here. [packages/styles/src/components/navigation.css:387](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L387-L410) |
| `option`<br>.area-select option | raised control | `picker` → flush | Flat native option row with selection/hover fill. [packages/styles/src/components/navigation.css:432](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L432-L464) |
| `option-text`<br>.area-select option text content | text | `option` → flush | Option text ink; chosen mark is separate. [packages/styles/src/components/navigation.css:432](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L432-L464) |
| `checkmark`<br>.area-select option::checkmark | glyph | `option` → flush | Native selected marker in enhanced picker. [packages/styles/src/components/navigation.css:465](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L465-L476) |
| `group-label`<br>.area-select optgroup | text | `picker` → flush | Group label font; option rows remain their own controls. [packages/styles/src/components/navigation.css:477](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L477-L488) |
| `picker-edge`<br>.area-select::picker(select) border | edge | `picker` → flush | Native enhanced popup perimeter. [packages/styles/src/components/navigation.css:387](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L387-L410) |
| `root.edge`<br>.area-select [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/input-group.css:42](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L42) [packages/styles/src/components/input-group.css:73](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/input-group.css#L73-L79) |

## checkbox

`area-checkbox` — Toggles a single independent option. Manifest: [packages/styles/src/manifest.ts:227](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L227). Spec context: [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/checkbox.md#L47-L65).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-checkbox | container | `@host` → flush | Row is layout-only; card/tile variants add a selectable container plate. Native box remains separate. Alternate: raised control. [packages/styles/src/components/choice.css:4](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L4-L14) |
| `control`<br>.area-checkbox__control | recessed field/track | `root` → flush |  [packages/styles/src/components/choice.css:36](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L36-L57) |
| `visual`<br>.area-checkbox__visual | glyph | `root` → flush | Optional leading visual/icon; this is not the checkmark. [packages/styles/src/components/choice.css:78](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L78-L88) |
| `mark`<br>.area-checkbox__control::after | glyph | `control` → flush | Check or indeterminate dash; fill is semantic checked state. [packages/styles/src/components/choice.css:176](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L176-L202) |
| `control.edge`<br>.area-checkbox__control [same-element edge paint] | edge | `control` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/choice.css:36](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L36-L57) [packages/styles/src/components/choice.css:123](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L123-L126) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [choiceLabel](#choicelabel): `root` = container; `title` = text; `description` = text | Optional title/description slots; children supplied by consumer. [packages/react/src/components/forms.tsx:153](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/forms.tsx#L153-L187) |

## checkboxGroup

`area-checkbox-group` — Groups related Checkbox options under one label. Manifest: [packages/styles/src/manifest.ts:236](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L236). Spec context: [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/checkbox.md#L47-L65).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-checkbox-group | container | `@host` → flush |  [packages/styles/src/components/choice.css:290](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L290-L299) |
| `legend`<br>.area-checkbox-group__legend | text | `root` → flush |  [packages/styles/src/components/choice.css:301](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L301-L308) |
| `description`<br>.area-checkbox-group__description | text | `root` → flush |  [packages/styles/src/components/choice.css:311](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L311-L317) |
| `validation`<br>.area-checkbox-group__validation | text | `root` → flush |  [packages/styles/src/components/choice.css:311](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L311-L317) |
| `options`<br>.area-checkbox-group__options | container | `root` → flush |  [packages/styles/src/components/choice.css:362](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L362-L368) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `options` | [checkbox](#checkbox): `root` = container; `control` = recessed field/track; `visual` = glyph; `mark` = glyph; `control.edge` = edge | Group children reuse Checkbox; exact count/content is consumer supplied. [packages/react/src/components/forms.tsx:205](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/forms.tsx#L205-L223) |

## radio

`area-radio` — Picks one option from a mutually exclusive set. Manifest: [packages/styles/src/manifest.ts:245](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L245). Spec context: [docs/specs/radio.md:48](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/radio.md#L48-L59).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-radio | container | `@host` → flush | Row is layout-only; card/tile variants add a selectable container plate. Native circle remains separate. Alternate: raised control. [packages/styles/src/components/choice.css:4](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L4-L14) |
| `control`<br>.area-radio__control | recessed field/track | `root` → flush |  [packages/styles/src/components/choice.css:36](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L36-L57) |
| `visual`<br>.area-radio__visual | glyph | `root` → flush | Optional leading visual/icon; this is not the selection dot. [packages/styles/src/components/choice.css:78](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L78-L88) |
| `mark`<br>.area-radio__control::after | indicator/fill | `control` → flush | Selected center dot. [packages/styles/src/components/choice.css:176](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L176-L217) |
| `control.edge`<br>.area-radio__control [same-element edge paint] | edge | `control` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/choice.css:36](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L36-L57) [packages/styles/src/components/choice.css:123](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L123-L126) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [choiceLabel](#choicelabel): `root` = container; `title` = text; `description` = text | Optional title/description slots; children supplied by consumer. [packages/react/src/components/forms.tsx:318](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/forms.tsx#L318-L340) |

## radioGroup

`area-radio-group` — Groups mutually exclusive Radio options under one label. Manifest: [packages/styles/src/manifest.ts:254](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L254). Spec context: [docs/specs/radio.md:48](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/radio.md#L48-L59).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-radio-group | container | `@host` → flush |  [packages/styles/src/components/choice.css:290](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L290-L299) |
| `legend`<br>.area-radio-group__legend | text | `root` → flush |  [packages/styles/src/components/choice.css:301](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L301-L308) |
| `description`<br>.area-radio-group__description | text | `root` → flush |  [packages/styles/src/components/choice.css:311](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L311-L317) |
| `validation`<br>.area-radio-group__validation | text | `root` → flush |  [packages/styles/src/components/choice.css:311](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L311-L317) |
| `options`<br>.area-radio-group__options | container | `root` → flush |  [packages/styles/src/components/choice.css:324](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L324-L330) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `options` | [radio](#radio): `root` = container; `control` = recessed field/track; `visual` = glyph; `mark` = indicator/fill; `control.edge` = edge | Group children reuse Radio; exact count/content is consumer supplied. [packages/react/src/components/forms.tsx:280](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/forms.tsx#L280-L298) |

## switch

`area-switch` — Toggles a setting that takes effect immediately. Manifest: [packages/styles/src/manifest.ts:263](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L263). Spec context: [docs/specs/switch.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/switch.md#L50-L68).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-switch | container | `@host` → flush |  [packages/styles/src/components/switch.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L3-L40) |
| `control`<br>.area-switch__control | recessed field/track | `root` → flush | **No paint.** Invisible native input; track/thumb carry paint. Do not apply material to the hit target. [packages/styles/src/components/switch.css:49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L49-L63) |
| `track`<br>.area-switch__track | recessed field/track | `root` → flush | Field/track role; CSS fill and border read flat, with no inset relief. [packages/styles/src/components/switch.css:65](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L65-L83) |
| `thumb`<br>.area-switch__thumb | thumb/knob | `track` → raised |  [packages/styles/src/components/switch.css:100](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L100-L120) |
| `text`<br>.area-switch__text | container | `root` → flush |  [packages/styles/src/components/switch.css:145](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L145) |
| `label`<br>.area-switch__label | text | `text` → flush |  [packages/styles/src/components/switch.css:146](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L146) |
| `description`<br>.area-switch__description | text | `text` → flush |  [packages/styles/src/components/switch.css:147](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L147) |
| `loading`<br>.area-switch__loading | indicator/fill | `root` → flush |  [packages/styles/src/components/switch.css:148](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L148) [packages/react/src/components/Switch.tsx:106](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Switch.tsx#L106-L113) |
| `hover-plate`<br>.area-switch__track::before | indicator/fill | `track` → flush | State wash over track, not another material surface. [packages/styles/src/components/switch.css:88](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L88-L98) |
| `track.edge`<br>.area-switch__track [same-element edge paint] | edge | `track` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/switch.css:65](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L65-L83) [packages/styles/src/components/switch.css:123](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/switch.css#L123-L124) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `loading` | [spinner](#spinner): `root` = recessed field/track; `arc` = indicator/fill | Loading spinner is a sibling of track and text, not a second thumb. [packages/react/src/components/Switch.tsx:106](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Switch.tsx#L106-L110) |

## slider

`area-slider` — Picks a value from an ordered range. Manifest: [packages/styles/src/manifest.ts:288](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L288). Spec context: [docs/specs/slider.md:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/slider.md#L59-L70).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-slider | container | `@host` → flush |  [packages/styles/src/components/slider.css:18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L18-L46) |
| `label`<br>.area-slider__label | text | `root` → flush |  [packages/styles/src/components/slider.css:314](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L314-L320) |
| `value`<br>.area-slider__value | text | `root` → flush |  [packages/styles/src/components/slider.css:303](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L303-L312) |
| `control`<br>.area-slider__control | recessed field/track | `root` → flush | Native input is a hit/layout host; browser track/thumb pseudos carry visible material. [packages/styles/src/components/slider.css:177](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L177-L188) |
| `marks`<br>.area-slider__marks | container | `root` → flush |  [packages/styles/src/components/slider.css:51](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L51-L58) |
| `rail-webkit`<br>.area-slider__control::-webkit-slider-runnable-track | recessed field/track | `control` → flush | Unfilled rail and selected portion share one gradient; flat today. [packages/styles/src/components/slider.css:190](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L190-L199) |
| `rail-moz`<br>.area-slider__control::-moz-range-track | recessed field/track | `control` → flush | Firefox equivalent of the rail. [packages/styles/src/components/slider.css:200](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L200-L209) |
| `selected-fill`<br>native track gradient before --_pct | indicator/fill | `control` → flush | Logical paint layer inside native rail gradient, not a separate element. [packages/styles/src/components/slider.css:190](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L190-L209) |
| `thumb`<br>native slider thumb pseudos | thumb/knob | `control` → raised | Both browser implementations: surface, border, central dot, shadow-1. [packages/styles/src/components/slider.css:224](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L224-L249) |
| `thumb-dot`<br>thumb radial-gradient center | indicator/fill | `thumb` → flush | Selected-tone center is semantic value feedback, separate from thumb body. [packages/styles/src/components/slider.css:224](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L224-L249) |
| `tick`<br>.area-slider__marks i | indicator/fill | `marks` → flush | Tick marks; not structural dividers. [packages/styles/src/components/slider.css:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L59-L69) |
| `thumb-edge`<br>native thumb border | edge | `thumb` → flush | Thumb border is distinct from center indicator and lift shadow. [packages/styles/src/components/slider.css:224](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L224-L249) [packages/styles/src/components/slider.css:286](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L286-L295) |

## sliderRange

`area-slider-range` — Picks a range with two handles on one rail, with optional number fields (audit C-12). Manifest: [packages/styles/src/manifest.ts:279](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L279). Spec context: [docs/specs/slider.md:59](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/slider.md#L59-L70).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-slider-range | container | `@host` → flush |  [packages/styles/src/components/slider.css:98](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L98-L107) |
| `track`<br>.area-slider-range__track | recessed field/track | `root` → flush | Wrapper positions the rail and selected fill; its before/after pseudos own those paints. Alternate: container. [packages/styles/src/components/slider.css:108](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L108-L114) |
| `input`<br>.area-slider-range__input | recessed field/track | `root` → flush |  [packages/styles/src/components/slider.css:147](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L147-L151) |
| `end`<br>.area-slider-range__end | container | `root` → flush | End Slider wrapper; overlapping duplicate thumb can be hidden. [packages/react/src/components/SliderRange.tsx:103](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/SliderRange.tsx#L103-L107) |
| `rail`<br>.area-slider-range__track::after | recessed field/track | `track` → flush | Unfilled shared rail. [packages/styles/src/components/slider.css:120](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L120-L129) |
| `selected-fill`<br>.area-slider-range__track::before | indicator/fill | `track` → flush | Range interval fill; donor Slider rails are transparent. [packages/styles/src/components/slider.css:131](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/slider.css#L131-L140) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [slider](#slider): `root` = container; `label` = text; `value` = text; `control` = recessed field/track; `marks` = container; `rail-webkit` = recessed field/track; `rail-moz` = recessed field/track; `selected-fill` = indicator/fill; `thumb` = thumb/knob; `thumb-dot` = indicator/fill; `tick` = indicator/fill; `thumb-edge` = edge | Start Slider; its native rail paint is transparent, shared range rail supplies it. [packages/react/src/components/SliderRange.tsx:103](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/SliderRange.tsx#L103-L107) |
| `end` | [slider](#slider): `root` = container; `label` = text; `value` = text; `control` = recessed field/track; `marks` = container; `rail-webkit` = recessed field/track; `rail-moz` = recessed field/track; `selected-fill` = indicator/fill; `thumb` = thumb/knob; `thumb-dot` = indicator/fill; `tick` = indicator/fill; `thumb-edge` = edge | End Slider; native rails transparent; overlapping end thumb may be hidden. [packages/react/src/components/SliderRange.tsx:105](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/SliderRange.tsx#L105-L107) |
| `input` | [input](#input): `root` = recessed field/track; `control` = text; `placeholder` = text; `root.edge` = edge | Optional numeric end-value input; same-element Input specialization. [packages/react/src/components/SliderRange.tsx:88](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/SliderRange.tsx#L88-L91) |

## chip

`area-chip` — Toggles a filter, or holds an input value, in a set that wraps (each chip toggles on its own). Manifest: [packages/styles/src/manifest.ts:301](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L301). Spec context: [docs/specs/chip.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/chip.md#L57-L73).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-chip | raised control | `@host` → flush | Button/link chip is a control; removable input chip is a wrapper around label plus removal control. Alternate: container. [packages/styles/src/components/chip.css:19](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L19-L60) |
| `swatch`<br>.area-chip__swatch | indicator/fill | `root` → flush |  [packages/styles/src/components/chip.css:138](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L138-L149) |
| `icon`<br>.area-chip__icon | glyph | `root` → flush |  [packages/styles/src/components/chip.css:151](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L151-L160) |
| `trailing-icon`<br>.area-chip__trailing-icon | glyph | `root` → flush |  [packages/styles/src/components/chip.css:151](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L151-L160) |
| `avatar`<br>.area-chip__avatar | glyph | `root` → flush | Avatar/photo media: preserve intrinsic content; do not fill the image with a material. Alternate: container. [packages/styles/src/components/chip.css:165](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L165-L173) |
| `image`<br>.area-chip__image | glyph | `root` → flush | Intrinsic image is classified as glyph/media under the closed role vocabulary, not tinted icon ink. [packages/styles/src/components/chip.css:165](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L165-L173) |
| `label`<br>.area-chip__label | text | `root` → flush |  [packages/styles/src/inset.css:199](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/inset.css#L199-L207) |
| `action`<br>.area-chip__action | raised control | `root` → flush | An action can be a button or a passive trailing visual; only the former has a control plate. Alternate: glyph. [packages/styles/src/components/chip.css:206](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L206-L219) |
| `remove`<br>.area-chip__remove | raised control | `root` → flush |  [packages/styles/src/components/chip.css:206](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L206-L219) |
| `remove-glyph`<br>.area-chip__remove svg | glyph | `remove` → flush | Remove glyph within control. [packages/styles/src/components/chip.css:250](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L250-L259) |
| `root.edge`<br>.area-chip [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/chip.css:19](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L19-L60) [packages/styles/src/components/chip.css:76](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L76-L79) |
| `swatch.edge`<br>.area-chip__swatch [same-element edge paint] | edge | `swatch` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/chip.css:138](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L138-L149) |
| `action.edge`<br>.area-chip__action [same-element edge paint] | edge | `action` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/chip.css:245](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L245-L249) |
| `remove.edge`<br>.area-chip__remove [same-element edge paint] | edge | `remove` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/chip.css:245](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L245-L249) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `avatar` | [avatar](#avatar): `root` = container; `image` = glyph; `icon` = glyph; `initials` = text; `rings` = edge | Optional Avatar composition within chip; no extra outer chip plate. [packages/styles/src/components/chip.css:175](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L175-L183) |

## chipGroup

`area-chip-group` — Lays out a set of chips, wrapping onto as many lines as it needs. Manifest: [packages/styles/src/manifest.ts:311](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L311). Spec context: [docs/specs/chip.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/chip.md#L57-L73).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-chip-group | container | `@host` → flush |  [packages/styles/src/components/chip.css:272](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/chip.css#L272-L276) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [chip](#chip): `root` = raised control; `swatch` = indicator/fill; `icon` = glyph; `trailing-icon` = glyph; `avatar` = glyph; `image` = glyph; `label` = text; `action` = raised control; `remove` = raised control; `remove-glyph` = glyph; `root.edge` = edge; `swatch.edge` = edge; `action.edge` = edge; `remove.edge` = edge | Grouping contract; supplied Chip children retain all their own parts. [packages/react/src/components/primitives.tsx:1015](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1015-L1020) |

## choiceLabel

`area-choice-label` — The title and description beside a checkbox or radio (Switch draws its own). Manifest: [packages/styles/src/manifest.ts:318](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L318). Spec context: [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/checkbox.md#L47-L65).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-choice-label | container | `@host` → flush |  [packages/styles/src/components/choice.css:420](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L420-L424) |
| `title`<br>.area-choice-label__title | text | `root` → flush |  [packages/styles/src/components/choice.css:426](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L426-L430) |
| `description`<br>.area-choice-label__description | text | `root` → flush |  [packages/styles/src/components/choice.css:432](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/choice.css#L432-L436) |

## badge

`area-badge` — Labels an item with a short status or metadata; optionally links to its details. Manifest: [packages/styles/src/manifest.ts:326](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L326). Spec context: [docs/specs/badge.md:124](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/badge.md#L124-L142).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-badge | container | `@host` → flush | Passive badge body by default; link/button variants are interactive without changing semantic tone. Depth exceptions: modern variant shadow → raised [packages/styles/src/components/badge.css:188](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L188). Alternate: raised control. [packages/styles/src/components/badge.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L3-L43) |
| `dot`<br>.area-badge__dot | indicator/fill | `root` → flush |  [packages/styles/src/components/badge.css:63](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L63) |
| `leading-icon`<br>.area-badge__leading-icon | glyph | `root` → flush |  [packages/styles/src/components/badge.css:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L58-L61) |
| `trailing-icon`<br>.area-badge__trailing-icon | glyph | `root` → flush |  [packages/styles/src/components/badge.css:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L58-L61) |
| `avatar`<br>.area-badge__avatar | glyph | `root` → flush | Intrinsic avatar image is glyph/media, not a recolorable status glyph. [packages/styles/src/components/badge.css:190](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L190) |
| `flag`<br>.area-badge__flag | glyph | `root` → flush | Intrinsic flag image is glyph/media; preserve its colors. [packages/styles/src/components/badge.css:190](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L190) |
| `label`<br>.area-badge__label | text | `root` → flush |  [packages/styles/src/components/badge.css:44](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L44) |
| `dismiss`<br>.area-badge__dismiss | raised control | `root` → flush |  [packages/styles/src/components/badge.css:196](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L196) |
| `dot-ink`<br>.area-badge__dot::before | indicator/fill | `dot` → flush | Painted status dot inside its sizing slot. [packages/styles/src/components/badge.css:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L64) |
| `hit`<br>:is(a,button).area-badge::after | raised control | `root` → flush | **No paint.** Invisible target expansion only for interactive badge. [packages/styles/src/components/badge.css:180](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L180-L181) |
| `dismiss-hit`<br>.area-badge__dismiss::after | raised control | `dismiss` → flush | **No paint.** Invisible expanded remove target. [packages/styles/src/components/badge.css:201](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L201-L202) |
| `dismiss-glyph`<br>.area-badge__dismiss svg | glyph | `dismiss` → flush | Dismiss glyph within interactive plate. [packages/styles/src/components/badge.css:197](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L197) |
| `root.edge`<br>.area-badge [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/badge.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L3-L43) [packages/styles/src/components/badge.css:179](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L179) |
| `dismiss.edge`<br>.area-badge__dismiss [same-element edge paint] | edge | `dismiss` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/badge.css:207](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L207) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `avatar` | [avatar](#avatar): `root` = container; `image` = glyph; `icon` = glyph; `initials` = text; `rings` = edge | Optional Avatar composition inside badge media slot; intrinsic media preserved. [packages/styles/src/components/badge.css:190](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L190-L192) |

## presence

`area-presence` — Shows availability with Area-drawn status glyphs at the icon line weight. Manifest: [packages/styles/src/manifest.ts:368](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L368). Spec context: [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/indicator.md#L81-L99).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-presence | indicator/fill | `@host` → flush | Status disc/ring and status glyph coexist; ring is edge, glyph is separate. Alternate: glyph. [packages/styles/src/components/presence.css:5](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/presence.css#L5-L11) |
| `status-glyph`<br>.area-presence svg | glyph | `root` → flush | Semantic availability glyph. [packages/styles/src/components/presence.css:12](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/presence.css#L12) |
| `root.edge`<br>.area-presence [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/indicator.css:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L64) |

## indicatorAnchor

`area-indicator-anchor` — Attaches a count or presence indicator to an accessibly named object. Manifest: [packages/styles/src/manifest.ts:375](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L375). Spec context: [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/indicator.md#L81-L99).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-indicator-anchor | container | `@host` → flush |  [packages/styles/src/components/indicator.css:26](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L26) |
| `indicator`<br>.area-indicator-anchor__indicator | container | `root` → flush | Positioning slot, not paint; the child Indicator or Presence paints status. Alternate: indicator/fill. [packages/styles/src/components/indicator.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L57-L63) |
| `indicator.edge`<br>.area-indicator-anchor__indicator [same-element edge paint] | edge | `indicator` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/indicator.css:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L81) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `indicator` | [indicator](#indicator): `root` = indicator/fill; `pulse` = indicator/fill; `count-text` = text; `root.edge` = edge | Positioned semantic Indicator; same-plane attachment with overlap ring, not a lifted popover. [packages/styles/src/components/indicator.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L57-L66) |
| `indicator` | [presence](#presence): `root` = indicator/fill; `status-glyph` = glyph; `root.edge` = edge | Alternative Presence child at same anchor, not simultaneous mandatory status. [packages/styles/src/components/indicator.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L57-L66) |
| `root` | [tabs](#tabs): `tab` = raised control; `label` = text; `icon` = glyph; `selected-mark` = indicator/fill; `tab.edge` = edge | Optional Tab as anchor content; layout rule does not add a new surface. [packages/styles/src/components/indicator.css:77](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L77) |

## indicator

`area-indicator` — Displays a compact notification count or activity dot. Manifest: [packages/styles/src/manifest.ts:339](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L339). Spec context: [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/indicator.md#L81-L99).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-indicator | indicator/fill | `@host` → flush | Dot or count disc; count characters get a separate text row. Alternate: text. [packages/styles/src/components/indicator.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L3) |
| `pulse`<br>.area-indicator[data-processing]::before | indicator/fill | `root` → flush | Animated status halo, not decorative material glow. [packages/styles/src/components/indicator.css:19](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L19-L23) |
| `count-text`<br>.area-indicator--count text content | text | `root` → flush | Count characters; status body is indicator/fill. [packages/styles/src/components/indicator.css:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L3-L13) |
| `root.edge`<br>.area-indicator [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/indicator.css:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/indicator.css#L15) |

## count

`area-count` — Shows how many items the element it sits in holds, beside that element's label. Manifest: [packages/styles/src/manifest.ts:346](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L346). Spec context: [docs/specs/count.md:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/count.md#L45-L55).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-count | indicator/fill | `@host` → flush | Numerical status plate; text is separate from the plate. Alternate: text. [packages/styles/src/components/count.css:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/count.css#L15-L52) |
| `label`<br>.area-count__label | text | `root` → flush | **No paint.** Visually hidden accessible label; excluded from material paint. [packages/styles/src/components/count.css:76](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/count.css#L76-L86) |
| `number`<br>.area-count visible text content | text | `root` → flush | Visible number; __label is screen-reader-only. [packages/styles/src/components/count.css:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/count.css#L15-L45) |

## accordionItem

`area-accordion-item` — One collapsible: shows or hides content under a title the reader clicks. Manifest: [packages/styles/src/manifest.ts:354](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L354). Spec context: [docs/specs/accordion.md:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/accordion.md#L64-L82).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-accordion-item | container | `@host` → flush |  [packages/styles/src/components/accordion.css:12](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L12-L22) |
| `heading`<br>.area-accordion-item__heading | container | `root` → flush |  [packages/styles/src/components/accordion.css:72](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L72) |
| `content`<br>.area-accordion-item__content | container | `root` → flush |  [packages/styles/src/components/accordion.css:127](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L127-L131) |
| `trigger`<br>.area-accordion-item__trigger | raised control | `heading` → flush |  [packages/styles/src/components/accordion.css:74](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L74-L89) |
| `chevron`<br>.area-accordion-item__chevron | glyph | `trigger` → flush |  [packages/styles/src/components/accordion.css:97](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L97-L106) |
| `label`<br>.area-accordion-item__label | text | `trigger` → flush |  [packages/styles/src/components/accordion.css:93](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L93) |
| `chevron-plate`<br>.area-accordion-item__chevron::before | raised control | `chevron` → flush | Hover plate behind disclosure chevron, flush relative to trigger. [packages/styles/src/components/accordion.css:110](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L110-L119) |
| `root.divider`<br>.area-accordion-item [same-element divider paint] | divider | `root` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/accordion.css:12](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L12-L22) |
| `trigger.edge`<br>.area-accordion-item__trigger [same-element edge paint] | edge | `trigger` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/accordion.css:90](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L90) |

## accordion

`area-accordion` — Stacks accordion items; opening one closes the others unless multiple. Manifest: [packages/styles/src/manifest.ts:362](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L362). Spec context: [docs/specs/accordion.md:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/accordion.md#L64-L82).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-accordion | container | `@host` → flush | Stack layout; each item owns its trigger, body and optional dividing edge. [packages/styles/src/components/accordion.css:159](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/accordion.css#L159) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [accordionItem](#accordionitem): `root` = container; `heading` = container; `content` = container; `trigger` = raised control; `chevron` = glyph; `label` = text; `chevron-plate` = raised control; `root.divider` = divider; `trigger.edge` = edge | Stack of item components; no extra accordion material shell. [packages/react/src/components/Accordion.tsx:101](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Accordion.tsx#L101-L120) |

## badgeGroup

`area-badge-group` — Wraps badges or collapses overflow behind a disclosure. Manifest: [packages/styles/src/manifest.ts:385](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L385). Spec context: [docs/specs/badge-group.md:46](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/badge-group.md#L46-L64).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-badge-group | container | `@host` → flush |  [packages/styles/src/components/badge.css:210](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L210) |
| `item`<br>.area-badge-group__item | container | `root` → flush |  [packages/styles/src/components/badge.css:213](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L213) |
| `overflow-trigger`<br>.area-badge-group__overflow-trigger | raised control | `root` → flush | Badge-shaped count acts as a button; shared Badge internal roles apply. Alternate: indicator/fill. [packages/styles/src/components/badge.css:215](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L215) |
| `overflow-content`<br>.area-badge-group__overflow-content | floating surface | `@host` → floating |  [packages/styles/src/components/badge.css:217](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/badge.css#L217-L218) [packages/styles/src/components/surface.css:957](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L957-L977) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `item` | [badge](#badge): `root` = container; `dot` = indicator/fill; `leading-icon` = glyph; `trailing-icon` = glyph; `avatar` = glyph; `flag` = glyph; `label` = text; `dismiss` = raised control; `dot-ink` = indicator/fill; `hit` = raised control; `dismiss-hit` = raised control; `dismiss-glyph` = glyph; `root.edge` = edge; `dismiss.edge` = edge | Visible and overflow badges retain Badge's own roles. [packages/react/src/components/BadgeGroup.tsx:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/BadgeGroup.tsx#L81-L85) |
| `overflow-trigger` | [badge](#badge): `root` = container; `label` = text; `root.edge` = edge | Same badge-shaped trigger, count label as text; root is a control in this context. [packages/react/src/components/BadgeGroup.tsx:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/BadgeGroup.tsx#L81-L85) |
| `overflow-content` | [popover](#popover): `root` = floating surface; `root.edge` = edge | Same-element Popover panel; contents are overflow badges. [packages/react/src/components/BadgeGroup.tsx:84](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/BadgeGroup.tsx#L84-L88) |

## avatar

`area-avatar` — Represents a user or entity. Manifest: [packages/styles/src/manifest.ts:393](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L393). Spec context: [docs/specs/avatar.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/avatar.md#L57-L71).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-avatar | container | `@host` → flush |  [packages/styles/src/components/display.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L9-L34) |
| `image`<br>.area-avatar__image | glyph | `root` → flush |  [packages/styles/src/components/display.css:36](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L36-L40) |
| `icon`<br>.area-avatar__icon | glyph | `root` → flush |  [packages/styles/src/components/display.css:42](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L42-L48) |
| `initials`<br>.area-avatar fallback text | text | `root` → flush | Initials replace image/icon; inherited ink over avatar backing. [packages/styles/src/components/display.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L9-L34) |
| `rings`<br>.area-avatar box-shadow | edge | `root` → flush | Active and overlap rings are edges without blur, not physical lift. [packages/styles/src/components/display.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L9-L34) [packages/styles/src/forced-colors.css:80](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L80-L82) |

## avatarGroup

`area-avatar-group` — Stacks related avatars and summarizes any hidden remainder. Manifest: [packages/styles/src/manifest.ts:406](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L406). Spec context: [docs/specs/avatar.md:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/avatar.md#L57-L71).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-avatar-group | container | `@host` → flush |  [packages/styles/src/components/display.css:81](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L81-L85) |
| `item`<br>.area-avatar-group__item | container | `root` → flush |  [packages/styles/src/components/display.css:87](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L87-L91) |
| `overflow`<br>.area-avatar-group__overflow | container | `root` → flush | Static Avatar with overflow count in current React; no button or lift is asserted. [packages/styles/src/components/display.css:87](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L87-L91) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `item` | [avatar](#avatar): `root` = container; `image` = glyph; `icon` = glyph; `initials` = text; `rings` = edge | Each visible Avatar paints its own content and overlap ring. [packages/react/src/components/primitives.tsx:137](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L137-L139) |
| `overflow` | [avatar](#avatar): `root` = container; `initials` = text | Same-element passive count Avatar; no interactive trigger in current implementation. [packages/react/src/components/primitives.tsx:139](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L139) |

## separator

`area-separator` — Divides related groups of content. Manifest: [packages/styles/src/manifest.ts:414](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L414). Spec context: [docs/specs/separator.md:44](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/separator.md#L44-L57).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-separator | divider | `@host` → flush |  [packages/styles/src/components/display.css:104](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L104-L109) |

## skeleton

`area-skeleton` — Stands in for content that has not loaded. Manifest: [packages/styles/src/manifest.ts:423](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L423). Spec context: [docs/specs/skeleton.md:56](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/skeleton.md#L56-L68).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-skeleton | indicator/fill | `@host` → flush | Placeholder fill substitutes for content; wrap mode skeletonizes child boxes, not the display:contents root. Alternate: container. [packages/styles/src/components/display.css:152](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L152-L171) |
| `lines`<br>.area-skeleton__lines | container | `@host` → flush |  [packages/styles/src/components/display.css:203](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L203) |
| `wrapped-box`<br>.area-skeleton--wrap > * | indicator/fill | `root` → flush | Child boxes receive skeleton paint; child text and pseudos suppressed. [packages/styles/src/components/display.css:366](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L366-L386) |

## spinner

`area-spinner` — Indicates an action in progress with no known duration. Manifest: [packages/styles/src/manifest.ts:432](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L432). Spec context: [docs/specs/spinner.md:43](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/spinner.md#L43-L50).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-spinner | recessed field/track | `@host` → flush | Ring track is recessed-field/track by role only; current CSS is flat. Arc is separate indicator paint. Alternate: indicator/fill. [packages/styles/src/components/display.css:226](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L226-L243) |
| `arc`<br>.area-spinner::before | indicator/fill | `root` → flush | Rotating progress arc over ring track. [packages/styles/src/components/display.css:246](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L246-L254) |

## progress

`area-progress` — Shows how far along a task is. Manifest: [packages/styles/src/manifest.ts:440](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L440). Spec context: [docs/specs/progress.md:44](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/progress.md#L44-L55).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-progress | recessed field/track | `@host` → flush | Flat track, not measured physical recess; bar is semantic progress paint. [packages/styles/src/components/display.css:274](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L274-L283) |
| `bar`<br>.area-progress__bar | indicator/fill | `root` → flush |  [packages/styles/src/components/display.css:294](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/display.css#L294-L301) |
| `root.edge`<br>.area-progress [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/forced-colors.css:69](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L69) |

## panel

`area-panel` — A titled surface of rows that act on something beside it. Manifest: [packages/styles/src/manifest.ts:449](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L449). Spec context: [docs/specs/panel.md:67](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/panel.md#L67-L85).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-panel | container | `@host` → raised | Raised by shadow-2; flush docking removes shadow and adopts page background. Depth exceptions: flush docked variant → flush [packages/styles/src/components/panel.css:75](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L75-L81). Alternate: page. [packages/styles/src/components/panel.css:18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L18-L67) |
| `resize`<br>.area-panel__resize | edge | `root` → flush | **No paint.** Invisible edge hit target; visible focus pill is separate. It behaves as a handle, not a permanent knob. Alternate: thumb/knob. [packages/styles/src/components/panel.css:312](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L312-L325) |
| `bar`<br>.area-panel__bar | container | `root` → flush |  [packages/styles/src/components/panel.css:85](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L85-L97) |
| `body`<br>.area-panel__body | container | `root` → flush |  [packages/styles/src/components/panel.css:116](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L116-L126) |
| `section`<br>.area-panel__section | container | `body` → flush |  [packages/styles/src/components/panel.css:147](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L147-L157) |
| `heading`<br>.area-panel__heading | container | `section` → flush |  [packages/styles/src/components/panel.css:164](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L164-L180) |
| `actions`<br>.area-panel__actions | container | `heading` → flush |  [packages/styles/src/components/panel.css:184](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L184) |
| `summary`<br>.area-panel__summary | container | `toggle` → flush | Mixed collapsed summary: text, swatches or controls; apply the child component roles. Alternate: text. [packages/styles/src/components/panel.css:228](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L228) |
| `rows`<br>.area-panel__rows | container | `section` → flush |  [packages/styles/src/components/panel.css:230](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L230) |
| `row`<br>.area-panel__row | container | `rows` → flush |  [packages/styles/src/components/panel.css:246](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L246-L252) |
| `row-controls`<br>.area-panel__row-controls | container | `row` → flush |  [packages/styles/src/components/panel.css:264](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L264-L270) |
| `row-action`<br>.area-panel__row-action | container | `row` → flush | Layout slot, not a button; the supplied Button owns its paint. [packages/styles/src/components/panel.css:275](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L275) |
| `stack`<br>.area-panel__stack | container | `@host` → flush |  [packages/styles/src/components/panel.css:285](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L285-L289) |
| `footer`<br>.area-panel__footer | container | `root` → flush |  [packages/styles/src/components/panel.css:295](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L295-L299) |
| `title`<br>.area-panel__title | text | `bar` → flush |  [packages/styles/src/components/panel.css:109](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L109-L114) |
| `heading-text`<br>.area-panel__heading-text | text | `heading` → flush |  [packages/styles/src/components/panel.css:183](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L183) |
| `toggle-text`<br>.area-panel__toggle-text | text | `toggle` → flush |  [packages/styles/src/components/panel.css:208](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L208) |
| `row-label`<br>.area-panel__row-label | text | `row` → flush |  [packages/styles/src/components/panel.css:253](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L253-L262) |
| `toggle`<br>.area-panel__toggle | raised control | `heading` → flush |  [packages/styles/src/components/panel.css:193](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L193-L207) |
| `chevron`<br>.area-panel__chevron | glyph | `toggle` → flush |  [packages/styles/src/components/panel.css:210](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L210-L221) |
| `resize-focus`<br>.area-panel__resize:focus-visible::before | thumb/knob | `resize` → flush | Focus-only grip pill; primary thumb/knob because it affords resizing. [packages/styles/src/components/panel.css:333](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L333-L341) |
| `root.edge`<br>.area-panel [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/panel.css:18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L18-L67) |
| `bar.divider`<br>.area-panel__bar [same-element divider paint] | divider | `bar` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/panel.css:85](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L85-L97) |
| `section.divider`<br>.area-panel__section [same-element divider paint] | divider | `section` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/panel.css:147](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L147-L157) |
| `footer.divider`<br>.area-panel__footer [same-element divider paint] | divider | `footer` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/panel.css:295](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L295-L299) |
| `toggle.edge`<br>.area-panel__toggle [same-element edge paint] | edge | `toggle` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/panel.css:209](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/panel.css#L209) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `row-controls` | [boxField](#boxfield): `root` = container; `label` = text; `fields` = container; `field` = recessed field/track; `toggle` = raised control | Optional property recipe; label/control roles remain separate. [packages/styles/src/components/box-field.css:36](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/box-field.css#L36) |
| `row-controls` | [field](#field): `root` = container; `label` = text; `description` = text; `validation` = text; `error` = text; `required` = glyph | Optional horizontal form row; field label and child control retain roles. [packages/styles/src/components/field.css:76](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L76-L107) |
| `row-controls` | [switch](#switch): `root` = container; `control` = recessed field/track; `track` = recessed field/track; `thumb` = thumb/knob; `text` = container; `label` = text; `description` = text; `loading` = indicator/fill; `hover-plate` = indicator/fill; `track.edge` = edge | Optional horizontal switch in inspector row. [packages/styles/src/components/field.css:107](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/field.css#L107-L109) |

## propertyList

`area-property-list` — Orders like properties (fills, strokes, effects) and moves them by handle or keyboard. Manifest: [packages/styles/src/manifest.ts:459](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L459). Spec context: [docs/specs/property-list.md:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/property-list.md#L15-L21).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-property-list | container | `@host` → flush |  [packages/styles/src/components/property-list.css:8](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/property-list.css#L8-L16) |
| `item`<br>.area-property-list__item | container | `root` → flush |  [packages/styles/src/components/property-list.css:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/property-list.css#L17-L23) |
| `value`<br>.area-property-list__value | container | `item` → flush |  [packages/styles/src/components/property-list.css:25](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/property-list.css#L25) |
| `actions`<br>.area-property-list__actions | container | `item` → flush |  [packages/styles/src/components/property-list.css:27](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/property-list.css#L27) |
| `handle`<br>.area-property-list__handle | glyph | `item` → flush | Drag grip glyph, only shown in active row contexts; do not add a slab by default. Alternate: raised control. [packages/styles/src/components/property-list.css:35](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/property-list.css#L35-L53) |
| `indicator`<br>.area-property-list__indicator | indicator/fill | `root` → flush | Insertion line is semantic feedback; primary indicator/fill, not a structural separator. Alternate: divider. [packages/styles/src/components/property-list.css:66](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/property-list.css#L66-L75) |
| `handle.edge`<br>.area-property-list__handle [same-element edge paint] | edge | `handle` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/property-list.css:61](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/property-list.css#L61) |

## boxField

`area-box-field` — Edits padding or corner radius linked, or one field per side or corner. Manifest: [packages/styles/src/manifest.ts:595](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L595). Spec context: [docs/specs/box-field.md:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/box-field.md#L17-L23).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-box-field | container | `@host` → flush |  [packages/styles/src/components/box-field.css:14](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/box-field.css#L14-L23) |
| `label`<br>.area-box-field__label | text | `root` → flush |  [packages/styles/src/components/box-field.css:28](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/box-field.css#L28-L35) |
| `fields`<br>.area-box-field__fields | container | `root` → flush |  [packages/styles/src/components/box-field.css:38](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/box-field.css#L38-L44) |
| `field`<br>.area-box-field__field | recessed field/track | `fields` → flush |  [packages/styles/src/components/box-field.css:46](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/box-field.css#L46) |
| `toggle`<br>.area-box-field__toggle | raised control | `root` → flush |  [packages/styles/src/components/box-field.css:49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/box-field.css#L49) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `field` | [numberField](#numberfield): `root` = recessed field/track; `control` = text; `unit` = text; `scrub` = glyph; `steppers` = container; `step` = raised control; `scrub-hit` = glyph; `step-glyph` = glyph; `root.edge` = edge; `step.edge` = edge | Same-element NumberField; optional unit/steppers depend on props. [packages/react/src/components/BoxField.tsx:105](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/BoxField.tsx#L105-L115) |
| `toggle` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Same-element icon-only expand/collapse button, label absent. [packages/react/src/components/BoxField.tsx:117](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/BoxField.tsx#L117-L119) |

## combobox

`area-combobox` — An editable field with suggestions that filter as you type. Manifest: [packages/styles/src/manifest.ts:527](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L527). Spec context: [docs/specs/combobox.md:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/combobox.md#L17-L23).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-combobox | container | `@host` → flush |  [packages/styles/src/components/combobox.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/combobox.css#L9) |
| `listbox`<br>.area-combobox__listbox | floating surface | `@host` → floating |  [packages/styles/src/components/combobox.css:16](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/combobox.css#L16-L23) |
| `option`<br>.area-combobox__option | raised control | `listbox` → flush |  [packages/react/src/components/Combobox.tsx:219](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Combobox.tsx#L219-L235) [packages/styles/src/components/surface.css:1105](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1105-L1137) |
| `description`<br>.area-combobox__description | text | `option` → flush |  [packages/styles/src/components/combobox.css:29](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/combobox.css#L29) |
| `empty`<br>.area-combobox__empty | text | `listbox` → flush |  [packages/styles/src/components/combobox.css:33](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/combobox.css#L33-L42) |
| `group`<br>.area-combobox__group | container | `listbox` → flush |  [packages/styles/src/components/combobox.css:45](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/combobox.css#L45) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [input](#input): `root` = recessed field/track; `control` = text; `affix` = text; `icon` = glyph; `action-icon` = glyph; `action` = container; `action-button` = raised control; `action-tooltip` = floating surface; `file-button` = raised control; `placeholder` = text; `autofill-fill` = indicator/fill; `file-button-text` = text; `root.edge` = edge; `action-button.edge` = edge | Editable field with optional icon/clear/loading slots. [packages/react/src/components/Combobox.tsx:251](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Combobox.tsx#L251-L265) |
| `listbox` | [menu](#menu): `root` = floating surface; `item` = raised control; `icon` = glyph; `text` = text; `check` = glyph; `label` = text; `root.edge` = edge; `item.edge` = edge | Menu paint reused by options, create row and group labels; wrapper instantiation at 270. [packages/react/src/components/Combobox.tsx:219](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Combobox.tsx#L219-L235) |

## customSelect

`area-custom-select` — Picks one value from a short list whose options carry icons, descriptions and groups. Manifest: [packages/styles/src/manifest.ts:537](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L537). Spec context: [docs/specs/custom-select.md:64](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/custom-select.md#L64-L82).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-custom-select | container | `@host` → flush |  [packages/styles/src/components/custom-select.css:10](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L10-L31) |
| `trigger`<br>.area-custom-select__trigger | recessed field/track | `root` → flush | Field-shaped button, even though it is not editable text; options remain controls in a Menu surface. Alternate: raised control. [packages/styles/src/components/custom-select.css:62](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L62-L89) |
| `listbox`<br>.area-custom-select__listbox | floating surface | `@host` → floating |  [packages/styles/src/components/custom-select.css:161](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L161-L166) |
| `icon`<br>.area-custom-select__icon | glyph | `trigger` → flush |  [packages/styles/src/components/custom-select.css:128](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L128-L134) |
| `chevron`<br>.area-custom-select__chevron | glyph | `trigger` → flush |  [packages/styles/src/components/custom-select.css:147](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L147-L155) |
| `value`<br>.area-custom-select__value | text | `trigger` → flush |  [packages/styles/src/components/custom-select.css:136](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L136-L142) |
| `group`<br>.area-custom-select__group | container | `listbox` → flush |  [packages/styles/src/components/custom-select.css:172](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L172) |
| `option`<br>.area-custom-select__option | raised control | `listbox` → flush |  [packages/react/src/components/CustomSelect.tsx:207](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/CustomSelect.tsx#L207-L216) [packages/styles/src/components/surface.css:1105](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1105-L1137) |
| `separator`<br>.area-custom-select__separator | divider | `listbox` → flush |  [packages/styles/src/components/custom-select.css:175](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L175) |
| `trigger.edge`<br>.area-custom-select__trigger [same-element edge paint] | edge | `trigger` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/custom-select.css:62](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L62-L89) [packages/styles/src/components/custom-select.css:99](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/custom-select.css#L99-L104) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `listbox` | [menu](#menu): `root` = floating surface; `item` = raised control; `icon` = glyph; `lines` = container; `text` = text; `description` = text; `check` = glyph; `label` = text; `separator` = divider; `root.edge` = edge; `item.edge` = edge | Single Menu surface with option body, description, chosen check, group label and dividers. [packages/react/src/components/CustomSelect.tsx:207](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/CustomSelect.tsx#L207-L241) |

## tag

`area-tag` — A coloured label for a chosen or typed value, optionally removable. Manifest: [packages/styles/src/manifest.ts:548](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L548). Spec context: [docs/specs/tag.md:28](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag.md#L28-L35).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-tag | container | `@host` → flush |  [packages/styles/src/components/tag.css:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L11-L43) |
| `icon`<br>.area-tag__icon | glyph | `root` → flush |  [packages/styles/src/components/tag.css:77](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L77) |
| `label`<br>.area-tag__label | text | `root` → flush |  [packages/styles/src/components/tag.css:79](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L79) |
| `remove`<br>.area-tag__remove | raised control | `root` → flush |  [packages/styles/src/components/tag.css:87](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L87-L107) |
| `remove-glyph`<br>.area-tag__remove svg | glyph | `remove` → flush | Remove icon ink. [packages/styles/src/components/tag.css:108](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L108) |
| `remove-hit`<br>.area-tag__remove::after | raised control | `remove` → flush | **No paint.** Invisible expanded pointer target. [packages/styles/src/components/tag.css:113](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L113-L114) |
| `root.edge`<br>.area-tag [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/tag.css:116](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L116) |
| `remove.edge`<br>.area-tag__remove [same-element edge paint] | edge | `remove` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/tag.css:111](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag.css#L111) |

## tagPicker

`area-tag-picker` — Picks several values, shown as coloured tags in the field, from a list that filters and can grow. Manifest: [packages/styles/src/manifest.ts:557](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L557). Spec context: [docs/specs/tag-picker.md:51](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tag-picker.md#L51-L69).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-tag-picker | container | `@host` → flush |  [packages/styles/src/components/tag-picker.css:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L11-L29) |
| `field`<br>.area-tag-picker__field | recessed field/track | `root` → flush |  [packages/styles/src/components/tag-picker.css:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L47-L69) |
| `input`<br>.area-tag-picker__input | text | `field` → flush |  [packages/styles/src/components/tag-picker.css:110](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L110-L122) |
| `hint`<br>.area-tag-picker__hint | text | `listbox` → flush |  [packages/styles/src/components/tag-picker.css:138](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L138) |
| `empty`<br>.area-tag-picker__empty | text | `listbox` → flush |  [packages/styles/src/components/tag-picker.css:144](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L144-L152) |
| `listbox`<br>.area-tag-picker__listbox | floating surface | `@host` → floating |  [packages/styles/src/components/tag-picker.css:130](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L130-L135) |
| `option`<br>.area-tag-picker__option | raised control | `listbox` → flush |  [packages/react/src/components/TagPicker.tsx:226](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/TagPicker.tsx#L226-L232) [packages/styles/src/components/surface.css:1105](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1105-L1137) |
| `create`<br>.area-tag-picker__create | raised control | `listbox` → flush |  [packages/styles/src/components/tag-picker.css:143](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L143) |
| `field.edge`<br>.area-tag-picker__field [same-element edge paint] | edge | `field` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/tag-picker.css:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L47-L69) [packages/styles/src/components/tag-picker.css:71](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/tag-picker.css#L71) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `field` | [tag](#tag): `root` = container; `icon` = glyph; `label` = text; `remove` = raised control; `remove-glyph` = glyph; `remove-hit` = raised control; `root.edge` = edge; `remove.edge` = edge | Chosen tokens are Tag (not Badge); removal is optional. [packages/react/src/components/TagPicker.tsx:192](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/TagPicker.tsx#L192-L195) |
| `listbox` | [menu](#menu): `root` = floating surface; `item` = raised control; `text` = text; `label` = text; `check` = glyph; `root.edge` = edge; `item.edge` = edge | Same Menu surface and rows; hint, create text, chosen check remain distinct. [packages/react/src/components/TagPicker.tsx:209](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/TagPicker.tsx#L209-L232) |
| `option` | [tag](#tag): `root` = container; `label` = text; `root.edge` = edge | Passive Tag within option; selection belongs to the Menu row. [packages/react/src/components/TagPicker.tsx:231](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/TagPicker.tsx#L231-L232) |
| `create` | [tag](#tag): `root` = container; `label` = text; `root.edge` = edge | Preview Tag follows the literal Create text. [packages/react/src/components/TagPicker.tsx:220](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/TagPicker.tsx#L220-L221) |

## datePicker

`area-date-picker` — Shows a date in a field and opens a calendar, with the date as text, to change it. Manifest: [packages/styles/src/manifest.ts:568](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L568). Spec context: [docs/specs/date-picker.md:40](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/date-picker.md#L40-L58).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-date-picker | container | `@host` → flush |  [packages/styles/src/components/date-picker.css:10](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L10-L29) |
| `trigger`<br>.area-date-picker__trigger | recessed field/track | `root` → flush | Field-shaped button; date value and calendar glyph remain separate ink. Alternate: raised control. [packages/styles/src/components/date-picker.css:51](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L51-L76) |
| `icon`<br>.area-date-picker__icon | glyph | `trigger` → flush |  [packages/styles/src/components/date-picker.css:111](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L111-L118) |
| `value`<br>.area-date-picker__value | text | `trigger` → flush |  [packages/styles/src/components/date-picker.css:121](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L121-L127) |
| `panel`<br>.area-date-picker__panel | floating surface | `@host` → floating |  [packages/styles/src/components/date-picker.css:141](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L141-L144) |
| `footer`<br>.area-date-picker__footer | container | `panel` → flush |  [packages/styles/src/components/date-picker.css:147](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L147-L152) |
| `trigger.edge`<br>.area-date-picker__trigger [same-element edge paint] | edge | `trigger` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/date-picker.css:51](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L51-L76) [packages/styles/src/components/date-picker.css:86](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/date-picker.css#L86-L89) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `panel` | [popover](#popover): `root` = floating surface; `root.edge` = edge | Same-element floating panel; do not apply an extra inner Popover body. [packages/react/src/components/DatePicker.tsx:119](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L119-L120) |
| `panel` | [input](#input): `root` = recessed field/track; `control` = text; `affix` = text; `icon` = glyph; `action-icon` = glyph; `action` = container; `action-button` = raised control; `action-tooltip` = floating surface; `file-button` = raised control; `placeholder` = text; `autofill-fill` = indicator/fill; `file-button-text` = text; `root.edge` = edge; `action-button.edge` = edge | Editable date text field inside panel. [packages/react/src/components/DatePicker.tsx:126](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L126-L129) |
| `panel` | [calendar](#calendar): `root` = container; `months` = container; `month` = container; `header` = container; `grid` = container; `cell` = container; `week` = container; `nav` = container; `title` = text; `weekday` = text; `day-number` = text; `day-weekday` = text; `day-month` = text; `day` = raised control; `marker` = indicator/fill; `range-fill` = indicator/fill; `root.edge` = edge; `day.edge` = edge | Plain Calendar: root flush and unpainted; keep days, markers, range and navigation roles. [packages/react/src/components/DatePicker.tsx:130](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L130-L133) |
| `footer` | [menu](#menu): `separator` = divider; `item` = raised control; `text` = text; `item.edge` = edge | Footer clear row and divider only; no nested Menu floating shell. [packages/react/src/components/DatePicker.tsx:134](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/DatePicker.tsx#L134-L140) |

## confirmDialog

`area-confirm-dialog` — Asks for a forced choice before an action that can't be undone. Manifest: [packages/styles/src/manifest.ts:579](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L579). Spec context: [docs/specs/confirm-dialog.md:29](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/confirm-dialog.md#L29-L34).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-confirm-dialog | floating surface | `@host` → floating | Specializes Dialog; inherited title/description/body/footer plus Cancel/confirm Buttons are referenced below. [packages/styles/src/components/confirm-dialog.css:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/confirm-dialog.css#L11) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [dialog](#dialog): `root` = floating surface; `modal` = container; `header` = container; `heading` = container; `title` = text; `description` = text; `body` = container; `footer` = container; `scrim` = scrim; `root.edge` = edge | Same Dialog shell and modal backdrop; showCloseButton=false, so no close action. [packages/react/src/components/ConfirmDialog.tsx:68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ConfirmDialog.tsx#L68-L73) |
| `root` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Cancel and confirm Buttons mounted in inherited footer. Loading icon only when busy. [packages/react/src/components/ConfirmDialog.tsx:71](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ConfirmDialog.tsx#L71-L72) |

## drawer

`area-drawer` — Slides a panel in from an edge of the screen for a task beside the page. Manifest: [packages/styles/src/manifest.ts:587](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L587). Spec context: [docs/specs/drawer.md:15](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/drawer.md#L15-L20).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-drawer | floating surface | `modal` → floating |  [packages/styles/src/components/drawer.css:46](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L46-L74) |
| `modal`<br>.area-drawer__modal | container | `@host` → flush | Transparent dialog wrapper; backdrop is absent in modeless presentation. [packages/styles/src/components/drawer.css:22](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L22-L36) |
| `header`<br>.area-drawer__header | container | `root` → flush |  [packages/styles/src/components/drawer.css:114](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L114-L120) |
| `heading`<br>.area-drawer__heading | container | `header` → flush |  [packages/styles/src/components/drawer.css:126](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L126) |
| `body`<br>.area-drawer__body | container | `root` → flush |  [packages/styles/src/components/drawer.css:140](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L140-L147) |
| `footer`<br>.area-drawer__footer | container | `root` → flush |  [packages/styles/src/components/drawer.css:148](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L148) |
| `title`<br>.area-drawer__title | text | `heading` → flush |  [packages/styles/src/components/drawer.css:128](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L128-L137) |
| `description`<br>.area-drawer__description | text | `heading` → flush |  [packages/styles/src/components/drawer.css:138](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L138) |
| `close`<br>.area-drawer__close | raised control | `header` → flush |  [packages/styles/src/components/drawer.css:122](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L122-L125) |
| `scrim`<br>.area-drawer__modal::backdrop | scrim | `@host` → floating | Modal occlusion behind drawer; no scrim for modeless drawer. [packages/styles/src/components/drawer.css:38](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L38-L43) |
| `inner-edge`<br>.area-drawer border-inline-start-width | edge | `root` → flush | Only the exposed inner edge gets a border; side variants rotate which edge it is. [packages/styles/src/components/drawer.css:61](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/drawer.css#L61-L69) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `close` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Same-element ghost icon button, label absent. [packages/react/src/components/Drawer.tsx:84](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Drawer.tsx#L84-L86) |

## commandPalette

`area-command-palette` — Searches actions and places from a shortcut, and runs the one you pick. Manifest: [packages/styles/src/manifest.ts:518](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L518). Spec context: [docs/specs/command-palette.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/command-palette.md#L11-L18).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-command-palette | floating surface | `modal` → floating | Modal is floating; inline variant is flush and removes shadow. Modal wrapper is transparent. Depth exceptions: inline presentation → flush [packages/styles/src/components/command-palette.css:86](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L86-L87). Alternate: container. [packages/styles/src/components/command-palette.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L57-L85) |
| `modal`<br>.area-command-palette__modal | container | `@host` → flush |  [packages/styles/src/components/command-palette.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L9-L18) |
| `search`<br>.area-command-palette__search | container | `root` → flush |  [packages/styles/src/components/command-palette.css:89](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L89-L98) |
| `list`<br>.area-command-palette__list | container | `root` → flush |  [packages/styles/src/components/command-palette.css:121](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L121-L130) |
| `footer`<br>.area-command-palette__footer | container | `root` → flush |  [packages/styles/src/components/command-palette.css:148](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L148-L165) |
| `group`<br>.area-command-palette__group | container | `list` → flush |  [packages/styles/src/components/command-palette.css:132](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L132) |
| `input`<br>.area-command-palette__input | text | `search` → flush |  [packages/styles/src/components/command-palette.css:107](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L107-L118) |
| `text`<br>.area-command-palette__text | text | `item` → flush |  [packages/styles/src/components/command-palette.css:136](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L136) |
| `description`<br>.area-command-palette__description | text | `item` → flush |  [packages/styles/src/components/command-palette.css:135](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L135) |
| `empty`<br>.area-command-palette__empty | text | `list` → flush |  [packages/styles/src/components/command-palette.css:139](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L139-L145) |
| `search-icon`<br>.area-command-palette__search-icon | glyph | `search` → flush |  [packages/styles/src/components/command-palette.css:99](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L99-L105) |
| `item`<br>.area-command-palette__item | raised control | `group` → flush |  [packages/styles/src/components/command-palette.css:131](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L131) |
| `hint-button`<br>.area-command-palette__hint-button | raised control | `footer` → flush |  [packages/styles/src/components/command-palette.css:169](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L169-L183) |
| `hint`<br>.area-command-palette__hint | container | `footer` → flush | Hint wrapper can contain text and Kbd keycaps. Alternate: text. [packages/styles/src/components/command-palette.css:166](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L166) |
| `scrim`<br>.area-command-palette__modal::backdrop | scrim | `@host` → floating | Modal-only backdrop behind panel. [packages/styles/src/components/command-palette.css:19](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L19-L24) |
| `root.edge`<br>.area-command-palette [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/command-palette.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L57-L85) |
| `search.divider`<br>.area-command-palette__search [same-element divider paint] | divider | `search` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/command-palette.css:89](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L89-L98) |
| `footer.divider`<br>.area-command-palette__footer [same-element divider paint] | divider | `footer` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/command-palette.css:148](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/command-palette.css#L148-L165) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `list` | [menu](#menu): `item` = raised control; `icon` = glyph; `text` = text; `shortcut` = text; `label` = text; `item.edge` = edge | Rows and group labels only; no nested Menu surface. [packages/react/src/components/CommandPalette.tsx:162](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/CommandPalette.tsx#L162-L195) |
| `hint` | [kbd](#kbd): `root` = container; `key` = text; `root.edge` = edge | Quiet keycaps inside clickable footer hints; flat to hint control. [packages/react/src/components/CommandPalette.tsx:204](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/CommandPalette.tsx#L204-L214) |
| `item` | [kbd](#kbd): `root` = container; `key` = text; `root.edge` = edge | Optional quiet shortcut keys in trailing Menu shortcut slot. [packages/react/src/components/CommandPalette.tsx:170](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/CommandPalette.tsx#L170) |

## contextMenu

`area-context-menu` — Opens a Menu where you right-click. Manifest: [packages/styles/src/manifest.ts:510](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L510). Spec context: [docs/specs/context-menu.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/context-menu.md#L11-L16).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-context-menu | container | `@host` → flush | display:contents wrapper, no material body; menu owns all overlay paint. [packages/styles/src/components/context-menu.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/context-menu.css#L9) |
| `menu`<br>.area-context-menu__menu | floating surface | `@host` → floating |  [packages/styles/src/components/context-menu.css:10](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/context-menu.css#L10-L20) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `menu` | [menu](#menu): `root` = floating surface; `item` = raised control; `icon` = glyph; `text` = text; `lines` = container; `description` = text; `label` = text; `separator` = divider; `shortcut` = text; `check` = glyph; `toggle` = recessed field/track; `sub-chevron` = glyph; `root.edge` = edge; `item.edge` = edge | Same-element Menu surface; child content supplied through Menu items. [packages/react/src/components/ContextMenu.tsx:113](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ContextMenu.tsx#L113-L116) |

## hoverCard

`area-hover-card` — Previews what a link points to while the pointer rests on it. Manifest: [packages/styles/src/manifest.ts:502](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L502). Spec context: [docs/specs/hover-card.md:12](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/hover-card.md#L12-L18).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-hover-card | floating surface | `@host` → floating | Popover surface reuse; identity/meta are content layout, not additional floating surfaces. [packages/react/src/components/HoverCard.tsx:74](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/HoverCard.tsx#L74-L82) [packages/styles/src/components/surface.css:957](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L957-L977) |
| `identity`<br>.area-hover-card__identity | container | `root` → flush |  [packages/styles/src/components/hover-card.css:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/hover-card.css#L17) |
| `meta`<br>.area-hover-card__meta | container | `root` → flush |  [packages/styles/src/components/hover-card.css:21](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/hover-card.css#L21-L30) |
| `meta-item`<br>.area-hover-card__meta > * | container | `meta` → flush | Metadata item groups glyph and text supplied as content. [packages/styles/src/components/hover-card.css:31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/hover-card.css#L31) |
| `meta-text`<br>.area-hover-card__meta text | text | `meta-item` → flush | Metadata ink; arbitrary embedded components keep their own roles. [packages/styles/src/components/hover-card.css:21](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/hover-card.css#L21-L31) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [popover](#popover): `root` = floating surface; `header` = container; `title` = text; `description` = text; `body` = container; `footer` = container; `media` = container; `media-pixels` = glyph; `arrow` = floating surface; `arrow-edge` = edge; `root.edge` = edge | Popover paint specialization; optional content/arrow parts only when supplied. [packages/react/src/components/HoverCard.tsx:69](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/HoverCard.tsx#L69-L83) |

## promptSuggestions

`area-prompt-suggestions` — Starter prompts under an empty composer. Manifest: [packages/styles/src/manifest.ts:494](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L494). Spec context: [docs/specs/prompt-suggestions.md:18](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/prompt-suggestions.md#L18-L22).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-prompt-suggestions | container | `@host` → flush |  [packages/styles/src/components/prompt-suggestions.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/prompt-suggestions.css#L9-L18) |
| `row`<br>.area-prompt-suggestions__row | container | `root` → flush |  [packages/styles/src/components/prompt-suggestions.css:19](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/prompt-suggestions.css#L19) |
| `dismiss`<br>.area-prompt-suggestions__dismiss | container | `row` → flush | Positioning slot; its child Button owns the control plate. [packages/styles/src/components/prompt-suggestions.css:74](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/prompt-suggestions.css#L74-L81) |
| `item`<br>.area-prompt-suggestions__item | raised control | `row` → flush |  [packages/styles/src/components/prompt-suggestions.css:20](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/prompt-suggestions.css#L20-L47) |
| `icon`<br>.area-prompt-suggestions__icon | glyph | `item` → flush |  [packages/styles/src/components/prompt-suggestions.css:63](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/prompt-suggestions.css#L63-L69) |
| `text`<br>.area-prompt-suggestions__text | text | `item` → flush |  [packages/styles/src/components/prompt-suggestions.css:71](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/prompt-suggestions.css#L71) |
| `item.edge`<br>.area-prompt-suggestions__item [same-element edge paint] | edge | `item` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/prompt-suggestions.css:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/prompt-suggestions.css#L60) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `row` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Chips presentation uses Button instead of list item markup. [packages/react/src/components/PromptSuggestions.tsx:39](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/PromptSuggestions.tsx#L39) |
| `dismiss` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Child ghost icon-only dismiss, no label. [packages/react/src/components/PromptSuggestions.tsx:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/PromptSuggestions.tsx#L50-L52) |

## message

`area-message` — One turn in a conversation: the person's bubble or the assistant's prose, with actions. Manifest: [packages/styles/src/manifest.ts:484](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L484). Spec context: [docs/specs/message.md:14](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/message.md#L14-L20).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-message | container | `@host` → flush |  [packages/styles/src/components/message.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/message.css#L9-L19) |
| `bubble`<br>.area-message__bubble | container | `root` → flush | User message paints a quiet bubble; assistant copy remains on the parent ground. [packages/styles/src/components/message.css:29](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/message.css#L29-L37) |
| `content`<br>.area-message__content | container | `bubble` → flush | Rich-text content slot, not a second bubble; embedded Code/CodeBlock keep their own roles. Alternate: text. [packages/styles/src/components/message.css:40](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/message.css#L40) |
| `actions`<br>.area-message__actions | container | `root` → flush |  [packages/styles/src/components/message.css:48](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/message.css#L48-L52) |
| `cursor`<br>.area-message__cursor | indicator/fill | `root` → flush |  [packages/styles/src/components/message.css:65](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/message.css#L65-L77) |

## scrollToLatest

`area-scroll-to-latest` — Returns a long conversation to its newest message. Manifest: [packages/styles/src/manifest.ts:476](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L476). Spec context: [docs/specs/scroll-to-latest.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/scroll-to-latest.md#L11-L14).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-scroll-to-latest | container | `@host` → floating | Floating positioning wrapper has no fill; nested Button is the visible control. Alternate: floating surface. [packages/styles/src/components/scroll-to-latest.css:10](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/scroll-to-latest.css#L10-L26) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Only painted child; outline pill, no extra shadow supplied by wrapper. [packages/react/src/components/ScrollToLatest.tsx:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ScrollToLatest.tsx#L58-L60) |

## modelPicker

`area-model-picker` — Chooses the model a message is sent with, from inside the composer. Manifest: [packages/styles/src/manifest.ts:468](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L468). Spec context: [docs/specs/model-picker.md:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/model-picker.md#L11-L16).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-model-picker | container | `@host` → flush |  [packages/styles/src/components/model-picker.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/model-picker.css#L9) |
| `trigger`<br>.area-model-picker__trigger | raised control | `root` → flush |  [packages/styles/src/components/model-picker.css:14](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/model-picker.css#L14) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `trigger` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Same-element ghost Button with selected model label and caret. [packages/react/src/components/ModelPicker.tsx:54](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ModelPicker.tsx#L54-L60) |
| `root` | [menu](#menu): `root` = floating surface; `item` = raised control; `text` = text; `lines` = container; `description` = text; `check` = glyph; `root.edge` = edge; `item.edge` = edge | Menu surface and radio-option rows; menu floats relative to host. [packages/react/src/components/ModelPicker.tsx:54](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/ModelPicker.tsx#L54-L64) |

## card

`area-card` — Groups related media, content and actions on one surface. Manifest: [packages/styles/src/manifest.ts:604](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L604). Spec context: [docs/specs/card.md:87](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/card.md#L87-L105).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-card | container | `@host` → flush |  Depth exceptions: Surface axis gives shadow-card a non-none lift → raised [packages/styles/src/components/surface.css:72](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L72-L102); Flat/no lift → flush [packages/styles/src/components/surface.css:72](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L72-L102). [packages/styles/src/components/surface.css:33](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L33-L103) |
| `title`<br>.area-card__title | text | `heading` → flush |  [packages/styles/src/components/surface.css:238](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L238-L246) |
| `description`<br>.area-card__description | text | `heading` → flush |  [packages/styles/src/components/surface.css:247](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L247-L254) |
| `value`<br>.area-card__value | text | `root` → flush |  [packages/styles/src/components/surface.css:262](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L262-L269) |
| `action`<br>.area-card__action | text | `root` → flush | Text link action, not a button plate. Alternate: raised control. [packages/styles/src/components/surface.css:533](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L533-L539) |
| `link`<br>.area-card__link | text | `root` → flush | Text link with stretched hit-target pseudo; focus edge can outline the card. Alternate: raised control. [packages/styles/src/components/surface.css:429](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L429-L433) |
| `content`<br>.area-card__content | container | `root` → flush |  [packages/styles/src/components/surface.css:226](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L226-L234) |
| `header`<br>.area-card__header | container | `root` → flush |  [packages/styles/src/components/surface.css:274](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L274-L279) |
| `heading`<br>.area-card__heading | container | `header` → flush |  [packages/styles/src/components/surface.css:280](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L280-L286) |
| `header-action`<br>.area-card__header-action | container | `header` → flush | Wrapper for supplied header action, not necessarily painted itself. Alternate: raised control. [packages/styles/src/components/surface.css:287](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L287-L293) |
| `footer`<br>.area-card__footer | container | `root` → flush |  [packages/styles/src/components/surface.css:469](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L469-L477) |
| `media`<br>.area-card__media | container | `root` → flush | Media slot/optional well; image or video retains intrinsic pixels. Well may look recessed without an inset shadow. Alternate: glyph. [packages/styles/src/components/surface.css:325](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L325-L332) |
| `overlay`<br>.area-card__overlay | container | `media` → flush | Positioned controls over media; wrapper is not a scrim or a separate panel. Depth exceptions: over media → floating [packages/styles/src/components/surface.css:367](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L367-L380). Alternate: floating surface. [packages/styles/src/components/surface.css:367](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L367-L376) |
| `list`<br>.area-card__list | container | `root` → flush |  [packages/styles/src/components/surface.css:392](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L392-L400) |
| `carousel`<br>.area-card__carousel | container | `@host` → flush |  [packages/styles/src/components/surface.css:489](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L489-L506) |
| `media-pixels`<br>.area-card__media > :is(img,video) | glyph | `media` → flush | Intrinsic media; glyph/media role is taxonomic, never a recoloring instruction. [packages/styles/src/components/surface.css:333](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L333-L341) |
| `media-scrim`<br>.area-card--immersive::before | scrim | `media` → flush | Readability fade over media; scrim role, not a shadow. [packages/styles/src/components/surface.css:166](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L166-L174) |
| `list-row`<br>.area-card__list li | container | `list` → flush | Structured list row layout. [packages/styles/src/components/surface.css:401](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L401-L406) |
| `list-glyph`<br>.area-card__list svg | glyph | `list-row` → flush | Feature/check glyph in list row. [packages/styles/src/components/surface.css:407](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L407-L414) |
| `list-text`<br>.area-card__list li text | text | `list-row` → flush | List copy, separate from row layout. [packages/styles/src/components/surface.css:392](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L392-L406) |
| `link-hit`<br>.area-card__link::after | text | `link` → flush | **No paint.** Stretched invisible click target; focus outline is an edge, not a fill. [packages/styles/src/components/surface.css:434](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L434-L443) |
| `carousel-item`<br>.area-card__carousel > li | container | `carousel` → flush | Card position in horizontal list; nested Card owns its material. [packages/styles/src/components/surface.css:521](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L521-L530) |
| `header-action-glyph`<br>.area-card__header-action > svg | glyph | `header-action` → flush | Direct glyph path when header action itself is interactive. [packages/styles/src/components/surface.css:295](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L295-L303) |
| `root.edge`<br>.area-card [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:33](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L33-L103) |
| `action.edge`<br>.area-card__action [same-element edge paint] | edge | `action` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:540](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L540-L543) |
| `link.edge`<br>.area-card__link [same-element edge paint] | edge | `link` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:428](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L428) [packages/styles/src/components/surface.css:449](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L449-L452) |
| `carousel.edge`<br>.area-card__carousel [same-element edge paint] | edge | `carousel` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:529](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L529-L532) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `header-action` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional child Button rather than directly interactive header-action slot. [packages/styles/src/components/surface.css:314](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L314-L315) |
| `footer` | [toolbar](#toolbar): `root` = container; `group` = container; `separator` = divider; `root.edge` = edge | Optional footer toolbar; plain toolbar remains layout-only. [packages/styles/src/components/surface.css:481](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L481-L485) |

## alert

`area-alert` — Draws attention to an important message in place. Manifest: [packages/styles/src/manifest.ts:616](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L616). Spec context: [docs/specs/alert.md:62](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/alert.md#L62-L80).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-alert | container | `@host` → flush |  [packages/styles/src/components/surface.css:545](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L545-L575) |
| `icon`<br>.area-alert__icon | glyph | `root` → flush |  [packages/styles/src/components/surface.css:579](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L579-L588) |
| `content`<br>.area-alert__content | container | `root` → flush |  [packages/styles/src/components/surface.css:590](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L590-L596) |
| `link`<br>.area-alert__link | container | `content` → flush | Layout wrapper; descendant anchor supplies visible text. Alternate: text. [packages/styles/src/components/surface.css:601](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L601-L604) |
| `actions`<br>.area-alert__actions | container | `root` → flush |  [packages/styles/src/components/surface.css:616](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L616-L623) |
| `dismiss`<br>.area-alert__dismiss | container | `root` → flush | Slot positions a child Button; avoids painting the wrapper twice. Alternate: raised control. [packages/styles/src/components/surface.css:744](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L744-L754) |
| `title`<br>.area-alert__title | text | `content` → flush |  [packages/styles/src/components/surface.css:598](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L598) |
| `description`<br>.area-alert__description | text | `content` → flush |  [packages/styles/src/components/surface.css:599](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L599) |
| `link-text`<br>.area-alert__link a | text | `link` → flush | Actual anchor ink in link wrapper. [packages/styles/src/components/surface.css:608](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L608-L615) |
| `root.edge`<br>.area-alert [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:545](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L545-L575) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `dismiss` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Child dismiss icon button, no label. [packages/react/src/components/primitives.tsx:205](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L205) |
| `actions` | [badge](#badge): `root` = container; `dot` = indicator/fill; `leading-icon` = glyph; `trailing-icon` = glyph; `avatar` = glyph; `flag` = glyph; `label` = text; `dismiss` = raised control; `dot-ink` = indicator/fill; `hit` = raised control; `dismiss-hit` = raised control; `dismiss-glyph` = glyph; `root.edge` = edge; `dismiss.edge` = edge | Optional banner status Badge, not a command button. [packages/styles/src/components/surface.css:679](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L679-L684) |

## dialog

`area-dialog` — Interrupts with content that requires a response. Manifest: [packages/styles/src/manifest.ts:625](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L625). Spec context: [docs/specs/dialog.md:22](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/dialog.md#L22-L27).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-dialog | floating surface | `modal` → floating |  [packages/styles/src/components/surface.css:852](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L852-L880) |
| `header`<br>.area-dialog__header | container | `root` → flush |  [packages/styles/src/components/surface.css:884](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L884-L891) |
| `heading`<br>.area-dialog__heading | container | `header` → flush |  [packages/styles/src/components/surface.css:894](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L894) |
| `body`<br>.area-dialog__body | container | `root` → flush |  [packages/styles/src/components/surface.css:934](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L934-L942) |
| `footer`<br>.area-dialog__footer | container | `root` → flush |  [packages/styles/src/components/surface.css:944](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L944-L951) |
| `modal`<br>.area-dialog__modal | container | `@host` → flush | Transparent native dialog top-layer wrapper; panel and backdrop own paint. [packages/styles/src/components/surface.css:787](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L787-L795) |
| `title`<br>.area-dialog__title | text | `heading` → flush |  [packages/styles/src/components/surface.css:910](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L910-L921) |
| `description`<br>.area-dialog__description | text | `heading` → flush |  [packages/styles/src/components/surface.css:923](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L923-L929) |
| `close`<br>.area-dialog__close | raised control | `header` → flush |  [packages/styles/src/components/surface.css:904](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L904-L907) |
| `scrim`<br>.area-dialog__modal::backdrop | scrim | `@host` → floating | Backdrop of native modal wrapper, behind the dialog surface. [packages/styles/src/components/surface.css:812](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L812-L817) |
| `direct-scrim`<br>.area-dialog::backdrop | scrim | `@host` → floating | Alternative direct-dialog markup; not stacked with wrapper backdrop. [packages/styles/src/components/surface.css:882](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L882) |
| `root.edge`<br>.area-dialog [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:852](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L852-L880) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `close` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Same-element ghost icon-only button. [packages/react/src/components/primitives.tsx:1594](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1594-L1597) |

## popover

`area-popover` — Floats rich, interactive content next to the element that opened it. Manifest: [packages/styles/src/manifest.ts:633](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L633). Spec context: [docs/specs/popover.md:26](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/popover.md#L26-L31).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-popover | floating surface | `@host` → floating |  [packages/styles/src/components/surface.css:957](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L957-L975) |
| `header`<br>.area-popover__header | container | `root` → flush |  [packages/styles/src/components/surface.css:1042](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1042-L1051) |
| `body`<br>.area-popover__body | container | `root` → flush |  [packages/styles/src/components/surface.css:1078](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1078) |
| `footer`<br>.area-popover__footer | container | `root` → flush |  [packages/styles/src/components/surface.css:1034](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1034) |
| `media`<br>.area-popover__media | container | `root` → flush |  [packages/styles/src/components/surface.css:1081](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1081) |
| `title`<br>.area-popover__title | text | `header` → flush |  [packages/styles/src/components/surface.css:1075](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1075) |
| `description`<br>.area-popover__description | text | `body` → flush |  [packages/styles/src/components/surface.css:1077](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1077) |
| `arrow`<br>.area-popover__arrow | floating surface | `root` → flush | Continuation of the same surface, flush relative to it; not independently elevated. arrow-edge is its outline. Alternate: edge. [packages/styles/src/components/surface.css:1018](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1018-L1027) |
| `arrow-edge`<br>.area-popover__arrow-edge | edge | `arrow` → flush |  [packages/styles/src/components/surface.css:1028](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1028) |
| `media-pixels`<br>.area-popover__media :is(img,video) | glyph | `media` → flush | Intrinsic media inside surface. [packages/styles/src/components/surface.css:1081](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1081-L1082) |
| `root.edge`<br>.area-popover [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:957](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L957-L975) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [calendar](#calendar): `root` = container; `months` = container; `month` = container; `header` = container; `grid` = container; `cell` = container; `week` = container; `nav` = container; `title` = text; `weekday` = text; `day-number` = text; `day-weekday` = text; `day-month` = text; `day` = raised control; `marker` = indicator/fill; `range-fill` = indicator/fill; `root.edge` = edge; `day.edge` = edge | Optional sole Calendar child; variant determines whether nested shell is omitted. [packages/styles/src/components/surface.css:1013](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1013) |
| `header` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional header action Button owns plate and glyph. [packages/styles/src/components/surface.css:1054](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1054-L1073) |

## menu

`area-menu` — Lists actions triggered from a button. Manifest: [packages/styles/src/manifest.ts:642](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L642). Spec context: [docs/specs/menu.md:14](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/menu.md#L14-L20).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-menu | floating surface | `@host` → floating | Menu surface normally floats; inline and embedded search menus suppress duplicate chrome. Depth exceptions: embedded search-surface Menu → flush [packages/styles/src/components/surface.css:1319](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1319-L1325). Alternate: container. [packages/styles/src/components/surface.css:957](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L957-L975) |
| `item`<br>.area-menu__item | raised control | `root` → flush |  [packages/styles/src/components/surface.css:1105](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1105-L1124) |
| `icon`<br>.area-menu__icon | glyph | `item` → flush |  [packages/styles/src/components/surface.css:1193](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1193-L1200) |
| `check`<br>.area-menu__check | glyph | `item` → flush |  [packages/styles/src/components/surface.css:1267](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1267-L1276) |
| `sub-chevron`<br>.area-menu__sub-chevron | glyph | `item` → flush |  [packages/styles/src/components/surface.css:1255](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1255-L1263) |
| `lines`<br>.area-menu__lines | container | `item` → flush |  [packages/styles/src/components/surface.css:1177](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1177) |
| `text`<br>.area-menu__text | text | `lines` → flush |  [packages/styles/src/components/surface.css:1207](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1207-L1212) |
| `description`<br>.area-menu__description | text | `lines` → flush |  [packages/styles/src/components/surface.css:1180](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1180-L1184) |
| `label`<br>.area-menu__label | text | `root` → flush |  [packages/styles/src/components/surface.css:1223](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1223-L1232) |
| `shortcut`<br>.area-menu__shortcut | text | `item` → flush | Text by default, or Kbd composition if keycaps are provided. Alternate: container. [packages/styles/src/components/surface.css:1295](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1295-L1300) |
| `separator`<br>.area-menu__separator | divider | `root` → flush |  [packages/styles/src/components/surface.css:1234](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1234-L1245) |
| `toggle`<br>.area-menu__toggle | recessed field/track | `item` → flush | Switch track inside a row; thumb remains a separate reused Switch part. Alternate: thumb/knob. [packages/styles/src/components/surface.css:1286](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1286-L1291) |
| `search-surface`<br>.area-menu__search-surface | floating surface | `@host` → floating | Deprecated Combobox search surface; legacy layout only, do not introduce as a new component. Alternate: container. [packages/styles/src/components/surface.css:1304](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1304-L1317) |
| `root.edge`<br>.area-menu [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:957](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L957-L975) |
| `item.edge`<br>.area-menu__item [same-element edge paint] | edge | `item` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/forced-colors.css:11](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L11-L14) |
| `search-surface.edge`<br>.area-menu__search-surface [same-element edge paint] | edge | `search-surface` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:1304](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1304-L1317) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `toggle` | [switch](#switch): `root` = container; `track` = recessed field/track; `thumb` = thumb/knob; `track.edge` = edge | Visual-only Switch parts in checkable menu row; no extra native input/labels. [packages/react/src/components/primitives.tsx:1396](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1396-L1402) |
| `root` | [menu](#menu): `root` = floating surface; `item` = raised control; `icon` = glyph; `text` = text; `lines` = container; `description` = text; `label` = text; `separator` = divider; `shortcut` = text; `check` = glyph; `toggle` = recessed field/track; `sub-chevron` = glyph; `root.edge` = edge; `item.edge` = edge | Submenu recursion: a separate floating Menu adjacent to its parent item, repeated per nesting level. [packages/react/src/components/primitives.tsx:1331](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1331-L1335) |
| `shortcut` | [kbd](#kbd): `root` = container; `key` = text; `root.edge` = edge | Quiet keycaps in menu shortcut slot; no extra raised plate. [packages/styles/src/components/kbd.css:90](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/kbd.css#L90-L93) |

## tooltip

`area-tooltip` — Names a control on hover or focus. Manifest: [packages/styles/src/manifest.ts:653](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L653). Spec context: [docs/specs/tooltip.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tooltip.md#L60-L77).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-tooltip | floating surface | `@host` → floating | Floating surface; text and optional Kbd plus arrow are separately accounted. [packages/styles/src/components/surface.css:1332](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1332-L1367) |
| `arrow`<br>.area-tooltip--arrow::after | floating surface | `root` → flush | Same surface continuation; flush to tooltip, never its own lift. [packages/styles/src/components/surface.css:1382](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1382-L1395) |
| `copy`<br>.area-tooltip text content | text | `root` → flush | Tooltip text; optional Kbd is a separate composition. [packages/styles/src/components/surface.css:1332](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1332-L1369) |
| `pointer-bridge`<br>.area-tooltip[popover]::before | container | `root` → flush | **No paint.** Invisible bridge for pointer travel; not scrim or shadow. [packages/styles/src/components/surface.css:1554](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1554-L1562) |
| `root.edge`<br>.area-tooltip [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:1332](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1332-L1367) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [kbd](#kbd): `root` = container; `key` = text; `root.edge` = edge | On-color tooltip keys; no change to tooltip surface depth. [packages/styles/src/components/kbd.css:110](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/kbd.css#L110-L121) |

## toast

`area-toast` — Reports the outcome of an action without interrupting. Manifest: [packages/styles/src/manifest.ts:672](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L672). Spec context: [docs/specs/toast.md:22](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/toast.md#L22-L27).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-toast | floating surface | `@host` → floating |  [packages/styles/src/components/surface.css:1450](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1450-L1472) |
| `icon`<br>.area-toast__icon | glyph | `root` → flush |  [packages/styles/src/components/surface.css:1475](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1475-L1482) |
| `content`<br>.area-toast__content | container | `root` → flush |  [packages/styles/src/components/surface.css:1485](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1485) |
| `action`<br>.area-toast__action | container | `root` → flush | Wrapper for action Button; the wrapper has no independent control paint. Alternate: raised control. [packages/styles/src/components/surface.css:1489](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1489-L1495) |
| `dismiss`<br>.area-toast__dismiss | container | `root` → flush | Wrapper for dismiss Button; the wrapper has no independent control paint. Alternate: raised control. [packages/styles/src/components/surface.css:1489](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1489-L1495) |
| `title`<br>.area-toast__title | text | `content` → flush |  [packages/styles/src/components/surface.css:1486](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1486) |
| `description`<br>.area-toast__description | text | `content` → flush |  [packages/styles/src/components/surface.css:1488](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1488) |
| `root.edge`<br>.area-toast [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:1450](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1450-L1472) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `dismiss` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Child ghost icon button; action is consumer supplied. [packages/react/src/components/primitives.tsx:1434](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1434) |

## toaster

`area-toaster` — Hosts toasts: live regions first, pause on hover and focus, a hotkey, stacking (audit E-11). Manifest: [packages/styles/src/manifest.ts:664](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L664). Spec context: [docs/specs/toast.md:22](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/toast.md#L22-L27).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-toaster | container | `@host` → flush | Fixed viewport placement only; Toast children own floating surfaces. Alternate: floating surface. [packages/styles/src/components/surface.css:1415](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1415-L1422) |
| `list`<br>.area-toaster__list | container | `root` → flush |  [packages/styles/src/components/surface.css:1425](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1425) |
| `item`<br>.area-toaster__list > li | container | `list` → flush | Position/animation wrapper; child Toast supplies surface. [packages/styles/src/components/surface.css:1434](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1434-L1445) |
| `root.edge`<br>.area-toaster [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/surface.css:1424](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/surface.css#L1424) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `item` | [toast](#toast): `root` = floating surface; `icon` = glyph; `content` = container; `action` = container; `dismiss` = container; `title` = text; `description` = text; `root.edge` = edge | Each Toast is independently floating relative to host; list wrapper is unpainted. [packages/react/src/components/Toaster.tsx:178](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/Toaster.tsx#L178) |

## tabs

`area-tabs` — Switches between views with transparent tabs and rounded indicators; labels align with panel content. Manifest: [packages/styles/src/manifest.ts:680](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L680). Spec context: [docs/specs/tabs.md:61](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/tabs.md#L61-L79).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-tabs | container | `@host` → flush |  [packages/styles/src/components/navigation.css:10](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L10-L22) |
| `list`<br>.area-tabs__list | container | `root` → flush |  [packages/styles/src/components/navigation.css:24](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L24-L29) |
| `panel`<br>.area-tabs__panel | container | `root` → flush |  [packages/styles/src/components/navigation.css:130](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L130-L132) |
| `tab`<br>.area-tabs__tab | raised control | `list` → flush |  [packages/styles/src/components/navigation.css:34](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L34-L51) |
| `label`<br>.area-tabs__label | text | `tab` → flush |  [packages/styles/src/components/navigation.css:88](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L88) |
| `icon`<br>.area-tabs__icon | glyph | `tab` → flush |  [packages/styles/src/components/navigation.css:93](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L93) |
| `selected-mark`<br>.area-tabs__tab::after | indicator/fill | `tab` → flush | Selection underline; indicator, not structural divider. [packages/styles/src/components/navigation.css:54](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L54-L68) |
| `list.divider`<br>.area-tabs__list [same-element divider paint] | divider | `list` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/navigation.css:89](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L89) |
| `tab.edge`<br>.area-tabs__tab [same-element edge paint] | edge | `tab` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/navigation.css:118](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L118-L123) [packages/styles/src/forced-colors.css:31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L31-L38) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `list` | [indicatorAnchor](#indicatoranchor): `root` = container; `indicator` = container; `indicator.edge` = edge | Optional tab with attached status; do not recurse the anchor's Tab-content recipe again. [packages/styles/src/components/navigation.css:32](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L32) |

## table

`area-table` — Presents rows of structured data. Manifest: [packages/styles/src/manifest.ts:690](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L690). Spec context: [docs/specs/table.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/table.md#L60-L78).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-table | container | `@host` → flush |  [packages/styles/src/components/navigation.css:153](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L153-L164) |
| `cell`<br>.area-table__cell | container | `row` → flush | Cell box is a layout/container; text or nested component remains separate. Alternate: text. [packages/styles/src/components/navigation.css:166](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L166-L175) |
| `link`<br>.area-table__link | text | `root` → flush |  [packages/styles/src/components/navigation.css:206](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L206) |
| `head-cell`<br>.area-table th | container | `row` → flush | Header backing plus label; sort Button is a nested composition. [packages/styles/src/components/navigation.css:181](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L181-L194) |
| `body-cell`<br>.area-table td | container | `row` → flush | Cell box with row rule; text/content treated separately. [packages/styles/src/components/navigation.css:166](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L166-L179) |
| `cell-text`<br>.area-table :is(th,td) text | text | `cell` → flush | Inherits table ink unless child supplies another semantic tone. [packages/styles/src/components/navigation.css:153](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L153-L174) |
| `row`<br>.area-table tbody tr | container | `root` → flush | Striped/selected/hover fill is flat row state, not raised-control material. [packages/styles/src/components/navigation.css:232](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L232-L234) |
| `caption`<br>.area-table caption | text | `root` → flush | Table caption ink. [packages/styles/src/components/navigation.css:235](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L235) |
| `link-hit`<br>.area-table__link::after | text | `link` → flush | **No paint.** Invisible stretched row link target; focus outline remains an edge. [packages/styles/src/components/navigation.css:207](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L207-L212) |
| `cell.divider`<br>.area-table__cell [same-element divider paint] | divider | `cell` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/navigation.css:166](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L166-L175) |
| `link.edge`<br>.area-table__link [same-element edge paint] | edge | `link` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/navigation.css:209](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L209) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `head-cell` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional sort button; flush to header cell, not a raised row. [packages/styles/src/components/navigation.css:213](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L213-L216) |

## tableWrapper

`area-table-wrapper` — Scrolls a table horizontally without scrolling the page. Manifest: [packages/styles/src/manifest.ts:700](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L700). Spec context: [docs/specs/table.md:60](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/table.md#L60-L78).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-table-wrapper | container | `@host` → flush |  [packages/styles/src/components/navigation.css:137](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L137-L146) |
| `root.edge`<br>.area-table-wrapper [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/navigation.css:137](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L137-L146) [packages/styles/src/components/navigation.css:211](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/navigation.css#L211) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [table](#table): `root` = container; `cell` = container; `link` = text; `head-cell` = container; `body-cell` = container; `cell-text` = text; `row` = container; `caption` = text; `link-hit` = text; `cell.divider` = divider; `link.edge` = edge | Table is inside scroll wrapper; only wrapper provides outer rounded border. [packages/react/src/components/primitives.tsx:1064](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1064-L1076) |

## segmented

`area-segmented` — Picks one value from a small set of options. Manifest: [packages/styles/src/manifest.ts:708](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L708). Spec context: [docs/specs/segmented.md:47](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/segmented.md#L47-L65).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-segmented | recessed field/track | `@host` → flush | Shared track visually flush today; do not assume an inset shadow. Alternate: container. [packages/styles/src/components/segmented.css:31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L31-L55) |
| `item`<br>.area-segmented__item | raised control | `root` → flush | Selected button has shadow-1 and resembles a thumb; it is not a separately moving thumb element. Depth exceptions: selected item → raised [packages/styles/src/components/segmented.css:103](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L103-L111). Alternate: thumb/knob. [packages/styles/src/components/segmented.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L57-L83) |
| `icon`<br>.area-segmented__icon | glyph | `item` → flush |  [packages/styles/src/components/segmented.css:122](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L122-L127) |
| `label`<br>.area-segmented__label | text | `item` → flush |  [packages/styles/src/inset.css:199](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/inset.css#L199-L207) |
| `root.edge`<br>.area-segmented [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/segmented.css:31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L31-L55) |
| `item.edge`<br>.area-segmented__item [same-element edge paint] | edge | `item` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/segmented.css:57](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L57-L83) [packages/styles/src/components/segmented.css:103](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/segmented.css#L103-L110) |

## code

`area-code` — Marks source or a design token inline. Manifest: [packages/styles/src/manifest.ts:719](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L719). Spec context: [docs/specs/code.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/code.md#L50-L64).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-code | container | `@host` → flush | Inline code backing and literal text are distinct layers; no control behavior. Alternate: text. [packages/styles/src/components/code.css:101](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L101-L144) |
| `swatch`<br>.area-code__swatch | indicator/fill | `root` → flush |  [packages/styles/src/components/token.css:37](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/token.css#L37-L47) |
| `label`<br>.area-code__label | text | `root` → flush |  [packages/styles/src/inset.css:199](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/inset.css#L199-L207) |
| `root.edge`<br>.area-code [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/code.css:101](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L101-L144) |
| `swatch.edge`<br>.area-code__swatch [same-element edge paint] | edge | `swatch` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/token.css:37](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/token.css#L37-L47) |

## codeBlock

`area-code-block` — Shows a block of code with an optional file header, numbered lines and a copy action. Manifest: [packages/styles/src/manifest.ts:729](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L729). Spec context: [docs/specs/code-block.md:56](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/code-block.md#L56-L74).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-code-block | container | `@host` → flush |  [packages/styles/src/components/code.css:146](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L146-L159) |
| `header`<br>.area-code-block__header | container | `root` → flush |  [packages/styles/src/components/code.css:31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L31-L42) |
| `actions`<br>.area-code-block__actions | container | `header` → flush |  [packages/styles/src/components/code.css:86](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L86-L91) |
| `body`<br>.area-code-block__body | container | `root` → flush |  [packages/styles/src/components/code.css:404](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L404-L409) |
| `line`<br>.area-code-block__line | container | `code` → flush |  [packages/styles/src/components/code.css:225](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L225-L228) |
| `gutter`<br>.area-code-block__gutter | container | `line` → flush | Layout groups line-number text and optional diff marker glyph. Alternate: text. [packages/styles/src/components/code.css:245](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L245-L256) |
| `languages`<br>.area-code-block__languages | container | `header` → flush |  [packages/styles/src/components/code.css:68](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L68-L73) |
| `title`<br>.area-code-block__title | text | `header` → flush |  [packages/styles/src/components/code.css:51](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L51-L59) |
| `language`<br>.area-code-block__language | text | `header` → flush |  [packages/styles/src/components/code.css:62](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L62-L66) |
| `pre`<br>.area-code-block__pre | text | `body` → flush | Preformatted text region also clips/scrolls code; line/text children provide ink when numbered. Alternate: container. [packages/styles/src/components/code.css:195](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L195-L210) |
| `code`<br>.area-code-block__code | text | `pre` → flush |  [packages/styles/src/components/code.css:217](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L217-L223) |
| `linenumber`<br>.area-code-block__linenumber | text | `gutter` → flush |  [packages/styles/src/components/code.css:262](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L262-L266) |
| `text`<br>.area-code-block__text | text | `line` → flush |  [packages/styles/src/components/code.css:294](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L294-L298) |
| `select`<br>.area-code-block__select | recessed field/track | `header` → flush |  [packages/styles/src/components/code.css:80](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L80-L82) |
| `marker`<br>.area-code-block__marker | glyph | `gutter` → flush |  [packages/styles/src/components/code.css:287](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L287-L292) |
| `toggle`<br>.area-code-block__toggle | raised control | `body` → flush | Expanded footer control is flush; collapsed control overlays the last lines and carries a fade scrim. Depth exceptions: collapsed overlay over code → floating [packages/styles/src/components/code.css:490](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L490-L503). Alternate: floating surface. [packages/styles/src/components/code.css:416](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L416-L435) |
| `syntax-keyword`<br>.area-syntax-keyword | text | `text` → flush | Syntax ink retains semantic palette. [packages/styles/src/components/code.css:383](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L383) |
| `syntax-tag`<br>.area-syntax-tag | text | `text` → flush | Syntax ink retains semantic palette. [packages/styles/src/components/code.css:384](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L384) |
| `syntax-attr`<br>.area-syntax-attr | text | `text` → flush | Syntax ink retains semantic palette. [packages/styles/src/components/code.css:385](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L385) |
| `syntax-string`<br>.area-syntax-string | text | `text` → flush | Syntax ink retains semantic palette. [packages/styles/src/components/code.css:386](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L386) |
| `syntax-comment`<br>.area-syntax-comment | text | `text` → flush | Syntax ink retains semantic palette. [packages/styles/src/components/code.css:387](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L387) |
| `syntax-punct`<br>.area-syntax-punct | text | `text` → flush | Syntax ink retains semantic palette. [packages/styles/src/components/code.css:388](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L388) |
| `line-fill`<br>.area-code-block__line--highlighted/added/removed | indicator/fill | `line` → flush | Semantic line highlight/diff ground, not a container material. Forced colors replaces tint/shadow with a semantic border rail, still indicator/fill. [packages/styles/src/components/code.css:329](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L329-L342) [packages/styles/src/forced-colors.css:73](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L73-L79) |
| `target-mark`<br>.area-code-block__line:target | indicator/fill | `line` → flush | Inset strip is a line-target indicator, not bevel relief. Forced colors replaces tint/shadow with a semantic border rail, still indicator/fill. [packages/styles/src/components/code.css:350](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L350-L354) [packages/styles/src/forced-colors.css:73](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/forced-colors.css#L73-L79) |
| `collapse-scrim`<br>.area-code-block[data-collapsed] .area-code-block__toggle | scrim | `toggle` → flush | Same-element gradient above code; no shadow or independent DOM part. [packages/styles/src/components/code.css:490](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L490-L503) |
| `toggle-text`<br>.area-code-block__toggle text content | text | `toggle` → flush | Show more/less copy over footer or fade. [packages/styles/src/components/code.css:416](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L416-L435) |
| `root.edge`<br>.area-code-block [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/code.css:146](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L146-L159) |
| `header.divider`<br>.area-code-block__header [same-element divider paint] | divider | `header` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/code.css:31](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L31-L42) |
| `linenumber.edge`<br>.area-code-block__linenumber [same-element edge paint] | edge | `linenumber` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/code.css:277](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L277-L280) |
| `toggle.edge`<br>.area-code-block__toggle [same-element edge paint] | edge | `toggle` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/code.css:478](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L478-L481) |
| `toggle.divider`<br>.area-code-block__toggle [same-element divider paint] | divider | `toggle` → flush | Directional border/rule. Structural divider by default; at an exposed outer side it is an edge. Do not paint it twice. Alternate: edge. [packages/styles/src/components/code.css:416](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/code.css#L416-L435) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `languages` | [tabs](#tabs): `root` = container; `list` = container; `tab` = raised control; `label` = text; `panel` = container; `list.divider` = divider; `tab.edge` = edge | Language tab strip; code body is its panel, not a separate elevated panel. [packages/react/src/components/primitives.tsx:1927](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1927-L1955) |
| `select` | [select](#select): `root` = recessed field/track; `value` = text; `fallback-chevron` = glyph; `picker-icon` = glyph; `picker` = floating surface; `option` = raised control; `option-text` = text; `checkmark` = glyph; `group-label` = text; `picker-edge` = edge; `root.edge` = edge | Alternative language chooser; native popup handled by Select. [packages/react/src/components/primitives.tsx:1963](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1963-L1974) |
| `actions` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Copy icon Button, glyph changes to check; no label. [packages/react/src/components/primitives.tsx:1981](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L1981-L1992) |

## nav

`area-nav` — Site navigation, vertical or horizontal. Manifest: [packages/styles/src/manifest.ts:740](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L740). Spec context: [docs/specs/nav.md:69](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/nav.md#L69-L87).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-nav | container | `@host` → flush |  [packages/styles/src/components/nav.css:20](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L20-L29) |
| `group`<br>.area-nav__group | container | `root` → flush |  [packages/styles/src/components/nav.css:49](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L49-L54) |
| `trailing`<br>.area-nav__trailing | container | `item` → flush | Consumer slot can hold text, Count or another component; recurse into its contents. Alternate: text. [packages/styles/src/components/nav.css:239](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L239-L247) |
| `row`<br>.area-nav__row | container | `root` → flush | Row layout can also paint the selected background for an item with separate actions. [packages/styles/src/components/nav.css:260](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L260-L268) |
| `actions`<br>.area-nav__actions | container | `row` → flush |  [packages/styles/src/components/nav.css:276](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L276) |
| `label`<br>.area-nav__label | text | `group` → flush |  [packages/styles/src/components/nav.css:86](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L86-L95) |
| `text`<br>.area-nav__text | text | `item` → flush |  [packages/styles/src/components/nav.css:228](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L228-L233) |
| `item`<br>.area-nav__item | raised control | `row` → flush | Navigation row control with selected plate; not a physically raised button. Alternate: indicator/fill. [packages/styles/src/components/nav.css:97](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L97-L121) |
| `icon`<br>.area-nav__icon | glyph | `item` → flush |  [packages/styles/src/components/nav.css:213](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L213-L220) |
| `separator`<br>.area-nav__separator | divider | `root` → flush |  [packages/styles/src/components/nav.css:253](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L253-L257) |
| `selected-mark`<br>.area-nav--marker .area-nav__item::before | indicator/fill | `item` → flush | Selection edge marker; primary indicator/fill, not separator. [packages/styles/src/components/nav.css:182](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L182-L194) |
| `action-glyph`<br>.area-nav__actions svg | glyph | `actions` → flush | Disclosure glyph in a separate Button action. [packages/styles/src/components/nav.css:284](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L284-L287) |
| `item.edge`<br>.area-nav__item [same-element edge paint] | edge | `item` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/nav.css:201](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L201-L205) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `actions` | [button](#button): `root` = raised control; `icon` = glyph; `label` = text; `root.edge` = edge | Optional row actions; each Button is independent of row state plate. [packages/styles/src/components/nav.css:278](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/nav.css#L278-L287) |

## token

`area-token` — Deprecated compatibility alias for Code with a token swatch. Manifest: [packages/styles/src/manifest.ts:753](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L753). Spec context: [docs/specs/code.md:50](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/code.md#L50-L64).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-token | container | `@host` → flush | Deprecated compatibility spelling of Code; includes the same body and text paint. Alternate: text. [packages/styles/src/components/token.css:9](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/token.css#L9-L17) |
| `swatch`<br>.area-token__swatch | indicator/fill | `root` → flush |  [packages/styles/src/components/token.css:37](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/token.css#L37-L47) |
| `label`<br>.area-token__label | text | `root` → flush |  [packages/styles/src/inset.css:199](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/inset.css#L199-L207) |
| `swatch.edge`<br>.area-token__swatch [same-element edge paint] | edge | `swatch` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/token.css:37](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/token.css#L37-L47) |

## kbd

`area-kbd` — Marks a keyboard shortcut. Manifest: [packages/styles/src/manifest.ts:762](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L762). Spec context: [docs/specs/kbd.md:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/kbd.md#L58-L73).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-kbd | container | `@host` → flush | Passive keycap, not an interactive button. Default has a border and no shadow; quiet removes backing. Alternate: raised control. [packages/styles/src/components/kbd.css:10](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/kbd.css#L10-L49) |
| `key`<br>.area-kbd__key | text | `root` → flush |  [packages/styles/src/components/kbd.css:51](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/kbd.css#L51-L58) |
| `root.edge`<br>.area-kbd [same-element edge paint] | edge | `root` → flush | Boundary/selection/focus paint; conditions in pinned CSS decide visibility. Inset rings are edges, not recessed geometry. [packages/styles/src/components/kbd.css:10](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/kbd.css#L10-L49) |

## kbdGroup

`area-kbd-group` — Groups chord hints into a keyboard shortcut sequence. Manifest: [packages/styles/src/manifest.ts:774](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/manifest.ts#L774). Spec context: [docs/specs/kbd.md:58](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/kbd.md#L58-L73).

| Part / selector | Primary role | Visual parent → depth | Ambiguity and pinned evidence |
| --- | --- | --- | --- |
| `root`<br>.area-kbd-group | container | `@host` → flush |  [packages/styles/src/components/kbd.css:73](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/styles/src/components/kbd.css#L73-L77) |

**Reused parts (part of this family’s map).** Each link resolves to the complete donor row above/below, including its CSS pin. Instantiation pins prove the reuse. Parts only render when enabled by the cited composition. Do not double-paint a co-classed root.

| Mount | Donor parts with primary roles | Context / instantiation evidence |
| --- | --- | --- |
| `root` | [kbd](#kbd): `root` = container; `key` = text; `root.edge` = edge | Optional sequence of keycaps inside a layout-only group. [packages/react/src/components/primitives.tsx:2161](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/packages/react/src/components/primitives.tsx#L2161-L2167) |

## Specs without independent manifest contracts

| Spec | Coverage | Evidence |
| --- | --- | --- |
| docs/specs/inspector.md | panel — Panel row/section recipe; not an additional manifest family. | [docs/specs/inspector.md:17](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/inspector.md#L17-L22) |
| docs/specs/resizable-panel.md | panel — Panel option: resize hit edge plus focus grip are mapped. | [docs/specs/resizable-panel.md:12](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/resizable-panel.md#L12-L19) |
| docs/specs/overlay.md | popover, menu, tooltip, dialog, hoverCard, contextMenu — Behavior layer; paint belongs to referenced surfaces. | [docs/specs/overlay.md:13](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/overlay.md#L13-L20) |
| docs/specs/icons.md | environment.glyph — Icon corpus maps to glyph role; individual drawings are not component parts. | [docs/specs/icons.md:3](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/icons.md#L3-L8) |
| docs/specs/typography.md | environment.text — Type system maps to text role; sizes/weights are not new material roles. | [docs/specs/typography.md:86](https://github.com/ethanwongwork/area/blob/6f896789a5200bcbd34fe87de458e60ca82141d6/docs/specs/typography.md#L86-L107) |
