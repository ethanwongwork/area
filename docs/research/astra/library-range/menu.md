# Menu — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Lists actions triggered from a button. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566).

Boundary: Menu owns action rows and in-menu keys. A trigger enables native-popover anchoring, flip/shift, dismissal and focus return. Submenu keyboard is explicitly not implemented; a visual chevron or nested content does not establish it. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1).

## Variant axes

- **Untitled UI** (component): placement: top, bottom, left, right; state: disabled, selected. [Source](https://www.untitledui.com/react/components/dropdowns) (checked 2026-09-28).
- **shadcn/ui** (component): item-tone: default, destructive. [Source](https://ui.shadcn.com/docs/components/dropdown-menu) (checked 2026-09-28).
- **Radix Themes** (component): treatment: solid, soft; size: 1, 2; contrast: normal, high. [Source](https://www.radix-ui.com/themes/docs/components/dropdown-menu) (checked 2026-09-28).
- **Base UI** (component): modal: true, false; state: disabled, highlighted, checked. [Source](https://base-ui.com/react/components/menu) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): size: S, M, L, XL; selection: none, single, multiple; state: disabled. [Source](https://react-spectrum.adobe.com/Menu) (checked 2026-09-28).
- **Material 3** (component): state: disabled. [Source](https://developer.android.com/develop/ui/compose/components/menu) (checked 2026-09-28).
- **Mantine** (component): trigger: click, hover, click-hover; state: disabled. [Source](https://mantine.dev/core/menu) (checked 2026-09-28).
- **Ant Design** (component): orientation: horizontal, vertical, inline; theme: light, dark; state: disabled, danger. [Source](https://ant.design/components/menu) (checked 2026-09-28).
- **Chakra/Ark** (component): size: sm, md; variant: subtle, solid; state: disabled. [Source](https://chakra-ui.com/docs/components/menu) (checked 2026-09-28).
- **Atlassian** (component): appearance: default, tall; spacing: cozy, compact. [Source](https://atlassian.design/components/dropdown-menu/examples) (checked 2026-09-28).
- **Polaris** (component): state: disabled. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu) (checked 2026-09-28).

## Structural alternatives

- **Untitled UI** (component): icons, shortcuts, groups. [Source](https://www.untitledui.com/react/components/dropdowns) (checked 2026-09-28).
- **shadcn/ui** (component): icons, shortcuts, groups, submenus, checkbox-items, radio-items. [Source](https://ui.shadcn.com/docs/components/dropdown-menu) (checked 2026-09-28).
- **Radix Themes** (component): shortcuts, groups, submenus, checkbox-items, radio-items. [Source](https://www.radix-ui.com/themes/docs/components/dropdown-menu) (checked 2026-09-28).
- **Base UI** (component): groups, submenus, checkbox-items, radio-items, detached-triggers. [Source](https://base-ui.com/react/components/menu) (checked 2026-09-28).
- **React Aria / Spectrum 2** (component): icons, descriptions, shortcuts, groups, submenus, checkbox-items, radio-items. [Source](https://react-spectrum.adobe.com/Menu) (checked 2026-09-28).
- **Fluent 2** (component): icons, groups, submenus, checkbox-items, radio-items. [Source](https://fluent2.microsoft.design/components/web/react/core/menu/usage) (checked 2026-09-28).
- **Primer** (component): icons, descriptions. [Source](https://primer.style/product/components/action-menu/) (checked 2026-09-28).
- **Carbon** (component): icons, shortcuts, groups, submenus, checkbox-items, radio-items. [Source](https://carbondesignsystem.com/components/menu/usage/) (checked 2026-09-28).
- **Material 3** (component): icons, groups, scrollable-popup. [Source](https://developer.android.com/develop/ui/compose/components/menu) (checked 2026-09-28).
- **Mantine** (component): icons, shortcuts, groups, submenus. [Source](https://mantine.dev/core/menu) (checked 2026-09-28).
- **Ant Design** (component): icons, groups, submenus, overflow-menu, collapsed-rail. [Source](https://ant.design/components/menu) (checked 2026-09-28).
- **Chakra/Ark** (component): icons, shortcuts, groups, submenus, checkbox-items, radio-items. [Source](https://chakra-ui.com/docs/components/menu) (checked 2026-09-28).
- **Atlassian** (component): groups, checkbox-items, radio-items, custom-trigger. [Source](https://atlassian.design/components/dropdown-menu/examples) (checked 2026-09-28).
- **Polaris** (component): groups, links, custom-trigger. [Source](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu) (checked 2026-09-28).
- **Apple HIG** (guidance): icons, groups, submenus, checkbox-items. [Source](https://developer.apple.com/design/human-interface-guidelines/menus) (checked 2026-09-28).

## Interaction patterns

- **single-selection**: [Untitled UI](https://www.untitledui.com/react/components/dropdowns), [Primer](https://primer.style/product/components/action-menu/), [Ant Design](https://ant.design/components/menu) (checked 2026-09-28).
- **arrow-navigation**: [Untitled UI](https://www.untitledui.com/react/components/dropdowns), [shadcn/ui](https://ui.shadcn.com/docs/components/dropdown-menu), [Radix Themes](https://www.radix-ui.com/themes/docs/components/dropdown-menu), [Base UI](https://base-ui.com/react/components/menu), [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Menu), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/menu/usage), [Carbon](https://carbondesignsystem.com/components/menu/usage/), [Mantine](https://mantine.dev/core/menu), [Chakra/Ark](https://chakra-ui.com/docs/components/menu) (checked 2026-09-28).
- **escape-dismiss**: [Untitled UI](https://www.untitledui.com/react/components/dropdowns), [shadcn/ui](https://ui.shadcn.com/docs/components/dropdown-menu), [Radix Themes](https://www.radix-ui.com/themes/docs/components/dropdown-menu), [Base UI](https://base-ui.com/react/components/menu), [Mantine](https://mantine.dev/core/menu), [Atlassian](https://atlassian.design/components/dropdown-menu/examples) (checked 2026-09-28).
- **hover-open**: [Base UI](https://base-ui.com/react/components/menu), [Ant Design](https://ant.design/components/menu) (checked 2026-09-28).
- **typeahead**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Menu), [Chakra/Ark](https://chakra-ui.com/docs/components/menu) (checked 2026-09-28).
- **context-trigger**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Menu), [Chakra/Ark](https://chakra-ui.com/docs/components/menu) (checked 2026-09-28).
- **long-press**: [React Aria / Spectrum 2](https://react-spectrum.adobe.com/Menu) (checked 2026-09-28).
- **multiple-selection**: [Primer](https://primer.style/product/components/action-menu/), [Ant Design](https://ant.design/components/menu) (checked 2026-09-28).
- **outside-dismiss**: [Material 3](https://developer.android.com/develop/ui/compose/components/menu) (checked 2026-09-28).
- **click-open**: [Ant Design](https://ant.design/components/menu) (checked 2026-09-28).
- **keyboard-navigation**: [Polaris](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu) (checked 2026-09-28).
- **keyboard-shortcuts**: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/menus) (checked 2026-09-28).

## Area today

Menu owns action rows and in-menu keys. A trigger enables native-popover anchoring, flip/shift, dismissal and focus return. Submenu keyboard is explicitly not implemented; a visual chevron or nested content does not establish it. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1).

- Exact manifest axes: none. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566).
- Boolean modifiers: none declared. Runtime state hooks: disabled, highlighted, selected. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566).
- Slots: item, icon, text, lines, description, label, separator, shortcut, check, toggle, search-surface. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:arrow-navigation`, `interaction:escape-dismiss`, `interaction:keyboard-navigation`, `interaction:outside-dismiss`, `interaction:single-selection`, `interaction:typeahead`, `item-tone:destructive`, `placement:bottom`, `placement:left`, `placement:right`, `placement:top`, `state:disabled`, `state:highlighted`, `state:selected`, `structure:checkbox-items`, `structure:descriptions`, `structure:groups`, `structure:icons`, `structure:radio-items`, `structure:shortcuts`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1-L141).
- **not found**: `appearance:default`, `appearance:tall`, `interaction:click-open`, `interaction:context-trigger`, `interaction:hover-open`, `interaction:keyboard-shortcuts`, `interaction:long-press`, `interaction:multiple-selection`, `item-tone:default`, `modal:false`, `modal:true`, `orientation:horizontal`, `orientation:inline`, `orientation:vertical`, `selection:multiple`, `selection:none`, `selection:single`, `size:1`, `size:2`, `size:L`, `size:M`, `size:S`, `size:XL`, `size:md`, `size:sm`, `spacing:compact`, `spacing:cozy`, `state:checked`, `state:danger`, `structure:collapsed-rail`, `structure:custom-trigger`, `structure:detached-triggers`, `structure:links`, `structure:overflow-menu`, `structure:scrollable-popup`, `treatment:soft`, `treatment:solid`, `trigger:click`, `trigger:click-hover`, `trigger:hover`, `variant:solid`, `variant:subtle`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1-L141).
- **partial**: `structure:submenus`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1-L141).
- **system-level / not this exact option**: `contrast:high`, `contrast:normal`, `theme:dark`, `theme:light`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1-L141).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 0 direct systems. Direct: none verified as a direct implementation/example. No design-time variant axis is declared today; keep this focused recipe and choose structural extensions below before introducing additional paint axes. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1).
- **Layer 3 · Checkable items with independent sections** — 8 direct systems; 1 guidance systems. Direct: Atlassian, Base UI, Carbon, Chakra/Ark, Fluent 2, Radix Themes, React Aria / Spectrum 2, shadcn/ui. Keep action, single choice and multiple choice semantics explicit; Area already has check/toggle anatomy. Evidence: [1](https://atlassian.design/components/dropdown-menu/examples), [2](https://base-ui.com/react/components/menu), [3](https://carbondesignsystem.com/components/menu/usage/), [4](https://chakra-ui.com/docs/components/menu), [5](https://developer.apple.com/design/human-interface-guidelines/menus), [6](https://fluent2.microsoft.design/components/web/react/core/menu/usage), [7](https://react-spectrum.adobe.com/Menu), [8](https://ui.shadcn.com/docs/components/dropdown-menu), [9](https://www.radix-ui.com/themes/docs/components/dropdown-menu).
  - Individual options: `structure:checkbox-items` (8 direct; Area: yes); `structure:radio-items` (8 direct; Area: yes).
- **Layer 3 · Nested submenus** — 9 direct systems; 1 guidance systems. Direct: Ant Design, Base UI, Carbon, Chakra/Ark, Fluent 2, Mantine, Radix Themes, React Aria / Spectrum 2, shadcn/ui. Add the missing submenu focus and dismissal contract before expanding menu-shaped surfaces. Evidence: [1](https://ant.design/components/menu), [2](https://base-ui.com/react/components/menu), [3](https://carbondesignsystem.com/components/menu/usage/), [4](https://chakra-ui.com/docs/components/menu), [5](https://developer.apple.com/design/human-interface-guidelines/menus), [6](https://fluent2.microsoft.design/components/web/react/core/menu/usage), [7](https://mantine.dev/core/menu), [8](https://react-spectrum.adobe.com/Menu), [9](https://ui.shadcn.com/docs/components/dropdown-menu), [10](https://www.radix-ui.com/themes/docs/components/dropdown-menu).
  - Individual options: `structure:submenus` (9 direct; Area: partial).
- **Layer 2 · Soft/solid item emphasis and destructive intent** — 2 direct systems. Direct: Radix Themes, shadcn/ui. Expose emphasis independently of selection and danger intent; preserve fixed foreground on hover. Evidence: [1](https://ui.shadcn.com/docs/components/dropdown-menu), [2](https://www.radix-ui.com/themes/docs/components/dropdown-menu).
  - Individual options: `treatment:soft` (1 direct; Area: not found); `treatment:solid` (1 direct; Area: not found); `item-tone:destructive` (1 direct; Area: yes).
- **Layer 2 · A deliberate compact row tier** — 3 direct systems. Direct: Atlassian, Chakra/Ark, Radix Themes. Make dense command menus an intentional tier rather than arbitrary per-consumer padding. Evidence: [1](https://atlassian.design/components/dropdown-menu/examples), [2](https://chakra-ui.com/docs/components/menu), [3](https://www.radix-ui.com/themes/docs/components/dropdown-menu).
  - Individual options: `spacing:compact` (1 direct; Area: not found); `size:1` (1 direct; Area: not found); `size:sm` (1 direct; Area: not found).

## Sources

- Area: [manifest, lines 558–566](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L558-L566); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/menu.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: menu, dropdown, action menu, overflow menu. The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI**: [source 1](https://www.untitledui.com/react/components/dropdowns); checked 2026-09-28.
- **shadcn/ui**: [source 1](https://ui.shadcn.com/docs/components/dropdown-menu); checked 2026-09-28.
- **Radix Themes**: [source 1](https://www.radix-ui.com/themes/docs/components/dropdown-menu); checked 2026-09-28.
- **Base UI**: [source 1](https://base-ui.com/react/components/menu); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-spectrum.adobe.com/Menu); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/menu/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/action-menu/); checked 2026-09-28.
- **Carbon**: [source 1](https://carbondesignsystem.com/components/menu/usage/); checked 2026-09-28.
- **Material 3**: [source 1](https://developer.android.com/develop/ui/compose/components/menu); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/menu); checked 2026-09-28.
- **Ant Design**: [source 1](https://ant.design/components/menu); checked 2026-09-28.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/menu); checked 2026-09-28.
- **Atlassian**: [source 1](https://atlassian.design/components/dropdown-menu/examples); checked 2026-09-28.
- **Polaris**: [source 1](https://shopify.dev/docs/api/app-home/latest/web-components/actions/menu); checked 2026-09-28.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for menu, dropdown, action menu, overflow menu. No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/menus); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/menus.json). Platform guidance is counted separately.

Not found at option level (therefore omitted from counts): Untitled UI: typeahead; Base UI: typeahead; React Aria / Spectrum 2: async-loading; Primer: groups; Mantine: outside-dismiss; Atlassian: arrow-navigation. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
