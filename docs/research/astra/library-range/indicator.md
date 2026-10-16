# Indicator — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Attach a small count, status or presence mark to another element. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L20)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (composition): `status`: `online`, `offline` [Untitled UI 1](https://www.untitledui.com/react/components/avatars)

- **React Aria / Spectrum 2** (adjacent): `size`: `S`, `M`, `L`, `XL`; `variant`: `neutral`, `informative`, `negative`, `notice`, `positive`, `brown`, `celery`, `chartreuse`, `cinnamon`, `cyan`, `fuchsia`, `indigo`, `magenta`, `pink`, `purple`, `seafoam`, `silver`, `turquoise`, `yellow` [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/StatusLight.md)

  StatusLight labels status inline. Attached count was mentioned in the release index but its standalone API was not verified in this scan.

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- API / `size`: `L`, `M`, `S`, `XL`. [API](https://react-spectrum.adobe.com/StatusLight.md)

- API / `variant`: `brown`, `celery`, `chartreuse`, `cinnamon`, `cyan`, `fuchsia`, `indigo`, `informative`, `magenta`, `negative`, `neutral`, `notice`, `pink`, `positive`, `purple`, `seafoam`, `silver`, `turquoise`, `yellow`. [API](https://react-spectrum.adobe.com/StatusLight.md)

</details>

- **Fluent 2** (component): `counterAppearance`: `filled`, `ghost`; `counterColor`: `brand`, `danger`, `important`, `informative`; `counterShape`: `circular`, `rounded`; `dot`: `false`, `true`; `showZero`: `false`, `true`; `status`: `busy`, `out-of-office`, `away`, `available`, `offline`, `do-not-disturb`, `unknown`, `blocked`; `outOfOffice`: `false`, `true` [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/badge/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/PresenceBadge/PresenceBadge.types.ts)

<details>

<summary>Fluent 2: additional/source-part API enum inventory</summary>

- `appearance`: `filled`, `ghost`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts)

- `color`: `color`, `brand`, `danger`, `important`, `informative`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts)

- `shape`: `circular`, `rounded`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts)

- `showZero`: `false`, `true`. [API](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts)

</details>

