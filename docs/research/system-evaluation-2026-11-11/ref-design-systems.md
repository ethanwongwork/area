# Reference design systems: fine detail in numbers and rules (RD), 2026-11-11

Owner's evaluation brief (docs/research/system-evaluation-2026-11-11, common brief): one level below
`system-gaps-2026-11-06` (which compared ten systems on foundations and process). This file compares the **numbers and
the written rules** fifteen systems publish for control geometry, space, type, radius, strokes, elevation, state paint,
optical correction, colour, motion, customisation and component pages, and sets Area beside each.

## 1. Scope and method

**Primary sources only.** Token and component source was read at a pinned commit with `gh api` (raw contents); docs
pages were read with WebFetch where no source is public. Every value below is quoted from those files; nothing is read
off a screenshot. Pinned commits:

| System | Source read | Commit / version |
|---|---|---|
| Radix Themes | `packages/radix-ui-themes/src/styles/tokens/{space,radius,scaling,typography,shadow}.css`, `components/_internal/{base-button,base-menu}.css`, `button.css`, `icon-button.css`, `text-field.css`, `theme.props.tsx` | radix-ui/themes@1faff10a |
| Radix Colors | radix-ui.com/colors/docs/palette-composition/understanding-the-scale | docs, 2026-11-11 |
| Primer | primitives `src/tokens/functional/size/{size,radius,border}.json5`, `functional/shadow/shadow.json5`, `base/typography/typography.json5`, `functional/color/fgColor.json5`; react `Button/ButtonBase.module.css`, `ActionList/ActionList.module.css`, `postcss-preset-primer/src/mixins/focusOutline*.css` | primer/primitives@47736486, primer/react@b1b278ad |
| Spectrum 2 | `packages/tokens/src/{layout,layout-component,typography,color-aliases,button,menu}.json` | adobe/spectrum-design-data@6136cd76 (spectrum-tokens is now a docs site only) |
| Polaris | `polaris-tokens/src/themes/base/{shadow,border,space,text,font,color,motion}.ts`, `src/colors.ts` | Shopify/polaris@3f7954ae |
| Carbon | `packages/styles/scss/components/button/{_vars,_mixins}.scss`, `utilities/_focus-outline.scss`, `packages/type/src/styles.ts`, `packages/motion/src/{tokens,surfaces}.ts`, `motion/tokens/motion.tokens.json` | carbon-design-system/carbon@80f17733 |
| Fluent 2 | `packages/tokens/src/global/{borderRadius,spacings,durations,curves,fonts}.ts`, `react-button/.../useButtonStyles.styles.ts`, `react-tabster/src/focus/createFocusOutlineStyle.ts` | microsoft/fluentui@a67298bc |
| Material 3 (+ Expressive) | material-web `tokens/versions/latest/sass/{_md-sys-shape,_md-sys-state,_md-sys-motion,_md-comp-button}.scss` (M3 token set 34.0.21); material-color-utilities `typescript/dynamiccolor/{dynamic_scheme,variant}.ts` | material-web@37aa14b8, MCU@194144d7 |
| Apple HIG | developer.apple.com/tutorials/data/design/human-interface-guidelines/{typography,buttons,layout}.json; SwiftUI `ConcentricRectangle`, `concentric(minimum:)` docs | docs, 2026-11-11 |
| Atlassian | atlassian.design/foundations/{spacing,elevation,radius}; `@atlaskit/tokens@20.11.0` `dist/esm/artifacts/themes/atlassian-{light,dark}.js` (unpkg) | 20.11.0 |
| Linear | linear.app/now/how-we-redesigned-the-linear-ui; linear.app/now/behind-the-latest-design-refresh | posts |
| shadcn/ui (on Radix and Base UI) | `apps/v4/registry/new-york-v4/ui/{button,dropdown-menu}.tsx`, `apps/v4/registry/styles/style-{vega,nova,lyra,mira}.css` | shadcn-ui/ui@dd41d19e |
| Untitled UI | `components/base/buttons/button.tsx`, `styles/theme.css` | untitleduico/react@207c26b4 |
| Ant Design 5 | `components/theme/themes/{seed,default/colors}.ts`, `shared/{genControlHeight,genRadius,genFontSizes,genSizeMapToken}.ts`, `theme/util/alias.ts` | ant-design/ant-design@0572a24a |
| Stripe | docs.stripe.com/elements/appearance-api (Payment Intents variant); stripe.com/blog/accessible-color-systems | docs, posts |
| Vercel Geist | vercel.com/geist/{button,colors,typography} | docs |

**Area** was read from source in this worktree: `packages/tokens/src/emit/base.ts`, `axes/{type-size,density,radius,
motion,easing,elevation,depth,states,pills,registry}.ts`, `color/layers.ts`, `packages/tokens/dist/css/*.css` (for
resolved literals), `packages/styles/src/inset.css`, `components/{button,chip,number-field,timestamp,navigation}.css`,
`docs/DESIGN_SYSTEM.md`, `docs/THEMING.md`, `docs/WRITING.md`, `docs/CONTRAST.md`, and the Documentation entries in
`apps/desktop/src/content/documentation/*.mjs`. Area's live `oklch()` inks were converted with the sRGB transfer function
from the OKLab lightness anchors in `color/layers.ts:201–202`.

**Could not verify.** Geist publishes no pixel values on its pages (button, typography and colour pages name classes
and steps only); Geist numbers are therefore absent, not guessed. Apple's HIG pages fetched carry no concentricity text
and no macOS control heights; the concentric rule is cited from SwiftUI's API docs. Atlassian's motion tokens and
Carbon's v11 theme literals are build artefacts not in the repos read; they are left out. Nothing was checked in a
running app (this is a source comparison; the Area Electron belongs to another session).

## 2. Topic by topic

Area columns quote the defaults (type 13, Default density 32, Corner 10, Elevation 8) unless a row says otherwise. "App"
means the desktop app's own scale, type 13 at Compact (AGENTS.md).

### 2.1 Control heights, padding formula, icon corrections, min widths

| System | Heights by size (px) | Side padding by size | Icon side | Icon-only | Gap icon–label | Min width | Rule as written |
|---|---|---|---|---|---|---|---|
| Primer | xs 24, sm 28, md 32, lg 40, xl 48 (`size.json5` control.*.size) | condensed / normal / spacious: sm 8/12/16, md 8/12/16, lg 8/12/16 (xs 4/8/12); paddingBlock 2/4/6/10/14 | none (a `[data-kbd-chord]` end takes 6, `ButtonBase.module.css:28`) | square, `padding: unset` | 4 / 4 / 8 / 8 / 8 | `min-width: max-content` | "Match control size to context … Use minTarget values" (fine 16, coarse 44) |
| Radix Themes | 1: 24, 2: 32, 3: 40, 4: 48 (`--space-5…8`, `base-button.css:42–60`) | 8 / 12 / 16 / 24 (`button.css`) | none | square = height | 4 / 8 / 12 / 12 | none | all × `--scaling` 0.9–1.1 |
| Spectrum 2 (desktop / mobile) | 50: 20/26, 75: 24/30, 100: 32/40, 200: 40/50, 300: 48/60 (`component-height-*`) | edge-to-text 8 / 9 / 12 / 15 / 18 | edge-to-visual 6 / 7 / 10 / 13 / 15 (text − 2 to 3) | edge-to-visual-only 3 / 4 / 6 / 9 / 11 | text-to-visual 5 / 5 / 6 / 7 / 8 | `button-minimum-width-multiplier` 2.25 × height | pill: edge-to-text 12 / 16 / 20 / 24, edge-to-visual 10 / 14 / 18 / 21; top-to-text 6 and bottom-to-text 9 at 100 (text placed on cap and baseline, not the box) |
| Fluent 2 | small 24, medium 32, large 40 (`useButtonStyles.styles.ts:17–20, 291–318`) | 8 / 12 / 16 | none; block padding 3→1, 8→7 with an icon (`buttonSpacingSmallWithIcon`) | square | 6 (`spacingHorizontalSNudge`) | 64 small, 96 medium and large | padding is line + 2 × block |
| Carbon | xs 24, sm 32, md 40, lg 48, xl 64, 2xl 80 | start: density − 1; **end: density × 3 + 16 − 1** (`_mixins.scss:65–69`), 15 / 63 at md | icon pinned in the end room | square | — | `max-inline-size: 320px`; legacy min 176 (`_vars.scss:89`) | `padding-block: (height − 1lh) / 2 − 1px` (`_mixins.scss:61`) |
| Material 3 | default 40; Expressive xs 32, s 40, m 56, l 96, xl 136 | 24 (`_md-comp-button.scss` leading/trailing-space) | 16 leading with icon (Expressive) | square | 8 | — | pill at rest; **press morphs the corner** to `corner-small` 8 (`pressed-container-shape`) |
| Apple | iOS/visionOS hit 44 × 44 (60 visionOS); visionOS mini 28, small 32, regular 44, large 52, xl 64 | not stated | — | circle | — | — | "Use the same size for buttons offering equal choices" |
| Atlassian | 32 default, 24 compact (docs) | medium space tokens (12–24) for buttons | — | — | small tokens | — | "Small (0–8) for compact pieces … medium (12–24) for buttons" |
| shadcn new-york-v4 | xs 24, sm 32, default 36, lg 40 (`button.tsx:22–29`) | 8 / 12 / 16 / 24 | **6 / 10 / 12 / 16** (`has-[>svg]:px-*`, 2 to 8 less) | `size-6/8/9/10` | 4 / 6 / 8 / 8 | none | styles: vega 36 px 10 (icon 8), nova 32 px 10 (8), mira 28 px 8 (6) |
| Untitled UI | xs 32, sm 36, md 40, lg 44, xl 48 (`button.tsx:25–51`) | 10 / 12 / 14 / 16 / 18 | none | p 8 / 8 / 10 / 12 / 14 | 4 / 4 / 4 / 6 / 6 | none | inner highlight `before:rounded-[7px]` = corner − 1 |
| Ant Design 5 | XS 16, SM 24, default 32, LG 40 (`genControlHeight.ts`: 0.5 / 0.75 / 1 / 1.25 × 32) | `controlPaddingHorizontal` 12, SM 8 (`alias.ts`) | — | square | 8 | — | one seed (`controlHeight`) derives the rest |
| **Area** | type 13: xs 22, sm 26, md **30**, lg 38, xl 46; App (13 Compact) 20 / 24 / **26** / 34 / 42; type 14 Default 24 / 28 / 32 / 40 / 48 (`emit/base.ts:465–508`: line + 2 × room, rooms 4 / 4 / 6 / 10 / 12 ± 2 a level, floor 24) | `round((H − 1cap) / 2 − border)`: md at 13 ≈ 9 (outer 10), at 14 10 (outer 11) (`inset.css:22–25`) | `(H − icon) / 2 − border`: 6 (outer 7) at 30, 7 (outer 8) at 32 | square, padding 0 | 6 (sm–lg), 4 at xs and Compact; rows 12 | none | "the tier's text line plus twice its room" (DESIGN_SYSTEM.md 489) |

