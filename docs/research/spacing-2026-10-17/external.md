# How mature design systems keep spacing, alignment and optical sizing consistent

External research, 2026-10-17. Primary sources only: official docs, the systems' own token and
component source on GitHub, and posts by the teams. This file collects evidence. It does not decide
anything for Area.

**Evidence labels** used throughout:

- **D**: documented guidance (docs site prose).
- **S**: source code or token files. GitHub links are pinned to the commit read on 2026-10-17.
- **M**: measured by me from a rendered official docs page (computed styles and range rects, 1x, 2026-10-17).
- **A**: arithmetic I derived from S or D values. It is not a claim the system makes.

"Undocumented" means I looked in the listed sources and the value or rule is not stated there.

---

## 1. Material Design 3 (Google)

### 1.1 Scale and grid

- **D** The M3 spacing system is "measured on an 8dp scale", and `space100` = 8dp. Tokens are named
  as multipliers of 8: `space0` 0, `space25` 2, `space50` 4, `space75` 6, `space100` 8, `space125` 10,
  `space150` 12, `space175` 14, `space200` 16, `space250` 20, `space300` 24, `space400` 32,
  `space450` 36, `space500` 40, `space600` 48, `space700` 56, `space800` 64, `space900` 72
  ([M3 spacing tokens][m3-sp-tokens]). The page calls 2, 4, 6 and 10 "nested units": Material only
  defines nested units "actively used in common layouts or Material components". Custom tokens
  follow the multiplier rule, for example `space225` = 18dp ([applying spacing][m3-sp-apply]).
  The tokens currently ship only in Jetpack Compose.
- **D** M2's older rule still explains the grid. All components align to an 8dp square baseline grid,
  and icons, type and some elements inside components align to a 4dp grid. "Type can be placed
  outside of the 4dp grid when it's centered within a component" (button, list item). Touch targets
  are at least 48×48dp, with at least 8dp between them ([M2 spacing methods][m2-spacing]).

### 1.2 Vocabulary: padding, gap, margin

- **D** There are three kinds of spacing: padding (inside an element), gap (between elements in a
  container) and margin (outside an element). Positions are named leading, trailing, top, bottom,
  horizontal and vertical ([M3 spacing overview][m3-sp-overview]).
- **D** "Use padding & gaps before using margins." Material "rarely uses margins in components". Do:
  define padding and gaps on the parent container. Don't: put margins on children
  ([overview][m3-sp-overview]).
- **D** Simple components use a single horizontal gap and a single vertical gap. Complex components
  "should define them by the elements on each side, like an icon-label gap" ([overview][m3-sp-overview]).
- **D** Token naming is moving from `leading-space` / `between-space` to "padding, margin, and gap"
  with positional words, for example "Medium button: leading padding" ([tokens][m3-sp-tokens]).
- **D** Worked example: the search bar has 8dp vertical padding, 8dp horizontal gaps and 24dp
  horizontal margins. The margins become 12dp when focused, while its padding and gaps stay the
  same ([overview][m3-sp-overview]).
- **D** Spacing stays the same when text scales up to 200% ([applying spacing][m3-sp-apply]).

### 1.3 Component padding is per size and per slot (button)

The M3 docs show button measurements only as images. The numbers below are the generated token
values in Compose (**S**, `ButtonXSmallTokens` … `ButtonXLargeTokens`, generated from tokens
"v0_11_0"; [tokens dir][cmp-tokens], [Button.kt][cmp-button]):

| Size | Height | Leading / trailing padding | Vertical padding | Icon | Icon–label gap | Outline |
|---|---|---|---|---|---|---|
| XS | 32 | 16 / 16 (token); code uses 12 / 12 "until corrected" | 6 | 20 | 8 (token); code uses 4 | 1 |
| S (default) | 40 | 16 / 16 | 10 | 20 | 8 | 1 |
| M | 56 | 24 / 24 | 16 | 24 | 8 | 1 |
| L | 96 | 48 / 48 | 32 | 32 | 12 | 2 |
| XL | 136 | 64 / 64 | 48 | 40 | 16 | 3 |

- **A** Height is always 2 × vertical padding + the label's line height: XS 6+20+6 = 32 (labelLarge,
  line height 20); S 10+20+10 = 40; M 16+24+16 = 56 (titleMedium); L 32+32+32 = 96 (headlineSmall);
  XL 48+40+48 = 136 (headlineLarge). The type role per height comes from `textStyleFor()` in
  [Button.kt][cmp-button].
- **S/D** Classic M3 ("baseline") button: 40 high, 24 leading and trailing, 8 vertical. With a leading
  icon the start padding drops to 16 (`ButtonWithIconStartpadding = 16.dp`, [Button.kt L922–925][cmp-button-922]).
  Text button: 12 on both sides, and 16 on the icon's far side (`TextButtonWithIconHorizontalEndPadding`).
  For M3 Expressive the spec page marks 24dp small-button padding "Not recommended. Use 16dp"
  ([button specs][m3-button-specs]).
- **S** The icon-side inset is smaller than the text-side inset whenever an icon is present (16 vs 24;
  12 vs 16 for text buttons). Gap (8) is always smaller than padding (16–64).
- **S** Icon size and gap are chosen by height bands: `iconSizeFor()` and `iconSpacingFor()` step at
  32/40/56/96/136 ([Button.kt][cmp-button]).
- **D** Corner radius of a square button: XS 12, S 12, M 16, L 28, XL 28; pressed 8, 8, 12, 16, 16
  ([button specs][m3-button-specs]).

### 1.4 Text fields count the icon's touch box, not the glyph

- **S** `TextFieldPadding = 16.dp`. When a leading or trailing icon is present, the field subtracts
  `(minimumInteractiveSize − 24) / 2` (12dp with a 48dp target) from that side, because "Icons are
  24dp but padded to … 48dp", so "we need to account for this visual discrepancy"
  ([TextFieldImpl.kt][cmp-textfield]).
- **A** The start padding becomes 16 − 12 = 4. The icon's 48dp box starts at 4, so the glyph starts at
  4 + 12 = 16dp, the same inset as text in a field without an icon. Material aligns the glyph, not the
  touch box.
- **S** Other field gaps: above-label padding 4, supporting-text top 4, prefix/suffix padding 2,
  minimum text line height 24 ([TextFieldImpl.kt][cmp-textfield]).

### 1.5 Lists and dividers

- **S** List item (Compose `ListTokens`): leading and trailing padding 16, top and bottom 10,
  between elements 12, leading and trailing icon 24. One-, two- and three-line heights are 56, 72
  and 88. Divider leading and trailing insets are 16, so dividers inset to the content edge
  ([ListTokens.kt][cmp-list]).
- **D** "Leading elements like thumbnails, avatars, or icons should always be aligned"
  ([M3 grids & spacing][m3-gs-spacing]).

### 1.6 Density

- **D** The component density scale starts at 0 and goes to −1, −2 and −3. "Higher density is
  typically applied by decreasing the top and bottom padding or overall height by 4dp". "Text size
  shouldn't change as the container size scales." Center the grouped element in the container.
  Don't make menus, snackbars or dialogs denser. Density is opt-in, settings controls keep 48×48
  targets, and density shouldn't change automatically across breakpoints ([M3 density][m3-density]).
- **D** Under the token system, density means "adapt vertical padding to different spacing values
  for each setting" ([applying spacing][m3-sp-apply]).
- **S** MDC Web implements the scale as `$interval: 4px` per step ([mdc-density][mdc-density]).
- **S** Compose has a newer precision-pointer mode (`shouldUsePrecisionPointerComponentSizing`,
  behind `ComposeMaterial3Flags.isPrecisionPointerComponentSizingEnabled`). When a mouse or other
  precise pointer is present, the default button minimum height is 36 instead of 40, vertical
  padding is 8 instead of 10, the icon-side padding is 12 instead of 16, and the menu icon-label
  arrangement spacing is 12 instead of 8 ([PrecisionPointer.kt][cmp-precision], [Button.kt L1069–1075,
  L1662–1677][cmp-button-1662], [MenuDefaults.kt][cmp-menu]). This is density driven by input
  device rather than by user choice.

### 1.7 Nested radius ("optical roundness")

- **D** Don't use the same corner radius for nested objects. "Outer radius - padding = inner radius",
  for example 48dp − 14dp = 34dp ([M3 corner radius scale][m3-shape]).

### 1.8 Icons and optical size

- **D** (M2 system icons) Icons are 24dp with a 20×20 live area and 2dp padding. The dense variant is
  20dp with a 16×16 live area. Keyline shapes: square 18×18, circle 20 diameter, vertical rectangle
  16×20, horizontal rectangle 20×16. The circle is drawn larger than the square so they look the same
  size. Corners are 2dp. "Optical corrections" are allowed, but only with the base geometric forms
  ([M2 system icons][m2-icons]).
- **D** Material Symbols variable axes: FILL 0–1, wght 100–700 (default 400), GRAD −50 to 200, opsz
  20–48. "Optical size offers a way to automatically adjust the stroke weight" as the size changes.
  Use a low grade such as −25 for light icons on dark backgrounds, and match the text's grade
  ([Material Symbols guide][mat-symbols]). The guide gives the static-font opsz default as both 48 and
  24 in different places, so treat that default as ambiguous.

### 1.9 Enforcement

