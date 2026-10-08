# Carousel

## Job

Browse a sequence of cards or media through a constrained viewport.

Observed family coverage: **7 / 15 implementation systems** (7 with a component source; 0 recipe-only). Apple HIG is checked separately as platform guidance. Counts are evidence-based lower bounds; see Sources.

Separate arrow/dot navigation, axis, item sizing and autoplay; reuse Card content.

## Variant axes

The native inventory below preserves source names and literal values. Counts refer to the **exact axis/value**, not matching pixel dimensions. Boolean values are runtime/configuration choices; mode and density remain system settings. A named type or open parameter is not an invented enum; its value list is **not found in this declaration** unless a linked enum row supplies it. Source owners distinguish root props from subparts.

<details>
<summary>Verified native appearance and state options</summary>

- **appearance**: `CarouselAppearance` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L48)).
- **autoSize**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)).
- **controlSize**: `React.CSSProperties['width']` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L76)).
- **groupSize**: `auto` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L64)).
- **includeGapInSize**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L97)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L97)).
- **isDisabled**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L194)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L194)).
- **isSelected**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L256)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L256)).
- **slideSize**: `StyleProp&lt;string | number&gt;` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L82)).

</details>

## Structural alternatives

- **Horizontal/vertical and variable widths** — 3 observed implementation systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/carousel.tsx#L20), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/carousel.mdx#L103), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L88).
- **Card/banner/gallery/hero layouts** — 2 observed implementation systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage), [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Carousel.md#L68).

<details>
<summary>Additional named examples in the reviewed documentation</summary>

These are source-labelled compositions or demonstrations, not inferred anatomy from screenshots. Their names alone do not establish a new primitive or a complete behavior contract.

- **Carousel components** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/carousels).
- **Carousel example** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/carousels).
- **Carousel examples** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/carousels).
- **Carousel md** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/carousels).
- **Carousel lg** — 1 system(s): [Untitled UI](https://www.untitledui.com/react/components/carousels).
- **Composition** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/carousel.mdx#L88).
- **Orientation** — 1 system(s): [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/carousel.mdx#L155).
- **Carousel Preview** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage).
- **Clickable actions** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage).
- **Image gallery** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage).
- **Card layout** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage).
- **Image gallery layout** — 1 system(s): [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage).
- **Vertical** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel).
- **Carousel** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel).
- **Carousel.Indicators** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel).
- **Image Carousel** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel).
- **Property Card** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel).
- **ItemGroup** — 1 system(s): [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel).
- **Multi browse** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Carousel.md#L38).
- **Uncontained** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Carousel.md#L54).
- **Layouts of carousel** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Carousel.md#L126).
- **Adding carousel** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Carousel.md#L251).
- **Customizing carousel** — 1 system(s): [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Carousel.md#L327).
- **Vertical orientation** — 1 system(s): [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/apps/mantine.dev/src/pages/x/carousel.mdx#L88).
- **Controls icons** — 1 system(s): [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/apps/mantine.dev/src/pages/x/carousel.mdx#L94).
- **Example: Images carousel** — 1 system(s): [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/apps/mantine.dev/src/pages/x/carousel.mdx#L159).
- **Example: Cards carousel** — 1 system(s): [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/apps/mantine.dev/src/pages/x/carousel.mdx#L163).

</details>

<details>
<summary>Native layout and anatomy declarations</summary>

- **DotPlacement**: `top` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L16)); `bottom` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L16)); `start` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L16)); `end` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L16)).
- **align**: `center` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L30)); `start` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L30)); `end` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L30)).
- **arrows**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L35)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L35)).
- **dotPlacement**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L39)); `DotPlacement` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L29)).
- **dotPosition**: `left` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L28)); `right` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L28)).
- **nextControlIcon**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L112)).
- **orientation**: `horizontal` — 4 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L19), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/carousel.tsx#L20), [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L88)); `vertical` — 4 systems ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L19), [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/carousel.tsx#L20), [Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L88)).
- **previousControlIcon**: `React.ReactNode` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L115)).
- **snapAlign**: `center` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)); `start` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)); `end` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)).
- **~~dotPosition~~**: `string` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L40)).

