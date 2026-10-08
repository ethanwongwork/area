# Timeline

## Job

Show ordered events with markers, metadata and optional actions.

Observed family coverage: **5 / 15 implementation systems** (5 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Offer simple, alternating and compact layouts; reuse Avatar/Badge/Separator.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **MantineSize**: `xs` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `sm` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `md` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `lg` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `xl` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)).
- **bulletSize**: `number | string` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L48)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)).
- **loading**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L66)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L66)).
- **radius**: `MantineRadius` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L45)).
- **size**: `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `xl` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)).
- **variant**: `TimelineBadgeVariant` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L93)); `filled` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L52)); `outlined` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L52)); `subtle` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `solid` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `outline` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `plain` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)).

</details>

## Structural alternatives

- **Single-sided or alternating placement** — 2 observed implementation systems. [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L45), [Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline).
- **Avatar/marker/actions and breaks** — 2 observed implementation systems. [Primer](https://primer.style/product/components/timeline/), [Primer](https://primer.style/product/components/timeline/), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L48).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Timeline** — 4 system(s): [Primer](https://primer.style/product/components/timeline/), [Mantine](https://mantine.dev/core/timeline/), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L73), [Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline).
- **With a break** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Timeline breaks** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Timeline.Item** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Timeline.Badge** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Timeline.Body** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Timeline.Break** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Timeline.Actions** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Timeline.Avatar** — 1 system(s): [Primer](https://primer.style/product/components/timeline/).
- **Wrap Timeline.Item** — 1 system(s): [Mantine](https://mantine.dev/core/timeline/).
- **Timeline Items** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L77).
- **Composition** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **align**: `right` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L51)); `left` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L51)).
- **orientation**: `vertical` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L46)); `horizontal` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L46)).
- **placement**: `start` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L67)); `end` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L67)).
- **~~position~~**: `start` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L68)); `end` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L68)).

</details>

## Interaction patterns

Primer exposes actions and breaks; Ant exposes orientation and item placement. Static timelines keep document reading order and do not imply listbox selection.

Evidence: [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L1-L178), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L1-L83).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **clipSidebar**: `start` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L7)); `end` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L7)); `both` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L7)).
- **condensed**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L50)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L50)).
- **mode**: `start` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L45)); `alternate` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L45)); `end` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L45)).
- **reverse**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L49)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L49)).
- **reverseActive**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L57)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L57)).
- **showLastSeparator**: `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)); `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline)).

</details>

## Reuses in Area

[Avatar](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L361), [Badge](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L316), [Separator](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L382). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Offer simple, alternating and compact layouts; reuse Avatar/Badge/Separator.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Single-sided or alternating placement**: 2 observed systems. [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L45), [Chakra/Ark](https://www.chakra-ui.com/docs/components/timeline).
- **Layer 3 — Avatar/marker/actions and breaks**: 2 observed systems. [Primer](https://primer.style/product/components/timeline/), [Primer](https://primer.style/product/components/timeline/), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L48).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Timeline`; aliases appear in the JSON coverage record.

- **Untitled UI**: [activity-feeds — component](https://www.untitledui.com/react/components/activity-feeds).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [timeline — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Timeline/Timeline.tsx#L1-L178).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Timeline — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Timeline/Timeline.tsx#L1-L169).
- **Ant Design**: [timeline — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/timeline/index.en-US.md#L1-L83).
- **Chakra/Ark**: [timeline — component](https://www.chakra-ui.com/docs/components/timeline).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [lists-and-tables — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
