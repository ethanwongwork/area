# Select — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Picks one value from a list. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222).

Boundary: Native select, outline/soft, three tiers, fullWidth, optgroups and validation. appearance: base-select styles the native popup where supported; this is not a headless custom-listbox implementation. Search, multiple and rich options are explicitly excluded; borderless/ghost is a candidate. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1).

## Variant axes

- **Untitled UI** (component): size: sm, md, lg; state: disabled. [Source](https://www.untitledui.com/react/components/select) (checked 2026-09-28).
- **shadcn/ui** (component): size: default; state: disabled, invalid. [Source](https://ui.shadcn.com/docs/components/select) (checked 2026-09-28).
- **shadcn/ui** (component): size: default; state: disabled, invalid. [Source](https://ui.shadcn.com/docs/components/native-select) (checked 2026-09-28).
- **Radix Themes** (component): trigger-variant: classic, surface, soft, ghost; popup-variant: solid, soft; size: 1, 2, 3; radius: none, small, medium, large, full; contrast: normal, high. [Source](https://www.radix-ui.com/themes/docs/components/select) (checked 2026-09-28).
- **Base UI** (component): state: disabled, read-only, invalid. [Source](https://base-ui.com/react/components/select) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L, XL; label-position: top, side; quiet: false, true; selection: single, multiple; state: disabled, invalid. [Source](https://react-spectrum.adobe.com/Picker) (checked 2026-09-28).
- **Primer** (component): size: small, medium, large; state: disabled. [Source](https://primer.style/product/components/select/) (checked 2026-09-28).
- **Carbon** (component): style: default, inline; size: sm, md, lg; state: disabled, read-only, invalid, warning. [Source](https://carbondesignsystem.com/components/select/usage/) (checked 2026-09-28).
- **Mantine** (component): variant: default, filled, unstyled; size: xs, sm, md, lg, xl; state: disabled, error, loading. [Source](https://mantine.dev/core/select) (checked 2026-09-28).
- **Mantine** (component): variant: default, filled, unstyled; size: xs, sm, md, lg, xl; state: disabled, error, loading. [Source](https://mantine.dev/core/native-select) (checked 2026-09-28).
- **Ant Design** (component): variant: outlined, borderless, filled, underlined; size: small, medium, large; mode: single, multiple, tags; state: disabled, error, warning, loading. [Source](https://ant.design/components/select) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: outline, subtle, ghost; size: xs, sm, md, lg; state: disabled, invalid. [Source](https://chakra-ui.com/docs/components/select) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: outline, subtle, plain, ghost; size: xs, sm, md, lg, xl; state: disabled, invalid. [Source](https://chakra-ui.com/docs/components/native-select) (checked 2026-09-28).
- **Atlassian** (component): state: disabled, loading. [Source](https://atlassian.design/components/select/examples) (checked 2026-09-28).
- **Polaris** (component): state: disabled, error; label-visibility: visible, exclusive. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select) (checked 2026-09-28).
- **GOV.UK** (component): state: disabled, error. [Source](https://design-system.service.gov.uk/components/select/) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): custom-listbox, icons, avatars, groups. [Source](https://www.untitledui.com/react/components/select) (checked 2026-09-28).
- **shadcn/ui** (component): custom-listbox, groups, scrollable-popup. [Source](https://ui.shadcn.com/docs/components/select) (checked 2026-09-28).
- **shadcn/ui** (component): native-picker, groups. [Source](https://ui.shadcn.com/docs/components/native-select) (checked 2026-09-28).
- **Radix Themes** (component): custom-listbox, groups, inline-trigger, selected-item-alignment. [Source](https://www.radix-ui.com/themes/docs/components/select) (checked 2026-09-28).
- **Base UI** (component): custom-listbox, groups, selected-item-alignment. [Source](https://base-ui.com/react/components/select) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): custom-listbox, icons, descriptions, groups, inline-trigger. [Source](https://react-spectrum.adobe.com/Picker) (checked 2026-09-28).
- **Fluent 2** (component): native-picker. [Source](https://fluent2.microsoft.design/components/web/react/core/select/usage/) (checked 2026-09-28).
- **Fluent 2** (component): custom-listbox, checkbox-options. [Source](https://fluent2.microsoft.design/components/web/react/core/dropdown/usage/) (checked 2026-09-28).
- **Primer** (component): native-picker, description. [Source](https://primer.style/product/components/select/) (checked 2026-09-28).
- **Carbon** (component): native-picker, label, helper-error, ai-label. [Source](https://carbondesignsystem.com/components/select/usage/) (checked 2026-09-28).
- **Mantine** (component): custom-listbox, groups, icons, clear-button. [Source](https://mantine.dev/core/select) (checked 2026-09-28).
- **Mantine** (component): native-picker, groups, icons. [Source](https://mantine.dev/core/native-select) (checked 2026-09-28).
- **Ant Design** (component): custom-listbox, groups, icons, clear-button, tag-values. [Source](https://ant.design/components/select) (checked 2026-09-28).
- **Chakra/Ark** (component): custom-listbox, groups, icons, clear-button. [Source](https://chakra-ui.com/docs/components/select) (checked 2026-09-28).
- **Chakra/Ark** (component): native-picker, groups. [Source](https://chakra-ui.com/docs/components/native-select) (checked 2026-09-28).
- **Atlassian** (component): custom-listbox, groups, clear-button, tag-values. [Source](https://atlassian.design/components/select/examples) (checked 2026-09-28).
- **Polaris** (component): groups, description. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select) (checked 2026-09-28).
- **GOV.UK** (component): native-picker, label, description. [Source](https://design-system.service.gov.uk/components/select/) (checked 2026-09-28).
- **Apple HIG** (guidance): menu-picker, wheel-picker, segmented-picker. [Source](https://developer.apple.com/design/human-interface-guidelines/pickers) (checked 2026-09-28).

## Interaction patterns

- **single-selection**: [Untitled UI](https://www.untitledui.com/react/components/select), [shadcn/ui](https://ui.shadcn.com/docs/components/select), [shadcn/ui](https://ui.shadcn.com/docs/components/native-select), [Radix Themes](https://www.radix-ui.com/themes/docs/components/select), [Base UI](https://base-ui.com/react/components/select), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Picker), [Primer](https://primer.style/product/components/select/), [Carbon](https://carbondesignsystem.com/components/select/usage/), [Mantine](https://mantine.dev/core/select), [Mantine](https://mantine.dev/core/native-select), [Chakra/Ark](https://chakra-ui.com/docs/components/select), [Chakra/Ark](https://chakra-ui.com/docs/components/native-select), [Atlassian](https://atlassian.design/components/select/examples), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select), [GOV.UK](https://design-system.service.gov.uk/components/select/), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/pickers), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/select/usage/), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/dropdown/usage/) (checked 2026-09-28).
- **keyboard-navigation**: [Untitled UI](https://www.untitledui.com/react/components/select) (checked 2026-09-28).
- **native-keyboard**: [shadcn/ui](https://ui.shadcn.com/docs/components/native-select), [Primer](https://primer.style/product/components/select/), [Carbon](https://carbondesignsystem.com/components/select/usage/), [Mantine](https://mantine.dev/core/native-select), [Chakra/Ark](https://chakra-ui.com/docs/components/native-select), [GOV.UK](https://design-system.service.gov.uk/components/select/), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/select/usage/) (checked 2026-09-28).
- **multiple-selection**: [Base UI](https://base-ui.com/react/components/select), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Picker), [Ant Design](https://ant.design/components/select), [Chakra/Ark](https://chakra-ui.com/docs/components/select), [Atlassian](https://atlassian.design/components/select/examples), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/dropdown/usage/) (checked 2026-09-28).
- **typeahead**: [Base UI](https://base-ui.com/react/components/select), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Picker), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/dropdown/usage/) (checked 2026-09-28).
- **touch-placement**: [Base UI](https://base-ui.com/react/components/select) (checked 2026-09-28).
- **async-loading**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Picker), [Mantine](https://mantine.dev/core/select), [Chakra/Ark](https://chakra-ui.com/docs/components/select) (checked 2026-09-28).
- **search-filter**: [Mantine](https://mantine.dev/core/select), [Ant Design](https://ant.design/components/select), [Atlassian](https://atlassian.design/components/select/examples) (checked 2026-09-28).
- **deselect**: [Mantine](https://mantine.dev/core/select) (checked 2026-09-28).
- **create-option**: [Ant Design](https://ant.design/components/select) (checked 2026-09-28).
- **virtualization**: [Ant Design](https://ant.design/components/select) (checked 2026-09-28).

## Area today

Native select, outline/soft, three tiers, fullWidth, optgroups and validation. appearance: base-select styles the native popup where supported; this is not a headless custom-listbox implementation. Search, multiple and rich options are explicitly excluded; borderless/ghost is a candidate. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1).

- Exact manifest axes: variant = outline, soft; size = sm, md, lg. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222).
- Boolean modifiers: full-width. Runtime state hooks: invalid, success, warning, disabled. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222).
- Slots: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:native-keyboard`, `interaction:single-selection`, `interaction:typeahead`, `size:lg`, `size:md`, `size:sm`, `state:disabled`, `state:invalid`, `state:warning`, `structure:groups`, `structure:native-picker`, `trigger-variant:soft`, `variant:outline`, `variant:soft`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1-L187).
- **partial**: `structure:custom-listbox`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1-L187).
- **not found**: `interaction:async-loading`, `interaction:create-option`, `interaction:deselect`, `interaction:keyboard-navigation`, `interaction:multiple-selection`, `interaction:search-filter`, `interaction:touch-placement`, `interaction:virtualization`, `label-position:side`, `label-position:top`, `label-visibility:exclusive`, `label-visibility:visible`, `mode:multiple`, `mode:single`, `mode:tags`, `popup-variant:soft`, `popup-variant:solid`, `quiet:false`, `quiet:true`, `selection:multiple`, `selection:single`, `size:XL`, `size:default`, `size:xl`, `size:xs`, `state:error`, `state:loading`, `state:read-only`, `structure:ai-label`, `structure:avatars`, `structure:checkbox-options`, `structure:clear-button`, `structure:descriptions`, `structure:helper-error`, `structure:icons`, `structure:inline-trigger`, `structure:menu-picker`, `structure:scrollable-popup`, `structure:segmented-picker`, `structure:selected-item-alignment`, `structure:tag-values`, `structure:wheel-picker`, `style:default`, `style:inline`, `trigger-variant:classic`, `trigger-variant:ghost`, `variant:borderless`, `variant:default`, `variant:ghost`, `variant:plain`, `variant:underlined`, `variant:unstyled`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1-L187).
- **equivalent concept / source styling differs**: `trigger-variant:surface`, `variant:filled`, `variant:outlined`, `variant:subtle`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1-L187).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:L`, `size:M`, `size:S`, `size:large`, `size:medium`, `size:small`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1-L187).
- **system-level / not this exact option**: `contrast:high`, `contrast:normal`, `radius:full`, `radius:large`, `radius:medium`, `radius:none`, `radius:small`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1-L187).
- **composition**: `structure:description`, `structure:label`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1-L187).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 4 direct systems. Direct: Carbon, Chakra/Ark, Mantine, Untitled UI. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1).
  - Individual options: `variant:outline` (1 direct; Area: yes); `variant:soft` (0 direct; Area: yes); `size:sm` (4 direct; Area: yes); `size:md` (4 direct; Area: yes); `size:lg` (4 direct; Area: yes).
- **Layer 3 · Optional custom listbox and rich rows** — 10 direct systems. Direct: Ant Design, Atlassian, Base UI, Chakra/Ark, Fluent 2, Mantine, Radix Themes, React Aria / Spectrum 2, Untitled UI, shadcn/ui. Keep native select available; a custom popup needs a complete selection/focus/touch contract. Evidence: [1](https://ant.design/components/select), [2](https://atlassian.design/components/select/examples), [3](https://base-ui.com/react/components/select), [4](https://chakra-ui.com/docs/components/select), [5](https://fluent2.microsoft.design/components/web/react/core/dropdown/usage/), [6](https://mantine.dev/core/native-select), [7](https://mantine.dev/core/select), [8](https://react-spectrum.adobe.com/Picker), [9](https://ui.shadcn.com/docs/components/select), [10](https://www.radix-ui.com/themes/docs/components/select), [11](https://www.untitledui.com/react/components/select).
  - Individual options: `structure:custom-listbox` (10 direct; Area: partial); `structure:icons` (5 direct; Area: not found); `structure:descriptions` (1 direct; Area: not found).
- **Layer 3 · Quiet/ghost inline trigger** — 4 direct systems. Direct: Ant Design, Chakra/Ark, Radix Themes, React Aria / Spectrum 2. This is already an owner decision point in Area’s spec. Evidence: [1](https://ant.design/components/select), [2](https://chakra-ui.com/docs/components/native-select), [3](https://chakra-ui.com/docs/components/select), [4](https://react-spectrum.adobe.com/Picker), [5](https://www.radix-ui.com/themes/docs/components/select).
  - Individual options: `trigger-variant:ghost` (1 direct; Area: not found); `variant:ghost` (1 direct; Area: not found); `quiet:true` (1 direct; Area: not found); `variant:borderless` (1 direct; Area: not found); `structure:inline-trigger` (2 direct; Area: not found).
- **Layer 2 · Multiple selection in a separately documented mode** — 6 direct systems. Direct: Ant Design, Atlassian, Base UI, Chakra/Ark, Fluent 2, React Aria / Spectrum 2. Do not silently add search or create-on-type to Select; route those to Combobox/MultiSelect ownership. Evidence: [1](https://ant.design/components/select), [2](https://atlassian.design/components/select/examples), [3](https://base-ui.com/react/components/select), [4](https://chakra-ui.com/docs/components/select), [5](https://fluent2.microsoft.design/components/web/react/core/dropdown/usage/), [6](https://react-spectrum.adobe.com/Picker).
  - Individual options: `interaction:multiple-selection` (6 direct; Area: not found).

## Sources

- Area: [manifest, lines 213–222](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L213-L222); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/select.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: select, native select, picker, dropdown (search is adjacent). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/select); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/native-select), [source 2](https://ui.shadcn.com/docs/components/select); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/select); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/select); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Picker); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/dropdown/usage/), [source 2](https://fluent2.microsoft.design/components/web/react/core/select/usage/); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/select/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/select/usage/); checked 2026-09-28.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for select, native select, picker, dropdown (search is adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Mantine**: [source 1](https://mantine.dev/core/native-select), [source 2](https://mantine.dev/core/select); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/select); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/native-select), [source 2](https://chakra-ui.com/docs/components/select); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/select/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/select); checked 2026-09-28.
- **GOV.UK**: [source 1](https://design-system.service.gov.uk/components/select/); checked 2026-09-28.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/pickers); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/pickers.json). Platform guidance is counted separately.

Not found at option level (therefore omitted from counts): shadcn/ui: typeahead; Radix Themes: typeahead; Chakra/Ark: typeahead. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
