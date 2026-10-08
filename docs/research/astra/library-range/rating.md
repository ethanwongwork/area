# Rating

## Job

Enter or display a score using repeated symbols.

Observed family coverage: **5 / 15 implementation systems** (5 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Separate read-only display from editable selection and expose optional fractional values.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **MantineSize**: `xs` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `sm` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `md` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `lg` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `xl` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)).
- **color**: `brand` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L19)); `marigold` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L19)); `neutral` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L19)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)).
- **disabled**: `false` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L41), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `true` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L41), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)).
- **readOnly**: `false` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L80), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `true` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L80), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)).
- **size**: `small` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L45), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L43)); `medium` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L45), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L43)); `large` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L45), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L43)); `extra-large` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L45)); `MantineSize | number | (string & {})` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L65)); `SizeType` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.tsx#L22)); `xs` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)).

</details>

## Structural alternatives

- **Custom symbols and supporting label** — 2 observed implementation systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L56), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Interaction** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/rating/usage).
- **Read only** — 1 system(s): [Mantine](https://mantine.dev/core/rating/).
- **Fractions** — 1 system(s): [Mantine](https://mantine.dev/core/rating/).
- **ReadOnly** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating).
- **Custom Icon** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **countText**: `Slot&lt;'span'&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L8)).
- **fullValueInput**: `NonNullable&lt;Slot&lt;'input'&gt;&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingItem/RatingItem.types.ts#L26)).
- **halfValueInput**: `NonNullable&lt;Slot&lt;'input'&gt;&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingItem/RatingItem.types.ts#L22)).
- **selectedIcon**: `NonNullable&lt;Slot&lt;'div'&gt;&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingItem/RatingItem.types.ts#L14)).
- **unselectedIcon**: `NonNullable&lt;Slot&lt;'div'&gt;&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingItem/RatingItem.types.ts#L18)).
- **valueText**: `Slot&lt;'span'&gt;` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L7)).

</details>

## Interaction patterns

Mantine documents fractional ratings and custom symbols. Ark documents keyboard selection; Ant exposes clearing and half values.

Evidence: [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L1-L300), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L1-L61).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **allowClear**: `false` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L83), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L36)); `true` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L83), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L36)).
- **allowHalf**: `false` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L37), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `true` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L37), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)).
- **autoFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)).
- **compact**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L24)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/RatingDisplay/RatingDisplay.types.ts#L24)).
- **highlightSelectedOnly**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L86)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L86)).
- **keyboard**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L42)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L42)).
- **required**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/rating)).

</details>

## Reuses in Area

[RadioGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L251), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Separate read-only display from editable selection and expose optional fractional values.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Fractional and clearable ratings**: 3 observed systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L62), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L37), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L36), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating).
- **Layer 3 — Custom symbols and supporting label**: 2 observed systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L56), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rating).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Rating`; aliases appear in the JSON coverage record.

- **Untitled UI**: [rating-badge-and-stars — component](https://www.untitledui.com/react/components/rating-badge-and-stars).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: [rating — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-rating/library/src/components/Rating/Rating.types.ts#L1-L96).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Rating — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Rating/Rating.tsx#L1-L300).
- **Ant Design**: [rate — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/rate/index.en-US.md#L1-L61).
- **Chakra/Ark**: [rating — component](https://www.chakra-ui.com/docs/components/rating).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [ratings-and-reviews — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/ratings-and-reviews).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
