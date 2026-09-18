# Nav audit — 2026-09-17

## Decision summary

Nav remains a composed, single-level landmark: `Nav` owns the landmark and direction;
`NavGroup` names a related run; `NavItem` is a destination with optional leading icon and
trailing annotation. It is not a tree, a command menu, or a collapsible application drawer.

This audit keeps the visual API (`orientation`, `tone`, `current`, `icon`, `trailing`, and
`disabled`) stable. It makes labelled groups programmatically discoverable, removes disabled
destinations from tab order and navigation, reduces group rhythm from 12px to 8px, and
calibrates the docs rail that demonstrates the same navigation job.

## Current Area contract

`packages/styles/src/manifest.ts` declares vertical/neutral defaults plus horizontal and
accent variants. CSS in `components/nav.css` supplies a 32px default-density vertical row,
selected plate, icon/text/trailing slots, focus ring, and horizontal overflow. `Nav.tsx`
forwards refs and native anchor properties; `current` is emitted as `aria-current="page"`.
The component provides presentation and link semantics only: it does not manage expanded
trees, current-route detection, drawer state, drag sorting, or responsive overlay behavior.

The documentation site rail uses inline Menu rather than Nav because it is a static list of
documentation links. Its group headings follow the same optical-inset contract: headings
align to text-only entries, while an icon-bearing row aligns its icon viewport to the same
content column without measuring arbitrary SVG path bounds.

## User jobs and non-goals

Use Nav to expose a short, scannable set of page destinations in a sidebar or a horizontally
scrolling product bar. Use Menu for actions, Tabs for sibling views, and a separately audited
Tree or disclosure navigation for nested/expandable information architecture. Counts and
shortcuts are annotations, not actions.

## Evidence ledger

