# ScrollToLatest — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Returns a long conversation to its newest message. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457).

Boundary: Round outline button appears away from the end, is unfocusable when hidden, scrolls smoothly or instantly with reduced motion. Stream following, history anchoring and arbitrary-message navigation are not described. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/scroll-to-latest.md#L1).

## Variant axes

- **Ant Design** (adjacent): shape: circle, square. [Source](https://ant.design/components/float-button) (checked 2026-09-28).

## Structural alternatives

- **shadcn/ui** (component): floating-button, new-content-indicator. [Source](https://ui.shadcn.com/docs/components/message-scroller) (checked 2026-09-28).
- **Ant Design** (adjacent): floating-button. [Source](https://ant.design/components/float-button) (checked 2026-09-28).

## Interaction patterns

- **scroll-to-latest**: [shadcn/ui](https://ui.shadcn.com/docs/components/message-scroller) (checked 2026-09-28).
- **pause-follow-on-user-intent**: [shadcn/ui](https://ui.shadcn.com/docs/components/message-scroller) (checked 2026-09-28).
- **resume-follow**: [shadcn/ui](https://ui.shadcn.com/docs/components/message-scroller) (checked 2026-09-28).
- **history-anchor**: [shadcn/ui](https://ui.shadcn.com/docs/components/message-scroller) (checked 2026-09-28).
- **message-jump**: [shadcn/ui](https://ui.shadcn.com/docs/components/message-scroller) (checked 2026-09-28).
- **scroll-to-top**: [Ant Design](https://ant.design/components/float-button) (checked 2026-09-28).

## Area today

Round outline button appears away from the end, is unfocusable when hidden, scrolls smoothly or instantly with reduced motion. Stream following, history anchoring and arbitrary-message navigation are not described. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/scroll-to-latest.md#L1).

- Exact manifest axes: none. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457).
- Boolean modifiers: none declared. Runtime state hooks: visible. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457).
- Slots: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:scroll-to-latest`, `shape:circle`, `structure:floating-button`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/scroll-to-latest.md#L1-L41).
- **not found**: `interaction:history-anchor`, `interaction:message-jump`, `interaction:pause-follow-on-user-intent`, `interaction:resume-follow`, `interaction:scroll-to-top`, `shape:square`, `structure:new-content-indicator`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/scroll-to-latest.md#L1-L41).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. No design-time variant axis is declared today; keep this focused recipe and choose structural extensions below before introducing additional paint axes. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/scroll-to-latest.md#L1).
- **Layer 2 · Explicit follow/paused/resume behavior** — 1 direct systems. Direct: shadcn/ui. Preserve a reader’s position during streaming rather than pulling them to the end. Evidence: [1](https://ui.shadcn.com/docs/components/message-scroller).
  - Individual options: `interaction:pause-follow-on-user-intent` (1 direct; Area: not found); `interaction:resume-follow` (1 direct; Area: not found).
- **Layer 3 · New-content indicator beside the jump action** — 1 direct systems. Direct: shadcn/ui. Optional information anatomy beyond Area’s existing icon-only button. Evidence: [1](https://ui.shadcn.com/docs/components/message-scroller).
  - Individual options: `structure:new-content-indicator` (1 direct; Area: not found).
- **Layer 3 · History and message anchors in a transcript wrapper** — 1 direct systems. Direct: shadcn/ui. Keep this in a conversation-scroll composition; the button alone should not own transcript state. Evidence: [1](https://ui.shadcn.com/docs/components/message-scroller).
  - Individual options: `interaction:history-anchor` (1 direct; Area: not found); `interaction:message-jump` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 451–457](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L451-L457); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/scroll-to-latest.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: scroll to latest, message scroller, back to top (opposite direction). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/message-scroller); checked 2026-09-28.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2 — not found**: checked [catalogue](https://react-spectrum.adobe.com/) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Fluent 2 — not found**: checked [catalogue](https://fluent2.microsoft.design/components/web/react) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Mantine — not found**: checked [catalogue](https://mantine.dev/core/package/) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Ant Design**: [source 1](https://ant.design/components/float-button); checked 2026-09-28.
- **Chakra/Ark — not found**: checked [catalogue](https://chakra-ui.com/docs/components/concepts/overview) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for scroll to latest, message scroller, back to top (opposite direction). No independently verified option recorded; see the audit for lookup limitations.
