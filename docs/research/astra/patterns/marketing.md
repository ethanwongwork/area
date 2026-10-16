# Marketing

Checked 2026-09-28. [Method, status meanings and priorities](README.md).

These are proposed Area recipes informed by the cited public examples and guidance. Anatomy is the proposed reading order; variations are candidates to offer, not a claim that every source implements them. Responsive behavior is an Area recommendation unless a source observation explicitly says otherwise. No dimensions are inferred from images.

Component availability is pinned to `18b86465d542f620d532fee351c4f28d50c8ac3a`. `recipe` means reusable packaging is absent but the baseline is composable; `partial` and `missing` identify additional shared behavior or adapters. Native headings, paragraphs, links, lists, forms and layout CSS remain valid building blocks.

<a id="hero"></a>
## Marketing hero and entry

**Purpose.** Explain the product promise and make the next step clear.

**Anatomy, in order (proposal).**

1. Site navigation
2. Announcement or eyebrow
3. Headline and supporting copy
4. Primary and secondary actions
5. Product preview or visual
6. Trust evidence

**Required components → Area families.**

- Nav: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L652); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/nav.md#L56).
- BadgeGroup: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L360); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge-group.md#L39).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Avatar: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L368); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/avatar.md#L173).
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Centered copy.
- Split copy and visual.
- Product screenshot below headline.

**Responsive proposal.** Stack copy before the supporting visual; keep the main action early and reduce navigation through an explicit menu. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** A proposed Area mapping of public hero examples. Copy, licensed media and conversion logic are site content, not new library primitives.

**Source observations.**

- [Untitled UI — Hero header sections](https://www.untitledui.com/react/marketing/hero-header-sections) (public-examples; checked 2026-09-28). Public hero catalogue supplies alternative landing-page introductions.

<a id="pricing-page"></a>
## Marketing pricing page

**Purpose.** Explain purchase choices and answer comparison questions before sign-up.

**Anatomy, in order (proposal).**

1. Site navigation
2. Pricing introduction
3. Billing period control
4. Plan comparison
5. Feature detail
6. Questions and contact
7. Footer

**Required components → Area families.**

- Nav: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L652); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/nav.md#L56).
- Card: **built** (review); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L520); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/card.md#L235).
- Badge: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L316); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/badge.md#L181).
- Segmented: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L621); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/segmented.md#L55).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Table: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L603); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/table.md#L60).
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- Responsive layout recipe → Panel, Card, Separator: **recipe**. No responsive layout family found. Native CSS and landmarks can implement each proposed arrangement; no breakpoint is prescribed here. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L131); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/responsive-layout.md#L111).
- Accordion / Disclosure recipe → Panel, Button: **recipe**. PanelSection already collapses. No standalone Accordion group API found; reuse PanelSection or native details for simple sections. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L130); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/accordion.md#L134).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Simple pricing cards.
- Detailed comparison.
- Contact-sales tier.

**Responsive proposal.** Stack plan cards and keep the billing interval legible; turn lower-priority detail into named disclosures without hiding key terms. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** The public page composes plan comparison with supporting content. Billing execution and price calculation remain outside the pattern.

**Source observations.**

- [Untitled UI — Pricing sections](https://www.untitledui.com/react/marketing/pricing-sections) (public-examples; checked 2026-09-28). Public example names include simple/featured cards, banners and large comparison tables.
- [Untitled UI — FAQ sections](https://www.untitledui.com/react/marketing/faq-sections) (public-examples; checked 2026-09-28). Public FAQ catalogue provides question-and-answer layouts; accordion example documents disclosure.

<a id="faq"></a>
## FAQ and help section

**Purpose.** Answer recurring questions without interrupting a visitor’s main decision.

**Anatomy, in order (proposal).**

1. Section heading
2. Question groups
3. Question and answer pairs
4. Optional contact action

**Required components → Area families.**

- Panel: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L424); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/panel.md#L43).
- Button: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L35); [range cross-check](https://github.com/ethanwongwork/area/blob/e5c82a40b1a5b7025f32a26fbbee7a8c93b0568a/docs/research/library-range/button.md#L303).
- Separator: **built** (complete); [pinned manifest](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/packages/styles/src/manifest.ts#L389); [range cross-check](https://github.com/ethanwongwork/area/blob/969d91e60b1cd565d12aa84e0c8ee7162f9a501c/docs/research/library-range/separator.md#L48).
- Accordion / Disclosure recipe → Panel, Button: **recipe**. PanelSection already collapses. No standalone Accordion group API found; reuse PanelSection or native details for simple sections. [inventory](https://github.com/ethanwongwork/area/blob/18b86465d542f620d532fee351c4f28d50c8ac3a/docs/COMPONENTS.md#L130); [range cross-check](https://github.com/ethanwongwork/area/blob/7435813c947188664c665dc59f5fa0ffc5de4e8c/docs/research/library-range/accordion.md#L134).

**What Area lacks for this baseline.** No additional primitive or adapter is identified. Any recipe entries above still need composition and application state; this is not a shipped screen.

**Common variations to catalogue.**

- Always-visible answers.
- Accordion.
- Grouped categories with navigation.

**Responsive proposal.** Use one reading column and allow long question labels to wrap; preserve the expanded answer during reflow. General layout basis: [Fluent — Layout](https://fluent2.microsoft.design/layout).

**Behavior boundary.** PanelSection can provide a local collapsible section. A dedicated Accordion API and group policy are not exported; an always-visible baseline needs only semantic headings and paragraphs.

**Source observations.**

- [Untitled UI — FAQ sections](https://www.untitledui.com/react/marketing/faq-sections) (public-examples; checked 2026-09-28). Public FAQ catalogue provides question-and-answer layouts; accordion example documents disclosure.
- [Untitled UI — Accordion FAQ example](https://www.untitledui.com/react/marketing/faq-sections/faq-accordion-02-brand) (public-example; checked 2026-09-28). Explicit accordion FAQ example uses disclosure for expandable answers.