| Benchmark | Evidence | Finding used here |
| --- | --- | --- |
| Area | Source review and Chromium measurement, 2026-09-17 | Composed links, optional icon/trailing slots, vertical and horizontal directions; no tree behavior. |
| OpenAI | No public reusable Nav specification; direct anonymous ChatGPT sidebar observation, 2026-09-17 | The expanded sidebar uses 36px rows with a 20px icon viewport and a 260px rail. This informs a documented product comparison only, not Area API or token changes. |
| Notion | [Sidebar help](https://www.notion.com/help/navigate-with-the-sidebar), Level B, 2026-09-17 | Sidebar sections may be rearranged, hidden, collapsed, and contain nested pages; those are application behavior beyond Area Nav. |
| Primer | [Product component catalog](https://primer.style/product/components/), Level A, 2026-09-17 | No current product Nav specification was available at the catalog URL; no unverified Primer API was inferred. |
| shadcn/ui | [Sidebar](https://ui.shadcn.com/docs/components/base/sidebar), Level A, 2026-09-17 | Sidebar is composable and may collapse to icons; its provider/drawer behavior is a separate shell component. |
| Fluent 2 | [React Nav](https://fluent2.microsoft.design/components/web/react/core/nav/usage), Level A, 2026-09-17 | Nav is a high-level, minimizable list of links; it supports shallow categories, icons, secondary actions, and a 260px default drawer. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties), Level A/B, 2026-09-17 | Boolean visibility, variants, text, instance swaps, and slots are distinct component-property types; Area keeps icon/trailing as orthogonal slots. |
| Vercel Geist | [Tabs guidance](https://vercel.com/geist/tabs), Level A, 2026-09-17 | Unrelated-page navigation belongs in a sub-menu rather than Tabs; Geist publishes no reusable Nav contract. |

## Benchmark comparison

| System | Boundary and structure | Layout/slots | Behavior and accessibility |
| --- | --- | --- | --- |
| Area | Landmark containing composed link groups | Vertical default; horizontal scroll; icon and trailing slots | Native anchors, `aria-current`, visible focus; disabled link is removed from navigation and tab order. |
| OpenAI | Unavailable | Unavailable | Unavailable |
| Notion | Product sidebar with sections and arbitrary nested pages | Resizable/collapsible sidebar | Reorder, hide, and collapse are product features. |
| Primer | Unavailable current Nav contract | Unavailable | Unavailable |
| shadcn/ui | Application sidebar shell | Header/footer/group/menu/button composition; icon-collapse | Provider, trigger, keyboard shortcut, mobile sheet behavior. |
| Fluent 2 | High-level app/site navigation with categories/sub-items | One shallow level, icon and secondary-action support; 260px default | Categories expand/collapse; responsive overlay at 640px; secondary actions must remain available to assistive technology. |
| Figma | Authoring model, not a runtime Nav | Variants, booleans, text, swaps, and slots | No reusable navigation behavior contract. |
| Geist | No reusable Nav component | Sub-menu is the documented alternative for unrelated pages | Tabs retain their own keyboard model and are not substituted for Nav. |

## Geometry

Before this batch, the live docs rail measured 217.09px from a saved local preference. Its
body began at 12px; icon-bearing inline-menu rows had a 6px outer inset, headings/text-only
rows 9.03px, and all rows were 28px tall at 14/20 UI type. The difference is deliberate:
the label ink and the generated icon ink both paint at the same optical x-position, rather
than aligning an arbitrary SVG path bound. The default first-visit rail is now 208px,
with a 192–320px resizable range and an 8px body inset; this makes its content column wider
while reducing its outer margins. Adjacent documentation groups no longer add a separate
margin beyond their labelled-row rhythm.

Area Nav at default UI is a 32px row with 14/20 UI type and 16px icon slot; compact is a
28px row with 13/18 type and the same 16px icon slot. By direct product observation, the
anonymous ChatGPT sidebar instead places a 20px icon viewport in a 36px row and 260px rail;
its visible path ink varies by glyph inside that viewport. Area must align square icon
viewports and text columns rather than path bounds. The existing 16/24px icon ramp stays
disjoint from a product-specific 20px measurement, so a new Nav size family is deferred
until a collapsed shell (with accessible names and hit-target behavior) is audited. Its outer inset is derived from the
optical-inset formula, not a component literal. Long labels truncate; horizontal Nav scrolls
instead of wrapping. The radius lower bound is 0px. Generic Nav rows use the 0.4 cap, so
the `pill` axis remains a rounded row rather than an unintended lozenge. The upper painted
row radius is therefore 12.8px at default and 11.2px at compact; Button alone reaches its
half-height pill cap.

## Accessibility and interaction

The public root is a semantic `nav`; callers provide an accessible name when several
landmarks exist. `NavGroup` now exposes `role="group"` and a generated label relationship.
Current destination uses the native `aria-current="page"` token selected by CSS. Disabled
items set `aria-disabled`, lose `href`, leave the tab order, and prevent activation.

Visible focus is the system focus outline. Long labels truncate visually, so consumers must
keep destination names brief and supply a tooltip or another name-revealing treatment when
truncation would conceal critical meaning. The component has no tree keyboard model,
collapse/expand state, touch drawer, reorder, or responsive overlay behavior; those remain
separate work under E07. Forced-colors, RTL, 200% zoom, and assistive-technology tests remain
release checks rather than claims from this CSS audit.

## Candidate decisions

| Candidate | Decision | Rationale |
| --- | --- | --- |
| Labelled groups | Core | Fluent categories and the existing Area job support a shallow, named run; implemented with semantic grouping. |
| Leading icon and trailing annotation | Core | Existing flexible slots solve stable visual/context jobs without an enumerated variant matrix. |
| Disabled destination | Core | A disabled link must not remain activatable or tabbable; implemented without a new prop. |
| Compact group spacing | Core | Keeps a labelled row as the separator without the prior excess 12px gap. |
| Collapsible sidebar/drawer | Separate | shadcn and Fluent place this in shell/provider behavior, not a destination row. |
| Nested tree/categories | Separate | Fluent limits its own Nav depth; arbitrary hierarchy requires Tree semantics and keyboard behavior. |
| Per-item actions | Defer | Fluent requires complete hover/focus/context-menu reachability. Area has no audited interaction owner. |
| Icon-only Nav | Reject | Fluent rejects it and Area would lose the destination name without a distinct collapsed-shell contract. |
| New Nav-specific color aliases | Reject | Existing semantic active, hover, foreground, focus, and edge tokens have stable meanings and cover every consumer. |

## Final contract

`Nav` accepts `orientation="vertical" | "horizontal"` and `tone="neutral" | "accent"`.
`NavGroup` accepts an optional `label`; labelled groups are semantically named. `NavItem`
accepts native anchor props plus `current`, `icon`, `trailing`, and `disabled`. It emits
`area-nav`, `__group`, `__label`, `__item`, `__icon`, `__text`, `__trailing`, and
`__separator` classes. Default is vertical/neutral. No migration is required.

## Token decisions

No Nav-specific semantic aliases were added. Nav uses global UI height, icon, type, gap,
row-radius, current-surface, foreground, focus, and transition tokens. The radius repair
adds `--area-radius-button-cap`, owned by the radius axis and consumed only by Button;
Nav retains `--area-radius-cap`. There is no new Nav color pair or contrast obligation.

## Implementation

- `packages/react/src/components/Nav.tsx`: semantic labelled groups and non-activatable disabled items.
- `packages/styles/src/components/nav.css` and `packages/styles/src/inset.css`: 8px inter-group rhythm and a shared icon-viewport leading edge for group headings and icon-bearing rows.
- `packages/tokens/src/axes/radius.ts` and Button CSS: true button-only pill cap; XL radius becomes 16px.
- `apps/docs/scripts/layout.mjs` and `build.mjs`: 208px rail, 192–320px resizer, reduced rail inset and group gap; the documentation sidebar dogfoods `area-nav` rather than the Menu component.

## Verification

Passed on 2026-09-17: `npm run build`, `npm run lint:manifest -w @area/styles`,
`npm run typecheck`, `npm run build:docs`, `npm test` (18,104 tests),
`node packages/tokens/src/contrast/report.ts` (344 passing across 66 themes), and
`git diff --check`. Chromium inspection confirmed the original failure: the Pill axis gave
a button 12.8px radius at 32px because UI scale overrode the radius cap. The repaired Button
paints at 16px. The rebuilt desktop rail measured its new 8px body inset; its saved 217.09px
user preference remained intact, while a first visit receives the 208px default.

Post-audit alignment correction, 2026-09-17: Nav headings now take the same icon-viewport
leading inset as icon-bearing rows. The docs rail uses the actual Nav markup, and fresh
Chromium inspection confirmed the wordmark, section-heading text, and icon viewports share
one optical leading edge without reserving an empty icon slot for text-only destinations.
Text-only Nav destinations take that same leading inset so their label ink aligns with the
group heading; this is a deliberate navigation-scanning exception to generic text centring.

## Remaining limits

No authenticated OpenAI product observation or current Primer Nav documentation was available.
The audit does not complete E07 drawer/tree/secondary-action behavior, browser-specific text
metrics, high-contrast native-platform validation, RTL, or assistive-technology testing.
