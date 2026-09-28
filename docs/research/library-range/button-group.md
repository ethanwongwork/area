# Button Group — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Join related independent actions into one track. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L18)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `selection`: `single`, `multiple`; `disabled`: `group`, `individual` [Untitled UI 1](https://www.untitledui.com/react/components/button-groups)

  Selection examples are adjacent to Area independent actions; keep the semantics separate.

- **shadcn/ui** (component): `orientation`: `horizontal`, `vertical` [shadcn/ui 1](https://ui.shadcn.com/docs/components/button-group.md)

<details>

<summary>shadcn/ui: additional/source-part API enum inventory</summary>

- ButtonGroup / `orientation`: `horizontal`, `vertical`. [API](https://ui.shadcn.com/docs/components/button-group.md)

- ButtonGroupSeparator / `orientation`: `horizontal`, `vertical`. [API](https://ui.shadcn.com/docs/components/button-group.md)

</details>

- **React Aria / Spectrum 2** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/ButtonGroup.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ActionButtonGroup.md)

  Do not merge ToggleButtonGroup selection into Area independent-action ButtonGroup.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- ButtonGroup / `align`: `center`, `end`, `start`. [API](https://react-spectrum.adobe.com/ButtonGroup.md)

- ButtonGroup / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ButtonGroup.md)

- ButtonGroup / `orientation`: `horizontal`, `vertical`. [API](https://react-spectrum.adobe.com/ButtonGroup.md)

- ButtonGroup / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/ButtonGroup.md)

- ActionButtonGroup / `density`: `compact`, `regular`. [API](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- ActionButtonGroup / `isDisabled`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- ActionButtonGroup / `isJustified`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- ActionButtonGroup / `isQuiet`: `false`, `true`. [API](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- ActionButtonGroup / `orientation`: `horizontal`, `vertical`. [API](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- ActionButtonGroup / `size`: `L`, `M`, `S`, `XL`, `XS`. [API](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- ActionButtonGroup / `staticColor`: `auto`, `black`, `white`. [API](https://react-spectrum.adobe.com/ActionButtonGroup.md)

</details>

- **Primer** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Primer 1](https://primer.style/product/components/button-group)

- **Carbon** (composition): `orientation`: `horizontal`, `vertical` [Carbon 1](https://carbondesignsystem.com/components/button/usage)

- **Material 3** (component): `connected`: `false`, `true`; `overflow`: `none`, `menu`, `wrap`; `singleSelection`: `false`, `true`; `selectionRequired`: `false`, `true` [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md), [Material 3 2](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ToggleButtonGroup.md)

  ButtonGroup and ToggleButtonGroup remain distinct APIs.

- **Mantine** (component): `orientation`: `horizontal`, `vertical` [Mantine 1](https://mantine.dev/llms/core-button.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `autoContrast`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `fullWidth`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/core-button.md)

- Props / `orientation`: `horizontal`, `vertical`. [API](https://mantine.dev/llms/core-button.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Chakra/Ark** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Chakra/Ark 1](https://chakra-ui.com/docs/components/button)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `colorPalette`: `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink`. [API](https://chakra-ui.com/docs/components/button)

- `size`: `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`. [API](https://chakra-ui.com/docs/components/button)

- `variant`: `solid`, `subtle`, `surface`, `outline`, `ghost`, `plain`. [API](https://chakra-ui.com/docs/components/button)

- `loading`: `false`, `true`. [API](https://chakra-ui.com/docs/components/button)

</details>

- **Atlassian** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Atlassian 1](https://atlassian.design/components/button/button-group/examples)

- **Polaris** (component): `gap`: `base`, `none` [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group.md)

- **GOV.UK** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [GOV.UK 1](https://design-system.service.gov.uk/components/button)

- **Apple HIG** (guidance): `selection`: `single`, `multiple`, `momentary` [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/segmented-controls.json)

  Multiple and momentary selection guidance is platform-specific (macOS).

## Structural alternatives

- **Untitled UI** (component): joined text actions; leading icons; dots. [Untitled UI 1](https://www.untitledui.com/react/components/button-groups)

- **shadcn/ui** (component): nested groups; separator; split; input; input group; dropdown; select; popover. [shadcn/ui 1](https://ui.shadcn.com/docs/components/button-group.md)

- **React Aria / Spectrum 2** (component): ButtonGroup; ActionButtonGroup; overflow adaptation. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/ButtonGroup.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- **Primer** (component): attached buttons; split button; dropdown button. [Primer 1](https://primer.style/product/components/button-group)

- **Carbon** (composition): action group; fixed/fluid alignment. [Carbon 1](https://carbondesignsystem.com/components/button/usage)

- **Material 3** (component): connected group; spaced group; overflow menu; wrapped rows; icon-only group. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md), [Material 3 2](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ToggleButtonGroup.md)

- **Mantine** (component): joined group; passive group section. [Mantine 1](https://mantine.dev/llms/core-button.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Chakra/Ark** (composition): attached group; unattached group. [Chakra/Ark 1](https://chakra-ui.com/docs/components/button)

- **Atlassian** (component): grouped action buttons. [Atlassian 1](https://atlassian.design/components/button/button-group/examples)

- **Polaris** (component): primary action; secondary actions; joined split actions. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group.md)

- **GOV.UK** (composition): primary/secondary action group. [GOV.UK 1](https://design-system.service.gov.uk/components/button)

- **Apple HIG** (guidance): segmented control; label or image; equal-width segments. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/segmented-controls.json)

## Interaction patterns

- **Untitled UI** (component): single selection; multiple selection. [Untitled UI 1](https://www.untitledui.com/react/components/button-groups)

- **shadcn/ui** (component): independent button focus; toggle group is a separate selection primitive. [shadcn/ui 1](https://ui.shadcn.com/docs/components/button-group.md)

- **React Aria / Spectrum 2** (component): group related independent actions. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/ButtonGroup.md), [React Aria / Spectrum 2 2](https://react-spectrum.adobe.com/ActionButtonGroup.md)

- **Primer** (component): independent action buttons. [Primer 1](https://primer.style/product/components/button-group)

- **Carbon** (composition): independent buttons. [Carbon 1](https://carbondesignsystem.com/components/button/usage)

- **Material 3** (component): momentary action; single selection; multiple selection. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md), [Material 3 2](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ToggleButtonGroup.md)

- **Mantine** (component): individual buttons retain behavior. [Mantine 1](https://mantine.dev/llms/core-button.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Chakra/Ark** (composition): independent action buttons. [Chakra/Ark 1](https://chakra-ui.com/docs/components/button)

- **Atlassian** (component): independent action buttons. [Atlassian 1](https://atlassian.design/components/button/button-group/examples)

- **Polaris** (component): independent action buttons. [Polaris 1](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group.md)

- **GOV.UK** (composition): independent buttons. [GOV.UK 1](https://design-system.service.gov.uk/components/button)

- **Apple HIG** (guidance): selection; momentary actions. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/segmented-controls.json)

## Area today

Soft/outline; sm/md/lg; full width; horizontal joined buttons. Each button has its own tab stop. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L9), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L18), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L24), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L45)

Vertical orientation and separate spacing treatment are not documented. Roving toolbar focus and exclusive selection belong to Toolbar/Segmented. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L59), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

**Owner boundary:** SplitButton is already a separate family; do not duplicate its action-menu engine here. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L9)

- **buttonGroup manifest:** `variant` = `soft`, `outline`; `size` = `sm`, `md`, `lg`; boolean modifiers: `full-width`. [packages/styles/src/manifest.ts:59](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L59)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Horizontal and vertical orientation** — layer 2; **3 systems**; Area **partial**; **add**. Only horizontal is documented today. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/button-group.md), [Mantine](https://mantine.dev/llms/core-button.md), [Carbon](https://carbondesignsystem.com/components/button/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

- **Joined and spaced layouts** — layer 3; **3 systems**; Area **partial**; **consider**. Joined exists; spaced layout can remain a general composition. Evidence: [Chakra/Ark](https://chakra-ui.com/docs/components/button), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

- **Mixed buttons and other controls** — layer 3; **1 systems**; Area **partial**; **consider**. Keep InputGroup and Toolbar responsibilities explicit. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/button-group.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

- **Overflow menu or wrapping** — layer 3; **1 systems**; Area **not-found**; **consider**. Toolbar already owns overflow; prefer reuse rather than duplicate navigation. Evidence: [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

- **Independent action tab stops** — layer 3; **7 systems**; Area **yes**; **retain**. Current group behavior. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/button-group.md), [Primer](https://primer.style/product/components/button-group), [Mantine](https://mantine.dev/llms/core-button.md), [Chakra/Ark](https://chakra-ui.com/docs/components/button), [Atlassian](https://atlassian.design/components/button/button-group/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group.md), [GOV.UK](https://design-system.service.gov.uk/components/button). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

- **Single/multiple selection group** — layer 3; **3 systems**; Area **not-applicable**; **do-not-add**. Area has Segmented/choice families; avoid silently changing ButtonGroup semantics. Evidence: [Untitled UI](https://www.untitledui.com/react/components/button-groups), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/ButtonGroup.md), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

- **Split action plus menu** — layer 3; **3 systems**; Area **not-applicable**; **do-not-add**. Already owned by SplitButton outside this run. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/button-group.md), [Primer](https://primer.style/product/components/button-group), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/button-groups) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/button-group.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — component

- [component/source](https://react-spectrum.adobe.com/ButtonGroup.md) — read; checked 2026-09-28.

- [component/source](https://react-spectrum.adobe.com/ActionButtonGroup.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/button-group) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — composition

- [component/source](https://carbondesignsystem.com/components/button/usage) — read; checked 2026-09-28.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/button-groups/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ButtonGroup.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ToggleButtonGroup.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-button.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — composition

- [component/source](https://chakra-ui.com/docs/components/button) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — component

- [component/source](https://atlassian.design/components/button/button-group/examples) — read; checked 2026-09-28.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — component

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button-group.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — composition

- [component/source](https://design-system.service.gov.uk/components/button) — read; checked 2026-09-28.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/segmented-controls.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:59 — buttonGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L59)

- [docs/specs/button-group.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L1)

- [docs/specs/button-group.md:9 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L9)

- [docs/specs/button-group.md:18 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L18)

- [docs/specs/button-group.md:24 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L24)

- [docs/specs/button-group.md:45 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/button-group.md#L45)
