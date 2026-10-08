# Combobox — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Filter choices while keeping editable input and selection coordinated. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L13)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `size`: `sm`, `md`, `lg`; `selection`: `single`, `multiple`; `isDisabled`: `false`, `true`; `showSearch`: `false`, `true`; `showFooter`: `false`, `true` [Untitled UI 1](https://www.untitledui.com/react/components/select), [Untitled UI 2](https://www.untitledui.com/react/components/multi-select)

  MultiSelect is a separate documented picker with optional popup search, not necessarily an editable multi-value ComboBox.

- **shadcn/ui** (component): `selection`: `single`, `multiple`; `state`: `disabled`, `invalid`; `autoHighlight`: `false`, `true` [shadcn/ui 1](https://ui.shadcn.com/docs/components/combobox.md)

- **Base UI** (headless): `multiple`: `false`, `true`; `autoHighlight`: `false`, `true`; `highlightItemOnHover`: `false`, `true`; `loopFocus`: `false`, `true`; `modal`: `false`, `true`; `openOnInputClick`: `false`, `true`; `disabled`: `false`, `true`; `readOnly`: `false`, `true` [Base UI 1](https://base-ui.com/react/components/combobox.md)

<details>

<summary>Base UI: additional/source-part API enum inventory</summary>

- Root / `open`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Root / `loopFocus`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Root / `modal`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Root / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Root / `readOnly`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Root / `required`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Trigger / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Input / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Clear / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Positioner / `disableAnchorTracking`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

- Item / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/combobox.md)

</details>

- **React Aria / Spectrum 2** (component): `selection`: `single`, `multiple`; `allowsCustomValue`: `false`, `true`; `allowsEmptyCollection`: `false`, `true`; `menuTrigger`: `input`, `focus`, `manual`; `formValue`: `key`, `text`; `isDisabled`: `false`, `true`; `isReadOnly`: `false`, `true`; `isInvalid`: `false`, `true`; `align`: `start`, `end`; `direction`: `top`, `bottom` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ComboBox.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ComboBox.md)

  React Aria multiple selection and S2 single-choice ComboBox are recorded separately by source; do not infer parity.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- ComboBox / `allowsCustomValue`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `allowsEmptyCollection`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `isRequired`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `shouldFocusWrap`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBoxValue / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBoxValue / `suppressContentEditableWarning`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBoxValue / `suppressHydrationWarning`: `false`, `true`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBoxValue / `unselectable`: `off`, `on`. [API](https://react-aria.adobe.com/ComboBox.md)

- ComboBox / `align`: `end`, `start`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `allowsCustomValue`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `isRequired`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `shouldFocusWrap`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBox / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/ComboBox.md)

- ComboBoxItem / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ComboBox.md)

</details>

- **Fluent 2** (component): `freeform`: `false`, `true`; `showClearIcon`: `false`, `true`; `multiselect`: `false`, `true`; `inlinePopup`: `false`, `true` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/components/Combobox/Combobox.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `clearIcon`: `span`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/components/Combobox/Combobox.types.ts)

</details>

