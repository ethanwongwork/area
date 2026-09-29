# PromptSuggestions — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Starter prompts under an empty composer. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474).

Boundary: List is the default; chips are the second layout. List items have optional dismiss controls; the chip recipe has no dismiss. Activation is consumer-owned (fill or send). Descriptions and grouped suggestion cards are not declared. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/prompt-suggestions.md#L1).

## Variant axes

- **shadcn/ui** (recipe): variant: default, secondary, muted, tinted, outline, ghost, destructive. [Source](https://ui.shadcn.com/docs/components/bubble) (checked 2026-09-28).
- **Ant Design** (component): orientation: horizontal, vertical; state: disabled. [Source](https://x.ant.design/components/prompts) (checked 2026-09-28).

## Structural alternatives

- **shadcn/ui** (recipe): button-bubble. [Source](https://ui.shadcn.com/docs/components/bubble) (checked 2026-09-28).
- **Ant Design** (component): icons, description, wrap. [Source](https://x.ant.design/components/prompts) (checked 2026-09-28).

## Interaction patterns

- **activate-prompt**: [Ant Design](https://x.ant.design/components/prompts), [shadcn/ui](https://ui.shadcn.com/docs/components/bubble) (checked 2026-09-28).

## Area today

List is the default; chips are the second layout. List items have optional dismiss controls; the chip recipe has no dismiss. Activation is consumer-owned (fill or send). Descriptions and grouped suggestion cards are not declared. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/prompt-suggestions.md#L1).

- Exact manifest axes: layout = list, chips. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474).
- Boolean modifiers: none declared. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474).
- Slots: row, item, icon, text, dismiss. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **not found**: `orientation:horizontal`, `orientation:vertical`, `state:disabled`, `structure:description`, `variant:default`, `variant:destructive`, `variant:ghost`, `variant:muted`, `variant:outline`, `variant:secondary`, `variant:tinted`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/prompt-suggestions.md#L1-L77).
- **yes**: `interaction:activate-prompt`, `layout:chips`, `layout:list`, `structure:icons`, `structure:wrap`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/prompt-suggestions.md#L1-L77).
- **partial**: `structure:button-bubble`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/prompt-suggestions.md#L1-L77).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/prompt-suggestions.md#L1).
  - Individual options: `layout:list` (0 direct; Area: yes); `layout:chips` (0 direct; Area: yes).
- **Layer 3 · Optional icon and description cards** — 1 direct systems. Direct: Ant Design. Add a richer anatomy to list/chips while preserving button activation. Evidence: [1](https://x.ant.design/components/prompts).
  - Individual options: `structure:description` (1 direct; Area: not found); `structure:icons` (1 direct; Area: yes).
- **Layer 3 · Horizontal/wrapping and vertical layouts** — 1 direct systems. Direct: Ant Design. Retain the existing list/chips distinction; keep selection and send behavior consumer-owned. Evidence: [1](https://x.ant.design/components/prompts).
  - Individual options: `orientation:horizontal` (1 direct; Area: not found); `orientation:vertical` (1 direct; Area: not found); `structure:wrap` (1 direct; Area: yes).
- **Layer 2 · Disabled suggestions** — 1 direct systems. Direct: Ant Design. Offer an explicit unavailable state; avoid treating a suggestion as a selected filter chip. Evidence: [1](https://x.ant.design/components/prompts).
  - Individual options: `state:disabled` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 468–474](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L468-L474); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/prompt-suggestions.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: prompt suggestions, prompts, suggested reply. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/bubble); checked 2026-09-28.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2 — not found**: checked [catalogue](https://react-spectrum.adobe.com/) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Fluent 2 — not found**: checked [catalogue](https://fluent2.microsoft.design/components/web/react) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Mantine — not found**: checked [catalogue](https://mantine.dev/core/package/) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Ant Design**: [source 1](https://x.ant.design/components/prompts); checked 2026-09-28.
- **Chakra/Ark — not found**: checked [catalogue](https://chakra-ui.com/docs/components/concepts/overview) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for prompt suggestions, prompts, suggested reply. No independently verified option recorded; see the audit for lookup limitations.
