# Image / media preview

## Job

Inspect an image or playable media with preview controls.

Observed family coverage: **3 / 15 implementation systems** (3 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Compose Dialog for images and delegate media playback to an adapter.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **appearance**: `DownloadButtonProps['appearance']` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/media/media-viewer/src/DownloadItemProps.tsx#lines-13)).
- **open**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L126)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L126)).

</details>

## Structural alternatives

- **Image preview with transform toolbar** — 1 observed implementation systems. [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L113).
- **Video playback surface** — 1 observed implementation systems. [Untitled UI](https://www.untitledui.com/react/components/video-players).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Image** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L41).
- **ImageProgressConfig** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L64).
- **PreviewGroup** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L100).
- **PreviewGroupType** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L109).
- **TransformAction** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L153).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **wrapperStyle**: `React.CSSProperties` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.tsx#L110)).

</details>

## Interaction patterns

Ant Image exposes preview transforms and toolbar customization. Untitled UI supplies video-player layouts; Atlassian's viewer is a separate media integration.

Evidence: [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L1-L229), [Untitled UI](https://www.untitledui.com/react/components/video-players), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/media/media-viewer/docs/0-intro.tsx#lines-1:21).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **focusTrap**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L116)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L116)).
- **movable**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L125)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L125)).
- **wheel**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L129)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L129)).
- **~~destroyOnClose~~**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L79)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L79)).
- **~~forceRender~~**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L118)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L118)).
- **~~visible~~**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L132)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L132)).

</details>

## Reuses in Area

[Dialog](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L532), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Compose Dialog for images and delegate media playback to an adapter.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Image preview with transform toolbar**: 1 observed systems. [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L113).
- **Layer 3 — Video playback surface**: 1 observed systems. [Untitled UI](https://www.untitledui.com/react/components/video-players).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Image / media preview`; aliases appear in the JSON coverage record.

- **Untitled UI**: [video-players — component](https://www.untitledui.com/react/components/video-players).
- **shadcn/ui**: **not found** for this job in the reviewed [catalogue](https://ui.shadcn.com/docs/components) and [pinned source inventory](https://github.com/shadcn-ui/ui/tree/db2db460a26fa84fb65c8d903b213925fbdee9ed).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: **not found** for this job in the reviewed [catalogue](https://fluent2.microsoft.design/components/web/react) and [pinned source inventory](https://github.com/microsoft/fluentui/tree/8add8c8750c34c85acd811e32ab324abf8f1562e).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: **not found** for this job in the reviewed [catalogue](https://m3.material.io/components) and [pinned source inventory](https://github.com/material-components/material-components-android/tree/60ff09436d5d477a4b9d02940f31eb01e1250620).
- **Mantine**: **not found** for this job in the reviewed [catalogue](https://mantine.dev/core/package/) and [pinned source inventory](https://github.com/mantinedev/mantine/tree/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4).
- **Ant Design**: [image — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/image/index.en-US.md#L1-L229).
- **Chakra/Ark**: **not found** for this job in the reviewed [catalogue](https://www.chakra-ui.com/docs/components/concepts/overview) and [pinned source inventory](https://github.com/chakra-ui/ark/tree/b561e95d20d6bd0e75cdc08e762e881628b110f7).
- **Atlassian**: [@media-viewer — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/media/media-viewer/docs/0-intro.tsx#lines-1:21).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [sheets — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/sheets).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
