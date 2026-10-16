# Input Group — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Compose separately named controls and affixes within a joined shell. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L21)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): `addonAlign`: `inline-start`, `inline-end`, `block-start`, `block-end`; `buttonSize`: `xs`, `icon-xs`, `sm`, `icon-sm`; `buttonVariant`: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link` [shadcn/ui 1](https://ui.shadcn.com/docs/components/input-group.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- InputGroupAddon / `align`: `inline-start`, `inline-end`, `block-start`, `block-end`. [API](https://ui.shadcn.com/docs/components/input-group.md)

- InputGroupButton / `size`: `xs`, `icon-xs`, `sm`, `icon-sm`. [API](https://ui.shadcn.com/docs/components/input-group.md)

- InputGroupButton / `variant`: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`. [API](https://ui.shadcn.com/docs/components/input-group.md)

</details>

- **Radix Themes** (adjacent): `slotSide`: `left`, `right` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/text-field)

  TextField slots are affixes to one input, not Area multi-control InputGroup.

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `classic`, `surface`, `soft`. [API](https://www.radix-ui.com/themes/docs/components/text-field)

- `radius`: `none`, `small`, `medium`, `large`, `full`. [API](https://www.radix-ui.com/themes/docs/components/text-field)

- `side`: `left`, `right`. [API](https://www.radix-ui.com/themes/docs/components/text-field)

</details>

- **Primer** (adjacent): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Primer 1](https://primer.style/product/components/text-input)

  TextInput adornments do not establish a joined group of independent controls.

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `contrast`: `false`, `true`. [API](https://primer.style/product/components/text-input)

- `size`: `small`, `medium`, `large`. [API](https://primer.style/product/components/text-input)

- `loading`: `false`, `true`. [API](https://primer.style/product/components/text-input)

- `validationStatus`: `error`, `success`. [API](https://primer.style/product/components/text-input)

- `variant Deprecated`: `small`, `medium`, `large`. [API](https://primer.style/product/components/text-input)

- `variant Deprecated`: `default`, `primary`, `invisible`, `danger`. [API](https://primer.style/product/components/text-input)

</details>

- **Material 3** (adjacent): `style`: `filled`, `outlined` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

  TextInputLayout does not establish Area-style joined independent controls.

- **Mantine** (adjacent): `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

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

- **Ant Design** (composition): `direction`: `horizontal`, `vertical`; `size`: `small`, `medium`, `large`; `block`: `false`, `true` [Ant Design 1](https://ant.design/components/space)

- **Chakra/Ark** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Chakra/Ark 1](https://chakra-ui.com/docs/components/input)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. [API](https://chakra-ui.com/docs/components/input)

- `variant`: `outline`, `subtle`, `flushed`. [API](https://chakra-ui.com/docs/components/input)

</details>

- **Polaris** (adjacent): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

  Inspected TextField does not provide a joined independent-control group.

- **GOV.UK** (adjacent): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input)

  Joined independent-control group not found in inspected TextInput.

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

  General text-field guidance; no rich chat composer or joined-control component is asserted.

## Structural alternatives

- **Untitled UI** (composition): leading dropdown; trailing dropdown; text prefix and suffix; action button. [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): icon; text; button; Kbd; dropdown; spinner; textarea; custom control. [shadcn/ui 1](https://ui.shadcn.com/docs/components/input-group.md)

- **Radix Themes** (adjacent): text-field slots. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/text-field)

- **Primer** (adjacent): leading visual; trailing visual; trailing action. [Primer 1](https://primer.style/product/components/text-input)

- **Material 3** (adjacent): prefix; suffix; start icon; end icon. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (adjacent): left/right sections; input wrapper. [Mantine 1](https://mantine.dev/llms/core-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): Space.Compact; paired inputs; select and input; button and input. [Ant Design 1](https://ant.design/components/space)

- **Chakra/Ark** (composition): start/end element; start/end addon; select; button. [Chakra/Ark 1](https://chakra-ui.com/docs/components/input)

- **Polaris** (adjacent): prefix; suffix; accessory. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (adjacent): prefix; suffix. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input)

- **Apple HIG** (guidance): text field; label; placeholder. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Interaction patterns

- **Untitled UI** (composition): each composed control retains its form behavior. [Untitled UI 1](https://www.untitledui.com/react/components/inputs)

- **shadcn/ui** (component): composed controls retain focus behavior. [shadcn/ui 1](https://ui.shadcn.com/docs/components/input-group.md)

- **Radix Themes** (adjacent): No multiple independently edited fields demonstrated. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/text-field)

- **Primer** (adjacent): single-input adornments. [Primer 1](https://primer.style/product/components/text-input)

- **Material 3** (adjacent): single-input enhancement. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md)

- **Mantine** (adjacent): Single-input adornment;  independent multi-control shell not found. [Mantine 1](https://mantine.dev/llms/core-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): each control stays independently focusable. [Ant Design 1](https://ant.design/components/space)

- **Chakra/Ark** (composition): single-input enhancement; multi-control layouts are composition. [Chakra/Ark 1](https://chakra-ui.com/docs/components/input)

- **Polaris** (adjacent): single-input adornments. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md)

- **GOV.UK** (adjacent): single-input adornments. [GOV.UK 1](https://design-system.service.gov.uk/components/text-input)

- **Apple HIG** (guidance): entry; focus next/previous. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json)

## Area today

Outline/soft; sm/md/lg; full width; text/icon affixes, mode select, paired controls and action. Each editable value retains its name and tab stop. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L21), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L29), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L88), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L111)

No vertical orientation or block-start/block-end addon anatomy. Single-input adornments in other systems are only an adjacent comparison. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L163), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

- **inputGroup manifest:** `variant` = `outline`, `soft`; `size` = `sm`, `md`, `lg`; boolean modifiers: `full-width`. [packages/styles/src/manifest.ts:163](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L163)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Joined independent controls** — layer 3; **2 systems**; Area **yes**; **retain**. Existing labelled controls and individual tab stops. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/input-group.md), [Ant Design](https://ant.design/components/space). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

- **Text/icon affixes and actions** — layer 3; **4 systems**; Area **yes**; **retain**. Existing anatomy. Evidence: [Untitled UI](https://www.untitledui.com/react/components/inputs), [shadcn/ui](https://ui.shadcn.com/docs/components/input-group.md), [Chakra/Ark](https://chakra-ui.com/docs/components/input), [Ant Design](https://ant.design/components/space). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

- **Vertical grouping** — layer 2; **1 systems**; Area **not-found**; **consider**. Separate orientation from each control size. Evidence: [Ant Design](https://ant.design/components/space). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

- **Block-start/block-end addons** — layer 3; **1 systems**; Area **not-found**; **add**. Enables stacked contextual content without embedding it in the value. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/input-group.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

- **Textarea/custom-control shell** — layer 3; **1 systems**; Area **partial**; **consider**. Current documented recipes focus on input/number/mode controls. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/input-group.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

- **Shared size/treatment propagation** — layer 2; **1 systems**; Area **yes**; **retain**. Existing group-level shell values. Evidence: [Ant Design](https://ant.design/components/space). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — composition

- [component/source](https://www.untitledui.com/react/components/inputs) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/input-group.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — adjacent

- [component/source](https://www.radix-ui.com/themes/docs/components/text-field) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — adjacent

- [component/source](https://primer.style/product/components/text-input) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — adjacent

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/text-fields/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/TextField.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — adjacent

- [component/source](https://mantine.dev/llms/core-input.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — composition

- [component/source](https://ant.design/components/space) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — composition

- [component/source](https://chakra-ui.com/docs/components/input) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — adjacent

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-field.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — adjacent

- [component/source](https://design-system.service.gov.uk/components/text-input) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-fields.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:163 — inputGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L163)

- [docs/specs/input-group.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L1)

- [docs/specs/input-group.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L8)

- [docs/specs/input-group.md:21 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L21)

- [docs/specs/input-group.md:29 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L29)

- [docs/specs/input-group.md:88 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L88)

- [docs/specs/input-group.md:111 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/input-group.md#L111)