- **Primer** (composition): `selectionVariant`: `single`, `multiple`; `loading`: `false`, `true` [Primer 1](https://primer.style/product/components/autocomplete), [Primer 2](https://primer.style/product/components/text-input-with-tokens), [Primer 3](https://primer.style/product/components/select-panel)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `openOnFocus Deprecated`: `false`, `true`. [API](https://primer.style/product/components/autocomplete)

- `loading`: `false`, `true`. [API](https://primer.style/product/components/autocomplete)

- `selectionVariant`: `single`, `multiple`. [API](https://primer.style/product/components/autocomplete)

- `preventTokenWrapping`: `false`, `true`. [API](https://primer.style/product/components/text-input-with-tokens)

- `size`: `small`, `medium`, `large`, `xlarge`. [API](https://primer.style/product/components/text-input-with-tokens)

- `hideTokenRemoveButtons`: `false`, `true`. [API](https://primer.style/product/components/text-input-with-tokens)

- `validationStatus`: `error`, `success`. [API](https://primer.style/product/components/text-input-with-tokens)

- `open Required`: `false`, `true`. [API](https://primer.style/product/components/select-panel)

- `variant`: `anchored`, `modal`. [API](https://primer.style/product/components/select-panel)

- `showSelectedOptionsFirst`: `false`, `true`. [API](https://primer.style/product/components/select-panel)

- `showSelectAll`: `false`, `true`. [API](https://primer.style/product/components/select-panel)

- `disableFullscreenOnNarrow`: `false`, `true`. [API](https://primer.style/product/components/select-panel)

- `loading`: `false`, `true`. [API](https://primer.style/product/components/select-panel)

- `align`: `start`, `end`, `center`. [API](https://primer.style/product/components/select-panel)

- `focusOutBehavior`: `start`, `wrap`. [API](https://primer.style/product/components/select-panel)

</details>

- **Carbon** (component): `kind`: `default-dropdown`, `multiselect`, `combobox`; `layout`: `default`, `inline` [Carbon 1](https://carbondesignsystem.com/components/dropdown/usage)

- **Material 3** (component): `style`: `filled`, `outlined`; `editable`: `false`, `true` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Menu.md)

  MaterialAutoCompleteTextView within TextInputLayout. Android source pattern; no assertion of web keyboard or multi-value parity.

- **Mantine** (component): `selection`: `single`, `multiple`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-combobox.md), [Mantine 2](https://mantine.dev/llms/core-autocomplete.md), [Mantine 3](https://mantine.dev/llms/core-multi-select.md), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

  Combobox is the composition primitive; MultiSelect and Autocomplete are distinct higher-level recipes.

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `hideDetached`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `readOnly`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `resetSelectionOnOptionHover`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `returnFocus`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withArrow`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withOverlay`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withinPortal`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withAriaAttributes`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withExpandedAttribute`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withKeyboardNavigation`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `selected`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withAria`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `allowDeselect`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `checkIconPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `selectFirstOptionOnDropdownOpen`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withAlignedLabels`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withCheckIcon`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `withScrollArea`: `false`, `true`. [API](https://mantine.dev/llms/core-combobox.md)

- Props / `autoSelectOnBlur`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `clearable`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `inputWrapperOrder`: `input`, `label`, `description`, `error`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `openOnFocus`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `selectFirstOptionOnChange`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `selectFirstOptionOnDropdownOpen`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `withAsterisk`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `withScrollArea`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-autocomplete.md)

- Props / `checkIconPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `clearSearchOnChange`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `clearable`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `hidePickedOptions`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `inputWrapperOrder`: `input`, `label`, `description`, `error`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `openOnFocus`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `selectFirstOptionOnChange`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `selectFirstOptionOnDropdownOpen`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `withAlignedLabels`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `withAsterisk`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `withCheckIcon`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `withPillsReorder`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `withScrollArea`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-multi-select.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `variant`: `outlined`, `borderless`, `filled`, `underlined`; `size`: `small`, `medium`, `large`; `mode`: `multiple`, `tags`; `status`: `error`, `warning`; `allowClear`: `false`, `true` [Ant Design 1](https://ant.design/components/auto-complete), [Ant Design 2](https://ant.design/components/select)

  AutoComplete permits input text; Select multiple/tags is a separate collection recipe.

- **Chakra/Ark** (component): `variant`: `outline`, `subtle`, `flushed`; `size`: `xs`, `sm`, `md`, `lg`; `loopFocus`: `false`, `true`; `allowCustomValue`: `false`, `true`; `openOnClick`: `false`, `true`; `openOnKeyPress`: `false`, `true`; `closeOnSelect`: `false`, `true` [Chakra/Ark 1](https://chakra-ui.com/docs/components/combobox), [Chakra/Ark 2](https://ark-ui.com/llms.txt/components/combobox)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `loopFocus`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `openOnKeyPress`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `selectionBehavior`: `clear`, `replace`, `preserve`. [API](https://chakra-ui.com/docs/components/combobox)

- `colorPalette`: `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`. [API](https://chakra-ui.com/docs/components/combobox)

- `variant`: `outline`, `subtle`, `flushed`. [API](https://chakra-ui.com/docs/components/combobox)

- `size`: `xs`, `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/combobox)

- `allowCustomValue`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `alwaysSubmitOnEnter`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `autoFocus`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `closeOnSelect`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `disabled`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `disableLayer`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `invalid`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `open`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `readOnly`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `required`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `unmountOnExit`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- `persistFocus`: `false`, `true`. [API](https://chakra-ui.com/docs/components/combobox)

- Context / `focused`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/combobox)

- Context / `open`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/combobox)

- Context / `hasSelectedItems`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/combobox)

- Context / `disabled`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/combobox)

</details>

- **Atlassian** (component): `appearance`: `default`, `subtle`; `isMulti`: `false`, `true`; `isClearable`: `false`, `true` [Atlassian 1](https://atlassian.design/components/select/examples)

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/combo-boxes.json)

  macOS/AppKit convention; HIG explicitly does not support this control on iOS/iPadOS/tvOS/visionOS/watchOS. A typed custom value does not automatically become a stored choice.

## Structural alternatives

- **Untitled UI** (component): leading icon; avatar; dot; tags; selected count; supporting text; empty title and description; select-all and reset footer. [Untitled UI 1](https://www.untitledui.com/react/components/select), [Untitled UI 2](https://www.untitledui.com/react/components/multi-select)

- **shadcn/ui** (component): chips; groups; custom item; clear action; popup-only trigger; input group. [shadcn/ui 1](https://ui.shadcn.com/docs/components/combobox.md)

- **Base UI** (headless): input inside popup; groups; async results; creatable option; virtualized list; chips; clear; empty; status; custom item; popup arrow. [Base UI 1](https://base-ui.com/react/components/combobox.md)

- **React Aria / Spectrum 2** (component): groups; descriptions; avatars; icons; prefix; tags; empty state; async results; links; virtualization. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ComboBox.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ComboBox.md)

- **Fluent 2** (component): input; expand icon; clear icon; checkbox list; selected tags. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/components/Combobox/Combobox.types.ts)

- **Primer** (composition): autocomplete; selected tokens; create option; SelectPanel anchored/modal/fullscreen; groups; footer actions. [Primer 1](https://primer.style/product/components/autocomplete), [Primer 2](https://primer.style/product/components/text-input-with-tokens), [Primer 3](https://primer.style/product/components/select-panel)

- **Carbon** (component): filtering input; custom value; select all; clear all; AI label. [Carbon 1](https://carbondesignsystem.com/components/dropdown/usage)

- **Material 3** (component): exposed dropdown; floating label; trailing disclosure icon. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Menu.md)

- **Mantine** (component): select; autocomplete; MultiSelect; PillsInput; groups; empty state; custom items; async examples; virtualized recipe. [Mantine 1](https://mantine.dev/llms/core-combobox.md), [Mantine 2](https://mantine.dev/llms/core-autocomplete.md), [Mantine 3](https://mantine.dev/llms/core-multi-select.md), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): AutoComplete; Select with search; groups; prefix; custom options; custom popup; selected tags; responsive max tags. [Ant Design 1](https://ant.design/components/auto-complete), [Ant Design 2](https://ant.design/components/select)

- **Chakra/Ark** (component): multiple values; async; match highlighting; custom items; input group; virtualization; links; creatable option. [Chakra/Ark 1](https://chakra-ui.com/docs/components/combobox), [Chakra/Ark 2](https://ark-ui.com/llms.txt/components/combobox)

- **Atlassian** (component): async; groups; custom clear/dropdown/loading indicators. [Atlassian 1](https://atlassian.design/components/select/examples)

- **Apple HIG** (guidance): editable field with suggested list. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/combo-boxes.json)

## Interaction patterns

- **Untitled UI** (component): search via Select.ComboBox; controlled or uncontrolled keys; keyboard navigation. [Untitled UI 1](https://www.untitledui.com/react/components/select), [Untitled UI 2](https://www.untitledui.com/react/components/multi-select)

- **shadcn/ui** (component): filter; select; clear; automatic highlight. [shadcn/ui 1](https://ui.shadcn.com/docs/components/combobox.md)

- **Base UI** (headless): filter; select; retain query after selection; async single or multiple selection; keyboard loop includes input. [Base UI 1](https://base-ui.com/react/components/combobox.md)

- **React Aria / Spectrum 2** (component): filter; custom text; controlled input separate from selection; async loading; form validation. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ComboBox.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ComboBox.md)

- **Fluent 2** (component): free-form entry; filtering; Space selects only in navigation context; VoiceOver inline popup. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/components/Combobox/Combobox.types.ts)

- **Primer** (composition): filter; async loading; apply on close or confirm action. [Primer 1](https://primer.style/product/components/autocomplete), [Primer 2](https://primer.style/product/components/text-input-with-tokens), [Primer 3](https://primer.style/product/components/select-panel)

- **Carbon** (component): filter; single/multiple selection; custom value. [Carbon 1](https://carbondesignsystem.com/components/dropdown/usage)

- **Material 3** (component): editable text or noneditable choice; set default selection. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Menu.md)

- **Mantine** (component): filter; keyboard highlight; clear; limit selections; hide selected options. [Mantine 1](https://mantine.dev/llms/core-combobox.md), [Mantine 2](https://mantine.dev/llms/core-autocomplete.md), [Mantine 3](https://mantine.dev/llms/core-multi-select.md), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): free text autocomplete; tokenization; async search recipes; virtualization; hide selected; clear. [Ant Design 1](https://ant.design/components/auto-complete), [Ant Design 2](https://ant.design/components/select)

- **Chakra/Ark** (component): custom filter; minimum query length; rehydrate selected value; disabled option; controlled open; keyboard navigation. [Chakra/Ark 1](https://chakra-ui.com/docs/components/combobox), [Chakra/Ark 2](https://ark-ui.com/llms.txt/components/combobox)

- **Atlassian** (component): single/multiple selection; clear; async options. [Atlassian 1](https://atlassian.design/components/select/examples)

- **Apple HIG** (guidance): typing; select suggestion. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/combo-boxes.json)

## Area today

Outline/soft and sm/md/lg Input shell; pick/custom/create modes; groups, descriptions, icons, disabled options and empty state. active-descendant keyboard model; wrapping arrows; Alt+Down; Enter; Tab commits highlight; Escape closes then clears. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L13), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L20), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L42), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L57)

No documented multi-value tokens, async loading/error contract, virtualization or selection-count limit. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L493), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **combobox manifest:** no design-time variant enum; boolean modifiers: `full-width`; runtime states: `open`. [packages/styles/src/manifest.ts:493](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L493)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Single editable choice** — layer 3; **11 systems**; Area **yes**; **retain**. Existing core behavior. Evidence: [Untitled UI](https://www.untitledui.com/react/components/select), [shadcn/ui](https://ui.shadcn.com/docs/components/combobox.md), [Base UI](https://base-ui.com/react/components/combobox.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/ComboBox.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), [Primer](https://primer.style/product/components/autocomplete), [Mantine](https://mantine.dev/llms/core-combobox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete), [Atlassian](https://atlassian.design/components/select/examples), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Menu.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **Custom value / create option** — layer 3; **6 systems**; Area **yes**; **retain**. Existing custom/create modes. Evidence: [Base UI](https://base-ui.com/react/components/combobox.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/ComboBox.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), [Primer](https://primer.style/product/components/autocomplete), [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **Multiple values with tokens** — layer 3; **9 systems**; Area **not-found**; **add**. Requires collection keyboard behavior and separate input/selection state. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/combobox.md), [Base UI](https://base-ui.com/react/components/combobox.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/ComboBox.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/combobox/usage), [Primer](https://primer.style/product/components/autocomplete), [Mantine](https://mantine.dev/llms/core-combobox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete), [Atlassian](https://atlassian.design/components/select/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **Async results and loading** — layer 3; **6 systems**; Area **not-found**; **add**. Add a documented async contract; separately design error/empty/cancellation behavior and prevent stale result activation. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ComboBox.md), [Primer](https://primer.style/product/components/autocomplete), [Mantine](https://mantine.dev/llms/core-combobox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete), [Atlassian](https://atlassian.design/components/select/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **Virtualized results** — layer 3; **4 systems**; Area **not-found**; **consider**. Add only with active-descendant and offscreen-option tests. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ComboBox.md), [Mantine](https://mantine.dev/llms/core-combobox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **Group headings and rich options** — layer 3; **8 systems**; Area **yes**; **retain**. Existing groups, icons and descriptions. Evidence: [Untitled UI](https://www.untitledui.com/react/components/select), [shadcn/ui](https://ui.shadcn.com/docs/components/combobox.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/ComboBox.md), [Primer](https://primer.style/product/components/autocomplete), [Mantine](https://mantine.dev/llms/core-combobox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete), [Atlassian](https://atlassian.design/components/select/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **Clear and selection limits** — layer 3; **3 systems**; Area **partial**; **consider**. Escape clearing exists; explicit clear action/limits are separate policies. Evidence: [Mantine](https://mantine.dev/llms/core-combobox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- **Filled/outlined/underlined treatments** — layer 2; **2 systems**; Area **partial**; **consider**. Area outline/soft; do not import all paint styles before an owner choice. Evidence: [Chakra/Ark](https://chakra-ui.com/docs/components/combobox), [Ant Design](https://ant.design/components/auto-complete). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/select) — read; checked 2026-09-28.

- [component/source](https://www.untitledui.com/react/components/multi-select) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/combobox.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/combobox.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/ComboBox.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ComboBox.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/combobox/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-combobox/library/src/components/Combobox/Combobox.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — composition

- [component/source](https://primer.style/product/components/autocomplete) — read; checked 2026-09-28.

- [component/source](https://primer.style/product/components/text-input-with-tokens) — read; checked 2026-09-28.

- [component/source](https://primer.style/product/components/select-panel) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/dropdown/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Menu.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-combobox.md) — read; checked 2026-09-28.

- [component/source](https://mantine.dev/llms/core-autocomplete.md) — read; checked 2026-09-28.

- [component/source](https://mantine.dev/llms/core-multi-select.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/auto-complete) — read; checked 2026-09-28.

- [component/source](https://ant.design/components/select) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/combobox) — read; checked 2026-09-28.

- [component/source](https://ark-ui.com/llms.txt/components/combobox) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/select/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/combo-boxes.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:493 — combobox](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L493)

- [docs/specs/combobox.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L1)

- [docs/specs/combobox.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L8)

- [docs/specs/combobox.md:13 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L13)

- [docs/specs/combobox.md:20 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L20)

- [docs/specs/combobox.md:42 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L42)

- [docs/specs/combobox.md:57 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/combobox.md#L57)