- **D/S** Component attributes map to system tokens, and "spacing logic, like adaptive design or
  density, should be applied to the component attribute" ([tokens][m3-sp-tokens]). Compose token
  files carry a "GENERATED CODE - DO NOT MODIFY BY HAND" header ([ButtonSmallTokens.kt][cmp-tokens]).
  Some Compose values are hard-coded with TODOs that disagree with the tokens (XS padding and gap;
  `IconSize = 18.dp` vs a token value of 20). Even generated systems drift.

---

## 2. Fluent 2 (Microsoft)

### 2.1 Scale

- **D** "The base unit is four pixels." The global ramp is `sizeNone` 0, `size20` 2, `size40` 4,
  `size60` 6, `size80` 8, `size100` 10, `size120` 12, `size160` 16, `size200` 20, `size240` 24,
  `size280` 28, `size320` 32, `size360` 36, `size400` 40, `size480` 48, `size520` 52, `size560` 56.
  "The values 2, 6, and 10 account for extra padding in the Fluent icons." "Space is measured from an
  element's bounding box." Touch targets are 44×44 on iOS and web and 48×48 on Android
  ([Fluent 2 layout][fl-layout]).
- **S** The web tokens use t-shirt names, with "Nudge" steps for the off-grid values: `none` 0,
  `xxs` 2, `xs` 4, `sNudge` 6, `s` 8, `mNudge` 10, `m` 12, `l` 16, `xl` 20, `xxl` 24, `xxxl` 32.
  They are emitted twice, as `spacingHorizontal*` and `spacingVertical*`, with identical values
  ([spacings.ts][fl-spacings]). Radius tokens: 0, 2, 4, 6, 8, 12, 16, 24, 32, 40, circular. Stroke
  widths: 1, 2, 3, 4 ([borderRadius.ts][fl-radius], [strokeWidths.ts][fl-stroke]).
- **D** Alignment: "left-align text and center-align icons" in lists. Center objects (images, icons)
  and left-align text ([layout][fl-layout]).

### 2.2 Button: vertical padding written as height minus border minus content

**S** ([useButtonStyles.styles.ts L15–21, L63–69, L131–135, L291–318, L504–549][fl-button]):

| Size | Font / line height | Padding (v / h) | With icon (v) | Icon | Icon spacing | Min width |
|---|---|---|---|---|---|---|
| small | 12 / 16 | 3 / 8 | 1 | 20 | 4 (`XS`) | 64 |
| medium | 14 / 20 | 5 / 12 | 5 | 20 | 6 (`SNudge`) | 96 |
| large | 16 / 22 | 8 / 16 | 7 | 24 | 6 (`SNudge`) | 96 |

- **A** With a 1px border and `box-sizing: border-box`, every row adds up to a fixed height.
  Small: 1+3+16+3+1 = 24, and with an icon 1+1+20+1+1 = 24. Medium: 1+5+20+5+1 = 32. Large:
  1+8+22+8+1 = 40, and with an icon 1+7+24+7+1 = 40. The padding is not on the scale; it is the
  remainder. Fluent stores it as literal constants (`buttonSpacingSmall = '3px'` and so on), not as
  a formula.
- **S** Icon-only padding is 1 / 5 / 7, with minimum widths 24 / 32 / 40, so icon-only buttons are
  square at the same heights.
- **S** Horizontal padding does not change with an icon. The icon gets `margin-right` (or
  `margin-left` after the label) equal to the icon spacing variable.

### 2.3 Input: padding split between root and slot

- **S** Field heights are 24 / 32 / 40. Root horizontal padding is 6 / 10 / 12. The input slot adds
  2 / 2 / 6. When nothing comes before or after the text, the input slot gets the "combined" padding,
  8 / 12 / 18, so the text inset stays the same either way. Root `gap` is 2 (6 for large). Icons are
  16 / 20 / 24 ([useInputStyles.styles.ts L15–40, L116–130][fl-input]).
- **A** Medium text inset = 1 (border) + 12 = 13px. Icon inset = 1 + 10 = 11px. Icon-to-text =
  2 (gap) + 2 (slot padding) = 4px. So the icon side sits 2px closer to the edge than the text side.

### 2.4 Menu

- **S** MenuItem: padding 6 on all sides, `min-height` 32, `gap` 4, `align-items: start` (icons sit on
  the first line), 20px icons. The label has 2px horizontal padding, so text starts at 8 and the icon
  at 6, with a 6px icon-to-text distance ([useMenuItemStyles.styles.ts L22–40, L83–93][fl-menuitem]).
- **S** MenuPopover: padding 4, radius 4 (`borderRadiusMedium`), 1px transparent border. MenuList
  gap 2 ([MenuPopover styles][fl-menupopover], [MenuList styles][fl-menulist]).
- **A** Item radius (4) equals popover radius (4), so Fluent menus are not concentric.

### 2.5 Icons

- **D** 12px icons are informational and "generally too small for interactions". Product icons
  simplify their detail below 48px ([Fluent iconography][fl-icons]).
- **S** Fluent System Icons ships separate drawings per size. For example, `Add` exists at 12, 16, 20,
  24, 28, 32 and 48 in regular and filled ([assets/Add/SVG][fl-sysicons-add]).
- **A** Bar thickness, read from each `Add` regular path: 1px at 12, 16 and 20; 1.5px at 24 and 28;
  2px at 32; 2.5px at 48. Arm span as a share of the box: 12 → 8/12 (67%), 16 → 12/16 (75%),
  20 → 15/20 (75%), 24 → 17.5/24 (73%), 28 → 21.5/28 (77%), 32 → 26/32 (81%), 48 → 37.5/48 (78%).
  Stroke steps up with size, and the ink-to-box ratio is tuned per size. Small sizes are not scaled
  down from 24.

### 2.6 Enforcement

- **S** The repo runs visual regression in CI: `.github/workflows/pr-vrt.yml` ("Generate screenshots")
  and `vrt-baseline.yml` ([fluentui workflows][fl-vrt]). I found no spacing lint in the repo tree.
  Undocumented.

---

## 3. Apple HIG, UIKit and SwiftUI

### 3.1 Margins and guides

- **D** Layout guides "apply standard margins around content and restrict the width of text for
  optimal readability". Respect safe areas, margins and guides ([HIG Layout][hig-layout]).
- **D** `readableContentGuide`: it never extends beyond the layout margin guide, it is vertically
  centered inside it, and its width is at most the readable width for the current Dynamic Type size
  ([readableContentGuide][uk-readable]).
- **D** Layout margins are "the desired amount of space (measured in points) between the edge of the
  view and any subviews". A root view's margins reflect the system minimums plus safe-area insets. If
  you set less than the minimum, UIKit uses the minimum (example: 20pt minimum vs 10pt requested
  gives 20) ([layoutMargins][uk-margins], [directionalLayoutMargins][uk-dmargins],
  [systemMinimumLayoutMargins][uk-sysmin]). The current pages give no default numbers for subviews.
  Undocumented here.
- **D** SwiftUI `.padding()` with no length uses "a platform-specific default amount" chosen for the
  platform and presentation context. No number is documented ([padding(_:_:)][sui-padding]).
- **D** tvOS: inset primary content 60pt from the top and bottom and 80pt from the sides. Grid
  layouts use 40pt horizontal spacing and at least 100pt vertical spacing ([HIG Layout][hig-layout]).
- **D** "Align elements to make them easier to scan, and use indentation to convey hierarchy"
  ([HIG Layout][hig-layout]).

### 3.2 Alignment to text

- **D** `HorizontalAlignment.listRowSeparatorLeading` aligns a row's separator with a guide in the
  cell content, such as the leading edge of the title `Text` ([listRowSeparatorLeading][sui-sep]).
- **D** `VerticalAlignment.firstTextBaseline` aligns to the top-most text baseline in a view
  ([firstTextBaseline][sui-ftb]). Stacks center by default. `alignmentGuide` offsets individual
  children ([Aligning views within a stack][sui-stack]).

### 3.3 Nested shapes

- **D** `ConcentricRectangle`: a corner is concentric when "the corner's radius shares a common center
  with the containing shape's" corner. The shape computes each radius from its container, "without
  hard-coded values", and sheets and popovers do this automatically ([ConcentricRectangle][sui-concentric]).
  `ContainerRelativeShape` is "an inset version of the current container shape"
  ([ContainerRelativeShape][sui-crs]).

### 3.4 Buttons and hit regions

- **D** Hit region at least 44×44pt (60×60pt in visionOS). macOS image buttons have about 10px of
  padding between the image and the button edges. Flexible-height push buttons use "the same corner
  radius and content padding" as regular push buttons. visionOS sizes are mini 28, small 32,
  regular 44, large 52 and extra large 64pt. In visionOS, button centers should be at least 60pt
  apart ([HIG Buttons][hig-buttons]).

### 3.5 Icons and SF Symbols

- **D** Interface icons share one size, level of detail, stroke weight and perspective. Match icon
  weight to adjacent text. Center asymmetric icons optically by building the correction into the
  asset's padding. The HIG example is a download glyph moved up a few pixels, then centered
  geometrically ([HIG Icons][hig-icons]).
- **D** SF Symbols come in nine weights, each matching a San Francisco font weight. The three scales
  (small, medium, large) are "defined relative to the cap height" of SF. Choosing a scale changes
  emphasis without breaking weight matching ([HIG SF Symbols][hig-sf]).
