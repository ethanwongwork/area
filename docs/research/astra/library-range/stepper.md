# Stepper

## Job

Communicate progress through named stages and optionally navigate between them.

Observed family coverage: **6 / 15 implementation systems** (6 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Treat stage status separately from whether a stage is actionable; reuse Buttons and Progress.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **MantineSize**: `xs` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `sm` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `md` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `lg` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `xl` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)).
- **disabled**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L185)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L185)).
- **iconSize**: `number | string` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L82)).
- **invalid**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L260)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L260)).
- **radius**: `MantineRadius` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L97)).
- **size**: `MantineSize` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L94)); `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L59)); `large` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L103)); `default` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L103)); `xs` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)).
- **variant**: `variant` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L64)); `filled` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L99)); `outlined` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L99)); `solid` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `subtle` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)).

</details>

## Structural alternatives

- **Horizontal or vertical stages** — 3 observed implementation systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L88), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L55), [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps).
- **Numbers, icons or compact dots** — 3 observed implementation systems. [Untitled UI](https://www.untitledui.com/react/components/progress-steps), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L57), [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Icon centered** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Icon centered with number** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Featured icon centered** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Icon with text** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Icon with number** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Featured icon with text** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Minimal icons** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Minimal icons connected** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Text with line** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/progress-steps).
- **Placement** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/progress-indicator/usage/).
- **Interactions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/progress-indicator/usage/).
- **With custom icons** — 1 system(s): [Mantine](https://mantine.dev/core/stepper/).
- **Vertical orientation** — 1 system(s): [Mantine](https://mantine.dev/core/stepper/).
- **Label position** — 1 system(s): [Mantine](https://mantine.dev/core/stepper/).
- **Icon position** — 1 system(s): [Mantine](https://mantine.dev/core/stepper/).
- **Loading state** — 1 system(s): [Mantine](https://mantine.dev/core/stepper/).
- **Wrap Stepper.Step** — 1 system(s): [Mantine](https://mantine.dev/core/stepper/).
- **Vertical** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps).
- **Icon** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **completedIcon**: `React.ReactNode | StepFragmentComponent` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L73)).
- **icon**: `React.ReactNode | StepFragmentComponent` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L70)).
- **iconPosition**: `right` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L91)); `left` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L91)).
- **orientation**: `vertical` — 3 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L88), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L108), [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `horizontal` — 3 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L88), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L108), [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L55)).
- **progressIcon**: `React.ReactNode | StepFragmentComponent` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L76)).
- **titlePlacement**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L62)); `horizontal` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L111)); `vertical` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L111)).
- **wrap**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L103)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L103)).

</details>

## Interaction patterns

Mantine exposes next-step selection limits and keyboard navigation. Chakra demonstrates validation gates; Apple's numeric stepper is a different job and is not counted.

Evidence: [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L1-L300), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/steps.mdx#L1-L66).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **Status**: `unvisited` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/progress-tracker/src/types.tsx#lines-6)); `visited` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/progress-tracker/src/types.tsx#lines-6)); `current` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/progress-tracker/src/types.tsx#lines-6)); `disabled` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/progress-tracker/src/types.tsx#lines-6)).
- **allowNextStepsSelect**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L100)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L100)).
- **complete**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L257)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L257)).
- **current**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L258)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L258)).
- **direction**: `horizontal` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L107)); `vertical` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L107)).
- **ellipsis**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L115)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L115)).
- **keepMounted**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L112)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L112)).
- **linear**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/steps)).
- **responsive**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L114)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L114)).
- **spaceEqually**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L68)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L68)).
- **status**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L78)); `wait` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L131)); `process` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L131)); `finish` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L131)); `error` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L131)).
- **type**: `default` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L105)); `navigation` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L105)); `inline` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L105)); `panel` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L105)); `dot` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.tsx#L105)).
- **vertical**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L72)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L72)).

</details>

## Reuses in Area

[Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35), [Progress](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L407). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Treat stage status separately from whether a stage is actionable; reuse Buttons and Progress.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Stage states and gated navigation**: 3 observed systems. [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L260), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L100), [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps).
- **Layer 3 — Horizontal or vertical stages**: 3 observed systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L88), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L55), [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps).
- **Layer 3 — Numbers, icons or compact dots**: 3 observed systems. [Untitled UI](https://www.untitledui.com/react/components/progress-steps), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L57), [Chakra/Ark](https://www.chakra-ui.com/docs/components/steps).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Stepper`; aliases appear in the JSON coverage record.

- **Untitled UI**: [progress-steps — component](https://www.untitledui.com/react/components/progress-steps).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: [ProgressIndicator — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Stepper — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Stepper/Stepper.tsx#L1-L300).
- **Ant Design**: [steps — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/steps/index.en-US.md#L1-L94).
- **Chakra/Ark**: [steps — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/steps.mdx#L1-L66).
- **Atlassian**: [progress-tracker — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/progress-tracker/README.md#lines-1:14).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: [task-list — analogue](https://design-system.service.gov.uk/components/task-list/).
- **Apple HIG**: [steppers — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/steppers).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
