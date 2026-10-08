# PropertyList — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Orders like properties (fills, strokes, effects) and moves them by handle or keyboard. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441).

Boundary: Ordered flat properties with handle, value/actions, inactive state, pointer capture and Escape cancel. Keyboard arrows/Home/End move items while preserving focus and announcing position. Nesting and multi-selection are explicitly out of scope. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/property-list.md#L1).

## Variant axes

- **React Aria / Spectrum 2** (primitive): orientation: horizontal, vertical; selection: none, single, multiple. [Source](https://react-aria.adobe.com/ListBox) (checked 2026-09-28).

## Structural alternatives

- **React Aria / Spectrum 2** (primitive): drag-handle, drop-indicator, rich-rows. [Source](https://react-aria.adobe.com/ListBox) (checked 2026-09-28).
- **Atlassian** (recipe): drag-handle, drop-indicator. [Source](https://atlassian.design/components/pragmatic-drag-and-drop/examples) (checked 2026-09-28).
- **Atlassian** (guidance): move-actions. [Source](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines) (checked 2026-09-28).

## Interaction patterns

- **drag-reorder**: [React Aria / Spectrum 2](https://react-aria.adobe.com/ListBox), [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/examples) (checked 2026-09-28).
- **keyboard-reorder**: [React Aria / Spectrum 2](https://react-aria.adobe.com/ListBox) (checked 2026-09-28).
- **drop-announcement**: [React Aria / Spectrum 2](https://react-aria.adobe.com/ListBox), [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines) (checked 2026-09-28).
- **keyboard-alternative**: [Atlassian](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines) (checked 2026-09-28).

## Area today

Ordered flat properties with handle, value/actions, inactive state, pointer capture and Escape cancel. Keyboard arrows/Home/End move items while preserving focus and announcing position. Nesting and multi-selection are explicitly out of scope. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/property-list.md#L1).

- Exact manifest axes: none. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441).
- Boolean modifiers: none declared. Runtime state hooks: dragging, inactive. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441).
- Slots: item, handle, value, actions, indicator. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `orientation:horizontal`, `orientation:vertical`, `selection:multiple`, `selection:none`, `selection:single`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/property-list.md#L1-L70).
- **yes**: `interaction:drag-reorder`, `interaction:drop-announcement`, `interaction:keyboard-alternative`, `interaction:keyboard-reorder`, `structure:drag-handle`, `structure:drop-indicator`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/property-list.md#L1-L70).
- **composition**: `structure:move-actions`, `structure:rich-rows`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/property-list.md#L1-L70).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. No design-time variant axis is declared today; keep this focused recipe and choose structural extensions below before introducing additional paint axes. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/property-list.md#L1).
- **Layer 3 · Flat reorderable property row** — 1 direct systems; 1 supporting/adjacent systems. Direct: Atlassian. Retain the current value/actions composition. Evidence is for sortable primitives, not a full inspector property editor. Evidence: [1](https://atlassian.design/components/pragmatic-drag-and-drop/examples), [2](https://react-aria.adobe.com/ListBox).
  - Individual options: `structure:drag-handle` (1 direct; Area: yes); `structure:drop-indicator` (1 direct; Area: yes); `interaction:drag-reorder` (1 direct; Area: yes).
- **Layer 2 · Keyboard reordering and move announcements** — 0 direct systems; 1 supporting/adjacent systems; 1 guidance systems. Direct: none verified as a direct implementation/example. Keep as required behavior; add explicit move commands if drag is difficult on a target platform. Evidence: [1](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines), [2](https://react-aria.adobe.com/ListBox).
  - Individual options: `interaction:keyboard-reorder` (0 direct; Area: yes); `interaction:keyboard-alternative` (0 direct; Area: yes); `interaction:drop-announcement` (0 direct; Area: yes).
- **Layer 2 · Multi-selection only as a later mode** — 0 direct systems; 1 supporting/adjacent systems. Direct: none verified as a direct implementation/example. The evidence comes from collection primitives; needs a product need and an expanded reorder contract. Evidence: [1](https://react-aria.adobe.com/ListBox).
  - Individual options: `selection:multiple` (0 direct; Area: not found).

## Sources

- Area: [manifest, lines 434–441](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L434-L441); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/property-list.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: property list, reorderable list, sortable list, drag and drop. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui — not found**: checked [catalogue](https://ui.shadcn.com/docs/components) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2**: [source 1](https://react-aria.adobe.com/ListBox); checked 2026-09-28.
- **Fluent 2 — not found**: checked [catalogue](https://fluent2.microsoft.design/components/web/react) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Mantine — not found**: checked [catalogue](https://mantine.dev/core/package/) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Ant Design — not found**: checked [catalogue](https://ant.design/components/overview/) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Chakra/Ark — not found**: checked [catalogue](https://chakra-ui.com/docs/components/concepts/overview) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Atlassian**: [source 1](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines), [source 2](https://atlassian.design/components/pragmatic-drag-and-drop/examples); checked 2026-09-28.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for property list, reorderable list, sortable list, drag and drop. No independently verified option recorded; see the audit for lookup limitations.