- **D** Custom symbol templates: the scale factors are S 0.783, M 1.0 and L 1.29. "The system
  automatically centers symbols vertically to San Francisco's cap height." Inline in text, the
  baseline offset comes from the template's baseline guide, scaled by point size. Margins can be set
  per weight and scale variant, and can be negative "to aid with horizontal alignment", for example
  badged folders. Interpolation comes from Ultralight-S, Regular-S and Black-S, which yields 27
  variants ([Creating custom symbols][apple-custom-symbols]).

### 3.6 Type optical size

- **D** SF and NY are variable fonts with "dynamic optical sizes" that interpolate Text and Display
  continuously. The system adjusts tracking at every point size. macOS defaults to 13pt (minimum
  10pt). macOS Body is 13/16 and Headline is 13/16 bold ([HIG Typography][hig-typo]).

### 3.7 Enforcement

- Apple publishes templates and guides. I found no public lint or visual-regression tooling.
  Undocumented.

---

## 4. IBM Carbon

### 4.1 Scale and grid

- **D** Spacing tokens: `$spacing-01` 2, `-02` 4, `-03` 8, `-04` 12, `-05` 16, `-06` 24, `-07` 32,
  `-08` 40, `-09` 48, `-10` 64, `-11` 80, `-12` 96, `-13` 160. They are built from multiples of 2, 4
  and 8. Avoid deviating from the scale "whenever possible". Tokens aren't responsive, but you can
  step down a token at a breakpoint. A Stack component provides gaps so components don't need
  margins ([Carbon spacing][cb-spacing]).
- **D** 2x Grid: the base is an 8px "mini unit". Margins and padding are fixed mini-unit multiples.
  Box padding is 16px at every breakpoint. Gutters are optional, and a gutter totals 32px when each
  box's margin matches its padding. Type sits against the padding, never on it. Keep visible keylines
  where objects align. The fixed sizing scale (8, 16, 24, 32, 48, 64, 80) is used for icons, tiles
  and vertical margins. Use the "minor sizing scale" for cramped component interiors; its values
  aren't listed ([2x Grid][cb-2x]).

### 4.2 Component padding computed from the height token, minus the border

**S** ([button/_mixins.scss L39–68, L93–107][cb-btn-mixins], [utilities/_layout.scss L16–30][cb-layout]):

- Layout size tokens are `height` xs 24, sm 32, md 40, lg 48, xl 64 and 2xl 80. The density token
  `padding-inline` is 8 (condensed) or 16 (normal).
- `padding-block: min(calc((size(height) − 1lh)/2 − 1px), …)`, commented "-1px to compensate for
  border width".
- `padding-inline: calc(density(padding-inline) − 1px) calc(density(padding-inline) × 3 + 16px − 1px)`
  gives 15px at the start and 63px at the end at normal density. The end reserves a slot for a
  trailing 16px icon.
- The 16×16 icon is absolutely positioned. Its top uses the same formula `(height − 16)/2 − 1px`,
  and `inset-inline-end` is the density padding.
- Ghost buttons remove the extra end padding ([_vars.scss][cb-btn-vars]).

Carbon is the clearest case of padding derived from the control height, with the border subtracted
once, in code.

### 4.3 Icons

- **D** Icons are drawn on a 32×32 pixel grid with 2px padding, 2px strokes and 2px corner radii
  (radii increase in multiples of two). Use 45° angles, or 15° increments otherwise. Icons are "scaled
  down linearly" to other sizes. Key shapes exist, but the page doesn't list their dimensions
  ([IBM UI icons: design][ibm-icons]).
- **A** Linear scaling means a 16px icon has 1px strokes and a 20px icon 1.25px strokes.
- **D** Use 16px artboards by default (20, 24 and 32 allowed). 16 and 20px icons pair with 14 and 16px
  IBM Plex. Don't change the icon-to-text ratio. Next to text, center-align icons; don't baseline-align
  them. Touch targets are at least 44px. Icons need 4.5:1 contrast, like text. No icon-to-text gap is
  given ([Carbon icon usage][cb-icon-usage]).

### 4.4 Enforcement

- **S** The `e2e/` tests are accessibility (`*.avt.e2e.js`) ([Carbon e2e][cb-e2e]). I found no
  visual-regression or spacing-lint config in the tree. Undocumented.

---

## 5. Adobe Spectrum 2

### 5.1 Two scales: layout spacing and component spacing

- **D** "Layout spacing and component spacing scale at different rates." Spacing is "Relational,
  Proportional, Perceptual" ([Spectrum spacing][sp-spacing]).
- **D** Layout tokens follow a geometric progression that rounds to familiar numbers: `spacing-25` 1,
  `-50` 2, `-75` 4, `-85` 6, `-100` 8, `-200` 12, `-300` 16, `-350` 20, `-400` 24, `-500` 32,
  `-600` 40, `-700` 48, `-750` 56, `-800` 64, `-900` 80, `-1000` 96. Linear scales are criticised
  because a "4 px gap between an icon and label" stops fitting as components grow, and because large
  values lose perceptible difference ([layout spacing][sp-layout]). `spacing-750` is on the docs page
  but not in `layout.json` at the pinned commit.
- **D** Component spacing "follows its own geometric scales, each designed to reconcile the type scale
  and component sizes", which "is why some values are less round than you might expect". Spacing is
  organised by structural templates: base, group, list, container ([component spacing][sp-component]).

### 5.2 Tokens named by what they connect

**S** Desktop / mobile values from [layout.json][sp-layout-json] (the t-shirt index 50/75/100/200/300
is component size XS/S/M/L/XL):

| Token family | 50 | 75 | 100 | 200 | 300 |
|---|---|---|---|---|---|
| component-height | 20 / 26 | 24 / 30 | 32 / 40 | 40 / 50 | 48 / 60 |
| component-edge-to-text | 8 / 10 | 9 / 11 | 12 / 15 | 15 / 19 | 18 / 22 |
| component-edge-to-visual | 6 / 7 | 7 / 9 | 10 / 12 | 13 / 16 | 15 / 19 |
| component-edge-to-visual-only | 3 / 5 | 4 / 6 | 6 / 8 | 9 / 11 | 11 / 15 |
| component-pill-edge-to-text | — | 12 / 15 | 16 / 20 | 20 / 25 | 24 / 30 |
| component-pill-edge-to-visual | — | 10 / 13 | 14 / 17 | 18 / 22 | 21 / 27 |
| component-top-to-text | 3 / 4 | 4 / 5 | 6 / 8 | 9 / 12 | 12 / 15 |
| component-bottom-to-text | 3 / 6 | 5 / 6 | 9 / 11 | 11 / 14 | 14 / 18 |
| component-top-to-workflow-icon | 3 / 5 | 4 / 6 | 6 / 8 | 9 / 11 | 11 / 15 |
| text-to-visual | 5 / 7 | 5 / 7 | 6 / 8 | 7 / 9 | 8 / 10 |
| text-to-control | 4 / 5 | 9 / 11 | 10 / 13 | 11 / 14 | 13 / 16 |
| workflow-icon-size | 14 / 16 | 16 / 18 | 20 / 24 | 22 / 28 | 26 / 30 |

- **S** Font sizes: `font-size-75` 12 / 15, `-100` 14 / 17, `-200` 16 / 19. Mobile is about 1.25×
  desktop for heights and insets. The global `spacing-*` tokens have no platform split.
- **A** `edge-to-visual-only` = (height − icon) / 2 at every size: (32 − 20)/2 = 6, (24 − 16)/2 = 4,
  (40 − 22)/2 = 9, (48 − 26)/2 = 11, (20 − 14)/2 = 3. `top-to-workflow-icon-100` = (32 − 20)/2 = 6.
  Icon insets are derived from height. Text insets are named separately.
- **A** The icon side is always tighter than the text side: edge-to-visual 10 vs edge-to-text 12 at M;
  pill 14 vs 16.
- **A** Vertical text placement is asymmetric: top-to-text 6, bottom-to-text 9 at height 32.
  Spectrum CSS sets the button label's `line-height: 1.2` (commented "Hack to keep buttons at 32px")
  and pads it by (top-to-text − border) and (bottom-to-text − border) ([button index.css L330–341,
  L558–562][sp-css-button]). With a 2px border that is 2 + 4 + 16.8 + 7 + 2 ≈ 31.8, so the label's
  line box sits about 1.5px above the geometric center. The tokens encode an optical offset rather
  than centering the line box. Spectrum doesn't say whether this targets cap-height centering.
  Undocumented.
- **S** Newer structural tokens (with descriptions in the JSON): `base-padding-vertical` 2xs 2, xs 3,
  s 4, m 7, l 10, xl 13, 2xl 15, 3xl 19; `base-padding-horizontal` xs 8, s 10 / 8, m 12 / 10,
  l 16 / 12, xl 18 / 12, 2xl 20 / 14 (desktop / mobile; mobile is smaller here, unexplained);
  `base-gap` xs 4, s 4, m 6, l 6, xl 6, 2xl 8, 3xl 8, 4xl 10; `container-padding` 2xs 6, xs 8, s 12,
  m 16, l 20, xl 24, 2xl 32, 3xl 40; `group-gap` compact 2, xs 4, s 6, m 8, l 12, xl 16 (plus
  "spacious" variants); `accessory-gap` 3–9; `focus-indicator-gap` 2 ([layout.json][sp-layout-json]).
- **S** Corner radius grows by 1px per component size: `corner-radius-medium-size-*` xs 6, s 7, m 8,
  l 9, xl 10; small radius 3–6 ([layout.json][sp-layout-json]).

### 5.3 How Spectrum CSS applies them (borders counted once)

