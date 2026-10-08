# Input — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Edit a single line of text using a native control. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L22)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `size`: `sm`, `md`; `isInvalid`: `false`, `true`; `isDisabled`: `false`, `true` [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

  FAQ lists sm/md while current upgrade notes say sm/md/lg; size documentation conflicts, so no dimensions inferred.

- **shadcn/ui** (component): `state`: `disabled`, `invalid`, `required` [shadcn/ui 1](https://ui.shadcn.com/docs/components/input.md)

- **Radix Themes** (component): `size`: `1`, `2`, `3`; `variant`: `classic`, `surface`, `soft`; `radius`: `none`, `small`, `medium`, `large`, `full`; `slotSide`: `left`, `right` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/text-field)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `classic`, `surface`, `soft`. [API](https://www.radix-ui.com/themes/docs/components/text-field)

- `radius`: `none`, `small`, `medium`, `large`, `full`. [API](https://www.radix-ui.com/themes/docs/components/text-field)

- `side`: `left`, `right`. [API](https://www.radix-ui.com/themes/docs/components/text-field)

</details>

- **Base UI** (headless): `disabled`: `false`, `true` [Base UI 1](https://base-ui.com/react/components/input.md)

- **React Aria / Spectrum 2** (component): `size`: `S`, `M`, `L`, `XL`; `isDisabled`: `false`, `true`; `isReadOnly`: `false`, `true`; `isInvalid`: `false`, `true`; `isRequired`: `false`, `true` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TextField.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/TextField.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- TextField / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isRequired`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `type`: `email`, `password`, `search`, `tel`, `text`, `url`. [API](https://react-aria.adobe.com/TextField.md)

- API / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isRequired`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `type`: `email`, `password`, `search`, `tel`, `text`, `url`. [API](https://react-spectrum.adobe.com/TextField.md)

</details>

- **Fluent 2** (component): `appearance`: `outline`, `underline`, `filled-darker`, `filled-lighter`, `filled-darker-shadow`, `filled-lighter-shadow`; `size`: `small`, `medium`, `large`; `type`: `text`, `email`, `password`, `search`, `tel`, `url`, `date`, `datetime-local`, `month`, `number`, `time`, `week` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/input/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-input/library/src/components/Input/Input.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `size`: `small`, `medium`, `large`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-input/library/src/components/Input/Input.types.ts)

</details>

- **Primer** (component): `size`: `small`, `medium`, `large`; `monospace`: `false`, `true`; `loading`: `false`, `true`; `loaderPosition`: `auto`, `leading`, `trailing`; `validationStatus`: `error`, `success` [Primer 1](https://primer.style/product/components/text-input)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `contrast`: `false`, `true`. [API](https://primer.style/product/components/text-input)

- `size`: `small`, `medium`, `large`. [API](https://primer.style/product/components/text-input)

- `loading`: `false`, `true`. [API](https://primer.style/product/components/text-input)

- `validationStatus`: `error`, `success`. [API](https://primer.style/product/components/text-input)

- `variant Deprecated`: `small`, `medium`, `large`. [API](https://primer.style/product/components/text-input)

- `variant Deprecated`: `default`, `primary`, `invisible`, `danger`. [API](https://primer.style/product/components/text-input)

</details>

- **Carbon** (component): `variant`: `default`, `fluid` [Carbon 1](https://carbondesignsystem.com/components/text-input/usage)

- **Material 3** (component): `style`: `filled`, `outlined` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (component): `variant`: `default`, `filled`, `unstyled`; `disabled`: `false`, `true`; `readOnly`: `false`, `true`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-text-input.md), [Mantine 2](https://mantine.dev/llms/core-input.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `inputWrapperOrder`: `input`, `label`, `description`, `error`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `withAsterisk`: `false`, `true`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-text-input.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-input.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-input.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-input.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/core-input.md)

- Props / `withAria`: `false`, `true`. [API](https://mantine.dev/llms/core-input.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-input.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-input.md)

- Props / `inputWrapperOrder`: `input`, `label`, `description`, `error`. [API](https://mantine.dev/llms/core-input.md)

- Props / `withAsterisk`: `false`, `true`. [API](https://mantine.dev/llms/core-input.md)

- Props / `wrapperProps`: `div`. [API](https://mantine.dev/llms/core-input.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `variant`: `outlined`, `borderless`, `filled`, `underlined`; `size`: `small`, `medium`, `large`; `status`: `error`, `warning`; `allowClear`: `false`, `true` [Ant Design 1](https://ant.design/components/input)

- **Chakra/Ark** (component): `variant`: `outline`, `subtle`, `flushed`; `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` [Chakra/Ark 1](https://chakra-ui.com/docs/components/input)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. [API](https://chakra-ui.com/docs/components/input)

- `variant`: `outline`, `subtle`, `flushed`. [API](https://chakra-ui.com/docs/components/input)

</details>

- **Atlassian** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Atlassian 1](https://atlassian.design/components/textfield/examples)

- **Polaris** (component): `labelAccessibilityVisibility`: `visible`, `exclusive`; `readOnly`: `false`, `true`; `required`: `false`, `true`; `disabled`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input)

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

  General text-field guidance; no rich chat composer or joined-control component is asserted.

## Structural alternatives

- **Untitled UI** (component): leading icon; leading dropdown; trailing dropdown; prefix; payment input; trailing button; file upload; password; date; number steppers; tag input inside or outside. [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): field; inline action; grid; file; badge; input group; button group. [shadcn/ui 1](https://ui.shadcn.com/docs/components/input.md)

- **Radix Themes** (component): leading or trailing slot; icon; button. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/text-field)

- **Base UI** (headless): native input in field. [Base UI 1](https://base-ui.com/react/components/input.md)

- **React Aria / Spectrum 2** (component): label; description; error; prefix. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TextField.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/TextField.md)

- **Fluent 2** (component): content before; content after. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/input/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-input/library/src/components/Input/Input.types.ts)

- **Primer** (component): leading visual; trailing visual; trailing action. [Primer 1](https://primer.style/product/components/text-input)

- **Carbon** (component): helper; error; password reveal; character/word count; AI label. [Carbon 1](https://carbondesignsystem.com/components/text-input/usage)

- **Material 3** (component): floating label; helper; error; counter; prefix; suffix; start icon; end icon; clear; password toggle. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (component): left/right sections; loader; label; description; error; success; input wrapper; clear action. [Mantine 1](https://mantine.dev/llms/core-text-input.md), [Mantine 2](https://mantine.dev/llms/core-input.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx)

- **Ant Design** (component): prefix; suffix; count; search button; password reveal; compact grouping. [Ant Design 1](https://ant.design/components/input)

- **Chakra/Ark** (component): start/end icon; text; Kbd; select; addon; button; floating label; mask; counter; clear action. [Chakra/Ark 1](https://chakra-ui.com/docs/components/input)

- **Atlassian** (component): input; before/after elements. [Atlassian 1](https://atlassian.design/components/textfield/examples)

- **Polaris** (component): icon; prefix; suffix; accessory; min/max length. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (component): label; hint; error; fixed-character width; fluid width; prefix; suffix; spellcheck control; numeric input mode. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input)

- **Apple HIG** (guidance): text field; label; placeholder. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Interaction patterns

- **Untitled UI** (component): controlled or uncontrolled value; native form name. [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): native input behavior. [shadcn/ui 1](https://ui.shadcn.com/docs/components/input.md)

- **Radix Themes** (component): native text field. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/text-field)

- **Base UI** (headless): Field validation integration. [Base UI 1](https://base-ui.com/react/components/input.md)

- **React Aria / Spectrum 2** (component): controlled/uncontrolled text; form validation. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TextField.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/TextField.md)

- **Fluent 2** (component): native text input; controlled value. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/input/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-input/library/src/components/Input/Input.types.ts)

- **Primer** (component): native input; loading; validation. [Primer 1](https://primer.style/product/components/text-input)

- **Carbon** (component): input; validation; password visibility. [Carbon 1](https://carbondesignsystem.com/components/text-input/usage)

- **Material 3** (component): native entry; validation; clear; password reveal. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (component): native input; section pointer-event policy. [Mantine 1](https://mantine.dev/llms/core-text-input.md), [Mantine 2](https://mantine.dev/llms/core-input.md), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts), [Mantine 4](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx)

- **Ant Design** (component): native text; clear; password visibility; character count. [Ant Design 1](https://ant.design/components/input)

- **Chakra/Ark** (component): disabled; form validation; clear action. [Chakra/Ark 1](https://chakra-ui.com/docs/components/input)

- **Atlassian** (component): disabled; invalid; read-only. [Atlassian 1](https://atlassian.design/components/textfield/examples)

- **Polaris** (component): text entry; input/change. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (component): native entry; autocomplete; validation. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input)

- **Apple HIG** (guidance): entry; focus next/previous. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Area today

Outline/soft; sm/md/lg; full width and monospace; disabled/invalid/success/warning/read-only/loading. Icon/prefix/suffix, loader and tooltip-labelled action slots; native props and ref. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L22), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L30), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L94), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L124)

No dedicated password reveal, counter, masking, clear-policy or floating-label API; consumers can compose some actions. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L143), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **input manifest:** `variant` = `outline`, `soft`; `size` = `sm`, `md`, `lg`; boolean modifiers: `full-width`, `monospace`; runtime states: `disabled`, `invalid`, `success`, `warning`, `read-only`, `loading`. [packages/styles/src/manifest.ts:143](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L143)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Outlined and soft/filled treatments** — layer 2; **4 systems**; Area **yes**; **retain**. Existing two treatments. Evidence: [Mantine](https://mantine.dev/llms/core-text-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Ant Design](https://ant.design/components/input), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Underlined treatment** — layer 2; **3 systems**; Area **not-found**; **consider**. Requires evidence and owner choice, not only source prevalence. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/input/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Ant Design](https://ant.design/components/input). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Native disabled/read-only/validation** — layer 2; **7 systems**; Area **yes**; **retain**. Existing native states and Field associations. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/TextField.md), [Primer](https://primer.style/product/components/text-input), [Mantine](https://mantine.dev/llms/core-text-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Ant Design](https://ant.design/components/input), [Atlassian](https://atlassian.design/components/textfield/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Leading/trailing content and loading** — layer 3; **6 systems**; Area **yes**; **retain**. Existing slot structure. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/input/usage), [Primer](https://primer.style/product/components/text-input), [Mantine](https://mantine.dev/llms/core-text-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Ant Design](https://ant.design/components/input), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Clear action recipe** — layer 3; **4 systems**; Area **partial**; **add**. InputAction exists; formalize visibility, focus and value events. Evidence: [Mantine](https://mantine.dev/llms/core-text-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Ant Design](https://ant.design/components/input), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Password reveal recipe** — layer 3; **3 systems**; Area **partial**; **add**. Native password possible; dedicated toggle behavior not provided. Evidence: [Carbon](https://carbondesignsystem.com/components/text-input/usage), [Ant Design](https://ant.design/components/input), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Character/word counter** — layer 3; **4 systems**; Area **not-found**; **add**. Keep visual count and enforcement separate. Evidence: [Carbon](https://carbondesignsystem.com/components/text-input/usage), [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Ant Design](https://ant.design/components/input), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Floating label anatomy** — layer 3; **2 systems**; Area **not-found**; **consider**. Needs persistent accessible label and empty/focus state rules. Evidence: [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- **Masking and formatted entry** — layer 3; **1 systems**; Area **not-found**; **consider**. Specialized parsing scope; NumberField already owns numeric editing. Evidence: [Chakra/Ark](https://chakra-ui.com/docs/components/input). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/inputs) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/input.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/text-field) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/input.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/TextField.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/TextField.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/input/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-input/library/src/components/Input/Input.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/text-input) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/text-input/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/text-fields/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-text-input.md) — read; checked 2026-09-28.

- [component/source](https://mantine.dev/llms/core-input.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Input/Input.tsx) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/input) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/input) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/textfield/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — component

- [component/source](https://design-system.service.gov.uk/components/text-input) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:143 — input](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L143)

- [docs/specs/input.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L1)

- [docs/specs/input.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L8)

- [docs/specs/input.md:22 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L22)

- [docs/specs/input.md:30 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L30)

- [docs/specs/input.md:94 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L94)

- [docs/specs/input.md:124 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input.md#L124)
