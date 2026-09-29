# Skeleton rethink: how design systems model a skeleton

Read 2026-09-28 from shallow clones at the pinned commits below, plus public docs where no
source exists. The question is **API shape**: the model, the default shape, sizing, the text
model, wrap mode, composition and accessibility. Paint and animation measurements are in
`skeleton-spinner-code-slider-survey.md` §1 and are not repeated. Every value is from the cited
file/line or URL. **arith** = my arithmetic from pinned values. **not found** = searched, absent.

## Sources

| Id | Repo / source | Commit or version |
|---|---|---|
| primer | primer/react | `67945828439898ace865bd5f7417c562033bcbc2` |
| fluent | microsoft/fluentui | `8add8c8750c34c85acd811e32ab324abf8f1562e` |
| carbon | carbon-design-system/carbon | `7e8c8f7db6dd2ed98c4947b78b37614f43eda920` |
| carbonweb | carbon-design-system/carbon-website | `d8783ad2ae3b5e59c58f58311491f8a2c4e62631` |
| polaris | Shopify/polaris | `3f7954ae42fabf26d63cee68c23ceebfd7ef0972` |
| shadcn | shadcn-ui/ui (apps/v4) | `98a1fe67b439324ddc857f47fbdce056600a4329` |
| radix | radix-ui/themes | `1faff10ac26ae17f09944d418c6949b93fc6b566` |
| radixweb | radix-ui/website (docs) | `bb424082fd33fadc244a6dd276d3ced55caa6234` |
| mantine | mantinedev/mantine | `f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4` |
| antd | ant-design/ant-design | `e0ea7bb76fdf2a8871b5f3f0eea5e9fd0cd7f485` |
| chakra | chakra-ui/chakra-ui (v3) | `961161428b8c59157ad921dd23303b73c294d73f` |
| spectrum | adobe/react-spectrum (S2) | `16eead67e83cf42f3c0ee46ef6eb7a2032778378` |
| mui | mui/material-ui (master, read today) | `4638fd3607fa7fe2a77928dd1933244479e3c775` |
| atlaskit | npm `@atlaskit/skeleton` (compiled dist; no public repo) | `4.4.4` |
| geist | https://vercel.com/geist/skeleton (docs only; closed source) | read 2026-09-28 |
| uui | untitleduico/react | `8b7409c078f81ab89dfc5943ec185ec369932804` |

Clones are in `.cache/sources/<id>@<sha>/`. Path prefixes:
`P` = primer `packages/react/src/`; `F` = fluent `packages/react-components/react-skeleton/`;
`C` = carbon `packages/react/src/components/`; `CS` = carbon `packages/styles/scss/`;
`PO` = polaris `polaris-react/src/components/`; `POD` = polaris `polaris.shopify.com/`;
`SH` = shadcn `apps/v4/`; `RT` = radix `packages/radix-ui-themes/src/components/`;
`MT` = mantine `packages/@mantine/core/src/components/Skeleton/`; `A` = antd `components/`;
`CH` = chakra `packages/react/src/`; `CHX` = chakra `apps/compositions/src/examples/`;
`S2` = spectrum `packages/@react-spectrum/s2/`; `M` = mui `packages/mui-material/src/`;
`MD` = mui `docs/data/material/components/skeleton/`; `AK` = atlaskit `package/dist/`.

---

## Per system

### Primer (GitHub)

1. **Model:** three parts. `SkeletonBox`, `SkeletonText`, `SkeletonAvatar` (P `Skeleton/index.ts:1-6`,
   `SkeletonText/SkeletonText.tsx:5`, `SkeletonAvatar/SkeletonAvatar.tsx:5`). Text and avatar
   are built on `SkeletonBox`.
2. **Shapes / default:** no shape prop. The base part is a box: `display:block; height:1rem`
   (P `Skeleton/SkeletonBox.module.css:11-15`). Avatar is a circle, or `square`.
3. **Size:** Box takes `width` / `height` (any CSS) (`SkeletonBox.tsx:6-10`). Text takes a
   type-role `size`. Avatar takes the Avatar `size` in px, default 20
   (`SkeletonAvatar.tsx:16`; `Avatar/Avatar.tsx:7` at the same commit), also responsive.
4. **Radius:** box and text `borderRadius-small` (3px, prior survey); text `display` and
   `titleLarge` use `borderRadius-medium` (`SkeletonText.module.css:26-29`); avatar 50%;
   square avatar `clamp(4px, size − 24px, borderRadius-medium)` (`SkeletonAvatar.module.css:8,13`).
5. **Text:** `lines` (default 1), `maxWidth`, `size` = `display | titleLarge | titleMedium |
   titleSmall | bodyLarge | bodyMedium | bodySmall | subtitle`, default `bodyMedium`
   (`SkeletonText.tsx:7-18`). Bar height = the role's font size, `margin-block: leading/2`; in
   a multi-line block the gap is `leading × 2`; last line `max-width: 65%; min-width: 50px`
   (`SkeletonText.module.css:1-24`).
