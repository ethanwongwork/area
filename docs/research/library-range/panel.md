# Panel — library range

Baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

A titled surface of rows that act on something beside it. [Area manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424).

Boundary: sm/md inspector, flush docking, bare bar, action column, sections and pinned footer. Start/end edge width resizing has pointer/keyboard bounds and cancellation. Collapsible sections exist; collapse-to-zero and height resizing are explicitly excluded. General split panes remain a different job. [Area spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1).

## Variant axes

- **shadcn/ui** (primitive): orientation: horizontal, vertical. [Source](https://ui.shadcn.com/docs/components/resizable) (checked 2026-09-28).
- **Mantine** (primitive): orientation: horizontal, vertical. [Source](https://mantine.dev/core/splitter) (checked 2026-09-28).
- **Ant Design** (primitive): orientation: horizontal, vertical. [Source](https://ant.design/components/splitter) (checked 2026-09-28).
- **Chakra/Ark** (primitive): orientation: horizontal, vertical. [Source](https://chakra-ui.com/docs/components/splitter) (checked 2026-09-28).
- **Chakra/Ark** (adjacent): stage: default, minimized, maximized; resize-axis: n, s, e, w, ne, nw, se, sw. [Source](https://chakra-ui.com/docs/components/floating-panel) (checked 2026-09-28).

## Structural alternatives

- **shadcn/ui** (primitive): resize-handle, split-panes. [Source](https://ui.shadcn.com/docs/components/resizable) (checked 2026-09-28).
- **Primer** (primitive): sidebar, split-panes, header, footer. [Source](https://primer.style/product/components/split-page-layout/) (checked 2026-09-28).
- **Mantine** (primitive): split-panes, resize-handle. [Source](https://mantine.dev/core/splitter) (checked 2026-09-28).
- **Ant Design** (primitive): split-panes, resize-handle. [Source](https://ant.design/components/splitter) (checked 2026-09-28).
- **Chakra/Ark** (primitive): split-panes, resize-handle. [Source](https://chakra-ui.com/docs/components/splitter) (checked 2026-09-28).
- **Chakra/Ark** (adjacent): floating-surface, header, close-button. [Source](https://chakra-ui.com/docs/components/floating-panel) (checked 2026-09-28).
- **Atlassian** (component): header, footer, resizable-panel. [Source](https://atlassian.design/components/panel/examples) (checked 2026-09-28).
- **Polaris** (primitive): header, row-actions, sections. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section) (checked 2026-09-28).
- **GOV.UK** (different-job): confirmation-panel, interruption-panel. [Source](https://design-system.service.gov.uk/components/panel/) (checked 2026-09-28).
- **Apple HIG** (guidance): split-panes, resizable-panel. [Source](https://developer.apple.com/design/human-interface-guidelines/split-views) (checked 2026-09-28).

## Interaction patterns

- **shadcn/ui** (primitive): pointer-resize, keyboard-resize. [Source](https://ui.shadcn.com/docs/components/resizable) (checked 2026-09-28).
- **Mantine** (primitive): pointer-resize, collapse-expand. [Source](https://mantine.dev/core/splitter) (checked 2026-09-28).
- **Ant Design** (primitive): pointer-resize, collapse-expand, lazy-resize, double-click-reset. [Source](https://ant.design/components/splitter) (checked 2026-09-28).
- **Chakra/Ark** (primitive): pointer-resize, keyboard-resize, collapse-expand. [Source](https://chakra-ui.com/docs/components/splitter) (checked 2026-09-28).
- **Chakra/Ark** (adjacent): pointer-resize, pointer-move, minimize-maximize. [Source](https://chakra-ui.com/docs/components/floating-panel) (checked 2026-09-28).
- **Atlassian** (component): pointer-resize, collapse-expand. [Source](https://atlassian.design/components/panel/examples) (checked 2026-09-28).
- **GOV.UK** (different-job): confirm-completion. [Source](https://design-system.service.gov.uk/components/panel/) (checked 2026-09-28).
- **Apple HIG** (guidance): pointer-resize, collapse-expand. [Source](https://developer.apple.com/design/human-interface-guidelines/split-views) (checked 2026-09-28).

## Area today

sm/md inspector, flush docking, bare bar, action column, sections and pinned footer. Start/end edge width resizing has pointer/keyboard bounds and cancellation. Collapsible sections exist; collapse-to-zero and height resizing are explicitly excluded. General split panes remain a different job. [Baseline spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1).

- Exact manifest axes: size = sm, md. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424).
- Boolean modifiers: flush, bare-bar, action-column. Runtime state hooks: collapsed, resizable, resizing. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424).
- Slots: resize, bar, title, body, section, heading, heading-text, actions, toggle, toggle-text, chevron, summary, rows, row, row-label, row-controls, row-action, stack, footer. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424).

Resizing scope and exclusions: [resizable-panel spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/resizable-panel.md#L12-L29).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `interaction:confirm-completion`, `interaction:double-click-reset`, `interaction:lazy-resize`, `interaction:minimize-maximize`, `interaction:pointer-move`, `orientation:horizontal`, `orientation:vertical`, `resize-axis:e`, `resize-axis:n`, `resize-axis:ne`, `resize-axis:nw`, `resize-axis:s`, `resize-axis:se`, `resize-axis:sw`, `resize-axis:w`, `stage:default`, `stage:maximized`, `stage:minimized`, `structure:close-button`, `structure:confirmation-panel`, `structure:floating-surface`, `structure:interruption-panel`, `structure:split-panes`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1-L189).
- **yes**: `interaction:keyboard-resize`, `interaction:pointer-resize`, `size:md`, `size:sm`, `structure:footer`, `structure:header`, `structure:resizable-panel`, `structure:resize-handle`, `structure:row-actions`, `structure:sections`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1-L189).
- **composition**: `structure:sidebar`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1-L189).
- **partial**: `interaction:collapse-expand`. [Manifest](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1-L189).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424), [2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1).
  - Individual options: `size:sm` (0 direct; Area: yes); `size:md` (0 direct; Area: yes).
- **Layer 3 · Header, sections, action column and pinned footer** — 1 direct systems; 3 supporting/adjacent systems. Direct: Atlassian. Keep Area’s inspector job; general splitters are supporting primitives rather than equivalent inspectors. Evidence: [1](https://atlassian.design/components/panel/examples), [2](https://chakra-ui.com/docs/components/floating-panel), [3](https://primer.style/product/components/split-page-layout/), [4](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section).
  - Individual options: `structure:header` (1 direct; Area: yes); `structure:footer` (1 direct; Area: yes); `structure:sections` (0 direct; Area: yes).
- **Layer 3 · Resizable edge with keyboard parity** — 1 direct systems; 4 supporting/adjacent systems; 1 guidance systems. Direct: Atlassian. Retain current width resizing and document bounds/cancel behavior. Evidence: [1](https://ant.design/components/splitter), [2](https://atlassian.design/components/panel/examples), [3](https://chakra-ui.com/docs/components/floating-panel), [4](https://chakra-ui.com/docs/components/splitter), [5](https://developer.apple.com/design/human-interface-guidelines/split-views), [6](https://mantine.dev/core/splitter), [7](https://ui.shadcn.com/docs/components/resizable).
  - Individual options: `interaction:pointer-resize` (1 direct; Area: yes); `interaction:keyboard-resize` (0 direct; Area: yes).
- **Layer 3 · General split panes as a separate composition** — 0 direct systems; 5 supporting/adjacent systems; 1 guidance systems. Direct: none verified as a direct implementation/example. Route this to the layout backlog, not an implicit extension of Panel’s one-edge inspector resizing. Evidence: [1](https://ant.design/components/splitter), [2](https://chakra-ui.com/docs/components/splitter), [3](https://developer.apple.com/design/human-interface-guidelines/split-views), [4](https://mantine.dev/core/splitter), [5](https://primer.style/product/components/split-page-layout/), [6](https://ui.shadcn.com/docs/components/resizable).
  - Individual options: `structure:split-panes` (0 direct; Area: not found).
- **Layer 3 · Optional floating inspector recipe** — 0 direct systems; 1 supporting/adjacent systems. Direct: none verified as a direct implementation/example. Explore only after owner selection; it adds move, resize and window-state behavior. Evidence: [1](https://chakra-ui.com/docs/components/floating-panel).
  - Individual options: `structure:floating-surface` (0 direct; Area: not found); `interaction:minimize-maximize` (0 direct; Area: not found).

## Sources

- Area: [manifest, lines 416–424](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L416-L424); [spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/panel.md#L1). All Area judgments refer to starting commit `c585f8c5f38705a7efa79bf05148a8c6989b142a`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: panel, inspector, splitter, split view (exclude confirmation Panel). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for panel, inspector, splitter, split view (exclude confirmation Panel). No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/resizable); checked 2026-09-28.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for panel, inspector, splitter, split view (exclude confirmation Panel). No independently verified option recorded; see the audit for lookup limitations.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for panel, inspector, splitter, split view (exclude confirmation Panel). No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2 — not found**: checked [catalogue](https://react-spectrum.adobe.com/) on 2026-09-28 for panel, inspector, splitter, split view (exclude confirmation Panel). No independently verified option recorded; see the audit for lookup limitations.
- **Fluent 2 — not found**: checked [catalogue](https://fluent2.microsoft.design/components/web/react) on 2026-09-28 for panel, inspector, splitter, split view (exclude confirmation Panel). No independently verified option recorded; see the audit for lookup limitations.
- **Primer**: [source 1](https://primer.style/product/components/split-page-layout/); checked 2026-09-28.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for panel, inspector, splitter, split view (exclude confirmation Panel). No independently verified option recorded; see the audit for lookup limitations.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for panel, inspector, splitter, split view (exclude confirmation Panel). No independently verified option recorded; see the audit for lookup limitations.
- **Mantine**: [source 1](https://mantine.dev/core/splitter); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/splitter); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/floating-panel), [source 2](https://chakra-ui.com/docs/components/splitter); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/panel/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section); checked 2026-09-28.
- **GOV.UK**: [source 1](https://design-system.service.gov.uk/components/panel/); checked 2026-09-28.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/split-views); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/split-views.json). Platform guidance is counted separately.

GOV.UK Panel is a confirmation/interruption message, not an inspector. Splitter references establish resizing primitives, not a complete inspector.
