# Dockable inspector

## Job

Move or resize an inspector while retaining its editing context.

Observed family coverage: **2 / 15 implementation systems** (0 with a component source; 2 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Start with a floating/resizable Panel recipe; defer a full docking engine until an owner workflow exists.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **disabled**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **gridSize**: `number` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **maxSize**: `Size` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **minSize**: `Size` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **open**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **size**: `Size` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).

</details>

## Structural alternatives

- **Floating resizable panel** — 2 observed implementation systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel), [Mantine](https://mantine.dev/core/floating-window/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Controlled position** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/floating-panel.mdx#L44).
- **Anchor Position** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel).
- **Floating Panel** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel).
- **FloatingPanelResizeTriggers** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel).
- **Multiple** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel).
- **Position** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel).
- **Set position** — 1 system(s): [Mantine](https://mantine.dev/core/floating-window/).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **getAnchorPosition**: `(details: AnchorPositionDetails) =&gt; Point` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **position**: `Point` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).

</details>

## Interaction patterns

Ark FloatingPanel and Mantine FloatingWindow document dragging and resizing. Their presence does not establish docking trees, tabbed docking or persistence.

Evidence: [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/floating-panel.mdx#L1-L86), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/FloatingWindow/FloatingWindow.tsx#L1-L191).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **allowOverflow**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **closeOnEscape**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **draggable**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **hideMode**: `HideMode` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **immediate**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **lazyMount**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **lockAspectRatio**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **persistRect**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **portalProps**: `children` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/FloatingWindow/FloatingWindow.tsx#L44)).
- **present**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **resizable**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **restoreFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **skipAnimationOnMount**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **strategy**: `absolute` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `fixed` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **unmountOnExit**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel)).
- **withinPortal**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/FloatingWindow/FloatingWindow.tsx#L41)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/FloatingWindow/FloatingWindow.tsx#L41)).

</details>

## Reuses in Area

[Panel](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416), [PropertyList](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L426), [Toolbar](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L76). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Start with a floating/resizable Panel recipe; defer a full docking engine until an owner workflow exists.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Floating resizable panel**: 2 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel), [Mantine](https://mantine.dev/core/floating-window/).
- **Layer 2 — Disable drag or resize independently**: 1 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel), [Chakra/Ark](https://www.chakra-ui.com/docs/components/floating-panel).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Dockable inspector`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [split-page-layout — analogue](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/SplitPageLayout/SplitPageLayout.tsx#L1-L147).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [FloatingWindow — recipe](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/FloatingWindow/FloatingWindow.tsx#L1-L191).
- **Ant Design**: **not found** for this job in the reviewed [catalogue](https://ant.design/components/overview/) and [pinned source inventory](https://github.com/ant-design/ant-design/tree/7ad64087106acd078dcc7d91a4adfdf38f5ce172).
- **Chakra/Ark**: [floating-panel — recipe](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/floating-panel.mdx#L1-L86).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [sheets — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/sheets).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
