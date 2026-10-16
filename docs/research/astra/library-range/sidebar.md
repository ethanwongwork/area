# Sidebar

## Job

Provide grouped application navigation with optional compact presentation.

Observed family coverage: **9 / 15 implementation systems** (9 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Compose Nav and Menu, then expose expanded, collapsed and overlay structures.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **appearance**: `default` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-17)); `primary` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-17)); `subtle` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-17)).
- **disabled**: `false` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L78), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L101)); `true` — 2 systems ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L78), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L101)).
- **expanded**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L31)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L31)).
- **hasDivider**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderSideNavItems.tsx#L16)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderSideNavItems.tsx#L16)).
- **hasSider**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L96)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L96)).
- **isActive**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderMenuItem.tsx#L25)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderMenuItem.tsx#L25)).
- **isChildOfHeader**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L33)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L33)).
- **isCollapsible**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderMenuButton.tsx#L28)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderMenuButton.tsx#L28)).
- **isCurrentPage**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderMenuItem.tsx#L26)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderMenuItem.tsx#L26)).
- **isDisabled**: `false` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-21)); `true` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-21)).
- **isFixedNav**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L41)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L41)).
- **isMobile**: `false` — 1 system ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L264)); `true` — 1 system ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L264)).
- **isPersistent**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L43)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L43)).
- **isRail**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L42)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L42)).
- **isSelected**: `false` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SwitcherItem.tsx#L62), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-25)); `true` — 2 systems ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SwitcherItem.tsx#L62), [Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-25)).
- **isSideNavExpanded**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/Link.tsx#L19)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/Link.tsx#L19)).
- **variant**: `sidebar, floating, or inset` — 1 system ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L214)).

</details>

## Structural alternatives

- **Standard/floating/inset navigation** — 1 observed implementation systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L214).
- **Expanded/icon-only/off-canvas modes** — 2 observed implementation systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L215), [Mantine](https://mantine.dev/core/app-shell/).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Featured cards** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/sidebar-navigations).
- **Image** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/sidebar-navigations).
- **Composition** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L100).
- **SidebarHeader** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L267).
- **SidebarFooter** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L293).
- **SidebarGroup** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L324).
- **SidebarMenuAction** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L402).
- **Secondary actions** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage).
- **Hamburger icon** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage).
- **Grouping** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage).
- **Icons** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage).
- **Footer** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage).
- **Secondary actions on hover** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/nav/usage).
- **Grouped item sections** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **Group 1** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **Group 2** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **With a heading** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **Nested subnav items** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **Items with leading visuals** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **Items with trailing visuals** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **Items with trailing actions** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **NavList.Group** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **NavList.GroupHeading** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **NavList.TrailingAction** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **NavList.GroupExpand** — 1 system(s): [Primer](https://primer.style/product/components/nav-list/).
- **Header offset configuration** — 1 system(s): [Mantine](https://mantine.dev/core/app-shell/).
- **withBorder prop** — 1 system(s): [Mantine](https://mantine.dev/core/app-shell/).
- **disabled prop** — 1 system(s): [Mantine](https://mantine.dev/core/app-shell/).
- **Interaction rules** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L21).
- **MenuItemGroupType** — 1 system(s): [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L111).
- **Header attributes** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/NavigationRail.md#L120).
- **Icon attributes** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/NavigationRail.md#L180).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **actions**: `ReactNode` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L54)).
- **label**: `ReactNode` — 1 system ([Atlassian](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/src/ui/top-nav-items/themed/types.tsx#lines-53)).
- **subNav**: `React.ReactNode` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L208)).
- **tooltipAlignment**: `start` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderGlobalAction.tsx#L52)); `center` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderGlobalAction.tsx#L52)); `end` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderGlobalAction.tsx#L52)).

</details>

## Interaction patterns

shadcn documents sidebar variants and collapse behavior. Fluent describes secondary actions and grouping; Apple documents platform sidebar expectations.

Evidence: [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L1-L300), [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-nav/library/src/components/Nav/Nav.types.ts#L1-L107), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/sidebars).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **AppShellMode**: `fixed` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.types.ts#L24)); `static` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.types.ts#L24)).
- **addFocusListeners**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L44)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L44)).
- **addMouseListeners**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L45)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNav.tsx#L45)).
- **breakpoint**: `xs` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L104)); `sm` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L104)); `md` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L104)); `lg` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L104)); `xl` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L104)); `xxl` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L104)); `xxxl` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L104)).
- **centered**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L60)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L60)).
- **collapsed**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L106)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L106)).
- **collapsible**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L108)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L108)).
- **disableItemGap**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L55)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L55)).
- **forceSubMenuRender**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L55)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L55)).
- **hideBorder**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L48)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L48)).
- **hideDivider**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L374)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L374)).
- **inlineCollapsed**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L56)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L56)).
- **large**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNavMenu.tsx#L52)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNavMenu.tsx#L52)).
- **layout**: `default` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L75)); `alt` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L75)).
- **mode**: `fixed` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L84)); `static` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L84)); `vertical` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L59)); `horizontal` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L59)); `inline` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L59)).
- **multiple**: `false` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-nav/library/src/components/Nav/Nav.types.ts#L72), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L60)); `true` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-nav/library/src/components/Nav/Nav.types.ts#L72), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L60)).
- **offsetScrollbars**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L81)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L81)).
- **openMobile**: `false` — 1 system ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L262)); `true` — 1 system ([shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L262)).
- **reverseArrow**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L110)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L110)).
- **secondaryType**: `buttons` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L68)); `tabs` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L68)).
- **selectable**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L63)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L63)).
- **small**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNavIcon.tsx#L29)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/SideNavIcon.tsx#L29)).
- **theme**: `light` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L107)); `dark` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L107)).
- **tooltipDropShadow**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderGlobalAction.tsx#L57)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderGlobalAction.tsx#L57)).
- **tooltipHighContrast**: `false` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderGlobalAction.tsx#L63)); `true` — 1 system ([Carbon](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/HeaderGlobalAction.tsx#L63)).
- **triggerSubMenuAction**: `hover` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L70)); `click` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L70)).
- **visuallyHidden**: `false` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L99)); `true` — 1 system ([Primer](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L99)).
- **withBorder**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.types.ts#L6)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.types.ts#L6)).

