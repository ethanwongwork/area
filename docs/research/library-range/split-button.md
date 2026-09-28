# SplitButton — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Joins a default action to a menu of related actions. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74).

Boundary: Manifest declares solid/soft/outline/ghost plus icon-only. Spec inherits Button sizes and tones, documents two tab stops and menu keys, but explicitly excludes ghost. Treat that disagreement as an open contract question, not a completed range decision. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/split-button.md#L1).

## Variant axes

- **shadcn/ui** (recipe): orientation: horizontal, vertical. [Source](https://ui.shadcn.com/docs/components/button-group) (checked 2026-09-28).
- **Fluent 2** (component): appearance: secondary, primary, outline, subtle, transparent; shape: rounded, circular, square; size: small, medium, large; state: disabled, disabled-focusable; icon-position: before, after. [Source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts) (checked 2026-09-28).
- **Material 3** (experimental-component): appearance: filled, tonal, elevated, outlined; size: extra-small, small, medium, large, extra-large. [Source](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt) (checked 2026-09-28).
- **Atlassian** (component): appearance: default, primary; spacing: default, compact. [Source](https://atlassian.design/components/button/split-button/examples) (checked 2026-09-28).

## Structural alternatives

- **shadcn/ui** (recipe): primary-action, menu-trigger, separator. [Source](https://ui.shadcn.com/docs/components/button-group) (checked 2026-09-28).
- **Fluent 2** (component): primary-action, menu-trigger. [Source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/SplitButton/SplitButton.types.ts) (checked 2026-09-28).
- **Fluent 2** (component): icons. [Source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts) (checked 2026-09-28).
- **Material 3** (experimental-component): primary-action, menu-trigger, icons. [Source](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt) (checked 2026-09-28).
- **Ant Design** (component): primary-action, menu-trigger, icons. [Source](https://ant.design/components/dropdown) (checked 2026-09-28).
- **Atlassian** (component): primary-action, menu-trigger, separator. [Source](https://atlassian.design/components/button/split-button/examples) (checked 2026-09-28).

## Interaction patterns

- **shadcn/ui** (recipe): two-tab-stops, menu-keyboard. [Source](https://ui.shadcn.com/docs/components/button-group) (checked 2026-09-28).
- **Material 3** (experimental-component): shape-animation. [Source](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt) (checked 2026-09-28).
- **Ant Design** (component): two-actions. [Source](https://ant.design/components/dropdown) (checked 2026-09-28).
- **Atlassian** (component): two-actions. [Source](https://atlassian.design/components/button/split-button/examples) (checked 2026-09-28).

## Area today

Manifest declares solid/soft/outline/ghost plus icon-only. Spec inherits Button sizes and tones, documents two tab stops and menu keys, but explicitly excludes ghost. Treat that disagreement as an open contract question, not a completed range decision. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/split-button.md#L1).

- Exact manifest axes: variant = solid, soft, outline, ghost. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74).
- Boolean modifiers: icon-only. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74).
- Slots: action, trigger, menu. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `appearance:default`, `appearance:elevated`, `appearance:subtle`, `appearance:transparent`, `icon-position:after`, `icon-position:before`, `interaction:shape-animation`, `orientation:horizontal`, `orientation:vertical`, `shape:circular`, `shape:rounded`, `shape:square`, `size:extra-large`, `size:extra-small`, `size:large`, `size:medium`, `size:small`, `spacing:compact`, `spacing:default`, `state:disabled-focusable`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/split-button.md#L1-L227).
- **yes**: `appearance:outline`, `interaction:menu-keyboard`, `interaction:two-actions`, `interaction:two-tab-stops`, `state:disabled`, `structure:icons`, `structure:menu-trigger`, `structure:primary-action`, `structure:separator`, `variant:ghost`, `variant:outline`, `variant:soft`, `variant:solid`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/split-button.md#L1-L227).
- **equivalent concept / source styling differs**: `appearance:filled`, `appearance:outlined`, `appearance:primary`, `appearance:secondary`, `appearance:tonal`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/split-button.md#L1-L227).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/split-button.md#L1).
  - Individual options: `variant:solid` (0 direct; Area: yes); `variant:soft` (0 direct; Area: yes); `variant:outline` (0 direct; Area: yes); `variant:ghost` (0 direct; Area: yes).
- **Layer 2 · Primary/soft/outline and an owner decision on ghost** — 2 direct systems; 1 experimental implementation. Direct: Atlassian, Fluent 2. Resolve the manifest/spec conflict. Fluent supplies quiet styles while Area’s spec rejects ghost. Evidence: [1](https://atlassian.design/components/button/split-button/examples), [2](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt), [3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts).
  - Individual options: `appearance:primary` (2 direct; Area: equivalent concept / source styling differs); `appearance:secondary` (1 direct; Area: equivalent concept / source styling differs); `appearance:outline` (1 direct; Area: yes); `appearance:subtle` (1 direct; Area: not found); `appearance:transparent` (1 direct; Area: not found); `appearance:filled` (0 direct; Area: equivalent concept / source styling differs); `appearance:tonal` (0 direct; Area: equivalent concept / source styling differs); `appearance:outlined` (0 direct; Area: equivalent concept / source styling differs).
- **Layer 3 · Text/icon primary action plus independently named menu trigger** — 4 direct systems; 1 experimental implementation. Direct: Ant Design, Atlassian, Fluent 2, shadcn/ui. Retain two actions and their keyboard stops; changing the primary action after selection is a separate policy. Evidence: [1](https://ant.design/components/dropdown), [2](https://atlassian.design/components/button/split-button/examples), [3](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt), [4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts), [5](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/SplitButton/SplitButton.types.ts), [6](https://ui.shadcn.com/docs/components/button-group).
  - Individual options: `structure:primary-action` (4 direct; Area: yes); `structure:menu-trigger` (4 direct; Area: yes); `structure:icons` (2 direct; Area: yes).
- **Layer 2 · Shape and expressive motion as optional future range** — 1 direct systems; 1 experimental implementation. Direct: Fluent 2. Do not copy platform geometry; expressive source is experimental and not a baseline requirement. Evidence: [1](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt), [2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts).
  - Individual options: `shape:rounded` (1 direct; Area: not found); `shape:circular` (1 direct; Area: not found); `shape:square` (1 direct; Area: not found); `interaction:shape-animation` (0 direct; Area: not found).

## Sources

- Area: [manifest, lines 67–74](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L67-L74); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/split-button.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: split button, dropdown button, button with dropdown, button group split. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/button-group); checked 2026-09-28.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2 — not found**: checked [catalogue](https://react-spectrum.adobe.com/) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **Fluent 2**: [source 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/Button/Button.types.ts), [source 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-button/library/src/components/SplitButton/SplitButton.types.ts); checked 2026-09-28.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **Material 3**: [source 1](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/SplitButton.kt); checked 2026-09-28.
- **Mantine — not found**: checked [catalogue](https://mantine.dev/core/package/) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **Ant Design**: [source 1](https://ant.design/components/dropdown); checked 2026-09-28.
- **Chakra/Ark — not found**: checked [catalogue](https://chakra-ui.com/docs/components/concepts/overview) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **Atlassian**: [source 1](https://atlassian.design/components/button/split-button/examples); checked 2026-09-28.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for split button, dropdown button, button with dropdown, button group split. No independently verified option recorded; see the audit for lookup limitations.
