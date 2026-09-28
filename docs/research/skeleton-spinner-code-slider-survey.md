# Design-system research: Skeleton, Spinner, Code (inline), Slider

Read 2026-09-27 from shallow clones at the pinned commits below (source reading only; nothing
rendered or captured). Every value below is from the pinned file/line, unless marked
**doc** (documented palette/token value, not source-pinned), **arith** (my arithmetic from
pinned values) or **not found**.

## Pinned sources

| Id | Repo | Commit | Licence |
|---|---|---|---|
| uui | untitleduico/react | `4702dc0ea8d140c3491a85670c7b4fab47b722da` | MIT |
| shadcn | shadcn-ui/ui (apps/v4, new-york-v4) | `98a1fe67b439324ddc857f47fbdce056600a4329` | MIT |
| radix | radix-ui/themes | `1faff10ac26ae17f09944d418c6949b93fc6b566` | MIT |
| primer | primer/react | `67945828439898ace865bd5f7417c562033bcbc2` | MIT |
| primitives | primer/primitives | `f48bc063f7bc0fb3e447386a8c259650ce46dea8` | MIT |
| primercss | primer/css | `be70cda91066df154f76e634d7ce993f205d282e` | MIT |
| fluent | microsoft/fluentui | `8add8c8750c34c85acd811e32ab324abf8f1562e` | MIT |
| carbon | carbon-design-system/carbon | `7e8c8f7db6dd2ed98c4947b78b37614f43eda920` | Apache-2.0 |
| mui | mui/material-ui | `190a83cf3784c53b57d7a80cf96df27276eed079` | MIT |
| mweb | material-components/material-web | `cbd34a8921915af94d5ef65c2a69eece41d5b4f3` | Apache-2.0 |
| mantine | mantinedev/mantine | `f38933cb4f1c534600f4ff59ee3ddbb4685a4bc4` | MIT |
| chakra | chakra-ui/chakra-ui (v3) | `961161428b8c59157ad921dd23303b73c294d73f` | MIT |
| antd | ant-design/ant-design | `e0ea7bb76fdf2a8871b5f3f0eea5e9fd0cd7f485` | MIT |
| spectrum | adobe/react-spectrum (S2) | `16eead67e83cf42f3c0ee46ef6eb7a2032778378` | Apache-2.0 |
| tw | tailwindlabs/tailwindcss (shadcn's `animate-*`) | `fa81d697fe572a10ac150d18964a093a7a874081` | MIT |
| lucide | lucide-icons/lucide (shadcn's spinner glyph) | `66d8f9fc394b8530377e5f6112f0b8908ba01280` | ISC |

Path prefixes used below: fluent `FS` = `packages/react-components/react-skeleton/library/src/components/`,
`FP` = `.../react-spinner/library/src/components/Spinner/`, `FL` = `.../react-slider/library/src/components/Slider/`,
`FT` = `packages/tokens/src/`; carbon `CS` = `packages/styles/scss/`; mui `M` = `packages/mui-material/src/`;
mantine `MT` = `packages/@mantine/core/src/components/`; chakra `CH` = `packages/react/src/theme/`;
spectrum `S2` = `packages/@react-spectrum/s2/src/`; radix `RT` = `packages/radix-ui-themes/src/`;
shadcn `SH` = `apps/v4/registry/new-york-v4/`.

---

## 1. Skeleton

Area today: one block, fill `bg-component` #f7f7f7, travelling highlight #eee
(`linear-gradient(90deg, transparent, #eee, transparent)`, 200% × 100%, 1.4s ease-in-out,
from 200% to −100%); text = `1em` tall, radius-small 6; circle, rectangle (0), rounded (12);
`aria-hidden`; animation and gradient removed under reduced motion and `motion="none"`
(display.css:145-178, 271-281).

### Systems × properties

| System | Shapes | Default size / radius | Text-line relation | Line gap | Fill (light) | Animation | Reduced motion | A11y | Source |
|---|---|---|---|---|---|---|---|---|---|
| **Untitled UI** | none — no skeleton component | — | — | — | — | — | — | — | grep of `components/`, `styles/` finds no skeleton/pulse |
| **shadcn** | one div; shape by class | size by class; `rounded-md` | none (demo uses `h-4`) | demo `space-y-2` = 8px | `bg-accent` = oklch(0.97 0 0) ≈ #f5f5f5 **arith** | **pulse**: `animate-pulse` = 2s cubic-bezier(0.4,0,0.6,1), opacity → 0.5 at 50% | not found (Tailwind utility has none) | none | `SH/ui/skeleton.tsx:7`; `SH/examples/skeleton-demo.tsx:6-9`; `apps/v4/app/globals.css:111-113`; tw `theme.css:440,457-460` |
| **Radix Themes** | block (empty) or wraps children/inline text | empty: height `space-3` 12px; radius `radius-1` 3px | inline form wraps real text, `line-height: 0`, Arial metrics, text transparent | — | gray-a3 ↔ gray-a4 (6% / 9% black **doc**) | **pulse** of background-color a3→a4, 1000ms, `alternate-reverse`, default easing | not found | `aria-hidden`, `tabIndex -1`, `inert` | `RT/components/skeleton.css:1-55`; `skeleton.tsx:32-36,46-48`; `styles/tokens/space.css:4`, `radius.css:2` |
| **Primer** | SkeletonBox, SkeletonText (lines), SkeletonAvatar (circle / square) | box `1rem` tall, radius-small 3px; avatar 50% | text height = font-size, `margin-block: leading/2` so the line box is kept; 8 text sizes | multiline: `margin-block-end: leading × 2` (14px at body-medium 14/1.5 **arith**); last line 65% max, 50px min | `skeletonLoader.bgColor` = neutral.8 #818B98 at **10%** alpha (dark 20%) | **shimmer via mask**: `linear-gradient(75deg, #000 30%, rgb(0 0 0/.65) 80%)`, mask-size 200%, mask-position 200%→0%, 1000ms, default easing | mask and animation only inside `(prefers-reduced-motion: no-preference)`; forced-colors 1px outline | none in component; `delay` prop 300/1000ms | `packages/react/src/Skeleton/SkeletonBox.module.css:1-30`; `SkeletonText/SkeletonText.module.css:1-24`; `SkeletonText.tsx:18-57`; `SkeletonBox.tsx:13-35`; `SkeletonAvatar.module.css:1-14`; primitives `src/tokens/component/skeletonLoader.json5:4,13-15,46`, `base/color/light/light.json5:158-163`, `functional/size/radius.json5:3-4` |
| **Fluent 2** | rectangle (default), square, circle | size 16 default (8…128 ladder); rectangle radius **4px**, width 100% | fixed px heights | not found (composed by consumer) | `colorNeutralStencil1` #e6e6e6; translucent: black 10% | **wave** default: `::after` gradient stencil1 → **stencil2 #fafafa (lighter)** → stencil1, translate −100%→100%, **3s ease-in-out**; pulse: opacity 1→0.4→1, 1s | duration 0.01ms, 1 iteration | container `role="progressbar"` `aria-busy="true"` | `FS/SkeletonItem/useSkeletonItemStyles.styles.ts:12-28,33-97,99-124,149-153`; `useSkeletonItem.tsx:30-33`; `FS/Skeleton/useSkeleton.ts:51-52`; `FT/alias/lightColor.ts:118-120` |
| **Carbon** | text, heading, placeholder, icon, circular | text 1rem, heading 1.5rem; placeholder 100×100; **square** (radius only behind v12 flag) | fixed rem | `$spacing-03` 8px | `skeleton-background` gray.10Hover (#e8e8e8 **doc**) | `::before` of `skeleton-element` gray.30 (#c6c6c6 **doc**) scales in from left / out to right, 3000ms ease-in-out | `animation: none` | none in mixin; forced-colors CanvasText/Canvas | `CS/utilities/_skeleton.scss:26-77,83-101`; `CS/utilities/_keyframes.scss:39-87`; `CS/components/skeleton-styles/_skeleton-styles.scss:36-48`; `packages/themes/src/dtcg/themes.json:1942-1961` |
| **MUI** | text (default), rectangular, rounded, circular | text 1.2em box scaled to 60% (→ 0.72em visible **arith**), radius 4 / 6.7 elliptical | keeps the line box (height auto + `transform: scale(1,.6)`) | not found | text.primary at **11%** alpha (≈ 9.6% black **arith**) | **pulse** default: opacity 1→0.4→1, 2s ease-in-out, 0.5s delay; wave: `action.hover` gradient, 2s linear, 0.5s delay | opt-in via `theme.motion.reducedMotion` ('system' / 'always'); otherwise none | none | `M/Skeleton/Skeleton.js:30-58,65,73,97-150,195-199,239,244`; `M/transitions/utils.ts:160-169`; `M/styles/reducedMotion.ts:7-22` |
| **Mantine** | one root; `circle` prop | radius default (sm 4px **doc**), width 100% | none | not found | gray-3 (#dee2e6 **doc**); dark-4 in dark | **pulse** (`skeleton-fade`) opacity 0.4↔1, 1500ms **linear** | not found | not found | `MT/Skeleton/Skeleton.module.css:1-50` |
| **Chakra v3** | one root; SkeletonCircle/SkeletonText wrappers | radius `l2` = 4px | not found | not found | `bg.emphasized` gray.200 #e4e4e7 | **pulse** default (opacity → 0.5, cubic-bezier(0.4,0,0.6,1), **1.2s**); `shine`: bg.muted→bg.emphasized, 400%, 5s ease-in-out | not found | not found | `CH/recipes/skeleton.ts:8-52`; `CH/tokens/animations.ts:6`; `keyframes.ts:9-11,31-34`; `semantic-tokens/colors.ts:11-16`; `tokens/colors.ts:36-37`; `semantic-tokens/radii.ts:5`; `tokens/radius.ts:7` |
| **Ant Design** | avatar (circle/square), title, paragraph lines, button, input, image, node | lines 16px (controlHeight/2), radius borderRadiusSM 4; `round` → pill | fixed | lines 8px (controlHeightXS); title→paragraph 24 (controlHeightSM) | colorFillContent → colorFill (6% → 15% black **doc**) | **shimmer**: `linear-gradient(90deg, from 25%, to 37%, from 63%)`, 400% × 100%, position 100%→0, **1.4s ease** | not found | image `aria-hidden` | `components/skeleton/style/index.ts:44-51,76-83,300-332,392-405,422-424`; `skeleton/Image.tsx:20` |
| **Spectrum 2** | wraps real components (Text, Image…); `SkeletonCollection` | radius `sm` | real text made transparent with `box-decoration-break: clone`, so each line box becomes a bar | the text's own line height | gray-100 → **gray-25 (lighter)** → gray-100 (dark: gray-300 highlight) | shimmer, 300% bg, position 100%→0%, **2000ms ease-in-out**, Web Animations with `startTime = 0` so every skeleton on the page is in phase | no animation when reduced | content `inert` | `S2/Skeleton.tsx:30-60,90-96,100-135,167` |
| **Material 3 / web** | not found (no skeleton in material-web) | — | — | — | — | — | — | — | — |

### Target products (all unverified; for a later capture during a load)

- ChatGPT: sidebar history list and the GPTs/Library pages while loading; image-generation
  placeholder card in a conversation.
- Notion: database views (table/board rows) and the sidebar tree on a cold page load; the
  AI "thinking" text shimmer.
- Figma: file-browser thumbnails and Community cards while images load.

### Differences from Area

1. **Fill is the lightest of every system.** Area #f7f7f7 (3% black equivalent). The field:
   shadcn ≈ #f5f5f5, Primer #818B98 @ 10%, Radix 6–9% black, antd 6% black, Carbon
   #e8e8e8, Fluent #e6e6e6, Chakra #e4e4e7, Mantine #dee2e6, MUI ≈ 9.6% black. Closest peers
   are shadcn and Primer; a step to ≈ #f0–#f2 would still sit at the light end. (shadcn
   skeleton.tsx:7; Primer skeletonLoader.json5:4,46; Radix skeleton.css:48-55; antd style
   index.ts:392-395; Fluent lightColor.ts:118.)
2. **Highlight direction is split.** Area darkens (#eee on #f7). Fluent (#fafafa on #e6e6e6)
   and Spectrum (gray-25 on gray-100) sweep a *lighter* band; antd, Carbon, Radix go darker.
   On a fill as light as Area's, a lighter sweep has little room; a darker one is consistent
   with antd. No change forced, but record the choice. (Fluent :57-61; S2 Skeleton.tsx:91.)
3. **Pulse vs travel is split roughly evenly.** Pulse default: shadcn, Radix, MUI, Mantine,
   Chakra. Travelling default: Fluent, Primer, Carbon, antd, Spectrum. Area's rationale
   (travel = loading) is shared by the Microsoft/Adobe/GitHub/IBM systems. Keep.
4. **Speed.** Area 1.4s equals antd exactly; others 1s (Primer, Radix), 1.2–1.5s (Chakra,
   Mantine), 2s (shadcn, MUI, Spectrum), 3s (Fluent, Carbon). Within range.
5. **Phase sync across the page (new).** Spectrum starts every skeleton at `startTime = 0`,
   so all bars sweep together (S2 Skeleton.tsx:44-54); Primer does the same for spinners.
   Area's CSS animations start at mount, so staggered mounts sweep out of phase. A CSS-only
   equivalent: a fixed negative `animation-delay` computed from the page clock, or
   `background-attachment: fixed` for the gradient.
6. **Text line keeps no line box.** Area text = `1em` with no margin, so stacked lines lose
   the text's leading. Primer keeps it (`height: font-size; margin-block: leading/2`,
   SkeletonText.module.css:1-13), MUI keeps it (`height: auto; scale(1,.6)`,
   Skeleton.js:117-126), Spectrum and Radix wrap the real text. Consider a text variant
   that reserves the host line-height, so a skeleton paragraph has the same height as the
   paragraph it replaces.
7. **Line radius.** Area 6 on a 14px line. Most use 3–4 (Primer 3, Radix 3, Fluent 4,
   MUI 4, Mantine 4, Chakra 4, antd 4); Carbon square. Area's 6 comes from its radius axis,
   so this is a system choice, but on 12–14px bars it reads rounder than every peer.
8. **Last-line width / paragraph composition.** Primer shortens the last line (65% max,
   50px min, SkeletonText.module.css:19-23); antd's last line is 61%
   (skeleton/style/index.ts:331). Area has no text-lines composition.
9. **Show-delay.** Primer SkeletonBox `delay` 'short' 300ms / 'long' 1000ms
   (SkeletonBox.tsx:13-35) to avoid a flash on fast loads. Area has none.
10. **A11y / reduced motion.** Area already matches the stricter systems (aria-hidden like
    Radix; animation and gradient off like Primer/Carbon/Spectrum). Fluent instead marks the
    container `role="progressbar" aria-busy` (useSkeleton.ts:51-52); Radix/Spectrum also
    make wrapped content `inert` — relevant only if Area adds a wrap-children mode.

---

## 2. Spinner

Area today: sm 12 / md 16 / lg 24; conic arc 25% over a track, masked to a 2px ring at
every size, round caps by two 2px dots; arc `neutral-solid` (accent by tone), track
`bg-component-active` #eee (in a Button: arc currentColor, track currentColor 25%);
2s linear per turn; stops under reduced motion and `motion="none"`; `role="status"` +
`aria-label` only when labelled, otherwise `aria-hidden` (display.css:181-221, 271-281).

### Systems × properties

| System | Sizes px (default) | Stroke | Arc / track | Track colour | Speed & easing | Colour | Reduced motion | A11y | Source |
|---|---|---|---|---|---|---|---|---|---|
| **Untitled UI** | 32 / 48 / 56 / 64 (sm 32) | 4 on a 32 viewBox (1/8) | ≈ 28% arc **arith** (dash 25 of 2π·14), round cap; full track | `bg-tertiary` neutral-100 #f5f5f5 | Tailwind `animate-spin` 1s linear | `fg-brand-primary` brand-600 | not found | not found (decorative, optional label) | `components/application/loading-indicator/loading-indicator.tsx:5-26,100-113`; `styles/theme.css:319,333` |
| Untitled in Button | 20 | 2 on 20 viewBox | 12.5/50.3 ≈ 25% **arith**, round cap | currentColor at **30%** opacity | 1s linear | currentColor | not found | Button `isLoading` | `components/base/buttons/button.tsx:209-220` |
| **shadcn** | 16 (`size-4`) | 2 on 24 viewBox → 1.33px **arith** | lucide `loader-circle`: ≈ 80% arc **arith**, round cap, **no track** | — | `animate-spin` 1s linear | currentColor | not found | `role="status"`, `aria-label="Loading"` by default | `SH/ui/spinner.tsx:4-12`; lucide `icons/loader-circle.svg`; tw `theme.css:438,443-446` |
| **Radix Themes** | 12 / 16 / 20 (2 → 16) | 8 leaves, 12.5% wide × 30% long, radius-1 | leaf spinner (no ring) | leaves fade 1 → 0.25 | 800ms linear per cycle | currentColor at **0.65** opacity | not found | none on spinner (Button wraps with hidden content) | `RT/components/spinner.css:1-93`; `spinner.tsx:27-55`; `spinner.props.tsx:6` |
| **Primer** | 16 / 32 / 64 (medium 32) | **2px at every size** (`vector-effect: non-scaling-stroke`) | quarter arc (path M15 8 a7 7 → 8 1) = 25%, round cap; full track | currentColor at **25%** | 1000ms linear; all spinners phase-synced to `performance.now()` | currentColor | rotation kept (only the sync delay is skipped) | svg `aria-hidden`; `VisuallyHidden` srText default **"Loading"**; `delay` prop 300/1000ms | `packages/react/src/Spinner/Spinner.tsx:10-16,31-118`; `Spinner.module.css:5-13` |
| **Fluent 2** | 16, 20, 24, 28, 32, 36, 40, 44 (medium 32) | 2px (16–28), 3px (32–40), 4px (44) | tail grows 30°→255° and back (two 135° segments behind a 105° mask); full track | `colorBrandStroke2Contrast` #c7e0f4 | 1.5s linear spin + 1.5s `curveEasyEase` tail | `colorBrandStroke1` #0078d4 (inverted appearance available) | **keeps rotating at 1.8s**; tail frozen as a gradient arc | `role="progressbar"`, label slot → `aria-labelledby`; `delay` prop | `FP/useSpinnerStyles.styles.ts:39-69,75-121,123-185`; `FP/useSpinner.tsx:20,48-93`; `FT/global/strokeWidths.ts:5-7`; `FT/global/curves.ts:11`; `FT/alias/lightColor.ts:166,170` |
| **Carbon** | small 16, default 88 (5.5rem) | 16 on 100 viewBox (2.56px **arith**) small; 10 (8.8px) large | 48% arc small, 81% large, butt caps; track on small only | `$layer-accent` | 690ms linear | `$interactive` (blue) | rotation kept; only the stroke init animation off | svg `role="img"` + `<title>` (default "loading"); `aria-live` assertive when active | `CS/components/loading/_vars.scss:11-21`; `_loading.scss:25-76`; `_animation.scss:11-28`; `packages/react/src/components/Loading/Loading.tsx:192,213-234` |
| **MUI** | 40 | 3.6 on 44 viewBox (3.27px at 40 **arith**) | indeterminate dash grows 1→100 of 200 and back; butt; optional track (`enableTrackSlot`) | currentColor at `activatedOpacity` (0.12 **doc**) | 1.4s linear rotate + 1.4s ease-in-out dash | `primary` | opt-in via theme `reducedMotion` | `role="progressbar"`; docs: `aria-busy` on region | `M/CircularProgress/CircularProgress.js:15,25-48,58,65,205-213,227-234,274,304` |
| **Material 3 (web)** | 48 (v0_192) / 40 (latest) | 4px active indicator | expand/contract arc, 1333ms arc, 4×arc cycle; latest adds a track with 4px gap | not found (latest track colour) | linear rotate 1333×360/306 ms; arc eased | `primary` | not found | not found | mweb `tokens/versions/v0_192/_md-comp-circular-progress-indicator.scss:28-39`; `latest/sass/_md-comp-progress-indicator-circular.scss:24-43`; `progress/internal/_circular-progress.scss:36-47,116-123` |
| **Mantine** | 18 / 22 / 36 / 44 / 58 (md 36) | `size / 8` (4.5px at 36 **arith**) | oval: 3 of 4 border sides = 75%, no track | transparent | 1.2s linear | `primary-color-filled` | not found | not found | `MT/Loader/Loader.module.css:1-9,98-113`; `Loader.tsx:63` |
| **Chakra v3** | 12 / 16 / 20 / 32 / 40 (md 20); `inherit` = 1em | 2px border at every size | 2 of 4 sides coloured = 50% | `--spinner-track-color` transparent by default | `spin` 1s linear overridden by `slowest` = **500ms** | currentColor | not found | not found | `CH/recipes/spinner.ts:5-31`; `CH/tokens/durations.ts:10`; `animations.ts:4` |
| **Ant Design** | dot holder 14 / 20 / 32 (default 20) | 4 dots, not a ring | — | dots at 0.3 → 1 | 1.2s linear rotate (to 405°); dots 1s | `colorPrimary` | not found | wrapper `aria-live="polite"`, `aria-busy` | `components/spin/style/index.ts:36-41,190-215,292-295`; `spin/index.tsx:264-265` |
| **Spectrum 2** (ProgressCircle) | 16 / 32 / 64 (M 32) | 2 / 3 / 4px | dash 25%→80% of the ring, round cap; full track | `gray-300` | 1s cubic-bezier(.6,.1,.3,.9) rotate + 1s dash | `blue-900` (accent); `staticColor` overlay variants | not found | `role="progressbar"` (RAC ProgressBar) | `S2/ProgressCircle.tsx:53-120,140-158,171-222` |

### Target products (unverified)

- ChatGPT: attachment chip in the composer while a file uploads (ring around the file
  icon); the send button's stop/loading state; "Searching…" rows.
- Notion: page-load and "Loading…" in database views, import and export dialogs,
  sync indicator in the sidebar.
- Figma: file-open loading screen, Export panel while rendering, plugin "running" toast.

### Differences from Area

1. **Area's 2s per turn is the slowest in the set, by 2×.** 1s: Untitled, shadcn, Primer,
   Spectrum. 1.2–1.5s: Mantine, antd, MUI, Fluent. Under 1s: Radix 0.8, Carbon 0.69,
   Chakra 0.5. A 2s quarter-arc reads as sluggish or stalled beside every reference.
   (uui loading-indicator.tsx:100; Primer Spinner.tsx:10; Fluent :58; S2 :214.)
2. **Primer is the nearest match and suggests one rule for the track.** Primer: quarter
   arc, 2px non-scaling stroke at every size, track = currentColor 25%, arc currentColor,
   1s linear (Spinner.tsx:83-98). Area already uses exactly this in a Button but a fixed
   #eee track elsewhere. Adopting currentColor-at-25% everywhere (arc = the host ink or the
   tone) removes the special case and keeps the ring visible on any ground. Untitled's
   button spinner uses 30% (button.tsx:209).
3. **Default ink.** Ink-following systems (Primer, shadcn, Chakra, Radix) use
   currentColor; brand systems use accent. Area's `neutral-solid` default matches the owner
   rule; `currentColor` would satisfy it too while also working in any host.
4. **Reduced motion: most references keep turning.** Fluent slows to 1.8s and freezes the
   tail (useSpinnerStyles.styles.ts:66-68,114-120); Carbon and Primer keep rotating.
   Only Area stops dead. A still quarter-arc can read as a frozen UI; consider a slower
   rotation (Fluent) instead of none for the reduced-motion preference, keeping `none` for
   `motion="none"`. Note: not found in Untitled, shadcn, Radix, Mantine, Chakra, antd, S2.
5. **Default accessible name.** shadcn (`aria-label="Loading"`), Primer (srText "Loading"),
   Carbon ("loading") announce by default; Area is `aria-hidden` unless `label` is passed.
   Roles differ: `status` (shadcn, Area), `progressbar` (Fluent, MUI, Spectrum).
6. **Show-delay.** Primer and Fluent have a `delay` prop (Primer 300/1000ms). Area none.
7. **Sizes.** Area 12/16/24 matches the icon-slot scale of Radix (12/16/20) and Chakra's
   small end (12/16/20). Standalone indicators elsewhere start at 32 (Untitled, Primer
   medium, Fluent medium, Spectrum M). If Area wants a page-level spinner, a 32 size is the
   common default. Stroke: Fluent and Spectrum thicken to 3px at 32; Primer and Chakra stay
   at 2.
8. **Phase sync.** Primer aligns every spinner to the same clock (Spinner.tsx:107-118),
   so two spinners on screen turn together.

---

## 3. Code (inline)

Area today: `code.area-code`, inline, 0.875em of the host, line-height 1.35, 400
Geist Mono, fg-default; 1px border `border-decorative` #f3f3f3 + padding 2 × 5 (inset
3 × 6 incl. border); radius min(6, cap); fill `bg-code` #fafafa; `box-decoration-break:
clone`; `margin-inline: 2px` (code.css:139-178).

### Systems × properties

| System | Size vs body | Padding (block × inline) | Radius | Fill | Border | Colour | Weight | Family / leading | Source |
|---|---|---|---|---|---|---|---|---|---|
| **Untitled UI** (prose) | 14px fixed (`0.875rem`), 20px leading | 2 × 6 (margin-block −2) | 6 | `bg-secondary` neutral-50 #fafafa | 1px `border-secondary` neutral-200 #e5e5e5 as outer `box-shadow` ring | `--tw-prose-code` = text-tertiary neutral-600 defined; applied colour not pinned | **700** | not set in block (inherits prose font) | `styles/typography.css:13,234-250`; `theme.css:302,350` |
| **shadcn** (typography example) | `text-sm` 14px fixed | 0.2rem × 0.3rem (3.2 × 4.8px) | `rounded` (0.25rem 4px, Tailwind default **doc**) | `bg-muted` oklch(0.97) ≈ #f5f5f5 | none | inherit | **600** | `font-mono` | `SH/examples/typography-inline-code.tsx:3`; `apps/v4/app/globals.css:111` |
| **Radix Themes** (`Code`, soft default) | 0.95 × 0.95 = **0.9025em** | 0.1em × 0.25em | (0.5px + 0.2em) × radius-factor | `accent-a3` (tinted by accent) | none (outline variant: inset max(1px, .033em) accent-a8) | `accent-a11` | inherit | Menlo stack; line-height 1.25; letter-spacing −0.007em | `RT/components/code.css:4-26,146-162,167-172`; `RT/styles/tokens/typography.css:71-80` |
| **Primer** (markdown) | **85%** | 0.2em × 0.4em | `$border-radius` 6px **doc** | `bgColor-neutral-muted` = #818B98 @ **12%** | none | inherit | inherit | mono stack; `white-space: break-spaces` | primercss `src/markdown/code.scss:4-17`; primitives `functional/color/bgColor.json5:212-230` |
| **Fluent 2** | not found (no inline code component) | | | | | | | | — |
| **Carbon** (CodeSnippet inline) | `code-01` 12px fixed | 0 × 8 on the inner code; button 20px tall | **4** | `$layer` | none | `$text-primary` | 400 **doc** | IBM Plex Mono | `CS/components/code-snippet/_code-snippet.scss:77,81-90,145-146,312-313` |
| **MUI / Material** | not found (no inline code component) | | | | | | | | — |
| **Mantine** (`Code`) | `font-size-xs` 12px fixed | 2 × 5 (spacing-xs/2) | radius-sm 4 **doc** | gray-0 (#f8f9fa **doc**); dark-6 | none | inherit | inherit | monospace; theme line-height | `MT/Code/Code.module.css:1-21` |
| **Chakra v3** (`Code` = badge recipe) | size sm → `textStyle xs` 12px fixed | 0 × 6 (px 1.5), min-height 20 | `l2` 4 | `colorPalette.subtle` (gray.100 #f4f4f5) | none (outline variant: inset 1px) | `colorPalette.fg` | not set | `mono`; `inline-flex` (does not wrap) | `CH/recipes/code.ts:6-16`; `CH/recipes/badge.ts:21-24,48-52,65-68` |
| **Ant Design** (Typography `code`) | **85%** | 0.2em/0.1em × 0.4em; margin 0 0.2em | **3** | rgba(150,150,150,0.1) | 1px rgba(100,100,100,0.2) | inherit | inherit | `fontFamilyCode` | `components/typography/style/mixins.ts:89-99` |
| **Spectrum 2** | not found (no inline code in S2 src) | | | | | | | | — |

### Target products (unverified)

- ChatGPT: assistant messages rendered from markdown — inline `code` in any answer that
  names a command (needs a conversation opened read-only; do not send messages).
- Notion: the inline-code text mark in a page (the owner's existing page with code, or a
  public Notion page); known to be a red-ish ink on a warm grey fill — unverified.
- Figma: Dev Mode inspect values and comment threads that contain backticks; the editor
  chrome itself shows none (spec's second pass agrees).

### Differences from Area

1. **Border: only Untitled and antd draw one.** Every other system is fill-only
   (shadcn, Radix soft, Primer, Mantine, Chakra, Carbon). Untitled's ring is #e5e5e5
   (darker than Area's #f3f3f3); antd's is 20% grey. Area is between: a border so light it
   is almost a fill edge. Either keep (Untitled-aligned) or drop it and darken the fill a
   step. (uui typography.css:243; antd mixins.ts:97.)
2. **Fill is at the lightest end.** Area #fafafa = Untitled. Others: Mantine #f8f9fa,
   Chakra #f4f4f5, shadcn ≈ #f5f5f5, Carbon $layer, Primer #818B98 @ 12%, antd grey 10%.
   Without a border, #fafafa would not read on white; with Area's faint border it does.
3. **Relative size.** Area 0.875em sits between Primer/antd 85% and Radix 0.9025em. Four
   systems use a fixed px instead (Untitled 14, shadcn 14, Mantine/Chakra/Carbon 12). Keep.
4. **Padding in em.** Primer and antd use 0.2em × 0.4em, Radix 0.1em × 0.25em — they scale
   with the host. Area's 2 × 5 px (+1 border) is right at 14px (≈ 0.14em × 0.43em) but does
   not scale with the 0.875em type in a heading. Consider em-based padding if Code is used
   in headings.
5. **Weight.** Area 400. Untitled 700 and shadcn 600 bolden inline code; Radix, Primer,
   Mantine, antd inherit. Area's 400 matches the inheriting majority.
6. **Radius.** Area 6 = Untitled and Primer; others 3–4 (antd 3, Chakra/Mantine/Carbon/
   shadcn 4) or em-relative (Radix ≈ 3.3px at 14px **arith**).
7. **Leading.** Area 1.35; Radix 1.25; Untitled 20px at 14px (1.43). Fine.
8. **Colour.** Radix tints both fill and ink with the accent (accent-a3 / a11) — an accent
   variant Area lacks; Area's `on-color` handles coloured grounds instead.

---

## 4. Slider

Area today: native `input[type=range]`; row height 28/32/40; rail 4px, radius-full,
colour `fill-toggle` mixed 20% to surface ≈ #ddd; fill `neutral-solid` (accent by tone);
thumb 16/16/20, round, 1px `border-hover`-35% ring, surface with a centred fill dot
(`radial-gradient(circle, fill 0 42%, surface 46%)`), `shadow-1`; hover darkens fill and
dot only; focus-visible: thumb border + 2px outline in focus colour; disabled 50%;
marks 1 × (rail + 6) ticks behind the rail; readout 14/20 muted tabular, `aria-hidden`
(slider.css:19-80, 200-320).

### Systems × properties

| System | Track | Rail colour | Fill | Thumb | Hover / focus / active | Ticks | Value label | Sizes | Disabled | Keyboard | Source |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Untitled UI** | **8px**, round; 24px hit area | `bg-quaternary` neutral-200 #e5e5e5 | `bg-brand-solid` brand-600 | **24px** white, 2px inset brand-600 ring, `shadow-md` | focus-visible 2px outline, offset 2; no hover | none | `default` hidden; `bottom` below; `top-floating` tooltip (radius 8, 12px 600, shadow-lg) | one | none | React Aria | `components/base/slider/slider.tsx:13-18,35-66`; `theme.css:340,351,377-378` |
| **shadcn** | **6px** (`h-1.5`), round | `bg-muted` ≈ #f5f5f5 | `bg-primary` | 16px white, 1px `border-primary`, `shadow-sm` | hover **and** focus-visible: `ring-4` ring/50 halo | none | none | one | 50% | Radix primitive | `SH/ui/slider.tsx:33,41,47,55` |
| **Radix Themes** | 6 / 8 / 10 (size 2 = 8) | surface: gray-a3 + inset 1px gray-a5 | `accent-track` | track + 4 then overshoots by track/4 each side → 13 / 16 / 19 **arith**; white; `0 0 0 1px black-a4` (surface) | no hover; focus: +3px accent-3 and 5px focus-8 rings | none | none | 1–3 | range cleared, thumb gray-1 with gray-6 ring, multiply blend | Radix primitive | `RT/components/slider.css:1-98,106-118,128-152,257-273` |
| **Primer** | not found (no slider in primer/react) | | | | | | | | | | — |
| **Fluent 2** | small **2**, medium **4**; min-height 24 / 32 | `colorNeutralStrokeAccessible` **#616161** | `colorCompoundBrandBackground` #0078d4 | small 16 / medium 20; brand dot with inset white ring 20% of the thumb (dot ≈ 60%), 1px (5%) `colorNeutralStroke1` #d1d1d1 edge | hover / active: thumb **and** fill darken (Hover, Pressed); focus-within outline on root | 1px notches cut into the rail in background colour | none | small, medium | thumb and fill `ForegroundDisabled`, rail `BackgroundDisabled` | native input | `FL/useSliderStyles.styles.ts:44-56,72-103,106-114,120-162,188-218`; `FT/alias/lightColor.ts:67,128,146,150` |
| **Carbon** | **2px** | `$border-subtle` | `$layer-selected-inverse`; `$border-interactive` while focused | 14px solid; hover / focus / active **scale to 20** (×1.4286) | focus: blue fill, inset 2px interactive + 3px layer ring | none | number input beside | one | thumb `$border-disabled` | native keys + Shift = (max−min)/`stepMultiplier` 4 | `CS/components/slider/_slider.scss:59-95,187-221,333-336,381-406`; `packages/react/src/components/Slider/Slider.tsx:377,788-790` |
| **MUI** | **4** (small 2), 26px hit (13 pad) | fill colour at **0.38** opacity | `primary` | **20** (small 12), solid, `shadows[2]` | hover / focus-visible: 8px halo @16%; active: 14px halo | 2 × 2 dots, currentColor | `valueLabelDisplay` tooltip | small, medium | not pinned | `shiftStep` 10 | `M/Slider/Slider.js:76-90,135,246-249,267,274-275,290-293,319-333,459-462,586` |
| **Material 3 web** (v0_192) | active / inactive **4** | not pinned | `primary` | 20 round, elevation level1; state layer 40 | hover state-layer opacity | 2px tick marks | 28px label | one | not pinned | native | mweb `tokens/versions/v0_192/_md-comp-slider.scss:37-115` |
| Material 3 (latest, Expressive) | **16px** track | | | **4 × 44 bar** handle (2 when pressed / focused) | | 4px stop indicator | | | | | mweb `tokens/versions/latest/sass/_md-comp-slider.scss:29-83` |
| **Mantine** | xs–xl 4 / 6 / **8** / 10 / 12 (md 8), root 2× track tall | gray-2 (#e9ecef **doc**) | `primary-color-filled` | 2× track (md **16**), white with **4px** colour border | drag: scale 1.05 + `shadow-sm`; label tooltip on hover | 8px ring dots (2px border) | tooltip (gray-9, 12px, radius-sm) on hover/drag | xs–xl | thumb hidden | built-in | `MT/Slider/Slider.module.css:2-11,15,24,41-56,64-111,152-171,232-241`; `Slider/Slider.tsx:160-161` |
| **Chakra v3** | sm 6 / md 8 / lg 10 | outline: `bg.emphasized/72` + inset shadow | `colorPalette.solid` | sm 16 / md **20** / lg 24; white, **2px** colour border | focus-visible: 3px ring colorPalette.focusRing/50 | marker dots 4 / 4 / 6 | marker labels (xs, fg.muted) | sm, md, lg | range + thumb `border.emphasized` | Ark UI | `CH/recipes/slider.ts:30-76,78-104,106-121,198-202` |
| **Ant Design** | **4** | `colorFillTertiary`; **hover `colorFillSecondary` (rail darkens)** | `colorPrimaryBorder`; hover `…BorderHover` | **10** + 2px ring (14 outer); hover **12** + 2.5px ring | active colour `colorPrimary`, 0.2-alpha outline | 8px dots, `colorBorderSecondary` | tooltip | one | `colorBgContainerDisabled` track, disabled thumb colour | rc-slider | `components/slider/style/index.ts:471-503` |
| **Spectrum 2** | thin **4** (radius lg) / thick 16 (radius sm) | `gray-300` | **`gray-700` (neutral) by default; `accent-900` when `isEmphasized`** | S/M/L/XL **18 / 20 / 22 / 24**, `gray-25` with **2px `gray-800`** border; precise style 6 × 20–26 | hover / drag: border `gray-900`; press scale; focus ring | not found | output field beside label, `maxLabelLength` ch | S, M, L, XL | `disabled` tokens | React Aria | `S2/Slider.tsx:225-282,284-330,331-350,436,493-495` |

### Target products (unverified)

- ChatGPT: image edit / canvas brush-size slider; voice-mode settings. None in the chrome
  the spec already searched.
- Notion: none known in standard pages; Notion Calendar settings possibly.
- Figma: image-fill **Adjust** panel (exposure, contrast, saturation, temperature, tint,
  highlights, shadows) — value sliders with a readout; prototype animation duration;
  already-captured colour-picker channel sliders.

### Differences from Area

1. **Neutral fill has precedent.** Spectrum 2 fills the track `gray-700` with a white thumb
   and a 2px `gray-800` border, switching to accent only with `isEmphasized`
   (S2 Slider.tsx:270-282,331-340) — the same "neutral by default, accent by override" rule
   the owner set. Worth citing in the spec as the design-system basis.
2. **Correction to the spec's hover note.** The spec says "no source" darkens the rail on
   hover. antd does: `railHoverBg: colorFillSecondary` and `trackHoverBg`
   (slider/style/index.ts:489-492). Fluent darkens thumb and fill only (as Area now does);
   Radix none; Spectrum darkens the thumb border; MUI and shadcn add a halo; Carbon scales
   the thumb 14→20. Area's current rule stands; fix the sentence.
3. **Thumb construction closest to Fluent.** Area's centred dot is 42% of the gradient ray,
   ≈ 59% of the thumb box (**arith**, farthest-corner ray = r√2; unverified on screen).
   Fluent's dot is 60% (20% white ring each side) with a 1px #d1d1d1 edge
   (useSliderStyles.styles.ts:205-216) — nearly identical. Record Fluent as the basis.
4. **Thumb size ladder.** Area 16/16/20. Peers at md: Fluent 20, MUI 20, Chakra 20,
   Spectrum 20, Material 20; 16 in shadcn, Radix, Mantine; Untitled 24. Area's md 16 is at
   the small end; sm 16 = Fluent small, Chakra sm.
5. **Rail thickness 4 is the majority** (Fluent md, MUI, Material 3 baseline, antd,
   Spectrum thin, Mantine xs). Untitled 8, Radix/Chakra 6–10, Mantine md 8 are thicker;
   Carbon 2. Keep.
6. **Rail colour.** Area ≈ #ddd vs Untitled #e5e5e5, Mantine #e9ecef, shadcn ≈ #f5f5f5,
   antd ~4% black; Fluent uses a *dark* accessible stroke (#616161) for 3:1 contrast of the
   rail itself. Area's #ddd is mid-field.
7. **Hover / press affordance.** Area has none on the thumb itself besides the dot colour.
   Four systems give the thumb a visible hover/press change: shadcn ring-4 halo, MUI 8/14px
   halo, Carbon scale ×1.43, antd 10→12 grow, Spectrum press-scale, Mantine drag scale
   1.05 + shadow. Consider a small press/drag cue (scale or shadow step).
8. **Focus.** Area: 2px outline around the thumb. Radix: two box-shadow rings (3px accent-3
   + 5px focus-8); shadcn: 4px ring at 50%; Untitled: 2px outline, 2px offset (same as
   Area); Fluent: outline on the whole root. Area matches Untitled.
9. **Value display.** Tooltips on hover/drag are common (Untitled `top-floating`, MUI,
   Mantine default, antd default). Area's inline/top readout matches Spectrum's output
   beside the label and Carbon's input. A floating-value option is the missing variant.
10. **Ticks.** Area: 1px ticks crossing the rail. Fluent: 1px notches cut into the rail in
    background colour (useSliderStyles.styles.ts:140-160); MUI/Material: 2px dots; antd,
    Mantine: 8px ring dots; Chakra 4–6px dots; M3 Expressive: 4px stop indicator. Area's
    open question (notches) has Fluent as its only source.
11. **Big step on the keyboard.** Native range gives arrows, PageUp/Down and Home/End, but
    no Shift+arrow. Carbon: Shift = range/4 (Slider.tsx:377); MUI `shiftStep` 10
    (Slider.js:586). Area has no large-step modifier.
12. **Disabled.** Area 50% (shadcn 50%). Others repaint with disabled tokens (Fluent,
    Spectrum, Chakra, Carbon, Radix); Mantine hides the thumb. Area's opacity rule is
    shadcn- and Untitled-family consistent.
