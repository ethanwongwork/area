# Segmented — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Picks one value from a small set of options. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621).

Boundary: One raised-track appearance; three sizes; fullWidth and iconOnly. Radio semantics with RTL-aware arrows, Home/End and disabled-item skipping. Multiple independent toggles belong to a separate semantic mode, not an interchangeable radio state. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1).

## Variant axes

- **Untitled UI** (example): state: disabled, selected. [Source](https://www.untitledui.com/react/components/button-groups) (checked 2026-09-28).
- **shadcn/ui** (primitive): variant: default, outline; size: default, lg; orientation: horizontal, vertical; state: disabled. [Source](https://ui.shadcn.com/docs/components/toggle-group) (checked 2026-09-28).
- **Radix Themes** (component): variant: surface, classic; size: 1, 2, 3; radius: none, small, medium, large, full. [Source](https://www.radix-ui.com/themes/docs/components/segmented-control) (checked 2026-09-28).
- **Base UI** (primitive): orientation: horizontal, vertical; state: disabled. [Source](https://base-ui.com/react/components/toggle-group) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): state: disabled. [Source](https://react-spectrum.adobe.com/SegmentedControl) (checked 2026-09-28).
- **Primer** (component): size: small, medium. [Source](https://primer.style/product/components/segmented-control/) (checked 2026-09-28).
- **Carbon** (component): size: small, medium, large; state: disabled. [Source](https://carbondesignsystem.com/components/content-switcher/usage/) (checked 2026-09-28).
- **Material 3** (component): state: disabled, selected. [Source](https://developer.android.com/develop/ui/compose/components/segmented-button) (checked 2026-09-28).
- **Mantine** (component): size: xs, sm, md, lg, xl; orientation: horizontal, vertical. [Source](https://mantine.dev/core/segmented-control) (checked 2026-09-28).
- **Ant Design** (component): size: small, medium, large; shape: default, round; state: disabled. [Source](https://ant.design/components/segmented) (checked 2026-09-28).
- **Chakra/Ark** (component): size: xs, sm, md, lg; orientation: horizontal, vertical; state: disabled, read-only. [Source](https://chakra-ui.com/docs/components/segmented-control) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (example): icons, text-options. [Source](https://www.untitledui.com/react/components/button-groups) (checked 2026-09-28).
- **shadcn/ui** (primitive): icons, text-options. [Source](https://ui.shadcn.com/docs/components/toggle-group) (checked 2026-09-28).
- **Radix Themes** (component): text-options. [Source](https://www.radix-ui.com/themes/docs/components/segmented-control) (checked 2026-09-28).
- **Base UI** (primitive): icons, text-options. [Source](https://base-ui.com/react/components/toggle-group) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): text-options, equal-width. [Source](https://react-spectrum.adobe.com/SegmentedControl) (checked 2026-09-28).
- **Primer** (component): icons, text-options. [Source](https://primer.style/product/components/segmented-control/) (checked 2026-09-28).
- **Carbon** (component): icons, text-options, equal-width. [Source](https://carbondesignsystem.com/components/content-switcher/usage/) (checked 2026-09-28).
- **Material 3** (component): icons, text-options, joined-outline. [Source](https://developer.android.com/develop/ui/compose/components/segmented-button) (checked 2026-09-28).
- **Mantine** (component): icons, text-options, equal-width. [Source](https://mantine.dev/core/segmented-control) (checked 2026-09-28).
- **Ant Design** (component): icons, text-options, equal-width, rich-options. [Source](https://ant.design/components/segmented) (checked 2026-09-28).
- **Chakra/Ark** (component): icons, text-options. [Source](https://chakra-ui.com/docs/components/segmented-control) (checked 2026-09-28).
- **Apple HIG** (guidance): icons, text-options, equal-width. [Source](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (example): single-selection, multiple-selection. [Source](https://www.untitledui.com/react/components/button-groups) (checked 2026-09-28).
- **shadcn/ui** (primitive): single-selection. [Source](https://ui.shadcn.com/docs/components/toggle-group) (checked 2026-09-28).
- **Radix Themes** (component): single-selection. [Source](https://www.radix-ui.com/themes/docs/components/segmented-control) (checked 2026-09-28).
- **Base UI** (primitive): single-selection, multiple-selection, roving-focus. [Source](https://base-ui.com/react/components/toggle-group) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): single-selection. [Source](https://react-spectrum.adobe.com/SegmentedControl) (checked 2026-09-28).
- **Primer** (component): single-selection. [Source](https://primer.style/product/components/segmented-control/) (checked 2026-09-28).
- **Carbon** (component): single-selection. [Source](https://carbondesignsystem.com/components/content-switcher/usage/) (checked 2026-09-28).
- **Material 3** (component): single-selection, multiple-selection. [Source](https://developer.android.com/develop/ui/compose/components/segmented-button) (checked 2026-09-28).
- **Mantine** (component): single-selection, animated-indicator. [Source](https://mantine.dev/core/segmented-control) (checked 2026-09-28).
- **Ant Design** (component): single-selection. [Source](https://ant.design/components/segmented) (checked 2026-09-28).
- **Chakra/Ark** (component): single-selection. [Source](https://chakra-ui.com/docs/components/segmented-control) (checked 2026-09-28).
- **Apple HIG** (guidance): single-selection, multiple-selection. [Source](https://developer.apple.com/design/human-interface-guidelines/segmented-controls) (checked 2026-09-28).

## Area today

One raised-track appearance; three sizes; fullWidth and iconOnly. Radio semantics with RTL-aware arrows, Home/End and disabled-item skipping. Multiple independent toggles belong to a separate semantic mode, not an interchangeable radio state. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1).

- Exact manifest axes: size = sm, md, lg. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621).
- Boolean modifiers: full-width, icon-only. Runtime state hooks: selected, disabled. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621).
- Slots: item, icon, label. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:roving-focus`, `interaction:single-selection`, `orientation:horizontal`, `size:lg`, `size:md`, `size:sm`, `state:disabled`, `state:selected`, `structure:equal-width`, `structure:icons`, `structure:text-options`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1-L170).
- **not found**: `interaction:animated-indicator`, `interaction:multiple-selection`, `orientation:vertical`, `shape:default`, `shape:round`, `size:default`, `size:xl`, `size:xs`, `state:read-only`, `structure:joined-outline`, `structure:rich-options`, `variant:default`, `variant:outline`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1-L170).
- **equivalent concept / source styling differs**: `variant:classic`, `variant:surface`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1-L170).
- **equivalent tier / geometry not asserted**: `size:1`, `size:2`, `size:3`, `size:large`, `size:medium`, `size:small`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1-L170).
- **system-level / not this exact option**: `radius:full`, `radius:large`, `radius:medium`, `radius:none`, `radius:small`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1-L170).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 2 direct systems; 1 supporting/adjacent systems. Direct: Chakra/Ark, Mantine. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1).
  - Individual options: `size:sm` (2 direct; Area: yes); `size:md` (2 direct; Area: yes); `size:lg` (2 direct; Area: yes).
- **Layer 3 · Raised track and joined outline** — 2 direct systems; 1 supporting/adjacent systems. Direct: Material 3, Radix Themes. Offer a second anatomy without merging it with underline Tabs. Evidence: [1](https://developer.android.com/develop/ui/compose/components/segmented-button), [2](https://ui.shadcn.com/docs/components/toggle-group), [3](https://www.radix-ui.com/themes/docs/components/segmented-control).
  - Individual options: `variant:surface` (1 direct; Area: equivalent concept / source styling differs); `variant:classic` (1 direct; Area: equivalent concept / source styling differs); `structure:joined-outline` (1 direct; Area: not found); `variant:outline` (0 direct; Area: not found).
- **Layer 3 · Vertical segmented choices** — 2 direct systems; 2 supporting/adjacent systems. Direct: Chakra/Ark, Mantine. Requires orientation-aware keyboard behavior as well as layout. Evidence: [1](https://base-ui.com/react/components/toggle-group), [2](https://chakra-ui.com/docs/components/segmented-control), [3](https://mantine.dev/core/segmented-control), [4](https://ui.shadcn.com/docs/components/toggle-group).
  - Individual options: `orientation:vertical` (2 direct; Area: not found).
- **Layer 2 · Optional multiple-toggle semantic mode** — 2 direct systems; 1 supporting/adjacent systems; 1 guidance systems. Direct: Material 3, Untitled UI. Keep it distinct from the existing radio contract and name the mode explicitly. Evidence: [1](https://base-ui.com/react/components/toggle-group), [2](https://developer.android.com/develop/ui/compose/components/segmented-button), [3](https://developer.apple.com/design/human-interface-guidelines/segmented-controls), [4](https://www.untitledui.com/react/components/button-groups).
  - Individual options: `interaction:multiple-selection` (2 direct; Area: not found).

## Sources

- Area: [manifest, lines 612–621](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L612-L621); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/segmented.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: segmented control, segmented button, content switcher, toggle group. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/button-groups); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/toggle-group); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/segmented-control); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/toggle-group); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/SegmentedControl); checked 2026-09-28.
- **Fluent 2 — not found**: checked [catalogue](https://fluent2.microsoft.design/components/web/react) on 2026-09-28 for segmented control, segmented button, content switcher, toggle group. No independently verified option recorded; see the audit for lookup limitations.
- **Primer**: [source 1](https://primer.style/product/components/segmented-control/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/content-switcher/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/segmented-button); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/segmented-control); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/segmented); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/segmented-control); checked 2026-09-28.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for segmented control, segmented button, content switcher, toggle group. No independently verified option recorded; see the audit for lookup limitations.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for segmented control, segmented button, content switcher, toggle group. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for segmented control, segmented button, content switcher, toggle group. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/segmented-controls); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/segmented-controls.json). Platform guidance is counted separately.

Not found at option level (therefore omitted from counts): shadcn/ui: multiple-selection; React Aria / Spectrum 2: arrow-navigation. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