6. **Wrap:** not found.
7. **Animation:** shimmer, always on; off under reduced motion (prior survey). `delay`:
   `'short'` 300ms, `'long'` 1000ms, or a number; renders nothing until then
   (`SkeletonBox.tsx:13-39`).
8. **Composition:** one official example, a comment list (`Skeleton/Skeleton.examples.stories.tsx:34-85`).
   Each card has `padding: base-size-16` (16px), a 1px border and `borderRadius-medium`. The
   header row is `SkeletonAvatar size={32}` + `SkeletonText maxWidth="80px"` with an 8px gap,
   then a 16px margin, then `SkeletonText lines={2}` (`Skeleton.examples.stories.module.css:1-14`).
   All placeholders sit on the 16px card inset. The loaded state has a kebab `IconButton`. The
   loading state leaves it out. The source says interactive elements "should not be
   represented as skeleton items" (`Skeleton.examples.stories.tsx:68`).
9. **A11y:** nothing on the parts. The example puts `aria-busy` on the container, adds a
   visually hidden "Comments are loading", and uses an `AriaStatus` that says "Comments are
   loaded" when loading finishes (`Skeleton.examples.stories.tsx:45-55`).

### Fluent 2 (Microsoft)

1. **Model:** a group container plus items. `Skeleton` sets `size`, `shape`, `animation` and
   `appearance` for the `SkeletonItem`s inside it, through context (F
   `library/src/components/Skeleton/Skeleton.types.ts:40-72`; `SkeletonItem/useSkeletonItem.tsx:23-35`).
2. **Shapes / default:** `shape` = `circle | square | rectangle`. The default is
   **`rectangle`** (`useSkeletonItem.tsx:33`).
3. **Size:** `size` comes from a fixed ladder: 8, 12, 14, 16, 20, 22, 24, 28, 32, 36, 40, 48, 52,
   56, 64, 72, 92, 96, 120, 128. The default is 16 (`Skeleton.types.ts:15-35`; `useSkeletonItem.tsx:32`).
   A rectangle is 100% wide with height = size. Square and circle are size × size
   (`useSkeletonItemStyles.styles.ts:99-146`). Other widths come from the consumer's CSS.
4. **Radius:** rectangle 4px (`:102`); circle 50% (`:151`); square has none (0; no other
   `borderRadius` rule in the file).
5. **Text:** not found. There is no text or lines part; lines are rectangles.
6. **Wrap:** not found.
7. **Animation:** `wave` by default, or `pulse`. `appearance` = `opaque` (default) or
   `translucent` (`SkeletonItem.types.ts:13-23`).
8. **Composition:** the Row story is a grid of rows. Each row is a 24px circle or square
   followed by rectangles, with `gap: 10px` and `gridTemplateColumns: 'min-content 20% 20% 15% 15%'`
   (`stories/src/Skeleton/SkeletonRow.stories.tsx:10-50`). There is no card example. Best
   practices say to give each item a width close to the real content, and that "circles and
   rectangles" are as much detail as you should draw (`SkeletonBestPractices.md:6,12`).
9. **A11y:** the `Skeleton` root has `role="progressbar"` and `aria-busy: true`
   (`Skeleton/useSkeleton.ts:48-53`). The docs ask for `aria-label` when there is a single
   loader, unique labels when there are several, one "loaded" announcement, and no live
   regions on infinite scroll (`stories/src/Skeleton/SkeletonAccessibility.md:5-17`).

### Carbon (IBM)

1. **Model:** primitives plus one skeleton per component. The primitives are `SkeletonText`,
   `SkeletonPlaceholder` and `SkeletonIcon`. There are 42 `*Skeleton` files, covering Button,
   TextInput, Select, Checkbox, Toggle, Tag, Tabs, Accordion, DataTable, Pagination, Slider,
   DatePicker, Search and the Fluid inputs (`ls C/*/*Skeleton*.tsx`).
2. **Shapes / default:** no generic default. Text is `100% × 1rem`, heading `1.5rem`,
   placeholder `100 × 100px`, icon `16 × 16px` (CS `components/skeleton-styles/_skeleton-styles.scss:18-48`).
3. **Size:** each component skeleton takes the component's own `size`. `ButtonSkeleton` is a
   `div` with `cds--skeleton cds--btn cds--btn--{size}`, default `lg`
   (C `Button/Button.Skeleton.tsx:38-60`). `TextInputSkeleton` draws a label bar plus the field
   (`TextInput/TextInput.Skeleton.tsx:38-48`). Placeholder size comes from a class.
4. **Radius:** square. Carbon draws no corners (prior survey: radius only behind a v12 flag).
5. **Text:** `SkeletonText` props are `paragraph` (false), `lineCount` (3; used only with
   `paragraph`), `width` ('100%') and `heading` (false) (`SkeletonText/SkeletonText.tsx:47-53`). In a
   paragraph each line is shortened by a fixed pseudo-random 0–75px
   (`:14-18, 74-89`). The line gap is `$spacing-03` (8px) (`_skeleton-styles.scss:43`).