**S** ([spectrum-css button/index.css L21–26, L330–371, L401, L457–471][sp-css-button]):

- `edge-to-text` and `edge-to-visual` are each used as `calc(token − border-width)`. The border is
  `border-width-200` (2px).
- The icon gets `margin-inline-start: calc(edge-to-visual − edge-to-text)`, a negative pull, so the
  icon sits at the visual inset while the text keeps the text inset.
- `gap` = `text-to-visual`. The icon's top margin = `top-to-icon − border + (size difference)/2`.
- Radius = height / 2 (pill). Focus ring radius = button radius + focus-indicator gap, which is
  concentric outward.

### 5.4 Density

- **D** "To make a component more compact, decrease each spacing token by one step." Only collections
  and containers support density. In collections, density changes only the gap between items. In
  containers it changes all padding. Buttons and fields have no density variants
  ([component spacing][sp-component]).

### 5.5 Enforcement

- **D** Tokens are built into every component and published in the "S2 / Variables" Figma library.
  "A hardcoded 8px is just a number", whereas a token carries context and future updates
  ([component spacing][sp-component]).

---

## 6. Atlassian Design System

- **D** Base unit 8px (`space.100`). The suffix is a percentage of the base: `space.0` 0, `.025` 2,
  `.050` 4, `.075` 6, `.100` 8, `.150` 12, `.200` 16, `.250` 20, `.300` 24, `.400` 32, `.500` 40,
  `.600` 48, `.800` 64, `.1000` 80. Negative tokens run from −2 to −32 and are used to break out of
  container padding; prefer the Bleed primitive ([Atlassian spacing][atl-spacing]).
- **D** Usage bands:
  - Small (0–8): icon-to-text gaps, padding of small components (badges, icon buttons, table cells),
    gaps between repeating elements, input padding, card title/description/actions stack, and the
    trigger-to-menu gap.
  - Medium (12–24): padding of larger components such as buttons, avatar-to-content, card element
    stacks.
  - Large (32–80): page-level layout.
  - Plus an explicit "optical adjustment" principle: small corrections so standard spacing doesn't
    break alignment ([spacing][atl-spacing]).
- **S** New Button (`@atlaskit/button` 25.4.8, compiled CSS and class map in
  [button-base.js][atl-button]): default height 32 (2rem), `padding-block` 6, `padding-inline` 12,
  `column-gap` 4. Compact: height 24, `padding-block` 2, `padding-inline` 12, gap 4. With an icon
  before or after, the gap becomes 6 and the padding stays 12, so the icon side is **not** reduced.
  Icon buttons are 32×32 with zero inline padding.
- **S** Icons (`@atlaskit/icon` 38.0.2): sizes `medium` 16 (default) and `small` 12. The `spacing`
  prop is deprecated in favour of "a `Flex` wrapper with `cssMap` padding tokens", which moves icon
  padding out of the icon and into layout ([icon types.d.ts][atl-icon]).
- **S** Primitives (Box, Inline, Stack, Flex, Grid, Bleed, Pressable) apply spacing through token
  props ([primitives][atl-primitives]).
- **S** Enforcement through ESLint ([eslint-plugin-design-system README][atl-eslint]):
  - `use-tokens-space`: space tokens instead of hard-coded values.
  - `ensure-design-token-usage`: tokens instead of hard-coded values.
  - `use-latest-xcss-syntax`: space tokens in xcss.
  - `use-tokens-shape`: shape tokens.
  - `prefer-primitives` and `use-primitives-text`: education hints toward primitives.

---

## 7. GitHub Primer

### 7.1 Scale and control geometry (tokens)

**S** ([base/size/size.json5][pr-base], [functional/size/size.json5][pr-size],
[size-fine][pr-fine] / [size-coarse][pr-coarse], [radius.json5][pr-radius]; also on
[primer.style size][pr-size-doc]):

- Base sizes: 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 64, 80, 96, 112, 128, and negatives
  −2 to −48. Every base size has the Figma scopes `size` and `gap`.
- Control sizes: xsmall 24, small 28, medium 32, large 40, xlarge 48.
- `paddingBlock`: 2, 4, 6, 10, 14.
- `paddingInline` (condensed / normal / spacious): xsmall 4 / 8 / 12; small to xlarge 8 / 12 / 16.
- `gap`: xsmall and small 4; medium, large and xlarge 8.
- Stack padding and gap: condensed 8, normal 16, spacious 24.
- `controlStack` gap: auto 8 with a fine pointer, 12 to 16 with a coarse pointer. Spacing between
  controls widens for touch.
- `control.minTarget`: fine 16, coarse 44.
- Overlay padding 16 (condensed 8). Radius small 3, medium 6, large 12.
- **A** `paddingBlock` × 2 + 20 (body line height) = control height: 2+20+2 = 24, 4+20+4 = 28,
  6+20+6 = 32, 10+20+10 = 40, 14+20+14 = 48.

### 7.2 Button: fixed height, horizontal padding by density word

- **S** The base Button has `height: var(--control-medium-size)` (32), `padding: 0` plus
  `paddingInline-normal` (12), `gap: 8`, and a 1px border. Small: height 28, padding uses
  `paddingInline-condensed` (8), gap 4. Large: height 40, `paddingInline-spacious` (16), gap 8.
  Vertical centering comes from the fixed height plus flex centering, not from padding. When the
  label wraps, the content gets `padding-block: calc(paddingBlock − 2px)` and the line carries a
  `stylelint-disable … primer/spacing` comment. With a keyboard-chord hint, `padding-inline-end` is 6
  ([ButtonBase.module.css L1–30, L188–220, L228–239][pr-button]).
- **S** Leading and trailing visuals sit in a grid
  (`'leadingVisual text trailingVisual'`) at the label's line height ([ButtonBase.module.css][pr-button]).

### 7.3 Lists and inputs: visuals tighter than text

- **S** ActionList item: `padding-block` 6 (`control-medium-paddingBlock`), `padding-inline` 8
  (condensed), grid areas `spacer leadingAction leadingVisual content`, `align-items: start` (first-line
  alignment), with `margin-right: control-medium-gap` on the visual. The inset variant adds
  `margin-inline: 8` and `padding-block: 8` on the list, so item text lands at 8+8 = 16 from the
  overlay edge. Dividers go "on the wrapper that excludes leading visuals", so separators start at the
  text column, at `top: -7px` with a lint exemption ([ActionList.module.css L14–21, L41–50, L505–530][pr-actionlist]).
- **S** TextInput: with no visuals the input has 12px inline padding. With a leading visual the wrapper
  padding-left is 8, and every child except the last has `margin-right: 8`. The small input is `min-height` 28 with 3px
  vertical padding: 1+3+20+3+1 = 28, border counted ([TextInputWrapper.module.css][pr-input]).

### 7.4 Enforcement

- **S** `@primer/stylelint-config` includes `primer/spacing`, which "Enforces the use of spacing
  variables for margin and padding". It checks `padding`, `margin`, `top`, `right`, `bottom` and
  `left` only, not `gap`. Its replacement table also maps every token value ±1px (except 2 and 6) to
  that token and auto-fixes it, so a border-compensated 7px or 9px is silently "fixed" to 8. Authors
  must disable the rule for intentional ±1 values, as ButtonBase and ActionList do
  ([README][pr-stylelint], [plugins/spacing.js L23, L40–47][pr-stylelint-spacing]).
- **S** Visual regression: Playwright snapshots in `.playwright/snapshots/…` (about 7,769 PNGs in the
  tree), with `vrt.yml` and `vrt-reports.yml` workflows ([primer/react][pr-repo]).

---

## 8. Shopify Polaris

- **D/S** Base 4px; "space-100 is equal to 4px". Space tokens: 0, `025` 1, `050` 2, `100` 4, `150` 6,
  `200` 8, `300` 12, `400` 16, `500` 20, `600` 24, `800` 32, `1000` 40, `1200` 48, `1600` 64,
  `2000` 80, `2400` 96, `2800` 112, `3200` 128. Semantic tokens: `space-button-group-gap` 8,
  `space-card-gap` 16, `space-card-padding` 16, `space-table-cell-padding` 6 ([space.ts][po-space],
  [size.ts][po-size], [layout tokens doc][po-tokens-doc]).
- **D** Use space tokens for padding, margin and gap, and not for height, width or outline-offset.
  Prefer semantic tokens over primitives, and use a semantic token only for its declared selector (for
  example `space-card-padding` only inside Card). In Figma the tokens are reached through auto layout
  padding and gap inputs ([layout tokens][po-tokens-doc]).
- **S** Button ([Button.module.css L4, L30–31, L160–178, L215–250, L276–290][po-button]):
  - Gap 2 (`space-050`).
  - Micro: padding 4 / 8, min-height 28, which becomes 24 at md-up.
  - Slim / medium: 6 / 12, min-height 32, then 28 at md-up.
  - Large: 6 / 12, min-height 36, then 32 at md-up.
  - Icon-only: padding 4 (large 6, micro 2).
  - Plain and monochrome-plain buttons take a negative margin equal to their padding, so the label
    lines up with the surrounding content edge while the hit area keeps its padding.
- **D** Nesting: Do reduce the radius of inset surfaces. Don't give a nested surface the same or a
  larger radius. Don't change the radius of buttons or badges when nesting them. The concentric rule
  applies to surfaces, not controls. "Breaking alignment": alignment may be "mathematically
  inconsistent, but will be visually aligned", so use imaginary keylines, and break alignment only
  between separate containers, "never within the same container" ([spatial organization][po-spatial]).
