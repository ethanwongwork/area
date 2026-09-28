# Color Swatch — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Provide a passive visual and accessible preview of a color. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L19)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): `size`: `XS`, `S`, `M`, `L`; `rounding`: `default`, `full`, `none` [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorSwatch.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ColorSwatch.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- API / `size`: `L`, `M`, `S`, `XS`. [API](https://react-spectrum.adobe.com/ColorSwatch.md)

</details>

- **Fluent 2** (adjacent): `disabled`: `false`, `true` [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/ColorSwatch.types.ts)

  Fluent ColorSwatch is interactive; Area ColorSwatch is passive.

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `disabledIcon`: `span`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/ColorSwatch.types.ts)

- `disabled`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/ColorSwatch.types.ts)

</details>

- **Mantine** (component): `withShadow`: `false`, `true` [Mantine 1](https://mantine.dev/llms/core-color-swatch.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `size`: `width`. [API](https://mantine.dev/llms/core-color-swatch.md)

- Props / `withShadow`: `false`, `true`. [API](https://mantine.dev/llms/core-color-swatch.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (adjacent): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Ant Design 1](https://ant.design/components/color-picker)

  Trigger preview is interactive; not a standalone passive swatch API.

- **Chakra/Ark** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-swatch)

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

  Color-well conventions are platform-specific; HIG does not enumerate web color formats or swatch size enums here.

## Structural alternatives

- **Untitled UI** (composition): preview swatch; transparency checker. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): solid color; alpha checker; custom size. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorSwatch.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ColorSwatch.md)

- **Fluent 2** (adjacent): selected icon; disabled icon. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/ColorSwatch.types.ts)

- **Mantine** (component): color preview; custom children. [Mantine 1](https://mantine.dev/llms/core-color-swatch.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (adjacent): color trigger; clear-color affordance. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (component): alpha preview; mixed colors; badge composition; palette. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-swatch)

- **Apple HIG** (guidance): color well; system/custom color picker; saved colors. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Interaction patterns

- **Untitled UI** (composition): passive color preview. [Untitled UI 1](https://www.untitledui.com/react/components/color-pickers)

- **React Aria / Spectrum 2** (component): accessible color description. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/ColorSwatch.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ColorSwatch.md)

- **Fluent 2** (adjacent): selectable button. [Fluent 2 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/ColorSwatch.types.ts)

- **Mantine** (component): passive color preview. [Mantine 1](https://mantine.dev/llms/core-color-swatch.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (adjacent): opens color editor. [Ant Design 1](https://ant.design/components/color-picker)

- **Chakra/Ark** (component): display-only color preview. [Chakra/Ark 1](https://chakra-ui.com/docs/components/color-swatch)

- **Apple HIG** (guidance): open picker; active well; drag colors between wells. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/color-wells.json)

## Area today

Sm/md/lg; solid/transparent color with checkerboard; accessible image role and name. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L19), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L25), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L65), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L79)

No independent shape axis, gradient/mixed preview or interactive selection API. Selection belongs to ColorSwatchPicker. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L109), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1)

- **colorSwatch manifest:** `size` = `sm`, `md`, `lg`. [packages/styles/src/manifest.ts:109](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L109)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Passive accessible color preview** — layer 3; **3 systems**; Area **yes**; **retain**. Existing image role/name. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorSwatch.md), [Mantine](https://mantine.dev/llms/core-color-swatch.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-swatch). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1)

- **Alpha checkerboard** — layer 3; **3 systems**; Area **yes**; **retain**. Existing transparency preview. Evidence: [Untitled UI](https://www.untitledui.com/react/components/color-pickers), [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorSwatch.md), [Chakra/Ark](https://chakra-ui.com/docs/components/color-swatch). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1)

- **Round/square/rounded shape choice** — layer 2; **1 systems**; Area **not-found**; **consider**. Keep shape decisions separate from size. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/ColorSwatch.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1)

- **Mixed-color preview** — layer 2; **1 systems**; Area **not-found**; **consider**. Useful inspector state with a distinct accessible label. Evidence: [Chakra/Ark](https://chakra-ui.com/docs/components/color-swatch). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1)

- **Interactive swatch button** — layer 3; **0 systems**; Area **not-applicable**; **do-not-add**. These peers use a selection/trigger job; Area keeps selection in ColorSwatchPicker. Evidence: [Fluent 2 [excluded: adjacent]](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/ColorSwatch.types.ts), [Ant Design [excluded: adjacent]](https://ant.design/components/color-picker). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1)

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

- [component/source](https://react-aria.adobe.com/ColorSwatch.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ColorSwatch.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — adjacent

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-swatch-picker/library/src/components/ColorSwatch/ColorSwatch.types.ts) — read; checked 2026-09-28.

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

- [component/source](https://mantine.dev/llms/core-color-swatch.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — adjacent

- [component/source](https://ant.design/components/color-picker) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/color-swatch) — read; checked 2026-09-28.

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

- [packages/styles/src/manifest.ts:109 — colorSwatch](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L109)

- [docs/specs/color-swatch.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L1)

- [docs/specs/color-swatch.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L8)

- [docs/specs/color-swatch.md:19 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L19)

- [docs/specs/color-swatch.md:25 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L25)

- [docs/specs/color-swatch.md:65 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L65)

- [docs/specs/color-swatch.md:79 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/color-swatch.md#L79)