6. **Wrap:** not found.
7. **Animation:** always on; a sweep (prior survey).
8. **Composition:** `DataTableSkeleton` takes `rowCount` 5, `columnCount` 5, `showHeader`,
   `showToolbar` and `zebra` (`DataTableSkeleton/DataTableSkeleton.tsx:31-75`). Guidance: "Only
   use skeleton states on container-based components like tiles and structured lists or
   data-based components like data tables and cards. In most cases, action components (e.g.
   buttons, input fields, checkboxes, toggles) do not need to have a skeleton state." Toasts,
   overflow menus, dropdown items, modals and loaders never get one (carbonweb
   `src/pages/patterns/loading-pattern/index.mdx:63-70`). Images can be left as white space of
   the final size (`:139-142`).
9. **A11y:** nothing on the primitives. The DataTable toolbar has `aria-label` (`DataTableSkeleton.tsx:112`).

### Polaris (Shopify)

1. **Model:** one part per role. `SkeletonPage`, `SkeletonBodyText`, `SkeletonDisplayText`,
   `SkeletonThumbnail`, `SkeletonTabs` (PO). There is no generic box.
2. **Shapes / default:** each part has a fixed shape. BodyText defaults to 3 lines
   (`SkeletonBodyText/SkeletonBodyText.tsx:5-13`).
3. **Size:** DisplayText `size` = `small | medium | large | extraLarge`, default `medium`;
   `maxWidth` defaults to 120px (`SkeletonDisplayText/SkeletonDisplayText.tsx:11-28`; `.module.css:11`).
   The heights are line-height tokens, compact / md-up: base 20px; small 24/28; medium and large
   both 28/32; extraLarge 36/44 (`.module.css:1-62`; token scale `polaris-tokens/src/size.ts`:
   500 = 20px, 600 = 24px, 700 = 28px, 800 = 32px). Thumbnail `size` = `extraSmall | small |
   medium | large` = 24 / 40 / 60 / 80px, default `medium` (`SkeletonThumbnail.module.css:3-6`).
   Tabs take `count` (2) and `fitted`; each bar is 64 × 12px (`SkeletonTabs.tsx:13`; `.module.css:31-35`).
4. **Radius:** body, display and tab bars `border-radius-100` = 4px. Thumbnail
   `border-radius-200` = 8px (`SkeletonBodyText.module.css:9`; `SkeletonThumbnail.module.css:10`).
5. **Text:** body line 8px tall (`space-200`), 12px gap (`space-300`), last line 80%
   (`SkeletonBodyText.module.css:5-21`). The bars are not tied to text line boxes.
6. **Wrap:** not found.
7. **Animation:** none. No `animation` in any skeleton module.
8. **Composition:** `SkeletonPage` takes `title` (a real title when the text is known),
   `primaryAction`, `backAction`, `fullWidth` and `narrowWidth` (`SkeletonPage/SkeletonPage.tsx:11-24`).
   The primary action placeholder is ≥ 100 × 36px (`6.25rem × 2.25rem`); the back action is
   36 × 36px. Both have radius 4 and sit in the page header row with a 16px gap (`:51-104`).
   Card example: `LegacyCard sectioned` holding `SkeletonDisplayText size="small"` and
   `SkeletonBodyText` (POD `pages/examples/skeleton-page-with-dynamic-content.tsx:14-57`). A
   section is padded `8px 16px` (`LegacyCard/LegacyCard.module.css:68-69`, fetched at the
   commit). The docs say to keep static content real and use skeletons only for dynamic
   content (POD `content/components/feedback-indicators/skeleton-body-text.mdx`,
   `skeleton-page.mdx`). They also say "secondary actions are always represented with skeleton
   content" (`skeleton-page.mdx`).
9. **A11y:** `SkeletonPage` is `role="status"` with an i18n `aria-label`
   (`Polaris.SkeletonPage.loadingLabel`) (`SkeletonPage.tsx:79-80`). The other parts have nothing.

### shadcn/ui

1. **Model:** one `div` with no props besides the class (SH `registry/new-york-v4/ui/skeleton.tsx:3-10`).
2. **Shapes / default:** no default size. Shape comes from utility classes.
3. **Size:** utility classes, for example `h-4 w-[250px]`.
4. **Radius:** `rounded-md` = 8px (`--radius-md: calc(var(--radius) * 0.8)`, `--radius: 0.625rem`,
   `app/globals.css:51,100`; **arith**). Circles use `rounded-full`.
5. **Text:** no part. Examples stack `h-4` (16px) bars with an 8px gap and make the last bar
   shorter (`w-3/4`) (SH `examples/radix/skeleton-text.tsx:5-8`).
