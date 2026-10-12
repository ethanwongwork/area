# Show more / show less: design-system survey

2026-10-12 · for Description list "show more" (the first N rows, then a control that reveals the
rest, as Notion's "N more properties" row and Figma Dev Mode's inspector lists). Research only; no
component code changed.

**Evidence grades.** *Source*: read from code at a pinned commit (exact). *Docs*: official
documentation page (exact wording, no values). *Estimate*: from memory or third-party
descriptions. Not used as a basis until captured.

## Pinned sources

| Id | Repo @ commit | Files |
|---|---|---|
| antd | ant-design/ant-design @ `90af4e84` | `components/typography/Base/index.tsx`, `typography/style/index.ts`, `style/index.tsx`, `locale/en_US.ts`, `descriptions/index.tsx` |
| polaris | Shopify/polaris @ `3f7954ae` | `polaris-react/src/components/{DescriptionList,Collapsible,Button,Navigation}/…`, `polaris-react/locales/en.json` |
| primer | primer/react @ `7f5303d8` | `packages/react/src/NavList/NavList.tsx`, `LabelGroup/LabelGroup.{tsx,module.css}`, `ActionList/ActionList.module.css` |
| primer-vc | primer/view_components @ `61aebd50` | `app/components/primer/beta/nav_list_group_element.ts`, show_more_item aria snapshot |
| mantine | mantinedev/mantine @ `e243f7f9` | `packages/@mantine/core/src/components/Spoiler/Spoiler.{tsx,module.css}` |
| carbon | carbon-design-system/carbon @ `5612c70e` | `packages/react/src/components/Tile/Tile.tsx`, `packages/styles/scss/components/tile/_tile.scss` |
| radix | radix-ui/primitives @ `e46b6590` | `packages/react/collapsible/src/collapsible.tsx` |
| react-aria | adobe/react-spectrum @ `821c011c` | `packages/react-aria/src/disclosure/useDisclosure.ts` |
| chakra | chakra-ui/chakra-ui @ `fa9696f3` | `apps/compositions/src/examples/collapsible-partial-height.tsx`, `packages/react/src/theme/recipes/collapsible.ts`, `theme/tokens/durations.ts` |
| aui | aui.atlassian.com/aui/9.1/docs/expander.html | Docs (legacy Atlassian UI; atlassian.design has no show-more component) |

## Per system

