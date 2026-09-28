# LayerRow badges

## Job

Identify a layer's role or state inside a tree row.

Observed family coverage: **0 / 15 implementation systems** (0 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Use TreeView trailing slots and Badge; do not add a second tree renderer.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

Dedicated variant enums: **not found** in the reviewed family sources. Reuse the composing Area families; do not invent a size/tone matrix from analogues.

## Structural alternatives

- **Trailing layer-status markers** — 0 observed implementation systems (proposal based on analogues; no dedicated implementation counted). [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/tree/usage), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/TreeView/TreeView.tsx#L59).

## Interaction patterns

Fluent explicitly documents badges and quick actions in tree rows. Primer exposes trailing visuals; component/instance/mask meanings are Area product data.

Evidence: [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tree/library/src/components/Tree/Tree.types.ts#L1-L179), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/TreeView/TreeView.tsx#L1-L300).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

## Reuses in Area

[TreeView](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L180), [Badge](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L316). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Use TreeView trailing slots and Badge; do not add a second tree renderer.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Trailing layer-status markers**: 0 observed systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/tree/usage), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/TreeView/TreeView.tsx#L59). **Area proposal from analogues; dedicated support not found.**

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `LayerRow badges`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: [tree — analogue](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-tree/library/src/components/Tree/Tree.types.ts#L1-L179).
- **Primer**: [tree-view — analogue](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/TreeView/TreeView.tsx#L1-L300).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: **not found** for this job in the reviewed [catalogue](https://mantine.dev/core/package/) and [pinned source inventory](https://github.com/mantinedev/mantine/tree/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4).
- **Ant Design**: **not found** for this job in the reviewed [catalogue](https://ant.design/components/overview/) and [pinned source inventory](https://github.com/ant-design/ant-design/tree/7ad64087106acd078dcc7d91a4adfdf38f5ce172).
- **Chakra/Ark**: **not found** for this job in the reviewed [catalogue](https://www.chakra-ui.com/docs/components/concepts/overview) and [pinned source inventory](https://github.com/chakra-ui/ark/tree/b561e95d20d6bd0e75cdc08e762e881628b110f7).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [lists-and-tables — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