6. **Wrap:** not found.
7. **Animation:** `animate-pulse`, always on.
8. **Composition:** the docs show Avatar, Card, Text, Form and Table examples
   (`content/docs/components/radix/skeleton.mdx`). Numbers:
   - Avatar row: 40px circle, 16px gap, 150/100px lines (`examples/radix/skeleton-avatar.tsx`).
   - Card (`examples/radix/skeleton-card.tsx:6-13`): inside the real `Card`, two `h-4` lines
     (`w-2/3`, `w-1/2`) in `CardHeader`, then an `aspect-video w-full` block in `CardContent`.
     The nova card inset is `--card-spacing: --spacing(4)` = 16px, on the block and inline
     axes (`registry/styles/style-nova.css:244-262`). The media block sits **inside** the 16px
     inset, not at the card edge. The older new-york-v4 demo is not a card: a 125 × 250 block
     with `rounded-xl` and two lines (`registry/new-york-v4/examples/skeleton-card.tsx:5-10`).
   - Loading card block (`registry/bases/radix/blocks/preview/cards/skeleton-loading.tsx:8-26`):
     one `CardContent` with a 16px gap holding a 40px circle + lines (`h-4`, `h-3`), three
     `h-3` lines, then **two button placeholders `h-8 w-20` (32 × 80px)**. The buttons sit on
     the same 16px inline inset as the text lines.
   - Form: label bar `h-4` + field `h-8`, 12px gap, 28px between fields, button bar `h-8 w-24`
     (`examples/radix/skeleton-form.tsx:5-15`).
   - Table: rows of `h-4` bars (`flex-1`, `w-24`, `w-20`), 16px column gap, 8px row gap
     (`examples/radix/skeleton-table.tsx:5-12`).
9. **A11y:** none.

### Radix Themes

1. **Model:** one `Skeleton` that is wrap-first (RT `skeleton.tsx:18-42`).
2. **Shapes / default:** empty, it is a block 12px tall (`space-3`) at full width
   (`skeleton.css:37-40`). There is no shape prop.
3. **Size:** `width` / `height` props (`skeleton.props.tsx:6-10`), or the wrapped child's own size.
4. **Radius:** `radius-1` (`skeleton.css:4`). When it wraps an element, `Slot` merges the
   Skeleton class onto the child. `skeleton.css` is imported before every other component
   stylesheet (`components/index.css:6` vs button `:15`, switch `:46`, text-field `:51`). With
   equal specificity, the child's own `border-radius` wins, so the placeholder takes the
   control's shape. This is inferred from cascade order, not rendered.
5. **Text:** wrap real text inline: `<Text><Skeleton>Lorem…</Skeleton></Text>`. Each line box
   becomes a bar (`box-decoration-break: clone`, `line-height: 0`, Arial metrics;
   `skeleton.css:10,31-35`). The docs recommend wrapping the text node, not the `Text`
   element, so each line is a bar (radixweb `data/themes/docs/components/skeleton.mdx`, "With text").
6. **Wrap:** `loading` (default `true`). When false it returns the children unchanged
   (`skeleton.tsx:25`). Children stay in the layout with `visibility: hidden`
   (`skeleton.css:42-46`).
7. **Animation:** pulse, always on (prior survey).
8. **Composition:** docs show only a Switch and text. No card.
9. **A11y:** `aria-hidden`, `tabIndex={-1}`, `inert` (`skeleton.tsx:32-36`).

### Mantine

1. **Model:** one `Skeleton` with a `circle` boolean (MT `Skeleton.tsx:21-40`).
2. **Shapes / default:** a block, `width` 100% and `height` auto (`Skeleton.module.css:13-14`).
   Empty with no height, it collapses.
3. **Size:** `width` / `height` props; numbers become rem (`Skeleton.tsx:26-30`). With
   `circle`, width = height and radius = 1000px (`:54-60`).
4. **Radius:** `radius` prop (a theme key or CSS), default `theme.defaultRadius` (`:35`; `.module.css:15`).
5. **Text:** no part. The demo stacks `height={8} radius="xl"` bars 6px apart with a 70% last
   bar (`packages/@docs/demos/src/demos/core/Skeleton/Skeleton.demo.configurator.tsx:4-11`).
6. **Wrap:** `visible` (default true). It draws an overlay (`::before` body colour, `::after`
   fill) over the children, so the whole wrapped block becomes one rectangle
   (`Skeleton.module.css:24-48`; demo `Skeleton.demo.content.tsx:32-43`).
7. **Animation:** `animate` (default true); fade (prior survey).
8. **Composition:** no card example.
9. **A11y:** not found.

### MUI (Material UI)

1. **Model:** one `Skeleton` with `variant` (M `Skeleton/Skeleton.js:236-248`).
2. **Shapes / default:** `variant` = `text | rectangular | rounded | circular`. The default is
   **`text`** (`:244`; propTypes `:320-327`). The element is a `span` (`:241`).
3. **Size:** `width` / `height`. Text takes its size from the font: `height: auto`, scaled to
   60% (`:113-127`). Other variants default to `1.2em` tall (`:110`). The docs say: "For
   variant="text", adjust the height via font-size" (MD `Variants.tsx:7`).
4. **Radius:** text 4px/6.7px (elliptical to cancel the scale); circular 50%; rounded
   `shape.borderRadius` (4px); rectangular none (0) (`:113-146`). **`rounded` and
   `rectangular` differ only in radius.**
