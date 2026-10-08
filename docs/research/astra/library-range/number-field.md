# NumberField — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Edits a number with optional units, stepping and scrubbing. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161).

Boundary: Outline/soft; three tiers; units, optional steppers and letter/icon/grip scrubbing; mixed values; locale formatting; arithmetic parsing; fine/coarse stepping; commit/cancel. Horizontal flanking steppers and wheel/hold policies are not found in this spec. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1).

## Variant axes

- **Untitled UI** (example): size: sm, md; state: disabled, invalid. [Source](https://www.untitledui.com/react/components/inputs) (checked 2026-09-28).
- **Base UI** (component): state: disabled, read-only, invalid; direction: horizontal, vertical. [Source](https://base-ui.com/react/components/number-field) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L, XL; label-position: top, side; state: disabled, read-only. [Source](https://react-spectrum.adobe.com/NumberField) (checked 2026-09-28).
- **Fluent 2** (component): appearance: outline, underline, filled-darker, filled-lighter; size: small, medium. [Source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts) (checked 2026-09-28).
- **Carbon** (component): size: sm, md, lg; style: default, fluid; state: disabled, read-only, invalid, warning, skeleton. [Source](https://carbondesignsystem.com/components/number-input/usage/) (checked 2026-09-28).
- **Mantine** (component): variant: default, filled, unstyled; size: xs, sm, md, lg, xl; state: disabled, error. [Source](https://mantine.dev/core/number-input) (checked 2026-09-28).
- **Ant Design** (component): variant: outlined, borderless, filled, underlined; size: small, medium, large; state: disabled, read-only, error, warning. [Source](https://ant.design/components/input-number) (checked 2026-09-28).
- **Chakra/Ark** (component): variant: outline, subtle, flushed; size: xs, sm, md, lg; state: disabled, read-only, invalid. [Source](https://chakra-ui.com/docs/components/number-input) (checked 2026-09-28).
- **Polaris** (component): label-visibility: visible, exclusive; state: disabled, read-only, error. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (example): steppers-horizontal, steppers-stacked, prefix-suffix. [Source](https://www.untitledui.com/react/components/inputs) (checked 2026-09-28).
- **Base UI** (component): steppers-horizontal, scrub-handle, prefix-suffix. [Source](https://base-ui.com/react/components/number-field) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): steppers, hide-steppers, description, contextual-help. [Source](https://react-spectrum.adobe.com/NumberField) (checked 2026-09-28).
- **Fluent 2** (component): steppers-stacked. [Source](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts) (checked 2026-09-28).
- **Carbon** (component): steppers, label-above, label-inside, helper-error, ai-label. [Source](https://carbondesignsystem.com/components/number-input/usage/) (checked 2026-09-28).
- **Mantine** (component): steppers-stacked, hide-steppers, prefix-suffix. [Source](https://mantine.dev/core/number-input) (checked 2026-09-28).
- **Ant Design** (component): steppers, hide-steppers, prefix-suffix. [Source](https://ant.design/components/input-number) (checked 2026-09-28).
- **Chakra/Ark** (component): steppers-stacked, steppers-horizontal, scrub-handle. [Source](https://chakra-ui.com/docs/components/number-input) (checked 2026-09-28).
- **Polaris** (component): prefix-suffix, helper-error. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field) (checked 2026-09-28).
- **Apple HIG** (guidance): steppers. [Source](https://developer.apple.com/design/human-interface-guidelines/steppers) (checked 2026-09-28).

## Interaction patterns

- **keyboard-step**: [Base UI](https://base-ui.com/react/components/number-field), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/NumberField), [Carbon](https://carbondesignsystem.com/components/number-input/usage/), [Mantine](https://mantine.dev/core/number-input), [Ant Design](https://ant.design/components/input-number), [Chakra/Ark](https://chakra-ui.com/docs/components/number-input), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts) (checked 2026-09-28).
- **min-max-step**: [Base UI](https://base-ui.com/react/components/number-field), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/NumberField), [Carbon](https://carbondesignsystem.com/components/number-input/usage/), [Mantine](https://mantine.dev/core/number-input), [Ant Design](https://ant.design/components/input-number), [Chakra/Ark](https://chakra-ui.com/docs/components/number-input), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts) (checked 2026-09-28).
- **locale-format**: [Base UI](https://base-ui.com/react/components/number-field), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/NumberField), [Chakra/Ark](https://chakra-ui.com/docs/components/number-input) (checked 2026-09-28).
- **wheel-step**: [Base UI](https://base-ui.com/react/components/number-field), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/NumberField), [Ant Design](https://ant.design/components/input-number), [Chakra/Ark](https://chakra-ui.com/docs/components/number-input) (checked 2026-09-28).
- **scrub**: [Base UI](https://base-ui.com/react/components/number-field), [Chakra/Ark](https://chakra-ui.com/docs/components/number-input) (checked 2026-09-28).
- **change-and-commit**: [Base UI](https://base-ui.com/react/components/number-field), [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field) (checked 2026-09-28).
- **decimal-format**: [Mantine](https://mantine.dev/core/number-input), [Ant Design](https://ant.design/components/input-number), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts) (checked 2026-09-28).
- **clamp-policy**: [Mantine](https://mantine.dev/core/number-input) (checked 2026-09-28).
- **hold-step**: [Mantine](https://mantine.dev/core/number-input) (checked 2026-09-28).
- **change-on-blur**: [Ant Design](https://ant.design/components/input-number), [Fluent 2](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts) (checked 2026-09-28).
- **increment-decrement**: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/steppers) (checked 2026-09-28).

## Area today

Outline/soft; three tiers; units, optional steppers and letter/icon/grip scrubbing; mixed values; locale formatting; arithmetic parsing; fine/coarse stepping; commit/cancel. Horizontal flanking steppers and wheel/hold policies are not found in this spec. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1).

- Exact manifest axes: variant = outline, soft; size = sm, md, lg. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161).
- Boolean modifiers: full-width. Runtime state hooks: disabled, read-only, invalid, success, warning, scrubbing. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161).
- Slots: control, unit, scrub, steppers, step. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `appearance:outline`, `interaction:change-and-commit`, `interaction:decimal-format`, `interaction:keyboard-step`, `interaction:locale-format`, `interaction:min-max-step`, `interaction:scrub`, `size:lg`, `size:md`, `size:sm`, `state:disabled`, `state:invalid`, `state:read-only`, `state:warning`, `structure:hide-steppers`, `structure:prefix-suffix`, `structure:scrub-handle`, `structure:steppers`, `structure:steppers-stacked`, `variant:outline`, `variant:soft`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1-L157).
- **not found**: `appearance:underline`, `direction:horizontal`, `direction:vertical`, `interaction:change-on-blur`, `interaction:clamp-policy`, `interaction:hold-step`, `interaction:increment-decrement`, `interaction:wheel-step`, `label-position:side`, `label-position:top`, `label-visibility:exclusive`, `label-visibility:visible`, `size:XL`, `size:xl`, `size:xs`, `state:error`, `state:skeleton`, `structure:ai-label`, `structure:contextual-help`, `structure:label-above`, `structure:label-inside`, `structure:steppers-horizontal`, `style:default`, `style:fluid`, `variant:borderless`, `variant:default`, `variant:flushed`, `variant:underlined`, `variant:unstyled`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1-L157).
- **equivalent tier / geometry not asserted**: `size:L`, `size:M`, `size:S`, `size:large`, `size:medium`, `size:small`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1-L157).
- **composition**: `structure:description`, `structure:helper-error`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1-L157).
- **equivalent concept / source styling differs**: `appearance:filled-darker`, `appearance:filled-lighter`, `variant:filled`, `variant:outlined`, `variant:subtle`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1-L157).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 4 direct systems. Direct: Carbon, Chakra/Ark, Mantine, Untitled UI. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1).
  - Individual options: `variant:outline` (1 direct; Area: yes); `variant:soft` (0 direct; Area: yes); `size:sm` (4 direct; Area: yes); `size:md` (4 direct; Area: yes); `size:lg` (3 direct; Area: yes).
- **Layer 3 · Underline and borderless alongside outline/soft** — 3 direct systems. Direct: Ant Design, Chakra/Ark, Fluent 2. Useful alternatives for inline values; require a field-wide treatment decision rather than NumberField-only paint. Evidence: [1](https://ant.design/components/input-number), [2](https://chakra-ui.com/docs/components/number-input), [3](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts).
  - Individual options: `variant:underlined` (1 direct; Area: not found); `variant:borderless` (1 direct; Area: not found); `appearance:underline` (1 direct; Area: not found); `variant:flushed` (1 direct; Area: not found).
- **Layer 3 · Flanking or stacked steppers; optional scrub handle** — 5 direct systems. Direct: Base UI, Chakra/Ark, Fluent 2, Mantine, Untitled UI. Keep anatomy independent of size and number parsing. Evidence: [1](https://base-ui.com/react/components/number-field), [2](https://chakra-ui.com/docs/components/number-input), [3](https://mantine.dev/core/number-input), [4](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts), [5](https://www.untitledui.com/react/components/inputs).
  - Individual options: `structure:steppers-horizontal` (3 direct; Area: not found); `structure:steppers-stacked` (4 direct; Area: yes); `structure:scrub-handle` (2 direct; Area: yes).
- **Layer 3 · Top/side labels and contextual help** — 1 direct systems. Direct: React Aria / Spectrum 2. Compose Field rather than repeat validation wiring in every numeric layout. Evidence: [1](https://react-spectrum.adobe.com/NumberField).
  - Individual options: `label-position:top` (1 direct; Area: not found); `label-position:side` (1 direct; Area: not found); `structure:contextual-help` (1 direct; Area: not found).
- **Layer 2 · Explicit wheel, hold and commit policies** — 6 direct systems. Direct: Ant Design, Base UI, Chakra/Ark, Mantine, Polaris, React Aria / Spectrum 2. Treat these as opt-in behavioral contracts; avoid accidental value changes while scrolling. Evidence: [1](https://ant.design/components/input-number), [2](https://base-ui.com/react/components/number-field), [3](https://chakra-ui.com/docs/components/number-input), [4](https://mantine.dev/core/number-input), [5](https://react-spectrum.adobe.com/NumberField), [6](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field).
  - Individual options: `interaction:wheel-step` (4 direct; Area: not found); `interaction:hold-step` (1 direct; Area: not found); `interaction:change-and-commit` (2 direct; Area: yes).

## Sources

- Area: [manifest, lines 153–161](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L153-L161); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/number-field.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: number field, number input, spinbutton, stepper. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/inputs); checked 2026-09-28.
- **shadcn/ui — not found**: checked [catalogue](https://ui.shadcn.com/docs/components) on 2026-09-28 for number field, number input, spinbutton, stepper. No independently verified option recorded; see the audit for lookup limitations.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for number field, number input, spinbutton, stepper. No independently verified option recorded; see the audit for lookup limitations.
- **Base UI**: [source 1](https://base-ui.com/react/components/number-field); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/NumberField); checked 2026-09-28.
- **Fluent 2**: [source 1](https://raw.githubusercontent.com/microsoft/fluentui/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-spinbutton/library/src/components/SpinButton/SpinButton.types.ts); checked 2026-09-28.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for number field, number input, spinbutton, stepper. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/number-input/usage/); checked 2026-09-28.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for number field, number input, spinbutton, stepper. No independently verified option recorded; see the audit for lookup limitations.
- **Mantine**: [source 1](https://mantine.dev/core/number-input); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/input-number); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/number-input); checked 2026-09-28.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for number field, number input, spinbutton, stepper. No independently verified option recorded; see the audit for lookup limitations.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/forms/number-field); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for number field, number input, spinbutton, stepper. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/steppers); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/steppers.json). Platform guidance is counted separately.
