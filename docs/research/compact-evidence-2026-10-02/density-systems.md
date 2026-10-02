# Density step-down in other design systems

Extracted 2026-10-02 from installed npm packages (pins are package@version path:line). Rows marked * are computed/inferred, not read as a literal. "HELD" = same value in both densities.

## Ant Design v5 (compactAlgorithm)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| UI body text size | 14 | 12 | -2 | -14.3% | antd@5.29.3 lib/theme/themes/compact/index.js:14 (fontSize = fontSizeSM); seed.js:40 | Compact rebuilds the whole font ramp from fontSizeSM (12). Values computed with theme.getDesignToken(). |
| UI body line height (px) | 22 | 20 | -2 | -9.1% | antd@5.29.3 lib/theme/themes/shared/genFontSizes.js:8-10; genFontMapToken.js:32 | lineHeight=(size+8)/size, so the line box shrinks 2px, ratio grows 1.571->1.667 |
| Small text size (fontSizeSM) | 12 | 10 | -2 | -16.7% | antd@5.29.3 lib/theme/themes/shared/genFontMapToken.js:20 |  |
| Large text size (fontSizeLG) | 16 | 14 | -2 | -12.5% | antd@5.29.3 lib/theme/themes/shared/genFontMapToken.js:22 |  |
| Heading 1 size | 38 | 32 | -6 | -15.8% | antd@5.29.3 lib/theme/themes/shared/genFontMapToken.js:24 |  |
| Control height md (controlHeight) | 32 | 28 | -4 | -12.5% | antd@5.29.3 lib/theme/themes/compact/index.js:15; seed.js:62 | controlHeight - 4 |
| Control height sm (controlHeightSM) | 24 | 21 | -3 | -12.5% | antd@5.29.3 lib/theme/themes/shared/genControlHeight.js:12 | 0.75 x controlHeight; non-integer 21 |
| Control height lg (controlHeightLG) | 40 | 35 | -5 | -12.5% | antd@5.29.3 lib/theme/themes/shared/genControlHeight.js:14 | 1.25 x controlHeight |
| Control height xs | 16 | 14 | -2 | -12.5% | antd@5.29.3 lib/theme/themes/shared/genControlHeight.js:13 |  |
| Control horizontal padding (controlPaddingHorizontal, inputs/select/dropdown items) | 12 | 12 | 0 | 0% | antd@5.29.3 lib/theme/util/alias.js:96 | HELD: literal 12, not derived from size ramp |
| Control horizontal padding sm | 8 | 8 | 0 | 0% | antd@5.29.3 lib/theme/util/alias.js:97 | HELD |
| Button horizontal padding (md) | 15 | 11 | -4 | -26.7% | antd@5.29.3 lib/button/style/token.js:51 | paddingContentHorizontal(16->12) - lineWidth |
| Button horizontal padding (sm) | 7 | 7 | 0 | 0% | antd@5.29.3 lib/button/style/token.js:53 | HELD: literal 8 - lineWidth |
| Icon size (fontSizeIcon) | 12 | 10 | -2 | -16.7% | antd@5.29.3 lib/theme (getDesignToken) -> fontSizeSM | follows fontSizeSM |
| Menu item icon size | 14 | 12 | -2 | -14.3% | antd@5.29.3 lib/menu/style/index.js:449 | = fontSize |
| Icon-label gap (button iconGap) | 8 | 4 | -4 | -50% | antd@5.29.3 lib/button/style/token.js:41 | = marginXS (8->4) |
| Icon-label gap (menu iconMarginInlineEnd) | 10 | 9 | -1 | -10% | antd@5.29.3 lib/menu/style/index.js:450 | controlHeightSM - fontSize |
| Spacing ramp sizeXXS | 4 | 4 | 0 | 0% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:22; shared/genSizeMapToken.js:29 | sizeStep 4 -> 2 (compactSizeStep = sizeStep-2), sizeUnit 4 |
| Spacing ramp sizeXS (paddingXS/marginXS) | 8 | 4 | -4 | -50% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:21 |  |
| Spacing ramp sizeSM (paddingSM) | 12 | 8 | -4 | -33.3% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:20 |  |
| Spacing ramp size (padding/margin) | 16 | 8 | -8 | -50% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:19 | halved |
| Spacing ramp sizeMS | 16 | 12 | -4 | -25% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:18 |  |
| Spacing ramp sizeMD (paddingMD) | 20 | 16 | -4 | -20% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:17 |  |
| Spacing ramp sizeLG (paddingLG) | 24 | 16 | -8 | -33.3% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:16 |  |
| Spacing ramp sizeXL | 32 | 32 | 0 | 0% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:15 | HELD (compactSizeStep+6 = sizeStep+4) |
| Spacing ramp sizeXXL | 48 | 48 | 0 | 0% | antd@5.29.3 lib/theme/themes/compact/genCompactSizeMapToken.js:14 | HELD |
| List/menu row height (Menu itemHeight) | 40 | 35 | -5 | -12.5% | antd@5.29.3 lib/menu/style/index.js:442 | = controlHeightLG |
| List/menu row height (Dropdown/Select option) | 32 | 28 | -4 | -12.5% | antd@5.29.3 lib/select/style/token.js:50; dropdown/style/index.js:286 | Select optionHeight = controlHeight; Dropdown item = 2*paddingBlock(5->4)+fontHeight(22->20) |
| Menu/listbox inset (Dropdown menu padding) | 4 | 4 | 0 | 0% | antd@5.29.3 lib/dropdown/style/index.js:147,302 | HELD: paddingXXS |
| Menu/listbox inset (Select popup padding) | 4 | 4 | 0 | 0% | antd@5.29.3 lib/select/style/dropdown.js:45 | HELD: paddingXXS |
| Menu item margin inline/block (Menu) | 4 | 4 | 0 | 0% | antd@5.29.3 lib/menu/style/index.js:385,446 | HELD: marginXXS |
| Row horizontal padding (Menu itemPaddingInline) | 16 | 8 | -8 | -50% | antd@5.29.3 lib/menu/style/index.js:447 | = padding (halved) |
| Row horizontal padding (Dropdown/Select option) | 12 | 12 | 0 | 0% | antd@5.29.3 lib/select/style/token.js:47; dropdown/style/index.js:205 | HELD: controlPaddingHorizontal |
| Popover surface padding (innerPadding) | 12 | 12 | 0 | 0% | antd@5.29.3 lib/popover/style/index.js:144 | HELD: literal 12 |
| Popover title-content gap | 8 | 4 | -4 | -50% | antd@5.29.3 lib/popover/style/index.js:145 | marginXS |
| Modal content padding (block) | 20 | 16 | -4 | -20% | antd@5.29.3 lib/modal/style/index.js:295 | paddingMD |
| Modal content padding (inline) | 24 | 16 | -8 | -33.3% | antd@5.29.3 lib/modal/style/index.js:295 | paddingContentHorizontalLG |
| Modal footer margin-top | 12 | 8 | -4 | -33.3% | antd@5.29.3 lib/modal/style/index.js:303 |  |
| Card body/header padding | 24 | 16 | -8 | -33.3% | antd@5.29.3 lib/card/style/index.js:340-341 | paddingLG |
| Card header height | 56 | 38 | -18 | -32.1% | antd@5.29.3 lib/card/style/index.js:331 | fontSizeLG*lineHeightLG + 2*padding |
| Card body padding (size=small) | 12 | 12 | 0 | 0% | antd@5.29.3 lib/card/style/index.js:337 | HELD literal |
| Container corner radius (borderRadiusLG: modal, dropdown, popover) | 8 | 8 | 0 | 0% | antd@5.29.3 lib/theme/themes/compact/index.js (no radius change); seed.js:56; shared/genRadius.js | HELD |
| Control corner radius (borderRadius) | 6 | 6 | 0 | 0% | antd@5.29.3 lib/seed.js:56 | HELD |
| Table cell padding (default size) | 16 | 8 | -8 | -50% | antd@5.29.3 lib/table/style/index.js:216-217 | block and inline both = padding |
| Table cell padding block (middle size) | 12 | 8 | -4 | -33.3% | antd@5.29.3 lib/table/style/index.js:218 |  |
| Table cell padding inline (middle size) | 8 | 4 | -4 | -50% | antd@5.29.3 lib/table/style/index.js:219 |  |
| Table cell padding (small size) | 8 | 4 | -4 | -50% | antd@5.29.3 lib/table/style/index.js:220-221 |  |
| Table row height (default size) * | 54 | 36 | -18 | -33.3% | antd@5.29.3 lib/table/style/index.js:216 + fontHeight | 2*cellPaddingBlock + fontHeight; computed |
| Table row height (small size) * | 38 | 28 | -10 | -26.3% | antd@5.29.3 lib/table/style/index.js:220 + fontHeight | computed |
| List item padding (default) | 12 0 | 8 0 |  |  | antd@5.29.3 lib/list/style/index.js:318 | paddingContentVertical |
| List item padding (lg) | 16 24 | 12 16 |  |  | antd@5.29.3 lib/list/style/index.js:320 |  |
| Gap between grouped items (margin token) | 16 | 8 | -8 | -50% | antd@5.29.3 lib/theme/util/alias.js:114 | margin = size |
| Checkbox size (controlInteractiveSize) | 16 | 14 | -2 | -12.5% | antd@5.29.3 lib/theme/util/alias.js (controlInteractiveSize = controlHeight/2) |  |