**Consensus.** Every system above except Area and Ant puts control heights on a 4px or 8px ladder that does not move
with the type size: 24 · 28 · 32 · 40 · 48 (Primer, Spectrum, Radix, Fluent, Carbon, shadcn). Text is then centred in
that box (Primer `paddingBlock = (size − line) / 2`: 2 / 4 / 6 / 10 / 14 on a 20 line). Side padding is 12 at 32 almost
everywhere (Primer, Radix, Fluent, Spectrum, Ant), 10 in the compact web baselines (shadcn nova/vega).

**Where the best differ.** (a) Icon-side correction: Spectrum (−2), shadcn (−2 to −8) and Area (−3) take room off the
side that leads with an icon; Primer, Radix, Fluent and Untitled do not. (b) Pills: Spectrum alone writes a separate,
larger side for pill shapes (+4 at 32: 16 not 12). (c) Min width: Spectrum (2.25 × H), Fluent (64 / 96) and Carbon set
one; the web baselines (Radix, shadcn, Primer, Untitled) do not. (d) Carbon's asymmetric 64px end is a product-specific
choice (icon pinned at the end), not a pattern to follow.

**Area.** Area's padding formula is the most principled of the set: it derives both sides from the cap height and the
icon box, counts the border once and rounds to whole pixels (`inset.css:22–25`), and it lands within 1px of shadcn nova
and Spectrum. The height ladder is the outlier. It is derived as text line + room, and it equals Primer's ladder only at
type 14 (`axes/density.ts:13–14` says so). At the shipped default (type 13) it is 22 / 26 / 30 / 38 / 46, and in the
app 20 / 24 / 26 / 34 / 42: no reference system has a 26, 30, 38 or 46 control. Fixed parts written against the 4px
ladder then sit off it: `mark-sm/md/lg` 16 / 20 / 24 (`base.ts:491–493`), "Dialog's close is a 32px ghost Button"
(DESIGN_SYSTEM.md 308), the 24 Kbd box (DESIGN_SYSTEM.md 643). Findings RD1 (ladder), RD6 (pill sides), RD11 (min
width).

### 2.2 Space scale, assignment rules, density

| System | Scale (px) | Assignment rules as written | Density |
|---|---|---|---|
| Atlassian | 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 (`space.0…1000`) | 0–8 "small and compact pieces of UI" (icon–text gaps, badges, icon buttons, table cells); 12–24 "larger and less dense" (buttons, cards); 32–80 layout; negative space via the Bleed primitive | none (one scale) |
| Spectrum 2 | 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 (`spacing-*`) | component-level tokens per family (`menu-item-label-to-description` 1 / 2, `menu-item-section-divider-height` 12) | desktop / mobile **scale** sets: every component length in two values (32 → 40) |
| Primer | base 4·8·12·16…; functional `stack.gap` condensed 8 / normal 16 / spacious 24, `stack.padding` the same, `controlStack.gap` 8 (spacious 12–16), `overlay.padding` 8 / 16 | rules in each token's `$extensions.rules` ("Use condensed for dense lists, normal for standard layouts, spacious for prominent sections") | condensed / normal / spacious per token, coarse/fine pointer (`size-coarse.json5`) |
| Polaris | 0…3200 in a 4px base; semantic `space-button-group-gap` 8, `space-card-gap` 16, `space-card-padding` 16, `space-table-cell-padding` 6 | semantic aliases name the job | none |
| Radix Themes | 4, 8, 12, 16, 24, 32, 40, 48, 64 × scaling | component props pick a step | `scaling` 90–110% multiplies **every** length and type |
| Fluent 2 | 2, 4, 6, 8, 10, 12, 16, 20, 24, 32 (`spacings.ts`, "nudge" names for 6 and 10) | — | — |
| Carbon | 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160 | layout density condensed / normal drives `padding-inline` | layout `density` context |
| Ant | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 from `sizeUnit × (sizeStep ± n)` | `paddingContentHorizontal` 16, SM 12, LG 24 | compact algorithm |
| Stripe | `spacingUnit` (one number), `gridRowSpacing`, `gridColumnSpacing`, `labelSpacing` | inputs `spaced` / `condensed`; labels `above` / `floating` / `auto` | `spacingUnit` |
| **Area** | 0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, fixed (`base.ts:27`) | icon gap 6 (4 Compact); label→control `ui-stack` 6; related `ui-cluster` 8; list row label column 12 (`gap-row`); surface inset 16 / 14 / 12; Stack related 8 / group 12 / section 2 × group 24 (`stack.css:20–23`); text-pair, prose-gap and "never between" rules (DESIGN_SYSTEM.md 527–577) | three levels, derived (`ui-dense`, `ui-gap-step`); at type 13 Default `gap-row` 10 and `inset-surface-md` 14 |

