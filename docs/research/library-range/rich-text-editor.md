# Rich text editor integration

## Job

Edit structured prose using a mature document model.

Observed family coverage: **4 / 15 implementation systems** (4 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Provide an adapter plus Area toolbar/menu skins; avoid a superficial contenteditable implementation.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **isExpanded**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/src/CollapsedEditor/index.tsx#lines-18)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/src/CollapsedEditor/index.tsx#lines-18)).
- **selected**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/src/nodeviews/types.ts#lines-4)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/src/nodeviews/types.ts#lines-4)).

</details>

## Structural alternatives

- **Persistent or selection toolbar** — 2 observed implementation systems. [Untitled UI](https://www.untitledui.com/react/components/text-editors), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Mentions/emoji/slash-command extensions** — 1 observed implementation systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **With tooltip** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/text-editors).
- **Images** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Composition** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Presets and Configuration** — 1 system(s): [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/README.md#lines-17).
- **Inline comments** — 1 system(s): [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/docs/4-annotations.tsx#lines-243).
- **Multiple annotations** — 1 system(s): [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/docs/4-annotations.tsx#lines-349).

</details>

## Interaction patterns

Chakra documents Tiptap integration, bubble menus, mentions and slash commands. Atlassian publishes an editor model and annotation APIs; define serialization and undo boundaries per adapter.

Evidence: [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/README.md#lines-1:61).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **withCodeHighlightStyles**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/tiptap/src/RichTextEditor.tsx#L78)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/tiptap/src/RichTextEditor.tsx#L78)).
- **withTypographyStyles**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/tiptap/src/RichTextEditor.tsx#L81)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/tiptap/src/RichTextEditor.tsx#L81)).

</details>

## Reuses in Area

[Toolbar](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L76), [Menu](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L549), [Popover](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L540). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Provide an adapter plus Area toolbar/menu skins; avoid a superficial contenteditable implementation.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Persistent or selection toolbar**: 2 observed systems. [Untitled UI](https://www.untitledui.com/react/components/text-editors), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Layer 3 — Mentions/emoji/slash-command extensions**: 1 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor), [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Rich text editor integration`; aliases appear in the JSON coverage record.

- **Untitled UI**: [text-editors — component](https://www.untitledui.com/react/components/text-editors).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [markdown-editor — internal](https://primer.style/product/internal-components/markdown-editor/).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [@RichTextEditor — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/tiptap/src/RichTextEditor.tsx#L1-L300).
- **Ant Design**: **not found** for this job in the reviewed [catalogue](https://ant.design/components/overview/) and [pinned source inventory](https://github.com/ant-design/ant-design/tree/7ad64087106acd078dcc7d91a4adfdf38f5ce172).
- **Chakra/Ark**: [rich-text-editor — component](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Atlassian**: [@editor-core — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/editor/editor-core/README.md#lines-1:61).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [text-fields — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/text-fields).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
