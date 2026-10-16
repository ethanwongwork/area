# Command Palette — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Search and invoke commands from a focused results surface. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L11)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **Untitled UI** (component): `layout`: `standard`, `stacked`; `content`: `users`, `actions`, `integrations` [Untitled UI 1](https://www.untitledui.com/react/components/command-menus)

- **shadcn/ui** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [shadcn/ui 1](https://ui.shadcn.com/docs/components/command.md)

- **Base UI** (headless): `mode`: `list`, `both`, `inline`, `none` [Base UI 1](https://base-ui.com/react/components/autocomplete.md)

  Autocomplete is a documented building block; modal command shell is composition.

<details>

<summary>Base UI: additional/source-part API enum inventory</summary>

- Root / `open`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Root / `loopFocus`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Root / `modal`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Root / `mode`: `list`, `both`, `inline`, `none`. [API](https://base-ui.com/react/components/autocomplete.md)

- Root / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Root / `readOnly`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Root / `required`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Trigger / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Input / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Clear / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Positioner / `disableAnchorTracking`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

- Item / `disabled`: `false`, `true`. [API](https://base-ui.com/react/components/autocomplete.md)

</details>

- **React Aria / Spectrum 2** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Autocomplete.md)

<details>

<summary>React Aria / Spectrum 2: additional/source-part API enum inventory</summary>

- Autocomplete / `disableAutoFocusFirst`: `false`, `true`. [API](https://react-aria.adobe.com/Autocomplete.md)

- Autocomplete / `disableVirtualFocus`: `false`, `true`. [API](https://react-aria.adobe.com/Autocomplete.md)

</details>

- **Primer** (internal): `open`: `false`, `true` [Primer 1](https://primer.style/product/internal-components/command-palette/)

  GitHub-only component; excluded from external shipping counts. Result anatomy/configuration values not found in its public API page.

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `open Required`: `false`, `true`. [API](https://primer.style/product/internal-components/command-palette/)

</details>

- **Mantine** (component): `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/x-spotlight.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- Props / `clearQueryOnClose`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `closeOnActionTrigger`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `closeOnClickOutside`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `closeOnEscape`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `disabled`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `fullScreen`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `returnFocus`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `trapFocus`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `triggerOnContentEditable`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `withOverlay`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `withinPortal`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `closeSpotlightOnTrigger`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `loading`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `loadingPosition`: `left`, `right`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `required`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `withAria`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `withErrorStyles`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- Props / `withSuccessStyles`: `false`, `true`. [API](https://mantine.dev/llms/x-spotlight.md)

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

## Structural alternatives

- **Untitled UI** (component): search and results; empty state. [Untitled UI 1](https://www.untitledui.com/react/components/command-menus)

- **shadcn/ui** (component): inline; dialog; shortcut labels; groups; scrollable list; empty state. [shadcn/ui 1](https://ui.shadcn.com/docs/components/command.md)

- **Base UI** (headless): autocomplete with action results; inline completion; grouped results. [Base UI 1](https://base-ui.com/react/components/autocomplete.md)

- **React Aria / Spectrum 2** (composition): Autocomplete command palette; menu results; listbox results; grid/list/table results. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Autocomplete.md)

- **Primer** (internal): global search dialog; page results; route context. [Primer 1](https://primer.style/product/internal-components/command-palette/)

- **Mantine** (component): Spotlight; groups; descriptions; left/right sections; custom search; empty state; scroll area. [Mantine 1](https://mantine.dev/llms/x-spotlight.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

## Interaction patterns

- **Untitled UI** (component): Exact keyboard and dismissal contract not found in public example text. [Untitled UI 1](https://www.untitledui.com/react/components/command-menus)

- **shadcn/ui** (component): search actions; keyboard list navigation; dialog dismissal. [shadcn/ui 1](https://ui.shadcn.com/docs/components/command.md)

- **Base UI** (headless): filter without selected-value state. [Base UI 1](https://base-ui.com/react/components/autocomplete.md)

- **React Aria / Spectrum 2** (composition): async loading; inline completion; filter and activate. [React Aria / Spectrum 2 1](https://react-aria.adobe.com/Autocomplete.md)

- **Primer** (internal): controlled open; return focus. [Primer 1](https://primer.style/product/internal-components/command-palette/)

- **Mantine** (component): hotkey; search filter; arrow navigation; action activation. [Mantine 1](https://mantine.dev/llms/x-spotlight.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

## Area today

Modal/inline, grouped items, icons, descriptions, shortcuts, disabled items, empty state and default/custom/no footer. Mod+K, wrapping arrows, Ctrl+Home/End; Enter executes and closes unless keepOpen; Escape clears then closes. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L7), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L11), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L19), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L51), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L66)

No result preview pane, query/filter tokens, nested result pages or asynchronous loading contract. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L484), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

**Owner boundary:** Header/filter recipe slots were deferred; retain command semantics rather than treating every searchable picker as a palette. [decision 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L7)

- **commandPalette manifest:** no design-time variant enum; boolean modifiers: `inline`. [packages/styles/src/manifest.ts:484](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L484)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Inline and modal layouts** — layer 3; **4 systems**; Area **yes**; **retain**. Existing layouts. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/command.md), [Base UI](https://base-ui.com/react/components/autocomplete.md), [React Aria / Spectrum 2](https://react-aria.adobe.com/Autocomplete.md), [Mantine](https://mantine.dev/llms/x-spotlight.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

- **Groups, descriptions and shortcut hints** — layer 3; **2 systems**; Area **yes**; **retain**. Existing item anatomy. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/command.md), [Mantine](https://mantine.dev/llms/x-spotlight.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

- **Async results** — layer 3; **1 systems**; Area **not-found**; **add**. Define loading/error/cancellation separately from empty results. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/Autocomplete.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

- **Alternative result collections** — layer 3; **1 systems**; Area **not-found**; **consider**. Grid/table results change navigation semantics. Evidence: [React Aria / Spectrum 2](https://react-aria.adobe.com/Autocomplete.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

- **Global hotkey and keyboard execution** — layer 3; **1 systems**; Area **yes**; **retain**. Existing Mod+K and action execution. Evidence: [Mantine](https://mantine.dev/llms/x-spotlight.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

- **Stacked query/result layout** — layer 3; **1 systems**; Area **partial**; **consider**. UUI example title is public; exact keyboard behavior is not disclosed. Evidence: [Untitled UI](https://www.untitledui.com/react/components/command-menus). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

- **Nested result pages** — layer 3; **0 systems**; Area **not-found**; **consider**. Primer internal-only documentation is excluded from shipping counts. Evidence: [Primer [excluded: internal]](https://primer.style/product/internal-components/command-palette/). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — component

- [component/source](https://www.untitledui.com/react/components/command-menus) — read; checked 2026-09-28.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/command.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — headless

- [component/source](https://base-ui.com/react/components/autocomplete.md) — read; checked 2026-09-28.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — composition

- [component/source](https://react-aria.adobe.com/Autocomplete.md) — read; checked 2026-09-28.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — internal

- [component/source](https://primer.style/product/internal-components/command-palette/) — read; checked 2026-09-28.

- [catalogue searched](https://primer.style/product/components/) — read; checked 2026-09-28.

### Carbon — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://carbondesignsystem.com/components/overview/components/) — read; checked 2026-09-28.

### Material 3 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Material implementation facts use the pinned Android source docs where the design site is script-only. SDK parity is not assumed.

- [catalogue searched](https://m3.material.io/components) — catalogue retrieval limited; no absence inference; checked 2026-09-28.

- [catalogue searched](https://api.github.com/repos/material-components/material-components-android/contents/docs/components?ref=60ff09436d5d477a4b9d02940f31eb01e1250620) — read; checked 2026-09-28.

### Mantine — component

- [component/source](https://mantine.dev/llms/x-spotlight.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [component/source](https://ark-ui.com/llms.txt/components/listbox) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:484 — commandPalette](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L484)

- [docs/specs/command-palette.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L1)

- [docs/specs/command-palette.md:7 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L7)

- [docs/specs/command-palette.md:11 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L11)

- [docs/specs/command-palette.md:19 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L19)

- [docs/specs/command-palette.md:51 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L51)

- [docs/specs/command-palette.md:66 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/command-palette.md#L66)
