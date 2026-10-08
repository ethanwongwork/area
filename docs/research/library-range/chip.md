# Chip — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Represent a compact filter, input token, suggestion or action. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L21)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `size`: `sm`, `md`, `lg`; `selectionMode`: `single`, `multiple`; `isDisabled`: `false`, `true` [Untitled UI 1](https://www.untitledui.com/react/components/tags)

- **React Aria / Spectrum 2** (component): `selectionMode`: `none`, `single`, `multiple`; `selectionBehavior`: `toggle`, `replace`; `size`: `S`, `M`, `L`; `isEmphasized`: `false`, `true`; `isInvalid`: `false`, `true`; `escapeKeyBehavior`: `clearSelection`, `none` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TagGroup.md), [React Aria / Spectrum 2 2](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/shared/src/selection.d.ts), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/TagGroup.md)

  SelectionBehavior values are resolved from the pinned shared React Aria type source.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- TagGroup / `disallowEmptySelection`: `false`, `true`. [API](https://react-aria.adobe.com/TagGroup.md)

- TagGroup / `selectedKeys`: `all`. [API](https://react-aria.adobe.com/TagGroup.md)

- TagGroup / `shouldSelectOnPressUp`: `false`, `true`. [API](https://react-aria.adobe.com/TagGroup.md)

- Tag / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/TagGroup.md)

- `disallowEmptySelection`: `false`, `true`. [API](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/shared/src/selection.d.ts)

- `selectedKeys`: `all`. [API](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/shared/src/selection.d.ts)

- `selectionStyle`: `checkbox`, `highlight`. [API](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/shared/src/selection.d.ts)

- TagGroup / `disallowEmptySelection`: `false`, `true`. [API](https://react-spectrum.adobe.com/TagGroup.md)

- TagGroup / `isEmphasized`: `false`, `true`. [API](https://react-spectrum.adobe.com/TagGroup.md)

- TagGroup / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/TagGroup.md)

- TagGroup / `selectedKeys`: `all`. [API](https://react-spectrum.adobe.com/TagGroup.md)

- TagGroup / `shouldSelectOnPressUp`: `false`, `true`. [API](https://react-spectrum.adobe.com/TagGroup.md)

- TagGroup / `size`: `L`, `M`, `S`. [API](https://react-spectrum.adobe.com/TagGroup.md)

- Tag / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/TagGroup.md)

</details>

- **Fluent 2** (component): `disabled`: `false`, `true`; `dismissible`: `false`, `true`; `selected`: `false`, `true` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/tag/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/InteractionTag/InteractionTag.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/TagGroup/TagGroup.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `dismissIcon`: `span`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts)

- `disabled`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts)

- `dismissible`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts)

- `selected`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts)

- `disabled`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/InteractionTag/InteractionTag.types.ts)

- `selected`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/InteractionTag/InteractionTag.types.ts)

- `disabled`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/TagGroup/TagGroup.types.ts)

- `dismissible`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/TagGroup/TagGroup.types.ts)

</details>

