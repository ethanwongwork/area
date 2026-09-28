# ModelPicker — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Chooses the model a message is sent with, from inside the composer. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441).

Boundary: Composer trigger opens a Menu of model radio items, with notes and a selected check. Opens on the current item; choosing closes and returns focus. No design-time axes in the manifest. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/model-picker.md#L1).

## Variant axes

No additional named variant axes found in the checked public sources. Area’s current contract is listed below; the complete system-by-system search record is in Sources.


## Structural alternatives

- **Untitled UI** (primitive): icons. [Source](https://www.untitledui.com/react/components/dropdowns) (checked 2026-09-28).
- **shadcn/ui** (primitive): radio-items, groups, icons. [Source](https://ui.shadcn.com/docs/components/dropdown-menu) (checked 2026-09-28).
- **Radix Themes** (primitive): radio-items, groups. [Source](https://www.radix-ui.com/themes/docs/components/dropdown-menu) (checked 2026-09-28).
- **Base UI** (primitive): radio-items, groups. [Source](https://base-ui.com/react/components/menu) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): descriptions, icons, groups, radio-items. [Source](https://react-spectrum.adobe.com/Menu) (checked 2026-09-28).
- **Chakra/Ark** (primitive): radio-items, groups. [Source](https://chakra-ui.com/docs/components/menu) (checked 2026-09-28).

## Interaction patterns

- **Untitled UI** (primitive): single-selection. [Source](https://www.untitledui.com/react/components/dropdowns) (checked 2026-09-28).
- **shadcn/ui** (primitive): single-selection. [Source](https://ui.shadcn.com/docs/components/dropdown-menu) (checked 2026-09-28).
- **Radix Themes** (primitive): single-selection. [Source](https://www.radix-ui.com/themes/docs/components/dropdown-menu) (checked 2026-09-28).
- **Base UI** (primitive): single-selection. [Source](https://base-ui.com/react/components/menu) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): single-selection. [Source](https://react-spectrum.adobe.com/Menu) (checked 2026-09-28).
- **Chakra/Ark** (primitive): single-selection. [Source](https://chakra-ui.com/docs/components/menu) (checked 2026-09-28).

## Area today

Composer trigger opens a Menu of model radio items, with notes and a selected check. Opens on the current item; choosing closes and returns focus. No design-time axes in the manifest. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/model-picker.md#L1).

- Exact manifest axes: none. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441).
- Boolean modifiers: none declared. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441).
- Slots: trigger, menu. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `structure:groups`, `structure:icons`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/model-picker.md#L1-L50).
- **yes**: `interaction:single-selection`, `structure:descriptions`, `structure:radio-items`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/model-picker.md#L1-L50).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. No design-time variant axis is declared today; keep this focused recipe and choose structural extensions below before introducing additional paint axes. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/model-picker.md#L1).
- **Layer 3 · Single-choice menu with descriptions** — 0 direct systems; 5 supporting/adjacent systems. Direct: none verified as a direct implementation/example. Retain the current recipe. Counts here establish supporting menu primitives, not dedicated model selectors. Evidence: [1](https://base-ui.com/react/components/menu), [2](https://chakra-ui.com/docs/components/menu), [3](https://react-spectrum.adobe.com/Menu), [4](https://ui.shadcn.com/docs/components/dropdown-menu), [5](https://www.radix-ui.com/themes/docs/components/dropdown-menu).
  - Individual options: `structure:descriptions` (0 direct; Area: yes); `structure:radio-items` (0 direct; Area: yes).
- **Layer 3 · Grouped model choices** — 0 direct systems; 5 supporting/adjacent systems. Direct: none verified as a direct implementation/example. Useful when modes or providers create meaningful groups; do not expose arbitrary nested menus before Menu supports them. Evidence: [1](https://base-ui.com/react/components/menu), [2](https://chakra-ui.com/docs/components/menu), [3](https://react-spectrum.adobe.com/Menu), [4](https://ui.shadcn.com/docs/components/dropdown-menu), [5](https://www.radix-ui.com/themes/docs/components/dropdown-menu).
  - Individual options: `structure:groups` (0 direct; Area: not found).
- **Layer 3 · Optional model/provider icon slot** — 0 direct systems; 3 supporting/adjacent systems. Direct: none verified as a direct implementation/example. Optional identifying content should not determine the selected-state behavior. Evidence: [1](https://react-spectrum.adobe.com/Menu), [2](https://ui.shadcn.com/docs/components/dropdown-menu), [3](https://www.untitledui.com/react/components/dropdowns).
  - Individual options: `structure:icons` (0 direct; Area: not found).

## Sources

- Area: [manifest, lines 435–441](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L435-L441); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/model-picker.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: model picker, model select; single-choice menu as a primitive. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/dropdowns); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/dropdown-menu); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/dropdown-menu); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/menu); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Menu); checked 2026-09-28.
- **Fluent 2 — not found**: checked [catalogue](https://fluent2.microsoft.design/components/web/react) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Mantine — not found**: checked [catalogue](https://mantine.dev/core/package/) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Ant Design — not found**: checked [catalogue](https://ant.design/components/overview/) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/menu); checked 2026-09-28.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for model picker, model select; single-choice menu as a primitive. No independently verified option recorded; see the audit for lookup limitations.
