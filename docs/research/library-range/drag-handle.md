# Drag / reorder handles

## Job

Expose reordering as an explicit action with a visible insertion target.

Observed family coverage: **3 / 15 implementation systems** (2 with a component source; 1 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Reuse PropertyList for local reorder; adopt an adapter for cross-list or tree movement.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

Dedicated variant enums: **not found** in the reviewed family sources. Reuse the composing Area families; do not invent a size/tone matrix from analogues.

## Structural alternatives

- **Drag affordance with insertion indicator** — 2 observed implementation systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/dnd.mdx#L313), [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Move-menu alternative and live feedback** — 2 observed implementation systems. [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/dnd.mdx#L19).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Drop positions** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/dnd.mdx#L313).
- **Multiple positions** — 1 system(s): [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/dnd.mdx#L585).
- **Images** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Composition** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Drag handle icons** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Cards** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Multiple-item drag previews** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Nested structures** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Prefer visible drag handle icons** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Action menus for move actions** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Drag handle icon menus for move actions** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Accessible actions** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Dragging multiple items** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Cards and boards** — 1 system(s): [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).

</details>

## Interaction patterns

React Aria documents keyboard drag/drop. Atlassian recommends accessible move menus, announcements and focus restoration as an alternative to pointer dragging.

Evidence: [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/dnd.mdx#L1-L300), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/pragmatic-drag-and-drop/documentation/README.md#lines-1:3).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

## Reuses in Area

[PropertyList](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L426), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Reuse PropertyList for local reorder; adopt an adapter for cross-list or tree movement.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Drag affordance with insertion indicator**: 2 observed systems. [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/dnd.mdx#L313), [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines).
- **Layer 3 — Move-menu alternative and live feedback**: 2 observed systems. [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/dnd.mdx#L19).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Drag / reorder handles`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: [dnd — component](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/s2/dnd.mdx#L1-L300).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [drag-and-drop — internal](https://primer.style/product/internal-components/drag-and-drop/).
- **Carbon**: [DataTable — analogue](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/DataTable/DataTable.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: **not found** for this job in the reviewed [catalogue](https://mantine.dev/core/package/) and [pinned source inventory](https://github.com/mantinedev/mantine/tree/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4).
- **Ant Design**: [table — analogue](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/table/index.en-US.md#L1-L300).
- **Chakra/Ark**: [rich-text-editor — recipe](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Atlassian**: [pragmatic-drag-and-drop — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/pragmatic-drag-and-drop/documentation/README.md#lines-1:3).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [drag-and-drop — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/drag-and-drop).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
