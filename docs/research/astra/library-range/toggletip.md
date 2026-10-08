# Toggletip

## Job

Reveal supplementary interactive information on explicit activation.

Observed family coverage: **4 / 15 implementation systems** (4 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Compose Button and Popover; retain Tooltip for noninteractive hover/focus labels.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **isOpen**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-51)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-51)).
- **open**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **size**: `xs` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).

</details>

## Structural alternatives

- **Explicit trigger and interactive information** — 2 observed implementation systems. [Carbon](https://carbondesignsystem.com/components/toggletip/usage/), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/infolabel/usage).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Placement** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/toggletip/usage/).
- **Interactions** — 1 system(s): [Carbon](https://carbondesignsystem.com/components/toggletip/usage/).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **Placement**: `auto-start` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `auto` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `auto-end` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `top-start` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `top` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `top-end` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `right-start` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `right` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `right-end` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `bottom-end` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `bottom` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `bottom-start` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `left-end` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `left` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)); `left-start` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-5:20)).
- **fallbackPlacements**: `Placement[]` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-71)).
- **placement**: `Placement` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-55)).

</details>

## Interaction patterns

Carbon distinguishes toggletips from tooltips. Chakra exposes Escape/outside dismissal; Fluent InfoLabel documents focus treatment for the supplemental content.

Evidence: [Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Toggletip/index.tsx#L1-L300), [Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip), [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-infolabel/library/src/components/InfoLabel/InfoLabel.types.ts#L1-L41).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **autoFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **closeOnEscape**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **closeOnInteractOutside**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **hideMode**: `HideMode` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **immediate**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **lazyMount**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **modal**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **portalled**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **present**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **restoreFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **skipAnimationOnMount**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).
- **strategy**: `fixed` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-60)); `absolute` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/src/types.tsx#lines-60)).
- **unmountOnExit**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip)).

</details>

## Reuses in Area

[Popover](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L540), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Compose Button and Popover; retain Tooltip for noninteractive hover/focus labels.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Explicit trigger and interactive information**: 2 observed systems. [Carbon](https://carbondesignsystem.com/components/toggletip/usage/), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/infolabel/usage).
- **Layer 2 — Escape and outside-interaction dismissal**: 1 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip), [Chakra/Ark](https://www.chakra-ui.com/docs/components/toggle-tip).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Toggletip`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: [popover — analogue](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/popover.props.tsx#L1-L37).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: [infolabel — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-infolabel/library/src/components/InfoLabel/InfoLabel.types.ts#L1-L41).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: [Toggletip — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Toggletip/index.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: **not found** for this job in the reviewed [catalogue](https://mantine.dev/core/package/) and [pinned source inventory](https://github.com/mantinedev/mantine/tree/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4).
- **Ant Design**: **not found** for this job in the reviewed [catalogue](https://ant.design/components/overview/) and [pinned source inventory](https://github.com/ant-design/ant-design/tree/7ad64087106acd078dcc7d91a4adfdf38f5ce172).
- **Chakra/Ark**: [toggle-tip — component](https://www.chakra-ui.com/docs/components/toggle-tip).
- **Atlassian**: [inline-dialog — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-dialog/README.md#lines-1:15).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [popovers — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/popovers).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
