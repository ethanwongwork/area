# Checkbox — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Toggle an independent binary choice and express partial selection. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L19)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `size`: `sm`, `md`; `isSelected`: `false`, `true`; `isIndeterminate`: `false`, `true`; `isDisabled`: `false`, `true` [Untitled UI 1](https://www.untitledui.com/react/components/checkboxes)

- **shadcn/ui** (component): `state`: `checked`, `unchecked`, `indeterminate`, `invalid`, `disabled` [shadcn/ui 1](https://ui.shadcn.com/docs/components/checkbox.md)

- **Radix Themes** (component): `size`: `1`, `2`, `3`; `variant`: `classic`, `surface`, `soft`; `cardsVariant`: `surface`, `classic`; `highContrast`: `false`, `true`; `state`: `checked`, `unchecked`, `indeterminate`, `disabled` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/checkbox), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/checkbox-group), [Radix Themes 3](https://www.radix-ui.com/themes/docs/components/checkbox-cards)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `classic`, `surface`, `soft`. [API](https://www.radix-ui.com/themes/docs/components/checkbox)

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/checkbox)

- `variant`: `classic`, `surface`, `soft`. [API](https://www.radix-ui.com/themes/docs/components/checkbox-group)

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/checkbox-group)

- `variant`: `surface`, `classic`. [API](https://www.radix-ui.com/themes/docs/components/checkbox-cards)

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/checkbox-cards)

</details>

- **Base UI** (headless): `checked`: `false`, `true`; `indeterminate`: `false`, `true`; `disabled`: `false`, `true`; `readOnly`: `false`, `true` [Base UI 1](https://base-ui.com/react/components/checkbox.md), [Base UI 2](https://base-ui.com/react/components/checkbox-group.md)

<details>

<summary>Base UI: additional/source-part API enum inventory</summary>

- Root / `checked`: `false`, `true`. [API](https://base-ui.com/react/components/checkbox.md)

- Root / `indeterminate`: `false`, `true`. [API](https://base-ui.com/react/components/checkbox.md)

- Root / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/checkbox.md)

- Root / `readOnly`: `false`, `true`. [API](https://base-ui.com/react/components/checkbox.md)

- Root / `required`: `false`, `true`. [API](https://base-ui.com/react/components/checkbox.md)

- CheckboxGroup / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/checkbox-group.md)

</details>

- **React Aria / Spectrum 2** (component): `isSelected`: `false`, `true`; `isIndeterminate`: `false`, `true`; `isDisabled`: `false`, `true`; `isInvalid`: `false`, `true`; `isReadOnly`: `false`, `true`; `validationBehavior`: `native`, `aria` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Checkbox.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/CheckboxGroup.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Checkbox.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/CheckboxGroup.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- CheckboxField / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/Checkbox.md)

- CheckboxField / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/Checkbox.md)

- CheckboxField / `isIndeterminate`: `false`, `true`. [API](https://react-aria.adobe.com/Checkbox.md)

- CheckboxField / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/Checkbox.md)

- CheckboxField / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/Checkbox.md)