- **Primer** (component): `size`: `small`, `medium`, `large`, `xlarge`; `as`: `button`, `a`, `span`; `hideRemoveButton`: `false`, `true`; `isSelected`: `false`, `true` [Primer 1](https://primer.style/product/components/token)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `hideRemoveButton`: `false`, `true`. [API](https://primer.style/product/components/token)

- `isSelected`: `false`, `true`. [API](https://primer.style/product/components/token)

- `size`: `small`, `medium`, `large`, `xlarge`. [API](https://primer.style/product/components/token)

</details>

- **Carbon** (component): `kind`: `read-only`, `dismissible`, `selectable`, `operational`; `size`: `small`, `medium`, `large`; `state`: `enabled`, `hover`, `focus`, `selected`, `disabled`, `skeleton` [Carbon 1](https://carbondesignsystem.com/components/tag/usage)

- **Material 3** (component): `kind`: `assist`, `filter`, `input`, `suggestion`; `checkable`: `false`, `true` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Chip.md)

- **Mantine** (component): `selection`: `single`, `multiple`; `state`: `checked`, `unchecked`, `disabled`; `variant`: `outline`, `filled`, `light`; `size`: `xs`, `sm`, `md`, `lg`, `xl`; `radius`: `xs`, `sm`, `md`, `lg`, `xl`, `custom-key-or-number` [Mantine 1](https://mantine.dev/llms/core-chip.md), [Mantine 2](https://mantine.dev/llms/core-pill.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Chip/Chip.tsx), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `autoContrast`: `false`, `true`. [API](https://mantine.dev/llms/core-chip.md)

- Props / `checked`: `false`, `true`. [API](https://mantine.dev/llms/core-chip.md)

- Props / `type`: `checkbox`, `radio`. [API](https://mantine.dev/llms/core-chip.md)

- Props / `wrapperProps`: `div`. [API](https://mantine.dev/llms/core-chip.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `withRemoveButton`: `false`, `true`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `inputWrapperOrder`: `input`, `label`, `description`, `error`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `withAsterisk`: `false`, `true`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-pill.md)

- Props / `type`: `hidden`, `auto`, `visible`. [API](https://mantine.dev/llms/core-pill.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `variant`: `filled`, `solid`, `outlined`; `disabled`: `false`, `true`; `multiple`: `false`, `true` [Ant Design 1](https://ant.design/components/tag)

- **Chakra/Ark** (component): `variant`: `subtle`, `solid`, `outline`, `surface`; `size`: `sm`, `md`, `lg`, `xl` [Chakra/Ark 1](https://chakra-ui.com/docs/components/tag)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `size`: `sm`, `md`, `lg`, `xl`. [API](https://chakra-ui.com/docs/components/tag)

- `variant`: `subtle`, `solid`, `outline`, `surface`. [API](https://chakra-ui.com/docs/components/tag)

</details>

- **Atlassian** (component): `groupAlignment`: `start`, `end` [Atlassian 1](https://atlassian.design/components/tag/examples), [Atlassian 2](https://atlassian.design/components/tag-group/examples)

- **Polaris** (component): `color`: `subdued`, `base`, `strong`; `removable`: `false`, `true`; `disabled`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip.md), [Polaris 2](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip.md)

  Passive Chip and ClickableChip are separate components; interactive props apply to ClickableChip.

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/token-fields.json)

  macOS Token fields supply interaction conventions, not a web Chip API.

## Structural alternatives

- **Untitled UI** (component): remove action; count; checkbox; avatar; dot; selectable and removable. [Untitled UI 1](https://www.untitledui.com/react/components/tags)

- **React Aria / Spectrum 2** (component): icon; avatar; image; link; empty state; group actions; remove action. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TagGroup.md), [React Aria / Spectrum 2 2](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/shared/src/selection.d.ts), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/TagGroup.md)

- **Fluent 2** (component): media; icon; primary text; secondary text; dismiss icon; InteractionTag separate actions; TagGroup. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/tag/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/InteractionTag/InteractionTag.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/TagGroup/TagGroup.types.ts)

- **Primer** (component): leading visual; remove button; truncation; custom-color issue label. [Primer 1](https://primer.style/product/components/token)

- **Carbon** (component): icon; label; dismiss; AI label. [Carbon 1](https://carbondesignsystem.com/components/tag/usage)

- **Material 3** (component): leading icon; thumbnail; checked icon; close icon; chip group. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Chip.md)

- **Mantine** (component): Chip.Group; custom checked icon; Pill; Pill.Group; remove button. [Mantine 1](https://mantine.dev/llms/core-chip.md), [Mantine 2](https://mantine.dev/llms/core-pill.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Chip/Chip.tsx), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): close icon; checkable tag; checkable group; icon. [Ant Design 1](https://ant.design/components/tag)

- **Chakra/Ark** (component): icon; avatar; close trigger; overflow; render as button. [Chakra/Ark 1](https://chakra-ui.com/docs/components/tag)

- **Atlassian** (component): link; nonremovable tag; icon; trailing metric; swatch; max-width truncation; group. [Atlassian 1](https://atlassian.design/components/tag/examples), [Atlassian 2](https://atlassian.design/components/tag-group/examples)

- **Polaris** (component): passive chip; clickable chip; graphic; link; remove. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip.md), [Polaris 2](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip.md)

- **Apple HIG** (guidance): token field; suggestions; token contextual menu. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/token-fields.json)

## Interaction patterns

- **Untitled UI** (component): selection; onRemove group callback; onClose item callback; keyboard navigation. [Untitled UI 1](https://www.untitledui.com/react/components/tags)

- **React Aria / Spectrum 2** (component): keyboard collection navigation; selection; removal; item actions. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TagGroup.md), [React Aria / Spectrum 2 2](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/shared/src/selection.d.ts), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/TagGroup.md)

- **Fluent 2** (component): selection; dismissal callback; group state. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/tag/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/InteractionTag/InteractionTag.types.ts), [Fluent 2 4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/TagGroup/TagGroup.types.ts)

- **Primer** (component): dismiss via button or Backspace/Delete; selection. [Primer 1](https://primer.style/product/components/token)

- **Carbon** (component): remove; toggle; open additional content. [Carbon 1](https://carbondesignsystem.com/components/tag/usage)

- **Material 3** (component): action; selection; remove. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Chip.md)

- **Mantine** (component): native radio or checkbox choice; optional deselect; removal via Pill. [Mantine 1](https://mantine.dev/llms/core-chip.md), [Mantine 2](https://mantine.dev/llms/core-pill.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Chip/Chip.tsx), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): remove; single/multiple controlled checkable group. [Ant Design 1](https://ant.design/components/tag)

- **Chakra/Ark** (component): dismiss; button composition. [Chakra/Ark 1](https://chakra-ui.com/docs/components/tag)

- **Atlassian** (component): remove; focus after removal. [Atlassian 1](https://atlassian.design/components/tag/examples), [Atlassian 2](https://atlassian.design/components/tag-group/examples)

- **Polaris** (component): click; remove; show/hide/toggle target. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip.md), [Polaris 2](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip.md)

- **Apple HIG** (guidance): tokenize; select; drag/reorder; move between fields. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/token-fields.json)

## Area today

Filter/assist/input/suggestion; sm/md/lg; neutral/accent; pill, swatch-only, icon/avatar/image, link, selection and removal. aria-pressed for toggle buttons; removal is a separate action. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L7), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L21), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L27), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L100), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L130)

No documented collection arrow navigation, Backspace/Delete token removal or drag reorder. Consumer composition supplies collection behavior. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L291), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L301), [baseline 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **chip manifest:** `kind` = `assist`, `filter`, `input`, `suggestion`; `size` = `sm`, `md`, `lg`; `tone` = `neutral`, `accent`; boolean modifiers: `pill`, `swatch-only`, `link`, `link-icon`; runtime states: `selected`, `disabled`, `invalid`. [packages/styles/src/manifest.ts:291](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L291)

- **chipGroup manifest:** no design-time variant enum. [packages/styles/src/manifest.ts:301](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L301)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Assist/filter/input/suggestion jobs** — layer 2; **1 systems**; Area **yes**; **retain**. Existing variant vocabulary matches these jobs. Evidence: [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Chip.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **Small/medium/large sizes** — layer 2; **4 systems**; Area **yes**; **retain**. Existing scale. Evidence: [Untitled UI](https://www.untitledui.com/react/components/tags), [React Aria / Spectrum 2](https://react-aria.adobe.com/TagGroup.md), [Primer](https://primer.style/product/components/token), [Chakra/Ark](https://chakra-ui.com/docs/components/tag). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **Icon/avatar/swatch content** — layer 3; **5 systems**; Area **yes**; **retain**. Existing slots. Evidence: [Untitled UI](https://www.untitledui.com/react/components/tags), [React Aria / Spectrum 2](https://react-aria.adobe.com/TagGroup.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/tag/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/tag), [Atlassian](https://atlassian.design/components/tag/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **Separate selection and removal** — layer 3; **3 systems**; Area **yes**; **retain**. Preserve separate primary and dismiss actions. Evidence: [Untitled UI](https://www.untitledui.com/react/components/tags), [React Aria / Spectrum 2](https://react-aria.adobe.com/TagGroup.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/tag/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **Keyboard collection navigation** — layer 3; **2 systems**; Area **not-found**; **add**. Arrow movement, focus after removal and selection require a group contract. Evidence: [Untitled UI](https://www.untitledui.com/react/components/tags), [React Aria / Spectrum 2](https://react-aria.adobe.com/TagGroup.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **Backspace/Delete token removal** — layer 3; **1 systems**; Area **not-found**; **add**. Current button removal does not establish token-field keyboard behavior. Evidence: [Primer](https://primer.style/product/components/token). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **Single/multiple selection group** — layer 3; **4 systems**; Area **partial**; **consider**. Individual selected chips exist; formalize group state separately. Evidence: [Untitled UI](https://www.untitledui.com/react/components/tags), [React Aria / Spectrum 2](https://react-aria.adobe.com/TagGroup.md), [Mantine](https://mantine.dev/llms/core-chip.md), [Ant Design](https://ant.design/components/tag). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- **Reorder or move tokens** — layer 3; **0 systems**; Area **not-found**; **consider**. Apple platform guidance only; no shipped web-system evidence counted here. Evidence: [Apple HIG [excluded: guidance]](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/token-fields.json). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/tags) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/TagGroup.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/shared/src/selection.d.ts) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/TagGroup.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/tag/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/Tag/Tag.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/InteractionTag/InteractionTag.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tags/library/src/components/TagGroup/TagGroup.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/token) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/tag/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/chips/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Chip.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-chip.md) — read; checked 2026-09-28.

- [component/source](https://mantine.dev/llms/core-pill.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Chip/Chip.tsx) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/tag) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/tag) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/tag/examples) — read; checked 2026-09-28.

- [component/source](https://atlassian.design/components/tag-group/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/chip.md) — read; checked 2026-09-28.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/actions/clickable-chip.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/token-fields.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:291 — chip](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L291)

- [packages/styles/src/manifest.ts:301 — chipGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L301)

- [docs/specs/chip.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L1)

- [docs/specs/chip.md:7 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L7)

- [docs/specs/chip.md:21 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L21)

- [docs/specs/chip.md:27 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L27)

- [docs/specs/chip.md:100 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L100)

- [docs/specs/chip.md:130 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/chip.md#L130)
