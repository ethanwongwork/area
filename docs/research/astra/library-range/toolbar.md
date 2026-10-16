# Toolbar — library range

Baseline `7dae828e7af1daf9d26b663d34335121156606f7` · public references checked 2026-09-28. Counts and scope rules: [README-2](README-2.md).

## Job

Groups commands with keyboard navigation and optional overflow. [Area manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83).

Boundary: Plain/surface; sm/md/lg; horizontal/vertical; fullWidth; grouping, track composition and overflow disclosure. It uses native details with Buttons; it is not a menu and does not automatically move overflowing items. The spec explicitly disclaims Primer overflow parity. [Area spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1).

## Variant axes

- **Base UI** (component): orientation: horizontal, vertical; state: disabled. [Source](https://base-ui.com/react/components/toolbar) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): orientation: horizontal, vertical. [Source](https://react-aria.adobe.com/Toolbar) (checked 2026-09-28).
- **React Aria / Spectrum 2** (adjacent): size: S, M, L, XL, XS; density: regular, compact; orientation: horizontal, vertical; quiet: false, true; static-color: white, black, auto. [Source](https://react-spectrum.adobe.com/ActionButtonGroup) (checked 2026-09-28).
- **Material 3** (experimental-component): orientation: horizontal, vertical. [Source](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingToolbar.kt) (checked 2026-09-28).
- **Chakra/Ark** (adjacent): size: xs, sm, md, lg; placement: bottom-start, bottom, bottom-end. [Source](https://chakra-ui.com/docs/components/action-bar) (checked 2026-09-28).

## Structural alternatives

- **Base UI** (component): groups, separator, toggle-group, links, input. [Source](https://base-ui.com/react/components/toolbar) (checked 2026-09-28).
- **React Aria / Spectrum 2** (primitive): groups, toggle-group, links, input. [Source](https://react-aria.adobe.com/Toolbar) (checked 2026-09-28).
- **React Aria / Spectrum 2** (adjacent): groups, equal-width. [Source](https://react-spectrum.adobe.com/ActionButtonGroup) (checked 2026-09-28).
- **Fluent 2** (component): groups, separator, overflow-menu, icons. [Source](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage) (checked 2026-09-28).
- **Primer** (component): groups, separator, overflow-menu, icons. [Source](https://primer.style/product/components/action-bar/) (checked 2026-09-28).
- **Material 3** (experimental-component): floating-surface, leading-content, trailing-content, fab, scrollable-content. [Source](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingToolbar.kt) (checked 2026-09-28).
- **Mantine** (adjacent): floating-surface, separator, close-button. [Source](https://mantine.dev/core/action-bar/) (checked 2026-09-28).
- **Chakra/Ark** (adjacent): floating-surface, separator, close-button. [Source](https://chakra-ui.com/docs/components/action-bar) (checked 2026-09-28).
- **Apple HIG** (guidance): groups, icons, labels, overflow-menu, customizable-items. [Source](https://developer.apple.com/design/human-interface-guidelines/toolbars) (checked 2026-09-28).

## Interaction patterns

- **roving-focus**: [Base UI](https://base-ui.com/react/components/toolbar), [React Aria / Spectrum 2](https://react-aria.adobe.com/Toolbar) (checked 2026-09-28).
- **arrow-navigation**: [Base UI](https://base-ui.com/react/components/toolbar), [React Aria / Spectrum 2](https://react-aria.adobe.com/Toolbar) (checked 2026-09-28).
- **responsive-overflow**: [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage), [Primer](https://primer.style/product/components/action-bar/), [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/toolbars) (checked 2026-09-28).
- **customize**: [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/toolbars) (checked 2026-09-28).
- **collapse-expand**: [Material 3](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingToolbar.kt) (checked 2026-09-28).
- **scroll-responsive**: [Material 3](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingToolbar.kt) (checked 2026-09-28).
- **bulk-actions**: [Mantine](https://mantine.dev/core/action-bar/), [Chakra/Ark](https://chakra-ui.com/docs/components/action-bar) (checked 2026-09-28).

## Area today

Plain/surface; sm/md/lg; horizontal/vertical; fullWidth; grouping, track composition and overflow disclosure. It uses native details with Buttons; it is not a menu and does not automatically move overflowing items. The spec explicitly disclaims Primer overflow parity. [Baseline spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1).

- Exact manifest axes: variant = plain, surface; size = sm, md, lg; orientation = horizontal, vertical. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83).
- Boolean modifiers: full-width. Runtime state hooks: none declared. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83).
- Slots: group, separator, overflow, overflow-trigger, overflow-dots, overflow-content. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83).

Per-option Area results (all at the baseline; “not found” is scoped to the manifest and spec):

- **yes**: `interaction:arrow-navigation`, `interaction:roving-focus`, `orientation:horizontal`, `orientation:vertical`, `size:lg`, `size:md`, `size:sm`, `structure:groups`, `structure:icons`, `structure:separator`, `variant:plain`, `variant:surface`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1-L241).
- **not found**: `interaction:bulk-actions`, `interaction:collapse-expand`, `interaction:customize`, `interaction:scroll-responsive`, `placement:bottom`, `placement:bottom-end`, `placement:bottom-start`, `quiet:false`, `quiet:true`, `size:XL`, `size:XS`, `size:xs`, `state:disabled`, `structure:close-button`, `structure:customizable-items`, `structure:equal-width`, `structure:fab`, `structure:labels`, `structure:leading-content`, `structure:scrollable-content`, `structure:trailing-content`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1-L241).
- **composition**: `structure:floating-surface`, `structure:input`, `structure:links`, `structure:toggle-group`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1-L241).
- **partial**: `interaction:responsive-overflow`, `structure:overflow-menu`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1-L241).
- **equivalent tier / geometry not asserted**: `size:L`, `size:M`, `size:S`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1-L241).
- **system-level / not this exact option**: `density:compact`, `density:regular`, `static-color:auto`, `static-color:black`, `static-color:white`. [Manifest](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1-L241).

## Proposed range

Recommendations for owner selection, not implementation commitments. Direct counts include official components/examples/recipes; experimental, adjacent and guidance counts are separate. Each bundle count is a union (at least one listed alternative); exact individual counts are in [index-2.json](index-2.json).

- **Layer 2 · Retain the documented baseline inventory** — 1 direct systems; 1 experimental implementation; 2 supporting/adjacent systems. Direct: Base UI. Retain the current size/tone/state inventory while the owner selects additions below. No removal is inferred from a zero exact-spelling external count. Evidence: [1](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83), [2](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1).
  - Individual options: `variant:plain` (0 direct; Area: yes); `variant:surface` (0 direct; Area: yes); `size:sm` (0 direct; Area: yes); `size:md` (0 direct; Area: yes); `size:lg` (0 direct; Area: yes); `orientation:horizontal` (1 direct; Area: yes); `orientation:vertical` (1 direct; Area: yes).
- **Layer 3 · Responsive overflow with labeled hidden commands** — 2 direct systems; 1 guidance systems. Direct: Fluent 2, Primer. Area’s manual details disclosure is not automatic overflow; this deserves its own contract. Evidence: [1](https://developer.apple.com/design/human-interface-guidelines/toolbars), [2](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage), [3](https://primer.style/product/components/action-bar/).
  - Individual options: `interaction:responsive-overflow` (2 direct; Area: partial); `structure:overflow-menu` (2 direct; Area: partial).
- **Layer 3 · Docked/plain versus floating toolbar** — 0 direct systems; 1 experimental implementation; 2 supporting/adjacent systems. Direct: none verified as a direct implementation/example. Preserve the base command grouping while offering a deliberate surface composition. Evidence: [1](https://chakra-ui.com/docs/components/action-bar), [2](https://mantine.dev/core/action-bar/), [3](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingToolbar.kt).
  - Individual options: `structure:floating-surface` (0 direct; Area: composition).
- **Layer 3 · Selection-driven action bar recipe** — 0 direct systems; 2 supporting/adjacent systems. Direct: none verified as a direct implementation/example. Keep selection ownership outside Toolbar; not every action group is a roving-focus toolbar. Evidence: [1](https://chakra-ui.com/docs/components/action-bar), [2](https://mantine.dev/core/action-bar/).
  - Individual options: `interaction:bulk-actions` (0 direct; Area: not found).

## Sources

- Area: [manifest, lines 76–83](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/packages/styles/src/manifest.ts#L76-L83); [spec](https://github.com/ethanwongwork/area/blob/7dae828e7af1daf9d26b663d34335121156606f7/docs/specs/toolbar.md#L1). All Area judgments refer to starting commit `7dae828e7af1daf9d26b663d34335121156606f7`, not concurrent work.
- Research method and version boundaries: [README-2.md](README-2.md). URL check log: [source-audit-2.json](source-audit-2.json).

Searched terms: toolbar, action bar, action button group (group semantics are adjacent). The following list accounts for all 16 requested systems. “Not found” never counts as a missing component proved absent.

- **Untitled UI — not found**: checked [catalogue](https://www.untitledui.com/react/components) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **shadcn/ui — not found**: checked [catalogue](https://ui.shadcn.com/docs/components) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Radix Themes — not found**: checked [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Base UI**: [source 1](https://base-ui.com/react/components/toolbar); checked 2026-09-28.
- **React Aria / Spectrum 2**: [source 1](https://react-aria.adobe.com/Toolbar), [source 2](https://react-spectrum.adobe.com/ActionButtonGroup); checked 2026-09-28.
- **Fluent 2**: [source 1](https://fluent2.microsoft.design/components/web/react/core/toolbar/usage); checked 2026-09-28.
- **Primer**: [source 1](https://primer.style/product/components/action-bar/); checked 2026-09-28.
- **Carbon — not found**: checked [catalogue](https://carbondesignsystem.com/components/overview/components/) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Material 3**: [source 1](https://raw.githubusercontent.com/androidx/androidx/fd0608f8a32b70fc7f145d258fc46e6d15b5f007/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/FloatingToolbar.kt); checked 2026-09-28.
- **Mantine**: [source 1](https://mantine.dev/core/action-bar/); checked 2026-09-28.
- **Ant Design — not found**: checked [catalogue](https://ant.design/components/overview/) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Chakra/Ark**: [source 1](https://chakra-ui.com/docs/components/action-bar); checked 2026-09-28.
- **Atlassian — not found**: checked [catalogue](https://atlassian.design/components) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Polaris — not found**: checked [catalogue](https://shopify.dev/docs/api/app-home/latest/web-components) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **GOV.UK — not found**: checked [catalogue](https://design-system.service.gov.uk/components/) on 2026-09-28 for toolbar, action bar, action button group (group semantics are adjacent). No independently verified option recorded; see the audit for lookup limitations.
- **Apple HIG**: [source 1](https://developer.apple.com/design/human-interface-guidelines/toolbars); checked 2026-09-28.
  - Readable official data: [documentation JSON](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/toolbars.json). Platform guidance is counted separately.

Not found at option level (therefore omitted from counts): Fluent 2: arrow-navigation. Looked in the corresponding component pages linked above; these omissions are evidence limits, not assertions of absent behavior.
