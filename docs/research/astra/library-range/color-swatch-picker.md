# Color Swatch Picker — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Choose a color from a named preset collection. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L30)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (composition): `palette`: `saved-small`, `saved-medium`, `brand`, `gray`, `full-palette` [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): `size`: `XS`, `S`, `M`, `L`; `rounding`: `default`, `full`, `none`; `density`: `compact`, `regular`, `spacious` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorSwatchPicker.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ColorSwatchPicker.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- ColorSwatchPickerItem / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ColorSwatchPicker.md)

- ColorSwatchPicker / `density`: `compact`, `regular`, `spacious`. [API](https://react-spectrum.adobe.com/ColorSwatchPicker.md)

- ColorSwatchPicker / `size`: `L`, `M`, `S`, `XS`. [API](https://react-spectrum.adobe.com/ColorSwatchPicker.md)

</details>

- **Fluent 2** (component): `focusMode`: `arrow`, `tab`; `layout`: `row`, `grid`; `size`: `extra-small`, `small`, `medium`, `large`; `shape`: `rounded`, `square`, `circular`; `spacing`: `small`, `medium` [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `focusMode`: `arrow`, `tab`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts)

- `size`: `extra-small`, `small`, `medium`, `large`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts)

- `shape`: `rounded`, `square`, `circular`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts)

</details>

- **Mantine** (composition): `withPicker`: `false`, `true`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-color-picker.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `focusable`: `false`, `true`. [API](https://mantine.dev/llms/core-color-picker.md)

- Props / `format`: `hex`, `hexa`, `rgba`, `rgb`, `hsl`, `hsla`. [API](https://mantine.dev/llms/core-color-picker.md)

- Props / `fullWidth`: `false`, `true`. [API](https://mantine.dev/llms/core-color-picker.md)

- Props / `withPicker`: `false`, `true`. [API](https://mantine.dev/llms/core-color-picker.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (composition): `closeOnSelect`: `false`, `true` [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker)

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

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

  Color-well conventions are platform-specific; HIG does not enumerate web color formats or swatch size enums here.

## Structural alternatives

- **Untitled UI** (composition): grid; preview and hex field; save action; opacity slider. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): swatch collection. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorSwatchPicker.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ColorSwatchPicker.md)

- **Fluent 2** (component): swatch grid; swatch row. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts)

- **Mantine** (composition): swatches-only; configurable swatches per row. [Mantine 1](https://mantine.dev/llms/core-color-picker.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): preset groups; collapsible presets. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (composition): swatch grid; saved swatches. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker)

- **Apple HIG** (guidance): color well; system/custom color picker; saved colors. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Interaction patterns

- **Untitled UI** (composition): onSelect; onAdd. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): single color selection; disabled options. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorSwatchPicker.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ColorSwatchPicker.md)

- **Fluent 2** (component): single selection; arrow or tab focus. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts)

- **Mantine** (composition): select color. [Mantine 1](https://mantine.dev/llms/core-color-picker.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): select preset color. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (composition): select preset; save current color. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker)

- **Apple HIG** (guidance): open picker; active well; drag colors between wells. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Area today

Sm/md/lg; row/grid/palette; configurable columns; native radios; disabled options; spatial arrows with RTL, Home/End and native form reset. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L30), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L36), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L83), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L107)

No saved-palette manager, collapsible named groups, multi-selection or consumer-selected roving-versus-tab focus strategy. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L116), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- **colorSwatchPicker manifest:** `size` = `sm`, `md`, `lg`; `layout` = `grid`, `row`, `palette`. [packages/styles/src/manifest.ts:116](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L116)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Row and grid layouts** — layer 3; **1 systems**; Area **yes**; **retain**. Existing layouts and spatial arrows. Evidence: [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- **Named palette groups** — layer 3; **1 systems**; Area **partial**; **add**. Area palette exists; named/collapsible preset groups are not a public grouping API. Evidence: [Ant Design](https://ant.design/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- **Swatch-only presentation** — layer 3; **3 systems**; Area **yes**; **retain**. Existing independent family. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [Mantine](https://mantine.dev/llms/core-color-picker.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- **Shape and spacing choices** — layer 2; **2 systems**; Area **partial**; **consider**. Size and columns exist; independent shape/spacing enums do not. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorSwatchPicker.md), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- **Save current color recipe** — layer 3; **2 systems**; Area **partial**; **consider**. ColorPicker owns save; keep reusable picker read-only over supplied choices by default. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- **Single selection with disabled options** — layer 3; **1 systems**; Area **yes**; **retain**. Existing native radio contract. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorSwatchPicker.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- **Arrow versus tab focus strategy** — layer 3; **1 systems**; Area **partial**; **consider**. Area uses spatial arrows; alternate focus mode needs explicit semantics. Evidence: [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

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

- [component/source](https://react-aria.adobe.com/ColorSwatchPicker.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ColorSwatchPicker.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/SwatchPicker/SwatchPicker.types.ts) — read; checked 2026-09-28.

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

### Mantine — composition

- [component/source](https://mantine.dev/llms/core-color-picker.md) — read; checked 2026-09-28.

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

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:116 — colorSwatchPicker](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L116)

- [docs/specs/color-swatch-picker.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L1)

- [docs/specs/color-swatch-picker.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L8)

- [docs/specs/color-swatch-picker.md:30 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L30)

- [docs/specs/color-swatch-picker.md:36 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L36)

- [docs/specs/color-swatch-picker.md:83 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L83)

- [docs/specs/color-swatch-picker.md:107 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch-picker.md#L107)
