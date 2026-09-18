# Button audit — 2026-09-18

## Decision summary

Area Button remains a native action control with three physical tiers: Small, Medium, and Large. Medium is the omitted-prop default; `md` is the explicit token/manifest identifier, not a second name for the default. The audit keeps the existing independent axes for emphasis (`variant`) and semantic meaning (`tone`), preserves the `selected` toggle state, and keeps links, menus, split buttons, and compound buttons as separate components or compositions. It accepts no new Button token or prop: each candidate either already has a coherent contract or requires a different semantic control.

The examples now put the size family third, immediately after the standalone default and persistent fill treatments. The radius work in this batch is part of the final Button geometry: at the Standard radius family the three tiers are 6px, 8px, and 10px, and text and icon-only Buttons at the same tier read the same radius token.

## Current Area contract

`Button` renders a native `<button>` and defaults its HTML `type` to `button`. It has `solid`, `soft`, `outline`, and `ghost` variants; eight semantic tones; `sm`/`md`/`lg` size values; `fullWidth`, `iconOnly`, `pill`, and ghost-only alignment options; plus disabled, loading, and selected states. `icon`, `trailingIcon`, and a truncating text slot compose inside the control. Loading replaces a leading icon, disables the native button, and exposes `aria-busy`; selected exposes `aria-pressed`. The root ref and applicable native button props are forwarded.

## User jobs and non-goals

Use Button to invoke one named action: save, invite, delete, reveal a dialog, or submit a form deliberately. Use `selected` only when the same action is a two-state toggle. Use an anchor for navigation, Menu/ButtonGroup for a cluster of alternatives, a menu button for a popup, Split Button for a primary action plus alternatives, and Switch for an immediate-effect setting.

Button does not own routing, popup state, a secondary action menu, descriptions, validation, arbitrary per-instance colour overrides, or a second neutral-emphasis vocabulary. A link-shaped button would obscure link semantics; a compound button needs its own multi-line layout and accessible description contract. A keyboard chord is composed with the real `Kbd` component, never redrawn as Button content.

## Evidence ledger

