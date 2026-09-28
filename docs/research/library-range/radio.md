# Radio — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Picks one option from a mutually exclusive set. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249).

Boundary: Native radio inputs and fieldset group; sm/md/lg and neutral/accent; vertical/horizontal layout and descriptions. No Radio choice-card treatment is declared (Checkbox card is a different family). [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1).

## Variant axes

- **Untitled UI** (component): state: disabled, checked. [Source](https://www.untitledui.com/react/components/radio-buttons) (checked 2026-09-28).
- **shadcn/ui** (component): state: disabled, invalid. [Source](https://ui.shadcn.com/docs/components/radio-group) (checked 2026-09-28).
- **Radix Themes** (component): variant: surface, classic, soft; size: 1, 2, 3; contrast: normal, high; state: disabled. [Source](https://www.radix-ui.com/themes/docs/components/radio-group) (checked 2026-09-28).
- **Radix Themes** (component): variant: surface, classic; size: 1, 2, 3. [Source](https://www.radix-ui.com/themes/docs/components/radio-cards) (checked 2026-09-28).
- **Base UI** (component): state: disabled, read-only. [Source](https://base-ui.com/react/components/radio-group) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L, XL; orientation: horizontal, vertical; emphasis: default, emphasized; state: disabled, read-only. [Source](https://react-spectrum.adobe.com/RadioGroup) (checked 2026-09-28).
- **Fluent 2** (component): orientation: horizontal, vertical. [Source](https://fluent2.microsoft.design/components/web/react/core/radiogroup/usage) (checked 2026-09-28).
- **Carbon** (component): orientation: horizontal, vertical; state: disabled, read-only, invalid, warning. [Source](https://carbondesignsystem.com/components/radio-button/usage/) (checked 2026-09-28).
- **Material 3** (component): state: checked, disabled. [Source](https://developer.android.com/develop/ui/compose/components/radio-button) (checked 2026-09-28).
- **Mantine** (component): variant: filled, outline; size: xs, sm, md, lg, xl; state: disabled, error. [Source](https://mantine.dev/core/radio) (checked 2026-09-28).
- **Ant Design** (component): size: small, medium, large; option-type: default, button; button-style: outline, solid; state: disabled. [Source](https://ant.design/components/radio) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: outline, subtle, solid; size: xs, sm, md, lg; orientation: horizontal, vertical; state: disabled, read-only, invalid. [Source](https://chakra-ui.com/docs/components/radio) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: surface, subtle, outline, solid; size: sm, md, lg; orientation: horizontal, vertical; indicator-placement: start, end, inside. [Source](https://chakra-ui.com/docs/components/radio-card) (checked 2026-09-28).
- **Atlassian** (component): state: disabled, invalid. [Source](https://atlassian.design/components/radio/examples) (checked 2026-09-28).
- **Polaris** (component): state: disabled, error. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list) (checked 2026-09-28).
- **GOV.UK** (component): size: default, small; orientation: vertical, horizontal; state: error, disabled. [Source](https://design-system.service.gov.uk/components/radios/) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): label, description. [Source](https://www.untitledui.com/react/components/radio-buttons) (checked 2026-09-28).
- **Untitled UI** (example): choice-cards, icons, rich-options. [Source](https://www.untitledui.com/react/components/radio-groups) (checked 2026-09-28).
- **shadcn/ui** (component): label, description, choice-cards. [Source](https://ui.shadcn.com/docs/components/radio-group) (checked 2026-09-28).
- **Radix Themes** (component): label. [Source](https://www.radix-ui.com/themes/docs/components/radio-group) (checked 2026-09-28).
- **Radix Themes** (component): choice-cards, rich-options. [Source](https://www.radix-ui.com/themes/docs/components/radio-cards) (checked 2026-09-28).
- **Base UI** (component): label. [Source](https://base-ui.com/react/components/radio-group) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): label, description, contextual-help. [Source](https://react-spectrum.adobe.com/RadioGroup) (checked 2026-09-28).
- **Fluent 2** (component): label-beside, label-below. [Source](https://fluent2.microsoft.design/components/web/react/core/radiogroup/usage) (checked 2026-09-28).
- **Primer** (component): label, description. [Source](https://primer.style/product/components/radio-group/) (checked 2026-09-28).
- **Carbon** (component): label, helper-error, ai-label. [Source](https://carbondesignsystem.com/components/radio-button/usage/) (checked 2026-09-28).
- **Material 3** (component): label. [Source](https://developer.android.com/develop/ui/compose/components/radio-button) (checked 2026-09-28).
- **Mantine** (component): label, description, choice-cards. [Source](https://mantine.dev/core/radio) (checked 2026-09-28).
- **Ant Design** (component): label, button-options. [Source](https://ant.design/components/radio) (checked 2026-09-28).
- **Chakra/Ark** (component): label, description. [Source](https://chakra-ui.com/docs/components/radio) (checked 2026-09-28).
- **Chakra/Ark** (component): choice-cards, rich-options, hide-indicator. [Source](https://chakra-ui.com/docs/components/radio-card) (checked 2026-09-28).
- **Atlassian** (component): label. [Source](https://atlassian.design/components/radio/examples) (checked 2026-09-28).
- **Polaris** (component): label, description, conditional-content. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list) (checked 2026-09-28).
- **GOV.UK** (component): label, description, conditional-content, or-divider. [Source](https://design-system.service.gov.uk/components/radios/) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (component): single-selection. [Source](https://www.untitledui.com/react/components/radio-buttons) (checked 2026-09-28).
- **shadcn/ui** (component): single-selection. [Source](https://ui.shadcn.com/docs/components/radio-group) (checked 2026-09-28).
- **Radix Themes** (component): single-selection. [Source](https://www.radix-ui.com/themes/docs/components/radio-group) (checked 2026-09-28).
- **Radix Themes** (component): single-selection. [Source](https://www.radix-ui.com/themes/docs/components/radio-cards) (checked 2026-09-28).
- **Base UI** (component): single-selection. [Source](https://base-ui.com/react/components/radio-group) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): single-selection. [Source](https://react-spectrum.adobe.com/RadioGroup) (checked 2026-09-28).
- **Fluent 2** (component): single-selection. [Source](https://fluent2.microsoft.design/components/web/react/core/radiogroup/usage) (checked 2026-09-28).
- **Primer** (component): single-selection. [Source](https://primer.style/product/components/radio-group/) (checked 2026-09-28).
- **Carbon** (component): single-selection. [Source](https://carbondesignsystem.com/components/radio-button/usage/) (checked 2026-09-28).
- **Material 3** (component): single-selection. [Source](https://developer.android.com/develop/ui/compose/components/radio-button) (checked 2026-09-28).
- **Mantine** (component): single-selection. [Source](https://mantine.dev/core/radio) (checked 2026-09-28).
- **Ant Design** (component): single-selection. [Source](https://ant.design/components/radio) (checked 2026-09-28).
- **Chakra/Ark** (component): single-selection. [Source](https://chakra-ui.com/docs/components/radio) (checked 2026-09-28).
- **Chakra/Ark** (component): single-selection. [Source](https://chakra-ui.com/docs/components/radio-card) (checked 2026-09-28).
- **Atlassian** (component): single-selection. [Source](https://atlassian.design/components/radio/examples) (checked 2026-09-28).
- **Polaris** (component): single-selection. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list) (checked 2026-09-28).
- **GOV.UK** (component): single-selection. [Source](https://design-system.service.gov.uk/components/radios/) (checked 2026-09-28).

## Area today

Native radio inputs and fieldset group; sm/md/lg and neutral/accent; vertical/horizontal layout and descriptions. No Radio choice-card treatment is declared (Checkbox card is a different family). [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1).

- Exact manifest axes: size = sm, md, lg; tone = neutral, accent. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249).
- Boolean modifiers: none declared. Runtime state hooks: disabled. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249).
- Slots: control. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249).

RadioGroup separately declares horizontal/vertical orientation and disabled/invalid states. [RadioGroup manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L251-L258).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:single-selection`, `orientation:horizontal`, `orientation:vertical`, `size:lg`, `size:md`, `size:sm`, `state:checked`, `state:disabled`, `state:invalid`, `structure:description`, `structure:label`, `tone:accent`, `tone:neutral`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1-L142).
- **not found**: `button-style:outline`, `button-style:solid`, `indicator-placement:end`, `indicator-placement:inside`, `indicator-placement:start`, `option-type:button`, `option-type:default`, `size:XL`, `size:default`, `size:xl`, `size:xs`, `state:error`, `state:read-only`, `state:warning`, `structure:ai-label`, `structure:button-options`, `structure:choice-cards`, `structure:conditional-content`, `structure:contextual-help`, `structure:hide-indicator`, `structure:icons`, `structure:label-below`, `structure:label-beside`, `structure:or-divider`, `structure:rich-options`, `variant:classic`, `variant:filled`, `variant:outline`, `variant:soft`, `variant:solid`, `variant:subtle`, `variant:surface`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1-L142).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:L`, `size:M`, `size:S`, `size:large`, `size:medium`, `size:small`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1-L142).
- **system-level / not this exact option**: `contrast:high`, `contrast:normal`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1-L142).
- **equivalent concept / source styling differs**: `emphasis:default`, `emphasis:emphasized`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1-L142).
- **composition**: `structure:helper-error`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1-L142).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 2 direct systems. Direct: Chakra/Ark, Mantine. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1).
  - Individual options: `size:sm` (2 direct; Area: yes); `size:md` (2 direct; Area: yes); `size:lg` (2 direct; Area: yes); `tone:neutral` (0 direct; Area: yes); `tone:accent` (0 direct; Area: yes).
- **Layer 3 · Choice cards with optional indicator and rich content** — 5 direct systems. Direct: Chakra/Ark, Mantine, Radix Themes, Untitled UI, shadcn/ui. The principal radio anatomy gap; retain native mutually exclusive form semantics. Evidence: [1](https://chakra-ui.com/docs/components/radio-card), [2](https://mantine.dev/core/radio), [3](https://ui.shadcn.com/docs/components/radio-group), [4](https://www.radix-ui.com/themes/docs/components/radio-cards), [5](https://www.untitledui.com/react/components/radio-groups).
  - Individual options: `structure:choice-cards` (5 direct; Area: not found); `structure:hide-indicator` (1 direct; Area: not found); `structure:rich-options` (3 direct; Area: not found).
- **Layer 2 · Outline/soft/solid appearances** — 3 direct systems. Direct: Chakra/Ark, Mantine, Radix Themes. Keep tone separate; avoid making the choice-card structure a tone modifier. Evidence: [1](https://chakra-ui.com/docs/components/radio), [2](https://chakra-ui.com/docs/components/radio-card), [3](https://mantine.dev/core/radio), [4](https://www.radix-ui.com/themes/docs/components/radio-group).
  - Individual options: `variant:outline` (2 direct; Area: not found); `variant:soft` (1 direct; Area: not found); `variant:subtle` (1 direct; Area: not found); `variant:solid` (1 direct; Area: not found).
- **Layer 3 · Conditional supporting field** — 2 direct systems. Direct: GOV.UK, Polaris. A form recipe, with expansion and validation tied to the chosen option. Evidence: [1](https://design-system.service.gov.uk/components/radios/), [2](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list).
  - Individual options: `structure:conditional-content` (2 direct; Area: not found).

## Sources

- Area: [manifest, lines 242–249](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L242-L249); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/radio.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: radio, radio group, radio cards, choice list. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/radio-buttons), [source 2](https://www.untitledui.com/react/components/radio-groups); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/radio-group); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/radio-cards), [source 2](https://www.radix-ui.com/themes/docs/components/radio-group); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/radio-group); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/RadioGroup); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/radiogroup/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/radio-group/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/radio-button/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/radio-button); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/radio); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/radio); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/radio), [source 2](https://chakra-ui.com/docs/components/radio-card); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/radio/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/choice-list); checked 2026-09-28.
- **GOV.UK**: [source 1](https://design-system.service.gov.uk/components/radios/); checked 2026-09-28.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for radio, radio group, radio cards, choice list. No independently verified option recorded; see the audit for lookup limitations.

Not found at option level (therefore omitted from counts): shadcn/ui: arrow-navigation; Base UI: arrow-navigation; React Aria / Spectrum 2: arrow-navigation; Fluent 2: arrow-navigation; Chakra/Ark: arrow-navigation. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
