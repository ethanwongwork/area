# Resizable / Splitter

## Job

Resize adjacent regions using a shared boundary.

Observed family coverage: **6 / 15 implementation systems** (6 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Extend Panel resizing into a multi-region container with min/max and collapse constraints.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **disabled**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter)).
- **keyboardResizeBy**: `number` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter)).
- **lineSize**: `number | string` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L91)).
- **setSize**: `UseResize['setSize']` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L113)).
- **size**: `SplitterPaneSize[]` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L67)); `number | string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L66)); `PanelSize[]` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter)).

</details>

## Structural alternatives

- **Horizontal/vertical and multiple panes** — 3 observed implementation systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter), [Mantine](https://mantine.dev/core/splitter/), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/resizable.mdx#L92).
- **Keyboard resize trigger and indicator** — 1 observed implementation systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/splitter.mdx#L63).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Composition** — 2 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/resizable.mdx#L81), [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **Vertical** — 2 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/resizable.mdx#L92), [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **2025-02-02 react-resizable-panels v4** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/resizable.mdx#L116).
- **SplitPageLayout.Header** — 1 system(s): [Primer](https://primer.style/product/components/split-page-layout/).
- **SplitPageLayout.Footer** — 1 system(s): [Primer](https://primer.style/product/components/split-page-layout/).
- **Vertical orientation** — 1 system(s): [Mantine](https://mantine.dev/core/splitter/).
- **Multiple panes** — 1 system(s): [Mantine](https://mantine.dev/core/splitter/).
- **Nested splitters** — 1 system(s): [Mantine](https://mantine.dev/core/splitter/).
- **Without handle** — 1 system(s): [Mantine](https://mantine.dev/core/splitter/).
- **Wrap Splitter.Pane** — 1 system(s): [Mantine](https://mantine.dev/core/splitter/).
- **Panel** — 2 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L62), [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **Collapsible Panels** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **Multiple Panels** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **Nested** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/splitter.mdx#L76).
- **Responsive Orientation** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **Nested Panels** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **Disabled Resize** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).
- **Dynamic Panels** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **collapsible**: `{ motion?: boolean; icon?: { start?: React.ReactNode; end?: React.ReactNode; }; }` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L27-L33)).
- **collapsibleIcon**: `{ start?: React.ReactNode; end?: React.ReactNode; }` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L49-L52)).
- **draggerIcon**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L45)).
- **end**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L51)).
- **handleIcon**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L97)).
- **icon**: `{ start?: React.ReactNode; end?: React.ReactNode; }` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L29-L32)).
- **orientation**: `horizontal` — 4 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Resizer/Resizer.tsx#L25), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L64), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L54), [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter)); `vertical` — 4 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Resizer/Resizer.tsx#L25), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L64), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L54), [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter)); `Orientation` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L42)).
- **start**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L50)).

</details>

## Interaction patterns

Ark documents keyboard resize, collapse and resize indicators. Mantine supports multiple panes; shadcn delegates to react-resizable-panels.

Evidence: [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/splitter.mdx#L1-L95), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L1-L267), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/resizable.mdx#L1-L136).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **collapsible**: `auto` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L66)).
- **destroyOnHidden**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L72)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L72)).
- **end**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L69)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L69)).
- **lazy**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L58)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L58)).
- **motion**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L28)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L28)).
- **redistribute**: `nearest` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L82)); `equal` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L82)).
- **resetOnDoubleClick**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L103)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L103)).
- **resizable**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L70)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L70)).
- **reverse**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L112)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L112)).
- **start**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L69)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L69)).
- **vertical**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L43)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/interface.ts#L43)).
- **withHandle**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L100)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L100)).
- **~~layout~~**: `horizontal` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L51)); `vertical` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L51)).

</details>

## Reuses in Area

[Panel](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Extend Panel resizing into a multi-region container with min/max and collapse constraints.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Controlled sizes with collapse bounds**: 3 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter), [Mantine](https://mantine.dev/core/splitter/), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L47).
- **Layer 3 — Horizontal/vertical and multiple panes**: 3 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter), [Mantine](https://mantine.dev/core/splitter/), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/resizable.mdx#L92).
- **Layer 3 — Keyboard resize trigger and indicator**: 1 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/splitter), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/splitter.mdx#L63).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Resizable / Splitter`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: [resizable — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/resizable.mdx#L1-L136).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [split-page-layout — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/SplitPageLayout/SplitPageLayout.tsx#L1-L147).
- **Carbon**: [Resizer — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/Resizer/Resizer.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [Splitter — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/Splitter/Splitter.tsx#L1-L267).
- **Ant Design**: [splitter — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/splitter/index.en-US.md#L1-L80).
- **Chakra/Ark**: [splitter — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/splitter.mdx#L1-L95).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [split-views — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/split-views).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
