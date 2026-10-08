# Chat and AI assistant

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="assistant-thread"></a>
## AI assistant conversation

**Purpose.** Let a person iteratively ask, inspect and refine an assistant response.

**Anatomy, in order (proposal).**

1. Conversation title and model choice
2. Prompt suggestions when empty
3. User and assistant transcript
4. Response code, citations and actions
5. Scroll-to-latest affordance
6. Composer and send/stop actions

**Required components → Area families.**

- Message: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L459); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/message.md#L33).
- Composer: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L188); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/composer.md#L83).
- ModelPicker: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L443); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/model-picker.md#L34).
- PromptSuggestions: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L468); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/prompt-suggestions.md#L26).
- ScrollToLatest: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L451); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/scroll-to-latest.md#L25).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- CodeBlock: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L641); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/code-block.md#L89).
- Code: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L632); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/code.md#L95).
- Toolbar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L76); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toolbar.md#L42).
- HoverCard: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L476); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/hover-card.md#L123).
- Chip: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L291); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/chip.md#L213).
- Spinner: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L407); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/spinner.md#L58).
- SourceChip recipe → Chip, HoverCard: **recipe**. No independent citation family found. Compose Chip and HoverCard; source identity and validity belong to the application. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L182); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/source-chip.md#L29).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Centered thread.
- Thread in an application shell.
- Text response with cited resources.

**Extra requirements for expanded variants.**

- AttachmentCard recipe — **recipe**. No standalone AttachmentCard found. File identity/progress can compose existing controls; actual upload is a separate dependency. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/attachment-card.md#L64).
- FileUpload / DropZone — **missing**. Native file selection can use Input, but a reusable drop zone, file validation and per-file lifecycle contract are not found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/file-upload.md#L142).
- ThinkingDisclosure recipe — **recipe**. No dedicated process-disclosure contract found. A collapsible status section can reuse Panel; timers and event data remain application-owned. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/thinking-disclosure.md#L29).

**Responsive proposal.** Make the transcript one column, constrain wide code to its own scrolling region and keep the composer reachable above the input keyboard. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** An Area synthesis, not an upstream complete AI-chat template. Streaming transport, transcript anchoring, cancellation and citation validity are app contracts; Message streaming paint does not implement them.

**Source observations.**

- [Atlassian — AI interaction guidelines](https://atlassian.design/rovo-ui/ai-interaction-guidelines) (guidance; checked 2026-09-28). Keep AI controls in the working surface, carry task state across transitions and expose system state and ways to course-correct.
- [Untitled UI — Messaging](https://www.untitledui.com/react/components/messaging) (public-examples; checked 2026-09-28). Public examples name minimal, textarea and advanced message actions, reactions and image messages.

<a id="assistant-sidecar"></a>
## Assistant beside a working document

**Purpose.** Ask for contextual help while keeping the active work visible.

**Anatomy, in order (proposal).**

1. Working document
2. Assistant trigger
3. Context summary
4. Conversation or suggestions
5. Proposed output and apply action
6. Composer

**Required components → Area families.**

- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- Message: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L459); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/message.md#L33).
- Composer: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L188); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/composer.md#L83).
- PromptSuggestions: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L468); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/prompt-suggestions.md#L26).
- ModelPicker: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L443); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/model-picker.md#L34).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Inline support pane.
- Overlay on demand.
- Suggested edit with explicit apply/reject.

**Extra requirements for expanded variants.**

- Drawer / Sheet — **partial**. Dialog and Panel exist; no dedicated edge-sheet presentation and responsive modality contract found. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/drawer.md#L139).
- General Splitter — **partial**. Panel already has keyboard/pointer resizing. A general coordinated multi-pane splitter is not found; do not rebuild Panel resizing. [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/splitter.md#L98).

**Responsive proposal.** Switch between work and assistant as separate narrow views while retaining the referenced selection; never require both panes to remain squeezed together. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Context capture, edit previews and applying edits are product work. Applying a suggestion must target a known document state; a visible apply button supplies no conflict handling.

**Source observations.**

- [Atlassian — AI interaction guidelines](https://atlassian.design/rovo-ui/ai-interaction-guidelines) (guidance; checked 2026-09-28). Keep AI controls in the working surface, carry task state across transitions and expose system state and ways to course-correct.
- [Material — Canonical layouts (official Android guidance)](https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts) (platform-guidance; checked 2026-09-28). Material-derived list-detail, feed and supporting-pane layouts preserve state as panes change visibility; editor tools and document comments are supporting-pane examples.
- [Fluent — Drawer usage](https://fluent2.microsoft.design/components/web/react/core/drawer/usage) (component-guidance; checked 2026-09-28). Inline and overlay drawers differ; drawers provide supplemental context or short related tasks, with local status feedback.
