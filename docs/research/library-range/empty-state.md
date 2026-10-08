# EmptyState

## Job

Explain why a collection or workflow has no content and offer the next action.

Observed family coverage: **8 / 15 implementation systems** (8 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Compose icon/illustration, title, description and actions; distinguish empty, filtered-empty and first-use content.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **EmptyStateVariant**: `filled` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/EmptyState/EmptyState.tsx#L51)); `light` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/EmptyState/EmptyState.tsx#L51)).
- **MantineSize**: `xs` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `sm` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `md` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `lg` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)); `xl` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts#L159)).
- **isLoading**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/empty-state/src/types.tsx#lines-71)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/empty-state/src/types.tsx#lines-71)).
- **patternSize**: `sm` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/empty-state/empty-state.tsx#L64)); `md` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/empty-state/empty-state.tsx#L64)); `lg` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/empty-state/empty-state.tsx#L64)).
- **size**: `small` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L33)); `medium` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L33)); `large` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L33)); `sm` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/empty-state)); `md` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/empty-state)); `lg` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/empty-state)).
- **variant**: `default` — 1 system ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L186)); `icon` — 1 system ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L186)).

</details>

## Structural alternatives

- **Icon/illustration/avatar-led content** — 2 observed implementation systems. [Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/empty-state/empty-state.tsx#L327), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L121).
- **Primary/secondary recovery actions** — 2 observed implementation systems. [Primer](https://primer.style/product/components/blankslate/), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Empty state components** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Empty state example** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Empty states examples** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Featured icon** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Illustration** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **File icon** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Avatar radius** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Avatar row** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Avatar grid** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/empty-states).
- **Composition** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L78).
- **Outline** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L91).
- **Avatar** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L111).
- **Avatar Group** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L121).
- **InputGroup** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L131).
- **Empty** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L149).
- **EmptyHeader** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L164).
- **EmptyMedia** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L180).
- **EmptyTitle** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L204).
- **EmptyDescription** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L216).
- **EmptyContent** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L228).
- **With a secondary action** — 1 system(s): [Primer](https://primer.style/product/components/blankslate/).
- **With a border** — 1 system(s): [Primer](https://primer.style/product/components/blankslate/).
- **Blankslate.PrimaryAction** — 1 system(s): [Primer](https://primer.style/product/components/blankslate/).
- **Blankslate.SecondaryAction** — 1 system(s): [Primer](https://primer.style/product/components/blankslate/).
- **EmptyState** — 1 system(s): [Mantine](https://mantine.dev/core/empty-state/).
- **Built-in images** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/empty/index.en-US.md#L43).
- **Empty State** — 2 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/empty-state), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state).
- **Your cart is empty** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/empty-state).
- **Action** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/empty-state).
- **Anchor to Show an empty state inside a tableShow an empty state inside a table** — 1 system(s): [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **description**: `React.ReactNode` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/EmptyState/EmptyState.tsx#L81), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/empty/index.tsx#L46)); `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/empty-state/src/types.tsx#lines-30)).
- **icon**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/EmptyState/EmptyState.tsx#L84)).
- **image**: `React.ReactNode` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/empty/index.tsx#L45)).
- **primaryAction**: `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/empty-state/src/types.tsx#lines-51)).
- **secondaryAction**: `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/empty-state/src/types.tsx#lines-59)).
- **tertiaryAction**: `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/empty-state/src/types.tsx#lines-63)).
- **title**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/EmptyState/EmptyState.tsx#L78)).

</details>

## Interaction patterns

Untitled UI documents icon, illustration and avatar structures. Primer and Polaris provide primary/secondary actions; focus stays with the initiating workflow.

Evidence: [Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/empty-state/empty-state.tsx#L1-L300), [Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L1-L147), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **border**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L13)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L13)).
- **narrow**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L23)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L23)).
- **spacious**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L28)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L28)).

</details>

## Reuses in Area

[Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35), [Card](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L512). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Compose icon/illustration, title, description and actions; distinguish empty, filtered-empty and first-use content.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Icon/illustration/avatar-led content**: 2 observed systems. [Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/empty-state/empty-state.tsx#L327), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L121).
- **Layer 3 — Primary/secondary recovery actions**: 2 observed systems. [Primer](https://primer.style/product/components/blankslate/), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `EmptyState`; aliases appear in the JSON coverage record.

- **Untitled UI**: [empty-states — component](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/empty-state/empty-state.tsx#L1-L300).
- **shadcn/ui**: [empty — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/empty.mdx#L1-L240).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [blankslate — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/Blankslate/Blankslate.tsx#L1-L147).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [EmptyState — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/EmptyState/EmptyState.tsx#L1-L256).
- **Ant Design**: [empty — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/empty/index.en-US.md#L1-L76).
- **Chakra/Ark**: [empty-state — component](https://www.chakra-ui.com/docs/components/empty-state).
- **Atlassian**: [empty-state — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/empty-state/README.md#lines-1:15).
- **Polaris**: [empty-state — component](https://shopify.dev/docs/api/app-home/latest/web-components/feedback-and-status-indicators/empty-state).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [loading — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/loading).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