## Material 3 via Angular Material (density -2)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| Button height | 40 | 32 | -8 | -20% | @angular/material@22.2.1 button/_m3-button.scss:161-168 | ladder 0..-3: 40,36,32,28 (-4/step); touch target hidden at <=-2 |
| Icon button state layer | 40 | 32 | -8 | -20% | @angular/material@22.2.1 button/_m3-icon-button.scss:52 | ladder 40,36,32,28,24,24 |
| Text field (form-field) height | 56 | 48 | -8 | -14.3% | @angular/material@22.2.1 form-field/_m3-form-field.scss:129 | ladder 56,52,48,44,40,36 |
| Text field vertical padding | 16 | 12 | -4 | -25% | @angular/material@22.2.1 form-field/_m3-form-field.scss:131 | ladder 16,14,12,10,8,6 (-2/step) |
| List row height one-line | 48 | 40 | -8 | -16.7% | @angular/material@22.2.1 list/_m3-list.scss:87-88 | ladder 48,44,40,36,32,24 |
| List row height two-line | 64 | 56 | -8 | -12.5% | @angular/material@22.2.1 list/_m3-list.scss:89-90 | ladder 64,60,56,52,48,48 |
| List leading icon start/end space | 16 | 8 | -8 | -50% | @angular/material@22.2.1 list/_m3-list.scss:85-86 | ladder 16,12,8,4,4,4 (-4/step) — the only horizontal spacing that densifies |
| Table row height | 52 | 44 | -8 | -15.4% | @angular/material@22.2.1 table/_m3-table.scss:50 | ladder 52,48,44,40,36 |
| Table header height | 56 | 48 | -8 | -14.3% | @angular/material@22.2.1 table/_m3-table.scss:48 |  |
| Chip height | 32 | 24 | -8 | -25% | @angular/material@22.2.1 chips/_m3-chip.scss:79 | ladder 32,28,24 (clamped at -2) |
| Tab height | 48 | 40 | -8 | -16.7% | @angular/material@22.2.1 tabs/_m3-tabs.scss:56 |  |
| Expansion header height (collapsed) | 48 | 40 | -8 | -16.7% | @angular/material@22.2.1 expansion/_m3-expansion.scss:58 |  |
| Checkbox state layer | 40 | 32 | -8 | -20% | @angular/material@22.2.1 checkbox/_m3-checkbox.scss:66 |  |
| Menu item height | (not density-scaled) | (not density-scaled) |  |  | @angular/material@22.2.1 menu/_m3-menu.scss:40 | HELD: density: () — menu has no density tokens |
| Select option height | (not density-scaled) | (not density-scaled) |  |  | @angular/material@22.2.1 core/option/_m3-option.scss:35 | HELD: density: () |
| Dialog padding | 24 (content 20 24) | 24 (content 20 24) |  |  | @angular/material@22.2.1 dialog/_m3-dialog.scss:18-26,45 | HELD: density: () |
| Card padding | (not density-scaled) | (not density-scaled) |  |  | @angular/material@22.2.1 card/_m3-card.scss:41 | HELD: density: () |
| Body type size * | (system typescale) | (unchanged) |  |  | @angular/material@22.2.1 core/density/private/_all-density.scss | density never touches typography |

