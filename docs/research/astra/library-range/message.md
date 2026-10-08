# Message — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

One turn in a conversation: the person's bubble or the assistant's prose, with actions. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466).

Boundary: User bubble and assistant prose, named articles, action rows and streaming state are built. Rich content composes other components. Avatar/header/footer/reactions and sender grouping are not declared slots. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/message.md#L1).

## Variant axes

- **shadcn/ui** (component): alignment: start, end. [Source](https://ui.shadcn.com/docs/components/message) (checked 2026-09-28).
- **shadcn/ui** (component): variant: default, secondary, muted, tinted, outline, ghost, destructive; alignment: start, end. [Source](https://ui.shadcn.com/docs/components/bubble) (checked 2026-09-28).
- **Ant Design** (component): variant: filled, outlined, shadow, borderless; placement: start, end; shape: default, round, corner; state: loading, updating, success, error, abort. [Source](https://x.ant.design/components/bubble) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (example): bubble, avatar, timestamp, attachments. [Source](https://www.untitledui.com/react/components/messaging) (checked 2026-09-28).
- **shadcn/ui** (component): avatar, header, footer, action-row, sender-group, attachments. [Source](https://ui.shadcn.com/docs/components/message) (checked 2026-09-28).
- **shadcn/ui** (component): bubble, unframed-prose, reactions, sender-group, collapsible-content. [Source](https://ui.shadcn.com/docs/components/bubble) (checked 2026-09-28).
- **Ant Design** (component): bubble, unframed-prose, avatar, header, footer, action-row. [Source](https://x.ant.design/components/bubble) (checked 2026-09-28).
- **Atlassian** (adjacent): avatar, author, timestamp, action-row, nested-replies. [Source](https://atlassian.design/components/comment/examples) (checked 2026-09-28).

## Interaction patterns

- **conversation-layout**: [Untitled UI](https://www.untitledui.com/react/components/messaging), [shadcn/ui](https://ui.shadcn.com/docs/components/message) (checked 2026-09-28).
- **collapse-expand**: [shadcn/ui](https://ui.shadcn.com/docs/components/bubble) (checked 2026-09-28).
- **streaming**: [Ant Design](https://x.ant.design/components/bubble) (checked 2026-09-28).
- **typing-animation**: [Ant Design](https://x.ant.design/components/bubble) (checked 2026-09-28).
- **auto-scroll**: [Ant Design](https://x.ant.design/components/bubble) (checked 2026-09-28).
- **comment-actions**: [Atlassian](https://atlassian.design/components/comment/examples) (checked 2026-09-28).

## Area today

User bubble and assistant prose, named articles, action rows and streaming state are built. Rich content composes other components. Avatar/header/footer/reactions and sender grouping are not declared slots. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/message.md#L1).

- Exact manifest axes: author = user, assistant. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466).
- Boolean modifiers: none declared. Runtime state hooks: streaming. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466).
- Slots: bubble, content, actions, cursor. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `alignment:end`, `alignment:start`, `author:assistant`, `author:user`, `interaction:streaming`, `structure:action-row`, `structure:bubble`, `structure:unframed-prose`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/message.md#L1-L73).
- **not found**: `interaction:auto-scroll`, `interaction:collapse-expand`, `interaction:comment-actions`, `interaction:conversation-layout`, `interaction:typing-animation`, `placement:end`, `placement:start`, `shape:corner`, `shape:default`, `shape:round`, `state:abort`, `state:error`, `state:loading`, `state:success`, `state:updating`, `structure:author`, `structure:avatar`, `structure:collapsible-content`, `structure:footer`, `structure:header`, `structure:nested-replies`, `structure:reactions`, `structure:sender-group`, `structure:timestamp`, `variant:borderless`, `variant:default`, `variant:destructive`, `variant:filled`, `variant:ghost`, `variant:muted`, `variant:outline`, `variant:outlined`, `variant:secondary`, `variant:shadow`, `variant:tinted`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/message.md#L1-L73).
- **composition**: `structure:attachments`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/message.md#L1-L73).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/message.md#L1).
  - Individual options: `author:user` (0 direct; Area: yes); `author:assistant` (0 direct; Area: yes).
- **Layer 2 · Bubble surface choices: filled, quiet, outline and unframed** — 2 direct systems. Direct: Ant Design, shadcn/ui. Separate author identity from visual treatment and alignment. Evidence: [1](https://ui.shadcn.com/docs/components/bubble), [2](https://x.ant.design/components/bubble).
  - Individual options: `variant:filled` (1 direct; Area: not found); `variant:muted` (1 direct; Area: not found); `variant:tinted` (1 direct; Area: not found); `variant:outline` (1 direct; Area: not found); `variant:outlined` (1 direct; Area: not found); `variant:ghost` (1 direct; Area: not found); `variant:borderless` (1 direct; Area: not found).
- **Layer 3 · Avatar, header/footer and delivery metadata** — 3 direct systems; 1 supporting/adjacent systems. Direct: Ant Design, Untitled UI, shadcn/ui. Serve team conversation as well as assistant prose without changing Message into a transport layer. Evidence: [1](https://atlassian.design/components/comment/examples), [2](https://ui.shadcn.com/docs/components/message), [3](https://www.untitledui.com/react/components/messaging), [4](https://x.ant.design/components/bubble).
  - Individual options: `structure:avatar` (3 direct; Area: not found); `structure:header` (2 direct; Area: not found); `structure:footer` (2 direct; Area: not found); `structure:timestamp` (1 direct; Area: not found).
- **Layer 3 · Consecutive-sender grouping and reactions** — 1 direct systems. Direct: shadcn/ui. Offer message grouping and reactions as optional anatomy, retaining one-turn semantics. Evidence: [1](https://ui.shadcn.com/docs/components/bubble), [2](https://ui.shadcn.com/docs/components/message).
  - Individual options: `structure:sender-group` (1 direct; Area: not found); `structure:reactions` (1 direct; Area: not found).
- **Layer 2 · Streaming, loading and failed delivery** — 1 direct systems. Direct: Ant Design. Extend runtime states; keep animation policy in the motion system. Evidence: [1](https://x.ant.design/components/bubble).
  - Individual options: `interaction:streaming` (1 direct; Area: yes); `state:loading` (1 direct; Area: not found); `state:error` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 459–466](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L459-L466); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/message.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: message, messaging, bubble, comment (exclude status Message). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/messaging); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/bubble), [source 2](https://ui.shadcn.com/docs/components/message); checked 2026-09-28.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Base UI — not found**: checked [catalogue](https://base-ui.com/react/overview/quick-start) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **React Aria / Spectrum 2 — not found**: checked [catalogue](https://react-spectrum.adobe.com/) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Fluent 2 — not found**: checked [catalogue](https://fluent2.microsoft.design/components/web/react) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Primer — not found**: checked [catalogue](https://primer.style/product/components/) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Material 3 — not found**: checked [catalogue](https://m3.material.io/components) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Mantine — not found**: checked [catalogue](https://mantine.dev/core/package/) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Ant Design**: [source 1](https://x.ant.design/components/bubble); checked 2026-09-28.
- **Chakra/Ark — not found**: checked [catalogue](https://chakra-ui.com/docs/components/concepts/overview) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Atlassian**: [source 1](https://atlassian.design/components/comment/examples); checked 2026-09-28.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG — not found**: checked [catalogue](https://developer.apple.com/design/human-interface-guidelines/components) on 2026-09-28 for message, messaging, bubble, comment (exclude status Message). No independently verified option recorded; see the audit for lookup limitations.

Ant Design’s core Message is status feedback, not a conversation turn; Ant Design X Bubble is the direct comparison used here. Atlassian Comment is adjacent, not an assistant message runtime.
