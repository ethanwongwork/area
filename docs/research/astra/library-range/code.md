# Code — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Mark inline literal/code content without acting as a control. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L15)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Radix Themes** (component): `variant`: `solid`, `soft`, `outline`, `ghost`; `weight`: `light`, `regular`, `medium`, `bold`; `wrap`: `wrap`, `nowrap`, `pretty`, `balance`; `highContrast`: `false`, `true`; `truncate`: `false`, `true` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/code)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `solid`, `soft`, `outline`, `ghost`. [API](https://www.radix-ui.com/themes/docs/components/code)

- `highContrast`: `false`, `true`. [API](https://www.radix-ui.com/themes/docs/components/code)

</details>

- **Carbon** (component): `kind`: `inline` [Carbon 1](https://carbondesignsystem.com/components/code-snippet/usage)

- **Mantine** (component): `block`: `false`, `true` [Mantine 1](https://mantine.dev/llms/core-code.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `withBorder`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withCopyButton`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withExpandButton`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withFirstLineIndentation`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- Props / `withLineNumbers`: `false`, `true`. [API](https://mantine.dev/llms/core-code.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Ant Design 1](https://ant.design/components/typography)

- **Chakra/Ark** (component): `variant`: `solid`, `subtle`, `outline`, `surface`, `plain`; `size`: `xs`, `sm`, `md`, `lg` [Chakra/Ark 1](https://chakra-ui.com/docs/components/code)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `variant`: `solid`, `subtle`, `outline`, `surface`, `plain`. [API](https://chakra-ui.com/docs/components/code)

- `size`: `xs`, `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/code)

</details>

- **Atlassian** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Atlassian 1](https://atlassian.design/components/code/examples)

## Structural alternatives

- **Radix Themes** (component): inline code. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/code)

- **Carbon** (component): inline code. [Carbon 1](https://carbondesignsystem.com/components/code-snippet/usage)

- **Mantine** (component): inline code; block code; custom background. [Mantine 1](https://mantine.dev/llms/core-code.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): Typography code styling. [Ant Design 1](https://ant.design/components/typography)

- **Chakra/Ark** (component): inline code. [Chakra/Ark 1](https://chakra-ui.com/docs/components/code)

- **Atlassian** (component): inline code. [Atlassian 1](https://atlassian.design/components/code/examples)

## Interaction patterns

- **Radix Themes** (component): passive text. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/code)

- **Carbon** (component): passive text. [Carbon 1](https://carbondesignsystem.com/components/code-snippet/usage)

- **Mantine** (component): passive text. [Mantine 1](https://mantine.dev/llms/core-code.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): passive inline code. [Ant Design 1](https://ant.design/components/typography)

- **Chakra/Ark** (component): passive text. [Chakra/Ark 1](https://chakra-ui.com/docs/components/code)

- **Atlassian** (component): passive text. [Atlassian 1](https://atlassian.design/components/code/examples)

## Area today

Default/subtle/on-color ground; optional swatch; size follows surrounding typography. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L15), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L21), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L80), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L105)

No independent code size axis or syntax-highlighting engine. Block code is a separate family. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L623), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1)

**Owner boundary:** Contextual sizing is intentional; do not turn inline Code into a second control scale. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L8)

- **code manifest:** `ground` = `on-color`, `subtle`; boolean modifiers: `swatch`. [packages/styles/src/manifest.ts:623](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L623)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Contextual inline sizing** — layer 2; **0 systems**; Area **yes**; **retain**. Area inherits surrounding typography. Evidence: [Area basis 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L623); no verified equivalent counted in this scan. [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1)

- **Soft/solid/outline code treatment** — layer 2; **2 systems**; Area **partial**; **consider**. Ground variants exist, but no equivalent broad treatment axis. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/code), [Chakra/Ark](https://chakra-ui.com/docs/components/code). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1)

- **Independent size ladder** — layer 2; **2 systems**; Area **owner-decision**; **owner**. Keep contextual sizing unless owner reopens the decision. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/code), [Chakra/Ark](https://chakra-ui.com/docs/components/code). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1)

- **Passive semantic inline code** — layer 3; **6 systems**; Area **yes**; **retain**. Existing code element. Evidence: [Radix Themes](https://www.radix-ui.com/themes/docs/components/code), [Carbon](https://carbondesignsystem.com/components/code-snippet/usage), [Mantine](https://mantine.dev/llms/core-code.md), [Chakra/Ark](https://chakra-ui.com/docs/components/code), [Ant Design](https://ant.design/components/typography), [Atlassian](https://atlassian.design/components/code/examples). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1)

- **Color swatch in literal** — layer 3; **0 systems**; Area **yes**; **retain**. Area-specific composition grounded in its own spec. Evidence: [Area basis 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L623); no verified equivalent counted in this scan. [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [component/source](https://www.untitledui.com/react/components/code-snippets) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/code) — read; checked 2026-09-28.

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

### Primer — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [component/source](https://primer.style/product/components/text) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — component

- [component/source](https://carbondesignsystem.com/components/code-snippet/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-code.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — composition

- [component/source](https://ant.design/components/typography) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/code) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/code/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:623 — code](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L623)

- [docs/specs/code.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L1)

- [docs/specs/code.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L8)

- [docs/specs/code.md:15 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L15)

- [docs/specs/code.md:21 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L21)

- [docs/specs/code.md:80 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L80)

- [docs/specs/code.md:105 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/code.md#L105)
