# Errors and system states

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="recoverable-error"></a>
## Recoverable section or page failure

**Purpose.** Explain what failed and offer a useful next action while preserving available work.

**Anatomy, in order (proposal).**

1. Task context
2. Error heading and explanation
3. Retained content where available
4. Retry or alternate action
5. Support information

**Required components → Area families.**

- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Code: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L632); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/code.md#L95).
- Result / ErrorState recipe → Alert, Card, Button: **recipe**. No named Result export found. Compose semantic content and recovery actions; avoid conflating different failures. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/result.md#L60).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Inline section failure.
- Whole-page service failure.
- Permission or eligibility explanation.

**Responsive proposal.** Keep the explanation before recovery actions; let diagnostics wrap or scroll inside their own region. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Retry behavior, connectivity and permission decisions come from the app. Do not conflate validation failure, lack of access and downtime.

**Source observations.**

- [GOV.UK — Service unavailable pages](https://design-system.service.gov.uk/patterns/service-unavailable-pages/) (guidance; checked 2026-09-28). Service interruption needs a dedicated explanation and next steps, distinct from field validation.
- [Primer — Degraded experiences](https://primer.style/product/ui-patterns/degraded-experiences/) (guidance; checked 2026-09-28). Keep primary experiences available when optional service dependencies fail.
- [GOV.UK — Recover from validation errors](https://design-system.service.gov.uk/patterns/validation/) (guidance; checked 2026-09-28). Retain entered answers; link a focused error summary to errors at fields; distinguish invalid input from service or permission problems.

<a id="not-found"></a>
## Missing destination

**Purpose.** Help someone recover from a page or item that cannot be located.

**Anatomy, in order (proposal).**

1. Site or application identity
2. Missing-page heading
3. Explanation
4. Navigation to a useful destination
5. Optional help

**Required components → Area families.**

- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Nav: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L652); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/nav.md#L56).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Result / ErrorState recipe → Alert, Card, Button: **recipe**. No named Result export found. Compose semantic content and recovery actions; avoid conflating different failures. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L133); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/result.md#L60).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Unknown route.
- Deleted resource.
- Moved content with a known replacement.

**Responsive proposal.** Use a short linear page; keep recovery navigation visible before decorative content. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Route resolution and disclosure of resource existence are application policies. The component recipe only presents the result.

**Source observations.**

- [GOV.UK — Page not found pages](https://design-system.service.gov.uk/patterns/page-not-found-pages/) (guidance; checked 2026-09-28). Missing destinations need a comprehensible explanation and a route to continue.

<a id="loading-progress"></a>
## Loading and long-running task

**Purpose.** Communicate waiting without losing the shape or context of the task.

**Anatomy, in order (proposal).**

1. Task heading or retained content
2. Placeholder or busy feedback
3. Progress and status text when known
4. Cancel or background action when supported
5. Completion or retry

**Required components → Area families.**

- Skeleton: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L398); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/skeleton.md#L46).
- Spinner: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L407); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/spinner.md#L58).
- Progress: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L415); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/progress.md#L67).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Alert: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L532); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/alert.md#L189).
- Toast: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L585); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/toast.md#L62).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Initial skeleton.
- Local refresh.
- Determinate job progress.
- Indeterminate wait.

**Responsive proposal.** Preserve content order across placeholder and loaded states; prevent busy indicators from blocking the only cancel or recovery control. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** Progress must be backed by meaningful work units. Cancellation and background execution require actual app support; a Spinner does not estimate completion.

**Source observations.**

- [Primer — Loading](https://primer.style/product/ui-patterns/loading/) (guidance; checked 2026-09-28). Guidance for communicating loading and choosing placeholder or busy feedback.
- [Polaris — Homepage template](https://shopify.dev/docs/api/app-home/latest/patterns/templates/homepage) (template; checked 2026-09-28). Combines actionable status, metrics and onboarding guidance at the app entry point.
