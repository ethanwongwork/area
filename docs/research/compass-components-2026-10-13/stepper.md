# Stepper — design-system source evidence

Retrieved 2026-10-12. Every repo was read at its default-branch HEAD (SHA from the GitHub API), and files came from `raw.githubusercontent.com/<repo>/<sha>/…`. Citations are `path:line-line @ <short sha>`. Pixel values come from source literals or from tokens resolved in the cited theme file. "Token" means I did not resolve the token's value in this pass. Local copies are in a local cache (not committed).

| System | Repo @ SHA |
|---|---|
| Carbon | carbon-design-system/carbon @ `c9b1f79` |
| Mantine | mantinedev/mantine @ `e243f7f` |
| Ant Design | ant-design/ant-design @ `5a102fe`; markup in react-component/steps @ `400f7cf` (v1.2.3; antd pins `~1.2.3`, package.json:148) |
| MUI | mui/material-ui @ `ade9a69` |
| Zag / Chakra v3 | chakra-ui/zag @ `055a34f`; chakra-ui/chakra-ui @ `fa9696f` |
| React Spectrum (v3 StepList) | adobe/react-spectrum @ `9b7a06e` |
| Atlassian | npm `@atlaskit/progress-tracker@11.4.4`, `dist/es2019` (the source is on Bitbucket, so I used the npm build) |
| Untitled UI | untitleduico/react @ `1d410cb` has no step component; I used the SSR preview markup from untitledui.com/react/components/progress-steps |
| GOV.UK | alphagov/govuk-frontend @ `18a320e`; alphagov/govuk_publishing_components @ `61ee6be` |
| Origin UI (shadcn community) | origin-space/originui @ `81bbc46` |
| WAI | w3.org/TR/wai-aria-1.2 (#aria-current); w3.org/WAI/tutorials/forms/multi-page (updated 27 Jul 2019) |

---

## 1. Carbon — ProgressIndicator / ProgressStep

Files: `packages/react/src/components/ProgressIndicator/ProgressIndicator.tsx` (R) and `packages/styles/scss/components/progress-indicator/_progress-indicator.scss` (S), both @ `c9b1f79`.

- **Markup.** The root is a `<ul class="cds--progress">` (R:92-125). Each step is an `<li>` wrapping a `<button type="button">` that holds the SVG icon, the label `<span>`, an optional `secondaryLabel` `<span>`, a visually hidden state `<span class="cds--assistive-text">` and the line `<span class="cds--progress-line">` (R:317-352). Carbon uses a `ul`, not an `ol`, and does not use `aria-current`.
- **State.** The parent derives state from `currentIndex`: steps with a lower index are `complete`, the step at the index is `current` (unless it is marked complete), and later steps stay `complete || false` (R:94-124). A step can also be `invalid` or `disabled` (R:195, 185). Classes are `--current`, `--complete`, `--incomplete` (when neither complete nor current) and `--disabled` (R:245-252).
- **Marker.** The marker is a Carbon icon and is never a number. Invalid uses `Warning`, current `Incomplete` (a half-filled circle), complete `CheckmarkOutline`, and upcoming `CircleDash`. Each icon gets an SVG `<title>` from `description` (R:268-301).
  - Size is `$spacing-05` square with `border-radius: 50%`, `margin-block-start: 10px` and `margin-inline-end: $spacing-03` (S:69-79).
  - Fill is `$interactive`; incomplete is `$icon-primary` (S:202-205), disabled `$icon-disabled` (S:254-257) and the warning `$support-error` (S:285-287).
- **Connector, horizontal.** Each step's button contains its own line, which spans the top edge of the step. It is `position:absolute`, `block-size: 2px` and `inline-size: 128px` (S:56-62). The step itself is `inline-size: 128px` with `min-inline-size: 7rem` (S:38-44). With `spaceEqually` the steps flex-grow and the line is 100% wide (S:51-53, 64-67).
  - Colours: current and complete use `$interactive` (S:195-198, 213-216); incomplete uses `$border-subtle` (S:202-209).
  - The marker and label sit side by side under the line.
- **Connector, vertical.** The line is 1px wide and `block-size:100%` at `inset-inline-start:0` (S:354-360). Each step has `min-block-size: 3.625rem` (S:318-324).
- **Label.**
  - The label uses `body-compact-01` with `line-height 1.45`, `margin-top: $spacing-03` and `max-inline-size: 88px`. It is truncated with an ellipsis (S:87-106).
  - The secondary label uses `label-01` in `$text-secondary`, absolutely positioned at `margin-block-start: 28px` (S:182-192).
  - In vertical layouts the label wraps, up to `max-inline-size: 160px` (S:333-340).
- **Interaction.** Steps are clickable only when `onChange` is passed (R:99-100). The current step is unclickable, through `--unclickable` and `onClick={!current ? onClick : undefined}` (R:321-328). Enter and Space call onClick (R:254-258). A disabled step is a disabled button with `tabIndex=-1` (R:325-327).
  - Hover underlines the label in `$link-primary-hover` with a 1px box-shadow (S:108-114).
  - Focus-visible draws a 1px `$focus` outline on the label (S:121-129).
- **Accessible state.** Visually hidden text reads "Complete", "Incomplete", "Current" or "Invalid", and is translatable (R:22-36, 303-315, 349). The button also has `title={label}` (R:330).
- **Orientation:** `vertical` prop (R:72, 87). **Sizes:** none.

## 2. Mantine — Stepper

Files: `packages/@mantine/core/src/components/Stepper/{Stepper.tsx (T), StepperStep/StepperStep.tsx (P), Stepper.module.css (C)}` @ `e243f7f`. The theme is `core/MantineProvider/default-theme.ts` (D).

- **Markup.** Everything is a `<div>`: the root `Box`, then a `.steps` `Box` (T:286-297). Each step is an `UnstyledButton` (a `<button>`) (P:144-158), and horizontal separators are sibling `<div>`s inserted between steps (T:240-249). Mantine uses no list, no `aria-current` and no hidden state text.
- **State.** `active === index` gives `stepProgress`, a lower index gives `stepCompleted`, otherwise `stepInactive` (T:206-207). These map to `data-progress` / `data-completed` (P:138-141). A step can also be `loading`, which shows a Loader at `iconSize/2` (P:167-171, 182-187). Mantine has no error state.
- **Marker.**
  - Sizes: `--stepper-icon-size` is xs 34, sm 36, md 42, lg 48 or xl 52px, md by default (C:2-8). Radius is `1000px` (C:12) and the border is `2px` (C:14, 166).
  - Text is bold at `--stepper-fz` = the size's font size (md 16px, D:45-51) (C:151-162).
  - Inactive: background and border are `gray-2` in light mode (dark: `dark-5`) (C:16-22, 166-167), with text `gray-7` (C:169-171).
  - Progress: the border becomes the step colour (C:177-179).
  - Completed: filled with the step colour, white text (C:181-185), and a `CheckIcon size="60%"` with a 200 ms "pop" transition (P:162-178).
  - The default content is `index + 1` (T:225).
- **Connector, horizontal.** `.separator` is `flex:1`, `height: 2px`, `margin-inline: spacing-md` (16px, D:75-81), `gray-2`, and the primary colour when `data-active` (C:56-65). `data-active` is set for `index < active`, which means the line leaving a completed step (T:244). With `labelPosition="bottom"` it is offset to the marker's centre: `margin-top: (icon − 2px)/2` (C:67-69).
- **Connector, vertical.**
  - Each step renders an absolute `border-inline-start: 2px` at `inset-inline-start: icon/2`, starting at `top: icon + xs/2` (C:139-149).
  - The step's `min-height` is `icon + spacing-xl (32px) + xs/2` (C:114-119). The last step hides its separator (C:126-132).
  - `data-active` is set when the step is completed (P:194-199).
- **Label and description.** The body sits beside the marker with `margin-inline-start: spacing-sm` (12px) (C:201-207). `labelPosition: 'right' | 'bottom'` is horizontal only; bottom stacks and centres with `margin-top: xs/2` (C:94-107, 214-218).
  - Label: weight medium, `--stepper-fz`, line-height 1 (C:221-225).
  - Description: `fz − 2px`, dimmed, margin `spacing/3` (C:227-233).
  - `iconPosition: left | right` (C:86-92).
- **Interaction.** `onStepClick`. Selection is allowed if the step is completed or `allowNextStepsSelect` (default `true`), and each step can override this with `allowStepSelect` (T:209-219, 126-132). A non-clickable step gets `tabIndex=-1` (P:157). `wrap` defaults to true for horizontal steppers (C:30-33).
- **Content.** Each step's `children` is the panel; `Stepper.Completed` shows when `active > last` (T:256-275).
- **Sizes:** xs–xl, plus `iconSize`, `radius` and `color`. **Orientation:** horizontal or vertical.

## 3. Ant Design — Steps (v6)

Files: `components/steps/index.tsx` (I), `components/steps/style/*.ts` and `components/theme/themes/seed.ts` @ `5a102fe`, plus `react-component/steps/src/{Steps,Step}.tsx` @ `400f7cf`.

- **Markup.** Root and item default to `div`/`div` (`Steps.tsx:181`). The default render overrides only `root` and `item` from the internal `components` mapping (I:199-203). When a step is clickable (`onChange` is set and the step is not disabled), the item gets `role="button"`, `tabIndex=0`, and Enter/Space calls `click()` (`Step.tsx:94-117`). Ant has no `aria-current` and no hidden state text (`grep aria` in I finds nothing).
- **Inner structure.** `item-wrapper` holds the icon and a `section`; the section holds a `header` (title, subtitle and the **rail**) and `content`, the description (`Step.tsx:149-213`). The rail is rendered inside the header, after the title, on every step except the last. Its status follows the next step's status (`Step.tsx:194-201`).
- **Status.** `wait | process | finish | error`, plus `disabled` (I:75-76, 131). Earlier steps are `finish`, the current step takes `status` (default `process`), and later steps are `wait` (`Steps.tsx:154-170`).
- **Marker.**
  - `iconSize = controlHeight` = 32px, and the small size uses `fontSizeHeading3` (24) (style/index.ts:196, 199). Base values: `controlHeight 32`, `fontSize 14` (seed.ts:69, 42).
  - The icon is a circle (`borderRadius: icon-size`) with a 1px `lineWidth` border, `fontSize: iconFontSize` (14) (style/icon.ts:24-44).
  - Content: finish shows `CheckOutlined`, error `CloseOutlined`, otherwise the number `index+1` (I:331-353). The current step can show a percent ring with `ProgressIcon` (I:341-349).
- **Variants.**
  - `variant: filled` (default) or `outlined` (I:99, 156).
  - Filled (style/status.ts:226-278): wait uses `colorFillTertiary` with `colorTextLabel` text, process and finish use `colorPrimaryBg` with `colorPrimary` text, error uses `colorErrorBg` with `colorError` text. The *active* (current) icon is solid `colorPrimary` with white text.
  - Outlined (status.ts:282-327) uses a 1px border in the state colour on `colorBgContainer`.
  - `type: default | navigation | inline | panel | dot` (I:105). Dot: 8px (`controlHeight/4`), with the current dot at 10px (`controlHeightLG/4`) and a 2px rail (style/index.ts:200-201; progress-dot.ts:26-32).
- **Rail (connector).**
  - Thickness is `rail-size = lineWidth` = 1px (style/index.ts:108).
  - Horizontal: `border-block-start`, `flex:1`, vertically centred on the icon (`icon/2 − rail/2`) (style/horizontal.ts:16-26). With title beside the icon it starts `margin` (16px) after the title (label-placement.ts:39-41, 99-104). With title under the icon it is absolute at `calc(50% + icon/2 + 4px)`, `width: calc(100% − icon − 2·4px)` (label-placement.ts:108-148).
  - Vertical: `border-inline-start`, absolute at `icon-size-max/2` (style/vertical.ts:33-49). Each item has `min-height: 1.5 × controlHeight` (48px) and `padding-bottom: paddingSM` (vertical.ts:19-26).
  - Rail colour follows status: wait `colorTextDisabled`, process and finish `colorPrimary`, error `colorError` (status.ts:181-222).
- **Text colour by status** (status.ts:174-219): title is `colorText` for process and finish, `colorTextDescription` for wait, and `colorError` for error. Content is `colorTextDescription`.
  - Base sizes: title `fontSizeLG`/`lineHeightLG` (16px), subtitle `fontSize`, content `fontSize` (style/index.ts:103-106, 157-162).
  - Small size: title `fontSize` (14px) (small.ts:24-31).
- **Title placement.** `titlePlacement: horizontal` (beside the icon, gap `marginXS` 8px) or `vertical` (under the icon, row-gap `paddingSM`) (label-placement.ts:56-58, 108-119). Dot type and vertical orientation force one placement (I:261-270).
- **Interaction.** Clickable when `onChange` is set; any step can be chosen, so navigation is non-linear (`Steps.tsx:174-176`). Hover changes the text to `colorPrimaryHover` and the icon to `colorPrimaryBgHover` (status.ts:121-145). Focus uses `genFocusOutline` (style/index.ts:181).
- **Sizes:** `small` and default/medium (I:103, 219). **Orientation:** horizontal or vertical, and it goes vertical responsively at `xs` (I:251-259).

## 4. MUI — Stepper / Step / StepLabel / StepIcon / StepConnector / StepButton

Files under `packages/mui-material/src/` @ `ade9a69`.

- **Markup.** `Stepper` is an `<ol>` with `display:flex` and `list-style:none` (Stepper.js:25-41, 119). Each `Step` is an `<li>` (Step.js:23, 83).
  - If any child is a `StepButton`, the Stepper becomes `role="tablist"` with `aria-orientation` and roving tabindex (Stepper.js:79-109, 138-156). Steps then become `role="presentation"` (Step.js:137) and StepButtons become `role="tab"` with `aria-selected={active}`, `aria-posinset` and `aria-setsize` (StepButton.js:111-124).
  - MUI uses no `aria-current` and no hidden state text.
- **State.** `activeStep`. Linear by default: earlier steps are `completed` and later steps are `disabled`. With `nonLinear`, neither is derived (Step.js:101-107). StepLabel adds `error` and `optional` (StepLabel.js:166-173).
- **Marker (StepIcon).** A 24×24 `SvgIcon`: medium = `pxToRem(24)` (SvgIcon.js:67-68).
  - Number: `<circle r=12>` with centred `<text>` in `typography.caption.fontSize` (12px, createTypography.js:73), filled `primary.contrastText` (StepIcon.js:45-54, 97-110).
  - Completed: the filled `CheckCircle` glyph. Error: the `Warning` glyph (StepIcon.js:73-95).
  - Colour: `text.disabled` by default, `primary.main` when active or completed, and `error.main` for error (StepIcon.js:35-41). So the upcoming marker is a filled grey disc, not an outline.
- **Connector.**
  - `StepConnector` is a `div` with `flex:1 1 auto` and an inner `span`. Horizontal: `border-top: 1px solid`. Vertical: `border-left: 1px solid`, `min-height:24px`, `margin-left:12` ("half icon") (StepConnector.js:44-101).
  - Colour is a single `grey[400]` (light) or `grey[600]` (dark) for all states, with no state colour in the default theme (StepConnector.js:76-81). It does carry `active`, `completed` and `disabled` classes for theming (StepConnector.js:16-24).
  - It is rendered inside each `Step` except the first (`hasConnector = index !== 0`) (Step.js:114, 140).
  - Horizontal gap: Stepper `gap: 8` (Stepper.js:51-54), and Step is a grid `1fr auto` with gap 8 (Step.js:51-58).
  - With `alternativeLabel` the connector is absolute: `top: 12`, `left: calc(-50% + 20px)`, `right: calc(50% + 20px)` (StepConnector.js:60-68).
- **Label.**
  - StepLabel is a flex row; the icon container has `padding-right: 8` (StepLabel.js:57-62, 119-128).
  - Text is `body2` (14px / 1.43, createTypography.js:71) in `text.secondary`. Active and completed labels use `text.primary` at weight 500, and error uses `error.main` (StepLabel.js:86-105, 140-147).
  - `alternativeLabel` puts the label under the icon with `margin-top:16`, centred (StepLabel.js:72-76, 100-102, 147-149).
  - The `optional` node renders under the label (StepLabel.js:233-240). In vertical layouts the label has `padding: 8px 0` (StepLabel.js:64-70).
- **StepButton.** A `ButtonBase` with padding `24px 16px` and negative margin `-24px -16px` (vertical: 8px / −8px) (StepButton.js:42-68). Focus-visible styles the inner StepLabel (StepButton.js:53-58).
- **StepContent.** The vertical-only panel uses `margin-left:12`, `padding-left: 20`, and a left border that continues the line (StepContent.js:32-35).
- **Orientation:** horizontal or vertical. **Sizes:** none. Separately, there is a `MobileStepper` with dots, text or progress.

## 5. Zag `steps` machine / Ark Steps / Chakra UI v3 Steps

Files: zag `packages/machines/steps/src/{steps.anatomy.ts, steps.connect.ts, steps.machine.ts, steps.types.ts}` @ `055a34f`; Chakra `packages/react/src/theme/recipes/steps.ts` and `components/steps/steps.tsx` @ `fa9696f`.

- **Anatomy.** root, list, item, trigger, indicator, separator, content, nextTrigger, prevTrigger and progress (anatomy.ts:3-14).
- **ARIA (zag connect).**
  - list: `role="tablist"`, `aria-owns` (the trigger ids), `aria-orientation` (connect.ts:81-93).
  - item: **`aria-current="step"`** on the current item (connect.ts:95-104).
  - trigger: a `<button role="tab">` with `aria-selected={current}` and `aria-controls`. `tabIndex` is 0 when the stepper is non-linear or the step is current, otherwise −1 (connect.ts:106-121).
  - content: `role="tabpanel"`, `hidden` unless current (connect.ts:130-143).
  - indicator: `aria-hidden` (connect.ts:145-155).
  - progress: `role="progressbar"` with `aria-valuetext "N% complete"` (connect.ts:195-205).
- **State hooks.** `data-complete`, `data-current` and `data-incomplete` on the trigger, indicator and separator (connect.ts:117-121, 151-153, 163-165). Root exposes a `--percent` CSS variable (connect.ts:75-77).
- **Linear vs non-linear.** `linear` defaults to `false` (machine.ts:10). When linear, trigger clicks are ignored (connect.ts:124). `isStepValid` blocks forward navigation in linear mode, and `isStepSkippable` skips steps on next/prev (types.ts:54-74).
- **Chakra markup.** Every part is a `div`, the trigger is a `button` (steps.tsx:34-160), and the default indicator shows `CheckIcon` when complete, otherwise the number (steps.tsx:191-198).
- **Chakra recipe.**
  - `--steps-thickness: 2px` and `--steps-gutter: spacing.3` (steps.ts:15-16).
  - Marker sizes: xs `sizes.6`, sm `sizes.8`, md `sizes.10` (default), lg `sizes.11`. Icon sizes are 3.5, 4, 4 and 5. With Chakra's 0.25rem unit that is 24, 32, 40 and 44px markers with 14, 16, 16 and 20px icons (steps.ts:158-210).
  - Text: list textStyle xs/xs/sm/md, title sm/sm/sm/md (steps.ts:158-210).
  - Title is weight medium in `fg`; description is `fg.muted` (steps.ts:18-24). The indicator is a circle with weight medium (steps.ts:29-43).
- **Chakra variants.**
  - Solid (default): incomplete has a 2px border. Current uses `colorPalette.muted` with a 2px `colorPalette.solid` border and `colorPalette.fg` text. Complete uses a solid fill with contrast text. The separator turns solid once complete (steps.ts:113-135).
  - Subtle: incomplete uses `bg.muted`, current `colorPalette.muted`, complete `colorPalette.emphasized` (steps.ts:136-155).
- **Chakra separator.**
  - Horizontal: `height: 2px`, `marginX: gutter`, `flex:1`, default `bg: border` (steps.ts:25-28, 101-105).
  - Vertical: absolute, 2px wide, `top: size + gutter`, `insetStart: size/2 − 1px`, `maxHeight: 100% − size − 2·gutter` (steps.ts:80-87).
  - The item uses `gap: 3`. The last item hides its separator (steps.ts:44-55).
- **Sizes:** xs, sm, md, lg. **Orientation:** horizontal or vertical.

## 6. Atlassian — Progress tracker (`@atlaskit/progress-tracker@11.4.4`, dist/es2019)

Files: `progress-tracker.js` (PT), `internal/{stage,marker,bar,link}.js` and their `.compiled.css`.

- **Markup.** An `<ol aria-label={label}>`, where `label` defaults to "Progress" (PT:39, 92-97). It is a grid of `repeat(n, 1fr)` with `gap` set by `spacing`: comfortable 40, cozy 16 (default), compact 4px (PT:9-15, 87-91). Each stage is an `<li aria-current={status==='current' ? 'step' : 'false'}>` (stage.js:83, 89-95).
- **Status.** `unvisited | current | visited | disabled` (stage.js:13-24, marker.js:7-12). It has no error state.
- **Marker.** An 8×8 dot, `border-radius: 8px`, absolute and centred over the bar (marker.css:1-9). Colours: unvisited `neutral-bold` (#292a2e), current and visited `brand-bold` (#1868db), disabled `background-disabled` (marker.js:7-12, marker.css:5-7). A stage with `percentageComplete > 0` is drawn as visited (stage.js:100).
- **Bar.** The connector is a bar, **8px tall**, in `brand-bold` with full end radii. Its width is `percentageComplete%`, plus the gap, so it spans into the next column. It is animated: 300 ms `cubic-bezier(0.15,1,0.3,1)`, or 50 ms linear when several stages change, staggered (bar.js:18-27, bar.css:1-8, PT:58-77). The es2019 build has only this fill element; I found no separate grey track element.
- **Label.** Centred under the marker, `margin-block-start: 20px` (space-250), font `body` (14px/20px) (stage.css:1, 6, 21; stage.js:110-112).
  - Colour: unvisited `text-subtlest`, current `text-brand`, visited `text`, disabled `text-disabled` (stage.js:13-18, stage.css:16-19).
  - Weight: unvisited regular (400), all other statuses bold (653) (stage.js:19-24, stage.css:13-14).
- **Interaction.** Only `visited` stages render a link, an `Anchor` with `href` and `onClick`, unless `noLink` (stage.js:69-73, 113; link.js:13-27). That lets users go back, but not forward.
- **Orientation:** horizontal only. **Sizes:** none; only the `spacing` density setting.

## 7. Untitled UI — Progress steps

- The open-source repo `untitleduico/react @ 1d410cb` has no step or stepper component. The tree is not truncated, and its 349 paths under `components/` contain no "step", "wizard" or "timeline" files. The component's source is PRO-gated ("Get the code" links to /buy).
- **Evidence from the docs page's server-rendered preview** (untitledui.com/react/components/progress-steps, fetched 2026-10-12). The page says the component is "built using React Aria and styled with Tailwind CSS".
  - **Markup.** The horizontal example is a `div` grid of `repeat(4, minmax(0,1fr))` with `gap-4` (16px); each step is a `flex-col items-center gap-3` (12px). The preview has no `<ol>` and no `aria-current`.
  - **Marker.** `size-6` (24px) `rounded-full`.
    - Complete: `bg-success-solid` with a 12px check path (`size-3`, stroke-width 2).
    - Current: `bg-primary ring-1 ring-inset ring-secondary text-secondary`, with the number in `text-xs font-semibold`.
    - Upcoming: the current styles plus `text-quaternary opacity-60`.
    - Dot-icon variant: current is `bg-brand-solid` with an 8px white dot (`size-2`) and a focus-style ring (`ring-2 ring-focus-ring ring-offset-2`); upcoming is `bg-primary ring-[1.5px] ring-inset ring-primary` with a `bg-fg-quaternary` 8px dot.
  - **Connector.** Horizontal: absolute at `top-1/2 left-[53%] w-full`, either `border-t-2 border-brand` (done) / `border-secondary` (upcoming), or a dotted SVG line (`stroke-width 2.4`, `stroke-dasharray 0,6`, round caps). Vertical: `border-l-2 … my-1 flex-1`.
  - **Label.** Title `text-sm font-semibold text-secondary`, with a description `text-sm text-tertiary` under it, centred in horizontal layouts.
  - These are rendered example classes, not component source.

## 8. React Spectrum v3 — StepList (private export; Spectrum 2 has none)

Files @ `9b7a06e`: `packages/@adobe/react-spectrum/src/steplist/StepListItem.tsx` (SI), `…/StepList.tsx` (SL), `packages/react-aria/src/steplist/{useStepList,useStepListItem}.ts`, `packages/react-stately/src/steplist/useStepListState.ts` (ST), and `packages/@adobe/spectrum-css-temp/components/steplist/{index,skin}.css` (X, K).

- **Markup.** The root is an `<ol>` (SL:61) with `aria-label` defaulting to "Step List" (useStepList.ts:41-45). Each item is an `<li>` containing an **`<a role="link">`** with **`aria-current="step"`** on the selected step, `aria-disabled`, and `tabIndex 0` if selectable (useStepListItem.ts:50-57; SI:70-82).
  - The link's name is `aria-labelledby="marker state label"`: the number, then visually hidden "Current: ", "Completed: " or "Not completed: ", then the label (SI:57-63, 74, 83-91; en-US.json).
  - The visible label and marker wrapper are `aria-hidden` (SI:88, 110).
- **Linear rule.** A step is selectable only if it is completed, or if the step before it is completed, or if it is the first step (ST:129-140). Selecting a step marks the previous one completed (`lastCompletedStep`) (ST:142-145). Props include `isReadOnly`, `isDisabled` and `disabledKeys` (ST:130).
- **Marker.**
  - Diameter: S 8, M 16 (default), L 24, XL 32px. Border 2px, `font-weight: bold` (X:15-26, 85-95, 143-198).
  - Counter font: S 0 (a dot), M `font-size-75`, L `font-size-100`, XL `font-size-200` (X:149, 173, 184, 195).
  - **It always shows the number, even when completed; it has no check.** (SI:111-113)
  - Incomplete: an outlined ring in `gray-400` with `gray-500` text. Completed: filled `gray-600` with `gray-50` text (hover `gray-700`). Current: filled `gray-800`. Emphasized current: `accent-900` (K:17-33, 50-53, 88-113).
- **Connector.**
  - Horizontal: no line; a **chevron** separator after the label. The gap between steps is S 10, M 16, L 20 or XL 24px; the marker-to-label gap is 10, 12, 14 or 16px (X:31-41, 209-254).
  - Vertical: a 2px SVG line, **dashed `6 4` with round caps while incomplete and solid when completed** (X:58-66, 304-327). It is at least 32px tall (`--spectrum-steplist-vertical-separation`) and sits in a grid `'marker label' / 'line label'` with `column-gap 6px` (X:44, 266-276).
  - Segment colour is `gray-400` for both states (K:17, 27).
- **Sizes:** S, M, L, XL. **Orientation:** horizontal or vertical. **Emphasis:** `isEmphasized` (SL:28-72).

## 9. GOV.UK

- **govuk-frontend has no stepper** @ `18a320e`. The closest pattern is **Task list** (`packages/govuk-frontend/src/govuk/components/task-list/template.njk`):
  - A `<ul class="govuk-task-list">` of `<li>`s, each with a title (a link if `href` is set), an optional hint, and a status cell (text or a `govukTag`) (template.njk:9-41).
  - The link gets `aria-describedby="<hint id> <status id>"`, so the status is announced with the task (template.njk:12).
  - It has no markers and no connectors.
- **Step-by-step navigation** lives in alphagov/govuk_publishing_components @ `61ee6be`:
  - Template: `app/views/govuk_publishing_components/components/_step_by_step_nav.html.erb` (E). Styles: `app/assets/stylesheets/govuk_publishing_components/components/_step-by-step-nav.scss` (G).
  - **Markup.** `<ol class="gem-c-step-nav__steps">` of `<li>`, with **`aria-current="step"`** on the highlighted step (E:38-52, 116-118).
  - **Accessible name.** The number circle contains visually hidden "Step" before the number and a hidden colon after it (E:59-66).
  - **Marker.** A 30px circle (35px for the large variant on tablet and up), `border-radius:100px` (G:2-3, 295-315). Number circles have a 1px border in `functional-colour("border")` and bold 16px text with `line-height 29px` (19px in large) (G:317-323). The active step's circle fills black with white text (G:325-332). A "logic" circle shows "and" / "or" text (G:335-345).
  - **Connector.** Vertical only. Each step's `::after` is a `1px` left border at `circle/2 − 0.5px`, running the full height (G:1, 6-24, 230-235). The last step ends with a short horizontal dash `circle/2` wide (G:249-261). Lines and circles of the active step turn black (G:286-293).
  - Each step is an expandable accordion panel (E:57, 96).

## 10. Systems with no stepper (checked)

- **Primer** (primer/react @ `7f5303d`): not found. A full non-truncated tree search for `step|progress` found only `packages/react/src/ProgressBar/*`.
- **Fluent 2** (microsoft/fluentui @ `16fcf57`): not found. A full non-truncated tree search for `stepper|step-list|progress-steps` returned no paths.
- **Spectrum 2** (`packages/@react-spectrum/s2/src` @ `9b7a06e`): not found. It has only `ProgressBar.tsx` and `ProgressCircle.tsx`. The v3 StepList in §8 is exported only under `exports/private/steplist`.
- **Polaris** (Shopify/polaris-react @ `3f7954a`, archived): not found. `polaris-react/src/components` has `ProgressBar` and no step component.
- **shadcn/ui** (shadcn-ui/ui @ `30a58d4`): not found. A tree search for `stepper` returned nothing.
- **Origin UI** (shadcn-style community registry; origin-space/originui @ `81bbc46`, `apps/origin/registry/default/ui/stepper.tsx`). Low priority:
  - All parts are `div`s, and the trigger is a `<button type="button">` that calls `setActiveStep` and is disabled when `isDisabled` (stepper.tsx:132-143, 173-185).
  - It has no ARIA list and no `aria-current`.
  - States are `completed | active | inactive` (via `data-state`), plus `data-loading` (stepper.tsx:120-139).
  - Indicator: `size-6` (24px) round. `bg-muted` with `text-muted-foreground` `text-xs` font-medium by default; `bg-primary` when active or completed. The `CheckIcon` scales in when completed (stepper.tsx:203-228).
  - Title `text-sm font-medium`, description `text-sm text-muted-foreground` (stepper.tsx:246, 260).
  - Separator `m-0.5 bg-muted`, `h-0.5` (2px) horizontal or `w-0.5 h-12` vertical, `bg-primary` once the step is completed (stepper.tsx:273-275).

## 11. WAI-ARIA guidance

- **ARIA 1.2 `aria-current`.**
  - The `step` token "Represents the current step within a process". The spec's own example is a link within a step indicator that is visually styled as the current step.
  - "Authors SHOULD only mark one element in a set of elements as current."
  - Authors SHOULD NOT use `aria-current` instead of `aria-selected` in widgets where `aria-selected` means the same thing, as with tabs in a tablist. (w3.org/TR/wai-aria-1.2/#aria-current)
- **WAI forms tutorial, multi-page forms ("Using step-by-step indicator").**
  - Use an **ordered list with a list item for every step**.
  - Use **visually hidden text to indicate the current and completed steps**: `<span class="visuallyhidden">Completed: </span>` and `Current: `. Upcoming steps get no prefix.
  - "If possible, provide a link to steps already completed," and save data already entered in the current step.
  - Completed steps are `<a href>` links; the current and upcoming steps are plain `<span>`s.
  - The tutorial also recommends putting "Step 2 of 4" first in `<title>` and in the `<h1>`. (w3.org/WAI/tutorials/forms/multi-page/, updated 27 July 2019)
- The WAI-ARIA Authoring Practices Guide has no "stepper" pattern. I am not citing a page for this; it is not among the APG patterns I fetched.

---

## Summary table

| System | List markup | Step element | Current announced by | Done/upcoming announced by | Marker (default) | Done marker | Connector (thickness · colour rule) | Label placement | Clickable / linear | Orientation | Sizes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Carbon | `ul > li` | `button` | hidden text "Current" | hidden text "Complete"/"Incomplete"/"Invalid" | 16px icon (`$spacing-05`; dashed circle, half-filled circle) | checkmark-outline icon | 2px top bar per step (horizontal), 1px (vertical) · `$interactive` when current or complete, else `$border-subtle` | beside the icon, under the bar | `onChange` lets any step except the current one be clicked | h / v | — |
| Mantine | `div` | `button` | nothing | nothing | 42px (34–52), number bold 16px, 2px ring | filled + check at 60% | 2px · primary for lines leaving completed steps | right (default) or bottom | completed steps, plus later steps by default (`allowNextStepsSelect`) | h / v | xs–xl |
| Ant Design | `div` | `div` (`role=button` when clickable) | nothing | nothing | 32px, number 14px | `CheckOutlined` (error `CloseOutlined`) | 1px · the next step's status: wait grey, process/finish primary, error red | beside (default) or under | any step, via `onChange` | h / v (responsive) | small 24px / default 32px; dot 8/10px |
| MUI | `ol > li` (`tablist`/`tab` when StepButton is used) | `li`, or `button role=tab` | `aria-selected` (tab mode only) | nothing | 24px filled disc, number 12px | `CheckCircle` glyph (error `Warning`) | 1px · single grey for every state | beside, or under (`alternativeLabel`, 16px gap) | `nonLinear`; StepButton | h / v | — |
| Zag / Chakra | `div` (`role=tablist`) | `button role=tab` | **`aria-current="step"`** on the item + `aria-selected` | `data-*` only | 40px (24/32/40/44) | filled + check | 2px · solid once complete | beside (gap 12px) | `linear` (default false) | h / v | xs–lg |
| Atlassian | **`ol > li`**, `aria-label` | `li` (link on visited steps) | **`aria-current="step"`** | nothing | 8px dot | same dot, brand | 8px bar · brand, percentage width, animated | under (20px), centred | links on visited steps only | h | spacing 4/16/40 |
| Untitled UI (preview) | `div` | `div` | — | — | 24px, number 12px semibold, 1px ring | success fill + 12px check | 2px solid (brand/secondary) or dotted | under (h); vertical label placement not inspected | not visible in preview | h / v | — |
| Spectrum v3 | **`ol > li`**, `aria-label` | `a role=link` | **`aria-current="step"`** + hidden "Current: " | hidden "Completed: " / "Not completed: " | 16px (8/16/24/32), 2px ring, number | filled grey, **still numbered** | h: chevron · v: 2px, dashed while incomplete, solid when complete | beside | linear: completed steps + the next one | h / v | S–XL |
| GOV.UK step-by-step | **`ol > li`** | `li` (accordion) | **`aria-current="step"`** | hidden "Step N:" prefix | 30px (35 large), 1px ring, bold 16px | (no done state) active filled black | 1px vertical · black when active | beside | accordion, not a navigation stepper | v | default / large |
| WAI tutorial | **`ol > li`** | link (done) / span | hidden "Current: " | hidden "Completed: " | — | — | — | — | completed steps are links (go back) | — | — |

## Consensus

- **Markup.** Systems that follow WAI and ARIA (Atlassian, Spectrum, GOV.UK, the WAI tutorial, MUI's default) use an **`<ol>` of `<li>`**, and Atlassian and Spectrum give the list an `aria-label`. Carbon uses a `ul`; Mantine, Ant, Chakra/Zag, Untitled UI and Origin use `div`s. Tab semantics (`tablist`/`tab`/`aria-selected`) appear only where the stepper also switches content panels (MUI StepButton, Zag).
- **Current step.** **`aria-current="step"`** on the current item is the ARIA-spec mechanism, and Atlassian, Spectrum, GOV.UK and Zag use it. The others rely on visually hidden text (Carbon) or expose nothing (Mantine, Ant, MUI, Origin).
- **Completed and upcoming steps.** These have no ARIA state. Systems that announce them use **visually hidden prefix text**: WAI "Completed: ", Spectrum "Completed: " / "Not completed: ", and Carbon "Complete" / "Incomplete" / "Invalid". Markers are hidden from assistive technology (`aria-hidden` in Zag and Spectrum).
- **Marker.** A circle with the step number, which becomes a **check** when complete. Mantine, Ant, MUI, Chakra, Untitled UI and Origin do this; Spectrum keeps the number, Carbon uses icons only, and Atlassian uses dots. Sizes cluster at **24px** (MUI, Untitled UI, Origin, Chakra xs, Ant small, Spectrum L), with **32px** (Ant, Chakra sm) and 40–42px (Chakra md, Mantine md) as larger defaults. Number text is 12–14px at medium–bold weight.
- **Marker states.**
  - Upcoming is either an outlined ring (Mantine, Chakra solid, Untitled UI, Spectrum, Ant outlined) or a muted fill (MUI, Ant filled, Chakra subtle, Origin).
  - Current is the accent ring or tint (Mantine, Chakra solid) or a solid accent (Ant, Origin, Untitled UI dot variant).
  - Complete is a solid accent fill with a contrasting check. Untitled UI uses success green instead.
- **Connector.** **1–2px** thick: 1px in Ant, MUI and GOV.UK; 2px in Carbon horizontal, Mantine, Chakra, Spectrum vertical, Untitled UI and Origin. Atlassian's 8px bar is an outlier.
  - Most systems colour a segment with the accent once the step before it is complete, and neutral otherwise (Carbon, Mantine, Ant, Chakra, Origin, Untitled UI). MUI keeps one grey for every state by default.
  - Spectrum is alone in drawing incomplete segments **dashed**; Untitled UI offers a dotted style.
  - Horizontal connectors are flex-grow lines centred on the marker, with an 8–16px gap to the marker or label: MUI 8, Ant 16 after the title or 4 when the label is under the marker, Mantine 16, Chakra 12. Vertical connectors are a line at `markerSize/2`, running from below the marker to the next step, with a minimum height of about 24–48px.
- **Label placement.** The label sits **beside** the marker by default in every system that offers a choice (gap 8–12px). An **under-the-marker, centred** option exists in MUI (`alternativeLabel`), Mantine (`labelPosition="bottom"`), Ant (`titlePlacement="vertical"`) and Atlassian (the only placement there). An optional description sits under the title in a muted colour, 0–2px smaller.
- **Label weight.** Weight marks state in MUI (active and completed at 500), Atlassian (current, visited and disabled bold) and Ant (wait steps use description colour). Error turns the label red (Ant, MUI).
- **States.** All systems have complete, current and upcoming. **Error/invalid** exists in Carbon, Ant and MUI. **Disabled** exists in Carbon, Ant, MUI (derived in linear mode), Spectrum, Atlassian and Origin. **Loading** exists in Mantine and Origin.
- **Interaction.** The common model lets users go **back to completed steps** but not jump ahead: WAI, Atlassian, Spectrum, Mantine (when `allowNextStepsSelect` is off) and MUI (linear). Fully non-linear clicking is opt-in: Mantine's default, Ant's `onChange`, MUI's `nonLinear`, Zag's non-linear default. The current step is not clickable (Carbon, Ant hover rule). Clickable steps are real buttons or links with Enter/Space activation.
- **Orientation and sizes.** Every system except Atlassian and GOV.UK offers horizontal and vertical. Size scales are 2–5 steps: Ant 2, Chakra 4, Spectrum 4, Mantine 5. Carbon, MUI, Atlassian, Untitled UI and Origin have none.
