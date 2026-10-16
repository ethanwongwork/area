# Field — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Associate a control with its label, guidance and validation. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L18)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (composition): `required`: `false`, `true`; `isInvalid`: `false`, `true`; `isDisabled`: `false`, `true` [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): `orientation`: `vertical`, `horizontal`, `responsive`; `legendVariant`: `legend`, `label`; `invalid`: `false`, `true` [shadcn/ui 1](https://ui.shadcn.com/docs/components/field.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- FieldLegend / `variant`: `legend`, `label`. [API](https://ui.shadcn.com/docs/components/field.md)

- Field / `orientation`: `vertical`, `horizontal`, `responsive`. [API](https://ui.shadcn.com/docs/components/field.md)

</details>

- **Base UI** (headless): `validationMode`: `onSubmit`, `onBlur`, `onChange`; `disabled`: `false`, `true`; `invalid`: `false`, `true`; `dirty`: `false`, `true`; `touched`: `false`, `true` [Base UI 1](https://base-ui.com/react/components/field.md), [Base UI 2](https://base-ui.com/react/components/fieldset.md)

<details>

<summary>Base UI: additional/source-part API enum inventory</summary>

- Root / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/field.md)

- Root / `invalid`: `false`, `true`. [API](https://base-ui.com/react/components/field.md)

- Item / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/field.md)

</details>

- **React Aria / Spectrum 2** (component): `labelPosition`: `top`, `side`; `labelAlign`: `start`, `end`; `necessityIndicator`: `icon`, `label`; `validationBehavior`: `native`, `aria`; `isRequired`: `false`, `true`; `isDisabled`: `false`, `true`; `isInvalid`: `false`, `true` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TextField.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/Form.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/TextField.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- TextField / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `isRequired`: `false`, `true`. [API](https://react-aria.adobe.com/TextField.md)

- TextField / `type`: `email`, `password`, `search`, `tel`, `text`, `url`. [API](https://react-aria.adobe.com/TextField.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/Form.md)

- API / `isEmphasized`: `false`, `true`. [API](https://react-spectrum.adobe.com/Form.md)

- API / `isRequired`: `false`, `true`. [API](https://react-spectrum.adobe.com/Form.md)

- API / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/Form.md)

- API / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `isRequired`: `false`, `true`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/TextField.md)

- API / `type`: `email`, `password`, `search`, `tel`, `text`, `url`. [API](https://react-spectrum.adobe.com/TextField.md)

</details>

- **Fluent 2** (component): `orientation`: `vertical`, `horizontal`; `validationState`: `error`, `warning`, `success`, `none`; `size`: `small`, `medium`, `large`; `required`: `false`, `true` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/field/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `orientation`: `vertical`, `horizontal`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts)

- `validationState`: `error`, `warning`, `success`, `none`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts)

- `required`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts)

- `size`: `small`, `medium`, `large`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts)

</details>

