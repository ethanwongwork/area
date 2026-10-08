# Color Picker — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Adjust a solid color with visual and numeric tools. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L28)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `format`: `hex`, `rgb`, `css`, `hsl`, `hsb`; `gradientType`: `linear`, `radial`, `angular`, `diamond` [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers), [Untitled UI 2](https://www.untitledui.com/react/components/gradient-pickers)

  GradientPicker is a separate compound component with public FAQ behavior. Minimum stop count is documented in that source; no hidden code was accessed.

- **React Aria / Spectrum 2** (composition): `colorSpace`: `rgb`, `hsl`, `hsb`; `orientation`: `horizontal`, `vertical`; `isDisabled`: `false`, `true` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorPicker.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/ColorArea.md), [React Aria / Spectrum 2 3](https://react-aria.adobe.com/ColorSlider.md), [React Aria / Spectrum 2 4](https://react-aria.adobe.com/ColorWheel.md), [React Aria / Spectrum 2 5](https://react-spectrum.adobe.com/ColorArea.md), [React Aria / Spectrum 2 6](https://react-spectrum.adobe.com/ColorSlider.md), [React Aria / Spectrum 2 7](https://react-spectrum.adobe.com/ColorWheel.md)

  React Aria ColorPicker coordinates primitives. Spectrum 2 documents the primitives separately; no S2 ColorPicker page found.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- ColorArea / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ColorArea.md)

- ColorSlider / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ColorSlider.md)

- ColorWheel / `isDisabled`: `false`, `true`. [API](https://react-aria.adobe.com/ColorWheel.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorArea.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorSlider.md)

- API / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ColorWheel.md)

</details>

- **Fluent 2** (component): `shape`: `rounded`, `square`; `vertical`: `false`, `true` [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorPicker/ColorPicker.types.ts), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorArea/ColorArea.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorSlider/ColorSlider.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `shape`: `rounded`, `square`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorPicker/ColorPicker.types.ts)

</details>

