# DescriptionList

## Job

Pair labels and values without imposing table navigation.

Observed family coverage: **5 / 15 implementation systems** (5 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Provide semantic term/value anatomy with inline/stacked layouts and optional row actions.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **MantineSize**: `xs` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `sm` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `md` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `lg` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `xl` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)).
- **size**: `1` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L10)); `2` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L10)); `3` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L10)); `MantineSize` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/DataList/DataList.tsx#L45)); `large` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.en-US.md#L94)); `medium` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.en-US.md#L94)); `small` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.en-US.md#L94)); `default` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L71)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list)).
- **variant**: `subtle` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list)); `bold` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list)).

</details>

## Structural alternatives

- **Horizontal versus stacked term/value pairs** — 3 observed implementation systems. [Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L9), [Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.en-US.md#L93).
- **Row actions and summary cards** — 1 observed implementation systems. [GOV.UK](https://design-system.service.gov.uk/components/summary-list/), [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Orientation** — 2 system(s): [Radix Themes](https://www.radix-ui.com/themes/docs/components/data-list), [Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list).
- **With divider** — 1 system(s): [Mantine](https://mantine.dev/core/data-list/).
- **Vertical orientation** — 1 system(s): [Mantine](https://mantine.dev/core/data-list/).
- **Adding actions to each row** — 1 system(s): [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).
- **Showing rows with and without actions** — 1 system(s): [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).
- **Summary cards** — 1 system(s): [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).
- **Card titles** — 1 system(s): [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).
- **Adding card actions** — 1 system(s): [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **extra**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L77)).
- **orientation**: `horizontal` — 3 systems ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L9), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/DataList/DataList.tsx#L51), [Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list)); `vertical` — 3 systems ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L9), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/DataList/DataList.tsx#L51), [Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list)).
- **title**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L76)).

</details>

## Interaction patterns

Radix and Chakra expose orientation. GOV.UK summary lists add per-row and card actions; editing remains the responsibility of those controls.

Evidence: [Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L1-L54), [Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list), [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **bordered**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L67)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L67)).
- **colon**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L80)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L80)).
- **layout**: `horizontal` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L79)); `vertical` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.tsx#L79)).
- **withDivider**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/DataList/DataList.tsx#L54)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/DataList/DataList.tsx#L54)).

</details>

## Reuses in Area

[Code](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L623), [Badge](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L316). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Provide semantic term/value anatomy with inline/stacked layouts and optional row actions.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Horizontal versus stacked term/value pairs**: 3 observed systems. [Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L9), [Chakra/Ark](https://www.chakra-ui.com/docs/components/data-list), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.en-US.md#L93).
- **Layer 3 — Row actions and summary cards**: 1 observed systems. [GOV.UK](https://design-system.service.gov.uk/components/summary-list/), [GOV.UK](https://design-system.service.gov.uk/components/summary-list/).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `DescriptionList`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: [data-list — component](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/data-list.props.tsx#L1-L54).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [page-header — analogue](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/PageHeader/PageHeader.tsx#L1-L300).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [DataList — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/DataList/DataList.tsx#L1-L142).
- **Ant Design**: [descriptions — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/descriptions/index.en-US.md#L1-L115).
- **Chakra/Ark**: [data-list — component](https://www.chakra-ui.com/docs/components/data-list).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: [summary-list — component](https://design-system.service.gov.uk/components/summary-list/).
- **Apple HIG**: [lists-and-tables — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