## Material Components Web (MDC density mixins)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| Density interval | 4 | 4 | 0 | 0% | @material/*@14.0.0 density/_density.scss:27,111 | value = default + scale * 4px; scale is negative integer; only properties height,size,margin-top,margin-bottom,top (line 31) — padding, radius and type are never densified |
| Button height (scale -2) * | 36 | 28 | -8 | -22.2% | @material/*@14.0.0 button/_button-shared-theme.scss:44,51 | min 24 (scale -3) |
| Text field height (scale -2) * | 56 | 48 | -8 | -14.3% | @material/*@14.0.0 textfield/_variables.scss:98-99 | min 40 (scale -4); horizontal padding 16 held (line 102) |
| Data table row height (scale -2) * | 52 | 44 | -8 | -15.4% | @material/*@14.0.0 data-table/_data-table-theme.scss:69,74 | min 36; cell padding 16 held (lines 71-72) |
| List one-line item height (scale -2) * | 48 | 40 | -8 | -16.7% | @material/*@14.0.0 list/_evolution-variables.scss:15-19 | min 24; side padding 16 held (line 10) |
| Chip height (scale -2) * | 32 | 24 | -8 | -25% | @material/*@14.0.0 chips/_chip-theme.scss:44-45 | min 24 |
| Icon button size (scale -2) * | 48 | 40 | -8 | -16.7% | @material/*@14.0.0 icon-button/_icon-button-theme.scss:46-47 | min 28 |

## Adobe Spectrum (large scale -> medium scale)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| Body text size (font-size-100) | 17 | 14 | -3 | -17.6% | @adobe/spectrum-tokens@15.5.0 src/typography.json:212 | default = large/mobile set, compact = medium/desktop set |
| Small text size (font-size-75) | 15 | 12 | -3 | -20% | @adobe/spectrum-tokens@15.5.0 src/typography.json:452 | default = large/mobile set, compact = medium/desktop set |
| Large text size (font-size-200) | 19 | 16 | -3 | -15.8% | @adobe/spectrum-tokens@15.5.0 src/typography.json:324 | default = large/mobile set, compact = medium/desktop set |
| Line height multiplier (line-height-100) | 1.3 | 1.3 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/typography.json:515 | HELD multiplier |
| Line height px (line-height-font-size-100) | 22 | 18 | -4 | -18.2% | @adobe/spectrum-tokens@15.5.0 src/typography.json:525 | default = large/mobile set, compact = medium/desktop set |
| Control height s (component-height-75) | 30 | 24 | -6 | -20% | @adobe/spectrum-tokens@15.5.0 src/layout.json:933 | default = large/mobile set, compact = medium/desktop set |
| Control height m (component-height-100) | 40 | 32 | -8 | -20% | @adobe/spectrum-tokens@15.5.0 src/layout.json:837 | default = large/mobile set, compact = medium/desktop set |
| Control height l (component-height-200) | 50 | 40 | -10 | -20% | @adobe/spectrum-tokens@15.5.0 src/layout.json:853 | default = large/mobile set, compact = medium/desktop set |
| Control height xl (component-height-300) | 60 | 48 | -12 | -20% | @adobe/spectrum-tokens@15.5.0 src/layout.json:869 | default = large/mobile set, compact = medium/desktop set |
| Control horizontal padding m (component-edge-to-text-100) | 15 | 12 | -3 | -20% | @adobe/spectrum-tokens@15.5.0 src/layout.json:552 | default = large/mobile set, compact = medium/desktop set |
| Control horizontal padding s (component-edge-to-text-75) | 11 | 9 | -2 | -18.2% | @adobe/spectrum-tokens@15.5.0 src/layout.json:628 | default = large/mobile set, compact = medium/desktop set |
| Pill control padding (component-pill-edge-to-text-100) | 20 | 16 | -4 | -20% | @adobe/spectrum-tokens@15.5.0 src/layout.json:1044 | default = large/mobile set, compact = medium/desktop set |
| Control top-to-text (component-top-to-text-100) | 8 | 6 | -2 | -25% | @adobe/spectrum-tokens@15.5.0 src/layout.json:1368 | default = large/mobile set, compact = medium/desktop set |
| Icon size m (workflow-icon-size-100) | 24 | 20 | -4 | -16.7% | @adobe/spectrum-tokens@15.5.0 src/layout.json:3788 | default = large/mobile set, compact = medium/desktop set |
| Icon size s (workflow-icon-size-75) | 18 | 16 | -2 | -11.1% | @adobe/spectrum-tokens@15.5.0 src/layout.json:3856 | default = large/mobile set, compact = medium/desktop set |
| Icon-label gap m (text-to-visual-100) | 8 | 6 | -2 | -25% | @adobe/spectrum-tokens@15.5.0 src/layout.json:3517 | default = large/mobile set, compact = medium/desktop set |
| Icon-label gap s (text-to-visual-75) | 7 | 5 | -2 | -28.6% | @adobe/spectrum-tokens@15.5.0 src/layout.json:3612 | default = large/mobile set, compact = medium/desktop set |
| Generic spacing ramp (spacing-75/100/200/300/400) | 4/8/12/16/24 | 4/8/12/16/24 |  |  | @adobe/spectrum-tokens@15.5.0 src/layout.json:3289-3344 | HELD: spacing-* identical in both scales |
| Menu item height * | 40 | 32 |  |  | @adobe/spectrum-tokens@15.5.0 src/layout.json:837 (component-height-100) | menu item min-height uses component-height-100 (assumed from Spectrum CSS, not read here) |
| Menu item edge-to-content (unselected, m) | 42 | 32 | -10 | -23.8% | @adobe/spectrum-tokens@15.5.0 src/menu.json:156 | default = large/mobile set, compact = medium/desktop set |
| Popover surface padding (popover-edge-to-content-area) | 8 | 8 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/popover.json:46 | HELD |
| Card edge-to-content (default, m) | 16 | 16 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/card.json:125 | HELD |
| Container corner radius (corner-radius-medium-default) | 8 | 8 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/layout.json:1718 | HELD |
| Control corner radius (corner-radius-100) | 4 | 4 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/layout.json:1653 | HELD |
| Large container radius (corner-radius-800) | 16 | 16 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/layout.json:1698 | HELD |
| Table row height medium-regular | 50 | 40 | -10 | -20% | @adobe/spectrum-tokens@15.5.0 src/table.json:1040 | default = large/mobile set, compact = medium/desktop set |
| Table cell padding (table-item-padding-regular) | 12 | 12 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/table.json:26 | HELD across scales |
| Table edge-to-content | 16 | 16 | 0 | 0% | @adobe/spectrum-tokens@15.5.0 src/table.json:188 | HELD |
| Side nav item-to-item gap | 5 | 4 | -1 | -20% | @adobe/spectrum-tokens@15.5.0 src/side-navigation.json:145 | default = large/mobile set, compact = medium/desktop set |
| Tree view min row height | 50 | 40 | -10 | -20% | @adobe/spectrum-tokens@15.5.0 src/tree-view.json:230 | default = large/mobile set, compact = medium/desktop set |
| List view min row height | 50 | 40 | -10 | -20% | @adobe/spectrum-tokens@15.5.0 src/list-view.json:34 | default = large/mobile set, compact = medium/desktop set |
| Tab item height (m) | 60 | 48 | -12 | -20% | @adobe/spectrum-tokens@15.5.0 src/tabs.json:302 | default = large/mobile set, compact = medium/desktop set |

## Adobe Spectrum table density (regular -> compact, desktop scale)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| Table row height medium | 40 | 32 | -8 | -20% | @adobe/spectrum-tokens@15.5.0 src/table.json:1034,1040 | component-level density, not a system switch |
| Table row height small | 32 | 24 | -8 | -25% | @adobe/spectrum-tokens@15.5.0 src/table.json:1094,1100 |  |
| Table cell padding | 12 | 8 | -4 | -33.3% | @adobe/spectrum-tokens@15.5.0 src/table.json:26,277 |  |

## Carbon (data table size lg -> sm / xs)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| Table row height (lg default -> sm) | 48 | 32 | -16 | -33.3% | @carbon/styles@1.116.0 scss/components/data-table/_data-table.scss:147,672 | per-component size prop, no system density switch |
| Table row height (lg default -> xs) | 48 | 24 | -24 | -50% | @carbon/styles@1.116.0 scss/components/data-table/_data-table.scss:147,630 | per-component size prop, no system density switch |
| Table cell padding inline | 16 | 16 | 0 | 0% | @carbon/styles@1.116.0 scss/components/data-table/_data-table.scss:91,242 | HELD across sizes ($spacing-05) |

## Carbon (size scale)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| Control height ladder xs/sm/md/lg/xl * | 24/32/40/48/64 | n/a |  |  | px | @carbon/layout@11.60.0 scss/generated/_size.scss:12-16 |

## Primer (normal -> condensed)

| Role | Default | Compact | Step | % | Source | Note |
|---|---|---|---|---|---|---|
| Control horizontal padding (medium) | 12 | 8 | -4 | -33.3% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:23-24 | condensed/normal are sibling tokens chosen per component, not a global switch |
| Control horizontal padding (xsmall) | 8 | 4 | -4 | -50% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:41-42 | condensed/normal are sibling tokens chosen per component, not a global switch |
| Control height (medium) | 32 | 32 | 0 | 0% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:26 | HELD: no condensed control height; size picked via size axis (xsmall 24 / small 28 / medium 32 / large 40) |
| Overlay (popover/dialog) padding | 16 | 8 | -8 | -50% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:55-56 | condensed/normal are sibling tokens chosen per component, not a global switch |
| Overlay padding block | 12 | 4 | -8 | -66.7% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:57-58 | condensed/normal are sibling tokens chosen per component, not a global switch |
| Stack gap | 16 | 8 | -8 | -50% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:62-63 | condensed/normal are sibling tokens chosen per component, not a global switch |
| Stack padding | 16 | 8 | -8 | -50% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:65-66 | condensed/normal are sibling tokens chosen per component, not a global switch |
| Control stack gap (grouped controls) | 8 | 8 | 0 | 0% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:46,48,49 | HELD |
| Overlay radius | 6 | 6 | 0 | 0% | @primer/primitives@11.10.0 dist/css/functional/size/size.css:54 | HELD (no condensed variant) |
| Control stack gap: coarse (touch) -> fine (mouse), medium | 12 | 8 | -4 | -33.3% | @primer/primitives@11.10.0 dist/css/functional/size/size-coarse.css:5; size-fine.css:5 | global via pointer media query |
| Min target: coarse -> fine | 44 | 16 | -28 | -63.6% | @primer/primitives@11.10.0 dist/css/functional/size/size-coarse.css:3; size-fine.css:3 | global via pointer media query |

## Scope notes

- Only **antd** (`theme.compactAlgorithm`) and **Angular Material M3** (`density` in `mat.theme`, applied to every component's density tokens) are true system-wide density switches. MDC exposes per-component density mixins with one shared rule. Material Web (`@material/web@2.5.0`) has **no** density tokens (data-table token file notes density tokens are not yet supported).
- Spectrum medium vs large is a **platform scale** (desktop vs touch), not a density mode; it is a useful ratio for a whole-system step but is larger than a density step. Spectrum, Carbon and Primer also have *component-local* density (table compact/regular/spacious, Carbon size props, Primer condensed/normal tokens).
- Fluent 2 (`@fluentui/tokens`) and Atlassian were not extracted: neither ships a system-wide density token set in the packages checked; not pursued further.

## Patterns

| Role | antd compact | Material -2 | Spectrum L->M | Primer condensed | Carbon | Typical |
|---|---|---|---|---|---|---|
| Control height md | 32->28 (-12.5%) | 40->32 (-20%) | 40->32 (-20%) | held 32 | (size prop) | shrink 12-20%, 4-8px |
| List/menu row | menu 40->35 (-12.5%); option 32->28 | list 48->40 (-17%); **menu held** | 40->32 (-20%) | – | – | shrink, but M3 holds menu items |
| Table row | 54->36 (-33%)* | 52->44 (-15%) | 50->40 (-20%); regular->compact 40->32 | – | 48->32 (-33%) | shrink 15-33% |
| Control h-padding | **held 12** (button 15->11) | held (never densified) | 15->12 (-20%) | 12->8 (-33%) | held 16 (cells) | split: half the systems hold |
| Generic spacing ramp | 16->8, 24->16, 12->8, 8->4 (-33..-50%); XL/XXL held | n/a | **held** | 16->8 (-50%) | – | disagree strongly |
| Icon-label gap | 8->4 (-50%) | list icon space 16->8 | 8->6 (-25%) | – | – | shrink 25-50% |
| Menu/listbox inset | **held 4** | – | – | – | – | held |
| Popover padding | **held 12** | – | **held 8** | 16->8 (overlay) | – | mostly held |
| Dialog/modal padding | 24->16 inline, 20->16 block | **held 24** | – | 16->8 (overlay) | – | disagree |
| Card padding | 24->16 (-33%); small card held 12 | held | **held 16** | – | – | mostly held |
| Radius (control & container) | held 6/8 | not density | held 4/8/16 | held 6 | – | **always held** |
| Body type | 14->12 (-14%), line box 22->20 | held | 17->14 (scale, not density) | held | held | held in density modes except antd |
| Icon size | 12->10 (antd icon token), menu icon 14->12 | held | 24->20 (-17%) | – | – | usually held in density modes |

Observations:
1. Heights are the one role every system shrinks. Absolute steps are 4px (antd controlHeight, Material per-step) or 8px (Material -2, Spectrum, Carbon one size down). Relative: 12.5-20% for controls, 15-33% for table rows.
2. Material's rule is explicit: density only changes height/size/margin-top/margin-bottom/top in 4px steps (`density/_density.scss:27,31,111`); padding, radius and type never move. antd is the opposite extreme: it halves most of the spacing ramp and drops body text 14->12.
3. Radius is held by every system.
4. Surface insets (menu inset, popover padding) are held in antd and Spectrum; dialog padding is held by Material, shrunk by antd (24->16) and Primer condensed (16->8).
5. Within-component padding that sits next to text (control padding, option padding) is held by antd (literal 12) and Material, shrunk by Spectrum and Primer. No consensus.
6. antd produces non-integer/odd heights (controlHeightSM 21, LG 35) because it scales by ratio after the -4 step.
