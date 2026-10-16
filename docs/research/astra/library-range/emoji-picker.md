# EmojiPicker / IconPicker

## Job

Choose an emoji or icon from a searchable categorized collection.

Observed family coverage: **3 / 15 implementation systems** (1 with a component source; 2 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Build a searchable selection recipe; keep emoji-specific tone/recent data separate from generic icon selection.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **PickerSize**: `small` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/src/types.ts#lines-211)); `medium` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/src/types.ts#lines-211)); `large` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/src/types.ts#lines-211)).
- **colorPalette**: `gray` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `red` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `orange` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `yellow` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `green` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `teal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `blue` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `cyan` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `purple` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `pink` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **disabled**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **variant**: `subtle` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `solid` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `plain` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).

</details>

## Structural alternatives

- **Searchable picker or emoji grid** — 3 observed implementation systems. [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/docs/0-intro.tsx#lines-22), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/examples/emoji-picker.mdx#L20).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Disabled Item** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Multiple** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L59).
- **Grouping** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L65).
- **Horizontal** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Grid Layout** — 1 system(s): [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L85).
- **With Store** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Grouped** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Multiple Selection** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Checkmark** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Icon** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Description** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Input** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Popover** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **With Dialog** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Image Explorer** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Emoji Grid** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **ItemGroup** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **ItemGroupLabel** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox).
- **Images** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Composition** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/rich-text-editor).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **RelativePosition**: `above` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/src/types.ts#lines-209)); `below` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/src/types.ts#lines-209)); `auto` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/src/types.ts#lines-209)).
- **orientation**: `horizontal` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `vertical` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).

</details>

## Interaction patterns

Atlassian publishes emoji picker configuration and types. Chakra shows an emoji grid and editor insertion; Primer's autocomplete is internal evidence only.

Evidence: [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/docs/0-intro.tsx#lines-1:105), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L1-L155), [Primer](https://primer.style/product/internal-components/emoji-autocomplete/).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **autoHighlight**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **deselectable**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **disallowSelectAll**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **highlightOnHover**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **keyboardPriority**: `caret` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `navigate` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **loopFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **selectOnHighlight**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **selectionMode**: `SelectionMode` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).
- **typeahead**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox)).

</details>

## Reuses in Area

[Combobox](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L493), [Popover](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L540), [Tabs](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L584), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Build a searchable selection recipe; keep emoji-specific tone/recent data separate from generic icon selection.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Searchable picker or emoji grid**: 3 observed systems. [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/docs/0-intro.tsx#lines-22), [Chakra/Ark](https://www.chakra-ui.com/docs/components/listbox), [React Aria / Spectrum 2](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/examples/emoji-picker.mdx#L20).
- **Layer 2 — Picker sizing and emoji configuration**: 1 observed systems. [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/src/types.ts#lines-211).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `EmojiPicker / IconPicker`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: [@EmojiPickerExample — recipe](https://github.com/adobe/react-spectrum/blob/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783/packages/dev/s2-docs/pages/react-aria/examples/emoji-picker.mdx#L1-L82).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: [emoji-autocomplete — internal](https://primer.style/product/internal-components/emoji-autocomplete/).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: **not found** for this job in the reviewed [catalogue](https://mantine.dev/core/package/) and [pinned source inventory](https://github.com/mantinedev/mantine/tree/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4).
- **Ant Design**: **not found** for this job in the reviewed [catalogue](https://ant.design/components/overview/) and [pinned source inventory](https://github.com/ant-design/ant-design/tree/7ad64087106acd078dcc7d91a4adfdf38f5ce172).
- **Chakra/Ark**: [listbox — recipe](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/listbox.mdx#L1-L155); [rich-text-editor — recipe](https://www.chakra-ui.com/docs/components/rich-text-editor).
- **Atlassian**: [@emoji — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/elements/emoji/docs/0-intro.tsx#lines-1:105).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [pickers — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/pickers).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