</details>

## Interaction patterns

Ark documents keyboard navigation, autoplay, pause-on-hover and drag. Fluent distinguishes card/banner/gallery layouts; Material documents multi-browse, hero and fullscreen alternatives.

Evidence: [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/carousel.mdx#L1-L123), [Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L1-L141), [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/carousel/Arrangement.java#L1-L292).

Keyboard, selection, dismissal, loading and drag are separate contracts. Options below are only the declarations found in these sources; an absent contract is **not found**, not implicitly implemented by a visual composition. Static content inherits interaction from its child controls.

<details>
<summary>Native behavioral options and open parameters</summary>

- **adaptiveHeight**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L38)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L38)).
- **allowMouseDrag**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)).
- **circular**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L58)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L58)).
- **direction**: `prev` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L188)); `next` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L188)).
- **dotDuration**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L33)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L33)).
- **draggable**: `false` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L70), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L42)); `true` — 2 systems ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L70), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L42)).
- **effect**: `scrollx` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L47)); `fade` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L47)).
- **fade**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L43)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L43)).
- **infinite**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L44)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L44)).
- **loop**: `false` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)); `true` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)).
- **overflowHidden**: `false` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L160)); `true` — 1 system ([Untitled UI](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L160)).
- **slidesPerMove**: `auto` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)).
- **snapType**: `proximity` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)); `mandatory` — 1 system ([Chakra/Ark](https://www.chakra-ui.com/docs/components/carousel)).
- **type**: `media` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L91)); `container` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L91)).
- **waitForAnimate**: `false` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L32)); `true` — 1 system ([Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L32)).
- **whitespace**: `false` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L76)); `true` — 1 system ([Fluent 2](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L76)).
- **withControls**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L103)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L103)).
- **withIndicators**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L106)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L106)).
- **withKeyboardEvents**: `false` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L118)); `true` — 1 system ([Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L118)).

</details>

## Reuses in Area

[Card](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L512), [Button](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L35). These are existing manifest families at the pinned base; reuse is a proposal, not proof that the composed behavior is already complete.

