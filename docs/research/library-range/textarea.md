# Textarea — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Accepts multiple lines of text. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211).

Boundary: Native textarea; outline/soft, sm/md/lg, all four resize policies, fullWidth, readonly/disabled and validation. Rows own height. No autosize or character counter API in the spec. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1).

## Variant axes

- **Untitled UI** (component): state: disabled, invalid. [Source](https://www.untitledui.com/react/components/textareas) (checked 2026-09-28).
- **shadcn/ui** (component): state: disabled, invalid. [Source](https://ui.shadcn.com/docs/components/textarea) (checked 2026-09-28).
- **Radix Themes** (component): variant: surface, classic, soft; size: 1, 2, 3; radius: none, small, medium, large, full; resize: none, vertical, horizontal, both. [Source](https://www.radix-ui.com/themes/docs/components/text-area) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L, XL; label-position: top, side; state: disabled, read-only. [Source](https://react-spectrum.adobe.com/TextArea) (checked 2026-09-28).
- **Fluent 2** (component): resize: none, vertical, horizontal, both. [Source](https://fluent2.microsoft.design/components/web/react/core/textarea/usage) (checked 2026-09-28).
- **Carbon** (component): style: default, fluid; state: disabled, read-only, error, warning. [Source](https://carbondesignsystem.com/components/text-input/usage/) (checked 2026-09-28).
- **Material 3** (component): variant: filled, outlined. [Source](https://developer.android.com/develop/ui/compose/text/user-input) (checked 2026-09-28).
- **Mantine** (component): variant: default, filled, unstyled; size: xs, sm, md, lg, xl; resize: none, vertical, both; state: disabled, error, loading. [Source](https://mantine.dev/core/textarea) (checked 2026-09-28).
- **Ant Design** (component): variant: outlined, borderless, filled, underlined; state: disabled, error, warning. [Source](https://ant.design/components/input) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: outline, subtle, flushed; size: xs, sm, md, lg, xl; resize: none, vertical, horizontal, both. [Source](https://chakra-ui.com/docs/components/textarea) (checked 2026-09-28).
- **Atlassian** (component): appearance: standard, subtle, none; resize: auto, vertical, horizontal, smart. [Source](https://atlassian.design/components/textarea/examples) (checked 2026-09-28).
- **Polaris** (component): label-visibility: visible, exclusive; state: disabled, read-only, error. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area) (checked 2026-09-28).
- **GOV.UK** (component): state: error, disabled. [Source](https://design-system.service.gov.uk/components/textarea/) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): label, description, helper-error. [Source](https://www.untitledui.com/react/components/textareas) (checked 2026-09-28).
- **shadcn/ui** (component): label, description. [Source](https://ui.shadcn.com/docs/components/textarea) (checked 2026-09-28).
- **Radix Themes** (component): placeholder. [Source](https://www.radix-ui.com/themes/docs/components/text-area) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): label, description, contextual-help. [Source](https://react-spectrum.adobe.com/TextArea) (checked 2026-09-28).
- **Fluent 2** (component): label, placeholder. [Source](https://fluent2.microsoft.design/components/web/react/core/textarea/usage) (checked 2026-09-28).
- **Primer** (component): label, description. [Source](https://primer.style/product/components/textarea/) (checked 2026-09-28).
- **Carbon** (component): label-above, label-inside, helper-error, character-count, ai-label. [Source](https://carbondesignsystem.com/components/text-input/usage/) (checked 2026-09-28).
- **Material 3** (component): label, placeholder. [Source](https://developer.android.com/develop/ui/compose/text/user-input) (checked 2026-09-28).
- **Mantine** (component): label, description, left-right-sections. [Source](https://mantine.dev/core/textarea) (checked 2026-09-28).
- **Ant Design** (component): character-count, clear-button. [Source](https://ant.design/components/input) (checked 2026-09-28).
- **Chakra/Ark** (component): label, description. [Source](https://chakra-ui.com/docs/components/textarea) (checked 2026-09-28).
- **Atlassian** (component): label. [Source](https://atlassian.design/components/textarea/examples) (checked 2026-09-28).
- **Polaris** (component): label, description. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area) (checked 2026-09-28).
- **GOV.UK** (component): label, description. [Source](https://design-system.service.gov.uk/components/textarea/) (checked 2026-09-28).
- **GOV.UK** (component): character-count, word-count. [Source](https://design-system.service.gov.uk/components/character-count/) (checked 2026-09-28).
- **Apple HIG** (guidance): multiline-text. [Source](https://developer.apple.com/design/human-interface-guidelines/text-views) (checked 2026-09-28).

## Interaction patterns

- **native-editing**: [Radix Themes](https://www.radix-ui.com/themes/docs/components/text-area), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TextArea), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/textarea/usage), [Primer](https://primer.style/product/components/textarea/), [Carbon](https://carbondesignsystem.com/components/text-input/usage/), [Mantine](https://mantine.dev/core/textarea), [Ant Design](https://ant.design/components/input), [Chakra/Ark](https://chakra-ui.com/docs/components/textarea), [Atlassian](https://atlassian.design/components/textarea/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area), [GOV.UK](https://design-system.service.gov.uk/components/textarea/), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/text-views), [Material 3](https://developer.android.com/develop/ui/compose/text/user-input) (checked 2026-09-28).
- **validation**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/TextArea) (checked 2026-09-28).
- **autosize**: [Mantine](https://mantine.dev/core/textarea), [Ant Design](https://ant.design/components/input), [Chakra/Ark](https://chakra-ui.com/docs/components/textarea), [Atlassian](https://atlassian.design/components/textarea/examples) (checked 2026-09-28).
- **min-max-rows**: [Mantine](https://mantine.dev/core/textarea), [Ant Design](https://ant.design/components/input), [Material 3](https://developer.android.com/develop/ui/compose/text/user-input) (checked 2026-09-28).
- **rows**: [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area), [GOV.UK](https://design-system.service.gov.uk/components/textarea/) (checked 2026-09-28).
- **max-length**: [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area) (checked 2026-09-28).
- **limit-announcement**: [GOV.UK](https://design-system.service.gov.uk/components/character-count/) (checked 2026-09-28).
- **selection**: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/text-views) (checked 2026-09-28).
- **scrolling**: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/text-views) (checked 2026-09-28).

## Area today

Native textarea; outline/soft, sm/md/lg, all four resize policies, fullWidth, readonly/disabled and validation. Rows own height. No autosize or character counter API in the spec. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1).

- Exact manifest axes: variant = outline, soft; size = sm, md, lg; resize = vertical, horizontal, both, none. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211).
- Boolean modifiers: full-width. Runtime state hooks: invalid, success, warning, disabled, read-only. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211).
- Slots: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:max-length`, `interaction:native-editing`, `interaction:rows`, `resize:both`, `resize:horizontal`, `resize:none`, `resize:vertical`, `size:lg`, `size:md`, `size:sm`, `state:disabled`, `state:invalid`, `state:read-only`, `state:warning`, `structure:placeholder`, `variant:outline`, `variant:soft`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1-L147).
- **composition**: `interaction:validation`, `structure:description`, `structure:helper-error`, `structure:label`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1-L147).
- **equivalent concept / source styling differs**: `variant:filled`, `variant:outlined`, `variant:subtle`, `variant:surface`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1-L147).
- **not found**: `appearance:none`, `appearance:standard`, `appearance:subtle`, `interaction:autosize`, `interaction:limit-announcement`, `interaction:min-max-rows`, `interaction:scrolling`, `interaction:selection`, `label-position:side`, `label-position:top`, `label-visibility:exclusive`, `label-visibility:visible`, `resize:auto`, `resize:smart`, `size:XL`, `size:xl`, `size:xs`, `state:error`, `state:loading`, `structure:ai-label`, `structure:character-count`, `structure:clear-button`, `structure:contextual-help`, `structure:label-above`, `structure:label-inside`, `structure:left-right-sections`, `structure:multiline-text`, `structure:word-count`, `style:default`, `style:fluid`, `variant:borderless`, `variant:classic`, `variant:default`, `variant:flushed`, `variant:underlined`, `variant:unstyled`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1-L147).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:L`, `size:M`, `size:S`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1-L147).
- **system-level / not this exact option**: `radius:full`, `radius:large`, `radius:medium`, `radius:none`, `radius:small`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1-L147).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 5 direct systems. Direct: Atlassian, Chakra/Ark, Fluent 2, Mantine, Radix Themes. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1).
  - Individual options: `variant:outline` (1 direct; Area: yes); `variant:soft` (1 direct; Area: yes); `size:sm` (2 direct; Area: yes); `size:md` (2 direct; Area: yes); `size:lg` (2 direct; Area: yes); `resize:vertical` (5 direct; Area: yes); `resize:horizontal` (4 direct; Area: yes); `resize:both` (4 direct; Area: yes); `resize:none` (4 direct; Area: yes).
- **Layer 3 · Outline/soft plus underlined or borderless** — 3 direct systems. Direct: Ant Design, Chakra/Ark, Mantine. Choose field-wide treatment semantics rather than isolated textarea paint. Evidence: [1](https://ant.design/components/input), [2](https://chakra-ui.com/docs/components/textarea), [3](https://mantine.dev/core/textarea).
  - Individual options: `variant:flushed` (1 direct; Area: not found); `variant:underlined` (1 direct; Area: not found); `variant:borderless` (1 direct; Area: not found); `variant:unstyled` (1 direct; Area: not found).
- **Layer 3 · Autosizing with bounded rows** — 5 direct systems. Direct: Ant Design, Atlassian, Chakra/Ark, Mantine, Material 3. A behavior/anatomy option independent of text-size tier. Evidence: [1](https://ant.design/components/input), [2](https://atlassian.design/components/textarea/examples), [3](https://chakra-ui.com/docs/components/textarea), [4](https://developer.android.com/develop/ui/compose/text/user-input), [5](https://mantine.dev/core/textarea).
  - Individual options: `interaction:autosize` (4 direct; Area: not found); `interaction:min-max-rows` (3 direct; Area: not found).
- **Layer 3 · Character/word count and clear action** — 3 direct systems. Direct: Ant Design, Carbon, GOV.UK. Compose with Field, include limit announcements, and keep native editing intact. Evidence: [1](https://ant.design/components/input), [2](https://carbondesignsystem.com/components/text-input/usage/), [3](https://design-system.service.gov.uk/components/character-count/).
  - Individual options: `structure:character-count` (3 direct; Area: not found); `structure:word-count` (1 direct; Area: not found); `structure:clear-button` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 198–211](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L198-L211); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/textarea.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: textarea, text area, multiline text field, text view. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/textareas); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/textarea); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/text-area); checked 2026-09-28.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for textarea, text area, multiline text field, text view. No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/TextArea); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/textarea/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/textarea/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/text-input/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/text/user-input); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/textarea); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/input); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/textarea); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/textarea/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/text-area); checked 2026-09-28.
- **GOV.UK**: [source 1](https://design-system.service.gov.uk/components/character-count/), [source 2](https://design-system.service.gov.uk/components/textarea/); checked 2026-09-28.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/text-views); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/text-views.json). Platform guidance is counted separately.
