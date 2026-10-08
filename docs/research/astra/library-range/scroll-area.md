# ScrollArea

## Job

Keep overflowing content scrollable with optional custom scrollbar presentation.

Observed family coverage: **6 / 15 implementation systems** (6 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Retain native scrolling semantics and opt into custom bars only where needed.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)).
- **hasThumb**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.types.ts#L12)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.types.ts#L12)).
- **scrollbarSize**: `number | string` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L39)).
- **size**: `1` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/scroll-area.props.tsx#L6)); `2` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/scroll-area.props.tsx#L6)); `3` — 1 system ([Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/scroll-area.props.tsx#L6)); `Sizes` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.types.ts#L13)); `xs` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)).
- **variant**: `hover` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)); `always` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)).

</details>

## Structural alternatives

- **Horizontal/vertical/both axes** — 3 observed implementation systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L39), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/scroll-area.mdx#L80), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/scroll-area.mdx#L47).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Composition** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/scroll-area.mdx#L71).
- **Horizontal** — 2 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/scroll-area.mdx#L80), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/scroll-area.mdx#L47).
- **Combining with Tabs** — 1 system(s): [Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/scroll-area/page.mdx#L79).
- **Horizontal scrollbars** — 1 system(s): [Mantine](https://mantine.dev/core/scroll-area/).
- **Disable horizontal scrollbars** — 1 system(s): [Mantine](https://mantine.dev/core/scroll-area/).
- **Vertical scrollbar position** — 1 system(s): [Mantine](https://mantine.dev/core/scroll-area/).
- **Subscribe to scroll position changes** — 1 system(s): [Mantine](https://mantine.dev/core/scroll-area/).
- **Scroll to position** — 2 system(s): [Mantine](https://mantine.dev/core/scroll-area/), [Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area).
- **Start scroll position** — 1 system(s): [Mantine](https://mantine.dev/core/scroll-area/).
- **ScrollArea.Autosize with Popover** — 1 system(s): [Mantine](https://mantine.dev/core/scroll-area/).
- **Nested** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/scroll-area.mdx#L59).
- **Horizontal Scrolling** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area).
- **With Menu** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **orientation**: `vertical` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/scroll-area/scrollbar/ScrollAreaScrollbar.tsx#L262)); `horizontal` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/scroll-area/scrollbar/ScrollAreaScrollbar.tsx#L262)); `Orientation` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area)).
- **startScrollPosition**: `{ x?: number; y?: number }` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L102)).
- **verticalScrollbarPosition**: `left` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L108)); `right` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L108)).

</details>

## Interaction patterns

Mantine documents axis selection and controlled scroll position. Ark documents keyboard behavior and hover/always visibility; Apple provides platform scroll conventions.

Evidence: [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L1-L300), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/scroll-area.mdx#L1-L73), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/scroll-views).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **keepMounted**: `false` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/scroll-area/scrollbar/ScrollAreaScrollbar.tsx#L267)); `true` — 1 system ([Base UI](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/packages/react/src/scroll-area/scrollbar/ScrollAreaScrollbar.tsx#L267)).
- **offsetScrollbars**: `x` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L73)); `y` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L73)); `present` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L73)).
- **scrollbars**: `x` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L63)); `y` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L63)); `xy` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L63)).
- **type**: `auto` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L50)); `always` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L50)); `scroll` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L50)); `hover` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L50)); `never` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L50)).

</details>

## Reuses in Area

[Panel](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Retain native scrolling semantics and opt into custom bars only where needed.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Always/hover/automatic scrollbar presentation**: 3 observed systems. [Radix Themes](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/scroll-area.props.tsx#L15), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L50), [Chakra/Ark](https://www.chakra-ui.com/docs/components/scroll-area).
- **Layer 3 — Horizontal/vertical/both axes**: 3 observed systems. [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L39), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/scroll-area.mdx#L80), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/scroll-area.mdx#L47).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `ScrollArea`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: [scroll-area — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/scroll-area.mdx#L1-L99).
- **Radix Themes**: [scroll-area — component](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/components/scroll-area.props.tsx#L1-L19).
- **Base UI**: [scroll-area — component](https://github.com/mui/base-ui/blob/62b54e8c944784c4de992eb424286b77cea4415a/docs/src/app/%28docs%29/react/components/scroll-area/page.mdx#L1-L142).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [@ScrollableRegion — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/ScrollableRegion/ScrollableRegion.tsx#L1-L50).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [ScrollArea — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/ScrollArea/ScrollArea.tsx#L1-L300).
- **Ant Design**: **not found** for this job in the reviewed [catalogue](https://ant.design/components/overview/) and [pinned source inventory](https://github.com/ant-design/ant-design/tree/7ad64087106acd078dcc7d91a4adfdf38f5ce172).
- **Chakra/Ark**: [scroll-area — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/scroll-area.mdx#L1-L73).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [scroll-views — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/scroll-views).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