5. **Text:** one line per element. No lines prop.
6. **Wrap:** children are hidden (`visibility: hidden`); the skeleton is `max-width:
   fit-content` and `height: auto` unless width/height are given (`:148-166`). The variant still
   sets the radius, so a wrapped Avatar needs `variant="circular"` (MD `skeleton.md`,
   "Inferring dimensions"; `SkeletonChildren.tsx:19-22`). There is no `loading` prop; the
   caller switches with a ternary.
7. **Animation:** `pulse` by default, or `wave`, or `false` (`:239,285`).
8. **Composition:** the Facebook card (MD `Facebook.tsx:20-83`). `CardHeader` has padding 16
   (M `CardHeader/CardHeader.js:39`) and holds a 40px circle plus 10px-tall lines at 80% and 40%.
   The media is a `rectangular` block 190px tall at **full card width**, with no inset (the
   loaded image is also full-bleed). `CardContent` has padding 16, and 24 at the bottom of the
   last child (M `CardContent/CardContent.js:24-26`). It holds two 10px lines with 6px between
   them, the second 80% wide. The settings `IconButton` is **omitted** (`action={loading ? null : …}`, `:32-38`).
9. **A11y:** the docs say "ARIA: None." and "The skeleton is not focusable." (MD `skeleton.md`).

### Chakra UI v3

1. **Model:** `Skeleton` plus the helpers `SkeletonCircle` and `SkeletonText` (CH
   `components/skeleton/skeleton.tsx:22-77`).
2. **Shapes / default:** a block with no size. Circle via `SkeletonCircle size` (a `Circle`
   `asChild`, `:33-43`).
3. **Size:** style props (`height="5"`, `width="80%"`).
4. **Radius:** `l2` = 4px, set in the `loading: true` variant (CH `theme/recipes/skeleton.ts:8-10`; value from prior survey).
5. **Text:** `SkeletonText noOfLines` (default 3). Each line is `height 4` (16px), the gap is
   the Stack default of 0.5rem (8px), and the last line is 80% (`skeleton.tsx:56-72`; Stack
   default gap `components/stack/stack.tsx:73`).
6. **Wrap:** `loading` (default true). Children are hidden and the text is transparent
   (`recipes/skeleton.ts:8-21`). `asChild` merges onto a Badge (CHX `skeleton-with-children.tsx`).
   When loading ends, the content fades in over 0.1s (`recipes/skeleton.ts:22-25`).
7. **Animation:** **`variant` means animation here**: `pulse` (default), `shine`, `none`
   (`recipes/skeleton.ts:27-50`).
8. **Composition:** the Feed example is a 40px circle + 2-line text, then a 200px block, 24px
   gap, `maxW="xs"` (CHX `skeleton-for-feed.tsx`). No card.
9. **A11y:** not found.

### Ant Design

1. **Model:** a composite `Skeleton` (avatar + title + paragraph) plus element parts
   `Skeleton.Button`, `.Avatar`, `.Input`, `.Image`, `.Node` (A `skeleton/Skeleton.tsx:111-119`).
2. **Shapes / default:** the composite defaults to **title + paragraph (text), no avatar**
   (`:133-135`). Element `shape` = `circle | square | round | default` (`skeleton/Element.tsx:28`).
   `Avatar.shape` defaults to `circle` (`skeleton/Avatar.tsx:23`).
3. **Size:** `size` = `large | small | default` or a number, following control heights
   (`Element.tsx:27,42-60`). Button is 2 × controlHeight wide (64 × 32px); input is 5 × (160 × 32);
   image is 3 × controlHeight (96px); avatar is controlHeight (32), or 40 in the composite
   (`skeleton/style/index.ts:87,93-110,144-152,229-231`; composite avatar `size: 'large'`,
   `Skeleton.tsx:72-79`). Both Button and Input take `block` for full width.
4. **Radius:** `borderRadiusSM` 4px for title, lines, button, input and image. Circle is 50%.
   `round` is a pill: title and lines use `borderRadius: 100`, a button its height
   (`style/index.ts:128-129,150-151,195-203,309,323,334-338,422`).
5. **Text:** the title is 16px tall (controlHeight/2), with width 38% alone or 50% next to an
   avatar. The paragraph has `rows` 3 (2 with an avatar), 16px lines, an 8px gap
   (controlHeightXS), and a 24px gap after the title. The last line is 61%
   (`Skeleton.tsx:81-109`; `style/index.ts:305-332,399-405`).
6. **Wrap:** `loading` **swaps** content. While true (or when `loading` is absent) it renders
   the generated skeleton; otherwise the children (`Skeleton.tsx:177,267`). The children are
   not measured, so the skeleton's size does not come from them.
7. **Animation:** `active` is undefined by default, so **static by default**. Shimmer when on.
8. **Composition:** `Card loading` renders `<Skeleton loading active paragraph={{ rows: 4 }}
   title={false}>` inside the card body (A `card/Card.tsx:200-204,264-268`). Body padding is
   `paddingLG` 24px, or 12px for the small card (`card/style/index.ts:476-479`). The `actions`
   bar stays real while loading (`Card.tsx:271-277`). Lists wrap each item's meta in
   `<Skeleton avatar title={false} loading={item.loading} active>` (A `list/demo/loadmore.tsx:86-93`).