- **Mantine** (component): `format`: `hex`, `hexa`, `rgb`, `rgba`, `hsl`, `hsla`; `withPicker`: `false`, `true`; `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-color-picker.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

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

- **Ant Design** (component): `mode`: `single`, `gradient`; `format`: `hex`, `rgb`, `hsb`; `size`: `small`, `medium`, `large`; `trigger`: `click`, `hover`; `disabledAlpha`: `false`, `true`; `allowClear`: `false`, `true` [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (component): `variant`: `outline`, `subtle`; `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`; `closeOnSelect`: `false`, `true` [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker), [Chakra/Ark 2](https://ark-ui.com/llms.txt/components/color-picker)

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

- Context / `open`: `false`, `true`. [API](https://ark-ui.com/llms.txt/components/color-picker)

</details>

- **Polaris** (component): `alpha`: `false`, `true` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-picker.md)

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

  Color-well conventions are platform-specific; HIG does not enumerate web color formats or swatch size enums here.

## Structural alternatives

- **Untitled UI** (component): area and tracks; minimal picker; hue slider; alpha slider; palette grid; saved colors; add saved color; format selector; eyedropper; separate gradient picker; stop list; type selector; reverse action; angle handles. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers), [Untitled UI 2](https://www.untitledui.com/react/components/gradient-pickers)

- **React Aria / Spectrum 2** (composition): area; hue wheel; channel sliders; channel fields; swatches; popover composition. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorPicker.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/ColorArea.md), [React Aria / Spectrum 2 3](https://react-aria.adobe.com/ColorSlider.md), [React Aria / Spectrum 2 4](https://react-aria.adobe.com/ColorWheel.md), [React Aria / Spectrum 2 5](https://react-spectrum.adobe.com/ColorArea.md), [React Aria / Spectrum 2 6](https://react-spectrum.adobe.com/ColorSlider.md), [React Aria / Spectrum 2 7](https://react-spectrum.adobe.com/ColorWheel.md)

- **Fluent 2** (component): HSV area; channel slider. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorPicker/ColorPicker.types.ts), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorArea/ColorArea.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorSlider/ColorSlider.types.ts)

- **Mantine** (component): area; hue and alpha tracks; swatches; swatches-only. [Mantine 1](https://mantine.dev/llms/core-color-picker.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): popup; presets; custom trigger; custom panel; gradient editor; format fields; trigger text. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (component): area; channel sliders; channel inputs; eyedropper; inline; popover; save swatch; swatch-only; trigger-only. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker), [Chakra/Ark 2](https://ark-ui.com/llms.txt/components/color-picker)

- **Polaris** (component): color area; sliders. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-picker.md)

- **Apple HIG** (guidance): color well; system/custom color picker; saved colors. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Interaction patterns

- **Untitled UI** (component): controlled or uncontrolled color; eyedropper hidden when unsupported; add stops; Delete/Backspace removes stop; drag angle; export gradient CSS. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers), [Untitled UI 2](https://www.untitledui.com/react/components/gradient-pickers)

- **React Aria / Spectrum 2** (composition): pointer and keyboard color adjustment; controlled color; change-end callback. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorPicker.md), [React Aria / Spectrum 2 2](https://react-aria.adobe.com/ColorArea.md), [React Aria / Spectrum 2 3](https://react-aria.adobe.com/ColorSlider.md), [React Aria / Spectrum 2 4](https://react-aria.adobe.com/ColorWheel.md), [React Aria / Spectrum 2 5](https://react-spectrum.adobe.com/ColorArea.md), [React Aria / Spectrum 2 6](https://react-spectrum.adobe.com/ColorSlider.md), [React Aria / Spectrum 2 7](https://react-spectrum.adobe.com/ColorWheel.md)

- **Fluent 2** (component): controlled color; pointer or keyboard channel change. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorPicker/ColorPicker.types.ts), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorArea/ColorArea.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorSlider/ColorSlider.types.ts)

- **Mantine** (component): controlled or uncontrolled; onChangeEnd. [Mantine 1](https://mantine.dev/llms/core-color-picker.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): drag channels; change/complete callbacks; clear; format lock. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (component): controlled value; change-end; disabled; read-only; swatch selection. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-picker), [Chakra/Ark 2](https://ark-ui.com/llms.txt/components/color-picker)

- **Polaris** (component): input/change; form reset. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-picker.md)

- **Apple HIG** (guidance): open picker; active well; drag colors between wells. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Area today

Spectrum/grid/sliders views; hue/opacity and color area; hex/rgb/css/hsl/hsb/oklch; header, saved swatches, save action, eyedropper, contrast check and before/after preview. Keyboard color-area and range controls. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L9), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L28), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L36), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L124), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L139), [Area 7](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L169)

No gradient stops, hue wheel, media paints, library binding or built-in popover trigger. Later spec sections establish contrast and OKLCH despite older scope prose. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L94), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

**Owner boundary:** Keep gradient and paint editing separate from solid-color scope until owner chooses it. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L9)

- **colorPicker manifest:** no design-time variant enum. [packages/styles/src/manifest.ts:94](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L94)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Solid color editing** — layer 2; **7 systems**; Area **yes**; **retain**. Existing scope. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorPicker.md), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorPicker/ColorPicker.types.ts), [Mantine](https://mantine.dev/llms/core-color-picker.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Ant Design](https://ant.design/components/color-picker), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-picker.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Gradient stops** — layer 3; **2 systems**; Area **owner-decision**; **owner**. A distinct editor scope requiring stop selection and keyboard manipulation. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [Ant Design](https://ant.design/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Color area and channel sliders** — layer 3; **6 systems**; Area **yes**; **retain**. Existing spectrum and sliders views. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorPicker.md), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorPicker/ColorPicker.types.ts), [Mantine](https://mantine.dev/llms/core-color-picker.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-picker.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Hue wheel** — layer 3; **1 systems**; Area **not-found**; **consider**. Alternative anatomy, not a replacement for the area. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorPicker.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Saved swatches and palettes** — layer 3; **4 systems**; Area **yes**; **retain**. Existing saved values and Area palette. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [Mantine](https://mantine.dev/llms/core-color-picker.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Ant Design](https://ant.design/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Inline and popover presentations** — layer 3; **4 systems**; Area **partial**; **add**. Inline exists; overlay trigger is absent. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorPicker.md), [Mantine](https://mantine.dev/llms/core-color-picker.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker), [Ant Design](https://ant.design/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Multiple text formats** — layer 2; **4 systems**; Area **yes**; **retain**. Area additionally supports OKLCH. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorPicker.md), [Mantine](https://mantine.dev/llms/core-color-picker.md), [Ant Design](https://ant.design/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Eyedropper action** — layer 3; **2 systems**; Area **yes**; **retain**. Keep feature detection and accessible fallback. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [Chakra/Ark](https://chakra-ui.com/docs/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- **Contrast and before/after preview** — layer 3; **0 systems**; Area **yes**; **retain**. Existing Area range; verified peer count is zero in this scan, not a uniqueness claim. Evidence: [Area basis 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L94); no verified equivalent counted in this scan. [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/color-pickers) — read; checked 2026-09-28.

- [component/source](https://www.untitledui.com/react/components/gradient-pickers) — read; checked 2026-09-28.

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

### React Aria / Spectrum 2 — composition

- [component/source](https://react-aria.adobe.com/ColorPicker.md) — read; checked 2026-09-28.

- [component/source](https://react-aria.adobe.com/ColorArea.md) — read; checked 2026-09-28.

- [component/source](https://react-aria.adobe.com/ColorSlider.md) — read; checked 2026-09-28.

- [component/source](https://react-aria.adobe.com/ColorWheel.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ColorArea.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ColorSlider.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ColorWheel.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorPicker/ColorPicker.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorArea/ColorArea.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-color-picker/library/src/components/ColorSlider/ColorSlider.types.ts) — read; checked 2026-09-28.

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

- [component/source](https://mantine.dev/llms/core-color-picker.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/color-picker) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/color-picker) — read; checked 2026-09-28.

- [component/source](https://ark-ui.com/llms.txt/components/color-picker) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/color-picker.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:94 — colorPicker](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L94)

- [docs/specs/color-picker.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L1)

- [docs/specs/color-picker.md:9 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L9)

- [docs/specs/color-picker.md:28 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L28)

- [docs/specs/color-picker.md:36 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L36)

- [docs/specs/color-picker.md:124 — Second pass: views, OKLCH, contrast, preview](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L124)

- [docs/specs/color-picker.md:139 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L139)

- [docs/specs/color-picker.md:169 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-picker.md#L169)
