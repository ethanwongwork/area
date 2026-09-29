# Nav — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Site navigation, vertical or horizontal. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660).

Boundary: Vertical/horizontal destination links, neutral/accent selected paint, plate/marker, groups, counts, actions and expandable composition. Horizontal lists scroll. No responsive rail or mega-menu contract. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1).

## Variant axes

- **shadcn/ui** (component): side: left, right; variant: sidebar, floating, inset; collapsible: offcanvas, icon, none. [Source](https://ui.shadcn.com/docs/components/sidebar) (checked 2026-09-28).
- **Radix Themes** (component): size: 1, 2; contrast: normal, high. [Source](https://www.radix-ui.com/themes/docs/components/tab-nav) (checked 2026-09-28).
- **Base UI** (component): orientation: horizontal, vertical. [Source](https://base-ui.com/react/components/navigation-menu) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): selection: none, single, multiple; orientation: horizontal, vertical. [Source](https://react-aria.adobe.com/ListBox) (checked 2026-09-28).
- **Fluent 2** (component): layout: overlay, inline. [Source](https://fluent2.microsoft.design/components/web/react/core/nav/usage) (checked 2026-09-28).
- **Material 3** (component): layout: standard, modal. [Source](https://developer.android.com/develop/ui/compose/components/drawer) (checked 2026-09-28).
- **Mantine** (component): variant: filled, light, subtle; state: active, disabled. [Source](https://mantine.dev/core/nav-link) (checked 2026-09-28).
- **Ant Design** (component): orientation: horizontal, vertical, inline; theme: light, dark. [Source](https://ant.design/components/menu) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (example): sidebar, groups, icons, nested-items, trailing-content. [Source](https://www.untitledui.com/react/components/sidebar-navigations) (checked 2026-09-28).
- **shadcn/ui** (component): sidebar, groups, icons, nested-items, row-actions, collapsed-rail. [Source](https://ui.shadcn.com/docs/components/sidebar) (checked 2026-09-28).
- **Radix Themes** (component): horizontal-links. [Source](https://www.radix-ui.com/themes/docs/components/tab-nav) (checked 2026-09-28).
- **Base UI** (component): horizontal-links, nested-items, mega-menu. [Source](https://base-ui.com/react/components/navigation-menu) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): links, icons, descriptions. [Source](https://react-aria.adobe.com/ListBox) (checked 2026-09-28).
- **Fluent 2** (component): sidebar, groups, icons, nested-items, row-actions. [Source](https://fluent2.microsoft.design/components/web/react/core/nav/usage) (checked 2026-09-28).
- **Primer** (component): sidebar, groups, icons, nested-items, trailing-content. [Source](https://primer.style/product/components/nav-list/) (checked 2026-09-28).
- **Carbon** (component): sidebar, nested-items, icons. [Source](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/) (checked 2026-09-28).
- **Material 3** (component): sidebar, groups, icons. [Source](https://developer.android.com/develop/ui/compose/components/drawer) (checked 2026-09-28).
- **Mantine** (component): icons, nested-items, descriptions, trailing-content. [Source](https://mantine.dev/core/nav-link) (checked 2026-09-28).
- **Ant Design** (component): horizontal-links, sidebar, nested-items, collapsed-rail, overflow-menu. [Source](https://ant.design/components/menu) (checked 2026-09-28).
- **Atlassian** (guidance): sidebar, horizontal-links. [Source](https://atlassian.design/components/navigation-system/examples) (checked 2026-09-28).
- **Polaris** (platform-component): sidebar, responsive-dropdown. [Source](https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components/app-nav) (checked 2026-09-28).
- **GOV.UK** (component): horizontal-links, responsive-disclosure. [Source](https://design-system.service.gov.uk/components/service-navigation/) (checked 2026-09-28).
- **Apple HIG** (guidance): sidebar, groups, nested-items, icons. [Source](https://developer.apple.com/design/human-interface-guidelines/sidebars) (checked 2026-09-28).

## Interaction patterns

- **collapse-expand**: [shadcn/ui](https://ui.shadcn.com/docs/components/sidebar), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage), [Primer](https://primer.style/product/components/nav-list/), [Carbon](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/), [Material 3](https://developer.android.com/develop/ui/compose/components/drawer), [Mantine](https://mantine.dev/core/nav-link), [Ant Design](https://ant.design/components/menu), [GOV.UK](https://design-system.service.gov.uk/components/service-navigation/), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/sidebars) (checked 2026-09-28).
- **keyboard-shortcut**: [shadcn/ui](https://ui.shadcn.com/docs/components/sidebar) (checked 2026-09-28).
- **current-page**: [Radix Themes](https://www.radix-ui.com/themes/docs/components/tab-nav), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage), [Primer](https://primer.style/product/components/nav-list/), [Carbon](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/), [Polaris](https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components/app-nav), [GOV.UK](https://design-system.service.gov.uk/components/service-navigation/) (checked 2026-09-28).
- **keyboard-navigation**: [Base UI](https://base-ui.com/react/components/navigation-menu), [React Aria / Spectrum 2](https://react-aria.adobe.com/ListBox) (checked 2026-09-28).
- **hover-open**: [Base UI](https://base-ui.com/react/components/navigation-menu) (checked 2026-09-28).
- **click-open**: [Base UI](https://base-ui.com/react/components/navigation-menu) (checked 2026-09-28).
- **swipe-dismiss**: [Material 3](https://developer.android.com/develop/ui/compose/components/drawer) (checked 2026-09-28).

## Area today

Vertical/horizontal destination links, neutral/accent selected paint, plate/marker, groups, counts, actions and expandable composition. Horizontal lists scroll. No responsive rail or mega-menu contract. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1).

- Exact manifest axes: orientation = horizontal; tone = accent; selection = marker. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660).
- Boolean modifiers: none declared. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660).
- Slots: group, label, item, icon, text, trailing, separator, row, actions. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:collapse-expand`, `interaction:current-page`, `orientation:horizontal`, `orientation:vertical`, `selection:marker`, `state:disabled`, `structure:groups`, `structure:horizontal-links`, `structure:icons`, `structure:row-actions`, `structure:sidebar`, `structure:trailing-content`, `tone:accent`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1-L216).
- **composition**: `structure:nested-items`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1-L216).
- **not found**: `collapsible:icon`, `collapsible:none`, `collapsible:offcanvas`, `interaction:click-open`, `interaction:hover-open`, `interaction:keyboard-navigation`, `interaction:keyboard-shortcut`, `interaction:swipe-dismiss`, `layout:inline`, `layout:modal`, `layout:overlay`, `layout:standard`, `orientation:inline`, `selection:multiple`, `selection:none`, `selection:single`, `side:left`, `side:right`, `size:1`, `size:2`, `state:active`, `structure:collapsed-rail`, `structure:descriptions`, `structure:links`, `structure:mega-menu`, `structure:overflow-menu`, `structure:responsive-disclosure`, `structure:responsive-dropdown`, `variant:filled`, `variant:floating`, `variant:inset`, `variant:light`, `variant:sidebar`, `variant:subtle`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1-L216).
- **system-level / not this exact option**: `contrast:high`, `contrast:normal`, `theme:dark`, `theme:light`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1-L216).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 2 direct systems; 1 supporting/adjacent systems. Direct: Ant Design, Base UI. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1).
  - Individual options: `orientation:horizontal` (2 direct; Area: yes); `tone:accent` (0 direct; Area: yes); `selection:marker` (0 direct; Area: yes).
- **Layer 3 · Collapsible icon rail** — 2 direct systems. Direct: Ant Design, shadcn/ui. A distinct sidebar anatomy with accessible labels and expanded content. Evidence: [1](https://ant.design/components/menu), [2](https://ui.shadcn.com/docs/components/sidebar).
  - Individual options: `structure:collapsed-rail` (2 direct; Area: not found).
- **Layer 3 · Responsive navigation disclosure** — 2 direct systems. Direct: GOV.UK, Polaris. Let compact layouts change composition while retaining destination links. Evidence: [1](https://design-system.service.gov.uk/components/service-navigation/), [2](https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components/app-nav).
  - Individual options: `structure:responsive-dropdown` (1 direct; Area: not found); `structure:responsive-disclosure` (1 direct; Area: not found).
- **Layer 3 · Horizontal navigation with rich panels** — 1 direct systems. Direct: Base UI. A later navigation recipe; keep its links separate from action Menu semantics. Evidence: [1](https://base-ui.com/react/components/navigation-menu).
  - Individual options: `structure:mega-menu` (1 direct; Area: not found).
- **Layer 3 · Rich grouped rows with trailing actions** — 6 direct systems; 1 guidance systems. Direct: Fluent 2, Mantine, Material 3, Primer, Untitled UI, shadcn/ui. Retain and formalize existing composition slots before introducing visual duplicates. Evidence: [1](https://developer.android.com/develop/ui/compose/components/drawer), [2](https://developer.apple.com/design/human-interface-guidelines/sidebars), [3](https://fluent2.microsoft.design/components/web/react/core/nav/usage), [4](https://mantine.dev/core/nav-link), [5](https://primer.style/product/components/nav-list/), [6](https://ui.shadcn.com/docs/components/sidebar), [7](https://www.untitledui.com/react/components/sidebar-navigations).
  - Individual options: `structure:groups` (5 direct; Area: yes); `structure:row-actions` (2 direct; Area: yes); `structure:trailing-content` (3 direct; Area: yes).

## Sources

- Area: [manifest, lines 652–660](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L652-L660); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/nav.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: nav, navigation, sidebar, tab nav, side navigation. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/sidebar-navigations); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/sidebar); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/tab-nav); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/navigation-menu); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-aria.adobe.com/ListBox); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/nav/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/nav-list/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/drawer); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/nav-link); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/menu); checked 2026-09-28.
- **Chakra/Ark — not found**: checked [catalogue](https://chakra-ui.com/docs/components/concepts/overview) on 2026-09-28 for nav, navigation, sidebar, tab nav, side navigation. No independently verified option recorded; see the audit for lookup limitations.
- **Atlassian**: [source 1](https://atlassian.design/components/navigation-system/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/app-bridge-web-components/app-nav); checked 2026-09-28.
- **GOV.UK**: [source 1](https://design-system.service.gov.uk/components/service-navigation/); checked 2026-09-28.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/sidebars); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/sidebars.json). Platform guidance is counted separately.