9. **A11y:** only `Skeleton.Image` sets `aria-hidden` (`skeleton/Image.tsx:20`).

### React Spectrum S2 (Adobe)

1. **Model:** `Skeleton` is a context provider only (`isLoading`). Real components opt in
   (S2 `src/Skeleton.tsx:76-87`). `SkeletonCollection` renders placeholder items in collections
   (`src/SkeletonCollection.tsx:32-45`).
2. **Shapes / default:** none. The shape is the real component's shape.
3. **Size:** always from the real component with mock data. The docs say to use "mock data
   within your real component" (`packages/dev/s2-docs/pages/s2/Skeleton.mdx`).
4. **Radius:** text runs and icons use `sm` (`Skeleton.tsx:129,166-168`). A wrapped element
   (image, illustration) keeps its own radius (`SkeletonWrapper`, `:138-161`).
5. **Text:** real text is made transparent. With `box-decoration-break: clone`, each line box
   becomes a bar (`:100-135`).
6. **Wrap:** this is the only mode. Affected components: Image, Text, Link, Icon, StatusLight,
   Badge, Meter. Form components inside are disabled (`Skeleton.mdx`, "Content").
7. **Animation:** shimmer, phase-synced across the page; off under reduced motion (prior survey).
8. **Composition:** `Card` reads the skeleton context. Its content is skeletonised in place,
   the `ActionMenu` is **disabled, not replaced**, and the card is `inert`
   (`src/Card.tsx:426-455,490-496`). The card inset is `--card-spacing`: 16px at the defaults
   (size M, density regular; `:158-190`, defaults `:60-72`). The preview image is full-bleed
   through negative margins (`:250-258`).
9. **A11y:** skeleton content is `inert` (`Skeleton.tsx:122,156`).

### Atlassian Design System