- **Primer** (adjacent): `variant`: `primary`, `secondary`, `default` [Primer 1](https://primer.style/product/components/counter-label)

  CounterLabel is an inline count, not an attachment-positioning primitive.

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `variant`: `primary`, `secondary`. [API](https://primer.style/product/components/counter-label)

</details>

- **Material 3** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/BadgeDrawable.md)

- **Mantine** (component): `position`: `top-start`, `top-center`, `top-end`, `middle-start`, `middle-center`, `middle-end`, `bottom-start`, `bottom-center`, `bottom-end`; `processing`: `false`, `true`; `disabled`: `false`, `true`; `withBorder`: `false`, `true` [Mantine 1](https://mantine.dev/llms/core-indicator.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `autoContrast`: `false`, `true`. [API](https://mantine.dev/llms/core-indicator.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/core-indicator.md)

- Props / `showZero`: `false`, `true`. [API](https://mantine.dev/llms/core-indicator.md)

- Props / `withBorder`: `false`, `true`. [API](https://mantine.dev/llms/core-indicator.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (component): `size`: `default`, `small`; `status`: `success`, `processing`, `default`, `error`, `warning`; `dot`: `false`, `true`; `showZero`: `false`, `true` [Ant Design 1](https://ant.design/components/badge)

- **Chakra/Ark** (adjacent): `size`: `sm`, `md`, `lg` [Chakra/Ark 1](https://chakra-ui.com/docs/components/status)

  Status is inline; attachment uses general layout composition.

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `size`: `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/status)

</details>

- **Atlassian** (adjacent): `appearance`: `neutral`, `information`, `inverse`, `success`, `danger`, `warning`, `discovery`; `emphasis`: `default`, `bold`; `max`: `number`, `false` [Atlassian 1](https://atlassian.design/components/badge/examples)

  Atlassian Badge is inline numeric content; placement/anchoring is separate.

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/notifications.json)

  Platform app badge guidance, not inline Status/Presence API.

## Structural alternatives

- **Untitled UI** (composition): avatar status dot; verification badge; company mark; overflow count. [Untitled UI 1](https://www.untitledui.com/react/components/avatars)

- **React Aria / Spectrum 2** (adjacent): status light and label. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/StatusLight.md)

- **Fluent 2** (component): counter; presence glyph; avatar attachment. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/badge/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/PresenceBadge/PresenceBadge.types.ts)

- **Primer** (adjacent): inline numeric counter. [Primer 1](https://primer.style/product/components/counter-label)

- **Material 3** (component): dot; numeric badge; anchor attachment; count overflow. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/BadgeDrawable.md)

- **Mantine** (component): attached dot; label/count; inline owner. [Mantine 1](https://mantine.dev/llms/core-indicator.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): count; dot; standalone; anchor offset; ribbon. [Ant Design 1](https://ant.design/components/badge)

- **Chakra/Ark** (adjacent): status dot; label. [Chakra/Ark 1](https://chakra-ui.com/docs/components/status)

- **Atlassian** (adjacent): numeric badge. [Atlassian 1](https://atlassian.design/components/badge/examples)

- **Apple HIG** (guidance): app icon badge; notification count. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/notifications.json)

## Interaction patterns

- **Untitled UI** (composition): status accompanies avatar. [Untitled UI 1](https://www.untitledui.com/react/components/avatars)

- **React Aria / Spectrum 2** (adjacent): optional status live role. [React Aria / Spectrum 2 1](https://react-spectrum.adobe.com/StatusLight.md)

- **Fluent 2** (component): count capping; availability status. [Fluent 2 1](https://fluent2.microsoft.design/components/web/react/core/badge/usage), [Fluent 2 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts), [Fluent 2 3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/PresenceBadge/PresenceBadge.types.ts)

- **Primer** (adjacent): passive count. [Primer 1](https://primer.style/product/components/counter-label)

- **Material 3** (component): passive notification indicator. [Material 3 1](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/BadgeDrawable.md)

- **Mantine** (component): processing animation; visibility. [Mantine 1](https://mantine.dev/llms/core-indicator.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (component): count overflow cap; processing animation. [Ant Design 1](https://ant.design/components/badge)

- **Chakra/Ark** (adjacent): passive status. [Chakra/Ark 1](https://chakra-ui.com/docs/components/status)

- **Atlassian** (adjacent): count cap. [Atlassian 1](https://atlassian.design/components/badge/examples)

- **Apple HIG** (guidance): notification state. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/notifications.json)

## Area today

Count/dot; semantic tones; processing; border; four-corner placement; circle/rectangle overlap; compact/invisible. Presence has its own statuses and sizes. Standalone mark is named; attached mark is decorative. Count capping, show-zero policy, finite/nonnegative normalization and reduced-motion handling are documented in later spec sections. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L8), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L20), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L27), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L209), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L233), [Area 7](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L393), [Area 8](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/react/src/components/Indicator.tsx#L6)

No ribbon or inline-label component, or nine-position placement grid. The spec intentionally excludes arbitrary color/radius and freeform labels. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L329), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L336), [baseline 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L343), [baseline 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

**Owner boundary:** Owner chose four corner placements and distinct count/activity/presence roles. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L8)

- **indicator manifest:** `kind` = `count`, `dot`; `tone` = `accent`, `neutral`, `info`, `success`, `warning`, `danger`; runtime states: `processing`, `border`. [packages/styles/src/manifest.ts:329](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L329)

- **presence manifest:** `status` = `available`, `away`, `busy`, `do-not-disturb`, `blocked`, `offline`, `out-of-office`, `unknown`; `size` = `xs`, `sm`, `md`, `lg`; runtime states: `out-of-office`. [packages/styles/src/manifest.ts:336](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L336)

- **indicatorAnchor manifest:** `placement` = `top-end`, `top-start`, `bottom-end`, `bottom-start`; `overlap` = `overlap-rectangular`, `overlap-circular`; boolean modifiers: `compact`; runtime states: `invisible`. [packages/styles/src/manifest.ts:343](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L343)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Count and dot** — layer 2; **4 systems**; Area **yes**; **retain**. Existing kinds. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/badge/usage), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/BadgeDrawable.md), [Mantine](https://mantine.dev/llms/core-indicator.md), [Ant Design](https://ant.design/components/badge). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

- **Presence status glyphs** — layer 2; **1 systems**; Area **yes**; **retain**. Existing presence contract. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/badge/usage). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

- **Count cap and show-zero policy** — layer 3; **2 systems**; Area **yes**; **retain**. Documented in Area spec; these are React behavior, not manifest design variants. Evidence: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/badge/usage), [Ant Design](https://ant.design/components/badge). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

- **Corner attachment and overlap** — layer 3; **3 systems**; Area **yes**; **retain**. Existing four corners and circular/rectangular overlap. Evidence: [Mantine](https://mantine.dev/llms/core-indicator.md), [Ant Design](https://ant.design/components/badge), [Material 3](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/BadgeDrawable.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

- **Nine-position placement** — layer 2; **1 systems**; Area **owner-decision**; **owner**. Owner selected four corners; central positions would reopen scope. Evidence: [Mantine](https://mantine.dev/llms/core-indicator.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

- **Ribbon treatment** — layer 3; **1 systems**; Area **not-found**; **consider**. Distinct anatomy; likely a separate recipe. Evidence: [Ant Design](https://ant.design/components/badge). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

- **Processing pulse** — layer 2; **2 systems**; Area **yes**; **retain**. Existing motion with reduced-motion handling. Evidence: [Mantine](https://mantine.dev/llms/core-indicator.md), [Ant Design](https://ant.design/components/badge). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — composition

- [component/source](https://www.untitledui.com/react/components/avatars) — read; checked 2026-09-28.

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

### React Aria / Spectrum 2 — adjacent

- [component/source](https://react-spectrum.adobe.com/StatusLight.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — component

- [component/source](https://fluent2.microsoft.design/components/web/react/core/badge/usage) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/CounterBadge/CounterBadge.types.ts) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-badge/library/src/components/PresenceBadge/PresenceBadge.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — adjacent

- [component/source](https://primer.style/product/components/counter-label) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — component

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [component/source](https://m3.material.io/components/badges/overview) — not found or unusable response; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/material-components/material-components-android/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/BadgeDrawable.md) — read; checked 2026-09-28.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/core-indicator.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — component

- [component/source](https://ant.design/components/badge) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — adjacent

- [component/source](https://chakra-ui.com/docs/components/status) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — adjacent

- [component/source](https://atlassian.design/components/badge/examples) — read; checked 2026-09-28.

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

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/notifications.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:329 — indicator](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L329)

- [packages/styles/src/manifest.ts:336 — presence](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L336)

- [packages/styles/src/manifest.ts:343 — indicatorAnchor](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L343)

- [docs/specs/indicator.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L1)

- [docs/specs/indicator.md:8 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L8)

- [docs/specs/indicator.md:20 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L20)

- [docs/specs/indicator.md:27 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L27)

- [docs/specs/indicator.md:209 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L209)

- [docs/specs/indicator.md:233 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L233)

- [docs/specs/indicator.md:393 — Prior implementation record](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/indicator.md#L393)

- [packages/react/src/components/Indicator.tsx:6 — React API and behavior](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/react/src/components/Indicator.tsx#L6)
