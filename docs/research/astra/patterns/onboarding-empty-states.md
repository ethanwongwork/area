# Onboarding and empty states

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="setup-checklist"></a>
## Setup checklist

**Purpose.** Make initial setup resumable and show the next useful action.

**Anatomy, in order (proposal).**

1. Welcome and outcome
2. Completion progress
3. Ordered setup tasks
4. Expanded current task
5. Continue and dismiss controls

**Required components → Area families.**

- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- Progress: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L415); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/progress.md#L67).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Checkbox: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L224); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/checkbox.md#L315).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- Accordion / Disclosure recipe → Panel, Button: **recipe**. PanelSection already collapses. No standalone Accordion group API found; reuse PanelSection or native details for simple sections. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L130); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/accordion.md#L134).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Persistent home checklist.
- Expandable task cards.
- Required setup followed by optional tasks.

**Responsive proposal.** Keep tasks in a single readable order; expand one task inline instead of squeezing a checklist beside instructions. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Progress must reflect completed tasks, not checked decoration. The app owns prerequisites, resume state and whether dismissal is allowed.

**Source observations.**

- [Polaris — Setup guide](https://shopify.dev/docs/api/app-home/latest/patterns/compositions/setup-guide) (composition; checked 2026-09-28). Interactive onboarding checklist with progress tracking and expandable steps.
- [Apple HIG — Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) (platform-guidance; checked 2026-09-28). Favor brief interactive education, optional tutorials and context-specific tips; postpone nonessential setup. Read via [official documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/onboarding.json).
- [Primer — Feature onboarding](https://primer.style/product/ui-patterns/feature-onboarding/) (guidance; checked 2026-09-28). Product feature education is distinct from marketing; use it as guidance for introducing a feature.

<a id="first-use-empty"></a>
## First-use empty workspace

**Purpose.** Explain an empty collection and make its first useful action clear.

**Anatomy, in order (proposal).**

1. Collection heading
2. Empty-state heading
3. Reason or short explanation
4. Primary creation action
5. Optional learning link

**Required components → Area families.**

- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- EmptyState recipe → Card, Button: **recipe**. No named EmptyState export found. Headings, explanation and a useful action are composable. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/empty-state.md#L100).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Full workspace empty.
- Empty section in a populated dashboard.
- Onboarding prompt with a sample item.

**Responsive proposal.** Keep explanatory text and the primary action together; decorative artwork is optional and can yield space. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Distinguish never-created data from filtered results and access failures. Creating a sample requires app state; the catalogue does not claim sample-data behavior.

**Source observations.**

- [Primer — Empty states](https://primer.style/product/ui-patterns/empty-states/) (guidance; checked 2026-09-28). Covers spaces without content, including initial use and temporarily empty results.
- [Primer — Feature onboarding](https://primer.style/product/ui-patterns/feature-onboarding/) (guidance; checked 2026-09-28). Product feature education is distinct from marketing; use it as guidance for introducing a feature.

<a id="contextual-onboarding"></a>
## Contextual feature introduction

**Purpose.** Teach a feature when its related task is available.

**Anatomy, in order (proposal).**

1. Relevant control or region
2. Anchored explanation
3. Try or next action
4. Dismiss or skip
5. Return to the original task

**Required components → Area families.**

- Popover: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L549); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/popover.md#L54).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Kbd: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L670); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/kbd.md#L103).
- Count: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L336); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/README-3.md#L105). The range survey explicitly excludes Count; its current availability is established by the pinned main manifest and spec.

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- One anchored hint.
- Optional sequence.
- Inline learning card.

**Responsive proposal.** On narrow screens use an inline explanation when an anchored surface would cover the target; preserve focus and a dismissal path. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** A single hint composes existing primitives. Multi-step tour positioning, progress and persistence need recipe logic; no tour manager was found in the Area exports.

**Source observations.**

- [Apple HIG — Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding) (platform-guidance; checked 2026-09-28). Favor brief interactive education, optional tutorials and context-specific tips; postpone nonessential setup. Read via [official documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/onboarding.json).
- [Primer — Feature onboarding](https://primer.style/product/ui-patterns/feature-onboarding/) (guidance; checked 2026-09-28). Product feature education is distinct from marketing; use it as guidance for introducing a feature.
