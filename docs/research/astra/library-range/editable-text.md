# Editable text / InlineEditableTitle

## Job

Switch a displayed value into an editor and commit or cancel it.

Observed family coverage: **4 / 15 implementation systems** (4 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Share one primitive between inline body text and InlineEditableTitle; support single-line and multiline editors.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **Size**: `sm` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L28), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `md` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L28), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `lg` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L28), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **autoResize**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **autoSize**: `boolean | { minRows: number, maxRows: number }` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L148)).
- **disabled**: `false` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L87), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `true` — 2 systems ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L87), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **expanded**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L187)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L187)).
- **invalid**: `false` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L74), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `true` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L74), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **isCompact**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-111)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-111)).
- **isEditing**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-92)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-92)).
- **isRequired**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-46)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-46)).
- **readOnly**: `false` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L106), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `true` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L106), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **size**: `Size` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L122)).

</details>

## Structural alternatives

- **Explicit confirm/cancel controls** — 2 observed implementation systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-42).
- **Multiline editor** — 2 observed implementation systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L148).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **actions** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L98).
- **editable** — 2 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L128), [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable).
- **Disabled** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable).
- **With Controls** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **AlignPropType**: `top` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)); `top-left` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)); `top-right` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)); `bottom` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)); `bottom-left` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)); `bottom-right` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)); `left` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)); `right` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L29-L37)).
- **label**: `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-26)).
- **placement**: `start` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L106)); `end` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L106)).
- **rows**: `number` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L188)).
- **toggleTipAlignment**: `AlignPropType` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L126)).
- **tooltipAlignment**: `AlignPropType | Shape` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L132)).

</details>

## Interaction patterns

Chakra/Ark documents activation and submit modes. Atlassian exposes explicit save/cancel controls and whether editing survives blur; these are separate choices.

Evidence: [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/editable.mdx#L1-L123), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/README.md#lines-1:12).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **activationMode**: `ActivationMode` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **code**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L84)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L84)).
- **delete**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L86)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L86)).
- **edit**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **editAlwaysVisible**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L54)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L54)).
- **editing**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L149)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L149)).
- **ellipsis**: `expandable` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L48)); `rows` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L48)); `onExpand` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L48)).
- **expandable**: `collapsible` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L186)).
- **format**: `text/plain` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L121)); `text/html` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L121)).
- **hideActionButtons**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-42)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-42)).
- **inheritTypography**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L70)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L70)).
- **italic**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L90)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L90)).
- **keepEditViewOpenOnBlur**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-37)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-37)).
- **keyboard**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L50)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L50)).
- **mark**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L91)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L91)).
- **readViewFitContainerWidth**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-51)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-51)).
- **required**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **selectOnFocus**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **startWithEditViewOpen**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-70)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-70)).
- **strong**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L92)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L92)).
- **submitMode**: `SubmitMode` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/editable)).
- **triggerType**: `Array&lt;icon|text&gt;` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L156)).

</details>

## Reuses in Area

[Input](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L143), [Field](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L133), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Share one primitive between inline body text and InlineEditableTitle; support single-line and multiline editors.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Activation and submit policy**: 3 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-37), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L156).
- **Layer 3 — Explicit confirm/cancel controls**: 2 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/src/types.tsx#lines-42).
- **Layer 3 — Multiline editor**: 2 observed systems. [Chakra/Ark](https://www.chakra-ui.com/docs/components/editable), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L148).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Editable text / InlineEditableTitle`; aliases appear in the JSON coverage record.

- **Untitled UI**: **not found** for this job in the reviewed [catalogue](https://www.untitledui.com/react/components) and [pinned source inventory](https://github.com/untitleduico/react/tree/4702dc0ea8d140c3491a85670c7b4fab47b722da).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: [EditInPlace — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/EditInPlace/EditInPlace.tsx#L1-L300).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: [TextInput — analogue](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/TextInput/TextInput.tsx#L1-L30).
- **Ant Design**: [typography — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/typography/index.en-US.md#L1-L202).
- **Chakra/Ark**: [editable — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/editable.mdx#L1-L123).
- **Atlassian**: [inline-edit — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/inline-edit/README.md#lines-1:12).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [text-fields — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/text-fields).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