**Ant Design** (*source*)
- **Descriptions has no collapse.** Its props are title, extra, column, layout, colon, bordered, size and items (`descriptions/index.tsx:65-91`). No expand or more prop exists.
- **Typography `ellipsis.expandable`** (`Base/index.tsx:105-110`): `expandable: boolean | 'collapsible'`, `symbol`, `defaultExpanded`, `expanded`, `onExpand`. The default symbol is the locale's "Expand" / "Collapse" (`:263`, `locale/en_US.ts:86-87`). There is no count.
- **Element:** `<button type="button">` with class `-expand` or `-collapse` and `aria-label`, and no `aria-expanded` (`:425-441`). It sits inline after the clipped text, `marginInlineStart: marginXXS` = 4 (`typography/style/index.ts:93-101`).
- **Paint:** `operationUnit` gives `colorLink` (= `colorInfo` #1677ff), no border, padding or background, and `transition: all motionDurationSlow` (0.3s). Hover is `colorLinkHover` (`style/index.tsx:179-201`). So it is link-blue, not muted.
- **One-way by default:** without `'collapsible'`, the button disappears once the text is expanded, and focus is not managed (`:327-331` only sets state). There is no height motion.
- **Collapse** (accordion) is a separate component: a header row with a rotating arrow. It is not a "more" control.

**Shopify Polaris** (*source*)
- **DescriptionList has no collapse.** Its props are `items` and `gap: 'tight' | 'loose'` (`DescriptionList.tsx:15-20`). It renders `dt` / `dd` with the term in `headingSm`.
- **Plain disclosure button** (the documented "Show more" pattern, `Button.stories.tsx:749-764`): `variant="plain"` with `disclosure={expanded ? 'up' : 'down'}`. The label flips "Show more" / "Show less", with no count. The chevron icon is swapped (ChevronDown to ChevronUp), not rotated (`Button.tsx:146-160`). It trails the label. Plain text is `bodyMd` at **regular** weight (`Button.tsx:171-181`), in link ink (`--p-color-text-link`), underlined on hover and focus (`Button.module.css:154-162`). Negative margins cancel the padding, so the text aligns with the content edge (`:168-173`). `ariaExpanded` / `ariaControls` are passed to the button, as in the Collapsible stories.
- **Collapsible:** `max-height` transition, with a 150ms ease-in-out default (`Collapsible.tsx:33`). The CSS fallback is 100ms ease-out (`Collapsible.module.css:1-9`). When fully closed, the children are **unmounted** and the wrapper is `display: none`, "Stop children from being focused" (`Collapsible.tsx:61-62`, `.module.css:11-14`). The wrapper also sets `aria-hidden={!open}` (`:176`).
- **Navigation rollup** (show the first `after` items) (`Section.tsx:22-27, 139-196`): The toggle is an icon-only `…` button with an `aria-label` of `rollup.view` / `rollup.hide`, and **no aria-expanded**. Hidden items sit in a Collapsible above the toggle. The active item is always promoted into the visible part. Ink is `text-secondary`, and hover is `text-brand` (`Navigation.module.css:1058-1070`).
- **Filters:** "More filters ({count})" puts the count in parentheses (`locales/en.json:162-163`).

**GitHub Primer** (*source*)
- **`NavList.GroupExpand`** (`NavList.tsx:448-524`): the label defaults to "Show more" (`:449`), with no count. It renders as `ActionList.Item as="button"`, so it is a full-width row in default ink at 14px (`--text-body-size-medium`), with a trailing `PlusIcon` (`:521`). It always has `aria-expanded="false"` (`:503`). The button is **removed** once everything is shown, so there is no "Show less". Hidden items are **not rendered**. With `pages`, each click reveals one page. **Focus moves to the first newly revealed item** through `flushSync` and a `data-expand-focus-target` marker (`:506-514`).
- **ViewComponents `ShowMoreItem`** (`nav_list_group_element.ts:42-70`) fetches the next page, focuses its last focus marker, and hides the button on the last page. The aria snapshot shows a plain `button "Show more foods"`, with no `aria-expanded`.
- **LabelGroup inline overflow** (`LabelGroup.tsx:42-50`): the visible label is `+N`. The accessible name is "Show +N more" in a VisuallyHidden span. The button is `variant="invisible"` at `size="small"`. Once expanded, the label becomes "Show less". Hidden items stay in the DOM with `visibility: hidden; order: 9999` (`.module.css:38-41`). **Focus on expand goes to the first revealed child if it is focusable, otherwise to the collapse button** (`:268-288`). On collapse, focus returns to the expand button (`:192-198`).
- **Progressive-disclosure guidance** (*docs*, primer.style/product/ui-patterns/progressive-disclosure): use it sparingly, pair the icon with descriptive text, and point the chevron down when collapsed and up when expanded. The page has no wording or ARIA guidance.

**Mantine `Spoiler`** (*source*, `Spoiler.tsx:25-51, 127-150`, `Spoiler.module.css`)
- **Props:** `maxHeight` (default 100 px), `showLabel` / `hideLabel` (both required, with no default wording), `expanded` / `defaultExpanded` / `onExpandedChange`, `showAriaLabel` / `hideAriaLabel`, `transitionDuration` and `controlRef`.
- **Element:** `Anchor component="button"`, so it is link-coloured. It has `aria-expanded`, `aria-controls` → `role="region"`.
- **Position:** absolutely positioned at `inset-inline-start: 0; top: 100%; height: 24px`. The root reserves `margin-bottom: 24px`. The control only renders when the content overflows.
- **Hiding:** content is clipped by `max-height` with `overflow: hidden`. The clipped content stays focusable, which is a weakness. Motion is `max-height 200ms ease`. The button comes before the content in DOM order.

**Carbon `ExpandableTile`** (*source*, `Tile.tsx:757-794, 960-1008`; `_tile.scss:206-225, 268, 317`)
- **Element:** a `<button>` chevron with `aria-expanded` and `aria-controls` → the below-the-fold id. The accessible text defaults to "Interact to expand Tile" / "Interact to collapse Tile".
- **Label:** an optional visible `tileCollapsedLabel` / `tileExpandedLabel` sits beside the chevron, bottom-end.
- **Chevron:** it **rotates 180°**, with transition `$duration-fast-02`. The tile's `max-height` uses `$duration-moderate-01`, with `standard productive` easing. The values are about 110 / 150ms from Carbon's motion tokens (*not re-read at this commit*). Reduced motion turns the transition off.
- **Focus** stays on the button, which persists.
- **StructuredList** has no collapse.

**Radix `Collapsible`** (*source*): the trigger has `aria-expanded`, and `aria-controls` only while
open (`collapsible.tsx:99-100`). Content is unmounted when closed unless `forceMount` (`:136`), and
`hidden` when not open (`:213`). It exposes `--radix-collapsible-content-height` for a CSS
keyframe animation (`:217`). shadcn's Collapsible is this primitive restyled.

**React Aria `useDisclosure`** (Spectrum) (*source*): the trigger has `aria-expanded` and
`aria-controls` (`useDisclosure.ts:144-145`). The panel uses **`hidden="until-found"`** and expands
on the `beforematch` event, so browser find-in-page reveals hidden content (`:61-98, 163-164`).

**Chakra `Collapsible`** (*source*): the partial-height example uses `collapsedHeight="100px"`
with an outline `Button size="sm"`, `mt="4"`. The label flips "Show More" / "Show Less", and a
`LuChevronDown` rotates 180° over 0.2s. The closed content gets an inset bottom shadow.
- Motion is the `expand-height` / `collapse-height` keyframes over `moderate` = 200ms (recipe `:8-23`, `durations.ts:7`).

**Atlassian AUI expander** (*docs*): the trigger is `.aui-expander-trigger` with `aria-controls`
and `data-replace-text` (the label swaps after the first click; the example is "Show more").
`min-height` on the content sets the collapsed height. The docs specify no element, animation or
`aria-expanded`.

**Fluent 2, Material 3:** no dedicated show-more component was found in their docs (searched, but
not exhaustively). Both use expanders or accordions with a down/up chevron.

**Notion "N more properties"** (*estimate*, needs a capture):
- Notion is understood to fold hidden or empty-hidden properties under a row reading like "3 more properties", with a "1 hidden property" form for always-hidden ones (third-party description).
- The row sits in the property-name column in muted ink, with a small chevron in the icon slot. When open, it reads like "Hide 3 properties".
- None of this is measured. **Figma Dev Mode** inspector "show more": not captured. Both must be captured with `area-capture.js` (read-only: clicking the toggle changes view state only, but ask first) before any value is used.

## Synthesis

| Question | Majority (sources) | Outliers |
|---|---|---|
| Element | native `<button type="button">` (all ten) | Mantine paints it as a link (Anchor) |
| Label | "Show more" / "Show less" flip (Polaris, Chakra, Mantine examples, Primer LabelGroup, AUI) | Primer NavList is one-way with no "less"; antd "Expand" / "Collapse" |
| Count | usually absent | Primer LabelGroup `+N` and "Show +N more"; Polaris "More filters (N)"; Notion "N more …" (estimate) |
| Icon | chevron down → up: rotate 180° (Carbon, Chakra) or swap (Polaris, Primer guidance) | Primer NavList plus; Polaris nav `…`; antd and Mantine none |
| Ink | link colour (antd, Polaris plain, Mantine) | Primer row default ink; Polaris nav secondary; Notion muted (estimate) |
| Weight / size | regular body (Polaris `bodyMd` regular; Primer 14 regular) | — |
| Position | after the content, start-aligned (all) | Carbon bottom-end; Mantine DOM order before the content |
| ARIA | `aria-expanded` + `aria-controls` (Polaris pattern, Mantine, Carbon, Radix, React Aria) | Primer NavList, LabelGroup and Polaris nav: none (the label carries the state) |
| Hidden rows | out of the a11y tree: unmounted (Polaris, Primer NavList, Radix), `hidden` / `until-found` (React Aria), `visibility` (Primer LabelGroup) | Mantine clips (still focusable) |
| Focus on expand | stays on the persistent toggle (Carbon, Mantine, Polaris, Radix) | Primer moves it to the first revealed *focusable* item, else to the toggle |
| Motion | height 150–200ms, ease / ease-in-out (Polaris 150, Mantine 200, Chakra 200, Carbon ~150) | Primer NavList and antd: none |
| Default count | none (callers set it) | Mantine `maxHeight` 100 px |

## Recommendation for Area's Description list

**API**
- `visibleCount?: number`, with no default, so every row shows. *Basis:* Area's own Badge group `visibleCount` and Primer's `visibleChildCount`. The control renders only when `items > visibleCount` (Polaris rollup, Mantine).
- `expanded` / `defaultExpanded` / `onExpandedChange(expanded)`. *Basis:* Mantine's exact trio; antd's `expanded` / `defaultExpanded`.
- `moreLabel?: ReactNode | ((hidden: number) => ReactNode)` and `lessLabel?: ReactNode`. *Basis:* antd's `symbol(expanded)` function and Mantine's show / hide labels. A function lets callers write Notion's noun ("3 more properties").
- **Later option, not now:** per-item `collapsed` (Notion folds chosen properties, not the first N).

**Wording**
- The default is **"Show {n} more"** / **"Show less"**.
- The count is shown because it tells the reader what they are missing and matches Notion's "N more …" (estimate). The verb form follows Primer LabelGroup's accessible name "Show +N more" and Polaris's "Show more" / "Show less".

**Element and ARIA**
- A native `<button type="button">` after the `<dl>`. **Structural constraint:** `<dl>` content is only `dt` / `dd` / `div` groups, so a button cannot be its child. The root becomes a wrapper (`div.area-description-list` > `dl` + button), or the button follows the `dl` as a sibling. Decide which in the spec.
- `aria-expanded` + `aria-controls` = the `dl` id. *Basis:* the majority above and the APG disclosure pattern. **Conflict to resolve:** Area's Code block toggle uses `aria-controls` without `aria-expanded`, because its label carries the state (`code-block.md:169-170`). Pick one rule for both.
- Hidden rows are row `div`s with `hidden="until-found"`. A `beforematch` event expands the list, and plain `hidden` is the fallback. *Basis:* React Aria. This keeps find-in-page and SSR working without unmounting.
- **Focus** stays on the toggle in both directions. Description rows are static text, so Primer's "first revealed focusable item, else the toggle" rule resolves to the toggle. *Basis:* Primer LabelGroup `:268-288`; Carbon, Mantine and Polaris persistent toggles.

**Visual** (Notion values are *estimates* until captured)
- **Ink:** `fg-muted`, 14/20, **400**, with no link colour. *Basis:* Area's Code block toggle (`fg-muted` 400 14/20, `code-block.md:116`), and Notion's muted term ink rgb(125,122,117) measured on the term (`description-list.md:67`). Polaris and antd use link blue; Area does not, because ChatGPT and Notion keep controls neutral.
- **Hover:** underline, with the ink fixed. *Basis:* the Code block's shared toggle rule (`code-block.md:110`) and Polaris plain's underline. A Notion row-plate hover is possible after a capture.
- **Icon:** a 16 chevron-down in the term's icon box. It rotates 180° when expanded, using MOTION's chevron rule (`fast` ease-out). *Basis:* Carbon and Chakra rotate; Polaris and Primer guidance use down/up. The leading slot puts the label at the term-name position (28 in columns), the way Notion's property names align. In justified layout, the label sits at the row's start padding (16).
- **Spacing:** the control takes one row slot: 34 tall and 4 from the last row in columns; 44 with 12 / 16 padding in justified; and the row rule above it when `divided`. *Basis:* Primer NavList and Polaris rollup render the control as a list row; the row values are Area's measured Notion and ChatGPT rows (`description-list.md:55-57, 65`). Compact steps down with the row tokens.
- **Motion:** reuse the Accordion body rule on the `dl`'s `block-size`: open `slow`, close `moderate`, ease-in-out, with `interpolate-size`, snapping where that is unsupported and when reduced motion is set (`MOTION.md:21-22, 56`). *Basis:* the external range of 150–200ms; Area keeps one rule for every height reveal.

**Before building:** capture Notion's "N more properties" row (label, ink, icon, height, hover,
expanded wording) and a Figma Dev Mode inspector list, then replace the estimates above.
