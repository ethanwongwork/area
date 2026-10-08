# Color Field — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Edit and commit a color through textual input. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L29)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (composition): `format`: `hex`, `rgb`, `css`, `hsl`, `hsb` [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): `colorSpace`: `rgb`, `hsl`, `hsb`; `channel`: `ColorChannel alias (full values not found)`; `size`: `S`, `M`, `L`, `XL`; `isDisabled`: `false`, `true`; `isReadOnly`: `false`, `true`; `isInvalid`: `false`, `true`; `isWheelDisabled`: `false`, `true` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorField.md), [React Aria / Spectrum 2 2](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/color/src/index.d.ts), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/ColorField.md)

  ColorField channel is typed ColorChannel. Its complete finite union was not found in the examined page and pinned re-export file; do not assume every ColorSlider channel is accepted identically by ColorField.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- ColorField / `autoFocus`: `false`, `true`. [API](https://react-aria.adobe.com/ColorField.md)

- ColorField / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ColorField.md)

- ColorField / `isInvalid`: `false`, `true`. [API](https://react-aria.adobe.com/ColorField.md)

- ColorField / `isReadOnly`: `false`, `true`. [API](https://react-aria.adobe.com/ColorField.md)

- ColorField / `isRequired`: `false`, `true`. [API](https://react-aria.adobe.com/ColorField.md)

- ColorField / `isWheelDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ColorField.md)

- API / `autoFocus`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorField.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorField.md)

- API / `isInvalid`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorField.md)

- API / `isReadOnly`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorField.md)

- API / `isRequired`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorField.md)

- API / `isWheelDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorField.md)

- API / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/ColorField.md)

</details>

- **Mantine** (component): `format`: `hex`, `hexa`, `rgb`, `rgba`, `hsl`, `hsla`; `disabled`: `false`, `true`; `readOnly`: `false`, `true`; `closeOnColorSwatchClick`: `false`, `true`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-color-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `closeOnColorSwatchClick`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `format`: `hex`, `hexa`, `rgba`, `rgb`, `hsl`, `hsla`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `fullWidth`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `inputWrapperOrder`: `input`, `label`, `description`, `error`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `withAsterisk`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `withEyeDropper`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `withPicker`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `withPreview`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/core-color-input.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (composition): `format`: `hex`, `rgb`, `hsb`; `disabledAlpha`: `false`, `true` [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (composition): `variant`: `outline`, `subtle` [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `openAutoFocus`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

- `colorPalette`: `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`. [API](https://chakra-ui.com/docs/components/color-picker)

- `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. [API](https://chakra-ui.com/docs/components/color-picker)

- `variant`: `outline`, `subtle`. [API](https://chakra-ui.com/docs/components/color-picker)

- `closeOnSelect`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

- `disabled`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

- `invalid`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

- `open`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

- `readOnly`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

- `required`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

- `unmountOnExit`: `false`, `true`. [API](https://chakra-ui.com/docs/components/color-picker)

</details>

- **Polaris** (component): `alpha`: `false`, `true`; `labelAccessibilityVisibility`: `visible`, `exclusive`; `readOnly`: `false`, `true`; `required`: `false`, `true`; `disabled`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md)

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

  Color-well conventions are platform-specific; HIG does not enumerate web color formats or swatch size enums here.

## Structural alternatives

- **Untitled UI** (composition): hex field with preview; format selector; typed channel inputs. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): hex field; individual channel field; label; description; validation. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorField.md), [React Aria / Spectrum 2 2](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/color/src/index.d.ts), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/ColorField.md)

- **Mantine** (component): preview; popover; swatches; eyedropper; left/right sections. [Mantine 1](https://mantine.dev/llms/core-color-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): format selector; channel input; trigger text. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (composition): input-only; swatch with input; trigger inside input; channel input. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker)

- **Polaris** (component): hex input; swatch; picker; details; error. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md)

- **Apple HIG** (guidance): color well; system/custom color picker; saved colors. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Interaction patterns

- **Untitled UI** (composition): shared ColorPicker provider value. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): typed color parsing; keyboard increments; optional wheel changes; form validation. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorField.md), [React Aria / Spectrum 2 2](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/color/src/index.d.ts), [React Aria / Spectrum 2 3](https://react-spectrum.adobe.com/ColorField.md)

- **Mantine** (component): preserve invalid input; disable free input; change-end; hide dropdown. [Mantine 1](https://mantine.dev/llms/core-color-input.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): format change; complete-change callback. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (composition): editable format; change-end; disabled; read-only. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker)

- **Polaris** (component): color entry; validation; input/change. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md)

- **Apple HIG** (guidance): open picker; active well; drag colors between wells. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Area today

Outline/soft; sm/md/lg; optional alpha split; full width. Accepts 3/4/6/8-digit hex and commits canonical 6/8-digit hex. Enter/blur commit, Escape restores, native reset. readOnly is passed to both the hex input and alpha NumberField. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L29), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L36), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L85), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L105), [Area 7](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/react/src/components/ColorField.tsx#L6)

Separate RGB/HSL/HSB channel editing, step/wheel increments and a picker trigger are not ColorField APIs; richer formats exist inside ColorPicker. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L124), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

- **colorField manifest:** `size` = `sm`, `md`, `lg`; boolean modifiers: `full-width`, `alpha`. [packages/styles/src/manifest.ts:124](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L124)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Alpha-enabled hex editing** — layer 2; **2 systems**; Area **yes**; **retain**. Existing canonical hex contract. Evidence: [Mantine](https://mantine.dev/llms/core-color-input.md), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

- **Format or per-channel editing** — layer 3; **5 systems**; Area **partial**; **add**. Available inside ColorPicker; not an independent ColorField contract. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorField.md), [Mantine](https://mantine.dev/llms/core-color-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Ant Design](https://ant.design/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

- **Swatch plus typed input** — layer 3; **4 systems**; Area **yes**; **retain**. Existing field preview anatomy. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [Mantine](https://mantine.dev/llms/core-color-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

- **Picker popover trigger** — layer 3; **3 systems**; Area **not-found**; **add**. Reuse overlay behavior; preserve draft/commit semantics. Evidence: [Mantine](https://mantine.dev/llms/core-color-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

- **Keyboard/channel increments** — layer 3; **1 systems**; Area **not-found**; **consider**. Separate number-channel model from whole-hex editing. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorField.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

- **Read-only and disabled state** — layer 2; **4 systems**; Area **yes**; **consider**. Both hex and alpha inputs receive readOnly/disabled; verified in the React source. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorField.md), [Mantine](https://mantine.dev/llms/core-color-input.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — composition

- [component/source](https://www.untitledui.com/react/components/color-pickers) — read; checked 2026-09-28.

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

- [component/source](https://react-aria.adobe.com/ColorField.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/adobe/react-spectrum/9b566e21140da0aa22946391c08bbfb677f83154/packages/@react-types/color/src/index.d.ts) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ColorField.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-color-input.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — composition

- [component/source](https://ant.design/components/color-picker) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — composition

- [component/source](https://chakra-ui.com/docs/components/color-picker) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-field.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:124 — colorField](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L124)

- [docs/specs/color-field.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L1)

- [docs/specs/color-field.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L8)

- [docs/specs/color-field.md:29 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L29)

- [docs/specs/color-field.md:36 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L36)

- [docs/specs/color-field.md:85 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L85)

- [docs/specs/color-field.md:105 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-field.md#L105)

- [packages/react/src/components/ColorField.tsx:6 — React API and behavior](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/react/src/components/ColorField.tsx#L6)