- **D** Density: the admin is high-density by default. Action components such as option lists and
  popovers are built dense ([density][po-density]).
- **D** Bleed: "Content should never go beyond the edges of the parent container"
  ([Bleed][po-bleed]). BlockStack and InlineStack set spacing with a `gap` prop ([BlockStack][po-blockstack]).
  The React docs now point to Polaris web components (`s-stack`).
- **S** Enforcement: `stylelint-polaris`, for example `space/declaration-property-unit-disallowed-list`
  ("Disallows use of hard-coded px, em, and rem values on gap, margin, and padding") and other space
  and layout rule families ([rule doc][po-stylelint]).

---

## 9. Radix Themes

- **S** Space scale `--space-1` … `--space-9` = 4, 8, 12, 16, 24, 32, 40, 48, 64, each multiplied by
  `--scaling` (0.9, 0.95, 1, 1.05 or 1.1). Density here is one multiplier on the whole scale
  ([space.css][rx-space], [scaling.css][rx-scaling]).
- **S** Button ([base-button.css L42–60][rx-basebutton], [button.css L20–33, L50–110][rx-button]):

  | Size | Height | Padding x | Gap | Ghost padding x / y |
  |---|---|---|---|---|
  | 1 | 24 (space-5) | 8 | 4 | 8 / 4 |
  | 2 | 32 (space-6) | 12 | 8 | 8 / 4 |
  | 3 | 40 (space-7) | 16 | 12 | 12 / 6 |
  | 4 | 48 (space-8) | 24 | 12 | 16 / 8 |

  Ghost buttons also use a smaller gap (4 / 4 / 8 / 8). Radius is `max(radius-n, radius-full)`.
  Ghost buttons apply margin overrides
  `calc(margin − ghost-padding)`, the same optical-alignment trick as Polaris plain buttons.
- **S** Card padding for sizes 1–5: 12, 16, 24, 32, 48. Radius `radius-4/4/5/5/6`. `Inset` children
  bleed by `card padding − border width`, and the inset's inner radius is
  `card radius − border width` ([card.css L38–56, L163–166][rx-card], [base-card.css L13–45][rx-basecard]).
- **S** Menu, size 1: content padding 4, item height 24, item padding-left 24/1.2 = 20, right 8.
  Size 2: content padding 8, item padding-left 12. Separators take `margin-left` and `margin-right`
  equal to the item padding, so they align with item text ([base-menu.css L74–75, L106–142][rx-menu]).
- **S** Enforcement: Playwright visual-regression snapshots in
  `apps/playground/tests/__snapshots__/visual-regression.spec.ts-snapshots/` for Chromium, Firefox and
  WebKit ([radix themes repo][rx-repo]).

---

## 10. Vercel Geist

- **D** The Geist docs ([vercel.com/geist][gs-button]) have no spacing or layout-token page. The
  navigation lists Colors, Typography, Materials and Grid, plus components. A spacing system is
  undocumented.
- **M** Button, measured from the rendered docs page on 2026-10-17:

  | Size | Height | Font / line height | Radius | Text inset |
  |---|---|---|---|---|
  | small | 32 | 14 / 21 | 6 | 12 (button padding 6 + label `px-1.5` 6) |
  | medium (default) | 36 | 14 / 21 | 6 | 16 (10 + 6) |
  | large | 40 | 16 / 24 | 8 | 20 (14 + 6) |

  Buttons have no border. The text inset is split between the button and the label span, the same
  pattern as Fluent's input and Untitled's text slot. With a prefix icon (medium), the 14px icon sits
  13px from the edge and the label text 39px, so the icon side (13) is tighter than the text side (16)
  and icon-to-text is 12. Treat these values as observations, not specification.

---

## 11. Untitled UI (React, open source)

- **S** Tailwind spacing (4px unit). Button sizes ([button.tsx L19–52, L227][uu-button]):

  | Size | Padding (x / y) | Base gap | Icon | Font / line height |
  |---|---|---|---|---|
  | xs | 10 / 6 | 4 | 16 (stroke 2.25) | 14 / 20 |
  | sm | 12 / 8 | 4 | 20 | 14 / 20 |
  | md | 14 / 10 | 4 | 20 | 14 / 20 |
  | lg | 16 / 10 | 6 | 20 | 16 / 24 |
  | xl | 18 / 12 | 6 | 20 | 16 / 24 |

  The label `<span data-text>` adds `px-0.5` (2px) unless `noTextPadding` is set. Icon-only padding:
  8 / 8 / 10 / 12 / 14. The inner highlight is `before:rounded-[7px]` inside `rounded-lg` (8): inner
  radius = outer radius − 1px border.
- **A** Heights: 6+20+6 = 32, 8+20+8 = 36, 10+20+10 = 40, 10+24+10 = 44, 12+24+12 = 48. Icon-only
  heights match: 8+16+8, 8+20+8, 10+20+10, 12+20+12, 14+20+14.
- **A** Text inset = padding + 2. Icon inset = padding. Icon-to-text = gap + 2 (6 or 8). The text side
  is always 2px wider than the icon side.

---

## 12. shadcn/ui (new-york-v4)

- **S** Button ([button.tsx][sc-button]): `gap-2` (8), icons `size-4` (16).
  - default: `h-9 px-4 py-2`, with `has-[>svg]:px-3`.
  - sm: `h-8 gap-1.5 px-3`, with `has-[>svg]:px-2.5`.
  - lg: `h-10 px-6`, with `has-[>svg]:px-4`.
  - xs: `h-6 gap-1 px-2`, with `has-[>svg]:px-1.5` and 12px icons.

  The fixed `h-*` sets the height and flex centers the content.
- **A** `has-[>svg]` lowers padding on **both** sides whenever any icon child exists. The text side of a
  leading-icon button is therefore 12, not 16. This differs from Material and Spectrum, which shrink
  only the icon side.
- **S** Card: `py-6 gap-6`, and header, content and footer each have `px-6` ([card.tsx][sc-card]).
  Dropdown ([dropdown-menu.tsx L44, L76, L172][sc-menu]):
  - Content: `p-1 rounded-md border`.
  - Items: `px-2 py-1.5 gap-2 rounded-sm`.
  - `data-[inset]:pl-8` (32 = 8 + 16 + 8), so inset items align with items that have icons.
  - Separator: `-mx-1 my-1`, bleeding across the content padding.
- **S** Radius scale is multiplicative: `--radius` 10px, sm × 0.6 = 6, md × 0.8 = 8, xl × 1.4 = 14
  ([globals.css L50–56, L100][sc-globals]).
- **A** Menu outer radius 8, padding 4, item radius 6. Concentric would be 4, so shadcn menus are not
  concentric.

---

## 13. Linear and Figma (their own UI)

- **D** Linear's redesign aligned "labels, icons, and buttons, both vertically and horizontally" in the
  sidebar and tabs. It tested density "from very condensed to more spacious" and leaned on Apple
  standards. No numbers are published ([How we redesigned the Linear UI][ln-redesign]). The later
  refresh reduced icon usage and size, made tabs more compact and cut separators. A one-click dev
  toolbar toggle compared new against old to separate regressions from existing behavior, and
  exported token values were imported into Figma. Again no numbers ([Behind the latest design
  refresh][ln-refresh]).
- **D** Figma UI3: the blog gives no spacing or icon metrics. It notes that 200 new icons were
  hand-drawn, and that a condensed Auto Layout alignment grid was reverted because it "moved around too
  much" ([Behind our redesign: UI3][fg-ui3]). Figma's own UI spacing values are undocumented.
- **D** Figma the tool, as an enforcement medium:
  - New auto layout counts inside strokes in layout by default. Outside and center strokes are
    excluded. A frame can't shrink below its padding. This matches CSS border-box. It becomes the
    default for new frames in July 2026, and version switching ends in January 2027
    ([Use auto layout with CSS Flexbox in mind][fg-autolayout]).
  - Variable scopes include `GAP`, `WIDTH_HEIGHT`, `CORNER_RADIUS` and `STROKE_FLOAT`. The API list
    has no separate padding scope ([VariableScope][fg-scope]). Primer tags every base size with Figma
    scopes `size` and `gap` ([pr-base]).

---

## 14. EightShapes / Nathan Curtis, "Space in Design Systems" (2016)

**D** ([article][es-space]):

- In five libraries, space properties occurred more often than anything except color.
- Recommends a memorable base (most of his systems use 16) and a non-linear, doubling progression
  (2, 4, 8, 16, 32, 64) over linear 4-step scales, which give "too many choices too close together".
  Name steps with t-shirt sizes.
- Six concepts:
  - **inset**: equal padding on all sides.
  - **squish inset**: top and bottom reduced, in his system by 50%; used by buttons, table cells and
    list items.
  - **stretch inset**: taller vertical padding, for text inputs and textareas.
  - **stack**: vertical rhythm.
  - **inline**: horizontal, wrapping items.
  - **grid**.
- Don't put "padding" or "margin" in token names. Concepts map many-to-one to properties and must
  survive other platforms.
- Line height collides with inset and stack. His fix is a mixin that uses font size and line height
  to cancel the extra leading with negative margins, an early form of leading-trim.
- Density can be tuned by changing insets and stacks across a codebase.

---

## 15. Text-box trimming (the web primitive behind cap-height alignment)