| Benchmark | Evidence and source | Finding used |
| --- | --- | --- |
| Area | Source, manifest, docs, and Chromium inspection, 2026-09-17 | Native button; four visual variants; eight tones; three tiers; icons; pill; loading; selected; focus and forced-colors rules. |
| OpenAI | No reusable public Button specification located; 2026-09-17 | Unavailable for API decisions. |
| Notion | [Buttons](https://www.notion.com/en-gb/help/buttons), Level B, 2026-09-17 | A button may trigger a named operation, confirmation, or opening a URL; this is product workflow guidance rather than a reusable visual API. |
| Primer | [Button](https://primer.style/product/components/button/), Level A, 2026-09-17 | One primary action per group/page, medium default with small/large, leading/trailing visuals, loading, block layout, and separate link semantics. |
| shadcn/ui | [Button](https://ui.shadcn.com/docs/components/base/button), Level A, 2026-09-17 | Variants, size family, icons, loading composition, rounded option, Button Group, RTL, and using a plain styled anchor rather than a button role for navigation. |
| Fluent 2 | [React Button](https://fluent2.microsoft.design/components/web/react/core/button/usage), Level A, 2026-09-17 | One primary action, Button versus link, toggle state, Split/Menu/Compound Button boundaries, active language, focus and contrast guidance. |
| Figma | [Component properties](https://help.figma.com/hc/en-us/articles/5579474826519-Explore-component-properties) and [simple Button](https://help.figma.com/hc/en-us/articles/14078912322199-Create-a-simple-button-component), Level A, 2026-09-17 | Size/state/colour belong to variants; icon presence is a boolean or slot; label is text; auto-layout hugs translated content. |
| Vercel Geist | [Button](https://vercel.com/geist/button), Level A, 2026-09-17 | Medium default, prefix/suffix, loading, icon-only label requirement, shapes, and a distinct ButtonLink contract. |
| Material / MUI | [MUI Button](https://mui.com/material-ui/react-button/), Level A, 2026-09-18 | Text, contained, and outlined emphasis; small/medium/large; colors; start/end icons; loading; and a separate IconButton. |
| IBM Carbon | [Button](https://carbondesignsystem.com/components/button/usage/) and [Menu buttons](https://carbondesignsystem.com/components/menu-buttons/usage/), Level A, 2026-09-18 | Primary/secondary/tertiary/ghost/danger hierarchy, icon-only, loading, seven product-context sizes, group, menu, and combo-button boundaries. |
| Atlassian | [Button](https://atlassian.design/components/button/), Level A, 2026-09-18 | Current public page identifies Button as a distinct action component; legacy migration guidance distinguishes Button, icon button, link button, and link icon button. |
| Apple | [Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), Level A, 2026-09-18 | Style/content/role are separate dimensions; toggle and pop-up controls are distinct button-like behaviors; touch target guidance is platform-specific. |
| Tailwind CSS | [Tailwind CSS documentation](https://tailwindcss.com/docs/styling-with-utility-classes), Level A, 2026-09-18 | Utility framework, not a canonical Button contract; used only to check composability, never as evidence for a new Area prop. |

## Benchmark comparison

| System | Boundary and supported patterns |
| --- | --- |
| Area | Native action control; variants and semantic tones are independent; three tiers, icon slots, pill, loading, selected, full width. |
| OpenAI | Public reusable API unavailable. |
| Notion | Product automation button can run several configured actions and confirmation; no transferable component API. |
| Primer | Button plus ButtonGroup; leading/trailing visual/action, three sizes, loading, block, optional link rendering. |
| shadcn/ui | Styled native button; separate ButtonGroup and styled anchor; size and icon families, rounded, loading, RTL. |
| Fluent 2 | Standard, toggle, menu, split, and compound buttons are distinct semantic patterns. |
| Figma | Auto-layout component with text, boolean icon visibility, instance slots, and variant properties. |
| Geist | Button, ButtonLink, icon-only validation, sizes/shapes, loading, prefix/suffix. |
| Material / MUI | Text, contained, and outlined variants; three sizes; semantic colors; leading/trailing icons; separate IconButton and ButtonGroup. |
| Carbon | Rich hierarchy plus context-specific size expansion; MenuButton and ComboButton are explicitly separate components. |
| Atlassian | Button, icon button, link button, and link icon button are separate public component boundaries. |
| Apple | Style, content, and role combine within a button; toggles and pop-up buttons remain distinct controls. |
| Tailwind CSS | No normative Button API to adopt; utility combinations are supplementary visual evidence only. |

## Geometry

At default UI the three outer-control heights are Small 28px, Medium 32px, and Large 40px; typography, icon viewport, gap, and optical insets resolve from that same density tier. At compact UI those tiers tighten with the density axis, but the button does not acquire an extra public size name. `size` is therefore `sm | md | lg`; “Medium” is documentation language and “default” means the prop was omitted.

Radius is a named visual family rather than a size alias. Its Standard curve is 6px/8px/10px for Small/Medium/Large. The icon-only box shares `--_height` and `--_radius` with the text button, so a Medium icon button and Medium text button both paint 8px under Standard. `pill` is the explicit full-round exception. The normal radius cap protects very small/compact controls from becoming accidental lozenges; it never differentiates text and icon-only Buttons of one tier.

Labels are single-line and truncate within their own slot. The icon viewport, not variable path ink bounds, controls its optical lane. Full width changes inline size only; it does not create a new density or radius package. Long labels, RTL direction, zoom, and narrow containers remain visual release checks.

## Accessibility and interaction

The native element provides button semantics, keyboard activation, form participation, disabled semantics, and a forwarded `HTMLButtonElement` ref. The wrapper defaults to `type="button"` to prevent accidental form submission. Consumers set `type="submit"` deliberately. Icon-only Buttons require an action-specific `aria-label`; text Buttons must not receive a competing aria-label. Icon slots are decorative when their text label names the action.

`selected` emits `aria-pressed="true"` or `"false"`, making it a real toggle state rather than a purely visual active treatment. Loading emits `aria-busy`, replaces a leading visual with the spinner, and disables activation. Focus-visible uses the system focus ring; forced-colors coverage preserves the recognisable interactive state. The contrast gate verifies required foreground/fill pairs; disabled controls are non-interactive. Screen-reader announcement timing for application-specific completion, touch target context, browser/AT combinations, 200% zoom, localization, and RTL are release checks outside this component's CSS contract.

## Candidate decisions

| Candidate | Decision | Rationale |
| --- | --- | --- |
| Three named physical tiers with omitted Medium default | Core | Primer and Geist support this scale; it removes confusing `default` versus `md` size vocabulary while retaining a stable manifest key. |
| Same-tier text and icon-only radius | Core | One size package must not split solely because content changes; shared tier tokens already deliver this. |
| Independent `variant` and `tone` | Core | Emphasis and meaning are separate jobs, and Area's slot model/theme axes support the combination. |
| Loading, visible disabled, selected toggle | Core | Each maps to an existing native/ARIA state and is documented by multiple benchmarks. |
| Link appearance on `<a>` | Separate | shadcn and Geist both preserve link semantics via a styled anchor/ButtonLink; Area should not put `role=button` on navigation. |
| Leading icon | Core composition | `icon` is an existing decorative slot: it reinforces the same named action and is hidden from assistive technology when text supplies the name. |
| Trailing icon | Core composition | `trailingIcon` is an existing decorative slot for direction or disclosure; it is not an independently focusable action. |
| Keyboard shortcut badge | Core composition | Compose the real `Kbd` child, preserving its semantic chord and token contract. Inside Button use the 20px small backplate; the Button reserves that box so trailing space equals the space above and below it. |
| Icon-only action | Core with guardrail | `iconOnly` is already supported, but requires an action-specific `aria-label`. A future tooltip/keybinding helper belongs to a separate IconButton composition, not to the text Button API. |
| ButtonGroup | Separate | Group spacing, equal priority, overflow, and related-action semantics are not one Button's job. |
| Menu/Dropdown button | Separate | A menu trigger needs `aria-haspopup`, expanded state, focus return, dismissal, placement, and keyboard navigation; a trailing chevron alone cannot supply that contract. |
| Split button | Separate | A split control combines a primary action and a MenuButton; the primary action must not be repeated in the menu. |
| Compound button | Separate | A title plus description needs its own multiline layout and accessible-description contract. |
| Inactive/read-only state | Reject | Native buttons have no truthful read-only semantics; a disabled explanation belongs to the consuming surface. |
| Additional `primary`/`secondary` neutral tones | Reject | This duplicates the variant axis and creates ambiguous emphasis. |
| Arbitrary custom colours | Reject | It bypasses semantic tokens, axis resolution, and contrast verification. |
| Four or five public Button sizes | Reject | The Button's three usable control tiers are sufficient; finer icon/glyph ramps belong to components that are not rectangular action plates. |

## Final contract

`ButtonProps` remains the applicable native button attributes plus `variant`, `tone`, `size`, `fullWidth`, `iconOnly`, `pill`, `align`, `selected`, `loading`, `icon`, and `trailingIcon`. `variant="solid"`, `tone="neutral"`, and omitted `size` (Medium/`md`) are the defaults. CSS exposes `area-button` with matching variant modifiers, three size modifiers, boolean modifiers, and `icon`/`label` elements. React preserves native props and refs without managing consumer state. A shortcut is `<Kbd>` as a child; there is intentionally no duplicate `shortcut` string prop.

`align` remains intentionally narrow: it is an optical, text-column alignment tool for unfilled ghost Buttons, not a generic interior-content alignment API. Links use a styled `<a>` externally; selected Button is a toggle, not a tab or menu item.

## Token decisions

No Button-specific aliases are needed. Density owns height, UI type, icon viewport, gap, and gutter; the radius axis owns the named same-tier curve; semantic tone slots own foreground, fills, and edges; focus, motion, and forced-colors remain system-owned. `pill` is an explicit component shape modifier, not a radius-axis preset. This leaves every dimension traceable and avoids a Button-only geometry fork.

## Implementation

- `packages/tokens/src/axes/radius.ts`: retains the named radius curve used by Button; Standard is 6px/8px/10px across its three physical tiers.
- `packages/styles/src/components/button.css`, `packages/styles/src/manifest.ts`, and `packages/react/src/components/Button.tsx`: retain the already-aligned three-tier, semantic, state, and native-element contract.
- `packages/styles/src/components/kbd.css`, `packages/styles/src/inset.css`, and `apps/docs/src/demos/display.tsx`: use the real small `Kbd` inside a Button, apply the contextual on-solid surface, and reserve the keycap box for equal outer trailing/block breathing room.
- `apps/docs/src/pages.mjs`: moves Sizes to the required third example, after Default and Variants.

There is no migration beyond the already documented Button size reduction: `xs` and `xl` callers move to `sm` and `lg`; “default” in prose means no `size` prop, while explicit code uses `md`.

## Verification

Passed on 2026-09-17: `npm run build:docs` (including manifest parity and dogfood audit), `npm run lint:manifest -w @area/styles`, `npm run typecheck`, `npm run test:consumer`, `node --test apps/docs/scripts/axis-preferences.test.mjs`, `npm test` (18,104 tests), `node packages/tokens/src/contrast/report.ts` (344 assertions across 66 themes), and `git diff --check`. Re-ran after the Kbd and gallery change on 2026-09-18: `npm run lint:manifest -w @area/styles`, `npm run typecheck`, `npm run build:docs`, `npm run audit`, and `git diff --check` all pass.

Live Chromium inspection on a fresh `http://localhost:4322/button.html?audit=sidebar-optical-edge` verified the rebuilt Button documentation, the Default → Variants → Sizes example order, the Small/Medium/Large labels, and the docs sidebar's shared optical leading edge without an empty icon lane on text-only rows. Source token inspection confirms Standard's 6px/8px/10px Button curve and the shared Medium text/icon-only radius token. The live customizer showed the Standard selection active.

## Remaining limits

OpenAI has no public reusable Button contract, and Notion publishes product automation guidance rather than a visual/API component. Split Button, Menu Button, ButtonGroup, Compound Button, ButtonLink, consumer-owned success/error announcements, browser/AT verification, and touch-target assessment in real product layouts remain separate work.