**Consensus.** A 4px base with 2 and 6 half steps (Atlassian, Spectrum, Fluent, Area are the same ladder to within one
rung). Density, where it exists, changes which step a component reads (Primer, Carbon, Area) or multiplies every length
(Radix, Spectrum's mobile set).

**Where the best differ.** Primer writes the assignment rule into the token itself, machine-readable, with "MUST" and
"Do NOT" (`size.json5` control `$extensions.rules`; `border.json5:53` "MUST use for focus rings"; `shadow.json5:1240`
"MUST use for modals and dialogs"). Spectrum writes per-component spacing tokens so a spec table can be generated.

**Area.** Area's assignment rules are deeper than any system read (text pairs measured baseline to cap, "never
between", rings for conversations); none of the fifteen publishes rules at that grain. Two gaps: the rules live in prose
(DESIGN_SYSTEM.md) and code comments, not on the tokens, so a generator, linter or agent cannot read them (RD8); and
there is no named section token: `stack.css:22` says so and doubles `gap-row` (RD14).

### 2.3 Type: ramp, leading, weights, tracking, inks, numerals

**Ramp and leading.**

| System | UI / body sizes (px) / leading | Leading rule | Weights | Letter-spacing by size |
|---|---|---|---|---|
| Apple macOS | Body 13/16, Callout 12/15, Subheadline 11/14, Footnote 10/13, Headline 13/16 Bold, Title 3 15/20, Title 2 17/22, Title 1 22/26, Large Title 26/32 | fixed per style; minimum 10 | Regular, emphasised to Semibold/Bold | system tracking table (not in fetched page) |
| Apple iOS (Large) | Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption 12/16 and 11/13, Title 3 20/25 … Large Title 34/41 | fixed per style; minimum 11 | Regular, Semibold | — |
| Primer | xs 12, sm 14, md 16, lg 20, xl 32, 2xl 40 (rem) | ratios tight 1.25, snug 1.375, normal 1.5, relaxed 1.625, loose 1.75 | 300, 400, 500, 600 | — |
| Radix Themes | 12/16, 14/20, 16/24, 18/26, 20/28, 24/30, 28/36, 35/40, 60/60 | fixed px; headings tighter (14/18 … 20/26) | 300, 400, 500, 700 | 12 +0.0025em, 14–16 0, 18 −0.0025, 20 −0.005, 24 −0.00625, 28 −0.0075, 35 −0.01, 60 −0.025 |
| Fluent 2 | 10/14, 12/16, 14/20, 16/22, 20/28, 24/32, 28/36, 32/40, 40/52, 68/92 | fixed px | 400, 500, 600, 700 | — |
| Polaris | body xs 11/12, sm 12/16, md 13/20, lg 14/20; headings 12/16 … 30/40 | fixed px on a 4px grid | **450, 550, 650, 700** (Inter variable) | headings −0.2 / −0.3 / −0.54px |
| Carbon | label/helper/caption 12/16 (1.333); body-compact 14/18; body 14/20; heading-01 14/20 | ratios; compact vs long pairs | 300, 400, 600 | 12 **+0.32px**, 14 +0.16px |
| Spectrum 2 | 11, 12, 14, 16, 18, 20, 22 … 40 (desktop) / 13, 15, 17, 19 … (mobile) | `line-height-100` 1.3 for components, `-200` 1.5 for body; CJK 1.5 / 1.7 | regular, medium, bold | `letter-spacing` 0 |
| Geist | label 12–20, copy 13–24, heading 14–72 (classes only) | **Label = single line, Copy = multiline** with a higher line | Strong modifier | not published |
| Ant | 12, 14, 16, 20, 24, 30, 38 (`genFontSizes.ts`, e^(i/5)) | `(size + 8) / size` (14/22) | — | — |
| Untitled UI | xs 12/18, sm 14/20, md 16/24, lg 18/28 | fixed | 400–700 | — |
| **Area** | `text-xs` 11/14, `text-sm` 12/16, `text-base` 13/18, `text-lg` 15/22, titles 16/22, 18/24, 20/28, 26/30, display 52, 67; all move with Type 12–16 | fixed px on a 2px ramp; prose leading ≥ 1.5 × size on its own token (12/18, 13/20); trims first and last lines | 400, 500 (450, 550 reachable) | 10 +0.01em, 11 +0.0075, 12 +0.005, 13 +0.0025, titles −0.01 to −0.02, display −0.03 (`type-size.ts:44–46, 96–101`) |

**Consensus.** Product UI text is 13–14 with a fixed 18–20 line; small text 11–12 on 14–16; a separate, looser line
for running text (Geist Label vs Copy, Carbon compact vs long, Spectrum 1.3 vs 1.5). Tracking opens slightly below 14
and closes above 16 (Radix, Carbon, Polaris, Area). Area matches the consensus closely and already has the label/copy
split (UI line vs prose leading).

**Ink hierarchy.**

| System | Primary | Secondary | Tertiary | Disabled | Placeholder | Icons |
|---|---|---|---|---|---|---|
| Apple | label | secondaryLabel | tertiaryLabel, quaternaryLabel | — | placeholderText | — |
| Atlassian (light) | `text` #292A2E | `text.subtle` #505258 | `text.subtlest` #6B6E76 | `text.disabled` #080F214A (29% alpha) | subtlest | own `icon.*` set |
| Polaris | `text` #303030 | `text-secondary` #616161 | — | `text-disabled` #B5B5B5 | secondary | **`icon` #4A4A4A, `icon-secondary` #8A8A8A** (a step lighter than the text they sit beside) |
| Primer | `fgColor.default` neutral.13 | `fgColor.muted` neutral.9 | — | `fgColor.disabled` neutral.8 | — | `fgColor.neutral` (muted) |
| Spectrum 2 | content gray-800 (hover gray-900) | subdued gray-700 | — | gray-400 on gray-100 | — | `neutral-visual-color` gray-500 |
| Ant | text 88% alpha | 65% | 45%, quaternary 25% | 25% | 25% | — |
| Stripe Elements | `colorText` | `colorTextSecondary` | — | — | `colorTextPlaceholder` | `iconColor`, `iconHoverColor` |
| Radix Colors | step 12 (APCA Lc 90 on step 2) | step 11 (Lc 60) | — | gray-a8 | — | — |
| Geist | gray-1000 | gray-900 | — | — | — | same as text |
| **Area** | `fg-default` #282828 / dark #eeeeee | `fg-muted` #666666 (5.74:1 on white) / dark #c5c5c5 | none (`fg-quiet` sits between default and muted, for icon actions) | `fg-disabled` #a4a4a4 (2.49:1) / dark #666666 | = muted | `fg-quiet` for icon actions; mark roles per tone |

**Consensus.** Two text inks plus disabled is the norm for product UI (Primer, Spectrum, Polaris, Radix, Geist, Area).
The systems with a third ink (Atlassian, Apple, Ant) use it for placeholder, timestamps and tertiary metadata. Polaris
and Spectrum give icons their own, lighter ink beside text.

**Numerals and truncation.** Geist ties tabular figures to its 13 label ("use tabular when showing numbers"); Area's
WRITING.md 111 has the rule for tables, counts and prices and its Table, Count, Calendar, Meter and Slider read it, but
Number field (`number-field.css:67–76`) and Timestamp (`timestamp.css:10–18`) do not (RD13). Truncation: Area's rule
(WRITING.md 106: chrome truncates with a tooltip, content wraps, card titles clamp to two) matches Polaris and
Atlassian.

**Marketing vs product headings.** Geist keeps marketing sizes (heading 48–72, copy 18–24) as named styles apart from
product; Polaris and Primer cap product headings at 30–40. Area has display 52 / 67 at type 13 and four titles; enough.
Findings RD7 (disabled ink), RD13 (numerals).

### 2.4 Radius: scale, assignment, nesting, pills, a radius setting

| System | Scale (px) | By size | Nesting rule | Pill | Setting |
|---|---|---|---|---|---|
| Spectrum 2 | 0, 3, 4, 5, 6, 7, 8, 9, 10, 16, full | **by component size**: medium corner XS 6, S 7, M 8, L 9, XL 10; small corner S 3, M 4, L 5, XL 6 (`corner-radius-medium-size-*`) | — | separate pill padding (2.1) | none |
| Radix Themes | 3, 4, 6, 8, 12, 16 × scaling × factor | button 1–4 take radius-1…4 (3 / 4 / 6 / 8); menu content radius-4 (8) with padding 8 and items radius-2 (4) | not concentric (8 − 8 → 4) | `full` makes controls pills, cards stay on the ladder | **none 0, small 0.75, medium 1, large 1.5, full** (`radius.css`) |
| Primer | 3, 6, 12, full; default 6 | controls 6, overlays 12 | — | — | — |
| Fluent 2 | 0, 2, 4, 6, 8, 12, 16, 24, 32, 40, circular | controls 4 at every size | — | circular shape prop | — |
| Material 3 | 0, 4, 8, 12, 16, 20 (large-increased), 28, 32 (xl-increased), 48 (xxl), full | by component; buttons full | — | default for buttons, chips, sliders | **shape morph** on press and select (`pressed-container-shape` corner-small) |
| Atlassian | 2, 4, 6, 8, 12, 16, full; tile 25% | xsmall badges/checkboxes; small tags/tooltips; medium buttons/inputs/nav; large cards/menus; xlarge modals/tables | **focus ring radius = component + 2** at a 2 offset (`radius.focus.*`) | users, emoji | — |
| Apple | — | — | **concentric**: `ConcentricRectangle`, `concentric(minimum:)`: a child's corner is the container's less the inset, with a floor | capsule for icon + text, circle for icon only | — |
| Ant | `borderRadius` 6 seeds XS 2, SM 4, LG 8, Outer 4 (`genRadius.ts`) | by size | — | — | one seed, stepped tables |
| shadcn | `--radius` 0.625rem; sm = r − 4, md = r − 2, lg = r, xl = r + 4 | button md (8), card xl (14) | — | `rounded-full` opt-in | one variable |
| Stripe | `borderRadius`, `buttonBorderRadius` | — | — | — | two variables |
| **Area** | 0–32 ramp; controls `max(min, round(down, H × factor, 2))`, factor = setting / 32 (`base.ts:523–526`); surfaces own ladder 0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 (`radius.ts:33–43`) | height-proportional: at Corner 10, 22 → 6, 26 → 8, 30 → 8, 38 → 10, 46 → 14; surface 16 | `max(min(floor, own), outer − inset)`; list rows `container − 4`, capped at the md Button; Composer, Toolbar, Segmented concentric (DESIGN_SYSTEM.md 618–637) | Pills is a set per family (`pills.ts`) | one number, 0 to 14 and Pill |

**Consensus.** Radius grows with component size (Spectrum, Radix, Atlassian, Area); nested shapes are the container
less its inset with a floor (Apple, Area); one knob scales everything (Radix factor, shadcn variable, Ant seed, Area).

**Where the best differ.** Spectrum grows the corner 1px per size step (6 → 10 from XS to XL), sub-proportional, so
large controls stay calm; Radix and Area grow in proportion to height. Atlassian makes the focus ring concentric with
the control (+2 at a 2 offset). Material 3 animates the corner on press.

**Area.** Area's nesting rule is Apple's `concentric(minimum:)` in CSS, and more complete than any other web system's
(Radix's own menu is not concentric). Its Pills set (per family, not one global switch) has no equal. Area's focus ring
is an `outline`, which modern engines draw on the border-radius plus the offset, so Atlassian's +2 comes for free at the
Gap preset; at Hug (offset 0) the ring's outer corner equals the control's corner plus 2 only on the outside, so it is
already concentric. No finding beyond RD6 (pill side room).

### 2.5 Strokes, elevation and layering

| System | Widths | Translucent strokes | Shadow recipe (light) | Dark mode | Layer ladder |
|---|---|---|---|---|---|
| Primer | thin 1, thick 2 (focus, selected), thicker 4; `boxShadow.thin` = inset 0 0 0 1px | — | floating small: ring 0 0 0 1px border @25%, 0 6 12 −3 @4%, 0 6 18 0 @12%; large (dialogs): 0 40 80 @24% (`shadow.json5:333–1054`) | per-theme shadow colours | resting xs/sm/md, floating sm/md/lg/xl, inset |
| Radix Themes | 1 | **borders are alpha steps** (gray-a3 to a7); shadow rings 0 0 0 1px gray-a3 / 0.5px black-a1 | shadow-2: ring + 0 1 1 gray-a2 + 0 2 1 −1 black-a1 + 0 1 3 black-a1; shadow-4: ring + 0 8 40 black-a1 + 0 12 32 −16 gray-a3; shadow-6: ring + 0 12 60 black-a3 + 0 16 64 gray-a2 + 0 16 36 −20 gray-a7 (`shadow.css:3–35`) | ring gray-a6 and black alphas ×2–3 (`shadow.css:80–113`) | `panelBackground` solid / translucent |
| Spectrum 2 | 1, 2, 4 | — | three layers: ambient, transition, key; elevated: 0 4 12 @8%, 0 2 6 @4%, 0 0 2 @12%; dragged 0 12 16 / 0 6 8 / 0 0 6 (`color-aliases.json` drop-shadow-*) | **alphas × 3** (8 → 24, 12 → 36, 16 → 48) | base gray-25, layer-1 gray-50, layer-2 and elevated gray-25 light / **gray-75 dark** |
| Polaris | 0.165 (`border-width-0165`), 0.25, 0.5, 1, 2 | shadow-border-inset 0 0 0 1px @8% | 100: 0 1 0 0 @7%; 300: 0 4 6 −2 @20%; 400: 0 8 16 −4 @22%; 600: 0 20 20 −8 @28%; bevel and inset button recipes (`shadow.ts:41–118`) | — | bg #f1, surface #fff, hover #f7, active #f3, selected #f1 |
| Atlassian | 1, selected 2, focused 2 | `border` #0B120E24 (14% alpha), dark #E3E4F21F | raised 0 1 1 @25%, 0 0 1 @31%; overlay 0 8 12 @15%, 0 0 1 @31% | overlay adds **0 0 0 1px #BDBDBD1F** (a 12% light ring) and darker shadows; **surfaces lighten**: surface #1F1F21, raised #242528, overlay #2B2C2F, sunken #18191A | sunken, default, raised, overlay, each paired with a shadow ("Always pair") |
| Fluent 2 | 1, 2, 3, 4 | — | shadow2…64: ambient 0 0 2 + key offset = blur/2 | colours doubled | background1–6 |
| shadcn styles | 1 | **cards `ring-1 ring-foreground/10`** (vega, nova, mira) | Tailwind shadow-xs on outline buttons and vega cards | `dark:bg-input/30` | card, popover |
| Untitled UI | 1 | — | xs 0 1 2 @5%; lg 0 12 16 −4 @8% + 0 4 6 −2 @3% + 0 2 2 −1 @4%; 3xl 0 32 64 −12 @14% | — | — |
| **Area** | `stroke-width` 1 (meaning), `border-width` follows Stroke width 0–2 in halves; Hairline = one device pixel | only where the ground is unknown (swatch ring, `bg-mark`); twelve stroke groups at 2.5% of the ink per step over the ground (DESIGN_SYSTEM.md 415–439) | float = Fluent shadow16 geometry, key 8%, ambient 4%; eight layer slots; never `none` (elevation.ts) | **alphas × 2**; `border-float` #4b4b4b frames every float; menus and dialogs paint `bg-surface`, the same tone as cards | page, recessed, raised, well; Layers 0 to 8 |

**Consensus.** A floating surface is a hairline ring plus a soft key shadow (Primer, Radix, Atlassian, Spectrum, Area);
dark mode multiplies shadow alpha (×2 Fluent and Area, ×3 Spectrum) and **also lightens the higher surface**
(Atlassian three steps, Spectrum layer-2/elevated gray-75, Material's tonal surface containers, Apple's elevated system
backgrounds).

**Where the best differ.** Radix and shadcn draw strokes as alpha over whatever is below; Area deliberately keeps opaque
strokes on known grounds and solves each group's distance per ground, which is stronger (it holds contrast on every
ground) but heavier. Primer and Atlassian bind each shadow to a surface in a rule ("Always pair raised with
shadow.raised"); Area binds by role (Elevation table), the same idea.

**Area.** In dark, Area separates a menu from the card under it by the #4b4b4b edge and the doubled shadow only; the
fill is the same `bg-surface` (#121212 for cards). Every system with dark elevation guidance steps the overlay lighter
than the raised layer. Finding RD3.

### 2.6 State layers, focus and disabled

| System | Hover | Pressed | Selected | Focus ring | Disabled |
|---|---|---|---|---|---|
| Material 3 | content colour @ **8%** | 10% | — (dragged 16%) | focus layer 10% + ring | content 38%, container 12% (`_md-sys-state.scss`) |
| Radix | step 3 → 4 (accent-a3 → a4) | a5 | a5 | **2px, offset 2** (`outline: 2px solid var(--focus-8)`), soft/ghost −1 offset | gray-a8 on gray-a3 (repaint) |
| Radix solid | `filter: brightness(0.92) saturate(1.1)` on press; dark brightness(1.08) | | | | |
| Primer | `bgColor-hover` | `bgColor-active` | — | **2px, offset −2** (inset); on emphasis + `inset 0 0 0 3px fgColor-onEmphasis` (two-tone) | repaint (`control-fgColor-disabled`) |
| Fluent 2 | Background1Hover, Stroke1Hover, Foreground1Hover | Pressed | — | 2px strokeFocus2 (dark) outside + 1px strokeFocus1 (light) inside (two-tone) | repaint (NeutralForegroundDisabled) |
| Carbon | hover token | active | — | 2px, offset −2 (`outline` type), **dotted under `prefers-contrast`** (`_focus-outline.scss`) | repaint |
| Spectrum 2 | content gray-800 → 900, bg → 900 | down | selected | 2px, gap 2 (`focus-indicator-thickness`, `-gap`) | gray-400 on gray-100 |
| Atlassian | neutral subtle #0515240F (6%); on fills `interaction.hovered` black 16% | #0B120E24 (14%); black 32% | — | 2px, offset 2, radius + 2 | background 6% alpha, text 29% |
| Polaris | #f7 | #f3 | #f1 | — | — |
| shadcn | primary/90, accent plate | — | — | **3px ring at 50% of `--ring`** + border = ring | **opacity 50%** |
| Untitled | — | — | — | outline 2, offset 2, brand-500 | opacity 50% |
| Ant | `colorFillTertiary` 4% | — | — | `controlOutlineWidth` 2, `lineWidthFocus` 3 | 25% ink |
| **Area** | light rgb(20 20 20 / 5%), dark white 7% | light ≈12.5%, dark +0.425% a step | light black 7%, dark white 12% (`base.ts:257–259`) | 2px `focus-color` (neutral solid at Selection Neutral), **offset 0 at Hug** (default), 2 at Gap, −2 at Inset, 3px Bold (`states.ts:28–32`) | **opacity 50%** on controls; fields repaint |

**Consensus.** Hover 5–8%, pressed 10–14%, selected 7–12% of the ink over a neutral (Material, Atlassian, Radix, Area
all agree within 2 points). Focus is 2px; it either sits outside with a 2 gap (Radix, Spectrum, Atlassian, Untitled)
or inside at −2 (Primer, Carbon). The systems that put a ring directly on the edge of a solid fill add a contrasting
inner line (Primer `focusOutlineOnEmphasis`, Fluent's two strokes, Carbon's inset white in buttons).

**Where the best differ.** Disabled: full systems repaint to a neutral (Primer, Fluent, Carbon, Spectrum, Radix,
Material 38%); the web baselines dim (shadcn, Untitled 50%). Area dims, like shadcn.

**Area.** Area's state washes are derived and ordered (`DARK_WASH` keeps hover < selected < pressed at every setting),
which no other system guarantees in code. Two refinements: at the default Hug + Selection Neutral, the ring on a solid
neutral Button is the Button's own colour at offset 0 (RD2); and a disabled accent or status solid keeps its hue at 50%,
which Material and Spectrum avoid by repainting disabled to grey (RD7). Carbon's `prefers-contrast` dotted ring is a
cheap win Area lacks (RD12).

### 2.7 Optical corrections

| Correction | Who writes it | Area |
|---|---|---|
| Text inset from the cap, not the line box | Spectrum top-to-text 6 / bottom-to-text 9 at 32 (text placed on cap and baseline); Radix `--default-leading-trim-start: 0.42em`, `-end: 0.36em` (`typography.css:47–48`) for its Text `trim` prop | `text-box: trim-both cap alphabetic` on every text slot and `1cap` in the inset formula (`inset.css:17, 252–259`); the fullest adoption read |
| Icon side vs text side | Spectrum edge-to-visual = edge-to-text − 2; shadcn `has-[>svg]` −2 to −8 | derived from the icon box (`inset.css:137–151`) |
| Pill end room | Spectrum pill-edge-to-text +4 at 32 | fields clear half the corner (`inset.css:30–35`); Buttons and Chips do not (RD6) |
| Lowercase optical lift | — | Citation lifts by (1cap − 1ex)/4 (`inset.css:270–273`) |
| Marks on one baseline | — | Count, Badge, Tag share a whole-pixel cap centre (DESIGN_SYSTEM.md 723–734) |
| Play / chevron / triangle centring | drawn into the glyph (Material symbols, Spectrum workflow icons) | drawn into Area's glyphs; "never nudge a glyph" (AGENTS.md) |
| Inner highlight concentric with the frame | Untitled `before:rounded-[7px]` on an 8 corner | Shadow Light lever (`depth.ts`) |
| Focus ring follows the corner | Atlassian radius + 2 | native outline does it |

No reference system goes as far as Area on optical insets. Nothing to adopt beyond the pill rule.

### 2.8 Colour

| System | Scale construction | Contrast model | Roles | Data vis | Accent customisation | P3 |
|---|---|---|---|---|---|---|
| Radix Colors | 12 steps with fixed jobs: 1–2 backgrounds, 3–5 component fills (rest, hover, pressed/selected), 6–8 borders (subtle, interactive, strong + focus), 9–10 solid and hover, 11–12 text | **APCA**: step 11 Lc 60 and step 12 Lc 90 on step 2 of the same scale | the step is the role | — | `accentColor` from 26 scales; custom palette generator | yes (Radix publishes P3 scales) |
| Geist | 10 steps, 100–1000, same jobs (100 bg, 200 hover, 300 active, 400 border, 500 hover border, 600 active border, 700 high-contrast bg, 800 its hover, 900 secondary text, 1000 primary text) | not stated | step = role | — | — | "P3 colors are used on browsers and displays that support them" |
| Stripe | Lab (CIELAB), each hue's lightness curve tuned so every hue has the same contrast at a level | **level distance**: 5 levels apart ⇒ 4.5:1, 4 apart ⇒ 3:1; Badge shifts both up one level | — | — | — | — |
| Linear | LCH; three inputs (base, accent, contrast) generate 98 variables | a contrast input from 30 to 100 | surfaces, text, icons, controls generated | — | any base and accent | — |
| Material 3 | HCT tonal palettes, tones 0–100; dynamic scheme variants MONOCHROME, NEUTRAL, TONAL_SPOT, VIBRANT, EXPRESSIVE, FIDELITY, CONTENT, RAINBOW, FRUIT_SALAD (`variant.ts`) | tone distance; **`contrastLevel` −1 to 1** (`dynamic_scheme.ts:39`) | primary, secondary, tertiary, error, surface containers | — | from a seed or an image | — |
| Spectrum 2 | gray-25…900 and 15 hues; subtle backgrounds 200 light / 300 dark | WCAG | `neutral-content`, `-subdued-content`, `neutral-visual`, `*-subtle-background` per hue | — | — | — |
| Primer | base scales; functional `fgColor`, `bgColor`, `borderColor`, `control`, `data-vis.json5` | WCAG, high-contrast themes | default, muted, accent, success, attention, severe, danger, open, closed, done, sponsors | `data-vis.json5` | — | — |
| Atlassian | alpha neutrals (`#0515240F`, `#0B120E24`) | WCAG | text, icon, border, background, surface, interaction | chart tokens | — | — |
| Ant | 10-step palettes from a seed (`colorPrimary` → 1–10) | — | text alphas 88 / 65 / 45 / 25 | — | seed colours | — |
| **Area** | OKLab placement `colourAt(h, L, share)`; vendored `palette.json` never moved; hue drift (yellow +8° / −10°); any accent hue between two families (DESIGN_SYSTEM.md 52–96) | **WCAG** gate on every role and ground, colour-vision simulation, supplementary APCA floor in dark (CONTRAST.md 10, 49) | Action and Selection roles; seven tones; ten label hues with one role table each; change inks | 8 series, each a palette step, P3 room; status trio | any hue, strength, solid step, label tint | series take Display P3; the palette's own rungs do not |

**Consensus.** A perceptual space (Lab, LCH, HCT, OKLab), steps with fixed jobs, and a contrast guarantee stated as a
distance (Radix's Lc per step, Stripe's 4 / 5 levels, Material's tone distance).

**Where the best differ.** Radix and Stripe make the guarantee a rule a designer can apply without a tool ("any two
colours five levels apart pass"). Area's guarantee is stronger (solved per ground, per setting) but lives in the test
suite; nothing tells an author which two rungs may meet (RD9). Material offers `contrastLevel` below 0 (a softer
scheme); Area's Contrast only raises.

**Area.** Ahead of every system read on solved inks per ground and on hue roles. Gaps: no published pairing rule
(RD9); accent and neutral rungs stay sRGB on P3 screens while Radix and Geist ship P3 scales (RD17).

### 2.9 Motion

| System | Durations (ms) | Curves | Springs | Per-pattern | Reduced motion |
|---|---|---|---|---|---|
| Material 3 | short1–4 50 / 100 / 150 / 200, medium1–4 250–400, long1–4 450–600, extra-long1–4 700–1000 | standard (0.2, 0, 0, 1), emphasized decelerate (0.05, 0.7, 0.1, 1), accelerate (0.3, 0, 0.8, 0.15) | **spatial vs effects**: default spatial damping 0.9 / stiffness 700, effects damping **1** / 1600; fast 1400 / 3800; slow 300 / 800 (`_md-sys-motion.scss`) | per component | — |
| Carbon | fast-01 70, fast-02 110, moderate-01 150, moderate-02 240, slow-01 400, slow-02 700 | standard / entrance / exit × productive (0.2, 0, 0.38, 0.9) / expressive (0.4, 0.14, 0.3, 1) | — | `surfaces.ts`: a duration and easing per surface | — |
| Fluent 2 | 50, 100, 150, 200, 250, 300, 400, 500 | decelerate max/mid/min, accelerate max/mid/min, easy-ease (0.33, 0, 0.67, 1) | — | — | — |
| Polaris | 0–500 by 50, 5000 | ease (0.25, 0.1, 0.25, 1), ease-in (0.42, 0, 1, 1), ease-out (0.19, 0.91, 0.38, 1), ease-in-out | — | keyframes tokens | — |
| Primer | Button `transition: 80ms cubic-bezier(0.65, 0, 0.35, 1)` (`ButtonBase.module.css:33`) | — | — | composites | — |
| Ant | `motionUnit` 0.1 s → 100 / 200 / 300 | out-circ, in-out-circ, out-back (0.12, 0.4, 0.29, 1.46) … | — | — | — |
| **Area** | one number (210) in thirds: fast 140, base 210, moderate 280, slow 350; 0–300 in 30s (`motion.ts`) | five Easing presets, default Subtle out (0.22, 1, 0.36, 1) | **Spring preset** is cubic-béziers with y > 1 on `ease-out` and `ease-in-out` (`easing.ts:44, 61`) | MOTION.md roles; exits never slower than enters (tested) | durations to 0, fades kept, loops stop |

**Consensus.** 100–200 for state change, 200–300 for anchored surfaces, enters on a decelerate curve and exits on an
accelerate one, exits shorter.

**Where the best differ.** Material 3 Expressive separates **spatial** springs (may overshoot, damping 0.9) from
**effects** springs (colour and opacity, damping 1: never overshoot). Carbon names a curve per surface.

**Area.** `--area-transition` runs `background-color`, `border-color`, `color` and `box-shadow` on `ease-out`
(`base.ts:426–427`); under the Spring preset that curve is (0.175, 0.885, 0.32, 1.1), so a hover colour overshoots its
target and comes back. Exits are protected ("in stays Standard's"), effects are not (RD4). Area's hover colour leaves in
`duration-fast` 140ms; Primer's Button 80, Cursor's rows 100 (system gaps README). The state-change step may be slow
for chrome (RD15).

### 2.10 Theming and customisation depth

| System | What a user can change | How |
|---|---|---|
| Radix Themes | appearance, accentColor (26), grayColor (6 + auto), panelBackground (solid / translucent), radius (5), scaling (90–110%), hasBackground (`theme.props.tsx`) | 7 props, nestable `<Theme>` |
| Stripe Elements | theme (stripe, night, flat); ~70 variables (`fontSizeBase`, `spacingUnit`, `borderRadius`, `colorPrimary`, `colorText`, `colorTextSecondary`, `colorTextPlaceholder`, `focusBoxShadow`, `focusOutline`, `iconColor`, `iconHoverColor`, `labelSpacing`, `fontWeightLight/Normal/Medium/Bold`…); `rules` per class and state; `inputs` spaced / condensed; `labels` auto / above / floating; computed `accessibleColorOn*` | variables + rules + layout options |
| Material 3 | seed or image → dynamic scheme; 9 variants; contrastLevel −1…1; typeface; shape scale | `DynamicScheme` |
| Spectrum 2 | light / dark / wireframe; desktop / mobile scale | token sets |
| Linear | base, accent, contrast | 3 inputs |
| shadcn | style (vega, nova, maia, lyra, mira: height, padding, radius, card spacing, type size per style), base colour, theme colour, `--radius`, font | CSS variables + registry styles |
| Ant | seed tokens (`colorPrimary`, `borderRadius`, `controlHeight`, `fontSize`, `sizeUnit`, `sizeStep`, `motionUnit`…), algorithms default / dark / compact | `ConfigProvider` |
| **Area** | 63 settings in 9 groups: Page (13), Accent (5), Emphasis (7), Size (2), Shape (2), Stroke (14), Shadow (8), States (9), Effects (3) (`registry.ts:92–107`); scoped subtree re-derivation; Contrast and Pills scoped | `data-area-*` attributes, live derivation |

**What Area has that none of them do:** per-ground solved inks under every setting; twelve stroke groups; state fill
steps with a guaranteed order; Pills per family; scoped subtree re-derivation of every derived token; type and density
as separate numbers that drive every height, gap and mark.

**What Area lacks** (each is a value on an existing axis or a small setting, not a new system):
- a **typeface** choice: no family setting is in `SETTING_GROUPS` (Stripe `fontFamily`, shadcn font, Material typeface);
  owner's open item (memory: typefaces review, font-switching next) (RD16);
- a **field and label layout** choice (Stripe `inputs` spaced / condensed, `labels` above / floating) (RD19);
- a **softer than standard contrast** (Material `contrastLevel` < 0; Linear contrast 30) (RD18);
- a **touch scale** (Spectrum mobile set; Primer `minTarget.coarse` 44): Area expands hit areas per family under
  `pointer: coarse` (badge.css 254, switch.css 177, tag.css 144, splitter.css 69, toggletip.css 70) but not for Button,
  fields or rows (RD10).

### 2.11 Component pages: what production systems document

| Section | Carbon | Material 3 | Spectrum 2 | Primer | Polaris | Atlassian | Area entry (`documentation/*.mjs`) |
|---|---|---|---|---|---|---|---|
| When to use / not | Usage tab | Guidelines | Usage | — | Best practices | Usage | `instead` |
| Do / don't | yes | yes | yes | — | yes | yes | `practices` |
| Anatomy | yes | numbered diagram | yes | — | — | yes | `parts` (text only) |
| **Specs per size: px tables** | **Style tab: colour tokens per state, type token, structure (padding, icon spacing, focus inset, clearance), seven sizes** | Specs: measurements per size | component token files (`menu.json`: edge-to-content 28 / 32 / 38 / 45; label-to-description 1 / 2) | `size.json5` per control | — | — | **none** |
| Tokens used per state | Style tab colour tables | yes | yes | yes | — | — | none |
| Content guidelines | yes | yes | yes | — | **per component** | yes | none (global WRITING.md) |
| States | Style | yes | yes | — | — | — | `states` (10 of 18 entries in actions.mjs) |
| Keyboard, ARIA | Accessibility tab | Accessibility | yes | yes | yes | yes | `keyboard`, `aria` |
| Props from source | Code | — | yes | yes | — | yes | none |
| Lifecycle | Stable + updated | — | — | alpha → stable per platform | — | — | component-status.mjs (not on the page) |

The `system-gaps-2026-11-06` README already lists the missing content, responsive, RTL and code sections. The level
below that: **no Area page gives the measurements**, though Area is the system best placed to: every height, inset,
gap and corner is a live derivation that can be evaluated at each type × density (RD5).

## 3. Findings, most severe first

**RD1. Control heights leave the 4px ladder at the shipped type size.** Kind: inconsistency. Where: `emit/base.ts:465–508`
(height = line + 2 × (room + 2 × level), floor 24); `axes/density.ts:13–14` ("at type 14, Default gives 24 / 28 / 32 /
40 / 48, Primer's ladder"); default Type 13 (`type-size.ts:118`). Values: type 13 Default xs 22, sm 26, md 30, lg 38,
xl 46; the app (13 Compact) 20, 24, 26, 34, 42. References: Primer 24 / 28 / 32 / 40 / 48, Spectrum 20 / 24 / 32 / 40 /
48, Radix 24 / 32 / 40 / 48, Fluent 24 / 32 / 40, Carbon 24 / 32 / 40 / 48, shadcn 24 / 32 / 36 / 40, Untitled 32 / 36 /
40 / 44 / 48, Ant 16 / 24 / 32 / 40: none has a 26, 30, 38 or 46. Fixed parts written on the 4px ladder sit beside
them off it: `mark-sm/md/lg` 16 / 20 / 24 (`base.ts:491–493`), the 24 Kbd box and the 32 Dialog close
(DESIGN_SYSTEM.md 308, 643). Families: every control (Button, fields, Segmented, Chip, Tabs plate, Select, Toolbar),
everything concentric with them. Rule-level fix: keep the derivation and snap its result,
`round(nearest, line + 2 × room, 4px)` above the floor (type 13 Default becomes 24 / 28 / 32 / 40 / 48, the app 20 / 24 /
28 / 36 / 44), so the type size moves text inside a stable ladder as Primer centres a 20 line in 2 / 4 / 6 / 10 / 14 of
block padding. Visible: md Buttons and fields 2px taller at the default, the app's md 26 → 28. Size M (one derivation;
cohesion test and the visual pass across families). Confidence medium: the numbers are certain, the preference is the
owner's; check Cursor's bundle heights at its 13 base first (Area's type ramp is Cursor's), since a 26 there would
argue for keeping the derived ladder at Compact.

**RD2. At the default focus ring, a solid neutral Button's ring is its own colour on its own edge.** Kind: defect
(perceptual; unverified in the app). Where: `button.css:184–188` (`outline: focus-width solid focus-color; outline-offset:
focus-offset`), `axes/states.ts:28` (Hug: offset 0), `emit/base.ts:288` (`focus-color` = `neutral-solid` at Selection
Neutral, the default) and `:267` (`action-solid` = `neutral-solid` at Action Neutral, the default). Focus then reads as
the solid Button growing 2px, not as a ring. References: Primer puts a 3px inner line of `fgColor-onEmphasis` inside the
ring on emphasis fills (`focusOutlineOnEmphasis.css`); Fluent draws a dark 2px stroke with a light 1px inside; Carbon's
buttons add an inset white line; Radix, Spectrum, Atlassian and Untitled hold a 2px gap. Families: solid Button, Split
button, Composer send, and any control whose fill equals `focus-color` (at Selection Accent, accent solids). Rule: "a ring never sits flush on a fill of its own colour": where the fill
is the focus colour (neutral solid, or the accent solid at Selection Accent), the ring takes `focus-gap` (2) or a 1px
`fg-on-*` inner line, at every Focus ring preset. Visible: a 2px page-coloured gap (or a white hairline) between the
solid Button and its ring. Size S. Confidence high on the mechanism, medium on how it reads.

**RD3. In dark, floating surfaces are the same tone as the cards under them.** Kind: refinement. Where: `.area-menu`
(`surface.css:1104–1118`), `.area-dialog` (`:957–981`), `.area-toast` (`:1731–1743`) all paint `bg-surface`, which is
also a Card's ground at Card tone Auto (DESIGN_SYSTEM.md 702: cards #121212). A menu opened over a card is separated by
`border-float` (#4b4b4b) and the doubled shadow only. References: Atlassian dark surface #1F1F21, raised #242528,
overlay #2B2C2F ("dark mode elevations also rely on different surface colors"); Spectrum `background-elevated-color`
gray-75 in dark against layer-1 gray-50; Material's surface-container ladder; Apple's elevated backgrounds. Rule: dark
mode lifts each elevation role one layer step (`LAYER_PER_STEP.dark.raised` 0.015, `color/layers.ts:137`) above the
role under it: page < raised (cards) < floating (menus, popovers, toasts) < modal; light unchanged. Visible: a dark menu
over a card reads one step lighter (about #1a1a1a over #121212 at the default Layers), the page stays near black.
Families: every `shadow-float` and `shadow-modal` member. Size M (a ground in layers.css, the declared-ground list, the
contrast gate). Confidence high.

**RD4. The Spring easing overshoots colour.** Kind: defect. Where: `emit/base.ts:426–427` (`--area-transition` runs
background-color, border-color, color, box-shadow and scale on `ease-out`), `axes/easing.ts:61` (Spring `out`
(0.175, 0.885, 0.32, 1.1), `inOut` (0.175, 0.885, 0.32, 1.275)). A hover plate under Spring passes its target fill and
returns; an edge goes darker than its hover edge and back. Reference: Material 3 Expressive splits springs into spatial
(damping 0.9, may overshoot) and **effects** (damping 1, colour and opacity, never overshoot) (`_md-sys-motion.scss`:
`spring-default-effects-damping: 1`). Rule: effects (colour, opacity, shadow) always read a non-overshooting curve;
only movement (scale, translate, size) reads `ease-out` under Spring. Add `--area-ease-effects` (Spring: Subtle's out)
and use it for the colour and shadow parts of `--area-transition` and every fade. Visible: under Spring only, hovers
settle without a flash; nothing changes at the default Subtle. Size S. Confidence high.

**RD5. Component pages carry no measurements.** Kind: opportunity. Where: the entry schema is `instead`, `practices`,
`parts`, `states`, `keyboard`, `aria` (`apps/desktop/src/content/documentation/actions.mjs:3–56`; 18 entries there, 10
with `states`). References: Carbon's Style tab (colour tokens per state, type token, padding, icon spacing, focus inset,
seven sizes; carbondesignsystem.com/components/button/style), Material's Specs, Spectrum's per-component token files
(`menu.json`: edge-to-content 28 / 32 / 38 / 45, label-to-description 1 / 2), Primer's `control.*` tables. Area alone
derives every height, inset, gap and corner live, so it can print the true table for any type × density × corner.
Rule: each family's page has a generated **Specs** section (height, sides with and without icon, gap, corner, icon
size, type role, tokens per state) evaluated from `emit/base.ts` at the current settings and at the defaults. Visible:
a Specs tab per family. Size M. Confidence high.

**RD6. Pill Buttons and Chips keep a rectangle's side room.** Kind: refinement. Where: `inset.css:22–25` (sides from cap
and icon only); `inset.css:30–35` (fields alone clear half their corner); `button.css:80–83` (pill adds radius only).
At 32 a pill Button's text starts about 11 from its end, as a rectangle's. Reference: Spectrum `component-pill-edge-to-
text-100` 16 vs `edge-to-text-100` 12, `pill-edge-to-visual-100` 14 vs 10 (visual-only unchanged). Rule: a shape whose
corner passes 3/8 of its height adds `max(0, corner − 3H/8)`, rounded, to its text and icon sides: 0 at the
default corner (10 on 32), 2 at Corner 14, 4 at a 32 pill, matching Spectrum. Families: Button, Chip, Segmented items, Tabs plate, soft Badge is excluded
(its (H − 6) / 2 is the marks rule). Size S. Confidence medium.

**RD7. Disabled solids keep their hue at half strength.** Kind: refinement. Where: `--area-opacity-disabled` 0.5
(`base.ts:107`) dims a control as a whole (DESIGN_SYSTEM.md 293). A disabled accent or danger solid reads as a lighter
brand or danger button. References: Material content 38% / container 12% of on-surface (neutral); Spectrum gray-400 on
gray-100; Primer, Fluent, Carbon and Radix repaint to neutral (Radix gray-a8 on gray-a3); only shadcn and Untitled dim.
Rule: disabled toned fills (accent, danger, success…) drop to the neutral soft fill with `fg-disabled`; neutral
controls keep the 50% dim. Visible: a disabled blue or red Button turns grey. Size S. Confidence medium (the owner
chose opacity; this narrows it to toned fills).

**RD8. Token rules are prose, not data.** Kind: opportunity. Where: assignment rules sit in DESIGN_SYSTEM.md and code
comments (`base.ts`, `axes/*.ts`). Reference: Primer writes `$extensions["org.primer.llm"].rules` on tokens ("MUST use
for focus rings … Do NOT use for subtle dividers", `border.json5:52–53`; "MUST use for modals and dialogs",
`shadow.json5:1240`) and `usage` lists. Rule: every public token carries `usage` and `rules` in the emitted JSON
(`emit/json.ts`), so `packages/output` (area check, area mcp) and agents can lint "a divider read `stroke-control`".
Size M. Confidence high.

**RD9. No published colour pairing rule.** Kind: opportunity. Where: CONTRAST.md and the contrast tests solve inks per
ground; an author has no rule of thumb. References: Stripe "any two colours at least five levels apart" pass 4.5:1,
four apart 3:1; Radix step 11 ≥ Lc 60 and step 12 ≥ Lc 90 on step 2; Geist and Radix give every step a job. Rule: one
table in DESIGN_SYSTEM.md, Colour: which rung pairs pass at 4.5 and 3 on which grounds, generated by the contrast suite.
Size S. Confidence high.

**RD10. No touch scale.** Kind: opportunity. Where: `pointer: coarse` hit expansions exist per family only (badge.css
254, 294; switch.css 177; tag.css 144; splitter.css 69; toggletip.css 70); Button, fields, rows and Tabs keep their
desktop targets (a 24 sm Button stays 24). References: Primer `control.minTarget` fine 16 / coarse 44 (`size.json5`),
Spectrum's mobile set (32 → 40), Apple 44 × 44. Rule: under `pointer: coarse` every interactive control's hit area is
at least 44 (an `::after` target, not a taller paint), written once in the shared control base. Size M. Confidence
high.

**RD11. Buttons have no minimum width.** Kind: refinement. Where: `button.css` (no `min-inline-size` on the root).
References: Spectrum `button-minimum-width-multiplier` 2.25 × height (72 at 32); Fluent 64 small, 96 medium; Carbon a
176 legacy minimum. Rule: a text Button in a footer or a dialog's actions (Confirm dialog, Dialog, Drawer, Approval)
is at least 2.25 × its height; inline and toolbar Buttons stay content-sized. Visible: "OK" and "No" no longer narrower
than "Cancel". Size S. Confidence medium.

**RD12. Focus does not respond to `prefers-contrast`.** Kind: refinement. Where: Contrast raises strokes and adds field
outlines (CONTRAST.md 129–133) but the ring keeps its style. Reference: Carbon switches every focus outline to `dotted`
under `prefers-contrast` (`_focus-outline.scss`). Rule: under Contrast More the ring takes `focus-gap` and 3px (the Bold
preset's width). Size S. Confidence medium.

**RD13. Tabular figures miss values that change in place.** Kind: inconsistency. Where: WRITING.md 111 (tables, counts,
prices); `number-field.css:67–76` and `timestamp.css:10–18` have no `font-variant-numeric`. A scrubbed Number field's
width jitters. Reference: Geist "use tabular when showing numbers". Rule: "numbers that change in place or align in a
column take tabular figures": add Number field and Timestamp (Table, Count, Calendar, Meter and Slider already do);
add the rule to the cohesion test. Size S. Confidence high.

**RD14. No section or page space role.** Kind: refinement. Where: `stack.css:22` ("Area has no section token": section =
`gap-row × 2`). References: Primer `stack.gap` and `stack.padding` condensed 8 / normal 16 / spacious 24; Polaris
`space-card-gap` 16, `space-card-padding` 16; Atlassian 32–80 "for layout elements". Rule: name `gap-section` (24,
Compact 16) and `inset-page` beside `gap-row`, derived as they are, and point Stack, the feed kit and page headers at
them. Size S. Confidence medium.

**RD15. Hover colour leaves slowly.** Kind: refinement. Where: `--area-transition` uses `duration-fast` = 2/3 of the
Speed number, 140ms at 210 (`motion.ts`). References: Primer's Button 80ms; Material short1–2 50–100 for small
effects; Carbon fast-01 70 ("micro-interactions"); Cursor rows 100 (system gaps README). Rule: state-change colour reads
`duration-instant`-to-`fast` on its own third, 1/3 of the number (70 at 210), while surfaces keep base. Visible:
crisper hover off. Size S. Confidence medium.

**RD16. No typeface setting.** Kind: opportunity. Where: `SETTING_GROUPS` (`registry.ts:92–107`) has no family control;
`axes/typography.ts` fixes Geist. References: Stripe `fontFamily` and `fonts`; shadcn's font choice; Material typeface
roles. Rule: a Typeface value set (Geist, system, the installed licensed families of the Typography page) on a new
setting under Size, with per-family cap and tracking metrics so the cap-based insets hold. Size M. Confidence high (an
owner open item).

**RD17. Accent and neutral rungs stay sRGB on P3 screens.** Kind: opportunity. Where: DESIGN_SYSTEM.md 95 (series take
Display P3; the palette's rungs do not). References: Radix publishes P3 scales; Geist "P3 colors are used on browsers
and displays that support them". Rule: under `@media (color-gamut: p3)` accent solids and status marks take their P3
placement at the same OKLab L (the contrast holds; `colourAt` already places by L). Size M. Confidence medium.

**RD18. Contrast only goes up.** Kind: opportunity. Where: Contrast 0 (Standard) to 8 (More) (`registry.ts:112`).
References: Material `contrastLevel` −1 to 1; Linear contrast 30 to 100. Rule: a Soft step below Standard that lowers
strokes and muted ink toward their floors (never below 4.5 text, 3 controls). Size S. Confidence low (needs the
owner's call).

**RD19. No field and label layout choice.** Kind: opportunity. Where: Field stacks a label `ui-stack` (6) above its
control only. Reference: Stripe `inputs: spaced | condensed` (joined fields) and `labels: auto | above | floating`.
Rule: a value on Field (`layout="joined"` for Input group-like stacks); floating labels only if the owner wants them.
Size M. Confidence low.

**RD20. Placeholder shares the muted ink.** Kind: refinement. Where: `color/layers.ts:739` (`fg-placeholder` =
muted, #666666). A placeholder and a filled secondary value look the same in a soft field. References: Atlassian
placeholder = `text.subtlest` (#6B6E76, a step past subtle), Ant `colorTextPlaceholder` = quaternary (25%), Apple
`placeholderText`, Stripe `colorTextPlaceholder` separate; Polaris and shadcn match Area. Rule: none needed if the
owner keeps parity with shadcn; else placeholder sits between muted and disabled at 4.5:1 on the field fill. Size S.
Confidence low.

**RD21. Corners at large heights grow in proportion.** Kind: refinement. Where: `base.ts:523–524` (corner = H ×
factor). At Corner 14, lg 38 → 16, xl 46 → 20. Reference: Spectrum grows the medium corner 1px per size (6, 7, 8, 9, 10
from XS to XL). Rule: none unless the owner finds large controls too round at 12 and 14; then grow the corner with the square root of
the height above 32 instead of in proportion. Size S. Confidence low.

## 4. The 25 highest-value changes

| # | Change | Finding | Sources |
|---|---|---|---|
| 1 | Snap derived control heights to the 4px ladder (24 / 28 / 32 / 40 / 48 at type 13 Default) | RD1 | Primer `size.json5`; Spectrum `component-height-*`; Radix `base-button.css:42–60` |
| 2 | A ring never sits flush on a fill of its colour: gap or inner on-colour line on solid fills | RD2 | Primer `focusOutlineOnEmphasis.css`; Fluent strokeFocus1/2; Radix offset 2 |
| 3 | Dark mode: floating and modal surfaces one layer step above cards | RD3 | Atlassian dark surfaces #1F / #24 / #2B; Spectrum background-elevated gray-75 |
| 4 | `--area-ease-effects`: colour, opacity and shadow never overshoot under Spring | RD4 | Material `spring-*-effects-damping: 1` |
| 5 | Generated Specs section on every family page, at current and default settings | RD5 | Carbon button Style tab; Spectrum `menu.json`; Material Specs |
| 6 | Shapes rounder than 3/8 of their height add `corner − 3H/8` to their sides (4 at a 32 pill) | RD6 | Spectrum `component-pill-edge-to-text-*` |
| 7 | Disabled toned solids repaint to the neutral soft fill | RD7 | Material 38% / 12%; Spectrum gray-400 on gray-100; Radix gray-a8 / a3 |
| 8 | `usage` and `rules` on every emitted token for `area check` and agents | RD8 | Primer `$extensions` rules |
| 9 | A generated rung-pairing table (which rungs meet at 4.5 and 3) | RD9 | Stripe five / four levels; Radix Lc 60 / 90 |
| 10 | 44px hit areas for every control under `pointer: coarse` | RD10 | Primer `minTarget.coarse` 44; Apple 44 × 44 |
| 11 | Footer and dialog Buttons at least 2.25 × height | RD11 | Spectrum `button-minimum-width-multiplier`; Fluent 64 / 96 |
| 12 | Contrast More widens the ring to 3 and gaps it | RD12 | Carbon `prefers-contrast` dotted |
| 13 | Tabular figures for values that change in place | RD13 | Geist label 13 rule |
| 14 | Name `gap-section` and `inset-page` | RD14 | Primer `stack.*`; Polaris `space-card-*` |
| 15 | Colour state changes on a 1/3 step (70 at 210) | RD15 | Primer 80ms; Carbon fast-01 70 |
| 16 | A Typeface setting with per-family cap metrics | RD16 | Stripe `fontFamily`; shadcn font |
| 17 | P3 placement for accent solids and status marks | RD17 | Radix P3 scales; Geist P3 |
| 18 | Per-family content guidance on the page (labels, verbs, length), drawn from WRITING.md | 2.11 | Polaris and Atlassian per-component content |
| 19 | Show tokens per state on the page (fill, edge, ink at rest, hover, pressed, selected, disabled) | RD5 | Carbon Style colour tables |
| 20 | Keep Area's cap-based inset contract and publish it as the method (no system has it) | 2.7 | Spectrum top/bottom-to-text; Radix leading-trim vars |
| 21 | Write the "pair a surface with its shadow" rule into the Elevation table's tokens | RD8 | Atlassian "Always pair"; Primer shadow rules |
| 22 | A Soft contrast step below Standard (owner's call) | RD18 | Material `contrastLevel`; Linear contrast |
| 23 | Field `layout="joined"` for stacked fields | RD19 | Stripe `inputs: condensed` |
| 24 | Component lifecycle and last-updated on each page from component-status.mjs | 2.11 | Carbon Stable + updated; Primer alpha → stable |
| 25 | Placeholder between muted and disabled (owner's call) | RD20 | Atlassian subtlest; Ant quaternary |

## 5. Already excellent; do not disturb

- **The inset contract** (`inset.css`): sides from the cap and the icon box, border counted once, whole pixels, nested
  boxes own their insets. No published system derives padding this way; Spectrum and shadcn hand-tune what Area
  computes, and land within 1px of it.
- **Concentric corners with a floor** (`max(min(floor, own), outer − inset)`): Apple's `concentric(minimum:)` in CSS,
  applied to menus, lists, Composer, Toolbar, Segmented. Radix's own menu is not concentric.
- **Text placed on its glyphs** (`text-box: trim-both cap alphabetic`, gaps baseline to cap, "never between"): the
  fullest adoption read; Radix exposes trim as an opt-in prop only.
- **The space ladder** (0–96 with 2, 6, 10 halves) equals Atlassian's and Spectrum's; keep it fixed.
- **Ordered state washes** (`DARK_WASH`, fill steps built on each other): Material, Radix and Atlassian agree on the
  numbers; only Area guarantees the order at every setting.
- **Solved inks per ground and per setting**, colour-vision simulation, APCA as a supplementary dark floor.
- **Pills as a per-family set**, **Selection and Action roles**, **scoped re-derivation** of every derived token: no
  system read has these.
- **Separate Type and Density numbers** driving heights, gaps, rows and marks; RD1 asks only that the result snap.
- **Elevation as roles with eight layer slots, never `none`**, dark alphas doubled (Fluent's rule) and the edge doing
  the separating.