- **D** CSS `text-box-trim` (`none | trim-start | trim-end | trim-both`) with `text-box-edge` (over
  edge: `text | cap | ex`; under edge: `text | alphabetic`), shorthand
  `text-box: trim-both cap alphabetic`. MDN lists it as Baseline "Newly available" since August 2026
  ([MDN text-box-trim][mdn-tbt]; spec: [CSS Inline Layout 3][css-inline3]).
- **D** Capsize sizes text by cap height and trims "the space above capital letters and below the
  baseline" using font metrics (`capHeight`, `ascent`, `descent`, `lineGap`, `unitsPerEm`). It
  supports `leading` or `lineGap`, and warns against putting other layout styles on the trimmed
  element ([Capsize README][capsize]).
- Of the systems above, only Spectrum's top/bottom-to-text pair encodes a non-centered line box. None
  documents using `text-box-trim` in components. Their control padding assumes line-box centering.

---

## 16. Synthesis

### 16.1 What most systems agree on

1. **A 4px base with a few off-grid sub-steps, for stated reasons.** Every system has 4 and 8, and
   nearly all have 2 and 6. Fluent says 2, 6 and 10 exist for icon padding. M3 calls 2, 4, 6, 10 and
   14 "nested units". Polaris and Spectrum go down to 1. Off-grid values are documented exceptions,
   not free choices.
2. **Control height is the independent variable.** Padding is either derived from it
   (Carbon's `(height − 1lh)/2 − 1px`; Fluent's and Primer's literal remainders; M3 and Untitled
   heights = 2 × padding + line height), or the height is fixed and content is flex-centered
   (Primer Button, Atlassian, shadcn, Geist). No system picks vertical padding independently of height.
3. **Borders are inside the box and counted once.** Carbon subtracts 1px with comments, Spectrum
   subtracts `border-width`, Fluent's literals add up to the height including the border, Radix insets
   by `padding − border`, and Figma's new auto layout includes inside strokes.
4. **Horizontal padding is larger than vertical (squish), and gaps are smaller than padding.** M3:
   gap 8–16 vs padding 16–64. Fluent: gap 4–6 vs padding 8–16. Radix: 4–12 vs 8–24. Primer: 4–8 vs
   8–16. Spectrum: text-to-visual 5–9 vs edge-to-text 8–18. Gaps grow with size, but more slowly than
   padding.
5. **Inner elements sit tighter than outer ones (proximity).** Material, Fluent, Carbon, Spectrum and
   Atlassian all state it. Spectrum adds that density changes only gaps in collections, and all
   padding in containers.
6. **Text edges are the alignment reference.**
   - Separators align with text: SwiftUI `listRowSeparatorLeading`, Primer ActionList, Radix menus,
     M3 list dividers inset 16.
   - Ghost or plain buttons cancel their padding with negative margins so labels sit on the content
     edge: Polaris, Radix.
   - Carbon puts type against the padding.
   - Fluent left-aligns text and centers icons in a column.
   - Inset menu items without icons are indented to the icon-text column (shadcn `pl-8`).
7. **Icons align to the first line in multiline rows** (Primer ActionList and Fluent MenuItem use
   `align-items: start`), and are centered on single-line labels. Carbon says center, never baseline.
8. **Icons are drawn per size with stroke and ink tuned per size**, not scaled from one master:
   - Fluent: 1 → 1.5 → 2 → 2.5px strokes, ink 67–81% of the box.
   - Material Symbols `opsz` 20–48.
   - SF Symbols: weight matched to text, scales relative to cap height (0.783 / 1 / 1.29), centered
     on cap height.
   - Exception: IBM draws at 32 and scales linearly.
   - Keyline shapes give circles more size than squares (M2: 20 vs 18).
   - Optical centering lives in the asset's padding (HIG) or in symbol margins, which can be negative
     (SF).
9. **Density moves padding and gaps, never type size**: M3 (−4dp per step), Spectrum (one token step),
   Primer (condensed / normal / spacious, and fine vs coarse pointer), Radix (a multiplier). M3 and
   Primer both tie density to pointer precision.
10. **Consistency is enforced by machines, not reviewers alone**: token-only lint (Primer `primer/spacing`,
    Polaris `space/*`, Atlassian `use-tokens-space`), Playwright or Storybook visual regression (Primer,
    Fluent, Radix), Figma variables wired into auto layout (Polaris, Spectrum S2, Primer scopes), and
    token names that encode the relationship (Spectrum `edge-to-text`, M3 "leading padding").

### 16.2 Where they differ

| Question | Position A | Position B |
|---|---|---|
| Scale shape | Linear multipliers: M3 (8 × n), Atlassian (8 × %), Polaris (4 × %), Primer (literal px) | Geometric: Spectrum layout spacing, EightShapes doubling |
| Icon side vs text side | Icon side tighter: M3 (16 vs 24), Spectrum (10 vs 12), Primer input (8 vs 12), Untitled and Fluent menu (2px), Geist (13 vs 16) | Same on both sides: Atlassian button (12 / 12, gap grows instead), Fluent button. Both sides shrink: shadcn |
| Where the icon gap lives | Container `gap` (Primer, Radix, Spectrum, shadcn) | Icon margin (Fluent `--fui-Button__icon--spacing`), or gap plus text-span padding (Untitled, Geist, Fluent input) |
| Vertical text position | Line box centered (most) | Optically offset: Spectrum top 6 / bottom 9 at 32. M2 allows type off the 4dp grid when centered |
| Nested radius | Concentric: M3 formula, Apple ConcentricRectangle, Radix (− border), Spectrum focus ring (+ gap), Polaris surfaces | Not concentric: Fluent menu (4 / 4), shadcn menu (8 / 4 / 6). Polaris exempts buttons and badges |
| Density | Additive steps (M3 −4dp, Spectrum one token step, Primer words) | Multiplicative (Radix `--scaling`) |
| Lint coverage | Padding, margin and gap (Polaris) | Padding and margin only, with ±1px auto-fixed to the token (Primer): hazardous for border compensation |
| Icon production | Per-size drawings (Fluent, Material Symbols opsz, SF Symbols interpolation) | One master scaled linearly (IBM) |

### 16.3 Auditor checklist (per component, per size)

Measure at 1x in the rendered app with computed styles and range rects, not screenshots. Record each
value against the spec.

| # | Measure | Expected | Defect |
|---|---|---|---|
| 1 | Outer height vs the size token | Exact | Any difference ≥ 0.5px |
| 2 | Vertical budget: border-top + padding-top + line box (or icon box) + padding-bottom + border-bottom | Sums to the height, borders counted once | Sum ≠ height; border counted twice or not at all; text and icon variants differ in height |
| 3 | Text-side inset: outer edge to the first text range rect | Spec value per size; symmetric when there is no icon | Asymmetry > 0.5px; doesn't increase with size |
| 4 | Icon-side inset: outer edge to the icon box | Spec value, ≤ text-side inset (or explicitly equal if the system chooses that) | Icon side wider than text side; inconsistent across sibling components of the same size |
| 5 | Icon-to-label gap: icon box to text rect | Gap token for the size; gap < horizontal padding; not decreasing as size grows | gap ≥ padding; non-monotonic across sizes; varies between components of the same size |
| 6 | Icon box and glyph | Square box at the size's icon token; glyph drawn for that size (stroke per the family's ramp); whole-pixel box origin | Non-square box; a scaled drawing at the wrong stroke; box at half-pixel offsets |
| 7 | Vertical centering | Icon center equals the label line-box center, or the cap-height center if the system says so, consistently within ±0.5px | Mixed rules across components; the offset changes with size without a documented reason |
| 8 | Multiline | Leading visual aligned to the first line (box top equals line top + (line height − icon)/2) | Icon centered on a multi-line block |
| 9 | Shared columns | In lists, menus, headers and toolbars, text start x is the same for rows with and without icons (inset rows indent to the text column); separators start at the text column or span full bleed by design | Ragged text column; separators at arbitrary x |
| 10 | Edge alignment of quiet controls | Ghost or plain buttons at a container edge put their label (not their hover box) on the content edge, when the system uses that rule | Label offset by the button's padding |
| 11 | Nested radius | Surface inside a surface: inner = outer − inset (± border width) within 1px; focus ring = radius + offset; controls keep their own radius | Same or larger inner radius on nested surfaces; focus ring not concentric |
| 12 | Gap hierarchy | Inside-control gap < row padding < group gap < section gap (proximity) | An inner gap ≥ an outer gap at the same level |
| 13 | Values on the scale | Every literal is a token value, or a recorded exception (border compensation, icon padding, optical offset) with its arithmetic | Unexplained off-scale value; ±1px value without a recorded reason |
| 14 | Density | Changing density changes only padding and gap (and height, through them); type size and icon size stay fixed; hit targets meet the minimum | Font or icon size changes with density; a target drops below the minimum |
| 15 | Verification | Value lint (padding, margin, gap) + a per-size visual-regression snapshot + a measurement script output in the spec | A check that covers padding but not gap, or that auto-fixes ±1px compensation |

---

## Sources

Each label below is the reference ID used in the text.

