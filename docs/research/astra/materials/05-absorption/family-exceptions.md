# Where the role recipe needs context

> **Superseded — D1, D2, D3, D14:** old guards’ ordinal amount caps and blanket decorative prohibitions are historical, not binding. The six review guards and diagnostic guard below govern semantic composition; numeric decoration limits await calibration.

**Research proposals.** Existing CSS/markup/specs below establish the constraints. The caps are authored recommendations, not current implementation or measured effect values. Guards name semantic/contextual reasons, so the same guard applies across families without creating per-component style recipes.

All 101 manifest contracts from task 04 were reviewed. A listed guard applies only to its named context/part; it does not suppress every part of the family. Family membership is not a material API.

## Family coverage ledger

| Family / contract | Context rules beyond the role alone | Pinned existing anatomy |
| --- | --- | --- |
| `button` / `area-button` | [state-edge](#state-edge), [solid-emphasis](#solid-emphasis) | [docs/specs/button.md:80](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/button.md#L80-L98) [packages/styles/src/components/button.css:21](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/button.css#L21-L97) |
| `buttonGroup` / `area-button-group` | [shared-shell](#shared-shell), [unpainted-host](#unpainted-host), [divider-hierarchy](#divider-hierarchy), [disabled-group-opacity](#disabled-group-opacity) | [docs/specs/button-group.md:18](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/button-group.md#L18-L23) [packages/styles/src/components/button-group.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/button-group.css#L3-L17) |
| `splitButton` / `area-split-button` | [shared-shell](#shared-shell), [divider-hierarchy](#divider-hierarchy) | [docs/specs/split-button.md:77](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/split-button.md#L77-L90) [packages/styles/src/components/split-button.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/split-button.css#L11-L17) |
| `toolbar` / `area-toolbar` | [shared-shell](#shared-shell), [unpainted-host](#unpainted-host), [divider-hierarchy](#divider-hierarchy) | [docs/specs/toolbar.md:81](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/toolbar.md#L81-L99) [packages/styles/src/components/toolbar.css:2](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toolbar.css#L2-L25) |
| `alignmentPicker` / `area-alignment-picker` | [range-geometry](#range-geometry) | [docs/specs/alignment-picker.md:68](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/alignment-picker.md#L68-L81) [packages/styles/src/components/alignment-picker.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/alignment-picker.css#L9-L35) |
| `colorPicker` / `area-color-picker` | [literal-color](#literal-color), [shared-shell](#shared-shell), [native-paint](#native-paint) | [docs/specs/color-picker.md:70](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/color-picker.md#L70-L88) [packages/styles/src/components/color.css:215](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L215-L239) |
| `calendar` / `area-calendar` | [calendar-topology](#calendar-topology), [list-focus-plate](#list-focus-plate) | [docs/specs/calendar.md:70](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/calendar.md#L70-L88) [packages/styles/src/components/calendar.css:4](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/calendar.css#L4-L19) |
| `colorSwatch` / `area-color-swatch` | [literal-color](#literal-color) | [docs/specs/color-swatch.md:45](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/color-swatch.md#L45-L56) [packages/styles/src/components/color.css:21](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L21-L48) |
| `colorSwatchPicker` / `area-color-swatch-picker` | [literal-color](#literal-color) | [docs/specs/color-swatch-picker.md:59](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/color-swatch-picker.md#L59-L71) [packages/styles/src/components/color.css:75](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L75-L84) |
| `colorField` / `area-color-field` | [literal-color](#literal-color), [shared-shell](#shared-shell) | [docs/specs/color-field.md:60](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/color-field.md#L60-L73) [packages/styles/src/components/color.css:169](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L169-L171) |
| `field` / `area-field` | [semantic-signal](#semantic-signal), [unpainted-host](#unpainted-host) | [docs/specs/field.md:53](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/field.md#L53-L66) [packages/styles/src/components/field.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/field.css#L9-L13) |
| `input` / `area-input` | [native-paint](#native-paint), [state-edge](#state-edge) | [docs/specs/input.md:61](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/input.md#L61-L77) [packages/styles/src/components/input.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/input.css#L13-L58) |
| `numberField` / `area-number-field` | [state-edge](#state-edge) | [docs/specs/number-field.md:17](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/number-field.md#L17-L22) [packages/styles/src/components/number-field.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/number-field.css#L3-L38) |
| `inputGroup` / `area-input-group` | [shared-shell](#shared-shell) | [docs/specs/input-group.md:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/input-group.md#L57-L71) [packages/styles/src/components/input-group.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/input-group.css#L3-L31) |
| `breadcrumb` / `area-breadcrumb` | [state-edge](#state-edge) | [docs/specs/breadcrumb.md:53](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/breadcrumb.md#L53-L64) [packages/styles/src/components/breadcrumb.css:2](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/breadcrumb.css#L2) |
| `fileUpload` / `area-file-upload` | [intrinsic-media](#intrinsic-media), [state-edge](#state-edge), [disabled-group-opacity](#disabled-group-opacity) | [docs/specs/file-upload.md:51](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/file-upload.md#L51-L66) [packages/styles/src/components/file-upload.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/file-upload.css#L11-L32) |
| `fileUploadList` / `area-file-upload-list` | [unpainted-host](#unpainted-host) | [docs/specs/file-upload.md:51](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/file-upload.md#L51-L66) [packages/styles/src/components/file-upload.css:79](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/file-upload.css#L79-L87) |
| `fileUploadItem` / `area-file-upload-item` | [semantic-signal](#semantic-signal), [intrinsic-media](#intrinsic-media), [diagnostic-extent](#diagnostic-extent) | [docs/specs/file-upload.md:51](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/file-upload.md#L51-L66) [packages/styles/src/components/file-upload.css:89](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/file-upload.css#L89-L101) |
| `emptyState` / `area-empty-state` | [intrinsic-media](#intrinsic-media), [unpainted-host](#unpainted-host) | [docs/specs/empty-state.md:61](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/empty-state.md#L61-L75) [packages/styles/src/components/empty-state.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/empty-state.css#L11-L21) |
| `toggleGroup` / `area-toggle-group` | [shared-shell](#shared-shell), [disabled-group-opacity](#disabled-group-opacity) | [docs/specs/toggle-group.md:48](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/toggle-group.md#L48-L59) [packages/styles/src/components/toggle-group.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toggle-group.css#L12-L21) |
| `descriptionList` / `area-description-list` | [unpainted-host](#unpainted-host) | [docs/specs/description-list.md:46](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/description-list.md#L46-L58) [packages/styles/src/components/description-list.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/description-list.css#L11-L29) |
| `meter` / `area-meter` | [semantic-signal](#semantic-signal), [unpainted-host](#unpainted-host), [diagnostic-extent](#diagnostic-extent) | [docs/specs/meter.md:42](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/meter.md#L42-L53) [packages/styles/src/components/meter.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/meter.css#L12-L21) |
| `searchField` / `area-search-field` | [shared-shell](#shared-shell) | [docs/specs/search-field.md:52](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/search-field.md#L52-L69) [packages/styles/src/components/search-field.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/search-field.css#L11) |
| `shortcutList` / `area-shortcut-list` | [unpainted-host](#unpainted-host) | [docs/specs/shortcut-list.md:40](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/shortcut-list.md#L40-L58) [packages/styles/src/components/shortcut-list.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/shortcut-list.css#L12-L27) |
| `dateRangePicker` / `area-date-range-picker` | [dense-rows](#dense-rows), [shared-shell](#shared-shell), [scrim-and-overlay](#scrim-and-overlay), [list-focus-plate](#list-focus-plate) | [docs/specs/date-range-picker.md:44](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/date-range-picker.md#L44-L62) [packages/styles/src/components/date-range-picker.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/date-range-picker.css#L13) |
| `citation` / `area-citation` | [intrinsic-media](#intrinsic-media), [translucent-washes](#translucent-washes) | [docs/specs/citation.md:45](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/citation.md#L45-L56) [packages/styles/src/components/citation.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/citation.css#L13-L45) |
| `zoomControl` / `area-zoom-control` | [shared-shell](#shared-shell), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/zoom-control.md:38](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/zoom-control.md#L38-L54) [packages/styles/src/components/zoom-control.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/zoom-control.css#L12) |
| `board` / `area-board` | [unpainted-host](#unpainted-host) | [docs/specs/board.md:36](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/board.md#L36-L54) [packages/styles/src/components/board.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/board.css#L12-L19) |
| `boardColumn` / `area-board-column` | [translucent-washes](#translucent-washes) | [docs/specs/board.md:36](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/board.md#L36-L54) [packages/styles/src/components/board.css:21](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/board.css#L21-L38) |
| `boardCard` / `area-board-card` | No additional family-specific exception identified; common role/nesting policy applies. | [docs/specs/board.md:36](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/board.md#L36-L54) [packages/styles/src/components/board.css:114](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/board.css#L114-L128) |
| `timeline` / `area-timeline` | [unpainted-host](#unpainted-host), [diagnostic-extent](#diagnostic-extent) | [docs/specs/timeline.md:56](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/timeline.md#L56-L74) [packages/styles/src/components/timeline.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/timeline.css#L11-L30) |
| `timelineItem` / `area-timeline-item` | [semantic-signal](#semantic-signal), [intrinsic-media](#intrinsic-media), [diagnostic-extent](#diagnostic-extent) | [docs/specs/timeline.md:56](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/timeline.md#L56-L74) [packages/styles/src/components/timeline.css:32](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/timeline.css#L32-L38) |
| `editableText` / `area-editable-text` | [state-edge](#state-edge), [disabled-group-opacity](#disabled-group-opacity) | [docs/specs/editable-text.md:50](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/editable-text.md#L50-L68) [packages/styles/src/components/editable-text.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/editable-text.css#L11-L19) |
| `boxModel` / `area-box-model` | [diagnostic-extent](#diagnostic-extent) | [docs/specs/box-model.md:51](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/box-model.md#L51-L69) [packages/styles/src/components/box-model.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/box-model.css#L13-L28) |
| `scrollArea` / `area-scroll-area` | [unpainted-host](#unpainted-host) | [docs/specs/scroll-area.md:59](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/scroll-area.md#L59-L75) [packages/styles/src/components/scroll-area.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/scroll-area.css#L12-L26) |
| `link` / `area-link` | [state-edge](#state-edge) | [docs/specs/link.md:62](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/link.md#L62-L73) [packages/styles/src/components/link.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/link.css#L13-L32) |
| `toggletip` / `area-toggletip` | [state-edge](#state-edge), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/toggletip.md:53](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/toggletip.md#L53-L71) [packages/styles/src/components/toggletip.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toggletip.css#L9-L37) |
| `pagination` / `area-pagination` | [dense-rows](#dense-rows), [state-edge](#state-edge), [unpainted-host](#unpainted-host) | [docs/specs/pagination.md:62](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/pagination.md#L62-L80) [packages/styles/src/components/pagination.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/pagination.css#L12-L25) |
| `treeView` / `area-tree-view` | [dense-rows](#dense-rows), [state-edge](#state-edge), [list-focus-plate](#list-focus-plate) | [docs/specs/tree-view.md:65](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/tree-view.md#L65-L81) [packages/styles/src/components/tree-view.css:2](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tree-view.css#L2-L25) |
| `composer` / `area-composer` | [conversation](#conversation) | [docs/specs/composer.md:39](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/composer.md#L39-L50) [packages/styles/src/components/composer.css:2](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/composer.css#L2-L40) |
| `textarea` / `area-textarea` | [native-paint](#native-paint), [state-edge](#state-edge) | [docs/specs/textarea.md:50](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/textarea.md#L50-L62) [packages/styles/src/components/textarea.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/textarea.css#L9-L55) |
| `select` / `area-select` | [native-paint](#native-paint), [list-focus-plate](#list-focus-plate) | [docs/specs/select.md:70](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/select.md#L70-L85) [packages/styles/src/components/navigation.css:243](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L243-L293) |
| `checkbox` / `area-checkbox` | [native-paint](#native-paint), [state-edge](#state-edge) | [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/checkbox.md#L47-L65) [packages/styles/src/components/choice.css:4](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/choice.css#L4-L14) |
| `checkboxGroup` / `area-checkbox-group` | [semantic-signal](#semantic-signal), [unpainted-host](#unpainted-host) | [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/checkbox.md#L47-L65) [packages/styles/src/components/choice.css:290](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/choice.css#L290-L299) |
| `radio` / `area-radio` | [native-paint](#native-paint), [state-edge](#state-edge) | [docs/specs/radio.md:48](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/radio.md#L48-L59) [packages/styles/src/components/choice.css:4](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/choice.css#L4-L14) |
| `radioGroup` / `area-radio-group` | [semantic-signal](#semantic-signal), [unpainted-host](#unpainted-host) | [docs/specs/radio.md:48](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/radio.md#L48-L59) [packages/styles/src/components/choice.css:290](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/choice.css#L290-L299) |
| `switch` / `area-switch` | [range-geometry](#range-geometry), [state-edge](#state-edge), [disabled-group-opacity](#disabled-group-opacity) | [docs/specs/switch.md:50](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/switch.md#L50-L68) [packages/styles/src/components/switch.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/switch.css#L3-L40) |
| `slider` / `area-slider` | [range-geometry](#range-geometry), [native-paint](#native-paint) | [docs/specs/slider.md:59](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/slider.md#L59-L70) [packages/styles/src/components/slider.css:18](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L18-L46) |
| `sliderRange` / `area-slider-range` | [range-geometry](#range-geometry), [native-paint](#native-paint) | [docs/specs/slider.md:59](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/slider.md#L59-L70) [packages/styles/src/components/slider.css:98](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L98-L107) |
| `chip` / `area-chip` | [literal-color](#literal-color), [passive-versus-action](#passive-versus-action), [intrinsic-media](#intrinsic-media), [solid-emphasis](#solid-emphasis) | [docs/specs/chip.md:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/chip.md#L57-L73) [packages/styles/src/components/chip.css:19](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/chip.css#L19-L63) |
| `chipGroup` / `area-chip-group` | [unpainted-host](#unpainted-host) | [docs/specs/chip.md:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/chip.md#L57-L73) [packages/styles/src/components/chip.css:280](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/chip.css#L280-L284) |
| `choiceLabel` / `area-choice-label` | [unpainted-host](#unpainted-host) | [docs/specs/checkbox.md:47](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/checkbox.md#L47-L65) [packages/styles/src/components/choice.css:420](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/choice.css#L420-L424) |
| `badge` / `area-badge` | [semantic-signal](#semantic-signal), [passive-versus-action](#passive-versus-action), [intrinsic-media](#intrinsic-media), [solid-emphasis](#solid-emphasis) | [docs/specs/badge.md:124](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/badge.md#L124-L142) [packages/styles/src/components/badge.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L3-L45) |
| `presence` / `area-presence` | [semantic-signal](#semantic-signal), [cutout-gaps](#cutout-gaps) | [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/indicator.md#L81-L99) [packages/styles/src/components/presence.css:5](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/presence.css#L5-L11) |
| `indicatorAnchor` / `area-indicator-anchor` | [unpainted-host](#unpainted-host) | [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/indicator.md#L81-L99) [packages/styles/src/components/indicator.css:26](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/indicator.css#L26) |
| `indicator` / `area-indicator` | [semantic-signal](#semantic-signal), [cutout-gaps](#cutout-gaps) | [docs/specs/indicator.md:81](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/indicator.md#L81-L99) [packages/styles/src/components/indicator.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/indicator.css#L3) |
| `count` / `area-count` | [semantic-signal](#semantic-signal), [passive-versus-action](#passive-versus-action), [solid-emphasis](#solid-emphasis) | [docs/specs/count.md:45](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/count.md#L45-L55) [packages/styles/src/components/count.css:15](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/count.css#L15-L52) |
| `accordionItem` / `area-accordion-item` | [unpainted-host](#unpainted-host), [long-surface](#long-surface), [divider-hierarchy](#divider-hierarchy) | [docs/specs/accordion.md:76](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/accordion.md#L76-L94) [packages/styles/src/components/accordion.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/accordion.css#L12-L22) |
| `accordion` / `area-accordion` | [unpainted-host](#unpainted-host) | [docs/specs/accordion.md:76](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/accordion.md#L76-L94) [packages/styles/src/components/accordion.css:159](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/accordion.css#L159) |
| `badgeGroup` / `area-badge-group` | [passive-versus-action](#passive-versus-action), [shared-shell](#shared-shell), [unpainted-host](#unpainted-host), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/badge-group.md:46](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/badge-group.md#L46-L64) [packages/styles/src/components/badge.css:212](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L212) |
| `avatar` / `area-avatar` | [passive-versus-action](#passive-versus-action), [intrinsic-media](#intrinsic-media), [cutout-gaps](#cutout-gaps) | [docs/specs/avatar.md:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/avatar.md#L57-L71) [packages/styles/src/components/display.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L9-L34) |
| `avatarGroup` / `area-avatar-group` | [passive-versus-action](#passive-versus-action), [intrinsic-media](#intrinsic-media), [unpainted-host](#unpainted-host) | [docs/specs/avatar.md:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/avatar.md#L57-L71) [packages/styles/src/components/display.css:81](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L81-L85) |
| `separator` / `area-separator` | [divider-hierarchy](#divider-hierarchy) | [docs/specs/separator.md:44](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/separator.md#L44-L57) [packages/styles/src/components/display.css:104](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L104-L109) |
| `skeleton` / `area-skeleton` | [semantic-signal](#semantic-signal) | [docs/specs/skeleton.md:56](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/skeleton.md#L56-L68) [packages/styles/src/components/display.css:152](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L152-L171) |
| `spinner` / `area-spinner` | [semantic-signal](#semantic-signal) | [docs/specs/spinner.md:43](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/spinner.md#L43-L50) [packages/styles/src/components/display.css:226](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L226-L243) |
| `progress` / `area-progress` | [range-geometry](#range-geometry), [semantic-signal](#semantic-signal) | [docs/specs/progress.md:44](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/progress.md#L44-L55) [packages/styles/src/components/display.css:274](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L274-L283) |
| `panel` / `area-panel` | [state-edge](#state-edge), [unpainted-host](#unpainted-host), [long-surface](#long-surface), [divider-hierarchy](#divider-hierarchy) | [docs/specs/panel.md:67](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/panel.md#L67-L85) [packages/styles/src/components/panel.css:18](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/panel.css#L18-L74) |
| `propertyList` / `area-property-list` | [state-edge](#state-edge), [unpainted-host](#unpainted-host) | [docs/specs/property-list.md:15](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/property-list.md#L15-L21) [packages/styles/src/components/property-list.css:8](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/property-list.css#L8-L16) |
| `boxField` / `area-box-field` | [shared-shell](#shared-shell), [unpainted-host](#unpainted-host) | [docs/specs/box-field.md:17](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/box-field.md#L17-L23) [packages/styles/src/components/box-field.css:14](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/box-field.css#L14-L23) |
| `combobox` / `area-combobox` | [dense-rows](#dense-rows), [scrim-and-overlay](#scrim-and-overlay), [list-focus-plate](#list-focus-plate) | [docs/specs/combobox.md:17](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/combobox.md#L17-L23) [packages/styles/src/components/combobox.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/combobox.css#L9) |
| `customSelect` / `area-custom-select` | [dense-rows](#dense-rows), [state-edge](#state-edge), [scrim-and-overlay](#scrim-and-overlay), [list-focus-plate](#list-focus-plate) | [docs/specs/custom-select.md:64](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/custom-select.md#L64-L82) [packages/styles/src/components/custom-select.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/custom-select.css#L10-L31) |
| `tag` / `area-tag` | [passive-versus-action](#passive-versus-action) | [docs/specs/tag.md:28](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/tag.md#L28-L35) [packages/styles/src/components/tag.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tag.css#L11-L43) |
| `tagPicker` / `area-tag-picker` | [dense-rows](#dense-rows), [state-edge](#state-edge), [scrim-and-overlay](#scrim-and-overlay), [list-focus-plate](#list-focus-plate) | [docs/specs/tag-picker.md:51](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/tag-picker.md#L51-L69) [packages/styles/src/components/tag-picker.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tag-picker.css#L11-L29) |
| `datePicker` / `area-date-picker` | [calendar-topology](#calendar-topology), [shared-shell](#shared-shell), [state-edge](#state-edge), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/date-picker.md:40](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/date-picker.md#L40-L58) [packages/styles/src/components/date-picker.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/date-picker.css#L10-L29) |
| `confirmDialog` / `area-confirm-dialog` | [shared-shell](#shared-shell), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/confirm-dialog.md:29](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/confirm-dialog.md#L29-L34) [packages/styles/src/components/confirm-dialog.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/confirm-dialog.css#L11) |
| `drawer` / `area-drawer` | [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/drawer.md:15](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/drawer.md#L15-L20) [packages/styles/src/components/drawer.css:46](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/drawer.css#L46-L74) |
| `commandPalette` / `area-command-palette` | [dense-rows](#dense-rows), [scrim-and-overlay](#scrim-and-overlay), [long-surface](#long-surface), [list-focus-plate](#list-focus-plate) | [docs/specs/command-palette.md:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/command-palette.md#L11-L18) [packages/styles/src/components/command-palette.css:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/command-palette.css#L57-L85) |
| `contextMenu` / `area-context-menu` | [dense-rows](#dense-rows), [unpainted-host](#unpainted-host), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/context-menu.md:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/context-menu.md#L11-L16) [packages/styles/src/components/context-menu.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/context-menu.css#L9) |
| `hoverCard` / `area-hover-card` | [shared-shell](#shared-shell), [intrinsic-media](#intrinsic-media), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/hover-card.md:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/hover-card.md#L12-L18) [packages/react/src/components/HoverCard.tsx:74](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/HoverCard.tsx#L74-L82) |
| `promptSuggestions` / `area-prompt-suggestions` | [dense-rows](#dense-rows), [intrinsic-media](#intrinsic-media) | [docs/specs/prompt-suggestions.md:18](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/prompt-suggestions.md#L18-L22) [packages/styles/src/components/prompt-suggestions.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/prompt-suggestions.css#L9-L18) |
| `message` / `area-message` | [conversation](#conversation), [translucent-washes](#translucent-washes) | [docs/specs/message.md:14](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/message.md#L14-L20) [packages/styles/src/components/message.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/message.css#L9-L19) |
| `scrollToLatest` / `area-scroll-to-latest` | [unpainted-host](#unpainted-host) | [docs/specs/scroll-to-latest.md:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/scroll-to-latest.md#L11-L14) [packages/styles/src/components/scroll-to-latest.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/scroll-to-latest.css#L10-L26) |
| `modelPicker` / `area-model-picker` | [dense-rows](#dense-rows), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/model-picker.md:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/model-picker.md#L11-L16) [packages/styles/src/components/model-picker.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/model-picker.css#L9) |
| `card` / `area-card` | [intrinsic-media](#intrinsic-media), [long-surface](#long-surface), [cutout-gaps](#cutout-gaps), [fixed-colour-fades](#fixed-colour-fades) | [docs/specs/card.md:87](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/card.md#L87-L105) [packages/styles/src/components/surface.css:33](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L33-L103) |
| `alert` / `area-alert` | [semantic-signal](#semantic-signal) | [docs/specs/alert.md:62](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/alert.md#L62-L80) [packages/styles/src/components/surface.css:552](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L552-L582) |
| `dialog` / `area-dialog` | [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/dialog.md:22](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/dialog.md#L22-L27) [packages/styles/src/components/surface.css:859](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L859-L887) |
| `popover` / `area-popover` | [intrinsic-media](#intrinsic-media), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/popover.md:26](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/popover.md#L26-L31) [packages/styles/src/components/surface.css:964](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L964-L982) |
| `menu` / `area-menu` | [dense-rows](#dense-rows), [scrim-and-overlay](#scrim-and-overlay), [divider-hierarchy](#divider-hierarchy), [list-focus-plate](#list-focus-plate) | [docs/specs/menu.md:14](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/menu.md#L14-L20) [packages/styles/src/components/surface.css:964](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L964-L982) |
| `tooltip` / `area-tooltip` | [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/tooltip.md:60](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/tooltip.md#L60-L77) [packages/styles/src/components/surface.css:1354](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1354-L1389) |
| `toast` / `area-toast` | [semantic-signal](#semantic-signal), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/toast.md:22](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/toast.md#L22-L27) [packages/styles/src/components/surface.css:1472](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1472-L1494) |
| `toaster` / `area-toaster` | [unpainted-host](#unpainted-host), [scrim-and-overlay](#scrim-and-overlay) | [docs/specs/toast.md:22](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/toast.md#L22-L27) [packages/styles/src/components/surface.css:1437](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1437-L1444) |
| `tabs` / `area-tabs` | [state-edge](#state-edge), [divider-hierarchy](#divider-hierarchy) | [docs/specs/tabs.md:61](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/tabs.md#L61-L79) [packages/styles/src/components/navigation.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L10-L22) |
| `table` / `area-table` | [dense-rows](#dense-rows), [divider-hierarchy](#divider-hierarchy), [list-focus-plate](#list-focus-plate) | [docs/specs/table.md:60](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/table.md#L60-L78) [packages/styles/src/components/navigation.css:153](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L153-L164) |
| `tableWrapper` / `area-table-wrapper` | [long-surface](#long-surface), [divider-hierarchy](#divider-hierarchy) | [docs/specs/table.md:60](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/table.md#L60-L78) [packages/styles/src/components/navigation.css:137](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L137-L146) |
| `segmented` / `area-segmented` | [range-geometry](#range-geometry) | [docs/specs/segmented.md:47](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/segmented.md#L47-L65) [packages/styles/src/components/segmented.css:31](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/segmented.css#L31-L55) |
| `code` / `area-code` | [code-ink](#code-ink), [literal-color](#literal-color) | [docs/specs/code.md:50](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/code.md#L50-L64) [packages/styles/src/components/code.css:101](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L101-L144) |
| `codeBlock` / `area-code-block` | [code-ink](#code-ink), [state-edge](#state-edge), [long-surface](#long-surface), [divider-hierarchy](#divider-hierarchy), [fixed-colour-fades](#fixed-colour-fades) | [docs/specs/code-block.md:56](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/code-block.md#L56-L74) [packages/styles/src/components/code.css:146](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L146-L159) |
| `nav` / `area-nav` | [dense-rows](#dense-rows), [state-edge](#state-edge), [divider-hierarchy](#divider-hierarchy), [list-focus-plate](#list-focus-plate) | [docs/specs/nav.md:69](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/nav.md#L69-L87) [packages/styles/src/components/nav.css:20](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/nav.css#L20-L29) |
| `token` / `area-token` | [code-ink](#code-ink), [literal-color](#literal-color) | [docs/specs/code.md:50](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/code.md#L50-L64) [packages/styles/src/components/token.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/token.css#L9-L17) |
| `kbd` / `area-kbd` | [passive-versus-action](#passive-versus-action), [translucent-washes](#translucent-washes) | [docs/specs/kbd.md:58](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/kbd.md#L58-L73) [packages/styles/src/components/kbd.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/kbd.css#L10-L49) |
| `kbdGroup` / `area-kbd-group` | [passive-versus-action](#passive-versus-action), [unpainted-host](#unpainted-host) | [docs/specs/kbd.md:58](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/docs/specs/kbd.md#L58-L73) [packages/styles/src/components/kbd.css:73](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/kbd.css#L73-L77) |

<a id="dense-rows"></a>
## Repeated text rows are a shared reading plane

**Families:** `table`, `menu`, `nav`, `treeView`, `combobox`, `customSelect`, `commandPalette`, `contextMenu`, `modelPicker`, `tagPicker`, `promptSuggestions`, `dateRangePicker`, `pagination`.

**Why role alone is insufficient:** A row is an action/selection target but repeats inside one reading region. Painting each as an independent material slab would obscure scan rhythm and compete with the actual selected/highlight paint.

**Common guard:** Row bodies: at most Trace, with no local blur, grain, cast, bevel or bloom; retain existing state fill. Row text/glyphs: None. Put at most Quiet material on the surrounding shell, with an opaque reading center. Selected/highlighted states do not grant extra decoration.

**Amount (historical caps superseded D1/D3/D14):** Trace on row; Quiet on reading shell; None on ink.

**Pinned evidence for the existing parts:**

- `table.row`: [packages/styles/src/components/navigation.css:232](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L232-L234)
- `menu.item`: [packages/styles/src/components/surface.css:1112](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1112-L1131)
- `nav.item`: [packages/styles/src/components/nav.css:97](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/nav.css#L97-L121)
- `treeView.row`: [packages/styles/src/components/tree-view.css:28](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tree-view.css#L28-L60)
- `combobox.option`: [packages/react/src/components/Combobox.tsx:220](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/Combobox.tsx#L220-L236)
- `customSelect.option`: [packages/react/src/components/CustomSelect.tsx:208](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/CustomSelect.tsx#L208-L217)
- `commandPalette.item`: [packages/styles/src/components/command-palette.css:131](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/command-palette.css#L131)
- `tagPicker.option`: [packages/react/src/components/TagPicker.tsx:227](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/TagPicker.tsx#L227-L233)
- `promptSuggestions.item`: [packages/styles/src/components/prompt-suggestions.css:20](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/prompt-suggestions.css#L20-L47)

<a id="code-ink"></a>
## Code and syntax require a stable actual ground

**Families:** `code`, `codeBlock`, `token`.

**Why role alone is insufficient:** Syntax colors, diff lines, target rails, line numbers and code copy have distinct meanings; a role label of text/container alone cannot express these adjacent constraints.

**Common guard:** Code/code-line bodies and ink: None for decorative transmission, gradients, texture, relief or glow. Frame/header: at most Trace. Preserve syntax colors, diff grounds and target rails. Collapsed fade is functional scrim, not a material highlight. Token/Code color swatches also use literal-color guard.

**Amount (historical caps superseded D1/D3/D14):** None in code reading plane; Trace on frame/header.

**Pinned evidence for the existing parts:**

- `code.root`: [packages/styles/src/components/code.css:101](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L101-L144)
- `codeBlock.pre`: [packages/styles/src/components/code.css:195](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L195-L210)
- `codeBlock.syntax-keyword`: [packages/styles/src/components/code.css:383](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L383)
- `codeBlock.line-fill`: [packages/styles/src/components/code.css:329](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L329-L342)
- `codeBlock.target-mark`: [packages/styles/src/components/code.css:350](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L350-L354)
- `codeBlock.collapse-scrim`: [packages/styles/src/components/code.css:490](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L490-L503)
- `token.swatch`: [packages/styles/src/components/token.css:37](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/token.css#L37-L47)

<a id="conversation"></a>
## Authored conversation is not chrome

**Families:** `message`, `composer`.

**Why role alone is insufficient:** Message content can be long and rich; user bubble, assistant content, action bar and streaming cursor have different jobs. Composer mixes a readable editing well with controls.

**Common guard:** Message bubble at most Trace uniform tonal paint; assistant prose and composer input None for decorative effects. Actions may take Trace plate treatment; cursor retains semantic indicator and motion policy. Embedded code/media dispatch to their guards. No animated reflections or refraction under reading/typing.

**Amount (historical caps superseded D1/D3/D14):** Trace on bubble/actions; None on reading/editing plane.

**Pinned evidence for the existing parts:**

- `message.bubble`: [packages/styles/src/components/message.css:29](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/message.css#L29-L37)
- `message.content`: [packages/styles/src/components/message.css:40](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/message.css#L40)
- `message.cursor`: [packages/styles/src/components/message.css:65](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/message.css#L65-L77)
- `composer.root`: [packages/styles/src/components/composer.css:2](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/composer.css#L2-L40)
- `composer.input`: [packages/styles/src/components/composer.css:54](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/composer.css#L54-L59)
- `composer.submit`: [packages/react/src/components/Composer.tsx:111](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/Composer.tsx#L111-L115)

<a id="calendar-topology"></a>
## Calendar selection is a connected field

**Families:** `calendar`, `datePicker`.

**Why role alone is insufficient:** Days repeat on one grid; range bridges, endpoints, today ring and event markers overlap semantically. Independent glossy day tiles or edge shadows would imply unrelated raised buttons and break the interval silhouette.

**Common guard:** Day plate at most Trace; no local blur/cast/grain/glow. Range bridge and markers keep exact shape and semantic fill, today/focus edges stay separate. Header controls may take Trace. Calendar surface may take Quiet; plain Calendar inside DatePicker has no second shell. Month/week geometry and hidden outside days remain unchanged.

**Amount (historical caps superseded D1/D3/D14):** Trace days/header actions; Quiet standalone shell; no inner shell for plain.

**Pinned evidence for the existing parts:**

- `calendar.day`: [packages/styles/src/components/calendar.css:69](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/calendar.css#L69-L84)
- `calendar.range-fill`: [packages/styles/src/components/calendar.css:113](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/calendar.css#L113-L129)
- `calendar.marker`: [packages/styles/src/components/calendar.css:102](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/calendar.css#L102-L106)
- `calendar.day.edge`: [packages/styles/src/components/calendar.css:90](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/calendar.css#L90)
- `calendar.root`: [packages/styles/src/components/calendar.css:4](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/calendar.css#L4-L19)
- `datePicker.panel`: [packages/styles/src/components/date-picker.css:141](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/date-picker.css#L141-L144)

<a id="range-geometry"></a>
## Travel, extent and selection cannot be optical decoration

**Families:** `slider`, `sliderRange`, `switch`, `segmented`, `alignmentPicker`, `progress`.

**Why role alone is insufficient:** Thumb/track, two range endpoints, selected segment, alignment mark and progress bar encode coordinates or state; an attractive highlight can otherwise be mistaken for a second thumb or a filled interval.

**Common guard:** Track at most Trace, semantic fill unchanged. Thumb may take Quiet (Full only a sparse, explicitly chosen large standalone handle after review); keep the core, focus and hit geometry exact. SliderRange has one rail and two logical thumbs, with overlap handling. Segmented selected item is a control, not a new moving lens. Alignment bars remain semantic glyphs, not bevels.

**Amount (historical caps superseded D1/D3/D14):** Trace track; Quiet normal thumb; no extra decoration on encoded fill.

**Pinned evidence for the existing parts:**

- `slider.selected-fill`: [packages/styles/src/components/slider.css:190](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L190-L209)
- `slider.thumb`: [packages/styles/src/components/slider.css:224](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L224-L249)
- `sliderRange.rail`: [packages/styles/src/components/slider.css:120](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L120-L129)
- `sliderRange.selected-fill`: [packages/styles/src/components/slider.css:131](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L131-L140)
- `switch.thumb`: [packages/styles/src/components/switch.css:100](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/switch.css#L100-L120)
- `segmented.item`: [packages/styles/src/components/segmented.css:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/segmented.css#L57-L83)
- `alignmentPicker.bars`: [packages/styles/src/components/alignment-picker.css:78](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/alignment-picker.css#L78-L104)
- `progress.bar`: [packages/styles/src/components/display.css:294](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L294-L301)

<a id="literal-color"></a>
## Color is data, not material pigment

**Families:** `colorPicker`, `colorSwatch`, `colorSwatchPicker`, `colorField`, `code`, `token`, `chip`.

**Why role alone is insufficient:** Color samples, alpha checkers, hue/channel ramps and contrast checks display literal values. Recoloring or frosting them would falsify the interface, even if their role is indicator/fill.

**Common guard:** Sample pixels, checker, ramp, contrast mask and value text take None. Material may apply only to surrounding shell/edge/handle outside the sample area. Preserve the native alpha checker distinction. A thumb that displays the chosen color keeps its core literal; material may affect its rim only. Picker shell Quiet, handles at most Quiet; no grain, tint, sheen or refraction across the actual color.

**Amount (historical caps superseded D1/D3/D14):** None on data; Quiet surrounding shell/handle.

**Pinned evidence for the existing parts:**

- `colorPicker.area`: [packages/styles/src/components/color.css:259](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L259-L264)
- `colorPicker.hue`: [packages/styles/src/components/color.css:308](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L308-L310)
- `colorPicker.alpha`: [packages/styles/src/components/color.css:311](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L311-L314)
- `colorPicker.contrast-pair`: [packages/styles/src/components/color.css:338](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L338-L342)
- `colorPicker.band-region`: [packages/styles/src/components/color.css:351](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L351)
- `colorSwatch.sample`: [packages/styles/src/components/color.css:66](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L66-L69)
- `colorSwatch.checker`: [packages/styles/src/components/color.css:49](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L49-L65)
- `code.swatch`: [packages/styles/src/components/token.css:37](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/token.css#L37-L47)
- `chip.swatch`: [packages/styles/src/components/chip.css:141](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/chip.css#L141-L152)

<a id="semantic-signal"></a>
## Status and validation dominate decorative style

**Families:** `badge`, `presence`, `indicator`, `count`, `alert`, `toast`, `progress`, `spinner`, `skeleton`, `field`, `checkboxGroup`, `radioGroup`, `meter`, `fileUploadItem`, `timelineItem`.

**Why role alone is insufficient:** Small marks, tone fills, validation text and loading/progress shapes carry meaning. A style-wide accent or glow cannot substitute for their core color, shape or temporal signal.

**Common guard:** Semantic core and ink take None; enclosing body at most Trace. An explicitly emissive status may add Trace supplementary halo only when unclipped and not next to dense text; it never expands value extent. Forced colors keeps system marks. Loading/disabled/read-only remain distinct; material cannot add a false status animation.

**Amount (historical caps superseded D1/D3/D14):** None semantic core/ink; Trace enclosing body or optional halo.

**Pinned evidence for the existing parts:**

- `badge.dot-ink`: [packages/styles/src/components/badge.css:66](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L66)
- `presence.status-glyph`: [packages/styles/src/components/presence.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/presence.css#L12)
- `indicator.pulse`: [packages/styles/src/components/indicator.css:19](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/indicator.css#L19-L23)
- `count.number`: [packages/styles/src/components/count.css:15](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/count.css#L15-L45)
- `alert.icon`: [packages/styles/src/components/surface.css:586](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L586-L595)
- `toast.icon`: [packages/styles/src/components/surface.css:1497](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1497-L1504)
- `progress.bar`: [packages/styles/src/components/display.css:294](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L294-L301)
- `spinner.arc`: [packages/styles/src/components/display.css:246](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L246-L254)
- `skeleton.root`: [packages/styles/src/components/display.css:152](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L152-L171)
- `field.validation`: [packages/styles/src/components/field.css:41](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/field.css#L41-L49)

<a id="passive-versus-action"></a>
## A painted badge/keycap is not necessarily a button

**Families:** `badge`, `tag`, `chip`, `count`, `kbd`, `kbdGroup`, `avatar`, `avatarGroup`, `badgeGroup`.

**Why role alone is insufficient:** Passive tags, badges, counts, keycaps and avatars share visual shapes with action plates, while removal/overflow can introduce actual controls. Role-only material cannot decide interaction emphasis.

**Common guard:** Passive body at most Trace, no raised affordance merely from a rounded shape. Removal/dismiss/overflow action owns its own Trace plate and glyph. Keycap remains a representation, not an interactive key. Preserve Tag tone and independent removal target.

**Amount (historical caps superseded D1/D3/D14):** Trace bodies/actions; no invented interactive lift.

**Pinned evidence for the existing parts:**

- `badge.root`: [packages/styles/src/components/badge.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L3-L45)
- `tag.root`: [packages/styles/src/components/tag.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tag.css#L11-L43)
- `tag.remove`: [packages/styles/src/components/tag.css:87](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tag.css#L87-L107)
- `chip.root`: [packages/styles/src/components/chip.css:19](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/chip.css#L19-L63)
- `chip.remove`: [packages/styles/src/components/chip.css:214](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/chip.css#L214-L227)
- `kbd.root`: [packages/styles/src/components/kbd.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/kbd.css#L10-L49)
- `avatarGroup.overflow`: [packages/styles/src/components/display.css:87](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L87-L91)
- `badgeGroup.overflow-trigger`: [packages/styles/src/components/badge.css:217](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L217)

<a id="shared-shell"></a>
## Composition owns one physical boundary

**Families:** `buttonGroup`, `splitButton`, `inputGroup`, `colorField`, `colorPicker`, `datePicker`, `confirmDialog`, `hoverCard`, `badgeGroup`, `boxField`, `toolbar`, `toggleGroup`, `searchField`, `zoomControl`, `dateRangePicker`.

**Why role alone is insufficient:** Joined controls and component aliases deliberately remove duplicate chrome or reuse another family on the same element; blindly applying both role recipes would double borders, shadows, blur or padding.

**Common guard:** Resolve task 04 donor bindings before painting. One body/edge/cast owner per co-classed shell. Segments take at most Trace internal treatment; keep one seam with inherited geometry. Do not let an imported donor recipe re-enable stripped child chrome. Content parts retain their own role recipes.

**Amount (historical caps superseded D1/D3/D14):** One shell; Trace segments, donor root aliases rather than extra paints.

**Pinned evidence for the existing parts:**

- `buttonGroup.join`: [packages/styles/src/components/button-group.css:73](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/button-group.css#L73-L82)
- `splitButton.join`: [packages/styles/src/components/split-button.css:45](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/split-button.css#L45-L55)
- `inputGroup.root`: [packages/styles/src/components/input-group.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/input-group.css#L3-L31)
- `colorField.opacity`: [packages/styles/src/components/color.css:191](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L191-L197)
- `colorPicker.fields`: [packages/styles/src/components/color.css:374](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L374-L376)
- `datePicker.panel`: [packages/styles/src/components/date-picker.css:141](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/date-picker.css#L141-L144)
- `confirmDialog.root`: [packages/styles/src/components/confirm-dialog.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/confirm-dialog.css#L11)
- `hoverCard.root`: [packages/react/src/components/HoverCard.tsx:74](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/HoverCard.tsx#L74-L82)
- `badgeGroup.overflow-content`: [packages/styles/src/components/badge.css:219](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L219-L220)
- `boxField.field`: [packages/styles/src/components/box-field.css:46](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/box-field.css#L46)
- `toolbar.root`: [packages/styles/src/components/toolbar.css:2](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toolbar.css#L2-L25)

<a id="intrinsic-media"></a>
## Media pixels are not recolorable glyph ink

**Families:** `avatar`, `avatarGroup`, `badge`, `chip`, `card`, `popover`, `hoverCard`, `promptSuggestions`, `fileUpload`, `fileUploadItem`, `emptyState`, `citation`, `timelineItem`.

**Why role alone is insufficient:** The closed task 04 vocabulary includes photos/video/flags under glyph or a media container. Their content is authored, and media readability scrims are functional.

**Common guard:** Intrinsic image/video/flag pixels take None. A surrounding frame or container may take Trace/Quiet as its context permits. Preserve existing aspect/crop and local readability fade; never apply letterpress, neon, grain or material tint through an inherited glyph rule.

**Amount (historical caps superseded D1/D3/D14):** None on pixels; no inherited glyph effect.

**Pinned evidence for the existing parts:**

- `avatar.image`: [packages/styles/src/components/display.css:36](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L36-L40)
- `badge.flag`: [packages/styles/src/components/badge.css:192](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L192)
- `chip.image`: [packages/styles/src/components/chip.css:168](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/chip.css#L168-L176)
- `card.media-pixels`: [packages/styles/src/components/surface.css:333](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L333-L341)
- `card.media-scrim`: [packages/styles/src/components/surface.css:166](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L166-L174)
- `popover.media-pixels`: [packages/styles/src/components/surface.css:1088](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1088-L1089)
- `promptSuggestions.icon`: [packages/styles/src/components/prompt-suggestions.css:63](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/prompt-suggestions.css#L63-L69)

<a id="native-paint"></a>
## Native painted subparts and browser fallbacks need adapters

**Families:** `select`, `input`, `textarea`, `checkbox`, `radio`, `slider`, `sliderRange`, `colorPicker`.

**Why role alone is insufficient:** Native option popup, slider pseudos, file action, checkbox/radio mark and textarea resize grip do not expose the same paint hooks as a div. Generated pseudo content is already in use.

**Common guard:** Apply the conceptual role to the actual painted native part, not a hidden input or wrapper. Enhanced native picker and classic OS picker are alternative paths. Keep opaque/solid native fallback; do not insert duplicate chevrons, marks or thumb geometry to force style parity. No browser-support claim is made by this matrix.

**Amount (historical caps superseded D1/D3/D14):** Conservative existing native path when enhancement is unavailable.

**Pinned evidence for the existing parts:**

- `select.picker`: [packages/styles/src/components/navigation.css:387](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L387-L410)
- `select.fallback-chevron`: [packages/styles/src/components/navigation.css:286](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L286-L297)
- `select.checkmark`: [packages/styles/src/components/navigation.css:465](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L465-L476)
- `input.file-button`: [packages/styles/src/components/input.css:171](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/input.css#L171-L184)
- `checkbox.mark`: [packages/styles/src/components/choice.css:176](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/choice.css#L176-L202)
- `radio.mark`: [packages/styles/src/components/choice.css:176](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/choice.css#L176-L217)
- `slider.rail-webkit`: [packages/styles/src/components/slider.css:190](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L190-L199)
- `slider.rail-moz`: [packages/styles/src/components/slider.css:200](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/slider.css#L200-L209)
- `colorPicker.slider-thumb`: [packages/styles/src/components/color.css:274](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/color.css#L274-L287)

<a id="state-edge"></a>
## Functional edge/mark is not a decorative rim

**Families:** `button`, `input`, `numberField`, `textarea`, `checkbox`, `radio`, `switch`, `tabs`, `nav`, `treeView`, `breadcrumb`, `propertyList`, `panel`, `codeBlock`, `customSelect`, `tagPicker`, `datePicker`, `editableText`, `link`, `toggletip`, `fileUpload`, `pagination`.

**Why role alone is insufficient:** Focus, invalid, selected underline, target rail and insertion line can occupy the same pixel region as a material edge; some are drawn with box-shadow or borders.

**Common guard:** Identify purpose before compositing. Required state paint wins and may suppress nearby decoration; it is never scaled by absorption. Do not recolor foreground on hover. Separate selected/highlighted semantics from cosmetic press relief and preserve simultaneous focus plus invalid/selection.

**Amount (historical caps superseded D1/D3/D14):** Material contribution suppressed where it conflicts with required signal.

**Pinned evidence for the existing parts:**

- `button.root.edge`: [packages/styles/src/components/button.css:21](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/button.css#L21-L97)
- `input.root.edge`: [packages/styles/src/components/input.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/input.css#L13-L58)
- `tabs.selected-mark`: [packages/styles/src/components/navigation.css:54](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L54-L68)
- `nav.selected-mark`: [packages/styles/src/components/nav.css:182](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/nav.css#L182-L194)
- `treeView.row-edge`: [packages/styles/src/components/tree-view.css:60](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tree-view.css#L60)
- `propertyList.indicator`: [packages/styles/src/components/property-list.css:66](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/property-list.css#L66-L75)
- `panel.resize-focus`: [packages/styles/src/components/panel.css:351](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/panel.css#L351-L359)
- `codeBlock.target-mark`: [packages/styles/src/components/code.css:350](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L350-L354)

<a id="unpainted-host"></a>
## Layout, hit targets and hidden labels are not receivers

**Families:** `field`, `checkboxGroup`, `radioGroup`, `chipGroup`, `choiceLabel`, `accordion`, `accordionItem`, `indicatorAnchor`, `avatarGroup`, `badgeGroup`, `boxField`, `propertyList`, `panel`, `contextMenu`, `scrollToLatest`, `toaster`, `buttonGroup`, `kbdGroup`, `toolbar`, `fileUploadList`, `emptyState`, `descriptionList`, `meter`, `shortcutList`, `board`, `timeline`, `scrollArea`, `pagination`.

**Why role alone is insufficient:** Groups, row slots, portals, modal wrappers, expanded hit areas and accessible text can be in the contract without painting a visible body.

**Common guard:** Nonpaint and layout-only parts receive None until an actual painted child is resolved. Do not turn every container into a panel. Preserve target dimensions and hidden/live-region semantics. An overlay positioning wrapper does not gain its own floating material before its child.

**Amount (historical caps superseded D1/D3/D14):** None on nonpaint/layout host.

**Pinned evidence for the existing parts:**

- `count.label`: [packages/styles/src/components/count.css:76](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/count.css#L76-L86)
- `panel.resize`: [packages/styles/src/components/panel.css:330](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/panel.css#L330-L343)
- `contextMenu.root`: [packages/styles/src/components/context-menu.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/context-menu.css#L9)
- `scrollToLatest.root`: [packages/styles/src/components/scroll-to-latest.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/scroll-to-latest.css#L10-L26)
- `toaster.item`: [packages/styles/src/components/surface.css:1456](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1456-L1467)
- `treeView.chevron-hit`: [packages/styles/src/components/tree-view.css:78](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tree-view.css#L78)
- `tooltip.pointer-bridge`: [packages/styles/src/components/surface.css:1576](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1576-L1584)
- `switch.control`: [packages/styles/src/components/switch.css:49](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/switch.css#L49-L63)
- `indicatorAnchor.indicator`: [packages/styles/src/components/indicator.css:57](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/indicator.css#L57-L63)

<a id="scrim-and-overlay"></a>
## Overlays need backdrop, arrow, clipping and scope context

**Families:** `dialog`, `confirmDialog`, `drawer`, `popover`, `menu`, `tooltip`, `toast`, `toaster`, `commandPalette`, `contextMenu`, `hoverCard`, `datePicker`, `modelPicker`, `combobox`, `customSelect`, `tagPicker`, `badgeGroup`, `toggletip`, `zoomControl`, `dateRangePicker`.

**Why role alone is insufficient:** Modal and nonmodal surfaces differ, direct-dialog/wrapper backdrops are alternatives, and an arrow must continue the same shell. Popovers and tooltips can be rendered outside their trigger subtree.

**Common guard:** Drawer is modal by default (modal=false opts out). One functional scrim per modal boundary; no invented scrim for modeless overlays. Arrow continues the same shell without a second acquisition. D7: arbitrary backdrop for floating shells, failing edges take opaque fallback, with app transparency preference and opaque forced-colors Canvas plus backdrop-filter:none.

**Amount (historical caps superseded D1/D3/D14):** Trace Tooltip; Quiet reading overlay; one scrim and shell.

**Pinned evidence for the existing parts:**

- `dialog.scrim`: [packages/styles/src/components/surface.css:819](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L819-L824)
- `dialog.direct-scrim`: [packages/styles/src/components/surface.css:889](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L889)
- `drawer.scrim`: [packages/styles/src/components/drawer.css:38](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/drawer.css#L38-L43)
- `popover.arrow`: [packages/styles/src/components/surface.css:1025](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1025-L1034)
- `popover.arrow-edge`: [packages/styles/src/components/surface.css:1035](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1035)
- `tooltip.arrow`: [packages/styles/src/components/surface.css:1404](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1404-L1417)
- `tooltip.pointer-bridge`: [packages/styles/src/components/surface.css:1576](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1576-L1584)
- `commandPalette.modal`: [packages/styles/src/components/command-palette.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/command-palette.css#L9-L18)
- `datePicker.panel`: [packages/styles/src/components/date-picker.css:141](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/date-picker.css#L141-L144)

<a id="long-surface"></a>
## Large reading or inspector surfaces cap repeated effects

**Families:** `panel`, `card`, `tableWrapper`, `codeBlock`, `commandPalette`, `accordionItem`.

**Why role alone is insufficient:** A general container can be an empty visual showcase or a dense inspector/card/table frame; part role alone says nothing about sustained reading, repetition or interior controls.

**Common guard:** Large reading body at most Trace and opaque, shell perimeter at most Quiet; avoid broad gloss/noise/colored variation under content. Panel sections share body and light rig. TableWrapper remains flush with its required frame rather than taking Card elevation. Shell clipping must not clip focus or nested popup.

**Amount (historical caps superseded D1/D3/D14):** Trace reading body; Quiet shell boundary; TableWrapper has no new lift.

**Pinned evidence for the existing parts:**

- `panel.body`: [packages/styles/src/components/panel.css:124](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/panel.css#L124-L134)
- `panel.section`: [packages/styles/src/components/panel.css:160](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/panel.css#L160-L170)
- `panel.root`: [packages/styles/src/components/panel.css:18](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/panel.css#L18-L74)
- `card.content`: [packages/styles/src/components/surface.css:226](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L226-L234)
- `card.root`: [packages/styles/src/components/surface.css:33](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L33-L103)
- `tableWrapper.root`: [packages/styles/src/components/navigation.css:137](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L137-L146)
- `codeBlock.pre`: [packages/styles/src/components/code.css:195](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L195-L210)
- `commandPalette.list`: [packages/styles/src/components/command-palette.css:121](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/command-palette.css#L121-L130)
- `accordionItem.content`: [packages/styles/src/components/accordion.css:127](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/accordion.css#L127-L131)

<a id="divider-hierarchy"></a>
## Rules inherit structural hierarchy, not full edge styling

**Families:** `separator`, `toolbar`, `panel`, `menu`, `table`, `tableWrapper`, `tabs`, `nav`, `accordionItem`, `buttonGroup`, `splitButton`, `codeBlock`.

**Why role alone is insufficient:** Container seams, standalone separators, tab tracks and joined-control seams have different owners. Treating every divider as a full luminous/engraved rim would destroy the hierarchy.

**Common guard:** At most Trace, one line owner. Internal seam must remain quieter than its containing boundary except the documented joined-control seam. Selected underline/target/insertion marks use semantic guard instead of being styled as separators. No external shadow on a rule.

**Amount (historical caps superseded D1/D3/D14):** Trace structural rule; semantic markers exempt from decorative attenuation.

**Pinned evidence for the existing parts:**

- `separator.root`: [packages/styles/src/components/display.css:104](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L104-L109)
- `toolbar.separator`: [packages/styles/src/components/toolbar.css:68](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toolbar.css#L68)
- `panel.section.divider`: [packages/styles/src/components/panel.css:160](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/panel.css#L160-L170)
- `menu.separator`: [packages/styles/src/components/surface.css:1251](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1251-L1262)
- `table.cell.divider`: [packages/styles/src/components/navigation.css:166](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L166-L175)
- `tabs.list.divider`: [packages/styles/src/components/navigation.css:89](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L89)
- `nav.separator`: [packages/styles/src/components/nav.css:253](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/nav.css#L253-L257)
- `buttonGroup.join`: [packages/styles/src/components/button-group.css:73](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/button-group.css#L73-L82)
- `splitButton.join`: [packages/styles/src/components/split-button.css:45](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/split-button.css#L45-L55)

<a id="cutout-gaps"></a>
## Cutout rings must transmit the real host

**Families:** `avatar`, `indicator`, `presence`, `card`.

**Why role alone is insufficient:** Cutout rings must transmit the real host. A role alone lacks this semantic/composition context.

**Common guard:** A page-colored ring paints over a material host. D12 replaces the gap with a mask; do not recolor it to approximate the host or erase the semantic status ring.

**Amount (historical caps superseded D1/D3/D14):** Hard semantic/accessibility guard; decorative strength pending D3 calibration.

**Pinned evidence for the existing parts:**

- `avatar.rings`: [packages/styles/src/components/display.css:9](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/display.css#L9-L34)
- `indicator.root`: [packages/styles/src/components/indicator.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/indicator.css#L3)
- `presence.root`: [packages/styles/src/components/presence.css:5](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/presence.css#L5-L11)
- `card.media-scrim`: [packages/styles/src/components/surface.css:166](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L166-L174)

<a id="fixed-colour-fades"></a>
## Fixed-color fades are not transparent gaps

**Families:** `card`, `codeBlock`.

**Why role alone is insufficient:** Fixed-color fades are not transparent gaps. A role alone lacks this semantic/composition context.

**Common guard:** Immersive and code fades can reveal a false page color. D12 requires actual alpha masking for the content gap; keep any separately required contrast scrim and control target.

**Amount (historical caps superseded D1/D3/D14):** Hard semantic/accessibility guard; decorative strength pending D3 calibration.

**Pinned evidence for the existing parts:**

- `card.media-scrim`: [packages/styles/src/components/surface.css:166](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L166-L174)
- `codeBlock.toggle`: [packages/styles/src/components/code.css:416](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/code.css#L416-L435)

<a id="translucent-washes"></a>
## Existing washes compose with material

**Families:** `kbd`, `message`, `boardColumn`, `citation`.

**Why role alone is insufficient:** Existing washes compose with material. A role alone lacks this semantic/composition context.

**Common guard:** Composite existing translucent washes with body, host and scene; do not treat the token color as opaque or apply the alpha twice. Preserve semantic ink and D7 fallback.

**Amount (historical caps superseded D1/D3/D14):** Hard semantic/accessibility guard; decorative strength pending D3 calibration.

**Pinned evidence for the existing parts:**

- `kbd.root`: [packages/styles/src/components/kbd.css:10](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/kbd.css#L10-L49)
- `message.bubble`: [packages/styles/src/components/message.css:29](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/message.css#L29-L37)
- `boardColumn.root`: [packages/styles/src/components/board.css:21](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/board.css#L21-L38)
- `citation.root`: [packages/styles/src/components/citation.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/citation.css#L13-L45)

<a id="list-focus-plate"></a>
## Keyboard focus is the row plate

**Families:** `menu`, `nav`, `treeView`, `table`, `select`, `combobox`, `customSelect`, `commandPalette`, `calendar`, `dateRangePicker`, `tagPicker`.

**Why role alone is insufficient:** Keyboard focus is the row plate. A role alone lacks this semantic/composition context.

**Common guard:** D6 row-plate owns hover/highlight/focus/selection paint. Preserve the active-descendant plate as required state; adding a focus ring elsewhere does not replace it. Do not scale required state paint by decorative strength.

**Amount (historical caps superseded D1/D3/D14):** Hard semantic/accessibility guard; decorative strength pending D3 calibration.

**Pinned evidence for the existing parts:**

- `menu.item`: [packages/styles/src/components/surface.css:1112](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/surface.css#L1112-L1131)
- `nav.item`: [packages/styles/src/components/nav.css:97](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/nav.css#L97-L121)
- `treeView.row`: [packages/styles/src/components/tree-view.css:28](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/tree-view.css#L28-L60)
- `table.row`: [packages/styles/src/components/navigation.css:232](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L232-L234)
- `select.option`: [packages/styles/src/components/navigation.css:432](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/navigation.css#L432-L464)
- `combobox.option`: [packages/react/src/components/Combobox.tsx:220](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/Combobox.tsx#L220-L236)
- `customSelect.option`: [packages/react/src/components/CustomSelect.tsx:208](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/CustomSelect.tsx#L208-L217)
- `commandPalette.item`: [packages/styles/src/components/command-palette.css:131](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/command-palette.css#L131)
- `calendar.day`: [packages/styles/src/components/calendar.css:69](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/calendar.css#L69-L84)
- `dateRangePicker.preset`: [packages/styles/src/components/date-range-picker.css:24](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/date-range-picker.css#L24)
- `tagPicker.option`: [packages/react/src/components/TagPicker.tsx:227](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/react/src/components/TagPicker.tsx#L227-L233)

<a id="solid-emphasis"></a>
## Solid emphasis is semantic backing

**Families:** `button`, `chip`, `badge`, `count`.

**Why role alone is insufficient:** Solid emphasis is semantic backing. A role alone lacks this semantic/composition context.

**Common guard:** Retain action/selection/tone backing and paired foreground on solid emphasis. Optional gloss/transmission cannot silently turn a solid semantic action into a ghost; test composed paint and fall back without changing hover ink.

**Amount (historical caps superseded D1/D3/D14):** Hard semantic/accessibility guard; decorative strength pending D3 calibration.

**Pinned evidence for the existing parts:**

- `button.root`: [packages/styles/src/components/button.css:21](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/button.css#L21-L97)
- `chip.root`: [packages/styles/src/components/chip.css:19](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/chip.css#L19-L63)
- `badge.root`: [packages/styles/src/components/badge.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/badge.css#L3-L45)
- `count.root`: [packages/styles/src/components/count.css:15](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/count.css#L15-L52)

<a id="disabled-group-opacity"></a>
## Disabled group opacity is applied once

**Families:** `buttonGroup`, `toggleGroup`, `fileUpload`, `editableText`, `switch`.

**Why role alone is insufficient:** Disabled group opacity is applied once. A role alone lacks this semantic/composition context.

**Common guard:** Resolve disabled opacity at its existing group owner; do not multiply child alpha or fade only material while leaving an enabled-looking foreground. Preserve the indicated disabled value and suppress misleading interactive effects.

**Amount (historical caps superseded D1/D3/D14):** Hard semantic/accessibility guard; decorative strength pending D3 calibration.

**Pinned evidence for the existing parts:**

- `buttonGroup.root`: [packages/styles/src/components/button-group.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/button-group.css#L3-L17)
- `toggleGroup.root`: [packages/styles/src/components/toggle-group.css:12](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/toggle-group.css#L12-L21)
- `fileUpload.root`: [packages/styles/src/components/file-upload.css:11](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/file-upload.css#L11-L32)
- `editableText.preview`: [packages/styles/src/components/editable-text.css:22](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/editable-text.css#L22-L34)
- `switch.root`: [packages/styles/src/components/switch.css:3](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/switch.css#L3-L40)

<a id="diagnostic-extent"></a>
## Diagnostic geometry and timeline meaning are data

**Families:** `boxModel`, `meter`, `timeline`, `timelineItem`, `fileUploadItem`.

**Why role alone is insufficient:** Diagnostic geometry and timeline meaning are data. A role alone lacks this semantic/composition context.

**Common guard:** Box-model colored regions encode dimensions; meter/upload progress encodes extent; timeline connectors encode sequence. Keep shape, fill extent and labels; materials cannot decorate them into false data.

**Amount (historical caps superseded D1/D3/D14):** Hard semantic/accessibility guard; decorative strength pending D3 calibration.

**Pinned evidence for the existing parts:**

- `boxModel.root`: [packages/styles/src/components/box-model.css:13](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/box-model.css#L13-L28)
- `meter.track`: [packages/styles/src/components/meter.css:35](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/meter.css#L35)
- `timelineItem.connector`: [packages/styles/src/components/timeline.css:52](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/timeline.css#L52-L59)
- `fileUploadItem.progress`: [packages/styles/src/components/file-upload.css:143](https://github.com/ethanwongwork/area/blob/9036ed9293beb7a867bdf637ee768c7a46a9901a/packages/styles/src/components/file-upload.css#L143)

## How the ledger should be used

Do not write sixteen competing style implementations. Preserve the shared style/role cell and attach the applicable context metadata: repeated row, reading/editing plane, literal color, encoded extent, intrinsic media, shared shell, native receiver, required mark, nonpaint host, overlay boundary and divider ownership. A future implementation may encode these differently; this report proposes the responsibilities, not new selectors.

Where prose and current source disagree, follow the pinned current paint/markup and record the discrepancy. Task 04 already identifies TagPicker’s old Badge anatomy versus current Tag children, and the Disclosure-to-Accordion rename. Those historical names must not generate extra material families.