1. **Model:** one `Skeleton` box (AK `types/ui/index.d.ts:2-51`).
2. **Shapes / default:** none. **`width` and `height` are required** (`:6,10`).
3. **Size:** `width`, `height` (string or number).
4. **Radius:** a `borderRadius` token prop, default `var(--ds-radius-small, 4px)`
   (AK `es2019/ui/index.js:32`). The docs show `radius.full` for circles
   (https://atlassian.design/components/skeleton/examples).
5. **Text:** not found.
6. **Wrap:** not found.
7. **Animation:** `isShimmering` defaults to **false**, so it is **static by default**
   (`index.js:35`). When on, the background alternates `--ds-skeleton` → `--ds-skeleton-subtle`
   over 1.5s, linear (`es2019/ui/index.compiled.css`). `color` and `ShimmeringEndColor` override
   the fill; `groupName` adds a data attribute for group styling.
8. **Composition:** not found in the package.
9. **A11y:** none on the element. `interactionName` holds a performance-tracing interaction
   while mounted (`index.js:42-46`).

### Geist (Vercel), docs only

1. **Model:** one `Skeleton` with shape booleans (https://vercel.com/geist/skeleton).
2. **Shapes / default:** the default (named "Default") is a bar given `width` only. Other
   shapes: `pill`, `rounded`, `squared`. The default height and radius are not stated.
3. **Size:** `width`, `height`, and `boxHeight` (a line box taller than the bar).
4. **Radius:** by boolean; values not published.
5. **Text:** not found.
6. **Wrap:** children are hidden while `show` is true (the default), and "the size is
   retained". `show={false}` reveals the children.
7. **Animation:** `animated` (default true). `button` extends the animation by 1px.
8. **Composition:** no card or list example.
9. **A11y (docs):** `aria-busy="true"` on the region, `aria-live="polite"` for completion, no
   focusable controls inside a skeleton, and reduced motion is respected.

### Untitled UI

No skeleton. The only loading component at the commit is `LoadingIndicator` (spinner types
`line-simple | line-spinner | dot-circle`) (uui
`components/application/loading-indicator/loading-indicator.tsx:28-45`). A search of all 396
tree paths and every `.tsx`/`.css` file finds no `skeleton`, `animate-pulse` or `shimmer`.

---

## Synthesis

### Systems × model

| System | Model | Default shape | Shapes | Sizing | Text lines | Wrap mode | Anim. default |
|---|---|---|---|---|---|---|---|
| Primer | 3 parts: Box / Text / Avatar | box 1rem tall | box, text, avatar circle/square | w/h props; text by type role (8); avatar by Avatar px | `lines`, last 65% / ≥50px, line box kept | — | shimmer on |
| Fluent | group + `SkeletonItem` | **rectangle** 100% × 16 | rectangle, square, circle | `size` ladder 8–128 | — | — | wave |
| Carbon | primitives + 42 per-component | text 100% × 1rem | text, heading, placeholder, icon; component shapes | fixed; component `size` | `paragraph` + `lineCount` 3, random widths | — | sweep on |
| Polaris | 5 role parts | per part | body, display, thumbnail, tabs, page | role `size` scales | `lines` 3, last 80% | — | **none** |
| shadcn | 1 div | none (class) | by class | classes | — (examples) | — | pulse |
| Radix | 1, wrap-first | block 12px | — | w/h or child | wraps real text | `loading`, child radius | pulse |
| Mantine | 1 + `circle` | block 100% | block, circle | w/h, `radius` | — | `visible` overlay | fade on |
| MUI | 1 + `variant` | **text** | text, rectangular, rounded, circular | w/h; text by font | — | children, fit-content | pulse |
| Chakra | 1 + Circle + Text | block | block, circle | style props | `noOfLines` 3, last 80% | `loading`, asChild | pulse |
| antd | composite + 5 elements | **title + paragraph** | avatar, title, paragraph, button, input, image, node | control sizes | `rows` 3, last 61% | `loading` swaps | **static** |
| Spectrum | context only | — | real components | real content | real text line boxes | `isLoading`, only mode | shimmer |
| Atlassian | 1 box | none (w/h required) | radius prop | required w/h | — | — | **static** |
| Geist | 1 + booleans | bar (width) | default, pill, rounded, squared | w/h, `boxHeight` | — | `show`, size kept | shimmer |
| Untitled UI | none | — | — | — | — | — | — |
| **Area today** | 1 + `shape` | **text** | text, circle, rectangle, rounded | CSS; text = 1em in line box | `lines`, last 65% / ≥50px | children + `loading`, radius by `:has()` | shimmer |

### Patterns

- **Model split (13 systems with a skeleton).** One generic component: shadcn, Radix, Mantine,
  MUI, Atlassian, Geist (6). One generic plus helpers or a group: Fluent, Chakra (2). Dedicated
  parts: Primer, Polaris, Carbon, antd (4). Context only: Spectrum (1). **Almost every system
  that ships a text part names it separately** (Primer `SkeletonText`, Chakra `SkeletonText`,
  Carbon `SkeletonText`, Polaris `SkeletonBodyText`/`DisplayText`, antd title/paragraph). MUI is
  the only one where text is a value of a shape variant.
- **Default shape.** Text or text-composite by default: **MUI and antd (2)**, plus Carbon if
  `SkeletonText` counts as its base part. Block or rectangle by default: **Primer SkeletonBox,
  Fluent, Radix (empty), Mantine, Chakra (5)**. No default at all (size required or classes
  only): **shadcn, Atlassian, Geist (3)**. Area's `text` default is the minority choice.
- **What "variant" means.** It differs between systems: MUI `variant` = shape; Chakra
  `variant` = animation (pulse/shine/none); Fluent `appearance` = opaque/translucent. A
  **`rounded` shape exists only in MUI**, where it is `rectangular` with a 4px radius
  (Skeleton.js:141-146). Everywhere else rounding is a radius prop (Mantine `radius`,
  Atlassian `borderRadius`), a boolean (antd `round`, Geist `pill`/`rounded`/`squared`), or
  follows the wrapped element (Radix, Spectrum). Fluent's `square` is a size-locked shape
  (width = height), not a radius choice.
- **Radius of a generic block.** 3–4px almost everywhere: Primer 3, Radix 3, Fluent 4, MUI
  rounded 4, Mantine 4, Chakra 4, antd 4, Polaris 4, Atlassian 4. shadcn 8 and Carbon 0 are the
  outliers. Only Polaris gives thumbnails a larger radius (8).
- **Text lines.** Last line: Primer 65%, antd 61%, Polaris 80%, Chakra 80%, shadcn examples
  75%, Carbon random −0–75px. Gap: 8px (Carbon, Chakra, antd, shadcn), 12px (Polaris), or the
  leading (Primer). Only Primer ties bar height to type roles and keeps the line box. Only
  Polaris exposes display-text sizes.
- **Wrap mode.** 7 systems wrap content: Radix, MUI, Chakra, Mantine, Geist, Spectrum hide the
  real content and keep its size. antd `loading` swaps without measuring. How radius is
  decided: the child's own radius (Radix by cascade order, Spectrum by the element); the
  variant radius (MUI, so you must pick `circular` for an avatar); the recipe radius (Chakra
  4px); a single overlay rectangle (Mantine). Area's `:has()` list of control classes is its
  own mechanism, closest in result to Radix.
- **Animation default.** Static by default: antd, Polaris, Atlassian (3). Animated by
  default: all others.
- **A11y.** Three stances: hide the placeholder (Radix `aria-hidden` + inert, Spectrum inert);
  mark the container busy (Fluent `role=progressbar aria-busy` built in; Primer, Geist in docs);
  or a status region (Polaris `role=status` + label). MUI, shadcn, Mantine, Chakra and
  Atlassian do nothing.

### Card composition

| System | Card inset | Text lines | Media placeholder | Control / action placeholder |
|---|---|---|---|---|
| shadcn nova | 16 (`--card-spacing`) | in header and content, on the 16 inset | `aspect-video`, **inside** the 16 inset | 32 × 80 bars, **same 16 inset as text** |
| MUI Facebook | header 16, content 16 (24 bottom) | 10px lines on the 16 inset | 190px, **full-bleed** (matches the loaded image) | IconButton **omitted** |
| antd Card | body 24 (12 small) | 4 rows × 16px, 8px gap | — | real `actions` bar **stays** |
| Polaris | section 8 × 16 | display + body on the 16 inset | — | page header action 36 × 100 in the header row |
| Primer comments | 16 | avatar 32 + 80px line, then 2 lines | — | kebab **omitted** ("should not be represented") |
| Spectrum Card | 16 (M, regular) | real text as bars | full-bleed (negative margins) | ActionMenu **disabled**, not replaced |
| Fluent, Chakra, Radix, Mantine, Carbon, Atlassian, Geist | no card example | — | — | Carbon guidance: actions need no skeleton |

Findings:

1. **No system places a control placeholder at the card edge.** Where one is drawn (shadcn,
   Polaris page header) it sits on the same content inset as the text lines, in the same
   flow as the real button.
2. **Most systems don't draw controls at all.** Primer and MUI omit them, Spectrum disables
   the real one, antd keeps the real actions, Carbon says action components do not need a
   skeleton, and Geist says no focusable controls inside.
3. **Only media goes to the card edge,** and only when the loaded media is full-bleed (MUI,
   Spectrum). shadcn keeps media on the inset because its loaded media is inset too. The rule
   everywhere: the placeholder takes the loaded element's box.
4. **Insets are the card's own padding** (16 in shadcn nova, MUI, Primer, Spectrum; 24 in
   antd). No skeleton adds its own inset.

---

## Options for Area

All three keep Area's paint, reduced-motion handling and `aria-hidden`. They differ in model.

### A. One `Skeleton` with a shape variant, block by default (recommended)

```tsx
<Skeleton />                                  // block: 100% wide, default height
<Skeleton shape="circle" style={{ inlineSize: 32 }} />
<Skeleton shape="text" lines={3} />
<Skeleton loading={isLoading}><Button>Save</Button></Skeleton>
```

- `shape`: `block` (default; renamed from `rectangle`) | `text` | `circle`. Drop `rounded` as
  a shape. It is only a radius; add `radius="container"` later if a large placeholder needs
  the card corner.
- `block`: width 100%, a default height (1rem as in Primer, or 16 as in Fluent), radius
  capped at 4.
- `text`: keeps the current line-box model; `lines` applies only to `text`.
- `circle`: 1:1 (`aspect-ratio: 1`) so only one dimension is needed, as in Mantine and Fluent.
- `animated` (default true) and wrap via children + `loading`, as today.
- **Backed by:** Fluent (rectangle default, shape prop), Mantine (block + circle), Chakra and
  Primer (block base), Radix (empty block), MUI (shape variant, but text default).
- **Pros:** smallest change from today; one manifest block; the block default matches most
  systems.
- **Cons:** `lines` is valid only on one shape; text sizes are not tied to type roles; an
  avatar placeholder still needs a manual size.

### B. Parts: `Skeleton` + `SkeletonText` + `SkeletonAvatar` (Primer model)

- `Skeleton`: block only; `inline-size` / `block-size` via style; radius capped at 4; wrap
  mode lives here.
- `SkeletonText`: `lines` (1), `size` = Area's text roles (for example `sm | md | lg |
  title`), bar = glyph height in its line box, last line 65% / ≥50px.
- `SkeletonAvatar`: `size` = Area's Avatar sizes, `shape` = `circle | square` with the
  Avatar's square radius.
- **Backed by:** Primer (exact), Chakra (Skeleton / SkeletonCircle / SkeletonText), Polaris
  (role parts), antd (Avatar / Button / Input elements), Carbon (primitives).
- **Pros:** sizes come from real Area scales, so avatar and text placeholders match their
  components by construction; no invalid prop combinations.
- **Cons:** three exports and manifest entries. Parts must follow Avatar and type-scale changes.

### C. Wrap-first (Radix / Spectrum model)

- `<Skeleton loading>` around real components filled with mock data. The child keeps its
  size and **its own radius** (let the child's class win, as Radix does, instead of the
  `:has()` list). Inline text is wrapped so each line box becomes a bar
  (`box-decoration-break: clone`). The empty form is a block fallback.
- **Backed by:** Radix, Spectrum (the only mode), Geist, MUI children, Chakra `loading`,
  Mantine `visible`.
- **Pros:** no layout shift; correct shape and radius for every component with no per-shape
  rules; composition matches the loaded card exactly.
- **Cons:** needs mock content everywhere; controls inside must be inert (it would disable
  the real control, the Spectrum model); multi-line text needs inline wrapping to avoid one
  big block; hard to show in a static gallery.

### Recommendation

Take **A**, and make it partly wrap-first:

1. Default `shape="block"`. Remove `rounded`.
2. Keep `text` + `lines` and the line-box model (the only Primer-grade text model in the set).
3. In wrap mode, let the child's radius win instead of listing controls in `:has()`.
4. Follow the evidence in composition docs: don't add placeholders for buttons and menus in
   card demos. When one is shown, it sits on the card's content inset, never at the edge.
   Media goes full-bleed only when the loaded media is.

Move to **B** only if the owner wants avatar and text placeholders tied to Avatar sizes and
type roles by name.