- `m3-sp-overview`: <https://m3.material.io/styles/spacing/overview>
- `m3-sp-apply`: <https://m3.material.io/styles/spacing/applying-spacing>
- `m3-sp-tokens`: <https://m3.material.io/styles/spacing/tokens>
- `m3-gs-spacing`: <https://m3.material.io/foundations/layout/grids-spacing/spacing>
- `m3-density`: <https://m3.material.io/foundations/layout/grids-spacing/density>
- `m3-button-specs`: <https://m3.material.io/components/buttons/specs>
- `m3-shape`: <https://m3.material.io/styles/shape/corner-radius-scale>
- `m2-spacing`: <https://m2.material.io/design/layout/spacing-methods.html>
- `m2-icons`: <https://m2.material.io/design/iconography/system-icons.html>
- `mat-symbols`: <https://developers.google.com/fonts/docs/material_symbols>
- `cmp-button`: <https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt>
- `cmp-button-922`: <https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt#L922-L925>
- `cmp-button-1662`: <https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt#L1662-L1677>
- `cmp-tokens`: <https://github.com/androidx/androidx/tree/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens>
- `cmp-list`: <https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ListTokens.kt>
- `cmp-textfield`: <https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/internal/TextFieldImpl.kt>
- `cmp-precision`: <https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/PrecisionPointer.kt>
- `cmp-menu`: <https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MenuDefaults.kt>
- `mdc-density`: <https://github.com/material-components/material-components-web/blob/6ceadb81df50/packages/mdc-density/_density.scss>
- `fl-layout`: <https://fluent2.microsoft.design/layout>
- `fl-icons`: <https://fluent2.microsoft.design/iconography>
- `fl-spacings`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/tokens/src/global/spacings.ts>
- `fl-radius`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/tokens/src/global/borderRadius.ts>
- `fl-stroke`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/tokens/src/global/strokeWidths.ts>
- `fl-button`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-button/library/src/components/Button/useButtonStyles.styles.ts>
- `fl-input`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-input/library/src/components/Input/useInputStyles.styles.ts>
- `fl-menuitem`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-menu/library/src/components/MenuItem/useMenuItemStyles.styles.ts>
- `fl-menupopover`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-menu/library/src/components/MenuPopover/useMenuPopoverStyles.styles.ts>
- `fl-menulist`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-menu/library/src/components/MenuList/useMenuListStyles.styles.ts>
- `fl-sysicons-add`: <https://github.com/microsoft/fluentui-system-icons/tree/a347af95478f/assets/Add/SVG>
- `fl-vrt`: <https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/.github/workflows/pr-vrt.yml>
- `hig-layout`: <https://developer.apple.com/design/human-interface-guidelines/layout>
- `hig-buttons`: <https://developer.apple.com/design/human-interface-guidelines/buttons>
- `hig-icons`: <https://developer.apple.com/design/human-interface-guidelines/icons>
- `hig-sf`: <https://developer.apple.com/design/human-interface-guidelines/sf-symbols>
- `hig-typo`: <https://developer.apple.com/design/human-interface-guidelines/typography>
- `apple-custom-symbols`: <https://developer.apple.com/documentation/technologyoverviews/custom-sf-symbols>
- `uk-readable`: <https://developer.apple.com/documentation/uikit/uiview/readablecontentguide>
- `uk-margins`: <https://developer.apple.com/documentation/uikit/uiview/layoutmargins>
- `uk-dmargins`: <https://developer.apple.com/documentation/uikit/uiview/directionallayoutmargins>
- `uk-sysmin`: <https://developer.apple.com/documentation/uikit/uiviewcontroller/systemminimumlayoutmargins>
- `sui-padding`: <https://developer.apple.com/documentation/swiftui/view/padding(_:_:)>
- `sui-sep`: <https://developer.apple.com/documentation/swiftui/horizontalalignment/listrowseparatorleading>
- `sui-ftb`: <https://developer.apple.com/documentation/swiftui/verticalalignment/firsttextbaseline>
- `sui-stack`: <https://developer.apple.com/documentation/swiftui/aligning-views-within-a-stack>
- `sui-concentric`: <https://developer.apple.com/documentation/swiftui/concentricrectangle>
- `sui-crs`: <https://developer.apple.com/documentation/swiftui/containerrelativeshape>
- `cb-spacing`: <https://carbondesignsystem.com/elements/spacing/overview/>
- `cb-2x`: <https://carbondesignsystem.com/elements/2x-grid/overview/>
- `cb-icon-usage`: <https://carbondesignsystem.com/elements/icons/usage/>
- `cb-btn-mixins`: <https://github.com/carbon-design-system/carbon/blob/48192318ce86/packages/styles/scss/components/button/_mixins.scss>
- `cb-btn-vars`: <https://github.com/carbon-design-system/carbon/blob/48192318ce86/packages/styles/scss/components/button/_vars.scss>
- `cb-layout`: <https://github.com/carbon-design-system/carbon/blob/48192318ce86/packages/styles/scss/utilities/_layout.scss>
- `cb-e2e`: <https://github.com/carbon-design-system/carbon/tree/48192318ce86/e2e>
- `ibm-icons`: <https://www.ibm.com/design/language/iconography/ui-icons/design/>
- `sp-spacing`: <https://spectrum.adobe.com/page/spacing/>
- `sp-layout`: <https://spectrum.adobe.com/foundations/layout-and-structure/spacing/layout-spacing>
- `sp-component`: <https://spectrum.adobe.com/foundations/layout-and-structure/spacing/component-spacing>
- `sp-layout-json`: <https://github.com/adobe/spectrum-design-data/blob/6dd8e710db85/packages/tokens/src/layout.json>
- `sp-css-button`: <https://github.com/adobe/spectrum-css/blob/70d3660a992a/components/button/index.css>
- `atl-spacing`: <https://atlassian.design/foundations/spacing>
- `atl-primitives`: <https://atlassian.design/components/primitives/overview>
- `atl-eslint`: <https://unpkg.com/@atlaskit/eslint-plugin-design-system/README.md>
- `atl-button`: <https://unpkg.com/@atlaskit/button@25.4.8/dist/es2019/new-button/variants/shared/button-base.js>
- `atl-icon`: <https://unpkg.com/@atlaskit/icon@38.0.2/dist/types/types.d.ts>
- `pr-base`: <https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/base/size/size.json5>
- `pr-size`: <https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/size.json5>
- `pr-fine`: <https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/size-fine.json5>
- `pr-coarse`: <https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/size-coarse.json5>
- `pr-radius`: <https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/radius.json5>
- `pr-size-doc`: <https://primer.style/product/primitives/size/>
- `pr-button`: <https://github.com/primer/react/blob/7f96c0d5f955/packages/react/src/Button/ButtonBase.module.css>
- `pr-actionlist`: <https://github.com/primer/react/blob/7f96c0d5f955/packages/react/src/ActionList/ActionList.module.css>
- `pr-input`: <https://github.com/primer/react/blob/7f96c0d5f955/packages/react/src/internal/components/TextInputWrapper.module.css>
- `pr-stylelint`: <https://github.com/primer/stylelint-config/blob/e56e37aa89d8/README.md>
- `pr-stylelint-spacing`: <https://github.com/primer/stylelint-config/blob/e56e37aa89d8/plugins/spacing.js>
- `pr-repo`: <https://github.com/primer/react/tree/7f96c0d5f955/.playwright/snapshots>
- `po-space`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris-tokens/src/themes/base/space.ts>
- `po-size`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris-tokens/src/size.ts>
- `po-tokens-doc`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/design/layout/layout-tokens.mdx>
- `po-spatial`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/design/layout/spacial-organization.mdx>
- `po-density`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/design/layout/density.mdx>
- `po-bleed`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/components/layout-and-structure/bleed.mdx>
- `po-blockstack`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/components/layout-and-structure/block-stack.mdx>
- `po-button`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris-react/src/components/Button/Button.module.css>
- `po-stylelint`: <https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/tools/stylelint-polaris/rules/space-declaration-property-unit-disallowed-list.mdx>
- `rx-space`: <https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/styles/tokens/space.css>
- `rx-scaling`: <https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/styles/tokens/scaling.css>
- `rx-basebutton`: <https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/_internal/base-button.css>
- `rx-button`: <https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/button.css>
- `rx-card`: <https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/card.css>
- `rx-basecard`: <https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/_internal/base-card.css>
- `rx-menu`: <https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/_internal/base-menu.css>
- `rx-repo`: <https://github.com/radix-ui/themes/tree/1faff10ac26a/apps/playground/tests>
- `gs-button`: <https://vercel.com/geist/button>
- `uu-button`: <https://github.com/untitleduico/react/blob/1d410cb8facd/components/base/buttons/button.tsx>
- `sc-button`: <https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/registry/new-york-v4/ui/button.tsx>
- `sc-card`: <https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/registry/new-york-v4/ui/card.tsx>
- `sc-menu`: <https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/registry/new-york-v4/ui/dropdown-menu.tsx>
- `sc-globals`: <https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/app/globals.css>
- `ln-redesign`: <https://linear.app/now/how-we-redesigned-the-linear-ui>
- `ln-refresh`: <https://linear.app/now/behind-the-latest-design-refresh>
- `fg-ui3`: <https://www.figma.com/blog/behind-our-redesign-ui3/>
- `fg-autolayout`: <https://help.figma.com/hc/en-us/articles/42031586813719>
- `fg-scope`: <https://developers.figma.com/docs/plugins/api/VariableScope/>
- `es-space`: <https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62>
- `mdn-tbt`: <https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim>
- `css-inline3`: <https://drafts.csswg.org/css-inline-3/#leading-trim>
- `capsize`: <https://github.com/seek-oss/capsize/blob/1fcf40ae804b/README.md>