</details>

## Reuses in Area

[Nav](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L643), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35), [Menu](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L549). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Compose Nav and Menu, then expose expanded, collapsed and overlay structures.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 3 — Standard/floating/inset navigation**: 1 observed systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L214).
- **Layer 3 — Expanded/icon-only/off-canvas modes**: 2 observed systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L215), [Mantine](https://mantine.dev/core/app-shell/).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Sidebar`; aliases appear in the JSON coverage record.

- **Untitled UI**: [sidebar-navigations — component](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/app-navigation/header-navigation.tsx#L1-L226).
- **shadcn/ui**: [sidebar — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/sidebar.mdx#L1-L300).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: [nav — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-nav/library/src/components/Nav/Nav.types.ts#L1-L107).
- **Primer**: [nav-list — component](https://github.com/primer/react/blob/a89299ae77e8f444599f94d7e9ca368c17be3f9a/packages/react/src/NavList/NavList.tsx#L1-L300).
- **Carbon**: [UIShell — component](https://github.com/carbon-design-system/carbon/blob/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757/packages/react/src/components/UIShell/Header.tsx#L1-L64).
- **Material 3**: [navigation — component](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/navigation/DividerMenuItem.java#L1-L265); [navigationrail — component](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/navigationrail/LabelMoveTransition.java#L1-L71).
- **Mantine**: [AppShell — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/components/AppShell/AppShell.tsx#L1-L225).
- **Ant Design**: [layout — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/layout/index.en-US.md#L1-L139); [menu — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/menu/index.en-US.md#L1-L165).
- **Chakra/Ark**: **not found** for this job in the reviewed [catalogue](https://www.chakra-ui.com/docs/components/concepts/overview) and [pinned source inventory](https://github.com/chakra-ui/ark/tree/b561e95d20d6bd0e75cdc08e762e881628b110f7).
- **Atlassian**: [navigation-system — component](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651/design-system/navigation-system/README.md#lines-1:26).
- **Polaris**: [section — analogue](https://shopify.dev/docs/api/app-home/latest/web-components/layout-and-structure/section).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [sidebars — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/sidebars).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