New prerequisites are recorded in [README-3.md](README-3.md#build-order-proposal); they are not counted as existing Area reuse.

## Proposed range

Separate arrow/dot navigation, axis, item sizing and autoplay; reuse Card content.

Start with the following layer 2/3 categories. A category count means the system documents at least one alternative in that category; it does **not** claim every named alternative is shared. Exact per-value counts are in the native inventory and [index-3.json](index-3.json). No public geometry is inferred from screenshots.

- **Layer 2 — Autoplay/pause/explicit navigation**: 3 observed systems. [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/carousel.mdx#L52), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage), [Ant Design](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.tsx#L33).
- **Layer 3 — Horizontal/vertical and variable widths**: 3 observed systems. [shadcn/ui](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/registry/bases/aria/ui/carousel.tsx#L20), [Chakra/Ark](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/carousel.mdx#L103), [Mantine](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L88).
- **Layer 3 — Card/banner/gallery/hero layouts**: 2 observed systems. [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage), [Fluent 2](https://fluent2.microsoft.design/components/web/react/core/carousel/usage), [Material 3](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/docs/components/Carousel.md#L68).

Layer 2 also includes the linked native treatment/size/state alternatives above where compatible with this job. Do not take the Cartesian product: preserve the source-specific applicability and validate combinations during the later component-build process.

## Sources

Checked **2026-09-28**. Public pages are date-stamped; code links pin the commit and line. Full pins: [source-pins-3.json](source-pins-3.json). Full evidence: [source-ledger-3.json](source-ledger-3.json). The checked job is `Carousel`; aliases appear in the JSON coverage record.

- **Untitled UI**: [carousels — component](https://github.com/untitleduico/react/blob/4702dc0ea8d140c3491a85670c7b4fab47b722da/components/application/carousel/carousel-base.tsx#L1-L300).
- **shadcn/ui**: [carousel — component](https://github.com/shadcn-ui/ui/blob/db2db460a26fa84fb65c8d903b213925fbdee9ed/apps/v4/content/docs/components/base/carousel.mdx#L1-L300).
- **Radix Themes**: **not found** for this job in the reviewed [catalogue](https://www.radix-ui.com/themes/docs/overview/getting-started) and [pinned source inventory](https://github.com/radix-ui/themes/tree/1faff10ac26ae17f09944d418c6949b93fc6b566).
- **Base UI**: **not found** for this job in the reviewed [catalogue](https://base-ui.com/react/overview/quick-start) and [pinned source inventory](https://github.com/mui/base-ui/tree/62b54e8c944784c4de992eb424286b77cea4415a).
- **React Aria / Spectrum 2**: **not found** for this job in the reviewed [catalogue](https://react-aria.adobe.com/) and [pinned source inventory](https://github.com/adobe/react-spectrum/tree/b90cbea6a1ab6ee12b66ac03d37a97fd661c8783).
- **Fluent 2**: [carousel — component](https://github.com/microsoft/fluentui/blob/8add8c8750c34c85acd811e32ab324abf8f1562e/packages/react-components/react-carousel/library/src/components/Carousel/Carousel.types.ts#L1-L141).
- **Primer**: **not found** for this job in the reviewed [catalogue](https://primer.style/product/components/) and [pinned source inventory](https://github.com/primer/react/tree/a89299ae77e8f444599f94d7e9ca368c17be3f9a).
- **Carbon**: **not found** for this job in the reviewed [catalogue](https://carbondesignsystem.com/components/overview/components/) and [pinned source inventory](https://github.com/carbon-design-system/carbon/tree/650fcf4a8c5f86c5fdaa255d59229fe70fdb9757).
- **Material 3**: [carousel — component](https://github.com/material-components/material-components-android/blob/60ff09436d5d477a4b9d02940f31eb01e1250620/lib/java/com/google/android/material/carousel/Arrangement.java#L1-L292).
- **Mantine**: [@Carousel — component](https://github.com/mantinedev/mantine/blob/f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4/packages/@mantine/carousel/src/Carousel.tsx#L1-L300).
- **Ant Design**: [carousel — component](https://github.com/ant-design/ant-design/blob/7ad64087106acd078dcc7d91a4adfdf38f5ce172/components/carousel/index.en-US.md#L1-L70).
- **Chakra/Ark**: [carousel — component](https://github.com/chakra-ui/ark/blob/b561e95d20d6bd0e75cdc08e762e881628b110f7/website/src/content/pages/components/carousel.mdx#L1-L123).
- **Atlassian**: **not found** for this job in the reviewed [catalogue](https://atlassian.design/components) and [pinned source inventory](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/a33189b5ea7a152af1ad537c6106f803a1f7a651).
- **Polaris**: **not found** for this job in the reviewed [catalogue](https://shopify.dev/docs/api/app-home/polaris-web-components).
- **GOV.UK**: **not found** for this job in the reviewed [catalogue](https://design-system.service.gov.uk/components/).
- **Apple HIG**: [page-controls — platform-guidance](https://developer.apple.com/design/human-interface-guidelines/page-controls).

Area scope and reuse baseline: [COMPONENTS.md](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/docs/COMPONENTS.md#L112-L215), [manifest.ts](https://github.com/ethanwongwork/area/blob/c585f8c5f38705a7efa79bf05148a8c6989b142a/packages/styles/src/manifest.ts#L680-L749). Proposals and build priorities are research judgments, not owner approval.