[m3-sp-overview]: https://m3.material.io/styles/spacing/overview
[m3-sp-apply]: https://m3.material.io/styles/spacing/applying-spacing
[m3-sp-tokens]: https://m3.material.io/styles/spacing/tokens
[m3-gs-spacing]: https://m3.material.io/foundations/layout/grids-spacing/spacing
[m3-density]: https://m3.material.io/foundations/layout/grids-spacing/density
[m3-button-specs]: https://m3.material.io/components/buttons/specs
[m3-shape]: https://m3.material.io/styles/shape/corner-radius-scale
[m2-spacing]: https://m2.material.io/design/layout/spacing-methods.html
[m2-icons]: https://m2.material.io/design/iconography/system-icons.html
[mat-symbols]: https://developers.google.com/fonts/docs/material_symbols
[cmp-button]: https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt
[cmp-button-922]: https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt#L922-L925
[cmp-button-1662]: https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/Button.kt#L1662-L1677
[cmp-tokens]: https://github.com/androidx/androidx/tree/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens
[cmp-list]: https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ListTokens.kt
[cmp-textfield]: https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/internal/TextFieldImpl.kt
[cmp-precision]: https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/PrecisionPointer.kt
[cmp-menu]: https://github.com/androidx/androidx/blob/9a589fa61f86/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/MenuDefaults.kt
[mdc-density]: https://github.com/material-components/material-components-web/blob/6ceadb81df50/packages/mdc-density/_density.scss
[fl-layout]: https://fluent2.microsoft.design/layout
[fl-icons]: https://fluent2.microsoft.design/iconography
[fl-spacings]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/tokens/src/global/spacings.ts
[fl-radius]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/tokens/src/global/borderRadius.ts
[fl-stroke]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/tokens/src/global/strokeWidths.ts
[fl-button]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-button/library/src/components/Button/useButtonStyles.styles.ts
[fl-input]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-input/library/src/components/Input/useInputStyles.styles.ts
[fl-menuitem]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-menu/library/src/components/MenuItem/useMenuItemStyles.styles.ts
[fl-menupopover]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-menu/library/src/components/MenuPopover/useMenuPopoverStyles.styles.ts
[fl-menulist]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/packages/react-components/react-menu/library/src/components/MenuList/useMenuListStyles.styles.ts
[fl-sysicons-add]: https://github.com/microsoft/fluentui-system-icons/tree/a347af95478f/assets/Add/SVG
[fl-vrt]: https://github.com/microsoft/fluentui/blob/f02cfa8f8d73/.github/workflows/pr-vrt.yml
[hig-layout]: https://developer.apple.com/design/human-interface-guidelines/layout
[hig-buttons]: https://developer.apple.com/design/human-interface-guidelines/buttons
[hig-icons]: https://developer.apple.com/design/human-interface-guidelines/icons
[hig-sf]: https://developer.apple.com/design/human-interface-guidelines/sf-symbols
[hig-typo]: https://developer.apple.com/design/human-interface-guidelines/typography
[apple-custom-symbols]: https://developer.apple.com/documentation/technologyoverviews/custom-sf-symbols
[uk-readable]: https://developer.apple.com/documentation/uikit/uiview/readablecontentguide
[uk-margins]: https://developer.apple.com/documentation/uikit/uiview/layoutmargins
[uk-dmargins]: https://developer.apple.com/documentation/uikit/uiview/directionallayoutmargins
[uk-sysmin]: https://developer.apple.com/documentation/uikit/uiviewcontroller/systemminimumlayoutmargins
[sui-padding]: https://developer.apple.com/documentation/swiftui/view/padding(_:_:)
[sui-sep]: https://developer.apple.com/documentation/swiftui/horizontalalignment/listrowseparatorleading
[sui-ftb]: https://developer.apple.com/documentation/swiftui/verticalalignment/firsttextbaseline
[sui-stack]: https://developer.apple.com/documentation/swiftui/aligning-views-within-a-stack
[sui-concentric]: https://developer.apple.com/documentation/swiftui/concentricrectangle
[sui-crs]: https://developer.apple.com/documentation/swiftui/containerrelativeshape
[cb-spacing]: https://carbondesignsystem.com/elements/spacing/overview/
[cb-2x]: https://carbondesignsystem.com/elements/2x-grid/overview/
[cb-icon-usage]: https://carbondesignsystem.com/elements/icons/usage/
[cb-btn-mixins]: https://github.com/carbon-design-system/carbon/blob/48192318ce86/packages/styles/scss/components/button/_mixins.scss
[cb-btn-vars]: https://github.com/carbon-design-system/carbon/blob/48192318ce86/packages/styles/scss/components/button/_vars.scss
[cb-layout]: https://github.com/carbon-design-system/carbon/blob/48192318ce86/packages/styles/scss/utilities/_layout.scss
[cb-e2e]: https://github.com/carbon-design-system/carbon/tree/48192318ce86/e2e
[ibm-icons]: https://www.ibm.com/design/language/iconography/ui-icons/design/
[sp-spacing]: https://spectrum.adobe.com/page/spacing/
[sp-layout]: https://spectrum.adobe.com/foundations/layout-and-structure/spacing/layout-spacing
[sp-component]: https://spectrum.adobe.com/foundations/layout-and-structure/spacing/component-spacing
[sp-layout-json]: https://github.com/adobe/spectrum-design-data/blob/6dd8e710db85/packages/tokens/src/layout.json
[sp-css-button]: https://github.com/adobe/spectrum-css/blob/70d3660a992a/components/button/index.css
[atl-spacing]: https://atlassian.design/foundations/spacing
[atl-primitives]: https://atlassian.design/components/primitives/overview
[atl-eslint]: https://unpkg.com/@atlaskit/eslint-plugin-design-system/README.md
[atl-button]: https://unpkg.com/@atlaskit/button@25.4.8/dist/es2019/new-button/variants/shared/button-base.js
[atl-icon]: https://unpkg.com/@atlaskit/icon@38.0.2/dist/types/types.d.ts
[pr-base]: https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/base/size/size.json5
[pr-size]: https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/size.json5
[pr-fine]: https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/size-fine.json5
[pr-coarse]: https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/size-coarse.json5
[pr-radius]: https://github.com/primer/primitives/blob/66e78d332cc5/src/tokens/functional/size/radius.json5
[pr-size-doc]: https://primer.style/product/primitives/size/
[pr-button]: https://github.com/primer/react/blob/7f96c0d5f955/packages/react/src/Button/ButtonBase.module.css
[pr-actionlist]: https://github.com/primer/react/blob/7f96c0d5f955/packages/react/src/ActionList/ActionList.module.css
[pr-input]: https://github.com/primer/react/blob/7f96c0d5f955/packages/react/src/internal/components/TextInputWrapper.module.css
[pr-stylelint]: https://github.com/primer/stylelint-config/blob/e56e37aa89d8/README.md
[pr-stylelint-spacing]: https://github.com/primer/stylelint-config/blob/e56e37aa89d8/plugins/spacing.js
[pr-repo]: https://github.com/primer/react/tree/7f96c0d5f955/.playwright/snapshots
[po-space]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris-tokens/src/themes/base/space.ts
[po-size]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris-tokens/src/size.ts
[po-tokens-doc]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/design/layout/layout-tokens.mdx
[po-spatial]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/design/layout/spacial-organization.mdx
[po-density]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/design/layout/density.mdx
[po-bleed]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/components/layout-and-structure/bleed.mdx
[po-blockstack]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/components/layout-and-structure/block-stack.mdx
[po-button]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris-react/src/components/Button/Button.module.css
[po-stylelint]: https://github.com/Shopify/polaris/blob/3f7954ae42fa/polaris.shopify.com/content/tools/stylelint-polaris/rules/space-declaration-property-unit-disallowed-list.mdx
[rx-space]: https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/styles/tokens/space.css
[rx-scaling]: https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/styles/tokens/scaling.css
[rx-basebutton]: https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/_internal/base-button.css
[rx-button]: https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/button.css
[rx-card]: https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/card.css
[rx-basecard]: https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/_internal/base-card.css
[rx-menu]: https://github.com/radix-ui/themes/blob/1faff10ac26a/packages/radix-ui-themes/src/components/_internal/base-menu.css
[rx-repo]: https://github.com/radix-ui/themes/tree/1faff10ac26a/apps/playground/tests
[gs-button]: https://vercel.com/geist/button
[uu-button]: https://github.com/untitleduico/react/blob/1d410cb8facd/components/base/buttons/button.tsx
[sc-button]: https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/registry/new-york-v4/ui/button.tsx
[sc-card]: https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/registry/new-york-v4/ui/card.tsx
[sc-menu]: https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/registry/new-york-v4/ui/dropdown-menu.tsx
[sc-globals]: https://github.com/shadcn-ui/ui/blob/d2fba50ee5b9/apps/v4/app/globals.css
[ln-redesign]: https://linear.app/now/how-we-redesigned-the-linear-ui
[ln-refresh]: https://linear.app/now/behind-the-latest-design-refresh
[fg-ui3]: https://www.figma.com/blog/behind-our-redesign-ui3/
[fg-autolayout]: https://help.figma.com/hc/en-us/articles/42031586813719
[fg-scope]: https://developers.figma.com/docs/plugins/api/VariableScope/
[es-space]: https://medium.com/eightshapes-llc/space-in-design-systems-188bcbae0d62
[mdn-tbt]: https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
[css-inline3]: https://drafts.csswg.org/css-inline-3/#leading-trim
[capsize]: https://github.com/seek-oss/capsize/blob/1fcf40ae804b/README.md

