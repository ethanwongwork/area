# Kbd — library range

Checked 2026-09-28. Area baseline `c585f8c5f38705a7efa79bf05148a8c6989b142a`. [Method and scope](README-1.md).

## Job

Display a readable keyboard key, chord or sequence. [Area spec 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L17)

## Variant axes

The summaries retain system-specific terminology, with descriptive shorthand for open types (such as responsive-map or custom-key-or-number); those shorthand labels are not literal prop values. The expandable API inventories preserve finite values found in the linked API tables. Numeric size names are API values, not dimensions measured here. Combined pages may document several component parts; the API inventory identifies the source part when available.

- **shadcn/ui** (component): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [shadcn/ui 1](https://ui.shadcn.com/docs/components/kbd.md)

- **Radix Themes** (component): `variant`: `classic`, `soft` [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/kbd)

<details>

<summary>Radix Themes: additional/source-part API enum inventory</summary>

- `variant`: `classic`, `soft`. [API](https://www.radix-ui.com/themes/docs/components/kbd)

</details>

- **Primer** (component): `format`: `condensed`, `full`; `size`: `small`, `normal`; `variant`: `normal`, `onEmphasis`, `onPrimary` [Primer 1](https://primer.style/product/components/keybinding-hint)

  KeybindingHint is draft. onPrimary appears in usage/example but is missing from the API enum; verify before adoption.

<details>

<summary>Primer: additional/source-part API enum inventory</summary>

- `format`: `condensed`, `full`. [API](https://primer.style/product/components/keybinding-hint)

- `variant`: `normal`, `onEmphasis`. [API](https://primer.style/product/components/keybinding-hint)

- `size`: `small`, `normal`. [API](https://primer.style/product/components/keybinding-hint)

</details>

- **Mantine** (component): `size`: `xs`, `sm`, `md`, `lg`, `xl`, `custom` [Mantine 1](https://mantine.dev/llms/core-kbd.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

<details>

<summary>Mantine: additional/source-part API enum inventory</summary>

- `focusRing`: `auto`, `always`, `never`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `autoContrast`: `false`, `true`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- `textWrap`: `wrap`, `nowrap`, `balance`, `pretty`, `stable`. [API](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

</details>

- **Ant Design** (composition): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Ant Design 1](https://ant.design/components/typography)

- **Chakra/Ark** (component): `variant`: `raised`, `outline`, `subtle`, `plain`; `size`: `sm`, `md`, `lg` [Chakra/Ark 1](https://chakra-ui.com/docs/components/kbd)

<details>

<summary>Chakra/Ark: additional/source-part API enum inventory</summary>

- `variant`: `raised`, `outline`, `subtle`, `plain`. [API](https://chakra-ui.com/docs/components/kbd)

- `size`: `sm`, `md`, `lg`. [API](https://chakra-ui.com/docs/components/kbd)

</details>

- **Apple HIG** (guidance): No independent finite visual axis established in the examined example/API text; see anatomy and behavior below. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/keyboards.json)

## Structural alternatives

- **shadcn/ui** (component): keycap; chord group; inside button; inside tooltip; inside input group. [shadcn/ui 1](https://ui.shadcn.com/docs/components/kbd.md)

- **Radix Themes** (component): shortcut keycap. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/kbd)

- **Primer** (component): single key; chord; sequence; platform modifier glyph. [Primer 1](https://primer.style/product/components/keybinding-hint)

- **Mantine** (component): single key; shortcut sequence. [Mantine 1](https://mantine.dev/llms/core-kbd.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): Typography keyboard styling. [Ant Design 1](https://ant.design/components/typography)

- **Chakra/Ark** (component): modifier combinations; function key; inline text. [Chakra/Ark 1](https://chakra-ui.com/docs/components/kbd)

- **Apple HIG** (guidance): modifier glyphs; shortcut labels. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/keyboards.json)

## Interaction patterns

- **shadcn/ui** (component): display only. [shadcn/ui 1](https://ui.shadcn.com/docs/components/kbd.md)

- **Radix Themes** (component): display only. [Radix Themes 1](https://www.radix-ui.com/themes/docs/components/kbd)

- **Primer** (component): display only; Mod resolves per platform. [Primer 1](https://primer.style/product/components/keybinding-hint)

- **Mantine** (component): display only. [Mantine 1](https://mantine.dev/llms/core-kbd.md), [Mantine 2](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts)

- **Ant Design** (composition): display only. [Ant Design 1](https://ant.design/components/typography)

- **Chakra/Ark** (component): display only. [Chakra/Ark 1](https://chakra-ui.com/docs/components/kbd)

- **Apple HIG** (guidance): platform standard shortcuts. [Apple HIG 1](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/keyboards.json)

## Area today

Normal/small; default/quiet/on-color/on-emphasis; KbdGroup supports chords/sequences; visible glyphs have spoken alternatives. Display only. [Area 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1), [Area 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L7), [Area 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L17), [Area 4](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L24), [Area 5](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L79), [Area 6](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L100)

No automatic platform Mod mapping, condensed/full text-format axis or keyboard-binding engine documented. [baseline 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L661), [baseline 2](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L672), [baseline 3](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

- **kbd manifest:** `size` = `small`, `normal`; `appearance` = `default`, `quiet`, `on-color`, `on-emphasis`. [packages/styles/src/manifest.ts:661](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L661)

- **kbdGroup manifest:** no design-time variant enum. [packages/styles/src/manifest.ts:672](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L672)

## Proposed range

These are catalogue recommendations, not implementation approval. **Layer 2** changes a variant/state policy; **layer 3** changes anatomy, layout or its interaction contract. Counts are verified lower bounds across the named external systems. Guidance, internal-only and adjacent components are shown but excluded from counts.

- **Small and normal display sizes** — layer 2; **1 systems**; Area **yes**; **retain**. Existing sizes. Evidence: [Primer](https://primer.style/product/components/keybinding-hint). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

- **Surface-aware emphasis** — layer 2; **2 systems**; Area **yes**; **retain**. Existing ground variants. Evidence: [Primer](https://primer.style/product/components/keybinding-hint), [Chakra/Ark](https://chakra-ui.com/docs/components/kbd). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

- **Single key, chord and sequence** — layer 3; **3 systems**; Area **yes**; **retain**. Existing KbdGroup. Evidence: [shadcn/ui](https://ui.shadcn.com/docs/components/kbd.md), [Primer](https://primer.style/product/components/keybinding-hint), [Mantine](https://mantine.dev/llms/core-kbd.md). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

- **Platform-aware Mod glyph** — layer 3; **1 systems**; Area **not-found**; **add**. Map display per platform without registering a binding. Evidence: [Primer](https://primer.style/product/components/keybinding-hint). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

- **Condensed glyph versus full-name text** — layer 2; **1 systems**; Area **partial**; **consider**. Spoken alternatives exist; explicit visible format axis does not. Evidence: [Primer](https://primer.style/product/components/keybinding-hint). [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

- **Shortcut registration/recording** — layer 3; **0 systems**; Area **not-applicable**; **do-not-add**. Display stays separate from the command engine, per Area spec. Evidence: [Area basis 1](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L661); no verified equivalent counted in this scan. [Area comparison](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

## Sources

All external sources checked **2026-09-28**. Area links pin `c585f8c5f38705a7efa79bf05148a8c6989b142a`. A failed/empty page is not evidence of absence. Public example labels count only for what their text establishes; no private PRO code or screenshot dimensions were used.

### Untitled UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://www.untitledui.com/react/components) — read; checked 2026-09-28.

### shadcn/ui — component

- [component/source](https://ui.shadcn.com/docs/components/kbd.md) — read; checked 2026-09-28.

- [catalogue searched](https://ui.shadcn.com/llms.txt) — read; checked 2026-09-28.

### Radix Themes — component

- [component/source](https://www.radix-ui.com/themes/docs/components/kbd) — read; checked 2026-09-28.

- [catalogue searched](https://www.radix-ui.com/themes/docs/overview/getting-started) — read; checked 2026-09-28.

### Base UI — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://base-ui.com/llms.txt) — read; checked 2026-09-28.

### React Aria / Spectrum 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://react-aria.adobe.com/llms.txt) — read; checked 2026-09-28.

- [catalogue searched](https://react-spectrum.adobe.com/llms.txt) — read; checked 2026-09-28.

### Fluent 2 — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://fluent2.microsoft.design/components/web/react) — read; checked 2026-09-28.

### Primer — component

- [component/source](https://primer.style/product/components/keybinding-hint) — read; checked 2026-09-28.

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

- [component/source](https://mantine.dev/llms/core-kbd.md) — read; checked 2026-09-28.

- [component/source](https://raw.githubusercontent.com/mantinedev/mantine/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/core/src/core/MantineProvider/theme.types.ts) — read; checked 2026-09-28.

- [catalogue searched](https://mantine.dev/llms.txt) — read; checked 2026-09-28.

### Ant Design — composition

- [component/source](https://ant.design/components/typography) — read; checked 2026-09-28.

- [catalogue searched](https://ant.design/components/overview/) — read; checked 2026-09-28.

### Chakra/Ark — component

- [component/source](https://chakra-ui.com/docs/components/kbd) — read; checked 2026-09-28.

- [catalogue searched](https://chakra-ui.com/docs/components/concepts/overview) — read; checked 2026-09-28.

- [catalogue searched](https://ark-ui.com/llms.txt) — read; checked 2026-09-28.

### Atlassian — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://atlassian.design/components) — read; checked 2026-09-28.

### Polaris — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

Scope: current App Home web components; retired React component names are not substituted.

- [component/source](https://shopify.dev/docs/api/app-home/latest/web-components/typography-and-content/text.md) — read; checked 2026-09-28.

- [catalogue searched](https://shopify.dev/docs/api/app-home/latest/web-components) — read; checked 2026-09-28.

### GOV.UK — not-found

not found: a directly equivalent family was not established in the examined catalogue and linked adjacent/search pages.

- [catalogue searched](https://design-system.service.gov.uk/components/) — read; checked 2026-09-28.

### Apple HIG — guidance

Official public DocC JSON is the readable source behind the HIG site; guidance is platform-specific and excluded from shipped-system counts.

- [component/source](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/keyboards.json) — read; checked 2026-09-28.

- [catalogue searched](https://developer.apple.com/tutorials/data/design/human-interface-guidelines/components.json) — read; checked 2026-09-28.

### Area baseline

- [packages/styles/src/manifest.ts:661 — kbd](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L661)

- [packages/styles/src/manifest.ts:672 — kbdGroup](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L672)

- [docs/specs/kbd.md:1 — spec](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L1)

- [docs/specs/kbd.md:7 — Owner decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L7)

- [docs/specs/kbd.md:17 — Job and boundaries](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L17)

- [docs/specs/kbd.md:24 — Variants](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L24)

- [docs/specs/kbd.md:79 — Decisions](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L79)

- [docs/specs/kbd.md:100 — Behavior and accessibility](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/specs/kbd.md#L100)
