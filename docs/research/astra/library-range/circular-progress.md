# Circular Progress

## Job

Show completion on a ring or gauge.

Observed family coverage: **6 / 15 implementation systems** (6 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Extend Progress with circular anatomy; preserve Spinner as the separate unknown-duration indicator where appropriate.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)).
- **isIndeterminate**: `false` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L46)); `true` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L46)).
- **size**: `xxs` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/base/progress-indicators/progress-circles.tsx#L9)); `xs` — 2 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/base/progress-indicators/progress-circles.tsx#L9), [Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `sm` — 2 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/base/progress-indicators/progress-circles.tsx#L9), [Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `md` — 2 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/base/progress-indicators/progress-circles.tsx#L9), [Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `lg` — 2 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/base/progress-indicators/progress-circles.tsx#L9), [Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)); `S` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L40)); `M` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L40)); `L` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L40)); `number` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L40)); `size` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L59)); `xl` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle)).

</details>

## Structural alternatives

- **Ring or semicircle** — 3 observed implementation systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L53), [Mantine](https://mantine.dev/core/semi-circle-progress/), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L78), [Untitled UI](https://www.untitledui.com/react/components/progress-indicators).
- **Segmented ring and central label** — 1 observed implementation systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L53), [Mantine](https://mantine.dev/core/ring-progress/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Size, thickness & rounded caps** — 1 system(s): [Mantine](https://mantine.dev/core/ring-progress/).
- **Filled segment transition** — 1 system(s): [Mantine](https://mantine.dev/core/semi-circle-progress/).
- **Change empty segment color** — 1 system(s): [Mantine](https://mantine.dev/core/semi-circle-progress/).
- **Change label position** — 1 system(s): [Mantine](https://mantine.dev/core/semi-circle-progress/).
- **Rounded** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle).
- **Multi-color indeterminate animation type** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ProgressIndicator.md#L405).
- **Adding rounded corners** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/ProgressIndicator.md#L648).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **gapPlacement**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L84)).
- **label**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L61)).
- **orientation**: `up` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L46)); `down` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L46)).
- **percentPosition**: `{ align: string; type: string }` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L68)).
- **~~gapPosition~~**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L85)).

</details>

## Interaction patterns

Material documents determinate/indeterminate modes and transitions. Mantine adds segmented rings and semicircles; Chakra supplies value labels.

Evidence: [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/progressindicator/AnimatorDurationScaleProvider.java#L1-L38), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L1-L174), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L1-L216), [Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **fillDirection**: `right-to-left` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L49)); `left-to-right` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L49)).
- **roundCaps**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L47)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L47)).
- **showInfo**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L51)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L51)).
- **staticColor**: `black` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L42)); `white` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L42)); `auto` — 1 system ([React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L42)).
- **status**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L52)).

</details>

## Reuses in Area

[Progress](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407), [Spinner](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L399). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Extend Progress with circular anatomy; preserve Spinner as the separate unknown-duration indicator where appropriate.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Ring or semicircle**: 3 observed systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L53), [Mantine](https://mantine.dev/core/semi-circle-progress/), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L78), [Untitled UI](https://www.untitledui.com/react/components/progress-indicators).
- **Layer 2 — Determinate or indeterminate ring**: 3 observed systems. [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/progressindicator/CircularProgressIndicator.java#L69), [Chakra/Ark](https://www.chakra-ui.com/docs/components/progress-circle), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/@react-spectrum/s2/src/ProgressCircle.tsx#L46).
- **Layer 3 — Segmented ring and central label**: 1 observed systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L53), [Mantine](https://mantine.dev/core/ring-progress/).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Circular Progress`; aliases appear in the JSON coverage record.

- **Untitled UI**: [progress-indicators — component](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/base/progress-indicators/progress-circles.tsx#L1-L176); [activity-gauges — component](https://www.untitledui.com/react/components/activity-gauges).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: [@ProgressCircle — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/ProgressCircle.mdx#L1-L41).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: [progressindicator — component](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/progressindicator/AnimatorDurationScaleProvider.java#L1-L38).
- **Mantine**: [RingProgress — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/RingProgress/RingProgress.tsx#L1-L174); [SemiCircleProgress — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/SemiCircleProgress/SemiCircleProgress.tsx#L1-L216).
- **Ant Design**: [progress — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/progress/index.en-US.md#L1-L94).
- **Chakra/Ark**: [progress-circle — component](https://www.chakra-ui.com/docs/components/progress-circle).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [progress-indicators — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/progress-indicators).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