- **Primer** (component): `required`: `false`, `true`; `disabled`: `false`, `true` [Primer 1](https://primer.style/product/components/form-control)

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `disabled`: `false`, `true`. [API](https://primer.style/product/components/form-control)

- `required`: `false`, `true`. [API](https://primer.style/product/components/form-control)

- `requiredIndicator`: `false`, `true`. [API](https://primer.style/product/components/form-control)

- `variant Required`: `error`, `success`. [API](https://primer.style/product/components/form-control)

</details>

- **Carbon** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Carbon 1](https://carbondesignsystem.com/components/text-input/usage)

- **Material 3** (composition): `style`: `filled`, `outlined` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (composition): `withAsterisk`: `false`, `true`; `withErrorStyles`: `false`, `true`; `withSuccessStyles`: `false`, `true`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

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

- **Ant Design** (composition): `layout`: `horizontal`, `vertical`, `inline`; `labelAlign`: `left`, `right`; `labelWrap`: `false`, `true`; `size`: `small`, `medium`, `large`; `requiredMark`: `required`, `optional`, `hidden`; `validateStatus`: `success`, `warning`, `error`, `validating` [Ant Design 1](https://ant.design/components/form)

- **Chakra/Ark** (component): `disabled`: `false`, `true`; `readOnly`: `false`, `true` [Chakra/Ark 1](https://chakra-ui.com/docs/components/field)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `disabled`: `false`, `true`. [API](https://chakra-ui.com/docs/components/field)

- `invalid`: `false`, `true`. [API](https://chakra-ui.com/docs/components/field)

- `readOnly`: `false`, `true`. [API](https://chakra-ui.com/docs/components/field)

- `required`: `false`, `true`. [API](https://chakra-ui.com/docs/components/field)

</details>

- **Atlassian** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Atlassian 1](https://atlassian.design/components/form/examples)

- **Polaris** (composition): `labelAccessibilityVisibility`: `visible`, `exclusive`; `readOnly`: `false`, `true`; `required`: `false`, `true`; `disabled`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input), [GOV.UK 2](https://design-system.service.gov.uk/components/fieldset), [GOV.UK 3](https://design-system.service.gov.uk/components/error-message)

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

  General text-field guidance; no rich chat composer or joined-control component is asserted.

## Structural alternatives

- **Untitled UI** (composition): label; hint; error message. [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): fieldset; group; description; content; separator; error list; choice card. [shadcn/ui 1](https://ui.shadcn.com/docs/components/field.md)

- **Base UI** (headless): label; control; description; error; validity; fieldset. [Base UI 1](https://base-ui.com/react/components/field.md), [Base UI 2](https://base-ui.com/react/components/fieldset.md)

- **React Aria / Spectrum 2** (component): label; description; error; form alignment. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TextField.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/Form.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/TextField.md)

- **Fluent 2** (component): label; hint; validation icon; validation message; info button. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/field/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts)

- **Primer** (component): label; caption; validation; leading visual; custom required text/indicator. [Primer 1](https://primer.style/product/components/form-control)

- **Carbon** (composition): label; helper; error; character/word count. [Carbon 1](https://carbondesignsystem.com/components/text-input/usage)

- **Material 3** (composition): floating label; helper; error; counter. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (composition): Input.Wrapper; label; description; error; custom wrapper order. [Mantine 1](https://mantine.dev/llms/core-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): label; tooltip; extra; help; feedback icon; dynamic fields; error list. [Ant Design 1](https://ant.design/components/form)

- **Chakra/Ark** (component): helper text; error text; error icon; horizontal label; required/optional marker; target control. [Chakra/Ark 1](https://chakra-ui.com/docs/components/field)

- **Atlassian** (component): fields; fieldset; counter; conditional fields; helper; error. [Atlassian 1](https://atlassian.design/components/form/examples)

- **Polaris** (composition): label; details; error. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (composition): label; hint; error; fieldset; legend; visually hidden label. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input), [GOV.UK 2](https://design-system.service.gov.uk/components/fieldset), [GOV.UK 3](https://design-system.service.gov.uk/components/error-message)

- **Apple HIG** (guidance): text field; label; placeholder. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Interaction patterns

- **Untitled UI** (composition): React Aria form association. [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): label associations; validation errors. [shadcn/ui 1](https://ui.shadcn.com/docs/components/field.md)

- **Base UI** (headless): native form integration; validation timing. [Base UI 1](https://base-ui.com/react/components/field.md), [Base UI 2](https://base-ui.com/react/components/fieldset.md)

- **React Aria / Spectrum 2** (component): native and ARIA validation; server errors; focus management. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/TextField.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/Form.md), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/TextField.md)

- **Fluent 2** (component): label/control association; disabled control leaves guidance readable. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/field/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts)

- **Primer** (component): control association; validation. [Primer 1](https://primer.style/product/components/form-control)

- **Carbon** (composition): control association; validation. [Carbon 1](https://carbondesignsystem.com/components/text-input/usage)

- **Material 3** (composition): input association; validation. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (composition): label and description association. [Mantine 1](https://mantine.dev/llms/core-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): validation triggers; async validation; dependencies; scroll to error. [Ant Design 1](https://ant.design/components/form)

- **Chakra/Ark** (component): label association; invalid state. [Chakra/Ark 1](https://chakra-ui.com/docs/components/field)

- **Atlassian** (component): validation; async validation; submission. [Atlassian 1](https://atlassian.design/components/form/examples)

- **Polaris** (composition): control association. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (composition): label/control association; error reporting. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input), [GOV.UK 2](https://design-system.service.gov.uk/components/fieldset), [GOV.UK 3](https://design-system.service.gov.uk/components/error-message)

- **Apple HIG** (guidance): entry; focus next/previous. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Area today

Vertical/horizontal, inline, descriptions, error/success/warning messages, required marker, hidden label and disabled state. Automatic wiring targets one direct control. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L9), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L18), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L26), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L82), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L105)

No responsive orientation axis, collection error aggregation, async validation engine or schema/form controller. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L133), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

- **field manifest:** `orientation` = `vertical`, `horizontal`; boolean modifiers: `inline`; runtime states: `disabled`. [packages/styles/src/manifest.ts:133](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L133)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Vertical/horizontal orientation** — layer 2; **4 systems**; Area **yes**; **retain**. Existing orientation. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/field.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/field/usage), [React Aria / Spectrum 2](https://react-aria.adobe.com/TextField.md), [Ant Design](https://ant.design/components/form). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

- **Responsive label layout** — layer 3; **1 systems**; Area **not-found**; **add**. Switch by available width without changing control identity. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

- **Required/optional and hidden label** — layer 2; **3 systems**; Area **yes**; **retain**. Existing marker and hidden label; clarify optional text recipe. Evidence: [Primer](https://primer.style/product/components/form-control), [Chakra/Ark](https://chakra-ui.com/docs/components/field), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

- **Label, help and validation message** — layer 3; **11 systems**; Area **yes**; **retain**. Existing associations. Evidence: [Untitled UI](https://www.untitledui.com/react/components/inputs), [shadcn/ui](https://ui.shadcn.com/docs/components/field.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/TextField.md), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/field/usage), [Primer](https://primer.style/product/components/form-control), [Mantine](https://mantine.dev/llms/core-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/field), [Ant Design](https://ant.design/components/form), [Atlassian](https://atlassian.design/components/form/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md), [GOV.UK](https://design-system.service.gov.uk/components/text-input). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

- **Error collection/summary** — layer 3; **2 systems**; Area **partial**; **consider**. Current field targets one control; group-level aggregation belongs to a form recipe. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/field.md), [Ant Design](https://ant.design/components/form). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

- **Async validation state** — layer 2; **2 systems**; Area **not-found**; **consider**. Keep visual validating state separate from application validation engine. Evidence: [Ant Design](https://ant.design/components/form), [Atlassian](https://atlassian.design/components/form/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — composition

- [component/source](https://www.untitledui.com/react/components/inputs) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/field.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/field.md) — read; checked 2026-09-28.

- [component/source](https://base-ui.com/react/components/fieldset.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-aria.adobe.com/TextField.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/Form.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/TextField.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/field/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-field/library/src/components/Field/Field.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/form-control) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — composition

- [component/source](https://carbondesignsystem.com/components/text-input/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — composition

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/text-fields/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — composition

- [component/source](https://mantine.dev/llms/core-input.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — composition

- [component/source](https://ant.design/components/form) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/field) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/form/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — composition

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — composition

- [component/source](https://design-system.service.gov.uk/components/text-input) — read; checked 2026-09-28.

- [component/source](https://design-system.service.gov.uk/components/fieldset) — read; checked 2026-09-28.

- [component/source](https://design-system.service.gov.uk/components/error-message) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:133 — field](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L133)

- [docs/specs/field.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L1)

- [docs/specs/field.md:9 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L9)

- [docs/specs/field.md:18 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L18)

- [docs/specs/field.md:26 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L26)

- [docs/specs/field.md:82 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L82)

- [docs/specs/field.md:105 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/field.md#L105)