- CheckboxField / `isRequired`: `false`, `true`. [API](https://react-aria.adobe.com/Checkbox.md)

- CheckboxField / `isSelected`: `false`, `true`. [API](https://react-aria.adobe.com/Checkbox.md)

- CheckboxGroup / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isEmphasized`: `false`, `true`. [API](https://react-aria.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isRequired`: `false`, `true`. [API](https://react-aria.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `size`: `L`, `M`, `S`, `XL`. [API](https://react-aria.adobe.com/CheckboxGroup.md)

- API / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `isEmphasized`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `isIndeterminate`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `isRequired`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `isSelected`: `false`, `true`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- API / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/Checkbox.md)

- CheckboxGroup / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isEmphasized`: `false`, `true`. [API](https://react-spectrum.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `isRequired`: `false`, `true`. [API](https://react-spectrum.adobe.com/CheckboxGroup.md)

- CheckboxGroup / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/CheckboxGroup.md)

</details>

- **Fluent 2** (component): `checked`: `false`, `true`, `mixed`; `labelPosition`: `before`, `after`; `shape`: `square`, `circular`; `size`: `medium`, `large` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `checked`: `false`, `true`, `mixed`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts)

- `labelPosition`: `before`, `after`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts)

- `shape`: `square`, `circular`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts)

- `size`: `medium`, `large`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts)

</details>

- **Primer** (component): `validationStatus`: `error`, `success`; `disabled`: `false`, `true`; `required`: `false`, `true` [Primer 1](https://primer.style/product/components/checkbox), [Primer 2](https://primer.style/product/components/checkbox-group)

  Checkbox validation status is exposed accessibly without painting a validation variant on the checkbox itself.

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `checked`: `false`, `true`. [API](https://primer.style/product/components/checkbox)

- `disabled`: `false`, `true`. [API](https://primer.style/product/components/checkbox)

- `indeterminate`: `false`, `true`. [API](https://primer.style/product/components/checkbox)

- `validationStatus`: `error`, `success`. [API](https://primer.style/product/components/checkbox)

- `disabled`: `false`, `true`. [API](https://primer.style/product/components/checkbox-group)

- `required`: `false`, `true`. [API](https://primer.style/product/components/checkbox-group)

- `variant Required`: `error`, `success`. [API](https://primer.style/product/components/checkbox-group)

</details>

- **Carbon** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Carbon 1](https://carbondesignsystem.com/components/checkbox/usage)

- **Material 3** (component): `state`: `unchecked`, `checked`, `indeterminate`; `error`: `false`, `true` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Checkbox.md)

- **Mantine** (component): `labelPosition`: `left`, `right`; `state`: `checked`, `unchecked`, `indeterminate`, `disabled`, `error`, `read-only`; `variant`: `filled`, `outline`; `size`: `xs`, `sm`, `md`, `lg`, `xl`; `radius`: `xs`, `sm`, `md`, `lg`, `xl`, `custom-key-or-number` [Mantine 1](https://mantine.dev/llms/core-checkbox.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Checkbox/Checkbox.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `autoContrast`: `false`, `true`. [API](https://mantine.dev/llms/core-checkbox.md)

- Props / `indeterminate`: `false`, `true`. [API](https://mantine.dev/llms/core-checkbox.md)

- Props / `labelPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-checkbox.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-checkbox.md)

- Props / `wrapperProps`: `div`. [API](https://mantine.dev/llms/core-checkbox.md)

- Props / `checked`: `false`, `true`. [API](https://mantine.dev/llms/core-checkbox.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-checkbox.md)

- Props / `withBorder`: `false`, `true`. [API](https://mantine.dev/llms/core-checkbox.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `checked`: `false`, `true`; `indeterminate`: `false`, `true`; `disabled`: `false`, `true` [Ant Design 1](https://ant.design/components/checkbox)

- **Chakra/Ark** (component): `variant`: `outline`, `solid`, `subtle`; `size`: `xs`, `sm`, `md`, `lg`; `cardVariant`: `surface`, `subtle`, `outline`, `solid`; `cardOrientation`: `vertical`, `horizontal`; `cardAlign`: `start`, `end`, `center` [Chakra/Ark 1](https://chakra-ui.com/docs/components/checkbox), [Chakra/Ark 2](https://chakra-ui.com/docs/components/checkbox-card)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `colorPalette`: `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`. [API](https://chakra-ui.com/docs/components/checkbox)

- `size`: `xs`, `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/checkbox)

- `variant`: `outline`, `solid`, `subtle`. [API](https://chakra-ui.com/docs/components/checkbox)

- `disabled`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox)

- `invalid`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox)

- `readOnly`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox)

- `required`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox)

- `colorPalette`: `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `size`: `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `variant`: `surface`, `subtle`, `outline`, `solid`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `align`: `start`, `end`, `center`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `orientation`: `vertical`, `horizontal`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `disabled`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `invalid`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `readOnly`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox-card)

- `required`: `false`, `true`. [API](https://chakra-ui.com/docs/components/checkbox-card)

</details>

- **Atlassian** (component): `isIndeterminate`: `false`, `true`; `isDisabled`: `false`, `true`; `isInvalid`: `false`, `true`; `isRequired`: `false`, `true` [Atlassian 1](https://atlassian.design/components/checkbox/examples)

- **Polaris** (component): `checked`: `false`, `true`; `indeterminate`: `false`, `true`; `labelAccessibilityVisibility`: `visible`, `exclusive`; `required`: `false`, `true`; `disabled`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox.md)

- **GOV.UK** (component): `size`: `default`, `small`; `behavior`: `ordinary`, `exclusive` [GOV.UK 1](https://design-system.service.gov.uk/components/checkboxes)

- **Apple HIG** (guidance): `state`: `off`, `on`, `mixed` [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/toggles.json)

  macOS checkbox guidance is distinct from iOS/iPadOS switch-in-list-row and toggle-button conventions.

## Structural alternatives

- **Untitled UI** (component): control only; label; label and hint; group. [Untitled UI 1](https://www.untitledui.com/react/components/checkboxes)

- **shadcn/ui** (component): description; group; table row. [shadcn/ui 1](https://ui.shadcn.com/docs/components/checkbox.md)

- **Radix Themes** (component): first-line label alignment; checkbox group; checkbox cards; responsive card columns. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/checkbox), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/checkbox-group), [Radix Themes 3](https://www.radix-ui.com/themes/docs/components/checkbox-cards)

- **Base UI** (headless): label; indicator; checkbox group; parent checkbox; nested parent checkbox. [Base UI 1](https://base-ui.com/react/components/checkbox.md), [Base UI 2](https://base-ui.com/react/components/checkbox-group.md)

- **React Aria / Spectrum 2** (component): label; description; error; group; checkbox field; checkbox button. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Checkbox.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/CheckboxGroup.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Checkbox.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/CheckboxGroup.md)

- **Fluent 2** (component): label; indicator. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts)

- **Primer** (component): group; caption; validation message. [Primer 1](https://primer.style/product/components/checkbox), [Primer 2](https://primer.style/product/components/checkbox-group)

- **Carbon** (component): group; nested choices; label; AI label. [Carbon 1](https://carbondesignsystem.com/components/checkbox/usage)

- **Material 3** (component): label; custom icon drawable. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Checkbox.md)

- **Mantine** (component): group; custom icon; indicator-only; row-selection table; description; label link; checkbox card. [Mantine 1](https://mantine.dev/llms/core-checkbox.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Checkbox/Checkbox.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): checkbox group; grid layout. [Ant Design 1](https://ant.design/components/checkbox)

- **Chakra/Ark** (component): label before or after; description; link; custom indicator; group; checkbox card; card addon; card without indicator. [Chakra/Ark 1](https://chakra-ui.com/docs/components/checkbox), [Chakra/Ark 2](https://chakra-ui.com/docs/components/checkbox-card)

- **Atlassian** (component): label. [Atlassian 1](https://atlassian.design/components/checkbox/examples)

- **Polaris** (component): label; details; error. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox.md)

- **GOV.UK** (component): fieldset; legend; hint; per-option hint; error; conditional reveal; divider. [GOV.UK 1](https://design-system.service.gov.uk/components/checkboxes)

- **Apple HIG** (guidance): trailing label; unlabelled editable checklist; hierarchical settings. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/toggles.json)

## Interaction patterns

- **Untitled UI** (component): Space toggles; controlled or uncontrolled selection. [Untitled UI 1](https://www.untitledui.com/react/components/checkboxes)

- **shadcn/ui** (component): checkbox selection. [shadcn/ui 1](https://ui.shadcn.com/docs/components/checkbox.md)

- **Radix Themes** (component): independent multiple selection. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/checkbox), [Radix Themes 2](https://www.radix-ui.com/themes/docs/components/checkbox-group), [Radix Themes 3](https://www.radix-ui.com/themes/docs/components/checkbox-cards)

- **Base UI** (headless): form integration; independent selection. [Base UI 1](https://base-ui.com/react/components/checkbox.md), [Base UI 2](https://base-ui.com/react/components/checkbox-group.md)

- **React Aria / Spectrum 2** (component): form validation; independent multiple selection. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Checkbox.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/CheckboxGroup.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/Checkbox.md), [React Aria / Spectrum 2 4](https://react-spectrum.adobe.com/CheckboxGroup.md)

- **Fluent 2** (component): native checkbox; partial selection. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts)

- **Primer** (component): checked; indeterminate; native input. [Primer 1](https://primer.style/product/components/checkbox), [Primer 2](https://primer.style/product/components/checkbox-group)

- **Carbon** (component): checked; unchecked; indeterminate; disabled; validation. [Carbon 1](https://carbondesignsystem.com/components/checkbox/usage)

- **Material 3** (component): toggle; partial selection; error announcement. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Checkbox.md)

- **Mantine** (component): controlled or uncontrolled; maximum group selections; read-only selection. [Mantine 1](https://mantine.dev/llms/core-checkbox.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Checkbox/Checkbox.tsx), [Mantine 3](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): independent multiple selection. [Ant Design 1](https://ant.design/components/checkbox)

- **Chakra/Ark** (component): controlled/uncontrolled; indeterminate; disabled; read-only; invalid. [Chakra/Ark 1](https://chakra-ui.com/docs/components/checkbox), [Chakra/Ark 2](https://chakra-ui.com/docs/components/checkbox-card)

- **Atlassian** (component): controlled/uncontrolled; toggle. [Atlassian 1](https://atlassian.design/components/checkbox/examples)

- **Polaris** (component): controlled/uncontrolled; native input events. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox.md)

- **GOV.UK** (component): multiple selection; None-of-these exclusivity; show conditional content. [GOV.UK 1](https://design-system.service.gov.uk/components/checkboxes)

- **Apple HIG** (guidance): binary/partial choice. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/toggles.json)

## Area today

Sm/md/lg; neutral/accent; native checked/mixed/disabled/invalid states. Label, caption, visual and choice-card composition; CheckboxGroup horizontal/vertical with fieldset semantics. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L19), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L25), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L86), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L116)

No documented read-only contract, conditional reveal, exclusive None-of-these policy or maximum-selection controller. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L224), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L233), [baseline 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **checkbox manifest:** `variant` = `card`; `size` = `sm`, `md`, `lg`; `tone` = `neutral`, `accent`; runtime states: `checked`, `indeterminate`, `disabled`, `invalid`. [packages/styles/src/manifest.ts:224](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L224)

- **checkboxGroup manifest:** `orientation` = `vertical`, `horizontal`; runtime states: `disabled`, `invalid`, `success`, `warning`. [packages/styles/src/manifest.ts:233](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L233)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Checked/unchecked/mixed states** — layer 2; **12 systems**; Area **yes**; **retain**. Native checkbox semantics exist. Evidence: [Untitled UI](https://www.untitledui.com/react/components/checkboxes), [shadcn/ui](https://ui.shadcn.com/docs/components/checkbox.md), [Radix Themes](https://www.radix-ui.com/themes/docs/components/checkbox), [React Aria / Spectrum 2](https://react-aria.adobe.com/Checkbox.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage), [Base UI](https://base-ui.com/react/components/checkbox.md), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Checkbox.md), [Mantine](https://mantine.dev/llms/core-checkbox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/checkbox), [Ant Design](https://ant.design/components/checkbox), [Atlassian](https://atlassian.design/components/checkbox/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Size ladder** — layer 2; **5 systems**; Area **yes**; **retain**. Area sm/md/lg. Evidence: [Untitled UI](https://www.untitledui.com/react/components/checkboxes), [Radix Themes](https://www.radix-ui.com/themes/docs/components/checkbox), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage), [Mantine](https://mantine.dev/llms/core-checkbox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/checkbox). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Read-only selection** — layer 2; **3 systems**; Area **not-found**; **consider**. Define focus and submission behavior before adding it. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/Checkbox.md), [Mantine](https://mantine.dev/llms/core-checkbox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/checkbox). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Choice-card anatomy** — layer 3; **3 systems**; Area **yes**; **retain**. Existing card composition. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/checkbox), [Mantine](https://mantine.dev/llms/core-checkbox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/checkbox). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Label, description and grouped legend** — layer 3; **6 systems**; Area **yes**; **retain**. Existing CheckboxGroup and Field composition. Evidence: [Untitled UI](https://www.untitledui.com/react/components/checkboxes), [React Aria / Spectrum 2](https://react-aria.adobe.com/Checkbox.md), [Primer](https://primer.style/product/components/checkbox), [Mantine](https://mantine.dev/llms/core-checkbox.md), [Chakra/Ark](https://chakra-ui.com/docs/components/checkbox), [GOV.UK](https://design-system.service.gov.uk/components/checkboxes). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Horizontal and vertical groups** — layer 3; **2 systems**; Area **yes**; **retain**. Existing group orientation. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/checkbox), [React Aria / Spectrum 2](https://react-aria.adobe.com/Checkbox.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Conditional reveal** — layer 3; **1 systems**; Area **not-found**; **add**. Add a recipe with focus-safe dependent content. Evidence: [GOV.UK](https://design-system.service.gov.uk/components/checkboxes). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Exclusive None-of-these choice** — layer 3; **1 systems**; Area **not-found**; **consider**. Collection policy; do not make each Checkbox special. Evidence: [GOV.UK](https://design-system.service.gov.uk/components/checkboxes). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- **Maximum selections** — layer 3; **1 systems**; Area **not-found**; **consider**. Collection controller, not a visual variant. Evidence: [Mantine](https://mantine.dev/llms/core-checkbox.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/checkboxes) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/checkbox.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/checkbox) — read; checked 2026-09-28.

- [component/source](https://www.radix-ui.com/themes/docs/components/checkbox-group) — read; checked 2026-09-28.

- [component/source](https://www.radix-ui.com/themes/docs/components/checkbox-cards) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/checkbox.md) — read; checked 2026-09-28.

- [component/source](https://base-ui.com/react/components/checkbox-group.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/Checkbox.md) — read; checked 2026-09-28.

- [component/source](https://react-aria.adobe.com/CheckboxGroup.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/Checkbox.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/CheckboxGroup.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/checkbox/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-checkbox/library/src/components/Checkbox/Checkbox.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/checkbox) — read; checked 2026-09-28.

- [component/source](https://primer.style/product/components/checkbox-group) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/checkbox/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/checkbox/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Checkbox.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-checkbox.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Checkbox/Checkbox.tsx) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/checkbox) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/checkbox) — read; checked 2026-09-28.

- [component/source](https://chakra-ui.com/docs/components/checkbox-card) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/checkbox/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/checkbox.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — component

- [component/source](https://design-system.service.gov.uk/components/checkboxes) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/toggles.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:224 — checkbox](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L224)

- [packages/styles/src/manifest.ts:233 — checkboxGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L233)

- [docs/specs/checkbox.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L1)

- [docs/specs/checkbox.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L8)

- [docs/specs/checkbox.md:19 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L19)

- [docs/specs/checkbox.md:25 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L25)

- [docs/specs/checkbox.md:86 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L86)

- [docs/specs/checkbox.md:116 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/checkbox.md#L116)
